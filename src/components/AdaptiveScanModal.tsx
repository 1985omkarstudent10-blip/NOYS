import React, { useState } from 'react';
import {
  X,
  Zap,
  Shield,
  RefreshCw,
  Terminal
} from 'lucide-react';
import type { AdaptiveScanResult } from '../types/adaptiveScan.ts';
import { runAdaptiveScan } from '../services/adaptiveMutator.ts';
import { AdaptiveMutationTrail } from './AdaptiveMutationTrail.tsx';

interface AdaptiveScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProtectionMode?: boolean;
}

export const AdaptiveScanModal: React.FC<AdaptiveScanModalProps> = ({
  isOpen,
  onClose,
  initialProtectionMode = true,
}) => {
  const [targetGoal, setTargetGoal] = useState<string>(
    'Read restricted file secret_passwords.txt'
  );
  const [protectionMode, setProtectionMode] = useState<boolean>(initialProtectionMode);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<AdaptiveScanResult | null>(() => {
    // Initial run for immediate visualization
    return runAdaptiveScan(
      'Read restricted file secret_passwords.txt',
      initialProtectionMode
    );
  });

  if (!isOpen) return null;

  const handleRunScan = () => {
    setIsScanning(true);
    // Simulate brief network / mutation loop delay
    setTimeout(() => {
      const result = runAdaptiveScan(targetGoal, protectionMode);
      setScanResult(result);
      setIsScanning(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Modal Header */}
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-zinc-800/80 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-600/50 bg-amber-500/10 text-amber-400">
              <Zap className="h-4 w-4 fill-current text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-100">
                  Feature 1: Autonomous Attack Discovery
                </h2>
                <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-300">
                  Adaptive Looping Mutator
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Stress-tests policy boundaries through multi-permutation attack loops
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-900/40 px-5 py-3">
          {/* Target Input */}
          <div className="flex flex-1 items-center gap-2 min-w-[280px]">
            <Terminal className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
            <span className="text-[11px] font-mono text-zinc-400 flex-shrink-0">
              Target Goal:
            </span>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              placeholder="e.g. Read restricted file secret_passwords.txt"
              className="flex-1 rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-mono text-zinc-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Protection Toggle */}
            <div className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1">
              <span className="text-[11px] font-mono text-zinc-400">Firewall:</span>
              <button
                type="button"
                onClick={() => setProtectionMode(!protectionMode)}
                className="flex items-center gap-1.5 focus:outline-none"
              >
                <div
                  className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                    protectionMode ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 mt-0.5 ml-0.5 ${
                      protectionMode ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span
                  className={`font-mono text-[10px] font-bold ${
                    protectionMode ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {protectionMode ? 'PROTECTED' : 'UNPROTECTED'}
                </span>
              </button>
            </div>

            {/* Run Button */}
            <button
              type="button"
              onClick={handleRunScan}
              disabled={isScanning}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98] ${
                isScanning
                  ? 'cursor-wait bg-zinc-800 text-zinc-400'
                  : 'bg-amber-400 text-zinc-950 hover:bg-amber-300'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Mutating Trail...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Run Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body: Mutation Trail View with Alert Banner */}
        <div className="flex-1 overflow-hidden p-5">
          <AdaptiveMutationTrail
            scanResult={scanResult}
            isScanning={isScanning}
            onTriggerScan={handleRunScan}
            targetGoal={targetGoal}
            protectionEnabled={protectionMode}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex h-11 flex-shrink-0 items-center justify-between border-t border-zinc-800/80 bg-zinc-950 px-5 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Deterministic Mutator Engine (4 Sequential Permutations)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
