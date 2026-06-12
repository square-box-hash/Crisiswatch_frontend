<script>
  import { selectedOutbreak } from '../../stores/index.js'
  import { fetchSummary, fetchDoctorMessages } from '../../services/api.js'
  import { fetchOutbreak } from '../../services/api.js'

  let activeTab = 'ai'
  let summaryData = null
  let doctorData = null
  let loadingSummary = false
  let lastLoadedId = null
  
  $: if ($selectedOutbreak && $selectedOutbreak.id !== lastLoadedId) {
    lastLoadedId = $selectedOutbreak.id
    loadDetail($selectedOutbreak)
    activeTab = 'ai'
  }

  // Reload data when selected outbreak changes
  $: if ($selectedOutbreak) {
    loadDetail($selectedOutbreak)
    activeTab = 'ai'
  }

  async function loadDetail(o) {
  loadingSummary = true
  summaryData = null
  doctorData = null

  try {
    const full = await fetchOutbreak(o.id)

    const workerMsg = full.worker_messages?.[0]

    summaryData = {
      summary: full.ai_summary ?? o.ai_summary ?? o.summary,
      confidence: Math.round((full.confidence_score ?? o.confidence ?? 0.7) * 100),
      doctor_summary: full.ai_summary ?? o.ai_summary
    }

    doctorData = {
      ai_summary: full.ai_summary,
      message: workerMsg?.message ?? null,
      doctor: workerMsg ? {
        name: workerMsg.worker_name,
        initials: workerMsg.worker_name?.slice(0,2).toUpperCase(),
        verified: workerMsg.verified,
        role: workerMsg.credentials,
        timestamp: workerMsg.submitted_at ?? full.updated_at,
      } : null,
    }

  } catch(e) {
    console.error('loadDetail error', e)
  } finally {
    loadingSummary = false
  }
}
  function close() { selectedOutbreak.set(null) }

  function pillClass(severity = '') {
    const s = severity.toLowerCase()
    if (s === 'alert')      return 'alert-pill'
    if (s === 'advisory')   return 'alert-pill advisory-pill'
    return 'alert-pill monitoring-pill'
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      })
    } catch { return '' }
  }

  // Sparkline points from cases array or generate fake trend
  function sparkPoints(o) {
    if (o.trendData?.length) {
      const max = Math.max(...o.trendData)
      const min = Math.min(...o.trendData)
      const range = max - min || 1
      return o.trendData.map((v, i) => {
        const x = 4 + (i / (o.trendData.length - 1)) * 102
        const y = 40 - ((v - min) / range) * 34
        return `${x},${y}`
      }).join(' ')
    }
    // Fallback: fake upward trend
    return '4,38 16,33 26,36 36,28 46,30 56,22 66,24 76,16 86,13 104,6'
  }
</script>

{#if $selectedOutbreak}
  {@const o = $selectedOutbreak}
  <aside class="detail-panel fade-in">

    <!-- Header -->
    <div class="dp-head">
      <span class={pillClass(o.severity)}>{o.severity}</span>
      <button class="close-x" on:click={close}>×</button>
    </div>

    <!-- Scrollable body -->
    <div class="dp-body">

      <!-- Title -->
      <h1 class="dp-disease">{o.disease}</h1>
      <div class="dp-loc">{o.location}</div>
      <div class="dp-upd">Last updated: {formatDate(o.updatedAt)}</div>

      <!-- ── AI Situation Summary ── -->
      <div class="sec-box">
        <div class="cw-section-label">
          <svg viewBox="0 0 14 14" fill="none" stroke="var(--teal)" stroke-width="1.5" style="width:15px;height:15px;flex-shrink:0">
            <path d="M7 1l1.8 5H14l-4.2 3 1.6 5L7 11l-4.4 3 1.6-5L0 6h5.2z" stroke-linejoin="round"/>
          </svg>
          AI Situation Summary
        </div>

        {#if loadingSummary}
          <div class="skeleton" style="height:60px;border-radius:8px;margin-bottom:12px"></div>
        {:else}
        {
          console.log('SUMMARY DEBUG:',{
            summaryData,
            o_ai_summary: o.ai_summary,
            o_summary: o.summary,
            loadingSummary
          })
        }
          <div class="ai-box">
            {summaryData?.summary || o.ai_summary || o.summary || 'No Summary available yet.'}
            <div class="conf-row">
              <span class="conf-lbl">Model confidence</span>
              <div class="conf-bar">
                <div class="conf-fill" style="width:{summaryData?.confidence ?? o.confidence ?? 0}%"></div>
              </div>
              <span class="conf-pct">{summaryData?.confidence ?? o.confidence ?? 0}%</span>
            </div>
          </div>
        {/if}

        <!-- Stats row -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-lbl">Confirmed Cases</div>
            <div class="stat-val">{o.cases?.toLocaleString()}</div>
            <div class="stat-chg">
              {o.trendDir === 'up' ? '↑' : '↓'} {Math.abs(o.trendPct)}% from last 7 days
            </div>
          </div>
          <div class="spark-card">
            <div class="stat-lbl">Trend</div>
            <svg viewBox="0 0 110 46" style="width:100%;height:40px;margin-top:4px">
              <polyline
                points={sparkPoints(o)}
                fill="none" stroke="var(--red)"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              />
              <circle cx="104" cy="6" r="2.5" fill="var(--red)"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- ── Spread Projection ── -->
      <div class="sec-box">
        <div class="spread-hd">
          <div class="cw-section-label" style="margin-bottom:0">
            <svg viewBox="0 0 14 14" fill="none" stroke="var(--teal)" stroke-width="1.5" style="width:15px;height:15px;flex-shrink:0">
              <circle cx="7" cy="7" r="6"/>
              <path d="M7 3.5v3.5l2.5 2" stroke-linecap="round"/>
            </svg>
          Spread Projection
        </div>
        <span class="spread-time">{o.spread?.timeframe ?? 'Next 4 weeks'}</span>
      </div>
      
      {#if o.spread?.target_regions?.length}
      <div class="spread-regions">
        {#each o.spread.target_regions as region}
        <span class="spread-tag">⚠ {region}</span>
        {/each}
      </div>
      {#if o.spread.reasoning}
      <p class="spread-reasoning">{o.spread.reasoning}</p>
      {/if}
      <div class="spread-conf">
        <span class="conf-lbl">Spread confidence</span>
        <div class="conf-bar">
          <div class="conf-fill" style="width:{Math.round((o.spread.confidence??0.5)*100)}%"></div>
        </div>
        <span class="conf-pct">{Math.round((o.spread.confidence??0.5)*100)}%</span>
      </div>
      {:else}
      <p class="spread-none">No spread prediction available yet.</p>
      {/if}
    </div>

      <!-- ── Precautions ── -->
      {#if o.precautions?.length}
        <div class="sec-box">
          <div class="cw-section-label">
            <svg viewBox="0 0 14 14" fill="none" stroke="var(--teal)" stroke-width="1.5" style="width:15px;height:15px;flex-shrink:0">
              <path d="M7 1.5l5.5 3v3.8c0 2.6-2.4 4.8-5.5 5.2-3.1-.4-5.5-2.6-5.5-5.2V4.5z" stroke-linejoin="round"/>
            </svg>
            Precautions
          </div>
          <div class="prec-pills">
            {#each o.precautions as p}
              <div class="prec-pill">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" style="width:12px;height:12px;opacity:.55;flex-shrink:0">
                  <circle cx="6" cy="4.5" r="2.2"/>
                  <path d="M1 11c0-2.8 2.2-4.2 5-4.2s5 1.4 5 4.2"/>
                </svg>
                {p}
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- ── What Doctors Said ── -->
      <div class="sec-box">
        <div class="doc-hrow">
          <div class="cw-section-label" style="margin-bottom:0">
            <svg viewBox="0 0 14 14" fill="none" stroke="var(--teal)" stroke-width="1.5" style="width:15px;height:15px;flex-shrink:0">
              <circle cx="5" cy="4" r="2.2"/>
              <path d="M1 12c0-2.3 1.8-3.7 4-3.7s4 1.4 4 3.7"/>
              <circle cx="10.5" cy="4.5" r="1.5"/>
              <path d="M10.5 8.2c1.5.2 2.5 1.3 2.5 2.8"/>
            </svg>
            What Doctors Said
          </div>
          <div class="doc-tabs">
            <button class="doc-tab" class:on={activeTab === 'ai'}      on:click={() => activeTab = 'ai'}>AI Summary</button>
            <button class="doc-tab" class:on={activeTab === 'doctor'}  on:click={() => activeTab = 'doctor'}>Doctor's Message</button>
          </div>
        </div>

        {#if activeTab === 'ai'}
          <p class="doc-quote" style="margin-top:12px">
            {summaryData?.doctor_summary ?? doctorData?.ai_summary ?? 'Local health workers are monitoring the situation closely.'}
          </p>
        {:else}
          <p class="doc-quote" style="margin-top:12px">
            {doctorData?.message ?? 'No direct message available yet.'}
          </p>
        {/if}

        {#if doctorData?.doctor || o.doctor}
          {@const doc = doctorData?.doctor ?? o.doctor}
          <div class="doc-attr">
            <div class="doc-av">{doc.initials ?? doc.name?.slice(0,2).toUpperCase()}</div>
            <div style="flex:1;min-width:0">
              <div class="doc-name">
                {doc.name}
                {#if doc.verified}<span class="chk">✓</span>{/if}
              </div>
              <div class="doc-role">{doc.role ?? ''}</div>
              <div class="doc-ts">{formatDate(doc.timestamp ?? o.updatedAt)}</div>
            </div>
          </div>
        {/if}
      </div>

    </div>
  </aside>
{/if}

<style>
  .detail-panel {
    width: 400px;
    min-width: 400px;
    background: var(--bg1);
    border-left: 1px solid var(--b0);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
  }

  .dp-head {
    padding: 14px 18px;
    border-bottom: 1px solid var(--b0);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }

  .close-x {
    width: 28px; height: 28px;
    background: var(--bg3); border: 1px solid var(--b1); border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--t2); font-size: 16px; line-height: 1;
    transition: border-color 0.15s, color 0.15s;
  }
  .close-x:hover { color: var(--t1); border-color: var(--b2); }

  .dp-body {
    flex: 1; overflow-y: auto;
    padding: 22px 18px 28px;
    display: flex; flex-direction: column; gap: 10px;
  }

  .dp-disease {
    font-family: var(--font-serif);
    font-size: 44px; font-weight: 700;
    color: var(--t1); line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 2px;
  }
  .dp-loc  { font-size: 14px; color: var(--t2); font-weight: 400; }
  .dp-upd  { font-size: 11px; color: var(--t3); font-family: var(--font-mono); letter-spacing: .01em; }

  /* Section box */
  .sec-box {
    background: var(--bg2);
    border: 1px solid var(--b0);
    border-radius: 11px;
    padding: 15px;
  }

  /* AI box */
  .ai-box {
    background: var(--bg3);
    border: 1px solid var(--b0);
    border-left: 2.5px solid var(--teal);
    border-radius: 0 8px 8px 0;
    padding: 13px 14px;
    font-size: 13px; color: var(--t2); line-height: 1.75;
    margin-bottom: 13px;
  }
  .conf-row  { display: flex; align-items: center; gap: 10px; margin-top: 11px; }
  .conf-lbl  { font-size: 11px; color: var(--t3); white-space: nowrap; }
  .conf-pct  { font-size: 11px; font-family: var(--font-mono); color: var(--t2); }

  /* Stats */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .stat-card, .spark-card {
    background: var(--bg3);
    border: 1px solid var(--b0);
    border-radius: 9px; padding: 13px;
  }
  .spark-card { display: flex; flex-direction: column; justify-content: space-between; }
  .stat-lbl  { font-size: 10px; color: var(--t3); letter-spacing: .08em; text-transform: uppercase; font-weight: 500; margin-bottom: 5px; }
  .stat-val  { font-size: 36px; font-weight: 400; color: var(--t1); font-family: var(--font-mono); line-height: 1; letter-spacing: -0.02em; margin-bottom: 4px; }
  .stat-chg  { font-size: 12px; color: var(--red); font-weight: 500; }

  /* Spread */
  .spread-hd   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .spread-time { font-size: 11px; color: var(--t3); }
  .spread-wrap { display: flex; gap: 14px; align-items: center; }
  .spread-map  {
    width: 148px; height: 110px;
    background: var(--bg0); border: 1px solid var(--b0); border-radius: 9px;
    overflow: hidden; flex-shrink: 0;
  }
  .spread-leg  { display: flex; flex-direction: column; gap: 8px; }
  .sleg-item   { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--t2); }
  .sleg-dot    { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .spread-regions { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .spread-tag {
    font-size: 11px; padding: 3px 10px; border-radius: 20px;
    background: rgba(249,115,22,0.08); color: #f97316;
    border: 1px solid rgba(249,115,22,0.2);
    font-family: var(--font-mono);
  }
  .spread-reasoning {
    font-size: 12px; color: var(--t3); line-height: 1.6;
    font-style: italic; margin-bottom: 10px;
  }
  .spread-conf { display: flex; align-items: center; gap: 10px; }
  .spread-none { font-size: 12px; color: var(--t3); }

  /* Precautions */
  .prec-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .prec-pill  {
    background: var(--bg3); border: 1px solid var(--b0); border-radius: 8px;
    padding: 8px 11px; display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: var(--t2); white-space: nowrap;
  }

  /* Doctor */
  .doc-hrow { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
  .doc-tabs { display: flex; gap: 4px; }
  .doc-tab  {
    font-size: 12px; padding: 5px 11px; border-radius: 7px; cursor: pointer;
    background: transparent; border: 1px solid transparent;
    color: var(--t3); font-family: var(--font-sans);
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .doc-tab:hover { color: var(--t2); }
  .doc-tab.on { background: var(--bg4); color: var(--t1); border-color: var(--b1); font-weight: 500; }
  .doc-quote { font-size: 13px; color: var(--t2); line-height: 1.75; }
  .doc-attr  { display: flex; align-items: flex-start; gap: 10px; padding-top: 12px; border-top: 1px solid var(--b0); margin-top: 12px; }
  .doc-av    {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--bg4); border: 1px solid var(--b1);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 500; color: var(--t2); flex-shrink: 0;
  }
  .doc-name { font-size: 13px; font-weight: 500; color: var(--t1); display: flex; align-items: center; gap: 4px; margin-bottom: 3px; }
  .chk      { color: var(--teal); }
  .doc-role { font-size: 11px; color: var(--t3); margin-bottom: 2px; }
  .doc-ts   { font-size: 11px; color: var(--t3); font-family: var(--font-mono); }
</style>