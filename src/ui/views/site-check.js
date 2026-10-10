import { downloadDiag } from '../../core/diagnostics.js';
import { DISCORD_URL } from '../../features/updates.js';
import { fingerprint } from '../../health/health.js';
import { SITE_CHECKS, runSiteCheck } from '../../health/site-check.js';
import { S } from '../../state.js';
import { esc } from '../format.js';
import { render } from '../render.js';

// Site check view.

// The check list: required checks, then the extras (which never block copying).
function siteRows(site) {
  const rows =
    site && site.results.length
      ? site.results
      : SITE_CHECKS.map(([key, name, tier]) => ({ key, name, tier, status: 'pending', detail: '' }));
  const shown = site && site.shown != null ? site.shown : rows.length; // rows not revealed yet still wait
  const dot = { pass: 'green', warn: 'amber', fail: 'red', skip: 'gray', pending: 'gray' };
  const row = (r) => {
    const i = rows.indexOf(r),
      active = i === shown && site && site.running,
      status = i < shown ? r.status : 'pending',
      detail = i < shown ? r.detail : active ? 'Checking…' : '';
    return `
          <div class="sc-row${active ? ' active' : ''}"><span class="dot ${dot[status]}${active ? ' pending' : ''}"></span>
            <div><div class="sc-name">${esc(r.name)}</div><div class="sc-detail">${esc(detail || '')}</div></div></div>`;
  };
  return `<div class="sc-list">${rows
    .filter((r) => r.tier === 'must')
    .map(row)
    .join('')}</div>
        <div class="sc-h">Extras · never block copying</div>
        <div class="sc-list">${rows
          .filter((r) => r.tier !== 'must')
          .map(row)
          .join('')}</div>`;
}
// While the check runs, keep the row being checked in view; on a new screen (the verdict), back to the top.
function followCheck(body, top, screen) {
  if (body.dataset.check !== screen) {
    body.dataset.check = screen;
    body.scrollTop = 0;
    return;
  }
  body.scrollTop = top; // the list was just redrawn: stay where it was
  const el = body.querySelector('.sc-row.active');
  if (!el) return;
  const r = el.getBoundingClientRect(),
    b = body.getBoundingClientRect();
  if (r.bottom > b.bottom - 8) body.scrollTop += r.bottom - b.bottom + 24;
  else if (r.top < b.top) body.scrollTop -= b.top - r.top + 8;
}
// The site check from the status bar, on an accepted build: the latest results, Re-run and Close.
export function renderSiteCheck(body) {
  const site = S.site,
    top = body.scrollTop;
  body.innerHTML = `
      <div class="rules">
        <div class="rules-h">Site check</div>
        <div class="sc-sub">Vest build ${esc(fingerprint() || 'unknown')}. Runs by itself whenever Vest updates its site. Read-only: nothing is sent to your accounts.</div>
        ${siteRows(site)}
        <div class="rules-btns">
          <button class="ghostbtn" id="sc-run" ${site && site.running ? 'disabled' : ''}>Re-run</button>
          <button class="ghostbtn" id="sc-close">Close</button>
        </div>
      </div>`;
  followCheck(body, top, site && site.running ? 'site-run' : 'site');
  body.querySelector('#sc-run').onclick = () => runSiteCheck();
  body.querySelector('#sc-close').onclick = () => {
    S.siteOpen = false;
    render();
  };
}
// In place of the tabs while Vest's update isn't accepted (siteGate): checking, waiting, failed, then "All clear".
export function renderGate(body, g) {
  const s = S.site,
    top = body.scrollTop;
  const [title, sub] = {
    checking: [
      'Vest updated its site',
      'Checking that the copier still works with it. Takes a few seconds. Read-only: nothing is sent to your accounts.',
    ],
    waiting: [
      'Vest updated its site',
      s && s.wait === 'session'
        ? 'Log in to Vest: the check runs by itself once your session loads.'
        : 'The check runs by itself once Vest lists an active account to read from.',
    ],
    failed: [
      'Copying is off',
      "Vest changed something the copier relies on (in red below). Copying, Trade-tab orders, automatic breakeven and claims stay off until a copier update fixes it: trade from Vest's own panel meanwhile. Flatten All still works.",
    ],
    clear: ['All clear', "The copier works with Vest's update."],
  }[g];
  body.innerHTML = `
      <div class="rules gate gate-${g}">
        <div class="gate-h">${esc(title)}</div>
        <div class="sc-sub">${esc(sub)}</div>
        ${g === 'waiting' ? '' : siteRows(s)}
        ${
          g === 'failed'
            ? `<div class="rules-btns">
          <button class="armbtn sm" id="sc-run">Check again</button>
          <button class="ghostbtn" id="sc-diag">Diag file</button>
          <button class="ghostbtn" id="sc-help">Discord</button>
        </div>
        <div class="sc-note">Send the Diag file on Discord or GitHub. The fix arrives as a copier update in the bar above.</div>`
            : ''
        }
      </div>`;
  followCheck(body, top, 'gate-' + g);
  if (g !== 'failed') return;
  body.querySelector('#sc-run').onclick = () => runSiteCheck();
  body.querySelector('#sc-diag').onclick = () => downloadDiag();
  body.querySelector('#sc-help').onclick = () => window.open(DISCORD_URL, '_blank', 'noopener');
}
