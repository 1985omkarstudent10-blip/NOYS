import type { AdaptiveScanRequest, AdaptiveScanResult } from '../types/adaptiveScan.ts';
import { runAdaptiveScan } from '../services/adaptiveMutator.ts';

/**
 * Helper to parse raw JSON body from Node.js IncomingMessage streams.
 */
function parseNodeHttpBody(req: any): Promise<Record<string, any>> {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Node.js / Connect / Express compatible route middleware for:
 * POST /api/scan/adaptive
 */
export async function adaptiveScanRouteHandler(
  req: any,
  res: any,
  next?: () => void
): Promise<void> {
  // Ensure route matching if called inside a general middleware chain
  const urlPath = req.url ? req.url.split('?')[0] : '';
  if (urlPath && urlPath !== '/api/scan/adaptive' && urlPath !== '/') {
    if (next) return next();
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Allow', 'POST');
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  try {
    const rawBody = await parseNodeHttpBody(req);
    const targetGoal: string =
      typeof rawBody?.targetGoal === 'string' && rawBody.targetGoal.trim()
        ? rawBody.targetGoal.trim()
        : 'Access restricted system resources';

    const protectionEnabled: boolean = Boolean(rawBody?.protectionEnabled);

    const scanResult: AdaptiveScanResult = runAdaptiveScan(targetGoal, protectionEnabled);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(scanResult));
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Malformed JSON payload in request body.' }));
  }
}

/**
 * Web Standard Request / Response handler for:
 * POST /api/scan/adaptive (compatible with Edge/Serverless/Fetch APIs)
 */
export async function handleAdaptiveScanFetch(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    });
  }

  try {
    const body = (await request.json()) as Partial<AdaptiveScanRequest>;
    const targetGoal =
      typeof body?.targetGoal === 'string' && body.targetGoal.trim()
        ? body.targetGoal.trim()
        : 'Access restricted system resources';
    const protectionEnabled = Boolean(body?.protectionEnabled);

    const scanResult: AdaptiveScanResult = runAdaptiveScan(targetGoal, protectionEnabled);

    return new Response(JSON.stringify(scanResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Malformed JSON payload in request body.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Client-side invocation helper for calling the adaptive scan endpoint.
 */
export async function executeAdaptiveScan(
  targetGoal: string,
  protectionEnabled: boolean
): Promise<AdaptiveScanResult> {
  try {
    const response = await fetch('/api/scan/adaptive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetGoal, protectionEnabled }),
    });

    if (!response.ok) {
      throw new Error(`Endpoint returned status ${response.status}`);
    }

    return (await response.json()) as AdaptiveScanResult;
  } catch {
    // Graceful fallback to in-memory mutator if fetch/server unavailable
    return runAdaptiveScan(targetGoal, protectionEnabled);
  }
}
