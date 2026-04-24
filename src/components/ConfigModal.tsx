import type { ConfigModalMode } from "../types/ui";
import { ArchiveDownIcon, ArchiveUpIcon, CloseIcon } from "./icons";

interface ConfigModalProps {
  mode: ConfigModalMode;
  payload: string;
  error: string | null;
  copied: boolean;
  isExportingSlim: boolean;
  isImportingSlim: boolean;
  onPayloadChange: (payload: string) => void;
  onClose: () => void;
  onCopy: () => void;
  onImport: () => void;
}

export function ConfigModal({
  mode,
  payload,
  error,
  copied,
  isExportingSlim,
  isImportingSlim,
  onPayloadChange,
  onClose,
  onCopy,
  onImport,
}: ConfigModalProps) {
  return (
    <div className="modal-backdrop z-50">
      <div className="modal-panel panel-surface max-w-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border-soft)] px-6 py-5">
          <div>
            <div className="section-kicker">Slim transfer</div>
            <h3 className="mt-2 text-xl font-semibold text-[color:var(--text-strong)]">
              {mode === "slim_export" ? "Export slim text" : "Import slim text"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="toolbar-button !min-h-11 !w-11 !rounded-2xl !px-0"
            title="Close"
            aria-label="Close slim transfer modal"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {mode === "slim_import" ? (
            <div className="rounded-[20px] border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-900 dark:text-amber-200">
              Existing accounts stay in place. Only missing accounts are imported.
            </div>
          ) : (
            <div className="rounded-[20px] border border-[color:var(--border-soft)] bg-white/5 px-4 py-3 text-sm leading-6 text-[color:var(--text-muted)]">
              This slim string contains account secrets. Keep it private and share it only on a
              channel you trust.
            </div>
          )}

          <textarea
            value={payload}
            onChange={(event) => onPayloadChange(event.target.value)}
            readOnly={mode === "slim_export"}
            placeholder={
              mode === "slim_export"
                ? isExportingSlim
                  ? "Generating your slim text payload..."
                  : "The export string will appear here."
                : "Paste the slim text payload here."
            }
            className="textarea-shell"
          />

          {error && (
            <div className="rounded-[20px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-[color:var(--border-soft)] px-6 py-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="toolbar-button justify-center">
            Close
          </button>
          {mode === "slim_export" ? (
            <button
              type="button"
              onClick={onCopy}
              disabled={!payload || isExportingSlim}
              className="toolbar-button toolbar-button-primary justify-center"
            >
              <ArchiveUpIcon className="h-4 w-4" />
              {copied ? "Copied" : "Copy string"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onImport}
              disabled={isImportingSlim}
              className="toolbar-button toolbar-button-primary justify-center"
            >
              <ArchiveDownIcon className="h-4 w-4" />
              {isImportingSlim ? "Importing..." : "Import missing accounts"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
