# STRATUH Copier (formerly Vest Copier) — What's New

Newest first. To update, click **Install** on the green bar that appears in the panel whenever there's a newer version.

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
- **Report a problem from the panel.** Click **Problem? Report it** at the bottom of the panel, describe what happened, and click **Save report & open issue**. The copier saves one report file (activity log, diagnostics, settings, version and account balances, with account ids replaced by names) and opens a GitHub issue with your description filled in. Drag the file in and submit.

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
