import { S } from '../state.js';
import { chartFrame } from './dock.js';
import { _dragging, _root } from './panel.js';

// Changes to Vest's chart: its marks, session shading and auto-added Volume, and its menus over the panel.

// Vest's buy/sell marks on the chart: TradingView's "Hide marks on bars" (its `hideAllMarks` action), which Vest's
// chart forgets on every load. With the setting on, it's switched on once per chart load; showing the marks again from
// the chart's menu is respected until the next load.
let _marksDone = null; // the chart frame the marks were handled for
export const resetChartMarks = () => (_marksDone = null);
export function hideChartMarks(f) {
  if (!S.hideMarks || !f || _marksDone === f) return;
  try {
    const chart = f.contentWindow.tradingViewApi.activeChart();
    if (typeof chart.getCheckableActionState !== 'function') return;
    const hidden = chart.getCheckableActionState('hideAllMarks');
    if (hidden == null) return; // not ready yet: tried again on the next check
    if (!hidden) chart.executeActionById('hideAllMarks');
    _marksDone = f;
  } catch {
    /* the chart isn't ready yet: tried again on the next check */
  }
}
// Vest's session shading (pre-market, after-hours, overnight bands) is a chart indicator it adds named "Market
// Sessions" (on load and when its own setting changes). With the setting on, it's removed whenever it shows up.
const SESSIONS_STUDY = 'Market Sessions';
export function hideSessionShading(f) {
  if (!S.hideSessions || !f) return;
  try {
    const chart = f.contentWindow.tradingViewApi.activeChart();
    if (typeof chart.getAllStudies !== 'function') return;
    for (const st of chart.getAllStudies() || []) if (st && st.name === SESSIONS_STUDY) chart.removeEntity(st.id);
  } catch {
    /* the chart isn't ready yet: tried again on the next check */
  }
}
// TradingView draws its own menus and dialogs (timeframe, chart settings, indicators, symbol search) inside the chart's
// frame, and nothing inside a frame can rise above the panel sitting over it. So while one of them overlaps the panel,
// the panel steps aside (fades out, ignores the mouse) and comes back as soon as it closes.
const TV_POPUPS =
  '[role="menu"], [role="dialog"], [role="listbox"], [data-name="popup-menu-container"], [data-name="menu-inner"]';
function chartPopupOver(pr) {
  const f = chartFrame();
  let doc = null;
  try {
    doc = f && f.contentDocument;
  } catch {
    return false;
  }
  if (!doc || !doc.body) return false;
  const fr = f.getBoundingClientRect();
  for (const el of doc.querySelectorAll(TV_POPUPS)) {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    const l = fr.left + r.left,
      t = fr.top + r.top;
    if (l < pr.right && l + r.width > pr.left && t < pr.bottom && t + r.height > pr.top) return true;
  }
  return false;
}
export const watchChartPopups = () =>
  setInterval(() => {
    const panel = _root && _root.querySelector('.panel');
    if (!panel || _dragging) return;
    panel.classList.toggle('aside', chartPopupOver(panel.getBoundingClientRect())); // fading doesn't move it
  }, 200);
// With the theme on: the Volume indicator Vest adds by itself when the chart loads (only on a chart with no other
// indicators) is removed, once per chart load. One the trader adds afterwards from Indicators stays.
const AUTO_VOLUME_MS = 20000; // Vest adds it as the chart becomes ready: looked for this long after the chart appears
export function removeAutoVolume(f) {
  if (!S.theme || !f || f.__vcVolumeDone) return;
  f.__vcSeenAt = f.__vcSeenAt || Date.now();
  try {
    const chart = f.contentWindow.tradingViewApi.activeChart();
    if (typeof chart.getAllStudies !== 'function') return;
    const vols = (chart.getAllStudies() || []).filter((st) => st && st.name === 'Volume');
    if (vols.length) {
      vols.forEach((st) => chart.removeEntity(st.id));
      f.__vcVolumeDone = true;
    } else if (Date.now() - f.__vcSeenAt > AUTO_VOLUME_MS) f.__vcVolumeDone = true; // Vest didn't add one
  } catch {
    /* the chart isn't ready yet: tried again on the next check */
  }
}
