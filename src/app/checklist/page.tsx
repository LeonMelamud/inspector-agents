import type { Metadata } from 'next';
import Link from 'next/link';
import { CHECKLIST_SECTIONS } from '@/lib/mcp/data/checklist';
import {
  CHECKLIST_CRITICAL_COUNT,
  CHECKLIST_ITEM_COUNT,
  CHECKLIST_SECTION_COUNT,
  INCIDENT_COUNT,
  getHeadlineIncidents,
} from '@/lib/site-stats';

export const metadata: Metadata = {
  title: `Free AI Agent Risk Checklist - ${CHECKLIST_ITEM_COUNT}-Point Safety Testing Guide`,
  description: `Download our ${CHECKLIST_ITEM_COUNT}-point AI agent risk checklist. Test for hallucinations, prompt injection, dark patterns, tool misuse and data leaks before deployment.`,
  keywords: [
    'AI agent checklist',
    'AI safety checklist',
    'AI testing checklist',
    'chatbot security checklist',
    'AI deployment checklist',
    'LLM testing guide',
    'AI risk assessment',
    'prompt injection checklist',
    'AI hallucination prevention',
    'agentic AI safety',
    'MCP security checklist',
    'AI tool use safety',
  ],
  alternates: {
    canonical: 'https://inspectagents.com/checklist/',
  },
  openGraph: {
    title: `Free AI Agent Risk Checklist - ${CHECKLIST_ITEM_COUNT}-Point Safety Testing Guide`,
    description: `Download our ${CHECKLIST_ITEM_COUNT}-point AI agent risk checklist. Test for hallucinations, prompt injection, dark patterns and security gaps before deployment.`,
    type: 'website',
    url: 'https://inspectagents.com/checklist',
  },
};

const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 bg-accent-500 text-primary-900 px-8 py-3.5 rounded-full font-bold hover:bg-accent-400 transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2';

const ARROW = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const USAGE_STEPS = [
  {
    title: 'Before deployment',
    body: `Run all ${CHECKLIST_ITEM_COUNT} checks before launch. Treat any failed critical item as a release blocker.`,
  },
  {
    title: 'After every change',
    body: 'Re-run the checklist when you change the model, the prompt or the data your agent retrieves. Small edits can undo earlier fixes.',
  },
  {
    title: 'On a schedule',
    body: 'Spot-check production regularly. Models drift and attack techniques change.',
  },
  {
    title: 'Fit it to your agent',
    body: 'Not every item applies to every agent. A support chatbot and an agent that calls tools need different emphasis; start with the critical items that apply.',
  },
];

const AUDIENCES = [
  { title: 'Founders and CTOs', body: 'You are shipping an AI feature and need to know the failure modes are covered.' },
  { title: 'AI engineers', body: 'You build the agent. Use it to test edge cases and adversarial inputs before production.' },
  { title: 'QA and testing teams', body: 'Use it as an AI-specific test plan for what manual testing misses.' },
  { title: 'Security and compliance', body: 'Audit existing deployments and flag gaps for remediation.' },
];

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes. No credit card, no email gate. Open it, print it, share it.',
  },
  {
    q: 'Do I need technical expertise?',
    a: 'No. Each item has a plain-English explanation and an example test. Some items, such as tool-use checks, are easier with an engineer.',
  },
  {
    q: 'How long does it take?',
    a: 'It depends on your agent. A simple FAQ chatbot is much quicker to check than an agent that calls tools or takes actions. Start with the critical items.',
  },
  {
    q: 'Can I share it with my team?',
    a: 'Yes, please do.',
  },
  {
    q: 'What format is it?',
    a: 'A clean, printable web page you can save as PDF from your browser.',
  },
  {
    q: 'Will it prevent every AI failure?',
    a: 'No checklist can. It covers the failure modes behind well-documented incidents, so you can find and fix the common ones before your customers do.',
  },
];

export default function ChecklistPage() {
  const incidents = getHeadlineIncidents();
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-900 mb-6 leading-[1.08] tracking-tight text-balance">
              The AI Agent Risk Checklist
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
              {CHECKLIST_ITEM_COUNT} checks to catch hallucinations, prompt injection, data leaks and unsafe tool use <em>before</em> they reach your customers.
            </p>
            <Link href="/checklist/download/" className={PRIMARY_BTN}>
              Open the checklist
              {ARROW}
            </Link>
            <p className="text-gray-600 text-sm mt-4">Free · printable · no signup</p>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-xl border-t border-gray-200 pt-6">
              <div>
                <dt className="text-sm text-gray-600">Checks</dt>
                <dd className="font-display text-3xl font-bold text-primary-900 tabular-nums">{CHECKLIST_ITEM_COUNT}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Risk categories</dt>
                <dd className="font-display text-3xl font-bold text-primary-900 tabular-nums">{CHECKLIST_SECTION_COUNT}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Critical-severity</dt>
                <dd className="font-display text-3xl font-bold text-primary-900 tabular-nums">{CHECKLIST_CRITICAL_COUNT}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
        {/* What's inside: rendered from the checklist data */}
        <section className="max-w-5xl mx-auto mb-20" aria-labelledby="inside-heading">
          <h2 id="inside-heading" className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-3">
            What&apos;s inside
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            {CHECKLIST_SECTION_COUNT} categories, aligned with the OWASP Top 10 for LLM Applications and for Agentic AI. Every item has a severity.
          </p>
          <ul className="grid md:grid-cols-2 gap-x-10 border-t border-gray-200">
            {CHECKLIST_SECTIONS.map((section) => (
              <li key={section.title} className="py-5 border-b border-gray-200">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h3 className="font-bold text-primary-900">{section.title.replace(/^\d+\.\s*/, '')}</h3>
                  <span className="text-sm font-semibold text-primary-700 tabular-nums whitespace-nowrap">
                    {section.items.length} checks
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{section.subtitle}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Why it matters: real incidents from the database */}
        <section className="max-w-5xl mx-auto mb-20" aria-labelledby="why-heading">
          <h2 id="why-heading" className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-3 text-balance">
            The failures these checks are built to catch
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Four of the {INCIDENT_COUNT} documented incidents in our database. Each one maps to a category above.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {incidents.map((c) => (
              <article key={c.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  <span className="tabular-nums">{c.year}</span> · {c.category}
                </p>
                <h3 className="font-display text-lg font-bold text-primary-900 mb-2 text-balance">{c.title}</h3>
                {c.cost && (
                  <p className="text-sm text-red-800 mb-3">
                    <strong>Cost:</strong> {c.cost}
                  </p>
                )}
                <Link href={`/failures/${c.id}/`} className="link-arrow text-sm text-primary-700 hover:text-primary-900">
                  Read the case and prevention steps
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* How to use */}
        <section className="max-w-5xl mx-auto mb-20" aria-labelledby="use-heading">
          <h2 id="use-heading" className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-8">
            How to use it
          </h2>
          <ol className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            {USAGE_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="w-9 h-9 rounded bg-primary-100 text-primary-800 font-bold flex items-center justify-center flex-shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-primary-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Who it's for */}
        <section className="max-w-5xl mx-auto mb-20" aria-labelledby="who-heading">
          <h2 id="who-heading" className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-8">
            Who it&apos;s for
          </h2>
          <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {AUDIENCES.map((a) => (
              <div key={a.title}>
                <dt className="font-bold text-primary-900 mb-1">{a.title}</dt>
                <dd className="text-gray-600 leading-relaxed">{a.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-20" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-8">
            Frequently asked questions
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {FAQS.map((f) => (
              <div key={f.q} className="p-6">
                <h3 className="font-bold text-primary-900 mb-2">{f.q}</h3>
                <p className="text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto rounded-lg bg-primary-900 px-6 py-12 sm:px-12 text-center" aria-labelledby="final-heading">
          <h2 id="final-heading" className="font-display text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Don&apos;t ship blind
          </h2>
          <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
            Open the checklist, print it, and work through the critical items before your next release.
          </p>
          <Link
            href="/checklist/download/"
            className="inline-flex items-center justify-center gap-2 bg-accent-500 text-primary-900 px-8 py-3.5 rounded-full font-bold hover:bg-accent-400 transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
          >
            Open the checklist
            {ARROW}
          </Link>
          <p className="mt-6 text-sm">
            <Link href="/quiz/" className="link-arrow text-primary-100 hover:text-white">
              Not sure where to start? Take the 3-step risk quiz
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
