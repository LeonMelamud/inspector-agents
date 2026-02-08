import { TrackedLink } from '@/components/TrackedLink';

export function CtaSection() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200 content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label">Get Started</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6">
            Assess Your Organization&apos;s AI Risk Profile
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Complete our structured risk assessment to identify vulnerabilities specific to your deployment and receive actionable recommendations.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <div className="grid sm:grid-cols-3 gap-6 text-left mb-8">
              {[
                { step: '1', title: 'Answer 7 Questions', desc: 'About your AI deployment and use case' },
                { step: '2', title: 'Receive Your Profile', desc: 'Personalized risk assessment results' },
                { step: '3', title: 'Get Recommendations', desc: 'Prioritized steps to improve safety' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-700 font-bold text-sm">{s.step}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900 text-sm mb-1">{s.title}</h4>
                    <p className="text-gray-600 text-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <TrackedLink
              href="/quiz"
              trackingLabel="Begin Risk Assessment"
              location="cta-section"
              className="inline-flex items-center justify-center bg-primary-900 text-white px-10 py-3.5 rounded font-bold hover:bg-primary-800 transition-colors text-base"
            >
              Begin Risk Assessment
            </TrackedLink>
            <p className="text-gray-500 text-xs mt-4">
              Free · 2 minutes · No account required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
