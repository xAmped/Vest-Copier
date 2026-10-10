import { VERSION } from '../../config.js';
import { toast } from '../../core/activity-log.js';
import { saveOpts, store, toggleAutoFlatten, toggleCapFit, toggleFast } from '../../core/settings.js';
import {
  SUPPORT_CODE,
  SUPPORT_KEY,
  copySupportCode,
  saveSupport,
  setSupportApply,
  supportApplies,
} from '../../features/support-code.js';
import { REPO_URL, checkForUpdate } from '../../features/updates.js';
import { S } from '../../state.js';
import { resetChartMarks } from '../chart-tweaks.js';
import { showOnThisPage } from '../dock.js';
import { esc } from '../format.js';
import { render } from '../render.js';
import { applyTheme } from '../theme.js';

// Settings tab.

export function renderSettings(body) {
  const option = (key, on, name, desc, dim = false) => `
        <div class="opt ${dim ? 'dep-off' : ''}">
          <div class="opt-txt"><div class="opt-name">${name}</div><div class="opt-desc">${desc}</div></div>
          <button class="switch ${on ? 'on' : ''}" data-opt="${key}" role="switch" aria-checked="${on}" aria-label="${name}"><span class="knob"></span></button>
        </div>`;
  body.innerHTML = `
      <div class="settings">
        <div class="set-h">Execution</div>
        ${option(
          'fast',
          S.fast,
          'Fast mode',
          "Fire follower entries the instant the master sends, for the most simultaneous fills. They open before the master's order is confirmed.",
        )}
        ${option(
          'autoflat',
          S.autoFlatten,
          'Auto-flatten orphans',
          "If followers end up in a trade the master isn't in (its entry was refused or didn't fill, or Vest closed the master), close them automatically instead of asking. Never used when the master might be in the trade.",
        )}
        <div class="set-h">Sizing</div>
        ${option(
          'capfit',
          S.capFit,
          'Cap-to-fit size',
          'Size each follower to its own equity instead of copying 1:1. Every account takes the same % risk with the same stop distance, ' +
            'and <b>different-size followers</b> are allowed (e.g. a 25k master with 5k accounts). Off: strict 1:1, same-size accounts only.',
        )}
        <div class="set-h">Chart</div>
        ${option(
          'hidemarks',
          S.hideMarks,
          'Hide marks on bars',
          "Hide Vest's buy and sell marks on the chart each time it loads (the chart's right-click Hide marks on bars, which Vest forgets on every refresh). Show them again from that menu any time.",
        )}
        ${option(
          'tradeonly',
          S.tradeOnly,
          'Show only on the Trade page',
          "Hide the panel on Vest's other pages (Portfolio, Markets, Affiliate…). It keeps running and copying there, and shows on any page when something needs you.",
        )}
        ${option(
          'hidesessions',
          S.hideSessions,
          'Hide session shading',
          'Remove the pre-market, after-hours and overnight bands Vest draws on the chart (its Market Sessions indicator), every time it adds them.',
        )}
        ${option(
          'theme',
          S.theme,
          'STRATUH theme for Vest',
          "Recolour Vest's own page and chart in STRATUH's colours: onyx, lime and greys, square corners, and drop the Volume indicator Vest adds to the chart by itself. Dark mode only; turn it off to go back to Vest's colours (the chart on the next refresh).",
        )}
        <div class="opt ${S.theme ? '' : 'dep-off'}">
          <div class="opt-txt"><div class="opt-name">Shorts and losses</div>
            <div class="opt-desc">Grey, as on STRATUH's DeepCharts theme, or red. Candles stay grey either way.</div></div>
          <div class="seg" data-theme-down><button data-v="mono" class="${S.themeDown === 'mono' ? 'on' : ''}">Grey</button><button data-v="red" class="${S.themeDown === 'red' ? 'on' : ''}">Red</button></div>
        </div>
        <div class="set-h">Updates</div>
        ${option(
          'updates',
          S.checkUpdates,
          'Check for updates',
          `Each time Vest loads, check GitHub for a newer version and offer a one-click install. You have v${VERSION}` +
            (S.update && S.update.latest ? `; the latest published is v${esc(S.update.latest)}.` : '.'),
        )}
        <div class="set-row"><button class="ghostbtn" data-act="check-now">Check now</button>
          <a class="ghostbtn" href="${REPO_URL}" target="_blank" rel="noopener">GitHub</a></div>
        <div class="set-h">Support</div>
        ${option(
          'supportapply',
          supportApplies(),
          `Use code ${SUPPORT_CODE} at checkout`,
          `Switch the discount code in Vest's purchase window to <b>${SUPPORT_CODE}</b> (5% off) each time it opens. Thank you for supporting the free copier.`,
        )}
        <div class="set-row"><button class="ghostbtn" data-act="copy-code">Copy code ${SUPPORT_CODE}</button></div>
      </div>`;
  body.querySelectorAll('[data-opt]').forEach(
    (b) =>
      (b.onclick = () => {
        const o = b.getAttribute('data-opt');
        if (o === 'fast') toggleFast();
        else if (o === 'autoflat') toggleAutoFlatten();
        else if (o === 'capfit') toggleCapFit();
        else if (o === 'supportapply') {
          const on = !supportApplies();
          if (on && !['yes', 'manual'].includes((store.get(SUPPORT_KEY, null) || {}).answered)) saveSupport('yes');
          setSupportApply(on);
          render();
        } else if (o === 'updates') {
          S.checkUpdates = !S.checkUpdates;
          saveOpts();
          render();
        } else if (o === 'tradeonly') {
          S.tradeOnly = !S.tradeOnly;
          saveOpts();
          showOnThisPage();
          render();
        } else if (o === 'hidesessions') {
          S.hideSessions = !S.hideSessions;
          saveOpts();
          render();
        } else if (o === 'theme') {
          S.theme = !S.theme;
          saveOpts();
          applyTheme();
          render();
        } else if (o === 'hidemarks') {
          S.hideMarks = !S.hideMarks;
          saveOpts();
          resetChartMarks(); // switched on: hide them now
          render();
        }
      }),
  );
  body.querySelectorAll('[data-theme-down] button').forEach(
    (b) =>
      (b.onclick = () => {
        S.themeDown = b.dataset.v;
        saveOpts();
        applyTheme();
        render();
      }),
  );
  body.querySelector('[data-act="check-now"]').onclick = () => checkForUpdate(true);
  body.querySelector('[data-act="copy-code"]').onclick = () =>
    copySupportCode().then((ok) => toast(ok ? `Code ${SUPPORT_CODE} copied.` : `Code: ${SUPPORT_CODE}`));
}
