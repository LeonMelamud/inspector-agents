import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API & SDK Documentation',
  description: 'Integrate InspectAgents into your AI testing workflow. REST API, MCP server, webhooks, and SDK documentation for automated safety checks.',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">API & Integration Documentation</h1>
        <p className="text-xl text-gray-400 mb-12">
          Everything you need to integrate InspectAgents into your AI testing workflow. All endpoints are free with no authentication required.
        </p>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Quick Start</h2>
          <p className="text-gray-300 mb-4">
            Get started in 30 seconds. No signup, no API keys needed.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`# Search for prompt injection failures
curl -X POST https://inspectagents.com/api/mcp/ \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0.0"}}}'`}
            </pre>
          </div>
        </section>

        {/* REST API */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-green-400">REST API</h2>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-2">POST /api/agent-feedback</h3>
            <p className="text-gray-400 mb-3">Submit feedback, corrections, or new AI incident reports.</p>
            <p className="text-sm text-gray-500 mb-3">Rate limit: 10 requests/minute per IP</p>
            <div className="bg-gray-800 rounded p-3 overflow-x-auto">
              <pre className="text-sm text-gray-300">
{`curl -X POST https://inspectagents.com/api/agent-feedback \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "incident",
    "message": "AI chatbot leaked internal data",
    "source": "Claude",
    "url": "https://example.com/article"
  }'`}
              </pre>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-bold text-gray-400 mb-2">Parameters</h4>
              <table className="w-full text-sm">
                <thead><tr className="text-left text-gray-500"><th className="pb-2">Field</th><th className="pb-2">Type</th><th className="pb-2">Required</th><th className="pb-2">Description</th></tr></thead>
                <tbody className="text-gray-300">
                  <tr><td className="py-1"><code className="text-green-400">type</code></td><td>string</td><td>Yes</td><td>feedback, correction, incident, or suggestion</td></tr>
                  <tr><td className="py-1"><code className="text-green-400">message</code></td><td>string</td><td>Yes</td><td>Content (max 5000 chars)</td></tr>
                  <tr><td className="py-1"><code className="text-green-400">source</code></td><td>string</td><td>No</td><td>Agent identifier (e.g. &quot;Claude&quot;, &quot;ChatGPT&quot;)</td></tr>
                  <tr><td className="py-1"><code className="text-green-400">url</code></td><td>string</td><td>No</td><td>Reference URL</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">GET /api/agent-feedback</h3>
            <p className="text-gray-400">Returns self-documenting API docs as JSON. Useful for agent discovery.</p>
          </div>
        </section>

        {/* MCP Server */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-green-400">MCP Server (Model Context Protocol)</h2>
          <p className="text-gray-300 mb-4">
            InspectAgents exposes a Streamable HTTP MCP server for direct AI agent integration.
          </p>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-2">Endpoint</h3>
            <code className="text-green-400">POST https://inspectagents.com/api/mcp/</code>
            <p className="text-sm text-amber-400 mt-2">⚠️ Trailing slash required. Without it, you get a 308 redirect.</p>
            <p className="text-sm text-amber-400">⚠️ Accept header required: <code>application/json, text/event-stream</code></p>
            <p className="text-sm text-gray-500 mt-1">Rate limit: 30 requests/minute per IP</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-3">Available Tools</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th className="pb-2">Tool</th><th className="pb-2">Description</th></tr></thead>
              <tbody className="text-gray-300">
                <tr className="border-t border-gray-800"><td className="py-2"><code className="text-green-400">search_failures</code></td><td>Search 500+ AI failures by query, category, severity, year</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><code className="text-green-400">get_failure</code></td><td>Get full details of a single failure by ID</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><code className="text-green-400">assess_risk</code></td><td>Run the AI risk assessment quiz</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><code className="text-green-400">get_checklist</code></td><td>Retrieve the 63-point testing checklist</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><code className="text-green-400">submit_feedback</code></td><td>Submit feedback or new incidents</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-3">Connection Flow</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-400 mb-1">Step 1: Initialize</p>
                <div className="bg-gray-800 rounded p-3 overflow-x-auto">
                  <pre className="text-xs text-gray-300">
{`{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0.0"}}}`}
                  </pre>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 mb-1">Step 2: List Tools</p>
                <div className="bg-gray-800 rounded p-3 overflow-x-auto">
                  <pre className="text-xs text-gray-300">
{`{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}`}
                  </pre>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 mb-1">Step 3: Call a Tool</p>
                <div className="bg-gray-800 rounded p-3 overflow-x-auto">
                  <pre className="text-xs text-gray-300">
{`{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_failures","arguments":{"query":"prompt injection","limit":5}}}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">Resources (Read-Only)</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th className="pb-2">URI</th><th className="pb-2">Description</th></tr></thead>
              <tbody className="text-gray-300">
                <tr className="border-t border-gray-800"><td className="py-2"><code className="text-green-400">inspectagents://failures/all</code></td><td>Complete failures database as JSON</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><code className="text-green-400">inspectagents://checklist/full</code></td><td>Full 63-point checklist</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Error Handling</h2>
          <p className="text-gray-300 mb-4">All API endpoints return structured JSON errors.</p>
          <div className="bg-gray-900 rounded-lg p-6">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th className="pb-2">Status</th><th className="pb-2">Cause</th><th className="pb-2">Response</th></tr></thead>
              <tbody className="text-gray-300">
                <tr className="border-t border-gray-800"><td className="py-2">400</td><td>Invalid request body or missing fields</td><td>JSON with error details and required fields</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2">404</td><td>Unknown API endpoint</td><td>JSON with available endpoints</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2">405</td><td>Wrong HTTP method</td><td>JSON with allowed methods</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2">406</td><td>Missing Accept header (MCP only)</td><td>Include <code>Accept: application/json, text/event-stream</code></td></tr>
                <tr className="border-t border-gray-800"><td className="py-2">429</td><td>Rate limit exceeded</td><td>JSON with rate limit info; <code>X-RateLimit-*</code> headers</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2">500</td><td>Internal server error</td><td>JSON-RPC error with message</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Webhooks */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Webhooks</h2>
          <p className="text-gray-300 mb-4">
            Webhook support for real-time notifications is planned. Currently, you can poll the MCP server
            for updates using <code className="text-green-400">search_failures</code> with date filters.
          </p>
          <p className="text-gray-400 text-sm">
            To be notified when webhooks launch, email <a href="mailto:hello@inspectagents.com" className="text-green-400 hover:underline">hello@inspectagents.com</a>.
          </p>
        </section>

        {/* Discovery Files */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Discovery & Integration Files</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th className="pb-2">File</th><th className="pb-2">Purpose</th></tr></thead>
              <tbody className="text-gray-300">
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/llms.txt" className="text-green-400 hover:underline">/llms.txt</a></td><td>LLM-optimized site overview</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/llms-full.txt" className="text-green-400 hover:underline">/llms-full.txt</a></td><td>Full context with statistics and examples</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/api/openapi.json" className="text-green-400 hover:underline">/api/openapi.json</a></td><td>OpenAPI 3.1 specification</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/.well-known/mcp.json" className="text-green-400 hover:underline">/.well-known/mcp.json</a></td><td>MCP server discovery</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/.well-known/mcp/server-card.json" className="text-green-400 hover:underline">/.well-known/mcp/server-card.json</a></td><td>MCP server card</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/.well-known/agent-card.json" className="text-green-400 hover:underline">/.well-known/agent-card.json</a></td><td>A2A Agent Card</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/.well-known/ai-plugin.json" className="text-green-400 hover:underline">/.well-known/ai-plugin.json</a></td><td>ChatGPT Plugin manifest</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/.well-known/agent-skills/index.json" className="text-green-400 hover:underline">/.well-known/agent-skills/index.json</a></td><td>Agent Skills index (v0.2.0)</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/.well-known/api-catalog" className="text-green-400 hover:underline">/.well-known/api-catalog</a></td><td>RFC 9727 API catalog</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/pricing.md" className="text-green-400 hover:underline">/pricing.md</a></td><td>Machine-readable pricing</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2"><a href="/index.md" className="text-green-400 hover:underline">/index.md</a></td><td>Markdown homepage fallback</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Rate Limits</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th className="pb-2">Endpoint</th><th className="pb-2">Limit</th><th className="pb-2">Window</th></tr></thead>
              <tbody className="text-gray-300">
                <tr className="border-t border-gray-800"><td className="py-2">POST /api/mcp/</td><td>30 requests</td><td>per minute per IP</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2">POST /api/agent-feedback</td><td>10 requests</td><td>per minute per IP</td></tr>
                <tr className="border-t border-gray-800"><td className="py-2">POST /api/subscribe</td><td>5 requests</td><td>per minute per IP</td></tr>
              </tbody>
            </table>
            <p className="text-gray-400 text-sm mt-4">
              Rate limit info is returned in <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, and <code>X-RateLimit-Reset</code> headers.
            </p>
          </div>
        </section>

        <footer className="text-gray-500 text-sm border-t border-gray-800 pt-8">
          <p>Questions? Email <a href="mailto:hello@inspectagents.com" className="text-green-400 hover:underline">hello@inspectagents.com</a></p>
          <p className="mt-2">OpenAPI spec: <a href="/api/openapi.json" className="text-green-400 hover:underline">inspectagents.com/api/openapi.json</a></p>
        </footer>
      </div>
    </div>
  );
}
