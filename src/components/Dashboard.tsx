import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Unlock,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Activity,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';

export interface ScenarioOverviewItem {
  id: string;
  name: string;
  owaspCategory: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  targetTool: string;
  description: string;
}

const ATTACK_SCENARIOS: ScenarioOverviewItem[] = [
  {
    id: 'sc-rag',
    name: 'Indirect RAG Poisoning',
    owaspCategory: 'LLM01 - Prompt Injection',
    severity: 'CRITICAL',
    targetTool: 'read_file(path: "secret_passwords.txt")',
    description: 'Document injection embedding malicious instructions into vector knowledge context.',
  },
  {
    id: 'sc-agency',
    name: 'Excessive Tool Agency',
    owaspCategory: 'LLM06 - Excessive Agency',
    severity: 'HIGH',
    targetTool: 'delete_database_records()',
    description: 'Agent executes destructive mutations without human authorization boundary.',
  },
  {
    id: 'sc-memory',
    name: 'Memory Context Pollution',
    owaspCategory: 'LLM08 - Vector Context Pollution',
    severity: 'HIGH',
    targetTool: 'read_restricted_files()',
    description: 'Persistent conversation state injected with privileged credential exfiltration triggers.',
  },
];

interface DashboardProps {
  isSecured?: boolean;
  onToggleSecured?: (secured: boolean) => void;
  onSelectScenarioRow?: (scenarioName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isSecured: controlledSecured,
  onToggleSecured,
  onSelectScenarioRow,
}) => {
  // Support both controlled and uncontrolled state
  const [internalSecured, setInternalSecured] = useState<boolean>(false);
  const isSecured = controlledSecured !== undefined ? controlledSecured : internalSecured;

  const handleToggle = () => {
    const nextState = !isSecured;
    if (onToggleSecured) {
      onToggleSecured(nextState);
    } else {
      setInternalSecured(nextState);
    }
  };

  // 1. Shifted Mock Data based on isSecured state (Requirement 1)
  const exploitRate = isSecured ? 0 : 100;
  const defenseScore = isSecured ? 94 : 12;
  const criticalThreats = isSecured ? 0 : 3;
  const highThreats = isSecured ? 0 : 2;
  const mediumThreats = 0;

  // SVG Circular progress math
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (defenseScore / 100) * circumference;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 text-zinc-100 p-4 sm:p-6 space-y-6 select-none font-sans antialiased">
      {/* =========================================================================
          1. HEADER & INTERACTIVE TOGGLE (Requirement 4)
      ========================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-200 shadow-md">
            <Activity className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-zinc-100">
                Security Evaluation Command Center
              </h1>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Continuous agent risk scoring, exploit exposure analysis, and defense validation.
            </p>
          </div>
        </div>

        {/* Sleek Interactive Toggle: "Unprotected" vs "Secured State" (Requirement 4) */}
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 p-1.5 shadow-sm">
          <div className="flex items-center gap-2 px-2">
            {isSecured ? (
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Unlock className="h-3.5 w-3.5 text-rose-400" />
            )}
            <span className="font-mono text-[11px] font-semibold text-zinc-300">
              {isSecured ? 'Secured State' : 'Unprotected'}
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isSecured}
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isSecured ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
            title="Toggle Unprotected vs Secured State"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                isSecured ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. TOP KPI SUMMARY CARDS (Grid 3 Columns - Requirement 2)
      ========================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1: Exploit Success Rate */}
        <div className="relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Exploit Success Rate
            </span>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                isSecured
                  ? 'border-emerald-900/50 bg-emerald-950/40 text-emerald-400'
                  : 'border-rose-900/50 bg-rose-950/40 text-rose-400'
              }`}
            >
              {isSecured ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-3">
            {/* Show Red 100% or Green 0% */}
            <span
              className={`font-mono text-3xl font-extrabold tracking-tight transition-colors duration-300 ${
                isSecured ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {exploitRate}%
            </span>
            <span
              className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                isSecured ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSecured ? (
                <>
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>100% Defended</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Critical Exposure</span>
                </>
              )}
            </span>
          </div>

          <div className="border-t border-zinc-800/80 pt-2 text-[11px] text-zinc-400">
            {isSecured ? (
              <span className="text-emerald-400/90 font-mono">
                ● Policy Firewall enforcing tool allowlist
              </span>
            ) : (
              <span className="text-rose-400/90 font-mono">
                ● Zero inspection active — all exploits execute
              </span>
            )}
          </div>
        </div>

        {/* CARD 2: Vulnerability Severity Breakdown */}
        <div className="relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Vulnerability Breakdown
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>

          {/* Clean pill badges for CRITICAL, HIGH, MEDIUM */}
          <div className="my-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                criticalThreats > 0
                  ? 'border-rose-800/80 bg-rose-950/60 text-rose-300 shadow-sm'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  criticalThreats > 0 ? 'bg-rose-400 animate-pulse' : 'bg-zinc-600'
                }`}
              />
              <span>{criticalThreats} CRITICAL</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                highThreats > 0
                  ? 'border-amber-800/80 bg-amber-950/60 text-amber-300 shadow-sm'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  highThreats > 0 ? 'bg-amber-400' : 'bg-zinc-600'
                }`}
              />
              <span>{highThreats} HIGH</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 font-mono text-xs font-medium text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-zinc-600" />
              <span>{mediumThreats} MEDIUM</span>
            </span>
          </div>

          <div className="border-t border-zinc-800/80 pt-2 text-[11px] text-zinc-400">
            {isSecured ? (
              <span className="font-mono text-emerald-400">
                ✓ 5 of 5 threats neutralized by policy
              </span>
            ) : (
              <span className="font-mono text-rose-400">
                ⚠ 5 active unprotected attack vectors
              </span>
            )}
          </div>
        </div>

        {/* CARD 3: Defense Effectiveness Score */}
        <div className="relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Defense Effectiveness
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400">
              <Shield className="h-4 w-4" />
            </div>
          </div>

          {/* Circular Progress & Bar Indicator */}
          <div className="my-2 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-mono text-3xl font-extrabold tracking-tight transition-colors duration-300 ${
                    isSecured ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {defenseScore}%
                </span>
                <span className="font-mono text-xs text-zinc-400">/ 100</span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                {isSecured
                  ? 'Strong policy enforcement & permission isolation'
                  : 'Vulnerable configuration — zero policy filtering'}
              </p>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r={circleRadius}
                  className="stroke-zinc-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={circleRadius}
                  className={`transition-all duration-700 ease-out ${
                    isSecured ? 'stroke-emerald-400' : 'stroke-rose-500'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute font-mono text-[11px] font-bold text-zinc-200">
                {defenseScore}%
              </div>
            </div>
          </div>

          {/* Simple Linear Progress Bar Indicator */}
          <div className="mt-1 border-t border-zinc-800/80 pt-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full transition-all duration-700 ease-out ${
                  isSecured ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
                style={{ width: `${defenseScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. ATTACK PATH & SCENARIO OVERVIEW TABLE (Requirement 3)
      ========================================================================== */}
      <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 shadow-sm overflow-hidden flex flex-col">
        {/* Table Title Bar */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-zinc-800/80 px-5 py-3.5 bg-zinc-950/90">
          <div className="flex items-center gap-2.5">
            <Layers className="h-4 w-4 text-zinc-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Attack Path & Scenario Overview
            </h3>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
              3 Evaluated Vectors
            </span>
          </div>

          <span className="text-[11px] font-mono text-zinc-500">
            Click row to inspect live execution trace
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-[11px] font-mono text-zinc-400">
                <th className="py-2.5 px-4 font-semibold">Scenario Name</th>
                <th className="py-2.5 px-4 font-semibold">OWASP Category</th>
                <th className="py-2.5 px-4 font-semibold">Target Tool Vector</th>
                <th className="py-2.5 px-4 font-semibold">Severity</th>
                <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                <th className="py-2.5 px-3 font-semibold text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {ATTACK_SCENARIOS.map((item) => {
                const isMitigated = isSecured;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectScenarioRow?.(item.name)}
                    className="group cursor-pointer hover:bg-zinc-900/70 transition-colors duration-150"
                  >
                    {/* Scenario Name & Description */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-100 group-hover:text-white transition flex items-center gap-2">
                        <span>{item.name}</span>
                        {isSecured ? (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 opacity-80" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 opacity-80" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-zinc-400 leading-snug">
                        {item.description}
                      </p>
                    </td>

                    {/* OWASP Category */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-300">
                      <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5">
                        {item.owaspCategory}
                      </span>
                    </td>

                    {/* Target Tool Vector */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1.5 truncate max-w-xs">
                        <Terminal className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                        <span className="text-zinc-300 truncate">{item.targetTool}</span>
                      </div>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3.5 px-4">
                      {item.severity === 'CRITICAL' ? (
                        <span className="inline-flex items-center gap-1 rounded border border-rose-800/70 bg-rose-950/60 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">
                          CRITICAL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded border border-amber-800/70 bg-amber-950/60 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                          HIGH
                        </span>
                      )}
                    </td>

                    {/* Status: Red "Vulnerable" vs Green "Mitigated" (Requirement 1 & 3) */}
                    <td className="py-3.5 px-4 text-right">
                      {isMitigated ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/80 bg-emerald-950/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Mitigated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-800/80 bg-rose-950/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-300 shadow-sm animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                          Vulnerable
                        </span>
                      )}
                    </td>

                    {/* Action Arrow Icon */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center text-zinc-500 group-hover:text-zinc-200 transition">
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="flex h-10 flex-shrink-0 items-center justify-between border-t border-zinc-800/80 bg-zinc-950 px-5 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Security Posture:</span>
            <span className={isSecured ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {isSecured ? 'Policy-Enforced Lockdown Active' : 'Unfiltered Agent Boundary Detected'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-500">
            <Zap className="h-3 w-3 text-amber-400" />
            <span>Interactive Defense Matrix</span>
          </div>
        </div>
      </div>
    </div>
  );
};
