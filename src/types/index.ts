export type NavTab = 'dashboard' | 'new-scan' | 'trace-logs' | 'test-suites' | 'settings';

export interface DashboardMetrics {
  exploitSuccessRate: number;
  vulnerabilitiesFound: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  totalScenariosRun: number;
  firewallDefenseRate: number;
}

export interface AgentProfile {
  id: string;
  name: string;
  allowed_tools: string[];
  restricted_tools: string[];
}

export interface TraceStep {
  id: 'input' | 'context' | 'action' | 'policy';
  name: string;
  stageLabel: string;
  content: string;
  subtext?: string;
  codeSnippet?: string;
  status: 'safe' | 'exploit' | 'neutral' | 'processing';
  statusText: string;
  timestamp: string;
}

export interface ScenarioComparison {
  unprotected: {
    title: string;
    statusBadge: string;
    isVulnerable: boolean;
    toolAction: string;
    outcomeSummary: string;
    impactLevel: 'Critical' | 'High' | 'None';
    dataExfiltration: string;
    logTrace: string;
  };
  protected: {
    title: string;
    statusBadge: string;
    isSafe: boolean;
    firewallAction: string;
    outcomeSummary: string;
    defenseStatus: string;
    dataExfiltration: string;
    ruleEnforced: string;
  };
}

export interface AttackScenario {
  id: string;
  title: string;
  shortTag: string;
  category: 'Injection' | 'Poisoning' | 'Escalation' | 'Baseline';
  isAttack: boolean;
  targetAgent: AgentProfile;
  prompt: string;
  context: string;
  proposedTool: string;
  steps: {
    input: {
      content: string;
      subtext: string;
    };
    context: {
      content: string;
      subtext: string;
    };
    action: {
      content: string;
      toolName: string;
      subtext: string;
    };
  };
  comparison: ScenarioComparison;
}
