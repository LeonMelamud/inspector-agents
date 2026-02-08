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
    const provider = data.provider;

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

    // Determine provider (default priority: n8n > Resend > ConvertKit)
    const useProvider = provider || 
      (process.env.N8N_WEBHOOK_URL ? 'n8n' : 
       (process.env.RESEND_API_KEY ? 'resend' : 'convertkit'));

    // Route to appropriate service with sanitized data
    let response: NextResponse;
    if (useProvider === 'n8n') {
      response = await subscribeWithN8n({ email, firstName, quizAnswers, riskLevel, topPainPoints });
    } else if (useProvider === 'resend') {
      response = await subscribeWithResend({ email, firstName, quizAnswers, riskLevel, topPainPoints });
    } else if (useProvider === 'convertkit') {
      response = await subscribeWithConvertKit({ email, firstName, quizAnswers, riskLevel, topPainPoints });
    } else {
      return NextResponse.json(
        { error: 'Invalid email provider. Use "n8n", "resend", or "convertkit".' },
        { status: 400 }
      );
    }

    // Log successful request
    const duration = Date.now() - startTime;
    logger.apiRequest('/api/subscribe', 'POST', response.status, duration, { 
      provider: useProvider,
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
 * Subscribe via n8n webhook
 * Sends all quiz data to n8n for processing (email, storage, etc.)
 */
async function subscribeWithN8n(data: {
  email: string;
  firstName: string;
  quizAnswers: Record<string, string | string[]>;
  riskLevel: 'low' | 'medium' | 'high';
  topPainPoints: string[];
}) {
  const { email, firstName, quizAnswers, riskLevel, topPainPoints } = data;

  try {
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    if (!N8N_WEBHOOK_URL) {
      throw new Error('n8n not configured. Set N8N_WEBHOOK_URL environment variable.');
    }

    // Generate tags for segmentation
    const tags = getEmailTags(quizAnswers as any, riskLevel);

    // Send complete data to n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName: firstName || email.split('@')[0],
        riskLevel,
        quizAnswers,
        topPainPoints,
        tags,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n webhook error: ${response.status} ${errorText}`);
    }

    const result = await response.json().catch(() => ({ success: true }));

    logger.info('Subscription successful via n8n', { riskLevel });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      riskLevel,
      tags,
      ...result,
    });

  } catch (error: any) {
    logger.error('n8n subscription error', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
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
      throw new Error('Resend not configured. Set RESEND_API_KEY and RESEND_AUDIENCE_ID environment variables.');
    }

    // Generate tags for segmentation
    const tags = getEmailTags(quizAnswers as any, riskLevel);

    // Add contact to Resend audience
    const contact = await resend.contacts.create({
      email,
      firstName: firstName || email.split('@')[0],
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    });

    if (!contact.data) {
      throw new Error('Failed to create contact in Resend');
    }

    // Send immediate welcome email based on risk level
    await sendWelcomeEmail(email, firstName || email.split('@')[0], riskLevel, topPainPoints);

    logger.info('Subscription successful via Resend', { riskLevel });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      contactId: contact.data.id,
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
 * Subscribe via ConvertKit
 * Note: ConvertKit API requires api_key in request body (not header) per their official docs
 */
async function subscribeWithConvertKit(data: {
  email: string;
  firstName: string;
  quizAnswers: Record<string, string | string[]>;
  riskLevel: 'low' | 'medium' | 'high';
  topPainPoints: string[];
}) {
  const { email, firstName, quizAnswers, riskLevel, topPainPoints } = data;

  try {
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
      throw new Error('ConvertKit not configured. Set CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID.');
    }

    // Generate tags for segmentation
    const tags = getEmailTags(quizAnswers as any, riskLevel);

    // Prepare sanitized fields for ConvertKit
    const biggestFears = Array.isArray(quizAnswers.biggestFears) 
      ? quizAnswers.biggestFears.join(', ') 
      : '';
    const painPoints = Array.isArray(topPainPoints) 
      ? topPainPoints.join(', ') 
      : '';

    // Subscribe to ConvertKit
    // Note: ConvertKit requires api_key in body per their API spec
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email,
          first_name: firstName || email.split('@')[0],
          tags,
          fields: {
            risk_level: riskLevel,
            quiz_completed: new Date().toISOString(),
            current_usage: quizAnswers.currentUsage || '',
            biggest_fears: biggestFears,
            experienced_failure: quizAnswers.experiencedFailure || '',
            role: quizAnswers.role || '',
            top_pain_points: painPoints,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'ConvertKit API error');
    }

    const result = await response.json();

    logger.info('Subscription successful via ConvertKit', { riskLevel });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      subscriberId: result.subscription?.subscriber?.id,
      riskLevel,
      tags,
    });

  } catch (error: any) {
    logger.error('ConvertKit subscription error', error);
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
      high: 'WelcomeHighRisk',
      medium: 'WelcomeMediumRisk',
      low: 'WelcomeLowRisk',
    };

    // Import the appropriate template
    const { default: EmailTemplate } = await import(`@/emails/${templates[riskLevel]}`);

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
