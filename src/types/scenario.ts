import type { TraceEvent } from './trace';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  type: 'benign' | 'adversarial';
  mockInput: string;
  targetTool: string;
  toolArgs?: Record<string, string>;
  traces?: TraceEvent[];
}

export interface AgentProfile {
  id: string;
  name: string;
  allowed_tools: string[];
  restricted_tools: string[];
}

export function formatToolCall(scenario: Scenario): string {
  if (scenario.toolArgs && Object.keys(scenario.toolArgs).length > 0) {
    const argsStr = Object.entries(scenario.toolArgs)
      .map(([key, val]) => `${key}: "${val}"`)
      .join(', ');
    return `${scenario.targetTool}(${argsStr})`;
  }
  return `${scenario.targetTool}()`;
}
