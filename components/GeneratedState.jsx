// Generated state — composes the canvas + Kai panel.

const GeneratedState = ({
  appName, kpiTone, density, editable,
  publicPath,
  showSyncBar,
  draftState,
  onReviewSync,
  onUpdateDraftBase,
  onResolveWithKai,
  onDismissSyncBar,
  range, setRange,
  segmentMode, setSegmentMode,
  filter, setFilter,
  kaiOpen, setKaiOpen,
  promptText,
  messages, sendMessage, isThinking,
  onApplySuggestion,
  kaiMode,
  onApplyMerge,
}) => {
  return (
    <div className="db-canvas db-fade" style={{display: "flex", flexDirection: "row", alignItems: "stretch", flex: 1, minHeight: 0, overflow: "hidden", background: "transparent"}}>
      {/* Canvas column — toolbar + scroll */}
      <div style={{display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden",
        background:
          "radial-gradient(circle at 0 0, var(--color-slate-200) 1px, transparent 1px) 0 0/24px 24px, var(--background)"
      }}>
        {showSyncBar && draftState && draftState !== "up-to-date" && (
          <BuilderSync
            draftState={draftState}
            onReview={onReviewSync}
            onUpdateBase={onUpdateDraftBase}
            onResolveWithKai={onResolveWithKai}
            onDismiss={onDismissSyncBar}
          />
        )}

        <div className="db-canvas-toolbar">
          <div className="device">
            <button className="active"><KbIcon name="layout-dashboard" size={12} /> Desktop</button>
            <button><KbIcon name="table" size={12} /> Tablet</button>
            <button><KbIcon name="circle" size={12} /> Mobile</button>
          </div>

          <span className="url">
            <span className="live"></span>
            keboola.app{publicPath || `/apps/${(appName || "untitled").toLowerCase().replace(/\s+/g, "-")}`}/draft
          </span>

          <span className="db-canvas-status autosaving">
            <span className="dot"></span>
            Autosaving draft…
          </span>

          <div className="kb-grow"></div>

          {!kaiOpen && (
            <button
              className="db-iconbtn"
              onClick={() => setKaiOpen(true)}
              title="Open Kai panel"
              style={{
                color: "#fff",
                background: "linear-gradient(135deg, var(--color-keboola-700) 0%, var(--color-kai-500) 100%)",
              }}
            >
              <KbIcon name="sparkles" size={14} />
            </button>
          )}
        </div>

        <div className="db-canvas-scroll">
          <GeneratedApp
            kpiTone={kpiTone}
            density={density}
            editable={editable}
            range={range}
            setRange={setRange}
            segmentMode={segmentMode}
            setSegmentMode={setSegmentMode}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
      </div>

      {/* Kai panel — full body height, slides from the right and shifts canvas */}
      <div className={`app-kai-shell ${kaiOpen ? "open" : ""}`}>
        <KaiPanel
          onClose={() => setKaiOpen(false)}
          promptText={promptText}
          messages={messages}
          onSend={sendMessage}
          isThinking={isThinking}
          onApplySuggestion={onApplySuggestion}
          mode={kaiMode}
          onApplyMerge={onApplyMerge}
        />
      </div>
    </div>
  );
};

window.GeneratedState = GeneratedState;
