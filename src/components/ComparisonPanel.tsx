import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  FileKey,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Columns
} from 'lucide-react';
import { type Scenario, type AgentProfile, formatToolCall } from '../types/scenario';
import { evaluatePolicy } from '../services/policyEngine';

interface ComparisonPanelProps {
  scenario: Scenario;
  agent?: AgentProfile;
  protectionMode: boolean;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  scenario,
  agent = {
    id: 'support_agent',
    name: 'Customer Support Agent',
    allowed_tools: ['read_public_notes', 'read_public_faq'],
    restricted_tools: [
      'read_file',
      'delete_db',
      'read_restricted_files',
      'read_employee_records',
    ],
  },
  protectionMode,
}) => {
  const [viewLayout, setViewLayout] = useState<'split' | 'unprotected' | 'protected'>('split');

  const isAdversarial = scenario.type === 'adversarial';
  const formattedCall = formatToolCall(scenario);
  const targetPath = scenario.toolArgs?.path;

  // Evaluate outcomes through the Security Policy Engine
  const unprotectedEval = evaluatePolicy(scenario.targetTool, scenario.toolArgs, false);
  const protectedEval = evaluatePolicy(scenario.targetTool, scenario.toolArgs, true);

  // Unprotected comparison outcome data
  const unprotected = {
    title: 'Unprotected Agent (Before)',
    statusBadge: isAdversarial ? 'Action Executed ❌' : 'Action Executed ⚪',
    isVulnerable: isAdversarial,
    toolAction: `${formattedCall} dispatched with zero firewall inspection`,
    outcomeSummary: isAdversarial
      ? targetPath
        ? `Adversarial prompt bypassed firewall. Private file "${targetPath}" was accessed and credentials exfiltrated.`
        : `${scenario.description} Unauthorized operation permitted.`
      : `${scenario.description} Routine operation executed.`,
    impactLevel: isAdversarial ? 'Critical Breach' : 'None',
    dataExfiltration: isAdversarial
      ? targetPath
        ? `Exfiltrated: ${targetPath}`
        : 'Unauthorized Data Exfiltrated'
      : '0 Risk (Public Data)',
    logTrace: unprotectedEval.reason,
  };

  // Protected comparison outcome data
  const protectedData = {
    title: 'Policy-Hardened Agent (After)',
    statusBadge: isAdversarial ? 'Blocked by Policy ✅' : 'Action Allowed ✅',
    isSafe: true,
    firewallAction: isAdversarial
      ? `Intercepted: ${protectedEval.reason}`
      : 'Audited: Whitelisted in allowed_tools',
    outcomeSummary: isAdversarial
      ? targetPath
        ? `Attempted access to private file "${targetPath}" was intercepted prior to execution.`
        : `Tool '${scenario.targetTool}' is restricted for '${agent.id}'. Execution halted prior to dispatch.`
      : `Tool '${scenario.targetTool}' verified against allowlist. Clean execution dispatched.`,
    defenseStatus: isAdversarial ? 'Threat Neutralized' : 'Verified Safe',
    dataExfiltration: '0 Records Leaked',
    policyReason: protectedEval.reason,
  };

  // 1. Dynamic Mitigation Badges (Requirement 1)
  const renderMitigationBadge = () => {
    if (protectionMode) {
      if (isAdversarial) {
        if (!protectedEval.allowed) {
          // 🟢 "Mitigated Successfully": text-emerald-400 bg-emerald-400/10
          return (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs font-bold text-emerald-400 shadow-sm shadow-emerald-950/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20 animate-pulse" />
              <span>Mitigated Successfully 🟢</span>
            </div>
          );
        } else {
          // 🔴 "Loophole Detected!": text-rose-400 bg-rose-400/10
          return (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-400/10 px-3 py-1 font-mono text-xs font-bold text-rose-400 shadow-sm shadow-rose-950/20">
              <span className="h-2 w-2 rounded-full bg-rose-400 ring-4 ring-rose-500/20 animate-ping" />
              <span>Loophole Detected! 🔴</span>
            </div>
          );
        }
      } else {
        // Benign task under protection
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Policy Compliant (Safe) 🟢</span>
          </div>
        );
      }
    } else {
      // Protection is OFF
      if (isAdversarial) {
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-400/10 px-2.5 py-1 font-mono text-xs font-bold text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Firewall Inactive (Vulnerable) ❌</span>
          </div>
        );
      } else {
        return (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 font-mono text-xs font-medium text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            <span>Unchecked Dispatch (Benign)</span>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
      {/* Panel Header */}
      <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-zinc-800/60 px-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-200">
            Defense Validation — Comparison
          </span>
          <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
            Policy Engine Diff
          </span>
        </div>

        {/* Layout Mode Segmented Control (Linear / Raycast Style) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setViewLayout('split')}
              className={`flex items-center gap-1 rounded px-2 py-0.5 transition ${
                viewLayout === 'split'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Side-by-side comparison"
            >
              <Columns className="h-3 w-3" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('unprotected')}
              className={`flex items-center gap-1 rounded px-2 py-0.5 transition ${
                viewLayout === 'unprotected'
                  ? 'bg-rose-950/80 text-rose-300 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-rose-300'
              }`}
              title="Focus on Unprotected state"
            >
              <Unlock className="h-3 w-3" />
              <span className="hidden sm:inline">Before</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('protected')}
              className={`flex items-center gap-1 rounded px-2 py-0.5 transition ${
                viewLayout === 'protected'
                  ? 'bg-emerald-950/80 text-emerald-300 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-emerald-300'
              }`}
              title="Focus on Protected state"
            >
              <Lock className="h-3 w-3" />
              <span className="hidden sm:inline">After</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Status Ribbon at Top of Panel (Requirement 1) */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-zinc-500 uppercase">
            Defense Outcome:
          </span>
          {renderMitigationBadge()}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-zinc-500">Active State:</span>
          <span
            className={`font-semibold ${
              protectionMode ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {protectionMode ? 'Firewall Active (ON)' : 'Firewall Bypassed (OFF)'}
          </span>
        </div>
      </div>

      {/* Main Content Area: Refined Comparison Layout (Linear/Raycast aesthetic) */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 gap-4 overflow-y-auto">
        <div
          className={`grid gap-4 flex-1 ${
            viewLayout === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* ---------------- CARD 1: Unprotected (Before / Breach) ---------------- */}
          {(viewLayout === 'split' || viewLayout === 'unprotected') && (
            <div
              className={`relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 ${
                !protectionMode
                  ? 'ring-1 ring-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'opacity-75'
              }`}
            >
              {/* Active Mode Pill Indicator */}
              {!protectionMode && (
                <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full border border-rose-600/60 bg-rose-950 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-300">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  <span>● Active Simulation</span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-rose-900/50 bg-rose-950/40 text-rose-400">
                      <Unlock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-100">
                        {unprotected.title}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-500">
                        Protection: OFF (Baseline)
                      </p>
                    </div>
                  </div>

                  <span className="rounded border border-rose-800/60 bg-rose-950/60 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-300">
                    {unprotected.statusBadge}
                  </span>
                </div>

                {/* Final Step Difference Highlight: Exploit Success ❌ */}
                <div className="mt-3.5 space-y-2.5">
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/30 p-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-rose-300 font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
                        <span>FINAL STEP: Exploit Success ❌</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-rose-400/80">
                        Unchecked Dispatch
                      </span>
                    </div>
                    <p className="mt-1 text-zinc-300 text-[11px] leading-relaxed">
                      {isAdversarial
                        ? `Tool ${formattedCall} dispatched with zero policy inspection. Sensitive resource "${targetPath || 'private_file'}" was accessed and exfiltrated.`
                        : `Tool ${formattedCall} executed without restriction.`}
                    </p>
                  </div>

                  <div className="rounded border border-zinc-800/60 bg-zinc-900/70 p-2.5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Execution State
                    </span>
                    <p className="mt-1 font-mono text-xs text-rose-300 font-semibold break-words">
                      {unprotected.toolAction}
                    </p>
                  </div>

                  <div className="rounded border border-zinc-800/60 bg-zinc-900/70 p-2.5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Outcome & Impact
                    </span>
                    <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                      {unprotected.outcomeSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact Metric & Trace */}
              <div className="mt-3.5 space-y-2 border-t border-zinc-800/80 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">Exfiltration Risk:</span>
                  <span className="font-mono text-[11px] font-bold text-rose-400 flex items-center gap-1">
                    {targetPath && <FileKey className="h-3 w-3" />}
                    {unprotected.dataExfiltration}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">Severity Level:</span>
                  <span className="font-mono text-[11px] font-semibold text-rose-400">
                    {unprotected.impactLevel}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- CARD 2: Protected (After / Defense) ---------------- */}
          {(viewLayout === 'split' || viewLayout === 'protected') && (
            <div
              className={`relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 ${
                protectionMode
                  ? 'ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'opacity-75'
              }`}
            >
              {/* Active Mode Pill Indicator */}
              {protectionMode && (
                <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full border border-emerald-600/60 bg-emerald-950 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>● Active Simulation</span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-900/50 bg-emerald-950/40 text-emerald-400">
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-100">
                        {protectedData.title}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-500">
                        Protection: ACTIVE (Policy Enforced)
                      </p>
                    </div>
                  </div>

                  <span className="rounded border border-emerald-800/60 bg-emerald-950/60 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                    {protectedData.statusBadge}
                  </span>
                </div>

                {/* Final Step Difference Highlight: Policy Block ✅ */}
                <div className="mt-3.5 space-y-2.5">
                  <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        <span>FINAL STEP: Policy Block ✅</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400/80">
                        Firewall Intercepted
                      </span>
                    </div>
                    <p className="mt-1 text-zinc-300 text-[11px] leading-relaxed">
                      {isAdversarial
                        ? `Security policy engine intercepted ${formattedCall}. ${protectedEval.reason}`
                        : `Allowlist verified ${formattedCall}. Clean authorized execution dispatched.`}
                    </p>
                  </div>

                  <div className="rounded border border-zinc-800/60 bg-zinc-900/70 p-2.5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Firewall Interception
                    </span>
                    <p className="mt-1 font-mono text-xs text-emerald-300 font-semibold break-words">
                      {protectedData.firewallAction}
                    </p>
                  </div>

                  <div className="rounded border border-zinc-800/60 bg-zinc-900/70 p-2.5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Enforcement Outcome
                    </span>
                    <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                      {protectedData.outcomeSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact Metric & Rule */}
              <div className="mt-3.5 space-y-2 border-t border-zinc-800/80 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">Data Exfiltration:</span>
                  <span className="font-mono text-[11px] font-bold text-emerald-400">
                    {protectedData.dataExfiltration}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">Defense State:</span>
                  <span className="font-mono text-[11px] font-semibold text-emerald-400">
                    {protectedData.defenseStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Delta Telemetry Row */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="border-r border-zinc-800 pr-2">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase">
                Active Policy Rule
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-400 truncate block">
                /public/ or public_*.txt
              </span>
            </div>
            <div className="border-r border-zinc-800 pr-2">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase">
                Target Tool Call
              </span>
              <span className="font-mono text-xs font-semibold text-zinc-200 truncate block px-1">
                {formattedCall}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-mono text-zinc-500 uppercase">
                Firewall State
              </span>
              <span
                className={`font-mono text-xs font-semibold ${
                  protectionMode ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {protectionMode ? '100% Enforced' : 'Disabled (Bypassed)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
