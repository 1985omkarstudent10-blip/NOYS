import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Bot
} from 'lucide-react';
import { EventTimeline } from './EventTimeline';
import type { Scenario, AgentProfile } from '../types/scenario';
import { formatToolCall } from '../types/scenario';
import { exportTraceJson } from '../services/exportTrace';

interface TraceViewProps {
  scenario: Scenario;
  agent?: AgentProfile;
  protectionMode: boolean;
  isAuditing: boolean;
  onRunAudit: () => void;
  onAuditFinished: () => void;
  onReplayAgainstDefenses: () => void;
}

export const TraceView: React.FC<TraceViewProps> = ({
  scenario,
  agent = {
    id: 'support_agent',
    name: 'Customer Support Agent',
    allowed_tools: ['read_public_notes', 'read_public_faq'],
    restricted_tools: [
      'read_file',
      'delete_db',
      'read_restricted_files',
      'read_employee_records',
    ],
  },
  protectionMode,
  isAuditing,
  onRunAudit,
  onAuditFinished,
  onReplayAgainstDefenses,
}) => {
  const isAdversarial = scenario.type === 'adversarial';
  const formattedCall = formatToolCall(scenario);

  const handleDownloadTrace = () => {
    const tracesToExport = scenario.traces ?? [];
    exportTraceJson(scenario, tracesToExport, protectionMode);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-zinc-950 text-zinc-100 select-none font-sans antialiased">
      {/* 1. Context Sub-strip (Linear / Vercel layout) */}
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-zinc-800/60 bg-zinc-950/70 px-6 backdrop-blur-sm text-xs font-mono">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-500">Agent:</span>
            <span className="font-semibold text-zinc-200">{agent.name}</span>
          </div>

          <span className="text-zinc-700">|</span>

          <div className="flex items-center gap-1.5 truncate">
            <span className="text-zinc-500">Target Vector:</span>
            <span
              className={`font-semibold ${
                isAdversarial ? 'text-cherry' : 'text-wisteria'
              }`}
            >
              {formattedCall}
            </span>
          </div>

          <span className="text-zinc-700">|</span>

          {/* Scenario Badge */}
          <div>
            {isAdversarial ? (
              <span className="inline-flex items-center gap-1 rounded border border-cherry-300/40 bg-cherry-dim px-2 py-0.5 font-mono text-[10px] font-bold text-cherry">
                <AlertTriangle className="h-3 w-3" />
                Adversarial Injection
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded border border-wisteria-300/40 bg-wisteria-dim px-2 py-0.5 font-mono text-[10px] font-bold text-wisteria">
                <ShieldCheck className="h-3 w-3" />
                Benign Verification
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2">
          {/* Run Audit Action Button */}
          <button
            type="button"
            onClick={onRunAudit}
            disabled={isAuditing}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition shadow-sm cursor-pointer active:scale-[0.98] ${
              isAuditing
                ? 'cursor-wait border border-zinc-700 bg-zinc-800 text-zinc-400'
                : 'border border-wisteria-300/40 bg-wisteria text-zinc-950 hover:bg-white shadow-[0_0_12px_rgba(211,211,255,0.2)]'
            }`}
            title="Sequentially execute trace audit"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
          </button>

          {/* Replay Against Defenses Action Button */}
          <button
            type="button"
            onClick={onReplayAgainstDefenses}
            className="flex items-center gap-1.5 rounded-lg border border-wisteria-300/40 bg-wisteria-dim px-2.5 py-1 text-xs font-semibold text-wisteria hover:bg-wisteria hover:text-zinc-950 transition active:scale-[0.98] shadow-sm cursor-pointer"
            title="Re-run audit with Policy Shield forced ON"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Replay Defenses</span>
          </button>

          {/* Download Trace JSON */}
          <button
            type="button"
            onClick={handleDownloadTrace}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition active:scale-[0.98] cursor-pointer"
            title="Download trace as formatted JSON"
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Trace JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Main Full-Width Stage (4-Stage Visual Execution Pipeline) */}
      <div className="flex-1 p-5 min-h-0 overflow-hidden">
        <EventTimeline
          scenario={scenario}
          protectionMode={protectionMode}
          isAuditing={isAuditing}
          onAuditFinished={onAuditFinished}
          onReplayAgainstDefenses={onReplayAgainstDefenses}
        />
      </div>
    </div>
  );
};
