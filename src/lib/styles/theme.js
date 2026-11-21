// ============================================================
//  CrisisWatch — Theme Constants
//  Mirrors CSS custom properties for use in JS (Leaflet, etc.)
// ============================================================

export const colors = {
  // Obsidian blacks
  bg0: '#0b0b0d',
  bg1: '#101013',
  bg2: '#141417',
  bg3: '#1a1a1e',
  bg4: '#222228',

  // Text tiers
  t1: '#eceae4',
  t2: '#9896a0',
  t3: '#4e4e58',

  // Severity
  red:   '#d04e4e',
  amber: '#c07a10',
  green: '#3a9660',
  teal:  '#29b89a',

  // Borders
  b0: 'rgba(255,255,255,0.05)',
  b1: 'rgba(255,255,255,0.09)',
  b2: 'rgba(255,255,255,0.14)',
}

// The backend speaks exactly this vocabulary — low | moderate | high | critical.
// `band` is the only thing that maps to a CSS class, and it is defined here once.
export const severity = {
  critical: {
    color: colors.red,
    label: 'Critical',
    band:  'alert',
    dim:   'rgba(208,78,78,0.12)',
  },
  high: {
    color: colors.amber,
    label: 'High',
    band:  'advisory',
    dim:   'rgba(192,122,16,0.12)',
  },
  moderate: {
    color: colors.teal,
    label: 'Moderate',
    band:  'monitoring',
    dim:   'rgba(41,184,154,0.12)',
  },
  low: {
    color: colors.green,
    label: 'Low',
    band:  'monitoring',
    dim:   'rgba(58,150,96,0.12)',
  },
}

// Ordered worst-first, for legends and sorting.
export const SEVERITY_ORDER = ['critical', 'high', 'moderate', 'low']

// Returns severity config by string key (case-insensitive).
export function getSeverity(level = '') {
  const key = String(level).toLowerCase()
  return severity[key] ?? severity.low
}

// CSS class name: 'alert' | 'advisory' | 'monitoring'
export function severityBand(level = '') {
  return getSeverity(level).band
}

// Leaflet circle marker options per severity
export function getBubbleStyle(level = '') {
  const s = getSeverity(level)
  return {
    color:       s.color,
    fillColor:   s.color,
    fillOpacity: 0.25,
    weight:      1.5,
    opacity:     0.7,
  }
}

// Map tile URL — dark CartoDB tiles
export const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

export const TILE_OPTIONS = {
  attribution: '',
  subdomains:  'abcd',
  maxZoom:     19,
}

// Default map center (India)
export const MAP_CENTER  = [20.5937, 78.9629]
export const MAP_ZOOM    = 5

export const layout = {
  topbarHeight:  52,
  sidebarWidth:  58,
}
