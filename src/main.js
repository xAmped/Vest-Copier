// Entry point. The build wraps everything in one function that returns early if the copier is already running on this
// page, so the hooks below are installed exactly once.
import { boot } from './boot.js';
import { openTabChannel } from './copier/arming.js';
import { watchForInstallReturn } from './features/updates.js';
import { startFollowingVestMarket } from './market/vest-market.js';
import { watchChartPopups } from './ui/chart-tweaks.js';
import { watchPlacement } from './ui/dock.js';
import { installFeedTap } from './vest/account-feed.js';
import { installRequestHooks } from './vest/request-hooks.js';

// At document-start, before Vest's own code runs: the request and socket hooks first, then the background watchers.
installRequestHooks();
installFeedTap();
startFollowingVestMarket();
openTabChannel();
watchForInstallReturn();
watchChartPopups();
watchPlacement();
if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', boot);
else boot();
