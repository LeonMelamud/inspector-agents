import Link from 'next/link';

const values = [
  {
    title: 'Independence',
    description: 'Vendor-neutral testing standards and unbiased analysis.',
    icon: (
      <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Evidence-Based',
    description: 'Analysis grounded in documented incidents and outcomes.',
    icon: (
      <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: 'Accessible',
    description: 'Free resources for organizations of every size and maturity.',
    icon: (
      <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Transparent',
    description: 'Open methodology and clear documentation of all findings.',
    icon: (
      <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
];

export function WhoWeAre() {
  return (
    <section className="py-20 bg-gray-50 border-b border-gray-200 content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label">Who We Are</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6 leading-tight">
                Making AI Agent Testing Accessible, Practical, and Transparent
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                InspectAgents was founded after analyzing over 500 real-world AI agent failures across industries — from customer service chatbots to autonomous systems. Our mission is to ensure every organization deploying AI agents has the knowledge and tools to do so safely.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We provide free, independent resources including a comprehensive failures database, risk assessment tools, testing checklists, and educational content to help teams identify and prevent AI agent vulnerabilities before they reach customers.
              </p>
              <Link href="/about" className="link-arrow text-primary-700 hover:text-primary-900">
                Learn More About InspectAgents
              </Link>
            </div>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4">
              {values.map((v) => (
                <div key={v.title} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-primary-100 flex items-center justify-center flex-shrink-0">
                      {v.icon}
                    </div>
                    <h3 className="font-bold text-primary-900 text-sm sm:text-base leading-snug">{v.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
