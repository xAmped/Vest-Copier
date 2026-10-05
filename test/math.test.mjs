// Unit tests for the Trade panel's pure order math (points -> prices, scale splits, risk sizing).
//   node test/math.test.mjs
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../src/vest-copier.user.js', import.meta.url), 'utf8');
const body = src.slice(src.indexOf('const decimalsOf'), src.indexOf('if (window.__VC_TEST__)'));
const M = new Function(
  body + '; return { roundTick, floorStep, splitQty, planPrices, riskQty, breakevenPrice, breakevenDue };',
)();
let fails = 0;
const eq = (got, exp, label) => {
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  got ${JSON.stringify(got)} want ${JSON.stringify(exp)}`}`,
  );
  if (!ok) fails++;
};
const sum = (a) => +a.reduce((x, y) => x + y, 0).toFixed(4);

eq(M.splitQty(1, 3, 'start', 0.0001).qtys, [0.5, 0.3333, 0.1667], 'start: 1.0 over 3 targets');
eq(M.splitQty(1, 3, 'even', 0.0001).qtys, [0.3334, 0.3333, 0.3333], 'even: 1.0 over 3 targets');
eq(M.splitQty(1, 3, 'end', 0.0001).qtys, [0.1667, 0.3333, 0.5], 'end: 1.0 over 3 targets');
eq(M.splitQty(2.5, 2, 'start', 0.0001).qtys, [1.6667, 0.8333], 'start: 2.5 over 2 targets');
for (const mode of ['start', 'even', 'end'])
  for (const [t, n] of [
    [1.9041, 4],
    [8.1754, 5],
    [3.3333, 3],
    [0.0028, 7],
  ])
    eq(sum(M.splitQty(t, n, mode, 0.0001).qtys), t, `${mode}: ${t} over ${n} sums exactly`);
eq(
  M.splitQty(0.0007, 7, 'even', 0.0001).qtys,
  [0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001],
  'even: 0.0007 over 7 = one step each',
);
eq(M.splitQty(0.0007, 7, 'start', 0.0001).error !== undefined, true, 'start: 0.0007 over 7 is too small -> error');
eq(
  M.splitQty(1, 3, 'start', 0.0001).qtys[0] > M.splitQty(1, 3, 'start', 0.0001).qtys[2],
  true,
  'start: first slice is the heaviest',
);
eq(
  M.splitQty(1, 3, 'end', 0.0001).qtys[2] > M.splitQty(1, 3, 'end', 0.0001).qtys[0],
  true,
  'end: last slice is the heaviest',
);
eq(M.splitQty(0.0002, 3, 'even', 0.0001).error !== undefined, true, 'too small to split -> error');
eq(M.splitQty(5, 1, 'end', 0.0001).qtys, [5], 'one target takes the whole size');
eq(
  M.planPrices({ side: 'long', entry: 31221.3, stopPts: 20, targetPts: [20, 40, 60], tick: 0.25 }),
  { stop: 31201.25, targets: [31241.25, 31261.25, 31281.25] },
  'long: stop below, targets above, tick-rounded',
);
eq(
  M.planPrices({ side: 'short', entry: 31221.25, stopPts: 20, targetPts: [20, 40], tick: 0.25 }),
  { stop: 31241.25, targets: [31201.25, 31181.25] },
  'short: stop above, targets below',
);
eq(
  M.planPrices({ side: 'long', entry: 31221, stopPts: 20, targetPts: [40, 20], tick: 0.25 }).error !== undefined,
  true,
  'targets must be increasing distances',
);
eq(
  M.planPrices({ side: 'long', entry: 0, stopPts: 20, targetPts: [20], tick: 0.25 }).error,
  'No live price yet',
  'no price -> refuse',
);
eq(
  M.planPrices({ side: 'long', entry: 31221, stopPts: 0, targetPts: [20], tick: 0.25 }).error !== undefined,
  true,
  'zero stop -> refuse',
);
eq(M.riskQty(50, 20, 1, 0.0001), 2.5, 'risk $50 with a 20-pt stop = 2.5');
eq(M.riskQty(47.5, 25, 1, 0.0001), 1.9, 'risk $47.50 with a 25-pt stop = 1.9');
eq(M.riskQty(50, 0, 1, 0.0001), 0, 'zero stop -> no size');
eq(M.roundTick(31221.13, 0.25), 31221.25, 'round to 0.25 tick');
eq(M.floorStep(1.23456, 0.0001), 1.2345, 'floor to 0.0001 size step');
const be = (o) =>
  M.breakevenDue({
    side: 'long',
    entry: 31200,
    price: 31200,
    triggerPts: 15,
    tp1Filled: false,
    alreadyMoved: false,
    ...o,
  });
eq(
  M.breakevenPrice({ side: 'long', entry: 31221.25, offsetPts: 1, tick: 0.25 }),
  31222.25,
  'breakeven long +1 pt offset',
);
eq(
  M.breakevenPrice({ side: 'short', entry: 31221.25, offsetPts: 1, tick: 0.25 }),
  31220.25,
  'breakeven short +1 pt offset (below entry)',
);
eq(
  M.breakevenPrice({ side: 'long', entry: 31221.25, offsetPts: 0, tick: 0.25 }),
  31221.25,
  'breakeven with no offset = entry',
);
eq(be({ mode: 'off', price: 31300 }), false, 'BE off: never fires');
eq(be({ mode: 'tp1', tp1Filled: false, price: 31300 }), false, 'BE after TP1: waits for TP1');
eq(be({ mode: 'tp1', tp1Filled: true }), true, 'BE after TP1: fires once TP1 fills');
eq(be({ mode: 'points', price: 31214.75 }), false, 'BE at +15 pts (long): not yet at +14.75');
eq(be({ mode: 'points', price: 31215 }), true, 'BE at +15 pts (long): fires at +15');
eq(be({ mode: 'points', side: 'short', price: 31185 }), true, 'BE at +15 pts (short): fires 15 below entry');
eq(
  be({ mode: 'points', side: 'short', price: 31215 }),
  false,
  'BE at +15 pts (short): price moving against you never fires',
);
eq(be({ mode: 'points', price: 31300, alreadyMoved: true }), false, 'BE never fires twice');
console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
process.exit(fails ? 1 : 0);
