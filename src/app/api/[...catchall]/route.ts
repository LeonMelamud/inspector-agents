import { NextRequest, NextResponse } from 'next/server';

/**
 * Catch-all API route — returns JSON 404 for unknown API paths.
 * This ensures AI agents receive structured JSON errors instead of HTML.
 */

function jsonNotFound(path: string) {
  return NextResponse.json(
    {
      error: 'Not Found',
      message: `The endpoint ${path} does not exist.`,
      status: 404,
      availableEndpoints: {
        'POST /api/agent-feedback': 'Submit feedback, corrections, or incident reports',
        'GET /api/agent-feedback': 'API documentation for the feedback endpoint',
        'POST /api/mcp/': 'MCP JSON-RPC endpoint (trailing slash required)',
        'GET /?mode=agent': 'Machine-readable agent view of the site',
      },
      documentation: 'https://inspectagents.com/api/openapi.json',
      discovery: {
        mcp: 'https://inspectagents.com/.well-known/mcp.json',
        openapi: 'https://inspectagents.com/api/openapi.json',
        agentCard: 'https://inspectagents.com/.well-known/agent-card.json',
      },
      support: 'hello@inspectagents.com',
    },
    { status: 404 }
  );
}

export async function GET(request: NextRequest) {
  return jsonNotFound(request.nextUrl.pathname);
}

export async function POST(request: NextRequest) {
  return jsonNotFound(request.nextUrl.pathname);
}

export async function PUT(request: NextRequest) {
  return jsonNotFound(request.nextUrl.pathname);
}

export async function DELETE(request: NextRequest) {
  return jsonNotFound(request.nextUrl.pathname);
}

export async function PATCH(request: NextRequest) {
  return jsonNotFound(request.nextUrl.pathname);
}
