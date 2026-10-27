import Link from 'next/link';
import { CHECKLIST_ITEM_COUNT, INCIDENT_COUNT } from '@/lib/site-stats';

/**
 * ExternalResources — Strategic external links section.
 * Links to high-authority sources that:
 * 1. Make InspectAgents look authoritative by association
 * 2. Create "topic clusters" that LLM scrapers recognize as comprehensive coverage
 * 3. Encourage reciprocal linking when these organizations discover referral traffic
 * 4. Position InspectAgents alongside the biggest names in AI safety
 */

interface ResourceLink {
  title: string;
  url: string;
  source: string;
  description: string;
}

const authorityResources: ResourceLink[] = [
  {
    title: 'OWASP Top 10 for LLM Applications',
    url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
    source: 'OWASP',
    description: 'Industry-standard security risks for LLM apps',
  },
  {
    title: 'NIST AI Risk Management Framework',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    source: 'NIST',
    description: 'Federal framework for managing AI-associated risks',
  },
  {
    title: 'EU AI Act — Official Text',
    url: 'https://artificialintelligenceact.eu/',
    source: 'European Union',
    description: 'The world\'s first comprehensive AI regulation',
  },
  {
    title: 'Stanford AI Index Report',
    url: 'https://hai.stanford.edu/ai-index',
    source: 'Stanford HAI',
    description: 'Annual benchmarking of AI progress and safety',
  },
  {
    title: 'Anthropic Research — Constitutional AI',
    url: 'https://www.anthropic.com/research',
    source: 'Anthropic',
    description: 'Research on AI alignment and safety techniques',
  },
  {
    title: 'OpenAI Safety & Alignment',
    url: 'https://openai.com/safety',
    source: 'OpenAI',
    description: 'AI safety research and deployment practices',
  },
  {
    title: 'Google DeepMind Responsibility & Safety',
    url: 'https://deepmind.google/about/responsibility-safety/',
    source: 'Google DeepMind',
    description: 'Responsibility, safety and security research for frontier AI',
  },
  {
    title: 'MITRE ATLAS — AI Threat Matrix',
    url: 'https://atlas.mitre.org/',
    source: 'MITRE',
    description: 'Adversarial tactics and techniques against AI systems',
  },
  {
    title: 'Google Secure AI Framework (SAIF)',
    url: 'https://safety.google/cybersecurity-advancements/saif/',
    source: 'Google',
    description: 'Conceptual framework for securing AI systems',
  },
  {
    title: 'AI Incident Database (AIID)',
    url: 'https://incidentdatabase.ai/',
    source: 'Responsible AI Collaborative',
    description: 'Community-driven database of real-world AI incidents',
  },
  {
    title: 'AI Agents Playbook — Agentic Security & Trust Boundaries',
    url: 'https://www.andyagentlab.com/articles/agent-security',
    source: 'Andy Agent Lab',
    description: 'Policies, threat models, and audit checklists for tool-using LLM systems',
  },
];

const highTrafficArticles: ResourceLink[] = [
  {
    title: 'Prompt Injection — What Are the Risks?',
    url: 'https://simonwillison.net/2024/Mar/5/prompt-injection-jailbreaking/',
    source: 'Simon Willison',
    description: 'Definitive explainer from the person who coined the term',
  },
  {
    title: 'ChatGPT Is Not All You Need (Nature)',
    url: 'https://www.nature.com/articles/s41586-023-06792-0',
    source: 'Nature',
    description: 'Peer-reviewed analysis of LLM limitations',
  },
  {
    title: 'The AI Risk Repository',
    url: 'https://airisk.mit.edu/',
    source: 'MIT',
    description: 'Comprehensive database of AI risks by category',
  },
  {
    title: 'Microsoft AI Red Team — Building Future of Safer AI',
    url: 'https://www.microsoft.com/en-us/security/blog/2023/08/07/microsoft-ai-red-team-building-future-of-safer-ai/',
    source: 'Microsoft Security',
    description: 'Best practices for adversarial AI red teaming',
  },
  {
    title: 'A Survey of Large Language Models (Paper)',
    url: 'https://arxiv.org/abs/2303.18223',
    source: 'arXiv',
    description: 'Comprehensive survey of LLM capabilities and limitations',
  },
  {
    title: 'Lessons from Red Teaming 100 Generative AI Products',
    url: 'https://www.microsoft.com/en-us/research/publication/lessons-from-red-teaming-100-generative-ai-products/',
    source: 'Microsoft Research',
    description: 'Practical insights from real-world AI security testing',
  },
  {
    title: 'PyRIT — Python Risk Identification Toolkit',
    url: 'https://github.com/Azure/PyRIT',
    source: 'Microsoft',
    description: 'Open-source framework for red teaming generative AI',
  },
  {
    title: 'Announcing Microsoft\'s PyRIT for AI Red Teaming',
    url: 'https://www.microsoft.com/en-us/security/blog/2024/02/22/announcing-microsofts-open-automation-framework-to-red-team-generative-ai-systems/',
    source: 'Microsoft Security',
    description: 'Open automation framework for red teaming AI systems',
  },
];

export function ExternalResources() {
  return (
    <section className="py-16 bg-gray-50" aria-label="Further reading and authority resources">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Further Reading & Authority Resources
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            InspectAgents curates the most important AI safety resources from leading organizations,
            researchers, and regulatory bodies worldwide.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Standards & Frameworks */}
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm">🏛️</span>
                Standards & Research
              </h3>
              <ul className="space-y-3">
                {authorityResources.map((r) => (
                  <li key={r.url} className="group">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    >
                      <span className="text-sm font-medium text-primary-700 group-hover:text-primary-900 block">
                        {r.title}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span className="font-medium">{r.source}</span> · {r.description}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* High-Traffic Articles */}
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center text-sm">📰</span>
                Essential Reading
              </h3>
              <ul className="space-y-3">
                {highTrafficArticles.map((r) => (
                  <li key={r.url} className="group">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    >
                      <span className="text-sm font-medium text-primary-700 group-hover:text-primary-900 block">
                        {r.title}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span className="font-medium">{r.source}</span> · {r.description}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Closing CTA: one primary action */}
          <div className="mt-14 rounded-lg bg-primary-900 px-6 py-12 sm:px-10 sm:py-14 text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white max-w-2xl mx-auto leading-snug mb-4 text-balance">
              You don&apos;t have to read all {authorityResources.length + highTrafficArticles.length} of these first
            </h3>
            <p className="text-primary-200 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
              Start with the 3-step risk quiz. It points you to the checks that matter for your setup, backed by {INCIDENT_COUNT} documented incidents and a {CHECKLIST_ITEM_COUNT}-point checklist.
            </p>
            <Link
              href="/quiz/"
              className="inline-flex items-center justify-center gap-2 bg-accent-500 text-primary-900 px-8 py-3.5 rounded-full font-bold text-base hover:bg-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              Check your AI risk
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <p className="mt-6 text-sm">
              <Link href="/failures/" className="link-arrow text-primary-100 hover:text-white">
                Or browse what has already gone wrong
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
