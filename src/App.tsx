import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { OwaspView } from './components/OwaspView';
import { RegressionView } from './components/RegressionView';
import { TraceView } from './components/TraceView';
import { FirewallView } from './components/FirewallView';
import { MutatorView } from './components/MutatorView';
import { QuarantineView } from './components/QuarantineView';
import { PermissionsView } from './components/PermissionsView';
import { RegressionModal } from './components/RegressionModal';
import { AdaptiveScanModal } from './components/AdaptiveScanModal';
import { PermissionsDrawer } from './components/PermissionsDrawer';
import { MOCK_SCENARIOS, MOCK_AGENTS } from './data/mockScenarios';
import type { Scenario } from './types/scenario';
import type { NavView } from './types/navigation';
import { executeAdaptiveScan } from './routes/scanRoutes';

function App() {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(MOCK_SCENARIOS[0]);
  const [protectionMode, setProtectionMode] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isRegressionOpen, setIsRegressionOpen] = useState<boolean>(false);
  const [isAdaptiveOpen, setIsAdaptiveOpen] = useState<boolean>(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState<boolean>(false);
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans select-none antialiased">
      {/* 1. GitHub-Style Vertical Sidebar Navigation Drawer (w-64) */}
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        protectionMode={protectionMode}
        onToggleProtection={handleToggleProtection}
        agent={agent}
      />

      {/* 2. Main Right Content Pane */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Minimalist TopBar with Breadcrumbs, Scenario Selector & Controls */}
        <TopBar
          activeView={activeView}
          scenarios={MOCK_SCENARIOS}
          selectedScenario={selectedScenario}
          onSelectScenario={(sc) => setSelectedScenario(sc)}
          protectionMode={protectionMode}
          onToggleProtection={handleToggleProtection}
          onRunAudit={() => {
            setActiveView('trace');
            handleRunAudit();
          }}
          isAuditing={isAuditing}
        />

        {/* 3. Dedicated 8 Full-Screen Stage Views (Decluttered, Zero Crowding) */}
        <main className="relative flex-1 min-h-0 overflow-hidden">
          {/* [Primary Section] */}
          {activeView === 'dashboard' && (
            <Dashboard
              isSecured={protectionMode}
              onToggleSecured={handleToggleProtection}
              onChangeView={setActiveView}
            />
          )}

          {activeView === 'owasp' && (
            <OwaspView
              protectionMode={protectionMode}
              onNavigateView={setActiveView}
            />
          )}

          {activeView === 'regression' && (
            <RegressionView
              scenarios={MOCK_SCENARIOS}
            />
          )}

          {/* [Execution & Tracing Section] */}
          {activeView === 'trace' && (
            <TraceView
              scenario={selectedScenario}
              agent={agent}
              protectionMode={protectionMode}
              isAuditing={isAuditing}
              onRunAudit={handleRunAudit}
              onAuditFinished={handleAuditFinished}
              onReplayAgainstDefenses={handleReplayAgainstDefenses}
            />
          )}

          {activeView === 'firewall' && (
            <FirewallView
              scenario={selectedScenario}
              agent={agent}
              protectionMode={protectionMode}
              onToggleProtection={handleToggleProtection}
              onReplayAgainstDefenses={handleReplayAgainstDefenses}
            />
          )}

          {/* [Attack Discovery Section] */}
          {activeView === 'mutator' && (
            <MutatorView
              protectionMode={protectionMode}
              onToggleProtection={handleToggleProtection}
            />
          )}

          {activeView === 'quarantine' && (
            <QuarantineView
              protectionMode={protectionMode}
            />
          )}

          {/* [Privilege & Governance Section] */}
          {activeView === 'permissions' && (
            <PermissionsView
              protectionMode={protectionMode}
              onToggleProtection={handleToggleProtection}
            />
          )}
        </main>
      </div>

      {/* Regression Suite Modal (Accessible when needed) */}
      <RegressionModal
        scenarios={MOCK_SCENARIOS}
        isOpen={isRegressionOpen}
        onClose={() => setIsRegressionOpen(false)}
      />

      {/* Adaptive Scan Modal (preserved for compatibility) */}
      <AdaptiveScanModal
        isOpen={isAdaptiveOpen}
        onClose={() => setIsAdaptiveOpen(false)}
        initialProtectionMode={protectionMode}
      />

      {/* Tool and Permission Auditing Drawer (preserved for compatibility) */}
      <PermissionsDrawer
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />
    </div>
  );
}

export default App;
