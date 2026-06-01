// Shared data — list of apps for Apps Index and Detail pages.
//
// Lifecycle model:
//   lifecycle = 'draft-only' | 'production-only' | 'has-draft'
//   - draft-only: created, never deployed (no production version exists yet)
//   - production-only: deployed, user has no personal draft (stable)
//   - has-draft: production exists AND current user has a personal draft
//
// When lifecycle === 'has-draft', syncState describes draft↔production relationship:
//   syncState = 'up-to-date' | 'behind' | 'conflict'
//
// `status` (published/stopped/failed) applies only to the production deployment —
// i.e. when lifecycle !== 'draft-only'.

const APPS = [
  {
    id: "customer-analytics",
    name: "Customer Analytics",
    desc: "Customer analytics workspace for monitoring retention, churn risk, revenue trends and account health across enterprise segments.",
    lifecycle: "has-draft",
    syncState: "behind",
    status: "published",
    statusLabel: "Published",
    repo: "managed",
    repoLabel: "Keboola-managed",
    draftAge: "12m",
    publishedAt: "2 days ago",
    runsToday: 248,
    users: 47,
    owner: "Sarah Hájková",
    url: "keboola.app/apps/customer-analytics",
  },
  {
    id: "sales-pipeline",
    name: "Sales Pipeline",
    desc: "Live pipeline view for revenue ops — stalled deals, win-rate by source, AE leaderboard.",
    lifecycle: "production-only",
    status: "published",
    statusLabel: "Published",
    repo: "external",
    repoLabel: "External · GitHub",
    publishedAt: "5 days ago",
    runsToday: 96,
    users: 23,
    owner: "Pavel Novak",
    url: "keboola.app/apps/sales-pipeline",
  },
  {
    id: "lead-scoring",
    name: "Lead Scoring",
    desc: "Internal app that scores inbound leads daily and lets sales mark them as qualified.",
    lifecycle: "has-draft",
    syncState: "up-to-date",
    status: "published",
    statusLabel: "Published",
    repo: "managed",
    repoLabel: "Keboola-managed",
    draftAge: "1h",
    publishedAt: "Yesterday",
    runsToday: 124,
    users: 18,
    owner: "Sarah Hájková",
    url: "keboola.app/apps/lead-scoring",
  },
  {
    id: "marketing-attribution",
    name: "Marketing Attribution",
    desc: "Compare last-touch and data-driven attribution across paid channels and campaigns.",
    lifecycle: "production-only",
    status: "stopped",
    statusLabel: "Stopped",
    repo: "managed",
    repoLabel: "Keboola-managed",
    publishedAt: "2 wk ago",
    runsToday: 0,
    users: 4,
    owner: "Tomas Fiala",
    url: "keboola.app/apps/marketing-attribution",
  },
  {
    id: "inventory-health",
    name: "Inventory Health",
    desc: "Reorder alerts and slow-moving SKU detection across all 14 EU warehouses.",
    lifecycle: "production-only",
    status: "published",
    statusLabel: "Published",
    repo: "managed",
    repoLabel: "Keboola-managed",
    publishedAt: "3 days ago",
    runsToday: 312,
    users: 31,
    owner: "Pavel Novak",
    url: "keboola.app/apps/inventory-health",
  },
  {
    id: "exec-snapshot",
    name: "Exec Snapshot",
    desc: "One-screen executive view of MRR, headcount and pipeline coverage — emailed every Monday.",
    lifecycle: "production-only",
    status: "failed",
    statusLabel: "Last run failed",
    repo: "managed",
    repoLabel: "Keboola-managed",
    publishedAt: "4 days ago",
    runsToday: 0,
    users: 8,
    owner: "Sarah Hájková",
    url: "keboola.app/apps/exec-snapshot",
  },
  {
    id: "pricing-workbench",
    name: "Pricing Workbench",
    desc: "Scenario modeller for SKU pricing changes — sandboxed against last quarter's transactions.",
    lifecycle: "draft-only",
    status: null,
    statusLabel: "Not deployed yet",
    repo: "managed",
    repoLabel: "Keboola-managed",
    draftAge: "just now",
    publishedAt: "Never deployed",
    runsToday: 0,
    users: 1,
    owner: "Sarah Hájková",
    url: "keboola.app/apps/pricing-workbench",
  },
];

// Draft activity for the "active" app — these are YOUR personal edits only.
const DRAFT_ACTIVITY = [
  { line: "You regenerated the KPI section with churn-risk delta", meta: "8b7c1f3", time: "12 min ago", with: "Kai" },
  { line: "You renamed the dashboard title to 'Customer health'",  meta: "a2f4be1", time: "14 min ago", with: null },
  { line: "You added a customer segmentation table",                meta: "44cbf03", time: "38 min ago", with: "Kai" },
  { line: "You connected in.c-marts.churn_risk",                    meta: "f12acc8", time: "1 h ago",    with: "Kai" },
  { line: "You changed the default filter to last 30 days",         meta: "c08291d", time: "2 h ago",    with: null },
  { line: "You improved mobile layout — KPI cards stack <640px",    meta: "29ef0b1", time: "Yesterday 16:12", with: "Kai" },
  { line: "You started this draft from Production v1.4.2",          meta: "00000bb", time: "Yesterday 14:48", with: null },
];

// Changes that landed on Production AFTER your draft was created.
// Used in 'behind' and 'conflict' states.
const PRODUCTION_INCOMING = [
  { line: "KPI layout updated — added 'Net retention' card", area: "KPI section", who: "Pavel Novak", time: "2 h ago", overlap: true },
  { line: "Default filter changed to rolling 30 days",      area: "Filter logic", who: "Pavel Novak", time: "2 h ago", overlap: true },
  { line: "Churn dataset schema updated — added risk_band column", area: "Data sources", who: "Tomas Fiala", time: "5 h ago", overlap: false },
  { line: "Mobile responsiveness improved on the accounts table",  area: "Accounts table", who: "Pavel Novak", time: "Yesterday 18:04", overlap: false },
];

const CONFLICT_AREAS = [
  {
    id: "kpi",
    title: "KPI section",
    yours: "Regenerated cards with churn-risk delta",
    theirs: "Added 'Net retention' card · reordered columns",
    suggestion: "Keep your churn-risk delta and add the new Net retention card from production.",
  },
  {
    id: "filters",
    title: "Filter logic",
    yours: "Default filter changed to last 30 days",
    theirs: "Default filter changed to rolling 30 days",
    suggestion: "Equivalent intent — adopt production's 'rolling 30 days' wording for consistency.",
  },
];

const RUNS = [
  { status: "running",  trigger: "Schedule · hourly",  duration: "—",      started: "just now",     by: "system",            id: "j_2f1aa9" },
  { status: "success",  trigger: "Schedule · hourly",  duration: "1m 42s", started: "1 hour ago",   by: "system",            id: "j_2f1a08" },
  { status: "success",  trigger: "Manual",             duration: "2m 04s", started: "1 h 18m ago",  by: "Sarah Hájková",    id: "j_2f0fe5" },
  { status: "success",  trigger: "Webhook · stripe",   duration: "0m 22s", started: "2 h 04m ago",  by: "system",            id: "j_2f0ec1" },
  { status: "failed",   trigger: "Schedule · hourly",  duration: "0m 12s", started: "3 h ago",      by: "system",            id: "j_2f0d2a" },
  { status: "success",  trigger: "Schedule · hourly",  duration: "1m 38s", started: "4 h ago",      by: "system",            id: "j_2f0bbc" },
  { status: "success",  trigger: "Manual",             duration: "3m 14s", started: "5 h ago",      by: "Pavel Novak",       id: "j_2f0a4e" },
  { status: "success",  trigger: "Schedule · hourly",  duration: "1m 50s", started: "6 h ago",      by: "system",            id: "j_2f08e0" },
  { status: "success",  trigger: "Deploy · v1.4.2",    duration: "0m 48s", started: "Yesterday, 16:18", by: "Sarah Hájková", id: "j_2f0712" },
  { status: "success",  trigger: "Manual",             duration: "1m 04s", started: "Yesterday, 11:02", by: "Tomas Fiala",   id: "j_2f0598" },
];

const TERMINAL_LOGS = [
  { t: "2026-05-25 14:48:12", lv: "INFO", lvl: "info",    m: "Build started · commit 8b7c1f3 (HEAD draft)" },
  { t: "2026-05-25 14:48:12", lv: "KAI",  lvl: "kai",     m: "Resolving data context · 1 source, 3 tables" },
  { t: "2026-05-25 14:48:13", lv: "INFO", lvl: "info",    m: "Pulled in.c-marts.customers (2.41M rows, schema v17)" },
  { t: "2026-05-25 14:48:13", lv: "INFO", lvl: "info",    m: "Pulled in.c-marts.orders (8.92M rows, schema v22)" },
  { t: "2026-05-25 14:48:14", lv: "INFO", lvl: "info",    m: "Pulled in.c-marts.churn_risk (2.41M rows, schema v3)" },
  { t: "2026-05-25 14:48:14", lv: "INFO", lvl: "info",    m: "Compiling streamlit + duckdb runtime · python 3.11" },
  { t: "2026-05-25 14:48:18", lv: "WARN", lvl: "warn",    m: "pandas 2.2.0 deprecation · DataFrame.applymap (will warn at runtime)" },
  { t: "2026-05-25 14:48:21", lv: "INFO", lvl: "info",    m: "Compiled bundle · 2.4 MB · 184 modules" },
  { t: "2026-05-25 14:48:21", lv: "KAI",  lvl: "kai",     m: "Generated 7 components · KPI · RevenueChart · SegmentDonut · AccountsTable · …" },
  { t: "2026-05-25 14:48:22", lv: "INFO", lvl: "info",    m: "Smoke test · GET / · 200 OK · 142ms" },
  { t: "2026-05-25 14:48:22", lv: "INFO", lvl: "info",    m: "Smoke test · GET /accounts · 200 OK · 88ms" },
  { t: "2026-05-25 14:48:22", lv: "OK",   lvl: "success", m: "All checks passed · 7/7" },
  { t: "2026-05-25 14:48:22", lv: "OK",   lvl: "success", m: "Draft preview ready at keboola.app/apps/customer-analytics/draft" },
  { t: "2026-05-25 15:02:08", lv: "INFO", lvl: "info",    m: "Run · scheduled · trigger=hourly · job=j_2f1aa9" },
  { t: "2026-05-25 15:02:08", lv: "INFO", lvl: "info",    m: "Source freshness check · in.c-marts.customers · last sync 4m ago · OK" },
  { t: "2026-05-25 15:02:09", lv: "INFO", lvl: "info",    m: "Refreshing 4 KPI cards · 1 chart · 1 table" },
  { t: "2026-05-25 15:02:10", lv: "OK",   lvl: "success", m: "Render complete · 1.42s · cached for 60s" },
];

Object.assign(window, { APPS, DRAFT_ACTIVITY, PRODUCTION_INCOMING, CONFLICT_AREAS, RUNS, TERMINAL_LOGS, VERSIONS, DRAFT_CHECKPOINTS });

// ── Builder draft checkpoints ────────────────────────────────────────────
// Lightweight working-history snapshots inside the user's CURRENT personal
// draft. These are NOT releases — restoring them updates the live draft in
// place, doesn't create a new draft.
const DRAFT_CHECKPOINTS = [
  { id: "c12", label: "Current state · auto-saved",            kind: "autosave", time: "just now",      author: "you",        current: true },
  { id: "c11", label: "Added retention cohort section",        kind: "kai",      time: "4 min ago",     author: "Kai" },
  { id: "c10", label: "Tweaked KPI layout · 4 cards in one row", kind: "edit",   time: "12 min ago",    author: "you" },
  { id: "c9",  label: "Kai regenerated filter logic",          kind: "kai",      time: "28 min ago",    author: "Kai" },
  { id: "c8",  label: "Before mobile optimization",            kind: "checkpoint", time: "1 h ago",     author: "you" },
  { id: "c7",  label: "Imported in.c-marts.churn_risk",        kind: "kai",      time: "1 h 18 min ago", author: "Kai" },
  { id: "c6",  label: "Added customer segmentation table",     kind: "edit",     time: "2 h ago",       author: "you" },
  { id: "c5",  label: "Kai redrew the revenue trend chart",    kind: "kai",      time: "2 h 22 min ago", author: "Kai" },
  { id: "c4",  label: "Renamed dashboard to Customer health",  kind: "edit",     time: "Yesterday 16:08", author: "you" },
  { id: "c3",  label: "Before KPI redesign",                   kind: "checkpoint", time: "Yesterday 15:42", author: "you" },
];

// ── App release / version history ───────────────────────────────────────
// These are the published app versions a user can explore and restore.
// NOT git commits — surface-level releases with productized summaries.
const VERSIONS = [
  {
    v: "v1.4.3", n: 12,
    label: "Net retention KPI + rolling 30d filter",
    author: "Pavel Novak",
    when: "2 hours ago",
    isProduction: true,
    runs: 248,
    summary: [
      { kind: "added",    text: "Added Net retention KPI card",                  area: "KPI section" },
      { kind: "changed",  text: "Default filter changed to rolling 30 days",     area: "Filter logic" },
      { kind: "added",    text: "Mobile responsiveness improved on accounts table", area: "Accounts table" },
      { kind: "added",    text: "Risk-band column from churn dataset",           area: "Data sources" },
    ],
  },
  {
    v: "v1.4.2", n: 11,
    label: "Churn risk delta + segmentation table",
    author: "Sarah Hájková",
    when: "2 days ago",
    isProduction: false,
    runs: 312,
    summary: [
      { kind: "added",   text: "Churn-risk delta on the Churn KPI",                area: "KPI section" },
      { kind: "added",   text: "Customer segmentation table below charts",        area: "Layout" },
      { kind: "changed", text: "Default segment view set to Mid-market",          area: "Filter logic" },
    ],
  },
  {
    v: "v1.4.1", n: 10,
    label: "Cohort retention chart",
    author: "Sarah Hájková",
    when: "5 days ago",
    isProduction: false,
    runs: 1842,
    summary: [
      { kind: "added",   text: "Weekly cohort retention chart from orders",       area: "Layout" },
      { kind: "changed", text: "Segments donut → bar chart toggle",               area: "Charts" },
    ],
  },
  {
    v: "v1.4.0", n: 9,
    label: "ARR sources rewired to in.c-marts",
    author: "Tomas Fiala",
    when: "1 wk ago",
    isProduction: false,
    runs: 4218,
    summary: [
      { kind: "changed", text: "ARR aggregation now reads from in.c-marts.customers", area: "Data sources" },
      { kind: "removed", text: "Removed deprecated legacy CSV import",             area: "Data sources" },
    ],
  },
  {
    v: "v1.3.0", n: 8,
    label: "Top accounts table + sortable columns",
    author: "Sarah Hájková",
    when: "2 wk ago",
    isProduction: false,
    runs: 8104,
    summary: [
      { kind: "added",   text: "Top accounts table with status pills",            area: "Layout" },
      { kind: "added",   text: "Sortable columns on accounts table",              area: "Accounts table" },
    ],
  },
  {
    v: "v1.2.0", n: 7,
    label: "Revenue trend area chart",
    author: "Pavel Novak",
    when: "1 mo ago",
    isProduction: false,
    runs: 14299,
    summary: [
      { kind: "added",   text: "Revenue trend area chart with year-over-year overlay", area: "Charts" },
    ],
  },
  {
    v: "v1.0.0", n: 1,
    label: "Initial release · scaffolded by Kai",
    author: "Sarah Hájková",
    when: "3 mo ago",
    isProduction: false,
    runs: 22000,
    summary: [
      { kind: "added",   text: "Initial dashboard scaffolded from prompt",         area: "Initial scaffold" },
    ],
  },
];
