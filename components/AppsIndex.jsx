// Apps Index — dual grid/list views with filter dropdown and selected-filter pills.

const FILTERS = [
  { id: "drafts", label: "Drafts", test: (a) => a.lifecycle === "draft-only" || a.lifecycle === "has-draft" },
  { id: "not-deployed", label: "Not deployed", test: (a) => a.lifecycle === "draft-only" },
  { id: "published", label: "Published", test: (a) => a.lifecycle !== "draft-only" && a.status === "published" },
  { id: "stopped", label: "Stopped", test: (a) => a.status === "stopped" },
  { id: "failed", label: "Failed", test: (a) => a.status === "failed" },
];

const SORT_OPTIONS = [
  { id: "recent", label: "Recently added" },
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "most-used", label: "Most used" },
];

const AppsIndex = ({ onOpenApp, onNewApp }) => {
  const [query, setQuery] = React.useState("");
  const [view, setView] = React.useState("grid"); // grid | list
  const [sortBy, setSortBy] = React.useState("recent");
  const [activeFilters, setActiveFilters] = React.useState([]);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const [newAppOpen, setNewAppOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);

  const filterRef = React.useRef(null);
  const sortRef = React.useRef(null);
  const newAppRef = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFiltersOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (newAppRef.current && !newAppRef.current.contains(e.target)) setNewAppOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filterCounts = React.useMemo(() => {
    const out = {};
    for (const f of FILTERS) out[f.id] = APPS.filter(f.test).length;
    return out;
  }, []);

  const filtered = React.useMemo(() => {
    let rows = APPS.filter((a) =>
      !query.trim() ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      (a.desc || "").toLowerCase().includes(query.toLowerCase())
    );

    if (activeFilters.length) {
      rows = rows.filter((a) =>
        activeFilters.some((id) => FILTERS.find((f) => f.id === id)?.test(a))
      );
    }

    if (sortBy === "name-asc") {
      rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      rows = [...rows].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "most-used") {
      rows = [...rows].sort((a, b) => (b.users || 0) - (a.users || 0));
    }

    return rows;
  }, [query, activeFilters, sortBy]);

  const toggleFilter = (id) => {
    setActiveFilters((prev) => prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]);
  };

  const toggleSelected = (id) => {
    setSelectedIds((prev) => prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]);
  };

  return (
    <div className={`dx-page ${selectedIds.length ? "has-bulk" : ""}`} data-screen-label="Apps Index">
      <div className="dx-page-inner">
        <div className="dx-index-head">
          <div>
            <h1>Apps</h1>
            <p>{APPS.length} apps</p>
          </div>
          <div className="dx-index-actions">
            <button className="help" aria-label="Help">
              <KbIcon name="circle-help" size={17} />
            </button>
            <div className="newapp-wrap" ref={newAppRef}>
              <button className="primary split" type="button">
                <span className="main" onClick={onNewApp}><KbIcon name="plus" size={16} /> New app</span>
                <span
                  className="chev"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewAppOpen((v) => !v);
                  }}
                >
                  <KbIcon name="chevron-down" size={15} />
                </span>
              </button>
              {newAppOpen && (
                <div className="dx-popover dx-index-popover" style={{top: 44, right: 0, left: "auto"}}>
                  <button className="item" onClick={() => { setNewAppOpen(false); alert("Creating a new folder…"); }}>
                    <KbIcon name="folder" size={14} />
                    New folder
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dx-index-toolbar">
          <div className="dx-search">
            <KbIcon name="search" size={14} />
            <input
              placeholder="Search apps"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="dx-index-tools">
            <div ref={filterRef} className="tool-wrap">
              <button
                className={`tool-btn ${filtersOpen ? "active" : ""}`}
                onClick={() => setFiltersOpen((v) => !v)}
                aria-label="Filters"
              >
                <KbIcon name="filter" size={16} />
              </button>
              {filtersOpen && (
                <div className="dx-popover dx-index-popover" style={{top: 40, right: 0, left: "auto"}}>
                  <div className="pop-title">Filter apps</div>
                  {FILTERS.map((f) => {
                    const on = activeFilters.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        className={`item ${on ? "active" : ""}`}
                        onClick={() => toggleFilter(f.id)}
                      >
                        <KbIcon name={on ? "check" : "circle"} size={14} />
                        {f.label}
                        <span className="meta">{filterCounts[f.id]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div ref={sortRef} className="tool-wrap">
              <button className="tool-btn select" onClick={() => setSortOpen((v) => !v)}>
                <KbIcon name="circle-dot" size={15} />
                {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                <KbIcon name="chevron-down" size={15} className="chev" />
              </button>
              {sortOpen && (
                <div className="dx-popover dx-index-popover" style={{top: 40, right: 0, left: "auto"}}>
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      className={`item ${sortBy === s.id ? "active" : ""}`}
                      onClick={() => { setSortBy(s.id); setSortOpen(false); }}
                    >
                      <KbIcon name={sortBy === s.id ? "check" : "circle"} size={14} />
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="tool-sep"></div>

            <div className="view-switch" role="tablist" aria-label="View switch">
              <button
                role="tab"
                aria-selected={view === "list"}
                className={`tool-btn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
                title="List view"
              >
                <KbIcon name="menu" size={16} />
              </button>
              <button
                role="tab"
                aria-selected={view === "grid"}
                className={`tool-btn ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")}
                title="Grid view"
              >
                <KbIcon name="layout-dashboard" size={16} />
              </button>
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="dx-selected-filters">
            {activeFilters.map((id) => {
              const f = FILTERS.find((x) => x.id === id);
              if (!f) return null;
              return (
                <button key={id} className="pill" onClick={() => toggleFilter(id)}>
                  {f.label}
                  <KbIcon name="x" size={12} />
                </button>
              );
            })}
            <button className="clear" onClick={() => setActiveFilters([])}>Clear all</button>
          </div>
        )}

        {view === "grid" ? (
          <div className="dx-index-grid">
            {filtered.map((a) => (
              <AppCard
                key={a.id}
                app={a}
                selected={selectedIds.includes(a.id)}
                onToggleSelect={() => toggleSelected(a.id)}
                onOpen={() => onOpenApp(a.id)}
              />
            ))}
          </div>
        ) : (
          <div className="dx-index-list">
            {filtered.map((a) => (
              <AppRow
                key={a.id}
                app={a}
                selected={selectedIds.includes(a.id)}
                onToggleSelect={() => toggleSelected(a.id)}
                onOpen={() => onOpenApp(a.id)}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="dx-card" style={{textAlign: "center", padding: 48, color: "var(--foreground-muted)"}}>
            <KbIcon name="search" size={24} style={{marginBottom: 8}} />
            <div style={{font: "600 14px var(--font-sans)", color: "var(--foreground)"}}>No apps match current search or filters</div>
            <div style={{marginTop: 4, font: "400 13px var(--font-sans)"}}>Try removing a filter or changing the query.</div>
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="dx-bulk-bar">
            <div className="count">{selectedIds.length} selected</div>
            <div className="actions">
              <button
                className="icon"
                title="Move selected apps"
                aria-label="Move selected apps"
                onClick={() => alert(`Moving ${selectedIds.length} selected app(s)…`)}
              >
                <KbIcon name="arrow-right" size={15} />
              </button>
              <button
                className="icon danger"
                title="Delete selected apps"
                aria-label="Delete selected apps"
                onClick={() => alert(`Deleting ${selectedIds.length} selected app(s)…`)}
              >
                <KbIcon name="trash" size={15} />
              </button>
              <button className="clear" onClick={() => setSelectedIds([])}>Clear</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AppRow = ({ app: a, selected, onToggleSelect, onOpen }) => {
  const { statusClass, statusLabel } = getStatusMeta(a);
  const draftLabel = getDraftLabel(a);

  return (
    <button className={`dx-app-row ${selected ? "selected" : ""}`} onClick={onOpen}>
      <div className="name-col">
        <span
          className={`dx-select-box ${selected ? "on" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
        >
          {selected && <KbIcon name="check" size={13} />}
        </span>
        <div className="txt">
          <strong>{a.name}</strong>
          <span>{a.desc}</span>
        </div>
      </div>

      <div className="meta-col">
        <span className={`state ${statusClass}`}>
          <span className="dot"></span>
          {statusLabel}
        </span>
      </div>

      <div className="meta-col muted">{draftLabel || "-"}</div>
      <div className="meta-col muted">{a.repoLabel}</div>
      <div className="meta-col muted">{a.publishedAt}</div>
      <div className="go"><KbIcon name="chevron-right" size={14} /></div>
    </button>
  );
};

const AppCard = ({ app: a, selected, onToggleSelect, onOpen }) => {
  const isDraftOnly = a.lifecycle === "draft-only";
  const hasDraft = a.lifecycle === "has-draft";
  const { statusClass, statusLabel } = getStatusMeta(a);

  // Right-hand pill (only when there's a draft / not-yet-deployed)
  let draftPill = null;
  if (isDraftOnly) {
    draftPill = (
      <span className="dx-app-card-draftpill draft-only">
        <span className="dot"></span>
        Draft only
      </span>
    );
  } else if (hasDraft) {
    if (a.syncState === "conflict") {
      draftPill = (
        <span className="dx-app-card-draftpill conflict-state">
          <span className="dot"></span>
          Conflict
        </span>
      );
    } else if (a.syncState === "behind") {
      draftPill = (
        <span className="dx-app-card-draftpill behind-state">
          <span className="dot"></span>
          Draft · behind
        </span>
      );
    } else {
      draftPill = (
        <span className="dx-app-card-draftpill">
          <span className="dot"></span>
          Your draft · {a.draftAge}
        </span>
      );
    }
  }

  return (
    <button
      className={`dx-app-card ${selected ? "selected" : ""} ${isDraftOnly ? "draft-only" : ""} ${hasDraft ? "draft" : ""} ${a.status || ""}`}
      onClick={onOpen}
    >
      <div className="dx-app-card-head">
        <span
          className={`dx-select-box ${selected ? "on" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
        >
          {selected && <KbIcon name="check" size={13} />}
        </span>
        <div className="dx-app-card-titlecol">
          <h3 className="dx-app-card-name">{a.name}</h3>
          <div className={`dx-app-card-status ${statusClass}`}>
            <span className="dot"></span>
            {statusLabel}
          </div>
        </div>
        {draftPill}
      </div>

      <AppPreview appId={a.id} />

      <div className="dx-app-card-foot">
        <span className="meta">
          <KbIcon name={a.repo === "managed" ? "lock" : "github"} size={11} />
          {a.repoLabel}
        </span>
        <span className="meta">
          <KbIcon name="history" size={11} />
          {a.publishedAt}
        </span>
      </div>
    </button>
  );
};

window.AppsIndex = AppsIndex;

function getStatusMeta(app) {
  if (app.lifecycle === "draft-only") {
    return { statusClass: "stopped", statusLabel: "Not deployed yet" };
  }
  return { statusClass: app.status, statusLabel: app.statusLabel };
}

function getDraftLabel(app) {
  if (app.lifecycle === "draft-only") return "Draft only";
  if (app.lifecycle !== "has-draft") return null;
  if (app.syncState === "behind") return "Draft behind production";
  if (app.syncState === "conflict") return "Requires review";
  return `Your draft · ${app.draftAge}`;
}
