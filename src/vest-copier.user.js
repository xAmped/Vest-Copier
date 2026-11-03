// ==UserScript==
// @name         Vest Copier
// @namespace    vestcopier
// @version      0.41.3
// @description  Copies a master Vest account's trades to your other Vest accounts, live, and adds a points-based order panel.
// @author       xAmped
// @license      STRATUH Copier License — free to use, no selling; see LICENSE
// @homepageURL  https://github.com/xAmped/Vest-Copier
// @supportURL   https://github.com/xAmped/Vest-Copier/issues
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHwklEQVR4Aexab2wUVRCfWVojiMp9QCFSqEFjjCHRRBNNRHbFWkSNNRFRKVoTo3zQpDXSI7bCAS3hikmbyAckJlYpCmJCCX+kFNytmGiCCSTEECIqUAggHw7kn7HtPn/zdreU2j1YKAdsu9nfmzfzZt7M+73Xvb1LDRrg1yABA/wA0OAJCDsBU6aUmFOnlqQCFBc/t+Dpp5+tmTSpKD19+oyVb7/9niOorKxOXSnmzKk2w+q42vbQE2AYJEXNIyIf/JFSqgp6ZX7+Ta8lEiMmCZh53pXCdUly0bW4Qgnouxju23wDWyMSoIhjxkFEApiUuoG3u4/SIxIQs9WDkIgExOz8RydADT4DBswzYNOm5hTAAVpa1nNr60Zua2vlpqbPOZ1e2G+oq6tJ4TRekzviM+Ca1HhVkw44AnqzGUpAOl1fXldXvz9AbW3dgfnzFx1MJqsOrVu3MXPo0OFOQSZzYn8m5zhZ3nshl6uHEoAJRxDxOAEefCLHQhYAd+Xl5Y0YPnz4EAEzj8s1iAi1Ub9cxqXPEr+PQFl7BALIfw2O18tQJAJYr10JcbFBBALi90VIdvGSCAh23pMSFh9cEgF48usVe1L/HWg9Dk02AnbhJ7AvBFgoJK+AXAl8c/bs2e3t7Yd+F4AUjFFOQcS7qJ+uUAKSyYpmoCxAdfXs11OpD0vx3j592rQXn5gw4YF7BInE7WW5x23N/bT+wZ/FQ0/ArPpRhe/WjzIDzFpy55Pv1N45eebcO4qTTWNLl2y7r3yJfV/5ivaHTcHX7Y+agjVHHjc9mObaI4KnzPVHgOOCKeZ3xwXPma3HfWRKTFvjJXN7RvAK5CvmT6dKNXZA7jhVZgp2nnrL3HnOw+5zs0zBnnPvmns6BOXmbx2CD8w/O3yoOWY7cETNKQw7MaEEGK5RppRha7iQXca2LmVsVZ20+eZb8leMHD+0ftT44fWkyB5Cho3XJNswxM+1WbFtKNfGryc2U5etDLLJZdgU5iObWdkuQ8KfXWUT/PEhaytmxLiYh2zldtlMZLskNmXjE8imIcom+BvIp0jZBvxdds/ng7/Oh/nJ4O58LhllkQnoGaBEQTVIKj0NZpSsFMFMSiy+Tj0kYVx0keLnuaEHO1odF0gZU7BrKQ3mkTjpCpj9fJBiD+KYPbv4aEAXKeMiBa40ITBC7BeY9WRYJRN7dghdLJLBrK2iM2MAHsyQ/mKkWIIufhiCip6vw8sjAToG4CYWIt1KvNjJu2R+6YlkxqKhBH7MugcLbj9O/KDpO9sis43pYGlQMklV3ScABmYkRTK03YsIkmKYui/fL9CZEdFXHOxBvPaFrknRChEz4oi0FD/RdB7YRSdcgS5xcCSR4tf/J0CSySIkOfqSRCeDriVs+vZ1XYw2SE0oE3a0JHFSvEgdB7vvJo5E0MWPcImf1pFXS9gkTuzM0iPSrYyTf8Eu8dl2OduYPwtqkR5m7z4B0JlxDJEMZn0CyNd7SlmU6CLFD2FQ0esRB+3CeDhJ0XBEYt3TkhmeEhdI34/ZqwOqd0OXDrxFaPTjCdDzEWH2gHkpESrWqIhZehgWiWJJLpHQlfSB/8XBpqPgx6x7pFvo5OsiJQ6umixmLBpK4Mese7Dg9uOCfLBQtl3ONiaxGnoy5NBSLOgwowgkg/l8UdD9YREe4Ad2vD5a5j7iYO+5SFFF7x0ndp0PebTUBm8+6aIsuiDO97usE+AabiOzawkMA9JwJ+exeorzaMo/ZzpmHt13tuLYH2cqFJOFz2ULLFjYJYtdtoiV5bJhERFsiFWwucoyGJKUpciwWJFFhmG5XYQcYmMLu4F5YDMINtdS8HfhT4h3Ec/wV5KPh2BuxtzK0vng7yIfSIHNtRj+eF+w8F5iEfzzyG1ELX3eyNmnnZZVHN2/tOKoE2DZ7GPff1p1bNuKBX+1pEsPNiUn722Ybe1tmFnwi/Nqwc/dmFbwozNttMBxXhzt4fnRWx3BMyM3Ox42OEUjgUQzZLNjQVqJb52JGqucibeuch7TaIJsch65tVHjoaGfOYIJQ5c5Ae4futS5P1/Q4Nyb7+Hu/I8dQQEvdgSjefH+vldJFEpAWEDc7KEEpNP1JUBjgJqaJV+mUouaKiurV69Zs/aH3bt/3SfIZE425g5/l/T3BoQSgEQPMvMbAvQh1UxmmoHPpJeHDRs2saBgzHgBbBijnAC5H0Qt/XpnI6BXInna9jLFQI1AgCLsdgyWfOESIhCAA6gkmKWJDSIR4J0AzcJAJGAAPwOCnfdkbDZfLyTbn8AJ/NUfEOAVF5IOot8OEg53dnaeOH36dJdAxnIFVIya0Ga5ow6FEoCfwxsqKysKBcnk+4VVVZXj5s2rGptO14554YVnE2PG3JUnSCRGFOYOtzdEXeDF/EMJuFhgXMYHCQjbSf/f5BWkRnHx86qoaKoyzSJVWvqmSiY/umzg+0QqLG+u7RFPQPw+CiMSEK+XIDltEQlgiYkVIhKgYveFKCIBg8+AWB1/WUzkEyBBcUIoAa5LDhHNPw+1EN8DaqHXdXT8+1Umc6JNgO8B86PCMEjmpuvhCiVg8+ZmZ5P3L/Pyb/OplpYNc7ds2Vjd1taaXL165Yzlyz8xBXV1NamoWLy45von4HrYnVzUEHoCcpH8eshxwxNwpST+BwAA//8h3IihAAAABklEQVQDADro88wjRs5WAAAAAElFTkSuQmCC
// @updateURL    https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js
// @downloadURL  https://github.com/xAmped/Vest-Copier/releases/latest/download/vest-copier.user.js
// @match        https://next.vestmarkets.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// STRATUH Copier (formerly Vest Copier) — Copyright (c) 2026 xAmped. Free to use for your own trading and to share unmodified; not for sale.
// Full terms: LICENSE (https://github.com/xAmped/Vest-Copier/blob/main/LICENSE). Not affiliated with Vest Markets.

/* global GM_info */

(() => {
  'use strict';
  if (window.__vestCopier) return;
  window.__vestCopier = true;
  // How the script started, for the diagnostics: the page's load state (a late start can miss Vest's first requests) and
  // whether this is a frame (Vest's chart is one) rather than the page.
  const BOOT_STATE = {
    readyState: document.readyState,
    ms: Math.round(performance.now()),
    frame: (() => {
      try {
        return window.top !== window;
      } catch {
        return true;
      }
    })(),
  };

  const VERSION = '0.41.3';
  // Where this script runs from, read off its own first stack frame (each script manager names it differently): the
  // diagnostics use it to tell the copier's own errors from Vest's. Null when the stack shows no address.
  const OWN_SRC = (() => {
    try {
      const m = String(new Error().stack || '').match(/((?:[a-z-]+):\/\/[^\s()]+?):\d+:\d+/i);
      return m ? m[1] : null;
    } catch {
      return null;
    }
  })();
  const API = 'https://api-gateway.hz.vestmarkets.com';
  const _fetch = window.fetch.bind(window);
  // Console echo of the activity log, for troubleshooting: localStorage.setItem('vc-debug', '1') and reload.
  const DEBUG = (() => {
    try {
      return localStorage.getItem('vc-debug') === '1';
    } catch {
      return false;
    }
  })();
  const LOG = (...a) => {
    if (DEBUG) console.log('%c[VC]', 'color:#35c48a;font-weight:bold', ...a);
  };

  // ── Tunables
  const DEFAULT_SYMBOL = 'NDX-USD-PERP';
  const DEFAULT_LEVERAGE = '50'; // close-order leverage when an account's own isn't known (Vest requires the field)
  const CAP_BUFFER = 0.95; // cap-to-fit: 5% headroom under a smaller follower's proportional size
  const EPS = 1e-9; // float slack when counting whole size steps
  const PRICE_EPS = 1e-6; // two trigger prices closer than this are the same price
  const NEAR_MARKET = 0.01; // a fill or entry used to place legs must be within 1% of the market...
  const NEAR_MARKET_LOOSE = 0.1; // ...or 10% for an entry that may be hours old (a held position, a saved plan)
  const EXEC_WINDOW_S = 900; // /executions lookup window either side of now
  const FILL_FIRST_LOOK_MS = 800; // let a fill reach /executions before the first look
  const FILL_TRIES = 3,
    FILL_RETRY_MS = 1500;
  const POLL_MS = 700; // re-reading a position after an order (re-anchor, add)
  const LEG_SYNC_DELAY_MS = 800; // re-read leg ids after a leg is added
  const RESYNC_AFTER_REDUCE_MS = 2000; // re-read sizes after a reduce
  const EXIT_RETRY_MS = 400; // one retry of a follower close/reduce on 429/5xx
  const BALANCE_AFTER_TRADE_MS = 1500;
  const LEV_TRUST_MS = 30000; // a leverage the page just saved beats Vest's reads this long (they can lag the change)
  const BALANCE_POLL_MS = 20000; // full re-read of every account while Vest's live feed is down
  const FEED_BACKSTOP_MS = 60000; // ...and while it is up: the feed carries every change, this catches anything missed
  const FEED_QUIET_MS = 75000; // Vest pings its feed every 30 s: this long without a message means it's down
  const FEED_FILL_WAIT_MS = 1500; // a fill check waits this long for the live feed before asking Vest's fill history
  const VEST_CLOSE_GRACE_MS = 2500; // after Vest closes the master, a follower still open this long is an orphan
  const OUR_EXIT_MS = 15000; // a close or reduce sent from this tab this recently explains a position closing
  const BALANCES_LIMIT = 500; // accounts per balances read, as Vest's own page asks (failed accounts are left out)
  const TRADE_DRAW_MS = 100; // the Trade tab redraws at most this often on price ticks
  const LIVE_RENDER_MS = 400; // the Accounts and P&L lists redraw at most this often on live numbers
  const FLATTEN_WAIT_MS = 5000,
    FLATTEN_RECHECK_MS = 1500;
  const TOKEN_REFRESH_MARGIN_MS = 60000; // mint a new account token this long before the old one expires
  const LOG_MAX = 500,
    DIAG_MAX = 2000,
    DIAG_MAX_BYTES = 1500000;
  const MIN_LEG_USD = 1; // Vest's minimum notional for a sized stop/target leg

  // ───────────────────────── state ─────────────────────────
  // This tab, on every diagnostics record and log line it saves (several Vest tabs can be open at once).
  const TAB_TAG = Math.random().toString(36).slice(2, 8);
  const S = {
    groups: [], // [{size,type,rows:[row]}]
    byId: {}, // id -> row
    master: null, // accountId
    followers: new Set(), // accountIds
    armed: false,
    log: [], // [{t,level,msg}]
    // masterPositionId -> { master, side, symbol, masterOrderId, qty, adopted?, queue (promise: actions run in order),
    //   legs: [{ id, kind:'tp'|'sl', price, qty }], followers: { accountId: { positionId, orderId, qty, legs } } }
    posMap: {},
    rate: { remaining: null, limit: null }, // last seen x-ratelimit-* headers (Vest allows 200 per window)
    ack: false, // user has read & agreed to the rules
    rulesOpen: false, // rules view is showing
    summaryOpen: false, // P&L summary view is showing
    levCache: {}, // "accountId|symbol" -> leverage known to be set (skip redundant PUT)
    fast: false, // fast mode: copy the master's market orders at its send (before Vest answers it)
    autoFlatten: false, // auto-close orphan followers if the master open is rejected
    orphan: null, // { list: [{ accountId, positionId, symbol, leverage }] } follower positions without the master
    arming: false, // an arm is in progress
    update: null, // { state, latest, dismissed } from the GitHub version check
    checkUpdates: true, // look for new versions on GitHub
    ackThenArm: false, // ARM was clicked before the terms were accepted
    supportOpen: false, // the Support tab is showing
    placing: false, // a trade-panel order is in flight
    flattening: false, // a flatten-all sweep is in progress
    capFit: false, // cap-to-fit: scale a follower's size down to what its margin can hold
    settingsOpen: false, // settings view is showing
    diag: [], // structured diagnostics (expected vs actual, margins, errors), downloadable as JSON
    siteOpen: false, // site-check view is showing
    site: null, // last site check: { fp, running, results:[{name,status,detail}] }
    tradeOpen: false, // trade panel view is showing
    trade: {
      // trade-panel settings (persisted, except live price)
      symbol: DEFAULT_SYMBOL,
      sizeMode: 'qty', // qty, risk ($ at the stop), pct (a share of the max) or max
      qty: 1,
      risk: 50,
      pct: 25, // sizeMode pct: this % of the most the account can open (Vest's 100%)
      stopPts: 20,
      stopOn: true, // false: the trade goes in without a stop (the stop box is kept for when it comes back)
      targets: [20, 40, 60], // empty: no targets
      scale: 'even',
      beMode: 'tp1',
      beTrigger: 15,
      beOffset: 0,
      orderType: 'market', // market, limit (the price picked on the chart) or stop (a stop entry, watched by the copier)
      slipPts: '', // stop entries: the most points past the level a fill may be ('' = a market order)
      unit: null, // NQ / ES / RTY: 'units' | 'micro' | 'mini' (null: Vest's own choice)
    },
    price: {}, // symbol -> { px, at } live price
    stopEntries: [], // stop entries waiting in this tab (see addStopEntry)
  };
  // Per-symbol order rules, refreshed from /v3/exchangeInfo at load (NDX-USD-PERP: tick 0.25, 4 size decimals).
  // Contracts are linear (notional = price × quantity), so P&L is $1 per point per contract.
  const SYMBOLS = { [DEFAULT_SYMBOL]: { label: 'NQ', tick: 0.25, step: 0.0001, pointValue: 1 } };
  // Vest's minis and micros: how many units one micro is ($ per point), from its bundle's map (2026-10-10:
  // new Map([["SPX-USD-PERP",5n],["NDX-USD-PERP",2n],["RTY-USD-PERP",5n]])). A mini is 10 micros. Orders still send units.
  const MICRO_UNITS = { 'NDX-USD-PERP': 2, 'SPX-USD-PERP': 5, 'RTY-USD-PERP': 5 };

  // ───────────────────────── jwt / token capture ─────────────────────────
  // The page's own tokens are read from its requests; nothing is stored. A user token (no accountId claim) lists
  // accounts and mints short-lived account tokens; an account token identifies which account an order is for.
  const decodeJwt = (t) => {
    try {
      let p = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      p += '='.repeat((4 - (p.length % 4)) % 4);
      return JSON.parse(atob(p));
    } catch {
      return {};
    }
  };
  const bearer = (auth) =>
    String(auth)
      .replace(/^Bearer\s+/i, '')
      .trim();
  let userToken = null;
  const offerUser = (auth) => {
    if (!auth || !/^Bearer\s+/i.test(auth)) return;
    const t = bearer(auth),
      c = decodeJwt(t);
    if (c.userId && !c.accountId && c.exp) userToken = t;
  };
  const acctIdFromAuth = (auth) => (auth ? decodeJwt(bearer(auth)).accountId || null : null);
  const userTokenOk = () => userToken && decodeJwt(userToken).exp * 1000 > Date.now() + 5000;

  // ───────────────────────── request hooks (token capture + master detection) ─────────────────────────
  const ORDER_RE = /\/v3\/positions\/(open|append|reduce|close|cancel-order|stop-loss|take-profit)(\?|$)/;

  // Live guard against Vest site updates: on every master order, confirm the request still carries the fields the
  // copier reads (`need`). Missing fields are flagged at once; new ones (not in `known`, so not forwarded to followers)
  // are flagged once per session. Both are recorded in diagnostics.
  const SHAPES = {
    open: {
      need: ['side', 'symbol', 'quantity', 'leverage', 'orderType'],
      known: [
        'orderType',
        'leverage',
        'side',
        'symbol',
        'quantity',
        'timeInForce',
        'takeProfits',
        'stopLosses',
        'price',
        'expirationTime', // sent when Vest moves a limit (its chart drag re-places it, keeping the old order's expiry)
      ],
    },
    // add to an open position: Vest's ticket sends this, not /open, when you already hold the same direction
    append: {
      need: ['positionId', 'symbol', 'quantity', 'isBuy'],
      known: [
        'symbol',
        'positionId',
        'orderType',
        'quantity',
        'leverage',
        'isBuy',
        'timeInForce',
        'price',
        'expirationTime',
      ],
    },
    reduce: {
      need: ['positionId', 'quantity', 'symbol'],
      // price: a limit reduce (Vest's Close dialog, part of the position); expirationTime: its chart line dragged
      known: [
        'positionId',
        'orderType',
        'leverage',
        'quantity',
        'timeInForce',
        'reduceOnly',
        'symbol',
        'price',
        'expirationTime',
      ],
    },
    // limitPrice: a limit close (Vest's Close dialog, Limit Close)
    close: {
      need: ['positionId', 'symbol'],
      known: ['symbol', 'positionId', 'orderType', 'leverage', 'limitPrice', 'expirationTime'],
    },
    'stop-loss': {
      need: ['positionId', 'triggerPrice', 'stopLossId'],
      known: ['positionId', 'executionType', 'triggerPrice', 'stopLossId', 'quantity', 'limitPrice'],
    },
    'take-profit': {
      need: ['positionId', 'triggerPrice', 'takeProfitId'],
      known: ['positionId', 'executionType', 'triggerPrice', 'takeProfitId', 'quantity', 'limitPrice'],
    },
    // POST adds a stop/target to an open position; DELETE removes one
    'stop-loss:POST': {
      need: ['positionId', 'triggerPrice'],
      known: ['positionId', 'executionType', 'triggerPrice', 'quantity', 'limitPrice'],
    },
    'take-profit:POST': {
      need: ['positionId', 'triggerPrice'],
      known: ['positionId', 'executionType', 'triggerPrice', 'quantity', 'limitPrice'],
    },
    'stop-loss:DELETE': { need: ['positionId'], known: ['positionId', 'stopLossId', 'takeProfitId', 'orderId', 'id'] },
    'take-profit:DELETE': {
      need: ['positionId'],
      known: ['positionId', 'stopLossId', 'takeProfitId', 'orderId', 'id'],
    },
    'cancel-order': { need: ['orderId'], known: ['orderId'] },
  };
  const _seenNewFields = new Set();
  function checkShape(action, req, method = 'POST') {
    const s = SHAPES[`${action}:${method}`] || SHAPES[action];
    if (!s || !req || typeof req !== 'object') return;
    const missing = s.need.filter((k) => !(k in req));
    const extra = Object.keys(req).filter((k) => !s.known.includes(k));
    if (missing.length)
      logEvent(
        'warn',
        `Vest's ${action} order has changed — missing ${missing.join(', ')}. Copies may be wrong: stop copying, run the site check (the status dot), send Diag.`,
      );
    const fresh = extra.filter((k) => !_seenNewFields.has(action + '|' + k));
    fresh.forEach((k) => _seenNewFields.add(action + '|' + k));
    if (fresh.length)
      logEvent(
        'warn',
        `Vest's ${action} order has new field(s): ${fresh.join(', ')} — not copied to followers. Send Diag if copies look off.`,
      );
    if (missing.length || extra.length) diag('payload_drift', { action, missing, extra, keys: Object.keys(req) });
  }

  const parseJson = (v, fallback) => {
    if (v && typeof v === 'object') return v;
    try {
      return typeof v === 'string' ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  };
  const orderAction = (url) => (String(url).match(ORDER_RE) || [])[1] || null;

  // A completed request made by the page. Picks up the user's session token, and when armed, mirrors the master's
  // order requests. Requests Vest refused (non-2xx) are never copied.
  // `via`: the hook that saw it, 'xhr' or 'fetch' (Vest sends its orders over XHR: axios), recorded in the diagnostics
  const onRequest = (url, reqBody, resBody, auth, method, status, via) => {
    const action = orderAction(url);
    if (action && status >= 200 && status < 300) refreshSoon(); // any order on any account: balances catch up at once
    if (!S.armed || !action) return;
    const res = parseJson(resBody, {}) || {};
    const acct = acctIdFromAuth(auth) || res.accountId || null;
    if (!acct || acct !== S.master) return; // only the master is mirrored
    const req = parseJson(reqBody, {}) || {};
    method = String(method || 'POST').toUpperCase();
    if (S.flattening) {
      // Flatten All is closing everything on every account, this order included: copying it would only open followers
      // that the sweep then closes
      logEvent('info', `MASTER ${action} during Flatten All — not copied.`);
      diag('master', { action, method, outcome: 'skipped', reason: 'flatten all in progress' });
      return;
    }
    if (!(status >= 200 && status < 300)) {
      // Vest's own reason ({ code, msg } or { message }), and where the market was, so the diag shows why
      const why = String(res.msg || res.message || res.error || (typeof resBody === 'string' ? resBody : '') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200);
      const sym =
        req.symbol ||
        (S.posMap[req.positionId] && S.posMap[req.positionId].symbol) ||
        ((S.acctState[S.master] && S.acctState[S.master].positions.find((p) => p.id === req.positionId)) || {})
          .symbol ||
        S.trade.symbol;
      const pr = S.price[sym] || {};
      logEvent(
        'info',
        `MASTER ${action} refused by Vest (HTTP ${status || 'no response'}${why ? ': ' + why : ''}) — not copied.`,
      );
      diag('master_refused', {
        action,
        method,
        status,
        reason: why || null,
        code: res.code != null ? res.code : null,
        positionId: req.positionId || null,
        symbol: sym,
        triggerPrice: req.triggerPrice,
        qty: req.quantity,
        market: {
          price: priceOf(sym),
          bid: recentAt(pr.bookAt) ? pr.bid : null,
          ask: recentAt(pr.bookAt) ? pr.ask : null,
          last: recentAt(pr.lastAt) ? pr.last : null,
          mark: recentAt(pr.at) ? pr.px : null,
        },
      });
      return;
    }
    checkShape(action, req, method);
    mirror(action, req, res, method, via);
  };

  // fetch
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    let auth = null;
    try {
      auth = new Headers((init && init.headers) || (input && input.headers) || {}).get('authorization');
    } catch {
      /* best effort: nothing to do if this fails */
    }
    const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    const body = init && init.body;
    let pending = null,
      levChange = null;
    try {
      offerUser(auth);
      // first: a reduce notes the position's size as it goes out, which the fast copy below reads
      if (method !== 'GET') levChange = notePageRequest(url, method, body);
    } catch {
      /* best effort: nothing to do if this fails */
    }
    try {
      if (method !== 'GET') pending = maybeFast(url, body, auth, method, 'fetch');
    } catch {
      /* best effort: nothing to do if this fails */
    }
    const p = _fetch.apply(this, arguments);
    if (levChange)
      p.then(
        (r) => pageRequestDone(levChange, r.status),
        () => pageRequestDone(levChange, 0),
      );
    // Only order requests are read back (never other responses, which may be long-lived streams).
    if (pending || (auth && orderAction(url))) {
      p.then(
        (r) =>
          r
            .clone()
            .text()
            .then(
              (t) =>
                pending ? settleFast(pending, t, r.status) : onRequest(url, body, t, auth, method, r.status, 'fetch'),
              () => pending && settleFast(pending, null, r.status, true),
            ),
        () => pending && settleFast(pending, null, 0), // network failure: Vest may or may not have the order
      );
    }
    return p;
  };
  // XHR
  const _open = XMLHttpRequest.prototype.open,
    _send = XMLHttpRequest.prototype.send,
    _setH = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.open = function (m, u) {
    this.__vc = { url: u, method: String(m || 'GET').toUpperCase() };
    return _open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
    if (/^authorization$/i.test(k)) {
      if (this.__vc) this.__vc.auth = v;
      offerUser(v);
    }
    return _setH.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (b) {
    const vc = this.__vc;
    if (vc) {
      let pending = null;
      try {
        if (vc.method !== 'GET') vc.lev = notePageRequest(vc.url, vc.method, b); // first, as in the fetch hook
        pending = vc.method !== 'GET' ? maybeFast(vc.url, b, vc.auth, vc.method, 'xhr') : null;
      } catch {
        /* best effort: nothing to do if this fails */
      }
      this.addEventListener(
        'loadend',
        () => {
          // once per request; also fires on error/abort/timeout
          let r = '';
          try {
            r = this.responseText;
          } catch {
            /* best effort: nothing to do if this fails */
          }
          if (vc.lev) pageRequestDone(vc.lev, this.status);
          if (pending) settleFast(pending, r, this.status);
          else onRequest(vc.url, b, r, vc.auth, vc.method, this.status, 'xhr');
        },
        { once: true },
      );
    }
    return _send.apply(this, arguments);
  };

  const waitForUserToken = (timeoutMs = 20000) =>
    new Promise((resolve, reject) => {
      if (userTokenOk()) return resolve(userToken);
      const t0 = Date.now();
      const iv = setInterval(() => {
        if (userTokenOk()) {
          clearInterval(iv);
          resolve(userToken);
        } else if (Date.now() - t0 > timeoutMs) {
          clearInterval(iv);
          reject(new Error('no user token yet'));
        }
      }, 300);
    });

  // What the page sends that the copier needs to know before Vest answers: a close or reduce (so the position closing on
  // the live feed isn't mistaken for one Vest made), the account Vest's screen switches to, a leverage change and an
  // account's new name (returned, so the hook can report Vest's answer to `pageRequestDone`).
  const _exits = {}; // positionId -> when this tab last sent a close or reduce for it
  const noteExit = (positionId) => positionId && (_exits[positionId] = Date.now());
  const ourExit = (positionId) => Date.now() - (_exits[positionId] || 0) < OUR_EXIT_MS;
  // A limit close or reduce rests until its price: noted when it fills, not now. A reduce also notes the position's size
  // as it goes out (by Vest's answer an opposite order bigger than the position has already flipped it).
  const _preSize = {}; // positionId -> { qty, side, at }
  function notePreSize(positionId) {
    for (const st of Object.values(S.acctState)) {
      const p = stateFresh(st) && st.positions.find((x) => x.id === positionId);
      if (p) return void (_preSize[positionId] = { qty: p.qty, side: p.side, at: Date.now() });
    }
  }
  function notePageRequest(url, method, body) {
    const action = orderAction(url);
    if (action === 'take-profit' && method === 'PUT') {
      const req = parseJson(body, null);
      if (req && req.takeProfitId && !_resplitting.has(resplitKey(req)))
        noteMovedTo(req.takeProfitId, req.triggerPrice);
    } else if (action === 'close' || action === 'reduce') {
      const req = parseJson(body, null);
      if (req && action === 'reduce') notePreSize(req.positionId);
      if (req && (req.orderType || 'market') === 'market') noteExit(req.positionId);
    } else if (method === 'PATCH' && /\/v3\/user-state\/preferences/.test(url)) {
      const req = parseJson(body, null);
      if (req && req.lastUsedAccountId) setScreen(req.lastUsedAccountId);
    } else if (method === 'PATCH' && /\/v3\/user-state\/accounts\/[^/?#]+\/?(?:[?#]|$)/.test(url)) {
      return notePageRename(url, body); // an account renamed on Vest
    } else if (/\/v3\/user-state\/accounts\/[^/]+\/leverages\//.test(url)) {
      setTimeout(() => S.tradeOpen && refreshTradeState(), BALANCE_AFTER_TRADE_MS);
      return notePageLeverage(url, body);
    }
    return null;
  }

  // A leverage the page saves (Vest's ticket: PUT .../accounts/{id}/leverages/{symbol}, {"leverage":"20"}) is used at
  // once: Vest's own reads can still answer the old one for a while, and the Trade tab sizes % and Max from it (a size
  // one leverage change behind went out in a live test, 2026-10-12). Kept over every read for LEV_TRUST_MS, dropped if
  // Vest refuses it.
  const _levSet = {}; // "accountId|symbol" -> { key, id, sym, lev, at }
  function notePageLeverage(url, body) {
    const m = /\/v3\/user-state\/accounts\/([^/]+)\/leverages\/([^/?#]+)/.exec(url),
      lev = +(parseJson(body, null) || {}).leverage;
    if (!m || !(lev > 0)) return null;
    const id = decodeURIComponent(m[1]),
      sym = decodeURIComponent(m[2]);
    const change = { key: id + '|' + sym, id, sym, lev, at: Date.now() };
    _levSet[change.key] = change;
    const set = (levs) => levs && (levs[id] = { ...levs[id], [sym]: lev });
    set(S.levs);
    S.stopEntries.forEach((e) => set(e.levs)); // waiting stop entries fire at the new one too
    drawTradeSoon();
    return change;
  }
  const pageRequestDone = (change, status) =>
    change.kind === 'name' ? pageRenameDone(change, status) : pageLeverageDone(change, status);
  function pageLeverageDone(change, status) {
    if (status >= 200 && status < 300) return void presetFollowerLeverage(change);
    if (_levSet[change.key] === change) delete _levSet[change.key];
    if (S.tradeOpen) refreshTradeState(); // Vest's own leverage back on the panel
    refreshStopLeverage();
  }
  // A read of every account's leverage with the page's recent changes laid over it.
  function withPageLevs(levs) {
    const now = Date.now();
    for (const key in _levSet) {
      const c = _levSet[key];
      if (now - c.at > LEV_TRUST_MS) delete _levSet[key];
      else levs[c.id] = { ...levs[c.id], [c.sym]: c.lev };
    }
    return levs;
  }

  // ───────────────────────── Vest's live account feed (read-only) ─────────────────────────
  // Vest's page keeps a private socket open that pushes every change on every one of the user's accounts within about
  // 50 ms: orders placed and filled, positions opened, added to, reduced and closed, stops and targets, the new balance
  // (`account_state`); an account failing or changing its limits (`capital_account`); an order Vest refused after
  // accepting it (`command_events`); and profit claims (`profit_withdrawal`). The copier never opens it or sends on it:
  // it finds Vest's own socket the moment Vest creates it (the constructor is wrapped at document-start; Vest never
  // sends a subscription, only a ping every 30 s), or failing that on that first ping, and listens. Balances, positions,
  // fills and failed accounts then update as they happen; the polled reads become a backstop.
  const _feed = { ws: null, last: 0, attached: 0, stateAt: 0, missing: [] };
  const FEED_FIELDS = ['account_id', 'account_seq', 'positions', 'final_balance']; // in every account_state event
  const _feedAt = {}; // accountId -> when its last feed event landed (a slower REST read must not overwrite it)
  const _seq = {}; // accountId -> the last account_seq applied (Vest drops older and repeated events the same way)
  const feedLive = () => !!_feed.ws && _feed.ws.readyState === 1 && Date.now() - _feed.last < FEED_QUIET_MS;
  if (typeof WebSocket === 'function' && typeof Proxy === 'function')
    try {
      // a Proxy keeps everything else about WebSocket as it was (prototype, constants, instanceof, subclasses)
      window.WebSocket = new Proxy(WebSocket, {
        construct(target, args, newTarget) {
          const ws = Reflect.construct(target, args, newTarget);
          try {
            if (/\/ws\/private/.test(String(args[0] || ''))) attachFeed(ws);
          } catch {
            /* best effort: nothing to do if this fails */
          }
          return ws;
        },
      });
    } catch {
      /* best effort: the ping below still finds it */
    }
  if (typeof WebSocket === 'function' && WebSocket.prototype && WebSocket.prototype.send) {
    const _wsSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function () {
      try {
        if (this !== _feed.ws && /\/ws\/private/.test(this.url || '')) attachFeed(this);
      } catch {
        /* best effort: nothing to do if this fails */
      }
      return _wsSend.apply(this, arguments);
    };
  }
  function attachFeed(ws) {
    const again = _feed.attached > 0; // Vest reconnected: anything said while it was down is read in full once
    _feed.ws = ws;
    _feed.last = Date.now();
    _feed.attached++;
    ws.addEventListener('message', (e) => {
      if (ws !== _feed.ws) return;
      _feed.last = Date.now();
      onFeedMessage(e.data);
    });
    ws.addEventListener('close', () => {
      if (ws !== _feed.ws) return;
      _feed.ws = null;
      diag('feed', { outcome: 'closed' });
    });
    diag('feed', { outcome: again ? 'reattached' : 'attached' });
    if (again) refreshBalances();
  }
  function onFeedMessage(raw) {
    if (typeof raw !== 'string' || raw.charCodeAt(0) !== 123) return; // '{'
    const m = parseJson(raw, null);
    if (!m || typeof m.channel !== 'string' || !m.data || typeof m.data !== 'object') return;
    if (m.channel === 'account_state') {
      // for the site check: does Vest's update still carry what the copier reads?
      _feed.stateAt = Date.now();
      _feed.missing = FEED_FIELDS.filter((k) => !(k in m.data));
    }
    try {
      if (m.channel === 'account_state') onAccountState(m.data);
      else if (m.channel === 'capital_account') onCapitalAccount(m.data);
      else if (m.channel === 'command_events') onCommandEvent(m.data);
      else if (m.channel === 'profit_withdrawal') onClaimEvent(m.data);
    } catch (e) {
      diag('feed', { outcome: 'error', channel: m.channel, error: e.message });
    }
  }

  // Fills, as the feed reports them: orderId -> { price, at } once filled, or { missing, why } when Vest says it didn't
  // execute (a refused command, or an order cancelled with nothing filled). A fill check waits on this first.
  S.feedFills = {};
  const _fillWaiters = {};
  function setFeedFill(orderId, v) {
    const had = S.feedFills[orderId];
    if (had && !had.missing) return; // a fill is final
    S.feedFills[orderId] = { ...v, seen: Date.now() };
    for (const done of _fillWaiters[orderId] || []) done(S.feedFills[orderId]);
    delete _fillWaiters[orderId];
    const ids = Object.keys(S.feedFills);
    if (ids.length > 2000) ids.slice(0, 1000).forEach((k) => delete S.feedFills[k]);
  }
  function feedFill(orderId, ms) {
    const have = orderId && S.feedFills[orderId];
    if (have || !orderId || !(ms > 0) || !feedLive()) return Promise.resolve(have || undefined);
    return new Promise((resolve) => {
      const done = (v) => {
        clearTimeout(timer);
        resolve(v);
      };
      const timer = setTimeout(() => {
        _fillWaiters[orderId] = (_fillWaiters[orderId] || []).filter((x) => x !== done);
        resolve(undefined);
      }, ms);
      (_fillWaiters[orderId] = _fillWaiters[orderId] || []).push(done);
    });
  }

  function onAccountState(d) {
    const id = d.account_id;
    if (!id) return;
    const seq = parseInt(d.account_seq, 10);
    if (seq >= 0) {
      if (_seq[id] != null && seq <= _seq[id]) return;
      _seq[id] = seq;
    }
    for (const o of d.orders || []) {
      const done = num(o.executed_quantity) > 0;
      if (done && num(o.execution_price) > 0 && (o.status === 'filled' || /FILLED$/.test(o.event_type || '')))
        setFeedFill(o.order_id, { price: num(o.execution_price), at: o.execution_time });
      else if (!done && (o.status === 'rejected' || o.status === 'cancelled'))
        setFeedFill(o.order_id, { missing: true, why: o.status });
    }
    if (!S.byId[id]) return; // not an account the copier lists (the Primary Account, say)
    _feedAt[id] = Date.now();
    const ch = applyFeedState(id, d);
    onFeedPositions(id, d, ch);
    revalue(id);
    liveRender();
    drawTradeSoon();
  }
  // An account's positions, stops, targets and cash from one feed event, the way a REST read would leave them.
  function applyFeedState(id, d) {
    const r = S.byId[id];
    const st = (S.acctState[id] = S.acctState[id] || { positions: [], ordersCollateral: 0, marks: {}, at: 0 });
    const ch = { closed: [], reduced: [], opened: [] };
    for (const p of d.positions || []) {
      const pid = p.position_id;
      if (!pid) continue;
      const i = st.positions.findIndex((x) => x.id === pid);
      const prev = i >= 0 ? st.positions[i] : null,
        qty = num(p.quantity);
      if (p.status === 'closed' || /CLOSED$/.test(p.event_type || '')) {
        if (prev) st.positions.splice(i, 1);
        ch.closed.push(p);
      } else if (p.status === 'opened' && qty > 0) {
        const next = {
          id: pid,
          symbol: p.symbol,
          side: p.side,
          qty,
          openPrice: num(p.open_price),
          collateral: num(p.collateral) || 0,
          leverage: num(p.leverage) || (prev && prev.leverage) || null, // a close sends it (Vest requires the field)
          triggers: prev ? prev.triggers : [],
        };
        if (prev) st.positions[i] = next;
        else st.positions.push(next);
        if (!prev) ch.opened.push(p);
        else if (qty < prev.qty) ch.reduced.push(p);
      }
    }
    for (const it of d.order_intents || []) {
      const pos = st.positions.find((x) => x.id === it.position_id),
        kind = it.kind === 'stop_loss' ? 'sl' : it.kind === 'take_profit' ? 'tp' : null;
      if (!kind) continue;
      if (pos && st.pendingLegs) delete st.pendingLegs[it.position_id]; // filled: its legs are live, Vest draws them
      if (!pos) {
        // a leg waiting on an order that hasn't filled (a resting limit): kept to draw it on the chart
        if (!it.position_id) continue;
        const pl = (st.pendingLegs = st.pendingLegs || {}),
          list = (pl[it.position_id] || []).filter((t) => t.id !== it.id);
        if (it.state === 'pending_activation')
          list.push({
            id: it.id,
            kind,
            price: num(it.trigger_price),
            qty:
              it.size_mode && it.size_mode !== 'full_position' ? (it.size != null ? String(it.size) : undefined) : null,
            exec: it.execution || 'market',
          });
        if (list.length) pl[it.position_id] = list;
        else delete pl[it.position_id];
        continue;
      }
      pos.triggers = pos.triggers.filter((t) => t.id !== it.id);
      if (it.state === 'active') pos.triggers.push({ id: it.id, kind, price: num(it.trigger_price) });
    }
    if (d.orders_collateral != null && num(d.orders_collateral) >= 0) st.ordersCollateral = num(d.orders_collateral);
    // resting limits: placed ones join the list, filled or cancelled ones leave it
    for (const o of d.orders || []) {
      const lo = limitOrderOf(o);
      if (!lo) continue;
      st.orders = (st.orders || []).filter((x) => x.id !== lo.id);
      if (['pending', 'accepted', 'partially_filled'].includes(o.status) && !(num(o.executed_quantity) >= lo.qty))
        st.orders.push(lo);
    }
    const fb = d.final_balance;
    if (fb && num(fb.amount) >= 0) {
      const v = parseInt(fb.balance_version, 10);
      if (!(v < (r.balVer || 0))) {
        r.free = num(fb.amount);
        if (v >= 0) r.balVer = v;
      }
    }
    if (r.free >= 0) st.cash = r.free + st.positions.reduce((a, p) => a + p.collateral, 0) + (st.ordersCollateral || 0);
    st.at = Date.now();
    for (const p of ch.opened) watchPrice(p.symbol); // its open P&L follows the price from now on
    return ch;
  }

  // Positions Vest closed or reduced by itself: a stop or target filling, a failed account, or a close from somewhere
  // other than this tab. The trade's bookkeeping follows, the log says what happened, and when the master is out of a
  // copied trade, followers still in it after a moment are offered to flatten (they normally close on their own stops).
  S.failing = {}; // accountId -> when Vest reported it failed (its forced close follows)
  const _limitExits = new Set(); // position ids (master and followers) with a copied limit close or reduce waiting
  function onFeedPositions(id, d, ch) {
    const legHit = {};
    for (const it of d.order_intents || [])
      if (/TRIGGERED|COMPLETED/.test(it.event || '') && it.position_id)
        legHit[it.position_id] = it.kind === 'stop_loss' ? 'sl' : 'tp';
    const cause = (pid) =>
      ourExit(pid)
        ? 'ours'
        : legHit[pid] ||
          (Date.now() - (S.failing[id] || 0) < 60000 ? 'breach' : _limitExits.has(pid) ? 'lclose' : 'vest');
    for (const p of [...ch.closed, ...ch.reduced]) {
      const pid = p.position_id,
        closed = ch.closed.includes(p),
        why = cause(pid);
      if (closed) _limitExits.delete(pid);
      if (closed && S.plans[pid]) endPlan(S.plans[pid], 'Breakeven: trade closed — stopped watching.');
      if (why === 'ours') continue; // this tab sent it: the copier already copied it
      // closed at size 0: an order that never filled (a limit cancelled or expired, one Vest refused, an immediate-or-cancel
      // limit that missed), not a trade closing: nothing to report. A master limit like that takes its copies with it.
      const never = closed && !(num(p.quantity) > 0);
      const entry = S.posMap[pid];
      if (never) {
        if (entry && entry.resting && dropEntry(entry)) {
          logEvent(
            'info',
            "MASTER's limit was cancelled outside this tab (or expired): cancelling the followers' copies.",
          );
          cancelFollowerCopies(entry);
        }
      } else {
        noteVestClose({ id, symbol: p.symbol, why, closed, pnl: num(p.pnl), qty: num(p.quantity) });
        if (entry && closed) masterClosedByVest(pid, entry, why);
        else if (entry) entry.qty = fmtQty(num(p.quantity), entry.symbol); // a sized target filled: the copy keeps its share
      }
      for (const e of Object.values(S.posMap)) {
        const fp = e.followers[id];
        if (!fp || fp.positionId !== pid) continue;
        if (closed)
          delete e.followers[id]; // out of the trade: nothing left to copy to it
        else fp.qty = fmtQty(num(p.quantity), e.symbol);
      }
    }
  }
  function masterClosedByVest(pid, entry, why) {
    delete S.posMap[pid];
    _limitExits.delete(pid);
    cancelWaitingCopies(entry, false);
    const followers = Object.entries(entry.followers);
    if (!followers.length) return;
    setTimeout(async () => {
      const left = [];
      for (const [f, fp] of followers) {
        let open;
        if (feedLive() && S.acctState[f]) open = S.acctState[f].positions.some((x) => x.id === fp.positionId);
        else open = !!(await tryOpenPosition(f, entry.symbol, fp.positionId));
        if (open) left.push({ accountId: f, positionId: fp.positionId });
      }
      const what = {
        sl: "the master's stop filled",
        tp: "the master's target filled",
        breach: 'Vest closed the master (the account failed)',
        lclose: "the master's limit close filled",
        vest: "the master's position was closed outside this tab",
      }[why];
      if (left.length) raiseOrphans(entry.symbol, left, what, entry.master);
    }, VEST_CLOSE_GRACE_MS);
  }
  // One log line per kind of close, for every account it happened on at about the same moment.
  let _vestCloses = [],
    _vestCloseTimer = null;
  function noteVestClose(n) {
    _vestCloses.push(n);
    diag('vest_close', { ...who(n.id), symbol: n.symbol, cause: n.why, closed: n.closed, pnl: n.pnl, qty: n.qty });
    if (!_vestCloseTimer) _vestCloseTimer = setTimeout(flushVestCloses, 600);
  }
  function flushVestCloses() {
    _vestCloseTimer = null;
    const notes = _vestCloses;
    _vestCloses = [];
    const groups = {};
    for (const n of notes)
      (groups[n.why + (n.closed ? '' : '+part')] = groups[n.why + (n.closed ? '' : '+part')] || []).push(n);
    for (const [k, list] of Object.entries(groups)) {
      const [why, part] = k.split('+');
      const what = {
        sl: part ? 'Stop filled part of the position' : 'Stop filled',
        tp: part ? 'Target filled' : 'Target filled, position closed',
        breach: 'Closed by Vest (account failed)',
        lclose: part ? 'Limit reduce filled' : 'Limit close filled',
        vest: part ? 'Reduced outside this tab' : 'Closed outside this tab',
      }[why];
      const usd = (v) => (v >= 0 ? '+' : '−') + money(Math.abs(v));
      // under a cent (a tiny reduce) reads as nothing, not "−$0.00"
      const each = list.map((n) => `${accLabel(n.id)}${!(Math.abs(n.pnl) >= 0.005) ? '' : ' ' + usd(n.pnl)}`);
      logEvent(
        why === 'tp' || why === 'lclose' ? 'ok' : 'warn',
        `${what} (${symLabel(list[0].symbol)}): ${each.join(', ')}.`,
      );
    }
  }

  // An account Vest closed (failed) or changed: its limits apply at once; a failed or new account updates the list.
  function onCapitalAccount(d) {
    const id = d.account_id,
      r = id && S.byId[id];
    if (!id) return;
    if (r && d.status === 2) {
      setLimits(r, d); // a daily reset moves the daily floor
      revalue(id);
      liveRender();
      return;
    }
    if (r) S.failing[id] = Date.now();
    if (r || d.status === 2) syncAccountsSoon();
  }
  // Vest accepted an order (HTTP 200) and then refused to run it: the fill check learns it at once, with Vest's code.
  function onCommandEvent(d) {
    if (String(d.status).toUpperCase() !== 'REJECTED' || !d.order_id) return;
    setFeedFill(d.order_id, {
      missing: true,
      why: 'refused' + (d.error_code != null ? ` (code ${d.error_code})` : ''),
    });
    diag('order_refused', {
      ...(d.account_id ? who(d.account_id) : {}),
      orderId: d.order_id,
      errorCode: d.error_code,
      event: d.event_type,
    });
  }
  function onClaimEvent(d) {
    const st = String(d.status || '').toUpperCase(),
      amt = num(d.trader_amount != null ? d.trader_amount : d.amount),
      from = d.account_id && S.byId[d.account_id] ? ` from ${accLabel(d.account_id)}` : '';
    diag('claim_event', { status: st, ...(d.account_id ? who(d.account_id) : {}), amount: isNaN(amt) ? null : amt });
    // a claim made anywhere starts the account fresh for Today, from when it was asked for (Vest can pay it hours later,
    // in the next trading day): the event's own time, else the first event seen (not the payment)
    if (st === 'REFUNDED' || st === 'FAILED') forgetPayout(d.account_id);
    else {
      const at = msOf(d.created_at ?? d.requested_at) || (st === 'EXECUTED' ? 0 : Date.now());
      if (at) notePayout(d.account_id, at);
    }
    if (st === 'EXECUTED') logEvent('ok', `Vest paid a profit claim${from}${amt > 0 ? `: ${money(amt)}` : ''}.`);
    else if (st === 'REFUNDED' || st === 'FAILED')
      logEvent(
        'warn',
        `Vest returned a profit claim${from}${amt > 0 ? ` (${money(amt)})` : ''}: it's back on the account.`,
      );
  }

  // The account Vest's own screen is on (its order ticket trades it): from Vest's saved choice at load, then from each
  // switch. Armed, the panel warns when it isn't the master, since orders placed there aren't copied.
  S.screen = null;
  function setScreen(id) {
    if (S.screen === id) return;
    S.screen = id;
    renderLog();
  }
  function readScreen() {
    try {
      const uid = userToken && decodeJwt(userToken).userId;
      const id =
        uid &&
        (sessionStorage.getItem('vest-active-account:' + uid) || localStorage.getItem('vest-active-account:' + uid));
      if (id && /^[\w-]{8,64}$/.test(id)) setScreen(id);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }

  // ───────────────────────── api ─────────────────────────
  // Vest REST call. Errors read "<path> -> <status>" (errCode() parses the status back out), with Vest's own reason, when
  // it gives one, as `e.vest`.
  const READ_TIMEOUT_MS = 15000;
  const api = async (path, token = userToken, opts = {}) => {
    if (!token) throw new Error('no Vest session yet — click around Vest, then retry');
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      ...(opts.headers || {}),
    };
    // reads time out (a hung request would freeze the balance poll); orders don't, since a cut-off order is ambiguous
    const read = !opts.method || opts.method === 'GET';
    const ctl = read && typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), READ_TIMEOUT_MS) : null;
    let r;
    try {
      r = await _fetch(API + path, { ...opts, headers, ...(ctl ? { signal: ctl.signal } : {}) });
    } finally {
      if (timer) clearTimeout(timer);
    }
    noteRate(r);
    const text = await r.text();
    // an account token Vest revoked early (log out / in elsewhere): drop it and retry once with a fresh one. A 401
    // means nothing ran, so the retry (same Idempotency-Key) is safe.
    if (r.status === 401 && tokenOwner[token] && !opts._retried) {
      const id = tokenOwner[token];
      delete tokenOwner[token];
      if (acctTokens[id] && acctTokens[id].token === token) delete acctTokens[id];
      const fresh = await mintAccountToken(id);
      return api(path, fresh.token, { ...opts, _retried: true });
    }
    if (!r.ok) {
      const e = new Error(`${path} -> ${r.status}`),
        b = parseJson(text, null);
      e.vest =
        String((b && (b.msg || b.message || b.error)) || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 200) || null;
      throw e;
    }
    return parseJson(text, text);
  };
  // Vest's rate budget from an answer's headers (200 requests a second): the status card shows what's left.
  function noteRate(r) {
    try {
      const rem = r.headers.get('x-ratelimit-remaining');
      if (rem != null) {
        S.rate = { remaining: +rem, limit: +r.headers.get('x-ratelimit-limit') || S.rate.limit };
        renderRate();
      }
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  // Account tokens last ~15 minutes. Cached, and concurrent requests for the same account share one mint.
  const acctTokens = {},
    minting = {},
    tokenOwner = {}; // account token -> account id, to renew a revoked one
  // `margin`: renew a token this close to expiring (the keep-warm tick renews early, so an order never waits on one).
  const mintAccountToken = (id, margin = TOKEN_REFRESH_MARGIN_MS) => {
    const c = acctTokens[id];
    if (c && c.exp - margin > Date.now()) return Promise.resolve(c);
    return (minting[id] =
      minting[id] ||
      (async () => {
        try {
          const r = await api('/v3/auth/account-token', userToken, {
            method: 'POST',
            body: JSON.stringify({ accountId: id }),
          });
          const tok = r.apiKey || r.accessToken,
            cl = decodeJwt(tok);
          tokenOwner[tok] = id;
          if (S.byId[id]) S.byId[id].canTrade = !!cl.canTrade; // a breached or closed account can't trade
          return (acctTokens[id] = { token: tok, exp: r.accessExpiresAtMs || cl.exp * 1000, canTrade: !!cl.canTrade });
        } finally {
          delete minting[id];
        }
      })());
  };

  // ───────────────────────── registry ─────────────────────────
  const num = (v) => (v == null || v === '' ? NaN : parseFloat(v));
  const typeName = (t, p) =>
    t === 2 ? 'Evaluation' : t === 3 ? (p === 'instant_funded' ? 'Instant Funded' : 'Funded') : 'Other';
  const shortType = (t, p) => (t === 2 ? 'Eval' : t === 3 ? (p === 'instant_funded' ? 'Instant' : 'Funded') : 'Other');
  const label = (a) => 'Account ' + String((a.attempt_index ?? 0) + 1).padStart(2, '0'); // Vest's own number for it

  // ── Account names. A trader can name an account on Vest (saved in its user-state: PATCH /v3/user-state/accounts/{id}
  // { name }, read back from GET /v3/user-state with a `revision`, the newest winning, as Vest's page does). A named
  // account's label is `Account 07 ("Swing")` in the log, the diagnostics and saved files (the owner's call, 2026-10-19:
  // a report says which account by both), and its name alone in the panel's rows, with the number in its tile. Names
  // are trimmed to NAME_MAX characters. Read when the accounts load, with every full read, and at once from a rename this
  // tab saves (taken back if Vest refuses it).
  const NAME_MAX = 24;
  const _names = {}; // accountId -> { name, rev } from Vest's user-state
  const cleanName = (n) => {
    const s = String(n || '')
      .replace(/\s+/g, ' ')
      .trim();
    return s ? (s.length > NAME_MAX ? s.slice(0, NAME_MAX - 1) + '…' : s) : null;
  };
  function nameRow(r) {
    const n = _names[r.id];
    r.name = cleanName(n ? n.name : r.vestName);
    r.label = r.name ? `${r.base} ("${r.name}")` : r.base;
  }
  const shortName = (r) => r.name || r.base; // what the panel's rows show
  function noteNames(list) {
    let changed = false;
    for (const a of list || []) {
      if (!a || !a.accountId || !('name' in a)) continue; // a user-state without names: the last known stays
      const rev = Number.isFinite(+a.revision) ? +a.revision : 0,
        had = _names[a.accountId];
      if (had && rev < had.rev) continue; // an older answer than what's known
      _names[a.accountId] = { name: a.name || null, rev };
      const r = S.byId[a.accountId];
      if (!r) continue;
      const was = r.label;
      nameRow(r);
      if (r.label !== was) changed = true;
    }
    if (changed && _root) render();
  }
  // A rename the page saves: shown at once, above any read already on its way (half a revision ahead); Vest's next read
  // brings the real revision. Refused: the old name comes back.
  function notePageRename(url, body) {
    const m = /\/v3\/user-state\/accounts\/([^/?#]+)/.exec(url),
      req = parseJson(body, null);
    if (!m || !req || typeof req !== 'object' || !('name' in req)) return null;
    const id = decodeURIComponent(m[1]),
      had = _names[id] || null;
    _names[id] = { name: req.name || null, rev: (had ? had.rev : 0) + 0.5 };
    const r = S.byId[id];
    if (r) {
      nameRow(r);
      if (_root) render();
    }
    return { kind: 'name', id, had };
  }
  function pageRenameDone(change, status) {
    if (status >= 200 && status < 300) return;
    if (change.had) _names[change.id] = change.had;
    else delete _names[change.id];
    const r = S.byId[change.id];
    if (r) {
      nameRow(r);
      if (_root) render();
    }
  }

  // True equity per account (balance + unrealized PnL) from the performance series — what Vest measures
  // drawdown against — and the unrealized PnL in it. /v3/accounts `amount` is only FREE collateral (under-reports while a
  // position is open), which is what Vest's trading power is built on.
  // → { accountId: { equity, upnl } }
  async function fetchEquities() {
    try {
      // the last half hour at one point a minute: the freshest the series gets (a 2-day window gave ~6-minute points)
      const now = Date.now();
      const r = await api(`/v3/trading-performance/series?from=${now - 30 * 60000}&to=${now}&points=30`);
      const latestTs = {},
        out = {};
      for (const it of r.items || []) {
        const id = it.account_id,
          ts = it.ts || 0;
        if (latestTs[id] == null || ts > latestTs[id]) {
          latestTs[id] = ts;
          out[id] = { equity: num(it.equity_value), upnl: num(it.total_unrealized_pnl) || 0 };
        }
      }
      return out;
    } catch {
      return {};
    }
  }

  // Free cash of every account (and the Primary Account's id), asked for the way Vest's own page asks: active accounts
  // only, up to BALANCES_LIMIT. Without `active`, every failed account a user ever had is listed too, and a user with many
  // could have a live account fall off the page (seen: "couldn't read its balance", equity stuck at the start).
  async function fetchBalances() {
    const res = await api(`/v3/accounts?active=true&limit=${BALANCES_LIMIT}`);
    const free = {},
      ver = {};
    let primary = null;
    for (const a of (res && res.accounts) || []) {
      free[a.account_id] = num(a.amount);
      ver[a.account_id] = parseInt(a.balance_version, 10);
      if (a.account_type === 1) primary = a.account_id;
    }
    return { free, ver, primary };
  }

  async function buildRegistry() {
    const [active, bals, eq, us] = await Promise.all([
      api('/v3/capital/accounts/active'),
      fetchBalances().catch(() => ({ free: {}, ver: {} })),
      fetchEquities(),
      api('/v3/user-state').catch(() => null), // the names the trader gave the accounts
    ]);
    if (us && Array.isArray(us.accounts)) noteNames(us.accounts);
    const balById = bals.free;
    const rows = (active.accounts || []).map((a) => {
      const initial = num(a.initial_capital),
        floor = num(a.max_drawdown_limit);
      const eqv = eq[a.id] && eq[a.id].equity;
      // unknown until a balance is read: shown as "—", never as the starting balance (a believable $0.00 P&L)
      const equity = eqv != null && !isNaN(eqv) ? eqv : (balById[a.id] ?? NaN),
        maxDD = initial - floor;
      const r = {
        id: a.id,
        base: label(a),
        vestName: a.name || null, // a name on Vest's account list, if it ever carries one (user-state's comes first)
        type: typeName(a.account_type, a.plan_product_type),
        chip: shortType(a.account_type, a.plan_product_type),
        size: initial,
        floor,
        equity,
        free: balById[a.id] ?? NaN,
        balVer: bals.ver[a.id] >= 0 ? bals.ver[a.id] : 0,
        upnl: (eq[a.id] && eq[a.id].upnl) || 0,
        usedPct: maxDD > 0 ? Math.min(1, Math.max(0, (initial - equity) / maxDD)) : 0,
        leverage: num(a.max_leverage),
        accountType: a.account_type,
        planId: a.plan_id || null,
        groupKey: initial + '|' + typeName(a.account_type, a.plan_product_type),
        canTrade: null,
        order: a.attempt_index ?? 0,
      };
      nameRow(r); // r.name, r.label
      setLimits(r, a);
      r.room = r.equity - floorOf(r);
      return r;
    });
    await Promise.all(
      rows.map(async (r) => {
        try {
          r.canTrade = (await mintAccountToken(r.id)).canTrade;
        } catch {
          r.canTrade = null;
        }
      }),
    );
    const before = S.byId;
    S.byId = Object.fromEntries(rows.map((r) => [r.id, r]));
    // An account that failed or closed is no longer in the active list: let go of it everywhere (a selected one too)
    for (const id of Object.keys(before)) if (!S.byId[id]) forgetAccount(id, before[id].label);
    if (S.master && !S.byId[S.master]) forgetAccount(S.master, null);
    [...S.followers].forEach((f) => !S.byId[f] && forgetAccount(f, null));
    regroup();
    return S.groups;
  }
  function regroup() {
    const groups = {};
    for (const r of Object.values(S.byId))
      (groups[r.groupKey] = groups[r.groupKey] || { size: r.size, type: r.type, key: r.groupKey, rows: [] }).rows.push(
        r,
      );
    const gl = Object.values(groups);
    gl.forEach((g) => g.rows.sort((a, b) => a.order - b.order)); // lowest account number first
    S.groups = gl.sort((a, b) => b.size - a.size || a.type.localeCompare(b.type));
  }

  // An account that is no longer active (failed, closed). A follower is dropped from the copy and the copier stays armed
  // for the others; the master failing disarms, since there's nothing left to copy. Vest has already closed its
  // positions, so it leaves every trade and the orphan list too.
  function forgetAccount(id, label) {
    const name = label || accLabel(id),
      wasMaster = S.master === id,
      wasFollower = S.followers.has(id);
    delete S.byId[id];
    delete S.acctState[id];
    for (const e of Object.values(S.posMap)) delete e.followers[id];
    if (S.orphan) {
      const list = S.orphan.list.filter((o) => o.accountId !== id);
      S.orphan = list.length ? { list } : null;
    }
    if (S.arming && (wasMaster || wasFollower)) _armEpoch++; // the arm in progress was for a selection that's gone
    if (wasFollower) S.followers.delete(id);
    if (wasMaster) S.master = null;
    breachReason(id).then((why) => why && logEvent('warn', `${name}: ${why}.`));
    if (!wasMaster && !wasFollower) return logEvent('info', `${name} is no longer active: removed from the list.`);
    const role = wasMaster ? 'the master' : 'a follower';
    if (S.armed && (wasMaster || !S.followers.size)) {
      disarm();
      logEvent(
        'warn',
        `${name} (${role}) is no longer active — copying stopped${wasMaster ? '' : ': no followers left'}.`,
      );
    } else
      logEvent(
        'warn',
        `${name} (${role}) is no longer active — removed${S.armed ? '; still copying to the other followers' : ''}.`,
      );
    diag('account_gone', { account: id, label: name, role, armed: S.armed });
  }
  // Vest's own record of why an account failed, in words; null when it can't be read.
  async function breachReason(id) {
    try {
      const b = await api(`/v3/capital/accounts/${encodeURIComponent(id)}/breach`);
      const eq = num(b && b.equity),
        dd = num(b.max_drawdown_limit),
        daily = num(b.daily_loss_limit);
      if (!(eq > 0) || !(dd > 0 || daily > 0)) return null;
      const isDaily = daily > 0 && !(dd >= daily);
      return `equity ${money(eq)} reached its ${isDaily ? 'daily loss floor' : 'drawdown floor'} of ${money(isDaily ? daily : dd)}`;
    } catch {
      return null;
    }
  }

  const accLabel = (id) => (S.byId[id] && S.byId[id].label) || id.slice(0, 8);

  // An account's limits from /v3/capital/accounts/active. On plans with a daily loss limit, Vest also closes the account
  // at the daily floor (reset each day at 20:00 ET), so the floor that applies is whichever of the two is higher. The
  // target (an evaluation's pass line) is above the starting size only while there is a goal to reach.
  function setLimits(r, a) {
    r.floor = num(a.max_drawdown_limit);
    const daily = num(a.daily_loss_floor);
    r.dailyFloor = num(a.max_daily_loss_pct) > 0 && daily > 0 ? daily : null;
    const target = num(a.target_equity);
    r.target = target > r.size ? target : null;
    r.split = num(a.max_profit_split_pct) || 0; // your share of claimed profit, e.g. 0.8
  }
  const floorOf = (r) => Math.max(r.floor || 0, r.dailyFloor || 0);
  // What an account pays you if its profit is claimed now: profit × its split (Vest applies the split flat at each claim,
  // with no other deductions). Only funded accounts (live and Instant) pay out: an evaluation's profit doesn't, and claims
  // are per account, so one in a loss pays nothing rather than taking from the others.
  const isFunded = (r) => r.accountType === 3;
  // Vest pays each claim cut down to the cent ($122.97 at 80% pays $98.37), so the shares are too.
  const centsDown = (n) => Math.floor(n * 100 + 1e-6) / 100;
  // With trades open, closing them first costs Vest's closing fee (taker fee × size × price), so it comes off; slippage
  // on the close can't be known ahead and isn't counted.
  const closeFeeOf = (r) => {
    const st = S.acctState && S.acctState[r.id];
    if (!st || !Array.isArray(st.positions)) return 0;
    return st.positions.reduce((a, p) => {
      const m = SYMBOLS[p.symbol],
        px = priceOf(p.symbol) || p.openPrice;
      return a + (m && m.takerFee > 0 && px > 0 ? p.qty * px * m.takerFee : 0);
    }, 0);
  };
  const keepOf = (r) => {
    const profit = r.equity - closeFeeOf(r) - r.size;
    return isFunded(r) && r.split > 0 && profit > 0 ? centsDown(profit * r.split) : 0;
  };

  // keep balances / room fresh
  let _balTimer = null;
  // Each account's open positions and resting orders (also what the Trade tab reads for the master).
  async function readOpenState(id) {
    const { token } = await mintAccountToken(id);
    const [pos, ord] = await Promise.all([
      api('/v3/positions/opened', token),
      api('/v3/positions/opened-orders', token),
    ]);
    return {
      positions: ((pos && pos.positions) || [])
        .map((p) => ({
          id: posIdOf(p),
          symbol: p.symbol,
          side: p.side,
          qty: num(p.quantity),
          openPrice: num(p.openPrice),
          collateral: num(p.collateral) || 0,
          leverage: num(p.leverage) || null,
          triggers: posLegs(p).map((l) => ({ id: l.id, kind: l.kind, price: l.price })),
        }))
        .filter((p) => p.qty > 0),
      ordersCollateral: ((ord && ord.orders) || []).reduce(
        (sum, o) => (o.reduceOnly || o.reduce_only ? sum : sum + (num(o.collateral) || 0)),
        0,
      ),
      orders: ((ord && ord.orders) || []).map(limitOrderOf).filter(Boolean),
      // a resting limit's stop and targets wait on its size-0 position until it fills (Vest draws them only then)
      pendingLegs: Object.fromEntries(
        ((pos && pos.positions) || [])
          .filter((p) => !(num(p.quantity) > 0) && posIdOf(p))
          .map((p) => [
            posIdOf(p),
            [
              ...(p.takeProfits || []).map((b) => pendingLegOf('tp', b)),
              ...(p.stopLosses || []).map((b) => pendingLegOf('sl', b)),
            ].filter((l) => l.id),
          ]),
      ),
      at: Date.now(),
    };
  }
  // A pending stop or target from Vest's REST position: its size only when it's a sized one, and how it executes.
  const pendingLegOf = (kind, b) => ({
    id: b.id || null,
    kind,
    price: parseFloat(b.triggerPrice),
    qty: b.quantity != null && b.sizeMode !== 'full_position' ? String(b.quantity) : null,
    exec: b.executionType || 'market',
  });
  // A resting limit entry (not a reduce), from Vest's REST list (camelCase or snake_case) or its feed: the Trade tab lists
  // the master's with a cancel button. Anything else is null.
  function limitOrderOf(o) {
    if (!o) return null;
    const id = o.orderId || o.order_id || o.id,
      type = o.orderType || o.order_type;
    if (!id || type !== 'limit' || o.reduceOnly || o.reduce_only) return null;
    if (/CLOSE|REDUCE/i.test(o.positionOrderType || o.position_order_type || '')) return null; // a limit close: an exit
    const side = String(o.side || '').toLowerCase();
    return {
      id,
      positionId: o.positionId || o.position_id || null, // the size-0 placeholder holding its pending stop and targets
      symbol: o.symbol,
      isBuy: o.isBuy === true || side === 'buy' || side === 'long',
      price: num(o.price),
      qty: num(o.quantity),
      filled: num(o.executedQuantity ?? o.executed_quantity) || 0, // part filled: its stop and targets are live now
      leverage: num(o.leverage) || null,
      expiration: o.expirationTime ?? o.expiration_time ?? null, // a re-placed limit keeps it, as Vest's own drag does
    };
  }
  // Mark prices for these symbols: the live feed when it's fresh, else one public ticker read.
  async function markPrices(syms) {
    const out = {},
      need = [];
    for (const sym of syms) priceOf(sym) ? (out[sym] = priceOf(sym)) : need.push(sym);
    if (need.length) {
      try {
        const r = await (
          await _fetch(`${API}/v3/ticker/latest?symbols=${need.map(encodeURIComponent).join(',')}`)
        ).json();
        for (const t of r.tickers || []) if (parseFloat(t.markPrice) > 0) out[t.symbol] = parseFloat(t.markPrice);
      } catch {
        /* best effort: nothing to do if this fails */
      }
    }
    return out;
  }

  // Equity the way Vest's Account Value computes it, live: free cash + the collateral held by open positions and resting
  // orders + their open PnL at the mark price. A flat account's equity is exactly its free cash, current the moment a
  // trade closes. The performance series (minute points, a minute or more behind) is only the fallback when an
  // account's positions can't be read.
  let _balBusy = false,
    _balAgain = false,
    _soonTimer = null;
  // A read soon after an order (any account, any page): positions and cash change on a fill, not with the price.
  function refreshSoon() {
    if (feedLive()) return; // the live feed has already carried what the order changed
    clearTimeout(_soonTimer);
    _soonTimer = setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
  }
  // A full read of every account: the active list (an account that failed or a new one), balances, positions and orders.
  // With the live feed up it runs every FEED_BACKSTOP_MS, else every BALANCE_POLL_MS. An account the feed has spoken
  // about since this read began keeps the feed's newer state.
  let _lastFullRead = 0;
  async function refreshBalances() {
    if (!userTokenOk()) return;
    if (!Object.keys(S.byId).length) return loadFirstAccounts();
    if (_balBusy) {
      _balAgain = true; // one more read right after this one, so a fill during a read isn't missed
      return;
    }
    _balBusy = true;
    const t0 = Date.now();
    try {
      const [bals, eq, active, us] = await Promise.all([
        fetchBalances().catch(() => ({ free: {}, ver: {} })),
        fetchEquities(),
        api('/v3/capital/accounts/active').catch(() => null), // failed or new accounts; the daily floor moves daily
        api('/v3/user-state').catch(() => null), // a rename made elsewhere (another tab, Vest's app)
      ]);
      if (us && Array.isArray(us.accounts)) noteNames(us.accounts);
      if (active && Array.isArray(active.accounts)) await syncAccountSet(active.accounts);
      for (const a of (active && active.accounts) || []) if (S.byId[a.id]) setLimits(S.byId[a.id], a);
      const bal = bals.free;
      const ids = Object.keys(S.byId);
      const states = await Promise.all(ids.map((id) => readOpenState(id).catch(() => null)));
      const marks = await markPrices([
        ...new Set(states.flatMap((st) => (st ? st.positions.map((p) => p.symbol) : []))),
      ]);
      const live = {};
      ids.forEach((id, i) => {
        const st = states[i],
          r = S.byId[id],
          free = bal[id];
        if (!r || (_feedAt[id] || 0) >= t0) return; // the feed said something newer meanwhile
        if (free >= 0 && !(bals.ver[id] < (r.balVer || 0))) {
          r.free = free;
          if (bals.ver[id] >= 0) r.balVer = bals.ver[id];
        }
        if (!st || !(r.free >= 0)) return;
        st.cash = r.free + st.positions.reduce((a, p) => a + p.collateral, 0) + st.ordersCollateral;
        st.marks = marks;
        S.acctState[id] = st;
        if (st.positions.some((p) => !(priceOf(p.symbol) || marks[p.symbol] > 0))) return; // a price is missing
        live[id] = true;
      });
      for (const sym of heldSymbols()) watchPrice(sym); // open P&L then follows every price tick
      unwatchUnused();
      for (const id in S.byId) {
        if (live[id] && revalue(id)) continue;
        if ((_feedAt[id] || 0) >= t0) continue;
        const r = S.byId[id],
          src = eq[id]; // the performance series: only when positions or a price couldn't be read
        if (src) r.upnl = src.upnl;
        const e = src && !isNaN(src.equity) ? src.equity : bal[id];
        if (e == null || isNaN(e)) continue;
        setEquity(r, e);
      }
      _lastFullRead = Date.now();
      if (S.tradeOpen) refreshTradeState();
      render();
    } catch {
      /* best effort: nothing to do if this fails */
    } finally {
      _balBusy = false;
      if (_balAgain) {
        _balAgain = false;
        setTimeout(refreshBalances, 0);
      }
    }
  }
  // No accounts yet (all failed, or none bought): look again, and load them as soon as Vest lists one.
  async function loadFirstAccounts() {
    if (!_root || S.arming) return;
    try {
      const r = await api('/v3/capital/accounts/active');
      if (!((r && r.accounts) || []).length || Object.keys(S.byId).length) return;
      await refresh();
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  // The active list changed: let go of accounts that failed or closed, and load new ones. True when anything changed.
  async function syncAccountSet(list) {
    const ids = new Set(list.map((a) => a.id));
    const gone = Object.keys(S.byId).filter((id) => !ids.has(id)),
      added = list.filter((a) => !S.byId[a.id]);
    gone.forEach((id) => forgetAccount(id, null));
    if (added.length) {
      await buildRegistry();
      const names = added.map((a) => accLabel(a.id));
      logEvent('info', `New account${names.length > 1 ? 's' : ''} loaded: ${names.join(', ')}.`);
    }
    if (!gone.length && !added.length) return false;
    regroup();
    dropClaimReview(); // it named the accounts as they were
    render();
    return true;
  }
  // Vest reported an account failing or appearing: read the active list now, and once more shortly after in case the
  // first read was a moment ahead of Vest's own update.
  let _syncTimer = null;
  function syncAccountsSoon() {
    if (_syncTimer) return;
    _syncTimer = setTimeout(() => {
      _syncTimer = null;
      refreshBalances();
      setTimeout(refreshBalances, 3000);
    }, 200);
  }
  // State this old is only trusted while the live feed is up (it would have told us about any change since).
  const stateFresh = (st) => !!st && (feedLive() || Date.now() - st.at < LIVE_STALE_MS);
  function setEquity(r, equity) {
    r.equity = equity;
    r.room = r.equity - floorOf(r);
    const maxDD = r.size - r.floor;
    r.usedPct = maxDD > 0 ? Math.min(1, Math.max(0, (r.size - r.equity) / maxDD)) : 0;
  }
  // An account's equity from its cash and open positions at the latest price (Vest's mid when its book is live). False
  // when it can't be worked out (no state, or no price for one of its markets): the last figure stays.
  function revalue(id) {
    const st = S.acctState[id],
      r = S.byId[id];
    if (!r || !st || !(st.cash >= 0) || !stateFresh(st)) return false;
    let upnl = 0;
    for (const p of st.positions) {
      const px = priceOf(p.symbol) || (st.marks && st.marks[p.symbol]);
      if (!(px > 0)) return false;
      upnl += (p.side === 'long' ? 1 : -1) * p.qty * (px - p.openPrice);
    }
    r.upnl = upnl;
    setEquity(r, st.cash + upnl);
    return true;
  }

  // ── Live P&L between reads. Cash and positions only change when something fills, so each price tick just re-prices the
  // open positions from the last read: equity = cash + open PnL at the latest price, as Vest's own Account Value moves.
  // When the price crosses one of a position's own stops or targets, Vest is about to fill it: read again right away.
  const heldSymbols = () => [
    ...new Set(Object.values(S.acctState || {}).flatMap((st) => (st ? st.positions.map((p) => p.symbol) : []))),
  ];
  let _liveRenderAt = 0,
    _liveRenderTimer = null,
    _pointerDown = false;
  // A stop or target the price sits past without Vest filling it (stops and targets trigger on the mid, not the mark) would ask
  // for a read on every new state: at most one per account per CROSSED_COOLDOWN_MS. State older than LIVE_STALE_MS
  // (reads failing) isn't re-priced: its positions may be gone.
  const CROSSED_COOLDOWN_MS = 15000,
    LIVE_STALE_MS = 60000,
    _crossedAt = {};
  function tickEquity(sym) {
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
  function liveRender() {
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
  function startBalancePoll() {
    if (_balTimer) clearInterval(_balTimer);
    _balTimer = setInterval(() => {
      if (feedLive() && Date.now() - _lastFullRead < FEED_BACKSTOP_MS) return; // the feed is carrying every change
      refreshBalances();
    }, BALANCE_POLL_MS);
  }

  // ── Keep-warm, while copying. With Vest's live feed up the copier otherwise talks to Vest about once a minute, and a
  // connection left idle that long can be closed: the next order would then wait for a new one (two extra round trips
  // before it even leaves). Every WARM_MS while copying (and at Start), account tokens close to expiring are renewed (an
  // order never waits on one) and one small read goes out on the copier's connection, timed: the time to Vest the
  // status card shows (`S.net`: the last 5 minutes' reads, one every 20 s), summed up in the diagnostics every few
  // minutes. A read that gets no answer within NET_TIMEOUT_MS (or a server error) is a miss: "Vest not answering"
  // until one answers again. Test connection (`testConnection`) makes its own reads and never touches these.
  const WARM_MS = 20000,
    TOKEN_EARLY_MS = 180000,
    NET_TIMEOUT_MS = 5000, // no answer this long: a miss (Vest's reads usually answer in well under a second)
    NET_WINDOW_MS = 5 * 60000, // the card's bars: the last 5 minutes...
    NET_BARS = 15, // ...one per read
    NET_GOOD_MS = 80, // under this: good; to NET_OK_MS: OK; over: slow
    NET_OK_MS = 200,
    NET_DIAG_MS = 5 * 60000;
  S.net = { samples: [], last: null, at: 0, fails: 0, missSince: null, test: null };
  let _netDiagAt = 0;
  const pctOf = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
  const netLevel = (ms) => (ms < NET_GOOD_MS ? 'good' : ms <= NET_OK_MS ? 'ok' : 'slow');
  // One small read on the copier's own connection, timed to Vest's answer: ms, null when Vest didn't answer properly
  // (no answer, or a refusal: an order would fail too), or undefined when there's nothing to read with yet.
  async function timedRead() {
    const id = S.master && S.byId[S.master] ? S.master : Object.keys(S.byId)[0];
    if (!id || !userTokenOk()) return undefined;
    let token;
    try {
      token = (await mintAccountToken(id)).token;
    } catch {
      return null;
    }
    const ctl = typeof AbortController === 'function' ? new AbortController() : null,
      timer = ctl && setTimeout(() => ctl.abort(), NET_TIMEOUT_MS);
    const t0 = performance.now();
    try {
      const r = await _fetch(API + '/v3/positions/opened', {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        ...(ctl ? { signal: ctl.signal } : {}),
      });
      const ms = Math.round(performance.now() - t0); // to Vest's answer arriving, before reading its body
      noteRate(r);
      await r.text();
      if (r.status === 401 && acctTokens[id] && acctTokens[id].token === token) delete acctTokens[id]; // a new one next
      return r.ok ? ms : null;
    } catch {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  // The steadiness of the last 5 minutes' answers: half the spread between the fastest and slowest, leaving out the
  // single highest and lowest once there are five or more (one stray read doesn't make a connection uneven). null with
  // fewer than three answers.
  function netJitter() {
    const v = S.net.samples
      .filter((x) => x.ms != null)
      .map((x) => x.ms)
      .sort((a, b) => a - b);
    if (v.length < 3) return null;
    const w = v.length >= 5 ? v.slice(1, -1) : v;
    return Math.round((w[w.length - 1] - w[0]) / 2);
  }
  // What the readout shows: off (not copying), none (copying, no read yet), good, ok, slow, down (not answering).
  function netState() {
    if (!S.armed) return 'off';
    const n = S.net,
      last = n.samples[n.samples.length - 1];
    if (n.missSince) return 'down';
    return last ? netLevel(last.ms) : 'none';
  }
  function noteNet(ms) {
    const n = S.net,
      now = Date.now();
    n.samples = [...n.samples.filter((x) => now - x.at < NET_WINDOW_MS), { ms, at: now }].slice(-NET_BARS);
    n.at = now;
    if (ms == null) {
      n.fails++;
      n.missSince = n.missSince || now;
    } else {
      n.last = ms;
      n.missSince = null;
    }
    renderConn();
    if (now - _netDiagAt < NET_DIAG_MS) return;
    _netDiagAt = now;
    const s = n.samples
      .filter((x) => x.ms != null)
      .map((x) => x.ms)
      .sort((a, b) => a - b);
    diag('connection', {
      reads: n.samples.length,
      missed: n.samples.length - s.length,
      medianMs: s.length ? pctOf(s, 0.5) : null,
      p90Ms: s.length ? pctOf(s, 0.9) : null,
      maxMs: s.length ? s[s.length - 1] : null,
      jitterMs: netJitter(),
    });
  }
  async function warmTick() {
    if (!S.armed || !S.master || !userTokenOk()) return;
    const ids = [S.master, ...S.followers];
    try {
      await Promise.all(ids.map((id) => mintAccountToken(id, TOKEN_EARLY_MS)));
    } catch {
      /* a token that can't be renewed now is renewed by the next request that needs it */
    }
    if (!S.armed) return;
    if (feedLive()) Object.values(S.posMap).forEach((e) => (checkShares(e), checkBrackets(e))); // size and bracket checks, from the feed
    const ms = await timedRead();
    if (ms !== undefined && S.armed) noteNet(ms);
  }
  setInterval(warmTick, WARM_MS);

  // Every account's saved per-symbol leverage, in one call (GET /v3/user-state, user token). null if it can't be read.
  async function fetchLeverages() {
    try {
      const r = await api('/v3/user-state');
      noteNames(r && r.accounts); // the same read carries the accounts' names
      const out = {};
      for (const a of r.accounts || []) {
        out[a.accountId] = {};
        for (const l of a.leverages || []) out[a.accountId][l.symbol] = l.leverage;
      }
      return withPageLevs(out);
    } catch {
      return null;
    }
  }
  const levFor = (levs, id, sym) => (levs && levs[id] && levs[id][sym] != null ? +levs[id][sym] : null);

  // ───────────────────────── executor ─────────────────────────
  // Follower orders use each follower's own account token, with an Idempotency-Key on every order.
  const idem = () => ({
    'Idempotency-Key': crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
  });
  async function acctSend(method, id, path, body, key) {
    const { token } = await mintAccountToken(id);
    return api(path, token, { method, body: JSON.stringify(body), headers: key ? { 'Idempotency-Key': key } : idem() });
  }
  const acctPost = (id, path, body) => acctSend('POST', id, path, body);
  const acctPut = (id, path, body) => acctSend('PUT', id, path, body);
  const acctDelete = (id, path, body) => acctSend('DELETE', id, path, body);
  async function setFollowerLeverage(id, sym, lev) {
    const { token } = await mintAccountToken(id);
    const path = `/v3/user-state/accounts/${id}/leverages/${encodeURIComponent(sym)}`;
    return api(path, token, { method: 'PUT', body: JSON.stringify({ leverage: String(lev) }) });
  }
  // The master's leverage changed on Vest's ticket while copying: each follower gets it now, so the next copied entry
  // doesn't wait on a leverage change before it goes out. A follower holding a position on that market is left alone,
  // as when copying starts (its copied entry still sets it, as before).
  function presetFollowerLeverage(change) {
    if (!S.armed || change.id !== S.master) return;
    const want = levKey(change.lev);
    for (const f of S.followers) {
      const key = f + '|' + change.sym,
        st = S.acctState[f];
      if (S.levCache[key] === want || (st && st.positions.some((p) => p.symbol === change.sym))) continue;
      setFollowerLeverage(f, change.sym, want).then(
        () => (S.levCache[key] = want),
        (e) => diag('leverage', { ...who(f), symbol: change.sym, set: want, error: e.message, early: true }),
      );
    }
  }
  // Vest requires a leverage on close orders: the request's, else the one synced for this account and market, else a
  // default.
  const closeBody = (symbol, positionId, leverage, accountId) => ({
    symbol,
    positionId,
    orderType: 'market',
    leverage: String(leverage || S.levCache[accountId + '|' + symbol] || DEFAULT_LEVERAGE),
  });
  // Market, IOC and fill-or-kill orders execute at once (or not at all), so their fills can be checked; a resting limit
  // order has nothing to find yet.
  const isImmediate = (req) =>
    !req || req.orderType === 'market' || req.timeInForce === 'IOC' || req.timeInForce === 'FOK';
  const who = (id) => ({ account: id, label: accLabel(id) }); // the account fields every diag record carries
  const msSince = (t0) => Math.round(performance.now() - t0);
  const entryByOrderId = (oid) => Object.values(S.posMap).find((e) => e.masterOrderId === oid);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const EXEC_PAGE = 200;
  // Fill price/time for one order, matched by order id in /v3/executions.
  // Returns { price, at } when filled, null when Vest's history has no such fill, or undefined when the lookup itself
  // failed: a failed lookup must never be read as "did not fill".
  // The live feed answers first (within FEED_FILL_WAIT_MS): a fill, or Vest saying it didn't run the order. Only then is
  // Vest's fill history asked.
  async function fillInfo(accountId, symbol, orderId, feedWait = FEED_FILL_WAIT_MS) {
    const ff = await feedFill(orderId, feedWait);
    if (ff) return ff.missing ? null : { price: ff.price, at: ff.at, src: 'feed' };
    try {
      const { token } = await mintAccountToken(accountId);
      const nowS = Math.floor(Date.now() / 1000),
        win = EXEC_WINDOW_S;
      const q = `account_id=${encodeURIComponent(accountId)}&symbol=${encodeURIComponent(symbol)}&from=${nowS - win}&to=${nowS + win}&limit=${EXEC_PAGE}`;
      const r = await api(`/v3/executions?${q}`, token);
      if (!r || !Array.isArray(r.items)) return undefined; // a changed response shape is not "no fill"
      const it = r.items.find((x) => x.id === orderId);
      if (it) return { price: parseFloat(it.price), at: it.executedAt };
      return r.items.length >= EXEC_PAGE ? undefined : null; // a full page may have pushed it out: unknown
    } catch {
      return undefined;
    }
  }

  // A fill time as epoch ms, from Vest's seconds, milliseconds, nanoseconds or a date string; null when unreadable.
  const fillMs = (v) => {
    const n = typeof v === 'number' ? v : /^\d+(\.\d+)?$/.test(String(v)) ? +v : Date.parse(v);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.round(n > 1e17 ? n / 1e6 : n > 1e14 ? n / 1e3 : n < 1e11 ? n * 1000 : n);
  };
  // The last copied trade's result for the status card: { pts, gapMs } (the followers' average distance from the
  // master's fill, and how long after), or { notSent } when a follower's order couldn't go out.
  S.lastCopy = null;
  function noteLastCopy(c) {
    S.lastCopy = { ...c, at: Date.now() };
    renderConn();
  }
  const noteNotSent = () => noteLastCopy({ notSent: true });
  // Confirm that every order actually filled. Vest can accept an order (HTTP 200, ids returned) and still not execute
  // it, so each one is looked up in /v3/executions, with retries for propagation lag. Only immediate (market) orders
  // are checked; a resting limit order has nothing to find yet.
  //   master = { accountId, orderId, qty, undo? }   placed = [{ accountId, orderId, label, qty, diag, undo?, positionId }]
  //   kind   = 'entry' | 'add' | 'close'
  // A follower that misses an entry is dropped from the trade; one that misses an add has its size rolled back (`undo`)
  // and the trade's sizes are re-read; one that misses a close is still open, and says so. If the master's own entry
  // didn't fill, its trade is forgotten and any follower that did fill is raised as an orphan. When Vest's history
  // can't be read, nothing is changed: the trader is told the fills couldn't be confirmed.
  const NO_FILL_WHY = 'Vest accepted the order but did not execute it (usually not enough margin for that size)';
  const NO_FILL_LIMIT = "its limit price wasn't there (fill now or not at all), so nothing opened";
  const _missNoted = new Set(); // master order ids the Trade tab already reported as not filled (a capped stop entry)
  // One order's fill, looked up to FILL_TRIES times: { fill } when filled, { missing: true } when confirmed absent, {}
  // when it couldn't be checked
  async function fillOf(acct, symbol, oid) {
    let failed = false;
    for (let i = 0; i < FILL_TRIES; i++) {
      const f = await fillInfo(acct, symbol, oid, i ? 0 : FEED_FILL_WAIT_MS); // the feed is waited on once
      if (f) return { fill: f };
      if (f === undefined) failed = true;
      if (i < FILL_TRIES - 1) await sleep(FILL_RETRY_MS);
    }
    return failed ? {} : { missing: true };
  }
  async function confirmFills(symbol, master, placed, entry, kind = 'entry') {
    if (!placed.length && !master.orderId) return;
    if (!feedLive()) await sleep(FILL_FIRST_LOOK_MS); // with the feed, each check waits on it instead
    const tryFill = (acct, oid) => fillOf(acct, symbol, oid);
    const m = master.orderId ? await tryFill(master.accountId, master.orderId) : {};
    const mp = m.fill || null;
    const masterMissed = !!m.missing;
    // the Trade tab already said its capped stop entry filled nothing: no second account of the same miss
    const quiet = masterMissed && _missNoted.delete(master.orderId);
    // the master's entry filled nothing: followers that filled nothing either are the right outcome, said once below
    const asMaster = masterMissed && kind === 'entry';
    if (masterMissed) {
      if (!quiet)
        logEvent(
          'warn',
          `MASTER ${accLabel(master.accountId)} did NOT fill — ${master.ioc ? NO_FILL_LIMIT : NO_FILL_WHY}.`,
        );
      diag('master_no_fill', { ...who(master.accountId), symbol, kind, orderId: master.orderId, qty: master.qty });
      if (master.undo) master.undo();
      if (kind === 'entry' && entry) {
        const key = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
        if (key) delete S.posMap[key];
      }
    }
    const pv = (SYMBOLS[symbol] && SYMBOLS[symbol].pointValue) || 1;
    const noFill = [],
      unknown = [],
      unknownPlaced = [],
      filledWithoutMaster = [];
    let filled = 0,
      undone = false,
      slipSum = 0,
      slipMax = 0,
      slipN = 0;
    const gaps = []; // how long after the master each copy filled, where both times are known to the millisecond
    await Promise.all(
      placed.map(async (p) => {
        const r = await tryFill(p.accountId, p.orderId);
        if (!r.fill && !r.missing) {
          unknown.push(p.label);
          unknownPlaced.push(p);
          return;
        }
        if (r.missing) {
          const msg =
            kind === 'close'
              ? `${p.label}'s close did NOT fill — it is still OPEN. Close it on Vest.`
              : kind === 'add'
                ? `${p.label} did NOT fill the add — its original position is unchanged.`
                : `${p.label} did NOT fill — not in this trade.`;
          if (!quiet && !asMaster) logEvent('warn', msg);
          if (p.undo) {
            p.undo();
            undone = true;
          } else if (kind === 'entry' && entry) delete entry.followers[p.accountId];
          if (p.diag) {
            Object.assign(p.diag, {
              filled: false,
              met: asMaster,
              reason: asMaster ? 'the master did not fill either' : master.ioc ? NO_FILL_LIMIT : NO_FILL_WHY,
            });
            persistDiagSoon();
          }
          noFill.push(p.label);
          return;
        }
        const fp = r.fill;
        filled++;
        if (masterMissed) filledWithoutMaster.push(p);
        const qty = parseFloat(p.qty) || parseFloat(master.qty) || 0;
        const d = mp ? +(fp.price - mp.price).toFixed(4) : null;
        if (d != null) {
          slipSum += Math.abs(d);
          slipMax = Math.max(slipMax, Math.abs(d));
          slipN++;
        }
        if (p.diag) {
          // when each filled, as Vest stamps it (the feed's execution time, else the fill history's): the gap is how far
          // behind the master the copy filled, the number that decides its slippage
          const fAt = fillMs(fp.at),
            mAt = mp ? fillMs(mp.at) : null;
          const o = {
            filled: true,
            fillPrice: fp.price,
            masterFillPrice: mp ? mp.price : null,
            slipPts: d,
            slipUsd: d != null ? +(Math.abs(d) * qty * pv).toFixed(4) : null,
            fillAt: fAt,
            masterFillAt: mAt,
            fillGapMs: fAt && mAt ? fAt - mAt : null,
            met: true,
          };
          if (fAt && mAt && (fAt % 1000 || mAt % 1000)) gaps.push(Math.max(0, fAt - mAt)); // whole seconds: unknown
          const lev = parseFloat(p.diag.leverage),
            fEq = +p.diag.fEq;
          if (lev > 0 && qty > 0) {
            // margin used vs. the account's equity
            const mu = (fp.price * qty * pv) / lev;
            o.marginUsed = +mu.toFixed(2);
            if (fEq > 0) {
              o.marginCap = +fEq.toFixed(2);
              o.marginUtilPct = +((mu / fEq) * 100).toFixed(1);
            }
          }
          Object.assign(p.diag, o);
          persistDiagSoon();
        }
      }),
    );
    if ((undone || (master.undo && masterMissed)) && entry) enqueue(entry, () => syncLegs(entry)); // re-read true sizes
    // the master didn't fill: a follower whose fill couldn't be checked may be holding alone, so read its position
    if (masterMissed && kind === 'entry')
      for (const p of unknownPlaced)
        try {
          if (await openPosition(p.accountId, symbol)) filledWithoutMaster.push(p);
        } catch {
          filledWithoutMaster.push(p); // unreadable: offer it rather than lose track (Flatten / Keep decides)
        }
    if (filledWithoutMaster.length && kind === 'entry') {
      const list = filledWithoutMaster.map((p) => ({
        accountId: p.accountId,
        positionId: p.positionId,
        leverage: p.diag && p.diag.leverage,
      }));
      raiseOrphans(symbol, list, 'the master entry did not fill', master.accountId);
    } else if (filledWithoutMaster.length && kind === 'add' && entry) {
      // Vest accepted the master's add and then didn't run it: the followers' adds that filled are taken back
      takeBackAdds(entry, filledWithoutMaster, master.req || { symbol, leverage: null }, {
        why: `MASTER add didn't fill, but ${filledWithoutMaster.map((p) => p.label).join(', ')} added: taking it back`,
        confirmed: true,
      });
    }
    if (m.fill === undefined && master.orderId && !masterMissed)
      unknown.unshift(accLabel(master.accountId) + ' (master)');
    if (unknown.length)
      logEvent(
        'warn',
        `Couldn't confirm fills for ${unknown.join(', ')} — Vest's fill history didn't answer. Check them on Vest.`,
      );
    if (entry && (kind === 'entry' || kind === 'add')) scheduleShareCheck(entry);
    if (!placed.length) return;
    // the status card's "Last copy": how far the followers filled from the master, on average, and how long after
    if (slipN)
      noteLastCopy({
        pts: slipSum / slipN,
        gapMs: gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null,
      });
    const n = placed.length - unknown.length;
    if ((quiet || asMaster) && !filled)
      logEvent('info', "↳ the followers' copies didn't fill either: nothing is open.");
    else if (noFill.length) logEvent('warn', `Fills ${filled}/${n} — not filled: ${noFill.join(', ')}.`);
    else if (slipN)
      logEvent(
        'ok',
        `Fills ${filled}/${n} confirmed · avg slip ${(slipSum / slipN).toFixed(2)} pt · max ${slipMax.toFixed(2)} pt`,
      );
    else if (filled) logEvent('ok', `Fills ${filled}/${n} confirmed`);
  }

  // ── Sizing. Size step of a symbol (0.0001 for NQ) and numbers written the way Vest's own client writes them:
  // fixed decimals with trailing zeros stripped ("0.5", "31241.25", "31241").
  const sizeStepOf = (sym) => (SYMBOLS[sym] || SYMBOLS[DEFAULT_SYMBOL]).step;
  const fmtNum = (n, dec) => {
    const s = (+n).toFixed(dec);
    return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
  };
  const fmtQty = (n, sym) => fmtNum(n, decimalsOf(sizeStepOf(sym)));

  // Cap-to-fit. Vest's initial margin is notional ÷ leverage. With leverage synced across accounts and the same market,
  // a follower's affordable size reduces to an equity ratio: no price lookup and no network call, so no added latency.
  // The proportional size gives the follower the same margin use, and so the same % risk, as the master. A follower with
  // equal or more equity sends the master's exact size; a smaller one is scaled down with a small buffer for fees and
  // equity that is up to one poll old. Returns the size to send, whether it was scaled, and whether to skip the account.
  const CAP_SAME_SIZE = 0.005; // cap-to-fit: within 0.5% of the master's equity counts as the same size
  function capQty(followerId, masterQtyStr, sym) {
    const mQ = parseFloat(masterQtyStr);
    const mEq = (S.byId[S.master] || {}).equity,
      fEq = (S.byId[followerId] || {}).equity;
    const calc = { mEq, fEq }; // recorded in diagnostics
    if (!S.capFit) return { qty: masterQtyStr, scaled: false, skip: false, calc };
    if (!(mQ > 0) || !(mEq > 0) || !(fEq > 0))
      // cap-to-fit can't size it: skip rather than send the master's full size to an account that may be much smaller
      return { qty: '0', scaled: false, skip: true, calc: { ...calc, reason: 'missing-equity' } };
    const prop = mQ * (fEq / mEq);
    calc.proportionalQty = +prop.toFixed(6);
    // Equal-size accounts a few cents apart (seen live: $499.988 vs $499.987) copy 1:1; the buffer is for real
    // differences in size.
    if (prop >= mQ || fEq >= mEq * (1 - CAP_SAME_SIZE)) return { qty: masterQtyStr, scaled: false, skip: false, calc };
    const buffered = prop * CAP_BUFFER;
    Object.assign(calc, { bufferedQty: +buffered.toFixed(6), buffer: CAP_BUFFER });
    const q = floorStep(buffered, sizeStepOf(sym)); // the symbol's step, not the master string's decimals
    if (!(q > 0)) return { qty: '0', scaled: false, skip: true, calc };
    return { qty: fmtQty(q, sym), scaled: true, skip: false, calc };
  }

  // Scale a master quantity (a reduce or an add) to a follower holding a different size, keeping the same fraction.
  function scaleToFollower(reqQtyStr, followerQtyStr, masterQtyStr, sym) {
    const rq = parseFloat(reqQtyStr),
      fq = parseFloat(followerQtyStr),
      mq = parseFloat(masterQtyStr);
    if (!(fq > 0) || !(mq > 0) || fq === mq) return reqQtyStr;
    const q = floorStep(rq * (fq / mq), sizeStepOf(sym));
    return q > 0 ? fmtQty(q, sym) : '0';
  }

  // Scale sized stop/target legs to a follower's size. Legs without a quantity cover the whole position and pass through.
  // Sized legs keep their proportions in whole size steps (largest remainder, so they add up exactly); a leg that rounds
  // to nothing is dropped.
  function scaleLegs(legs, masterQtyStr, followerQtyStr, sym) {
    if (!Array.isArray(legs) || !legs.length) return legs;
    const mq = parseFloat(masterQtyStr),
      fq = parseFloat(followerQtyStr);
    if (!(mq > 0) || !(fq > 0) || fq === mq || !legs.some((l) => l && l.quantity != null)) return legs;
    const step = sizeStepOf(sym),
      ratio = fq / mq;
    const sized = legs.map((l, i) => ({ l, i })).filter((x) => x.l && x.l.quantity != null);
    const units = sized.map((x) => (parseFloat(x.l.quantity) * ratio) / step);
    const base = units.map((u) => Math.floor(u + EPS));
    const left = Math.floor(units.reduce((a, b) => a + b, 0) + EPS) - base.reduce((a, b) => a + b, 0);
    const order = units.map((u, k) => [u - Math.floor(u + EPS), k]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    for (let k = 0; k < left; k++) base[order[k % order.length][1]]++;
    const out = legs.slice();
    sized.forEach((x, k) => {
      out[x.i] = base[k] > 0 ? { ...x.l, quantity: fmtQty(base[k] * step, sym) } : null;
    });
    return out.filter(Boolean);
  }

  // ── Bracket legs. Every stop and target is tracked as { id, kind:'tp'|'sl', price, qty } on the master entry and on
  // each follower, so a move / add / remove on the master hits the matching follower leg. Master and follower legs are
  // paired by kind and trigger price (and by order when two share a price), never by array position alone.
  const legsFrom = (reqLegs, ids, kind) =>
    (reqLegs || [])
      .map((l, i) => ({
        id: (ids || [])[i] || null,
        kind,
        price: parseFloat(l.triggerPrice),
        qty: l.quantity != null ? String(l.quantity) : null,
      }))
      .filter((l) => l.id);
  const legsOf = (req, res) => [
    ...legsFrom(req && req.takeProfits, res && res.takeProfitIds, 'tp'),
    ...legsFrom(req && req.stopLosses, res && res.stopLossIds, 'sl'),
  ];
  const legOf = (kind) => (b) => ({
    id: b.id || null,
    kind,
    price: parseFloat(b.triggerPrice),
    qty: b.quantity != null ? String(b.quantity) : null,
  });
  const posLegs = (p) =>
    [...(p.takeProfits || []).map(legOf('tp')), ...(p.stopLosses || []).map(legOf('sl'))].filter((l) => l.id);
  const posIdOf = (p) => p.positionId || p.position_id;
  function matchLeg(masterLegs, followerLegs, masterLegId) {
    const m = (masterLegs || []).find((l) => l.id === masterLegId);
    if (!m) return null;
    const same = (arr) => (arr || []).filter((l) => l.kind === m.kind && Math.abs(l.price - m.price) < PRICE_EPS);
    return same(followerLegs)[same(masterLegs).indexOf(m)] || null;
  }
  // Re-read the master and follower positions so leg ids, prices and sizes are exact (after an add or a reduce, after
  // an order that didn't fill, or when a leg is unknown).
  async function syncLegs(entry) {
    const read = async (acct, positionId) => {
      try {
        const r = await api('/v3/positions/opened', (await mintAccountToken(acct)).token);
        const p = ((r && r.positions) || []).find((x) => posIdOf(x) === positionId);
        return p ? { legs: posLegs(p), qty: String(p.quantity) } : null;
      } catch {
        return null;
      }
    };
    const masterPid = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
    const pairs = Object.entries(entry.followers); // fixed pairs: a follower dropped meanwhile can't shift them
    const [ml, ...fls] = await Promise.all([
      read(entry.master, masterPid),
      ...pairs.map(([f, fp]) => read(f, fp.positionId)),
    ]);
    if (ml) Object.assign(entry, ml);
    pairs.forEach(([, fp], i) => {
      if (fls[i]) Object.assign(fp, fls[i]);
    });
  }

  // Every follower action on one trade runs in order. An exit never overtakes the entry or an add still in flight, and
  // two quick edits of the same leg land in the order they were made. Entries themselves never wait.
  function enqueue(entry, task) {
    const run = (entry.queue || Promise.resolve()).then(task);
    entry.queue = run.catch(() => {});
    return run;
  }

  // The stops and targets the copier added to a follower (`fp.copied`: kind and price, kept through its moves). A master
  // move or removal that comes before the copier has read back the new leg's id (removed 2 s after it was added, with
  // the followers' copies still landing: a user's report, 2026-10-19) can't be paired by id; it is paired with the one
  // the copier added at a price the master no longer has, when exactly one fits. A leg placed on a follower by hand is
  // never one of these.
  const near = (a, b) => Math.abs(a - b) < PRICE_EPS;
  function noteCopied(fp, kind, price, was = null) {
    const list = (fp.copied || []).filter((c) => !(was != null && c.kind === kind && near(c.price, was)));
    if (price != null) list.push({ kind, price: parseFloat(price) });
    fp.copied = list.slice(-20);
  }
  const isCopied = (fp, kind, price) => (fp.copied || []).some((c) => c.kind === kind && near(c.price, price));
  const masterHas = (entry, kind, price) => (entry.legs || []).some((m) => m.kind === kind && near(m.price, price));
  function copiedLeg(entry, fp, kind) {
    const fits = (fp.legs || []).filter(
      (l) => l.kind === kind && isCopied(fp, kind, l.price) && !masterHas(entry, kind, l.price),
    );
    return fits.length === 1 ? fits[0] : null;
  }
  // a copied leg the master no longer has, that the follower's read doesn't show yet (Vest's reads can trail a change)
  const copiedNotSeen = (entry, fp, kind) =>
    (fp.copied || []).some(
      (c) =>
        c.kind === kind &&
        !masterHas(entry, kind, c.price) &&
        !(fp.legs || []).some((l) => l.kind === kind && near(l.price, c.price)),
    );

  // Copy a master add / move / remove of one stop or target to every follower.
  async function mirrorLeg(op, kind, req, entry, followers, lat, t0, fast = null) {
    const KIND = kind === 'sl' ? 'SL' : 'TP';
    const changed = []; // the followers whose stop or target did change (said if Vest refuses the master's)
    const path = kind === 'sl' ? '/v3/positions/stop-loss' : '/v3/positions/take-profit';
    const idKey = kind === 'sl' ? 'stopLossId' : 'takeProfitId';
    const masterLegId = req[idKey] || req.orderId || req.id;
    // One re-read of every account for this change, shared by all the followers (each read covers them all), and at
    // most one more a moment later when a follower's read doesn't show a leg the copier added yet.
    let reread = null,
      reread2 = null;
    const resync = () => (reread = reread || syncLegs(entry));
    const resyncLater = () => (reread2 = reread2 || sleep(POLL_MS).then(() => syncLegs(entry)));
    // Re-read only when the leg is unknown (e.g. added later). Reading after the master's move would show the master leg
    // at its new price while the follower's is still at the old one, and pairing needs the pre-move prices.
    if (op !== 'add' && !(entry.legs || []).some((l) => l.id === masterLegId)) await resync();
    // One sized leg scaled to a follower: nearest size step (flooring each leg alone leaves an uncovered sliver), capped
    // so this kind's sized legs never add up past the follower's position. null when it rounds to nothing.
    const scaleOne = (qty, fp, skip) => {
      const step = sizeStepOf(entry.symbol),
        mq = parseFloat(entry.qty),
        fq = parseFloat(fp.qty);
      if (!(mq > 0) || !(fq > 0) || fq === mq) return String(qty);
      const others = (fp.legs || [])
        .filter((l) => l !== skip && l.kind === kind && l.qty != null)
        .reduce((a, l) => a + parseFloat(l.qty), 0);
      const q = Math.min(Math.round((parseFloat(qty) * fq) / mq / step) * step, floorStep(fq - others, step));
      return q > 0 ? fmtQty(q, entry.symbol) : null;
    };
    await Promise.all(
      followers.map(async (f) => {
        const fp = entry.followers[f];
        const d = { ...who(f), kind: KIND, op, triggerPrice: req.triggerPrice };
        if (!fp) {
          logEvent('warn', `↳ ${accLabel(f)} isn't in this trade — ${KIND} change skipped`);
          diag('bracket', { ...d, outcome: 'skipped', reason: 'not tracked', met: false });
          return;
        }
        try {
          if (op === 'add') {
            const body = { ...req, positionId: fp.positionId };
            if (req.quantity != null) {
              const q = scaleOne(req.quantity, fp, null);
              if (!q) {
                logEvent('info', `↳ ${accLabel(f)} ${KIND} size rounds to 0 — skipped`);
                diag('bracket', { ...d, outcome: 'skipped', reason: 'size rounds to 0', met: true });
                return;
              }
              body.quantity = q;
            }
            await acctPost(f, path, body);
            noteCopied(fp, kind, req.triggerPrice);
            logEvent(
              'ok',
              `↳ added ${KIND} ${req.triggerPrice}${body.quantity ? ' × ' + body.quantity : ''} on ${accLabel(f)} (${lat()})`,
            );
          } else {
            let fl = matchLeg(entry.legs, fp.legs, masterLegId);
            if (!fl) {
              await resync();
              fl = matchLeg(entry.legs, fp.legs, masterLegId) || copiedLeg(entry, fp, kind);
            }
            if (!fl && copiedNotSeen(entry, fp, kind)) {
              await resyncLater();
              fl = matchLeg(entry.legs, fp.legs, masterLegId) || copiedLeg(entry, fp, kind);
            }
            if (!fl) {
              logEvent('warn', `↳ ${accLabel(f)} has no matching ${KIND} — skipped`);
              diag('bracket', { ...d, outcome: 'skipped', reason: 'no matching leg', met: false });
              return;
            }
            const byCopy = !matchLeg(entry.legs, fp.legs, masterLegId); // paired with the leg the copier added
            if (byCopy) d.pairedBy = 'copied';
            const body = { ...req, positionId: fp.positionId };
            for (const k of ['stopLossId', 'takeProfitId', 'orderId', 'id'])
              if (body[k] === masterLegId) body[k] = fl.id;
            if (op === 'move') {
              if (req.quantity != null) {
                // a resized leg: scale it to this follower
                const q = scaleOne(req.quantity, fp, fl);
                if (q) body.quantity = q;
                else delete body.quantity;
              }
              noteMovedTo(fl.id, req.triggerPrice);
              await acctPut(f, path, body);
              const resized = body.quantity != null && Math.abs(fl.price - parseFloat(req.triggerPrice)) < PRICE_EPS;
              if (isCopied(fp, kind, fl.price)) noteCopied(fp, kind, req.triggerPrice, fl.price); // it moves with the leg
              fl.price = parseFloat(req.triggerPrice);
              if (body.quantity != null) fl.qty = body.quantity;
              logEvent(
                'ok',
                resized
                  ? `↳ resized ${KIND} ${req.triggerPrice} → ${body.quantity} on ${accLabel(f)} (${lat()})`
                  : `↳ moved ${KIND} → ${req.triggerPrice} on ${accLabel(f)} (${lat()})`,
              );
            } else {
              await acctDelete(f, path, body);
              noteCopied(fp, kind, null, fl.price);
              fp.legs = fp.legs.filter((l) => l !== fl);
              logEvent('ok', `↳ removed ${KIND} on ${accLabel(f)} (${lat()})`);
            }
          }
          changed.push(accLabel(f));
          diag('bracket', {
            ...d,
            outcome: { add: 'added', move: 'moved', remove: 'removed' }[op],
            met: true,
            ms: msSince(t0),
          });
        } catch (e) {
          logEvent('warn', `↳ ${accLabel(f)} ${KIND} ${op} failed: ${e.message}`);
          diag('bracket', { ...d, outcome: 'rejected', error: e.message, errorCode: errCode(e), met: false });
        }
      }),
    );
    if (op === 'move') {
      const ml = (entry.legs || []).find((l) => l.id === masterLegId);
      if (ml) {
        ml.price = parseFloat(req.triggerPrice);
        if (req.quantity != null) ml.qty = String(req.quantity);
      }
    }
    if (op === 'remove') entry.legs = (entry.legs || []).filter((l) => l.id !== masterLegId);
    if (op === 'add') setTimeout(() => enqueue(entry, () => syncLegs(entry)), LEG_SYNC_DELAY_MS); // learn the new leg ids
    scheduleBracketCheck(entry);
    // fast mode sent it to the followers: if Vest didn't take the master's, say exactly what each side has now (on the
    // side: the trade's next copied action doesn't wait for this answer)
    if (fast) fast.answer.then((ok) => !ok && legRefused(op, kind, req, entry, changed, fast));
  }
  // A stop or target change fast mode copied, that Vest didn't take on the master: what each side has now.
  function legRefused(op, kind, req, entry, changed, fast) {
    const name = kind === 'sl' ? 'stop' : 'target',
      verb = op === 'add' ? `got a new ${name} at ${req.triggerPrice}` : `moved their ${name} to ${req.triggerPrice}`,
      head = fast.lost
        ? `MASTER ${name} change: no answer from Vest (connection lost)`
        : `MASTER ${name} change refused by Vest (HTTP ${fast.status})`;
    logEvent(
      'warn',
      changed.length
        ? `${head}: ${changed.join(', ')} ${verb}${fast.lost ? '' : ", the master's didn't"}. Check the master's ${name} on Vest${op === 'add' ? '' : ' and move theirs to match'}.`
        : `${head}: the followers' copies didn't go through either, so nothing changed.`,
    );
    enqueue(entry, () => syncLegs(entry)); // the copier's view of every leg, from Vest
  }

  // Canonical leverage key (2 dp), so "50", "50.0" and an effective "50.001027" compare equal and skip a redundant PUT.
  const levKey = (lev) => String(Math.round(parseFloat(lev) * 100) / 100);
  // Every account's saved leverage as read at Start copying. A follower not set by the sync (the master on Vest's
  // default leverage: "matched per trade") is checked against it before its first copied order on a market: when its
  // own leverage there (saved, else its plan's max, Vest's rule) is already the order's, nothing is changed, so the
  // order goes out at once instead of after a leverage change (seen live 2026-10-15: the first copy of a session 200-400
  // ms slower, 2.5-4.75 pts worse).
  let _armLevs = null;
  function levAlreadySet(f, sym, lev) {
    if (!_armLevs) return false;
    const own = orderLeverage(levFor(_armLevs, f, sym), maxLeverageFor(sym, f));
    return own > 0 && levKey(own) === levKey(lev);
  }

  // Open ONE follower: sized (cap-to-fit), leverage synced if needed, stop and targets attached. Writes the follower's
  // record into `followersMap` (shared by the normal and fast paths) and returns a `placed` record, or null.
  async function openFollower(f, o, followersMap, lat, fast) {
    const t0 = performance.now();
    const cq = capQty(f, o.qty, o.sym);
    const base = {
      ...who(f),
      symbol: o.sym,
      side: o.side,
      leverage: o.lev,
      fast,
      capFit: S.capFit,
      masterQty: o.qty,
      intendedQty: cq.qty,
      scaled: !!cq.scaled,
      ...cq.calc,
    };
    if (cq.skip) {
      logEvent(
        'warn',
        cq.calc && cq.calc.reason === 'missing-equity'
          ? `↳ ${accLabel(f)} skipped — its balance couldn't be read, so cap-to-fit can't size it.`
          : `↳ ${accLabel(f)} skipped — equity too small to hold any size (cap-to-fit).`,
      );
      diag('open', { ...base, outcome: 'skipped', expected: 'skip-too-small', met: true });
      return null;
    }
    if (cq.scaled) logEvent('info', `↳ ${accLabel(f)} scaled ${o.qty} → ${cq.qty} (margin cap)`);
    try {
      const key = f + '|' + o.sym;
      if (S.levCache[key] === undefined && levAlreadySet(f, o.sym, o.lev)) S.levCache[key] = levKey(o.lev);
      if (S.levCache[key] !== levKey(o.lev)) {
        try {
          await setFollowerLeverage(f, o.sym, o.lev);
          S.levCache[key] = levKey(o.lev);
        } catch (le) {
          diag('leverage', { ...who(f), symbol: o.sym, set: o.lev, error: le.message });
        }
      }
      const payload = {
        orderType: o.req.orderType,
        leverage: o.lev,
        side: o.side,
        symbol: o.sym,
        quantity: cq.qty,
        timeInForce: o.req.timeInForce,
        takeProfits: scaleLegs(o.req.takeProfits, o.qty, cq.qty, o.sym),
        stopLosses: scaleLegs(o.req.stopLosses, o.qty, cq.qty, o.sym),
      };
      if (o.req.price != null) payload.price = o.req.price;
      if (o.req.expirationTime != null) payload.expirationTime = o.req.expirationTime; // a moved limit keeps its expiry
      const clearing = waitClear(f, o.sym);
      if (clearing) await clearing; // a cancel on this market is still going through
      const r = await acctPost(f, '/v3/positions/open', payload);
      const rec = {
        positionId: r.positionId,
        orderId: r.orderId,
        legs: legsOf(payload, r),
        qty: cq.qty,
        share: parseFloat(cq.qty) / parseFloat(o.qty), // its share of the master's size (the size check)
      };
      if (followersMap) followersMap[f] = rec;
      if (!isImmediate(o.req)) watchRestingOpen(f, payload, rec);
      logEvent('ok', `↳ OPENED ${cq.qty} ${o.sym} ${o.side} on ${accLabel(f)} (${lat()})`);
      // the diag record stays open here; confirmFills fills in filled / slippage / margin / met
      const d = diag('open', {
        ...base,
        outcome: 'accepted',
        positionId: r.positionId,
        orderId: r.orderId,
        delayedOrderStatus: r.delayedOrderStatus || null,
        sendMs: msSince(t0),
        expected: isImmediate(o.req) ? 'fill' : 'rest', // a resting limit fills later, if at all
        met: null,
      });
      return { accountId: f, orderId: r.orderId, positionId: r.positionId, label: accLabel(f), qty: cq.qty, diag: d };
    } catch (e) {
      noteNotSent();
      logEvent('warn', `↳ ${accLabel(f)} OPEN failed: ${e.message}`);
      diag('open', {
        ...base,
        outcome: 'rejected',
        error: e.message,
        errorCode: errCode(e),
        sendMs: msSince(t0),
        expected: 'fill',
        met: false,
      });
      return null;
    }
  }

  // A resting limit copy is accepted at once and can still be refused a moment later (Vest's feed reports it); fill
  // checks don't cover resting orders, so it's watched here. "Already exists" (a cancel on that market hadn't cleared)
  // is retried once after the old position has gone; any refusal that stands is said in the log.
  async function watchRestingOpen(f, payload, rec) {
    const refused = (x) => x && x.missing && /refused/.test(x.why || '');
    const ff = await feedFill(rec.orderId, RESTING_REJECT_WAIT_MS);
    if (!refused(ff)) return;
    diag('open', { ...who(f), outcome: 'refused-after', orderId: rec.orderId, why: ff.why });
    let why = ff.why;
    if (/10006/.test(why)) {
      await waitMarketClear(f, payload.symbol);
      if (rec.cancelled || S.flattening) return; // the master's limit went meanwhile: nothing to bring back
      try {
        const r = await acctPost(f, '/v3/positions/open', payload);
        Object.assign(rec, { positionId: r.positionId, orderId: r.orderId, legs: legsOf(payload, r) });
        const again = await feedFill(r.orderId, RESTING_REJECT_WAIT_MS);
        if (!refused(again)) {
          logEvent('ok', `↳ ${accLabel(f)}: its limit was refused while the old one cleared; placed again.`);
          return;
        }
        why = again.why;
      } catch (e) {
        why = e.message;
      }
    }
    logEvent(
      'warn',
      `↳ ${accLabel(f)}: Vest refused its limit (${why}), so it has no waiting order. Check it on Vest.`,
    );
  }

  // Close / reduce one follower, retrying once on a rate limit or server error: an exit that silently fails leaves that
  // follower in a trade the master has left.
  // The retry keeps the same Idempotency-Key: if Vest ran the first one (a 504 or a dropped connection after it executed),
  // it won't run the reduce twice.
  // An exit order with one retry on 429 / 5xx (same Idempotency-Key). A market exit is noted as this tab's, so the feed's
  // report of the position closing isn't taken for one Vest made; a limit exit isn't (it fills later, maybe much later).
  async function sendExit(f, path, body, note = true) {
    const key = idem()['Idempotency-Key'];
    if (note) noteExit(body && body.positionId); // the feed will report it closing: this tab did that
    try {
      return await acctSend('POST', f, path, body, key);
    } catch (e) {
      const code = errCode(e);
      if (code != null && code < 429) throw e;
      await sleep(EXIT_RETRY_MS);
      return acctSend('POST', f, path, body, key);
    }
  }

  // ── Size check. Each follower should hold its share of the master's position (1:1, or its cap-to-fit share from the
  // entry; `fp.share`). After each copied entry, add or reduce settles, and every WARM_MS from Vest's live feed while
  // copying, a follower off its share by more than rounding (SHARE_TOL, at least two size steps) is named in the log,
  // once per size it is at. It has to be off on two looks SHARE_SETTLE_MS apart (targets filling a moment apart on
  // each account aren't a drift). The copier doesn't resize anyone: the trader decides. Seen 2026-10-15 in a user's
  // report: followers at a quarter of their share for three minutes and nothing said.
  const SHARE_TOL = 0.05,
    SHARE_SETTLE_MS = 3000;
  const _shareOff = {}; // "masterPositionId|accountId" -> { qty, at, warned }
  function checkShares(entry) {
    const pid = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
    if (!pid) return;
    const step = sizeStepOf(entry.symbol),
      live = feedLive();
    const sizeOf = (acct, positionId, known) => {
      const st = S.acctState[acct],
        p = live && stateFresh(st) && st.positions.find((x) => x.id === positionId);
      return p ? p.qty : parseFloat(known);
    };
    const mq = sizeOf(entry.master, pid, entry.qty);
    if (!(mq > 0)) return; // the master is out: the orphan check covers that
    for (const [f, fp] of Object.entries(entry.followers)) {
      if (!(fp.share > 0)) continue;
      const key = pid + '|' + f,
        fq = sizeOf(f, fp.positionId, fp.qty),
        want = mq * fp.share;
      if (!(Math.abs(fq - want) > Math.max(2 * step, SHARE_TOL * want))) {
        delete _shareOff[key];
        continue;
      }
      const seen = _shareOff[key];
      if (!seen || seen.qty !== fq) {
        _shareOff[key] = { qty: fq, at: Date.now(), warned: false };
        continue;
      }
      if (seen.warned || Date.now() - seen.at < SHARE_SETTLE_MS) continue;
      seen.warned = true;
      logEvent(
        'warn',
        `Size check: ${accLabel(f)} holds ${fmtQty(fq, entry.symbol)} ${symLabel(entry.symbol)}, its share of the master's ${fmtQty(mq, entry.symbol)} is ${fmtQty(floorStep(want, step), entry.symbol)}. Check it on Vest.`,
      );
      diag('size_check', { ...who(f), symbol: entry.symbol, held: fq, share: +want.toFixed(6), masterQty: mq });
    }
  }
  // two looks after a copied action, once it has settled
  function scheduleShareCheck(entry) {
    setTimeout(() => checkShares(entry), SHARE_SETTLE_MS / 2);
    setTimeout(() => checkShares(entry), SHARE_SETTLE_MS * 2);
  }

  // ── Bracket check. Each follower in a trade should have the master's stops and targets at the same prices. From Vest's
  // live feed (each position's active stops and targets), every WARM_MS while copying and twice after each copied stop
  // or target change: a follower with one the master doesn't have, or without the master's stop, on two looks
  // SHARE_SETTLE_MS apart (a change still landing isn't a difference), gets a "Bracket check" log line, once per
  // difference (`bracket_check` diag). A target the master has and a follower doesn't isn't one: a sized target whose
  // share rounds to nothing is left off a small follower. Nothing is changed: the trader decides. Seen 2026-10-19 in a
  // user's report: every follower kept a target the master had removed, and it filled 14 pts before the master passed.
  const _bracketOff = {}; // "masterPositionId|accountId" -> { sig, at, warned }
  // prices in `a` that `b` doesn't have, counted (two at one price need two)
  const pricesNotIn = (a, b) => {
    const left = [...b];
    return a.filter((p) => {
      const i = left.findIndex((q) => near(p, q));
      if (i < 0) return true;
      left.splice(i, 1);
      return false;
    });
  };
  function checkBrackets(entry) {
    const pid = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
    if (!pid || !feedLive()) return;
    const held = (acct, positionId) => {
      const st = S.acctState[acct];
      return stateFresh(st) && st.positions.find((x) => x.id === positionId);
    };
    const m = held(entry.master, pid);
    if (!m) return;
    const tick = (SYMBOLS[entry.symbol] || {}).tick || 0.25,
      prices = (p, kind) => (p.triggers || []).filter((t) => t.kind === kind).map((t) => t.price);
    for (const [f, fp] of Object.entries(entry.followers)) {
      const key = pid + '|' + f,
        p = held(f, fp.positionId);
      const notes = [];
      if (p)
        for (const kind of ['sl', 'tp']) {
          const name = kind === 'sl' ? 'stop' : 'target';
          for (const px of pricesNotIn(prices(p, kind), prices(m, kind)))
            notes.push(`a ${name} at ${fmtPx(px, tick)} the master doesn't`);
          if (kind === 'sl')
            for (const px of pricesNotIn(prices(m, kind), prices(p, kind)))
              notes.unshift(`no stop at ${fmtPx(px, tick)} (the master has one there)`); // the riskier one first
        }
      if (!notes.length) {
        delete _bracketOff[key];
        continue;
      }
      const sig = notes.join('|'),
        seen = _bracketOff[key];
      if (!seen || seen.sig !== sig) {
        _bracketOff[key] = { sig, at: Date.now(), warned: false };
        continue;
      }
      if (seen.warned || Date.now() - seen.at < SHARE_SETTLE_MS) continue;
      seen.warned = true;
      logEvent('warn', `Bracket check: ${accLabel(f)} has ${notes.join(', and ')}. Check it on Vest.`);
      diag('bracket_check', { ...who(f), symbol: entry.symbol, notes });
    }
  }
  function scheduleBracketCheck(entry) {
    setTimeout(() => checkBrackets(entry), SHARE_SETTLE_MS / 2);
    setTimeout(() => checkBrackets(entry), SHARE_SETTLE_MS * 2);
  }

  // ── An add the master didn't get (Vest refused it, didn't run it, or its answer was lost and the master didn't grow):
  // each follower's copy of it is taken back, by exactly what it added, reduce-only (it can never turn a position
  // around), so every follower is back at its share. A copy is taken back only once its fill is confirmed: one that
  // didn't fill left nothing to take back, and reducing anyway would cut the follower's original position. A lost
  // answer is checked first: if the master did grow, its add went through and the followers keep theirs.
  // `items`: [{ accountId, orderId, qty }]; `confirmed`: their fills are already confirmed (the fill check found them).
  const TAKE_BACK_CHECK_MS = 1500; // a lost answer: how long the feed gets to show the master's size first
  function takeBackAdds(entry, items, req, { why, checkMaster = false, confirmed = false, restoreQty = false }) {
    const sym = entry.symbol,
      step = sizeStepOf(sym),
      masterPid = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
    logEvent('warn', why + '.');
    return enqueue(entry, async () => {
      if (!Object.values(S.posMap).includes(entry)) return; // the trade closed meanwhile: nothing left to take back
      if (checkMaster) {
        await sleep(TAKE_BACK_CHECK_MS);
        const st = S.acctState[entry.master],
          p = feedLive() && stateFresh(st) && st.positions.find((x) => x.id === masterPid),
          r = p ? null : await tryOpenPosition(entry.master, sym, masterPid),
          now = p ? p.qty : r ? parseFloat(r.quantity) : null;
        if (now == null || now >= parseFloat(entry.qty) - step / 2) {
          logEvent(
            now == null ? 'warn' : 'info',
            now == null
              ? "↳ couldn't read the master's size: the followers' adds are left as they are. Check them on Vest."
              : "↳ the master's add went through after all (its answer was lost): the followers keep theirs.",
          );
          return;
        }
      }
      if (restoreQty) entry.qty = fmtQty(Math.max(0, parseFloat(entry.qty) - parseFloat(req.quantity)), sym);
      await Promise.all(
        items.map(async (it) => {
          const f = it.accountId,
            fp = entry.followers[f],
            d = { ...who(f), symbol: sym, kind: 'take-back', qty: it.qty };
          if (!fp) return;
          if (!confirmed) {
            const fill = await fillInfo(f, sym, it.orderId);
            if (fill === null) return void diag('append', { ...d, outcome: 'nothing-to-take-back', met: true });
            if (fill === undefined) {
              logEvent(
                'warn',
                `↳ ${accLabel(f)}: couldn't confirm its add filled. If it did, reduce it by ${it.qty} on Vest.`,
              );
              return void diag('append', { ...d, outcome: 'take-back-unknown', met: false });
            }
          }
          try {
            await sendExit(f, '/v3/positions/reduce', {
              positionId: fp.positionId,
              orderType: 'market',
              leverage: req.leverage || closeBody(sym, fp.positionId, null, f).leverage,
              quantity: it.qty,
              timeInForce: 'IOC',
              reduceOnly: true,
              symbol: sym,
            });
            fp.qty = fmtQty(Math.max(0, parseFloat(fp.qty) - parseFloat(it.qty)), sym);
            logEvent('ok', `↳ took back the add of ${it.qty} on ${accLabel(f)}: back at its share`);
            diag('append', { ...d, outcome: 'taken-back', met: true });
          } catch (e) {
            logEvent(
              'warn',
              `↳ ${accLabel(f)}: couldn't take back its add (${e.message}). Reduce it by ${it.qty} on Vest.`,
            );
            diag('append', { ...d, outcome: 'take-back-failed', error: e.message, errorCode: errCode(e), met: false });
          }
        }),
      );
      setTimeout(() => enqueue(entry, () => syncLegs(entry)), RESYNC_AFTER_REDUCE_MS);
      scheduleShareCheck(entry);
    });
  }

  // What each follower did on a master add or reduce, kept by the master's order id once Vest has answered, so the
  // re-split a Trade tab add or reduce is followed by pairs each follower with its own order (resplitFollowers)
  function noteChange(entry, kind, answer) {
    const lc = { kind, followers: {} };
    answer.then((m) => {
      if (!m || !m.orderId) return;
      const ch = (entry.changes = entry.changes || {});
      ch[m.orderId] = lc;
      for (const k of Object.keys(ch).slice(0, -5)) delete ch[k]; // only the last few are ever asked for
    });
    return lc;
  }

  // Mirror a MASTER action to every follower. Quantities are 1:1 unless cap-to-fit is on. Followers use the master's
  // leverage for each order (pre-synced at arm, so the leverage PUT is normally skipped).
  // `fast`: fast mode copies this at the master's send (maybeFastAction): `res` is empty and `fast.answer` brings Vest's
  // answer (null when refused or lost) for the fill check.
  function mirror(action, req, res, method = 'POST', via = null, fast = null) {
    const followers = [...S.followers];
    if (!followers.length) return;
    const t0 = performance.now();
    const lat = () => '+' + msSince(t0) + 'ms' + (fast ? ', fast' : '');
    const answer = () => Promise.resolve(fast ? fast.answer : res); // the master's order id, once Vest has answered
    const mrec = diag('master', {
      action,
      via,
      symbol: req.symbol,
      side: req.side,
      qty: req.quantity,
      leverage: req.leverage,
      positionId: req.positionId || res.positionId || null,
      orderId: res.orderId || null,
      triggerPrice: req.triggerPrice,
      followers: followers.length,
      fast: !!fast,
      netMs: S.net.last, // the last round trip to Vest the keep-warm read measured
    });
    if (fast) fast.rec = mrec;
    if (S.paused && (action === 'open' || action === 'append')) {
      // a waiting limit moved on Vest's chart is a cancel (copied) then a new order (not, while paused)
      const moved = action === 'open' && Date.now() - (_droppedAt[req.symbol] || 0) < MOVED_LIMIT_MS;
      logEvent(
        'warn',
        moved
          ? `MASTER moved a waiting ${symLabel(req.symbol)} limit: the followers' copies were cancelled with the old one, and the new one is NOT copied (paused: ${S.paused}). Place theirs on Vest, or move it again once trading resumes.`
          : `MASTER ${action === 'open' ? 'opened a trade' : 'added to a trade'}: NOT copied (paused: ${S.paused})`,
      );
      diag(action, { symbol: req.symbol, outcome: 'skipped', reason: 'paused', met: false });
      return;
    }
    const entry = req.positionId ? S.posMap[req.positionId] : null;
    const untracked = (what) => {
      logEvent(
        'warn',
        `↳ that position isn't tracked (opened while not copying, and not adopted) — the ${what} was NOT copied.`,
      );
      diag(action, {
        symbol: req.symbol,
        positionId: req.positionId || null,
        outcome: 'skipped',
        reason: 'master position not tracked',
        met: false,
      });
    };

    if (action === 'open') {
      const { side, symbol: sym, quantity: qty, leverage: lev } = req,
        masterPos = res.positionId;
      logEvent('info', `MASTER opened ${side} ${qty} ${sym} (${lev}x) on ${accLabel(S.master)}`);
      if (!masterPos) {
        // nothing to link followers to: don't open them
        logEvent('warn', 'Vest returned no position for the master order — not copied.');
        diag('open', { symbol: sym, outcome: 'skipped', reason: 'no master positionId', met: false });
        return;
      }
      if (S.posMap[masterPos]) {
        // Vest handed back a position that is already tracked: never re-open followers or drop their links
        logEvent('warn', 'That order joined a position the copier already tracks — not copied as a new entry.');
        diag('open', {
          symbol: sym,
          positionId: masterPos,
          outcome: 'skipped',
          reason: 'position already tracked',
          met: false,
        });
        return;
      }
      const e = (S.posMap[masterPos] = {
        master: S.master,
        side,
        symbol: sym,
        masterOrderId: res.orderId,
        resting: !isImmediate(req), // a limit entry: followers' orders may still be resting
        qty,
        legs: legsOf(req, res),
        followers: {},
      });
      const jobs = followers.map((f) => openFollower(f, { side, sym, qty, lev, req }, e.followers, lat, false));
      e.queue = Promise.all(jobs).catch(() => {}); // later actions wait for the entries; entries never wait
      if (e.resting) watchMasterResting(e);
      if (isImmediate(req)) {
        Promise.all(jobs).then((placed) =>
          confirmFills(
            sym,
            { accountId: S.master, orderId: res.orderId, qty, ioc: req.orderType === 'limit' },
            placed.filter(Boolean),
            e,
            'entry',
          ),
        );
      }
    } else if (action === 'append') {
      // Add to the open position. Each follower adds to its own position, scaled like a reduce (same fraction of its size).
      const sym = req.symbol;
      logEvent(
        'info',
        `MASTER added ${req.quantity} ${sym} to its ${req.isBuy ? 'long' : 'short'} on ${accLabel(S.master)}`,
      );
      if (!entry) return untracked('add');
      const added = (a, b) => fmtQty(parseFloat(a) + parseFloat(b), sym);
      const lc = noteChange(entry, 'add', answer()); // for the re-split a Trade tab add is followed by
      const resting = !isImmediate(req) && res.orderId;
      if (resting) (entry.restingAdds = entry.restingAdds || {})[res.orderId] = { qty: req.quantity, followers: {} };
      const run = enqueue(entry, async () => {
        const mBefore = entry.qty;
        entry.qty = added(mBefore, req.quantity);
        const placed = await Promise.all(
          followers.map(async (f) => {
            const fp = entry.followers[f],
              d = { ...who(f), symbol: sym, masterQty: req.quantity };
            if (!fp) {
              logEvent('warn', `↳ ${accLabel(f)} isn't in this trade — add skipped`);
              diag('append', { ...d, outcome: 'skipped', reason: 'not tracked', met: false });
              return null;
            }
            const q = scaleToFollower(req.quantity, fp.qty, mBefore, sym);
            lc.followers[f] = { orderId: null, why: 'rounds to 0' };
            if (!(parseFloat(q) > 0)) {
              logEvent('info', `↳ ${accLabel(f)} add rounds to 0 — skipped`);
              diag('append', {
                ...d,
                followerQty: fp.qty,
                scaledQty: q,
                outcome: 'skipped',
                reason: 'rounds to 0',
                met: true,
              });
              return null;
            }
            const body = {
              symbol: sym,
              positionId: fp.positionId,
              orderType: req.orderType,
              quantity: q,
              leverage: req.leverage,
              isBuy: req.isBuy,
              timeInForce: req.timeInForce,
            };
            if (req.price != null) body.price = req.price;
            if (req.expirationTime != null) body.expirationTime = req.expirationTime; // a dragged limit add keeps its expiry
            try {
              const r = await acctPost(f, '/v3/positions/append', body);
              const was = fp.qty;
              lc.followers[f] = { orderId: r.orderId, before: parseFloat(was) };
              fp.qty = added(was, q);
              if (resting && entry.restingAdds && entry.restingAdds[res.orderId])
                entry.restingAdds[res.orderId].followers[f] = { orderId: r.orderId, qty: q };
              logEvent('ok', `↳ ADDED ${q} on ${accLabel(f)} (${lat()})`);
              const dd = diag('append', {
                ...d,
                followerQty: was,
                scaledQty: q,
                outcome: 'accepted',
                orderId: r.orderId,
                expected: 'fill',
                met: null,
                ms: msSince(t0),
              });
              return {
                accountId: f,
                orderId: r.orderId,
                label: accLabel(f),
                qty: q,
                diag: dd,
                undo: () => {
                  fp.qty = added(fp.qty, -q);
                },
              };
            } catch (e) {
              noteNotSent();
              lc.followers[f] = { orderId: null, why: 'refused' };
              logEvent('warn', `↳ ${accLabel(f)} ADD failed: ${e.message}`);
              diag('append', {
                ...d,
                scaledQty: q,
                outcome: 'rejected',
                error: e.message,
                errorCode: errCode(e),
                met: false,
              });
              return null;
            }
          }),
        );
        return placed.filter(Boolean);
      });
      lc.sent = run;
      run.then(async (placed) => {
        const m = await answer();
        if (fast && !m) {
          // Vest didn't take the master's add (refused, or no answer): the followers' copies are taken back
          return takeBackAdds(entry, placed, req, {
            why: fast.lost
              ? "MASTER add: no answer from Vest (connection lost), but fast mode had already added to the followers: checking the master's size"
              : `MASTER add refused by Vest (HTTP ${fast.status}), but fast mode had already added to the followers: taking their add back`,
            checkMaster: fast.lost,
            restoreQty: true,
          });
        }
        if (!isImmediate(req) || !m) return;
        confirmFills(
          sym,
          {
            accountId: S.master,
            orderId: m.orderId,
            qty: req.quantity,
            req,
            undo: () => {
              entry.qty = added(entry.qty, -req.quantity);
            },
          },
          placed,
          entry,
          'add',
        );
      });
    } else if (action === 'reduce') {
      if (!entry) {
        logEvent('info', `MASTER reduced ${req.quantity} ${req.symbol} on ${accLabel(S.master)}`);
        return untracked('reduce');
      }
      if (req.orderType && req.orderType !== 'market')
        return mirrorLimitExit('reduce', req, res, entry, followers, lat, t0);
      const held = heldBefore(req.positionId, entry);
      if (req.reduceOnly === false && held > 0 && parseFloat(req.quantity) > held + sizeStepOf(entry.symbol) / 2)
        return mirrorFlip(req, entry, followers, held, lat, t0);
      logEvent('info', `MASTER reduced ${req.quantity} ${req.symbol} on ${accLabel(S.master)}`);
      const lc = noteChange(entry, 'reduce', answer()); // for the re-split a Trade tab reduce is followed by
      lc.sent = enqueue(entry, async () => {
        const mBefore = entry.qty;
        entry.qty = fmtQty(Math.max(0, parseFloat(mBefore) - parseFloat(req.quantity)), req.symbol);
        await Promise.all(
          followers.map(async (f) => {
            const fp = entry.followers[f],
              d = { ...who(f), symbol: req.symbol, masterQty: req.quantity };
            if (!fp) {
              logEvent('warn', `↳ ${accLabel(f)} isn't in this trade — reduce skipped`);
              diag('reduce', { ...d, outcome: 'skipped', reason: 'not tracked', met: false });
              return;
            }
            const rq = scaleToFollower(req.quantity, fp.qty, mBefore, req.symbol);
            lc.followers[f] = { orderId: null, why: 'rounds to 0' };
            if (!(parseFloat(rq) > 0)) {
              logEvent('info', `↳ ${accLabel(f)} reduce rounds to 0 — skipped`);
              diag('reduce', {
                ...d,
                followerQty: fp.qty,
                scaledQty: rq,
                outcome: 'skipped',
                reason: 'rounds to 0',
                met: true,
              });
              return;
            }
            try {
              const r = await sendExit(f, '/v3/positions/reduce', {
                positionId: fp.positionId,
                orderType: 'market',
                leverage: req.leverage,
                quantity: rq,
                timeInForce: 'IOC',
                reduceOnly: true,
                symbol: req.symbol,
              });
              lc.followers[f] =
                r && r.orderId
                  ? { orderId: r.orderId, before: parseFloat(fp.qty) }
                  : { orderId: null, why: 'no order id' };
              logEvent('ok', `↳ REDUCED ${rq} on ${accLabel(f)} (${lat()})`);
              diag('reduce', {
                ...d,
                followerQty: fp.qty,
                scaledQty: rq,
                outcome: 'accepted',
                met: true,
                ms: msSince(t0),
              });
              fp.qty = fmtQty(Math.max(0, parseFloat(fp.qty) - parseFloat(rq)), req.symbol);
            } catch (e) {
              noteNotSent();
              lc.followers[f] = { orderId: null, why: 'refused' };
              logEvent('warn', `↳ ${accLabel(f)} REDUCE failed: ${e.message} — it still holds its full size.`);
              diag('reduce', {
                ...d,
                scaledQty: rq,
                outcome: 'rejected',
                error: e.message,
                errorCode: errCode(e),
                met: false,
              });
            }
          }),
        );
        // an IOC reduce can fill partly or not at all: re-read the true sizes shortly after
        setTimeout(() => enqueue(entry, () => syncLegs(entry)), RESYNC_AFTER_REDUCE_MS);
        scheduleShareCheck(entry);
      });
    } else if (action === 'close') {
      if (entry && req.orderType && req.orderType !== 'market')
        return mirrorLimitExit('close', req, res, entry, followers, lat, t0);
      logEvent('info', `MASTER closed ${req.symbol} on ${accLabel(S.master)}`);
      if (!entry) return untracked('close');
      delete S.posMap[req.positionId];
      _limitExits.delete(req.positionId);
      enqueue(entry, async () => {
        const placed = await Promise.all(
          followers.map(async (f) => {
            const fp = entry.followers[f],
              d = { ...who(f), symbol: req.symbol };
            if (!fp) return null; // never in this trade: nothing to close
            if (entry.resting && fp.orderId)
              try {
                await acctPost(f, '/v3/positions/cancel-order', { orderId: fp.orderId });
              } catch {
                /* best effort: it filled or is gone, and the close below handles a position */
              }
            try {
              const r = await sendExit(f, '/v3/positions/close', closeBody(req.symbol, fp.positionId, req.leverage, f));
              logEvent('ok', `↳ CLOSED on ${accLabel(f)} (${lat()})`);
              const dd = diag('close', {
                ...d,
                followerQty: fp.qty,
                outcome: 'accepted',
                orderId: r.orderId,
                expected: 'fill',
                met: null,
                ms: msSince(t0),
              });
              return { accountId: f, orderId: r.orderId, label: accLabel(f), qty: fp.qty, diag: dd };
            } catch (e) {
              noteNotSent();
              logEvent('warn', `↳ ${accLabel(f)} CLOSE failed: ${e.message} — it is still OPEN. Close it on Vest.`);
              diag('close', { ...d, outcome: 'rejected', error: e.message, errorCode: errCode(e), met: false });
              return null;
            }
          }),
        );
        cancelWaitingCopies(entry); // the trade is over: no follower keeps an add or a limit close waiting on it
        answer().then((m) =>
          confirmFills(
            req.symbol,
            { accountId: S.master, orderId: m && m.orderId, qty: entry.qty || '0' },
            placed.filter(Boolean),
            null,
            'close',
          ),
        );
      });
    } else if (action === 'stop-loss' || action === 'take-profit') {
      // PUT moves an existing stop/target, POST adds one to the open position, DELETE removes one.
      const kind = action === 'stop-loss' ? 'sl' : 'tp',
        KIND = kind === 'sl' ? 'SL' : 'TP';
      const op = method === 'POST' ? 'add' : method === 'DELETE' ? 'remove' : 'move';
      // a PUT that keeps the price and sends a size is a resize (e.g. targets split again when one is added)
      // the master's own re-split: each follower re-splits its own targets across its own position instead
      if (method === 'PUT' && kind === 'tp' && _resplitting.delete(resplitKey(req))) return;
      const legId = req.stopLossId || req.takeProfitId || req.orderId || req.id,
        was = entry && (entry.legs || []).find((l) => l.id === legId),
        resize =
          op === 'move' &&
          req.quantity != null &&
          !!was &&
          Math.abs(was.price - parseFloat(req.triggerPrice)) < PRICE_EPS;
      logEvent(
        'info',
        op === 'add'
          ? `MASTER added ${KIND} ${req.triggerPrice}${req.quantity != null ? ' × ' + req.quantity : ''} on ${accLabel(S.master)}`
          : op === 'remove'
            ? `MASTER removed a ${KIND} on ${accLabel(S.master)}`
            : resize
              ? `MASTER resized ${KIND} ${req.triggerPrice} → ${req.quantity} on ${accLabel(S.master)}`
              : `MASTER moved ${KIND} → ${req.triggerPrice} on ${accLabel(S.master)}`,
      );
      if (!entry) return untracked(`${KIND} change`);
      enqueue(entry, () => mirrorLeg(op, kind, req, entry, followers, lat, t0, fast));
    } else if (action === 'cancel-order') {
      logEvent('info', `MASTER cancelled a resting order on ${accLabel(S.master)}`);
      // a limit close or reduce: cancel each follower's copy
      const exitEntry = Object.values(S.posMap).find((x) => x.exitOrders && x.exitOrders[req.orderId]);
      if (exitEntry) return cancelLimitExit(exitEntry, req.orderId, lat, t0);
      // a resting limit add (the entry is already open): cancel each follower's add and take its size back off
      const addEntry = Object.values(S.posMap).find((x) => x.restingAdds && x.restingAdds[req.orderId]);
      if (addEntry) {
        const ra = addEntry.restingAdds[req.orderId];
        delete addEntry.restingAdds[req.orderId];
        addEntry.qty = fmtQty(Math.max(0, parseFloat(addEntry.qty) - parseFloat(ra.qty)), addEntry.symbol);
        enqueue(addEntry, () =>
          Promise.all(
            Object.entries(ra.followers).map(async ([f, o]) => {
              try {
                await acctPost(f, '/v3/positions/cancel-order', { orderId: o.orderId });
                const fp = addEntry.followers[f];
                if (fp) fp.qty = fmtQty(Math.max(0, parseFloat(fp.qty) - parseFloat(o.qty)), addEntry.symbol);
                logEvent('ok', `↳ cancelled the resting add on ${accLabel(f)} (${lat()})`);
                diag('cancel', { ...who(f), orderId: o.orderId, kind: 'add', outcome: 'cancelled', met: true });
              } catch (err) {
                logEvent(
                  'warn',
                  `↳ ${accLabel(f)} cancel failed: ${err.message} — its add may still be resting. Check it on Vest.`,
                );
                diag('cancel', { ...who(f), kind: 'add', outcome: 'rejected', error: err.message, met: false });
              }
            }),
          ).then(() => {
            // a Scale whose first order was cancelled before and whose last waiting order this was: if nothing filled,
            // the trade is gone (the live feed usually says so first)
            if (addEntry.openGone && !Object.keys(addEntry.restingAdds).length) return endUnfilled(addEntry);
            setTimeout(() => enqueue(addEntry, () => syncLegs(addEntry)), RESYNC_AFTER_REDUCE_MS);
          }),
        );
        return;
      }
      const e = entryByOrderId(req.orderId);
      if (!e) return _droppedOrders.has(req.orderId) ? undefined : untracked('cancel'); // the feed got there first
      if (e.restingAdds && Object.keys(e.restingAdds).length) return cancelFirstSlice(e, lat, t0);
      dropEntry(e);
      cancelFollowerCopies(e, lat, t0);
    }
  }

  // ── Limit closes and reduces (Vest's Close dialog: Limit Close, all or part of the position). The order waits at its
  // price, so each follower gets the same order at the same price (a reduce scaled to its size), tracked by the
  // master's order id so a cancel takes the copies with it. When it fills, the live feed reports it ("Limit close
  // filled") and the trade ends as after a stop: a follower whose copy hasn't filled by then is offered to flatten.
  const heldBefore = (pid, entry) => {
    const p = _preSize[pid];
    return p && Date.now() - p.at < 10000 ? p.qty : parseFloat(entry.qty);
  };
  function mirrorLimitExit(kind, req, res, entry, followers, lat, t0) {
    const sym = entry.symbol,
      price = kind === 'close' ? req.limitPrice : req.price;
    if (
      kind === 'reduce' &&
      req.reduceOnly === false &&
      parseFloat(req.quantity) > heldBefore(req.positionId, entry) + sizeStepOf(sym) / 2
    ) {
      logEvent(
        'warn',
        `MASTER placed a limit order bigger than its ${symLabel(sym)} position (it turns the trade around when it fills): NOT copied. Place the followers' orders on Vest.`,
      );
      diag('reduce', { symbol: sym, outcome: 'skipped', reason: 'limit flip', met: false });
      return;
    }
    const what = kind === 'close' ? 'limit close' : `limit reduce of ${req.quantity}`;
    logEvent('info', `MASTER placed a ${what} at ${price} on ${symLabel(sym)} (${accLabel(S.master)})`);
    const xo = { kind, price, followers: {} };
    if (res.orderId) (entry.exitOrders = entry.exitOrders || {})[res.orderId] = xo;
    _limitExits.add(req.positionId);
    enqueue(entry, () =>
      Promise.all(
        followers.map(async (f) => {
          const fp = entry.followers[f],
            d = { ...who(f), symbol: sym, kind: 'limit', price };
          if (!fp) {
            logEvent('warn', `↳ ${accLabel(f)} isn't in this trade — ${what} skipped`);
            diag(kind, { ...d, outcome: 'skipped', reason: 'not tracked', met: false });
            return;
          }
          let body;
          if (kind === 'close')
            body = { ...closeBody(sym, fp.positionId, req.leverage, f), orderType: 'limit', limitPrice: price };
          else {
            const rq = scaleToFollower(req.quantity, fp.qty, entry.qty, sym);
            if (!(parseFloat(rq) > 0)) {
              logEvent('info', `↳ ${accLabel(f)} limit reduce rounds to 0 — skipped`);
              diag(kind, { ...d, followerQty: fp.qty, scaledQty: rq, outcome: 'skipped', reason: 'rounds to 0' });
              return;
            }
            body = {
              positionId: fp.positionId,
              orderType: 'limit',
              leverage: req.leverage,
              quantity: rq,
              timeInForce: req.timeInForce || 'GTC',
              reduceOnly: true,
              price,
              symbol: sym,
            };
          }
          if (req.expirationTime != null) body.expirationTime = req.expirationTime; // a dragged line keeps its expiry
          try {
            const r = await sendExit(f, `/v3/positions/${kind}`, body, false);
            xo.followers[f] = { orderId: r.orderId, positionId: fp.positionId };
            _limitExits.add(fp.positionId);
            logEvent(
              'ok',
              `↳ limit ${kind} at ${price}${body.quantity ? ' × ' + body.quantity : ''} placed on ${accLabel(f)} (${lat()})`,
            );
            diag(kind, {
              ...d,
              followerQty: fp.qty,
              scaledQty: body.quantity,
              outcome: 'accepted',
              orderId: r.orderId,
              expected: 'rest',
              met: null,
              ms: msSince(t0),
            });
          } catch (e) {
            logEvent(
              'warn',
              `↳ ${accLabel(f)} limit ${kind} failed: ${e.message} — it stays in the trade. Place it on Vest, or close it when the master's fills.`,
            );
            diag(kind, { ...d, outcome: 'rejected', error: e.message, errorCode: errCode(e), met: false });
          }
        }),
      ),
    );
  }
  function cancelLimitExit(entry, orderId, lat, t0) {
    const xo = entry.exitOrders[orderId];
    delete entry.exitOrders[orderId];
    noteDropped(orderId);
    const masterPid = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
    const waiting = (pid) =>
      Object.values(entry.exitOrders).some((x) => Object.values(x.followers).some((o) => o.positionId === pid));
    if (!Object.keys(entry.exitOrders).length) _limitExits.delete(masterPid);
    enqueue(entry, () =>
      Promise.all(
        Object.entries(xo.followers).map(async ([f, o]) => {
          if (!waiting(o.positionId)) _limitExits.delete(o.positionId);
          try {
            await acctPost(f, '/v3/positions/cancel-order', { orderId: o.orderId });
            logEvent('ok', `↳ cancelled the limit ${xo.kind} on ${accLabel(f)} (${lat()})`);
            diag('cancel', {
              ...who(f),
              orderId: o.orderId,
              kind: xo.kind,
              outcome: 'cancelled',
              met: true,
              ms: msSince(t0),
            });
          } catch (err) {
            logEvent(
              'warn',
              `↳ ${accLabel(f)} cancel failed: ${err.message} — its limit ${xo.kind} may have filled or still be waiting. Check it on Vest.`,
            );
            diag('cancel', { ...who(f), kind: xo.kind, outcome: 'rejected', error: err.message, met: false });
          }
        }),
      ),
    );
  }

  // ── An opposite market order bigger than the position, without Reduce Only: Vest closes the position and opens the rest
  // the other way, in one order (its "flip"). Each follower gets the same: one reduce, Reduce Only off, the same fraction
  // of its own size, so it ends on the new side at its share. The trade then follows the new side; Vest keeps the
  // position id (its ticket adds the new stop and target to it), and a re-read relinks the trade if it ever doesn't.
  function followerHeld(f, fp) {
    const st = S.acctState[f],
      p = stateFresh(st) && st.positions.find((x) => x.id === fp.positionId);
    return p ? p.qty : parseFloat(fp.qty);
  }
  function mirrorFlip(req, entry, followers, held, lat, t0) {
    const sym = entry.symbol,
      from = entry.side,
      to = from === 'long' ? 'short' : 'long',
      rest = fmtQty(parseFloat(req.quantity) - held, sym);
    logEvent(
      'info',
      `MASTER turned its ${from} ${fmtQty(held, sym)} ${symLabel(sym)} into a ${to} ${rest} (one ${req.quantity} order) on ${accLabel(S.master)}`,
    );
    enqueue(entry, async () => {
      Object.assign(entry, { side: to, qty: rest, legs: [] });
      await Promise.all(
        followers.map(async (f) => {
          const fp = entry.followers[f],
            d = { ...who(f), symbol: sym, masterQty: req.quantity, from, to };
          if (!fp) {
            logEvent('warn', `↳ ${accLabel(f)} isn't in this trade — the turn to ${to} skipped`);
            diag('flip', { ...d, outcome: 'skipped', reason: 'not tracked', met: false });
            return;
          }
          const fHeld = followerHeld(f, fp),
            total = scaleToFollower(req.quantity, fmtQty(fHeld, sym), fmtQty(held, sym), sym),
            fRest = Math.max(0, parseFloat(total) - fHeld);
          try {
            await sendExit(f, '/v3/positions/reduce', {
              positionId: fp.positionId,
              orderType: 'market',
              leverage: req.leverage,
              quantity: total,
              timeInForce: req.timeInForce || 'IOC',
              reduceOnly: false,
              symbol: sym,
            });
            if (fRest > 0) Object.assign(fp, { qty: fmtQty(fRest, sym), legs: [], copied: [] });
            else delete entry.followers[f]; // its share of the new side rounds to nothing: it's out
            logEvent(
              'ok',
              fRest > 0
                ? `↳ ${accLabel(f)} turned ${to}: ${fmtQty(fRest, sym)} (${lat()})`
                : `↳ ${accLabel(f)} closed — its share of the ${to} rounds to 0 (${lat()})`,
            );
            diag('flip', { ...d, followerQty: fHeld, sent: total, outcome: 'accepted', met: null, ms: msSince(t0) });
          } catch (e) {
            logEvent(
              'warn',
              `↳ ${accLabel(f)} turn to ${to} failed: ${e.message} — it is still ${from}. Close it on Vest.`,
            );
            diag('flip', { ...d, outcome: 'rejected', error: e.message, errorCode: errCode(e), met: false });
          }
        }),
      );
      setTimeout(() => enqueue(entry, () => relinkTrade(entry)), RESYNC_AFTER_REDUCE_MS);
    });
  }
  // Re-read the trade's positions by market: side, size and legs, and the position id if it changed. A follower left
  // on the other side from the master, or still in while the master is out (a flip that turned the followers and not
  // the master), is out of the trade and offered to flatten: never two accounts held opposite ways.
  async function relinkTrade(entry) {
    const masterPid = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
    if (!masterPid) return;
    // the position, null when there's none, undefined when it couldn't be read
    const pick = async (acct, pid) => {
      try {
        const r = await api('/v3/positions/opened', (await mintAccountToken(acct)).token);
        const on = ((r && r.positions) || []).filter((x) => x.symbol === entry.symbol && parseFloat(x.quantity) > 0);
        return on.find((x) => posIdOf(x) === pid) || (on.length === 1 ? on[0] : null);
      } catch {
        return undefined;
      }
    };
    let m;
    try {
      const r = await api('/v3/positions/opened', (await mintAccountToken(entry.master)).token);
      const on = ((r && r.positions) || []).filter((x) => x.symbol === entry.symbol && parseFloat(x.quantity) > 0);
      m = on.find((x) => posIdOf(x) === masterPid) || (on.length === 1 ? on[0] : null);
    } catch {
      return; // the master can't be read: nothing is judged on a guess
    }
    if (m) {
      const id = posIdOf(m);
      if (id !== masterPid && !S.posMap[id]) {
        delete S.posMap[masterPid];
        S.posMap[id] = entry;
      }
      Object.assign(entry, { side: m.side, qty: String(m.quantity), legs: posLegs(m) });
    }
    const off = [];
    await Promise.all(
      Object.entries(entry.followers).map(async ([f, fp]) => {
        const p = await pick(f, fp.positionId);
        // the master is out and this one can't be read: it may still be in, and the trade is about to be let go of, so
        // it's raised with the others (a Flatten of a position that's gone does nothing)
        if (p === undefined && !m) return void off.push({ accountId: f, positionId: fp.positionId, side: null });
        if (!p) return;
        Object.assign(fp, { positionId: posIdOf(p), qty: String(p.quantity), legs: posLegs(p), copied: [] });
        if (!m || p.side !== m.side) off.push({ accountId: f, positionId: posIdOf(p), side: p.side });
      }),
    );
    if (!off.length) return;
    off.forEach((o) => delete entry.followers[o.accountId]);
    if (!m) delete S.posMap[Object.keys(S.posMap).find((k) => S.posMap[k] === entry)];
    diag('flip', {
      outcome: 'mismatch',
      masterSide: m ? m.side : null,
      followers: off.map((o) => accLabel(o.accountId)),
    });
    raiseOrphans(
      entry.symbol,
      off.map((o) => ({ accountId: o.accountId, positionId: o.positionId })),
      m ? `the master is ${m.side} and they are the other way` : 'the master is out and they are still in',
      entry.master,
    );
  }

  // ── Waiting orders on a trade (a Scale's other slices: limit adds; limit closes and reduces). When the master's trade
  // ends (a close here, its stop or target, a limit close filling, a failed account), the followers' waiting adds on it
  // are cancelled, so none fills into a trade the master is out of. Their limit closes and reduces are exits: cancelled
  // when the master closes at market here (the follower closes with it), left alone when Vest closed the master (a
  // limit close filling: the follower's copy at the same price is about to fill too; a straggler is offered to
  // flatten). One that already filled or is gone is fine.
  function noteDropped(orderId) {
    if (!orderId) return;
    _droppedOrders.add(orderId);
    if (_droppedOrders.size > 500) _droppedOrders.delete(_droppedOrders.values().next().value);
  }
  async function cancelWaitingCopies(e, exits = true) {
    const jobs = [];
    for (const [mid, ra] of Object.entries(e.restingAdds || {})) {
      noteDropped(mid);
      for (const [f, o] of Object.entries(ra.followers)) jobs.push({ f, orderId: o.orderId, kind: 'add' });
    }
    for (const [mid, xo] of Object.entries(e.exitOrders || {})) {
      noteDropped(mid);
      if (!exits) continue;
      for (const [f, o] of Object.entries(xo.followers)) {
        _limitExits.delete(o.positionId);
        jobs.push({ f, orderId: o.orderId, kind: xo.kind });
      }
    }
    e.restingAdds = {};
    e.exitOrders = {};
    const n = {};
    await Promise.all(
      jobs.map(async ({ f, orderId, kind }) => {
        try {
          await acctPost(f, '/v3/positions/cancel-order', { orderId });
          n[f] = (n[f] || 0) + 1;
          diag('cancel', { ...who(f), orderId, kind, why: 'trade over', outcome: 'cancelled', met: true });
        } catch (err) {
          const code = errCode(err);
          if (code != null && code < 429) {
            // filled already, or gone with the position: nothing waiting
            diag('cancel', { ...who(f), orderId, kind, why: 'trade over', outcome: 'nothing-to-cancel', met: true });
            return;
          }
          logEvent(
            'warn',
            `↳ ${accLabel(f)} cancel failed: ${err.message} — a waiting ${kind} may be left. Check it on Vest.`,
          );
          diag('cancel', { ...who(f), orderId, kind, outcome: 'rejected', error: err.message, met: false });
        }
      }),
    );
    for (const [f, c] of Object.entries(n))
      logEvent('ok', `↳ cancelled ${c} waiting order${c > 1 ? 's' : ''} on ${accLabel(f)} (the trade is over)`);
  }
  // A Scale's first order cancelled while its other orders wait: only each follower's first order goes; the trade stays.
  function cancelFirstSlice(e, lat, t0) {
    e.openGone = true;
    enqueue(e, () =>
      Promise.all(
        Object.entries(e.followers).map(async ([f, fp]) => {
          if (!fp.orderId) return;
          try {
            await acctPost(f, '/v3/positions/cancel-order', { orderId: fp.orderId });
            logEvent('ok', `↳ cancelled order on ${accLabel(f)} (${lat()})`);
            const orderId = fp.orderId;
            fp.orderId = null; // gone: not cancelled again when the trade ends
            diag('cancel', {
              ...who(f),
              orderId,
              kind: 'first',
              outcome: 'cancelled',
              met: true,
              ms: msSince(t0),
            });
          } catch (err) {
            logEvent(
              'warn',
              `↳ ${accLabel(f)} cancel failed: ${err.message} — its first order may have filled. Check it on Vest.`,
            );
            diag('cancel', { ...who(f), kind: 'first', outcome: 'rejected', error: err.message, met: false });
          }
        }),
      ),
    );
  }
  // The last waiting order of a trade that never filled was cancelled: end it (unless part of it did fill).
  function endUnfilled(e) {
    enqueue(e, async () => {
      const pid = Object.keys(S.posMap).find((k) => S.posMap[k] === e);
      if (!pid) return;
      const held = await tryOpenPosition(e.master, e.symbol, pid);
      if (held && parseFloat(held.quantity) > 0) return void syncLegs(e);
      if (dropEntry(e)) cancelFollowerCopies(e);
    });
  }

  // ── A master limit that's gone (cancelled here, cancelled or expired elsewhere, or refused by Vest after accepting it):
  // the entry is dropped and every follower's copy is cancelled, so no follower keeps a limit the master doesn't have.
  // A moved limit is a cancel then a new order (Vest's chart drag, the panel's leg drag): each follower's copy of the new
  // one waits behind a gate until its cancel has gone through and the old position has cleared. The gate is set for
  // every follower at once, also one whose copy is still being placed (the cancel waits for it in the entry's queue).
  const _droppedOrders = new Set(); // master order ids whose entry was dropped (a late cancel response finds nothing)
  const _droppedAt = {}; // symbol -> when a waiting master limit there was last dropped (a move is a cancel + a new one)
  const MOVED_LIMIT_MS = 5000;
  function dropEntry(e) {
    const key = Object.keys(S.posMap).find((k) => S.posMap[k] === e);
    if (!key) return false;
    delete S.posMap[key];
    _limitExits.delete(key);
    noteDropped(e.masterOrderId);
    if (e.resting) _droppedAt[e.symbol] = Date.now();
    return true;
  }
  function cancelFollowerCopies(e, lat = () => '', t0 = performance.now()) {
    const accts = [...new Set([...S.followers, ...Object.keys(e.followers || {})])];
    const sent = {};
    for (const f of accts) {
      const done = new Promise((resolve) => (sent[f] = resolve));
      gateCancel(f, e.symbol, async () => {
        await done;
        const fp = e.followers[f];
        if (fp && fp.positionId) await waitPositionGone(f, fp.positionId);
      });
    }
    enqueue(e, async () => {
      await cancelWaitingCopies(e); // a Scale's other slices first: the follower's order holder can't clear while they wait
      return Promise.all(
        accts.map(async (f) => {
          const fp = e.followers[f];
          if (!fp || !fp.orderId) return sent[f]();
          fp.cancelled = true; // a refused copy's retry (watchRestingOpen) must not bring it back
          try {
            await acctPost(f, '/v3/positions/cancel-order', { orderId: fp.orderId }).finally(() => sent[f]());
            logEvent('ok', `↳ cancelled order on ${accLabel(f)} (${lat()})`);
            diag('cancel', { ...who(f), orderId: fp.orderId, outcome: 'cancelled', met: true, ms: msSince(t0) });
          } catch (err) {
            // it may have filled already: then the follower holds a position the master doesn't
            let holding = null;
            try {
              holding = await openPosition(f, e.symbol);
            } catch {
              /* unreadable: say so below */
            }
            if (holding && parseFloat(holding.quantity) > 0) {
              raiseOrphans(
                e.symbol,
                [{ accountId: f, positionId: posIdOf(holding) }],
                "a follower's limit filled before the master's was cancelled",
                S.master,
              );
              return;
            }
            // nothing to cancel and nothing waiting there (its copy was refused, or already gone): nothing to say
            if (errCode(err) === 404 && !(holding && posIdOf(holding))) {
              diag('cancel', { ...who(f), orderId: fp.orderId, outcome: 'nothing-to-cancel', met: true });
              return;
            }
            logEvent(
              'warn',
              `↳ ${accLabel(f)} cancel failed: ${err.message} — its order may still be resting. Check it on Vest.`,
            );
            diag('cancel', {
              ...who(f),
              outcome: 'rejected',
              error: err.message,
              errorCode: errCode(err),
              met: false,
            });
          }
        }),
      );
    });
  }
  // A master limit Vest accepted and then refused (its feed's command_events), e.g. "already exists" after a quick move:
  // handled like a master cancel. Without the live feed a refusal isn't seen here (Vest's own page shows it).
  async function watchMasterResting(e) {
    const ff = await feedFill(e.masterOrderId, RESTING_REJECT_WAIT_MS);
    if (!(ff && ff.missing && /refused/.test(ff.why || ''))) return;
    if (!dropEntry(e)) return; // already gone (cancelled or closed meanwhile)
    logEvent('warn', `MASTER's limit was refused by Vest (${ff.why}): cancelling the followers' copies.`);
    diag('master', { action: 'refused-after', orderId: e.masterOrderId, why: ff.why });
    cancelFollowerCopies(e);
  }

  // ───────────────────────── fast mode (copy at master-send) ─────────────────────────
  // Fast mode copies the master's order the moment it goes out, not after Vest answers: the followers' orders leave
  // with the master's, so they fill as close to it as the connection allows. Returns a `pending` descriptor for the
  // answer (settleFast), or null when the order is copied from the answer as usual.
  function maybeFast(url, reqBody, auth, method, via) {
    return method === 'POST' && orderAction(url) === 'open'
      ? maybeFastOpen(url, reqBody, auth, via)
      : maybeFastAction(url, reqBody, auth, method, via);
  }
  const settleFast = (pending, resBody, status, unreadable = false) =>
    pending.action
      ? reconcileFastAction(pending, resBody, status)
      : reconcileFast(pending, resBody, status, unreadable);

  // Everything after the entry that is safe to send early: a close, a market reduce, a market add, a stop or target
  // added or moved. What takes risk off goes early (a close Vest refuses leaves the followers flatter than the master,
  // never more exposed); an add that Vest refuses is taken back (takeBackAdds). Still from Vest's answer:
  //  - a flip (an opposite reduce, Reduce Only off, bigger than the position): refused on the master after the followers
  //    turned, it would leave them on the other side of it, hedging across accounts (Vest's terms §5(l)/(m));
  //  - removing a stop or target: refused on the master, the follower would be left without one the master still has;
  //  - limit closes, reduces and adds (their order id tracks the copies; they rest at their price anyway);
  //  - cancels (a cancel Vest refuses usually means the master's limit just filled: the followers keep theirs).
  function maybeFastAction(url, reqBody, auth, method, via) {
    if (!S.armed || !S.fast || S.flattening) return null; // during Flatten All the answer path says "not copied"
    const action = orderAction(url);
    if (!action || action === 'open' || action === 'cancel-order') return null;
    if (acctIdFromAuth(auth) !== S.master) return null;
    const req = parseJson(reqBody, null);
    if (!req || typeof req !== 'object') return null;
    if ((action === 'close' || action === 'reduce') && (req.orderType || 'market') !== 'market') return null;
    if (action === 'append' && !isImmediate(req)) return null;
    const m = String(method || 'POST').toUpperCase();
    if (m === 'DELETE') return null;
    if (action === 'reduce' && req.reduceOnly === false) {
      const e = S.posMap[req.positionId];
      if (!e || parseFloat(req.quantity) > heldBefore(req.positionId, e) + sizeStepOf(e.symbol) / 2) return null;
    }
    checkShape(action, req, m);
    const pending = { action, req, method: m, rec: null };
    pending.answer = new Promise((resolve) => (pending.settle = resolve)); // Vest's answer, or null if refused / lost
    mirror(action, req, {}, m, via, pending);
    return pending;
  }
  // Vest's answer to a master order already copied at send. Accepted: the master's order id goes where the fill check
  // needs it. Refused or lost: the followers' copies already went, so the log says what that leaves and the trade's
  // sizes and stops are read again (the next copies scale from the truth).
  function reconcileFastAction(p, resBody, status) {
    if (p.done) return;
    p.done = true;
    const res = parseJson(resBody, {}) || {};
    if (status >= 200 && status < 300) {
      refreshSoon();
      if (p.rec && res.orderId) p.rec.orderId = res.orderId;
      return p.settle(res);
    }
    p.lost = !(status >= 400); // no answer: Vest may or may not have run it
    p.status = status;
    p.settle(null);
    const { action, req } = p,
      lost = p.lost;
    diag('master_refused', { action, method: p.method, status, fast: true, reason: res.msg || res.message || null });
    // an add is settled by takeBackAdds and a stop or target change by mirrorLeg, which know what each follower did
    if (action === 'append' || KIND_OF[action]) return;
    const what = action === 'close' ? 'close' : 'reduce';
    const left =
      action === 'close'
        ? 'the followers are out of the trade and the master is still in it: close the master on Vest'
        : 'the followers were reduced and the master was not: their sizes are read again';
    logEvent(
      'warn',
      lost
        ? `MASTER ${what}: no answer from Vest (connection lost), but fast mode had already sent it to the followers. Check the master on Vest.`
        : `MASTER ${what} refused by Vest (HTTP ${status}), but fast mode had already sent it to the followers: ${left}.`,
    );
    const e = S.posMap[req.positionId];
    if (e) enqueue(e, () => syncLegs(e));
  }
  const KIND_OF = { 'stop-loss': 'stop', 'take-profit': 'target' };

  // Returns a `pending` descriptor if it fired follower opens for a master OPEN; otherwise null.
  function maybeFastOpen(url, reqBody, auth, via = null) {
    if (!S.armed || !S.fast || S.flattening || S.paused || orderAction(url) !== 'open') return null;
    if (acctIdFromAuth(auth) !== S.master) return null;
    const req = parseJson(reqBody, null);
    if (!req) return null;
    checkShape('open', req);
    const followers = [...S.followers];
    if (!followers.length) return null;
    const { side, symbol: sym, quantity: qty, leverage: lev } = req,
      t0 = performance.now();
    const pending = { side, sym, qty, lev, req, byId: {}, placed: [], jobs: [] };
    logEvent('info', `MASTER opening ${side} ${qty} ${sym} (${lev}x) — fast-firing followers…`);
    diag('master', {
      action: 'open',
      via,
      symbol: sym,
      side,
      qty,
      leverage: lev,
      followers: followers.length,
      fast: true,
    });
    const lat = () => '+' + msSince(t0) + 'ms, fast';
    pending.jobs = followers.map((f) =>
      openFollower(f, { side, sym, qty, lev, req }, pending.byId, lat, true).then((rec) => {
        if (rec) pending.placed.push(rec);
        return rec;
      }),
    );
    return pending;
  }
  // Reconcile a fast open with the master's response: link the followers to the master position, or raise them as
  // orphans if the master was refused or the request failed (status 0).
  // `unreadable`: the request succeeded but its response couldn't be read, so the outcome is unknown.
  function reconcileFast(pending, resBody, status, unreadable = false) {
    if (pending.done) return;
    pending.done = true;
    setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
    const res = parseJson(resBody, {}) || {};
    if (S.flattening) return; // Flatten All is closing everything, these copies included
    if (!S.armed && status >= 200 && status < 300) {
      // disarmed while the copies were in flight: they're not tracked, so offer them as orphans
      Promise.all(pending.jobs).then(() => {
        const list = Object.entries(pending.byId).map(([accountId, v]) => ({
          accountId,
          positionId: v.positionId,
          orderId: v.orderId,
          resting: !isImmediate(pending.req),
          leverage: pending.lev,
        }));
        raiseOrphans(pending.sym, list, 'copying was stopped while they were being opened', S.master);
      });
      return;
    }
    if (status >= 200 && status < 300 && res.positionId && !S.posMap[res.positionId]) {
      // posMap.followers is the SAME object as pending.byId, so follower opens still in flight are linked too
      const e = (S.posMap[res.positionId] = {
        master: S.master,
        side: pending.side,
        symbol: pending.sym,
        masterOrderId: res.orderId,
        resting: !isImmediate(pending.req),
        qty: pending.qty,
        legs: legsOf(pending.req, res),
        followers: pending.byId,
      });
      e.queue = Promise.all(pending.jobs).catch(() => {});
      if (!isImmediate(pending.req)) return void watchMasterResting(e);
      Promise.all(pending.jobs).then(() =>
        confirmFills(
          pending.sym,
          { accountId: S.master, orderId: res.orderId, qty: pending.qty, ioc: pending.req.orderType === 'limit' },
          pending.placed,
          e,
          'entry',
        ),
      );
      return;
    }
    if (status >= 200 && status < 300 && res.positionId && S.posMap[res.positionId]) {
      // Vest answered with a position the copier already copies: a second entry on a market already in a trade, which
      // Vest doesn't run (it refuses it a moment later, code 10006). The trade carries on as it is; a follower's copy is
      // raised only if it really filled (it never offers the followers' positions in that trade for flattening).
      logEvent(
        'warn',
        `MASTER sent a second entry on ${symLabel(pending.sym)} while already in a trade there: Vest doesn't run that (adds go through Add). The trade carries on.`,
      );
      diag('master', { action: 'open', outcome: 'second-entry', positionId: res.positionId, orderId: res.orderId });
      Promise.all(pending.jobs).then(async () => {
        const filled = [];
        for (const [accountId, v] of Object.entries(pending.byId))
          if (v.orderId && (await fillInfo(accountId, pending.sym, v.orderId)))
            filled.push({ accountId, positionId: v.positionId, orderId: v.orderId, leverage: pending.lev });
        raiseOrphans(pending.sym, filled, 'a second entry filled on the follower and not on the master', S.master);
      });
      return;
    }
    Promise.all(pending.jobs).then(() => {
      const list = Object.entries(pending.byId).map(([accountId, v]) => ({
        accountId,
        positionId: v.positionId,
        orderId: v.orderId,
        resting: !isImmediate(pending.req),
        leverage: pending.lev,
      }));
      const refused = status >= 400 && !unreadable;
      const why = refused
        ? `the master entry was refused (HTTP ${status})`
        : "the master's response was lost, so its entry can't be linked";
      raiseOrphans(pending.sym, list, why, refused ? null : S.master);
    });
  }

  // Followers holding a position the master doesn't (fast-mode entry refused, or an entry the master didn't fill).
  // Auto-flatten closes them; otherwise the panel asks Flatten / Keep. New orphans join any already waiting.
  // `checkMaster`: when the master's outcome is uncertain, auto-flatten only if the master is confirmed to hold nothing
  // on that market; otherwise the trader decides.
  async function raiseOrphans(sym, list, why, checkMaster = null) {
    // never a position that belongs to a trade the copier is still copying (the master is in it with them)
    const copying = new Set(
      Object.values(S.posMap).flatMap((e) => Object.values(e.followers).map((fp) => fp.positionId)),
    );
    list = list.filter((o) => !(o.positionId && copying.has(o.positionId)));
    if (!list.length) return;
    let masterIn = false;
    if (checkMaster) {
      try {
        masterIn = !!(await openPosition(checkMaster, sym));
      } catch {
        masterIn = true; // unreadable: assume it may be in
      }
    }
    const n = list.length;
    logEvent('warn', `${n} follower position${n !== 1 ? 's' : ''} without the master — ${why}.`);
    if (masterIn)
      logEvent('warn', `The master may hold ${symLabel(sym)} itself — check it before flattening the followers.`);
    diag('orphan', { symbol: sym, followersOpened: n, why, autoFlatten: S.autoFlatten, masterMayBeIn: masterIn });
    const items = list.map((o) => ({ ...o, symbol: sym, hold: masterIn, why }));
    S.orphan = { list: [...((S.orphan && S.orphan.list) || []), ...items] };
    if (S.autoFlatten && !masterIn) flattenOrphans(true);
    else {
      // the Flatten / Keep prompt is hidden in a minimised panel: open it
      if (_root && _root.querySelector('.panel.collapsed')) setOpen(true);
      render();
    }
  }
  // `autoOnly`: auto-flatten closes only the batches raised with the master confirmed out; one held for the user's
  // Flatten / Keep (the master may be in) stays waiting.
  async function flattenOrphans(autoOnly = false) {
    const o = S.orphan;
    if (!o) return;
    const go = autoOnly ? o.list.filter((v) => !v.hold) : o.list,
      wait = autoOnly ? o.list.filter((v) => v.hold) : [];
    S.orphan = wait.length ? { list: wait } : null;
    logEvent('warn', `Flattening ${go.length} orphan follower position(s)…`);
    for (const v of go) {
      const lev = v.leverage || (S.byId[v.accountId] && S.byId[v.accountId].leverage) || DEFAULT_LEVERAGE;
      if (v.resting && v.orderId)
        try {
          // a limit entry may still be resting: cancel it, or it could fill after the close
          await acctPost(v.accountId, '/v3/positions/cancel-order', { orderId: v.orderId });
        } catch {
          /* best effort: already filled or gone */
        }
      try {
        await sendExit(v.accountId, '/v3/positions/close', closeBody(v.symbol, v.positionId, lev));
        logEvent('ok', `↳ flattened ${accLabel(v.accountId)}`);
      } catch (e) {
        logEvent('warn', `↳ ${accLabel(v.accountId)} flatten failed: ${e.message} — close it on Vest.`);
      }
    }
    setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
    render();
  }
  function keepOrphans() {
    S.orphan = null;
    logEvent('warn', 'Kept the orphan follower positions — manage them on Vest.');
    render();
  }

  // ───────────────────────── flatten-all ─────────────────────────
  // Close every open position and cancel every resting order on ALL loaded accounts, whatever is selected, in one click:
  // an emergency button, and a quick way out of a trade across many accounts. The copier stays armed (or disarmed) as it
  // was, ready for the next trade. Everything the copier already knows about (Vest's live feed, or the last read) is
  // closed and cancelled at once, on every account together, before anything is read. Then, as a safety net: nothing
  // new is copied, an arm in progress is cancelled, follower orders still in flight are waited for, and each account
  // is read and swept, twice, catching anything the first round didn't know about or that landed meanwhile.
  const closeOne = (id, sym, pid, lev) =>
    sendExit(id, '/v3/positions/close', closeBody(sym, pid, lev || DEFAULT_LEVERAGE)).then(
      () => logEvent('ok', `↳ closed ${symLabel(sym)} on ${accLabel(id)}`),
      (e) => logEvent('warn', `↳ ${accLabel(id)} close failed: ${e.message}`),
    );
  // an order already gone (filled, or cancelled with its position) is nothing to cancel: no warning
  const cancelOne = (id, oid) =>
    acctPost(id, '/v3/positions/cancel-order', { orderId: oid }).then(
      () => logEvent('ok', `↳ cancelled a resting order on ${accLabel(id)}`),
      (e) =>
        errCode(e) === 404
          ? diag('cancel', { ...who(id), orderId: oid, why: 'flatten all', outcome: 'nothing-to-cancel', met: true })
          : logEvent('warn', `↳ ${accLabel(id)} cancel failed: ${e.message}`),
    );
  // The first round, sent without waiting for anything: returns the position and order ids it went for.
  function flattenKnown(ids) {
    const sent = new Set();
    for (const id of ids) {
      const st = S.acctState[id];
      if (!stateFresh(st)) continue;
      for (const p of st.positions)
        if (p.id && p.qty > 0) {
          sent.add(p.id);
          closeOne(id, p.symbol, p.id, p.leverage || (S.byId[id] && S.byId[id].leverage));
        }
      for (const o of st.orders || [])
        if (o.id) {
          sent.add(o.id);
          cancelOne(id, o.id);
        }
    }
    return sent;
  }
  // `skip`: ids the first round already went for (the first sweep can read them before Vest has closed them).
  async function flattenAccount(id, skip = null) {
    const { token } = await mintAccountToken(id);
    const [posR, ordR] = await Promise.all([
      api('/v3/positions/opened', token),
      api('/v3/positions/opened-orders', token),
    ]);
    // a resting limit's size-0 position holds only its pending stop and targets: cancelling the order clears it, and a
    // close would only be refused (Vest 10009) while the log said "closed"
    const left = (x) => !(skip && skip.has(x)),
      positions = ((posR && posR.positions) || []).filter(
        (p) => (p.quantity == null || num(p.quantity) > 0) && posIdOf(p) && p.symbol && left(posIdOf(p)),
      ),
      orders = ((ordR && ordR.orders) || []).filter(
        (o) => (o.orderId || o.order_id || o.id) && left(o.orderId || o.order_id || o.id),
      );
    // resting orders first (one could fill after its position closed), each kind all at once
    await Promise.all(orders.map((o) => cancelOne(id, o.orderId || o.order_id || o.id)));
    await Promise.all(
      positions.map((p) => closeOne(id, p.symbol, posIdOf(p), p.leverage || (S.byId[id] && S.byId[id].leverage))),
    );
    return positions.length + orders.length;
  }
  async function flattenAll() {
    if (S.flattening) return;
    const ids = Object.keys(S.byId);
    if (!ids.length) {
      logEvent('warn', 'Flatten All: no accounts loaded.');
      return render();
    }
    S.flattening = true;
    // everything between the flag and the sweep is inside the try: an error there must never leave it set
    try {
      let known = null;
      try {
        known = flattenKnown(ids); // out first; everything else after
      } catch (e) {
        diag('script_error', { message: String((e && e.message) || e), where: 'flatten-known' }); // the sweep still runs
      }
      _armEpoch++; // an arm in progress would adopt positions that are being closed
      S.orphan = null;
      try {
        Object.values(S.plans).forEach((p) => endPlan(p, null)); // nothing left for breakeven to manage
        cancelStopEntries('Flatten All.'); // nothing new opens either
        render();
      } catch (e) {
        diag('script_error', { message: String((e && e.message) || e), where: 'flatten-all' }); // the sweep still runs
      }
      logEvent(
        'warn',
        `FLATTEN ALL — closing every position and cancelling every order on ${ids.length} account(s).${S.armed ? ' Copying keeps running for your next trade.' : ''}`,
      );
      diag('flatten_all', { accounts: ids.length, armed: S.armed, sentAtOnce: known ? known.size : 0 });
      await flattenSweep(ids, known);
    } finally {
      S.flattening = false; // never left set: master orders would be skipped as "during Flatten All" while ARMED shows
      setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
      render();
    }
  }
  async function flattenSweep(ids, known = null) {
    const inFlight = Object.values(S.posMap)
      .map((e) => e.queue)
      .filter(Boolean);
    await Promise.race([Promise.all(inFlight), sleep(FLATTEN_WAIT_MS)]);
    S.posMap = {};
    const sweep = (skip) =>
      Promise.all(
        ids.map((id) =>
          flattenAccount(id, skip).catch((e) => {
            logEvent('warn', `↳ ${accLabel(id)} couldn't be read: ${e.message}`);
            return 1;
          }),
        ),
      );
    await sweep(known);
    await sleep(FLATTEN_RECHECK_MS);
    const left = (await sweep(null)).reduce((a, b) => a + b, 0);
    if (left)
      logEvent('warn', 'Flatten All: some positions or orders needed a second pass — check every account on Vest.');
    else logEvent('ok', 'Flatten All complete — every account is flat.');
  }

  // ───────────────────────── trade panel: order math (pure) ─────────────────────────
  // Everything here is a pure function of its inputs — no network, no state — so it's unit-tested
  // (test/math.test.mjs with fixed cases, test/props.test.mjs with random ones). Prices and sizes are plain numbers;
  // `side` is 'long' or 'short'.
  /**
   * How many decimals a tick or size step has (0.25 → 2, 0.0001 → 4, 1e-7 → 7).
   *
   * @param {number|string} step a tick or size step
   * @returns {number} the number of decimal places
   */
  const decimalsOf = (step) => {
    const s = String(step);
    const e = s.match(/^[\d.]+e-(\d+)$/i); // 1e-7 and the like
    if (e) return (s.split('e')[0].split('.')[1] || '').length + +e[1];
    return s.includes('.') ? s.split('.')[1].length : 0;
  };
  /**
   * Round a price to the market's tick, to the nearest one.
   *
   * @param {number} price any price
   * @param {number} tick the market's tick (0.25 for NQ)
   * @returns {number} the price on the tick
   */
  const roundTick = (price, tick) => +(Math.round(price / tick) * tick).toFixed(decimalsOf(tick));
  /**
   * Floor a size to the market's size step. The tolerance grows with the count, so a float a hair under a whole number
   * of steps isn't floored a step too low.
   *
   * @param {number} qty any size
   * @param {number} step the size step (0.0001 for NQ)
   * @returns {number} the size, floored to whole steps
   */
  const floorStep = (qty, step) => {
    const u = qty / step;
    return +(Math.floor(u + 1e-9 + Math.abs(u) * 1e-12) * step).toFixed(decimalsOf(step));
  };

  /**
   * Split a total size across N targets.
   *   even  — equal slices
   *   start — heaviest first (weights N … 1): bank most at the first target
   *   end   — heaviest last  (weights 1 … N): let most of it run to the last target
   * Works in whole size-steps (largest-remainder method): each slice is floored, then the leftover steps go to
   * the slices that were rounded down the most — so the total is exact and slices stay as even as possible
   * (1.0 over 3, start → 0.5000 / 0.3333 / 0.1667).
   *
   * @param {number} total the size to split
   * @param {number} n how many targets
   * @param {'even'|'start'|'end'} mode where the heavier slices go
   * @param {number} step the size step
   * @returns {{qtys: number[]} | {error: string}} one size per target, or why it can't be split (a slice would be empty)
   */
  function splitQty(total, n, mode, step) {
    if (!(total > 0) || !(n >= 1)) return { error: 'Size must be above zero' };
    const w = Array.from({ length: n }, (_, i) => (mode === 'start' ? n - i : mode === 'end' ? i + 1 : 1));
    const wsum = w.reduce((a, b) => a + b, 0);
    const units = Math.floor(total / step + 1e-9); // total, in size steps
    const raw = w.map((x) => (units * x) / wsum);
    const base = raw.map((r) => Math.floor(r + 1e-9));
    const left = units - base.reduce((a, b) => a + b, 0);
    const order = raw
      .map((r, i) => [r - Math.floor(r + 1e-9), w[i], i])
      .sort((a, b) => b[0] - a[0] || b[1] - a[1] || a[2] - b[2]);
    for (let k = 0; k < left; k++) base[order[k % n][2]]++;
    if (base.some((u) => u < 1))
      return { error: `${total} is too small to split into ${n} targets — use fewer targets or a bigger size` };
    const dec = decimalsOf(step);
    return { qtys: base.map((u) => +(u * step).toFixed(dec)) };
  }

  /**
   * Re-split a trade's sized targets across its new size (after an add, a reduce or a target added): the targets nearest
   * the entry first, sized by the trade's split. Their prices never change; a target already hit isn't in the list.
   *
   * @param {object} o the trade
   * @param {'long'|'short'} o.side the trade's direction
   * @param {number[]} o.prices each open target's price, in any order
   * @param {number} o.total the position's size now
   * @param {'even'|'start'|'end'} o.mode the trade's split
   * @param {number} o.step the size step
   * @param {number} [o.minUsd] Vest's minimum value per target
   * @returns {{qtys: number[]} | {error: string}} one size per target, in the order of `prices`, or why it can't be split
   */
  function resplitTargets({ side, prices, total, mode, step, minUsd = 0 }) {
    if (!prices.length) return { error: 'No targets to split' };
    const ladder = prices.map((p, i) => ({ p, i })).sort((a, b) => (side === 'long' ? a.p - b.p : b.p - a.p));
    const sp = splitQty(total, ladder.length, mode, step);
    if (sp.error) return sp;
    if (ladder.some((x, k) => sp.qtys[k] * x.p < minUsd))
      return {
        error: `${total} is too small to split into ${ladder.length} targets (the $${minUsd} minimum per target)`,
      };
    const qtys = [];
    ladder.forEach((x, k) => (qtys[x.i] = sp.qtys[k]));
    return { qtys };
  }

  /**
   * Turn point distances into trigger prices from an entry price.
   * long: stop below, targets above · short: stop above, targets below. Targets must be increasing distances.
   * `stopPts: null` is a trade without a stop (stop: null); an empty `targetPts` is one without targets.
   *
   * @param {object} o the plan
   * @param {'long'|'short'} o.side the trade's direction
   * @param {number} o.entry the entry price
   * @param {number|null} o.stopPts the stop's distance in points, or null for no stop
   * @param {number[]} o.targetPts each target's distance in points, nearest first
   * @param {number} o.tick the market's tick
   * @returns {{stop: number|null, targets: number[]} | {error: string}} the trigger prices, or why they can't be set
   */
  function planPrices({ side, entry, stopPts, targetPts, tick }) {
    if (!(entry > 0)) return { error: 'No live price yet' };
    const noStop = stopPts === null;
    if (!noStop && !(stopPts > 0)) return { error: 'Stop must be above zero points' };
    for (let i = 0; i < targetPts.length; i++) {
      if (!(targetPts[i] > 0)) return { error: `Target ${i + 1} must be above zero points` };
      if (i && !(targetPts[i] > targetPts[i - 1])) return { error: `Target ${i + 1} must be further than target ${i}` };
    }
    const dir = side === 'long' ? 1 : -1;
    const stop = noStop ? null : roundTick(entry - dir * stopPts, tick),
      targets = targetPts.map((p) => roundTick(entry + dir * p, tick));
    if (!noStop && !(stop > 0)) return { error: 'The stop would be at or below zero: use fewer points' };
    const bad = targets.findIndex((x) => !(x > 0));
    if (bad >= 0) return { error: `Target ${bad + 1} would be at or below zero: use fewer points` };
    return { stop, targets };
  }

  /**
   * Size from a dollar risk: risk ÷ (stop points × $ per point per unit), floored to the size step.
   *
   * @param {number} riskUsd the dollars to risk
   * @param {number} stopPts the stop's distance in points
   * @param {number} pointValue dollars per point per unit ($1 on NQ)
   * @param {number} step the size step
   * @returns {number} the size, or 0 when any input is missing
   */
  const riskQty = (riskUsd, stopPts, pointValue, step) =>
    riskUsd > 0 && stopPts > 0 && pointValue > 0 ? floorStep(riskUsd / (stopPts * pointValue), step) : 0;

  /**
   * The breakeven stop price: the entry (an average can sit between ticks) plus an offset in your favour (+1 pt covers
   * fees), rounded to the tick on the profit side, so never a loss. A negative offset would put the stop on the losing
   * side of the entry: it counts as 0.
   *
   * @param {object} o the position
   * @param {'long'|'short'} o.side the trade's direction
   * @param {number} o.entry the average entry price
   * @param {number} o.offsetPts points to lock in past the entry
   * @param {number} o.tick the market's tick
   * @returns {number} the stop price
   */
  const breakevenPrice = ({ side, entry, offsetPts, tick }) => {
    const n = (entry + (side === 'long' ? 1 : -1) * Math.max(0, offsetPts || 0)) / tick;
    return +((side === 'long' ? Math.ceil(n - 1e-9) : Math.floor(n + 1e-9)) * tick).toFixed(decimalsOf(tick));
  };
  /**
   * Should the stop move to breakeven now? Never fires twice.
   *
   * @param {object} o the plan and the price now
   * @param {'off'|'tp1'|'points'} o.mode never, after the first target fills, or once price has moved `triggerPts`
   * @param {'long'|'short'} o.side the trade's direction
   * @param {number} o.entry the average entry price
   * @param {number} o.price the price now
   * @param {number} o.triggerPts points in your favour that trigger it ('points' mode)
   * @param {boolean} o.tp1Filled whether the first target has filled ('tp1' mode)
   * @param {boolean} o.alreadyMoved whether the stop was already moved
   * @returns {boolean} true to move the stop now
   */
  function breakevenDue({ mode, side, entry, price, triggerPts, tp1Filled, alreadyMoved }) {
    if (alreadyMoved || mode === 'off' || !mode) return false;
    if (mode === 'tp1') return !!tp1Filled;
    if (mode === 'points')
      return triggerPts > 0 && price > 0 && (side === 'long' ? price - entry : entry - price) >= triggerPts;
    return false;
  }

  const TRADING_POWER_SPREAD = 0.001; // Vest's ticket leaves 0.1% for the spread
  /**
   * Vest's "Trading Power", the order value its own ticket allows at 100%: free cash (less any open loss) times leverage,
   * less room for the opening fee and a 0.1% allowance for the spread.
   *
   * @param {object} o the account
   * @param {number} o.free free cash
   * @param {number} o.upnl open P&L (only a loss counts)
   * @param {number} o.leverage the order's leverage
   * @param {number} o.takerFee the market's taker fee (0.000025 on NQ)
   * @returns {number} the largest order value, in dollars
   */
  const tradingPower = ({ free, upnl, leverage, takerFee }) =>
    leverage > 0 && free > 0
      ? (Math.max(0, free + Math.min(0, upnl || 0)) * leverage) /
        (1 + leverage * (takerFee || 0)) /
        (1 + TRADING_POWER_SPREAD)
      : 0;
  /**
   * The largest size that trading power buys, floored to the step.
   *
   * @param {number} power the trading power, in dollars
   * @param {number} price the margin mark price (what Vest prices a new order's margin at)
   * @param {number} step the size step
   * @returns {number} the size, or 0 when either is missing
   */
  const maxQtyFor = (power, price, step) => (power > 0 && price > 0 ? floorStep(power / price, step) : 0);

  /**
   * Where a position fails or passes, measured from the price now. Fail: equity reaches the floor (drawdown, or the
   * daily-loss floor when higher). Pass: equity reaches the target (evaluations only).
   *
   * @param {object} o the position and the account
   * @param {'long'|'short'} o.side the trade's direction
   * @param {number} o.qty the whole position after this order
   * @param {number} o.price the price now
   * @param {number} o.equity the account's equity at that price
   * @param {number} o.openFee the opening fee (comes straight out of equity)
   * @param {number} o.floor the equity that fails the account
   * @param {number|null} o.target the equity that passes it (null when funded)
   * @returns {{fail: number|null, pass: number|null}} the two prices; null where there is none
   */
  function failPassPrices({ side, qty, price, equity, openFee, floor, target }) {
    if (!(qty > 0) || !(price > 0) || !Number.isFinite(equity)) return { fail: null, pass: null };
    const dir = side === 'long' ? 1 : -1,
      e = equity - (openFee || 0);
    const fail = floor > 0 && e > floor ? price - (dir * (e - floor)) / qty : null;
    const pass = target > 0 && target > e ? price + (dir * (target - e)) / qty : null;
    return { fail: fail > 0 ? fail : null, pass: pass > 0 ? pass : null };
  }
  // The allowed range, so the panel can say where the stop may go and how much can be risked. Size = risk ÷ stop, the
  // size is capped by Vest's max, and a stop-out (plus both fees) must stay under the room left to the floor.
  /**
   * The smallest stop at which `risk` fits in the max size.
   *
   * @param {number} risk the dollars to risk
   * @param {number|null} maxQty the largest size allowed
   * @param {number} tick the market's tick
   * @returns {number|null} the stop in points (whole ticks), or null when the max isn't known
   */
  const minStopFor = (risk, maxQty, tick) =>
    risk > 0 && maxQty > 0 ? +(Math.ceil(risk / maxQty / tick - 1e-9) * tick).toFixed(decimalsOf(tick)) : null;
  /**
   * The most that can be risked at this stop with the max size.
   *
   * @param {number} maxQty the largest size allowed
   * @param {number} stopPts the stop's distance in points
   * @returns {number|null} whole dollars, or null when either is missing
   */
  const maxRiskAt = (maxQty, stopPts) => (maxQty > 0 && stopPts > 0 ? Math.floor(maxQty * stopPts + 1e-9) : null);
  /**
   * The most that can be risked at this stop before a stop-out, both fees included, reaches the floor.
   *
   * @param {object} o the account and the stop
   * @param {number} o.room dollars left above the floor
   * @param {number} o.price the price now
   * @param {number} o.stopPts the stop's distance in points
   * @param {number} o.takerFee the market's taker fee
   * @returns {number|null} whole dollars, or null when an input is missing
   */
  const maxRiskForRoom = ({ room, price, stopPts, takerFee }) =>
    room > 0 && price > 0 && stopPts > 0
      ? Math.max(0, Math.floor(room / (1 + ((2 * price - stopPts) * (takerFee || 0)) / stopPts) - 0.01))
      : null;
  /**
   * The widest stop for `qty` before a stop-out, both fees included, reaches the floor.
   *
   * @param {object} o the account and the size
   * @param {number} o.room dollars left above the floor
   * @param {number} o.qty the position size
   * @param {number} o.price the price now
   * @param {number} o.takerFee the market's taker fee
   * @param {number} o.tick the market's tick
   * @returns {number|null} points (whole ticks; 0 when no stop fits), or null when an input is missing
   */
  const maxStopForRoom = ({ room, qty, price, takerFee, tick }) => {
    if (!(room > 0) || !(qty > 0) || !(price > 0)) return null;
    const f = takerFee || 0,
      pts = (room - 0.01 - 2 * qty * price * f) / (qty * (1 - f));
    return pts > 0 ? +(Math.floor(pts / tick + 1e-9) * tick).toFixed(decimalsOf(tick)) : 0;
  };
  /**
   * The size step for the unit the Trade tab sizes in. Vest sizes NQ, ES and RTY in whole minis or micros as well as
   * units: `micro` is how many units one micro is on this market (a mini is 10). Units keep the market's own step.
   *
   * @param {number} step the market's size step
   * @param {number|undefined} micro units per micro (undefined on markets without minis and micros)
   * @param {'units'|'micro'|'mini'} unit the unit the Trade tab sizes in
   * @returns {number} the size step in units
   */
  const unitStep = (step, micro, unit) =>
    micro > 0 && unit === 'micro' ? micro : micro > 0 && unit === 'mini' ? micro * 10 : step;
  // Stop entries (a buy stop above the price, a sell stop below), which Vest doesn't have: the copier watches the price
  // and sends the order itself.
  /**
   * Has the price reached a stop entry's level?
   *
   * @param {'long'|'short'} side a buy stop or a sell stop
   * @param {number} level the stop's price
   * @param {number|null} px the price now
   * @returns {boolean} true once a buy stop's price is at or above the level, a sell stop's at or below
   */
  const stopEntryHit = (side, level, px) => px > 0 && level > 0 && (side === 'long' ? px >= level : px <= level);
  /**
   * With a max slip, the worst price an immediate-or-cancel limit may fill at: the level plus the slip for a buy, minus
   * for a sell, on the tick toward the level, so never more slip than asked.
   *
   * @param {object} o the stop entry
   * @param {'long'|'short'} o.side a buy stop or a sell stop
   * @param {number} o.level the stop's price
   * @param {number} o.slipPts the max slip in points (0 or blank: none)
   * @param {number} o.tick the market's tick
   * @returns {number|null} the limit price, or null for a market order
   */
  const stopEntryLimit = ({ side, level, slipPts, tick }) => {
    if (!(slipPts > 0) || !(level > 0)) return null;
    const n = (level + (side === 'long' ? 1 : -1) * slipPts) / tick;
    return +((side === 'long' ? Math.floor(n + 1e-9) : Math.ceil(n - 1e-9)) * tick).toFixed(decimalsOf(tick));
  };
  /**
   * What a stop-out costs from the price now: the move to the stop on the whole position, plus both fees.
   *
   * @param {object} o the position and its stop
   * @param {'long'|'short'} o.side the trade's direction
   * @param {number} o.qty the position size
   * @param {number} o.price the price now
   * @param {number} o.stopPrice the stop's price
   * @param {number} o.openFee the opening fee
   * @param {number} o.takerFee the market's taker fee (charged again on the stop's fill)
   * @returns {number} the loss in dollars
   */
  const stopOutLoss = ({ side, qty, price, stopPrice, openFee, takerFee }) =>
    (side === 'long' ? 1 : -1) * qty * (price - stopPrice) + (openFee || 0) + qty * stopPrice * (takerFee || 0);

  if (window.__VC_TEST__)
    window.__vcMath = {
      roundTick,
      floorStep,
      splitQty,
      resplitTargets,
      planPrices,
      riskQty,
      breakevenPrice,
      breakevenDue,
      tradingPower,
      maxQtyFor,
      failPassPrices,
      stopOutLoss,
      minStopFor,
      maxRiskAt,
      maxRiskForRoom,
      maxStopForRoom,
      unitStep,
      stopEntryHit,
      stopEntryLimit,
    };

  // ───────────────────────── live price (public market data, read-only) ─────────────────────────
  // Vest's public socket streams, per market: `@ticker` (mark and margin mark price, about every 750 ms), `@depth_<tick>`
  // (the order book: best bid and ask on every change) and `@trades` (every trade as it prints). The price the copier uses
  // is Vest's own reference: the book's mid (open P&L, fail prices and targets are all measured on it), else the last
  // trade, else the mark. Stops trigger on the mid (Vest, 2026-10-10; before: the bid or ask); breakeven is checked against
  // the bid (longs) or ask (shorts), a little stricter than the mid, so Vest never refuses the stop. This is
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
  const recentAt = (at) => at > 0 && Date.now() - at < PRICE_STALE_MS;
  const priceOf = (sym) => {
    const p = S.price[sym];
    if (!p) return null;
    if (recentAt(p.bookAt)) return (p.bid + p.ask) / 2;
    if (recentAt(p.lastAt)) return p.last;
    return recentAt(p.at) ? p.px : null;
  };
  // The side of the book a breakeven stop is checked against: the best bid for a long, the best ask for a short (null
  // without a live book). Vest triggers stops on the mid since 2026-10-10; the bid / ask is the stricter, safe check.
  const stopRefOf = (sym, side) => {
    const p = S.price[sym];
    return p && recentAt(p.bookAt) ? (side === 'long' ? p.bid : p.ask) : null;
  };
  // The price Vest values a new market order's margin at (its ticker's margin mark price), else the mark price.
  const marginPriceOf = (sym) => {
    const px = priceOf(sym);
    return px && S.price[sym].mpx > 0 && recentAt(S.price[sym].at) ? S.price[sym].mpx : px;
  };
  function watchPrice(sym) {
    if (_wsSyms.has(sym)) return;
    _wsSyms.add(sym);
    connectPrices();
    fetchPriceOnce(sym);
  }
  // Stop streaming symbols nothing needs any more, and close the socket when none are left.
  function unwatchUnused() {
    const need = new Set(Object.values(S.plans || {}).map((p) => p.symbol));
    for (const e of S.stopEntries || []) need.add(e.symbol);
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
        const be = Object.keys(S.plans || {}).length > 0,
          se = (S.stopEntries || []).length > 0;
        if ((be || se) && !_feedWarned) {
          _feedWarned = true;
          logEvent(
            'warn',
            `Live price feed lost — ${be && se ? 'breakeven and stop entries are' : be ? 'breakeven is' : 'stop entries are'} paused until it reconnects.`,
          );
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
  async function loadAllSymbolRules() {
    try {
      const r = await (await _fetch(`${API}/v3/exchangeInfo`)).json();
      (r.symbols || []).forEach(applySymbolRules);
      diag('market_rules', { outcome: 'loaded', markets: Object.keys(SYMBOLS).length });
    } catch (e) {
      diag('market_rules', { outcome: 'error', error: e.message }); // sizes fall back to NQ's step until a reload
    }
  }
  async function loadSymbolRules(sym) {
    try {
      const r = await (await _fetch(`${API}/v3/exchangeInfo?symbols=${encodeURIComponent(sym)}`)).json();
      const x = (r.symbols || []).find((s) => s.symbol === sym);
      if (x) applySymbolRules(x);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  function applySymbolRules(x) {
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
  // The unit the Trade tab sizes in on this market: the trader's pick, else Vest's own order-form choice (its
  // localStorage "vest-trade" sizeUnit: USD, token, mini or micro), else units. Only NQ, ES and RTY have minis and micros.
  function vestSizeUnit() {
    try {
      const v = JSON.parse(localStorage.getItem('vest-trade') || 'null');
      const u = v && v.state && v.state.sizeUnit;
      return u === 'mini' || u === 'micro' ? u : 'units';
    } catch {
      return 'units';
    }
  }
  const tradeUnit = (sym = S.trade.symbol) =>
    MICRO_UNITS[sym] ? (sym === S.trade.symbol && S.trade.unit) || vestSizeUnit() : 'units';
  const unitSize = (sym = S.trade.symbol) => unitStep((SYMBOLS[sym] || {}).step, MICRO_UNITS[sym], tradeUnit(sym));
  // A size in the chosen unit: "3 micros", "1 mini", or the units as they are ("2.5").
  function fmtUnits(q, sym = S.trade.symbol, words = true) {
    const u = tradeUnit(sym);
    if (u === 'units') return fmtQty(q, sym);
    const n = q / unitSize(sym),
      whole = Math.abs(n - Math.round(n)) < 1e-6;
    const txt = whole ? String(Math.round(n)) : '≈' + +n.toFixed(2);
    return words ? `${txt} ${u}${whole && Math.round(n) === 1 ? '' : 's'}` : txt;
  }
  // Following Vest's own micros / minis choice with a size saved in units smaller than one of them: one whole one (as
  // picking Micros or Minis here does), so the tab never opens at a size it can't send. When the tab opens and when the
  // market changes, never while typing.
  function fitQtyToUnit() {
    if (S.trade.sizeMode === 'qty' && !S.trade.unit && tradeUnit() !== 'units' && +S.trade.qty < unitSize())
      S.trade.qty = unitSize();
  }
  const symLabel = (sym) => (SYMBOLS[sym] && SYMBOLS[sym].label) || String(sym).replace(/-USD-PERP$|-PERP$/, '');

  // ── The Trade tab trades the market Vest is showing: the page address is /trade/<display name> ("ES-PERP"), which Vest
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
  async function followVestMarket() {
    if (_following || !S.tradeOpen) return;
    _following = true;
    try {
      const name = vestMarketName();
      const map = name && (await loadDisplayMap());
      const sym = map && map[name];
      if (sym && sym !== S.trade.symbol && SYMBOLS[sym] && !S.placing && !S.adjusting && !S.exiting) switchMarket(sym);
    } finally {
      _following = false;
    }
  }
  setInterval(followVestMarket, 1000);
  // A market's saved settings, keeping only well-formed values (storage can hold anything).
  function cleanMarket(m) {
    if (!m || typeof m !== 'object') return null;
    const out = {},
      ok = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
    for (const k of ['qty', 'risk', 'pct', 'stopPts', 'beTrigger', 'beOffset']) if (ok(m[k])) out[k] = m[k];
    if (['qty', 'risk', 'pct', 'max'].includes(m.sizeMode)) out.sizeMode = m.sizeMode;
    if (['even', 'start', 'end'].includes(m.scale)) out.scale = m.scale;
    if (['units', 'micro', 'mini'].includes(m.unit)) out.unit = m.unit;
    if (typeof m.stopOn === 'boolean') out.stopOn = m.stopOn;
    if (Array.isArray(m.targets) && m.targets.every((x) => ok(+x) && +x > 0)) out.targets = m.targets.map(Number);
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
      pct: t.pct,
      stopPts: t.stopPts,
      stopOn: t.stopOn,
      targets: [...t.targets],
      scale: t.scale,
      beTrigger: t.beTrigger,
      beOffset: t.beOffset,
      unit: t.unit,
    };
    const saved = cleanMarket(all[sym]);
    t.unit = null; // a market without a saved unit follows Vest's own choice
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
  const depthTickOf = (sym) => (SYMBOLS[sym] && (SYMBOLS[sym].depthTick || String(SYMBOLS[sym].tick))) || '0.25';
  function onPrice(sym) {
    const px = priceOf(sym);
    if (!(px > 0)) return;
    try {
      checkPlans(sym, px);
    } catch (e) {
      diag('breakeven', { outcome: 'error', error: e.message });
    }
    try {
      if (S.stopEntries.length) checkStopEntries(sym, px);
    } catch (e) {
      diag('stop_entry', { outcome: 'error', error: e.message });
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
  function drawTradeSoon() {
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

  // ───────────────────────── arming ─────────────────────────
  // An account's open positions and resting orders. Throws if Vest can't be read: an unreadable account is never
  // assumed to be flat.
  async function openState(id) {
    const { token } = await mintAccountToken(id);
    const [pos, ord] = await Promise.all([
      api('/v3/positions/opened', token),
      api('/v3/positions/opened-orders', token),
    ]);
    const positions = ((pos && pos.positions) || []).map((p) => ({
      positionId: posIdOf(p),
      symbol: p.symbol,
      side: p.side,
      qty: String(p.quantity),
      legs: posLegs(p),
    }));
    return { positions, orders: (ord && ord.orders) || [] };
  }

  // Arm when flat, or adopt an open trade: if the master already holds positions, link each follower's matching position
  // (same symbol and side) so exits and stop/target changes copy to it. Never opens anything for a flat follower; it
  // joins from the next trade. Returns { adopted, notes, openSymbols } or { error }.
  async function planArm(master, followers) {
    const sel = [master, ...followers];
    const state = {};
    try {
      await Promise.all(
        sel.map(async (id) => {
          state[id] = await openState(id);
        }),
      );
    } catch (e) {
      return { error: `couldn't read open positions (${e.message}) — try again` };
    }

    const resting = sel.filter((id) => state[id].orders.length);
    if (resting.length)
      return { error: 'resting orders on ' + resting.map(accLabel).join(', ') + ' — cancel them first' };

    const mPos = state[master].positions;
    const key = (p) => p.symbol + '|' + p.side;
    if (new Set(mPos.map(key)).size !== mPos.length)
      return { error: "the master has two positions on the same symbol and side — can't tell them apart" };

    const adopted = {},
      notes = [];
    for (const p of mPos)
      adopted[p.positionId] = {
        master,
        side: p.side,
        symbol: p.symbol,
        masterOrderId: null,
        qty: p.qty,
        legs: p.legs,
        adopted: true,
        followers: {},
      };
    for (const f of followers) {
      const fPos = state[f].positions;
      if (new Set(fPos.map(key)).size !== fPos.length)
        return { error: `${accLabel(f)} has two positions on the same symbol and side` };
      for (const fp of fPos) {
        const m = mPos.find((p) => key(p) === key(fp));
        if (!m) {
          const opp = mPos.find((p) => p.symbol === fp.symbol);
          return {
            error: opp
              ? `${accLabel(f)} is ${fp.side} ${fp.symbol} but the master is ${opp.side} — opposite direction`
              : `${accLabel(f)} holds ${fp.side} ${fp.symbol} but the master doesn't — close it first`,
          };
        }
        adopted[m.positionId].followers[f] = {
          positionId: fp.positionId,
          orderId: null,
          legs: fp.legs,
          qty: fp.qty,
          share: parseFloat(fp.qty) / parseFloat(m.qty), // as it is now: the size check watches from here
        };
        const unmatched = m.legs.filter((l) => !matchLeg(m.legs, fp.legs, l.id));
        if (unmatched.length) {
          const which = unmatched.map((l) => `${l.kind === 'sl' ? 'stop' : 'target'} at ${l.price}`).join(', ');
          notes.push(
            `${accLabel(f)} has no matching ${which} — changes to ${unmatched.length > 1 ? 'those' : 'that one'} won't copy to it.`,
          );
        }
      }
      if (mPos.length && !fPos.length) notes.push(`${accLabel(f)} is flat — it joins from the next trade.`);
    }
    return {
      adopted,
      notes: [...new Set(notes)],
      openSymbols: new Set(sel.flatMap((id) => state[id].positions.map((p) => p.symbol))),
    };
  }

  // Set each follower's leverage to the master's, per symbol the master has configured. Leverage is left alone under an
  // open position. Returns the per-follower record for diagnostics.
  async function syncLeverage(master, followers, openSymbols) {
    const levs = await fetchLeverages();
    _armLevs = levs; // a follower whose own leverage already matches a copied order's skips the change (openFollower)
    if (!levs) {
      logEvent('warn', "Couldn't read leverage — each follower's leverage will be set on its first copied trade.");
      return [];
    }
    const mlevs = levs[master] || {},
      syms = Object.keys(mlevs),
      out = [];
    if (!syms.length) {
      logEvent('info', 'The master uses default leverage on every market — followers will be matched per trade.');
      return out;
    }
    const show = (k) => (k === 'NaN' ? 'default' : k + 'x');
    for (const f of followers) {
      for (const sym of syms) {
        const want = levKey(mlevs[sym]),
          had = levKey(levFor(levs, f, sym)),
          cacheKey = f + '|' + sym;
        const rec = { ...who(f), symbol: sym, want, had };
        if (had === want) {
          S.levCache[cacheKey] = want;
          out.push({ ...rec, action: 'already-set' });
        } else if (openSymbols.has(sym)) {
          logEvent(
            'info',
            `Left ${accLabel(f)} ${symLabel(sym)} leverage at ${show(had)} (position open) — stop and start copying when flat to sync.`,
          );
          out.push({ ...rec, action: 'skipped-open-position' });
        } else {
          try {
            await setFollowerLeverage(f, sym, want);
            S.levCache[cacheKey] = want;
            out.push({ ...rec, action: 'set' });
          } catch (e) {
            logEvent('warn', `Couldn't set ${accLabel(f)} ${symLabel(sym)} leverage: ${e.message}`);
            out.push({ ...rec, action: 'error', error: e.message });
          }
        }
      }
    }
    const failed = out.filter((r) => r.action === 'error').length;
    const summary = syms.map((s) => show(levKey(mlevs[s])) + ' ' + symLabel(s)).join(', ');
    logEvent(
      failed ? 'warn' : 'info',
      failed ? `Leverage sync: ${failed} failed (target ${summary}).` : `Leverage synced (${summary}).`,
    );
    return out;
  }

  // Bumped by disarm and Flatten All, so an arm still in flight is cancelled: it would switch the copier back on after a
  // disarm, or adopt positions that Flatten All is closing.
  let _armEpoch = 0;
  // Other Vest tabs running the copier: each says when it arms or disarms, and answers a new tab's hello. A tab that
  // closes says bye; one that crashes is forgotten after TAB_STALE_MS without news.
  const TAB_ID = Math.random().toString(36).slice(2),
    TAB_STALE_MS = 5 * 60 * 1000,
    _peers = {};
  let _tabs = null;
  try {
    _tabs = new BroadcastChannel('vc-tabs');
    _tabs.onmessage = (e) => {
      const m = e.data || {};
      if (!m.id || m.id === TAB_ID) return;
      if (m.type === 'hello') tabSay('state');
      if (m.type === 'bye') return delete _peers[m.id];
      if (!_peers[m.id]) logEvent('warn', 'The copier is open in another Vest tab too. Copy from one tab only.');
      _peers[m.id] = { armed: !!m.armed, at: Date.now() };
    };
    window.addEventListener('pagehide', () => tabSay('bye'));
  } catch {
    _tabs = null; // no BroadcastChannel: nothing to coordinate
  }
  function tabSay(type) {
    try {
      if (_tabs) _tabs.postMessage({ type, id: TAB_ID, armed: !!S.armed });
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  const armedElsewhere = () => Object.values(_peers).some((p) => p.armed && Date.now() - p.at < TAB_STALE_MS);
  // Remembered for this tab only: a reload while armed comes back disarmed, and says so.
  const WAS_ARMED_KEY = 'vc-was-armed';
  function noteArmed(on) {
    tabSay('state');
    try {
      on ? sessionStorage.setItem(WAS_ARMED_KEY, '1') : sessionStorage.removeItem(WAS_ARMED_KEY);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  // A tab that remembers copying (this page reloaded mid-copy) says so, unless another tab is copying: a tab duplicated
  // from the copying one starts with its memory (seen 2026-10-15: a new tab said "reloaded" while the first copied on).
  // The other tabs answer the hello within a moment; the check waits that long.
  const WAS_ARMED_WAIT_MS = 600;
  function checkWasArmed() {
    tabSay('hello');
    let was = false;
    try {
      was = sessionStorage.getItem(WAS_ARMED_KEY) === '1';
      if (was) sessionStorage.removeItem(WAS_ARMED_KEY);
    } catch {
      /* best effort: nothing to do if this fails */
    }
    if (was)
      setTimeout(() => {
        if (!armedElsewhere())
          logEvent('warn', 'The page reloaded while copying, so copying stopped. Press Start copying to continue.');
      }, WAS_ARMED_WAIT_MS);
  }
  async function arm() {
    if (S.arming) return;
    if (S.flattening) return toast('Wait for Flatten All to finish.');
    if (!S.ack) {
      S.ackThenArm = true; // arm right after the terms are accepted
      S.rulesOpen = true;
      render();
      return;
    } // the one-time agreement comes first
    if (S.paused) return toast(pauseBlocks());
    if (!S.master) return toast('Pick a master account first.');
    if (!S.followers.size) return toast('Pick at least one follower.');
    if (S.placing || S.adjusting || S.exiting || claimBusy())
      return toast('Wait for the current order or claim to finish.');
    if (armedElsewhere())
      return toast('The copier is copying in another Vest tab. Stop it there first: two would copy every trade twice.');
    if (healthState().changed) {
      // Vest shipped an update the site check hasn't passed (it runs by itself)
      logEvent(
        'warn',
        siteGate() === 'failed'
          ? 'Not started — Vest changed something the copier relies on. Copying is off until a copier update.'
          : 'Not started — Vest updated its site and the check is still running.',
      );
      return render();
    }
    const epoch = ++_armEpoch;
    const master = S.master,
      followers = [...S.followers];
    const unchanged = () =>
      S.master === master && S.followers.size === followers.length && followers.every((f) => S.followers.has(f));
    S.arming = true;
    try {
      render();
      logEvent('info', 'Checking open positions…');
      const plan = await planArm(master, followers);
      if (plan.error) {
        logEvent('warn', 'Not started — ' + plan.error + '.');
        diag('arm', { outcome: 'blocked', reason: plan.error });
        return;
      }
      logEvent('info', 'Syncing follower leverage to the master…');
      const levSync = await syncLeverage(master, followers, plan.openSymbols);
      if (S.capFit) {
        logEvent('info', 'Refreshing equity for cap-to-fit…');
        await refreshBalances();
      }
      if (epoch !== _armEpoch) {
        logEvent('warn', 'Not started — stopped or flattened while starting.');
        return;
      }
      if (!unchanged()) {
        logEvent('warn', 'Not started — the accounts changed while starting. Press Start copying again.');
        return;
      }

      S.posMap = plan.adopted; // {} when flat; adopted trades otherwise
      S.armed = true;
      noteArmed(true);
      dropClaimReview();
      const trades = Object.values(plan.adopted);
      logEvent(
        'ok',
        `Started copying ${accLabel(master)} to ${followers.map(accLabel).join(', ')}${S.capFit ? ' (cap-to-fit)' : ''}.`,
      );
      for (const t of trades) {
        const inIt = Object.keys(t.followers).map(accLabel);
        const whoText = inIt.length ? ' + ' + inIt.join(', ') : ' (no followers in it)';
        logEvent(
          'ok',
          `Adopted open trade: ${t.side} ${t.qty} ${t.symbol} — master ${accLabel(master)}${whoText}. Exits and stop/target changes will copy.`,
        );
      }
      plan.notes.forEach((n) => logEvent('info', n));
      const acct = (id) => ({ id, label: accLabel(id), equity: (S.byId[id] || {}).equity });
      const adopted = trades.map((t) => ({
        symbol: t.symbol,
        side: t.side,
        masterQty: t.qty,
        legs: t.legs,
        followers: Object.entries(t.followers).map(([f, v]) => ({
          label: accLabel(f),
          qty: v.qty,
          positionId: v.positionId,
          legs: v.legs,
        })),
      }));
      Object.assign(S.net, { samples: [], missSince: null }); // a fresh 5 minutes for this run
      warmTick(); // a first round trip to Vest, and the copier's connection open, from the moment copying starts
      diag('arm', {
        outcome: 'armed',
        capFit: S.capFit,
        fast: S.fast,
        autoFlatten: S.autoFlatten,
        master: acct(master),
        followers: followers.map((f) => ({ ...acct(f), group: (S.byId[f] || {}).groupKey })),
        adopted,
        notes: plan.notes,
        leverageSync: levSync,
      });
    } finally {
      S.arming = false;
      render();
    }
  }
  function disarm() {
    _armEpoch++;
    const open = (S.orphan && S.orphan.list.length) || 0;
    S.armed = false;
    S.posMap = {};
    S.orphan = null;
    noteArmed(false);
    logEvent('info', 'Stopped copying.');
    if (open)
      logEvent(
        'warn',
        `${open} follower position${open > 1 ? 's' : ''} without the master ${open > 1 ? 'are' : 'is'} still open — close ${open > 1 ? 'them' : 'it'} on Vest or with Flatten All.`,
      );
    diag('disarm', {});
    render();
  }

  // ───────────────────────── selection ─────────────────────────
  const LOCKED_MSG = 'Stop copying first to change the master, followers or Cap-to-fit.';
  function setMaster(id) {
    if (S.arming) return toast('Wait for copying to start.');
    if (S.armed) return toast(LOCKED_MSG);
    if (S.stopEntries.length) cancelStopEntries('the master account changed.');
    S.master = S.master === id ? null : id;
    S.followers.delete(id);
    // the same-size rule applies only in strict 1:1; with cap-to-fit, followers may be any size (scaled by equity)
    if (S.master && !S.capFit) {
      const g = S.byId[S.master].groupKey;
      [...S.followers].forEach((f) => {
        if (S.byId[f].groupKey !== g) S.followers.delete(f);
      });
    }
    S.armed = false;
    render();
  }
  function toggleFollower(id) {
    if (S.arming) return toast('Wait for copying to start.');
    if (S.armed) return toast(LOCKED_MSG);
    if (!S.master || !S.byId[S.master] || !S.byId[id]) return toast('Pick a master first.');
    if (!S.capFit && S.byId[id].groupKey !== S.byId[S.master].groupKey) {
      return toast('A different-size follower needs Cap-to-fit (Settings). Strict 1:1 needs the same size and type.');
    }
    if (S.followers.has(id)) S.followers.delete(id);
    else S.followers.add(id);
    S.armed = false;
    render();
  }

  // ───────────────────────── settings and activity log ─────────────────────────
  // Everything is kept in this site's localStorage, wrapped in try/catch: a private window or full storage just means
  // nothing is remembered.
  const LOG_KEY = 'vc-activity-log',
    ACK_KEY = 'vc-ack',
    SIZE_KEY = 'vc-size',
    OPTS_KEY = 'vc-opts',
    TRADE_KEY = 'vc-trade';
  const store = {
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
  // Several Vest tabs share this browser's storage, each with its own log. What other tabs saved is kept (their lines,
  // newest first, up to LOG_MAX together), so a Download from any tab has every tab's activity (seen 2026-10-15: a
  // user's two tabs overwrote each other and the copying tab's lines were lost). This tab shows only its own lines.
  const storedLog = () => {
    const mine = S.log.map((e) => ({ t: e.t.toISOString(), level: e.level, msg: e.msg, tab: e.tab || TAB_TAG })),
      keyOf = (e) => e.t + '|' + e.msg,
      have = new Set(mine.map(keyOf)),
      l = store.get(LOG_KEY, []);
    const others = Array.isArray(l)
      ? l.filter(
          (e) => e && typeof e.msg === 'string' && typeof e.t === 'string' && e.tab !== TAB_TAG && !have.has(keyOf(e)),
        )
      : [];
    return [...mine, ...others].sort((a, b) => (a.t < b.t ? 1 : a.t > b.t ? -1 : 0)).slice(0, LOG_MAX);
  };
  function persistLog() {
    clearTimeout(_logTimer);
    _logTimer = null;
    store.set(LOG_KEY, storedLog());
  }
  // Saving the log rewrites all 500 lines; a copy logs a line per follower, and the first ones are written while the
  // master's own order is being sent. So it's saved a moment later, once, and at once when the page goes away.
  let _logTimer = null;
  const persistLogSoon = () => {
    if (!_logTimer) _logTimer = setTimeout(persistLog, 300);
  };
  window.addEventListener('pagehide', () => _logTimer && persistLog());
  function loadLog() {
    const l = store.get(LOG_KEY, []);
    const before = S.log; // lines from before the page finished loading stay
    S.log = Array.isArray(l)
      ? l
          .filter((e) => e && typeof e.msg === 'string' && !isNaN(new Date(e.t)))
          .map((e) => ({ t: new Date(e.t), level: String(e.level || 'info'), msg: e.msg, tab: e.tab || null }))
      : [];
    if (before.length) S.log = [...before, ...S.log].slice(0, LOG_MAX);
  }
  // The risk acknowledgement is versioned: raising TERMS_VERSION asks everyone to accept the new terms once.
  const TERMS_VERSION = 4; // 3 (v0.39): the support code is part of the terms; 4 (v0.41.3): the code is a separate yes/no
  function loadAck() {
    const a = store.get(ACK_KEY, null);
    S.ack = !!(a && typeof a === 'object' && a.v >= TERMS_VERSION);
  }
  function saveAck() {
    store.set(ACK_KEY, { v: TERMS_VERSION, at: new Date().toISOString() });
  }
  // Text size: the whole panel scales (CSS zoom), so the layout stays the same, only bigger.
  const TEXT_ZOOM = { regular: 1, large: 1.15, larger: 1.3 };
  const zoomOf = () => TEXT_ZOOM[S.textSize] || 1;
  function loadOpts() {
    const o = store.get(OPTS_KEY, {}) || {};
    S.fast = o.fast !== false; // on by default (v0.39); a saved choice stays as it is
    S.autoFlatten = !!o.autoFlatten;
    S.capFit = o.capFit !== false; // on by default (v0.39); a saved choice stays as it is
    S.checkUpdates = o.checkUpdates !== false; // on by default
    S.hideMarks = o.hideMarks !== false; // on by default: Vest's buy/sell marks come back on every load otherwise
    S.tradeOnly = o.tradeOnly !== false; // the panel shows on Vest's Trade page only (it runs on every page)
    S.hideSessions = o.hideSessions !== false; // Vest's pre-market / after-hours / overnight bands on the chart
    S.theme = o.theme !== false; // STRATUH colours for Vest's own page and chart (on by default; introduced once)
    S.themeDown = o.themeDown === 'red' ? 'red' : 'mono'; // shorts and losses on Vest's page: grey (STRATUH's look) or red
    S.textSize = TEXT_ZOOM[o.textSize] ? o.textSize : 'regular'; // the panel's size: regular, large, larger
    S.chartBracket = o.chartBracket !== false; // the Trade tab draws the bracket on Vest's chart (on by default)
  }
  function saveOpts() {
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
      textSize: S.textSize,
      chartBracket: S.chartBracket,
    };
    diag('settings', o);
    store.set(OPTS_KEY, o);
  }
  function loadTrade() {
    const t = store.get(TRADE_KEY, null);
    if (!t || typeof t !== 'object') return;
    // only well-formed values come back (storage can hold anything); "anchor" (removed in v0.31.0) is dropped this way too
    Object.assign(S.trade, cleanMarket(t), {
      symbol: SYMBOLS[t.symbol] ? t.symbol : S.trade.symbol, // another market comes back via followVestMarket
      ...(['off', 'tp1', 'points'].includes(t.beMode) ? { beMode: t.beMode } : {}),
      ...(['market', 'limit', 'stop'].includes(t.orderType) ? { orderType: t.orderType } : {}),
      ...(t.slipPts === '' || (typeof t.slipPts === 'number' && t.slipPts >= 0) ? { slipPts: t.slipPts } : {}),
    });
  }
  function saveTrade() {
    store.set(TRADE_KEY, S.trade);
  }
  function toggleFast() {
    S.fast = !S.fast;
    saveOpts();
    logEvent(
      'info',
      S.fast ? 'Fast mode on — followers copy each order the instant the master sends it.' : 'Fast mode off.',
    );
    render();
  }
  function toggleAutoFlatten() {
    S.autoFlatten = !S.autoFlatten;
    saveOpts();
    logEvent('info', S.autoFlatten ? 'Auto-flatten on.' : 'Auto-flatten off (you will be asked).');
    render();
  }
  function toggleCapFit() {
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
  function logEvent(level, msg) {
    S.log.unshift({ t: new Date(), level, msg, tab: TAB_TAG });
    S.log = S.log.slice(0, LOG_MAX);
    LOG(msg);
    persistLogSoon();
    renderLog();
  }
  function clearLog() {
    S.log = [];
    store.set(LOG_KEY, []); // every tab's lines: Clear means clear
    renderLog();
  }
  const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  function saveFile(name, mime, text) {
    const url = URL.createObjectURL(new Blob([text], { type: mime }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  let _toast = '';
  function toast(m) {
    _toast = m;
    renderLog();
    setTimeout(() => {
      if (_toast === m) {
        _toast = '';
        renderLog();
      }
    }, 3500);
  }

  // ───────────────────────── diagnostics ─────────────────────────
  // A structured record of every event, kept out of the activity log: intended vs. actual size, the cap-to-fit math,
  // fill prices and slippage, margin used, HTTP error codes, and whether the expected outcome happened. It holds account
  // ids, labels and equity, but no tokens. Exported as JSON from the Diag button for troubleshooting.
  const DIAG_KEY = 'vc-diag';
  let _diagTimer = null;
  const errCode = (e) => {
    const m = String((e && e.message) || e).match(/->\s*(\d{3})/);
    return m ? +m[1] : null;
  };
  function loadDiag() {
    const d = store.get(DIAG_KEY, []);
    S.diag = [...(Array.isArray(d) ? d : []), ...S.diag]; // records from before the page finished loading stay
  }
  // Kept under a size budget: this page's storage is shared with Vest's own site, which must never run out of room.
  // Every Vest tab saves here: records other tabs saved and this one doesn't have are kept, in time order, so a
  // Download from any tab has every tab's records (each says which tab wrote it: `tab`).
  const diagKey = (r) => (r.tab && r.n ? r.tab + '.' + r.n : `${r.t}|${r.type}|${r.account || ''}|${r.orderId || ''}`);
  function persistDiag() {
    const stored = store.get(DIAG_KEY, []);
    if (Array.isArray(stored) && stored.length) {
      const have = new Set(S.diag.map(diagKey));
      const more = stored.filter((r) => r && typeof r === 'object' && typeof r.t === 'string' && !have.has(diagKey(r)));
      if (more.length) {
        S.diag = [...S.diag, ...more].sort((a, b) => (a.t < b.t ? -1 : a.t > b.t ? 1 : 0));
        if (S.diag.length > DIAG_MAX) S.diag.splice(0, S.diag.length - DIAG_MAX);
      }
    }
    let json = JSON.stringify(S.diag);
    while (json.length > DIAG_MAX_BYTES && S.diag.length > 10) {
      S.diag.splice(0, Math.ceil(S.diag.length / 10));
      json = JSON.stringify(S.diag);
    }
    try {
      localStorage.setItem(DIAG_KEY, json);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  function persistDiagSoon() {
    if (_diagTimer) return;
    _diagTimer = setTimeout(() => {
      _diagTimer = null;
      persistDiag();
    }, 1200);
  }
  let _diagN = 0;
  function diag(type, data) {
    const rec = { t: new Date().toISOString(), type, ...data, tab: TAB_TAG, n: ++_diagN };
    S.diag.push(rec);
    if (S.diag.length > DIAG_MAX) S.diag.splice(0, S.diag.length - DIAG_MAX);
    persistDiagSoon();
    return rec;
  }
  // The log's Download (and the site check's): one file with the diagnostics and the activity log together (two
  // downloads from one click get the second blocked by Chrome unless the site is allowed several).
  function downloadDiag() {
    logEvent('info', `Diagnostics exported (${S.diag.length} records, with the activity log).`); // the file's last line
    const payload = diagFile();
    saveFile(`vest-copier-diagnostics-${stamp()}.json`, 'application/json', JSON.stringify(payload, null, 2));
  }
  function diagFile() {
    persistDiag(); // takes in what other tabs saved
    // account ids leave as their names ("Account 64"), plus a one-way tag per account (`accountTags`) so files from one
    // person can still be told apart from another's (tools/diag-stats.py) without the ids
    const { scrub, alias } = accountScrubber();
    const payload = scrub({
      exportedAt: new Date().toISOString(),
      version: VERSION,
      build: fingerprint() || null,
      tab: TAB_TAG, // the tab it was downloaded from (each record and log line says which tab wrote it)
      copying: S.armed, // whether that tab was copying
      records: S.diag.length,
      diagnostics: S.diag,
      log: storedLog().reverse(), // every tab's lines, oldest first
    });
    payload.accountTags = Object.fromEntries(
      Object.entries(alias).map(([id, name]) => [name, fnv('vc-account|' + id)]),
    );
    return payload;
  }

  // ───────────────────────── health ─────────────────────────
  // A short id for the Vest web app build that is loaded. When it changes, Vest has shipped an update and arming waits
  // for a site check. An unidentifiable build also needs one check per session.
  const fnv = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  };
  const fingerprint = () => {
    try {
      const b = window.__NEXT_DATA__ && window.__NEXT_DATA__.buildId;
      if (b) return b.slice(0, 10);
    } catch {
      /* best effort: nothing to do if this fails */
    }
    try {
      for (const s of document.scripts) {
        const m = (s.src || '').match(/\/index-([A-Za-z0-9_-]{6,})\.js(?:$|\?)/);
        if (m) return m[1];
      }
    } catch {
      /* best effort: nothing to do if this fails */
    }
    try {
      for (const s of document.scripts) {
        const d = (s.src || '').match(/[?&]dpl=(?:dpl_)?([A-Za-z0-9]{6,})/);
        if (d) return d[1].slice(0, 12);
      }
    } catch {
      /* best effort: nothing to do if this fails */
    }
    try {
      const sameHost = (s) => {
        try {
          const u = new URL(s);
          return u.host === location.host && /\/(index|runtime|main|app|framework|vendor)[-.]/.test(u.pathname);
        } catch {
          return false;
        }
      };
      const a = [...document.scripts]
        .map((s) => s.src)
        .filter(Boolean)
        .filter(sameHost)
        .map((s) => new URL(s).pathname)
        .sort();
      if (a.length) return 'b:' + fnv(a.join('|'));
    } catch {
      /* best effort: nothing to do if this fails */
    }
    return null;
  };
  const BUILD_KEY = 'vc-known-build-v3';
  let _unknownBuildChecked = false;
  // The build the site check accepted in this page, kept in memory too: with the browser's storage full the save fails,
  // and the panel must still know the check passed (a user's report: 412 crashes in 40 minutes, 2026-10-12).
  let _acceptedBuild = null;
  // First run on this browser: trust the build that is loaded now.
  function initBuild() {
    const fp = fingerprint();
    try {
      if (fp && !localStorage.getItem(BUILD_KEY)) localStorage.setItem(BUILD_KEY, fp);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  const healthState = () => {
    const fp = fingerprint();
    let last = null;
    try {
      last = localStorage.getItem(BUILD_KEY);
    } catch {
      /* best effort: nothing to do if this fails */
    }
    if (!fp)
      return _unknownBuildChecked
        ? { level: 'amber', text: 'build unknown (checked)', changed: false }
        : { level: 'amber', text: 'Unknown Vest build — checking…', changed: true };
    if (last && last !== fp && _acceptedBuild !== fp)
      return { level: 'amber', text: 'Vest updated — checking…', changed: true };
    return { level: 'green', text: fp, changed: false };
  };

  // ───────────────────────── updates ─────────────────────────
  // On every load (and on Check now), compare this script's version with the one published on GitHub. The page allows
  // the request and GitHub serves it cross-origin; nothing else is sent. A bar under the status line shows the result:
  // "Checking…", then "Update available" with Install (opening the .user.js link makes Tampermonkey show its own update
  // page, where one click installs it — a script can't replace itself), or "Up to date", which fades after a moment.
  const REPO_URL = 'https://github.com/xAmped/Vest-Copier';
  const DISCORD_URL = 'https://discord.gg/Aa69y9KnM3';
  const SCRIPT_URL = 'https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js';
  // GitHub's raw file server caches `main` for up to 5 minutes after a push. The API names the newest commit (cached
  // about a minute), and a file fetched by commit id is never stale, so check (and install) from that commit.
  // New versions are published as GitHub releases with the script attached. The panel reads the latest release and
  // installs that release's file, which GitHub counts as a download (the only usage number there is: the copier itself
  // reports nothing). If the API is unavailable (60 requests an hour per IP), it falls back to the raw file on `main`.
  const LATEST_RELEASE_API = 'https://api.github.com/repos/xAmped/Vest-Copier/releases/latest';
  const releaseAsset = (tag) => `https://github.com/xAmped/Vest-Copier/releases/download/${tag}/vest-copier.user.js`;
  const UPDATE_KEY = 'vc-update'; // remembers only which version "Later" was clicked for
  const UPDATE_NOTE_MS = 4000; // how long "Up to date" / "Couldn't check" stays up
  // Numeric compare of dotted versions: 1 if a > b, -1 if a < b, 0 if equal.
  const cmpVersion = (a, b) => {
    const pa = String(a).split('.').map(Number),
      pb = String(b).split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const d = (pa[i] || 0) - (pb[i] || 0);
      if (d) return d > 0 ? 1 : -1;
    }
    return 0;
  };
  // S.update = { state: 'checking' | 'available' | 'current' | 'error' | null, latest, dismissed }
  function loadUpdate() {
    const u = store.get(UPDATE_KEY, {}) || {};
    S.update = { state: null, latest: null, installUrl: null, dismissed: u.dismissed || null };
  }
  const updateAvailable = () => !!(S.update && S.update.latest && cmpVersion(S.update.latest, VERSION) > 0);
  let _updateNoteTimer = null;
  async function checkForUpdate(manual = false) {
    if (!S.checkUpdates && !manual) return;
    clearTimeout(_updateNoteTimer);
    S.update.manual = manual; // "Checking…" and "Up to date" show only for Check now
    S.update.state = 'checking';
    renderUpdate();
    try {
      let latest = null;
      try {
        const rel = await _fetch(LATEST_RELEASE_API, { cache: 'no-store' });
        const j = rel.ok ? await rel.json() : null;
        const asset = j && (j.assets || []).find((a) => a.name === 'vest-copier.user.js');
        if (j && /^v?\d+(\.\d+)*$/.test(j.tag_name || '') && asset) {
          latest = j.tag_name.replace(/^v/, '');
          S.update.installUrl = asset.browser_download_url || releaseAsset(j.tag_name);
        }
      } catch {
        /* best effort: nothing to do if this fails */
      } // API unavailable or rate-limited: fall back to the raw file
      if (!latest) {
        const r = await _fetch(SCRIPT_URL, { cache: 'no-store' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const m = (await r.text()).match(/^\/\/ @version\s+(\S+)/m);
        if (!m) throw new Error('no version in the published script');
        latest = m[1];
        S.update.installUrl = SCRIPT_URL;
      }
      S.update.latest = latest;
      diag('update_check', { outcome: 'ok', latest, from: S.update.installUrl === SCRIPT_URL ? 'raw' : 'release' });
      S.update.state = updateAvailable() ? 'available' : 'current';
      if (manual && S.update.state === 'available') S.update.dismissed = null; // Check now always shows it
    } catch (e) {
      S.update.state = 'error';
      diag('update_check', { outcome: 'error', error: e.message });
    }
    if (S.update.state !== 'available') {
      _updateNoteTimer = setTimeout(() => {
        S.update.state = null;
        renderUpdate();
      }, UPDATE_NOTE_MS);
    }
    render();
  }
  // ── The owner's switch: status.json in the public repo. `trading: false` pauses every copy; `minVersion` pauses the
  // versions older than it. Paused: no new trades (Start copying, Trade-tab orders, stop orders, copied opens and adds);
  // trades already open keep copying their exits, stops and targets, and Flatten all works. Read on load and every
  // few minutes; a missing file clears the pause, and a failed read keeps the last answer (GitHub down never stops
  // anyone who wasn't paused).
  const STATUS_URL = 'https://raw.githubusercontent.com/xAmped/Vest-Copier/main/status.json';
  const STATUS_EVERY_MS = 5 * 60 * 1000;
  S.paused = null; // why new trades are paused, or null
  let _pauseForVersion = false;
  function statusPause(j) {
    if (!j || typeof j !== 'object') return null;
    const note = typeof j.message === 'string' ? j.message.trim().slice(0, 240) : '';
    if (j.trading === false) return note || 'The copier is paused for maintenance. Check back shortly.';
    const min = typeof j.minVersion === 'string' ? j.minVersion.trim().replace(/^v/, '') : '';
    if (/^\d+(\.\d+)*$/.test(min) && cmpVersion(VERSION, min) < 0)
      return `This version (v${VERSION}) is out of date: install v${min} or newer.${note ? ' ' + note : ''}`;
    return null;
  }
  async function checkStatus() {
    let next = S.paused;
    try {
      const r = await _fetch(STATUS_URL + '?t=' + Date.now(), { cache: 'no-store' });
      if (r.status === 404) {
        next = null;
        setNotice(null);
      } else if (r.ok) {
        const j = await r.json();
        next = statusPause(j);
        _pauseForVersion = !!next && j.trading !== false; // a version lock: the banner offers Install
        setNotice(noticeOf(j));
      }
    } catch {
      /* best effort: keep the last answer */
    }
    if (next === S.paused) return;
    S.paused = next;
    diag('status', { paused: !!next, message: next });
    if (next) {
      logEvent('warn', `Paused: ${next} New trades aren't placed or copied; open trades keep copying their exits.`);
      cancelStopEntries('the copier is paused.');
    } else logEvent('ok', 'Pause lifted: new trades are copied again.');
    render();
  }
  // The owner's notice (status.json `notice`: { id, text, level: 'info' | 'warn', until? }): a banner shown until
  // dismissed; the dismissed id is remembered, so a new id shows again. Text only, escaped.
  const NOTICE_KEY = 'vc-notice';
  S.notice = null;
  function noticeOf(j) {
    const n = j && j.notice;
    if (!n || typeof n !== 'object' || typeof n.id !== 'string' || typeof n.text !== 'string') return null;
    const text = n.text.trim().slice(0, 280);
    if (!n.id.trim() || !text) return null;
    if (n.until && Date.parse(n.until) < Date.now()) return null;
    return { id: n.id.trim().slice(0, 80), text, level: n.level === 'warn' ? 'warn' : 'info' };
  }
  function setNotice(n) {
    const was = S.notice;
    S.notice = n && (store.get(NOTICE_KEY, {}) || {}).dismissed !== n.id ? n : null;
    if (S.notice && (!was || was.id !== S.notice.id || was.text !== S.notice.text)) {
      logEvent(S.notice.level === 'warn' ? 'warn' : 'info', `Notice: ${S.notice.text}`);
      diag('notice', { id: S.notice.id });
    }
    if (was !== S.notice) renderNotice();
  }
  function dismissNotice() {
    if (!S.notice) return;
    store.set(NOTICE_KEY, { dismissed: S.notice.id });
    S.notice = null;
    renderNotice();
  }
  function renderNotice() {
    const bar = _root && _root.querySelector('.noticebar');
    if (!bar) return;
    const n = S.notice;
    const html = n
      ? `<span class="ntext">${esc(n.text)}</span><button class="nx" data-act="notice-x" aria-label="Dismiss this notice" title="Dismiss">×</button>`
      : '';
    bar.hidden = !html;
    bar.classList.toggle('warn', !!n && n.level === 'warn');
    if (bar.dataset.html === html) return;
    bar.dataset.html = html;
    bar.innerHTML = html;
    const x = bar.querySelector('[data-act="notice-x"]');
    if (x) x.onclick = dismissNotice;
  }
  function startStatusChecks() {
    checkStatus();
    setInterval(checkStatus, STATUS_EVERY_MS);
  }
  const pauseBlocks = () => (S.paused ? `Paused: ${S.paused}` : null);
  if (window.__VC_TEST__) window.__vcStatus = checkStatus;
  if (window.__VC_TEST__) window.__vcWarm = warmTick; // the 20 s read, on demand
  if (window.__VC_TEST__) window.__vcDiagFile = () => diagFile(); // what Download saves
  function renderPause() {
    const bar = _root && _root.querySelector('.pausebar');
    if (!bar) return;
    const html = S.paused
      ? `<b>Paused.</b> ${esc(S.paused)} Open trades still copy their exits, and Flatten all works.${
          _pauseForVersion && updateAvailable()
            ? ` <a class="pbtn" href="${esc(S.update.installUrl || SCRIPT_URL)}" target="_blank" rel="noopener">Install v${esc(S.update.latest)}</a>`
            : ''
        }`
      : '';
    bar.hidden = !html;
    if (bar.dataset.html === html) return;
    bar.dataset.html = html;
    bar.innerHTML = html;
  }
  function dismissUpdate() {
    S.update.dismissed = S.update.latest;
    store.set(UPDATE_KEY, { dismissed: S.update.dismissed });
    renderUpdate();
  }
  function renderUpdate() {
    const bar = _root && _root.querySelector('.update');
    if (!bar || !S.update) return;
    const { state, latest, dismissed, manual } = S.update;
    let html = '';
    if (state === 'checking' && manual) html = '<span class="utext">Checking for updates…</span>';
    else if (state === 'current' && manual) html = `<span class="utext">Up to date · v${VERSION}</span>`;
    else if (state === 'error' && manual)
      html = '<span class="utext">Couldn\'t check for updates. Try Check now again later.</span>';
    else if (state === 'installing')
      html = S.armed
        ? `<span class="utext">After updating in Tampermonkey, reload Vest to run v${esc(latest)}. Reloading stops copying;
            start again afterwards (an open trade is adopted).</span>
          <button class="ubtn" data-act="update-reload">Reload now</button>`
        : '<span class="utext">Click <b>Update</b> in Tampermonkey, then come back: Vest reloads by itself.</span>';
    else if (state === 'available' && dismissed !== latest) {
      html = `<span class="utext"><b>v${esc(latest)}</b> ready${S.armed ? ' · install when flat' : ` · you have v${VERSION}`}</span>
      <a class="ubtn" href="${esc(S.update.installUrl || SCRIPT_URL)}" target="_blank" rel="noopener" title="Opens Tampermonkey's update page; then reload Vest">Install</a>
      <a class="ubtn ghost" href="${REPO_URL}/blob/main/CHANGELOG.md" target="_blank" rel="noopener">What's new</a>
      <button class="ubtn ghost" data-act="update-later" aria-label="Hide until the next version">Later</button>`;
    }
    bar.hidden = !html;
    bar.classList.toggle('muted', state !== 'available' && state !== 'installing');
    if (bar.dataset.html === html) return;
    bar.dataset.html = html;
    bar.innerHTML = html;
    const later = bar.querySelector('[data-act="update-later"]');
    if (later) later.onclick = dismissUpdate;
    const install = bar.querySelector('a.ubtn');
    if (install && state === 'available') install.onclick = startInstall;
    const reload = bar.querySelector('[data-act="update-reload"]');
    if (reload) reload.onclick = reloadWhenIdle;
  }
  // Reload for an update only once nothing is in flight (an order, a stop move, a claim, Flatten All, arming).
  const busyNow = () =>
    !!(S.placing || S.adjusting || S.exiting || S.flattening || S.arming || claimBusy()) ||
    Object.values(S.plans).some((p) => p.busy) ||
    S.stopEntries.length > 0; // a reload would cancel them
  function reloadWhenIdle() {
    if (busyNow()) return setTimeout(reloadWhenIdle, 500);
    location.reload();
  }
  // Tampermonkey doesn't tell the page when it updates a script, so: after Install, reload Vest when the user comes back
  // to this tab (Tampermonkey's page opens in another tab). Armed, it asks instead, since reloading disarms.
  let _leftForInstall = false;
  function startInstall() {
    S.update.state = 'installing';
    _leftForInstall = false;
    renderUpdate();
  }
  document.addEventListener('visibilitychange', () => {
    if (!S.update || S.update.state !== 'installing') return;
    if (document.hidden) {
      _leftForInstall = true;
      return;
    }
    if (!_leftForInstall) return;
    if (S.armed)
      renderUpdate(); // shows Reload now
    else reloadWhenIdle();
  });

  // ───────────────────────── support (the author's code) ─────────────────────────
  // The copier is free, and the author's code AMPED pays for its upkeep. The trader chooses, in the panel: a plain
  // yes/no the first time and again after updates (Jay, 2026-11-02; Vest's terms §6B ask for care with referral credit).
  // The copier works the same either way, and an unanswered question changes nothing.
  // - Yes: AMPED goes into Vest's code box when it appears, in place of another code if it saves at least as much. They
  //   confirm once at the next checkout, and after that a one-line note fades by itself, so no swap is ever silent. A
  //   code the trader typed or picked stays. Yes also tries Vest's referral-join call (Vest refuses an account that
  //   already has an affiliate, so it takes no one's credit).
  // - No: the box is left alone and nothing is linked.
  // Nothing here holds a purchase up: the copier only ever acts on the box, and any doubt leaves it as it was.
  const SUPPORT_CODE = 'AMPED';
  const SUPPORT_PCT = 5; // what the code gives, as the panel says it; checked against what Vest shows when it's applied
  const SUPPORT_DEBUG = false; // test builds: log each step of the code in the activity log
  const supportStep = (msg) => SUPPORT_DEBUG && logEvent('info', '[code test] ' + msg);
  const SUPPORT_KEY = 'vc-support'; // { choice: 'yes' | 'no', confirmed, askedFor: version, askedAt, at }; older saves: { answered, apply }
  // Before v0.41.3 accepting the terms turned the code on. That isn't a yes to this question: only `choice` counts.
  // The answer is kept in memory too: with storage full an answer still counts in this tab. Another tab's newer one wins.
  let _supportHere = null;
  const supportSaved = () => {
    const v = store.get(SUPPORT_KEY, null) || {};
    return _supportHere && (v.at || '') < _supportHere.at ? _supportHere : v;
  };
  function saveSupport(next) {
    _supportHere = next;
    store.set(SUPPORT_KEY, next);
  }
  const supportOn = () => supportSaved().choice === 'yes';
  function setSupportChoice(choice) {
    const v = supportSaved();
    const now = new Date().toISOString();
    saveSupport({ ...v, choice, confirmed: false, askedFor: VERSION, askedAt: now, at: now });
    diag('support', { outcome: 'choice', choice });
    if (choice === 'yes' && v.choice !== 'yes') joinReferral();
  }
  // The one confirmation at checkout, after a yes. Either button counts; ignoring it doesn't, so it shows again.
  const codeConfirmed = () => !!supportSaved().confirmed;
  function confirmCode() {
    saveSupport({ ...supportSaved(), confirmed: true, at: new Date().toISOString() });
  }
  // The question: never asked for, or a new version since the last answer, at most once a week (updates can come in
  // bursts). It takes the panel the way the terms do, so it waits for the terms, and while copying or in a position:
  // getting out never waits behind it.
  const CODE_ASK_GAP_MS = 7 * 24 * 3600 * 1000;
  // Not read yet counts as in a position: a tab reloaded mid-trade mustn't lose its controls to the question.
  const maybeInPosition = () => {
    const ids = Object.keys(S.byId || {});
    return !ids.length || ids.some((id) => !S.acctState[id] || S.acctState[id].positions.some((p) => p.qty > 0));
  };
  function codeAskDue() {
    if (!S.ack || S.armed || S.arming || maybeInPosition()) return false;
    const v = supportSaved();
    if (v.choice !== 'yes' && v.choice !== 'no') return true;
    return v.askedFor !== VERSION && Date.now() - (Date.parse(v.askedAt) || 0) >= CODE_ASK_GAP_MS;
  }
  function renderCodeAsk(body) {
    if (body.dataset.view === 'code-ask') return;
    body.dataset.view = 'code-ask';
    body.scrollTop = 0;
    body.innerHTML = `
      <div class="rules codeask">
        <div class="rules-h big">Use code ${SUPPORT_CODE}?</div>
        <ul class="rules-list">
          <li>${SUPPORT_CODE} gives you ${SUPPORT_PCT}% off Vest purchases and pays me a commission, which keeps the copier
            free. <b>The copier works the same either way.</b></li>
          <li><b>With Yes,</b> the copier puts ${SUPPORT_CODE} in Vest's code box at checkout, including in place of another
            code if ${SUPPORT_CODE} saves you at least as much. You'll confirm it at your next checkout and see a short
            note after that. You can type another code any time.</li>
          <li><b>If your Vest account has no code yet,</b> Yes also links it to ${SUPPORT_CODE} permanently.</li>
          <li><b>You can change this any time</b> in Settings → Support the copier, and you'll be asked again after updates.
            Turned off, or with the copier removed, Vest goes back to your account's own code the next time it loads, unless
            your account was linked to ${SUPPORT_CODE}.</li>
        </ul>
        <div class="rules-btns"><button class="armbtn" data-act="code-yes">Yes, use ${SUPPORT_CODE}</button>
          <button class="ghostbtn" data-act="code-no">No thanks</button></div>
      </div>`;
    const answer = (choice) => {
      setSupportChoice(choice);
      logEvent('info', choice === 'yes' ? `Code ${SUPPORT_CODE} on. Thank you!` : `Code ${SUPPORT_CODE} off.`);
      render();
    };
    body.querySelector('[data-act="code-yes"]').onclick = () => answer('yes');
    body.querySelector('[data-act="code-no"]').onclick = () => answer('no');
  }
  // The account's attached referral code, '' when none, or null when it can't be read (then nothing is offered).
  async function attachedRefCode() {
    try {
      const r = await _fetch(location.origin + '/api/v2/referrals/rewards', {
        headers: { Accept: 'application/json', Authorization: 'Bearer ' + userToken },
      });
      if (!r.ok) return null;
      const d = await r.json();
      return (d && d.signup_ref_discount && d.signup_ref_discount.code) || '';
    } catch {
      return null;
    }
  }
  // An account already using AMPED hides the bottom bar's code link.
  async function supportOnTerms() {
    if (!S.ack || !userTokenOk()) return;
    const code = await attachedRefCode();
    if (code && code.toUpperCase() === SUPPORT_CODE) {
      const link = _root && _root.querySelector('[data-act="code"]');
      if (link) link.hidden = true;
    }
  }
  // Put the code on the clipboard (the click that triggered this counts as the user gesture browsers ask for).
  const copySupportCode = () =>
    navigator.clipboard.writeText(SUPPORT_CODE).then(
      () => true,
      () => false,
    );
  // Vest's referral link, which only an account with no affiliate accepts, and which can't be undone. Only on a yes.
  async function joinReferral() {
    // Test builds carry someone else's code: never send it from one.
    if (SUPPORT_DEBUG) return supportStep('referral link: skipped in a test build');
    try {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      };
      const r = await _fetch(API + '/v2/referrals/join', {
        method: 'POST',
        headers,
        body: JSON.stringify({ refCode: SUPPORT_CODE }),
      });
      const reply = (await r.text()).slice(0, 300);
      diag('support', { outcome: r.ok ? 'joined' : 'join-refused', status: r.status, reply });
      supportStep(`referral link: HTTP ${r.status} ${reply}`);
    } catch (e) {
      diag('support', { outcome: 'join-error', error: e.message });
      supportStep(`referral link failed: ${e.message}`);
    }
  }

  // ── Vest's code boxes. Vest has more than one. The purchase window's is an editable field (styled to show its code in
  // capitals) holding the applied code: type another code + Enter, and on success Vest redraws the box with it. The
  // account-builder screen's shows "CODE 5%" read-only with a ✕ to clear it first. The box is also on the Get Funded
  // page, below the plans. Vest fills in the account's code on each page load and doesn't save a switch.
  const isDiscountBox = (el) =>
    el instanceof HTMLInputElement &&
    // purchase window ("pl-3! not-placeholder-shown:uppercase") or the account-builder side panel (the "!" variant).
    // Deliberately NOT the bare-class box inside Vest's "Do You Have a Discount Code?" form, which shares the placeholder
    // text: Enter there would submit that form. So boxes are matched by their styling, never by placeholder.
    ((/(^|\s)pl-3!(\s|$)/.test(el.className) && /not-placeholder-shown:uppercase(\s|$)/.test(el.className)) ||
      /not-placeholder-shown:uppercase!/.test(el.className) ||
      (el.getAttribute('role') === 'combobox' &&
        /\brounded-full\b/.test(el.className) &&
        /\bw-32\b/.test(el.className)));
  const boxesNow = () => [...document.querySelectorAll('input')].filter(isDiscountBox);
  const shown = (el) => el.isConnected && el.getClientRects().length > 0;
  const boxNow = () => boxesNow().find(shown) || null;
  const boxCode = (box) => (box.readOnly ? box.value.trim().split(/\s+/)[0] || '' : box.value.trim()).toUpperCase();
  // The discount Vest shows for the applied code: "CODE 5%" in a read-only box, otherwise the text beside the box
  // ("5% Discount", "5% Code Applied!"). null when none can be read.
  function boxPct(box) {
    const pctAt = (t) => /^(\d+(?:\.\d+)?)\s*%/.exec(t);
    if (box.readOnly) {
      const m = /(\d+(?:\.\d+)?)\s*%/.exec(box.value);
      if (m) return +m[1];
    }
    let at = box;
    for (let i = 0; i < 4 && at.parentElement; i++) {
      at = at.parentElement;
      for (const c of at.children) {
        if (c.contains(box)) continue;
        const t = c.textContent.trim();
        const m = t.length < 40 && pctAt(t);
        if (m) return +m[1];
      }
    }
    return null;
  }

  // `codeVisit`: what the trader did during this visit to a code box (it ends when no box is left). `_codesKept`: codes
  // they typed, picked or put back; they stay until the page reloads, because a window reopened is the same purchase.
  const codeVisit = { chose: false, first: null, busy: false, set: null, late: null };
  const _codesKept = new Set();
  const _seenBoxes = new WeakSet();
  const _debugSeen = new WeakSet();
  let _boxScan = null;
  function watchPurchaseWindow() {
    // Pressing or typing in a box, or picking from its list, makes it the trader's for this visit.
    const touched = (e) => {
      if (!e.target || !e.target.closest) return;
      if (codeVisit.busy && !e.isTrusted) return; // the copier's own typing; a person's counts even while it works
      const group = e.target.closest('[data-slot="input-group"]');
      if (
        isDiscountBox(e.target) ||
        (group && [...group.querySelectorAll('input')].some(isDiscountBox)) ||
        (e.target.closest('[role="option"], [role="listbox"]') && boxesNow().length)
      )
        codeVisit.chose = true;
    };
    for (const type of ['pointerdown', 'keydown', 'input']) document.addEventListener(type, touched, true);
    new MutationObserver(() => {
      if (_boxScan || !supportOn()) return;
      _boxScan = setTimeout(() => {
        // the page changes constantly (prices); look at most a few times a second
        _boxScan = null;
        let any = false;
        for (const el of document.querySelectorAll('input')) {
          if (SUPPORT_DEBUG && !_debugSeen.has(el) && el.closest('[role="dialog"]')) {
            _debugSeen.add(el); // test builds: report every input in a dialog, to see what the purchase window holds
            supportStep(
              `dialog input: placeholder="${el.placeholder}" role=${el.getAttribute('role')} value="${el.value}" match=${isDiscountBox(el)} pct=${isDiscountBox(el) ? boxPct(el) : '-'}`,
            );
          }
          if (!isDiscountBox(el)) continue;
          any = true;
          if (_seenBoxes.has(el)) continue;
          _seenBoxes.add(el);
          useCodeInBox(el).catch((e) => diag('support', { outcome: 'apply-error', error: e.message }));
        }
        if (!any && !codeVisit.busy) Object.assign(codeVisit, { chose: false, first: null, set: null, late: null });
      }, 250);
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  const CODE_SETTLE_MS = 800;
  const CODE_READ_MS = 200;
  // A box seen for the first time. Vest redraws a box when a code applies, so a redrawn box comes here too: a code the
  // trader typed or picked is recorded as theirs, and is never replaced.
  async function useCodeInBox(input) {
    await sleep(CODE_SETTLE_MS); // let the window finish opening and Vest fill in the account's code
    if (!shown(input) || codeVisit.busy) return;
    const was = boxCode(input);
    supportStep(`discount box found: current code "${was || '(none)'}"`);
    if (codeVisit.first === null) codeVisit.first = was;
    if (was === SUPPORT_CODE && codeVisit.late) {
      // Vest answered after the copier gave up on it: say so, with the way back
      const late = codeVisit.late;
      codeVisit.late = null;
      codeVisit.set = SUPPORT_CODE;
      logEvent('ok', `Purchase window: discount code set to ${SUPPORT_CODE} (was ${late}).`);
      diag('support', { outcome: 'applied-late', replaced: late });
      return showCodeNote(late);
    }
    if (was === SUPPORT_CODE || was === codeVisit.set) return;
    // changed since the box first showed, or since the copier put a code in, and not by the copier: typed, or picked
    // from a list (some of Vest's lists are plain buttons, so a press can't always be seen)
    if (codeVisit.chose || was !== codeVisit.first || codeVisit.set) {
      if (was) _codesKept.add(was);
      return;
    }
    if (!supportOn() || _codesKept.has(was)) return;
    const wasPct = boxPct(input);
    if (was && wasPct !== null && wasPct > SUPPORT_PCT) return; // theirs saves more: not even tried
    codeVisit.busy = true;
    try {
      if ((await putCode(input, SUPPORT_CODE)) !== 'applied') {
        if (codeVisit.chose) return; // they typed or picked while it ran: nothing to report
        if (was) codeVisit.late = was; // Vest can answer later than the copier waits
        logEvent('info', `Purchase window: Vest didn't accept ${SUPPORT_CODE} here${was ? `, so ${was} stays` : ''}.`);
        diag('support', { outcome: 'apply-refused', kept: was || null });
        return;
      }
      codeVisit.set = SUPPORT_CODE;
      if (!was) {
        logEvent('ok', `Purchase window: the empty code box now has ${SUPPORT_CODE}.`);
        diag('support', { outcome: 'applied', replaced: null });
        return showCodeNote(null);
      }
      await sleep(CODE_READ_MS); // Vest's text beside the box follows the redraw
      const now = boxNow();
      const nowPct = now ? boxPct(now) : null;
      if (codeVisit.chose) return; // they typed or picked while this ran: theirs, whatever it says
      if (wasPct === null || nowPct === null || nowPct < wasPct) {
        // less off, or no way to tell: theirs goes back
        const back = now ? await putCode(now, was) : 'refused';
        codeVisit.set = was;
        logEvent(
          back === 'applied' ? 'info' : 'warn',
          back === 'applied'
            ? `Purchase window: ${was} stays (${SUPPORT_CODE} wouldn't save you at least as much).`
            : `Purchase window: couldn't put ${was} back. Check the code before you pay.`,
        );
        diag('support', {
          outcome: nowPct === null || wasPct === null ? 'unsure' : 'worse',
          was,
          wasPct,
          nowPct,
          back,
        });
        if (back !== 'applied') showCodeNote(null, was, true);
        return;
      }
      logEvent('ok', `Purchase window: discount code set to ${SUPPORT_CODE} (was ${was}).`);
      diag('support', { outcome: 'applied', replaced: was, wasPct, nowPct });
      showCodeNote(was);
    } finally {
      codeVisit.busy = false;
    }
  }
  const waitFor = async (cond, ms) => {
    for (let t = 0; t < ms; t += 100) {
      if (cond()) return true;
      await sleep(100);
    }
    return cond();
  };
  // React-controlled input: set the value through the native setter so the page's own handlers see the change.
  function typeInto(input, text) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  const pressEnter = (input) =>
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true }),
    );
  // Put a code in Vest's box the way a person would. 'applied', or 'refused' with the box showing the code it had.
  function putCode(input, want) {
    return input.readOnly ? putCodeReadOnly(input, want) : putCodeEditable(input, want);
  }
  async function putCodeEditable(input, want) {
    const before = boxCode(input);
    // Applied = Vest redrew the box (the old field is gone) and the new one holds the code without an error flag.
    const applied = () =>
      !input.isConnected && boxesNow().some((el) => boxCode(el) === want && el.getAttribute('aria-invalid') !== 'true');
    const refused = () => input.isConnected && input.getAttribute('aria-invalid') === 'true';
    typeInto(input, want);
    supportStep(`typed ${want}: box now "${input.value}"`);
    pressEnter(input);
    let ok = await waitFor(() => applied() || refused(), 3000);
    if (!applied() && !refused() && input.isConnected && !codeVisit.chose) {
      // Enter didn't take: click the box's Use button instead
      const group = input.closest('[data-slot="input-group"]') || input.parentElement;
      const use = [...group.querySelectorAll('button')].find((b) => /^\s*use\s*$/i.test(b.textContent));
      supportStep(use ? 'Enter did nothing; clicking Use' : 'Enter did nothing and no Use button was found');
      if (use) use.click();
      ok = await waitFor(() => applied() || refused(), 5000);
    }
    if (applied()) return 'applied';
    // Refused (or no answer): Vest kept the previous code applied; show it in the box again.
    supportStep(
      `not applied: aria-invalid=${input.getAttribute('aria-invalid')} connected=${input.isConnected} answered=${ok}`,
    );
    if (input.isConnected && !codeVisit.chose) typeInto(input, before);
    return 'refused';
  }
  // The account-builder screen's box: "CODE 5%" read-only, with a ✕ to clear it before typing another code.
  async function putCodeReadOnly(input, want) {
    const applied = () => input.readOnly && !!boxCode(input);
    const before = applied() ? boxCode(input) : '';
    supportStep(`read-only discount box found: current code "${before || '(none)'}"`);
    const clearApplied = async () => {
      const x = (input.closest('[data-slot="input-group"]') || input.parentElement).querySelector('button');
      supportStep(x ? 'clicking ✕ to remove the applied code' : 'no ✕ button found next to the box');
      if (x) x.click();
      return waitFor(() => !input.readOnly, 1500);
    };
    const enter = async (c) => {
      typeInto(input, c);
      pressEnter(input);
      const ok = await waitFor(() => applied() && boxCode(input) === c, 5000);
      supportStep(`entered ${c}: ${ok ? 'applied' : 'not applied'}`);
      return ok;
    };
    if (before && !(await clearApplied())) {
      supportStep('stopped: the applied code could not be removed');
      return 'refused';
    }
    if (codeVisit.chose) return 'refused'; // they typed or picked meanwhile: theirs, so nothing more goes in
    if (await enter(want)) return 'applied';
    if (before && !codeVisit.chose) {
      if (input.readOnly) await clearApplied();
      if (!codeVisit.chose) await enter(before);
    }
    return 'refused';
  }

  // ── The note after the code goes in: a layer of its own, because Vest's purchase window covers the panel (and the
  // panel hides off the Trade page). Inside Vest's window when there is one: anything outside it would close it.
  const CODE_LAYER_CSS = `
    :host { all: initial; position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; display: block; }
    * { box-sizing: border-box; font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
    .note { position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%); width: min(380px, calc(100% - 24px));
      padding: 14px 16px; background: #141416; border: 1px solid rgba(255, 255, 255, 0.16); color: #f0f0f1; pointer-events: auto;
      font-size: 13px; line-height: 1.45; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5); }
    .btns { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    button { cursor: pointer; font-size: 13px; font-weight: 500; height: 32px; padding: 0 14px; white-space: nowrap;
      background: #18181b; border: 1px solid rgba(255, 255, 255, 0.16); color: #f0f0f1; }
    button:hover { background: #202024; }
    button.go { background: #c8f542; border-color: #c8f542; color: #0c0c0d; font-weight: 600; }
    button.go:hover { background: #d4f96a; }
    button:disabled { opacity: 0.55; cursor: default; }`;
  let _codeNoteT = null;
  const closeCodeNote = () => {
    clearTimeout(_codeNoteT);
    const host = document.getElementById('vc-code');
    if (host) host.remove();
  };
  // Says what went in: the confirmation with its buttons, or once confirmed a line that fades by itself. `was`: the code
  // it replaced. `stuck`: their code couldn't be put back.
  function showCodeNote(was, stuckCode = null, stuck = false) {
    closeCodeNote();
    const near = boxNow();
    const host = document.createElement('div');
    host.id = 'vc-code';
    // Events stop here, so Vest's window doesn't read a press in the note as a press outside it.
    for (const type of ['pointerdown', 'mousedown', 'mouseup', 'click', 'keydown', 'keyup', 'focusin', 'focusout'])
      host.addEventListener(type, (e) => e.stopPropagation());
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${CODE_LAYER_CSS}</style>`;
    ((near && near.closest('[role="dialog"]')) || document.body || document.documentElement).appendChild(host);
    const card = document.createElement('div');
    card.className = 'note';
    card.setAttribute('role', 'status');
    const short = !stuck && codeConfirmed();
    card.innerHTML = stuck
      ? `<b>Couldn't put ${esc(stuckCode)} back.</b> Check the code before you pay.<div class="btns"><button data-c="ok">OK</button></div>`
      : short
        ? `<b>Code ${SUPPORT_CODE} is on.</b> Type another code to change it.`
        : `<b>Code ${SUPPORT_CODE} is on: ${SUPPORT_PCT}% off.</b> ${was ? `It replaced ${esc(was)} and pays` : 'It pays'} me a commission, which keeps the
           copier free. You can type another code any time, or turn this off in Settings.
           <div class="btns"><button class="go" data-c="ok">${was ? `Keep ${SUPPORT_CODE}` : 'OK'}</button>
           ${was ? `<button data-c="back">Use ${esc(was)} this time</button>` : ''}</div>`;
    root.appendChild(card);
    const on = (c, f) => {
      const b = card.querySelector(`[data-c="${c}"]`);
      if (b) b.onclick = f;
    };
    on('ok', () => {
      if (!stuck) confirmCode();
      closeCodeNote();
    });
    on('back', async () => {
      card.querySelectorAll('button').forEach((b) => (b.disabled = true));
      confirmCode();
      _codesKept.add(was);
      const box = boxNow();
      codeVisit.busy = true;
      const r = box ? await putCode(box, was).finally(() => (codeVisit.busy = false)) : 'refused';
      if (!box) codeVisit.busy = false;
      codeVisit.set = was;
      logEvent(
        r === 'applied' ? 'info' : 'warn',
        r === 'applied'
          ? `Purchase window: ${was} is back, as you chose.`
          : `Purchase window: couldn't put ${was} back. Check the code before you pay.`,
      );
      diag('support', { outcome: 'put-back', was, result: r });
      if (r === 'applied') closeCodeNote();
      else showCodeNote(null, was, true);
    });
    if (!stuck) _codeNoteT = setTimeout(closeCodeNote, short ? CODE_NOTE_SHORT_MS : CODE_NOTE_MS);
  }
  const CODE_NOTE_MS = 30000;
  const CODE_NOTE_SHORT_MS = 6000;

  // ── The STRATUH theme, introduced once: what changed on Vest's page and chart, Keep or Back to Vest's colours, and
  // where to change it later. Shown once the terms (and the one-time support question) are out of the way, and only
  // with Vest in dark mode, where the theme applies.
  const THEME_INTRO_KEY = 'vc-theme-intro';
  function renderThemeIntro() {
    const bar = _root && _root.querySelector('.themeintro');
    if (!bar) return;
    const due =
      S.ack &&
      S.theme &&
      !codeAskDue() &&
      !store.get(THEME_INTRO_KEY, null) &&
      document.documentElement.classList.contains('dark');
    bar.hidden = !due;
    if (!due || bar.dataset.ready) return;
    bar.dataset.ready = '1';
    bar.innerHTML = `<span class="utext"><b>Vest is now in STRATUH colours.</b> Onyx and lime, grey shorts, losses and
        candles, square corners. The chart's buy/sell marks, session bands and the Volume indicator Vest adds are hidden
        too. Change any of it in Appearance (the ⋯ menu).</span>
      <button class="ubtn" data-act="theme-keep">Keep it</button>
      <button class="ubtn ghost" data-act="theme-revert">Back to Vest's colours</button>`;
    const answer = (keep) => {
      store.set(THEME_INTRO_KEY, { answered: keep ? 'keep' : 'revert', at: new Date().toISOString() });
      if (!keep) {
        S.theme = false;
        saveOpts();
        applyTheme();
        logEvent(
          'info',
          "STRATUH theme off: Vest's own colours are back (the chart after a refresh). Appearance turns it on.",
        );
      }
      bar.hidden = true;
      render();
    };
    bar.querySelector('[data-act="theme-keep"]').onclick = () => answer(true);
    bar.querySelector('[data-act="theme-revert"]').onclick = () => answer(false);
  }

  // ───────────────────────── site check (run after Vest ships an update) ─────────────────────────
  // When Vest's build changes, the copier checks by itself that everything it relies on still looks the way it expects
  // and accepts the build once every required check passes. Until then the panel shows only the check, and if a
  // required check fails, copying, Trade-tab orders, automatic breakeven and claims stay off until a copier update
  // (Flatten All still works). Read-only: it reads endpoints the copier uses and scans Vest's loaded code; nothing is
  // sent to an account. The extras (live feed, prices, chart, claims) only warn: without them the copier is slower or a
  // feature is off, never wrong.
  // Order endpoints and payload fields the copier sends, looked for in Vest's own code (Vest joins "stop-loss" and
  // "take-profit" into their path at runtime, so the bare words are looked for).
  const SCAN_TERMS = [
    '/v3/positions/open',
    '/v3/positions/append',
    '/v3/positions/reduce',
    '/v3/positions/close',
    '/v3/positions/cancel-order',
    'stop-loss',
    'take-profit',
    '/v3/auth/account-token',
    '/v3/positions/opened-orders',
    '/v3/executions',
    '/v3/user-state',
    'takeProfits',
    'stopLosses',
    'reduceOnly',
    'timeInForce',
    'triggerPrice',
    'positionId',
    'isBuy',
    'orderType',
    'quantity',
    'leverage',
  ];
  const FEED_TERMS = ['account_state', 'capital_account', 'final_balance', 'balance_version']; // Vest's private socket
  const CLAIM_TERMS = ['/v3/capital/withdraw'];
  // A whole term: "/v3/positions/open" must not be satisfied by "/v3/positions/opened".
  const hasTerm = (code, term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '(?![\\w-])').test(code);
  // [key, name, tier]: a failed 'must' keeps copying off; an 'extra' only warns.
  const SITE_CHECKS = [
    ['accounts', 'Accounts and balances', 'must'],
    ['token', 'Account access', 'must'],
    ['leverage', 'Leverage', 'must'],
    ['positions', 'Positions and orders', 'must'],
    ['fills', 'Fill history', 'must'],
    ['market', 'Market rules', 'must'],
    ['code', "Vest's order code", 'must'],
    ['feed', 'Live account feed', 'extra'],
    ['prices', 'Live prices', 'extra'],
    ['chart', 'Chart tools', 'extra'],
    ['claims', 'Profit claims', 'extra'],
  ];
  const SITE_WAIT_MS = 6000, // how long the extras wait for Vest's feed, a price and the chart
    SITE_RETRY_MS = 20000, // a failed check runs once more by itself (a passing hiccup rather than Vest)
    SITE_EMPTY_MS = 15000, // Vest listed no active account: asked again after this long
    SITE_SETTLE_MS = 8000, // after a page load, the session and accounts get this long before "waiting" shows
    ALL_CLEAR_MS = 2500, // the "All clear" screen, before the panel comes back
    SITE_PACE_MS = 450; // the rows tick off one at a time, this far apart, so the check can be followed
  // Test builds: localStorage 'vc-sim-site' = any of fail, warn, wait, slow (comma-separated) to see each screen.
  const SITE_SIM = false;
  const simSite = () => {
    if (!SITE_SIM) return new Set();
    try {
      return new Set(
        String(localStorage.getItem('vc-sim-site') || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      );
    } catch {
      return new Set();
    }
  };
  // The first truthy value of fn() (errors count as "not yet"), or null after ms.
  async function waitUntil(fn, ms) {
    const end = Date.now() + ms;
    for (;;) {
      let v = null;
      try {
        v = fn();
      } catch {
        /* not there yet */
      }
      if (v) return v;
      if (Date.now() > end) return null;
      await sleep(200);
    }
  }
  // Vest's own scripts (same host; never this copier), as one text to scan.
  async function readVestCode() {
    const urls = new Set();
    for (const s of document.scripts) if (s.src) urls.add(s.src);
    for (const e of performance.getEntriesByType('resource')) if (e.initiatorType === 'script') urls.add(e.name);
    const own = [...urls].filter((u) => {
      try {
        const x = new URL(u);
        return x.host === location.host && !/vest-copier/.test(x.pathname);
      } catch {
        return false;
      }
    });
    let code = '';
    for (const u of own.slice(0, 60)) {
      try {
        code += await (await _fetch(u)).text();
      } catch {
        /* best effort: nothing to do if this fails */
      }
    }
    return code;
  }

  let _siteRun = 0;
  async function runSiteCheck(retry = false) {
    const fp = fingerprint(),
      sim = simSite();
    if (!userTokenOk()) {
      S.site = { fp, phase: 'waiting', wait: 'session', results: [], at: Date.now() };
      return render();
    }
    const run = ++_siteRun;
    const site = (S.site = {
      fp,
      phase: 'checking',
      running: true,
      retried: retry,
      at: Date.now(),
      results: SITE_CHECKS.map(([key, name, tier]) => ({ key, name, tier, status: 'pending', detail: '' })),
      shown: 0, // rows revealed so far (results arrive faster than they're shown)
    });
    render();
    const live = () => run === _siteRun && site.phase === 'checking';
    const pacer = setInterval(() => {
      const r = site.results[site.shown];
      if (!live() || !r) return clearInterval(pacer);
      if (r.status === 'pending') return;
      site.shown++;
      render();
    }, SITE_PACE_MS);
    const set = (key, status, detail) => {
      if (!live()) return;
      if (status === 'wait') {
        // Vest lists no active account: nothing to read from yet
        Object.assign(site, { phase: 'waiting', wait: 'accounts', empty: true, running: false, at: Date.now() });
        return render();
      }
      if (sim.has('fail') && key === 'code') [status, detail] = ['fail', 'No longer found: positionId (simulated)'];
      if (sim.has('warn') && (key === 'feed' || key === 'prices'))
        [status, detail] = ['warn', 'Not connected (simulated): copying works, a little slower'];
      Object.assign(
        site.results.find((r) => r.key === key),
        { status, detail },
      );
      render();
    };
    const probe = async (key, fn) => {
      if (!live()) return;
      if (sim.has('slow')) await sleep(700);
      const must = SITE_CHECKS.find((c) => c[0] === key)[2] === 'must';
      try {
        const [status, detail] = await fn();
        set(key, status, detail);
      } catch (e) {
        set(key, must ? 'fail' : 'warn', e.message);
      }
    };
    const missing = (o, keys) => keys.filter((k) => !o || typeof o !== 'object' || !(k in o));
    const fields = (o, keys, ok) => {
      const m = missing(o, keys);
      return m.length ? ['fail', 'Missing fields: ' + m.join(', ')] : ['pass', ok];
    };
    // the market on Vest's screen (the Trade tab's follows it only while open, so a closed tab named an old market)
    let sym = S.trade.symbol || 'NDX-USD-PERP';
    try {
      const name = vestMarketName(),
        map = name && (await loadDisplayMap());
      if (map && map[name]) sym = map[name];
    } catch {
      /* best effort: the Trade tab's market */
    }
    const codeP = readVestCode();

    const required = (async () => {
      let active = [],
        tok = null;
      await probe('accounts', async () => {
        const [a, b] = await Promise.all([
          api('/v3/capital/accounts/active'),
          api(`/v3/accounts?active=true&limit=${BALANCES_LIMIT}`),
        ]);
        if (!Array.isArray(a.accounts)) return ['fail', "The account list is gone from Vest's answer"];
        active = a.accounts;
        if (!active.length || sim.has('wait')) return ['wait'];
        if (!Array.isArray(b.accounts) || !b.accounts.length) return ['fail', 'No balances returned'];
        const m = [
          ...missing(active[0], ['id', 'initial_capital', 'max_drawdown_limit', 'account_type']),
          ...missing(b.accounts[0], ['account_id', 'amount']),
        ];
        return m.length
          ? ['fail', 'Missing fields: ' + m.join(', ')]
          : ['pass', `${active.length} active account(s), balances readable`];
      });
      if (!live()) return;
      const testId = (S.master && S.byId[S.master] ? S.master : null) || (active[0] && active[0].id);
      await probe('token', async () => {
        if (!testId) return ['fail', 'Not checked: no account to test with'];
        const r = await api('/v3/auth/account-token', userToken, {
          method: 'POST',
          body: JSON.stringify({ accountId: testId }),
        });
        tok = r.apiKey || r.accessToken;
        if (!tok) return ['fail', "No token in Vest's answer"];
        const c = decodeJwt(tok);
        if (c.accountId !== testId)
          return ['fail', 'The token no longer names its account (how the master is told apart)'];
        return [
          'pass',
          'canTrade' in c
            ? 'Account token issued'
            : 'Account token issued (its trading-status flag is gone: shown as unknown)',
        ];
      });
      await probe('leverage', async () => {
        const r = await api('/v3/user-state');
        if (!Array.isArray(r.accounts)) return ['fail', 'No accounts list in user-state'];
        if (!r.accounts.length) return ['fail', 'No accounts in user-state'];
        return fields(r.accounts[0], ['accountId', 'leverages'], 'Leverage per market readable');
      });
      await probe('positions', async () => {
        if (!tok) return ['fail', 'Not checked: no account token'];
        const [p, o] = await Promise.all([api('/v3/positions/opened', tok), api('/v3/positions/opened-orders', tok)]);
        const m = [...missing(p, ['positions']), ...missing(o, ['orders'])];
        return m.length ? ['fail', 'Missing: ' + m.join(', ')] : ['pass', 'Open positions and orders readable'];
      });
      await probe('fills', async () => {
        if (!tok) return ['fail', 'Not checked: no account token'];
        const now = Math.floor(Date.now() / 1000);
        const q = `account_id=${encodeURIComponent(testId)}&symbol=${encodeURIComponent(sym)}&from=${now - 86400}&to=${now}&limit=5`;
        const r = await api(`/v3/executions?${q}`, tok);
        if (!Array.isArray(r.items)) return ['fail', 'No items list'];
        if (!r.items.length) return ['pass', 'Readable (no recent fills to inspect)'];
        return fields(r.items[0], ['id', 'price'], 'Fill prices readable');
      });
      await probe('market', async () => {
        const r = await (await _fetch(`${API}/v3/exchangeInfo?symbols=${encodeURIComponent(sym)}`)).json();
        const x = (r.symbols || []).find((s) => s && s.symbol === sym);
        if (!x) return ['fail', `${symLabel(sym)} is missing from Vest's market list`];
        return fields(
          x,
          ['sizeDecimals', 'minTickSize', 'initMarginRatio'],
          `${symLabel(sym)}: tick, size step and margin readable`,
        );
      });
      await probe('code', async () => {
        const code = await codeP;
        if (!code) return ['fail', "Couldn't read Vest's code"];
        const lost = SCAN_TERMS.filter((t) => !hasTerm(code, t));
        return lost.length
          ? ['fail', 'No longer found: ' + lost.join(', ')]
          : ['pass', `All ${SCAN_TERMS.length} order endpoints and fields present`];
      });
    })();

    const extras = Promise.all([
      probe('feed', async () => {
        const code = await codeP;
        const lost = code ? FEED_TERMS.filter((t) => !hasTerm(code, t)) : [];
        const up = await waitUntil(() => _feed.ws && _feed.ws.readyState === 1, SITE_WAIT_MS);
        if (!up) return ['warn', 'Not connected: copying works, balances and closes are read every 20 s instead'];
        const gone = [...new Set([...lost, ...(_feed.missing || [])])];
        return gone.length
          ? ['warn', `Vest changed its live updates (${gone.join(', ')}): copying works, balances may lag a minute`]
          : ['pass', _feed.stateAt ? 'Connected, updates read' : 'Connected'];
      }),
      probe('prices', async () => {
        watchPrice(sym);
        const got = await waitUntil(() => priceOf(sym) != null, SITE_WAIT_MS);
        const p = S.price[sym] || {};
        const book = recentAt(p.bookAt);
        unwatchUnused();
        if (!got)
          return [
            'warn',
            `No live ${symLabel(sym)} price: breakeven and Max sizing wait for one, copying is unaffected`,
          ];
        return [
          'pass',
          book ? `${symLabel(sym)} order book streaming` : `${symLabel(sym)} price streaming (no order book yet)`,
        ];
      }),
      probe('chart', async () => {
        if (!/^\/trade(\/|$)/.test(location.pathname)) return ['skip', 'Checked on a trade page'];
        const f = await waitUntil(() => {
          const x = chartFrame();
          return x && x.contentWindow.tradingViewApi.activeChart() && x;
        }, SITE_WAIT_MS);
        const off = 'picking a limit on the chart, hiding marks and the theme may not work; copying is unaffected';
        if (!f) return ['warn', `Vest's chart wasn't found: ${off}`];
        const w = f.contentWindow,
          c = w.tradingViewApi.activeChart();
        const ok =
          typeof c.getCheckableActionState === 'function' &&
          typeof c.getAllStudies === 'function' &&
          typeof w.applyOverrides === 'function';
        return ok ? ['pass', 'TradingView tools reachable'] : ['warn', `Vest's chart changed: ${off}`];
      }),
      probe('claims', async () => {
        const code = await codeP;
        if (!code) return ['warn', "Couldn't read Vest's code"];
        return CLAIM_TERMS.every((t) => hasTerm(code, t))
          ? ['pass', 'Claim endpoint present']
          : ['warn', "Vest's claim endpoint is gone: claim on Vest's own page"];
      }),
    ]);

    await Promise.all([required, extras]);
    await waitUntil(() => !live() || site.shown >= site.results.length, SITE_PACE_MS * (site.results.length + 2));
    clearInterval(pacer);
    if (!live()) return;
    site.shown = site.results.length;
    site.running = false;
    finishSiteCheck(site);
  }
  const countStatus = (site, status) => site.results.filter((r) => r.status === status).length;
  function finishSiteCheck(site) {
    const fails = site.results.filter((r) => r.status === 'fail'),
      warns = site.results.filter((r) => r.status === 'warn');
    site.doneAt = Date.now();
    diag('site_check', {
      fp: site.fp,
      pass: countStatus(site, 'pass'),
      warn: warns.length,
      fail: fails.length,
      results: site.results.map(({ key, status, detail }) => ({ key, status, detail })),
    });
    const gated = healthState().changed;
    if (fails.length) {
      site.phase = 'failed';
      const names = fails.map((r) => r.name).join(', ');
      logEvent(
        'warn',
        gated
          ? `Vest updated its site and the copier no longer matches it (${names}). Copying is off until a copier update.`
          : `Site check: ${names} failed. Diag has the details.`,
      );
    } else {
      const must = SITE_CHECKS.filter((c) => c[2] === 'must').length;
      logEvent('info', `Site check: all ${must} required checks passed.`);
      for (const r of warns) logEvent('warn', `${r.name}: ${r.detail}`);
      if (gated) acceptBuild(site);
      else site.phase = 'done';
    }
    render();
  }
  // Every required check passed on this build: remember it, show "All clear" for a moment.
  function acceptBuild(site) {
    const fp = fingerprint();
    if (site.fp !== fp) {
      site.phase = 'done'; // the page changed build during the check: the next round checks that one
      return;
    }
    if (fp) {
      _acceptedBuild = fp;
      try {
        localStorage.setItem(BUILD_KEY, fp);
      } catch {
        /* storage full: this page still knows (`_acceptedBuild`); the next load checks again */
      }
    } else _unknownBuildChecked = true;
    site.phase = 'accepted';
    site.acceptedAt = Date.now();
    logEvent('info', `Vest build ${fp || '(unknown)'} checked and accepted.`);
    diag('build_accepted', { fp, auto: true });
    setTimeout(render, ALL_CLEAR_MS + 50);
  }
  // What the panel shows in place of its tabs: 'checking' | 'waiting' | 'failed' while Vest's build isn't accepted,
  // 'clear' for a moment once it is; null = the normal panel. An armed copier is never taken over.
  function siteGate() {
    const s = S.site;
    if (s && s.phase === 'accepted' && Date.now() - s.acceptedAt < ALL_CLEAR_MS) return 'clear';
    if (S.armed || !healthState().changed) return null;
    if (s && s.phase === 'accepted') return null; // checked and accepted (its save may have failed: storage full)
    return s && s.fp === fingerprint() && s.phase !== 'done' ? s.phase : 'checking';
  }
  // Why an order from the panel (or automatic breakeven) has to wait, or null.
  const siteBlocks = () => {
    const g = siteGate();
    if (!g || g === 'clear') return null;
    return g === 'failed'
      ? "Vest changed something the copier relies on: use Vest's own panel until a copier update."
      : 'Vest updated its site: wait a moment for the check to finish.';
  };
  // Every second: start (or restart) the check whenever Vest's build isn't accepted and it can run.
  function autoSiteCheck() {
    if (S.armed || !healthState().changed) return;
    const fp = fingerprint(),
      s = S.site && S.site.fp === fp ? S.site : null;
    if (s && (s.running || s.phase === 'accepted')) return;
    if (s && s.phase === 'failed') {
      if (!s.retried && Date.now() - s.doneAt > SITE_RETRY_MS) runSiteCheck(true);
      return;
    }
    if (s && s.phase === 'waiting' && s.empty && Date.now() - s.at < SITE_EMPTY_MS) return;
    const wait = !userTokenOk() ? 'session' : !S.groups.length ? 'accounts' : null;
    if (!wait) return runSiteCheck();
    if (Date.now() - _bootAt < SITE_SETTLE_MS) return; // still loading: shown as "checking" until then
    if (!s || s.phase !== 'waiting' || s.wait !== wait) {
      S.site = { fp, phase: 'waiting', wait, results: [], at: Date.now() };
      render();
    }
  }
  // The site check view from the status bar (a fresh check unless this build's results are already in).
  function openSiteCheck() {
    if (siteGate()) return render();
    S.siteOpen = true;
    S.rulesOpen = false;
    S.supportOpen = false;
    S.summaryOpen = false;
    S.settingsOpen = false;
    S.appearOpen = false;
    S.tradeOpen = false;
    const have = S.site && S.site.fp === fingerprint() && S.site.results.length;
    if (!have && !(S.site && S.site.running)) runSiteCheck();
    else render();
  }

  // ───────────────────────── UI ─────────────────────────
  let _root = null; // the panel's shadow root
  const money = (n) =>
    isNaN(n) ? '—' : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const acctNum = (label) => (String(label).match(/(\d+)\s*$/) || ['', '--'])[1]; // "Account 07" → "07"

  const CSS = `
    :host {
      all: initial;
    }
    * {
      box-sizing: border-box;
      font-family: inherit;
    }
    .panel {
      font-family: var(--sans);
      --bg: #0c0c0d;
      --elev: #141416;
      --elev2: #1a1a1d;
      --s1: #121214;
      --s2: #18181b;
      --s3: #202024;
      --sunk: #080809;
      --hair: rgba(255, 255, 255, 0.06);
      --line: rgba(255, 255, 255, 0.09);
      --line2: rgba(255, 255, 255, 0.16);
      --text: #f0f0f1;
      --dim: #a1a1a8;
      --faint: #6b6b73;
      --accent: #c8f542;
      --ink: #0c0c0d;
      --accent-dim: rgba(200, 245, 66, 0.1);
      --accent-line: rgba(200, 245, 66, 0.4);
      --danger: #ff5a4f;
      --danger-dim: rgba(255, 90, 79, 0.1);
      --danger-line: rgba(255, 90, 79, 0.42);
      --warn: #f5b942;
      --warn-dim: rgba(245, 185, 66, 0.1);
      --warn-line: rgba(245, 185, 66, 0.4);
      --sans: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      --mono: 'JetBrains Mono', ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, Menlo, monospace;
      position: fixed;
      top: 16px;
      right: 16px;
      width: 340px;
      max-height: calc(100vh - 32px);
      /* above the chart and Vest's page (its header is 40), below every Vest menu, dropdown and dialog (50) */
      z-index: 45;
      transition: opacity 0.12s;
      display: flex;
      flex-direction: column;
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--line2);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
      font-size: 13px;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
    }
    button {
      font-family: inherit;
    }
    /* Small section labels: mono capitals, like stratuh.com. Everything else is sentence case. */
    .eyebrow,
    .set-h,
    .tr-lbl,
    .tr-pxl,
    .title {
      font-family: var(--mono);
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--faint);
    }
    .hint {
      font-size: 11.5px;
      line-height: 1.45;
      color: var(--faint);
    }
    .amber {
      color: var(--warn);
    }
    .lnk {
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font-size: 12px;
      color: var(--dim);
      text-decoration: underline;
      text-decoration-color: var(--line2);
      text-underline-offset: 3px;
    }
    .lnk:hover {
      color: var(--text);
    }
    .hdr {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 44px;
      padding: 0 6px 0 12px;
      cursor: move;
      border-bottom: 1px solid var(--hair);
      flex: none;
      touch-action: none;
      user-select: none;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 5px;
      flex: none;
    }
    .brand svg {
      display: block;
    }
    .sep {
      width: 1px;
      height: 14px;
      background: var(--line2);
      flex: none;
    }
    .title {
      letter-spacing: 0.2em;
      white-space: nowrap;
    }
    .spacer {
      flex: 1;
    }
    /* the state, top right: lime copying, grey not copying, amber needs you, red check failed */
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 22px;
      padding: 0 8px;
      background: var(--s2);
      color: var(--dim);
      font-size: 11.5px;
      font-weight: 500;
      white-space: nowrap;
      flex: none;
    }
    .pdot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--faint);
    }
    .pill.live {
      background: var(--accent-dim);
      color: var(--accent);
    }
    .pill.warn {
      background: var(--warn-dim);
      color: var(--warn);
    }
    .pill.bad {
      background: var(--danger-dim);
      color: var(--danger);
    }
    .pill.live .pdot {
      background: var(--accent);
    }
    .pill.warn .pdot {
      background: var(--warn);
    }
    .pill.bad .pdot {
      background: var(--danger);
    }
    .pillv,
    .pillbtn {
      display: none;
    }
    .iconbtn {
      cursor: pointer;
      color: var(--dim);
      background: none;
      border: 1px solid transparent;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 500;
      line-height: 1;
      padding: 5px 7px;
      transition: 0.12s;
    }
    .iconbtn:hover {
      color: var(--text);
      background: var(--s2);
    }
    .hdr .iconbtn {
      display: inline-grid;
      place-items: center;
      width: 28px;
      height: 28px;
      padding: 0;
      flex: none;
    }
    .hdr .iconbtn svg {
      display: block;
    }
    /* a sheet (Settings, Help, the site check, Share): back arrow and its title in place of the logo and state */
    .panel:not(.sheet) .hdr .back,
    .sheett {
      display: none;
    }
    .sheet .hdr .back {
      display: inline-grid;
      margin-left: -6px;
    }
    .sheet .sheett {
      display: block;
      font-size: 14px;
      font-weight: 500;
    }
    .sheet .hdr .brand,
    .sheet .hdr .sep,
    .sheet .hdr .title,
    .sheet .hdr .pill,
    .sheet .status,
    .sheet .tabs,
    .first .tabs,
    .first .ctl {
      display: none !important;
    }
    /* the ⋯ menu */
    .menu {
      position: absolute;
      top: 40px;
      right: 8px;
      z-index: 4;
      width: 214px;
      padding: 4px;
      display: grid;
      background: var(--s2);
      border: 1px solid var(--line2);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
    }
    .menu[hidden] {
      display: none;
    }
    .mi {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 32px;
      padding: 0 10px;
      background: none;
      border: none;
      color: var(--text);
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }
    .mi:hover {
      background: var(--s3);
    }
    .mi svg {
      color: var(--faint);
      flex: none;
    }
    .mi .mt {
      flex: 1;
    }
    .mi .mk {
      display: none;
      color: var(--accent);
    }
    .mi.on .mk {
      display: block;
    }
    .mi .mk svg {
      color: var(--accent);
    }
    .mhr {
      height: 1px;
      margin: 4px 6px;
      background: var(--hair);
    }
    /* the status block: one sentence, what last happened, Start / Stop copying and Flatten all */
    .status {
      padding: 13px 14px 12px;
      display: grid;
      gap: 10px;
      flex: none;
    }
    .say {
      font-size: 15.5px;
      font-weight: 500;
      line-height: 1.3;
      letter-spacing: -0.005em;
    }
    .say em {
      font-style: normal;
      color: var(--accent);
    }
    .ssub {
      font-size: 12px;
      color: var(--faint);
      margin-top: -6px;
    }
    .ssub:empty {
      display: none;
    }
    .tabs {
      padding: 0 14px 12px;
      border-bottom: 1px solid var(--hair);
      flex: none;
    }
    .tabseg {
      display: flex;
      gap: 2px;
      padding: 2px;
      background: var(--s1);
      border: 1px solid var(--hair);
    }
    .tab {
      flex: 1;
      cursor: pointer;
      background: none;
      border: none;
      color: var(--dim);
      font-size: 12.5px;
      font-weight: 500;
      padding: 6px 4px;
    }
    .tab:hover {
      color: var(--text);
    }
    .tab.on {
      background: var(--s3);
      color: var(--text);
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex: none;
      display: inline-block;
    }
    .green {
      background: var(--accent);
    }
    .amber.dot,
    .dot.amber {
      background: var(--warn);
    }
    .red {
      background: var(--danger);
    }
    .gray {
      background: #4a4a50;
    }
    .body {
      flex: 1 1 auto;
      overflow: auto;
      min-height: 96px; /* a short panel squeezes the open log first, then this; the footer always shows */
    }
    .body::-webkit-scrollbar,
    .log::-webkit-scrollbar {
      width: 6px;
    }
    .body::-webkit-scrollbar-thumb,
    .log::-webkit-scrollbar-thumb {
      background: #2a2a2e;
    }
    /* one-time and only-when-it-applies bars: an update, the support question, the theme intro */
    .alertzone {
      flex: none;
    }
    .update {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 0 14px 10px;
      padding: 9px 10px 9px 12px;
      background: var(--s1);
      color: var(--dim);
      font-size: 12px;
      line-height: 1.45;
      max-height: 40vh;
      overflow: auto;
    }
    .update b {
      color: var(--text);
      font-weight: 500;
    }
    .utext {
      flex: 1 1 180px;
    }
    .pausebar {
      flex: none;
      padding: 9px 14px;
      background: var(--warn);
      color: #0c0c0d;
      font-size: 12.5px;
      line-height: 1.45;
    }
    .pausebar b {
      font-weight: 650;
    }
    .pausebar .pbtn {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 8px;
      background: #0c0c0d;
      color: var(--warn);
      font-weight: 600;
      text-decoration: none;
    }
    .pausebar[hidden] {
      display: none;
    }
    .noticebar {
      flex: none;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 8px 8px 14px;
      background: var(--s1);
      border-bottom: 1px solid var(--hair);
      box-shadow: inset 2px 0 0 var(--accent);
      color: var(--text);
      font-size: 12.5px;
      line-height: 1.45;
    }
    .noticebar.warn {
      box-shadow: inset 2px 0 0 var(--warn);
    }
    .noticebar[hidden] {
      display: none;
    }
    .noticebar .ntext {
      flex: 1;
      padding-top: 1px;
    }
    .noticebar .nx {
      flex: none;
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      background: none;
      border: none;
      color: var(--dim);
      font-size: 17px;
      line-height: 1;
      cursor: pointer;
    }
    .noticebar .nx:hover {
      color: var(--text);
    }

    .update.muted {
      color: var(--faint);
      font-size: 11.5px;
    }
    .update[hidden] {
      display: none;
    }
    .alertzone > .update:first-child:not([hidden]),
    .alertzone > .update:not([hidden]) {
      margin-top: 10px;
    }
    .alertzone > .update:not([hidden]) ~ .update:not([hidden]) {
      margin-top: 0;
    }
    .ubtn {
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 10px;
      border: 1px solid var(--accent);
      background: var(--accent);
      color: var(--ink);
      text-decoration: none;
      white-space: nowrap;
    }
    .ubtn.ghost {
      border-color: var(--line2);
      background: none;
      color: var(--text);
      font-weight: 500;
    }
    .ubtn:hover {
      filter: brightness(1.1);
    }

    /* Copier tab: one line per account (number, name, room to the floor, a dot), and Edit */
    .cop {
      padding: 12px 14px 14px;
      display: grid;
      gap: 10px;
      align-content: start;
    }
    .sech {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      min-height: 18px;
    }
    .sech .h {
      font-size: 14px;
      font-weight: 500;
    }
    .sech + .accts,
    .acct.head + .accts {
      margin-top: -6px;
    }
    .accts {
      display: grid;
    }
    .acct {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr) 96px 8px;
      column-gap: 10px;
      align-items: center;
      min-height: 38px;
      border-bottom: 1px solid var(--hair);
    }
    .acct:last-child {
      border-bottom: 0;
    }
    .tile {
      width: 24px;
      height: 24px;
      display: inline-grid;
      place-items: center;
      font-family: var(--mono);
      font-size: 10.5px;
      font-weight: 600;
      background: var(--s3);
      color: var(--dim);
      flex: none;
    }
    .tile.m {
      background: var(--accent);
      color: var(--ink);
    }
    .nm {
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      overflow: hidden;
      min-width: 0;
    }
    .nm small,
    .chip {
      font-family: var(--mono);
      font-size: 9.5px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--dim);
      border: 1px solid var(--line);
      padding: 2px 4px;
      line-height: 1;
    }
    .room {
      display: grid;
      gap: 4px;
      justify-items: end;
    }
    .room > span:first-child {
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 500;
    }
    .meter {
      width: 100%;
      height: 3px;
      background: var(--s3);
      overflow: hidden;
      display: block;
    }
    .meter i {
      display: block;
      height: 100%;
      background: var(--dim);
    }
    .meter i.warn {
      background: var(--warn);
    }
    .acct.off .nm,
    .acct.off .room > span:first-child {
      color: var(--faint);
    }
    .acct .note {
      grid-column: 2 / -1;
      font-size: 11.5px;
      color: var(--warn);
      margin: -6px 0 8px;
    }
    .acct .note.dim {
      color: var(--faint);
    }
    .sdot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--faint);
      display: inline-block;
      flex: none;
    }
    .sdot.live {
      background: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-dim);
    }
    .sdot.bad {
      background: var(--danger);
    }
    .sdot.hollow {
      background: transparent;
      border: 1px solid var(--faint);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      font-size: 11px;
      color: var(--faint);
      align-items: center;
    }
    .legend span {
      display: inline-flex;
      gap: 6px;
      align-items: center;
    }
    .legend .sdot {
      width: 6px;
      height: 6px;
      box-shadow: none;
    }
    /* Edit: radio = master, box = follower */
    .acct.ed {
      grid-template-columns: 24px minmax(0, 1fr) 44px 36px;
    }
    .acct.ed.head {
      min-height: 22px;
      border-bottom: 0;
    }
    .acct.ed.head .eyebrow:nth-child(n + 3) {
      text-align: center;
      letter-spacing: 0.08em;
    }
    .rd,
    .ck {
      justify-self: center;
      width: 16px;
      height: 16px;
      padding: 0;
      display: grid;
      place-items: center;
      border: 1px solid var(--line2);
      background: none;
      color: var(--ink);
      cursor: pointer;
    }
    .rd {
      border-radius: 50%;
    }
    .rd.on::after {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
    }
    .ck svg {
      width: 11px;
      height: 11px;
      stroke-width: 2.6;
      visibility: hidden;
    }
    .ck.on {
      background: var(--accent);
      border-color: var(--accent);
    }
    .ck.on svg {
      visibility: visible;
    }
    .rd:disabled,
    .ck:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .ck.on:disabled,
    .rd.on:disabled {
      opacity: 1;
    }
    .ckm {
      justify-self: center;
      color: var(--faint);
      font-family: var(--mono);
    }

    /* Start / Stop copying and Flatten all */
    .ctl {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
    }
    .armbtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      height: 34px;
      padding: 0 14px;
      border: 1px solid var(--accent);
      background: var(--accent);
      color: var(--ink);
      transition: 0.12s;
      white-space: nowrap;
    }
    .armbtn:hover:not(:disabled) {
      filter: brightness(1.08);
    }
    /* stopping is routine, not danger: neutral */
    .armbtn.armed {
      background: var(--s2);
      border-color: var(--line2);
      color: var(--text);
      font-weight: 500;
    }
    .armbtn.armed:hover:not(:disabled) {
      background: var(--s3);
      filter: none;
    }
    .armbtn:disabled {
      background: var(--s2);
      border-color: var(--line);
      color: var(--faint);
      cursor: not-allowed;
    }
    .armbtn.sm {
      height: 28px;
      padding: 0 12px;
      font-size: 12px;
    }
    .dangerbtn {
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      height: 34px;
      padding: 0 14px;
      border: 1px solid var(--danger-line);
      background: none;
      color: var(--danger);
      white-space: nowrap;
      transition: 0.12s;
    }
    .dangerbtn:hover:not(:disabled) {
      background: var(--danger-dim);
      border-color: var(--danger);
    }
    .dangerbtn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .ghostbtn {
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      height: 28px;
      padding: 0 10px;
      border: 1px solid var(--line2);
      background: var(--s2);
      color: var(--text);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .ghostbtn:hover {
      background: var(--s3);
    }
    .ghostbtn:disabled {
      background: var(--s2);
      color: var(--faint);
      cursor: not-allowed;
    }
    a.ghostbtn {
      text-decoration: none;
    }

    /* Settings: one line per option, the full text behind ? */
    .settings {
      padding: 4px 14px 14px;
    }
    .set-h {
      padding: 14px 0 2px;
    }
    .opt {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 9px 0;
      border-bottom: 1px solid var(--hair);
    }
    .opt:last-child {
      border-bottom: none;
    }
    .opt.dep-off {
      opacity: 0.45;
    }
    .opt[hidden] {
      display: none;
    }
    .opt-txt {
      flex: 1;
      min-width: 0;
    }
    .opt-name {
      font-weight: 500;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .opt-short {
      color: var(--faint);
      font-size: 11.5px;
      line-height: 1.35;
      margin-top: 2px;
    }
    .opt-desc {
      display: none;
      color: var(--dim);
      font-size: 11.5px;
      line-height: 1.5;
      margin-top: 6px;
    }
    .opt.open .opt-desc {
      display: block;
    }
    .opt-desc b {
      color: var(--text);
      font-weight: 500;
    }
    .qm {
      cursor: pointer;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      border: 1px solid var(--line2);
      background: none;
      color: var(--faint);
      font-family: var(--mono);
      font-size: 9px;
      line-height: 1;
      padding: 0;
      display: inline-grid;
      place-items: center;
    }
    .qm:hover,
    .opt.open .qm {
      color: var(--text);
      border-color: var(--text);
    }
    .switch {
      flex: none;
      position: relative;
      width: 30px;
      height: 17px;
      border: 1px solid var(--line);
      background: var(--s3);
      cursor: pointer;
      padding: 0;
      transition: 0.15s;
    }
    .switch .knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 11px;
      height: 11px;
      background: var(--faint);
      transition: 0.15s;
    }
    .switch.on {
      border-color: var(--accent-line);
      background: var(--accent-dim);
    }
    .switch.on .knob {
      transform: translateX(13px);
      background: var(--accent);
    }
    .set-row {
      display: flex;
      gap: 8px;
      padding: 8px 0 4px;
    }

    /* Alerts (only when they apply): the orphan prompt, notices, toasts. Then the footer: the latest log line (it opens into
       the log) and the status dot (it opens the status card). */
    .alerts:empty {
      display: none;
    }
    .alerts {
      padding: 0 14px 10px;
      display: grid;
      gap: 8px;
      flex: none;
    }
    .alerts:first-child,
    .update[hidden] + .update[hidden] + .update[hidden] + .alerts {
      padding-top: 10px;
    }
    .orphan {
      padding: 11px 12px;
      display: grid;
      gap: 10px;
      background: var(--warn-dim);
      border: 1px solid var(--warn-line);
      font-size: 12.5px;
      line-height: 1.45;
    }
    .orphan b {
      font-weight: 600;
    }
    .obtns {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .obtns .lnk {
      margin-left: auto;
    }
    .obtn {
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      height: 28px;
      padding: 0 10px;
      border: 1px solid var(--danger-line);
      background: none;
      color: var(--danger);
    }
    .obtn:hover {
      background: var(--danger-dim);
    }
    .obtn.keep {
      border-color: var(--line2);
      background: var(--s2);
      color: var(--text);
    }
    .toast {
      padding: 9px 12px;
      background: var(--warn-dim);
      border: 1px solid var(--warn-line);
      color: var(--warn);
      font-size: 12px;
      line-height: 1.45;
    }
    .logwrap {
      border-top: 1px solid var(--hair);
      flex: 0 10 auto; /* gives up its height before the body does, down to its one line */
      min-height: 34px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .logh {
      flex: none;
      display: flex;
      align-items: center;
      gap: 8px;
      height: 34px;
      padding: 0 8px 0 12px;
      font-family: var(--mono);
      font-size: 11px;
      color: var(--dim);
      cursor: pointer;
      user-select: none;
    }
    .caret {
      display: grid;
      color: var(--faint);
      flex: none;
    }
    .logt {
      display: none;
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--faint);
      flex: 1;
    }
    .loglast {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .loglast .ts {
      color: var(--faint);
      flex: none;
    }
    .loglast .lm {
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .loglast.ok .lm {
      color: var(--accent);
    }
    .loglast.warn .lm {
      color: var(--warn);
    }
    .loglast .lnk {
      flex: none;
      font-family: var(--sans);
      font-size: 11.5px;
    }
    .logh:hover .lm {
      color: var(--text);
    }
    .logwrap.open .loglast {
      display: none;
    }
    .logwrap.open .logt {
      display: block;
    }
    .loghbtns {
      display: none;
      gap: 2px;
    }
    .logwrap.open .loghbtns {
      display: flex;
    }
    .iconbtn.sm {
      font-family: var(--sans);
      font-size: 11.5px;
      padding: 4px 6px;
    }
    /* the bottom bar: the code on the left; Vest's build · version · API budget on the right (click = status card) */
    .reportbar {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 30px;
      padding: 0 18px 0 12px; /* clear of the resize grip in the corner */
      background: var(--sunk);
      border-top: 1px solid var(--hair);
      flex: none;
      white-space: nowrap;
    }
    .codebtn {
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font-size: 11px;
      color: var(--dim);
      display: inline-flex;
      align-items: center;
      gap: 5px;
      flex: none;
    }
    .codebtn b {
      background: var(--accent);
      color: var(--ink);
      font-family: var(--mono);
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 1px 5px;
      font-size: 10.5px;
    }
    .codebtn:hover b {
      filter: brightness(1.1);
    }
    .codebtn[hidden],
    .reportbar.alert .codebtn {
      display: none;
    }
    .health {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--mono);
      font-size: 10px;
      color: var(--faint);
    }
    .reportbar.alert .health {
      margin-left: 0;
    }
    .hsum {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .health:hover .hsum {
      color: var(--text);
    }
    .reportbar.alert .hsum {
      color: var(--warn);
    }
    .health .dot.green {
      opacity: 0.85;
    }
    .log {
      max-height: calc(6 * (1.5em + 4px) + 8px); /* six lines; the rest scrolls (CSV / Diag export it all) */
      min-height: 0;
      overflow: auto;
      padding: 0 12px 8px;
      font-size: 11px;
      line-height: 1.5;
      font-family: var(--mono);
    }
    .logwrap:not(.open) .log {
      max-height: 0;
      padding: 0;
      overflow: hidden;
    }
    .le {
      display: grid;
      grid-template-columns: 58px 1fr;
      gap: 8px;
      padding: 2px 0;
      color: var(--dim);
    }
    .le .ts {
      color: var(--faint);
    }
    .le.ok {
      color: var(--accent);
    }
    .le.warn {
      color: var(--warn);
    }
    /* the status card: Vest's build, this version, the API budget, the site check */
    .scard {
      position: absolute;
      right: 8px;
      bottom: 34px;
      z-index: 4;
      width: 262px;
      padding: 12px;
      display: grid;
      gap: 8px;
      background: var(--s2);
      border: 1px solid var(--line2);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
    }
    .scard[hidden] {
      display: none;
    }
    .kv {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      font-size: 12px;
    }
    .kv > span:first-child {
      color: var(--dim);
    }
    .kv > span:last-child {
      font-family: var(--mono);
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .scard .ghostbtn {
      justify-self: start;
      margin-top: 4px;
    }
    /* the connection readout (the meter, 2026-10-15): the time to Vest */
    .scard.cx-card {
      width: 276px;
      gap: 7px;
    }
    .health.cx-off .dot,
    .health.cx-none .dot {
      background: #4a4a50;
      opacity: 1;
    }
    .health.cx-good .dot {
      background: var(--accent);
      opacity: 1;
    }
    .health.cx-ok .dot {
      background: var(--dim);
      opacity: 1;
    }
    .health.cx-slow .dot {
      background: var(--warn);
      opacity: 1;
    }
    .health.cx-down .dot {
      background: var(--danger);
      opacity: 1;
    }
    .hsum .ms {
      color: var(--dim);
    }
    .health.cx-good .hsum .ms {
      color: var(--text);
    }
    .health.cx-slow .hsum .ms {
      color: var(--warn);
    }
    .health.cx-down .hsum .ms {
      color: var(--danger);
    }
    .cx-sep {
      height: 1px;
      background: var(--hair);
      margin: 3px 0;
    }
    .kv .v-down {
      color: var(--danger);
    }
    .kv .v-muted {
      color: var(--faint);
    }
    .cx-btns {
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }
    .cx-btns .ghostbtn {
      flex: 1;
      justify-content: center;
      padding: 0 8px;
      margin-top: 0;
    }
    .cx-btns .ghostbtn:disabled {
      color: var(--dim);
    }
    .cx-prog {
      height: 2px;
      background: var(--s3);
      margin-top: 2px;
    }
    .cx-prog i {
      display: block;
      height: 100%;
      background: var(--dim);
      transition: width 0.2s;
    }
    .cx-verdict {
      display: grid;
      gap: 4px;
      padding: 9px 10px;
      border-left: 2px solid var(--line2);
      background: var(--s3);
      font-size: 11.5px;
      line-height: 1.45;
      color: var(--dim);
    }
    .cx-verdict b {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text);
    }
    .cx-verdict small {
      font-family: var(--mono);
      font-size: 10.5px;
      color: var(--faint);
    }
    .cx-verdict.good {
      border-color: var(--accent);
      background: var(--accent-dim);
    }
    .cx-verdict.good b {
      color: var(--accent);
    }
    .cx-verdict.slow {
      border-color: var(--warn);
      background: var(--warn-dim);
    }
    .cx-verdict.slow b {
      color: var(--warn);
    }
    .cx-verdict.down {
      border-color: var(--danger);
      background: var(--danger-dim);
    }
    .cx-verdict.down b {
      color: var(--danger);
    }
    .cx-verdict[hidden],
    .cx-prog[hidden] {
      display: none;
    }
    .cx-meter {
      display: grid;
      gap: 6px;
    }
    .cx-big {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .cx-big b {
      font: 600 24px/1 var(--mono);
      color: var(--text);
      letter-spacing: -0.02em;
    }
    .cx-big small {
      font-size: 11.5px;
      color: var(--dim);
    }
    .cx-big .lvl {
      margin-left: auto;
      font-size: 11px;
      font-weight: 500;
      padding: 3px 7px;
      background: var(--s3);
      color: var(--dim);
      align-self: center;
    }
    .cx-big .lvl.good {
      background: var(--accent-dim);
      color: var(--accent);
    }
    .cx-big .lvl.slow {
      background: var(--warn-dim);
      color: var(--warn);
    }
    .cx-big .lvl.down {
      background: var(--danger-dim);
      color: var(--danger);
    }
    .cx-big.good b {
      color: var(--accent);
    }
    .cx-big.slow b {
      color: var(--warn);
    }
    .cx-big.down b {
      color: var(--danger);
    }
    .cx-big.empty b {
      color: var(--faint);
      font-size: 18px;
    }
    .cx-spark {
      display: block;
    }
    .cx-flat {
      height: 50px;
      border-bottom: 1px solid var(--line);
    }
    .cx-under {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--dim);
    }
    .cx-under span:last-child {
      font-family: var(--mono);
      color: var(--faint);
      font-size: 10.5px;
    }
    .cx-pms {
      display: none;
    }
    .collapsed .cx-pms:not(:empty) {
      display: block;
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 600;
    }
    .collapsed .cx-pms.slow {
      color: var(--warn);
    }
    .collapsed .cx-pms.down {
      color: var(--danger);
      font-family: var(--sans);
      font-weight: 500;
    }
    .r-amber {
      color: var(--warn);
    }
    .r-red {
      color: var(--danger);
    }
    .linkbtn {
      cursor: pointer;
      background: none;
      border: none;
      padding: 2px 0;
      color: var(--dim);
      font-size: 11.5px;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .linkbtn:hover {
      color: var(--text);
    }
    .grip {
      position: absolute;
      right: 2px;
      bottom: 2px;
      width: 12px;
      height: 12px;
      cursor: nwse-resize;
      z-index: 3;
      touch-action: none;
      background: linear-gradient(
        135deg,
        transparent 45%,
        var(--faint) 45%,
        var(--faint) 52%,
        transparent 52%,
        transparent 68%,
        var(--faint) 68%,
        var(--faint) 75%,
        transparent 75%
      );
    }
    .empty {
      padding: 26px 14px;
      color: var(--dim);
      text-align: center;
      line-height: 1.5;
    }

    /* Rules (first run), Help, the site check */
    .rules,
    .help {
      padding: 14px;
      display: grid;
      gap: 12px;
      align-content: start;
    }
    .rules-h {
      font-weight: 500;
      font-size: 13.5px;
    }
    .rules-h.big {
      font-size: 15px;
    }
    .rules-list {
      margin: 0;
      padding-left: 16px;
      color: var(--dim);
      font-size: 12px;
      line-height: 1.55;
    }
    .rules-list li {
      margin-bottom: 7px;
    }
    .rules-list li::marker {
      color: var(--faint);
    }
    .rules-list b {
      color: var(--text);
      font-weight: 500;
    }
    .rules-accept {
      display: flex;
      gap: 9px;
      align-items: flex-start;
      padding: 10px 12px;
      background: var(--s1);
      border: 1px solid var(--line);
      font-size: 12px;
      line-height: 1.5;
      color: var(--text);
      cursor: pointer;
    }
    .rules-accept input {
      margin-top: 2px;
      accent-color: var(--accent);
    }
    .rules-terms {
      font-size: 11.5px;
      color: var(--faint);
    }
    .rules-terms a,
    .sc-sub a {
      color: var(--dim);
      text-underline-offset: 3px;
    }
    .rules-btns {
      display: flex;
      gap: 8px;
    }
    .help .grp {
      display: grid;
      gap: 8px;
    }
    .links {
      font-size: 12px;
      color: var(--faint);
      line-height: 1.6;
    }
    .lrow {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 36px;
      padding: 0;
      background: none;
      border: none;
      border-bottom: 1px solid var(--hair);
      color: var(--text);
      font-size: 13px;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
    }
    .lrow:last-child {
      border-bottom: 0;
    }
    .lrow .hint {
      margin-left: auto;
    }
    .lrow svg {
      color: var(--faint);
      flex: none;
    }
    .lrow:hover > span:first-child {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .code {
      font-family: var(--mono);
      font-weight: 500;
      color: var(--accent);
    }
    .help .ghostbtn {
      justify-self: start;
    }
    .sc-sub {
      font-size: 12px;
      color: var(--dim);
      line-height: 1.5;
    }
    .sc-list {
      display: flex;
      flex-direction: column;
    }
    .sc-row {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 10px;
      align-items: start;
      padding: 8px 0;
      border-bottom: 1px solid var(--hair);
    }
    .sc-row:last-child {
      border-bottom: 0;
    }
    .sc-row .dot {
      margin-top: 5px;
    }
    .sc-name {
      font-weight: 500;
      font-size: 12.5px;
    }
    .sc-detail {
      font-family: var(--mono);
      font-size: 10.5px;
      color: var(--dim);
      margin-top: 2px;
      line-height: 1.45;
    }
    .sc-note {
      font-size: 11.5px;
      color: var(--dim);
      line-height: 1.5;
    }
    .sc-h {
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--faint);
    }
    .dot.pending {
      animation: vc-blink 1s ease-in-out infinite;
    }
    @keyframes vc-blink {
      50% {
        opacity: 0.25;
      }
    }
    /* Vest updated: the site check takes the body (the status block, alerts and the footer stay) */
    .panel.gated .tabs,
    .panel.gated .themeintro {
      display: none !important;
    }
    .gate {
      margin: 12px 14px;
      background: var(--s1);
      border: 1px solid var(--line);
    }
    .gate .rules {
      padding: 12px;
    }
    .gate-failed {
      background: var(--danger-dim);
      border-color: var(--danger-line);
    }
    .gate-h {
      font-weight: 600;
      font-size: 13.5px;
      color: var(--warn);
    }
    .gate-failed .gate-h {
      color: var(--danger);
    }
    .gate-clear .gate-h {
      color: var(--accent);
    }
    .report-note {
      width: 100%;
      background: var(--sunk);
      border: 1px solid var(--line);
      color: var(--text);
      font: inherit;
      font-size: 12px;
      padding: 8px 10px;
      resize: vertical;
      outline: none;
    }
    .report-note:focus {
      border-color: var(--accent-line);
    }

    /* Trade */
    .trade {
      padding: 12px 14px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    /* Buy / Sell stay in view while the form scrolls */
    .tr-action {
      position: sticky;
      bottom: -14px;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 0 -14px;
      padding: 10px 14px 14px;
      background: var(--bg);
      border-top: 1px solid var(--line2);
    }
    .tr-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }
    .tr-sym {
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tr-acct {
      font-family: var(--mono);
      font-size: 10px;
      color: var(--faint);
      margin-top: 4px;
    }
    .tr-pxw {
      text-align: right;
    }
    .tr-px {
      font-family: var(--mono);
      font-size: 18px;
      font-weight: 600;
    }
    .tr-pxl {
      font-size: 9px;
      color: var(--faint);
      letter-spacing: 0.1em;
      margin-top: 2px;
    }
    .tr-sec {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tr-sec > .seg {
      align-self: flex-start;
    }
    .tr-lbl {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 9.5px;
      font-weight: 500;
      letter-spacing: 0.1em;
      color: var(--faint);
    }
    .tr-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--dim);
    }
    .tr-in {
      width: 74px;
      background: var(--sunk);
      border: 1px solid var(--line2);
      color: var(--text);
      padding: 6px 8px;
      font-family: var(--mono);
      font-size: 12px;
      outline: none;
    }
    .tr-in:focus {
      border-color: var(--accent);
    }
    .tr-in.sm {
      width: 48px;
      padding: 4px 6px;
    }
    .tr-u {
      font-family: var(--mono);
      font-size: 10px;
      color: var(--faint);
    }
    .tr-calc {
      font-size: 10.5px;
      color: var(--dim);
      font-family: var(--mono);
    }
    .tr-right {
      margin-left: auto;
      color: var(--danger);
    }
    /* segmented controls: the picked one is lifted, not lime (lime means live / buy / gain) */
    .seg {
      display: inline-flex;
      gap: 2px;
      padding: 2px;
      background: var(--s1);
      border: 1px solid var(--hair);
      flex: none;
    }
    .seg button {
      background: none;
      border: none;
      color: var(--dim);
      font-size: 12px;
      font-weight: 500;
      padding: 5px 9px;
      cursor: pointer;
      white-space: nowrap;
    }
    .seg button:hover {
      color: var(--text);
    }
    .seg button.on {
      background: var(--s3);
      color: var(--text);
    }
    /* the chart bracket's switch, at the end of the Order row */
    .tr-lines {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 5px 8px 5px 9px;
      font-size: 12px;
      font-weight: 500;
      color: var(--dim);
      background: var(--s1);
      border: 1px solid var(--hair);
      cursor: pointer;
      white-space: nowrap;
    }
    .tr-lines:hover,
    .tr-lines.on {
      color: var(--text);
    }
    .tr-lines[hidden] {
      display: none;
    }
    .tr-lines .knob {
      width: 24px;
      height: 13px;
      background: var(--s3);
      position: relative;
      flex: none;
    }
    .tr-lines .knob i {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 9px;
      height: 9px;
      background: var(--faint);
      transition: left 0.12s;
    }
    .tr-lines.on .knob {
      background: rgba(200, 245, 66, 0.35);
    }
    .tr-lines.on .knob i {
      left: 13px;
      background: var(--accent);
    }
    .tr-lh .seg button {
      padding: 2px 7px;
      font-size: 11px;
    }
    /* label + control rows */
    .tr-f {
      display: grid;
      grid-template-columns: 62px 1fr;
      align-items: center;
      gap: 8px;
    }
    .tr-k {
      font-family: var(--mono);
      font-size: 9.5px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
    }
    .tr-f .tr-add {
      margin-left: auto;
    }
    .tr-ind {
      margin: -6px 0 0 70px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .tr-ind:empty,
    .tr-ind:not(:has(:not(:empty))) {
      display: none;
    }
    .tr-row.tr-ind {
      flex-direction: row;
      margin-top: -4px;
    }
    /* margin and risk bars */
    .tr-lims {
      border: 1px solid var(--line2);
      background: var(--sunk);
      padding: 9px 10px 8px;
    }
    .tr-lb {
      display: grid;
      grid-template-columns: 50px 1fr;
      align-items: center;
      column-gap: 8px;
      margin-bottom: 6px;
    }
    .tr-lk {
      font-family: var(--mono);
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
    }
    .tr-track {
      position: relative;
      height: 6px;
      background: rgba(255, 255, 255, 0.07);
      overflow: hidden;
    }
    .tr-track i {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 0;
      background: var(--accent);
      transition: width 0.2s;
    }
    .tr-track i.pv {
      background: repeating-linear-gradient(135deg, rgba(200, 245, 66, 0.85) 0 3px, rgba(200, 245, 66, 0.25) 3px 6px);
    }
    .tr-track i.warn {
      background: var(--warn);
    }
    .tr-track i.pv.warn {
      background: repeating-linear-gradient(135deg, rgba(245, 185, 66, 0.9) 0 3px, rgba(245, 185, 66, 0.25) 3px 6px);
    }
    .tr-track i.hot {
      background: var(--danger);
    }
    .tr-track i.pv.hot {
      background: repeating-linear-gradient(135deg, rgba(255, 90, 79, 0.9) 0 3px, rgba(255, 90, 79, 0.25) 3px 6px);
    }
    .tr-lt {
      grid-column: 2;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-family: var(--mono);
      font-size: 9.5px;
      color: var(--faint);
      margin-top: 4px;
      white-space: nowrap;
    }
    .tr-lt b {
      color: var(--text);
      font-weight: 600;
    }
    .tr-lt .ok {
      color: var(--accent);
    }
    .tr-lt .warn {
      color: var(--warn);
    }
    .tr-lt .hot {
      color: var(--danger);
    }
    .tr-tight {
      font-family: var(--mono);
      font-size: 9px;
      color: var(--faint);
      padding-left: 58px;
    }
    .tr-tight:empty {
      display: none;
    }
    /* the price ladder */
    .tr-lad {
      border: 1px solid var(--line2);
    }
    .tr-lh,
    .tr-lr {
      display: grid;
      grid-template-columns: 66px minmax(0, 1fr) 66px;
      align-items: center;
      padding: 4px 7px;
      font-family: var(--mono);
      font-size: 10.5px;
    }
    .tr-lh {
      font-size: 8.5px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
      background: var(--sunk);
      border-bottom: 1px solid var(--line2);
      padding: 5px 7px;
    }
    .tr-lh span:nth-child(2) {
      text-align: center;
      text-transform: none;
      letter-spacing: 0.04em;
    }
    .tr-lr {
      border-bottom: 1px dashed var(--line);
    }
    .tr-lr:last-child {
      border-bottom: none;
    }
    .tr-lr[hidden] {
      display: none;
    }
    .tr-sp,
    .tr-bp {
      color: var(--dim);
      white-space: nowrap;
    }
    .tr-bp,
    .tr-lh span:last-child {
      text-align: right;
    }
    .tr-mid {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      min-width: 0;
    }
    .tr-n {
      font-weight: 700;
      font-size: 10px;
      color: var(--accent);
      width: 30px;
    }
    .tr-n.sl {
      color: var(--danger);
    }
    .tr-in.tr-pt {
      width: 38px;
      padding: 3px 4px;
      font-size: 11px;
      text-align: right;
    }
    .tr-q {
      color: var(--faint);
      font-size: 9.5px;
      width: 34px;
      text-align: right;
      white-space: nowrap;
    }
    .tr-g {
      color: var(--accent);
      font-size: 10px;
      text-align: right;
      min-width: 50px;
      white-space: nowrap;
    }
    .tr-g.dn {
      color: var(--danger);
    }
    .tr-xs {
      width: 10px;
      flex: none;
    }
    .tr-en {
      background: rgba(255, 255, 255, 0.035);
    }
    .tr-lad.one .tr-lh,
    .tr-lad.one .tr-lr {
      grid-template-columns: 0 minmax(0, 1fr) 70px;
    }
    .tr-lad.one .tr-sp {
      visibility: hidden;
      overflow: hidden;
    }
    .tr-mk {
      background: var(--accent-dim);
    }
    .tr-mk .tr-mid,
    .tr-mk .tr-bp {
      color: var(--accent);
      font-weight: 600;
    }
    .tr-mk .tr-mid {
      font-size: 9.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .tr-en .tr-mid {
      color: var(--text);
      font-weight: 600;
      font-size: 9.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .tr-en .tr-sp,
    .tr-en .tr-bp {
      color: var(--text);
    }
    .tr-fl .tr-mid,
    .tr-ps .tr-mid {
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
    }
    .tr-fl .tr-sp,
    .tr-fl .tr-bp {
      color: var(--danger);
    }
    .tr-ps .tr-sp,
    .tr-ps .tr-bp {
      color: var(--accent);
    }
    .tr-x {
      background: none;
      border: none;
      color: var(--faint);
      cursor: pointer;
      width: 10px;
      font-size: 13px;
      line-height: 1;
      padding: 0;
    }
    .tr-x:hover {
      color: var(--danger);
    }
    .tr-x:disabled {
      opacity: 0.25;
      cursor: default;
    }
    .tr-add {
      align-self: flex-start;
      background: none;
      border: 1px dashed var(--line2);
      color: var(--dim);
      padding: 5px 10px;
      font-family: var(--mono);
      font-size: 10px;
      cursor: pointer;
    }
    .tr-add:hover {
      color: var(--text);
      border-color: var(--text);
    }
    .tr-be {
      margin-top: 2px;
    }
    .tr-sum {
      font-family: var(--mono);
      font-size: 10.5px;
      color: var(--dim);
      padding-top: 10px;
      border-top: 1px dashed var(--line);
    }
    .tr-sum b {
      color: var(--text);
      font-family: var(--mono);
      font-weight: 600;
    }
    .tr-err {
      font-size: 10.5px;
      color: var(--warn);
    }
    .tr-err:empty {
      display: none;
    }
    .tr-who {
      font-size: 10px;
      color: var(--faint);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tr-who:empty {
      display: none;
    }
    .tr-warn {
      font-size: 10.5px;
      line-height: 1.5;
      color: var(--warn);
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .tr-warn:empty {
      display: none;
    }
    .tr-lim {
      font-size: 10.5px;
      color: var(--faint);
      line-height: 1.45;
    }
    .tr-lim:empty {
      display: none;
    }
    .tr-lim.bad {
      color: var(--warn);
    }
    .tr-block {
      color: var(--danger);
      background: var(--danger-dim);
      border: 1px solid var(--danger-line);
      padding: 7px 9px;
    }
    .tr-fixes {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }
    .tr-block .tr-usemax {
      margin-left: 0;
    }
    .tr-usemax {
      cursor: pointer;
      font-family: var(--mono);
      font-size: 10px;
      font-weight: 600;
      padding: 2px 7px;
      margin-left: 4px;
      border: 1px solid var(--warn-line);
      background: var(--warn-dim);
      color: var(--warn);
    }
    .tr-preview b.tr-fail {
      color: var(--danger);
    }
    .tr-preview b.tr-pass {
      color: var(--accent);
    }
    .tr-note {
      font-family: var(--sans);
      margin-top: 2px;
    }
    .tr-go {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .tr-buy,
    .tr-sell {
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      height: 42px;
      padding: 0 12px;
      color: var(--ink);
      transition: 0.12s;
      white-space: nowrap;
    }
    .tr-buy {
      border: 1px solid var(--accent);
      background: var(--accent);
    }
    .tr-sell {
      border: 1px solid var(--danger);
      background: var(--danger);
    }
    .tr-buy:hover:not(:disabled),
    .tr-sell:hover:not(:disabled) {
      filter: brightness(1.08);
    }
    .tr-buy:disabled,
    .tr-sell:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .tr-go:has(> [hidden]) {
      grid-template-columns: 1fr;
    }
    .tr-go[hidden] {
      display: none;
    }
    .tr-lbuy,
    .tr-lsell {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-family: var(--mono);
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 8px;
      background: none;
      transition: 0.12s;
    }
    .tr-lbuy {
      border: 1px solid var(--accent);
      color: var(--accent);
    }
    .tr-lsell {
      border: 1px solid var(--danger);
      color: var(--danger);
    }
    .tr-lbuy:hover:not(:disabled) {
      background: var(--accent-dim);
    }
    .tr-lsell:hover:not(:disabled) {
      background: var(--danger-dim);
    }
    .tr-lbuy:disabled,
    .tr-lsell:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .tr-pick {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tr-pick[hidden] {
      display: none;
    }
    .tr-pickbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 9px;
      border: 1px dashed var(--accent);
      background: var(--accent-dim);
      color: var(--accent);
      font-family: var(--mono);
      font-size: 10px;
    }
    .tr-pickbar .bad {
      color: var(--warn);
    }
    .tr-esc {
      margin-left: auto;
      color: var(--faint);
    }
    .tr-pickrow {
      display: grid;
      grid-template-columns: 84px 1fr auto;
      gap: 6px;
    }
    .tr-pickrow .tr-in {
      width: auto;
    }
    .tr-place,
    .tr-pcancel {
      cursor: pointer;
      font-family: var(--mono);
      font-weight: 700;
      font-size: 10.5px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      padding: 8px 10px;
      white-space: nowrap;
    }
    .tr-place {
      border: 1px solid var(--accent);
      background: var(--accent);
      color: var(--ink);
    }
    .tr-place.short {
      border-color: var(--danger);
      background: var(--danger);
    }
    .tr-place:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .tr-pcancel {
      border: 1px solid var(--line2);
      background: none;
      color: var(--dim);
    }
    .tr-pcancel:hover {
      color: var(--text);
      border-color: var(--text);
    }
    /* in a trade: the position, with Breakeven and Close, right above the add button */
    .tr-pos {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tr-pos[hidden] {
      display: none;
    }
    .tr-posbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 9px;
      border: 1px solid var(--line2);
      border-left: 2px solid var(--accent);
      background: var(--elev);
      font-family: var(--mono);
      font-size: 10.5px;
      white-space: nowrap;
      overflow: hidden;
    }
    .tr-side {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 5px;
      color: var(--ink);
      background: var(--accent);
    }
    .tr-side.short {
      background: var(--danger);
    }
    .tr-pq {
      font-weight: 600;
      color: var(--text);
    }
    .tr-pa {
      color: var(--faint);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tr-ppl {
      margin-left: auto;
      font-weight: 700;
      font-size: 12px;
    }
    .tr-ppl.pos {
      color: var(--accent);
    }
    .tr-ppl.neg {
      color: var(--danger);
    }
    .tr-addh {
      display: flex;
      justify-content: space-between;
      font-family: var(--mono);
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--faint);
      margin-top: 2px;
    }
    .tr-addh span + span {
      text-transform: none;
      letter-spacing: 0;
    }
    .tr-chips {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
    }
    .tr-chips:empty {
      display: none;
    }
    .tr-chip {
      cursor: pointer;
      border: 1px solid var(--line2);
      background: none;
      padding: 4px 0 3px;
      font-family: var(--mono);
      line-height: 1.25;
      color: var(--text);
    }
    .tr-chip b {
      display: block;
      font-size: 11px;
    }
    .tr-chip span {
      font-size: 9px;
      color: var(--faint);
      white-space: nowrap;
    }
    .tr-chip:hover:not(:disabled) {
      border-color: var(--accent);
    }
    .tr-chip.on {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--ink);
    }
    .tr-chip.on span {
      color: var(--ink);
    }
    .tr-chip.no {
      border-style: dashed;
      opacity: 0.55;
      cursor: not-allowed;
    }
    .tr-chip.no b {
      color: var(--faint);
      text-decoration: line-through;
    }
    .tr-chip.no span {
      color: var(--danger);
    }
    .tr-addpv {
      font-family: var(--mono);
      font-size: 9.5px;
      color: var(--dim);
      border-left: 2px solid var(--accent);
      padding: 2px 0 2px 7px;
      line-height: 1.45;
    }
    .tr-redbtn {
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      height: 36px;
      padding: 0 12px;
      border: 1px solid var(--line2);
      background: var(--elev);
      color: var(--text);
      transition: 0.12s;
    }
    .tr-redbtn:hover:not(:disabled) {
      border-color: var(--text);
    }
    .tr-redbtn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .tr-bebtn,
    .tr-close {
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      height: 36px;
      padding: 0 10px;
      transition: 0.12s;
      white-space: nowrap;
    }
    .tr-legs {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
    }
    .tr-legbtn {
      flex: 1;
      padding: 7px 8px;
      font-size: 12.5px;
      font-weight: 500;
      border: 1px solid var(--line2);
      background: none;
      color: var(--dim);
      cursor: pointer;
    }
    .tr-legbtn:hover:not(:disabled) {
      color: var(--text);
      border-color: var(--dim);
    }
    .tr-legbtn.warn {
      color: var(--warn);
      border-color: var(--warn);
    }
    .tr-legbtn.on {
      color: var(--ink);
      background: var(--text);
      border-color: var(--text);
    }
    .tr-legbtn[hidden] {
      display: none;
    }
    .tr-legbtn:disabled {
      opacity: 0.45;
      cursor: default;
    }
    .tr-bebtn {
      border: 1px solid var(--line2);
      background: var(--s2);
      color: var(--text);
    }
    .tr-close {
      border: 1px solid var(--danger);
      background: var(--danger);
      color: var(--ink);
    }
    .tr-bebtn:hover:not(:disabled),
    .tr-close:hover:not(:disabled) {
      filter: brightness(1.08);
    }
    .tr-bebtn:disabled,
    .tr-close:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .tr-plans {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tr-plans:empty {
      display: none;
    }
    .tr-plan {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 10.5px;
      color: var(--dim);
      padding: 7px 9px;
      border: 1px solid var(--line2);
      border-left: 2px solid var(--accent);
      background: var(--elev);
    }
    .tr-plan b {
      color: var(--text);
    }
    .tr-preview {
      font-size: 10.5px;
      color: var(--faint);
      line-height: 1.5;
    }
    .tr-preview b {
      color: var(--dim);
      font-weight: 500;
    }
    .tr-pl {
      display: inline-block;
      width: 30px;
      color: var(--dim);
    }

    /* P&L: today on top, what you keep, each account (today, then equity and total since start), claims */
    .summary {
      padding: 14px;
      display: grid;
      gap: 12px;
      align-content: start;
    }
    .mono {
      font-family: var(--mono);
    }
    .sum-hero {
      position: relative;
    }
    .sum-share {
      position: absolute;
      right: 0;
      top: 2px;
    }
    .sum-total {
      font-size: 38px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: -0.03em;
      font-stretch: condensed;
      padding-right: 84px;
    }
    .sum-total.pos {
      color: var(--accent);
    }
    .sum-total.neg {
      color: var(--danger);
    }
    .sum-day {
      font-size: 12px;
      color: var(--dim);
      margin-top: 8px;
      line-height: 1.5;
    }
    .sum-day .mono,
    .sum-sub .mono {
      color: var(--text);
    }
    .sum-sub {
      font-size: 11.5px;
      color: var(--faint);
      margin-top: -4px;
    }
    .sum-keep {
      background: var(--s1);
      padding: 10px 12px;
      font-size: 12px;
      color: var(--dim);
    }
    .sum-keep-v {
      font-family: var(--mono);
      font-weight: 600;
      color: var(--text);
    }
    .sum-list {
      display: flex;
      flex-direction: column;
    }
    .sum-row {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr) auto;
      gap: 10px;
      align-items: center;
      padding: 7px 0;
      border-bottom: 1px solid var(--hair);
    }
    .sum-row:last-child {
      border-bottom: 0;
    }
    .sum-left,
    .sum-right {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 2px;
    }
    .sum-right {
      align-items: flex-end;
    }
    .sum-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sum-k {
      font-size: 11px;
      color: var(--faint);
      font-family: var(--mono);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sum-td {
      font-family: var(--mono);
      font-weight: 600;
      font-size: 13px;
    }
    .sum-td:empty {
      display: none;
    }
    .sum-tot {
      font-family: var(--mono);
      font-size: 10.5px;
      color: var(--faint);
      white-space: nowrap;
    }
    .sum-pnl {
      font-weight: 500;
    }
    .sum-row .pos,
    .sum-td.pos {
      color: var(--accent);
    }
    .sum-row .neg,
    .sum-td.neg {
      color: var(--danger);
    }
    .sum-tot .sum-pnl.pos,
    .sum-tot .sum-pnl.neg {
      color: var(--dim);
    }
    .sum-note {
      font-size: 11.5px;
      color: var(--faint);
      line-height: 1.5;
    }
    .sum-note.warn {
      color: var(--warn); /* why Claim all profit is off while copying: easy to miss in grey */
    }
    .claim {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
    }
    .claim-go {
      align-self: stretch;
      justify-content: center;
      height: 34px;
      font-size: 13px;
    }
    .claim-go:disabled {
      color: var(--faint);
      cursor: not-allowed;
    }
    .claim-h {
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--faint);
    }
    .claim-row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 5px 0;
      border-bottom: 1px solid var(--hair);
      font-family: var(--mono);
      font-size: 11px;
    }
    .claim-row .pos,
    .claim .pos {
      color: var(--accent);
    }
    .claim-row .neg,
    .claim .neg {
      color: var(--danger);
    }
    .claim-row .dim {
      color: var(--faint);
      text-align: right;
    }
    .claim-btns {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    button:focus-visible,
    .tr-in:focus-visible,
    .health:focus-visible,
    .logh:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }
    /* ── Trade tab, compact (v0.32.1) ── */
    .tr-top {
      align-items: center;
    }
    .tr-sym .chip {
      font-size: 9px;
      margin-left: 2px;
    }
    .tr-px {
      font-size: 18px;
    }
    .tr-lims {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 7px 9px 8px;
    }
    .tr-lims[hidden],
    .tr-pacts[hidden],
    .tr-setup[hidden],
    .tr-poscard[hidden] {
      display: none;
    }
    .tr-lims .tr-lb {
      display: block;
      margin: 0;
      min-width: 0;
    }
    .tr-ln {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 5px;
      white-space: nowrap;
    }
    .tr-ln .tr-lt {
      display: block;
      margin: 0 0 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 9.5px;
    }
    .tr-lt b.warn {
      color: var(--warn);
    }
    .tr-lt b.hot {
      color: var(--danger);
    }
    .tr-tight,
    .tr-sum {
      display: none;
    }
    .tr-setup {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .tr-sizeq {
      margin-left: auto;
      font-family: var(--mono);
      font-size: 10.5px;
      color: var(--text);
      white-space: nowrap;
    }
    .tr-ind:has(.tr-calc:empty):has(.tr-lim.quiet),
    .tr-ind:has(.tr-calc:empty):has(.tr-lim:empty) {
      display: none;
    }
    .tr-lim.quiet {
      display: none;
    }
    .tr-be {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-left: auto;
      font-family: var(--mono);
      font-size: 10px;
      color: var(--faint);
      white-space: nowrap;
    }
    .tr-be .tr-in.sm {
      width: 38px;
      padding: 3px 5px;
    }
    #tr-lhm {
      white-space: nowrap;
    }
    /* in a trade: the position card */
    .tr-poscard {
      border: 1px solid var(--line2);
      border-left: 2px solid var(--accent);
      background: var(--elev);
      padding: 10px 11px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .tr-poscard .tr-posbar {
      border: none;
      background: none;
      padding: 0;
    }
    .tr-poscard .tr-pq {
      font-size: 14px;
      font-family: var(--sans);
    }
    .tr-poscard .tr-ppl {
      font-size: 19px;
    }
    .tr-pmeta {
      display: flex;
      justify-content: space-between;
      font-family: var(--mono);
      font-size: 10px;
      color: var(--faint);
    }
    .tr-lvls {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 7px;
    }
    .tr-lv {
      font-family: var(--mono);
      font-size: 9.5px;
      border: 1px solid var(--line2);
      padding: 2px 5px;
      white-space: nowrap;
    }
    .tr-lv b {
      font-weight: 600;
    }
    .tr-lv i {
      font-style: normal;
      color: var(--faint);
      margin-left: 4px;
    }
    .tr-lv.sl {
      color: var(--danger);
      border-color: var(--danger-line);
    }
    .tr-lv.tp {
      color: var(--accent);
      border-color: var(--accent-line);
    }
    .tr-lv.none {
      color: var(--warn);
    }
    .tr-prisk {
      margin-top: 8px;
    }
    .tr-pn {
      display: flex;
      justify-content: space-between;
      font-family: var(--mono);
      font-size: 9.5px;
      color: var(--faint);
      margin-bottom: 4px;
    }
    .tr-pn > span:first-child {
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .tr-pn b {
      color: var(--text);
    }
    .tr-pn .ok {
      color: var(--accent);
    }
    .tr-pn .warn {
      color: var(--warn);
    }
    .tr-pacts {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .tr-addrow {
      display: grid;
      grid-template-columns: 34px 1fr;
      align-items: center;
      gap: 6px;
    }
    .tr-addrow .tr-chips {
      gap: 4px;
    }
    .tr-addpv {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      border-left: none;
      padding: 0;
      font-size: 10px;
      height: 15px;
      white-space: nowrap;
    }
    .tr-addpv span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tr-addpv .warn {
      color: var(--warn);
    }
    .tr-addpv .hot {
      color: var(--danger);
    }
    .tr-addpv b {
      color: var(--text);
    }
    /* ── Trade tab, Focus (v0.38): order switch, units, one-sided ladder, folds, the position card's bracket ── */
    .tr-f {
      grid-template-columns: 52px 1fr;
    }
    .tr-k {
      font-size: 10px;
      letter-spacing: 0.12em;
    }
    .tr-in {
      height: 30px;
      font-size: 12.5px;
    }
    .tr-in.tr-pt,
    .tr-in.sm {
      height: auto;
    }
    .tr-u {
      font-size: 10.5px;
      white-space: nowrap;
    }
    .tr-lad {
      border-color: var(--hair);
    }
    .tr-lh {
      background: var(--s1);
      border-bottom-color: var(--hair);
      padding: 3px 7px;
    }
    .tr-lad.side-long:not(.one) .tr-lr,
    .tr-lad.side-long:not(.one) .tr-lh,
    .tr-lad.side-short:not(.one) .tr-lr,
    .tr-lad.side-short:not(.one) .tr-lh {
      grid-template-columns: minmax(0, 1fr) 78px;
    }
    .tr-lad.side-long:not(.one) .tr-sp,
    .tr-lad.side-short:not(.one) .tr-bp {
      display: none;
    }
    .tr-lad.side-short:not(.one) .tr-sp {
      order: 3;
      text-align: right;
    }
    .tr-lad:not(.one) .tr-lh .tr-flip {
      order: 0;
      text-transform: none;
      letter-spacing: 0;
      font-family: var(--sans);
      font-size: 11.5px;
      font-weight: 500;
    }
    .tr-flip.long {
      color: var(--accent);
    }
    .tr-flip.short {
      color: var(--danger);
    }
    .tr-lad:not(.one) .tr-lh {
      grid-template-columns: auto minmax(0, 1fr) 78px !important;
      column-gap: 8px;
    }
    .tr-lad:not(.one) #tr-lhm {
      text-align: center;
    }
    .tr-lr {
      border-bottom-color: var(--hair);
      border-bottom-style: solid;
    }
    .tr-en {
      background: var(--s1);
    }
    .tr-fold {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 30px;
      font-size: 12px;
      color: var(--dim);
      border-bottom: 1px solid var(--hair);
    }
    .tr-fold > span:first-child {
      flex: 1;
      min-width: 0;
    }
    .tr-foldbox {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tr-foldbox[hidden] {
      display: none;
    }
    .tr-foldbox .tr-row {
      flex-wrap: wrap;
    }
    .tr-disc {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 34px;
      padding: 0;
      background: none;
      border: none;
      border-top: 1px solid var(--hair);
      border-bottom: 1px solid var(--hair);
      color: var(--dim);
      font-size: 12.5px;
      cursor: pointer;
    }
    .tr-disc:hover {
      color: var(--text);
    }
    .tr-disc svg {
      transition: transform 0.12s;
    }
    .tr-disc.open svg {
      transform: rotate(90deg);
    }
    .tr-addbox {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .tr-addbox[hidden] {
      display: none;
    }
    .tr-copies {
      font-size: 11.5px;
      color: var(--faint);
      text-align: center;
    }
    .tr-copies:empty {
      display: none;
    }
    .tr-who {
      text-align: center;
      font-size: 11.5px;
    }
    .tr-poscard {
      border: none;
      border-left: none;
      background: var(--s1);
      padding: 12px;
      gap: 6px;
    }
    .tr-lvls {
      display: none;
    }
    .tr-side {
      font-size: 10px;
      padding: 3px 6px;
    }
    .tr-poscard .tr-pq {
      font-size: 15px;
      font-weight: 600;
    }
    .tr-poscard .tr-ppl {
      font-size: 20px;
    }
    .tr-pmeta {
      font-size: 11px;
      color: var(--dim);
      gap: 10px;
      flex-wrap: wrap;
    }
    /* the bracket bar */
    .bk {
      position: relative;
      height: 46px;
      margin: 6px 4px 0;
    }
    .bk-tr,
    .bk-r,
    .bk-g,
    .bk-l {
      position: absolute;
      top: 12px;
      height: 4px;
    }
    .bk-tr {
      left: 0;
      right: 0;
      background: var(--s3);
    }
    .bk-r {
      background: var(--danger);
      opacity: 0.45;
    }
    .bk-g {
      background: var(--accent);
    }
    .bk-l {
      background: var(--danger);
    }
    .bk-t {
      position: absolute;
      top: 6px;
      width: 2px;
      height: 16px;
      margin-left: -1px;
      background: var(--dim);
    }
    .bk-t.bad {
      background: var(--danger);
    }
    .bk-t.up {
      background: var(--accent);
      opacity: 0.7;
    }
    .bk-now {
      position: absolute;
      top: 9px;
      width: 9px;
      height: 9px;
      margin-left: -4.5px;
      transform: rotate(45deg);
      background: var(--text);
      border: 2px solid var(--s1);
    }
    .bk-lb {
      position: absolute;
      top: 26px;
      transform: translateX(-50%);
      font-family: var(--mono);
      font-size: 9.5px;
      line-height: 1.25;
      color: var(--faint);
      text-align: center;
      white-space: nowrap;
    }
    .bk-lb b {
      display: block;
      font-weight: 600;
      color: var(--dim);
      letter-spacing: 0.06em;
    }
    .bk-lb b.bad {
      color: var(--danger);
    }
    .bk-lb b.up {
      color: var(--accent);
    }
    .bk-lb.l {
      transform: none;
      text-align: left;
    }
    .bk-lb.r {
      transform: translateX(-100%);
      text-align: right;
    }

    /* Share */
    .share {
      padding: 12px 14px 14px;
      display: grid;
      gap: 12px;
      align-content: start;
    }
    .prev {
      box-shadow: 0 0 0 1px var(--line);
      background: #0c0c0d;
      line-height: 0;
    }
    .prev canvas {
      display: block;
      width: 100%;
      height: auto;
    }
    .prev canvas[hidden] {
      display: none;
    }
    /* Payouts with none paid yet: a line in place of the picture */
    .sh-empty {
      aspect-ratio: 1;
      display: grid;
      place-content: center;
      gap: 6px;
      text-align: center;
      padding: 0 28px;
      color: var(--muted);
      font-size: 12.5px;
      line-height: 1.45;
    }
    .sh-empty[hidden] {
      display: none;
    }
    .sh-empty b {
      color: var(--text);
      font-weight: 500;
      font-size: 13px;
    }
    .sh-name {
      width: 116px;
      flex: none;
    }
    /* Trades on the card: a dropdown drawn like the name box, its list the panel's own menu */
    .opt[hidden] {
      display: none;
    }
    .sh-dd {
      position: relative;
      flex: none;
    }
    .sh-ddb {
      width: 148px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0 8px 0 10px;
      background: var(--sunk);
      border: 1px solid var(--line2);
      color: var(--text);
      font-size: 12.5px;
      cursor: pointer;
    }
    .sh-ddb svg {
      color: var(--faint);
      flex: none;
    }
    .sh-ddb[aria-expanded='true'] {
      border-color: var(--accent);
    }
    .sh-ddb[aria-expanded='true'] svg {
      transform: rotate(180deg);
    }
    .sh-ddm {
      top: 34px;
      right: 0;
      width: 196px;
    }
    .sh-btns {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
    }
    .sh-btns .ghostbtn {
      height: 34px;
    }
    .share .tabseg .tab {
      padding: 5px 4px;
    }
    .share .tabseg[hidden] {
      display: none;
    }
    #sh-sort {
      margin-top: -4px;
    }
    #sh-sort .tab {
      font-size: 12px;
      padding: 4px;
    }
    .sh-list {
      max-height: 210px;
      overflow: auto;
      display: grid;
      border: 1px solid var(--hair);
    }
    .sh-list[hidden] {
      display: none;
    }
    .sh-list .hint {
      padding: 10px;
    }
    .sh-tr {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto auto;
      gap: 8px;
      align-items: center;
      min-height: 34px;
      padding: 0 10px;
      background: none;
      border: none;
      border-bottom: 1px solid var(--hair);
      color: var(--text);
      font-size: 12px;
      text-align: left;
      cursor: pointer;
    }
    .sh-tr:hover {
      background: var(--s1);
    }
    .sh-tr.on {
      background: var(--s3);
    }
    .sh-side {
      font-family: var(--mono);
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 2px 5px;
      color: var(--ink);
      background: var(--text);
    }
    .sh-side.long {
      background: var(--accent);
    }
    .sh-what {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sh-what small {
      margin-left: 6px;
      font-family: var(--mono);
      color: var(--faint);
    }
    .sh-when {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--faint);
      white-space: nowrap;
    }
    .sh-pnl {
      font-family: var(--mono);
      font-weight: 600;
      color: var(--accent);
      white-space: nowrap;
    }
    .armbtn.done {
      background: var(--accent-dim);
      border-color: var(--accent-line);
      color: var(--accent);
    }
    .collapsed .body,
    .collapsed .tabs,
    .collapsed .status,
    .collapsed .pausebar,
    .collapsed .noticebar,
    .collapsed .alertzone,
    .collapsed .logwrap,
    .collapsed .reportbar,
    .collapsed .grip,
    .collapsed .menu,
    .collapsed .scard,
    .collapsed .spacer,
    .collapsed .hdr .iconbtn,
    .collapsed .hdr .sep,
    .collapsed .hdr .title,
    .collapsed .brand svg + svg {
      display: none !important;
    }
    .panel.narrow .hdr .title,
    .panel.narrow .hdr .sep,
    .panel.narrow .codebtn .off {
      display: none;
    }
    /* a chart menu or dialog (drawn inside the chart's frame, which can't rise above the panel) is open over it */
    .panel.aside {
      opacity: 0;
      pointer-events: none;
    }
    /* minimised: the pill. The mark, the state, one number and one button; press and move drags it, a click opens it. */
    .panel.collapsed {
      width: auto;
      max-height: none;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    .collapsed .hdr {
      height: 40px;
      gap: 10px;
      padding: 0 6px 0 12px;
      border-bottom: none;
      cursor: pointer;
    }
    .collapsed .pill {
      background: none;
      padding: 0;
      font-size: 13px;
      color: var(--text);
    }
    .collapsed .pill.warn {
      color: var(--warn);
    }
    .collapsed .pill.bad {
      color: var(--danger);
    }
    .collapsed .pillv:not(:empty) {
      display: block;
      font-family: var(--mono);
      font-size: 13px;
      font-weight: 600;
    }
    .pillv.pos {
      color: var(--accent);
    }
    .pillv.neg {
      color: var(--danger);
    }
    .collapsed .pillbtn:not([hidden]) {
      display: block;
      cursor: pointer;
      height: 28px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid var(--line2);
      background: var(--s2);
      color: var(--text);
    }
    .collapsed .pillbtn:not([hidden]):hover {
      background: var(--s3);
    }
    .collapsed .pillbtn.flatten {
      background: none;
      border-color: var(--danger-line);
      color: var(--danger);
    }
    .collapsed .pillbtn.start {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--ink);
      font-weight: 600;
    }
    .collapsed .hdr:focus-visible {
      outline: 1px solid var(--accent);
      outline-offset: -1px;
    }
    .panel.collapsed.attn-red {
      border-color: var(--danger-line);
    }
    .panel.collapsed.attn-amber {
      border-color: var(--warn-line);
    }
    /* ── v0.39: bigger stop and target numbers; the stop and targets are optional ── */
    .tr-lh,
    .tr-lr {
      font-size: 12px;
    }
    .tr-in.tr-pt {
      width: 46px;
      font-size: 13.5px;
      padding: 3px 5px;
    }
    .tr-n {
      font-size: 11px;
    }
    .tr-q {
      font-size: 10.5px;
    }
    .tr-g {
      font-size: 11.5px;
    }
    .tr-mk .tr-mid,
    .tr-en .tr-mid {
      font-size: 10.5px;
    }
    .tr-fl .tr-mid,
    .tr-ps .tr-mid {
      font-size: 10px;
    }
    .tr-nostop,
    .tr-none {
      color: var(--faint);
      font-family: var(--sans);
      font-size: 11.5px;
      white-space: nowrap;
    }
    .tr-nostop {
      display: none;
      align-items: center;
      gap: 8px;
    }
    .tr-slr.off .tr-nostop {
      display: inline-flex;
    }
    .tr-slr.off .tr-in,
    .tr-slr.off .tr-q,
    .tr-slr.off .tr-g,
    .tr-slr.off .tr-x {
      display: none;
    }
    .tr-slr.off .tr-n.sl {
      opacity: 0.55;
    }
    .seg button.off {
      opacity: 0.35;
      cursor: not-allowed;
    }
    /* long labels shrink instead of pushing the panel sideways */
    .tr-f {
      grid-template-columns: 52px minmax(0, 1fr);
    }
    .tr-f > .tr-row {
      min-width: 0;
    }
    .tr-pickrow {
      grid-template-columns: 84px minmax(0, 1fr) auto;
    }
    .tr-place,
    .tr-sizeq {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tr-f[hidden] {
      display: none;
    }
    .tr-sliptxt {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: var(--mono);
      font-size: 10.5px;
    }
    .tr-notgt .tr-mid {
      gap: 8px;
    }
    .tr-q {
      width: auto;
      min-width: 34px;
      margin-right: 3px;
    }
  `;

  // STRATUH logo (brand pack, 2026-10-09): the five-bar profile mark, each bar over a muted echo of itself with a soft
  // shadow where they overlap (lime gradient on the point of control), and the STRATUH wordmark (Instrument Sans 700,
  // width 75) outlined as one path by tools/wordmark.mjs, so nothing is downloaded. `h` is the mark's height in px.
  const LOG_OPEN_KEY = 'vc-log-open';
  const MARK_BARS = [
    [8, '#77777d', '#4a4a50'],
    [12.8, '#f0f0f1', '#8a8a90'],
    [17.6, 'poc', '#6b8e1a'],
    [12, '#f0f0f1', '#8a8a90'],
    [6.4, '#77777d', '#4a4a50'],
  ];
  const markSvg = (h, id = 'vc-poc') =>
    `<svg width="${+((h * 22.4) / 24).toFixed(2)}" height="${h}" viewBox="-2.8 0 22.4 24" aria-hidden="true"><defs>` +
    `<linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#9fe02f"/><stop offset="1" stop-color="#e4ff7a"/></linearGradient>` +
    `<linearGradient id="${id}-s" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity=".073"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>` +
    MARK_BARS.map(([w, fill, echo], i) => {
      const y = +(1 + i * 4.65).toFixed(2);
      return `<rect x="-1.8" y="${y}" width="3.8" height="3.4" fill="${echo}"/><rect x="-0.7" y="${y}" width="1.7" height="3.4" fill="url(#${id}-s)"/><rect x="1" y="${y}" width="${w}" height="3.4" fill="${fill === 'poc' ? `url(#${id})` : fill}"/>`;
    }).join('') +
    '</svg>';
  const WORDMARK_D =
    'M232 10Q129 10 76.5 -53.5Q24 -117 24 -230L157 -230Q157 -166 179 -133Q201 -100 238 -100Q265 -100 282 -117.5Q299 -135 299 -167Q299 -196 283 -224Q267 -252 231 -279L157 -335Q100 -379 74 -429.5Q48 -480 48 -541Q48 -601 70.5 -643.5Q93 -686 135.5 -708Q178 -730 237 -730Q329 -730 377 -675Q425 -620 425 -514L295 -514Q295 -570 279 -595Q263 -620 234 -620Q210 -620 195 -604.5Q180 -589 180 -557Q180 -526 196.5 -501Q213 -476 246 -450L319 -394Q381 -347 406 -294Q431 -241 431 -181Q431 -90 377.5 -40Q324 10 232 10ZM574 0L574 -610L440 -610L440 -720L850 -720L850 -610L716 -610L716 0ZM897 0L897 -720L1078 -720Q1140 -720 1186.5 -693Q1233 -666 1259 -618.5Q1285 -571 1285 -508Q1285 -446 1259.5 -399Q1234 -352 1187.5 -325.5Q1141 -299 1078 -299L1007 -299L1007 -401L1071 -401Q1106 -401 1126.5 -429Q1147 -457 1147 -506Q1147 -555 1126.5 -582.5Q1106 -610 1071 -610L1039 -610L1039 0ZM1159 0L1019 -374L1154 -374L1313 0ZM1317 0L1458 -720L1563 -720L1450 0ZM1640 0L1527 -720L1642 -720L1783 0ZM1415 -265L1685 -265L1685 -155L1415 -155ZM1883 0L1883 -610L1749 -610L1749 -720L2159 -720L2159 -610L2025 -610L2025 0ZM2406 10Q2306 10 2254.5 -48.5Q2203 -107 2203 -207L2203 -720L2345 -720L2345 -174Q2345 -138 2361.5 -120Q2378 -102 2406 -102Q2435 -102 2451 -120Q2467 -138 2467 -174L2467 -720L2609 -720L2609 -207Q2609 -107 2557.5 -48.5Q2506 10 2406 10ZM2695 0L2695 -720L2837 -720L2837 0ZM2967 0L2967 -720L3109 -720L3109 0ZM2767 -430L3037 -430L3037 -320L2767 -320Z';
  // `cap` is the capitals' height in px; the box takes the S's overshoot above and below
  const wordmarkSvg = (cap) =>
    `<svg width="${+((cap * 3159) / 720).toFixed(2)}" height="${+((cap * 755) / 720).toFixed(2)}" viewBox="0 -740 3159 755" aria-hidden="true"><path fill="#f0f0f1" d="${WORDMARK_D}"/></svg>`;
  // In a lockup the mark's bars stand 1.2 × the capitals (bars fill 22 of the mark's 24 units), centred on them
  const BRAND_CAP = 11;
  const BRAND_SVG = markSvg(+((BRAND_CAP * 1.2 * 24) / 22).toFixed(2)) + wordmarkSvg(BRAND_CAP);

  // Line icons (14 px, the text colour), drawn inline like the logo.
  const ico = (d, w = 14) =>
    `<svg width="${w}" height="${w}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    more: ico(
      '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
    ),
    min: ico('<path d="M6 12h12"/>'),
    left: ico('<path d="M15 5l-7 7 7 7"/>'),
    right: ico('<path d="M9 5l7 7-7 7"/>', 12),
    down: ico('<path d="M5 9l7 7 7-7"/>', 12),
    check: ico('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    dock: ico('<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18"/>'),
    refresh: ico('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'),
    gear: ico('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
    look: ico('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor"/>'),
    help: ico(
      '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7M12 17h.01"/>',
    ),
    alert: ico('<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/>'),
    play: ico('<path d="M7 5l12 7-12 7z"/>', 12),
    pause: ico('<path d="M8 5v14M16 5v14"/>', 12),
    share: ico('<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v7h14v-7"/>', 13),
    ext: ico('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>', 12),
    copy: ico('<rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/>', 13),
    save: ico('<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>', 13),
  };

  function buildPanel() {
    const host = document.createElement('div');
    host.id = 'vc-host';
    (document.body || document.documentElement).appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${CSS}</style>
      <div class="panel">
        <div class="hdr">
          <button class="iconbtn back" data-act="back" title="Back" aria-label="Back">${ICON.left}</button><span class="sheett" id="sheett"></span>
          <span class="brand" role="img" aria-label="STRATUH">${BRAND_SVG}</span><span class="sep"></span><span class="title">Copier</span>
          <span class="spacer"></span>
          <span class="pill" id="armtag"><i class="pdot"></i><span class="ptext">Not copying</span></span>
          <span class="cx-pms" id="cx-pms"></span><span class="pillv" id="pillv"></span>
          <button class="pillbtn" data-act="pillgo" hidden></button>
          <button class="iconbtn" data-act="menu" title="More" aria-label="More" aria-haspopup="menu" aria-expanded="false">${ICON.more}</button>
          <button class="iconbtn" data-act="collapse" title="Minimise" aria-label="Minimise" aria-expanded="true">${ICON.min}</button>
        </div>
        <div class="menu" role="menu" hidden>
          <button class="mi" role="menuitemcheckbox" data-act="dock" aria-checked="true">${ICON.dock}<span class="mt">Docked on chart</span><span class="mk">${ICON.check}</span></button>
          <button class="mi" role="menuitem" data-act="refresh">${ICON.refresh}<span class="mt">Reload accounts</span></button>
          <div class="mhr"></div>
          <button class="mi" role="menuitem" data-tab="settings">${ICON.gear}<span class="mt">Settings</span></button>
          <button class="mi" role="menuitem" data-tab="appearance">${ICON.look}<span class="mt">Appearance</span></button>
          <button class="mi" role="menuitem" data-tab="support">${ICON.help}<span class="mt">Help and rules</span></button>
          <button class="mi" role="menuitem" data-act="report">${ICON.alert}<span class="mt">Report a problem</span></button>
        </div>
        <div class="pausebar" role="status" hidden></div>
        <div class="noticebar" role="status" hidden></div>
        <div class="status">
          <div class="say" id="st-say">Loading your accounts…</div>
          <div class="ssub" id="st-sub"></div>
          <div class="ctl">
            <button class="armbtn" data-act="arm" disabled>Start copying</button>
            <button class="dangerbtn" data-act="flatall" title="Instantly closes every position and cancels every order on every account. No confirmation. Copying keeps running.">Flatten all</button>
          </div>
        </div>
        <div class="tabs" role="tablist"><div class="tabseg">
          <button class="tab" role="tab" data-tab="accounts">Copier</button>
          <button class="tab" role="tab" data-tab="trade" title="Order panel: stop &amp; targets in points">Trade</button>
          <button class="tab" role="tab" data-tab="summary" title="Profit and loss per account">P&amp;L</button>
        </div></div>
        <div class="body"><div class="empty">Waiting for your Vest session…</div></div>
        <div class="alertzone">
          <div class="update" hidden></div>
          <div class="themeintro update" hidden></div>
          <div class="alerts"></div>
        </div>
        <div class="logwrap">
          <div class="logh" role="button" tabindex="0" aria-expanded="false" title="Show or hide the activity log">
            <span class="caret">${ICON.right}</span><span class="logt">Activity</span><span class="loglast"></span><span class="loghbtns">
            <button class="iconbtn sm" data-act="dlall" title="Download the diagnostics and the activity log (one file), for troubleshooting">Download</button>
            <button class="iconbtn sm" data-act="clearlog" title="Clear the activity log">Clear</button>
          </span></div>
          <div class="log" aria-live="polite"></div>
        </div>
        <div class="reportbar">
          <button class="codebtn" data-act="code" title="Click to copy the code. It pays me a commission, which keeps the copier free." hidden>Use code <b>${SUPPORT_CODE}</b><span class="off"> · 5% off</span></button>
          <button class="health" data-act="health" title="Vest's build, this version and the API budget. Click for the status card and the site check." aria-label="Status" aria-expanded="false"><span class="dot gray"></span><span class="hsum">Starting…</span></button>
        </div>
        <div class="scard cx-card" hidden>
          <div class="cx-meter" id="cx-meter"></div>
          <div class="kv" title="How far the followers filled from the master on the last copied trade (average, in points) and how long after"><span>Last copy</span><span id="cx-last" class="v-muted">no copy yet</span></div>
          <div class="cx-verdict" id="cx-verdict" hidden></div>
          <div class="cx-btns"><button class="ghostbtn" data-act="sitecheck">Run site check</button><button class="ghostbtn" data-act="conntest" title="About 10 quick reads to Vest, copying or not">Test connection</button></div>
          <div class="cx-prog" id="cx-prog" hidden><i></i></div>
          <div class="cx-sep"></div>
          <div class="kv"><span>Vest build</span><span class="htext">Starting…</span></div>
          <div class="kv"><span>Copier</span><span class="ver">v${VERSION}</span></div>
          <div class="kv" title="Vest allows 200 requests a second; this is what's left this second"><span>API this second</span><span class="rate" id="rate">—</span></div>
          <div class="kv" title="How long Vest took to answer a follower order (it leaves with the master's own order in fast mode)"><span>Vest's answer, slowest today</span><span id="slowest">—</span></div>
        </div>
        <div class="grip" title="Drag to resize"></div>
      </div>`;
    const panel = root.querySelector('.panel');
    const hdr = root.querySelector('.hdr');
    panel.addEventListener('pointerdown', () => (_pointerDown = true), true);
    window.addEventListener('pointerup', () => (_pointerDown = false), true);
    // Move by the header (or the whole pill when minimised): a press that moves DRAG_PX or more drags, kept inside the
    // chart when docked (else the window); a press that doesn't move on the pill opens it. Pointer capture keeps the drag
    // even when the cursor passes over the chart's frame.
    let drag = null;
    hdr.addEventListener('pointerdown', (e) => {
      if (
        e.button !== 0 ||
        e.target.closest('.pillbtn') ||
        (e.target.closest('.iconbtn') && !panel.classList.contains('collapsed'))
      )
        return;
      const r = panel.getBoundingClientRect();
      drag = { sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, moved: false };
      try {
        hdr.setPointerCapture(e.pointerId);
      } catch {
        /* best effort: nothing to do if this fails */
      }
      e.preventDefault();
    });
    hdr.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.sx,
        dy = e.clientY - drag.sy;
      if (!drag.moved && Math.hypot(dx, dy) < DRAG_PX) return;
      drag.moved = _dragging = true;
      const B = placeBounds(),
        r = panel.getBoundingClientRect(),
        z = zoomOf(); // the panel's own lengths are in its zoomed units
      panel.style.left = clampPx(drag.ox + dx, B.l, B.r - r.width) / z + 'px';
      panel.style.top = clampPx(drag.oy + dy, B.t, B.b - r.height) / z + 'px';
    });
    const endDrag = (e) => {
      if (!drag) return;
      const was = drag;
      drag = null;
      _dragging = false;
      if (was.moved) return rememberSpot();
      if (e.type === 'pointerup' && panel.classList.contains('collapsed')) setOpen(true); // a click on the pill
    };
    hdr.addEventListener('pointerup', endDrag);
    hdr.addEventListener('pointercancel', endDrag);
    hdr.addEventListener('keydown', (e) => {
      if (panel.classList.contains('collapsed') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setOpen(true);
      }
    });

    // Resize from the corner grip, inside the same bounds; the size is remembered.
    const grip = root.querySelector('.grip');
    let rs = null;
    grip.addEventListener('pointerdown', (e) => {
      const r = panel.getBoundingClientRect();
      rs = { w: r.width, h: r.height, sx: e.clientX, sy: e.clientY, left: r.left, top: r.top };
      try {
        grip.setPointerCapture(e.pointerId);
      } catch {
        /* best effort: nothing to do if this fails */
      }
      e.preventDefault();
      e.stopPropagation();
    });
    grip.addEventListener('pointermove', (e) => {
      if (!rs) return;
      const B = placeBounds(),
        z = zoomOf();
      panel.style.width =
        clampPx(rs.w + e.clientX - rs.sx, PANEL_MIN_W * z, Math.min(PANEL_MAX_W * z, B.r - rs.left)) / z + 'px';
      panel.style.maxHeight = clampPx(rs.h + e.clientY - rs.sy, PANEL_MIN_H * z, B.b - rs.top) / z + 'px';
    });
    const endResize = () => {
      if (!rs) return;
      rs = null;
      store.set(SIZE_KEY, { w: panel.offsetWidth, h: parseInt(panel.style.maxHeight, 10) || 0 });
      place();
    };
    grip.addEventListener('pointerup', endResize);
    grip.addEventListener('pointercancel', endResize);

    const on = (sel, fn) => {
      root.querySelector(sel).onclick = fn;
    };
    // The ⋯ menu: docked / floating, reload, Settings, Help, Report a problem. Closes on a pick, Escape or a click elsewhere.
    const menu = root.querySelector('.menu'),
      menuBtn = root.querySelector('[data-act="menu"]');
    const setMenu = (open) => {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.onclick = () => setMenu(menu.hidden);
    menu.addEventListener('click', (e) => e.target.closest('.mi') && setMenu(false));
    root.addEventListener('pointerdown', (e) => {
      if (!menu.hidden && !e.target.closest('.menu, [data-act="menu"]')) setMenu(false);
      if (!scard.hidden && !e.target.closest('.scard, .health')) setCard(false);
    });
    root.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      setMenu(false);
      setCard(false);
    });
    on('[data-act="collapse"]', () => setOpen(false));
    on('[data-act="dock"]', () => toggleDock());
    on('[data-act="refresh"]', () => refresh());
    on('[data-act="report"]', () => openReport());
    on('[data-act="back"]', () => closeSheet());
    on('[data-act="pillgo"]', () => pillAction());
    root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => setView(b.dataset.tab)));
    // The status card (the dot at the end of the footer): Vest's build, this version, the API budget, and the site check.
    const scard = root.querySelector('.scard'),
      health = root.querySelector('.health');
    const setCard = (open) => {
      scard.hidden = !open;
      health.setAttribute('aria-expanded', String(open));
      // a test's verdict stays until the card closes; the next test replaces it
      if (!open && S.net.test && !S.net.test.running) S.net.test = null;
      renderConn();
    };
    health.onclick = (e) => {
      e.stopPropagation(); // not a click on the log line
      setCard(scard.hidden);
    };
    on('[data-act="conntest"]', () => testConnection());
    on('[data-act="sitecheck"]', () => {
      setCard(false);
      if (siteGate()) return; // the check already fills the panel
      openSiteCheck();
    });
    on('[data-act="arm"]', () => (S.armed ? disarm() : arm()));
    on('[data-act="flatall"]', () => flattenAll()); // acts at once, no confirmation
    // The activity log folds to one line (the latest event); open or closed is remembered.
    const logwrap = root.querySelector('.logwrap'),
      logh = root.querySelector('.logh');
    const setLogOpen = (open) => {
      logwrap.classList.toggle('open', open);
      logh.setAttribute('aria-expanded', String(open));
      logh.querySelector('.caret').innerHTML = open ? ICON.down : ICON.right;
      store.set(LOG_OPEN_KEY, open);
    };
    setLogOpen(store.get(LOG_OPEN_KEY, false) === true);
    logh.onclick = (e) => !e.target.closest('button') && setLogOpen(!logwrap.classList.contains('open'));
    logh.onkeydown = (e) => {
      if (e.target === logh && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setLogOpen(!logwrap.classList.contains('open'));
      }
    };
    on('[data-act="dlall"]', () => downloadDiag());
    on('[data-act="clearlog"]', () => clearLog());
    on('[data-act="code"]', () =>
      copySupportCode().then((ok) =>
        toast(
          ok
            ? `Code ${SUPPORT_CODE} copied: 5% off at Vest's checkout. It pays me a commission, which keeps the copier free.`
            : `Code: ${SUPPORT_CODE}`,
        ),
      ),
    );
    // shown unless this account already uses the code
    root.querySelector('[data-act="code"]').hidden = (store.get(SUPPORT_KEY, null) || {}).answered === 'had-code';
    return root;
  }

  function renderHealth() {
    if (!_root) return;
    const h = healthState(),
      g = siteGate();
    const level = g === 'failed' ? 'red' : h.level;
    _root.querySelector('.health .dot').className = 'dot ' + level;
    _root.querySelector('.health').title =
      level === 'green'
        ? 'Status: all good. Click for the details and the site check.'
        : 'Status: Vest updated its site';
    _root.querySelector('.htext').textContent =
      g === 'failed' ? 'Vest changed — copying off' : g === 'waiting' ? 'Vest updated — check waiting' : h.text;
    _root.querySelector('.reportbar').classList.toggle('alert', level !== 'green');
    renderRate();
    renderConn(); // the time to Vest: the bar's text and dot, the status card, the pill
    renderUpdate();
    renderPause();
    renderNotice();
    renderThemeIntro();
  }
  // The bottom bar's right side: this version · the time to Vest, or what Vest's update means for copying.
  function renderHealthSum() {
    const el = _root && _root.querySelector('.hsum');
    if (!el) return;
    const h = healthState(),
      g = siteGate();
    const health = el.closest('.health');
    // a failed or waiting site check keeps the bar, whatever the connection
    if (g === 'failed' || g === 'waiting' || h.changed) {
      health.className = 'health';
      el.textContent =
        g === 'failed' ? 'Vest changed — copying off' : g === 'waiting' ? 'Vest updated — check waiting' : h.text;
      return;
    }
    // the version and the time to Vest (Vest's build and the API budget are on the status card); the dot by connection
    const cs = netState(),
      last = S.net.samples[S.net.samples.length - 1];
    health.className = 'health cx-' + cs;
    const html =
      cs === 'down'
        ? `v${VERSION} · <span class="ms">Vest not answering</span>`
        : last && cs !== 'off' && cs !== 'none'
          ? `v${VERSION} · <span class="ms">${last.ms}ms</span>`
          : `v${VERSION}`;
    if (el.dataset.html !== html) el.innerHTML = el.dataset.html = html;
  }
  // ── The connection readout (design B, the Meter): the status card leads with the time to Vest, its level and the last
  // 5 minutes' reads as bars against the 80 and 200 ms lines; then the last copy's result, Test connection and its
  // verdict. The wording says what the number means for copies and never promises a fill.
  const hms = (t) => new Date(t).toLocaleTimeString([], { hour12: false });
  const CX_LEVEL = { good: 'Good', ok: 'OK', slow: 'Slow', down: 'No answer' };
  // one bar per read on a square-root scale to 450 ms (small times still show), the 80 and 200 ms lines; a red cross
  // for a read Vest didn't answer
  function connBars(vals, w = 252, h = 50) {
    const max = 450,
      y = (v) => +(h - 4 - Math.sqrt(Math.min(v, max) / max) * (h - 8)).toFixed(1),
      step = (w - 26) / NET_BARS;
    const line = (v, lab) =>
      `<line x1="0" x2="${w - 22}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.13)" stroke-dasharray="2 3"/><text x="${w}" y="${y(v) + 3}" text-anchor="end" style="font-family: var(--mono)" font-size="9" fill="#6b6b73">${lab}</text>`;
    const bars = vals
      .map((v, i) => {
        const x = +(2 + i * step).toFixed(1);
        if (v == null)
          return `<path d="M${x - 2} ${h - 7} l5 5 M${x + 3} ${h - 7} l-5 5" stroke="#ff5a4f" stroke-width="1.3"/>`;
        const c = v < NET_GOOD_MS ? '#c8f542' : v <= NET_OK_MS ? '#a1a1a8' : '#f5b942';
        return `<rect x="${x - 1.5}" y="${y(v)}" width="3" height="${+(h - 4 - y(v)).toFixed(1)}" fill="${c}" opacity="${(0.55 + (i / vals.length) * 0.45).toFixed(2)}"/>`;
      })
      .join('');
    return `<svg class="cx-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${line(NET_GOOD_MS, '80')}${line(NET_OK_MS, '200')}<line x1="0" x2="${w - 22}" y1="${h - 4}" y2="${h - 4}" stroke="rgba(255,255,255,.09)"/>${bars}</svg>`;
  }
  function meterHtml(cs) {
    const n = S.net,
      last = n.samples[n.samples.length - 1],
      jit = netJitter();
    const measured = cs === 'good' || cs === 'ok' || cs === 'slow';
    const big = measured
      ? `<b>${last.ms}</b><small>ms to Vest</small>`
      : cs === 'down'
        ? '<b>—</b><small>Vest not answering</small>'
        : `<b>—</b><small>${cs === 'off' ? 'measured while copying' : 'first reading in a few seconds'}</small>`;
    const cls = measured ? (cs === 'ok' ? '' : cs) : cs === 'down' ? 'down' : 'empty';
    const chip = CX_LEVEL[cs] ? `<span class="lvl ${cs}">${CX_LEVEL[cs]}</span>` : '';
    const bars =
      cs === 'off' || !n.samples.length ? '<div class="cx-flat"></div>' : connBars(n.samples.map((x) => x.ms));
    const under =
      cs === 'off'
        ? 'Start copying to measure'
        : cs === 'down'
          ? `No answer since ${hms(n.missSince)}`
          : jit != null
            ? `${jit <= 10 ? 'Steady' : jit <= 40 ? 'A little uneven' : 'Uneven'} (±${jit}ms)`
            : 'Measuring every 20s';
    return `<div class="cx-big ${cls}" title="How long Vest takes to answer a small read, every 20s while copying">${big}${chip}</div>${bars}<div class="cx-under"><span title="How much the time to Vest varies between readings">${under}</span><span>last 5 min</span></div>`;
  }
  // Test connection's verdict from its reads (ms, or null for no answer).
  function verdictOf(res) {
    const ok = res.filter((x) => x != null).sort((a, b) => a - b),
      missed = res.length - ok.length,
      at = hhmm(Date.now());
    if (!ok.length || missed > res.length / 2)
      return {
        level: 'down',
        title: "Vest isn't answering",
        text: `${missed} of ${res.length} checks got no answer. Copies may not go through until it does. Check your internet, then test again.`,
        small: `${res.length} checks · ${ok.length} answered · ${at}`,
      };
    const med = pctOf(ok, 0.5),
      level = netLevel(med),
      w = ok.length >= 5 ? ok.slice(1, -1) : ok,
      jit = Math.round((w[w.length - 1] - w[0]) / 2);
    return {
      level,
      title:
        level === 'good'
          ? `Good: ${med}ms${jit <= 10 ? ', steady' : ''}`
          : `${level === 'ok' ? 'OK' : 'Slow'}: ${med}ms`,
      text: {
        good: 'Copies reach Vest quickly from here. Fill prices still depend on the market.',
        ok: "In fast markets, followers' fills and closes may land a tick or so from the master's.",
        slow: 'Expect slippage: followers may fill a few ticks from the master, most in fast markets. A wired connection usually helps.',
      }[level],
      small: `${res.length} checks · ${ok[0]}-${ok[ok.length - 1]}ms${missed ? ` · ${missed} no answer` : ''} · ${at}`,
    };
  }
  // ~10 reads a quarter second apart, copying or not, then one verdict. Its own reads: the 20 s ones carry on and the
  // card's bars only ever show those. Three misses in a row end it early (each waits NET_TIMEOUT_MS for an answer).
  const TEST_READS = 10,
    TEST_GAP_MS = 250,
    TEST_MISSES = 3;
  async function testConnection() {
    const n = S.net;
    if (n.test && n.test.running) return;
    if (!Object.keys(S.byId).length || !userTokenOk()) return toast('Wait for your accounts to load, then test again.');
    const t = (n.test = { running: true, res: [] });
    renderConn();
    let missRun = 0;
    for (let i = 0; i < TEST_READS && missRun < TEST_MISSES; i++) {
      if (i) await sleep(TEST_GAP_MS);
      const ms = await timedRead();
      if (ms === undefined) break;
      t.res.push(ms);
      missRun = ms == null ? missRun + 1 : 0;
      renderConn();
    }
    t.running = false;
    t.verdict = t.res.length ? verdictOf(t.res) : null;
    diag('connection_test', { results: t.res, level: t.verdict ? t.verdict.level : null, copying: S.armed });
    renderConn();
  }
  function renderConn() {
    if (!_root) return;
    renderHealthSum();
    const cs = netState(),
      set = (el, html) => el && el.dataset.html !== html && (el.innerHTML = el.dataset.html = html);
    set(_root.querySelector('#cx-meter'), meterHtml(cs));
    const lc = S.lastCopy,
      last = _root.querySelector('#cx-last');
    if (last) {
      last.textContent = !lc
        ? 'no copy yet'
        : lc.notSent
          ? 'not sent'
          : `${lc.pts < 1e-6 ? 'same price' : +lc.pts.toFixed(2) + ' pts'}${lc.gapMs != null ? ` · ${lc.gapMs}ms` : ''}`;
      last.className = !lc ? 'v-muted' : lc.notSent ? 'v-down' : '';
    }
    const t = S.net.test,
      v = t && !t.running && t.verdict,
      box = _root.querySelector('#cx-verdict');
    if (box) {
      box.hidden = !v;
      box.className = 'cx-verdict' + (v ? ' ' + v.level : '');
      set(box, v ? `<b>${esc(v.title)}</b><span>${esc(v.text)}</span><small>${esc(v.small)}</small>` : '');
    }
    const btn = _root.querySelector('[data-act="conntest"]'),
      prog = _root.querySelector('#cx-prog');
    if (btn) {
      btn.disabled = !!(t && t.running);
      btn.textContent = t && t.running ? `Testing… ${t.res.length} of ${TEST_READS}` : 'Test connection';
    }
    if (prog) {
      prog.hidden = !(t && t.running);
      prog.firstElementChild.style.width = t && t.running ? `${(t.res.length / TEST_READS) * 100}%` : '0';
    }
    renderDock();
  }
  function renderRate() {
    if (!_root) return;
    const el = _root.querySelector('#rate');
    if (!el) return;
    const { remaining, limit } = S.rate;
    if (remaining == null) {
      el.textContent = '—';
      return;
    }
    el.textContent = `${remaining}${limit ? ' / ' + limit : ''}`;
    const frac = limit ? remaining / limit : 1;
    el.className = 'rate ' + (frac < 0.05 ? 'r-red' : frac < 0.2 ? 'r-amber' : 'r-ok');
    renderHealthSum();
  }

  // One view at a time. Tabs: accounts (Copier) · trade · summary (P&L). Sheets over the card, with a back arrow:
  // settings · support (Help) · site (the site check, from the status card) · share. Rules = the first-run terms.
  const currentView = () =>
    S.siteOpen
      ? 'site'
      : S.appearOpen
        ? 'appearance'
        : S.shareOpen
          ? 'share'
          : S.supportOpen
            ? 'support'
            : S.tradeOpen
              ? 'trade'
              : S.summaryOpen
                ? 'summary'
                : S.settingsOpen
                  ? 'settings'
                  : S.rulesOpen
                    ? 'rules'
                    : 'accounts';
  const SHEETS = {
    settings: 'Settings',
    appearance: 'Appearance',
    support: 'Help',
    site: 'Site check',
    share: 'Share',
  };
  // ── Placement. Docked (the default), the panel lives on Vest's chart: just right of the chart's drawing toolbar and
  // below its top toolbar, kept inside the chart whatever resizes (the window, Vest's order book or positions area), its
  // spot remembered relative to the chart. Detached (the pin), it floats anywhere in the window. Minimised, it's a pill:
  // logo, COPIER and the state, with a dot when something needs you. On a page with no chart, it floats.
  // On the Trade tab it grows to the bottom of its bounds, so the whole order form fits without resizing by hand.
  const DOCK_KEY = 'vc-dock'; // { docked, open, at: {x,y} from the chart's corner, free: {x,y} in the window }
  const PANEL_MIN_W = 300,
    PANEL_MAX_W = 700,
    PANEL_MIN_H = 350; // header, the status block, tabs, an account row and the footer
  const HDR_FULL_W = 350; // narrower than this, the header leaves out the "COPIER" label
  const DOCK_INSET = 6, // px kept between the panel and the chart's edges (and the window's)
    DRAG_PX = 4, // a press on the pill that moves less than this is a click
    CHART_MIN_W = 400, // a frame smaller than this isn't Vest's chart
    CHART_MIN_H = 300,
    DOCK_MIN_W = 520, // a chart area narrower or shorter than this (Vest's stacked layout in a small window) can't hold
    DOCK_MIN_H = 440; // the panel without squashing it: it floats until the chart is big enough, then docks back
  let _dragging = false,
    _placeKey = '';
  const clampPx = (v, lo, hi) => Math.max(lo, Math.min(hi, v)) || lo;
  function loadDock() {
    const d = store.get(DOCK_KEY, {}) || {};
    const pt = (o) => (o && Number.isFinite(o.x) && Number.isFinite(o.y) ? { x: o.x, y: o.y } : null);
    S.dock = { docked: d.docked !== false, open: d.open !== false, at: pt(d.at), free: pt(d.free) };
  }
  const saveDock = () => store.set(DOCK_KEY, S.dock);
  // Vest's chart: the TradingView frame (found by its API, not by Vest's styling).
  let _chartEl = null;
  function chartFrame() {
    if (_chartEl && _chartEl.isConnected) return _chartEl;
    _chartEl = null;
    for (const f of document.querySelectorAll('iframe'))
      try {
        if (f.contentWindow && f.contentWindow.tradingViewApi) return (_chartEl = f);
      } catch {
        /* another site's frame: not the chart */
      }
    return null;
  }
  // The chart's drawing area in the window (right of its drawing toolbar, below its top toolbar), or null.
  function chartZone() {
    const f = chartFrame();
    if (!f) return null;
    const r = f.getBoundingClientRect();
    if (r.width < CHART_MIN_W || r.height < CHART_MIN_H) return null;
    let left = 52,
      top = 38; // TradingView's usual toolbar sizes, if they can't be measured
    try {
      const doc = f.contentDocument,
        l = doc && doc.querySelector('.layout__area--left'),
        t = doc && doc.querySelector('.layout__area--top');
      if (l) left = l.getBoundingClientRect().width;
      if (t) top = t.getBoundingClientRect().height;
    } catch {
      /* best effort: the usual sizes */
    }
    return { left: r.left + left, top: r.top + top, right: r.right, bottom: r.bottom };
  }
  // The chart area to dock into: none when floating, when there's no chart, or when the chart is too small to hold the
  // panel (then it floats on its own until the chart is big enough: `_autoFloat`).
  let _autoFloat = false;
  function dockZone() {
    const z = S.dock && S.dock.docked ? chartZone() : null;
    const small = !!z && (z.right - z.left < DOCK_MIN_W || z.bottom - z.top < DOCK_MIN_H);
    if (small !== _autoFloat) {
      _autoFloat = small;
      setTimeout(renderDock, 0);
    }
    return small ? null : z;
  }
  // Where the panel may be: inside the chart when docked on a page with one, else inside the window.
  function placeBounds() {
    const z = dockZone();
    const box = z || { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, window: true };
    return {
      l: box.left + DOCK_INSET,
      t: box.top + DOCK_INSET,
      r: box.right - DOCK_INSET,
      b: box.bottom - DOCK_INSET,
      zone: z,
    };
  }
  function place() {
    const panel = _root && _root.querySelector('.panel');
    if (!panel || !S.dock || _dragging) return;
    // Text size zooms the panel, which scales its own position and size too: everything below is in its units (the
    // window's pixels ÷ the zoom). Saved spots are in the window's pixels.
    const z = zoomOf(),
      zs = z === 1 ? '' : String(z);
    if (panel.style.zoom !== zs) panel.style.zoom = zs;
    const V = placeBounds(),
      B = {
        l: V.l / z,
        t: V.t / z,
        r: V.r / z,
        b: V.b / z,
        zone: V.zone && { left: V.zone.left / z, top: V.zone.top / z },
      },
      d = S.dock,
      open = !panel.classList.contains('collapsed');
    panel.classList.toggle('v-trade', !!S.tradeOpen);
    panel.classList.toggle('docked', !!B.zone);
    const saved = store.get(SIZE_KEY, null) || {};
    const w = open ? clampPx(saved.w || 368, PANEL_MIN_W, Math.min(PANEL_MAX_W, Math.max(PANEL_MIN_W, B.r - B.l))) : 0;
    panel.style.width = open ? w + 'px' : '';
    panel.classList.toggle('narrow', open && w < HDR_FULL_W); // the header drops "COPIER" so its buttons still fit
    const width = open ? w : panel.offsetWidth;
    // its spot: from the chart's corner when docked, else in the window (the first time: top right, as before)
    const want = B.zone
      ? { x: B.zone.left + (d.at ? d.at.x / z : DOCK_INSET), y: B.zone.top + (d.at ? d.at.y / z : DOCK_INSET) }
      : d.free
        ? { x: d.free.x / z, y: d.free.y / z }
        : _autoFloat
          ? { x: DOCK_INSET, y: DOCK_INSET }
          : { x: window.innerWidth / z - width - 16, y: 16 };
    const x = clampPx(want.x, B.l, B.r - width);
    let y;
    if (!open) {
      panel.style.maxHeight = '';
      y = clampPx(want.y, B.t, B.b - panel.offsetHeight);
    } else if (S.tradeOpen) {
      y = clampPx(want.y, B.t, B.b - Math.min(320, B.b - B.t));
      panel.style.maxHeight = Math.max(PANEL_MIN_H, B.b - y) + 'px';
    } else {
      // the terms and the code question ignore a panel made small: nothing to scroll past or miss
      const roomy = !S.ack || codeAskDue();
      panel.style.maxHeight = Math.max(PANEL_MIN_H, Math.min((!roomy && saved.h) || Infinity, B.b - B.t)) + 'px';
      y = clampPx(want.y, B.t, B.b - panel.offsetHeight);
    }
    Object.assign(panel.style, { left: x + 'px', top: y + 'px', right: 'auto' });
  }
  // After a drag: remember the spot, from the chart's corner when docked on it, else in the window.
  function rememberSpot() {
    const panel = _root && _root.querySelector('.panel');
    if (!panel) return;
    const r = panel.getBoundingClientRect(),
      z = dockZone();
    if (z) S.dock.at = { x: Math.round(r.left - z.left), y: Math.round(r.top - z.top) };
    else S.dock.free = { x: Math.round(r.left), y: Math.round(r.top) };
    saveDock();
    place();
  }
  function setOpen(open) {
    const panel = _root && _root.querySelector('.panel');
    if (!panel) return;
    panel.classList.toggle('collapsed', !open);
    S.dock.open = open;
    saveDock();
    if (!open) {
      clearBracketLines();
      stopPick(true); // a chart click must never place an order the panel no longer shows
    } else updateTrade();
    const b = _root.querySelector('[data-act="collapse"]');
    b.setAttribute('aria-expanded', String(open));
    const hdr = _root.querySelector('.hdr');
    if (open) {
      hdr.removeAttribute('tabindex');
      hdr.removeAttribute('role');
    } else {
      hdr.setAttribute('tabindex', '0'); // the pill opens from the keyboard too
      hdr.setAttribute('role', 'button');
    }
    renderDock();
    place();
  }
  // The pin: docked on the chart, or floating anywhere. Undocking leaves the panel where it is; docking puts it back at
  // its spot on the chart.
  function toggleDock() {
    const panel = _root && _root.querySelector('.panel');
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    S.dock.docked = !S.dock.docked;
    if (!S.dock.docked) S.dock.free = { x: Math.round(r.left), y: Math.round(r.top) };
    saveDock();
    renderDock();
    place();
  }
  // The ⋯ menu's dock item, and the minimised pill: its state, one number (the open P&L while copying) and one button.
  // Red border when followers wait on Flatten / Keep, Vest changed something the copier needs or, copying, Vest's live
  // feed is lost; amber when Vest updated its site (the check runs by itself).
  const _bootAt = Date.now();
  function renderDock() {
    if (!_root || !S.dock) return;
    const pin = _root.querySelector('[data-act="dock"]');
    pin.setAttribute('aria-checked', String(S.dock.docked));
    pin.classList.toggle('on', S.dock.docked);
    pin.classList.toggle('auto', S.dock.docked && _autoFloat); // docked, but floating for now: the chart is too small
    pin.querySelector('.mt').textContent = !S.dock.docked
      ? 'Dock on the chart'
      : _autoFloat
        ? 'Docked (floating: chart too small)'
        : 'Docked on chart';
    pin.title = !S.dock.docked
      ? 'Floating anywhere: click to dock it on the chart'
      : _autoFloat
        ? 'The chart is too small to hold the panel, so it floats until the chart is bigger. Click to float it for good.'
        : 'Docked on the chart: click to float it anywhere';
    const orphans = !!(S.orphan && S.orphan.list.length),
      siteOff = siteGate() === 'failed';
    const cs = netState(); // copying: slow shows amber and the time, not answering red and "No answer"
    const red =
      orphans || siteOff || (S.armed && !feedLive() && Date.now() - _bootAt > FEED_QUIET_MS / 5) || cs === 'down';
    const amber = !red && (healthState().changed || cs === 'slow');
    const pms = _root.querySelector('#cx-pms');
    if (pms) {
      const last = S.net.samples[S.net.samples.length - 1];
      pms.textContent = cs === 'slow' && last ? `${last.ms}ms` : cs === 'down' ? 'No answer' : '';
      pms.className = 'cx-pms ' + cs;
    }
    const panel = _root.querySelector('.panel');
    panel.classList.toggle('attn-red', red);
    panel.classList.toggle('attn-amber', amber);
    const collapsed = panel.classList.contains('collapsed');
    const p = pillState();
    // minimised: an orphan names the account; copying shows the open P&L across the accounts in the trade
    const tag = _root.querySelector('#armtag .ptext');
    if (collapsed && orphans) {
      const o = S.orphan.list[0];
      tag.textContent =
        S.orphan.list.length > 1
          ? `${S.orphan.list.length} followers need you`
          : `${o.label || accLabel(o.accountId)} needs you`;
    }
    let pnl = null;
    if (S.armed)
      for (const id of [S.master, ...S.followers]) {
        const r = S.byId[id];
        if (r && inTrade(id) && Number.isFinite(r.upnl)) pnl = (pnl || 0) + r.upnl;
      }
    const v = _root.querySelector('#pillv');
    v.textContent = collapsed && pnl !== null ? (pnl >= 0 ? '+' : '−') + money(Math.abs(pnl)) : '';
    v.className = 'pillv ' + (pnl === null ? '' : pnl >= 0 ? 'pos' : 'neg');
    const btn = _root.querySelector('[data-act="pillgo"]');
    btn.hidden = !collapsed || !p.act;
    btn.textContent = p.label || '';
    btn.className = 'pillbtn ' + (p.act || '');
    const hdr = _root.querySelector('.hdr');
    hdr.setAttribute('aria-label', collapsed ? `Open STRATUH Copier (${tag.textContent})` : '');
  }
  // Keep the panel in place as the page changes: the window resizing at once, and Vest's own layout (the chart, the
  // order book, the positions area, a page with no chart) checked a few times a second.
  // Vest's buy/sell marks on the chart: TradingView's "Hide marks on bars" (its `hideAllMarks` action), which Vest's
  // chart forgets on every load. With the setting on, it's switched on once per chart load; showing the marks again from
  // the chart's menu is respected until the next load.
  let _marksDone = null; // the chart frame the marks were handled for
  function hideChartMarks(f) {
    if (!S.hideMarks || !f || _marksDone === f) return;
    try {
      const chart = f.contentWindow.tradingViewApi.activeChart();
      if (typeof chart.getCheckableActionState !== 'function') return;
      const hidden = chart.getCheckableActionState('hideAllMarks');
      if (hidden == null) return; // not ready yet: tried again on the next check
      if (!hidden) chart.executeActionById('hideAllMarks');
      _marksDone = f;
    } catch {
      /* the chart isn't ready yet: tried again on the next check */
    }
  }
  // ── STRATUH theme for Vest (optional). Vest colours its whole page from CSS variables on its dark theme (`.dark`):
  // the copier sets them to STRATUH's tokens with one stylesheet, scoped to a class on <html>, so switching it off is
  // instant. Vest paints the chart separately, through TradingView: the copier applies STRATUH's chart colours the same
  // way (the chart frame's applyOverrides plus its --tv-color variables), once per chart load and after Vest re-applies
  // its own (it does on load and on a theme change). Only colours change; nothing is sent to Vest.
  const STRATUH = {
    bg: '#0c0c0d',
    raised: '#141416',
    raised2: '#1a1a1d',
    hover: '#1e1e22',
    active: '#26262b',
    line: 'rgba(255, 255, 255, 0.09)',
    line2: 'rgba(255, 255, 255, 0.18)',
    text: '#f0f0f1',
    muted: '#a1a1a8',
    dim: '#66666e',
    lime: '#c8f542',
    limeHi: '#e4ff7a',
    red: '#ff5a4f',
    amber: '#f5b942',
    blue: '#7ab8ff',
    grey: '#8a8a94',
  };
  function themeCss(down) {
    const T = STRATUH,
      red = down === 'red';
    const short = red ? T.red : T.grey,
      shortMuted = red ? 'rgba(255, 90, 79, 0.14)' : 'rgba(138, 138, 148, 0.16)';
    return `html.vc-stratuh.dark, html.vc-stratuh .dark {
      --primary: ${T.lime}; --primary-foreground: ${T.bg}; --primary-light: rgba(200, 245, 66, 0.1);
      --background: ${T.bg}; --foreground: ${T.text}; --foreground-secondary: ${T.muted}; --contrast: #ffffff;
      --secondary: ${T.raised2}; --secondary-foreground: ${T.text};
      --muted: ${T.raised2}; --muted-foreground: ${T.muted};
      --accent: ${T.raised2}; --accent-foreground: ${T.text};
      --card: ${T.raised}; --card-foreground: ${T.text}; --card-elevated: ${T.raised2};
      --popover: ${T.raised}; --popover-foreground: ${T.text};
      --destructive: ${T.red}; --destructive-foreground: ${T.bg};
      --input: ${T.raised}; --ring: ${T.lime}; --border: ${T.line}; --border-muted: rgba(255, 255, 255, 0.06);
      --long: ${T.lime}; --long-foreground: ${T.bg}; --long-muted: rgba(200, 245, 66, 0.14);
      --short: ${short}; --short-foreground: ${T.bg}; --short-muted: ${shortMuted};
      --warning: ${T.amber}; --info: ${T.blue}; --highlight: ${T.limeHi}; --yellow: ${T.limeHi};
      --surface: ${T.raised2}; --surface-foreground: ${T.text}; --surface-muted: ${T.dim}; --surface-hover: ${T.hover};
      --surface-active: ${T.active}; --surface-elevated: ${T.raised}; --surface-overlay: ${T.text};
      --chart-1: ${T.text}; --chart-2: ${T.lime}; --chart-3: ${T.grey}; --chart-4: ${T.limeHi}; --chart-5: ${T.dim};
      --radius: 0px; --radius-xs: 0px; --radius-sm: 0px; --radius-md: 0px; --radius-lg: 0px; --radius-xl: 0px;
      --radius-2xl: 0px; --radius-3xl: 0px;
    }
    html.vc-stratuh.dark ::selection { background: rgba(200, 245, 66, 0.25); }
    /* Vest's "long" buttons (Buy/Long, its order confirm) keep white text: dark on lime */
    html.vc-stratuh.dark .bg-long.text-white { color: ${T.bg}; }`;
  }
  // The chart: STRATUH's grey look, whatever the shorts colour: light and dark grey candles, onyx pane, faint grid.
  const THEME_UP = '#b4b4ba',
    THEME_DOWN = '#55555c',
    THEME_VOL_UP = '#4a4a52',
    THEME_VOL_DOWN = '#2c2c31';
  function themeChartOverrides() {
    const T = STRATUH,
      up = THEME_UP,
      dn = THEME_DOWN;
    const o = {
      'paneProperties.backgroundType': 'solid',
      'paneProperties.background': T.bg,
      'paneProperties.backgroundGradientStartColor': T.bg,
      'paneProperties.backgroundGradientEndColor': T.bg,
      'paneProperties.vertGridProperties.color': '#17171a',
      'paneProperties.horzGridProperties.color': '#17171a',
      'scalesProperties.lineColor': T.active,
      'scalesProperties.textColor': T.muted,
      'mainSeriesProperties.lineStyle.color': T.text,
      'mainSeriesProperties.areaStyle.linecolor': T.lime,
      'mainSeriesProperties.areaStyle.color1': 'rgba(200, 245, 66, 0.28)',
      'mainSeriesProperties.areaStyle.color2': 'rgba(200, 245, 66, 0)',
    };
    for (const k of ['candleStyle', 'hollowCandleStyle', 'haStyle']) {
      Object.assign(o, {
        [`mainSeriesProperties.${k}.upColor`]: up,
        [`mainSeriesProperties.${k}.downColor`]: dn,
        [`mainSeriesProperties.${k}.borderUpColor`]: up,
        [`mainSeriesProperties.${k}.borderDownColor`]: dn,
        [`mainSeriesProperties.${k}.wickUpColor`]: up,
        [`mainSeriesProperties.${k}.wickDownColor`]: dn,
      });
    }
    o['mainSeriesProperties.barStyle.upColor'] = up;
    o['mainSeriesProperties.barStyle.downColor'] = dn;
    return o;
  }
  // Vest's own dark chart colours, put back when the theme is switched off.
  const VEST_CHART = {
    'paneProperties.background': '#0F0F0F',
    'paneProperties.backgroundGradientStartColor': '#0F0F0F',
    'paneProperties.backgroundGradientEndColor': '#0F0F0F',
    'paneProperties.vertGridProperties.color': '#292929',
    'paneProperties.horzGridProperties.color': '#292929',
    'scalesProperties.lineColor': '#292929',
    'scalesProperties.textColor': '#F2F2F2',
    'mainSeriesProperties.candleStyle.upColor': '#00D98E',
    'mainSeriesProperties.candleStyle.downColor': '#E03737',
    'mainSeriesProperties.candleStyle.borderUpColor': '#00D98E',
    'mainSeriesProperties.candleStyle.borderDownColor': '#E03737',
    'mainSeriesProperties.candleStyle.wickUpColor': '#00D98E',
    'mainSeriesProperties.candleStyle.wickDownColor': '#E03737',
  };
  // Vest's chart background as Vest sets it now (it paints the chart frame's --tv-color-pane-background from its own
  // palette, which has changed since VEST_CHART was read), with the copier's colours already removed. Vest's chart saves
  // its colours to the account, so the old near-black put back by VEST_CHART stayed (seen 2026-10-22).
  function vestChartBackground(doc) {
    try {
      const bg = getComputedStyle(doc.body || doc.documentElement)
        .getPropertyValue('--tv-color-pane-background')
        .trim();
      return bg
        ? {
            'paneProperties.backgroundType': 'solid',
            'paneProperties.background': bg,
            'paneProperties.backgroundGradientStartColor': bg,
            'paneProperties.backgroundGradientEndColor': bg,
          }
        : {};
    } catch {
      return {};
    }
  }
  const themeTvCss = () => {
    const T = STRATUH;
    const vars = {
      '--tv-color-platform-background': T.bg,
      '--tv-color-pane-background': T.bg,
      '--tv-color-popup-background': T.raised,
      '--tv-color-popup-element-background-active': T.active,
      '--themed-color-drawer-backdrop': T.bg,
      '--themed-color-pane-bg': T.bg,
      '--themed-color-selection-bg': T.bg,
      '--themed-color-text': T.text,
      '--themed-color-background': T.raised,
    };
    return `:root, body { ${Object.entries(vars)
      .map(([k, v]) => `${k}: ${v} !important;`)
      .join(' ')} }`;
  };
  function applyTheme() {
    try {
      const html = document.documentElement;
      let st = document.getElementById('vc-theme');
      if (S.theme) {
        if (!st) {
          st = document.createElement('style');
          st.id = 'vc-theme';
          (document.head || html).appendChild(st);
        }
        const css = themeCss(S.themeDown);
        if (st.textContent !== css) st.textContent = css;
      }
      html.classList.toggle('vc-stratuh', !!S.theme);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  let _chartThemeTimers = []; // the chart follows on the next check after any change
  // The volume bars (Vest adds TradingView's Volume indicator): grey with the theme, Vest's green and red without.
  function themeVolume(f, on) {
    const colors = on ? [THEME_VOL_DOWN, THEME_VOL_UP] : ['#E03737', '#00D98E'];
    try {
      const chart = f.contentWindow.tradingViewApi.activeChart();
      for (const st of chart.getAllStudies() || [])
        if (st && st.name === 'Volume')
          chart.getStudyById(st.id).applyOverrides({ 'volume.color.0': colors[0], 'volume.color.1': colors[1] });
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  function themeChart(f) {
    if (!f) return;
    const dark =
      document.documentElement.classList.contains('dark') || !!document.querySelector('body.dark, #root.dark');
    const key = [S.theme ? 'on' : 'off', dark].join('|'); // the shorts colour doesn't touch the chart
    if (f.__vcThemeKey === key) return;
    let ready = false;
    try {
      const chart = f.contentWindow.tradingViewApi.activeChart();
      ready =
        typeof chart.getCheckableActionState === 'function' && chart.getCheckableActionState('hideAllMarks') != null;
    } catch {
      /* not ready yet */
    }
    if (!ready || typeof f.contentWindow.applyOverrides !== 'function') return; // tried again on the next check
    if (!S.theme && !f.__vcThemeKey) {
      f.__vcThemeKey = key; // never themed: Vest's colours are already there
      return;
    }
    f.__vcThemeKey = key;
    const paint = () => {
      try {
        const doc = f.contentDocument;
        let st = doc.getElementById('vc-theme');
        if (S.theme && dark) {
          if (!st) {
            st = doc.createElement('style');
            st.id = 'vc-theme';
            (doc.head || doc.documentElement).appendChild(st);
          }
          st.textContent = themeTvCss();
          f.contentWindow.applyOverrides(themeChartOverrides());
          themeVolume(f, true);
        } else {
          if (st) st.remove();
          if (dark) {
            f.contentWindow.applyOverrides({ ...VEST_CHART, ...vestChartBackground(doc) });
            themeVolume(f, false);
          }
        }
      } catch {
        /* best effort: nothing to do if this fails */
      }
    };
    // now, and again shortly after: Vest applies its own colours when the chart becomes ready and on a theme change
    _chartThemeTimers.forEach(clearTimeout);
    paint();
    _chartThemeTimers = [setTimeout(paint, 1500), setTimeout(paint, 4000)];
  }
  // Vest's own order lines (its limits, stops and targets) in STRATUH's look while the theme is on: Vest draws them with
  // fixed colours (its bundle: buy #3CB371, sell #f32b46, white text) and its limits right across the chart with the
  // label at the left edge (setLineLength(-12, 'pixel')), so the chart's createOrderLine is wrapped to swap those
  // colours and run every line LINE_LEN % in from the price scale, label and drag handle included, like the copier's
  // own. Looks only: Vest's dragging, × and everything else are untouched. Lines Vest drew before the wrap keep its look
  // until it redraws them.
  const VEST_LINE_COLOURS = { '#3cb371': '#c8f542', '#f32b46': '#ff5a4f' };
  function themeOrderLines(f) {
    try {
      const chart = f && f.contentWindow.tradingViewApi.activeChart();
      if (!chart || typeof chart.createOrderLine !== 'function') return;
      const host = Object.prototype.hasOwnProperty.call(chart, 'createOrderLine')
        ? chart
        : Object.getPrototypeOf(chart);
      if (!host || host.createOrderLine.__vc) return;
      const orig = host.createOrderLine;
      const wrapped = function (...a) {
        const l = orig.apply(this, a);
        try {
          if (l) restyleOrderLine(l);
        } catch {
          /* looks only: the line works either way */
        }
        return l;
      };
      wrapped.__vc = true;
      host.createOrderLine = wrapped;
    } catch {
      /* not ready yet: tried again on the next check */
    }
  }
  function restyleOrderLine(l) {
    const swap = (fn) => (k) => {
      const o = l[k];
      if (typeof o === 'function') l[k] = (v) => o.call(l, fn(v));
    };
    const col = (c) => (S.theme && typeof c === 'string' && VEST_LINE_COLOURS[c.toLowerCase()]) || c;
    const ink = (c) => (S.theme && typeof c === 'string' && /^#fff(fff)?$/i.test(c) ? '#0c0c0d' : c);
    [
      'setLineColor',
      'setBodyBackgroundColor',
      'setBodyBorderColor',
      'setQuantityBackgroundColor',
      'setQuantityBorderColor',
    ].forEach(swap(col));
    ['setBodyTextColor', 'setQuantityTextColor'].forEach(swap(ink));
    const len = l.setLineLength;
    if (typeof len === 'function') {
      // a length in pixels is Vest's limit label pinned to the left edge: swapped; a percentage (its targets and stops,
      // and the copier's own lines) is kept
      l.setLineLength = (v, unit) =>
        S.theme && unit !== 'percentage' ? len.call(l, LINE_LEN, 'percentage') : len.call(l, v, unit);
      if (S.theme) {
        len.call(l, LINE_LEN, 'percentage');
        if (typeof l.setExtendLeft === 'function') l.setExtendLeft(false);
      }
    }
  }
  // Vest's session shading (pre-market, after-hours, overnight bands) is a chart indicator it adds named "Market
  // Sessions" (on load and when its own Session shading setting changes). With the setting on, it's hidden with the
  // indicator's own eye, never removed: switched off, the ones the copier hid show again at once. Vest rebuilds it on
  // every load and never saves it with the chart, so nothing outlives the copier (it was removed until v0.41.2, which
  // Vest's chart, now saved to the account, could keep: issue #5 on the public repo).
  const SESSIONS_STUDY = 'Market Sessions';
  const _sessionsHidden = new Set(); // ids of the ones this tab hid
  function sessionShading(f) {
    if (!f || (!S.hideSessions && !_sessionsHidden.size)) return;
    try {
      const chart = f.contentWindow.tradingViewApi.activeChart();
      if (typeof chart.getAllStudies !== 'function' || typeof chart.getStudyById !== 'function') return;
      for (const st of chart.getAllStudies() || []) {
        if (!st || st.name !== SESSIONS_STUDY) continue;
        const study = chart.getStudyById(st.id);
        if (!study || typeof study.setVisible !== 'function') continue;
        if (S.hideSessions && study.isVisible()) {
          study.setVisible(false);
          _sessionsHidden.add(st.id);
        } else if (!S.hideSessions && _sessionsHidden.has(st.id)) study.setVisible(true);
      }
      if (!S.hideSessions) _sessionsHidden.clear();
    } catch {
      /* the chart isn't ready yet: tried again on the next check */
    }
  }
  // TradingView draws its own menus and dialogs (timeframe, chart settings, indicators, symbol search) inside the chart's
  // frame, and nothing inside a frame can rise above the panel sitting over it. So while one of them overlaps the panel,
  // the panel steps aside (fades out, ignores the mouse) and comes back as soon as it closes.
  const TV_POPUPS =
    '[role="menu"], [role="dialog"], [role="listbox"], [data-name="popup-menu-container"], [data-name="menu-inner"]';
  function chartPopupOver(pr) {
    const f = chartFrame();
    let doc;
    try {
      doc = f && f.contentDocument;
    } catch {
      return false;
    }
    if (!doc || !doc.body) return false;
    const fr = f.getBoundingClientRect();
    for (const el of doc.querySelectorAll(TV_POPUPS)) {
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) continue;
      const l = fr.left + r.left,
        t = fr.top + r.top;
      if (l < pr.right && l + r.width > pr.left && t < pr.bottom && t + r.height > pr.top) return true;
    }
    return false;
  }
  setInterval(() => {
    const panel = _root && _root.querySelector('.panel');
    if (!panel || _dragging) return;
    panel.classList.toggle('aside', chartPopupOver(panel.getBoundingClientRect())); // fading doesn't move it
  }, 200);
  // With the theme on: the Volume indicator Vest adds by itself when the chart loads (only on a chart with no other
  // indicators) is removed, once per chart load. One the trader adds afterwards from Indicators stays.
  const AUTO_VOLUME_MS = 20000; // Vest adds it as the chart becomes ready: looked for this long after the chart appears
  function removeAutoVolume(f) {
    if (!S.theme || !f || f.__vcVolumeDone) return;
    f.__vcSeenAt = f.__vcSeenAt || Date.now();
    try {
      const chart = f.contentWindow.tradingViewApi.activeChart();
      if (typeof chart.getAllStudies !== 'function') return;
      const vols = (chart.getAllStudies() || []).filter((st) => st && st.name === 'Volume');
      if (vols.length) {
        vols.forEach((st) => chart.removeEntity(st.id));
        f.__vcVolumeDone = true;
      } else if (Date.now() - f.__vcSeenAt > AUTO_VOLUME_MS) f.__vcVolumeDone = true; // Vest didn't add one
    } catch {
      /* the chart isn't ready yet: tried again on the next check */
    }
  }
  // The panel shows on Vest's Trade page only (with the setting on); the copier keeps running on every page. It shows
  // anywhere when something needs the trader: followers waiting on Flatten / Keep, or the first-run risk terms.
  const onTradePage = () => /^\/(trade(\/|$)|$)/.test(location.pathname); // Vest's root opens the Trade page
  function showOnThisPage() {
    const host = _root && _root.host;
    if (!host) return;
    const show = !S.tradeOnly || onTradePage() || !S.ack || codeAskDue() || !!(S.orphan && S.orphan.list.length);
    if ((host.style.display !== 'none') === show) return;
    host.style.display = show ? '' : 'none';
    if (show) place();
  }
  window.addEventListener('popstate', showOnThisPage);
  window.addEventListener('resize', () => place());
  setInterval(() => {
    if (!_root) return;
    showOnThisPage();
    if (_dragging) return;
    removeAutoVolume(chartFrame());
    hideChartMarks(chartFrame());
    sessionShading(chartFrame());
    themeChart(chartFrame());
    themeOrderLines(chartFrame());
    hookChartMenu(chartFrame());
    const f = chartFrame(),
      r = f && f.getBoundingClientRect();
    const key = r ? [r.left, r.top, r.width, r.height].map(Math.round).join() : 'none';
    if (key !== _placeKey) {
      _placeKey = key;
      place();
    }
  }, 400);

  function setView(v) {
    if (v !== 'trade') {
      stopPick(true);
      clearBracketLines();
    }
    if (['accounts', 'trade', 'summary'].includes(v)) S.lastTab = v;
    S.tradeOpen = v === 'trade';
    S.summaryOpen = v === 'summary';
    S.settingsOpen = v === 'settings';
    S.appearOpen = v === 'appearance';
    S.rulesOpen = v === 'rules';
    S.supportOpen = v === 'support';
    S.shareOpen = v === 'share';
    S.siteOpen = false;
    if (!S.tradeOpen) unwatchUnused(); // the price feed is only needed by the Trade tab and breakeven
    render();
  }
  // Back from a sheet (Settings, Help, the site check, Share) to the tab it was opened from.
  function closeSheet() {
    setView(S.lastTab || 'accounts');
  }
  // ⋯ › Report a problem: Help, scrolled to the report box.
  function openReport() {
    setView('support');
    const note = _root && _root.querySelector('#rp-note');
    if (!note) return;
    note.scrollIntoView({ block: 'center' });
    note.focus();
  }
  // The minimised pill's button: Flatten while copying, Open when something needs you, Start when ready.
  function pillAction() {
    const a = pillState().act;
    if (a === 'flatten') flattenAll();
    else if (a === 'start') arm();
    else setOpen(true);
  }

  // ── The status block: one sentence saying who copies to whom, a line saying what last happened, and the two buttons.
  // Vest's trading day starts at 20:00 ET (its daily loss resets then): "today" is since then.
  const ET_TZ = 'America/New_York';
  let _etFmt = null;
  function etOffset(d) {
    // ET's offset from UTC at the instant d, in ms (negative: behind UTC)
    _etFmt =
      _etFmt ||
      new Intl.DateTimeFormat('en-US', {
        timeZone: ET_TZ,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
    const p = {};
    for (const x of _etFmt.formatToParts(d)) p[x.type] = +x.value;
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(d.getTime() / 1000) * 1000;
  }
  function vestDayStart(now = Date.now()) {
    const off = etOffset(new Date(now)),
      et = new Date(now + off); // ET wall time, read with the UTC getters
    let wall = Date.UTC(et.getUTCFullYear(), et.getUTCMonth(), et.getUTCDate(), 20);
    if (et.getUTCHours() < 20) wall -= 86400000;
    return wall - etOffset(new Date(wall - off));
  }
  // Follower actions today (from the diagnostics record): done, missed, and the latest batch. `complete` is false when the
  // record no longer reaches back to the day's start (it keeps the latest 2,000 events), so the counts would be short.
  const COPY_TYPES = {
    open: 'filled',
    append: 'added',
    reduce: 'reduced',
    close: 'closed',
    cancel: 'cancelled',
    bracket: 'moved',
  };
  function dayStats() {
    const start = vestDayStart(),
      recs = S.diag.filter((d) => COPY_TYPES[d.type] && d.outcome !== 'skipped' && Date.parse(d.t) >= start);
    const oldest = S.diag.length ? Date.parse(S.diag[0].t) : 0;
    const out = {
      copies: recs.filter((d) => d.met === true).length,
      missed: recs.filter((d) => d.met === false).length,
      complete: S.diag.length < DIAG_MAX || oldest < start,
      last: null,
      slowest: Math.max(0, ...recs.map((d) => +(d.sendMs || d.ms) || 0)),
    };
    const lastRec = recs[recs.length - 1];
    if (lastRec) {
      const at = Date.parse(lastRec.t);
      const batch = recs.filter((d) => d.type === lastRec.type && Math.abs(Date.parse(d.t) - at) < 3000);
      out.last = {
        at,
        verb: lastRec.type === 'open' && lastRec.expected === 'rest' ? 'placed' : COPY_TYPES[lastRec.type],
        done: batch.filter((d) => d.met === true).length,
        of: batch.length,
        pending: batch.some((d) => d.met == null),
      };
    }
    return out;
  }
  const hhmm = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  // The header pill (and the minimised pill's button): what state the copier is in, and the one thing to do from the pill.
  function pillState() {
    const gate = siteGate(),
      orphans = !!(S.orphan && S.orphan.list.length);
    if (gate === 'failed') return { cls: 'bad', text: 'Check failed', act: 'open', label: 'Open' };
    if (orphans) return { cls: 'warn', text: 'Needs you', act: 'open', label: 'Open' };
    if (S.armed) return { cls: 'live', text: 'Copying', act: 'flatten', label: 'Flatten' };
    if (gate && gate !== 'clear') return { cls: '', text: 'Checking Vest', act: 'open', label: 'Open' };
    if (S.arming) return { cls: '', text: 'Starting…', act: null };
    const ready = S.ack && S.master && S.followers.size && !S.flattening;
    return { cls: '', text: 'Not copying', act: ready ? 'start' : 'open', label: ready ? 'Start' : 'Open' };
  }
  function renderStatus(gate) {
    const say = _root.querySelector('#st-say'),
      sub = _root.querySelector('#st-sub');
    const m = S.master && S.byId[S.master],
      nf = S.followers.size;
    const who = m ? `<em>${esc(shortName(m))}</em> to ${nf} follower${nf === 1 ? '' : 's'}` : '';
    const st = dayStats(),
      opts = [S.fast && 'fast mode', S.capFit && 'cap-to-fit'].filter(Boolean);
    let sayHtml, subTxt;
    if (gate === 'failed') {
      sayHtml = "Copying is off until Vest's site passes the check.";
      subTxt = 'Your accounts and positions are untouched';
    } else if (gate && gate !== 'clear') {
      sayHtml = "Checking Vest's update…";
      subTxt = 'Copying waits until the check passes';
    } else if (!Object.keys(S.byId).length) {
      sayHtml = 'Loading your accounts…';
      subTxt = '';
    } else if (S.armed || S.arming) {
      sayHtml = `${S.arming ? 'Starting to copy' : 'Copying'} ${who}`;
      const l = st.last;
      subTxt = l
        ? `Last copy ${l.pending ? 'sending…' : `${l.done} of ${l.of} ${l.verb}`} · ${hhmm(l.at)}`
        : "Waiting for the master's next order";
    } else if (m && nf) {
      sayHtml = `Ready to copy ${who}`;
      subTxt =
        st.copies || st.missed
          ? `${st.copies}${st.complete ? '' : '+'} copies today, ${st.missed} missed`
          : 'Nothing copied yet today';
    } else if (m) {
      sayHtml = `Pick followers for <em>${esc(shortName(m))}</em>`;
      subTxt = 'Tick the accounts that copy it';
    } else {
      sayHtml = 'Pick a master and followers';
      subTxt = 'The master is the account you trade on';
    }
    if (subTxt && opts.length) subTxt += ' · ' + opts.join(' · ');
    if (say.dataset.html !== sayHtml) say.innerHTML = say.dataset.html = sayHtml;
    if (sub.textContent !== subTxt) sub.textContent = subTxt;
    const armBtn = _root.querySelector('[data-act="arm"]');
    // Stop copying is never blocked; Start needs a master, a follower and no gate (from any view).
    armBtn.disabled = S.armed ? false : S.arming || !!gate || !(S.master && S.followers.size);
    const label = S.armed ? 'Stop copying' : S.arming ? 'Starting…' : 'Start copying';
    if (armBtn.dataset.label !== label) {
      armBtn.dataset.label = label;
      armBtn.innerHTML = `${S.armed ? ICON.pause : ICON.play}<span>${label}</span>`;
    }
    armBtn.classList.toggle('armed', S.armed);
    const flat = _root.querySelector('[data-act="flatall"]');
    flat.disabled = S.flattening;
    flat.textContent = S.flattening ? 'Flattening…' : 'Flatten all';
    const p = pillState(),
      tag = _root.querySelector('#armtag');
    tag.className = 'pill ' + p.cls;
    tag.querySelector('.ptext').textContent = p.text;
    const slow = _root.querySelector('#slowest');
    if (slow) slow.textContent = st.slowest ? `${st.slowest} ms` : '—';
  }

  // The Copier tab: the master, its followers and the accounts left out, one line each (room to the floor and a dot);
  // the picks change in Edit, only while not copying. With nothing picked yet, it opens in Edit.
  const NEAR_FLOOR = 0.3; // less than 30% of an account's drawdown allowance left: flagged (it still copies)
  const roomFrac = (r) => {
    const allow = r.size - r.floor;
    return allow > 0 && !isNaN(r.room) ? Math.max(0, Math.min(1, r.room / allow)) : NaN;
  };
  const inTrade = (id) => {
    const st = S.acctState[id];
    return !!(st && st.positions && st.positions.length);
  };
  // Whole dollars from $1,000 up (rounded down, so room is never overstated); cents below, where they matter.
  const moneyShort = (n) =>
    isNaN(n)
      ? '—'
      : Math.abs(n) >= 1000
        ? (n < 0 ? '−' : '') + '$' + Math.floor(Math.abs(n)).toLocaleString('en-US')
        : money(n);
  // An account row's tooltip: balance, the floor that applies (the daily one when it's higher) and the room to it.
  const acctTip = (r) =>
    (r.name ? `${r.base} · ` : '') + // a named account: its number on hover
    `Balance ${money(r.equity)} · ${r.dailyFloor > r.floor ? 'daily floor' : 'floor'} ${money(floorOf(r))} · ${money(r.room)} to go` +
    (r.canTrade === false ? ' · trading disabled' : '');
  function renderCopier(body) {
    const rows = Object.values(S.byId);
    if (!rows.length) {
      body.innerHTML = `<div class="empty">No active accounts found.</div>`;
      return;
    }
    if (S.armed || S.arming) S.editing = false;
    else if (!S.master || !S.followers.size) S.editing = true; // nothing to copy yet: pick first
    if (S.editing) return renderEdit(body);
    const m = S.byId[S.master];
    const row = (r, kind, note = '') => {
      const f = roomFrac(r),
        near = f < NEAR_FLOOR;
      const live = S.armed && kind !== 'out' && inTrade(r.id);
      const dot = r.canTrade === false ? 'bad' : kind === 'out' ? 'hollow' : live ? 'live' : '';
      const dotTip =
        r.canTrade === false ? 'Trading disabled' : kind === 'out' ? 'Not copied' : live ? 'In a trade' : 'Flat';
      const tag = r.chip === 'Funded' ? '' : `<small>${esc(r.chip)}</small>`;
      const warn = near && kind !== 'out' && !note ? `Only ${moneyShort(r.room)} to its floor.` : note;
      return `<div class="acct${kind === 'm' ? ' master' : ''}${kind === 'out' ? ' off' : ''}" title="${esc(acctTip(r))}">
          <span class="tile${kind === 'm' ? ' m' : ''}">${esc(acctNum(r.base))}</span><span class="nm">${esc(shortName(r))}${tag}</span>
          <span class="room"><span class="${near ? 'amber' : ''}">${moneyShort(r.room)}</span><span class="meter"><i class="${near ? 'warn' : ''}" style="width:${isNaN(f) ? 0 : Math.round(f * 100)}%"></i></span></span>
          <i class="sdot ${dot}" title="${dotTip}"></i>${warn ? `<span class="note${kind === 'out' ? ' dim' : ''}">${esc(warn)}</span>` : ''}</div>`;
    };
    const fl = rows.filter((r) => S.followers.has(r.id)).sort((a, b) => a.order - b.order);
    const out = rows.filter((r) => r.id !== S.master && !S.followers.has(r.id)).sort((a, b) => a.order - b.order);
    const why = (r) =>
      r.canTrade === false
        ? 'Trading is disabled on this account.'
        : !S.capFit && m && r.groupKey !== m.groupKey
          ? 'A different size: copying it needs Cap-to-fit.'
          : 'Not picked.';
    const locked = S.armed || S.arming;
    body.innerHTML = `<div class="cop">
        <div class="sech"><span class="eyebrow">Master</span><span class="eyebrow">Room to floor</span></div>
        <div class="accts">${row(m, 'm')}</div>
        <div class="sech"><span class="eyebrow">Followers · ${fl.length} ${S.armed ? 'copying' : 'ready'}</span>${
          locked
            ? '<span class="hint">Edit when not copying</span>'
            : '<button class="lnk" data-act="edit">Edit</button>'
        }</div>
        <div class="accts">${fl.map((r) => row(r, 'f')).join('')}</div>
        ${out.length ? `<div class="sech"><span class="eyebrow">Left out · ${out.length}</span></div><div class="accts">${out.map((r) => row(r, 'out', why(r))).join('')}</div>` : ''}
        <div class="legend"><span><i class="sdot live"></i>in a trade</span><span><i class="sdot"></i>flat</span><span><i class="sdot hollow"></i>not copied</span></div>
      </div>`;
    const ed = body.querySelector('[data-act="edit"]');
    if (ed)
      ed.onclick = () => {
        S.editing = true;
        render();
      };
  }
  // Edit: a radio for the master and a box per follower, by account size, plus the sizing switch. Only while not copying.
  function renderEdit(body) {
    const m = S.master && S.byId[S.master];
    const groups = m ? [...S.groups].sort((a, b) => (b.key === m.groupKey) - (a.key === m.groupKey)) : S.groups;
    const n = Object.keys(S.byId).length;
    const row = (r, masterGroup) => {
      const isM = S.master === r.id,
        isF = S.followers.has(r.id);
      const fDisabled = !S.master || isM || (!S.capFit && !masterGroup) || r.canTrade === false || S.armed;
      const label = esc(shortName(r)),
        id = esc(r.id),
        f = roomFrac(r);
      const note =
        r.canTrade === false
          ? 'Trading is disabled on this account.'
          : !isM && f < NEAR_FLOOR
            ? `Only ${moneyShort(r.room)} to its floor.${isF ? '' : ' Tick to copy it anyway.'}`
            : '';
      return `<div class="acct ed${isM ? ' master' : ''}" title="${esc(acctTip(r))}">
          <span class="tile${isM ? ' m' : ''}">${esc(acctNum(r.base))}</span><span class="nm">${label}${r.chip === 'Funded' ? '' : `<small>${esc(r.chip)}</small>`}</span>
          <button class="rd${isM ? ' on' : ''}" data-m="${id}" role="radio" aria-checked="${isM}" aria-label="Make ${label} the master"
            title="Make ${label} the master" ${r.canTrade === false || S.armed ? 'disabled' : ''}></button>
          ${
            isM
              ? '<span class="ckm">—</span>'
              : `<button class="ck${isF ? ' on' : ''}" data-f="${id}" role="checkbox" aria-checked="${isF}" aria-label="Copy the master to ${label}"
            title="${!S.master ? 'Pick a master first' : !S.capFit && !masterGroup ? 'A different size: needs Cap-to-fit' : `Copy the master to ${label}`}" ${fDisabled ? 'disabled' : ''}>${ICON.check}</button>`
          }${note ? `<span class="note">${esc(note)}</span>` : ''}</div>`;
    };
    body.innerHTML = `<div class="cop">
        <div class="sech"><span class="h">Choose accounts</span>${
          S.master && S.followers.size ? '<button class="armbtn sm" data-act="edit-done">Done</button>' : ''
        }</div>
        <div class="acct ed head"><span></span><span class="eyebrow">${n} account${n === 1 ? '' : 's'}</span><span class="eyebrow">Master</span><span class="eyebrow">Copy</span></div>
        ${groups
          .map((g) => {
            const masterGroup = !!m && m.groupKey === g.key;
            return `${S.groups.length > 1 ? `<div class="sech"><span class="eyebrow">${moneyShort(g.size)} · ${esc(g.type)}</span></div>` : ''}<div class="accts">${g.rows.map((r) => row(r, masterGroup)).join('')}</div>`;
          })
          .join('')}
        <div class="sech"><span class="eyebrow">Sizing</span><div class="seg" data-sizing><button data-v="1" class="${S.capFit ? '' : 'on'}">1:1</button><button data-v="cap" class="${S.capFit ? 'on' : ''}">Cap-to-fit</button></div></div>
        <div class="hint">${
          S.capFit
            ? 'Cap-to-fit: each follower is sized to its own equity, so different sizes can copy.'
            : '1:1: followers copy the exact size, so they must be the same size and type as the master.'
        } Followers are set to the master's leverage when you start.</div>
      </div>`;
    body.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => setMaster(b.getAttribute('data-m'))));
    body.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => toggleFollower(b.getAttribute('data-f'))));
    body
      .querySelectorAll('[data-sizing] button')
      .forEach((b) => (b.onclick = () => (b.dataset.v === 'cap') !== S.capFit && toggleCapFit()));
    const done = body.querySelector('[data-act="edit-done"]');
    if (done)
      done.onclick = () => {
        S.editing = false;
        render();
      };
  }

  function render() {
    if (!_root) return;
    renderHealth();
    const panel = _root.querySelector('.panel'),
      body = _root.querySelector('.body');
    const gate = siteGate(); // Vest updated: the check takes the body
    panel.classList.toggle('gated', !!gate);
    const view = currentView(),
      sheet = !gate && SHEETS[view] ? view : null;
    panel.classList.toggle('sheet', !!sheet);
    const ask = !gate && codeAskDue(); // the code question takes the panel, like the terms before it
    panel.classList.toggle('first', ask || (!gate && view === 'rules' && !S.ack));
    _root.querySelector('#sheett').textContent = sheet ? SHEETS[sheet] : '';
    // the Trade, Share, Help and first-run views keep their DOM between renders (typing, a ticked box)
    const keeps =
      ask || (!gate && (S.tradeOpen || S.supportOpen || S.shareOpen || (S.rulesOpen && !S.settingsOpen && !S.ack)));
    if (!keeps || S.siteOpen) body.dataset.view = '';
    if (!gate && !S.siteOpen) delete body.dataset.check;
    if (gate) renderGate(body, gate);
    else if (ask) renderCodeAsk(body);
    else if (S.siteOpen) renderSiteCheck(body);
    else if (S.shareOpen) renderShare(body);
    else if (S.supportOpen) renderSupportTab(body);
    else if (S.tradeOpen) renderTrade(body);
    else if (S.settingsOpen) renderSettings(body);
    else if (S.appearOpen) renderAppearance(body);
    else if (S.rulesOpen) renderRules(body);
    else if (S.summaryOpen) renderSummary(body);
    else renderCopier(body);
    renderStatus(gate);
    _root.querySelectorAll('.tab[data-tab]').forEach((b) => {
      b.classList.toggle('on', b.dataset.tab === view);
      b.setAttribute('aria-selected', String(b.dataset.tab === view));
    });
    renderLog();
    place();
    renderDock();
    showOnThisPage();
  }

  // The check list: required checks, then the extras (which never block copying).
  function siteRows(site) {
    const rows =
      site && site.results.length
        ? site.results
        : SITE_CHECKS.map(([key, name, tier]) => ({ key, name, tier, status: 'pending', detail: '' }));
    const shown = site && site.shown != null ? site.shown : rows.length; // rows not revealed yet still wait
    const dot = { pass: 'green', warn: 'amber', fail: 'red', skip: 'gray', pending: 'gray' };
    const row = (r) => {
      const i = rows.indexOf(r),
        active = i === shown && site && site.running,
        status = i < shown ? r.status : 'pending',
        detail = i < shown ? r.detail : active ? 'Checking…' : '';
      return `
          <div class="sc-row${active ? ' active' : ''}"><span class="dot ${dot[status]}${active ? ' pending' : ''}"></span>
            <div><div class="sc-name">${esc(r.name)}</div><div class="sc-detail">${esc(detail || '')}</div></div></div>`;
    };
    return `<div class="sc-list">${rows
      .filter((r) => r.tier === 'must')
      .map(row)
      .join('')}</div>
        <div class="sc-h">Extras · never block copying</div>
        <div class="sc-list">${rows
          .filter((r) => r.tier !== 'must')
          .map(row)
          .join('')}</div>`;
  }
  // While the check runs, keep the row being checked in view; on a new screen (the verdict), back to the top.
  function followCheck(body, top, screen) {
    if (body.dataset.check !== screen) {
      body.dataset.check = screen;
      body.scrollTop = 0;
      return;
    }
    body.scrollTop = top; // the list was just redrawn: stay where it was
    const el = body.querySelector('.sc-row.active');
    if (!el) return;
    const r = el.getBoundingClientRect(),
      b = body.getBoundingClientRect();
    if (r.bottom > b.bottom - 8) body.scrollTop += r.bottom - b.bottom + 24;
    else if (r.top < b.top) body.scrollTop -= b.top - r.top + 8;
  }
  // The site check from the status bar, on an accepted build: the latest results, Re-run and Close.
  function renderSiteCheck(body) {
    const site = S.site,
      top = body.scrollTop;
    body.innerHTML = `
      <div class="rules">
        <div class="sc-sub">Vest build ${esc(fingerprint() || 'unknown')}. Runs by itself whenever Vest updates its site. Read-only: nothing is sent to your accounts.</div>
        ${siteRows(site)}
        <div class="rules-btns">
          <button class="ghostbtn" id="sc-run" ${site && site.running ? 'disabled' : ''}>Re-run</button>
          <button class="ghostbtn" id="sc-close">Close</button>
        </div>
      </div>`;
    followCheck(body, top, site && site.running ? 'site-run' : 'site');
    body.querySelector('#sc-run').onclick = () => runSiteCheck();
    body.querySelector('#sc-close').onclick = () => {
      S.siteOpen = false;
      render();
    };
  }
  // In place of the tabs while Vest's update isn't accepted (siteGate): checking, waiting, failed, then "All clear".
  function renderGate(body, g) {
    const s = S.site,
      top = body.scrollTop;
    const [title, sub] = {
      checking: [
        'Vest updated its site',
        'Checking that the copier still works with it. Takes a few seconds. Read-only: nothing is sent to your accounts.',
      ],
      waiting: [
        'Vest updated its site',
        s && s.wait === 'session'
          ? 'Log in to Vest: the check runs by itself once your session loads.'
          : 'The check runs by itself once Vest lists an active account to read from.',
      ],
      failed: [
        'Copying is off',
        "Vest changed something the copier relies on (in red below). Copying, Trade-tab orders, automatic breakeven and claims stay off until a copier update fixes it: trade from Vest's own panel meanwhile. Flatten all still works.",
      ],
      clear: ['All clear', "The copier works with Vest's update."],
    }[g] || ['Vest updated its site', 'Checking that the copier still works with it.']; // never a crash on a new state
    body.innerHTML = `
      <div class="gate gate-${g}">
        <div class="rules">
          <div class="gate-h">${esc(title)}</div>
          <div class="sc-sub">${esc(sub)}</div>
          ${g === 'waiting' ? '' : siteRows(s)}
          ${
            g === 'failed'
              ? `<div class="rules-btns">
            <button class="ghostbtn" id="sc-run">Check again</button>
            <button class="ghostbtn" id="sc-diag">Diag file</button>
            <button class="lnk" id="sc-help">Get help</button>
          </div>
          <div class="sc-note">Send the Diag file on Discord or GitHub. The fix arrives as a copier update.</div>`
              : ''
          }
        </div>
      </div>`;
    followCheck(body, top, 'gate-' + g);
    if (g !== 'failed') return;
    body.querySelector('#sc-run').onclick = () => runSiteCheck();
    body.querySelector('#sc-diag').onclick = () => downloadDiag();
    body.querySelector('#sc-help').onclick = () => openReport();
  }

  // ───────────────────────── trade panel UI ─────────────────────────
  // Built once, then only the computed numbers update, so the balance poll never wipes what you're typing. Keystrokes
  // are kept from reaching Vest's own keyboard shortcuts.
  const fmtPx = (n, tick) =>
    n > 0
      ? n.toLocaleString('en-US', { minimumFractionDigits: decimalsOf(tick), maximumFractionDigits: decimalsOf(tick) })
      : '—';
  const fmtUsd = (n) => money(Math.abs(n) || 0);

  // ── What the account can do: the master's open positions and resting orders and every account's saved leverage, read
  // while the Trade tab is open (when it opens, with each balance poll, and after each order). The max size, the fail and
  // pass prices and the warnings are worked out from them, the way Vest's own ticket does.
  S.acctState = {}; // accountId -> { positions: [{ symbol, side, qty, openPrice, collateral }], ordersCollateral, at }
  S.levs = null; // saved leverage by account and symbol (GET /v3/user-state)
  let _tradeStateBusy = false;
  async function refreshTradeState() {
    const master = S.master;
    if (!master || _tradeStateBusy || !userTokenOk()) return;
    _tradeStateBusy = true;
    const t0 = Date.now();
    try {
      const [levs, st, bals] = await Promise.all([
        fetchLeverages(),
        readOpenState(master),
        fetchBalances().catch(() => null), // free cash read with the positions, so the two match after a fill
      ]);
      if (levs) S.levs = levs;
      if ((_feedAt[master] || 0) >= t0) return; // the live feed already has newer positions and cash
      const r0 = S.byId[master],
        free = bals && bals.free[master];
      if (r0 && free >= 0 && !(bals.ver[master] < (r0.balVer || 0))) {
        r0.free = free;
        if (bals.ver[master] >= 0) r0.balVer = bals.ver[master];
      }
      // keep what the live P&L ticks from (cash and the last marks), as refreshBalances sets it: without cash the P&L
      // tab stopped moving the master's open profit until the next balance read
      const prev = S.acctState[master],
        r = S.byId[master];
      if (r && r.free >= 0) st.cash = r.free + st.positions.reduce((a, p) => a + p.collateral, 0) + st.ordersCollateral;
      st.marks = (prev && prev.marks) || {};
      S.acctState[master] = st;
    } catch {
      /* best effort: nothing to do if this fails */
    } finally {
      _tradeStateBusy = false;
    }
    updateTrade();
  }
  // An account's equity and open PnL with `sym` at `px`, live where possible: cash (free + the collateral held by its
  // positions and orders) plus each position's PnL. Positions on other markets keep the last performance-series figure.
  // Without fresh positions it falls back to the polled equity.
  function liveAccount(id, sym, px) {
    const r = S.byId[id],
      st = S.acctState[id];
    if (!r) return { equity: NaN, upnl: 0 };
    if (!stateFresh(st) || !(r.free >= 0) || !(px > 0)) return { equity: r.equity, upnl: r.upnl || 0 };
    const here = st.positions.filter((p) => p.symbol === sym);
    const upHere = here.reduce((a, p) => a + (p.side === 'long' ? 1 : -1) * p.qty * (px - p.openPrice), 0);
    const upnl = upHere + (st.positions.length > here.length ? (r.upnl || 0) - upHere : 0);
    const cash = r.free + st.positions.reduce((a, p) => a + p.collateral, 0) + st.ordersCollateral;
    return { equity: cash + upnl, upnl };
  }

  /**
   * Everything the Trade tab shows or would send, from the current settings and the live price. Pure apart from
   * reading state.
   *
   * @param {object} [setup] a trade setup to work out (default: the Trade tab's own, `S.trade`)
   * @param {object} [levs] every account's saved leverage (default: the Trade tab's last read, `S.levs`)
   * @returns {object} sizes, prices, limits, warnings and fixes for the Trade tab (see the return at the end)
   */
  function tradeCalc(setup, levs = S.levs) {
    const t = setup || S.trade,
      fixedUnit = setup && setup.unit && MICRO_UNITS[setup.symbol] ? setup.unit : null,
      sym = t.symbol,
      meta = SYMBOLS[sym],
      price = priceOf(sym),
      fee = meta.takerFee || 0,
      master = S.master && S.byId[S.master] ? S.master : null,
      // whole minis or micros when sizing in them (a stop entry: the unit it was placed in), else the market's step
      step = fixedUnit ? unitStep(meta.step, MICRO_UNITS[sym], fixedUnit) : unitSize(sym);
    const st = master && S.acctState[master];
    const held = (stateFresh(st) && st.positions.find((p) => p.symbol === sym)) || null;
    const live = master ? liveAccount(master, sym, price) : null;

    // Max size: Vest's 100% for the master and, in strict 1:1 while armed, for every follower too (they copy the same
    // size), so the smallest of them. Followers copy at the master's leverage. Cap-to-fit scales followers to fit.
    const lev = master ? orderLeverage(levFor(levs, master, sym), maxLeverageFor(sym, master)) : null;
    const mpx = marginPriceOf(sym);
    let maxQty = null,
      limitedBy = null;
    if (master && lev > 0 && mpx > 0) {
      for (const id of [master, ...(S.armed && !S.capFit ? [...S.followers] : [])]) {
        const r = S.byId[id];
        if (!r || !(r.free >= 0)) {
          maxQty = limitedBy = null; // a balance couldn't be read: no max rather than a wrong one
          break;
        }
        const upnl = id === master ? live.upnl : r.upnl;
        const q = maxQtyFor(tradingPower({ free: r.free, upnl, leverage: lev, takerFee: fee }), mpx, step);
        if (maxQty === null || q < maxQty) [maxQty, limitedBy] = [q, id];
      }
    }

    // Room before the floor on the tightest account that copies the same size: the master, plus followers in strict
    // 1:1 while armed (their live equity from the balance poll).
    const rm = master && S.byId[master];
    let riskRoom = rm && live ? live.equity - floorOf(rm) : null,
      riskBy = master;
    if (master && S.armed && !S.capFit)
      for (const id of S.followers) {
        const f = S.byId[id];
        if (f && f.equity > 0 && riskRoom !== null && f.equity - floorOf(f) < riskRoom)
          [riskRoom, riskBy] = [f.equity - floorOf(f), id];
      }

    // In a trade: the Scale chips size both buttons from the open position: 25%, 50%, 100% of it, or MAX (adds only:
    // the largest add that fits both Vest's buying power and a stop-out above the floor, fees counted). An add or a
    // reduce changes the size only: the stop and targets stay where they are (the trader moves them on the chart), so a
    // stop-out after an add is measured at the stop as it is. Without a stop, only the margin limits an add.
    const heldSl = held && (held.triggers || []).find((x) => x.kind === 'sl');
    const addStop = () => (heldSl ? heldSl.price : null);
    let chips = null,
      pick = null;
    if (held && price > 0) {
      const lossFor = (a) =>
        heldSl
          ? stopOutLoss({
              side: held.side,
              qty: held.qty + a,
              price,
              stopPrice: heldSl.price,
              openFee: a * price * fee,
              takerFee: fee,
            })
          : null;
      const fits = (a) => riskRoom === null || !heldSl || lossFor(a) < riskRoom;
      const chip = (key, label, a) => ({
        key,
        label,
        qty: a,
        // why an ADD of this size can't go (a reduce of it still can)
        why: !(a > 0)
          ? key === 'max'
            ? 'no room'
            : 'too small'
          : maxQty !== null && a > maxQty + meta.step / 2
            ? 'over margin'
            : !fits(a)
              ? 'stop-out fails' // the stop hit after this add would end below the floor (not: already at it)
              : null,
      });
      let best = maxQty !== null && maxQty > 0 ? maxQty : 0;
      if (best > 0 && heldSl && riskRoom !== null) {
        let lo = 0,
          hi = best;
        for (let i = 0; i < 40; i++) {
          const mid = (lo + hi) / 2;
          fits(mid) ? (lo = mid) : (hi = mid);
        }
        best = lo;
      }
      chips = [
        chip('25', '25', floorStep(held.qty * 0.25, step)),
        chip('50', '50', floorStep(held.qty * 0.5, step)),
        chip('100', '100', floorStep(held.qty, step)),
        chip('max', 'MAX', floorStep(best, step)),
      ];
      pick = chips.find((x) => x.key === (S.addPick || '25')) || chips[0];
    }
    // The stop and the targets are optional (on by default): without a stop, nothing sizes from it (Risk $ is off) and
    // a stop-out has no price, so the fail price is the line to watch.
    const stopOn = t.stopOn !== false,
      stopArg = stopOn ? +t.stopPts : null;
    const byMax = t.sizeMode === 'max' || t.sizeMode === 'pct'; // sized from Vest's max
    const qty = pick
      ? pick.qty
      : t.sizeMode === 'max'
        ? maxQty || 0
        : t.sizeMode === 'pct'
          ? floorStep(((maxQty || 0) * Math.min(100, +t.pct || 0)) / 100, step)
          : t.sizeMode === 'risk'
            ? stopOn
              ? riskQty(+t.risk, +t.stopPts, meta.pointValue, step)
              : 0
            : floorStep(+t.qty || 0, step);
    const split = t.targets.length ? splitQty(qty, t.targets.length, t.scale, step) : { qtys: [] };
    const long = planPrices({
      side: 'long',
      entry: price,
      stopPts: stopArg,
      targetPts: t.targets.map(Number),
      tick: meta.tick,
    });
    const short = planPrices({
      side: 'short',
      entry: price,
      stopPts: stopArg,
      targetPts: t.targets.map(Number),
      tick: meta.tick,
    });
    const qtys = split.qtys || [];
    const risk = stopOn ? qty * (+t.stopPts || 0) * meta.pointValue : 0;
    const reward = qtys.reduce((sum, q, i) => sum + q * (+t.targets[i] || 0) * meta.pointValue, 0);
    const openFee = price > 0 ? qty * price * fee : 0;
    // in and out at the stop (without one, out at the price now)
    const fees = price > 0 ? openFee + qty * Math.max(0, price - (stopOn ? +t.stopPts || 0 : 0)) * fee : 0;

    // Fail / pass prices and the stop-out cost per side, for the whole position after this order (an add is measured
    // from the new average entry, as the ladder is rebuilt).
    const r = master && S.byId[master];
    const floor = r ? floorOf(r) : 0;
    const outcome = (side) => {
      if (!r || !(price > 0) || !(qty > 0) || (held && held.side !== side)) return null;
      const total = (held ? held.qty : 0) + qty,
        dir = side === 'long' ? 1 : -1;
      const avg = held ? (held.qty * held.openPrice + qty * price) / total : price;
      const fp = failPassPrices({ side, qty: total, price, equity: live.equity, openFee, floor, target: r.target });
      // an add leaves the stop where it is; no stop, no stop-out to price
      const stopPrice = held ? addStop() : stopOn ? avg - dir * (+t.stopPts || 0) : null;
      const loss = stopPrice > 0 ? stopOutLoss({ side, qty: total, price, stopPrice, openFee, takerFee: fee }) : null;
      return { ...fp, loss, room: live.equity - floor };
    };
    const sides = { long: outcome('long'), short: outcome('short') };

    let error = null;
    // In a trade the setup (size mode, stop, targets, Auto BE) is for the next new trade: an add is held to its size,
    // the price and the margin only (it leaves the stop and targets as they are).
    const fresh = !held;
    if (!master) error = 'Pick a master account (M) first.';
    else if (fresh && t.sizeMode === 'pct' && !(+t.pct > 0 && +t.pct <= 100)) error = 'Use 1 to 100%.';
    else if (fresh && byMax && maxQty === null)
      error = price > 0 ? 'Working out the max size…' : 'Waiting for a live price…';
    else if (fresh && byMax && !(maxQty > 0))
      error = `No trading power left on ${accLabel(limitedBy)} for ${meta.label} at ${lev}x.`;
    else if (fresh && t.sizeMode === 'risk' && !stopOn)
      error = 'Risk $ sizes from the stop: add the stop back, or size in Qty or Max.';
    else if (!(qty > 0))
      error = held
        ? 'Too small to add.'
        : t.sizeMode === 'risk'
          ? 'Risk and stop must be above zero.'
          : t.sizeMode === 'pct'
            ? `${+t.pct}% of the max is less than one ${tradeUnit(sym) === 'units' ? 'size step' : tradeUnit(sym)}.`
            : 'Size must be above zero.';
    else if (fresh && split.error) error = split.error;
    else if (!(price > 0)) error = 'Waiting for a live price…';
    else if (fresh && long.error) error = long.error;
    else if (fresh && stopOn && t.beMode === 'points' && !(+t.beTrigger > 0))
      error = 'Breakeven trigger must be above zero points.';
    if (master && pick && pick.why)
      error =
        pick.why === 'stop-out fails'
          ? `Add ${pick.label}%: a stop-out would end ${riskBy === master ? 'below the' : `${accLabel(riskBy)} below its`} ${fmtUsd(floorOf(S.byId[riskBy]))} floor.`
          : `Add ${pick.label}%: ${pick.why}.`;

    // The allowed range for this account now: where the stop may go and how much can be risked (new positions; an add
    // is held to Vest's max only, since its room depends on the position already open).
    const stopPts = +t.stopPts || 0,
      room = r && live ? live.equity - floor : null;
    const limits = !stopOn
      ? { minStop: null, maxRiskAtStop: null, maxRiskRoom: null, maxStop: null }
      : {
          minStop: t.sizeMode === 'risk' ? minStopFor(+t.risk, maxQty, meta.tick) : null,
          maxRiskAtStop: maxRiskAt(maxQty, stopPts),
          maxRiskRoom: held ? null : maxRiskForRoom({ room, price, stopPts, takerFee: fee }),
          maxStop:
            held || t.sizeMode === 'risk' ? null : maxStopForRoom({ room, qty, price, takerFee: fee, tick: meta.tick }),
        };

    // Over Vest's max, the order is accepted but never filled: Buy and Sell are blocked, with one-click fixes.
    let blocked = null;
    const fixes = [];
    if (!error && maxQty !== null && t.sizeMode !== 'max' && qty > maxQty + meta.step / 2) {
      blocked = `${fmtQty(qty, sym)} is more than ${accLabel(limitedBy)} can open at ${lev}x (max ${fmtQty(maxQty, sym)}), so Vest wouldn't fill it.`;
      if (t.sizeMode === 'risk') {
        if (limits.minStop)
          fixes.push({ act: 'stop', value: limits.minStop, label: `Set stop to ${limits.minStop} pts` });
        if (limits.maxRiskAtStop > 0)
          fixes.push({
            act: 'risk',
            value: limits.maxRiskAtStop,
            label: `Risk ${money(limits.maxRiskAtStop)} instead`,
          });
      } else fixes.push({ act: 'max', label: `Use max (${fmtQty(maxQty, sym)})` });
    }

    // The Trade tab's two bars. Margin: how much of Vest's buying power the open position uses now and with this order
    // (the max above is what's left, on the tightest account). Risk: what the stop would lose, fees included, now and with
    // this order (an add keeps the stop where it is, so it's measured from the new average), against the room left before the floor on the tightest
    // account that copies the same size (the master, plus followers in strict 1:1 while armed).
    const heldQty = held ? held.qty : 0;
    const margin =
      maxQty === null
        ? null
        : {
            now: heldQty / (heldQty + maxQty || 1),
            after: (heldQty + (qty > 0 ? qty : 0)) / (heldQty + maxQty || 1),
            left: maxQty - (qty > 0 ? qty : 0),
          };
    const heldStop = held && (held.triggers || []).find((x) => x.kind === 'sl');
    const risk2 = {
      room: riskRoom,
      by: riskBy,
      now: !held
        ? 0
        : heldStop && price > 0
          ? stopOutLoss({ side: held.side, qty: held.qty, price, stopPrice: heldStop.price, openFee: 0, takerFee: fee })
          : null, // an open position without a stop
      after: (held ? sides[held.side] : sides.long) ? (held ? sides[held.side] : sides.long).loss : null,
    };

    // Warnings: the order can go, but it's probably not what you want.
    const warnings = [];
    const risky = held ? sides[held.side] : sides.long; // a new position's stop-out costs the same either way
    if (!error && fresh && !stopOn) {
      const side = S.ladSide || 'long',
        f = sides[side] && sides[side].fail;
      warnings.push({
        kind: 'nostop',
        text: `No stop: nothing closes this trade for you.${f ? ` If you ${side === 'long' ? 'buy' : 'sell'}, the account fails at ${fmtPx(roundTick(f, meta.tick), meta.tick)}.` : ''}`,
      });
    }
    if (!error && risky && risky.room > 0 && risky.loss >= risky.room)
      warnings.push({
        kind: 'fail',
        text: `A stop-out would lose about ${fmtUsd(risky.loss)} with fees, more than the ${fmtUsd(risky.room)} left to the ${
          r.dailyFloor > r.floor ? 'daily ' : ''
        }floor: the account fails before the stop fills. Use a smaller size or a closer stop.`,
      });
    return {
      t,
      meta,
      price,
      pick,
      qty,
      qtys,
      long,
      short,
      risk,
      reward,
      fees,
      lev,
      maxQty,
      limitedBy,
      held,
      sides,
      limits,
      blocked,
      fixes,
      warnings,
      error,
      margin,
      risk2,
      chips,
      stopOn,
    };
  }

  function renderTrade(body) {
    if (body.dataset.view === 'trade' && body.querySelector('.trade')) return updateTrade();
    body.dataset.view = 'trade';
    const t = S.trade;
    const seg = (key, opts) =>
      `<div class="seg" data-seg="${key}">${opts.map(([v, l]) => `<button data-v="${v}">${l}</button>`).join('')}</div>`;
    body.innerHTML = `
      <div class="trade">
        <div class="tr-top">
          <div class="tr-sym" id="tr-sym"></div>
          <div class="tr-px" id="tr-px">—</div>
        </div>
        <div class="tr-poscard" id="tr-pos" hidden>
          <div class="tr-posbar"><span class="tr-side" id="tr-pside"></span><span class="tr-pq" id="tr-pqty"></span><span class="tr-ppl" id="tr-ppl"></span></div>
          <div class="tr-pmeta"><span id="tr-pavg"></span><span id="tr-ppts"></span></div>
          <div class="tr-brk" id="tr-brk"></div>
          <div class="tr-lvls" id="tr-lvls"></div>
          <div class="tr-prisk" title="What the stop would lose from here, fees included, against the room left before the floor (tightest account)">
            <div class="tr-pn"><span>Risk</span><span id="tr-prisk"></span></div><div class="tr-track"><i id="tr-prnow"></i></div></div>
        </div>
        <div class="tr-pacts" id="tr-pacts" hidden>
          <div class="tr-legs" id="tr-legs"><button class="tr-legbtn" id="tr-addsl" title="Add a stop to this trade: click the chart where it goes, or press Enter for your saved stop points">+ Add stop</button><button class="tr-legbtn" id="tr-addtp" title="Add a target: click the chart where it goes, or press Enter for your saved points. The targets split the position by the trade's split">+ Add target</button></div>
          <div class="tr-go"><button class="tr-bebtn" id="tr-be">Breakeven</button><button class="tr-close" id="tr-close">Close</button></div>
          <button class="tr-disc" id="tr-addfold" aria-expanded="false"><span>Add or reduce</span>${ICON.right}</button>
          <div class="tr-addbox" id="tr-addbox" hidden>
            <div class="tr-chips" id="tr-chips"></div>
            <div class="tr-go tr-scale"><button class="tr-buy" id="tr-addbtn">Add</button><button class="tr-redbtn" id="tr-reduce">Reduce</button></div>
            <div class="tr-addpv" id="tr-addpv"></div>
          </div>
          <div class="tr-copies" id="tr-copies"></div>
        </div>
        <div class="tr-lims" id="tr-lims">
          <div class="tr-lb"><div class="tr-ln"><span class="tr-lk">Margin</span><span class="tr-lt" id="tr-mtxt"></span></div>
            <div class="tr-track"><i class="pv" id="tr-mpv"></i><i id="tr-mnow"></i></div></div>
          <div class="tr-lb"><div class="tr-ln"><span class="tr-lk">Risk</span><span class="tr-lt" id="tr-rtxt"></span></div>
            <div class="tr-track"><i class="pv" id="tr-rpv"></i><i id="tr-rnow"></i></div></div>
          <div class="tr-tight" id="tr-tight"></div>
        </div>
        <div class="tr-setup" id="tr-setup">
          <div class="tr-f"><span class="tr-k">Order</span><div class="tr-row">${seg('orderType', [
            ['market', 'Market'],
            ['limit', 'Limit'],
            ['stop', 'Stop'],
          ])}<button class="tr-lines" id="tr-lines" role="switch" aria-checked="false"
            title="Show or hide your entry, stop and targets on Vest's chart (same as Appearance → Bracket on the chart)"><span>Lines</span><span class="knob"><i></i></span></button></div></div>
          <div class="tr-f" id="tr-sliprow" hidden title="The most a stop order may fill past its price. Blank: a market order, which always fills, wherever the price is.">
            <span class="tr-k">Slip</span><div class="tr-row"><input class="tr-in sm" id="tr-slip" inputmode="decimal"
              aria-label="Max slip, in points" placeholder="—" value="${esc(t.slipPts)}"><span class="tr-sliptxt" id="tr-sliptxt"></span></div></div>
          <div class="tr-f"><span class="tr-k">Size</span><div class="tr-row">${seg('sizeMode', [
            ['qty', 'Qty'],
            ['risk', 'Risk $'],
            ['pct', '%'],
            ['max', 'Max'],
          ])}<input class="tr-in" id="tr-size" inputmode="decimal" aria-label="Size"><span class="tr-sizeq" id="tr-sizeq"></span></div></div>
          <div class="tr-f" id="tr-unitrow" hidden><span class="tr-k">In</span><div class="tr-row">${seg('unit', [
            ['units', 'Units'],
            ['micro', 'Micros'],
            ['mini', 'Minis'],
          ])}<span class="tr-u" id="tr-unitnote"></span></div></div>
          <div class="tr-ind">
            <div class="tr-calc" id="tr-sizecalc"></div>
            <div class="tr-lim" id="tr-sizelim"></div>
          </div>
          <div class="tr-lad side-long" role="table" aria-label="Stop, entry and targets">
            <div class="tr-lh"><span class="tr-flip" id="tr-lhs">If you buy</span><span id="tr-lhm">pts · qty · $</span><span id="tr-lhb">Buy at</span></div>
            <div class="tr-lr tr-ps" id="tr-passrow"><span class="tr-sp" id="ls-pass"></span><span class="tr-mid">Pass</span><span class="tr-bp" id="lb-pass"></span></div>
            <div id="tr-targets"></div>
            <div class="tr-lr tr-mk" id="tr-mkrow" hidden><span class="tr-sp"></span><span class="tr-mid" id="tr-mk">Price</span><span class="tr-bp" id="lb-mk"></span></div>
            <div class="tr-lr tr-en"><span class="tr-sp" id="ls-entry"></span><span class="tr-mid" id="tr-entry">Entry</span><span class="tr-bp" id="lb-entry"></span></div>
            <div class="tr-lr tr-slr" id="tr-slrow"><span class="tr-sp" id="ls-stop"></span><span class="tr-mid"><span class="tr-n sl">STOP</span>
              <input class="tr-in tr-pt" id="tr-stop" inputmode="decimal" aria-label="Stop, in points" value="${esc(t.stopPts)}">
              <span class="tr-q" id="tr-stopq"></span><span class="tr-g dn" id="tr-stopcalc"></span>
              <button class="tr-x" id="tr-stopx" title="Trade without a stop" aria-label="Remove the stop">×</button>
              <span class="tr-nostop">None <button class="lnk" id="tr-stopon" title="Put the stop back">+ stop</button></span></span><span class="tr-bp" id="lb-stop"></span></div>
            <div class="tr-lr tr-fl" id="tr-failrow"><span class="tr-sp" id="ls-fail"></span><span class="tr-mid">Fail</span><span class="tr-bp" id="lb-fail"></span></div>
          </div>
          <div class="tr-lim" id="tr-stoplim"></div>
          <div class="tr-fold"><span id="tr-splittxt"></span><button class="lnk" data-fold="split">Change</button><button class="lnk" id="tr-add" title="Add a target">+ target</button></div>
          <div class="tr-foldbox" data-foldbox="split" hidden><span class="tr-k">Split</span>${seg('scale', [
            ['start', 'Start'],
            ['even', 'Even'],
            ['end', 'End'],
          ])}</div>
          <div class="tr-fold"><span id="tr-betxt"></span><button class="lnk" data-fold="be">Change</button></div>
          <div class="tr-foldbox" data-foldbox="be" hidden><span class="tr-k">Auto BE</span><div class="tr-row">${seg(
            'beMode',
            [
              ['off', 'Off'],
              ['tp1', 'After TP1'],
              ['points', '+pts'],
            ],
          )}<span class="tr-be">
            <span id="tr-betrigw">at <input class="tr-in sm" id="tr-betrig" inputmode="decimal" aria-label="Breakeven trigger, in points" value="${esc(t.beTrigger)}"></span>
            lock <input class="tr-in sm" id="tr-beoff" inputmode="decimal" aria-label="Profit to lock, in points" title="Points of profit beyond the entry (0 = exact breakeven)" value="${esc(t.beOffset)}"></span></div></div>
          <div class="tr-sum" id="tr-sum"></div>
        </div>
        <div class="tr-warn" id="tr-warn"></div>
        <div class="tr-action">
          <div class="tr-err" id="tr-err"></div>
          <div class="tr-go" id="tr-mgo"><button class="tr-buy" id="tr-buy">Buy</button><button class="tr-sell" id="tr-sell">Sell</button></div>
          <div class="tr-go tr-lgo" id="tr-lgo" hidden>
            <button class="tr-lbuy" id="tr-lbuy">Buy limit</button><button class="tr-lsell" id="tr-lsell">Sell limit</button></div>
          <div class="tr-pick" id="tr-pick" hidden>
            <div class="tr-pickbar"><span id="tr-picktxt"></span><span class="tr-esc">Esc to cancel</span></div>
            <div class="tr-pickrow"><input class="tr-in" id="tr-lpx" inputmode="decimal" aria-label="Price" placeholder="price">
              <button class="tr-place" id="tr-place">Place</button><button class="tr-pcancel" id="tr-pcancel">Cancel</button></div>

          </div>
          <div class="tr-who" id="tr-who"></div>
        </div>
        <div class="tr-preview" id="tr-preview" hidden></div>
        <div class="tr-plans" id="tr-stops"></div>
        <div class="tr-plans" id="tr-plans"></div>
      </div>`;
    const wrap = body.querySelector('.trade');
    ['keydown', 'keyup', 'keypress'].forEach((ev) => wrap.addEventListener(ev, (e) => e.stopPropagation()));
    // A field that isn't a number is kept as '' (shown as an error), never as NaN.
    const parse = (el) => {
      const v = el.value.trim();
      return v !== '' && Number.isFinite(+v) ? +v : '';
    };
    const num = (el, key) =>
      el.addEventListener('input', () => {
        S.trade[key] = parse(el);
        saveTrade();
        updateTrade();
      });
    // The size box: dollars at risk, or the size in the chosen unit (kept in units: a micro of NQ is 2)
    const sizeEl = body.querySelector('#tr-size');
    fitQtyToUnit();
    const showSize = () =>
      (sizeEl.value =
        S.trade.sizeMode === 'risk'
          ? S.trade.risk
          : S.trade.sizeMode === 'pct'
            ? S.trade.pct
            : tradeUnit() === 'units'
              ? S.trade.qty
              : +((+S.trade.qty || 0) / unitSize()).toFixed(4));
    showSize();
    sizeEl.addEventListener('input', () => {
      const v = parse(sizeEl) || 0;
      if (S.trade.sizeMode === 'risk') S.trade.risk = v;
      else if (S.trade.sizeMode === 'pct') S.trade.pct = v;
      else S.trade.qty = tradeUnit() === 'units' ? v : +(v * unitSize()).toFixed(8);
      saveTrade();
      updateTrade();
    });
    num(body.querySelector('#tr-stop'), 'stopPts');
    // the stop is optional: × takes it off (the points are kept for when it comes back), + stop puts it back
    const stopOn = (on) => {
      if (!on && S.trade.sizeMode === 'risk') {
        // Risk $ sizes from the stop: keep the size it made, in Qty
        const q = tradeCalc().qty;
        if (q > 0) S.trade.qty = q;
        S.trade.sizeMode = 'qty';
      }
      S.trade.stopOn = on;
      saveTrade();
      showSize();
      updateTrade();
    };
    body.querySelector('#tr-stopx').onclick = () => stopOn(false);
    body.querySelector('#tr-stopon').onclick = () => stopOn(true);
    body.querySelector('#tr-lines').onclick = () => toggleOption('bracket');
    num(body.querySelector('#tr-betrig'), 'beTrigger');
    num(body.querySelector('#tr-beoff'), 'beOffset');
    body.querySelectorAll('[data-seg]').forEach((g) =>
      g.querySelectorAll('button').forEach(
        (b) =>
          (b.onclick = () => {
            if (b.classList.contains('off')) return toast(b.title); // Risk $ without a stop
            S.trade[g.dataset.seg] = b.dataset.v;
            if (g.dataset.seg === 'unit') {
              // the same size, in whole micros or minis (at least one)
              const u = unitSize();
              S.trade.qty = Math.max(u, floorStep(+S.trade.qty || 0, u));
            }
            if (g.dataset.seg === 'orderType' && b.dataset.v !== (S.pick && S.pick.kind)) stopPick(true);
            // a stop entry is usually sized as a share of what the account can open: Stop switches the size to %, as
            // close as it gets to the size that was showing (no jump to 25% of the max)
            if (g.dataset.seg === 'orderType' && b.dataset.v === 'stop' && S.trade.sizeMode !== 'pct') {
              const c0 = tradeCalc();
              if (c0.maxQty > 0 && c0.qty > 0)
                S.trade.pct = Math.min(100, Math.max(1, Math.round((c0.qty / c0.maxQty) * 100)));
              S.trade.sizeMode = 'pct';
            }
            saveTrade();
            if (['sizeMode', 'unit', 'orderType'].includes(g.dataset.seg)) showSize();
            updateTrade();
          }),
      ),
    );
    // The ladder shows one side's prices (the stop, targets and fail price differ for a buy and a sell): the side of the
    // button the pointer is on, or that has the keyboard, else the side last traded.
    const showSide = (side) => {
      if (S.ladSide === side) return;
      S.ladSide = side;
      updateTrade();
    };
    for (const [id, side] of [
      ['#tr-buy', 'long'],
      ['#tr-sell', 'short'],
    ]) {
      const b = body.querySelector(id);
      b.addEventListener('pointerenter', () => showSide(side));
      b.addEventListener('focus', () => showSide(side));
    }
    // the split and Auto BE fold to one line each; Change opens the controls
    body.querySelectorAll('[data-fold]').forEach(
      (b) =>
        (b.onclick = () => {
          const box = body.querySelector(`[data-foldbox="${b.dataset.fold}"]`);
          box.hidden = !box.hidden;
          b.textContent = box.hidden ? 'Change' : 'Done';
        }),
    );
    body.querySelector('#tr-addfold').onclick = () => {
      S.addOpen = !S.addOpen;
      updateTrade();
    };
    body.querySelector('#tr-add').onclick = () => {
      const last = +S.trade.targets[S.trade.targets.length - 1] || 0;
      S.trade.targets.push(last ? last + (+S.trade.targets[0] || DEFAULT_TARGET_PTS) : DEFAULT_TARGET_PTS);
      saveTrade();
      renderTargets(body);
      updateTrade();
    };
    // Buy / Sell: a market order, or with Limit picked, the price is picked on the chart (or typed)
    const go = (side) => {
      S.ladSide = side; // the ladder shows the side last traded
      const o = S.trade.orderType;
      return o === 'limit' || o === 'stop' ? startPick(side, o) : placeTrade(side);
    };
    body.querySelector('#tr-buy').onclick = () => go('long');
    body.querySelector('#tr-sell').onclick = () => go('short');
    body.querySelector('#tr-be').onclick = () => breakevenNow();
    body.querySelector('#tr-addsl').onclick = () => startLegPick('sl');
    body.querySelector('#tr-addtp').onclick = () => startLegPick('tp');
    body.querySelector('#tr-lbuy').onclick = () => startPick('long');
    body.querySelector('#tr-lsell').onclick = () => startPick('short');
    body.querySelector('#tr-place').onclick = () => placePick();
    body.querySelector('#tr-pcancel').onclick = () => stopPick();
    const lpx = body.querySelector('#tr-lpx');
    lpx.addEventListener('input', () => setPickPrice(parse(lpx), false));
    num(body.querySelector('#tr-slip'), 'slipPts');
    body.querySelector('#tr-close').onclick = () => closeNow();
    body.querySelector('#tr-addbtn').onclick = () => {
      const h = tradeCalc().held;
      if (h) placeTrade(h.side); // same direction while holding: an add
    };
    body.querySelector('#tr-reduce').onclick = () => reduceNow();
    renderTargets(body);
    followVestMarket();
    watchPrice(t.symbol);
    loadSymbolRules(t.symbol).then(updateTrade);
    refreshTradeState();
    updateTrade();
  }

  // ── Sending. The same order shape Vest's own ticket uses: market IOC, the stop as a full-position leg, and targets as
  // legs (one target covers the whole position with no quantity; several targets are sized legs adding up to the
  // order). Orders go through the page's hooked fetch, so an armed copier sees them as master orders and copies them
  // exactly like an order placed on Vest's ticket.
  const send = async (method, path, accountId, body) => {
    const { token } = await mintAccountToken(accountId);
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      ...idem(),
    };
    const r = await window.fetch(API + path, { method, headers, body: JSON.stringify(body) });
    const res = parseJson(await r.text(), {}) || {};
    if (!r.ok) {
      const why = res.message || res.error;
      throw new Error(`Vest rejected the request (HTTP ${r.status}${why ? ': ' + why : ''})`);
    }
    return res;
  };

  // Vest's leverage rule, as its own ticket applies it. Max leverage for an account on a market: the plan-specific margin
  // ratio if the market lists one for this plan, else the market's capital-account ratio (falling back to the funded
  // ratio), else the account's max leverage capped by the market (5x if unknown). Leverage = floor(1 / ratio).
  // An order uses the saved leverage when 0 < saved ≤ max, otherwise the max.
  const FALLBACK_MAX_LEVERAGE = 5;
  function maxLeverageFor(sym, accountId) {
    const m = SYMBOLS[sym] && SYMBOLS[sym].margin,
      a = S.byId[accountId];
    if (!m) return null;
    const fromRatio = (r) => (r > 0 ? Math.floor(1 / r + EPS) : null);
    const marketMax = fromRatio(m.initMarginRatio);
    if (!a) return marketMax;
    const plan = (m.capitalPlans || []).find((c) => c.accountType === a.accountType && c.planId === a.planId);
    if (plan) return fromRatio(plan.initMarginRatio);
    const r = m.capitalInitMarginRatio === undefined ? m.fundedInitMarginRatio : m.capitalInitMarginRatio;
    if (r !== null && r !== undefined) return fromRatio(r);
    const acctMax = a.leverage > 0 ? a.leverage : FALLBACK_MAX_LEVERAGE;
    return marketMax ? Math.min(acctMax, marketMax) : acctMax;
  }
  const orderLeverage = (saved, max) => (saved > 0 && max > 0 && saved <= max ? saved : max || null);
  if (window.__VC_TEST__) window.__vcLev = { maxLeverageFor, orderLeverage };

  // Stop/target work that runs after an order (re-anchor, re-splitting the targets after an add or reduce). Buy and Sell stay disabled
  // until it finishes, so two of these never work on the same legs at once.
  function adjust(job) {
    S.adjusting = (S.adjusting || 0) + 1;
    // the redraw and the job both run inside the chain, so an error in either still reaches the finally
    return Promise.resolve()
      .then(() => {
        updateTrade();
        return job();
      })
      .catch((e) => {
        logEvent('warn', `Couldn't finish adjusting stop & targets (${e.message}) — check them on Vest.`);
        diag('adjust', { outcome: 'error', error: e.message });
      })
      .finally(() => {
        S.adjusting--;
        updateTrade();
      });
  }

  // `limitPx`: a GTC limit order at that price (a new trade only), with the stop and targets measured from it; without
  // it, a market order. A stop entry firing passes `opt`: its own `setup` (the size, stop and targets set when it was
  // placed), `stopEntry`, and `ioc` (with a max slip: an immediate-or-cancel limit at that price instead of a market
  // order). Returns true once Vest has accepted the order.
  async function placeTrade(side, limitPx = null, opt = {}) {
    if (S.placing || S.adjusting || S.exiting) return;
    if (S.flattening) return toast('Wait for Flatten All to finish.');
    if (S.arming || claimBusy()) return toast('Wait for copying to start or the claim to finish.');
    const siteHeld = siteBlocks() || pauseBlocks(); // Vest's update not checked yet, the check failed, or paused
    if (siteHeld) return toast(siteHeld);
    if (!S.ack) {
      S.rulesOpen = true;
      S.tradeOpen = false;
      render();
      return toast('Read and accept the terms first.');
    }
    let c = tradeCalc(opt.setup);
    if (opt.stopEntry && (c.error || c.blocked)) {
      logEvent('warn', `Trade panel: ${stopName(opt.stopEntry)} NOT placed — ${c.error || c.blocked}`);
      return false;
    }
    if (c.error) return toast(c.error);
    if (c.blocked) return toast(c.blocked);
    const t = { ...c.t, targets: c.t.targets.map(Number) }; // edits made while this order is in flight don't apply to it
    // how the size was chosen, for diagnostics: the mode, Vest's max and who limits it, and any warning shown
    const sizing = {
      mode: t.sizeMode,
      qty: c.qty,
      maxQty: c.maxQty,
      limitedBy: c.limitedBy ? accLabel(c.limitedBy) : null,
      leverage: c.lev,
      fail: c.sides.long && c.sides.long.fail,
      warnings: c.warnings.map((w) => w.kind),
    };
    const stopPts = c.stopOn ? +t.stopPts : null, // null: no stop
      sym = t.symbol,
      meta = c.meta,
      pDec = decimalsOf(meta.tick),
      master = S.master;
    if (limitPx) {
      // a typed price between ticks: a buy rounds down, a sell up (never a worse price than asked)
      const n = limitPx / meta.tick;
      limitPx = +((side === 'long' ? Math.floor(n + 1e-9) : Math.ceil(n - 1e-9)) * meta.tick).toFixed(pDec);
    }
    S.placing = true;
    let placed = false;
    try {
      updateTrade();
      const px = priceOf(sym); // the price at the moment of the click
      if (limitPx) {
        const lp = fmtNum(limitPx, pDec);
        if (!nearMarket(limitPx, px, NEAR_MARKET_LOOSE))
          throw new Error(`a limit at ${lp} is nowhere near the market (${fmtNum(px, pDec)})`);
        if (side === 'long' ? limitPx >= px : limitPx <= px)
          throw new Error(
            `a ${side === 'long' ? 'buy' : 'sell'} limit must be ${side === 'long' ? 'below' : 'above'} the mark (${fmtNum(px, pDec)}): there it would fill at once — use ${side === 'long' ? 'Buy' : 'Sell'} for a market order`,
          );
      }
      // A capped stop entry fills at the price or better than its cap: its stop is measured from the price (no further
      // than the cap), so it's never closer to the fill than set, and its targets from the cap, so they stay over (a
      // buy) the limit price, as Vest requires. Re-anchored to exact points from the fill afterwards.
      const toward = (a, b) => (side === 'long' ? Math.min(a, b) : Math.max(a, b));
      const legsFrom = limitPx || opt.ioc || px,
        stopFrom = opt.ioc ? toward(px, opt.ioc) : legsFrom;
      const plan0 = planPrices({ side, entry: legsFrom, stopPts, targetPts: t.targets, tick: meta.tick });
      const plan =
        plan0.error || stopFrom === legsFrom
          ? plan0
          : { ...plan0, stop: planPrices({ side, entry: stopFrom, stopPts, targetPts: [], tick: meta.tick }).stop };
      if (plan.error) throw new Error(plan.error);
      if (!(SYMBOLS[sym] && SYMBOLS[sym].margin)) await loadSymbolRules(sym);
      // Two things to know before sending: the saved leverage (Vest's own rule) and whether this market already holds a
      // position or a waiting order (Vest ignores a second open on the same symbol: accepted, never filled; same
      // direction is an add, the opposite direction is refused here). With Vest's live feed up both are known already
      // (the feed's positions and orders; the leverage the Trade tab read, with any change the page made laid over it),
      // so the order goes out at once and the leverage is read again afterwards. Without the feed they're read, together.
      // A stop entry keeps its own leverage, refreshed while it waits.
      const quick = stopEntryCheck(master, sym);
      const known = quick && S.levs ? withPageLevs({ ...S.levs }) : null;
      const [levs, held] = await Promise.all([
        opt.stopEntry && opt.stopEntry.levs ? opt.stopEntry.levs : known || fetchLeverages(),
        quick ? quick.held : openPosition(master, sym),
      ]);
      if (known && !(opt.stopEntry && opt.stopEntry.levs)) setTimeout(refreshTradeState, 0); // re-read once it's out
      const lev = orderLeverage(levFor(levs, master, sym), maxLeverageFor(sym, master));
      if (!(lev > 0))
        throw new Error(
          `couldn't work out ${meta.label} leverage for ${accLabel(master)} — open Vest's ticket for ${meta.label} once, then retry`,
        );
      // The size on screen was worked out at the panel's leverage. If Vest's is another one now (changed elsewhere, or
      // the panel missed it), it's worked out again at this one: a click that would now send another size is refused so
      // the new size is seen first; a stop entry that has triggered sends it.
      if (levs && lev !== c.lev) {
        if (!(opt.stopEntry && opt.stopEntry.levs)) S.levs = levs; // a fresh read: the panel follows it
        const was = c.lev,
          c2 = tradeCalc(opt.setup, levs);
        if (c2.error || c2.blocked)
          throw new Error(
            `leverage is ${lev}x now (the panel had ${was}x): ${(c2.error || c2.blocked).replace(/\.$/, '')}`,
          );
        if (Math.abs(c2.qty - c.qty) >= meta.step / 2) {
          if (!opt.stopEntry)
            throw new Error(
              `leverage is ${lev}x now (the panel had ${was}x), so the size is ${fmtQty(c2.qty, sym)}, not ${fmtQty(c.qty, sym)} — check it and click again`,
            );
          logEvent(
            'info',
            `Trade panel: leverage is ${lev}x now (was ${was}x): ${stopName(opt.stopEntry)} sized ${fmtQty(c2.qty, sym)}, not ${fmtQty(c.qty, sym)}`,
          );
        }
        c = c2;
        Object.assign(sizing, {
          qty: c.qty,
          maxQty: c.maxQty,
          limitedBy: c.limitedBy ? accLabel(c.limitedBy) : null,
          leverage: c.lev,
          leverageWas: was,
        });
      }
      if (opt.stopEntry && held)
        throw new Error(
          `${accLabel(master)} already has a ${parseFloat(held.quantity) > 0 ? 'position' : 'waiting order'} on ${meta.label}: a stop entry opens a new trade only, so nothing was sent`,
        );
      // The size and ladder on screen were worked out for what the panel showed: a position that opened, closed or changed
      // size since then would turn this click into something else (a new trade into an add, say).
      const shown = c.held;
      if (
        held &&
        parseFloat(held.quantity) > 0 &&
        (!shown || shown.side !== held.side || Math.abs(shown.qty - parseFloat(held.quantity)) >= meta.step / 2)
      ) {
        refreshTradeState();
        throw new Error(
          `the position on ${meta.label} changed since the panel last updated — check it and click again`,
        );
      }
      if (!held && shown) {
        refreshTradeState();
        throw new Error(`the position on ${meta.label} is closed now — check the panel and click again`);
      }
      if (held && !(parseFloat(held.quantity) > 0))
        throw new Error(
          `an order is already waiting on ${meta.label} for ${accLabel(master)} — cancel it in Vest first (the Trade tab places one waiting order per market; Vest's own ticket can add more)`,
        );
      if (held && limitPx)
        throw new Error(
          `${accLabel(master)} is already in ${meta.label}: a limit from the panel opens a new trade only`,
        );
      if (held && held.side !== side) {
        throw new Error(
          `${accLabel(master)} is ${held.side} ${held.quantity} ${meta.label} — close or reduce it first (the panel only adds in the same direction)`,
        );
      }
      if (held) return await addToTrade({ t, qty: c.qty, meta, side, held, lev, sizing });
      const many = c.qtys.length > 1;
      const takeProfits = plan.targets.map((tp, i) => ({
        executionType: 'market',
        triggerPrice: fmtNum(tp, pDec),
        ...(many ? { quantity: fmtQty(c.qtys[i], sym) } : {}),
      }));
      takeProfits.forEach((l, i) => {
        if (many && parseFloat(l.quantity) * parseFloat(l.triggerPrice) < MIN_LEG_USD)
          throw new Error(`TP${i + 1} is below Vest's $1 minimum`);
      });
      // no stop or no targets: empty lists, as Vest's own ticket sends them
      const stopLosses = plan.stop ? [{ executionType: 'market', triggerPrice: fmtNum(plan.stop, pDec) }] : [];
      const lpx = limitPx || opt.ioc || null; // a resting limit, or a stop entry's capped fill
      const body = {
        orderType: lpx ? 'limit' : 'market',
        leverage: fmtNum(lev, 2),
        side,
        symbol: sym,
        quantity: fmtQty(c.qty, sym),
        timeInForce: limitPx ? 'GTC' : 'IOC',
        takeProfits,
        stopLosses,
        ...(lpx ? { price: fmtNum(lpx, pDec) } : {}),
      };
      if (S.flattening) throw new Error('Flatten All started'); // it'd only be closed again, uncopied
      const sentMs = opt.stopEntry ? Date.now() - opt.stopEntry.triggered : null; // trigger → order out
      const res = await send('POST', '/v3/positions/open', master, body);
      if (!res.positionId) throw new Error('Vest returned no position');
      saveSplit(res.positionId, t.scale); // the trade keeps its split: a re-split follows it
      const tps = takeProfits
        .map((l, i) => `TP${i + 1} ${l.triggerPrice}${l.quantity ? ' × ' + l.quantity : ''}`)
        .join(' · ');
      logEvent(
        'ok',
        `Trade panel: ${side === 'long' ? 'BUY' : 'SELL'}${limitPx ? ' LIMIT' : opt.stopEntry ? ' STOP' : ''} ${body.quantity} ${meta.label}${
          limitPx ? ` @ ${body.price}` : opt.ioc ? ` (limit ${body.price}, fills now or not at all)` : ''
        } · ${stopLosses.length ? `stop ${stopLosses[0].triggerPrice}` : 'no stop'} · ${tps || 'no targets'}`,
      );
      placed = true;
      diag('trade_panel', {
        outcome: 'placed',
        side,
        sizing,
        stopEntry: opt.stopEntry
          ? { level: opt.stopEntry.level, slip: opt.stopEntry.slip, sentMs, checks: quick ? 'feed' : 'vest' }
          : undefined,
        body,
        positionId: res.positionId,
        orderId: res.orderId,
        takeProfitIds: res.takeProfitIds,
        stopLossIds: res.stopLossIds,
      });
      // A market order's stop and targets are re-placed exactly from the real fill. A limit's are already measured from its
      // price (it fills there or better) and it may rest for a long time, so it isn't re-anchored or watched for
      // breakeven: Breakeven by hand does that once it fills.
      const reanchorOn = !limitPx && (!!plan.stop || plan.targets.length > 0); // nothing to re-place without legs
      if (limitPx && t.beMode !== 'off' && plan.stop)
        logEvent('info', 'Auto breakeven watches market orders only: once this limit fills, use Breakeven.');
      let bePlan = null;
      if (t.beMode !== 'off' && !limitPx && plan.stop && (t.beMode !== 'tp1' || plan.targets.length)) {
        bePlan = {
          positionId: res.positionId,
          orderId: res.orderId,
          master,
          symbol: sym,
          side,
          stopLegId: (res.stopLossIds || [])[0] || null,
          tp1: plan.targets[0] || null,
          beMode: t.beMode,
          beTrigger: +t.beTrigger || 0,
          beOffset: +t.beOffset || 0,
          entry: null,
          triggered: false,
          moved: false,
          reanchoring: reanchorOn,
          at: Date.now(),
        };
        addPlan(bePlan);
      }
      const doReanchor = () =>
        reanchor({
          master,
          sym,
          side,
          positionId: res.positionId,
          orderId: res.orderId,
          ref: px,
          stopPts,
          targetPts: t.targets,
          sentStop: plan.stop,
          sentTargets: plan.targets,
          sentTargetQtys: takeProfits.map((l) => (l.quantity != null ? l.quantity : null)),
          bePlan,
        });
      if (opt.ioc)
        // a capped stop entry fills at once or not at all: when nothing filled, there's no trade to re-place or watch
        adjust(async () => {
          // the feed answers at once; without it a fill takes a moment to reach Vest's fill history, so look a few
          // times, and finally at the position, before saying nothing filled
          let f;
          for (let i = 0; i < 4; i++) {
            if (i) await sleep(POLL_MS);
            f = await fillInfo(master, sym, res.orderId, i ? 0 : FEED_FILL_WAIT_MS);
            if (f || (f === null && feedLive())) break;
          }
          if (!f) {
            const pos = await tryOpenPosition(master, sym);
            if (pos && parseFloat(pos.quantity) > 0) f = { price: parseFloat(pos.openPrice) };
          }
          if (f) return reanchorOn ? doReanchor() : undefined;
          _missNoted.add(res.orderId);
          setTimeout(() => _missNoted.delete(res.orderId), 60000);
          logEvent(
            'warn',
            `${stopName(opt.stopEntry)}: nothing filled — the price was past ${body.price} (your max slip). No trade.`,
          );
          if (bePlan) endPlan(bePlan, null);
        });
      else if (reanchorOn) adjust(doReanchor);
    } catch (e) {
      logEvent('warn', `Trade panel: order NOT placed — ${e.message}.`);
      diag('trade_panel', { outcome: 'not-placed', side, sizing, error: e.message, errorCode: errCode(e) });
    } finally {
      S.placing = false;
      updateTrade();
      refreshTradeState(); // the position (or the add) shows right away, not with the next balance read
      setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS); // the next max size and fail price start from the new balance
    }
    return placed;
  }

  // Vest's position `openPrice` can be wrong for a moment right after a fill (seen live: 290.25 for a 31,148 fill), so
  // fills come from /executions by order id, and any price that legs are measured from must be near the market.
  const nearMarket = (px, ref, tol = NEAR_MARKET) => px > 0 && ref > 0 && Math.abs(px - ref) <= ref * tol;
  async function orderFill(accountId, sym, orderId, ref) {
    if (!orderId) return null;
    for (let i = 0; i < 4; i++) {
      if (i) await sleep(POLL_MS);
      const f = await fillInfo(accountId, sym, orderId, i ? 0 : FEED_FILL_WAIT_MS);
      if (f && nearMarket(f.price, ref)) return f.price;
    }
    return null;
  }

  // An account's open position on a symbol (or by id), or null when flat. Throws if positions can't be read: never
  // guess "flat".
  async function openPosition(accountId, sym, positionId) {
    const r = await api('/v3/positions/opened', (await mintAccountToken(accountId)).token);
    return ((r && r.positions) || []).find((x) => (positionId ? posIdOf(x) === positionId : x.symbol === sym)) || null;
  }
  // After a cancel, Vest removes the order's (size-0) position a moment later, and an open on that market sent before
  // that is refused ("This position already exists", code 10006; seen live 2026-10-11 when a limit was moved quickly).
  // waitPositionGone: until the position is gone (up to POSITION_GONE_MS). gateCancel: while a cancel on an account's
  // market is going through, opens there (copies, re-placed limits) wait for it (waitClear).
  const POSITION_GONE_MS = 2500,
    RESTING_REJECT_WAIT_MS = 1500;
  async function waitPositionGone(acct, positionId) {
    if (!positionId) return sleep(300);
    const end = Date.now() + POSITION_GONE_MS;
    while (Date.now() < end) {
      try {
        if (!(await openPosition(acct, null, positionId))) return true;
      } catch {
        /* unreadable: look again */
      }
      await sleep(150);
    }
    return false;
  }
  // Until the account holds no unfilled (size-0) position on this market: a retry after "already exists".
  async function waitMarketClear(acct, sym) {
    const end = Date.now() + POSITION_GONE_MS;
    while (Date.now() < end) {
      try {
        const r = await api('/v3/positions/opened', (await mintAccountToken(acct)).token);
        if (!((r && r.positions) || []).some((x) => x.symbol === sym && !(parseFloat(x.quantity) > 0))) return true;
      } catch {
        /* unreadable: look again */
      }
      await sleep(150);
    }
    return false;
  }
  const _clearing = {}; // "account|symbol" -> a cancel going through on that market
  function gateCancel(acct, sym, job) {
    const key = acct + '|' + sym;
    const p = job()
      .catch(() => {})
      .finally(() => {
        if (_clearing[key] === p) delete _clearing[key];
      });
    _clearing[key] = p;
    return p;
  }
  const waitClear = (acct, sym) => _clearing[acct + '|' + sym] || null;
  const tryOpenPosition = async (...a) => {
    try {
      return await openPosition(...a);
    } catch {
      return null;
    }
  };

  // ── Add to an open trade from the panel: Vest's /append (the shape its own ticket sends). The stop stays where it is
  // (it covers the whole position, so it covers the add too); once the add has filled, the trade's sized targets are
  // re-split across its new size (resplitAfter). Armed, the copier adds to each follower, scaled, and each follower
  // re-splits its own targets.
  async function addToTrade({ t, qty, meta, side, held, lev, sizing }) {
    const sym = t.symbol,
      master = S.master,
      prevQty = parseFloat(held.quantity);
    const body = {
      symbol: sym,
      positionId: posIdOf(held),
      orderType: 'market',
      quantity: fmtQty(qty, sym),
      leverage: fmtNum(lev, 2),
      isBuy: side === 'long',
      timeInForce: 'IOC',
    };
    const res = await send('POST', '/v3/positions/append', master, body);
    logEvent(
      'ok',
      `Trade panel: ADD ${body.quantity} ${meta.label} to the ${side} (${fmtQty(prevQty, sym)} → ${fmtQty(prevQty + qty, sym)}). The stop stays where it is.`,
    );
    diag('trade_panel', { outcome: 'added', side, sizing, body, orderId: res.orderId, prevQty });
    adjust(() =>
      resplitAfter({ master, sym, positionId: body.positionId, orderId: res.orderId, before: prevQty, what: 'add' }),
    );
  }

  // ── Each trade's split (Start, Even or End), saved when the Trade tab places it, so a re-split and + Add target follow
  // the trade's own split, not the Trade tab's setting now. By position id, read fresh each time (other tabs write the
  // same storage) and kept in memory too (storage can be full). A trade the copier didn't place splits Even.
  const SPLITS_KEY = 'vc-splits',
    SPLITS_KEEP_MS = 30 * 24 * 3600 * 1000,
    SPLITS_MAX = 200;
  const _splits = {};
  const isSplit = (m) => ['even', 'start', 'end'].includes(m);
  function saveSplit(positionId, mode) {
    if (!positionId || !isSplit(mode)) return;
    _splits[positionId] = mode;
    const saved = store.get(SPLITS_KEY, {}),
      all = saved && typeof saved === 'object' ? saved : {};
    all[positionId] = { mode, at: Date.now() };
    const kept = Object.entries(all)
      .filter(([, v]) => v && isSplit(v.mode) && Date.now() - v.at < SPLITS_KEEP_MS)
      .sort((a, b) => b[1].at - a[1].at)
      .slice(0, SPLITS_MAX);
    store.set(SPLITS_KEY, Object.fromEntries(kept));
  }
  function splitOf(positionId) {
    const saved = store.get(SPLITS_KEY, {}),
      v = saved && typeof saved === 'object' ? saved[positionId] : null;
    return v && isSplit(v.mode) ? v.mode : _splits[positionId] || 'even';
  }
  const SPLIT_NAMES = { even: 'Even', start: 'Start', end: 'End' };

  // ── Re-split (v0.41.2): after a Trade tab add or reduce, once Vest confirms it filled, the trade's sized targets get new
  // sizes for the position's new size by the trade's split, nearest the entry first (resplitTargets). A target already
  // hit is gone from Vest's list; a moved one keeps its price and takes the share of its place in the ladder. Prices
  // and the stop never change; a lone target with no size (it closes the whole position) and a trade without targets
  // are left alone. Not confirmed, or too small to split: the sizes stay and the log says so. One re-split at a time (a
  // reduce clicked while an add's is waiting goes after it). The resizes go through the hooked fetch, but aren't copied
  // as scaled sizes: each follower re-splits its own targets across its own position once its own add or reduce has
  // filled (resplitFollowers), so rounding never leaves part of one without a target.
  const _resplitting = new Set(); // "targetId|size" of the master's re-split resizes on their way (not copied as such)
  const resplitKey = (b) => `${b.takeProfitId}|${b.quantity}`;
  const RESPLIT_KEY_MS = 60000; // not copying, or Vest refused it: nothing reads the key
  let _resplitRun = Promise.resolve();
  // Where a target was last moved to, by its id, as the move went out (a drag on Vest's chart, or its copy to a
  // follower). A re-split's resize carries a price, so one sent with the price it read before a move would put the
  // target back: it uses the moved-to price instead (the owner's live test, 2026-10-22: a drag a second after a Reduce
  // was undone on both followers, and the copier then lost that target's later drags).
  const _movedTo = {};
  function noteMovedTo(id, price) {
    if (!id || !(parseFloat(price) > 0)) return;
    const now = Date.now();
    for (const k in _movedTo) if (now - _movedTo[k].at > 60000) delete _movedTo[k];
    _movedTo[id] = { price: parseFloat(price), at: now };
  }
  // each target to its new size, the ones shrinking first, so the sizes never add up past the position. `put(leg, qty,
  // price)` sends one, its price written the way the copier writes every price (Vest's reads give "29348.000000000",
  // and Vest refused every resize sent back like that: the owner's live test, 2026-10-22); returns the price of the one
  // that failed, with why, or null when all went
  async function resizeTargets(tps, qtys, tick, put, since) {
    const steps = tps
      .map((l, i) => ({ l, qty: qtys[i], d: parseFloat(qtys[i]) - parseFloat(l.quantity) }))
      .filter((x) => x.d !== 0)
      .sort((a, b) => a.d - b.d);
    for (const x of steps) {
      const moved = _movedTo[x.l.id],
        price = fmtNum(moved && moved.at >= since ? moved.price : parseFloat(x.l.triggerPrice), decimalsOf(tick));
      try {
        await put(x.l, x.qty, price);
      } catch (e) {
        return { price, why: e.vest ? `${e.message}: ${e.vest}` : e.message };
      }
    }
    return null;
  }
  // new target sizes for the log, nearest the entry first ("0.0086 / 0.0086 / 0.0085")
  const ladderText = (side, prices, qtys) =>
    prices
      .map((p, i) => ({ p, q: qtys[i] }))
      .sort((a, b) => (side === 'long' ? a.p - b.p : b.p - a.p))
      .map((x) => x.q)
      .join(' / ');
  // the targets Vest has on a position, when every one is sized (null: none, or one closes the whole position)
  const sizedTargets = (tps) =>
    tps.length && tps.every((l) => l.sizeMode !== 'full_position' && l.quantity != null && +l.quantity > 0)
      ? tps
      : null;
  const unsizedWhy = (tps) => (tps.length ? 'whole-position target' : 'no targets');
  // One account's re-split, once its own order has filled: its position, read until the size has moved off `before`
  // (Vest's reads can trail a fill), and the targets `pick(pos)` chooses ({ tps, total }) resized for `total` by the
  // split. Returns { to, side, qty, prices, from } when done, else { reason } with `warn` when the trader should look.
  async function resplitAccount({ acct, sym, positionId, before, mode, pick, put }) {
    const since = Date.now(), // a target moved after this keeps its new price
      step = SYMBOLS[sym].step,
      moved = (p) => Math.abs(parseFloat(p.quantity) - before) >= step / 2;
    let pos;
    for (let i = 0; i < 4 && !(pos && moved(pos)); i++) {
      if (i) await sleep(POLL_MS);
      try {
        pos = await openPosition(acct, sym, positionId);
      } catch {
        pos = undefined; // unreadable: look again
      }
      if (pos === null) return { reason: 'position gone' };
    }
    if (!pos || !moved(pos)) return { reason: pos ? 'size not updated' : 'position unreadable', warn: true };
    const { tps: picked, total } = pick(pos),
      tps = sizedTargets(picked);
    if (!tps) return { reason: unsizedWhy(picked) };
    const prices = tps.map((l) => parseFloat(l.triggerPrice)),
      info = { side: pos.side, qty: pos.quantity, prices, from: tps.map((l) => String(l.quantity)) },
      targets = tps.map((l, i) => ({ id: l.id, price: prices[i] })); // for the followers' pairing
    const r = resplitTargets({ side: pos.side, prices, total, mode, step, minUsd: MIN_LEG_USD });
    if (r.error) return { ...info, reason: 'too small', total, error: r.error, warn: true };
    const to = r.qtys.map((q) => fmtQty(q, sym));
    if (to.every((q, i) => +q === +info.from[i])) return { ...info, to, targets, since, unchanged: true };
    const failed = await resizeTargets(tps, to, SYMBOLS[sym].tick, put, since);
    if (failed) return { ...info, to, reason: 'failed', error: failed.why, failed, warn: true };
    return { ...info, to, targets, since };
  }
  // what a re-split that didn't happen means for the trader
  const resplitWhy = (r, sym) =>
    r.reason === 'too small'
      ? `${fmtQty(r.total, sym)} ${symLabel(sym)} is too small to split across ${r.prices.length} targets: their sizes were left as they were`
      : r.reason === 'failed'
        ? `couldn't resize the target at ${r.failed.price} (${r.failed.why}): the targets may not add up to the position`
        : "couldn't read the new size: the targets were left as they were";
  const resplitRecord = (d, mode, r) => ({
    ...d,
    split: mode,
    qty: r.qty,
    prices: r.prices,
    from: r.from,
    to: r.to,
    outcome: r.unchanged ? 'unchanged' : !r.reason ? 'resplit' : r.reason === 'failed' ? 'failed' : 'skipped',
    reason: r.reason,
    error: r.error,
  });
  function resplitAfter(o) {
    const run = _resplitRun.then(() => resplitMaster(o));
    _resplitRun = run.catch(() => {});
    return run;
  }
  async function resplitMaster({ master, sym, positionId, orderId, before, what }) {
    const d = { ...who(master), symbol: sym, positionId, after: what };
    // a lone target or none: nothing to re-split, so nothing to wait for
    const first = await tryOpenPosition(master, sym, positionId);
    if (first && !sizedTargets(first.takeProfits || []))
      return void diag('resplit', { ...d, outcome: 'skipped', reason: unsizedWhy(first.takeProfits || []) });
    if (orderId && !feedLive()) await sleep(FILL_FIRST_LOOK_MS); // let the fill reach Vest's fill history
    const f = orderId ? await fillOf(master, sym, orderId) : {};
    if (!f.fill) {
      logEvent(
        'warn',
        f.missing
          ? `The ${what} didn't fill: the targets were left as they were.`
          : `Couldn't confirm the ${what} filled: the targets were left as they were. Check them on Vest.`,
      );
      return void diag('resplit', { ...d, outcome: 'skipped', reason: f.missing ? 'not filled' : 'fill unconfirmed' });
    }
    if (_exitedHere.has(positionId)) return void diag('resplit', { ...d, outcome: 'skipped', reason: 'position gone' });
    const mode = splitOf(positionId);
    const r = await resplitAccount({
      acct: master,
      sym,
      positionId,
      before,
      mode,
      pick: (pos) => ({ tps: pos.takeProfits || [], total: parseFloat(pos.quantity) }),
      put: (l, qty, price) => {
        const body = {
          positionId,
          executionType: 'market',
          triggerPrice: price,
          takeProfitId: l.id,
          quantity: qty,
        };
        const key = resplitKey(body);
        _resplitting.add(key);
        setTimeout(() => _resplitting.delete(key), RESPLIT_KEY_MS);
        return send('PUT', '/v3/positions/take-profit', master, body);
      },
    });
    diag('resplit', resplitRecord(d, mode, r));
    if (r.reason) {
      const why = resplitWhy(r, sym);
      // closed from the panel meanwhile (an exit never waits on this): nothing left to resize
      if (r.warn && !_exitedHere.has(positionId))
        logEvent('warn', `${why[0].toUpperCase()}${why.slice(1)}. Check them on Vest.`);
      return;
    }
    if (!r.unchanged)
      logEvent(
        'ok',
        `Targets re-split to ${ladderText(r.side, r.prices, r.to)} (${SPLIT_NAMES[mode]}); their prices stay.`,
      );
    const entry = S.armed && S.posMap[positionId];
    if (entry) resplitFollowers(entry, { orderId, what, mode, targets: r.targets, since: r.since });
  }
  // Each follower's own re-split: after its own add or reduce (the copy of the master's order `orderId`) has filled, its
  // targets at the master's prices are re-split across its own position by the same split. A target placed on it by
  // hand is never touched, and a sized one keeps its share: the copied ones share the rest. A follower whose add or
  // reduce didn't happen keeps its targets. Not on the trade's queue, so a close or reduce copied meanwhile never waits
  // on it (seen live 2026-10-22: reduces back to back reached the followers ~850 ms late); it waits only for the copies
  // of this add or reduce to be sent, and a trade's re-splits run one at a time.
  function resplitFollowers(entry, { orderId, what, mode, targets, since }) {
    const sym = entry.symbol,
      step = SYMBOLS[sym].step,
      lc = entry.changes && entry.changes[orderId];
    if (!lc || lc.kind !== what) {
      logEvent('info', `↳ the ${what} wasn't copied to the followers: their targets were left as they were.`);
      return void diag('resplit', { symbol: sym, after: what, outcome: 'skipped', reason: 'not copied' });
    }
    const run = (entry.resplitRun || Promise.resolve()).then(async () => {
      await Promise.resolve(lc.sent).catch(() => {});
      if (!feedLive()) await sleep(FILL_FIRST_LOOK_MS);
      await Promise.all(
        Object.entries(lc.followers).map(async ([f, ch]) => {
          const fp = entry.followers[f];
          if (!fp) return;
          const d = { ...who(f), symbol: sym, positionId: fp.positionId, after: what };
          if (!ch.orderId) return void diag('resplit', { ...d, split: mode, outcome: 'skipped', reason: ch.why });
          const fill = await fillOf(f, sym, ch.orderId);
          if (!fill.fill) {
            if (!fill.missing)
              logEvent(
                'warn',
                `↳ ${accLabel(f)}: couldn't confirm its ${what} filled: its targets were left as they were. Check them on Vest.`,
              );
            const reason = fill.missing ? 'not filled' : 'fill unconfirmed';
            return void diag('resplit', { ...d, split: mode, outcome: 'skipped', reason });
          }
          const r = await resplitAccount({
            acct: f,
            sym,
            positionId: fp.positionId,
            before: ch.before,
            mode,
            pick: (pos) => {
              // its targets at the master's prices, one each (at the price the master's re-split read, or where that
              // target was dragged since, as its copy may have landed); a target at another price was placed by hand
              const left = [...(pos.takeProfits || [])];
              const tps = targets
                .map((t) => {
                  const m = _movedTo[t.id],
                    alt = m && m.at >= since ? m.price : null,
                    at = (l) =>
                      near(parseFloat(l.triggerPrice), t.price) ||
                      (alt != null && near(parseFloat(l.triggerPrice), alt));
                  const k = left.findIndex(at);
                  return k < 0 ? null : left.splice(k, 1)[0];
                })
                .filter(Boolean);
              const hand = left.reduce((a, l) => a + (l.sizeMode !== 'full_position' ? +l.quantity || 0 : 0), 0);
              return { tps, total: floorStep(parseFloat(pos.quantity) - hand, step) };
            },
            put: (l, qty, price) =>
              acctPut(f, '/v3/positions/take-profit', {
                positionId: fp.positionId,
                executionType: 'market',
                triggerPrice: price,
                takeProfitId: l.id,
                quantity: qty,
              }).then(() => {
                const fl = (fp.legs || []).find((x) => x.id === l.id);
                if (fl) fl.qty = qty;
              }),
          });
          diag('resplit', resplitRecord(d, mode, r));
          if (r.reason) {
            // the trade closed meanwhile (its close doesn't wait on this): nothing left to resize
            if (r.warn && Object.values(S.posMap).includes(entry))
              logEvent('warn', `↳ ${accLabel(f)}: ${resplitWhy(r, sym)}. Check its targets on Vest.`);
            return;
          }
          if (!r.unchanged)
            logEvent('ok', `↳ targets re-split to ${ladderText(r.side, r.prices, r.to)} on ${accLabel(f)}`);
        }),
      );
    });
    entry.resplitRun = run.catch(() => {});
    return run;
  }

  // ── Re-anchor after fill (always). The order's stop and targets are computed from the live price at the click.
  // Once filled, read the fill price and the position's leg ids, and move any leg that is off by a tick or more so it
  // sits exactly N points from the fill. Legs are found by the price they were sent at. The moves go through the hooked
  // fetch, so an armed copier moves the followers' matching legs too. Breakeven waits until this is done.
  async function reanchor(args) {
    try {
      return await reanchorSteps(args);
    } finally {
      const p = args.bePlan;
      if (p && p.reanchoring) {
        p.reanchoring = false;
        savePlans();
        if (!(p.entry > 0)) fillEntry(p);
      }
    }
  }
  async function reanchorSteps({
    master,
    sym,
    side,
    positionId,
    orderId,
    ref,
    stopPts,
    targetPts,
    sentStop,
    sentTargets,
    sentTargetQtys = [],
    bePlan,
  }) {
    const tick = SYMBOLS[sym].tick,
      fmt = (n) => fmtNum(n, decimalsOf(tick));
    const done = () => {
      if (!bePlan) return;
      bePlan.reanchoring = false;
      savePlans();
      if (!(bePlan.entry > 0)) fillEntry(bePlan);
    };
    let fill = await orderFill(master, sym, orderId, ref),
      pos = null;
    for (let i = 0; i < 6 && !pos; i++) {
      // the position, for its leg ids
      if (i) await sleep(POLL_MS);
      pos = await tryOpenPosition(master, sym, positionId);
    }
    if (!fill && pos && nearMarket(parseFloat(pos.openPrice), ref)) fill = parseFloat(pos.openPrice);
    if (!pos || !fill) {
      logEvent(
        'warn',
        `Re-anchor: couldn't get a believable fill price${pos && pos.openPrice ? ` (Vest showed ${pos.openPrice})` : ''} — stop and targets left where they were placed.`,
      );
      diag('reanchor', { positionId, outcome: 'no-fill-price', openPrice: pos ? pos.openPrice : null, ref });
      return done();
    }
    const exact = planPrices({ side, entry: fill, stopPts, targetPts, tick });
    if (exact.error) return done();
    if (bePlan) {
      bePlan.entry = fill;
      bePlan.tp1 = exact.targets[0] || null;
    }
    const legs = posLegs(pos).map((l) => ({ ...l, used: false }));
    const moves = [];
    // a sized target keeps its size: a PUT without a quantity makes the leg full-position on Vest, so TP1 of a split
    // would close the whole trade (the size from Vest's read, else the size it was sent with)
    const planMove = (kind, sent, to, sentQty) => {
      const l = legs.find((x) => !x.used && x.kind === kind && Math.abs(x.price - sent) < tick / 2);
      if (!l) return;
      l.used = true;
      const qty =
        l.qty != null && +l.qty > 0 ? String(l.qty) : sentQty != null && +sentQty > 0 ? String(sentQty) : null;
      if (Math.abs(l.price - to) >= tick / 2) moves.push({ kind, id: l.id, from: l.price, to, qty });
    };
    if (sentStop && !(bePlan && bePlan.moved)) planMove('sl', sentStop, exact.stop);
    sentTargets.forEach((p, i) => planMove('tp', p, exact.targets[i], sentTargetQtys[i]));
    if (!moves.length) {
      logEvent('info', `Filled at ${fmt(fill)} — stop and targets already exact.`);
      diag('reanchor', { positionId, fill, moves: [] });
      return done();
    }
    let failed = 0;
    for (const m of moves) {
      if (_exitedHere.has(positionId)) return done(); // closed from the panel meanwhile: nothing left to re-place
      const isStop = m.kind === 'sl';
      try {
        await send('PUT', isStop ? '/v3/positions/stop-loss' : '/v3/positions/take-profit', master, {
          positionId,
          executionType: 'market',
          triggerPrice: fmt(m.to),
          [isStop ? 'stopLossId' : 'takeProfitId']: m.id,
          ...(m.qty ? { quantity: m.qty } : {}),
        });
      } catch (e) {
        failed++;
        logEvent(
          'warn',
          `Re-anchor: couldn't move the ${isStop ? 'stop' : 'target'} at ${fmt(m.from)} (${e.message}) — left as placed.`,
        );
      }
    }
    if (failed < moves.length)
      logEvent(
        'ok',
        `Filled at ${fmt(fill)} — ${
          stopPts === null ? 'targets' : targetPts.length ? 'stop & targets' : 'stop'
        } re-placed exactly ${[stopPts, ...targetPts].filter((x) => x !== null).join(' / ')} pts from the fill.`,
      );
    diag('reanchor', {
      positionId,
      fill,
      moves: moves.map((m) => ({ kind: m.kind, from: m.from, to: m.to, qty: m.qty })),
      failed,
    });
    done();
  }

  // ── A limit price from a click on Vest's chart. The chart is TradingView in a same-origin frame, whose API Vest itself
  // uses for its own ticket's Limit: the crosshair's price at a click (the mouse moving at most 3 px between down and
  // up), rounded to the tick. The panel listens only while picking, draws the pending order as a line, and sends
  // nothing until Place. Typing the price works too, with or without the chart.
  const PICK_CLICK_PX = 3;
  S.pick = null; // { side, price, chart } while picking a limit price
  let _pickOff = null,
    _pickLine = null,
    _pickLineKey = '';
  function chartApi() {
    for (const f of document.querySelectorAll('iframe')) {
      try {
        const w = f.contentWindow,
          api = w && w.tradingViewApi;
        if (api && typeof api.activeChart === 'function' && typeof api.subscribe === 'function') return { api, win: w };
      } catch {
        /* best effort: nothing to do if this fails */
      }
    }
    return null;
  }
  const onPickKey = (e) => {
    if (e.key === 'Escape' && S.pick) {
      e.preventDefault();
      stopPick();
    }
  };
  function startPick(side, kind = 'limit') {
    if (S.placing || S.adjusting || S.flattening) return;
    stopPick(true);
    S.pick = { side, kind, price: null, chart: false };
    window.addEventListener('keydown', onPickKey, true);
    const tv = chartApi();
    if (tv)
      try {
        const chart = tv.api.activeChart();
        let last = null,
          down = null;
        // the crosshair: where a click would place it, so the bracket preview can follow the pointer
        const move = (d) => {
          last = d && Number.isFinite(d.price) && d.price > 0 ? d.price : null;
          if (!S.pick) return;
          S.pick.hover = last ? roundTick(last, SYMBOLS[S.trade.symbol].tick) : null;
          hoverDraw();
        };
        const dn = (d) => (down = d ? { x: d.clientX, y: d.clientY } : null);
        const up = (d) => {
          const click =
            down && d && Math.abs(d.clientX - down.x) <= PICK_CLICK_PX && Math.abs(d.clientY - down.y) <= PICK_CLICK_PX;
          down = null;
          if (click && last !== null && S.pick) setPickPrice(roundTick(last, SYMBOLS[S.trade.symbol].tick), true);
        };
        chart.crossHairMoved().subscribe(null, move);
        tv.api.subscribe('mouse_down', dn);
        tv.api.subscribe('mouse_up', up);
        tv.win.addEventListener('keydown', onPickKey, true);
        S.pick.chart = chart;
        _pickOff = () => {
          try {
            chart.crossHairMoved().unsubscribe(null, move);
            tv.api.unsubscribe('mouse_down', dn);
            tv.api.unsubscribe('mouse_up', up);
            tv.win.removeEventListener('keydown', onPickKey, true);
          } catch {
            /* best effort: nothing to do if this fails */
          }
        };
      } catch {
        S.pick.chart = false;
      }
    diag('trade_panel', { outcome: 'pick-start', side, chart: !!S.pick.chart });
    updateTrade();
    const el = _root && _root.querySelector('#tr-lpx');
    if (el) {
      el.value = '';
      if (!S.pick.chart) el.focus();
    }
  }
  function setPickPrice(p, fromChart) {
    if (!S.pick) return;
    const tick = SYMBOLS[S.trade.symbol].tick,
      n = p / tick;
    // between ticks: a buy limit rounds down and a sell limit up, as it will be sent; a stop entry the other way, so it
    // never fires before the price you typed
    const down = (S.pick.side === 'long') !== (S.pick.kind === 'stop');
    if (p > 0) p = +((down ? Math.floor(n + 1e-9) : Math.ceil(n - 1e-9)) * tick).toFixed(decimalsOf(tick));
    S.pick.price = p > 0 ? p : null;
    const el = _root && _root.querySelector('#tr-lpx');
    if (fromChart && el) el.value = S.pick.price ? fmtNum(p, decimalsOf(SYMBOLS[S.trade.symbol].tick)) : '';
    updateTrade();
    if (fromChart && S.pick.price) placePick(); // one click on the chart places it; cancel it from its line or the panel
  }
  // The pending order on Vest's chart, as a line (TradingView's order line), kept in step with the price and size.
  function drawPickLine(qty) {
    const chart = S.pick && S.pick.chart;
    const key = chart && S.pick.price ? `${S.pick.side}|${S.pick.price}|${qty}` : '';
    if (key === _pickLineKey) return;
    _pickLineKey = key;
    try {
      if (!key) {
        if (_pickLine) _pickLine.remove();
        _pickLine = null;
        return;
      }
      const col = S.pick.side === 'long' ? LINE_UP : LINE_DOWN;
      if (!_pickLine) _pickLine = chart.createOrderLine();
      _pickLine
        .setPrice(S.pick.price)
        .setText(`${S.pick.kind === 'stop' ? 'Stop' : 'Limit'} ${S.pick.side === 'long' ? 'Buy' : 'Sell'} · not placed`)
        .setQuantity(qty > 0 ? fmtQty(qty, S.trade.symbol) : '')
        .setLineColor(col)
        .setBodyBorderColor(col)
        .setBodyTextColor(col)
        .setBodyBackgroundColor(LINE_INK)
        .setQuantityBorderColor(col)
        .setQuantityBackgroundColor(col)
        .setQuantityTextColor(LINE_INK)
        .setLineStyle(2);
      if (typeof _pickLine.setEditable === 'function') _pickLine.setEditable(false); // a guide, not grabbable
      if (typeof _pickLine.setCancellable === 'function') _pickLine.setCancellable(false);
      if (typeof _pickLine.setLineLength === 'function') _pickLine.setLineLength(ENTRY_LEN, 'percentage');
      if (typeof _pickLine.setExtendLeft === 'function') _pickLine.setExtendLeft(false);
    } catch {
      // the line is a convenience: the panel shows the price either way
    }
  }
  // A line removed while TradingView is still handling the click on it stays "under the cursor" in its painter, which
  // then fails on every repaint until the mouse moves: hide it now, remove it once the click is done.
  function removeLineLater(l) {
    try {
      if (typeof l.setLineColor === 'function') l.setLineColor('rgba(0,0,0,0)');
    } catch {
      /* best effort */
    }
    setTimeout(() => {
      try {
        l.remove();
      } catch {
        /* best effort: nothing to do if this fails */
      }
    }, 50);
  }
  function stopPick(quiet) {
    if (S.legPick) stopLegPick(); // every place a pick has to end (minimise, another tab or market) ends this one too
    if (_pickOff) _pickOff();
    _pickOff = null;
    if (_pickLine) removeLineLater(_pickLine);
    _pickLine = null;
    _pickLineKey = '';
    window.removeEventListener('keydown', onPickKey, true);
    if (!S.pick) return;
    S.pick = null;
    if (!quiet) updateTrade();
  }
  // ── The bracket on Vest's chart (Appearance › Bracket on the chart). While the Trade tab is open and flat, the entry,
  // stop, targets and fail price the ladder shows are drawn as TradingView order lines, for the side the ladder shows,
  // and follow the price and the points. Dragging the stop or a target sets its points. A preview only: nothing is sent.
  // They go in a trade (Vest draws the real ones), off the Trade tab, minimised, or when the chart shows another market.
  // The copier's lines are STRATUH's: lime and red, a solid label for a waiting order, a dark one for the preview.
  const LINE_LEN = 20, // % of the chart's width a line runs in from the price scale
    ENTRY_LEN = 34, // the preview's entry label sits further in, so a stop or target a few ticks away never covers it
    LINE_UP = '#c8f542',
    LINE_DOWN = '#ff5a4f',
    LINE_GREY = '#a3a3a3',
    LINE_INK = '#0c0c0d';
  // A set of order lines on Vest's chart, each redrawn only when it changes, recreated when Vest rebuilds its chart.
  // `want`: [{ id, price, text, qty, color, style (0 solid, 1 dotted, 2 dashed), fill (a solid label), onMove(price) →
  // true if taken (else it snaps back), onCancel() }]. TradingView shows a line's × once it has a cancel handler and lets it
  // be dragged once it has a move handler, so each gets one only when it does something.
  function lineSet() {
    const lines = {},
      keys = {};
    let want = {},
      win = null;
    const drop = (id) => {
      try {
        lines[id].remove();
      } catch {
        /* best effort: the chart may already be gone */
      }
      delete lines[id];
      delete keys[id];
    };
    const clear = () => {
      Object.keys(lines).forEach(drop);
      want = {};
      win = null;
    };
    const draw = (list) => {
      const tv = list.length ? chartApi() : null;
      if (!tv) return clear();
      if (win !== tv.win) clear(); // Vest rebuilt its chart: the old lines went with it
      win = tv.win;
      let chart;
      try {
        chart = tv.api.activeChart();
      } catch {
        return clear();
      }
      const ids = new Set(list.map((w) => w.id));
      Object.keys(lines).forEach((id) => !ids.has(id) && drop(id));
      want = {};
      for (const w of list) {
        want[w.id] = w;
        const key = `${w.price}|${w.text}|${w.qty}|${w.color}|${w.style}|${!!w.onMove}|${!!w.onCancel}|${w.inset || ''}`;
        if (keys[w.id] === key) continue;
        try {
          let l = lines[w.id];
          if (!l) {
            l = lines[w.id] = chart.createOrderLine();
            const id = w.id;
            if (w.onMove && typeof l.onMove === 'function')
              l.onMove(() => {
                const cur = want[id];
                let took = false;
                try {
                  took = !!(cur && cur.onMove && cur.onMove(l.getPrice()));
                } catch {
                  /* refused */
                }
                delete keys[id]; // the next draw puts it exactly where the panel says
                if (!took && cur)
                  try {
                    l.setPrice(cur.price);
                  } catch {
                    /* best effort */
                  }
              });
            if (w.onCancel && typeof l.onCancel === 'function')
              l.onCancel(() => {
                const cur = want[id];
                if (cur && cur.onCancel) cur.onCancel();
              });
            // a short line: from its label to the price scale, LINE_LEN % of the chart's width, not right across it
            if (typeof l.setLineLength === 'function') l.setLineLength(w.inset || LINE_LEN, 'percentage');
            if (typeof l.setExtendLeft === 'function') l.setExtendLeft(false);
          }
          if (typeof l.setEditable === 'function') l.setEditable(!!w.onMove);
          if (typeof l.setCancellable === 'function') l.setCancellable(!!w.onCancel);
          l.setPrice(w.price)
            .setText(w.text)
            .setQuantity(w.qty)
            .setLineColor(w.color)
            .setBodyBorderColor(w.color)
            .setBodyTextColor(w.fill ? LINE_INK : w.color)
            .setBodyBackgroundColor(w.fill ? w.color : LINE_INK)
            .setQuantityBorderColor(w.color)
            .setQuantityBackgroundColor(w.fill ? LINE_INK : w.color)
            .setQuantityTextColor(w.fill ? w.color : LINE_INK)
            .setLineStyle(w.style);
          keys[w.id] = key;
        } catch {
          delete keys[w.id]; // tried again on the next draw; the panel shows the prices either way
        }
      }
    };
    return { draw, clear, any: () => Object.keys(lines).length > 0 };
  }
  const _bracketLines = lineSet();
  const clearBracketLines = () => _bracketLines.clear();
  const drawBracketLines = (want) => _bracketLines.draw(want);
  // A preview line dragged to a new price: its points from the entry, on the right side of it, on the tick.
  function dragPoints(entry, price, tick, wantAbove) {
    const pts = +(Math.round(Math.abs(price - entry) / tick) * tick).toFixed(decimalsOf(tick));
    return price > entry === wantAbove && pts > 0 ? pts : null;
  }
  // The preview while picking: from the price picked, else from where the pointer is on the chart.
  const previewPick = (c) =>
    c.held || !S.pick
      ? null
      : S.pick.price > 0
        ? S.pick
        : S.pick.hover > 0
          ? { ...S.pick, price: S.pick.hover, hovering: true }
          : null;
  // Following the pointer only moves the chart lines (from the Trade tab's last numbers), once per frame: rebuilding the
  // whole tab on every mouse move made the lines trail the pointer.
  let _lastCalc = null,
    _hoverRaf = 0;
  function hoverDraw() {
    if (_hoverRaf) return;
    _hoverRaf = requestAnimationFrame(() => {
      _hoverRaf = 0;
      if (_lastCalc && S.pick && S.tradeOpen) drawBracketLines(bracketWant(_lastCalc, previewPick(_lastCalc)));
    });
  }
  // Is Vest's chart on this market? (A name not known yet counts as yes: the Trade tab follows Vest's market.)
  function chartOnMarket(sym) {
    const name = vestMarketName(),
      shown = name && _displayMap && _displayMap[name];
    return !shown || shown === sym;
  }
  // The lines for the ladder as shown: the side pointed at from the price now, or a limit / stop entry from its price.
  function bracketWant(c, pick) {
    if (!S.chartBracket || !S.tradeOpen || c.held || !(c.price > 0) || !chartOnMarket(c.t.symbol)) return [];
    if (S.dock && !S.dock.open) return [];
    // Limit and Stop: nothing until Buy or Sell is picked (then it hangs off the pointer, or the price typed), and only
    // where that order can go (a buy limit under the price, a buy stop over it)
    if (!pick && c.t.orderType !== 'market') return [];
    if (pick) {
      const above = (pick.side === 'long') === (pick.kind === 'stop');
      if (above ? pick.price <= c.price : pick.price >= c.price) return [];
    }
    const side = pick ? pick.side : S.ladSide || 'long',
      tick = c.meta.tick,
      dir = side === 'long' ? 1 : -1;
    const entry = pick ? pick.price : c.price;
    const plan = planPrices({
      side,
      entry,
      stopPts: c.stopOn ? +c.t.stopPts : null,
      targetPts: c.t.targets.map(Number),
      tick,
    });
    if (plan.error) return [];
    const buy = side === 'long',
      money0 = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
    // dragging the stop or a target sets its points (measured from the entry at the moment it's dropped)
    const setStop = (p) => {
      const pts = dragPoints(pick ? pick.price : priceOf(c.t.symbol) || entry, p, tick, !buy);
      if (!pts) return false;
      S.trade.stopPts = pts;
      const el = _root && _root.querySelector('#tr-stop');
      if (el) el.value = pts;
      saveTrade();
      updateTrade();
      return true;
    };
    const setTarget = (i) => (p) => {
      const pts = dragPoints(pick ? pick.price : priceOf(c.t.symbol) || entry, p, tick, buy);
      if (!pts) return false;
      S.trade.targets[i] = pts;
      S.trade.targets.sort((a, b) => +a - +b); // dragged past another target: they swap names
      saveTrade();
      const body = _root && _root.querySelector('.body');
      if (body && body.querySelector('#tr-targets')) renderTargets(body);
      updateTrade();
      return true;
    };
    const out = [];
    if (pick && pick.hovering)
      out.push({
        id: 'entry',
        price: pick.price,
        text: `${pick.kind === 'stop' ? 'Stop' : 'Limit'} ${buy ? 'Buy' : 'Sell'} · click to place`,
        inset: ENTRY_LEN,
        qty: c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '',
        color: buy ? LINE_UP : LINE_DOWN,
        style: 2,
      });
    if (!pick)
      out.push({
        id: 'entry',
        price: roundTick(entry, tick),
        text: `${buy ? 'Buy' : 'Sell'} · market`,
        inset: ENTRY_LEN,
        qty: c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '',
        color: LINE_GREY,
        style: 2,
      });
    if (plan.stop)
      out.push({
        id: 'stop',
        price: plan.stop,
        text: `SL ${+c.t.stopPts} pts`,
        qty: c.qty > 0 ? `−${money0(c.risk)}` : '',
        color: LINE_DOWN,
        style: 2,
        onMove: setStop,
      });
    plan.targets.forEach((p, i) => {
      const q = c.qtys[i],
        pts = Math.abs(p - entry);
      out.push({
        id: 't' + i,
        price: p,
        text: `TP${i + 1} ${+fmtNum(pts, decimalsOf(tick))} pts`,
        qty: q ? `+${money0(q * pts * c.meta.pointValue)}` : '',
        color: LINE_UP,
        style: 2,
        onMove: setTarget(i),
      });
    });
    const fail = !pick && c.sides[side] && c.sides[side].fail;
    if (fail > 0 && dir * (entry - fail) > 0)
      out.push({ id: 'fail', price: roundTick(fail, tick), text: 'Fail', qty: '', color: LINE_DOWN, style: 1 });
    return out;
  }
  // ── Stop entries: a buy stop above the price or a sell stop below. Vest has only market and limit entries (a buy limit
  // above the price fills at once), so the copier keeps them: placed from the Trade tab (Order: Stop, the price picked
  // on the chart or typed), watched on its own price feed, and sent through placeTrade when the price (the mid, like
  // Vest's stops) reaches the level, so an armed copier copies them like any master order. They live in this tab only:
  // a reload or closing the tab cancels them (logged), and nothing fires late: a level the price passed while the feed
  // was down is cancelled. A buy stop and a sell stop can wait together on a market; the first to fire cancels the other
  // (the news straddle). The size, stop and targets are the ones set when it was placed.
  const STOP_GAP_MS = 3000, // no price for this long: the feed was down, so a level crossed meanwhile is cancelled
    STOP_WAIT_MS = 5000; // a triggered stop entry waits this long for an order already in flight, then gives up
  // S.stopEntries: [{ id, side, symbol, level, slip, setup, qty, at, lastAt, triggered, hitPx }]
  let _stopSeq = 0;
  const tickOf = (sym) => (SYMBOLS[sym] || {}).tick || 0.25;
  const stopName = (e) =>
    `${e.side === 'long' ? 'Buy' : 'Sell'} stop at ${fmtPx(e.level, tickOf(e.symbol))} on ${symLabel(e.symbol)}`;
  // Before a stop entry fires: is the market clear? From Vest's live feed when it's up and the master's positions and
  // waiting orders have been read (st.orders exists); otherwise null, and placeTrade asks Vest. `held` is the position
  // or waiting order found ({ quantity }), else null: the same shape openPosition gives.
  function stopEntryCheck(master, sym) {
    const st = S.acctState[master];
    if (!feedLive() || !st || !Array.isArray(st.orders) || !stateFresh(st)) return null;
    const pos = st.positions.find((p) => p.symbol === sym && p.qty > 0);
    if (pos) return { held: { positionId: pos.id, quantity: String(pos.qty), side: pos.side } }; // an add needs the id
    if (st.orders.some((o) => o.symbol === sym)) return { held: { quantity: '0' } };
    return { held: null };
  }
  // Leverage for waiting stop entries: read when one is placed and every minute while any wait, so firing doesn't wait
  // on it (a change on Vest's ticket is picked up within the minute).
  const STOP_LEV_MS = 60000;
  function refreshStopLeverage() {
    if (!S.stopEntries.length) return;
    fetchLeverages().then((l) => {
      if (l) S.stopEntries.forEach((e) => (e.levs = l));
    });
  }
  setInterval(refreshStopLeverage, STOP_LEV_MS);
  function addStopEntry(side, level) {
    const no = (why) => (toast(why), false);
    if (!S.ack) return no('Read and accept the terms first.');
    const siteHeld = siteBlocks() || pauseBlocks();
    if (siteHeld) return no(siteHeld);
    const c = tradeCalc();
    if (c.error || c.blocked) return no(c.error || c.blocked);
    const sym = c.t.symbol,
      px = priceOf(sym),
      tick = c.meta.tick,
      buy = side === 'long';
    if (c.held) return no(`Already in ${c.meta.label}: a stop entry opens a new trade only.`);
    if (!(px > 0)) return no('Waiting for a live price…');
    if (!nearMarket(level, px, NEAR_MARKET_LOOSE))
      return no(`${fmtPx(level, tick)} is nowhere near the market (${fmtPx(px, tick)}).`);
    if (stopEntryHit(side, level, px))
      return no(`A ${buy ? 'buy' : 'sell'} stop goes ${buy ? 'above' : 'below'} the price (${fmtPx(px, tick)}).`);
    if (S.stopEntries.some((e) => e.symbol === sym && e.side === side))
      return no(`A ${buy ? 'buy' : 'sell'} stop is already waiting on ${c.meta.label}: cancel it first.`);
    const setup = JSON.parse(JSON.stringify(c.t)); // what fires is what's set now
    setup.unit = tradeUnit(sym); // and in the unit it was set in (minis or micros), whatever the tab shows later
    const slip = +setup.slipPts > 0 ? +setup.slipPts : 0;
    const e = { id: 'se' + ++_stopSeq, side, symbol: sym, level, slip, setup, qty: c.qty, at: Date.now() };
    e.lastAt = e.at;
    e.triggered = 0;
    S.stopEntries.push(e);
    watchPrice(sym);
    if (S.levs) e.levs = S.levs; // the Trade tab's last read, until the fresh one lands
    refreshStopLeverage();
    if (S.master && !Array.isArray((S.acctState[S.master] || {}).orders)) refreshTradeState(); // waiting orders, for the check
    const both = S.stopEntries.some((x) => x !== e && x.symbol === sym);
    const legs = [
      c.stopOn ? `stop ${+setup.stopPts}` : 'no stop',
      setup.targets.length ? `targets ${setup.targets.join(' / ')} pts` : 'no targets',
    ].join(', ');
    logEvent(
      'ok',
      `${stopName(e)} waiting: ${fmtQty(c.qty, sym)} ${c.meta.label}, ${legs}. Sends ${slip ? `a limit up to ${slip} pts past it` : 'a market order'} when the price gets there, while this tab stays open.${both ? ' One cancels the other.' : ''}`,
    );
    diag('stop_entry', { outcome: 'placed', side, symbol: sym, level, slip, qty: c.qty, price: px });
    syncStopLines();
    updateTrade();
    return true;
  }
  function cancelStopEntry(e, why) {
    if (!S.stopEntries.includes(e)) return;
    S.stopEntries = S.stopEntries.filter((x) => x !== e);
    if (why) logEvent('info', why);
    diag('stop_entry', { outcome: 'cancelled', side: e.side, symbol: e.symbol, level: e.level, why: why || null });
    syncStopLines();
    unwatchUnused();
    updateTrade();
  }
  function cancelStopEntries(why) {
    [...S.stopEntries].forEach((e) => cancelStopEntry(e, `${stopName(e)} cancelled: ${why}`));
  }
  function checkStopEntries(sym, px) {
    const now = Date.now();
    for (const e of [...S.stopEntries]) {
      if (e.symbol !== sym) continue;
      const gap = now - e.lastAt > STOP_GAP_MS;
      e.lastAt = now;
      if (!e.triggered) {
        if (!stopEntryHit(e.side, e.level, px)) continue;
        if (gap) {
          cancelStopEntry(
            e,
            `${stopName(e)} cancelled: the price got there while the live price feed was down (now ${fmtPx(px, tickOf(sym))}). Nothing was sent.`,
          );
          continue;
        }
        e.triggered = now; // once triggered it goes, even if the price comes back, like a stop order
        e.hitPx = px;
      }
      fireStopEntry(e);
    }
  }
  function fireStopEntry(e) {
    if (!S.stopEntries.includes(e)) return;
    for (const o of S.stopEntries.filter((x) => x !== e && x.symbol === e.symbol))
      cancelStopEntry(
        o,
        `${stopName(o)} cancelled: the ${e.side === 'long' ? 'buy' : 'sell'} stop fired (one cancels the other).`,
      );
    const siteHeld = siteBlocks() || pauseBlocks();
    if (siteHeld) return cancelStopEntry(e, `${stopName(e)} cancelled: ${siteHeld}`);
    if (S.placing || S.adjusting || S.exiting || S.flattening || S.arming || claimBusy()) {
      if (Date.now() - e.triggered > STOP_WAIT_MS)
        cancelStopEntry(
          e,
          `${stopName(e)} cancelled: another order was still going through ${STOP_WAIT_MS / 1000} s after it triggered. Nothing was sent.`,
        );
      return; // tried again on the next price
    }
    S.stopEntries = S.stopEntries.filter((x) => x !== e); // it fires once
    syncStopLines();
    const tick = tickOf(e.symbol),
      ioc = stopEntryLimit({ side: e.side, level: e.level, slipPts: e.slip, tick }),
      now = priceOf(e.symbol) || e.hitPx;
    // with a max slip, a price already past the cap can't fill (a buy fills at the ask, above the mid): nothing is sent
    if (ioc && (e.side === 'long' ? now > ioc : now < ioc)) {
      logEvent(
        'warn',
        `${stopName(e)} triggered, but the price (${fmtPx(now, tick)}) was already past your max slip (${fmtPx(ioc, tick)}): nothing sent.`,
      );
      diag('stop_entry', { outcome: 'past-slip', side: e.side, symbol: e.symbol, level: e.level, price: now, ioc });
      return unwatchUnused();
    }
    logEvent(
      'info',
      `${stopName(e)} triggered (price ${fmtPx(e.hitPx, tick)}): sending ${ioc ? `a limit at ${fmtPx(ioc, tick)}` : 'a market order'}${S.armed ? ', copied to the followers' : ''}.`,
    );
    diag('stop_entry', { outcome: 'triggered', side: e.side, symbol: e.symbol, level: e.level, price: e.hitPx, ioc });
    placeTrade(e.side, null, { setup: e.setup, stopEntry: e, ioc }).finally(unwatchUnused);
  }
  // Waiting orders on Vest's chart, wherever the panel is. A stop entry: its line (drag it to move it, × cancels it) and
  // its stop and targets, dashed, hanging off it (drag one to change that stop entry's points; nothing is sent, it's
  // the copier's own order). A resting limit: Vest draws its line but not its stop and targets until it fills, so they
  // are drawn here, to look at only (moving a leg of an unfilled order on Vest isn't confirmed yet).
  const _stopLines = lineSet();
  function syncStopLines() {
    const want = [];
    for (const e of S.stopEntries.filter((x) => chartOnMarket(x.symbol))) {
      want.push({
        id: e.id,
        price: e.level,
        text: `Stop ${e.side === 'long' ? 'Buy' : 'Sell'}${e.slip ? ` · slip ${e.slip}` : ''}`,
        qty: fmtQty(e.qty, e.symbol),
        color: e.side === 'long' ? LINE_UP : LINE_DOWN,
        style: 0,
        fill: true,
        onMove: e.triggered ? null : (p) => moveStopEntry(e, p),
        onCancel: () => cancelStopEntry(e, `${stopName(e)} cancelled (you cancelled it on the chart).`),
      });
      want.push(...stopEntryBracket(e));
    }
    want.push(...limitLegLines());
    _stopLines.draw(want);
  }
  function stopEntryBracket(e) {
    const tick = tickOf(e.symbol),
      t = e.setup,
      tag = `${e.side === 'long' ? 'Buy' : 'Sell'} stop`;
    const plan = planPrices({
      side: e.side,
      entry: e.level,
      stopPts: t.stopOn === false ? null : +t.stopPts,
      targetPts: t.targets.map(Number),
      tick,
    });
    if (plan.error) return [];
    const drag = (kind, i) => (e.triggered ? null : (p) => setStopEntryLeg(e, kind, i, p));
    const out = [];
    if (plan.stop)
      out.push({
        id: e.id + '-sl',
        price: plan.stop,
        text: `SL ${+t.stopPts} pts`,
        qty: tag,
        color: LINE_DOWN,
        style: 2,
        onMove: drag('sl', 0),
      });
    plan.targets.forEach((p, i) =>
      out.push({
        id: `${e.id}-t${i}`,
        price: p,
        text: `TP${i + 1} ${+t.targets[i]} pts`,
        qty: tag,
        color: LINE_UP,
        style: 2,
        onMove: drag('tp', i),
      }),
    );
    return out;
  }
  // A stop entry's stop or target dragged on the chart: its new points from the level (on the right side of it).
  function setStopEntryLeg(e, kind, i, p) {
    if (!S.stopEntries.includes(e) || e.triggered) return false;
    const buy = e.side === 'long',
      pts = dragPoints(e.level, p, tickOf(e.symbol), kind === 'sl' ? !buy : buy);
    if (!pts) return false;
    if (kind === 'sl') {
      e.setup.stopPts = pts;
      e.setup.stopOn = true;
    } else {
      e.setup.targets[i] = pts;
      e.setup.targets.sort((a, b) => +a - +b);
    }
    const q = tradeCalc(e.setup).qty; // Risk $ sizes from the stop: the size it will send follows
    if (q > 0) e.qty = q;
    logEvent('info', `${stopName(e)}: ${kind === 'sl' ? 'stop' : `target ${i + 1}`} now ${pts} pts.`);
    diag('stop_entry', { outcome: 'leg-moved', side: e.side, symbol: e.symbol, kind, pts });
    syncStopLines();
    updateTrade();
    return true;
  }
  // The master's resting limits' stop and targets, waiting for the fill (to look at only).
  function limitLegLines() {
    const st = S.master && S.acctState[S.master];
    if (!st || !Array.isArray(st.orders) || !st.pendingLegs) return [];
    const out = [];
    for (const o of st.orders) {
      const legs = (o.positionId && st.pendingLegs[o.positionId]) || [];
      if (!legs.length || o.filled > 0 || !chartOnMarket(o.symbol)) continue;
      const tick = tickOf(o.symbol),
        pts = (l) => +fmtNum(Math.abs(l.price - o.price), decimalsOf(tick)),
        tag = `${o.isBuy ? 'Buy' : 'Sell'} limit`;
      const tps = legs.filter((l) => l.kind === 'tp').sort((a, b) => pts(a) - pts(b));
      for (const l of legs)
        out.push({
          id: `${o.id}-${l.id}`,
          price: l.price,
          text: l.kind === 'sl' ? `SL ${pts(l)} pts · on fill` : `TP${tps.indexOf(l) + 1} ${pts(l)} pts · on fill`,
          qty: tag,
          color: l.kind === 'sl' ? LINE_DOWN : LINE_UP,
          style: 2,
          onMove: (p) => moveLimitLeg(o, l.id, p),
        });
    }
    return out;
  }
  // A resting limit's stop or target dragged on the chart. Vest can't change the legs of a limit that hasn't filled
  // (its own table only cancels it), so this does what its chart drag of the limit itself does: cancel the order and
  // place it again at once, same price, size, leverage and expiry, with the leg moved. Both go through the hooked fetch,
  // so copying cancels and re-places the followers' copies too. Checked before anything is sent: the leg on the right
  // side of the limit price (Vest's rule), the sizes of sized targets known, every leg a market one.
  function moveLimitLeg(o, legId, p) {
    const master = S.master,
      st = master && S.acctState[master],
      legs = (st && st.pendingLegs && st.pendingLegs[o.positionId]) || [],
      leg = legs.find((l) => l.id === legId),
      tick = tickOf(o.symbol),
      long = o.isBuy,
      at = roundTick(p, tick),
      what = `${long ? 'Buy' : 'Sell'} limit at ${fmtPx(o.price, tick)}`;
    const no = (why) => (toast(`${what}: ${why}`), false);
    if (!leg || !(at > 0)) return false;
    if (leg.kind === 'sl' ? (long ? at >= o.price : at <= o.price) : long ? at <= o.price : at >= o.price)
      return no(
        `a ${leg.kind === 'sl' ? 'stop' : 'target'} goes ${(leg.kind === 'sl') === long ? 'under' : 'over'} the limit price.`,
      );
    if (S.placing || S.adjusting || S.exiting || S.flattening || S.arming || claimBusy())
      return no('wait for the order going through.');
    const held = siteBlocks() || pauseBlocks();
    if (held) return no(held);
    if (!S.ack) return no('accept the terms first.');
    if (o.filled > 0) return no('part of it has filled: move its stop on the position instead.');
    const tps = legs.filter((l) => l.kind === 'tp');
    // a sized target's size must be known (a full-position one has none); several targets are always sized
    if (
      legs.some((l) => l.exec !== 'market') ||
      tps.some((l) => l.qty === undefined) ||
      (tps.length > 1 && tps.some((l) => !(+l.qty > 0)))
    )
      return no("its targets can't be rebuilt exactly here: cancel it and place it again.");
    const lev =
      o.leverage > 0 ? o.leverage : orderLeverage(levFor(S.levs, master, o.symbol), maxLeverageFor(o.symbol, master));
    if (!(lev > 0)) return no("its leverage isn't known: cancel it and place it again.");
    const pDec = decimalsOf(tick),
      moved = legs.map((l) => (l.id === legId ? { ...l, price: at } : l)),
      mtps = moved.filter((l) => l.kind === 'tp');
    const body = {
      orderType: 'limit',
      leverage: fmtNum(lev, 2),
      side: long ? 'long' : 'short',
      symbol: o.symbol,
      quantity: fmtQty(o.qty, o.symbol),
      timeInForce: 'GTC',
      takeProfits: mtps.map((l) => ({
        executionType: 'market',
        triggerPrice: fmtNum(l.price, pDec),
        ...(+l.qty > 0 ? { quantity: l.qty } : {}),
      })),
      stopLosses: moved
        .filter((l) => l.kind === 'sl')
        .map((l) => ({ executionType: 'market', triggerPrice: fmtNum(l.price, pDec) })),
      price: fmtNum(o.price, pDec),
      ...(o.expiration != null ? { expirationTime: o.expiration } : {}),
    };
    const name = leg.kind === 'sl' ? 'stop' : `target ${tps.indexOf(leg) + 1}`;
    S.placing = true;
    (async () => {
      updateTrade(); // inside: an error here still reaches the finally that clears the flag
      try {
        await send('POST', '/v3/positions/cancel-order', master, { orderId: o.id });
      } catch (e) {
        logEvent('warn', `${what}: couldn't move its ${name} (cancel refused: ${e.message}). The order is unchanged.`);
        return;
      }
      st.orders = (st.orders || []).filter((x) => x.id !== o.id);
      // Vest clears the old order's position a moment after the cancel; an order sent before is refused (code 10006)
      await waitPositionGone(master, o.positionId);
      const refused = (x) => x && x.missing && /refused/.test(x.why || ''),
        notFlat = () => {
          if (S.flattening) throw new Error('Flatten All started, so it was not placed again');
        };
      try {
        notFlat();
        let res = await send('POST', '/v3/positions/open', master, body),
          ff = await feedFill(res.orderId, RESTING_REJECT_WAIT_MS);
        if (refused(ff) && /10006/.test(ff.why)) {
          await waitMarketClear(master, o.symbol);
          notFlat();
          res = await send('POST', '/v3/positions/open', master, body);
          ff = await feedFill(res.orderId, RESTING_REJECT_WAIT_MS);
        }
        if (refused(ff)) throw new Error(ff.why);
        logEvent(
          'ok',
          `${what}: ${name} moved to ${fmtPx(at, tick)}, order re-placed${S.armed ? ' (followers too)' : ''}.`,
        );
        diag('trade_panel', { outcome: 'limit-leg-moved', kind: leg.kind, to: at, body });
      } catch (e) {
        logEvent(
          'warn',
          `${what}: it was cancelled to move its ${name}, but Vest refused it again (${e.message}). No limit is waiting now: place it again.`,
        );
        diag('trade_panel', { outcome: 'limit-replace-failed', error: e.message, body });
      }
    })().finally(() => {
      S.placing = false;
      syncStopLines();
      updateTrade();
      refreshTradeState();
    });
    return true;
  }
  const masterHasLimits = () => {
    const st = S.master && S.acctState[S.master];
    return !!(st && Array.isArray(st.orders) && st.orders.length);
  };
  // A stop entry dragged on the chart: the new level, on the tick (a buy stop rounds up, a sell down), still on its side
  // of the price.
  function moveStopEntry(e, p) {
    if (!S.stopEntries.includes(e) || e.triggered || !(p > 0)) return false;
    const tick = tickOf(e.symbol),
      n = p / tick,
      level = +((e.side === 'long' ? Math.ceil(n - 1e-9) : Math.floor(n + 1e-9)) * tick).toFixed(decimalsOf(tick)),
      px = priceOf(e.symbol),
      buy = e.side === 'long';
    if (!(px > 0) || stopEntryHit(e.side, level, px)) {
      toast(
        `A ${buy ? 'buy' : 'sell'} stop goes ${buy ? 'above' : 'below'} the price${px > 0 ? ` (${fmtPx(px, tick)})` : ''}.`,
      );
      return false;
    }
    if (level === e.level) return true;
    const from = e.level;
    e.level = level;
    logEvent('info', `${stopName(e)}: moved from ${fmtPx(from, tick)}.`);
    diag('stop_entry', { outcome: 'moved', side: e.side, symbol: e.symbol, from, level });
    syncStopLines();
    updateTrade();
    return true;
  }
  // after Vest redraws its chart, and as limits come and go
  setInterval(() => (S.stopEntries.length || _stopLines.any() || masterHasLimits()) && syncStopLines(), 1000);
  // Closing or reloading the tab ends them: say so in the log (kept in this browser), since nothing will fire.
  window.addEventListener('pagehide', () => {
    if (S.stopEntries.length) cancelStopEntries('the page was closed or reloaded (stop entries live in the tab).');
  });
  if (window.__VC_TEST__) window.__vcStops = () => S.stopEntries;

  async function placePick() {
    if (!S.pick || !(S.pick.price > 0) || S.placing) return;
    if (S.dock && !S.dock.open) return stopPick(true); // minimised: never
    const { side, price, kind } = S.pick,
      px = priceOf(S.trade.symbol),
      above = (side === 'long') === (kind === 'stop');
    if (px > 0 && (above ? price <= px : price >= px))
      return toast(
        `A ${side === 'long' ? 'buy' : 'sell'} ${kind === 'stop' ? 'stop' : 'limit'} goes ${above ? 'above' : 'below'} the price (${fmtPx(px, tickOf(S.trade.symbol))}): click again.`,
      );
    if (kind === 'stop' ? addStopEntry(side, price) : await placeTrade(side, price)) stopPick();
  }
  // × on a waiting limit in the Trade tab: Vest's own cancel, through the hooked fetch, so an armed copier cancels the
  // followers' copies too (Vest's line on the chart has its own ×, which does the same).
  async function cancelLimitOrder(id) {
    if (S.placing || S.adjusting || S.flattening) return toast('Wait for the order going through.');
    const st = S.master && S.acctState[S.master],
      o = st && (st.orders || []).find((x) => x.id === id);
    if (!o) return;
    const what = `the ${o.isBuy ? 'buy' : 'sell'} limit at ${fmtPx(o.price, tickOf(o.symbol))} on ${symLabel(o.symbol)}`;
    try {
      await send('POST', '/v3/positions/cancel-order', S.master, { orderId: id });
      st.orders = st.orders.filter((x) => x.id !== id);
      logEvent('ok', `Cancelled ${what}.`);
    } catch (e) {
      logEvent('warn', `Couldn't cancel ${what} (${e.message}): cancel it on Vest.`);
    }
    updateTrade();
    refreshTradeState();
  }

  // ── Breakeven and Close by hand, for the master's open position in this market. Both go through the hooked fetch, so
  // an armed copier moves each follower's stop / closes each follower like the master. Breakeven = entry + the Auto BE
  // "lock" points, only once price is past it (a stop must stay on the losing side) and only if it tightens the stop.
  // Vest refuses a stop the price has already passed (seen live: HTTP 400 with the mark a fraction above it). It triggers
  // stops on the mid since 2026-10-10 (the bid / ask before); the check stays on the bid (longs) / ask (shorts), which is
  // never more lenient than the mid: with Vest's book live, the bid (ask) must be BE_BOOK_CLEAR_TICKS clear of
  // breakeven; without it, the mid or mark must be BE_CLEAR_TICKS clear (about a spread more).
  const BE_CLEAR_TICKS = 4,
    BE_BOOK_CLEAR_TICKS = 2;
  // The price a breakeven stop is checked against and how far clear it must be: { px, clear }.
  const beRef = (sym, side, px, tick) => {
    const ref = stopRefOf(sym, side);
    return ref > 0 ? { px: ref, clear: BE_BOOK_CLEAR_TICKS * tick } : { px, clear: BE_CLEAR_TICKS * tick };
  };
  function breakevenPlan(h, price, tick) {
    const be = breakevenPrice({ side: h.side, entry: h.openPrice, offsetPts: 0, tick }); // breakeven: the average entry
    const { px, clear } = beRef(h.symbol, h.side, price, tick);
    const sl = (h.triggers || []).find((x) => x.kind === 'sl');
    const long = h.side === 'long';
    const why = !sl
      ? 'This position has no stop to move.'
      : !(px > 0)
        ? 'Waiting for a live price…'
        : long
          ? sl.price >= be
            ? 'The stop is already at or past breakeven.'
            : px <= be + clear
              ? `Price needs to be above ${fmtPx(be + clear, tick)} first, so Vest accepts the stop.`
              : null
          : sl.price <= be
            ? 'The stop is already at or past breakeven.'
            : px >= be - clear
              ? `Price needs to be below ${fmtPx(be - clear, tick)} first, so Vest accepts the stop.`
              : null;
    return { price: be, sl, why };
  }
  async function breakevenNow() {
    if (S.placing || S.adjusting || S.flattening || S.arming || S.exiting) return;
    const siteHeld = siteBlocks();
    if (siteHeld) return toast(siteHeld);
    const master = S.master,
      sym = S.trade.symbol,
      meta = SYMBOLS[sym],
      tick = meta.tick,
      fmt = (n) => fmtNum(n, decimalsOf(tick));
    if (!master) return;
    S.placing = true;
    try {
      updateTrade();
      // read the position fresh: its entry and stop as Vest has them now
      const pos = await openPosition(master, sym);
      if (!pos) throw new Error(`${accLabel(master)} has no open ${meta.label} position`);
      const px = priceOf(sym),
        entry = parseFloat(pos.openPrice);
      if (!nearMarket(entry, px, NEAR_MARKET_LOOSE))
        throw new Error(`Vest shows an entry of ${pos.openPrice}, nowhere near the market — move the stop yourself`);
      const h = { symbol: sym, side: pos.side, openPrice: entry, triggers: posLegs(pos) };
      const be = breakevenPlan(h, px, tick);
      if (be.why) throw new Error(be.why.replace(/\.$/, ''));
      await send('PUT', '/v3/positions/stop-loss', master, {
        positionId: posIdOf(pos),
        executionType: 'market',
        triggerPrice: fmt(be.price),
        stopLossId: be.sl.id,
      });
      const plan = S.plans[posIdOf(pos)];
      if (plan) {
        plan.moved = true;
        endPlan(plan, null);
      }
      logEvent('ok', `Breakeven: stop moved to ${fmt(be.price)} (entry ${fmt(entry)}, by hand).`);
      diag('breakeven', { outcome: 'moved-manual', positionId: posIdOf(pos), entry, stop: fmt(be.price), price: px });
    } catch (e) {
      const why =
        /HTTP 400/.test(e.message) && !e.message.includes('Price needs')
          ? `Vest refused the stop (price was too close to breakeven)`
          : e.message;
      logEvent('warn', `Breakeven: not moved — ${why}.`);
      diag('breakeven', {
        outcome: 'manual-refused',
        error: e.message,
        errorCode: errCode(e),
        price: priceOf(sym),
      });
    } finally {
      S.placing = false;
      updateTrade();
      refreshTradeState();
    }
  }
  // ── Getting out (Close, Reduce) never waits. The position and its leverage (Vest wants one on every exit) come from what
  // the copier already knows when Vest's live feed is up, so nothing is read before the order goes; without the feed,
  // one read. An order, a re-anchor or a breakeven move still in flight doesn't hold an exit back: they find the
  // position closed and stop. Only Flatten All (already closing everything), another exit on its way or a start of
  // copying in progress (it is reading the positions to adopt) holds one.
  const _exitedHere = new Set(); // position ids the panel closed, so a re-anchor or breakeven still running leaves them
  const exitBlocks = () => S.flattening || S.exiting || S.arming;
  async function exitPosition(master, sym) {
    const h = feedLive() && heldOn(master, sym);
    if (h) return { id: h.id, qty: h.qty, side: h.side, leverage: h.leverage, read: false };
    const r = await api('/v3/positions/opened', (await mintAccountToken(master)).token);
    const p = ((r && r.positions) || []).find((x) => x.symbol === sym && parseFloat(x.quantity) > 0);
    return p
      ? { id: posIdOf(p), qty: parseFloat(p.quantity), side: p.side, leverage: num(p.leverage), read: true }
      : null;
  }
  const exitLeverage = (pos, master, sym) =>
    (pos.leverage > 0 ? pos.leverage : orderLeverage(levFor(S.levs, master, sym), maxLeverageFor(sym, master))) ||
    +DEFAULT_LEVERAGE;
  // A panel exit that failed: before it went out, it wasn't sent; after, Vest didn't take the master's, and fast mode
  // may already have sent the followers' (their copies leave with the master's order).
  const exitFailed = (Name, name, sent, e) =>
    !sent
      ? `${Name}: not sent — ${e.message}.`
      : `${Name}: Vest didn't take the master's ${name} (${e.message})${S.armed && S.fast ? `; fast mode had already sent the followers' ${name}` : ''}. Check the master on Vest.`;
  function noteExitedHere(pid) {
    _exitedHere.add(pid);
    if (_exitedHere.size > 200) _exitedHere.delete(_exitedHere.values().next().value);
    if (S.plans[pid]) endPlan(S.plans[pid], null); // nothing left for breakeven to move
  }
  async function closeNow() {
    if (exitBlocks()) return;
    const master = S.master,
      sym = S.trade.symbol,
      meta = SYMBOLS[sym];
    if (!master) return;
    S.exiting = true;
    let sent = false;
    try {
      updateTrade();
      const pos = await exitPosition(master, sym);
      if (!pos) throw new Error(`${accLabel(master)} has no open ${meta.label} position`);
      noteExitedHere(pos.id);
      sent = true;
      await send('POST', '/v3/positions/close', master, closeBody(sym, pos.id, exitLeverage(pos, master, sym), master));
      logEvent(
        'ok',
        `Trade panel: CLOSE ${fmtQty(pos.qty, sym)} ${meta.label} on ${accLabel(master)}${S.armed ? ' — the copier closes the followers' : ''}.`,
      );
      diag('trade_panel', { outcome: 'closed', positionId: pos.id, quantity: pos.qty, readFirst: pos.read });
    } catch (e) {
      logEvent('warn', exitFailed('Close', 'close', sent, e));
      diag('trade_panel', { outcome: 'close-failed', error: e.message, errorCode: errCode(e) });
    } finally {
      S.exiting = false;
      updateTrade();
      refreshTradeState();
    }
  }

  // ── Adding a stop or a target to the open trade (v0.40): from the buttons above Breakeven / Close (then one click on
  // the chart, or Enter for the saved points) or from the chart's right-click menu (at the price clicked). A target
  // added to targets already there re-splits the position across all of them by the trade's split (Even for a trade
  // the copier didn't place): those are resized first (each PUT
  // carries its size, else Vest makes the leg full-position), then the new one is added. Everything goes through the
  // hooked fetch, so an armed copier copies each step to the followers, sized to their own positions.
  const MAX_TRADE_TARGETS = 5;
  // the market on Vest's chart (the Trade tab's follows it only while open)
  const chartSymbol = () => {
    const n = vestMarketName();
    return (n && _displayMap && _displayMap[n]) || S.trade.symbol;
  };
  // the master's open trade on a market as the feed / last read has it (a waiting limit's size-0 position doesn't count)
  function heldOn(master, sym) {
    const st = master && S.acctState[master];
    return (stateFresh(st) && st.positions.find((p) => p.symbol === sym && p.qty > 0)) || null;
  }
  // under the price is a long's stop and a short's target
  const legKindAt = (side, price, px) => (price < px === (side === 'long') ? 'sl' : 'tp');
  // why adding that leg has to wait, or null (a stop only takes risk off, so a pause doesn't hold it back)
  function legBlocks(kind) {
    if (S.placing || S.adjusting || S.exiting || S.flattening || S.arming || claimBusy())
      return 'Wait for the order going through.';
    const held = siteBlocks() || (kind === 'tp' ? pauseBlocks() : null);
    if (held) return held;
    if (!S.ack) return 'Read and accept the terms first.';
    return null;
  }
  async function addLeg(kind, price, sym) {
    const name = kind === 'sl' ? 'stop' : 'target';
    const blocked = legBlocks(kind);
    if (blocked) return void toast(blocked);
    const master = S.master,
      meta = SYMBOLS[sym];
    if (!master || !meta) return;
    const tick = meta.tick,
      fmt = (n) => fmtNum(n, decimalsOf(tick));
    S.placing = true;
    try {
      updateTrade();
      // read the position fresh: its side, size and the legs Vest has on it now
      const r = await api('/v3/positions/opened', (await mintAccountToken(master)).token);
      const pos = ((r && r.positions) || []).find((x) => x.symbol === sym && parseFloat(x.quantity) > 0);
      if (!pos) throw new Error(`${accLabel(master)} has no open ${meta.label} position`);
      const long = pos.side === 'long',
        px = priceOf(sym),
        entry = parseFloat(pos.openPrice),
        pid = posIdOf(pos),
        p = roundTick(price, tick);
      if (!(px > 0)) throw new Error('no live price yet');
      if (!nearMarket(p, px, NEAR_MARKET_LOOSE)) throw new Error(`${fmt(p)} is too far from the price (${fmt(px)})`);
      // Vest's rule: a long's stop under the price and its target over it (a short's the other way), a tick clear
      const under = (kind === 'sl') === long;
      if (under ? !(p <= px - tick) : !(p >= px + tick))
        throw new Error(
          `a ${long ? 'long' : 'short'}'s ${name} goes ${under ? 'below' : 'above'} the price (${fmt(px)})`,
        );
      const sls = pos.stopLosses || [],
        tps = pos.takeProfits || [];
      const pts = fmtNum(Math.abs(p - entry), decimalsOf(tick));
      if (kind === 'sl') {
        if (sls.length) throw new Error('the trade already has a stop: drag it on the chart to move it');
        await send('POST', '/v3/positions/stop-loss', master, {
          positionId: pid,
          executionType: 'market',
          triggerPrice: fmt(p),
        });
        logEvent(
          'ok',
          `Stop added at ${fmt(p)} (${pts} pts from the entry)${S.armed ? ' — the copier adds it on the followers' : ''}.`,
        );
        diag('trade_panel', { outcome: 'leg-added', kind, price: p, positionId: pid });
        return;
      }
      if (tps.length >= MAX_TRADE_TARGETS) throw new Error(`${MAX_TRADE_TARGETS} targets is the most`);
      if (tps.some((l) => Math.abs(parseFloat(l.triggerPrice) - p) < tick / 2))
        throw new Error(`there's already a target at ${fmt(p)}`);
      // the targets nearest the entry first, by the trade's split
      const total = parseFloat(pos.quantity),
        n = tps.length + 1,
        order = [...tps.map((l) => ({ l, price: parseFloat(l.triggerPrice) })), { l: null, price: p }].sort((a, b) =>
          long ? a.price - b.price : b.price - a.price,
        );
      if (n > 1) {
        const prices = order.map((o) => o.price),
          sp = resplitTargets({
            side: pos.side,
            prices,
            total,
            mode: splitOf(pid),
            step: meta.step,
            minUsd: MIN_LEG_USD,
          });
        if (sp.error)
          throw new Error(
            `${fmtQty(total, sym)} ${meta.label} is too small for ${n} targets${/minimum/.test(sp.error) ? " (Vest's $1 minimum per target)" : ''}`,
          );
        order.forEach((o, i) => (o.qty = fmtQty(sp.qtys[i], sym)));
      }
      // shrink the targets already there first, so the sizes never add up past the position
      for (const o of order) {
        if (!o.l) continue;
        const sized = o.l.sizeMode !== 'full_position' && o.l.quantity != null;
        if (sized && +o.l.quantity === +o.qty) continue;
        await send('PUT', '/v3/positions/take-profit', master, {
          positionId: pid,
          executionType: 'market',
          triggerPrice: fmt(o.price),
          takeProfitId: o.l.id,
          quantity: o.qty,
        });
      }
      const mine = order.find((o) => !o.l);
      await send('POST', '/v3/positions/take-profit', master, {
        positionId: pid,
        executionType: 'market',
        triggerPrice: fmt(p),
        ...(n > 1 ? { quantity: mine.qty } : {}),
      });
      logEvent(
        'ok',
        `Target added at ${fmt(p)} (${pts} pts from the entry)${n > 1 ? `; ${n} targets of ${order.map((o) => o.qty).join(' / ')}` : ', the whole position'}${
          S.armed ? ' — the copier does the same on the followers' : ''
        }.`,
      );
      diag('trade_panel', {
        outcome: 'leg-added',
        kind,
        price: p,
        positionId: pid,
        qtys: order.map((o) => o.qty || null),
      });
    } catch (e) {
      logEvent('warn', `Add ${name}: not placed — ${e.message}.`);
      diag('trade_panel', { outcome: 'leg-add-failed', kind, price, error: e.message, errorCode: errCode(e) });
    } finally {
      S.placing = false;
      updateTrade();
      refreshTradeState();
    }
  }
  if (window.__VC_TEST__) window.__vcAddLeg = addLeg;
  // The chart's right-click menu in a trade: "Add stop loss @ price" or "Add take profit @ price" for where the click was
  // (under the price: a long's stop, a short's target). TradingView's onContextMenu; Vest adds no items of its own, and
  // the standard ones stay below ours. Registered once per chart; nothing is added outside a trade.
  let _menuApi = null;
  function hookChartMenu(f) {
    try {
      const api = f && f.contentWindow.tradingViewApi;
      if (!api || api === _menuApi || typeof api.onContextMenu !== 'function') return;
      _menuApi = api;
      api.onContextMenu((unixTime, price) => {
        try {
          return chartMenuItems(price);
        } catch {
          return [];
        }
      });
    } catch {
      /* best effort: the buttons do the same */
    }
  }
  function chartMenuItems(price) {
    const master = S.master,
      sym = chartSymbol(),
      meta = SYMBOLS[sym];
    if (!master || !meta || !(price > 0)) return [];
    const h = heldOn(master, sym),
      px = priceOf(sym);
    if (!h || !(px > 0)) return [];
    const p = roundTick(price, meta.tick);
    if (Math.abs(p - px) < meta.tick) return [];
    const kind = legKindAt(h.side, p, px),
      legs = h.triggers || [];
    if (kind === 'sl' && legs.some((l) => l.kind === 'sl')) return [];
    if (kind === 'tp' && legs.filter((l) => l.kind === 'tp').length >= MAX_TRADE_TARGETS) return [];
    if (legBlocks(kind)) return [];
    return [
      {
        position: 'top',
        text: `${kind === 'sl' ? 'Add stop loss' : 'Add take profit'} @ ${fmtPx(p, meta.tick)}`,
        click: () => addLeg(kind, p, sym),
      },
      { position: 'top', text: '-' },
    ];
  }
  if (window.__VC_TEST__) window.__vcMenu = chartMenuItems;
  // The buttons' pick: the stop or target hangs off the pointer on Vest's chart as a dashed line; one click on the chart
  // places it there, Enter (or the button again) at the saved points from the average entry, Esc cancels. Without a
  // chart the button places it at the saved points at once.
  S.legPick = null; // { kind, sym, hover } while picking
  let _legPickOff = null,
    _legLine = null,
    _legLineKey = '';
  // the saved points for the next stop or target, from the average entry (the setup's stop, or the target for its slot)
  function legDefault(kind, h) {
    const t = S.trade,
      tps = (h.triggers || []).filter((l) => l.kind === 'tp').length,
      pts = kind === 'sl' ? +t.stopPts || 0 : +t.targets[tps] || +t.targets[t.targets.length - 1] || DEFAULT_TARGET_PTS,
      dir = h.side === 'long' ? 1 : -1;
    return pts > 0 ? h.openPrice + (kind === 'sl' ? -dir : dir) * pts : null;
  }
  function placeLegDefault(kind) {
    const sym = S.trade.symbol,
      h = heldOn(S.master, sym),
      p = h && legDefault(kind, h);
    stopLegPick();
    if (!p) return toast(`Set the ${kind === 'sl' ? 'stop' : 'target'} points first, or click the chart.`);
    addLeg(kind, p, sym);
  }
  const onLegKey = (e) => {
    if (!S.legPick) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      stopLegPick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      placeLegDefault(S.legPick.kind);
    }
  };
  function startLegPick(kind) {
    if (S.legPick && S.legPick.kind === kind) return placeLegDefault(kind); // the button again: the saved points
    const blocked = legBlocks(kind);
    if (blocked) return toast(blocked);
    const sym = S.trade.symbol;
    if (!heldOn(S.master, sym)) return;
    stopPick(true);
    const tv = chartApi();
    if (!tv) return placeLegDefault(kind);
    S.legPick = { kind, sym, hover: null };
    window.addEventListener('keydown', onLegKey, true);
    try {
      const chart = tv.api.activeChart();
      let last = null,
        down = null;
      const move = (d) => {
        last = d && Number.isFinite(d.price) && d.price > 0 ? d.price : null;
        if (!S.legPick) return;
        S.legPick.hover = last ? roundTick(last, SYMBOLS[sym].tick) : null;
        drawLegLine(chart);
      };
      const dn = (d) => (down = d ? { x: d.clientX, y: d.clientY } : null);
      const up = (d) => {
        const click =
          down && d && Math.abs(d.clientX - down.x) <= PICK_CLICK_PX && Math.abs(d.clientY - down.y) <= PICK_CLICK_PX;
        down = null;
        if (!click || last === null || !S.legPick) return;
        const k = S.legPick.kind;
        stopLegPick();
        addLeg(k, roundTick(last, SYMBOLS[sym].tick), sym);
      };
      chart.crossHairMoved().subscribe(null, move);
      tv.api.subscribe('mouse_down', dn);
      tv.api.subscribe('mouse_up', up);
      tv.win.addEventListener('keydown', onLegKey, true);
      _legPickOff = () => {
        try {
          chart.crossHairMoved().unsubscribe(null, move);
          tv.api.unsubscribe('mouse_down', dn);
          tv.api.unsubscribe('mouse_up', up);
          tv.win.removeEventListener('keydown', onLegKey, true);
        } catch {
          /* best effort: nothing to do if this fails */
        }
      };
    } catch {
      stopLegPick();
      return placeLegDefault(kind);
    }
    diag('trade_panel', { outcome: 'leg-pick-start', kind });
    updateTrade();
  }
  function drawLegLine(chart) {
    const lp = S.legPick,
      key = lp && lp.hover ? `${lp.kind}|${lp.hover}` : '';
    if (key === _legLineKey) return;
    _legLineKey = key;
    try {
      if (!key) {
        if (_legLine) _legLine.remove();
        _legLine = null;
        return;
      }
      const col = lp.kind === 'sl' ? LINE_DOWN : LINE_UP;
      if (!_legLine) _legLine = chart.createOrderLine();
      _legLine
        .setPrice(lp.hover)
        .setText(`${lp.kind === 'sl' ? 'Stop' : 'Target'} · click to place`)
        .setQuantity('')
        .setLineColor(col)
        .setBodyBorderColor(col)
        .setBodyTextColor(col)
        .setBodyBackgroundColor(LINE_INK)
        .setLineStyle(2);
      // a guide only: not grabbable, so the click that places it lands on the chart, not on this line (TradingView kept
      // painting a removed line it was tracking under the cursor: thousands of errors until the mouse moved)
      if (typeof _legLine.setEditable === 'function') _legLine.setEditable(false);
      if (typeof _legLine.setCancellable === 'function') _legLine.setCancellable(false);
      if (typeof _legLine.setLineLength === 'function') _legLine.setLineLength(LINE_LEN, 'percentage');
      if (typeof _legLine.setExtendLeft === 'function') _legLine.setExtendLeft(false);
    } catch {
      // the line is a convenience: the click still places it
    }
  }
  function stopLegPick() {
    if (_legPickOff) _legPickOff();
    _legPickOff = null;
    if (_legLine) removeLineLater(_legLine);
    _legLine = null;
    _legLineKey = '';
    window.removeEventListener('keydown', onLegKey, true);
    if (!S.legPick) return;
    S.legPick = null;
    updateTrade();
  }

  // Scale out: take the picked share (25 or 50%) off the master's position at market, with Vest's own reduce order (the
  // body its close window sends). 100% is a close. The stop stays where it is; once the reduce has filled, the sized
  // targets are re-split across what's left (resplitAfter). It goes through the hooked fetch, so an armed copier reduces
  // each follower by the same share of its own position, and each follower re-splits its own targets.
  async function reduceNow() {
    if (exitBlocks()) return;
    const key = S.addPick || '25';
    if (key === 'max') return;
    if (key === '100') return closeNow(); // a close is never held back
    const siteHeld = siteBlocks(); // a pause doesn't hold a reduce back: it only takes risk off
    if (siteHeld) return toast(siteHeld);
    const master = S.master,
      sym = S.trade.symbol,
      meta = SYMBOLS[sym];
    if (!master) return;
    S.exiting = true;
    let sent = false;
    try {
      updateTrade();
      const pos = await exitPosition(master, sym);
      if (!pos) throw new Error(`${accLabel(master)} has no open ${meta.label} position`);
      const have = pos.qty,
        q = floorStep(have * (key === '50' ? 0.5 : 0.25), meta.step);
      if (!(q > 0)) throw new Error(`${key}% of ${fmtQty(have, sym)} rounds to nothing at ${meta.label}'s size step`);
      sent = true;
      const body = {
        positionId: pos.id,
        orderType: 'market',
        leverage: fmtNum(exitLeverage(pos, master, sym), 2),
        quantity: fmtQty(q, sym),
        timeInForce: 'IOC',
        reduceOnly: true,
        symbol: sym,
      };
      const res = await send('POST', '/v3/positions/reduce', master, body);
      logEvent(
        'ok',
        `Trade panel: REDUCE ${body.quantity} ${meta.label} (${fmtQty(have, sym)} → ${fmtQty(have - q, sym)})${S.armed ? ' — the copier reduces the followers' : ''}. The stop stays where it is.`,
      );
      diag('trade_panel', {
        outcome: 'reduced',
        positionId: body.positionId,
        quantity: body.quantity,
        prevQty: have,
        readFirst: pos.read,
      });
      adjust(() =>
        resplitAfter({ master, sym, positionId: pos.id, orderId: res.orderId, before: have, what: 'reduce' }),
      );
    } catch (e) {
      logEvent('warn', exitFailed('Reduce', 'reduce', sent, e));
      diag('trade_panel', { outcome: 'reduce-failed', error: e.message, errorCode: errCode(e) });
    } finally {
      S.exiting = false;
      updateTrade();
      refreshTradeState();
    }
  }

  // ── Breakeven engine. One plan per trade placed from the panel, saved so a page reload keeps watching. It watches the
  // live mark price; once due (TP1 crossed, or +X pts in favour) it moves the master's stop to entry + offset. That move
  // goes through the hooked fetch too, so an armed copier moves the followers' stops with it.
  const PLANS_KEY = 'vc-plans';
  const PLAN_NO_ENTRY_MS = 60000,
    PLAN_WATCH_MS = 5000,
    BE_RETRY_MS = 3000,
    BE_MAX_FAILURES = 5;
  S.plans = {};
  let _planTimer = null;
  function savePlans() {
    store.set(PLANS_KEY, S.plans);
  }
  function loadPlans() {
    const saved = store.get(PLANS_KEY, {});
    S.plans = {};
    // only plans that can be acted on: a position id, a known side and a market name
    if (saved && typeof saved === 'object')
      for (const [k, p] of Object.entries(saved))
        if (
          p &&
          typeof p === 'object' &&
          p.positionId === k &&
          typeof p.symbol === 'string' &&
          /^(long|short)$/.test(p.side)
        )
          S.plans[k] = p;
    const list = Object.values(S.plans);
    list.forEach((p) => {
      p.busy = false; // nothing is in flight after a reload
      p.reanchoring = false;
      watchPrice(p.symbol);
      if (!(p.entry > 0)) fillEntry(p); // reloaded before its entry was known
    });
    if (list.length) startPlanWatch();
  }
  function addPlan(p) {
    S.plans[p.positionId] = p;
    savePlans();
    watchPrice(p.symbol);
    startPlanWatch();
    if (!p.reanchoring && !(p.entry > 0)) fillEntry(p); // re-anchor supplies the entry when it runs
    updateTrade();
  }
  function endPlan(p, why) {
    if (S.plans[p.positionId] !== p) return; // already replaced (an add rebuilt it) or ended
    delete S.plans[p.positionId];
    savePlans();
    if (why) logEvent('info', why);
    unwatchUnused();
    updateTrade();
  }
  async function fillEntry(p) {
    // the real fill price: breakeven is measured from it
    for (let i = 0; i < 4 && !(p.entry > 0); i++) {
      if (i) await sleep(1200);
      const f = await fillInfo(p.master, p.symbol, p.orderId, i ? 0 : FEED_FILL_WAIT_MS);
      if (f && f.price > 0) p.entry = f.price;
    }
    if (!(p.entry > 0)) {
      try {
        const pos = await openPosition(p.master, p.symbol, p.positionId);
        const open = pos ? parseFloat(pos.openPrice) : NaN;
        if (pos && nearMarket(open, priceOf(p.symbol) || open, NEAR_MARKET_LOOSE)) p.entry = open;
        else return endPlan(p, "Breakeven: the trade didn't open, nothing to watch.");
      } catch {
        /* best effort: nothing to do if this fails */
      }
    }
    savePlans();
    updateTrade();
  }
  function checkPlans(sym, px) {
    if (siteBlocks()) return; // paused while Vest's update is unchecked or failed the check
    for (const p of Object.values(S.plans)) {
      if (
        p.symbol !== sym ||
        p.moved ||
        p.busy ||
        p.reanchoring ||
        !(p.entry > 0) ||
        (p.retryAt && Date.now() < p.retryAt)
      )
        continue;
      if (!nearMarket(p.entry, px, NEAR_MARKET_LOOSE)) {
        // an implausible entry is never acted on
        endPlan(
          p,
          `Breakeven: stopped watching — its entry (${p.entry}) is nowhere near the market. Manage this stop yourself.`,
        );
        diag('breakeven', {
          outcome: 'dropped-bad-entry',
          positionId: p.positionId,
          entry: p.entry,
          tp1: p.tp1,
          price: px,
        });
        continue;
      }
      if (!p.triggered) {
        // sticky: once TP1 / +X is reached, it stays due
        const tp1Hit = p.side === 'long' ? px >= p.tp1 : px <= p.tp1;
        p.triggered = breakevenDue({
          mode: p.beMode,
          side: p.side,
          entry: p.entry,
          price: px,
          triggerPts: p.beTrigger,
          tp1Filled: tp1Hit,
          alreadyMoved: false,
        });
        if (!p.triggered) continue;
        savePlans();
      }
      moveToBreakeven(p, px);
    }
  }
  // Price must be clear of breakeven by BE_CLEAR_TICKS (Vest refuses a stop the price has passed). Before moving, the
  // position is re-read: the stop is measured from the worse of the plan's entry and Vest's average (never locks in a
  // loss), and a stop already at or past breakeven (moved by hand, say) is left alone.
  const BE_WAIT_MS = 2000;
  async function moveToBreakeven(p, price) {
    const tick = (SYMBOLS[p.symbol] || SYMBOLS[DEFAULT_SYMBOL]).tick,
      long = p.side === 'long';
    const { px, clear } = beRef(p.symbol, p.side, price, tick);
    const beAt = (entry) => breakevenPrice({ side: p.side, entry, offsetPts: p.beOffset, tick });
    const tooClose = (be) => (long ? px <= be + clear : px >= be - clear);
    if (tooClose(beAt(p.entry))) return; // a stop must stay clear of price on the losing side: wait
    if (!nearMarket(beAt(p.entry), px, NEAR_MARKET_LOOSE))
      return endPlan(p, `Breakeven: computed stop ${beAt(p.entry)} is nowhere near the market — not moved.`);
    p.busy = true;
    try {
      let pos;
      try {
        pos = await openPosition(p.master, p.symbol, p.positionId);
      } catch {
        p.retryAt = Date.now() + BE_WAIT_MS; // couldn't read it: try again shortly
        return;
      }
      if (!pos) return endPlan(p, 'Breakeven: trade closed — stopped watching.');
      // turned around (an opposite order bigger than the position, Vest's flip): its stop is gone, the plan doesn't apply
      if (pos.side && pos.side !== p.side) return endPlan(p, 'Breakeven: the trade turned around — stopped watching.');
      const avg = parseFloat(pos.openPrice);
      const entry =
        avg > 0 && nearMarket(avg, px, NEAR_MARKET_LOOSE)
          ? long
            ? Math.max(p.entry, avg)
            : Math.min(p.entry, avg)
          : p.entry;
      const be = beAt(entry);
      if (tooClose(be)) {
        p.retryAt = Date.now() + BE_WAIT_MS; // Vest's average is worse than the plan's entry: wait for price
        return;
      }
      const sls = posLegs(pos).filter((l) => l.kind === 'sl');
      const sl = sls.find((l) => l.id === p.stopLegId) || sls[0];
      if (!sl) return endPlan(p, 'Breakeven: no stop on this trade to move.');
      if (long ? sl.price >= be - tick / 2 : sl.price <= be + tick / 2)
        return endPlan(p, `Breakeven: the stop (${sl.price}) is already at or past breakeven — left as it is.`);
      p.stopLegId = sl.id;
      const body = {
        positionId: p.positionId,
        executionType: 'market',
        triggerPrice: fmtNum(be, decimalsOf(tick)),
        stopLossId: p.stopLegId,
      };
      await send('PUT', '/v3/positions/stop-loss', p.master, body);
      p.moved = true;
      const why = p.beMode === 'tp1' ? 'TP1 reached' : `+${p.beTrigger} pts reached`;
      logEvent(
        'ok',
        `Breakeven: stop moved to ${body.triggerPrice} (${why}, entry ${fmtNum(entry, decimalsOf(tick))}).`,
      );
      diag('breakeven', {
        outcome: 'moved',
        positionId: p.positionId,
        entry,
        planEntry: p.entry,
        vestAvg: avg,
        stop: body.triggerPrice,
        mode: p.beMode,
        price: px,
      });
      endPlan(p, null);
    } catch (e) {
      p.failures = (p.failures || 0) + 1;
      diag('breakeven', {
        outcome: 'failed',
        positionId: p.positionId,
        error: e.message,
        errorCode: errCode(e),
        attempt: p.failures,
      });
      if (p.failures >= BE_MAX_FAILURES) {
        endPlan(
          p,
          `Breakeven: Vest refused the stop move ${p.failures} times (${e.message}) — move your stop yourself.`,
        );
      } else {
        p.retryAt = Date.now() + BE_RETRY_MS;
        logEvent('warn', `Breakeven: stop move failed (${e.message}) — retrying.`);
      }
    } finally {
      p.busy = false;
      savePlans();
    }
  }
  function startPlanWatch() {
    // end plans whose trade has closed (stop, target, manual)
    if (_planTimer) return;
    _planTimer = setInterval(async () => {
      const list = Object.values(S.plans);
      if (!list.length) {
        clearInterval(_planTimer);
        _planTimer = null;
        return;
      }
      if (feedLive() && !list.some((p) => !(p.entry > 0))) return; // the live feed ends a plan the moment its trade closes
      for (const master of [...new Set(list.map((p) => p.master))]) {
        try {
          const r = await api('/v3/positions/opened', (await mintAccountToken(master)).token);
          const open = new Set(((r && r.positions) || []).map(posIdOf));
          list
            .filter((p) => p.master === master && p.entry > 0 && !open.has(p.positionId))
            .forEach((p) => endPlan(p, 'Breakeven: trade closed — stopped watching.'));
          list
            .filter(
              (p) => p.master === master && !(p.entry > 0) && !p.reanchoring && Date.now() - p.at > PLAN_NO_ENTRY_MS,
            )
            .forEach((p) =>
              endPlan(p, "Breakeven: couldn't find this trade's entry — stopped watching. Manage the stop yourself."),
            );
        } catch {
          /* best effort: nothing to do if this fails */
        }
      }
    }, PLAN_WATCH_MS);
  }
  if (window.__VC_TEST__) window.__vcPlans = () => S.plans;
  if (window.__VC_TEST__) window.__vcState = () => S;
  if (window.__VC_TEST__) window.__vcRender = () => render();

  const DEFAULT_TARGET_PTS = 20;
  // The position's bracket on one line, to scale: the stop on the left, the targets to the right, the entry and the price
  // now between them (in the trade's favour to the right, long or short). Labels that would collide are left out.
  function bracketHtml(h, sls, tps, price, tick) {
    if (!sls.length && !tps.length) return '<div class="hint">No stop or targets on this position.</div>';
    const dir = h.side === 'long' ? 1 : -1,
      x = (v) => dir * (v - h.openPrice);
    const marks = [
      ...sls.map((l) => ({ k: 'SL', v: l.price, cls: 'bad' })),
      { k: 'IN', v: h.openPrice, cls: '' },
      ...tps.map((l, i) => ({ k: 'TP' + (i + 1), v: l.price, cls: 'up' })),
    ];
    const xs = marks.map((m) => x(m.v)).concat(price > 0 ? [x(price)] : []);
    const lo = Math.min(...xs),
      span = Math.max(...xs) - lo || 1;
    const pos = (v) => Math.max(0, Math.min(100, ((x(v) - lo) / span) * 100));
    // the last digits are enough on a small bar: 31,162.50 → 162.50
    const short = (v) => {
      const t = fmtPx(v, tick),
        i = t.lastIndexOf(',');
      return i >= 0 ? t.slice(i + 1) : t;
    };
    const e = pos(h.openPrice),
      sl = sls.length ? pos(sls[0].price) : null,
      now = price > 0 ? pos(price) : null;
    let html = '<span class="bk-tr"></span>';
    if (sl !== null) html += `<span class="bk-r" style="left:${Math.min(sl, e)}%;width:${Math.abs(e - sl)}%"></span>`;
    if (now !== null)
      html += `<span class="bk-${now >= e ? 'g' : 'l'}" style="left:${Math.min(now, e)}%;width:${Math.abs(now - e)}%"></span>`;
    html += marks.map((m) => `<span class="bk-t ${m.cls}" style="left:${pos(m.v)}%"></span>`).join('');
    if (now !== null)
      html += `<span class="bk-now" style="left:${now}%" title="Price now ${fmtPx(price, tick)}"></span>`;
    let lastAt = -100;
    for (const m of [...marks].sort((a, b) => pos(a.v) - pos(b.v))) {
      const p = pos(m.v);
      if (p - lastAt < 13) continue;
      lastAt = p;
      const al = p < 8 ? ' l' : p > 92 ? ' r' : '';
      html += `<span class="bk-lb${al}" style="left:${p}%"><b class="${m.cls}">${m.k}</b>${esc(short(m.v))}</span>`;
    }
    return `<div class="bk">${html}</div>`;
  }
  function renderTargets(body) {
    const box = body.querySelector('#tr-targets');
    // ladder rows, farthest target on top (Buy prices rise up the right column, Sell prices fall down the left)
    box.innerHTML =
      S.trade.targets
        .map(
          (p, i) => `
      <div class="tr-lr tr-tgt"><span class="tr-sp" id="ls-t${i}"></span><span class="tr-mid"><span class="tr-n">TP${i + 1}</span>
        <input class="tr-in tr-pt" data-t="${i}" inputmode="decimal" aria-label="Target ${i + 1}, in points" value="${esc(p)}">
        <span class="tr-q" id="tq${i}"></span><span class="tr-g" id="tg${i}"></span>
        <button class="tr-x" data-del="${i}" title="Remove target ${i + 1}" aria-label="Remove target ${i + 1}">×</button></span><span class="tr-bp" id="lb-t${i}"></span></div>`,
        )
        .reverse()
        .join('') ||
      // every target removed: the trade goes in without one
      `<div class="tr-lr tr-tgt tr-notgt"><span class="tr-sp"></span><span class="tr-mid"><span class="tr-n">TP</span><span class="tr-none">None</span>
        <button class="lnk" data-addt title="Add a target">+ target</button></span><span class="tr-bp"></span></div>`;
    box.querySelectorAll('[data-t]').forEach((el) =>
      el.addEventListener('input', () => {
        const v = el.value.trim();
        S.trade.targets[+el.dataset.t] = v !== '' && Number.isFinite(+v) ? +v : '';
        saveTrade();
        updateTrade();
      }),
    );
    box.querySelectorAll('[data-del]').forEach(
      (b) =>
        (b.onclick = () => {
          S.trade.targets.splice(+b.dataset.del, 1);
          saveTrade();
          renderTargets(body);
          updateTrade();
        }),
    );
    const add = box.querySelector('[data-addt]');
    if (add) add.onclick = () => body.querySelector('#tr-add').click();
  }

  function updateTrade() {
    // test builds: window.__vcFailDraw = n makes the next n redraws during an order throw (a busy flag must still clear)
    if (window.__VC_TEST__ && S.placing && window.__vcFailDraw > 0) {
      window.__vcFailDraw--;
      throw new Error('test: the redraw failed');
    }
    const body = _root && _root.querySelector('.body');
    if (!body || body.dataset.view !== 'trade' || !body.querySelector('.trade')) return;
    const c = tradeCalc(),
      $ = (id) => body.querySelector('#' + id);
    const set = (id, v) => {
      const el = $(id);
      if (el && el.textContent !== v) el.textContent = v;
    };
    const symHtml = `${esc(c.meta.label)}${c.lev ? ` <span class="chip" title="Leverage on ${esc(c.t.symbol)}">${c.lev}x</span>` : ''}`;
    if ($('tr-sym').dataset.html !== symHtml) $('tr-sym').innerHTML = $('tr-sym').dataset.html = symHtml;
    $('tr-px').textContent = fmtPx(c.price, c.meta.tick);
    const pr = S.price[c.t.symbol] || {},
      fp = (n) => fmtPx(n, c.meta.tick);
    $('tr-px').title =
      [
        recentAt(pr.bookAt) && `Mid of the book (bid ${fp(pr.bid)} · ask ${fp(pr.ask)})`,
        recentAt(pr.lastAt) && `last trade ${fp(pr.last)}`,
        recentAt(pr.at) && `mark ${fp(pr.px)}`,
      ]
        .filter(Boolean)
        .join(' · ') || 'Waiting for a live price';
    body
      .querySelectorAll('[data-seg]')
      .forEach((g) =>
        g.querySelectorAll('button').forEach((b) => b.classList.toggle('on', S.trade[g.dataset.seg] === b.dataset.v)),
      );
    const riskBtn = body.querySelector('[data-seg="sizeMode"] [data-v="risk"]');
    riskBtn.classList.toggle('off', !c.stopOn);
    riskBtn.title = c.stopOn
      ? 'Size from dollars at risk at the stop'
      : 'Risk $ sizes from the stop: put a stop on first.';
    body.querySelector('[data-seg="sizeMode"] [data-v="pct"]').title =
      "A share of the most you can open (Vest's 100%): type 25 for a quarter";
    $('tr-size').style.display = c.t.sizeMode === 'max' ? 'none' : '';
    // minis and micros (NQ, ES, RTY): which unit the size is in
    const unit = tradeUnit(),
      hasUnits = !!MICRO_UNITS[c.t.symbol];
    $('tr-unitrow').hidden = !hasUnits || !!c.held;
    body.querySelectorAll('[data-seg="unit"] button').forEach((b) => b.classList.toggle('on', b.dataset.v === unit));
    set(
      'tr-unitnote',
      hasUnits && unit !== 'units'
        ? `1 ${unit} = ${unitSize()} units`
        : hasUnits
          ? `micro = ${MICRO_UNITS[c.t.symbol]} units`
          : '',
    );
    const uq = (q) => fmtUnits(q, c.t.symbol); // a size in the chosen unit, with its word
    const uqn = (q) => fmtUnits(q, c.t.symbol, false); // just the number
    const maxNote =
      c.maxQty === null
        ? ''
        : `Vest's 100% at ${c.lev}x${c.limitedBy && c.limitedBy !== S.master ? `, limited by ${accLabel(c.limitedBy)}` : ''}`;
    set(
      'tr-sizecalc',
      c.pick
        ? `Add uses ${c.pick.label} (${fmtQty(c.qty, c.t.symbol)}): click it again for this size`
        : c.t.sizeMode === 'max' && c.qty > 0
          ? `= ${unit === 'units' ? fmtQty(c.qty, c.t.symbol) + ' contracts' : uq(c.qty)} · ${maxNote}`
          : // Risk $ and %: the size they make, on its own line (next to the box it no longer fits)
            (c.t.sizeMode === 'risk' || c.t.sizeMode === 'pct') && c.qty > 0
            ? `= ${unit === 'units' ? fmtQty(c.qty, c.t.symbol) + ' contracts' : uq(c.qty)}${
                c.t.sizeMode === 'pct' && c.maxQty > 0 ? ` · ${+c.t.pct}% of ${fmtQty(c.maxQty, c.t.symbol)}` : ''
              }`
            : '',
    );
    set('tr-sizeq', '');
    $('tr-stopcalc').textContent = c.stopOn && c.qty > 0 && +c.t.stopPts > 0 ? `−${fmtUsd(c.risk)}` : '';
    $('tr-slrow').classList.toggle('off', !c.stopOn);
    // The allowed range, live: how much can be risked and where the stop may go on this account right now
    const L = c.limits,
      stopNow = +c.t.stopPts || 0,
      room = L.maxRiskRoom !== null ? ` · ${money(L.maxRiskRoom)} max before the floor` : '';
    let sizeLim = '',
      stopLim = '',
      stopBad = false;
    if (c.t.sizeMode === 'risk') {
      if (L.maxRiskAtStop !== null && stopNow > 0)
        sizeLim = `Can risk up to ${money(L.maxRiskAtStop)} at ${stopNow} pts${room}`;
      if (L.minStop !== null && +c.t.risk > 0) {
        stopBad = stopNow > 0 && stopNow < L.minStop;
        stopLim = `Stop must be at least ${L.minStop} pts to risk ${money(+c.t.risk)}`;
      }
    } else if (c.maxQty !== null && c.t.sizeMode === 'qty') {
      sizeLim = `Up to ${fmtQty(c.maxQty, c.t.symbol)} contracts at ${c.lev}x${room}`;
    } else if (c.maxQty !== null && c.t.sizeMode === 'pct') {
      sizeLim = `${+c.t.pct || 0}% of ${fmtQty(c.maxQty, c.t.symbol)} contracts, the most at ${c.lev}x`;
    }
    if (c.t.sizeMode !== 'risk' && L.maxStop !== null && c.qty > 0) {
      stopBad = stopNow >= L.maxStop;
      stopLim = `Stop must be under ${L.maxStop} pts at ${fmtQty(c.qty, c.t.symbol)} contracts, or the account fails first`;
    }
    set('tr-sizelim', sizeLim);
    set('tr-stoplim', stopLim);
    $('tr-stoplim').classList.toggle('bad', stopBad);
    // these lines only show when the limit bites, or nearly does (within 20%)
    const NEAR = 0.8;
    const sizeNear =
      !!c.blocked ||
      (c.t.sizeMode === 'risk'
        ? (L.maxRiskAtStop !== null && +c.t.risk > L.maxRiskAtStop * NEAR) ||
          (L.maxRiskRoom !== null && +c.t.risk > L.maxRiskRoom * NEAR)
        : c.t.sizeMode === 'qty' && c.maxQty !== null && c.qty > c.maxQty * NEAR);
    const stopNear =
      stopBad ||
      (c.t.sizeMode === 'risk'
        ? L.minStop !== null && stopNow < L.minStop / NEAR
        : L.maxStop !== null && stopNow > L.maxStop * NEAR);
    $('tr-sizelim').classList.toggle('quiet', !sizeNear);
    $('tr-stoplim').classList.toggle('quiet', !stopNear);
    c.t.targets.forEach((p, i) => {
      const q = c.qtys[i],
        qe = $('tq' + i),
        ge = $('tg' + i);
      if (qe) qe.textContent = q ? uqn(q) : '—';
      if (ge) ge.textContent = q ? '+' + fmtUsd(q * (+p || 0) * c.meta.pointValue) : '';
    });
    $('tr-betrigw').style.display = c.t.beMode === 'points' ? '' : 'none';
    body.querySelector('.tr-be').style.display = c.t.beMode === 'off' ? 'none' : '';
    // the folded lines: how the targets split, and when the stop moves to breakeven
    set(
      'tr-splittxt',
      !c.t.targets.length
        ? 'No targets'
        : `Split ${c.t.scale === 'start' ? 'front-loaded' : c.t.scale === 'end' ? 'back-loaded' : 'even'}${
            c.qtys.length > 1 ? ' · ' + c.qtys.map(uqn).join(' / ') : ''
          }`,
    );
    set(
      'tr-betxt',
      !c.stopOn
        ? 'Auto breakeven needs a stop'
        : c.t.beMode === 'off'
          ? 'Auto breakeven off'
          : c.t.beMode === 'tp1' && !c.t.targets.length
            ? 'Auto breakeven after TP1: add a target'
            : `Breakeven ${c.t.beMode === 'tp1' ? 'after TP1' : `at +${c.t.beTrigger || 0} pts`}${+c.t.beOffset > 0 ? `, locks ${c.t.beOffset} pts` : ''}`,
    );
    // in a trade the setup (size, stop, targets, Auto BE for a new trade) is put away: Scale and the trade's own
    // stop and targets apply
    const held = !!c.held;
    $('tr-setup').hidden = held;
    $('tr-lims').hidden = held;
    $('tr-pacts').hidden = !held;
    $('tr-sum').innerHTML =
      c.qty > 0 && (c.qtys.length || !c.stopOn)
        ? `${c.held ? 'This add · ' : ''}${c.stopOn ? `Risk <b>${fmtUsd(c.risk)}</b>` : '<b>No stop</b>'}${c.fees > 0 ? ` + ${fmtUsd(c.fees)} fees` : ''}${
            c.qtys.length ? ` · Reward <b>${fmtUsd(c.reward)}</b>` : ' · no targets'
          }${c.stopOn && c.qtys.length ? ` · <b>${c.risk > 0 ? (c.reward / c.risk).toFixed(2) : '—'}R</b>` : ''}`
        : '';
    set(
      'tr-lhm',
      !c.held && c.qty > 0 && c.qtys.length && c.risk > 0
        ? `risk ${fmtUsd(c.risk)} · ${(c.reward / c.risk).toFixed(2)}R`
        : !c.held && !c.stopOn
          ? 'no stop'
          : 'pts · qty · $',
    );
    $('tr-lhm').title = $('tr-sum').textContent;
    const fixHtml = c.fixes
      .map(
        (f, i) =>
          `<button class="tr-usemax" data-fix="${i}" data-act="${f.act === 'max' ? 'usemax' : 'fix-' + f.act}">${esc(f.label)}</button>`,
      )
      .join(' ');
    // In a trade, warnings and errors about the next add go on the status line under the add buttons instead (below).
    const warnHtml = c.held
      ? ''
      : (c.blocked
          ? `<div class="tr-block">${esc(c.blocked)}${fixHtml ? `<div class="tr-fixes">${fixHtml}</div>` : ''}</div>`
          : '') + c.warnings.map((w) => `<div>${esc(w.text)}</div>`).join('');
    const warnBox = $('tr-warn');
    if (warnBox.dataset.html !== warnHtml) {
      // rewrite only on change, so a click on a fix isn't lost to a price tick
      warnBox.dataset.html = warnHtml;
      warnBox.innerHTML = warnHtml;
      warnBox.querySelectorAll('[data-fix]').forEach((b) => {
        const f = c.fixes[+b.dataset.fix];
        b.onclick = () => {
          if (f.act === 'max') S.trade.sizeMode = 'max';
          else if (f.act === 'stop') {
            S.trade.stopPts = f.value;
            $('tr-stop').value = f.value;
          } else if (f.act === 'risk') {
            S.trade.risk = f.value;
            $('tr-size').value = f.value;
          }
          saveTrade();
          updateTrade();
        };
      });
    }
    $('tr-err').textContent = c.held
      ? ''
      : c.error ||
        (c.blocked ? 'Over what the account can open: use a fix above, or change the size or stop.' : '') ||
        (S.adjusting ? 'Adjusting stop & targets…' : '');
    const q = c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '';
    const h = c.held,
      busy = !!S.placing || !!S.adjusting || !!S.flattening || !!S.arming || !!S.exiting,
      exitBusy = !!exitBlocks(); // getting out isn't held back by an order or a re-anchor in flight
    const nf = S.armed ? S.followers.size : 0;
    $('tr-who').hidden = !!c.held; // in a trade, the position card says it
    $('tr-who').textContent = S.master
      ? `On ${accLabel(S.master)}${nf ? ` · copies to ${nf} follower${nf > 1 ? 's' : ''}` : ' · not copied (copying is off)'}`
      : '';
    const lim = !h && c.t.orderType === 'limit' ? ' limit' : !h && c.t.orderType === 'stop' ? ' stop' : '',
      qw = c.qty > 0 ? (unit === 'units' ? q : uq(c.qty)) : '';
    $('tr-buy').textContent = h && h.side === 'long' ? `Add ${qw}` : `Buy${lim} ${qw}`.trim();
    $('tr-sell').textContent = h && h.side === 'short' ? `Add ${qw}` : `Sell${lim} ${qw}`.trim();
    $('tr-buy').hidden = !!h && h.side !== 'long';
    $('tr-sell').hidden = !!h && h.side !== 'short';
    $('tr-buy').disabled = $('tr-sell').disabled = !!c.error || !!c.blocked || busy;
    $('tr-pos').hidden = !h;
    // limits: a new trade only, so the limit row shows when flat; while picking, the pick replaces both rows
    if (h && S.pick) stopPick(true);
    if (!h && S.legPick) stopLegPick();
    const pk = S.pick;
    $('tr-mgo').hidden = !!pk || !!h; // in a trade, ADD and REDUCE sit under the Scale chips
    $('tr-lgo').hidden = true; // Limit is the Order switch now; these stay for the chart pick's own code
    $('tr-lbuy').disabled = $('tr-lsell').disabled = !!c.error || !!c.blocked || busy;
    $('tr-pick').hidden = !pk;
    // Slip (stop orders): the most past the level a fill may be; blank = a market order
    $('tr-sliprow').hidden = c.t.orderType !== 'stop' || !!h;
    // the chart bracket's switch, with every order type (Limit and Stop draw it while picking a price: with it off they
    // drew nothing and the switch to turn it back on was only under Market, owner 2026-10-13)
    const lines = $('tr-lines');
    lines.hidden = false;
    lines.classList.toggle('on', !!S.chartBracket);
    lines.setAttribute('aria-checked', String(!!S.chartBracket));
    if (c.t.orderType === 'stop') {
      const slip = +c.t.slipPts > 0 ? +c.t.slipPts : 0;
      set('tr-sliptxt', slip ? `pts · within ${slip} or not at all` : 'pts · blank = market');
    }
    if (pk) {
      // a buy limit goes below the price and a sell limit above; stop entries the other way round
      const lp = pk.price,
        stp = pk.kind === 'stop',
        above = (pk.side === 'long') === stp,
        wrongSide = lp > 0 && c.price > 0 && (above ? lp <= c.price : lp >= c.price),
        buy = pk.side === 'long',
        tag = `${buy ? 'Buy' : 'Sell'} ${stp ? 'STP' : 'LMT'}`;
      set(
        'tr-picktxt',
        wrongSide
          ? `A ${buy ? 'buy' : 'sell'} ${stp ? 'stop' : 'limit'} goes ${above ? 'above' : 'below'} the price`
          : pk.chart
            ? "Click Vest's chart to place it, or type the price"
            : `Type the ${stp ? 'stop' : 'limit'} price`,
      );
      $('tr-picktxt').className = wrongSide ? 'bad' : '';
      $('tr-place').textContent = lp > 0 ? `Place ${tag} @ ${fmtPx(lp, c.meta.tick)}` : `Place ${tag}`;
      $('tr-place').title = lp > 0 ? `${tag} ${q} @ ${fmtPx(lp, c.meta.tick)}` : '';
      $('tr-place').className = 'tr-place ' + pk.side;
      $('tr-place').disabled = !(lp > 0) || wrongSide || !!c.error || !!c.blocked || busy;
      drawPickLine(c.qty);
    }
    if (h) {
      const tick = c.meta.tick,
        dir = h.side === 'long' ? 1 : -1;
      const pnl = c.price > 0 ? dir * h.qty * (c.price - h.openPrice) * c.meta.pointValue : null;
      const entry = [...Object.values(S.posMap)].find((e) => e.symbol === h.symbol && e.master === S.master);
      const accts = S.armed && entry ? 1 + Object.keys(entry.followers || {}).length : 1;
      set('tr-pside', h.side === 'long' ? 'Long' : 'Short');
      $('tr-pside').className = 'tr-side ' + h.side;
      set('tr-pqty', `${fmtQty(h.qty, h.symbol)} ${c.meta.label}${unit !== 'units' ? ` · ${uq(h.qty)}` : ''}`);
      set(
        'tr-pavg',
        `avg ${fmtPx(h.openPrice, tick)} · ${accts} account${accts === 1 ? '' : 's'}${
          accts > 1 && pnl !== null && !S.capFit ? ` · ${pnl >= 0 ? '+' : '−'}${fmtUsd(pnl * accts)} total` : ''
        }`,
      );
      const ptsNow = c.price > 0 ? dir * (c.price - h.openPrice) : null;
      set(
        'tr-ppts',
        ptsNow === null ? '' : `${ptsNow >= 0 ? '+' : '−'}${fmtNum(Math.abs(ptsNow), decimalsOf(tick))} pts`,
      );
      // where the stop and targets sit on Vest now (the stop with what it makes or loses from the average)
      const legs = (h.triggers || []).slice().sort((a, b) => dir * (a.price - b.price));
      const sls = legs.filter((l) => l.kind === 'sl'),
        tps = legs.filter((l) => l.kind === 'tp');
      // + Add stop (only without one, amber: nothing closes the trade on a loss) and + Add target
      const legBusy = !!(S.placing || S.adjusting || S.flattening);
      for (const [b, k] of [
        [$('tr-addsl'), 'sl'],
        [$('tr-addtp'), 'tp'],
      ]) {
        const on = !!S.legPick && S.legPick.kind === k,
          txt = on ? 'Click the chart…' : k === 'sl' ? '+ Add stop' : '+ Add target';
        if (b.textContent !== txt) b.textContent = txt;
        b.classList.toggle('on', on);
        b.disabled = legBusy || (k === 'tp' && tps.length >= MAX_TRADE_TARGETS);
      }
      $('tr-addsl').hidden = sls.length > 0;
      $('tr-addsl').classList.toggle('warn', !sls.length && !(S.legPick && S.legPick.kind === 'sl'));
      const lvHtml =
        sls
          .map((l) => {
            const v = dir * (l.price - h.openPrice) * h.qty * c.meta.pointValue;
            return `<span class="tr-lv sl">SL <b>${fmtPx(l.price, tick)}</b><i>${v >= 0 ? '+' : '−'}${fmtUsd(v)}</i></span>`;
          })
          .join('') +
          tps.map((l, i) => `<span class="tr-lv tp">TP${i + 1} <b>${fmtPx(l.price, tick)}</b></span>`).join('') ||
        '<span class="tr-lv none">No stop or targets on this position</span>';
      const lvBox = $('tr-lvls');
      if (lvBox.dataset.html !== lvHtml) lvBox.innerHTML = lvBox.dataset.html = lvHtml;
      // The bracket, drawn to scale: stop on the left, targets to the right, the entry and the price now between
      const brk = $('tr-brk'),
        brkHtml = bracketHtml(h, sls, tps, c.price, tick);
      if (brk.dataset.html !== brkHtml) brk.innerHTML = brk.dataset.html = brkHtml;
      const K2 = c.risk2,
        usd2 = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
      const frac = K2.room > 0 && K2.now !== null ? K2.now / K2.room : 0;
      $('tr-prnow').style.width = Math.max(0, Math.min(100, frac * 100)).toFixed(1) + '%';
      $('tr-prnow').className = frac >= 1 ? 'hot' : frac >= 0.8 ? 'warn' : '';
      $('tr-prisk').innerHTML =
        K2.now === null
          ? '<span class="warn">no stop on this position</span>'
          : K2.room > 0
            ? `<b>${usd2(K2.now)}</b> of ${usd2(K2.room)} · <span class="${frac >= 0.8 ? 'warn' : 'ok'}">${usd2(K2.room - K2.now)} left</span>`
            : '';
      set('tr-ppl', pnl === null ? '' : (pnl >= 0 ? '+' : '−') + fmtUsd(pnl));
      $('tr-ppl').className = 'tr-ppl ' + (pnl === null ? '' : pnl >= 0 ? 'pos' : 'neg');
      const be = breakevenPlan(h, c.price, tick);
      $('tr-be').textContent = be.price > 0 ? `Breakeven ${fmtPx(be.price, tick)}` : 'Breakeven';
      $('tr-be').disabled = busy || !!be.why;
      $('tr-be').title = be.why || `Move the stop to ${fmtPx(be.price, tick)}, your average entry`;
      $('tr-close').textContent = `Close ${fmtQty(h.qty, h.symbol)}`;
      $('tr-close').disabled = exitBusy;
      // Scale chips: a share of the position (or MAX, adds only) that sizes both ADD and REDUCE; one is always picked
      const key = (c.pick && c.pick.key) || '25',
        step = c.meta.step;
      const redQ = key === '100' ? h.qty : key === 'max' ? 0 : floorStep(h.qty * (key === '50' ? 0.5 : 0.25), step);
      const chipsHtml = (c.chips || [])
        .map((x) => {
          const off = x.key === 'max' ? 'adds only' : `reduce ${fmtQty(x.key === '100' ? h.qty : x.qty, h.symbol)}`;
          const tip = `${x.label === 'MAX' ? 'MAX' : x.label + '%'}: add ${fmtQty(x.qty, h.symbol)}${x.why ? ` (${x.why})` : ''} · ${off}`;
          return `<button class="tr-chip${key === x.key ? ' on' : ''}${x.why ? ' no' : ''}" data-add="${x.key}" ${busy ? 'disabled' : ''}
              title="${esc(tip)}"><b>${x.label}</b><span>${esc(x.why || fmtQty(x.qty, h.symbol))}</span></button>`;
        })
        .join('');
      const box = $('tr-chips');
      if (box.dataset.html !== chipsHtml) {
        box.dataset.html = chipsHtml;
        box.innerHTML = chipsHtml;
        box.querySelectorAll('[data-add]').forEach(
          (b) =>
            (b.onclick = () => {
              S.addPick = b.dataset.add;
              updateTrade();
            }),
        );
      }
      const addBtn = $('tr-addbtn'),
        redBtn = $('tr-reduce');
      addBtn.className = h.side === 'long' ? 'tr-buy' : 'tr-sell';
      addBtn.textContent = c.qty > 0 ? `Add ${fmtQty(c.qty, h.symbol)}` : 'Add';
      addBtn.disabled = busy || !!c.error || !!c.blocked || !(c.qty > 0);
      addBtn.title =
        c.pick && c.pick.why
          ? `Add: ${c.pick.why}`
          : `Add ${fmtQty(c.qty, h.symbol)} to the ${h.side}${S.armed ? ' (the copier adds to each follower, scaled)' : ''}. The stop stays where it is; sized targets are re-split to the new size.`;
      redBtn.textContent = key === '100' ? 'Reduce all' : redQ > 0 ? `Reduce ${fmtQty(redQ, h.symbol)}` : 'Reduce';
      redBtn.disabled = exitBusy || key === 'max' || !(redQ > 0);
      redBtn.title =
        key === 'max'
          ? 'MAX is for adds: pick 25, 50 or 100 to reduce'
          : key === '100'
            ? `Close the whole ${fmtQty(h.qty, h.symbol)}${S.armed ? ' (the copier closes the followers)' : ''}`
            : `Take ${fmtQty(redQ, h.symbol)} off at market${S.armed ? ' (the copier reduces each follower by the same share)' : ''}. The stop and targets stay where they are.`;
      $('tr-addbox').hidden = !S.addOpen;
      $('tr-addfold').setAttribute('aria-expanded', String(!!S.addOpen));
      $('tr-addfold').classList.toggle('open', !!S.addOpen);
      set(
        'tr-copies',
        S.armed && S.followers.size
          ? `Every change copies to ${S.followers.size} follower${S.followers.size === 1 ? '' : 's'}`
          : '',
      );
      const addQ = c.qty > 0 ? c.qty : 0,
        tot = h.qty + addQ;
      const avgA = tot > 0 ? (h.qty * h.openPrice + addQ * c.price) / tot : 0;
      const o = c.sides[h.side];
      // One status line under the add buttons that is always there and never wraps, so nothing moves as the open P&L
      // swings a warning on and off: what the add would do, or the most important reason it can't or shouldn't go
      // (the full sentence is the tooltip).
      const addTxt = fmtQty(addQ, h.symbol);
      let pvHtml = '',
        pvTitle = '';
      if (c.error) [pvHtml, pvTitle] = [`<span class="warn">${esc(c.error)}</span>`, c.error];
      else if (c.blocked) {
        const max = fmtQty(c.maxQty, c.t.symbol);
        pvHtml = `<span class="hot">Add ${esc(addTxt)}: over ${esc(accLabel(c.limitedBy))}'s max (${esc(max)})</span>`;
        pvTitle = `Add ${addTxt}: more than ${accLabel(c.limitedBy)} can open (max ${max}). Pick a smaller add.`;
      } else if (c.warnings.length && o && o.loss > 0) {
        pvHtml = `<span class="warn">Add ${esc(addTxt)}: stop-out ${fmtUsd(o.loss)}, ${fmtUsd(o.room)} left</span>`;
        pvTitle = `Add ${addTxt}: a stop-out after it would lose about ${fmtUsd(o.loss)} with fees, more than the ${fmtUsd(o.room)} left to the floor.`;
      } else if (addQ > 0 && c.price > 0) {
        pvHtml = `<span>→ <b>${fmtQty(tot, h.symbol)}</b> · avg <b>${fmtPx(avgA, tick)}</b></span>${o && o.loss > 0 ? `<span>stop-out <b>${fmtUsd(o.loss)}</b></span>` : ''}`;
        pvTitle =
          'After this add: the new size and average, and what a stop-out would then cost. The stop stays where it is; sized targets are re-split to the new size.';
      }
      if ($('tr-addpv').dataset.html !== pvHtml) $('tr-addpv').innerHTML = $('tr-addpv').dataset.html = pvHtml;
      $('tr-addpv').title = pvTitle;
    } else if (S.addPick) S.addPick = null; // flat again: chips reset
    // The ladder: Buy prices on the right, Sell prices on the left, from the live mark (re-placed from the fill).
    const ok = !c.error && c.price > 0;
    const px = (n) => (ok && n > 0 ? fmtPx(roundTick(n, c.meta.tick), c.meta.tick) : '—');
    const h2 = c.held,
      lad = body.querySelector('.tr-lad');
    const pk2 = !h2 && S.pick && S.pick.price > 0 ? S.pick : null;
    lad.classList.toggle('one', !!h2 || !!pk2);
    // one side at a time: the side of the Buy or Sell button you're pointing at (else the side last traded)
    const lside = S.ladSide || 'long';
    lad.classList.toggle('side-long', lside === 'long');
    lad.classList.toggle('side-short', lside === 'short');
    $('tr-lhs').hidden = !!(h2 || pk2);
    set('tr-lhs', lside === 'long' ? 'If you buy' : 'If you sell');
    $('tr-lhs').className = 'tr-flip ' + lside;
    set(
      'tr-lhb',
      h2 ? 'Price' : pk2 ? `${pk2.side === 'long' ? 'Buy' : 'Sell'} ${pk2.kind === 'stop' ? 'stop' : 'at'}` : 'Price',
    );
    $('tr-mkrow').hidden = !(h2 || pk2) || !ok;
    if (pk2) {
      // a limit: its stop and targets measured from the limit price (it fills there or better)
      const lv = planPrices({
        side: pk2.side,
        entry: pk2.price,
        stopPts: c.stopOn ? +c.t.stopPts : null,
        targetPts: c.t.targets.map(Number),
        tick: c.meta.tick,
      });
      c.t.targets.forEach((_, i) => set('lb-t' + i, px(lv.targets && lv.targets[i])));
      set('lb-stop', px(lv.stop));
      set('lb-entry', px(pk2.price));
      const kind = pk2.kind === 'stop' ? 'Stop entry' : 'Limit';
      set('tr-entry', c.qty > 0 ? `${kind} · ${fmtQty(c.qty, c.t.symbol)}` : kind);
      set('tr-stopq', c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '');
      const away = Math.abs(c.price - pk2.price);
      set('tr-mk', `Price · ${fmtNum(away, decimalsOf(c.meta.tick))} pts away`);
      set('lb-mk', px(c.price));
      $('tr-failrow').hidden = $('tr-passrow').hidden = true; // measured from the mark: not for a resting limit
    } else if (h2) {
      // in a trade the ladder (part of the setup for a new trade) is put away: the trade keeps its own stop and targets
    } else {
      c.t.targets.forEach((_, i) => {
        set('lb-t' + i, px(c.long.targets && c.long.targets[i]));
        set('ls-t' + i, px(c.short.targets && c.short.targets[i]));
      });
      set('lb-stop', px(c.long.stop));
      set('ls-stop', px(c.short.stop));
      set('lb-entry', px(c.price));
      set('ls-entry', px(c.price));
      set('tr-entry', c.qty > 0 ? `Entry · ${fmtQty(c.qty, c.t.symbol)}` : 'Entry');
      set('tr-stopq', c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '');
      const sl = c.sides.long,
        ss = c.sides.short;
      set('lb-fail', px(sl && sl.fail));
      set('ls-fail', px(ss && ss.fail));
      set('lb-pass', px(sl && sl.pass));
      set('ls-pass', px(ss && ss.pass));
      $('tr-failrow').hidden = !ok || !((sl && sl.fail) || (ss && ss.fail));
      $('tr-passrow').hidden = !ok || !((sl && sl.pass) || (ss && ss.pass));
    }
    const note =
      "Prices are from the market now (the mid of Vest's order book); stop and targets are re-placed your exact points from your fill. Adding to an " +
      'open trade rebuilds them from the new average.' +
      (!$('tr-failrow').hidden
        ? " Fail and pass: where your equity reaches the floor or the target, opening fee counted. Estimates, like Vest's own."
        : '');
    set('tr-preview', note);
    body.querySelector('.tr-lad').title = note;
    _lastCalc = c;
    drawBracketLines(bracketWant(c, previewPick(c)));

    // Margin and risk bars
    const pct100 = (f) => Math.max(0, Math.min(100, f * 100)).toFixed(1) + '%';
    const M = c.margin,
      K = c.risk2,
      mnow = $('tr-mnow'),
      mpv = $('tr-mpv'),
      rnow = $('tr-rnow'),
      rpv = $('tr-rpv');
    const heat = (f) => (f >= 1 ? ' hot' : f >= 0.8 ? ' warn' : '');
    if (M) {
      mnow.style.width = pct100(M.now);
      mpv.style.width = pct100(M.after);
      mpv.className = 'pv' + heat(M.after);
      mnow.className = heat(M.now).trim();
      const used = (f) => Math.round(f * 100) + '%';
      // contracts left, to sensible precision (25.5, 3.75, 0.43)
      const short = (n) =>
        String(+(Math.floor(n * (n >= 100 ? 1 : n >= 10 ? 10 : 100)) / (n >= 100 ? 1 : n >= 10 ? 10 : 100)));
      $('tr-mtxt').innerHTML =
        M.left >= 0
          ? `<b>${used(c.qty > 0 ? M.after : M.now)}</b> · ${short(M.left)} left`
          : `<span class="hot">over by ${esc(fmtQty(-M.left, c.t.symbol))}</span>`;
      $('tr-mtxt').title = c.qty > 0 ? `${used(M.now)} used now, ${used(M.after)} with this order` : '';
    } else {
      mnow.style.width = mpv.style.width = '0%';
      $('tr-mtxt').innerHTML = `<span>${S.master ? 'working out…' : 'pick a master (M)'}</span>`;
    }
    if (K.room > 0) {
      const after = K.after === null ? K.now : K.after;
      rnow.style.width = K.now === null ? '0%' : pct100(K.now / K.room);
      rpv.style.width = after === null ? '0%' : pct100(after / K.room);
      rpv.className = 'pv' + heat(after === null ? 0 : after / K.room);
      rnow.className = heat(K.now === null ? 0 : K.now / K.room).trim();
      const left = after === null ? null : K.room - after;
      const usd = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
      $('tr-rtxt').innerHTML =
        K.now === null || (!c.held && !c.stopOn)
          ? '<span class="warn">no stop</span>'
          : left !== null && left <= 0
            ? `<b>${usd(after)}</b> · <span class="hot">past the floor</span>`
            : `<b class="${heat(after / K.room).trim()}">${usd(after || 0)}</b> of ${usd(K.room)}`;
      $('tr-rtxt').title = left !== null && left > 0 ? `${usd(left)} left before the floor after this order` : '';
    } else {
      rnow.style.width = rpv.style.width = '0%';
      $('tr-rtxt').innerHTML = `<span>${S.master ? 'working out…' : ''}</span>`;
    }
    const by = [
      M && c.limitedBy && `margin: ${accLabel(c.limitedBy)}`,
      K.room > 0 && K.by && `risk: ${accLabel(K.by)}`,
    ].filter(Boolean);
    const tight =
      by.length === 2 && c.limitedBy === K.by
        ? `tightest: ${accLabel(K.by)}`
        : by.length
          ? 'tightest · ' + by.join(' · ')
          : '';
    set('tr-tight', tight);
    $('tr-lims').title =
      "Margin: how much of Vest's buying power (its 100%) this order uses, and what's left. Risk: what the stop would lose, " +
      'fees included, against the room left before the floor.' +
      (tight ? ` (${tight})` : '');
    // Waiting orders: the master's resting limits on Vest (from any ticket) and the stop entries this tab keeps
    const mst = S.master && S.acctState[S.master],
      limits = ((mst && mst.orders) || []).filter((o) => o.symbol === c.t.symbol);
    const limitRows = limits.map(
      (o) =>
        `<div class="tr-plan"><span><b>${o.isBuy ? 'Buy' : 'Sell'} limit</b> ${esc(symLabel(o.symbol))} @ ${fmtPx(o.price, tickOf(o.symbol))} · ${esc(fmtQty(o.qty, o.symbol))}</span><button class="tr-x" data-unlimit="${esc(o.id)}" title="Cancel this limit on Vest${S.armed ? ' (and the followers’ copies)' : ''}" aria-label="Cancel this limit">×</button></div>`,
    );
    const stopRows = S.stopEntries.map((e) => {
      const tick = tickOf(e.symbol),
        pair = S.stopEntries.some((x) => x !== e && x.symbol === e.symbol);
      const what = `<b>${e.side === 'long' ? 'Buy' : 'Sell'} stop</b> ${esc(symLabel(e.symbol))} @ ${fmtPx(e.level, tick)} · ${esc(fmtQty(e.qty, e.symbol))}${
        e.slip ? ` · slip ${e.slip} pts` : ''
      }${pair ? ' · OCO' : ''}${e.triggered ? ' · sending…' : ''}`;
      return `<div class="tr-plan" title="Kept by the copier: fires while this tab is open"><span>${what}</span><button class="tr-x" data-unstop="${esc(e.id)}" title="Cancel" aria-label="Cancel this stop entry">×</button></div>`;
    });
    const stopsHtml =
      limitRows.length || stopRows.length
        ? `<div class="tr-lbl">Waiting orders${stopRows.length ? ' · stops fire while this tab is open' : ''}</div>` +
          [...limitRows, ...stopRows].join('')
        : '';
    const sbox = $('tr-stops');
    if (sbox.dataset.html !== stopsHtml) {
      sbox.dataset.html = stopsHtml;
      sbox.innerHTML = stopsHtml;
      sbox.querySelectorAll('[data-unstop]').forEach(
        (b) =>
          (b.onclick = () => {
            const e = S.stopEntries.find((x) => x.id === b.dataset.unstop);
            if (e) cancelStopEntry(e, `${stopName(e)} cancelled (you cancelled it).`);
          }),
      );
      sbox.querySelectorAll('[data-unlimit]').forEach((b) => (b.onclick = () => cancelLimitOrder(b.dataset.unlimit)));
    }
    const plans = Object.values(S.plans);
    const plansHtml = plans.length
      ? `<div class="tr-lbl">Breakeven watch</div>` +
        plans
          .map((p) => {
            const tick = (SYMBOLS[p.symbol] || c.meta).tick;
            const when = p.beMode === 'tp1' ? `after TP1 (${fmtPx(p.tp1, tick)})` : `at +${p.beTrigger} pts`;
            const state = !(p.entry > 0)
              ? 'waiting for fill…'
              : p.triggered
                ? 'moving stop…'
                : `stop → ${fmtPx(breakevenPrice({ side: p.side, entry: p.entry, offsetPts: p.beOffset, tick }), tick)} ${when}`;
            const what = `<b>${p.side === 'long' ? 'Long' : 'Short'}</b> ${esc(symLabel(p.symbol))}${p.entry > 0 ? ' @ ' + fmtPx(p.entry, tick) : ''} · ${esc(state)}`;
            return `<div class="tr-plan"><span>${what}</span><button class="tr-x" data-unplan="${esc(p.positionId)}" title="Stop watching" aria-label="Stop watching">×</button></div>`;
          })
          .join('')
      : '';
    const box = $('tr-plans');
    if (box.dataset.html !== plansHtml) {
      // rewrite only on change, so a click on × isn't lost to a tick
      box.dataset.html = plansHtml;
      box.innerHTML = plansHtml;
      box.querySelectorAll('[data-unplan]').forEach(
        (b) =>
          (b.onclick = () => {
            const p = S.plans[b.dataset.unplan];
            if (p) endPlan(p, 'Breakeven: stopped watching (you cancelled it).');
          }),
      );
    }
  }

  // Settings and Appearance: every option with one line under its name; the ? opens the full explanation in place.
  const optionHtml =
    (open) =>
    (key, on, name, short, long, dim = false) => `
        <div class="opt ${dim ? 'dep-off' : ''} ${open.has(key) ? 'open' : ''}" data-o="${key}">
          <div class="opt-txt"><div class="opt-name">${name}${long ? `<button class="qm" data-q="${key}" aria-label="More about ${name}" title="More about this">?</button>` : ''}</div>
            <div class="opt-short">${short}</div>${long ? `<div class="opt-desc">${long}</div>` : ''}</div>
          <button class="switch ${on ? 'on' : ''}" data-opt="${key}" role="switch" aria-checked="${on}" aria-label="${name}"><span class="knob"></span></button>
        </div>`;
  const openOpts = (body) => new Set([...body.querySelectorAll('.opt.open[data-o]')].map((e) => e.dataset.o));
  function wireOptions(body) {
    body.querySelectorAll('[data-q]').forEach((b) => (b.onclick = () => b.closest('.opt').classList.toggle('open')));
    body.querySelectorAll('[data-opt]').forEach((b) => (b.onclick = () => toggleOption(b.getAttribute('data-opt'))));
    body.querySelectorAll('[data-tab-go]').forEach((b) => (b.onclick = () => setView(b.dataset.tabGo)));
  }
  function toggleOption(o) {
    if (o === 'fast') toggleFast();
    else if (o === 'autoflat') toggleAutoFlatten();
    else if (o === 'capfit') toggleCapFit();
    else if (o === 'supportapply') {
      setSupportChoice(supportOn() ? 'no' : 'yes');
      render();
    } else if (o === 'updates') {
      S.checkUpdates = !S.checkUpdates;
      saveOpts();
      render();
    } else if (o === 'tradeonly') {
      S.tradeOnly = !S.tradeOnly;
      saveOpts();
      showOnThisPage();
      render();
    } else if (o === 'hidesessions') {
      S.hideSessions = !S.hideSessions;
      saveOpts();
      render();
    } else if (o === 'theme') {
      S.theme = !S.theme;
      saveOpts();
      applyTheme();
      render();
    } else if (o === 'hidemarks') {
      S.hideMarks = !S.hideMarks;
      saveOpts();
      _marksDone = null; // switched on: hide them now
      render();
    } else if (o === 'bracket') {
      S.chartBracket = !S.chartBracket;
      saveOpts();
      if (!S.chartBracket) clearBracketLines();
      render();
    }
  }
  function renderSettings(body) {
    const option = optionHtml(openOpts(body));
    body.innerHTML = `
      <div class="settings">
        <div class="set-h">Copying</div>
        ${option(
          'fast',
          S.fast,
          'Fast mode',
          'Followers copy each order as soon as the master sends it.',
          "Copy every market order the instant the master sends it (entries, closes, reduces, adds, stops and targets), for the most simultaneous fills. Followers act before Vest has confirmed the master's order. Limit orders and cancels are copied once Vest answers.",
        )}
        ${option(
          'autoflat',
          S.autoFlatten,
          'Auto-flatten orphans',
          "Close followers left in a trade the master isn't in.",
          "If followers end up in a trade the master isn't in (its entry was refused or didn't fill, or Vest closed the master), close them automatically instead of asking. Never used when the master might be in the trade.",
        )}
        ${option(
          'capfit',
          S.capFit,
          'Cap-to-fit size',
          'Size each follower to its own equity, not 1:1.',
          'Every account takes the same % risk with the same stop distance, and <b>different-size followers</b> are allowed (e.g. a 25k master with 5k accounts). Off: strict 1:1, same-size accounts only.',
        )}
        <div class="set-h">Panel</div>
        ${option(
          'tradeonly',
          S.tradeOnly,
          'Only on the Trade page',
          'Hidden elsewhere; it keeps copying.',
          "Hide the panel on Vest's other pages (Portfolio, Markets, Affiliate…). It keeps running and copying there, and shows on any page when something needs you.",
        )}
        <div class="set-row"><button class="ghostbtn" data-tab-go="appearance">${ICON.look} Theme, chart and text size</button></div>
        <div class="set-h">Updates</div>
        ${option(
          'updates',
          S.checkUpdates,
          'Check for updates',
          `You have v${VERSION} · checked when Vest loads.`,
          'Each time Vest loads, check GitHub for a newer version and offer a one-click install' +
            (S.update && S.update.latest ? `. The latest published is v${esc(S.update.latest)}.` : '.'),
        )}
        <div class="set-row"><button class="ghostbtn" data-act="check-now">Check now</button>
          <a class="ghostbtn" href="${REPO_URL}" target="_blank" rel="noopener">GitHub ${ICON.ext}</a></div>
        <div class="set-h">Support the copier</div>
        ${option(
          'supportapply',
          supportOn(),
          `Use code ${SUPPORT_CODE} at checkout`,
          `${SUPPORT_PCT}% off Vest purchases. It pays me a commission, which keeps the copier free.`,
          `On, the copier puts <b>${SUPPORT_CODE}</b> in Vest's code box at checkout, in place of another code if it saves you at least as much. You confirm it at your next checkout and see a short note after that. A code you type or pick stays. If your account has no code yet, turning this on links it to ${SUPPORT_CODE} permanently. You're asked again after updates.`,
        )}
        <div class="set-row"><button class="ghostbtn" data-act="copy-code">${ICON.copy} Copy code ${SUPPORT_CODE}</button></div>
      </div>`;
    wireOptions(body);
    body.querySelector('[data-act="check-now"]').onclick = () => checkForUpdate(true);
    body.querySelector('[data-act="copy-code"]').onclick = () =>
      copySupportCode().then((ok) => toast(ok ? `Code ${SUPPORT_CODE} copied.` : `Code: ${SUPPORT_CODE}`));
  }

  // Appearance: the panel's text size, what the copier draws on (or hides from) Vest's chart, and the STRATUH theme.
  function renderAppearance(body) {
    const option = optionHtml(openOpts(body));
    const seg = (attr, cur, opts) =>
      `<div class="seg" ${attr}>${opts.map(([v, l]) => `<button data-v="${v}" class="${cur === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    body.innerHTML = `
      <div class="settings">
        <div class="set-h">Panel</div>
        <div class="opt">
          <div class="opt-txt"><div class="opt-name">Text size</div>
            <div class="opt-short">The whole panel grows with it.</div></div>
          ${seg('data-text-size', S.textSize, [
            ['regular', 'Regular'],
            ['large', 'Large'],
            ['larger', 'Larger'],
          ])}
        </div>
        <div class="set-h">Chart</div>
        ${option(
          'bracket',
          S.chartBracket,
          'Bracket on the chart',
          'Entry, stop and targets drawn as you set them.',
          "While the Trade tab is open and you're not in a trade, your entry, stop, targets and fail price are drawn on Vest's chart for the side you point at (Buy or Sell). They follow the price and your points. They're a preview: nothing is sent until you click.",
        )}
        ${option(
          'hidemarks',
          S.hideMarks,
          'Hide marks on bars',
          "Hide Vest's buy and sell marks each load.",
          "The chart's right-click Hide marks on bars, which Vest forgets on every refresh. Show them again from that menu any time.",
        )}
        ${option(
          'hidesessions',
          S.hideSessions,
          'Hide session shading',
          "Hide Vest's pre-market and overnight bands.",
          "Hides the pre-market, after-hours and overnight bands Vest draws on the chart (the eye on its Market Sessions indicator). Switch it off and they show again at once. Vest's own Session shading setting still decides whether it draws them.",
        )}
        <div class="set-h">Theme</div>
        ${option(
          'theme',
          S.theme,
          'STRATUH theme',
          "Onyx and lime for Vest's page and chart.",
          "Recolours Vest's own page and chart in STRATUH's colours: onyx, lime and greys, square corners, and drops the Volume indicator Vest adds to the chart by itself. Dark mode only; turn it off to go back to Vest's colours (the chart on the next refresh).",
        )}
        <div class="opt ${S.theme ? '' : 'dep-off'}">
          <div class="opt-txt"><div class="opt-name">Shorts and losses</div>
            <div class="opt-short">Candles stay grey either way.</div></div>
          ${seg('data-theme-down', S.themeDown, [
            ['mono', 'Grey'],
            ['red', 'Red'],
          ])}
        </div>
      </div>`;
    wireOptions(body);
    body.querySelectorAll('[data-theme-down] button').forEach(
      (b) =>
        (b.onclick = () => {
          S.themeDown = b.dataset.v;
          saveOpts();
          applyTheme();
          render();
        }),
    );
    body.querySelectorAll('[data-text-size] button').forEach(
      (b) =>
        (b.onclick = () => {
          S.textSize = b.dataset.v;
          saveOpts();
          render(); // place() applies the new size
        }),
    );
  }

  // How it works and the risk terms: the first-run acknowledgement (required before copying or trading) and Help.
  function rulesHtml() {
    const how = `
        <ul class="rules-list">
          <li><b>Live copying.</b> Start copying sends your <b>master</b> account's orders to the selected
            <b>followers</b> as <b>real orders</b> on live accounts.</li>
          <li><b>Leverage is matched.</b> When you start, followers are set to the master's leverage. If you change
            leverage or switch markets, <b>stop and start copying again</b>.</li>
          <li><b>Flat, or already in the same trade.</b> Start when everyone is flat, or when the master and followers
            hold the same position (same market and side): starting <b>adopts</b> it, so exits and stop/target changes
            copy. It never opens a trade for a follower that isn't already in it.</li>
          <li><b>Only your orders are copied.</b> When Vest closes the master itself (a stop or target filling, a
            drawdown breach), nothing is copied: the log says what Vest did, and a follower still in the trade a few
            seconds later is offered to flatten.</li>
          <li><b>An account that fails drops out.</b> A follower is removed and the others keep copying; if the master
            fails, copying stops.</li>
          <li><b>Sizing.</b> <b>Cap-to-fit</b> (the default) sizes each follower to its own equity: same % risk, same
            stop distance, smaller size. Strict 1:1 (Edit) copies the exact size (same-size accounts only).</li>
          <li><b>Shared risk.</b> One bad trade hits <b>every</b> linked account at once. Size so a simultaneous loss
            is survivable.</li>
        </ul>`;
    const risk = `
        <div class="rules-h">Your risk</div>
        <ul class="rules-list">
          <li>STRATUH Copier <b>places real orders on live accounts</b>, automatically, using your logged-in Vest session.</li>
          <li>Copies can be late, fail, fill at a different price or size, or be missed entirely, for example when Vest
            changes its site, rejects an order or is slow. <b>Watch your accounts</b> while it runs.</li>
          <li><b>You alone are responsible</b> for every order it sends and every trade on your accounts, including any
            loss, drawdown breach or failed evaluation.</li>
          <li>It is provided free and <b>as is, with no warranty</b>. Its author accepts <b>no responsibility or liability</b>
            for anything that happens while you use it.</li>
          <li>It is not affiliated with or endorsed by Vest Markets. Whether your prop program allows a trade copier is
            yours to check. Nothing here is financial advice.</li>
        </ul>
        <div class="rules-h">Free, with my code</div>
        <ul class="rules-list">
          <li>STRATUH Copier is free, and it works the same with or without my code. <b>${SUPPORT_CODE}</b> gives you
            ${SUPPORT_PCT}% off Vest purchases and pays me a commission, which keeps the copier free.</li>
          <li><b>You choose.</b> After this, the copier asks whether to use ${SUPPORT_CODE}, and asks again after updates.
            Nothing happens at checkout until you say yes, and <b>Settings → Support the copier</b> changes it any time.</li>
        </ul>
        <div class="rules-terms">Full terms: <a href="${REPO_URL}/blob/main/DISCLAIMER.md" target="_blank" rel="noopener">Disclaimer</a>
          · <a href="${REPO_URL}/blob/main/LICENSE" target="_blank" rel="noopener">License</a></div>`;
    return { how, risk };
  }
  function renderRules(body) {
    if (S.ack) return setView('support'); // accepted: the rules live in Help
    if (body.dataset.view === 'rules-first') return; // a re-render would untick the box
    body.dataset.view = 'rules-first';
    const { how, risk } = rulesHtml();
    body.innerHTML = `
      <div class="rules">
        <div class="rules-h big">Before you use STRATUH Copier</div>
        ${risk}
        <div class="rules-h">How it works</div>
        ${how}
        <label class="rules-accept"><input type="checkbox" id="rl-check">
          I have read this. I use STRATUH Copier entirely at my own risk, and its author is not responsible for any loss.</label>
        <div class="rules-btns"><button class="armbtn" id="rl-agree" disabled>Accept and continue</button></div>
      </div>`;
    const check = body.querySelector('#rl-check'),
      agree = body.querySelector('#rl-agree');
    check.onchange = () => (agree.disabled = !check.checked);
    agree.onclick = () => {
      if (!check.checked) return;
      S.ack = true;
      saveAck();
      diag('terms_accepted', { version: TERMS_VERSION });
      logEvent('info', 'Terms accepted.');
      S.rulesOpen = false;
      render();
      if (S.ackThenArm) arm();
      S.ackThenArm = false;
      supportOnTerms();
    };
  }

  // Account P&L summary — profit = equity − starting capital, per account and summed. Auto-updates with the balance poll.
  // ── Report a problem. One file with everything needed to debug (activity log, diagnostics, version, Vest build,
  // settings, accounts with balances), saved locally, plus a GitHub issue pre-filled with the version and the user's
  // description, ready for the file to be dragged in. Account ids are replaced by their labels ("Account 07") so the
  // file is safer to post publicly; nothing is sent anywhere by the copier.
  const ISSUE_FORM = 'bug_report.yml';
  // Every account id in a file the user saves becomes a name: active accounts by their label, closed ones by the label
  // recorded next to the id in the diagnostics, anything else by a placeholder. Position and order ids are Vest's
  // random ids for single orders (useless without a login) and stay, since they tie related events together. Used by
  // the report and by the log's Download.
  function accountScrubber() {
    const ACCOUNT_KEYS = new Set(['account', 'accountId', 'master', 'followers', 'id']);
    const isUuid = (v) =>
      typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
    const alias = {};
    for (const id in S.byId) alias[id] = S.byId[id].label;
    const learn = (o) => {
      if (Array.isArray(o)) return o.forEach(learn);
      if (!o || typeof o !== 'object') return;
      const id = isUuid(o.account) ? o.account : isUuid(o.id) && o.label ? o.id : null;
      if (id && o.label && !alias[id]) alias[id] = o.label;
      Object.values(o).forEach(learn);
    };
    learn(S.diag);
    let unknown = 0,
      unknownText = 0;
    const nameFor = (id) => alias[id] || (alias[id] = `account-${++unknown}`);
    // inside free text an id could be an account's, an order's or a position's: an unknown one becomes a neutral
    // "id-N" (the same id, the same N), so no account id leaves in a sentence (reports reach public issues)
    const textIds = {};
    const textName = (id) => alias[id] || textIds[id] || (textIds[id] = `id-${++unknownText}`);
    const scrub = (v) =>
      JSON.parse(JSON.stringify(v), function (k, val) {
        if (Array.isArray(val) && ACCOUNT_KEYS.has(k)) return val.map((x) => (isUuid(x) ? nameFor(x) : x));
        if (typeof val !== 'string') return val;
        if (alias[val]) return alias[val];
        if (isUuid(val) && ACCOUNT_KEYS.has(k) && (k !== 'id' || 'label' in this)) return nameFor(val);
        // account ids inside longer text, e.g. an error message holding an API path with the id in it
        if (isUuid(val)) return val; // a position or order id in its own field: kept (it ties related events together)
        return val.replace(/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi, textName);
      });
    return { scrub, alias };
  }
  function buildReport(note) {
    const { scrub } = accountScrubber();
    const accounts = Object.values(S.byId).map((r) => ({
      label: r.label,
      type: r.type,
      size: r.size,
      equity: r.equity,
      floor: r.floor,
      dailyFloor: r.dailyFloor,
      target: r.target,
      free: r.free,
      canTrade: r.canTrade,
      role: r.id === S.master ? 'master' : S.followers.has(r.id) ? 'follower' : null,
    }));
    return scrub({
      kind: 'vest-copier-report',
      version: VERSION,
      build: fingerprint() || null,
      exportedAt: new Date().toISOString(),
      browser: navigator.userAgent,
      description: note,
      state: {
        armed: S.armed,
        master: S.master,
        followers: [...S.followers],
        openTrades: Object.keys(S.posMap).length,
        liveFeed: feedLive(),
      },
      settings: {
        fast: S.fast,
        autoFlatten: S.autoFlatten,
        capFit: S.capFit,
        checkUpdates: S.checkUpdates,
        hideMarks: S.hideMarks,
        trade: S.trade,
      },
      accounts,
      log: storedLog().reverse(),
      diagnostics: S.diag,
    });
  }
  function sendReport(note) {
    const name = `vest-copier-report-${stamp()}.json`;
    persistDiag();
    saveFile(name, 'application/json', JSON.stringify(buildReport(note), null, 2));
    const first = (note.split('\n').find((l) => l.trim()) || '').trim().slice(0, 80);
    const params = new URLSearchParams({
      template: ISSUE_FORM,
      title: `Problem: ${first || 'describe it here'}`,
      version: VERSION,
    });
    if (note) params.set('what-happened', note.slice(0, 4000));
    window.open(`${REPO_URL}/issues/new?${params}`, '_blank', 'noopener');
    logEvent('info', `Report saved as ${name}. Drag it into the GitHub issue that just opened.`);
    diag('report', { file: name, hasNote: !!note });
  }
  // Support tab: report a problem (one report file + a pre-filled GitHub issue), share ideas, quick links, and the
  // project's support code. Built once, so a description being typed survives the panel's regular refreshes.
  function shareIdea() {
    const params = new URLSearchParams({ template: 'feature_request.yml', title: 'Idea: ', version: VERSION });
    window.open(`${REPO_URL}/issues/new?${params}`, '_blank', 'noopener');
  }
  // Help: report a problem (one report file + a pre-filled GitHub issue), Discord, ideas, the support code, and the rules.
  // Built once, so a description being typed survives the panel's regular refreshes.
  function renderSupportTab(body) {
    if (body.dataset.view === 'support' && body.querySelector('.support-tab')) return;
    body.dataset.view = 'support';
    const link = (href, text) => `<a class="lnk" href="${href}" target="_blank" rel="noopener">${text}</a>`;
    const { how, risk } = rulesHtml();
    body.innerHTML = `
      <div class="help support-tab">
        <div class="links">STRATUH Copier v${VERSION} · ${link(`${REPO_URL}/blob/main/CHANGELOG.md`, "What's new")} ·
          ${link(`${REPO_URL}/blob/main/docs/USER-GUIDE.md`, 'Guide')} · ${link('https://xamped.github.io/Vest-Copier/tutorial/', 'Tutorial')}</div>
        <div class="grp"><span class="eyebrow">Report a problem</span>
          <textarea class="report-note" id="rp-note" rows="4" aria-label="What happened"
            placeholder="What happened, and what did you expect? Which accounts, roughly when?"></textarea>
          <div class="hint">Saves a report file and opens a GitHub issue with your description filled in: drag the file
            into it and submit (a free GitHub account). The file holds the log, settings and balances, with account ids
            replaced by their numbers, and the names you gave your accounts on Vest. Never passwords or tokens.</div>
          <button class="ghostbtn" id="rp-send">Save report &amp; open issue ${ICON.ext}</button></div>
        <div class="grp">
          <a class="lrow" href="${DISCORD_URL}" target="_blank" rel="noopener"><span>Join the Discord</span><span class="hint">questions, setup help</span>${ICON.ext}</a>
          <button class="lrow" id="sp-idea"><span>Share an idea</span><span class="hint">on GitHub</span>${ICON.ext}</button>
          <button class="lrow" id="sp-copy"><span>Support code <b class="code">${SUPPORT_CODE}</b></span><span class="hint">5% off at Vest · Copy</span>${ICON.copy}</button>
        </div>
        <div class="grp"><span class="eyebrow">Before you start</span>${how}</div>
        <div class="grp">${risk}</div>
      </div>`;
    const note = body.querySelector('#rp-note');
    ['keydown', 'keyup', 'keypress'].forEach((ev) => note.addEventListener(ev, (e) => e.stopPropagation())); // not Vest's shortcuts
    body.querySelector('#rp-send').onclick = () => sendReport(note.value.trim());
    body.querySelector('#sp-idea').onclick = shareIdea;
    body.querySelector('#sp-copy').onclick = () =>
      copySupportCode().then((ok) => toast(ok ? `Code ${SUPPORT_CODE} copied.` : `Code: ${SUPPORT_CODE}`));
  }

  // ── Trade history: every account's closed positions (active accounts and finished ones: a passed evaluation, a
  // closed or failed funded account), from Vest's own position history, the same one its Position History tab reads:
  // GET /v3/positions?account_id=…&limit&offset → { positions, total }, each with its side, size, open / close price,
  // P&L (as Vest reports it), times and close reason. Finished accounts come from /v3/capital/accounts/history. Positions
  // on the same market and side, opened within seconds and closed within a minute or two of each other on different
  // accounts, are one copied trade. Read only when Share needs it, cached for a few minutes. Read-only.
  const HIST_DAYS = 30, // how far back the trade list goes
    HIST_PAGE = 50,
    HIST_PAGES = 4, // per account: up to 200 positions
    HIST_ACCTS = 40, // finished accounts read, newest first
    HIST_TTL_MS = 5 * 60000,
    GROUP_OPEN_MS = 10000, // copies open within this of each other…
    GROUP_CLOSE_MS = 90000; // …and close within this
  S.hist = null; // { at, trades: [group], error }
  let _histBusy = null;
  const msOf = (v) => {
    if (v == null || v === '') return null;
    const n = typeof v === 'number' ? v : /^\d+(\.\d+)?$/.test(String(v)) ? +v : Date.parse(v);
    return Number.isFinite(n) && n > 0 ? (n < 1e12 ? n * 1000 : n) : null;
  };
  // One closed position, in the shape the cards use (null for anything that isn't a closed position)
  function normPos(x, acct) {
    if (!x || typeof x !== 'object') return null;
    const id = x.positionId || x.position_id || x.id,
      symbol = x.symbol,
      closedAt = msOf(x.closeDate ?? x.close_date ?? x.closedAt);
    if (!id || !symbol || !closedAt) return null;
    const open = num(x.openPrice ?? x.open_price),
      close = num(x.closePrice ?? x.close_price),
      pnl = num(x.pnl);
    const side = String(x.side || '')
        .toLowerCase()
        .startsWith('s')
        ? 'short'
        : 'long',
      dir = side === 'long' ? 1 : -1;
    let qty = Math.abs(num(x.quantity));
    // a closed position can report 0: the size follows from its P&L and prices ($1 a point per unit)
    if (!(qty > 0) && open > 0 && close > 0 && close !== open && Number.isFinite(pnl))
      qty = Math.abs(pnl / (dir * (close - open)));
    return {
      acct,
      id,
      symbol,
      side,
      qty: qty > 0 ? qty : NaN,
      open,
      close,
      pnl: Number.isFinite(pnl) ? pnl : 0,
      openedAt: msOf(x.openDate ?? x.open_date ?? x.openedAt ?? x.createdAt) || closedAt,
      closedAt,
      reason: x.closeReason ?? x.close_reason ?? null,
    };
  }
  // A position list read with the user's session, else with the account's own token (Vest reads it per account)
  async function readAs(path, acct) {
    try {
      return await api(path);
    } catch (e) {
      const { token } = await mintAccountToken(acct);
      return api(path, token);
    }
  }
  async function accountPositions(acct, since) {
    const out = [];
    let offset = 0;
    for (let page = 0; page < HIST_PAGES; page++) {
      const r = await readAs(
        `/v3/positions?account_id=${encodeURIComponent(acct)}&limit=${HIST_PAGE}&offset=${offset}`,
        acct,
      );
      const ps = (r && Array.isArray(r.positions) && r.positions) || [];
      for (const x of ps) {
        const n = normPos(x, acct);
        if (n) out.push(n);
      }
      offset += ps.length;
      if (ps.length < HIST_PAGE || (r.total > 0 && offset >= r.total)) break;
      if (out.length && Math.min(...out.map((o) => o.closedAt)) < since) break; // newest first: far enough back
    }
    return out.filter((o) => o.closedAt >= since);
  }
  // Positions → trades: the same trade copied across accounts is one entry, with every account in it.
  function groupTrades(ps) {
    const groups = [];
    for (const p of [...ps].sort((a, b) => a.openedAt - b.openedAt)) {
      const g = groups.find(
        (g) =>
          g.symbol === p.symbol &&
          g.side === p.side &&
          !g.accts.has(p.acct) &&
          Math.abs(g.openedAt - p.openedAt) <= GROUP_OPEN_MS &&
          Math.abs(g.closedAt - p.closedAt) <= GROUP_CLOSE_MS,
      );
      if (g) {
        g.items.push(p);
        g.accts.add(p.acct);
        g.pnl += p.pnl;
        g.closedAt = Math.max(g.closedAt, p.closedAt);
      } else
        groups.push({
          key: p.acct + ':' + p.id,
          symbol: p.symbol,
          side: p.side,
          openedAt: p.openedAt,
          closedAt: p.closedAt,
          pnl: p.pnl,
          items: [p],
          accts: new Set([p.acct]),
        });
    }
    for (const g of groups) {
      // the lead: the master when it's in the trade, else the first account in it
      g.lead = g.items.find((p) => p.acct === S.master) || g.items[0];
      g.copied = g.items.length > 1;
    }
    return groups.sort((a, b) => b.closedAt - a.closedAt);
  }
  // Every account the user has: the active ones and the finished ones (newest first, up to HIST_ACCTS)
  async function historyAccounts() {
    const list = Object.values(S.byId).map((r) => ({ id: r.id, label: r.label, active: true }));
    const seen = new Set(list.map((a) => a.id));
    let cursor = null;
    try {
      for (let page = 0; page < 5 && list.length < HIST_ACCTS + seen.size; page++) {
        const r = await api(
          `/v3/capital/accounts/history?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
        );
        for (const a of (r && r.accounts) || []) {
          const id = a.id || a.account_id;
          if (!id || seen.has(id)) continue;
          seen.add(id);
          list.push({ id, label: label(a), active: false });
        }
        cursor = r && r.next;
        if (!cursor) break;
      }
    } catch {
      /* finished accounts unreadable: the active ones still count */
    }
    return list;
  }
  const histLabels = {}; // account id → its label, for finished accounts too
  function loadHistory(force = false) {
    if (_histBusy) return _histBusy;
    if (!force && S.hist && !S.hist.error && Date.now() - S.hist.at < HIST_TTL_MS) return Promise.resolve(S.hist);
    _histBusy = (async () => {
      try {
        const accts = await historyAccounts();
        accts.forEach((a) => (histLabels[a.id] = a.label));
        const since = Date.now() - HIST_DAYS * 86400000,
          all = [];
        let failed = 0;
        // a few accounts at a time (each is one or more reads)
        const queue = [...accts];
        await Promise.all(
          Array.from({ length: 4 }, async () => {
            for (let a = queue.shift(); a; a = queue.shift())
              try {
                all.push(...(await accountPositions(a.id, since)));
              } catch {
                failed++;
              }
          }),
        );
        S.hist = { at: Date.now(), trades: groupTrades(all), accounts: accts.length, failed };
        diag('history', {
          accounts: accts.length,
          finished: accts.filter((a) => !a.active).length,
          positions: all.length,
          trades: S.hist.trades.length,
          failed,
        });
      } catch (e) {
        S.hist = { at: Date.now(), trades: [], error: e.message };
        diag('history', { outcome: 'error', error: e.message });
      } finally {
        _histBusy = null;
      }
      if (S.shareOpen) render();
      return S.hist;
    })();
    return _histBusy;
  }
  // A trade's own story, from Vest's position details (its orders and the stop / target history): the entry and adds,
  // each exit with its price and why (TP1, TP2, stop, breakeven, closed), and the stop moves. Cached per position.
  const _details = {};
  async function tradeDetails(g) {
    const p = g.lead,
      key = p.acct + ':' + p.id;
    if (_details[key]) return _details[key];
    const { token } = await mintAccountToken(p.acct);
    const r = await api(`/v3/positions/${encodeURIComponent(p.id)}/details`, token);
    const pos = (r && (r.position || r)) || {};
    const tick = (SYMBOLS[p.symbol] || {}).tick || 0.25,
      dir = p.side === 'long' ? 1 : -1;
    const orders = (pos.orders || [])
      .map((o) => ({
        buy: o.isBuy ?? String(o.side || '').toLowerCase() === 'buy',
        qty: num(o.executedQuantity ?? o.executed_quantity),
        price: num(o.executionPrice ?? o.execution_price) || num(o.price),
        at: msOf(o.executionTime ?? o.execution_time ?? o.updatedAt ?? o.updated_at),
        reason: o.closeReason ?? o.close_reason ?? null,
        reduce: !!(o.reduceOnly ?? o.reduce_only),
      }))
      .filter((o) => o.qty > 0 && o.price > 0 && o.at)
      .sort((a, b) => a.at - b.at);
    const entries = orders.filter((o) => !o.reduce && o.buy === (p.side === 'long'));
    const exits = orders.filter((o) => o.reduce || o.buy !== (p.side === 'long'));
    const entry =
      p.open ||
      (entries.length ? entries.reduce((a, o) => a + o.price * o.qty, 0) / entries.reduce((a, o) => a + o.qty, 0) : 0);
    let tpN = 0;
    const exitRows = exits.map((o) => {
      const pts = dir * (o.price - entry);
      const kind = /take/i.test(o.reason || '')
        ? `TP${++tpN}`
        : /stop/i.test(o.reason || '')
          ? Math.abs(pts) <= 2 * tick
            ? 'BE'
            : 'SL'
          : /liquid/i.test(o.reason || '')
            ? pts > 0
              ? 'VEST' // Vest closed it in profit: an evaluation reaching its target, not a liquidation
              : 'LIQ'
            : 'Close';
      return { kind, qty: o.qty, price: o.price, pts, usd: pts * o.qty, at: o.at };
    });
    // the stop's moves: each new trigger price in the stop-loss history (not its first placement)
    const slHist = (pos.stopLossHistory || pos.stop_loss_history || [])
      .map((x) => ({
        px: num(x.triggerPrice ?? x.trigger_price),
        at: msOf(x.updatedAt ?? x.updated_at ?? x.createdAt),
      }))
      .filter((x) => x.px > 0 && x.at)
      .sort((a, b) => a.at - b.at);
    const moves = slHist.filter((x, i) => i > 0 && x.px !== slHist[i - 1].px);
    const events = [];
    const n = g.items.length;
    entries.forEach((o, i) =>
      events.push({
        at: o.at,
        text:
          i === 0
            ? `${p.side === 'long' ? 'Bought' : 'Sold'} ${fmtQty(o.qty, p.symbol)}${n > 1 ? `, copied to ${n - 1}` : ''}`
            : `Added ${fmtQty(o.qty, p.symbol)}`,
        hot: false,
      }),
    );
    moves.forEach((m) =>
      events.push({
        at: m.at,
        text: Math.abs(m.px - entry) <= 2 * tick ? 'Stop to breakeven' : `Stop to ${fmtPx(m.px, tick)}`,
        hot: false,
      }),
    );
    exitRows.forEach((x, i) =>
      events.push({
        at: x.at,
        text: x.kind.startsWith('TP')
          ? `${x.kind} filled`
          : x.kind === 'BE'
            ? i === exitRows.length - 1 && exitRows.length > 1
              ? 'Rest out at breakeven'
              : 'Out at breakeven'
            : x.kind === 'SL'
              ? 'Stopped out'
              : x.kind === 'LIQ'
                ? 'Liquidated'
                : x.kind === 'VEST'
                  ? 'Profit target hit'
                  : 'Closed',
        hot: x.kind.startsWith('TP') || x.kind === 'VEST',
      }),
    );
    events.sort((a, b) => a.at - b.at);
    return (_details[key] = { entry, exits: exitRows, events });
  }

  // ── Share: today's P&L as a picture to paste anywhere (X, Discord, a group chat). Drawn on a canvas in the page, copied
  // to the clipboard as a PNG (or saved). Shows account numbers and P&L only: never balances, ids, emails or logins.
  // Amounts hidden: % change on the day's starting equity, no $ anywhere. The only network use is the three fonts, from
  // jsDelivr, loaded the first time Share opens (the card still draws with system fonts without them).
  const SHARE_NAME_KEY = 'vc-share-name',
    SHARE_OPTS_KEY = 'vc-share-opts'; // { hide, code, sort, style }: the Share sheet's options, remembered
  const CARD_W = 1200,
    CARD_H = 675,
    CARD_SCALE = 2;
  const CARD_FONTS = [
    [
      'STRATUH Card Display',
      'instrument-sans@5.2.8/files/instrument-sans-latin-standard-normal.woff2',
      { stretch: '75% 100%', weight: '400 700' },
    ],
    ['STRATUH Card Sans', 'geist@5.2.8/files/geist-latin-wght-normal.woff2', { weight: '100 900' }],
    ['STRATUH Card Mono', 'jetbrains-mono@5.2.8/files/jetbrains-mono-latin-wght-normal.woff2', { weight: '100 800' }],
  ];
  let _cardFonts = null; // a promise: resolves once loaded (or failed)
  function loadCardFonts() {
    if (_cardFonts) return _cardFonts;
    _cardFonts = Promise.all(
      CARD_FONTS.map(([family, file, desc]) =>
        new FontFace(family, `url(https://cdn.jsdelivr.net/npm/@fontsource-variable/${file})`, desc)
          .load()
          .then((f) => document.fonts.add(f))
          .catch(() => null),
      ),
    ).then(() => document.fonts.ready);
    return _cardFonts;
  }
  const CF = {
    display: "'STRATUH Card Display', 'Arial Narrow', sans-serif",
    sans: "'STRATUH Card Sans', 'Inter', 'Segoe UI', system-ui, sans-serif",
    mono: "'STRATUH Card Mono', ui-monospace, Consolas, monospace",
  };
  // Everything the card shows, from what the panel already knows. Missing parts are left off, never guessed.
  function cardData() {
    const d = dayTotals(),
      hasDay = d.known > 0;
    const rows = Object.values(S.byId).filter((r) => !isNaN(todayOf(r)) || !hasDay);
    // the day's start: an account paid out today starts from its starting balance (as Today counts it)
    const startEq = hasDay ? rows.reduce((a, r) => a + (paidToday(r.id) ? r.size : S.day.startEq[r.id] || 0), 0) : 0;
    const st = dayStats();
    const start = vestDayStart();
    const fills = S.diag.filter(
      (x) => ['open', 'append', 'close'].includes(x.type) && x.slipPts != null && Date.parse(x.t) >= start,
    );
    const slip = fills.length ? fills.reduce((a, x) => a + Math.abs(+x.slipPts || 0), 0) / fills.length : null;
    const order = (r) => (r.id === S.master ? -1 : S.followers.has(r.id) ? 0 : 1);
    const accts = [...rows].sort((a, b) => order(a) - order(b) || a.order - b.order);
    const name = String(store.get(SHARE_NAME_KEY, '') || '')
      .replace(/[^\p{L}\p{N}@._ -]/gu, '')
      .slice(0, 24);
    // the curve: Vest's series for the day, ending at the equity now
    let curve = null;
    if (hasDay && S.day.curve.length) {
      const now = S.day.ids.reduce(
        (a, id) => a + (S.byId[id] && !isNaN(S.byId[id].equity) ? S.byId[id].equity : NaN),
        0,
      );
      curve = [...S.day.curve];
      if (Number.isFinite(now) && Date.now() > curve[curve.length - 1][0]) curve.push([Date.now(), now]);
      if (curve.length < 2) curve = null;
    }
    return {
      hasDay,
      trades: dayTrades(),
      style: S.share ? S.share.style : 'summary',
      total: hasDay
        ? d.today
        : Object.values(S.byId).reduce((a, r) => a + (isNaN(r.equity) ? 0 : r.equity - r.size), 0),
      pct: hasDay && startEq > 0 ? d.today / startEq : null,
      accounts: accts.map((r) => ({ master: r.id === S.master })),
      copies: st.copies,
      missed: st.missed,
      complete: st.complete,
      slip,
      curve,
      name,
      code: S.share ? S.share.code : true,
      at: Date.now(),
    };
  }
  // The day's trades, oldest first: closed ones on the active accounts since the day began (a copied trade is one entry,
  // its P&L summed, `accts` = how many accounts were in it), and the position open now. `qty` and `pts` are the lead's
  // (the master when it's in the trade): the card shows the master's size and, with amounts hidden, its points.
  // A closed position's points: from its prices, unless they disagree with its P&L ÷ size (Vest's history can carry a
  // wrong open price, seen 2026-10-13 as ±30,000 points on NQ), then from the P&L ($1 a point per unit).
  function closedPts(p) {
    const byPrice = p.open > 0 && p.close > 0 ? (p.side === 'long' ? 1 : -1) * (p.close - p.open) : NaN,
      byPnl = p.qty > 0 ? p.pnl / p.qty : NaN;
    if (Number.isFinite(byPrice) && Number.isFinite(byPnl))
      return Math.abs(byPrice - byPnl) > Math.max(2, Math.abs(byPnl) * 0.25) ? byPnl : byPrice;
    return Number.isFinite(byPrice) ? byPrice : Number.isFinite(byPnl) ? byPnl : null;
  }
  function dayTrades() {
    const start = vestDayStart(),
      active = (id) => !!S.byId[id];
    const out = [];
    for (const g of (S.hist && S.hist.trades) || []) {
      // an account paid out today: only its trades since the payout (the claimed ones aren't in Today)
      const items = g.items.filter(
        (p) => active(p.acct) && p.closedAt >= (paidToday(p.acct) ? Math.max(start, S.payouts[p.acct]) : start),
      );
      if (!items.length) continue;
      const lead = items.find((p) => p.acct === S.master) || items[0];
      out.push({
        side: g.side,
        qty: lead.qty,
        symbol: g.symbol,
        pnl: items.reduce((a, p) => a + p.pnl, 0),
        pts: closedPts(lead),
        accts: items.length,
        open: false,
        at: g.closedAt,
      });
    }
    // open now: the master's position (and the followers in it)
    const st = S.master && S.acctState[S.master];
    for (const h of (stateFresh(st) && st.positions) || []) {
      let pnl = 0,
        accts = 0;
      for (const id of [S.master, ...S.followers]) {
        const r = S.byId[id];
        if (r && inTrade(id)) {
          pnl += r.upnl || 0;
          accts++;
        }
      }
      const px = priceOf(h.symbol),
        entry = num(h.openPrice);
      out.push({
        side: h.side,
        qty: h.qty,
        symbol: h.symbol,
        pnl,
        pts: px > 0 && entry > 0 ? (h.side === 'long' ? 1 : -1) * (px - entry) : null,
        accts: accts || 1,
        open: true,
        at: Date.now(),
      });
    }
    return out.sort((a, b) => a.at - b.at);
  }
  // The day's date and time in ET, as on the card: "SAT 10 OCT 2026 · 20:41 ET"
  function etStamp(t) {
    const p = {};
    for (const x of new Intl.DateTimeFormat('en-GB', {
      timeZone: ET_TZ,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(t)))
      p[x.type] = x.value;
    return `${p.weekday} ${p.day} ${p.month} ${p.year} · ${p.hour}:${p.minute} ET`.toUpperCase();
  }
  // The STRATUH mark and wordmark on the canvas, from the same geometry as the panel's logo. `h` = the mark's height.
  function drawLockup(ctx, x, y, h) {
    const u = h / 24; // one mark unit
    ctx.save();
    ctx.translate(x + 2.8 * u, y);
    MARK_BARS.forEach(([w, fill, echo], i) => {
      const by = (1 + i * 4.65) * u,
        bh = 3.4 * u;
      ctx.fillStyle = echo;
      ctx.fillRect(-1.8 * u, by, 3.8 * u, bh);
      const sh = ctx.createLinearGradient(-0.7 * u, 0, 1 * u, 0);
      sh.addColorStop(0, 'rgba(0,0,0,0)');
      sh.addColorStop(0.55, 'rgba(0,0,0,0.073)');
      sh.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = sh;
      ctx.fillRect(-0.7 * u, by, 1.7 * u, bh);
      if (fill === 'poc') {
        const g = ctx.createLinearGradient(1 * u, 0, (1 + w) * u, 0);
        g.addColorStop(0, '#9fe02f');
        g.addColorStop(1, '#e4ff7a');
        ctx.fillStyle = g;
      } else ctx.fillStyle = fill;
      ctx.fillRect(1 * u, by, w * u, bh);
    });
    ctx.restore();
    // the wordmark: caps 1 / 1.2 of the bars (22 units), centred on them, half a cap height after the point of control
    const cap = (22 * u) / 1.2,
      s = cap / 720,
      wx = x + 22.4 * u + cap / 2,
      base = y + 12 * u + cap / 2;
    ctx.save();
    ctx.translate(wx, base);
    ctx.scale(s, s);
    ctx.fillStyle = '#f0f0f1';
    ctx.fill(new Path2D(WORDMARK_D));
    ctx.restore();
    return wx + 3159 * s; // where the wordmark ends
  }
  // A seeded ASCII texture, the strata on stratuh.com (same generator as the mockups).
  function drawAscii(ctx, x, y, cols, rows) {
    const chars = ' .:-=+*#%@';
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    ctx.save();
    ctx.font = `400 10px ${CF.mono}`;
    ctx.fillStyle = 'rgba(200, 245, 66, 0.06)';
    ctx.textBaseline = 'top';
    for (let r = 0; r < rows; r++) {
      const band = Math.sin(r * 0.55) * 0.5 + 0.5;
      let line = '';
      for (let c = 0; c < cols; c++)
        line += chars[Math.min(9, Math.floor(rnd() * 10 * band * (0.6 + 0.4 * Math.sin(c * 0.07 + r))))] || ' ';
      ctx.fillText(line, x, y + r * 12);
    }
    ctx.restore();
  }
  // Text in runs of colours: [[text, colour, font?], …] from x on one baseline; returns the end x.
  function runs(ctx, x, y, parts) {
    for (const [t, color, font] of parts) {
      if (font) ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(t, x, y);
      x += ctx.measureText(t).width;
    }
    return x;
  }
  // ── The Today card's trade row (bottom left), in the style picked in Share (`SHARE_STYLES`, design in
  // docs/redesign/share-styles/): Day summary (tiles: trades, won / lost, best, worst, the position open now), Latest
  // trades (the newest three that fit, older ones as "+N earlier"), Last trade + day, or None. A caption above the row
  // says the size is the master's and the P&L is summed across the accounts in each trade; a chip says "on 3" when fewer
  // accounts were in that trade than on the card. Amounts hidden: the master's points instead of dollars.
  const SHARE_STYLES = [
    ['summary', 'Day summary', 'Trades, wins and losses, best and worst.'],
    ['latest', 'Latest trades', 'The last three, oldest first.'],
    ['mix', 'Last trade + day', "The last trade and the day's count."],
    ['none', 'None', 'Just the number and the curve.'],
  ];
  const ROW_H = 66,
    ROW_Y = CARD_H - 40 - ROW_H,
    ROW_X1 = 920, // the code box is to the right
    ROW_GAP = 12;
  const signedPts = (n) =>
    n == null || !Number.isFinite(n) ? '—' : `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(2)} pts`;
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  function drawTradeRow(ctx, d, hide, L, T) {
    const pnlCol = (n) => (n == null || Math.abs(n) < 0.005 ? T.text : n > 0 ? T.lime : T.red);
    const valOf = (t) => (hide ? t.pts : t.pnl),
      valText = (t) => (hide ? signedPts(t.pts) : sp(t.pnl));
    const box = (x, w) => {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x, ROW_Y, w, ROW_H);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.strokeRect(x + 0.5, ROW_Y + 0.5, w - 1, ROW_H - 1);
    };
    // the caption: [text, strong?], strong parts in muted, the rest dim (the account tiles' label style)
    const caption = (parts) => {
      let x = L;
      ctx.font = `500 13px ${CF.mono}`;
      ctx.letterSpacing = '1.8px';
      for (const [t, strong] of parts) {
        ctx.fillStyle = strong ? T.muted : T.dim;
        ctx.fillText(t, x, ROW_Y - 14);
        x += ctx.measureText(t).width;
      }
      ctx.letterSpacing = '0px';
    };
    const n = d.accounts.length,
      SEP = [' · '],
      sizeParts = hide
        ? [
            ['SIZE AND POINTS: ', false],
            ['MASTER', true],
          ]
        : [['SIZE: ', false], ['MASTER', true], SEP, ['P&L: ', false], [plural(n, 'account').toUpperCase(), true]];
    const sideOf = (t) => (t.side === 'long' ? 'LONG' : 'SHORT'),
      sizeOf = (t) => (t.qty > 0 ? `${fmtQty(t.qty, t.symbol)} ${symLabel(t.symbol)}` : symLabel(t.symbol));
    // a trade chip: side, size, P&L, "on 3" when fewer accounts were in it, "open"; measure = the width, nothing drawn
    const chip = (x, t, measure) => {
      const side = sideOf(t),
        size = sizeOf(t),
        val = valText(t),
        fewer = !hide && t.accts < n ? ` on ${t.accts}` : '';
      ctx.font = `700 11px ${CF.mono}`;
      const sw = ctx.measureText(side).width + 14;
      ctx.font = `400 16px ${CF.sans}`;
      const zw = ctx.measureText(size).width;
      ctx.font = `500 15px ${CF.mono}`;
      const vw = ctx.measureText(val).width,
        fw = fewer ? ctx.measureText(fewer).width : 0,
        ow = t.open ? ctx.measureText(' open').width : 0;
      const w = 14 + sw + 10 + zw + 12 + vw + fw + ow + 14;
      if (measure) return w;
      box(x, w);
      const mid = ROW_Y + ROW_H / 2;
      let cx = x + 14;
      ctx.fillStyle = t.side === 'long' ? T.lime : T.text;
      ctx.fillRect(cx, mid - 11, sw, 22);
      ctx.font = `700 11px ${CF.mono}`;
      ctx.fillStyle = T.ink;
      ctx.fillText(side, cx + 7, mid + 4);
      cx += sw + 10;
      ctx.font = `400 16px ${CF.sans}`;
      ctx.fillStyle = T.text;
      ctx.fillText(size, cx, mid + 6);
      cx += zw + 12;
      ctx.font = `500 15px ${CF.mono}`;
      ctx.fillStyle = pnlCol(valOf(t));
      ctx.fillText(val, cx, mid + 5);
      cx += vw;
      ctx.fillStyle = T.dim;
      if (fewer) {
        ctx.fillText(fewer, cx, mid + 5);
        cx += fw;
      }
      if (t.open) ctx.fillText(' open', cx, mid + 5);
      return w;
    };
    // a chip of mono text: "+2 earlier", "5 trades · 3W 2L". parts: [text, colour]
    const textChip = (x, parts, measure) => {
      ctx.font = `500 15px ${CF.mono}`;
      const w = 28 + parts.reduce((a, [t]) => a + ctx.measureText(t).width, 0);
      if (measure) return w;
      box(x, w);
      let cx = x + 14;
      for (const [t, col] of parts) {
        ctx.fillStyle = col;
        ctx.fillText(t, cx, ROW_Y + ROW_H / 2 + 5);
        cx += ctx.measureText(t).width;
      }
      return w;
    };
    // a stat tile: a small label on top, the value under it. value: [[text, colour], …]
    const tileLabel = (x, label) => {
      ctx.font = `500 11px ${CF.mono}`;
      ctx.letterSpacing = '1.5px';
      ctx.fillStyle = T.dim;
      ctx.fillText(label, x + 16, ROW_Y + 24);
      const lw = ctx.measureText(label).width;
      ctx.letterSpacing = '0px';
      return lw;
    };
    const tile = (x, label, value, measure) => {
      ctx.font = `500 11px ${CF.mono}`;
      ctx.letterSpacing = '1.5px';
      const lw = ctx.measureText(label).width;
      ctx.letterSpacing = '0px';
      ctx.font = `500 20px ${CF.mono}`;
      const vw = value.reduce((a, [t]) => a + ctx.measureText(t).width, 0);
      const w = Math.max(112, 32 + Math.max(lw, vw));
      if (measure) return w;
      box(x, w);
      tileLabel(x, label);
      let cx = x + 16;
      ctx.font = `500 20px ${CF.mono}`;
      for (const [t, col] of value) {
        ctx.fillStyle = col;
        ctx.fillText(t, cx, ROW_Y + 51);
        cx += ctx.measureText(t).width;
      }
      return w;
    };
    // a tile holding one trade: the label, then side, size and P&L on one line
    const tradeTile = (x, label, t, measure) => {
      const side = sideOf(t),
        size = sizeOf(t),
        val = valText(t);
      ctx.font = `700 11px ${CF.mono}`;
      const sw = ctx.measureText(side).width + 14;
      ctx.font = `400 16px ${CF.sans}`;
      const zw = ctx.measureText(size).width;
      ctx.font = `500 17px ${CF.mono}`;
      const vw = ctx.measureText(val).width;
      const w = 16 + sw + 10 + zw + 12 + vw + 16;
      if (measure) return w;
      box(x, w);
      tileLabel(x, label);
      let cx = x + 16;
      ctx.fillStyle = t.side === 'long' ? T.lime : T.text;
      ctx.fillRect(cx, ROW_Y + 36, sw, 20);
      ctx.font = `700 11px ${CF.mono}`;
      ctx.fillStyle = T.ink;
      ctx.fillText(side, cx + 7, ROW_Y + 50);
      cx += sw + 10;
      ctx.font = `400 16px ${CF.sans}`;
      ctx.fillStyle = T.text;
      ctx.fillText(size, cx, ROW_Y + 51);
      cx += zw + 12;
      ctx.font = `500 17px ${CF.mono}`;
      ctx.fillStyle = pnlCol(valOf(t));
      ctx.fillText(val, cx, ROW_Y + 51);
      return w;
    };
    // boxes in a row from L, each drawn only if it fits left of the code box
    const row = (boxes) => {
      let x = L;
      for (const b of boxes) {
        if (x + b(x, true) > ROW_X1) break;
        x += b(x) + ROW_GAP;
      }
    };
    const all = d.trades,
      closed = all.filter((t) => !t.open),
      open = all.filter((t) => t.open),
      won = closed.filter((t) => t.pnl > 0).length,
      lost = closed.filter((t) => t.pnl < 0).length;
    const style = d.style || 'summary';
    if (style === 'summary') {
      // counts, won / lost and best / worst from closed trades only; one closed trade: the trade itself. Amounts hidden:
      // the count and won / lost only (owner, 2026-10-13)
      caption([
        ['TODAY', true],
        ...(hide ? [] : [SEP, ['P&L ACROSS ', false], [plural(n, 'account').toUpperCase(), true]]),
      ]);
      const boxes = [
        (x, m) => tile(x, 'TRADES', [[String(closed.length), T.text]], m),
        (x, m) =>
          tile(
            x,
            'WON / LOST',
            [
              [`${won}W `, T.text],
              [`${lost}L`, T.muted],
            ],
            m,
          ),
      ];
      const ranked = hide ? [] : closed.filter((t) => Number.isFinite(t.pnl));
      if (closed.length >= 2 && ranked.length) {
        const best = ranked.reduce((a, t) => (valOf(t) > valOf(a) ? t : a)),
          worst = ranked.reduce((a, t) => (valOf(t) < valOf(a) ? t : a));
        boxes.push(
          (x, m) => tile(x, 'BEST', [[valText(best), pnlCol(valOf(best))]], m),
          (x, m) => tile(x, 'WORST', [[valText(worst), pnlCol(valOf(worst))]], m),
        );
      }
      if (!hide) {
        if (closed.length === 1) boxes.push((x, m) => tradeTile(x, 'THE TRADE', closed[0], m));
        for (const t of open) boxes.push((x, m) => tradeTile(x, 'OPEN NOW', t, m));
      }
      row(boxes);
    } else if (style === 'latest') {
      // the newest that fit (three at most), oldest on the left; the ones left out as "+N earlier" before them
      const widths = all.map((t) => chip(0, t, true));
      const moreW = (m) => (m ? textChip(0, [[`+${m} earlier`, T.muted]], true) + ROW_GAP : 0);
      const fits = (k) =>
        moreW(all.length - k) + widths.slice(-k).reduce((a, w) => a + w + ROW_GAP, -ROW_GAP) <= ROW_X1 - L;
      let k = Math.min(3, all.length);
      while (k > 1 && !fits(k)) k--;
      const more = all.length - k;
      caption([
        [more ? `LAST ${k} OF ${all.length}` : plural(all.length, 'trade').toUpperCase(), true],
        SEP,
        ...sizeParts,
      ]);
      let x = L;
      if (more) x += textChip(x, [[`+${more} earlier`, T.muted]]) + ROW_GAP;
      for (const t of all.slice(-k)) x += chip(x, t) + ROW_GAP;
    } else if (style === 'mix') {
      // the latest trade (the open one, if any), then the day in one chip
      const last = all[all.length - 1];
      caption([[last.open ? 'OPEN NOW' : 'LAST TRADE', true], SEP, ...sizeParts]);
      const parts = [
        [plural(closed.length, 'trade'), T.text],
        [' · ', T.dim],
        [`${won}W `, T.text],
        [`${lost}L`, T.muted],
      ];
      if (open.length && !last.open) parts.push([' · ', T.dim], [`${open.length} open`, T.muted]);
      row([(x, m) => chip(x, last, m), (x, m) => textChip(x, parts, m)]);
    }
    // None: nothing
  }
  function drawCard(cv, d, hide) {
    const ctx = cv.getContext('2d');
    cv.width = CARD_W * CARD_SCALE;
    cv.height = CARD_H * CARD_SCALE;
    ctx.setTransform(CARD_SCALE, 0, 0, CARD_SCALE, 0, 0);
    const T = {
      bg: '#0c0c0d',
      text: '#f0f0f1',
      muted: '#a1a1a8',
      dim: '#6b6b73',
      lime: '#c8f542',
      red: '#ff5a4f',
      ink: '#0c0c0d',
    };
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    const glow = ctx.createRadialGradient(180, 300, 0, 180, 300, 320);
    glow.addColorStop(0, 'rgba(200, 245, 66, 0.09)');
    glow.addColorStop(1, 'rgba(200, 245, 66, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    drawAscii(ctx, 650, -6, 56, 27);
    const L = 52,
      R = CARD_W - 52;
    // the day's curve (combined equity from the day's start), bottom right; with no trade row (None), the full width
    const wide = d.style === 'none';
    if (d.curve) {
      const pts = d.curve.map(([t, v]) => [t, v - d.curve[0][1]]);
      const t0 = pts[0][0],
        t1 = pts[pts.length - 1][0] || t0 + 1;
      const vals = pts.map((p) => p[1]),
        lo = Math.min(0, ...vals),
        hi = Math.max(0, ...vals) || 1;
      const x0 = wide ? L : 720,
        x1 = R,
        top = wide ? 400 : 378,
        bot = 538;
      const X = (t) => x0 + ((t - t0) / (t1 - t0 || 1)) * (x1 - x0),
        Y = (v) => top + (1 - (v - lo) / (hi - lo || 1)) * (bot - top);
      const up = vals[vals.length - 1] >= 0,
        col = up ? T.lime : T.red;
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.moveTo(x0, Y(0));
      ctx.lineTo(x1, Y(0));
      ctx.stroke();
      ctx.restore();
      const path = new Path2D();
      pts.forEach(([t, v], i) => (i ? path.lineTo(X(t), Y(v)) : path.moveTo(X(t), Y(v))));
      if (!hide) {
        const area = new Path2D(path);
        area.lineTo(x1, bot);
        area.lineTo(x0, bot);
        area.closePath();
        const fade = ctx.createLinearGradient(0, top, 0, bot);
        fade.addColorStop(0, up ? 'rgba(200,245,66,0.18)' : 'rgba(255,90,79,0.16)');
        fade.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fade;
        ctx.fill(area);
      }
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.shadowColor = up ? 'rgba(200,245,66,0.5)' : 'rgba(255,90,79,0.45)';
      ctx.shadowBlur = 8;
      ctx.stroke(path);
      ctx.restore();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(X(t1), Y(vals[vals.length - 1]), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `400 12px ${CF.mono}`;
      ctx.fillStyle = T.dim;
      ctx.textAlign = 'left';
      ctx.fillText(etStamp(t0 < 1e12 ? t0 * 1000 : t0).slice(-8, -3), x0, bot + 18);
      ctx.textAlign = 'right';
      ctx.fillText(etStamp(d.at).slice(-8, -3), x1, bot + 18);
      ctx.textAlign = 'left';
    }
    // top: the lockup, then the date and source on the right
    ctx.textBaseline = 'alphabetic';
    const wEnd = drawLockup(ctx, L, 40, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(wEnd + 14, 44, 1, 20);
    ctx.font = `500 13px ${CF.mono}`;
    ctx.fillStyle = T.dim;
    ctx.letterSpacing = '2.3px';
    ctx.fillText('COPIER', wEnd + 28, 59);
    ctx.letterSpacing = '0px';
    ctx.textAlign = 'right';
    ctx.font = `500 14px ${CF.mono}`;
    ctx.fillStyle = T.muted;
    ctx.fillText(etStamp(d.at), R, 52);
    ctx.fillText('from Vest', R, 71);
    const fw = ctx.measureText('from Vest').width;
    ctx.fillStyle = T.lime;
    ctx.fillText('✓', R - fw - 8, 71);
    ctx.textAlign = 'left';
    // the tag, the number and the line under it
    const tag = d.hasDay ? (hide ? '[Today · amounts hidden' : "[Today's P&L") : '[Total P&L';
    ctx.font = `500 16px ${CF.mono}`;
    ctx.fillStyle = T.lime;
    ctx.fillText(`${tag}${d.name ? ' · @' + d.name.replace(/^@/, '') : ''}]`, L, 146);
    const neg = hide ? d.pct < 0 : d.total < 0;
    const big = hide
      ? d.pct == null
        ? '—'
        : `${d.pct < 0 ? '−' : '+'}${Math.abs(d.pct * 100).toFixed(2)}%`
      : sp(d.total);
    const zero = hide ? !d.pct : Math.abs(d.total) < 0.005;
    ctx.fillStyle = zero ? T.text : neg ? T.red : T.lime;
    let size = 168;
    const bigFont = () => `500 condensed ${size}px ${CF.display}`; // Instrument Sans at width 75, as the wordmark
    ctx.font = bigFont();
    while (ctx.measureText(big).width > 640 && size > 90) {
      size -= 6;
      ctx.font = bigFont();
    }
    ctx.fillText(big, L - 4, 146 + 16 + size * 0.92);
    const n = d.accounts.length;
    const sans = (w) => `${w} 22px ${CF.sans}`;
    const parts = [
      ['across ', T.muted, sans(400)],
      [`${n} account${n === 1 ? '' : 's'}`, T.text, sans(500)],
    ];
    if (d.copies || d.missed) {
      parts.push(
        [' · ', T.muted, sans(400)],
        [`${d.copies}${d.complete ? '' : '+'} copies, ${d.missed} missed`, T.muted, sans(400)],
      );
    }
    if (d.slip != null) {
      parts.push(
        [' · fills ', T.muted, sans(400)],
        [`avg ${d.slip.toFixed(2)} pts`, T.text, sans(500)],
        [' from the master', T.muted, sans(400)],
      );
    }
    runs(ctx, L, 146 + 16 + size * 0.92 + 44, parts);
    // bottom left: the day's trades in the style picked in Share (`drawTradeRow`); no account numbers on any card, ever
    // (owner, 2026-10-14), so with no trades yet it stays empty. Bottom right: the code and the site.
    if (d.trades.length) drawTradeRow(ctx, d, hide, L, T);
    ctx.textAlign = 'right';
    ctx.font = `500 14px ${CF.mono}`;
    ctx.fillStyle = T.dim;
    ctx.fillText('Free copier · stratuh.com', R, CARD_H - 40);
    if (d.code) {
      ctx.font = `700 15px ${CF.mono}`;
      ctx.letterSpacing = '2.4px';
      const cw = ctx.measureText(SUPPORT_CODE).width + 28;
      ctx.font = `500 12px ${CF.mono}`;
      ctx.letterSpacing = '1px';
      const lw = ctx.measureText('VEST CODE').width + 24;
      const bx = R - cw - lw,
        by = CARD_H - 40 - 22 - 34;
      ctx.strokeStyle = 'rgba(200,245,66,0.45)';
      ctx.strokeRect(bx + 0.5, by + 0.5, cw + lw - 1, 33);
      ctx.fillStyle = T.lime;
      ctx.fillRect(bx + lw, by, cw, 34);
      ctx.textAlign = 'left';
      ctx.fillStyle = T.dim;
      ctx.fillText('VEST CODE', bx + 12, by + 22);
      ctx.font = `700 15px ${CF.mono}`;
      ctx.letterSpacing = '2.4px';
      ctx.fillStyle = T.ink;
      ctx.fillText(SUPPORT_CODE, bx + lw + 14, by + 23);
      ctx.letterSpacing = '0px';
    }
    ctx.textAlign = 'left';
  }
  // ── The One trade card (1080 × 1080, drawn at 2×): side, size and entry; the total and how many accounts were in it;
  // each exit with its price and points; the trade's timeline. Amounts hidden: points instead of dollars.
  const TRADE_W = 1080;
  function drawTradeCard(cv, g, det, o) {
    const ctx = cv.getContext('2d');
    cv.width = cv.height = TRADE_W * CARD_SCALE;
    ctx.setTransform(CARD_SCALE, 0, 0, CARD_SCALE, 0, 0);
    const T = {
      bg: '#0c0c0d',
      text: '#f0f0f1',
      muted: '#a1a1a8',
      dim: '#6b6b73',
      lime: '#c8f542',
      red: '#ff5a4f',
      ink: '#0c0c0d',
    };
    const W = TRADE_W,
      L = 60,
      R = W - 60,
      p = g.lead,
      tick = (SYMBOLS[p.symbol] || {}).tick || 0.25,
      n = g.items.length;
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, W, W);
    const glow = ctx.createRadialGradient(W - 160, 300, 0, W - 160, 300, 420);
    glow.addColorStop(0, 'rgba(200, 245, 66, 0.07)');
    glow.addColorStop(1, 'rgba(200, 245, 66, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, W);
    drawAscii(ctx, -10, 760, 110, 26);
    ctx.textBaseline = 'alphabetic';
    // top: the lockup; the date, the trade's open and close times, and the source
    const wEnd = drawLockup(ctx, L, 58, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(wEnd + 14, 62, 1, 20);
    ctx.font = `500 13px ${CF.mono}`;
    ctx.fillStyle = T.dim;
    ctx.letterSpacing = '2.3px';
    ctx.fillText('COPIER', wEnd + 28, 77);
    ctx.letterSpacing = '0px';
    const day = etStamp(g.openedAt).replace(/ · .*$/, ''),
      t0 = etStamp(g.openedAt).slice(-8, -3),
      t1 = etStamp(g.closedAt).slice(-8, -3);
    ctx.textAlign = 'right';
    ctx.font = `500 14px ${CF.mono}`;
    ctx.fillStyle = T.muted;
    ctx.fillText(`${day} · ${t0}${t1 !== t0 ? ' – ' + t1 : ''} ET`, R, 70);
    ctx.fillText('from Vest', R, 90);
    const fw = ctx.measureText('from Vest').width;
    ctx.fillStyle = T.lime;
    ctx.fillText('✓', R - fw - 8, 90);
    ctx.textAlign = 'left';
    // the tag, the side, size and entry
    ctx.font = `500 16px ${CF.mono}`;
    ctx.fillStyle = T.lime;
    ctx.fillText(`[One trade${o.name ? ' · @' + o.name.replace(/^@/, '') : ''}]`, L, 172);
    const side = p.side === 'long' ? 'LONG' : 'SHORT';
    ctx.font = `700 19px ${CF.mono}`;
    ctx.letterSpacing = '1.5px';
    const pw = ctx.measureText(side).width + 30;
    ctx.fillStyle = p.side === 'long' ? T.lime : T.text;
    ctx.fillRect(L, 198, pw, 40);
    ctx.fillStyle = T.ink;
    ctx.fillText(side, L + 15, 225);
    ctx.letterSpacing = '0px';
    const entry = (det && det.entry) || p.open;
    ctx.font = `400 30px ${CF.mono}`;
    ctx.fillStyle = T.text;
    ctx.fillText(
      `${p.qty > 0 ? fmtQty(p.qty, p.symbol) + ' ' : ''}${symLabel(p.symbol)}${entry > 0 ? ' @ ' + fmtPx(entry, tick) : ''}`,
      L + pw + 18,
      229,
    );
    // the total and how many accounts; amounts hidden: the points instead
    const dir = p.side === 'long' ? 1 : -1;
    const pts = p.close > 0 && entry > 0 ? dir * (p.close - entry) : null;
    const big = o.hide
      ? pts == null
        ? '—'
        : `${pts < 0 ? '−' : '+'}${fmtNum(Math.abs(pts), decimalsOf(tick))} pts`
      : sp(g.pnl);
    const val = o.hide ? pts || 0 : g.pnl;
    let size = 132;
    const font = () => `500 condensed ${size}px ${CF.display}`;
    ctx.font = font();
    while (ctx.measureText(big).width > R - L && size > 70) {
      size -= 6;
      ctx.font = font();
    }
    ctx.fillStyle = Math.abs(val) < 0.005 ? T.text : val > 0 ? T.lime : T.red;
    ctx.fillText(big, L - 4, 250 + size * 0.95);
    ctx.font = `500 condensed 120px ${CF.display}`;
    ctx.fillStyle = T.text;
    ctx.fillText(`on ${n} account${n === 1 ? '' : 's'}.`, L - 4, 250 + size * 0.95 + 112);
    // the line under it: what each account made (when they match), and the copy
    const base = 250 + size * 0.95 + 112 + 62;
    const pnls = g.items.map((x) => x.pnl),
      lo = Math.min(...pnls),
      hi = Math.max(...pnls);
    const parts = [];
    if (!o.hide && n > 1)
      parts.push(
        hi - lo <= Math.max(1, Math.abs(hi) * 0.01)
          ? [
              [sp(p.pnl), T.text, 500],
              [' each', T.muted, 400],
            ]
          : [
              [`${sp(lo)} to ${sp(hi)}`, T.text, 500],
              [' per account', T.muted, 400],
            ],
      );
    if (n > 1) parts.push([[`copied to ${n - 1} follower${n - 1 === 1 ? '' : 's'}`, T.muted, 400]]);
    let lx = L;
    parts.forEach((pp, i) => {
      if (i) lx = runs(ctx, lx, base, [[' · ', T.muted, `400 22px ${CF.sans}`]]);
      lx = runs(
        ctx,
        lx,
        base,
        pp.map(([t, c, w]) => [t, c, `${w} 22px ${CF.sans}`]),
      );
    });
    // the exits: each with its price, points (a bar) and what one account made
    const exits = ((det && det.exits) || []).slice(0, 4);
    let y = base + 60;
    if (exits.length) {
      ctx.font = `500 12px ${CF.mono}`;
      ctx.fillStyle = T.dim;
      ctx.letterSpacing = '1.8px';
      ctx.fillText('EXIT', L, y);
      ctx.fillText('PRICE', L + 170, y);
      ctx.fillText('POINTS', L + 355, y);
      ctx.textAlign = 'right';
      if (!o.hide) ctx.fillText(n > 1 && hi - lo > Math.max(1, Math.abs(hi) * 0.01) ? 'MASTER' : 'EACH', R, y);
      ctx.textAlign = 'left';
      ctx.letterSpacing = '0px';
      const maxPts = Math.max(...exits.map((x) => Math.abs(x.pts)), tick);
      y += 40;
      for (const x of exits) {
        const col =
          x.kind.startsWith('TP') || x.kind === 'VEST' ? T.lime : x.kind === 'SL' || x.kind === 'LIQ' ? T.red : T.muted;
        ctx.font = `600 16px ${CF.mono}`;
        ctx.fillStyle = col;
        ctx.fillText(`${x.kind === 'VEST' ? 'TARGET' : x.kind} · ${fmtQty(x.qty, p.symbol)}`, L, y);
        ctx.font = `400 18px ${CF.mono}`;
        ctx.fillStyle = T.muted;
        ctx.fillText(fmtPx(x.price, tick), L + 170, y);
        const bx = L + 355,
          bw = o.hide ? R - 120 - bx : R - 260 - bx;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(bx, y - 12, bw, 10);
        ctx.fillStyle = x.pts >= 0 ? T.lime : T.red;
        ctx.fillRect(bx, y - 12, Math.max(0, (Math.abs(x.pts) / maxPts) * bw), 10);
        ctx.textAlign = 'right';
        ctx.font = `500 18px ${CF.mono}`;
        ctx.fillStyle = T.text;
        ctx.fillText(
          `${x.pts > 0 ? '+' : x.pts < 0 ? '−' : ''}${fmtNum(Math.abs(x.pts), decimalsOf(tick))}`,
          o.hide ? R : R - 140,
          y,
        );
        if (!o.hide) {
          ctx.fillStyle = Math.abs(x.usd) < 0.005 ? T.text : x.usd > 0 ? T.lime : T.red;
          ctx.fillText(Math.abs(x.usd) < 0.005 ? '$0' : sp(x.usd), R, y);
        }
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(L, y + 18, R - L, 1);
        y += 50;
      }
    }
    // the timeline: up to five moments, first and last always
    let ev = (det && det.events) || [];
    if (ev.length > 5)
      ev = [
        ev[0],
        ...ev
          .slice(1, -1)
          .filter((e) => e.hot)
          .slice(0, 3),
        ev[ev.length - 1],
      ].slice(0, 5);
    if (ev.length > 1) {
      const ty = Math.max(y + 30, 840),
        step = (R - L - 120) / (ev.length - 1);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(L + 8, ty, step * (ev.length - 1), 2);
      ev.forEach((e, i) => {
        const x = L + 8 + i * step;
        ctx.beginPath();
        ctx.arc(x, ty + 1, 8, 0, Math.PI * 2);
        ctx.fillStyle = T.bg;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = e.hot ? T.lime : T.muted;
        ctx.stroke();
        ctx.font = `600 16px ${CF.mono}`;
        ctx.fillStyle = T.text;
        ctx.fillText(new Date(e.at).toLocaleTimeString('en-GB', { timeZone: ET_TZ, hour12: false }), x - 8, ty + 38);
        ctx.font = `400 16px ${CF.sans}`;
        ctx.fillStyle = T.muted;
        // short lines, kept inside the card
        const words = e.text.split(' '),
          maxW = Math.min(step - 12, ev.length <= 3 ? 320 : 170, R - (x - 8));
        let line = '',
          ly = ty + 62;
        for (const w of words) {
          const tryLine = line ? line + ' ' + w : w;
          if (ctx.measureText(tryLine).width > maxW && line) {
            ctx.fillText(line, x - 8, ly);
            line = w;
            ly += 20;
          } else line = tryLine;
        }
        if (line) ctx.fillText(line, x - 8, ly);
      });
    }
    // bottom: the site and the code
    ctx.font = `500 15px ${CF.mono}`;
    ctx.fillStyle = T.dim;
    ctx.fillText(g.copied ? 'Copied on Vest · free at stratuh.com' : 'Traded on Vest · stratuh.com', L, W - 56);
    if (o.code) {
      ctx.font = `700 15px ${CF.mono}`;
      ctx.letterSpacing = '2.4px';
      const cw = ctx.measureText(SUPPORT_CODE).width + 28;
      ctx.font = `500 12px ${CF.mono}`;
      ctx.letterSpacing = '1px';
      const lw = ctx.measureText('VEST CODE').width + 24;
      const bx = R - cw - lw,
        by = W - 56 - 22;
      ctx.strokeStyle = 'rgba(200,245,66,0.45)';
      ctx.strokeRect(bx + 0.5, by + 0.5, cw + lw - 1, 33);
      ctx.fillStyle = T.lime;
      ctx.fillRect(bx + lw, by, cw, 34);
      ctx.fillStyle = T.dim;
      ctx.fillText('VEST CODE', bx + 12, by + 22);
      ctx.font = `700 15px ${CF.mono}`;
      ctx.letterSpacing = '2.4px';
      ctx.fillStyle = T.ink;
      ctx.fillText(SUPPORT_CODE, bx + lw + 14, by + 23);
      ctx.letterSpacing = '0px';
    }
  }
  // ── Payouts: everything Vest has paid into the Primary Account from the funded and instant accounts, for the Payouts
  // card. The same list as Vest's own payout history: GET /v3/capital/withdrawals with the login and no account = every
  // account's claims, closed and failed accounts included, newest first, paged by `cursor` / `next`. A payout counts
  // once EXECUTED, at `trader_amount` (what landed after Vest's split), dated by `created_at` (the claim, as Vest lists
  // it); PROCESSING is kept apart and never added in; REFUNDED and FAILED are left out. Read when the Payouts tab opens,
  // cached like the trade history. Read-only.
  const PAYOUT_PAGE = 200,
    PAYOUT_PAGES = 25;
  S.payoutHist = null; // { at, payouts: [{ at, acct, amount }] oldest first, processing: [...], error }
  let _payBusy = null;
  function loadPayouts(force = false) {
    if (_payBusy) return _payBusy;
    if (!force && S.payoutHist && !S.payoutHist.error && Date.now() - S.payoutHist.at < HIST_TTL_MS)
      return Promise.resolve(S.payoutHist);
    _payBusy = (async () => {
      const payouts = [],
        processing = [],
        statuses = {};
      try {
        let cursor = null,
          pages = 0;
        do {
          const r = await api(
            `/v3/capital/withdrawals?limit=${PAYOUT_PAGE}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
          );
          for (const w of (r && r.withdrawals) || []) {
            const st = String(w.status || '').toUpperCase();
            statuses[st] = (statuses[st] || 0) + 1;
            const p = {
              at: msOf(w.created_at ?? w.createdAt),
              acct: w.account_id ?? w.accountId ?? null,
              amount: num(w.trader_amount ?? w.traderAmount),
            };
            if (!p.at || !(p.amount > 0)) continue;
            if (st === 'EXECUTED') payouts.push(p);
            else if (st === 'PROCESSING') processing.push(p);
          }
          cursor = r && r.next;
        } while (cursor && ++pages < PAYOUT_PAGES);
        const byAt = (a, b) => a.at - b.at;
        S.payoutHist = { at: Date.now(), payouts: payouts.sort(byAt), processing: processing.sort(byAt) };
        diag('payout_card', {
          outcome: 'read',
          payouts: payouts.length,
          processing: processing.length,
          statuses,
          more: !!cursor,
        });
      } catch (e) {
        S.payoutHist = { at: Date.now(), payouts: [], processing: [], error: e.message };
        diag('payout_card', { outcome: 'error', error: e.message });
      } finally {
        _payBusy = null;
      }
      if (S.shareOpen) render();
      return S.payoutHist;
    })();
    return _payBusy;
  }
  // What the Payouts card shows, from the list: the total, the counts, the biggest, the first and latest, and what's
  // still processing. null until a payout has been made (a first one still processing included: the sheet says so).
  function payoutSummary(h) {
    if (!h || h.error || !h.payouts.length) return null;
    const ps = h.payouts;
    return {
      payouts: ps,
      processing: h.processing,
      total: ps.reduce((a, p) => a + p.amount, 0),
      pending: h.processing.reduce((a, p) => a + p.amount, 0),
      count: ps.length,
      accts: new Set(ps.map((p) => p.acct)).size,
      biggest: ps.reduce((a, p) => (p.amount > a.amount ? p : a)),
      first: ps[0].at,
      latest: ps[ps.length - 1].at,
      period: 'All time',
      asOf: Date.now(),
    };
  }
  // ── The Payouts card (1080 × 1080, drawn at 2×; design: docs/redesign/payouts-card/, C, picked 2026-10-14): the total
  // all time, where it came from, what's still processing; the last 8 weeks as bars (Monday to Sunday ET, this week on
  // the right, the best week lime, a quiet week a stub, weeks before the first payout empty); the biggest payout ever;
  // the counts as tiles. No account numbers on it, ever.
  const ET_MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const etParts = (t, o) => {
    const p = {};
    for (const x of new Intl.DateTimeFormat('en-GB', { timeZone: ET_TZ, ...o }).formatToParts(new Date(t)))
      p[x.type] = x.value;
    return p;
  };
  const etDayMon = (t) => {
    const p = etParts(t, { day: 'numeric', month: 'numeric' });
    return `${+p.day} ${ET_MON[p.month - 1]}`;
  };
  const etYear = (t) => etParts(t, { year: 'numeric' }).year;
  const etDayYear = (t) => `${etDayMon(t)} ${etYear(t)}`;
  // the day number of a time's ET calendar date, and of the Monday of its week
  const etDayNo = (t) => {
    const p = etParts(t, { year: 'numeric', month: 'numeric', day: 'numeric' });
    return Date.UTC(+p.year, +p.month - 1, +p.day) / 864e5;
  };
  const etMonday = (t) => {
    const d = etDayNo(t);
    return d - ((new Date(d * 864e5).getUTCDay() + 6) % 7);
  };
  const PAYOUT_WEEKS = 8;
  // The card's weeks, oldest first, this week last: { w: its Monday's day number, sum: paid, pend: still processing,
  // before: a week before the first payout (drawn empty) }
  function payoutWeeks(h) {
    const now = etMonday(h.asOf),
      firstWk = etMonday(h.first);
    const weeks = Array.from({ length: PAYOUT_WEEKS }, (_, i) => {
      const w = now - 7 * (PAYOUT_WEEKS - 1 - i);
      return { w, sum: 0, pend: 0, before: w < firstWk };
    });
    for (const [list, key] of [
      [h.payouts, 'sum'],
      [h.processing, 'pend'],
    ])
      for (const p of list) {
        const wk = weeks.find((x) => x.w === etMonday(p.at));
        if (wk) wk[key] += p.amount;
      }
    return weeks;
  }
  function drawPayoutCard(cv, h, o) {
    const ctx = cv.getContext('2d');
    cv.width = cv.height = TRADE_W * CARD_SCALE;
    ctx.setTransform(CARD_SCALE, 0, 0, CARD_SCALE, 0, 0);
    const T = { bg: '#0c0c0d', text: '#f0f0f1', muted: '#a1a1a8', dim: '#6b6b73', lime: '#c8f542', ink: '#0c0c0d' };
    const W = TRADE_W,
      L = 60,
      R = W - 60;
    const usd = (n, cents = true) =>
      '$' + n.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
    const spaced = (t, x, y, color, font = `500 13px ${CF.mono}`, ls = '1.8px') => {
      ctx.font = font;
      ctx.letterSpacing = ls;
      ctx.fillStyle = color;
      ctx.fillText(t, x, y);
      ctx.letterSpacing = '0px';
    };
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, W, W);
    const glow = ctx.createRadialGradient(W - 160, 300, 0, W - 160, 300, 420);
    glow.addColorStop(0, 'rgba(200, 245, 66, 0.09)');
    glow.addColorStop(1, 'rgba(200, 245, 66, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, W);
    drawAscii(ctx, -10, 860, 110, 19);
    // top: the lockup, then the "as of" stamp and the source
    ctx.textBaseline = 'alphabetic';
    const wEnd = drawLockup(ctx, L, 58, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.fillRect(wEnd + 14, 62, 1, 20);
    spaced('COPIER', wEnd + 28, 77, T.dim, `500 13px ${CF.mono}`, '2.3px');
    ctx.textAlign = 'right';
    ctx.font = `500 14px ${CF.mono}`;
    ctx.fillStyle = T.muted;
    ctx.fillText(etStamp(h.asOf), R, 70);
    ctx.fillText('from Vest', R, 89);
    const fw = ctx.measureText('from Vest').width;
    ctx.fillStyle = T.lime;
    ctx.fillText('✓', R - fw - 8, 89);
    ctx.textAlign = 'left';
    // the tag (the period sits in it), the total as big as fits, where it came from, what's still processing
    ctx.font = `500 16px ${CF.mono}`;
    ctx.fillStyle = T.lime;
    ctx.fillText(`[Payouts · ${h.period}${o.name ? ' · @' + o.name.replace(/^@/, '') : ''}]`, L, 172);
    const big = usd(h.total);
    let size = 168;
    const bigFont = () => `500 condensed ${size}px ${CF.display}`;
    ctx.font = bigFont();
    while (ctx.measureText(big).width > R - L && size > 80) {
      size -= 6;
      ctx.font = bigFont();
    }
    ctx.fillStyle = T.lime;
    const base = 194 + size * 0.92;
    ctx.fillText(big, L - 4, base);
    const sans = (w) => `${w} 24px ${CF.sans}`;
    runs(ctx, L, base + 50, [
      ['paid out from ', T.muted, sans(400)],
      [plural(h.accts, 'account'), T.text, sans(500)],
      [' · ', T.muted, sans(400)],
      [plural(h.count, 'payout'), T.text, sans(500)],
    ]);
    if (h.pending)
      runs(ctx, L, base + 86, [
        ['+ ', T.dim, `500 15px ${CF.mono}`],
        [usd(h.pending), T.muted],
        [' still processing, not in the total', T.dim],
      ]);
    // the last 8 weeks: a bar per week with payouts (its amount on top, the best lime), a stub for a quiet week since
    // the first payout, nothing before it; what's processing a dashed box on its week, never part of the bar
    const weeks = payoutWeeks(h);
    const best = weeks.reduce((a, b) => (b.sum > a.sum ? b : a));
    const capY = 520,
      top = 600,
      bot = 830,
      gap = 16;
    spaced(`LAST ${PAYOUT_WEEKS} WEEKS`, L, capY, T.muted);
    if (h.count > 1) {
      ctx.textAlign = 'right';
      const when = etYear(h.biggest.at) === etYear(h.asOf) ? etDayMon(h.biggest.at) : etDayYear(h.biggest.at);
      spaced(`BIGGEST PAYOUT ${usd(h.biggest.amount)} · ${when}`, R, capY, T.dim);
      ctx.textAlign = 'left';
    }
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(L, bot + 0.5);
    ctx.lineTo(R, bot + 0.5);
    ctx.stroke();
    ctx.restore();
    const bw = (R - L - gap * (PAYOUT_WEEKS - 1)) / PAYOUT_WEEKS;
    const mx = Math.max(...weeks.map((x) => x.sum + x.pend)) || 1;
    weeks.forEach((wk, i) => {
      const x = L + i * (bw + gap),
        isBest = wk === best && wk.sum > 0;
      if (!wk.before || wk.pend) {
        const bh = wk.sum ? Math.max(3, (wk.sum / mx) * (bot - top)) : 2;
        ctx.fillStyle = isBest ? T.lime : wk.sum ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.09)';
        ctx.fillRect(x, bot - bh, bw, bh);
        if (isBest) {
          ctx.save();
          ctx.shadowColor = 'rgba(200,245,66,0.45)';
          ctx.shadowBlur = 18;
          ctx.fillRect(x, bot - bh, bw, 2);
          ctx.restore();
        }
        let labelY = bot - bh - 12;
        if (wk.pend) {
          const ph = (wk.pend / mx) * (bot - top),
            py = bot - (wk.sum ? bh : 0) - ph;
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(240,240,241,0.35)';
          ctx.strokeRect(x + 0.5, py + 0.5, bw - 1, ph - 1);
          ctx.restore();
          ctx.font = `500 13px ${CF.mono}`;
          ctx.fillStyle = T.dim;
          ctx.textAlign = 'center';
          ctx.fillText('+' + usd(Math.round(wk.pend), false), x + bw / 2, py + ph / 2 + 5);
          ctx.textAlign = 'left';
          labelY = py - 12;
        }
        if (wk.sum) {
          ctx.font = `500 14px ${CF.mono}`;
          ctx.fillStyle = isBest ? T.lime : T.muted;
          ctx.textAlign = 'center';
          ctx.fillText(usd(Math.round(wk.sum), false), x + bw / 2, labelY);
          ctx.textAlign = 'left';
        }
      }
      // under each bar its Monday, from the calendar date (read in UTC, as it was built), the last one THIS WEEK
      ctx.font = `500 13px ${CF.mono}`;
      ctx.fillStyle = i === PAYOUT_WEEKS - 1 ? T.muted : T.dim;
      ctx.textAlign = 'center';
      const d = new Date(wk.w * 864e5);
      ctx.fillText(
        i === PAYOUT_WEEKS - 1 ? 'THIS WEEK' : `${d.getUTCDate()} ${ET_MON[d.getUTCMonth()]}`,
        x + bw / 2,
        bot + 28,
      );
      ctx.textAlign = 'left';
    });
    // bottom left: the counts as tiles (one payout: its date instead of "since")
    const tiles = [
      ['PAYOUTS', String(h.count)],
      ['ACCOUNTS', String(h.accts)],
      [h.count === 1 ? 'PAID' : 'SINCE', etDayYear(h.first)],
    ];
    let tx = L;
    const ty = W - 60 - 66;
    for (const [label, value] of tiles) {
      ctx.font = `500 11px ${CF.mono}`;
      ctx.letterSpacing = '1.5px';
      const lw = ctx.measureText(label).width;
      ctx.letterSpacing = '0px';
      ctx.font = `500 20px ${CF.mono}`;
      const w = Math.max(112, 32 + Math.max(lw, ctx.measureText(value).width));
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(tx, ty, w, 66);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.strokeRect(tx + 0.5, ty + 0.5, w - 1, 65);
      spaced(label, tx + 16, ty + 24, T.dim, `500 11px ${CF.mono}`, '1.5px');
      ctx.font = `500 20px ${CF.mono}`;
      ctx.fillStyle = T.text;
      ctx.fillText(value, tx + 16, ty + 51);
      tx += w + 12;
    }
    // bottom right: the site, and the code box above it
    ctx.textAlign = 'right';
    ctx.font = `500 14px ${CF.mono}`;
    ctx.fillStyle = T.dim;
    ctx.fillText('Free copier · stratuh.com', R, W - 60);
    ctx.textAlign = 'left';
    if (o.code) {
      ctx.font = `700 15px ${CF.mono}`;
      ctx.letterSpacing = '2.4px';
      const cw = ctx.measureText(SUPPORT_CODE).width + 28;
      ctx.font = `500 12px ${CF.mono}`;
      ctx.letterSpacing = '1px';
      const lw = ctx.measureText('VEST CODE').width + 24;
      const bx = R - cw - lw,
        by = W - 60 - 22 - 34;
      ctx.strokeStyle = 'rgba(200,245,66,0.45)';
      ctx.strokeRect(bx + 0.5, by + 0.5, cw + lw - 1, 33);
      ctx.fillStyle = T.lime;
      ctx.fillRect(bx + lw, by, cw, 34);
      ctx.fillStyle = T.dim;
      ctx.fillText('VEST CODE', bx + 12, by + 22);
      ctx.font = `700 15px ${CF.mono}`;
      ctx.letterSpacing = '2.4px';
      ctx.fillStyle = T.ink;
      ctx.fillText(SUPPORT_CODE, bx + lw + 14, by + 23);
      ctx.letterSpacing = '0px';
    }
  }
  const ymd = (t) => new Date(t).toISOString().slice(0, 10);
  const cardFile = () => {
    if (S.share && S.share.kind === 'payouts') return `stratuh-payouts-${ymd(Date.now())}.png`;
    const g = S.share && S.share.kind === 'trade' && shareTrade();
    return g
      ? `stratuh-trade-${ymd(g.closedAt)}-${new Date(g.closedAt).toTimeString().slice(0, 5).replace(':', '')}.png`
      : `stratuh-today-${ymd(Date.now())}.png`;
  };
  function saveCard(cv) {
    const name = cardFile();
    cv.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob),
        a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }
  // The trades the One trade list offers: profitable ones, newest first (a copied trade once, its P&L summed)
  // (Latest: newest first; Most profitable: the biggest total first)
  const shareTrades = () => {
    const list = ((S.hist && S.hist.trades) || []).filter((g) => g.pnl > 0);
    return S.share && S.share.sort === 'best'
      ? [...list].sort((a, b) => b.pnl - a.pnl || b.closedAt - a.closedAt)
      : list;
  };
  const shareTrade = () => {
    const list = shareTrades();
    return list.find((g) => g.key === S.share.trade) || list[0] || null;
  };
  // The Share sheet: Today, One trade or Payouts, the picture as it will be copied, its options, Copy image and Save PNG.
  // Built once (the name being typed survives the panel's refreshes); the picture is redrawn when its data or an option
  // changes. One trade lists the profitable trades of the last 30 days from Vest's position history; Payouts shows
  // only the name and the code. No account numbers on any card (owner, 2026-10-14), so nothing to hide there.
  function renderShare(body) {
    if (!S.share) {
      const o = store.get(SHARE_OPTS_KEY, {}) || {};
      S.share = {
        hide: o.hide === true,
        code: o.code !== false,
        sort: o.sort === 'best' ? 'best' : 'latest',
        style: SHARE_STYLES.some(([k]) => k === o.style) ? o.style : 'summary',
        kind: 'day',
        trade: null,
      };
      if ('nums' in o) saveShareOpts(); // the old Hide account numbers switch (until v0.40.3): dropped from what's saved
    }
    ensureDay();
    loadHistory(); // the day's trades (chips) and the One trade list
    if (!(body.dataset.view === 'share' && body.querySelector('.share'))) {
      body.dataset.view = 'share';
      const opt = (key, name, short, on) =>
        `<div class="opt" data-shopt="${key}"><div class="opt-txt"><div class="opt-name">${name}</div><div class="opt-short">${short}</div></div>
          <button class="switch ${on ? 'on' : ''}" data-sh="${key}" role="switch" aria-checked="${on}" aria-label="${name}"><span class="knob"></span></button></div>`;
      body.innerHTML = `
        <div class="share">
          <div class="tabseg" role="tablist"><button class="tab" role="tab" data-kind="day">Today</button><button class="tab" role="tab" data-kind="trade">One trade</button><button class="tab" role="tab" data-kind="payouts">Payouts</button></div>
          <div class="tabseg" id="sh-sort" role="tablist" aria-label="Order" hidden><button class="tab" role="tab" data-sort="latest">Latest</button><button class="tab" role="tab" data-sort="best">Most profitable</button></div>
          <div class="sh-list" id="sh-list" hidden></div>
          <div class="prev"><canvas id="sh-cv" width="${CARD_W}" height="${CARD_H}" aria-label="The picture to share"></canvas><div class="sh-empty" id="sh-empty" hidden></div></div>
          <div>
            <div class="opt" data-shopt="style"><div class="opt-txt"><div class="opt-name">Trades on the card</div><div class="opt-short" id="sh-style-short"></div></div>
              <div class="sh-dd"><button class="sh-ddb" id="sh-style" aria-haspopup="listbox" aria-expanded="false"><span></span>${ICON.down}</button>
              <div class="menu sh-ddm" id="sh-style-menu" role="listbox" aria-label="Trades on the card" hidden>${SHARE_STYLES.map(
                ([k, name]) =>
                  `<button class="mi" role="option" data-style="${k}"><span class="mt">${name}</span><span class="mk">${ICON.check}</span></button>`,
              ).join('')}</div></div></div>
            ${opt('hide', 'Hide amounts', 'Shows % gain (or points) instead of dollars.', S.share.hide)}
            <div class="opt"><div class="opt-txt"><div class="opt-name">Name on the card</div><div class="opt-short">Optional. Leave it empty to post without one.</div></div>
              <input class="tr-in sh-name" id="sh-name" maxlength="24" placeholder="@name" aria-label="Name on the card"></div>
            ${opt('code', `Add code ${SUPPORT_CODE}`, '5% off Vest for whoever sees it.', S.share.code)}
          </div>
          <div class="sh-btns"><button class="armbtn" id="sh-copy">${ICON.copy}<span>Copy image</span></button><button class="ghostbtn" id="sh-save">${ICON.save} Save PNG</button></div>
          <div class="hint" id="sh-hint"></div>
        </div>`;
      const nm = body.querySelector('#sh-name');
      nm.value = store.get(SHARE_NAME_KEY, '') || '';
      ['keydown', 'keyup', 'keypress'].forEach((ev) => nm.addEventListener(ev, (e) => e.stopPropagation()));
      nm.addEventListener('input', () => {
        store.set(SHARE_NAME_KEY, nm.value.trim());
        drawShare(body, true);
      });
      body.querySelectorAll('[data-sh]').forEach(
        (b) =>
          (b.onclick = () => {
            S.share[b.dataset.sh] = !S.share[b.dataset.sh];
            saveShareOpts();
            b.classList.toggle('on', S.share[b.dataset.sh]);
            b.setAttribute('aria-checked', String(S.share[b.dataset.sh]));
            drawShare(body, true);
          }),
      );
      body.querySelectorAll('[data-sort]').forEach(
        (b) =>
          (b.onclick = () => {
            if (!S.share.trade) S.share.trade = (shareTrade() || {}).key || null; // the picked trade stays picked
            S.share.sort = b.dataset.sort;
            saveShareOpts();
            renderShare(body);
          }),
      );
      body.querySelectorAll('[data-kind]').forEach(
        (b) =>
          (b.onclick = () => {
            S.share.kind = b.dataset.kind;
            if (S.share.kind === 'trade') loadHistory();
            if (S.share.kind === 'payouts') loadPayouts();
            renderShare(body);
          }),
      );
      const ddb = body.querySelector('#sh-style'),
        ddm = body.querySelector('#sh-style-menu');
      const showMenu = (on) => {
        ddm.hidden = !on;
        ddb.setAttribute('aria-expanded', String(on));
      };
      ddb.onclick = (e) => {
        e.stopPropagation();
        showMenu(ddm.hidden);
      };
      body.querySelectorAll('[data-style]').forEach(
        (b) =>
          (b.onclick = (e) => {
            e.stopPropagation();
            S.share.style = b.dataset.style;
            saveShareOpts();
            showMenu(false);
            renderShare(body);
            drawShare(body, true);
          }),
      );
      body.querySelector('.share').addEventListener('click', () => showMenu(false)); // a click anywhere else closes it
      const cv = body.querySelector('#sh-cv');
      body.querySelector('#sh-save').onclick = () => saveCard(cv);
      body.querySelector('#sh-copy').onclick = () => copyCard(body, cv);
      loadCardFonts().then(() => drawShare(body, true));
    }
    const trade = S.share.kind === 'trade',
      payouts = S.share.kind === 'payouts';
    if (payouts) loadPayouts(); // cached: re-read only once it's a few minutes old
    body.querySelectorAll('[data-kind]').forEach((b) => {
      b.classList.toggle('on', b.dataset.kind === S.share.kind);
      b.setAttribute('aria-selected', String(b.dataset.kind === S.share.kind));
    });
    body.querySelector('[data-shopt="style"]').hidden = S.share.kind !== 'day'; // Today only
    body.querySelector('[data-shopt="hide"]').hidden = payouts; // a payout card without amounts says nothing
    body.querySelector('#sh-hint').textContent = payouts
      ? 'Shows what Vest paid out. Never balances or logins.'
      : 'Shows P&L, sizes and prices only. Never balances, account ids or logins.';
    const style = SHARE_STYLES.find(([k]) => k === S.share.style) || SHARE_STYLES[0];
    body.querySelector('#sh-style span').textContent = style[1];
    body.querySelector('#sh-style-short').textContent = style[2];
    body.querySelectorAll('[data-style]').forEach((b) => {
      b.classList.toggle('on', b.dataset.style === style[0]);
      b.setAttribute('aria-selected', String(b.dataset.style === style[0]));
    });
    body.querySelector('#sh-sort').hidden = !trade;
    body.querySelectorAll('[data-sort]').forEach((b) => {
      b.classList.toggle('on', b.dataset.sort === S.share.sort);
      b.setAttribute('aria-selected', String(b.dataset.sort === S.share.sort));
    });
    renderShareList(body);
    drawShare(body, false);
  }
  // One trade: the list to pick from (the chosen one lifted). Rewritten only when it changes, so a click isn't lost.
  function renderShareList(body) {
    const box = body.querySelector('#sh-list'),
      trade = S.share.kind === 'trade';
    box.hidden = !trade;
    if (!trade) return;
    const list = shareTrades(),
      cur = shareTrade();
    const html = !S.hist
      ? '<div class="hint">Reading your trade history from Vest…</div>'
      : S.hist.error
        ? `<div class="hint">Couldn't read your trade history (${esc(S.hist.error)}).</div>`
        : !list.length
          ? `<div class="hint">No profitable trades in the last ${HIST_DAYS} days.</div>`
          : list
              .slice(0, 100)
              .map((g) => {
                const p = g.lead,
                  when = new Date(g.closedAt);
                // ET, like the cards
                const date = when.toLocaleDateString('en-US', { timeZone: ET_TZ, month: 'short', day: 'numeric' }),
                  time = when.toLocaleTimeString('en-GB', {
                    timeZone: ET_TZ,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  });
                return `<button class="sh-tr${cur && g.key === cur.key ? ' on' : ''}" data-trade="${esc(g.key)}">
                  <span class="sh-side ${g.side}">${g.side === 'long' ? 'LONG' : 'SHORT'}</span>
                  <span class="sh-what">${p.qty > 0 ? esc(fmtQty(p.qty, p.symbol)) + ' ' : ''}${esc(symLabel(g.symbol))}${g.copied ? `<small>× ${g.items.length}</small>` : ''}</span>
                  <span class="sh-when">${esc(date)} ${esc(time)}</span><span class="sh-pnl">${esc(sp(g.pnl))}</span></button>`;
              })
              .join('');
    if (box.dataset.html === html) return;
    box.dataset.html = html;
    box.innerHTML = html;
    box.querySelectorAll('[data-trade]').forEach(
      (b) =>
        (b.onclick = () => {
          S.share.trade = b.dataset.trade;
          renderShareList(body);
          drawShare(body, true);
        }),
    );
  }
  function drawShare(body, force) {
    const cv = body.querySelector('#sh-cv');
    if (!cv) return;
    // Payouts with none paid yet (or still reading): a line in place of the picture, Copy and Save off
    const empty = body.querySelector('#sh-empty');
    let note = '';
    if (S.share.kind === 'payouts') {
      const h = S.payoutHist;
      const sum = payoutSummary(h);
      if (!sum)
        note = !h
          ? '<span>Reading your payouts from Vest…</span>'
          : h.error
            ? `<span>Couldn't read your payouts from Vest (${esc(h.error)}).</span>`
            : h.processing.length
              ? '<b>No payouts yet</b><span>Your first payout is still processing. It shows here once Vest has paid it.</span>'
              : '<b>No payouts yet</b><span>Every payout Vest makes to this login adds up here, closed accounts included.</span>';
      empty.hidden = !note;
      if (note && empty.dataset.html !== note) empty.innerHTML = empty.dataset.html = note;
      cv.hidden = !!note;
      body.querySelector('#sh-copy').disabled = body.querySelector('#sh-save').disabled = !!note;
      if (!sum) {
        cv.dataset.key = '';
        return;
      }
      const o = { code: S.share.code, name: shareName() };
      // the stamp moves with the minute; the data with each read
      const key = JSON.stringify({ k: 'payouts', at: h.at, m: Math.floor(Date.now() / 60000), ...o });
      if (!force && cv.dataset.key === key) return;
      cv.dataset.key = key;
      drawPayoutCard(cv, sum, o);
      return;
    }
    empty.hidden = true;
    cv.hidden = false;
    body.querySelector('#sh-copy').disabled = body.querySelector('#sh-save').disabled = false;
    if (S.share.kind === 'trade') {
      const g = shareTrade();
      if (!g) {
        cv.dataset.key = '';
        cv.width = cv.height = 0;
        return;
      }
      const det = _details[g.lead.acct + ':' + g.lead.id] || null;
      const o = { hide: S.share.hide, code: S.share.code, name: shareName() };
      const key = JSON.stringify({ k: g.key, det: !!det, ...o });
      if (!force && cv.dataset.key === key) return;
      cv.dataset.key = key;
      drawTradeCard(cv, g, det, o);
      if (!det)
        tradeDetails(g)
          .then(() => S.shareOpen && S.share.kind === 'trade' && shareTrade() === g && drawShare(body, true))
          .catch(() => null); // without the details the card still shows the trade and its total
      return;
    }
    const d = cardData();
    const key = JSON.stringify({ ...d, at: Math.floor(d.at / 60000), hide: S.share.hide }); // d carries the style
    if (!force && cv.dataset.key === key) return;
    cv.dataset.key = key;
    drawCard(cv, d, S.share.hide);
  }
  if (window.__VC_TEST__)
    window.__vcShare = { dayTrades, groupTrades, details: () => _details, loadPayouts, payoutSummary, payoutWeeks };
  const saveShareOpts = () =>
    store.set(SHARE_OPTS_KEY, {
      hide: S.share.hide,
      code: S.share.code,
      sort: S.share.sort,
      style: S.share.style,
    });
  const shareName = () =>
    String(store.get(SHARE_NAME_KEY, '') || '')
      .replace(/[^\p{L}\p{N}@._ -]/gu, '')
      .slice(0, 24);
  // Copy needs the click's user gesture: the PNG goes to the clipboard as a promise, so the gesture still counts.
  // Where the browser refuses, the PNG is saved instead.
  function copyCard(body, cv) {
    const btn = body.querySelector('#sh-copy');
    const blob = new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('no image'))), 'image/png'));
    let p;
    try {
      p = navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch (e) {
      p = Promise.reject(e);
    }
    p.then(() => {
      btn.classList.add('done');
      btn.querySelector('span').textContent = 'Copied';
      toast('Image copied. Paste it into X, Discord or a group chat.');
      diag('share', { outcome: 'copied', kind: S.share.kind, hidden: !!S.share.hide });
      setTimeout(() => {
        btn.classList.remove('done');
        btn.querySelector('span').textContent = 'Copy image';
      }, 2000);
    }).catch(() => {
      const name = cardFile();
      saveCard(cv);
      toast(`The browser blocked the clipboard, so the picture was saved to Downloads as ${name}.`);
      diag('share', { outcome: 'saved', kind: S.share.kind, hidden: !!S.share.hide });
    });
  }

  // ───────────────────────── claim profit ─────────────────────────
  // "Claim all profit": moves each live funded account's claimable profit to the Primary Account, exactly as Vest's own
  // Claim Profit window does: POST /v3/capital/withdraw with that account's login, { account_id, amount, target_account_id,
  // idempotency_key }; Vest pays the account's split and credits it within 24 hours. Claimable = free balance − starting
  // balance (open positions and orders block a claim; unrealized PnL isn't claimable); Vest's minimum is $1. Like Vest's
  // window, it claims the exact amount (to the micro-dollar, "105.27086"); the balance drops as soon as a claim is
  // submitted, so a claim still processing doesn't block or double the next one (seen live, 2026-10-06).
  // A claim can't be reversed, so: nothing is sent before a preview the trader confirms; every account is re-read just
  // before its own claim (balance, positions, orders); accounts go one at a time, a few
  // seconds apart; each claim has one idempotency key, reused on its single retry, so it can never be paid twice; and the
  // run can be stopped between accounts. Moving money from the Primary Account to a wallet stays a manual step on Vest.
  const CLAIM_MIN_USD = 1;
  const CLAIM_GAP_MS = 1000; // between two accounts' claims: one at a time (a claim answers in ~0.3 s)
  const CLAIM_RETRY_MS = 3000;
  const claimGap = () => (typeof window.__VC_CLAIM_GAP_MS === 'number' ? window.__VC_CLAIM_GAP_MS : CLAIM_GAP_MS);
  S.claim = null; // { phase: 'checking' | 'review' | 'running' | 'done', primary, items: [...], stop, error }
  const claimBusy = () => S.claim && (S.claim.phase === 'checking' || S.claim.phase === 'running');
  // A preview or a result is a snapshot: it goes when the copier arms or the accounts reload, and a preview after
  // CLAIM_REVIEW_MS (the balances move; a claim re-checks every account anyway). A claim in progress always stays.
  const CLAIM_REVIEW_MS = 120000;
  function dropClaimReview() {
    if (!S.claim || claimBusy()) return false;
    S.claim = null;
    return true;
  }

  // One account, read fresh: what it could claim right now, or why it can't. `free` is its free balance from /v3/accounts.
  async function claimCheck(id, free) {
    const r = S.byId[id];
    const item = { id, label: accLabel(id), claimable: 0, net: 0, split: (r && r.split) || 0, reason: null };
    if (!r) return { ...item, reason: 'no longer active' };
    if (!isFunded(r)) return { ...item, reason: 'evaluation: profit pays out once funded' };
    try {
      const { token } = await mintAccountToken(id);
      const [pos, ord] = await Promise.all([
        api('/v3/positions/opened', token),
        api('/v3/positions/opened-orders', token),
      ]);
      if (((pos && pos.positions) || []).length) return { ...item, reason: 'has an open position: close it to claim' };
      if (((ord && ord.orders) || []).length) return { ...item, reason: 'has open orders: cancel them to claim' };
    } catch (e) {
      return { ...item, reason: `couldn't be checked (${e.message})` };
    }
    if (!(free >= 0)) return { ...item, reason: "couldn't read its balance" };
    const claimable = Math.floor((free - r.size) * 1e6 + 1e-6) / 1e6; // all of it, to the micro-dollar, as Vest claims
    if (!(claimable > 0)) return { ...item, reason: 'no profit to claim' };
    if (claimable < CLAIM_MIN_USD) return { ...item, reason: `${money(claimable)} is under Vest's $1 minimum` };
    return { ...item, claimable, net: claimable * item.split };
  }
  // Free balances of every account, and the Primary Account's id (account_type 1), in one read.
  const claimBalances = () => fetchBalances();

  async function claimPreview() {
    if (claimBusy()) return;
    if (S.flattening || S.placing || S.adjusting || S.exiting || S.arming)
      return toast('Wait for the current order, Flatten all or starting to finish.');
    // a trade copied mid-claim would change what each account can claim
    if (S.armed) return toast('Stop copying before claiming profit.');
    if (healthState().changed)
      return toast(
        siteGate() === 'failed'
          ? "Vest changed something the copier relies on: claim on Vest's own page until a copier update."
          : 'Vest updated its site: wait a moment for the check to finish.',
      );
    S.claim = { phase: 'checking', items: [] };
    render();
    try {
      const { free, primary } = await claimBalances();
      if (!primary) throw new Error("couldn't find your Primary Account");
      const ids = Object.values(S.byId)
        .sort((a, b) => a.order - b.order)
        .map((r) => r.id);
      const items = await Promise.all(ids.map((id) => claimCheck(id, free[id])));
      const review = (S.claim = { phase: 'review', primary, items });
      const ttl = typeof window.__VC_CLAIM_REVIEW_MS === 'number' ? window.__VC_CLAIM_REVIEW_MS : CLAIM_REVIEW_MS;
      setTimeout(() => S.claim === review && dropClaimReview() && render(), ttl);
    } catch (e) {
      S.claim = { phase: 'done', items: [], error: `Couldn't prepare the claim: ${e.message}` };
    }
    render();
  }

  // Send one claim with the account's own login; Vest's error text is kept so the log can say why.
  async function sendClaim(id, body) {
    const { token } = await mintAccountToken(id);
    const r = await _fetch(API + '/v3/capital/withdraw', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(body),
    });
    const res = parseJson(await r.text(), {}) || {};
    if (!r.ok) {
      const err = new Error(res.message || res.msg || res.error || `HTTP ${r.status}`);
      err.status = r.status;
      throw err;
    }
    return res;
  }

  async function claimRun() {
    const c = S.claim;
    if (!c || c.phase !== 'review') return;
    const todo = c.items.filter((i) => i.claimable > 0);
    if (!todo.length) return;
    if (S.armed || S.arming || S.placing || S.adjusting || S.exiting || S.flattening)
      return toast('Stop copying and let orders finish before claiming profit.');
    c.phase = 'running';
    c.stop = false;
    const total = todo.reduce((a, i) => a + i.claimable, 0);
    logEvent(
      'warn',
      `Claim profit: claiming from ${todo.length} account(s), one every ${Math.round(claimGap() / 1000)} s.`,
    );
    diag('claim', { outcome: 'started', accounts: todo.map((i) => ({ ...who(i.id), claimable: i.claimable })), total });
    render();
    for (let k = 0; k < todo.length; k++) {
      const item = todo[k];
      if (c.stop) {
        item.status = 'stopped';
        continue;
      }
      if (k) {
        item.status = 'waiting';
        render();
        for (let w = 0; w < claimGap() && !c.stop; w += 250) await sleep(Math.min(250, claimGap() - w));
        if (c.stop) {
          item.status = 'stopped';
          continue;
        }
      }
      item.status = 'claiming';
      render();
      // re-read this account right before claiming: a trade, a deposit or another claim may have changed it
      let fresh;
      try {
        const { free } = await claimBalances();
        fresh = await claimCheck(item.id, free[item.id]);
      } catch (e) {
        fresh = { ...item, claimable: 0, reason: `couldn't be re-checked (${e.message})` };
      }
      if (!(fresh.claimable > 0)) {
        Object.assign(item, { status: 'skipped', reason: fresh.reason });
        logEvent('warn', `Claim profit: ${item.label} skipped: ${fresh.reason}.`);
        diag('claim', { ...who(item.id), outcome: 'skipped', reason: fresh.reason });
        continue;
      }
      Object.assign(item, { claimable: fresh.claimable, net: fresh.net });
      const body = {
        account_id: item.id,
        amount: fmtNum(fresh.claimable, 6), // as Vest's window sends it: "105.27086"
        target_account_id: c.primary,
        idempotency_key: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
      };
      try {
        let res;
        try {
          res = await sendClaim(item.id, body);
        } catch (e) {
          if (e.status && e.status < 500 && e.status !== 429) throw e; // refused: not retried
          await sleep(CLAIM_RETRY_MS); // network or server trouble: once more, same key, so it can't pay twice
          res = await sendClaim(item.id, body);
        }
        const got = parseFloat(res.trader_amount);
        Object.assign(item, { status: 'claimed', net: got > 0 ? got : item.net });
        logEvent(
          'ok',
          `Claim profit: ${item.label} claimed ${money(item.claimable)}: ${money(item.net)} to your Primary Account within 24 hours.`,
        );
        diag('claim', { ...who(item.id), outcome: 'claimed', amount: body.amount, net: item.net, reply: res });
        notePayout(item.id);
      } catch (e) {
        Object.assign(item, { status: 'failed', reason: e.message });
        logEvent('warn', `Claim profit: ${item.label} NOT claimed: ${e.message}.`);
        diag('claim', {
          ...who(item.id),
          outcome: 'failed',
          amount: body.amount,
          error: e.message,
          status: e.status || null,
        });
      }
      render();
    }
    const done = todo.filter((i) => i.status === 'claimed');
    const sum = (f) => centsDown(done.reduce((a, i) => a + i[f], 0));
    c.phase = 'done';
    logEvent(
      done.length === todo.length ? 'ok' : 'warn',
      `Claim profit: ${done.length}/${todo.length} claimed, ${money(sum('claimable'))} gross → ${money(sum('net'))} to your Primary Account within 24 hours.`,
    );
    diag('claim', {
      outcome: 'finished',
      claimed: done.length,
      of: todo.length,
      gross: sum('claimable'),
      net: sum('net'),
    });
    setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
    render();
  }

  // The claim card under the P&L list: a button, then the preview to confirm, then progress and the result.
  function claimHtml() {
    const c = S.claim;
    if (!c && S.armed)
      return `<div class="claim"><button class="ghostbtn claim-go" data-claim="preview" disabled>Claim all profit…</button>
        <div class="sum-note warn">Stop copying to claim profit: a trade copied mid-claim would change what each account
        can claim.</div></div>`;
    if (!c)
      return `<div class="claim"><button class="ghostbtn claim-go" data-claim="preview">Claim all profit…</button>
        <div class="sum-note">Moves each funded account's profit to your Primary Account, one account at a time. Shows a
        preview first; nothing is sent until you confirm.</div></div>`;
    if (c.phase === 'checking') return `<div class="claim"><div class="sum-note">Checking every account…</div></div>`;
    const line = (i) => {
      const st = i.status;
      const right =
        st === 'claimed'
          ? `<span class="pos">claimed · ${money(i.net)} to you</span>`
          : st === 'failed'
            ? `<span class="neg">not claimed: ${esc(i.reason)}</span>`
            : st === 'skipped'
              ? `<span class="dim">skipped: ${esc(i.reason)}</span>`
              : st === 'stopped'
                ? `<span class="dim">stopped</span>`
                : st === 'claiming'
                  ? `<span>claiming…</span>`
                  : i.claimable > 0
                    ? `<span>${money(i.claimable)} → <b class="pos">${money(i.net)}</b> (${Math.round(i.split * 100)}%)</span>`
                    : `<span class="dim">${esc(i.reason)}</span>`;
      return `<div class="claim-row"><span>${esc(i.label)}</span>${right}</div>`;
    };
    const rows = c.items.map(line).join('');
    const todo = c.items.filter((i) => i.claimable > 0);
    const gross = centsDown(todo.reduce((a, i) => a + i.claimable, 0)),
      net = centsDown(todo.reduce((a, i) => a + i.net, 0));
    if (c.phase === 'review')
      return `<div class="claim"><div class="claim-h">Claim profit: review</div>${rows}
        ${
          todo.length
            ? `<div class="sum-note">Claims go to your Primary Account and arrive within 24 hours. They can't be reversed.
                Accounts are claimed one at a time, ${Math.round(claimGap() / 1000)} s apart, each re-checked first.</div>
              <div class="claim-btns"><button class="armbtn sm" data-claim="run">Claim ${money(gross)} → you get ${money(net)}</button>
                <button class="ghostbtn" data-claim="close">Cancel</button></div>`
            : `<div class="sum-note">Nothing to claim right now.</div><div class="claim-btns"><button class="ghostbtn" data-claim="close">Close</button></div>`
        }</div>`;
    if (c.phase === 'running')
      return `<div class="claim"><div class="claim-h">Claiming…</div>${rows}
        <div class="claim-btns"><button class="ghostbtn" data-claim="stop" ${c.stop ? 'disabled' : ''}>${c.stop ? 'Stopping…' : 'Stop after this account'}</button></div></div>`;
    return `<div class="claim"><div class="claim-h">Claim profit: done</div>${c.error ? `<div class="neg">${esc(c.error)}</div>` : rows}
      <div class="claim-btns"><button class="ghostbtn" data-claim="close">Done</button></div></div>`;
  }
  function wireClaim(body) {
    body.querySelectorAll('[data-claim]').forEach(
      (b) =>
        (b.onclick = () => {
          const a = b.dataset.claim;
          if (a === 'preview') claimPreview();
          else if (a === 'run') claimRun();
          else if (a === 'stop' && S.claim) {
            S.claim.stop = true;
            render();
          } else if (a === 'close' && !claimBusy()) {
            S.claim = null;
            render();
          }
        }),
    );
  }

  // ── Today: each account's equity at the start of Vest's trading day (20:00 ET) and the day's combined equity curve, from
  // Vest's own performance series (what its portfolio chart draws), so it's right even for hours the panel was closed.
  // Read when the P&L tab or Share is open, at most once a minute. Today = equity now − equity at the day's start.
  const DAY_REFRESH_MS = 60000,
    DAY_POINTS = 200;
  S.day = null; // { start, at, startEq: {id: equity}, startUpnl: {id: upnl}, curve: [[ts, combined equity]] }
  let _dayBusy = false;
  async function ensureDay(force = false) {
    const start = vestDayStart();
    if (_dayBusy || !userTokenOk()) return;
    if (!force && S.day && S.day.start === start && Date.now() - S.day.at < DAY_REFRESH_MS) return;
    _dayBusy = true;
    try {
      readPayouts(start);
      const r = await api(`/v3/trading-performance/series?from=${start}&to=${Date.now()}&points=${DAY_POINTS}`);
      const byAcct = {};
      for (const it of (r && r.items) || []) {
        const v = num(it.equity_value);
        if (!it.account_id || !Number.isFinite(v)) continue;
        (byAcct[it.account_id] = byAcct[it.account_id] || []).push({
          ts: msOf(it.ts) || 0,
          eq: v,
          upnl: num(it.total_unrealized_pnl) || 0,
        });
      }
      const startEq = {},
        startUpnl = {};
      for (const [id, pts] of Object.entries(byAcct)) {
        pts.sort((x, y) => x.ts - y.ts);
        startEq[id] = pts[0].eq;
        startUpnl[id] = pts[0].upnl;
      }
      // the combined curve: every account's last known equity at each point in time (no guesses before its first)
      const ids = Object.keys(byAcct).filter((id) => S.byId[id]);
      const times = [...new Set(ids.flatMap((id) => byAcct[id].map((p) => p.ts)))].sort((x, y) => x - y);
      const last = {},
        idx = {};
      const curve = [];
      for (const t of times) {
        for (const id of ids) {
          const pts = byAcct[id],
            paid = paidToday(id) ? S.payouts[id] : 0; // paid out today: counts from its starting balance until then
          let i = idx[id] || 0;
          while (i < pts.length && pts[i].ts <= t) {
            last[id] = paid && pts[i].ts < paid && S.byId[id] ? S.byId[id].size : pts[i].eq;
            i++;
          }
          idx[id] = i;
        }
        // a point from before the day began (Vest buckets the series) counts as the day's opening value
        if (ids.every((id) => last[id] != null))
          curve.push([Math.max(t, start), ids.reduce((a, id) => a + last[id], 0)]);
      }
      const dedup = curve.filter((c, i) => i === curve.length - 1 || curve[i + 1][0] !== c[0]);
      S.day = { start, at: Date.now(), startEq, startUpnl, curve: dedup, ids };
    } catch {
      S.day = S.day && S.day.start === start ? { ...S.day, at: Date.now() } : null; // try again in a minute
    } finally {
      _dayBusy = false;
    }
    if (S.summaryOpen || S.shareOpen) render();
  }
  // ── Payouts. A claim takes an account's profit out and starts it fresh at its starting balance, so Today counts from
  // there for an account paid out today, the way a platform's report as of now does (the trade itself is on Share and
  // in the account's history). Known from claims made here, Vest's live feed (profit_withdrawal) and Vest's payout list
  // (GET /v3/capital/withdrawals, read with the day's series).
  const PAYOUTS_KEY = 'vc-payouts';
  S.payouts = store.get(PAYOUTS_KEY, {}) || {}; // accountId -> ms of its latest payout
  function notePayout(id, at = Date.now()) {
    if (!id || !(at > 0) || (S.payouts[id] || 0) >= at) return;
    S.payouts[id] = at;
    store.set(PAYOUTS_KEY, S.payouts);
    if (S.summaryOpen || S.shareOpen) render();
  }
  function forgetPayout(id) {
    if (!id || !S.payouts[id]) return;
    delete S.payouts[id]; // Vest returned it: the money is back on the account
    store.set(PAYOUTS_KEY, S.payouts);
  }
  const paidToday = (id) => (S.payouts[id] || 0) >= vestDayStart();
  async function readPayouts(since) {
    try {
      const r = await api('/v3/capital/withdrawals?limit=50');
      const list = (r && (r.withdrawals || r.items)) || [];
      // the field names, so a Diag shows what Vest sends (no tokens in it)
      diag('payouts', { outcome: 'read', count: list.length, fields: list[0] ? Object.keys(list[0]) : [] });
      for (const w of list) {
        if (/fail|refund|reject|cancel/i.test(String(w.status || ''))) continue;
        const at = msOf(w.created_at ?? w.createdAt ?? w.requested_at ?? w.requestedAt ?? w.updated_at ?? w.timestamp);
        const id = w.account_id || w.accountId;
        if (id && at >= since) notePayout(id, at);
      }
    } catch {
      /* best effort: claims made here and the live feed still count */
    }
  }
  // Today's P&L for an account (NaN until the day's start is known or while its balance is unread): from the start of
  // Vest's day, or from its starting balance when a payout today started it fresh.
  const todayOf = (r) => {
    if (!S.day || isNaN(r.equity)) return NaN;
    if (paidToday(r.id)) return r.equity - r.size;
    return S.day.startEq[r.id] != null ? r.equity - S.day.startEq[r.id] : NaN;
  };
  const sp = (n) =>
    isNaN(n)
      ? '—'
      : (n >= 0 ? '+' : '−') +
        '$' +
        Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function dayTotals() {
    const rows = Object.values(S.byId);
    const known = rows.filter((r) => !isNaN(todayOf(r)));
    const today = known.reduce((a, r) => a + todayOf(r), 0);
    const open = known.reduce((a, r) => a + (r.upnl || 0), 0);
    const openAtStart = known.reduce((a, r) => a + ((S.day && !paidToday(r.id) && S.day.startUpnl[r.id]) || 0), 0);
    return { known: known.length, rows: rows.length, today, open, openAtStart, closed: today - (open - openAtStart) };
  }

  // P&L: today on top (with Share), what you keep after splits, then each account: today, and its equity and total
  // since it started. Claim profit underneath.
  function renderSummary(body) {
    ensureDay();
    const rows = Object.values(S.byId).sort((a, b) => a.size - b.size || a.order - b.order);
    if (!rows.length) {
      body.innerHTML = `<div class="empty">No accounts loaded.</div>`;
      return;
    }
    const sum = (arr) => arr.reduce((s, x) => s + (isNaN(x) ? 0 : x), 0);
    // an account whose balance couldn't be read counts in neither total (its start without its equity would read as a loss)
    const known = rows.filter((r) => !isNaN(r.equity) && !isNaN(r.size));
    const totalEq = sum(known.map((r) => r.equity)),
      totalInit = sum(known.map((r) => r.size)),
      totalPnl = totalEq - totalInit;
    const pnlOf = (r) => r.equity - r.size; // NaN while the balance is unknown
    // What you'd take home if every funded account's profit were claimed now, after each account's own split
    const funded = rows.filter(isFunded);
    const keep = sum(funded.map(keepOf));
    const openTrades = rows.some((r) => r.upnl);
    const evalsUp = rows.some((r) => !isFunded(r) && pnlOf(r) > 0),
      fundedDown = funded.some((r) => pnlOf(r) < 0);
    const notCounted = [
      evalsUp && "evaluations (their profit doesn't pay out)",
      fundedDown && 'accounts in a loss (claims are per account, so they pay $0 and take nothing from the others)',
    ].filter(Boolean);
    const d = dayTotals(),
      hasDay = d.known > 0;
    const hero = hasDay ? d.today : totalPnl;
    const daySub = hasDay
      ? `Today on ${d.known} account${d.known === 1 ? '' : 's'}${
          Math.abs(d.openAtStart) < 0.005 && (d.open || d.closed)
            ? `<br><span title="Realized: trades closed today, plus the day's fees and funding. Open: profit on trades still open.">Realized <span class="mono">${sp(d.closed)}</span> · open <span class="mono">${sp(d.open)}</span></span>`
            : ''
        }`
      : S.day === null
        ? 'Since start · today loads in a moment'
        : 'Since start';
    const keepHtml = funded.length
      ? `<div class="sum-keep" title="Each funded account's profit × its profit split, added up. Accounts in a loss count as $0.${
          openTrades
            ? " With trades open: as if they closed at today's price, after Vest's closing fee. Slippage on the close isn't counted."
            : ''
        }">
          <span class="sum-keep-v">${money(keep)}</span> <span class="sum-keep-l">you keep after splits${openTrades ? ', if closed now, after fees' : ''}</span></div>`
      : '';
    body.innerHTML = `
      <div class="summary">
        <div class="sum-hero">
          <button class="ghostbtn sum-share" data-act="share" title="A picture of today's P&amp;L or a trade, to paste anywhere">${ICON.share} Share</button>
          <div class="sum-total ${hero >= 0 ? 'pos' : 'neg'}" title="${hasDay ? "Since Vest's trading day began (20:00 ET), or since a payout today started the account fresh" : 'Equity − starting balance, all accounts'}">${sp(hero)}</div>
          <div class="sum-day">${daySub}</div>
        </div>
        <div class="sum-sub">${hasDay ? `Since start <span class="mono">${sp(totalPnl)}</span> · ` : ''}equity <span class="mono">${money(totalEq)}</span> of <span class="mono">${money(totalInit)}</span></div>
        ${keepHtml}
        <div class="sum-list">
          ${rows
            .map((r) => {
              const pnl = pnlOf(r),
                k = keepOf(r),
                td = todayOf(r);
              const side =
                k > 0
                  ? `keeps ${money(k)}`
                  : r.target && !isNaN(r.equity) && r.equity < r.target
                    ? `${money(r.target - r.equity)} to pass`
                    : '';
              return `<div class="sum-row${r.id === S.master ? ' m' : ''}"><span class="tile${r.id === S.master ? ' m' : ''}">${esc(acctNum(r.base))}</span>
              <span class="sum-left"><span class="sum-name" title="${esc(r.label)}">${esc(shortName(r))}</span><span class="sum-k" title="${k > 0 ? `Keeps ${money(k)} after its ${Math.round(r.split * 100)}% split` : ''}">${esc(r.chip)}${side ? ' · ' + side : ''}</span></span>
              <span class="sum-right"><span class="sum-td ${isNaN(td) ? '' : td >= 0 ? 'pos' : 'neg'}" title="${paidToday(r.id) ? 'Today, since its payout started it fresh' : 'Today'}">${hasDay ? sp(td) : ''}</span>
                <span class="sum-tot"><span class="sum-eq">${money(r.equity)}</span> <span class="sum-pnl ${isNaN(pnl) ? '' : pnl >= 0 ? 'pos' : 'neg'}" title="Since start">${isNaN(pnl) ? '—' : sp(pnl)}</span></span></span></div>`;
            })
            .join('')}
        </div>
        ${notCounted.length ? `<div class="sum-note">Not counted in what you keep: ${notCounted.join('; ')}.</div>` : ''}
        ${funded.length ? claimHtml() : ''}
      </div>`;
    body.querySelector('[data-act="share"]').onclick = () => setView('share');
    wireClaim(body);
  }

  // A warning that something went wrong (not a routine notice): the footer offers Get help next to it.
  const PROBLEM_RE =
    /fail|refus|reject|couldn't|could not|didn't|not filled|not copied|error|lost|wrong|missing|garbled/i;
  function renderLog() {
    if (!_root) return;
    const el = _root.querySelector('.log');
    if (!el) return;
    // Followers in a trade without the master: name them and why, then Flatten / Keep (and help).
    const ol = S.orphan ? S.orphan.list : [];
    let orphanHtml = '';
    if (ol.length) {
      const names = [...new Set(ol.map((o) => accLabel(o.accountId)))];
      const syms = [...new Set(ol.map((o) => symLabel(o.symbol)))].join(', ');
      const why = ol[ol.length - 1].why;
      orphanHtml = `<div class="orphan"><div><b>${esc(names.length === 1 ? names[0] + ' is' : names.join(', ') + ' are')} still in ${esc(syms)}</b>, but the master isn't${why ? `: ${esc(why)}` : ''}.</div>
          <div class="obtns"><button class="obtn" id="vc-flatten">Flatten ${esc(names.length === 1 ? names[0] : names.length + ' followers')}</button><button class="obtn keep" id="vc-keep">Keep it</button><button class="lnk" data-act="help">Get help</button></div></div>`;
    }
    const toastHtml = _toast ? `<div class="toast">${esc(_toast)}</div>` : '';
    // copying, and Vest's own screen is on another of the user's accounts: orders placed on Vest's ticket there aren't copied
    const screenHtml =
      S.armed && S.master && S.screen && S.screen !== S.master && S.byId[S.screen]
        ? `<div class="toast" data-warn="screen">Vest is showing ${esc(accLabel(S.screen))}, not your master ${esc(accLabel(S.master))}: orders placed there aren't copied.</div>`
        : '';
    // The orphan prompt and notices sit above the log, so they show even while it's folded.
    const alerts = _root.querySelector('.alerts');
    const html = orphanHtml + screenHtml + toastHtml;
    if (alerts.dataset.html !== html) {
      alerts.innerHTML = alerts.dataset.html = html; // a redraw would eat a click
      const fb = alerts.querySelector('#vc-flatten'),
        kb = alerts.querySelector('#vc-keep'),
        hb = alerts.querySelector('[data-act="help"]');
      if (fb) fb.onclick = () => flattenOrphans();
      if (kb) kb.onclick = () => keepOrphans();
      if (hb) hb.onclick = () => openReport();
    }
    el.innerHTML = S.log
      .map(
        (e) =>
          `<div class="le ${e.level}"><span class="ts">${e.t.toLocaleTimeString([], { hour12: false })}</span><span>${esc(e.msg)}</span></div>`,
      )
      .join('');
    // folded, the footer is the latest line; a warning there offers help
    const last = _root.querySelector('.loglast'),
      e0 = S.log[0];
    const trouble = e0 && e0.level === 'warn' && PROBLEM_RE.test(e0.msg);
    const lastHtml = e0
      ? `<span class="ts">${e0.t.toLocaleTimeString([], { hour12: false })}</span><span class="lm">${esc(e0.msg)}</span>${
          trouble ? '<button class="lnk" data-act="loghelp">Get help</button>' : ''
        }`
      : '';
    if (last.dataset.html !== lastHtml) {
      last.innerHTML = last.dataset.html = lastHtml;
      const lh = last.querySelector('[data-act="loghelp"]');
      if (lh) lh.onclick = () => openReport();
    }
    last.className = 'loglast ' + (e0 ? e0.level : '');
  }

  async function refresh() {
    renderHealth();
    const body = _root.querySelector('.body');
    const show = (html) => {
      body.dataset.view = '';
      body.innerHTML = html;
    };
    try {
      await waitForUserToken();
    } catch {
      return show(
        `<div class="empty">Couldn't capture your Vest session.<br>Click around the site, then click Reload accounts (↻).</div>`,
      );
    }
    show(`<div class="empty">Loading accounts…</div>`);
    readScreen();
    try {
      await buildRegistry();
      dropClaimReview(); // it named the accounts as they were
      render();
      logEvent('info', `Loaded ${Object.keys(S.byId).length} active accounts.`);
      diag('accounts', {
        count: Object.keys(S.byId).length,
        list: Object.values(S.byId).map((r) => ({
          ...who(r.id),
          type: r.type,
          size: r.size,
          equity: r.equity,
          floor: r.floor,
          dailyFloor: r.dailyFloor,
          target: r.target,
          free: r.free,
          canTrade: r.canTrade,
        })),
      });
      startBalancePoll();
      refreshBalances(); // live equity now, rather than the series' last point
      if (!S.ack) {
        S.rulesOpen = true; // first use: the risk acknowledgement comes first
        S.tradeOpen = S.summaryOpen = S.settingsOpen = S.appearOpen = false;
        render();
      } else supportOnTerms();
    } catch (e) {
      show(`<div class="empty">Failed to load accounts: ${esc(e.message)}</div>`);
    }
  }

  // A copy of the script that passed through a tool using a legacy code page (e.g. Windows clip.exe) has every
  // non-ASCII character mangled: this one-character dash arrives as three ("ΓÇô"). Say so, and point at a clean install.
  const ENCODING_PROBE = '–';
  function checkEncoding() {
    if (ENCODING_PROBE.length === 1) return;
    logEvent(
      'warn',
      'This copy of STRATUH Copier was garbled when it was copied (symbols look wrong). Reinstall it from ' +
        SCRIPT_URL,
    );
    diag('encoding', { probeLength: ENCODING_PROBE.length });
  }

  // The userscript manager, for the diagnostics (Tampermonkey's GM_info, available even with @grant none). No secrets in it.
  function scriptManager() {
    try {
      const g = typeof GM_info !== 'undefined' ? GM_info : null;
      if (!g) return null;
      return {
        name: g.scriptHandler || null,
        version: g.version || null,
        injectInto: g.injectInto || null,
        sandbox: g.sandboxMode || null,
        incognito: !!g.isIncognito,
        updateURL: (g.script && g.script.updateURL) || null,
        downloadURL: (g.script && g.script.downloadURL) || null,
      };
    } catch {
      return null;
    }
  }

  // ───────────────────────── boot ─────────────────────────
  const boot = () => {
    loadLog();
    loadDiag();
    loadAck();
    loadOpts();
    loadTrade();
    loadUpdate();
    initBuild();
    setInterval(autoSiteCheck, 1000); // Vest updated: the site check runs by itself
    loadAllSymbolRules();
    diag('session', {
      version: VERSION,
      build: fingerprint() || null,
      browser: navigator.userAgent,
      settings: {
        fast: S.fast,
        autoFlatten: S.autoFlatten,
        capFit: S.capFit,
        checkUpdates: S.checkUpdates,
        hideMarks: S.hideMarks,
      },
      termsAccepted: S.ack,
      openPlans: Object.keys(store.get('vc-plans', {}) || {}).length,
      start: BOOT_STATE,
      vestSizeUnit: vestSizeUnit(),
      manager: scriptManager(),
    });
    // The copier's own crashes (not Vest's): Tampermonkey runs it from a "userscript" source; any manager's address for
    // this script is in OWN_SRC.
    const ours = (stack) => {
      const s = String(stack || '');
      return /userscript|vest-copier/i.test(s) || (!!OWN_SRC && s.includes(OWN_SRC));
    };
    if (window.__VC_TEST__) window.__vcOurs = (stack) => ({ ours: ours(stack), own: OWN_SRC });
    window.addEventListener('error', (e) => {
      if (ours(e.filename) || ours(e.error && e.error.stack))
        diag('script_error', {
          message: e.message,
          at: `${e.lineno}:${e.colno}`,
          stack: String((e.error && e.error.stack) || '').slice(0, 800),
        });
    });
    window.addEventListener('unhandledrejection', (e) => {
      const r = e.reason;
      if (ours(r && r.stack))
        diag('script_error', {
          message: String((r && r.message) || r),
          stack: String(r.stack).slice(0, 800),
          unhandled: true,
        });
    });
    loadDock();
    applyTheme();
    _root = buildPanel();
    setOpen(S.dock.open || !S.ack); // a first run opens fully, for the risk terms
    loadPlans();
    renderHealth();
    renderLog();
    refresh();
    checkForUpdate();
    startStatusChecks();
    checkEncoding();
    checkWasArmed();
    watchPurchaseWindow();
    LOG(`v${VERSION} loaded.`);
  };
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
