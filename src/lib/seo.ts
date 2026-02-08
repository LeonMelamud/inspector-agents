import { Metadata } from 'next';

const BASE_URL = 'https://inspectagents.com';

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
  ogImage = '/images/og-image.png',
  ogType = 'website',
  noindex = false,
}: SEOProps = {}): Metadata {
  const allKeywords = [
    'AI agent testing',
    'AI chatbot failures',
    'LLM safety testing',
    'AI hallucination prevention',
    ...keywords,
  ];

  const canonicalUrl = canonical || BASE_URL;

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: canonicalUrl,
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
      title,
      description,
      url: canonicalUrl,
      siteName: 'InspectAgents',
      images: [
        {
          url: `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title || 'InspectAgents - AI Agent Testing & Safety Platform',
        },
      ],
      type: ogType as 'website' | 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}${ogImage}`],
      creator: '@inspectagents',
    },
  };
}

export function generateArticleSEO({
  title,
  description,
  canonical,
  publishedTime,
  modifiedTime,
  authors = ['InspectAgents'],
  tags = [],
  image,
}: {
  title: string;
  description: string;
  canonical: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  image?: string;
}): Metadata {
  const ogImage = image || '/images/og-image.png';
  const baseSEO = generateSEO({
    title,
    description,
    canonical,
    keywords: tags,
    ogImage,
    ogType: 'article',
  });

  return {
    ...baseSEO,
    openGraph: {
      ...baseSEO.openGraph,
      type: 'article',
      title,
      description,
      url: canonical,
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors,
      tags,
      images: [
        {
          url: `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * Generate Article JSON-LD structured data for blog posts
 */
export function generateArticleJsonLd({
  title,
  description,
  url,
  publishedTime,
  modifiedTime,
  authors = ['InspectAgents'],
  tags = [],
  image,
}: {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  image?: string;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: image ? `${BASE_URL}${image}` : `${BASE_URL}/images/og-image.png`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: authors.map((name) => ({
      '@type': 'Organization',
      name,
      url: BASE_URL,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'InspectAgents',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
  });
}

/**
 * Generate HowTo JSON-LD structured data
 */
export function generateHowToJsonLd({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  });
}
