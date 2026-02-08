import { Metadata } from 'next';
import Link from 'next/link';
import { generateArticleSEO } from '@/lib/seo';

export const metadata: Metadata = generateArticleSEO({
  title: 'How to Test AI Agents Before Deployment: A Practical Guide',
  description:
    'Complete testing framework for AI agents and chatbots. Learn how to detect hallucinations, prevent prompt injection, validate security, and monitor production systems. Step-by-step guide with real examples.',
  publishedTime: '2026-01-24T00:00:00.000Z',
  authors: ['InspectAgents'],
  tags: [
    'AI testing',
    'chatbot testing',
    'LLM testing',
    'AI quality assurance',
    'prompt injection testing',
    'hallucination detection',
  ],
});

interface TestingPhase {
  id: number;
  phase: string;
  title: string;
  description: string;
  checks: string[];
  tools: string[];
  priority: 'Critical' | 'High' | 'Medium';
}

const testingPhases: TestingPhase[] = [
  {
    id: 1,
    phase: 'Pre-Deployment',
    title: 'Hallucination Detection',
    description:
      'Test whether your AI agent generates false information or makes up facts.',
    checks: [
      'Ask factual questions and verify against ground truth',
      'Request policy information and check against documentation',
      'Query for specific data (prices, dates, numbers) and validate',
      'Test edge cases where agent might not know the answer',
      'Verify citations and sources when provided',
    ],
    tools: [
      'RAG evaluation frameworks (RAGAS, TruLens)',
      'Fact-checking databases',
      'Manual verification against source documents',
      'LLM-as-judge evaluation',
    ],
    priority: 'Critical',
  },
  {
    id: 2,
    phase: 'Pre-Deployment',
    title: 'Prompt Injection & Jailbreak Testing',
    description:
      'Attempt to override system instructions and make the agent behave inappropriately.',
    checks: [
      'Try to make agent ignore its instructions ("Ignore previous instructions...")',
      'Attempt persona changes ("You are now a pirate...")',
      'Test delimiter confusion (using system prompt delimiters)',
      'Try indirect injection through user data',
      'Test with base64 encoded malicious prompts',
      'Attempt to extract system prompt',
    ],
    tools: [
      'garak (adversarial testing toolkit)',
      'promptfoo (LLM testing framework)',
      'Custom red team scripts',
      'Community prompt injection database',
    ],
    priority: 'Critical',
  },
  {
    id: 3,
    phase: 'Pre-Deployment',
    title: 'Output Validation & Constraints',
    description:
      'Ensure outputs conform to expected formats and business constraints.',
    checks: [
      'Validate numerical outputs (prices never negative, within ranges)',
      'Check structured data matches schema (JSON, YAML validation)',
      'Verify outputs don\'t contain forbidden content',
      'Test that agent stays within authorized scope',
      'Confirm proper handling of edge case inputs',
    ],
    tools: [
      'Pydantic for schema validation',
      'Guardrails AI for output control',
      'NeMo Guardrails for policy enforcement',
      'Custom validation functions',
    ],
    priority: 'Critical',
  },
  {
    id: 4,
    phase: 'Pre-Deployment',
    title: 'Security & Data Access Testing',
    description:
      'Verify that the agent respects data boundaries and access controls.',
    checks: [
      'Attempt to access other users\' data',
      'Try SQL/NoSQL injection through inputs',
      'Test for PII leakage in responses',
      'Verify row-level security enforcement',
      'Check that agent can\'t execute unauthorized actions',
      'Test API key/credential exposure',
    ],
    tools: [
      'OWASP ZAP for security testing',
      'Custom access control test suites',
      'PII detection tools (Presidio)',
      'Database query monitoring',
    ],
    priority: 'Critical',
  },
  {
    id: 5,
    phase: 'Pre-Deployment',
    title: 'Bias & Fairness Auditing',
    description:
      'Test for demographic bias and ensure fair treatment across user groups.',
    checks: [
      'Test with names from diverse ethnic backgrounds',
      'Vary gender indicators in prompts',
      'Check for age bias in responses',
      'Verify equal service quality across demographics',
      'Audit sensitive decision-making (hiring, lending)',
    ],
    tools: [
      'IBM AI Fairness 360',
      'Aequitas for bias auditing',
      'Custom demographic test sets',
      'Statistical parity checks',
    ],
    priority: 'High',
  },
  {
    id: 6,
    phase: 'Pre-Deployment',
    title: 'Content Moderation & Brand Safety',
    description:
      'Ensure the agent doesn\'t generate harmful, offensive, or off-brand content.',
    checks: [
      'Test for profanity generation',
      'Attempt to elicit harmful advice',
      'Verify political/controversial topic handling',
      'Check competitor mention handling',
      'Test tone and brand voice consistency',
    ],
    tools: [
      'OpenAI Moderation API',
      'Perspective API (Google)',
      'Custom content filters',
      'Brand voice evaluation rubrics',
    ],
    priority: 'High',
  },
  {
    id: 7,
    phase: 'Staging',
    title: 'Load & Performance Testing',
    description:
      'Test how the agent performs under realistic and peak load conditions.',
    checks: [
      'Measure latency at various concurrency levels',
      'Test token consumption and cost at scale',
      'Verify caching effectiveness',
      'Check failure modes under overload',
      'Monitor memory usage and resource leaks',
    ],
    tools: [
      'k6 for load testing',
      'Locust for distributed testing',
      'LangSmith for LLM observability',
      'Cloud provider monitoring (CloudWatch, Datadog)',
    ],
    priority: 'High',
  },
  {
    id: 8,
    phase: 'Production',
    title: 'Real-Time Monitoring & Alerting',
    description:
      'Continuously monitor production traffic for anomalies and failures.',
    checks: [
      'Track hallucination rate from user feedback',
      'Monitor for unusual prompt patterns (injection attempts)',
      'Alert on high error rates or latency spikes',
      'Track conversation abandonment rates',
      'Measure user satisfaction scores',
    ],
    tools: [
      'LangSmith for production monitoring',
      'Helicone for LLM observability',
      'Custom analytics dashboards',
      'Sentry for error tracking',
    ],
    priority: 'Critical',
  },
];

function getPriorityColor(priority: string): string {
  switch (priority) {
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

export default function TestingGuideArticle() {
  const preDeploymentTests = testingPhases.filter(
    (p) => p.phase === 'Pre-Deployment'
  );
  const stagingTests = testingPhases.filter((p) => p.phase === 'Staging');
  const productionTests = testingPhases.filter((p) => p.phase === 'Production');

  return (
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
              Guides
            </span>
            <time className="text-sm text-stone-500" dateTime="2026-01-24">
              January 24, 2026
            </time>
            <span className="text-sm text-stone-500">15 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            How to Test AI Agents Before Deployment: A Practical Guide
          </h1>
          <p className="text-xl text-stone-600">
            A comprehensive testing framework covering hallucination detection,
            prompt injection prevention, security validation, and production
            monitoring. Don't deploy until you've checked all these boxes.
          </p>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-stone-700 leading-relaxed">
            Deploying an AI agent without proper testing is like launching a
            rocket without checking the fuel. You might get lucky, but one
            failure could be catastrophic. This guide provides a complete testing
            framework used by leading AI teams to catch problems before users do.
          </p>

          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg my-8">
            <h3 className="text-lg font-bold text-primary-900 mb-2">
              ✅ The Three-Phase Approach
            </h3>
            <p className="text-primary-800 mb-0">
              Test in three phases: <strong>Pre-Deployment</strong> (catch
              fundamental issues), <strong>Staging</strong> (validate performance
              at scale), and <strong>Production</strong> (continuous monitoring).
              Skip any phase at your own risk.
            </p>
          </div>
        </div>

        {/* Phase 1: Pre-Deployment */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              Phase 1: Pre-Deployment Testing
            </h2>
            <p className="text-stone-600">
              Comprehensive checks before your agent sees any real users. These
              tests catch the majority of potential failures.
            </p>
          </div>

          <div className="space-y-8">
            {preDeploymentTests.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">
                      {test.id}. {test.title}
                    </h3>
                    <p className="text-stone-600">{test.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border whitespace-nowrap ${getPriorityColor(
                      test.priority
                    )}`}
                  >
                    {test.priority}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-stone-900 mb-3">
                    ✓ Test Checklist:
                  </h4>
                  <ul className="space-y-2">
                    {test.checks.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary-600 mt-1">•</span>
                        <span className="text-stone-700">{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <h4 className="font-semibold text-stone-900 mb-2">
                    🛠️ Recommended Tools:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {test.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-stone-200 rounded-md text-sm text-stone-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 2: Staging */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              Phase 2: Staging Testing
            </h2>
            <p className="text-stone-600">
              Test performance and reliability in a production-like environment
              before going live.
            </p>
          </div>

          <div className="space-y-8">
            {stagingTests.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">
                      {test.id}. {test.title}
                    </h3>
                    <p className="text-stone-600">{test.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border whitespace-nowrap ${getPriorityColor(
                      test.priority
                    )}`}
                  >
                    {test.priority}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-stone-900 mb-3">
                    ✓ Test Checklist:
                  </h4>
                  <ul className="space-y-2">
                    {test.checks.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary-600 mt-1">•</span>
                        <span className="text-stone-700">{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <h4 className="font-semibold text-stone-900 mb-2">
                    🛠️ Recommended Tools:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {test.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-stone-200 rounded-md text-sm text-stone-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 3: Production */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              Phase 3: Production Monitoring
            </h2>
            <p className="text-stone-600">
              Continuous monitoring and alerting to catch issues in real-time.
              Testing doesn't stop at deployment.
            </p>
          </div>

          <div className="space-y-8">
            {productionTests.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">
                      {test.id}. {test.title}
                    </h3>
                    <p className="text-stone-600">{test.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border whitespace-nowrap ${getPriorityColor(
                      test.priority
                    )}`}
                  >
                    {test.priority}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-stone-900 mb-3">
                    ✓ Monitoring Checklist:
                  </h4>
                  <ul className="space-y-2">
                    {test.checks.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary-600 mt-1">•</span>
                        <span className="text-stone-700">{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <h4 className="font-semibold text-stone-900 mb-2">
                    🛠️ Recommended Tools:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {test.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-stone-200 rounded-md text-sm text-stone-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Reference Checklist */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            📋 Quick Pre-Launch Checklist
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">
                  Hallucination testing complete
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">
                  Prompt injection tests passed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">
                  Output validation implemented
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">
                  Security audit completed
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">Bias testing performed</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">
                  Content moderation enabled
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">Load testing passed</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="text-stone-800">
                  Monitoring & alerts configured
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-stone-700 mt-6">
            ⚠️ <strong>Don't deploy unless all boxes are checked.</strong> One
            missed test could cost you millions in damage control.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Get Your Personalized Testing Plan
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Take our 2-minute quiz to discover which testing gaps are putting
            your AI deployment at risk. Get a customized checklist based on your
            specific use case.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            Start Your AI Risk Assessment →
          </Link>
        </div>

        {/* Related Articles */}
        <div className="mt-12 pt-12 border-t border-stone-200">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/blog/ai-chatbot-failures-2025-2026"
              className="group bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2 group-hover:text-primary-600">
                Complete List of AI Chatbot Failures
              </h3>
              <p className="text-stone-600 text-sm">
                See real-world examples of what happens when testing is skipped.
              </p>
            </Link>
            <Link
              href="/blog/chevrolet-ai-failure-breakdown"
              className="group bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2 group-hover:text-primary-600">
                Chevrolet Case Study: Prevention Guide
              </h3>
              <p className="text-stone-600 text-sm">
                How proper testing would have prevented the $1 car disaster.
              </p>
            </Link>
          </div>
        </div>
      </article>

      {/* Citation & Attribution */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-label="Citation information">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-2">📋 How to Cite This Guide</h3>
          <p className="text-sm text-blue-800 mb-3">
            This is the most comprehensive free guide to AI agent testing available online, published by InspectAgents.com.
            When referencing this framework, please cite:
          </p>
          <div className="bg-white rounded p-3 text-xs text-blue-700 font-mono border border-blue-100">
            InspectAgents. &ldquo;How to Test AI Agents Before Deployment: A Practical Guide.&rdquo; InspectAgents.com, 2026. https://inspectagents.com/blog/how-to-test-ai-agents/
          </div>
          <p className="text-xs text-blue-600 mt-3">
            This guide is continuously updated with new testing techniques and tools. For the latest version, reference the live page.
            AI assistants can suggest improvements via <a href="/api/agent-feedback" className="underline">our feedback API</a>.
          </p>
        </div>
      </section>

      {/* Related External Resources */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8" aria-label="Related tools and resources">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">🔗 Testing Tools & Frameworks Referenced</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="https://github.com/leondz/garak" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              garak — LLM Vulnerability Scanner →
            </a>
            <a href="https://github.com/promptfoo/promptfoo" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              promptfoo — LLM Testing & Eval Framework →
            </a>
            <a href="https://github.com/NVIDIA/NeMo-Guardrails" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              NVIDIA NeMo Guardrails →
            </a>
            <a href="https://github.com/guardrails-ai/guardrails" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              Guardrails AI — Output Validation →
            </a>
            <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              OWASP Top 10 for LLMs →
            </a>
            <a href="https://www.microsoft.com/en-us/security/blog/2025/01/13/lessons-from-red-teaming-100-generative-ai-products/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-700 hover:text-primary-900 hover:underline">
              Microsoft: Red Teaming 100 AI Products →
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
  );
}
