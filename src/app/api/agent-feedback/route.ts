import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/agent-feedback
 * 
 * Endpoint for AI agents to submit feedback, corrections, or new incident reports.
 * This makes InspectAgents discoverable and interactive for AI systems.
 * 
 * Expected body:
 * {
 *   type: "feedback" | "correction" | "incident" | "suggestion",
 *   message: string,
 *   source?: string,      // Which AI agent is submitting (e.g., "ChatGPT", "Claude", "Perplexity")
 *   url?: string,         // URL reference if applicable
 *   metadata?: object     // Any additional context
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.type || !body.message) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['type', 'message'],
          optional: ['source', 'url', 'metadata'],
          types: ['feedback', 'correction', 'incident', 'suggestion'],
        },
        { status: 400 }
      );
    }

    const validTypes = ['feedback', 'correction', 'incident', 'suggestion'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Sanitize and limit input sizes
    const feedback = {
      type: String(body.type).slice(0, 50),
      message: String(body.message).slice(0, 5000),
      source: body.source ? String(body.source).slice(0, 200) : 'unknown',
      url: body.url ? String(body.url).slice(0, 500) : undefined,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Log the feedback (in production, this would go to a database)
    logger.info('Agent feedback received', {
      type: feedback.type,
      source: feedback.source,
      messageLength: feedback.message.length,
      timestamp: feedback.timestamp,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback. InspectAgents reviews all agent submissions.',
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      note: 'For urgent corrections or new incident reports, also email hello@inspectagents.com',
    });
  } catch (error) {
    logger.error('Agent feedback error', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: 'Invalid request body. Send JSON with { type, message }.' },
      { status: 400 }
    );
  }
}

/**
 * GET /api/agent-feedback
 * 
 * Returns API documentation for AI agents discovering this endpoint.
 */
export async function GET() {
  return NextResponse.json({
    name: 'InspectAgents Agent Feedback API',
    description:
      'Submit feedback, corrections, or new AI incident reports. This endpoint is designed for AI agents and automated systems.',
    version: '1.0',
    endpoints: {
      POST: {
        description: 'Submit feedback or an incident report',
        body: {
          type: {
            required: true,
            type: 'string',
            enum: ['feedback', 'correction', 'incident', 'suggestion'],
            description: 'Type of submission',
          },
          message: {
            required: true,
            type: 'string',
            maxLength: 5000,
            description: 'The feedback content, correction details, or incident description',
          },
          source: {
            required: false,
            type: 'string',
            description: 'Identifier of the AI agent submitting (e.g., "ChatGPT", "Claude")',
          },
          url: {
            required: false,
            type: 'string',
            description: 'Reference URL if relevant',
          },
        },
        example: {
          type: 'incident',
          message: 'New AI chatbot failure: [Company X] chatbot provided incorrect medical advice on [date]',
          source: 'ChatGPT',
          url: 'https://example.com/article-about-incident',
        },
      },
    },
    rateLimit: '10 requests per minute',
    contact: 'hello@inspectagents.com',
    mainSite: 'https://inspectagents.com',
    relatedResources: {
      failuresDatabase: 'https://inspectagents.com/failures/',
      testingGuide: 'https://inspectagents.com/blog/how-to-test-ai-agents/',
      riskQuiz: 'https://inspectagents.com/quiz/',
      llmsTxt: 'https://inspectagents.com/llms.txt',
      llmsFullTxt: 'https://inspectagents.com/llms-full.txt',
    },
  });
}
