import { DIAG_MAX, DIAG_MAX_BYTES, VERSION } from '../config.js';
import { logEvent, saveFile, stamp } from './activity-log.js';
import { store } from './settings.js';
import { fingerprint } from '../health/health.js';
import { S } from '../state.js';

// Structured diagnostics, kept apart from the activity log and exported as JSON.
// A structured record of every event, kept out of the activity log: intended vs. actual size, the cap-to-fit math,
// fill prices and slippage, margin used, HTTP error codes, and whether the expected outcome happened. It holds account
// ids, labels and equity, but no tokens. Exported as JSON from the Diag button for troubleshooting.
const DIAG_KEY = 'vc-diag';
let _diagTimer = null;
export const errCode = (e) => {
  const m = String((e && e.message) || e).match(/->\s*(\d{3})/);
  return m ? +m[1] : null;
};
export function loadDiag() {
  const d = store.get(DIAG_KEY, []);
  S.diag = Array.isArray(d) ? d : [];
}
// Kept under a size budget: this page's storage is shared with Vest's own site, which must never run out of room.
export function persistDiag() {
  let json = JSON.stringify(S.diag);
  while (json.length > DIAG_MAX_BYTES && S.diag.length > 10) {
    S.diag.splice(0, Math.ceil(S.diag.length / 10));
    json = JSON.stringify(S.diag);
  }
  try {
    localStorage.setItem(DIAG_KEY, json);
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
export function persistDiagSoon() {
  if (_diagTimer) return;
  _diagTimer = setTimeout(() => {
    _diagTimer = null;
    persistDiag();
  }, 1200);
}
export function diag(type, data) {
  const rec = { t: new Date().toISOString(), type, ...data };
  S.diag.push(rec);
  if (S.diag.length > DIAG_MAX) S.diag.splice(0, S.diag.length - DIAG_MAX);
  persistDiagSoon();
  return rec;
}
export function downloadDiag() {
  persistDiag();
  const payload = {
    exportedAt: new Date().toISOString(),
    version: VERSION,
    build: fingerprint() || null,
    records: S.diag.length,
    diagnostics: S.diag,
  };
  saveFile(`vest-copier-diagnostics-${stamp()}.json`, 'application/json', JSON.stringify(payload, null, 2));
  logEvent('info', `Diagnostics exported (${S.diag.length} records).`);
}
