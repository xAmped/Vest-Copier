import { accLabel } from '../accounts/registry.js';
import { EXIT_RETRY_MS, LEG_SYNC_DELAY_MS, RESYNC_AFTER_REDUCE_MS } from '../config.js';
import {
  acctDelete,
  acctPost,
  acctPut,
  acctSend,
  closeBody,
  confirmFills,
  entryByOrderId,
  idem,
  isImmediate,
  msSince,
  setFollowerLeverage,
  sleep,
  who,
} from './executor.js';
import { legsOf, matchLeg, posIdOf, syncLegs } from './legs.js';
import { raiseOrphans } from './orphans.js';
import { capQty, fmtQty, scaleLegs, scaleToFollower, sizeStepOf } from './sizing.js';
import { logEvent } from '../core/activity-log.js';
import { diag, errCode } from '../core/diagnostics.js';
import { S } from '../state.js';
import { floorStep } from '../trade/order-math.js';
import { openPosition } from '../trade/orders.js';
import { noteExit } from '../vest/request-hooks.js';

// Copying the master's orders to each follower: opens, adds, reduces, closes and every stop and target.

// Every follower action on one trade runs in order. An exit never overtakes the entry or an add still in flight, and
// two quick edits of the same leg land in the order they were made. Entries themselves never wait.
export function enqueue(entry, task) {
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
          for (const k of ['stopLossId', 'takeProfitId', 'orderId', 'id']) if (body[k] === masterLegId) body[k] = fl.id;
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
export const levKey = (lev) => String(Math.round(parseFloat(lev) * 100) / 100);

// Open ONE follower: sized (cap-to-fit), leverage synced if needed, stop and targets attached. Writes the follower's
// record into `followersMap` (shared by the normal and fast paths) and returns a `placed` record, or null.
export async function openFollower(f, o, followersMap, lat, fast) {
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
      expected: isImmediate(o.req) ? 'fill' : 'rest', // a resting limit fills later, if at all
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
// The retry keeps the same Idempotency-Key: if Vest ran the first one (a 504 or a dropped connection after it executed),
// it won't run the reduce twice.
export async function sendExit(f, path, body) {
  const key = idem()['Idempotency-Key'];
  noteExit(body && body.positionId); // the feed will report it closing: this tab did that
  try {
    return await acctSend('POST', f, path, body, key);
  } catch (e) {
    const code = errCode(e);
    if (code != null && code < 429) throw e;
    await sleep(EXIT_RETRY_MS);
    return acctSend('POST', f, path, body, key);
  }
}

// Mirror a MASTER action to every follower. Quantities are 1:1 unless cap-to-fit is on. Followers use the master's
// leverage for each order (pre-synced at arm, so the leverage PUT is normally skipped).
export function mirror(action, req, res, method = 'POST') {
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
      resting: !isImmediate(req), // a limit entry: followers' orders may still be resting
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
    if (req.orderType && req.orderType !== 'market') {
      logEvent(
        'warn',
        `The master's reduce is a ${req.orderType} order: not copied (followers would exit at market now). Reduce them on Vest when it fills.`,
      );
      diag('reduce', { outcome: 'skipped', reason: 'non-market reduce', orderType: req.orderType });
      return;
    }
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
    logEvent('info', `MASTER cancelled a resting order on ${accLabel(S.master)}`);
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
        ).then(() => setTimeout(() => enqueue(addEntry, () => syncLegs(addEntry)), RESYNC_AFTER_REDUCE_MS)),
      );
      return;
    }
    const e = entryByOrderId(req.orderId);
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
      ),
    );
  }
}
