<script>
  import { filteredOutbreaks, selectedOutbreak, feedStatus } from '../../stores/index.js'

  function selectOutbreak(o) {
    selectedOutbreak.set(o)
  }

  function severityClass(level = '') {
    const map = {
      critical: 'alert', high: 'advisory', moderate: 'advisory', low: 'monitoring',
      // pass-through for APIs that already send the final labels
      alert: 'alert', advisory: 'advisory', monitoring: 'monitoring',
    }
    return map[level.toLowerCase()] ?? 'monitoring'
  }

  function formatTrend(pct, dir) {
    const abs = Math.abs(pct)
    return dir === 'up' ? `↑ ${abs}%` : `↓ ${abs}%`
  }

  function formatTime(iso) {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      })
    } catch { return '' }
  }

  // Format cases nicely: 7200000 → 7.2M, 5940 → 5.9K
  function formatCases(n) {
    if (!n) return '0'
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
    return String(n)
  }
</script>

<aside class="feed-panel">

  <!-- Header -->
  <div class="feed-header">
    <span class="feed-title">Active Outbreaks</span>
    <button class="view-all">View all</button>
  </div>

  <!-- List -->
  <div class="feed-list">

    {#if $feedStatus.loading}
      {#each Array(4) as _}
        <div class="skeleton-card">
          <div class="skeleton" style="width:60px;height:10px;margin-bottom:8px"></div>
          <div class="skeleton" style="width:140px;height:20px;margin-bottom:6px"></div>
          <div class="skeleton" style="width:100px;height:10px;margin-bottom:14px"></div>
          <div class="skeleton" style="width:100%;height:1px"></div>
        </div>
      {/each}

    {:else if $feedStatus.error}
      <div class="feed-error">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.5">
          <circle cx="8" cy="8" r="6.5"/>
          <path d="M8 5v3.5M8 11v.2"/>
        </svg>
        {$feedStatus.error}
      </div>

    {:else if $filteredOutbreaks.length === 0}
      <div class="feed-empty">No outbreaks match your filters.</div>

    {:else}
      {#each $filteredOutbreaks as o (o.id)}
        <div
          class="outbreak-card"
          class:active={$selectedOutbreak?.id === o.id && severityClass(o.severity) === 'alert'}
          class:active-advisory={$selectedOutbreak?.id === o.id && severityClass(o.severity) === 'advisory'}
          class:active-monitoring={$selectedOutbreak?.id === o.id && severityClass(o.severity) === 'monitoring'}
          on:click={() => selectOutbreak(o)}
        >
          <!-- Top row -->
          <div class="card-top">
            <span class="status-badge {severityClass(o.severity)}">
              <span class="status-dot"></span>
              {o.severity ?? 'unknown'}
            </span>
            <span class="card-arrow">›</span>
          </div>

          <!-- Disease name — big editorial serif -->
          <div class="disease-name">{o.disease ?? 'Unknown'}</div>

          <!-- Location — just country, no duplicate -->
          <div class="card-loc">{o.country || o.region || '—'}</div>

          <!-- Stats -->
          <div class="card-stats">
            <span class="card-count">{formatCases(o.cases)} cases</span>
            <span class="trend {o.trendDir}">
              {formatTrend(o.trendPct, o.trendDir)}
            </span>
          </div>
        </div>
      {/each}
    {/if}

  </div>

  <!-- Footer -->
  <div class="feed-footer">
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="5.5" cy="5.5" r="4.5"/>
      <path d="M5.5 7.5V5.5M5.5 3.5v.2"/>
    </svg>
    Updated {formatTime(new Date().toISOString())}
    <button class="refresh-btn" title="Refresh">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M8 2A4.5 4.5 0 112 5"/>
        <path d="M1 3.5l1 1.5 1.5-1"/>
      </svg>
    </button>
  </div>

</aside>

<style>
  .feed-panel {
    width: 320px;
    min-width: 320px;
    background: var(--bg1);
    border-left: 1px solid var(--b0);
    border-right: 1px solid var(--b0);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
  }

  .feed-header {
    padding: 14px 14px 12px;
    border-bottom: 1px solid var(--b0);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .feed-title { font-size: 13px; font-weight: 500; color: var(--t1); }
  .view-all {
    font-size: 11px; color: var(--t2);
    background: var(--bg3); border: 1px solid var(--b0); border-radius: 6px;
    padding: 3px 8px; cursor: pointer; font-family: var(--font-sans);
    transition: border-color 0.15s;
  }
  .view-all:hover { border-color: var(--b1); }

  .feed-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* ── Outbreak card ── */
  .outbreak-card {
    background: var(--bg2);
    border: 1px solid var(--b0);
    border-radius: 10px;
    padding: 14px 16px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    flex-shrink: 0;       /* prevents card from collapsing in flex list */
    min-height: 0;
  }
  .outbreak-card:hover {
    border-color: var(--b1);
    background: var(--bg3);
  }
  .outbreak-card.active            { border-color: var(--red);  background: var(--bg3); }
  .outbreak-card.active-advisory   { border-color: #f59e0b;     background: var(--bg3); }
  .outbreak-card.active-monitoring { border-color: var(--b1);   background: var(--bg3); }

  /* Card internals */
  .card-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px;
  }
  .card-arrow { color: var(--t3); font-size: 15px; }

  /* Disease name — big editorial serif, matches detail panel heading */
  .disease-name {
    font-family: var(--font-serif), 'Playfair Display', Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--t1);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-loc {
    font-size: 11px;
    color: var(--t2);
    margin-bottom: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-stats {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid var(--b0); padding-top: 9px;
  }
  .card-count { font-size: 11px; color: var(--t3); }
  .trend { font-size: 11px; font-weight: 500; }
  .trend.up   { color: var(--red); }
  .trend.down { color: var(--green); }

  /* Status badge */
  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 3px 7px; border-radius: 20px;
  }
  .status-dot {
    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  }

  .status-badge.alert      { background: rgba(208,78,78,0.12);  color: var(--red); }
  .status-badge.alert      .status-dot { background: var(--red); }

  .status-badge.advisory   { background: rgba(192,122,16,0.12); color: var(--amber); }
  .status-badge.advisory   .status-dot { background: var(--amber); }

  /* monitoring — switched from indigo to green, matches map legend */
  .status-badge.monitoring { background: rgba(58,150,96,0.12);  color: var(--green); }
  .status-badge.monitoring .status-dot { background: var(--green); }

  /* Skeleton */
  .skeleton-card {
    background: var(--bg2);
    border: 1px solid var(--b0);
    border-radius: 10px;
    padding: 13px;
  }
  .skeleton {
    background: var(--b0);
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  /* Empty / error */
  .feed-error, .feed-empty {
    padding: 20px 12px;
    font-size: 12px;
    color: var(--t3);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  /* Footer */
  .feed-footer {
    padding: 10px 14px;
    border-top: 1px solid var(--b0);
    display: flex; align-items: center; gap: 6px;
    color: var(--t3); font-size: 11px;
    flex-shrink: 0;
  }
  .refresh-btn {
    margin-left: 2px;
    background: none; border: none; cursor: pointer;
    color: var(--t3); display: flex; align-items: center;
    padding: 2px; border-radius: 4px;
    transition: color 0.15s;
  }
  .refresh-btn:hover { color: var(--t2); }
</style>