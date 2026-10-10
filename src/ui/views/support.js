import { VERSION } from '../../config.js';
import { toast } from '../../core/activity-log.js';
import { sendReport, shareIdea } from '../../features/report.js';
import { SUPPORT_CODE, copySupportCode } from '../../features/support-code.js';
import { DISCORD_URL, REPO_URL } from '../../features/updates.js';

// Support tab.

export function renderSupportTab(body) {
  if (body.dataset.view === 'support' && body.querySelector('.support-tab')) return;
  body.dataset.view = 'support';
  const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
  body.innerHTML = `
      <div class="rules support-tab">
        <div class="rules-h">Support</div>
        <p class="sc-sub">STRATUH Copier v${VERSION} · ${link(`${REPO_URL}/blob/main/CHANGELOG.md`, "What's new")} ·
          ${link(`${REPO_URL}/blob/main/docs/USER-GUIDE.md`, 'User guide')} ·
          ${link('https://xamped.github.io/Vest-Copier/tutorial/', 'Tutorial')}</p>
        <div class="sup-card">
          <div class="sup-h">Report a problem</div>
          <p class="sc-sub">Describe what happened and what you expected. The copier saves a report file and opens a
            GitHub issue with your description filled in: drag the file into it and submit. Posting needs a free GitHub
            account.</p>
          <textarea class="report-note" id="rp-note" rows="5" aria-label="What happened"
            placeholder="What happened, and what did you expect? Which accounts, roughly when?"></textarea>
          <p class="sc-sub">The file holds the activity log, the diagnostics record, your settings, your copier version
            and your accounts' balances. Account ids are replaced by their names. It never contains passwords or login
            tokens.</p>
          <button class="armbtn sm" id="rp-send">Save report &amp; open issue</button>
        </div>
        <div class="sup-card">
          <div class="sup-h">Help and community</div>
          <p class="sc-sub">Questions, setup help, or just talking trades with other users: join the Discord.</p>
          <a class="ghostbtn" href="${DISCORD_URL}" target="_blank" rel="noopener">Join the Discord</a>
        </div>
        <div class="sup-card">
          <div class="sup-h">Ideas and feedback</div>
          <p class="sc-sub">Something that could work better, or a feature you'd use? Ideas go on GitHub too.</p>
          <button class="ghostbtn" id="sp-idea">Share an idea or feedback</button>
        </div>
        <div class="sup-card">
          <div class="sup-h">Support the project</div>
          <p class="sc-sub">STRATUH Copier is free. Code <b>${SUPPORT_CODE}</b> takes 5% off Vest purchases and helps keep it
            maintained. Settings → Support can enter it at checkout for you.</p>
          <button class="ghostbtn" id="sp-copy">Copy code ${SUPPORT_CODE}</button>
        </div>
      </div>`;
  const note = body.querySelector('#rp-note');
  ['keydown', 'keyup', 'keypress'].forEach((ev) => note.addEventListener(ev, (e) => e.stopPropagation())); // not Vest's shortcuts
  body.querySelector('#rp-send').onclick = () => sendReport(note.value.trim());
  body.querySelector('#sp-idea').onclick = shareIdea;
  body.querySelector('#sp-copy').onclick = () =>
    copySupportCode().then((ok) => toast(ok ? `Code ${SUPPORT_CODE} copied.` : `Code: ${SUPPORT_CODE}`));
}
