<script>
  import { onMount, onDestroy } from 'svelte'
  import Header       from './lib/components/layout/Header.svelte'
  import Sidebar      from './lib/components/layout/Sidebar.svelte'
  import MapView      from './lib/components/map/MapView.svelte'
  import OutbreakFeed from './lib/components/outbreaks/OutbreakFeed.svelte'
  import DetailsPanel from './lib/components/details/DetailsPanel.svelte'

  import { outbreaks, feedStatus, filters, selectedOutbreak } from './lib/stores/index.js'
  import { fetchOutbreaks, normaliseOutbreak } from './lib/services/api.js'

  const REFRESH_MS = 60_000

  let lastRange = ''
  let timer

  const RANGE_DAYS = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 }

  onMount(() => {
    load($filters.timeRange)
    timer = setInterval(() => load($filters.timeRange, { force: true }), REFRESH_MS)
    return () => clearInterval(timer)
  })

  onDestroy(() => clearInterval(timer))

  // Refetch when the time range changes (region and severity filter client-side).
  $: if ($filters.timeRange) load($filters.timeRange)

  async function load(timeRange = '7d', { force = false } = {}) {
    if (!force && timeRange === lastRange) return
    lastRange = timeRange

    feedStatus.set({ loading: true, error: null })

    try {
      const days = RANGE_DAYS[timeRange] ?? 7
      const raw = await fetchOutbreaks({ days, limit: 100 })
      const data = Array.isArray(raw) ? raw : raw.outbreaks ?? raw.data ?? []

      outbreaks.set(data.map(normaliseOutbreak))
      feedStatus.set({ loading: false, error: null })
    } catch (err) {
      feedStatus.set({
        loading: false,
        error: err.message ?? 'Failed to load outbreaks',
      })
    }
  }
</script>

<div class="app">
  <Header />

  <div class="body">
    <Sidebar />

    <main class="main">
      <MapView />
      <OutbreakFeed />
      {#if $selectedOutbreak}
        <DetailsPanel />
      {/if}
    </main>
  </div>
</div>

<style>
  :global(body) { overflow: hidden; }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg0);
  }

  .body {
    display: flex;
    flex: 1;
    overflow: hidden;
    padding-top: var(--topbar-h);
    padding-left: var(--sidebar-w);
  }

  .main {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-width: 0;
  }
</style>
