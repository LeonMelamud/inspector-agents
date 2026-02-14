import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail, sanitizeName, sanitizeInput } from '@/lib/sanitize';
import { rateLimiters, getClientIp, getRateLimitHeaders } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';
import { sendContactConfirmation, generateRefNumber, isConfigured } from '@/lib/resend';

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
    if (!isConfigured()) {
      logger.warn('Contact form submitted but Resend not configured', { email });
      return NextResponse.json({
        success: true,
        message: 'Your message has been received. We will get back to you soon!',
      });
    }

    const refNumber = generateRefNumber();

    // Log full submission details (instead of sending admin email)
    logger.info('Contact form submission', { refNumber, name, email, subject, message });

    // Send confirmation to the requester
    const resendId = await sendContactConfirmation({ email, name, subject, refNumber });

    const duration = Date.now() - startTime;
    logger.info('Contact form sent', { email, subject, refNumber, resendId });
    logger.apiRequest('/api/contact', 'POST', 200, duration);

    return NextResponse.json({
      success: true,
      message: `Your message has been sent! Reference: ${refNumber}. We'll get back to you within 24 hours.`,
      refNumber,
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

// Confirmation email template lives in src/lib/resend.ts
