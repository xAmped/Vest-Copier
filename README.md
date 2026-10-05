# Vest Copier

Trade copier for prop accounts on [Vest Markets](https://next.vestmarkets.com). One account leads, the others mirror
it. Runs as a Tampermonkey userscript inside the Vest page.

<p>
  <img src="docs/tutorial/img/accounts.png" alt="Accounts tab with one master and two followers" width="340">
  &nbsp;
  <img src="docs/tutorial/img/trade.png" alt="Trade tab with a stop and three targets in points" width="340">
</p>

## A copy, start to finish

Say Account 11 is your master and Accounts 12 and 14 follow it.

1. You buy 1 NQ on Account 11 with a 20 point stop and two targets.
2. About a third of a second later, 12 and 14 each buy 1 NQ with the same stop and targets.
3. You drag the stop to breakeven on 11. Their stops move to the same price.
4. You add half a contract. They add half a contract.
5. You close. They close, and the log tells you each account filled and how far apart the fills were.

If 12 and 14 are smaller than 11, turn on Cap-to-fit and they trade a proportional size instead, with the same stop
distance, so every account risks the same percent.

> [!WARNING]
> These are live orders on real accounts. When the copier is armed, whatever you do on the master happens on every
> follower, mistakes included. Try it with the minimum size before anything else.

## Before you start

- A desktop browser: Chrome, Edge, Brave or Firefox.
- The [Tampermonkey](https://www.tampermonkey.net/) extension.
- On Chrome, Edge or Brave, one setting: `chrome://extensions` → Tampermonkey → **Details** → **Allow User Scripts**
  on. It's off by default, and the script won't run without it.

## Getting it running

1. Open **[vest-copier.user.js](https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js)**.
   Tampermonkey shows an install page. Click **Install**.
2. Log in at [next.vestmarkets.com](https://next.vestmarkets.com). A dark panel titled Vest Copier opens in the top
   right.
3. Read the risk notice and accept it.
4. On **Accounts**, press **M** on your lead account and **Flw** on the ones that should copy it.
5. Press **ARM**. From now on, trade the lead account as usual. Press **DISARM** to stop; positions stay as they are.

The [quick-start PDF](docs/Vest-Copier-Quick-Start.pdf) fits all of this on one page, and the
[user guide](docs/USER-GUIDE.md) goes through every button.

## The panel

| Tab | What's there |
|---|---|
| Accounts | Your accounts grouped by size, with balance, floor and room left. Pick the master and followers here. |
| Trade | An order ticket in points: stop, any number of targets, size by contracts or by dollars at risk, scale-outs, and automatic breakeven. Adding to an open trade rebuilds the stop and targets around the new average price. |
| P&L | Profit or loss per account and in total. |
| Settings | Fast mode, Auto-flatten, Cap-to-fit, update checks, and the AMPED code switch. |
| Rules | What the copier will and won't do, and the risk notice. |

Below the tabs: **ARM / DISARM**, a red **Flatten All** that closes everything on every account, and an activity log
with **Diag** and **CSV** exports.

## Things it won't do

- It won't copy a trade you placed while it was disarmed, and it won't open a follower into a trade that's already
  running. (If master and followers already hold the same position, arming takes it over.)
- It won't copy an order Vest rejected on the master.
- It won't copy closes Vest makes by itself, such as a drawdown breach on the master. Those followers stay open until
  you close them or press Flatten All.
- It won't arm right after Vest changes its website until you've run the quick read-only check in the status bar.

## Troubleshooting

| Symptom | Fix |
|---|---|
| No panel on the Vest page | Allow User Scripts is off (see Before you start), or the script is disabled in Tampermonkey. Refresh after fixing. |
| Flw is greyed out | That account is a different size from the master. Turn on Cap-to-fit in Settings. |
| ARM refuses | The log names the account and the reason, usually a resting order or an opposite position. Clear it on Vest and arm again. |
| "did NOT fill" in the log | Vest accepted the order but didn't execute it, usually not enough margin for that size. Trade smaller or use Cap-to-fit. |
| Amber status bar | Vest updated its site. Click the bar, let the check finish, then Accept. |
| Anything else | Press Diag, then [open an issue](https://github.com/xAmped/Vest-Copier/issues) with the file and a few words on what you expected. The file has sizes, prices and account ids but no login data. |

## Updates

New versions show up as a green bar in the panel. Click **Install**, confirm in Tampermonkey, switch back to Vest and
the page reloads with the new version. The [changelog](CHANGELOG.md) lists what each one changed.

## About the AMPED code

The copier doesn't cost anything. I keep it running in my spare time, so if you were going to buy a Vest evaluation anyway,
code **AMPED** takes 5% off and sends a small commission my way.

You'll be asked about it once. If you agree, the copier enters AMPED in the discount field of Vest's checkout window
whenever it opens, replacing any code that was there, and logs the change. If your account already uses a code, the
question names it so you can decline. Settings → Support turns the switch off.

## Privacy

The script runs in your browser tab and uses the Vest session you're already logged into. Your orders go to Vest and
nowhere else. The only outside request is to this repository, to see if a newer version exists.

## Working on the code

```sh
node test/math.test.mjs                                  # order math
CHROME_PATH=/path/to/chrome node test/copier.test.mjs    # full browser test against a mocked Vest API
npx prettier --check src test
python3 tools/package.py                                 # zip with the script, tutorial and PDF
```

Architecture and safety rules are written up in [docs/DESIGN.md](docs/DESIGN.md).

## Terms

Use it on your own accounts and pass it along unchanged, both free. Selling it, renaming it or releasing an edited
copy is off limits. The full wording lives in [LICENSE](LICENSE), and [DISCLAIMER.md](DISCLAIMER.md) covers the risk
you take on by using it. Independent project by xAmped; Vest Markets has no part in it.
