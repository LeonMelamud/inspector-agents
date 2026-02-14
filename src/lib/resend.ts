/**
 * Centralized Resend service — single source of truth for all email & contact operations.
 *
 * Domain responsibilities:
 * - Contacts: create, upsert
 * - Emails: send transactional emails (welcome, confirmation)
 * - Templates: select welcome email template based on risk level
 *
 * All API routes delegate to this module instead of initializing Resend themselves.
 */

import { Resend } from 'resend';
import { createElement } from 'react';
import { logger } from '@/lib/logger';
import WelcomeHighRisk from '@/emails/WelcomeHighRisk';
import WelcomeMediumRisk from '@/emails/WelcomeMediumRisk';
import WelcomeLowRisk from '@/emails/WelcomeLowRisk';

// ─── Singleton ──────────────────────────────────────────────────────────────────

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = 'InspectAgents <hello@inspectagents.com>';

// ─── Helpers ────────────────────────────────────────────────────────────────────

function ensureResend(): Resend {
  if (!resend) {
    throw new Error('Resend not configured. Set RESEND_API_KEY environment variable.');
  }
  return resend;
}

// ─── Contacts ───────────────────────────────────────────────────────────────────

export interface CreateContactInput {
  email: string;
  firstName?: string;
  source?: string;
}

/**
 * Create a contact in Resend's global contact list.
 * Returns the contact ID on success, undefined on failure (never throws).
 */
export async function createContact(input: CreateContactInput): Promise<string | undefined> {
  try {
    const r = ensureResend();
    const result = await r.contacts.create({
      email: input.email,
      firstName: input.firstName || undefined,
      lastName: input.source || undefined,
      unsubscribed: false,
    });
    const contactId = result.data?.id;
    logger.info('Contact created', { contactId, email: input.email, source: input.source });
    return contactId;
  } catch (err: any) {
    // Duplicate contact is not an error from the user's perspective
    if (err.message?.includes('already exists')) {
      logger.info('Contact already exists', { email: input.email });
      return undefined;
    }
    logger.error('Failed to create contact', {
      error: err.message,
      statusCode: err.statusCode,
      email: input.email,
    });
    return undefined;
  }
}

// ─── Transactional emails ───────────────────────────────────────────────────────

/**
 * Send a welcome email based on the user's quiz risk level.
 */
export async function sendWelcomeEmail(input: {
  email: string;
  firstName: string;
  riskLevel: 'low' | 'medium' | 'high';
  topPainPoints: string[];
}): Promise<void> {
  try {
    const r = ensureResend();

    const templates = {
      high: WelcomeHighRisk,
      medium: WelcomeMediumRisk,
      low: WelcomeLowRisk,
    };

    const subjects: Record<string, string> = {
      high: '🚨 Your AI Risk Report + Urgent Action Steps',
      medium: '⚠️ Your AI Risk Assessment + What to Do Next',
      low: '✅ Your AI Safety Checklist + Best Practices',
    };

    const Template = templates[input.riskLevel];

    const result = await r.emails.send({
      from: FROM_EMAIL,
      to: input.email,
      subject: subjects[input.riskLevel],
      react: createElement(Template, { firstName: input.firstName, topPainPoints: input.topPainPoints }),
    });

    if (result.error) {
      logger.error('Resend API error sending welcome email', {
        error: result.error,
        email: input.email,
        riskLevel: input.riskLevel,
      });
      return;
    }

    logger.info('Welcome email sent', { riskLevel: input.riskLevel, email: input.email, emailId: result.data?.id });
  } catch (err) {
    logger.error('Failed to send welcome email', err instanceof Error ? err : new Error(String(err)));
    // Non-fatal — don't fail the signup
  }
}

/**
 * Send a contact-form confirmation email with a reference number.
 */
export async function sendContactConfirmation(input: {
  email: string;
  name: string;
  subject: string;
  refNumber: string;
}): Promise<string | undefined> {
  const r = ensureResend();

  const result = await r.emails.send({
    from: FROM_EMAIL,
    to: input.email,
    subject: `We received your request — ${input.refNumber}`,
    html: buildConfirmationHtml(input),
  });

  if (result.error) {
    logger.error('Resend API error sending contact confirmation', {
      error: result.error,
      email: input.email,
      refNumber: input.refNumber,
    });
    return undefined;
  }

  return result.data?.id;
}

/**
 * Check whether Resend is configured (API key present).
 */
export function isConfigured(): boolean {
  return !!resend;
}

/**
 * Generate a unique reference number for contact form submissions.
 */
export function generateRefNumber(): string {
  return `INS-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

// ─── HTML templates ─────────────────────────────────────────────────────────────

function buildConfirmationHtml(data: {
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
        <li style="margin-bottom: 6px;"><a href="https://inspectagents.com/checklist/" style="color: #059669; text-decoration: none; font-weight: 500;">56-Point Safety Checklist</a> — printable checklist aligned with OWASP Top 10</li>
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
