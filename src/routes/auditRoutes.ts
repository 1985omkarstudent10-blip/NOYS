import type { AgentAuditResponse } from '../types/audit.ts';

/**
 * Deterministic mock data representing an Excessive Agency audit.
 */
export const MOCK_AGENT_AUDIT: AgentAuditResponse = {
  agentName: 'Customer Support Agent (Production)',
  riskScore: 'HIGH',
  summary:
    'High Risk: Excessive agency detected. 2 tools possess destructive or unmonitored external capabilities that violate least-privilege boundaries.',
  evaluatedAt: new Date().toISOString(),
  tools: [
    {
      id: 'tool-summarize',
      name: 'summarize_text',
      description: 'Summarizes customer inquiries and public support documentation.',
      status: 'SAFE',
    },
    {
      id: 'tool-read-docs',
      name: 'read_public_docs',
      description: 'Reads static knowledge base articles and FAQs from the /public/ directory.',
      status: 'SAFE',
    },
    {
      id: 'tool-delete-db',
      name: 'delete_database_records',
      description:
        'Permits direct deletion of customer records and transaction logs without secondary supervisor authorization.',
      status: 'FLAGGED_EXCESSIVE',
    },
    {
      id: 'tool-send-email',
      name: 'send_external_email_unprompted',
      description:
        'Dispatches unsolicited outbound SMTP emails to external recipient domains without human-in-the-loop confirmation.',
      status: 'FLAGGED_EXCESSIVE',
    },
  ],
};

/**
 * Node.js / Connect / Express compatible route middleware for:
 * GET /api/audit/permissions
 */
export function auditPermissionsRouteHandler(
  req: any,
  res: any,
  next?: () => void
): void {
  const urlPath = req.url ? req.url.split('?')[0] : '';
  if (urlPath && urlPath !== '/api/audit/permissions' && urlPath !== '/') {
    if (next) return next();
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Allow', 'GET');
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use GET.' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(MOCK_AGENT_AUDIT));
}

/**
 * Web Standard Request / Response handler for:
 * GET /api/audit/permissions
 */
export function handleAuditPermissionsFetch(request: Request): Response {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed. Use GET.' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'GET',
      },
    });
  }

  return new Response(JSON.stringify(MOCK_AGENT_AUDIT), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Client-side helper for fetching permission audit data from the API endpoint.
 */
export async function fetchPermissionsAudit(): Promise<AgentAuditResponse> {
  try {
    const response = await fetch('/api/audit/permissions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Endpoint returned status ${response.status}`);
    }

    return (await response.json()) as AgentAuditResponse;
  } catch {
    // Graceful fallback to deterministic mock data if dev server API unavailable
    return MOCK_AGENT_AUDIT;
  }
}
