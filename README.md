# AgentBreak - AI Security Testing & Red Teaming Platform

AgentBreak is an AI agent security testing, policy firewall enforcement, and regression auditing studio built with React, Vite, TypeScript, and Tailwind CSS, inspired by the minimalist developer aesthetics of Linear and Vercel.

## Architecture Progress: All 5 Blocks Complete ✅

### ✅ Block 1: UI Shell & Minimalist Dashboard Layout
- **Single-Screen Layout**: Strict 100vh constraint (`h-screen overflow-hidden`) with zero full-page scrollbars.
- **Palette**: `bg-zinc-950` obsidian canvas with high-contrast text (`text-zinc-100`, `text-zinc-400`) and crisp `border-zinc-800/60` borders.
- **Header Bar**: Top bar with brand, scenario selector, Protection Mode toggle (`ON`/`OFF`), and high-emphasis "Run Audit" button.
- **Before vs. After Comparison**: Side-by-side cards comparing Unprotected (Action Executed ❌) vs. Protected (Blocked by Policy ✅) outcomes.

### ✅ Block 2: Mock Agent & Scenario Selector
- **`types/scenario.ts`**: Clean TypeScript interface for `Scenario` containing `id`, `title`, `description`, `type` (`'benign' | 'adversarial'`), `mockInput`, `targetTool`, `toolArgs`, and `formatToolCall`.
- **`data/mockScenarios.ts`**: Deterministic dataset containing required presets:
  - `"Public Notes Summary"` (`benign`, target tool: `read_public_notes`)
  - `"Document Injection Attack"` (`adversarial`, target tool: `read_file`, target argument: `path: "secret_passwords.txt"`)
- **`ScenarioSelector.tsx`**: Dropdown component elevated with `relative z-50` and `z-[100]` floating menu, displaying available scenarios with `Benign` vs. `Adversarial` badges and formatted tool calls.

### ✅ Block 3: The Multi-Stage Event Trace Timeline
- **`types/trace.ts`**: Trace data model with stages (`input`, `context`, `reasoning`, `action`), statuses (`pending`, `success`, `warning`, `blocked`), and structured payload metadata.
- **Trace Sequences (`mockScenarios.ts`)**:
  - `"Public Notes Summary"`: 4-stage successful execution sequence.
  - `"Document Injection Attack"`: 4-stage trace showing hidden document injection hijacking agent context and prompting `read_file("secret_passwords.txt")`.
- **`EventTimeline.tsx`**: Left workspace panel with 400ms sequential step animation upon clicking "Run Audit", Lucide icons (`Terminal`, `FileText`, `Brain`, `ShieldAlert`, `Wrench`), glowing indicator nodes, and expandable JSON trace payloads.

### ✅ Block 4: Security Policy Firewall & Comparison View
- **`services/policyEngine.ts`**: Core `evaluatePolicy(toolName, args, isProtected)` evaluator enforcing strict path allowlists:
  - Permitted files: only inside `/public/` or titled `public_*.txt`.
  - Sensitive files: accesses to `secret_passwords.txt` or restricted tools are blocked when `isProtected` is true.
  - Returns structured verdict: `{ allowed: boolean, reason: string }`.
- **Protection Mode Integration**: Real-time reactive toggle passing firewall state to the audit runner, timeline, and comparison panel.
- **Event Timeline (Stage 4)**:
  - **Protected Mode**: Updates with Green Shield icon 🛡️, labeled `'Blocked by Policy ✅'`, displaying the policy engine's allowlist violation reason.
  - **Unprotected Mode**: Shows red warning node ❌, labeled `'Action Executed (Exploit) ❌'`, highlighting unrestricted file exfiltration.
- **Comparison Panel**:
  - **Unprotected Card**: Highlights the breach, detailing the sensitive file leakage and bypassed security boundaries.
  - **Protected Card**: Highlights successful defense, displaying the exact policy reason.

### ✅ Block 5: Export Traces & Regression Testing Suite
- **Export Trace Feature (`services/exportTrace.ts`)**:
  - "Download Trace JSON" button in the Event Timeline header.
  - Exports a formatted `.json` file (`trace-<scenario-id>.json`) containing full metadata, scenario configuration, active protection status, policy evaluation verdict, and complete 4-stage trace events with payloads.
- **Regression Testing Suite (`services/regressionSuite.ts` & `RegressionModal.tsx`)**:
  - "Run Regression Suite" button in the Header Bar.
  - Batch executes all mock scenarios under Protected Mode.
  - Displays compact results summary card:
    - **Benign Tasks:** `Passed (Functionality Intact ✅)`
    - **Adversarial Tasks:** `Blocked (Defended ✅)`
    - **Overall Status:** `100% Policy Compliance, 0 False Positives`
  - Complete matrix table detailing each scenario's target tool, path argument, security verdict, and policy reason.

## Getting Started
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```
