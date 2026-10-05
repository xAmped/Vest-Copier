# Vest Copier

A Tampermonkey script for [Vest Markets](https://next.vestmarkets.com) that copies the trades from one of your accounts
to the rest of them, live, right from the Vest page. It also adds a Trade tab where you set your stop and targets in
points.

Made by **xAmped** · [Install](https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js) ·
[Quick-start PDF](docs/Vest-Copier-Quick-Start.pdf) · [Disclaimer](DISCLAIMER.md)

<p>
  <img src="docs/tutorial/img/accounts.png" alt="Accounts tab: one master and two followers, armed" width="340">
  &nbsp;
  <img src="docs/tutorial/img/trade.png" alt="Trade tab: a 20 point stop and three targets" width="340">
</p>

## Why I made it

I run a few funded accounts on Vest and trade the same idea on all of them. Placing the same order five times, then
moving five stops, then closing five positions got old fast, and I'd always end up a few points apart on fills. Vest
doesn't have a copier yet, so I wrote one. I've been using it on my own accounts and I'm sharing it until Vest ships
their own.

It runs in your browser on the Vest tab you already have open. There's no server, no sign-up and nothing to pay.

> [!WARNING]
> It places real orders on live accounts. When it's armed, every order you place on your master goes to every follower
> you picked, so one bad trade hits all of them at once. Start small and read the [disclaimer](DISCLAIMER.md).

## What it does

### Copies your trades

Pick one account as the master and tick the ones that should follow it. Hit ARM, then trade the master the way you
normally would, on Vest's own ticket or on the Trade tab. Entries, adds, partial closes, full closes and every change
to your stop and targets get copied to each follower. After each entry it checks that every account actually filled
and tells you if one didn't.

It only copies orders you place. If Vest closes the master on its own, like a drawdown breach, the followers stay open,
so close them yourself or hit Flatten All.

### Sizing

By default every follower gets the exact same size as the master, which is what you want when the accounts are the
same size. Turn on **Cap-to-fit** in Settings and each follower is sized to its own balance instead. A 50k master can
drive 5k accounts that way, and every account takes the same percent risk with the same stop distance.

### Trade tab

An order ticket built around points. Set a stop in points, add as many targets as you want, and pick how the size
splits across them: most at the first target, even, or most at the last one. You can size by contracts or by how many
dollars you want to risk. It shows your risk, reward and R before you click.

Once you're filled it moves the stop and targets so they sit exactly your points from your real fill price. Breakeven
can move your stop to entry after TP1 or after a set number of points. If you're already in a trade, Buy or Sell adds
to it and rebuilds the stop and targets for the whole position from your new average price.

### Safety stuff

- **Flatten All** closes every position and cancels every order on all your accounts, then disarms.
- If the master and followers are already in the same trade, ARM picks it up instead of refusing.
- When Vest updates its website the panel goes amber and won't arm until you run a quick read-only check.
- An order Vest refuses on your master never gets sent to the followers.

### Updates

When I push a new version, a green bar shows up in the panel the next time you load Vest. Click Install, click Update
in Tampermonkey, come back to the Vest tab and it reloads on its own.

## How it works

Vest Copier is a userscript, so Tampermonkey loads it into the Vest page. It watches the orders your browser sends for
your master account, and when one goes through, it sends the same order for each follower using the session you're
already logged in with. Your login never leaves your browser and nothing is sent to me. The only other thing it talks
to is this GitHub repo, to check for a newer version.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. On Chrome, Edge or Brave, go to `chrome://extensions`, click **Details** on Tampermonkey and turn on
   **Allow User Scripts**. Without that, the script installs but never runs.
3. Open the [install link](https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js) and
   click **Install**.
4. Go to [next.vestmarkets.com](https://next.vestmarkets.com). The panel shows up in the top right.

The first time, it asks you to read and accept the risks before you can arm or trade. Do one small trade across all
your accounts before you trade real size.

More detail in the [user guide](docs/USER-GUIDE.md) and the [tutorial](docs/tutorial/index.html) (download it and open
it in your browser).

## FAQ

**Is this made by Vest?**
No. It's an independent project and has nothing to do with Vest Markets.

**Does it cost anything?**
No.

**Is it allowed?**
Someone from Vest said on X that third-party copy tools aren't prohibited, use at your own risk. Prop programs have
their own rules though, so check yours.

**I installed it and nothing shows up.**
Make sure **Allow User Scripts** is on (step 2), the script is enabled in Tampermonkey, and you're on
next.vestmarkets.com. Then refresh.

**Something went wrong.**
Click **Diag** under the activity log, then [open an issue](https://github.com/xAmped/Vest-Copier/issues) with the file
and what you expected to happen. The file has account ids, sizes and prices in it but no passwords or login tokens, so
take out anything you don't want public.

## Support the project

Vest Copier is free. If you're buying a Vest evaluation, use code **AMPED** at checkout. It's 5% off and it helps me
keep this maintained until Vest has their own copier.

The first time you use it, the panel asks once if you want to use AMPED. If you say yes, it puts AMPED in the discount
box of Vest's purchase window each time you open it, replacing whatever code was there, and notes it in the activity
log. If you already use another code it tells you which one, so you can keep it. Settings > Support turns it off.

## Developers

```sh
node test/math.test.mjs                                  # order math
CHROME_PATH=/path/to/chrome node test/copier.test.mjs    # end-to-end against a mocked Vest API
npx prettier --check src test
python3 tools/package.py                                 # shareable zip in dist/
```

## Credits and license

Made by **xAmped**. © 2026 xAmped.

You can use it for your own trading and share it as long as you don't change it or charge for it. Selling it,
rebranding it or publishing changed versions isn't allowed. Full terms in [LICENSE](LICENSE). Not affiliated with
Vest Markets.
