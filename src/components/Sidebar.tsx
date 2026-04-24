import type { ReactNode } from "react";
import type { AppView } from "../types/ui";
import type { CodexProcessInfo } from "../types";
import { HomeIcon, PlusIcon, SettingsIcon } from "./icons";
import { StatusChip } from "./ui";

interface SidebarProps {
  activeView: AppView;
  processInfo: CodexProcessInfo | null;
  hasRunningProcesses: boolean;
  onViewChange: (view: AppView) => void;
  onAddAccount: () => void;
}

export function Sidebar({
  activeView,
  processInfo,
  hasRunningProcesses,
  onViewChange,
  onAddAccount,
}: SidebarProps) {
  return (
    <aside className="thin-scrollbar flex w-full shrink-0 flex-col overflow-y-auto border-b border-[color:var(--border-soft)] bg-black/5 md:w-[292px] md:border-b-0 md:border-r lg:w-[312px] xl:w-[352px] 2xl:w-[400px]">
      <div className="px-4 pb-4 pt-4 md:px-4 md:pb-4 md:pt-4 lg:px-5 lg:pb-5 lg:pt-5 xl:px-6 xl:pt-6 2xl:px-7">
        <div className="panel-surface panel-surface-featured rounded-[28px] p-4 md:p-4 lg:p-5 xl:p-6 2xl:p-7">
          <div className="flex items-center gap-3 xl:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] bg-black shadow-lg shadow-black/20 xl:h-16 xl:w-16 xl:rounded-[1.35rem]">
              <img
                src="/app-logo.svg"
                alt=""
                aria-hidden="true"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <h1 className="text-[1.24rem] font-semibold tracking-[-0.04em] text-[color:var(--text-strong)] lg:text-[1.38rem] xl:text-[1.52rem]">
                Codex Switcher
              </h1>
              <p className="text-sm leading-5 text-[color:var(--text-muted)] xl:max-w-[16rem]">
                Account switching, usage checks, and backups.
              </p>
              <StatusChip busy={hasRunningProcesses}>
                {processInfo ? `${processInfo.count} Codex running` : "Checking activity"}
              </StatusChip>
            </div>
          </div>
        </div>

        <nav
          className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:mt-6 xl:gap-3"
          aria-label="Primary"
        >
          <SidebarNavButton
            active={activeView === "home"}
            icon={<HomeIcon className="h-5 w-5" />}
            label="Home"
            description="Usage, switching, and account scan"
            onClick={() => onViewChange("home")}
          />
          <SidebarNavButton
            active={activeView === "settings"}
            icon={<SettingsIcon className="h-5 w-5" />}
            label="Settings"
            description="Import, export, backup, and privacy"
            onClick={() => onViewChange("settings")}
          />
        </nav>
      </div>

      <div className="mt-auto px-4 pb-4 md:px-4 md:pb-4 lg:px-5 lg:pb-5 xl:px-6 2xl:px-7 2xl:pb-7">
        <div className="panel-surface rounded-[24px] p-4">
          <div>
            <div className="section-kicker">Add account</div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
              Sign in with OAuth or import an existing Codex auth.json file.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddAccount}
            className="toolbar-button toolbar-button-primary mt-3 w-full justify-center"
          >
            <PlusIcon className="h-4 w-4" />
            Add account
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarNavButton({
  active,
  icon,
  label,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border-soft)] bg-white/5">
        {icon}
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-sm font-semibold text-[color:var(--text-strong)]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[color:var(--text-faint)]">
          {description}
        </span>
      </span>
    </button>
  );
}
