// Formatting for the panel's HTML.
export const money = (n) =>
  isNaN(n) ? '—' : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pct = (n) => (isNaN(n) ? '—' : (n * 100).toFixed(0) + '%');
export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const acctNum = (label) => (String(label).match(/(\d+)\s*$/) || ['', '--'])[1]; // "Account 07" → "07"
