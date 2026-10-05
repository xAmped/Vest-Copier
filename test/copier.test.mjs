// End-to-end tests, run in headless Chrome against a MOCKED Vest API (no network, no real accounts).
// Loads the real userscript and checks the site check and drift guard, adopting an open trade, the Trade tab
// (sizing, scale-outs, re-anchor, adding to a trade, breakeven), leg copying (move / add / remove / resize),
// cap-to-fit sizing, leverage rules, fill confirmation and orphans, and ordering of copied actions.
//   CHROME_PATH=/path/to/chrome node test/copier.test.mjs
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = readFileSync(resolve(here, '../src/vest-copier.user.js'), 'utf8');
// Any Chrome or Chromium works: set CHROME_PATH. Defaults to the headless shell the local video project installs.
const CHROME =
  process.env.CHROME_PATH ||
  resolve(
    here,
    '../video/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell',
  );
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Stand-in for Vest's JS bundle: contains the endpoint paths & payload fields the code scan looks for.
const BUNDLE = `var a="/v3/positions/open",ap="/v3/positions/append",b="/v3/positions/reduce",c="/v3/positions/close",d="/v3/positions/cancel-order",
e="/v3/auth/account-token",f="/v3/positions/opened-orders",g="/v3/executions",h="/v3/user-state";
var p={takeProfits:[],stopLosses:[],reduceOnly:!0,timeInForce:"IOC",triggerPrice:1};`;

const page = (cfg) => `<!doctype html><html><head><script>
localStorage.clear();
localStorage.setItem('vc-known-build-v3', ${JSON.stringify(cfg.knownBuild || 'OLDBUILD00')});   // last accepted build
if (!${JSON.stringify(!!cfg.noAck)}) localStorage.setItem('vc-ack', JSON.stringify({ v: 2 }));   // terms already accepted
if (${JSON.stringify(!!cfg.opts)}) localStorage.setItem('vc-opts', ${JSON.stringify(JSON.stringify(cfg.opts || {}))});
if (${JSON.stringify(!!cfg.plans)}) localStorage.setItem('vc-plans', ${JSON.stringify(JSON.stringify(cfg.plans || {}))});
if (${JSON.stringify(!!cfg.trade)}) localStorage.setItem('vc-trade', ${JSON.stringify(JSON.stringify(cfg.trade || {}))});
window.__NEXT_DATA__ = { buildId: 'NEWBUILD123456' };      // Vest shipped a new build
const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\\+/g, '-').replace(/\\//g, '_');
const jwt = (c) => 'eyJhbGciOiJIUzI1NiJ9.' + b64(c) + '.sig';
const exp = () => Math.floor(Date.now() / 1000) + 3600;
window.USER = jwt({ userId: 'u1', exp: exp() });
window.ACCT = (id) => jwt({ accountId: id, canTrade: true, exp: exp() });
const J = (o, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { 'x-ratelimit-remaining': '190', 'x-ratelimit-limit': '200' } });
const CFG = ${JSON.stringify(cfg)};
const BROKEN = !!CFG.broken;
window.SENT = [];   // every order sent: { acct, method, path, body }
window.POS = {}; window.FILLS = {};   // per-account open positions (with legs) and fills, created by mocked opens
// fake public market-data socket: acks SUBSCRIBE, then streams NDX ticker frames in Vest's format
window.WebSocket = class {
  constructor() { this.readyState = 0; setTimeout(() => { this.readyState = 1; this.onopen && this.onopen(); }, 20); }
  send(raw) {
    const m = JSON.parse(raw);
    if (m.method !== 'SUBSCRIBE') return;
    this.onmessage && this.onmessage({ data: JSON.stringify({ result: null, subscription_outcomes: m.params.map((p) => ({ requested: p, stream: p, status: 'registered' })), id: m.id }) });
    clearInterval(this.t);
    this.t = setInterval(() => this.onmessage && this.onmessage({ data: JSON.stringify({ channel: 'NDX-USD-PERP@ticker', data: { symbol: 'NDX-USD-PERP', markPrice: String(window.MARK || CFG.markPrice || 31221.3), indexPrice: '31225', status: 'TRADING' }, tsMs: Date.now() }) }), 150);
  }
  close() { clearInterval(this.t); this.readyState = 3; }
};
const real = window.fetch.bind(window);
let n = 0;
window.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url.startsWith('https://raw.githubusercontent.com/')) return new Response('// ==UserScript==\\n// @version      ' + (CFG.latestVersion || '0.0.1') + '\\n');
  if (url.includes('/api/v2/referrals/rewards')) {
    if (!CFG.rewards) return real(input, init);   // not mocked: unreadable, so the support question is never offered
    return J({ rewards: [], signup_ref_discount: CFG.rewards.code ? { code: CFG.rewards.code } : null });
  }
  if (!url.startsWith('https://api-gateway')) return real(input, init);
  const p = new URL(url).pathname;
  const acct = (a, i) => ({ id: a, initial_capital: '500', max_drawdown_limit: '490', account_type: 3, plan_product_type: 'instant_funded', plan_id: 'plan-x', attempt_index: i, max_leverage: '5.0000' });
  if (p === '/v3/capital/accounts/active') return J({ accounts: [acct('A07', 6), acct('A08', 7), acct('A09', 8)] });
  if (p === '/v3/accounts') return J({ accounts: [{ account_id: 'A07', amount: '500' }, { account_id: 'A08', amount: '500' }, { account_id: 'A09', amount: '500' }] });
  if (p === '/v3/trading-performance/series') return J({ items: [{ account_id: 'A07', ts: 1, equity_value: '501' }, { account_id: 'A08', ts: 1, equity_value: '499' }] });
  const levs = (a) => { const v = CFG.lev && a in CFG.lev ? CFG.lev[a] : '50'; return v == null ? [] : [{ symbol: 'NDX-USD-PERP', leverage: v }]; };
  if (p === '/v3/user-state') return J(BROKEN ? { profile: {} } : { accounts: [{ accountId: 'A07', leverages: levs('A07') }, { accountId: 'A08', leverages: levs('A08') }] });
  if (p === '/v3/auth/account-token') { const id = JSON.parse(init.body).accountId; return J({ apiKey: ACCT(id), accessExpiresAtMs: Date.now() + 900000 }); }
  const h = init.headers || {}; const auth = h.Authorization || h.authorization || '';
  let who = null; try { who = JSON.parse(atob(auth.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).accountId; } catch {}
  if (p === '/v3/positions/opened') return J({ positions: (CFG.positions || {})[who] || (POS[who] && POS[who].length ? POS[who] : null) });
  if (p === '/v3/positions/opened-orders') return J({ orders: (CFG.orders || {})[who] || null });
  const method = (init.method || 'GET').toUpperCase();
  const body = init.body ? JSON.parse(init.body) : {};
  if (who === 'A07' && (CFG.netFail || []).includes(method + ' ' + p)) { SENT.push({ acct: who, method, path: p, body, failed: true }); throw new TypeError('Failed to fetch'); }
  if (who === 'A07' && (CFG.refuse || []).includes(method + ' ' + p)) { SENT.push({ acct: who, method, path: p, body, refused: true }); return J({ message: 'refused' }, 400); }
  if (p === '/v2/referrals/join' && CFG.joinFail) { SENT.push({ acct: who, method, path: p, body }); return J({ message: 'invalid referral code' }, 400); }
  if (p === '/v2/referrals/join') { SENT.push({ acct: who, method, path: p, body }); return J({ ref_code: body.refCode }); }
  if (p === '/v3/positions/close' || p === '/v3/positions/reduce' || p === '/v3/positions/cancel-order') { SENT.push({ acct: who, method, path: p, body }); n++; return J({ orderId: 'C' + n }); }
  if (p === '/v3/positions/open') {
    n++; SENT.push({ acct: who, method, path: p, body, at: performance.now() });
    const myN = n;
    if (CFG.slowOpen && who !== 'A07') await new Promise((r) => setTimeout(r, CFG.slowOpen));   // a slow follower open
    n = Math.max(n, myN);
    // Vest: an open on a symbol you already hold is accepted (ids returned) but never executed (positionAlreadyExists)
    if ((POS[who] || []).some((x) => x.symbol === body.symbol)) return J({ positionId: 'P' + myN, accountId: who, orderId: 'O' + myN, stopLossIds: [], takeProfitIds: [], delayedOrderStatus: 'created' });
    const tps = (body.takeProfits || []).map((l, i) => ({ id: 'TP' + myN + '_' + i, executionType: l.executionType, triggerPrice: l.triggerPrice, quantity: l.quantity, sizeMode: l.quantity ? 'fixed' : 'full_position' }));
    const sls = (body.stopLosses || []).map((l, i) => ({ id: 'SL' + myN + '_' + i, executionType: l.executionType, triggerPrice: l.triggerPrice, sizeMode: 'full_position' }));
    const pos = { positionId: 'P' + myN, accountId: who, symbol: body.symbol, side: body.side, quantity: body.quantity, openPrice: String(CFG.bogusOpenPrice || CFG.fillPrice || 31221.25), leverage: body.leverage, takeProfits: tps, stopLosses: sls, orders: [] };
    (POS[who] = POS[who] || []).push(pos);
    if (body.orderType !== 'limit') (FILLS[who] = FILLS[who] || []).push({ id: 'O' + myN, price: String(CFG.fillPrice || 31221.25), quantity: body.quantity, executedAt: Math.floor(Date.now() / 1000) });
    return J({ positionId: pos.positionId, accountId: who, orderId: 'O' + myN, commandId: 'c' + myN, stopLossIds: sls.map((l) => l.id), takeProfitIds: tps.map((l) => l.id), delayedOrderStatus: 'created' });
  }
  if (p === '/v3/positions/append') {
    n++; SENT.push({ acct: who, method, path: p, body, at: performance.now() });
    const pos = (POS[who] || []).find((x) => x.positionId === body.positionId);
    const px = CFG.addFillPrice || CFG.fillPrice || 31221.25;
    if (pos && (body.isBuy === (pos.side === 'long'))) {
      const q0 = parseFloat(pos.quantity), q1 = parseFloat(body.quantity);
      pos.openPrice = String(+((parseFloat(pos.openPrice) * q0 + px * q1) / (q0 + q1)).toFixed(6));
      pos.quantity = String(+(q0 + q1).toFixed(4));
      (FILLS[who] = FILLS[who] || []).push({ id: 'O' + n, price: String(px), quantity: body.quantity, executedAt: Math.floor(Date.now() / 1000) });
    }
    return J({ orderId: 'O' + n, commandId: 'c' + n });
  }
  if (p === '/v3/positions/stop-loss' || p === '/v3/positions/take-profit') {
    n++; SENT.push({ acct: who, method, path: p, body, at: performance.now() });
    const pos = (POS[who] || []).find((x) => x.positionId === body.positionId);
    const arr = pos && (p.endsWith('stop-loss') ? pos.stopLosses : pos.takeProfits);
    const legId = body.stopLossId || body.takeProfitId || body.orderId || body.id;
    if (arr && method === 'POST') arr.push({ id: (p.endsWith('stop-loss') ? 'SLx' : 'TPx') + n, executionType: body.executionType, triggerPrice: body.triggerPrice, quantity: body.quantity, sizeMode: body.quantity ? 'fixed' : 'full_position' });
    if (arr && method === 'PUT') { const l = arr.find((x) => x.id === legId); if (l) { l.triggerPrice = body.triggerPrice; if (body.quantity != null) l.quantity = body.quantity; } }
    if (arr && method === 'DELETE') { const i = arr.findIndex((x) => x.id === legId); if (i >= 0) arr.splice(i, 1); }
    return J({ commandId: 'c' + n });
  }
  if (p === '/v3/executions') return CFG.execFail ? J({ error: 'down' }, 500) : J({ items: FILLS[who] || [] });
  if (p === '/v3/positions/open') { n++; return J({ positionId: 'P' + n, orderId: 'O' + n, stopLossIds: [], takeProfitIds: [] }); }
  if (p.includes('/leverages/')) return J({});
  if (p === '/v3/ticker/latest') return J({ tickers: [{ symbol: 'NDX-USD-PERP', markPrice: String(CFG.markPrice || 31221.3) }] });
  if (p === '/v3/exchangeInfo') return J({ symbols: [{ symbol: 'NDX-USD-PERP', displaySymbol: 'NQ-PERP', sizeDecimals: 4, priceDecimals: 2, minTickSize: '0.25', defaultTickSize: '0.25',
    initMarginRatio: '0.02000000', fundedInitMarginRatio: '0.02000000', capitalInitMarginRatio: '0.02000000', capitalPlans: [{ accountType: 3, planId: 'plan-other', initMarginRatio: '0.02000000' }] }] });
  return J({ error: 'unmocked ' + p }, 404);
};
</script>
<script src="/vest-bundle.js"></script>
<script src="/vest-copier.user.js"></script>
<script>
// the "page" makes an authorized request, which is how the copier picks up the session
document.addEventListener('DOMContentLoaded', () => fetch('https://api-gateway.hz.vestmarkets.com/v3/accounts', { headers: { Authorization: 'Bearer ' + USER } }));
</script></head><body></body></html>`;

let CFG = {};
const server = createServer((req, res) => {
  if (req.url === '/vest-copier.user.js') {
    res.setHeader('content-type', 'text/javascript; charset=utf-8');
    // CFG.garbled: the script as a legacy-code-page tool would mangle it (every non-ASCII character re-encoded)
    return res.end(CFG.garbled ? Buffer.from(Buffer.from(SCRIPT, 'utf8').toString('latin1'), 'utf8') : SCRIPT);
  }
  if (req.url === '/vest-bundle.js') {
    res.setHeader('content-type', 'text/javascript');
    return res.end(BUNDLE);
  }
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end(page(CFG));
}).listen(0);
const ORIGIN = `http://127.0.0.1:${server.address().port}/`;

const PORT = 9341;
const profile = resolve(tmpdir(), `vc-test-${process.pid}`);
const chrome = spawn(
  CHROME,
  [
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-zygote',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let failures = 0;
const ok = (cond, label) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`);
  if (!cond) failures++;
};

try {
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    try {
      target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page');
    } catch {
      await sleep(150);
    }
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let seq = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    } else if (m.method === 'Runtime.exceptionThrown')
      console.log(
        '      [page exception] ' +
          (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0],
      );
    else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
      console.log(
        '      [page console.error] ' +
          m.params.args
            .map((a) => a.value ?? a.description)
            .join(' ')
            .slice(0, 200),
      );
  };
  const send = (method, params = {}) =>
    new Promise((r) => {
      const id = ++seq;
      pending.set(id, r);
      ws.send(JSON.stringify({ id, method, params }));
    });
  const js = async (expr) => {
    const r = (
      await send('Runtime.evaluate', {
        expression: `(async () => { ${expr} })()`,
        awaitPromise: true,
        returnByValue: true,
      })
    ).result;
    if (r.exceptionDetails)
      throw new Error(
        'page error: ' +
          (r.exceptionDetails.exception?.description || r.exceptionDetails.text) +
          '\n  in: ' +
          expr.slice(0, 120),
      );
    return r.result.value;
  };
  const R = `const R = document.getElementById('vc-host').shadowRoot;`;
  const until = async (expr, ms = 8000) => {
    for (let t = 0; t < ms; t += 100) {
      try {
        if (await js(expr)) return true;
      } catch {}
      await sleep(100);
    }
    return false;
  };
  const logText = () => js(`${R} return R.querySelector('.log').innerText;`);

  // ── Scenario A: healthy API after a Vest update ──
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: ORIGIN });
  ok(await until(`${R} return !!R.querySelector('[data-m="A07"]');`), 'accounts load from the mocked API');
  const htext = await js(`${R} return R.querySelector('.htext').textContent;`);
  ok(htext.includes('Vest updated'), `health bar flags the update ("${htext}")`);

  await js(
    `${R} R.querySelector('[data-m="A07"]').click(); R.querySelector('[data-f="A08"]').click(); R.querySelector('[data-act="arm"]').click(); return true;`,
  );
  await sleep(300);
  ok(/Not armed .*Vest updated/.test(await logText()), 'ARM is blocked until the update is reviewed');
  ok(await js(`${R} return !!R.querySelector('#sc-run');`), 'site check opens automatically');
  ok(await until(`${R} const b = R.querySelector('#sc-run'); return b && !b.disabled;`), 'site check completes');

  const rows = await js(
    `${R} return [...R.querySelectorAll('.sc-row')].map(r => r.querySelector('.dot').className.split(' ')[1] + ' ' + r.querySelector('.sc-name').textContent + ' | ' + r.querySelector('.sc-detail').textContent);`,
  );
  rows.forEach((r) => console.log('      ' + r));
  ok(rows.length === 9 && rows.every((r) => r.startsWith('green')), 'all 9 checks pass on a healthy API');
  if (process.env.SHOT) {
    // SHOT=path.png node test/copier.test.mjs  → screenshot of the site-check view
    await send('Emulation.setDeviceMetricsOverride', { width: 520, height: 900, deviceScaleFactor: 2, mobile: false });
    await sleep(300);
    const { data } = (await send('Page.captureScreenshot', { format: 'png' })).result;
    (await import('node:fs')).writeFileSync(process.env.SHOT, Buffer.from(data, 'base64'));
  }
  ok(await js(`${R} return !R.querySelector('#sc-accept').disabled;`), '"Accept this build" is enabled');

  await js(`${R} R.querySelector('#sc-accept').click(); return true;`);
  await sleep(200);
  const after = await js(`${R} return R.querySelector('.htext').textContent;`);
  ok(after === 'build NEWBUILD12', `badge clears to the new build ("${after}")`);
  ok(await js(`return localStorage.getItem('vc-known-build-v3') === 'NEWBUILD12';`), 'accepted build is remembered');

  await js(`${R} R.querySelector('[data-act="arm"]').click(); return true;`);
  ok(
    await until(`${R} return R.querySelector('[data-act="arm"]').textContent === 'DISARM';`),
    'arms normally after accepting',
  );

  // master sends an order whose payload has drifted: `leverage` missing, a new `clientTag` field added
  await js(`await fetch('https://api-gateway.hz.vestmarkets.com/v3/positions/open', { method: 'POST', headers: { Authorization: 'Bearer ' + ACCT('A07') },
    body: JSON.stringify({ side: 'long', symbol: 'NDX-USD-PERP', quantity: '0.20', orderType: 'market', timeInForce: 'IOC', clientTag: 'x' }) }); return true;`);
  await sleep(600);
  const log = await logText();
  ok(/open order has changed .*missing leverage/.test(log), 'drifted order: missing field flagged');
  ok(/new field\(s\): clientTag/.test(log), 'drifted order: new field flagged');
  const diagHas = (type) =>
    until(`return JSON.parse(localStorage.getItem('vc-diag') || '[]').some(d => d.type === '${type}');`, 4000);
  ok(await diagHas('site_check'), 'site check recorded in Diag');
  ok(await diagHas('payload_drift'), 'payload drift recorded in Diag');
  ok(await diagHas('build_accepted'), 'build acceptance recorded in Diag');

  // a normal order raises no drift warning
  const before = (log.match(/has changed|new field/g) || []).length;
  await js(`await fetch('https://api-gateway.hz.vestmarkets.com/v3/positions/open', { method: 'POST', headers: { Authorization: 'Bearer ' + ACCT('A07') },
    body: JSON.stringify({ side: 'long', symbol: 'NDX-USD-PERP', quantity: '0.20', leverage: '50', orderType: 'market', timeInForce: 'IOC', takeProfits: [], stopLosses: [] }) }); return true;`);
  await sleep(600);
  ok(((await logText()).match(/has changed|new field/g) || []).length === before, 'normal order: no false alarm');

  // ── Scenario B: Vest changed an endpoint the copier reads ──
  CFG = { broken: true };
  await send('Page.navigate', { url: ORIGIN + '?b' });
  await until(
    `const h = document.getElementById('vc-host'); return h && !!h.shadowRoot.querySelector('[data-m="A07"]');`,
  );
  await js(`${R} R.querySelector('.health').click(); return true;`);
  ok(
    await until(`${R} const b = R.querySelector('#sc-run'); return b && !b.disabled;`),
    'site check completes (broken API)',
  );
  const bad = await js(
    `${R} return [...R.querySelectorAll('.sc-row')].filter(r => r.querySelector('.dot.red')).map(r => r.querySelector('.sc-name').textContent + ' | ' + r.querySelector('.sc-detail').textContent);`,
  );
  bad.forEach((r) => console.log('      red: ' + r));
  ok(bad.length === 1 && bad[0].startsWith('Leverage read'), 'broken endpoint is pinpointed');
  ok(
    await js(`${R} return R.querySelector('#sc-accept').disabled;`),
    '"Accept this build" is disabled when a check fails',
  );

  // ── Adopt open trade ──
  const pos = (id, acct, side, qty) => ({
    positionId: id,
    accountId: acct,
    accountType: 2,
    symbol: 'NDX-USD-PERP',
    side,
    quantity: qty,
    openPrice: '31221.250000000',
    leverage: '50',
    stopLosses: [],
    takeProfits: [],
    stopLossHistory: [],
    takeProfitHistory: [],
    orders: [],
  });
  const armWith = async (cfg, followers) => {
    CFG = { knownBuild: 'NEWBUILD12', ...cfg };
    await send('Page.navigate', { url: ORIGIN + '?' + Math.random() });
    await until(
      `const h = document.getElementById('vc-host'); return h && !!h.shadowRoot.querySelector('[data-m="A07"]');`,
    );
    await js(
      `${R} R.querySelector('[data-m="A07"]').click(); ${followers.map((f) => `R.querySelector('[data-f="${f}"]').click();`).join(' ')} R.querySelector('[data-act="arm"]').click(); return true;`,
    );
    await until(`${R} const t = R.querySelector('.log').innerText; return /ARMED|Not armed/.test(t);`);
    await sleep(300);
    return logText();
  };
  const master = (path, body) =>
    js(
      `await fetch('https://api-gateway.hz.vestmarkets.com${path}', { method: 'POST', headers: { Authorization: 'Bearer ' + ACCT('A07') }, body: JSON.stringify(${JSON.stringify(body)}) }); await new Promise(r => setTimeout(r, 400)); return SENT.filter(x => x.acct !== 'A07');`,
    );

  let L = await armWith(
    { positions: { A07: [pos('P07', 'A07', 'long', '1.9041')], A08: [pos('P08', 'A08', 'long', '1.9041')] } },
    ['A08', 'A09'],
  );
  ok(
    await js(`${R} return R.querySelector('[data-act="arm"]').textContent === 'DISARM';`),
    'adopt: arms while master + follower are in the same trade',
  );
  ok(
    /Adopted open trade: long 1\.9041 NDX-USD-PERP — master Account 07 \+ Account 08/.test(L),
    'adopt: logs the adopted trade',
  );
  ok(
    /Account 09 is flat — it joins from the next trade/.test(L),
    'adopt: flat follower is left alone (joins next trade)',
  );
  let sent = await master('/v3/positions/reduce', {
    positionId: 'P07',
    orderType: 'market',
    leverage: '50',
    quantity: '0.5000',
    timeInForce: 'IOC',
    reduceOnly: true,
    symbol: 'NDX-USD-PERP',
  });
  ok(
    sent.length === 1 &&
      sent[0].acct === 'A08' &&
      sent[0].path === '/v3/positions/reduce' &&
      sent[0].body.positionId === 'P08' &&
      sent[0].body.quantity === '0.5000',
    `adopt: master partial exit copies to the adopted position (${JSON.stringify(sent.map((x) => [x.acct, x.path.split('/').pop(), x.body.positionId, x.body.quantity]))})`,
  );
  sent = await master('/v3/positions/close', {
    symbol: 'NDX-USD-PERP',
    positionId: 'P07',
    orderType: 'market',
    leverage: '50',
  });
  const closes = sent.filter((x) => x.path === '/v3/positions/close');
  ok(
    closes.length === 1 && closes[0].acct === 'A08' && closes[0].body.positionId === 'P08',
    'adopt: master close closes the adopted follower position (and only it)',
  );

  L = await armWith(
    { positions: { A07: [pos('P07', 'A07', 'long', '2.0000')], A08: [pos('P08', 'A08', 'long', '1.0000')] } },
    ['A08'],
  );
  sent = await master('/v3/positions/reduce', {
    positionId: 'P07',
    orderType: 'market',
    leverage: '50',
    quantity: '1.0000',
    timeInForce: 'IOC',
    reduceOnly: true,
    symbol: 'NDX-USD-PERP',
  });
  ok(
    sent.length === 1 && sent[0].body.quantity === '0.5',
    `adopt: different sizes reduce proportionally, Vest-formatted (follower reduced ${sent[0] && sent[0].body.quantity} of 1.0000)`,
  );

  L = await armWith(
    { positions: { A07: [pos('P07', 'A07', 'long', '1.9041')], A08: [pos('P08', 'A08', 'short', '1.9041')] } },
    ['A08'],
  );
  ok(
    /Not armed — Account 08 is short NDX-USD-PERP but the master is long — opposite direction/.test(L),
    'refuses: follower in the opposite direction',
  );
  L = await armWith({ positions: { A08: [pos('P08', 'A08', 'long', '1.9041')] } }, ['A08']);
  ok(
    /Not armed — Account 08 holds long NDX-USD-PERP but the master doesn't/.test(L),
    "refuses: follower in a trade the master isn't",
  );
  L = await armWith({ orders: { A08: [{ order_id: 'X1' }] } }, ['A08']);
  ok(/Not armed — resting orders on Account 08/.test(L), 'refuses: resting orders');
  L = await armWith({}, ['A08', 'A09']);
  ok(
    (await js(`${R} return R.querySelector('[data-act="arm"]').textContent === 'DISARM';`)) && !/Adopted/.test(L),
    'everyone flat: arms normally, nothing adopted',
  );

  // ── Trade panel ──
  CFG = { knownBuild: 'NEWBUILD12', markPrice: 31221.3 };
  await send('Page.navigate', { url: ORIGIN + '?trade' });
  await until(
    `const h = document.getElementById('vc-host'); return h && !!h.shadowRoot.querySelector('[data-m="A07"]');`,
  );
  await js(
    `localStorage.removeItem('vc-trade'); ${R} R.querySelector('[data-m="A07"]').click(); R.querySelector('[data-tab="trade"]').click(); return true;`,
  );
  ok(
    await until(`${R} const p = R.querySelector('#tr-px'); return p && p.textContent === '31,221.30';`),
    'trade: live mark price streams in (31,221.30)',
  );
  const tq = () => js(`${R} return [0,1,2].map(i => R.querySelector('#tq' + i).textContent);`);
  ok(
    JSON.stringify(await tq()) === JSON.stringify(['0.3334', '0.3333', '0.3333']),
    `trade: default 1.0 split evenly over 3 targets (${await tq()})`,
  );
  await js(`${R} R.querySelector('[data-seg="scale"] [data-v="start"]').click(); return true;`);
  ok(
    JSON.stringify(await tq()) === JSON.stringify(['0.5', '0.3333', '0.1667']),
    `trade: Start scale front-loads (${await tq()})`,
  );
  await js(`${R} R.querySelector('[data-seg="scale"] [data-v="end"]').click(); return true;`);
  ok(
    JSON.stringify(await tq()) === JSON.stringify(['0.1667', '0.3333', '0.5']),
    `trade: End scale back-loads (${await tq()})`,
  );
  const prev = await js(`${R} return R.querySelector('#tr-preview').innerText;`);
  ok(
    /Buy stop 31,201.25 · TP1 31,241.25 · TP2 31,261.25 · TP3 31,281.25/.test(prev) &&
      /Sell stop 31,241.25 · TP1 31,201.25/.test(prev),
    'trade: point distances become tick-rounded prices for both sides',
  );
  await js(
    `${R} R.querySelector('[data-seg="sizeMode"] [data-v="risk"]').click(); const i = R.querySelector('#tr-size'); i.value = '50'; i.dispatchEvent(new Event('input')); return true;`,
  );
  ok(
    (await js(`${R} return R.querySelector('#tr-buy').textContent;`)) === 'Buy 2.5',
    'trade: risk $50 with a 20-pt stop sizes to 2.5 contracts',
  );
  const sum = await js(`${R} return R.querySelector('#tr-sum').innerText;`);
  ok(/Risk \$50\.00/.test(sum), `trade: summary shows risk and reward (${sum})`);
  await js(`${R} R.querySelector('#tr-add').click(); return true;`);
  ok(
    (await js(`${R} return R.querySelectorAll('.tr-tgt').length;`)) === 4 &&
      (await js(`${R} return R.querySelector('[data-t="3"]').value;`)) === '80',
    'trade: "+ Add target" adds TP4 at 80 pts',
  );
  await js(
    `${R} const i = R.querySelector('[data-t="1"]'); i.focus(); i.value = '35'; i.dispatchEvent(new Event('input')); return true;`,
  );
  await js(`${R} R.querySelector('[data-act="arm"]'); return true;`);
  await sleep(400); // price ticks re-render numbers; the field being edited must keep its value and focus
  ok(
    await js(`${R} const i = R.querySelector('[data-t="1"]'); return i.value === '35' && R.activeElement === i;`),
    'trade: live updates never wipe the field you are typing in',
  );
  ok(
    await js(`return JSON.parse(localStorage.getItem('vc-trade')).targets[1] === 35;`),
    'trade: settings are remembered',
  );
  ok(
    await js(
      `${R} const hdr = R.querySelector('.hdr').getBoundingClientRect(); return [...R.querySelectorAll('.hdr button, .tabs .tab')].every(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.right <= hdr.right + 0.5; });`,
    ),
    'header + tabs: every control fits (nothing pushed off the edge)',
  );
  await js(`${R} R.querySelector('[data-tab="accounts"]').click(); return true;`);
  ok(
    await js(
      `${R} return !!R.querySelector('[data-m="A07"]') && R.querySelector('[data-tab="accounts"]').classList.contains('on');`,
    ),
    'tabs: Accounts returns to the account list',
  );
  await js(`${R} R.querySelector('[data-tab="trade"]').click(); return true;`);
  if (process.env.SHOT_TRADE) {
    await send('Emulation.setDeviceMetricsOverride', { width: 520, height: 1180, deviceScaleFactor: 2, mobile: false });
    await js(`${R} R.querySelector('.panel').style.maxHeight = '1150px'; return true;`);
    await sleep(400);
    const { data } = (await send('Page.captureScreenshot', { format: 'png' })).result;
    (await import('node:fs')).writeFileSync(process.env.SHOT_TRADE, Buffer.from(data, 'base64'));
  }

  // ── Trade panel: sending, breakeven, and the copier following every leg ──
  const panelPage = async (cfg, { arm = [], trade = {} } = {}) => {
    CFG = {
      knownBuild: 'NEWBUILD12',
      markPrice: 31221.3,
      fillPrice: 31221.25,
      ...cfg,
      trade: {
        symbol: 'NDX-USD-PERP',
        sizeMode: 'qty',
        qty: 1,
        risk: 50,
        stopPts: 20,
        targets: [20, 40, 60],
        scale: 'end',
        beMode: 'tp1',
        beTrigger: 15,
        beOffset: 1,
        ...trade,
      },
    };
    await send('Page.navigate', { url: ORIGIN + '?' + Math.random() });
    await until(
      `const h = document.getElementById('vc-host'); return h && !!h.shadowRoot.querySelector('[data-m="A07"]');`,
    );
    await js(
      `${R} R.querySelector('[data-m="A07"]').click(); ${arm.map((f) => `R.querySelector('[data-f="${f}"]').click();`).join(' ')} return true;`,
    );
    if (arm.length) {
      await js(`${R} R.querySelector('[data-act="arm"]').click(); return true;`);
      await until(`${R} return R.querySelector('[data-act="arm"]').textContent === 'DISARM';`);
    }
    await js(`${R} R.querySelector('[data-tab="trade"]').click(); return true;`);
    await until(`${R} const b = R.querySelector('#tr-buy'); return b && !b.disabled;`);
  };
  const buy = async () => {
    await js(`${R} R.querySelector('#tr-buy').click(); return true;`);
    await sleep(900);
  };
  const sentBy = (acct, path, method) =>
    js(
      `return SENT.filter(x => x.acct === ${JSON.stringify(acct)}${path ? ` && x.path === ${JSON.stringify(path)}` : ''}${method ? ` && x.method === ${JSON.stringify(method)}` : ''});`,
    );
  const masterSend = (method, path, body) =>
    js(
      `await fetch('https://api-gateway.hz.vestmarkets.com${path}', { method: '${method}', headers: { Authorization: 'Bearer ' + ACCT('A07') }, body: JSON.stringify(${JSON.stringify(body)}) }); await new Promise(r => setTimeout(r, 1300)); return true;`,
    );

  // 1) master only: 3 targets, End scale
  await panelPage({});
  await buy();
  let o = (await sentBy('A07', '/v3/positions/open'))[0];
  ok(
    !!o &&
      o.body.side === 'long' &&
      o.body.quantity === '1' &&
      o.body.orderType === 'market' &&
      o.body.timeInForce === 'IOC' &&
      o.body.leverage === '50',
    `send: market BUY 1 at the master's 50x leverage (${o && JSON.stringify({ q: o.body.quantity, lev: o.body.leverage })})`,
  );
  ok(
    !!o &&
      JSON.stringify(o.body.stopLosses) === JSON.stringify([{ executionType: 'market', triggerPrice: '31201.25' }]),
    `send: stop is a full-position leg 20 pts below (${o && JSON.stringify(o.body.stopLosses)})`,
  );
  ok(
    !!o &&
      JSON.stringify(o.body.takeProfits) ===
        JSON.stringify([
          { executionType: 'market', triggerPrice: '31241.25', quantity: '0.1667' },
          { executionType: 'market', triggerPrice: '31261.25', quantity: '0.3333' },
          { executionType: 'market', triggerPrice: '31281.25', quantity: '0.5' },
        ]),
    `send: 3 sized targets, End scale, Vest-formatted (${o && JSON.stringify(o.body.takeProfits)})`,
  );
  ok(
    /Trade panel: BUY 1 NQ · stop 31201\.25 · TP1 31241\.25 × 0\.1667/.test(await logText()),
    'send: logged in the activity log',
  );
  ok(
    await until(
      `${R} return /Long NQ @ 31,221.25 · stop → 31,222.25 after TP1/.test(R.querySelector('#tr-plans').innerText);`,
    ),
    'breakeven: watching, entry from the real fill',
  );
  if (process.env.SHOT_PLAN) {
    await send('Emulation.setDeviceMetricsOverride', { width: 520, height: 1240, deviceScaleFactor: 2, mobile: false });
    await js(`${R} R.querySelector('.panel').style.maxHeight = '1220px'; return true;`);
    await sleep(300);
    (await import('node:fs')).writeFileSync(
      process.env.SHOT_PLAN,
      Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'),
    );
    await send('Emulation.clearDeviceMetricsOverride', {});
  }
  await js(`window.MARK = 31241.5; return true;`); // price reaches TP1
  ok(
    await until(
      `return SENT.some(x => x.acct === 'A07' && x.method === 'PUT' && x.path === '/v3/positions/stop-loss');`,
      4000,
    ),
    'breakeven: TP1 reached -> master stop moved',
  );
  let be = (await sentBy('A07', '/v3/positions/stop-loss', 'PUT'))[0];
  ok(
    !!be &&
      be.body.triggerPrice === '31222.25' &&
      be.body.stopLossId === (await js(`return POS.A07[0].stopLosses[0].id;`)) &&
      be.body.positionId === (await js(`return POS.A07[0].positionId;`)),
    `breakeven: to entry +1 pt on the right stop leg (${be && JSON.stringify(be.body)})`,
  );
  await sleep(500);
  ok((await sentBy('A07', '/v3/positions/stop-loss', 'PUT')).length === 1, 'breakeven: moves once, not on every tick');

  // 2) one target = whole position (no quantity), like Vest's ticket
  await panelPage({}, { trade: { targets: [25], beMode: 'off' } });
  await buy();
  o = (await sentBy('A07', '/v3/positions/open'))[0];
  ok(
    !!o &&
      JSON.stringify(o.body.takeProfits) === JSON.stringify([{ executionType: 'market', triggerPrice: '31246.25' }]),
    `send: a single target has no quantity (full position) (${o && JSON.stringify(o.body.takeProfits)})`,
  );
  ok(
    (await js(`return Object.keys(JSON.parse(localStorage.getItem('vc-plans') || '{}')).length;`)) === 0,
    'breakeven off: nothing watched',
  );

  // 3) breakeven at +X pts, short side
  await panelPage({}, { trade: { targets: [20, 40], beMode: 'points', beTrigger: 15, beOffset: 2 } });
  await js(`${R} R.querySelector('#tr-sell').click(); return true;`);
  await sleep(900);
  o = (await sentBy('A07', '/v3/positions/open'))[0];
  ok(
    !!o &&
      o.body.side === 'short' &&
      o.body.stopLosses[0].triggerPrice === '31241.25' &&
      o.body.takeProfits[0].triggerPrice === '31201.25',
    'send: SELL puts the stop above and targets below',
  );
  await js(`window.MARK = 31210; return true;`); // only 11.25 pts in favour
  await sleep(700);
  ok((await sentBy('A07', '/v3/positions/stop-loss', 'PUT')).length === 0, 'breakeven +15: not yet at +11');
  await js(`window.MARK = 31206; return true;`); // 15.25 pts in favour
  ok(
    await until(
      `return SENT.some(x => x.acct === 'A07' && x.method === 'PUT' && x.path === '/v3/positions/stop-loss');`,
      4000,
    ),
    'breakeven +15: fires at +15',
  );
  be = (await sentBy('A07', '/v3/positions/stop-loss', 'PUT'))[0];
  ok(
    !!be && be.body.triggerPrice === '31219.25',
    `breakeven (short): entry - 2 pt offset (${be && be.body.triggerPrice})`,
  );

  // 4) copier armed, 1:1 follower: same legs; breakeven move copies to the follower's own stop leg
  await panelPage({}, { arm: ['A08'] });
  await buy();
  const mo = (await sentBy('A07', '/v3/positions/open'))[0],
    fo = (await sentBy('A08', '/v3/positions/open'))[0];
  ok(
    !!fo &&
      JSON.stringify(fo.body.takeProfits) === JSON.stringify(mo.body.takeProfits) &&
      JSON.stringify(fo.body.stopLosses) === JSON.stringify(mo.body.stopLosses),
    'copier: follower gets the same stop + 3 sized targets',
  );
  await js(`window.MARK = 31241.5; return true;`);
  ok(
    await until(
      `return SENT.some(x => x.acct === 'A08' && x.method === 'PUT' && x.path === '/v3/positions/stop-loss');`,
      5000,
    ),
    'copier: breakeven move copied to the follower',
  );
  const fbe = (await sentBy('A08', '/v3/positions/stop-loss', 'PUT'))[0];
  ok(
    !!fbe &&
      fbe.body.stopLossId === (await js(`return POS.A08[0].stopLosses[0].id;`)) &&
      fbe.body.positionId === (await js(`return POS.A08[0].positionId;`)) &&
      fbe.body.triggerPrice === '31222.25',
    "copier: uses the follower's own position + stop leg id",
  );

  // master edits legs after entry: move TP2, add a target, remove TP3 — each must hit the follower's matching leg
  const mpos = await js(`return POS.A07[0];`),
    fpos0 = await js(`return POS.A08[0];`);
  await masterSend('PUT', '/v3/positions/take-profit', {
    positionId: mpos.positionId,
    executionType: 'market',
    triggerPrice: '31266',
    takeProfitId: mpos.takeProfits[1].id,
  });
  let fm = (await sentBy('A08', '/v3/positions/take-profit', 'PUT'))[0];
  ok(
    !!fm && fm.body.takeProfitId === fpos0.takeProfits[1].id && fm.body.triggerPrice === '31266',
    `copier: master moves TP2 -> follower's TP2 moves (${fm && fm.body.takeProfitId})`,
  );
  await masterSend('POST', '/v3/positions/take-profit', {
    positionId: mpos.positionId,
    executionType: 'market',
    triggerPrice: '31300',
    quantity: '0.1',
  });
  const fa = await sentBy('A08', '/v3/positions/take-profit', 'POST');
  ok(
    fa.length === 1 &&
      fa[0].body.positionId === fpos0.positionId &&
      fa[0].body.quantity === '0.1' &&
      fa[0].body.triggerPrice === '31300',
    'copier: master ADDS a target -> follower gets a new target (not a move)',
  );
  ok(
    (await sentBy('A08', '/v3/positions/take-profit', 'PUT')).length === 1,
    'copier: the add did not move any existing follower target',
  );
  await masterSend('DELETE', '/v3/positions/take-profit', {
    positionId: mpos.positionId,
    takeProfitId: mpos.takeProfits[2].id,
  });
  const fd = (await sentBy('A08', '/v3/positions/take-profit', 'DELETE'))[0];
  ok(
    !!fd && fd.body.takeProfitId === fpos0.takeProfits[2].id && fd.body.positionId === fpos0.positionId,
    "copier: master REMOVES TP3 -> follower's TP3 removed",
  );
  ok(!/order has changed|new field/.test(await logText()), 'payload guard: adds/removes are not flagged as drift');

  // 5) cap-to-fit follower (less equity): legs scaled to its size, adding up exactly
  await panelPage({ opts: { capFit: true } }, { arm: ['A08'] });
  await buy();
  const cf = (await sentBy('A08', '/v3/positions/open'))[0];
  const legSum = cf ? +cf.body.takeProfits.reduce((a, l) => a + parseFloat(l.quantity), 0).toFixed(4) : 0;
  ok(
    !!cf &&
      parseFloat(cf.body.quantity) < 1 &&
      legSum === parseFloat(cf.body.quantity) &&
      cf.body.takeProfits.length === 3,
    `cap-to-fit: follower ${cf && cf.body.quantity} with targets ${cf && cf.body.takeProfits.map((l) => l.quantity).join('/')} (sum ${legSum})`,
  );

  // 6) cap-to-fit with a whole-number master size: follower must NOT be rounded to whole contracts (old bug)
  await panelPage({ opts: { capFit: true } }, { arm: ['A08'], trade: { qty: 2, targets: [20], beMode: 'off' } });
  await buy();
  const cw = (await sentBy('A08', '/v3/positions/open'))[0];
  ok(
    !!cw && parseFloat(cw.body.quantity) > 1.8 && parseFloat(cw.body.quantity) < 2,
    `cap-to-fit: master "2" -> follower ${cw && cw.body.quantity} (not rounded to whole contracts)`,
  );

  // ── Leverage: Vest's rule — saved if 0 < saved <= max, else the max (50x for NQ: margin ratio 0.02) ──
  for (const [saved, want, label] of [
    [null, '50', "no saved NQ leverage (new account) -> 50x, like Vest's ticket"],
    ['20', '20', 'saved 20x -> 20x'],
    ['75', '50', 'saved 75x is above the max -> 50x'],
  ]) {
    await panelPage({ lev: { A07: saved } }, { trade: { targets: [20], beMode: 'off' } });
    await buy();
    const lo = (await sentBy('A07', '/v3/positions/open'))[0];
    ok(!!lo && lo.body.leverage === want, `leverage: ${label} (sent ${lo ? lo.body.leverage : 'nothing'})`);
  }
  ok(!/order NOT placed/.test(await logText()), 'leverage: no "order NOT placed" errors');

  // ── Re-anchor after fill (default) ──
  // filled 1 pt above the click price: stop + targets must be re-placed exactly 20 / 20-40-60 from the FILL
  await panelPage({ fillPrice: 31222.25 }, { trade: { beMode: 'off' } });
  await buy();
  await until(`return SENT.filter(x => x.acct === 'A07' && x.method === 'PUT').length >= 4;`, 5000);
  const ra = await sentBy('A07', null, 'PUT');
  const raBy = (path) =>
    ra
      .filter((x) => x.path === path)
      .map((x) => x.body.triggerPrice)
      .join(',');
  ok(
    raBy('/v3/positions/stop-loss') === '31202.25' &&
      raBy('/v3/positions/take-profit') === '31242.25,31262.25,31282.25',
    `re-anchor: stop + 3 targets moved to exactly 20 / 20,40,60 from the 31,222.25 fill (sl ${raBy('/v3/positions/stop-loss')} · tp ${raBy('/v3/positions/take-profit')})`,
  );
  const mp = await js(`return POS.A07[0];`);
  ok(
    mp.stopLosses[0].triggerPrice === '31202.25' &&
      mp.takeProfits.map((l) => l.triggerPrice + '×' + l.quantity).join(',') ===
        '31242.25×0.1667,31262.25×0.3333,31282.25×0.5',
    're-anchor: each leg moved by its own id, sizes untouched (0.1667 / 0.3333 / 0.5)',
  );
  ok(
    /Filled at 31222\.25 — stop & targets re-placed exactly 20 \/ 20 \/ 40 \/ 60 pts from the fill/.test(
      await logText(),
    ),
    're-anchor: logged',
  );

  // "Price at click" = no re-anchor
  await panelPage({ fillPrice: 31222.25 }, { trade: { beMode: 'off', anchor: 'click' } });
  await buy();
  await sleep(1200);
  ok((await sentBy('A07', null, 'PUT')).length === 0, 're-anchor off ("Price at click"): nothing moved');

  // armed, fast mode, SLOW follower: entries first, then re-anchor; the slow follower's legs still get moved;
  // breakeven waits for the re-anchor, then measures from the fill
  await panelPage(
    { fillPrice: 31222.25, slowOpen: 600, opts: { fast: true } },
    { arm: ['A08'], trade: { beMode: 'tp1', beOffset: 1 } },
  );
  await buy();
  await until(`return SENT.filter(x => x.acct === 'A08' && x.method === 'PUT').length >= 4;`, 8000);
  const all = await js(`return SENT.map(x => ({ acct: x.acct, method: x.method, path: x.path, at: x.at }));`);
  const fOpen = all.find((x) => x.acct === 'A08' && x.path === '/v3/positions/open'),
    mOpen = all.find((x) => x.acct === 'A07' && x.path === '/v3/positions/open');
  const firstMove = all.find((x) => x.method === 'PUT');
  ok(
    !!fOpen && !!mOpen && !!firstMove && fOpen.at < firstMove.at && Math.abs(fOpen.at - mOpen.at) < 150,
    `timing: follower entry fires with the master's (${fOpen && mOpen ? Math.round(Math.abs(fOpen.at - mOpen.at)) : '?'} ms apart), before any re-anchor move`,
  );
  const fpos = await js(`return POS.A08[0];`);
  ok(
    fpos.stopLosses[0].triggerPrice === '31202.25' &&
      fpos.takeProfits.map((l) => l.triggerPrice).join(',') === '31242.25,31262.25,31282.25',
    "re-anchor + slow follower: follower's stop & targets moved too (waited for its open, didn't skip it)",
  );
  ok(!/not tracked|no matching/.test(await logText()), 're-anchor + slow follower: nothing skipped');
  await js(`window.MARK = 31242.5; return true;`); // reaches the RE-ANCHORED TP1 (31,242.25)
  ok(
    await until(
      `return SENT.filter(x => x.acct === 'A07' && x.method === 'PUT' && x.path === '/v3/positions/stop-loss').length >= 2;`,
      5000,
    ),
    'breakeven after re-anchor: fires at the re-anchored TP1',
  );
  const beMove = (await sentBy('A07', '/v3/positions/stop-loss', 'PUT')).pop();
  ok(
    beMove.body.triggerPrice === '31223.25',
    `breakeven after re-anchor: entry is the fill, +1 = 31,223.25 (${beMove.body.triggerPrice})`,
  );
  ok(
    await until(`return POS.A08[0].stopLosses[0].triggerPrice === '31223.25';`, 4000),
    "breakeven after re-anchor: follower's stop follows to 31,223.25",
  );

  // ── Adding to an open trade (Vest's /append) ──
  // master + 1:1 follower long 1 @ 31,221.25; BUY 1 more fills @ 31,231.25 -> 2 @ avg 31,226.25. One ladder for the whole
  // position from the new average: stop 20 below, targets 20/40/60 above, 2 contracts split End (0.3333 / 0.6667 / 1).
  await panelPage({}, { arm: ['A08'], trade: { beMode: 'tp1', beOffset: 1 } });
  await buy();
  await sleep(600);
  await js(`CFG.addFillPrice = 31231.25; return true;`);
  await buy();
  await until(
    `return POS.A08[0] && POS.A08[0].takeProfits.map(l => l.triggerPrice).join() === '31246.25,31266.25,31286.25';`,
    8000,
  );
  const opens = await sentBy('A07', '/v3/positions/open'),
    ap = (await sentBy('A07', '/v3/positions/append'))[0],
    fap = (await sentBy('A08', '/v3/positions/append'))[0];
  const m0 = await js(`return POS.A07[0];`),
    f0 = await js(`return POS.A08[0];`);
  ok(
    opens.length === 1 &&
      !!ap &&
      ap.body.positionId === m0.positionId &&
      ap.body.quantity === '1' &&
      ap.body.isBuy === true &&
      ap.body.orderType === 'market' &&
      ap.body.timeInForce === 'IOC' &&
      ap.body.leverage === '50',
    `add: second BUY is an /append to the open long, not a new /open (${ap && JSON.stringify(ap.body)})`,
  );
  ok(
    !!fap && fap.body.positionId === f0.positionId && fap.body.quantity === '1' && fap.body.isBuy === true,
    `copier: the add is copied to the follower's own position (${fap && JSON.stringify(fap.body)})`,
  );
  const ladder = (pos) =>
    pos.stopLosses.map((l) => l.triggerPrice).join() +
    ' | ' +
    pos.takeProfits.map((l) => l.triggerPrice + '×' + l.quantity).join(',');
  const wantLadder = '31206.25 | 31246.25×0.3333,31266.25×0.6667,31286.25×1';
  ok(
    m0.quantity === '2' && +m0.openPrice === 31226.25 && ladder(m0) === wantLadder,
    `add: master ladder rebuilt from the 31,226.25 average for 2 contracts (${ladder(m0)})`,
  );
  ok(f0.quantity === '2' && ladder(f0) === wantLadder, `copier: follower ladder matches (${ladder(f0)})`);
  const be2 = await js(`return Object.values(JSON.parse(localStorage.getItem('vc-plans') || '{}'))[0] || null;`);
  ok(
    !!be2 && be2.entry === 31226.25 && be2.tp1 === 31246.25 && be2.stopLegId === m0.stopLosses[0].id,
    `add: breakeven re-measured from the new average (${be2 && JSON.stringify({ entry: be2.entry, tp1: be2.tp1 })})`,
  );
  ok(!/not tracked|no matching|did NOT fill|NOT placed/.test(await logText()), 'add: nothing skipped or failed');

  // opposite direction while long: refused, nothing sent
  await js(`${R} R.querySelector('#tr-sell').click(); return true;`);
  await sleep(900);
  ok(
    (await sentBy('A07', '/v3/positions/open')).length === 1 &&
      (await sentBy('A07', '/v3/positions/append')).length === 1 &&
      /close or reduce it first/.test(await logText()),
    'add: SELL while long is refused with a clear message (no order sent)',
  );

  // cap-to-fit follower: the add and the rebuilt legs are scaled to its size and add up to it
  await panelPage({ opts: { capFit: true } }, { arm: ['A08'], trade: { beMode: 'off' } });
  await buy();
  await sleep(600);
  await buy();
  await until(
    `return SENT.filter(x => x.acct === 'A08' && x.method === 'PUT' && x.path === '/v3/positions/take-profit').length >= 3;`,
    8000,
  );
  await sleep(600);
  const cfo = (await sentBy('A08', '/v3/positions/open'))[0],
    cfa = (await sentBy('A08', '/v3/positions/append'))[0],
    cpos = await js(`return POS.A08[0];`);
  const ctp = +cpos.takeProfits.reduce((a, l) => a + parseFloat(l.quantity), 0).toFixed(4);
  ok(
    !!cfa && cfa.body.quantity === cfo.body.quantity && ctp === +cpos.quantity && +cpos.quantity < 2,
    `cap-to-fit add: follower adds ${cfa && cfa.body.quantity} (same as its entry), targets ${cpos.takeProfits.map((l) => l.quantity).join('/')} sum to its ${cpos.quantity}`,
  );

  // an /open sent while already holding the symbol (the old behaviour): the master's own no-fill is now reported
  await panelPage({}, { arm: ['A08'], trade: { beMode: 'off', targets: [20] } });
  await buy();
  await sleep(600);
  await masterSend('POST', '/v3/positions/open', {
    orderType: 'market',
    leverage: '50',
    side: 'long',
    symbol: 'NDX-USD-PERP',
    quantity: '0.2',
    timeInForce: 'IOC',
  });
  ok(
    await until(`${R} return /MASTER Account 07 did NOT fill/.test(R.querySelector('.log').innerText);`, 9000),
    "no-fill: the master's own no-fill is reported, not just the follower's",
  );
  ok(!/likely insufficient margin/.test(await logText()), 'no-fill: no longer blamed on margin');

  // ── Live incident 2026-10-04 23:38: right after a fill, Vest's position showed openPrice 290.25 for a 31,148 fill ──
  await panelPage(
    { fillPrice: 31222.25, bogusOpenPrice: '290.25' },
    { arm: ['A08'], trade: { beMode: 'tp1', beOffset: 1 } },
  );
  await buy();
  await until(`return SENT.filter(x => x.acct === 'A08' && x.method === 'PUT').length >= 4;`, 6000);
  const bp = await js(`return POS.A07[0];`),
    bf = await js(`return POS.A08[0];`);
  ok(
    ladder(bp) === '31202.25 | 31242.25×0.1667,31262.25×0.3333,31282.25×0.5' && ladder(bf) === ladder(bp),
    `bogus openPrice: re-anchor uses the real fill from executions (master ${ladder(bp)} · follower ${ladder(bf)})`,
  );
  const bplan = await js(`return Object.values(JSON.parse(localStorage.getItem('vc-plans') || '{}'))[0] || null;`);
  ok(
    !!bplan && bplan.entry === 31222.25 && bplan.tp1 === 31242.25,
    `bogus openPrice: breakeven entry is the real fill (${bplan && bplan.entry})`,
  );

  // a master order Vest refuses is NOT copied
  await panelPage(
    { refuse: ['PUT /v3/positions/take-profit'] },
    { arm: ['A08'], trade: { beMode: 'off', anchor: 'click' } },
  );
  await buy();
  await sleep(600);
  const rp = await js(`return POS.A07[0];`);
  await masterSend('PUT', '/v3/positions/take-profit', {
    positionId: rp.positionId,
    executionType: 'market',
    triggerPrice: '31300',
    takeProfitId: rp.takeProfits[0].id,
  });
  ok(
    (await sentBy('A08', '/v3/positions/take-profit', 'PUT')).length === 0 &&
      /MASTER take-profit refused by Vest \(HTTP 400\) — not copied/.test(await logText()),
    'refused master order: not copied to followers',
  );

  // a breakeven plan saved with a bad entry (by v0.19–0.20) is dropped, never acted on
  await panelPage(
    {
      plans: {
        PBAD: {
          positionId: 'PBAD',
          orderId: 'OBAD',
          master: 'A07',
          symbol: 'NDX-USD-PERP',
          side: 'long',
          stopLegId: 'SLBAD',
          tp1: 330.25,
          beMode: 'tp1',
          beTrigger: 15,
          beOffset: 1,
          entry: 290.25,
          triggered: false,
          moved: false,
          reanchoring: false,
          at: 1,
        },
      },
      positions: {
        A07: [
          {
            positionId: 'PBAD',
            symbol: 'NDX-USD-PERP',
            side: 'long',
            quantity: '0.15',
            openPrice: '31148',
            takeProfits: [],
            stopLosses: [{ id: 'SLBAD', triggerPrice: '31127.5' }],
          },
        ],
      },
    },
    {},
  );
  await sleep(1500);
  ok(
    (await sentBy('A07', '/v3/positions/stop-loss', 'PUT')).length === 0 &&
      /Breakeven: stopped watching — its entry \(290\.25\) is nowhere near the market/.test(await logText()),
    'bad saved breakeven plan: dropped with a message, stop not moved',
  );

  // ── Review fixes ──
  // Reload accounts while the Trade tab is open: the tab rebuilds instead of throwing
  await panelPage({}, {});
  await js(`${R} R.querySelector('[data-act="refresh"]').click(); return true;`);
  ok(
    (await until(`${R} return !!R.querySelector('#tr-buy') || !!R.querySelector('[data-m="A07"]');`, 6000)) &&
      !/Failed to load/.test(await js(`${R} return R.querySelector('.body').innerText;`)),
    'reload while on the Trade tab: no "Failed to load" crash',
  );

  // fast mode: the master's request fails on the network after followers already fired -> raised as orphans
  await panelPage({ opts: { fast: true }, netFail: ['POST /v3/positions/open'] }, { arm: ['A08'] });
  await js(`try { await fetch('https://api-gateway.hz.vestmarkets.com/v3/positions/open', { method: 'POST', headers: { Authorization: 'Bearer ' + ACCT('A07') },
    body: JSON.stringify({ orderType: 'market', leverage: '50', side: 'long', symbol: 'NDX-USD-PERP', quantity: '0.2', timeInForce: 'IOC' }) }); } catch {} return true;`);
  ok(
    await until(
      `${R} return /without the master — the master's response was lost/.test(R.querySelector('.log').innerText) && !!R.querySelector('#vc-flatten');`,
      6000,
    ),
    'fast mode + failed master request: follower raised as an orphan (master confirmed flat, so Flatten / Keep is offered)',
  );

  // a reduce and an add sent back to back reach the follower in that order, sized from the right totals
  await panelPage({}, { arm: ['A08'], trade: { qty: 2, targets: [20], beMode: 'off', anchor: 'click' } });
  await buy();
  await sleep(600);
  const q0 = await js(`return POS.A07[0].positionId;`);
  await js(`const h = { Authorization: 'Bearer ' + ACCT('A07') }, u = 'https://api-gateway.hz.vestmarkets.com/v3/positions/';
    fetch(u + 'reduce', { method: 'POST', headers: h, body: JSON.stringify({ positionId: '${q0}', orderType: 'market', leverage: '50', quantity: '1', timeInForce: 'IOC', reduceOnly: true, symbol: 'NDX-USD-PERP' }) });
    fetch(u + 'append', { method: 'POST', headers: h, body: JSON.stringify({ symbol: 'NDX-USD-PERP', positionId: '${q0}', orderType: 'market', quantity: '1', leverage: '50', isBuy: true, timeInForce: 'IOC' }) });
    return true;`);
  await until(`return SENT.some(x => x.acct === 'A08' && x.path === '/v3/positions/append');`, 5000);
  const order = (
    await js(
      `return SENT.filter(x => x.acct === 'A08' && /reduce|append/.test(x.path)).map(x => x.path.split('/').pop() + ' ' + x.body.quantity);`,
    )
  ).join(', ');
  ok(order === 'reduce 1, append 1', `ordering: follower gets "reduce 1, append 1" in order (got "${order}")`);

  // a breakeven plan saved while its stop/targets were being adjusted still works after a reload
  await panelPage(
    {
      plans: {
        PR: {
          positionId: 'PR',
          orderId: 'OR',
          master: 'A07',
          symbol: 'NDX-USD-PERP',
          side: 'long',
          stopLegId: 'SLR',
          tp1: 31241.25,
          beMode: 'tp1',
          beTrigger: 15,
          beOffset: 1,
          entry: 31221.25,
          triggered: false,
          moved: false,
          reanchoring: true,
          at: 1,
        },
      },
      positions: {
        A07: [
          {
            positionId: 'PR',
            symbol: 'NDX-USD-PERP',
            side: 'long',
            quantity: '1',
            openPrice: '31221.25',
            takeProfits: [],
            stopLosses: [{ id: 'SLR', triggerPrice: '31201.25' }],
          },
        ],
      },
    },
    {},
  );
  await js(`window.MARK = 31241.5; return true;`);
  ok(
    await until(
      `return SENT.some(x => x.acct === 'A07' && x.method === 'PUT' && x.path === '/v3/positions/stop-loss' && x.body.triggerPrice === '31222.25');`,
      5000,
    ),
    'reload mid-adjustment: the saved breakeven plan still fires',
  );

  // a garbled copy (e.g. pasted through clip.exe) still runs and says so; a clean copy doesn't
  await panelPage({ garbled: true }, {});
  ok(/garbled when it was copied/.test(await logText()), 'encoding check: a garbled copy warns in the log');
  await panelPage({}, {});
  ok(!/garbled when it was copied/.test(await logText()), 'encoding check: a clean copy says nothing');

  // risk acknowledgement: shown on first load; Accept stays disabled until the box is ticked; trading is refused before
  CFG = { knownBuild: 'NEWBUILD12', markPrice: 31221.3, fillPrice: 31221.25, noAck: true, rewards: {} };
  await send('Page.navigate', { url: ORIGIN + '?ack' });
  ok(await until(`${R} return !!R.querySelector('#rl-agree');`, 8000), 'terms: shown on first load');
  ok(
    await js(`${R} return R.querySelector('#rl-agree').disabled;`),
    'terms: Accept is disabled until the box is ticked',
  );
  ok(
    await js(`${R} return R.querySelector('.support').hidden;`),
    'terms: the support question waits until the terms are accepted',
  );
  await js(`${R} R.querySelector('[data-tab="accounts"]').click(); R.querySelector('[data-m="A07"]').click();
    R.querySelector('[data-tab="trade"]').click(); return true;`);
  await until(`${R} const b = R.querySelector('#tr-buy'); return b && !b.disabled;`, 6000);
  await js(`${R} R.querySelector('#tr-buy').click(); return true;`);
  await sleep(600);
  ok(
    (await js(`return SENT.filter(x => x.path === '/v3/positions/open').length;`)) === 0 &&
      !!(await js(`${R} return R.querySelector('#rl-agree');`)),
    'terms: the Trade tab refuses to place an order before acceptance',
  );
  await js(
    `${R} const c = R.querySelector('#rl-check'); c.checked = true; c.dispatchEvent(new Event('change')); R.querySelector('#rl-agree').click(); return true;`,
  );
  ok(
    await js(`return JSON.parse(localStorage.getItem('vc-ack')).v === 2;`),
    'terms: acceptance is recorded with its version',
  );
  ok(
    await until(`${R} return !R.querySelector('.support').hidden;`, 4000),
    'terms: after accepting, the one-time support question appears',
  );

  // one-time support question: shown only when the account has no referral code; Yes joins AMPED, No sends nothing
  await panelPage({ rewards: {} }, {});
  ok(
    await until(
      `${R} const b = R.querySelector('.support'); return !b.hidden && /code AMPED/.test(b.innerText);`,
      4000,
    ),
    'support: offered once when the account has no referral code',
  );
  await js(`${R} R.querySelector('[data-act="support-yes"]').click(); return true;`);
  await until(`return SENT.some(x => x.path === '/v2/referrals/join');`, 3000);
  const join = (await js(`return SENT.filter(x => x.path === '/v2/referrals/join');`))[0];
  ok(
    !!join && join.method === 'POST' && join.body.refCode === 'AMPED' && /Thank you! Code AMPED/.test(await logText()),
    "support: Yes links code AMPED through Vest's referral join",
  );
  ok(
    await js(
      `${R} return R.querySelector('.support').hidden && JSON.parse(localStorage.getItem('vc-support')).answered === 'yes';`,
    ),
    'support: answered — the question is gone and remembered',
  );
  await panelPage({ rewards: {} }, {});
  await until(`${R} return !R.querySelector('.support').hidden;`, 4000);
  await js(`${R} R.querySelector('[data-act="support-no"]').click(); return true;`);
  await sleep(500);
  ok(
    (await js(`return SENT.filter(x => x.path === '/v2/referrals/join').length;`)) === 0 &&
      (await js(`return JSON.parse(localStorage.getItem('vc-support')).answered;`)) === 'no',
    'support: No sends nothing and is remembered',
  );
  await panelPage({ rewards: {}, joinFail: true }, {});
  await until(`${R} return !R.querySelector('.support').hidden;`, 4000);
  await js(`${R} R.querySelector('[data-act="support-yes"]').click(); return true;`);
  ok(
    (await until(`${R} return /enter it once in the discount box/.test(R.querySelector('.log').innerText);`, 4000)) &&
      (await js(`return JSON.parse(localStorage.getItem('vc-support')).answered;`)) === 'manual',
    "support: if Vest won't link the code, the user is told to enter it in the purchase window",
  );
  // an account already using another code is still asked once, and the question names that code
  await panelPage({ rewards: { code: 'FRIEND' } }, {});
  ok(
    await until(
      `${R} const b = R.querySelector('.support'); return !b.hidden && /You currently use code FRIEND/.test(b.innerText) && /Keep FRIEND/.test(b.innerText);`,
      4000,
    ),
    'support: an account with another code is asked once, naming its current code',
  );
  // an account already using AMPED is never asked
  await panelPage({ rewards: { code: 'AMPED' } }, {});
  await sleep(1500);
  ok(
    (await js(`${R} return R.querySelector('.support').hidden;`)) &&
      (await js(`return JSON.parse(localStorage.getItem('vc-support')).answered;`)) === 'had-code',
    'support: an account already using AMPED is never asked',
  );

  // update check on load: a newer published version shows the bar with an Install link; Later hides it
  await panelPage({ latestVersion: '9.9.9' }, {});
  ok(
    await until(
      `${R} const u = R.querySelector('.update'); return !u.hidden && /Update available: v9\\.9\\.9/.test(u.innerText);`,
      4000,
    ),
    'update check on load: a newer version on GitHub shows the update bar',
  );
  ok(
    (await js(`${R} return R.querySelector('.update a.ubtn').href;`)) ===
      'https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js',
    'update check: Install opens the published .user.js (Tampermonkey update page)',
  );
  await js(`${R} R.querySelector('[data-act="update-later"]').click(); return true;`);
  ok(await js(`${R} return R.querySelector('.update').hidden;`), 'update check: Later hides it until the next version');
  await js(
    `${R} R.querySelector('[data-tab="settings"]').click(); R.querySelector('[data-act="check-now"]').click(); return true;`,
  );
  ok(
    await until(
      `${R} return !R.querySelector('.update').hidden && /Update available/.test(R.querySelector('.update').innerText);`,
      4000,
    ),
    'update check: Check now shows it again after Later',
  );
  // on load, an older (or equal) published version shows "Up to date" briefly, then the bar goes away
  await panelPage({ latestVersion: '0.0.1' }, {});
  ok(
    await until(`${R} const u = R.querySelector('.update'); return !u.hidden && /Up to date/.test(u.innerText);`, 4000),
    'update check on load: "Up to date" shown',
  );
  ok(
    await until(`${R} return R.querySelector('.update').hidden;`, 7000),
    'update check on load: the "Up to date" bar disappears by itself',
  );

  // a resting limit entry: no fill to find yet, so followers must stay linked; the master's cancel reaches them
  await panelPage({}, { arm: ['A08'] });
  await masterSend('POST', '/v3/positions/open', {
    orderType: 'limit',
    leverage: '50',
    side: 'long',
    symbol: 'NDX-USD-PERP',
    quantity: '0.5',
    timeInForce: 'GTC',
    price: '31100',
  });
  await sleep(5000);
  const limOrder = await js(`return POS.A07[0] && 'O' + POS.A07[0].positionId.slice(1);`);
  await masterSend('POST', '/v3/positions/cancel-order', { orderId: limOrder });
  ok(
    !!limOrder &&
      !/did NOT fill/.test(await logText()) &&
      (await sentBy('A08', '/v3/positions/cancel-order')).length === 1,
    'limit entry: followers stay linked (no "did NOT fill"), and the master cancel reaches them',
  );

  // fill history down: nobody is dropped, the trader is told, and a later close still reaches the follower
  await panelPage({ execFail: true }, { arm: ['A08'], trade: { targets: [20], beMode: 'off', anchor: 'click' } });
  await buy();
  ok(
    await until(`${R} return /Couldn't confirm fills/.test(R.querySelector('.log').innerText);`, 9000),
    'fill history down: "couldn\'t confirm fills" warning',
  );
  ok(!/did NOT fill/.test(await logText()), 'fill history down: nothing reported as not filled');
  const fpid = await js(`return POS.A07[0].positionId;`);
  await masterSend('POST', '/v3/positions/close', { symbol: 'NDX-USD-PERP', positionId: fpid, orderType: 'market' });
  const fc = (await sentBy('A08', '/v3/positions/close'))[0];
  ok(
    !!fc && fc.body.leverage === '50',
    `fill history down: the follower is still closed with the master, leverage filled in (${fc && fc.body.leverage})`,
  );
  ws.close();
} finally {
  chrome.kill('SIGKILL');
  server.close();
  await sleep(200);
  rmSync(profile, { recursive: true, force: true });
}
console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
process.exit(failures ? 1 : 0);
