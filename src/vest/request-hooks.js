import { refreshSoon } from '../accounts/registry.js';
import { BALANCE_AFTER_TRADE_MS, OUR_EXIT_MS, _fetch } from '../config.js';
import { maybeFastOpen, reconcileFast } from '../copier/fast-mode.js';
import { mirror } from '../copier/mirror.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { priceOf, recentAt } from '../market/prices.js';
import { S } from '../state.js';
import { refreshTradeState } from '../trade/calc.js';
import { setScreen } from './account-feed.js';
import { acctIdFromAuth, offerUser, userToken, userTokenOk } from './auth.js';

// The page's fetch and XHR, wrapped: token capture, and the master's orders handed to the copier.
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
export function checkShape(action, req, method = 'POST') {
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

export const parseJson = (v, fallback) => {
  if (v && typeof v === 'object') return v;
  try {
    return typeof v === 'string' ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
export const orderAction = (url) => (String(url).match(ORDER_RE) || [])[1] || null;

// A completed request made by the page. Picks up the user's session token, and when armed, mirrors the master's
// order requests. Requests Vest refused (non-2xx) are never copied.
const onRequest = (url, reqBody, resBody, auth, method, status) => {
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
      ((S.acctState[S.master] && S.acctState[S.master].positions.find((p) => p.id === req.positionId)) || {}).symbol ||
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
  mirror(action, req, res, method);
};

// Wrap the page's fetch and XHR, at document-start, before Vest's own code makes a request.
export function installRequestHooks() {
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
    let pending = null;
    try {
      if (method === 'POST') pending = maybeFastOpen(url, body, auth);
    } catch {
      /* best effort: nothing to do if this fails */
    }
    try {
      offerUser(auth);
      if (method !== 'GET') notePageRequest(url, method, body);
    } catch {
      /* best effort: nothing to do if this fails */
    }
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
        if (vc.method !== 'GET') notePageRequest(vc.url, vc.method, b);
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
          if (pending) reconcileFast(pending, r, this.status);
          else onRequest(vc.url, b, r, vc.auth, vc.method, this.status);
        },
        { once: true },
      );
    }
    return _send.apply(this, arguments);
  };
}

export const waitForUserToken = (timeoutMs = 20000) =>
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
// the live feed isn't mistaken for one Vest made), the account Vest's screen switches to, and a leverage change.
const _exits = {}; // positionId -> when this tab last sent a close or reduce for it
export const noteExit = (positionId) => positionId && (_exits[positionId] = Date.now());
export const ourExit = (positionId) => Date.now() - (_exits[positionId] || 0) < OUR_EXIT_MS;
function notePageRequest(url, method, body) {
  const action = orderAction(url);
  if (action === 'close' || action === 'reduce') {
    const req = parseJson(body, null);
    if (req) noteExit(req.positionId);
  } else if (method === 'PATCH' && /\/v3\/user-state\/preferences/.test(url)) {
    const req = parseJson(body, null);
    if (req && req.lastUsedAccountId) setScreen(req.lastUsedAccountId);
  } else if (/\/v3\/user-state\/accounts\/[^/]+\/leverages\//.test(url))
    setTimeout(() => S.tradeOpen && refreshTradeState(), BALANCE_AFTER_TRADE_MS);
}
