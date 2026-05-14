import type { ReactNode } from "react";
import type { AppView } from "../types/ui";
import type { CodexProcessInfo } from "../types";
import { HomeIcon, PlusIcon, SettingsIcon } from "./icons";

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
    <aside className="sidebar thin-scrollbar w-full shrink-0 md:w-[280px] lg:w-[300px] xl:w-[320px] border-b border-[color:var(--hairline)] md:border-b-0 p-4 gap-3 flex flex-col">
      {/* Brand card — fused with process activity */}
      <div className="brand-card">
        <div className="brand-top">
          <div className="brand-mark">
            <img
              src="/app-logo.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="brand-text">
            <h1>Codex Switcher</h1>
            <p>Account switching, usage checks, and backups.</p>
          </div>
        </div>
        <div className="brand-sep" />
        <div className="brand-activity">
          <div className="flex items-center justify-between">
            <span className="kicker-faint">Codex activity</span>
            {processInfo && (
              <span
                className="live-dot"
                style={{ background: hasRunningProcesses ? "var(--warning)" : "var(--accent)" }}
              />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="processes-num">
              {processInfo ? processInfo.count : "—"}
            </span>
            <span className="text-[11.5px] text-[color:var(--text-muted)]">
              {processInfo
                ? hasRunningProcesses
                  ? `process${processInfo.count === 1 ? "" : "es"} running`
                  : "no active processes"
                : "checking…"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav" aria-label="Primary">
        <SidebarNavButton
          active={activeView === "home"}
          icon={<HomeIcon className="h-4 w-4" />}
          label="Home"
          description="Usage, switching, account scan"
          onClick={() => onViewChange("home")}
        />
        <SidebarNavButton
          active={activeView === "settings"}
          icon={<SettingsIcon className="h-4 w-4" />}
          label="Settings"
          description="Import, export, backup, privacy"
          onClick={() => onViewChange("settings")}
        />
      </nav>

      {/* CTA */}
      <div className="sidebar-cta mt-auto">
        <p>Sign in with OAuth or import an existing Codex auth.json file.</p>
        <button
          type="button"
          onClick={onAddAccount}
          className="btn-primary w-full"
        >
          <PlusIcon className="h-4 w-4" />
          Add account
        </button>
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
      className={`nav-item ${active ? "active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-meta">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
    </button>
  );
}
