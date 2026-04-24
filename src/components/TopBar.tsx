import type { ReactNode } from "react";

interface TopBarProps {
  title: string;
  heading: string;
  description: string;
  actions?: ReactNode;
  compact?: boolean;
}

export function TopBar({ title, heading, description, actions, compact = false }: TopBarProps) {
  return (
    <header className="app-topbar relative z-40 shrink-0 border-b border-[color:var(--border-soft)] px-4 py-4 md:px-5 md:py-5 xl:px-8 xl:py-6">
      <div
        className={`app-topbar-inner flex flex-col gap-3 ${
          actions ? "lg:gap-4 xl:flex-row xl:items-end xl:justify-between" : ""
        }`}
      >
        <div className={compact ? "max-w-2xl" : "max-w-3xl"}>
          <div className="section-kicker">{title}</div>
          <h2
            className={`mt-2 font-semibold tracking-[-0.05em] text-[color:var(--text-strong)] ${
              compact
                ? "text-[1.48rem] lg:text-[1.75rem] xl:text-[1.95rem]"
                : "text-[1.7rem] lg:text-[2rem] xl:text-[2.35rem]"
            }`}
          >
            {heading}
          </h2>
          <p
            className={`mt-2 max-w-2xl text-[color:var(--text-muted)] ${
              compact ? "text-sm leading-6" : "text-sm leading-6 xl:text-[0.98rem] xl:leading-7"
            }`}
          >
            {description}
          </p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
