import { fetchLeverages, levFor } from '../accounts/live-pnl.js';
import { accLabel } from '../accounts/registry.js';
import { NEAR_MARKET_LOOSE } from '../config.js';
import { closeBody } from '../copier/executor.js';
import { posIdOf, posLegs } from '../copier/legs.js';
import { fmtNum, fmtQty } from '../copier/sizing.js';
import { logEvent, toast } from '../core/activity-log.js';
import { diag, errCode } from '../core/diagnostics.js';
import { siteBlocks } from '../health/site-check.js';
import { priceOf, stopRefOf } from '../market/prices.js';
import { S, SYMBOLS } from '../state.js';
import { endPlan } from './breakeven-plans.js';
import { fmtPx, refreshTradeState } from './calc.js';
import { breakevenPrice, decimalsOf, floorStep } from './order-math.js';
import { maxLeverageFor, nearMarket, openPosition, orderLeverage, send } from './orders.js';
import { updateTrade } from './view.js';

// Breakeven and Close by hand, for the master's open position in this market. Both go through the hooked fetch, so
// an armed copier moves each follower's stop / closes each follower like the master. Breakeven = entry + the Auto BE
// "lock" points, only once price is past it (a stop must stay on the losing side) and only if it tightens the stop.
// Vest triggers stops on the best bid (longs) / ask (shorts), and refuses a stop the bid has already passed (seen live:
// HTTP 400 with the mark a fraction above it). With Vest's book live, the bid (ask) itself must be BE_BOOK_CLEAR_TICKS
// clear of breakeven; without it, the mid or mark must be BE_CLEAR_TICKS clear (about a spread more).
const BE_CLEAR_TICKS = 4,
  BE_BOOK_CLEAR_TICKS = 2;
// The price a breakeven stop is checked against and how far clear it must be: { px, clear }.
export const beRef = (sym, side, px, tick) => {
  const ref = stopRefOf(sym, side);
  return ref > 0 ? { px: ref, clear: BE_BOOK_CLEAR_TICKS * tick } : { px, clear: BE_CLEAR_TICKS * tick };
};
export function breakevenPlan(h, price, tick) {
  const be = breakevenPrice({ side: h.side, entry: h.openPrice, offsetPts: 0, tick }); // breakeven: the average entry
  const { px, clear } = beRef(h.symbol, h.side, price, tick);
  const sl = (h.triggers || []).find((x) => x.kind === 'sl');
  const long = h.side === 'long';
  const why = !sl
    ? 'This position has no stop to move.'
    : !(px > 0)
      ? 'Waiting for a live price…'
      : long
        ? sl.price >= be
          ? 'The stop is already at or past breakeven.'
          : px <= be + clear
            ? `Price needs to be above ${fmtPx(be + clear, tick)} first (stops trigger on the bid).`
            : null
        : sl.price <= be
          ? 'The stop is already at or past breakeven.'
          : px >= be - clear
            ? `Price needs to be below ${fmtPx(be - clear, tick)} first (stops trigger on the ask).`
            : null;
  return { price: be, sl, why };
}
export async function breakevenNow() {
  if (S.placing || S.adjusting || S.flattening || S.arming) return;
  const siteHeld = siteBlocks();
  if (siteHeld) return toast(siteHeld);
  const master = S.master,
    sym = S.trade.symbol,
    meta = SYMBOLS[sym],
    tick = meta.tick,
    fmt = (n) => fmtNum(n, decimalsOf(tick));
  if (!master) return;
  S.placing = true;
  updateTrade();
  try {
    // read the position fresh: its entry and stop as Vest has them now
    const pos = await openPosition(master, sym);
    if (!pos) throw new Error(`${accLabel(master)} has no open ${meta.label} position`);
    const px = priceOf(sym),
      entry = parseFloat(pos.openPrice);
    if (!nearMarket(entry, px, NEAR_MARKET_LOOSE))
      throw new Error(`Vest shows an entry of ${pos.openPrice}, nowhere near the market — move the stop yourself`);
    const h = { symbol: sym, side: pos.side, openPrice: entry, triggers: posLegs(pos) };
    const be = breakevenPlan(h, px, tick);
    if (be.why) throw new Error(be.why.replace(/\.$/, ''));
    await send('PUT', '/v3/positions/stop-loss', master, {
      positionId: posIdOf(pos),
      executionType: 'market',
      triggerPrice: fmt(be.price),
      stopLossId: be.sl.id,
    });
    const plan = S.plans[posIdOf(pos)];
    if (plan) {
      plan.moved = true;
      endPlan(plan, null);
    }
    logEvent('ok', `Breakeven: stop moved to ${fmt(be.price)} (entry ${fmt(entry)}, by hand).`);
    diag('breakeven', { outcome: 'moved-manual', positionId: posIdOf(pos), entry, stop: fmt(be.price), price: px });
  } catch (e) {
    const why =
      /HTTP 400/.test(e.message) && !e.message.includes('Price needs')
        ? `Vest refused the stop (price was too close to breakeven: stops trigger on the bid/ask)`
        : e.message;
    logEvent('warn', `Breakeven: not moved — ${why}.`);
    diag('breakeven', {
      outcome: 'manual-refused',
      error: e.message,
      errorCode: errCode(e),
      price: priceOf(sym),
    });
  } finally {
    S.placing = false;
    updateTrade();
    refreshTradeState();
  }
}
export async function closeNow() {
  if (S.placing || S.adjusting || S.flattening || S.arming) return;
  const master = S.master,
    sym = S.trade.symbol,
    meta = SYMBOLS[sym];
  if (!master) return;
  S.placing = true;
  updateTrade();
  try {
    const pos = await openPosition(master, sym);
    if (!pos) throw new Error(`${accLabel(master)} has no open ${meta.label} position`);
    const lev = orderLeverage(levFor(await fetchLeverages(), master, sym), maxLeverageFor(sym, master));
    await send('POST', '/v3/positions/close', master, closeBody(sym, posIdOf(pos), lev, master));
    logEvent(
      'ok',
      `Trade panel: CLOSE ${pos.quantity} ${meta.label} on ${accLabel(master)}${S.armed ? ' — the copier closes the followers' : ''}.`,
    );
    diag('trade_panel', { outcome: 'closed', positionId: posIdOf(pos), quantity: pos.quantity });
  } catch (e) {
    logEvent('warn', `Close: not sent — ${e.message}.`);
    diag('trade_panel', { outcome: 'close-failed', error: e.message, errorCode: errCode(e) });
  } finally {
    S.placing = false;
    updateTrade();
    refreshTradeState();
  }
}

// Scale out: take the picked share (25 or 50%) off the master's position at market, with Vest's own reduce order (the
// body its close window sends). 100% is a close. The stop and targets stay where they are. It goes through the hooked
// fetch, so an armed copier reduces each follower by the same share of its own position.
export async function reduceNow() {
  if (S.placing || S.adjusting || S.flattening || S.arming) return;
  const key = S.addPick || '25';
  if (key === 'max') return;
  if (key === '100') return closeNow(); // a close is never held back
  const siteHeld = siteBlocks();
  if (siteHeld) return toast(siteHeld);
  const master = S.master,
    sym = S.trade.symbol,
    meta = SYMBOLS[sym];
  if (!master) return;
  S.placing = true;
  updateTrade();
  try {
    const pos = await openPosition(master, sym);
    if (!pos) throw new Error(`${accLabel(master)} has no open ${meta.label} position`);
    const have = parseFloat(pos.quantity),
      q = floorStep(have * (key === '50' ? 0.5 : 0.25), meta.step);
    if (!(q > 0)) throw new Error(`${key}% of ${fmtQty(have, sym)} rounds to nothing at ${meta.label}'s size step`);
    const lev = orderLeverage(levFor(await fetchLeverages(), master, sym), maxLeverageFor(sym, master));
    const body = {
      positionId: posIdOf(pos),
      orderType: 'market',
      leverage: fmtNum(lev, 2),
      quantity: fmtQty(q, sym),
      timeInForce: 'IOC',
      reduceOnly: true,
      symbol: sym,
    };
    await send('POST', '/v3/positions/reduce', master, body);
    logEvent(
      'ok',
      `Trade panel: REDUCE ${body.quantity} ${meta.label} (${fmtQty(have, sym)} → ${fmtQty(have - q, sym)})${S.armed ? ' — the copier reduces the followers' : ''}. Stop and targets unchanged.`,
    );
    diag('trade_panel', { outcome: 'reduced', positionId: body.positionId, quantity: body.quantity, prevQty: have });
  } catch (e) {
    logEvent('warn', `Reduce: not sent — ${e.message}.`);
    diag('trade_panel', { outcome: 'reduce-failed', error: e.message, errorCode: errCode(e) });
  } finally {
    S.placing = false;
    updateTrade();
    refreshTradeState();
  }
}
