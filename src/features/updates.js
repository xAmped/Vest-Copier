import { VERSION, _fetch } from '../config.js';
import { diag } from '../core/diagnostics.js';
import { store } from '../core/settings.js';
import { claimBusy } from './claim-profit.js';
import { S } from '../state.js';
import { esc } from '../ui/format.js';
import { _root } from '../ui/panel.js';
import { render } from '../ui/render.js';

// Checking GitHub for a new version and installing it.
// On every load (and on Check now), compare this script's version with the one published on GitHub. The page allows
// the request and GitHub serves it cross-origin; nothing else is sent. A bar under the status line shows the result:
// "Checking…", then "Update available" with Install (opening the .user.js link makes Tampermonkey show its own update
// page, where one click installs it — a script can't replace itself), or "Up to date", which fades after a moment.
export const REPO_URL = 'https://github.com/xAmped/Vest-Copier';
export const DISCORD_URL = 'https://discord.gg/Aa69y9KnM3';
export const SCRIPT_URL = 'https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js';
// GitHub's raw file server caches `main` for up to 5 minutes after a push. The API names the newest commit (cached
// about a minute), and a file fetched by commit id is never stale, so check (and install) from that commit.
// New versions are published as GitHub releases with the script attached. The panel reads the latest release and
// installs that release's file, which GitHub counts as a download (the only usage number there is: the copier itself
// reports nothing). If the API is unavailable (60 requests an hour per IP), it falls back to the raw file on `main`.
const LATEST_RELEASE_API = 'https://api.github.com/repos/xAmped/Vest-Copier/releases/latest';
const releaseAsset = (tag) => `https://github.com/xAmped/Vest-Copier/releases/download/${tag}/vest-copier.user.js`;
const UPDATE_KEY = 'vc-update'; // remembers only which version "Later" was clicked for
const UPDATE_NOTE_MS = 4000; // how long "Up to date" / "Couldn't check" stays up
// Numeric compare of dotted versions: 1 if a > b, -1 if a < b, 0 if equal.
const cmpVersion = (a, b) => {
  const pa = String(a).split('.').map(Number),
    pb = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
};
// S.update = { state: 'checking' | 'available' | 'current' | 'error' | null, latest, dismissed }
export function loadUpdate() {
  const u = store.get(UPDATE_KEY, {}) || {};
  S.update = { state: null, latest: null, installUrl: null, dismissed: u.dismissed || null };
}
const updateAvailable = () => !!(S.update && S.update.latest && cmpVersion(S.update.latest, VERSION) > 0);
let _updateNoteTimer = null;
export async function checkForUpdate(manual = false) {
  if (!S.checkUpdates && !manual) return;
  clearTimeout(_updateNoteTimer);
  S.update.state = 'checking';
  renderUpdate();
  try {
    let latest = null;
    try {
      const rel = await _fetch(LATEST_RELEASE_API, { cache: 'no-store' });
      const j = rel.ok ? await rel.json() : null;
      const asset = j && (j.assets || []).find((a) => a.name === 'vest-copier.user.js');
      if (j && /^v?\d+(\.\d+)*$/.test(j.tag_name || '') && asset) {
        latest = j.tag_name.replace(/^v/, '');
        S.update.installUrl = asset.browser_download_url || releaseAsset(j.tag_name);
      }
    } catch {
      /* best effort: nothing to do if this fails */
    } // API unavailable or rate-limited: fall back to the raw file
    if (!latest) {
      const r = await _fetch(SCRIPT_URL, { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const m = (await r.text()).match(/^\/\/ @version\s+(\S+)/m);
      if (!m) throw new Error('no version in the published script');
      latest = m[1];
      S.update.installUrl = SCRIPT_URL;
    }
    S.update.latest = latest;
    diag('update_check', { outcome: 'ok', latest, from: S.update.installUrl === SCRIPT_URL ? 'raw' : 'release' });
    S.update.state = updateAvailable() ? 'available' : 'current';
    if (manual && S.update.state === 'available') S.update.dismissed = null; // Check now always shows it
  } catch (e) {
    S.update.state = 'error';
    diag('update_check', { outcome: 'error', error: e.message });
  }
  if (S.update.state !== 'available') {
    _updateNoteTimer = setTimeout(() => {
      S.update.state = null;
      renderUpdate();
    }, UPDATE_NOTE_MS);
  }
  render();
}
function dismissUpdate() {
  S.update.dismissed = S.update.latest;
  store.set(UPDATE_KEY, { dismissed: S.update.dismissed });
  renderUpdate();
}
export function renderUpdate() {
  const bar = _root && _root.querySelector('.update');
  if (!bar || !S.update) return;
  const { state, latest, dismissed } = S.update;
  let html = '';
  if (state === 'checking') html = '<span class="utext">Checking for updates…</span>';
  else if (state === 'current') html = `<span class="utext">Up to date · v${VERSION}</span>`;
  else if (state === 'error')
    html = '<span class="utext">Couldn\'t check for updates — try Settings → Check now later.</span>';
  else if (state === 'installing')
    html = S.armed
      ? `<span class="utext">After updating in Tampermonkey, reload Vest to run v${esc(latest)}. Reloading disarms the
            copier; arm again afterwards (an open trade is adopted).</span>
          <button class="ubtn" data-act="update-reload">Reload now</button>`
      : '<span class="utext">Click <b>Update</b> in Tampermonkey, then come back: Vest reloads by itself.</span>';
  else if (state === 'available' && dismissed !== latest) {
    html = `<span class="utext"><b>Update available: v${esc(latest)}</b> (you have v${VERSION})${S.armed ? ' · install when flat' : ''}</span>
      <a class="ubtn" href="${esc(S.update.installUrl || SCRIPT_URL)}" target="_blank" rel="noopener" title="Opens Tampermonkey's update page; then reload Vest">Install</a>
      <a class="ubtn ghost" href="${REPO_URL}/blob/main/CHANGELOG.md" target="_blank" rel="noopener">What's new</a>
      <button class="ubtn ghost" data-act="update-later" aria-label="Hide until the next version">Later</button>`;
  }
  bar.hidden = !html;
  bar.classList.toggle('muted', state !== 'available' && state !== 'installing');
  if (bar.dataset.html === html) return;
  bar.dataset.html = html;
  bar.innerHTML = html;
  const later = bar.querySelector('[data-act="update-later"]');
  if (later) later.onclick = dismissUpdate;
  const install = bar.querySelector('a.ubtn');
  if (install && state === 'available') install.onclick = startInstall;
  const reload = bar.querySelector('[data-act="update-reload"]');
  if (reload) reload.onclick = reloadWhenIdle;
}
// Reload for an update only once nothing is in flight (an order, a stop move, a claim, Flatten All, arming).
const busyNow = () =>
  !!(S.placing || S.adjusting || S.flattening || S.arming || claimBusy()) || Object.values(S.plans).some((p) => p.busy);
function reloadWhenIdle() {
  if (busyNow()) return setTimeout(reloadWhenIdle, 500);
  location.reload();
}
// Tampermonkey doesn't tell the page when it updates a script, so: after Install, reload Vest when the user comes back
// to this tab (Tampermonkey's page opens in another tab). Armed, it asks instead, since reloading disarms.
let _leftForInstall = false;
function startInstall() {
  S.update.state = 'installing';
  _leftForInstall = false;
  renderUpdate();
}
export const watchForInstallReturn = () =>
  document.addEventListener('visibilitychange', () => {
    if (!S.update || S.update.state !== 'installing') return;
    if (document.hidden) {
      _leftForInstall = true;
      return;
    }
    if (!_leftForInstall) return;
    if (S.armed)
      renderUpdate(); // shows Reload now
    else reloadWhenIdle();
  });
