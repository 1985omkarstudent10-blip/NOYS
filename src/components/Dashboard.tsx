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
  FlaskConical,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import type { NavView } from '../types/navigation';

interface DashboardProps {
  isSecured?: boolean;
  onToggleSecured?: (secured: boolean) => void;
  onChangeView?: (view: NavView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isSecured: controlledSecured,
  onToggleSecured,
  onChangeView,
}) => {
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

  // Shifted Mock Data based on isSecured state
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
    <div className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 text-zinc-100 p-6 space-y-6 select-none font-sans antialiased">
      {/* 1. Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-wisteria-300/30 bg-wisteria-dim text-wisteria shadow-[0_0_20px_rgba(211,211,255,0.12)]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                Security Evaluation Command Center
              </h1>
              <span className="rounded-md border border-wisteria-300/30 bg-wisteria-dim px-2 py-0.5 font-mono text-[10px] font-semibold text-wisteria">
                Live Posture
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              High-level posture telemetry, exploit exposure scoring, and continuous firewall benchmarks.
            </p>
          </div>
        </div>

        {/* State Toggle: Unprotected vs Secured State */}
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-1.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 px-2.5">
            {isSecured ? (
              <Lock className="h-4 w-4 text-wisteria" />
            ) : (
              <Unlock className="h-4 w-4 text-cherry" />
            )}
            <div className="text-left">
              <span className="block font-mono text-[11px] font-semibold text-zinc-200">
                {isSecured ? 'Secured State' : 'Unprotected'}
              </span>
              <span
                className={`block font-mono text-[9px] ${
                  isSecured ? 'text-wisteria' : 'text-cherry'
                }`}
              >
                {isSecured ? 'Firewall Active' : 'Zero Inspection'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isSecured}
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isSecured ? 'bg-wisteria' : 'bg-zinc-700'
            }`}
            title="Toggle Unprotected vs Secured State"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                isSecured ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Top KPI Summary Cards (Spacious, Uncluttered Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Exploit Success Rate */}
        <div className="relative flex flex-col justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Exploit Success Rate
            </span>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                isSecured
                  ? 'border-wisteria-300/40 bg-wisteria-dim text-wisteria'
                  : 'border-cherry-300/40 bg-cherry-dim text-cherry'
              }`}
            >
              {isSecured ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </div>
          </div>

          <div className="my-4 flex items-baseline gap-3">
            <span
              className={`font-mono text-4xl font-extrabold tracking-tight transition-colors duration-300 ${
                isSecured ? 'text-wisteria' : 'text-cherry'
              }`}
            >
              {exploitRate}%
            </span>
            <span
              className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                isSecured ? 'text-wisteria' : 'text-cherry'
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

          <div className="border-t border-zinc-800/60 pt-2.5 text-[11px] font-mono">
            {isSecured ? (
              <span className="text-wisteria flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Policy Firewall enforcing strict tool allowlist
              </span>
            ) : (
              <span className="text-cherry flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                Zero inspection active — all exploits execute
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Vulnerability Severity Breakdown */}
        <div className="relative flex flex-col justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Vulnerability Breakdown
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>

          <div className="my-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                criticalThreats > 0
                  ? 'border-cherry-300/40 bg-cherry-dim text-cherry shadow-[0_0_12px_rgba(255,183,197,0.15)]'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-500'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  criticalThreats > 0 ? 'bg-cherry animate-pulse' : 'bg-zinc-600'
                }`}
              />
              <span>{criticalThreats} CRITICAL</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                highThreats > 0
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-sm'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-500'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  highThreats > 0 ? 'bg-amber-400' : 'bg-zinc-600'
                }`}
              />
              <span>{highThreats} HIGH</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 font-mono text-xs font-medium text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-zinc-600" />
              <span>{mediumThreats} MEDIUM</span>
            </span>
          </div>

          <div className="border-t border-zinc-800/60 pt-2.5 text-[11px] font-mono">
            {isSecured ? (
              <span className="text-wisteria flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                All 5 threats neutralized by policy shield
              </span>
            ) : (
              <span className="text-cherry flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                5 active unmitigated attack vectors detected
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Defense Effectiveness Score */}
        <div className="relative flex flex-col justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Defense Effectiveness
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
              <Shield className="h-4 w-4" />
            </div>
          </div>

          <div className="my-3 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-mono text-4xl font-extrabold tracking-tight transition-colors duration-300 ${
                    isSecured ? 'text-wisteria' : 'text-cherry'
                  }`}
                >
                  {defenseScore}%
                </span>
                <span className="font-mono text-xs text-zinc-500">/ 100</span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                {isSecured
                  ? 'Strong policy enforcement active'
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
                    isSecured ? 'stroke-wisteria' : 'stroke-cherry'
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

          <div className="mt-1 border-t border-zinc-800/60 pt-2.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full transition-all duration-700 ease-out ${
                  isSecured ? 'bg-wisteria shadow-[0_0_8px_rgba(211,211,255,0.4)]' : 'bg-cherry'
                }`}
                style={{ width: `${defenseScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Navigation & Security Posture Overview (Spacious Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 min-h-0">
        {/* Quick Diagnostic Modules */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <Layers className="h-4 w-4 text-wisteria" />
                <span>Security Diagnostic Views</span>
              </h3>
              <span className="font-mono text-[10px] text-zinc-500">4 Modules</span>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                {
                  id: 'owasp' as NavView,
                  title: 'OWASP Matrix Breakdown',
                  desc: 'Comprehensive taxonomy across LLM01 - LLM10 vulnerability classes.',
                  icon: Layers,
                },
                {
                  id: 'regression' as NavView,
                  title: 'Continuous Regression Suite',
                  desc: 'Automated test assertions with 100% compliance benchmarking.',
                  icon: FlaskConical,
                },
                {
                  id: 'trace' as NavView,
                  title: '4-Stage Execution Trace',
                  desc: 'Inspect step-by-step agent decisions and tool interception.',
                  icon: Terminal,
                },
                {
                  id: 'permissions' as NavView,
                  title: 'Excessive Agency Auditor',
                  desc: 'Least-privilege verification for destructive capabilities.',
                  icon: Wrench,
                },
              ].map((mod) => {
                const Icon = mod.icon;

                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => onChangeView?.(mod.id)}
                    className="w-full flex items-center justify-between rounded-lg border border-zinc-800/70 bg-zinc-950/60 p-3 hover:border-wisteria-300/40 hover:bg-zinc-900/60 transition group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:text-wisteria transition">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-wisteria transition">
                          {mod.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 line-clamp-1">
                          {mod.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-wisteria group-hover:translate-x-0.5 transition" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Defense Health & Realtime Status */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-wisteria" />
                <span>Realtime Firewall Posture</span>
              </h3>
              <span className="rounded border border-wisteria-300/30 bg-wisteria-dim px-2 py-0.5 font-mono text-[9px] text-wisteria">
                Telemetry
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block">PATH ALLOWLIST RULE</span>
                  <span className="text-zinc-200 font-semibold">/public/ & public_*.txt ONLY</span>
                </div>
                <span className="text-wisteria text-[11px] font-bold">ENFORCED</span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block">RECURSIVE ANOMALY DETECTION</span>
                  <span className="text-zinc-200 font-semibold">4 Strategy Exhaustion Threshold</span>
                </div>
                <span className="text-wisteria text-[11px] font-bold">ESCALATION ACTIVE</span>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block">EXCESSIVE AGENCY GATE</span>
                  <span className="text-zinc-200 font-semibold">Destructive Action Intercept</span>
                </div>
                <span className="text-cherry text-[11px] font-bold">FLAGGED</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between font-mono text-[11px] text-zinc-500">
            <span>Deterministic Agent Sandbox</span>
            <span className="text-zinc-400">Zero Uninspected Dispatches</span>
          </div>
        </div>
      </div>
    </div>
  );
};
