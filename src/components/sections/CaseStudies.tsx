import Link from 'next/link';
import { INCIDENT_COUNT, getHeadlineIncidents } from '@/lib/site-stats';

const CATEGORY_TONE: Record<string, string> = {
  'Prompt Injection': 'text-red-800 bg-red-50',
  Hallucination: 'text-amber-900 bg-amber-50',
  Jailbreak: 'text-purple-800 bg-purple-50',
};

export function CaseStudies() {
  const cases = getHeadlineIncidents().slice(0, 3);
  return (
    <section id="failures" className="py-20 bg-gray-50 border-t border-gray-200 content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4 text-balance">
              Each of these companies shipped a chatbot that went wrong in public
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Three of the {INCIDENT_COUNT} incidents in our database, with what it cost and the source. Every case lists prevention steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {cases.map((c) => (
              <article key={c.id} className="flex flex-col bg-white border border-gray-200 rounded-lg p-6">
                <p className="flex items-center gap-2 mb-3 text-xs">
                  <span className={`font-bold px-2 py-1 rounded ${CATEGORY_TONE[c.category] ?? 'text-primary-800 bg-primary-50'}`}>
                    {c.category}
                  </span>
                  <span className="text-gray-600 tabular-nums">{c.year}</span>
                </p>
                <h3 className="font-display text-xl font-bold text-primary-900 mb-3 text-balance">{c.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{c.description}</p>
                {c.cost && (
                  <p className="text-sm text-primary-900 mb-4">
                    <strong>Cost:</strong> {c.cost}
                  </p>
                )}
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <Link href={`/failures/${c.id}/`} className="link-arrow text-primary-700 hover:text-primary-900">
                    How to prevent it
                  </Link>
                  <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-900 underline-offset-4 hover:underline">
                    {c.source}
                    <span className="sr-only"> (source, opens in a new tab)</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <Link href="/failures/" className="link-arrow text-primary-700 hover:text-primary-900 font-semibold">
            See all {INCIDENT_COUNT} documented incidents
          </Link>
        </div>
      </div>
    </section>
  );
}
