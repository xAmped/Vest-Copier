# STRATUH Copier — User Guide

STRATUH Copier (formerly Vest Copier) is a Tampermonkey userscript that mirrors your trades from one Vest Markets
account (the **master**)
to your other accounts (the **followers**), live, from inside the Vest web page. Everything happens in
your own logged-in browser session: nothing logs in on your behalf, and it only acts when you trade.

> **Risk notice.** This places **real orders on live accounts** the instant you start copying. One bad
> master trade hits **every** linked account at once. Vest has no official copier, and its terms
> treat trade copiers as independent third-party tools: you use one at your own risk, and Vest won't
> investigate or reimburse problems it causes. Every order it sends is your responsibility. Start tiny.

---

## 1. Install

**Use Chrome on a computer.** It's the recommended browser: every release is tested on Chrome before it ships.
Edge and Brave are built on Chrome and behave the same. Firefox works, but isn't tested the same way.

1. Install the **Tampermonkey** browser extension from your browser's official store:
   [Chrome / Brave](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) or [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/). Use those store pages, not download buttons on other
   sites (some are ads for unrelated software). In Chrome, Edge or Brave,
   go to `chrome://extensions`, open Tampermonkey's **Details** page and switch **Allow User Scripts** on
   (without it the script is installed but never runs). No **Allow User Scripts** switch there (older Chrome)? Turn
   on **Developer mode** at the top right of `chrome://extensions` instead.
2. Open the install link,
   <https://github.com/xAmped/Vest-Copier/releases/latest/download/vest-copier.user.js>, and click
   **Install**. After that, Tampermonkey keeps it updated by itself.
3. No link? Open Tampermonkey → **Create a new script**, delete the template, paste the entire contents of
   `vest-copier.user.js`, and **Save** (Ctrl/Cmd-S).
4. Open or refresh **next.vestmarkets.com**. The **STRATUH Copier** panel appears on Vest's chart, on the left.

**Updating:** the panel checks GitHub each time Vest loads. When there's a newer version, a row above the activity line
shows **Install** (with **What's new**, and **Later** to hide it until the next version; while copying it says
"install when flat"): click it, click **Update** on Tampermonkey's page, then come back to the Vest tab: it reloads by
itself (while copying it shows **Reload now** instead, since reloading stops copying).
**Settings → Updates** has **Check now** and a switch to turn the check off. Installed from the link,
Tampermonkey also updates the script on its own schedule. Your settings and logs are kept.

**Paused for a fix:** if a problem turns up, I can pause the copier while the fix ships. The panel then shows
**Paused** with a short note, often asking you to install the newest version (with an **Install** button when the
pause is for an old version). While paused, nothing new is placed or copied (Start copying, new Trade-tab orders and
adds, the master's new trades and adds), and waiting stop orders are cancelled. Close, Reduce, Breakeven and Flatten all
still work, and trades already open keep copying their exits, stop and target moves. Moving a waiting limit while paused
cancels the followers' copies without placing new ones, so leave limits alone until the pause lifts. The panel checks for a pause on load and every few
minutes (this check stays on even with update checks off), and the pause lifts on its own. If GitHub can't be
reached, the copier keeps working as it was.

**Notices:** a one-line message sometimes shows under the panel's header (planned Vest maintenance, a heads-up before
big news). Click × to dismiss it; it won't come back, but a new notice will.

**Sharing with a friend:** the userscript contains **no personal information** — no tokens, keys,
emails, or account ids. It's safe to send. It only ever uses the session of whoever installs it in
their own browser.

---

## 2. The panel at a glance

Since v0.42 the copier lives **inside Vest's page**, in two places:

- **The copier bar, in Vest's header** (the empty middle of the top bar): the STRATUH mark, **Copying live** (lime) or
  **Copying off**, your master and followers as number tiles (11 → 12 14 15 16), the last copy, **Today** (your P&L
  across your accounts since Vest's trading day began), your time to Vest, **Turn on / Turn off**, **Flatten all** and
  **Menu**. Click the state or the tiles to open **Accounts**. When the window gets narrower the bar drops the least
  important parts first (last copy, the word STRATUH, the tiles, Today and the time to Vest, Turn on / off); copying on
  or off, Flatten all and Menu always stay. With no room left in Vest's header, the bar's line moves to the top of the
  order panel.
- **The order panel, in Vest's order card** (the right-hand column, where Vest's own Market / Limit / Scale form is). A
  switch on top picks **Vest's form** or **STRATUH**; STRATUH is first, and the panel remembers your pick. With
  STRATUH picked, Vest's form is hidden under the panel (nothing of Vest's is removed: pick Vest's form to use it, for
  Scale orders, a size in USD or changing your leverage). The panel has three tabs, **Trade**, **Bracket** and
  **Size** (section 6).
- **Menu** (in the bar): **Accounts** (your master, followers and who's left out, with **Turn on copying** and
  **Flatten all** on top), **P&L and Share**, **Settings**, **Appearance**, **Help and rules**, **Report a problem**,
  **Reload accounts** and **Float the panel instead**. Each opens in the order panel; **‹ Trade** at its top left
  brings you back.
- **Accounts:** your **master** on top, then the **followers**, then any account that isn't copied under **Left out**,
  with the reason. One line each: the account's number in a square and its name (the one you gave it on Vest, else
  "Account 07"; the log and saved files say both, Account 07 ("Swing")) (an **Eval** or **Instant** tag when it isn't a
  funded account), the **room left** to its floor with a small meter, and a dot: lime in a trade while copying, grey
  flat, hollow not copied, red when Vest says it can't trade. Hover a row for its balance and floor (the **daily floor**
  on plans with a daily loss limit, when it's the higher one today). A follower with **less than 30% of its drawdown
  left** shows "Only $310 to its floor" in amber: it still copies, it's just a heads-up. **Edit** changes the master,
  followers and sizing (only while copying is off).
- **Footer:** the latest activity line. Click it to open the log (the last six lines; scroll for more), with
  **Download** (saves one file with the whole log and the diagnostics) and **Clear**. When the line is a problem, **Get
  help** sits next to it.
- **Bottom bar:** the AMPED code on the left (click to copy it); on the right a coloured dot with your **version** and,
  while copying, your **time to Vest** (e.g. `v0.42.0 · 64ms`): the copier makes a small read to Vest every 20 s, which
  also keeps its connection ready for your next copy. The dot: lime under 80 ms (good), grey 80-200 ms (OK), amber over
  200 ms (slow: followers' fills may land a tick or more from yours in fast markets), red when Vest isn't answering;
  grey with just the version when you're not copying. While Vest has updated its site, the bar shows that instead
  (amber while the check runs, red if it failed and copying is off). Click it for the **status card**: the time to Vest
  in big numbers with its level, the last 5 minutes as bars against the 80 and 200 ms lines and how steady it is,
  **Last copy** (how far your followers filled from you on the last copied trade, in points, and how long after),
  **Test connection** (about 10 quick checks, copying or not, then one plain verdict, kept until you close the card),
  **Run site check**, and Vest's build, your version, the API budget and Vest's slowest answer today. None of it
  promises a fill: it says what your connection means for copies.
- **Alerts** show above the footer only when they apply: followers left in a trade without the master (**Flatten** /
  **Keep it**), a new version, Vest's screen on another account while copying, the theme's first-time bar, and short
  messages.

**The floating panel.** Where Vest's order card isn't there (Vest's other pages, a window narrower than 768 px, or Vest
changing its page), the copier falls back to the floating panel of earlier versions, docked on Vest's chart, with the
same Trade, Bracket and Size tabs. **Menu › Float the panel instead** (or Settings › **In Vest's order card**, off)
keeps it floating; the floating panel's **⋯** menu has **Back in Vest's order card**. Floating, it's docked on Vest's
chart: drag the header to move it, the bottom-right corner to resize it, and **⋯ → Docked on chart** floats it
anywhere in the window. **Minimised,** it's a small pill: the logo, the state and one button (while copying the open P&L
and **Flatten**; when ready, **Start**; when something needs you, **Open**). A red edge means something needs you,
amber that Vest updated its site and the check is running, or Vest is slow. Position, size and open or minimised are
all remembered.

---

## 3. Core concepts (read once)

- **Master / followers.** You trade the master on Vest as normal. The copier watches *your own*
  order requests for the master account and fires the matching orders on each follower.
- **Flat, or already in the same trade.** Start when everyone is flat — or, if the master and followers
  already hold the **same trade** (same market, same direction), starting **adopts** it: closes, partial
  exits and stop moves on the master then copy to those positions. The copier never opens a trade for a
  follower that isn't already in it ("no back-fill"). It refuses if a follower is in the opposite
  direction, holds a trade the master doesn't, or any account, the master included, has a waiting order (a limit):
  cancel it first.
- **Leverage auto-sync.** When you start copying, every follower's leverage is set to match the master's
  (per symbol, except on a market where it's already in a trade). Change your leverage or switch symbols → **stop and start copying again** to re-sync.
- **It mirrors the full lifecycle:** open, add/scale, move stop-loss / take-profit, partial reduce,
  close, and cancel resting orders.
- **Stops and targets copy too:** set at entry, added later, moved, resized or removed, even within a second of
  adding one. Each follower's matching order is changed. If a follower's stops or targets ever stop matching yours,
  the log says so (**Bracket check**), naming the account and the price.
- **Only your orders are copied.** When Vest closes the master itself (a stop or target filling, a drawdown
  breach, a liquidation), nothing is copied. The log says what Vest did, and a follower still in the trade a few
  seconds later is offered as **Flatten / Keep** (or closed by itself with **Auto-flatten** on).
- **Live from Vest.** The panel listens to the live feed Vest's own page uses: balances, P&L and fills on every
  account update as they happen. An account that fails drops out at once: a follower is removed and the others keep
  copying; if the master fails, copying stops. New accounts appear by themselves.

---

## 4. Sizing: strict 1:1 vs Cap-to-fit

**Cap-to-fit (the default, in Edit or Settings).** Each follower is sized to **its own equity**, and you can mix
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

**Strict 1:1 (pick 1:1 under Sizing in Edit).** Every follower gets the master's exact size, whatever its equity.
Followers must be the **same size and type** as the master. Use it when you want identical contracts on every
account even after their balances drift apart.

---

## 5. Using it, step by step

1. Your accounts load by themselves (**Menu › Reload accounts** if not). The first time, Accounts opens on **Choose
   accounts**.
2. Pick your **master** (the round button) and tick each **follower** (the box), then **Done**.
   - Cap-to-fit (the default) sizes each follower to its own equity, so sizes can differ. In strict 1:1, followers
     must be the master's size and type.
   - To change them later, **Edit** in Accounts (only while not copying).
3. Set your leverage on Vest the way you'll trade for the session.
4. Click **Turn on** in the bar (or **Turn on copying** in Accounts). On first use, read the risk terms, tick the box and click **Accept and
   continue**.
   - It flat-checks everyone, syncs follower leverage to your master, and (with Cap-to-fit) refreshes equity for a fresh
     sizing baseline.
   - If an account can't be adopted (opposite direction, a trade the master doesn't hold, or a waiting order on any
     account, the master included), it doesn't start and names the account.
5. **Trade the master normally.** Watch the log: you'll see `MASTER opened …` then `↳ OPENED …` per follower, and a
   one-line fill summary (e.g. `Fills 9/9 confirmed · avg slip 0.20 pt · max 0.50 pt`). The line under the status sentence shows the
   last copy ("4 of 4 filled").
6. **Turn off** when you're done (always available, even mid-session). While copying, the master, followers and
   Cap-to-fit are locked: stop to change them. Copy from one Vest tab only; the copier warns when it's open in a second
   tab and won't start while another tab is copying. A page reload stops copying (the log says so): start again to keep
   copying.

---

## 6. The order panel: Trade, Bracket and Size

It trades your selected **master** in the **market Vest is showing**: switch Vest's chart to ES and the panel switches
to ES. Each market keeps its own size, stop and targets, since points mean different money on ES and NQ; the first
time you open a market, the log reminds you to check them. While copying, followers copy every order like any other
master order.

**On top of every tab:**

- **Your setup** (the bar with the market tag): what your next order is, in one line (`3 mic · SL 20 · TP 20/40/60 ·
  BE TP1`). Click it for your **saved setups** on this market: pick one and its size, stop, targets, split and
  breakeven are all set at once. **Save as…** (none saved yet) names a new one in the menu; once you change a saved
  setup a white dot shows by its name and **Save** keeps the change. **Rename or delete** is one level deeper; delete
  asks for a second click. Setups are kept in this browser.
- **The sync line:** what copying is doing, in one line. Plain while all is well (**Copies to 4 · in sync**, or in a
  trade **4 of 4 match**), amber when something differs (a follower's size or stop, a follower missing from the trade
  for more than a few seconds, a follower left in a trade without you), plain grey when copying is off. Click it for
  Accounts.

**Trade tab.** Top to bottom, in the order you use it:

- **Where you are:** flat, with the price and **Today**, and a dim preview of your bracket in dollars (stop and
  targets for the next order); in a trade, the side, size, entry and live P&L, with a bar drawn to scale with your
  stop, entry, the price now and your targets. The two take the same space, so nothing below moves when you get in.
- **Quantity buttons:** five sizes, then what they count (**mic**, **mini**, **ct** for contracts, **% max**, **$
  risk** or **Max**; click it to change). The values are yours to set on the **Size** tab. In a trade they're dimmed:
  they size your next entry.
- **BUY MKT / SELL MKT:** a market order with your stop and targets attached as native Vest legs (they work on Vest's
  side even if your tab closes); right after the fill, the stop and targets are re-placed exactly your points from your
  **fill** price. The line under each word says what it sends ("3 mic"). **In a trade, the same side adds and the
  other side reduces,** by the share picked under **Add or reduce** (below): "add 1 mic", "reduce 1 mic". It never
  reverses a position. If your position changes between pressing and letting go (a target fills, say), nothing is sent
  and the panel says so: click again.
- **Buy bid / Sell ask:** joins the book: a buy limit at the bid, or a sell limit at the ask, with your stop and targets
  (flat, and only while Vest's order book is coming through).
- **The crosshair** between them: **Buy limit**, **Sell limit**, **Buy stop** or **Sell stop**, then one click on Vest's
  chart places it at that price (details below), or type the price and press **Place**. **Esc** or **Cancel** stops,
  and so does leaving the Trade tab or switching to Vest's form: a click on the chart never places an order the panel
  isn't showing.
- **Flatten** closes your position on this market (and the followers', while copying). **Cancel all** cancels your
  waiting limits and stop entries on this market (and the followers' copies). **BE** moves your stop to breakeven
  (below). Each one is dim when it has nothing to act on.
- **Risk and room** (flat): what a stop-out at your stop costs, and the room left before your floor.
- **Add or reduce** (in a trade): pick **25**, **50** or **100**% of your position, or **MAX**, then **Add** or
  **Reduce** right under the chips, or use BUY / SELL above.
  - **Add** grows the position by that share (MAX = the largest add that fits Vest's buying power and keeps a
    stop-out above the floor). A chip that can't be added shows why ("over margin", "past floor"), and the line under
    the buttons shows the new size, average and stop-out cost.
  - **Reduce** takes that share off at market (100 = all of it, like Flatten; MAX is for adds only).
  - Both use Vest's own orders ("add to position" and "reduce"), and while copying, the copier does the same to each
    follower, by the same share of its own position.
- **Waiting and working** (under the buttons): your resting limits and stop entries on this market, each with an **×**,
  and the **Breakeven watch**.

**Bracket tab:** your stop and targets for the next order, one per row.

- **Stop loss:** its points from your entry and what it costs at your size; the switch takes the stop off (nothing
  sizes from it then, and a warning names the price where the account fails, since nothing closes the trade for you).
- **Take profit:** each target's points, with what it makes and its size; **×** removes one, **+ Add a target** (the
  last row, up to 5) adds one. **Split** (on the Take profit line, with two or more targets): **Even**, **More on
  TP1** (heaviest first, to bank early) or **More on the last** (to let it run), each showing the sizes it makes.
- **Move stop to breakeven:** **Off**, **After TP1** or **At + points** (then how far in profit), and **Stop goes to
  entry +** that many points (0 = exact breakeven).
- **The line at the bottom:** what a stop-out costs with fees, and the room left to your floor; amber when the stop
  would take the account past its floor before it fills.
- In a trade, the Bracket tab is for your next entry: move this trade's stop and targets on the chart, or add one with
  **+ Add stop** / **+ Add target** there.

**Size tab:** what the quantity buttons count (**Micros**, **Minis**, **% of max** or **Risk $** on NQ, ES and RTY;
**Contracts**, **% of max**, **Risk $** or **Max** elsewhere), each with what one is worth ("1 micro of NQ = $2 a
point"), their five values (click a number to change it; each kind keeps its own, **Defaults** puts them back), and
what you can open: Vest's leverage, the most you can open now and the margin in use. Leverage is Vest's own: change it
on Vest's form.

The details below still hold; where they mention the old controls, the Trade, Bracket and Size tabs above have them.

**More detail.**

- **Size:** *Qty*, *Risk $* (risk ÷ stop points → contracts; $1 per point per contract on Vest's perps), *%* or *Max*.
  Max is the most the account can open right now, worked out the way Vest's own ticket works out its 100% (free cash ×
  leverage, less room for the fee and the spread). Copying in strict 1:1, Max is the smallest of the master's and every
  follower's, since they all copy the same size. **%** is a share of Max: type 25 and the order is a quarter of what
  the account can open, no maths. Risk $ needs a stop, so it's refused while the stop is off.
- **Minis and micros (NQ, ES, RTY):** the quantity buttons can count **Micros** or **Minis**, like Vest's own order
  form (it starts on whatever you chose there). One NQ micro is 2 units ($2 a point) and a mini 20; an ES or RTY micro
  is 5 units and a mini 50. **% of max, Risk $ and Max count in contracts** (units), so a small account's share is
  never rounded down to nothing. Orders still go to Vest in units, so followers copy exactly as before. Each market
  remembers its choice.
- **Fail and pass prices** (the floating panel's ladder had them as rows): your targets (farthest first), the entry, the stop, and the **fail**
  price (where the account's equity reaches its floor: the drawdown floor, or the daily-loss floor when that's higher).
  On an evaluation there's a **pass** row too (where it reaches the target). It shows one side at a time, since a buy and a
  sell put the stop and targets on opposite sides and fail at different prices: point at **Buy** and it shows "If you
  buy", point at **Sell** and it shows "If you sell" (otherwise the side you last traded). The middle column holds
  each level's points (type them there), size and dollars. Fail and pass count the opening fee and the account's
  current equity, like Vest's own estimates.
- **No stop, or no targets:** the bracket is on by default, but both are optional. The **×** on the STOP row takes the
  stop off (it reads *None*; **+ stop** puts it back with the same points), and **×** on a target removes it, every one
  if you like. Without a stop, Auto BE is off and a warning names the price where the account fails, since nothing
  closes the trade for you. Followers copy the trade the same way.
- **Bracket on the chart** (on by default; Appearance turns it off): your entry, stop, targets and fail price are
  drawn on Vest's chart, while the Trade tab is open, as dashed lines for the side you point at, and follow the price and your points. Drag the stop
  or a target line to set its points. Placing a limit or stop entry, the bracket follows the pointer instead, so you
  see where everything lands before you click; while a limit or stop entry waits on that market, the market bracket
  isn't drawn (Appearance › **Hide it while a limit waits**, on by default). They're a preview: nothing is sent, and they go away
  once you're in the trade (Vest draws the real ones).
- **Targets:** the line under the ladder says how the size splits across them ("Split back-loaded · 2.5 / 5 / 7.5").
  **Change** picks **Start** (heaviest first), **Even** or **End** (heaviest last); **+ target** adds one, × removes
  one.
- **Allowed range** (shown when a limit bites, or nearly does): size = risk ÷ stop, the size can't go over what the account can open, and a stop-out can't
  take you past your floor. In *Risk $* mode the panel shows how much you can risk at your stop and in total ("Can
  risk up to $159 at 20 pts · $278 max before the floor") and the smallest stop for your risk ("Stop must be at least
  25 pts to risk $200"); in *Qty* mode, how many contracts fit and the widest stop before the account fails.
- **Auto BE:** the next line ("Breakeven after TP1"); **Change** picks *Off*, *After TP1* or *+pts*. It moves the stop to your entry once due; **lock** adds that many
  points of profit beyond the entry (0 = exact breakeven). It watches market and stop orders from the panel, so leave the Vest tab open; each watched trade shows under
  **Breakeven watch** below the buttons, and its × stops watching it.
  It survives a page reload and stops watching when the trade closes. It moves once the bid (for a long) or the ask (for a
  short) is 2 ticks clear of the new stop (4 ticks when Vest's order book isn't coming through), measures from your average entry as Vest has it, and leaves alone a stop you've already moved past breakeven.
  Each market keeps its own trigger and lock points.
- **Blocked orders:** a size the account can't open is never sent (Vest would accept it and not fill it). The buttons
  turn off with the reason and one-click fixes: **Set stop to …** (keeps your $ risk), **Risk $… instead** (keeps your
  stop) or **Use max**.
- **Warning** (amber, the order can still be sent): a stop-out would lose more, fees included, than the room left to
  the floor, so the account fails before the stop fills.

**Bottom: the buttons.**

- **BUY / SELL MKT** send a market order with the stop and targets attached as native Vest legs (they work
  on Vest's side even if your tab closes). Right after the fill, the stop and targets are re-placed exactly your points
  from your **fill** price.
- **Buy limit / Sell limit** (the crosshair): pick **Buy limit** or **Sell limit**, then **one click on Vest's chart places it**
  at that price (a click, not a drag; panning the chart never places anything). Or type the price and press
  **Place**. **Esc** or **Cancel** stops. Buy limits go under the market and sell limits over it; a click on the
  wrong side is refused and you can click again. The stop and targets go in with the order and Vest activates them
  when it fills. Limits open a new trade; Auto BE stays with market orders (use **BE** once a limit fills).
- **Buy stop / Sell stop** (the crosshair): Vest itself only has market and limit orders, so the copier keeps these. A
  buy stop sits over the market, a sell stop under it; pick the level the same way (one click on the chart, or type
  it). When the price (the middle of Vest's order book, as Vest's own stops use) reaches it, the copier sends a market
  order with your stop and targets, and while copying the followers copy it.
  - **Both sides at once:** one buy stop and one sell stop can wait together on a market; the first to trigger
    cancels the other (handy around news).
  - **Slip** (shown while you place a stop entry; optional, in points): instead of a market order, it sends a limit that fills at the level plus the
    slip or better, right away, or not at all. Blank: a market order, which always fills, wherever the price is. With a slip, the stop
    is measured from the level and the targets from the level plus the slip, so neither ends up closer than you set.
  - The size, stop and targets are the ones set when you placed it (a % size is worked out when it fires).
  - **It lives in this Vest tab.** It only fires while the tab is open; a reload or closing the tab cancels it (the log
    says so). If the price passes the level while the live price feed is down, it's cancelled rather than sent late.
    Flatten all, a pause and changing the master cancel it too. An update's reload waits until no stop order is
    waiting. It never adds to a position: if one is already open on that market when it fires,
    nothing is sent.
- **Waiting orders** (under the buttons): your resting limits on this market and your stop entries, each with an **×**.
  The × on a limit cancels it on Vest (and the followers' copies while copying). On the chart, a stop entry is a lime
  or red line you can drag to a new level, with its own ×, and its stop and targets hang off it as dashed lines: drag
  one to change that stop order's points (the whole bracket moves with the entry). A limit is Vest's own line, which
  you can drag or cancel the same way; until it fills, the copier draws its stop and targets as dashed lines marked
  "on fill" (Vest shows them only once the limit fills). Drag one and the copier cancels the limit and places it again
  at once with that stop or target moved (once part of the limit has filled, move its stop on the position instead;
  Vest can't change them on a waiting limit; its own drag of the limit does the
  same cancel and re-place). While copying, the followers' copies do the same. For that split second the limit is off
  the book.
- **Fits your screen:** in Vest's order card the panel takes the card's height and scrolls inside it; floating, it
  grows to the bottom of the chart (or the window).

**In a trade.** The top of the Trade tab shows the position (side, size, entry, live P&L and its bar), BUY / SELL
add and reduce, and **Add or reduce** opens under Flatten, Cancel all and BE.

- **+ Add stop** and **+ Add target** (on the Bracket tab in a trade): **+ Add stop** shows only when the trade has no
  stop, in amber. Click one, then click Vest's chart where it goes (a dashed line follows the pointer), or press
  **Enter** (or the button again) for your saved points from the average entry; **Esc** cancels. Up to 5 targets.
  Adding a target splits the position across all of them by the split you placed the trade with (Start, Even or End;
  Even for a trade placed on Vest's own form): the ones already there are resized first. Removing one doesn't resize
  the rest; add another to cover the whole position again. A stop
  goes under the price for a long and over it for a short, a target the other way; the wrong side is refused. Adding a
  stop works while the copier is paused; adding a target doesn't. While copying, the followers get the same, sized to
  their own positions.
- **Right-click on Vest's chart** in a trade does the same at the price you clicked: **Add stop loss @ price** on the
  stop side, **Add take profit @ price** on the other. With no trade on that market (or a stop already there for the
  stop side), the menu is Vest's usual one.
- **BE** moves the stop to your **average entry** (an average between ticks rounds toward profit to the nearest
  tick, so it never locks a loss). It's offered once price is clear of the entry, since Vest refuses a stop the price
  has already passed (Vest triggers stops on the mid; the panel checks the bid or ask, a little stricter, so Vest always
  accepts it); hover it for the reason when it's grey.
- **Flatten** closes the master's position; while copying, the copier closes the followers.
- **Scale in or out:** see **Add or reduce** above.
- **Your stop stays exactly where it is** when you add or reduce, including a stop you moved to breakeven. A stop
  covers the whole position, whatever its size.
- **Your targets keep their prices, and their sizes follow the position.** With two or more targets, once Vest confirms
  the add or reduce filled, each target gets its share of the new size by the split you placed the trade with (Start,
  Even or End), and the log says what they became ("targets re-split to 0.0086 / 0.0086 / 0.0085"). A target already
  hit is left out; one you moved keeps its price and takes the share of its place. A single target already closes the
  whole position, so it's left alone. If the fill can't be confirmed, or the size is too small to split (each target
  needs at least one size step and $1), the sizes stay as they were and the log says so. While copying, each follower
  does the same across its own position once its own add or reduce has filled; a target you placed on a follower
  yourself is never touched. Adds and reduces on Vest's own order form leave your targets as they are.
- To move a stop or target, drag it on Vest's chart.
- The panel doesn't reverse a position in one click: Flatten, then the other side.

## 7. Settings

**Menu › Settings.** Each setting shows one line under its name; the **?** next to it opens the full explanation.

- **Fast mode** (on by default) — copies each order the *instant* you send yours (entries, closes, reduces, adds,
  stops and targets), for the most simultaneous fills. Trade-off: followers act *before* Vest confirms your master
  order. If your master entry is then rejected, you'll be warned about "orphan" follower positions; if a close is
  rejected, the log says the master is still in. Limit orders and cancels are copied once Vest answers.
- **Auto-flatten orphans** (off by default) — if followers end up in a trade the master isn't in (its entry was refused
  or didn't fill, or Vest closed the master), closes them automatically instead of asking. It never acts when the master might be in
  the trade.
- **Cap-to-fit size** (on by default) — equity-scaled sizing and different-size followers (see §4). Also in **Edit**
  on the Copier tab.
- **In Vest's order card** (on by default) — the order panel takes Vest's order card (with the Vest's form | STRATUH
  switch) and the copier's line sits in Vest's header. Off: the floating panel, as before. A window narrower than
  768 px always floats.
- **Only on the Trade page** (on by default) — hides the panel on Vest's other pages (Portfolio, Markets,
  Affiliate…). It keeps running and copying there, and shows on any page when something needs you (followers waiting
  on Flatten / Keep, or the first-run risk terms).
- **Check for updates**, **Check now** and a GitHub link, and **Use code AMPED at checkout** (§12). **Theme, chart
  and text size** opens Appearance.

**Menu › Appearance** holds how things look:

- **Text size:** *Regular*, *Large* or *Larger*. The whole panel grows, so nothing gets cramped; it stays docked on
  the chart.
- **Bracket on the chart** (on by default) — the dashed preview of your entry, stop and targets (§6).
- **Hide it while a limit waits** (on by default) — while a limit or stop entry waits on the market, or while you're
  placing one, only that order's lines are drawn, not the market bracket.
- **Hide marks on bars** (on by default) — hides Vest's buy and sell marks on the chart each time it loads, the same
  as the chart's right-click **Hide marks on bars**, which Vest forgets on every refresh. Show them again from that
  menu whenever you want; the copier leaves them shown until the next load.
- **Hide session shading** (on by default) — hides the pre-market, after-hours and overnight bands Vest draws on
  the chart (the eye on its Market Sessions indicator). Switch it off and they show again at once. Vest's own
  Session shading setting still decides whether Vest draws them at all.
- **STRATUH theme** (on by default, dark mode only) — Vest's own page and chart in STRATUH's colours: onyx and
  lime, square corners, grey candles, and no Volume indicator added by Vest (one you add yourself stays). Vest's own
  order lines (limits, stops, targets) turn lime and red and run a short way in from the price scale instead of across
  the chart. The first time, a bar offers **Keep it** or **Back to Vest's colours**. Turning it off brings Vest's
  colours back at once, the chart's included. Vest saves the chart's colours to your account, so turn the theme off
  before removing the copier; otherwise use the chart's settings, **Apply defaults**.
- **Shorts and losses** — grey (STRATUH's look) or red, for Sell buttons, losing P&L and the bid
  side of the book. Candles stay grey either way.

Options are saved and persist across refreshes. Fast mode and Cap-to-fit show in the line under the status sentence
when they're on.

---

## 8. Safety tools

- **Flatten all** — closes **every** open position and cancels **every** order on **all** your loaded accounts, at
  once and with **no confirmation**: an emergency button, and a fast way out of a trade across many accounts. It's on
  every tab and on the minimised pill. **Copying keeps running**, so your next trade copies as usual (press **Stop
  copying** if you want to stop). Orders you place on the master while it's flattening aren't copied, because Flatten
  all closes them too. It acts on *all* loaded accounts, not just the selected group, so an unrelated manual trade would
  be closed too.
- **Turn off** (copying) — stops copying immediately. It does **not** close positions; use Flatten all for that.
- **Fill confirmation** — after each entry, the copier checks that every follower actually filled, from Vest's
  live feed (about a tenth of a second) or, if that's quiet, Vest's fill history. A follower that was accepted but
  didn't fill (usually too small for the trade) is flagged loudly and dropped from tracking, so later stops/closes
  don't target a trade that isn't there.
- **Screen check** — while copying, if Vest's own screen is on another of your accounts, the panel warns that orders
  placed there aren't copied (only the master's are).
- **Site check (after Vest updates)** — when Vest ships a site update, the panel shows the check, which runs by
  itself in a few seconds: read-only, nothing is sent to your accounts. Seven **required** checks read every Vest
  endpoint the copier relies on (accounts and balances, account access, leverage, positions and orders, fill history,
  market rules) and scan Vest's code for the order endpoints and fields the copier sends. Four **extras** check the
  live account feed, live prices, the chart tools and claims; a warning there never stops copying (the copier is a
  little slower or that one feature is off). When every required check passes the panel says **All clear** and comes
  back by itself. If one fails, **copying stays off**, with Trade-tab orders, automatic breakeven and claims, until a
  copier update fixes it: trade from Vest's own panel meanwhile (Flatten all always works), and send the **Diag** file.
  Run it yourself any time from the status dot in the bottom bar.
  With no active account yet, the check waits for one. A small test trade after a Vest update is still a good idea.
- **Live order check** — every master order is checked against the fields the copier needs. If Vest
  changed its order format, the log warns immediately (and says what's missing or new).

---

## 9. Reports: P&L, activity log, diagnostics

- **P&L** (tab) — a report of where things stand right now. On top, **Today**: your P&L since Vest's trading day
  began (20:00 ET, when its daily loss resets), from Vest's own equity record, so it's right even for hours the panel
  was closed, split into **Realized** (trades closed today, plus the day's fees and funding) and **open** when it can
  be. A payout starts an account fresh: once you claim profit, that account's Today counts from its starting balance
  (the claimed trade is still on **Share** and in your account history). Under it, the total **since start** (equity −
  starting capital) and **what you keep**. Each account shows today, then its equity and total since start. Live, like Vest's
  Account Value: open trades re-price with every price move (on the middle of Vest's order book, as Vest does), and
  balances update the moment anything fills, from Vest's live feed. Everything is also re-read in full once a minute
  (every 20 seconds if the live feed is down). A balance that can't be read shows "—". **What you keep** is each funded account's profit ×
  its own profit split, added up, as if you claimed it all now (Vest applies the split flat at each claim). Each
  account shows its share. Evaluations aren't counted (their profit doesn't pay out until you're funded), and an
  account in a loss counts as $0, since claims are per account. With trades open it reads "if closed now, after fees":
  Vest's closing fee comes off first; slippage on the close isn't counted. Vest may ask you to close positions before
  a claim.
- **Share** (top right of the P&L tab) — your P&L as a picture.
  - **Today:** the day's total, how many accounts, today's copies and how close the followers' fills were to the
    master's, the day's equity curve and your trades. **Trades on the card** picks how the trades show: **Day summary**
    (how many, won / lost, best and worst, and a position still open), **Latest trades** (the last three, oldest
    first, with "+2 earlier" for the rest), **Last trade + day** (the last trade and the day's count) or **None**
    (just the number and the curve). A trade's size is the master's and its P&L is added up across every account in
    it; a line above the trades says so, and a trade shows "on 3" when fewer accounts were in it.
  - **One trade:** a list of your profitable trades from the last 30 days, sorted **Latest** or **Most profitable**, read from Vest's position history on every
    account you have, finished ones included (a passed evaluation, a closed or failed funded account). The same trade
    copied across accounts shows once ("× 5"); pick one and the card shows the side, size and entry, the total "on 5
    accounts", each exit (TP1, TP2, stop or breakeven) with its price and points, and the trade's timeline.
  - **Payouts:** everything Vest has paid into your Primary Account from your funded and instant accounts, closed
    ones included: the total, how many payouts from how many accounts, your last 8 weeks as bars (Monday to Sunday,
    your best week in lime) and your biggest payout. Amounts are what you received after Vest's split; a payout still
    processing shows apart and isn't added in, and refunded ones are left out. Until your first payout is paid the tab
    says so. **Copy image** puts it on
  the clipboard to paste into X, Discord or a group chat; **Save PNG** saves it. **Hide amounts** shows the % change instead of
  dollars, with the master's points on each trade (Day summary then shows only how many trades and won / lost; not on
  Payouts); **Name on the card** is optional; **Add code AMPED** puts the code on it. No card shows account numbers,
  balances, account ids or logins. If the browser blocks the clipboard, the picture is saved to Downloads instead.
- **Claim all profit** (bottom of the P&L tab; stop copying first) — claims every funded account's available profit to your Primary
  Account, the same claim as the Claim Profit window Vest itself offers, for the full amount. First a **preview**: what each account
  claims and what you receive after its split, or the reason it can't claim (an open position or order, no profit, an
  evaluation). Nothing is sent until you click **Claim … → you get …**. Accounts are then claimed one at a time, a
  second apart, each re-checked just before its claim; **Stop after this account** ends the run early. Each result is
  in the activity log. Claims arrive within 24 hours and **can't be reversed**. Withdrawing from your Primary Account to
  a wallet stays a manual step on Vest.
- **Activity log** — the clean, trader-facing feed.
- **Download** (in the log) saves one file: the activity log together with a detailed **diagnostics** record: for every event it records intended vs actual
  size, the cap-to-fit math (equities, scaled size), fill prices, slippage, **margin used vs the
  account's cap**, latency, and any error codes. It's silent (no log clutter) and **token-scrubbed**
  (safe to share). If something looks wrong, hit **Download** and send the file.

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
- **Stop copying if you'll place a manual trade** you don't want copied.
- **Stop and start copying again after changing leverage or symbol** so followers re-sync.
- **Keep accounts flat between sessions**, and stop copying when you're not actively trading.
- **After a Vest site update** (amber status), do a tiny test before trading heavily.
- Keep sizes small enough that a **simultaneous loss across every account** is survivable.

---

## 12. The AMPED code

The copier is free, and it works the same with or without my code. **AMPED** gives you at least 5% off Vest purchases and pays
me a commission. The panel asks before using it, and asks again after updates (at most once a week, and never while
you're copying or in a position).

- **Yes:** the copier puts AMPED in Vest's code box each time you open a purchase window. If another code is on, AMPED
  replaces it. At your next checkout you confirm it once: **Keep AMPED**, or use your code that time. After that, a
  short note fades by itself, and you're only asked again after an update.
- **To use another code:** type it or pick it. It stays for that purchase window, and clicking in an empty box first
  leaves it to you. The next time you open a purchase window, AMPED goes back in.
- **An account with no code yet:** Yes also links it to AMPED permanently. Vest doesn't let that link change.
- **No:** the copier leaves Vest's code box alone and links nothing.

**Settings → Support the copier** turns it on or off any time and has a **Copy code AMPED** button; **Help** has the code
too. Turned off, or with the copier removed, Vest goes back to your account's own code the next time it loads, unless your
account was linked to AMPED. Past purchases don't change.

## 13. Troubleshooting

Questions or setup help: ask in the [Discord](https://discord.gg/Aa69y9KnM3).

- **Panel didn't appear** — confirm the script is enabled in Tampermonkey and you're on
  `next.vestmarkets.com`; refresh.
- **"Couldn't capture your Vest session"** — make sure you're logged in to Vest. The copier keeps trying by itself and
  loads your accounts once it sees your session; **Menu › Reload accounts** tries right away.
- **"Your PC clock is 5 hours fast" (or slow) in the log** — your PC's clock or time zone is set wrong. Copying still
  works: the copier goes by Vest's time. Today's P&L, the Share cards and the times in the log follow your PC, so set
  it right: in Windows, Settings → Time & language → Date & time, pick your time zone and turn on Set time
  automatically. No reload needed.
- **Breakeven stays grey** — price isn't clear of your entry yet (the bid, for a long, or the ask, for a short, 2 ticks
  past it; 4 ticks when Vest's order book isn't coming through), the stop is already at or past breakeven, or the
  position has no stop. Hover the button for which.
- **Can't tick a follower** — it's a different size/type than the master. Pick **Cap-to-fit** under Sizing in Edit,
  or pick matching accounts.
- **Turn on doesn't start copying** — the log says why: a follower in the opposite direction, a follower in a trade the
  master isn't, or a waiting order on any account. Fix that account on Vest, then start. (Same trade on master and followers is fine
  — it's adopted.)
- **An order didn't fill** — the log says which account (master included). Vest accepted it but didn't execute
  it, usually because there wasn't enough margin for that size. A follower that misses an entry is dropped from
  tracking; one that misses an add keeps its original position.
- **Something looks wrong** — **Menu › Report a problem** (or **Get help** next to a problem). Describe what happened and
  click **Save report & open issue**: it saves one report file (activity log, diagnostics, settings, balances;
  account ids replaced by names) and opens a GitHub issue with your description filled in. Drag the file in and
  submit (a free GitHub account is needed).
