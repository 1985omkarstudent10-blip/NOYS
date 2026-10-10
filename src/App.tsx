import { useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { EventTimeline } from './components/EventTimeline';
import { ComparisonPanel } from './components/ComparisonPanel';
import { RegressionModal } from './components/RegressionModal';
import { AdaptiveScanModal } from './components/AdaptiveScanModal.tsx';
import { PermissionsDrawer } from './components/PermissionsDrawer.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { MOCK_SCENARIOS, MOCK_AGENTS } from './data/mockScenarios';
import { type Scenario, formatToolCall } from './types/scenario';
import { executeAdaptiveScan } from './routes/scanRoutes.ts';
import { Bot, AlertTriangle, ShieldCheck, Layers, Zap, Wrench } from 'lucide-react';

function App() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(MOCK_SCENARIOS[0]);
  const [protectionMode, setProtectionMode] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isRegressionOpen, setIsRegressionOpen] = useState<boolean>(false);
  const [isAdaptiveOpen, setIsAdaptiveOpen] = useState<boolean>(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workspace'>('dashboard');
  const agent = MOCK_AGENTS[0];

  const handleToggleProtection = () => {
    setProtectionMode((prev) => !prev);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
  };

  const handleAuditFinished = () => {
    setIsAuditing(false);
  };

  const handleReplayAgainstDefenses = () => {
    // 1. Force protection mode to true
    setProtectionMode(true);
    // 2. Clear auditing state first
    setIsAuditing(false);
    // 3. Trigger backend scan API
    void executeAdaptiveScan(
      selectedScenario.toolArgs?.path || selectedScenario.targetTool,
      true
    );
    // 4. Delay briefly to let UI clear and smoothly re-render with live interception
    setTimeout(() => {
      setIsAuditing(true);
    }, 100);
  };

  const handleSelectScenarioFromDashboard = (scenarioName: string) => {
    if (scenarioName.includes('RAG') || scenarioName.includes('Poisoning')) {
      const adv = MOCK_SCENARIOS.find((s) => s.type === 'adversarial');
      if (adv) setSelectedScenario(adv);
      setActiveTab('workspace');
    } else if (scenarioName.includes('Agency')) {
      setIsPermissionsOpen(true);
    } else {
      const adv = MOCK_SCENARIOS.find((s) => s.type === 'adversarial');
      if (adv) setSelectedScenario(adv);
      setActiveTab('workspace');
    }
  };

  const isAdversarial = selectedScenario.type === 'adversarial';
  const formattedCall = formatToolCall(selectedScenario);

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none antialiased">
      {/* 1. Header Bar 🧭 with ScenarioSelector, Permissions, Adaptive Scan & Regression Suite Button */}
      <HeaderBar
        scenarios={MOCK_SCENARIOS}
        selectedScenario={selectedScenario}
        onSelectScenario={(sc) => setSelectedScenario(sc)}
        protectionMode={protectionMode}
        onToggleProtection={handleToggleProtection}
        onRunAudit={handleRunAudit}
        isAuditing={isAuditing}
        onOpenRegression={() => setIsRegressionOpen(true)}
        onOpenAdaptive={() => setIsAdaptiveOpen(true)}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Target Agent & Active Scenario Context Sub-bar (relative z-30) - shown in workspace mode */}
      {activeTab === 'workspace' && (
        <div className="relative z-30 h-8 flex-shrink-0 border-b border-zinc-800/60 bg-zinc-950/80 px-4 sm:px-6 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 font-mono">
              <Bot className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-zinc-500">Agent:</span>
              <span className="font-semibold text-zinc-300">{agent.name}</span>
              <span className="text-zinc-500">({agent.id})</span>
              <button
                type="button"
                onClick={() => setIsPermissionsOpen(true)}
                className="ml-1 text-[10px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-0.5 cursor-pointer"
                title="Audit Permissions (Excessive Agency)"
              >
                <Wrench className="h-2.5 w-2.5" />
                Audit
              </button>
            </div>

            <span className="hidden sm:inline text-zinc-700">|</span>

            <div className="hidden sm:flex items-center gap-1.5 font-mono truncate">
              <span className="text-zinc-500">Target Tool:</span>
              <span className={isAdversarial ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                {formattedCall}
              </span>
              <span className="text-zinc-600">
                ({isAdversarial ? 'Restricted' : 'Allowed'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            {/* Quick Trigger for Feature 1 Adaptive Mutator */}
            <button
              type="button"
              onClick={() => setIsAdaptiveOpen(true)}
              className="hidden md:flex items-center gap-1 rounded bg-zinc-900 border border-amber-800/60 px-1.5 py-0.5 text-[10px] text-amber-300 hover:text-amber-200 hover:border-amber-600 transition"
              title="Open Feature 1 Autonomous Attack Discovery Modal"
            >
              <Zap className="h-3 w-3 fill-current text-amber-400" />
              <span>Mutator: {protectionMode ? 'Escalated Guard' : 'Bypass Sim'}</span>
            </button>

            {/* Quick Trigger for Regression Matrix */}
            <button
              type="button"
              onClick={() => setIsRegressionOpen(true)}
              className="hidden md:flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 hover:text-emerald-300 hover:border-emerald-700/60 transition"
            >
              <Layers className="h-3 w-3 text-emerald-400" />
              <span>Suite: 100% Compliant</span>
            </button>

            <span className="text-zinc-500">Mode:</span>
            {isAdversarial ? (
              <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                <AlertTriangle className="h-3 w-3" />
                Adversarial Attack
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="h-3 w-3" />
                Benign Task
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Single-Screen Workspace / Command Center View (relative z-10) */}
      {activeTab === 'dashboard' ? (
        <main className="relative z-10 flex-1 min-h-0 overflow-hidden">
          <Dashboard
            isSecured={protectionMode}
            onToggleSecured={handleToggleProtection}
            onSelectScenarioRow={handleSelectScenarioFromDashboard}
          />
        </main>
      ) : (
        <main className="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
          {/* 2. Multi-Stage Event Trace Timeline ⏱️ (Left Panel - Block 3 & 5 Export) */}
          <section className="lg:col-span-6 h-full min-h-0 overflow-hidden">
            <EventTimeline
              scenario={selectedScenario}
              protectionMode={protectionMode}
              isAuditing={isAuditing}
              onAuditFinished={handleAuditFinished}
              onReplayAgainstDefenses={handleReplayAgainstDefenses}
            />
          </section>

          {/* 3. Before vs. After Comparison 🛡️ (Right Panel - Block 4) */}
          <section className="lg:col-span-6 h-full min-h-0 overflow-hidden">
            <ComparisonPanel
              scenario={selectedScenario}
              agent={agent}
              protectionMode={protectionMode}
            />
          </section>
        </main>
      )}

      {/* 4. Regression Testing Suite Modal (Block 5) */}
      <RegressionModal
        scenarios={MOCK_SCENARIOS}
        isOpen={isRegressionOpen}
        onClose={() => setIsRegressionOpen(false)}
      />

      {/* 5. Feature 1: Autonomous Attack Discovery / Adaptive Mutator Modal */}
      <AdaptiveScanModal
        isOpen={isAdaptiveOpen}
        onClose={() => setIsAdaptiveOpen(false)}
        initialProtectionMode={protectionMode}
      />

      {/* 6. Tool and Permission Auditing (Excessive Agency) Slide-over Drawer */}
      <PermissionsDrawer
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />
    </div>
  );
}

export default App;
