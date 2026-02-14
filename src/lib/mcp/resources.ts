/**
 * MCP Resource definitions for InspectAgents.
 *
 * Read-only data resources that MCP clients can browse:
 *   - inspectagents://failures/all     – Full failures database
 *   - inspectagents://checklist/full   – Complete 50-point checklist
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
        'The complete InspectAgents AI failures database — 500+ documented incidents with ' +
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
        'The complete 50-point AI Agent Risk Checklist — 8 categories with severity levels, ' +
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
              total: 50,
              lastUpdated: '2026-02-14',
              source: 'https://inspectagents.com/checklist/',
              framework: 'OWASP Top 10 for LLM Applications',
              sections: CHECKLIST_SECTIONS.map((s) => ({
                title: s.title,
                subtitle: s.subtitle,
                count: s.count,
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
}
