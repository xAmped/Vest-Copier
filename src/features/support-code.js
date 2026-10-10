import { API, _fetch } from '../config.js';
import { sleep } from '../copier/executor.js';
import { logEvent } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { store } from '../core/settings.js';
import { S } from '../state.js';
import { renderSupport } from '../ui/banners.js';
import { _root } from '../ui/panel.js';
import { userToken, userTokenOk } from '../vest/auth.js';

// The optional AMPED support code: the one-time question, and using it in Vest's purchase window.
// Asked once, after the terms are accepted: "Support the free copier with code AMPED?" If the account already uses
// another code, the question names it, so switching is the user's informed choice. Yes tries Vest's own referral-join
// call (the one behind Vest's "Have a Referral Code?" dialog); if Vest won't link it, the user is told to enter the
// code once in the purchase window's discount box (and it's put on the clipboard). No records the answer and it is
// never asked again. Nothing changes without the click; an account already using AMPED is never asked.
export const SUPPORT_CODE = 'AMPED';
const SUPPORT_DEBUG = false; // test builds: log each step of the purchase-window switch in the activity log
const supportStep = (msg) => SUPPORT_DEBUG && logEvent('info', '[code test] ' + msg);
export const SUPPORT_KEY = 'vc-support'; // { answered: 'yes' | 'manual' | 'no' | 'had-code', at, apply? }
// 'had-code' (already using a code) isn't a real answer: re-check it, so only accounts on AMPED stay unasked.
const supportAnswer = () => {
  const a = (store.get(SUPPORT_KEY, null) || {}).answered || null;
  return a === 'had-code' ? null : a;
};
export const saveSupport = (answered) => store.set(SUPPORT_KEY, { answered, at: new Date().toISOString() });
// The account's attached referral code, '' when none, or null when it can't be read (then nothing is offered).
async function attachedRefCode() {
  try {
    const r = await _fetch(location.origin + '/api/v2/referrals/rewards', {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + userToken },
    });
    if (!r.ok) return null;
    const d = await r.json();
    return (d && d.signup_ref_discount && d.signup_ref_discount.code) || '';
  } catch {
    return null;
  }
}
export async function maybeOfferSupport() {
  if (!S.ack || supportAnswer() || !userTokenOk()) return;
  const code = await attachedRefCode(); // null when it can't be read: ask without naming a current code
  if (code && code.toUpperCase() === SUPPORT_CODE) {
    saveSupport('had-code'); // already supporting
    const link = _root && _root.querySelector('[data-act="code"]');
    if (link) link.hidden = true;
    return;
  }
  S.supportCurrent = code || null;
  S.supportOffer = true;
  renderSupport();
}
// Put the code on the clipboard (the click that triggered this counts as the user gesture browsers ask for).
export const copySupportCode = () =>
  navigator.clipboard.writeText(SUPPORT_CODE).then(
    () => true,
    () => false,
  );
export async function acceptSupport() {
  S.supportOffer = false;
  saveSupport('yes');
  renderSupport();
  logEvent(
    'ok',
    `Thank you! ${SUPPORT_CODE} will be used in Vest's purchase window from now on (Settings → Support to turn off).`,
  );
  // Also try Vest's referral link, which only some accounts accept; the purchase window covers everyone else.
  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + userToken,
    };
    const r = await _fetch(API + '/v2/referrals/join', {
      method: 'POST',
      headers,
      body: JSON.stringify({ refCode: SUPPORT_CODE }),
    });
    const reply = (await r.text()).slice(0, 300);
    diag('support', { outcome: r.ok ? 'joined' : 'join-refused', status: r.status, reply });
    supportStep(`referral link: HTTP ${r.status} ${reply}`);
  } catch (e) {
    diag('support', { outcome: 'join-error', error: e.message });
    supportStep(`referral link failed: ${e.message}`);
  }
}

// Using the code in Vest's purchase window, for users who said Yes. Each time the window's discount box appears,
// its code is switched to AMPED the way a person would do it: clear the applied code (✕), type AMPED, press Enter.
// Vest validates and applies it. If Vest refuses it (for example on the code owner's own account), the previous
// code is put back. It acts once per opening, so a code the user picks by hand afterwards is left alone, and every
// switch is announced in the activity log.
// Vest has more than one discount box. The purchase window's is an editable field (styled to show its code in
// capitals) holding the applied code: type another code + Enter, and on success Vest redraws the box with it. The
// account-builder screen's shows "CODE 5%" read-only with a ✕ to clear it first.
const isDiscountBox = (el) =>
  el instanceof HTMLInputElement &&
  // purchase window ("pl-3! not-placeholder-shown:uppercase") or the account-builder side panel (the "!" variant).
  // Deliberately NOT the bare-class box inside Vest's "Do You Have a Discount Code?" form, which shares the placeholder
  // text: Enter there would submit that form. So boxes are matched by their styling, never by placeholder.
  ((/(^|\s)pl-3!(\s|$)/.test(el.className) && /not-placeholder-shown:uppercase(\s|$)/.test(el.className)) ||
    /not-placeholder-shown:uppercase!/.test(el.className) ||
    (el.getAttribute('role') === 'combobox' && /\brounded-full\b/.test(el.className) && /\bw-32\b/.test(el.className)));
export const supportApplies = () => {
  const v = store.get(SUPPORT_KEY, null) || {};
  return (v.answered === 'yes' || v.answered === 'manual') && v.apply !== false;
};
export function setSupportApply(on) {
  const v = store.get(SUPPORT_KEY, null) || {};
  store.set(SUPPORT_KEY, { ...v, apply: on });
}
const _seenBoxes = new WeakSet();
let _boxScan = null;
export function watchPurchaseWindow() {
  new MutationObserver(() => {
    if (_boxScan || !supportApplies()) return;
    _boxScan = setTimeout(() => {
      // the page changes constantly (prices); look at most a few times a second
      _boxScan = null;
      for (const el of document.querySelectorAll('input[placeholder], input[role="combobox"]')) {
        if (SUPPORT_DEBUG && !_seenBoxes.has(el) && el.closest('[role="dialog"]')) {
          _seenBoxes.add(el); // test builds: report every input in a dialog, to see what the purchase window holds
          supportStep(
            `dialog input: placeholder="${el.placeholder}" role=${el.getAttribute('role')} value="${el.value}" match=${isDiscountBox(el)}`,
          );
          if (!isDiscountBox(el)) continue;
          useSupportCode(el).catch((e) => supportStep('error: ' + e.message));
          continue;
        }
        if (!isDiscountBox(el) || _seenBoxes.has(el)) continue;
        _seenBoxes.add(el);
        useSupportCode(el).catch((e) => diag('support', { outcome: 'apply-error', error: e.message }));
      }
    }, 250);
  }).observe(document.documentElement, { childList: true, subtree: true });
}
const waitFor = async (cond, ms) => {
  for (let t = 0; t < ms; t += 100) {
    if (cond()) return true;
    await sleep(100);
  }
  return cond();
};
// React-controlled input: set the value through the native setter so the page's own handlers see the change.
function typeInto(input, text) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
const pressEnter = (input) =>
  input.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true }),
  );
async function useSupportCode(input) {
  await sleep(300); // let the window finish opening
  if (!input.isConnected) return;
  if (input.readOnly) return useSupportCodeReadOnly(input);
  const before = input.value.trim().toUpperCase();
  supportStep(`discount box found: current code "${before || '(none)'}"`);
  if (before === SUPPORT_CODE) return;
  // Applied = Vest redrew the box (the old field is gone) and the new one holds the code without an error flag.
  const applied = () =>
    !input.isConnected &&
    [...document.querySelectorAll('input')].some(
      (el) =>
        isDiscountBox(el) &&
        el.value.trim().toUpperCase() === SUPPORT_CODE &&
        el.getAttribute('aria-invalid') !== 'true',
    );
  const refused = () => input.isConnected && input.getAttribute('aria-invalid') === 'true';
  typeInto(input, SUPPORT_CODE);
  supportStep(`typed ${SUPPORT_CODE}: box now "${input.value}"`);
  pressEnter(input);
  let ok = await waitFor(() => applied() || refused(), 3000);
  if (!applied() && !refused() && input.isConnected) {
    // Enter didn't take: click the box's Use button instead
    const group = input.closest('[data-slot="input-group"]') || input.parentElement;
    const use = [...group.querySelectorAll('button')].find((b) => /^\s*use\s*$/i.test(b.textContent));
    supportStep(use ? 'Enter did nothing; clicking Use' : 'Enter did nothing and no Use button was found');
    if (use) use.click();
    ok = await waitFor(() => applied() || refused(), 5000);
  }
  if (applied()) {
    logEvent('ok', `Purchase window: discount code set to ${SUPPORT_CODE}${before ? ` (was ${before})` : ''}.`);
    diag('support', { outcome: 'applied', replaced: before || null });
    return;
  }
  // Refused (or no answer): Vest kept the previous code applied; show it in the box again.
  supportStep(
    `not applied: aria-invalid=${input.getAttribute('aria-invalid')} connected=${input.isConnected} answered=${ok}`,
  );
  if (input.isConnected) typeInto(input, before);
  logEvent('info', `Purchase window: Vest didn't accept ${SUPPORT_CODE} here${before ? `, so ${before} stays` : ''}.`);
  diag('support', { outcome: 'apply-refused', kept: before || null });
}
// The account-builder screen's box: "CODE 5%" read-only, with a ✕ to clear it before typing another code.
async function useSupportCodeReadOnly(input) {
  const codeOf = () => (input.value.trim().split(/\s+/)[0] || '').toUpperCase();
  const applied = () => input.readOnly && !!codeOf();
  const before = applied() ? codeOf() : '';
  supportStep(`read-only discount box found: current code "${before || '(none)'}"`);
  if (before === SUPPORT_CODE) return;
  const clearApplied = async () => {
    const x = (input.closest('[data-slot="input-group"]') || input.parentElement).querySelector('button');
    supportStep(x ? 'clicking ✕ to remove the applied code' : 'no ✕ button found next to the box');
    if (x) x.click();
    return waitFor(() => !input.readOnly, 1500);
  };
  const enter = async (code) => {
    typeInto(input, code);
    pressEnter(input);
    const ok = await waitFor(() => applied() && codeOf() === code, 5000);
    supportStep(`entered ${code}: ${ok ? 'applied' : 'not applied'}`);
    return ok;
  };
  if (before && !(await clearApplied())) return supportStep('stopped: the applied code could not be removed');
  if (await enter(SUPPORT_CODE)) {
    logEvent('ok', `Purchase window: discount code set to ${SUPPORT_CODE}${before ? ` (was ${before})` : ''}.`);
    diag('support', { outcome: 'applied', replaced: before || null });
    return;
  }
  if (before) {
    if (input.readOnly) await clearApplied();
    await enter(before);
  }
  logEvent(
    'info',
    `Purchase window: Vest didn't accept ${SUPPORT_CODE} here${before ? `, so ${before} was put back` : ''}.`,
  );
  diag('support', { outcome: 'apply-refused', restored: before || null });
}

export function declineSupport() {
  S.supportOffer = false;
  saveSupport('no');
  renderSupport();
}
