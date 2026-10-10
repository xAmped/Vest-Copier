import { liveRender } from '../accounts/live-pnl.js';
import { accLabel, num, refreshBalances, revalue, setLimits, syncAccountsSoon } from '../accounts/registry.js';
import { FEED_QUIET_MS, VEST_CLOSE_GRACE_MS } from '../config.js';
import { who } from '../copier/executor.js';
import { raiseOrphans } from '../copier/orphans.js';
import { fmtQty } from '../copier/sizing.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { symLabel, watchPrice } from '../market/prices.js';
import { drawTradeSoon } from '../market/vest-market.js';
import { S } from '../state.js';
import { endPlan } from '../trade/breakeven-plans.js';
import { tryOpenPosition } from '../trade/orders.js';
import { money } from '../ui/format.js';
import { renderLog } from '../ui/log.js';
import { decodeJwt, userToken } from './auth.js';
import { ourExit, parseJson } from './request-hooks.js';

// Vest's private account socket, listened to (never written to) for live balances, positions and fills.
// Vest's page keeps a private socket open that pushes every change on every one of the user's accounts within about
// 50 ms: orders placed and filled, positions opened, added to, reduced and closed, stops and targets, the new balance
// (`account_state`); an account failing or changing its limits (`capital_account`); an order Vest refused after
// accepting it (`command_events`); and profit claims (`profit_withdrawal`). The copier never opens it or sends on it:
// it finds Vest's own socket the moment Vest creates it (the constructor is wrapped at document-start; Vest never
// sends a subscription, only a ping every 30 s), or failing that on that first ping, and listens. Balances, positions,
// fills and failed accounts then update as they happen; the polled reads become a backstop.
export const _feed = { ws: null, last: 0, attached: 0, stateAt: 0, missing: [] };
const FEED_FIELDS = ['account_id', 'account_seq', 'positions', 'final_balance']; // in every account_state event
export const _feedAt = {}; // accountId -> when its last feed event landed (a slower REST read must not overwrite it)
const _seq = {}; // accountId -> the last account_seq applied (Vest drops older and repeated events the same way)
export const feedLive = () => !!_feed.ws && _feed.ws.readyState === 1 && Date.now() - _feed.last < FEED_QUIET_MS;
// Find Vest's private socket as it is created (or on its first ping), at document-start.
export function installFeedTap() {
  if (typeof WebSocket === 'function' && typeof Proxy === 'function')
    try {
      // a Proxy keeps everything else about WebSocket as it was (prototype, constants, instanceof, subclasses)
      window.WebSocket = new Proxy(WebSocket, {
        construct(target, args, newTarget) {
          const ws = Reflect.construct(target, args, newTarget);
          try {
            if (/\/ws\/private/.test(String(args[0] || ''))) attachFeed(ws);
          } catch {
            /* best effort: nothing to do if this fails */
          }
          return ws;
        },
      });
    } catch {
      /* best effort: the ping below still finds it */
    }
  if (typeof WebSocket === 'function' && WebSocket.prototype && WebSocket.prototype.send) {
    const _wsSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function () {
      try {
        if (this !== _feed.ws && /\/ws\/private/.test(this.url || '')) attachFeed(this);
      } catch {
        /* best effort: nothing to do if this fails */
      }
      return _wsSend.apply(this, arguments);
    };
  }
}
function attachFeed(ws) {
  const again = _feed.attached > 0; // Vest reconnected: anything said while it was down is read in full once
  _feed.ws = ws;
  _feed.last = Date.now();
  _feed.attached++;
  ws.addEventListener('message', (e) => {
    if (ws !== _feed.ws) return;
    _feed.last = Date.now();
    onFeedMessage(e.data);
  });
  ws.addEventListener('close', () => {
    if (ws !== _feed.ws) return;
    _feed.ws = null;
    diag('feed', { outcome: 'closed' });
  });
  diag('feed', { outcome: again ? 'reattached' : 'attached' });
  if (again) refreshBalances();
}
function onFeedMessage(raw) {
  if (typeof raw !== 'string' || raw.charCodeAt(0) !== 123) return; // '{'
  const m = parseJson(raw, null);
  if (!m || typeof m.channel !== 'string' || !m.data || typeof m.data !== 'object') return;
  if (m.channel === 'account_state') {
    // for the site check: does Vest's update still carry what the copier reads?
    _feed.stateAt = Date.now();
    _feed.missing = FEED_FIELDS.filter((k) => !(k in m.data));
  }
  try {
    if (m.channel === 'account_state') onAccountState(m.data);
    else if (m.channel === 'capital_account') onCapitalAccount(m.data);
    else if (m.channel === 'command_events') onCommandEvent(m.data);
    else if (m.channel === 'profit_withdrawal') onClaimEvent(m.data);
  } catch (e) {
    diag('feed', { outcome: 'error', channel: m.channel, error: e.message });
  }
}

// Fills, as the feed reports them: orderId -> { price, at } once filled, or { missing, why } when Vest says it didn't
// execute (a refused command, or an order cancelled with nothing filled). A fill check waits on this first.
S.feedFills = {};
const _fillWaiters = {};
function setFeedFill(orderId, v) {
  const had = S.feedFills[orderId];
  if (had && !had.missing) return; // a fill is final
  S.feedFills[orderId] = { ...v, seen: Date.now() };
  for (const done of _fillWaiters[orderId] || []) done(S.feedFills[orderId]);
  delete _fillWaiters[orderId];
  const ids = Object.keys(S.feedFills);
  if (ids.length > 2000) ids.slice(0, 1000).forEach((k) => delete S.feedFills[k]);
}
export function feedFill(orderId, ms) {
  const have = orderId && S.feedFills[orderId];
  if (have || !orderId || !(ms > 0) || !feedLive()) return Promise.resolve(have || undefined);
  return new Promise((resolve) => {
    const done = (v) => {
      clearTimeout(timer);
      resolve(v);
    };
    const timer = setTimeout(() => {
      _fillWaiters[orderId] = (_fillWaiters[orderId] || []).filter((x) => x !== done);
      resolve(undefined);
    }, ms);
    (_fillWaiters[orderId] = _fillWaiters[orderId] || []).push(done);
  });
}

function onAccountState(d) {
  const id = d.account_id;
  if (!id) return;
  const seq = parseInt(d.account_seq, 10);
  if (seq >= 0) {
    if (_seq[id] != null && seq <= _seq[id]) return;
    _seq[id] = seq;
  }
  for (const o of d.orders || []) {
    const done = num(o.executed_quantity) > 0;
    if (done && num(o.execution_price) > 0 && (o.status === 'filled' || /FILLED$/.test(o.event_type || '')))
      setFeedFill(o.order_id, { price: num(o.execution_price), at: o.execution_time });
    else if (!done && (o.status === 'rejected' || o.status === 'cancelled'))
      setFeedFill(o.order_id, { missing: true, why: o.status });
  }
  if (!S.byId[id]) return; // not an account the copier lists (the Primary Account, say)
  _feedAt[id] = Date.now();
  const ch = applyFeedState(id, d);
  onFeedPositions(id, d, ch);
  revalue(id);
  liveRender();
  drawTradeSoon();
}
// An account's positions, stops, targets and cash from one feed event, the way a REST read would leave them.
function applyFeedState(id, d) {
  const r = S.byId[id];
  const st = (S.acctState[id] = S.acctState[id] || { positions: [], ordersCollateral: 0, marks: {}, at: 0 });
  const ch = { closed: [], reduced: [], opened: [] };
  for (const p of d.positions || []) {
    const pid = p.position_id;
    if (!pid) continue;
    const i = st.positions.findIndex((x) => x.id === pid);
    const prev = i >= 0 ? st.positions[i] : null,
      qty = num(p.quantity);
    if (p.status === 'closed' || /CLOSED$/.test(p.event_type || '')) {
      if (prev) st.positions.splice(i, 1);
      ch.closed.push(p);
    } else if (p.status === 'opened' && qty > 0) {
      const next = {
        id: pid,
        symbol: p.symbol,
        side: p.side,
        qty,
        openPrice: num(p.open_price),
        collateral: num(p.collateral) || 0,
        triggers: prev ? prev.triggers : [],
      };
      if (prev) st.positions[i] = next;
      else st.positions.push(next);
      if (!prev) ch.opened.push(p);
      else if (qty < prev.qty) ch.reduced.push(p);
    }
  }
  for (const it of d.order_intents || []) {
    const pos = st.positions.find((x) => x.id === it.position_id),
      kind = it.kind === 'stop_loss' ? 'sl' : it.kind === 'take_profit' ? 'tp' : null;
    if (!pos || !kind) continue;
    pos.triggers = pos.triggers.filter((t) => t.id !== it.id);
    if (it.state === 'active') pos.triggers.push({ id: it.id, kind, price: num(it.trigger_price) });
  }
  if (d.orders_collateral != null && num(d.orders_collateral) >= 0) st.ordersCollateral = num(d.orders_collateral);
  const fb = d.final_balance;
  if (fb && num(fb.amount) >= 0) {
    const v = parseInt(fb.balance_version, 10);
    if (!(v < (r.balVer || 0))) {
      r.free = num(fb.amount);
      if (v >= 0) r.balVer = v;
    }
  }
  if (r.free >= 0) st.cash = r.free + st.positions.reduce((a, p) => a + p.collateral, 0) + (st.ordersCollateral || 0);
  st.at = Date.now();
  for (const p of ch.opened) watchPrice(p.symbol); // its open P&L follows the price from now on
  return ch;
}

// Positions Vest closed or reduced by itself: a stop or target filling, a failed account, or a close from somewhere
// other than this tab. The trade's bookkeeping follows, the log says what happened, and when the master is out of a
// copied trade, followers still in it after a moment are offered to flatten (they normally close on their own stops).
S.failing = {}; // accountId -> when Vest reported it failed (its forced close follows)
function onFeedPositions(id, d, ch) {
  const legHit = {};
  for (const it of d.order_intents || [])
    if (/TRIGGERED|COMPLETED/.test(it.event || '') && it.position_id)
      legHit[it.position_id] = it.kind === 'stop_loss' ? 'sl' : 'tp';
  const cause = (pid) =>
    ourExit(pid) ? 'ours' : legHit[pid] || (Date.now() - (S.failing[id] || 0) < 60000 ? 'breach' : 'vest');
  for (const p of [...ch.closed, ...ch.reduced]) {
    const pid = p.position_id,
      closed = ch.closed.includes(p),
      why = cause(pid);
    if (closed && S.plans[pid]) endPlan(S.plans[pid], 'Breakeven: trade closed — stopped watching.');
    if (why === 'ours') continue; // this tab sent it: the copier already copied it
    noteVestClose({ id, symbol: p.symbol, why, closed, pnl: num(p.pnl), qty: num(p.quantity) });
    const entry = S.posMap[pid];
    if (entry && closed) masterClosedByVest(pid, entry, why);
    else if (entry) entry.qty = fmtQty(num(p.quantity), entry.symbol); // a sized target filled: the copy keeps its share
    for (const e of Object.values(S.posMap)) {
      const fp = e.followers[id];
      if (!fp || fp.positionId !== pid) continue;
      if (closed)
        delete e.followers[id]; // out of the trade: nothing left to copy to it
      else fp.qty = fmtQty(num(p.quantity), e.symbol);
    }
  }
}
function masterClosedByVest(pid, entry, why) {
  delete S.posMap[pid];
  const followers = Object.entries(entry.followers);
  if (!followers.length) return;
  setTimeout(async () => {
    const left = [];
    for (const [f, fp] of followers) {
      let open;
      if (feedLive() && S.acctState[f]) open = S.acctState[f].positions.some((x) => x.id === fp.positionId);
      else open = !!(await tryOpenPosition(f, entry.symbol, fp.positionId));
      if (open) left.push({ accountId: f, positionId: fp.positionId });
    }
    const what = {
      sl: "the master's stop filled",
      tp: "the master's target filled",
      breach: 'Vest closed the master (the account failed)',
      vest: "the master's position was closed outside this tab",
    }[why];
    if (left.length) raiseOrphans(entry.symbol, left, what, entry.master);
  }, VEST_CLOSE_GRACE_MS);
}
// One log line per kind of close, for every account it happened on at about the same moment.
let _vestCloses = [],
  _vestCloseTimer = null;
function noteVestClose(n) {
  _vestCloses.push(n);
  diag('vest_close', { ...who(n.id), symbol: n.symbol, cause: n.why, closed: n.closed, pnl: n.pnl, qty: n.qty });
  if (!_vestCloseTimer) _vestCloseTimer = setTimeout(flushVestCloses, 600);
}
function flushVestCloses() {
  _vestCloseTimer = null;
  const notes = _vestCloses;
  _vestCloses = [];
  const groups = {};
  for (const n of notes)
    (groups[n.why + (n.closed ? '' : '+part')] = groups[n.why + (n.closed ? '' : '+part')] || []).push(n);
  for (const [k, list] of Object.entries(groups)) {
    const [why, part] = k.split('+');
    const what = {
      sl: part ? 'Stop filled part of the position' : 'Stop filled',
      tp: part ? 'Target filled' : 'Target filled, position closed',
      breach: 'Closed by Vest (account failed)',
      vest: part ? 'Reduced outside this tab' : 'Closed outside this tab',
    }[why];
    const usd = (v) => (v >= 0 ? '+' : '−') + money(Math.abs(v));
    const each = list.map((n) => `${accLabel(n.id)}${n.pnl === 0 || isNaN(n.pnl) ? '' : ' ' + usd(n.pnl)}`);
    logEvent(why === 'tp' ? 'ok' : 'warn', `${what} (${symLabel(list[0].symbol)}): ${each.join(', ')}.`);
  }
}

// An account Vest closed (failed) or changed: its limits apply at once; a failed or new account updates the list.
function onCapitalAccount(d) {
  const id = d.account_id,
    r = id && S.byId[id];
  if (!id) return;
  if (r && d.status === 2) {
    setLimits(r, d); // a daily reset moves the daily floor
    revalue(id);
    liveRender();
    return;
  }
  if (r) S.failing[id] = Date.now();
  if (r || d.status === 2) syncAccountsSoon();
}
// Vest accepted an order (HTTP 200) and then refused to run it: the fill check learns it at once, with Vest's code.
function onCommandEvent(d) {
  if (String(d.status).toUpperCase() !== 'REJECTED' || !d.order_id) return;
  setFeedFill(d.order_id, {
    missing: true,
    why: 'refused' + (d.error_code != null ? ` (code ${d.error_code})` : ''),
  });
  diag('order_refused', {
    ...(d.account_id ? who(d.account_id) : {}),
    orderId: d.order_id,
    errorCode: d.error_code,
    event: d.event_type,
  });
}
function onClaimEvent(d) {
  const st = String(d.status || '').toUpperCase(),
    amt = num(d.trader_amount != null ? d.trader_amount : d.amount),
    from = d.account_id && S.byId[d.account_id] ? ` from ${accLabel(d.account_id)}` : '';
  diag('claim_event', { status: st, ...(d.account_id ? who(d.account_id) : {}), amount: isNaN(amt) ? null : amt });
  if (st === 'EXECUTED') logEvent('ok', `Vest paid a profit claim${from}${amt > 0 ? `: ${money(amt)}` : ''}.`);
  else if (st === 'REFUNDED' || st === 'FAILED')
    logEvent(
      'warn',
      `Vest returned a profit claim${from}${amt > 0 ? ` (${money(amt)})` : ''}: it's back on the account.`,
    );
}

// The account Vest's own screen is on (its order ticket trades it): from Vest's saved choice at load, then from each
// switch. Armed, the panel warns when it isn't the master, since orders placed there aren't copied.
S.screen = null;
export function setScreen(id) {
  if (S.screen === id) return;
  S.screen = id;
  renderLog();
}
export function readScreen() {
  try {
    const uid = userToken && decodeJwt(userToken).userId;
    const id =
      uid &&
      (sessionStorage.getItem('vest-active-account:' + uid) || localStorage.getItem('vest-active-account:' + uid));
    if (id && /^[\w-]{8,64}$/.test(id)) setScreen(id);
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
