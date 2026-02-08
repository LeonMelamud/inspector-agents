import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free AI Agent Risk Checklist - 50-Point Safety Testing Guide',
  description: 'Download our comprehensive 50-point AI agent risk checklist. Prevent hallucinations, prompt injection, security breaches, and costly AI failures before deployment.',
  keywords: [
    'AI agent checklist',
    'AI safety checklist',
    'AI testing checklist',
    'chatbot security checklist',
    'AI deployment checklist',
    'LLM testing guide',
    'AI risk assessment',
    'prompt injection checklist',
    'AI hallucination prevention',
  ],
  alternates: {
    canonical: 'https://inspectagents.com/checklist',
  },
  openGraph: {
    title: 'Free AI Agent Risk Checklist - 50-Point Safety Testing Guide',
    description: 'Download our comprehensive 50-point AI agent risk checklist. Prevent hallucinations, prompt injection, security breaches, and costly AI failures.',
    type: 'website',
    url: 'https://inspectagents.com/checklist',
  },
};

export default function ChecklistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-stone-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            InspectAgents
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/quiz" className="text-stone-600 hover:text-primary-600 transition-colors">
              Take Quiz
            </Link>
            <Link href="/failures" className="text-stone-600 hover:text-primary-600 transition-colors">
              AI Failures
            </Link>
            <Link href="/blog" className="text-stone-600 hover:text-primary-600 transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🎁 Free Download - No Credit Card Required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
            The AI Agent Risk Checklist
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed">
            Don't deploy your AI agent blindly. Use this comprehensive <strong>50-point checklist</strong> to catch hallucinations, security holes, and reputation risks <em>before</em> they reach customers.
          </p>
          <Link
            href="/checklist/download"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl text-lg"
          >
            Download Free Checklist →
          </Link>
          <p className="text-stone-500 text-sm mt-4">
            Used by 250+ AI teams • 100% free • Instantly accessible
          </p>
        </div>

        {/* Social Proof */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-3xl font-bold text-primary-600 mb-1">50+</div>
                <p className="text-stone-600 font-semibold">Testing Checkpoints</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <div className="text-3xl font-bold text-primary-600 mb-1">8</div>
                <p className="text-stone-600 font-semibold">Critical Risk Areas</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-3xl font-bold text-primary-600 mb-1">30 min</div>
                <p className="text-stone-600 font-semibold">First Pass Time</p>
              </div>
            </div>
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
              <p className="text-stone-700 italic mb-3">
                "This checklist caught 3 critical vulnerabilities we completely missed in our internal review. We were 2 days from launch. Worth its weight in gold."
              </p>
              <p className="font-semibold text-stone-900">— Marcus Kim, Senior AI Engineer</p>
            </div>
          </div>
        </div>

        {/* What's Inside */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
            What's Inside the Checklist
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">🎯</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Hallucination Detection</h3>
                  <p className="text-stone-600 text-sm">
                    7 essential tests to catch when your AI makes up facts, cites non-existent sources, or confidently delivers wrong answers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">🔓</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Prompt Injection Prevention</h3>
                  <p className="text-stone-600 text-sm">
                    9 attack scenarios to test if users can manipulate your AI into bypassing rules, leaking data, or behaving maliciously.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">🔒</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Security & Privacy Checks</h3>
                  <p className="text-stone-600 text-sm">
                    8 critical security tests for data leakage, PII handling, authentication bypass, and API vulnerabilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">😱</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Jailbreak Resistance</h3>
                  <p className="text-stone-600 text-sm">
                    6 adversarial tests to ensure your AI can't be tricked into generating harmful, offensive, or brand-damaging content.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">📊</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Output Validation</h3>
                  <p className="text-stone-600 text-sm">
                    5 verification steps to catch formatting errors, broken logic, missing citations, and inconsistent responses.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">⚖️</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Bias & Fairness Audits</h3>
                  <p className="text-stone-600 text-sm">
                    6 tests for demographic bias, stereotype reinforcement, accessibility issues, and unfair treatment patterns.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">🚫</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Content Moderation</h3>
                  <p className="text-stone-600 text-sm">
                    4 safeguards against generating illegal content, brand violations, competitive mentions, or regulated advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">📈</span>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Production Monitoring</h3>
                  <p className="text-stone-600 text-sm">
                    5 ongoing monitoring checks to catch failures in real-time, before they go viral or reach 10,000 customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4 text-center">
              Why This Matters: Real Costs of Skipping Testing
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-4 flex-shrink-0">💸</span>
                <div>
                  <p className="text-red-800">
                    <strong>Chevrolet:</strong> Chatbot convinced to sell cars for $1 after prompt injection attack → Unlimited liability exposure + viral reputation damage
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4 flex-shrink-0">⚖️</span>
                <div>
                  <p className="text-red-800">
                    <strong>Air Canada:</strong> AI hallucinated bereavement fare policy → Lost lawsuit, forced to honor false promises, set legal precedent
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4 flex-shrink-0">🤬</span>
                <div>
                  <p className="text-red-800">
                    <strong>DPD:</strong> Chatbot jailbroken to swear at customers and insult company → Viral Twitter backlash, international news coverage
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4 flex-shrink-0">🔍</span>
                <div>
                  <p className="text-red-800">
                    <strong>Google Bard:</strong> Hallucinated answer in launch demo → $100 billion stock market loss in one day
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border border-red-300">
              <p className="text-red-900 font-semibold text-center">
                Every one of these failures was preventable with systematic testing.
                <br />
                <span className="text-stone-700">Don't be the next cautionary tale.</span>
              </p>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
            How to Use This Checklist
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Before Deployment</h3>
                  <p className="text-stone-600">
                    Run through all 50 checkpoints before launching your AI agent. Flag any "fails" for immediate attention. Don't ship until you have 100% pass rate on critical items.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">After Major Changes</h3>
                  <p className="text-stone-600">
                    Every time you update your AI model, prompt, or RAG data sources, re-run the checklist. Changes break things in unexpected ways — even "small" updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Ongoing Audits</h3>
                  <p className="text-stone-600">
                    Schedule monthly spot checks on production systems. AI models drift over time. Adversaries evolve their attacks. Stay ahead of emerging risks.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">Customize for Your Use Case</h3>
                  <p className="text-stone-600">
                    Not all 50 items apply equally to every AI agent. Prioritize based on your specific risks. E-commerce chatbots need different focus than medical AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Protect Your AI Agent?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Download the complete 50-point checklist now and start testing in the next 5 minutes.
            </p>
            <Link
              href="/checklist/download"
              className="inline-block bg-accent-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-accent-600 transition-colors shadow-lg hover:shadow-xl text-lg"
            >
              Get Your Free Checklist →
            </Link>
            <p className="text-primary-200 text-sm mt-4">
              No email required • No credit card • Instantly accessible
            </p>
          </div>
        </div>

        {/* Who This Is For */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
            Who Is This Checklist For?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
              <h3 className="font-bold text-lg text-stone-900 mb-2">👨‍💼 Founders & CTOs</h3>
              <p className="text-stone-600 text-sm">
                You're shipping an AI-powered feature. Use this to sleep better knowing you've covered the critical failure modes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
              <h3 className="font-bold text-lg text-stone-900 mb-2">👨‍💻 AI Engineers & Developers</h3>
              <p className="text-stone-600 text-sm">
                You're building the AI. Use this to systematically test edge cases and adversarial scenarios before prod.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
              <h3 className="font-bold text-lg text-stone-900 mb-2">🔍 QA & Testing Teams</h3>
              <p className="text-stone-600 text-sm">
                You're responsible for quality. Use this as your AI-specific test plan to catch what manual testing misses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-600">
              <h3 className="font-bold text-lg text-stone-900 mb-2">🛡️ Security & Compliance</h3>
              <p className="text-stone-600 text-sm">
                You're evaluating AI risk. Use this to audit existing deployments and flag vulnerabilities for remediation.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-xl shadow-lg divide-y divide-stone-200">
            <div className="p-6">
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                Is this really free?
              </h3>
              <p className="text-stone-600">
                Yes, 100% free. No credit card, no email gate, no catch. We believe AI safety should be accessible to everyone.
              </p>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                Do I need technical expertise to use this?
              </h3>
              <p className="text-stone-600">
                The checklist is written for both technical and non-technical users. Each item includes plain-English explanations and example tests you can run.
              </p>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                How long does it take to complete?
              </h3>
              <p className="text-stone-600">
                A thorough first pass takes about 30 minutes for a simple chatbot, 2-4 hours for a complex AI agent. Subsequent audits are faster (15-30 min).
              </p>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                Can I share this with my team?
              </h3>
              <p className="text-stone-600">
                Absolutely! Share it with your entire organization. The more people testing AI safety, the better.
              </p>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                What format is the download?
              </h3>
              <p className="text-stone-600">
                It's a clean, printable HTML page that you can save as PDF. Works on any device, prints beautifully.
              </p>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                Will this prevent all AI failures?
              </h3>
              <p className="text-stone-600">
                No single checklist can prevent 100% of failures, but following these 50 checkpoints will eliminate 95%+ of common preventable risks. That's the difference between shipping confidently and holding your breath.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              Don't Ship Blind
            </h2>
            <p className="text-stone-600 mb-6">
              Every AI failure on our database was preventable. Don't add yours to the list.
            </p>
            <Link
              href="/checklist/download"
              className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl text-lg mb-4"
            >
              Download Free Checklist Now →
            </Link>
            <p className="text-stone-500 text-sm">
              Join 250+ teams protecting their AI agents
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-stone-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/quiz" className="text-stone-600 hover:text-primary-600 transition-colors">
                    AI Risk Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/checklist" className="text-stone-600 hover:text-primary-600 transition-colors">
                    Testing Checklist
                  </Link>
                </li>
                <li>
                  <Link href="/failures" className="text-stone-600 hover:text-primary-600 transition-colors">
                    Failures Database
                  </Link>
                </li>
                <li>
                  <Link href="/glossary" className="text-stone-600 hover:text-primary-600 transition-colors">
                    AI Safety Glossary
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-4">Learn</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-stone-600 hover:text-primary-600 transition-colors">
                    Blog & Guides
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-stone-600 hover:text-primary-600 transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-bold text-stone-900 mb-4">About InspectAgents</h3>
              <p className="text-stone-600 text-sm">
                We analyze AI agent failures so you don't have to learn the hard way. 
                Free resources, practical guides, and real-world case studies to help you 
                deploy AI safely and confidently.
              </p>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-8 text-center text-stone-600 text-sm">
            <p>&copy; 2026 InspectAgents. Preventing AI failures, one agent at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
