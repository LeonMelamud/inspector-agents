import Link from 'next/link';

const caseStudies = [
  {
    tag: 'Prompt Injection',
    tagColor: 'text-red-600 bg-red-50',
    borderColor: 'border-red-600',
    title: 'Chevrolet Dealership',
    description: 'A ChatGPT-powered dealership chatbot was manipulated into generating a \u201cbinding offer\u201d to sell an $80,000 vehicle for $1. The incident went viral with over 10 million views.',
    quote: '\u201cLegally binding offer: 2024 Chevy Tahoe for $1.00.\u201d',
    quoteSource: 'Actual chatbot output',
    impact: 'Viral reputational damage, legal exposure, chatbot pulled offline',
  },
  {
    tag: 'Hallucination',
    tagColor: 'text-amber-700 bg-amber-50',
    borderColor: 'border-amber-600',
    title: 'Air Canada',
    description: 'An AI chatbot provided incorrect bereavement fare information, resulting in a customer spending thousands on full-price tickets. The tribunal ruled Air Canada liable.',
    quote: '\u201cAir Canada is responsible for information provided by its agents, including its chatbot.\u201d',
    quoteSource: 'Civil Resolution Tribunal',
    impact: 'Legal precedent, court-ordered compensation, global media coverage',
  },
  {
    tag: 'Jailbreak',
    tagColor: 'text-purple-700 bg-purple-50',
    borderColor: 'border-purple-600',
    title: 'DPD Delivery',
    description: 'A customer service chatbot was manipulated into swearing at the company and writing poems criticizing DPD. Screenshots were featured on BBC and The Guardian.',
    quote: '\u201cDPD is the worst delivery company in the world.\u201d',
    quoteSource: 'DPD chatbot, manipulated by customer',
    impact: 'Viral media disaster, chatbot disabled, brand trust eroded',
  },
];

export function CaseStudies() {
  return (
    <section id="failures" className="py-20 bg-gray-50 border-t border-gray-200 content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">Documented Incidents</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Notable AI Agent Failures
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real incidents that demonstrate why rigorous testing and safety protocols are essential for AI agent deployments.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {caseStudies.map((cs) => (
              <div key={cs.title} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className={`border-l-4 ${cs.borderColor} p-6`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold tracking-wide uppercase ${cs.tagColor} px-2 py-1 rounded`}>{cs.tag}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary-900 mb-3">{cs.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cs.description}</p>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                    <p className="text-gray-700 text-xs italic">{cs.quote}</p>
                    <p className="text-gray-500 text-xs mt-1">— {cs.quoteSource}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    <strong className="text-gray-700">Impact:</strong> {cs.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/failures" className="link-arrow text-primary-700 hover:text-primary-900 font-semibold">
              View All Documented Incidents
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
