'use client';

import Link from 'next/link';
import { useABTest } from '@/hooks/useABTest';
import { trackDemand } from '@/lib/analytics';
import { Icon } from '@/components/icons';

/**
 * Features we're gauging demand for.
 * Each click is tracked → Vercel Analytics → filter by `demand_feature_clicked`.
 */
const ALL_FEATURES = [
  {
    slug: 'api-docs',
    title: 'API & SDK Integration',
    description: 'Test your agents via REST API. Planned: plug agent tests into CI/CD with Python and Node SDKs.',
    href: '/docs',
    icon: 'server',
    tag: 'For Engineers',
  },
  {
    slug: 'pricing',
    title: 'Pricing Plans',
    description: 'Planned paid tiers for teams. Everything on the site today stays free.',
    href: '/pricing',
    icon: 'coins',
    tag: 'Plans & Billing',
  },
  {
    slug: 'live-demo',
    title: 'Live Testing Sandbox',
    description: 'Paste your agent response, get instant safety analysis. No signup required.',
    href: '/demo',
    icon: 'rocket',
    tag: 'Coming soon',
  },
  {
    slug: 'how-it-works',
    title: 'Testing Methodology',
    description: 'Our benchmarks, failure taxonomy, scoring framework, and the research behind it all.',
    href: '/how-it-works',
    icon: 'clipboard',
    tag: 'Technical Deep-Dive',
  },
  {
    slug: 'failure-explorer',
    title: 'Interactive Failure Explorer',
    description: 'Filter failures by industry, model, failure type, and severity. Advanced search & comparison.',
    href: '/failures',
    icon: 'search',
    tag: 'Advanced Search',
  },
  {
    slug: 'agent-leaderboard',
    title: 'Agent Safety Leaderboard',
    description: 'Planned: benchmark your agents against public safety scores and rankings.',
    href: '/docs',
    icon: 'shield',
    tag: 'Benchmarks',
  },
] as const;

/**
 * A/B test: we show features in two different orderings to see
 * which layout drives more clicks overall.
 *
 * Variant A: engineering-first (API, Demo, Methodology, Pricing, Explorer, Leaderboard)
 * Variant B: business-first  (Pricing, Demo, Explorer, Leaderboard, API, Methodology)
 */
const VARIANT_ORDERS: Record<string, number[]> = {
  A: [0, 2, 3, 1, 4, 5], // engineering-first
  B: [1, 2, 4, 5, 0, 3], // business-first
};

export function DemandGauge() {
  const variant = useABTest('homepage_features_order', ['A', 'B']);
  const order = VARIANT_ORDERS[variant] ?? VARIANT_ORDERS.A;
  const features = order.map((i) => ALL_FEATURES[i]);

  return (
    <section className="py-20 bg-gray-50 content-auto" id="whats-next">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Help Us Build What You Need
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We&apos;re expanding our platform. Click on the features that matter most to you — your interest directly shapes our roadmap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.slug}
                href={feature.href}
                onClick={() =>
                  trackDemand.featureClicked(
                    feature.slug,
                    'homepage-demand-gauge',
                    variant
                  )
                }
                className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-accent-400 transition-all cursor-pointer"
              >
                {/* Tag */}
                <span className="absolute top-4 right-4 text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                  {feature.tag}
                </span>

                <span className="w-10 h-10 rounded bg-primary-100 text-primary-700 flex items-center justify-center mb-4"><Icon name={feature.icon} /></span>
                <h3 className="font-display text-lg font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors pr-24">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary-700 group-hover:text-primary-900 transition-colors">
                  I want this
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Every click is a vote. We track interest anonymously via Vercel Analytics to prioritize our roadmap.
          </p>
        </div>
      </div>
    </section>
  );
}
