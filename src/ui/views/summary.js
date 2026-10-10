import { isFunded, keepOf } from '../../accounts/registry.js';
import { claimHtml, wireClaim } from '../../features/claim-profit.js';
import { S } from '../../state.js';
import { esc, money } from '../format.js';

// Account P&L summary — profit = equity − starting capital, per account and summed. Auto-updates with the balance poll.
export function renderSummary(body) {
  const rows = Object.values(S.byId).sort((a, b) => a.size - b.size || a.order - b.order);
  if (!rows.length) {
    body.innerHTML = `<div class="empty">No accounts loaded.</div>`;
    return;
  }
  const sum = (arr) => arr.reduce((s, x) => s + (isNaN(x) ? 0 : x), 0);
  // an account whose balance couldn't be read counts in neither total (its start without its equity would read as a loss)
  const known = rows.filter((r) => !isNaN(r.equity) && !isNaN(r.size));
  const totalEq = sum(known.map((r) => r.equity)),
    totalInit = sum(known.map((r) => r.size)),
    totalPnl = totalEq - totalInit;
  const sp = (n) =>
    (n >= 0 ? '+' : '−') +
    '$' +
    Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pnlOf = (r) => r.equity - r.size; // NaN while the balance is unknown
  // What you'd take home if every funded account's profit were claimed now, after each account's own split
  const funded = rows.filter(isFunded);
  const keep = sum(funded.map(keepOf));
  const openTrades = rows.some((r) => r.upnl);
  const evalsUp = rows.some((r) => !isFunded(r) && pnlOf(r) > 0),
    fundedDown = funded.some((r) => pnlOf(r) < 0);
  const notCounted = [
    evalsUp && "evaluations (their profit doesn't pay out)",
    fundedDown && 'accounts in a loss (claims are per account, so they pay $0 and take nothing from the others)',
  ].filter(Boolean);
  const keepHtml = funded.length
    ? `<div class="sum-keep" title="Each funded account's profit × its profit split, added up. Accounts in a loss count as $0.">
          <div class="sum-keep-v">${money(keep)}</div>
          <div class="sum-keep-l">you keep after splits${openTrades ? ', if closed now' : ''}</div></div>`
    : '';
  body.innerHTML = `
      <div class="summary">
        <div class="sum-top"><div class="sum-total ${totalPnl >= 0 ? 'pos' : 'neg'}">${sp(totalPnl)}</div>${keepHtml}</div>
        <div class="sum-sub">total P&amp;L · ${rows.length} account${rows.length > 1 ? 's' : ''} · equity ${money(totalEq)} / start ${money(totalInit)}</div>
        <div class="sum-list">
          ${rows
            .map((r) => {
              const n = (r.label.match(/(\d+)\s*$/) || ['', '--'])[1];
              const pnl = pnlOf(r),
                k = keepOf(r);
              const keepLine =
                k > 0 ? `<span class="sum-k">keeps ${money(k)} · ${Math.round(r.split * 100)}%</span>` : '';
              return `<div class="sum-row"><span class="badge sm">${n}</span>
              <span class="sum-left"><span class="sum-name">${esc(r.label)} <span class="chip">${esc(r.chip)}</span></span>${keepLine}</span>
              <span class="sum-eq">${money(r.equity)}</span>
              <span class="sum-pnl ${isNaN(pnl) ? '' : pnl >= 0 ? 'pos' : 'neg'}">${isNaN(pnl) ? '—' : sp(pnl)}</span></div>`;
            })
            .join('')}
        </div>
        ${notCounted.length ? `<div class="sum-note">Not counted in what you keep: ${notCounted.join('; ')}.</div>` : ''}
        ${funded.length ? claimHtml() : ''}
      </div>`;
  wireClaim(body);
}
