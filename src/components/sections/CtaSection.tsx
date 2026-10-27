import { TrackedLink } from '@/components/TrackedLink';

export function CtaSection() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200 content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6">
            See where your AI agent is exposed
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Two questions about your setup and your concerns. Your result, three priority actions and matching real incidents appear on screen right away.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <div className="grid sm:grid-cols-3 gap-6 text-left mb-8">
              {[
                { step: '1', title: 'Answer two questions', desc: 'Your deployment stage and your main concerns' },
                { step: '2', title: 'See your result', desc: 'An exposure level with the reasons behind it' },
                { step: '3', title: 'Act on it', desc: 'Three priority actions and matched real cases' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-700 font-bold text-sm">{s.step}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-900 text-sm mb-1 font-body">{s.title}</h3>
                    <p className="text-gray-600 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <TrackedLink
              href="/quiz/"
              trackingLabel="Check your AI risk"
              location="cta-section"
              className="inline-flex items-center justify-center bg-accent-500 text-primary-900 px-10 py-3.5 rounded-full font-bold hover:bg-accent-400 transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              Check your AI risk
            </TrackedLink>
            <p className="text-gray-600 text-sm mt-4">
              Free · 3 steps · No account needed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
