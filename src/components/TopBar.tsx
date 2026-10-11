import React from 'react';
import {
  Play,
  RefreshCw,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';
import { ScenarioSelector } from './ScenarioSelector';
import type { Scenario } from '../types/scenario';
import type { NavView } from '../types/navigation';

interface TopBarProps {
  activeView: NavView;
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  protectionMode: boolean;
  onToggleProtection: () => void;
  onRunAudit: () => void;
  isAuditing: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  scenarios,
  selectedScenario,
  onSelectScenario,
  protectionMode,
  onToggleProtection,
  onRunAudit,
  isAuditing,
}) => {
  const viewTitles: Record<NavView, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Command Center',
      subtitle: 'Posture KPIs & Threat Score',
    },
    owasp: {
      title: 'OWASP Matrix',
      subtitle: 'LLM01 - LLM10 Taxonomy Breakdown',
    },
    regression: {
      title: 'Regression Suite',
      subtitle: 'Automated Continuous Verification',
    },
    trace: {
      title: 'Trace Execution',
      subtitle: '4-Stage Live Pipeline',
    },
    firewall: {
      title: 'Firewall Interceptor',
      subtitle: 'Runtime Policy & Before vs. After',
    },
    mutator: {
      title: 'Autonomous Mutator',
      subtitle: 'Adaptive Attack Loop Generator',
    },
    quarantine: {
      title: 'Incident Quarantine',
      subtitle: 'SOC Alerts & Threat Feeds',
    },
    permissions: {
      title: 'Permissions Auditor',
      subtitle: 'Tool Privilege & PoLP Scope',
    },
  };

  const currentMeta = viewTitles[activeView] || {
    title: 'Security Workspace',
    subtitle: 'Agent Telemetry',
  };

  return (
    <header className="relative z-30 flex h-14 w-full flex-shrink-0 items-center justify-between border-b border-zinc-800/60 bg-[#0d1117]/90 px-6 backdrop-blur-md select-none">
      {/* Left: Breadcrumbs & Current View Title */}
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-xs text-zinc-500">AgentBreak</span>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
        <span className="font-mono text-xs font-semibold text-zinc-200">
          {currentMeta.title}
        </span>
        <span className="hidden md:inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
          {currentMeta.subtitle}
        </span>
      </div>

      {/* Right Controls: Scenario Selector + Run Audit + Global Protection */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Scenario Selector Dropdown */}
        <ScenarioSelector
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          onSelectScenario={onSelectScenario}
        />

        {/* Protection Mode Toggle */}
        <button
          type="button"
          onClick={onToggleProtection}
          className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition cursor-pointer active:scale-[0.98] ${
            protectionMode
              ? 'border-wisteria-300/40 bg-wisteria-dim text-wisteria hover:border-wisteria-300/60'
              : 'border-cherry-300/40 bg-cherry-dim text-cherry hover:border-cherry-300/60'
          }`}
          title="Toggle Global Policy Firewall"
        >
          {protectionMode ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Unlock className="h-3 w-3" />
          )}
          <span className="hidden sm:inline font-mono text-[11px] font-semibold">
            {protectionMode ? 'Shield ON' : 'Shield OFF'}
          </span>
        </button>

        {/* Run Audit Action Button */}
        <button
          type="button"
          onClick={onRunAudit}
          disabled={isAuditing}
          className={`flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold transition shadow-sm cursor-pointer active:scale-[0.98] ${
            isAuditing
              ? 'cursor-wait border border-zinc-700 bg-zinc-800 text-zinc-400'
              : 'border border-wisteria-300/50 bg-wisteria text-zinc-950 hover:bg-white shadow-[0_0_15px_rgba(211,211,255,0.2)]'
          }`}
          title="Sequentially trace and audit selected scenario"
        >
          {isAuditing ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-zinc-400" />
              <span>Auditing...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Run Audit</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
