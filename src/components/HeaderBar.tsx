import React from 'react';
import {
  Shield,
  Play,
  RefreshCw,
  FlaskConical,
  Zap,
  Wrench,
  LayoutDashboard,
  Terminal
} from 'lucide-react';
import { ScenarioSelector } from './ScenarioSelector';
import type { Scenario } from '../types/scenario';

interface HeaderBarProps {
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  protectionMode: boolean;
  onToggleProtection: () => void;
  onRunAudit: () => void;
  isAuditing: boolean;
  onOpenRegression: () => void;
  onOpenAdaptive?: () => void;
  onOpenPermissions?: () => void;
  activeTab?: 'dashboard' | 'workspace';
  onChangeTab?: (tab: 'dashboard' | 'workspace') => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  protectionMode,
  onToggleProtection,
  onRunAudit,
  isAuditing,
  onOpenRegression,
  onOpenAdaptive,
  onOpenPermissions,
  activeTab = 'workspace',
  onChangeTab,
}) => {
  return (
    <header className="relative z-50 h-14 flex-shrink-0 border-b border-zinc-800/60 bg-zinc-950/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Left: Brand Identity & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700/60 bg-zinc-900 text-zinc-200">
            <Shield className="h-3.5 w-3.5 text-zinc-200" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              AgentBreak
            </span>
            <span className="hidden font-mono text-[10px] text-zinc-500 sm:inline-block">
              /
            </span>
            <span className="hidden rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline-block">
              Deterministic Security Eval
            </span>
          </div>

          {/* View Switcher: Command Center vs Live Audit Workspace */}
          {onChangeTab && (
            <div className="hidden md:flex items-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-0.5 ml-2">
              <button
                type="button"
                onClick={() => onChangeTab('dashboard')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Security Evaluation Dashboard Command Center"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Command Center</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeTab('workspace')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  activeTab === 'workspace'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Live Execution Trace & Policy Interception"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Live Audit</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Controls: Scenario Selector Dropdown + Permissions + Adaptive Scan + Regression Suite + Protection Toggle + Run Audit Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Scenario Selector Component (Block 2) */}
          <ScenarioSelector
            scenarios={scenarios}
            selectedScenario={selectedScenario}
            onSelectScenario={onSelectScenario}
          />

          {/* Excessive Agency / Tool & Permission Auditing Button */}
          {onOpenPermissions && (
            <button
              type="button"
              onClick={onOpenPermissions}
              className="flex h-8 items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition active:scale-[0.98]"
              title="Tool and Permission Auditing (Excessive Agency)"
            >
              <Wrench className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Permissions</span>
              <span className="sm:hidden">Perms</span>
            </button>
          )}

          {/* Feature 1: Autonomous Attack Discovery / Adaptive Scan Button */}
          {onOpenAdaptive && (
            <button
              type="button"
              onClick={onOpenAdaptive}
              className="flex h-8 items-center gap-1.5 rounded-md border border-amber-600/60 bg-amber-500/10 px-2.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 hover:border-amber-500 transition active:scale-[0.98]"
              title="Feature 1: Autonomous Attack Discovery (Adaptive Mutator)"
            >
              <Zap className="h-3.5 w-3.5 fill-current text-amber-400" />
              <span className="hidden sm:inline">Adaptive Scan</span>
              <span className="sm:hidden">Adaptive</span>
            </button>
          )}

          {/* Block 5: Run Regression Suite Button */}
          <button
            type="button"
            onClick={onOpenRegression}
            className="flex h-8 items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition active:scale-[0.98]"
            title="Open Regression Testing Suite Matrix"
          >
            <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Run Regression Suite</span>
            <span className="sm:hidden">Regression</span>
          </button>

          {/* Protection Mode Toggle Switch */}
          <div className="flex items-center gap-2 rounded-md border border-zinc-800/80 bg-zinc-900/80 px-2.5 py-1">
            <span className="hidden text-[11px] font-medium text-zinc-400 md:inline-block">
              Protection Mode
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={protectionMode}
              onClick={onToggleProtection}
              className="flex items-center gap-1.5 focus:outline-none"
              title="Toggle Policy Firewall"
            >
              <div
                className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                  protectionMode ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    protectionMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
              <span
                className={`font-mono text-[11px] font-semibold tracking-wider ${
                  protectionMode ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {protectionMode ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* High-Emphasis "Run Audit" Button (Linear/Vercel aesthetic) */}
          <button
            type="button"
            onClick={onRunAudit}
            disabled={isAuditing}
            className={`group relative flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition active:scale-[0.98] ${
              isAuditing
                ? 'cursor-wait bg-zinc-300 text-zinc-900'
                : 'bg-zinc-100 text-zinc-950 hover:bg-white hover:text-black'
            }`}
          >
            {isAuditing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-zinc-900" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current text-zinc-900" />
                <span>Run Audit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
