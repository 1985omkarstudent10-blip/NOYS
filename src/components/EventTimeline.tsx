import React, { useState, useEffect } from 'react';
import {
  Terminal,
  FileText,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Code2,
  Wrench,
  Shield,
  Download,
  Zap,
  RefreshCw
} from 'lucide-react';
import type { Scenario } from '../types/scenario';
import type { TraceEvent, TraceStage, TraceStatus } from '../types/trace';
import { evaluatePolicy } from '../services/policyEngine';
import { exportTraceJson } from '../services/exportTrace';
import { runAdaptiveScan } from '../services/adaptiveMutator.ts';
import { AdaptiveMutationTrail } from './AdaptiveMutationTrail.tsx';

interface EventTimelineProps {
  scenario: Scenario;
  protectionMode: boolean;
  isAuditing: boolean;
  onAuditFinished?: () => void;
  onReplayAgainstDefenses?: () => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  scenario,
  protectionMode,
  isAuditing,
  onAuditFinished,
  onReplayAgainstDefenses,
}) => {
  // Number of stages revealed so far during an active audit simulation (1 to 4)
  const [revealedCount, setRevealedCount] = useState<number>(4);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(3);
  const [viewTab, setViewTab] = useState<'trace' | 'adaptive'>('trace');

  const handleReplayClick = () => {
    // Visually clear the current trace to simulate live replay
    setRevealedCount(0);
    setActiveStageIndex(0);
    if (onReplayAgainstDefenses) {
      onReplayAgainstDefenses();
    }
  };

  // Sequential rendering with 400ms delay between steps when isAuditing triggers
  useEffect(() => {
    if (!isAuditing) {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => {
        setRevealedCount(1);
        setActiveStageIndex(0);
      }, 0),
      setTimeout(() => {
        setRevealedCount(2);
        setActiveStageIndex(1);
      }, 400),
      setTimeout(() => {
        setRevealedCount(3);
        setActiveStageIndex(2);
      }, 800),
      setTimeout(() => {
        setRevealedCount(4);
        setActiveStageIndex(3);
      }, 1200),
      setTimeout(() => {
        if (onAuditFinished) {
          onAuditFinished();
        }
      }, 1600),
    ];

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isAuditing, onAuditFinished]);

  // Derive effective step count directly during render
  const effectiveRevealedCount = isAuditing ? revealedCount : 4;
  const effectiveActiveIndex = isAuditing ? activeStageIndex : 3;

  // Evaluate the policy engine for the scenario's target tool and arguments
  const policyResult = evaluatePolicy(
    scenario.targetTool,
    scenario.toolArgs,
    protectionMode
  );

  // Retrieve base trace events
  const rawTraces: TraceEvent[] = scenario.traces && scenario.traces.length === 4
    ? scenario.traces
    : [
        {
          id: `${scenario.id}-1`,
          stage: 'input',
          title: 'Input Ingestion',
          description: scenario.mockInput,
          status: scenario.type === 'adversarial' ? 'warning' : 'success',
          payload: { prompt: scenario.mockInput },
          timestamp: 'T+0.0ms',
        },
        {
          id: `${scenario.id}-2`,
          stage: 'context',
          title: 'Context Retrieval',
          description: scenario.description,
          status: scenario.type === 'adversarial' ? 'warning' : 'success',
          payload: { target_tool: scenario.targetTool, context: scenario.description },
          timestamp: 'T+380ms',
        },
        {
          id: `${scenario.id}-3`,
          stage: 'reasoning',
          title: 'Model Reasoning',
          description: `Agent formulated call to ${scenario.targetTool}.`,
          status: scenario.type === 'adversarial' ? 'warning' : 'success',
          payload: { proposed_tool: scenario.targetTool, tool_args: scenario.toolArgs },
          timestamp: 'T+760ms',
        },
        {
          id: `${scenario.id}-4`,
          stage: 'action',
          title: 'Action Execution',
          description: `Dispatched tool call: ${scenario.targetTool}.`,
          status: scenario.type === 'adversarial' ? (protectionMode ? 'blocked' : 'warning') : 'success',
          payload: { action: scenario.targetTool },
          timestamp: 'T+1140ms',
        },
      ];

  // Dynamically update the 4th stage based on the Policy Engine evaluation and Protection Mode
  const traces: TraceEvent[] = rawTraces.map((trace, idx) => {
    if (idx === 3) {
      if (scenario.type === 'adversarial') {
        if (protectionMode) {
          // Block 4: Protected Mode -> Intercepted by policy, green shield icon, labeled "Blocked by Policy ✅"
          return {
            ...trace,
            status: 'blocked',
            title: 'Action Intercepted (Policy Firewall)',
            description: policyResult.reason,
            payload: {
              target_tool: scenario.targetTool,
              arguments: scenario.toolArgs,
              firewall_decision: 'BLOCKED',
              policy_reason: policyResult.reason,
              protection_mode: 'ENFORCED_ON',
            },
          };
        } else {
          // Block 4: Unprotected Mode -> Red alert/warning since exploit happened ❌
          return {
            ...trace,
            status: 'warning',
            title: 'Action Executed (Vulnerability Exploited)',
            description: `Firewall bypassed (Protection Mode is OFF). Tool '${scenario.targetTool}' executed with target '${scenario.toolArgs?.path || ''}'. Sensitive data exfiltrated!`,
            payload: {
              target_tool: scenario.targetTool,
              arguments: scenario.toolArgs,
              firewall_decision: 'UNCHECKED_DISPATCH',
              exploit_status: 'SUCCESSFUL_BREACH',
              protection_mode: 'BYPASS_OFF',
            },
          };
        }
      } else {
        // Benign task
        return {
          ...trace,
          status: 'success',
          title: 'Tool Execution Dispatched',
          description: policyResult.reason,
          payload: {
            target_tool: scenario.targetTool,
            arguments: scenario.toolArgs,
            firewall_decision: 'ALLOWED',
            protection_mode: protectionMode ? 'ON' : 'OFF',
          },
        };
      }
    }
    return trace;
  });

  const getStageIcon = (stage: TraceStage) => {
    switch (stage) {
      case 'input':
        return <Terminal className="h-3 w-3" />;
      case 'context':
        return <FileText className="h-3 w-3" />;
      case 'reasoning':
        return <Brain className="h-3 w-3" />;
      case 'action':
        if (scenario.type === 'adversarial') {
          if (protectionMode) {
            return <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />;
          }
          return <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />;
        }
        return <Wrench className="h-3 w-3 text-emerald-400" />;
      default:
        return <Terminal className="h-3 w-3" />;
    }
  };

  const getStatusNodeStyle = (status: TraceStatus, stage: TraceStage, isCurrentActive: boolean) => {
    if (isCurrentActive && isAuditing) {
      return 'border-blue-500/70 bg-blue-500/20 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.5)] animate-pulse';
    }

    if (stage === 'action' && scenario.type === 'adversarial') {
      if (protectionMode) {
        return 'border-emerald-500/60 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
      }
      return 'border-rose-500/60 bg-rose-500/20 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
    }

    switch (status) {
      case 'success':
        return 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
      case 'warning':
        return 'border-amber-500/50 bg-amber-500/20 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
      case 'blocked':
        return 'border-emerald-500/60 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
      case 'pending':
      default:
        return 'border-zinc-700 bg-zinc-900 text-zinc-400';
    }
  };

  const getStatusBadge = (stage: TraceStage, status: TraceStatus) => {
    if (stage === 'action') {
      if (scenario.type === 'adversarial') {
        if (protectionMode) {
          return (
            <span className="inline-flex items-center gap-1 rounded border border-emerald-700/60 bg-emerald-950/80 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-300">
              <Shield className="h-2.5 w-2.5" />
              Blocked by Policy ✅
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded border border-rose-800/80 bg-rose-950/80 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-400">
            <AlertTriangle className="h-2.5 w-2.5" />
            Action Executed ❌
          </span>
        );
      }
      return (
        <span className="rounded border border-emerald-800/60 bg-emerald-950/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-300">
          Clean ✅
        </span>
      );
    }

    switch (status) {
      case 'success':
        return (
          <span className="rounded border border-emerald-800/60 bg-emerald-950/60 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
            Verified
          </span>
        );
      case 'warning':
        return (
          <span className="rounded border border-amber-800/60 bg-amber-950/60 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-400">
            Adversarial
          </span>
        );
      case 'blocked':
        return (
          <span className="rounded border border-rose-800/60 bg-rose-950/60 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-rose-300">
            Blocked
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400">
            Pending
          </span>
        );
    }
  };

  const adaptiveGoal = scenario.toolArgs?.path
    ? `Access restricted file "${scenario.toolArgs.path}"`
    : `Execute restricted tool "${scenario.targetTool}"`;

  const adaptiveResult = runAdaptiveScan(adaptiveGoal, protectionMode);
  const isEscalated = adaptiveResult.finalOutcome === 'ESCALATED';

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
      {/* Panel Header */}
      <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-zinc-800/60 px-3 sm:px-4">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewTab('trace')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              viewTab === 'trace'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span>Trace Logs</span>
            <span className="rounded border border-zinc-700/60 bg-zinc-900 px-1 py-0.2 font-mono text-[9px] text-zinc-400">
              {isAuditing ? `Step ${effectiveActiveIndex + 1}/4` : '4 Stages'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewTab('adaptive')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              viewTab === 'adaptive'
                ? 'bg-zinc-800 text-amber-200 shadow-sm border border-amber-600/50'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            <Zap className="h-3.5 w-3.5 fill-current text-amber-400" />
            <span>Adaptive Mutator</span>
            {isEscalated ? (
              <span className="rounded-full border border-rose-500/80 bg-rose-950/80 px-1.5 py-0.2 font-mono text-[9px] font-bold text-rose-300 animate-pulse">
                🚨 ESCALATED
              </span>
            ) : (
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-1.5 py-0.2 font-mono text-[9px] text-zinc-400">
                Loop
              </span>
            )}
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {viewTab === 'trace' && (
            <>
              {/* Feature: Replay Against Defenses Action Button */}
              <button
                type="button"
                onClick={handleReplayClick}
                disabled={isAuditing}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition active:scale-[0.98] shadow-sm ${
                  isAuditing
                    ? 'cursor-wait bg-zinc-800 text-zinc-500 border border-zinc-700'
                    : 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400'
                }`}
                title="Enforce protection and replay trace against defenses"
              >
                {isAuditing ? (
                  <RefreshCw className="h-3 w-3 animate-spin text-zinc-400" />
                ) : (
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                )}
                <span className="hidden sm:inline">Replay Against Defenses</span>
                <span className="sm:hidden">Replay</span>
              </button>

              <button
                type="button"
                onClick={() => exportTraceJson(scenario, traces, protectionMode)}
                className="flex items-center gap-1.5 rounded-md border border-zinc-800/90 bg-zinc-900/90 px-2 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-800 transition active:scale-[0.98]"
                title={`Download trace-${scenario.id}.json`}
              >
                <Download className="h-3 w-3 text-zinc-400" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>
            </>
          )}

          <div className="hidden lg:flex items-center gap-1.5 border-l border-zinc-800/80 pl-2">
            <span className="font-mono text-[10px] text-zinc-500">
              Firewall:
            </span>
            <span
              className={`font-mono text-[10px] font-semibold ${
                protectionMode ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {protectionMode ? 'ENFORCING' : 'BYPASS'}
            </span>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAuditing
                  ? 'bg-amber-400 animate-ping'
                  : protectionMode
                  ? 'bg-emerald-400'
                  : 'bg-rose-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Body */}
      {viewTab === 'adaptive' ? (
        <div className="flex-1 overflow-hidden p-4 sm:p-5">
          <AdaptiveMutationTrail
            scanResult={adaptiveResult}
            isScanning={isAuditing}
            targetGoal={adaptiveGoal}
            protectionEnabled={protectionMode}
          />
        </div>
      ) : (
        /* Vertical Steps Container */
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="relative pl-6 space-y-4 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-zinc-800/80">
          {traces.map((trace, index) => {
            const isRevealed = index < effectiveRevealedCount;
            const isCurrentActive = index === effectiveActiveIndex && isAuditing;
            const isActionStage = trace.stage === 'action';

            // If not yet revealed during animation, render dimmed skeleton
            if (!isRevealed) {
              return (
                <div key={trace.id} className="relative opacity-25 transition-opacity duration-300">
                  <div className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-600">
                    <span className="font-mono text-[10px]">{index + 1}</span>
                  </div>
                  <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/30 p-3">
                    <span className="font-mono text-[11px] text-zinc-600">
                      Stage 0{index + 1}: {trace.stage.toUpperCase()} (Awaiting Execution...)
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={trace.id}
                className={`relative group transition-all duration-300 ${
                  isCurrentActive ? 'scale-[1.01]' : 'scale-100'
                }`}
              >
                {/* Node Icon */}
                <div
                  className={`absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-md border transition-all ${getStatusNodeStyle(
                    trace.status,
                    trace.stage,
                    isCurrentActive
                  )}`}
                >
                  {getStageIcon(trace.stage)}
                </div>

                {/* Step Card */}
                <div
                  className={`rounded-lg border p-3 transition-all ${
                    isActionStage && scenario.type === 'adversarial'
                      ? protectionMode
                        ? 'border-emerald-800/60 bg-emerald-950/20 ring-1 ring-emerald-500/20'
                        : 'border-rose-800/60 bg-rose-950/25 ring-1 ring-rose-500/20'
                      : trace.status === 'warning'
                      ? 'border-amber-900/40 bg-zinc-950/80'
                      : 'border-zinc-800/70 bg-zinc-950/70'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-zinc-200">
                        0{index + 1}. {trace.title}
                      </span>
                      <span className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 border border-zinc-800">
                        {trace.stage}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(trace.stage, trace.status)}
                      <span className="font-mono text-[10px] text-zinc-500">
                        {trace.timestamp || `T+${index * 380}ms`}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                    {trace.description}
                  </p>

                  {/* Special Callout for Stage 4 Policy Engine Decision */}
                  {isActionStage && scenario.type === 'adversarial' && (
                    <div
                      className={`mt-2.5 rounded border p-2 text-xs font-mono leading-relaxed ${
                        protectionMode
                          ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300'
                          : 'border-rose-800/60 bg-rose-950/40 text-rose-300'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {protectionMode ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span>DEFENSE ENFORCED: Threat Neutralized</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                            <span>EXPLOIT CONFIRMED: Security Boundary Pierced</span>
                          </>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-300">
                        {protectionMode
                          ? `Policy firewall intercepted proposed tool '${scenario.targetTool}'. Reason: ${policyResult.reason}`
                          : `Protection Mode is OFF. Tool '${scenario.targetTool}' with target '${scenario.toolArgs?.path || ''}' executed with zero verification.`}
                      </p>
                    </div>
                  )}

                  {/* Monospace Payload Viewer */}
                  {trace.payload && (
                    <div className="mt-2.5 rounded border border-zinc-800/80 bg-zinc-900/80 p-2 font-mono text-[11px]">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1">
                        <Code2 className="h-3 w-3 text-zinc-500" />
                        <span>Trace Metadata</span>
                      </div>
                      <div className="space-y-0.5 text-zinc-400">
                        {Object.entries(trace.payload).map(([k, v]) => (
                          <div key={k} className="flex items-start gap-2">
                            <span className="text-zinc-500">{k}:</span>
                            <span className="text-zinc-300 font-medium break-all">
                              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Smooth loading state during live replay interception */}
        {isAuditing && effectiveRevealedCount === 0 && (
          <div className="flex items-center justify-center py-10 gap-2.5 text-zinc-400 font-mono text-xs">
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Enforcing policy defenses and live intercepting trace...</span>
          </div>
        )}

        {/* Feature: Prominent Replay Action Banner when in Unprotected Mode */}
        {!protectionMode && scenario.type === 'adversarial' && (
          <div className="mt-4 rounded-xl border border-rose-900/60 bg-gradient-to-r from-rose-950/40 via-zinc-950 to-zinc-950 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-rose-950/20">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-800/60 bg-rose-950/60 text-rose-400 flex-shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  <span>Exploit Succeeded in Unprotected Mode</span>
                  <span className="font-mono text-[10px] text-rose-400 font-semibold">[Vulnerability Live]</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Enforce policy firewall to intercept this attack and verify defense.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReplayClick}
              disabled={isAuditing}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 px-3.5 py-1.5 text-xs font-bold transition active:scale-[0.98] shadow-md shadow-emerald-950/40 flex-shrink-0"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Intercepting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 fill-current" />
                  <span>Replay Against Defenses</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
