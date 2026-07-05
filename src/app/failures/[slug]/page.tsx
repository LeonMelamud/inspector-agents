import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { failures } from '../data';
import { getCategoryColor, getSeverityColor } from '../badges';
import { generateSEO, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

const BASE_URL = 'https://inspectagents.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return failures.map((f) => ({ slug: f.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const failure = failures.find((f) => f.id === slug);
  if (!failure) return {};

  return generateSEO({
    title: `${failure.title} | AI Failure Case Study`,
    description: failure.description.slice(0, 155),
    keywords: [
      `${failure.company} AI failure`,
      `${failure.company} chatbot incident`,
      failure.category,
    ],
    canonical: `${BASE_URL}/failures/${failure.id}/`,
    ogType: 'article',
  });
}

export default async function FailurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = failures.findIndex((f) => f.id === slug);
  if (index === -1) notFound();
  const failure = failures[index];

  const url = `${BASE_URL}/failures/${failure.id}/`;
  const related = failures.filter(
    (f) => f.category === failure.category && f.id !== failure.id
  ).slice(0, 3);
  const prev = failures[index - 1];
  const next = failures[index + 1];

  const formattedDate = new Date(failure.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateArticleJsonLd({
            title: failure.title,
            description: failure.description.slice(0, 155),
            url,
            publishedTime: failure.date,
            tags: [failure.category, failure.company, 'AI failure'],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbJsonLd([
            { name: 'Home', url: `${BASE_URL}/` },
            { name: 'AI Failures Database', url: `${BASE_URL}/failures/` },
            { name: failure.title, url },
          ]),
        }}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-primary-100 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/failures/" className="hover:text-white">AI Failures Database</Link>
          </nav>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(failure.category)}`}>
              {failure.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(failure.severity)}`}>
              {failure.severity}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{failure.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-primary-50">
            <span className="font-medium">{failure.company}</span>
            <span>•</span>
            <time dateTime={failure.date}>{formattedDate}</time>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md border border-stone-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-stone-900 mb-3">What Happened</h2>
          <p className="text-stone-700 mb-6">{failure.description}</p>

          <h2 className="text-xl font-bold text-stone-900 mb-3">Impact</h2>
          <p className="text-stone-700 mb-2">{failure.impact}</p>
          {failure.cost && (
            <p className="text-red-600 font-semibold mb-6">Cost: {failure.cost}</p>
          )}

          <h2 className="text-xl font-bold text-stone-900 mb-3">How to Prevent This</h2>
          <ul className="list-disc list-inside space-y-1 mb-6">
            {failure.prevention.map((tip, idx) => (
              <li key={idx} className="text-stone-700">{tip}</li>
            ))}
          </ul>

          <div className="pt-4 border-t border-stone-200">
            <a
              href={failure.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
            >
              <span>Source: {failure.source}</span>
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </article>

        {/* Prev / Next */}
        <div className="flex justify-between gap-4 mt-8 text-sm">
          {prev ? (
            <Link href={`/failures/${prev.id}/`} className="text-primary-600 hover:text-primary-700 font-medium">
              ← {prev.title}
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/failures/${next.id}/`} className="text-primary-600 hover:text-primary-700 font-medium text-right">
              {next.title} →
            </Link>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              More {failure.category} Failures
            </h2>
            <div className="grid gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/failures/${r.id}/`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-stone-200 p-4"
                >
                  <h3 className="font-bold text-stone-900">{r.title}</h3>
                  <p className="text-sm text-stone-600 mt-1">{r.company} • {new Date(r.date).getFullYear()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don&apos;t Let Your Company Be the Next Case Study
          </h2>
          <p className="text-xl text-primary-50 mb-6">
            Take our 2-minute quiz to identify your AI risks before they become failures.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            Assess Your AI Risks Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
