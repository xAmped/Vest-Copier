import { DEFAULT_SYMBOL } from './config.js';

// The copier's in-memory state (one shared object) and the per-symbol order rules.
export const S = {
  groups: [], // [{size,type,rows:[row]}]
  byId: {}, // id -> row
  master: null, // accountId
  followers: new Set(), // accountIds
  armed: false,
  log: [], // [{t,level,msg}]
  // masterPositionId -> { master, side, symbol, masterOrderId, qty, adopted?, queue (promise: actions run in order),
  //   legs: [{ id, kind:'tp'|'sl', price, qty }], followers: { accountId: { positionId, orderId, qty, legs } } }
  posMap: {},
  rate: { remaining: null, limit: null }, // last seen x-ratelimit-* headers (Vest allows 200 per window)
  ack: false, // user has read & agreed to the rules
  rulesOpen: false, // rules view is showing
  summaryOpen: false, // P&L summary view is showing
  levCache: {}, // "accountId|symbol" -> leverage known to be set (skip redundant PUT)
  fast: false, // fast mode: fire follower OPENS at master-send (before the master confirms)
  autoFlatten: false, // auto-close orphan followers if the master open is rejected
  orphan: null, // { list: [{ accountId, positionId, symbol, leverage }] } follower positions without the master
  arming: false, // an arm is in progress
  update: null, // { state, latest, dismissed } from the GitHub version check
  checkUpdates: true, // look for new versions on GitHub
  supportOffer: false, // the one-time "support with code AMPED" question is showing
  supportCurrent: null, // the code the account already uses, named in that question
  ackThenArm: false, // ARM was clicked before the terms were accepted
  supportOpen: false, // the Support tab is showing
  placing: false, // a trade-panel order is in flight
  flattening: false, // a flatten-all sweep is in progress
  capFit: false, // cap-to-fit: scale a follower's size down to what its margin can hold
  settingsOpen: false, // settings view is showing
  diag: [], // structured diagnostics (expected vs actual, margins, errors), downloadable as JSON
  siteOpen: false, // site-check view is showing
  site: null, // last site check: { fp, running, results:[{name,status,detail}] }
  tradeOpen: false, // trade panel view is showing
  trade: {
    // trade-panel settings (persisted, except live price)
    symbol: DEFAULT_SYMBOL,
    sizeMode: 'qty',
    qty: 1,
    risk: 50,
    stopPts: 20,
    targets: [20, 40, 60],
    scale: 'even',
    beMode: 'tp1',
    beTrigger: 15,
    beOffset: 0,
  },
  price: {}, // symbol -> { px, at } live price
};
// Per-symbol order rules, refreshed from /v3/exchangeInfo at load (NDX-USD-PERP: tick 0.25, 4 size decimals).
// Contracts are linear (notional = price × quantity), so P&L is $1 per point per contract.
export const SYMBOLS = { [DEFAULT_SYMBOL]: { label: 'NQ', tick: 0.25, step: 0.0001, pointValue: 1 } };
