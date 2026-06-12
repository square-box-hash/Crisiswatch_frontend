<script>
  import { searchQuery, filters } from '../../stores/index.js'

  const timeRanges = [
    { value: '24h', label: 'Last 24h' },
    { value: '7d',  label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
  ]

  let showTimeMenu = false
  let showRegionMenu = false

  $: currentRange = timeRanges.find(t => t.value === $filters.timeRange)?.label ?? 'Last 7 days'

  function setTimeRange(val) {
    filters.update(f => ({ ...f, timeRange: val }))
    showTimeMenu = false
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      showTimeMenu = false
      showRegionMenu = false
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<header class="topbar">

  <!-- Logo -->
  <a class="logo" href="/">
    <div class="logo-mark">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
        <circle cx="8" cy="8" r="5.5"/>
        <path d="M8 2.5v11M2.5 8h11"/>
        <ellipse cx="8" cy="8" rx="2.5" ry="5.5"/>
      </svg>
    </div>
    CrisisWatch
  </a>

  <!-- Search -->
  <div class="search-bar">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.4;flex-shrink:0">
      <circle cx="5" cy="5" r="3.5"/>
      <path d="M8 8l2.5 2.5"/>
    </svg>
    <input
      type="text"
      placeholder="Search region or disease…"
      bind:value={$searchQuery}
    />
    <span class="kbd">⌘K</span>
  </div>

  <!-- Region filter -->
  <div class="cw-pill" on:click={() => showRegionMenu = !showRegionMenu}>
    <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" style="width:13px;height:13px">
      <circle cx="6.5" cy="6.5" r="5.5"/>
      <path d="M1 6.5h11M6.5 1a9 6 0 010 11M6.5 1a9 6 0 000 11"/>
    </svg>
    All regions
    <span class="caret">▾</span>
  </div>

  <!-- Time range filter -->
  <div class="tb-dropdown-wrap">
    <div class="cw-pill" on:click={() => showTimeMenu = !showTimeMenu}>
      <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" style="width:13px;height:13px">
        <rect x="1.5" y="2" width="10" height="9" rx="1.5"/>
        <path d="M4 1v2.5M9 1v2.5M1.5 5.5h10"/>
      </svg>
      {currentRange}
      <span class="caret">▾</span>
    </div>

    {#if showTimeMenu}
      <div class="dropdown-menu" on:click|stopPropagation>
        {#each timeRanges as t}
          <div
            class="dropdown-item"
            class:active={$filters.timeRange === t.value}
            on:click={() => setTimeRange(t.value)}
          >
            {t.label}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Right side -->
  <div class="tb-right">
    <button class="how-btn">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="6.5" cy="6.5" r="5.5"/>
        <path d="M6.5 9V6.5M6.5 4.5v.2"/>
      </svg>
      How it works
      <span class="caret" style="margin-left:2px">▾</span>
    </button>

    <div class="avatar">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.5">
        <circle cx="7" cy="4.5" r="2.5"/>
        <path d="M1.5 12c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5"/>
      </svg>
    </div>
  </div>

</header>

<!-- Click outside to close menus -->
{#if showTimeMenu || showRegionMenu}
  <div class="overlay" on:click={() => { showTimeMenu = false; showRegionMenu = false }}> </div>
{/if}

<style>
  .topbar {
    height: var(--topbar-h);
    background: var(--bg1);
    border-bottom: 1px solid var(--b0);
    display: flex;
    align-items: center;
    padding: 0 14px;
    gap: 10px;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--t1);
    text-decoration: none;
    margin-right: 6px;
    white-space: nowrap;
  }
  .logo-mark {
    width: 28px; height: 28px;
    border: 1px solid var(--b2);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: var(--teal);
  }

  .search-bar {
    flex: 1;
    max-width: 300px;
    height: 32px;
    background: var(--bg2);
    border: 1px solid var(--b0);
    border-radius: 7px;
    display: flex; align-items: center;
    padding: 0 10px;
    gap: 7px;
    transition: border-color 0.15s;
  }
  .search-bar:focus-within { border-color: var(--b2); }
  .search-bar input {
    background: none; border: none; outline: none;
    color: var(--t2); font-family: var(--font-sans); font-size: 12px; flex: 1;
  }
  .search-bar input::placeholder { color: var(--t3); }

  .kbd {
    font-family: var(--font-mono);
    font-size: 10px; color: var(--t3);
    background: var(--bg3);
    border: 1px solid var(--b0);
    border-radius: 4px;
    padding: 1px 5px;
  }

  .caret { font-size: 9px; opacity: 0.35; }

  .tb-dropdown-wrap { position: relative; }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    background: var(--bg3);
    border: 1px solid var(--b1);
    border-radius: 9px;
    padding: 4px;
    min-width: 140px;
    z-index: 300;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .dropdown-item {
    padding: 7px 10px;
    border-radius: 6px;
    font-size: 12px;
    color: var(--t2);
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
  }
  .dropdown-item:hover { background: var(--bg4); color: var(--t1); }
  .dropdown-item.active { color: var(--t1); background: var(--bg4); }

  .tb-right {
    margin-left: auto;
    display: flex; align-items: center; gap: 8px;
  }

  .how-btn {
    height: 32px;
    background: transparent;
    border: 1px solid var(--b1);
    border-radius: 7px;
    display: flex; align-items: center; gap: 6px;
    padding: 0 11px;
    color: var(--t2); cursor: pointer;
    font-size: 12px; font-family: var(--font-sans);
    transition: border-color 0.15s, color 0.15s;
  }
  .how-btn:hover { border-color: var(--b2); color: var(--t1); }

  .avatar {
    width: 30px; height: 30px;
    background: var(--bg3);
    border: 1px solid var(--b1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .avatar:hover { border-color: var(--b2); }

  .overlay {
    position: fixed; inset: 0; z-index: 150;
  }
</style>