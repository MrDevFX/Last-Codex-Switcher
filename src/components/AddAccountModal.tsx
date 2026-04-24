import { useState } from "react";
import {
  describeFileSource,
  isTauriRuntime,
  openExternalUrl,
  pickAuthJsonFile,
  type FileSource,
} from "../lib/platform";
import { CloseIcon, CopyIcon, ExternalIcon, FolderIcon, RefreshIcon } from "./icons";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportFile: (source: FileSource, name: string) => Promise<void>;
  onStartOAuth: (name: string) => Promise<{ auth_url: string }>;
  onCompleteOAuth: () => Promise<unknown>;
  onCancelOAuth: () => Promise<void>;
}

type Tab = "oauth" | "import";

export function AddAccountModal({
  isOpen,
  onClose,
  onImportFile,
  onStartOAuth,
  onCompleteOAuth,
  onCancelOAuth,
}: AddAccountModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("oauth");
  const [name, setName] = useState("");
  const [fileSource, setFileSource] = useState<FileSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthPending, setOauthPending] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const isPrimaryDisabled = loading || (activeTab === "oauth" && oauthPending);
  const tauriRuntime = isTauriRuntime();

  const resetForm = () => {
    setName("");
    setFileSource(null);
    setError(null);
    setLoading(false);
    setOauthPending(false);
    setAuthUrl("");
    setCopied(false);
  };

  const handleClose = () => {
    if (oauthPending) {
      void onCancelOAuth();
    }
    resetForm();
    onClose();
  };

  const handleOAuthLogin = async () => {
    if (!name.trim()) {
      setError("Please enter an account name");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const info = await onStartOAuth(name.trim());
      setAuthUrl(info.auth_url);
      setOauthPending(true);
      setLoading(false);

      await onCompleteOAuth();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
      setOauthPending(false);
    }
  };

  const handleSelectFile = async () => {
    try {
      const selected = await pickAuthJsonFile();
      if (selected) setFileSource(selected);
    } catch (err) {
      console.error("Failed to open file dialog:", err);
    }
  };

  const handleImportFile = async () => {
    if (!name.trim()) {
      setError("Please enter an account name");
      return;
    }
    if (!fileSource) {
      setError("Please select an auth.json file");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onImportFile(fileSource, name.trim());
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop z-50">
      <div className="modal-panel panel-surface max-w-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border-soft)] px-6 py-5">
          <div>
            <div className="section-kicker">Account intake</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
              Add account
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="toolbar-button !min-h-11 !w-11 !rounded-2xl !px-0"
            title="Close"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="grid gap-2 rounded-[22px] border border-[color:var(--border-soft)] bg-white/5 p-2 sm:grid-cols-2">
            {(["oauth", "import"] as Tab[]).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => {
                  if (tab === "import" && oauthPending) {
                    void onCancelOAuth().catch((err) => {
                      console.error("Failed to cancel login:", err);
                    });
                    setOauthPending(false);
                    setLoading(false);
                  }
                  setActiveTab(tab);
                  setError(null);
                }}
                className={`tab-button ${activeTab === tab ? "tab-button-active" : ""}`}
              >
                {tab === "oauth" ? "ChatGPT login" : "Import file"}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--text-muted)]">
                Account name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Work account"
                className="field-shell"
              />
            </div>

            {activeTab === "oauth" && (
              <div className="rounded-[22px] border border-[color:var(--border-soft)] bg-white/5 p-4">
                {oauthPending ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <RefreshIcon className="h-5 w-5 animate-spin text-[color:var(--accent)]" />
                      <div>
                        <div className="text-sm font-semibold text-[color:var(--text-strong)]">
                          Waiting for browser login
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[color:var(--text-muted)]">
                          Open the generated link in your browser, then come back here once the
                          callback lands on localhost.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-[color:var(--border-soft)] bg-black/10 p-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-faint)]">
                        Login URL
                      </div>
                      <div className="mt-2 break-all text-xs leading-6 text-[color:var(--text-muted)]">
                        {authUrl}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard
                            .writeText(authUrl)
                            .then(() => {
                              setCopied(true);
                              window.setTimeout(() => setCopied(false), 2000);
                            })
                            .catch(() => {
                              setError("Clipboard unavailable. Copy the link manually.");
                            });
                        }}
                        className="toolbar-button justify-center"
                      >
                        <CopyIcon className="h-4 w-4" />
                        {copied ? "Copied" : "Copy link"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void openExternalUrl(authUrl);
                        }}
                        className="toolbar-button toolbar-button-primary justify-center"
                      >
                        <ExternalIcon className="h-4 w-4" />
                        Open in browser
                      </button>
                    </div>

                    {!tauriRuntime && (
                      <p className="text-xs leading-6 text-amber-700 dark:text-amber-200">
                        OAuth login must finish on the same host machine because the callback
                        redirects to `localhost`.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="section-kicker">Browser flow</div>
                    <p className="text-sm leading-6 text-[color:var(--text-muted)]">
                      Generate a login link, finish the authentication in your browser, and the
                      account will return to this desktop app automatically.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "import" && (
              <div className="rounded-[22px] border border-[color:var(--border-soft)] bg-white/5 p-4">
                <label className="mb-2 block text-sm font-medium text-[color:var(--text-muted)]">
                  Select auth.json file
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="field-shell flex-1 truncate">
                    {describeFileSource(fileSource)}
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectFile}
                    className="toolbar-button justify-center"
                  >
                    <FolderIcon className="h-4 w-4" />
                    Browse
                  </button>
                </div>
                <p className="mt-3 text-xs leading-6 text-[color:var(--text-faint)]">
                  Import credentials from an existing Codex `auth.json` file.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-[20px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[color:var(--border-soft)] px-6 py-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={handleClose} className="toolbar-button justify-center">
            Cancel
          </button>
          <button
            type="button"
            onClick={
              activeTab === "oauth" ? () => void handleOAuthLogin() : () => void handleImportFile()
            }
            disabled={isPrimaryDisabled}
            className="toolbar-button toolbar-button-primary justify-center"
          >
            {activeTab === "oauth" ? (
              <>
                <ExternalIcon className="h-4 w-4" />
                {loading ? "Generating..." : "Generate login link"}
              </>
            ) : (
              <>
                <FolderIcon className="h-4 w-4" />
                {loading ? "Importing..." : "Import account"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
