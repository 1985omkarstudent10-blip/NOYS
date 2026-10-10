import React, { useState, useEffect } from 'react';
import {
  X,
  Wrench,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';
import type { AgentAuditResponse } from '../types/audit.ts';
import { fetchPermissionsAudit } from '../routes/auditRoutes.ts';

interface PermissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PermissionsDrawer: React.FC<PermissionsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [auditData, setAuditData] = useState<AgentAuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    fetchPermissionsAudit()
      .then((data) => {
        if (isMounted) {
          setAuditData(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const safeCount = auditData?.tools.filter((t) => t.status === 'SAFE').length ?? 0;
  const excessiveCount =
    auditData?.tools.filter((t) => t.status === 'FLAGGED_EXCESSIVE').length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 1. Backdrop overlay with smooth blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-over Drawer Panel */}
      <aside
        className="relative z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl transition-transform duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Tool and Permission Auditing"
      >
        {/* Header */}
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-zinc-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700/80 bg-zinc-800 text-zinc-300">
              <Wrench className="h-3.5 w-3.5 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-zinc-100">
                Tool & Permission Auditing
              </h2>
              <p className="font-mono text-[10px] text-zinc-400">
                Excessive Agency & Privilege Verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
            title="Close Drawer (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-zinc-400">
              <RefreshCw className="h-5 w-5 animate-spin text-zinc-500" />
              <span className="font-mono text-xs">Auditing agent tool privileges...</span>
            </div>
          ) : auditData ? (
            <>
              {/* Agent Overview & Risk Header */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Target Agent
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-100 mt-0.5">
                      {auditData.agentName}
                    </h3>
                  </div>

                  {/* Soft Warning Badge for HIGH RISK */}
                  {auditData.riskScore === 'HIGH' && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-amber-300 shadow-sm">
                      <AlertTriangle className="h-3 w-3 text-amber-400" />
                      <span>HIGH RISK: Excessive Agency</span>
                    </div>
                  )}
                </div>

                {auditData.summary && (
                  <p className="mt-2.5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-2.5">
                    {auditData.summary}
                  </p>
                )}

                {/* Micro Stats */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-mono pt-2 border-t border-zinc-800/80">
                  <div className="rounded border border-zinc-800/60 bg-zinc-900/60 py-1 px-2">
                    <span className="text-[10px] text-zinc-500 block">Safe Tools</span>
                    <span className="text-emerald-400 font-semibold">{safeCount} Verified</span>
                  </div>
                  <div className="rounded border border-zinc-800/60 bg-zinc-900/60 py-1 px-2">
                    <span className="text-[10px] text-zinc-500 block">Excessive Agency</span>
                    <span className="text-rose-400 font-semibold">{excessiveCount} Flagged</span>
                  </div>
                </div>
              </div>

              {/* Tools List Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                    Configured Tool Permissions ({auditData.tools.length})
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500">
                    GET /api/audit/permissions
                  </span>
                </div>

                <div className="space-y-2.5">
                  {auditData.tools.map((tool) => {
                    const isSafe = tool.status === 'SAFE';

                    return (
                      <div
                        key={tool.id}
                        className={`rounded-lg border p-3.5 transition-all ${
                          isSafe
                            ? 'border-zinc-800/80 bg-zinc-950/50 hover:border-zinc-700/80'
                            : 'border-rose-900/50 bg-rose-950/20 ring-1 ring-rose-500/10 hover:border-rose-800/70'
                        }`}
                      >
                        {/* Tool Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            {/* Subtle status dot */}
                            {isSafe ? (
                              <span
                                className="h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/10 flex-shrink-0"
                                title="Verified Safe Capability"
                              />
                            ) : (
                              <span
                                className="h-2 w-2 rounded-full bg-rose-400 ring-4 ring-rose-500/10 flex-shrink-0 animate-pulse"
                                title="Excessive Agency Flagged"
                              />
                            )}

                            <span
                              className={`font-mono text-xs font-semibold truncate ${
                                isSafe ? 'text-zinc-200' : 'text-rose-300'
                              }`}
                            >
                              {tool.name}()
                            </span>
                          </div>

                          {/* Status Badge */}
                          {isSafe ? (
                            <span className="inline-flex items-center gap-1 rounded border border-emerald-800/60 bg-emerald-950/50 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
                              SAFE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded border border-rose-800/70 bg-rose-950/70 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">
                              FLAGGED_EXCESSIVE
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Policy Recommendation Callout */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-400 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-zinc-200 block">
                    Least Privilege Recommendation
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Customer support agents should not have permissions for unprompted external email or database deletions. Restrict tool access to read-only endpoints and public allowlists.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-xs text-zinc-500 py-10">
              No audit data available.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex h-12 flex-shrink-0 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-5 text-xs">
          <span className="font-mono text-[11px] text-zinc-500">
            Audit API Active
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1 font-mono text-xs text-zinc-200 hover:bg-zinc-700 transition"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};
