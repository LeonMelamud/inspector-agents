'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    WebMCP: new (options?: {
      color?: string;
      position?: string;
      size?: string;
      padding?: string;
      inactivityTimeout?: number;
    }) => WebMCPInstance;
  }
}

interface WebMCPInstance {
  registerTool(
    name: string,
    description: string,
    schema: Record<string, unknown>,
    execute: (args: Record<string, unknown>) => unknown
  ): void;
  registerResource(
    name: string,
    description: string,
    options: { uri?: string; uriTemplate?: string; mimeType?: string },
    provideFn?: (uri: string) => unknown
  ): void;
}

const MCP_URL = '/api/mcp/';
const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

let jsonRpcId = 1;

async function mcpCall(method: string, params: Record<string, unknown> = {}) {
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ jsonrpc: '2.0', id: jsonRpcId++, method, params }),
  });
  const text = await res.text();
  // Streamable HTTP may return event-stream; extract last JSON line
  const lines = text.split('\n').filter((l) => l.trim());
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].replace(/^data:\s*/, '');
    try {
      return JSON.parse(line);
    } catch {
      continue;
    }
  }
  throw new Error('No valid JSON in MCP response');
}

async function callTool(name: string, args: Record<string, unknown>) {
  const resp = await mcpCall('tools/call', { name, arguments: args });
  if (resp?.result?.content) {
    return resp.result;
  }
  if (resp?.error) {
    throw new Error(resp.error.message || 'MCP tool error');
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify(resp) }] };
}

function textResult(obj: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(obj, null, 2) }] };
}

function registerTools(mcp: WebMCPInstance): void {
  // 1. search_failures
  mcp.registerTool(
    'search_failures',
    'Search the InspectAgents AI failures database. ' +
      'Supports keyword search, category filtering, severity, and year.',
    {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text search across title, company, description, impact' },
        category: {
          type: 'string',
          enum: ['Hallucination', 'Prompt Injection', 'Security', 'Bias', 'Jailbreak', 'Misinformation', 'Privacy', 'Safety'],
          description: 'Filter by failure category',
        },
        severity: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'], description: 'Filter by severity' },
        year: { type: 'number', description: 'Filter by year (e.g. 2024)' },
        limit: { type: 'number', description: 'Max results 1-50 (default 10)' },
      },
    },
    async (args) => callTool('search_failures', args)
  );

  // 2. get_failure
  mcp.registerTool(
    'get_failure',
    'Get full details of a single AI failure by ID (e.g. "chevrolet-car-sale").',
    {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Failure ID' },
      },
      required: ['id'],
    },
    async (args) => callTool('get_failure', args)
  );

  // 3. assess_risk
  mcp.registerTool(
    'assess_risk',
    'Run the AI risk assessment quiz. Returns risk level with recommendations.',
    {
      type: 'object',
      properties: {
        currentlyUsing: {
          type: 'string',
          enum: ['yes', 'planning', 'no'],
          description: '"yes" = production, "planning" = deploying soon, "no" = researching',
        },
        biggestFears: {
          type: 'array',
          items: { type: 'string', enum: ['hallucinations', 'security', 'reputation', 'cost', 'dontKnow'] },
          description: 'Select one or more concerns',
        },
      },
      required: ['currentlyUsing', 'biggestFears'],
    },
    async (args) => callTool('assess_risk', args)
  );

  // 4. get_checklist
  mcp.registerTool(
    'get_checklist',
    'Retrieve the 67-point AI Agent Risk Checklist. Filter by severity, section, or keyword.',
    {
      type: 'object',
      properties: {
        severity: { type: 'string', enum: ['critical', 'high', 'medium'], description: 'Filter by severity' },
        section: { type: 'string', description: 'Section name (e.g. "Hallucination", "Prompt Injection")' },
        query: { type: 'string', description: 'Free-text search' },
      },
    },
    async (args) => callTool('get_checklist', args)
  );

  // 5. get_about_info
  mcp.registerTool(
    'get_about_info',
    'Get information about InspectAgents — the AI safety platform and its founder Leon Melamud.',
    { type: 'object', properties: {} },
    async () => {
      return textResult({
        site: {
          name: 'InspectAgents',
          url: 'https://inspectagents.com',
          description:
            'AI agent safety & testing platform with a public database of documented AI failures, ' +
            'a 67-point risk checklist, and MCP-powered tools for AI safety research.',
        },
        founder: {
          name: 'Leon Melamud',
          title: 'GenAI Lead · AWS Expert · AI Community Builder',
          linkedin: 'https://www.linkedin.com/in/leon-melamud',
        },
        resources: {
          failures: 'https://inspectagents.com/failures/',
          checklist: 'https://inspectagents.com/checklist/',
          quiz: 'https://inspectagents.com/quiz/',
          blog: 'https://inspectagents.com/blog/',
        },
      });
    }
  );

  // Resources
  mcp.registerResource(
    'api_reference',
    'OpenAPI 3.1 specification for InspectAgents REST and MCP endpoints',
    { uri: 'https://inspectagents.com/api/openapi.json', mimeType: 'application/json' }
  );
}

const SHIELD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:60%;height:60%"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`;

export default function WebMCPTools() {
  useEffect(() => {
    // webmcp.js is already loaded via <script> in layout.tsx
    // Wait for it to be available
    const init = () => {
      if (typeof window.WebMCP !== 'function') return false;

      // Initialize MCP first so the session restore picks up registered tools
      // Need to send initialize before tools/call will work
      mcpCall('initialize', {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'webmcp-widget', version: '1.0.0' },
      }).catch(() => {});

      const mcp = new window.WebMCP({
        color: '#b45309', // amber-700 matching site brand
        position: 'bottom-right',
        size: '40px',
        padding: '14px',
        inactivityTimeout: 24 * 60 * 60 * 1000,
      });
      registerTools(mcp);

      const trigger = document.querySelector('.webmcp-trigger') as HTMLElement | null;
      if (trigger) {
        trigger.innerHTML = SHIELD_ICON;
        trigger.title = 'Connect AI assistant via WebMCP';
      }
      return true;
    };

    if (!init()) {
      // Script may not have loaded yet; poll briefly
      const interval = setInterval(() => {
        if (init()) clearInterval(interval);
      }, 200);
      const timeout = setTimeout(() => clearInterval(interval), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, []);

  return null;
}
