import { PRICE_EPS } from '../config.js';
import { S } from '../state.js';
import { api, mintAccountToken } from '../vest/api.js';

// Bracket legs. Every stop and target is tracked as { id, kind:'tp'|'sl', price, qty } on the master entry and on
// each follower, so a move / add / remove on the master hits the matching follower leg. Master and follower legs are
// paired by kind and trigger price (and by order when two share a price), never by array position alone.
const legsFrom = (reqLegs, ids, kind) =>
  (reqLegs || [])
    .map((l, i) => ({
      id: (ids || [])[i] || null,
      kind,
      price: parseFloat(l.triggerPrice),
      qty: l.quantity != null ? String(l.quantity) : null,
    }))
    .filter((l) => l.id);
export const legsOf = (req, res) => [
  ...legsFrom(req && req.takeProfits, res && res.takeProfitIds, 'tp'),
  ...legsFrom(req && req.stopLosses, res && res.stopLossIds, 'sl'),
];
const legOf = (kind) => (b) => ({
  id: b.id || null,
  kind,
  price: parseFloat(b.triggerPrice),
  qty: b.quantity != null ? String(b.quantity) : null,
});
export const posLegs = (p) =>
  [...(p.takeProfits || []).map(legOf('tp')), ...(p.stopLosses || []).map(legOf('sl'))].filter((l) => l.id);
export const posIdOf = (p) => p.positionId || p.position_id;
export function matchLeg(masterLegs, followerLegs, masterLegId) {
  const m = (masterLegs || []).find((l) => l.id === masterLegId);
  if (!m) return null;
  const same = (arr) => (arr || []).filter((l) => l.kind === m.kind && Math.abs(l.price - m.price) < PRICE_EPS);
  return same(followerLegs)[same(masterLegs).indexOf(m)] || null;
}
// Re-read the master and follower positions so leg ids, prices and sizes are exact (after an add or a reduce, after
// an order that didn't fill, or when a leg is unknown).
export async function syncLegs(entry) {
  const read = async (acct, positionId) => {
    try {
      const r = await api('/v3/positions/opened', (await mintAccountToken(acct)).token);
      const p = ((r && r.positions) || []).find((x) => posIdOf(x) === positionId);
      return p ? { legs: posLegs(p), qty: String(p.quantity) } : null;
    } catch {
      return null;
    }
  };
  const masterPid = Object.keys(S.posMap).find((k) => S.posMap[k] === entry);
  const pairs = Object.entries(entry.followers); // fixed pairs: a follower dropped meanwhile can't shift them
  const [ml, ...fls] = await Promise.all([
    read(entry.master, masterPid),
    ...pairs.map(([f, fp]) => read(f, fp.positionId)),
  ]);
  if (ml) Object.assign(entry, ml);
  pairs.forEach(([, fp], i) => {
    if (fls[i]) Object.assign(fp, fls[i]);
  });
}
