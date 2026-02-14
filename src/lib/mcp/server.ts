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
    }
  );

  registerTools(server);
  registerResources(server);

  return server;
}
