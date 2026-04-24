import { useEffect, useRef, useState } from "react";
import type { AccountWithUsage } from "../types";
import { formatPlanLabel, getAccountInitials, getPrivatePlaceholder } from "../lib/accountDisplay";
import { TrashIcon } from "./icons";
import { StatusChip } from "./ui";
import { UsageBar } from "./UsageBar";

interface AccountCardProps {
  account: AccountWithUsage;
  onSwitch: () => void;
  onDelete: () => void;
  onRename: (newName: string) => Promise<void>;
  switching?: boolean;
  switchDisabled?: boolean;
  restartSwitchEnabled?: boolean;
  masked?: boolean;
  featured?: boolean;
}

function formatLastRefresh(date: Date | null): string {
  if (!date) return "Never";
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 5) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function PrivateText({
  children,
  masked,
  kind,
}: {
  children: string;
  masked: boolean;
  kind: "name" | "email";
}) {
  if (!masked) return <>{children}</>;

  return (
    <span aria-label={`${kind} hidden`} className="select-none tracking-[0.08em]">
      {getPrivatePlaceholder(kind)}
    </span>
  );
}

export function AccountCard({
  account,
  onSwitch,
  onDelete,
  onRename,
  switching,
  switchDisabled,
  restartSwitchEnabled = true,
  masked = false,
  featured = false,
}: AccountCardProps) {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(
    account.usage && !account.usage.error ? new Date() : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(account.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFeatured = featured || account.is_active;

  useEffect(() => {
    setEditName(account.name);
  }, [account.name]);

  useEffect(() => {
    if (account.usage && !account.usage.error) {
      setLastRefresh(new Date());
    }
  }, [account.usage]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = async () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== account.name) {
      try {
        await onRename(trimmed);
      } catch {
        setEditName(account.name);
      }
    } else {
      setEditName(account.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      void handleRename();
    } else if (event.key === "Escape") {
      setEditName(account.name);
      setIsEditing(false);
    }
  };

  const planColors: Record<string, string> = {
    pro: "border-sky-400/30 bg-sky-500/10 text-sky-700 dark:text-sky-200",
    plus: "border-emerald-400/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    team: "border-cyan-400/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
    enterprise: "border-amber-400/30 bg-amber-500/10 text-amber-700 dark:text-amber-200",
    free: "border-white/10 bg-white/5 text-[color:var(--text-muted)]",
    api_key: "border-orange-400/30 bg-orange-500/10 text-orange-700 dark:text-orange-200",
  };

  const planKey = account.plan_type?.toLowerCase() || "api_key";
  const planColorClass = planColors[planKey] || planColors.free;
  const cardGridClass = isFeatured
    ? "relative grid gap-5 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] xl:items-start"
    : "relative";
  const actionButtonClass = "toolbar-button !min-h-11 !w-11 justify-center rounded-[18px] !px-0";
  const switchIsLocked = Boolean(switchDisabled && !restartSwitchEnabled);

  return (
    <article
      className={`panel-surface relative overflow-hidden rounded-[28px] p-4 transition-all duration-200 md:p-5 ${
        isFeatured
          ? "panel-surface-featured"
          : "hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_34%)]" />

      <div className={cardGridClass}>
        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {account.is_active && (
                  <StatusChip className="!py-1 !text-[11px] !tracking-[0.2em] uppercase">
                    Active
                  </StatusChip>
                )}
                {featured && !account.is_active && (
                  <span className="status-chip !py-1 !text-[11px] !tracking-[0.2em] uppercase">
                    Spotlight
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-start gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] border border-[color:var(--border-soft)] bg-black/10 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-strong)]"
                  aria-label={masked ? "account initials hidden" : undefined}
                >
                  {getAccountInitials(account.name, masked)}
                </div>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      onBlur={() => {
                        void handleRename();
                      }}
                      onKeyDown={handleKeyDown}
                      className="field-shell !rounded-2xl !px-3 !py-2 font-semibold"
                      aria-label="Account name"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (masked) return;
                        setEditName(account.name);
                        setIsEditing(true);
                      }}
                      className="min-w-0 text-left"
                      title={masked ? undefined : "Click to rename"}
                    >
                      <h3 className="truncate text-xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
                        <PrivateText masked={masked} kind="name">
                          {account.name}
                        </PrivateText>
                      </h3>
                    </button>
                  )}

                  {account.email && (
                    <p className="mt-1 truncate text-sm text-[color:var(--text-muted)]">
                      <PrivateText masked={masked} kind="email">
                        {account.email}
                      </PrivateText>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 sm:justify-end">
              <button
                type="button"
                onClick={onDelete}
                className={`${actionButtonClass} toolbar-button-danger`}
                title="Remove account"
                aria-label="Remove account"
              >
                <TrashIcon className="h-4 w-4" />
              </button>

              <span
                className={`inline-flex min-h-11 items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${planColorClass}`}
              >
                {formatPlanLabel(account)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--text-faint)]">
            <span className="uppercase tracking-[0.18em]">Last updated</span>
            <span className="font-mono text-[color:var(--text-muted)]">
              {formatLastRefresh(lastRefresh)}
            </span>
          </div>

          <div className="mt-4">
            {account.is_active ? (
              <button
                type="button"
                disabled
                className="toolbar-button w-full justify-center rounded-[20px] border-[color:var(--accent-border)] bg-emerald-500/10 text-[color:var(--text-strong)]"
              >
                Current account
              </button>
            ) : (
              <button
                type="button"
                onClick={onSwitch}
                disabled={switching || switchIsLocked}
                className={`toolbar-button w-full justify-center rounded-[20px] ${
                  switchIsLocked ? "opacity-50" : "toolbar-button-primary"
                }`}
                title={
                  switchDisabled
                    ? restartSwitchEnabled
                      ? "Close and reopen Codex after switching"
                      : "Enable restart switching or close Codex first"
                    : undefined
                }
              >
                {switching
                  ? "Switching..."
                  : switchDisabled
                    ? restartSwitchEnabled
                      ? "Restart & switch"
                      : "Codex running"
                    : "Switch"}
              </button>
            )}
          </div>
        </div>

        <div className={isFeatured ? "min-w-0" : "mt-5 min-w-0"}>
          <div className="rounded-[22px] border border-[color:var(--border-soft)] bg-black/5 p-4">
            <UsageBar usage={account.usage} loading={account.usageLoading} />
          </div>
        </div>
      </div>
    </article>
  );
}
