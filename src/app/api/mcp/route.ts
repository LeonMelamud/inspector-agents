/**
 * MCP Streamable HTTP endpoint for InspectAgents.
 *
 * Uses the Web Standard transport from @modelcontextprotocol/sdk which works
 * natively with Next.js App Router's Request/Response (Fetch API).
 *
 * Stateless mode — no session tracking, no SSE streams — fully compatible
 * with Vercel serverless functions.
 *
 * Endpoint: POST /api/mcp
 *           GET  /api/mcp  → 405 (no SSE in stateless mode)
 *           DELETE /api/mcp → 405 (no sessions to terminate)
 */

import { NextRequest, NextResponse } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createMCPServer } from '@/lib/mcp/server';
import { createRateLimiter, getClientIp, getRateLimitHeaders } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';

export const maxDuration = 60; // Vercel function timeout (seconds)

/** MCP endpoint: 30 requests per minute per IP */
const mcpLimiter = createRateLimiter({ limit: 30, windowSeconds: 60, prefix: 'mcp' });

/** CORS headers for cross-origin MCP clients */
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/** Merge CORS headers into a NextResponse */
function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * OPTIONS — CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST — handle JSON-RPC messages (initialize, tools/list, tools/call, etc.)
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limiting
  const rl = mcpLimiter.limit(ip);
  if (!rl.success) {
    logger.security('mcp_rate_limit', { ip, remaining: rl.remaining });
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Rate limit exceeded. Try again later.' },
        id: null,
      },
      { status: 429, headers: { ...CORS_HEADERS, ...getRateLimitHeaders(rl) } }
    );
  }

  try {
    const server = createMCPServer();

    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless — Vercel serverless compatible
      enableJsonResponse: true, // JSON responses, no SSE streaming
    });

    await server.connect(transport);

    const response = await transport.handleRequest(request);

    // Clean up after the response is sent
    response.clone().body?.cancel().catch(() => {});

    return withCors(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    logger.error('MCP request failed', error instanceof Error ? error : undefined, { ip });
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: { code: -32603, message },
        id: null,
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * GET — not supported in stateless mode (no SSE streams)
 */
export async function GET() {
  return NextResponse.json(
    {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message:
          'Method not allowed. This MCP server runs in stateless mode — use POST for JSON-RPC requests.',
      },
      id: null,
    },
    {
      status: 405,
      headers: { ...CORS_HEADERS, Allow: 'POST, OPTIONS' },
    }
  );
}

/**
 * DELETE — not supported in stateless mode (no sessions to terminate)
 */
export async function DELETE() {
  return NextResponse.json(
    {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message:
          'Method not allowed. This MCP server runs in stateless mode — no sessions to terminate.',
      },
      id: null,
    },
    {
      status: 405,
      headers: { ...CORS_HEADERS, Allow: 'POST, OPTIONS' },
    }
  );
}
