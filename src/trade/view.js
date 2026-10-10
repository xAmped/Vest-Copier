import { accLabel } from '../accounts/registry.js';
import { fmtNum, fmtQty } from '../copier/sizing.js';
import { saveTrade } from '../core/settings.js';
import { loadSymbolRules, recentAt, symLabel, watchPrice } from '../market/prices.js';
import { followVestMarket } from '../market/vest-market.js';
import { S, SYMBOLS } from '../state.js';
import { endPlan } from './breakeven-plans.js';
import { fmtPx, fmtUsd, refreshTradeState, tradeCalc } from './calc.js';
import { drawPickLine, placePick, setPickPrice, startPick, stopPick } from './chart-pick.js';
import { breakevenNow, breakevenPlan, closeNow, reduceNow } from './manage.js';
import { breakevenPrice, decimalsOf, floorStep, planPrices, roundTick } from './order-math.js';
import { placeTrade } from './orders.js';
import { esc, money } from '../ui/format.js';
import { _root } from '../ui/panel.js';

// Trade tab: drawing the ticket and keeping its numbers up to date.

export function renderTrade(body) {
  if (body.dataset.view === 'trade' && body.querySelector('.trade')) return updateTrade();
  body.dataset.view = 'trade';
  const t = S.trade;
  const seg = (key, opts) =>
    `<div class="seg" data-seg="${key}">${opts.map(([v, l]) => `<button data-v="${v}">${l}</button>`).join('')}</div>`;
  body.innerHTML = `
      <div class="trade">
        <div class="tr-top">
          <div class="tr-sym" id="tr-sym"></div>
          <div class="tr-px" id="tr-px">—</div>
        </div>
        <div class="tr-poscard" id="tr-pos" hidden>
          <div class="tr-posbar"><span class="tr-side" id="tr-pside"></span><span class="tr-pq" id="tr-pqty"></span><span class="tr-ppl" id="tr-ppl"></span></div>
          <div class="tr-pmeta"><span id="tr-pavg"></span><span id="tr-ppts"></span></div>
          <div class="tr-lvls" id="tr-lvls"></div>
          <div class="tr-prisk" title="What the stop would lose from here, fees included, against the room left before the floor (tightest account)">
            <div class="tr-pn"><span>Risk</span><span id="tr-prisk"></span></div><div class="tr-track"><i id="tr-prnow"></i></div></div>
        </div>
        <div class="tr-pacts" id="tr-pacts" hidden>
          <div class="tr-go"><button class="tr-bebtn" id="tr-be">Breakeven</button><button class="tr-close" id="tr-close">Close</button></div>
          <div class="tr-addrow"><span class="tr-k">Scale</span><div class="tr-chips" id="tr-chips"></div></div>
          <div class="tr-go tr-scale"><button class="tr-buy" id="tr-addbtn">Add</button><button class="tr-redbtn" id="tr-reduce">Reduce</button></div>
          <div class="tr-addpv" id="tr-addpv"></div>
        </div>
        <div class="tr-lims" id="tr-lims">
          <div class="tr-lb"><div class="tr-ln"><span class="tr-lk">Margin</span><span class="tr-lt" id="tr-mtxt"></span></div>
            <div class="tr-track"><i class="pv" id="tr-mpv"></i><i id="tr-mnow"></i></div></div>
          <div class="tr-lb"><div class="tr-ln"><span class="tr-lk">Risk</span><span class="tr-lt" id="tr-rtxt"></span></div>
            <div class="tr-track"><i class="pv" id="tr-rpv"></i><i id="tr-rnow"></i></div></div>
          <div class="tr-tight" id="tr-tight"></div>
        </div>
        <div class="tr-setup" id="tr-setup">
          <div class="tr-f"><span class="tr-k">Size</span><div class="tr-row">${seg('sizeMode', [
            ['qty', 'Qty'],
            ['risk', 'Risk $'],
            ['max', 'Max'],
          ])}<input class="tr-in" id="tr-size" inputmode="decimal" aria-label="Size"><span class="tr-sizeq" id="tr-sizeq"></span></div></div>
          <div class="tr-ind">
            <div class="tr-calc" id="tr-sizecalc"></div>
            <div class="tr-lim" id="tr-sizelim"></div>
          </div>
          <div class="tr-f"><span class="tr-k">Targets</span><div class="tr-row">${seg('scale', [
            ['start', 'Start'],
            ['even', 'Even'],
            ['end', 'End'],
          ])}<button class="tr-add" id="tr-add" title="Add a target">+</button></div></div>
          <div class="tr-lad" role="table" aria-label="Stop, entry and targets">
            <div class="tr-lh"><span id="tr-lhs">Sell</span><span id="tr-lhm">pts · qty · $</span><span id="tr-lhb">Buy</span></div>
            <div class="tr-lr tr-ps" id="tr-passrow"><span class="tr-sp" id="ls-pass"></span><span class="tr-mid">Pass</span><span class="tr-bp" id="lb-pass"></span></div>
            <div id="tr-targets"></div>
            <div class="tr-lr tr-mk" id="tr-mkrow" hidden><span class="tr-sp"></span><span class="tr-mid" id="tr-mk">Price</span><span class="tr-bp" id="lb-mk"></span></div>
            <div class="tr-lr tr-en"><span class="tr-sp" id="ls-entry"></span><span class="tr-mid" id="tr-entry">Entry</span><span class="tr-bp" id="lb-entry"></span></div>
            <div class="tr-lr tr-slr"><span class="tr-sp" id="ls-stop"></span><span class="tr-mid"><span class="tr-n sl">STOP</span>
              <input class="tr-in tr-pt" id="tr-stop" inputmode="decimal" aria-label="Stop, in points" value="${esc(t.stopPts)}">
              <span class="tr-q" id="tr-stopq"></span><span class="tr-g dn" id="tr-stopcalc"></span><span class="tr-xs"></span></span><span class="tr-bp" id="lb-stop"></span></div>
            <div class="tr-lr tr-fl" id="tr-failrow"><span class="tr-sp" id="ls-fail"></span><span class="tr-mid">Fail</span><span class="tr-bp" id="lb-fail"></span></div>
          </div>
          <div class="tr-lim" id="tr-stoplim"></div>
          <div class="tr-f"><span class="tr-k">Auto BE</span><div class="tr-row">${seg('beMode', [
            ['off', 'Off'],
            ['tp1', 'After TP1'],
            ['points', '+pts'],
          ])}<span class="tr-be">
            <span id="tr-betrigw">at <input class="tr-in sm" id="tr-betrig" inputmode="decimal" aria-label="Breakeven trigger, in points" value="${esc(t.beTrigger)}"></span>
            lock <input class="tr-in sm" id="tr-beoff" inputmode="decimal" aria-label="Profit to lock, in points" title="Points of profit beyond the entry (0 = exact breakeven)" value="${esc(t.beOffset)}"></span></div></div>
          <div class="tr-sum" id="tr-sum"></div>
        </div>
        <div class="tr-warn" id="tr-warn"></div>
        <div class="tr-action">
          <div class="tr-err" id="tr-err"></div>
          <div class="tr-who" id="tr-who"></div>
          <div class="tr-go" id="tr-mgo"><button class="tr-buy" id="tr-buy">Buy</button><button class="tr-sell" id="tr-sell">Sell</button></div>
          <div class="tr-go tr-lgo" id="tr-lgo">
            <button class="tr-lbuy" id="tr-lbuy" title="Buy limit: click Vest's chart for the price, or type it"><svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1v4M8 11v4M1 8h4M11 8h4" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/></svg> Buy LMT</button>
            <button class="tr-lsell" id="tr-lsell" title="Sell limit: click Vest's chart for the price, or type it"><svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1v4M8 11v4M1 8h4M11 8h4" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/></svg> Sell LMT</button></div>
          <div class="tr-pick" id="tr-pick" hidden>
            <div class="tr-pickbar"><span id="tr-picktxt"></span><span class="tr-esc">Esc to cancel</span></div>
            <div class="tr-pickrow"><input class="tr-in" id="tr-lpx" inputmode="decimal" aria-label="Limit price" placeholder="price">
              <button class="tr-place" id="tr-place">Place</button><button class="tr-pcancel" id="tr-pcancel">Cancel</button></div>
          </div>
        </div>
        <div class="tr-preview" id="tr-preview" hidden></div>
        <div class="tr-plans" id="tr-plans"></div>
      </div>`;
  const wrap = body.querySelector('.trade');
  ['keydown', 'keyup', 'keypress'].forEach((ev) => wrap.addEventListener(ev, (e) => e.stopPropagation()));
  // A field that isn't a number is kept as '' (shown as an error), never as NaN.
  const parse = (el) => {
    const v = el.value.trim();
    return v !== '' && Number.isFinite(+v) ? +v : '';
  };
  const num = (el, key) =>
    el.addEventListener('input', () => {
      S.trade[key] = parse(el);
      saveTrade();
      updateTrade();
    });
  const sizeEl = body.querySelector('#tr-size');
  sizeEl.value = t.sizeMode === 'risk' ? t.risk : t.qty;
  sizeEl.addEventListener('input', () => {
    S.trade[S.trade.sizeMode === 'risk' ? 'risk' : 'qty'] = parse(sizeEl) || 0;
    saveTrade();
    updateTrade();
  });
  num(body.querySelector('#tr-stop'), 'stopPts');
  num(body.querySelector('#tr-betrig'), 'beTrigger');
  num(body.querySelector('#tr-beoff'), 'beOffset');
  body.querySelectorAll('[data-seg]').forEach((g) =>
    g.querySelectorAll('button').forEach(
      (b) =>
        (b.onclick = () => {
          S.trade[g.dataset.seg] = b.dataset.v;
          saveTrade();
          if (g.dataset.seg === 'sizeMode') sizeEl.value = S.trade.sizeMode === 'risk' ? S.trade.risk : S.trade.qty;
          updateTrade();
        }),
    ),
  );
  body.querySelector('#tr-add').onclick = () => {
    const last = +S.trade.targets[S.trade.targets.length - 1] || 0;
    S.trade.targets.push(last ? last + (+S.trade.targets[0] || DEFAULT_TARGET_PTS) : DEFAULT_TARGET_PTS);
    saveTrade();
    renderTargets(body);
    updateTrade();
  };
  body.querySelector('#tr-buy').onclick = () => placeTrade('long');
  body.querySelector('#tr-sell').onclick = () => placeTrade('short');
  body.querySelector('#tr-be').onclick = () => breakevenNow();
  body.querySelector('#tr-lbuy').onclick = () => startPick('long');
  body.querySelector('#tr-lsell').onclick = () => startPick('short');
  body.querySelector('#tr-place').onclick = () => placePick();
  body.querySelector('#tr-pcancel').onclick = () => stopPick();
  const lpx = body.querySelector('#tr-lpx');
  lpx.addEventListener('input', () => setPickPrice(parse(lpx), false));
  body.querySelector('#tr-close').onclick = () => closeNow();
  body.querySelector('#tr-addbtn').onclick = () => {
    const h = tradeCalc().held;
    if (h) placeTrade(h.side); // same direction while holding: an add
  };
  body.querySelector('#tr-reduce').onclick = () => reduceNow();
  renderTargets(body);
  followVestMarket();
  watchPrice(t.symbol);
  loadSymbolRules(t.symbol).then(updateTrade);
  refreshTradeState();
  updateTrade();
}

const DEFAULT_TARGET_PTS = 20;
function renderTargets(body) {
  const box = body.querySelector('#tr-targets');
  // ladder rows, farthest target on top (Buy prices rise up the right column, Sell prices fall down the left)
  box.innerHTML = S.trade.targets
    .map(
      (p, i) => `
      <div class="tr-lr tr-tgt"><span class="tr-sp" id="ls-t${i}"></span><span class="tr-mid"><span class="tr-n">TP${i + 1}</span>
        <input class="tr-in tr-pt" data-t="${i}" inputmode="decimal" aria-label="Target ${i + 1}, in points" value="${esc(p)}">
        <span class="tr-q" id="tq${i}"></span><span class="tr-g" id="tg${i}"></span>
        <button class="tr-x" data-del="${i}" title="Remove target ${i + 1}" aria-label="Remove target ${i + 1}"
          ${S.trade.targets.length < 2 ? 'disabled' : ''}>×</button></span><span class="tr-bp" id="lb-t${i}"></span></div>`,
    )
    .reverse()
    .join('');
  box.querySelectorAll('[data-t]').forEach((el) =>
    el.addEventListener('input', () => {
      const v = el.value.trim();
      S.trade.targets[+el.dataset.t] = v !== '' && Number.isFinite(+v) ? +v : '';
      saveTrade();
      updateTrade();
    }),
  );
  box.querySelectorAll('[data-del]').forEach(
    (b) =>
      (b.onclick = () => {
        S.trade.targets.splice(+b.dataset.del, 1);
        saveTrade();
        renderTargets(body);
        updateTrade();
      }),
  );
}

export function updateTrade() {
  const body = _root && _root.querySelector('.body');
  if (!body || body.dataset.view !== 'trade' || !body.querySelector('.trade')) return;
  const c = tradeCalc(),
    $ = (id) => body.querySelector('#' + id);
  const set = (id, v) => {
    const el = $(id);
    if (el && el.textContent !== v) el.textContent = v;
  };
  const symHtml = `${esc(c.meta.label)}${c.lev ? ` <span class="chip" title="Leverage on ${esc(c.t.symbol)}">${c.lev}x</span>` : ''}`;
  if ($('tr-sym').dataset.html !== symHtml) $('tr-sym').innerHTML = $('tr-sym').dataset.html = symHtml;
  $('tr-px').textContent = fmtPx(c.price, c.meta.tick);
  const pr = S.price[c.t.symbol] || {},
    fp = (n) => fmtPx(n, c.meta.tick);
  $('tr-px').title =
    [
      recentAt(pr.bookAt) && `Mid of the book (bid ${fp(pr.bid)} · ask ${fp(pr.ask)})`,
      recentAt(pr.lastAt) && `last trade ${fp(pr.last)}`,
      recentAt(pr.at) && `mark ${fp(pr.px)}`,
    ]
      .filter(Boolean)
      .join(' · ') || 'Waiting for a live price';
  body
    .querySelectorAll('[data-seg]')
    .forEach((g) =>
      g.querySelectorAll('button').forEach((b) => b.classList.toggle('on', S.trade[g.dataset.seg] === b.dataset.v)),
    );
  $('tr-size').style.display = c.t.sizeMode === 'max' ? 'none' : '';
  const maxNote =
    c.maxQty === null
      ? ''
      : `Vest's 100% at ${c.lev}x${c.limitedBy && c.limitedBy !== S.master ? `, limited by ${accLabel(c.limitedBy)}` : ''}`;
  set(
    'tr-sizecalc',
    c.pick
      ? `Add uses ${c.pick.label} (${fmtQty(c.qty, c.t.symbol)}): click it again for this size`
      : c.t.sizeMode === 'max' && c.qty > 0
        ? `= ${fmtQty(c.qty, c.t.symbol)} contracts · ${maxNote}`
        : '',
  );
  set(
    'tr-sizeq',
    c.qty > 0 && c.t.sizeMode !== 'max'
      ? c.t.sizeMode === 'risk'
        ? `= ${fmtQty(c.qty, c.t.symbol)} ct`
        : +c.t.stopPts > 0
          ? `${fmtUsd(c.risk)} at stop`
          : ''
      : '',
  );
  $('tr-stopcalc').textContent = c.qty > 0 && +c.t.stopPts > 0 ? `−${fmtUsd(c.risk)}` : '';
  // The allowed range, live: how much can be risked and where the stop may go on this account right now
  const L = c.limits,
    stopNow = +c.t.stopPts || 0,
    room = L.maxRiskRoom !== null ? ` · ${money(L.maxRiskRoom)} max before the floor` : '';
  let sizeLim = '',
    stopLim = '',
    stopBad = false;
  if (c.t.sizeMode === 'risk') {
    if (L.maxRiskAtStop !== null && stopNow > 0)
      sizeLim = `Can risk up to ${money(L.maxRiskAtStop)} at ${stopNow} pts${room}`;
    if (L.minStop !== null && +c.t.risk > 0) {
      stopBad = stopNow > 0 && stopNow < L.minStop;
      stopLim = `Stop must be at least ${L.minStop} pts to risk ${money(+c.t.risk)}`;
    }
  } else if (c.maxQty !== null && c.t.sizeMode === 'qty') {
    sizeLim = `Up to ${fmtQty(c.maxQty, c.t.symbol)} contracts at ${c.lev}x${room}`;
  }
  if (c.t.sizeMode !== 'risk' && L.maxStop !== null && c.qty > 0) {
    stopBad = stopNow >= L.maxStop;
    stopLim = `Stop must be under ${L.maxStop} pts at ${fmtQty(c.qty, c.t.symbol)} contracts, or the account fails first`;
  }
  set('tr-sizelim', sizeLim);
  set('tr-stoplim', stopLim);
  $('tr-stoplim').classList.toggle('bad', stopBad);
  // these lines only show when the limit bites, or nearly does (within 20%)
  const NEAR = 0.8;
  const sizeNear =
    !!c.blocked ||
    (c.t.sizeMode === 'risk'
      ? (L.maxRiskAtStop !== null && +c.t.risk > L.maxRiskAtStop * NEAR) ||
        (L.maxRiskRoom !== null && +c.t.risk > L.maxRiskRoom * NEAR)
      : c.t.sizeMode === 'qty' && c.maxQty !== null && c.qty > c.maxQty * NEAR);
  const stopNear =
    stopBad ||
    (c.t.sizeMode === 'risk'
      ? L.minStop !== null && stopNow < L.minStop / NEAR
      : L.maxStop !== null && stopNow > L.maxStop * NEAR);
  $('tr-sizelim').classList.toggle('quiet', !sizeNear);
  $('tr-stoplim').classList.toggle('quiet', !stopNear);
  c.t.targets.forEach((p, i) => {
    const q = c.qtys[i],
      qe = $('tq' + i),
      ge = $('tg' + i);
    if (qe) qe.textContent = q ? fmtQty(q, c.t.symbol) : '—';
    if (ge) ge.textContent = q ? '+' + fmtUsd(q * (+p || 0) * c.meta.pointValue) : '';
  });
  $('tr-betrigw').style.display = c.t.beMode === 'points' ? '' : 'none';
  body.querySelector('.tr-be').style.display = c.t.beMode === 'off' ? 'none' : '';
  // in a trade the setup (size, stop, targets, Auto BE for a new trade) is put away: Scale and the trade's own
  // stop and targets apply
  const held = !!c.held;
  $('tr-setup').hidden = held;
  $('tr-lims').hidden = held;
  $('tr-pacts').hidden = !held;
  $('tr-sum').innerHTML =
    c.qty > 0 && c.qtys.length
      ? `${c.held ? 'This add · ' : ''}Risk <b>${fmtUsd(c.risk)}</b>${c.fees > 0 ? ` + ${fmtUsd(c.fees)} fees` : ''} · Reward <b>${fmtUsd(c.reward)}</b> · <b>${c.risk > 0 ? (c.reward / c.risk).toFixed(2) : '—'}R</b>`
      : '';
  set(
    'tr-lhm',
    !c.held && c.qty > 0 && c.qtys.length && c.risk > 0
      ? `risk ${fmtUsd(c.risk)} · ${(c.reward / c.risk).toFixed(2)}R`
      : 'pts · qty · $',
  );
  $('tr-lhm').title = $('tr-sum').textContent;
  const fixHtml = c.fixes
    .map(
      (f, i) =>
        `<button class="tr-usemax" data-fix="${i}" data-act="${f.act === 'max' ? 'usemax' : 'fix-' + f.act}">${esc(f.label)}</button>`,
    )
    .join(' ');
  // In a trade, warnings and errors about the next add go on the status line under the add buttons instead (below).
  const warnHtml = c.held
    ? ''
    : (c.blocked
        ? `<div class="tr-block">${esc(c.blocked)}${fixHtml ? `<div class="tr-fixes">${fixHtml}</div>` : ''}</div>`
        : '') + c.warnings.map((w) => `<div>${esc(w.text)}</div>`).join('');
  const warnBox = $('tr-warn');
  if (warnBox.dataset.html !== warnHtml) {
    // rewrite only on change, so a click on a fix isn't lost to a price tick
    warnBox.dataset.html = warnHtml;
    warnBox.innerHTML = warnHtml;
    warnBox.querySelectorAll('[data-fix]').forEach((b) => {
      const f = c.fixes[+b.dataset.fix];
      b.onclick = () => {
        if (f.act === 'max') S.trade.sizeMode = 'max';
        else if (f.act === 'stop') {
          S.trade.stopPts = f.value;
          $('tr-stop').value = f.value;
        } else if (f.act === 'risk') {
          S.trade.risk = f.value;
          $('tr-size').value = f.value;
        }
        saveTrade();
        updateTrade();
      };
    });
  }
  $('tr-err').textContent = c.held
    ? ''
    : c.error ||
      (c.blocked ? 'Over what the account can open: use a fix above, or change the size or stop.' : '') ||
      (S.adjusting ? 'Adjusting stop & targets…' : '');
  const q = c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '';
  const h = c.held,
    busy = !!S.placing || !!S.adjusting || !!S.flattening || !!S.arming;
  const nf = S.armed ? S.followers.size : 0;
  $('tr-who').textContent = S.master
    ? `On ${accLabel(S.master)}${nf ? ` · copies to ${nf} follower${nf > 1 ? 's' : ''}` : ' · not copied (disarmed)'}`
    : '';
  $('tr-buy').textContent = h && h.side === 'long' ? `Add ${q}` : `Buy ${q}`;
  $('tr-sell').textContent = h && h.side === 'short' ? `Add ${q}` : `Sell ${q}`;
  $('tr-buy').hidden = !!h && h.side !== 'long';
  $('tr-sell').hidden = !!h && h.side !== 'short';
  $('tr-buy').disabled = $('tr-sell').disabled = !!c.error || !!c.blocked || busy;
  $('tr-pos').hidden = !h;
  // limits: a new trade only, so the limit row shows when flat; while picking, the pick replaces both rows
  if (h && S.pick) stopPick(true);
  const pk = S.pick;
  $('tr-mgo').hidden = !!pk || !!h; // in a trade, ADD and REDUCE sit under the Scale chips
  $('tr-lgo').hidden = !!h || !!pk;
  $('tr-lbuy').disabled = $('tr-lsell').disabled = !!c.error || !!c.blocked || busy;
  $('tr-pick').hidden = !pk;
  if (pk) {
    const lp = pk.price,
      wrongSide = lp > 0 && c.price > 0 && (pk.side === 'long' ? lp >= c.price : lp <= c.price);
    set(
      'tr-picktxt',
      wrongSide
        ? `A ${pk.side === 'long' ? 'buy' : 'sell'} limit goes ${pk.side === 'long' ? 'below' : 'above'} the mark`
        : pk.chart
          ? "Click Vest's chart to set the price"
          : 'Type the limit price',
    );
    $('tr-picktxt').className = wrongSide ? 'bad' : '';
    $('tr-place').textContent =
      lp > 0
        ? `Place ${pk.side === 'long' ? 'Buy' : 'Sell'} LMT ${q} @ ${fmtPx(lp, c.meta.tick)}`
        : `Place ${pk.side === 'long' ? 'Buy' : 'Sell'} LMT`;
    $('tr-place').className = 'tr-place ' + pk.side;
    $('tr-place').disabled = !(lp > 0) || wrongSide || !!c.error || !!c.blocked || busy;
    drawPickLine(c.qty);
  }
  if (h) {
    const tick = c.meta.tick,
      dir = h.side === 'long' ? 1 : -1;
    const pnl = c.price > 0 ? dir * h.qty * (c.price - h.openPrice) * c.meta.pointValue : null;
    const entry = [...Object.values(S.posMap)].find((e) => e.symbol === h.symbol && e.master === S.master);
    const accts = S.armed && entry ? 1 + Object.keys(entry.followers || {}).length : 1;
    set('tr-pside', h.side === 'long' ? 'Long' : 'Short');
    $('tr-pside').className = 'tr-side ' + h.side;
    set('tr-pqty', `${fmtQty(h.qty, h.symbol)} ${c.meta.label}`);
    set('tr-pavg', `avg ${fmtPx(h.openPrice, tick)} · ${accts} account${accts === 1 ? '' : 's'}`);
    const ptsNow = c.price > 0 ? dir * (c.price - h.openPrice) : null;
    set(
      'tr-ppts',
      ptsNow === null ? '' : `${ptsNow >= 0 ? '+' : '−'}${fmtNum(Math.abs(ptsNow), decimalsOf(tick))} pts`,
    );
    // where the stop and targets sit on Vest now (the stop with what it makes or loses from the average)
    const legs = (h.triggers || []).slice().sort((a, b) => dir * (a.price - b.price));
    const sls = legs.filter((l) => l.kind === 'sl'),
      tps = legs.filter((l) => l.kind === 'tp');
    const lvHtml =
      sls
        .map((l) => {
          const v = dir * (l.price - h.openPrice) * h.qty * c.meta.pointValue;
          return `<span class="tr-lv sl">SL <b>${fmtPx(l.price, tick)}</b><i>${v >= 0 ? '+' : '−'}${fmtUsd(v)}</i></span>`;
        })
        .join('') +
        tps.map((l, i) => `<span class="tr-lv tp">TP${i + 1} <b>${fmtPx(l.price, tick)}</b></span>`).join('') ||
      '<span class="tr-lv none">No stop or targets on this position</span>';
    const lvBox = $('tr-lvls');
    if (lvBox.dataset.html !== lvHtml) lvBox.innerHTML = lvBox.dataset.html = lvHtml;
    const K2 = c.risk2,
      usd2 = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
    const frac = K2.room > 0 && K2.now !== null ? K2.now / K2.room : 0;
    $('tr-prnow').style.width = Math.max(0, Math.min(100, frac * 100)).toFixed(1) + '%';
    $('tr-prnow').className = frac >= 1 ? 'hot' : frac >= 0.8 ? 'warn' : '';
    $('tr-prisk').innerHTML =
      K2.now === null
        ? '<span class="warn">no stop on this position</span>'
        : K2.room > 0
          ? `<b>${usd2(K2.now)}</b> of ${usd2(K2.room)} · <span class="${frac >= 0.8 ? 'warn' : 'ok'}">${usd2(K2.room - K2.now)} left</span>`
          : '';
    set('tr-ppl', pnl === null ? '' : (pnl >= 0 ? '+' : '−') + fmtUsd(pnl));
    $('tr-ppl').className = 'tr-ppl ' + (pnl === null ? '' : pnl >= 0 ? 'pos' : 'neg');
    const be = breakevenPlan(h, c.price, tick);
    $('tr-be').textContent = be.price > 0 ? `Breakeven ${fmtPx(be.price, tick)}` : 'Breakeven';
    $('tr-be').disabled = busy || !!be.why;
    $('tr-be').title = be.why || `Move the stop to ${fmtPx(be.price, tick)}, your average entry`;
    $('tr-close').textContent = `Close ${fmtQty(h.qty, h.symbol)}`;
    $('tr-close').disabled = busy;
    // Scale chips: a share of the position (or MAX, adds only) that sizes both ADD and REDUCE; one is always picked
    const key = (c.pick && c.pick.key) || '25',
      step = c.meta.step;
    const redQ = key === '100' ? h.qty : key === 'max' ? 0 : floorStep(h.qty * (key === '50' ? 0.5 : 0.25), step);
    const chipsHtml = (c.chips || [])
      .map((x) => {
        const off = x.key === 'max' ? 'adds only' : `reduce ${fmtQty(x.key === '100' ? h.qty : x.qty, h.symbol)}`;
        const tip = `${x.label === 'MAX' ? 'MAX' : x.label + '%'}: add ${fmtQty(x.qty, h.symbol)}${x.why ? ` (${x.why})` : ''} · ${off}`;
        return `<button class="tr-chip${key === x.key ? ' on' : ''}${x.why ? ' no' : ''}" data-add="${x.key}" ${busy ? 'disabled' : ''}
              title="${esc(tip)}"><b>${x.label}</b><span>${esc(x.why || fmtQty(x.qty, h.symbol))}</span></button>`;
      })
      .join('');
    const box = $('tr-chips');
    if (box.dataset.html !== chipsHtml) {
      box.dataset.html = chipsHtml;
      box.innerHTML = chipsHtml;
      box.querySelectorAll('[data-add]').forEach(
        (b) =>
          (b.onclick = () => {
            S.addPick = b.dataset.add;
            updateTrade();
          }),
      );
    }
    const addBtn = $('tr-addbtn'),
      redBtn = $('tr-reduce');
    addBtn.className = h.side === 'long' ? 'tr-buy' : 'tr-sell';
    addBtn.textContent = c.qty > 0 ? `Add ${fmtQty(c.qty, h.symbol)}` : 'Add';
    addBtn.disabled = busy || !!c.error || !!c.blocked || !(c.qty > 0);
    addBtn.title =
      c.pick && c.pick.why
        ? `Add: ${c.pick.why}`
        : `Add ${fmtQty(c.qty, h.symbol)} to the ${h.side}${S.armed ? ' (the copier adds to each follower, scaled)' : ''}. The stop and targets stay where they are.`;
    redBtn.textContent = key === '100' ? 'Reduce all' : redQ > 0 ? `Reduce ${fmtQty(redQ, h.symbol)}` : 'Reduce';
    redBtn.disabled = busy || key === 'max' || !(redQ > 0);
    redBtn.title =
      key === 'max'
        ? 'MAX is for adds: pick 25, 50 or 100 to reduce'
        : key === '100'
          ? `Close the whole ${fmtQty(h.qty, h.symbol)}${S.armed ? ' (the copier closes the followers)' : ''}`
          : `Take ${fmtQty(redQ, h.symbol)} off at market${S.armed ? ' (the copier reduces each follower by the same share)' : ''}. The stop and targets stay where they are.`;
    const addQ = c.qty > 0 ? c.qty : 0,
      tot = h.qty + addQ;
    const avgA = tot > 0 ? (h.qty * h.openPrice + addQ * c.price) / tot : 0;
    const o = c.sides[h.side];
    // One status line under the add buttons that is always there and never wraps, so nothing moves as the open P&L
    // swings a warning on and off: what the add would do, or the most important reason it can't or shouldn't go
    // (the full sentence is the tooltip).
    const addTxt = fmtQty(addQ, h.symbol);
    let pvHtml = '',
      pvTitle = '';
    if (c.error) [pvHtml, pvTitle] = [`<span class="warn">${esc(c.error)}</span>`, c.error];
    else if (c.blocked) {
      const max = fmtQty(c.maxQty, c.t.symbol);
      pvHtml = `<span class="hot">Add ${esc(addTxt)}: over ${esc(accLabel(c.limitedBy))}'s max (${esc(max)})</span>`;
      pvTitle = `Add ${addTxt}: more than ${accLabel(c.limitedBy)} can open (max ${max}). Pick a smaller add.`;
    } else if (c.warnings.length && o && o.loss > 0) {
      pvHtml = `<span class="warn">Add ${esc(addTxt)}: stop-out ${fmtUsd(o.loss)}, ${fmtUsd(o.room)} left</span>`;
      pvTitle = `Add ${addTxt}: a stop-out after it would lose about ${fmtUsd(o.loss)} with fees, more than the ${fmtUsd(o.room)} left to the floor.`;
    } else if (addQ > 0 && c.price > 0) {
      pvHtml = `<span>→ <b>${fmtQty(tot, h.symbol)}</b> · avg <b>${fmtPx(avgA, tick)}</b></span>${o && o.loss > 0 ? `<span>stop-out <b>${fmtUsd(o.loss)}</b></span>` : ''}`;
      pvTitle =
        'After this add: the new size and average, and what a stop-out would then cost. The stop and targets stay where they are.';
    }
    if ($('tr-addpv').dataset.html !== pvHtml) $('tr-addpv').innerHTML = $('tr-addpv').dataset.html = pvHtml;
    $('tr-addpv').title = pvTitle;
  } else if (S.addPick) S.addPick = null; // flat again: chips reset
  // The ladder: Buy prices on the right, Sell prices on the left, from the live mark (re-placed from the fill).
  const ok = !c.error && c.price > 0;
  const px = (n) => (ok && n > 0 ? fmtPx(roundTick(n, c.meta.tick), c.meta.tick) : '—');
  const h2 = c.held,
    lad = body.querySelector('.tr-lad');
  const pk2 = !h2 && S.pick && S.pick.price > 0 ? S.pick : null;
  lad.classList.toggle('one', !!h2 || !!pk2);
  set('tr-lhs', h2 || pk2 ? '' : 'Sell at');
  set('tr-lhb', h2 ? 'Price' : pk2 ? (pk2.side === 'long' ? 'Buy at' : 'Sell at') : 'Buy at');
  $('tr-mkrow').hidden = !(h2 || pk2) || !ok;
  if (pk2) {
    // a limit: its stop and targets measured from the limit price (it fills there or better)
    const lv = planPrices({
      side: pk2.side,
      entry: pk2.price,
      stopPts: +c.t.stopPts,
      targetPts: c.t.targets.map(Number),
      tick: c.meta.tick,
    });
    c.t.targets.forEach((_, i) => set('lb-t' + i, px(lv.targets && lv.targets[i])));
    set('lb-stop', px(lv.stop));
    set('lb-entry', px(pk2.price));
    set('tr-entry', c.qty > 0 ? `Limit · ${fmtQty(c.qty, c.t.symbol)}` : 'Limit');
    set('tr-stopq', c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '');
    const away = Math.abs(c.price - pk2.price);
    set('tr-mk', `Price · ${fmtNum(away, decimalsOf(c.meta.tick))} pts away`);
    set('lb-mk', px(c.price));
    $('tr-failrow').hidden = $('tr-passrow').hidden = true; // measured from the mark: not for a resting limit
  } else if (h2) {
    // in a trade the ladder (part of the setup for a new trade) is put away: the trade keeps its own stop and targets
  } else {
    c.t.targets.forEach((_, i) => {
      set('lb-t' + i, px(c.long.targets && c.long.targets[i]));
      set('ls-t' + i, px(c.short.targets && c.short.targets[i]));
    });
    set('lb-stop', px(c.long.stop));
    set('ls-stop', px(c.short.stop));
    set('lb-entry', px(c.price));
    set('ls-entry', px(c.price));
    set('tr-entry', c.qty > 0 ? `Entry · ${fmtQty(c.qty, c.t.symbol)}` : 'Entry');
    set('tr-stopq', c.qty > 0 ? fmtQty(c.qty, c.t.symbol) : '');
    const sl = c.sides.long,
      ss = c.sides.short;
    set('lb-fail', px(sl && sl.fail));
    set('ls-fail', px(ss && ss.fail));
    set('lb-pass', px(sl && sl.pass));
    set('ls-pass', px(ss && ss.pass));
    $('tr-failrow').hidden = !ok || !((sl && sl.fail) || (ss && ss.fail));
    $('tr-passrow').hidden = !ok || !((sl && sl.pass) || (ss && ss.pass));
  }
  const note =
    "Prices are from the market now (the mid of Vest's order book); stop and targets are re-placed your exact points from your fill. Adding to an " +
    'open trade rebuilds them from the new average.' +
    (!$('tr-failrow').hidden
      ? " Fail and pass: where your equity reaches the floor or the target, opening fee counted. Estimates, like Vest's own."
      : '');
  set('tr-preview', note);
  body.querySelector('.tr-lad').title = note;

  // Margin and risk bars
  const pct100 = (f) => Math.max(0, Math.min(100, f * 100)).toFixed(1) + '%';
  const M = c.margin,
    K = c.risk2,
    mnow = $('tr-mnow'),
    mpv = $('tr-mpv'),
    rnow = $('tr-rnow'),
    rpv = $('tr-rpv');
  const heat = (f) => (f >= 1 ? ' hot' : f >= 0.8 ? ' warn' : '');
  if (M) {
    mnow.style.width = pct100(M.now);
    mpv.style.width = pct100(M.after);
    mpv.className = 'pv' + heat(M.after);
    mnow.className = heat(M.now).trim();
    const used = (f) => Math.round(f * 100) + '%';
    // contracts left, to sensible precision (25.5, 3.75, 0.43)
    const short = (n) =>
      String(+(Math.floor(n * (n >= 100 ? 1 : n >= 10 ? 10 : 100)) / (n >= 100 ? 1 : n >= 10 ? 10 : 100)));
    $('tr-mtxt').innerHTML =
      M.left >= 0
        ? `<b>${used(c.qty > 0 ? M.after : M.now)}</b> · ${short(M.left)} left`
        : `<span class="hot">over by ${esc(fmtQty(-M.left, c.t.symbol))}</span>`;
    $('tr-mtxt').title = c.qty > 0 ? `${used(M.now)} used now, ${used(M.after)} with this order` : '';
  } else {
    mnow.style.width = mpv.style.width = '0%';
    $('tr-mtxt').innerHTML = `<span>${S.master ? 'working out…' : 'pick a master (M)'}</span>`;
  }
  if (K.room > 0) {
    const after = K.after === null ? K.now : K.after;
    rnow.style.width = K.now === null ? '0%' : pct100(K.now / K.room);
    rpv.style.width = after === null ? '0%' : pct100(after / K.room);
    rpv.className = 'pv' + heat(after === null ? 0 : after / K.room);
    rnow.className = heat(K.now === null ? 0 : K.now / K.room).trim();
    const left = after === null ? null : K.room - after;
    const usd = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
    $('tr-rtxt').innerHTML =
      K.now === null
        ? '<span class="warn">no stop</span>'
        : left !== null && left <= 0
          ? `<b>${usd(after)}</b> · <span class="hot">past the floor</span>`
          : `<b class="${heat(after / K.room).trim()}">${usd(after || 0)}</b> of ${usd(K.room)}`;
    $('tr-rtxt').title = left !== null && left > 0 ? `${usd(left)} left before the floor after this order` : '';
  } else {
    rnow.style.width = rpv.style.width = '0%';
    $('tr-rtxt').innerHTML = `<span>${S.master ? 'working out…' : ''}</span>`;
  }
  const by = [
    M && c.limitedBy && `margin: ${accLabel(c.limitedBy)}`,
    K.room > 0 && K.by && `risk: ${accLabel(K.by)}`,
  ].filter(Boolean);
  const tight =
    by.length === 2 && c.limitedBy === K.by
      ? `tightest: ${accLabel(K.by)}`
      : by.length
        ? 'tightest · ' + by.join(' · ')
        : '';
  set('tr-tight', tight);
  $('tr-lims').title =
    "Margin: how much of Vest's buying power (its 100%) this order uses, and what's left. Risk: what the stop would lose, " +
    'fees included, against the room left before the floor.' +
    (tight ? ` (${tight})` : '');
  const plans = Object.values(S.plans);
  const plansHtml = plans.length
    ? `<div class="tr-lbl">Breakeven watch</div>` +
      plans
        .map((p) => {
          const tick = (SYMBOLS[p.symbol] || c.meta).tick;
          const when = p.beMode === 'tp1' ? `after TP1 (${fmtPx(p.tp1, tick)})` : `at +${p.beTrigger} pts`;
          const state = !(p.entry > 0)
            ? 'waiting for fill…'
            : p.triggered
              ? 'moving stop…'
              : `stop → ${fmtPx(breakevenPrice({ side: p.side, entry: p.entry, offsetPts: p.beOffset, tick }), tick)} ${when}`;
          const what = `<b>${p.side === 'long' ? 'Long' : 'Short'}</b> ${esc(symLabel(p.symbol))}${p.entry > 0 ? ' @ ' + fmtPx(p.entry, tick) : ''} · ${esc(state)}`;
          return `<div class="tr-plan"><span>${what}</span><button class="tr-x" data-unplan="${esc(p.positionId)}" title="Stop watching" aria-label="Stop watching">×</button></div>`;
        })
        .join('')
    : '';
  const box = $('tr-plans');
  if (box.dataset.html !== plansHtml) {
    // rewrite only on change, so a click on × isn't lost to a tick
    box.dataset.html = plansHtml;
    box.innerHTML = plansHtml;
    box.querySelectorAll('[data-unplan]').forEach(
      (b) =>
        (b.onclick = () => {
          const p = S.plans[b.dataset.unplan];
          if (p) endPlan(p, 'Breakeven: stopped watching (you cancelled it).');
        }),
    );
  }
}
