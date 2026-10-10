import { startBalancePoll } from './live-pnl.js';
import { buildRegistry, refreshBalances } from './registry.js';
import { who } from '../copier/executor.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { dropClaimReview } from '../features/claim-profit.js';
import { maybeOfferSupport } from '../features/support-code.js';
import { S } from '../state.js';
import { esc } from '../ui/format.js';
import { _root, renderHealth } from '../ui/panel.js';
import { render } from '../ui/render.js';
import { readScreen } from '../vest/account-feed.js';
import { waitForUserToken } from '../vest/request-hooks.js';

// Reload accounts (↻ and start-up): wait for the session, read every account, start the balance poll.

export async function refresh() {
  renderHealth();
  const body = _root.querySelector('.body');
  const show = (html) => {
    body.dataset.view = '';
    body.innerHTML = html;
  };
  try {
    await waitForUserToken();
  } catch {
    return show(
      `<div class="empty">Couldn't capture your Vest session.<br>Click around the site, then click Reload accounts (↻).</div>`,
    );
  }
  show(`<div class="empty">Loading accounts…</div>`);
  readScreen();
  try {
    await buildRegistry();
    dropClaimReview(); // it named the accounts as they were
    render();
    logEvent('info', `Loaded ${Object.keys(S.byId).length} active accounts.`);
    diag('accounts', {
      count: Object.keys(S.byId).length,
      list: Object.values(S.byId).map((r) => ({
        ...who(r.id),
        type: r.type,
        size: r.size,
        equity: r.equity,
        floor: r.floor,
        dailyFloor: r.dailyFloor,
        target: r.target,
        free: r.free,
        canTrade: r.canTrade,
      })),
    });
    startBalancePoll();
    refreshBalances(); // live equity now, rather than the series' last point
    if (!S.ack) {
      S.rulesOpen = true; // first use: the risk acknowledgement comes first
      S.tradeOpen = S.summaryOpen = S.settingsOpen = false;
      render();
    } else maybeOfferSupport();
  } catch (e) {
    show(`<div class="empty">Failed to load accounts: ${esc(e.message)}</div>`);
  }
}
