import type { CodexProcessInfo } from "../types";
import type { ThemeMode } from "../types/ui";
import {
  ArchiveDownIcon,
  ArchiveUpIcon,
  BoltIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshIcon,
  ShieldIcon,
  SunIcon,
  MoonIcon,
} from "./icons";
import { SettingsAction, SettingsPanel, StatusChip } from "./ui";

interface SettingsViewProps {
  allMasked: boolean;
  autoWarmupEnabled: boolean;
  restartSwitchEnabled: boolean;
  themeMode: ThemeMode;
  isRefreshing: boolean;
  isAutoWarmupRunning: boolean;
  isExportingSlim: boolean;
  isImportingSlim: boolean;
  isExportingFull: boolean;
  isImportingFull: boolean;
  processInfo: CodexProcessInfo | null;
  hasRunningProcesses: boolean;
  onImportFullFile: () => void;
  onExportSlimText: () => void;
  onImportSlimText: () => void;
  onExportFullFile: () => void;
  onToggleMaskAll: () => void;
  onToggleAutoWarmup: () => void;
  onToggleRestartSwitch: () => void;
  onToggleTheme: () => void;
}

export function SettingsView({
  allMasked,
  autoWarmupEnabled,
  restartSwitchEnabled,
  themeMode,
  isRefreshing,
  isAutoWarmupRunning,
  isExportingSlim,
  isImportingSlim,
  isExportingFull,
  isImportingFull,
  processInfo,
  hasRunningProcesses,
  onImportFullFile,
  onExportSlimText,
  onImportSlimText,
  onExportFullFile,
  onToggleMaskAll,
  onToggleAutoWarmup,
  onToggleRestartSwitch,
  onToggleTheme,
}: SettingsViewProps) {
  return (
    <div className="settings-grid">
      <SettingsPanel
        title="Slim transfer"
        description="Share or restore the compact text payload for missing accounts."
      >
        <SettingsAction
          title={isExportingSlim ? "Exporting slim text..." : "Export slim text"}
          description="Copy a compact account payload to your clipboard."
          icon={<ArchiveUpIcon className="h-5 w-5" />}
          onClick={onExportSlimText}
          disabled={isExportingSlim}
        />
        <SettingsAction
          title={isImportingSlim ? "Importing slim text..." : "Import slim text"}
          description="Merge in any accounts you do not already have."
          icon={<ArchiveDownIcon className="h-5 w-5" />}
          onClick={onImportSlimText}
          disabled={isImportingSlim}
        />
      </SettingsPanel>

      <SettingsPanel
        title="Backups"
        description="Create or restore the full encrypted backup file used by the desktop app."
      >
        <SettingsAction
          title={isExportingFull ? "Exporting full backup..." : "Export full backup"}
          description="Save every stored account to a `.cswf` file."
          icon={<ShieldIcon className="h-5 w-5" />}
          onClick={onExportFullFile}
          disabled={isExportingFull}
        />
        <SettingsAction
          title={isImportingFull ? "Importing full backup..." : "Restore full backup"}
          description="Rehydrate the local account store from backup."
          icon={<ShieldIcon className="h-5 w-5" />}
          onClick={onImportFullFile}
          disabled={isImportingFull}
        />
      </SettingsPanel>

      <SettingsPanel
        title="Workspace preferences"
        description="Privacy, appearance, automation, and process safety in one compact control strip."
        className="settings-panel-span-all"
      >
        <div className="settings-preference-grid">
          <SettingsAction
            title={allMasked ? "Reveal all accounts" : "Hide all accounts"}
            description={
              allMasked
                ? "Show names, emails, and initials again."
                : "Mask names, emails, and initials across the app."
            }
            icon={allMasked ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            onClick={onToggleMaskAll}
            trailing={
              <PreferenceBadge active={allMasked}>{allMasked ? "Hidden" : "Shown"}</PreferenceBadge>
            }
            showChevron={false}
          />
          <SettingsAction
            title={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            description="Flip between the two built-in visual themes."
            icon={
              themeMode === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )
            }
            onClick={onToggleTheme}
            trailing={
              <PreferenceBadge active={themeMode === "dark"}>
                {themeMode === "dark" ? "Dark" : "Light"}
              </PreferenceBadge>
            }
            showChevron={false}
          />
          <SettingsAction
            title={autoWarmupEnabled ? "Auto warm-up enabled" : "Auto warm-up disabled"}
            description={
              isAutoWarmupRunning
                ? "A warm-up cycle is running now."
                : autoWarmupEnabled
                  ? "Runs after launch and hourly while open."
                  : "Off means no background warm-up traffic."
            }
            icon={<BoltIcon className={`h-5 w-5 ${isAutoWarmupRunning ? "animate-pulse" : ""}`} />}
            onClick={onToggleAutoWarmup}
            trailing={
              <PreferenceBadge active={autoWarmupEnabled}>
                {isAutoWarmupRunning ? "Running" : autoWarmupEnabled ? "On" : "Off"}
              </PreferenceBadge>
            }
            showChevron={false}
          />
          <SettingsAction
            title={
              restartSwitchEnabled ? "Restart switching enabled" : "Restart switching disabled"
            }
            description={
              restartSwitchEnabled
                ? "Switching can close and reopen Codex when needed."
                : "Switching stays locked until Codex is closed."
            }
            icon={<RefreshIcon className="h-5 w-5" />}
            onClick={onToggleRestartSwitch}
            trailing={
              <PreferenceBadge active={restartSwitchEnabled}>
                {restartSwitchEnabled ? "On" : "Off"}
              </PreferenceBadge>
            }
            showChevron={false}
          />
        </div>

        <div className="panel-surface-muted mt-4 rounded-[22px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="section-kicker">Process safety</div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                {processInfo
                  ? hasRunningProcesses
                    ? restartSwitchEnabled
                      ? `Switching will restart ${processInfo.count} Codex ${
                          processInfo.count === 1 ? "process" : "processes"
                        }.`
                      : `Switching is locked until ${processInfo.count} Codex ${
                          processInfo.count === 1 ? "process closes" : "processes close"
                        }.`
                    : isRefreshing
                      ? "No Codex processes are active, and refreshes are safe to run right now."
                      : "No Codex processes are active, so switching and refreshes are allowed."
                  : "Process status is still loading."}
              </p>
            </div>
            <StatusChip busy={hasRunningProcesses}>
              {processInfo ? `${processInfo.background_count} background` : "Checking"}
            </StatusChip>
          </div>
        </div>
      </SettingsPanel>
    </div>
  );
}

function PreferenceBadge({ active, children }: { active: boolean; children: string }) {
  return (
    <span
      className={`inline-flex min-w-[4.25rem] items-center justify-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
        active
          ? "border-[color:var(--accent-border)] bg-cyan-500/10 text-[color:var(--accent)]"
          : "border-[color:var(--border-soft)] bg-white/5 text-[color:var(--text-faint)]"
      }`}
    >
      {children}
    </span>
  );
}
