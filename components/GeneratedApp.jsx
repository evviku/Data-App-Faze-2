// The generated app — a live "Customer analytics" dashboard preview.
// Realistic Keboola-style data; minimal interactivity (filters + segment toggle).

const REVENUE_SERIES = {
  "30d": [
    {x:"Apr 24", a:142, b:118}, {x:"Apr 27", a:158, b:124}, {x:"Apr 30", a:151, b:131},
    {x:"May 3",  a:172, b:138}, {x:"May 6",  a:168, b:142}, {x:"May 9",  a:184, b:151},
    {x:"May 12", a:201, b:163}, {x:"May 15", a:195, b:171}, {x:"May 18", a:218, b:182},
    {x:"May 21", a:232, b:194}, {x:"May 24", a:247, b:205},
  ],
  "7d": [
    {x:"Mon", a:201, b:163}, {x:"Tue", a:195, b:171}, {x:"Wed", a:218, b:182},
    {x:"Thu", a:232, b:194}, {x:"Fri", a:247, b:205}, {x:"Sat", a:226, b:198}, {x:"Sun", a:251, b:212},
  ],
  "90d": [
    {x:"Mar", a:118, b:96}, {x:"Mar 15", a:128, b:106}, {x:"Apr", a:142, b:118},
    {x:"Apr 15", a:151, b:131}, {x:"May", a:172, b:138}, {x:"May 15", a:218, b:182}, {x:"Today", a:247, b:205},
  ],
};

const SEGMENTS_BY_FILTER = {
  All: [
    {n:"Mid-market",     v: 41, c:"#005CB8"},
    {n:"Enterprise",     v: 27, c:"#1F8FFF"},
    {n:"SMB",            v: 22, c:"#7CBDFE"},
    {n:"Self-serve",     v: 10, c:"#B1D6FC"},
  ],
  "EU only": [
    {n:"Mid-market",     v: 38, c:"#005CB8"},
    {n:"Enterprise",     v: 31, c:"#1F8FFF"},
    {n:"SMB",            v: 24, c:"#7CBDFE"},
    {n:"Self-serve",     v:  7, c:"#B1D6FC"},
  ],
  "Past 30 days": [
    {n:"Mid-market",     v: 44, c:"#005CB8"},
    {n:"Enterprise",     v: 25, c:"#1F8FFF"},
    {n:"SMB",            v: 21, c:"#7CBDFE"},
    {n:"Self-serve",     v: 10, c:"#B1D6FC"},
  ],
};

const ACCOUNTS = [
  { n: "Lumen Aerospace",    seg: "Enterprise",  arr: "$184k", churn: "0.4%", health: "success", t: "Healthy" },
  { n: "Northwind Analytics", seg: "Mid-market",  arr: "$72k",  churn: "1.2%", health: "success", t: "Healthy" },
  { n: "Brigid & Cole",       seg: "SMB",         arr: "$18k",  churn: "2.8%", health: "warn",    t: "At risk" },
  { n: "Polaris Foods",       seg: "Enterprise",  arr: "$210k", churn: "0.7%", health: "success", t: "Healthy" },
  { n: "Helix Bio",           seg: "Mid-market",  arr: "$58k",  churn: "3.4%", health: "warn",    t: "At risk" },
  { n: "Argo22 Internal",     seg: "Mid-market",  arr: "$0",    churn: "—",    health: "muted",   t: "Internal" },
  { n: "Cobalt Logistics",    seg: "SMB",         arr: "$9.2k", churn: "5.1%", health: "danger",  t: "Churning" },
];

const GeneratedApp = ({ kpiTone, density, range, setRange, segmentMode, setSegmentMode, filter, setFilter, editable }) => {
  const series = REVENUE_SERIES[range] || REVENUE_SERIES["30d"];
  const segments = SEGMENTS_BY_FILTER[filter] || SEGMENTS_BY_FILTER.All;

  const kpis = [
    { l: "Active customers", v: filter === "EU only" ? "1,184" : "2,419", d: "+4.8%", up: true },
    { l: "MRR", v: filter === "Past 30 days" ? "$248k" : "$312k", d: "+12.4%", up: true },
    { l: "Net retention", v: "108.2%", d: "+1.2pt", up: true },
    { l: "Churn (30d)", v: "1.8%", d: "-0.3pt", up: false /* good actually */ },
  ];

  return (
    <div className={`db-canvas-frame db-fade ${editable ? "editable" : ""}`}>
      <div className="app-head">
        <div>
          <h2 className="app-title" data-editable>Customer analytics</h2>
          <p className="app-sub">Daily refresh · last sync 4 min ago · <span className="kb-mono">in.c-marts.customers</span></p>
        </div>
        <div className="app-filters">
          {["All", "EU only", "Past 30 days"].map((f) => (
            <button
              key={f}
              className={`app-filter ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {filter === f && <KbIcon name="check" size={12} />}
              {f}
            </button>
          ))}
          <button className="app-filter" title="More filters">
            <KbIcon name="filter" size={12} />
          </button>
        </div>
      </div>

      <div className="app-body">
        <div className="app-kpis" data-editable>
          {kpis.map((k) => (
            <div className="app-kpi" key={k.l}>
              <span className="label">{k.l}</span>
              <span className="value" style={kpiTone === "accent" ? {color: "var(--color-keboola-700)"} : null}>
                {k.v}
              </span>
              <span className={`delta ${k.up ? "up" : "down"}`}>
                <KbIcon name={k.up ? "trending-up" : "trending-down"} size={12} />
                {k.d} vs prior
              </span>
              <span className="spark"><Sparkline /></span>
            </div>
          ))}
        </div>

        <div className="app-grid">
          <div className="app-card" data-editable>
            <div className="app-card-head">
              <div>
                <h4>Revenue trend</h4>
                <div className="sub">Daily MRR ($k) · {range === "7d" ? "Last 7 days" : range === "90d" ? "Last 90 days" : "Last 30 days"}</div>
              </div>
              <div className="kb-row" style={{gap: 12}}>
                <div className="app-legend">
                  <span><span className="sw" style={{background: "#005CB8"}}></span>This year</span>
                  <span><span className="sw" style={{background: "#CBD5E1"}}></span>Last year</span>
                </div>
                <div className="device" style={{
                  display: "inline-flex", background: "var(--muted)", borderRadius: 8, padding: 2, gap: 2
                }}>
                  {["7d","30d","90d"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      style={{
                        height: 24, padding: "0 8px", border: 0, borderRadius: 6,
                        background: range === r ? "#fff" : "transparent",
                        color: range === r ? "var(--foreground)" : "var(--foreground-muted)",
                        font: "500 11px var(--font-mono)",
                        cursor: "pointer",
                        boxShadow: range === r ? "var(--shadow-xs)" : "none",
                      }}
                    >{r.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="app-chart">
              <RevenueChart data={series} />
            </div>
          </div>

          <div className="app-card" data-editable>
            <div className="app-card-head">
              <div>
                <h4>Segments</h4>
                <div className="sub">Share of ARR · {filter}</div>
              </div>
              <div className="device" style={{
                display: "inline-flex", background: "var(--muted)", borderRadius: 8, padding: 2, gap: 2
              }}>
                {[
                  {id: "donut", icon: "circle-dot"},
                  {id: "bars", icon: "bar-chart"},
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSegmentMode(m.id)}
                    style={{
                      height: 24, padding: "0 8px", border: 0, borderRadius: 6,
                      background: segmentMode === m.id ? "#fff" : "transparent",
                      color: segmentMode === m.id ? "var(--foreground)" : "var(--foreground-muted)",
                      cursor: "pointer",
                      display: "inline-flex", alignItems: "center", gap: 4,
                      boxShadow: segmentMode === m.id ? "var(--shadow-xs)" : "none",
                    }}
                  >
                    <KbIcon name={m.icon} size={11} />
                  </button>
                ))}
              </div>
            </div>
            <div className="app-chart">
              {segmentMode === "donut"
                ? <SegmentDonut data={segments} />
                : <SegmentBars data={segments} />}
            </div>
          </div>
        </div>

        <div className="app-card" data-editable>
          <div className="app-card-head">
            <div>
              <h4>Top accounts</h4>
              <div className="sub">Sorted by ARR · {ACCOUNTS.length} of 2,419</div>
            </div>
            <button className="db-secondary-btn" type="button">
              <KbIcon name="arrow-up-right" size={12} />
              Open in Storage
            </button>
          </div>
          <table className="app-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Segment</th>
                <th style={{textAlign: "right"}}>ARR</th>
                <th style={{textAlign: "right"}}>Churn risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.slice(0, density === "compact" ? 7 : 5).map((a, i) => (
                <tr key={i}>
                  <td>
                    <span className="kb-row" style={{gap: 8}}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: "var(--muted)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        font: "600 10px var(--font-sans)",
                        color: "var(--foreground-muted)",
                      }}>{a.n.split(" ").map(w => w[0]).slice(0,2).join("")}</span>
                      <span style={{fontWeight: 500}}>{a.n}</span>
                    </span>
                  </td>
                  <td className="kb-muted">{a.seg}</td>
                  <td className="kb-mono" style={{textAlign: "right", fontSize: 12.5}}>{a.arr}</td>
                  <td className="kb-mono" style={{textAlign: "right", fontSize: 12.5}}>{a.churn}</td>
                  <td>
                    <span className={`app-pill ${a.health}`}>
                      <span className="dot"></span>
                      {a.t}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── Charts ──────────────────────────────────────────────── */
const Sparkline = () => {
  // tiny inline sparkline; varied per call by phase
  const pts = [4, 7, 6, 9, 8, 12, 10, 14, 13, 17, 16, 21];
  const max = Math.max(...pts), min = Math.min(...pts);
  const w = 64, h = 22;
  const x = (i) => (i / (pts.length - 1)) * w;
  const y = (v) => h - ((v - min) / (max - min)) * h;
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke="var(--color-keboola-500)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const RevenueChart = ({ data }) => {
  const W = 640, H = 200, PAD = {l: 36, r: 12, t: 12, b: 28};
  const vals = data.flatMap(d => [d.a, d.b]);
  const ymax = Math.ceil(Math.max(...vals) / 50) * 50;
  const ymin = 0;
  const x = (i) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v) => H - PAD.b - ((v - ymin) / (ymax - ymin)) * (H - PAD.t - PAD.b);

  const path = (key) => data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(" ");
  const area = `${path("a")} L ${x(data.length-1).toFixed(1)} ${(H - PAD.b).toFixed(1)} L ${x(0).toFixed(1)} ${(H - PAD.b).toFixed(1)} Z`;

  // y ticks
  const yticks = [0, ymax / 2, ymax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="220" preserveAspectRatio="none">
      <defs>
        <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1F8FFF" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#1F8FFF" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* grid */}
      {yticks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#E2E8F0" strokeDasharray="2 4" />
          <text x={PAD.l - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="Geist Mono, monospace">
            ${t}k
          </text>
        </g>
      ))}

      {/* prior year (dashed grey) */}
      <path d={path("b")} fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* this year */}
      <path d={area} fill="url(#revFill)" />
      <path d={path("a")} fill="none" stroke="#005CB8" strokeWidth="2" />

      {/* points */}
      {data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d.a)} r="2.5" fill="#fff" stroke="#005CB8" strokeWidth="1.5" />
      ))}

      {/* x labels */}
      {data.map((d, i) => (
        (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) && (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="Inter, sans-serif">
            {d.x}
          </text>
        )
      ))}
    </svg>
  );
};

const SegmentDonut = ({ data }) => {
  const W = 280, H = 220, cx = 110, cy = H / 2, R = 80, r = 50;
  const total = data.reduce((s, d) => s + d.v, 0);
  let acc = 0;
  const arcs = data.map((d) => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.v;
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end),   y2 = cy + R * Math.sin(end);
    const x3 = cx + r * Math.cos(end),   y3 = cy + r * Math.sin(end);
    const x4 = cx + r * Math.cos(start), y4 = cy + r * Math.sin(start);
    return { ...d, d: `M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 ${large} 0 ${x4} ${y4} Z` };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="220">
      {arcs.map((a) => (
        <path key={a.n} d={a.d} fill={a.c} />
      ))}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="22" fontWeight="700" fill="#1e293b" fontFamily="Inter, sans-serif" letterSpacing="-0.02em">
        ${(total * 4.2).toFixed(0)}k
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="Geist Mono, monospace" letterSpacing="0.04em">
        TOTAL ARR
      </text>
      {/* legend right */}
      {arcs.map((a, i) => (
        <g key={a.n} transform={`translate(208 ${30 + i * 24})`}>
          <rect width="9" height="9" rx="2" fill={a.c} y="4"/>
          <text x="14" y="13" fontSize="11" fill="#1e293b" fontFamily="Inter, sans-serif" fontWeight="500">{a.n}</text>
          <text x="14" y="25" fontSize="10" fill="#64748B" fontFamily="Geist Mono, monospace">{a.v}%</text>
        </g>
      ))}
    </svg>
  );
};

const SegmentBars = ({ data }) => {
  const W = 280, H = 220, PAD = 12;
  const rowH = 30;
  const max = Math.max(...data.map(d => d.v));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="220">
      {data.map((d, i) => {
        const w = ((d.v / max) * (W - 110)) | 0;
        return (
          <g key={d.n} transform={`translate(${PAD} ${PAD + i * (rowH + 6)})`}>
            <text x="0" y="14" fontSize="11" fill="#1e293b" fontFamily="Inter, sans-serif" fontWeight="500">{d.n}</text>
            <rect x="86" y="4" width={W - 110} height="14" rx="3" fill="#F1F5F9" />
            <rect x="86" y="4" width={w} height="14" rx="3" fill={d.c} />
            <text x={86 + w + 6} y="15" fontSize="10" fill="#64748B" fontFamily="Geist Mono, monospace">{d.v}%</text>
          </g>
        );
      })}
    </svg>
  );
};

Object.assign(window, { GeneratedApp });
