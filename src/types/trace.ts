export type TraceStage = 'input' | 'context' | 'reasoning' | 'action';

export type TraceStatus = 'pending' | 'success' | 'warning' | 'blocked';

export interface TraceEvent {
  id: string;
  stage: TraceStage;
  title: string;
  description: string;
  status: TraceStatus;
  payload?: Record<string, any>;
  timestamp?: string;
}
