// Empty state for the Data App Builder.
// Centered prompt surface, suggestions, secondary "connect repo" option.

const SUGGESTIONS = [
  { label: "Customer analytics dashboard", icon: "bar-chart", prompt: "Build a customer analytics dashboard with revenue, churn and cohort retention from in.c-marts.customers." },
  { label: "Lead scoring app", icon: "trending-up", prompt: "Build an internal app that scores inbound leads using out.c-crm.leads and lets sales mark them as qualified." },
  { label: "Marketing attribution", icon: "git-fork", prompt: "Compare last-touch and data-driven attribution across paid channels from in.c-ads.spend_daily." },
  { label: "Inventory health", icon: "database", prompt: "Inventory health dashboard with reorder alerts from in.c-erp.inventory_levels." },
];

const EmptyState = ({
  prompt,
  setPrompt,
  attachedTables,
  setAttachedTables,
  onSubmit,
  onConnectRepo,
  onOpenKai,
}) => {
  const textareaRef = React.useRef(null);
  const [attachMenuOpen, setAttachMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Focus without scrolling — the empty surface is intentionally tall and
    // the headline above the textarea is part of the brand moment.
    const ta = textareaRef.current;
    if (ta && typeof ta.focus === "function") {
      try { ta.focus({ preventScroll: true }); } catch { ta.focus(); }
    }
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (prompt.trim()) onSubmit();
    }
  };

  const candidateTables = [
    "in.c-marts.customers",
    "in.c-marts.orders",
    "in.c-marts.sessions",
    "out.c-crm.accounts",
    "in.c-ads.spend_daily",
    "in.c-stripe.invoices",
  ].filter(t => !attachedTables.includes(t));

  return (
    <section className="db-empty db-fade" data-screen-label="Empty Builder · creation surface">
      <div className="db-empty-inner">
        <span className="db-eyebrow">
          <KbIcon name="sparkles" size={14} />
          Powered by Kai · AI Data Engineer
        </span>

        <h1 className="db-headline">
          What do you want to <span className="accent">build</span>?
        </h1>
        <p className="db-subhead">
          Describe your app in natural language. Kai will scaffold a Keboola-managed
          repository, connect it to your data and ship a working draft in seconds.
        </p>

        <div className="db-prompt" data-comment-anchor="empty-prompt">
          <textarea
            ref={textareaRef}
            value={prompt}
            placeholder="A dashboard for our sales team that shows pipeline health, win-rate by source, and top deals. Highlight stalled deals over 30 days old…"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onKeyDown}
            rows={3}
          />
          <div className="db-prompt-foot">
            <div style={{position: "relative"}}>
              <button
                className="db-chip"
                onClick={() => setAttachMenuOpen((v) => !v)}
                type="button"
              >
                <KbIcon name="database" size={14} />
                Attach table
              </button>
              {attachMenuOpen && (
                <div
                  className="db-popover"
                  style={{position: "absolute", top: 38, left: 0, right: "auto", minWidth: 260}}
                  onMouseLeave={() => setAttachMenuOpen(false)}
                >
                  <div className="db-kai-section-label" style={{padding: "4px 8px"}}>
                    Storage tables
                  </div>
                  {candidateTables.slice(0, 6).map((t) => (
                    <div
                      key={t}
                      className="item"
                      onClick={() => {
                        setAttachedTables([...attachedTables, t]);
                        setAttachMenuOpen(false);
                      }}
                    >
                      <KbIcon name="table" size={14} />
                      <span style={{font: "500 12.5px var(--font-mono)"}}>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="db-chip" type="button" title="Reference an existing app">
              <KbIcon name="link" size={14} />
              Reference app
            </button>

            {attachedTables.map((t) => (
              <span className="db-chip attached" key={t}>
                <KbIcon name="table" size={12} />
                <span className="kb-mono" style={{fontSize: 12}}>{t}</span>
                <button
                  className="close"
                  onClick={() => setAttachedTables(attachedTables.filter(x => x !== t))}
                  aria-label="Remove"
                >
                  <KbIcon name="x" size={12} />
                </button>
              </span>
            ))}

            <button
              className="db-prompt-send"
              onClick={onSubmit}
              disabled={!prompt.trim()}
              type="button"
            >
              <KbIcon name="sparkles" size={14} />
              Build with Kai
              <span className="kbd">⌘ ↵</span>
            </button>
          </div>
        </div>

        <div className="db-suggestions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              className="db-sug"
              type="button"
              onClick={() => {
                setPrompt(s.prompt);
                textareaRef.current?.focus();
              }}
            >
              <KbIcon name={s.icon} size={14} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="db-secondary">
          <span className="db-secondary-title">Start from existing code</span>
          <button className="db-secondary-btn" type="button" onClick={onConnectRepo}>
            <KbIcon name="github" size={14} />
            Connect Git repository
            <KbIcon name="arrow-right" size={12} />
          </button>
        </div>
      </div>

      <div className="db-kai-rail">
        <button className="db-kai-collapsed" type="button" onClick={onOpenKai}>
          <span className="avatar"><KbIcon name="sparkles" size={14} /></span>
          Ask Kai
          <span className="kbd">⌘ K</span>
        </button>
      </div>
    </section>
  );
};

window.EmptyState = EmptyState;
