// Screenshots of the real panel for the tutorial, rendered in headless Chrome against a small mocked Vest API
// (example accounts, no network). Writes docs/tutorial/img/{accounts,trade}.png.
//   node docs/tutorial/shots.mjs
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = readFileSync(resolve(here, '../../src/vest-copier.user.js'), 'utf8');
// Any Chrome or Chromium works: set CHROME_PATH. Defaults to the headless shell the local video project installs.
const CHROME =
  process.env.CHROME_PATH ||
  resolve(
    here,
    '../../video/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell',
  );
const OUT = resolve(here, 'img');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Example accounts: three $50k funded accounts (no real data).
const page = `<!doctype html><html><head><meta charset="utf-8"><script>
localStorage.clear();
localStorage.setItem('vc-ack', JSON.stringify({ v: 2 }));
localStorage.setItem('vc-support', JSON.stringify({ answered: 'no' }));
localStorage.setItem('vc-trade', JSON.stringify({ symbol: 'NDX-USD-PERP', sizeMode: 'risk', qty: 1, risk: 300, stopPts: 20,
  targets: [20, 40, 60], scale: 'end', beMode: 'tp1', beTrigger: 15, beOffset: 1, anchor: 'fill' }));
window.__NEXT_DATA__ = { buildId: 'EXAMPLE123' };
const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\\+/g, '-').replace(/\\//g, '_');
const jwt = (c) => 'eyJhbGciOiJIUzI1NiJ9.' + b64(c) + '.sig';
const exp = () => Math.floor(Date.now() / 1000) + 3600;
window.USER = jwt({ userId: 'u1', exp: exp() });
const ACCT = (id) => jwt({ accountId: id, canTrade: true, exp: exp() });
const J = (o) => new Response(JSON.stringify(o), { status: 200, headers: { 'x-ratelimit-remaining': '196', 'x-ratelimit-limit': '200' } });
const EQ = { A11: '51240.50', A12: '50980.25', A14: '50612.75' };
window.WebSocket = class {
  constructor() { this.readyState = 0; setTimeout(() => { this.readyState = 1; this.onopen && this.onopen(); }, 20); }
  send(raw) {
    const m = JSON.parse(raw);
    if (m.method !== 'SUBSCRIBE') return;
    clearInterval(this.t);
    this.t = setInterval(() => this.onmessage && this.onmessage({ data: JSON.stringify({ channel: 'NDX-USD-PERP@ticker',
      data: { symbol: 'NDX-USD-PERP', markPrice: '21456.30' } }) }), 300);
  }
  close() { clearInterval(this.t); }
};
const real = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url.startsWith('https://api.github.com/')) return J({});
  if (url.startsWith('https://raw.githubusercontent.com/')) return new Response('// @version 0.0.1\\n');
  if (!url.startsWith('https://api-gateway')) return real(input, init);
  const p = new URL(url).pathname;
  const acct = (id, i) => ({ id, initial_capital: '50000', max_drawdown_limit: '47500', account_type: 3, plan_product_type: 'funded',
    plan_id: 'plan-x', attempt_index: i, max_leverage: '50' });
  if (p === '/v3/capital/accounts/active') return J({ accounts: [acct('A11', 10), acct('A12', 11), acct('A14', 13)] });
  if (p === '/v3/accounts') return J({ accounts: Object.keys(EQ).map((id) => ({ account_id: id, amount: EQ[id] })) });
  if (p === '/v3/trading-performance/series') return J({ items: Object.keys(EQ).map((id) => ({ account_id: id, ts: 1, equity_value: EQ[id] })) });
  if (p === '/v3/user-state') return J({ accounts: Object.keys(EQ).map((id) => ({ accountId: id, leverages: [{ symbol: 'NDX-USD-PERP', leverage: '20' }] })) });
  if (p === '/v3/auth/account-token') return J({ apiKey: ACCT(JSON.parse(init.body).accountId), accessExpiresAtMs: Date.now() + 900000 });
  if (p === '/v3/positions/opened') return J({ positions: null });
  if (p === '/v3/positions/opened-orders') return J({ orders: null });
  if (p === '/v3/ticker/latest') return J({ tickers: [{ symbol: 'NDX-USD-PERP', markPrice: '21456.30' }] });
  if (p === '/v3/exchangeInfo') return J({ symbols: [{ symbol: 'NDX-USD-PERP', displaySymbol: 'NQ-PERP', sizeDecimals: 4, minTickSize: '0.25',
    initMarginRatio: '0.02', fundedInitMarginRatio: '0.02', capitalInitMarginRatio: '0.02', capitalPlans: [] }] });
  return J({});
};
</script>
<script src="/vest-copier.user.js"></script>
<script>document.addEventListener('DOMContentLoaded', () => fetch('https://api-gateway.hz.vestmarkets.com/v3/accounts', { headers: { Authorization: 'Bearer ' + USER } }));</script>
<style>html,body{margin:0;background:#0b0d10;height:100%}</style></head><body></body></html>`;

const server = createServer((req, res) => {
  if (req.url === '/vest-copier.user.js') {
    res.setHeader('content-type', 'text/javascript; charset=utf-8');
    return res.end(SCRIPT);
  }
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end(page);
}).listen(0);
const ORIGIN = `http://127.0.0.1:${server.address().port}/`;
const PORT = 9353;
const profile = resolve(tmpdir(), `vc-shots-${process.pid}`);
const chrome = spawn(
  CHROME,
  [
    '--no-sandbox',
    '--disable-gpu',
    '--no-zygote',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

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
        'page exception:',
        m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text,
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
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
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
  const shot = async (name) => {
    await sleep(500);
    const r = await js(
      `${R} const b = R.querySelector('.panel').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height };`,
    );
    const { data } = (
      await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 },
      })
    ).result;
    writeFileSync(resolve(OUT, name), Buffer.from(data, 'base64'));
    console.log('wrote', name);
  };

  mkdirSync(OUT, { recursive: true });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 520, height: 1400, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: ORIGIN });
  await until(`${R} return !!R.querySelector('[data-m="A11"]');`);
  await js(
    `${R} R.querySelector('.panel').style.maxHeight = '1340px'; R.querySelector('.log').style.maxHeight = '150px'; return true;`,
  );

  // Accounts: master + two followers, armed
  for (const sel of ['[data-m="A11"]', '[data-f="A12"]', '[data-f="A14"]', '[data-act="arm"]']) {
    await js(`${R} R.querySelector('${sel}').click(); return true;`);
    await sleep(250);
  }
  const armed = await until(`${R} return R.querySelector('[data-act="arm"]').textContent === 'DISARM';`);
  if (!armed) console.log('not armed:', await js(`${R} return R.querySelector('.log').innerText;`));
  await shot('accounts.png');

  // Trade tab
  await js(`${R} R.querySelector('[data-tab="trade"]').click(); return true;`);
  await until(`${R} const b = R.querySelector('#tr-buy'); return b && !b.disabled;`);
  await shot('trade.png');
  ws.close();
} finally {
  chrome.kill('SIGKILL');
  server.close();
  await sleep(200);
  rmSync(profile, { recursive: true, force: true });
}
