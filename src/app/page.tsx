import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { HomePageClient, TrackedLink } from '@/components/HomePageClient';
import { HomeStructuredData } from '@/components/HomeStructuredData';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CHECKLIST_ITEM_COUNT, INCIDENT_COUNT, getLatestIncidents } from '@/lib/site-stats';

// Below-the-fold: lazy-loaded via dynamic imports (bundle-dynamic-imports)
const WhoWeAre = dynamic(() => import('@/components/sections/WhoWeAre').then(m => ({ default: m.WhoWeAre })));
const WhatWeOffer = dynamic(() => import('@/components/sections/WhatWeOffer').then(m => ({ default: m.WhatWeOffer })));
const CaseStudies = dynamic(() => import('@/components/sections/CaseStudies').then(m => ({ default: m.CaseStudies })));
const KeyRisks = dynamic(() => import('@/components/sections/KeyRisks').then(m => ({ default: m.KeyRisks })));
const Stats = dynamic(() => import('@/components/sections/Stats').then(m => ({ default: m.Stats })));
const CtaSection = dynamic(() => import('@/components/sections/CtaSection').then(m => ({ default: m.CtaSection })));
const DemandGauge = dynamic(() => import('@/components/sections/DemandGauge').then(m => ({ default: m.DemandGauge })));
const FaqSection = dynamic(() => import('@/components/sections/FaqSection').then(m => ({ default: m.FaqSection })));
const ExternalResources = dynamic(() => import('@/components/sections/ExternalResources').then(m => ({ default: m.ExternalResources })));
const Footer = dynamic(() => import('@/components/sections/Footer').then(m => ({ default: m.Footer })));

export const metadata: Metadata = {
  title: 'AI Agent Testing & Safety Platform - Prevent Chatbot Failures',
  description: 'Prevent AI agent failures before they cost your business. Learn from real analyzed AI chatbot disasters including Chevrolet, Air Canada, and DPD incidents.',
  alternates: {
    canonical: 'https://inspectagents.com/',
  },
  openGraph: {
    title: 'AI Agent Testing & Safety Platform - Prevent Chatbot Failures',
    description: 'Prevent AI agent failures before they cost your business. Learn from real analyzed AI chatbot disasters.',
    type: 'website',
    url: 'https://inspectagents.com',
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
    title: 'AI Agent Testing & Safety Platform - Prevent Chatbot Failures',
    description: 'Prevent AI agent failures before they cost your business.',
    images: ['https://inspectagents.com/images/og-image.png'],
    creator: '@inspectagents',
  },
};

function SectionSkeleton() {
  return (
    <div className="py-20 animate-pulse">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
          <div className="h-8 w-96 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-80 bg-gray-100 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const latest = getLatestIncidents(3);
  return (
    <HomePageClient>
      <main className="min-h-screen bg-white">

      {/* HERO — above the fold, rendered inline for fastest LCP */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative container mx-auto px-4 lg:px-8 py-16 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-12 items-center max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.08] tracking-tight text-white text-balance">
                Find out how your AI agent could fail, before your customers do
              </h1>
              <p className="text-lg md:text-xl text-primary-200 mb-10 leading-relaxed max-w-2xl">
                Learn from {INCIDENT_COUNT} documented AI failures, then check your own agent with a 3-step risk quiz and a {CHECKLIST_ITEM_COUNT}-point pre-launch checklist. Free, no account.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-5">
                <TrackedLink
                  href="/quiz/"
                  trackingLabel="Check your AI risk"
                  location="hero"
                  className="inline-flex items-center justify-center gap-2 bg-accent-500 text-primary-900 px-8 py-3.5 rounded-full font-bold hover:bg-accent-400 transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                >
                  Check your AI risk
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </TrackedLink>
                <TrackedLink
                  href="/failures/"
                  trackingLabel="Browse Failures Database"
                  location="hero"
                  type="internal"
                  className="link-arrow text-primary-100 hover:text-white text-base"
                >
                  Browse the {INCIDENT_COUNT} incidents
                </TrackedLink>
              </div>
              <p className="mt-5 text-sm text-primary-300">3 steps · result on screen · no email needed to see it</p>
            </div>

            <aside aria-labelledby="latest-incidents" className="rounded-lg border border-primary-700 bg-primary-800/60 p-5">
              <h2 id="latest-incidents" className="text-sm font-bold text-accent-400 mb-4">Latest additions to the database</h2>
              <ul className="space-y-4">
                {latest.map((i) => (
                  <li key={i.id}>
                    <Link href={`/failures/${i.id}/`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded">
                      <span className="block text-xs text-primary-300 mb-0.5"><span className="tabular-nums">{i.year}</span> · {i.category} · {i.severity}</span>
                      <span className="block text-sm font-semibold text-white leading-snug group-hover:underline underline-offset-4">{i.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Below-the-fold sections — lazy loaded with Suspense boundaries */}
      <Suspense fallback={<SectionSkeleton />}>
        <CaseStudies />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CtaSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <WhatWeOffer />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <KeyRisks />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <WhoWeAre />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <DemandGauge />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FaqSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ExternalResources />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>

      <HomeStructuredData />
    </main>
    </HomePageClient>
  );
}

