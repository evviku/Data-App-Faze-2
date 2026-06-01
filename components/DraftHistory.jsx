// DraftHistory — lightweight in-Builder panel for personal-draft checkpoints.
// This is NOT app version history (which lives in App Detail → Versions tab).
// Restoring a checkpoint updates the CURRENT draft in place.

const KIND_ICON = {
  autosave:   "circle-dot",
  kai:        "sparkles",
  edit:       "pencil",
  checkpoint: "git-commit",
};

const DraftHistory = ({ onClose, onRestore, onOpenVersions, appName }) => {
  const [hovered, setHovered] = React.useState(null);
  return (
    <>
      <div className="db-history-backdrop" onClick={onClose}></div>
      <aside className="db-history" data-screen-label="Builder · draft history">
        <div className="db-history-head">
          <div className="ic"><KbIcon name="history" size={16} /></div>
          <div style={{flex: 1, minWidth: 0}}>
            <h3>Draft history</h3>
            <span className="sub">Checkpoints inside your personal draft of {appName || "this app"}</span>
          </div>
          <button className="x" onClick={onClose} aria-label="Close">
            <KbIcon name="x" size={14} />
          </button>
        </div>

        <div className="db-history-meta">
          <span className="pill">
            <KbIcon name="file-code" size={11} />
            Your draft
          </span>
          <span className="sep">·</span>
          <span>{DRAFT_CHECKPOINTS.length} checkpoints</span>
          <span className="sep">·</span>
          <span>Auto-saves every few minutes</span>
        </div>

        <div className="db-checkpoints">
          {DRAFT_CHECKPOINTS.map((c) => (
            <div
              key={c.id}
              className={`db-checkpoint ${c.kind} ${c.current ? "current" : ""} ${hovered === c.id ? "selected" : ""}`}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => !c.current && onRestore(c)}
              role="button"
              tabIndex={0}
            >
              <span className="dot">
                {c.current
                  ? <KbIcon name="circle-dot" size={11} />
                  : <KbIcon name={KIND_ICON[c.kind] || "git-commit"} size={11} />}
              </span>
              <div className="body">
                <span className="label">{c.label}</span>
                <span className="meta">
                  <span className="by">{c.author === "Kai" ? "Kai" : "You"}</span>
                  <span>·</span>
                  <span>{c.time}</span>
                </span>
                {!c.current && (
                  <button
                    className="restore"
                    onClick={(e) => { e.stopPropagation(); onRestore(c); }}
                  >
                    <KbIcon name="history" size={11} />
                    Restore checkpoint
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="db-history-foot">
          <span>Restoring a checkpoint updates your current draft</span>
          <button className="open-versions" onClick={onOpenVersions}>
            View published versions →
          </button>
        </div>
      </aside>
    </>
  );
};

window.DraftHistory = DraftHistory;
