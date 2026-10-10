import { FEED_QUIET_MS } from '../config.js';
import { SIZE_KEY, store } from '../core/settings.js';
import { healthState } from '../health/health.js';
import { siteGate } from '../health/site-check.js';
import { S } from '../state.js';
import { hideChartMarks, hideSessionShading, removeAutoVolume } from './chart-tweaks.js';
import { _dragging, _root } from './panel.js';
import { themeChart } from './theme.js';
import { feedLive } from '../vest/account-feed.js';

// Placement. Docked (the default), the panel lives on Vest's chart: just right of the chart's drawing toolbar and
// below its top toolbar, kept inside the chart whatever resizes (the window, Vest's order book or positions area), its
// spot remembered relative to the chart. Detached (the pin), it floats anywhere in the window. Minimised, it's a pill:
// logo, COPIER and the state, with a dot when something needs you. On a page with no chart, it floats.
// On the Trade tab it grows to the bottom of its bounds, so the whole order form fits without resizing by hand.
const DOCK_KEY = 'vc-dock'; // { docked, open, at: {x,y} from the chart's corner, free: {x,y} in the window }
export const PANEL_MIN_W = 300,
  PANEL_MAX_W = 700,
  PANEL_MIN_H = 350; // header, tabs, a one-time bar, an account row, ARM, the log's header line and the bottom bar
const HDR_FULL_W = 350; // narrower than this, the header leaves out the "COPIER" label
export const DOCK_INSET = 6, // px kept between the panel and the chart's edges (and the window's)
  DRAG_PX = 4, // a press on the pill that moves less than this is a click
  CHART_MIN_W = 400, // a frame smaller than this isn't Vest's chart
  CHART_MIN_H = 300,
  DOCK_MIN_W = 520, // a chart area narrower or shorter than this (Vest's stacked layout in a small window) can't hold
  DOCK_MIN_H = 440; // the panel without squashing it: it floats until the chart is big enough, then docks back
let _placeKey = '';
export const clampPx = (v, lo, hi) => Math.max(lo, Math.min(hi, v)) || lo;
export function loadDock() {
  const d = store.get(DOCK_KEY, {}) || {};
  const pt = (o) => (o && Number.isFinite(o.x) && Number.isFinite(o.y) ? { x: o.x, y: o.y } : null);
  S.dock = { docked: d.docked !== false, open: d.open !== false, at: pt(d.at), free: pt(d.free) };
}
const saveDock = () => store.set(DOCK_KEY, S.dock);
// Vest's chart: the TradingView frame (found by its API, not by Vest's styling).
let _chartEl = null;
export function chartFrame() {
  if (_chartEl && _chartEl.isConnected) return _chartEl;
  _chartEl = null;
  for (const f of document.querySelectorAll('iframe'))
    try {
      if (f.contentWindow && f.contentWindow.tradingViewApi) return (_chartEl = f);
    } catch {
      /* another site's frame: not the chart */
    }
  return null;
}
// The chart's drawing area in the window (right of its drawing toolbar, below its top toolbar), or null.
function chartZone() {
  const f = chartFrame();
  if (!f) return null;
  const r = f.getBoundingClientRect();
  if (r.width < CHART_MIN_W || r.height < CHART_MIN_H) return null;
  let left = 52,
    top = 38; // TradingView's usual toolbar sizes, if they can't be measured
  try {
    const doc = f.contentDocument,
      l = doc && doc.querySelector('.layout__area--left'),
      t = doc && doc.querySelector('.layout__area--top');
    if (l) left = l.getBoundingClientRect().width;
    if (t) top = t.getBoundingClientRect().height;
  } catch {
    /* best effort: the usual sizes */
  }
  return { left: r.left + left, top: r.top + top, right: r.right, bottom: r.bottom };
}
// The chart area to dock into: none when floating, when there's no chart, or when the chart is too small to hold the
// panel (then it floats on its own until the chart is big enough: `_autoFloat`).
let _autoFloat = false;
function dockZone() {
  const z = S.dock && S.dock.docked ? chartZone() : null;
  const small = !!z && (z.right - z.left < DOCK_MIN_W || z.bottom - z.top < DOCK_MIN_H);
  if (small !== _autoFloat) {
    _autoFloat = small;
    setTimeout(renderDock, 0);
  }
  return small ? null : z;
}
// Where the panel may be: inside the chart when docked on a page with one, else inside the window.
export function placeBounds() {
  const z = dockZone();
  const box = z || { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, window: true };
  return {
    l: box.left + DOCK_INSET,
    t: box.top + DOCK_INSET,
    r: box.right - DOCK_INSET,
    b: box.bottom - DOCK_INSET,
    zone: z,
  };
}
export function place() {
  const panel = _root && _root.querySelector('.panel');
  if (!panel || !S.dock || _dragging) return;
  const B = placeBounds(),
    d = S.dock,
    open = !panel.classList.contains('collapsed');
  panel.classList.toggle('v-trade', !!S.tradeOpen);
  panel.classList.toggle('docked', !!B.zone);
  const saved = store.get(SIZE_KEY, null) || {};
  const w = open ? clampPx(saved.w || 368, PANEL_MIN_W, Math.min(PANEL_MAX_W, Math.max(PANEL_MIN_W, B.r - B.l))) : 0;
  panel.style.width = open ? w + 'px' : '';
  panel.classList.toggle('narrow', open && w < HDR_FULL_W); // the header drops "COPIER" so its buttons still fit
  const width = open ? w : panel.offsetWidth;
  // its spot: from the chart's corner when docked, else in the window (the first time: top right, as before)
  const want = B.zone
    ? { x: B.zone.left + (d.at ? d.at.x : DOCK_INSET), y: B.zone.top + (d.at ? d.at.y : DOCK_INSET) }
    : d.free || (_autoFloat ? { x: DOCK_INSET, y: DOCK_INSET } : { x: window.innerWidth - width - 16, y: 16 });
  const x = clampPx(want.x, B.l, B.r - width);
  let y;
  if (!open) {
    panel.style.maxHeight = '';
    y = clampPx(want.y, B.t, B.b - panel.offsetHeight);
  } else if (S.tradeOpen) {
    y = clampPx(want.y, B.t, B.b - Math.min(320, B.b - B.t));
    panel.style.maxHeight = Math.max(PANEL_MIN_H, B.b - y) + 'px';
  } else {
    panel.style.maxHeight = Math.max(PANEL_MIN_H, Math.min(saved.h || Infinity, B.b - B.t)) + 'px';
    y = clampPx(want.y, B.t, B.b - panel.offsetHeight);
  }
  Object.assign(panel.style, { left: x + 'px', top: y + 'px', right: 'auto' });
}
// After a drag: remember the spot, from the chart's corner when docked on it, else in the window.
export function rememberSpot() {
  const panel = _root && _root.querySelector('.panel');
  if (!panel) return;
  const r = panel.getBoundingClientRect(),
    z = dockZone();
  if (z) S.dock.at = { x: Math.round(r.left - z.left), y: Math.round(r.top - z.top) };
  else S.dock.free = { x: Math.round(r.left), y: Math.round(r.top) };
  saveDock();
  place();
}
export function setOpen(open) {
  const panel = _root && _root.querySelector('.panel');
  if (!panel) return;
  panel.classList.toggle('collapsed', !open);
  S.dock.open = open;
  saveDock();
  const b = _root.querySelector('[data-act="collapse"]');
  b.setAttribute('aria-expanded', String(open));
  const hdr = _root.querySelector('.hdr');
  if (open) {
    hdr.removeAttribute('tabindex');
    hdr.removeAttribute('role');
  } else {
    hdr.setAttribute('tabindex', '0'); // the pill opens from the keyboard too
    hdr.setAttribute('role', 'button');
  }
  renderDock();
  place();
}
// The pin: docked on the chart, or floating anywhere. Undocking leaves the panel where it is; docking puts it back at
// its spot on the chart.
export function toggleDock() {
  const panel = _root && _root.querySelector('.panel');
  if (!panel) return;
  const r = panel.getBoundingClientRect();
  S.dock.docked = !S.dock.docked;
  if (!S.dock.docked) S.dock.free = { x: Math.round(r.left), y: Math.round(r.top) };
  saveDock();
  renderDock();
  place();
}
// The pin's state, and the pill's dot: red when followers wait on Flatten / Keep or, armed, Vest's live feed is lost;
// amber when Vest updated its site (run the site check).
export const _bootAt = Date.now();
export function renderDock() {
  if (!_root || !S.dock) return;
  const pin = _root.querySelector('[data-act="dock"]');
  pin.classList.toggle('active', S.dock.docked);
  pin.setAttribute('aria-pressed', String(S.dock.docked));
  pin.classList.toggle('auto', S.dock.docked && _autoFloat);
  pin.title = !S.dock.docked
    ? 'Floating: click to dock it on the chart'
    : _autoFloat
      ? 'The chart is too small to hold the panel, so it floats until the chart is bigger. Click to float it for good.'
      : 'Docked on the chart: click to float it anywhere';
  pin.setAttribute('aria-label', S.dock.docked ? 'Detach from the chart' : 'Dock on the chart');
  const orphans = !!(S.orphan && S.orphan.list.length),
    siteOff = siteGate() === 'failed';
  const red = orphans || siteOff || (S.armed && !feedLive() && Date.now() - _bootAt > FEED_QUIET_MS / 5);
  const amber = !red && healthState().changed;
  const panel = _root.querySelector('.panel'),
    dot = _root.querySelector('#attn');
  dot.className = 'attn' + (red ? ' red' : amber ? ' amber' : '');
  dot.title = red
    ? orphans
      ? 'Followers are waiting on Flatten / Keep'
      : siteOff
        ? 'Vest changed something the copier relies on: copying is off'
        : "Vest's live feed is down"
    : amber
      ? 'Vest updated its site: checking'
      : '';
  panel.classList.toggle('attn-red', red);
  panel.classList.toggle('attn-amber', amber);
  const hdr = _root.querySelector('.hdr');
  hdr.setAttribute(
    'aria-label',
    panel.classList.contains('collapsed') ? `Open STRATUH Copier (${_root.querySelector('#armtag').textContent})` : '',
  );
}
// The panel shows on Vest's Trade page only (with the setting on); the copier keeps running on every page. It shows
// anywhere when something needs the trader: followers waiting on Flatten / Keep, or the first-run risk terms.
const onTradePage = () => /^\/(trade(\/|$)|$)/.test(location.pathname); // Vest's root opens the Trade page
export function showOnThisPage() {
  const host = _root && _root.host;
  if (!host) return;
  const show = !S.tradeOnly || onTradePage() || !S.ack || !!(S.orphan && S.orphan.list.length);
  if ((host.style.display !== 'none') === show) return;
  host.style.display = show ? '' : 'none';
  if (show) place();
}
// Keep the panel in place as the page changes: the window resizing at once, and Vest's own layout (the chart, the
// order book, the positions area, a page with no chart) checked a few times a second.
export function watchPlacement() {
  window.addEventListener('popstate', showOnThisPage);
  window.addEventListener('resize', () => place());
  setInterval(() => {
    if (!_root) return;
    showOnThisPage();
    if (_dragging) return;
    removeAutoVolume(chartFrame());
    hideChartMarks(chartFrame());
    hideSessionShading(chartFrame());
    themeChart(chartFrame());
    const f = chartFrame(),
      r = f && f.getBoundingClientRect();
    const key = r ? [r.left, r.top, r.width, r.height].map(Math.round).join() : 'none';
    if (key !== _placeKey) {
      _placeKey = key;
      place();
    }
  }, 400);
}
