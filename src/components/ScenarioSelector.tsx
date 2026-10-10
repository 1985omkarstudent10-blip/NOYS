import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  ShieldAlert,
  ShieldCheck,
  Code2,
  FileKey
} from 'lucide-react';
import { type Scenario, formatToolCall } from '../types/scenario';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  className?: string;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBadgeClass = (type: Scenario['type']) => {
    if (type === 'benign') {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    }
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
  };

  const getBadgeLabel = (type: Scenario['type']) => {
    return type === 'benign' ? 'Benign' : 'Adversarial';
  };

  return (
    <div ref={containerRef} className={`relative z-50 ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center gap-2 rounded-md border border-zinc-800/80 bg-zinc-900/90 px-2.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          {selectedScenario.type === 'benign' ? (
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
          )}
          <span className="max-w-[130px] truncate sm:max-w-[180px]">
            {selectedScenario.title}
          </span>
        </div>

        {/* Target Tool preview chip in trigger */}
        <span className="hidden lg:inline-flex items-center gap-1 rounded bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 border border-zinc-800">
          {formatToolCall(selectedScenario)}
        </span>

        {/* Type Badge */}
        <span
          className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold uppercase tracking-wider ${getBadgeClass(
            selectedScenario.type
          )}`}
        >
          {getBadgeLabel(selectedScenario.type)}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu (Strictly elevated with z-[100] & high shadow) */}
      {isOpen && (
        <div className="absolute right-0 top-full z-[100] mt-1.5 w-84 sm:w-96 rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-2xl ring-1 ring-zinc-700/60 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-800/80 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Select Attack Scenario ({scenarios.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Deterministic Presets
            </span>
          </div>

          <div className="mt-1 space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
            {scenarios.map((scenario) => {
              const isSelected = scenario.id === selectedScenario.id;
              const isBenign = scenario.type === 'benign';
              const formattedCall = formatToolCall(scenario);

              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => {
                    onSelectScenario(scenario);
                    setIsOpen(false);
                  }}
                  className={`group flex w-full flex-col rounded-md p-2.5 text-left transition ${
                    isSelected
                      ? 'bg-zinc-900 text-zinc-100 ring-1 ring-zinc-600/80 shadow-sm'
                      : 'text-zinc-300 hover:bg-zinc-900/70 hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{scenario.title}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-semibold uppercase tracking-wider ${getBadgeClass(
                          scenario.type
                        )}`}
                      >
                        {getBadgeLabel(scenario.type)}
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-zinc-200 flex-shrink-0" />
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {scenario.description}
                  </p>

                  {/* Target Tool and Private File Flag */}
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                    <span className="flex items-center gap-1 rounded bg-zinc-950/90 border border-zinc-800/80 px-1.5 py-0.5">
                      <Code2 className="h-3 w-3 text-zinc-400" />
                      <span className={isBenign ? 'text-emerald-400' : 'text-rose-400 font-semibold'}>
                        {formattedCall}
                      </span>
                    </span>

                    {scenario.toolArgs?.path && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400/90 font-mono">
                        <FileKey className="h-3 w-3 text-amber-400" />
                        <span>{scenario.toolArgs.path}</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
