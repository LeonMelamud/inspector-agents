/**
 * MCP Server factory for InspectAgents.
 *
 * Creates a stateless McpServer instance with all tools and resources
 * registered. Each Vercel serverless invocation gets a fresh instance.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './tools';
import { registerResources } from './resources';

const SERVER_NAME = 'inspectagents';
const SERVER_VERSION = '1.0.0';

/**
 * Create a fully configured MCP server ready to handle requests.
 * Stateless — new instance per request (Vercel serverless compatible).
 */
export function createMCPServer(): McpServer {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
      instructions:
        'InspectAgents maintains a public database of documented AI chatbot failures. ' +
        'Use search_failures to find real-world AI failure examples by category, severity, or keyword. ' +
        'Use get_failure to get full incident details including prevention strategies. ' +
        'Use assess_risk to evaluate AI deployment readiness. ' +
        'Use get_checklist to retrieve the 67-point pre-deployment safety checklist. ' +
        'Use submit_feedback to report new incidents or corrections. ' +
        'All tools are free to use with no authentication required.',
    }
  );

  registerTools(server);
  registerResources(server);

  return server;
}
