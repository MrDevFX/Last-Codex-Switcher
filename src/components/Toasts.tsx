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
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="panel-surface rounded-[18px] px-4 py-3 text-sm text-[color:var(--text-strong)]">
            Usage refreshed successfully.
          </div>
        </div>
      )}

      {warmupToast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 px-4">
          <div
            className={`rounded-[18px] px-4 py-3 text-sm shadow-2xl ${
              warmupToast.isError
                ? "bg-red-500 text-white"
                : "panel-surface text-[color:var(--text-strong)]"
            }`}
          >
            {warmupToast.message}
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-[18px] bg-red-500 px-4 py-3 text-sm text-white shadow-2xl">
            Click delete again to confirm removal
          </div>
        </div>
      )}
    </>
  );
}
