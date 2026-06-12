<script>
  import { onMount } from 'svelte'
  import Header       from './lib/components/layout/Header.svelte'
  import Sidebar      from './lib/components/layout/Sidebar.svelte'
  import MapView      from './lib/components/map/MapView.svelte'
  import OutbreakFeed from './lib/components/outbreaks/OutbreakFeed.svelte'
  import DetailsPanel from './lib/components/details/DetailsPanel.svelte'

  import { outbreaks, feedStatus, filters, selectedOutbreak } from './lib/stores/index.js'
  import { fetchOutbreaks, normaliseOutbreak } from './lib/services/api.js'

  // Fetch outbreaks on mount and when filters change
  onMount(() => {
    loadOutbreaks()
  })

  $: loadOutbreaks($filters.timeRange, $filters.region)

  let lastFetch = ''
  async function loadOutbreaks(timeRange = '7d', region = 'all') {
    // Deduplicate — don't re-fetch if key hasn't changed
    const key = `${timeRange}-${region}`
    if (key === lastFetch) return
    lastFetch = key

    feedStatus.set({ loading: true, error: null })
    try {
      const days = timeRange === '24h' ? 1
                 : timeRange === '7d'  ? 7
                 : timeRange === '30d' ? 30 : 90

      const raw = await fetchOutbreaks({
        days,
        region: region === 'all' ? null : region,
      })

      // Normalise array
      const data = Array.isArray(raw) ? raw : raw.outbreaks ?? raw.data ?? []
      console.log('RAW API RESPONSE:', raw)
      console.log('NORMALIZED DATA:', data)
      outbreaks.set(data.map(normaliseOutbreak))
      console.log('OUTBREAK COUNT:', data.length)
      feedStatus.set({ loading: false, error: null })
    } catch (err) {
      feedStatus.set({ loading: false, error: err.message ?? 'Failed to load outbreaks' })
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