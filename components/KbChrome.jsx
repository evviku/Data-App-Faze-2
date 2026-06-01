// Sidebar + top Navbar primitives — top Navbar spans full width above sidebar
const KbSidebarNav = ({ active, onNav, items, collapsed }) => (
  <>
    {items.map((g, gi) => (
      <React.Fragment key={gi}>
        {gi > 0 && !collapsed && <hr className="kb-divider" style={{margin: "8px 4px"}} />}
        {g.items.map((it) => (
          <button
            key={it.id}
            className={`kb-nav-item ${active === it.id ? "active" : ""} ${it.kai ? "kai" : ""}`}
            onClick={() => onNav?.(it.id)}
            title={collapsed ? it.label : undefined}
          >
            <KbIcon name={it.icon} size={16} className="kb-icon" />
            {!collapsed && <span>{it.label}</span>}
            {!collapsed && it.badge && <span className="kb-nav-badge"><span className={`kb-badge ${it.badge.tone || "sec"}`}>{it.badge.label}</span></span>}
          </button>
        ))}
      </React.Fragment>
    ))}
  </>
);

const KbSidebar = ({ active, onNav, collapsed = false }) => {
  const items = [
    {
      items: [
        { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
        { id: "flows", label: "Flows", icon: "workflow" },
        { id: "storage", label: "Storage", icon: "database" },
        { id: "data-apps", label: "Data Apps", icon: "table" },
      ],
    },
    {
      items: [
        { id: "components", label: "Components", icon: "folder" },
        { id: "transformations", label: "Transformations", icon: "braces" },
        { id: "data-catalog", label: "Data Catalog", icon: "table-2" },
        { id: "jobs", label: "Jobs", icon: "play", badge: { label: "3", tone: "sec" } },
        { id: "branches", label: "Dev branches", icon: "git-branch" },
        { id: "kai", label: "KAI", icon: "sparkles", kai: true, badge: { label: "Beta", tone: "kai" } },
        { id: "vault", label: "Vault", icon: "lock" },
      ],
    },
    {
      items: [
        { id: "trash", label: "Trash", icon: "trash" },
      ],
    },
  ];

  return (
    <aside className={`kb-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="kb-sidebar-content">
        <KbSidebarNav active={active} onNav={onNav} items={items} collapsed={collapsed} />
      </div>
      <div className="kb-sidebar-foot">
        <button className="kb-nav-item" title="Support & Feedback">
          <KbIcon name="info" size={16} className="kb-icon" />
          {!collapsed && <span>Support &amp; Feedback</span>}
        </button>
      </div>
    </aside>
  );
};

// Org / Project / Branch — selects in the navbar
const NavSelect = ({ kind, value, options, onChange, badge }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const icons = { org: "users", project: "folder", branch: "git-branch" };
  const isBranch = kind === "branch";
  return (
    <div ref={ref} style={{position: "relative"}}>
      <button
        className={`kb-nav-select ${isBranch ? "branch" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox" aria-expanded={open}
      >
        <KbIcon name={icons[kind]} size={16} className="kb-icon" />
        <strong>{value}</strong>
        {badge && <span className="kb-badge def" style={{fontSize: 10, padding: "1px 7px"}}>{badge}</span>}
        <KbIcon name="chevron-down" size={14} className="kb-icon chev" />
      </button>
      {open && (
        <div className="kb-nav-popover" role="listbox">
          <div className="kb-nav-popover-section">{ {org: "Switch organization", project: "Switch project", branch: "Switch environment"}[kind] }</div>
          {options.map((o) => (
            <div
              key={o}
              className={`kb-nav-popover-item ${o === value ? "active" : ""}`}
              onClick={() => { onChange?.(o); setOpen(false); }}
            >
              <KbIcon name={icons[kind]} size={14} className="kb-icon" />
              {o}
              {o === value && <span style={{marginLeft: "auto"}}><KbIcon name="check" size={14} /></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const KbNavbar = ({ org, setOrg, project, setProject, env, setEnv, onOpenKai }) => (
  <header className="kb-top">
    <div className="kb-nav-logo"><img src="assets/keboola-logo.svg" alt="Keboola" /></div>
    <div className="kb-nav-crumbs">
      <NavSelect
        kind="org"
        value={org}
        options={["Argo22", "Keboola Test", "Acme Inc."]}
        onChange={setOrg}
        badge="Top up"
      />
      <span className="kb-nav-sep">/</span>
      <NavSelect
        kind="project"
        value={project}
        options={["Marketing Analytics", "Finance DW", "Data Platform"]}
        onChange={setProject}
      />
      <span className="kb-nav-sep">/</span>
      <NavSelect
        kind="branch"
        value={env}
        options={["Production", "feature/clean-orders", "exp/marketing-attribution"]}
        onChange={setEnv}
      />
    </div>
    <div className="kb-grow" />
    <button className="kb-nav-iconbtn" title="Notifications">
      <KbIcon name="bell" size={16} />
      <span className="kb-dot">8</span>
    </button>
    <div className="kb-search">
      <KbIcon name="search" size={14} />
      <span>Search</span>
      <span className="kb-grow" />
      <span className="kb-kbd">/</span>
    </div>
    <button className="kb-kai-btn" onClick={onOpenKai}>
      <KbIcon name="sparkles" size={14} />
      Kai Assistant
      <span className="beta">Beta</span>
    </button>
    <div className="kb-avatar" title="Sarah Hájková">SH</div>
  </header>
);

Object.assign(window, { KbSidebar, KbNavbar });
