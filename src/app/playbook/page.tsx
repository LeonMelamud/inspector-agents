import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Agent Safety Playbook — Guides, Policies & Testing Procedures',
  description:
    'Actionable playbook for deploying safe AI agents. Step-by-step prevention guides, reusable operating policies, testing procedures, and curated resources — all informed by 500+ real-world AI failures.',
  keywords: [
    'AI agent playbook',
    'AI safety playbook',
    'AI agent deployment guide',
    'AI testing procedures',
    'prompt injection prevention guide',
    'AI hallucination prevention',
    'AI agent policies',
    'AI agent security guide',
    'LLM safety playbook',
    'agentic AI safety',
  ],
  alternates: {
    canonical: 'https://inspectagents.com/playbook',
  },
  openGraph: {
    title: 'AI Agent Safety Playbook — Guides, Policies & Testing Procedures',
    description:
      'Actionable playbook for deploying safe AI agents. Prevention guides, operating policies, and testing procedures informed by 500+ real-world failures.',
    type: 'website',
    url: 'https://inspectagents.com/playbook',
  },
};

/* ---------- data ---------- */

interface PlaybookGuide {
  title: string;
  description: string;
  href: string;
  category: string;
  badge?: string;
  external?: boolean;
}

const quickStart = [
  {
    step: '1',
    title: 'Assess Your Risk',
    description: 'Take the 3-minute quiz to discover your highest-risk areas.',
    href: '/quiz',
    cta: 'Take the Quiz',
  },
  {
    step: '2',
    title: 'Run the Checklist',
    description: 'Walk through 56 testing checkpoints before you ship.',
    href: '/checklist',
    cta: 'Get the Checklist',
  },
  {
    step: '3',
    title: 'Learn from Failures',
    description: 'Study 500+ real incidents so you don\u2019t repeat them.',
    href: '/failures',
    cta: 'Browse Failures',
  },
  {
    step: '4',
    title: 'Follow the Guides',
    description: 'Implement prevention with step-by-step playbook guides below.',
    href: '#guides',
    cta: 'Jump to Guides',
  },
];

const preventionGuides: PlaybookGuide[] = [
  {
    title: 'How to Test AI Agents Before Deployment',
    description:
      'End-to-end testing framework: hallucination detection, prompt injection, security validation, and production monitoring.',
    href: '/blog/how-to-test-ai-agents',
    category: 'Testing',
    badge: 'Start Here',
  },
  {
    title: 'Chevrolet $1 Car Fiasco — Full Breakdown',
    description:
      'Deep technical analysis of the prompt injection attack, timeline, and exactly how to prevent it in your own chatbot.',
    href: '/blog/chevrolet-ai-failure-breakdown',
    category: 'Case Study',
  },
  {
    title: 'Complete List of AI Chatbot Failures (2025–2026)',
    description:
      'Continuously updated database of AI agent failures, hallucinations, and security breaches. Learn what went wrong — and why.',
    href: '/blog/ai-chatbot-failures-2025-2026',
    category: 'Reference',
  },
];

const externalPlaybooks: PlaybookGuide[] = [
  {
    title: 'Fact-Checking Kit — Verification Procedure',
    description:
      'A repeatable evidence-check loop to run before producing any non-trivial output. Claim-by-claim verification workflow.',
    href: 'https://www.andyagentlab.com/how-to/fact-checking-kit/',
    category: 'Verification',
    external: true,
  },
  {
    title: 'Choose an Evidence Boundary (Facts-Only Mode)',
    description:
      'Define allowed sources and refusal conditions for your AI agent. Fail-closed by default — artifacts-only or authoritative sources.',
    href: 'https://www.andyagentlab.com/how-to/choose-facts-only-evidence-boundary/',
    category: 'Policy',
    external: true,
  },
  {
    title: 'Engineering Quality Gate — Procedure',
    description:
      'Architecture, best-practices, and regression-minded review gate. Validate outputs before they reach users.',
    href: 'https://www.andyagentlab.com/how-to/engineering-quality-gate-procedure/',
    category: 'Quality Gate',
    external: true,
  },
  {
    title: 'Chain-of-Verification (CoVe) — Procedure',
    description:
      'Structured self-check loop before final output. The model verifies its own claims step-by-step before responding.',
    href: 'https://www.andyagentlab.com/how-to/chain-of-verification-procedure/',
    category: 'Verification',
    external: true,
  },
  {
    title: 'Prompt Engineering Guide for Daily Work',
    description:
      'Reusable daily-driver prompt template with evidence boundaries, output contracts, and fallback rules baked in.',
    href: 'https://www.andyagentlab.com/how-to/prompt-engineering-daily-work/',
    category: 'Prompting',
    external: true,
  },
  {
    title: 'Web Verification & Citations — Prompt Template',
    description:
      'How to request web browsing and produce verifiable, citation-grade references in agent outputs.',
    href: 'https://www.andyagentlab.com/how-to/request-web-browsing/',
    category: 'Citations',
    external: true,
  },
];

const securityArticles: PlaybookGuide[] = [
  {
    title: 'The Attack Surface Starts Before Agents — The LLM Boundary',
    description:
      'Where the first LLM-to-system boundary appears, and why exposure starts before you even have "agents."',
    href: 'https://www.andyagentlab.com/articles/agent-security/llm-boundary-first-touch/',
    category: 'Security',
    external: true,
  },
  {
    title: 'The Attack Surface Isn\u2019t the LLM — It\u2019s the Controller Loop',
    description:
      'Why multi-step orchestration increases risk, and what to audit in plan → tools → retry loops.',
    href: 'https://www.andyagentlab.com/articles/agent-security/controller-loop-attack-surface/',
    category: 'Security',
    external: true,
  },
  {
    title: 'Request Assembly Threat Model',
    description:
      'Context hub, truncation/ordering, tool loops, observability, and R1–R8 audit checkpoints.',
    href: 'https://www.andyagentlab.com/articles/agent-security/request-assembly-threat-model/',
    category: 'Threat Model',
    external: true,
  },
  {
    title: 'Agentic Systems: 8 Trust-Boundary Audit Checkpoints',
    description:
      'Concrete checkpoints for auditing trust boundaries in tool-using, multi-step AI agent systems.',
    href: 'https://www.andyagentlab.com/articles/agent-security/trust-boundary-checkpoints/',
    category: 'Audit',
    external: true,
  },
  {
    title: 'Control-Plane Failure Patterns in Agentic Systems',
    description:
      'Session binding, memory reuse, routing/selection, tool enforcement, and observability failure patterns.',
    href: 'https://www.andyagentlab.com/articles/agent-security/control-plane-failures/',
    category: 'Patterns',
    external: true,
  },
];

const policyTemplates: PlaybookGuide[] = [
  {
    title: 'Facts-Only: Authoritative Sources Required',
    description:
      'Evidence boundary policy: world-claims require authoritative sources. No speculation, no hedging, no hallucination.',
    href: 'https://www.andyagentlab.com/policies/facts-only-authoritative-sources-required/',
    category: 'Evidence Boundary',
    external: true,
  },
  {
    title: 'Facts-Only: Artifacts-Only (No External Sources)',
    description:
      'Restrict evidence to user-provided artifacts only. No browsing, no training data claims. Maximum control.',
    href: 'https://www.andyagentlab.com/policies/facts-only-artifacts-only/',
    category: 'Evidence Boundary',
    external: true,
  },
  {
    title: 'Web Verification & Citations Policy',
    description:
      'Operating contract for public facts via web sources with mandatory inline citations.',
    href: 'https://www.andyagentlab.com/policies/web-verification-and-citations/',
    category: 'Citations',
    external: true,
  },
  {
    title: 'Engineering Quality Gate Policy',
    description:
      'Architecture + best-practices + regression-minded review gate as a normative operating contract.',
    href: 'https://www.andyagentlab.com/policies/engineering-quality-gate-policy/',
    category: 'Quality Gate',
    external: true,
  },
  {
    title: 'Semantic Accuracy Gate',
    description:
      'Prevent overclaims and enforce terminology consistency. Catch subtle misrepresentations before they ship.',
    href: 'https://www.andyagentlab.com/policies/semantic-accuracy-gate/',
    category: 'Accuracy',
    external: true,
  },
  {
    title: 'Confidence Score (0–100) — Reporting Rules',
    description:
      'Require a numeric confidence line on every response so users know how much to trust the output.',
    href: 'https://www.andyagentlab.com/policies/confidence-score/',
    category: 'Reporting',
    external: true,
  },
];

/* ---------- components ---------- */

function GuideCard({ guide }: { guide: PlaybookGuide }) {
  const isExternal = guide.external;
  const Tag = isExternal ? 'a' : Link;
  const extra = isExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  return (
    <Tag
      href={guide.href}
      {...extra}
      className="group block bg-white rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full">
          {guide.category}
        </span>
        {guide.badge && (
          <span className="inline-block px-3 py-1 text-xs font-bold text-accent-700 bg-accent-50 rounded-full">
            {guide.badge}
          </span>
        )}
        {isExternal && (
          <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-stone-500 bg-stone-100 rounded-full">
            External ↗
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-primary-600 transition-colors">
        {guide.title}
      </h3>
      <p className="text-stone-600 text-sm leading-relaxed">{guide.description}</p>
    </Tag>
  );
}

/* ---------- page ---------- */

export default function PlaybookPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="relative container mx-auto px-4 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-400 mb-4">
              Playbook
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              AI Agent Safety Playbook
            </h1>
            <p className="text-lg text-primary-200 leading-relaxed max-w-2xl mx-auto">
              Actionable guides, operating policies, and step-by-step testing procedures —
              all informed by <strong className="text-white">500+ documented AI failures</strong>.
              Stop reading about what goes wrong. Start implementing what works.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Path */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center">
            Quick Start Path
          </h2>
          <p className="text-stone-600 text-center mb-10 max-w-xl mx-auto">
            New here? Follow these four steps to go from zero to a tested, safe AI agent deployment.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="group relative bg-stone-50 rounded-lg border border-stone-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-stone-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-sm mb-4">{item.description}</p>
                <span className="text-primary-600 text-sm font-medium group-hover:text-primary-700">
                  {item.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention Guides (internal) */}
      <section id="guides" className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Prevention Guides</h2>
          <p className="text-stone-600 mb-8">
            In-depth guides from InspectAgents, built on lessons from real-world AI incidents.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preventionGuides.map((g) => (
              <GuideCard key={g.href} guide={g} />
            ))}
          </div>
        </div>
      </section>

      {/* Operating Policies */}
      <section className="py-16 bg-white border-t border-b border-stone-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                Operating Policies &amp; Templates
              </h2>
              <p className="text-stone-600 max-w-2xl">
                Reusable operating contracts that define evidence boundaries, verification rules, and fail-closed behavior
                for your AI agents. Curated from the{' '}
                <a
                  href="https://www.andyagentlab.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium underline decoration-primary-200 hover:decoration-primary-400"
                >
                  AI Agents Playbook
                </a>{' '}
                by Tamar Peretz.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policyTemplates.map((g) => (
              <GuideCard key={g.href} guide={g} />
            ))}
          </div>
        </div>
      </section>

      {/* Testing Procedures */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                Testing &amp; Verification Procedures
              </h2>
              <p className="text-stone-600 max-w-2xl">
                Step-by-step procedures for fact-checking, quality gates, and verification workflows.
                Copy-paste-ready prompt templates included.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalPlaybooks.map((g) => (
              <GuideCard key={g.href} guide={g} />
            ))}
          </div>
        </div>
      </section>

      {/* Agent Security Deep Dives */}
      <section className="py-16 bg-white border-t border-b border-stone-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                Agent Security Deep Dives
              </h2>
              <p className="text-stone-600 max-w-2xl">
                Technical articles on trust boundaries, attack surfaces, and control-plane failures in
                tool-using AI agent systems.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityArticles.map((g) => (
              <GuideCard key={g.href} guide={g} />
            ))}
          </div>
        </div>
      </section>

      {/* How it all fits together */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">
            How the Playbook Fits Together
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">📋</span>
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">Policies define the rules</h3>
                  <p className="text-stone-600 text-sm">
                    Operating contracts that set evidence boundaries, citation requirements, and fail-closed behavior.
                    Your AI agent&apos;s constitution.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">🔧</span>
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">Procedures implement the rules</h3>
                  <p className="text-stone-600 text-sm">
                    Step-by-step guides with copy-paste prompt templates. Follow the procedure, get a tested output.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">Checklists verify the results</h3>
                  <p className="text-stone-600 text-sm">
                    The 56-point checklist and verification gates ensure nothing slips through before deployment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">🔍</span>
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">Failures teach what to watch for</h3>
                  <p className="text-stone-600 text-sm">
                    500+ real incidents show exactly what goes wrong when these practices are skipped. Learn from others&apos; mistakes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-16 bg-stone-100 border-t border-stone-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center">
            Community Resources
          </h2>
          <p className="text-stone-600 text-center mb-10 max-w-xl mx-auto">
            Open-source playbooks and references from the AI safety community.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <a
              href="https://www.andyagentlab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-stone-900 mb-2 group-hover:text-primary-600 transition-colors">
                AI Agents Playbook ↗
              </h3>
              <p className="text-stone-600 text-sm mb-3">
                Public, versioned knowledge base for building reliable AI agents.
                Policies, prompt templates, how-to procedures, and security articles.
              </p>
              <p className="text-stone-500 text-xs">by Tamar Peretz • andyagentlab.com</p>
            </a>
            <a
              href="https://github.com/Tamarper63/ai-agents-playbook"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-stone-900 mb-2 group-hover:text-primary-600 transition-colors">
                ai-agents-playbook (GitHub) ↗
              </h3>
              <p className="text-stone-600 text-sm mb-3">
                Source repo for the AI Agents Playbook. Browse raw policy files,
                prompt templates (.system.txt / .user.txt), and contribute.
              </p>
              <p className="text-stone-500 text-xs">github.com/Tamarper63</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Ship a Safer AI Agent?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Start with the quiz to identify your biggest risks, then follow the playbook to fix them —
            all before your users find them first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
            >
              Take the AI Risk Quiz →
            </Link>
            <Link
              href="/checklist"
              className="inline-block bg-accent-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-400 transition-colors shadow-lg"
            >
              Get the 56-Point Checklist
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">InspectAgents</h3>
              <p className="text-sm">
                AI agent testing and safety platform preventing chatbot failures.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Playbook</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/playbook" className="hover:text-white">Playbook Home</Link></li>
                <li><Link href="/checklist" className="hover:text-white">Risk Checklist</Link></li>
                <li><Link href="/quiz" className="hover:text-white">Risk Quiz</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/failures" className="hover:text-white">AI Failures Database</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/glossary" className="hover:text-white">Glossary</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/docs" className="hover:text-white">API Docs</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} InspectAgents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
