/**
 * Data contracts for Feature 1: Autonomous Attack Discovery & Adaptive Mutator.
 */

export interface MutationStep {
  attempt: number;
  strategyName: string;
  payloadPreview: string; // safe, synthetic placeholder strings
  policyResult: 'BLOCKED' | 'ALLOWED';
  feedbackMessage: string;
}

export interface AdaptiveScanResult {
  scanId: string;
  totalAttempts: number;
  finalOutcome: 'ALLOWED' | 'ESCALATED';
  escalationSummary?: string;
  mutationTrail: MutationStep[];
}

export interface AdaptiveScanRequest {
  targetGoal: string;
  protectionEnabled: boolean;
}
