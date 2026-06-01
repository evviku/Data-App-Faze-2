// BuilderSync — contextual draft synchronization surface inside the Builder.
// Sits between the topbar and the canvas; visible only when draft is not in sync.
//
// draftState: 'up-to-date' | 'behind' | 'conflict' | 'syncing' | 'just-synced'

const BuilderSync = ({
  draftState,
  productionVersion = "v1.4.3",
  changedBy = "Pavel Novak",
  changedAt = "2 hours ago",
  conflictCount = 2,
  incomingCount = 4,
  onReview,
  onUpdateBase,
  onResolveWithKai,
  onDismiss,
}) => {
  if (draftState === "up-to-date" || !draftState) return null;

  if (draftState === "syncing") {
    return (
      <div className="db-syncbar syncing">
        <div className="ic"><div className="db-sync-orb"></div></div>
        <div className="body">
          <strong>Updating your draft base…</strong>
          <span className="meta">Pulling production {productionVersion} · preserving your 6 edits</span>
        </div>
      </div>
    );
  }

  if (draftState === "just-synced") {
    return (
      <div className="db-syncbar in-sync">
        <div className="ic"><KbIcon name="circle-check" size={14} /></div>
        <div className="body">
          <strong>Your draft is now based on Production {productionVersion}.</strong>
          <span className="meta">All your edits were preserved · ready to keep editing</span>
        </div>
        <div className="actions">
          <button className="x" onClick={onDismiss} aria-label="Dismiss"><KbIcon name="x" size={14} /></button>
        </div>
      </div>
    );
  }

  if (draftState === "behind") {
    return (
      <div className="db-syncbar conflict">
        <div className="ic"><KbIcon name="circle-alert" size={14} /></div>
        <div className="body">
          <strong>Your draft conflicts with newer production changes.</strong>
          <span className="meta">{conflictCount} overlapping areas · publishing is paused until conflicts are resolved</span>
        </div>
        <div className="actions">
          <button className="db-syncbar-btn ghost" onClick={onReview}>
            Review changes
          </button>
          <button className="db-syncbar-btn primary" onClick={onResolveWithKai}>
            <KbIcon name="sparkles" size={12} />
            Resolve with Kai
          </button>
        </div>
      </div>
    );
  }

  if (draftState === "conflict") {
    return (
      <div className="db-syncbar conflict">
        <div className="ic"><KbIcon name="circle-alert" size={14} /></div>
        <div className="body">
          <strong>Your draft conflicts with newer production changes.</strong>
          <span className="meta">{conflictCount} overlapping areas · publishing is paused until conflicts are resolved</span>
        </div>
        <div className="actions">
          <button className="db-syncbar-btn ghost" onClick={onReview}>
            Review changes
          </button>
          <button className="db-syncbar-btn primary" onClick={onResolveWithKai}>
            <KbIcon name="sparkles" size={12} />
            Resolve with Kai
          </button>
        </div>
      </div>
    );
  }

  return null;
};

window.BuilderSync = BuilderSync;
