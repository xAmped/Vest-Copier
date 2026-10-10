import { heldSymbols } from '../accounts/live-pnl.js';
import { API, _fetch } from '../config.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { depthTickOf, onPrice } from './vest-market.js';
import { S, SYMBOLS } from '../state.js';
import { parseJson } from '../vest/request-hooks.js';

// Live prices from Vest's public market socket, and each market's order rules.
// Vest's public socket streams, per market: `@ticker` (mark and margin mark price, about every 750 ms), `@depth_<tick>`
// (the order book: best bid and ask on every change) and `@trades` (every trade as it prints). The price the copier uses
// is Vest's own reference: the book's mid (open P&L, fail prices and targets are all measured on it), else the last
// trade, else the mark. Stops trigger on the bid (longs) or ask (shorts), so breakeven is checked against those. This is
// the copier's own read-only connection, open only while something needs a price (the Trade tab, breakeven, an open
// position's P&L). A socket that goes quiet is closed and reopened, with backoff.
const WS_URL = 'wss://ws.hz.vestmarkets.com/ws?version=1.0';
const WS_CONNECTING = 0,
  WS_OPEN = 1;
const PRICE_STALE_MS = 5000,
  WS_PING_MS = 25000,
  WS_RETRY_MIN_MS = 1000,
  WS_RETRY_MAX_MS = 30000;
const _wsSyms = new Set();
let _ws = null,
  _wsPing = null,
  _wsDog = null,
  _wsRetryTimer = null,
  _wsRetry = WS_RETRY_MIN_MS,
  _wsLastMsg = 0,
  _feedWarned = false;
export const recentAt = (at) => at > 0 && Date.now() - at < PRICE_STALE_MS;
export const priceOf = (sym) => {
  const p = S.price[sym];
  if (!p) return null;
  if (recentAt(p.bookAt)) return (p.bid + p.ask) / 2;
  if (recentAt(p.lastAt)) return p.last;
  return recentAt(p.at) ? p.px : null;
};
// The price a stop on this side triggers on: the best bid for a long, the best ask for a short (null without a live book).
export const stopRefOf = (sym, side) => {
  const p = S.price[sym];
  return p && recentAt(p.bookAt) ? (side === 'long' ? p.bid : p.ask) : null;
};
// The price Vest values a new market order's margin at (its ticker's margin mark price), else the mark price.
export const marginPriceOf = (sym) => {
  const px = priceOf(sym);
  return px && S.price[sym].mpx > 0 && recentAt(S.price[sym].at) ? S.price[sym].mpx : px;
};
export function watchPrice(sym) {
  if (_wsSyms.has(sym)) return;
  _wsSyms.add(sym);
  connectPrices();
  fetchPriceOnce(sym);
}
// Stop streaming symbols nothing needs any more, and close the socket when none are left.
export function unwatchUnused() {
  const need = new Set(Object.values(S.plans || {}).map((p) => p.symbol));
  if (S.tradeOpen) need.add(S.trade.symbol);
  for (const sym of heldSymbols()) need.add(sym); // live P&L of every open position
  for (const sym of [..._wsSyms]) if (!need.has(sym)) _wsSyms.delete(sym);
  if (_wsSyms.size) return;
  clearTimeout(_wsRetryTimer);
  _wsRetryTimer = null;
  stopWsTimers();
  const ws = _ws;
  _ws = null;
  if (ws)
    try {
      ws.close();
    } catch {
      /* best effort: nothing to do if this fails */
    }
}
function stopWsTimers() {
  clearInterval(_wsPing);
  clearInterval(_wsDog);
  _wsPing = _wsDog = null;
}
function scheduleReconnect() {
  if (!_wsSyms.size || _wsRetryTimer) return;
  _wsRetryTimer = setTimeout(() => {
    _wsRetryTimer = null;
    connectPrices();
  }, _wsRetry);
  _wsRetry = Math.min(_wsRetry * 2, WS_RETRY_MAX_MS);
}
function connectPrices() {
  if (!_wsSyms.size || _wsRetryTimer) return;
  if (_ws && _ws.readyState === WS_OPEN) return subscribePrices();
  if (_ws && _ws.readyState === WS_CONNECTING) return;
  let ws;
  try {
    ws = _ws = new WebSocket(WS_URL);
  } catch {
    return scheduleReconnect();
  }
  ws.onopen = () => {
    if (ws !== _ws) return;
    _wsLastMsg = Date.now();
    subscribePrices();
    stopWsTimers();
    _wsPing = setInterval(() => {
      try {
        ws.send(JSON.stringify({ method: 'PING', params: [], id: Date.now() }));
      } catch {
        /* best effort: nothing to do if this fails */
      }
    }, WS_PING_MS);
    _wsDog = setInterval(() => {
      // quiet for 3× the staleness limit: reconnect
      if (Date.now() - _wsLastMsg < 3 * PRICE_STALE_MS) return;
      if (Object.keys(S.plans || {}).length && !_feedWarned) {
        _feedWarned = true;
        logEvent('warn', 'Live price feed lost — breakeven is paused until it reconnects.');
      }
      try {
        ws.close();
      } catch {
        /* best effort: nothing to do if this fails */
      }
      if (ws === _ws) {
        _ws = null;
        stopWsTimers();
        scheduleReconnect();
      }
    }, PRICE_STALE_MS);
  };
  ws.onmessage = (e) => {
    if (ws !== _ws) return;
    _wsLastMsg = Date.now();
    _wsRetry = WS_RETRY_MIN_MS; // the backoff resets only once the feed actually delivers
    const m = parseJson(e.data, null);
    if (!m || typeof m.channel !== 'string' || !m.data) return;
    const [sym, kind = ''] = m.channel.split('@');
    if (kind === 'ticker') {
      const px = parseFloat(m.data.markPrice);
      if (!(px > 0)) return;
      if (_feedWarned) {
        _feedWarned = false;
        logEvent('info', 'Live price feed back.');
      }
      const p = (S.price[m.data.symbol || sym] = S.price[m.data.symbol || sym] || {});
      const mpx = parseFloat(m.data.marginMarkPrice);
      Object.assign(p, { px, mpx: mpx > 0 ? mpx : null, at: Date.now() });
      onPrice(m.data.symbol || sym);
    } else if (kind.startsWith('depth')) {
      const b = (m.data.bids || [])[0],
        a = (m.data.asks || [])[0];
      const bid = b ? parseFloat(b[0]) : NaN,
        ask = a ? parseFloat(a[0]) : NaN;
      if (!(bid > 0 && ask >= bid)) return; // a one-sided or crossed book is no reference
      Object.assign((S.price[sym] = S.price[sym] || {}), { bid, ask, bookAt: Date.now() });
      onPrice(sym);
    } else if (kind === 'trades') {
      const list = Array.isArray(m.data) ? m.data : [m.data];
      const t = list.reduce((x, y) => (y && (!x || +y.time >= +x.time) ? y : x), null);
      const px = t ? parseFloat(t.price) : NaN;
      if (!(px > 0)) return;
      Object.assign((S.price[sym] = S.price[sym] || {}), { last: px, lastAt: Date.now() });
      onPrice(sym);
    }
  };
  ws.onclose = () => {
    if (ws !== _ws) return;
    _ws = null;
    stopWsTimers();
    scheduleReconnect();
  };
}
function subscribePrices() {
  try {
    const params = [..._wsSyms].flatMap((s) => [`${s}@ticker`, `${s}@depth_${depthTickOf(s)}`, `${s}@trades`]);
    _ws.send(JSON.stringify({ method: 'SUBSCRIBE', params, id: Date.now() }));
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
async function fetchPriceOnce(sym) {
  // REST fallback so the tab has a price immediately
  try {
    const r = await (await _fetch(`${API}/v3/ticker/latest?symbols=${encodeURIComponent(sym)}`)).json();
    const t = (r.tickers || []).find((x) => x.symbol === sym);
    const px = t ? parseFloat(t.markPrice) : NaN,
      mpx = t ? parseFloat(t.marginMarkPrice) : NaN;
    if (px > 0 && !priceOf(sym)) {
      Object.assign((S.price[sym] = S.price[sym] || {}), { px, mpx: mpx > 0 ? mpx : null, at: Date.now() });
      onPrice(sym);
    }
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
// Tick, size step and margin ratios from exchangeInfo. A market's `capitalInitMarginRatio` that is absent means "not
// listed, use the funded ratio"; present but null means "no capital-account ratio". Vest's leverage rule depends on
// that difference, so `undefined` is kept rather than normalised to null (see maxLeverageFor).
// Every market's rules, loaded once at startup (one public call). The copier needs each market's size step: scaled
// follower sizes (cap-to-fit, proportional reduces/adds, sized legs) are rounded to it, and 16 of Vest's markets trade
// in coarser sizes than NQ (whole units, or 2–3 decimals).
export async function loadAllSymbolRules() {
  try {
    const r = await (await _fetch(`${API}/v3/exchangeInfo`)).json();
    (r.symbols || []).forEach(applySymbolRules);
    diag('market_rules', { outcome: 'loaded', markets: Object.keys(SYMBOLS).length });
  } catch (e) {
    diag('market_rules', { outcome: 'error', error: e.message }); // sizes fall back to NQ's step until a reload
  }
}
export async function loadSymbolRules(sym) {
  try {
    const r = await (await _fetch(`${API}/v3/exchangeInfo?symbols=${encodeURIComponent(sym)}`)).json();
    const x = (r.symbols || []).find((s) => s.symbol === sym);
    if (x) applySymbolRules(x);
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
export function applySymbolRules(x) {
  try {
    const sym = x && x.symbol;
    if (!sym) return;
    const tick = parseFloat(x.minTickSize || x.defaultTickSize),
      step = Math.pow(10, -+x.sizeDecimals);
    if (!(tick > 0 && step > 0)) return;
    const ratio = (v) => (v == null || v === '' ? null : parseFloat(v));
    const margin = {
      initMarginRatio: ratio(x.initMarginRatio),
      capitalInitMarginRatio: x.capitalInitMarginRatio === undefined ? undefined : ratio(x.capitalInitMarginRatio),
      fundedInitMarginRatio: ratio(x.fundedInitMarginRatio),
      capitalPlans: (x.capitalPlans || []).map((c) => ({
        accountType: c.accountType,
        planId: c.planId,
        initMarginRatio: ratio(c.initMarginRatio),
      })),
    };
    const label = (x.displaySymbol || sym).replace(/-PERP$/, '');
    // pointValue: Vest's perps are linear (notional = price × quantity), so one point is $1 per contract
    SYMBOLS[sym] = {
      ...(SYMBOLS[sym] || {}),
      depthTick: Array.isArray(x.tickSizes) && x.tickSizes.length ? String(x.tickSizes[0]) : String(x.minTickSize),
      tick,
      step: +step.toFixed(+x.sizeDecimals),
      label,
      pointValue: 1,
      takerFee: parseFloat(x.takerFee) || 0, // fraction of notional per fill (NQ 0.000025)
      margin,
    };
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
export const symLabel = (sym) => (SYMBOLS[sym] && SYMBOLS[sym].label) || String(sym).replace(/-USD-PERP$|-PERP$/, '');
