import { LOCKED_MSG } from '../copier/selection.js';
import { logEvent, toast } from './activity-log.js';
import { diag } from './diagnostics.js';
import { cleanMarket } from '../market/vest-market.js';
import { S, SYMBOLS } from '../state.js';
import { render } from '../ui/render.js';

// Saved settings, in this site's localStorage.
// Everything is kept in this site's localStorage, wrapped in try/catch: a private window or full storage just means
// nothing is remembered.
export const LOG_KEY = 'vc-activity-log',
  ACK_KEY = 'vc-ack',
  SIZE_KEY = 'vc-size',
  OPTS_KEY = 'vc-opts',
  TRADE_KEY = 'vc-trade';
export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
export function persistLog() {
  store.set(
    LOG_KEY,
    S.log.map((e) => ({ t: e.t.toISOString(), level: e.level, msg: e.msg })),
  );
}
export function loadLog() {
  const l = store.get(LOG_KEY, []);
  S.log = Array.isArray(l)
    ? l
        .filter((e) => e && typeof e.msg === 'string' && !isNaN(new Date(e.t)))
        .map((e) => ({ t: new Date(e.t), level: String(e.level || 'info'), msg: e.msg }))
    : [];
}
// The risk acknowledgement is versioned: raising TERMS_VERSION asks everyone to accept the new terms once.
export const TERMS_VERSION = 2;
export function loadAck() {
  const a = store.get(ACK_KEY, null);
  S.ack = !!(a && typeof a === 'object' && a.v >= TERMS_VERSION);
}
export function saveAck() {
  store.set(ACK_KEY, { v: TERMS_VERSION, at: new Date().toISOString() });
}
export function loadOpts() {
  const o = store.get(OPTS_KEY, {}) || {};
  S.fast = !!o.fast;
  S.autoFlatten = !!o.autoFlatten;
  S.capFit = !!o.capFit;
  S.checkUpdates = o.checkUpdates !== false; // on by default
  S.hideMarks = o.hideMarks !== false; // on by default: Vest's buy/sell marks come back on every load otherwise
  S.tradeOnly = o.tradeOnly !== false; // the panel shows on Vest's Trade page only (it runs on every page)
  S.hideSessions = o.hideSessions !== false; // Vest's pre-market / after-hours / overnight bands on the chart
  S.theme = o.theme !== false; // STRATUH colours for Vest's own page and chart (on by default; introduced once)
  S.themeDown = o.themeDown === 'red' ? 'red' : 'mono'; // shorts and losses on Vest's page: grey (DeepCharts) or red
}
export function saveOpts() {
  const o = {
    fast: S.fast,
    autoFlatten: S.autoFlatten,
    capFit: S.capFit,
    checkUpdates: S.checkUpdates,
    hideMarks: S.hideMarks,
    hideSessions: S.hideSessions,
    tradeOnly: S.tradeOnly,
    theme: S.theme,
    themeDown: S.themeDown,
  };
  diag('settings', o);
  store.set(OPTS_KEY, o);
}
export function loadTrade() {
  const t = store.get(TRADE_KEY, null);
  if (!t || typeof t !== 'object') return;
  // only well-formed values come back (storage can hold anything); "anchor" (removed in v0.31.0) is dropped this way too
  Object.assign(S.trade, cleanMarket(t), {
    symbol: SYMBOLS[t.symbol] ? t.symbol : S.trade.symbol, // another market comes back via followVestMarket
    ...(['off', 'tp1', 'points'].includes(t.beMode) ? { beMode: t.beMode } : {}),
  });
}
export function saveTrade() {
  store.set(TRADE_KEY, S.trade);
}
export function toggleFast() {
  S.fast = !S.fast;
  saveOpts();
  logEvent('info', S.fast ? 'Fast mode on — follower entries fire the instant the master sends.' : 'Fast mode off.');
  render();
}
export function toggleAutoFlatten() {
  S.autoFlatten = !S.autoFlatten;
  saveOpts();
  logEvent('info', S.autoFlatten ? 'Auto-flatten on.' : 'Auto-flatten off (you will be asked).');
  render();
}
export function toggleCapFit() {
  if (S.armed || S.arming) return toast(LOCKED_MSG);
  S.capFit = !S.capFit;
  saveOpts();
  if (!S.capFit && S.master) {
    // strict 1:1 can't hold different-size followers
    const g = S.byId[S.master].groupKey;
    let pruned = 0;
    [...S.followers].forEach((f) => {
      if (S.byId[f].groupKey !== g) {
        S.followers.delete(f);
        pruned++;
      }
    });
    if (pruned) {
      S.armed = false;
      logEvent(
        'info',
        `Cap-to-fit off — removed ${pruned} different-size follower(s); strict 1:1 needs the same size.`,
      );
    }
  }
  logEvent(
    'info',
    S.capFit
      ? 'Cap-to-fit on — each follower is sized to its own equity; different-size followers allowed.'
      : 'Cap-to-fit off — strict 1:1 size, same-size followers only.',
  );
  render();
}
