import { accLabel } from '../accounts/registry.js';
import { flattenOrphans, keepOrphans } from '../copier/orphans.js';
import { _toast } from '../core/activity-log.js';
import { S } from '../state.js';
import { esc } from './format.js';
import { _root } from './panel.js';

// The activity log strip under the tabs, and the Flatten / Keep question for orphaned followers.

export function renderLog() {
  if (!_root) return;
  const el = _root.querySelector('.log');
  if (!el) return;
  const confirmBar = (text, goId, goLabel, noId, noLabel) =>
    `<div class="orphan">${text}<button class="obtn" id="${goId}">${goLabel}</button><button class="obtn keep" id="${noId}">${noLabel}</button></div>`;
  const n = S.orphan ? S.orphan.list.length : 0;
  const orphanHtml = n
    ? confirmBar(
        `${n} follower position${n !== 1 ? 's' : ''} without the master.`,
        'vc-flatten',
        'Flatten',
        'vc-keep',
        'Keep',
      )
    : '';
  const toastHtml = _toast ? `<div class="toast">${esc(_toast)}</div>` : '';
  // armed, and Vest's own screen is on another of the user's accounts: orders placed on Vest's ticket there aren't copied
  const screenHtml =
    S.armed && S.master && S.screen && S.screen !== S.master && S.byId[S.screen]
      ? `<div class="toast" data-warn="screen">Vest is showing ${esc(accLabel(S.screen))}, not your master ${esc(accLabel(S.master))}: orders placed there aren't copied.</div>`
      : '';
  // The orphan prompt and notices sit above the log, so they show even while it's folded.
  const alerts = _root.querySelector('.alerts');
  const html = orphanHtml + screenHtml + toastHtml;
  if (alerts.dataset.html !== html) alerts.innerHTML = alerts.dataset.html = html; // a redraw would eat a click
  el.innerHTML = S.log
    .map(
      (e) =>
        `<div class="le ${e.level}"><span class="ts">${e.t.toLocaleTimeString([], { hour12: false })}</span><span>${esc(e.msg)}</span></div>`,
    )
    .join('');
  const last = _root.querySelector('.loglast');
  last.textContent = S.log.length ? S.log[0].msg : '';
  last.className = 'loglast ' + (S.log.length ? S.log[0].level : '');
  if (S.orphan) {
    const fb = alerts.querySelector('#vc-flatten'),
      kb = alerts.querySelector('#vc-keep');
    if (fb) fb.onclick = () => flattenOrphans();
    if (kb) kb.onclick = () => keepOrphans();
  }
}
