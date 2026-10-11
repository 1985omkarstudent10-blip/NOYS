import React, { useState } from 'react';
import {
  Radio,
  ShieldAlert,
  Download,
  Terminal,
  Layers,
  RefreshCw
} from 'lucide-react';

interface IncidentItem {
  id: string;
  timestamp: string;
  threatType: string;
  targetAsset: string;
  attempts: number;
  severity: 'CRITICAL' | 'HIGH';
  status: 'QUARANTINED' | 'CONTAINED' | 'DISPATCHED_TO_SOC';
  details: string;
}

const MOCK_INCIDENTS: IncidentItem[] = [
  {
    id: 'INC-2026-9041',
    timestamp: 'Just now',
    threatType: 'Recursive Jailbreak & Encoding Bypass Loop',
    targetAsset: 'secret_passwords.txt',
    attempts: 4,
    severity: 'CRITICAL',
    status: 'QUARANTINED',
    details: '4 consecutive permutation strategies (Direct Injection, Persona, Base64, RAG Poisoning) intercepted by policy firewall. Anomaly threshold triggered.',
  },
  {
    id: 'INC-2026-8812',
    timestamp: '14 mins ago',
    threatType: 'Indirect Vector Context Poisoning',
    targetAsset: 'Internal Knowledge Embeddings',
    attempts: 3,
    severity: 'HIGH',
    status: 'DISPATCHED_TO_SOC',
    details: 'Ingested document contained embedded administrative instruction overrides targeting file extraction.',
  },
  {
    id: 'INC-2026-8790',
    timestamp: '1 hour ago',
    threatType: 'Unauthorized Database Mutation Attempt',
    targetAsset: 'Customer Database Records',
    attempts: 1,
    severity: 'HIGH',
    status: 'CONTAINED',
    details: 'Agent attempted invocation of delete_database_records() without secondary supervisor authorization token.',
  },
];

interface QuarantineViewProps {
  protectionMode: boolean;
}

export const QuarantineView: React.FC<QuarantineViewProps> = ({ protectionMode }) => {
  const [incidents] = useState<IncidentItem[]>(MOCK_INCIDENTS);
  const [isPurged, setIsPurged] = useState<boolean>(false);

  const handleExportIncidentLog = () => {
    const blob = new Blob([JSON.stringify(incidents, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `incident-quarantine-soc-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePurge = () => {
    setIsPurged(true);
    setTimeout(() => {
      setIsPurged(false);
    }, 2000);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 text-zinc-100 p-6 space-y-6 select-none font-sans antialiased">
      {/* 1. Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cherry-300/40 bg-cherry-dim text-cherry shadow-[0_0_20px_rgba(255,183,197,0.12)]">
            <Radio className="h-5 w-5 animate-pulse text-cherry" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                Incident Quarantine & SOC Alert Logs
              </h1>
              <span className="rounded-md border border-cherry-300/40 bg-cherry-dim px-2 py-0.5 font-mono text-[10px] font-semibold text-cherry">
                Threat Intelligence
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Escalated anomalous threat sequences, recursive attack containment, and SOC notifications.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePurge}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{isPurged ? 'Memory Purged ✓' : 'Purge Vector Cache'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportIncidentLog}
            className="flex items-center gap-1.5 rounded-lg border border-cherry-300/40 bg-cherry-dim px-3 py-1.5 text-xs font-semibold text-cherry hover:bg-cherry hover:text-zinc-950 transition active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export SOC Log</span>
          </button>
        </div>
      </div>

      {/* 2. Active Alert Banner (Cherry Blossom #FFB7C5 Theme) */}
      <div className="relative overflow-hidden rounded-xl border-2 border-cherry-300/60 bg-gradient-to-r from-rose-950/90 via-zinc-950 to-zinc-950 p-5 shadow-[0_0_35px_rgba(255,183,197,0.18)] ring-1 ring-cherry-300/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cherry opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cherry" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  Security Alert: Persistent Attack Sequence Intercepted 🚨
                </span>
                <span className="rounded border border-cherry-300/60 bg-cherry-dim px-2 py-0.5 font-mono text-[10px] font-bold text-cherry uppercase">
                  ESCALATED
                </span>
              </div>
              <p className="font-mono text-[11px] text-cherry mt-1">
                Repeated bypass attempts detected. Anomaly threshold exceeded across 4 recursive permutation cycles.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-cherry-300/60 bg-cherry-dim px-3.5 py-1.5 font-mono text-[11px] font-bold text-cherry shadow-[0_0_15px_rgba(255,183,197,0.2)]">
            <ShieldAlert className="h-4 w-4 text-cherry" />
            <span>Session Quarantined / Alert Dispatched to SOC 🛡️</span>
          </div>
        </div>

        <div className="mt-3.5 rounded-lg border border-cherry-300/20 bg-zinc-950/80 p-3 font-mono text-xs text-zinc-200">
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-400">
            <span>
              Target Asset: <strong className="text-zinc-200">secret_passwords.txt</strong>
            </span>
            <span>•</span>
            <span>
              Permutation Count: <strong className="text-cherry font-bold">4 Strategies</strong>
            </span>
            <span>•</span>
            <span>
              Policy Interception: <strong className="text-wisteria font-bold">100% BLOCKED</strong>
            </span>
            <span>•</span>
            <span>
              Quarantine Action: <strong className="text-cherry font-bold">SESSION_ISOLATED</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4.5 backdrop-blur-sm shadow-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Active Quarantines
          </span>
          <div className="mt-1 font-mono text-3xl font-bold text-cherry">
            3 Active
          </div>
          <span className="mt-1 block font-mono text-[10px] text-zinc-400">
            Threat sequences contained
          </span>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4.5 backdrop-blur-sm shadow-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            SOC Escalations
          </span>
          <div className="mt-1 font-mono text-3xl font-bold text-wisteria">
            1 Dispatched
          </div>
          <span className="mt-1 block font-mono text-[10px] text-wisteria">
            Realtime webhook triggered
          </span>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4.5 backdrop-blur-sm shadow-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Firewall Policy Lockdown
          </span>
          <div
            className={`mt-1 font-mono text-xl font-bold ${
              protectionMode ? 'text-wisteria' : 'text-cherry'
            }`}
          >
            {protectionMode ? 'ENFORCED (100% Defense)' : 'EXPOSED (No Interception)'}
          </div>
          <span className="mt-1 block font-mono text-[10px] text-zinc-400">
            {protectionMode ? 'Auto-quarantine active' : 'Exploits not quarantined'}
          </span>
        </div>
      </div>

      {/* 4. Incident Log Table */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5 bg-zinc-950/70">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cherry" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              SOC Threat Event Log
            </h3>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">
            Continuous Anomaly Feed
          </span>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800/60 bg-zinc-900/40 text-[11px] font-mono text-zinc-400">
                <th className="py-2.5 px-4 font-semibold">Incident ID</th>
                <th className="py-2.5 px-4 font-semibold">Threat Signature</th>
                <th className="py-2.5 px-4 font-semibold">Target Asset</th>
                <th className="py-2.5 px-4 font-semibold">Severity</th>
                <th className="py-2.5 px-4 font-semibold text-right">Quarantine Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-zinc-800/30 transition-colors duration-150"
                >
                  {/* Incident ID */}
                  <td className="py-4 px-4 font-mono font-semibold text-wisteria">
                    <div>{inc.id}</div>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      {inc.timestamp}
                    </span>
                  </td>

                  {/* Threat Signature */}
                  <td className="py-4 px-4 max-w-sm">
                    <div className="font-semibold text-zinc-100">{inc.threatType}</div>
                    <p className="mt-0.5 text-[11px] text-zinc-400 leading-snug">
                      {inc.details}
                    </p>
                  </td>

                  {/* Target Asset */}
                  <td className="py-4 px-4 font-mono text-[11px] text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                      <span>{inc.targetAsset}</span>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 rounded border border-cherry-300/40 bg-cherry-dim px-2 py-0.5 font-mono text-[10px] font-bold text-cherry">
                      {inc.severity}
                    </span>
                  </td>

                  {/* Quarantine Verdict */}
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cherry-300/40 bg-cherry-dim px-2.5 py-0.5 font-mono text-[10px] font-bold text-cherry shadow-[0_0_10px_rgba(255,183,197,0.12)]">
                      <ShieldAlert className="h-3 w-3" />
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex h-10 flex-shrink-0 items-center justify-between border-t border-zinc-800/60 bg-zinc-950/70 px-5 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Security Telemetry:</span>
            <span className="text-wisteria font-bold">SOC Webhook Integration Active</span>
          </div>

          <span className="text-zinc-500">Incident Quarantine Sandbox</span>
        </div>
      </div>
    </div>
  );
};
