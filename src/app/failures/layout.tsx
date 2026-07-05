import type { Metadata } from 'next';
import { failures } from './data';

const count = failures.length;

export const metadata: Metadata = {
  title: 'AI Failures Database - Learn from Real AI Incidents | InspectAgents',
  description: `Searchable database of ${count} documented AI failures: Chevrolet $1 car, Air Canada chatbot, Google Bard $100B loss, Amazon bias, and more. Filter by category, severity, and year.`,
  keywords: [
    'AI failures',
    'AI incidents',
    'chatbot failures',
    'AI hallucination examples',
    'prompt injection attacks',
    'AI security breaches',
    'AI bias cases',
    'AI jailbreak examples',
    'LLM failures',
    'AI agent risks',
    'AI safety database',
    'AI disaster case studies'
  ],
  openGraph: {
    title: `AI Failures Database - ${count} Real Incidents`,
    description: 'Learn from real AI disasters: $100B Google Bard error, Chevrolet $1 car, Air Canada chatbot lawsuit, and more. Searchable by category and severity.',
    type: 'website',
    url: 'https://inspectagents.com/failures/',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Failures Database - Learn from Real AI Incidents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Failures Database - Learn from Real AI Disasters',
    description: `${count} documented AI failures including Google's $100B loss, Chevrolet chatbot, Air Canada lawsuit, and more. Searchable and filterable.`,
    images: ['/images/og-image.png'],
  },
  alternates: {
    canonical: 'https://inspectagents.com/failures/',
  },
};

export default function FailuresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Schema Markup - ItemList for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'AI Failures Database',
            description: 'Database of real AI incidents and failures',
            numberOfItems: count,
            itemListElement: failures.map((f, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: f.title,
              url: `https://inspectagents.com/failures/${f.id}/`,
            })),
          })
        }}
      />

      {/* Dataset Schema for the entire database */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'AI Failures Database',
            description: 'Searchable database of real AI incidents, failures, and disasters across categories including hallucination, prompt injection, security, bias, jailbreak, misinformation, privacy, and safety.',
            url: 'https://inspectagents.com/failures/',
            creator: {
              '@type': 'Organization',
              name: 'InspectAgents',
              url: 'https://inspectagents.com'
            },
            distribution: {
              '@type': 'DataDownload',
              encodingFormat: 'text/html',
              contentUrl: 'https://inspectagents.com/failures/'
            },
            temporalCoverage: '2016-01-01/2026-12-31',
            spatialCoverage: 'Global',
            keywords: 'AI failures, chatbot incidents, LLM hallucinations, prompt injection, AI security, AI bias, jailbreak, AI safety'
          })
        }}
      />

      {children}
    </>
  );
}
