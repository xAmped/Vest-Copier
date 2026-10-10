// Loads the built userscript into a stand-in Vest page (jsdom, no network) and checks that it installs its hooks and
// builds the panel without an error. Run with `npm test`, which builds first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const script = readFileSync('dist/vest-copier.user.js', 'utf8');

function loadPage({ times = 1 } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (e) => errors.push(e.message));
  virtualConsole.on('error', (...a) => errors.push(a.join(' ')));
  const dom = new JSDOM('<!doctype html><html class="dark"><body></body></html>', {
    url: 'https://next.vestmarkets.com/trade/NQ-PERP',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole,
  });
  const w = dom.window;
  w.__VC_TEST__ = true;
  const requests = [];
  w.fetch = async (url) => {
    requests.push(String(url));
    return { ok: false, status: 401, headers: new Map(), text: async () => '{}', json: async () => ({}) };
  };
  w.WebSocket = class {
    constructor(url) {
      this.url = url;
      this.readyState = 0;
    }
    send() {}
    close() {}
    addEventListener() {}
  };
  w.BroadcastChannel = class {
    postMessage() {}
    close() {}
  };
  w.addEventListener('error', (e) => errors.push(e.message));
  w.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason && e.reason.stack)));
  for (let i = 0; i < times; i++) w.eval(script);
  return { w, errors, requests, close: () => w.close() };
}

const settle = () => new Promise((r) => setTimeout(r, 500));

test('the header carries the package version', () => {
  assert.match(script, new RegExp(`^// @version +${pkg.version.replace(/\./g, '\\.')}$`, 'm'));
  assert.match(script, new RegExp(`const VERSION = '${pkg.version.replace(/\./g, '\\.')}'`));
  const legacy = readFileSync('src/vest-copier.user.js', 'utf8');
  assert.match(legacy, new RegExp(`^// @version +${pkg.version.replace(/\./g, '\\.')}$`, 'm'));
  assert.match(
    legacy,
    /@updateURL +https:\/\/raw\.githubusercontent\.com\/xAmped\/Vest-Copier\/main\/src\/vest-copier\.user\.js/,
  );
});

test('loads into a Vest page: hooks installed, panel built, no errors', async () => {
  const page = loadPage();
  await settle();
  const { w, errors } = page;
  assert.ok(w.XMLHttpRequest.prototype.open.toString().includes('__vc'), 'XHR hooked');
  assert.ok(w.fetch.toString().includes('onRequest'), 'fetch hooked');
  const root = w.document.querySelector('#vc-host')?.shadowRoot;
  assert.ok(root && root.querySelector('.panel'), 'panel built');
  assert.ok(root.querySelector('style').textContent.includes(':host'), 'stylesheet inlined');
  assert.ok(w.__vcMath && w.__vcState && w.__vcLev && w.__vcPlans, 'test hooks exposed');
  assert.deepEqual(errors, []);
  page.close();
});

test('a second copy on the same page does nothing', async () => {
  const page = loadPage({ times: 2 });
  await settle();
  assert.equal(page.w.document.querySelectorAll('#vc-host').length, 1);
  assert.deepEqual(page.errors, []);
  page.close();
});

test('order math is reachable in the build', () => {
  const page = loadPage();
  const m = page.w.__vcMath;
  assert.equal(m.roundTick(100.13, 0.25), 100.25);
  assert.equal(m.floorStep(1.23456, 0.0001), 1.2345);
  page.close();
});
