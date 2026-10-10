import CSS from './panel.css';
import { refresh } from '../accounts/reload.js';
import { VERSION } from '../config.js';
import { arm, disarm } from '../copier/arming.js';
import { flattenAll } from '../copier/flatten.js';
import { clearLog, downloadLog, toast } from '../core/activity-log.js';
import { downloadDiag } from '../core/diagnostics.js';
import { SIZE_KEY, store } from '../core/settings.js';
import { SUPPORT_CODE, SUPPORT_KEY, copySupportCode } from '../features/support-code.js';
import { renderUpdate } from '../features/updates.js';
import { healthState } from '../health/health.js';
import { openSiteCheck, siteGate } from '../health/site-check.js';
import { S } from '../state.js';
import { renderSupport, renderThemeIntro } from './banners.js';
import {
  DRAG_PX,
  PANEL_MAX_W,
  PANEL_MIN_H,
  PANEL_MIN_W,
  clampPx,
  place,
  placeBounds,
  rememberSpot,
  setOpen,
  toggleDock,
} from './dock.js';
import { render, setView } from './render.js';

// The panel: its shadow root, header and tabs, and the health and rate-limit line.

// STRATUH logo: the five-bar profile mark (lime point of control) and the "stratuh" wordmark (Instrument Sans,
// condensed, as on stratuh.com) drawn as paths, so nothing is downloaded.
const LOG_OPEN_KEY = 'vc-log-open';
const BRAND_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="vc-poc" x1="0" x2="1">
      <stop offset="0" stop-color="#9fe02f"/><stop offset="1" stop-color="#e4ff7a"/></linearGradient></defs>
      <rect x="1" y="1" width="10" height="3.4" fill="#77777d"/><rect x="1" y="5.65" width="16" height="3.4" fill="#f0f0f1"/>
      <rect x="1" y="10.3" width="22" height="3.4" fill="url(#vc-poc)"/><rect x="1" y="14.95" width="15" height="3.4" fill="#f0f0f1"/>
      <rect x="1" y="19.6" width="8" height="3.4" fill="#77777d"/></svg><svg height="16" viewBox="0 -73 237.9 75" aria-hidden="true"><path fill="#f0f0f1" d="M18.3 1L18.3 1Q10.9 1 6.8-3.4Q2.7-7.8 2.3-15.7L2.3-15.7L11.7-15.7Q12-11.7 13.8-9.7Q15.6-7.6 18.5-7.6L18.5-7.6Q20.9-7.6 22.2-8.8Q23.5-10.1 23.5-12.5L23.5-12.5Q23.5-14.4 22.5-16.1Q21.5-17.8 18.3-19.8L18.3-19.8L12.4-23.5Q8.4-26.1 6.2-29.6Q4-33.1 4-38L4-38Q4-44.2 7.9-48.1Q11.8-52 18.2-52L18.2-52Q24.9-52 28.7-48.1Q32.4-44.1 32.8-36.9L32.8-36.9L23.4-36.9Q23.1-40.4 21.9-41.9Q20.6-43.4 18.5-43.4L18.5-43.4Q16.4-43.4 15.2-42.2Q13.9-41 13.9-38.7L13.9-38.7Q13.9-36.9 15.0-35.3Q16-33.6 18.8-31.8L18.8-31.8L25.2-27.8Q28.9-25.5 31.2-21.7Q33.4-17.9 33.4-13L33.4-13Q33.4-6.7 29.4-2.9Q25.4 1 18.3 1ZM54.2 1L54.2 1Q47 1 43.5-2.5Q40-5.9 40-12.9L40-12.9L40-60.6L51.4-65.6L51.4-13Q51.4-10.5 52.8-9.3Q54.1-8.1 57-8.1L57-8.1Q58.1-8.1 59.0-8.3Q60-8.5 60.7-8.9L60.7-8.9L60.7-0.1Q59.7 0.5 58.0 0.8Q56.2 1 54.2 1ZM60.4-41.9L33.4-41.9L33.4-51L60.4-51L60.4-41.9ZM75.6 0L64.2 0L64.2-51L75.1-51L75.1-39.1L75.6-39.1L75.6 0ZM75.6-30.3L75.6-30.3L74-38.8Q75.7-45.8 78.6-48.9Q81.5-52 85.6-52L85.6-52Q86.7-52 87.6-51.7L87.6-51.7L87.6-40.3Q87.3-40.4 86.7-40.5Q86.1-40.5 85.2-40.5L85.2-40.5Q80.8-40.5 78.2-38Q75.6-35.5 75.6-30.3ZM123.3 0L112.8 0Q112.2-1.8 111.9-4.0Q111.7-6.1 111.7-8.5L111.7-8.5L111.2-8.5L111.2-36.6Q111.2-40.1 109.9-41.7Q108.7-43.3 106.3-43.3L106.3-43.3Q103.6-43.3 102.2-41.3Q100.8-39.3 100.8-35.8L100.8-35.8L90.7-35.8Q90.7-42.9 95.1-47.5Q99.5-52 107.2-52L107.2-52Q114.4-52 118.3-48Q122.3-44 122.3-36.7L122.3-36.7L122.3-8.5Q122.3-6.4 122.5-4.3Q122.7-2.1 123.3 0L123.3 0ZM100.6 1L100.6 1Q95.8 1 92.7-2.5Q89.6-6 89.6-12L89.6-12Q89.6-17.4 92.1-21.2Q94.7-24.9 101-28L101-28L113.9-34.5L113.9-25.7L106.9-22Q103.6-20.3 102.1-18.2Q100.6-16 100.6-13.2L100.6-13.2Q100.6-10.5 101.9-9.1Q103.3-7.7 105.5-7.7L105.5-7.7Q108-7.7 109.6-9.5Q111.2-11.2 111.2-13.9L111.2-13.9L112.2-7.6Q110.7-3.2 107.7-1.1Q104.7 1 100.6 1ZM145.8 1L145.8 1Q138.6 1 135.1-2.5Q131.6-5.9 131.6-12.9L131.6-12.9L131.6-60.6L143-65.6L143-13Q143-10.5 144.3-9.3Q145.7-8.1 148.6-8.1L148.6-8.1Q149.7-8.1 150.6-8.3Q151.6-8.5 152.3-8.9L152.3-8.9L152.3-0.1Q151.3 0.5 149.5 0.8Q147.8 1 145.8 1ZM152-41.9L125.0-41.9L125.0-51L152-51L152-41.9ZM166.7 1L166.7 1Q163.3 1 160.7-0.5Q158.1-1.9 156.8-4.8Q155.4-7.6 155.4-11.6L155.4-11.6L155.4-51L166.8-51L166.8-14.1Q166.8-11.3 168.1-9.9Q169.4-8.4 171.7-8.4L171.7-8.4Q173.9-8.4 175.5-9.7Q177.1-10.9 178-13.0Q178.9-15 178.9-17.3L178.9-17.3L180.4-9.4Q178.5-4.5 175-1.8Q171.5 1 166.7 1ZM190.4 0L179.5 0L179.5-9.5L178.9-9.5L178.9-51L190.4-51L190.4 0ZM208.9 0L197.5 0L197.5-72L208.9-72L208.9 0ZM233.3 0L221.8 0L221.8-36.4Q221.8-39.7 220.5-41.2Q219.2-42.6 216.6-42.6L216.6-42.6Q214.2-42.6 212.4-41.4Q210.7-40.1 209.8-38.1Q208.9-36 208.9-33.5L208.9-33.5L207.4-41.4Q209.4-46.5 213.0-49.3Q216.6-52 221.7-52L221.7-52Q227.1-52 230.2-48.6Q233.3-45.1 233.3-39L233.3-39L233.3 0Z"/></svg>`;

export let _root = null; // the panel's shadow root
export let _pointerDown = false, // a press inside the panel is in progress: live redraws wait for it
  _dragging = false;
export const mountPanel = () => (_root = buildPanel());
function buildPanel() {
  const host = document.createElement('div');
  host.id = 'vc-host';
  (document.body || document.documentElement).appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${CSS}</style>
      <div class="panel">
        <div class="hdr">
          <span class="brand" role="img" aria-label="STRATUH">${BRAND_SVG}</span><span class="sep"></span><span class="title">Copier</span>
          <span class="armtag off" id="armtag">idle</span><span class="opttag" id="opttag"></span><span class="attn" id="attn"></span>
          <span class="spacer"></span>
          <button class="iconbtn ico" data-act="dock" title="Docked on the chart: click to float it anywhere" aria-label="Detach from the chart" aria-pressed="true">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 6 4 3v2H6v-2l4-3-1-6zM12 14v7" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linejoin="round"/><path class="unpin" d="M4 4l16 16" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
          <button class="iconbtn ico" data-act="refresh" title="Reload accounts" aria-label="Reload accounts">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7" fill="none" stroke="currentColor"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="iconbtn" data-act="collapse" title="Minimise" aria-label="Minimise" aria-expanded="true">–</button>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" data-tab="accounts">Accounts</button>
          <button class="tab" role="tab" data-tab="trade" title="Order panel: stop &amp; targets in points">Trade</button>
          <button class="tab" role="tab" data-tab="summary" title="Profit and loss per account">P&amp;L</button>
          <button class="tab" role="tab" data-tab="settings">Settings</button>
          <button class="tab" role="tab" data-tab="rules">Rules</button>
          <button class="tab tab-support" role="tab" data-tab="support" title="Report a problem, share ideas, get help">Support</button>
        </div>
        <div class="update" hidden></div>
        <div class="support update" hidden></div>
        <div class="themeintro update" hidden></div>
        <div class="body"><div class="empty">Waiting for your Vest session…</div></div>
        <div class="ctl">
          <button class="armbtn" data-act="arm" disabled>ARM</button>
          <button class="dangerbtn" data-act="flatall" title="Instantly closes every position and cancels every order on every account. No confirmation. The copier stays armed.">Flatten All</button>
        </div>
        <div class="alerts"></div>
        <div class="logwrap">
          <div class="logh" role="button" tabindex="0" aria-expanded="false" title="Show or hide the activity log">
            <span class="caret">▸</span><span class="logt">Activity</span><span class="loglast"></span><span class="loghbtns">
            <button class="iconbtn sm" data-act="dldiag" title="Download diagnostics (JSON) for troubleshooting">Diag</button>
            <button class="iconbtn sm" data-act="dllog" title="Download the activity log (CSV)">CSV</button>
            <button class="iconbtn sm" data-act="clearlog" title="Clear the activity log">Clear</button>
          </span></div>
          <div class="log" aria-live="polite"></div>
        </div>
        <div class="reportbar"><button class="codebtn" data-act="code" title="Click to copy the code" hidden>Use code <b>${SUPPORT_CODE}</b><span class="off"> · 5% off</span></button>
          <div class="health" role="button" tabindex="0" title="Vest's build, this version and the API budget. Click to run the site check.">
            <span class="dot gray"></span><span class="htext">Starting…</span><span class="ver">v${VERSION}</span><span class="rate" id="rate"></span>
          </div></div>
        <div class="grip" title="Drag to resize"></div>
      </div>`;
  const panel = root.querySelector('.panel');
  const hdr = root.querySelector('.hdr');
  panel.addEventListener('pointerdown', () => (_pointerDown = true), true);
  window.addEventListener('pointerup', () => (_pointerDown = false), true);
  // Move by the header (or the whole pill when minimised): a press that moves DRAG_PX or more drags, kept inside the
  // chart when docked (else the window); a press that doesn't move on the pill opens it. Pointer capture keeps the drag
  // even when the cursor passes over the chart's frame.
  let drag = null;
  hdr.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || (e.target.closest('.iconbtn') && !panel.classList.contains('collapsed'))) return;
    const r = panel.getBoundingClientRect();
    drag = { sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, moved: false };
    try {
      hdr.setPointerCapture(e.pointerId);
    } catch {
      /* best effort: nothing to do if this fails */
    }
    e.preventDefault();
  });
  hdr.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.sx,
      dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_PX) return;
    drag.moved = _dragging = true;
    const B = placeBounds(),
      r = panel.getBoundingClientRect();
    panel.style.left = clampPx(drag.ox + dx, B.l, B.r - r.width) + 'px';
    panel.style.top = clampPx(drag.oy + dy, B.t, B.b - r.height) + 'px';
  });
  const endDrag = (e) => {
    if (!drag) return;
    const was = drag;
    drag = null;
    _dragging = false;
    if (was.moved) return rememberSpot();
    if (e.type === 'pointerup' && panel.classList.contains('collapsed')) setOpen(true); // a click on the pill
  };
  hdr.addEventListener('pointerup', endDrag);
  hdr.addEventListener('pointercancel', endDrag);
  hdr.addEventListener('keydown', (e) => {
    if (panel.classList.contains('collapsed') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
    }
  });

  // Resize from the corner grip, inside the same bounds; the size is remembered.
  const grip = root.querySelector('.grip');
  let rs = null;
  grip.addEventListener('pointerdown', (e) => {
    const r = panel.getBoundingClientRect();
    rs = { w: r.width, h: r.height, sx: e.clientX, sy: e.clientY, left: r.left, top: r.top };
    try {
      grip.setPointerCapture(e.pointerId);
    } catch {
      /* best effort: nothing to do if this fails */
    }
    e.preventDefault();
    e.stopPropagation();
  });
  grip.addEventListener('pointermove', (e) => {
    if (!rs) return;
    const B = placeBounds();
    panel.style.width = clampPx(rs.w + e.clientX - rs.sx, PANEL_MIN_W, Math.min(PANEL_MAX_W, B.r - rs.left)) + 'px';
    panel.style.maxHeight = clampPx(rs.h + e.clientY - rs.sy, PANEL_MIN_H, B.b - rs.top) + 'px';
  });
  const endResize = () => {
    if (!rs) return;
    rs = null;
    store.set(SIZE_KEY, { w: panel.offsetWidth, h: parseInt(panel.style.maxHeight, 10) || 0 });
    place();
  };
  grip.addEventListener('pointerup', endResize);
  grip.addEventListener('pointercancel', endResize);

  const on = (sel, fn) => {
    root.querySelector(sel).onclick = fn;
  };
  on('[data-act="collapse"]', () => setOpen(false));
  on('[data-act="dock"]', () => toggleDock());
  on('[data-act="refresh"]', () => refresh());
  root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => setView(b.dataset.tab)));
  const health = root.querySelector('.health');
  const toggleSite = () => {
    if (siteGate()) return; // the check already fills the panel
    if (S.siteOpen) {
      S.siteOpen = false;
      render();
    } else openSiteCheck();
  };
  health.onclick = toggleSite;
  health.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSite();
    }
  };
  on('[data-act="arm"]', () => (S.armed ? disarm() : arm()));
  on('[data-act="flatall"]', () => flattenAll()); // acts at once, no confirmation
  // The activity log folds to one line (the latest event); open or closed is remembered.
  const logwrap = root.querySelector('.logwrap'),
    logh = root.querySelector('.logh');
  const setLogOpen = (open) => {
    logwrap.classList.toggle('open', open);
    logh.setAttribute('aria-expanded', String(open));
    logh.querySelector('.caret').textContent = open ? '▾' : '▸';
    store.set(LOG_OPEN_KEY, open);
  };
  setLogOpen(store.get(LOG_OPEN_KEY, false) === true);
  logh.onclick = (e) => !e.target.closest('button') && setLogOpen(!logwrap.classList.contains('open'));
  logh.onkeydown = (e) => {
    if (e.target === logh && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setLogOpen(!logwrap.classList.contains('open'));
    }
  };
  on('[data-act="dldiag"]', () => downloadDiag());
  on('[data-act="dllog"]', () => downloadLog());
  on('[data-act="clearlog"]', () => clearLog());
  on('[data-act="code"]', () =>
    copySupportCode().then((ok) =>
      toast(ok ? `Code ${SUPPORT_CODE} copied: 5% off at Vest's checkout.` : `Code: ${SUPPORT_CODE}`),
    ),
  );
  // shown unless this account already uses the code
  root.querySelector('[data-act="code"]').hidden = (store.get(SUPPORT_KEY, null) || {}).answered === 'had-code';
  return root;
}

export function renderHealth() {
  if (!_root) return;
  const h = healthState(),
    g = siteGate();
  _root.querySelector('.health .dot').className = 'dot ' + (g === 'failed' ? 'red' : h.level);
  _root.querySelector('.htext').textContent =
    g === 'failed' ? 'Vest changed — copying off' : g === 'waiting' ? 'Vest updated — check waiting' : h.text;
  _root.querySelector('.health').classList.toggle('amber-bar', h.changed);
  _root.querySelector('.reportbar').classList.toggle('alert', h.level !== 'green');
  renderRate();
  renderUpdate();
  renderSupport();
  renderThemeIntro();
}
export function renderRate() {
  if (!_root) return;
  const el = _root.querySelector('#rate');
  if (!el) return;
  const { remaining, limit } = S.rate;
  if (remaining == null) {
    el.textContent = '';
    return;
  }
  el.textContent = `API ${remaining}${limit ? '/' + limit : ''}`;
  const frac = limit ? remaining / limit : 1;
  el.className = 'rate ' + (frac < 0.05 ? 'r-red' : frac < 0.2 ? 'r-amber' : 'r-ok');
}

// One view at a time. Tabs: accounts · trade · summary · settings · rules (site check opens from the health bar).
export const currentView = () =>
  S.siteOpen
    ? 'site'
    : S.supportOpen
      ? 'support'
      : S.tradeOpen
        ? 'trade'
        : S.summaryOpen
          ? 'summary'
          : S.settingsOpen
            ? 'settings'
            : S.rulesOpen
              ? 'rules'
              : 'accounts';
