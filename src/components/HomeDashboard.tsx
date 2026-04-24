import type { AccountWithUsage, CodexProcessInfo } from "../types";
import type { SortMode } from "../types/ui";
import { ChevronDownIcon, EyeIcon, EyeOffIcon, RefreshIcon } from "./icons";
import { AccountCard } from "./AccountCard";
import { MetricCard, SectionHeading, StatePanel, ToolbarActionButton } from "./ui";

interface HomeDashboardProps {
  title: string;
  heading: string;
  description: string;
  accounts: AccountWithUsage[];
  activeAccount?: AccountWithUsage;
  otherAccounts: AccountWithUsage[];
  sortedOtherAccounts: AccountWithUsage[];
  loading: boolean;
  error: string | null;
  processInfo: CodexProcessInfo | null;
  hasRunningProcesses: boolean;
  activeAccountMasked: boolean;
  attentionCount: number;
  switchingId: string | null;
  isRefreshing: boolean;
  isWindowMaximized: boolean;
  allMasked: boolean;
  restartSwitchEnabled: boolean;
  maskedAccounts: Set<string>;
  otherAccountsSort: SortMode;
  onSortChange: (sort: SortMode) => void;
  onRefresh: () => void;
  onReloadWorkspace: () => void;
  onSwitch: (accountId: string) => void;
  onDelete: (accountId: string) => void;
  onRename: (accountId: string, newName: string) => Promise<void>;
  onToggleMaskAll: () => void;
}

export function HomeDashboard({
  title,
  heading,
  description,
  accounts,
  activeAccount,
  otherAccounts,
  sortedOtherAccounts,
  loading,
  error,
  processInfo,
  hasRunningProcesses,
  activeAccountMasked,
  attentionCount,
  switchingId,
  isRefreshing,
  isWindowMaximized,
  allMasked,
  restartSwitchEnabled,
  maskedAccounts,
  otherAccountsSort,
  onSortChange,
  onRefresh,
  onReloadWorkspace,
  onSwitch,
  onDelete,
  onRename,
  onToggleMaskAll,
}: HomeDashboardProps) {
  if (loading && accounts.length === 0) {
    return (
      <StatePanel
        eyebrow="Loading"
        title="Pulling account state"
        description="We're loading saved accounts and refreshing their usage windows."
        loading
      />
    );
  }

  if (error) {
    return (
      <StatePanel
        eyebrow="Load error"
        title="Failed to load accounts"
        description={error}
        tone="danger"
        action={
          <button type="button" onClick={onReloadWorkspace} className="toolbar-button">
            <RefreshIcon className="h-4 w-4" />
            Refresh again
          </button>
        }
      />
    );
  }

  if (accounts.length === 0) {
    return (
      <StatePanel
        eyebrow="Fresh workspace"
        title="No accounts yet"
        description="Use the Add account button in the left panel to start tracking limits and switching cleanly."
      />
    );
  }

  return (
    <div className="space-y-5">
      <section
        aria-label="Home summary"
        className="pinned-dashboard-summary sticky top-0 z-30 -mx-4 -mt-4 px-4 pb-4 pt-4 md:-mx-5 md:-mt-5 md:px-5 md:pt-5 xl:-mx-8 xl:-mt-8 xl:px-8 xl:pt-8"
      >
        <div className="summary-shell">
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="section-kicker">{title}</div>
              <h2 className="mt-2 text-[1.58rem] font-semibold tracking-[-0.05em] text-[color:var(--text-strong)] lg:text-[1.85rem]">
                {heading}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ToolbarActionButton
                title={allMasked ? "Reveal all identities" : "Hide all identities"}
                label={allMasked ? "Reveal" : "Hide"}
                icon={
                  allMasked ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />
                }
                onClick={onToggleMaskAll}
                disabled={accounts.length === 0}
              />
              <ToolbarActionButton
                title="Refresh account usage"
                label={isRefreshing ? "Refreshing" : "Refresh"}
                icon={<RefreshIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />}
                onClick={onRefresh}
                disabled={isRefreshing}
                className="summary-refresh-button"
              />
            </div>
          </div>

          <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total accounts"
              value={String(accounts.length)}
              note="stored in your local switcher workspace"
              compact
              tone="nested"
            />
            <MetricCard
              label="Active account"
              value={activeAccount ? (activeAccountMasked ? "Hidden" : activeAccount.name) : "None"}
              note={
                activeAccountMasked
                  ? "identity hidden"
                  : activeAccount?.email
                    ? activeAccount.email
                    : activeAccount
                      ? "ready but email hidden"
                      : "select an account to activate"
              }
              compact
              tone="nested"
            />
            <MetricCard
              label="Switch status"
              value={
                processInfo
                  ? hasRunningProcesses
                    ? restartSwitchEnabled
                      ? "Restart"
                      : "Locked"
                    : "Ready"
                  : "Checking"
              }
              note={
                processInfo
                  ? hasRunningProcesses
                    ? restartSwitchEnabled
                      ? "switching will close and reopen Codex"
                      : "enable restart switching or close Codex"
                    : "safe to activate another account"
                  : "querying live process state"
              }
              compact
              tone="nested"
            />
            <MetricCard
              label="Attention"
              value={attentionCount > 0 ? String(attentionCount) : "Clear"}
              note={
                attentionCount > 0
                  ? "accounts with low remaining limits or usage errors"
                  : "no low-limit or error accounts detected"
              }
              compact
              tone="nested"
            />
          </div>
        </div>
      </section>

      {activeAccount && (
        <section className="pt-8 md:pt-10 xl:pt-12">
          <AccountCard
            account={activeAccount}
            onSwitch={() => {}}
            onDelete={() => onDelete(activeAccount.id)}
            onRename={(newName) => onRename(activeAccount.id, newName)}
            switching={switchingId === activeAccount.id}
            switchDisabled={hasRunningProcesses}
            restartSwitchEnabled={restartSwitchEnabled}
            masked={maskedAccounts.has(activeAccount.id)}
            featured
          />
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <SectionHeading
            eyebrow="Standby accounts"
            title={`Other accounts (${otherAccounts.length})`}
          />
          {otherAccounts.length > 0 && (
            <label className="flex items-center gap-3 text-sm text-[color:var(--text-muted)]">
              <span className="font-medium">Sort</span>
              <span className="relative inline-flex min-w-[240px] items-center">
                <select
                  value={otherAccountsSort}
                  onChange={(event) => onSortChange(event.target.value as SortMode)}
                  className="select-shell appearance-none pr-10"
                >
                  <option value="deadline_asc">Reset: earliest to latest</option>
                  <option value="deadline_desc">Reset: latest to earliest</option>
                  <option value="remaining_desc">% remaining: highest to lowest</option>
                  <option value="remaining_asc">% remaining: lowest to highest</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-4 h-4 w-4 text-[color:var(--text-faint)]" />
              </span>
            </label>
          )}
        </div>

        {otherAccounts.length > 0 ? (
          <div
            className={`standby-account-grid ${
              isWindowMaximized ? "standby-account-grid-maximized" : ""
            }`}
          >
            {sortedOtherAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onSwitch={() => onSwitch(account.id)}
                onDelete={() => onDelete(account.id)}
                onRename={(newName) => onRename(account.id, newName)}
                switching={switchingId === account.id}
                switchDisabled={hasRunningProcesses}
                restartSwitchEnabled={restartSwitchEnabled}
                masked={maskedAccounts.has(account.id)}
              />
            ))}
          </div>
        ) : (
          <div className="panel-surface rounded-[26px] p-6 text-sm leading-6 text-[color:var(--text-muted)]">
            There are no standby accounts yet. Add another account from the sidebar or switch to
            Settings to import/export profiles.
          </div>
        )}
      </section>
    </div>
  );
}
