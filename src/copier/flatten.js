import { accLabel, refreshBalances } from '../accounts/registry.js';
import { BALANCE_AFTER_TRADE_MS, DEFAULT_LEVERAGE, FLATTEN_RECHECK_MS, FLATTEN_WAIT_MS } from '../config.js';
import { cancelPendingArm } from './arming.js';
import { acctPost, closeBody, sleep } from './executor.js';
import { posIdOf } from './legs.js';
import { sendExit } from './mirror.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { S } from '../state.js';
import { endPlan } from '../trade/breakeven-plans.js';
import { render } from '../ui/render.js';
import { api, mintAccountToken } from '../vest/api.js';

// Flatten All: close every position and cancel every order on every account.
// Close every open position and cancel every resting order on ALL loaded accounts, whatever is selected, in one click:
// an emergency button, and a quick way out of a trade across many accounts. The copier stays armed (or disarmed) as it
// was, ready for the next trade. While the sweep runs nothing new is copied, an arm in progress is cancelled, follower
// orders still in flight are waited for, and a second sweep catches anything that landed during the first.
async function flattenAccount(id) {
  const { token } = await mintAccountToken(id);
  const [posR, ordR] = await Promise.all([
    api('/v3/positions/opened', token),
    api('/v3/positions/opened-orders', token),
  ]);
  const positions = (posR && posR.positions) || [],
    orders = (ordR && ordR.orders) || [];
  for (const o of orders) {
    // resting orders first
    const oid = o.orderId || o.order_id || o.id;
    if (!oid) continue;
    try {
      await acctPost(id, '/v3/positions/cancel-order', { orderId: oid });
      logEvent('ok', `↳ cancelled a resting order on ${accLabel(id)}`);
    } catch (e) {
      logEvent('warn', `↳ ${accLabel(id)} cancel failed: ${e.message}`);
    }
  }
  for (const p of positions) {
    const pid = posIdOf(p),
      sym = p.symbol;
    if (!pid || !sym) continue;
    const lev = p.leverage || (S.byId[id] && S.byId[id].leverage) || DEFAULT_LEVERAGE;
    try {
      await sendExit(id, '/v3/positions/close', closeBody(sym, pid, lev));
      logEvent('ok', `↳ closed ${sym} on ${accLabel(id)}`);
    } catch (e) {
      logEvent('warn', `↳ ${accLabel(id)} close failed: ${e.message}`);
    }
  }
  return positions.length + orders.length;
}
export async function flattenAll() {
  if (S.flattening) return;
  const ids = Object.keys(S.byId);
  if (!ids.length) {
    logEvent('warn', 'Flatten All: no accounts loaded.');
    return render();
  }
  S.flattening = true;
  cancelPendingArm(); // an arm in progress would adopt positions that are being closed
  S.orphan = null;
  Object.values(S.plans).forEach((p) => endPlan(p, null)); // nothing left for breakeven to manage
  render();
  logEvent(
    'warn',
    `FLATTEN ALL — closing every position and cancelling every order on ${ids.length} account(s).${S.armed ? ' The copier stays armed for your next trade.' : ''}`,
  );
  diag('flatten_all', { accounts: ids.length, armed: S.armed });
  try {
    await flattenSweep(ids);
  } finally {
    S.flattening = false; // never left set: master orders would be skipped as "during Flatten All" while ARMED shows
    setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
    render();
  }
}
async function flattenSweep(ids) {
  const inFlight = Object.values(S.posMap)
    .map((e) => e.queue)
    .filter(Boolean);
  await Promise.race([Promise.all(inFlight), sleep(FLATTEN_WAIT_MS)]);
  S.posMap = {};
  const sweep = () =>
    Promise.all(
      ids.map((id) =>
        flattenAccount(id).catch((e) => {
          logEvent('warn', `↳ ${accLabel(id)} couldn't be read: ${e.message}`);
          return 1;
        }),
      ),
    );
  await sweep();
  await sleep(FLATTEN_RECHECK_MS);
  const left = (await sweep()).reduce((a, b) => a + b, 0);
  if (left)
    logEvent('warn', 'Flatten All: some positions or orders needed a second pass — check every account on Vest.');
  else logEvent('ok', 'Flatten All complete — every account is flat.');
}
