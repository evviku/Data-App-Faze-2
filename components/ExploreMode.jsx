// Explore Mode — temporary read-only mode inside the Builder for browsing
// app version history. Reuses the existing canvas/preview rendering.
//
// Props:
//   selected:        the version object currently viewed
//   onSelect(v):     select another version
//   compareWith:     null | a second version for compare view
//   setCompareWith:  toggles compare
//   onRestore(v):    restore selected version as a new personal draft
//   onReturn():      return to normal Builder editing mode

const ExploreMode = ({
  selected,
  onSelect,
  compareWith,
  setCompareWith,
  onRestore,
  onReturn,
  // Preview rendering — reuses GeneratedApp from the existing builder
  kpiTone, density,
  range, setRange,
  segmentMode, setSegmentMode,
  filter, setFilter,
}) => {
  const inCompare = !!compareWith;

  return (
    <div className="db-explore db-fade">
      {/* Left sidebar — version list */}
      <aside className="db-versions">
        <div className="db-versions-head">
          <h3>
            <KbIcon name="history" size={14} />
            App versions
            <span className="db-versions-head-count" style={{
              marginLeft: "auto",
              font: "500 11px var(--font-mono)",
              color: "var(--foreground-muted)",
              background: "var(--muted)",
              borderRadius: 9999,
              padding: "2px 8px",
            }}>
              {VERSIONS.length}
            </span>
          </h3>
          <span className="sub">Read-only · restore to draft</span>
        </div>
        <div className="db-versions-list">
          {VERSIONS.map((v) => (
            <button
              key={v.v}
              className={`db-version ${selected?.v === v.v ? "selected" : ""}`}
              onClick={() => onSelect(v)}
            >
              <div className="row">
                <span className="v">{v.v}</span>
                <span className="num">#{v.n}</span>
                {v.isProduction && (
                  <span className="prod-badge">
                    <span style={{width: 5, height: 5, borderRadius: 9999, background: "currentColor"}}></span>
                    Production
                  </span>
                )}
              </div>
              <div className="label">{v.label}</div>
              <div className="meta">
                <KbIcon name="user" size={11} />
                <span>{v.author}</span>
                <span className="sep">·</span>
                <span>{v.when}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="db-explore-main">
        <div className="db-explore-banner">
          <div className="ic">
            <KbIcon name={inCompare ? "git-fork" : "eye"} size={14} />
          </div>
          <div className="body">
            <strong>
              {inCompare
                ? `Comparing ${selected.v} with ${compareWith.v}`
                : `Read-only preview of ${selected.v}`}
            </strong>
            <span className="meta">
              {inCompare
                ? "What changed between these versions — UI, data, and behaviour"
                : `${selected.label} · published ${selected.when} by ${selected.author}`}
            </span>
          </div>
          <div className="actions">
            {inCompare ? (
              <button className="db-explore-action" onClick={() => setCompareWith(null)}>
                <KbIcon name="x" size={12} />
                Close compare
              </button>
            ) : (
              <button
                className="db-explore-action"
                onClick={() => {
                  // pick the first other version for compare
                  const other = VERSIONS.find((x) => x.v !== selected.v);
                  setCompareWith(other);
                }}
              >
                <KbIcon name="git-fork" size={12} />
                Compare
              </button>
            )}
            <button className="db-explore-action primary" onClick={() => onRestore(selected)}>
              <KbIcon name="history" size={12} />
              Restore as draft
            </button>
          </div>
        </div>

        <div className="db-explore-scroll">
          {inCompare ? (
            <CompareView
              a={selected}
              b={compareWith}
              onPickA={(v) => onSelect(v)}
              onPickB={(v) => setCompareWith(v)}
            />
          ) : (
            <GeneratedApp
              kpiTone={kpiTone}
              density={density}
              editable={false}
              range={range} setRange={setRange}
              segmentMode={segmentMode} setSegmentMode={setSegmentMode}
              filter={filter} setFilter={setFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Compare view ──────────────────────────────────────── */
const CompareView = ({ a, b, onPickA, onPickB }) => {
  // Build a "diff" by merging both summaries with version origin
  const merged = [];
  for (const it of a.summary) merged.push({ ...it, from: a.v });
  for (const it of b.summary) merged.push({ ...it, from: b.v });

  return (
    <div className="db-compare">
      <div className="db-compare-head">
        <div>
          <h2>Compare app versions</h2>
          <div className="sub">UI changes, data sources, filters and widget logic</div>
        </div>
        <div className="db-compare-selector">
          <VersionPicker selected={a} onPick={onPickA} />
          <span className="db-compare-arrow">↔</span>
          <VersionPicker selected={b} onPick={onPickB} exclude={a.v} />
        </div>
      </div>

      <div className="db-compare-cards">
        <CompareCard v={a} />
        <CompareCard v={b} />
      </div>

      <div className="db-compare-summary">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 0 4px",
        }}>
          <div style={{
            font: "600 14px var(--font-sans)",
            color: "var(--foreground)",
          }}>
            What's different
          </div>
          <div style={{
            display: "inline-flex", gap: 8,
            font: "500 11px var(--font-mono)", color: "var(--foreground-muted)",
          }}>
            <span style={{display: "inline-flex", alignItems: "center", gap: 5}}>
              <span style={{width: 7, height: 7, borderRadius: 2, background: "var(--color-keboola-success-500)"}}></span>
              Added
            </span>
            <span style={{display: "inline-flex", alignItems: "center", gap: 5}}>
              <span style={{width: 7, height: 7, borderRadius: 2, background: "var(--color-keboola-warning-500)"}}></span>
              Changed
            </span>
            <span style={{display: "inline-flex", alignItems: "center", gap: 5}}>
              <span style={{width: 7, height: 7, borderRadius: 2, background: "var(--color-keboola-danger-500)"}}></span>
              Removed
            </span>
          </div>
        </div>

        {merged.map((it, i) => (
          <div key={i} className={`db-diff-row ${it.kind}`}>
            <span className="ic">
              {it.kind === "added" ? "+" : it.kind === "removed" ? "−" : "↻"}
            </span>
            <span className="area">{it.area}</span>
            <span className="text">{it.text}</span>
            <span className="version-tag">in {it.from}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompareCard = ({ v }) => (
  <div className="db-compare-card">
    <div className="head">
      <span className="v">{v.v}</span>
      <span className="when">#{v.n}</span>
      <span className={`badge ${v.isProduction ? "prod" : ""}`}>
        {v.isProduction ? "Production" : "Historical"}
      </span>
    </div>
    <div className="body">{v.label}</div>
    <div className="author">
      {v.author} · {v.when}
    </div>
  </div>
);

const VersionPicker = ({ selected, onPick, exclude }) => {
  const [open, setOpen] = React.useState(false);
  const options = VERSIONS.filter((v) => v.v !== exclude);
  return (
    <div style={{position: "relative"}}>
      <button className="db-compare-pick" onClick={() => setOpen((v) => !v)}>
        <KbIcon name="git-commit" size={12} />
        {selected.v}
        <KbIcon name="chevron-down" size={11} />
      </button>
      {open && (
        <div className="db-popover" style={{top: 36, right: 0, left: "auto", minWidth: 260}}
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((v) => (
            <div
              key={v.v}
              className="item"
              onClick={() => { onPick(v); setOpen(false); }}
            >
              <span style={{font: "600 12px var(--font-mono)", color: "var(--foreground)"}}>{v.v}</span>
              <span style={{flex: 1, font: "500 12px var(--font-sans)", color: "var(--foreground-muted)"}}>
                {v.label}
              </span>
              {v.isProduction && <span className="meta" style={{color: "var(--color-keboola-success-700)"}}>Production</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

window.ExploreMode = ExploreMode;
