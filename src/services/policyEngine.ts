export interface PolicyEvaluationResult {
  allowed: boolean;
  reason: string;
}

/**
 * Evaluates whether a proposed tool execution is permitted according to
 * the active security policy firewall.
 *
 * Rule:
 * - If isProtected is false: all operations are allowed (vulnerability exploited).
 * - If isProtected is true: only files in /public/ or titled public_*.txt are permitted.
 *   Any access to sensitive files (e.g. secret_passwords.txt) or restricted tools is blocked.
 */
export function evaluatePolicy(
  toolName: string,
  args?: Record<string, any>,
  isProtected: boolean = false
): PolicyEvaluationResult {
  // If protection mode is disabled, firewall bypass occurs
  if (!isProtected) {
    return {
      allowed: true,
      reason: 'Protection Mode is OFF: execution dispatched without firewall inspection.',
    };
  }

  // Extract path argument if present
  const path: string = (args?.path || args?.file || args?.target || '').toString();

  // If path is specified, enforce strict file allowlist rule
  if (path) {
    const isPublicFolder = path.startsWith('/public/') || path.startsWith('public/');
    const isPublicFileName = path.startsWith('public_') && path.endsWith('.txt');

    if (!isPublicFolder && !isPublicFileName) {
      return {
        allowed: false,
        reason: `Violates path allowlist: Access to sensitive file "${path}" is blocked. Only /public/ or public_*.txt paths are permitted.`,
      };
    }
  }

  // Tool capability restrictions
  const restrictedTools = ['read_file', 'read_restricted_files', 'read_employee_records', 'delete_db'];
  if (restrictedTools.includes(toolName)) {
    // If it's read_file targeting a verified public path, allow it
    const isPublicFolder = path.startsWith('/public/') || path.startsWith('public/');
    const isPublicFileName = path.startsWith('public_') && path.endsWith('.txt');

    if (toolName === 'read_file' && (isPublicFolder || isPublicFileName)) {
      return {
        allowed: true,
        reason: `Verified: '${path}' matches the public file allowlist policy.`,
      };
    }

    return {
      allowed: false,
      reason: `Violates path allowlist: '${toolName}' attempted to access restricted resources outside public scope.`,
    };
  }

  // Default allowed for benign / public tools
  return {
    allowed: true,
    reason: 'Verified safe: Tool operation conforms to active security policy.',
  };
}
