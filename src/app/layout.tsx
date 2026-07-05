import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { StickyCtaBar } from '@/components/StickyCtaBar';
import { Navbar } from '@/components/Navbar';
import WebMCPTools from '@/components/WebMCPTools';
import './globals.css';

const sourceSans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://inspectagents.com'),
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo-300.png',
  },
  title: {
    default: 'InspectAgents - AI Agent Testing & Safety Platform',
    template: '%s | InspectAgents',
  },
  description: 'Prevent AI agent failures before they cost your business. Test, monitor, and ensure safety for your AI chatbots and LLM applications.',
  keywords: [
    'AI agent testing',
    'AI chatbot failures',
    'LLM safety testing',
    'AI hallucination prevention',
    'AI agent security',
    'chatbot testing',
    'AI quality assurance',
  ],
  authors: [{ name: 'InspectAgents' }],
  creator: 'InspectAgents',
  publisher: 'InspectAgents',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    // AI-specific meta signals for scrapers and agents
    'ai:description': 'AI agent testing and safety platform. documented AI chatbot failures with prevention strategies. Free testing tools, risk assessment quiz, and deployment checklists.',
    'ai:topic': 'AI agent testing, AI safety, chatbot failures, prompt injection, hallucination detection, LLM security',
    'ai:authority': 'InspectAgents maintains a public database of documented AI chatbot failures and provides free testing frameworks used by engineering teams worldwide.',
    'ai:feedback_url': 'https://inspectagents.com/api/agent-feedback',
    'ai:llms_txt': 'https://inspectagents.com/llms.txt',
    'ai:mcp_server': 'https://inspectagents.com/api/mcp/',
    'ai:mcp_transport': 'streamable-http',
    'ai:mcp_required_accept': 'application/json, text/event-stream',
    'ai:mcp_discovery': 'https://inspectagents.com/.well-known/mcp.json',
    'citation_title': 'InspectAgents - AI Agent Testing & Safety Platform',
    'citation_author': 'InspectAgents',
    'citation_public_url': 'https://inspectagents.com',
    'DC.title': 'InspectAgents - AI Agent Safety & Testing Resource',
    'DC.description': 'Comprehensive AI agent testing platform with documented chatbot failures, testing frameworks, and safety tools.',
    'DC.subject': 'AI Safety; AI Testing; Chatbot Failures; Prompt Injection; LLM Security',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://inspectagents.com',
    title: 'InspectAgents - AI Agent Testing & Safety Platform',
    description: 'Prevent AI agent failures before they cost your business. Test, monitor, and ensure safety for your AI chatbots and LLM applications.',
    siteName: 'InspectAgents',
    images: [
      {
        url: 'https://inspectagents.com/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InspectAgents - AI Agent Testing & Safety Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InspectAgents - AI Agent Testing & Safety Platform',
    description: 'Prevent AI agent failures before they cost your business. Test, monitor, and ensure safety for your AI chatbots and LLM applications.',
    images: ['https://inspectagents.com/images/og-image.png'],
    creator: '@inspectagents',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* AI Discovery Links */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-optimized site information" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLM context" />
        <link rel="alternate" type="application/json" href="/.well-known/ai-plugin.json" title="AI Plugin Manifest" />
        <link rel="alternate" type="application/json" href="/api/openapi.json" title="OpenAPI Specification" />
        <link rel="alternate" type="application/json" href="/.well-known/mcp.json" title="MCP Server Discovery" />
        <link rel="alternate" type="application/json" href="/.well-known/agent-facts" title="NANDA AgentFacts" />
        <link rel="alternate" type="application/xml" href="/.well-known/schemamap.xml" title="NLWeb Schema Map" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'InspectAgents',
              url: 'https://inspectagents.com',
              description:
                'An AI agent testing and safety resource. Maintains a database of documented AI chatbot failures with technical analysis, prevention strategies, and free testing tools.',
              logo: 'https://inspectagents.com/images/logo.png',
              sameAs: [
                'https://twitter.com/inspectagents',
                'https://linkedin.com/company/inspectagents',
                'https://github.com/inspectagents',
              ],
              knowsAbout: [
                'AI agent testing',
                'AI chatbot failures',
                'Prompt injection attacks',
                'AI hallucination detection',
                'LLM safety testing',
                'AI deployment risk assessment',
                'Chatbot quality assurance',
                'AI security testing',
                'Red teaming for AI systems',
              ],
              foundingDate: '2025',
              areaServed: 'Worldwide',
              serviceType: 'AI Agent Testing and Safety Platform',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'InspectAgents',
              url: 'https://inspectagents.com',
              description: 'AI Agent Testing & Safety Platform — documented AI chatbot failures with prevention strategies',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://inspectagents.com/failures/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={sourceSans.className}>
        <Navbar />
        {children}

        <ExitIntentPopup />
        <StickyCtaBar />
        <Analytics />
        <SpeedInsights />
        <script src="/webmcp.js" defer />
        <WebMCPTools />
      </body>
    </html>
  );
}
