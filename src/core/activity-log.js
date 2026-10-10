import { LOG, LOG_MAX, VERSION } from '../config.js';
import { persistLog } from './settings.js';
import { fingerprint } from '../health/health.js';
import { S } from '../state.js';
import { renderLog } from '../ui/log.js';

// The activity log shown in the panel, plus file downloads and toasts.

export function logEvent(level, msg) {
  S.log.unshift({ t: new Date(), level, msg });
  S.log = S.log.slice(0, LOG_MAX);
  LOG(msg);
  persistLog();
  renderLog();
}
export function clearLog() {
  S.log = [];
  persistLog();
  renderLog();
}
export const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
export function saveFile(name, mime, text) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadLog() {
  const rows = [...S.log].reverse();
  const csv =
    `time,level,message\n${new Date().toISOString()},info,"Exported from STRATUH Copier v${VERSION} (Vest build ${fingerprint() || 'unknown'})"\n` +
    rows.map((e) => `${e.t.toISOString()},${e.level},"${String(e.msg).replace(/"/g, '""')}"`).join('\n');
  saveFile(`vest-copier-log-${stamp()}.csv`, 'text/csv', csv);
}
export let _toast = '';
export function toast(m) {
  _toast = m;
  renderLog();
  setTimeout(() => {
    if (_toast === m) {
      _toast = '';
      renderLog();
    }
  }, 3500);
}
