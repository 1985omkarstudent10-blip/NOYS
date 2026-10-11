import React, { useState, useEffect } from 'react';
import {
  Wrench,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Download,
  CheckCircle2,
  Layers
} from 'lucide-react';
import type { AgentAuditResponse } from '../types/audit.ts';
import { fetchPermissionsAudit } from '../routes/auditRoutes.ts';

interface PermissionsViewProps {
  protectionMode: boolean;
  onToggleProtection: () => void;
}

export const PermissionsView: React.FC<PermissionsViewProps> = ({
  protectionMode,
  onToggleProtection,
}) => {
  const [auditData, setAuditData] = useState<AgentAuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleReAudit = () => {
    setIsLoading(true);
    fetchPermissionsAudit()
      .then((data) => {
        setAuditData(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    fetchPermissionsAudit()
      .then((data) => {
        if (isMounted) {
          setAuditData(data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const safeCount = auditData?.tools.filter((t) => t.status === 'SAFE').length ?? 0;
  const excessiveCount =
    auditData?.tools.filter((t) => t.status === 'FLAGGED_EXCESSIVE').length ?? 0;
  const totalCount = auditData?.tools.length ?? 0;

  const handleExportJson = () => {
    if (!auditData) return;
    const blob = new Blob([JSON.stringify(auditData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `permissions-audit-${auditData.agentName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-zinc-950 text-zinc-100 p-6 space-y-6 select-none font-sans antialiased">
      {/* 1. Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-wisteria-300/30 bg-wisteria-dim text-wisteria shadow-[0_0_20px_rgba(211,211,255,0.12)]">
            <Wrench className="h-5 w-5 text-wisteria" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">
                Tool & Permission Auditor
              </h1>
              <span className="rounded-md border border-wisteria-300/30 bg-wisteria-dim px-2 py-0.5 font-mono text-[10px] font-semibold text-wisteria">
                Excessive Agency
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Least-privilege auditing, destructive capability detection, and authorization boundary mapping.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReAudit}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition active:scale-[0.98] cursor-pointer"
            title="Refresh Permission Audit"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span>Re-audit</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            disabled={!auditData}
            className="flex items-center gap-1.5 rounded-lg border border-wisteria-300/40 bg-wisteria-dim px-3 py-1.5 text-xs font-semibold text-wisteria hover:bg-wisteria hover:text-zinc-950 transition active:scale-[0.98] cursor-pointer shadow-sm"
            title="Export full permission matrix JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Matrix</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (Alerts & KPIs - span 5 columns) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* 2. Agent Posture Risk Banner (Cherry Blossom #FFB7C5 Theme) */}
          <div className="relative h-auto min-h-fit w-full flex-shrink-0 overflow-hidden rounded-xl border-2 border-cherry-300/60 bg-gradient-to-r from-rose-950/90 via-zinc-950 to-zinc-950 p-5 shadow-[0_0_35px_rgba(255,183,197,0.18)] ring-1 ring-cherry-300/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cherry opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cherry" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold tracking-tight text-white">
                      Agent Posture Alert: HIGH RISK (Excessive Agency Detected) ⚠️
                    </span>
                    <span className="rounded border border-cherry-300/60 bg-cherry-dim px-2 py-0.5 font-mono text-[10px] font-bold text-cherry uppercase">
                      OWASP LLM06
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-zinc-300 mt-1">
                    Target: {auditData?.agentName ?? 'Customer Support Agent (Production)'}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-cherry-300/60 bg-cherry-dim px-3.5 py-1.5 font-mono text-[11px] font-bold text-cherry shadow-[0_0_15px_rgba(255,183,197,0.2)]">
                <ShieldAlert className="h-4 w-4 text-cherry" />
                <span>2 Destructive Capabilities Active</span>
              </div>
            </div>

            <div className="mt-3.5 h-auto min-h-fit rounded-lg border border-cherry-300/20 bg-zinc-950/80 p-3.5 font-mono text-xs text-zinc-200">
              <p className="leading-relaxed whitespace-normal pb-3 text-zinc-200">
                {auditData?.summary ??
                  'High Risk: Excessive agency detected. 2 tools possess destructive or unmonitored external capabilities that violate least-privilege boundaries.'}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[10px] text-zinc-400 pt-2.5 border-t border-zinc-800/80">
                <span>
                  Risk Score: <strong className="text-cherry font-bold">HIGH</strong>
                </span>
                <span>•</span>
                <span>
                  Evaluated At:{' '}
                  <strong className="text-zinc-200">
                    {auditData?.evaluatedAt
                      ? new Date(auditData.evaluatedAt).toLocaleTimeString()
                      : 'Live'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Privilege Enforced:{' '}
                  <strong className="text-wisteria font-bold">50% Compliant</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 3. Metrics Row (Surface Cards) in 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 backdrop-blur-sm shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Total Evaluated Tools
              </span>
              <div className="mt-1 font-mono text-2xl font-bold text-zinc-100">
                {totalCount}
              </div>
              <span className="mt-1 block font-mono text-[10px] text-zinc-400">
                Active agent manifest
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 backdrop-blur-sm shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Safe Utilities
              </span>
              <div className="mt-1 font-mono text-2xl font-bold text-wisteria">
                {safeCount}
              </div>
              <span className="mt-1 block font-mono text-[10px] text-wisteria">
                Read-only & public boundaries
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 backdrop-blur-sm shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Flagged Excessive
              </span>
              <div className="mt-1 font-mono text-2xl font-bold text-cherry">
                {excessiveCount}
              </div>
              <span className="mt-1 block font-mono text-[10px] text-cherry">
                Destructive / unmonitored scope
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleProtection}
              className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 backdrop-blur-sm shadow-sm text-left hover:border-zinc-700 transition cursor-pointer"
              title="Click to toggle Firewall Policy Shield"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Firewall Policy Shield
                </span>
                <span className="font-mono text-[9px] text-zinc-500 underline">toggle</span>
              </div>
              <div
                className={`mt-1 font-mono text-lg font-bold ${
                  protectionMode ? 'text-wisteria' : 'text-cherry'
                }`}
              >
                {protectionMode ? 'HARDENED' : 'EXPOSED'}
              </div>
              <span className="mt-1 block font-mono text-[10px] text-zinc-400">
                {protectionMode ? 'Allowlist gate active' : 'Zero barrier'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column (Permission Matrix - span 7 columns) */}
        <div className="xl:col-span-7 flex flex-col w-full">
          {/* 4. Expansive Tool Permissions Matrix Table */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col w-full">
            <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5 bg-zinc-950/70 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-wisteria" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Tool Permission Matrix & Parameter Audit
                </h3>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                Endpoint: GET /api/audit/permissions
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[720px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800/60 bg-zinc-900/40 text-[11px] font-mono uppercase text-zinc-500">
                    <th className="py-3 px-4 font-semibold w-1/4">Tool Identifier</th>
                    <th className="py-3 px-4 font-semibold w-1/4">Capability Description</th>
                    <th className="py-3 px-4 font-semibold w-1/6">Status Badge</th>
                    <th className="py-3 px-4 font-semibold w-1/3">Parameter Audit & Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-sans">
                  {auditData?.tools.map((tool) => {
                    const isSafe = tool.status === 'SAFE';

                    // Audit parameter explanation
                    const explanation =
                      tool.id === 'tool-delete-db'
                        ? 'Requires human-in-the-loop authorization gate or ephemeral cryptographic signature before invocation.'
                        : tool.id === 'tool-send-email'
                        ? 'Enforce domain recipient allowlist and approval modal before dispatching outbound SMTP traffic.'
                        : 'Safe public read scope. Parameter allowlist verified (/public/ path constraint).';

                    return (
                      <tr
                        key={tool.id}
                        className="hover:bg-zinc-800/20 transition-colors"
                      >
                        {/* 1. Tool Identifier (w-1/4) */}
                        <td className="py-4 px-4 font-mono w-1/4 align-top">
                          <div className="flex items-center gap-2 font-semibold">
                            <Terminal
                              className={`h-3.5 w-3.5 flex-shrink-0 ${
                                isSafe ? 'text-wisteria' : 'text-cherry'
                              }`}
                            />
                            <span className={isSafe ? 'text-zinc-200' : 'text-cherry'}>
                              {tool.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500 block mt-1">
                            id: {tool.id}
                          </span>
                        </td>

                        {/* 2. Capability Description (w-1/4) */}
                        <td className="py-4 px-4 text-zinc-300 leading-relaxed w-1/4 align-top text-xs">
                          {tool.description}
                        </td>

                        {/* 3. Status Badge (w-1/6) */}
                        <td className="py-4 px-4 w-1/6 align-top">
                          {isSafe ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D3D3FF]/20 bg-[#D3D3FF]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#D3D3FF] shadow-sm">
                              <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                              <span>SAFE</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB7C5]/20 bg-[#FFB7C5]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FFB7C5] shadow-sm animate-pulse">
                              <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                              <span>FLAGGED_EXCESSIVE</span>
                            </span>
                          )}
                        </td>

                        {/* 4. Parameter Audit & Remediation (w-1/3) */}
                        <td className="py-4 px-4 font-mono text-[11px] text-zinc-400 leading-relaxed w-1/3 align-top">
                          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/70 p-2.5">
                            <span
                              className={`block font-bold mb-1 ${
                                isSafe ? 'text-wisteria' : 'text-cherry'
                              }`}
                            >
                              {isSafe ? '✓ Boundary Verified' : '⚠ Action Required'}
                            </span>
                            <p className="text-zinc-300 leading-normal">{explanation}</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex h-10 flex-shrink-0 items-center justify-between border-t border-zinc-800/60 bg-zinc-950/70 px-5 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Security Architecture:</span>
                <span className="text-wisteria font-bold">
                  Principle of Least Privilege (PoLP)
                </span>
              </div>

              <span className="text-zinc-500">
                Realtime Tool Sandboxing Evaluated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
