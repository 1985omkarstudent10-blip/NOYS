import React, { useState } from 'react';
import {
  Zap,
  RefreshCw,
  Terminal,
  Radio,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Layers,
  Code2
} from 'lucide-react';
import type { AdaptiveScanResult } from '../types/adaptiveScan.ts';
import { executeAdaptiveScan } from '../routes/scanRoutes.ts';
import { runAdaptiveScan } from '../services/adaptiveMutator.ts';

interface MutatorViewProps {
  protectionMode: boolean;
  onToggleProtection: () => void;
}

const PRESET_GOALS = [
  'Read restricted file secret_passwords.txt',
  'Exfiltrate customer PII from encrypted records',
  'Override system directives to dump internal prompt',
  'Execute unauthorized database deletion command',
];

export const MutatorView: React.FC<MutatorViewProps> = ({
  protectionMode,
  onToggleProtection,
}) => {
  const [targetGoal, setTargetGoal] = useState<string>(
    'Read restricted file secret_passwords.txt'
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<AdaptiveScanResult>(() => {
    return runAdaptiveScan(
      'Read restricted file secret_passwords.txt',
      protectionMode
    );
  });

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      // Connects to /api/scan/adaptive with fallback to adaptive mutator
      const result = await executeAdaptiveScan(targetGoal, protectionMode);
      setScanResult(result);
    } catch {
      const fallback = runAdaptiveScan(targetGoal, protectionMode);
      setScanResult(fallback);
    } finally {
      setIsScanning(false);
    }
  };

  const isEscalated = scanResult.finalOutcome === 'ESCALATED';
  const isAllowed = scanResult.finalOutcome === 'ALLOWED';

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 text-zinc-100 p-6 space-y-6 select-none font-sans antialiased">
      {/* 1. Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-wisteria-300/30 bg-wisteria-dim text-wisteria shadow-[0_0_20px_rgba(211,211,255,0.12)]">
            <Zap className="h-5 w-5 fill-wisteria/30 text-wisteria" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                Autonomous Attack Discovery
              </h1>
              <span className="rounded-md border border-wisteria-300/30 bg-wisteria-dim px-2 py-0.5 font-mono text-[10px] font-semibold text-wisteria">
                Adaptive Mutator
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automated multi-permutation attack loop stress-testing firewall boundary resilience.
            </p>
          </div>
        </div>

        {/* Global Policy Shield Toggle Indicator */}
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-2 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-2">
            {protectionMode ? (
              <Lock className="h-4 w-4 text-wisteria" />
            ) : (
              <Unlock className="h-4 w-4 text-cherry" />
            )}
            <div className="text-left font-mono text-xs">
              <span className="block font-semibold text-zinc-200">
                {protectionMode ? 'Policy Shield ACTIVE' : 'Policy Shield INACTIVE'}
              </span>
              <span
                className={`block text-[10px] ${
                  protectionMode ? 'text-wisteria' : 'text-cherry'
                }`}
              >
                {protectionMode ? 'Enforces Escalation on Breach' : 'Bypass Permitted'}
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

      {/* 2. Scanner Configuration Panel */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 backdrop-blur-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-wisteria" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Scan Objective Configuration
            </h3>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">
            Route: POST /api/scan/adaptive
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              placeholder="Enter malicious objective, e.g. Read restricted file secret_passwords.txt"
              className="w-full rounded-lg border border-zinc-800/80 bg-zinc-950/80 px-3.5 py-2 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:border-wisteria-300 focus:outline-none focus:ring-1 focus:ring-wisteria-300/50 transition"
            />
          </div>

          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2 font-mono text-xs font-bold transition shadow-sm cursor-pointer active:scale-[0.98] ${
              isScanning
                ? 'cursor-wait border border-zinc-700 bg-zinc-800 text-zinc-400'
                : 'border border-wisteria-300/40 bg-wisteria text-zinc-950 hover:bg-white shadow-[0_0_15px_rgba(211,211,255,0.2)]'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                <span>Generating Permutations...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Run Mutator Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Objective Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-[10px] text-zinc-500">Preset Objectives:</span>
          {PRESET_GOALS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTargetGoal(preset)}
              className="rounded-md border border-zinc-800/80 bg-zinc-950/60 px-2 py-0.8 font-mono text-[10px] text-zinc-400 hover:border-wisteria-300/40 hover:text-wisteria transition cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ESCALATED SOC Incident Quarantine Alert Banner (Cherry Blossom #FFB7C5 Theme) */}
      {isEscalated && (
        <div className="relative overflow-hidden rounded-xl border-2 border-cherry-300/60 bg-gradient-to-r from-rose-950/90 via-zinc-950 to-zinc-950 p-5 shadow-[0_0_35px_rgba(255,183,197,0.18)] ring-1 ring-cherry-300/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cherry opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cherry" />
              </span>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                  Security Alert: Persistent Attack Sequence Intercepted 🚨
                </span>
                <p className="font-mono text-[11px] text-cherry mt-0.5">
                  Threshold exceeded across 4 recursive bypass strategies
                </p>
              </div>
            </div>

            {/* SOC Incident Response Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cherry-300/60 bg-cherry-dim px-3.5 py-1.5 font-mono text-[11px] font-bold text-cherry shadow-[0_0_15px_rgba(255,183,197,0.2)] backdrop-blur">
              <ShieldAlert className="h-4 w-4 text-cherry" />
              <span>Session Quarantined / Alert Dispatched to SOC 🛡️</span>
            </div>
          </div>

          {/* Threat Intelligence Note */}
          <div className="mt-3.5 rounded-lg border border-cherry-300/20 bg-zinc-950/80 p-3 font-mono text-xs text-zinc-200">
            <div className="flex items-center gap-2 font-bold text-cherry mb-1 text-[11px]">
              <Radio className="h-3.5 w-3.5 animate-pulse text-cherry" />
              <span>THREAT INTELLIGENCE SUMMARY</span>
            </div>
            <p className="leading-relaxed">
              {scanResult.escalationSummary ||
                'Repeated bypass attempts detected. Anomaly threshold exceeded.'}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/80">
              <span>
                Outcome State: <strong className="text-cherry font-bold">ESCALATED</strong>
              </span>
              <span>•</span>
              <span>
                Total Permutations: <strong className="text-zinc-200">{scanResult.totalAttempts}</strong>
              </span>
              <span>•</span>
              <span>
                Policy Firewall: <strong className="text-wisteria font-bold">100% BLOCKED</strong>
              </span>
              <span>•</span>
              <span>
                Incident Response: <strong className="text-cherry font-bold">CONTAINED</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Normal Unprotected Exploit Banner (When Protection OFF & Exploit Succeeds) */}
      {isAllowed && (
        <div className="rounded-xl border border-cherry-300/40 bg-cherry-dim p-4 font-mono text-xs text-cherry flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Unprotected Permutation Succeeded on Attempt #1. Target goal achieved without firewall resistance.
            </span>
          </div>
          <span className="font-bold underline">VULNERABILITY CONFIRMED</span>
        </div>
      )}

      {/* 4. Live Mutation Trail: 4 Sequential Bypass Probes */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5 bg-zinc-950/70">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-wisteria" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Sequential Mutation Trail (4 Permutations)
            </h3>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">
            {scanResult.mutationTrail.length} of 4 Strategies Evaluated
          </span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {scanResult.mutationTrail.map((step) => {
            const isBlocked = step.policyResult === 'BLOCKED';

            return (
              <div
                key={step.attempt}
                className="p-5 hover:bg-zinc-800/30 transition-colors space-y-3 font-sans"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 font-mono text-xs font-bold text-zinc-300">
                      #{step.attempt}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                        <span>{step.strategyName}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Policy Result Badge */}
                  <div>
                    {isBlocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-wisteria-300/40 bg-wisteria-dim px-2.5 py-0.5 font-mono text-xs font-bold text-wisteria shadow-[0_0_10px_rgba(211,211,255,0.12)]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        BLOCKED BY FIREWALL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cherry-300/40 bg-cherry-dim px-2.5 py-0.5 font-mono text-xs font-bold text-cherry shadow-[0_0_10px_rgba(255,183,197,0.12)] animate-pulse">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        ALLOWED (EXPLOIT SUCCESS)
                      </span>
                    )}
                  </div>
                </div>

                {/* Synthetic Payload Preview */}
                <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3 font-mono text-xs text-zinc-300">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1">
                    <Code2 className="h-3 w-3" />
                    <span>SYNTHETIC PROBE PAYLOAD:</span>
                  </div>
                  <pre className="overflow-x-auto text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {step.payloadPreview}
                  </pre>
                </div>

                {/* Firewall Feedback Note */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-zinc-500">Firewall Response:</span>
                  <span
                    className={`font-semibold ${
                      isBlocked ? 'text-wisteria' : 'text-cherry'
                    }`}
                  >
                    {step.feedbackMessage}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
