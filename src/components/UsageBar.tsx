import type { UsageInfo } from "../types";

interface UsageBarProps {
  usage?: UsageInfo;
  loading?: boolean;
}

function formatResetTime(resetAt: number | null | undefined): string {
  if (!resetAt) return "";
  const now = Math.floor(Date.now() / 1000);
  const diff = resetAt - now;
  if (diff <= 0) return "now";
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

function formatExactResetTime(resetAt: number | null | undefined): string {
  if (!resetAt) return "";

  const date = new Date(resetAt * 1000);
  const month = new Intl.DateTimeFormat(undefined, { month: "long" }).format(date);
  const day = date.getDate();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = date.getHours() >= 12 ? "PM" : "AM";
  const hour12 = date.getHours() % 12 || 12;

  return `${month} ${day}, ${hour12}:${minutes} ${period}`;
}

function formatWindowDuration(minutes: number | null | undefined): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function RateLimitBar({
  label,
  usedPercent,
  windowMinutes,
  resetsAt,
}: {
  label: string;
  usedPercent: number;
  windowMinutes?: number | null;
  resetsAt?: number | null;
}) {
  const remainingPercent = Math.max(0, 100 - usedPercent);
  const colorStyle =
    remainingPercent <= 10
      ? "var(--track-low)"
      : remainingPercent <= 30
        ? "var(--track-mid)"
        : "var(--track-high)";

  const windowLabel = formatWindowDuration(windowMinutes);
  const resetLabel = formatResetTime(resetsAt);
  const exactResetLabel = formatExactResetTime(resetsAt);

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-faint)]">
          {label} {windowLabel && `(${windowLabel})`}
        </div>
        <div className="text-xs font-mono text-[color:var(--text-muted)]">
          {remainingPercent.toFixed(0)}% left
          {resetLabel && ` - resets ${resetLabel}`}
        </div>
      </div>

      <div className="h-2 rounded-full bg-[color:var(--track-bg)] p-[2px]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(remainingPercent, 100)}%`,
            background: colorStyle,
          }}
        />
      </div>

      {exactResetLabel && (
        <div className="text-[11px] text-[color:var(--text-faint)]">{exactResetLabel}</div>
      )}
    </div>
  );
}

export function UsageBar({ usage, loading }: UsageBarProps) {
  if (loading && !usage) {
    return (
      <div className="space-y-3">
        <div className="text-xs italic text-[color:var(--text-faint)] animate-pulse">
          Fetching usage...
        </div>
        <div className="h-2 rounded-full bg-[color:var(--track-bg)] overflow-hidden">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-white/20" />
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="rounded-[18px] border border-dashed border-[color:var(--border-soft)] px-4 py-3 text-xs italic text-[color:var(--text-faint)]">
        Fetching usage...
      </div>
    );
  }

  if (usage.error) {
    return (
      <div className="rounded-[18px] border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-700 dark:text-red-200">
        {usage.error}
      </div>
    );
  }

  const hasPrimary =
    usage.primary_used_percent !== null && usage.primary_used_percent !== undefined;
  const hasSecondary =
    usage.secondary_used_percent !== null && usage.secondary_used_percent !== undefined;

  if (!hasPrimary && !hasSecondary) {
    return (
      <div className="rounded-[18px] border border-dashed border-[color:var(--border-soft)] px-4 py-3 text-xs italic text-[color:var(--text-faint)]">
        No rate limit data
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasPrimary && (
        <RateLimitBar
          label="5h limit"
          usedPercent={usage.primary_used_percent!}
          windowMinutes={usage.primary_window_minutes}
          resetsAt={usage.primary_resets_at}
        />
      )}
      {hasSecondary && (
        <RateLimitBar
          label="Weekly limit"
          usedPercent={usage.secondary_used_percent!}
          windowMinutes={usage.secondary_window_minutes}
          resetsAt={usage.secondary_resets_at}
        />
      )}
      {usage.credits_balance !== null && usage.credits_balance !== undefined && (
        <div className="text-xs text-[color:var(--text-muted)]">
          Credits balance: <span className="font-mono">{usage.credits_balance}</span>
        </div>
      )}
    </div>
  );
}
