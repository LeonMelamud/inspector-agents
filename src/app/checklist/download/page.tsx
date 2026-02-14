'use client';

import {
  CHECKLIST_SECTIONS,
  type Severity,
  type CheckItem,
} from '@/lib/mcp/data/checklist';

// ---------------------------------------------------------------------------
// UI-specific section styling (not in shared data module)
// ---------------------------------------------------------------------------

interface CheckSectionUI {
  title: string;
  count: number;
  subtitle: string;
  gradient: string;
  printBg: string;
  borderColor: string;
  subtitleColor: string;
  items: CheckItem[];
}

const SECTION_STYLES: Record<string, { gradient: string; printBg: string; borderColor: string; subtitleColor: string }> = {
  '1. Hallucination Detection': { gradient: 'from-red-600 to-red-700', printBg: 'print:bg-red-700', borderColor: 'border-red-600', subtitleColor: 'text-red-100' },
  '2. Prompt Injection Prevention': { gradient: 'from-orange-600 to-orange-700', printBg: 'print:bg-orange-700', borderColor: 'border-orange-600', subtitleColor: 'text-orange-100' },
  '3. Security & Privacy Checks': { gradient: 'from-purple-600 to-purple-700', printBg: 'print:bg-purple-700', borderColor: 'border-purple-600', subtitleColor: 'text-purple-100' },
  '4. Jailbreak Resistance': { gradient: 'from-rose-600 to-rose-700', printBg: 'print:bg-rose-700', borderColor: 'border-rose-600', subtitleColor: 'text-rose-100' },
  '5. Output Validation': { gradient: 'from-blue-600 to-blue-700', printBg: 'print:bg-blue-700', borderColor: 'border-blue-600', subtitleColor: 'text-blue-100' },
  '6. Bias & Fairness Audits': { gradient: 'from-indigo-600 to-indigo-700', printBg: 'print:bg-indigo-700', borderColor: 'border-indigo-600', subtitleColor: 'text-indigo-100' },
  '7. Content Moderation': { gradient: 'from-amber-600 to-amber-700', printBg: 'print:bg-amber-700', borderColor: 'border-amber-600', subtitleColor: 'text-amber-100' },
  '8. Production Monitoring': { gradient: 'from-primary-800 to-primary-900', printBg: 'print:bg-primary-700', borderColor: 'border-primary-600', subtitleColor: 'text-primary-200' },
  '9. Agentic & Tool-Use Safety': { gradient: 'from-cyan-600 to-cyan-700', printBg: 'print:bg-cyan-700', borderColor: 'border-cyan-600', subtitleColor: 'text-cyan-100' },
};

const SECTIONS: CheckSectionUI[] = CHECKLIST_SECTIONS.map((section) => ({
  ...section,
  ...(SECTION_STYLES[section.title] ?? {
    gradient: 'from-stone-600 to-stone-700',
    printBg: 'print:bg-stone-700',
    borderColor: 'border-stone-600',
    subtitleColor: 'text-stone-100',
  }),
}));

// ---------------------------------------------------------------------------
// Severity badge config
// ---------------------------------------------------------------------------

const SEVERITY_CFG: Record<Severity, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-100 text-red-800' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-800' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
};

// ---------------------------------------------------------------------------
// Small components
// ---------------------------------------------------------------------------

function SeverityBadge({ severity }: { severity: Severity }) {
  const cfg = SEVERITY_CFG[severity];
  return (
    <span
      className={`ml-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function ChecklistItem({ item }: { item: CheckItem }) {
  return (
    <label className="flex items-start p-3 hover:bg-stone-50 rounded cursor-pointer">
      <input
        type="checkbox"
        className="mt-1 mr-3 w-5 h-5 print:appearance-none print:border print:border-stone-400 print:w-4 print:h-4"
      />
      <div>
        <p className="font-semibold text-stone-900">
          {item.name}
          <SeverityBadge severity={item.severity} />
        </p>
        <p className="text-sm text-stone-600">{item.description}</p>
      </div>
    </label>
  );
}

function SectionBlock({ section }: { section: CheckSectionUI }) {
  return (
    <section className="mb-12 print:mb-8 print:break-inside-avoid">
      <div
        className={`bg-gradient-to-r ${section.gradient} text-white p-4 rounded-t-lg ${section.printBg}`}
      >
        <h2 className="text-2xl font-bold">
          {section.title} ({section.count} tests)
        </h2>
        <p className={`${section.subtitleColor} text-sm`}>
          {section.subtitle}
        </p>
      </div>
      <div
        className={`border-2 ${section.borderColor} rounded-b-lg p-6 print:border print:border-stone-300`}
      >
        <div className="space-y-4">
          {section.items.map((item) => (
            <ChecklistItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChecklistDownloadPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Print-only Header */}
      <div className="print:block hidden text-center py-8 border-b border-stone-300">
        <h1 className="text-3xl font-bold text-stone-900">
          InspectAgents.com
        </h1>
        <p className="text-stone-600">AI Agent Risk Checklist</p>
      </div>

      {/* Screen-only controls */}
      <div className="print:hidden bg-primary-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="font-bold">AI Agent Risk Checklist</p>
            <p className="text-sm text-primary-100">
              Ready to print or save as PDF
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="bg-accent-500 hover:bg-accent-600 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Print / Save as PDF
            </button>
            <a
              href="/checklist"
              className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              &larr; Back
            </a>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl" data-agent-tool="get_checklist" data-agent-description="56-point AI Agent Risk Checklist">
        {/* Title */}
        <div className="text-center mb-12 print:mb-8">
          <h1 className="text-5xl print:text-4xl font-bold text-stone-900 mb-4">
            AI Agent Risk Checklist
          </h1>
          <p className="text-xl text-stone-600 mb-2">
            56-Point Pre-Deployment Testing Guide
          </p>
          <p className="text-stone-500 text-sm">
            From InspectAgents.com &bull; Free for personal and commercial use
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-12 print:mb-8 print:border print:border-stone-300">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">
            How to Use This Checklist
          </h2>
          <ul className="space-y-2 text-stone-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">&#10003;</span>
              <span>
                <strong>Before deployment:</strong> Complete all 56 checkpoints.
                Flag any failures for immediate attention.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">&#10003;</span>
              <span>
                <strong>After changes:</strong> Re-run when updating models,
                prompts, or data sources.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">&#10003;</span>
              <span>
                <strong>Ongoing:</strong> Schedule monthly audits to catch model
                drift, new attack vectors, and tool/plugin supply chain risks.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">&#10003;</span>
              <span>
                <strong>Prioritize:</strong> Focus on risks most relevant to
                your use case and industry.
              </span>
            </li>
          </ul>

          {/* Severity legend */}
          <div className="mt-4 pt-4 border-t border-primary-200">
            <p className="text-sm font-semibold text-stone-700 mb-2">
              Severity levels:
            </p>
            <div className="flex gap-2 flex-wrap items-center text-sm">
              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-semibold uppercase tracking-wide">
                Critical
              </span>
              <span className="text-stone-600 mr-3">Deploy blocker</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-semibold uppercase tracking-wide">
                High
              </span>
              <span className="text-stone-600 mr-3">
                Fix before production
              </span>
              <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[10px] font-semibold uppercase tracking-wide">
                Medium
              </span>
              <span className="text-stone-600">Recommended practice</span>
            </div>
          </div>

          {/* OWASP reference */}
          <p className="mt-3 text-xs text-stone-500">
            Aligned with the{' '}
            <a
              href="https://owasp.org/www-project-top-10-for-large-language-model-applications/"
              className="underline text-primary-700 hover:text-primary-900 print:text-stone-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Top 10 for LLM Applications
            </a>{' '}
            and the{' '}
            <a
              href="https://genai.owasp.org"
              className="underline text-primary-700 hover:text-primary-900 print:text-stone-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Top 10 for Agentic AI
            </a>{' '}
            frameworks.
          </p>
        </div>

        {/* All checklist sections */}
        {SECTIONS.map((section) => (
          <SectionBlock key={section.title} section={section} />
        ))}

        {/* Summary & Next Steps */}
        <section className="mb-12 print:mb-8 border-t-4 border-primary-600 pt-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-6 text-center">
            After Completing This Checklist
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 print:border print:border-stone-300">
              <h3 className="font-bold text-lg text-primary-900 mb-3">
                &#9989; If You Passed All Checkpoints
              </h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li>
                  &bull; Document your test results and keep for compliance
                </li>
                <li>
                  &bull; Set calendar reminders for monthly re-audits
                </li>
                <li>&bull; Implement continuous monitoring</li>
                <li>&bull; Proceed with deployment confidently</li>
              </ul>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 print:border print:border-stone-300">
              <h3 className="font-bold text-lg text-red-900 mb-3">
                &#10060; If You Found Failures
              </h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li>&bull; Prioritize by severity and likelihood</li>
                <li>
                  &bull; Fix critical security/safety issues immediately
                </li>
                <li>&bull; Do NOT deploy until critical items pass</li>
                <li>&bull; Re-run full checklist after fixes</li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 text-center print:border print:border-stone-300">
            <h3 className="font-bold text-xl text-stone-900 mb-3">
              Need Help?
            </h3>
            <p className="text-stone-700 mb-4">
              Visit <strong>InspectAgents.com</strong> for:
            </p>
            <ul className="text-sm text-stone-600 space-y-1 mb-4">
              <li>&#10003; 500+ real AI failure case studies</li>
              <li>&#10003; Detailed testing guides and tutorials</li>
              <li>&#10003; AI safety glossary and resources</li>
              <li>&#10003; Free risk assessment quiz</li>
            </ul>
            <p className="text-xs text-stone-500">
              This checklist is free for personal and commercial use. Share it
              with your team!
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-stone-500 text-sm pt-8 border-t border-stone-300 print:text-xs">
          <p className="mb-2">
            <strong>AI Agent Risk Checklist</strong> by InspectAgents.com
          </p>
          <p>
            Free to use &bull; Updated February 2026 &bull; Visit
            InspectAgents.com for latest version
          </p>
          <p className="mt-4 text-xs">
            &copy; 2026 InspectAgents. Preventing AI failures, one agent at a
            time.
          </p>
        </footer>
      </main>
    </div>
  );
}
