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

export const severity = {
  alert:      { color: colors.red,   label: 'Alert',      dim: 'rgba(208,78,78,0.12)'    },
  advisory:   { color: colors.amber, label: 'Advisory',   dim: 'rgba(192,122,16,0.12)'   },
  monitoring: { color: colors.green, label: 'Monitoring', dim: 'rgba(58,150,96,0.12)'    },
}

// Returns severity config by string key (case-insensitive)
export function getSeverity(level = '') {
  return severity[level.toLowerCase()] ?? severity.monitoring
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