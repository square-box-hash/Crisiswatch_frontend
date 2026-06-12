// ============================================================
//  CrisisWatch — API Service
// ============================================================

import { API_BASE_URL } from '../constants'

const BASE_URL = API_BASE_URL

const COUNTRY_COORDS = {
  // Africa
  "Democratic Republic of the Congo": [-4.0, 21.7],
  "DR Congo":                          [-4.0, 21.7],
  "DRC":                               [-4.0, 21.7],
  "Uganda":                            [1.3, 32.3],
  "Kenya":                             [0.0, 38.0],
  "Ethiopia":                          [9.0, 40.0],
  "Nigeria":                           [9.0, 8.0],
  "Somalia":                           [5.15, 46.2],
  "Sudan":                             [12.9, 30.2],
  "South Sudan":                       [6.9, 31.3],
  "Tanzania":                          [-6.4, 34.9],
  "Zambia":                            [-13.1, 27.8],
  "Zimbabwe":                          [-20.0, 30.0],
  "Mozambique":                        [-18.7, 35.5],
  "Angola":                            [-11.2, 17.9],
  "Ghana":                             [7.9, -1.0],
  "Chad":                              [15.5, 18.7],
  "Niger":                             [17.6, 8.1],
  "Mali":                              [17.6, -3.9],
  "Cameroon":                          [3.9, 11.5],
  "Guinea":                            [9.9, -11.4],
  "Sierra Leone":                      [8.5, -11.8],
  "Liberia":                           [6.3, -9.4],
  "Senegal":                           [14.5, -14.5],
  "Ivory Coast":                       [7.5, -5.5],
  "Burkina Faso":                      [12.4, -1.6],
  "Central African Republic":          [6.6, 20.9],
  "Rwanda":                            [-1.9, 29.9],
  "Burundi":                           [-3.4, 29.9],
  "Malawi":                            [-13.2, 34.3],
  "Madagascar":                        [-20.0, 47.0],
  "Mayotte":                           [-12.8, 45.2],
  "Reunion":                           [-21.1, 55.5],
  "Seychelles":                        [-4.7, 55.5],
  "Mauritius":                         [-20.3, 57.6],
  "Djibouti":                          [11.8, 42.6],
  "Eritrea":                           [15.2, 39.8],
  "South Africa":                      [-30.6, 22.9],
  "Namibia":                           [-22.0, 17.1],
  "Botswana":                          [-22.3, 24.7],
  "Eswatini":                          [-26.5, 31.5],
  "Lesotho":                           [-29.6, 28.2],
  "Gabon":                             [-0.8, 11.6],
  "Republic of Congo":                 [-0.2, 15.8],
  "Equatorial Guinea":                 [1.7, 10.3],

  // Middle East
  "Yemen":                             [15.55, 48.5],
  "Syria":                             [34.8, 38.9],
  "Iraq":                              [33.2, 43.7],
  "Iran":                              [32.4, 53.7],
  "Lebanon":                           [33.9, 35.9],
  "Jordan":                            [30.6, 36.2],
  "Israel":                            [31.0, 35.0],
  "Palestine":                         [31.9, 35.2],
  "Saudi Arabia":                      [23.9, 45.1],
  "Turkey":                            [38.9, 35.2],

  // South Asia
  "India":                             [20.6, 79.0],
  "Pakistan":                          [30.4, 69.3],
  "Bangladesh":                        [23.7, 90.4],
  "Nepal":                             [28.4, 84.1],
  "Sri Lanka":                         [7.9, 80.8],
  "Afghanistan":                       [33.9, 67.7],
  "Myanmar":                           [17.1, 96.0],

  // Southeast Asia
  "Indonesia":                         [-0.8, 113.9],
  "Philippines":                       [12.9, 121.8],
  "Vietnam":                           [14.1, 108.3],
  "Thailand":                          [15.9, 100.9],
  "Cambodia":                          [12.6, 104.9],
  "Laos":                              [18.2, 103.9],
  "Malaysia":                          [3.1, 101.7],
  "Timor-Leste":                       [-8.9, 125.7],

  // East Asia
  "China":                             [35.9, 104.2],
  "Mongolia":                          [46.9, 103.8],

  // Central Asia
  "Kazakhstan":                        [48.0, 66.9],
  "Uzbekistan":                        [41.4, 64.6],
  "Tajikistan":                        [38.9, 71.3],
  "Kyrgyzstan":                        [41.2, 74.8],

  // Americas
  "Haiti":                             [18.97, -72.29],
  "Dominican Republic":                [18.7, -70.2],
  "Cuba":                              [21.5, -79.5],
  "Jamaica":                           [18.1, -77.3],
  "Trinidad and Tobago":               [10.7, -61.2],
  "Barbados":                          [13.2, -59.5],
  "Colombia":                          [4.6, -74.1],
  "Venezuela":                         [6.4, -66.6],
  "Brazil":                            [-14.2, -51.9],
  "Peru":                              [-9.2, -75.0],
  "Bolivia":                           [-16.5, -68.1],
  "Ecuador":                           [-1.8, -78.2],
  "Paraguay":                          [-23.4, -58.4],
  "Argentina":                         [-38.4, -63.6],
  "Chile":                             [-35.7, -71.5],
  "Uruguay":                           [-32.5, -55.8],
  "Guyana":                            [4.9, -58.9],
  "Suriname":                          [3.9, -56.0],
  "French Guiana":                     [3.9, -53.1],
  "Mexico":                            [23.6, -102.6],
  "Guatemala":                         [15.8, -90.2],
  "Honduras":                          [15.2, -86.2],
  "Nicaragua":                         [12.9, -85.2],
  "El Salvador":                       [13.8, -88.9],
  "Costa Rica":                        [9.7, -83.8],
  "Panama":                            [8.5, -80.8],
  "United States":                     [37.1, -95.7],
  "Canada":                            [56.1, -106.3],

  // Europe
  "United Kingdom":                    [51.5, -0.1],
  "France":                            [46.2, 2.2],
  "Germany":                           [51.2, 10.5],
  "Italy":                             [41.9, 12.6],
  "Spain":                             [40.5, -3.7],
  "Portugal":                          [39.4, -8.2],
  "Netherlands":                       [52.1, 5.3],
  "Belgium":                           [50.5, 4.5],
  "Switzerland":                       [46.8, 8.2],
  "Austria":                           [47.5, 14.6],
  "Poland":                            [51.9, 19.1],
  "Ukraine":                           [48.4, 31.2],
  "Romania":                           [45.9, 24.9],
  "Greece":                            [39.1, 21.8],

  // Pacific
  "Papua New Guinea":                  [-6.3, 143.9],
  "Fiji":                              [-17.7, 178.1],
  "Solomon Islands":                   [-9.6, 160.2],
  "Vanuatu":                           [-15.4, 166.9],
}

// ── Helper ────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${msg}`)
  }

  return res.json()
}

// ── Outbreaks ─────────────────────────────────────────────

export async function fetchOutbreaks({ region = null, days = 7 } = {}) {
  const params = new URLSearchParams({ days })

  if (region) params.set('region', region)

  return request(`/outbreaks?${params}`)
}

export async function fetchOutbreak(id) {
  return request(`/outbreaks/${id}`)
}

export async function fetchSummary(id) {
  return request(`/outbreaks/${id}/summary`)
}

// ⚠️ Backend does NOT currently support these endpoints
// So we safely degrade them instead of breaking UI

export async function fetchSpreadProjection(id) {
  const data = await request(`/outbreaks/${id}`)
  return data.spread_prediction ?? {}
}

export async function fetchDoctorMessages(id) {
  const data = await request(`/outbreaks/${id}`)
  return data.worker_messages ?? []
}

// ── Health check ──────────────────────────────────────────

export async function healthCheck() {
  return request('/')
}

// ── Normaliser ────────────────────────────────────────────

export function normaliseOutbreak(raw) {
  return {
    id: raw._id ?? raw.incident_id ?? raw.id ?? null,

    disease: raw.disease ?? 'Unknown',

    location: raw.country ?? raw.region ?? '',

    region: raw.region ?? '',
    country: raw.country ?? '',

    severity: raw.severity ?? 'low',
    classification: raw.classification ?? 'pending',

    cases: raw.cluster_signal?.cases ?? raw.cases ?? 0,
    deaths: raw.cluster_signal?.deaths ?? raw.deaths ?? 0,

    trendPct: 0,
    trendDir: 'up',

    lat: raw.lat ?? COUNTRY_COORDS[raw.country]?.[0] ?? COUNTRY_COORDS[raw.region]?.[0] ?? null,
    lng: raw.lng ?? COUNTRY_COORDS[raw.country]?.[1] ?? COUNTRY_COORDS[raw.region]?.[1] ?? null,

    summary: raw.ai_summary ?? raw.ai_assessment ?? '',
    ai_summary: raw.ai_summary ?? '',

    confidence: raw.confidence_score ?? raw.confidence ?? 0.7,

    updatedAt: raw.updated_at ?? new Date().toISOString(),

    spread:
      typeof raw.spread_prediction === 'object'
        ? raw.spread_prediction
        : {},

    safetyAdvice: raw.safety_advice ?? {},

    workerMessages: raw.worker_messages ?? raw.workerMessages ?? [],

    version: raw.version ?? 1,

    precautions: raw.safety_advice
      ? [
          raw.safety_advice.public,
          raw.safety_advice.practitioner,
          raw.safety_advice.ngo
        ].filter(Boolean)
      : []
  }
}