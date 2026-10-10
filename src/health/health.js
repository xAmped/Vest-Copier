// Which Vest build is loaded, and the health line at the top of the panel.
// A short id for the Vest web app build that is loaded. When it changes, Vest has shipped an update and arming waits
// for a site check. An unidentifiable build also needs one check per session.
const fnv = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
};
export const fingerprint = () => {
  try {
    const b = window.__NEXT_DATA__ && window.__NEXT_DATA__.buildId;
    if (b) return b.slice(0, 10);
  } catch {
    /* best effort: nothing to do if this fails */
  }
  try {
    for (const s of document.scripts) {
      const m = (s.src || '').match(/\/index-([A-Za-z0-9_-]{6,})\.js(?:$|\?)/);
      if (m) return m[1];
    }
  } catch {
    /* best effort: nothing to do if this fails */
  }
  try {
    for (const s of document.scripts) {
      const d = (s.src || '').match(/[?&]dpl=(?:dpl_)?([A-Za-z0-9]{6,})/);
      if (d) return d[1].slice(0, 12);
    }
  } catch {
    /* best effort: nothing to do if this fails */
  }
  try {
    const sameHost = (s) => {
      try {
        const u = new URL(s);
        return u.host === location.host && /\/(index|runtime|main|app|framework|vendor)[-.]/.test(u.pathname);
      } catch {
        return false;
      }
    };
    const a = [...document.scripts]
      .map((s) => s.src)
      .filter(Boolean)
      .filter(sameHost)
      .map((s) => new URL(s).pathname)
      .sort();
    if (a.length) return 'b:' + fnv(a.join('|'));
  } catch {
    /* best effort: nothing to do if this fails */
  }
  return null;
};
export const BUILD_KEY = 'vc-known-build-v3';
let _unknownBuildChecked = false;
export const markUnknownBuildChecked = () => (_unknownBuildChecked = true);
// First run on this browser: trust the build that is loaded now.
export function initBuild() {
  const fp = fingerprint();
  try {
    if (fp && !localStorage.getItem(BUILD_KEY)) localStorage.setItem(BUILD_KEY, fp);
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
export const healthState = () => {
  const fp = fingerprint();
  let last = null;
  try {
    last = localStorage.getItem(BUILD_KEY);
  } catch {
    /* best effort: nothing to do if this fails */
  }
  if (!fp)
    return _unknownBuildChecked
      ? { level: 'amber', text: 'build unknown (checked)', changed: false }
      : { level: 'amber', text: 'Unknown Vest build — checking…', changed: true };
  if (last && last !== fp) return { level: 'amber', text: 'Vest updated — checking…', changed: true };
  return { level: 'green', text: fp, changed: false };
};
