/**
 * MCP Tool definitions for InspectAgents.
 *
 * Five tools exposing the core site capabilities to AI agents:
 *   1. search_failures  – Search/filter the AI failures database
 *   2. get_failure       – Get full details of a single failure
 *   3. assess_risk       – Run the AI risk assessment quiz
 *   4. get_checklist     – Retrieve the 56-point testing checklist
 *   5. submit_feedback   – Submit feedback / incident reports
 */

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { failures } from '@/app/failures/data';
import { calculateRiskLevel as calculateEmailRiskLevel } from '@/lib/email';
import { logger } from '@/lib/logger';
import {
  CHECKLIST_SECTIONS,
  filterChecklist,
  type Severity,
} from '@/lib/mcp/data/checklist';

// ── Risk calculation (delegates to shared logic in src/lib/email.ts) ────────

function calculateRiskLevel(answers: {
  currentlyUsing: string;
  biggestFears: string[];
}): 'low' | 'medium' | 'high' {
  // Map MCP tool field names → email.ts field names
  return calculateEmailRiskLevel({
    currentUsage: answers.currentlyUsing,
    biggestFears: answers.biggestFears,
    email: '', // not needed for risk calculation
  });
}

// ── Recommendation text by risk level ───────────────────────────────────────

const RISK_RECOMMENDATIONS: Record<string, string[]> = {
  high: [
    'Immediately audit all production AI agents for prompt injection vulnerabilities',
    'Implement output validation and content filtering on all chatbot responses',
    'Set up real-time monitoring with kill-switch capability',
    'Run the full 56-point InspectAgents checklist before any new deployment',
    'Consider a professional red-team assessment',
  ],
  medium: [
    'Schedule a comprehensive security review of your AI deployment pipeline',
    'Implement guardrails for hallucination detection and prompt injection',
    'Set up monitoring dashboards for AI agent behavior',
    'Use the InspectAgents checklist as a pre-deployment gate',
  ],
  low: [
    'Review common AI failure patterns before your first deployment',
    'Familiarize yourself with the InspectAgents failures database',
    'Start with the AI Risk Checklist to build a testing plan',
    'Consider prompt injection risks even at the research stage',
  ],
};

// ── Register all tools on an McpServer instance ─────────────────────────────

export function registerTools(server: McpServer): void {
  // ──────────────────────── 1. search_failures ────────────────────────────
  server.tool(
    'search_failures',
    'Search and filter the InspectAgents AI failures database (500+ incidents). ' +
      'Returns matching incidents with title, company, category, severity, description, ' +
      'impact, cost, and prevention strategies.',
    {
      query: z
        .string()
        .optional()
        .describe(
          'Free-text search across title, company, description, and impact'
        ),
      category: z
        .enum([
          'Hallucination',
          'Prompt Injection',
          'Security',
          'Bias',
          'Jailbreak',
          'Misinformation',
          'Privacy',
          'Safety',
        ])
        .optional()
        .describe('Filter by failure category'),
      severity: z
        .enum(['Low', 'Medium', 'High', 'Critical'])
        .optional()
        .describe('Filter by severity level'),
      year: z
        .number()
        .int()
        .optional()
        .describe('Filter by year of incident (e.g. 2024)'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe('Maximum number of results to return (default 10, max 50)'),
    },
    async ({ query, category, severity, year, limit }) => {
      let results = [...failures];

      if (query) {
        const q = query.toLowerCase();
        results = results.filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.company.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            f.impact.toLowerCase().includes(q)
        );
      }

      if (category) results = results.filter((f) => f.category === category);
      if (severity) results = results.filter((f) => f.severity === severity);
      if (year)
        results = results.filter(
          (f) => new Date(f.date).getFullYear() === year
        );

      const total = results.length;
      results = results.slice(0, limit);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                total,
                returned: results.length,
                failures: results.map((f) => ({
                  id: f.id,
                  title: f.title,
                  company: f.company,
                  date: f.date,
                  category: f.category,
                  severity: f.severity,
                  description: f.description,
                  impact: f.impact,
                  cost: f.cost ?? null,
                  prevention: f.prevention,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ──────────────────────── 2. get_failure ────────────────────────────────
  server.tool(
    'get_failure',
    'Get full details of a single AI failure by its ID. ' +
      'Returns the complete incident record including description, impact, cost, source, and prevention strategies.',
    {
      id: z.string().describe('The unique failure ID (e.g. "chevrolet-car-sale")'),
    },
    async ({ id }) => {
      const failure = failures.find((f) => f.id === id);
      if (!failure) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: 'Failure not found',
                available_ids: failures.map((f) => f.id),
              }),
            },
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(failure, null, 2),
          },
        ],
      };
    }
  );

  // ──────────────────────── 3. assess_risk ────────────────────────────────
  server.tool(
    'assess_risk',
    'Run the InspectAgents AI Risk Assessment. Provide answers to two questions ' +
      'and receive a risk level (low/medium/high) with personalized recommendations.',
    {
      currentlyUsing: z
        .enum(['yes', 'planning', 'no'])
        .describe(
          'Are you using AI agents in your business? "yes" = live in production, "planning" = deploying soon, "no" = just researching'
        ),
      biggestFears: z
        .array(
          z.enum([
            'hallucinations',
            'security',
            'reputation',
            'cost',
            'dontKnow',
          ])
        )
        .min(1)
        .describe(
          'What worries you most? Select one or more: hallucinations, security, reputation, cost, dontKnow'
        ),
    },
    async ({ currentlyUsing, biggestFears }) => {
      const riskLevel = calculateRiskLevel({ currentlyUsing, biggestFears });
      const recommendations = RISK_RECOMMENDATIONS[riskLevel];

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                riskLevel,
                riskLabel:
                  riskLevel === 'high'
                    ? '🔴 High Risk'
                    : riskLevel === 'medium'
                      ? '🟡 Medium Risk'
                      : '🟢 Low Risk',
                summary:
                  riskLevel === 'high'
                    ? 'Your AI deployment has significant risk factors. Immediate action recommended.'
                    : riskLevel === 'medium'
                      ? 'You have moderate risk. Structured testing will help reduce exposure.'
                      : 'Your risk is currently low, but proactive testing is still recommended.',
                recommendations,
                nextSteps: {
                  checklist: 'https://inspectagents.com/checklist/',
                  failures: 'https://inspectagents.com/failures/',
                  guide:
                    'https://inspectagents.com/blog/how-to-test-ai-agents/',
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ──────────────────────── 4. get_checklist ──────────────────────────────
  server.tool(
    'get_checklist',
    'Retrieve the InspectAgents 56-point AI Agent Risk Checklist. ' +
      'Optionally filter by severity (critical/high/medium), section name, or search query.',
    {
      severity: z
        .enum(['critical', 'high', 'medium'])
        .optional()
        .describe('Filter by severity level'),
      section: z
        .string()
        .optional()
        .describe(
          'Filter by section name (e.g. "Hallucination", "Prompt Injection", "Security")'
        ),
      query: z
        .string()
        .optional()
        .describe('Free-text search across item names and descriptions'),
    },
    async ({ severity, section, query }) => {
      if (severity || section || query) {
        const items = filterChecklist({
          severity: severity as Severity | undefined,
          section,
          query,
        });
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  total: items.length,
                  filters: { severity, section, query },
                  items,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Return full checklist
      const totalItems = CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.count, 0);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                total: totalItems,
                sections: CHECKLIST_SECTIONS.map((s) => ({
                  title: s.title,
                  subtitle: s.subtitle,
                  count: s.count,
                  items: s.items,
                })),
                source: 'https://inspectagents.com/checklist/',
                note: 'Aligned with the OWASP Top 10 for LLM Applications framework.',
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // ──────────────────────── 5. submit_feedback ────────────────────────────
  server.tool(
    'submit_feedback',
    'Submit feedback, corrections, or new AI incident reports to InspectAgents. ' +
      'All submissions are reviewed by the InspectAgents team.',
    {
      type: z
        .enum(['feedback', 'correction', 'incident', 'suggestion'])
        .describe(
          'Type of submission: feedback, correction (fix existing entry), incident (report new failure), or suggestion'
        ),
      message: z
        .string()
        .max(5000)
        .describe(
          'The feedback content, incident description, or correction details (max 5000 chars)'
        ),
      source: z
        .string()
        .max(200)
        .optional()
        .describe(
          'Identifier of the AI agent submitting (e.g. "Claude", "ChatGPT")'
        ),
      url: z
        .string()
        .url()
        .max(500)
        .optional()
        .describe('Reference URL if applicable'),
    },
    async ({ type, message, source, url }) => {
      const id = `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      // Persist via structured logger (same pattern as /api/agent-feedback)
      logger.info('MCP agent feedback received', {
        id,
        type,
        source: source ?? 'unknown',
        url: url ?? undefined,
        messageLength: message.length,
        channel: 'mcp',
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                success: true,
                id,
                message:
                  'Thank you for your submission. InspectAgents reviews all agent feedback.',
                note: 'For urgent corrections, also email hello@inspectagents.com',
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
