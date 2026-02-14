/**
 * Client-side email utilities for InspectAgents.
 *
 * Server-side Resend operations live in src/lib/resend.ts.
 * This file contains client-side helpers: quiz scoring, tag generation,
 * and the fetch wrapper used by React components to call /api/subscribe/.
 */

export interface QuizAnswers {
  currentUsage: string;
  biggestFears: string[];
  email: string;
}

export interface EmailData {
  email: string;
  firstName?: string;
  source?: string;
  quizAnswers: QuizAnswers;
  riskLevel: 'low' | 'medium' | 'high';
  topPainPoints: string[];
}

// ─── Quiz scoring ───────────────────────────────────────────────────────────────

/**
 * Calculate risk level based on quiz answers (3-question version)
 */
export function calculateRiskLevel(answers: QuizAnswers): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Current usage (0-2 points)
  if (answers.currentUsage === 'yes') riskScore += 2;
  else if (answers.currentUsage === 'planning') riskScore += 1;

  // Number of fears (0-3 points)
  if (answers.biggestFears.length >= 4) riskScore += 3;
  else if (answers.biggestFears.length >= 2) riskScore += 2;
  else if (answers.biggestFears.length >= 1) riskScore += 1;

  // "Don't know what to worry about" is highest risk
  if (answers.biggestFears.includes('dontKnow')) riskScore += 2;

  // Using AI in production + security fear = high risk
  if (answers.currentUsage === 'yes' && answers.biggestFears.includes('security')) riskScore += 1;

  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

/**
 * Get top pain points from quiz answers
 */
export function extractTopPainPoints(answers: QuizAnswers): string[] {
  const painPoints: string[] = [...answers.biggestFears];
  if (answers.currentUsage === 'yes') painPoints.push('in-production');
  return [...new Set(painPoints)];
}

// ─── Tag generation ─────────────────────────────────────────────────────────────

/**
 * Get email tags based on quiz answers
 */
export function getEmailTags(answers: QuizAnswers, riskLevel: 'low' | 'medium' | 'high'): string[] {
  const tags: string[] = [];
  tags.push(`risk-${riskLevel}`);
  tags.push(`usage-${answers.currentUsage}`);
  answers.biggestFears.forEach(fear => {
    tags.push(`fear-${fear}`);
  });
  return tags;
}

// ─── Client-side fetch wrapper ──────────────────────────────────────────────────

/**
 * Subscribe user via the /api/subscribe/ endpoint (client-side).
 */
export async function subscribeToNewsletter(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/subscribe/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to subscribe' };
    }

    return { success: true };
  } catch (error) {
    console.error('Subscription error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
