import { accLabel, centsDown, fetchBalances, isFunded, refreshBalances } from '../accounts/registry.js';
import { API, BALANCE_AFTER_TRADE_MS, _fetch } from '../config.js';
import { sleep, who } from '../copier/executor.js';
import { fmtNum } from '../copier/sizing.js';
import { logEvent, toast } from '../core/activity-log.js';
import { diag } from '../core/diagnostics.js';
import { healthState } from '../health/health.js';
import { siteGate } from '../health/site-check.js';
import { S } from '../state.js';
import { esc, money } from '../ui/format.js';
import { render } from '../ui/render.js';
import { api, mintAccountToken } from '../vest/api.js';
import { parseJson } from '../vest/request-hooks.js';

// Claim all profit: move each funded account's claimable profit to the Primary Account.
// "Claim all profit": moves each live funded account's claimable profit to the Primary Account, exactly as Vest's own
// Claim Profit window does: POST /v3/capital/withdraw with that account's login, { account_id, amount, target_account_id,
// idempotency_key }; Vest pays the account's split and credits it within 24 hours. Claimable = free balance − starting
// balance (open positions and orders block a claim; unrealized PnL isn't claimable); Vest's minimum is $1. Like Vest's
// window, it claims the exact amount (to the micro-dollar, "105.27086"); the balance drops as soon as a claim is
// submitted, so a claim still processing doesn't block or double the next one (seen live, 2026-10-06).
// A claim can't be reversed, so: nothing is sent before a preview the trader confirms; every account is re-read just
// before its own claim (balance, positions, orders); accounts go one at a time, a few
// seconds apart; each claim has one idempotency key, reused on its single retry, so it can never be paid twice; and the
// run can be stopped between accounts. Moving money from the Primary Account to a wallet stays a manual step on Vest.
const CLAIM_MIN_USD = 1;
const CLAIM_GAP_MS = 1000; // between two accounts' claims: one at a time (a claim answers in ~0.3 s)
const CLAIM_RETRY_MS = 3000;
const claimGap = () => (typeof window.__VC_CLAIM_GAP_MS === 'number' ? window.__VC_CLAIM_GAP_MS : CLAIM_GAP_MS);
S.claim = null; // { phase: 'checking' | 'review' | 'running' | 'done', primary, items: [...], stop, error }
export const claimBusy = () => S.claim && (S.claim.phase === 'checking' || S.claim.phase === 'running');
// A preview or a result is a snapshot: it goes when the copier arms or the accounts reload, and a preview after
// CLAIM_REVIEW_MS (the balances move; a claim re-checks every account anyway). A claim in progress always stays.
const CLAIM_REVIEW_MS = 120000;
export function dropClaimReview() {
  if (!S.claim || claimBusy()) return false;
  S.claim = null;
  return true;
}

// One account, read fresh: what it could claim right now, or why it can't. `free` is its free balance from /v3/accounts.
async function claimCheck(id, free) {
  const r = S.byId[id];
  const item = { id, label: accLabel(id), claimable: 0, net: 0, split: (r && r.split) || 0, reason: null };
  if (!r) return { ...item, reason: 'no longer active' };
  if (!isFunded(r)) return { ...item, reason: 'evaluation: profit pays out once funded' };
  try {
    const { token } = await mintAccountToken(id);
    const [pos, ord] = await Promise.all([
      api('/v3/positions/opened', token),
      api('/v3/positions/opened-orders', token),
    ]);
    if (((pos && pos.positions) || []).length) return { ...item, reason: 'has an open position: close it to claim' };
    if (((ord && ord.orders) || []).length) return { ...item, reason: 'has open orders: cancel them to claim' };
  } catch (e) {
    return { ...item, reason: `couldn't be checked (${e.message})` };
  }
  if (!(free >= 0)) return { ...item, reason: "couldn't read its balance" };
  const claimable = Math.floor((free - r.size) * 1e6 + 1e-6) / 1e6; // all of it, to the micro-dollar, as Vest claims
  if (!(claimable > 0)) return { ...item, reason: 'no profit to claim' };
  if (claimable < CLAIM_MIN_USD) return { ...item, reason: `${money(claimable)} is under Vest's $1 minimum` };
  return { ...item, claimable, net: claimable * item.split };
}
// Free balances of every account, and the Primary Account's id (account_type 1), in one read.
const claimBalances = () => fetchBalances();

async function claimPreview() {
  if (claimBusy()) return;
  if (S.flattening || S.placing || S.adjusting || S.arming)
    return toast('Wait for the current order, Flatten All or arming to finish.');
  // a trade copied mid-claim would change what each account can claim
  if (S.armed) return toast('Disarm the copier before claiming profit.');
  if (healthState().changed)
    return toast(
      siteGate() === 'failed'
        ? "Vest changed something the copier relies on: claim on Vest's own page until a copier update."
        : 'Vest updated its site: wait a moment for the check to finish.',
    );
  S.claim = { phase: 'checking', items: [] };
  render();
  try {
    const { free, primary } = await claimBalances();
    if (!primary) throw new Error("couldn't find your Primary Account");
    const ids = Object.values(S.byId)
      .sort((a, b) => a.order - b.order)
      .map((r) => r.id);
    const items = await Promise.all(ids.map((id) => claimCheck(id, free[id])));
    const review = (S.claim = { phase: 'review', primary, items });
    const ttl = typeof window.__VC_CLAIM_REVIEW_MS === 'number' ? window.__VC_CLAIM_REVIEW_MS : CLAIM_REVIEW_MS;
    setTimeout(() => S.claim === review && dropClaimReview() && render(), ttl);
  } catch (e) {
    S.claim = { phase: 'done', items: [], error: `Couldn't prepare the claim: ${e.message}` };
  }
  render();
}

// Send one claim with the account's own login; Vest's error text is kept so the log can say why.
async function sendClaim(id, body) {
  const { token } = await mintAccountToken(id);
  const r = await _fetch(API + '/v3/capital/withdraw', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(body),
  });
  const res = parseJson(await r.text(), {}) || {};
  if (!r.ok) {
    const err = new Error(res.message || res.msg || res.error || `HTTP ${r.status}`);
    err.status = r.status;
    throw err;
  }
  return res;
}

async function claimRun() {
  const c = S.claim;
  if (!c || c.phase !== 'review') return;
  const todo = c.items.filter((i) => i.claimable > 0);
  if (!todo.length) return;
  if (S.armed || S.arming || S.placing || S.adjusting || S.flattening)
    return toast('Disarm and let orders finish before claiming profit.');
  c.phase = 'running';
  c.stop = false;
  const total = todo.reduce((a, i) => a + i.claimable, 0);
  logEvent(
    'warn',
    `Claim profit: claiming from ${todo.length} account(s), one every ${Math.round(claimGap() / 1000)} s.`,
  );
  diag('claim', { outcome: 'started', accounts: todo.map((i) => ({ ...who(i.id), claimable: i.claimable })), total });
  render();
  for (let k = 0; k < todo.length; k++) {
    const item = todo[k];
    if (c.stop) {
      item.status = 'stopped';
      continue;
    }
    if (k) {
      item.status = 'waiting';
      render();
      for (let w = 0; w < claimGap() && !c.stop; w += 250) await sleep(Math.min(250, claimGap() - w));
      if (c.stop) {
        item.status = 'stopped';
        continue;
      }
    }
    item.status = 'claiming';
    render();
    // re-read this account right before claiming: a trade, a deposit or another claim may have changed it
    let fresh;
    try {
      const { free } = await claimBalances();
      fresh = await claimCheck(item.id, free[item.id]);
    } catch (e) {
      fresh = { ...item, claimable: 0, reason: `couldn't be re-checked (${e.message})` };
    }
    if (!(fresh.claimable > 0)) {
      Object.assign(item, { status: 'skipped', reason: fresh.reason });
      logEvent('warn', `Claim profit: ${item.label} skipped: ${fresh.reason}.`);
      diag('claim', { ...who(item.id), outcome: 'skipped', reason: fresh.reason });
      continue;
    }
    Object.assign(item, { claimable: fresh.claimable, net: fresh.net });
    const body = {
      account_id: item.id,
      amount: fmtNum(fresh.claimable, 6), // as Vest's window sends it: "105.27086"
      target_account_id: c.primary,
      idempotency_key: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
    };
    try {
      let res;
      try {
        res = await sendClaim(item.id, body);
      } catch (e) {
        if (e.status && e.status < 500 && e.status !== 429) throw e; // refused: not retried
        await sleep(CLAIM_RETRY_MS); // network or server trouble: once more, same key, so it can't pay twice
        res = await sendClaim(item.id, body);
      }
      const got = parseFloat(res.trader_amount);
      Object.assign(item, { status: 'claimed', net: got > 0 ? got : item.net });
      logEvent(
        'ok',
        `Claim profit: ${item.label} claimed ${money(item.claimable)}: ${money(item.net)} to your Primary Account within 24 hours.`,
      );
      diag('claim', { ...who(item.id), outcome: 'claimed', amount: body.amount, net: item.net, reply: res });
    } catch (e) {
      Object.assign(item, { status: 'failed', reason: e.message });
      logEvent('warn', `Claim profit: ${item.label} NOT claimed: ${e.message}.`);
      diag('claim', {
        ...who(item.id),
        outcome: 'failed',
        amount: body.amount,
        error: e.message,
        status: e.status || null,
      });
    }
    render();
  }
  const done = todo.filter((i) => i.status === 'claimed');
  const sum = (f) => centsDown(done.reduce((a, i) => a + i[f], 0));
  c.phase = 'done';
  logEvent(
    done.length === todo.length ? 'ok' : 'warn',
    `Claim profit: ${done.length}/${todo.length} claimed, ${money(sum('claimable'))} gross → ${money(sum('net'))} to your Primary Account within 24 hours.`,
  );
  diag('claim', {
    outcome: 'finished',
    claimed: done.length,
    of: todo.length,
    gross: sum('claimable'),
    net: sum('net'),
  });
  setTimeout(refreshBalances, BALANCE_AFTER_TRADE_MS);
  render();
}

// The claim card under the P&L list: a button, then the preview to confirm, then progress and the result.
export function claimHtml() {
  const c = S.claim;
  if (!c && S.armed)
    return `<div class="claim"><button class="ghostbtn claim-go" data-claim="preview" disabled>Claim all profit…</button>
        <div class="sum-note">Disarm the copier to claim profit: a trade copied mid-claim would change what each account
        can claim.</div></div>`;
  if (!c)
    return `<div class="claim"><button class="ghostbtn claim-go" data-claim="preview">Claim all profit…</button>
        <div class="sum-note">Moves each funded account's profit to your Primary Account, one account at a time. Shows a
        preview first; nothing is sent until you confirm.</div></div>`;
  if (c.phase === 'checking') return `<div class="claim"><div class="sum-note">Checking every account…</div></div>`;
  const line = (i) => {
    const st = i.status;
    const right =
      st === 'claimed'
        ? `<span class="pos">claimed · ${money(i.net)} to you</span>`
        : st === 'failed'
          ? `<span class="neg">not claimed: ${esc(i.reason)}</span>`
          : st === 'skipped'
            ? `<span class="dim">skipped: ${esc(i.reason)}</span>`
            : st === 'stopped'
              ? `<span class="dim">stopped</span>`
              : st === 'claiming'
                ? `<span>claiming…</span>`
                : i.claimable > 0
                  ? `<span>${money(i.claimable)} → <b class="pos">${money(i.net)}</b> (${Math.round(i.split * 100)}%)</span>`
                  : `<span class="dim">${esc(i.reason)}</span>`;
    return `<div class="claim-row"><span>${esc(i.label)}</span>${right}</div>`;
  };
  const rows = c.items.map(line).join('');
  const todo = c.items.filter((i) => i.claimable > 0);
  const gross = centsDown(todo.reduce((a, i) => a + i.claimable, 0)),
    net = centsDown(todo.reduce((a, i) => a + i.net, 0));
  if (c.phase === 'review')
    return `<div class="claim"><div class="claim-h">Claim profit: review</div>${rows}
        ${
          todo.length
            ? `<div class="sum-note">Claims go to your Primary Account and arrive within 24 hours. They can't be reversed.
                Accounts are claimed one at a time, ${Math.round(claimGap() / 1000)} s apart, each re-checked first.</div>
              <div class="claim-btns"><button class="armbtn sm" data-claim="run">Claim ${money(gross)} → you get ${money(net)}</button>
                <button class="ghostbtn" data-claim="close">Cancel</button></div>`
            : `<div class="sum-note">Nothing to claim right now.</div><div class="claim-btns"><button class="ghostbtn" data-claim="close">Close</button></div>`
        }</div>`;
  if (c.phase === 'running')
    return `<div class="claim"><div class="claim-h">Claiming…</div>${rows}
        <div class="claim-btns"><button class="ghostbtn" data-claim="stop" ${c.stop ? 'disabled' : ''}>${c.stop ? 'Stopping…' : 'Stop after this account'}</button></div></div>`;
  return `<div class="claim"><div class="claim-h">Claim profit: done</div>${c.error ? `<div class="neg">${esc(c.error)}</div>` : rows}
      <div class="claim-btns"><button class="ghostbtn" data-claim="close">Done</button></div></div>`;
}
export function wireClaim(body) {
  body.querySelectorAll('[data-claim]').forEach(
    (b) =>
      (b.onclick = () => {
        const a = b.dataset.claim;
        if (a === 'preview') claimPreview();
        else if (a === 'run') claimRun();
        else if (a === 'stop' && S.claim) {
          S.claim.stop = true;
          render();
        } else if (a === 'close' && !claimBusy()) {
          S.claim = null;
          render();
        }
      }),
  );
}
