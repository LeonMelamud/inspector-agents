const faqs = [
  {
    question: 'What is an AI agent failure?',
    answer: 'An AI agent failure occurs when a chatbot, virtual assistant, or autonomous agent produces incorrect, harmful, or unexpected outputs that negatively impact your business. This includes hallucinations, prompt injection attacks, jailbreaks, security breaches, and reputational damage.',
  },
  {
    question: 'How do I test my AI agent before deployment?',
    answer: 'Testing AI agents requires a multi-layered approach: hallucination detection, prompt injection testing, output validation, security testing, bias auditing, content moderation, load testing, and production monitoring. Start with our free risk assessment to identify your highest-risk areas.',
  },
  {
    question: 'Is my company legally liable for what my AI chatbot says?',
    answer: 'Yes. Courts have consistently ruled that companies are legally responsible for information and promises made by their AI agents. In the Air Canada case, the tribunal ruled that \u201cAir Canada is responsible for information provided by its agents, including its chatbot.\u201d',
  },
  {
    question: 'What is prompt injection and why is it dangerous?',
    answer: "Prompt injection is a vulnerability where users craft malicious inputs that override your AI agent\u2019s original instructions. This can lead to unauthorized actions, data breaches, reputational damage, and legal liability.",
  },
  {
    question: 'How much does an AI failure cost?',
    answer: 'For most organizations, a single significant AI failure costs between $100,000 and $10 million in total impact, including legal fees, operational costs, reputational damage, and customer trust erosion. Prevention typically costs 100x less than incident response and recovery.',
  },
  {
    question: 'How often should I test my AI agent?',
    answer: 'AI agent testing should happen at multiple stages: pre-deployment, after updates, with continuous monitoring, periodic audits, and after any incident. AI models can drift over time, and the most successful teams treat testing as an ongoing practice.',
  },
];

export function FaqSection() {
  return (
    <section className="py-20 bg-white border-t border-gray-200 content-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">FAQ</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border border-gray-200 rounded-lg">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="font-bold text-primary-900 text-base pr-4">{faq.question}</h3>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
