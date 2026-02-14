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

    // Generate a short reference number from timestamp + random
    const refNumber = `INS-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject} (${refNumber})`,
      html: buildContactEmail({ name, email, subject, message, refNumber }),
    });

    const resendId = result?.data?.id;

    // Send confirmation to the requester
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `We received your request — ${refNumber}`,
        html: buildConfirmationEmail({ name, subject, refNumber }),
      });
    } catch (confirmErr) {
      logger.error('Failed to send confirmation email', confirmErr instanceof Error ? confirmErr : new Error(String(confirmErr)));
    }

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

/**
 * Build a simple HTML email from the contact form data.
 */
function buildContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  refNumber: string;
}): string {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="color: #1a2e44; margin: 0;">New Service Request</h2>
        <span style="background: #059669; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${data.refNumber}</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; width: 120px; background: #f9fafb;">Reference</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-family: monospace; font-weight: 600; color: #059669;">${data.refNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; background: #f9fafb;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${data.name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; background: #f9fafb;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><a href="mailto:${data.email}" style="color: #059669;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; background: #f9fafb;">Service</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${data.subject}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: 600; background: #f9fafb;">Submitted</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jerusalem' })}</td>
        </tr>
      </table>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Message</h3>
        <p style="margin: 0; white-space: pre-wrap; color: #1a2e44; line-height: 1.6;">${data.message}</p>
      </div>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        Sent from <a href="https://inspectagents.com/contact/" style="color: #9ca3af;">InspectAgents.com</a> contact form
      </p>
    </div>
  `;
}

/**
 * Build confirmation email sent to the requester.
 */
function buildConfirmationEmail(data: {
  name: string;
  subject: string;
  refNumber: string;
}): string {
  const greeting = data.name ? `Hi ${data.name},` : 'Hi there,';
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #059669; font-size: 24px; margin: 0;">InspectAgents</h1>
      </div>
      <p style="color: #1a2e44; font-size: 16px; line-height: 1.6;">${greeting}</p>
      <p style="color: #1a2e44; font-size: 16px; line-height: 1.6;">
        We received your service request for <strong>${data.subject}</strong>. Our team will review it and get back to you within 24 hours.
      </p>
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Your Reference Number</p>
        <p style="margin: 0; font-size: 22px; font-weight: 700; font-family: monospace; color: #059669;">${data.refNumber}</p>
      </div>
      <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
        Keep this reference number — you can use it in any follow-up communication.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-bottom: 4px;">While you wait, explore our free resources:</p>
      <ul style="padding-left: 20px; margin: 8px 0 24px 0;">
        <li style="margin-bottom: 6px;"><a href="https://inspectagents.com/quiz/" style="color: #059669; text-decoration: none; font-weight: 500;">Take the AI Risk Quiz</a> — 2-min assessment of your AI agent risk level</li>
        <li style="margin-bottom: 6px;"><a href="https://inspectagents.com/checklist/" style="color: #059669; text-decoration: none; font-weight: 500;">50-Point Safety Checklist</a> — printable checklist aligned with OWASP Top 10</li>
        <li style="margin-bottom: 6px;"><a href="https://inspectagents.com/failures/" style="color: #059669; text-decoration: none; font-weight: 500;">AI Failures Database</a> — 20+ real-world AI incidents with breakdowns</li>
        <li style="margin-bottom: 6px;"><a href="https://inspectagents.com/blog/" style="color: #059669; text-decoration: none; font-weight: 500;">Blog &amp; Guides</a> — in-depth articles on testing AI agents</li>
      </ul>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
        — The InspectAgents Team<br />
        <a href="https://inspectagents.com" style="color: #9ca3af;">inspectagents.com</a>
      </p>
    </div>
  `;
}
