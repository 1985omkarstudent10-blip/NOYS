import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Layers,
  FlaskConical,
  Terminal,
  ShieldCheck,
  Zap,
  Radio,
  Wrench,
  Lock,
  Unlock,
  Bot
} from 'lucide-react';
import type { NavView } from '../types/navigation';
import type { AgentProfile } from '../types/scenario';

interface SidebarProps {
  activeView: NavView;
  onChangeView: (view: NavView) => void;
  protectionMode: boolean;
  onToggleProtection: () => void;
  agent?: AgentProfile;
}

interface NavItemConfig {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onChangeView,
  protectionMode,
  onToggleProtection,
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
}) => {
  const sections: NavSectionConfig[] = [
    {
      title: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Command Center',
          icon: LayoutDashboard,
          badge: 'KPIs',
        },
        {
          id: 'owasp',
          label: 'OWASP Matrix',
          icon: Layers,
          badge: 'Top 10',
        },
        {
          id: 'regression',
          label: 'Regression Suite',
          icon: FlaskConical,
          badge: '100%',
        },
      ],
    },
    {
      title: 'Execution & Tracing',
      items: [
        {
          id: 'trace',
          label: 'Trace Execution',
          icon: Terminal,
          badge: '4-Stage',
        },
        {
          id: 'firewall',
          label: 'Firewall Interceptor',
          icon: ShieldCheck,
          badge: 'Policy',
        },
      ],
    },
    {
      title: 'Attack Discovery',
      items: [
        {
          id: 'mutator',
          label: 'Autonomous Mutator',
          icon: Zap,
          badge: 'Adaptive',
        },
        {
          id: 'quarantine',
          label: 'Incident Quarantine',
          icon: Radio,
          badge: 'SOC',
        },
      ],
    },
    {
      title: 'Privilege & Governance',
      items: [
        {
          id: 'permissions',
          label: 'Permissions Auditor',
          icon: Wrench,
          badge: 'Agency',
        },
      ],
    },
  ];

  return (
    <aside className="relative flex h-full w-64 flex-col justify-between border-r border-zinc-800/70 bg-[#0d1117] text-zinc-300 select-none flex-shrink-0 z-40">
      {/* 1. Brand Header */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-wisteria-300/30 bg-wisteria-dim text-wisteria shadow-[0_0_12px_rgba(211,211,255,0.15)]">
              <Shield className="h-4 w-4 fill-wisteria/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-zinc-100">
                  AgentBreak
                </span>
                <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.2 font-mono text-[9px] text-zinc-400">
                  v1.2
                </span>
              </div>
            </div>
          </div>

          {/* Glowing Status Dot */}
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
        </div>

        {/* 2. Navigation Sections (GitHub-style drawer layout) */}
        <div className="p-3 space-y-4 flex-1">
          {sections.map((sec, secIdx) => (
            <div key={sec.title} className={secIdx > 0 ? 'pt-3 border-t border-zinc-800/60' : ''}>
              <div className="px-2.5 pb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {sec.title}
              </div>

              <div className="space-y-0.5 mt-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChangeView(item.id)}
                      className={`group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? 'border border-wisteria-300/40 bg-zinc-800/90 text-wisteria font-semibold shadow-sm'
                          : 'border border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`h-4 w-4 flex-shrink-0 transition-colors ${
                            isActive
                              ? 'text-wisteria'
                              : 'text-zinc-500 group-hover:text-zinc-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`rounded px-1.5 py-0.2 font-mono text-[9px] transition-colors ${
                            isActive
                              ? 'border border-wisteria-300/30 bg-wisteria-dim text-wisteria'
                              : 'text-zinc-500 group-hover:text-zinc-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Footer Section: Monitored Agent + Persistent Policy Shield Toggle */}
      <div className="p-3 border-t border-zinc-800/70 bg-[#0d1117] space-y-2.5 flex-shrink-0">
        {/* Monitored Agent Chip */}
        <div className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-2.5 py-2">
          <div className="flex items-center gap-2 truncate">
            <Bot className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            <div className="truncate">
              <div className="text-[11px] font-medium text-zinc-200 truncate">
                {agent.name}
              </div>
              <div className="font-mono text-[9px] text-zinc-500 truncate">
                {agent.id}
              </div>
            </div>
          </div>
          <span className="rounded bg-zinc-800/90 border border-zinc-700/60 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400">
            Prod
          </span>
        </div>

        {/* Persistent Policy Shield Global Toggle */}
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                  protectionMode
                    ? 'border-wisteria-300/40 bg-wisteria-dim text-wisteria'
                    : 'border-cherry-300/40 bg-cherry-dim text-cherry'
                }`}
              >
                {protectionMode ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Unlock className="h-3 w-3" />
                )}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-zinc-200">
                  Policy Shield
                </div>
                <div
                  className={`font-mono text-[9px] font-bold ${
                    protectionMode ? 'text-wisteria' : 'text-cherry'
                  }`}
                >
                  {protectionMode ? 'PROTECTED' : 'UNPROTECTED'}
                </div>
              </div>
            </div>

            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={protectionMode}
              onClick={onToggleProtection}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ${
                protectionMode ? 'bg-wisteria text-zinc-950' : 'bg-zinc-700'
              }`}
              title="Toggle Policy Firewall Protection Mode"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 mt-0.5 ml-0.5 ${
                  protectionMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
