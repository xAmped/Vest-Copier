// Trade-ticket math: prices, sizes, risk and breakeven. Pure functions only.
// Everything here is a pure function of its inputs — no network, no state — so it's unit-tested.
export const decimalsOf = (step) => {
  const s = String(step);
  const e = s.match(/^[\d.]+e-(\d+)$/i); // 1e-7 and the like
  if (e) return (s.split('e')[0].split('.')[1] || '').length + +e[1];
  return s.includes('.') ? s.split('.')[1].length : 0;
};
/** Round a price to the symbol's tick (e.g. 0.25 for NDX). */
export const roundTick = (price, tick) => +(Math.round(price / tick) * tick).toFixed(decimalsOf(tick));
/** Floor a size to the symbol's size step (e.g. 0.0001). */
// the tolerance grows with the count, so a float a hair under a whole number of steps isn't floored a step too low
export const floorStep = (qty, step) => {
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
 * (1.0 over 3, start → 0.5000 / 0.3333 / 0.1667). Returns { qtys } or { error } if a slice would be empty.
 */
export function splitQty(total, n, mode, step) {
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
export function planPrices({ side, entry, stopPts, targetPts, tick }) {
  if (!(entry > 0)) return { error: 'No live price yet' };
  if (!(stopPts > 0)) return { error: 'Stop must be above zero points' };
  if (!targetPts.length) return { error: 'Add at least one target' };
  for (let i = 0; i < targetPts.length; i++) {
    if (!(targetPts[i] > 0)) return { error: `Target ${i + 1} must be above zero points` };
    if (i && !(targetPts[i] > targetPts[i - 1])) return { error: `Target ${i + 1} must be further than target ${i}` };
  }
  const dir = side === 'long' ? 1 : -1;
  const stop = roundTick(entry - dir * stopPts, tick),
    targets = targetPts.map((p) => roundTick(entry + dir * p, tick));
  if (!(stop > 0)) return { error: 'The stop would be at or below zero: use fewer points' };
  const bad = targets.findIndex((x) => !(x > 0));
  if (bad >= 0) return { error: `Target ${bad + 1} would be at or below zero: use fewer points` };
  return { stop, targets };
}

/** Size from a dollar risk: qty = risk ÷ (stop points × $ per point per unit), floored to the size step. */
export const riskQty = (riskUsd, stopPts, pointValue, step) =>
  riskUsd > 0 && stopPts > 0 && pointValue > 0 ? floorStep(riskUsd / (stopPts * pointValue), step) : 0;

/** Breakeven stop price: entry plus an offset in your favour (e.g. +1 pt covers fees), tick-rounded. */
// Entry (an average can sit between ticks) plus the offset, rounded to the tick on the profit side: never a loss.
// A negative offset would put the stop on the losing side of the entry: it counts as 0.
export const breakevenPrice = ({ side, entry, offsetPts, tick }) => {
  const n = (entry + (side === 'long' ? 1 : -1) * Math.max(0, offsetPts || 0)) / tick;
  return +((side === 'long' ? Math.ceil(n - 1e-9) : Math.floor(n + 1e-9)) * tick).toFixed(decimalsOf(tick));
};
/**
 * Should the stop move to breakeven now?  mode: 'off' | 'tp1' (after the first target fills) | 'points'
 * (price has moved `triggerPts` in your favour). Never fires twice.
 */
export function breakevenDue({ mode, side, entry, price, triggerPts, tp1Filled, alreadyMoved }) {
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
export const tradingPower = ({ free, upnl, leverage, takerFee }) =>
  leverage > 0 && free > 0
    ? (Math.max(0, free + Math.min(0, upnl || 0)) * leverage) /
      (1 + leverage * (takerFee || 0)) /
      (1 + TRADING_POWER_SPREAD)
    : 0;
/** The largest size that power buys at `price` (Vest prices margin at the margin mark price), floored to the step. */
export const maxQtyFor = (power, price, step) => (power > 0 && price > 0 ? floorStep(power / price, step) : 0);

/**
 * Where a position of `qty` (the whole position after this order) fails or passes, measured from the price now.
 * `equity` is the account's equity at that price; the opening fee comes straight out of it. Fail: equity reaches the
 * floor (drawdown, or the daily-loss floor when higher). Pass: equity reaches the target (evaluations only).
 */
export function failPassPrices({ side, qty, price, equity, openFee, floor, target }) {
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
export const minStopFor = (risk, maxQty, tick) =>
  risk > 0 && maxQty > 0 ? +(Math.ceil(risk / maxQty / tick - 1e-9) * tick).toFixed(decimalsOf(tick)) : null;
export const maxRiskAt = (maxQty, stopPts) => (maxQty > 0 && stopPts > 0 ? Math.floor(maxQty * stopPts + 1e-9) : null);
export const maxRiskForRoom = ({ room, price, stopPts, takerFee }) =>
  room > 0 && price > 0 && stopPts > 0
    ? Math.max(0, Math.floor(room / (1 + ((2 * price - stopPts) * (takerFee || 0)) / stopPts) - 0.01))
    : null;
export const maxStopForRoom = ({ room, qty, price, takerFee, tick }) => {
  if (!(room > 0) || !(qty > 0) || !(price > 0)) return null;
  const f = takerFee || 0,
    pts = (room - 0.01 - 2 * qty * price * f) / (qty * (1 - f));
  return pts > 0 ? +(Math.floor(pts / tick + 1e-9) * tick).toFixed(decimalsOf(tick)) : 0;
};
/** What a stop-out costs from the price now: the move to the stop on the whole position, plus both fees. */
export const stopOutLoss = ({ side, qty, price, stopPrice, openFee, takerFee }) =>
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
