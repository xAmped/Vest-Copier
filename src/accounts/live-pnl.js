import { _lastFullRead, refreshBalances, refreshSoon, revalue, stateFresh } from './registry.js';
import { BALANCE_POLL_MS, FEED_BACKSTOP_MS, LIVE_RENDER_MS } from '../config.js';
import { priceOf } from '../market/prices.js';
import { S } from '../state.js';
import { _pointerDown, currentView } from '../ui/panel.js';
import { render } from '../ui/render.js';
import { feedLive } from '../vest/account-feed.js';
import { api } from '../vest/api.js';

// Live P&L between reads. Cash and positions only change when something fills, so each price tick just re-prices the
// open positions from the last read: equity = cash + open PnL at the latest price, as Vest's own Account Value moves.
// When the price crosses one of a position's own stops or targets, Vest is about to fill it: read again right away.
export const heldSymbols = () => [
  ...new Set(Object.values(S.acctState || {}).flatMap((st) => (st ? st.positions.map((p) => p.symbol) : []))),
];
let _liveRenderAt = 0,
  _liveRenderTimer = null;
// A stop or target the price sits past without Vest filling it (a stop triggers on the bid, not the mark) would ask
// for a read on every new state: at most one per account per CROSSED_COOLDOWN_MS. State older than LIVE_STALE_MS
// (reads failing) isn't re-priced: its positions may be gone.
export const CROSSED_COOLDOWN_MS = 15000,
  LIVE_STALE_MS = 60000,
  _crossedAt = {};
export function tickEquity(sym) {
  let changed = false;
  for (const id in S.acctState) {
    const st = S.acctState[id];
    if (!S.byId[id] || !st || !st.positions.some((p) => p.symbol === sym) || !stateFresh(st)) continue;
    // Without the live feed: when the price crosses one of a position's own stops or targets, Vest is about to fill
    // it, so read again soon (once, not on every tick).
    const px = priceOf(sym);
    if (!feedLive() && px > 0 && !st.crossed)
      for (const p of st.positions) {
        const dir = p.side === 'long' ? 1 : -1;
        if (
          p.symbol === sym &&
          (p.triggers || []).some((t) => (t.kind === 'sl' ? dir * (px - t.price) <= 0 : dir * (px - t.price) >= 0))
        ) {
          st.crossed = true;
          if (!(Date.now() - (_crossedAt[id] || 0) < CROSSED_COOLDOWN_MS)) {
            _crossedAt[id] = Date.now();
            refreshSoon();
          }
          break;
        }
      }
    if (revalue(id)) changed = true;
  }
  if (changed) liveRender();
}
// Redraw the Accounts or P&L list with the live numbers, at most every LIVE_RENDER_MS, and never between a press and its
// release (the redraw would swallow the click). The Trade tab updates itself on every tick already.
export function liveRender() {
  const view = currentView();
  if (view !== 'accounts' && view !== 'summary') return;
  const wait = LIVE_RENDER_MS - (Date.now() - _liveRenderAt);
  if (_pointerDown || wait > 0) {
    if (!_liveRenderTimer)
      _liveRenderTimer = setTimeout(() => ((_liveRenderTimer = null), liveRender()), Math.max(wait, 200));
    return;
  }
  _liveRenderAt = Date.now();
  render();
}
// keep balances / room fresh
let _balTimer = null;
export function startBalancePoll() {
  if (_balTimer) clearInterval(_balTimer);
  _balTimer = setInterval(() => {
    if (feedLive() && Date.now() - _lastFullRead < FEED_BACKSTOP_MS) return; // the feed is carrying every change
    refreshBalances();
  }, BALANCE_POLL_MS);
}

// Every account's saved per-symbol leverage, in one call (GET /v3/user-state, user token). null if it can't be read.
export async function fetchLeverages() {
  try {
    const r = await api('/v3/user-state');
    const out = {};
    for (const a of r.accounts || []) {
      out[a.accountId] = {};
      for (const l of a.leverages || []) out[a.accountId][l.symbol] = l.leverage;
    }
    return out;
  } catch {
    return null;
  }
}
export const levFor = (levs, id, sym) => (levs && levs[id] && levs[id][sym] != null ? +levs[id][sym] : null);
