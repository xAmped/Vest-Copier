import { refreshBalances } from '../accounts/registry.js';
import { BALANCE_AFTER_TRADE_MS } from '../config.js';
import { confirmFills, isImmediate, msSince } from './executor.js';
import { legsOf } from './legs.js';
import { openFollower } from './mirror.js';
import { raiseOrphans } from './orphans.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { S } from '../state.js';
import { acctIdFromAuth } from '../vest/auth.js';
import { checkShape, orderAction, parseJson } from '../vest/request-hooks.js';

// Fast mode: follower opens fire as the master's order is sent, then are reconciled with its outcome.
// Returns a `pending` descriptor if it fired follower opens for a master OPEN; otherwise null.
export function maybeFastOpen(url, reqBody, auth) {
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
export function reconcileFast(pending, resBody, status, unreadable = false) {
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
      raiseOrphans(pending.sym, list, 'the copier was disarmed while they were being opened', S.master);
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
