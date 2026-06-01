// Generating transition — runs while Kai scaffolds the app.
// Auto-completes steps over ~3.6s, then calls onComplete.

const STEPS = [
  { id: "repo", label: "Provisioning Keboola-managed repository", meta: "git://kbc/sarah-app", t: 600 },
  { id: "data", label: "Resolving data context from Storage", meta: "in.c-marts.customers", t: 700 },
  { id: "scaffold", label: "Scaffolding app structure", meta: "streamlit + duckdb", t: 700 },
  { id: "ui", label: "Generating UI components", meta: "KPIs · charts · table", t: 800 },
  { id: "publish", label: "Wiring data bindings & preview", meta: "draft @ HEAD", t: 800 },
];

const Generating = ({ promptText, onComplete }) => {
  const [stepIdx, setStepIdx] = React.useState(0);

  React.useEffect(() => {
    if (stepIdx >= STEPS.length) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIdx((i) => i + 1), STEPS[stepIdx].t);
    return () => clearTimeout(t);
  }, [stepIdx, onComplete]);

  return (
    <section className="db-generating db-fade" data-screen-label="Builder · generating">
      <div className="db-generating-card">
        <div className="db-generating-head">
          <div className="db-generating-orb"></div>
          <div>
            <h3>Kai is building your app…</h3>
            <p>{promptText
              ? `“${promptText.slice(0, 96)}${promptText.length > 96 ? "…" : ""}”`
              : "Preparing a working draft from your prompt."}</p>
          </div>
        </div>

        <div className="db-generating-steps">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <div
                key={s.id}
                className={`db-genstep ${done ? "done" : ""} ${active ? "active" : ""}`}
              >
                <span className="icon">
                  {done && <KbIcon name="check" size={12} />}
                  {active && <span style={{width: 6, height: 6, borderRadius: 9999, background: "currentColor"}} />}
                  {!done && !active && <span style={{width: 4, height: 4, borderRadius: 9999, background: "currentColor", opacity: 0.5}} />}
                </span>
                <span>{s.label}</span>
                {(done || active) && <span className="meta">{s.meta}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

window.Generating = Generating;
