import { API, TOKEN_REFRESH_MARGIN_MS, _fetch } from '../config.js';
import { S } from '../state.js';
import { renderRate } from '../ui/panel.js';
import { decodeJwt, userToken } from './auth.js';
import { parseJson } from './request-hooks.js';

// Requests to Vest's API as a given account, and the short-lived account tokens they need.
// Vest REST call. Errors read "<path> -> <status>" (errCode() parses the status back out).
const READ_TIMEOUT_MS = 15000;
export const api = async (path, token = userToken, opts = {}) => {
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
  try {
    const rem = r.headers.get('x-ratelimit-remaining');
    if (rem != null) {
      S.rate = { remaining: +rem, limit: +r.headers.get('x-ratelimit-limit') || S.rate.limit };
      renderRate();
    }
  } catch {
    /* best effort: nothing to do if this fails */
  }
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
  if (!r.ok) throw new Error(`${path} -> ${r.status}`);
  return parseJson(text, text);
};
// Account tokens last ~15 minutes. Cached, and concurrent requests for the same account share one mint.
const acctTokens = {},
  minting = {},
  tokenOwner = {}; // account token -> account id, to renew a revoked one
export const mintAccountToken = (id) => {
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
        tokenOwner[tok] = id;
        if (S.byId[id]) S.byId[id].canTrade = !!cl.canTrade; // a breached or closed account can't trade
        return (acctTokens[id] = { token: tok, exp: r.accessExpiresAtMs || cl.exp * 1000, canTrade: !!cl.canTrade });
      } finally {
        delete minting[id];
      }
    })());
};
