import { CAP_BUFFER, DEFAULT_SYMBOL, EPS } from '../config.js';
import { S, SYMBOLS } from '../state.js';
import { decimalsOf, floorStep } from '../trade/order-math.js';

// Sizing. Size step of a symbol (0.0001 for NQ) and numbers written the way Vest's own client writes them:
// fixed decimals with trailing zeros stripped ("0.5", "31241.25", "31241").
export const sizeStepOf = (sym) => (SYMBOLS[sym] || SYMBOLS[DEFAULT_SYMBOL]).step;
export const fmtNum = (n, dec) => {
  const s = (+n).toFixed(dec);
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
};
export const fmtQty = (n, sym) => fmtNum(n, decimalsOf(sizeStepOf(sym)));

// Cap-to-fit. Vest's initial margin is notional ÷ leverage. With leverage synced across accounts and the same market,
// a follower's affordable size reduces to an equity ratio: no price lookup and no network call, so no added latency.
// The proportional size gives the follower the same margin use, and so the same % risk, as the master. A follower with
// equal or more equity sends the master's exact size; a smaller one is scaled down with a small buffer for fees and
// equity that is up to one poll old. Returns the size to send, whether it was scaled, and whether to skip the account.
const CAP_SAME_SIZE = 0.005; // cap-to-fit: within 0.5% of the master's equity counts as the same size
export function capQty(followerId, masterQtyStr, sym) {
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
export function scaleToFollower(reqQtyStr, followerQtyStr, masterQtyStr, sym) {
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
export function scaleLegs(legs, masterQtyStr, followerQtyStr, sym) {
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
