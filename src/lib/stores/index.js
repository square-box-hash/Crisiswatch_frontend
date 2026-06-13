// ============================================================
//  CrisisWatch — Svelte Stores
// ============================================================

import { writable, derived } from 'svelte/store'

// ── Outbreak data ─────────────────────────────────────────
// Full list fetched from FastAPI
export const outbreaks = writable([])

// Currently selected outbreak (for detail panel)
export const selectedOutbreak = writable(null)

// Loading / error state for the feed
export const feedStatus = writable({
  loading: false,
  error: null,
})

// ── UI state ──────────────────────────────────────────────
// Active sidebar tab: 'map' | 'analytics' | 'alerts' | 'reports'
export const activeSidebarTab = writable('map')

// Filter state
export const filters = writable({
  region: 'all',      // 'all' or region string
  timeRange: '7d',    // '24h' | '7d' | '30d' | '90d'
  severity: 'all',    // 'all' | 'alert' | 'advisory' | 'monitoring'
})

// Search query
export const searchQuery = writable('')

// ── Derived stores ────────────────────────────────────────
// Outbreaks filtered by current filters + search
export const filteredOutbreaks = derived(
  [outbreaks, filters, searchQuery],
  ([$outbreaks, $filters, $search]) => {

    console.log('OUTBREAKS:', $outbreaks)
    console.log('FILTERS:', $filters)

    return $outbreaks.map(o => ({
      ...o,
      trendPct: o.trendPct ?? 0,
      trendDir: o.trendDir ?? 'up',
      cases: o.cases ?? 0
    }))
  }
)

// Count by severity (for sidebar badges)
export const severityCounts = derived(outbreaks, $o => ({
  alert:      $o.filter(o => o.severity?.toLowerCase() === 'alert').length,
  advisory:   $o.filter(o => o.severity?.toLowerCase() === 'advisory').length,
  monitoring: $o.filter(o => o.severity?.toLowerCase() === 'monitoring').length,
  total:      $o.length,
}))