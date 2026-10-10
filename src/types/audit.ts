/**
 * Data contracts for Tool and Permission Auditing (Excessive Agency).
 */

export interface ToolAudit {
  id: string;
  name: string;
  description: string;
  status: 'SAFE' | 'FLAGGED_EXCESSIVE';
}

export interface AgentAuditResponse {
  agentName: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  tools: ToolAudit[];
  summary?: string;
  evaluatedAt?: string;
}
