import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

export function generateSEO({
  title,
  description = 'Prevent AI agent failures before they cost your business. Test, monitor, and ensure safety for your AI chatbots and LLM applications.',
  keywords = [],
  canonical,
  ogImage = '/og-image.png',
  ogType = 'website',
  noindex = false,
}: SEOProps = {}): Metadata {
  const baseUrl = 'https://inspectagents.com';
  const fullTitle = title
    ? `${title} | InspectAgents`
    : 'InspectAgents - AI Agent Testing & Safety Platform';

  const allKeywords = [
    'AI agent testing',
    'AI chatbot failures',
    'LLM safety testing',
    'AI hallucination prevention',
    ...keywords,
  ];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: canonical || baseUrl,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || baseUrl,
      siteName: 'InspectAgents',
      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type: ogType as any,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${baseUrl}${ogImage}`],
      creator: '@inspectagents',
    },
  };
}

export function generateArticleSEO({
  title,
  description,
  publishedTime,
  modifiedTime,
  authors = ['InspectAgents'],
  tags = [],
  image,
}: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  image?: string;
}): Metadata {
  const baseUrl = 'https://inspectagents.com';
  const baseSEO = generateSEO({
    title,
    description,
    keywords: tags,
    ogImage: image || '/og-image.png',
    ogType: 'article',
  });

  return {
    ...baseSEO,
    openGraph: {
      ...baseSEO.openGraph,
      type: 'article',
      title,
      description,
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors,
      tags,
      images: [
        {
          url: `${baseUrl}${image || '/og-image.png'}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}
