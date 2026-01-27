import { NextRequest, NextResponse } from 'next/server';
import { getEmailTags, getNurtureSequence } from '@/lib/email';

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
    console.warn('Resend module not available:', error);
  }
}

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';

/**
 * POST /api/subscribe
 * Subscribe user to email list with quiz data
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, firstName, quizAnswers, riskLevel, topPainPoints, provider } = data;

    // Validate required fields
    if (!email || !quizAnswers || !riskLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: email, quizAnswers, or riskLevel' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Determine provider (default to Resend if configured)
    const useProvider = provider || (process.env.RESEND_API_KEY ? 'resend' : 'convertkit');

    // Route to appropriate service
    if (useProvider === 'resend') {
      return await subscribeWithResend({ email, firstName, quizAnswers, riskLevel, topPainPoints });
    } else if (useProvider === 'convertkit') {
      return await subscribeWithConvertKit({ email, firstName, quizAnswers, riskLevel, topPainPoints });
    } else {
      return NextResponse.json(
        { error: 'Invalid email provider. Use "resend" or "convertkit".' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * Subscribe via Resend
 */
async function subscribeWithResend(data: any) {
  const { email, firstName, quizAnswers, riskLevel, topPainPoints } = data;

  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      throw new Error('Resend not configured. Set RESEND_API_KEY and RESEND_AUDIENCE_ID environment variables.');
    }

    // Generate tags for segmentation
    const tags = getEmailTags(quizAnswers, riskLevel);

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

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      contactId: contact.data.id,
      riskLevel,
      tags,
    });

  } catch (error: any) {
    console.error('Resend subscription error:', error);
    
    // Handle duplicate email
    if (error.message?.includes('already exists')) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
      });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to subscribe via Resend. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Subscribe via ConvertKit
 */
async function subscribeWithConvertKit(data: any) {
  const { email, firstName, quizAnswers, riskLevel, topPainPoints } = data;

  try {
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
      throw new Error('ConvertKit not configured. Set CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID.');
    }

    // Generate tags for segmentation
    const tags = getEmailTags(quizAnswers, riskLevel);

    // Subscribe to ConvertKit
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
            current_usage: quizAnswers.currentUsage,
            biggest_fears: quizAnswers.biggestFears.join(', '),
            experienced_failure: quizAnswers.experiencedFailure,
            role: quizAnswers.role,
            top_pain_points: topPainPoints.join(', '),
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'ConvertKit API error');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
      subscriberId: result.subscription?.subscriber?.id,
      riskLevel,
      tags,
    });

  } catch (error: any) {
    console.error('ConvertKit subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe via ConvertKit. Please try again.' },
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
      console.warn('Resend not configured. Skipping welcome email.');
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

  } catch (error) {
    console.error('Failed to send welcome email:', error);
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
