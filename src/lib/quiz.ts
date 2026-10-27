/**
 * Client-safe quiz model: answer types, scoring, result copy and recommendations.
 * Shared by the quiz (/quiz) and the result page (/quiz/thank-you).
 * Scoring delegates to calculateRiskLevel in src/lib/email.ts so the site,
 * the welcome email and the MCP assess_risk tool agree.
 */
import { calculateRiskLevel } from '@/lib/email';

export type RiskLevel = 'low' | 'medium' | 'high';

export type Concern = 'hallucinations' | 'security' | 'reputation' | 'cost' | 'dontKnow';

export interface StoredQuizAnswers {
  currentlyUsing?: string;
  biggestFears?: string[];
  email?: string;
}

export const QUIZ_STORAGE_KEY = 'quizAnswers';
export const REPORT_SENT_KEY = 'quizReportSentTo';

export function scoreAnswers(a: StoredQuizAnswers): RiskLevel {
  return calculateRiskLevel({
    currentUsage: a.currentlyUsing || 'no',
    biggestFears: a.biggestFears || [],
    email: a.email || '',
  });
}

/** Plain-language reasons behind the score, so the result is explained, not asserted. */
export function riskFactors(a: StoredQuizAnswers): string[] {
  const out: string[] = [];
  const fears = a.biggestFears || [];
  if (a.currentlyUsing === 'yes') out.push('Your agent is already live with real users');
  else if (a.currentlyUsing === 'planning') out.push('You plan to deploy soon');
  else out.push('You are still researching');

  const named = fears.filter((f) => f !== 'dontKnow').length;
  if (named > 0) out.push(`You flagged ${named} risk area${named === 1 ? '' : 's'}`);
  if (fears.includes('dontKnow')) out.push('You are not sure what to test for yet');
  if (a.currentlyUsing === 'yes' && fears.includes('security')) {
    out.push('Security is a concern on a live system');
  }
  return out;
}

export const RISK_COPY: Record<RiskLevel, { label: string; headline: string; body: string }> = {
  high: {
    label: 'High exposure',
    headline: 'Test before your next release',
    body: 'Your setup matches several conditions behind documented AI failures. The three actions below close the most direct gaps first.',
  },
  medium: {
    label: 'Moderate exposure',
    headline: 'A few targeted tests will close the gaps',
    body: 'You know where the risks are. Turning that into repeatable tests is what keeps a small slip from becoming a public incident.',
  },
  low: {
    label: 'Lower exposure for now',
    headline: 'Build the testing habit before you scale',
    body: 'This is the cheapest moment to set up testing. Start with the actions below and keep the checklist for launch day.',
  },
};

/** Static class strings (Tailwind cannot see dynamically built class names). */
export const RISK_STYLES: Record<RiskLevel, { badge: string; panel: string; dot: string }> = {
  high: {
    badge: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200',
    panel: 'bg-red-50 border-red-200',
    dot: 'bg-red-600',
  },
  medium: {
    badge: 'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200',
    panel: 'bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
  },
  low: {
    badge: 'bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-200',
    panel: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-600',
  },
};

export interface Recommendation {
  title: string;
  description: string;
}

export function recommendations(a: StoredQuizAnswers, checklistCount: number): Recommendation[] {
  const fears = a.biggestFears || [];
  const recs: Recommendation[] = [];
  if (fears.includes('hallucinations')) {
    recs.push({
      title: 'Test answers against ground truth',
      description: 'Ask your agent questions with known correct answers, such as refund rules and prices, and fail the build when it invents one.',
    });
  }
  if (fears.includes('security')) {
    recs.push({
      title: 'Run prompt-injection tests',
      description: 'Try to make the agent ignore its instructions, reveal its system prompt or act outside its permissions, before an attacker does.',
    });
  }
  if (fears.includes('reputation')) {
    recs.push({
      title: 'Monitor live responses',
      description: 'Review what the agent actually says in production and alert on off-brand, abusive or out-of-policy output.',
    });
  }
  if (fears.includes('cost')) {
    recs.push({
      title: 'Cap spend and verify deliverables',
      description: 'Set hard budget limits on model usage and require a human check on any AI-written work you bill or publish.',
    });
  }
  if (fears.includes('dontKnow')) {
    recs.push({
      title: 'Start with the critical checks',
      description: `Work through the critical items in the ${checklistCount}-point checklist first. They cover the failure modes behind the best-known incidents.`,
    });
  }
  if (recs.length < 3) {
    recs.push({
      title: 'Run the full checklist before launch',
      description: `The ${checklistCount}-point checklist covers hallucination, prompt injection, data leaks, tool use and more, with a severity on every item.`,
    });
  }
  if (recs.length < 3) {
    recs.push({
      title: 'Re-test after every model or prompt change',
      description: 'A new model version or a small prompt edit can undo earlier fixes. Re-run your tests whenever either changes.',
    });
  }
  return recs.slice(0, 3);
}
