import { LIVE_STALE_MS, heldSymbols } from './live-pnl.js';
import { refresh } from './reload.js';
import { API, BALANCES_LIMIT, BALANCE_AFTER_TRADE_MS, _fetch } from '../config.js';
import { cancelPendingArm, disarm } from '../copier/arming.js';
import { posIdOf, posLegs } from '../copier/legs.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { dropClaimReview } from '../features/claim-profit.js';
import { priceOf, unwatchUnused, watchPrice } from '../market/prices.js';
import { S } from '../state.js';
import { refreshTradeState } from '../trade/calc.js';
import { money } from '../ui/format.js';
import { _root } from '../ui/panel.js';
import { render } from '../ui/render.js';
import { _feedAt, feedLive } from '../vest/account-feed.js';
import { api, mintAccountToken } from '../vest/api.js';
import { userTokenOk } from '../vest/auth.js';

// The account registry: every account the user has, with balance, floor and room, kept fresh.
export const num = (v) => (v == null || v === '' ? NaN : parseFloat(v));
const typeName = (t, p) =>
  t === 2 ? 'Evaluation' : t === 3 ? (p === 'instant_funded' ? 'Instant Funded' : 'Funded') : 'Other';
const shortType = (t, p) => (t === 2 ? 'Eval' : t === 3 ? (p === 'instant_funded' ? 'Instant' : 'Funded') : 'Other');
const label = (a) => a.name || 'Account ' + String((a.attempt_index ?? 0) + 1).padStart(2, '0');

// True equity per account (balance + unrealized PnL) from the performance series — what Vest measures
// drawdown against — and the unrealized PnL in it. /v3/accounts `amount` is only FREE collateral (under-reports while a
// position is open), which is what Vest's trading power is built on.
// → { accountId: { equity, upnl } }
async function fetchEquities() {
  try {
    // the last half hour at one point a minute: the freshest the series gets (a 2-day window gave ~6-minute points)
    const now = Date.now();
    const r = await api(`/v3/trading-performance/series?from=${now - 30 * 60000}&to=${now}&points=30`);
    const latestTs = {},
      out = {};
    for (const it of r.items || []) {
      const id = it.account_id,
        ts = it.ts || 0;
      if (latestTs[id] == null || ts > latestTs[id]) {
        latestTs[id] = ts;
        out[id] = { equity: num(it.equity_value), upnl: num(it.total_unrealized_pnl) || 0 };
      }
    }
    return out;
  } catch {
    return {};
  }
}

// Free cash of every account (and the Primary Account's id), asked for the way Vest's own page asks: active accounts
// only, up to BALANCES_LIMIT. Without `active`, every failed account a user ever had is listed too, and a user with many
// could have a live account fall off the page (seen: "couldn't read its balance", equity stuck at the start).
export async function fetchBalances() {
  const res = await api(`/v3/accounts?active=true&limit=${BALANCES_LIMIT}`);
  const free = {},
    ver = {};
  let primary = null;
  for (const a of (res && res.accounts) || []) {
    free[a.account_id] = num(a.amount);
    ver[a.account_id] = parseInt(a.balance_version, 10);
    if (a.account_type === 1) primary = a.account_id;
  }
  return { free, ver, primary };
}

export async function buildRegistry() {
  const [active, bals, eq] = await Promise.all([
    api('/v3/capital/accounts/active'),
    fetchBalances().catch(() => ({ free: {}, ver: {} })),
    fetchEquities(),
  ]);
  const balById = bals.free;
  const rows = (active.accounts || []).map((a) => {
    const initial = num(a.initial_capital),
      floor = num(a.max_drawdown_limit);
    const eqv = eq[a.id] && eq[a.id].equity;
    // unknown until a balance is read: shown as "—", never as the starting balance (a believable $0.00 P&L)
    const equity = eqv != null && !isNaN(eqv) ? eqv : (balById[a.id] ?? NaN),
      maxDD = initial - floor;
    const r = {
      id: a.id,
      label: label(a),
      type: typeName(a.account_type, a.plan_product_type),
      chip: shortType(a.account_type, a.plan_product_type),
      size: initial,
      floor,
      equity,
      free: balById[a.id] ?? NaN,
      balVer: bals.ver[a.id] >= 0 ? bals.ver[a.id] : 0,
      upnl: (eq[a.id] && eq[a.id].upnl) || 0,
      usedPct: maxDD > 0 ? Math.min(1, Math.max(0, (initial - equity) / maxDD)) : 0,
      leverage: num(a.max_leverage),
      accountType: a.account_type,
      planId: a.plan_id || null,
      groupKey: initial + '|' + typeName(a.account_type, a.plan_product_type),
      canTrade: null,
      order: a.attempt_index ?? 0,
    };
    setLimits(r, a);
    r.room = r.equity - floorOf(r);
    return r;
  });
  await Promise.all(
    rows.map(async (r) => {
      try {
        r.canTrade = (await mintAccountToken(r.id)).canTrade;
      } catch {
        r.canTrade = null;
      }
    }),
  );
  const before = S.byId;
  S.byId = Object.fromEntries(rows.map((r) => [r.id, r]));
  // An account that failed or closed is no longer in the active list: let go of it everywhere (a selected one too)
  for (const id of Object.keys(before)) if (!S.byId[id]) forgetAccount(id, before[id].label);
  if (S.master && !S.byId[S.master]) forgetAccount(S.master, null);
  [...S.followers].forEach((f) => !S.byId[f] && forgetAccount(f, null));
  regroup();
  return S.groups;
}
function regroup() {
  const groups = {};
  for (const r of Object.values(S.byId))
    (groups[r.groupKey] = groups[r.groupKey] || { size: r.size, type: r.type, key: r.groupKey, rows: [] }).rows.push(r);
  const gl = Object.values(groups);
  gl.forEach((g) => g.rows.sort((a, b) => a.order - b.order)); // lowest account number first
  S.groups = gl.sort((a, b) => b.size - a.size || a.type.localeCompare(b.type));
}

// An account that is no longer active (failed, closed). A follower is dropped from the copy and the copier stays armed
// for the others; the master failing disarms, since there's nothing left to copy. Vest has already closed its
// positions, so it leaves every trade and the orphan list too.
function forgetAccount(id, label) {
  const name = label || accLabel(id),
    wasMaster = S.master === id,
    wasFollower = S.followers.has(id);
  delete S.byId[id];
  delete S.acctState[id];
  for (const e of Object.values(S.posMap)) delete e.followers[id];
  if (S.orphan) {
    const list = S.orphan.list.filter((o) => o.accountId !== id);
    S.orphan = list.length ? { list } : null;
  }
  if (S.arming && (wasMaster || wasFollower)) cancelPendingArm(); // the arm in progress was for a selection that's gone
  if (wasFollower) S.followers.delete(id);
  if (wasMaster) S.master = null;
  breachReason(id).then((why) => why && logEvent('warn', `${name}: ${why}.`));
  if (!wasMaster && !wasFollower) return logEvent('info', `${name} is no longer active: removed from the list.`);
  const role = wasMaster ? 'the master' : 'a follower';
  if (S.armed && (wasMaster || !S.followers.size)) {
    disarm();
    logEvent('warn', `${name} (${role}) is no longer active — disarmed${wasMaster ? '' : ': no followers left'}.`);
  } else
    logEvent(
      'warn',
      `${name} (${role}) is no longer active — removed${S.armed ? '; still copying to the other followers' : ''}.`,
    );
  diag('account_gone', { account: id, label: name, role, armed: S.armed });
}
// Vest's own record of why an account failed, in words; null when it can't be read.
async function breachReason(id) {
  try {
    const b = await api(`/v3/capital/accounts/${encodeURIComponent(id)}/breach`);
    const eq = num(b && b.equity),
      dd = num(b.max_drawdown_limit),
      daily = num(b.daily_loss_limit);
    if (!(eq > 0) || !(dd > 0 || daily > 0)) return null;
    const isDaily = daily > 0 && !(dd >= daily);
    return `equity ${money(eq)} reached its ${isDaily ? 'daily loss floor' : 'drawdown floor'} of ${money(isDaily ? daily : dd)}`;
  } catch {
    return null;
  }
}

export const accLabel = (id) => (S.byId[id] && S.byId[id].label) || id.slice(0, 8);

// An account's limits from /v3/capital/accounts/active. On plans with a daily loss limit, Vest also closes the account
// at the daily floor (reset each day at 20:00 ET), so the floor that applies is whichever of the two is higher. The
// target (an evaluation's pass line) is above the starting size only while there is a goal to reach.
export function setLimits(r, a) {
  r.floor = num(a.max_drawdown_limit);
  const daily = num(a.daily_loss_floor);
  r.dailyFloor = num(a.max_daily_loss_pct) > 0 && daily > 0 ? daily : null;
  const target = num(a.target_equity);
  r.target = target > r.size ? target : null;
  r.split = num(a.max_profit_split_pct) || 0; // your share of claimed profit, e.g. 0.8
}
export const floorOf = (r) => Math.max(r.floor || 0, r.dailyFloor || 0);
// What an account pays you if its profit is claimed now: profit × its split (Vest applies the split flat at each claim,
// with no other deductions). Only funded accounts (live and Instant) pay out: an evaluation's profit doesn't, and claims
// are per account, so one in a loss pays nothing rather than taking from the others.
export const isFunded = (r) => r.accountType === 3;
// Vest pays each claim cut down to the cent ($122.97 at 80% pays $98.37), so the shares are too.
export const centsDown = (n) => Math.floor(n * 100 + 1e-6) / 100;
export const keepOf = (r) =>
  isFunded(r) && r.split > 0 && r.equity > r.size ? centsDown((r.equity - r.size) * r.split) : 0;

// Each account's open positions and resting orders (also what the Trade tab reads for the master).
export async function readOpenState(id) {
  const { token } = await mintAccountToken(id);
  const [pos, ord] = await Promise.all([api('/v3/positions/opened', token), api('/v3/positions/opened-orders', token)]);
  return {
    positions: ((pos && pos.positions) || [])
      .map((p) => ({
        id: posIdOf(p),
        symbol: p.symbol,
        side: p.side,
        qty: num(p.quantity),
        openPrice: num(p.openPrice),
        collateral: num(p.collateral) || 0,
        triggers: posLegs(p).map((l) => ({ id: l.id, kind: l.kind, price: l.price })),
      }))
      .filter((p) => p.qty > 0),
    ordersCollateral: ((ord && ord.orders) || []).reduce(
      (sum, o) => (o.reduceOnly || o.reduce_only ? sum : sum + (num(o.collateral) || 0)),
      0,
    ),
    at: Date.now(),
  };
}
// Mark prices for these symbols: the live feed when it's fresh, else one public ticker read.
async function markPrices(syms) {
  const out = {},
    need = [];
  for (const sym of syms) priceOf(sym) ? (out[sym] = priceOf(sym)) : need.push(sym);
  if (need.length) {
    try {
      const r = await (
        await _fetch(`${API}/v3/ticker/latest?symbols=${need.map(encodeURIComponent).join(',')}`)
      ).json();
      for (const t of r.tickers || []) if (parseFloat(t.markPrice) > 0) out[t.symbol] = parseFloat(t.markPrice);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  return out;
}

// Equity the way Vest's Account Value computes it, live: free cash + the collateral held by open positions and resting
// orders + their open PnL at the mark price. A flat account's equity is exactly its free cash, current the moment a
// trade closes. The performance series (minute points, a minute or more behind) is only the fallback when an
// account's positions can't be read.
let _balBusy = false,
  _balAgain = false,
  _soonTimer = null;
// A read soon after an order (any account, any page): positions and cash change on a fill, not with the price.
export function refreshSoon() {
  if (feedLive()) return; // the live feed has already carried what the order changed
  clearTimeout(_soonTimer);
  _soonTimer = setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
}
// A full read of every account: the active list (an account that failed or a new one), balances, positions and orders.
// With the live feed up it runs every FEED_BACKSTOP_MS, else every BALANCE_POLL_MS. An account the feed has spoken
// about since this read began keeps the feed's newer state.
export let _lastFullRead = 0;
export async function refreshBalances() {
  if (!userTokenOk()) return;
  if (!Object.keys(S.byId).length) return loadFirstAccounts();
  if (_balBusy) {
    _balAgain = true; // one more read right after this one, so a fill during a read isn't missed
    return;
  }
  _balBusy = true;
  const t0 = Date.now();
  try {
    const [bals, eq, active] = await Promise.all([
      fetchBalances().catch(() => ({ free: {}, ver: {} })),
      fetchEquities(),
      api('/v3/capital/accounts/active').catch(() => null), // failed or new accounts; the daily floor moves daily
    ]);
    if (active && Array.isArray(active.accounts)) await syncAccountSet(active.accounts);
    for (const a of (active && active.accounts) || []) if (S.byId[a.id]) setLimits(S.byId[a.id], a);
    const bal = bals.free;
    const ids = Object.keys(S.byId);
    const states = await Promise.all(ids.map((id) => readOpenState(id).catch(() => null)));
    const marks = await markPrices([...new Set(states.flatMap((st) => (st ? st.positions.map((p) => p.symbol) : [])))]);
    const live = {};
    ids.forEach((id, i) => {
      const st = states[i],
        r = S.byId[id],
        free = bal[id];
      if (!r || (_feedAt[id] || 0) >= t0) return; // the feed said something newer meanwhile
      if (free >= 0 && !(bals.ver[id] < (r.balVer || 0))) {
        r.free = free;
        if (bals.ver[id] >= 0) r.balVer = bals.ver[id];
      }
      if (!st || !(r.free >= 0)) return;
      st.cash = r.free + st.positions.reduce((a, p) => a + p.collateral, 0) + st.ordersCollateral;
      st.marks = marks;
      S.acctState[id] = st;
      if (st.positions.some((p) => !(priceOf(p.symbol) || marks[p.symbol] > 0))) return; // a price is missing
      live[id] = true;
    });
    for (const sym of heldSymbols()) watchPrice(sym); // open P&L then follows every price tick
    unwatchUnused();
    for (const id in S.byId) {
      if (live[id] && revalue(id)) continue;
      if ((_feedAt[id] || 0) >= t0) continue;
      const r = S.byId[id],
        src = eq[id]; // the performance series: only when positions or a price couldn't be read
      if (src) r.upnl = src.upnl;
      const e = src && !isNaN(src.equity) ? src.equity : bal[id];
      if (e == null || isNaN(e)) continue;
      setEquity(r, e);
    }
    _lastFullRead = Date.now();
    if (S.tradeOpen) refreshTradeState();
    render();
  } catch {
    /* best effort: nothing to do if this fails */
  } finally {
    _balBusy = false;
    if (_balAgain) {
      _balAgain = false;
      setTimeout(refreshBalances, 0);
    }
  }
}
// No accounts yet (all failed, or none bought): look again, and load them as soon as Vest lists one.
async function loadFirstAccounts() {
  if (!_root || S.arming) return;
  try {
    const r = await api('/v3/capital/accounts/active');
    if (!((r && r.accounts) || []).length || Object.keys(S.byId).length) return;
    await refresh();
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
// The active list changed: let go of accounts that failed or closed, and load new ones. True when anything changed.
async function syncAccountSet(list) {
  const ids = new Set(list.map((a) => a.id));
  const gone = Object.keys(S.byId).filter((id) => !ids.has(id)),
    added = list.filter((a) => !S.byId[a.id]);
  gone.forEach((id) => forgetAccount(id, null));
  if (added.length) {
    await buildRegistry();
    const names = added.map((a) => accLabel(a.id));
    logEvent('info', `New account${names.length > 1 ? 's' : ''} loaded: ${names.join(', ')}.`);
  }
  if (!gone.length && !added.length) return false;
  regroup();
  dropClaimReview(); // it named the accounts as they were
  render();
  return true;
}
// Vest reported an account failing or appearing: read the active list now, and once more shortly after in case the
// first read was a moment ahead of Vest's own update.
let _syncTimer = null;
export function syncAccountsSoon() {
  if (_syncTimer) return;
  _syncTimer = setTimeout(() => {
    _syncTimer = null;
    refreshBalances();
    setTimeout(refreshBalances, 3000);
  }, 200);
}
// State this old is only trusted while the live feed is up (it would have told us about any change since).
export const stateFresh = (st) => !!st && (feedLive() || Date.now() - st.at < LIVE_STALE_MS);
function setEquity(r, equity) {
  r.equity = equity;
  r.room = r.equity - floorOf(r);
  const maxDD = r.size - r.floor;
  r.usedPct = maxDD > 0 ? Math.min(1, Math.max(0, (r.size - r.equity) / maxDD)) : 0;
}
// An account's equity from its cash and open positions at the latest price (Vest's mid when its book is live). False
// when it can't be worked out (no state, or no price for one of its markets): the last figure stays.
export function revalue(id) {
  const st = S.acctState[id],
    r = S.byId[id];
  if (!r || !st || !(st.cash >= 0) || !stateFresh(st)) return false;
  let upnl = 0;
  for (const p of st.positions) {
    const px = priceOf(p.symbol) || (st.marks && st.marks[p.symbol]);
    if (!(px > 0)) return false;
    upnl += (p.side === 'long' ? 1 : -1) * p.qty * (px - p.openPrice);
  }
  r.upnl = upnl;
  setEquity(r, st.cash + upnl);
  return true;
}
