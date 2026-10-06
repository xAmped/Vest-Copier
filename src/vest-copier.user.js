// ==UserScript==
// @name         Vest Copier
// @namespace    vestcopier
// @version      0.30.1
// @description  Copies a master Vest account's trades to your other Vest accounts, live, and adds a points-based order panel.
// @author       xAmped
// @license      Vest Copier License — free to use, no selling; see LICENSE
// @homepageURL  https://github.com/xAmped/Vest-Copier
// @supportURL   https://github.com/xAmped/Vest-Copier/issues
// @updateURL    https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js
// @downloadURL  https://github.com/xAmped/Vest-Copier/releases/latest/download/vest-copier.user.js
// @match        https://next.vestmarkets.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Vest Copier — Copyright (c) 2026 xAmped. Free to use for your own trading and to share unmodified; not for sale.
// Full terms: LICENSE (https://github.com/xAmped/Vest-Copier/blob/main/LICENSE). Not affiliated with Vest Markets.

(() => {
  'use strict';
  if (window.__vestCopier) return;
  window.__vestCopier = true;

  const VERSION = '0.30.1';
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
  const BALANCE_POLL_MS = 20000;
  const FLATTEN_WAIT_MS = 5000,
    FLATTEN_RECHECK_MS = 1500;
  const TOKEN_REFRESH_MARGIN_MS = 60000; // mint a new account token this long before the old one expires
  const LOG_MAX = 500,
    DIAG_MAX = 2000,
    DIAG_MAX_BYTES = 1500000;
  const MIN_LEG_USD = 1; // Vest's minimum notional for a sized stop/target leg

  // ───────────────────────── state ─────────────────────────
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
    fast: false, // fast mode: fire follower OPENS at master-send (before the master confirms)
    autoFlatten: false, // auto-close orphan followers if the master open is rejected
    orphan: null, // { list: [{ accountId, positionId, symbol, leverage }] } follower positions without the master
    arming: false, // an arm is in progress
    update: null, // { state, latest, dismissed } from the GitHub version check
    checkUpdates: true, // look for new versions on GitHub
    supportOffer: false, // the one-time "support with code AMPED" question is showing
    supportCurrent: null, // the code the account already uses, named in that question
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
      sizeMode: 'qty',
      qty: 1,
      risk: 50,
      stopPts: 20,
      targets: [20, 40, 60],
      scale: 'even',
      beMode: 'tp1',
      beTrigger: 15,
      beOffset: 1,
      anchor: 'fill',
    },
    price: {}, // symbol -> { px, at } live price
  };
  // Per-symbol order rules, refreshed from /v3/exchangeInfo at load (NDX-USD-PERP: tick 0.25, 4 size decimals).
  // Contracts are linear (notional = price × quantity), so P&L is $1 per point per contract.
  const SYMBOLS = { [DEFAULT_SYMBOL]: { label: 'NQ', tick: 0.25, step: 0.0001, pointValue: 1 } };

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
      ],
    },
    // add to an open position: Vest's ticket sends this, not /open, when you already hold the same direction
    append: {
      need: ['positionId', 'symbol', 'quantity', 'isBuy'],
      known: ['symbol', 'positionId', 'orderType', 'quantity', 'leverage', 'isBuy', 'timeInForce', 'price'],
    },
    reduce: {
      need: ['positionId', 'quantity', 'symbol'],
      known: ['positionId', 'orderType', 'leverage', 'quantity', 'timeInForce', 'reduceOnly', 'symbol'],
    },
    close: { need: ['positionId', 'symbol'], known: ['symbol', 'positionId', 'orderType', 'leverage'] },
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
        `Vest's ${action} order has changed — missing ${missing.join(', ')}. Copies may be wrong: disarm, run the site check (health bar), send Diag.`,
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
  const onRequest = (url, reqBody, resBody, auth, method, status) => {
    const action = orderAction(url);
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
      logEvent('info', `MASTER ${action} refused by Vest (HTTP ${status || 'no response'}) — not copied.`);
      diag('master_refused', {
        action,
        method,
        status,
        positionId: req.positionId || null,
        triggerPrice: req.triggerPrice,
        qty: req.quantity,
      });
      return;
    }
    checkShape(action, req, method);
    mirror(action, req, res, method);
    setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
  };

  // fetch
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    let auth = null;
    try {
      auth = new Headers((init && init.headers) || (input && input.headers) || {}).get('authorization');
    } catch {}
    const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    const body = init && init.body;
    let pending = null;
    try {
      if (method === 'POST') pending = maybeFastOpen(url, body, auth);
    } catch {}
    try {
      offerUser(auth);
    } catch {}
    const p = _fetch.apply(this, arguments);
    // Only order requests are read back (never other responses, which may be long-lived streams).
    if (pending || (auth && orderAction(url))) {
      p.then(
        (r) =>
          r
            .clone()
            .text()
            .then(
              (t) => (pending ? reconcileFast(pending, t, r.status) : onRequest(url, body, t, auth, method, r.status)),
              () => pending && reconcileFast(pending, null, r.status, true),
            ),
        () => pending && reconcileFast(pending, null, 0), // network failure: Vest may or may not have the order
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
        pending = vc.method === 'POST' ? maybeFastOpen(vc.url, b, vc.auth) : null;
      } catch {}
      this.addEventListener(
        'loadend',
        () => {
          // once per request; also fires on error/abort/timeout
          let r = '';
          try {
            r = this.responseText;
          } catch {}
          if (pending) reconcileFast(pending, r, this.status);
          else onRequest(vc.url, b, r, vc.auth, vc.method, this.status);
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

  // ───────────────────────── api ─────────────────────────
  // Vest REST call. Errors read "<path> -> <status>" (errCode() parses the status back out).
  const api = async (path, token = userToken, opts = {}) => {
    if (!token) throw new Error('no Vest session yet — click around Vest, then retry');
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      ...(opts.headers || {}),
    };
    const r = await _fetch(API + path, { ...opts, headers });
    try {
      const rem = r.headers.get('x-ratelimit-remaining');
      if (rem != null) {
        S.rate = { remaining: +rem, limit: +r.headers.get('x-ratelimit-limit') || S.rate.limit };
        renderRate();
      }
    } catch {}
    const text = await r.text();
    if (!r.ok) throw new Error(`${path} -> ${r.status}`);
    return parseJson(text, text);
  };
  // Account tokens last ~15 minutes. Cached, and concurrent requests for the same account share one mint.
  const acctTokens = {},
    minting = {};
  const mintAccountToken = (id) => {
    const c = acctTokens[id];
    if (c && c.exp - TOKEN_REFRESH_MARGIN_MS > Date.now()) return Promise.resolve(c);
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
  const label = (a) => a.name || 'Account ' + String((a.attempt_index ?? 0) + 1).padStart(2, '0');

  // True equity per account (balance + unrealized PnL) from the performance series — what Vest measures
  // drawdown against — and the unrealized PnL in it. /v3/accounts `amount` is only FREE collateral (under-reports while a
  // position is open), which is what Vest's trading power is built on.
  // → { accountId: { equity, upnl } }
  async function fetchEquities() {
    try {
      const now = Date.now();
      const r = await api(`/v3/trading-performance/series?from=${now - 2 * 86400000}&to=${now}&points=500`);
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

  async function buildRegistry() {
    const [active, accounts, eq] = await Promise.all([
      api('/v3/capital/accounts/active'),
      api('/v3/accounts').catch(() => ({ accounts: [] })),
      fetchEquities(),
    ]);
    const balById = Object.fromEntries((accounts.accounts || []).map((a) => [a.account_id, num(a.amount)]));
    const rows = (active.accounts || []).map((a) => {
      const initial = num(a.initial_capital),
        floor = num(a.max_drawdown_limit);
      const eqv = eq[a.id] && eq[a.id].equity;
      const equity = eqv != null && !isNaN(eqv) ? eqv : (balById[a.id] ?? initial),
        maxDD = initial - floor;
      const r = {
        id: a.id,
        label: label(a),
        type: typeName(a.account_type, a.plan_product_type),
        chip: shortType(a.account_type, a.plan_product_type),
        size: initial,
        floor,
        equity,
        free: balById[a.id] ?? NaN,
        upnl: (eq[a.id] && eq[a.id].upnl) || 0,
        usedPct: maxDD > 0 ? Math.min(1, Math.max(0, (initial - equity) / maxDD)) : 0,
        leverage: num(a.max_leverage),
        accountType: a.account_type,
        planId: a.plan_id || null,
        groupKey: initial + '|' + typeName(a.account_type, a.plan_product_type),
        canTrade: null,
        order: a.attempt_index ?? 0,
      };
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
    S.byId = Object.fromEntries(rows.map((r) => [r.id, r]));
    // Reconcile selections against reality: an account that was closed/blown drops out of the active
    // list, so clear any master/follower that no longer exists (and disarm) — never leave a dangling ref.
    if (S.master && !S.byId[S.master]) {
      S.master = null;
      if (S.armed) {
        S.armed = false;
        logEvent('warn', 'Master account is gone — disarmed.');
      }
    }
    [...S.followers].forEach((f) => {
      if (!S.byId[f]) {
        S.followers.delete(f);
        if (S.armed) {
          S.armed = false;
          logEvent('warn', `A follower is gone — disarmed.`);
        }
      }
    });
    const groups = {};
    for (const r of rows)
      (groups[r.groupKey] = groups[r.groupKey] || { size: r.size, type: r.type, key: r.groupKey, rows: [] }).rows.push(
        r,
      );
    const gl = Object.values(groups);
    gl.forEach((g) => g.rows.sort((a, b) => a.order - b.order)); // lowest account number first
    S.groups = gl.sort((a, b) => b.size - a.size || a.type.localeCompare(b.type));
    return S.groups;
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
  const keepOf = (r) =>
    isFunded(r) && r.split > 0 && r.equity > r.size ? centsDown((r.equity - r.size) * r.split) : 0;

  // keep balances / room fresh
  let _balTimer = null;
  async function refreshBalances() {
    if (!userTokenOk() || !Object.keys(S.byId).length) return;
    try {
      const [accounts, eq, active] = await Promise.all([
        api('/v3/accounts').catch(() => ({ accounts: [] })),
        fetchEquities(),
        api('/v3/capital/accounts/active').catch(() => null), // the daily floor moves at each daily reset
      ]);
      const bal = Object.fromEntries((accounts.accounts || []).map((a) => [a.account_id, num(a.amount)]));
      for (const a of (active && active.accounts) || []) if (S.byId[a.id]) setLimits(S.byId[a.id], a);
      for (const id in S.byId) {
        const r = S.byId[id];
        if (bal[id] != null && !isNaN(bal[id])) r.free = bal[id];
        if (eq[id]) r.upnl = eq[id].upnl;
        const e = eq[id] && !isNaN(eq[id].equity) ? eq[id].equity : bal[id];
        if (e == null || isNaN(e)) continue;
        r.equity = e;
        const maxDD = r.size - r.floor;
        r.room = r.equity - floorOf(r);
        r.usedPct = maxDD > 0 ? Math.min(1, Math.max(0, (r.size - r.equity) / maxDD)) : 0;
      }
      if (S.tradeOpen) refreshTradeState();
      render();
    } catch {}
  }
  function startBalancePoll() {
    if (_balTimer) clearInterval(_balTimer);
    _balTimer = setInterval(refreshBalances, BALANCE_POLL_MS);
  }

  // Every account's saved per-symbol leverage, in one call (GET /v3/user-state, user token). null if it can't be read.
  async function fetchLeverages() {
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
  const levFor = (levs, id, sym) => (levs && levs[id] && levs[id][sym] != null ? +levs[id][sym] : null);

  // ───────────────────────── executor ─────────────────────────
  // Follower orders use each follower's own account token, with an Idempotency-Key on every order.
  const idem = () => ({
    'Idempotency-Key': crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
  });
  async function acctSend(method, id, path, body) {
    const { token } = await mintAccountToken(id);
    return api(path, token, { method, body: JSON.stringify(body), headers: idem() });
  }
  const acctPost = (id, path, body) => acctSend('POST', id, path, body);
  const acctPut = (id, path, body) => acctSend('PUT', id, path, body);
  const acctDelete = (id, path, body) => acctSend('DELETE', id, path, body);
  async function setFollowerLeverage(id, sym, lev) {
    const { token } = await mintAccountToken(id);
    const path = `/v3/user-state/accounts/${id}/leverages/${encodeURIComponent(sym)}`;
    return api(path, token, { method: 'PUT', body: JSON.stringify({ leverage: String(lev) }) });
  }
  // Vest requires a leverage on close orders: the request's, else the one synced for this account and market, else a
  // default.
  const closeBody = (symbol, positionId, leverage, accountId) => ({
    symbol,
    positionId,
    orderType: 'market',
    leverage: String(leverage || S.levCache[accountId + '|' + symbol] || DEFAULT_LEVERAGE),
  });
  // Market / IOC orders execute at once, so their fills can be checked; a resting limit order has nothing to find yet.
  const isImmediate = (req) => !req || req.orderType === 'market' || req.timeInForce === 'IOC';
  const who = (id) => ({ account: id, label: accLabel(id) }); // the account fields every diag record carries
  const msSince = (t0) => Math.round(performance.now() - t0);
  const entryByOrderId = (oid) => Object.values(S.posMap).find((e) => e.masterOrderId === oid);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Fill price/time for one order, matched by order id in /v3/executions.
  // Returns { price, at } when filled, null when Vest's history has no such fill, or undefined when the lookup itself
  // failed: a failed lookup must never be read as "did not fill".
  async function fillInfo(accountId, symbol, orderId) {
    try {
      const { token } = await mintAccountToken(accountId);
      const nowS = Math.floor(Date.now() / 1000),
        win = EXEC_WINDOW_S;
      const q = `account_id=${encodeURIComponent(accountId)}&symbol=${encodeURIComponent(symbol)}&from=${nowS - win}&to=${nowS + win}&limit=200`;
      const r = await api(`/v3/executions?${q}`, token);
      const it = (r.items || []).find((x) => x.id === orderId);
      return it ? { price: parseFloat(it.price), at: it.executedAt } : null;
    } catch {
      return undefined;
    }
  }

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
  async function confirmFills(symbol, master, placed, entry, kind = 'entry') {
    if (!placed.length && !master.orderId) return;
    await sleep(FILL_FIRST_LOOK_MS);
    // → { fill } when filled, { missing: true } when confirmed absent, {} when it couldn't be checked
    const tryFill = async (acct, oid) => {
      let failed = false;
      for (let i = 0; i < FILL_TRIES; i++) {
        const f = await fillInfo(acct, symbol, oid);
        if (f) return { fill: f };
        if (f === undefined) failed = true;
        if (i < FILL_TRIES - 1) await sleep(FILL_RETRY_MS);
      }
      return failed ? {} : { missing: true };
    };
    const m = master.orderId ? await tryFill(master.accountId, master.orderId) : {};
    const mp = m.fill || null;
    const masterMissed = !!m.missing;
    if (masterMissed) {
      logEvent('warn', `MASTER ${accLabel(master.accountId)} did NOT fill — ${NO_FILL_WHY}.`);
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
      filledWithoutMaster = [];
    let filled = 0,
      undone = false,
      slipSum = 0,
      slipMax = 0,
      slipN = 0;
    await Promise.all(
      placed.map(async (p) => {
        const r = await tryFill(p.accountId, p.orderId);
        if (!r.fill && !r.missing) {
          unknown.push(p.label);
          return;
        }
        if (r.missing) {
          const msg =
            kind === 'close'
              ? `${p.label}'s close did NOT fill — it is still OPEN. Close it on Vest.`
              : kind === 'add'
                ? `${p.label} did NOT fill the add — its original position is unchanged.`
                : `${p.label} did NOT fill — not in this trade.`;
          logEvent('warn', msg);
          if (p.undo) {
            p.undo();
            undone = true;
          } else if (kind === 'entry' && entry) delete entry.followers[p.accountId];
          if (p.diag) {
            Object.assign(p.diag, { filled: false, met: false, reason: NO_FILL_WHY });
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
          const o = {
            filled: true,
            fillPrice: fp.price,
            masterFillPrice: mp ? mp.price : null,
            slipPts: d,
            slipUsd: d != null ? +(Math.abs(d) * qty * pv).toFixed(4) : null,
            met: true,
          };
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
    if (filledWithoutMaster.length && kind === 'entry') {
      const list = filledWithoutMaster.map((p) => ({
        accountId: p.accountId,
        positionId: p.positionId,
        leverage: p.diag && p.diag.leverage,
      }));
      raiseOrphans(symbol, list, 'the master entry did not fill', master.accountId);
    } else if (filledWithoutMaster.length && kind === 'add') {
      const names = filledWithoutMaster.map((p) => p.label).join(', ');
      logEvent(
        'warn',
        `${names} added but the master didn't — they now hold more than the master. Reduce them on Vest.`,
      );
    }
    if (m.fill === undefined && master.orderId && !masterMissed)
      unknown.unshift(accLabel(master.accountId) + ' (master)');
    if (unknown.length)
      logEvent(
        'warn',
        `Couldn't confirm fills for ${unknown.join(', ')} — Vest's fill history didn't answer. Check them on Vest.`,
      );
    if (!placed.length) return;
    const n = placed.length - unknown.length;
    if (noFill.length) logEvent('warn', `Fills ${filled}/${n} — not filled: ${noFill.join(', ')}.`);
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
  function capQty(followerId, masterQtyStr, sym) {
    const mQ = parseFloat(masterQtyStr);
    const mEq = (S.byId[S.master] || {}).equity,
      fEq = (S.byId[followerId] || {}).equity;
    const calc = { mEq, fEq }; // recorded in diagnostics
    if (!S.capFit) return { qty: masterQtyStr, scaled: false, skip: false, calc };
    if (!(mQ > 0) || !(mEq > 0) || !(fEq > 0))
      return { qty: masterQtyStr, scaled: false, skip: false, calc: { ...calc, reason: 'missing-equity' } };
    const prop = mQ * (fEq / mEq);
    calc.proportionalQty = +prop.toFixed(6);
    if (prop >= mQ) return { qty: masterQtyStr, scaled: false, skip: false, calc };
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

  // Copy a master add / move / remove of one stop or target to every follower.
  async function mirrorLeg(op, kind, req, entry, followers, lat, t0) {
    const KIND = kind === 'sl' ? 'SL' : 'TP';
    const path = kind === 'sl' ? '/v3/positions/stop-loss' : '/v3/positions/take-profit';
    const idKey = kind === 'sl' ? 'stopLossId' : 'takeProfitId';
    const masterLegId = req[idKey] || req.orderId || req.id;
    // Re-read only when the leg is unknown (e.g. added later). Reading after the master's move would show the master leg
    // at its new price while the follower's is still at the old one, and pairing needs the pre-move prices.
    if (op !== 'add' && !(entry.legs || []).some((l) => l.id === masterLegId)) await syncLegs(entry);
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
            logEvent(
              'ok',
              `↳ added ${KIND} ${req.triggerPrice}${body.quantity ? ' × ' + body.quantity : ''} on ${accLabel(f)} (${lat()})`,
            );
          } else {
            let fl = matchLeg(entry.legs, fp.legs, masterLegId);
            if (!fl) {
              await syncLegs(entry);
              fl = matchLeg(entry.legs, fp.legs, masterLegId);
            }
            if (!fl) {
              logEvent('warn', `↳ ${accLabel(f)} has no matching ${KIND} — skipped`);
              diag('bracket', { ...d, outcome: 'skipped', reason: 'no matching leg', met: false });
              return;
            }
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
              await acctPut(f, path, body);
              fl.price = parseFloat(req.triggerPrice);
              if (body.quantity != null) fl.qty = body.quantity;
              logEvent('ok', `↳ moved ${KIND} → ${req.triggerPrice} on ${accLabel(f)} (${lat()})`);
            } else {
              await acctDelete(f, path, body);
              fp.legs = fp.legs.filter((l) => l !== fl);
              logEvent('ok', `↳ removed ${KIND} on ${accLabel(f)} (${lat()})`);
            }
          }
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
  }

  // Canonical leverage key (2 dp), so "50", "50.0" and an effective "50.001027" compare equal and skip a redundant PUT.
  const levKey = (lev) => String(Math.round(parseFloat(lev) * 100) / 100);

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
      logEvent('warn', `↳ ${accLabel(f)} skipped — equity too small to hold any size (cap-to-fit).`);
      diag('open', { ...base, outcome: 'skipped', expected: 'skip-too-small', met: true });
      return null;
    }
    if (cq.scaled) logEvent('info', `↳ ${accLabel(f)} scaled ${o.qty} → ${cq.qty} (margin cap)`);
    try {
      const key = f + '|' + o.sym;
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
      const r = await acctPost(f, '/v3/positions/open', payload);
      const rec = { positionId: r.positionId, orderId: r.orderId, legs: legsOf(payload, r), qty: cq.qty };
      if (followersMap) followersMap[f] = rec;
      logEvent('ok', `↳ OPENED ${cq.qty} ${o.sym} ${o.side} on ${accLabel(f)} (${lat()})`);
      // the diag record stays open here; confirmFills fills in filled / slippage / margin / met
      const d = diag('open', {
        ...base,
        outcome: 'accepted',
        positionId: r.positionId,
        orderId: r.orderId,
        delayedOrderStatus: r.delayedOrderStatus || null,
        sendMs: msSince(t0),
        expected: 'fill',
        met: null,
      });
      return { accountId: f, orderId: r.orderId, positionId: r.positionId, label: accLabel(f), qty: cq.qty, diag: d };
    } catch (e) {
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

  // Close / reduce one follower, retrying once on a rate limit or server error: an exit that silently fails leaves that
  // follower in a trade the master has left.
  async function sendExit(f, path, body) {
    try {
      return await acctPost(f, path, body);
    } catch (e) {
      const code = errCode(e);
      if (code != null && code < 429) throw e;
      await sleep(EXIT_RETRY_MS);
      return acctPost(f, path, body);
    }
  }

  // Mirror a MASTER action to every follower. Quantities are 1:1 unless cap-to-fit is on. Followers use the master's
  // leverage for each order (pre-synced at arm, so the leverage PUT is normally skipped).
  function mirror(action, req, res, method = 'POST') {
    const followers = [...S.followers];
    if (!followers.length) return;
    const t0 = performance.now();
    const lat = () => '+' + msSince(t0) + 'ms';
    diag('master', {
      action,
      symbol: req.symbol,
      side: req.side,
      qty: req.quantity,
      leverage: req.leverage,
      positionId: req.positionId || res.positionId || null,
      orderId: res.orderId || null,
      triggerPrice: req.triggerPrice,
      followers: followers.length,
      fast: false,
    });
    const entry = req.positionId ? S.posMap[req.positionId] : null;
    const untracked = (what) => {
      logEvent(
        'warn',
        `↳ that position isn't tracked (opened while disarmed and not adopted) — the ${what} was NOT copied.`,
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
        qty,
        legs: legsOf(req, res),
        followers: {},
      });
      const jobs = followers.map((f) => openFollower(f, { side, sym, qty, lev, req }, e.followers, lat, false));
      e.queue = Promise.all(jobs).catch(() => {}); // later actions wait for the entries; entries never wait
      if (isImmediate(req)) {
        Promise.all(jobs).then((placed) =>
          confirmFills(sym, { accountId: S.master, orderId: res.orderId, qty }, placed.filter(Boolean), e, 'entry'),
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
            try {
              const r = await acctPost(f, '/v3/positions/append', body);
              const was = fp.qty;
              fp.qty = added(was, q);
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
      run.then(
        (placed) =>
          isImmediate(req) &&
          confirmFills(
            sym,
            {
              accountId: S.master,
              orderId: res.orderId,
              qty: req.quantity,
              undo: () => {
                entry.qty = added(entry.qty, -req.quantity);
              },
            },
            placed,
            entry,
            'add',
          ),
      );
    } else if (action === 'reduce') {
      logEvent('info', `MASTER reduced ${req.quantity} ${req.symbol} on ${accLabel(S.master)}`);
      if (!entry) return untracked('reduce');
      enqueue(entry, async () => {
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
              await sendExit(f, '/v3/positions/reduce', {
                positionId: fp.positionId,
                orderType: 'market',
                leverage: req.leverage,
                quantity: rq,
                timeInForce: 'IOC',
                reduceOnly: true,
                symbol: req.symbol,
              });
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
      });
    } else if (action === 'close') {
      logEvent('info', `MASTER closed ${req.symbol} on ${accLabel(S.master)}`);
      if (!entry) return untracked('close');
      delete S.posMap[req.positionId];
      enqueue(entry, async () => {
        const placed = await Promise.all(
          followers.map(async (f) => {
            const fp = entry.followers[f],
              d = { ...who(f), symbol: req.symbol };
            if (!fp) return null; // never in this trade: nothing to close
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
              logEvent('warn', `↳ ${accLabel(f)} CLOSE failed: ${e.message} — it is still OPEN. Close it on Vest.`);
              diag('close', { ...d, outcome: 'rejected', error: e.message, errorCode: errCode(e), met: false });
              return null;
            }
          }),
        );
        confirmFills(
          req.symbol,
          { accountId: S.master, orderId: res.orderId, qty: entry.qty || '0' },
          placed.filter(Boolean),
          null,
          'close',
        );
      });
    } else if (action === 'stop-loss' || action === 'take-profit') {
      // PUT moves an existing stop/target, POST adds one to the open position, DELETE removes one.
      const kind = action === 'stop-loss' ? 'sl' : 'tp',
        KIND = kind === 'sl' ? 'SL' : 'TP';
      const op = method === 'POST' ? 'add' : method === 'DELETE' ? 'remove' : 'move';
      logEvent(
        'info',
        op === 'add'
          ? `MASTER added ${KIND} ${req.triggerPrice}${req.quantity != null ? ' × ' + req.quantity : ''} on ${accLabel(S.master)}`
          : op === 'remove'
            ? `MASTER removed a ${KIND} on ${accLabel(S.master)}`
            : `MASTER moved ${KIND} → ${req.triggerPrice} on ${accLabel(S.master)}`,
      );
      if (!entry) return untracked(`${KIND} change`);
      enqueue(entry, () => mirrorLeg(op, kind, req, entry, followers, lat, t0));
    } else if (action === 'cancel-order') {
      const e = entryByOrderId(req.orderId);
      logEvent('info', `MASTER cancelled a resting order on ${accLabel(S.master)}`);
      if (!e) return untracked('cancel');
      const key = Object.keys(S.posMap).find((k) => S.posMap[k] === e);
      if (key) delete S.posMap[key];
      enqueue(e, () =>
        Promise.all(
          followers.map(async (f) => {
            const fp = e.followers[f];
            if (!fp || !fp.orderId) return;
            try {
              await acctPost(f, '/v3/positions/cancel-order', { orderId: fp.orderId });
              logEvent('ok', `↳ cancelled order on ${accLabel(f)} (${lat()})`);
              diag('cancel', { ...who(f), orderId: fp.orderId, outcome: 'cancelled', met: true, ms: msSince(t0) });
            } catch (err) {
              logEvent(
                'warn',
                `↳ ${accLabel(f)} cancel failed: ${err.message} — its order is still resting. Cancel it on Vest.`,
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
        ),
      );
    }
  }

  // ───────────────────────── fast mode (fire follower opens at master-send) ─────────────────────────
  // Returns a `pending` descriptor if it fired follower opens for a master OPEN; otherwise null.
  function maybeFastOpen(url, reqBody, auth) {
    if (!S.armed || !S.fast || S.flattening || orderAction(url) !== 'open') return null;
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
    diag('master', { action: 'open', symbol: sym, side, qty, leverage: lev, followers: followers.length, fast: true });
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
    if (status >= 200 && status < 300 && res.positionId && !S.posMap[res.positionId]) {
      // posMap.followers is the SAME object as pending.byId, so follower opens still in flight are linked too
      const e = (S.posMap[res.positionId] = {
        master: S.master,
        side: pending.side,
        symbol: pending.sym,
        masterOrderId: res.orderId,
        qty: pending.qty,
        legs: legsOf(pending.req, res),
        followers: pending.byId,
      });
      e.queue = Promise.all(pending.jobs).catch(() => {});
      if (!isImmediate(pending.req)) return;
      Promise.all(pending.jobs).then(() =>
        confirmFills(
          pending.sym,
          { accountId: S.master, orderId: res.orderId, qty: pending.qty },
          pending.placed,
          e,
          'entry',
        ),
      );
      return;
    }
    Promise.all(pending.jobs).then(() => {
      const list = Object.entries(pending.byId).map(([accountId, v]) => ({
        accountId,
        positionId: v.positionId,
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
    const items = list.map((o) => ({ ...o, symbol: sym }));
    S.orphan = { list: [...((S.orphan && S.orphan.list) || []), ...items] };
    if (S.autoFlatten && !masterIn) flattenOrphans();
    else render();
  }
  async function flattenOrphans() {
    const o = S.orphan;
    if (!o) return;
    S.orphan = null;
    logEvent('warn', `Flattening ${o.list.length} orphan follower position(s)…`);
    for (const v of o.list) {
      const lev = v.leverage || (S.byId[v.accountId] && S.byId[v.accountId].leverage) || DEFAULT_LEVERAGE;
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
  // was, ready for the next trade. While the sweep runs nothing new is copied, an arm in progress is cancelled, follower
  // orders still in flight are waited for, and a second sweep catches anything that landed during the first.
  async function flattenAccount(id) {
    const { token } = await mintAccountToken(id);
    const [posR, ordR] = await Promise.all([
      api('/v3/positions/opened', token),
      api('/v3/positions/opened-orders', token),
    ]);
    const positions = (posR && posR.positions) || [],
      orders = (ordR && ordR.orders) || [];
    for (const o of orders) {
      // resting orders first
      const oid = o.orderId || o.order_id || o.id;
      if (!oid) continue;
      try {
        await acctPost(id, '/v3/positions/cancel-order', { orderId: oid });
        logEvent('ok', `↳ cancelled a resting order on ${accLabel(id)}`);
      } catch (e) {
        logEvent('warn', `↳ ${accLabel(id)} cancel failed: ${e.message}`);
      }
    }
    for (const p of positions) {
      const pid = posIdOf(p),
        sym = p.symbol;
      if (!pid || !sym) continue;
      const lev = p.leverage || (S.byId[id] && S.byId[id].leverage) || DEFAULT_LEVERAGE;
      try {
        await sendExit(id, '/v3/positions/close', closeBody(sym, pid, lev));
        logEvent('ok', `↳ closed ${sym} on ${accLabel(id)}`);
      } catch (e) {
        logEvent('warn', `↳ ${accLabel(id)} close failed: ${e.message}`);
      }
    }
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
    _armEpoch++; // an arm in progress would adopt positions that are being closed
    S.orphan = null;
    Object.values(S.plans).forEach((p) => endPlan(p, null)); // nothing left for breakeven to manage
    render();
    logEvent(
      'warn',
      `FLATTEN ALL — closing every position and cancelling every order on ${ids.length} account(s).${S.armed ? ' The copier stays armed for your next trade.' : ''}`,
    );
    diag('flatten_all', { accounts: ids.length, armed: S.armed });
    const inFlight = Object.values(S.posMap)
      .map((e) => e.queue)
      .filter(Boolean);
    await Promise.race([Promise.all(inFlight), sleep(FLATTEN_WAIT_MS)]);
    S.posMap = {};
    const sweep = () =>
      Promise.all(
        ids.map((id) =>
          flattenAccount(id).catch((e) => {
            logEvent('warn', `↳ ${accLabel(id)} couldn't be read: ${e.message}`);
            return 1;
          }),
        ),
      );
    await sweep();
    await sleep(FLATTEN_RECHECK_MS);
    const left = (await sweep()).reduce((a, b) => a + b, 0);
    S.flattening = false;
    if (left)
      logEvent('warn', 'Flatten All: some positions or orders needed a second pass — check every account on Vest.');
    else logEvent('ok', 'Flatten All complete — every account is flat.');
    setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
    render();
  }

  // ───────────────────────── trade panel: order math (pure) ─────────────────────────
  // Everything here is a pure function of its inputs — no network, no state — so it's unit-tested.
  const decimalsOf = (step) => {
    const s = String(step);
    return s.includes('.') ? s.split('.')[1].length : 0;
  };
  /** Round a price to the symbol's tick (e.g. 0.25 for NDX). */
  const roundTick = (price, tick) => +(Math.round(price / tick) * tick).toFixed(decimalsOf(tick));
  /** Floor a size to the symbol's size step (e.g. 0.0001). */
  const floorStep = (qty, step) => +(Math.floor(qty / step + 1e-9) * step).toFixed(decimalsOf(step));

  /**
   * Split a total size across N targets.
   *   even  — equal slices
   *   start — heaviest first (weights N … 1): bank most at the first target
   *   end   — heaviest last  (weights 1 … N): let most of it run to the last target
   * Works in whole size-steps (largest-remainder method): each slice is floored, then the leftover steps go to
   * the slices that were rounded down the most — so the total is exact and slices stay as even as possible
   * (1.0 over 3, start → 0.5000 / 0.3333 / 0.1667). Returns { qtys } or { error } if a slice would be empty.
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
   * Turn point distances into trigger prices from an entry price.
   * long: stop below, targets above · short: stop above, targets below. Targets must be increasing distances.
   */
  function planPrices({ side, entry, stopPts, targetPts, tick }) {
    if (!(entry > 0)) return { error: 'No live price yet' };
    if (!(stopPts > 0)) return { error: 'Stop must be above zero points' };
    if (!targetPts.length) return { error: 'Add at least one target' };
    for (let i = 0; i < targetPts.length; i++) {
      if (!(targetPts[i] > 0)) return { error: `Target ${i + 1} must be above zero points` };
      if (i && !(targetPts[i] > targetPts[i - 1])) return { error: `Target ${i + 1} must be further than target ${i}` };
    }
    const dir = side === 'long' ? 1 : -1;
    return {
      stop: roundTick(entry - dir * stopPts, tick),
      targets: targetPts.map((p) => roundTick(entry + dir * p, tick)),
    };
  }

  /** Size from a dollar risk: qty = risk ÷ (stop points × $ per point per unit), floored to the size step. */
  const riskQty = (riskUsd, stopPts, pointValue, step) =>
    riskUsd > 0 && stopPts > 0 && pointValue > 0 ? floorStep(riskUsd / (stopPts * pointValue), step) : 0;

  /** Breakeven stop price: entry plus an offset in your favour (e.g. +1 pt covers fees), tick-rounded. */
  const breakevenPrice = ({ side, entry, offsetPts, tick }) =>
    roundTick(entry + (side === 'long' ? 1 : -1) * (offsetPts || 0), tick);
  /**
   * Should the stop move to breakeven now?  mode: 'off' | 'tp1' (after the first target fills) | 'points'
   * (price has moved `triggerPts` in your favour). Never fires twice.
   */
  function breakevenDue({ mode, side, entry, price, triggerPts, tp1Filled, alreadyMoved }) {
    if (alreadyMoved || mode === 'off' || !mode) return false;
    if (mode === 'tp1') return !!tp1Filled;
    if (mode === 'points')
      return triggerPts > 0 && price > 0 && (side === 'long' ? price - entry : entry - price) >= triggerPts;
    return false;
  }

  /**
   * Vest's "Trading Power", the order value its own ticket allows at 100%: free cash (less any open loss) times leverage,
   * less room for the opening fee and a 0.1% allowance for the spread.
   */
  const TRADING_POWER_SPREAD = 0.001;
  const tradingPower = ({ free, upnl, leverage, takerFee }) =>
    leverage > 0 && free > 0
      ? (Math.max(0, free + Math.min(0, upnl || 0)) * leverage) /
        (1 + leverage * (takerFee || 0)) /
        (1 + TRADING_POWER_SPREAD)
      : 0;
  /** The largest size that power buys at `price` (Vest prices margin at the margin mark price), floored to the step. */
  const maxQtyFor = (power, price, step) => (power > 0 && price > 0 ? floorStep(power / price, step) : 0);

  /**
   * Where a position of `qty` (the whole position after this order) fails or passes, measured from the price now.
   * `equity` is the account's equity at that price; the opening fee comes straight out of it. Fail: equity reaches the
   * floor (drawdown, or the daily-loss floor when higher). Pass: equity reaches the target (evaluations only).
   */
  function failPassPrices({ side, qty, price, equity, openFee, floor, target }) {
    if (!(qty > 0) || !(price > 0) || !Number.isFinite(equity)) return { fail: null, pass: null };
    const dir = side === 'long' ? 1 : -1,
      e = equity - (openFee || 0);
    const fail = floor > 0 && e > floor ? price - (dir * (e - floor)) / qty : null;
    const pass = target > 0 && target > e ? price + (dir * (target - e)) / qty : null;
    return { fail: fail > 0 ? fail : null, pass: pass > 0 ? pass : null };
  }
  /**
   * The allowed range, so the panel can say where the stop may go and how much can be risked. Size = risk ÷ stop, the
   * size is capped by Vest's max, and a stop-out (plus both fees) must stay under the room left to the floor.
   *   minStopFor:    the smallest stop (whole ticks) at which `risk` fits in the max size
   *   maxRiskAt:     the most that can be risked (whole dollars) at this stop with the max size
   *   maxRiskForRoom: the most that can be risked at this stop before a stop-out, fees included, reaches the floor
   *   maxStopForRoom: the widest stop (whole ticks) for `qty` before a stop-out, fees included, reaches the floor
   */
  const minStopFor = (risk, maxQty, tick) =>
    risk > 0 && maxQty > 0 ? +(Math.ceil(risk / maxQty / tick - 1e-9) * tick).toFixed(decimalsOf(tick)) : null;
  const maxRiskAt = (maxQty, stopPts) => (maxQty > 0 && stopPts > 0 ? Math.floor(maxQty * stopPts + 1e-9) : null);
  const maxRiskForRoom = ({ room, price, stopPts, takerFee }) =>
    room > 0 && price > 0 && stopPts > 0
      ? Math.max(0, Math.floor(room / (1 + ((2 * price - stopPts) * (takerFee || 0)) / stopPts) - 0.01))
      : null;
  const maxStopForRoom = ({ room, qty, price, takerFee, tick }) => {
    if (!(room > 0) || !(qty > 0) || !(price > 0)) return null;
    const f = takerFee || 0,
      pts = (room - 0.01 - 2 * qty * price * f) / (qty * (1 - f));
    return pts > 0 ? +(Math.floor(pts / tick + 1e-9) * tick).toFixed(decimalsOf(tick)) : 0;
  };
  /** What a stop-out costs from the price now: the move to the stop on the whole position, plus both fees. */
  const stopOutLoss = ({ side, qty, price, stopPrice, openFee, takerFee }) =>
    (side === 'long' ? 1 : -1) * qty * (price - stopPrice) + (openFee || 0) + qty * stopPrice * (takerFee || 0);

  if (window.__VC_TEST__)
    window.__vcMath = {
      roundTick,
      floorStep,
      splitQty,
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
    };

  // ───────────────────────── live price (public market data, read-only) ─────────────────────────
  // Vest's public socket streams `<SYMBOL>@ticker` with the mark price about every 750 ms. Stops and targets are computed
  // from it and breakeven watches it. This is the copier's own read-only connection, open only while the Trade tab or a
  // breakeven plan needs a price. A socket that goes quiet is closed and reopened, with backoff.
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
  const priceOf = (sym) => {
    const p = S.price[sym];
    return p && Date.now() - p.at < PRICE_STALE_MS ? p.px : null;
  };
  // The price Vest values a new market order's margin at (its ticker's margin mark price), else the mark price.
  const marginPriceOf = (sym) => {
    const px = priceOf(sym);
    return px && S.price[sym].mpx > 0 ? S.price[sym].mpx : px;
  };
  function watchPrice(sym) {
    _wsSyms.add(sym);
    connectPrices();
    fetchPriceOnce(sym);
  }
  // Stop streaming symbols nothing needs any more, and close the socket when none are left.
  function unwatchUnused() {
    const need = new Set(Object.values(S.plans || {}).map((p) => p.symbol));
    if (S.tradeOpen) need.add(S.trade.symbol);
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
      } catch {}
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
        } catch {}
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
        } catch {}
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
      if (!m || typeof m.channel !== 'string' || !m.channel.endsWith('@ticker')) return;
      const px = parseFloat(m.data && m.data.markPrice);
      if (!(px > 0)) return;
      if (_feedWarned) {
        _feedWarned = false;
        logEvent('info', 'Live price feed back.');
      }
      onPrice((m.data && m.data.symbol) || m.channel.split('@')[0], px, parseFloat(m.data.marginMarkPrice));
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
      _ws.send(JSON.stringify({ method: 'SUBSCRIBE', params: [..._wsSyms].map((s) => s + '@ticker'), id: Date.now() }));
    } catch {}
  }
  async function fetchPriceOnce(sym) {
    // REST fallback so the tab has a price immediately
    try {
      const r = await (await _fetch(`${API}/v3/ticker/latest?symbols=${encodeURIComponent(sym)}`)).json();
      const t = (r.tickers || []).find((x) => x.symbol === sym);
      const px = t ? parseFloat(t.markPrice) : NaN;
      if (px > 0 && !priceOf(sym)) onPrice(sym, px, parseFloat(t.marginMarkPrice));
    } catch {}
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
    } catch {}
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
        tick,
        step: +step.toFixed(+x.sizeDecimals),
        label,
        pointValue: 1,
        takerFee: parseFloat(x.takerFee) || 0, // fraction of notional per fill (NQ 0.000025)
        margin,
      };
    } catch {}
  }
  const symLabel = (sym) => (SYMBOLS[sym] && SYMBOLS[sym].label) || String(sym).replace(/-USD-PERP$|-PERP$/, '');
  function onPrice(sym, px, mpx) {
    S.price[sym] = { px, mpx: mpx > 0 ? mpx : null, at: Date.now() };
    try {
      checkPlans(sym, px);
    } catch (e) {
      diag('breakeven', { outcome: 'error', error: e.message });
    }
    if (S.tradeOpen) updateTrade();
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
        adopted[m.positionId].followers[f] = { positionId: fp.positionId, orderId: null, legs: fp.legs, qty: fp.qty };
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
            `Left ${accLabel(f)} ${symLabel(sym)} leverage at ${show(had)} (position open) — re-arm when flat to sync.`,
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
  async function arm() {
    if (S.arming) return;
    if (S.flattening) return toast('Wait for Flatten All to finish.');
    if (!S.ack) {
      S.ackThenArm = true; // arm right after the terms are accepted
      S.rulesOpen = true;
      render();
      return;
    } // the one-time agreement comes first
    if (!S.master) return toast('Pick a master account first.');
    if (!S.followers.size) return toast('Pick at least one follower.');
    if (healthState().changed) {
      // Vest shipped an update that hasn't been checked
      logEvent('warn', 'Not armed — Vest updated its site. Run the site check and accept the build first.');
      return openSiteCheck();
    }
    const epoch = ++_armEpoch;
    const master = S.master,
      followers = [...S.followers];
    const unchanged = () =>
      S.master === master && S.followers.size === followers.length && followers.every((f) => S.followers.has(f));
    S.arming = true;
    render();
    try {
      logEvent('info', 'Checking open positions…');
      const plan = await planArm(master, followers);
      if (plan.error) {
        logEvent('warn', 'Not armed — ' + plan.error + '.');
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
        logEvent('warn', 'Not armed — disarmed or flattened while arming.');
        return;
      }
      if (!unchanged()) {
        logEvent('warn', 'Not armed — the selection changed while arming. Click ARM again.');
        return;
      }

      S.posMap = plan.adopted; // {} when flat; adopted trades otherwise
      S.armed = true;
      const trades = Object.values(plan.adopted);
      logEvent(
        'warn',
        `ARMED · copying live${S.capFit ? ' · cap-to-fit' : ''}. Master ${accLabel(master)} → ${followers.map(accLabel).join(', ')}.`,
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
    S.armed = false;
    S.posMap = {};
    S.orphan = null;
    logEvent('info', 'Disarmed.');
    diag('disarm', {});
    render();
  }

  // ───────────────────────── selection ─────────────────────────
  function setMaster(id) {
    if (S.arming) return toast('Wait for arming to finish.');
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
    if (S.arming) return toast('Wait for arming to finish.');
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
  function persistLog() {
    store.set(
      LOG_KEY,
      S.log.map((e) => ({ t: e.t.toISOString(), level: e.level, msg: e.msg })),
    );
  }
  function loadLog() {
    const l = store.get(LOG_KEY, []);
    S.log = Array.isArray(l) ? l.map((e) => ({ t: new Date(e.t), level: e.level, msg: e.msg })) : [];
  }
  // The risk acknowledgement is versioned: raising TERMS_VERSION asks everyone to accept the new terms once.
  const TERMS_VERSION = 2;
  function loadAck() {
    const a = store.get(ACK_KEY, null);
    S.ack = !!(a && typeof a === 'object' && a.v >= TERMS_VERSION);
  }
  function saveAck() {
    store.set(ACK_KEY, { v: TERMS_VERSION, at: new Date().toISOString() });
  }
  function loadOpts() {
    const o = store.get(OPTS_KEY, {}) || {};
    S.fast = !!o.fast;
    S.autoFlatten = !!o.autoFlatten;
    S.capFit = !!o.capFit;
    S.checkUpdates = o.checkUpdates !== false; // on by default
  }
  function saveOpts() {
    diag('settings', { fast: S.fast, autoFlatten: S.autoFlatten, capFit: S.capFit, checkUpdates: S.checkUpdates });
    store.set(OPTS_KEY, { fast: S.fast, autoFlatten: S.autoFlatten, capFit: S.capFit, checkUpdates: S.checkUpdates });
  }
  function loadTrade() {
    const t = store.get(TRADE_KEY, null);
    if (!t || typeof t !== 'object') return;
    Object.assign(S.trade, t, {
      symbol: SYMBOLS[t.symbol] ? t.symbol : S.trade.symbol,
      targets: Array.isArray(t.targets) && t.targets.length ? t.targets : S.trade.targets,
    });
  }
  function saveTrade() {
    store.set(TRADE_KEY, S.trade);
  }
  function toggleFast() {
    S.fast = !S.fast;
    saveOpts();
    logEvent('info', S.fast ? 'Fast mode on — follower entries fire the instant the master sends.' : 'Fast mode off.');
    render();
  }
  function toggleAutoFlatten() {
    S.autoFlatten = !S.autoFlatten;
    saveOpts();
    logEvent('info', S.autoFlatten ? 'Auto-flatten on.' : 'Auto-flatten off (you will be asked).');
    render();
  }
  function toggleCapFit() {
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
    S.log.unshift({ t: new Date(), level, msg });
    S.log = S.log.slice(0, LOG_MAX);
    LOG(msg);
    persistLog();
    renderLog();
  }
  function clearLog() {
    S.log = [];
    persistLog();
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
  function downloadLog() {
    const rows = [...S.log].reverse();
    const csv =
      `time,level,message\n${new Date().toISOString()},info,"Exported from Vest Copier v${VERSION} (Vest build ${fingerprint() || 'unknown'})"\n` +
      rows.map((e) => `${e.t.toISOString()},${e.level},"${String(e.msg).replace(/"/g, '""')}"`).join('\n');
    saveFile(`vest-copier-log-${stamp()}.csv`, 'text/csv', csv);
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
    S.diag = Array.isArray(d) ? d : [];
  }
  // Kept under a size budget: this page's storage is shared with Vest's own site, which must never run out of room.
  function persistDiag() {
    let json = JSON.stringify(S.diag);
    while (json.length > DIAG_MAX_BYTES && S.diag.length > 10) {
      S.diag.splice(0, Math.ceil(S.diag.length / 10));
      json = JSON.stringify(S.diag);
    }
    try {
      localStorage.setItem(DIAG_KEY, json);
    } catch {}
  }
  function persistDiagSoon() {
    if (_diagTimer) return;
    _diagTimer = setTimeout(() => {
      _diagTimer = null;
      persistDiag();
    }, 1200);
  }
  function diag(type, data) {
    const rec = { t: new Date().toISOString(), type, ...data };
    S.diag.push(rec);
    if (S.diag.length > DIAG_MAX) S.diag.splice(0, S.diag.length - DIAG_MAX);
    persistDiagSoon();
    return rec;
  }
  function downloadDiag() {
    persistDiag();
    const payload = {
      exportedAt: new Date().toISOString(),
      version: VERSION,
      build: fingerprint() || null,
      records: S.diag.length,
      diagnostics: S.diag,
    };
    saveFile(`vest-copier-diagnostics-${stamp()}.json`, 'application/json', JSON.stringify(payload, null, 2));
    logEvent('info', `Diagnostics exported (${S.diag.length} records).`);
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
    } catch {}
    try {
      for (const s of document.scripts) {
        const m = (s.src || '').match(/\/index-([A-Za-z0-9_-]{6,})\.js(?:$|\?)/);
        if (m) return m[1];
      }
    } catch {}
    try {
      for (const s of document.scripts) {
        const d = (s.src || '').match(/[?&]dpl=(?:dpl_)?([A-Za-z0-9]{6,})/);
        if (d) return d[1].slice(0, 12);
      }
    } catch {}
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
    } catch {}
    return null;
  };
  const BUILD_KEY = 'vc-known-build-v3';
  let _unknownBuildChecked = false;
  // First run on this browser: trust the build that is loaded now.
  function initBuild() {
    const fp = fingerprint();
    try {
      if (fp && !localStorage.getItem(BUILD_KEY)) localStorage.setItem(BUILD_KEY, fp);
    } catch {}
  }
  const healthState = () => {
    const fp = fingerprint();
    let last = null;
    try {
      last = localStorage.getItem(BUILD_KEY);
    } catch {}
    if (!fp)
      return _unknownBuildChecked
        ? { level: 'amber', text: 'build unknown (checked)', changed: false }
        : { level: 'amber', text: "Can't identify Vest's build — click to run site check", changed: true };
    if (last && last !== fp) return { level: 'amber', text: 'Vest updated — click to run site check', changed: true };
    return { level: 'green', text: 'build ' + fp, changed: false };
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
      } catch {} // API unavailable or rate-limited: fall back to the raw file
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
  function dismissUpdate() {
    S.update.dismissed = S.update.latest;
    store.set(UPDATE_KEY, { dismissed: S.update.dismissed });
    renderUpdate();
  }
  function renderUpdate() {
    const bar = _root && _root.querySelector('.update');
    if (!bar || !S.update) return;
    const { state, latest, dismissed } = S.update;
    let html = '';
    if (state === 'checking') html = '<span class="utext">Checking for updates…</span>';
    else if (state === 'current') html = `<span class="utext">Up to date · v${VERSION}</span>`;
    else if (state === 'error')
      html = '<span class="utext">Couldn\'t check for updates — try Settings → Check now later.</span>';
    else if (state === 'installing')
      html = S.armed
        ? `<span class="utext">After updating in Tampermonkey, reload Vest to run v${esc(latest)}. Reloading disarms the
            copier; arm again afterwards (an open trade is adopted).</span>
          <button class="ubtn" data-act="update-reload">Reload now</button>`
        : '<span class="utext">Click <b>Update</b> in Tampermonkey, then come back: Vest reloads by itself.</span>';
    else if (state === 'available' && dismissed !== latest) {
      html = `<span class="utext"><b>Update available: v${esc(latest)}</b> (you have v${VERSION})${S.armed ? ' · install when flat' : ''}</span>
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
    if (reload) reload.onclick = () => location.reload();
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
    else location.reload();
  });

  // ───────────────────────── support (optional referral code) ─────────────────────────
  // Asked once, after the terms are accepted: "Support the free copier with code AMPED?" If the account already uses
  // another code, the question names it, so switching is the user's informed choice. Yes tries Vest's own referral-join
  // call (the one behind Vest's "Have a Referral Code?" dialog); if Vest won't link it, the user is told to enter the
  // code once in the purchase window's discount box (and it's put on the clipboard). No records the answer and it is
  // never asked again. Nothing changes without the click; an account already using AMPED is never asked.
  const SUPPORT_CODE = 'AMPED';
  const SUPPORT_DEBUG = false; // test builds: log each step of the purchase-window switch in the activity log
  const supportStep = (msg) => SUPPORT_DEBUG && logEvent('info', '[code test] ' + msg);
  const SUPPORT_KEY = 'vc-support'; // { answered: 'yes' | 'manual' | 'no' | 'had-code', at, apply? }
  // 'had-code' (already using a code) isn't a real answer: re-check it, so only accounts on AMPED stay unasked.
  const supportAnswer = () => {
    const a = (store.get(SUPPORT_KEY, null) || {}).answered || null;
    return a === 'had-code' ? null : a;
  };
  const saveSupport = (answered) => store.set(SUPPORT_KEY, { answered, at: new Date().toISOString() });
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
  async function maybeOfferSupport() {
    if (!S.ack || supportAnswer() || !userTokenOk()) return;
    const code = await attachedRefCode(); // null when it can't be read: ask without naming a current code
    if (code && code.toUpperCase() === SUPPORT_CODE) {
      saveSupport('had-code'); // already supporting
      const link = _root && _root.querySelector('[data-act="code"]');
      if (link) link.hidden = true;
      return;
    }
    S.supportCurrent = code || null;
    S.supportOffer = true;
    renderSupport();
  }
  // Put the code on the clipboard (the click that triggered this counts as the user gesture browsers ask for).
  const copySupportCode = () =>
    navigator.clipboard.writeText(SUPPORT_CODE).then(
      () => true,
      () => false,
    );
  async function acceptSupport() {
    S.supportOffer = false;
    saveSupport('yes');
    renderSupport();
    logEvent(
      'ok',
      `Thank you! ${SUPPORT_CODE} will be used in Vest's purchase window from now on (Settings → Support to turn off).`,
    );
    // Also try Vest's referral link, which only some accounts accept; the purchase window covers everyone else.
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

  // ── Using the code in Vest's purchase window, for users who said Yes. Each time the window's discount box appears,
  // its code is switched to AMPED the way a person would do it: clear the applied code (✕), type AMPED, press Enter.
  // Vest validates and applies it. If Vest refuses it (for example on the code owner's own account), the previous
  // code is put back. It acts once per opening, so a code the user picks by hand afterwards is left alone, and every
  // switch is announced in the activity log.
  // Vest has more than one discount box. The purchase window's is an editable field (styled to show its code in
  // capitals) holding the applied code: type another code + Enter, and on success Vest redraws the box with it. The
  // account-builder screen's shows "CODE 5%" read-only with a ✕ to clear it first.
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
  const supportApplies = () => {
    const v = store.get(SUPPORT_KEY, null) || {};
    return (v.answered === 'yes' || v.answered === 'manual') && v.apply !== false;
  };
  function setSupportApply(on) {
    const v = store.get(SUPPORT_KEY, null) || {};
    store.set(SUPPORT_KEY, { ...v, apply: on });
  }
  const _seenBoxes = new WeakSet();
  let _boxScan = null;
  function watchPurchaseWindow() {
    new MutationObserver(() => {
      if (_boxScan || !supportApplies()) return;
      _boxScan = setTimeout(() => {
        // the page changes constantly (prices); look at most a few times a second
        _boxScan = null;
        for (const el of document.querySelectorAll('input[placeholder], input[role="combobox"]')) {
          if (SUPPORT_DEBUG && !_seenBoxes.has(el) && el.closest('[role="dialog"]')) {
            _seenBoxes.add(el); // test builds: report every input in a dialog, to see what the purchase window holds
            supportStep(
              `dialog input: placeholder="${el.placeholder}" role=${el.getAttribute('role')} value="${el.value}" match=${isDiscountBox(el)}`,
            );
            if (!isDiscountBox(el)) continue;
            useSupportCode(el).catch((e) => supportStep('error: ' + e.message));
            continue;
          }
          if (!isDiscountBox(el) || _seenBoxes.has(el)) continue;
          _seenBoxes.add(el);
          useSupportCode(el).catch((e) => diag('support', { outcome: 'apply-error', error: e.message }));
        }
      }, 250);
    }).observe(document.documentElement, { childList: true, subtree: true });
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
  async function useSupportCode(input) {
    await sleep(300); // let the window finish opening
    if (!input.isConnected) return;
    if (input.readOnly) return useSupportCodeReadOnly(input);
    const before = input.value.trim().toUpperCase();
    supportStep(`discount box found: current code "${before || '(none)'}"`);
    if (before === SUPPORT_CODE) return;
    // Applied = Vest redrew the box (the old field is gone) and the new one holds the code without an error flag.
    const applied = () =>
      !input.isConnected &&
      [...document.querySelectorAll('input')].some(
        (el) =>
          isDiscountBox(el) &&
          el.value.trim().toUpperCase() === SUPPORT_CODE &&
          el.getAttribute('aria-invalid') !== 'true',
      );
    const refused = () => input.isConnected && input.getAttribute('aria-invalid') === 'true';
    typeInto(input, SUPPORT_CODE);
    supportStep(`typed ${SUPPORT_CODE}: box now "${input.value}"`);
    pressEnter(input);
    let ok = await waitFor(() => applied() || refused(), 3000);
    if (!applied() && !refused() && input.isConnected) {
      // Enter didn't take: click the box's Use button instead
      const group = input.closest('[data-slot="input-group"]') || input.parentElement;
      const use = [...group.querySelectorAll('button')].find((b) => /^\s*use\s*$/i.test(b.textContent));
      supportStep(use ? 'Enter did nothing; clicking Use' : 'Enter did nothing and no Use button was found');
      if (use) use.click();
      ok = await waitFor(() => applied() || refused(), 5000);
    }
    if (applied()) {
      logEvent('ok', `Purchase window: discount code set to ${SUPPORT_CODE}${before ? ` (was ${before})` : ''}.`);
      diag('support', { outcome: 'applied', replaced: before || null });
      return;
    }
    // Refused (or no answer): Vest kept the previous code applied; show it in the box again.
    supportStep(
      `not applied: aria-invalid=${input.getAttribute('aria-invalid')} connected=${input.isConnected} answered=${ok}`,
    );
    if (input.isConnected) typeInto(input, before);
    logEvent(
      'info',
      `Purchase window: Vest didn't accept ${SUPPORT_CODE} here${before ? `, so ${before} stays` : ''}.`,
    );
    diag('support', { outcome: 'apply-refused', kept: before || null });
  }
  // The account-builder screen's box: "CODE 5%" read-only, with a ✕ to clear it before typing another code.
  async function useSupportCodeReadOnly(input) {
    const codeOf = () => (input.value.trim().split(/\s+/)[0] || '').toUpperCase();
    const applied = () => input.readOnly && !!codeOf();
    const before = applied() ? codeOf() : '';
    supportStep(`read-only discount box found: current code "${before || '(none)'}"`);
    if (before === SUPPORT_CODE) return;
    const clearApplied = async () => {
      const x = (input.closest('[data-slot="input-group"]') || input.parentElement).querySelector('button');
      supportStep(x ? 'clicking ✕ to remove the applied code' : 'no ✕ button found next to the box');
      if (x) x.click();
      return waitFor(() => !input.readOnly, 1500);
    };
    const enter = async (code) => {
      typeInto(input, code);
      pressEnter(input);
      const ok = await waitFor(() => applied() && codeOf() === code, 5000);
      supportStep(`entered ${code}: ${ok ? 'applied' : 'not applied'}`);
      return ok;
    };
    if (before && !(await clearApplied())) return supportStep('stopped: the applied code could not be removed');
    if (await enter(SUPPORT_CODE)) {
      logEvent('ok', `Purchase window: discount code set to ${SUPPORT_CODE}${before ? ` (was ${before})` : ''}.`);
      diag('support', { outcome: 'applied', replaced: before || null });
      return;
    }
    if (before) {
      if (input.readOnly) await clearApplied();
      await enter(before);
    }
    logEvent(
      'info',
      `Purchase window: Vest didn't accept ${SUPPORT_CODE} here${before ? `, so ${before} was put back` : ''}.`,
    );
    diag('support', { outcome: 'apply-refused', restored: before || null });
  }

  function declineSupport() {
    S.supportOffer = false;
    saveSupport('no');
    renderSupport();
  }
  function renderSupport() {
    const bar = _root && _root.querySelector('.support');
    if (!bar) return;
    bar.hidden = !S.supportOffer;
    if (!S.supportOffer || bar.dataset.ready) return;
    bar.dataset.ready = '1';
    const cur = S.supportCurrent ? esc(S.supportCurrent) : null;
    const ask = cur
      ? `You currently use code <b>${cur}</b>. Switch to <b>${SUPPORT_CODE}</b>?`
      : `Use code <b>${SUPPORT_CODE}</b>?`;
    bar.innerHTML = `<span class="utext"><b>Vest Copier is free.</b> ${ask} It takes <b>5% off</b> your Vest purchases
        (the highest discount available) and helps keep the copier maintained until Vest releases its own. Yes sets
        AMPED in Vest's purchase window from now on (Settings → Support turns it off). Asked only this once.</span>
      <button class="ubtn" data-act="support-yes">${cur ? 'Yes, switch to' : 'Yes, use'} ${SUPPORT_CODE}</button>
      <button class="ubtn ghost" data-act="support-no">${cur ? `Keep ${cur}` : 'No thanks'}</button>`;
    bar.querySelector('[data-act="support-yes"]').onclick = acceptSupport;
    bar.querySelector('[data-act="support-no"]').onclick = declineSupport;
  }

  // ───────────────────────── site check (run after Vest ships an update) ─────────────────────────
  // Read-only: probes every endpoint the copier reads and checks the responses still have the fields it uses, then scans
  // Vest's loaded code for the order endpoints and payload fields it sends. Places no orders. Stop-loss / take-profit
  // paths are built at runtime in Vest's code, so those are covered by the live per-order guard (checkShape) and a small
  // test trade.
  const SCAN_TERMS = [
    '/v3/positions/open',
    '/v3/positions/append',
    '/v3/positions/reduce',
    '/v3/positions/close',
    '/v3/positions/cancel-order',
    '/v3/auth/account-token',
    '/v3/positions/opened-orders',
    '/v3/executions',
    '/v3/user-state',
    'takeProfits',
    'stopLosses',
    'reduceOnly',
    'timeInForce',
    'triggerPrice',
  ];
  // A whole term: "/v3/positions/open" must not be satisfied by "/v3/positions/opened".
  const hasTerm = (code, term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '(?![\\w-])').test(code);
  async function runSiteCheck() {
    const site = (S.site = { fp: fingerprint(), running: true, results: [] });
    const add = (name, status, detail) => {
      site.results.push({ name, status, detail });
      render();
    };
    const missing = (o, keys) => keys.filter((k) => !o || typeof o !== 'object' || !(k in o));
    const fields = (o, keys, ok) => {
      const m = missing(o, keys);
      return m.length ? ['fail', 'Missing fields: ' + m.join(', ')] : ['pass', ok];
    };
    const probe = async (name, fn) => {
      try {
        const [status, d] = await fn();
        add(name, status, d);
      } catch (e) {
        add(name, 'fail', e.message);
      }
    };
    render();

    if (!userTokenOk()) {
      add('Session', 'fail', 'No Vest session captured yet. Click around Vest, then re-run.');
      site.running = false;
      return finishSiteCheck(site);
    }
    add('Session', 'pass', 'Logged-in session captured from the page');

    let active = [];
    await probe('Account list', async () => {
      const r = await api('/v3/capital/accounts/active');
      if (!Array.isArray(r.accounts)) return ['fail', 'Response no longer has an accounts list'];
      active = r.accounts;
      if (!active.length) return ['warn', 'No active accounts returned'];
      return fields(
        active[0],
        ['id', 'initial_capital', 'max_drawdown_limit', 'account_type'],
        `${active.length} active account(s), fields OK`,
      );
    });
    await probe('Balances', async () => {
      const r = await api('/v3/accounts');
      if (!Array.isArray(r.accounts) || !r.accounts.length) return ['warn', 'No balances returned to inspect'];
      return fields(r.accounts[0], ['account_id', 'amount'], 'Balance fields OK');
    });

    const testId = (S.master && S.byId[S.master] ? S.master : null) || (active[0] && active[0].id);
    let tok = null;
    await probe('Account tokens', async () => {
      if (!testId) return ['warn', 'No account to test with'];
      const r = await api('/v3/auth/account-token', userToken, {
        method: 'POST',
        body: JSON.stringify({ accountId: testId }),
      });
      tok = r.apiKey || r.accessToken;
      if (!tok) return ['fail', 'No token in the response'];
      const c = decodeJwt(tok);
      if (c.accountId !== testId) return ['fail', 'Token no longer names its account (needed to recognise the master)'];
      return 'canTrade' in c
        ? ['pass', 'Minted; account + canTrade claims present']
        : ['warn', 'Minted, but the canTrade claim is gone'];
    });
    await probe('Leverage read', async () => {
      const r = await api('/v3/user-state');
      if (!Array.isArray(r.accounts)) return ['fail', 'No accounts list in user-state'];
      if (!r.accounts.length) return ['warn', 'No accounts in user-state to inspect'];
      return fields(r.accounts[0], ['accountId', 'leverages'], 'Per-symbol leverage readable');
    });
    await probe('Flat check', async () => {
      if (!tok) return ['warn', 'Skipped (no account token)'];
      const [p, o] = await Promise.all([api('/v3/positions/opened', tok), api('/v3/positions/opened-orders', tok)]);
      const m = [...missing(p, ['positions']), ...missing(o, ['orders'])];
      return m.length ? ['fail', 'Missing: ' + m.join(', ')] : ['pass', 'Open positions & orders readable'];
    });
    await probe('Fill confirmation', async () => {
      if (!tok) return ['warn', 'Skipped (no account token)'];
      const now = Math.floor(Date.now() / 1000);
      const q = `account_id=${encodeURIComponent(testId)}&symbol=${encodeURIComponent(S.trade.symbol)}&from=${now - 86400}&to=${now}&limit=5`;
      const r = await api(`/v3/executions?${q}`, tok);
      if (!Array.isArray(r.items)) return ['fail', 'No items list'];
      if (!r.items.length) return ['pass', 'Endpoint OK (no recent fills to inspect)'];
      return fields(r.items[0], ['id', 'price'], 'Fill fields OK');
    });
    await probe('Equity', async () => {
      const now = Date.now();
      const r = await api(`/v3/trading-performance/series?from=${now - 2 * 86400000}&to=${now}&points=50`);
      if (!Array.isArray(r.items)) return ['fail', 'No items list'];
      if (!r.items.length) return ['warn', 'No equity points returned to inspect'];
      return fields(r.items[0], ['account_id', 'equity_value'], 'Equity readable');
    });
    await probe("Vest's order code", async () => {
      const urls = new Set();
      for (const s of document.scripts) if (s.src) urls.add(s.src);
      for (const e of performance.getEntriesByType('resource')) if (e.initiatorType === 'script') urls.add(e.name);
      const own = [...urls].filter((u) => {
        try {
          return new URL(u).host === location.host;
        } catch {
          return false;
        }
      });
      let code = '';
      for (const u of own.slice(0, 60)) {
        try {
          code += await (await _fetch(u)).text();
        } catch {}
      }
      if (!code) return ['warn', "Couldn't read the site's code"];
      const lost = SCAN_TERMS.filter((t) => !hasTerm(code, t));
      return lost.length
        ? ['warn', 'No longer found: ' + lost.join(', ') + '. Confirm with a small test trade.']
        : ['pass', `All ${SCAN_TERMS.length} order endpoints & fields still present`];
    });

    site.running = false;
    finishSiteCheck(site);
  }
  const countStatus = (site, status) => site.results.filter((r) => r.status === status).length;
  function finishSiteCheck(site) {
    const pass = countStatus(site, 'pass'),
      warn = countStatus(site, 'warn'),
      fail = countStatus(site, 'fail');
    diag('site_check', { fp: site.fp, pass, warn, fail, results: site.results });
    logEvent(fail ? 'warn' : 'info', `Site check: ${pass} passed, ${warn} warning(s), ${fail} failed.`);
    render();
  }
  function acceptBuild() {
    const site = S.site;
    if (!site || site.running || countStatus(site, 'fail')) return;
    const fp = fingerprint();
    if (site.fp !== fp) return; // the page changed build since the check ran
    if (fp) {
      try {
        localStorage.setItem(BUILD_KEY, fp);
      } catch {}
    } else _unknownBuildChecked = true;
    logEvent('info', `Vest build ${fp || '(unknown)'} accepted. Do one small test trade before trading size.`);
    diag('build_accepted', { fp });
    S.siteOpen = false;
    render();
  }
  function openSiteCheck() {
    S.siteOpen = true;
    S.rulesOpen = false;
    S.supportOpen = false;
    S.summaryOpen = false;
    S.settingsOpen = false;
    S.tradeOpen = false;
    const stale = !S.site || S.site.fp !== fingerprint();
    if (stale && !(S.site && S.site.running)) runSiteCheck();
    else render();
  }

  // ───────────────────────── UI ─────────────────────────
  let _root = null; // the panel's shadow root
  const money = (n) =>
    isNaN(n) ? '—' : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = (n) => (isNaN(n) ? '—' : (n * 100).toFixed(0) + '%');
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const acctNum = (label) => (String(label).match(/(\d+)\s*$/) || [, '--'])[1]; // "Account 07" → "07"

  const CSS = `
    :host {
      all: initial;
    }
    * {
      box-sizing: border-box;
      font-family:
        'Inter',
        -apple-system,
        BlinkMacSystemFont,
        system-ui,
        sans-serif;
    }
    .panel {
      --bg: #0d0f12;
      --elev: #16191e;
      --elev2: #1b1f25;
      --line: #232830;
      --line2: #2d333c;
      --text: #eceef1;
      --dim: #8b929c;
      --faint: #5b626c;
      --accent: #3ddc91;
      --accent-dim: #16271f;
      --accent-line: #255041;
      --danger: #f0574b;
      --danger-dim: #2a1513;
      --danger-line: #51261f;
      --warn: #e4a73c;
      --blue: #5aa2e8;
      --mono: ui-monospace, 'SF Mono', Menlo, monospace;
      position: fixed;
      top: 16px;
      right: 16px;
      width: 368px;
      max-height: calc(100vh - 32px);
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--line);
      border-radius: 16px;
      box-shadow:
        0 18px 50px rgba(0, 0, 0, 0.55),
        0 2px 8px rgba(0, 0, 0, 0.4);
      font-size: 13px;
      overflow: hidden;
      backdrop-filter: blur(8px);
    }
    .hdr {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 13px 15px;
      cursor: move;
      background: linear-gradient(180deg, #14171c, #101216);
      border-bottom: 1px solid var(--line);
      flex: none;
      touch-action: none;
      user-select: none;
    }
    .title {
      font-weight: 650;
      letter-spacing: 0.2px;
      font-size: 13px;
      white-space: nowrap;
    }
    .armtag {
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 3px 8px;
      border: 1px solid;
    }
    .armtag.off {
      color: var(--dim);
      border-color: var(--line2);
      background: #14171c;
    }
    .armtag.on {
      color: var(--danger);
      border-color: var(--danger-line);
      background: var(--danger-dim);
      box-shadow: 0 0 0 3px rgba(240, 87, 75, 0.08);
    }
    .opttag {
      font-size: 9px;
      font-weight: 600;
      color: var(--faint);
      letter-spacing: 1px;
    }
    .spacer {
      flex: 1;
    }
    .iconbtn {
      cursor: pointer;
      color: var(--dim);
      background: none;
      border: none;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.3px;
      line-height: 1;
      padding: 5px 7px;
      border-radius: 7px;
      transition: 0.12s;
    }
    .iconbtn:hover {
      color: var(--text);
      background: var(--elev2);
    }
    .iconbtn.active {
      color: var(--accent);
      background: var(--accent-dim);
    }
    .health {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 15px;
      border-bottom: 1px solid var(--line);
      font-size: 10.5px;
      color: var(--dim);
      flex: none;
      background: #0f1216;
      cursor: pointer;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex: none;
    }
    .green {
      background: var(--accent);
    }
    .amber {
      background: var(--warn);
    }
    .red {
      background: var(--danger);
    }
    .gray {
      background: #484f59;
    }
    .rate {
      font-size: 10px;
      font-family: var(--mono);
    }
    .r-ok {
      color: var(--faint);
    }
    .r-amber {
      color: var(--warn);
    }
    .r-red {
      color: var(--danger);
    }
    .body {
      flex: 1 1 auto;
      overflow: auto;
      min-height: 64px;
    }
    .body::-webkit-scrollbar,
    .log::-webkit-scrollbar {
      width: 8px;
    }
    .body::-webkit-scrollbar-thumb,
    .log::-webkit-scrollbar-thumb {
      background: #262c34;
      border-radius: 4px;
    }
    .group {
      padding: 12px 15px 2px;
    }
    .group-h {
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--faint);
      margin-bottom: 8px;
    }
    .row {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 11px;
      align-items: center;
      padding: 10px 11px;
      border: 1px solid var(--line);
      border-radius: 11px;
      margin-bottom: 7px;
      background: var(--elev);
      transition:
        border-color 0.12s,
        background 0.12s;
    }
    .row:hover {
      border-color: var(--line2);
    }
    .row.master {
      border-color: var(--accent-line);
      background: linear-gradient(180deg, #121c17, #0f1713);
    }
    .row.follower {
      border-color: #223647;
      background: linear-gradient(180deg, #121820, #0f141a);
    }
    .badge {
      width: 31px;
      height: 31px;
      border-radius: 9px;
      background: var(--elev2);
      color: var(--dim);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 650;
      font-size: 11px;
      border: 1px solid var(--line2);
      font-family: var(--mono);
    }
    .row.master .badge {
      color: var(--accent);
      border-color: var(--accent-line);
      background: var(--accent-dim);
    }
    .row.follower .badge {
      color: var(--blue);
      border-color: #223647;
    }
    .name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .chip {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: var(--dim);
      border: 1px solid var(--line2);
      border-radius: 5px;
      padding: 1px 5px;
    }
    .sub {
      color: var(--dim);
      font-size: 11px;
      margin-top: 3px;
      font-family: var(--mono);
    }
    .right {
      text-align: right;
    }
    .right .room {
      font-weight: 650;
      font-family: var(--mono);
    }
    .used {
      font-size: 9.5px;
      color: var(--faint);
      margin-top: 2px;
    }
    .bar {
      height: 3px;
      background: #20252c;
      border-radius: 2px;
      margin-top: 5px;
      overflow: hidden;
    }
    .bar > i {
      display: block;
      height: 100%;
      border-radius: 2px;
    }
    .sel {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .selbtn {
      cursor: pointer;
      font-size: 9.5px;
      font-weight: 650;
      letter-spacing: 0.3px;
      border-radius: 7px;
      padding: 4px 8px;
      border: 1px solid var(--line2);
      background: var(--elev2);
      color: var(--dim);
      min-width: 38px;
      text-align: center;
      transition: 0.12s;
    }
    .selbtn:hover:not(:disabled) {
      border-color: #3a424d;
      color: var(--text);
    }
    .selbtn.m.on {
      background: var(--accent-dim);
      border-color: var(--accent);
      color: var(--accent);
    }
    .selbtn.f.on {
      background: #10202c;
      border-color: var(--blue);
      color: #8ec2f2;
    }
    .selbtn:disabled {
      opacity: 0.28;
      cursor: not-allowed;
    }
    .ctl {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 11px 15px;
      border-top: 1px solid var(--line);
      background: #0f1216;
      flex: none;
    }
    .armbtn {
      flex: 1;
      cursor: pointer;
      font-weight: 650;
      font-size: 12.5px;
      letter-spacing: 0.5px;
      border-radius: 10px;
      padding: 10px;
      border: 1px solid var(--accent-line);
      background: linear-gradient(180deg, #163a2c, #122a20);
      color: var(--accent);
      transition: 0.12s;
    }
    .armbtn:hover:not(:disabled) {
      filter: brightness(1.12);
    }
    .armbtn.armed {
      background: linear-gradient(180deg, #36201d, #2a1613);
      border-color: var(--danger-line);
      color: var(--danger);
    }
    .armbtn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .dangerbtn {
      cursor: pointer;
      font-weight: 600;
      font-size: 11px;
      border-radius: 10px;
      padding: 10px 12px;
      border: 1px solid var(--danger-line);
      background: var(--danger-dim);
      color: var(--danger);
      white-space: nowrap;
      transition: 0.12s;
    }
    .dangerbtn:hover:not(:disabled) {
      background: #361714;
    }
    .dangerbtn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .ghostbtn {
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9px;
      padding: 8px 12px;
      border: 1px solid var(--line2);
      background: var(--elev2);
      color: var(--dim);
    }
    .ghostbtn:hover {
      color: var(--text);
      border-color: #3a424d;
    }
    .settings {
      padding: 6px 15px 14px;
    }
    .set-h {
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--faint);
      padding: 12px 0 4px;
    }
    .opt {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--line);
    }
    .opt:last-child {
      border-bottom: none;
    }
    .opt.dep-off {
      opacity: 0.45;
    }
    .opt-txt {
      flex: 1;
    }
    .opt-name {
      font-weight: 600;
      font-size: 12.5px;
      margin-bottom: 3px;
    }
    .opt-desc {
      color: var(--dim);
      font-size: 11px;
      line-height: 1.5;
    }
    .switch {
      flex: none;
      position: relative;
      width: 40px;
      height: 23px;
      border-radius: 999px;
      border: 1px solid var(--line2);
      background: var(--elev2);
      cursor: pointer;
      padding: 0;
      transition: 0.15s;
      margin-top: 2px;
    }
    .switch .knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: var(--dim);
      transition: 0.15s;
    }
    .switch.on {
      background: var(--accent-dim);
      border-color: var(--accent);
    }
    .switch.on .knob {
      transform: translateX(17px);
      background: var(--accent);
    }
    .orphan {
      margin: 0 15px 10px;
      padding: 9px 11px;
      background: var(--danger-dim);
      border: 1px solid var(--danger-line);
      color: var(--danger);
      border-radius: 9px;
      font-size: 11px;
      line-height: 1.45;
    }
    .orphan .obtn {
      cursor: pointer;
      margin-left: 6px;
      font-size: 10px;
      font-weight: 650;
      border-radius: 7px;
      padding: 3px 9px;
      border: 1px solid var(--danger-line);
      background: #311714;
      color: var(--danger);
    }
    .orphan .obtn.keep {
      border-color: var(--line2);
      background: var(--elev2);
      color: var(--dim);
    }
    .logwrap {
      border-top: 1px solid var(--line);
      flex: none;
      background: #0f1216;
    }
    .logh {
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--faint);
      padding: 9px 15px 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .loghbtns {
      display: flex;
      gap: 2px;
    }
    .iconbtn.sm {
      font-size: 12px;
      padding: 2px 6px;
    }
    .log {
      max-height: 22vh;
      overflow: auto;
      padding: 0 15px 11px;
      font-size: 11px;
      line-height: 1.55;
      font-family: var(--mono);
    }
    .le {
      display: flex;
      gap: 8px;
      padding: 2px 0;
      color: #c4c9d0;
    }
    .le .ts {
      color: var(--faint);
      flex: none;
    }
    .le.ok {
      color: var(--accent);
    }
    .le.warn {
      color: var(--warn);
    }
    .le.info {
      color: #aab0b9;
    }
    .update {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 8px 15px;
      border-bottom: 1px solid var(--line);
      background: var(--accent-dim);
      color: var(--accent);
      font-size: 11px;
      flex: none;
    }
    .utext {
      flex-basis: 100%;
    }
    .update.muted {
      background: var(--elev);
      color: var(--dim);
    }
    .update[hidden] {
      display: none;
    }
    .ubtn {
      cursor: pointer;
      font-size: 10.5px;
      font-weight: 650;
      border-radius: 7px;
      padding: 4px 9px;
      border: 1px solid var(--accent-line);
      background: #163a2c;
      color: var(--accent);
      text-decoration: none;
    }
    .ubtn.ghost {
      border-color: var(--line2);
      background: var(--elev2);
      color: var(--dim);
    }
    .ubtn:hover {
      filter: brightness(1.15);
    }
    .set-row {
      display: flex;
      gap: 8px;
      padding: 4px 0 6px;
    }
    a.ghostbtn {
      text-decoration: none;
    }
    .toast {
      margin: 0 15px 10px;
      padding: 8px 11px;
      background: #241c10;
      border: 1px solid #4a3a1a;
      color: var(--warn);
      border-radius: 9px;
      font-size: 11px;
    }
    .empty {
      padding: 26px 15px;
      color: var(--dim);
      text-align: center;
      line-height: 1.5;
    }
    .rules {
      padding: 15px;
    }
    .rules-h {
      font-weight: 650;
      margin-bottom: 11px;
      font-size: 13px;
    }
    .rules-list {
      margin: 0 0 14px;
      padding-left: 18px;
      color: #c4c9d0;
      font-size: 12px;
      line-height: 1.6;
    }
    .rules-list li {
      margin-bottom: 9px;
    }
    .rules-list b {
      color: var(--text);
    }
    .rules-accept {
      display: flex;
      gap: 9px;
      align-items: flex-start;
      margin: 4px 0 14px;
      padding: 10px 11px;
      border: 1px solid var(--line2);
      border-radius: 9px;
      background: var(--elev);
      font-size: 11.5px;
      line-height: 1.5;
      color: var(--text);
      cursor: pointer;
    }
    .rules-accept input {
      margin-top: 2px;
      accent-color: var(--accent);
    }
    .rules-terms {
      font-size: 11px;
      color: var(--dim);
      margin: -6px 0 14px;
    }
    .rules-terms a {
      color: var(--accent);
    }
    .reportbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      padding: 8px 30px 9px 15px; /* clear of the resize grip in the corner */
      background: linear-gradient(90deg, #13281f, #0f1915 70%);
      border-top: 1px solid var(--accent-line);
      flex: none;
    }
    .reportbar .linkbtn {
      color: #9db5aa;
    }
    .reportbar .linkbtn:hover {
      color: var(--accent);
    }
    .linkbtn {
      cursor: pointer;
      background: none;
      border: none;
      padding: 2px 0;
      color: var(--dim);
      font-size: 10.5px;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .linkbtn:hover {
      color: var(--text);
    }
    .codebtn {
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font-size: 11px;
      font-weight: 550;
      color: var(--text);
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .codebtn b {
      background: var(--accent);
      color: #08150f;
      font-family: var(--mono);
      font-weight: 750;
      letter-spacing: 0.6px;
      padding: 2px 7px;
      border-radius: 6px;
    }
    .codebtn .off {
      color: var(--accent);
      font-weight: 700;
    }
    .codebtn:hover b {
      filter: brightness(1.12);
    }
    .codebtn[hidden] {
      display: none;
    }
    .tab.tab-support {
      color: var(--accent);
    }
    .support-tab .sc-sub a {
      color: var(--accent);
    }
    .sup-card {
      border: 1px solid var(--line);
      border-radius: 11px;
      background: var(--elev);
      padding: 12px 13px;
      margin-bottom: 10px;
    }
    .sup-h {
      font-weight: 650;
      font-size: 12.5px;
      margin-bottom: 4px;
    }
    .report-note {
      width: 100%;
      margin: 2px 0 10px;
      background: #0f1216;
      border: 1px solid var(--line2);
      border-radius: 9px;
      color: var(--text);
      font: inherit;
      font-size: 12px;
      padding: 9px 10px;
      resize: vertical;
      outline: none;
    }
    .report-note:focus {
      border-color: var(--accent-line);
    }
    .rules-btns {
      display: flex;
      gap: 8px;
    }
    .health:hover {
      background: #13171c;
    }
    .health.amber-bar {
      background: #1d170e;
      color: var(--warn);
    }
    .sc-sub {
      font-size: 11px;
      color: var(--dim);
      margin: -4px 0 12px;
      line-height: 1.5;
    }
    .sc-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 14px;
    }
    .sc-row {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 9px;
      align-items: start;
      padding: 8px 10px;
      border: 1px solid var(--line);
      border-radius: 9px;
      background: var(--elev);
    }
    .sc-row .dot {
      margin-top: 4px;
    }
    .sc-name {
      font-weight: 600;
      font-size: 12px;
    }
    .sc-detail {
      font-size: 10.5px;
      color: var(--dim);
      margin-top: 2px;
      line-height: 1.45;
    }
    .sc-note {
      font-size: 10.5px;
      color: var(--dim);
      margin-top: 12px;
      line-height: 1.5;
    }
    .armbtn.sm {
      flex: none;
      padding: 8px 14px;
      font-size: 11.5px;
    }
    .iconbtn.ico {
      display: inline-flex;
      align-items: center;
      padding: 4px 6px;
    }
    .tabs {
      display: flex;
      gap: 2px;
      padding: 0 11px;
      background: #101216;
      border-bottom: 1px solid var(--line);
      flex: none;
      overflow-x: auto; /* a narrow panel scrolls the tabs instead of squashing them */
      scrollbar-width: none;
    }
    .tabs::-webkit-scrollbar {
      display: none;
    }
    .tab {
      flex: none;
      cursor: pointer;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--dim);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.2px;
      padding: 8px 8px 7px;
      margin-bottom: -1px;
    }
    .tab:hover {
      color: var(--text);
    }
    .tab.on {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .tr-sec > .seg {
      align-self: flex-start;
    }
    .trade {
      padding: 12px 15px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .tr-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }
    .tr-sym {
      font-weight: 650;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .tr-acct {
      font-size: 10.5px;
      color: var(--dim);
      margin-top: 3px;
    }
    .tr-pxw {
      text-align: right;
    }
    .tr-px {
      font-family: var(--mono);
      font-size: 17px;
      font-weight: 600;
    }
    .tr-pxl {
      font-size: 9.5px;
      color: var(--faint);
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .tr-sec {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tr-lbl {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
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
      background: #0f1216;
      border: 1px solid var(--line2);
      color: var(--text);
      border-radius: 7px;
      padding: 6px 8px;
      font-family: var(--mono);
      font-size: 12px;
      outline: none;
    }
    .tr-in:focus {
      border-color: var(--accent-line);
    }
    .tr-in.sm {
      width: 48px;
      padding: 4px 6px;
    }
    .tr-u {
      font-size: 10.5px;
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
    .seg {
      display: inline-flex;
      border: 1px solid var(--line2);
      border-radius: 8px;
      overflow: hidden;
      background: var(--elev2);
    }
    .seg button {
      background: none;
      border: none;
      color: var(--dim);
      font-size: 10.5px;
      font-weight: 600;
      padding: 5px 9px;
      cursor: pointer;
      letter-spacing: 0.2px;
      text-transform: none;
    }
    .seg button + button {
      border-left: 1px solid var(--line2);
    }
    .seg button.on {
      background: var(--accent-dim);
      color: var(--accent);
    }
    .tr-lbl .seg button {
      padding: 3px 8px;
      font-size: 9.5px;
    }
    .tr-tgt {
      display: grid;
      grid-template-columns: 30px 74px 22px 1fr auto 20px;
      align-items: center;
      gap: 6px;
      font-size: 11px;
    }
    .tr-n {
      font-weight: 650;
      font-size: 11px;
      color: var(--text);
    }
    .tr-q {
      font-family: var(--mono);
      color: var(--text);
      text-align: right;
    }
    .tr-g {
      font-family: var(--mono);
      color: var(--accent);
      font-size: 10.5px;
      text-align: right;
      min-width: 52px;
    }
    .tr-x {
      background: none;
      border: none;
      color: var(--faint);
      cursor: pointer;
      font-size: 14px;
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
      border-radius: 7px;
      padding: 5px 10px;
      font-size: 10.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .tr-add:hover {
      color: var(--text);
      border-color: #3a424d;
    }
    .tr-be {
      margin-top: 2px;
    }
    .tr-sum {
      font-size: 11px;
      color: var(--dim);
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
      color: var(--dim);
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
      border-radius: 8px;
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
      font-size: 10px;
      font-weight: 650;
      border-radius: 6px;
      padding: 2px 7px;
      margin-left: 4px;
      border: 1px solid #4a3a1a;
      background: #241c10;
      color: var(--warn);
    }
    .tr-preview b.tr-fail {
      color: var(--danger);
    }
    .tr-preview b.tr-pass {
      color: var(--accent);
    }
    .tr-note {
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
      margin-top: 2px;
    }
    .tr-go {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .tr-buy,
    .tr-sell {
      cursor: pointer;
      font-weight: 650;
      font-size: 12.5px;
      border-radius: 10px;
      padding: 11px;
      font-family: var(--mono);
      letter-spacing: 0.3px;
    }
    .tr-buy {
      border: 1px solid var(--accent-line);
      background: linear-gradient(180deg, #163a2c, #122a20);
      color: var(--accent);
    }
    .tr-sell {
      border: 1px solid var(--danger-line);
      background: linear-gradient(180deg, #36201d, #2a1613);
      color: var(--danger);
    }
    .tr-buy:disabled,
    .tr-sell:disabled {
      opacity: 0.35;
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
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--elev);
    }
    .tr-plan b {
      color: var(--text);
    }
    .tr-preview {
      font-size: 10px;
      color: var(--faint);
      line-height: 1.6;
      font-family: var(--mono);
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
    .summary {
      padding: 15px;
    }
    .sum-total {
      font-size: 28px;
      font-weight: 750;
      line-height: 1.05;
      letter-spacing: -0.5px;
      font-family: var(--mono);
    }
    .sum-total.pos {
      color: var(--accent);
    }
    .sum-total.neg {
      color: var(--danger);
    }
    .sum-sub {
      font-size: 11px;
      color: var(--dim);
      margin: 4px 0 14px;
    }
    .sum-top {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
    }
    .sum-keep {
      text-align: right;
    }
    .sum-keep-v {
      font-size: 18px;
      font-weight: 700;
      font-family: var(--mono);
      color: var(--accent);
      line-height: 1.1;
    }
    .sum-keep-l {
      font-size: 10px;
      color: var(--dim);
      margin-top: 2px;
    }
    .sum-left {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .sum-name {
      white-space: nowrap;
    }
    .sum-k {
      font-size: 9.5px;
      color: var(--dim);
      font-family: var(--mono);
      margin-top: 1px;
    }
    .claim {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--line);
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 11px;
    }
    .claim-go {
      align-self: flex-start;
      color: var(--accent);
      border-color: var(--accent-line);
    }
    .claim-h {
      font-weight: 650;
      font-size: 12px;
    }
    .claim-row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 5px 0;
      border-bottom: 1px solid var(--line);
      font-family: var(--mono);
      font-size: 10.5px;
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
      margin-top: 4px;
    }
    .sum-note {
      font-size: 10.5px;
      color: var(--faint);
      line-height: 1.5;
      margin-top: 10px;
    }
    .sum-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .sum-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 9px;
      align-items: center;
      padding: 8px 11px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--elev);
    }
    .badge.sm {
      width: 25px;
      height: 25px;
      font-size: 10px;
      border-radius: 7px;
    }
    .sum-name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .sum-eq {
      font-size: 11px;
      color: var(--dim);
      font-family: var(--mono);
    }
    .sum-pnl {
      font-weight: 650;
      font-family: var(--mono);
    }
    .sum-pnl.pos {
      color: var(--accent);
    }
    .sum-pnl.neg {
      color: var(--danger);
    }
    button:focus-visible,
    .tr-in:focus-visible,
    .health:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }
    .bar-ok {
      background: var(--accent);
    }
    .bar-warn {
      background: var(--warn);
    }
    .bar-hot {
      background: var(--danger);
    }
    .grip {
      position: absolute;
      right: 4px;
      bottom: 4px;
      width: 15px;
      height: 15px;
      cursor: nwse-resize;
      z-index: 3;
      touch-action: none;
      background: repeating-linear-gradient(135deg, transparent, transparent 2px, #3a414b 2px, #3a414b 3px);
      opacity: 0.7;
    }
    .collapsed .reportbar,
    .collapsed .body,
    .collapsed .tabs,
    .collapsed .health,
    .collapsed .ctl,
    .collapsed .logwrap,
    .collapsed .grip {
      display: none;
    }
  `;

  function buildPanel() {
    const host = document.createElement('div');
    host.id = 'vc-host';
    (document.body || document.documentElement).appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${CSS}</style>
      <div class="panel">
        <div class="hdr">
          <span class="title">Vest Copier</span><span class="armtag off" id="armtag">idle</span><span class="opttag" id="opttag"></span>
          <span class="spacer"></span>
          <button class="iconbtn ico" data-act="refresh" title="Reload accounts" aria-label="Reload accounts">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7" fill="none" stroke="currentColor"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="iconbtn" data-act="collapse" title="Collapse" aria-label="Collapse" aria-expanded="true">–</button>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" data-tab="accounts">Accounts</button>
          <button class="tab" role="tab" data-tab="trade" title="Order panel: stop &amp; targets in points">Trade</button>
          <button class="tab" role="tab" data-tab="summary" title="Profit and loss per account">P&amp;L</button>
          <button class="tab" role="tab" data-tab="settings">Settings</button>
          <button class="tab" role="tab" data-tab="rules">Rules</button>
          <button class="tab tab-support" role="tab" data-tab="support" title="Report a problem, share ideas, get help">Support</button>
        </div>
        <div class="health" role="button" tabindex="0" title="Click to run the site check">
          <span class="dot gray"></span><span class="htext">Starting…</span><span class="spacer"></span><span class="rate" id="rate"></span>
        </div>
        <div class="update" hidden></div>
        <div class="support update" hidden></div>
        <div class="body"><div class="empty">Waiting for your Vest session…</div></div>
        <div class="ctl">
          <button class="armbtn" data-act="arm" disabled>ARM</button>
          <button class="dangerbtn" data-act="flatall" title="Instantly closes every position and cancels every order on every account. No confirmation. The copier stays armed.">Flatten All</button>
        </div>
        <div class="logwrap">
          <div class="logh"><span>Activity</span><span class="loghbtns">
            <button class="iconbtn sm" data-act="dldiag" title="Download diagnostics (JSON) for troubleshooting">Diag</button>
            <button class="iconbtn sm" data-act="dllog" title="Download the activity log (CSV)">CSV</button>
            <button class="iconbtn sm" data-act="clearlog" title="Clear the activity log">Clear</button>
          </span></div>
          <div class="log" aria-live="polite"></div>
        </div>
        <div class="reportbar"><button class="codebtn" data-act="code" title="Click to copy the code" hidden>Use code <b>${SUPPORT_CODE}</b> for <span class="off">5% off</span></button><span></span>
          <button class="linkbtn" data-act="report">Problem? Report it</button></div>
        <div class="grip" title="Drag to resize"></div>
      </div>`;
    const panel = root.querySelector('.panel');
    const size = store.get(SIZE_KEY, null);
    if (size) {
      if (size.w) panel.style.width = size.w + 'px';
      if (size.h) panel.style.maxHeight = size.h + 'px';
    }

    // Drag by the header. Pointer capture keeps the drag even when the cursor passes over the chart's iframe.
    const hdr = root.querySelector('.hdr');
    let drag = null;
    hdr.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.iconbtn')) return;
      const r = panel.getBoundingClientRect();
      drag = { sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top };
      Object.assign(panel.style, { right: 'auto', left: r.left + 'px', top: r.top + 'px' });
      try {
        hdr.setPointerCapture(e.pointerId);
      } catch {}
      e.preventDefault();
    });
    hdr.addEventListener('pointermove', (e) => {
      if (!drag) return;
      panel.style.left = drag.ox + e.clientX - drag.sx + 'px';
      panel.style.top = drag.oy + e.clientY - drag.sy + 'px';
    });
    const endDrag = () => {
      drag = null;
    };
    hdr.addEventListener('pointerup', endDrag);
    hdr.addEventListener('pointercancel', endDrag);

    // Resize from the corner grip; the size is remembered.
    const PANEL_MIN_W = 300,
      PANEL_MAX_W = 700,
      PANEL_MIN_H = 260;
    const grip = root.querySelector('.grip');
    let rs = null;
    grip.addEventListener('pointerdown', (e) => {
      const r = panel.getBoundingClientRect();
      rs = { w: r.width, h: r.height, sx: e.clientX, sy: e.clientY };
      try {
        grip.setPointerCapture(e.pointerId);
      } catch {}
      e.preventDefault();
      e.stopPropagation();
    });
    grip.addEventListener('pointermove', (e) => {
      if (!rs) return;
      panel.style.width = Math.max(PANEL_MIN_W, Math.min(PANEL_MAX_W, rs.w + e.clientX - rs.sx)) + 'px';
      panel.style.maxHeight = Math.max(PANEL_MIN_H, Math.min(window.innerHeight - 20, rs.h + e.clientY - rs.sy)) + 'px';
    });
    const endResize = () => {
      if (!rs) return;
      rs = null;
      store.set(SIZE_KEY, { w: panel.offsetWidth, h: parseInt(panel.style.maxHeight, 10) || 0 });
    };
    grip.addEventListener('pointerup', endResize);
    grip.addEventListener('pointercancel', endResize);

    const on = (sel, fn) => {
      root.querySelector(sel).onclick = fn;
    };
    on('[data-act="collapse"]', (e) => {
      const collapsed = panel.classList.toggle('collapsed');
      const b = e.currentTarget;
      b.textContent = collapsed ? '+' : '–';
      b.title = collapsed ? 'Expand' : 'Collapse';
      b.setAttribute('aria-label', b.title);
      b.setAttribute('aria-expanded', String(!collapsed));
    });
    on('[data-act="refresh"]', () => refresh());
    root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => setView(b.dataset.tab)));
    const health = root.querySelector('.health');
    const toggleSite = () => {
      if (S.siteOpen) {
        S.siteOpen = false;
        render();
      } else openSiteCheck();
    };
    health.onclick = toggleSite;
    health.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSite();
      }
    };
    on('[data-act="arm"]', () => (S.armed ? disarm() : arm()));
    on('[data-act="flatall"]', () => flattenAll()); // acts at once, no confirmation
    on('[data-act="dldiag"]', () => downloadDiag());
    on('[data-act="dllog"]', () => downloadLog());
    on('[data-act="clearlog"]', () => clearLog());
    on('[data-act="report"]', () => setView('support'));
    on('[data-act="code"]', () =>
      copySupportCode().then((ok) =>
        toast(ok ? `Code ${SUPPORT_CODE} copied: 5% off at Vest's checkout.` : `Code: ${SUPPORT_CODE}`),
      ),
    );
    // shown unless this account already uses the code
    root.querySelector('[data-act="code"]').hidden = (store.get(SUPPORT_KEY, null) || {}).answered === 'had-code';
    return root;
  }

  function renderHealth() {
    if (!_root) return;
    const h = healthState();
    _root.querySelector('.health .dot').className = 'dot ' + h.level;
    _root.querySelector('.htext').textContent = h.text;
    _root.querySelector('.health').classList.toggle('amber-bar', h.changed);
    renderRate();
    renderUpdate();
    renderSupport();
  }
  function renderRate() {
    if (!_root) return;
    const el = _root.querySelector('#rate');
    if (!el) return;
    const { remaining, limit } = S.rate;
    if (remaining == null) {
      el.textContent = '';
      return;
    }
    el.textContent = `API ${remaining}${limit ? '/' + limit : ''}`;
    const frac = limit ? remaining / limit : 1;
    el.className = 'rate ' + (frac < 0.05 ? 'r-red' : frac < 0.2 ? 'r-amber' : 'r-ok');
  }

  // One view at a time. Tabs: accounts · trade · summary · settings · rules (site check opens from the health bar).
  const currentView = () =>
    S.siteOpen
      ? 'site'
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
  function setView(v) {
    S.tradeOpen = v === 'trade';
    S.summaryOpen = v === 'summary';
    S.settingsOpen = v === 'settings';
    S.rulesOpen = v === 'rules';
    S.supportOpen = v === 'support';
    S.siteOpen = false;
    if (!S.tradeOpen) unwatchUnused(); // the price feed is only needed by the Trade tab and breakeven
    render();
  }

  function render() {
    if (!_root) return;
    renderHealth();
    const body = _root.querySelector('.body');
    if (!(S.tradeOpen || S.supportOpen) || S.siteOpen) body.dataset.view = '';
    if (S.siteOpen) {
      renderSiteCheck(body);
    } else if (S.supportOpen) {
      renderSupportTab(body);
    } else if (S.tradeOpen) {
      renderTrade(body);
    } else if (S.settingsOpen) {
      renderSettings(body);
    } else if (S.rulesOpen) {
      renderRules(body);
    } else if (S.summaryOpen) {
      renderSummary(body);
    } else if (!S.groups.length) {
      body.innerHTML = `<div class="empty">No active accounts found.</div>`;
    } else {
      body.innerHTML = S.groups
        .map((g) => {
          const masterGroup = S.master && S.byId[S.master] && S.byId[S.master].groupKey === g.key;
          const rows = g.rows
            .map((r) => {
              const td = r.canTrade === false ? 'red' : r.canTrade === true ? 'green' : 'gray';
              const tdText =
                r.canTrade === false
                  ? 'Trading disabled'
                  : r.canTrade === true
                    ? 'Can trade'
                    : 'Trading status unknown';
              const isM = S.master === r.id,
                isF = S.followers.has(r.id);
              const fDisabled = !S.master || isM || (!S.capFit && !masterGroup) || r.canTrade === false;
              const bar = r.usedPct > 0.8 ? 'bar-hot' : r.usedPct > 0.5 ? 'bar-warn' : 'bar-ok';
              const id = esc(r.id),
                label = esc(r.label);
              return `<div class="row ${isM ? 'master' : isF ? 'follower' : ''}">
              <div class="badge">${esc(acctNum(r.label))}</div>
              <div class="meta"><div class="name">${label} <span class="chip">${esc(r.chip)}</span> <span class="dot ${td}" title="${tdText}"></span></div>
                <div class="sub">bal ${money(r.equity)} · ${r.dailyFloor > r.floor ? '<span title="Daily loss floor, higher than the drawdown floor today">daily floor</span>' : 'floor'} ${money(floorOf(r))}</div></div>
              <div class="right"><div class="room">${money(r.room)}</div><div class="used">${pct(r.usedPct)} used</div>
                <div class="bar"><i class="${bar}" style="width:${Math.round(r.usedPct * 100)}%"></i></div></div>
              <div class="sel">
                <button class="selbtn m ${isM ? 'on' : ''}" data-m="${id}" title="Make ${label} the master" aria-label="Make ${label} the master"
                  aria-pressed="${isM}" ${r.canTrade === false ? 'disabled' : ''}>M</button>
                <button class="selbtn f ${isF ? 'on' : ''}" data-f="${id}" title="Copy the master to ${label}" aria-label="Copy the master to ${label}"
                  aria-pressed="${isF}" ${fDisabled ? 'disabled' : ''}>Flw</button>
              </div></div>`;
            })
            .join('');
          const n = g.rows.length;
          return `<div class="group"><div class="group-h">${money(g.size)} · ${esc(g.type)} · ${n} account${n > 1 ? 's' : ''}</div>${rows}</div>`;
        })
        .join('');
      body.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => setMaster(b.getAttribute('data-m'))));
      body.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => toggleFollower(b.getAttribute('data-f'))));
    }

    const armBtn = _root.querySelector('[data-act="arm"]');
    // DISARM is never blocked; only ARM is gated on a valid selection and the accounts view.
    const otherView = S.rulesOpen || S.summaryOpen || S.settingsOpen || S.siteOpen || S.supportOpen;
    armBtn.disabled = S.armed ? false : S.arming || otherView || !(S.master && S.followers.size);
    armBtn.textContent = S.armed ? 'DISARM' : S.arming ? 'ARMING…' : 'ARM';
    armBtn.classList.toggle('armed', S.armed);
    const tag = _root.querySelector('#armtag');
    tag.textContent = S.armed ? 'Armed · live' : S.master ? 'Ready' : 'Idle';
    tag.className = 'armtag ' + (S.armed ? 'on' : 'off');
    const opts = _root.querySelector('#opttag');
    opts.textContent = [S.fast && 'FAST', S.capFit && 'CAP'].filter(Boolean).join(' ');
    opts.title = [S.fast && 'Fast mode', S.capFit && 'Cap-to-fit'].filter(Boolean).join(' · ');
    const flat = _root.querySelector('[data-act="flatall"]');
    flat.disabled = S.flattening;
    flat.textContent = S.flattening ? 'Flattening…' : 'Flatten All';
    const view = currentView();
    _root.querySelectorAll('[data-tab]').forEach((b) => {
      b.classList.toggle('on', b.dataset.tab === view);
      b.setAttribute('aria-selected', String(b.dataset.tab === view));
    });
    renderLog();
  }

  function renderSiteCheck(body) {
    const h = healthState(),
      site = S.site;
    const color = (st) => (st === 'pass' ? 'green' : st === 'warn' ? 'amber' : 'red');
    const fails = site ? site.results.filter((r) => r.status === 'fail').length : 0;
    const canAccept = h.changed && site && !site.running && !fails && site.fp === fingerprint();
    const intro = h.changed
      ? 'Vest updated its site since your last check. '
      : `Vest build ${esc(fingerprint() || 'unknown')}. `;
    const result = (r) => `
          <div class="sc-row"><span class="dot ${color(r.status)}"></span>
            <div><div class="sc-name">${esc(r.name)}</div><div class="sc-detail">${esc(r.detail || '')}</div></div></div>`;
    body.innerHTML = `
      <div class="rules">
        <div class="rules-h">Site check</div>
        <div class="sc-sub">${intro}Read-only: no orders are placed.</div>
        <div class="sc-list">
          ${(site ? site.results : []).map(result).join('')}
          ${site && site.running ? '<div class="sc-detail">Checking…</div>' : ''}
        </div>
        <div class="rules-btns">
          ${h.changed ? `<button class="armbtn sm" id="sc-accept" ${canAccept ? '' : 'disabled'}>Accept this build</button>` : ''}
          <button class="ghostbtn" id="sc-run" ${site && site.running ? 'disabled' : ''}>${site ? 'Re-run' : 'Run check'}</button>
          <button class="ghostbtn" id="sc-close">Close</button>
        </div>
        <div class="sc-note">${
          fails
            ? "Something Vest-side changed. Don't arm: send the Diag file for a fix."
            : 'After accepting, do one small test with one follower: open with a stop, move the stop, then close. Confirm each step copies.'
        }</div>
      </div>`;
    const acc = body.querySelector('#sc-accept');
    if (acc) acc.onclick = () => acceptBuild();
    body.querySelector('#sc-run').onclick = () => runSiteCheck();
    body.querySelector('#sc-close').onclick = () => {
      S.siteOpen = false;
      render();
    };
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
  const TRADE_STATE_FRESH_MS = 60000;
  let _tradeStateBusy = false;
  async function refreshTradeState() {
    const master = S.master;
    if (!master || _tradeStateBusy || !userTokenOk()) return;
    _tradeStateBusy = true;
    try {
      const { token } = await mintAccountToken(master);
      const [levs, pos, ord] = await Promise.all([
        fetchLeverages(),
        api('/v3/positions/opened', token),
        api('/v3/positions/opened-orders', token),
      ]);
      if (levs) S.levs = levs;
      S.acctState[master] = {
        positions: ((pos && pos.positions) || [])
          .map((p) => ({
            symbol: p.symbol,
            side: p.side,
            qty: num(p.quantity),
            openPrice: num(p.openPrice),
            collateral: num(p.collateral) || 0,
          }))
          .filter((p) => p.qty > 0),
        ordersCollateral: ((ord && ord.orders) || []).reduce(
          (sum, o) => (o.reduceOnly || o.reduce_only ? sum : sum + (num(o.collateral) || 0)),
          0,
        ),
        at: Date.now(),
      };
    } catch {
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
    if (!st || Date.now() - st.at > TRADE_STATE_FRESH_MS || !(r.free >= 0) || !(px > 0))
      return { equity: r.equity, upnl: r.upnl || 0 };
    const here = st.positions.filter((p) => p.symbol === sym);
    const upHere = here.reduce((a, p) => a + (p.side === 'long' ? 1 : -1) * p.qty * (px - p.openPrice), 0);
    const upnl = upHere + (st.positions.length > here.length ? (r.upnl || 0) - upHere : 0);
    const cash = r.free + st.positions.reduce((a, p) => a + p.collateral, 0) + st.ordersCollateral;
    return { equity: cash + upnl, upnl };
  }

  /** Everything the panel shows / would send, from the current settings + live price. Pure apart from reading state. */
  function tradeCalc() {
    const t = S.trade,
      sym = t.symbol,
      meta = SYMBOLS[sym],
      price = priceOf(sym),
      fee = meta.takerFee || 0,
      master = S.master && S.byId[S.master] ? S.master : null;
    const st = master && S.acctState[master];
    const held =
      (st && Date.now() - st.at < TRADE_STATE_FRESH_MS && st.positions.find((p) => p.symbol === sym)) || null;
    const live = master ? liveAccount(master, sym, price) : null;

    // Max size: Vest's 100% for the master and, in strict 1:1 while armed, for every follower too (they copy the same
    // size), so the smallest of them. Followers copy at the master's leverage. Cap-to-fit scales followers to fit.
    const lev = master ? orderLeverage(levFor(S.levs, master, sym), maxLeverageFor(sym, master)) : null;
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
        const q = maxQtyFor(tradingPower({ free: r.free, upnl, leverage: lev, takerFee: fee }), mpx, meta.step);
        if (maxQty === null || q < maxQty) [maxQty, limitedBy] = [q, id];
      }
    }

    const qty =
      t.sizeMode === 'max'
        ? maxQty || 0
        : t.sizeMode === 'risk'
          ? riskQty(+t.risk, +t.stopPts, meta.pointValue, meta.step)
          : floorStep(+t.qty || 0, meta.step);
    const split = splitQty(qty, t.targets.length, t.scale, meta.step);
    const long = planPrices({
      side: 'long',
      entry: price,
      stopPts: +t.stopPts,
      targetPts: t.targets.map(Number),
      tick: meta.tick,
    });
    const short = planPrices({
      side: 'short',
      entry: price,
      stopPts: +t.stopPts,
      targetPts: t.targets.map(Number),
      tick: meta.tick,
    });
    const qtys = split.qtys || [];
    const risk = qty * (+t.stopPts || 0) * meta.pointValue;
    const reward = qtys.reduce((sum, q, i) => sum + q * (+t.targets[i] || 0) * meta.pointValue, 0);
    const openFee = price > 0 ? qty * price * fee : 0;
    const fees = price > 0 ? openFee + qty * Math.max(0, price - (+t.stopPts || 0)) * fee : 0; // in and out at the stop

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
      const loss = stopOutLoss({
        side,
        qty: total,
        price,
        stopPrice: avg - dir * (+t.stopPts || 0),
        openFee,
        takerFee: fee,
      });
      return { ...fp, loss, room: live.equity - floor };
    };
    const sides = { long: outcome('long'), short: outcome('short') };

    let error = null;
    if (!master) error = 'Pick a master account (M) first.';
    else if (t.sizeMode === 'max' && maxQty === null)
      error = price > 0 ? 'Working out the max size…' : 'Waiting for a live price…';
    else if (t.sizeMode === 'max' && !(maxQty > 0))
      error = `No trading power left on ${accLabel(limitedBy)} for ${meta.label} at ${lev}x.`;
    else if (!(qty > 0))
      error = t.sizeMode === 'risk' ? 'Risk and stop must be above zero.' : 'Size must be above zero.';
    else if (split.error) error = split.error;
    else if (!(price > 0)) error = 'Waiting for a live price…';
    else if (long.error) error = long.error;
    else if (t.beMode === 'points' && !(+t.beTrigger > 0)) error = 'Breakeven trigger must be above zero points.';

    // The allowed range for this account now: where the stop may go and how much can be risked (new positions; an add
    // is held to Vest's max only, since its room depends on the position already open).
    const stopPts = +t.stopPts || 0,
      room = r && live ? live.equity - floor : null;
    const limits = {
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

    // Warnings: the order can go, but it's probably not what you want.
    const warnings = [];
    const risky = held ? sides[held.side] : sides.long; // a new position's stop-out costs the same either way
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
          <div><div class="tr-sym" id="tr-sym"></div><div class="tr-acct" id="tr-acct"></div></div>
          <div class="tr-pxw"><div class="tr-px" id="tr-px">—</div><div class="tr-pxl">Mark price</div></div>
        </div>
        <div class="tr-sec">
          <div class="tr-lbl">Size</div>
          <div class="tr-row">${seg('sizeMode', [
            ['qty', 'Contracts'],
            ['risk', 'Risk $'],
            ['max', 'Max'],
          ])}<input class="tr-in" id="tr-size" inputmode="decimal" aria-label="Size"></div>
          <div class="tr-calc" id="tr-sizecalc"></div>
          <div class="tr-lim" id="tr-sizelim"></div>
        </div>
        <div class="tr-sec">
          <div class="tr-lbl">Stop</div>
          <div class="tr-row">
            <input class="tr-in" id="tr-stop" inputmode="decimal" aria-label="Stop, in points" value="${esc(t.stopPts)}">
            <span class="tr-u">pts</span><span class="tr-calc tr-right" id="tr-stopcalc"></span>
          </div>
          <div class="tr-lim" id="tr-stoplim"></div>
        </div>
        <div class="tr-sec">
          <div class="tr-lbl">Targets ${seg('scale', [
            ['start', 'Start'],
            ['even', 'Even'],
            ['end', 'End'],
          ])}</div>
          <div id="tr-targets"></div>
          <button class="tr-add" id="tr-add">+ Add target</button>
        </div>
        <div class="tr-sec">
          <div class="tr-lbl">Measure stop &amp; targets from</div>
          ${seg('anchor', [
            ['fill', 'Your fill'],
            ['click', 'Price at click'],
          ])}
          <div class="tr-calc" id="tr-anchornote"></div>
        </div>
        <div class="tr-sec">
          <div class="tr-lbl">Breakeven</div>
          ${seg('beMode', [
            ['off', 'Off'],
            ['tp1', 'After TP1'],
            ['points', 'At +pts'],
          ])}
          <div class="tr-row tr-be">
            <span id="tr-betrigw">at <input class="tr-in sm" id="tr-betrig" inputmode="decimal" aria-label="Breakeven trigger, in points" value="${esc(t.beTrigger)}"> pts ·</span>
            lock <input class="tr-in sm" id="tr-beoff" inputmode="decimal" aria-label="Profit to lock, in points" value="${esc(t.beOffset)}"> pts profit
          </div>
        </div>
        <div class="tr-sum" id="tr-sum"></div>
        <div class="tr-warn" id="tr-warn"></div>
        <div class="tr-err" id="tr-err"></div>
        <div class="tr-go"><button class="tr-buy" id="tr-buy">Buy</button><button class="tr-sell" id="tr-sell">Sell</button></div>
        <div class="tr-preview" id="tr-preview"></div>
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
    const sizeEl = body.querySelector('#tr-size');
    sizeEl.value = t.sizeMode === 'risk' ? t.risk : t.qty;
    sizeEl.addEventListener('input', () => {
      S.trade[S.trade.sizeMode === 'risk' ? 'risk' : 'qty'] = parse(sizeEl) || 0;
      saveTrade();
      updateTrade();
    });
    num(body.querySelector('#tr-stop'), 'stopPts');
    num(body.querySelector('#tr-betrig'), 'beTrigger');
    num(body.querySelector('#tr-beoff'), 'beOffset');
    body.querySelectorAll('[data-seg]').forEach((g) =>
      g.querySelectorAll('button').forEach(
        (b) =>
          (b.onclick = () => {
            S.trade[g.dataset.seg] = b.dataset.v;
            saveTrade();
            if (g.dataset.seg === 'sizeMode') sizeEl.value = S.trade.sizeMode === 'risk' ? S.trade.risk : S.trade.qty;
            updateTrade();
          }),
      ),
    );
    body.querySelector('#tr-add').onclick = () => {
      const last = +S.trade.targets[S.trade.targets.length - 1] || 0;
      S.trade.targets.push(last ? last + (+S.trade.targets[0] || DEFAULT_TARGET_PTS) : DEFAULT_TARGET_PTS);
      saveTrade();
      renderTargets(body);
      updateTrade();
    };
    body.querySelector('#tr-buy').onclick = () => placeTrade('long');
    body.querySelector('#tr-sell').onclick = () => placeTrade('short');
    renderTargets(body);
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

  // Stop/target work that runs after an order (re-anchor, rebuilding the ladder after an add). Buy and Sell stay disabled
  // until it finishes, so two of these never work on the same legs at once.
  function adjust(job) {
    S.adjusting = (S.adjusting || 0) + 1;
    updateTrade();
    return job()
      .catch((e) => {
        logEvent('warn', `Couldn't finish adjusting stop & targets (${e.message}) — check them on Vest.`);
        diag('adjust', { outcome: 'error', error: e.message });
      })
      .finally(() => {
        S.adjusting--;
        updateTrade();
      });
  }

  async function placeTrade(side) {
    if (S.placing || S.adjusting) return;
    if (S.flattening) return toast('Wait for Flatten All to finish.');
    if (!S.ack) {
      S.rulesOpen = true;
      S.tradeOpen = false;
      render();
      return toast('Read and accept the terms first.');
    }
    const c = tradeCalc();
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
    const stopPts = +t.stopPts,
      sym = t.symbol,
      meta = c.meta,
      pDec = decimalsOf(meta.tick),
      master = S.master;
    S.placing = true;
    updateTrade();
    try {
      const px = priceOf(sym); // the price at the moment of the click
      const plan = planPrices({ side, entry: px, stopPts, targetPts: t.targets, tick: meta.tick });
      if (plan.error) throw new Error(plan.error);
      if (!(SYMBOLS[sym] && SYMBOLS[sym].margin)) await loadSymbolRules(sym);
      const lev = orderLeverage(levFor(await fetchLeverages(), master, sym), maxLeverageFor(sym, master));
      if (!(lev > 0))
        throw new Error(
          `couldn't work out ${meta.label} leverage for ${accLabel(master)} — open Vest's ticket for ${meta.label} once, then retry`,
        );
      // Already in this market? Vest ignores a second open on the same symbol (accepted, never filled), so do what its own
      // ticket does: same direction adds to the position; the opposite direction is refused here.
      const held = await openPosition(master, sym);
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
      const stopLosses = [{ executionType: 'market', triggerPrice: fmtNum(plan.stop, pDec) }];
      const body = {
        orderType: 'market',
        leverage: fmtNum(lev, 2),
        side,
        symbol: sym,
        quantity: fmtQty(c.qty, sym),
        timeInForce: 'IOC',
        takeProfits,
        stopLosses,
      };
      const res = await send('POST', '/v3/positions/open', master, body);
      if (!res.positionId) throw new Error('Vest returned no position');
      const tps = takeProfits
        .map((l, i) => `TP${i + 1} ${l.triggerPrice}${l.quantity ? ' × ' + l.quantity : ''}`)
        .join(' · ');
      logEvent(
        'ok',
        `Trade panel: ${side === 'long' ? 'BUY' : 'SELL'} ${body.quantity} ${meta.label} · stop ${stopLosses[0].triggerPrice} · ${tps}`,
      );
      diag('trade_panel', {
        outcome: 'placed',
        side,
        sizing,
        body,
        positionId: res.positionId,
        orderId: res.orderId,
        takeProfitIds: res.takeProfitIds,
        stopLossIds: res.stopLossIds,
      });
      const reanchorOn = t.anchor !== 'click';
      let bePlan = null;
      if (t.beMode !== 'off') {
        bePlan = {
          positionId: res.positionId,
          orderId: res.orderId,
          master,
          symbol: sym,
          side,
          stopLegId: (res.stopLossIds || [])[0] || null,
          tp1: plan.targets[0],
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
      if (reanchorOn) {
        adjust(() =>
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
            bePlan,
          }),
        );
      }
    } catch (e) {
      logEvent('warn', `Trade panel: order NOT placed — ${e.message}.`);
      diag('trade_panel', { outcome: 'not-placed', side, sizing, error: e.message, errorCode: errCode(e) });
    } finally {
      S.placing = false;
      updateTrade();
      setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS); // the next max size and fail price start from the new balance
    }
  }

  // Vest's position `openPrice` can be wrong for a moment right after a fill (seen live: 290.25 for a 31,148 fill), so
  // fills come from /executions by order id, and any price that legs are measured from must be near the market.
  const nearMarket = (px, ref, tol = NEAR_MARKET) => px > 0 && ref > 0 && Math.abs(px - ref) <= ref * tol;
  async function orderFill(accountId, sym, orderId, ref) {
    for (let i = 0; orderId && i < 4; i++) {
      if (i) await sleep(POLL_MS);
      const f = await fillInfo(accountId, sym, orderId);
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
  const tryOpenPosition = async (...a) => {
    try {
      return await openPosition(...a);
    } catch {
      return null;
    }
  };

  // ── Add to an open trade from the panel: Vest's /append (the shape its own ticket sends), then ONE ladder for the whole
  // position — the stop and targets re-placed from the new average entry at the panel's points, with the full size split
  // across the targets by the chosen scale. The add and every leg change go through the hooked fetch, so an armed
  // copier adds to each follower (scaled) and moves/resizes their legs to match.
  async function addToTrade({ t, qty, meta, side, held, lev, sizing }) {
    const sym = t.symbol,
      master = S.master,
      positionId = posIdOf(held),
      prevQty = parseFloat(held.quantity);
    const body = {
      symbol: sym,
      positionId,
      orderType: 'market',
      quantity: fmtQty(qty, sym),
      leverage: fmtNum(lev, 2),
      isBuy: side === 'long',
      timeInForce: 'IOC',
    };
    const plan = S.plans[positionId];
    if (plan) {
      plan.reanchoring = true;
      savePlans();
    } // breakeven holds off until the ladder is rebuilt
    let res;
    try {
      res = await send('POST', '/v3/positions/append', master, body);
    } catch (e) {
      if (plan) {
        plan.reanchoring = false;
        savePlans();
      }
      throw e;
    }
    logEvent(
      'ok',
      `Trade panel: ADD ${body.quantity} ${meta.label} to the ${side} (${fmtQty(prevQty, sym)} → ${fmtQty(prevQty + qty, sym)}) — rebuilding stop & targets from the new average entry.`,
    );
    diag('trade_panel', { outcome: 'added', side, sizing, body, orderId: res.orderId, prevQty });
    adjust(() =>
      rebuildLadder({
        master,
        sym,
        side,
        positionId,
        orderId: res.orderId,
        prevQty,
        prevOpen: parseFloat(held.openPrice),
        addQty: qty,
        ref: priceOf(sym),
        t,
      }),
    );
  }

  // Whatever happens inside, breakeven is released afterwards.
  async function rebuildLadder(args) {
    const old = S.plans[args.positionId];
    try {
      return await rebuildLadderSteps(args);
    } finally {
      if (old && old.reanchoring && S.plans[args.positionId] === old) {
        old.reanchoring = false;
        savePlans();
      }
    }
  }
  async function rebuildLadderSteps({ master, sym, side, positionId, orderId, prevQty, prevOpen, addQty, ref, t }) {
    const meta = SYMBOLS[sym],
      tick = meta.tick,
      step = meta.step,
      want = prevQty + addQty;
    const fmtP = (n) => fmtNum(n, decimalsOf(tick)),
      fmtQ = (n) => fmtQty(n, sym);
    const old = S.plans[positionId];
    const release = () => {
      if (old && S.plans[positionId] === old) {
        old.reanchoring = false;
        savePlans();
      }
    };
    let pos = null;
    for (let i = 0; i < 8; i++) {
      // wait for the add to show in the position size
      if (i) await sleep(POLL_MS);
      pos = await tryOpenPosition(master, sym);
      if (!pos || parseFloat(pos.quantity) >= want - step / 2) break;
    }
    if (!pos) {
      logEvent('warn', 'Add: the position is gone (closed or stopped out) — nothing to rebuild.');
      return release();
    }
    const total = parseFloat(pos.quantity);
    if (total < want - step / 2) {
      logEvent('warn', `Add: Vest didn't fill it (still ${fmtQ(total)}) — stop & targets left as they were.`);
      diag('add_ladder', { positionId, outcome: 'not-filled', total, want });
      return release();
    }
    // New average entry: the held entry and the add's own fill, weighted. Vest's openPrice is only a fallback.
    const addFill = await orderFill(master, sym, orderId, ref);
    let entry =
      addFill && nearMarket(prevOpen, ref, NEAR_MARKET_LOOSE)
        ? (prevQty * prevOpen + addQty * addFill) / (prevQty + addQty)
        : null;
    if (!entry && nearMarket(parseFloat(pos.openPrice), ref, NEAR_MARKET_LOOSE)) entry = parseFloat(pos.openPrice);
    if (!entry) {
      logEvent(
        'warn',
        `Add: filled, but couldn't get a believable average entry${pos.openPrice ? ` (Vest showed ${pos.openPrice})` : ''} — check stop & targets on Vest.`,
      );
      diag('add_ladder', { positionId, outcome: 'no-entry-price', openPrice: pos.openPrice, prevOpen, addFill, ref });
      return release();
    }
    const exact = planPrices({ side, entry, stopPts: +t.stopPts, targetPts: t.targets, tick });
    const split = t.targets.length > 1 ? splitQty(total, t.targets.length, t.scale, step) : null;
    const err =
      exact.error ||
      (split && split.error) ||
      (split && split.qtys.some((q, i) => q * exact.targets[i] < MIN_LEG_USD) && "a target is below Vest's $1 minimum");
    if (err) {
      logEvent('warn', `Add: filled, but couldn't rebuild the ladder (${err}) — check stop & targets on Vest.`);
      return release();
    }

    // Work out the leg changes: fewer targets → delete the farthest; the stop moves; kept targets are re-priced and
    // resized (shrinking ones first, so sized legs never add up past the position); extra targets are added.
    const legs = posLegs(pos),
      stops = legs.filter((l) => l.kind === 'sl');
    const tps = legs
      .filter((l) => l.kind === 'tp')
      .sort((a, b) => Math.abs(a.price - entry) - Math.abs(b.price - entry));
    const goal = exact.targets.map((price, i) => ({ price, qty: split ? split.qtys[i] : null }));
    const n = Math.min(tps.length, goal.length),
      ops = [];
    const TP = '/v3/positions/take-profit',
      SL = '/v3/positions/stop-loss',
      base = { positionId, executionType: 'market' };
    tps.slice(n).forEach((l) => ops.push({ m: 'DELETE', path: TP, body: { positionId, takeProfitId: l.id } }));
    if (stops[0]) {
      const st = stops[0];
      if (Math.abs(st.price - exact.stop) >= tick / 2 || st.qty != null) {
        ops.push({
          m: 'PUT',
          path: SL,
          body: {
            ...base,
            triggerPrice: fmtP(exact.stop),
            stopLossId: st.id,
            ...(st.qty != null ? { quantity: fmtQ(total) } : {}),
          },
        });
      }
    } else {
      ops.push({ m: 'POST', path: SL, body: { ...base, triggerPrice: fmtP(exact.stop) } });
    }
    const legQty = (l) => (l.qty != null ? parseFloat(l.qty) : total); // a full-position leg covers everything
    const puts = tps
      .slice(0, n)
      .map((l, i) => {
        const q = goal[i].qty != null ? goal[i].qty : l.qty != null ? total : null;
        return { l, q, price: goal[i].price, grow: (q != null ? q : total) - legQty(l) };
      })
      .filter(
        (x) => Math.abs(x.l.price - x.price) >= tick / 2 || (x.q != null && Math.abs(legQty(x.l) - x.q) >= step / 2),
      )
      .sort((a, b) => a.grow - b.grow);
    puts.forEach((x) =>
      ops.push({
        m: 'PUT',
        path: TP,
        body: {
          ...base,
          triggerPrice: fmtP(x.price),
          takeProfitId: x.l.id,
          ...(x.q != null ? { quantity: fmtQ(x.q) } : {}),
        },
      }),
    );
    goal.slice(n).forEach((g) =>
      ops.push({
        m: 'POST',
        path: TP,
        body: { ...base, triggerPrice: fmtP(g.price), ...(g.qty != null ? { quantity: fmtQ(g.qty) } : {}) },
      }),
    );

    let failed = 0;
    for (const o of ops) {
      try {
        await send(o.m, o.path, master, o.body);
      } catch (e) {
        failed++;
        logEvent('warn', `Add: a ${o.path.endsWith('stop-loss') ? 'stop' : 'target'} change failed (${e.message}).`);
      }
    }
    if (failed) logEvent('warn', 'Add: some stop/target changes failed — check the ladder on Vest.');
    else
      logEvent(
        'ok',
        `Added — ${fmtQ(total)} @ avg ${fmtP(entry)} · stop ${fmtP(exact.stop)} · ${goal.map((g, i) => `TP${i + 1} ${fmtP(g.price)}${g.qty != null ? ' × ' + fmtQ(g.qty) : ''}`).join(' · ')}`,
      );
    diag('add_ladder', {
      positionId,
      outcome: failed ? 'partial' : 'rebuilt',
      total,
      entry,
      stop: exact.stop,
      targets: goal,
      ops: ops.map((o) => o.m + ' ' + o.path.split('/').pop()),
      failed,
    });

    // breakeven follows the panel's setting, measured from the new average entry
    if (t.beMode === 'off') {
      if (old && S.plans[positionId] === old) endPlan(old, 'Breakeven: off for this trade now (Trade tab setting).');
      return;
    }
    const fresh = await tryOpenPosition(master, sym);
    const stopLegId =
      ((fresh && posLegs(fresh)) || []).filter((l) => l.kind === 'sl').map((l) => l.id)[0] ||
      (stops[0] && stops[0].id) ||
      null;
    addPlan({
      positionId,
      orderId: null,
      master,
      symbol: sym,
      side,
      stopLegId,
      tp1: exact.targets[0],
      beMode: t.beMode,
      beTrigger: +t.beTrigger || 0,
      beOffset: +t.beOffset || 0,
      entry,
      triggered: false,
      moved: false,
      reanchoring: false,
      at: Date.now(),
    });
  }

  // ── Re-anchor after fill (on by default). The order's stop and targets are computed from the live price at the click.
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
      bePlan.tp1 = exact.targets[0];
    }
    const legs = posLegs(pos).map((l) => ({ ...l, used: false }));
    const moves = [];
    const planMove = (kind, sent, to) => {
      const l = legs.find((x) => !x.used && x.kind === kind && Math.abs(x.price - sent) < tick / 2);
      if (!l) return;
      l.used = true;
      if (Math.abs(l.price - to) >= tick / 2) moves.push({ kind, id: l.id, from: l.price, to });
    };
    if (!(bePlan && bePlan.moved)) planMove('sl', sentStop, exact.stop);
    sentTargets.forEach((p, i) => planMove('tp', p, exact.targets[i]));
    if (!moves.length) {
      logEvent('info', `Filled at ${fmt(fill)} — stop and targets already exact.`);
      diag('reanchor', { positionId, fill, moves: [] });
      return done();
    }
    let failed = 0;
    for (const m of moves) {
      const isStop = m.kind === 'sl';
      try {
        await send('PUT', isStop ? '/v3/positions/stop-loss' : '/v3/positions/take-profit', master, {
          positionId,
          executionType: 'market',
          triggerPrice: fmt(m.to),
          [isStop ? 'stopLossId' : 'takeProfitId']: m.id,
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
        `Filled at ${fmt(fill)} — stop & targets re-placed exactly ${stopPts} / ${targetPts.join(' / ')} pts from the fill.`,
      );
    diag('reanchor', { positionId, fill, moves: moves.map((m) => ({ kind: m.kind, from: m.from, to: m.to })), failed });
    done();
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
    S.plans = saved && typeof saved === 'object' ? saved : {};
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
      const f = await fillInfo(p.master, p.symbol, p.orderId);
      if (f && f.price > 0) p.entry = f.price;
    }
    if (!(p.entry > 0)) {
      try {
        const pos = await openPosition(p.master, p.symbol, p.positionId);
        const open = pos ? parseFloat(pos.openPrice) : NaN;
        if (pos && nearMarket(open, priceOf(p.symbol) || open, NEAR_MARKET_LOOSE)) p.entry = open;
        else return endPlan(p, "Breakeven: the trade didn't open, nothing to watch.");
      } catch {}
    }
    savePlans();
    updateTrade();
  }
  function checkPlans(sym, px) {
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
  async function moveToBreakeven(p, px) {
    const tick = (SYMBOLS[p.symbol] || SYMBOLS[DEFAULT_SYMBOL]).tick;
    const be = breakevenPrice({ side: p.side, entry: p.entry, offsetPts: p.beOffset, tick });
    if (p.side === 'long' ? be >= px : be <= px) return; // a stop must stay on the losing side of price: wait
    if (!nearMarket(be, px, NEAR_MARKET_LOOSE))
      return endPlan(p, `Breakeven: computed stop ${be} is nowhere near the market — not moved.`);
    if (!p.stopLegId) return endPlan(p, 'Breakeven: no stop on this trade to move.');
    p.busy = true;
    try {
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
        `Breakeven: stop moved to ${body.triggerPrice} (${why}, entry ${fmtNum(p.entry, decimalsOf(tick))}).`,
      );
      diag('breakeven', {
        outcome: 'moved',
        positionId: p.positionId,
        entry: p.entry,
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
        } catch {}
      }
    }, PLAN_WATCH_MS);
  }
  if (window.__VC_TEST__) window.__vcPlans = () => S.plans;

  const DEFAULT_TARGET_PTS = 20;
  function renderTargets(body) {
    const box = body.querySelector('#tr-targets');
    box.innerHTML = S.trade.targets
      .map(
        (p, i) => `
      <div class="tr-tgt"><span class="tr-n">TP${i + 1}</span>
        <input class="tr-in" data-t="${i}" inputmode="decimal" aria-label="Target ${i + 1}, in points" value="${esc(p)}"><span class="tr-u">pts</span>
        <span class="tr-q" id="tq${i}"></span><span class="tr-g" id="tg${i}"></span>
        <button class="tr-x" data-del="${i}" title="Remove target ${i + 1}" aria-label="Remove target ${i + 1}"
          ${S.trade.targets.length < 2 ? 'disabled' : ''}>×</button></div>`,
      )
      .join('');
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
  }

  function updateTrade() {
    const body = _root && _root.querySelector('.body');
    if (!body || body.dataset.view !== 'trade' || !body.querySelector('.trade')) return;
    const c = tradeCalc(),
      $ = (id) => body.querySelector('#' + id);
    $('tr-sym').innerHTML = `${esc(c.meta.label)} <span class="chip">${esc(c.t.symbol)}</span>`;
    $('tr-acct').textContent =
      S.master && S.byId[S.master]
        ? `Master ${accLabel(S.master)} · ${S.armed ? `armed, ${S.followers.size} follower${S.followers.size === 1 ? '' : 's'} copy` : 'not armed (master only)'}`
        : 'No master selected';
    $('tr-px').textContent = fmtPx(c.price, c.meta.tick);
    body
      .querySelectorAll('[data-seg]')
      .forEach((g) =>
        g.querySelectorAll('button').forEach((b) => b.classList.toggle('on', S.trade[g.dataset.seg] === b.dataset.v)),
      );
    $('tr-size').style.display = c.t.sizeMode === 'max' ? 'none' : '';
    const maxNote =
      c.maxQty === null
        ? ''
        : `Vest's 100% at ${c.lev}x${c.limitedBy && c.limitedBy !== S.master ? `, limited by ${accLabel(c.limitedBy)}` : ''}`;
    $('tr-sizecalc').textContent =
      c.t.sizeMode === 'max'
        ? c.qty > 0
          ? `= ${fmtQty(c.qty, c.t.symbol)} contracts · ${maxNote}`
          : ''
        : c.t.sizeMode === 'risk'
          ? c.qty > 0
            ? `= ${fmtQty(c.qty, c.t.symbol)} contracts at a ${c.t.stopPts}-pt stop`
            : ''
          : c.qty > 0 && +c.t.stopPts > 0
            ? `risks ${fmtUsd(c.risk)} at the stop`
            : '';
    $('tr-stopcalc').textContent = c.qty > 0 && +c.t.stopPts > 0 ? `−${fmtUsd(c.risk)}` : '';
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
    }
    if (c.t.sizeMode !== 'risk' && L.maxStop !== null && c.qty > 0) {
      stopBad = stopNow >= L.maxStop;
      stopLim = `Stop must be under ${L.maxStop} pts at ${fmtQty(c.qty, c.t.symbol)} contracts, or the account fails first`;
    }
    $('tr-sizelim').textContent = sizeLim;
    $('tr-stoplim').textContent = stopLim;
    $('tr-stoplim').classList.toggle('bad', stopBad);
    c.t.targets.forEach((p, i) => {
      const q = c.qtys[i],
        qe = $('tq' + i),
        ge = $('tg' + i);
      if (qe) qe.textContent = q ? fmtQty(q, c.t.symbol) : '—';
      if (ge) ge.textContent = q ? '+' + fmtUsd(q * (+p || 0) * c.meta.pointValue) : '';
    });
    $('tr-anchornote').textContent =
      (c.t.anchor === 'click'
        ? 'Placed from the live price when you click.'
        : 'Re-placed exactly from your fill price right after entry.') +
      ' Adding to an open trade rebuilds them for the whole position from the new average entry.';
    $('tr-betrigw').style.display = c.t.beMode === 'points' ? '' : 'none';
    body.querySelector('.tr-be').style.display = c.t.beMode === 'off' ? 'none' : '';
    $('tr-sum').innerHTML =
      c.qty > 0 && c.qtys.length
        ? `Risk <b>${fmtUsd(c.risk)}</b>${c.fees > 0 ? ` + ${fmtUsd(c.fees)} fees` : ''} · Reward <b>${fmtUsd(c.reward)}</b> · <b>${c.risk > 0 ? (c.reward / c.risk).toFixed(2) : '—'}R</b>`
        : '';
    const fixHtml = c.fixes
      .map(
        (f, i) =>
          `<button class="tr-usemax" data-fix="${i}" data-act="${f.act === 'max' ? 'usemax' : 'fix-' + f.act}">${esc(f.label)}</button>`,
      )
      .join(' ');
    const warnHtml =
      (c.blocked
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
    $('tr-err').textContent = c.error || (S.adjusting ? 'Adjusting stop & targets…' : '');
    const q = c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '';
    $('tr-buy').textContent = `Buy ${q}`;
    $('tr-sell').textContent = `Sell ${q}`;
    $('tr-buy').disabled = $('tr-sell').disabled = !!c.error || !!c.blocked || !!S.placing || !!S.adjusting;
    const row = (lbl, pr, o) => {
      const tps = pr.targets.map((x, i) => `TP${i + 1} <b>${fmtPx(x, c.meta.tick)}</b>`).join(' · ');
      const px = (n) => fmtPx(roundTick(n, c.meta.tick), c.meta.tick);
      const ends =
        (o && o.fail ? ` · fail <b class="tr-fail">${px(o.fail)}</b>` : '') +
        (o && o.pass ? ` · pass <b class="tr-pass">${px(o.pass)}</b>` : '');
      return `<div><span class="tr-pl">${lbl}</span> stop <b>${fmtPx(pr.stop, c.meta.tick)}</b> · ${tps}${ends}</div>`;
    };
    $('tr-preview').innerHTML = !c.error
      ? row('Buy', c.long, c.sides.long) +
        row('Sell', c.short, c.sides.short) +
        (c.sides.long && (c.sides.long.fail || c.sides.long.pass)
          ? '<div class="tr-note">Fail and pass: where your equity reaches the floor or the target, counting the opening fee. Estimates, like Vest\'s own.</div>'
          : '')
      : '';
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

  function renderSettings(body) {
    const option = (key, on, name, desc, dim = false) => `
        <div class="opt ${dim ? 'dep-off' : ''}">
          <div class="opt-txt"><div class="opt-name">${name}</div><div class="opt-desc">${desc}</div></div>
          <button class="switch ${on ? 'on' : ''}" data-opt="${key}" role="switch" aria-checked="${on}" aria-label="${name}"><span class="knob"></span></button>
        </div>`;
    body.innerHTML = `
      <div class="settings">
        <div class="set-h">Execution</div>
        ${option(
          'fast',
          S.fast,
          'Fast mode',
          "Fire follower entries the instant the master sends, for the most simultaneous fills. They open before the master's order is confirmed.",
        )}
        ${option(
          'autoflat',
          S.autoFlatten,
          'Auto-flatten orphans',
          "If followers end up in a trade the master isn't in (its entry was refused or didn't fill), close them automatically instead of asking. Never used when the master might be in the trade.",
        )}
        <div class="set-h">Sizing</div>
        ${option(
          'capfit',
          S.capFit,
          'Cap-to-fit size',
          'Size each follower to its own equity instead of copying 1:1. Every account takes the same % risk with the same stop distance, ' +
            'and <b>different-size followers</b> are allowed (e.g. a 25k master with 5k accounts). Off: strict 1:1, same-size accounts only.',
        )}
        <div class="set-h">Updates</div>
        ${option(
          'updates',
          S.checkUpdates,
          'Check for updates',
          `Each time Vest loads, check GitHub for a newer version and offer a one-click install. You have v${VERSION}` +
            (S.update && S.update.latest ? `; the latest published is v${esc(S.update.latest)}.` : '.'),
        )}
        <div class="set-row"><button class="ghostbtn" data-act="check-now">Check now</button>
          <a class="ghostbtn" href="${REPO_URL}" target="_blank" rel="noopener">GitHub</a></div>
        <div class="set-h">Support</div>
        ${option(
          'supportapply',
          supportApplies(),
          `Use code ${SUPPORT_CODE} at checkout`,
          `Switch the discount code in Vest's purchase window to <b>${SUPPORT_CODE}</b> (5% off) each time it opens. Thank you for supporting the free copier.`,
        )}
        <div class="set-row"><button class="ghostbtn" data-act="copy-code">Copy code ${SUPPORT_CODE}</button></div>
      </div>`;
    body.querySelectorAll('[data-opt]').forEach(
      (b) =>
        (b.onclick = () => {
          const o = b.getAttribute('data-opt');
          if (o === 'fast') toggleFast();
          else if (o === 'autoflat') toggleAutoFlatten();
          else if (o === 'capfit') toggleCapFit();
          else if (o === 'supportapply') {
            const on = !supportApplies();
            if (on && !['yes', 'manual'].includes((store.get(SUPPORT_KEY, null) || {}).answered)) saveSupport('yes');
            setSupportApply(on);
            render();
          } else if (o === 'updates') {
            S.checkUpdates = !S.checkUpdates;
            saveOpts();
            render();
          }
        }),
    );
    body.querySelector('[data-act="check-now"]').onclick = () => checkForUpdate(true);
    body.querySelector('[data-act="copy-code"]').onclick = () =>
      copySupportCode().then((ok) => toast(ok ? `Code ${SUPPORT_CODE} copied.` : `Code: ${SUPPORT_CODE}`));
  }

  // Rules tab, and the one-time risk acknowledgement (shown on first load; required before arming or trading).
  function renderRules(body) {
    const first = !S.ack;
    const how = `
        <ul class="rules-list">
          <li><b>Live copying.</b> Arming copies your <b>master</b> account's orders to the selected <b>followers</b>
            as <b>real orders</b> on live accounts.</li>
          <li><b>Leverage is matched.</b> On arm, followers are set to the master's leverage. If you change leverage
            or switch markets, <b>disarm and arm again</b>.</li>
          <li><b>Flat, or already in the same trade.</b> Arm when everyone is flat, or when the master and followers
            hold the same position (same market and side): arming <b>adopts</b> it, so exits and stop/target changes
            copy. It never opens a trade for a follower that isn't already in it.</li>
          <li><b>Only your orders are copied.</b> If Vest closes the master itself (a drawdown breach or liquidation),
            followers stay open. Close them yourself or use Flatten All.</li>
          <li><b>Sizing.</b> Strict 1:1 copies the exact size (same-size accounts only). <b>Cap-to-fit</b> (Settings)
            sizes each follower to its own equity: same % risk, same stop distance, smaller size.</li>
          <li><b>Shared risk.</b> One bad trade hits <b>every</b> linked account at once. Size so a simultaneous loss
            is survivable.</li>
        </ul>`;
    const risk = `
        <div class="rules-h">Your risk</div>
        <ul class="rules-list">
          <li>Vest Copier <b>places real orders on live accounts</b>, automatically, using your logged-in Vest session.</li>
          <li>Copies can be late, fail, fill at a different price or size, or be missed entirely, for example when Vest
            changes its site, rejects an order or is slow. <b>Watch your accounts</b> while it runs.</li>
          <li><b>You alone are responsible</b> for every order it sends and every trade on your accounts, including any
            loss, drawdown breach or failed evaluation.</li>
          <li>It is provided free and <b>as is, with no warranty</b>. Its author accepts <b>no responsibility or liability</b>
            for anything that happens while you use it.</li>
          <li>It is not affiliated with or endorsed by Vest Markets. Whether your prop program allows a trade copier is
            yours to check. Nothing here is financial advice.</li>
        </ul>
        <div class="rules-terms">Full terms: <a href="${REPO_URL}/blob/main/DISCLAIMER.md" target="_blank" rel="noopener">Disclaimer</a>
          · <a href="${REPO_URL}/blob/main/LICENSE" target="_blank" rel="noopener">License</a></div>`;
    body.innerHTML = first
      ? `
      <div class="rules">
        <div class="rules-h">Before you use Vest Copier</div>
        ${risk}
        <div class="rules-h">How it works</div>
        ${how}
        <label class="rules-accept"><input type="checkbox" id="rl-check">
          I have read this. I use Vest Copier entirely at my own risk, and its author is not responsible for any loss.</label>
        <div class="rules-btns"><button class="armbtn" id="rl-agree" disabled>Accept and continue</button></div>
      </div>`
      : `
      <div class="rules">
        <div class="rules-h">Before you arm</div>
        ${how}
        ${risk}
        <div class="rules-btns"><button class="ghostbtn" id="rl-close">Close</button></div>
      </div>`;
    if (first) {
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
        maybeOfferSupport();
      };
    } else {
      body.querySelector('#rl-close').onclick = () => {
        S.rulesOpen = false;
        render();
      };
    }
  }

  // Account P&L summary — profit = equity − starting capital, per account and summed. Auto-updates with the balance poll.
  // ── Report a problem. One file with everything needed to debug (activity log, diagnostics, version, Vest build,
  // settings, accounts with balances), saved locally, plus a GitHub issue pre-filled with the version and the user's
  // description, ready for the file to be dragged in. Account ids are replaced by their labels ("Account 07") so the
  // file is safer to post publicly; nothing is sent anywhere by the copier.
  const ISSUE_FORM = 'bug_report.yml';
  function buildReport(note) {
    // Every account id becomes a name: active accounts by their label, closed ones by the label recorded next to the
    // id in the diagnostics, anything else by a placeholder. Position and order ids are Vest's random ids for single
    // orders (useless without a login) and stay, since they tie related events together.
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
    let unknown = 0;
    const nameFor = (id) => alias[id] || (alias[id] = `account-${++unknown}`);
    const scrub = (v) =>
      JSON.parse(JSON.stringify(v), function (k, val) {
        if (typeof val !== 'string') return val;
        if (alias[val]) return alias[val];
        if (isUuid(val) && ACCOUNT_KEYS.has(k) && (k !== 'id' || 'label' in this)) return nameFor(val);
        // account ids inside longer text, e.g. an error message holding an API path with the id in it
        return val.replace(/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi, (m) => alias[m] || m);
      });
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
      },
      settings: {
        fast: S.fast,
        autoFlatten: S.autoFlatten,
        capFit: S.capFit,
        checkUpdates: S.checkUpdates,
        trade: S.trade,
      },
      accounts,
      log: [...S.log].reverse().map((e) => ({ t: e.t.toISOString(), level: e.level, msg: e.msg })),
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
  function renderSupportTab(body) {
    if (body.dataset.view === 'support' && body.querySelector('.support-tab')) return;
    body.dataset.view = 'support';
    const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    body.innerHTML = `
      <div class="rules support-tab">
        <div class="rules-h">Support</div>
        <p class="sc-sub">Vest Copier v${VERSION} · ${link(`${REPO_URL}/blob/main/CHANGELOG.md`, "What's new")} ·
          ${link(`${REPO_URL}/blob/main/docs/USER-GUIDE.md`, 'User guide')} ·
          ${link('https://xamped.github.io/Vest-Copier/tutorial/', 'Tutorial')}</p>
        <div class="sup-card">
          <div class="sup-h">Report a problem</div>
          <p class="sc-sub">Describe what happened and what you expected. The copier saves a report file and opens a
            GitHub issue with your description filled in: drag the file into it and submit. Posting needs a free GitHub
            account.</p>
          <textarea class="report-note" id="rp-note" rows="5" aria-label="What happened"
            placeholder="What happened, and what did you expect? Which accounts, roughly when?"></textarea>
          <p class="sc-sub">The file holds the activity log, the diagnostics record, your settings, your copier version
            and your accounts' balances. Account ids are replaced by their names. It never contains passwords or login
            tokens.</p>
          <button class="armbtn sm" id="rp-send">Save report &amp; open issue</button>
        </div>
        <div class="sup-card">
          <div class="sup-h">Help and community</div>
          <p class="sc-sub">Questions, setup help, or just talking trades with other users: join the Vest Copier Discord.</p>
          <a class="ghostbtn" href="${DISCORD_URL}" target="_blank" rel="noopener">Join the Discord</a>
        </div>
        <div class="sup-card">
          <div class="sup-h">Ideas and feedback</div>
          <p class="sc-sub">Something that could work better, or a feature you'd use? Ideas go on GitHub too.</p>
          <button class="ghostbtn" id="sp-idea">Share an idea or feedback</button>
        </div>
        <div class="sup-card">
          <div class="sup-h">Support the project</div>
          <p class="sc-sub">Vest Copier is free. Code <b>${SUPPORT_CODE}</b> takes 5% off Vest purchases and helps keep it
            maintained. Settings → Support can enter it at checkout for you.</p>
          <button class="ghostbtn" id="sp-copy">Copy code ${SUPPORT_CODE}</button>
        </div>
      </div>`;
    const note = body.querySelector('#rp-note');
    ['keydown', 'keyup', 'keypress'].forEach((ev) => note.addEventListener(ev, (e) => e.stopPropagation())); // not Vest's shortcuts
    body.querySelector('#rp-send').onclick = () => sendReport(note.value.trim());
    body.querySelector('#sp-idea').onclick = shareIdea;
    body.querySelector('#sp-copy').onclick = () =>
      copySupportCode().then((ok) => toast(ok ? `Code ${SUPPORT_CODE} copied.` : `Code: ${SUPPORT_CODE}`));
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
  const CLAIM_GAP_MS = 2000; // between two accounts' claims: one at a time, unhurried (a claim answers in ~0.3 s)
  const CLAIM_RETRY_MS = 3000;
  const claimGap = () => (typeof window.__VC_CLAIM_GAP_MS === 'number' ? window.__VC_CLAIM_GAP_MS : CLAIM_GAP_MS);
  S.claim = null; // { phase: 'checking' | 'review' | 'running' | 'done', primary, items: [...], stop, error }
  const claimBusy = () => S.claim && (S.claim.phase === 'checking' || S.claim.phase === 'running');

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
  async function claimBalances() {
    const res = await api('/v3/accounts');
    const free = {};
    let primary = null;
    for (const a of res.accounts || []) {
      free[a.account_id] = num(a.amount);
      if (a.account_type === 1) primary = a.account_id;
    }
    return { free, primary };
  }

  async function claimPreview() {
    if (claimBusy()) return;
    if (S.flattening || S.placing || S.adjusting || S.arming)
      return toast('Wait for the current order, Flatten All or arming to finish.');
    S.claim = { phase: 'checking', items: [] };
    render();
    try {
      const { free, primary } = await claimBalances();
      if (!primary) throw new Error("couldn't find your Primary Account");
      const ids = Object.values(S.byId)
        .sort((a, b) => a.order - b.order)
        .map((r) => r.id);
      const items = await Promise.all(ids.map((id) => claimCheck(id, free[id])));
      S.claim = { phase: 'review', primary, items };
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

  function renderSummary(body) {
    const rows = Object.values(S.byId).sort((a, b) => a.size - b.size || a.order - b.order);
    if (!rows.length) {
      body.innerHTML = `<div class="empty">No accounts loaded.</div>`;
      return;
    }
    const sum = (arr) => arr.reduce((s, x) => s + (isNaN(x) ? 0 : x), 0);
    const totalEq = sum(rows.map((r) => r.equity)),
      totalInit = sum(rows.map((r) => r.size)),
      totalPnl = totalEq - totalInit;
    const sp = (n) =>
      (n >= 0 ? '+' : '−') +
      '$' +
      Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const pnlOf = (r) => (isNaN(r.equity) ? 0 : r.equity) - (isNaN(r.size) ? 0 : r.size);
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
    const keepHtml = funded.length
      ? `<div class="sum-keep" title="Each funded account's profit × its profit split, added up. Accounts in a loss count as $0.">
          <div class="sum-keep-v">${money(keep)}</div>
          <div class="sum-keep-l">you keep after splits${openTrades ? ', if closed now' : ''}</div></div>`
      : '';
    body.innerHTML = `
      <div class="summary">
        <div class="sum-top"><div class="sum-total ${totalPnl >= 0 ? 'pos' : 'neg'}">${sp(totalPnl)}</div>${keepHtml}</div>
        <div class="sum-sub">total P&amp;L · ${rows.length} account${rows.length > 1 ? 's' : ''} · equity ${money(totalEq)} / start ${money(totalInit)}</div>
        <div class="sum-list">
          ${rows
            .map((r) => {
              const n = (r.label.match(/(\d+)\s*$/) || [, '--'])[1];
              const pnl = pnlOf(r),
                k = keepOf(r);
              const keepLine =
                k > 0 ? `<span class="sum-k">keeps ${money(k)} · ${Math.round(r.split * 100)}%</span>` : '';
              return `<div class="sum-row"><span class="badge sm">${n}</span>
              <span class="sum-left"><span class="sum-name">${esc(r.label)} <span class="chip">${r.chip}</span></span>${keepLine}</span>
              <span class="sum-eq">${money(r.equity)}</span>
              <span class="sum-pnl ${pnl >= 0 ? 'pos' : 'neg'}">${sp(pnl)}</span></div>`;
            })
            .join('')}
        </div>
        ${notCounted.length ? `<div class="sum-note">Not counted in what you keep: ${notCounted.join('; ')}.</div>` : ''}
        ${funded.length ? claimHtml() : ''}
      </div>`;
    wireClaim(body);
  }

  function renderLog() {
    if (!_root) return;
    const el = _root.querySelector('.log');
    if (!el) return;
    const confirmBar = (text, goId, goLabel, noId, noLabel) =>
      `<div class="orphan">${text}<button class="obtn" id="${goId}">${goLabel}</button><button class="obtn keep" id="${noId}">${noLabel}</button></div>`;
    const n = S.orphan ? S.orphan.list.length : 0;
    const orphanHtml = n
      ? confirmBar(
          `${n} follower position${n !== 1 ? 's' : ''} without the master.`,
          'vc-flatten',
          'Flatten',
          'vc-keep',
          'Keep',
        )
      : '';
    const toastHtml = _toast ? `<div class="toast">${esc(_toast)}</div>` : '';
    el.innerHTML =
      orphanHtml +
      toastHtml +
      S.log
        .map(
          (e) =>
            `<div class="le ${e.level}"><span class="ts">${e.t.toLocaleTimeString([], { hour12: false })}</span><span>${esc(e.msg)}</span></div>`,
        )
        .join('');
    if (S.orphan) {
      const fb = el.querySelector('#vc-flatten'),
        kb = el.querySelector('#vc-keep');
      if (fb) fb.onclick = () => flattenOrphans();
      if (kb) kb.onclick = () => keepOrphans();
    }
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
    try {
      await buildRegistry();
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
      if (!S.ack) {
        S.rulesOpen = true; // first use: the risk acknowledgement comes first
        S.tradeOpen = S.summaryOpen = S.settingsOpen = false;
        render();
      } else maybeOfferSupport();
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
      'This copy of Vest Copier was garbled when it was copied (symbols look wrong). Reinstall it from ' + SCRIPT_URL,
    );
    diag('encoding', { probeLength: ENCODING_PROBE.length });
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
    loadAllSymbolRules();
    diag('session', {
      version: VERSION,
      build: fingerprint() || null,
      browser: navigator.userAgent,
      settings: { fast: S.fast, autoFlatten: S.autoFlatten, capFit: S.capFit, checkUpdates: S.checkUpdates },
      termsAccepted: S.ack,
      openPlans: Object.keys(store.get('vc-plans', {}) || {}).length,
    });
    // The copier's own crashes (not Vest's): Tampermonkey runs it from a "userscript" source.
    const ours = (stack) => /userscript|vest-copier/i.test(String(stack || ''));
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
    _root = buildPanel();
    loadPlans();
    renderHealth();
    renderLog();
    refresh();
    checkForUpdate();
    checkEncoding();
    watchPurchaseWindow();
    LOG(`v${VERSION} loaded.`);
  };
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
