// Build-wide constants: the API host, the debug switch and every tunable timing and threshold.

export const VERSION = __VERSION__; // from package.json, set by the build
export const API = 'https://api-gateway.hz.vestmarkets.com';
export const _fetch = window.fetch.bind(window);
// Console echo of the activity log, for troubleshooting: localStorage.setItem('vc-debug', '1') and reload.
const DEBUG = (() => {
  try {
    return localStorage.getItem('vc-debug') === '1';
  } catch {
    return false;
  }
})();
export const LOG = (...a) => {
  if (DEBUG) console.log('%c[VC]', 'color:#35c48a;font-weight:bold', ...a);
};

// Tunables
export const DEFAULT_SYMBOL = 'NDX-USD-PERP';
export const DEFAULT_LEVERAGE = '50'; // close-order leverage when an account's own isn't known (Vest requires the field)
export const CAP_BUFFER = 0.95; // cap-to-fit: 5% headroom under a smaller follower's proportional size
export const EPS = 1e-9; // float slack when counting whole size steps
export const PRICE_EPS = 1e-6; // two trigger prices closer than this are the same price
export const NEAR_MARKET = 0.01; // a fill or entry used to place legs must be within 1% of the market...
export const NEAR_MARKET_LOOSE = 0.1; // ...or 10% for an entry that may be hours old (a held position, a saved plan)
export const EXEC_WINDOW_S = 900; // /executions lookup window either side of now
export const FILL_FIRST_LOOK_MS = 800; // let a fill reach /executions before the first look
export const FILL_TRIES = 3,
  FILL_RETRY_MS = 1500;
export const POLL_MS = 700; // re-reading a position after an order (re-anchor, add)
export const LEG_SYNC_DELAY_MS = 800; // re-read leg ids after a leg is added
export const RESYNC_AFTER_REDUCE_MS = 2000; // re-read sizes after a reduce
export const EXIT_RETRY_MS = 400; // one retry of a follower close/reduce on 429/5xx
export const BALANCE_AFTER_TRADE_MS = 1500;
export const BALANCE_POLL_MS = 20000; // full re-read of every account while Vest's live feed is down
export const FEED_BACKSTOP_MS = 60000; // ...and while it is up: the feed carries every change, this catches anything missed
export const FEED_QUIET_MS = 75000; // Vest pings its feed every 30 s: this long without a message means it's down
export const FEED_FILL_WAIT_MS = 1500; // a fill check waits this long for the live feed before asking Vest's fill history
export const VEST_CLOSE_GRACE_MS = 2500; // after Vest closes the master, a follower still open this long is an orphan
export const OUR_EXIT_MS = 15000; // a close or reduce sent from this tab this recently explains a position closing
export const BALANCES_LIMIT = 500; // accounts per balances read, as Vest's own page asks (failed accounts are left out)
export const TRADE_DRAW_MS = 100; // the Trade tab redraws at most this often on price ticks
export const LIVE_RENDER_MS = 400; // the Accounts and P&L lists redraw at most this often on live numbers
export const FLATTEN_WAIT_MS = 5000,
  FLATTEN_RECHECK_MS = 1500;
export const TOKEN_REFRESH_MARGIN_MS = 60000; // mint a new account token this long before the old one expires
export const LOG_MAX = 500,
  DIAG_MAX = 2000,
  DIAG_MAX_BYTES = 1500000;
export const MIN_LEG_USD = 1; // Vest's minimum notional for a sized stop/target leg
