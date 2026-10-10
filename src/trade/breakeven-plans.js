import { DEFAULT_SYMBOL, FEED_FILL_WAIT_MS, NEAR_MARKET_LOOSE } from '../config.js';
import { fillInfo, sleep } from '../copier/executor.js';
import { posIdOf, posLegs } from '../copier/legs.js';
import { fmtNum } from '../copier/sizing.js';
import { logEvent } from '../core/activity-log.js';
import { diag, errCode } from '../core/diagnostics.js';
import { store } from '../core/settings.js';
import { siteBlocks } from '../health/site-check.js';
import { priceOf, unwatchUnused, watchPrice } from '../market/prices.js';
import { S, SYMBOLS } from '../state.js';
import { beRef } from './manage.js';
import { breakevenDue, breakevenPrice, decimalsOf } from './order-math.js';
import { nearMarket, openPosition, send } from './orders.js';
import { updateTrade } from './view.js';
import { render } from '../ui/render.js';
import { feedLive } from '../vest/account-feed.js';
import { api, mintAccountToken } from '../vest/api.js';

// Breakeven engine. One plan per trade placed from the panel, saved so a page reload keeps watching. It watches the
// live mark price; once due (TP1 crossed, or +X pts in favour) it moves the master's stop to entry + offset. That move
// goes through the hooked fetch too, so an armed copier moves the followers' stops with it.
const PLANS_KEY = 'vc-plans';
const PLAN_NO_ENTRY_MS = 60000,
  PLAN_WATCH_MS = 5000,
  BE_RETRY_MS = 3000,
  BE_MAX_FAILURES = 5;
S.plans = {};
let _planTimer = null;
export function savePlans() {
  store.set(PLANS_KEY, S.plans);
}
export function loadPlans() {
  const saved = store.get(PLANS_KEY, {});
  S.plans = {};
  // only plans that can be acted on: a position id, a known side and a market name
  if (saved && typeof saved === 'object')
    for (const [k, p] of Object.entries(saved))
      if (
        p &&
        typeof p === 'object' &&
        p.positionId === k &&
        typeof p.symbol === 'string' &&
        /^(long|short)$/.test(p.side)
      )
        S.plans[k] = p;
  const list = Object.values(S.plans);
  list.forEach((p) => {
    p.busy = false; // nothing is in flight after a reload
    p.reanchoring = false;
    watchPrice(p.symbol);
    if (!(p.entry > 0)) fillEntry(p); // reloaded before its entry was known
  });
  if (list.length) startPlanWatch();
}
export function addPlan(p) {
  S.plans[p.positionId] = p;
  savePlans();
  watchPrice(p.symbol);
  startPlanWatch();
  if (!p.reanchoring && !(p.entry > 0)) fillEntry(p); // re-anchor supplies the entry when it runs
  updateTrade();
}
export function endPlan(p, why) {
  if (S.plans[p.positionId] !== p) return; // already replaced (an add rebuilt it) or ended
  delete S.plans[p.positionId];
  savePlans();
  if (why) logEvent('info', why);
  unwatchUnused();
  updateTrade();
}
export async function fillEntry(p) {
  // the real fill price: breakeven is measured from it
  for (let i = 0; i < 4 && !(p.entry > 0); i++) {
    if (i) await sleep(1200);
    const f = await fillInfo(p.master, p.symbol, p.orderId, i ? 0 : FEED_FILL_WAIT_MS);
    if (f && f.price > 0) p.entry = f.price;
  }
  if (!(p.entry > 0)) {
    try {
      const pos = await openPosition(p.master, p.symbol, p.positionId);
      const open = pos ? parseFloat(pos.openPrice) : NaN;
      if (pos && nearMarket(open, priceOf(p.symbol) || open, NEAR_MARKET_LOOSE)) p.entry = open;
      else return endPlan(p, "Breakeven: the trade didn't open, nothing to watch.");
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  savePlans();
  updateTrade();
}
export function checkPlans(sym, px) {
  if (siteBlocks()) return; // paused while Vest's update is unchecked or failed the check
  for (const p of Object.values(S.plans)) {
    if (
      p.symbol !== sym ||
      p.moved ||
      p.busy ||
      p.reanchoring ||
      !(p.entry > 0) ||
      (p.retryAt && Date.now() < p.retryAt)
    )
      continue;
    if (!nearMarket(p.entry, px, NEAR_MARKET_LOOSE)) {
      // an implausible entry is never acted on
      endPlan(
        p,
        `Breakeven: stopped watching — its entry (${p.entry}) is nowhere near the market. Manage this stop yourself.`,
      );
      diag('breakeven', {
        outcome: 'dropped-bad-entry',
        positionId: p.positionId,
        entry: p.entry,
        tp1: p.tp1,
        price: px,
      });
      continue;
    }
    if (!p.triggered) {
      // sticky: once TP1 / +X is reached, it stays due
      const tp1Hit = p.side === 'long' ? px >= p.tp1 : px <= p.tp1;
      p.triggered = breakevenDue({
        mode: p.beMode,
        side: p.side,
        entry: p.entry,
        price: px,
        triggerPts: p.beTrigger,
        tp1Filled: tp1Hit,
        alreadyMoved: false,
      });
      if (!p.triggered) continue;
      savePlans();
    }
    moveToBreakeven(p, px);
  }
}
// Price must be clear of breakeven by BE_CLEAR_TICKS (Vest refuses a stop the bid/ask has passed). Before moving, the
// position is re-read: the stop is measured from the worse of the plan's entry and Vest's average (never locks in a
// loss), and a stop already at or past breakeven (moved by hand, say) is left alone.
const BE_WAIT_MS = 2000;
async function moveToBreakeven(p, price) {
  const tick = (SYMBOLS[p.symbol] || SYMBOLS[DEFAULT_SYMBOL]).tick,
    long = p.side === 'long';
  const { px, clear } = beRef(p.symbol, p.side, price, tick);
  const beAt = (entry) => breakevenPrice({ side: p.side, entry, offsetPts: p.beOffset, tick });
  const tooClose = (be) => (long ? px <= be + clear : px >= be - clear);
  if (tooClose(beAt(p.entry))) return; // a stop must stay clear of price on the losing side: wait
  if (!nearMarket(beAt(p.entry), px, NEAR_MARKET_LOOSE))
    return endPlan(p, `Breakeven: computed stop ${beAt(p.entry)} is nowhere near the market — not moved.`);
  p.busy = true;
  try {
    let pos;
    try {
      pos = await openPosition(p.master, p.symbol, p.positionId);
    } catch {
      p.retryAt = Date.now() + BE_WAIT_MS; // couldn't read it: try again shortly
      return;
    }
    if (!pos) return endPlan(p, 'Breakeven: trade closed — stopped watching.');
    const avg = parseFloat(pos.openPrice);
    const entry =
      avg > 0 && nearMarket(avg, px, NEAR_MARKET_LOOSE)
        ? long
          ? Math.max(p.entry, avg)
          : Math.min(p.entry, avg)
        : p.entry;
    const be = beAt(entry);
    if (tooClose(be)) {
      p.retryAt = Date.now() + BE_WAIT_MS; // Vest's average is worse than the plan's entry: wait for price
      return;
    }
    const sls = posLegs(pos).filter((l) => l.kind === 'sl');
    const sl = sls.find((l) => l.id === p.stopLegId) || sls[0];
    if (!sl) return endPlan(p, 'Breakeven: no stop on this trade to move.');
    if (long ? sl.price >= be - tick / 2 : sl.price <= be + tick / 2)
      return endPlan(p, `Breakeven: the stop (${sl.price}) is already at or past breakeven — left as it is.`);
    p.stopLegId = sl.id;
    const body = {
      positionId: p.positionId,
      executionType: 'market',
      triggerPrice: fmtNum(be, decimalsOf(tick)),
      stopLossId: p.stopLegId,
    };
    await send('PUT', '/v3/positions/stop-loss', p.master, body);
    p.moved = true;
    const why = p.beMode === 'tp1' ? 'TP1 reached' : `+${p.beTrigger} pts reached`;
    logEvent('ok', `Breakeven: stop moved to ${body.triggerPrice} (${why}, entry ${fmtNum(entry, decimalsOf(tick))}).`);
    diag('breakeven', {
      outcome: 'moved',
      positionId: p.positionId,
      entry,
      planEntry: p.entry,
      vestAvg: avg,
      stop: body.triggerPrice,
      mode: p.beMode,
      price: px,
    });
    endPlan(p, null);
  } catch (e) {
    p.failures = (p.failures || 0) + 1;
    diag('breakeven', {
      outcome: 'failed',
      positionId: p.positionId,
      error: e.message,
      errorCode: errCode(e),
      attempt: p.failures,
    });
    if (p.failures >= BE_MAX_FAILURES) {
      endPlan(p, `Breakeven: Vest refused the stop move ${p.failures} times (${e.message}) — move your stop yourself.`);
    } else {
      p.retryAt = Date.now() + BE_RETRY_MS;
      logEvent('warn', `Breakeven: stop move failed (${e.message}) — retrying.`);
    }
  } finally {
    p.busy = false;
    savePlans();
  }
}
function startPlanWatch() {
  // end plans whose trade has closed (stop, target, manual)
  if (_planTimer) return;
  _planTimer = setInterval(async () => {
    const list = Object.values(S.plans);
    if (!list.length) {
      clearInterval(_planTimer);
      _planTimer = null;
      return;
    }
    if (feedLive() && !list.some((p) => !(p.entry > 0))) return; // the live feed ends a plan the moment its trade closes
    for (const master of [...new Set(list.map((p) => p.master))]) {
      try {
        const r = await api('/v3/positions/opened', (await mintAccountToken(master)).token);
        const open = new Set(((r && r.positions) || []).map(posIdOf));
        list
          .filter((p) => p.master === master && p.entry > 0 && !open.has(p.positionId))
          .forEach((p) => endPlan(p, 'Breakeven: trade closed — stopped watching.'));
        list
          .filter(
            (p) => p.master === master && !(p.entry > 0) && !p.reanchoring && Date.now() - p.at > PLAN_NO_ENTRY_MS,
          )
          .forEach((p) =>
            endPlan(p, "Breakeven: couldn't find this trade's entry — stopped watching. Manage the stop yourself."),
          );
      } catch {
        /* best effort: nothing to do if this fails */
      }
    }
  }, PLAN_WATCH_MS);
}
if (window.__VC_TEST__) window.__vcPlans = () => S.plans;
if (window.__VC_TEST__) window.__vcState = () => S;
if (window.__VC_TEST__) window.__vcRender = () => render();
