import { refresh } from './accounts/reload.js';
import { LOG, VERSION } from './config.js';
import { checkWasArmed } from './copier/arming.js';
import { logEvent } from './core/activity-log.js';
import { diag, loadDiag } from './core/diagnostics.js';
import { loadAck, loadLog, loadOpts, loadTrade, store } from './core/settings.js';
import { watchPurchaseWindow } from './features/support-code.js';
import { SCRIPT_URL, checkForUpdate, loadUpdate } from './features/updates.js';
import { fingerprint, initBuild } from './health/health.js';
import { autoSiteCheck } from './health/site-check.js';
import { loadAllSymbolRules } from './market/prices.js';
import { S } from './state.js';
import { loadPlans } from './trade/breakeven-plans.js';
import { loadDock, setOpen } from './ui/dock.js';
import { renderLog } from './ui/log.js';
import { mountPanel, renderHealth } from './ui/panel.js';
import { applyTheme } from './ui/theme.js';

// Start-up once the page is ready: load what was saved, build the panel, read the accounts.

// A copy of the script that passed through a tool using a legacy code page (e.g. Windows clip.exe) has every
// non-ASCII character mangled: this one-character dash arrives as three ("ΓÇô"). Say so, and point at a clean install.
const ENCODING_PROBE = '–';
function checkEncoding() {
  if (ENCODING_PROBE.length === 1) return;
  logEvent(
    'warn',
    'This copy of STRATUH Copier was garbled when it was copied (symbols look wrong). Reinstall it from ' + SCRIPT_URL,
  );
  diag('encoding', { probeLength: ENCODING_PROBE.length });
}

// boot
export const boot = () => {
  loadLog();
  loadDiag();
  loadAck();
  loadOpts();
  loadTrade();
  loadUpdate();
  initBuild();
  setInterval(autoSiteCheck, 1000); // Vest updated: the site check runs by itself
  loadAllSymbolRules();
  diag('session', {
    version: VERSION,
    build: fingerprint() || null,
    browser: navigator.userAgent,
    settings: {
      fast: S.fast,
      autoFlatten: S.autoFlatten,
      capFit: S.capFit,
      checkUpdates: S.checkUpdates,
      hideMarks: S.hideMarks,
    },
    termsAccepted: S.ack,
    openPlans: Object.keys(store.get('vc-plans', {}) || {}).length,
  });
  // The copier's own crashes (not Vest's): Tampermonkey runs it from a "userscript" source.
  const ours = (stack) => /userscript|vest-copier/i.test(String(stack || ''));
  window.addEventListener('error', (e) => {
    if (ours(e.filename) || ours(e.error && e.error.stack))
      diag('script_error', {
        message: e.message,
        at: `${e.lineno}:${e.colno}`,
        stack: String((e.error && e.error.stack) || '').slice(0, 800),
      });
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    if (ours(r && r.stack))
      diag('script_error', {
        message: String((r && r.message) || r),
        stack: String(r.stack).slice(0, 800),
        unhandled: true,
      });
  });
  loadDock();
  applyTheme();
  mountPanel();
  setOpen(S.dock.open || !S.ack); // a first run opens fully, for the risk terms
  loadPlans();
  renderHealth();
  renderLog();
  refresh();
  checkForUpdate();
  checkEncoding();
  checkWasArmed();
  watchPurchaseWindow();
  LOG(`v${VERSION} loaded.`);
};
