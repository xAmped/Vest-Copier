import { API, BALANCES_LIMIT, _fetch } from '../config.js';
import { sleep } from '../copier/executor.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { BUILD_KEY, fingerprint, healthState, markUnknownBuildChecked } from './health.js';
import { priceOf, recentAt, symLabel, unwatchUnused, watchPrice } from '../market/prices.js';
import { S } from '../state.js';
import { _bootAt, chartFrame } from '../ui/dock.js';
import { render } from '../ui/render.js';
import { _feed } from '../vest/account-feed.js';
import { api } from '../vest/api.js';
import { decodeJwt, userToken, userTokenOk } from '../vest/auth.js';

// The site check: after Vest ships an update, confirm everything the copier relies on is still there.
// When Vest's build changes, the copier checks by itself that everything it relies on still looks the way it expects
// and accepts the build once every required check passes. Until then the panel shows only the check, and if a
// required check fails, copying, Trade-tab orders, automatic breakeven and claims stay off until a copier update
// (Flatten All still works). Read-only: it reads endpoints the copier uses and scans Vest's loaded code; nothing is
// sent to an account. The extras (live feed, prices, chart, claims) only warn: without them the copier is slower or a
// feature is off, never wrong.
// Order endpoints and payload fields the copier sends, looked for in Vest's own code (Vest joins "stop-loss" and
// "take-profit" into their path at runtime, so the bare words are looked for).
const SCAN_TERMS = [
  '/v3/positions/open',
  '/v3/positions/append',
  '/v3/positions/reduce',
  '/v3/positions/close',
  '/v3/positions/cancel-order',
  'stop-loss',
  'take-profit',
  '/v3/auth/account-token',
  '/v3/positions/opened-orders',
  '/v3/executions',
  '/v3/user-state',
  'takeProfits',
  'stopLosses',
  'reduceOnly',
  'timeInForce',
  'triggerPrice',
  'positionId',
  'isBuy',
  'orderType',
  'quantity',
  'leverage',
];
const FEED_TERMS = ['account_state', 'capital_account', 'final_balance', 'balance_version']; // Vest's private socket
const CLAIM_TERMS = ['/v3/capital/withdraw'];
// A whole term: "/v3/positions/open" must not be satisfied by "/v3/positions/opened".
const hasTerm = (code, term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '(?![\\w-])').test(code);
// [key, name, tier]: a failed 'must' keeps copying off; an 'extra' only warns.
export const SITE_CHECKS = [
  ['accounts', 'Accounts and balances', 'must'],
  ['token', 'Account access', 'must'],
  ['leverage', 'Leverage', 'must'],
  ['positions', 'Positions and orders', 'must'],
  ['fills', 'Fill history', 'must'],
  ['market', 'Market rules', 'must'],
  ['code', "Vest's order code", 'must'],
  ['feed', 'Live account feed', 'extra'],
  ['prices', 'Live prices', 'extra'],
  ['chart', 'Chart tools', 'extra'],
  ['claims', 'Profit claims', 'extra'],
];
const SITE_WAIT_MS = 6000, // how long the extras wait for Vest's feed, a price and the chart
  SITE_RETRY_MS = 20000, // a failed check runs once more by itself (a passing hiccup rather than Vest)
  SITE_EMPTY_MS = 15000, // Vest listed no active account: asked again after this long
  SITE_SETTLE_MS = 8000, // after a page load, the session and accounts get this long before "waiting" shows
  ALL_CLEAR_MS = 2500, // the "All clear" screen, before the panel comes back
  SITE_PACE_MS = 450; // the rows tick off one at a time, this far apart, so the check can be followed
// Test builds: localStorage 'vc-sim-site' = any of fail, warn, wait, slow (comma-separated) to see each screen.
const SITE_SIM = false;
const simSite = () => {
  if (!SITE_SIM) return new Set();
  try {
    return new Set(
      String(localStorage.getItem('vc-sim-site') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
};
// The first truthy value of fn() (errors count as "not yet"), or null after ms.
async function waitUntil(fn, ms) {
  const end = Date.now() + ms;
  for (;;) {
    let v = null;
    try {
      v = fn();
    } catch {
      /* not there yet */
    }
    if (v) return v;
    if (Date.now() > end) return null;
    await sleep(200);
  }
}
// Vest's own scripts (same host; never this copier), as one text to scan.
async function readVestCode() {
  const urls = new Set();
  for (const s of document.scripts) if (s.src) urls.add(s.src);
  for (const e of performance.getEntriesByType('resource')) if (e.initiatorType === 'script') urls.add(e.name);
  const own = [...urls].filter((u) => {
    try {
      const x = new URL(u);
      return x.host === location.host && !/vest-copier/.test(x.pathname);
    } catch {
      return false;
    }
  });
  let code = '';
  for (const u of own.slice(0, 60)) {
    try {
      code += await (await _fetch(u)).text();
    } catch {
      /* best effort: nothing to do if this fails */
    }
  }
  return code;
}

let _siteRun = 0;
export async function runSiteCheck(retry = false) {
  const fp = fingerprint(),
    sim = simSite();
  if (!userTokenOk()) {
    S.site = { fp, phase: 'waiting', wait: 'session', results: [], at: Date.now() };
    return render();
  }
  const run = ++_siteRun;
  const site = (S.site = {
    fp,
    phase: 'checking',
    running: true,
    retried: retry,
    at: Date.now(),
    results: SITE_CHECKS.map(([key, name, tier]) => ({ key, name, tier, status: 'pending', detail: '' })),
    shown: 0, // rows revealed so far (results arrive faster than they're shown)
  });
  render();
  const live = () => run === _siteRun && site.phase === 'checking';
  const pacer = setInterval(() => {
    const r = site.results[site.shown];
    if (!live() || !r) return clearInterval(pacer);
    if (r.status === 'pending') return;
    site.shown++;
    render();
  }, SITE_PACE_MS);
  const set = (key, status, detail) => {
    if (!live()) return;
    if (status === 'wait') {
      // Vest lists no active account: nothing to read from yet
      Object.assign(site, { phase: 'waiting', wait: 'accounts', empty: true, running: false, at: Date.now() });
      return render();
    }
    if (sim.has('fail') && key === 'code') [status, detail] = ['fail', 'No longer found: positionId (simulated)'];
    if (sim.has('warn') && (key === 'feed' || key === 'prices'))
      [status, detail] = ['warn', 'Not connected (simulated): copying works, a little slower'];
    Object.assign(
      site.results.find((r) => r.key === key),
      { status, detail },
    );
    render();
  };
  const probe = async (key, fn) => {
    if (!live()) return;
    if (sim.has('slow')) await sleep(700);
    const must = SITE_CHECKS.find((c) => c[0] === key)[2] === 'must';
    try {
      const [status, detail] = await fn();
      set(key, status, detail);
    } catch (e) {
      set(key, must ? 'fail' : 'warn', e.message);
    }
  };
  const missing = (o, keys) => keys.filter((k) => !o || typeof o !== 'object' || !(k in o));
  const fields = (o, keys, ok) => {
    const m = missing(o, keys);
    return m.length ? ['fail', 'Missing fields: ' + m.join(', ')] : ['pass', ok];
  };
  const sym = S.trade.symbol || 'NDX-USD-PERP';
  const codeP = readVestCode();

  const required = (async () => {
    let active = [],
      tok = null;
    await probe('accounts', async () => {
      const [a, b] = await Promise.all([
        api('/v3/capital/accounts/active'),
        api(`/v3/accounts?active=true&limit=${BALANCES_LIMIT}`),
      ]);
      if (!Array.isArray(a.accounts)) return ['fail', "The account list is gone from Vest's answer"];
      active = a.accounts;
      if (!active.length || sim.has('wait')) return ['wait'];
      if (!Array.isArray(b.accounts) || !b.accounts.length) return ['fail', 'No balances returned'];
      const m = [
        ...missing(active[0], ['id', 'initial_capital', 'max_drawdown_limit', 'account_type']),
        ...missing(b.accounts[0], ['account_id', 'amount']),
      ];
      return m.length
        ? ['fail', 'Missing fields: ' + m.join(', ')]
        : ['pass', `${active.length} active account(s), balances readable`];
    });
    if (!live()) return;
    const testId = (S.master && S.byId[S.master] ? S.master : null) || (active[0] && active[0].id);
    await probe('token', async () => {
      if (!testId) return ['fail', 'Not checked: no account to test with'];
      const r = await api('/v3/auth/account-token', userToken, {
        method: 'POST',
        body: JSON.stringify({ accountId: testId }),
      });
      tok = r.apiKey || r.accessToken;
      if (!tok) return ['fail', "No token in Vest's answer"];
      const c = decodeJwt(tok);
      if (c.accountId !== testId)
        return ['fail', 'The token no longer names its account (how the master is told apart)'];
      return [
        'pass',
        'canTrade' in c
          ? 'Account token issued'
          : 'Account token issued (its trading-status flag is gone: shown as unknown)',
      ];
    });
    await probe('leverage', async () => {
      const r = await api('/v3/user-state');
      if (!Array.isArray(r.accounts)) return ['fail', 'No accounts list in user-state'];
      if (!r.accounts.length) return ['fail', 'No accounts in user-state'];
      return fields(r.accounts[0], ['accountId', 'leverages'], 'Leverage per market readable');
    });
    await probe('positions', async () => {
      if (!tok) return ['fail', 'Not checked: no account token'];
      const [p, o] = await Promise.all([api('/v3/positions/opened', tok), api('/v3/positions/opened-orders', tok)]);
      const m = [...missing(p, ['positions']), ...missing(o, ['orders'])];
      return m.length ? ['fail', 'Missing: ' + m.join(', ')] : ['pass', 'Open positions and orders readable'];
    });
    await probe('fills', async () => {
      if (!tok) return ['fail', 'Not checked: no account token'];
      const now = Math.floor(Date.now() / 1000);
      const q = `account_id=${encodeURIComponent(testId)}&symbol=${encodeURIComponent(sym)}&from=${now - 86400}&to=${now}&limit=5`;
      const r = await api(`/v3/executions?${q}`, tok);
      if (!Array.isArray(r.items)) return ['fail', 'No items list'];
      if (!r.items.length) return ['pass', 'Readable (no recent fills to inspect)'];
      return fields(r.items[0], ['id', 'price'], 'Fill prices readable');
    });
    await probe('market', async () => {
      const r = await (await _fetch(`${API}/v3/exchangeInfo?symbols=${encodeURIComponent(sym)}`)).json();
      const x = (r.symbols || []).find((s) => s && s.symbol === sym);
      if (!x) return ['fail', `${symLabel(sym)} is missing from Vest's market list`];
      return fields(
        x,
        ['sizeDecimals', 'minTickSize', 'initMarginRatio'],
        `${symLabel(sym)}: tick, size step and margin readable`,
      );
    });
    await probe('code', async () => {
      const code = await codeP;
      if (!code) return ['fail', "Couldn't read Vest's code"];
      const lost = SCAN_TERMS.filter((t) => !hasTerm(code, t));
      return lost.length
        ? ['fail', 'No longer found: ' + lost.join(', ')]
        : ['pass', `All ${SCAN_TERMS.length} order endpoints and fields present`];
    });
  })();

  const extras = Promise.all([
    probe('feed', async () => {
      const code = await codeP;
      const lost = code ? FEED_TERMS.filter((t) => !hasTerm(code, t)) : [];
      const up = await waitUntil(() => _feed.ws && _feed.ws.readyState === 1, SITE_WAIT_MS);
      if (!up) return ['warn', 'Not connected: copying works, balances and closes are read every 20 s instead'];
      const gone = [...new Set([...lost, ...(_feed.missing || [])])];
      return gone.length
        ? ['warn', `Vest changed its live updates (${gone.join(', ')}): copying works, balances may lag a minute`]
        : ['pass', _feed.stateAt ? 'Connected, updates read' : 'Connected'];
    }),
    probe('prices', async () => {
      watchPrice(sym);
      const got = await waitUntil(() => priceOf(sym) != null, SITE_WAIT_MS);
      const p = S.price[sym] || {};
      const book = recentAt(p.bookAt);
      unwatchUnused();
      if (!got)
        return ['warn', `No live ${symLabel(sym)} price: breakeven and Max sizing wait for one, copying is unaffected`];
      return [
        'pass',
        book ? `${symLabel(sym)} order book streaming` : `${symLabel(sym)} price streaming (no order book yet)`,
      ];
    }),
    probe('chart', async () => {
      if (!/^\/trade(\/|$)/.test(location.pathname)) return ['skip', 'Checked on a trade page'];
      const f = await waitUntil(() => {
        const x = chartFrame();
        return x && x.contentWindow.tradingViewApi.activeChart() && x;
      }, SITE_WAIT_MS);
      const off = 'picking a limit on the chart, hiding marks and the theme may not work; copying is unaffected';
      if (!f) return ['warn', `Vest's chart wasn't found: ${off}`];
      const w = f.contentWindow,
        c = w.tradingViewApi.activeChart();
      const ok =
        typeof c.getCheckableActionState === 'function' &&
        typeof c.getAllStudies === 'function' &&
        typeof w.applyOverrides === 'function';
      return ok ? ['pass', 'TradingView tools reachable'] : ['warn', `Vest's chart changed: ${off}`];
    }),
    probe('claims', async () => {
      const code = await codeP;
      if (!code) return ['warn', "Couldn't read Vest's code"];
      return CLAIM_TERMS.every((t) => hasTerm(code, t))
        ? ['pass', 'Claim endpoint present']
        : ['warn', "Vest's claim endpoint is gone: claim on Vest's own page"];
    }),
  ]);

  await Promise.all([required, extras]);
  await waitUntil(() => !live() || site.shown >= site.results.length, SITE_PACE_MS * (site.results.length + 2));
  clearInterval(pacer);
  if (!live()) return;
  site.shown = site.results.length;
  site.running = false;
  finishSiteCheck(site);
}
const countStatus = (site, status) => site.results.filter((r) => r.status === status).length;
function finishSiteCheck(site) {
  const fails = site.results.filter((r) => r.status === 'fail'),
    warns = site.results.filter((r) => r.status === 'warn');
  site.doneAt = Date.now();
  diag('site_check', {
    fp: site.fp,
    pass: countStatus(site, 'pass'),
    warn: warns.length,
    fail: fails.length,
    results: site.results.map(({ key, status, detail }) => ({ key, status, detail })),
  });
  const gated = healthState().changed;
  if (fails.length) {
    site.phase = 'failed';
    const names = fails.map((r) => r.name).join(', ');
    logEvent(
      'warn',
      gated
        ? `Vest updated its site and the copier no longer matches it (${names}). Copying is off until a copier update.`
        : `Site check: ${names} failed. Diag has the details.`,
    );
  } else {
    const must = SITE_CHECKS.filter((c) => c[2] === 'must').length;
    logEvent('info', `Site check: all ${must} required checks passed.`);
    for (const r of warns) logEvent('warn', `${r.name}: ${r.detail}`);
    if (gated) acceptBuild(site);
    else site.phase = 'done';
  }
  render();
}
// Every required check passed on this build: remember it, show "All clear" for a moment.
function acceptBuild(site) {
  const fp = fingerprint();
  if (site.fp !== fp) {
    site.phase = 'done'; // the page changed build during the check: the next round checks that one
    return;
  }
  if (fp) {
    try {
      localStorage.setItem(BUILD_KEY, fp);
    } catch {
      /* best effort: nothing to do if this fails */
    }
  } else markUnknownBuildChecked();
  site.phase = 'accepted';
  site.acceptedAt = Date.now();
  logEvent('info', `Vest build ${fp || '(unknown)'} checked and accepted.`);
  diag('build_accepted', { fp, auto: true });
  setTimeout(render, ALL_CLEAR_MS + 50);
}
// What the panel shows in place of its tabs: 'checking' | 'waiting' | 'failed' while Vest's build isn't accepted,
// 'clear' for a moment once it is; null = the normal panel. An armed copier is never taken over.
export function siteGate() {
  const s = S.site;
  if (s && s.phase === 'accepted' && Date.now() - s.acceptedAt < ALL_CLEAR_MS) return 'clear';
  if (S.armed || !healthState().changed) return null;
  return s && s.fp === fingerprint() && s.phase !== 'done' ? s.phase : 'checking';
}
// Why an order from the panel (or automatic breakeven) has to wait, or null.
export const siteBlocks = () => {
  const g = siteGate();
  if (!g || g === 'clear') return null;
  return g === 'failed'
    ? "Vest changed something the copier relies on: use Vest's own panel until a copier update."
    : 'Vest updated its site: wait a moment for the check to finish.';
};
// Every second: start (or restart) the check whenever Vest's build isn't accepted and it can run.
export function autoSiteCheck() {
  if (S.armed || !healthState().changed) return;
  const fp = fingerprint(),
    s = S.site && S.site.fp === fp ? S.site : null;
  if (s && (s.running || s.phase === 'accepted')) return;
  if (s && s.phase === 'failed') {
    if (!s.retried && Date.now() - s.doneAt > SITE_RETRY_MS) runSiteCheck(true);
    return;
  }
  if (s && s.phase === 'waiting' && s.empty && Date.now() - s.at < SITE_EMPTY_MS) return;
  const wait = !userTokenOk() ? 'session' : !S.groups.length ? 'accounts' : null;
  if (!wait) return runSiteCheck();
  if (Date.now() - _bootAt < SITE_SETTLE_MS) return; // still loading: shown as "checking" until then
  if (!s || s.phase !== 'waiting' || s.wait !== wait) {
    S.site = { fp, phase: 'waiting', wait, results: [], at: Date.now() };
    render();
  }
}
// The site check view from the status bar (a fresh check unless this build's results are already in).
export function openSiteCheck() {
  if (siteGate()) return render();
  S.siteOpen = true;
  S.rulesOpen = false;
  S.supportOpen = false;
  S.summaryOpen = false;
  S.settingsOpen = false;
  S.tradeOpen = false;
  const have = S.site && S.site.fp === fingerprint() && S.site.results.length;
  if (!have && !(S.site && S.site.running)) runSiteCheck();
  else render();
}
