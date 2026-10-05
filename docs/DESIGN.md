# Vest Trade Copier — Design

**Last updated:** 2026-10-05
**Form factor:** Tampermonkey/Violentmonkey userscript, scoped to `https://next.vestmarkets.com/*`
**Status:** implemented as `src/vest-copier.user.js` (see CHANGELOG.md for the current version)

> This describes what actually ships. Detection is by **hooking the page's own order requests**
> (not the private WebSocket); fill confirmation is by polling **`/v3/executions`**. The
> `account_state` WS (§3) was mapped while studying the site but is **not** used by the live copier.

## 1. What it does

You trade one account (the **master**) on Vest's normal web UI. The copier mirrors each
action — open, reduce, modify stop/TP, close — onto the **follower** accounts you've selected,
in real time, from inside the same browser tab. There's no backend: it runs entirely in your logged-in
Vest session and borrows that session's auth.

Scope (as shipped):

- **Sizing:** strict 1:1 for same-size/same-type groups by default; opt-in **cap-to-fit** scales
  each follower to its own equity and allows **different-size followers** (see §4).
- **Flat-to-arm, or adopt.** Arm when flat, or adopt a trade the master and followers already share (§6).
- **Never back-fill.** Only *new* master actions are mirrored. A trade that's already open is adopted at arm
  only when master and follower already hold the same position; a flat follower is never opened into it.
- **Arm = live.** Arming fires real orders. A versioned risk acknowledgement must be accepted first (§11). A
  **Flatten All** panic button closes everything on all accounts and disarms.

## 2. System shape

```
  Vest web UI (you trade the master here)
        │  (your order requests)
        ▼
  ┌─────────────────────────────────────────────┐
  │ Userscript (one JS file, runs in the page)   │
  │                                              │
  │  request hook → detector (master only)       │
  │  token mgr ─ account registry                │
  │      │            │                          │
  │      └──────── executor ─────────┐           │
  │                   │              │           │
  │     fill confirm (/executions)   │           │
  │     activity log · diagnostics · health      │
  │                   │                          │
  │                 UI panel                     │
  └─────────────────────────────────────────────┘
        │                         ▲
        ▼                         │
  Vest REST API  (orders, tokens, executions, balances, leverage)
  api-gateway.hz.vestmarkets.com
```

Everything is driven from Vest's page. The copier **hooks the page's `fetch`/XHR**, sees the
master's order requests, and fires the matching follower orders over REST using each follower's own
token. The panel is config + status + safety; it never trades on its own initiative — only in
response to master actions, and only when armed.

## 3. Endpoints & data model (captured, confirmed)

Base REST: `https://api-gateway.hz.vestmarkets.com`
Private event stream: `wss://ws.hz.vestmarkets.com/ws/private` (channel `account_state`)
Public market data: `wss://ws.hz.vestmarkets.com/ws`

### Auth
- Borrow the page's **user-level** bearer token passively (hook `Authorization` headers; it's the
  JWT whose claims have `userId` but no `accountId`). We never run Vest's login/refresh ourselves.
- Mint a per-account token: `POST /v3/auth/account-token` with `{"accountId":"…"}` →
  `{apiKey, accessToken (same value), refreshToken, accessExpiresAtMs (~15 min), accountId, isFunded}`.
  The JWT carries a **`canTrade`** claim — `false` on breached/closed accounts.
- Re-mint when `accessExpiresAtMs` is within ~60s. Minting is cheap.

### Account discovery / classification
- `GET /v3/capital/accounts/active` — authoritative **active** set (closed/failed never appear, so
  "don't show closed" is free). Per account: `initial_capital` (size), `max_drawdown_limit` (floor),
  `max_leverage`, `max_profit_split_pct`, `plan_product_type`, `stage`, `status`.
- `GET /v3/accounts` — balances + `account_type` + `active` flag, to cross-reference.
- Classification:
  - `account_type 1` = primary wallet → **hidden** (not a prop account).
  - `account_type 2` = **Evaluation**.
  - `account_type 3` = **Funded**; if `plan_product_type == "instant_funded"` → **Instant Funded**.
  - Final gate: the minted token's `canTrade` claim; `false` → shown greyed-out, not selectable.
- **Room** (the risk anchor) = `equity − max_drawdown_limit`. Equity from `account_state` balances
  or `/v3/trading-performance/series`.

### Trading (all mutations send an `Idempotency-Key` header)
| Action | Call | Body |
|---|---|---|
| Set leverage | `PUT /v3/user-state/accounts/{id}/leverages/{symbol}` | `{"leverage":"50"}` |
| Open (market) | `POST /v3/positions/open` | `{orderType:"market", leverage, side:"long"/"short", symbol, quantity, timeInForce:"IOC", takeProfits:[{executionType:"market",triggerPrice}], stopLosses:[…]}` |
| Open (limit) | `POST /v3/positions/open` | same + `timeInForce:"GTC"`, `price` |
| Add to position | `POST /v3/positions/append` | `{symbol, positionId, orderType:"market", quantity, leverage, isBuy, timeInForce:"IOC"}` (+`price` for limit) — no legs. Vest's ticket sends this, not `/open`, when you already hold the same direction; an `/open` on a held symbol is accepted but never executed |
| Reduce | `POST /v3/positions/reduce` | `{positionId, orderType:"market", leverage, quantity, timeInForce:"IOC", reduceOnly:true, symbol}` |
| Close | `POST /v3/positions/close` | `{symbol, positionId, orderType:"market", leverage}` |
| Cancel resting | `POST /v3/positions/cancel-order` | `{orderId}` |
| Move stop | `PUT /v3/positions/stop-loss` | `{positionId, executionType, triggerPrice, stopLossId, quantity?}` |
| Move TP | `PUT /v3/positions/take-profit` | `{positionId, executionType, triggerPrice, takeProfitId, quantity?}` (`quantity` resizes a sized leg) |
| Flat check | `GET /v3/positions/opened` · `/opened-orders` | — (null when flat) |
| Symbol specs | `GET /v3/exchangeInfo` | `sizeDecimals`, `tickSizes`, margin ratios |

Open response → `{positionId, orderId, stopLossIds[], takeProfitIds[]}`. Brackets are
`size_mode:"full_position"` — they always cover the whole remaining position, so a `reduce` does
**not** require resizing them, and canceling a resting order auto-cancels its attached brackets.

### Fill confirmation (`/v3/executions`)
After an order is placed, the copier polls `GET /v3/executions?account_id=…&symbol=…` and matches
the returned item `id` to the order id to get the **fill price/time**. This is how it verifies a
follower actually filled (a 200-OK open can still fail to execute on insufficient margin) and how it
computes per-account slippage vs the master. Retries a few times to absorb propagation lag.

### The event stream (`account_state`) — reference only, not used live
Mapped while studying the site; the shipped copier does **not** subscribe to it (detection is request-hooks,
confirmation is `/executions`). Kept here because it documents Vest's data model. Every
order/position/bracket/balance change pushes one message:
```
{ channel:"account_state", data:{
    account_id, account_seq (monotonic), event_id, occurred_at,
    orders:[{ order_id, position_id, side:"buy"/"sell", quantity, executed_quantity,
              status:"pending"/"accepted"/"filled"/"cancelled", execution_price, fee,
              position_order_type:"…OPEN"/"…REDUCE"/"…CLOSE", event_type:"…PLACED"/"…FILLED"/… }],
    positions:[{ position_id, side:"long"/"short", quantity, open_price, pnl, collateral,
                 leverage, status:"waiting"/"opened"/"closed", event_type:"…OPENED"/"…REDUCED"/"…CLOSED" }],
    order_intents:[{ id, kind:"stop_loss"/"take_profit", state:"pending_activation"/"active",
                     trigger_price, event:"CREATED"/"ACTIVATED"/"UPDATED"/"CANCELED", revision }],
    balances:[…], final_balance:{ amount, balance_version } } }
```
This is the detection source and the follower confirmation source. `account_seq` + `event_id`
give ordering and dedup.

## 4. Scaling (strict 1:1, or opt-in cap-to-fit)

Two modes, chosen by the **Cap-to-fit** toggle (Opts):

**Strict 1:1 (default).** Accounts are grouped by **(initial_capital, type)**; you select a master +
followers inside one group. Follower `quantity` = master `quantity` **1:1**. Followers must match the
master's size & type.

**Cap-to-fit (opt-in).** Each follower is scaled to its own equity, and followers may be **any
size/type** (e.g. a 25k master driving 5k accounts). This is the room-proportional engine, driven by
equity:

```
prop = masterQty × (followerEquity / masterEquity)      // same margin utilisation → same % risk
send = prop ≥ masterQty ? masterQty                      // equal/richer → exact 1:1, no haircut
                        : floor(prop × 0.95, tick)        // smaller → scale down with a safety buffer
```

- **Why it's affordable & latency-free.** Vest's open gate is `PortfolioValue ≥ Σ(size × indexPrice ×
  (1/leverage))`. With leverage synced and the same symbol/price, this reduces to the equity ratio —
  **no price lookup, no network call** (uses the equity already polled every 20s; refreshed once at
  arm). Because margin and fees both scale linearly with equity, the proportional size is provably
  affordable whenever the master's own order was. The 0.95 buffer only applies when scaling *down*,
  purely to cushion ≤20s-stale equity and fees; equal/richer followers get no haircut.
- **Same stop, same %.** The stop/TP is a mirrored **price**, so the point distance is identical on
  every account; since size tracks equity, the $ loss scales with account size and the **% risk is
  the same** (× 0.95 for scaled followers). Verified numerically across 50/80/100% master utilisation.
- **Reduces** are scaled by the same follower:master ratio so a capped position isn't over-reduced.
  Closes and SL/TP use `full_position`, so they track the follower's own (smaller) size automatically.
- **Rounding:** floor `quantity` to the master order's decimal precision. If the result rounds below
  one tick, the follower is **skipped with a visible reason**, never silently mis-sized.
- **Never upsizes:** a follower richer than the master still mirrors 1:1 (no surprise leverage).

## 5. Action model (the safety invariant)

The copier never reasons in raw buy/sell. It derives a small action vocabulary from the master's
**hooked order requests** (the endpoint path tells it which action) and applies the *same* action to
followers:

| Master request | Follower action |
|---|---|
| `POST /positions/open` | `OPEN` same side, sized (1:1 or cap-to-fit), same bracket trigger prices |
| `POST /positions/reduce` | `REDUCE` (`reduceOnly:true`), scaled to the follower's size |
| `PUT /positions/stop-loss` · `/take-profit` | move that follower's own `stopLossId`/`takeProfitId` to the same trigger price |
| `POST /positions/close` | `CLOSE` the mapped position |
| `POST /positions/cancel-order` | `cancel-order` the mapped order |

A close is always a `reduceOnly` close of a position **we are already tracking** — so it is
structurally impossible for a follower to flip to the opposite direction. If we have no mapped
position for a follower (it missed the entry, was off, or was rejected), the action is **skipped**,
not errored.

### Master→follower mapping
Per master `positionId` we store, for each follower: its own `positionId`, `orderId`,
`stopLossId`, `takeProfitId` (from that follower's open response). All later reduce/modify/close
calls use the **follower's own** ids, never the master's.

### Ordering
Every follower action on one trade runs through a per-trade queue: an exit never overtakes the entry or an add still
in flight, and two quick edits of the same leg land in the order they were made. Entries themselves never wait.
Follower closes and reduces are retried once on a rate limit or server error.

### Refused master orders
The hooks pass the HTTP status through; a master order Vest refused (non-2xx) is logged and never copied.

### Feedback-loop guard
The hook sees requests from *every* account the page makes (and our own follower sends use a
pre-captured `fetch`, so they aren't re-hooked). The detector acts **only** on requests whose token
`accountId` is the designated master; everything else is ignored.

## 6. Arming & lifecycle

1. **Load** → capture the page's user token, mint per-account tokens, build the account registry.
2. **Configure** → pick a master + followers. Strict 1:1 requires one size/type group; **cap-to-fit**
   (Settings) allows different-size followers. Options (fast mode, auto-flatten, cap-to-fit) persist.
3. **Acknowledge** → the risk terms are shown on first load and must be accepted (tick box + button) before arming
   or placing a Trade-tab order (§11).
4. **Arm** → reads every selected account's `/positions/opened` + `/opened-orders` (an unreadable
   account blocks arming; it's never assumed flat). Then:
   - Everyone flat → arm normally.
   - Master holds positions → **adopt**: each follower position with the same symbol **and** side is
     linked to the master's (`posMap[masterPositionId].followers[f] = { positionId, qty, legs }`),
     so reduce / close / stop moves mirror as usual (reduces scale by follower:master size). Flat
     followers stay flat and join from the next trade — nothing is back-filled.
   - Refused: resting orders anywhere; a follower in the opposite direction; a follower holding a symbol
     the master doesn't; two positions on the same symbol+side (ambiguous).
   - Stop/TP ids are read from each position's `stopLosses` / `takeProfits`. A master leg with no
     matching follower leg (by kind + price) is noted at arm: changes to it won't copy to that follower.
   Follower leverage is then synced to the master's per symbol — **except** for symbols with an open
   position, which are left untouched. With cap-to-fit on, equity is refreshed for a fresh baseline.
5. **Run** → mirror new master actions; confirm fills via `/executions`. Arming is guarded against double starts
   and against a selection change, disarm or Flatten All while it runs (an epoch is bumped by both).
6. **Disarm** → manual (always available), or automatic if a selected account disappears
   (closed/blown). Disarm does **not** touch open positions — use **Flatten All** for that.

## 7. Reconciliation, slippage & diagnostics

- After an entry, add or close, confirm every order via `/v3/executions` (with retries); only immediate (market /
  IOC) orders are checked, since a resting limit has nothing to find yet. A lookup distinguishes **filled**,
  **confirmed not filled** and **lookup failed**; a failed lookup never counts as "not filled" (nothing is dropped or
  flattened, the trader is told the fills couldn't be confirmed).
  - Follower missed an **entry** → flagged and dropped from that trade. Missed an **add** → its size bookkeeping is
    rolled back and sizes are re-read. Missed a **close** → "still OPEN, close it on Vest".
  - The **master** missed its own entry → reported, the trade is forgotten, and followers that did fill are raised
    as **orphans** (Flatten / Keep). Auto-flatten acts only when the master is confirmed to hold nothing there.
- The **activity log** stays lean: master action, per-follower confirmations/warnings, and one fill
  summary per trade (`Fills 9/9 · avg slip 0.20pt`).
- The **diagnostics log** (silent, structured, downloadable JSON via the *Diag* button) records the
  full story per event: intended vs actual size, the cap-to-fit math (equities, proportional/buffered
  qty), fill prices, per-account slippage, **margin used vs cap** (`marginUsed`/`marginCap`/
  `marginUtilPct`), HTTP error codes, latency, and an `met` (expectation-met) flag. Capped at 2000
  records and ~1.5 MB in `localStorage` (shared with Vest's own site); for sending in when something looks off.

## 8. Health check / version detection

- On load, read a Next.js **build fingerprint** (`__NEXT_DATA__.buildId`, else a content-hashed
  bundle name, else a hash of the loaded bundle paths). Store last-known-good.
- Unchanged → green (`build <id>`). Changed → amber **"Vest updated — click to run site check"**, and
  **arming is refused** until the new build is reviewed. A build that can't be identified also needs one check per
  session.
- **Site check** (click the health bar; read-only, places no orders):
  - Probes every endpoint the copier reads — accounts, balances, account-token mint (and its
    `accountId` / `canTrade` claims), `/v3/user-state` leverage, `/positions/opened` + `/opened-orders`,
    `/executions`, `/trading-performance/series` — and verifies each response still has the fields we use.
  - Scans Vest's loaded same-origin JS for the order endpoints and payload fields we send
    (`/v3/positions/open|append|reduce|close|cancel-order`, `takeProfits`, `stopLosses`, `reduceOnly`, …), matched
    as whole terms (so `/open` isn't satisfied by `/opened`).
    Stop-loss / take-profit paths are built dynamically in Vest's code, so they're covered by the live
    guard below plus a small test trade.
  - Results are pass / warn / fail. **Accept this build** is enabled only with zero fails; it stores the
    new fingerprint as known-good. Results and acceptance are recorded in Diag.
- **Live payload guard:** every master order is checked against the fields the copier needs per action;
  missing fields warn loudly, new (un-forwarded) fields warn once per session; both go to Diag.
- Tested end-to-end in headless Chrome against a mocked Vest API: `node test/copier.test.mjs`.

## 8b. Trade panel (points-based orders)

- **Price:** our own read-only connection to Vest's public socket (`<SYMBOL>@ticker` → `markPrice`, ~750 ms;
  REST `/v3/ticker/latest` fallback). Orders are refused on a price older than 5 s. Tick/size rules from
  `/v3/exchangeInfo` (NQ: tick 0.25, 4-decimal sizes; linear, $1/pt/contract).
- **Math** (pure, unit-tested in `test/math.test.mjs`): points → tick-rounded prices; Start/Even/End splits by
  largest remainder in whole size steps (exact totals); risk sizing; breakeven price + trigger.
- **Order shape** — the same shape Vest's own ticket sends: market IOC; stop =
  `{executionType, triggerPrice}` (full position); targets = `{executionType, triggerPrice, quantity}` when there
  are several (sized "fixed" legs summing to the order), no `quantity` when there's one (full position). Numbers
  are sent Vest-style (no trailing zeros). Minimum leg notional $1. Sent through the page's hooked `fetch`, so the
  copier treats it as a master order.
- **Re-anchor after fill (default):** once filled, read the master position (fill + leg ids), move any leg off by
  ≥ 1 tick to exactly N pts from the fill (legs found by the price they were sent at). Runs after entries — never
  delays them. The copier's leg moves and exits wait for any follower opens still in flight (the trade's queue, §5).
  Buy/Sell stay disabled while re-anchoring or a ladder rebuild runs, so two adjustments never overlap.
- **Adding to a trade:** before sending, the panel reads the master's position on the symbol. Opposite direction →
  refused. Same direction → `POST /v3/positions/append` (Vest's own routing), then the ladder is rebuilt for the
  WHOLE position from the new average entry (`openPrice` once `quantity` shows the add): stop moved to avg ∓ stop
  pts; targets re-priced and the full size re-split by the panel's scale — existing legs PUT (price + quantity,
  shrinking legs first so sized legs never exceed the position), extras DELETEd, missing ones POSTed. The breakeven
  plan is re-measured from the new average (or ended if breakeven is now off).
- **Entry prices are verified:** Vest's position `openPrice` was seen wrong right after a fill (290.25 for 31,148),
  so re-anchor and adds take the fill from `/v3/executions` by order id (add: weighted with the held entry), and any
  price used to place legs or breakeven must be within 1% of the market — otherwise nothing is moved.
- **Breakeven:** per-trade plan (persisted); waits for re-anchoring; entry = real fill (`/executions`); due when TP1's price is crossed or
  price is +X pts in favour (sticky); moves the master stop via `PUT /v3/positions/stop-loss` once, only if the new
  stop is on the safe side of price; ends when the position disappears.

### Leg tracking (copier)
Every stop/target is tracked as `{id, kind, price, qty}` on the master entry and each follower (from open
responses, adopted positions, or a re-read of `/positions/opened`), paired by kind + trigger price. The copier is
**method-aware** on `/v3/positions/stop-loss|take-profit`: **PUT** moves the matching follower leg, **POST** adds
a leg (quantity scaled to the follower), **DELETE** removes the matching leg. Sized legs on opens are scaled per
follower (proportional, exact totals). Fixes the old behaviour where an added target was treated as a move.
A single added or resized leg is scaled to the nearest size step, capped so that kind's sized legs never exceed the
follower's position (flooring each leg alone left an uncovered sliver).

### Adds (`/append`) and sizes (copier)
A master `/append` is copied to each tracked follower's own position, scaled by `follower qty / master qty` (same as
a reduce). Adds run through the trade's queue (§5), so later leg edits and exits wait for them. Master and
follower sizes are kept current through adds and reduces; an add that doesn't fill rolls its size back (the account
keeps its original position — it isn't untracked). An add on a position the copier doesn't track (opened before arming
and not adopted) is logged and not copied. Fill confirmation now also reports when the **master's** own order didn't
fill, and warns if followers filled an entry the master missed.

## 9. UI

- **Aesthetic:** token-based near-black onyx theme, grayscale hierarchy, one calm accent
  (green = armed/ok), amber = review, red = rejected/error/danger. Inter, tabular monospace numbers,
  rounded cards, **text labels (no emoji)**. Rendered in a shadow DOM so Vest's styles can't bleed in.
- **Layout:** accounts grouped by size/type; each row shows equity, floor, room-used %, and M / Flw
  selectors. Control row = one big **ARM / DISARM** plus a red **Flatten All**. Tabs: **Accounts**,
  **Trade**, **P&L**, **Settings** (fast mode · auto-flatten · cap-to-fit · updates · support), **Rules**. Header:
  reload accounts (↻), collapse. A health bar (build fingerprint + live `API nnn/200` rate), then the update bar and
  the one-time support question when they apply. A compact activity log with **Diag** (JSON) / **CSV** / **Clear**.
  Draggable + resizable; size persists. Keyboard focus is visible and controls have accessible names.

## 10. Updates

- On every page load the panel asks GitHub's API for the newest commit on `main`, then reads that commit's script and
  compares `@version`. Reading by commit avoids the raw file server's 5-minute cache of `main`. If the API is
  unavailable (rate limit: 60 requests an hour per IP), it falls back to the cached `main` file.
- The bar shows "Checking…", then **Update available** (Install / What's new / Later) or "Up to date", which fades.
  **Install** opens the commit's `.user.js`, which Tampermonkey turns into its update page. A userscript can't replace
  itself.
- After Install, leaving the tab and coming back reloads Vest (not armed), or shows **Reload now** (armed, since a
  reload disarms).
- `@updateURL` / `@downloadURL` point at `main`, so Tampermonkey's own periodic check also updates installs. Any pushed
  version bump reaches every user.
- A copy whose non-ASCII characters were garbled in transit (e.g. through Windows `clip.exe`) warns in the log and
  points at a clean install.

## 11. Risk acknowledgement and support code

- **Terms:** a versioned acknowledgement (`TERMS_VERSION`) shown on first load. Arming and Trade-tab orders are refused
  until it's accepted (tick box, then Accept). Raising the version asks everyone again once. Full text: DISCLAIMER.md.
- **Support code:** after the terms, a one-time question offers code AMPED (5% off). If the account already uses
  another code, the question names it. **Yes** (or the Settings switch) makes the panel set AMPED in Vest's purchase
  window each time it opens: it types the code into the discount box and presses Enter, the way a person would, and
  Vest validates and applies it. If Vest refuses it, the previous code stays. It acts once per opening and logs every
  switch. The discount box is recognised by its styling, never by placeholder: a different box in Vest's "Do You Have
  a Discount Code?" form shares the placeholder, and pressing Enter there would submit that form.
- Vest's referral-link call (`/v2/referrals/join`) is also tried, but Vest refuses it for any account that already
  has an affiliate attribution ("Account already has affiliate attribution"), so the purchase window is the path that
  works.

## 12. Out of scope (noted for later)

- 24/7 headless operation (would require reproducing Privy wallet auth; fragile, deferred).
- A payload **manifest** check that blocks arming on endpoint/field drift (today it only flags the
  build change).

## 13. Risks

- **Anti-automation**: Vest sends a device-fingerprint beacon (`mt.vestmarkets.com`) on account
  switches. In-browser we are the real browser, so low risk — but worth monitoring that rapid
  programmatic account-token minting doesn't trip anything.
- **API drift**: Vest can change endpoints/fields on any deploy. The build-fingerprint badge flags a
  deploy so you re-verify; there's no server contract guaranteeing stability.
- **Shared risk**: one bad master entry hits every linked account at once. Cap-to-fit keeps the %
  risk aligned across sizes, but size so a simultaneous loss is survivable.
