import { S } from '../state.js';

// STRATUH theme for Vest (optional). Vest colours its whole page from CSS variables on its dark theme (`.dark`):
// the copier sets them to STRATUH's tokens with one stylesheet, scoped to a class on <html>, so switching it off is
// instant. Vest paints the chart separately, through TradingView: the copier applies STRATUH's chart colours the same
// way (the chart frame's applyOverrides plus its --tv-color variables), once per chart load and after Vest re-applies
// its own (it does on load and on a theme change). Only colours change; nothing is sent to Vest.
const STRATUH = {
  bg: '#0c0c0d',
  raised: '#141416',
  raised2: '#1a1a1d',
  hover: '#1e1e22',
  active: '#26262b',
  line: 'rgba(255, 255, 255, 0.09)',
  line2: 'rgba(255, 255, 255, 0.18)',
  text: '#f0f0f1',
  muted: '#a1a1a8',
  dim: '#66666e',
  lime: '#c8f542',
  limeHi: '#e4ff7a',
  red: '#ff5a4f',
  amber: '#f5b942',
  blue: '#7ab8ff',
  grey: '#8a8a94',
};
function themeCss(down) {
  const T = STRATUH,
    red = down === 'red';
  const short = red ? T.red : T.grey,
    shortMuted = red ? 'rgba(255, 90, 79, 0.14)' : 'rgba(138, 138, 148, 0.16)';
  return `html.vc-stratuh.dark, html.vc-stratuh .dark {
      --primary: ${T.lime}; --primary-foreground: ${T.bg}; --primary-light: rgba(200, 245, 66, 0.1);
      --background: ${T.bg}; --foreground: ${T.text}; --foreground-secondary: ${T.muted}; --contrast: #ffffff;
      --secondary: ${T.raised2}; --secondary-foreground: ${T.text};
      --muted: ${T.raised2}; --muted-foreground: ${T.muted};
      --accent: ${T.raised2}; --accent-foreground: ${T.text};
      --card: ${T.raised}; --card-foreground: ${T.text}; --card-elevated: ${T.raised2};
      --popover: ${T.raised}; --popover-foreground: ${T.text};
      --destructive: ${T.red}; --destructive-foreground: ${T.bg};
      --input: ${T.raised}; --ring: ${T.lime}; --border: ${T.line}; --border-muted: rgba(255, 255, 255, 0.06);
      --long: ${T.lime}; --long-foreground: ${T.bg}; --long-muted: rgba(200, 245, 66, 0.14);
      --short: ${short}; --short-foreground: ${T.bg}; --short-muted: ${shortMuted};
      --warning: ${T.amber}; --info: ${T.blue}; --highlight: ${T.limeHi}; --yellow: ${T.limeHi};
      --surface: ${T.raised2}; --surface-foreground: ${T.text}; --surface-muted: ${T.dim}; --surface-hover: ${T.hover};
      --surface-active: ${T.active}; --surface-elevated: ${T.raised}; --surface-overlay: ${T.text};
      --chart-1: ${T.text}; --chart-2: ${T.lime}; --chart-3: ${T.grey}; --chart-4: ${T.limeHi}; --chart-5: ${T.dim};
      --radius: 0px; --radius-xs: 0px; --radius-sm: 0px; --radius-md: 0px; --radius-lg: 0px; --radius-xl: 0px;
      --radius-2xl: 0px; --radius-3xl: 0px;
    }
    html.vc-stratuh.dark ::selection { background: rgba(200, 245, 66, 0.25); }`;
}
// The chart: STRATUH's DeepCharts look, whatever the shorts colour: light and dark grey candles, onyx pane, faint grid.
const THEME_UP = '#b4b4ba',
  THEME_DOWN = '#55555c',
  THEME_VOL_UP = '#4a4a52',
  THEME_VOL_DOWN = '#2c2c31';
function themeChartOverrides() {
  const T = STRATUH,
    up = THEME_UP,
    dn = THEME_DOWN;
  const o = {
    'paneProperties.backgroundType': 'solid',
    'paneProperties.background': T.bg,
    'paneProperties.backgroundGradientStartColor': T.bg,
    'paneProperties.backgroundGradientEndColor': T.bg,
    'paneProperties.vertGridProperties.color': '#17171a',
    'paneProperties.horzGridProperties.color': '#17171a',
    'scalesProperties.lineColor': T.active,
    'scalesProperties.textColor': T.muted,
    'mainSeriesProperties.lineStyle.color': T.text,
    'mainSeriesProperties.areaStyle.linecolor': T.lime,
    'mainSeriesProperties.areaStyle.color1': 'rgba(200, 245, 66, 0.28)',
    'mainSeriesProperties.areaStyle.color2': 'rgba(200, 245, 66, 0)',
  };
  for (const k of ['candleStyle', 'hollowCandleStyle', 'haStyle']) {
    Object.assign(o, {
      [`mainSeriesProperties.${k}.upColor`]: up,
      [`mainSeriesProperties.${k}.downColor`]: dn,
      [`mainSeriesProperties.${k}.borderUpColor`]: up,
      [`mainSeriesProperties.${k}.borderDownColor`]: dn,
      [`mainSeriesProperties.${k}.wickUpColor`]: up,
      [`mainSeriesProperties.${k}.wickDownColor`]: dn,
    });
  }
  o['mainSeriesProperties.barStyle.upColor'] = up;
  o['mainSeriesProperties.barStyle.downColor'] = dn;
  return o;
}
// Vest's own dark chart colours, put back when the theme is switched off.
const VEST_CHART = {
  'paneProperties.background': '#0F0F0F',
  'paneProperties.backgroundGradientStartColor': '#0F0F0F',
  'paneProperties.backgroundGradientEndColor': '#0F0F0F',
  'paneProperties.vertGridProperties.color': '#292929',
  'paneProperties.horzGridProperties.color': '#292929',
  'scalesProperties.lineColor': '#292929',
  'scalesProperties.textColor': '#F2F2F2',
  'mainSeriesProperties.candleStyle.upColor': '#00D98E',
  'mainSeriesProperties.candleStyle.downColor': '#E03737',
  'mainSeriesProperties.candleStyle.borderUpColor': '#00D98E',
  'mainSeriesProperties.candleStyle.borderDownColor': '#E03737',
  'mainSeriesProperties.candleStyle.wickUpColor': '#00D98E',
  'mainSeriesProperties.candleStyle.wickDownColor': '#E03737',
};
const themeTvCss = () => {
  const T = STRATUH;
  const vars = {
    '--tv-color-platform-background': T.bg,
    '--tv-color-pane-background': T.bg,
    '--tv-color-popup-background': T.raised,
    '--tv-color-popup-element-background-active': T.active,
    '--themed-color-drawer-backdrop': T.bg,
    '--themed-color-pane-bg': T.bg,
    '--themed-color-selection-bg': T.bg,
    '--themed-color-text': T.text,
    '--themed-color-background': T.raised,
  };
  return `:root, body { ${Object.entries(vars)
    .map(([k, v]) => `${k}: ${v} !important;`)
    .join(' ')} }`;
};
export function applyTheme() {
  try {
    const html = document.documentElement;
    let st = document.getElementById('vc-theme');
    if (S.theme) {
      if (!st) {
        st = document.createElement('style');
        st.id = 'vc-theme';
        (document.head || html).appendChild(st);
      }
      const css = themeCss(S.themeDown);
      if (st.textContent !== css) st.textContent = css;
    }
    html.classList.toggle('vc-stratuh', !!S.theme);
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
let _chartThemeTimers = []; // the chart follows on the next check after any change
// The volume bars (Vest adds TradingView's Volume indicator): grey with the theme, Vest's green and red without.
function themeVolume(f, on) {
  const colors = on ? [THEME_VOL_DOWN, THEME_VOL_UP] : ['#E03737', '#00D98E'];
  try {
    const chart = f.contentWindow.tradingViewApi.activeChart();
    for (const st of chart.getAllStudies() || [])
      if (st && st.name === 'Volume')
        chart.getStudyById(st.id).applyOverrides({ 'volume.color.0': colors[0], 'volume.color.1': colors[1] });
  } catch {
    /* best effort: nothing to do if this fails */
  }
}
export function themeChart(f) {
  if (!f) return;
  const dark = document.documentElement.classList.contains('dark') || !!document.querySelector('body.dark, #root.dark');
  const key = [S.theme ? 'on' : 'off', dark].join('|'); // the shorts colour doesn't touch the chart
  if (f.__vcThemeKey === key) return;
  let ready = false;
  try {
    const chart = f.contentWindow.tradingViewApi.activeChart();
    ready =
      typeof chart.getCheckableActionState === 'function' && chart.getCheckableActionState('hideAllMarks') != null;
  } catch {
    /* not ready yet */
  }
  if (!ready || typeof f.contentWindow.applyOverrides !== 'function') return; // tried again on the next check
  if (!S.theme && !f.__vcThemeKey) {
    f.__vcThemeKey = key; // never themed: Vest's colours are already there
    return;
  }
  f.__vcThemeKey = key;
  const paint = () => {
    try {
      const doc = f.contentDocument;
      let st = doc.getElementById('vc-theme');
      if (S.theme && dark) {
        if (!st) {
          st = doc.createElement('style');
          st.id = 'vc-theme';
          (doc.head || doc.documentElement).appendChild(st);
        }
        st.textContent = themeTvCss();
        f.contentWindow.applyOverrides(themeChartOverrides());
        themeVolume(f, true);
      } else {
        if (st) st.remove();
        if (dark) {
          f.contentWindow.applyOverrides(VEST_CHART);
          themeVolume(f, false);
        }
      }
    } catch {
      /* best effort: nothing to do if this fails */
    }
  };
  // now, and again shortly after: Vest applies its own colours when the chart becomes ready and on a theme change
  _chartThemeTimers.forEach(clearTimeout);
  paint();
  _chartThemeTimers = [setTimeout(paint, 1500), setTimeout(paint, 4000)];
}
