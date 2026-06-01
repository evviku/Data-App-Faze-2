// Top bar for the Data App Builder.
// Contains: logo, breadcrumbs, app name + draft status, undo/redo, preview, publish, settings.

const Topbar = ({
  state,            // "empty" | "generating" | "generated"
  appName,
  setAppName,
  isDraft,
  hasUnpublished,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPreview,
  onShare,
  onPublish,
  publicUrlPath,
  onChangePublicUrl,
  themeId,
  onChangeTheme,
  onDiscardDraft,
  onOpenSettings,
  settingsOpen,
  onCloseSettings,
  onResetToEmpty,
  onNavApps,       // → Apps Index
  onNavAppDetail,  // → App Detail
  lifecycle,
  draftState,
  onSyncClick,
  onStartEditing,
  // Explore (version history) mode
  exploreMode,
  exploreVersion,
  onOpenExplore,
  onExitExplore,
  onRestoreVersion,
  onToggleCompare,
  exploreInCompare,
}) => {
  const draftLabel = state === "empty"
    ? "Draft · untouched"
    : hasUnpublished
      ? "Unpublished changes"
      : "Draft";

  const isSaved = !isDraft && !hasUnpublished;
  const isDraftOnly = lifecycle === "draft-only";
  const isProdOnly  = lifecycle === "production-only";
  const hasDraft    = lifecycle === "has-draft";
  const publishBlocked = draftState === "behind" || draftState === "conflict";
  const publishHidden  = state === "generated" && isProdOnly;
  const publishLabel = isDraftOnly ? "Publish first version" : "Publish";
  const [urlModalOpen, setUrlModalOpen] = React.useState(false);
  const [themeModalOpen, setThemeModalOpen] = React.useState(false);
  const [discardModalOpen, setDiscardModalOpen] = React.useState(false);
  const [urlDraft, setUrlDraft] = React.useState(publicUrlPath || "/apps/draft");
  const [themeDraft, setThemeDraft] = React.useState(themeId || "keboola");

  React.useEffect(() => {
    setUrlDraft(publicUrlPath || "/apps/draft");
  }, [publicUrlPath]);

  React.useEffect(() => {
    setThemeDraft(themeId || "keboola");
  }, [themeId]);

  const THEME_OPTIONS = [
    { id: "keboola", name: "Keboola", colors: ["#005CB8", "#1F8FFF", "#7CBDFE", "#F1F5F9"] },
    { id: "graphite", name: "Graphite", colors: ["#1e293b", "#475569", "#94A3B8", "#F1F5F9"] },
    { id: "kai", name: "Kai", colors: ["#6d28d9", "#9747FF", "#c084fc", "#F1F5F9"] },
    { id: "forest", name: "Forest", colors: ["#047857", "#10B981", "#6EE7B7", "#F1F5F9"] },
  ];

  // ── Explore Mode header — read-only exploration of version history
  if (exploreMode) {
    return (
      <header className="db-top" data-screen-label="Builder · explore mode">
        <div className="db-top-logo"><img src="assets/keboola-logo.svg" alt="Keboola" /></div>

        <button className="db-back" type="button" onClick={onExitExplore}>
          <KbIcon name="arrow-left" size={14} />
          <span>Return to Editing</span>
        </button>

        <span className="db-divider-v" style={{margin: "0 4px"}}></span>

        <div className="db-appname">
          <span className="db-appname-name" style={{color: "var(--foreground)", fontWeight: 600}}>
            {appName || "App"}
          </span>
          <span className="db-explore-tag">
            <KbIcon name="history" size={11} />
            Viewing Version History
            {exploreVersion && <> · <span className="v">{exploreVersion.v}</span></>}
          </span>
        </div>

        <div className="kb-grow" />

        <div className="db-top-actions">
          <button
            className="db-publish"
            onClick={() => onRestoreVersion?.(exploreVersion)}
            title="Restore this version as your personal draft"
          >
            <KbIcon name="history" size={14} />
            <span>Restore as draft</span>
          </button>
        </div>
      </header>
    );
  }

  // ── Normal Builder header

  return (
    <header className="db-top" data-screen-label={`Builder · ${state}`}>
      <div className="db-top-logo"><img src="assets/keboola-logo.svg" alt="Keboola" /></div>

      {/* Single lightweight back action — focused workspace mode */}
      <button
        className="db-back"
        type="button"
        onClick={onNavAppDetail || onNavApps}
        title={onNavAppDetail ? "Back to app detail" : "Back to Data Apps"}
      >
        <KbIcon name="arrow-left" size={14} />
        <span>{onNavAppDetail ? (appName || "App") : "Data Apps"}</span>
      </button>

      <span className="db-divider-v" style={{margin: "0 4px"}}></span>

      <div className="db-appname">
        {onNavAppDetail ? (
          <span className="db-appname-name" style={{color: "var(--foreground)", fontWeight: 600}}>
            {appName || "Editor"}
          </span>
        ) : (
          <input
            className="db-appname-name"
            value={appName}
            placeholder="Untitled App"
            onChange={(e) => setAppName(e.target.value)}
            spellCheck={false}
            data-comment-anchor="app-name"
          />
        )}
        {state === "generated" && isDraftOnly ? (
          <span className="db-sync-pill" style={{
            background: "rgba(151, 71, 255, 0.10)",
            color: "var(--color-kai-700)",
            borderColor: "rgba(151, 71, 255, 0.22)",
          }} title="Not deployed yet">
            <span className="dot"></span>
            Draft only
          </span>
        ) : state === "generated" && isProdOnly ? (
          <span className="db-sync-pill" style={{
            background: "var(--muted)",
            color: "var(--foreground-muted)",
            borderColor: "var(--border)",
          }} title="Viewing the production version">
            <span className="dot" style={{background: "var(--color-keboola-success-500)"}}></span>
            Viewing Production
          </span>
        ) : state === "generated" && draftState && draftState !== "up-to-date" ? (
          <button
            className={`db-sync-pill ${(draftState === "behind" || draftState === "conflict") ? "conflict" : draftState}`}
            onClick={onSyncClick}
            title="Open synchronization details"
          >
            <span className="dot"></span>
            {draftState === "behind" && "Requires review"}
            {draftState === "conflict" && "Requires review"}
            {draftState === "syncing" && "Syncing…"}
            {draftState === "just-synced" && "Just synced"}
          </button>
        ) : state === "generated" && draftState === "up-to-date" ? (
          <span className="db-sync-pill up-to-date" title="Based on latest production">
            <span className="dot"></span>
            Up to date
          </span>
        ) : (
          <span className={`db-draft-pill ${isSaved ? "saved" : ""}`}>
            <span className="dot"></span>
            {isSaved ? "Saved" : draftLabel}
          </span>
        )}
      </div>

      <div className="kb-grow" />

      <div className="db-top-actions">
        <button
          className="db-iconbtn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
          aria-label="Undo"
        >
          <KbIcon name="undo" size={16} />
        </button>
        <button
          className="db-iconbtn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
          aria-label="Redo"
        >
          <KbIcon name="redo" size={16} />
        </button>
        <button
          className="db-iconbtn"
          title="Version history"
          aria-label="History"
          onClick={onOpenExplore}
        >
          <KbIcon name="history" size={16} />
        </button>

        <span className="db-divider-v"></span>

        <button
          className="db-iconbtn"
          onClick={onShare}
          title="Share"
          aria-label="Share"
        >
          <KbIcon name="share" size={16} />
        </button>

        <button
          className="db-preview-btn"
          onClick={onPreview}
          title="Open public preview"
        >
          <KbIcon name="eye" size={14} />
          <span>Preview</span>
        </button>

        {publishHidden ? (
          <button
            className="db-publish"
            disabled
            title="No unpublished changes — edit the app to create a draft"
            style={{opacity: 0.45, cursor: "default"}}
          >
            <KbIcon name="check" size={14} />
            <span>Published</span>
          </button>
        ) : (
          <button
            className="db-publish"
            onClick={publishBlocked ? null : onPublish}
            title={
              state === "empty" ? "Generate the app first"
                : publishBlocked ? "Review production updates before publishing"
                : isDraftOnly ? "Publish the first version of this app"
                : "Publish a new version"
            }
            disabled={state === "empty" || publishBlocked}
            style={
              isDraftOnly && !publishBlocked && state !== "empty"
                ? {background: "linear-gradient(135deg, var(--color-keboola-700) 0%, var(--color-kai-500) 100%)"}
                : (state === "empty" || publishBlocked) ? {opacity: 0.4, cursor: "not-allowed"} : null
            }
          >
            <KbIcon name="rocket" size={14} />
            <span>{publishLabel}</span>
          </button>
        )}

        <span className="db-divider-v"></span>

        <button
          className={`db-iconbtn ${settingsOpen ? "active" : ""}`}
          onClick={() => settingsOpen ? onCloseSettings() : onOpenSettings()}
          title="App settings"
          aria-label="Settings"
        >
          <KbIcon name="settings" size={16} />
        </button>
      </div>

      {settingsOpen && (
        <div className="db-popover" onMouseLeave={onCloseSettings}>
          <div className="item" onClick={() => { onCloseSettings(); setUrlModalOpen(true); }}>
            <KbIcon name="globe" size={14} /> Change URL
            <span className="meta">{publicUrlPath}</span>
          </div>
          <div className="item" onClick={() => { onCloseSettings(); setThemeModalOpen(true); }}>
            <KbIcon name="sparkles" size={14} /> Change theme
            <span className="meta">{themeId}</span>
          </div>
          <div className="sep"></div>
          <div className="item" onClick={() => { onCloseSettings(); setDiscardModalOpen(true); }}>
            <KbIcon name="trash" size={14} /> Discard draft
          </div>
        </div>
      )}

      {urlModalOpen && (
        <div className="db-modal-bg" onClick={() => setUrlModalOpen(false)}>
          <div className="db-modal" onClick={(e) => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2>Change URL</h2>
              <p>Set the app path used for preview and publish links.</p>
            </div>
            <div className="db-modal-body">
              <label>Public path</label>
              <input
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="/apps/customer-analytics"
              />
            </div>
            <div className="db-modal-foot">
              <button className="db-secondary-btn" onClick={() => setUrlModalOpen(false)}>Cancel</button>
              <button
                className="db-publish"
                onClick={() => {
                  const cleaned = String(urlDraft || "").trim();
                  const normalized = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
                  onChangePublicUrl?.(normalized || "/apps/draft");
                  setUrlModalOpen(false);
                }}
              >
                Save URL
              </button>
            </div>
          </div>
        </div>
      )}

      {themeModalOpen && (
        <div className="db-modal-bg" onClick={() => setThemeModalOpen(false)}>
          <div className="db-modal" onClick={(e) => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2>Change theme</h2>
              <p>Select a visual palette for this draft.</p>
            </div>
            <div className="db-modal-body">
              <div className="db-settings-theme-row">
                {THEME_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    className={`db-settings-theme-swatch ${themeDraft === p.id ? "selected" : ""}`}
                    onClick={() => setThemeDraft(p.id)}
                  >
                    <span className="colors">
                      {p.colors.map((c, i) => <span key={i} style={{ background: c }}></span>)}
                    </span>
                    <span>{p.name}</span>
                    <span className="check"><KbIcon name="check" size={10} /></span>
                  </button>
                ))}
              </div>
            </div>
            <div className="db-modal-foot">
              <button className="db-secondary-btn" onClick={() => setThemeModalOpen(false)}>Cancel</button>
              <button
                className="db-publish"
                onClick={() => {
                  onChangeTheme?.(themeDraft);
                  setThemeModalOpen(false);
                }}
              >
                Apply theme
              </button>
            </div>
          </div>
        </div>
      )}

      {discardModalOpen && (
        <div className="db-modal-bg" onClick={() => setDiscardModalOpen(false)}>
          <div className="db-modal" onClick={(e) => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2>Discard draft</h2>
              <p>This removes your unpublished changes for the current draft.</p>
            </div>
            <div className="db-modal-foot">
              <button className="db-secondary-btn" onClick={() => setDiscardModalOpen(false)}>Cancel</button>
              <button
                className="db-publish"
                style={{background: "var(--color-keboola-danger-700)"}}
                onClick={() => {
                  onDiscardDraft?.();
                  setDiscardModalOpen(false);
                }}
              >
                Discard draft
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

window.Topbar = Topbar;
