import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Failures Database - Learn from Real AI Incidents | InspectAgents',
  description: 'Comprehensive searchable database of 20+ real AI failures: Chevrolet $1 car, Air Canada chatbot, Google Bard $100B loss, Amazon bias, and more. Filter by category, severity, and year.',
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
    title: 'AI Failures Database - 20+ Real Incidents',
    description: 'Learn from real AI disasters: $100B Google Bard error, Chevrolet $1 car, Air Canada chatbot lawsuit, and more. Searchable by category and severity.',
    type: 'website',
    url: 'https://inspectagents.com/failures',
    images: [
      {
        url: '/og-failures.png',
        width: 1200,
        height: 630,
        alt: 'AI Failures Database - Learn from 20+ Real AI Incidents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Failures Database - Learn from Real AI Disasters',
    description: '20+ documented AI failures including Google\'s $100B loss, Chevrolet chatbot, Air Canada lawsuit, and more. Searchable and filterable.',
    images: ['/og-failures.png'],
  },
  alternates: {
    canonical: 'https://inspectagents.com/failures',
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
            description: 'Comprehensive database of real AI incidents and failures',
            numberOfItems: 20,
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Google Bard $100 Billion Market Cap Loss',
                description: 'Factual error in first demo cost Google $100B in market value',
                url: 'https://inspectagents.com/failures#google-bard-error'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Chevrolet Chatbot Sells Car for $1',
                description: 'Prompt injection attack led to chatbot offering vehicle for $1',
                url: 'https://inspectagents.com/failures#chevrolet-car-sale'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Air Canada Chatbot Lawsuit',
                description: 'Airline forced to honor chatbot\'s false bereavement fare policy',
                url: 'https://inspectagents.com/failures#air-canada-refund'
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: 'Zillow $881 Million AI Algorithm Loss',
                description: 'Home-buying algorithm lost $881M by consistently overpaying',
                url: 'https://inspectagents.com/failures#zillow-homebuying'
              },
              {
                '@type': 'ListItem',
                position: 5,
                name: 'Amazon AI Recruiting Tool Gender Bias',
                description: 'AI tool scrapped after learning to discriminate against women',
                url: 'https://inspectagents.com/failures#amazon-hiring-bias'
              }
            ]
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
            description: 'Comprehensive, searchable database of real AI incidents, failures, and disasters across categories including hallucination, prompt injection, security, bias, jailbreak, misinformation, privacy, and safety.',
            url: 'https://inspectagents.com/failures',
            creator: {
              '@type': 'Organization',
              name: 'InspectAgents',
              url: 'https://inspectagents.com'
            },
            distribution: {
              '@type': 'DataDownload',
              encodingFormat: 'text/html',
              contentUrl: 'https://inspectagents.com/failures'
            },
            temporalCoverage: '2016-01-01/2024-12-31',
            spatialCoverage: 'Global',
            keywords: 'AI failures, chatbot incidents, LLM hallucinations, prompt injection, AI security, AI bias, jailbreak, AI safety'
          })
        }}
      />

      {children}
    </>
  );
}
