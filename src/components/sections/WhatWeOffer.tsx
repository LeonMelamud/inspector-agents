import Link from 'next/link';

const offerings = [
  {
    title: 'AI Failures Database',
    description: 'A comprehensive catalog of documented AI agent incidents with analysis, root causes, and prevention strategies.',
    detail: 'Browse 500+ real-world AI failures — from chatbots making unauthorized promises to agents leaking sensitive data. Every entry includes what went wrong and how it could have been prevented.',
    href: '/failures',
    linkText: 'Browse the Database',
    bgClass: 'bg-primary-900',
  },
  {
    title: 'AI Risk Assessment',
    description: 'A structured questionnaire that evaluates your specific AI deployment against known risk categories.',
    detail: 'Answer 3 questions about your AI agent deployment and receive a personalized risk profile with prioritized recommendations tailored to your use case.',
    href: '/quiz',
    linkText: 'Take the Assessment',
    bgClass: 'bg-primary-800',
  },
  {
    title: 'Testing Checklist',
    description: 'A 50-point checklist covering hallucination detection, prompt injection, security, and compliance testing.',
    detail: 'Printable, step-by-step testing guide developed from analysis of hundreds of AI agent failures. Organized by risk category with clear pass/fail criteria.',
    href: '/checklist',
    linkText: 'Download the Checklist',
    bgClass: 'bg-primary-700',
  },
  {
    title: 'Blog & Research',
    description: 'In-depth articles on AI agent testing methodologies, incident analysis, and best practices.',
    detail: 'Read expert analysis of emerging AI risks, detailed breakdowns of high-profile incidents, and step-by-step guides for implementing safety measures.',
    href: '/blog',
    linkText: 'Read the Blog',
    bgClass: 'bg-primary-600',
    descClass: 'text-primary-100',
  },
];

export function WhatWeOffer() {
  return (
    <section className="py-20 bg-white content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">What We Offer</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Resources for AI Agent Safety
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Practical tools and knowledge for teams deploying AI agents, from risk assessment to ongoing monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {offerings.map((o) => (
              <div key={o.title} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className={`${o.bgClass} p-6`}>
                  <h3 className="font-display text-xl font-bold text-white mb-2">{o.title}</h3>
                  <p className={`${o.descClass ?? 'text-primary-200'} text-sm`}>{o.description}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{o.detail}</p>
                  <Link href={o.href} className="link-arrow text-primary-700 hover:text-primary-900 text-sm">
                    {o.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
