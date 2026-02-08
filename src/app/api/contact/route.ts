import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail, sanitizeName, sanitizeInput } from '@/lib/sanitize';
import { rateLimiters, getClientIp, getRateLimitHeaders } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';

// Initialize Resend only if API key is available
let resend: any = null;

if (process.env.RESEND_API_KEY) {
  try {
    const ResendModule = require('resend');
    resend = new ResendModule.Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    logger.warn('Resend module not available', { error: error instanceof Error ? error.message : String(error) });
  }
}

const CONTACT_TO_EMAIL = process.env.CONTACT_EMAIL || 'leonmelamud@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'InspectAgents <hello@inspectagents.com>';

/**
 * POST /api/contact
 * Receive a contact form submission and forward it via Resend email.
 *
 * Security features:
 * - Rate limiting (2 requests per 5 minutes per IP)
 * - Input sanitization
 * - Length limits on all fields
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting — stricter than subscribe
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimiters.strict.limit(clientIp);

    if (!rateLimitResult.success) {
      logger.security('rate_limit_exceeded', {
        ip: clientIp,
        endpoint: '/api/contact',
        retryAfter: rateLimitResult.retryAfter,
      });

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        },
      );
    }

    const data = await request.json();

    // Sanitize inputs
    const name = sanitizeName(data.name);
    const email = sanitizeEmail(data.email);
    const subject = sanitizeInput(data.subject)?.slice(0, 200) || 'Contact Form Submission';
    const message = sanitizeInput(data.message)?.slice(0, 5000);

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.security('invalid_email_attempt', { ip: clientIp, endpoint: '/api/contact' });
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters.' },
        { status: 400 },
      );
    }

    // Send via Resend
    if (!resend || !process.env.RESEND_API_KEY) {
      logger.warn('Contact form submitted but Resend not configured', { email });
      // Still return success to not leak infra details
      return NextResponse.json({
        success: true,
        message: 'Your message has been received. We will get back to you soon!',
      });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: buildContactEmail({ name, email, subject, message }),
    });

    const duration = Date.now() - startTime;
    logger.info('Contact form sent', { email, subject });
    logger.apiRequest('/api/contact', 'POST', 200, duration);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent! We\'ll get back to you within 24 hours.',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Contact form error', error instanceof Error ? error : new Error(String(error)));
    logger.apiRequest('/api/contact', 'POST', 500, duration);

    return NextResponse.json(
      { error: 'Failed to send your message. Please try again later.' },
      { status: 500 },
    );
  }
}

/**
 * Build a simple HTML email from the contact form data.
 */
function buildContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a2e44; margin-bottom: 16px;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; width: 100px; background: #f9fafb;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${data.name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; background: #f9fafb;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; background: #f9fafb;">Subject</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${data.subject}</td>
        </tr>
      </table>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Message</h3>
        <p style="margin: 0; white-space: pre-wrap; color: #1a2e44; line-height: 1.6;">${data.message}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
        Sent from InspectAgents.com contact form
      </p>
    </div>
  `;
}
