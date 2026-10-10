import { floorOf } from '../accounts/registry.js';
import { setMaster, toggleFollower } from '../copier/selection.js';
import { siteGate } from '../health/site-check.js';
import { unwatchUnused } from '../market/prices.js';
import { S } from '../state.js';
import { stopPick } from '../trade/chart-pick.js';
import { renderTrade } from '../trade/view.js';
import { place, renderDock, showOnThisPage } from './dock.js';
import { acctNum, esc, money, pct } from './format.js';
import { renderLog } from './log.js';
import { _root, currentView, renderHealth } from './panel.js';
import { renderRules } from './views/rules.js';
import { renderSettings } from './views/settings.js';
import { renderGate, renderSiteCheck } from './views/site-check.js';
import { renderSummary } from './views/summary.js';
import { renderSupportTab } from './views/support.js';

// Switching tabs and redrawing the panel.

export function setView(v) {
  if (v !== 'trade') stopPick(true);
  S.tradeOpen = v === 'trade';
  S.summaryOpen = v === 'summary';
  S.settingsOpen = v === 'settings';
  S.rulesOpen = v === 'rules';
  S.supportOpen = v === 'support';
  S.siteOpen = false;
  if (!S.tradeOpen) unwatchUnused(); // the price feed is only needed by the Trade tab and breakeven
  render();
}

export function render() {
  if (!_root) return;
  renderHealth();
  const body = _root.querySelector('.body');
  const gate = siteGate(); // Vest updated: the check takes the whole panel
  _root.querySelector('.panel').classList.toggle('gated', !!gate);
  // the Trade, Support and first-run Rules views keep their DOM between renders (typing, a ticked box)
  const keeps = !gate && (S.tradeOpen || S.supportOpen || (S.rulesOpen && !S.settingsOpen && !S.ack));
  if (!keeps || S.siteOpen) body.dataset.view = '';
  if (!gate && !S.siteOpen) delete body.dataset.check;
  if (gate) {
    renderGate(body, gate);
  } else if (S.siteOpen) {
    renderSiteCheck(body);
  } else if (S.supportOpen) {
    renderSupportTab(body);
  } else if (S.tradeOpen) {
    renderTrade(body);
  } else if (S.settingsOpen) {
    renderSettings(body);
  } else if (S.rulesOpen) {
    renderRules(body);
  } else if (S.summaryOpen) {
    renderSummary(body);
  } else if (!S.groups.length) {
    body.innerHTML = `<div class="empty">No active accounts found.</div>`;
  } else {
    // Whole dollars from $1,000 up (rounded down, so room is never overstated); cents below, where they matter.
    const moneyShort = (n) =>
      Math.abs(n) >= 1000 ? (n < 0 ? '−' : '') + '$' + Math.floor(Math.abs(n)).toLocaleString('en-US') : money(n);
    const bare = (n) => moneyShort(n).replace('$', ''); // the sub line: "bal 25,620 · floor 24,000"
    // The master on top in its own block; then each account size, the master's first, with how many copy it.
    const row = (r, masterGroup) => {
      const td = r.canTrade === false ? 'red' : r.canTrade === true ? 'green' : 'gray';
      const tdText =
        r.canTrade === false ? 'Trading disabled' : r.canTrade === true ? 'Can trade' : 'Trading status unknown';
      const isM = S.master === r.id,
        isF = S.followers.has(r.id);
      const fDisabled = !S.master || isM || (!S.capFit && !masterGroup) || r.canTrade === false || S.armed;
      const bar = r.usedPct > 0.8 ? 'bar-hot' : r.usedPct > 0.5 ? 'bar-warn' : 'bar-ok';
      const id = esc(r.id),
        label = esc(r.label);
      return `<div class="row ${isM ? 'master' : isF ? 'follower' : ''}">
              <div class="badge">${esc(acctNum(r.label))}</div>
              <div class="meta"><div class="name">${label} <span class="chip">${esc(r.chip)}</span> <span class="dot ${td}" title="${tdText}"></span></div>
                <div class="sub" title="Balance ${money(r.equity)} · ${r.dailyFloor > r.floor ? 'daily ' : ''}floor ${money(floorOf(r))}">bal ${bare(r.equity)} · ${r.dailyFloor > r.floor ? '<span title="Daily loss floor, higher than the drawdown floor today">daily floor</span>' : 'floor'} ${bare(floorOf(r))}</div></div>
              <div class="right" title="Room left before the floor: ${money(r.room)}"><div class="room">${moneyShort(r.room)}</div><div class="used">${pct(r.usedPct)} used</div>
                <div class="bar"><i class="${bar}" style="width:${Math.round(r.usedPct * 100)}%"></i></div></div>
              <div class="sel">
                <button class="selbtn m ${isM ? 'on' : ''}" data-m="${id}" title="${S.armed ? 'Disarm to change the master' : `Make ${label} the master`}" aria-label="Make ${label} the master"
                  aria-pressed="${isM}" ${r.canTrade === false || S.armed ? 'disabled' : ''}>M</button>
                <button class="selbtn f ${isF ? 'on' : ''}" data-f="${id}" title="${S.armed ? 'Disarm to change followers' : `Copy the master to ${label}`}" aria-label="Copy the master to ${label}"
                  aria-pressed="${isF}" ${fDisabled ? 'disabled' : ''}>FLW</button>
              </div></div>`;
    };
    const m = S.master && S.byId[S.master];
    const groups = m ? [...S.groups].sort((a, b) => (b.key === m.groupKey) - (a.key === m.groupKey)) : S.groups;
    body.innerHTML =
      (m
        ? `<div class="group"><div class="group-h"><span class="lime">Master</span><span class="gr">${moneyShort(m.size)} · ${esc(m.type)}</span></div>${row(m, true)}</div>`
        : '') +
      groups
        .map((g) => {
          const masterGroup = !!m && m.groupKey === g.key;
          const rest = g.rows.filter((r) => r.id !== S.master);
          if (!rest.length) return '';
          const copying = rest.filter((r) => S.followers.has(r.id)).length;
          const n = g.rows.length;
          const right =
            masterGroup || (m && S.capFit)
              ? `${copying} copying · ${S.capFit ? 'cap-to-fit' : '1:1'}`
              : `${n} account${n > 1 ? 's' : ''}`;
          const title = m
            ? masterGroup
              ? 'Followers'
              : `${moneyShort(g.size)} · ${esc(g.type)}`
            : `${moneyShort(g.size)} · ${esc(g.type)}`;
          return `<div class="group"><div class="group-h"><span>${title}</span><span class="gr">${right}</span></div>${rest
            .map((r) => row(r, masterGroup))
            .join('')}</div>`;
        })
        .join('');
    body.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => setMaster(b.getAttribute('data-m'))));
    body.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => toggleFollower(b.getAttribute('data-f'))));
  }

  const armBtn = _root.querySelector('[data-act="arm"]');
  // DISARM is never blocked; only ARM is gated on a valid selection and the accounts view.
  const otherView = gate || S.rulesOpen || S.summaryOpen || S.settingsOpen || S.siteOpen || S.supportOpen;
  armBtn.disabled = S.armed ? false : S.arming || otherView || !(S.master && S.followers.size);
  armBtn.textContent = S.armed ? 'DISARM' : S.arming ? 'ARMING…' : 'ARM';
  armBtn.classList.toggle('armed', S.armed);
  const tag = _root.querySelector('#armtag');
  tag.textContent = S.armed
    ? 'Armed · live'
    : gate === 'failed'
      ? 'Off'
      : gate && gate !== 'clear'
        ? 'Checking'
        : S.master
          ? 'Ready'
          : 'Idle';
  tag.className = 'armtag ' + (S.armed ? 'on' : 'off');
  const opts = _root.querySelector('#opttag');
  opts.textContent = [S.fast && 'FAST', S.capFit && 'CAP'].filter(Boolean).join(' ');
  opts.title = [S.fast && 'Fast mode', S.capFit && 'Cap-to-fit'].filter(Boolean).join(' · ');
  const flat = _root.querySelector('[data-act="flatall"]');
  flat.disabled = S.flattening;
  flat.textContent = S.flattening ? 'Flattening…' : 'Flatten All';
  const view = currentView();
  _root.querySelectorAll('[data-tab]').forEach((b) => {
    b.classList.toggle('on', b.dataset.tab === view);
    b.setAttribute('aria-selected', String(b.dataset.tab === view));
  });
  renderLog();
  place();
  renderDock();
  showOnThisPage();
}
