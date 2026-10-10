import { fmtNum, fmtQty } from '../copier/sizing.js';
import { diag } from '../core/diagnostics.js';
import { S, SYMBOLS } from '../state.js';
import { decimalsOf, roundTick } from './order-math.js';
import { placeTrade } from './orders.js';
import { updateTrade } from './view.js';
import { _root } from '../ui/panel.js';

// A limit price from a click on Vest's chart. The chart is TradingView in a same-origin frame, whose API Vest itself
// uses for its own ticket's Limit: the crosshair's price at a click (the mouse moving at most 3 px between down and
// up), rounded to the tick. The panel listens only while picking, draws the pending order as a line, and sends
// nothing until Place. Typing the price works too, with or without the chart.
const PICK_CLICK_PX = 3;
S.pick = null; // { side, price, chart } while picking a limit price
let _pickOff = null,
  _pickLine = null,
  _pickLineKey = '';
function chartApi() {
  for (const f of document.querySelectorAll('iframe')) {
    try {
      const w = f.contentWindow,
        api = w && w.tradingViewApi;
      if (api && typeof api.activeChart === 'function' && typeof api.subscribe === 'function') return { api, win: w };
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  return null;
}
const onPickKey = (e) => {
  if (e.key === 'Escape' && S.pick) {
    e.preventDefault();
    stopPick();
  }
};
export function startPick(side) {
  if (S.placing || S.adjusting || S.flattening) return;
  stopPick(true);
  S.pick = { side, price: null, chart: false };
  window.addEventListener('keydown', onPickKey, true);
  const tv = chartApi();
  if (tv)
    try {
      const chart = tv.api.activeChart();
      let last = null,
        down = null;
      const move = (d) => (last = d && Number.isFinite(d.price) && d.price > 0 ? d.price : null);
      const dn = (d) => (down = d ? { x: d.clientX, y: d.clientY } : null);
      const up = (d) => {
        const click =
          down && d && Math.abs(d.clientX - down.x) <= PICK_CLICK_PX && Math.abs(d.clientY - down.y) <= PICK_CLICK_PX;
        down = null;
        if (click && last !== null && S.pick) setPickPrice(roundTick(last, SYMBOLS[S.trade.symbol].tick), true);
      };
      chart.crossHairMoved().subscribe(null, move);
      tv.api.subscribe('mouse_down', dn);
      tv.api.subscribe('mouse_up', up);
      tv.win.addEventListener('keydown', onPickKey, true);
      S.pick.chart = chart;
      _pickOff = () => {
        try {
          chart.crossHairMoved().unsubscribe(null, move);
          tv.api.unsubscribe('mouse_down', dn);
          tv.api.unsubscribe('mouse_up', up);
          tv.win.removeEventListener('keydown', onPickKey, true);
        } catch {
          /* best effort: nothing to do if this fails */
        }
      };
    } catch {
      S.pick.chart = false;
    }
  diag('trade_panel', { outcome: 'pick-start', side, chart: !!S.pick.chart });
  updateTrade();
  const el = _root && _root.querySelector('#tr-lpx');
  if (el) {
    el.value = '';
    if (!S.pick.chart) el.focus();
  }
}
export function setPickPrice(p, fromChart) {
  if (!S.pick) return;
  const tick = SYMBOLS[S.trade.symbol].tick,
    n = p / tick;
  // between ticks: a buy rounds down, a sell up, as it will be sent
  if (p > 0)
    p = +((S.pick.side === 'long' ? Math.floor(n + 1e-9) : Math.ceil(n - 1e-9)) * tick).toFixed(decimalsOf(tick));
  S.pick.price = p > 0 ? p : null;
  const el = _root && _root.querySelector('#tr-lpx');
  if (fromChart && el) el.value = S.pick.price ? fmtNum(p, decimalsOf(SYMBOLS[S.trade.symbol].tick)) : '';
  updateTrade();
}
// The pending order on Vest's chart, as a line (TradingView's order line), kept in step with the price and size.
export function drawPickLine(qty) {
  const chart = S.pick && S.pick.chart;
  const key = chart && S.pick.price ? `${S.pick.side}|${S.pick.price}|${qty}` : '';
  if (key === _pickLineKey) return;
  _pickLineKey = key;
  try {
    if (!key) {
      if (_pickLine) _pickLine.remove();
      _pickLine = null;
      return;
    }
    const col = S.pick.side === 'long' ? '#c8f542' : '#ff5a4f';
    if (!_pickLine) _pickLine = chart.createOrderLine();
    _pickLine
      .setPrice(S.pick.price)
      .setText(`${S.pick.side === 'long' ? 'BUY' : 'SELL'} LMT · STRATUH Copier`)
      .setQuantity(qty > 0 ? fmtQty(qty, S.trade.symbol) : '')
      .setLineColor(col)
      .setBodyBorderColor(col)
      .setBodyTextColor('#0c0c0d')
      .setBodyBackgroundColor(col)
      .setQuantityBorderColor(col)
      .setQuantityBackgroundColor('#0c0c0d')
      .setQuantityTextColor(col)
      .setLineStyle(2);
  } catch {
    // the line is a convenience: the panel shows the price either way
  }
}
export function stopPick(quiet) {
  if (_pickOff) _pickOff();
  _pickOff = null;
  if (_pickLine)
    try {
      _pickLine.remove();
    } catch {
      /* best effort: nothing to do if this fails */
    }
  _pickLine = null;
  _pickLineKey = '';
  window.removeEventListener('keydown', onPickKey, true);
  if (!S.pick) return;
  S.pick = null;
  if (!quiet) updateTrade();
}
export async function placePick() {
  if (!S.pick || !(S.pick.price > 0)) return;
  const { side, price } = S.pick;
  if (await placeTrade(side, price)) stopPick();
}
