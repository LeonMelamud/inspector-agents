import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { HomePageClient, TrackedLink } from '@/components/HomePageClient';
import type { Metadata } from 'next';

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
  description: 'Prevent AI agent failures before they cost your business. Learn from 500+ analyzed AI chatbot disasters including Chevrolet, Air Canada, and DPD incidents.',
  alternates: {
    canonical: 'https://inspectagents.com',
  },
  openGraph: {
    title: 'AI Agent Testing & Safety Platform - Prevent Chatbot Failures',
    description: 'Prevent AI agent failures before they cost your business. Learn from 500+ analyzed AI chatbot disasters.',
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
  return (
    <HomePageClient>
      <main className="min-h-screen bg-white">

      {/* HERO — above the fold, rendered inline for fastest LCP */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative container mx-auto px-4 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm md:text-base font-bold tracking-[0.15em] uppercase text-accent-400 mb-4">
              AI Agent Safety & Testing
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Advancing Safety and Accountability in AI Agent Deployment
            </h1>
            <p className="text-lg md:text-xl text-primary-200 mb-10 leading-relaxed max-w-2xl">
              InspectAgents provides independent testing resources, real-world failure analysis, and practical frameworks to help organizations deploy AI agents responsibly and safely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedLink
                href="/quiz"
                trackingLabel="Assess Your AI Risk"
                location="hero"
                className="inline-flex items-center justify-center bg-accent-500 text-primary-900 px-8 py-3.5 rounded-full font-bold hover:bg-accent-400 transition-colors text-base"
              >
                Assess Your AI Risk
              </TrackedLink>
              <TrackedLink
                href="/failures"
                trackingLabel="Browse Failures Database"
                location="hero"
                type="internal"
                className="inline-flex items-center justify-center bg-primary-800 text-white border border-primary-600 px-8 py-3.5 rounded-full font-semibold hover:bg-primary-700 transition-colors text-base"
              >
                Browse Failures Database
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* Below-the-fold sections — lazy loaded with Suspense boundaries */}
      <Suspense fallback={<SectionSkeleton />}>
        <WhoWeAre />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <WhatWeOffer />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CaseStudies />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <KeyRisks />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CtaSection />
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

    </main>
    </HomePageClient>
  );
}

