import { NextRequest, NextResponse } from 'next/server';
import { getEmailTags } from '@/lib/email';
import { 
  sanitizeEmail, 
  sanitizeName, 
  sanitizeQuizAnswers, 
  sanitizeArray,
  validateRiskLevel 
} from '@/lib/sanitize';
import { rateLimiters, getClientIp, getRateLimitHeaders } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';
import WelcomeHighRisk from '@/emails/WelcomeHighRisk';
import WelcomeMediumRisk from '@/emails/WelcomeMediumRisk';
import WelcomeLowRisk from '@/emails/WelcomeLowRisk';

// Initialize Resend only if API key is available
let resend: any = null;
let Resend: any = null;

if (process.env.RESEND_API_KEY) {
  try {
    // Dynamic import to avoid build errors when Resend is not configured
    const ResendModule = require('resend');
    Resend = ResendModule.Resend;
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    logger.warn('Resend module not available', { error: error instanceof Error ? error.message : String(error) });
  }
}

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';

/**
 * POST /api/subscribe
 * Subscribe user to email list with quiz data
 * 
 * Security features:
 * - Rate limiting (3 requests per 5 minutes per IP)
 * - Input sanitization
 * - Validated risk level enum
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimiters.subscribe.limit(clientIp);
    
    if (!rateLimitResult.success) {
      logger.security('rate_limit_exceeded', { 
        ip: clientIp, 
        endpoint: '/api/subscribe',
        retryAfter: rateLimitResult.retryAfter 
      });
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const data = await request.json();
    
    // Sanitize all inputs
    const email = sanitizeEmail(data.email);
    const firstName = sanitizeName(data.firstName);
    const quizAnswers = sanitizeQuizAnswers(data.quizAnswers);
    const riskLevel = validateRiskLevel(data.riskLevel);
    const topPainPoints = sanitizeArray(data.topPainPoints);

    // Validate required fields
    if (!email || Object.keys(quizAnswers).length === 0 || !riskLevel) {
      logger.warn('Invalid subscription request', { 
        hasEmail: !!email, 
        hasQuizAnswers: Object.keys(quizAnswers).length > 0, 
        hasRiskLevel: !!riskLevel 
      });
      return NextResponse.json(
        { error: 'Missing required fields: email, quizAnswers, or riskLevel' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.security('invalid_email_attempt', { ip: clientIp });
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Subscribe via Resend
    const response = await subscribeWithResend({ email, firstName, quizAnswers, riskLevel, topPainPoints });

    // Log successful request
    const duration = Date.now() - startTime;
    logger.apiRequest('/api/subscribe', 'POST', response.status, duration, { 
      provider: 'resend',
      riskLevel 
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

/**
 * Subscribe via Resend
 */
async function subscribeWithResend(data: {
  email: string;
  firstName: string;
  quizAnswers: Record<string, string | string[]>;
  riskLevel: 'low' | 'medium' | 'high';
  topPainPoints: string[];
}) {
  const { email, firstName, quizAnswers, riskLevel, topPainPoints } = data;

  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      throw new Error('Resend not configured. Set RESEND_API_KEY environment variable.');
    }

    // Generate tags for segmentation
    const tags = getEmailTags(quizAnswers as any, riskLevel);

    // Optionally add contact to Resend audience (if AUDIENCE_ID is configured)
    let contactId: string | undefined;
    if (AUDIENCE_ID) {
      try {
        const contact = await resend.contacts.create({
          email,
          firstName: firstName || email.split('@')[0],
          audienceId: AUDIENCE_ID,
          unsubscribed: false,
        });
        contactId = contact.data?.id;
      } catch (audienceError: any) {
        // Don't fail if audience add fails — just log it
        if (!audienceError.message?.includes('already exists')) {
          logger.warn('Failed to add contact to audience', { error: audienceError.message });
        }
      }
    }

    // Send immediate welcome email based on risk level
    await sendWelcomeEmail(email, firstName || email.split('@')[0], riskLevel, topPainPoints);

    logger.info('Subscription successful via Resend', { riskLevel });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      ...(contactId && { contactId }),
      riskLevel,
      tags,
    });

  } catch (error: any) {
    logger.error('Resend subscription error', error);
    
    // Handle duplicate email
    if (error.message?.includes('already exists')) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
      });
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Send welcome email via Resend
 */
async function sendWelcomeEmail(
  email: string,
  firstName: string,
  riskLevel: 'low' | 'medium' | 'high',
  topPainPoints: string[]
) {
  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      logger.warn('Resend not configured. Skipping welcome email.');
      return;
    }

    // Select email template based on risk level
    const templates = {
      high: WelcomeHighRisk,
      medium: WelcomeMediumRisk,
      low: WelcomeLowRisk,
    };

    const EmailTemplate = templates[riskLevel];

    // Send email
    await resend.emails.send({
      from: 'InspectAgents <hello@inspectagents.com>',
      to: email,
      subject: getWelcomeSubject(riskLevel),
      react: EmailTemplate({ firstName, topPainPoints }),
    });

    logger.info('Welcome email sent', { riskLevel });

  } catch (error) {
    logger.error('Failed to send welcome email', error instanceof Error ? error : new Error(String(error)));
    // Don't fail the subscription if email fails
  }
}

/**
 * Get welcome email subject based on risk level
 */
function getWelcomeSubject(riskLevel: 'low' | 'medium' | 'high'): string {
  const subjects = {
    high: '🚨 Your AI Risk Report + Urgent Action Steps',
    medium: '⚠️ Your AI Risk Assessment + What to Do Next',
    low: '✅ Your AI Safety Checklist + Best Practices',
  };
  return subjects[riskLevel];
}
