// Vest session tokens, read from the page's own requests.
// The page's own tokens are read from its requests; nothing is stored. A user token (no accountId claim) lists
// accounts and mints short-lived account tokens; an account token identifies which account an order is for.
export const decodeJwt = (t) => {
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
export let userToken = null;
export const offerUser = (auth) => {
  if (!auth || !/^Bearer\s+/i.test(auth)) return;
  const t = bearer(auth),
    c = decodeJwt(t);
  if (c.userId && !c.accountId && c.exp) userToken = t;
};
export const acctIdFromAuth = (auth) => (auth ? decodeJwt(bearer(auth)).accountId || null : null);
export const userTokenOk = () => userToken && decodeJwt(userToken).exp * 1000 > Date.now() + 5000;
