import { fetchLeverages, levFor } from '../accounts/live-pnl.js';
import { accLabel, refreshBalances } from '../accounts/registry.js';
import { setFollowerLeverage, who } from './executor.js';
import { matchLeg, posIdOf, posLegs } from './legs.js';
import { levKey } from './mirror.js';
import { logEvent, toast } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { claimBusy, dropClaimReview } from '../features/claim-profit.js';
import { healthState } from '../health/health.js';
import { siteGate } from '../health/site-check.js';
import { symLabel } from '../market/prices.js';
import { S } from '../state.js';
import { render } from '../ui/render.js';
import { api, mintAccountToken } from '../vest/api.js';

// Arming and disarming the copier, and keeping other Vest tabs from arming it twice.
// An account's open positions and resting orders. Throws if Vest can't be read: an unreadable account is never
// assumed to be flat.
async function openState(id) {
  const { token } = await mintAccountToken(id);
  const [pos, ord] = await Promise.all([api('/v3/positions/opened', token), api('/v3/positions/opened-orders', token)]);
  const positions = ((pos && pos.positions) || []).map((p) => ({
    positionId: posIdOf(p),
    symbol: p.symbol,
    side: p.side,
    qty: String(p.quantity),
    legs: posLegs(p),
  }));
  return { positions, orders: (ord && ord.orders) || [] };
}

// Arm when flat, or adopt an open trade: if the master already holds positions, link each follower's matching position
// (same symbol and side) so exits and stop/target changes copy to it. Never opens anything for a flat follower; it
// joins from the next trade. Returns { adopted, notes, openSymbols } or { error }.
async function planArm(master, followers) {
  const sel = [master, ...followers];
  const state = {};
  try {
    await Promise.all(
      sel.map(async (id) => {
        state[id] = await openState(id);
      }),
    );
  } catch (e) {
    return { error: `couldn't read open positions (${e.message}) — try again` };
  }

  const resting = sel.filter((id) => state[id].orders.length);
  if (resting.length)
    return { error: 'resting orders on ' + resting.map(accLabel).join(', ') + ' — cancel them first' };

  const mPos = state[master].positions;
  const key = (p) => p.symbol + '|' + p.side;
  if (new Set(mPos.map(key)).size !== mPos.length)
    return { error: "the master has two positions on the same symbol and side — can't tell them apart" };

  const adopted = {},
    notes = [];
  for (const p of mPos)
    adopted[p.positionId] = {
      master,
      side: p.side,
      symbol: p.symbol,
      masterOrderId: null,
      qty: p.qty,
      legs: p.legs,
      adopted: true,
      followers: {},
    };
  for (const f of followers) {
    const fPos = state[f].positions;
    if (new Set(fPos.map(key)).size !== fPos.length)
      return { error: `${accLabel(f)} has two positions on the same symbol and side` };
    for (const fp of fPos) {
      const m = mPos.find((p) => key(p) === key(fp));
      if (!m) {
        const opp = mPos.find((p) => p.symbol === fp.symbol);
        return {
          error: opp
            ? `${accLabel(f)} is ${fp.side} ${fp.symbol} but the master is ${opp.side} — opposite direction`
            : `${accLabel(f)} holds ${fp.side} ${fp.symbol} but the master doesn't — close it first`,
        };
      }
      adopted[m.positionId].followers[f] = { positionId: fp.positionId, orderId: null, legs: fp.legs, qty: fp.qty };
      const unmatched = m.legs.filter((l) => !matchLeg(m.legs, fp.legs, l.id));
      if (unmatched.length) {
        const which = unmatched.map((l) => `${l.kind === 'sl' ? 'stop' : 'target'} at ${l.price}`).join(', ');
        notes.push(
          `${accLabel(f)} has no matching ${which} — changes to ${unmatched.length > 1 ? 'those' : 'that one'} won't copy to it.`,
        );
      }
    }
    if (mPos.length && !fPos.length) notes.push(`${accLabel(f)} is flat — it joins from the next trade.`);
  }
  return {
    adopted,
    notes: [...new Set(notes)],
    openSymbols: new Set(sel.flatMap((id) => state[id].positions.map((p) => p.symbol))),
  };
}

// Set each follower's leverage to the master's, per symbol the master has configured. Leverage is left alone under an
// open position. Returns the per-follower record for diagnostics.
async function syncLeverage(master, followers, openSymbols) {
  const levs = await fetchLeverages();
  if (!levs) {
    logEvent('warn', "Couldn't read leverage — each follower's leverage will be set on its first copied trade.");
    return [];
  }
  const mlevs = levs[master] || {},
    syms = Object.keys(mlevs),
    out = [];
  if (!syms.length) {
    logEvent('info', 'The master uses default leverage on every market — followers will be matched per trade.');
    return out;
  }
  const show = (k) => (k === 'NaN' ? 'default' : k + 'x');
  for (const f of followers) {
    for (const sym of syms) {
      const want = levKey(mlevs[sym]),
        had = levKey(levFor(levs, f, sym)),
        cacheKey = f + '|' + sym;
      const rec = { ...who(f), symbol: sym, want, had };
      if (had === want) {
        S.levCache[cacheKey] = want;
        out.push({ ...rec, action: 'already-set' });
      } else if (openSymbols.has(sym)) {
        logEvent(
          'info',
          `Left ${accLabel(f)} ${symLabel(sym)} leverage at ${show(had)} (position open) — re-arm when flat to sync.`,
        );
        out.push({ ...rec, action: 'skipped-open-position' });
      } else {
        try {
          await setFollowerLeverage(f, sym, want);
          S.levCache[cacheKey] = want;
          out.push({ ...rec, action: 'set' });
        } catch (e) {
          logEvent('warn', `Couldn't set ${accLabel(f)} ${symLabel(sym)} leverage: ${e.message}`);
          out.push({ ...rec, action: 'error', error: e.message });
        }
      }
    }
  }
  const failed = out.filter((r) => r.action === 'error').length;
  const summary = syms.map((s) => show(levKey(mlevs[s])) + ' ' + symLabel(s)).join(', ');
  logEvent(
    failed ? 'warn' : 'info',
    failed ? `Leverage sync: ${failed} failed (target ${summary}).` : `Leverage synced (${summary}).`,
  );
  return out;
}

// Bumped by disarm and Flatten All, so an arm still in flight is cancelled: it would switch the copier back on after a
// disarm, or adopt positions that Flatten All is closing.
let _armEpoch = 0;
export const cancelPendingArm = () => _armEpoch++;
// Other Vest tabs running the copier: each says when it arms or disarms, and answers a new tab's hello. A tab that
// closes says bye; one that crashes is forgotten after TAB_STALE_MS without news.
const TAB_ID = Math.random().toString(36).slice(2),
  TAB_STALE_MS = 5 * 60 * 1000,
  _peers = {};
let _tabs = null;
export function openTabChannel() {
  try {
    _tabs = new BroadcastChannel('vc-tabs');
    _tabs.onmessage = (e) => {
      const m = e.data || {};
      if (!m.id || m.id === TAB_ID) return;
      if (m.type === 'hello') tabSay('state');
      if (m.type === 'bye') return delete _peers[m.id];
      if (!_peers[m.id]) logEvent('warn', 'The copier is open in another Vest tab too. Arm it in one tab only.');
      _peers[m.id] = { armed: !!m.armed, at: Date.now() };
    };
    window.addEventListener('pagehide', () => tabSay('bye'));
  } catch {
    _tabs = null; // no BroadcastChannel: nothing to coordinate
  }
}
function tabSay(type) {
  try {
    if (_tabs) _tabs.postMessage({ type, id: TAB_ID, armed: !!S.armed });
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
const armedElsewhere = () => Object.values(_peers).some((p) => p.armed && Date.now() - p.at < TAB_STALE_MS);
// Remembered for this tab only: a reload while armed comes back disarmed, and says so.
const WAS_ARMED_KEY = 'vc-was-armed';
function noteArmed(on) {
  tabSay('state');
  try {
    on ? sessionStorage.setItem(WAS_ARMED_KEY, '1') : sessionStorage.removeItem(WAS_ARMED_KEY);
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
export function checkWasArmed() {
  tabSay('hello');
  try {
    if (sessionStorage.getItem(WAS_ARMED_KEY) !== '1') return;
    sessionStorage.removeItem(WAS_ARMED_KEY);
    logEvent('warn', 'The page reloaded while the copier was armed: it is disarmed now. Arm again to keep copying.');
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
export async function arm() {
  if (S.arming) return;
  if (S.flattening) return toast('Wait for Flatten All to finish.');
  if (!S.ack) {
    S.ackThenArm = true; // arm right after the terms are accepted
    S.rulesOpen = true;
    render();
    return;
  } // the one-time agreement comes first
  if (!S.master) return toast('Pick a master account first.');
  if (!S.followers.size) return toast('Pick at least one follower.');
  if (S.placing || S.adjusting || claimBusy()) return toast('Wait for the current order or claim to finish.');
  if (armedElsewhere())
    return toast('The copier is armed in another Vest tab. Disarm it there first: two would copy every trade twice.');
  if (healthState().changed) {
    // Vest shipped an update the site check hasn't passed (it runs by itself)
    logEvent(
      'warn',
      siteGate() === 'failed'
        ? 'Not armed — Vest changed something the copier relies on. Copying is off until a copier update.'
        : 'Not armed — Vest updated its site and the check is still running.',
    );
    return render();
  }
  const epoch = ++_armEpoch;
  const master = S.master,
    followers = [...S.followers];
  const unchanged = () =>
    S.master === master && S.followers.size === followers.length && followers.every((f) => S.followers.has(f));
  S.arming = true;
  render();
  try {
    logEvent('info', 'Checking open positions…');
    const plan = await planArm(master, followers);
    if (plan.error) {
      logEvent('warn', 'Not armed — ' + plan.error + '.');
      diag('arm', { outcome: 'blocked', reason: plan.error });
      return;
    }
    logEvent('info', 'Syncing follower leverage to the master…');
    const levSync = await syncLeverage(master, followers, plan.openSymbols);
    if (S.capFit) {
      logEvent('info', 'Refreshing equity for cap-to-fit…');
      await refreshBalances();
    }
    if (epoch !== _armEpoch) {
      logEvent('warn', 'Not armed — disarmed or flattened while arming.');
      return;
    }
    if (!unchanged()) {
      logEvent('warn', 'Not armed — the selection changed while arming. Click ARM again.');
      return;
    }

    S.posMap = plan.adopted; // {} when flat; adopted trades otherwise
    S.armed = true;
    noteArmed(true);
    dropClaimReview();
    const trades = Object.values(plan.adopted);
    logEvent(
      'warn',
      `ARMED · copying live${S.capFit ? ' · cap-to-fit' : ''}. Master ${accLabel(master)} → ${followers.map(accLabel).join(', ')}.`,
    );
    for (const t of trades) {
      const inIt = Object.keys(t.followers).map(accLabel);
      const whoText = inIt.length ? ' + ' + inIt.join(', ') : ' (no followers in it)';
      logEvent(
        'ok',
        `Adopted open trade: ${t.side} ${t.qty} ${t.symbol} — master ${accLabel(master)}${whoText}. Exits and stop/target changes will copy.`,
      );
    }
    plan.notes.forEach((n) => logEvent('info', n));
    const acct = (id) => ({ id, label: accLabel(id), equity: (S.byId[id] || {}).equity });
    const adopted = trades.map((t) => ({
      symbol: t.symbol,
      side: t.side,
      masterQty: t.qty,
      legs: t.legs,
      followers: Object.entries(t.followers).map(([f, v]) => ({
        label: accLabel(f),
        qty: v.qty,
        positionId: v.positionId,
        legs: v.legs,
      })),
    }));
    diag('arm', {
      outcome: 'armed',
      capFit: S.capFit,
      fast: S.fast,
      autoFlatten: S.autoFlatten,
      master: acct(master),
      followers: followers.map((f) => ({ ...acct(f), group: (S.byId[f] || {}).groupKey })),
      adopted,
      notes: plan.notes,
      leverageSync: levSync,
    });
  } finally {
    S.arming = false;
    render();
  }
}
export function disarm() {
  _armEpoch++;
  const open = (S.orphan && S.orphan.list.length) || 0;
  S.armed = false;
  S.posMap = {};
  S.orphan = null;
  noteArmed(false);
  logEvent('info', 'Disarmed.');
  if (open)
    logEvent(
      'warn',
      `${open} follower position${open > 1 ? 's' : ''} without the master ${open > 1 ? 'are' : 'is'} still open — close ${open > 1 ? 'them' : 'it'} on Vest or with Flatten All.`,
    );
  diag('disarm', {});
  render();
}
