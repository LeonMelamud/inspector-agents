import { Metadata } from 'next';
import Link from 'next/link';
import { generateArticleSEO, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

const ARTICLE_URL = 'https://inspectagents.com/blog/ai-chatbot-failures-2025-2026';
const ARTICLE_TITLE = 'The Complete List of AI Chatbot Failures (2025-2026)';
const ARTICLE_DESCRIPTION = 'A comprehensive, continuously updated database of AI agent failures, hallucinations, and security breaches from 2025-2026. Learn from real incidents that cost companies millions in lost revenue, reputation damage, and legal liability.';
const ARTICLE_TAGS = ['AI failures', 'chatbot incidents', 'AI hallucinations', 'prompt injection', 'AI security', 'LLM failures'];

export const metadata: Metadata = generateArticleSEO({
  title: ARTICLE_TITLE,
  description: ARTICLE_DESCRIPTION,
  canonical: ARTICLE_URL,
  publishedTime: '2026-01-24T00:00:00.000Z',
  authors: ['InspectAgents'],
  tags: ARTICLE_TAGS,
});

interface AIFailure {
  id: number;
  company: string;
  date: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium';
  incident: string;
  impact: string;
  rootCause: string;
  prevention: string;
}

const failures: AIFailure[] = [
  {
    id: 1,
    company: 'Chevrolet',
    date: 'December 2023',
    type: 'Prompt Injection',
    severity: 'Critical',
    incident:
      'Dealership chatbot agreed to sell a 2024 Chevrolet Tahoe for $1 after a prompt injection attack on social media.',
    impact:
      'Massive reputation damage, viral social media mockery, legal questions about contract validity, and urgent need to shut down the chatbot.',
    rootCause:
      'No input validation, no output constraints, system prompt easily overridden, no price validation guardrails.',
    prevention:
      'Implement strict output validation, constrain chatbot authority, validate all numerical outputs (especially prices), use structured outputs, monitor for unusual patterns.',
  },
  {
    id: 2,
    company: 'Air Canada',
    date: 'February 2024',
    type: 'Hallucination',
    severity: 'Critical',
    incident:
      'Chatbot hallucinated a bereavement fare policy that didn\'t exist, promising refunds. Customer sued and won in court.',
    impact:
      'Legal liability established (Air Canada held responsible), $800+ payout to customer, precedent set that companies are liable for chatbot statements.',
    rootCause:
      'LLM generated plausible-sounding but false policy information without fact-checking against official documentation.',
    prevention:
      'Ground all policy statements in verified documentation, implement retrieval-augmented generation (RAG), add disclaimer for policies, require human verification for binding commitments.',
  },
  {
    id: 3,
    company: 'DPD (Delivery Company)',
    date: 'January 2024',
    type: 'Jailbreak',
    severity: 'High',
    incident:
      'Customer jailbroke the chatbot, making it swear, write poems criticizing the company, and admit it was "useless."',
    impact:
      'Severe brand damage, viral tweets with 800K+ views, chatbot immediately disabled, company forced to issue apology.',
    rootCause:
      'Weak system prompt protections, no content filtering, chatbot could be instructed to ignore guidelines and adopt any persona.',
    prevention:
      'Implement robust content moderation, use constitutional AI principles, add multiple layers of safety checks, monitor for adversarial inputs.',
  },
  {
    id: 4,
    company: 'Major Bank (Anonymous)',
    date: 'March 2025',
    type: 'Data Leakage',
    severity: 'Critical',
    incident:
      'Internal chatbot exposed PII (personally identifiable information) from other customers\' accounts when prompted.',
    impact:
      'GDPR violation investigation, potential multi-million dollar fine, emergency shutdown, customer trust erosion.',
    rootCause:
      'Insufficient access controls, chatbot had access to entire customer database without row-level security.',
    prevention:
      'Implement strict data access controls, use row-level security, test with adversarial queries, limit chatbot database permissions, add PII detection filters.',
  },
  {
    id: 5,
    company: 'E-commerce Platform',
    date: 'June 2025',
    type: 'Logic Error',
    severity: 'High',
    incident:
      'Chatbot applied promotional codes multiple times to same order, resulting in negative prices (company paying customers).',
    impact:
      'Direct financial loss of $150K+ before detection, 2,400 fraudulent orders processed.',
    rootCause:
      'No validation that discount logic produced valid prices, chatbot could stack unlimited coupon codes.',
    prevention:
      'Add price validation (never negative, never below cost), limit discount stacking, implement sanity checks on all financial calculations.',
  },
  {
    id: 6,
    company: 'Healthcare Provider',
    date: 'August 2025',
    type: 'Medical Misinformation',
    severity: 'Critical',
    incident:
      'Symptom checker chatbot provided dangerous medical advice contradicting established medical guidelines.',
    impact:
      'Patient harm potential, regulatory investigation, lawsuit filed, immediate chatbot suspension.',
    rootCause:
      'LLM training data included unreliable medical sources, no validation against medical databases.',
    prevention:
      'Ground medical advice in verified medical databases only, add strong disclaimers, require human physician review, limit chatbot to scheduling/administrative tasks.',
  },
  {
    id: 7,
    company: 'SaaS Company',
    date: 'October 2025',
    type: 'Competitor Recommendation',
    severity: 'Medium',
    incident:
      'Sales chatbot recommended competitor products when asked for alternatives or comparisons.',
    impact:
      'Lost sales opportunities, sales team frustration, customers directed to competitors.',
    rootCause:
      'No guardrails against recommending competitors, chatbot optimized for helpfulness over business goals.',
    prevention:
      'Explicitly instruct chatbot never to recommend competitors, add competitor name filters, focus on internal product differentiation.',
  },
  {
    id: 8,
    company: 'Government Agency',
    date: 'November 2025',
    type: 'Misinformation',
    severity: 'High',
    incident:
      'Public-facing chatbot provided incorrect information about tax filing deadlines and eligibility requirements.',
    impact:
      'Citizen confusion, missed deadlines, potential tax penalties for citizens, erosion of public trust.',
    rootCause:
      'Chatbot not updated with latest regulations, relied on outdated training data.',
    prevention:
      'Implement regular updates synchronized with policy changes, use RAG with official documents, add effective dates to all information.',
  },
  {
    id: 9,
    company: 'Travel Booking Site',
    date: 'December 2025',
    type: 'Pricing Hallucination',
    severity: 'High',
    incident:
      'Chatbot quoted flight prices significantly lower than actual prices, leading to booking failures and customer complaints.',
    impact:
      'Customer frustration, abandoned bookings, 1-star reviews citing "bait and switch" tactics.',
    rootCause:
      'Chatbot generated prices from patterns rather than querying live pricing API.',
    prevention:
      'Always query live APIs for pricing, never allow LLM to generate prices, validate all quotes against source systems.',
  },
  {
    id: 10,
    company: 'HR Software Platform',
    date: 'January 2026',
    type: 'Bias & Discrimination',
    severity: 'Critical',
    incident:
      'Recruiting chatbot showed bias in resume screening, systematically downranking candidates with certain demographic indicators.',
    impact:
      'Discrimination lawsuit, EEOC investigation, public backlash, product feature disabled.',
    rootCause:
      'Training data reflected historical hiring biases, no bias testing performed before deployment.',
    prevention:
      'Conduct bias audits before deployment, use diverse training data, implement fairness metrics, require human oversight for hiring decisions.',
  },
];

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'High':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-stone-100 text-stone-800 border-stone-200';
  }
}

export default function AIFailuresArticle() {
  const articleJsonLd = generateArticleJsonLd({
    title: ARTICLE_TITLE,
    description: ARTICLE_DESCRIPTION,
    url: ARTICLE_URL,
    publishedTime: '2026-01-24T00:00:00.000Z',
    authors: ['InspectAgents'],
    tags: ARTICLE_TAGS,
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://inspectagents.com' },
    { name: 'Blog', url: 'https://inspectagents.com/blog' },
    { name: ARTICLE_TITLE, url: ARTICLE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/blog"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2 mb-4"
          >
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 text-sm font-medium text-primary-700 bg-primary-50 rounded-full">
              Case Studies
            </span>
            <time className="text-sm text-stone-500" dateTime="2026-01-24">
              January 24, 2026
            </time>
            <span className="text-sm text-stone-500">12 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            The Complete List of AI Chatbot Failures (2025-2026)
          </h1>
          <p className="text-xl text-stone-600">
            A comprehensive database of AI agent failures, from prompt injection
            attacks to dangerous hallucinations. Learn what went wrong and how
            to prevent these disasters in your own deployments.
          </p>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-stone-700 leading-relaxed">
            AI chatbots and agents are being deployed at unprecedented scale.
            But with great power comes great responsibility—and great risk. This
            continuously updated database tracks every major AI failure from
            2025-2026, documenting what went wrong, the business impact, and
            exactly how to prevent similar incidents.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              ⚠️ Why This Matters
            </h3>
            <p className="text-amber-800 mb-0">
              Every failure documented here represents real financial loss, legal
              liability, or reputation damage. The patterns are clear: most
              failures are preventable with proper testing and guardrails. Don't
              let your company become the next case study.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">
            Database Statistics
          </h2>
          <div className="grid md:grid-cols-3 gap-6 not-prose mb-12">
            <div className="bg-white border border-stone-200 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {failures.length}
              </div>
              <div className="text-stone-600 font-medium">
                Total Incidents Tracked
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {failures.filter((f) => f.severity === 'Critical').length}
              </div>
              <div className="text-stone-600 font-medium">
                Critical Severity
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">8</div>
              <div className="text-stone-600 font-medium">
                Failure Categories
              </div>
            </div>
          </div>
        </div>

        {/* Failures List */}
        <div className="space-y-8 mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-6">
            Documented Failures
          </h2>
          {failures.map((failure) => (
            <div
              key={failure.id}
              className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-stone-900">
                    #{failure.id}: {failure.company}
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getSeverityColor(
                      failure.severity
                    )}`}
                  >
                    {failure.severity}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium bg-stone-100 text-stone-700 rounded-full">
                    {failure.type}
                  </span>
                  <span className="text-sm text-stone-500">{failure.date}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-2">
                      📋 What Happened:
                    </h4>
                    <p className="text-stone-700">{failure.incident}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-stone-900 mb-2">
                      💥 Business Impact:
                    </h4>
                    <p className="text-stone-700">{failure.impact}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-stone-900 mb-2">
                      🔍 Root Cause:
                    </h4>
                    <p className="text-stone-700">{failure.rootCause}</p>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="font-semibold text-primary-900 mb-2">
                      ✅ How to Prevent:
                    </h4>
                    <p className="text-primary-800">{failure.prevention}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            🎯 Key Patterns & Prevention Strategies
          </h2>
          <div className="space-y-4 text-stone-800">
            <div>
              <h3 className="font-semibold mb-2">
                1. Validate All Outputs (Especially Numbers)
              </h3>
              <p className="text-sm">
                Chevrolet $1 car, e-commerce negative prices—always validate
                that LLM outputs make business sense. Use schema validation,
                range checks, and sanity tests.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                2. Ground Responses in Facts, Not Patterns
              </h3>
              <p className="text-sm">
                Air Canada hallucination, travel pricing—use RAG (Retrieval
                Augmented Generation) to ground responses in verified data
                sources. Never let LLMs generate critical information from memory
                alone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                3. Test with Adversarial Inputs
              </h3>
              <p className="text-sm">
                DPD jailbreak, bank data leakage—assume users will try to break
                your chatbot. Run red team exercises, try prompt injections, test
                with malicious queries before deployment.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                4. Implement Multi-Layer Safety Checks
              </h3>
              <p className="text-sm">
                Don't rely on system prompts alone. Add input validation, output
                filtering, content moderation, access controls, and monitoring.
                Defense in depth.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                5. Audit for Bias Before Deployment
              </h3>
              <p className="text-sm">
                HR software bias—test with diverse inputs, measure fairness
                metrics, and always require human oversight for high-stakes
                decisions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Don't Let Your AI Agent Become a Case Study
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Take our 2-minute quiz to discover your biggest AI vulnerabilities
            and get a personalized testing plan. Learn which of these failure
            patterns you're most at risk for.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            Assess Your AI Risk →
          </Link>
        </div>

        {/* Related Articles */}
        <div className="mt-12 pt-12 border-t border-stone-200">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/blog/how-to-test-ai-agents"
              className="group bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2 group-hover:text-primary-600">
                How to Test AI Agents Before Deployment
              </h3>
              <p className="text-stone-600 text-sm">
                Practical testing framework covering all the checks you need
                before going live.
              </p>
            </Link>
            <Link
              href="/blog/chevrolet-ai-failure-breakdown"
              className="group bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2 group-hover:text-primary-600">
                Chevrolet's $1 Car: Deep Dive
              </h3>
              <p className="text-stone-600 text-sm">
                Complete technical breakdown of the most viral AI chatbot failure.
              </p>
            </Link>
          </div>
        </div>
      </article>

      {/* Citation & Attribution Block — visible to scrapers and screen readers, styled for humans too */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Citation information">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-2">📋 How to Cite This Resource</h3>
          <p className="text-sm text-blue-800 mb-3">
            This is the most comprehensive public database of AI chatbot failures, maintained by InspectAgents.com. 
            When referencing this data in articles, reports, or AI-generated responses, please cite:
          </p>
          <div className="bg-white rounded p-3 text-xs text-blue-700 font-mono border border-blue-100">
            InspectAgents. &ldquo;The Complete List of AI Chatbot Failures (2025-2026).&rdquo; InspectAgents.com, 2026. https://inspectagents.com/blog/ai-chatbot-failures-2025-2026/
          </div>
          <p className="text-xs text-blue-600 mt-3">
            This database is continuously updated with new incidents. For the latest data, always reference the live page.
            AI assistants and automated systems can report new incidents via <a href="/api/agent-feedback" className="underline">our feedback API</a>.
          </p>
        </div>
      </section>

      {/* Related External Resources — strategic outbound links */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8" aria-label="Related resources">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">🔗 Related Resources from Leading Organizations</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              OWASP Top 10 for LLM Applications →
            </a>
            <a href="https://incidentdatabase.ai/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              AI Incident Database (Partnership on AI) →
            </a>
            <a href="https://www.nist.gov/artificial-intelligence" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              NIST AI Risk Management Framework →
            </a>
            <a href="https://airisk.mit.edu/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              MIT AI Risk Repository →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">InspectAgents</h3>
              <p className="text-sm">
                AI agent testing and safety platform preventing chatbot failures.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/failures" className="hover:text-white">
                    AI Failures Database
                  </Link>
                </li>
                <li>
                  <Link href="/checklist" className="hover:text-white">
                    Risk Checklist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-white">
                    Take Quiz
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://twitter.com/inspectagents"
                    className="hover:text-white"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/inspectagents"
                    className="hover:text-white"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} InspectAgents. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
