<script>
  import { activeSidebarTab, severityCounts } from '../../stores/index.js'

  const tabs = [
    {
      id: 'map',
      label: 'Map',
      icon: `<circle cx="8.5" cy="8.5" r="7"/><path d="M1.5 8.5h14M8.5 1.5a11 7 0 010 14M8.5 1.5a11 7 0 000 14"/>`,
    },
    {
      id: 'globe',
      label: 'Regions',
      icon: `<circle cx="8.5" cy="8.5" r="6.5"/><path d="M4 8.5h9M6 5l-2 3.5 2 3.5M11 5l2 3.5-2 3.5"/>`,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: `<polyline points="2,14 5.5,9 8.5,11 12,5.5 15,7.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: `<path d="M8.5 2a4.5 4.5 0 014.5 4.5c0 3.5-4.5 9-4.5 9S4 10 4 6.5A4.5 4.5 0 018.5 2z"/><circle cx="8.5" cy="6.5" r="1.5"/>`,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: `<rect x="2.5" y="3" width="12" height="11" rx="2"/><path d="M5 8h7M5 11h4.5"/>`,
    },
  ]
</script>

<aside class="sidebar">

  <!-- Nav tabs -->
  {#each tabs as tab}
    <button
      class="sbi"
      class:on={$activeSidebarTab === tab.id}
      title={tab.label}
      on:click={() => activeSidebarTab.set(tab.id)}
    >
      <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" stroke-width="1.5">
        {@html tab.icon}
      </svg>

      <!-- Alert badge dot for alerts tab -->
      {#if tab.id === 'alerts' && $severityCounts.alert > 0}
        <span class="badge-dot"></span>
      {/if}
    </button>
  {/each}

  <div class="sb-gap"></div>

  <!-- Settings -->
  <button class="sbi" title="Settings">
    <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="8.5" cy="8.5" r="2.5"/>
      <path d="M8.5 1.5v2M8.5 13.5v2M1.5 8.5h2M13.5 8.5h2M3.6 3.6l1.4 1.4M12 12l1.4 1.4M3.6 13.4l1.4-1.4M12 5l1.4-1.4"/>
    </svg>
  </button>

  <!-- Theme toggle -->
  <button class="sbi" title="Theme">
    <svg viewBox="0 0 17 17" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="8.5" cy="8.5" r="2"/>
      <path d="M8.5 2v2.5M8.5 12.5V15M2 8.5h2.5M12.5 8.5H15M4.1 4.1l1.8 1.8M11.1 11.1l1.8 1.8M13.9 4.1l-1.8 1.8M5.9 11.1l-1.8 1.8"/>
    </svg>
  </button>

</aside>

<style>
  .sidebar {
    width: var(--sidebar-w);
    background: var(--bg1);
    border-right: 1px solid var(--b0);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    gap: 2px;
    flex-shrink: 0;
    position: fixed;
    top: var(--topbar-h);
    left: 0;
    bottom: 0;
    z-index: 100;
  }

  .sbi {
    position: relative;
    width: 38px; height: 38px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: var(--t3);
    background: transparent;
    border: 1px solid transparent;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
  }
  .sbi:hover { color: var(--t2); background: var(--bg3); }
  .sbi.on   {
    color: var(--t1);
    background: var(--bg3);
    border-color: var(--b1);
  }
  .sbi svg { width: 17px; height: 17px; }

  .badge-dot {
    position: absolute;
    top: 6px; right: 6px;
    width: 6px; height: 6px;
    background: var(--red);
    border-radius: 50%;
    border: 1.5px solid var(--bg1);
  }

  .sb-gap { flex: 1; }
</style>