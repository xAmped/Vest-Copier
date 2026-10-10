import { accLabel, refreshBalances } from '../accounts/registry.js';
import { BALANCE_AFTER_TRADE_MS, DEFAULT_LEVERAGE } from '../config.js';
import { acctPost, closeBody } from './executor.js';
import { sendExit } from './mirror.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { symLabel } from '../market/prices.js';
import { S } from '../state.js';
import { openPosition } from '../trade/orders.js';
import { setOpen } from '../ui/dock.js';
import { _root } from '../ui/panel.js';
import { render } from '../ui/render.js';

// Followers left holding a position the master doesn't: flatten them or keep them.

// Followers holding a position the master doesn't (fast-mode entry refused, or an entry the master didn't fill).
// Auto-flatten closes them; otherwise the panel asks Flatten / Keep. New orphans join any already waiting.
// `checkMaster`: when the master's outcome is uncertain, auto-flatten only if the master is confirmed to hold nothing
// on that market; otherwise the trader decides.
export async function raiseOrphans(sym, list, why, checkMaster = null) {
  if (!list.length) return;
  let masterIn = false;
  if (checkMaster) {
    try {
      masterIn = !!(await openPosition(checkMaster, sym));
    } catch {
      masterIn = true; // unreadable: assume it may be in
    }
  }
  const n = list.length;
  logEvent('warn', `${n} follower position${n !== 1 ? 's' : ''} without the master — ${why}.`);
  if (masterIn)
    logEvent('warn', `The master may hold ${symLabel(sym)} itself — check it before flattening the followers.`);
  diag('orphan', { symbol: sym, followersOpened: n, why, autoFlatten: S.autoFlatten, masterMayBeIn: masterIn });
  const items = list.map((o) => ({ ...o, symbol: sym, hold: masterIn }));
  S.orphan = { list: [...((S.orphan && S.orphan.list) || []), ...items] };
  if (S.autoFlatten && !masterIn) flattenOrphans(true);
  else {
    // the Flatten / Keep prompt is hidden in a minimised panel: open it
    if (_root && _root.querySelector('.panel.collapsed')) setOpen(true);
    render();
  }
}
// `autoOnly`: auto-flatten closes only the batches raised with the master confirmed out; one held for the user's
// Flatten / Keep (the master may be in) stays waiting.
export async function flattenOrphans(autoOnly = false) {
  const o = S.orphan;
  if (!o) return;
  const go = autoOnly ? o.list.filter((v) => !v.hold) : o.list,
    wait = autoOnly ? o.list.filter((v) => v.hold) : [];
  S.orphan = wait.length ? { list: wait } : null;
  logEvent('warn', `Flattening ${go.length} orphan follower position(s)…`);
  for (const v of go) {
    const lev = v.leverage || (S.byId[v.accountId] && S.byId[v.accountId].leverage) || DEFAULT_LEVERAGE;
    if (v.resting && v.orderId)
      try {
        // a limit entry may still be resting: cancel it, or it could fill after the close
        await acctPost(v.accountId, '/v3/positions/cancel-order', { orderId: v.orderId });
      } catch {
        /* best effort: already filled or gone */
      }
    try {
      await sendExit(v.accountId, '/v3/positions/close', closeBody(v.symbol, v.positionId, lev));
      logEvent('ok', `↳ flattened ${accLabel(v.accountId)}`);
    } catch (e) {
      logEvent('warn', `↳ ${accLabel(v.accountId)} flatten failed: ${e.message} — close it on Vest.`);
    }
  }
  setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
  render();
}
export function keepOrphans() {
  S.orphan = null;
  logEvent('warn', 'Kept the orphan follower positions — manage them on Vest.');
  render();
}
