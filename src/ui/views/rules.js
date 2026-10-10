import { arm } from '../../copier/arming.js';
import { logEvent } from '../../core/activity-log.js';
import { diag } from '../../core/diagnostics.js';
import { TERMS_VERSION, saveAck } from '../../core/settings.js';
import { maybeOfferSupport } from '../../features/support-code.js';
import { REPO_URL } from '../../features/updates.js';
import { S } from '../../state.js';
import { render } from '../render.js';

// Rules tab, and the one-time risk acknowledgement (shown on first load; required before arming or trading).
export function renderRules(body) {
  const first = !S.ack;
  if (first && body.dataset.view === 'rules-first') return; // a re-render would untick the box
  body.dataset.view = first ? 'rules-first' : '';
  const how = `
        <ul class="rules-list">
          <li><b>Live copying.</b> Arming copies your <b>master</b> account's orders to the selected <b>followers</b>
            as <b>real orders</b> on live accounts.</li>
          <li><b>Leverage is matched.</b> On arm, followers are set to the master's leverage. If you change leverage
            or switch markets, <b>disarm and arm again</b>.</li>
          <li><b>Flat, or already in the same trade.</b> Arm when everyone is flat, or when the master and followers
            hold the same position (same market and side): arming <b>adopts</b> it, so exits and stop/target changes
            copy. It never opens a trade for a follower that isn't already in it.</li>
          <li><b>Only your orders are copied.</b> When Vest closes the master itself (a stop or target filling, a
            drawdown breach), nothing is copied: the log says what Vest did, and a follower still in the trade a few
            seconds later is offered to flatten.</li>
          <li><b>An account that fails drops out.</b> A follower is removed and the others keep copying; if the master
            fails, the copier disarms.</li>
          <li><b>Sizing.</b> Strict 1:1 copies the exact size (same-size accounts only). <b>Cap-to-fit</b> (Settings)
            sizes each follower to its own equity: same % risk, same stop distance, smaller size.</li>
          <li><b>Shared risk.</b> One bad trade hits <b>every</b> linked account at once. Size so a simultaneous loss
            is survivable.</li>
        </ul>`;
  const risk = `
        <div class="rules-h">Your risk</div>
        <ul class="rules-list">
          <li>STRATUH Copier <b>places real orders on live accounts</b>, automatically, using your logged-in Vest session.</li>
          <li>Copies can be late, fail, fill at a different price or size, or be missed entirely, for example when Vest
            changes its site, rejects an order or is slow. <b>Watch your accounts</b> while it runs.</li>
          <li><b>You alone are responsible</b> for every order it sends and every trade on your accounts, including any
            loss, drawdown breach or failed evaluation.</li>
          <li>It is provided free and <b>as is, with no warranty</b>. Its author accepts <b>no responsibility or liability</b>
            for anything that happens while you use it.</li>
          <li>It is not affiliated with or endorsed by Vest Markets. Whether your prop program allows a trade copier is
            yours to check. Nothing here is financial advice.</li>
        </ul>
        <div class="rules-terms">Full terms: <a href="${REPO_URL}/blob/main/DISCLAIMER.md" target="_blank" rel="noopener">Disclaimer</a>
          · <a href="${REPO_URL}/blob/main/LICENSE" target="_blank" rel="noopener">License</a></div>`;
  body.innerHTML = first
    ? `
      <div class="rules">
        <div class="rules-h">Before you use STRATUH Copier</div>
        ${risk}
        <div class="rules-h">How it works</div>
        ${how}
        <label class="rules-accept"><input type="checkbox" id="rl-check">
          I have read this. I use STRATUH Copier entirely at my own risk, and its author is not responsible for any loss.</label>
        <div class="rules-btns"><button class="armbtn" id="rl-agree" disabled>Accept and continue</button></div>
      </div>`
    : `
      <div class="rules">
        <div class="rules-h">Before you arm</div>
        ${how}
        ${risk}
        <div class="rules-btns"><button class="ghostbtn" id="rl-close">Close</button></div>
      </div>`;
  if (first) {
    const check = body.querySelector('#rl-check'),
      agree = body.querySelector('#rl-agree');
    check.onchange = () => (agree.disabled = !check.checked);
    agree.onclick = () => {
      if (!check.checked) return;
      S.ack = true;
      saveAck();
      diag('terms_accepted', { version: TERMS_VERSION });
      logEvent('info', 'Terms accepted.');
      S.rulesOpen = false;
      render();
      if (S.ackThenArm) arm();
      S.ackThenArm = false;
      maybeOfferSupport();
    };
  } else {
    body.querySelector('#rl-close').onclick = () => {
      S.rulesOpen = false;
      render();
    };
  }
}
