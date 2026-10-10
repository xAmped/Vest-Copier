import { VERSION } from '../config.js';
import { logEvent, saveFile, stamp } from '../core/activity-log.js';
import { diag, persistDiag } from '../core/diagnostics.js';
import { REPO_URL } from './updates.js';
import { fingerprint } from '../health/health.js';
import { S } from '../state.js';
import { feedLive } from '../vest/account-feed.js';

// Report a problem. One file with everything needed to debug (activity log, diagnostics, version, Vest build,
// settings, accounts with balances), saved locally, plus a GitHub issue pre-filled with the version and the user's
// description, ready for the file to be dragged in. Account ids are replaced by their labels ("Account 07") so the
// file is safer to post publicly; nothing is sent anywhere by the copier.
const ISSUE_FORM = 'bug_report.yml';
function buildReport(note) {
  // Every account id becomes a name: active accounts by their label, closed ones by the label recorded next to the
  // id in the diagnostics, anything else by a placeholder. Position and order ids are Vest's random ids for single
  // orders (useless without a login) and stay, since they tie related events together.
  const ACCOUNT_KEYS = new Set(['account', 'accountId', 'master', 'followers', 'id']);
  const isUuid = (v) =>
    typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
  const alias = {};
  for (const id in S.byId) alias[id] = S.byId[id].label;
  const learn = (o) => {
    if (Array.isArray(o)) return o.forEach(learn);
    if (!o || typeof o !== 'object') return;
    const id = isUuid(o.account) ? o.account : isUuid(o.id) && o.label ? o.id : null;
    if (id && o.label && !alias[id]) alias[id] = o.label;
    Object.values(o).forEach(learn);
  };
  learn(S.diag);
  let unknown = 0;
  const nameFor = (id) => alias[id] || (alias[id] = `account-${++unknown}`);
  const scrub = (v) =>
    JSON.parse(JSON.stringify(v), function (k, val) {
      if (Array.isArray(val) && ACCOUNT_KEYS.has(k)) return val.map((x) => (isUuid(x) ? nameFor(x) : x));
      if (typeof val !== 'string') return val;
      if (alias[val]) return alias[val];
      if (isUuid(val) && ACCOUNT_KEYS.has(k) && (k !== 'id' || 'label' in this)) return nameFor(val);
      // account ids inside longer text, e.g. an error message holding an API path with the id in it
      return val.replace(/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi, (m) => alias[m] || m);
    });
  const accounts = Object.values(S.byId).map((r) => ({
    label: r.label,
    type: r.type,
    size: r.size,
    equity: r.equity,
    floor: r.floor,
    dailyFloor: r.dailyFloor,
    target: r.target,
    free: r.free,
    canTrade: r.canTrade,
    role: r.id === S.master ? 'master' : S.followers.has(r.id) ? 'follower' : null,
  }));
  return scrub({
    kind: 'vest-copier-report',
    version: VERSION,
    build: fingerprint() || null,
    exportedAt: new Date().toISOString(),
    browser: navigator.userAgent,
    description: note,
    state: {
      armed: S.armed,
      master: S.master,
      followers: [...S.followers],
      openTrades: Object.keys(S.posMap).length,
      liveFeed: feedLive(),
    },
    settings: {
      fast: S.fast,
      autoFlatten: S.autoFlatten,
      capFit: S.capFit,
      checkUpdates: S.checkUpdates,
      hideMarks: S.hideMarks,
      trade: S.trade,
    },
    accounts,
    log: [...S.log].reverse().map((e) => ({ t: e.t.toISOString(), level: e.level, msg: e.msg })),
    diagnostics: S.diag,
  });
}
export function sendReport(note) {
  const name = `vest-copier-report-${stamp()}.json`;
  persistDiag();
  saveFile(name, 'application/json', JSON.stringify(buildReport(note), null, 2));
  const first = (note.split('\n').find((l) => l.trim()) || '').trim().slice(0, 80);
  const params = new URLSearchParams({
    template: ISSUE_FORM,
    title: `Problem: ${first || 'describe it here'}`,
    version: VERSION,
  });
  if (note) params.set('what-happened', note.slice(0, 4000));
  window.open(`${REPO_URL}/issues/new?${params}`, '_blank', 'noopener');
  logEvent('info', `Report saved as ${name}. Drag it into the GitHub issue that just opened.`);
  diag('report', { file: name, hasNote: !!note });
}
// Support tab: report a problem (one report file + a pre-filled GitHub issue), share ideas, quick links, and the
// project's support code. Built once, so a description being typed survives the panel's regular refreshes.
export function shareIdea() {
  const params = new URLSearchParams({ template: 'feature_request.yml', title: 'Idea: ', version: VERSION });
  window.open(`${REPO_URL}/issues/new?${params}`, '_blank', 'noopener');
}
