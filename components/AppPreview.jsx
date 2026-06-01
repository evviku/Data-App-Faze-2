// AppPreview — miniature "live" preview of each Data App, rendered as compact
// HTML/SVG so cards feel like real internal applications.
//
// All previews share a fixed aspect and rely on inline styles so the layout is
// independent of the host card.

const AppPreview = ({ appId }) => {
  const Preview = PREVIEWS[appId] || GenericPreview;
  return (
    <div className="dx-preview">
      <div className="dx-preview-inner">
        <Preview />
      </div>
    </div>
  );
};

/* ─── Customer Analytics ─────────────────────────────── */
const CustomerAnalyticsPreview = () => (
  <div style={previewSurface()}>
    <PreviewHead title="Customer health" sub="Daily refresh · 2.4M customers" filter="Last 30d" />
    <div style={kpiGrid(4)}>
      <Kpi l="MRR" v="$312k" delta="+12.4%" up />
      <Kpi l="Active" v="2,419" delta="+4.8%" up />
      <Kpi l="Retention" v="108%" delta="+1.2pt" up />
      <Kpi l="Churn" v="1.8%" delta="-0.3" up />
    </div>
    <MiniAreaChart accent="#005CB8" />
    <MiniTableRows
      rows={[
        ["Lumen Aerospace", "Enterprise", "$184k", "ok"],
        ["Northwind",       "Mid-market", "$72k",  "ok"],
        ["Brigid & Cole",   "SMB",        "$18k",  "warn"],
      ]}
    />
  </div>
);

/* ─── Sales Pipeline ─────────────────────────────────── */
const SalesPipelinePreview = () => {
  const columns = [
    { t: "Discovery",    cards: 6, total: "$124k", a: "#7CBDFE" },
    { t: "Qualified",    cards: 4, total: "$210k", a: "#1F8FFF" },
    { t: "Proposal",     cards: 3, total: "$92k",  a: "#0075EB" },
    { t: "Closing",      cards: 2, total: "$48k",  a: "#005CB8" },
  ];
  return (
    <div style={previewSurface()}>
      <PreviewHead title="Pipeline · this quarter" sub="$474k weighted · 15 deals" filter="All AEs" />
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 6}}>
        {columns.map((c, i) => (
          <div key={i} style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 5,
            padding: "5px 6px",
            display: "flex", flexDirection: "column", gap: 3,
          }}>
            <div style={{fontSize: 7, color: "#94A3B8", fontFamily: "var(--font-mono)", letterSpacing: 0.4, textTransform: "uppercase"}}>{c.t}</div>
            <div style={{fontSize: 11, fontWeight: 700, color: "#1e293b", letterSpacing: -0.02}}>{c.total}</div>
            <div style={{display: "flex", flexDirection: "column", gap: 2, marginTop: 1}}>
              {[...Array(c.cards)].slice(0, 3).map((_, j) => (
                <div key={j} style={{
                  height: 4, borderRadius: 1.5,
                  background: c.a,
                  opacity: 1 - j * 0.22,
                }} />
              ))}
              {c.cards > 3 && (
                <div style={{fontSize: 7, color: "#94A3B8", fontFamily: "var(--font-mono)"}}>+{c.cards - 3}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <MiniLeaderboard
        rows={[
          ["Sarah H.",  "$180k", 0.92],
          ["Pavel N.",  "$148k", 0.76],
          ["Tomas F.",  "$96k",  0.49],
        ]}
      />
    </div>
  );
};

/* ─── Lead Scoring ───────────────────────────────────── */
const LeadScoringPreview = () => {
  const leads = [
    ["Anya Lindgren",  "Acme Corp",          92, "high"],
    ["Marc Wei",       "Helix Bio",          78, "high"],
    ["Hannah Goss",    "Brigid & Cole",      63, "med"],
    ["Tom Renz",       "Polaris Foods",      54, "med"],
    ["Sam Klein",      "Cobalt Logistics",   31, "low"],
  ];
  return (
    <div style={previewSurface()}>
      <PreviewHead title="Inbound leads · today" sub="124 scored · refreshed 9 min ago" filter="A · B" />
      <div style={{display: "flex", gap: 6, marginBottom: 6}}>
        <Pill bg="#EFF6FE" color="#005CB8" label="A · 24" />
        <Pill bg="#F1F5F9" color="#334155" label="B · 41" />
        <Pill bg="#F8FAFC" color="#64748B" label="C · 59" />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 4}}>
        {leads.map(([n, c, s, tier], i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1.2fr 80px 28px",
            gap: 6, alignItems: "center",
            padding: "4px 6px",
            background: "#fff",
            border: "1px solid #F1F5F9",
            borderRadius: 4,
          }}>
            <div style={{fontSize: 9, color: "#1e293b", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{n}</div>
            <div style={{fontSize: 8.5, color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{c}</div>
            <div style={{position: "relative", height: 4, background: "#F1F5F9", borderRadius: 2}}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${s}%`,
                background: tier === "high" ? "#005CB8" : tier === "med" ? "#1F8FFF" : "#94A3B8",
                borderRadius: 2,
              }} />
            </div>
            <div style={{fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 600, color: "#1e293b", textAlign: "right"}}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Marketing Attribution ──────────────────────────── */
const MarketingAttributionPreview = () => {
  const channels = [
    { n: "Paid search", lt: 78, dd: 62, c: "#005CB8" },
    { n: "Social",      lt: 54, dd: 81, c: "#1F8FFF" },
    { n: "Email",       lt: 64, dd: 38, c: "#7CBDFE" },
    { n: "Direct",      lt: 41, dd: 24, c: "#94A3B8" },
    { n: "Referral",    lt: 32, dd: 47, c: "#0075EB" },
  ];
  const max = 100;
  return (
    <div style={previewSurface()}>
      <PreviewHead title="Attribution · all channels" sub="Last 30 days · $1.4M influenced" filter="Last-touch · Data-driven" />
      <div style={{display: "flex", gap: 12, marginBottom: 6, paddingLeft: 4}}>
        <LegendSwatch color="#005CB8" label="Last-touch" />
        <LegendSwatch color="#7CBDFE" label="Data-driven" />
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 6, padding: "0 4px"}}>
        {channels.map((c) => (
          <div key={c.n} style={{display: "grid", gridTemplateColumns: "70px 1fr 28px", gap: 6, alignItems: "center"}}>
            <div style={{fontSize: 8.5, color: "#1e293b", fontWeight: 500}}>{c.n}</div>
            <div style={{display: "flex", flexDirection: "column", gap: 2}}>
              <div style={{height: 5, background: "#F1F5F9", borderRadius: 1.5, position: "relative"}}>
                <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(c.lt/max)*100}%`, background: c.c, borderRadius: 1.5}} />
              </div>
              <div style={{height: 5, background: "#F1F5F9", borderRadius: 1.5, position: "relative"}}>
                <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(c.dd/max)*100}%`, background: "#7CBDFE", borderRadius: 1.5}} />
              </div>
            </div>
            <div style={{fontSize: 8.5, color: "#64748B", fontFamily: "var(--font-mono)", textAlign: "right"}}>{c.lt}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Inventory Health ──────────────────────────────── */
const InventoryHealthPreview = () => {
  // 14 EU warehouses · status grid
  const warehouses = [
    "AMS","ROT","BER","HAM","FRA","MUN","PRG","WAW",
    "BCN","MAD","LIS","MIL","PAR","CDG"
  ];
  const statuses = ["ok","ok","ok","warn","ok","ok","ok","ok","warn","ok","danger","ok","ok","warn"];
  const colors = {
    ok: "#34D399", warn: "#F59300", danger: "#EF2E4E"
  };
  return (
    <div style={previewSurface()}>
      <PreviewHead title="Warehouse health" sub="14 sites · live SKU coverage" filter="All regions" />
      <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6}}>
        {warehouses.map((w, i) => (
          <div key={w} style={{
            aspectRatio: "1.4 / 1",
            background: "#fff",
            border: "1px solid #F1F5F9",
            borderRadius: 4,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 2,
            position: "relative",
          }}>
            <div style={{fontSize: 8, fontFamily: "var(--font-mono)", color: "#334155", fontWeight: 600}}>{w}</div>
            <div style={{width: 6, height: 6, borderRadius: 9999, background: colors[statuses[i]]}} />
          </div>
        ))}
      </div>
      <div style={{display: "flex", gap: 8, marginTop: 6, padding: "0 2px"}}>
        <LegendSwatch dot color="#34D399" label="Healthy · 10" />
        <LegendSwatch dot color="#F59300" label="Warning · 3" />
        <LegendSwatch dot color="#EF2E4E" label="Reorder · 1" />
      </div>
    </div>
  );
};

/* ─── Exec Snapshot ──────────────────────────────────── */
const ExecSnapshotPreview = () => (
  <div style={previewSurface()}>
    <PreviewHead title="Exec snapshot · Q2" sub="Emailed every Monday · last failed" filter="Mon 09:00" />
    <div style={{
      background: "#fff",
      border: "1px solid #F1F5F9",
      borderRadius: 6,
      padding: "8px 10px",
      marginBottom: 6,
      display: "flex", flexDirection: "column", gap: 3,
    }}>
      <div style={{fontSize: 7, color: "#94A3B8", fontFamily: "var(--font-mono)", letterSpacing: 0.4, textTransform: "uppercase"}}>MRR · YTD</div>
      <div style={{fontSize: 18, fontWeight: 700, color: "#1e293b", letterSpacing: -0.03, lineHeight: 1}}>$3.42M</div>
      <div style={{fontSize: 8, color: "#047857", fontFamily: "var(--font-mono)"}}>↑ 22.4% YoY</div>
    </div>
    <div style={kpiGrid(3)}>
      <Kpi l="Headcount" v="142" delta="+6" up />
      <Kpi l="Pipeline" v="$2.1M" delta="+18%" up />
      <Kpi l="Runway" v="18 mo" delta="—" up={false} small />
    </div>
    {/* last run failed indicator */}
    <div style={{
      marginTop: 6,
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 8px",
      background: "#FCF2F4",
      border: "1px solid #FAE0E5",
      borderRadius: 4,
      fontSize: 8.5,
      color: "#B20622",
      fontWeight: 500,
    }}>
      <span style={{width: 6, height: 6, borderRadius: 9999, background: "#EF2E4E"}} />
      Last run failed · auth error · 4 days ago
    </div>
  </div>
);

/* ─── Generic fallback ───────────────────────────────── */
const GenericPreview = () => (
  <div style={previewSurface()}>
    <PreviewHead title="App preview" sub="Snapshot · auto-refresh" filter="—" />
    <div style={kpiGrid(3)}>
      <Kpi l="Stat A" v="48" delta="+2.1%" up />
      <Kpi l="Stat B" v="312" delta="+0.8%" up />
      <Kpi l="Stat C" v="1.2k" delta="-1%" up={false} />
    </div>
    <MiniAreaChart accent="#1F8FFF" />
  </div>
);

/* ─── Pricing Workbench (draft-only — sketchier) ───── */
const PricingWorkbenchPreview = () => (
  <div style={previewSurface()}>
    <PreviewHead title="Pricing scenarios · draft" sub="Modelling 184 SKUs · sandboxed" filter="Q2 baseline" />
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 6}}>
      {[
        { l: "Margin Δ",   v: "+3.4pt",  c: "#005CB8" },
        { l: "Revenue Δ",  v: "+$48k",   c: "#1F8FFF" },
      ].map((k) => (
        <div key={k.l} style={{
          background: "#fff",
          border: "1px solid #F1F5F9",
          borderRadius: 4,
          padding: "5px 7px",
        }}>
          <div style={{fontSize: 7, color: "#94A3B8", fontFamily: "var(--font-mono)", letterSpacing: 0.4, textTransform: "uppercase"}}>{k.l}</div>
          <div style={{fontSize: 14, fontWeight: 700, color: k.c, letterSpacing: -0.02}}>{k.v}</div>
        </div>
      ))}
    </div>
    <div style={{
      background: "#fff",
      border: "1px solid #F1F5F9",
      borderRadius: 4,
      padding: "5px 8px",
      fontSize: 9, color: "#1e293b",
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <span style={{
        fontSize: 7, padding: "1px 5px",
        background: "#F1F5F9", color: "#64748B",
        borderRadius: 2, fontFamily: "var(--font-mono)",
      }}>SCENARIO</span>
      Raise wholesale tier B by 4.2%
    </div>
    <div style={{
      flex: 1,
      borderRadius: 4,
      border: "1.5px dashed #CBD5E1",
      background: "rgba(151, 71, 255, 0.04)",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 6,
      fontSize: 9, fontFamily: "var(--font-mono)",
      color: "#9747FF",
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: 9999, background: "#9747FF",
      }} />
      Scenario chart area · ready to scaffold
    </div>
  </div>
);

const PREVIEWS = {
  "customer-analytics": CustomerAnalyticsPreview,
  "sales-pipeline": SalesPipelinePreview,
  "lead-scoring": LeadScoringPreview,
  "marketing-attribution": MarketingAttributionPreview,
  "inventory-health": InventoryHealthPreview,
  "exec-snapshot": ExecSnapshotPreview,
  "pricing-workbench": PricingWorkbenchPreview,
};

/* ─── Primitives ─────────────────────────────────────── */

function previewSurface() {
  return {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    background:
      "radial-gradient(800px 200px at 50% -40%, rgba(31,143,255,0.06) 0%, transparent 70%), #fff",
  };
}

const PreviewHead = ({ title, sub, filter }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 8,
    paddingBottom: 4,
    borderBottom: "1px solid #F1F5F9",
  }}>
    <div style={{minWidth: 0, flex: 1}}>
      <div style={{fontSize: 10, fontWeight: 700, color: "#1e293b", letterSpacing: -0.02, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
        {title}
      </div>
      <div style={{fontSize: 7.5, color: "#94A3B8", fontFamily: "var(--font-mono)", marginTop: 1}}>
        {sub}
      </div>
    </div>
    <div style={{
      fontSize: 7.5, fontFamily: "var(--font-mono)",
      padding: "2px 6px",
      background: "#F1F5F9",
      color: "#64748B",
      borderRadius: 9999,
      whiteSpace: "nowrap",
    }}>{filter}</div>
  </div>
);

const kpiGrid = (n) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${n}, 1fr)`,
  gap: 4,
});

const Kpi = ({ l, v, delta, up, small }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #F1F5F9",
    borderRadius: 4,
    padding: "5px 6px",
    display: "flex", flexDirection: "column", gap: 1,
    minWidth: 0,
  }}>
    <div style={{fontSize: 6.5, color: "#94A3B8", fontFamily: "var(--font-mono)", letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap"}}>{l}</div>
    <div style={{fontSize: small ? 10 : 12, fontWeight: 700, color: "#1e293b", letterSpacing: -0.02, lineHeight: 1, whiteSpace: "nowrap"}}>{v}</div>
    <div style={{fontSize: 7, color: up ? "#047857" : "#B20622", fontFamily: "var(--font-mono)", whiteSpace: "nowrap"}}>{up ? "↑" : "↓"} {delta}</div>
  </div>
);

const Pill = ({ label, bg, color }) => (
  <div style={{
    fontSize: 7.5,
    padding: "2px 7px",
    borderRadius: 9999,
    background: bg,
    color,
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
  }}>{label}</div>
);

const LegendSwatch = ({ color, label, dot }) => (
  <div style={{display: "inline-flex", alignItems: "center", gap: 4, fontSize: 7.5, fontFamily: "var(--font-mono)", color: "#64748B"}}>
    <span style={{
      width: dot ? 5 : 7,
      height: dot ? 5 : 4,
      borderRadius: dot ? 9999 : 1,
      background: color,
    }} />
    {label}
  </div>
);

const MiniAreaChart = ({ accent = "#005CB8" }) => {
  const pts = [12, 18, 16, 22, 21, 28, 26, 33, 30, 38, 41, 47, 52, 58];
  const W = 220, H = 36;
  const max = Math.max(...pts), min = Math.min(...pts);
  const x = (i) => (i / (pts.length - 1)) * W;
  const y = (v) => H - ((v - min) / (max - min)) * (H - 4) - 2;
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L ${W} ${H} L 0 ${H} Z`;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #F1F5F9",
      borderRadius: 4,
      padding: 4,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
        <defs>
          <linearGradient id="appgrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.22"/>
            <stop offset="100%" stopColor={accent} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#appgrad)" />
        <path d={path} fill="none" stroke={accent} strokeWidth="1.4" />
      </svg>
    </div>
  );
};

const MiniTableRows = ({ rows }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  }}>
    {rows.map(([name, seg, arr, status], i) => (
      <div key={i} style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 60px 8px",
        gap: 6, alignItems: "center",
        padding: "4px 6px",
        borderBottom: i < rows.length - 1 ? "1px solid #F8FAFC" : 0,
        fontSize: 9,
      }}>
        <div style={{fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{name}</div>
        <div style={{color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{seg}</div>
        <div style={{color: "#1e293b", fontFamily: "var(--font-mono)", fontSize: 8.5, textAlign: "right"}}>{arr}</div>
        <div style={{width: 6, height: 6, borderRadius: 9999, background: status === "ok" ? "#34D399" : status === "warn" ? "#F59300" : "#EF2E4E", justifySelf: "end"}} />
      </div>
    ))}
  </div>
);

const MiniLeaderboard = ({ rows }) => (
  <div style={{display: "flex", flexDirection: "column", gap: 3}}>
    {rows.map(([name, total, pct], i) => (
      <div key={i} style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 40px",
        gap: 6, alignItems: "center",
        fontSize: 8.5,
      }}>
        <div style={{color: "#1e293b", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{name}</div>
        <div style={{position: "relative", height: 5, background: "#F1F5F9", borderRadius: 1.5}}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${pct * 100}%`,
            background: "#005CB8",
            borderRadius: 1.5,
          }} />
        </div>
        <div style={{fontSize: 8.5, color: "#64748B", fontFamily: "var(--font-mono)", textAlign: "right"}}>{total}</div>
      </div>
    ))}
  </div>
);

window.AppPreview = AppPreview;
