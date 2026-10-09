# STRATUH Copier — User Guide

STRATUH Copier (formerly Vest Copier) is a Tampermonkey userscript that mirrors your trades from one Vest Markets
account (the **master**)
to your other accounts (the **followers**), live, from inside the Vest web page. Everything happens in
your own logged-in browser session: nothing logs in on your behalf, and it only acts when you trade.

> **Risk notice.** This places **real orders on live accounts** the instant you arm it. One bad
> master trade hits **every** linked account at once. Vest has no official copier; a Vest team
> member has said third-party copy tools aren't prohibited ("use at your own risk"). Every order it
> sends is your responsibility. Start tiny.

---

## 1. Install

1. Install the **Tampermonkey** browser extension from your browser's official store:
   [Chrome / Brave](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) or [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/). Use those store pages, not download buttons on other
   sites (some are ads for unrelated software). In Chrome, Edge or Brave,
   go to `chrome://extensions`, open Tampermonkey's **Details** page and switch **Allow User Scripts** on
   (without it the script is installed but never runs).
2. Open the install link,
   <https://github.com/xAmped/Vest-Copier/releases/latest/download/vest-copier.user.js>, and click
   **Install**. After that, Tampermonkey keeps it updated by itself.
3. No link? Open Tampermonkey → **Create a new script**, delete the template, paste the entire contents of
   `vest-copier.user.js`, and **Save** (Ctrl/Cmd-S).
4. Open or refresh **next.vestmarkets.com**. The **STRATUH Copier** panel appears on Vest's chart, on the left.

**Updating:** the panel checks GitHub each time Vest loads. When there's a newer version, a bar under the panel's tabs shows
**Install**: click it, click **Update** on Tampermonkey's page, then come back to the Vest tab: it reloads by
itself (if you're armed it shows **Reload now** instead, since reloading disarms).
**Settings → Updates** has **Check now** and a switch to turn the check off. Installed from the link,
Tampermonkey also updates the script on its own schedule. Your settings and logs are kept.

**Sharing with a friend:** the userscript contains **no personal information** — no tokens, keys,
emails, or account ids. It's safe to send. It only ever uses the session of whoever installs it in
their own browser.

---

## 2. The panel at a glance

- **Header:** the STRATUH logo and **COPIER**, an **ARMED · LIVE / READY / IDLE** tag, small `FAST`/`CAP` markers when
  those options are on, the **pin** (docked on the chart, or floating), **Reload accounts** (↻) and minimise (`–`).
- **Tabs:** **Accounts**, **Trade**, **P&L**, **Settings**, **Rules**, and **Support** (report a problem, share an idea,
  the Discord, links to the guides, the AMPED code).
- **Accounts:** your **master** on top in its own block, then the **followers** with how many are copying, then any
  other account sizes. Each row shows the account, its type chip, a green/red "can trade" dot, **balance** (true
  equity), **floor** (or **daily floor** on plans with a daily loss limit, when it's the higher one today), **room
  left** to that floor, **% used**, and two selectors, **M** (make master) and **FLW** (add follower).
- **Controls:** **ARM / DISARM** and a red **Flatten All**.
- **Activity log:** folded to one line showing the latest event. Click it to open the full feed, with **Diag** /
  **CSV** / **Clear**. The panel remembers whether you left it open. Prompts that need you (Flatten / Keep for
  followers left without the master) always show above it.
- **Bottom bar:** the AMPED code on the left; on the right a colored dot with **Vest's build**, your **version** and a
  live `API nnn/200` budget. Green = a known build; amber = Vest changed its site (click to run the site check).

**Where it sits.** The panel is docked on Vest's chart: it starts on the left, just right of the chart's drawing
tools, and stays inside the chart whatever you resize (the window, Vest's order book or its positions list). Drag the header
to move it; drag the bottom-right corner to resize. Its spot is remembered relative to the chart. Click the **pin** to
float it anywhere in the window instead, and again to dock it back. On a Vest page without a chart it floats.
Vest's menus and dialogs (market selector, Add Account, settings) open above the panel. The chart's own menus
(timeframe, chart settings, indicators) are drawn inside the chart, so the panel fades out of their way while one is
open over it.

**Minimised,** it's a small pill with the logo, COPIER and the state: click it to open, or press and move to drag it.
A red dot means something needs you (followers waiting on Flatten / Keep, or Vest's live feed lost while armed); an
amber dot means Vest updated its site. Position, size and open or minimised are all remembered.

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
- **Only your orders are copied.** When Vest closes the master itself (a stop or target filling, a drawdown
  breach, a liquidation), nothing is copied. The log says what Vest did, and a follower still in the trade a few
  seconds later is offered as **Flatten / Keep** (or closed by itself with **Auto-flatten** on).
- **Live from Vest.** The panel listens to the live feed Vest's own page uses: balances, P&L and fills on every
  account update as they happen. An account that fails drops out at once: a follower is removed and the others keep
  copying; if the master fails, the copier disarms. New accounts appear by themselves.

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
  right at the margin edge. Equal- or larger-equity followers send exact 1:1 with no haircut, and so do followers
  within 0.5% of the master's equity (same-size accounts a few cents apart).
- If an account is too small to hold even the minimum size, it's **skipped** with a clear log line
  rather than sent a bad order.

Turn Cap-to-fit on when your accounts aren't identical, or whenever you want each account risking the
same percentage rather than the same contracts.

---

## 5. Using it, step by step

1. Your accounts load by themselves (click **Reload accounts** ↻ if not). Check the green "can trade" dots.
2. Click **M** on your master. Click **FLW** on each follower.
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
6. **DISARM** when you're done (always available, even mid-session). While armed, **M**, **FLW** and **Cap-to-fit**
   are locked: disarm to change them. Arm in one Vest tab only; the copier warns when it's open in a second tab and
   won't arm while another tab is armed. A page reload disarms it (the log says so): arm again to keep copying.

---

## 6. Trade tab (points-based order panel)

Open **Trade** (top tabs). It trades your selected **master** in the **market Vest is showing**: switch Vest's chart
to ES and the tab switches to ES. Each market keeps its own size, stop and targets, since points mean different money
on ES and NQ; the first time you open a market, the log reminds you to check them. If the copier is armed, followers
copy every order like any other master order.

**Top: margin and risk bars.**

- **Margin:** how much of Vest's buying power (its 100%) your position uses, and how many contracts are left.
- **Risk:** what your stop would lose, fees included, against the room left before your floor.
- They share one line above the setup. The striped part previews the order you're about to send; a bar turns amber
  near the limit and red past it. Both use the **tightest account** (hover them to see which): when the copier is armed
  in strict 1:1, the master or a follower, whichever has less.

**Setup.**

- **Size:** *Qty*, *Risk $* (risk ÷ stop points → contracts; $1 per point per contract on Vest's perps), or *Max*:
  the most the account can open right now, worked out the way Vest's own ticket works out its 100% (free cash ×
  leverage, less room for the fee and the spread). Armed in strict 1:1, Max is the smallest of the master's and every
  follower's, since they all copy the same size.
- **Targets:** how the size splits across them, **Start** (heaviest first), **Even** or **End** (heaviest last);
  **+ Add** for another target, × to remove one.
- **The price ladder:** one table, top to bottom: your targets (farthest first), the entry, the stop, and the **fail**
  price (where the account's equity reaches its floor: the drawdown floor, or the daily-loss floor when that's higher).
  On an evaluation there's a **pass** row too (where it reaches the target). The middle column holds each level's
  points (type them there), size and dollars; **Sell** prices are on the left and **Buy** prices on the right. Fail and
  pass count the opening fee and the account's current equity, like Vest's own estimates.
- **Allowed range** (shown when a limit bites, or nearly does): size = risk ÷ stop, the size can't go over what the account can open, and a stop-out can't
  take you past your floor. In *Risk $* mode the panel shows how much you can risk at your stop and in total ("Can
  risk up to $159 at 20 pts · $278 max before the floor") and the smallest stop for your risk ("Stop must be at least
  25 pts to risk $200"); in *Qty* mode, how many contracts fit and the widest stop before the account fails.
- **Auto BE:** *Off*, *After TP1* or *At +pts*. It moves the stop to your entry once due; **lock** adds that many
  points of profit beyond the entry (0 = exact breakeven). It watches market orders from the panel, so leave the Vest tab open.
  It survives a page reload and stops watching when the trade closes. It moves once price is 4 ticks clear of the new
  stop, measures from your average entry as Vest has it, and leaves alone a stop you've already moved past breakeven.
  Each market keeps its own trigger and lock points.
- **Blocked orders:** a size the account can't open is never sent (Vest would accept it and not fill it). The buttons
  turn off with the reason and one-click fixes: **Set stop to …** (keeps your $ risk), **Risk $… instead** (keeps your
  stop) or **Use max**.
- **Warning** (amber, the order can still be sent): a stop-out would lose more, fees included, than the room left to
  the floor, so the account fails before the stop fills.

**Bottom: the buttons.**

- **Buy / Sell** send a market order with the stop and targets attached as native Vest legs (they work on Vest's side
  even if your tab closes). Right after the fill, the stop and targets are re-placed exactly your points from your
  **fill** price.
- **Buy LMT / Sell LMT** price a limit order with a click on Vest's chart (a click, not a drag), or type the price.
  A dashed line shows the order on the chart and the ladder shows its stop and targets measured from the limit price.
  Nothing is sent until **Place**; **Esc** or **Cancel** stops. A buy limit goes below the mark and a sell limit
  above it. The stop and targets go in with the order and Vest activates them when it fills. Limits open a new trade;
  Auto BE stays with market orders (use **Breakeven** once a limit fills). Move or cancel a resting limit on Vest's own
  chart or order list: followers' limits move and cancel with it when armed.
- **Fits your screen:** on the Trade tab the panel grows to the bottom of the window, and the buttons stay pinned in
  view while you scroll the form.

**In a trade.** The position becomes the screen: a card with side, size, live P&L, average entry and how many accounts
are in it, chips showing where your stop and targets sit on Vest (the stop with what it makes or loses from your
average), and a risk bar for what's left before your floor. The setup folds into one line ("Setup · stop 20 · TP
20/40/60 …"); click it to change how an add rebuilds. Warnings then speak about the next add in one short line ("Add
0.5: more than Account 53 can open"), since your open position is already placed.

- **Breakeven** moves the stop to your **average entry** (an average between ticks rounds toward profit to the nearest
  tick, so it never locks a loss). It's offered once price is 4 ticks clear of the entry, since Vest refuses a stop
  the bid or ask has already passed; hover it for the reason when it's grey.
- **Close** closes the master's position; armed, the copier closes the followers.
- **Add:** the button for your direction becomes **Add**, with chips **+25%**, **+50%**, **+100%** of your position
  or **MAX**, the largest add that fits Vest's buying power and keeps a stop-out above the floor. A chip that wouldn't
  fit is greyed with the reason ("over margin", "past floor", or "stop past price" when the position is so far in a loss
  that the rebuilt stop would sit beyond the price). Click a picked chip again to go back to your Size. A
  preview shows the new total, average and stop-out cost.
- An add uses Vest's own "add to position" order, which followers copy, scaled. The targets are then rebuilt as **one
  ladder for the whole position**, measured from the **new average entry**, with the full size re-split by your scale
  setting, and breakeven is re-measured from it too. **Your own changes stay:** a stop or target you moved since the
  panel placed it (on the chart, with Breakeven, from Vest's positions table, closer or further) keeps its price; only
  its size is re-split. A stop the panel placed is rebuilt, but never loosened: one already tighter than the rebuilt one
  stays. Nothing is placed past the price: a target the price has already passed keeps its old level. While you're in, the ladder shows the levels the add would
  leave, with a live **Price** row.
- The other direction is replaced by Close: the panel doesn't reverse a position in one click.

## 7. Settings

- **Fast mode** — fires follower entries the *instant* you send yours, for the most simultaneous
  fills. Trade-off: followers open *before* your master order is confirmed. If your master entry is
  then rejected, you'll be warned about "orphan" follower positions.
- **Auto-flatten orphans** — if followers end up in a trade the master isn't in (its entry was refused
  or didn't fill, or Vest closed the master), closes them automatically instead of asking. It never acts when the master might be in
  the trade.
- **Cap-to-fit size** — equity-scaled sizing and different-size followers (see §4).
- **Hide marks on bars** (on by default) — hides Vest's buy and sell marks on the chart each time it loads, the same
  as the chart's right-click **Hide marks on bars**, which Vest forgets on every refresh. Show them again from that
  menu whenever you want; the copier leaves them shown until the next load.
- **Hide session shading** (on by default) — removes the pre-market, after-hours and overnight bands Vest draws on
  the chart (its Market Sessions indicator), each time Vest adds them.
- **STRATUH theme for Vest** (on by default, dark mode only) — Vest's own page and chart in STRATUH's colours: onyx and
  lime, square corners, grey candles, and no Volume indicator added by Vest (one you add yourself stays). The first
  time, a bar under the tabs offers **Keep it** or **Back to Vest's colours**. Turning it off brings Vest's colours
  back at once (the chart's after a refresh).
- **Shorts and losses** — grey (as on STRATUH's DeepCharts theme) or red, for Sell buttons, losing P&L and the bid
  side of the book. Candles stay grey either way.

Options are saved and persist across refreshes. Active ones show as `FAST` / `CAP` in the header.

---

## 8. Safety tools

- **Flatten All** — closes **every** open position and cancels **every** order on **all** your loaded accounts, at
  once and with **no confirmation**: an emergency button, and a fast way out of a trade across many accounts. The
  copier **stays armed**, so your next trade copies as usual (press DISARM if you want to stop). Orders you place on the
  master while it's flattening aren't copied, because Flatten All closes them too. It acts on *all* loaded accounts, not
  just the selected group, so an unrelated manual trade would be closed too.
- **Disarm** — stops copying immediately. It does **not** close positions; use Flatten All for that.
- **Fill confirmation** — after each entry, the copier checks that every follower actually filled, from Vest's
  live feed (about a tenth of a second) or, if that's quiet, Vest's fill history. A follower that was accepted but
  didn't fill (usually too small for the trade) is flagged loudly and dropped from tracking, so later stops/closes
  don't target a trade that isn't there.
- **Screen check** — while armed, if Vest's own screen is on another of your accounts, the panel warns that orders
  placed there aren't copied (only the master's are).
- **Site check (after Vest updates)** — when Vest ships a site update, the status in the bottom right turns amber
  ("Vest updated — click to run the site check") and **arming is paused**. Click it: the copier probes
  every Vest endpoint it relies on and scans Vest's code for the order endpoints and fields it uses —
  read-only, no orders placed. Each check shows green / amber / red. If nothing is red, click
  **Accept this build**, then do one small test (one follower: open with a stop, move the stop, close).
  If anything is red, don't arm — hit **Diag** and send the file.
- **Live order check** — every master order is checked against the fields the copier needs. If Vest
  changed its order format, the log warns immediately (and says what's missing or new).

---

## 9. Reports: P&L, activity log, diagnostics

- **P&L** (tab) — per-account profit and a total. Profit = current equity − starting capital. Live, like Vest's
  Account Value: open trades re-price with every price move (on the middle of Vest's order book, as Vest does), and
  balances update the moment anything fills, from Vest's live feed. Everything is also re-read in full once a minute
  (every 20 seconds if the live feed is down). A balance that can't be read shows "—". The figure beside the total, with the lime edge, is **what you keep**: each funded account's profit ×
  its own profit split, added up, as if you claimed it all now (Vest applies the split flat at each claim). Each
  account shows its share. Evaluations aren't counted (their profit doesn't pay out until you're funded), and an
  account in a loss counts as $0, since claims are per account. With trades open it reads "if closed now"; Vest may
  ask you to close positions before a claim.
- **Claim all profit** (bottom of the P&L tab; disarm first) — claims every funded account's available profit to your Primary
  Account, the same claim as the Claim Profit window Vest itself offers, for the full amount. First a **preview**: what each account
  claims and what you receive after its split, or the reason it can't claim (an open position or order, no profit, an
  evaluation). Nothing is sent until you click **Claim … → you get …**. Accounts are then claimed one at a time, a
  second apart, each re-checked just before its claim; **Stop after this account** ends the run early. Each result is
  in the activity log. Claims arrive within 24 hours and **can't be reversed**. Withdrawing from your Primary Account to
  a wallet stays a manual step on Vest.
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
- Vest uses **cross margin** by default. Leverage caps are per market and plan (on funded accounts NQ is 50x and ES
  75x on most plans); the copier reads them from Vest.
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
- **After a Vest site update** (amber status), do a tiny test before trading heavily.
- Keep sizes small enough that a **simultaneous loss across every account** is survivable.

---

## 12. The AMPED code

On first use (after accepting the terms) the panel asks once whether you'd like to use code **AMPED**: 5% off your
Vest purchases, and it helps keep the copier maintained. If you already use another code, the question names it.
**Yes** sets AMPED in Vest's purchase window each time it opens, replacing any other code there, and notes it in
the activity log. If Vest refuses AMPED, your previous code is put back. **No** changes nothing. **Settings →
Support** turns the switching on or off and has a **Copy code AMPED** button.

## 13. Troubleshooting

Questions or setup help: ask in the [Discord](https://discord.gg/Aa69y9KnM3).

- **Panel didn't appear** — confirm the script is enabled in Tampermonkey and you're on
  `next.vestmarkets.com`; refresh.
- **"Couldn't capture your Vest session"** — click around Vest for a second, then click
  **Reload accounts** (↻) in the panel.
- **Breakeven stays grey** — price isn't clear of your entry yet (the bid, for a long, or the ask, for a short, 2 ticks
  past it; 4 ticks when Vest's order book isn't coming through), the stop is already at or past breakeven, or the
  position has no stop. Hover the button for which.
- **Can't select a follower** — it's a different size/type than the master. Turn on **Cap-to-fit**,
  or pick matching accounts.
- **Can't arm** — the log says why: a follower in the opposite direction, a follower in a trade the
  master isn't, or a resting order. Fix that account on Vest, then arm. (Same trade on master and
  followers is fine — it's adopted.)
- **An order didn't fill** — the log says which account (master included). Vest accepted it but didn't execute
  it, usually because there wasn't enough margin for that size. A follower that misses an entry is dropped from
  tracking; one that misses an add keeps its original position.
- **Something looks wrong** — open the **Support** tab. Describe what happened and
  click **Save report & open issue**: it saves one report file (activity log, diagnostics, settings, balances;
  account ids replaced by names) and opens a GitHub issue with your description filled in. Drag the file in and
  submit (a free GitHub account is needed).
