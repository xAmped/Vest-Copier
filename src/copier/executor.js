import { accLabel } from '../accounts/registry.js';
import {
  DEFAULT_LEVERAGE,
  EXEC_WINDOW_S,
  FEED_FILL_WAIT_MS,
  FILL_FIRST_LOOK_MS,
  FILL_RETRY_MS,
  FILL_TRIES,
} from '../config.js';
import { syncLegs } from './legs.js';
import { enqueue } from './mirror.js';
import { raiseOrphans } from './orphans.js';
import { logEvent } from '../core/activity-log.js';
import { diag, persistDiagSoon } from '../core/diagnostics.js';
import { S, SYMBOLS } from '../state.js';
import { openPosition } from '../trade/orders.js';
import { feedFill, feedLive } from '../vest/account-feed.js';
import { api, mintAccountToken } from '../vest/api.js';

// Sending follower orders and confirming their fills.
// Follower orders use each follower's own account token, with an Idempotency-Key on every order.
export const idem = () => ({
  'Idempotency-Key': crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
});
export async function acctSend(method, id, path, body, key) {
  const { token } = await mintAccountToken(id);
  return api(path, token, { method, body: JSON.stringify(body), headers: key ? { 'Idempotency-Key': key } : idem() });
}
export const acctPost = (id, path, body) => acctSend('POST', id, path, body);
export const acctPut = (id, path, body) => acctSend('PUT', id, path, body);
export const acctDelete = (id, path, body) => acctSend('DELETE', id, path, body);
export async function setFollowerLeverage(id, sym, lev) {
  const { token } = await mintAccountToken(id);
  const path = `/v3/user-state/accounts/${id}/leverages/${encodeURIComponent(sym)}`;
  return api(path, token, { method: 'PUT', body: JSON.stringify({ leverage: String(lev) }) });
}
// Vest requires a leverage on close orders: the request's, else the one synced for this account and market, else a
// default.
export const closeBody = (symbol, positionId, leverage, accountId) => ({
  symbol,
  positionId,
  orderType: 'market',
  leverage: String(leverage || S.levCache[accountId + '|' + symbol] || DEFAULT_LEVERAGE),
});
// Market / IOC orders execute at once, so their fills can be checked; a resting limit order has nothing to find yet.
export const isImmediate = (req) => !req || req.orderType === 'market' || req.timeInForce === 'IOC';
export const who = (id) => ({ account: id, label: accLabel(id) }); // the account fields every diag record carries
export const msSince = (t0) => Math.round(performance.now() - t0);
export const entryByOrderId = (oid) => Object.values(S.posMap).find((e) => e.masterOrderId === oid);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EXEC_PAGE = 200;
// Fill price/time for one order, matched by order id in /v3/executions.
// Returns { price, at } when filled, null when Vest's history has no such fill, or undefined when the lookup itself
// failed: a failed lookup must never be read as "did not fill".
// The live feed answers first (within FEED_FILL_WAIT_MS): a fill, or Vest saying it didn't run the order. Only then is
// Vest's fill history asked.
export async function fillInfo(accountId, symbol, orderId, feedWait = FEED_FILL_WAIT_MS) {
  const ff = await feedFill(orderId, feedWait);
  if (ff) return ff.missing ? null : { price: ff.price, at: ff.at };
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
export async function confirmFills(symbol, master, placed, entry, kind = 'entry') {
  if (!placed.length && !master.orderId) return;
  if (!feedLive()) await sleep(FILL_FIRST_LOOK_MS); // with the feed, each check waits on it instead
  // → { fill } when filled, { missing: true } when confirmed absent, {} when it couldn't be checked
  const tryFill = async (acct, oid) => {
    let failed = false;
    for (let i = 0; i < FILL_TRIES; i++) {
      const f = await fillInfo(acct, symbol, oid, i ? 0 : FEED_FILL_WAIT_MS); // the feed is waited on once
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
    unknownPlaced = [],
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
  } else if (filledWithoutMaster.length && kind === 'add') {
    const names = filledWithoutMaster.map((p) => p.label).join(', ');
    logEvent('warn', `${names} added but the master didn't — they now hold more than the master. Reduce them on Vest.`);
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
