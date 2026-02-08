/**
 * Email service integration for InspectAgents
 * Supports Resend and ConvertKit for email capture and nurture sequences
 */

export interface QuizAnswers {
  currentUsage: string;
  biggestFears: string[];
  email: string;
}

export interface EmailData {
  email: string;
  firstName?: string;
  quizAnswers: QuizAnswers;
  riskLevel: 'low' | 'medium' | 'high';
  topPainPoints: string[];
}

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

/**
 * Subscribe user to email list via Resend
 */
export async function subscribeWithResend(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/subscribe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'resend',
        ...data,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to subscribe' };
    }

    return { success: true };
  } catch (error) {
    console.error('Resend subscription error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Subscribe user to email list via ConvertKit
 */
export async function subscribeWithConvertKit(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/subscribe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'convertkit',
        ...data,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to subscribe' };
    }

    return { success: true };
  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Subscribe user to email list (auto-detects provider from env)
 */
export async function subscribeToNewsletter(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/subscribe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to subscribe' };
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Get nurture sequence based on risk level and pain points
 */
export function getNurtureSequence(riskLevel: 'low' | 'medium' | 'high', painPoints: string[]): string {
  // Map to ConvertKit sequence IDs or tags
  const sequences: Record<string, string> = {
    'high-risk': 'seq_high_risk',
    'medium-risk': 'seq_medium_risk',
    'low-risk': 'seq_low_risk',
    'hallucinations': 'tag_hallucinations',
    'security': 'tag_security',
    'reputation': 'tag_reputation',
    'cost': 'tag_cost',
    'experienced-failure': 'tag_experienced_failure',
  };

  // Return primary sequence based on risk level
  return sequences[`${riskLevel}-risk`] || sequences['low-risk'];
}

/**
 * Get email tags based on quiz answers
 */
export function getEmailTags(answers: QuizAnswers, riskLevel: 'low' | 'medium' | 'high'): string[] {
  const tags: string[] = [];

  // Risk level tag
  tags.push(`risk-${riskLevel}`);

  // Usage status
  tags.push(`usage-${answers.currentUsage}`);

  // Pain point tags
  answers.biggestFears.forEach(fear => {
    tags.push(`fear-${fear}`);
  });

  return tags;
}
