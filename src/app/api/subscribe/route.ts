import { NextRequest, NextResponse } from 'next/server';
import { getEmailTags } from '@/lib/email';
import {
  sanitizeEmail,
  sanitizeName,
  sanitizeQuizAnswers,
  sanitizeArray,
  validateRiskLevel,
} from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { createContact, sendWelcomeEmail, isConfigured } from '@/lib/resend';

/**
 * POST /api/subscribe
 * Subscribe user to email list with quiz data
 * 
 * Security features:
 * - Input sanitization
 * - Validated risk level enum
 * - Rate limiting handled by Resend
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const data = await request.json();
    
    // Sanitize all inputs
    const email = sanitizeEmail(data.email);
    const firstName = sanitizeName(data.firstName);
    const source = typeof data.source === 'string' ? data.source : '';
    const quizAnswers = sanitizeQuizAnswers(data.quizAnswers);
    const riskLevel = validateRiskLevel(data.riskLevel);
    const topPainPoints = sanitizeArray(data.topPainPoints);

    // Validate email is always required
    if (!email) {
      logger.warn('Invalid subscription request - missing email');
      return NextResponse.json(
        { error: 'Missing required field: email' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.security('invalid_email_attempt', { endpoint: '/api/subscribe' });
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Determine if this is a waitlist-only signup (no quiz data)
    const isWaitlistOnly = !riskLevel || Object.keys(quizAnswers).length === 0;

    if (!isConfigured()) {
      logger.warn('Resend not configured — subscription logged only', { email, source });
      return NextResponse.json({
        success: true,
        message: 'Subscription recorded.',
        source,
      });
    }

    // 1. Create contact (shared for both flows)
    const contactId = await createContact({ email, firstName, source });

    let response: NextResponse;

    if (isWaitlistOnly) {
      // Waitlist-only signup: contact created, done
      logger.info('Waitlist signup', { email, source, contactId });

      response = NextResponse.json({
        success: true,
        message: 'Successfully joined the waitlist!',
        ...(contactId && { contactId }),
        source,
      });
    } else {
      // Quiz signup: contact created + send welcome email
      const tags = getEmailTags(quizAnswers as any, riskLevel);

      await sendWelcomeEmail({
        email,
        firstName: firstName || '',
        riskLevel,
        topPainPoints,
      });

      logger.info('Quiz subscription successful', { email, source, riskLevel, contactId });

      response = NextResponse.json({
        success: true,
        message: 'Successfully subscribed!',
        ...(contactId && { contactId }),
        riskLevel,
        tags,
      });
    }

    // Log request
    const duration = Date.now() - startTime;
    logger.apiRequest('/api/subscribe', 'POST', response.status, duration, {
      provider: 'resend',
      riskLevel,
    });

    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Subscription error', error instanceof Error ? error : new Error(String(error)));
    logger.apiRequest('/api/subscribe', 'POST', 500, duration);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
