import React from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import type { Scenario, AgentProfile } from '../types/scenario';
import { formatToolCall } from '../types/scenario';
import { evaluatePolicy } from '../services/policyEngine';

interface FirewallViewProps {
  scenario: Scenario;
  agent?: AgentProfile;
  protectionMode: boolean;
  onToggleProtection: () => void;
  onReplayAgainstDefenses?: () => void;
}

export const FirewallView: React.FC<FirewallViewProps> = ({
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
  onToggleProtection,
  onReplayAgainstDefenses,
}) => {
  const isAdversarial = scenario.type === 'adversarial';
  const formattedCall = formatToolCall(scenario);
  const targetPath = scenario.toolArgs?.path;

  // Real-time evaluation through policyEngine
  const currentEval = evaluatePolicy(
    scenario.targetTool,
    scenario.toolArgs,
    protectionMode
  );

  const unprotectedEval = evaluatePolicy(scenario.targetTool, scenario.toolArgs, false);
  const protectedEval = evaluatePolicy(scenario.targetTool, scenario.toolArgs, true);

  // Mitigation status badge
  const isMitigated = protectionMode && !currentEval.allowed && isAdversarial;
  const isLoophole = protectionMode && currentEval.allowed && isAdversarial;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 text-zinc-100 p-6 space-y-6 select-none font-sans antialiased">
      {/* 1. Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-wisteria-300/30 bg-wisteria-dim text-wisteria shadow-[0_0_20px_rgba(211,211,255,0.12)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                Runtime Firewall Interceptor
              </h1>
              <span className="rounded-md border border-wisteria-300/30 bg-wisteria-dim px-2 py-0.5 font-mono text-[10px] font-semibold text-wisteria">
                Policy Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Deterministic runtime boundary validation, path allowlist enforcement, and exploit interception.
            </p>
          </div>
        </div>

        {/* Global Protection Toggle */}
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-2 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-2">
            {protectionMode ? (
              <Lock className="h-4 w-4 text-wisteria" />
            ) : (
              <Unlock className="h-4 w-4 text-cherry" />
            )}
            <div className="text-left font-mono text-xs">
              <span className="block font-semibold text-zinc-200">
                {protectionMode ? 'Policy Firewall ACTIVE' : 'Policy Firewall INACTIVE'}
              </span>
              <span
                className={`block text-[10px] ${
                  protectionMode ? 'text-wisteria' : 'text-cherry'
                }`}
              >
                {protectionMode ? 'Allowlist Enforced' : 'Unfiltered Bypass'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={protectionMode}
            onClick={onToggleProtection}
            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ${
              protectionMode ? 'bg-wisteria' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow-sm transition duration-200 mt-0.5 ml-0.5 ${
                protectionMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Runtime Interception Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              protectionMode
                ? 'border-wisteria-300/40 bg-wisteria-dim text-wisteria'
                : 'border-cherry-300/40 bg-cherry-dim text-cherry'
            }`}
          >
            {protectionMode ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-200">
                Target: {formattedCall} ({agent.name}){targetPath ? ` [Path: ${targetPath}]` : ''}
              </span>
              {isMitigated && (
                <span className="inline-flex items-center gap-1 rounded-full border border-wisteria-300/40 bg-wisteria-dim px-2.5 py-0.5 font-mono text-[10px] font-bold text-wisteria shadow-[0_0_10px_rgba(211,211,255,0.1)]">
                  <CheckCircle2 className="h-3 w-3" />
                  Mitigated Successfully
                </span>
              )}
              {isLoophole && (
                <span className="inline-flex items-center gap-1 rounded-full border border-cherry-300/40 bg-cherry-dim px-2.5 py-0.5 font-mono text-[10px] font-bold text-cherry animate-pulse">
                  <AlertTriangle className="h-3 w-3" />
                  Loophole Detected!
                </span>
              )}
            </div>
            <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
              Verdict: {currentEval.allowed ? 'ALLOWED (Pass-through)' : 'BLOCKED (Firewall Intercepted)'} — {currentEval.reason}
            </p>
          </div>
        </div>

        {onReplayAgainstDefenses && (
          <button
            type="button"
            onClick={onReplayAgainstDefenses}
            className="flex items-center gap-1.5 rounded-lg border border-wisteria-300/40 bg-wisteria-dim px-3 py-1.5 font-mono text-xs font-semibold text-wisteria hover:bg-wisteria hover:text-zinc-950 transition active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Replay With Defenses</span>
          </button>
        )}
      </div>

      {/* 3. Policy Rules Engine Specification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-200 mb-2">
            <span className="h-2 w-2 rounded-full bg-wisteria" />
            <span>RULE 1: Path Allowlist</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            Only paths under <code className="text-wisteria">/public/</code> or files named <code className="text-wisteria">public_*.txt</code> are permitted. All others are blocked.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-200 mb-2">
            <span className="h-2 w-2 rounded-full bg-cherry" />
            <span>RULE 2: Sensitive File Sandbox</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            Direct access to credentials (<code className="text-cherry">secret_passwords.txt</code>, private keys) triggers immediate firewall halt when Protection is ON.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-200 mb-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>RULE 3: Supervisor Gate</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            Destructive database mutations or unrestricted external dispatch require supervisor authorization tokens.
          </p>
        </div>
      </div>

      {/* 4. Side-by-Side Before vs. After Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Unprotected State (Before) */}
        <div className="rounded-xl border border-cherry-300/30 bg-zinc-900/40 backdrop-blur-sm p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Unlock className="h-4 w-4 text-cherry" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Unprotected Agent (Before)
                </h3>
              </div>
              <span className="rounded border border-cherry-300/40 bg-cherry-dim px-2 py-0.5 font-mono text-[10px] font-bold text-cherry">
                {isAdversarial ? 'Action Permitted ❌' : 'Clean Action ⚪'}
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3">
                <span className="text-[10px] text-zinc-500 block mb-1">DISPATCHED TOOL CALL:</span>
                <span className="text-zinc-200 font-semibold">{formattedCall}</span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3">
                <span className="text-[10px] text-zinc-500 block mb-1">FIREWALL INSPECTION:</span>
                <span className="text-cherry">Zero inspection active. Security policies bypassed.</span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3">
                <span className="text-[10px] text-zinc-500 block mb-1">IMPACT VERDICT:</span>
                <span className="text-cherry font-semibold">
                  {isAdversarial ? `Adversarial exploit executed. Data exfiltration possible.` : 'Benign operation executed without firewall overhead.'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 font-mono text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Result: {unprotectedEval.reason}</span>
            <span className="text-cherry font-bold">{isAdversarial ? 'BREACH CONFIRMED' : 'SAFE PASS'}</span>
          </div>
        </div>

        {/* Policy-Hardened State (After) */}
        <div className="rounded-xl border border-wisteria-300/30 bg-zinc-900/40 backdrop-blur-sm p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-wisteria" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Policy-Hardened Agent (After)
                </h3>
              </div>
              <span className="rounded border border-wisteria-300/40 bg-wisteria-dim px-2 py-0.5 font-mono text-[10px] font-bold text-wisteria shadow-[0_0_10px_rgba(211,211,255,0.12)]">
                {isAdversarial ? 'Blocked by Policy ✅' : 'Verified Safe ✅'}
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3">
                <span className="text-[10px] text-zinc-500 block mb-1">INTERCEPTED TOOL CALL:</span>
                <span className="text-wisteria font-semibold">{formattedCall}</span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3">
                <span className="text-[10px] text-zinc-500 block mb-1">FIREWALL ENFORCEMENT:</span>
                <span className="text-wisteria">
                  {isAdversarial ? `Intercepted: ${protectedEval.reason}` : 'Allowlist verified. Operation confirmed harmless.'}
                </span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3">
                <span className="text-[10px] text-zinc-500 block mb-1">DEFENSE VERDICT:</span>
                <span className="text-wisteria font-semibold">
                  {isAdversarial ? 'Threat Neutralized prior to tool execution.' : 'Clean execution authorized by security engine.'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 font-mono text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Result: {protectedEval.reason}</span>
            <span className="text-wisteria font-bold">100% DEFENDED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
