import type { MetadataRoute } from 'next';
import { failures } from './failures/data';

const BASE_URL = 'https://inspectagents.com';

const staticRoutes = [
  '',
  '/failures',
  '/quiz',
  '/checklist',
  '/checklist/download',
  '/blog',
  '/blog/ai-chatbot-failures-2025-2026',
  '/blog/ai-sycophancy-agreement-bias',
  '/blog/chevrolet-ai-failure-breakdown',
  '/blog/how-to-test-ai-agents',
  '/glossary',
  '/playbook',
  '/about',
  '/contact',
  '/docs',
  '/pricing',
  '/demo',
  '/how-it-works',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route}/`,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...failures.map((f) => ({
      url: `${BASE_URL}/failures/${f.id}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
