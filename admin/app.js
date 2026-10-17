/* ════════════════════════════════════════════════════════════════
   YATRAGUIDE ADMIN CONSOLE — Application Logic
   Atomic components + Global State + Page Router
   ════════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   GLOBAL STATE
─────────────────────────────────────────────────────────────── */
const State = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  sortField: null,
  sortDir: 'asc',
  searchQuery: '',
  selectedRows: new Set(),
  currentPageNum: 1,
  rowsPerPage: 12,
  theme: 'dark',
  editingCell: null,
  user: { name: 'Arjun Menon', role: 'Super Admin', initials: 'AM' },
  realtimeTick: 0,
};

/* ──────────────────────────────────────────────────────────────
   MOCK DATA — Realistic JSON payloads with UUIDs,
   timestamps, API latencies, and geospatial metadata
─────────────────────────────────────────────────────────────── */
const DATA = {
  pois: [
    { id:'3b5f2d1a-8c4e-47f9-b3a6-12d9e0f1c234', name:'Meenakshi Amman Temple', state:'Tamil Nadu', district:'Madurai', category:'temple', subcategory:'Hindu Shrine', rating:4.8, reviews:14820, status:'verified', verified:true, active:true, entry_fee:0, lat:9.9195, lng:78.1193, created_at:'2025-11-02T08:14:22Z', updated_at:'2026-03-18T11:30:00Z' },
    { id:'7a1c9e2b-5d3f-48a0-c4b7-23e0f2g2d345', name:'Hampi Ruins Complex', state:'Karnataka', district:'Vijayanagara', category:'heritage', subcategory:'UNESCO World Heritage', rating:4.9, reviews:22100, status:'verified', verified:true, active:true, entry_fee:40, lat:15.3350, lng:76.4600, created_at:'2025-10-14T10:22:10Z', updated_at:'2026-04-01T09:15:00Z' },
    { id:'c2f4a8d6-6e1b-49b1-d5c8-34f1g3h3e456', name:'Varkala Cliff Beach', state:'Kerala', district:'Thiruvananthapuram', category:'nature', subcategory:'Beach', rating:4.5, reviews:9340, status:'verified', verified:true, active:true, entry_fee:0, lat:8.7379, lng:76.7160, created_at:'2025-12-01T14:05:30Z', updated_at:'2026-02-20T07:45:00Z' },
    { id:'e8g6c0f2-9h3d-4cb2-f6d9-56g3h5j5g678', name:'Tirupati Balaji Temple', state:'Andhra Pradesh', district:'Tirupati', category:'temple', subcategory:'Divya Desam', rating:4.9, reviews:68420, status:'verified', verified:true, active:true, entry_fee:300, lat:13.6834, lng:79.3476, created_at:'2025-09-22T06:00:00Z', updated_at:'2026-04-10T05:30:00Z' },
    { id:'a4h8e2g4-0j5f-4dc3-g7e0-67h4i6k6h789', name:'Coorg Coffee Estates', state:'Karnataka', district:'Kodagu', category:'nature', subcategory:'Hill Station', rating:4.6, reviews:5810, status:'pending', verified:false, active:true, entry_fee:0, lat:12.3375, lng:75.8069, created_at:'2026-01-15T09:20:40Z', updated_at:'2026-03-30T14:00:00Z' },
    { id:'f0j2g4i6-2l7h-4ed4-h8f1-78i5j7l7i890', name:'Golconda Fort', state:'Telangana', district:'Hyderabad', category:'heritage', subcategory:'Medieval Fort', rating:4.4, reviews:11650, status:'verified', verified:true, active:true, entry_fee:25, lat:17.3833, lng:78.4011, created_at:'2025-11-28T11:10:15Z', updated_at:'2026-04-05T12:00:00Z' },
    { id:'b6l4i6k8-4n9j-4fe5-i9g2-89j6k8m8j901', name:'Basilica of Bom Jesus', state:'Goa', district:'North Goa', category:'church', subcategory:'UNESCO Heritage', rating:4.7, reviews:8920, status:'verified', verified:true, active:true, entry_fee:0, lat:15.5009, lng:73.9116, created_at:'2025-10-30T08:45:00Z', updated_at:'2026-03-12T10:15:00Z' },
    { id:'d8n6k8m0-6p1l-4gf6-j0h3-90k7l9n9k012', name:'Munnar Tea Gardens', state:'Kerala', district:'Idukki', category:'nature', subcategory:'Tea Plantation', rating:4.7, reviews:17340, status:'pending', verified:false, active:true, entry_fee:0, lat:10.0889, lng:77.0595, created_at:'2026-02-08T07:30:00Z', updated_at:'2026-04-08T09:00:00Z' },
    { id:'f0p8m0o2-8r3n-4hg7-k1i4-01l8m0p0l123', name:'Srikalahasti Temple', state:'Andhra Pradesh', district:'Tirupati', category:'temple', subcategory:'Pancharama Kshetra', rating:4.6, reviews:6230, status:'draft', verified:false, active:false, entry_fee:0, lat:13.7493, lng:79.6982, created_at:'2026-03-01T13:20:00Z', updated_at:'2026-04-12T11:30:00Z' },
    { id:'h2r0o2q4-0t5p-4ih8-l2j5-12m9n1q1m234', name:'Charminar Hyderabad', state:'Telangana', district:'Hyderabad', category:'heritage', subcategory:'Islamic Monument', rating:4.5, reviews:24880, status:'verified', verified:true, active:true, entry_fee:25, lat:17.3616, lng:78.4747, created_at:'2025-09-05T10:00:00Z', updated_at:'2026-04-11T08:00:00Z' },
    { id:'j4t2q4s6-2v7r-4ji9-m3k6-23n0o2r2n345', name:'Athirappilly Waterfalls', state:'Kerala', district:'Thrissur', category:'nature', subcategory:'Waterfall', rating:4.8, reviews:13560, status:'verified', verified:true, active:true, entry_fee:30, lat:10.2867, lng:76.5697, created_at:'2025-12-20T15:00:00Z', updated_at:'2026-03-25T09:30:00Z' },
    { id:'l6v4s6u8-4x9t-4kj0-n4l7-34o1p3s3o456', name:'Pondicherry French Quarter', state:'Puducherry', district:'Puducherry', category:'heritage', subcategory:'Colonial Architecture', rating:4.3, reviews:7890, status:'pending', verified:false, active:true, entry_fee:0, lat:11.9340, lng:79.8306, created_at:'2026-01-28T12:00:00Z', updated_at:'2026-04-13T10:00:00Z' },
  ],

  circuits: [
    { id:'circ-001', title:'Tamil Nadu Temple Trail', region:'Tamil Nadu', theme:'Pilgrimage', days:7, budget_band:'mid', active:true, pois_count:14, bookings:342, rating:4.8 },
    { id:'circ-002', title:'Karnataka Heritage Circuit', region:'Karnataka', theme:'Heritage', days:5, budget_band:'premium', active:true, pois_count:9, bookings:218, rating:4.7 },
    { id:'circ-003', title:'Kerala Backwaters & Hill Stations', region:'Kerala', theme:'Nature', days:6, budget_band:'mid', active:true, pois_count:11, bookings:489, rating:4.9 },
    { id:'circ-004', title:'Andhra Sacred Shrines', region:'Andhra Pradesh', theme:'Pilgrimage', days:4, budget_band:'budget', active:true, pois_count:7, bookings:156, rating:4.6 },
    { id:'circ-005', title:'Goa Heritage & Beaches', region:'Goa', theme:'Mixed', days:3, budget_band:'premium', active:false, pois_count:8, bookings:0, rating:0 },
  ],

  users: [
    { id:'usr-a1b2c3d4', name:'Kavitha Sundaram', phone:'+91 98401 12345', lang:'ta', type:'pilgrim', trips:12, saved_pois:48, joined:'2025-10-14T08:22:00Z', last_active:'2026-04-15T06:10:00Z', status:'active' },
    { id:'usr-e5f6g7h8', name:'David Whitmore', phone:'+44 7911 234567', lang:'en', type:'tourist', trips:3, saved_pois:21, joined:'2025-12-01T14:30:00Z', last_active:'2026-04-14T18:45:00Z', status:'active' },
    { id:'usr-i9j0k1l2', name:'Rahul Krishnamurthy', phone:'+91 97890 56789', lang:'kn', type:'weekend', trips:7, saved_pois:34, joined:'2026-01-10T11:00:00Z', last_active:'2026-04-13T22:00:00Z', status:'active' },
    { id:'usr-m3n4o5p6', name:'Lakshmi Narayanan', phone:'+91 94440 78901', lang:'ta', type:'pilgrim', trips:24, saved_pois:87, joined:'2025-09-05T07:00:00Z', last_active:'2026-04-15T04:30:00Z', status:'active' },
    { id:'usr-q7r8s9t0', name:'Priya Menon', phone:'+91 91234 90123', lang:'ml', type:'weekend', trips:5, saved_pois:16, joined:'2026-02-20T16:00:00Z', last_active:'2026-04-12T20:00:00Z', status:'inactive' },
    { id:'usr-u1v2w3x4', name:'Anjali Reddy', phone:'+91 88765 54321', lang:'te', type:'tourist', trips:2, saved_pois:9, joined:'2026-03-01T09:30:00Z', last_active:'2026-04-10T14:00:00Z', status:'active' },
  ],

  apiMetrics: [
    { endpoint:'GET /v1/pois/nearby', p50:48, p95:124, p99:280, rps:184.3, errors:0.12, status:'online' },
    { endpoint:'GET /v1/pois/{id}', p50:22, p95:68, p99:130, rps:94.7, errors:0.04, status:'online' },
    { endpoint:'POST /v1/trips/plan', p50:1240, p95:3800, p99:6200, rps:8.2, errors:1.8, status:'degraded' },
    { endpoint:'GET /v1/stays', p50:55, p95:140, p99:290, rps:42.1, errors:0.22, status:'online' },
    { endpoint:'GET /v1/pois/search', p50:88, p95:220, p99:480, rps:62.8, errors:0.45, status:'online' },
    { endpoint:'PATCH /v1/trips/{id}', p50:140, p95:380, p99:720, rps:14.5, errors:0.8, status:'online' },
    { endpoint:'POST /v1/admin/pois', p50:210, p95:560, p99:940, rps:2.1, errors:0.0, status:'online' },
    { endpoint:'POST /v1/admin/pois/import/ogd', p50:4800, p95:12000, p99:22000, rps:0.4, errors:4.2, status:'offline' },
  ],

  ingestionQueue: [
    { id:'ing-001', source:'OGD India v2.4', records:1240, pending:34, source_url:'data.gov.in/resource/temples-tn', type:'review', queued_at:'2026-04-15T04:00:00Z', assignee:'Auto-Validator' },
    { id:'ing-002', source:'Wikimedia Commons Batch', records:850, pending:12, source_url:'commons.wikimedia.org/API', type:'import', queued_at:'2026-04-14T22:30:00Z', assignee:'Media Processor' },
    { id:'ing-003', source:'Manual CSV Upload (Kerala-stays)', records:92, pending:7, source_url:'upload://kerala-stays-v3.csv', type:'review', queued_at:'2026-04-14T18:15:00Z', assignee:'Content Team' },
    { id:'ing-004', source:'Overpass API Cache Refresh', records:5600, pending:0, source_url:'overpass-api.de/api', type:'import', queued_at:'2026-04-14T12:00:00Z', assignee:'System' },
    { id:'ing-005', source:'OSM Heritage Monuments AP', records:330, pending:18, source_url:'wiki.openstreetmap.org', type:'review', queued_at:'2026-04-13T08:45:00Z', assignee:'Auto-Validator' },
  ],

  recentActivity: [
    { type:'poi', text:'<strong>Athirappilly Waterfalls</strong> verified by Content Team', time:'3m ago', color:'var(--color-ok)' },
    { type:'ingestion', text:'OGD batch <strong>1,206 records</strong> imported successfully', time:'18m ago', color:'var(--accent)' },
    { type:'user', text:'New user <strong>Anjali Reddy</strong> registered via Google OAuth', time:'34m ago', color:'var(--color-neutral)' },
    { type:'error', text:'Trip planner edge function <strong>timeout 6.2s</strong> — degraded', time:'1h ago', color:'var(--color-warn)' },
    { type:'circuit', text:'Circuit <strong>Kerala Backwaters</strong> updated — 11 POIs reordered', time:'2h ago', color:'var(--accent)' },
    { type:'poi', text:'<strong>Srikalahasti Temple</strong> flagged for coordinate validation', time:'3h ago', color:'var(--color-warn)' },
    { type:'api', text:'Rate limit hit on <strong>/v1/pois/nearby</strong> — 210 req/s peak', time:'5h ago', color:'var(--color-error)' },
    { type:'poi', text:'<strong>Coorg Coffee Estates</strong> submitted for review', time:'6h ago', color:'var(--color-neutral)' },
  ],

  regionStats: [
    { name:'Tamil Nadu', pois:680, trips:1420 },
    { name:'Kerala', pois:540, trips:2100 },
    { name:'Karnataka', pois:490, trips:980 },
    { name:'Andhra Pradesh', pois:380, trips:840 },
    { name:'Telangana', pois:210, trips:510 },
    { name:'Goa', pois:120, trips:690 },
  ],
};

/* ──────────────────────────────────────────────────────────────
   UTILITIES
─────────────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const el = (tag, attrs = {}, ...children) => {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  });
  children.forEach(c => c && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) + ' ' +
         d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:false });
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return `${Math.floor(diff/1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return `${Math.floor(diff/86400000)}d ago`;
}
function truncateUUID(uuid) { return uuid.slice(0,8) + '…'; }

/* ──────────────────────────────────────────────────────────────
   HEADER CLOCK
─────────────────────────────────────────────────────────────── */
function startClock() {
  const tick = () => {
    const el = $('#header-time');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleString('en-IN', {
      day:'2-digit', month:'short', year:'numeric',
      hour:'2-digit', minute:'2-digit', second:'2-digit',
      hour12:false, timeZone:'Asia/Kolkata'
    }) + ' IST';
  };
  tick();
  setInterval(tick, 1000);
}

/* ──────────────────────────────────────────────────────────────
   SIDEBAR TOGGLE
─────────────────────────────────────────────────────────────── */
function initSidebar() {
  const app = $('#app');
  const btn = $('#sidebar-toggle');
  btn.addEventListener('click', () => {
    State.sidebarCollapsed = !State.sidebarCollapsed;
    app.classList.toggle('sidebar-collapsed', State.sidebarCollapsed);
    btn.setAttribute('aria-label', State.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
  });

  // Add data-tooltip to nav items for collapsed mode
  $$('.nav-item').forEach(item => {
    const label = item.querySelector('.nav-label');
    if (label) item.setAttribute('data-nav-label', label.textContent.trim());
  });
}

/* ──────────────────────────────────────────────────────────────
   NAVIGATION / ROUTER
─────────────────────────────────────────────────────────────── */
function navigate(page) {
  State.currentPage = page;
  State.currentPageNum = 1;
  State.searchQuery = '';
  State.selectedRows.clear();

  // Update nav active state
  $$('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update breadcrumb
  const labels = {
    'dashboard':'Dashboard', 'pois':'POI Manager', 'circuits':'Circuits',
    'stays':'Stays', 'users':'Users', 'ingestion':'Ingestion Queue',
    'trips':'Trips', 'api-metrics':'API Metrics', 'settings':'Settings',
  };
  const bc = $('#breadcrumb-current');
  if (bc) bc.textContent = labels[page] || page;

  renderPage(page);
}

$$('.nav-item').forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); navigate(item.dataset.page); });
});

/* ──────────────────────────────────────────────────────────────
   PAGE RENDERER
─────────────────────────────────────────────────────────────── */
function renderPage(page) {
  const container = $('#page-container');
  container.innerHTML = '';
  container.className = 'page-container fade-in';

  const pages = {
    dashboard: renderDashboard,
    pois: renderPOIManager,
    circuits: renderCircuits,
    stays: renderStays,
    users: renderUsers,
    ingestion: renderIngestion,
    trips: renderTrips,
    'api-metrics': renderAPIMetrics,
    settings: renderSettings,
  };
  (pages[page] || renderNotFound)(container);
}

/* ──────────────────────────────────────────────────────────────
   COMPONENT: MetricCard
─────────────────────────────────────────────────────────────── */
function MetricCard({ label, value, delta, deltaLabel, iconSVG, deltaDir = 'up' }) {
  return `
  <div class="metric-card">
    <div class="metric-card-top">
      <span class="metric-label">${label}</span>
      <div class="metric-icon">${iconSVG}</div>
    </div>
    <div class="metric-value">${value}</div>
    <div class="metric-delta metric-delta--${deltaDir}">
      ${deltaDir === 'up' ? `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2L8 6H2L5 2Z" fill="currentColor"/></svg>` :
        deltaDir === 'down' ? `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 8L2 4H8L5 8Z" fill="currentColor"/></svg>` : ''}
      <span>${delta}</span>
      <span class="metric-delta-sub">${deltaLabel}</span>
    </div>
  </div>`;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: Dashboard
─────────────────────────────────────────────────────────────── */
function renderDashboard(container) {
  const maxPois = Math.max(...DATA.regionStats.map(r => r.pois));
  const maxTrips = Math.max(...DATA.regionStats.map(r => r.trips));

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Dashboard</h1>
        <span class="page-subtitle">// YatraGuide Operations Centre · ${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="navigate('ingestion')">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5V7.5M6 1.5L3.5 4M6 1.5L8.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1.5 7.5V9.5C1.5 9.8 1.7 10 2 10H10C10.3 10 10.5 9.8 10.5 9.5V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Ingest Data
        </button>
        <button class="btn btn-primary" onclick="navigate('pois')">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Add POI
        </button>
      </div>
    </div>

    <!-- METRIC CARDS -->
    <div class="metric-grid">
      ${MetricCard({ label:'Total POIs', value:'2,412', delta:'+48', deltaLabel:'this week', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 12C3 9.8 4.8 8 7 8C9.2 8 11 9.8 11 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Active Circuits', value:'48', delta:'+2', deltaLabel:'this month', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4H12M2 7H9M2 10H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Registered Users', value:'14,830', delta:'+312', deltaLabel:'this week', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 11.5C2.5 9.3 4.5 8 7 8C9.5 8 11.5 9.3 11.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'API Req/sec (p95)', value:'184.3', delta:'-12.4', deltaLabel:'vs yesterday', deltaDir:'down',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polyline points="2,10 5,6 8,8 11,4 13,6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })}
    </div>

    <!-- MAIN GRID -->
    <div class="dashboard-grid">
      <!-- LEFT: Activity & Recent POIs table -->
      <div style="display:flex;flex-direction:column;gap:24px">
        <!-- API Latency Overview -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">API Endpoint Health</span>
            <span class="panel-action" onclick="navigate('api-metrics')">View all →</span>
          </div>
          <div>
            ${DATA.apiMetrics.slice(0,5).map(m => `
            <div class="telemetry-row">
              <span class="telemetry-label mono" style="font-size:11px;min-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.endpoint}</span>
              <div class="telemetry-bar-wrap latency-bar">
                <div class="latency-fill ${m.p95 < 200 ? 'latency-good' : m.p95 < 500 ? 'latency-ok' : 'latency-slow'}" style="width:${Math.min(100,(m.p95/500)*100)}%;height:4px;border-radius:2px;"></div>
              </div>
              <span class="telemetry-val" style="font-size:11px;min-width:70px;text-align:right;">${m.p50}<span style="color:var(--text-tertiary)">ms</span></span>
              <span style="margin-left:12px;flex-shrink:0"><span class="chip chip-${m.status}">${m.status}</span></span>
            </div>`).join('')}
          </div>
        </div>

        <!-- Recent POIs Table -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Recently Updated POIs</span>
            <span class="panel-action" onclick="navigate('pois')">View all →</span>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>State</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                ${DATA.pois.slice(0,6).map(p => `
                <tr>
                  <td style="font-weight:500">${p.name}</td>
                  <td style="color:var(--text-secondary)">${p.state}</td>
                  <td><span class="chip chip-draft" style="text-transform:capitalize">${p.category}</span></td>
                  <td class="mono-cell">${p.rating > 0 ? '★ ' + p.rating.toFixed(1) : '—'}</td>
                  <td><span class="chip chip-${p.status}">${p.status}</span></td>
                  <td class="mono-cell">${formatDateTime(p.updated_at)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RIGHT: Activity Feed + Region Stats -->
      <div style="display:flex;flex-direction:column;gap:24px">
        <!-- Region Coverage -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Regional Coverage</span>
            <span class="panel-action">POIs / Trips</span>
          </div>
          <div class="region-list">
            ${DATA.regionStats.map(r => `
            <div class="region-item">
              <div class="region-top">
                <span class="region-name">${r.name}</span>
                <span class="region-val">${r.pois} <span style="color:var(--text-tertiary)">poi</span> · ${r.trips.toLocaleString()} <span style="color:var(--text-tertiary)">trips</span></span>
              </div>
              <div class="region-bar">
                <div class="region-bar-fill" style="width:${Math.round((r.pois/maxPois)*100)}%"></div>
              </div>
            </div>`).join('')}
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Activity Feed</span>
            <span class="panel-action" id="clear-activity" style="cursor:pointer">Clear</span>
          </div>
          <div class="activity-list" id="activity-list">
            ${DATA.recentActivity.map(item => `
            <div class="activity-item">
              <div class="activity-dot" style="background:${item.color}"></div>
              <div class="activity-content">
                <div class="activity-text">${item.text}</div>
                <div class="activity-time">${item.time}</div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- INGESTION QUEUE SUMMARY -->
    <div class="panel" style="margin-bottom:24px">
      <div class="panel-header">
        <span class="panel-title">Ingestion Queue <span class="nav-badge nav-badge--warning" style="margin-left:8px">7 pending</span></span>
        <span class="panel-action" onclick="navigate('ingestion')">Manage →</span>
      </div>
      <div>
        ${DATA.ingestionQueue.map(q => `
        <div class="queue-item">
          <div class="queue-item-icon queue-item-icon--${q.type}">
            ${q.type === 'review'
              ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12 10H2L7 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 6V8M7 9.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
              : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5V8.5M7 1.5L4.5 4M7 1.5L9.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9V11C2 11.6 2.4 12 3 12H11C11.6 12 12 11.6 12 11V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
            }
          </div>
          <div class="queue-item-body">
            <div class="queue-item-name">${q.source}</div>
            <div class="queue-item-meta">
              <span class="queue-item-meta-val">${q.records.toLocaleString()} records</span>
              <span class="queue-item-meta-val" style="color:${q.pending > 0 ? 'var(--color-warn)' : 'var(--color-ok)'}">${q.pending} pending review</span>
              <span class="queue-item-meta-val">${formatDateTime(q.queued_at)}</span>
            </div>
          </div>
          ${q.pending > 0 ? `<button class="btn btn-secondary" style="font-size:11px;padding:4px 10px" onclick="navigate('ingestion')">Review</button>` : `<span class="chip chip-active">done</span>`}
        </div>`).join('')}
      </div>
    </div>
  `;

  // Clear activity
  $('#clear-activity').addEventListener('click', () => {
    $('#activity-list').innerHTML = `
      <div class="empty-state" style="padding:24px">
        <div class="empty-state-code"><pre>// activity_log.clear()\n// awaiting_events: true\n// stream: open</pre></div>
      </div>`;
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: POI Manager — full DataGrid with sort, search, inline edit
─────────────────────────────────────────────────────────────── */
function renderPOIManager(container) {
  let data = [...DATA.pois];
  let sortField = null, sortDir = 'asc';
  let query = '';
  let pageNum = 1;
  const perPage = 8;
  let selectedRows = new Set();

  function filtered() {
    return data.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.state.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  function sorted(rows) {
    if (!sortField) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      const n = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? n : -n;
    });
  }

  function paged(rows) {
    const start = (pageNum - 1) * perPage;
    return rows.slice(start, start + perPage);
  }

  function render() {
    const rows = paged(sorted(filtered()));
    const total = filtered().length;
    const totalPages = Math.ceil(total / perPage);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">POI Manager</h1>
          <span class="page-subtitle">// ${DATA.pois.length.toLocaleString()} total points of interest · South India</span>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="export-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V7M6 7L3.5 4.5M6 7L8.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 9V10.5C1 10.8 1.2 11 1.5 11H10.5C10.8 11 11 10.8 11 10.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Export CSV
          </button>
          <button class="btn btn-primary" id="add-poi-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Add POI
          </button>
        </div>
      </div>

      <div class="data-grid-wrapper">
        <div class="data-grid-toolbar">
          <span class="data-grid-title">Points of Interest</span>
          <div class="search-input-wrap">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 8.5L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input class="search-input" id="poi-search" placeholder="Search POIs…" value="${query}" aria-label="Search POIs" autocomplete="off" />
          </div>
          <select class="filter-select" id="cat-filter" aria-label="Filter by category">
            <option value="">All Categories</option>
            <option value="temple">Temple</option>
            <option value="heritage">Heritage</option>
            <option value="nature">Nature</option>
            <option value="church">Church</option>
          </select>
          <select class="filter-select" id="status-filter" aria-label="Filter by status">
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
          ${selectedRows.size > 0 ? `
          <button class="btn btn-danger" id="bulk-delete" style="margin-left:auto">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3H10M4 3V2H8V3M5 5.5V9M7 5.5V9M3 3L3.5 10H8.5L9 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Delete ${selectedRows.size}
          </button>` : ''}
        </div>

        <div class="data-table-wrap">
          <table class="data-table" id="poi-table">
            <thead>
              <tr>
                <th style="width:36px"><input type="checkbox" class="table-checkbox" id="select-all" aria-label="Select all" /></th>
                <th class="sortable-col ${sortField==='id'?'sorted':''}" data-field="id">UUID <span class="sort-icon">${sortField==='id'?(sortDir==='asc'?'↑':'↓'):'⇅'}</span></th>
                <th class="sortable-col ${sortField==='name'?'sorted':''}" data-field="name">Name <span class="sort-icon">${sortField==='name'?(sortDir==='asc'?'↑':'↓'):'⇅'}</span></th>
                <th class="sortable-col ${sortField==='state'?'sorted':''}" data-field="state">State <span class="sort-icon">${sortField==='state'?(sortDir==='asc'?'↑':'↓'):'⇅'}</span></th>
                <th>Category</th>
                <th class="sortable-col ${sortField==='rating'?'sorted':''}" data-field="rating">Rating <span class="sort-icon">${sortField==='rating'?(sortDir==='asc'?'↑':'↓'):'⇅'}</span></th>
                <th>Status</th>
                <th>Entry Fee</th>
                <th>Updated</th>
                <th style="width:80px">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length === 0 ? `
              <tr><td colspan="10">
                <div class="empty-state">
                  <div class="empty-state-code"><pre>// query: "${query}"\n// result_count: 0\n// suggestion: adjust_filters()</pre></div>
                </div>
              </td></tr>` :
              rows.map(p => `
              <tr class="${selectedRows.has(p.id) ? 'row-selected' : ''}" data-id="${p.id}">
                <td><input type="checkbox" class="table-checkbox row-cb" data-id="${p.id}" ${selectedRows.has(p.id)?'checked':''} aria-label="Select ${p.name}" /></td>
                <td class="uuid-cell" title="${p.id}">${truncateUUID(p.id)}</td>
                <td>
                  <div class="inline-edit-cell" data-field="name" data-id="${p.id}">
                    <span class="cell-display" style="font-weight:500;cursor:pointer" title="Click to edit">${p.name}</span>
                  </div>
                </td>
                <td style="color:var(--text-secondary)">${p.state}</td>
                <td><span class="chip chip-draft" style="text-transform:capitalize">${p.category}</span></td>
                <td class="mono-cell"><span class="rating">★</span> ${p.rating.toFixed(1)} <span style="color:var(--text-tertiary)">(${p.reviews.toLocaleString()})</span></td>
                <td><span class="chip chip-${p.status}">${p.status}</span></td>
                <td class="mono-cell">${p.entry_fee === 0 ? '<span style="color:var(--color-ok)">Free</span>' : `₹${p.entry_fee}`}</td>
                <td class="mono-cell">${formatDateTime(p.updated_at)}</td>
                <td>
                  <div class="row-actions">
                    <button class="row-action-btn" title="Edit" aria-label="Edit ${p.name}" data-action="edit" data-id="${p.id}">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M7 1.5L8.5 3L3.5 8H2V6.5L7 1.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="row-action-btn ${p.verified?'':'danger'}" title="${p.verified?'Unverify':'Verify'}" aria-label="${p.verified?'Unverify':'Verify'} ${p.name}" data-action="verify" data-id="${p.id}">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="row-action-btn danger" title="Delete" aria-label="Delete ${p.name}" data-action="delete" data-id="${p.id}">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3H8M3.5 3V2H6.5V3M4 5V7.5M6 5V7.5M2.5 3L3 8H7L7.5 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="data-grid-pagination">
          <span class="pagination-info">
            Showing ${Math.min((pageNum-1)*perPage+1, total)}–${Math.min(pageNum*perPage, total)} of ${total.toLocaleString()} records
          </span>
          <div class="pagination-controls">
            <button class="pagination-btn" id="prev-page" ${pageNum<=1?'disabled':''}>← Prev</button>
            <span class="pagination-page">${pageNum} / ${totalPages}</span>
            <button class="pagination-btn" id="next-page" ${pageNum>=totalPages?'disabled':''}>Next →</button>
          </div>
        </div>
      </div>
    `;

    // Events
    $('#poi-search').addEventListener('input', e => { query = e.target.value; pageNum = 1; render(); });
    $('#cat-filter').addEventListener('change', e => {
      const cat = e.target.value;
      data = cat ? DATA.pois.filter(p => p.category === cat) : [...DATA.pois];
      pageNum = 1; render();
    });
    $('#status-filter').addEventListener('change', e => {
      const st = e.target.value;
      data = st ? DATA.pois.filter(p => p.status === st) : [...DATA.pois];
      pageNum = 1; render();
    });

    $$('.sortable-col').forEach(th => {
      th.addEventListener('click', () => {
        const f = th.dataset.field;
        if (sortField === f) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else { sortField = f; sortDir = 'asc'; }
        render();
      });
    });

    $('#select-all').addEventListener('change', e => {
      if (e.target.checked) rows.forEach(p => selectedRows.add(p.id));
      else rows.forEach(p => selectedRows.delete(p.id));
      render();
    });

    $$('.row-cb').forEach(cb => {
      cb.addEventListener('change', e => {
        if (e.target.checked) selectedRows.add(e.target.dataset.id);
        else selectedRows.delete(e.target.dataset.id);
        render();
      });
    });

    $('#prev-page')?.addEventListener('click', () => { pageNum--; render(); });
    $('#next-page')?.addEventListener('click', () => { pageNum++; render(); });

    // Inline edit
    $$('.inline-edit-cell .cell-display').forEach(span => {
      span.addEventListener('dblclick', () => {
        const cell = span.closest('.inline-edit-cell');
        const input = document.createElement('input');
        input.value = span.textContent;
        input.className = '';
        input.style.cssText = 'background:var(--bg-overlay);border:1px solid var(--accent);border-radius:4px;color:var(--text-primary);font-size:12px;padding:3px 8px;width:180px;outline:none;box-shadow:0 0 0 2px var(--accent-glow)';
        span.replaceWith(input);
        input.focus();
        input.select();
        input.addEventListener('blur', () => {
          const newName = input.value.trim() || span.textContent;
          const id = cell.dataset.id;
          const poi = DATA.pois.find(p => p.id === id);
          if (poi) poi.name = newName;
          render();
        });
      });
    });

    // Row actions
    $$('[data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        const { action, id } = btn.dataset;
        if (action === 'delete') {
          if (confirm('Delete this POI?')) {
            const idx = DATA.pois.findIndex(p => p.id === id);
            if (idx !== -1) DATA.pois.splice(idx, 1);
            render();
          }
        } else if (action === 'verify') {
          const poi = DATA.pois.find(p => p.id === id);
          if (poi) {
            poi.verified = !poi.verified;
            poi.status = poi.verified ? 'verified' : 'pending';
            render();
          }
        }
      });
    });

    $('#export-btn')?.addEventListener('click', () => {
      alert('CSV export initiated — 2,412 records queued for download.');
    });
  }

  render();
}

/* ──────────────────────────────────────────────────────────────
   PAGE: Circuits
─────────────────────────────────────────────────────────────── */
function renderCircuits(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Circuits</h1>
        <span class="page-subtitle">// ${DATA.circuits.length} curated itineraries · multi-day travel packages</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          New Circuit
        </button>
      </div>
    </div>

    <div class="data-grid-wrapper">
      <div class="data-grid-toolbar">
        <span class="data-grid-title">All Circuits</span>
        <div class="search-input-wrap">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 8.5L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <input class="search-input" placeholder="Search circuits…" aria-label="Search circuits" autocomplete="off" />
        </div>
        <select class="filter-select" aria-label="Filter by theme">
          <option>All Themes</option>
          <option>Pilgrimage</option>
          <option>Heritage</option>
          <option>Nature</option>
          <option>Mixed</option>
        </select>
      </div>

      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Region</th>
              <th>Theme</th>
              <th>Days</th>
              <th>POIs</th>
              <th>Budget</th>
              <th>Bookings</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DATA.circuits.map(c => `
            <tr>
              <td class="mono-cell">${c.id}</td>
              <td style="font-weight:500">${c.title}</td>
              <td style="color:var(--text-secondary)">${c.region}</td>
              <td><span class="chip chip-draft">${c.theme}</span></td>
              <td class="mono-cell">${c.days}d</td>
              <td class="mono-cell">${c.pois_count}</td>
              <td><span class="chip chip-draft" style="text-transform:capitalize">${c.budget_band}</span></td>
              <td class="mono-cell">${c.bookings > 0 ? c.bookings.toLocaleString() : '—'}</td>
              <td class="mono-cell">${c.rating > 0 ? '★ ' + c.rating.toFixed(1) : '—'}</td>
              <td><span class="chip ${c.active ? 'chip-active' : 'chip-inactive'}">${c.active ? 'active' : 'inactive'}</span></td>
              <td>
                <div class="row-actions" style="opacity:1">
                  <button class="row-action-btn" title="Edit circuit" aria-label="Edit ${c.title}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M7 1.5L8.5 3L3.5 8H2V6.5L7 1.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg></button>
                  <button class="row-action-btn danger" title="Delete circuit" aria-label="Delete ${c.title}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3H8M3.5 3V2H6.5V3M4 5V7.5M6 5V7.5M2.5 3L3 8H7L7.5 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="data-grid-pagination">
        <span class="pagination-info">${DATA.circuits.length} circuits</span>
        <div class="pagination-controls">
          <button class="pagination-btn" disabled>← Prev</button>
          <span class="pagination-page">1 / 1</span>
          <button class="pagination-btn" disabled>Next →</button>
        </div>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: Users
─────────────────────────────────────────────────────────────── */
function renderUsers(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Users</h1>
        <span class="page-subtitle">// 14,830 registered · 3 traveller types · 6 languages</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V7M6 7L3.5 4.5M6 7L8.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 9V10.5C1 10.8 1.2 11 1.5 11H10.5C10.8 11 11 10.8 11 10.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Export
        </button>
        <button class="btn btn-primary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Invite User
        </button>
      </div>
    </div>

    <div class="metric-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
      ${MetricCard({ label:'Total Users', value:'14,830', delta:'+312', deltaLabel:'this week', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 11.5C2.5 9.3 4.5 8 7 8C9.5 8 11.5 9.3 11.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Active 7d', value:'4,210', delta:'+8.4%', deltaLabel:'vs prev week', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polyline points="2,10 5,6 8,8 11,4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })}
      ${MetricCard({ label:'Avg Trips/User', value:'2.8', delta:'+0.3', deltaLabel:'vs last month', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L5 7L8 9L11 6L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })}
    </div>

    <div class="data-grid-wrapper">
      <div class="data-grid-toolbar">
        <span class="data-grid-title">User Accounts</span>
        <div class="search-input-wrap">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 8.5L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <input class="search-input" placeholder="Search users…" aria-label="Search users" autocomplete="off" />
        </div>
        <select class="filter-select" aria-label="Filter by type">
          <option>All Types</option>
          <option>pilgrim</option>
          <option>tourist</option>
          <option>weekend</option>
        </select>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Language</th>
              <th>Type</th>
              <th>Trips</th>
              <th>Saved POIs</th>
              <th>Last Active</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DATA.users.map(u => `
            <tr>
              <td class="uuid-cell" title="${u.id}">${u.id}</td>
              <td style="font-weight:500">${u.name}</td>
              <td class="mono-cell">${u.phone}</td>
              <td class="mono-cell">${u.lang.toUpperCase()}</td>
              <td><span class="chip chip-draft" style="text-transform:capitalize">${u.type}</span></td>
              <td class="mono-cell">${u.trips}</td>
              <td class="mono-cell">${u.saved_pois}</td>
              <td class="mono-cell">${timeAgo(u.last_active)}</td>
              <td><span class="chip chip-${u.status}">${u.status}</span></td>
              <td>
                <div class="row-actions" style="opacity:1">
                  <button class="row-action-btn" title="View profile" aria-label="View ${u.name}'s profile"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.2"/><circle cx="5" cy="4" r="1.2" stroke="currentColor" stroke-width="1.2"/><path d="M2 8C2 6.6 3.3 6 5 6C6.7 6 8 6.6 8 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>
                  <button class="row-action-btn danger" title="Suspend user" aria-label="Suspend ${u.name}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.2"/><path d="M3.5 3.5L6.5 6.5M6.5 3.5L3.5 6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="data-grid-pagination">
        <span class="pagination-info">Showing 1–6 of 14,830 records</span>
        <div class="pagination-controls">
          <button class="pagination-btn" disabled>← Prev</button>
          <span class="pagination-page">1 / 1,236</span>
          <button class="pagination-btn">Next →</button>
        </div>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: API Metrics
─────────────────────────────────────────────────────────────── */
function renderAPIMetrics(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">API Metrics</h1>
        <span class="page-subtitle">// real-time endpoint health · p50/p95/p99 latency · error rates</span>
      </div>
      <div class="page-actions">
        <span class="chip chip-online" style="font-size:11px;padding:5px 10px">Live Feed</span>
        <button class="btn btn-secondary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6A4 4 0 1 1 6 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 2L8 4L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Refresh
        </button>
      </div>
    </div>

    <div class="metric-grid" style="margin-bottom:24px">
      ${MetricCard({ label:'Total RPS', value:'408.1', delta:'+14%', deltaLabel:'vs 1h ago', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polyline points="2,10 5,6 8,8 11,4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Avg P95 Latency', value:'544ms', delta:'+82ms', deltaLabel:'vs baseline', deltaDir:'down',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 5V7.5L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Error Rate', value:'0.98%', delta:'+0.3%', deltaLabel:'vs 1h ago', deltaDir:'down',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3L12 11H2L7 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 6V8M7 9.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Uptime (30d)', value:'99.91%', delta:'±0.02%', deltaLabel:'SLA target: 99.9%', deltaDir:'neutral',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5 10L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })}
    </div>

    <div class="data-grid-wrapper">
      <div class="data-grid-toolbar">
        <span class="data-grid-title">Endpoint Performance</span>
        <select class="filter-select" aria-label="Time window">
          <option>Last 1h</option>
          <option>Last 6h</option>
          <option>Last 24h</option>
          <option>Last 7d</option>
        </select>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Status</th>
              <th>RPS</th>
              <th>P50</th>
              <th>P95</th>
              <th>P99</th>
              <th>Error %</th>
              <th>P95 Trend</th>
            </tr>
          </thead>
          <tbody>
            ${DATA.apiMetrics.map(m => {
              const maxP95 = Math.max(...DATA.apiMetrics.map(x => x.p95));
              const pct = Math.min(100, Math.round((m.p95/maxP95)*100));
              const cls = m.p95 < 200 ? 'latency-good' : m.p95 < 1000 ? 'latency-ok' : 'latency-slow';
              return `
              <tr>
                <td class="mono-cell" style="font-size:11.5px">${m.endpoint}</td>
                <td><span class="chip chip-${m.status}">${m.status}</span></td>
                <td class="mono-cell">${m.rps}</td>
                <td class="mono-cell">${m.p50}ms</td>
                <td class="mono-cell">${m.p95}ms</td>
                <td class="mono-cell" style="color:${m.p99>5000?'var(--color-error)':'inherit'}">${m.p99}ms</td>
                <td class="mono-cell" style="color:${m.errors>2?'var(--color-error)':m.errors>0.5?'var(--color-warn)':'var(--color-ok)'}">${m.errors}%</td>
                <td style="min-width:120px">
                  <div class="latency-bar">
                    <div class="latency-fill ${cls}" style="width:${pct}%;height:4px;border-radius:2px;"></div>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Live counter animation
  let tick = 0;
  setInterval(() => {
    tick++;
    const rps = $('#header-time');
  }, 2000);
}

/* ──────────────────────────────────────────────────────────────
   PAGE: Ingestion Queue
─────────────────────────────────────────────────────────────── */
function renderIngestion(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Ingestion Queue</h1>
        <span class="page-subtitle">// OGD · OSM · Wikimedia · Manual uploads · pending review</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V7M6 7L3.5 4.5M6 7L8.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 9V10.5C1 10.8 1.2 11 1.5 11H10.5C10.8 11 11 10.8 11 10.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Upload CSV
        </button>
        <button class="btn btn-primary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V8M6 2L3.5 4.5M6 2L8.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 9V10.5C1 10.8 1.2 11 1.5 11H10.5C10.8 11 11 10.8 11 10.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Trigger OGD Sync
        </button>
      </div>
    </div>

    <div class="metric-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
      ${MetricCard({ label:'Pending Review', value:'71', delta:'–7', deltaLabel:'resolved today', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3L12 11H2L7 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 6V8M7 9V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Imported Today', value:'1,206', delta:'+46%', deltaLabel:'vs yesterday', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5V9.5M7 1.5L4.5 4.5M7 1.5L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 10V12H12V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
      ${MetricCard({ label:'Validation Pass%', value:'94.2%', delta:'-1.8%', deltaLabel:'vs last batch', deltaDir:'down',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5 10L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })}
    </div>

    <div class="panel" style="margin-bottom:24px">
      <div class="panel-header">
        <span class="panel-title">Queue Items <span class="nav-badge nav-badge--warning" style="margin-left:8px">5 active</span></span>
      </div>
      <div>
        ${DATA.ingestionQueue.map(q => `
        <div class="queue-item">
          <div class="queue-item-icon queue-item-icon--${q.type}">
            ${q.type === 'review'
              ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12 10H2L7 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 6V8M7 9.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
              : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5V8.5M7 1.5L4.5 4M7 1.5L9.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 9V11C2 11.6 2.4 12 3 12H11C11.6 12 12 11.6 12 11V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
            }
          </div>
          <div class="queue-item-body">
            <div class="queue-item-name">${q.source}</div>
            <div class="queue-item-meta">
              <span class="queue-item-meta-val">${q.records.toLocaleString()} total records</span>
              <span class="queue-item-meta-val" style="color:${q.pending>0?'var(--color-warn)':'var(--color-ok)'}">${q.pending} pending review</span>
              <span class="queue-item-meta-val">${q.source_url}</span>
              <span class="queue-item-meta-val">by ${q.assignee}</span>
              <span class="queue-item-meta-val">${formatDateTime(q.queued_at)}</span>
            </div>
            <div class="queue-item-actions">
              ${q.pending > 0 ? `
                <button class="btn btn-primary" style="font-size:11px;padding:4px 10px">Review ${q.pending} Records</button>
                <button class="btn btn-secondary" style="font-size:11px;padding:4px 10px">Auto-Approve</button>
                <button class="btn btn-ghost" style="font-size:11px;padding:4px 10px">Skip</button>
              ` : `<span class="chip chip-active">Completed</span>`}
            </div>
          </div>
          <div style="margin-left:auto;display:flex;align-items:flex-start">
            <span class="chip chip-${q.type==='review'?'pending':'draft'}">${q.type}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Validation Rules Panel -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Validation Pipeline</span>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Check</th>
              <th>Pass Rate</th>
              <th>Failures Today</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { rule:'R-01', check:'Coordinate range validity', pass:99.8, failures:4, action:'auto-reject' },
              { rule:'R-02', check:'Required fields: name, state, category, location', pass:97.4, failures:28, action:'human-review' },
              { rule:'R-03', check:'Duplicate: name similarity + ≤500m proximity', pass:94.2, failures:62, action:'human-review' },
              { rule:'R-04', check:'State value from allowed enum', pass:99.1, failures:9, action:'auto-correct' },
              { rule:'R-05', check:'Category from taxonomy v2.3', pass:96.8, failures:34, action:'human-review' },
            ].map(r => `
            <tr>
              <td class="mono-cell">${r.rule}</td>
              <td style="font-size:12px">${r.check}</td>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="latency-fill ${r.pass>97?'latency-good':r.pass>95?'latency-ok':'latency-slow'}" style="width:${r.pass}px;height:4px;border-radius:2px;"></div>
                  <span class="mono-cell">${r.pass}%</span>
                </div>
              </td>
              <td class="mono-cell" style="color:${r.failures>30?'var(--color-error)':r.failures>10?'var(--color-warn)':'var(--color-ok)'}">${r.failures}</td>
              <td><span class="chip chip-${r.action==='auto-reject'?'inactive':r.action==='auto-correct'?'active':'pending'}">${r.action}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: Stays
─────────────────────────────────────────────────────────────── */
function renderStays(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Stays</h1>
        <span class="page-subtitle">// curated accommodation · OTA affiliate links · budget bands</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Add Stay
        </button>
      </div>
    </div>
    <div class="empty-state" style="margin-top:40px">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="color:var(--text-tertiary)"><path d="M4 26V14L16 6L28 14V26" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="12" y="18" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M4 18H28" stroke="currentColor" stroke-width="1.5"/></svg>
      <div class="empty-state-code">
        <pre>// module: stays_manager
// status: schema_ready
// records: awaiting_import
//
// GET /v1/stays → []
// run: admin pois import --category=stay
// or: Upload stays CSV via Ingestion tab</pre>
      </div>
      <button class="btn btn-primary" onclick="navigate('ingestion')">Go to Ingestion →</button>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: Trips
─────────────────────────────────────────────────────────────── */
function renderTrips(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Trips</h1>
        <span class="page-subtitle">// AI-generated & user-saved itineraries · Gemini 1.5 Pro planner</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary">Export Public Trips</button>
      </div>
    </div>

    <div class="metric-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
      ${MetricCard({ label:'Total Trips', value:'19,480', delta:'+1,230', deltaLabel:'this month', deltaDir:'up',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L5 7L8 9L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })}
      ${MetricCard({ label:'AI-Generated', value:'12,340', delta:'63.3%', deltaLabel:'of total trips', deltaDir:'neutral',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' })}
      ${MetricCard({ label:'Avg Trip Cost (₹)', value:'8,240', delta:'+₹340', deltaLabel:'vs last month', deltaDir:'down',
        iconSVG:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4H11M3 7H9M5 10H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' })}
    </div>

    <div class="empty-state" style="margin-top:40px">
      <div class="empty-state-code">
        <pre>// trips table: 19,480 records
// filter: user_id, date_range, region
// ai_planner: gemini-1.5-pro
//
// Pagination UI coming in v0.2
// Schema: trips.itinerary (JSONB)
// Edge fn: /plan-trip → avg 1.2s</pre>
      </div>
      <p style="color:var(--text-tertiary);font-size:12px">Detailed Trip Explorer UI is in progress</p>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: Settings
─────────────────────────────────────────────────────────────── */
function renderSettings(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Settings</h1>
        <span class="page-subtitle">// system configuration · API keys · feature flags · env vars</span>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="save-settings-btn">Save Changes</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
      <!-- API Keys Form -->
      <div class="panel">
        <div class="panel-header"><span class="panel-title">API Keys & Secrets</span></div>
        <div class="panel-body">
          <p style="font-size:11px;color:var(--text-tertiary);margin-bottom:16px;font-family:var(--font-mono)">// Keys loaded from --dart-define env vars. Never stored in DB.</p>

          ${[
            { id:'supabase-url', label:'Supabase Project URL', val:'https://xyzproject.supabase.co' },
            { id:'supabase-anon', label:'Supabase Anon Key', val:'eyJh…[redacted]' },
            { id:'gemini-key', label:'Gemini API Key (Edge Fn)', val:'AIza…[redacted]' },
            { id:'ors-key', label:'OpenRouteService API Key', val:'5b3d…[redacted]' },
            { id:'maptiler-key', label:'MapTiler Key', val:'abc1…[redacted]' },
          ].map(f => `
          <div class="form-group">
            <input class="form-input" id="${f.id}" placeholder=" " value="${f.val}" type="${f.id.includes('key')||f.id.includes('anon')?'password':'text'}" autocomplete="off" />
            <label class="float-label" for="${f.id}">${f.label}</label>
          </div>`).join('')}
        </div>
      </div>

      <!-- Feature Flags -->
      <div style="display:flex;flex-direction:column;gap:24px">
        <div class="panel">
          <div class="panel-header"><span class="panel-title">Feature Flags</span></div>
          <div>
            ${[
              { key:'ai_trip_planner', label:'AI Trip Planner (Gemini)', val:true },
              { key:'offline_mode', label:'Offline Bundle Download', val:true },
              { key:'traffic_overlay', label:'TomTom Traffic Overlay', val:false },
              { key:'social_sharing', label:'Trip Social Sharing', val:true },
              { key:'multilingual_ai', label:'Multilingual AI Guide', val:false },
              { key:'booking_links', label:'OTA Booking Deep Links', val:true },
            ].map(f => `
            <div class="telemetry-row">
              <span class="telemetry-label">${f.label}</span>
              <span class="mono-cell" style="font-size:10.5px;color:var(--text-tertiary);flex:1;margin:0 16px">${f.key}</span>
              <button
                class="btn ${f.val?'btn-primary':'btn-secondary'} flag-toggle"
                style="font-size:10.5px;padding:3px 10px;min-width:52px"
                data-key="${f.key}"
                data-val="${f.val}"
                aria-pressed="${f.val}"
              >${f.val ? 'ON' : 'OFF'}</button>
            </div>`).join('')}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header"><span class="panel-title">Ingestion Rate Limits</span></div>
          <div class="panel-body">
            ${[
              { id:'overpass-ttl', label:'Overpass Cache TTL (hours)', val:'6' },
              { id:'ogd-batch', label:'OGD Batch Size (records)', val:'500' },
              { id:'img-concurrent', label:'Concurrent Image Downloads', val:'8' },
            ].map(f => `
            <div class="form-group">
              <input class="form-input" id="${f.id}" placeholder=" " value="${f.val}" type="text" />
              <label class="float-label" for="${f.id}">${f.label}</label>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Feature flag toggles
  $$('.flag-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOn = btn.dataset.val === 'true';
      btn.dataset.val = String(!isOn);
      btn.textContent = !isOn ? 'ON' : 'OFF';
      btn.className = `btn ${!isOn ? 'btn-primary' : 'btn-secondary'} flag-toggle`;
      btn.setAttribute('aria-pressed', String(!isOn));
    });
  });

  // Floating labels
  $$('.form-input').forEach(input => {
    if (input.value) input.classList.add('has-value');
  });

  $('#save-settings-btn')?.addEventListener('click', () => {
    const btn = $('#save-settings-btn');
    const prev = btn.textContent;
    btn.textContent = 'Saving…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Saved';
      btn.className = 'btn btn-secondary';
      setTimeout(() => { btn.textContent = prev; btn.disabled = false; btn.className = 'btn btn-primary'; }, 2000);
    }, 800);
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: 404
─────────────────────────────────────────────────────────────── */
function renderNotFound(container) {
  container.innerHTML = `
    <div class="empty-state" style="margin-top:80px">
      <div class="empty-state-code">
        <pre>// Error: route_not_found
// requested_page: "${State.currentPage}"
// status: 404
// action: navigate_to_known_route()</pre>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   LIVE DATA SIMULATION — update metrics every 3s
─────────────────────────────────────────────────────────────── */
function startLiveData() {
  setInterval(() => {
    State.realtimeTick++;
    // Jitter API RPS values slightly
    DATA.apiMetrics.forEach(m => {
      m.rps = parseFloat((m.rps + (Math.random() * 4 - 2)).toFixed(1));
      m.p50 = Math.max(10, m.p50 + Math.floor(Math.random() * 10 - 5));
    });
  }, 3000);
}

/* ──────────────────────────────────────────────────────────────
   REFRESH BUTTON
─────────────────────────────────────────────────────────────── */
function initRefreshBtn() {
  const btn = $('#refresh-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.querySelector('svg').style.animation = 'spin 0.5s linear';
    setTimeout(() => {
      btn.querySelector('svg').style.animation = '';
      renderPage(State.currentPage);
    }, 500);
  });
}

/* ──────────────────────────────────────────────────────────────
   BOOT
─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Update user in sidebar
  const avatar = document.querySelector('.user-avatar');
  const uName  = document.querySelector('.user-name');
  const uRole  = document.querySelector('.user-role');
  if (avatar) avatar.textContent = State.user.initials;
  if (uName)  uName.textContent  = State.user.name;
  if (uRole)  uRole.textContent  = State.user.role;

  initSidebar();
  startClock();
  startLiveData();
  renderPage('dashboard');

  // Defer refresh btn init (needs DOM from renderPage)
  setTimeout(initRefreshBtn, 100);
});
