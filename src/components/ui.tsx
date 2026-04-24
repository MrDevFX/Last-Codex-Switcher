import type { ReactNode } from "react";
import { CloseIcon, PlusIcon, RefreshIcon, ChevronRightIcon } from "./icons";

export function StatusChip({
  busy = false,
  children,
  className = "",
}: {
  busy?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`status-chip ${className}`}>
      <span className={`status-dot ${busy ? "busy" : ""}`} />
      {children}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  note,
  compact = false,
  tone = "default",
}: {
  label: string;
  value: string;
  note: string;
  compact?: boolean;
  tone?: "default" | "nested";
}) {
  return (
    <div
      className={`${tone === "nested" ? "metric-card-nested" : "panel-surface"} rounded-[24px] ${
        compact ? "p-3.5 lg:p-4" : "p-4 lg:p-5"
      }`}
    >
      <div className="section-kicker">{label}</div>
      <div
        className={`mt-3 font-semibold tracking-[-0.05em] text-[color:var(--text-strong)] ${
          compact ? "text-[1.28rem] lg:text-[1.4rem]" : "text-[1.7rem]"
        }`}
      >
        {value}
      </div>
      <p
        className={`mt-2 text-[color:var(--text-muted)] ${
          compact ? "text-xs leading-5" : "text-sm leading-6"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

export function ToolbarActionButton({
  title,
  onClick,
  icon,
  label,
  disabled,
  className = "",
}: {
  title: string;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`toolbar-button ${className}`}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow && <div className="section-kicker">{eyebrow}</div>}
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">{description}</p>
      )}
    </div>
  );
}

export function SettingsPanel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel-surface rounded-[28px] p-5 lg:p-6 ${className}`}>
      <div className="section-kicker">Settings</div>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{description}</p>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

export function SettingsAction({
  title,
  description,
  icon,
  onClick,
  disabled,
  tone = "default",
  trailing,
  showChevron = true,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "primary";
  trailing?: ReactNode;
  showChevron?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`toolbar-button w-full items-start justify-between rounded-[22px] px-4 py-4 text-left ${
        tone === "primary" ? "toolbar-button-primary" : ""
      }`}
    >
      <span className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 rounded-2xl border border-white/10 bg-black/10 p-2">{icon}</span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="mt-1 block text-xs leading-5 opacity-80">{description}</span>
        </span>
      </span>
      {trailing ? (
        <span className="ml-3 shrink-0">{trailing}</span>
      ) : showChevron ? (
        <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 opacity-70" />
      ) : null}
    </button>
  );
}

export function StatePanel({
  eyebrow,
  title,
  description,
  action,
  loading = false,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  loading?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <div className="panel-surface rounded-[30px] px-6 py-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] border ${
            tone === "danger"
              ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
              : "border-[color:var(--border-soft)] bg-white/5 text-[color:var(--accent)]"
          }`}
        >
          {loading ? (
            <RefreshIcon className="h-7 w-7 animate-spin" />
          ) : tone === "danger" ? (
            <CloseIcon className="h-7 w-7" />
          ) : (
            <PlusIcon className="h-7 w-7" />
          )}
        </div>
        <div className="section-kicker mt-5">{eyebrow}</div>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">{description}</p>
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
