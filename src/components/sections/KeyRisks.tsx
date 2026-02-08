const risks = [
  {
    title: 'Hallucinations',
    description: 'AI agents generating false information presented with high confidence — fabricated policies, non-existent citations, and invented data.',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-700',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />,
  },
  {
    title: 'Prompt Injection',
    description: 'Adversarial inputs that override system instructions, causing agents to ignore safety guidelines and perform unauthorized actions.',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-700',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  },
  {
    title: 'Reputational Damage',
    description: 'Viral incidents where AI agents produce inappropriate, offensive, or embarrassing outputs that damage brand trust and credibility.',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-700',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />,
  },
  {
    title: 'Legal Liability',
    description: 'Courts hold organizations responsible for statements made by their AI agents — including false promises, incorrect advice, and binding commitments.',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-700',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
  },
  {
    title: 'Security Breaches',
    description: 'AI agents inadvertently exposing sensitive data, leaking system prompts, or providing attackers with unauthorized access to internal systems.',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-700',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
  {
    title: 'Customer Trust Erosion',
    description: 'Persistent unreliability causing users to lose confidence in AI-powered services, leading to reduced engagement and support escalations.',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-700',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
  },
];

export function KeyRisks() {
  return (
    <section className="py-20 bg-white border-t border-gray-200 content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">Key Risk Areas</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Common Vulnerabilities in AI Agent Systems
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Understanding these risk categories is the first step toward building safer AI agent deployments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {risks.map((r) => (
              <div key={r.title} className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className={`w-10 h-10 rounded ${r.bgColor} flex items-center justify-center mb-4`}>
                  <svg className={`w-5 h-5 ${r.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {r.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-primary-900 mb-2">{r.title}</h3>
                <p className="text-gray-600 text-sm">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
