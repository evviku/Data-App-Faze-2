// App Detail page — header (per Keboola template) + Overview / Draft / Runs / Terminal Logs tabs.

const AppDetail = ({ appId, onBack, onContinueEditing, onPublish, tab, setTab, draftState, onResolveWithKai, onUpdateBase, onReviewChanges, onRestoreVersion, onPreviewVersion, lifecycleOverride }) => {
  const baseApp = APPS.find((a) => a.id === appId) || APPS[0];
  const app = lifecycleOverride ? { ...baseApp, lifecycle: lifecycleOverride } : baseApp;
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const [desc, setDesc] = React.useState(app.desc);

  const isConflict   = draftState === "conflict";
  const isBehind     = draftState === "behind";
  const isDraftOnly  = app.lifecycle === "draft-only";
  const isProdOnly   = app.lifecycle === "production-only";
  const hasDraft     = app.lifecycle === "has-draft";
  const overviewStateClass = isConflict ? "conflict" : isBehind ? "behind" : "unpublished";

  const tabs = [
    { id: "overview",    label: "Overview",      icon: "layout-dashboard" },
    { id: "draft",       label: "Draft",         icon: "git-branch", warning: hasDraft && isBehind },
    { id: "versions",    label: "Versions",      icon: "history",    count: VERSIONS.length },
    { id: "runs",        label: "Runs",          icon: "play" },
    { id: "logs",        label: "Terminal Logs", icon: "code" },
  ];

  return (
    <div className="dx-page" data-screen-label={`App Detail · ${app.name} · ${tab}`}>
      <div className="dx-page-inner">

        {/* Breadcrumbs */}
        <div className="dx-crumbs">
          <button onClick={onBack}>Apps</button>
          <span className="sep"><KbIcon name="chevron-right" size={14} /></span>
          <span className="current">{app.name}</span>
          <button
            className="overflow"
            onClick={() => setOverflowOpen((v) => !v)}
            aria-label="More actions"
            style={{position: "relative"}}
          >
            <KbIcon name="more-horizontal" size={16} />
            {overflowOpen && (
              <div className="dx-popover" onMouseLeave={() => setOverflowOpen(false)} style={{top: 32, left: 0}}>
                <button
                  className="item"
                  onClick={() => {
                    setTab("versions");
                    setOverflowOpen(false);
                  }}
                >
                  <KbIcon name="history" size={14} />
                  Restore configuration
                </button>
                <button className="item" onClick={() => setOverflowOpen(false)}>
                  <KbIcon name="copy" size={14} />
                  Copy app
                </button>
                <button className="item" onClick={() => setOverflowOpen(false)}>
                  <KbIcon name="workflow" size={14} />
                  Automate
                </button>
                <button className="item" onClick={() => setOverflowOpen(false)}>
                  <KbIcon name="code" size={14} />
                  Debug mode
                </button>
                <button className="item danger" onClick={() => setOverflowOpen(false)}>
                  <KbIcon name="trash" size={14} />
                  Delete app
                </button>
              </div>
            )}
          </button>
        </div>

        {/* Title row */}
        <div className="dx-title-row">
          <div className="dx-title-left">
            <div className={`dx-app-icon ${app.status === "published" ? "published" : ""}`}>
              <KbIcon name={app.repo === "managed" ? "sparkles" : "git-branch"} size={26} />
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <h1 className="dx-title">
                <span className="name">{app.name}</span>
                <span className="dx-badges">
                  {isDraftOnly && (
                    <span className="dx-badge" style={{background: "rgba(151,71,255,0.10)", color: "var(--color-kai-700)"}}>
                      <span className="dot"></span>
                      Draft only · not deployed
                    </span>
                  )}
                  {!isDraftOnly && app.status === "published" && (
                    <span className="dx-badge published">
                      <span className="dot"></span>
                      Published
                    </span>
                  )}
                  {!isDraftOnly && app.status === "stopped" && (
                    <span className="dx-badge stopped">
                      <span className="dot"></span>
                      Stopped
                    </span>
                  )}
                  {!isDraftOnly && app.status === "failed" && (
                    <span className="dx-badge" style={{background: "var(--color-keboola-danger-50)", color: "var(--color-keboola-danger-700)"}}>
                      <span className="dot"></span>
                      Last run failed
                    </span>
                  )}
                  {hasDraft && draftState === "conflict" && (
                    <span className="dx-badge draft">
                      <span className="dot"></span>
                      Your draft · 2 require review
                    </span>
                  )}
                  {hasDraft && draftState === "behind" && (
                    <span className="dx-badge draft">
                      <span className="dot"></span>
                      Your draft · behind production
                    </span>
                  )}
                  {hasDraft && (draftState === "up-to-date" || !draftState) && (
                    <span className="dx-badge managed" style={{background: "rgba(151,71,255,0.10)"}}>
                      <span className="dot"></span>
                      Your draft · {app.draftAge}
                    </span>
                  )}
                  {app.repo === "managed" ? (
                    <span className="dx-badge managed">
                      <KbIcon name="lock" size={10} />
                      Keboola-managed
                    </span>
                  ) : (
                    <span className="dx-badge muted">
                      <KbIcon name="github" size={10} />
                      External repository
                    </span>
                  )}
                </span>
              </h1>
            </div>
          </div>
          <div className="dx-title-actions">
            <button className="dx-link-action" onClick={() => window.open("about:blank")}>
              <KbIcon name="arrow-up-right" size={14} />
              Open App
            </button>
            <button className="dx-primary-btn" onClick={onContinueEditing}>
              <KbIcon name="pencil" size={14} />
              {isProdOnly ? "Edit" : "Continue Editing"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="dx-desc">
          <div
            className="body"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setDesc(e.currentTarget.textContent)}
          >
            {desc}
          </div>
          <KbIcon name="pencil" size={14} className="pencil" />
        </div>

        {/* Tabs */}
        <div className="dx-tabs" role="tablist">
          {tabs.map((tDef) => (
            <button
              key={tDef.id}
              role="tab"
              aria-selected={tab === tDef.id}
              className={`dx-tab ${tab === tDef.id ? "active" : ""}`}
              onClick={() => setTab(tDef.id)}
            >
              <KbIcon name={tDef.icon} size={14} />
              {tDef.label}
              {tDef.warning && (
                <span className="warning-indicator" aria-label="Draft behind production">
                  <KbIcon name="circle-alert" size={12} />
                </span>
              )}
              {tDef.count != null && <span className="count">{tDef.count}</span>}
            </button>
          ))}
        </div>

        {/* Tab body */}
        {tab === "overview" && (
          <OverviewTab
            app={app}
            onGoToVersions={() => setTab("versions")}
            onGoToRuns={() => setTab("runs")}
          />
        )}
        {tab === "draft" && <DraftTab app={app} draftState={draftState} onContinueEditing={onContinueEditing} onPublish={onPublish} onResolveWithKai={onResolveWithKai} onUpdateBase={onUpdateBase} onReviewChanges={onReviewChanges} editLabel={isProdOnly ? "Edit" : "Continue Editing"} />}
        {tab === "versions" && <VersionsTab app={app} onRestoreVersion={onRestoreVersion} onPreviewVersion={onPreviewVersion} onContinueEditing={onContinueEditing} editLabel={isProdOnly ? "Edit" : "Continue Editing"} />}
        {tab === "runs" && <RunsTab />}
        {tab === "logs" && <LogsTab />}
      </div>
    </div>
  );
};

/* ─── Overview tab ─────────────────────────────────────── */
const OverviewTab = ({ app, onGoToVersions, onGoToRuns }) => {
  const isDraftOnly  = app.lifecycle === "draft-only";

  return (
  <div className="db-fade">
    <div className="dx-card" style={{marginBottom: 16}}>
      <div className="dx-card-head">
        <h3><KbIcon name="bar-chart" size={16} /> Activity snapshot</h3>
        <span className="badge">Last 24 hours</span>
      </div>
      <div className="dx-stat-row">
        <div className="dx-stat">
          <span className="l">Runs today</span>
          <span className="v">{app.runsToday}</span>
          <span className="d up">↑ 12 vs prev day</span>
        </div>
        <div className="dx-stat">
          <span className="l">Avg runtime</span>
          <span className="v">1m 42s</span>
          <span className="d up">↓ 4s · -3.7%</span>
        </div>
        <div className="dx-stat">
          <span className="l">Last deployment</span>
          <span className="v" style={{fontSize: 16, lineHeight: "22px", fontWeight: 600}}>{app.publishedAt}</span>
          <span className="d" style={{color: "var(--foreground-muted)"}}>Sarah Hájková</span>
        </div>
        <div className="dx-stat">
          <span className="l">Active users (7d)</span>
          <span className="v">{app.users}</span>
          <span className="d up">↑ 6 new this week</span>
        </div>
      </div>
    </div>

    <PublicUrlCard app={app} isDraftOnly={isDraftOnly} />

    <DeploymentCard
      app={app}
      isDraftOnly={isDraftOnly}
      onGoToVersions={onGoToVersions}
      onGoToRuns={onGoToRuns}
    />

    <RepositoryCard app={app} />

    {/* Runtime & infrastructure */}
    <RuntimeInfo app={app} />

    <AccessAuthenticationCard app={app} />

    {/* Theme + Secrets — collapsible operational settings */}
    <CollapsibleSection
      icon="sparkles"
      title="Theme"
      sub="Color palette used by the app's preview surfaces"
      summary="Keboola"
      defaultOpen={false}
    >
      <ThemePicker />
    </CollapsibleSection>

    <CollapsibleSection
      icon="key"
      title="Secrets"
      sub="API keys, credentials and environment variables available at runtime"
      summary="3 secrets"
      defaultOpen={false}
    >
      <SecretsManager />
    </CollapsibleSection>

  </div>
  );
};

const PublicUrlCard = ({ app, isDraftOnly }) => {
  const initialSlug = React.useMemo(() => {
    const parts = (app.url || "").split("/");
    return parts[parts.length - 1] || app.id;
  }, [app.url, app.id]);

  const [slug, setSlug] = React.useState(initialSlug);
  const [savedSlug, setSavedSlug] = React.useState(initialSlug);
  const [checking, setChecking] = React.useState(false);
  const [availability, setAvailability] = React.useState("idle");

  React.useEffect(() => {
    setSlug(initialSlug);
    setSavedSlug(initialSlug);
    setAvailability("idle");
    setChecking(false);
  }, [app.id, initialSlug]);

  const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 48;
  const fullUrl = `keboola.app/apps/${slug || ""}`;
  const isDirty = slug !== savedSlug;

  const checkAvailability = () => {
    if (!isValid) return;
    setChecking(true);
    setAvailability("checking");
    setTimeout(() => {
      const reserved = ["admin", "api", "billing", "apps", "settings", "help"];
      if (reserved.includes(slug) || slug.endsWith("-internal")) {
        setAvailability("taken");
      } else {
        setAvailability("available");
      }
      setChecking(false);
    }, 450);
  };

  const save = () => {
    if (!isValid || availability === "taken") return;
    setSavedSlug(slug);
  };

  const reset = () => {
    setSlug(savedSlug);
    setAvailability("idle");
    setChecking(false);
  };

  const helperTone = !isValid
    ? "var(--color-keboola-danger-700)"
    : availability === "taken"
      ? "var(--color-keboola-danger-700)"
      : availability === "available"
        ? "var(--color-keboola-success-700)"
        : "var(--foreground-muted)";

  return (
    <div className="dx-card" style={{marginBottom: 16}}>
      <div className="dx-card-head">
        <h3><KbIcon name="link" size={16} /> Public access and URL</h3>
        <span className="badge">App-level setting</span>
      </div>

      <div style={{display: "grid", gap: 12}}>
        <div className="dx-meta-row" style={{paddingTop: 4}}>
          <span className="k"><KbIcon name="at-sign" size={14} /> URL slug</span>
          <span className="v" style={{display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end"}}>
            <input
              value={slug}
              onChange={(e) => {
                setSlug((e.target.value || "").toLowerCase().replace(/[^a-z0-9-]/g, ""));
                setAvailability("idle");
              }}
              aria-label="App URL slug"
              style={{
                height: 32,
                minWidth: 260,
                border: `1px solid ${isValid ? "var(--border)" : "var(--color-keboola-danger-300)"}`,
                borderRadius: 8,
                padding: "0 10px",
                font: "500 12.5px var(--font-mono)",
                color: "var(--foreground)",
                background: "var(--surface)",
              }}
            />
            <button className="db-secondary-btn" style={{height: 32, padding: "0 10px"}} onClick={checkAvailability} disabled={!isValid || checking}>
              {checking ? "Checking..." : "Check availability"}
            </button>
          </span>
        </div>

        <div className="dx-meta-row" style={{paddingTop: 0}}>
          <span className="k"><KbIcon name="globe" size={14} /> Live preview</span>
          <span className="v mono">{fullUrl}</span>
        </div>

        <p style={{margin: "-2px 0 0", font: "400 12.5px/18px var(--font-sans)", color: helperTone}}>
          {!isValid && "Use 3-48 lowercase letters, numbers, and dashes. No leading or trailing dash."}
          {isValid && availability === "idle" && "This URL is reserved for this app. Check availability before saving changes."}
          {availability === "checking" && "Checking URL availability..."}
          {availability === "available" && "This slug is available."}
          {availability === "taken" && "This slug is unavailable. Try another value."}
        </p>

        {isDraftOnly && (
          <div className="dx-callout draft-only" style={{marginTop: 2}}>
            <KbIcon name="info" size={14} />
            <div>
              <strong>This URL will become active after the first deployment.</strong> You can configure it now.
            </div>
          </div>
        )}

        <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
          <button className="db-secondary-btn" style={{height: 32, padding: "0 12px"}} onClick={reset} disabled={!isDirty}>Reset</button>
          <button className="db-secondary-btn" style={{height: 32, padding: "0 12px"}} onClick={save} disabled={!isDirty || !isValid || availability === "taken"}>Save URL</button>
        </div>
      </div>
    </div>
  );
};

const DeploymentCard = ({ app, isDraftOnly, onGoToVersions, onGoToRuns }) => {
  const deployedVersion = "v1.4.2";
  const healthLabel = app.status === "failed" ? "Issues detected" : app.status === "stopped" ? "Paused" : "Live";
  const healthTone = app.status === "failed" ? "failed" : app.status === "stopped" ? "warn" : "success";

  return (
    <div className="dx-card" style={{marginBottom: 16}}>
      <div className="dx-card-head">
        <h3><KbIcon name="rocket" size={16} /> Deployment</h3>
        <span className="badge">{isDraftOnly ? "Ready to deploy" : deployedVersion}</span>
      </div>

      {isDraftOnly ? (
        <div className="dx-callout draft-only">
          <KbIcon name="sparkles" size={14} />
          <div>
            <strong>No production deployment yet.</strong> Your app is deployment-ready and only visible in draft mode.
            Publish the first version from the Draft tab to make it publicly available.
          </div>
        </div>
      ) : (
        <div className="dx-meta-list">
          <div className="dx-meta-row">
            <span className="k"><KbIcon name="history" size={14} /> Deployed version</span>
            <span className="v mono">{deployedVersion}</span>
          </div>
          <div className="dx-meta-row">
            <span className="k"><KbIcon name="circle-check" size={14} /> Deployment state</span>
            <span className="v">
              <span className={`dx-run-pill ${healthTone}`}>
                <span className="dot"></span>
                {healthLabel}
              </span>
            </span>
          </div>
          <div className="dx-meta-row">
            <span className="k"><KbIcon name="globe" size={14} /> Production availability</span>
            <span className="v">Publicly reachable</span>
          </div>
          <div className="dx-meta-row">
            <span className="k"><KbIcon name="list" size={14} /> Deployment history</span>
            <span className="v" style={{display: "flex", gap: 8}}>
              <button className="db-secondary-btn" style={{height: 30, padding: "0 10px"}} onClick={onGoToVersions}>Open versions</button>
              <button className="db-secondary-btn" style={{height: 30, padding: "0 10px"}} onClick={onGoToRuns}>Open runs</button>
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

const RepositoryCard = ({ app }) => (
  <div className="dx-card" style={{marginBottom: 16}}>
    <div className="dx-card-head">
      <h3><KbIcon name="git-branch" size={16} /> Repository and source</h3>
      {app.repo === "managed" ? (
        <span className="dx-badge managed"><KbIcon name="lock" size={10} /> Managed</span>
      ) : (
        <span className="dx-badge muted"><KbIcon name="github" size={10} /> External</span>
      )}
    </div>
    <div className="dx-meta-list">
      <div className="dx-meta-row">
        <span className="k"><KbIcon name="folder" size={14} /> Source</span>
        <span className="v mono">{app.repo === "managed" ? `git://kbc/${app.id}` : `github.com/argo22/${app.id}`}</span>
      </div>
      <div className="dx-meta-row">
        <span className="k"><KbIcon name="git-commit" size={14} /> Default branch</span>
        <span className="v mono">main</span>
      </div>
      <div className="dx-meta-row">
        <span className="k"><KbIcon name="users" size={14} /> Visibility</span>
        <span className="v">Organisation - Argo22</span>
      </div>
    </div>
    {app.repo === "managed" && (
      <div className="dx-callout" style={{marginTop: 12}}>
        <KbIcon name="lock" size={14} />
        <div>
          <strong>Repository source cannot be changed.</strong> Keboola manages this repository.
          To use your own source control, duplicate the app and connect a custom repository at creation.
        </div>
      </div>
    )}
  </div>
);

const AccessAuthenticationCard = ({ app }) => {
  const defaultState = React.useMemo(() => ({
    type: app.repo === "managed" ? "oidc" : "github",
    password: "",
    oidcProvider: "https://login.example.com",
    oidcClientId: "",
    oidcClientSecret: "",
    oidcScopes: "openid profile email",
    oidcClaimMapping: "email -> user_email",
    oidcAllowedDomains: "",
    gitProvider: app.repo === "managed" ? "GitHub" : "GitLab",
    gitAppId: "",
    gitOrgRestriction: "argo22",
    gitRoleMapping: "maintainer -> admin, developer -> editor",
  }), [app.repo]);

  const [editing, setEditing] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(defaultState);
  const [saved, setSaved] = React.useState(defaultState);

  React.useEffect(() => {
    setEditing(false);
    setAdvancedOpen(false);
    setDraft(defaultState);
    setSaved(defaultState);
  }, [app.id, defaultState]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const modeLabel = (state) => {
    if (state.type === "public") return "Public";
    if (state.type === "password") return "Password";
    if (state.type === "oidc") return "OIDC / SSO";
    return state.gitProvider;
  };

  const accessModeLabel = (state) => {
    if (state.type === "public") return "Public access";
    if (state.type === "password") return "Password protected";
    if (state.type === "oidc") return "OIDC / SSO";
    return `${state.gitProvider} access control`;
  };

  const audienceLabel = (state) => state.type === "public" ? "Anyone with link" : "Authenticated users only";
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <CollapsibleSection
      icon="lock"
      title="Access and authentication"
      sub="Authentication, audience and access control"
      summary={modeLabel(saved)}
      defaultOpen={false}
    >
      {!editing ? (
        <>
          <div className="dx-meta-list">
            <div className="dx-meta-row">
              <span className="k"><KbIcon name="lock" size={14} /> Access mode</span>
              <span className="v">{accessModeLabel(saved)}</span>
            </div>
            <div className="dx-meta-row">
              <span className="k"><KbIcon name="users" size={14} /> Audience</span>
              <span className="v">{audienceLabel(saved)}</span>
            </div>
            {saved.type === "oidc" && (
              <>
                <div className="dx-meta-row">
                  <span className="k"><KbIcon name="link" size={14} /> Provider</span>
                  <span className="v mono">{saved.oidcProvider}</span>
                </div>
                <div className="dx-meta-row">
                  <span className="k"><KbIcon name="list" size={14} /> Scopes</span>
                  <span className="v mono">{saved.oidcScopes}</span>
                </div>
              </>
            )}
            {saved.type === "github" && (
              <>
                <div className="dx-meta-row">
                  <span className="k"><KbIcon name="github" size={14} /> Provider</span>
                  <span className="v">{saved.gitProvider}</span>
                </div>
                <div className="dx-meta-row">
                  <span className="k"><KbIcon name="users" size={14} /> Restriction</span>
                  <span className="v mono">{saved.gitOrgRestriction || "No restriction"}</span>
                </div>
              </>
            )}
            {saved.type === "password" && (
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="key" size={14} /> Password</span>
                <span className="v">Configured</span>
              </div>
            )}
          </div>
          <div style={{display: "flex", justifyContent: "flex-end", marginTop: 12}}>
            <button className="db-secondary-btn" style={{height: 32, padding: "0 12px"}} onClick={() => setEditing(true)}>
              <KbIcon name="pencil" size={12} />
              Edit access configuration
            </button>
          </div>
        </>
      ) : (
        <div style={{display: "grid", gap: 12}}>
          <div className="dx-meta-row" style={{paddingTop: 4}}>
            <span className="k"><KbIcon name="lock" size={14} /> Auth type</span>
            <span className="v">
              <select
                value={draft.type}
                onChange={(e) => update("type", e.target.value)}
                style={{
                  height: 32,
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0 8px",
                  font: "500 12.5px var(--font-sans)",
                  color: "var(--foreground)",
                  background: "var(--surface)",
                }}
              >
                <option value="public">Public access</option>
                <option value="password">Password</option>
                <option value="oidc">OIDC</option>
                <option value="github">GitHub / GitLab</option>
              </select>
            </span>
          </div>

          {draft.type === "password" && (
            <div className="dx-meta-row">
              <span className="k"><KbIcon name="key" size={14} /> Access password</span>
              <span className="v">
                <input
                  type="password"
                  value={draft.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Enter app password"
                  style={{
                    height: 32,
                    minWidth: 260,
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "0 10px",
                    font: "500 12.5px var(--font-sans)",
                    color: "var(--foreground)",
                    background: "var(--surface)",
                  }}
                />
              </span>
            </div>
          )}

          {draft.type === "oidc" && (
            <>
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="link" size={14} /> Provider URL</span>
                <span className="v"><input value={draft.oidcProvider} onChange={(e) => update("oidcProvider", e.target.value)} style={{height: 32, minWidth: 300, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12.5px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
              </div>
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="id-card" size={14} /> Client ID</span>
                <span className="v"><input value={draft.oidcClientId} onChange={(e) => update("oidcClientId", e.target.value)} placeholder="client-id" style={{height: 32, minWidth: 240, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12.5px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
              </div>
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="key" size={14} /> Client secret</span>
                <span className="v"><input type="password" value={draft.oidcClientSecret} onChange={(e) => update("oidcClientSecret", e.target.value)} placeholder="client-secret" style={{height: 32, minWidth: 240, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12.5px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
              </div>
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="list" size={14} /> Scopes</span>
                <span className="v"><input value={draft.oidcScopes} onChange={(e) => update("oidcScopes", e.target.value)} style={{height: 32, minWidth: 300, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12.5px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
              </div>
            </>
          )}

          {draft.type === "github" && (
            <>
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="github" size={14} /> Provider</span>
                <span className="v">
                  <select
                    value={draft.gitProvider}
                    onChange={(e) => update("gitProvider", e.target.value)}
                    style={{height: 32, border: "1px solid var(--border)", borderRadius: 8, padding: "0 8px", font: "500 12.5px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}}
                  >
                    <option value="GitHub">GitHub</option>
                    <option value="GitLab">GitLab</option>
                  </select>
                </span>
              </div>
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="id-card" size={14} /> App ID</span>
                <span className="v"><input value={draft.gitAppId} onChange={(e) => update("gitAppId", e.target.value)} placeholder="Application ID" style={{height: 32, minWidth: 240, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12.5px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
              </div>
              <div className="dx-meta-row">
                <span className="k"><KbIcon name="users" size={14} /> Org or project restriction</span>
                <span className="v"><input value={draft.gitOrgRestriction} onChange={(e) => update("gitOrgRestriction", e.target.value)} placeholder="argo22 / marketing-team" style={{height: 32, minWidth: 260, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12.5px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
              </div>
            </>
          )}

          {(draft.type === "oidc" || draft.type === "github") && (
            <div style={{border: "1px solid var(--border)", borderRadius: 8, padding: 10, marginTop: -2}}>
              <button className="db-secondary-btn" style={{height: 28, padding: "0 10px"}} onClick={() => setAdvancedOpen((v) => !v)}>
                <KbIcon name="chevron-right" size={12} />
                {advancedOpen ? "Hide advanced" : "Show advanced"}
              </button>
              {advancedOpen && (
                <div style={{display: "grid", gap: 10, marginTop: 10}}>
                  {draft.type === "oidc" && (
                    <>
                      <div className="dx-meta-row" style={{padding: "6px 0"}}>
                        <span className="k"><KbIcon name="workflow" size={14} /> Claim mapping</span>
                        <span className="v"><input value={draft.oidcClaimMapping} onChange={(e) => update("oidcClaimMapping", e.target.value)} style={{height: 30, minWidth: 280, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
                      </div>
                      <div className="dx-meta-row" style={{padding: "6px 0"}}>
                        <span className="k"><KbIcon name="mail" size={14} /> Allowed email domains</span>
                        <span className="v"><input value={draft.oidcAllowedDomains} onChange={(e) => update("oidcAllowedDomains", e.target.value)} placeholder="example.com, argo22.io" style={{height: 30, minWidth: 280, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
                      </div>
                    </>
                  )}
                  {draft.type === "github" && (
                    <div className="dx-meta-row" style={{padding: "6px 0"}}>
                      <span className="k"><KbIcon name="shield" size={14} /> Role mapping</span>
                      <span className="v"><input value={draft.gitRoleMapping} onChange={(e) => update("gitRoleMapping", e.target.value)} style={{height: 30, minWidth: 320, border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", font: "500 12px var(--font-sans)", color: "var(--foreground)", background: "var(--surface)"}} /></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
            <button
              className="db-secondary-btn"
              style={{height: 32, padding: "0 12px"}}
              onClick={() => {
                setDraft(saved);
                setEditing(false);
                setAdvancedOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              className="db-secondary-btn"
              style={{height: 32, padding: "0 12px"}}
              onClick={() => setDraft(saved)}
              disabled={!isDirty}
            >
              Reset
            </button>
            <button
              className="dx-primary-btn"
              style={{height: 32, padding: "0 12px"}}
              onClick={() => {
                setSaved(draft);
                setEditing(false);
                setAdvancedOpen(false);
              }}
              disabled={!isDirty}
            >
              Save access settings
            </button>
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
};

/* ─── Draft tab — sub-states ─────────────────────────── */

const DraftTabEmpty = ({ app, onContinueEditing, editLabel = "Continue Editing" }) => (
  <div className="db-fade">
    <div className="dx-card" style={{
      padding: 32,
      textAlign: "center",
      alignItems: "center",
      gap: 14,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: "linear-gradient(135deg, var(--color-keboola-50) 0%, #f3eaff 100%)",
        border: "1px solid var(--border)",
        color: "var(--color-keboola-700)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto",
      }}>
        <KbIcon name="file-code" size={22} />
      </div>
      <div>
        <h3 style={{margin: 0, font: "700 18px var(--font-sans)", color: "var(--foreground)", letterSpacing: "-0.01em"}}>
          No active draft
        </h3>
        <p style={{margin: "6px auto 0", font: "400 13.5px/20px var(--font-sans)", color: "var(--foreground-muted)", maxWidth: 480}}>
          This app is currently in sync with production. Start editing to create a
          personal draft visible only to you.
        </p>
      </div>
      <div style={{display: "flex", gap: 10, justifyContent: "center", marginTop: 4}}>
        <button className="dx-primary-btn" onClick={onContinueEditing}>
          <KbIcon name="pencil" size={14} />
          {editLabel}
        </button>
        <button className="db-secondary-btn" style={{height: 38, padding: "0 16px"}}>
          <KbIcon name="eye" size={14} />
          View Production
        </button>
      </div>
    </div>
  </div>
);

const DraftTabDraftOnly = ({ app, onContinueEditing, onPublish }) => (
  <div className="db-fade">
    <div className="dx-draft-card state-draft-only">
      <div className="dx-draft-meta">
        <div className="dx-draft-meta-item">
          <span className="l">Updated</span>
          <span className="v"><KbIcon name="history" size={12} /> {app.draftAge}</span>
        </div>
        <div className="dx-draft-meta-item">
          <span className="l">Based on</span>
          <span className="v" style={{color: "var(--foreground-muted)"}}>
            <KbIcon name="circle-dot" size={12} /> Initial draft baseline
          </span>
        </div>
        <div className="dx-draft-meta-item">
          <span className="l">Your changes</span>
          <span className="v">3 edits · not yet published</span>
        </div>
        <div className="dx-draft-meta-item">
          <span className="l">Production status</span>
          <span className="v" style={{color: "var(--color-kai-700)"}}>
            <KbIcon name="circle-dot" size={12} /> Awaiting first release
          </span>
        </div>
      </div>

      <div className="dx-draft-statusbar draft-only">
        <div className="body">
          <strong>This app has not been deployed yet</strong>
          <span className="meta">Publish your first version to create the initial production release.</span>
        </div>
        <div className="actions">
          <button className="action primary" onClick={onPublish}>
            <KbIcon name="rocket" size={12} />
            Publish first version
          </button>
          <button className="action ghost" onClick={onContinueEditing}>
            <KbIcon name="pencil" size={12} />
            Continue editing
          </button>
        </div>
      </div>

      <div className="dx-draft-card-actions">
        <button className="ghost danger" style={{marginLeft: "auto"}}>
          <KbIcon name="trash" size={14} />
          Discard draft
        </button>
      </div>
    </div>

    <div className="dx-card">
      <div className="dx-card-head">
        <h3><KbIcon name="history" size={16} /> Your recent edits</h3>
        <span className="badge">3 edits · only visible to you</span>
      </div>
      <ul className="dx-timeline">
        {[
          { line: "You scaffolded the pricing scenario surface",     meta: "f3a2d10", time: "just now",    with: "Kai" },
          { line: "You attached out.c-erp.sku_transactions",         meta: "2bd4012", time: "2 min ago",   with: "Kai" },
          { line: "You drafted the dashboard from the prompt",       meta: "00000c1", time: "5 min ago",   with: null },
        ].map((d, i) => (
          <li key={i} className="dx-tl-item">
            <div className={`dx-tl-dot ${d.with === "Kai" ? "kai" : "user"}`}>
              <KbIcon name={d.with === "Kai" ? "sparkles" : "user"} size={12} />
            </div>
            <div className="dx-tl-body">
              <span className="dx-tl-line">
                {d.line}
                {d.with && <span style={{color: "var(--foreground-muted)", fontWeight: 400}}> · with Kai</span>}
              </span>
              <span className="dx-tl-meta">
                <span className="sha">{d.meta}</span>
                <span>·</span>
                <span>{d.time}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ─── Draft tab — PERSONAL drafts (per-user) ──────────── */
// Branches on lifecycle (production-only | draft-only | has-draft).
// When has-draft, draftState refines: 'up-to-date' | 'behind' | 'conflict'.
const DraftTab = ({ app, draftState = "behind", onContinueEditing, onPublish, onResolveWithKai, onUpdateBase, onReviewChanges, editLabel = "Continue Editing" }) => {
  const isDraftOnly  = app.lifecycle === "draft-only";
  const isProdOnly   = app.lifecycle === "production-only";
  const hasDraft     = app.lifecycle === "has-draft";

  // ── No active draft (stable production) ──
  if (isProdOnly) {
    return <DraftTabEmpty app={app} onContinueEditing={onContinueEditing} editLabel={editLabel} />;
  }

  // ── Draft-only (never deployed) ──
  if (isDraftOnly) {
    return <DraftTabDraftOnly app={app} onContinueEditing={onContinueEditing} onPublish={onPublish} />;
  }

  // ── Has draft — unified production-updates surface ──
  const isBehind = draftState === "behind";
  const isConflict = draftState === "conflict";
  const isCurrent = draftState === "up-to-date";

  // In the new model "conflict" is a subtype of "behind". Both share the same
  // unified surface: a single Production updates list where some items are
  // safe-to-apply and some require review.
  const hasIncoming = isBehind || isConflict;
  const initialIncoming = React.useMemo(
    () => PRODUCTION_INCOMING.map((c, idx) => ({ ...c, _id: `incoming-${idx}-${c.area}` })),
    []
  );
  const [incomingItems, setIncomingItems] = React.useState(initialIncoming);
  const [safeApplyState, setSafeApplyState] = React.useState({});

  React.useEffect(() => {
    setIncomingItems((isBehind || isConflict) ? initialIncoming : []);
    setSafeApplyState({});
  }, [isBehind, isConflict, initialIncoming, app.id]);

  const incoming    = isCurrent ? [] : incomingItems;
  const overlapping = incoming.filter((c) => c.overlap);
  const reviewCount = overlapping.length;
  const safeCount   = incoming.length - reviewCount;

  const applySafeUpdateInline = (itemId) => {
    if (safeApplyState[itemId]) return;
    setSafeApplyState((prev) => ({ ...prev, [itemId]: "applying" }));

    setTimeout(() => {
      setSafeApplyState((prev) => ({ ...prev, [itemId]: "applied" }));
    }, 700);

    setTimeout(() => {
      setSafeApplyState((prev) => ({ ...prev, [itemId]: "exiting" }));
    }, 1200);

    setTimeout(() => {
      setIncomingItems((prev) => prev.filter((x) => x._id !== itemId));
      setSafeApplyState((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }, 1520);
  };

  return (
    <div className="db-fade">
      <div className={`dx-draft-card ${isConflict ? "state-conflict" : hasIncoming ? "state-behind" : "state-synced"}`}>
        <div className="dx-draft-meta">
          <div className="dx-draft-meta-item">
            <span className="l">Updated</span>
            <span className="v"><KbIcon name="history" size={12} /> {app.draftAge} ago</span>
          </div>
          <div className="dx-draft-meta-item">
            <span className="l">Based on</span>
            <span className="v mono"><KbIcon name="git-commit" size={12} /> Production v1.4.2</span>
          </div>
          <div className="dx-draft-meta-item">
            <span className="l">Your changes</span>
            <span className="v">6 edits · 0 yet published</span>
          </div>
          <div className="dx-draft-meta-item">
            <span className="l">Production status</span>
            {isCurrent && <span className="v success"><KbIcon name="check" size={12} /> No updates</span>}
            {hasIncoming && (
              <span className="v warn">
                <KbIcon name="arrow-down" size={12} /> {incoming.length} updates available
              </span>
            )}
          </div>
        </div>

        <div className={`dx-draft-statusbar ${isConflict ? "conflict" : hasIncoming ? "behind" : "up-to-date"}`}>
          <div className="body">
            <strong>
              {hasIncoming
                ? "Production changed after your draft was created"
                : "Your draft is up to date with production"}
            </strong>
            <span className="meta">
              {hasIncoming
                ? `${incoming.length} production updates available${reviewCount > 0 ? ` · ${reviewCount} require review before merge` : " · all can be safely applied"}`
                : `${app.draftAge} ago · 6 unpublished changes in your personal draft · production unchanged`}
            </span>
          </div>
          <div className="actions">
            <button className="action ghost" onClick={onContinueEditing}>
              <KbIcon name="pencil" size={12} />
              Continue editing
            </button>
            {hasIncoming ? (
              <>
                <button className="action primary" onClick={onReviewChanges}>
                  Review updates
                </button>
              </>
            ) : (
              <button className="action primary" onClick={onPublish}>
                <KbIcon name="rocket" size={12} />
                Publish to production
              </button>
            )}
          </div>
        </div>

        {hasIncoming && (
          <div className="dx-draft-updates-nest">
            <ProductionUpdates
              items={incoming}
              safeCount={safeCount}
              reviewCount={reviewCount}
              onResolveWithKai={onResolveWithKai}
              onApplySafeUpdate={applySafeUpdateInline}
              safeApplyState={safeApplyState}
              embedded
            />
          </div>
        )}

        <div className="dx-draft-card-actions">
          <button className="ghost danger" style={{marginLeft: "auto"}}>
            <KbIcon name="trash" size={14} />
            Discard draft
          </button>
        </div>
      </div>

      {/* Your recent edits */}
      <div className="dx-card">
        <div className="dx-card-head">
          <h3><KbIcon name="history" size={16} /> Your recent edits</h3>
          <span className="badge">{DRAFT_ACTIVITY.length} edits · only visible to you</span>
        </div>
        <ul className="dx-timeline">
          {DRAFT_ACTIVITY.map((d, i) => (
            <li key={i} className="dx-tl-item">
              <div className={`dx-tl-dot ${d.with === "Kai" ? "kai" : "user"}`}>
                <KbIcon name={d.with === "Kai" ? "sparkles" : "user"} size={12} />
              </div>
              <div className="dx-tl-body">
                <span className="dx-tl-line">
                  {d.line}
                  {d.with && <span style={{color: "var(--foreground-muted)", fontWeight: 400}}> · with Kai</span>}
                </span>
                <span className="dx-tl-meta">
                  <span className="sha">{d.meta}</span>
                  <span>·</span>
                  <span>{d.time}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ─── Production updates — unified replacement for the old conflict mega card ─ */
const ProductionUpdates = ({ items, safeCount, reviewCount, onResolveWithKai, onApplySafeUpdate, safeApplyState = {}, embedded = false }) => {
  const safe   = items.filter((c) => !c.overlap);
  const review = items.filter((c) =>  c.overlap);
  const overlapToConflict = (item) => CONFLICT_AREAS.find((c) => item.area && c.title.toLowerCase().includes(item.area.toLowerCase().split(" ")[0])) ||
    CONFLICT_AREAS[0];

  return (
    <div className={`dx-updates ${embedded ? "embedded" : ""}`}>
      <div className="dx-updates-head">
        <h3>
          Production updates
        </h3>
        <span className="count">{items.length} total</span>
        {reviewCount > 0 && (
          <span className="count review">{reviewCount} require review</span>
        )}
      </div>

      {/* Safe to apply */}
      {safe.length > 0 && (
        <div className="dx-updates-group">
          <div className="dx-updates-group-label safe">
            <span className="sw"></span>
            Safe to apply
            <span className="num">· {safe.length}</span>
          </div>
          {safe.map((c, i) => (
            <div key={c._id || i} className={`dx-update-item ${safeApplyState[c._id] ? `is-${safeApplyState[c._id]}` : ""}`}>
              <div className="body">
                {c.line}
                <span className="meta">
                  <span className="area">{c.area}</span>
                  {c.who} · {c.time}
                </span>
              </div>
              <div className="right">
                <button
                  className={`dx-update-action ${safeApplyState[c._id] ? "disabled" : ""}`}
                  onClick={() => onApplySafeUpdate?.(c._id)}
                  disabled={!!safeApplyState[c._id]}
                >
                  {safeApplyState[c._id] === "applying" && "Applying..."}
                  {safeApplyState[c._id] === "applied" && "Applied"}
                  {safeApplyState[c._id] === "exiting" && "Applied"}
                  {!safeApplyState[c._id] && "Apply update"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requires review */}
      {review.length > 0 && (
        <div className="dx-updates-group">
          <div className="dx-updates-group-label review">
            <span className="sw"></span>
            Requires review
            <span className="num">· {review.length}</span>
          </div>
          {review.map((c, i) => (
            <ReviewItem
              key={i}
              item={c}
              conflict={overlapToConflict(c)}
              onApply={onResolveWithKai}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReviewItem = ({ item, conflict, onApply }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="dx-update-item">
      <div className="body">
        {item.line}
        <span className="meta">
          <span className="area review">{item.area}</span>
          {item.who} · {item.time}
        </span>
      </div>
      <div className="right">
        <button
          className={`dx-update-expand ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse" : "Expand"}
        >
          <KbIcon name="chevron-right" size={14} />
        </button>
      </div>

      {open && (
        <div className="dx-update-expanded">
          <div className="dx-update-compare">
            <div className="dx-update-side yours">
              <div className="label"><KbIcon name="user" size={10} /> Your draft</div>
              <div className="text">{conflict.yours}</div>
            </div>
            <div className="dx-update-side theirs">
              <div className="label"><KbIcon name="rocket" size={10} /> Production</div>
              <div className="text">{conflict.theirs}</div>
            </div>
          </div>
          <div className="dx-update-kai">
            <KbIcon name="sparkles" size={12} />
            <div style={{flex: 1, minWidth: 0}}>
              <strong>Kai suggests:</strong> {conflict.suggestion}
            </div>
            <button className="apply" onClick={onApply}>
              <KbIcon name="check" size={11} />
              Apply with Kai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Versions tab — release timeline / accordion ──────── */
const VersionsTab = ({ app, onRestoreVersion, onPreviewVersion, onContinueEditing, editLabel = "Continue Editing" }) => {
  const isDraftOnly = app.lifecycle === "draft-only";
  // Production version is open by default — most relevant context first
  const initialOpen = (VERSIONS.find((v) => v.isProduction) || VERSIONS[0])?.v;
  const [openId, setOpenId] = React.useState(initialOpen);

  if (isDraftOnly) {
    return (
      <div className="db-fade">
        <div className="dx-card" style={{
          padding: 32,
          textAlign: "center",
          alignItems: "center",
          gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, var(--color-keboola-50) 0%, #f3eaff 100%)",
            border: "1px solid var(--border)",
            color: "var(--color-keboola-700)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto",
          }}>
            <KbIcon name="history" size={22} />
          </div>
          <div>
            <h3 style={{margin: 0, font: "700 18px var(--font-sans)", letterSpacing: "-0.01em"}}>No versions yet</h3>
            <p style={{margin: "6px auto 0", font: "400 13.5px/20px var(--font-sans)", color: "var(--foreground-muted)", maxWidth: 480}}>
              This app has not been published. Once you publish your first version,
              every release will appear here as a restorable snapshot.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dx-versions-tab db-fade">
      <div className="dx-versions-tab-head">
        <div>
          <h3>Released versions</h3>
          <div className="sub">{VERSIONS.length} releases · click any version to expand or preview in Builder</div>
        </div>
        <div className="legend">
          <span><span className="sw added"></span>Added</span>
          <span><span className="sw changed"></span>Changed</span>
          <span><span className="sw removed"></span>Removed</span>
        </div>
      </div>

      <div className="dx-release-list">
        {VERSIONS.map((v) => (
          <ReleaseItem
            key={v.v}
            v={v}
            open={openId === v.v}
            onToggle={() => setOpenId(openId === v.v ? null : v.v)}
            onPreview={() => onPreviewVersion?.(v)}
            onRestore={() => onRestoreVersion?.(v)}
            onContinueEditing={onContinueEditing}
            continueEditingLabel={editLabel}
          />
        ))}
      </div>
    </div>
  );
};

const ReleaseItem = ({ v, open, onToggle, onPreview, onRestore, onContinueEditing, continueEditingLabel = "Continue Editing" }) => {
  const grouped = {
    added:   v.summary.filter((s) => s.kind === "added"),
    changed: v.summary.filter((s) => s.kind === "changed"),
    removed: v.summary.filter((s) => s.kind === "removed"),
  };

  return (
    <div className={`dx-release ${open ? "open" : ""}`}>
      <button className="dx-release-head" onClick={onToggle}>
        <div className="dx-release-vcol">
          <span className="v">
            {v.v}
            <span className="num">#{v.n}</span>
          </span>
          {v.isProduction && (
            <span className="prod-badge">
              <span className="dot"></span>
              Production
            </span>
          )}
        </div>

        <div className="dx-release-body">
          <span className="title">{v.label}</span>
          <span className="meta">
            <KbIcon name="user" size={10} style={{verticalAlign: "middle"}} /> {v.author}
            <span className="sep">·</span>
            {v.when}
          </span>
        </div>

        <div className="dx-release-actions" onClick={(e) => e.stopPropagation()}>
          {v.isProduction ? (
            <>
              <button className="ghost" onClick={onPreview} title="Open Production in Builder">
                <KbIcon name="eye" size={12} />
                Preview
              </button>
              <button className="restore primary-soft" onClick={onContinueEditing || onRestore} title="Editing Production automatically creates a personal draft">
                <KbIcon name="pencil" size={12} />
                {continueEditingLabel}
              </button>
            </>
          ) : (
            <>
              <button className="ghost" onClick={onPreview} title="Open this version in Builder Explore Mode">
                <KbIcon name="eye" size={12} />
                Preview
              </button>
              <button className="restore secondary" onClick={onRestore} title="Create a new personal draft based on this version">
                <KbIcon name="history" size={12} />
                Restore as draft
              </button>
            </>
          )}
          <button className="chev" onClick={onToggle} aria-label={open ? "Collapse" : "Expand"}>
            <KbIcon name="chevron-right" size={14} />
          </button>
        </div>
      </button>

      {open && (
        <div className="dx-release-content">
          <div className="dx-release-notes-label">What is in this release</div>
          <div className="dx-release-changes">
            {grouped.added.length > 0 && (
              <div className="dx-release-group">
                <div className="dx-release-group-label added">
                  <span className="sw"></span> Added <span className="num">· {grouped.added.length}</span>
                </div>
                {grouped.added.map((it, i) => <ChangeRow key={`a${i}`} it={it} />)}
              </div>
            )}
            {grouped.changed.length > 0 && (
              <div className="dx-release-group">
                <div className="dx-release-group-label changed">
                  <span className="sw"></span> Changed <span className="num">· {grouped.changed.length}</span>
                </div>
                {grouped.changed.map((it, i) => <ChangeRow key={`c${i}`} it={it} />)}
              </div>
            )}
            {grouped.removed.length > 0 && (
              <div className="dx-release-group">
                <div className="dx-release-group-label removed">
                  <span className="sw"></span> Removed <span className="num">· {grouped.removed.length}</span>
                </div>
                {grouped.removed.map((it, i) => <ChangeRow key={`r${i}`} it={it} />)}
              </div>
            )}
          </div>

          {v.isProduction ? (
            <div className="dx-release-restore-note">
              <KbIcon name="info" size={12} />
              <span>
                This is the <strong>live production version</strong>.
                Editing it automatically creates your <strong>personal draft</strong> — production stays live until you publish.
              </span>
            </div>
          ) : (
            <div className="dx-release-restore-note">
              <KbIcon name="info" size={12} />
              <span>
                Restoring this version creates a <strong>new personal draft</strong>. Production stays untouched until you publish.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChangeRow = ({ it }) => (
  <div className={`dx-release-change-row ${it.kind}`}>
    <span className="ic">{it.kind === "added" ? "+" : it.kind === "removed" ? "−" : "↻"}</span>
    <span className="area">{it.area}</span>
    <span className="text">{it.text}</span>
  </div>
);

/* ─── Collapsible section + supporting subviews ─────────── */
const CollapsibleSection = ({ icon, title, sub, summary, defaultOpen = false, children }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`dx-collapse ${open ? "open" : ""}`}>
      <button className="dx-collapse-head" onClick={() => setOpen((v) => !v)}>
        <span className="ic"><KbIcon name={icon} size={14} /></span>
        <div className="title">
          <h3>{title}</h3>
          {sub && <span className="sub">{sub}</span>}
        </div>
        {summary && <span className="summary">{summary}</span>}
        <span className="chev"><KbIcon name="chevron-right" size={14} /></span>
      </button>
      {open && <div className="dx-collapse-body">{children}</div>}
    </div>
  );
};

const PALETTES = [
  { id: "keboola", name: "Keboola", colors: ["#005CB8", "#1F8FFF", "#7CBDFE", "#F1F5F9"] },
  { id: "graphite", name: "Graphite", colors: ["#1e293b", "#475569", "#94A3B8", "#F1F5F9"] },
  { id: "kai", name: "Kai", colors: ["#6d28d9", "#9747FF", "#c084fc", "#F1F5F9"] },
  { id: "forest", name: "Forest", colors: ["#047857", "#10B981", "#6EE7B7", "#F1F5F9"] },
];
const ThemePicker = () => {
  const [selected, setSelected] = React.useState("keboola");
  return (
    <div className="dx-theme-row">
      {PALETTES.map((p) => (
        <button
          key={p.id}
          className={`dx-theme-swatch ${selected === p.id ? "selected" : ""}`}
          onClick={() => setSelected(p.id)}
        >
          <span className="colors">
            {p.colors.map((c, i) => <span key={i} style={{background: c}}></span>)}
          </span>
          <span>{p.name}</span>
          <span className="check"><KbIcon name="check" size={10} /></span>
        </button>
      ))}
    </div>
  );
};

const SECRETS = [
  { name: "STRIPE_API_KEY",       kind: "secret",  updated: "2 days ago" },
  { name: "OPENAI_API_KEY",       kind: "secret",  updated: "1 wk ago" },
  { name: "service-account.json", kind: "file",    updated: "3 wk ago" },
];
const SecretsManager = () => (
  <>
    <p style={{margin: "0 0 4px", font: "400 12.5px/18px var(--font-sans)", color: "var(--foreground-muted)"}}>
      Secrets are encrypted at rest in your project Vault. Keboola injects them as environment
      variables when the app runs; they are never exposed to the browser.
    </p>
    <div className="dx-secrets-actions">
      <button className="db-secondary-btn" style={{height: 30, padding: "0 12px"}}>
        <KbIcon name="key" size={12} /> New secret
      </button>
      <button className="db-secondary-btn" style={{height: 30, padding: "0 12px"}}>
        <KbIcon name="file-code" size={12} /> Upload file
      </button>
    </div>
    <div className="dx-secrets-list">
      {SECRETS.map((s) => (
        <div key={s.name} className="dx-secret-row">
          <span className="ic">
            <KbIcon name={s.kind === "file" ? "file-code" : "key"} size={13} />
          </span>
          <div>
            <span className="name">{s.name}</span>
            <span className="meta">{s.kind === "file" ? "Uploaded file · injected as $KBC_SA_PATH" : "Environment variable · injected at runtime"}</span>
          </div>
          <span className="updated">Updated {s.updated}</span>
          <button className="more" aria-label="More">
            <KbIcon name="more-horizontal" size={14} />
          </button>
        </div>
      ))}
    </div>
  </>
);

const RuntimeInfo = ({ app }) => {
  const isDraftOnly = app.lifecycle === "draft-only";
  return (
    <div className="dx-card" style={{marginBottom: 16}}>
      <div className="dx-card-head">
        <h3><KbIcon name="settings" size={16} /> Runtime &amp; app info</h3>
        <span className="badge">Auto-sleep enabled</span>
      </div>
      <div className="dx-info-grid">
        <div className="dx-info-cell">
          <span className="l">Backend version</span>
          <span className="v mono">Python 3.11 · Streamlit 1.37</span>
        </div>
        <div className="dx-info-cell">
          <span className="l">Backend size</span>
          <span className="v"><KbIcon name="database" size={12} /> Medium · 2 vCPU · 4 GB</span>
        </div>
        <div className="dx-info-cell">
          <span className="l">Auto sleep</span>
          <span className="v"><KbIcon name="circle-dot" size={12} /> After 15 min idle</span>
        </div>
        <div className="dx-info-cell">
          <span className="l">Last change</span>
          <span className="v">{isDraftOnly ? "Never published" : `${app.publishedAt} · ${app.owner}`}</span>
        </div>
        <div className="dx-info-cell">
          <span className="l">Owner</span>
          <span className="v"><KbIcon name="user" size={12} /> {app.owner}</span>
        </div>
        <div className="dx-info-cell">
          <span className="l">App ID</span>
          <span className="v mono">
            kbc-app-{app.id.replace(/-/g, "")}-7f4c
            <button className="copy" aria-label="Copy"><KbIcon name="copy" size={11} /></button>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Runs tab ─────────────────────────────────────────── */
const RunsTab = () => {
  const [scope, setScope] = React.useState("All");
  const scopes = ["All", "Success", "Failed", "Running"];
  const filtered = RUNS.filter((r) => scope === "All" ||
    (scope === "Success" && r.status === "success") ||
    (scope === "Failed" && r.status === "failed") ||
    (scope === "Running" && r.status === "running"));

  return (
    <div className="db-fade">
      <div className="dx-table-wrap">
        <div className="dx-table-toolbar">
          <div className="dx-search">
            <KbIcon name="search" size={14} />
            <input placeholder="Search runs by ID, trigger or user…" />
          </div>
          <div style={{display: "flex", gap: 6, marginLeft: 8}}>
            {scopes.map((s) => (
              <button
                key={s}
                className={`dx-filter-chip ${scope === s ? "active" : ""}`}
                style={{height: 28, padding: "0 10px"}}
                onClick={() => setScope(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="kb-grow"></div>
          <button className="db-secondary-btn" style={{height: 30, padding: "0 12px"}}>
            <KbIcon name="play" size={12} />
            Run now
          </button>
        </div>
        <table className="dx-runs-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Trigger</th>
              <th>Duration</th>
              <th>Started</th>
              <th>Initiated by</th>
              <th>Run ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className={`dx-run-pill ${r.status}`}>
                    <span className="dot"></span>
                    {r.status === "running" ? "Running" : r.status === "success" ? "Success" : "Failed"}
                  </span>
                </td>
                <td>{r.trigger}</td>
                <td className="mono">{r.duration}</td>
                <td className="mono">{r.started}</td>
                <td>{r.by}</td>
                <td className="mono">{r.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Logs tab ─────────────────────────────────────────── */
const LogsTab = () => {
  const [stream, setStream] = React.useState("Deploy");
  return (
    <div className="db-fade">
      <div className="dx-terminal">
        <div className="dx-terminal-bar">
          <div className="lights"><span></span><span></span><span></span></div>
          <div className="name">customer-analytics · runtime logs · live</div>
          <div className="tabs">
            {["Deploy", "Runtime", "Kai", "All"].map((s) => (
              <button
                key={s}
                className={stream === s ? "active" : ""}
                onClick={() => setStream(s)}
              >{s}</button>
            ))}
          </div>
        </div>
        <div className="dx-terminal-body">
          {TERMINAL_LOGS.map((l, i) => (
            <div key={i} className={`dx-log ${l.lvl}`}>
              <span className="t">{l.t}</span>
              <span className="lv">{l.lv}</span>
              <span className="m" dangerouslySetInnerHTML={{__html: l.m.replace(/<code>/g, "<code>").replace(/`([^`]+)`/g, "<code>$1</code>")}}></span>
            </div>
          ))}
          <div className="dx-log info">
            <span className="t">{new Date().toISOString().replace("T", " ").slice(0, 19)}</span>
            <span className="lv">INFO</span>
            <span className="m">Waiting for next event<span className="cursor"></span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AppDetail });
