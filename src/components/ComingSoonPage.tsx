'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { trackDemand, trackEmailCapture } from '@/lib/analytics';
import { Icon } from '@/components/icons';

interface ComingSoonPageProps {
  /** Feature slug used for analytics (e.g. "api-docs", "pricing") */
  featureSlug: string;
  /** Page headline */
  title: string;
  /** Short description of the feature */
  description: string;
  /** Bullet points explaining what's coming */
  bullets: string[];
  /** @deprecated Emoji icons are no longer rendered; kept so existing pages compile. */
  icon?: string;
}

export function ComingSoonPage({
  featureSlug,
  title,
  description,
  bullets,
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
      const res = await fetch('/api/subscribe/', {
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
            <p className="inline-flex items-center gap-2 rounded-full border border-primary-600 px-3 py-1 text-sm font-semibold text-accent-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-400" aria-hidden="true" />
              In development · join the waitlist
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
              What we&apos;re building
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
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Icon name="check" className="w-6 h-6" />
                </span>
                <h2 className="font-display text-xl font-bold text-primary-900 mb-2" role="status">
                  You&apos;re on the list
                </h2>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  We&apos;ll email <strong className="text-primary-900">{email}</strong> when this launches. Your signup counts toward what we build next.
                </p>
                <p className="font-semibold text-primary-900 mb-3">While you wait, check your own agent</p>
                <Link
                  href="/quiz/"
                  className="inline-flex items-center justify-center gap-2 bg-accent-500 text-primary-900 px-6 py-3 rounded-full font-bold hover:bg-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
                >
                  Take the 3-step risk quiz
                  <Icon name="arrowRight" className="w-4 h-4" />
                </Link>
                <p className="mt-4 text-sm">
                  <Link href="/checklist/" className="link-arrow text-primary-700 hover:text-primary-900">
                    Or open the pre-launch checklist
                  </Link>
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-xl font-bold text-primary-900 mb-2">
                  Want this when it&apos;s ready?
                </h2>
                <p className="text-gray-600 mb-6">
                  Join the waitlist and we&apos;ll email you when it launches. Every signup counts toward what we build next.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <label htmlFor={`waitlist-${featureSlug}`} className="sr-only">Work email</label>
                  <input
                    id={`waitlist-${featureSlug}`}
                    autoComplete="email"
                    aria-describedby={error ? `waitlist-${featureSlug}-error` : undefined}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-full text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-primary-900"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center bg-accent-500 text-primary-900 px-6 py-3 rounded-full font-bold hover:bg-accent-400 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
                  >
                    {loading ? 'Joining…' : 'Join the waitlist'}
                  </button>
                </form>
                {error && (
                  <p id={`waitlist-${featureSlug}-error`} className="text-red-700 text-sm mt-3" role="alert">{error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
