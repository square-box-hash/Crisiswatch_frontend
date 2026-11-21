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

// Server-side counts (GET /stats)
export const stats = writable(null)

// ── UI state ──────────────────────────────────────────────
export const activeSidebarTab = writable('map')

// Filter state
export const filters = writable({
  region: 'all',      // 'all' or a country name from the data
  timeRange: '7d',    // '24h' | '7d' | '30d' | '90d'
  severity: 'all',    // 'all' | 'critical' | 'high' | 'moderate' | 'low'
})

// Search query
export const searchQuery = writable('')

// ── Derived stores ────────────────────────────────────────

// Countries present in the current data — powers the region menu.
export const countries = derived(outbreaks, $outbreaks =>
  [...new Set($outbreaks.map(o => o.country).filter(Boolean))].sort()
)

// Outbreaks filtered by search + severity + region.
export const filteredOutbreaks = derived(
  [outbreaks, filters, searchQuery],
  ([$outbreaks, $filters, $search]) => {
    const needle = ($search || '').trim().toLowerCase()

    return $outbreaks.filter(o => {
      if ($filters.severity !== 'all' && o.severity !== $filters.severity) {
        return false
      }
      if ($filters.region !== 'all' && o.country !== $filters.region) {
        return false
      }
      if (!needle) return true

      const haystack = [o.disease, o.country, ...(o.neighboring_mentions || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(needle)
    })
  }
)

// Count by severity (for sidebar badges) — same vocabulary as the API.
export const severityCounts = derived(outbreaks, $outbreaks => {
  const counts = { critical: 0, high: 0, moderate: 0, low: 0, total: $outbreaks.length }

  for (const o of $outbreaks) {
    const key = String(o.severity || '').toLowerCase()
    if (key in counts) counts[key] += 1
  }

  return counts
})
