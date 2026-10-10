import type { Scenario } from '../types/scenario';
import type { TraceEvent } from '../types/trace';
import { evaluatePolicy } from './policyEngine';

/**
 * Converts current event trace log and evaluation metadata into a formatted
 * JSON blob and initiates a browser file download: trace-<scenario-id>.json
 */
export function exportTraceJson(
  scenario: Scenario,
  traces: TraceEvent[],
  protectionMode: boolean
): void {
  const policyResult = evaluatePolicy(scenario.targetTool, scenario.toolArgs, protectionMode);

  const exportPayload = {
    metadata: {
      platform: 'AgentBreak Security Studio',
      engine: 'Deterministic Policy Firewall Sandbox',
      exportedAt: new Date().toISOString(),
      protectionMode: protectionMode ? 'ON' : 'OFF',
    },
    scenario: {
      id: scenario.id,
      title: scenario.title,
      type: scenario.type,
      description: scenario.description,
      mockInput: scenario.mockInput,
      targetTool: scenario.targetTool,
      toolArgs: scenario.toolArgs || {},
    },
    policyEvaluation: {
      allowed: policyResult.allowed,
      verdict: policyResult.allowed ? 'ALLOWED' : 'BLOCKED',
      reason: policyResult.reason,
    },
    traceSequence: traces.map((trace, idx) => ({
      step: idx + 1,
      id: trace.id,
      stage: trace.stage,
      title: trace.title,
      description: trace.description,
      status: trace.status,
      timestamp: trace.timestamp || `T+${idx * 380}ms`,
      payload: trace.payload || {},
    })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trace-${scenario.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
