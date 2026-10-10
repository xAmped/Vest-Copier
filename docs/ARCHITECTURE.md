# How the code is organised

STRATUH Copier ships as one Tampermonkey userscript, but the source is split into ES modules under `src/`. Rollup
bundles them into `dist/vest-copier.user.js`, keeping the code and its comments exactly as written, so the installed
script still reads like the source.

```bash
npm install
npm run build   # src/ → dist/vest-copier.user.js
npm test        # build, then load it into a stand-in Vest page (jsdom) and check it starts cleanly
npm run watch   # rebuild on every save
npm run format  # Prettier, 120 columns, single quotes
```

To try a build, install `dist/vest-copier.user.js` in Tampermonkey (drag the file onto the browser, or paste it into a
new script) in place of the released one.

## How it works, in one paragraph

The script runs at `document-start` on next.vestmarkets.com. Before Vest's own code loads it wraps `fetch`, XHR and
`WebSocket`, which gives it the user's session tokens and every order Vest's page sends. When the copier is armed and
an order comes from the **master** account, it sends the same order to each **follower** with that follower's own
account token (`copier/mirror.js`), scaled if Cap-to-fit is on, and confirms the fills. Balances, positions and fills
come live from Vest's private account socket, which the copier listens to but never writes to
(`vest/account-feed.js`). On top of that sits the panel: a shadow-DOM UI docked on Vest's chart, with the Accounts,
Trade, P&L, Settings, Rules and Support tabs.

## Layout

| Folder | What's in it |
|---|---|
| `main.js` | Entry point: installs the hooks and watchers in order, then boots once the page is ready. |
| `boot.js` | Start-up: loads saved settings, builds the panel, reads the accounts. |
| `config.js` | The API host, the debug switch and every tunable timing and threshold. |
| `state.js` | `S`, the one shared state object, and the per-symbol order rules. |
| `vest/` | Talking to Vest: session tokens (`auth`), the fetch/XHR hooks (`request-hooks`), the live account socket (`account-feed`), and API calls as a given account (`api`). |
| `accounts/` | The account registry and balance polling (`registry`), live P&L between reads (`live-pnl`), and reloading the account list (`reload`). |
| `copier/` | The copier itself: sending follower orders and confirming fills (`executor`), sizing, stop/target legs, mirroring master orders (`mirror`), fast mode, orphaned followers, Flatten All, arming and choosing master/followers. |
| `market/` | Live prices from Vest's public market socket (`prices`) and following the market Vest's page is showing (`vest-market`). |
| `trade/` | The Trade tab: pure order math (`order-math`), the ticket's numbers (`calc`), drawing it (`view`), placing orders (`orders`), picking a limit price on the chart, Breakeven/Close/Reduce (`manage`), and the automatic breakeven engine (`breakeven-plans`). |
| `health/` | Which Vest build is loaded (`health`) and the self-check that runs after Vest updates its site (`site-check`). |
| `features/` | Update checks, the optional AMPED support code, Report a problem, and Claim all profit. |
| `core/` | Saved settings, the activity log and the diagnostics file. |
| `ui/` | The panel shell (`panel.js`, `panel.css`), docking it on the chart (`dock`), the STRATUH theme for Vest (`theme`), chart tweaks, the banners, redrawing (`render`), the log strip, and one file per tab view under `views/`. |

## Things to know when changing it

- **Modules call each other in both directions** (the UI renders state; actions re-render the UI), so there are
  import cycles. That is fine as long as no module does work at import time that needs another module: put start-up
  work in a function and call it from `main.js` or `boot.js`. `npm test` catches a module that runs too early.
- **Imported variables are read-only.** A `let` can only be reassigned in the module that declares it; other modules
  call a small function the owner exports (for example `cancelPendingArm()` or `resetChartMarks()`).
- **The build doesn't remove code** (tree-shaking is off), so debug switches like `SITE_SIM` and the `__VC_TEST__`
  hooks stay in the shipped script, as they always have.
- **The version lives in `package.json`.** The build writes it into the userscript header and into `VERSION`.

## Releasing

1. Bump `version` in `package.json` and add the notes to `CHANGELOG.md`.
2. `npm test`, then commit, including the regenerated `src/vest-copier.user.js`.
3. Create the GitHub release and attach `dist/vest-copier.user.js`.

`src/vest-copier.user.js` is generated: it holds only the userscript header, at the current version. Installs from
before v0.38 check that path for updates (their `@updateURL`), and then download the release build. Newer builds check
the latest release directly, so the file can be removed once old installs have updated.
