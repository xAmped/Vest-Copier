import { toast } from '../core/activity-log.js';
import { S } from '../state.js';
import { render } from '../ui/render.js';

// Choosing the master and the followers.
export const LOCKED_MSG = 'Disarm first to change the master, followers or Cap-to-fit.';
export function setMaster(id) {
  if (S.arming) return toast('Wait for arming to finish.');
  if (S.armed) return toast(LOCKED_MSG);
  S.master = S.master === id ? null : id;
  S.followers.delete(id);
  // the same-size rule applies only in strict 1:1; with cap-to-fit, followers may be any size (scaled by equity)
  if (S.master && !S.capFit) {
    const g = S.byId[S.master].groupKey;
    [...S.followers].forEach((f) => {
      if (S.byId[f].groupKey !== g) S.followers.delete(f);
    });
  }
  S.armed = false;
  render();
}
export function toggleFollower(id) {
  if (S.arming) return toast('Wait for arming to finish.');
  if (S.armed) return toast(LOCKED_MSG);
  if (!S.master || !S.byId[S.master] || !S.byId[id]) return toast('Pick a master first.');
  if (!S.capFit && S.byId[id].groupKey !== S.byId[S.master].groupKey) {
    return toast('A different-size follower needs Cap-to-fit (Settings). Strict 1:1 needs the same size and type.');
  }
  if (S.followers.has(id)) S.followers.delete(id);
  else S.followers.add(id);
  S.armed = false;
  render();
}
