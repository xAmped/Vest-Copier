# STRATUH Copier (formerly Vest Copier) — What's New

Newest first. To update, click **Install** on the update row that appears in the panel whenever there's a newer version.

## v0.41.3
Minor improvements.

- You'll be asked to read and accept the updated terms once.

## v0.41.2
Your targets follow your position when you add or reduce.

- **Adding or reducing re-splits your targets.** With two or more targets, an add from the Trade tab left them at the sizes they had at entry, so part of the bigger position had no target: after an add from 0.0085 to 0.0257 NQ, three targets of 0.0029 / 0.0028 / 0.0028 covered a third of it. Now, once Vest confirms the add or reduce filled, each target keeps its price and gets its share of the new size, by the split you placed the trade with (Start, Even or End). A target already hit is left out, and one you moved keeps its new price. Your stop doesn't change.
- **Followers too:** each follower re-splits its own targets across its own position once its own add or reduce has filled. A target you placed on a follower yourself is never touched.
- **+ Add target follows the trade's split** (it always split evenly before).
- A single target already closes your whole position, so it's left alone. Adds and reduces made on Vest's own order form are copied as before and leave your targets as they are.
- **Session shading comes back when you turn Hide session shading off,** right away. The copier now hides Vest's pre-market and overnight bands instead of removing them.
- **Buy/Long is easy to read with the STRATUH theme:** dark text on the lime button, on Vest's order form and its confirmation.
- **Clearer reasons in the Trade tab and P&L:** an add that's too big now says "a stop-out would end below the $4,800 floor" instead of "past floor", and the note saying to stop copying before claiming profit shows in amber while copying is on.
- **Turning the STRATUH theme off now brings back Vest's own chart background.** Vest now saves your chart's colours to your account, so the copier's colours could stay after turning the theme off. If your chart still has STRATUH colours after removing the copier, open the chart's settings and use Apply defaults.

## v0.41.1
Your followers' stops and targets stay in step with yours, and the names you give your accounts on Vest show in the panel.

- **A stop or target you remove or move right after adding it now copies too.** This worked normally at an everyday pace, but a quick change could be missed: removed within about a second of adding it, or within two or three seconds for traders far from Vest's servers (around 250 ms away, where each follower's order takes up to 2 s to land). Your followers could keep theirs, and it could close them early while you stayed in the trade. In our tests, a stop or target removed 0.3 s after adding it, and one removed 2 s after adding it with followers 1.8 s away, now goes on every follower too; in a live test, five removals 0.6-0.9 s after adding all copied. Only a stop or target the copier put on a follower is touched, never one you placed on a follower yourself.
- **A bracket check.** If a follower's stops or targets ever stop matching yours (an extra target, or a missing stop), the log names the account and the price so you can fix it on Vest.
- **Account names.** Name an account on Vest and the panel shows that name, with the account's number in the square beside it. The log, the Download file and Report a problem say both, for example Account 07 ("Swing"), so a report shows which account you mean.

## v0.41.0
Followers copy you at the same moment, not after Vest answers, and the panel shows your connection to Vest.

- **Fast mode copies everything at market now, not just entries.** Closes, partial closes, adds, and stop and target moves go to your followers the instant you send yours, instead of after Vest confirms your order. In our tests followers' closes filled about 25 ms after the master's, where they used to wait about 150 ms for Vest's answer first, and longer the further you are from Vest's servers. Limit orders, cancels, removing a stop or target, and orders that turn a trade around still wait for Vest's answer, so nothing risky goes out before your own order is confirmed.
- **Close, Reduce and Flatten all get you out straight away.** They no longer check with Vest first when the copier already knows your position, and Close is never greyed out while your stop and targets are being set after an entry. Flatten all closes everything it knows about at once, on every account together.
- **Your connection to Vest, in the panel.** The bottom bar shows how long Vest takes to answer (for example 64 ms), coloured by how good it is. Click it for the last 5 minutes as bars, how steady it is, how close your last copy filled to the master, and a **Test connection** button that checks it in a few seconds, copying or not. Minimised, the panel turns amber with the time when Vest is slow, and red with "No answer" when it stops answering.
- **A size check.** If a follower's size ever stops matching its share of the master's, the log names it so you can fix it on Vest.
- **If Vest refuses your order after your followers already copied it,** the copier says exactly what that left, and takes back an add your master didn't get.
- **Several Vest tabs:** the Download now includes what every tab recorded, so a report from any tab has the full story.
- **The first trade after Start copying** no longer waits on a leverage change when your followers' leverage already matches.
- **Fixes:** the panel could keep crashing after a Vest update when the browser's storage was full; a new tab could wrongly say "the page reloaded while copying".

## v0.40.4
Share has a new card: your payouts.

- **Payouts:** a third tab in Share. It adds up everything Vest has paid into your Primary Account from your funded and instant accounts, closed ones included: the total, how many payouts from how many accounts, your last 8 weeks as bars with your best week in lime, and your biggest payout. Amounts are what you received after Vest's split. A payout still processing shows apart and isn't added in; refunded ones are left out.
- **No account numbers on any card.** The Hide account numbers switch is gone: the cards never show them now.

## v0.40.3
Share's Today card shows your whole day, losses included.

- **Trades on the card:** a new choice in Share for how the Today card shows your trades. **Day summary** (the default) shows how many trades, won and lost, your best and worst, and a position still open. **Latest trades** shows the last three in order, **Last trade + day** the last trade and the day's count, and **None** just the number and the curve. Before, a day with more than three trades showed only the three best, so a red day could look green.
- **Clearer trade sizes:** a line above the trades says the size is the master's and the P&L is added up across your accounts. A trade shows "on 3" when fewer accounts were in it.
- **Hide amounts** shows the master's points on each trade. Day summary then shows only how many trades and won / lost.
- **Points read right** when Vest's trade history carries a wrong entry price (it could show tens of thousands of points).

## v0.40.2
Copying keeps up with Vest's newer order options, and % sizing follows a leverage change at once.

- **% and Max sizes follow a leverage change right away.** Changing leverage on Vest's ticket and trading within seconds could size the order for the previous leverage (8x went out at the 15x size). Buy and Sell now update the moment you change it, and the size is checked again when you click.
- **Limit Close is copied as a limit close.** Followers get the same limit close at the same price, instead of closing at market straight away. Cancel yours and theirs are cancelled; when it fills, the log says "Limit close filled".
- **Closing part of a trade with a limit** is copied too: the same price, sized to each follower.
- **Scale orders:** cancelling them, or closing the trade while some still wait, cancels every follower order of the Scale, not only the first.
- **One order that turns a trade around** (selling 2 while long 1, with Reduce Only off): followers turn around with you instead of only closing.
- **Fill or Kill** orders have the followers' fills checked, like IOC.
- **Lines switch** now shows with Limit and Stop too, so the bracket can be turned back on from any order type.
- **The Download file names your accounts** ("Account 64") instead of using their ids.
- **Clearer log:** one line when an order that fills now or not at all fills nothing anywhere, no more "−$0.00", and moving a waiting limit while trading is paused says the followers' copies are gone.
- Minor improvements.

## v0.40.1
- **Placing a stop or target by clicking the chart** no longer floods the browser console with chart errors when the mouse stays still after the click. The guide line that follows the pointer no longer gets in the way of the click. The same goes for a limit placed with one click.

## v0.40.0
Put a stop or a target on an open trade, from the panel or the chart's right-click menu.

- **+ Add stop** and **+ Add target** above Breakeven and Close. **+ Add stop** shows (in amber) when the trade has no stop. Click one, then click the chart where it goes, or press Enter for your saved points; Esc cancels.
- **Right-click the chart** in a trade: **Add stop loss @ price** or **Add take profit @ price**, placed at the price you clicked.
- **Targets split evenly:** adding one resizes the others first (two targets are halves, three are thirds). Up to five.
- Followers get the same stop or targets while copying, sized to their own positions.
- The log says **resized** when a target's size changes and its price doesn't.

## v0.39.3
A one-click switch for the chart bracket, notices, and a cleaner Flatten all.

- **Lines switch** at the end of the Order row (shown with Market): one click hides or shows your bracket on Vest's chart. It's the same setting as Appearance → Bracket on the chart.
- **Notices:** a short note can show under the panel's header (Vest maintenance, a heads-up before news). × dismisses it.
- **Flatten all with a waiting limit** no longer tries to close the limit's empty position after cancelling it (Vest refused that, and the log said "closed").
- **A stop order with a max slip that fills nothing** while copying: the log says it once, without the misleading "not enough margin" and per-follower lines.
- **Site check** names the market on Vest's screen for Live prices, not the Trade tab's last market.

## v0.39.2
Partial targets close their share again, plus safety fixes for limits and stop orders.

- **Partial targets work again.** With two or more targets on a market or stop order, the first target closed the whole trade instead of its share. When the copier moved the targets to exact points from the fill, the move dropped each target's size and Vest made it a full exit, on followers too. Each target now keeps its size.
- **A master limit that Vest refuses, cancels or expires elsewhere** (Vest's app, another tab) now cancels the followers' copies too, instead of leaving them waiting on their own. A copy that already filled shows up in the orphan prompt.
- **Moving a limit twice quickly** cancels every follower's old copy before the new one goes out, including a copy that was still on its way.
- **Stop orders with a max slip:** the stop is measured from the level and the targets from the level plus the slip, so neither ends up closer than you set. The fill check also waits for Vest's answer before saying nothing filled.
- **Minimising the panel** ends a Limit or Stop pick, so a later click on the chart can't place an order.
- **Dragging a waiting limit's stop or target** follows the same rules as every other order (terms, Flatten all, the site check), keeps a sized target's size, and is refused once part of the limit has filled.
- **Flatten all** stops a stop order that is firing at that moment.
- **Stop order size** uses the minis / micros pick it was set with and follows a stop you drag in Risk $ mode.
- **Switching size modes keeps your size:** picking Stop starts % at the size you had, and removing the stop in Risk $ keeps the same quantity.
- **Today after a payout** counts from the time the payout was requested, and the Share card leaves out trades from before it.
- **Pause notice.** If a problem turns up, I can pause new trades from GitHub while a fix ships. The panel shows **Paused** with a short note (often: install the newest version). Trades already open keep copying their exits, and Flatten all always works. If GitHub can't be reached, nothing changes.

## v0.39.1
Moving limits is reliable on every account, and waiting orders show their whole bracket on the chart.

- **Moving a limit while copying:** when a limit was moved quickly (dragging it on Vest's chart), a follower's new copy could reach Vest before its old one had cleared, and Vest refused it ("This position already exists"), leaving that follower without a limit and nothing in the log. Each follower's copy now waits until its old one has cleared, a refused copy is tried once more, and one that still fails is named in the log.
- **Stop orders show their stop and targets** as dashed lines hanging off the order. Drag one to change that stop order's points; drag the order and its bracket moves with it.
- **Limits show their stop and targets before they fill** (Vest only draws them once a limit fills), marked "on fill". Drag one and the limit is cancelled and placed again straight away with it moved, followers included, the same way Vest moves a limit you drag.

## v0.39.0
Stop entries, your bracket on the chart before you click, and a bigger, adjustable panel.

- **Stop orders (buy stop / sell stop).** Vest only has market and limit entries, so the copier keeps these itself: a buy stop over the market, a sell stop under it. Once the level trades, it sends the order with your stop and targets, and followers copy it while copying is on.
  - Set a buy stop and a sell stop together and the first to trigger cancels the other.
  - Optional **max slip** in points: it fills at your level plus the slip or better, or not at all. Blank sends a market order.
  - They live in the Vest tab: they only fire while it's open, and a reload or closing the tab cancels them (the log says so).
- **One click to place.** With Limit or Stop picked, click Buy or Sell, then click Vest's chart: it's placed. Cancel it from its line on the chart or from the new **Waiting orders** list under the buttons.
- **Your bracket on the chart.** Entry, stop, targets and fail price are drawn on Vest's chart as you set them, for the side you point at. Drag the stop or a target to change its points. In Limit or Stop mode the bracket follows the pointer until you click.
- **Lines that stay out of the way.** The copier's lines run a short way in from the price scale instead of across the chart. With the STRATUH theme on, Vest's own limit, stop and target lines do the same, in lime and red.
- **Trade without a stop or targets** if you want to: the × on the stop row or a target removes it. The bracket is still on by default.
- **Size in %.** Type 25 and the order is a quarter of what the account can open. Picking Stop switches to it.
- **Bigger stop and target numbers** on the Trade tab, and a **Text size** setting (Regular, Large, Larger) that grows the whole panel.
- **Appearance** in the ⋯ menu: text size, the chart bracket, chart marks, session shading and the STRATUH theme, all in one place.
- **New installs start with Fast mode and Cap-to-fit on** (your saved settings stay as they are).
- **Faster stop orders:** the order goes out the moment the level trades. Orders from the Trade tab send a little quicker too.
- **One Download button** in the activity log saves the log and the diagnostics in a single file, ready to send when something looks off.
- **Clearer P&L:** "Closed" is now **Realized** (trades closed today plus fees and funding). After a payout, an account's Today starts fresh from its starting balance instead of counting the claim as a loss. "You keep" takes off Vest's closing fee when trades are open.
- Minor improvements.

## v0.38.0
A new, calmer layout, the new STRATUH logo, a Today P&L you can share, and minis and micros. Copying works exactly as before.

- **One sentence on top:** "Copying Account 11 to 4 followers", with what last happened under it. **Start copying** and **Stop copying** replace Arm and Disarm, Stop is no longer a big red button, and **Flatten all** stays one click on every view. Start works from any tab.
- **Three tabs: Copier, Trade and P&L.** Settings, Help and Report a problem are in the **⋯** menu, along with Docked on chart / Float anywhere and Reload accounts. The Rules and Support tabs are now Help.
- **Copier tab:** one line per account: room to the floor with a small meter, and a dot (in a trade, flat, not copied). Accounts that aren't copied sit under **Left out** with the reason. A follower with less than 30% of its drawdown left is flagged in amber; it still copies. Change the master, followers and sizing (1:1 or Cap-to-fit) in **Edit**, while not copying.
- **Trade tab:**
  - **Market / Limit** switch above one **Buy** and one **Sell** (Limit still picks the price on the chart).
  - The ladder shows **one side at a time**: point at Buy or Sell and it shows that side's prices and fail price.
  - The target split and auto breakeven fold to one line each.
  - In a trade, the position card draws your **stop, entry, price and targets on one bar**. Add or reduce folds away until you need it.
- **Minis and micros** for NQ, ES and RTY: size in units, micros or minis (it follows your choice on Vest's own order form). Sizes stay whole micros or minis; one NQ micro is 2 units, an ES or RTY micro is 5. Copying is unchanged: followers get the same units.
- **P&L shows Today** (since Vest's trading day began at 20:00 ET, from Vest's own figures, even for hours the panel was closed), then each account's equity and total since start.
- **Share:** turn your P&L into a picture and paste it into X, Discord or a group chat (or save it).
  - **Today:** the day's total, its equity curve and your trades as chips (all of them if you made three or fewer, otherwise your three best).
  - **One trade:** pick any profitable trade from the last 30 days, on any of your accounts, including ones that are finished. A trade copied across accounts shows once, "on 5 accounts", with each exit (TP1, TP2, stop, breakeven) and its timeline.
  - Hide the amounts (% or points instead), hide the account numbers, and add your name if you like. Never balances or logins.
- **The footer** is the latest activity line (click it for the log); when something goes wrong, a **Get help** link takes you straight to Report a problem. Under it the bottom bar shows your version and the API budget, with a dot you click for Vest's build and the site check.
- **Minimised,** the pill shows the state, the open P&L and one button: Flatten while copying, Start when ready, Open when something needs you.
- **Settings** show one line each; the **?** opens the full explanation.
- **Update row** shows only when there's a new version.
- **Breakeven wording** follows Vest's new rule (stops now trigger on the mid price).
- Minor improvements.

## v0.37.0
When Vest updates its site, the copier now checks itself. No more finding the site check and pressing Accept.

- **The check runs by itself.** The panel shows only the check while it runs (about five seconds, read-only), ticking off each check as it goes. When everything the copier needs still matches Vest, it says "All clear" and goes back to normal: nothing to click.
- **If something no longer matches, copying stays off** until a copier update fixes it. The panel says what changed, with the Diag file and Discord one click away; trade from Vest's own panel meanwhile. Flatten All always works.
- **More is checked:** Vest's market rules (tick, size step, margin), its stop-loss and take-profit orders and the fields adds and reduces send. The live account feed, prices, chart tools and claims are checked too, as extras: a problem there shows a warning but never stops copying.
- **No accounts yet?** The check waits until Vest lists one instead of passing on an empty check.
- **A tidier panel when it's small:** the open activity log shows five lines (scroll it, or save it all with CSV or Diag) and gives up its space before your accounts do. Making the panel short or narrow no longer cuts off the bottom bar, overlaps the account balances, or hides the last tab.

## v0.36.0
Scale in and out of a trade from the Trade tab.

- **Scale:** in a trade, pick 25, 50 or 100% of your position (or MAX, the most you can add), then **Add** or **Reduce**, right under the chips. Reduce takes that share off at market (100 = all of it); armed, every follower adds or reduces by the same share of its own position.
- **Your stop and targets stay where they are** when you add or reduce, a stop at breakeven included. Move them yourself on the chart. (Adds no longer rebuild the stop and targets from the new average.)
- **The setup for a new trade is put away while you're in one,** and the separate Add button at the bottom is gone.
- **Fixed:** an add to a small position could be blocked by the new-trade setup's target split ("too small to split into 3 targets").

## v0.35.2
- **Small windows:** when Vest's chart gets too small to hold the panel (Vest stacks its layout in a small window), the panel floats on its own, at your floating spot or the top left of the window, at full height. When the chart is big enough again it docks back by itself. The pin shows amber while it's floating this way.

## v0.35.1
- **The panel shows on Vest's Trade page only** (Settings → Chart, on by default). On Portfolio, Markets, Affiliate and Vest's other pages it's hidden but keeps running: copying, the live feed and breakeven carry on. It still appears on any page when something needs you, such as followers waiting on Flatten / Keep.

## v0.35.0
Vest in STRATUH colours, and a cleaner chart.

- **STRATUH theme for Vest (on by default, dark mode):** Vest's own page and chart in STRATUH's colours: onyx and lime, square corners, and grey candles like STRATUH's DeepCharts theme. Shorts and losses are grey, or red if you prefer (Settings → Chart). The first time you see it, a bar lets you keep it or go back to Vest's colours.
- **A cleaner chart:** Vest's pre-market, after-hours and overnight bands are removed (Hide session shading, on by default), and so is the Volume indicator Vest adds by itself when the theme is on. A Volume indicator you add yourself stays.
- **The panel no longer covers Vest's menus:** the market selector, Add Account, Vest's settings and every other Vest menu or dialog now open above it. The chart's own menus (timeframe, chart settings, indicators) are drawn inside the chart, so the panel steps out of the way while one of them is open over it.

## v0.34.0
Live from Vest: the panel now listens to the same live feed Vest's own page uses, so balances, P&L, fills and failed accounts update as they happen instead of every 20 seconds.

- **Live accounts:**
  - **Balances, room to the floor and P&L update the moment anything fills,** on every account, not just the one Vest is showing.
  - **An account that fails drops out at once** (no more clicking reload): a follower is removed and the copier keeps copying to the others; if the master fails, the copier disarms. The log gives Vest's reason ("equity $489.29 reached its drawdown floor of $490.00").
  - **New accounts appear by themselves,** and the "can trade" dot stays current.
  - **Fills are confirmed in about a tenth of a second** instead of one to three, and an order Vest refused after accepting it is reported straight away.
- **When Vest closes a trade itself:**
  - **The log says what happened:** "Stop filled (NQ): Account 07 −$20.50, Account 08 −$20.50", a target filling, or a breach.
  - **A follower still in a trade the master is out of** (Vest stopped the master but not the follower) is offered as Flatten / Keep after a few seconds, or closed by itself with Auto-flatten on.
  - **A follower stopped out on its own** leaves the trade, so the master's later close isn't sent to it.
- **Prices:**
  - **The price is Vest's own reference:** the middle of the order book's best bid and ask (what Vest measures P&L, fail prices and targets on), then the last trade, then the mark. Hover the price on the Trade tab to see all three. The ladder's live row is now called **Price**.
  - **Breakeven checks the real bid (or ask)**, which is what Vest triggers stops on, so it turns on as soon as it safely can.
  - **The Trade tab redraws smoothly** with fast prices.
- **The panel lives on the chart:**
  - **Docked on Vest's chart by default,** on the left just right of the drawing tools, and kept inside the chart whatever you resize (the window, Vest's order book or its positions list). No more moving it back after a layout change. Its spot is remembered relative to the chart.
  - **Hide marks on bars (Settings, on by default):** Vest's buy and sell marks on the chart are hidden each time it loads, the same as the chart's right-click option, which Vest forgets on every refresh. Show them again from that menu any time.
  - **The pin** in the header floats it anywhere in the window instead; click again to dock it back.
  - **Minimised, it's a small pill** with the logo and the state: click to open, press and move to drag. A red dot means something needs you (followers waiting on Flatten / Keep, or the live feed lost while armed); amber means Vest updated its site.
- **Fixes and polish:**
  - **Balances are read the way Vest's own page reads them.** Accounts with a long history of failed accounts could have a live account's balance go missing ("couldn't read its balance", P&L stuck at the starting balance).
  - **A balance that can't be read shows "—"**, never the starting balance as a believable $0.00.
  - **Adding to a trade keeps your own changes:** a stop or target you moved (to breakeven, closer or further away) stays where you put it; only the levels the panel placed are rebuilt from the new average.
  - **In a trade, the add warnings sit on one fixed line** under the add buttons, so the Add button no longer jumps up and down as your P&L swings.
  - **Armed, with Vest's screen on another account:** the panel warns that orders placed there aren't copied.
  - **Claim all profit goes one account a second** (was two).
  - **Fewer requests to Vest:** with the live feed up, the full re-read runs once a minute as a backstop.

## v0.33.0
A safety release: a full review of the copier, with every fix covered by a new test.

- **Copying:**
  - **Cancelling a resting limit add** on the master now cancels each follower's add too, and takes that size back off.
  - **Closing a limit entry that hadn't filled** cancels the followers' orders before closing them.
  - **A follower left in a trade the master never entered** (an entry that didn't fill on the master but did on a follower) is now found and offered as Flatten / Keep, instead of being dropped.
  - **Disarming while copies are in flight** offers any copy that opened anyway as Flatten / Keep.
  - **A retried close or reduce** reuses the same order key, so a slow reply from Vest can't make it run twice.
  - **A master reduce sent as a limit order** isn't copied (followers would exit at market straight away); the log tells you to reduce them when it fills.
  - **Cap-to-fit skips a follower whose balance couldn't be read** instead of sending it the master's full size.
  - **A login Vest expired early** is renewed and the order retried once. Slow reads time out instead of stalling the balances.
  - **Fills on a busy account are never reported as "did NOT fill"** just because they weren't on the first page of history.
- **Breakeven and adds:**
  - **Auto BE waits until price is clear of the new stop by 4 ticks,** like the Breakeven button, so Vest no longer refuses the move.
  - **Auto BE checks the live position first:** it measures from your average entry as Vest has it (never locking in a loss) and leaves alone a stop you've already moved past breakeven.
  - **An add never puts your stop or a target past the price.** A chip that would is greyed out ("stop past price"); a target that would fill at once keeps its old level.
  - **A negative "lock" counts as 0,** and a stop or target that would land at or below zero is refused.
- **Trade tab:**
  - **A typed limit price between ticks rounds to a tick:** buys round down, sells up.
  - **If your position opened, closed or changed size** since the tab last updated, Buy / Sell asks you to check it and click again, instead of turning a new trade into an add.
  - **Each market remembers its own Auto BE points,** along with its size, stop and targets.
  - **The account the order goes to** shows by the buttons, and whether it's copied.
  - **Arming, orders and claims don't overlap:** each waits for the others to finish.
- **Safety rails:**
  - **While armed, M, FLW and Cap-to-fit are locked** (changing them used to disarm silently). Disarm to change them.
  - **Two Vest tabs:** the copier warns when it's open in another tab, and won't arm while another tab is armed (two would copy every trade twice).
  - **Reloading the page while armed** says the copier is disarmed now.
  - **A collapsed panel opens itself** when followers are left without the master, so you see Flatten / Keep.
  - **Disarming with followers still left open** says so in the log.
  - **Updates reload Vest only once nothing is in flight.**
- **P&L and data:**
  - **Claim all profit is off while armed.**
  - **A claim preview no longer lingers:** it clears when you arm, when the accounts reload, and after two minutes, so it never lists accounts that have since closed or balances that have moved.
  - **An account whose balance couldn't be read shows "—"** on the P&L tab instead of a loss of its whole starting balance, and stays out of the totals.
  - **Saved settings, plans and the log are checked when loaded,** so a damaged value falls back to the default instead of breaking the panel.
  - **Live P&L stops re-pricing data that's over a minute old,** and a stop the price sits past no longer triggers a burst of balance reads.

## v0.32.2
- **Fix: the P&L tab kept your master's open profit frozen** after you'd opened the Trade tab, until the next balance read. It moves with every price tick again, like the followers.

## v0.32.1
- **A tidier Trade tab.** In a trade, your position is the screen: P&L, where your stop and targets actually sit, the risk left before your floor, then Breakeven, Close and Add. The order setup folds into one line ("Setup · stop 20 · TP 20/40/60 …"); open it to change how an add rebuilds.
- **Flat, the setup is shorter:** the margin and risk bars share one line, the size result sits beside the size box, risk and R:R sit in the ladder's header, and the allowed-range notes only appear when a limit actually bites. The longer explanations moved into tooltips.
- **Accounts:** balance and floor on one line, in whole dollars from $1,000 up.
- **Clearer warnings in a trade:** they're about the next add, not your open position, so they now say so in one short line ("Add 0.5: more than Account 53 can open"), without the setup's fix buttons.

## v0.32.0
- **New look: STRATUH Copier.** The copier joins STRATUH, the trading tools by xAmped, and the panel takes its style: square corners, hairline dividers, lime for what's live (the master, ARMED, profit, Buy) and red only for what closes trades. It's the same script and install link, and your settings carry over.
- **Accounts:** your master sits on top in its own block, with the followers listed under it and how many are copying.
- **Activity folds to one line** showing the latest event. Click it to open the full log (Diag, CSV and Clear are there); the panel remembers. Prompts that need you, like Flatten / Keep for followers left without the master, always show above it.
- **Bottom bar:** Vest's build, your version and the API budget sit at the bottom right (click to run the site check). Report a problem is in the Support tab.
- **Trade tab, rebuilt to read top to bottom.** Stop, entry and targets are one price ladder: Sell prices on the left, Buy prices on the right, points, size and dollars in the middle, with the fail (and pass, on evaluations) prices underneath.
- **Margin and risk bars** head the Trade tab, live: how much of Vest's buying power is used and what's left, and what your stop would lose (fees counted) against the room to the floor, on the tightest account. The striped part previews the order you're about to send, amber near the limit, red over it.
- **In a trade:** your position sits right above the buttons with its live P&L, plus **Breakeven** (moves the stop to your average entry, rounded toward profit to the nearest tick, once price is clear of it) and **Close**. Both are copied to followers when armed. Buy or Sell becomes **Add**, and the ladder shows the levels the add would leave, rebuilt from the new average, with a live mark row.
- **Add chips:** +25%, +50%, +100% of your position, or **MAX**, the largest add that fits Vest's buying power and keeps a stop-out above the floor. Chips that wouldn't fit are greyed out with the reason. Click a picked chip again to go back to the Size field.
- **Limit orders from the panel:** Buy LMT or Sell LMT, then click Vest's chart where you want it (or type the price). The pending order shows as a line on the chart and in the ladder, with the stop and targets measured from the limit price; nothing is sent until **Place**, and Esc cancels. A buy limit must sit below the mark and a sell limit above it. Limits open a new trade; Auto BE stays with market orders (use Breakeven once a limit fills).
- **The Trade tab follows the market Vest is showing** (switch Vest to ES and the tab trades ES), and each market remembers its own size, stop and targets. A market you haven't traded from the panel starts with your current numbers and a reminder to check them, since points mean different money on ES and NQ.
- **Adding never loosens your stop.** An add still rebuilds the targets from the new average, but a stop that's already tighter (moved to breakeven, say) stays where it is.
- **Cap-to-fit:** accounts within 0.5% of the master's equity (same-size accounts a few cents apart) now copy 1:1 instead of taking the 5% safety margin meant for smaller accounts.

## v0.31.2
- **Site check fix:** with no active accounts (for example after an account closes), Vest's site update could show a red "Something Vest-side changed" and block arming, because one of Vest's servers answers with an error when there are no accounts. The check now says there are no active accounts and skips the account checks, and the equity history check (only a backup since v0.31.1) can warn but no longer blocks arming.

## v0.31.1
- **Balances and P&L are live, like Vest's own Account Value.** Equity is worked out the same way Vest does it (free cash, plus margin held by open trades, plus their open profit or loss), and open trades re-price with every price tick, so the Accounts and P&L tabs move with the market. Balances re-read about 2 seconds after any order on the page (Vest's ticket included, armed or not) and right away when the price crosses one of your stops or targets. Before, they came from Vest's performance history, which could be several minutes behind after a close (+$18 shown while Vest showed +$50). Cap-to-fit sizing, room to the floor, the max size and fail prices use the live figure too.

## v0.31.0
- **The Trade tab fits your screen.** It grows to the bottom of the window by itself, and Buy and Sell stay pinned in view (with the reason if they're blocked) while you scroll, so they're never hidden. The activity log is shorter on this tab to make room. Other tabs keep your size.
- **Stop and targets are always measured from your fill.** The "Price at click" option is gone: right after entry, the stop and targets move to exactly your points from the price you actually got. Anyone who had it switched to "Price at click" now uses the fill.

## v0.30.1
- **Claim all profit is faster:** accounts are now claimed 2 seconds apart instead of 6, still one at a time and each re-checked right before its claim.

## v0.30.0
- **Claim all profit, from the P&L tab.** One button claims the profit of every funded account to your Primary Account, the same claim the Claim Profit window Vest itself offers makes, for the full available amount. It shows a preview first (what each account claims and what you receive after its split, or why an account can't claim: an open position or order, no profit, an evaluation) and sends nothing until you confirm. Accounts are then claimed one at a time, a few seconds apart, each re-checked right before its claim, and you can stop between accounts. Claims arrive in your Primary Account within 24 hours and can't be reversed. Moving money from the Primary Account to your wallet stays on Vest.
- The P&L tab's "you keep" figures are cut to the cent the way Vest pays them.

## v0.29.0
- **The Trade tab shows your allowed range, live.** Under Size: how much you can risk at your current stop, and the most you can risk before a stop-out would reach your floor. Under Stop: the smallest stop that fits your $ risk (e.g. "Stop must be at least 25 pts to risk $200" on a $5k account at 50x), or in Contracts mode the widest stop before the account fails.
- **Orders Vest wouldn't fill are blocked.** If the size is more than the account can open, Buy and Sell are off and the panel says why, with one-click fixes: **Set stop to 25 pts** (keeps your $ risk), **Risk $159 instead** (keeps your stop), or **Use max**. Before, the order was sent and Vest quietly didn't fill it.

## v0.28.0
- **What you keep, on the P&L tab.** Next to the total P&L, a green figure shows what you'd take home if every funded account's profit were claimed now: each account's profit × its own profit split, added up. Each account also shows its share ("keeps $992.40 · 80%"). Evaluations aren't counted (their profit doesn't pay out), and an account in a loss counts as $0 (claims are per account). With trades open it says "if closed now".
- Minor improvements.

## v0.27.1
- **Flatten All keeps you armed.** It still closes every position and cancels every order on every account in one click, but the copier now stays armed, so your next trade copies as usual. Handy as a fast exit across many accounts. Press DISARM if you want to stop copying. Orders placed on the master during the few seconds it's flattening aren't copied.

## v0.27.0
- **Max size in the Trade tab.** Next to Contracts and Risk $, **Max** sizes the order at the most the account can open right now, the same as Vest's own 100% (free cash × leverage, less a little for the fee and the spread). Armed in strict 1:1, it uses the smallest of your accounts, so every follower can fill the same size.
- **Fail and pass prices.** Beside each side's stop and targets, the Trade tab shows where the account would fail (equity at its floor) and, on an evaluation, pass (equity at the target), counting the opening fee.
- **Warnings before you send:** when the size is more than the account can open (Vest wouldn't fill it; **Use max** fixes it in one click), and when a stop-out would lose more than the room left to your floor once fees are counted, so the account would fail before the stop fills.
- The risk line now shows the fees on top of the loss at your stop.
- **Daily loss limit counted.** On plans with a daily loss limit, the Accounts tab measures the room left to the daily floor when that's the higher floor today, and shows it as "daily floor".

## v0.26.3
- **Flatten All acts instantly.** It's an emergency button, so it no longer asks for confirmation: one click closes every position and cancels every order on every account, and disarms.
- More detail in the Diag file for troubleshooting (session, markets, accounts, settings changes, and any error in the copier itself), and the CSV log now says which version wrote it.

## v0.26.2
- **Every market sized correctly.** The copier now knows every Vest market's size rules, so followers scaled with Cap-to-fit always get a size that market accepts (some markets trade in whole units).
- **Fixed:** account ids that appeared inside error messages are now removed from report files too.

## v0.26.1
- **Discord:** the Support tab has a **Join the Discord** button for questions, setup help and chatting with other users.
- New versions now come from GitHub releases, and the panel's **Install** button downloads the release file.

## v0.26.0
- **New Support tab**, next to Rules. Report a problem (it saves a report file and opens a pre-filled GitHub issue), share an idea or feedback, or jump to what's new, the user guide and the tutorial. The **Problem? Report it** link at the bottom opens it too.

## v0.25.1
- **Fixed:** report files now replace every account id with its name, including accounts that have since closed. Before, ids of closed accounts were left in.

## v0.25.0
- **Report a problem from the panel.** Click **Problem? Report it** at the foot of the panel, describe what happened, and click **Save report & open issue**. The copier saves one report file (activity log, diagnostics, settings, version and account balances, with account ids replaced by names) and opens a GitHub issue with your description filled in. Drag the file in and submit.

## v0.24.3
- Internal update. Nothing changes in how the copier trades.

## v0.24.2
- Minor fixes.

## v0.24.1
- **Updating reloads Vest for you.** After clicking **Install** and then **Update** in Tampermonkey, come back to the Vest tab and it reloads by itself, running the new version. If you're armed, it shows **Reload now** instead, because reloading disarms the copier.
- A new version shows up in the panel right after it's published.

## v0.24.0
- Minor improvements.

## v0.23.2
- Minor fixes.

## v0.23.1
- Minor improvements.

## v0.23.0
- **Risk acknowledgement.** On first use, the panel shows the risks and asks you to accept them (tick the box, then **Accept and continue**) before you can arm or place an order from the Trade tab. Everyone sees it once, including current users, because the terms are new. Full text: DISCLAIMER.md.

## v0.22.3
- Internal update. Nothing changes in how the copier trades.

## v0.22.2
- The update check runs each time Vest loads. A bar under the status line shows "Checking for updates…", then either **Update available** with Install, or "Up to date", which disappears after a few seconds.

## v0.22.1
- **Fixed: garbled symbols** (for example "ΓÇô" instead of "–" on the minimize button) in copies of the script that were passed through the Windows clipboard tool. Installing from GitHub or the panel's **Install** button always gives a clean copy.
- The panel warns in the activity log if the copy you're running was garbled this way.

## v0.22.0
- **Update check.** The panel checks GitHub for a newer version every few hours. When there is one, a green bar offers **Install**: Tampermonkey opens its update page and one click updates the script. Then reload Vest. Install when you're flat. **What's new** opens this changelog; **Later** hides the bar until the next version.
- Settings has a new **Updates** section: turn the check off, or **Check now**.
- Installs from the GitHub link also get Tampermonkey's own automatic updates.

## v0.21.0
A full review of the code before sharing it. Mostly safety fixes; nothing new to learn.

**Safety fixes**
- Copies of one trade now always reach followers in the order you made them. Before, a fast reduce-then-add could give a follower the wrong size.
- A resting limit entry no longer gets its followers dropped after a few seconds.
- If Vest's fill history is briefly unavailable, nothing is dropped or flattened; the log says the fills couldn't be confirmed.
- Auto-flatten never closes followers when the master might actually be in the trade.
- Arming can't be started twice. Changing the selection mid-arm, disarming or Flatten All cancels it, so the copier can't switch itself back on after a panic flatten.
- Flatten All waits for orders still in flight, then checks every account a second time.
- A follower close or reduce that hits a rate limit or a Vest server error is retried once. If it still fails, the log says that follower is still open.
- The live price feed reconnects if it goes quiet, and warns you while breakeven is paused.
- Breakeven keeps working if you reload the page while stops/targets are being adjusted, and gives up after 5 refused moves instead of retrying forever.
- Buy and Sell are disabled while the stop and targets are being re-placed, so two adjustments can't run at once.
- **Fixed:** clicking Reload accounts while on the Trade tab broke the panel.

**Tidier**
- Tabs renamed: **Opts** is now **Settings** and **Info** is now **Rules**.
- Sizes show the way Vest writes them ("2.5", not "2.5000").
- Clearer messages throughout. Keyboard focus is visible, and buttons have labels for screen readers.
- The console stays quiet unless you turn on debug logging (`localStorage.setItem('vc-debug', '1')`).

## v0.20.1
- **Fixed (important):** right after an entry, Vest can briefly report a wrong entry price (seen live: 290.25 for a 31,148 fill). Re-anchor trusted it and tried to move your stop and targets hundreds of points away. Vest refused, so nothing moved, but it could have misled breakeven. Your fill price now comes from Vest's own record of the order, and no stop or target is placed from a price that isn't within 1% of the market.
- **Fixed (important):** when Vest refused one of the master's orders, the copier still sent it to the followers. Refused master orders are now never copied.
- A breakeven saved by v0.19/v0.20 with a wrong entry is dropped (with a log message) instead of acted on.

## v0.20.0
- **Adding to a trade works.** If your master is already long (or short) and you click Buy (or Sell) again in the Trade tab, it now adds to the position the way Vest's own ticket does. Before, it sent a second "open", which Vest accepts but never fills, so nothing happened on the master or the followers.
- After an add, your stop and targets are rebuilt as **one ladder for the whole position**, measured from the new average entry: the stop is your stop points away, the targets your target points, and the full size is split across them by your scale setting. Breakeven is re-measured from the new average too.
- Clicking the **opposite** side while in a trade is refused with a clear message. Close or reduce first.
- **The copier now copies adds**, including adds made with Vest's own ticket. Each follower adds to its own position, sized to match (cap-to-fit included).
- **Better no-fill messages:** if the master's own order didn't fill, the log now says so. The old "likely insufficient margin" guess is replaced with the real possible causes.
- Resizing a target on the master now resizes the follower's target to match its size.

## v0.19.0
- **Stop and targets are now measured from your fill**, not the price when you clicked. Right after you're filled, they're moved so they sit exactly your points away (e.g. 20 / 40 / 60) from your real entry, on your followers too. You can switch back to "Price at click" in the Trade tab.
- Entries are never slowed down by this; it happens after you (and your followers) are in.
- **Fixed:** if a follower's entry was still going through when you moved a stop/target or exited, that follower could be skipped. It now waits for that follower's entry to finish first.

## v0.18.1
- **Fixed:** the Trade tab refused to trade on accounts that never had their NQ leverage changed ("no NQ leverage is set"). It now does what Vest's own ticket does: use your saved leverage if you have one, otherwise the maximum for that market (50x for NQ).

## v0.18.0
- **New Trade tab:** an order panel built for points. Set your stop in points (e.g. 20), add as many targets as you like (20, 40, 60…), and choose how size scales out: **Start** (most at the first target), **Even**, or **End** (most at the last). Size it in contracts or by dollar risk ("risk $50" with a 20-pt stop sizes it for you). It shows your risk, reward and R before you click.
- Targets are real Vest take-profits with their own sizes, so they work on Vest's side even if you close the tab.
- **Auto-breakeven:** after TP1, or once price moves +X points your way, the stop moves to entry (plus an optional point or two to cover fees).
- The copier follows all of it: followers get the same stop and targets (scaled to their size with cap-to-fit), and breakeven moves copy too.
- **Fixed:** adding or removing a stop/target on the master after entry now copies correctly. Before, an added target could move a follower's existing one instead.
- **Fixed:** with cap-to-fit, a master trading a whole number of contracts (e.g. 2) no longer rounds smaller followers down to zero.
- Sizes and prices are now sent exactly the way Vest's own site writes them ("1.9", not "1.90"), replacing the v0.17 format.
- Tabs across the top: Accounts · Trade · P&L · Opts · Info.

## v0.17.0
- **Arm mid-trade (adopt open trade).** If your master and followers are already in the same trade (same market, same direction), ARM now takes it over instead of refusing. Closing, partial exits, and stop moves on the master copy to those positions. Followers that are flat are left alone and join from your next trade.
- It still refuses if a follower is in the **opposite** direction, holds a trade the master doesn't, or has a resting order.
- Leverage isn't changed on an account while it has a position open.
- Copied sizes keep the same decimal format Vest uses (e.g. "1.90", not "1.9").

## v0.16.0
- **Site check for Vest updates.** When Vest updates its website, the health bar turns amber: click it. The copier checks every part of Vest it relies on (read-only, no orders) and shows a green / amber / red result for each. If nothing failed, click **Accept this build** and you're back to green.
- Arming is paused after a Vest update until you've run the check, so an unnoticed Vest change can't misfire real orders.
- Every master order is now checked as it happens: if Vest changed the order format, you get a warning straight away.

## v0.15.0
- New **Diag** button (next to CSV) downloads a detailed diagnostics file. It silently records every copy — intended vs actual size, the margin math, fill prices, slippage, margin used vs. cap, and any error codes — so you can send it in if something looks off. Nothing to read day-to-day.
- Activity log is cleaner: one fill summary line per trade (e.g. "Fills 9/9 confirmed · avg slip 0.20pt") instead of a line per account. The per-account detail now lives in the diagnostics file.

## v0.14.0
- Fixed a freeze where the panel could stop responding (including not letting you disarm) after an account blew or closed. It now clears that account and disarms automatically.
- More accurate fill checks and slippage numbers.
- Behind-the-scenes reliability cleanup. Nothing new to learn.

## v0.13.0
- You can now copy between **different-size accounts** (e.g. a 25k master to 5k accounts) — turn on **Cap-to-fit** in Opts. Each account trades the right size for its balance, same % risk, same stop.

## v0.12.0
- New **Cap-to-fit** option (Opts): if a trade is too big for a smaller account, it opens a smaller size that fits instead of failing. Off by default (exact 1:1 copying).
- Cleaner, modern look. Options moved into an **Opts** menu. Text labels instead of icons.

## v0.11.0
- New **Flatten All** button: instantly closes every position and cancels every order on all your accounts, and disarms. Asks you to confirm first.
- Fixed: you can now always disarm, even while viewing the P&L or Info screens.

## v0.10.0
- After each entry, the copier checks that every follower **actually filled**. If one didn't (usually too small for the trade), it warns you and drops it from tracking so later stops/closes don't target a trade that isn't there.

## v0.9.0
- New **Fast mode** (Opts): fires follower entries the instant you send yours, for more simultaneous fills. Optional.
- Smoother panel resizing.

## v0.8.0
- First live-ready version. Arming now places **real orders** (no more practice mode).
- One-time agreement screen before your first arm.
- Follower **leverage auto-syncs** to your master when you arm.
- Live rate-limit indicator, execution timing, and slippage in the activity log.
- Resizable panel; activity log you can export to CSV.

## Earlier (v0.2–v0.7)
Development builds: account discovery, master/follower selection, flat-to-arm safety, and the live order engine.
