import { tickEquity } from '../accounts/live-pnl.js';
import { API, TRADE_DRAW_MS, _fetch } from '../config.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { saveTrade, store } from '../core/settings.js';
import { applySymbolRules, priceOf, symLabel, unwatchUnused } from './prices.js';
import { S, SYMBOLS } from '../state.js';
import { checkPlans } from '../trade/breakeven-plans.js';
import { stopPick } from '../trade/chart-pick.js';
import { renderTrade, updateTrade } from '../trade/view.js';
import { _root } from '../ui/panel.js';

// The Trade tab trades the market Vest is showing: the page address is /trade/<display name> ("ES-PERP"), which Vest
// also keeps as "last-market". Display names map to symbols (ES-PERP → SPX-USD-PERP) through Vest's exchange info,
// read once (it also loads every market's tick, size step, fees and margin). Each market keeps its own size, stop and
// targets: points mean different money on ES and NQ.
const MARKETS_KEY = 'vc-trade-markets';
let _displayMap = null,
  _displayMapAt = 0;
async function loadDisplayMap() {
  if (_displayMap || Date.now() - _displayMapAt < 30000) return _displayMap;
  _displayMapAt = Date.now();
  try {
    const r = await (await _fetch(`${API}/v3/exchangeInfo`)).json();
    const m = {};
    for (const x of r.symbols || [])
      if (x && x.symbol) {
        m[String(x.displaySymbol || x.symbol).toUpperCase()] = x.symbol;
        m[x.symbol.toUpperCase()] = x.symbol;
        applySymbolRules(x);
      }
    if (Object.keys(m).length) _displayMap = m;
  } catch {
    /* best effort: nothing to do if this fails */
  }
  return _displayMap;
}
function vestMarketName() {
  const m = location.pathname.match(/^\/trade\/([^/?#]+)/);
  if (m) return decodeURIComponent(m[1]).toUpperCase();
  try {
    const l = localStorage.getItem('last-market');
    return l ? l.toUpperCase() : null;
  } catch {
    return null;
  }
}
let _following = false;
export async function followVestMarket() {
  if (_following || !S.tradeOpen) return;
  _following = true;
  try {
    const name = vestMarketName();
    const map = name && (await loadDisplayMap());
    const sym = map && map[name];
    if (sym && sym !== S.trade.symbol && SYMBOLS[sym] && !S.placing && !S.adjusting) switchMarket(sym);
  } finally {
    _following = false;
  }
}
export const startFollowingVestMarket = () => setInterval(followVestMarket, 1000);
// A market's saved settings, keeping only well-formed values (storage can hold anything).
export function cleanMarket(m) {
  if (!m || typeof m !== 'object') return null;
  const out = {},
    ok = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  for (const k of ['qty', 'risk', 'stopPts', 'beTrigger', 'beOffset']) if (ok(m[k])) out[k] = m[k];
  if (['qty', 'risk', 'max'].includes(m.sizeMode)) out.sizeMode = m.sizeMode;
  if (['even', 'start', 'end'].includes(m.scale)) out.scale = m.scale;
  if (Array.isArray(m.targets) && m.targets.length && m.targets.every((x) => ok(+x) && +x > 0))
    out.targets = m.targets.map(Number);
  return out;
}
function switchMarket(sym) {
  const prev = S.trade.symbol,
    all = store.get(MARKETS_KEY, {}) || {};
  const t = S.trade;
  all[prev] = {
    sizeMode: t.sizeMode,
    qty: t.qty,
    risk: t.risk,
    stopPts: t.stopPts,
    targets: [...t.targets],
    scale: t.scale,
    beTrigger: t.beTrigger,
    beOffset: t.beOffset,
  };
  const saved = cleanMarket(all[sym]);
  stopPick(true);
  S.addPick = null;
  t.symbol = sym;
  if (saved) Object.assign(t, saved);
  store.set(MARKETS_KEY, all);
  saveTrade();
  logEvent(
    saved ? 'info' : 'warn',
    `Trade tab: now ${symLabel(sym)}, the market Vest is showing.${saved ? '' : ` Its stop and targets are in ${symLabel(sym)} points, carried over from ${symLabel(prev)}: check them before trading.`}`,
  );
  diag('trade_panel', { outcome: 'market', from: prev, to: sym, saved: !!saved });
  const body = _root && _root.querySelector('.body');
  if (body && body.dataset.view === 'trade') {
    body.dataset.view = ''; // rebuild: the inputs and the number of targets may differ
    renderTrade(body);
  }
  unwatchUnused();
}
// The book's price grouping a depth subscription names (Vest's first tick size for the market, e.g. "0.25").
export const depthTickOf = (sym) => (SYMBOLS[sym] && (SYMBOLS[sym].depthTick || String(SYMBOLS[sym].tick))) || '0.25';
export function onPrice(sym) {
  const px = priceOf(sym);
  if (!(px > 0)) return;
  try {
    checkPlans(sym, px);
  } catch (e) {
    diag('breakeven', { outcome: 'error', error: e.message });
  }
  try {
    tickEquity(sym);
  } catch {
    /* best effort: nothing to do if this fails */
  }
  drawTradeSoon();
}
// The book and trades can move many times a second: the Trade tab redraws at most every TRADE_DRAW_MS.
let _tradeDrawAt = 0,
  _tradeDrawTimer = null;
export function drawTradeSoon() {
  if (!S.tradeOpen || _tradeDrawTimer) return;
  const wait = TRADE_DRAW_MS - (Date.now() - _tradeDrawAt);
  const draw = () => {
    _tradeDrawTimer = null;
    _tradeDrawAt = Date.now();
    updateTrade();
  };
  if (wait <= 0) draw();
  else _tradeDrawTimer = setTimeout(draw, wait);
}
