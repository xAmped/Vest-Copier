import { logEvent } from '../core/activity-log.js';
import { saveOpts, store } from '../core/settings.js';
import { SUPPORT_CODE, acceptSupport, declineSupport } from '../features/support-code.js';
import { S } from '../state.js';
import { esc } from './format.js';
import { _root } from './panel.js';
import { render } from './render.js';
import { applyTheme } from './theme.js';

// The STRATUH theme, introduced once: what changed on Vest's page and chart, Keep or Back to Vest's colours, and
// where to change it later. Shown once the terms (and the one-time support question) are out of the way, and only
// with Vest in dark mode, where the theme applies.
const THEME_INTRO_KEY = 'vc-theme-intro';
export function renderThemeIntro() {
  const bar = _root && _root.querySelector('.themeintro');
  if (!bar) return;
  const due =
    S.ack &&
    S.theme &&
    !S.supportOffer &&
    !store.get(THEME_INTRO_KEY, null) &&
    document.documentElement.classList.contains('dark');
  bar.hidden = !due;
  if (!due || bar.dataset.ready) return;
  bar.dataset.ready = '1';
  bar.innerHTML = `<span class="utext"><b>Vest is now in STRATUH colours.</b> Onyx and lime, grey shorts, losses and
        candles, square corners. The chart's buy/sell marks, session bands and the Volume indicator Vest adds are hidden
        too. Change any of it in Settings → Chart.</span>
      <button class="ubtn" data-act="theme-keep">Keep it</button>
      <button class="ubtn ghost" data-act="theme-revert">Back to Vest's colours</button>`;
  const answer = (keep) => {
    store.set(THEME_INTRO_KEY, { answered: keep ? 'keep' : 'revert', at: new Date().toISOString() });
    if (!keep) {
      S.theme = false;
      saveOpts();
      applyTheme();
      logEvent(
        'info',
        "STRATUH theme off: Vest's own colours are back (the chart after a refresh). Settings → Chart turns it on.",
      );
    }
    bar.hidden = true;
    render();
  };
  bar.querySelector('[data-act="theme-keep"]').onclick = () => answer(true);
  bar.querySelector('[data-act="theme-revert"]').onclick = () => answer(false);
}

export function renderSupport() {
  const bar = _root && _root.querySelector('.support');
  if (!bar) return;
  bar.hidden = !S.supportOffer;
  if (!S.supportOffer || bar.dataset.ready) return;
  bar.dataset.ready = '1';
  const cur = S.supportCurrent ? esc(S.supportCurrent) : null;
  const ask = cur
    ? `You currently use code <b>${cur}</b>. Switch to <b>${SUPPORT_CODE}</b>?`
    : `Use code <b>${SUPPORT_CODE}</b>?`;
  bar.innerHTML = `<span class="utext"><b>STRATUH Copier is free.</b> ${ask} It takes <b>5% off</b> your Vest purchases
        (the highest discount available) and helps keep the copier maintained until Vest releases its own. Yes sets
        AMPED in Vest's purchase window from now on (Settings → Support turns it off). Asked only this once.</span>
      <button class="ubtn" data-act="support-yes">${cur ? 'Yes, switch to' : 'Yes, use'} ${SUPPORT_CODE}</button>
      <button class="ubtn ghost" data-act="support-no">${cur ? `Keep ${cur}` : 'No thanks'}</button>`;
  bar.querySelector('[data-act="support-yes"]').onclick = acceptSupport;
  bar.querySelector('[data-act="support-no"]').onclick = declineSupport;
}
