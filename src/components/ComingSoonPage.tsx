'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { trackDemand, trackEmailCapture } from '@/lib/analytics';

interface ComingSoonPageProps {
  /** Feature slug used for analytics (e.g. "api-docs", "pricing") */
  featureSlug: string;
  /** Page headline */
  title: string;
  /** Short description of the feature */
  description: string;
  /** Bullet points explaining what's coming */
  bullets: string[];
  /** Optional icon (emoji or SVG) */
  icon?: string;
}

export function ComingSoonPage({
  featureSlug,
  title,
  description,
  bullets,
  icon = '🚧',
}: ComingSoonPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    try {
      // Track demand signal
      trackDemand.waitlistSignup(featureSlug);
      trackEmailCapture.submitted(`coming-soon-${featureSlug}`);

      // Submit to existing subscribe endpoint
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `waitlist-${featureSlug}`,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative container mx-auto px-4 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-5xl mb-6 block">{icon}</span>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-400 mb-4">
              Coming Soon
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
              {title}
            </h1>
            <p className="text-lg text-primary-200 mb-8 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          {/* What's Coming */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="font-display text-xl font-bold text-primary-900 mb-6">
              What We&apos;re Building
            </h2>
            <ul className="space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-1 text-accent-500 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Waitlist signup */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            {submitted ? (
              <div>
                <span className="text-4xl block mb-4">✅</span>
                <h3 className="font-display text-lg font-bold text-primary-900 mb-2">
                  You&apos;re on the list!
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  We&apos;ll notify you as soon as this is ready. Your interest helps us prioritize what to build next.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-primary-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-800 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-lg font-bold text-primary-900 mb-2">
                  Want this feature?
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Join the waitlist and we&apos;ll notify you when it launches. Every signup helps us decide what to build next.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center bg-accent-500 text-primary-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-accent-400 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Joining…' : 'Notify Me'}
                  </button>
                </form>
                {error && (
                  <p className="text-red-600 text-sm mt-3">{error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
