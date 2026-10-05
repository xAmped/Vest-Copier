# Vest Copier

Trade one [Vest Markets](https://next.vestmarkets.com) account and have the same trade placed on your other
accounts, live, from inside the Vest page. Includes a **Trade tab** for setting your stop and targets in points.

A Tampermonkey userscript. No server, no sign-up, no bot logging in for you: it runs in your own logged-in
browser and acts only on orders you place.

> [!WARNING]
> **It places real orders on live accounts.** Once armed, every order on your master is sent to every follower.
> One bad trade hits every linked account at once. Vest has no official copier, and you are responsible for
> every order this sends. Start with the smallest size.

<p>
  <img src="docs/tutorial/img/accounts.png" alt="Accounts tab: a master and two followers, armed" width="340">
  &nbsp;
  <img src="docs/tutorial/img/trade.png" alt="Trade tab: 20-point stop and three targets scaled toward the last" width="340">
</p>

## Features

- **Live copying** from a master to any number of followers: entries, adds, partial closes, closes, and every
  stop/target change (move, add, resize, remove).
- **Two sizing modes.** Strict 1:1 for identical accounts, or **cap-to-fit**: each follower sized to its own
  equity, so a 50k master can drive 5k accounts at the same % risk and stop distance.
- **Trade tab.** Stop and targets in points, size by contracts or by dollar risk, scale out Start / Even / End,
  stop and targets re-placed from your actual fill, auto-breakeven after TP1 or at +X points, and adding to a
  position rebuilds one ladder from the new average entry.
- **Safety.** Leverage synced to the master, a fill check on every entry (master included), orders Vest refuses
  are never copied, Flatten All, adopting a trade that's already open, and a read-only site check that pauses
  arming after Vest updates its website.
- **Records.** Per-account P&L, an activity log (CSV), and a diagnostics file with no login tokens in it.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. **Chrome, Edge, Brave:** open `chrome://extensions`, click **Details** on Tampermonkey, and turn on
   **Allow User Scripts**. Without it the script installs but never runs.
3. Open **[the install link](https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js)**
   and click **Install**. Tampermonkey then updates it automatically when a new version is released.
4. Open [next.vestmarkets.com](https://next.vestmarkets.com) and log in. The Vest Copier panel appears top-right.

## Use

1. On **Accounts**, click **M** on the account you'll trade (the master) and **Flw** on each account that should
   copy it.
2. Set your leverage on Vest, then click **ARM**. On first use, the panel asks you to read and accept the
   [risk terms](DISCLAIMER.md).
3. Trade the master on Vest's own ticket or the **Trade** tab. Each copy is logged, with a fill summary.
4. Click **DISARM** when you're done. Disarming stops copying; it doesn't close anything.

Read the **[tutorial](docs/tutorial/index.html)** (download and open it, or see the
[quick-start PDF](docs/Vest-Copier-Quick-Start.pdf)) before trading real size.

## Documentation

| | |
|---|---|
| [Quick-start PDF](docs/Vest-Copier-Quick-Start.pdf) | One page: install, set up, sizing, safety. |
| [Tutorial](docs/tutorial/index.html) | Step by step, with screenshots. |
| [User guide](docs/USER-GUIDE.md) | Everything in detail, plus troubleshooting. |
| [Changelog](CHANGELOG.md) | What changed in each version. |
| [Disclaimer](DISCLAIMER.md) | The risk you accept by using it. |
| [Design](docs/DESIGN.md) | How it works: the order hooks, sizing math, safety rules. |

## Reporting a problem

Click **Diag** under the activity log to download a diagnostics file, then
[open an issue](https://github.com/xAmped/Vest-Copier/issues) describing what you expected and attach the file.
It contains account ids, sizes, prices and error codes, but no passwords or login tokens. Remove anything you
don't want public before attaching it.

## Development

```sh
node test/math.test.mjs                                  # order math (no browser needed)
CHROME_PATH=/path/to/chrome node test/copier.test.mjs    # end-to-end, headless Chrome against a mocked Vest API
npx prettier --check src test                            # formatting (.prettierrc)
python3 tools/package.py                                 # shareable zip in dist/
```

## Support the project

Vest Copier is free. On first use the panel asks, once, whether you'd like to use code **AMPED**: it takes **5% off**
your Vest purchases and helps keep the copier maintained until Vest releases its own. If you already use another code,
the question names it so you can keep it. **Yes** sets AMPED in Vest's purchase window each time it opens (replacing
any other code there); **Settings → Support** turns that off. Nothing changes unless you click **Yes**.

## Disclaimer

Vest Copier places real orders on live accounts. You use it entirely at your own risk and are solely responsible for
every trade on your accounts. It is provided as is, without warranty, and its author accepts no liability for any
loss. Read the full [disclaimer](DISCLAIMER.md) before using it.

## License

Free to use for your own trading, including prop accounts, and to share unmodified copies free of charge.
Not for sale, resale or paid services, and modified versions may not be published. See [LICENSE](LICENSE).

Vest Copier is an independent tool. It is not affiliated with, endorsed by or supported by Vest Markets.
