# Vest Copier — User Guide

A Tampermonkey userscript that mirrors your trades from one Vest Markets account (the **master**)
to your other accounts (the **followers**), live, from inside the Vest web page. Everything happens in
your own logged-in browser session: nothing logs in on your behalf, and it only acts when you trade.

> **Risk notice.** This places **real orders on live accounts** the instant you arm it. One bad
> master trade hits **every** linked account at once. Vest has no official copier; a Vest team
> member has said third-party copy tools aren't prohibited ("use at your own risk"). Every order it
> sends is your responsibility. Start tiny.

---

## 1. Install

1. Install the **Tampermonkey** browser extension (Chrome/Edge/Brave/Firefox). In Chrome, Edge or Brave,
   go to `chrome://extensions`, open Tampermonkey's **Details** page and switch **Allow User Scripts** on
   (without it the script is installed but never runs).
2. Open the install link,
   <https://github.com/xAmped/Vest-Copier/releases/latest/download/vest-copier.user.js>, and click
   **Install**. After that, Tampermonkey keeps it updated by itself.
3. No link? Open Tampermonkey → **Create a new script**, delete the template, paste the entire contents of
   `vest-copier.user.js`, and **Save** (Ctrl/Cmd-S).
4. Open or refresh **next.vestmarkets.com**. A **Vest Copier** panel appears top-right.

**Updating:** the panel checks GitHub each time Vest loads. When there's a newer version, a green bar shows
**Install**: click it, click **Update** on Tampermonkey's page, then come back to the Vest tab: it reloads by
itself (if you're armed it shows **Reload now** instead, since reloading disarms).
**Settings → Updates** has **Check now** and a switch to turn the check off. Installed from the link,
Tampermonkey also updates the script on its own schedule. Your settings and logs are kept.

**Sharing with a friend:** the userscript contains **no personal information** — no tokens, keys,
emails, or account ids. It's safe to send. It only ever uses the session of whoever installs it in
their own browser.

---

## 2. The panel at a glance

- **Header:** `Vest Copier`, an **Armed · live / Ready / Idle** tag, small `FAST`/`CAP` markers when those
  options are on, **Reload accounts** (↻) and collapse (`–`).
- **Tabs:** **Accounts**, **Trade**, **P&L**, **Settings**, **Rules**, and **Support** (report a problem, share an idea,
  the Discord, links to the guides, the AMPED code).
- **Health bar:** a colored dot + `build <id>` (green = known build; amber = Vest changed its site,
  re-verify) and a live `API nnn/200` rate indicator.
- **Accounts:** grouped by size and type. Each row shows the account, its type chip, a green/red
  "can trade" dot, **balance** (true equity), **floor** (or **daily floor** on plans with a daily loss limit, when it's
  the higher one today), **room left** to that floor, **% used**, and two
  selectors — **M** (make master) and **Flw** (add follower).
- **Controls:** a big **ARM / DISARM** button and a red **Flatten All**.
- **Activity log:** a clean, live feed, with **Diag** / **CSV** / **Clear** buttons.

Drag the header to move the panel; drag the bottom-right corner to resize. Position and size are
remembered.

---

## 3. Core concepts (read once)

- **Master / followers.** You trade the master on Vest as normal. The copier watches *your own*
  order requests for the master account and fires the matching orders on each follower.
- **Flat, or already in the same trade.** Arm when everyone is flat — or, if the master and followers
  already hold the **same trade** (same market, same direction), arming **adopts** it: closes, partial
  exits and stop moves on the master then copy to those positions. The copier never opens a trade for a
  follower that isn't already in it ("no back-fill"). It refuses if a follower is in the opposite
  direction, holds a trade the master doesn't, or has a resting order.
- **Leverage auto-sync.** When you arm, every follower's leverage is set to match the master's
  (per symbol). Change your leverage or switch symbols → **disarm and re-arm** to re-sync.
- **It mirrors the full lifecycle:** open, add/scale, move stop-loss / take-profit, partial reduce,
  close, and cancel resting orders.
- **Stops and targets copy too:** set at entry, added later, moved, resized or removed. Each follower's
  matching order is changed.
- **Only your orders are copied.** If Vest closes the master itself (a drawdown breach or liquidation),
  followers stay open. Close them yourself or use **Flatten All**.

---

## 4. Sizing: strict 1:1 vs Cap-to-fit

**Strict 1:1 (default).** Every follower gets the master's exact size. Followers must be the **same
size and type** as the master. Simple and predictable for matched accounts.

**Cap-to-fit (optional, in Settings).** Each follower is sized to **its own equity**, and you can mix
**different-size** accounts (e.g. a 25k master driving 5k accounts).

```
follower size = master size × (follower equity ÷ master equity)
```

- Every account then takes the **same % risk** and sees the **same stop distance** (the stop is a
  mirrored price; only the position size differs). Dollar P&L scales with account size.
- A small safety buffer (0.95) applies **only when scaling down**, so a follower never gets rejected
  right at the margin edge. Equal- or larger-equity followers send exact 1:1 — no haircut.
- If an account is too small to hold even the minimum size, it's **skipped** with a clear log line
  rather than sent a bad order.

Turn Cap-to-fit on when your accounts aren't identical, or whenever you want each account risking the
same percentage rather than the same contracts.

---

## 5. Using it, step by step

1. Your accounts load by themselves (click **Reload accounts** ↻ if not). Check the green "can trade" dots.
2. Click **M** on your master. Click **Flw** on each follower.
   - Strict 1:1: followers must match the master's group. For different sizes, turn on **Cap-to-fit**
     in **Settings** first.
3. Set your leverage on Vest the way you'll trade for the session.
4. Click **ARM**. On first use, read the risk terms, tick the box and click **Accept and continue**.
   - It flat-checks everyone, syncs follower leverage to your master, and (with Cap-to-fit) refreshes
     equity for a fresh sizing baseline.
   - If anything isn't flat, it won't arm and names the account that's holding something.
5. **Trade the master normally.** Watch the log: you'll see `MASTER opened …` then
   `↳ OPENED …` per follower, and a one-line fill summary (e.g. `Fills 9/9 confirmed · avg slip
   0.20pt`).
6. **DISARM** when you're done (always available, even mid-session).

---

## 6. Trade tab (points-based order panel)

Open **Trade** (top tabs). It trades your selected **master**; if the copier is armed, followers copy it
like any other master order.

- **Size** — *Contracts*, *Risk $* (risk ÷ stop points → contracts; NQ is $1/point per contract), or *Max*: the
  most the account can open right now, worked out the way Vest's own ticket works out its 100% (free cash × leverage,
  less room for the fee and the spread). When the copier is armed in strict 1:1, Max is the smallest of the master's and
  every follower's, since they all copy the same size.
- **Stop** — in points. **Targets** — in points; **+ Add target** for more.
- **Scale** — how the size splits across targets: **Start** (heaviest first), **Even**, **End** (heaviest last).
- **Breakeven** — *Off*, *After TP1*, or *At +pts*; **lock** adds a point or two of profit to cover fees.
- It shows each target's size and dollars, your risk (plus the fees on top) / reward / R, and the exact stop/target
  prices for both Buy and Sell, with the **fail** price (where the account's equity reaches its floor: the drawdown
  floor, or the daily-loss floor when that's higher) and, on an evaluation, the **pass** price (where it reaches the
  target). Both count the opening fee and the account's current equity, like Vest's own estimates.
- **Warnings** (amber, the order can still be sent): the size is more than the account can open (Vest won't fill it;
  **Use max** switches to Max), or a stop-out would lose more, fees included, than the room left to the floor, so the
  account fails before the stop fills.
- It then sends a market order with the stop and targets attached as native Vest legs (they work on
  Vest's side even if your tab closes). By default the stop and targets are then re-placed exactly N points from
  your **fill** (Measure from → *Your fill*); choose *Price at click* to leave them where they were placed.
- **Adding to a trade** — if the master already holds the same direction, Buy/Sell **adds** to it (Vest's own
  "add to position" order, which followers copy, scaled). The stop and targets are then rebuilt as **one ladder for
  the whole position**, measured from the **new average entry**: stop N points away, targets re-priced, and the full
  size re-split by your scale setting. Breakeven is re-measured from the new average too. An order in the
  **opposite** direction is refused — close or reduce the trade first.
- Breakeven runs from the panel: keep the tab open for it. It survives a page reload and stops watching when the
  trade closes.

## 7. Settings

- **Fast mode** — fires follower entries the *instant* you send yours, for the most simultaneous
  fills. Trade-off: followers open *before* your master order is confirmed. If your master entry is
  then rejected, you'll be warned about "orphan" follower positions.
- **Auto-flatten orphans** — if followers end up in a trade the master isn't in (its entry was refused
  or didn't fill), closes them automatically instead of asking. It never acts when the master might be in
  the trade.
- **Cap-to-fit size** — equity-scaled sizing and different-size followers (see §4).

Options are saved and persist across refreshes. Active ones show as `FAST` / `CAP` in the header.

---

## 8. Safety tools

- **Flatten All** — closes **every** open position and cancels **every** order on **all** your loaded accounts, at
  once and with **no confirmation**: an emergency button, and a fast way out of a trade across many accounts. The
  copier **stays armed**, so your next trade copies as usual (press DISARM if you want to stop). Orders you place on the
  master while it's flattening aren't copied, because Flatten All closes them too. It acts on *all* loaded accounts, not
  just the selected group, so an unrelated manual trade would be closed too.
- **Disarm** — stops copying immediately. It does **not** close positions; use Flatten All for that.
- **Fill confirmation** — after each entry, the copier checks that every follower actually filled.
  A follower that was accepted but didn't fill (usually too small for the trade) is flagged loudly
  and dropped from tracking, so later stops/closes don't target a trade that isn't there.
- **Site check (after Vest updates)** — when Vest ships a site update, the health bar turns amber
  ("Vest updated — click to run site check") and **arming is paused**. Click the bar: the copier probes
  every Vest endpoint it relies on and scans Vest's code for the order endpoints and fields it uses —
  read-only, no orders placed. Each check shows green / amber / red. If nothing is red, click
  **Accept this build**, then do one small test (one follower: open with a stop, move the stop, close).
  If anything is red, don't arm — hit **Diag** and send the file.
- **Live order check** — every master order is checked against the fields the copier needs. If Vest
  changed its order format, the log warns immediately (and says what's missing or new).

---

## 9. Reports: P&L, activity log, diagnostics

- **P&L** (tab) — per-account profit and a total. Profit = current equity − starting capital.
  Updates with the balance poll.
- **Activity log** — the clean, trader-facing feed. **CSV** downloads it.
- **Diag** — downloads a detailed **diagnostics JSON**: for every event it records intended vs actual
  size, the cap-to-fit math (equities, scaled size), fill prices, slippage, **margin used vs the
  account's cap**, latency, and any error codes. It's silent (no log clutter) and **token-scrubbed**
  (safe to share). If something looks wrong, hit **Diag** and send the file.

---

## 10. How Vest's margin works (why sizing matters)

- A position opens only if your **portfolio value ≥ required margin**, where
  `required margin ≈ position size × price × (1 ÷ leverage)`. At 50x that's ~2% of the notional.
- **Portfolio value = collateral + realized + unrealized PnL** — this is the "equity" the copier
  sizes and anchors on (not free collateral, which under-reports while a trade is open).
- Vest uses **cross margin** by default; **funded** accounts cap at **50x**, primary at 100x.
- The most a new order can be (Vest's 100%, "Trading Power") is your **free** cash (less any open loss) × leverage,
  minus a little for the trading fee (0.0025% of the order value on NQ, charged on the way in and out) and the spread.
  Cash already holding other positions isn't free. The Trade tab's **Max** uses the same rule.
- Prop accounts also have a **drawdown floor**, and plans with a daily loss limit a **daily floor** (reset each day at
  20:00 ET). The account closes the moment equity, open trades included, touches either one. Your floor usually binds
  well before liquidation. Fees count: a stop sized to lose exactly your room fails the account before it fills.

This is why an oversized master trade can silently fail on a smaller account (not enough margin) —
and exactly what **Cap-to-fit** solves by sizing each account to what it can actually hold.

---

## 11. Tips & good habits

- **Start tiny.** Do a one-contract test across all accounts before trading real size.
- **Set your stop at entry** so every account is protected from the first second.
- **Don't trade the master at 100% margin** in strict 1:1 — leave headroom so leaner followers can
  match. Or use Cap-to-fit, which handles it.
- **Disarm if you'll place a manual trade** you don't want copied.
- **Re-arm after changing leverage or symbol** so followers re-sync.
- **Keep accounts flat between sessions**, and disarm when you're not actively trading.
- **After a Vest site update** (amber badge), do a tiny test before trading heavily.
- Keep sizes small enough that a **simultaneous loss across every account** is survivable.

---

## 12. The AMPED code

On first use (after accepting the terms) the panel asks once whether you'd like to use code **AMPED**: 5% off your
Vest purchases, and it helps keep the copier maintained. If you already use another code, the question names it.
**Yes** sets AMPED in Vest's purchase window each time it opens, replacing any other code there, and notes it in
the activity log. If Vest refuses AMPED, your previous code is put back. **No** changes nothing. **Settings →
Support** turns the switching on or off and has a **Copy code AMPED** button.

## 13. Troubleshooting

Questions or setup help: ask in the [Vest Copier Discord](https://discord.gg/Aa69y9KnM3).

- **Panel didn't appear** — confirm the script is enabled in Tampermonkey and you're on
  `next.vestmarkets.com`; refresh.
- **"Couldn't capture your Vest session"** — click around Vest for a second, then click
  **Reload accounts** (↻) in the panel.
- **Can't select a follower** — it's a different size/type than the master. Turn on **Cap-to-fit**,
  or pick matching accounts.
- **Can't arm** — the log says why: a follower in the opposite direction, a follower in a trade the
  master isn't, or a resting order. Fix that account on Vest, then arm. (Same trade on master and
  followers is fine — it's adopted.)
- **An order didn't fill** — the log says which account (master included). Vest accepted it but didn't execute
  it, usually because there wasn't enough margin for that size. A follower that misses an entry is dropped from
  tracking; one that misses an add keeps its original position.
- **Something looks wrong** — open the **Support** tab (or click **Problem? Report it** at the bottom of the panel).
  Describe what happened and
  click **Save report & open issue**: it saves one report file (activity log, diagnostics, settings, balances;
  account ids replaced by names) and opens a GitHub issue with your description filled in. Drag the file in and
  submit (a free GitHub account is needed).
