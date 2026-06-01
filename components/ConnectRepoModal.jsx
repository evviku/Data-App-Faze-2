// Connect Git repository — public/private + branch loading.
// Single modal, progressive disclosure. Reuses existing modal chrome.

const PUBLIC_REPOS = {
  // simulated branch lists per public repo
  "github.com/argo22/sales-pipeline-app":  ["main", "develop", "staging", "feature/customer-insights"],
  "github.com/argo22/inventory-app":       ["main", "release/2026-q2", "experimental"],
  "github.com/argo22/inbound-router":      ["main", "develop"],
};

const ConnectRepoModal = ({ onClose, onConnect }) => {
  const [url, setUrl] = React.useState("github.com/argo22/sales-pipeline-app");
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [authMethod, setAuthMethod] = React.useState("pat"); // 'pat' | 'ssh'
  const [username, setUsername] = React.useState("");
  const [token, setToken] = React.useState("");
  const [sshKeyName, setSshKeyName] = React.useState("");
  const [branch, setBranch] = React.useState("main");

  // 'idle' | 'validating' | 'authenticating' | 'loading-branches' | 'ready' | 'error'
  const [state, setState] = React.useState("idle");
  const [errorType, setErrorType] = React.useState(null);
  const [branches, setBranches] = React.useState([]);
  const [branchPickerOpen, setBranchPickerOpen] = React.useState(false);

  // ── simulated validation ──
  const validate = () => {
    setErrorType(null);
    setBranches([]);
    setBranchPickerOpen(false);

    // URL sanity check
    if (!url.trim() || !url.includes(".") || !url.includes("/")) {
      setState("error");
      setErrorType("invalid-url");
      return;
    }

    // Step 1 — validate the URL exists
    setState("validating");
    setTimeout(() => {
      // a special "trigger error" repo name to demo the error state
      if (url.toLowerCase().includes("missing-repo")) {
        setState("error");
        setErrorType("not-found");
        return;
      }

      if (isPrivate) {
        // Step 2 — authenticate
        setState("authenticating");
        setTimeout(() => {
          if (authMethod === "pat") {
            if (!username.trim() || !token.trim()) {
              setState("error");
              setErrorType("auth-missing");
              return;
            }
            if (token.toLowerCase().startsWith("bad")) {
              setState("error");
              setErrorType("auth-failed");
              return;
            }
          } else {
            if (!sshKeyName) {
              setState("error");
              setErrorType("auth-missing");
              return;
            }
          }
          // Step 3 — load branches
          loadBranches();
        }, 1100);
      } else {
        loadBranches();
      }
    }, 900);
  };

  const loadBranches = () => {
    setState("loading-branches");
    setTimeout(() => {
      const list = PUBLIC_REPOS[url] || ["main", "develop", "staging", "feature/customer-insights"];
      setBranches(list);
      setBranch(list[0]);
      setState("ready");
    }, 700);
  };

  // re-validate when toggling private/auth method (lightweight)
  React.useEffect(() => {
    if (state === "ready" || state === "error") {
      setState("idle");
      setBranches([]);
    }
    // eslint-disable-next-line
  }, [isPrivate, authMethod]);

  const handleFile = (file) => {
    setSshKeyName(file?.name || "id_rsa");
  };

  const canConnect = state === "ready" && branches.length > 0;

  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal large" onClick={(e) => e.stopPropagation()}>
        <div className="db-modal-head">
          <h2>Connect Git repository</h2>
          <p>
            Use an existing repository as the source of truth. Keboola will read
            app configuration from your branch. The repository source is{" "}
            <strong>immutable</strong> after creation.
          </p>
        </div>

        <div className="db-modal-body">
          {/* Repository URL */}
          <div className="db-field">
            <label className="db-field-label">
              Repository URL
              <span className="help">github.com · gitlab.com · self-hosted</span>
            </label>
            <div className="db-input-wrap">
              <input
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (state !== "idle") setState("idle"); }}
                placeholder="github.com/your-org/your-app"
                autoFocus
              />
            </div>
            <p className="helper-text">Try <code style={{padding: "1px 5px", background: "var(--muted)", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 11}}>github.com/argo22/missing-repo</code> to see an error state.</p>
          </div>

          {/* Private repository toggle */}
          <div className="db-toggle-row">
            <div className="text">
              <div className="label">
                <KbIcon name="lock" size={14} />
                Private repository
              </div>
              <div className="desc">Authenticate with a personal access token or SSH key</div>
            </div>
            <button
              className={`db-toggle ${isPrivate ? "on" : ""}`}
              onClick={() => setIsPrivate((v) => !v)}
              aria-label="Toggle private repository"
              aria-pressed={isPrivate}
            ></button>
          </div>

          {/* Private auth section (progressive disclosure) */}
          {isPrivate && (
            <div className="db-auth">
              <div className="db-auth-head">
                <div className="title">
                  <KbIcon name="key" size={14} />
                  Authentication
                </div>
                <div className="db-seg">
                  <button
                    className={authMethod === "pat" ? "active" : ""}
                    onClick={() => setAuthMethod("pat")}
                  >
                    <KbIcon name="key" size={12} />
                    Token
                  </button>
                  <button
                    className={authMethod === "ssh" ? "active" : ""}
                    onClick={() => setAuthMethod("ssh")}
                  >
                    <KbIcon name="lock" size={12} />
                    SSH key
                  </button>
                </div>
              </div>

              {authMethod === "pat" ? (
                <>
                  <div className="db-field" style={{marginBottom: 10}}>
                    <label className="db-field-label">Username</label>
                    <input
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); if (state !== "idle") setState("idle"); }}
                      placeholder="your-github-handle"
                    />
                  </div>
                  <div className="db-field" style={{marginBottom: 0}}>
                    <label className="db-field-label">
                      Personal Access Token
                      <span className="help">never leaves your project</span>
                    </label>
                    <input
                      value={token}
                      onChange={(e) => { setToken(e.target.value); if (state !== "idle") setState("idle"); }}
                      type="password"
                      placeholder="ghp_•••••••••••••••"
                    />
                  </div>
                </>
              ) : (
                <SshDropzone fileName={sshKeyName} onFile={handleFile} onClear={() => setSshKeyName("")} />
              )}

              <details className="db-expandable">
                <summary>
                  <KbIcon name="chevron-right" size={12} className="chev" />
                  <KbIcon name="circle-help" size={12} />
                  How to set up GitHub authentication
                </summary>
                <div className="content">
                  <p>Keboola uses a <strong>read-only deployment credential</strong> to fetch your repository contents. No write access is ever requested.</p>
                  {authMethod === "pat" ? (
                    <>
                      <p>For a Personal Access Token (classic or fine-grained), grant these scopes only:</p>
                      <ul>
                        <li><code>repo:status</code> — verify branch existence</li>
                        <li><code>read:org</code> — list available branches</li>
                        <li><code>contents:read</code> (fine-grained only) — fetch app source</li>
                      </ul>
                      <p>Create one at <code>github.com/settings/tokens</code>. Tokens are encrypted at rest in your Vault.</p>
                    </>
                  ) : (
                    <>
                      <p>Keboola auto-generates a read-only deployment public key for this connection. Add the matching public key to your repo's <code>Deploy keys</code> page with <strong>Read access</strong> only.</p>
                      <p>Upload the matching <strong>private key</strong> here — it stays in your Keboola Vault and is never exposed in the UI again.</p>
                    </>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* Validation status row */}
          {state !== "idle" && (
            <ValidateRow state={state} errorType={errorType} url={url} onRetry={validate} />
          )}

          {/* Branch select — appears once branches are loaded */}
          {state === "ready" && branches.length > 0 && (
            <div className="db-field" style={{marginTop: 6}}>
              <label className="db-field-label">
                Source branch
                <span className="help">{branches.length} branches found</span>
              </label>
              <div className="db-branch-select">
                <div className="db-branch-select-head" onClick={() => setBranchPickerOpen((v) => !v)}>
                  <KbIcon name="git-branch" size={14} />
                  <span className="name">{branch}</span>
                  {branch === "main" && <span className="pill default">default</span>}
                  <KbIcon name={branchPickerOpen ? "chevron-down" : "chevron-right"} size={14} />
                </div>
                {branchPickerOpen && (
                  <div className="db-branch-list">
                    {branches.map((b) => (
                      <div
                        key={b}
                        className={`db-branch-item ${b === branch ? "selected" : ""}`}
                        onClick={() => { setBranch(b); setBranchPickerOpen(false); }}
                      >
                        <KbIcon name="git-branch" size={12} />
                        <span>{b}</span>
                        {b === "main" && <span className="pill">default</span>}
                        {b === branch && b !== "main" && <span className="pill">selected</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="helper-text">
                Keboola will read app configuration from this branch. Branch can be changed later in repository settings; the repository source itself cannot.
              </p>
              {branch !== "main" && (
                <div className="db-branch-note">
                  <KbIcon name="git-branch" size={11} />
                  Will connect to <strong style={{fontWeight: 700, marginLeft: 4}}>{branch}</strong> · non-default branch
                </div>
              )}
            </div>
          )}

          {state === "idle" && (
            <div style={{
              marginTop: 4, padding: "10px 12px",
              background: "var(--color-keboola-50)",
              border: "1px solid var(--color-keboola-200)",
              borderRadius: 8,
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <KbIcon name="info" size={14} style={{color: "var(--color-keboola-700)", marginTop: 3, flex: "none"}} />
              <div style={{font: "400 12.5px/18px var(--font-sans)", color: "var(--color-keboola-900)"}}>
                Repository source is immutable after creation. Switch to <strong>Build with Kai</strong>
                {" "}if you'd prefer a Keboola-managed repository.
              </div>
            </div>
          )}
        </div>

        <div className="db-modal-foot">
          <span className="info">
            <KbIcon name="lock" size={12} />
            {isPrivate
              ? (authMethod === "pat" ? "Token stored encrypted in Vault" : "Read-only deploy key auto-generated")
              : "Public repo · no credentials needed"}
          </span>
          <button className="db-secondary-btn" onClick={onClose}>Cancel</button>
          {canConnect ? (
            <button
              className="db-publish"
              style={{background: "var(--color-keboola-700)"}}
              onClick={() => onConnect({ url, branch, isPrivate })}
            >
              <KbIcon name="git-branch" size={12} />
              Connect repository
            </button>
          ) : (
            <button
              className="db-publish"
              style={{background: "var(--color-keboola-700)"}}
              onClick={validate}
              disabled={state === "validating" || state === "authenticating" || state === "loading-branches"}
            >
              {state === "validating" || state === "authenticating" || state === "loading-branches"
                ? <><KbIcon name="loader" size={12} /> Validating…</>
                : <><KbIcon name="arrow-right" size={12} /> Validate connection</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────── */

const SshDropzone = ({ fileName, onFile, onClear }) => {
  const inputRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) onFile(f);
  };
  return (
    <div
      className={`db-dropzone ${fileName ? "has-file" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={drag ? {borderColor: "var(--color-keboola-500)", background: "var(--color-keboola-50)"} : null}
    >
      <input
        ref={inputRef}
        type="file"
        style={{display: "none"}}
        accept=".pem,.key,.pub,.ppk"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
      <span className="ic"><KbIcon name={fileName ? "circle-check" : "key"} size={14} /></span>
      {fileName ? (
        <>
          <span className="title">{fileName}</span>
          <span className="sub">Private key loaded · paired with auto-generated deploy public key</span>
          <button
            className="open-link"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
          >Replace key</button>
        </>
      ) : (
        <>
          <span className="title">Drop your private SSH key here</span>
          <span className="sub">or click to browse · .pem · .key · .ppk</span>
        </>
      )}
    </div>
  );
};

const ValidateRow = ({ state, errorType, url, onRetry }) => {
  if (state === "validating") {
    return (
      <div className="db-validate-row validating">
        <span className="ic"><div style={{width: 14, height: 14, borderRadius: 9999, border: "1.5px solid currentColor", borderTopColor: "transparent", animation: "dbspin 0.9s linear infinite"}}></div></span>
        <div className="body">
          Validating repository…
          <span className="sub">{url}</span>
        </div>
      </div>
    );
  }
  if (state === "authenticating") {
    let host = "";
    try { host = new URL("https://" + url.replace(/^https?:\/\//, "")).hostname; } catch { host = url.split("/")[0]; }
    return (
      <div className="db-validate-row validating">
        <span className="ic"><div style={{width: 14, height: 14, borderRadius: 9999, border: "1.5px solid currentColor", borderTopColor: "transparent", animation: "dbspin 0.9s linear infinite"}}></div></span>
        <div className="body">
          Checking permissions…
          <span className="sub">authenticating against {host}</span>
        </div>
      </div>
    );
  }
  if (state === "loading-branches") {
    return (
      <div className="db-validate-row validating">
        <span className="ic"><div style={{width: 14, height: 14, borderRadius: 9999, border: "1.5px solid currentColor", borderTopColor: "transparent", animation: "dbspin 0.9s linear infinite"}}></div></span>
        <div className="body">
          Loading branches…
          <span className="sub">reading refs/heads</span>
        </div>
      </div>
    );
  }
  if (state === "ready") {
    return (
      <div className="db-validate-row ok">
        <span className="ic"><KbIcon name="circle-check" size={14} /></span>
        <div className="body">
          Repository connected.
          <span className="sub">read-only access verified · pick a source branch below</span>
        </div>
      </div>
    );
  }
  if (state === "error") {
    const messages = {
      "invalid-url":   { t: "Invalid repository URL.",       s: "Use the format github.com/org/repo or your self-hosted host." },
      "not-found":     { t: "Repository not found.",         s: "Double-check the URL or your access permissions." },
      "auth-missing":  { t: "Authentication is required.",   s: "Fill in your credentials above and try again." },
      "auth-failed":   { t: "Authentication failed.",        s: "Your token was rejected. Check the scopes (repo:status · read:org)." },
    };
    const m = messages[errorType] || { t: "Connection failed.", s: "Try again, or check your inputs." };
    return (
      <div className="db-validate-row error">
        <span className="ic"><KbIcon name="circle-alert" size={14} /></span>
        <div className="body">
          {m.t}
          <span className="sub">{m.s}</span>
        </div>
        <button className="retry" onClick={onRetry}>Retry</button>
      </div>
    );
  }
  return null;
};

window.ConnectRepoModal = ConnectRepoModal;
