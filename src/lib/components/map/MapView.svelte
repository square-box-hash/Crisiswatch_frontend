<script>
  import { onMount, onDestroy } from 'svelte'
  import { filteredOutbreaks, selectedOutbreak } from '../../stores/index.js'
  import { TILE_URL, TILE_OPTIONS, MAP_CENTER, MAP_ZOOM, colors, getSeverity } from '../../styles/theme.js'

  let mapEl
  let map
  let L
  let markers = []
  let circles = []

  onMount(async () => {
    // Dynamically import Leaflet (it needs window)
    L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')

    map = L.map(mapEl, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: false,
      attributionControl: false,
    })

    // Dark tile layer
    L.tileLayer(TILE_URL, TILE_OPTIONS).addTo(map)

    // Custom zoom control bottom-right
    L.control.zoom({ position: 'topright' }).addTo(map)

    // Initial render
    renderMarkers($filteredOutbreaks)
  })

  onDestroy(() => {
    map?.remove()
  })

  // Re-render when outbreaks change
  $: if (map && L) renderMarkers($filteredOutbreaks)

  // Pan to selected outbreak
  $: if (map && $selectedOutbreak?.lat && $selectedOutbreak?.lng) {
    map.flyTo([$selectedOutbreak.lat, $selectedOutbreak.lng], 8, { duration: 1 })
  }

  function renderMarkers(outbreaks) {
    if (!map || !L) return

    // Clear existing
    markers.forEach(m => m.remove())
    circles.forEach(c => c.remove())
    markers = []
    circles = []

    outbreaks.forEach(o => {
      if (!o.lat || !o.lng) return

      const s = getSeverity(o.severity)
      const isSelected = $selectedOutbreak?.id === o.id

      // Outer glow circle
      const glow = L.circle([o.lat, o.lng], {
        radius: o.cases * 120,
        color: s.color,
        fillColor: s.color,
        fillOpacity: 0.08,
        weight: 0,
      }).addTo(map)
      circles.push(glow)

      // Mid ring
      const ring = L.circle([o.lat, o.lng], {
        radius: o.cases * 60,
        color: s.color,
        fillColor: s.color,
        fillOpacity: 0.14,
        weight: 1,
        opacity: 0.35,
      }).addTo(map)
      circles.push(ring)

      // Custom div marker (numbered bubble)
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:${isSelected ? 38 : 32}px;
            height:${isSelected ? 38 : 32}px;
            border-radius:50%;
            background:${s.color}cc;
            border:1.5px solid ${s.color};
            display:flex;align-items:center;justify-content:center;
            font-family:Inter,sans-serif;
            font-size:${o.cases > 99 ? 10 : 11}px;
            font-weight:600;
            color:#f5f5f0;
            box-shadow:0 0 12px ${s.color}66;
            cursor:pointer;
            transition:transform 0.15s;
          ">
            ${o.cases > 999 ? Math.round(o.cases/1000)+'k' : o.cases}
          </div>`,
        iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
        iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16],
      })

      const marker = L.marker([o.lat, o.lng], { icon })
        .addTo(map)
        .on('click', () => selectedOutbreak.set(o))

      markers.push(marker)
    })
  }

  function recenter() {
    map?.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 1 })
  }
</script>

<div class="map-wrap">
  <div bind:this={mapEl} class="map-el"></div>

  <!-- Re-center button -->
  <button class="recenter-btn" on:click={recenter}>
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="5.5" cy="5.5" r="2"/>
      <path d="M5.5 1v2M5.5 8v2M1 5.5h2M8 5.5h2"/>
    </svg>
    Re-center
  </button>

  <!-- Legend -->
  <div class="legend">
    <div class="leg-item"><span class="leg-dot" style="background:var(--green)"></span>Monitoring</div>
    <div class="leg-item"><span class="leg-dot" style="background:var(--amber)"></span>Advisory</div>
    <div class="leg-item"><span class="leg-dot" style="background:var(--red)"></span>Alert</div>
  </div>
</div>

<style>
  .map-wrap {
    flex: 1;
    position: relative;
    background: var(--bg0);
    overflow: hidden;
    min-width: 0;
  }
  .map-el {
    width: 100%; height: 100%;
    background: var(--bg0);
  }

  .recenter-btn {
    position: absolute;
    bottom: 52px; left: 50%;
    transform: translateX(-50%);
    background: var(--bg2);
    border: 1px solid var(--b1);
    border-radius: 20px;
    padding: 7px 14px;
    display: flex; align-items: center; gap: 6px;
    color: var(--t2); cursor: pointer;
    font-size: 12px; font-family: var(--font-sans);
    transition: border-color 0.15s, color 0.15s;
    z-index: 10;
  }
  .recenter-btn:hover { border-color: var(--b2); color: var(--t1); }

  .legend {
    position: absolute;
    bottom: 18px; left: 18px;
    display: flex; flex-direction: column; gap: 5px;
    z-index: 10;
  }
  .leg-item {
    display: flex; align-items: center; gap: 7px;
    font-size: 11px; color: var(--t2);
  }
  .leg-dot {
    width: 7px; height: 7px;
    border-radius: 50%; flex-shrink: 0;
  }
</style>