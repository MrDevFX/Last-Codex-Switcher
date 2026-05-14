import type { ToastState } from "../types/ui";

interface ToastsProps {
  refreshSuccess: boolean;
  warmupToast: ToastState | null;
  deleteConfirmId: string | null;
}

export function Toasts({ refreshSuccess, warmupToast, deleteConfirmId }: ToastsProps) {
  return (
    <>
      {refreshSuccess && (
        <div className="toast">
          <span style={{ color: "var(--success)" }}>✓</span>
          Usage refreshed successfully.
        </div>
      )}

      {warmupToast && (
        <div
          className={warmupToast.isError ? "toast toast-error" : "toast"}
          style={{ bottom: 64 }}
        >
          {warmupToast.message}
        </div>
      )}

      {deleteConfirmId && (
        <div className="toast toast-error">
          Click delete again to confirm removal
        </div>
      )}
    </>
  );
}
