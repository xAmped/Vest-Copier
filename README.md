# Vest Copier

Trade one Vest account, and the copier places the same trade on your other accounts within a fraction of a second.
Stops, targets, adds and exits follow along too.

**[Install](https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js)** ·
[Quick-start PDF](docs/Vest-Copier-Quick-Start.pdf) · [User guide](docs/USER-GUIDE.md) · [Disclaimer](DISCLAIMER.md)

<p>
  <img src="docs/tutorial/img/accounts.png" alt="Accounts tab with one master and two followers" width="340">
  &nbsp;
  <img src="docs/tutorial/img/trade.png" alt="Trade tab with a stop and three targets in points" width="340">
</p>

I built this for my own prop accounts. Running the same NQ setup on several funded accounts meant clicking through
Vest's ticket over and over, and by the third account the price had already moved. Now I trade one account and the
rest copy it. Vest says they're working on their own copier; until that's out, this is free for anyone who wants it.

> [!WARNING]
> **Real orders, real accounts.** Once you arm it, every order on your master is sent to every follower you selected.
> A mistake on one account becomes a mistake on all of them. Test with the smallest size first.

## Highlights

- **Full trade copying**: entries, adding to a position, partial closes, full closes, and every stop or target you
  move, add or remove.
- **Different account sizes**: copy 1:1, or switch on Cap-to-fit so each follower trades in proportion to its balance
  (a 5k account following a 50k master risks the same percent, with the same stop distance).
- **Points-based order panel**: stop and targets in points, sized by contracts or by dollars at risk, with scale-outs
  and automatic breakeven.
- **Guard rails**: a fill check on every entry, Flatten All, adopting a trade that's already open, and a lockout
  when Vest changes its website until a quick read-only check passes.
- **One-click updates**: a bar in the panel tells you when there's a new version.

## Setup

You need a desktop browser with Tampermonkey: Chrome, Edge, Brave or Firefox.

1. Add [Tampermonkey](https://www.tampermonkey.net/) to your browser.
2. Chrome, Edge and Brave only: open `chrome://extensions`, find Tampermonkey, click **Details** and switch on
   **Allow User Scripts**. If you skip this, Tampermonkey accepts the script and then never runs it.
3. Click the [install link](https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js) and
   press **Install** on the page Tampermonkey opens.
4. Log in to [next.vestmarkets.com](https://next.vestmarkets.com). The Vest Copier panel appears in the top right
   corner. Read the risk notice it shows and accept it.

## Using it

1. On the **Accounts** tab, press **M** next to the account you'll trade. That's your master.
2. Press **Flw** on each account that should copy it.
3. Press **ARM**.
4. Trade the master like you always do, from Vest's ticket or the copier's **Trade** tab. The activity log at the
   bottom shows each copy and a fill summary.
5. Press **DISARM** when you're done for the day. It stops copying and leaves your positions alone.

One thing to know: the copier only repeats orders you place. If Vest closes your master by itself, for example on a
drawdown breach, your followers stay in the trade. Close them by hand or use **Flatten All**.

The [user guide](docs/USER-GUIDE.md) covers every setting, and the [tutorial](docs/tutorial/index.html) walks
through it with screenshots (download it and open it in your browser).

## Privacy

Everything happens inside your own browser tab, using the Vest login you already have. The copier has no server and
collects nothing. It talks to two places: Vest, to place your orders, and this GitHub repo, to check for updates.

## Questions

**Who's behind this?**
Me, xAmped. It's a personal project, not a Vest product.

**What does it cost?**
Nothing.

**Will Vest mind?**
A Vest team member has said third-party copy tools aren't banned, at your own risk. Your prop program may have its
own rules, so check them.

**The panel never appears.**
Nine times out of ten it's step 2 of Setup (Allow User Scripts). Otherwise check the script is switched on in
Tampermonkey and refresh Vest.

**Something didn't copy right.**
Press **Diag** in the panel's activity log. It saves a file describing what happened, without passwords or login
tokens. [Open an issue](https://github.com/xAmped/Vest-Copier/issues), describe what you expected and attach it
(remove anything you'd rather keep private).

## Code AMPED

If the copier saves you time, using code **AMPED** when you buy a Vest evaluation is a nice way to say thanks. You
get 5% off and it helps me keep the copier working.

The panel asks you about it one time. Say yes and it fills in AMPED in Vest's purchase window whenever you open it,
in place of any other code, and writes that in the activity log. If you're already using someone's code, the question
shows it so you can stick with it. You can switch this off any time in Settings, under Support.

## For developers

```sh
node test/math.test.mjs                                  # order math
CHROME_PATH=/path/to/chrome node test/copier.test.mjs    # browser test against a fake Vest API
npx prettier --check src test
python3 tools/package.py                                 # zip with the script, tutorial and PDF
```

How it's put together is in [docs/DESIGN.md](docs/DESIGN.md), and every release is listed in the
[changelog](CHANGELOG.md).

## License

© 2026 xAmped. Free to use for your own trading and to share as is. Don't sell it, rebrand it or publish modified
versions. Details in [LICENSE](LICENSE). Vest Copier isn't affiliated with Vest Markets.
