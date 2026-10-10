import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Code2,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import type { AdaptiveScanResult } from '../types/adaptiveScan.ts';

interface AdaptiveMutationTrailProps {
  scanResult: AdaptiveScanResult | null;
  isScanning?: boolean;
  onTriggerScan?: () => void;
  targetGoal?: string;
  protectionEnabled: boolean;
}

export const AdaptiveMutationTrail: React.FC<AdaptiveMutationTrailProps> = ({
  scanResult,
  isScanning = false,
  onTriggerScan,
  targetGoal = 'Read restricted file secret_passwords.txt',
  protectionEnabled,
}) => {
  const isEscalated = scanResult?.finalOutcome === 'ESCALATED';
  const isAllowed = scanResult?.finalOutcome === 'ALLOWED';

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 1. Header & Controls */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-zinc-800/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Autonomous Attack Discovery — Mutation Trail
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerScan && (
            <button
              type="button"
              onClick={onTriggerScan}
              disabled={isScanning}
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition active:scale-[0.98] ${
                isScanning
                  ? 'cursor-wait border-zinc-700 bg-zinc-800 text-zinc-400'
                  : 'border-amber-600/60 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500'
              }`}
            >
              <Zap className="h-3 w-3 fill-current text-amber-400" />
              <span>{isScanning ? 'Mutating Vectors...' : 'Run Adaptive Scan'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Goal Context Strip */}
      <div className="mb-3 flex flex-shrink-0 items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/70 px-3 py-1.5 text-[11px] font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="text-zinc-500">Target Objective:</span>
          <span className="font-semibold text-zinc-200 truncate">{targetGoal}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Firewall:</span>
          <span
            className={`font-semibold ${
              protectionEnabled ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {protectionEnabled ? 'ACTIVE (ENFORCED)' : 'INACTIVE (BYPASS)'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* 2. REQUIREMENT 3: Active Alert Banner 🚨 When ESCALATED */}
        {isEscalated && (
          <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/80 bg-gradient-to-r from-rose-950/95 via-amber-950/80 to-zinc-950 p-4 shadow-[0_0_28px_rgba(244,63,94,0.3)] ring-1 ring-amber-500/50">
            {/* Top Alert Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                </span>
                <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Security Alert: Persistent Attack Sequence Intercepted 🚨
                </span>
              </div>

              {/* Incident Response Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/90 bg-amber-500/20 px-3 py-1 font-mono text-[11px] font-bold text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.4)] backdrop-blur">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
                <span>Session Quarantined / Alert Dispatched to SOC 🛡️</span>
              </div>
            </div>

            {/* Escalation Summary Note */}
            <div className="mt-3 rounded-lg border border-amber-500/40 bg-zinc-950/80 p-2.5 text-xs font-mono text-amber-200 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                <Radio className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                <span>THREAT INTELLIGENCE SUMMARY</span>
              </div>
              <p className="text-zinc-200">
                {scanResult.escalationSummary ||
                  'Repeated bypass attempts detected. Anomaly threshold exceeded.'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-zinc-400 pt-2 border-t border-zinc-800">
                <span>
                  Outcome State:{' '}
                  <strong className="text-amber-300 font-bold">ESCALATED</strong>
                </span>
                <span>•</span>
                <span>
                  Total Permutations:{' '}
                  <strong className="text-zinc-200">{scanResult.totalAttempts}</strong>
                </span>
                <span>•</span>
                <span>
                  Policy Interceptions:{' '}
                  <strong className="text-emerald-400">100% BLOCKED</strong>
                </span>
                <span>•</span>
                <span>
                  Incident Status:{' '}
                  <strong className="text-rose-300">CRITICAL_CONTAINED</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Normal Completed Scan Banner (When ALLOWED / Protection OFF) */}
        {isAllowed && (
          <div className="rounded-xl border border-rose-800/70 bg-zinc-950/90 p-3.5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-bold text-zinc-100">
                  Unprotected Scan: Permutation Executed Immediately
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded border border-rose-800/80 bg-rose-950/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-300">
                Firewall Inactive / Action Allowed ⚠️
              </span>
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">
              Protection mode was disabled. Strategy 1 bypassed the perimeter with zero inspection.
            </p>
          </div>
        )}

        {/* 3. The Mutation Trail Steps */}
        {scanResult && scanResult.mutationTrail.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                Mutation Trail Trail ({scanResult.mutationTrail.length} Attempts)
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                Scan ID: {scanResult.scanId}
              </span>
            </div>

            <div className="relative pl-6 space-y-3 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-zinc-800">
              {scanResult.mutationTrail.map((step) => {
                const isStepBlocked = step.policyResult === 'BLOCKED';

                return (
                  <div key={step.attempt} className="relative group">
                    {/* Node Icon */}
                    <div
                      className={`absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
                        isStepBlocked
                          ? isEscalated
                            ? 'border-amber-500/70 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                            : 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300'
                          : 'border-rose-500/70 bg-rose-500/20 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                      }`}
                    >
                      {isStepBlocked ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                    </div>

                    {/* Step Card */}
                    <div
                      className={`rounded-lg border p-3 transition-all ${
                        isEscalated
                          ? 'border-zinc-800 bg-zinc-950/80 hover:border-amber-700/50'
                          : 'border-zinc-800 bg-zinc-950/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-zinc-200">
                            Attempt 0{step.attempt}: {step.strategyName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isStepBlocked ? (
                            <span className="inline-flex items-center gap-1 rounded border border-emerald-800/80 bg-emerald-950/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                              <ShieldCheck className="h-2.5 w-2.5" />
                              BLOCKED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded border border-rose-800/80 bg-rose-950/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-300">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              ALLOWED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Payload Preview */}
                      <div className="mt-2 rounded border border-zinc-800/80 bg-zinc-900/90 p-2 font-mono text-[11px]">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                          <Terminal className="h-3 w-3 text-zinc-400" />
                          <span>Synthetic Attack Vector</span>
                        </div>
                        <p className="text-zinc-300 break-all select-all font-mono leading-relaxed">
                          {step.payloadPreview}
                        </p>
                      </div>

                      {/* Policy Feedback Message */}
                      <div className="mt-2 flex items-start gap-1.5 text-xs">
                        <Code2 className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                        <span
                          className={`font-mono text-[11px] leading-relaxed ${
                            isStepBlocked
                              ? 'text-emerald-400'
                              : 'text-rose-400 font-semibold'
                          }`}
                        >
                          {step.feedbackMessage}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty or Initial State if no scan run yet */}
        {!scanResult && (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 text-center p-6">
            <Radio className="h-8 w-8 text-zinc-600 mb-2 animate-pulse" />
            <h4 className="text-xs font-semibold text-zinc-300">
              No Adaptive Scan Active
            </h4>
            <p className="mt-1 text-[11px] text-zinc-500 max-w-sm">
              Launch the Autonomous Attack Discovery mutator to stress-test the policy firewall against sequential bypass permutations.
            </p>
            {onTriggerScan && (
              <button
                type="button"
                onClick={onTriggerScan}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-amber-600/70 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Execute Scan Permutation</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
