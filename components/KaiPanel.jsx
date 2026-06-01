// Kai panel — contextual editing assistant shown in the Generated state.
// Holds a small thread + suggested actions + composer.

const DEFAULT_SUGGESTIONS = [
  { icon: "wand", label: "Polish the visual style", desc: "Tune typography, spacing and accent color." },
  { icon: "database", label: "Connect more data", desc: "Add product analytics from in.c-events.product_use." },
  { icon: "bar-chart", label: "Add a cohort retention chart", desc: "Weekly cohorts from first purchase." },
  { icon: "users", label: "Add a customer detail page", desc: "Click a row to drill into ARR history." },
  { icon: "mail", label: "Schedule a weekly email digest", desc: "Email the top 5 at-risk accounts every Monday." },
];

const KaiPanel = ({
  onClose,
  promptText,
  messages,
  onSend,
  isThinking,
  onApplySuggestion,
  mode,    // 'default' | 'conflict'
  onApplyMerge,
}) => {
  const [text, setText] = React.useState("");
  const bodyRef = React.useRef(null);
  const taRef = React.useRef(null);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, isThinking]);

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    onSend(v);
    setText("");
  };

  return (
    <aside className="db-kai-panel db-fade" data-screen-label="Kai · editing assistant">
      <div className="db-kai-head">
        <div className="db-kai-avatar"><KbIcon name="sparkles" size={16} /></div>
        <div>
          <h3>Kai</h3>
          <div className="meta">Editing draft · context-aware</div>
        </div>
        <button className="db-iconbtn x" onClick={onClose} title="Close Kai">
          <KbIcon name="panel-right" size={16} />
        </button>
      </div>

      <div className="db-kai-body" ref={bodyRef}>
        {mode === "explore" ? (
          <KaiExploreIntro version={typeof window !== "undefined" ? window.__exploreVersion : null} />
        ) : mode === "compare" ? (
          <KaiCompareIntro a={typeof window !== "undefined" ? window.__exploreVersion : null} b={typeof window !== "undefined" ? window.__exploreCompareWith : null} />
        ) : mode === "generating" ? (
          <KaiGeneratingIntro promptText={promptText} />
        ) : mode === "syncing" ? (
          <KaiSyncIntro />
        ) : mode === "behind" ? (
          <KaiBehindIntro />
        ) : mode === "review" ? (
          <KaiReviewIntro />
        ) : mode === "conflict" ? (
          <KaiConflictIntro />
        ) : mode === "surface" ? (
          <div className="db-kai-msg">
            <div className="av"><KbIcon name="sparkles" size={12} /></div>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="name">Kai <span className="time">just now</span></div>
              <div className="bubble">
                I can help you organize and refine your apps workspace.

                <div className="db-kai-section-label" style={{marginTop: 12}}>Suggested actions</div>
                <div className="db-kai-suggestions">
                  {DEFAULT_SUGGESTIONS.slice(0, 3).map((s) => (
                    <button
                      key={s.label}
                      className="db-kai-sug"
                      onClick={() => onApplySuggestion?.(s)}
                    >
                      <KbIcon name={s.icon} size={14} />
                      <div style={{flex: 1, minWidth: 0}}>
                        <div>{s.label}</div>
                        <div style={{font: "400 11.5px var(--font-mono)", color: "var(--foreground-muted)", marginTop: 2}}>{s.desc}</div>
                      </div>
                      <KbIcon name="arrow-up-right" size={12} className="arr" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Default "I created your app" intro */
          <div className="db-kai-msg">
            <div className="av"><KbIcon name="sparkles" size={12} /></div>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="name">Kai <span className="time">just now</span></div>
              <div className="bubble">
                I created the first version of your app from{" "}
                <strong>“{(promptText || "your prompt").slice(0, 64)}{(promptText || "").length > 64 ? "…" : ""}”</strong>.
                You can refine sections, connect additional data or adjust the layout.

                <div className="db-kai-action-card">
                  <KbIcon name="git-commit" size={14} />
                  <div>
                    <div>Initial commit</div>
                    <div className="desc">8b7c1f3 · 14 files · main branch</div>
                  </div>
                  <button className="btn">View</button>
                </div>

                <div className="db-kai-section-label" style={{marginTop: 12}}>Suggested next steps</div>
                <div className="db-kai-suggestions">
                  {DEFAULT_SUGGESTIONS.slice(0, 3).map((s) => (
                    <button
                      key={s.label}
                      className="db-kai-sug"
                      onClick={() => onApplySuggestion?.(s)}
                    >
                      <KbIcon name={s.icon} size={14} />
                      <div style={{flex: 1, minWidth: 0}}>
                        <div>{s.label}</div>
                        <div style={{font: "400 11.5px var(--font-mono)", color: "var(--foreground-muted)", marginTop: 2}}>{s.desc}</div>
                      </div>
                      <KbIcon name="arrow-up-right" size={12} className="arr" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic messages */}
        {messages.map((m, i) => (
          <KaiMessage key={i} m={m} onApplyMerge={onApplyMerge} />
        ))}

        {isThinking && (
          <div className="db-kai-msg">
            <div className="av"><KbIcon name="sparkles" size={12} /></div>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="name">Kai <span className="time">working…</span></div>
              <div className="bubble">
                <span className="db-pulse" style={{font: "400 13px var(--font-mono)", color: "var(--foreground-muted)"}}>
                  ▍thinking · reading schema · drafting change
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="db-kai-composer">
        <div className="db-kai-composer-box">
          <textarea
            ref={taRef}
            value={text}
            placeholder="Ask Kai to refine your app…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
          />
          <div className="db-kai-composer-foot">
            <button className="db-kai-iconbtn" title="Attach table"><KbIcon name="database" size={14} /></button>
            <button className="db-kai-iconbtn" title="Attach file"><KbIcon name="paperclip" size={14} /></button>
            <button className="db-kai-iconbtn" title="Voice"><KbIcon name="mic" size={14} /></button>
            <span style={{font: "400 11px var(--font-mono)", color: "var(--foreground-subtle)", marginLeft: 4}}>
              ⌘↵ to send
            </span>
            <button className="db-kai-send" onClick={submit} disabled={!text.trim()}>
              <KbIcon name="send" size={12} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

const KaiMessage = ({ m, onApplyMerge }) => {
  if (m.role === "user") {
    return (
      <div className="db-kai-msg user">
        <div className="av">SH</div>
        <div style={{flex: 1, minWidth: 0}}>
          <div className="name">You <span className="time">{m.time}</span></div>
          <div className="bubble">{m.text}</div>
        </div>
      </div>
    );
  }
  if (m.conflict) {
    return <KaiConflictMessage m={m} onApplyMerge={onApplyMerge} />;
  }
  return (
    <div className="db-kai-msg">
      <div className="av"><KbIcon name="sparkles" size={12} /></div>
      <div style={{flex: 1, minWidth: 0}}>
        <div className="name">Kai <span className="time">{m.time}</span></div>
        <div className="bubble">
          {m.text}
          {m.diff && (
            <div className="db-kai-action-card">
              <KbIcon name="git-commit" size={14} />
              <div>
                <div>{m.diff.title}</div>
                <div className="desc">{m.diff.subtitle}</div>
              </div>
              <button className="btn">View</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const KaiConflictMessage = ({ m, onApplyMerge }) => {
  const [resolved, setResolved] = React.useState(false);
  return (
    <div className="db-kai-msg">
      <div className="av"><KbIcon name="sparkles" size={12} /></div>
      <div style={{flex: 1, minWidth: 0}}>
        <div className="name">Kai <span className="time">{m.time}</span></div>
        <div className="bubble">
          Production changed in <strong>2 areas</strong> that your draft also modified. I can apply
          the production updates while keeping your edits intact. Here's my proposed merge:

          <div className="db-kai-action-card" style={{flexDirection: "column", alignItems: "stretch"}}>
            <div style={{display: "flex", alignItems: "flex-start", gap: 10}}>
              <KbIcon name="braces" size={14} style={{marginTop: 3}} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontWeight: 600}}>KPI section</div>
                <div className="desc">Keep your churn-risk delta · adopt production's new Net retention card</div>
              </div>
            </div>
            <div style={{display: "flex", alignItems: "flex-start", gap: 10, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)"}}>
              <KbIcon name="filter" size={14} style={{marginTop: 3}} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontWeight: 600}}>Filter logic</div>
                <div className="desc">Adopt production's "rolling 30 days" wording — same behaviour, consistent label</div>
              </div>
            </div>
          </div>

          {!resolved ? (
            <div className="kb-row" style={{gap: 8, marginTop: 12}}>
              <button
                className="kb-btn default sm"
                onClick={() => { setResolved(true); onApplyMerge?.(); }}
                style={{background: "linear-gradient(135deg, var(--color-keboola-700) 0%, var(--color-kai-500) 100%)"}}
              >
                <KbIcon name="check" size={14} className="kb-icon" /> Apply merge
              </button>
              <button className="kb-btn outline sm">Review file-by-file</button>
              <button className="kb-btn ghost sm">Keep my version</button>
            </div>
          ) : (
            <div style={{
              marginTop: 12,
              padding: "10px 12px",
              background: "var(--color-keboola-success-50)",
              border: "1px solid var(--color-keboola-success-200)",
              borderRadius: 8,
              color: "var(--color-keboola-success-700)",
              font: "500 13px var(--font-sans)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <KbIcon name="circle-check" size={14} />
              Merged. Your draft is now based on Production v1.4.3.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.KaiPanel = KaiPanel;

/* ─── Sync-mode intros (Kai) ─────────────────────────── */

const KaiConflictIntro = () => (
  <div className="db-kai-msg">
    <div className="av"><KbIcon name="sparkles" size={12} /></div>
    <div style={{flex: 1, minWidth: 0}}>
      <div className="name">Kai <span className="time">just now</span></div>
      <div className="bubble">
        Welcome back. While you were away, production was updated — your draft is now <strong>2 hours behind</strong>,
        and two of the changes overlap with your edits. I've analyzed the diff and prepared
        a merge that preserves your intent.
      </div>
    </div>
  </div>
);

const KaiBehindIntro = () => (
  <div className="db-kai-msg">
    <div className="av"><KbIcon name="sparkles" size={12} /></div>
    <div style={{flex: 1, minWidth: 0}}>
      <div className="name">Kai <span className="time">just now</span></div>
      <div className="bubble">
        Production was updated while you were editing. I can help review the
        incoming changes and safely update your draft — your edits will be preserved.

        <div className="db-kai-incoming-list">
          {PRODUCTION_INCOMING.slice(0, 4).map((c, i) => (
            <div key={i} className={`db-kai-incoming-item ${c.overlap ? "overlap" : ""}`}>
              <span className="ic"><KbIcon name={c.overlap ? "circle-alert" : "git-commit"} size={11} /></span>
              <div style={{flex: 1, minWidth: 0}}>
                {c.line}
                <span className="meta">
                  <span className="area">{c.area}</span>
                  {c.who} · {c.time}
                </span>
              </div>
              <span className="tag">{c.overlap ? "Overlaps" : "Safe"}</span>
            </div>
          ))}
        </div>

        <div className="kb-row" style={{marginTop: 12, gap: 8}}>
          <button
            className="kb-btn default sm"
            style={{background: "linear-gradient(135deg, var(--color-keboola-700) 0%, var(--color-kai-500) 100%)"}}
          >
            <KbIcon name="arrow-down" size={14} className="kb-icon" /> Update my draft base
          </button>
          <button className="kb-btn outline sm">Open in App detail</button>
        </div>
      </div>
    </div>
  </div>
);

const KaiReviewIntro = () => (
  <div className="db-kai-msg">
    <div className="av"><KbIcon name="sparkles" size={12} /></div>
    <div style={{flex: 1, minWidth: 0}}>
      <div className="name">Kai <span className="time">just now</span></div>
      <div className="bubble">
        Here's what changed in production since you started this draft. I've marked
        the items that overlap with your edits — those will need to be merged when you update your draft base.

        <div className="db-kai-incoming-list">
          {PRODUCTION_INCOMING.map((c, i) => (
            <div key={i} className={`db-kai-incoming-item ${c.overlap ? "overlap" : ""}`}>
              <span className="ic"><KbIcon name={c.overlap ? "circle-alert" : "git-commit"} size={11} /></span>
              <div style={{flex: 1, minWidth: 0}}>
                {c.line}
                <span className="meta">
                  <span className="area">{c.area}</span>
                  {c.who} · {c.time}
                </span>
              </div>
              <span className="tag">{c.overlap ? "Overlaps" : "Safe"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const KaiSyncIntro = () => {
  const SYNC_STEPS = [
    { id: "read",   label: "Reading production v1.4.3",                meta: "4 incoming changes" },
    { id: "diff",   label: "Diffing against your draft",               meta: "6 edits scanned" },
    { id: "pull",   label: "Pulling production changes into your draft", meta: "preserving your edits" },
    { id: "verify", label: "Verifying your edits are intact",          meta: "all 6 preserved" },
    { id: "done",   label: "Draft base updated",                        meta: "now on v1.4.3" },
  ];
  const [stepIdx, setStepIdx] = React.useState(0);

  React.useEffect(() => {
    if (stepIdx >= SYNC_STEPS.length) return;
    const t = setTimeout(() => setStepIdx((i) => i + 1), 700);
    return () => clearTimeout(t);
  }, [stepIdx]);

  return (
    <div className="db-kai-msg">
      <div className="av"><KbIcon name="sparkles" size={12} /></div>
      <div style={{flex: 1, minWidth: 0}}>
        <div className="name">Kai <span className="time">working…</span></div>
        <div className="bubble">
          Updating your draft base from Production v1.4.3. I'll preserve every edit you've made.

          <div className="db-kai-sync">
            {SYNC_STEPS.map((s, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div
                  key={s.id}
                  className={`db-kai-sync-step ${done ? "done" : ""} ${active ? "active" : ""}`}
                >
                  <span className="ic">
                    {done && <KbIcon name="check" size={11} />}
                    {active && <span style={{width: 5, height: 5, borderRadius: 9999, background: "currentColor"}} />}
                    {!done && !active && <span style={{width: 4, height: 4, borderRadius: 9999, background: "currentColor", opacity: 0.5}} />}
                  </span>
                  <span>{s.label}</span>
                  {(done || active) && <span className="meta">{s.meta}</span>}
                </div>
              );
            })}
          </div>

          {stepIdx >= SYNC_STEPS.length && (
            <div style={{
              marginTop: 10,
              padding: "10px 12px",
              background: "var(--color-keboola-success-50)",
              border: "1px solid var(--color-keboola-success-200)",
              borderRadius: 8,
              color: "var(--color-keboola-success-700)",
              font: "500 13px var(--font-sans)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <KbIcon name="circle-check" size={14} />
              Your draft is now based on Production v1.4.3.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { KaiConflictIntro, KaiBehindIntro, KaiReviewIntro, KaiSyncIntro });

/* ─── Generating-mode intro — streams while builder scaffolds ─── */
const KaiGeneratingIntro = ({ promptText }) => {
  const STREAM = [
    { id: "plan",   label: "Reading your prompt and planning sections" },
    { id: "data",   label: "Resolving data context from Storage" },
    { id: "scaffold", label: "Scaffolding app structure" },
    { id: "ui",     label: "Drafting UI components" },
    { id: "wire",   label: "Wiring data bindings and preview" },
  ];
  const [stepIdx, setStepIdx] = React.useState(0);

  React.useEffect(() => {
    if (stepIdx >= STREAM.length) return;
    const t = setTimeout(() => setStepIdx((i) => i + 1), 720);
    return () => clearTimeout(t);
  }, [stepIdx]);

  const trimmed = (promptText || "").slice(0, 96);
  return (
    <div className="db-kai-msg">
      <div className="av"><KbIcon name="sparkles" size={12} /></div>
      <div style={{flex: 1, minWidth: 0}}>
        <div className="name">Kai <span className="time">working…</span></div>
        <div className="bubble">
          {promptText ? (
            <>I'm building your app right now from <strong>“{trimmed}{(promptText || "").length > 96 ? "…" : ""}”</strong>. I'll narrate sections here as they come online.</>
          ) : (
            <>I'm scaffolding your app right now. I'll narrate sections here as they come online.</>
          )}

          <div className="db-kai-sync">
            {STREAM.map((s, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div
                  key={s.id}
                  className={`db-kai-sync-step ${done ? "done" : ""} ${active ? "active" : ""}`}
                >
                  <span className="ic">
                    {done && <KbIcon name="check" size={11} />}
                    {active && <span style={{width: 5, height: 5, borderRadius: 9999, background: "currentColor"}} />}
                    {!done && !active && <span style={{width: 4, height: 4, borderRadius: 9999, background: "currentColor", opacity: 0.5}} />}
                  </span>
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

window.KaiGeneratingIntro = KaiGeneratingIntro;

/* ─── Explore-mode intros ──────────────────────────────── */

const KaiExploreIntro = ({ version }) => (
  <div className="db-kai-msg">
    <div className="av"><KbIcon name="sparkles" size={12} /></div>
    <div style={{flex: 1, minWidth: 0}}>
      <div className="name">Kai <span className="time">just now</span></div>
      <div className="bubble">
        Switched to <strong>Explore Mode</strong>. You're viewing a read-only snapshot of{" "}
        {version ? <strong>{version.v}</strong> : "an earlier version"} — editing affordances are paused.
        I can help compare versions, explain what changed, or restore a version as a personal draft.

        <div className="db-kai-section-label" style={{marginTop: 12}}>I can help you with</div>
        <div className="db-kai-suggestions">
          <button className="db-kai-sug">
            <KbIcon name="git-fork" size={14} />
            <div style={{flex: 1, minWidth: 0}}>
              <div>Compare this version with production</div>
              <div style={{font: "400 11.5px var(--font-mono)", color: "var(--foreground-muted)", marginTop: 2}}>
                Side-by-side summary of UI, filters and data changes
              </div>
            </div>
            <KbIcon name="arrow-up-right" size={12} className="arr" />
          </button>
          <button className="db-kai-sug">
            <KbIcon name="history" size={14} />
            <div style={{flex: 1, minWidth: 0}}>
              <div>Restore {version ? version.v : "this version"} as a personal draft</div>
              <div style={{font: "400 11.5px var(--font-mono)", color: "var(--foreground-muted)", marginTop: 2}}>
                Creates a new draft based on this snapshot — production stays untouched
              </div>
            </div>
            <KbIcon name="arrow-up-right" size={12} className="arr" />
          </button>
          <button className="db-kai-sug">
            <KbIcon name="sparkles" size={14} />
            <div style={{flex: 1, minWidth: 0}}>
              <div>Explain what changed since {version ? version.v : "this version"}</div>
              <div style={{font: "400 11.5px var(--font-mono)", color: "var(--foreground-muted)", marginTop: 2}}>
                Plain-English summary of releases that came after
              </div>
            </div>
            <KbIcon name="arrow-up-right" size={12} className="arr" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const KaiCompareIntro = ({ a, b }) => (
  <div className="db-kai-msg">
    <div className="av"><KbIcon name="sparkles" size={12} /></div>
    <div style={{flex: 1, minWidth: 0}}>
      <div className="name">Kai <span className="time">just now</span></div>
      <div className="bubble">
        Comparing <strong>{a?.v || "version"}</strong> with <strong>{b?.v || "version"}</strong>.
        The biggest differences are in <strong>KPI section</strong> and <strong>Filter logic</strong> —
        {b?.isProduction || a?.isProduction ? " production now uses a rolling 30-day default." : " an earlier filter approach was used."}

        <div className="db-kai-action-card" style={{marginTop: 10}}>
          <KbIcon name="git-fork" size={14} />
          <div>
            <div>Most notable change</div>
            <div className="desc">Added Net retention KPI · adopted rolling 30d filter</div>
          </div>
        </div>
        <div className="kb-row" style={{gap: 8, marginTop: 12}}>
          <button className="kb-btn outline sm">Explain {b?.v || "this version"} in detail</button>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { KaiExploreIntro, KaiCompareIntro });
