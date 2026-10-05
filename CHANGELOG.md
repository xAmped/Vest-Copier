# Vest Copier — What's New

Newest first. To update, click **Install** on the green bar that appears in the panel whenever there's a newer version.

## v0.25.1
- **Fixed:** report files now replace every account id with its name, including accounts that have since closed. Before, ids of closed accounts were left in.

## v0.25.0
- **Report a problem from the panel.** Click **Problem? Report it** at the bottom of the panel, describe what happened, and click **Save report & open issue**. The copier saves one report file (activity log, diagnostics, settings, version and account balances, with account ids replaced by names) and opens a GitHub issue with your description filled in. Drag the file in and submit.

## v0.24.3
- Internal update. Nothing changes in how the copier trades.

## v0.24.2
- **Fixed:** the AMPED code switch now finds the discount box in Vest's purchase window.

## v0.24.1
- **Updating reloads Vest for you.** After clicking **Install** and then **Update** in Tampermonkey, come back to the Vest tab and it reloads by itself, running the new version. If you're armed, it shows **Reload now** instead, because reloading disarms the copier.
- A new version shows up in the panel right after it's published.

## v0.24.0
- If you said **Yes** to code AMPED, the copier enters it in Vest's purchase window each time it opens, replacing any other code there, and notes it in the activity log. If Vest refuses AMPED, your previous code stays. **Settings → Support** turns this on or off.

## v0.23.2
- **Fixed:** some accounts that already had a code were never shown the AMPED question.

## v0.23.1
- The AMPED question now names the code your account already uses, so you can choose to keep it.
- **Settings → Support** has a **Copy code AMPED** button.

## v0.23.0
- **Risk acknowledgement.** On first use, the panel shows the risks and asks you to accept them (tick the box, then **Accept and continue**) before you can arm or place an order from the Trade tab. Everyone sees it once, including current users, because the terms are new. Full text: DISCLAIMER.md.
- **Optional AMPED code.** After that, the panel asks once whether you'd like to use code **AMPED** (5% off Vest purchases, and it supports the copier). Nothing changes unless you click **Yes**.

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
