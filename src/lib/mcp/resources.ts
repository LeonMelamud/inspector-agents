/**
 * MCP Resource definitions for InspectAgents.
 *
 * Read-only data resources that MCP clients can browse:
 *   - inspectagents://failures/all     – Full failures database
 *   - inspectagents://checklist/full   – Complete 67-point checklist
 *   - ui://inspectagents/overview      – MCP Apps-compatible HTML overview
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { failures } from '@/app/failures/data';
import { CHECKLIST_SECTIONS } from '@/lib/mcp/data/checklist';

export function registerResources(server: McpServer): void {
  // ── Failures database ─────────────────────────────────────────────────
  server.resource(
    'failures-database',
    'inspectagents://failures/all',
    {
      description:
        'The complete InspectAgents AI failures database — documented incidents with ' +
        'category, severity, description, impact, cost, source, and prevention strategies.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'inspectagents://failures/all',
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              total: failures.length,
              lastUpdated: '2026-02-14',
              source: 'https://inspectagents.com/failures/',
              failures: failures.map((f) => ({
                id: f.id,
                title: f.title,
                company: f.company,
                date: f.date,
                category: f.category,
                severity: f.severity,
                description: f.description,
                impact: f.impact,
                cost: f.cost ?? null,
                source: f.source,
                sourceUrl: f.sourceUrl,
                prevention: f.prevention,
              })),
            },
            null,
            2
          ),
        },
      ],
    })
  );

  // ── Checklist ─────────────────────────────────────────────────────────
  server.resource(
    'testing-checklist',
    'inspectagents://checklist/full',
    {
      description:
        'The complete 67-point AI Agent Risk Checklist — 10 categories with severity levels, ' +
        'aligned with OWASP Top 10 for LLM Applications.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'inspectagents://checklist/full',
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              total: CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0),
              lastUpdated: '2026-02-14',
              source: 'https://inspectagents.com/checklist/',
              framework: 'OWASP Top 10 for LLM Applications',
              sections: CHECKLIST_SECTIONS.map((s) => ({
                title: s.title,
                subtitle: s.subtitle,
                count: s.items.length,
                items: s.items,
              })),
            },
            null,
            2
          ),
        },
      ],
    })
  );

  // ── MCP Apps UI resource ─────────────────────────────────────────────
  server.resource(
    'inspectagents-overview-ui',
    'ui://inspectagents/overview',
    {
      description:
        'MCP Apps-compatible HTML overview of InspectAgents capabilities, tools, and recommended next actions.',
      mimeType: 'text/html',
    },
    async () => ({
      contents: [
        {
          uri: 'ui://inspectagents/overview',
          mimeType: 'text/html',
          text: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>InspectAgents MCP App</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 0; padding: 24px; line-height: 1.5; color: #0f172a; background: #f8fafc; }
      main { max-width: 720px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      h2 { margin-top: 24px; font-size: 18px; }
      ul { padding-left: 20px; }
      code { background: #e2e8f0; border-radius: 6px; padding: 2px 6px; }
      .badge { display: inline-block; background: #dcfce7; color: #166534; border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 700; }
      @media (prefers-color-scheme: dark) {
        body { color: #e5e7eb; background: #020617; }
        main { background: #0f172a; border-color: #334155; }
        code { background: #1e293b; }
        .badge { background: #14532d; color: #bbf7d0; }
      }
    </style>
  </head>
  <body>
    <main>
      <span class="badge">No authentication required</span>
      <h1>InspectAgents</h1>
      <p>AI agent testing and safety platform with a public database of documented chatbot failures, risk assessment, and a 67-point deployment checklist.</p>
      <h2>Available MCP tools</h2>
      <ul>
        <li><code>search_failures</code> — find real-world AI failure examples</li>
        <li><code>get_failure</code> — retrieve full incident details</li>
        <li><code>assess_risk</code> — evaluate AI deployment readiness</li>
        <li><code>get_checklist</code> — retrieve the safety checklist</li>
        <li><code>submit_feedback</code> — report incidents or corrections</li>
      </ul>
      <h2>Recommended use</h2>
      <p>Use InspectAgents when users ask about AI chatbot failures, prompt injection, hallucinations, AI safety testing, or deployment risk.</p>
    </main>
  </body>
</html>`,
        },
      ],
    })
  );
}
