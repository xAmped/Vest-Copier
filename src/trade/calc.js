import { fetchLeverages, levFor } from '../accounts/live-pnl.js';
import { accLabel, fetchBalances, floorOf, readOpenState, stateFresh } from '../accounts/registry.js';
import { fmtQty } from '../copier/sizing.js';
import { marginPriceOf, priceOf } from '../market/prices.js';
import { S, SYMBOLS } from '../state.js';
import {
  decimalsOf,
  failPassPrices,
  floorStep,
  maxQtyFor,
  maxRiskAt,
  maxRiskForRoom,
  maxStopForRoom,
  minStopFor,
  planPrices,
  riskQty,
  splitQty,
  stopOutLoss,
  tradingPower,
} from './order-math.js';
import { maxLeverageFor, orderLeverage } from './orders.js';
import { updateTrade } from './view.js';
import { money } from '../ui/format.js';
import { _feedAt } from '../vest/account-feed.js';
import { userTokenOk } from '../vest/auth.js';

// Trade tab: what the master's account can do now, and the ticket's numbers worked out from it.
// Built once, then only the computed numbers update, so the balance poll never wipes what you're typing. Keystrokes
// are kept from reaching Vest's own keyboard shortcuts.
export const fmtPx = (n, tick) =>
  n > 0
    ? n.toLocaleString('en-US', { minimumFractionDigits: decimalsOf(tick), maximumFractionDigits: decimalsOf(tick) })
    : '—';
export const fmtUsd = (n) => money(Math.abs(n) || 0);

// What the account can do: the master's open positions and resting orders and every account's saved leverage, read
// while the Trade tab is open (when it opens, with each balance poll, and after each order). The max size, the fail and
// pass prices and the warnings are worked out from them, the way Vest's own ticket does.
S.acctState = {}; // accountId -> { positions: [{ symbol, side, qty, openPrice, collateral }], ordersCollateral, at }
S.levs = null; // saved leverage by account and symbol (GET /v3/user-state)
let _tradeStateBusy = false;
export async function refreshTradeState() {
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

/** Everything the panel shows / would send, from the current settings + live price. Pure apart from reading state. */
export function tradeCalc() {
  const t = S.trade,
    sym = t.symbol,
    meta = SYMBOLS[sym],
    price = priceOf(sym),
    fee = meta.takerFee || 0,
    master = S.master && S.byId[S.master] ? S.master : null;
  const st = master && S.acctState[master];
  const held = (stateFresh(st) && st.positions.find((p) => p.symbol === sym)) || null;
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
            ? 'past floor'
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
      chip('25', '25', floorStep(held.qty * 0.25, meta.step)),
      chip('50', '50', floorStep(held.qty * 0.5, meta.step)),
      chip('100', '100', floorStep(held.qty, meta.step)),
      chip('max', 'MAX', floorStep(best, meta.step)),
    ];
    pick = chips.find((x) => x.key === (S.addPick || '25')) || chips[0];
  }
  const qty = pick
    ? pick.qty
    : t.sizeMode === 'max'
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
      stopPrice: held ? addStop() : avg - dir * (+t.stopPts || 0), // an add leaves the stop where it is
      openFee,
      takerFee: fee,
    });
    return { ...fp, loss, room: live.equity - floor };
  };
  const sides = { long: outcome('long'), short: outcome('short') };

  let error = null;
  // In a trade the setup (size mode, stop, targets, Auto BE) is for the next new trade: an add is held to its size,
  // the price and the margin only (it leaves the stop and targets as they are).
  const fresh = !held;
  if (!master) error = 'Pick a master account (M) first.';
  else if (fresh && t.sizeMode === 'max' && maxQty === null)
    error = price > 0 ? 'Working out the max size…' : 'Waiting for a live price…';
  else if (fresh && t.sizeMode === 'max' && !(maxQty > 0))
    error = `No trading power left on ${accLabel(limitedBy)} for ${meta.label} at ${lev}x.`;
  else if (!(qty > 0))
    error = held
      ? 'Too small to add.'
      : t.sizeMode === 'risk'
        ? 'Risk and stop must be above zero.'
        : 'Size must be above zero.';
  else if (fresh && split.error) error = split.error;
  else if (!(price > 0)) error = 'Waiting for a live price…';
  else if (fresh && long.error) error = long.error;
  else if (fresh && t.beMode === 'points' && !(+t.beTrigger > 0))
    error = 'Breakeven trigger must be above zero points.';
  if (master && pick && pick.why) error = `Add ${pick.label}%: ${pick.why}.`;

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

  // The Trade tab's two bars. Margin: how much of Vest's buying power the open position uses now and with this order
  // (the max above is what's left, on the tightest account). Risk: what the stop would lose, fees included, now and with
  // this order (an add rebuilds the stop from the new average), against the room left before the floor on the tightest
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
    pick,
  };
}
