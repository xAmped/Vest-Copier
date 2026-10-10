import { fetchLeverages, levFor } from '../accounts/live-pnl.js';
import { accLabel, refreshBalances } from '../accounts/registry.js';
import {
  API,
  BALANCE_AFTER_TRADE_MS,
  EPS,
  FEED_FILL_WAIT_MS,
  MIN_LEG_USD,
  NEAR_MARKET,
  NEAR_MARKET_LOOSE,
  POLL_MS,
} from '../config.js';
import { fillInfo, idem, sleep } from '../copier/executor.js';
import { posIdOf, posLegs } from '../copier/legs.js';
import { fmtNum, fmtQty } from '../copier/sizing.js';
import { logEvent, toast } from '../core/activity-log.js';
import { diag, errCode } from '../core/diagnostics.js';
import { claimBusy } from '../features/claim-profit.js';
import { siteBlocks } from '../health/site-check.js';
import { loadSymbolRules, priceOf } from '../market/prices.js';
import { S, SYMBOLS } from '../state.js';
import { addPlan, fillEntry, savePlans } from './breakeven-plans.js';
import { refreshTradeState, tradeCalc } from './calc.js';
import { decimalsOf, planPrices } from './order-math.js';
import { updateTrade } from './view.js';
import { render } from '../ui/render.js';
import { api, mintAccountToken } from '../vest/api.js';
import { parseJson } from '../vest/request-hooks.js';

// Sending. The same order shape Vest's own ticket uses: market IOC, the stop as a full-position leg, and targets as
// legs (one target covers the whole position with no quantity; several targets are sized legs adding up to the
// order). Orders go through the page's hooked fetch, so an armed copier sees them as master orders and copies them
// exactly like an order placed on Vest's ticket.
export const send = async (method, path, accountId, body) => {
  const { token } = await mintAccountToken(accountId);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
    ...idem(),
  };
  const r = await window.fetch(API + path, { method, headers, body: JSON.stringify(body) });
  const res = parseJson(await r.text(), {}) || {};
  if (!r.ok) {
    const why = res.message || res.error;
    throw new Error(`Vest rejected the request (HTTP ${r.status}${why ? ': ' + why : ''})`);
  }
  return res;
};

// Vest's leverage rule, as its own ticket applies it. Max leverage for an account on a market: the plan-specific margin
// ratio if the market lists one for this plan, else the market's capital-account ratio (falling back to the funded
// ratio), else the account's max leverage capped by the market (5x if unknown). Leverage = floor(1 / ratio).
// An order uses the saved leverage when 0 < saved ≤ max, otherwise the max.
const FALLBACK_MAX_LEVERAGE = 5;
export function maxLeverageFor(sym, accountId) {
  const m = SYMBOLS[sym] && SYMBOLS[sym].margin,
    a = S.byId[accountId];
  if (!m) return null;
  const fromRatio = (r) => (r > 0 ? Math.floor(1 / r + EPS) : null);
  const marketMax = fromRatio(m.initMarginRatio);
  if (!a) return marketMax;
  const plan = (m.capitalPlans || []).find((c) => c.accountType === a.accountType && c.planId === a.planId);
  if (plan) return fromRatio(plan.initMarginRatio);
  const r = m.capitalInitMarginRatio === undefined ? m.fundedInitMarginRatio : m.capitalInitMarginRatio;
  if (r !== null && r !== undefined) return fromRatio(r);
  const acctMax = a.leverage > 0 ? a.leverage : FALLBACK_MAX_LEVERAGE;
  return marketMax ? Math.min(acctMax, marketMax) : acctMax;
}
export const orderLeverage = (saved, max) => (saved > 0 && max > 0 && saved <= max ? saved : max || null);
if (window.__VC_TEST__) window.__vcLev = { maxLeverageFor, orderLeverage };

// Stop/target work that runs after an order (re-anchor, rebuilding the ladder after an add). Buy and Sell stay disabled
// until it finishes, so two of these never work on the same legs at once.
function adjust(job) {
  S.adjusting = (S.adjusting || 0) + 1;
  updateTrade();
  return job()
    .catch((e) => {
      logEvent('warn', `Couldn't finish adjusting stop & targets (${e.message}) — check them on Vest.`);
      diag('adjust', { outcome: 'error', error: e.message });
    })
    .finally(() => {
      S.adjusting--;
      updateTrade();
    });
}

// `limitPx`: a GTC limit order at that price (a new trade only), with the stop and targets measured from it; without
// it, a market order. Returns true once Vest has accepted the order.
export async function placeTrade(side, limitPx = null) {
  if (S.placing || S.adjusting) return;
  if (S.flattening) return toast('Wait for Flatten All to finish.');
  if (S.arming || claimBusy()) return toast('Wait for arming or the claim to finish.');
  const siteHeld = siteBlocks(); // Vest's update not checked yet, or the check failed
  if (siteHeld) return toast(siteHeld);
  if (!S.ack) {
    S.rulesOpen = true;
    S.tradeOpen = false;
    render();
    return toast('Read and accept the terms first.');
  }
  const c = tradeCalc();
  if (c.error) return toast(c.error);
  if (c.blocked) return toast(c.blocked);
  const t = { ...c.t, targets: c.t.targets.map(Number) }; // edits made while this order is in flight don't apply to it
  // how the size was chosen, for diagnostics: the mode, Vest's max and who limits it, and any warning shown
  const sizing = {
    mode: t.sizeMode,
    qty: c.qty,
    maxQty: c.maxQty,
    limitedBy: c.limitedBy ? accLabel(c.limitedBy) : null,
    leverage: c.lev,
    fail: c.sides.long && c.sides.long.fail,
    warnings: c.warnings.map((w) => w.kind),
  };
  const stopPts = +t.stopPts,
    sym = t.symbol,
    meta = c.meta,
    pDec = decimalsOf(meta.tick),
    master = S.master;
  if (limitPx) {
    // a typed price between ticks: a buy rounds down, a sell up (never a worse price than asked)
    const n = limitPx / meta.tick;
    limitPx = +((side === 'long' ? Math.floor(n + 1e-9) : Math.ceil(n - 1e-9)) * meta.tick).toFixed(pDec);
  }
  S.placing = true;
  updateTrade();
  let placed = false;
  try {
    const px = priceOf(sym); // the price at the moment of the click
    if (limitPx) {
      const lp = fmtNum(limitPx, pDec);
      if (!nearMarket(limitPx, px, NEAR_MARKET_LOOSE))
        throw new Error(`a limit at ${lp} is nowhere near the market (${fmtNum(px, pDec)})`);
      if (side === 'long' ? limitPx >= px : limitPx <= px)
        throw new Error(
          `a ${side === 'long' ? 'buy' : 'sell'} limit must be ${side === 'long' ? 'below' : 'above'} the mark (${fmtNum(px, pDec)}): there it would fill at once — use ${side === 'long' ? 'Buy' : 'Sell'} for a market order`,
        );
    }
    const plan = planPrices({ side, entry: limitPx || px, stopPts, targetPts: t.targets, tick: meta.tick });
    if (plan.error) throw new Error(plan.error);
    if (!(SYMBOLS[sym] && SYMBOLS[sym].margin)) await loadSymbolRules(sym);
    const lev = orderLeverage(levFor(await fetchLeverages(), master, sym), maxLeverageFor(sym, master));
    if (!(lev > 0))
      throw new Error(
        `couldn't work out ${meta.label} leverage for ${accLabel(master)} — open Vest's ticket for ${meta.label} once, then retry`,
      );
    // Already in this market? Vest ignores a second open on the same symbol (accepted, never filled), so do what its own
    // ticket does: same direction adds to the position; the opposite direction is refused here.
    const held = await openPosition(master, sym);
    // The size and ladder on screen were worked out for what the panel showed: a position that opened, closed or changed
    // size since then would turn this click into something else (a new trade into an add, say).
    const shown = c.held;
    if (
      held &&
      parseFloat(held.quantity) > 0 &&
      (!shown || shown.side !== held.side || Math.abs(shown.qty - parseFloat(held.quantity)) >= meta.step / 2)
    ) {
      refreshTradeState();
      throw new Error(`the position on ${meta.label} changed since the panel last updated — check it and click again`);
    }
    if (!held && shown) {
      refreshTradeState();
      throw new Error(`the position on ${meta.label} is closed now — check the panel and click again`);
    }
    if (held && !(parseFloat(held.quantity) > 0))
      throw new Error(
        `an order is already waiting on ${meta.label} for ${accLabel(master)} — cancel it in Vest first (Vest allows one per market)`,
      );
    if (held && limitPx)
      throw new Error(`${accLabel(master)} is already in ${meta.label}: a limit from the panel opens a new trade only`);
    if (held && held.side !== side) {
      throw new Error(
        `${accLabel(master)} is ${held.side} ${held.quantity} ${meta.label} — close or reduce it first (the panel only adds in the same direction)`,
      );
    }
    if (held) return await addToTrade({ t, qty: c.qty, meta, side, held, lev, sizing });
    const many = c.qtys.length > 1;
    const takeProfits = plan.targets.map((tp, i) => ({
      executionType: 'market',
      triggerPrice: fmtNum(tp, pDec),
      ...(many ? { quantity: fmtQty(c.qtys[i], sym) } : {}),
    }));
    takeProfits.forEach((l, i) => {
      if (many && parseFloat(l.quantity) * parseFloat(l.triggerPrice) < MIN_LEG_USD)
        throw new Error(`TP${i + 1} is below Vest's $1 minimum`);
    });
    const stopLosses = [{ executionType: 'market', triggerPrice: fmtNum(plan.stop, pDec) }];
    const body = {
      orderType: limitPx ? 'limit' : 'market',
      leverage: fmtNum(lev, 2),
      side,
      symbol: sym,
      quantity: fmtQty(c.qty, sym),
      timeInForce: limitPx ? 'GTC' : 'IOC',
      takeProfits,
      stopLosses,
      ...(limitPx ? { price: fmtNum(limitPx, pDec) } : {}),
    };
    const res = await send('POST', '/v3/positions/open', master, body);
    if (!res.positionId) throw new Error('Vest returned no position');
    const tps = takeProfits
      .map((l, i) => `TP${i + 1} ${l.triggerPrice}${l.quantity ? ' × ' + l.quantity : ''}`)
      .join(' · ');
    logEvent(
      'ok',
      `Trade panel: ${side === 'long' ? 'BUY' : 'SELL'}${limitPx ? ' LIMIT' : ''} ${body.quantity} ${meta.label}${limitPx ? ` @ ${body.price}` : ''} · stop ${stopLosses[0].triggerPrice} · ${tps}`,
    );
    placed = true;
    diag('trade_panel', {
      outcome: 'placed',
      side,
      sizing,
      body,
      positionId: res.positionId,
      orderId: res.orderId,
      takeProfitIds: res.takeProfitIds,
      stopLossIds: res.stopLossIds,
    });
    // A market order's stop and targets are re-placed exactly from the real fill. A limit's are already measured from its
    // price (it fills there or better) and it may rest for a long time, so it isn't re-anchored or watched for
    // breakeven: Breakeven by hand does that once it fills.
    const reanchorOn = !limitPx;
    if (limitPx && t.beMode !== 'off')
      logEvent('info', 'Auto breakeven watches market orders only: once this limit fills, use Breakeven.');
    let bePlan = null;
    if (t.beMode !== 'off' && !limitPx) {
      bePlan = {
        positionId: res.positionId,
        orderId: res.orderId,
        master,
        symbol: sym,
        side,
        stopLegId: (res.stopLossIds || [])[0] || null,
        tp1: plan.targets[0],
        beMode: t.beMode,
        beTrigger: +t.beTrigger || 0,
        beOffset: +t.beOffset || 0,
        entry: null,
        triggered: false,
        moved: false,
        reanchoring: reanchorOn,
        at: Date.now(),
      };
      addPlan(bePlan);
    }
    if (reanchorOn) {
      adjust(() =>
        reanchor({
          master,
          sym,
          side,
          positionId: res.positionId,
          orderId: res.orderId,
          ref: px,
          stopPts,
          targetPts: t.targets,
          sentStop: plan.stop,
          sentTargets: plan.targets,
          bePlan,
        }),
      );
    }
  } catch (e) {
    logEvent('warn', `Trade panel: order NOT placed — ${e.message}.`);
    diag('trade_panel', { outcome: 'not-placed', side, sizing, error: e.message, errorCode: errCode(e) });
  } finally {
    S.placing = false;
    updateTrade();
    refreshTradeState(); // the position (or the add) shows right away, not with the next balance read
    setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS); // the next max size and fail price start from the new balance
  }
  return placed;
}

// Vest's position `openPrice` can be wrong for a moment right after a fill (seen live: 290.25 for a 31,148 fill), so
// fills come from /executions by order id, and any price that legs are measured from must be near the market.
export const nearMarket = (px, ref, tol = NEAR_MARKET) => px > 0 && ref > 0 && Math.abs(px - ref) <= ref * tol;
async function orderFill(accountId, sym, orderId, ref) {
  for (let i = 0; orderId && i < 4; i++) {
    if (i) await sleep(POLL_MS);
    const f = await fillInfo(accountId, sym, orderId, i ? 0 : FEED_FILL_WAIT_MS);
    if (f && nearMarket(f.price, ref)) return f.price;
  }
  return null;
}

// An account's open position on a symbol (or by id), or null when flat. Throws if positions can't be read: never
// guess "flat".
export async function openPosition(accountId, sym, positionId) {
  const r = await api('/v3/positions/opened', (await mintAccountToken(accountId)).token);
  return ((r && r.positions) || []).find((x) => (positionId ? posIdOf(x) === positionId : x.symbol === sym)) || null;
}
export const tryOpenPosition = async (...a) => {
  try {
    return await openPosition(...a);
  } catch {
    return null;
  }
};

// Add to an open trade from the panel: Vest's /append (the shape its own ticket sends), then ONE ladder for the whole
// position — the stop and targets re-placed from the new average entry at the panel's points, with the full size split
// across the targets by the chosen scale. The add and every leg change go through the hooked fetch, so an armed
// copier adds to each follower (scaled) and moves/resizes their legs to match.
async function addToTrade({ t, qty, meta, side, held, lev, sizing }) {
  // Vest's own "add to position" order: the position grows, the stop and targets stay where they are (a stop covers
  // the whole position, so it covers the add too). Armed, the copier adds to each follower, scaled.
  const sym = t.symbol,
    master = S.master,
    prevQty = parseFloat(held.quantity);
  const body = {
    symbol: sym,
    positionId: posIdOf(held),
    orderType: 'market',
    quantity: fmtQty(qty, sym),
    leverage: fmtNum(lev, 2),
    isBuy: side === 'long',
    timeInForce: 'IOC',
  };
  const res = await send('POST', '/v3/positions/append', master, body);
  logEvent(
    'ok',
    `Trade panel: ADD ${body.quantity} ${meta.label} to the ${side} (${fmtQty(prevQty, sym)} → ${fmtQty(prevQty + qty, sym)}). Stop and targets unchanged.`,
  );
  diag('trade_panel', { outcome: 'added', side, sizing, body, orderId: res.orderId, prevQty });
}

// Re-anchor after fill (always). The order's stop and targets are computed from the live price at the click.
// Once filled, read the fill price and the position's leg ids, and move any leg that is off by a tick or more so it
// sits exactly N points from the fill. Legs are found by the price they were sent at. The moves go through the hooked
// fetch, so an armed copier moves the followers' matching legs too. Breakeven waits until this is done.
async function reanchor(args) {
  try {
    return await reanchorSteps(args);
  } finally {
    const p = args.bePlan;
    if (p && p.reanchoring) {
      p.reanchoring = false;
      savePlans();
      if (!(p.entry > 0)) fillEntry(p);
    }
  }
}
async function reanchorSteps({
  master,
  sym,
  side,
  positionId,
  orderId,
  ref,
  stopPts,
  targetPts,
  sentStop,
  sentTargets,
  bePlan,
}) {
  const tick = SYMBOLS[sym].tick,
    fmt = (n) => fmtNum(n, decimalsOf(tick));
  const done = () => {
    if (!bePlan) return;
    bePlan.reanchoring = false;
    savePlans();
    if (!(bePlan.entry > 0)) fillEntry(bePlan);
  };
  let fill = await orderFill(master, sym, orderId, ref),
    pos = null;
  for (let i = 0; i < 6 && !pos; i++) {
    // the position, for its leg ids
    if (i) await sleep(POLL_MS);
    pos = await tryOpenPosition(master, sym, positionId);
  }
  if (!fill && pos && nearMarket(parseFloat(pos.openPrice), ref)) fill = parseFloat(pos.openPrice);
  if (!pos || !fill) {
    logEvent(
      'warn',
      `Re-anchor: couldn't get a believable fill price${pos && pos.openPrice ? ` (Vest showed ${pos.openPrice})` : ''} — stop and targets left where they were placed.`,
    );
    diag('reanchor', { positionId, outcome: 'no-fill-price', openPrice: pos ? pos.openPrice : null, ref });
    return done();
  }
  const exact = planPrices({ side, entry: fill, stopPts, targetPts, tick });
  if (exact.error) return done();
  if (bePlan) {
    bePlan.entry = fill;
    bePlan.tp1 = exact.targets[0];
  }
  const legs = posLegs(pos).map((l) => ({ ...l, used: false }));
  const moves = [];
  const planMove = (kind, sent, to) => {
    const l = legs.find((x) => !x.used && x.kind === kind && Math.abs(x.price - sent) < tick / 2);
    if (!l) return;
    l.used = true;
    if (Math.abs(l.price - to) >= tick / 2) moves.push({ kind, id: l.id, from: l.price, to });
  };
  if (!(bePlan && bePlan.moved)) planMove('sl', sentStop, exact.stop);
  sentTargets.forEach((p, i) => planMove('tp', p, exact.targets[i]));
  if (!moves.length) {
    logEvent('info', `Filled at ${fmt(fill)} — stop and targets already exact.`);
    diag('reanchor', { positionId, fill, moves: [] });
    return done();
  }
  let failed = 0;
  for (const m of moves) {
    const isStop = m.kind === 'sl';
    try {
      await send('PUT', isStop ? '/v3/positions/stop-loss' : '/v3/positions/take-profit', master, {
        positionId,
        executionType: 'market',
        triggerPrice: fmt(m.to),
        [isStop ? 'stopLossId' : 'takeProfitId']: m.id,
      });
    } catch (e) {
      failed++;
      logEvent(
        'warn',
        `Re-anchor: couldn't move the ${isStop ? 'stop' : 'target'} at ${fmt(m.from)} (${e.message}) — left as placed.`,
      );
    }
  }
  if (failed < moves.length)
    logEvent(
      'ok',
      `Filled at ${fmt(fill)} — stop & targets re-placed exactly ${stopPts} / ${targetPts.join(' / ')} pts from the fill.`,
    );
  diag('reanchor', { positionId, fill, moves: moves.map((m) => ({ kind: m.kind, from: m.from, to: m.to })), failed });
  done();
}
