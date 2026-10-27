'use client';

import { useCallback, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { trackEmailCapture, trackCTAClick } from '@/lib/analytics';
import { subscribeToNewsletter, extractTopPainPoints } from '@/lib/email';
import { Icon } from '@/components/icons';
import {
  QUIZ_STORAGE_KEY,
  REPORT_SENT_KEY,
  RISK_COPY,
  RISK_STYLES,
  recommendations,
  riskFactors,
  scoreAnswers,
  type RiskLevel,
  type StoredQuizAnswers,
} from '@/lib/quiz';
import type { IncidentSummary } from '@/lib/site-stats';

interface ThankYouClientProps {
  incidentCount: number;
  checklistCount: number;
  concernIncidents: Record<string, IncidentSummary>;
}

type SendState = 'idle' | 'sending' | 'sent' | 'error';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ThankYouClient({ incidentCount, checklistCount, concernIncidents }: ThankYouClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<StoredQuizAnswers | null>(null);
  const [sendState, setSendState] = useState<SendState>('idle');
  const [sendError, setSendError] = useState<string | null>(null);
  const [emailDraft, setEmailDraft] = useState('');
  const [draftTouched, setDraftTouched] = useState(false);

  useTimeTracking('thank-you');

  const sendReport = useCallback(async (a: StoredQuizAnswers, email: string, risk: RiskLevel) => {
    setSendState('sending');
    setSendError(null);
    const quizAnswers = {
      currentUsage: a.currentlyUsing || 'no',
      biggestFears: a.biggestFears || [],
      email,
    };
    try {
      const result = await subscribeToNewsletter({
        email,
        firstName: '',
        source: 'quiz',
        quizAnswers,
        riskLevel: risk,
        topPainPoints: extractTopPainPoints(quizAnswers),
      });
      if (result.success) {
        setSendState('sent');
        trackEmailCapture.submitted('quiz');
        try {
          localStorage.setItem(REPORT_SENT_KEY, email);
        } catch {
          // Without storage a revisit may re-send; harmless.
        }
      } else {
        setSendState('error');
        setSendError(result.error || 'We could not send the report.');
      }
    } catch {
      setSendState('error');
      setSendError('Network error. Check your connection.');
    }
  }, []);

  useEffect(() => {
    let parsed: StoredQuizAnswers | null = null;
    try {
      const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      parsed = raw ? (JSON.parse(raw) as StoredQuizAnswers) : null;
    } catch {
      parsed = null;
    }
    if (!parsed) {
      router.replace('/quiz/');
      return;
    }
    setAnswers(parsed);
    if (parsed.email) {
      setEmailDraft(parsed.email);
      let alreadySent = false;
      try {
        alreadySent = localStorage.getItem(REPORT_SENT_KEY) === parsed.email;
      } catch {
        alreadySent = false;
      }
      if (alreadySent) setSendState('sent');
      else void sendReport(parsed, parsed.email, scoreAnswers(parsed));
    }
  }, [router, sendReport]);

  if (!answers) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center" role="status">
        <p className="text-gray-600">Loading your result…</p>
      </div>
    );
  }

  const risk = scoreAnswers(answers);
  const copy = RISK_COPY[risk];
  const styles = RISK_STYLES[risk];
  const recs = recommendations(answers, checklistCount);
  const cases = (answers.biggestFears || [])
    .map((f) => concernIncidents[f])
    .filter((c): c is IncidentSummary => Boolean(c))
    .slice(0, 3);
  const caseList = cases.length > 0 ? cases : [concernIncidents.dontKnow].filter(Boolean);

  const draftValid = EMAIL_RE.test(emailDraft);
  const handleDraftSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDraftTouched(true);
    if (!draftValid) return;
    const updated = { ...answers, email: emailDraft };
    setAnswers(updated);
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    void sendReport(updated, emailDraft, risk);
  };

  const showEmailAsk = sendState !== 'sent';

  return (
    <div className="bg-gray-50 pb-16">
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result */}
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-10" aria-labelledby="result-heading">
            <p className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${styles.badge}`}>
              <span className={`w-2 h-2 rounded-full ${styles.dot}`} aria-hidden="true" />
              {copy.label}
            </p>
            <h1 id="result-heading" className="font-display text-3xl md:text-5xl font-bold text-primary-900 mt-4 mb-4 leading-tight text-balance">
              {copy.headline}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mb-6">{copy.body}</p>
            <h2 className="text-sm font-bold text-primary-900 mb-2">Why this result</h2>
            <ul className="text-gray-700 space-y-1">
              {riskFactors(answers).map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Icon name="check" className="w-4 h-4 mt-1 text-primary-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div aria-live="polite" className="mt-6 text-sm">
              {sendState === 'sending' && (
                <p className="text-gray-600">Sending the full report to <strong className="text-primary-900">{answers.email}</strong>…</p>
              )}
              {sendState === 'sent' && (
                <p className="inline-flex items-center gap-2 text-emerald-800">
                  <Icon name="mail" className="w-4 h-4" />
                  Full report sent to <strong>{answers.email}</strong>
                </p>
              )}
              {sendState === 'error' && (
                <p className="text-red-700">
                  {sendError} Your result is saved on this page.{' '}
                  {answers.email && (
                    <button
                      type="button"
                      onClick={() => void sendReport(answers, answers.email as string, risk)}
                      className="font-semibold underline underline-offset-4"
                    >
                      Try again
                    </button>
                  )}
                </p>
              )}
            </div>
          </section>

          {/* Actions */}
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-10" aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="font-display text-2xl md:text-3xl font-bold text-primary-900 mb-6">
              Your first three actions
            </h2>
            <ol className="space-y-6">
              {recs.map((r, i) => (
                <li key={r.title} className="flex gap-4">
                  <span className="w-8 h-8 rounded bg-primary-100 text-primary-800 font-bold flex items-center justify-center flex-shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-primary-900 mb-1">{r.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{r.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Evidence: real incidents matched to the visitor's concerns */}
          <section aria-labelledby="cases-heading">
            <h2 id="cases-heading" className="font-display text-2xl md:text-3xl font-bold text-primary-900 mb-2 mt-4">
              What this looks like in practice
            </h2>
            <p className="text-gray-600 mb-6">
              Documented cases that match what you told us, from our database of {incidentCount} incidents.
            </p>
            <div className="space-y-4">
              {caseList.map((c) => (
                <article key={c.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    <span className="tabular-nums">{c.year}</span> · {c.category} · {c.severity}
                  </p>
                  <h3 className="font-display text-lg font-bold text-primary-900 mb-2 text-balance">{c.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.description}</p>
                  {c.cost && (
                    <p className="text-sm text-primary-900 mb-3">
                      <strong>Cost:</strong> {c.cost}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <Link href={`/failures/${c.id}/`} className="link-arrow text-primary-700 hover:text-primary-900">
                      Read the case and prevention steps
                    </Link>
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-primary-900"
                    >
                      Source: {c.source}
                      <Icon name="external" className="w-3.5 h-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* End state: one primary action */}
          <section className="bg-primary-900 text-white rounded-lg p-6 sm:p-10 mt-4" aria-labelledby="next-heading">
            {showEmailAsk ? (
              <>
                <h2 id="next-heading" className="font-display text-2xl md:text-3xl font-bold mb-2 text-balance">
                  Keep this result
                </h2>
                <p className="text-primary-200 mb-6 max-w-xl">
                  Get this result, a 3-step action plan and the checklist link by email, so you can share it with your team. Unsubscribe anytime.
                </p>
                <form onSubmit={handleDraftSubmit} noValidate className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <label htmlFor="result-email" className="sr-only">Work email</label>
                  <input
                    id="result-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    placeholder="you@company.com"
                    aria-invalid={draftTouched && !draftValid}
                    aria-describedby={draftTouched && !draftValid ? 'result-email-error' : undefined}
                    className="flex-1 min-w-0 px-4 py-3 rounded-full text-base text-primary-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                  <button
                    type="submit"
                    disabled={sendState === 'sending'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-accent-500 text-primary-900 hover:bg-accent-400 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                  >
                    {sendState === 'sending' ? 'Sending…' : 'Email my report'}
                  </button>
                </form>
                {draftTouched && !draftValid && (
                  <p id="result-email-error" className="text-sm text-accent-200 mt-2" role="alert">
                    Enter an email like name@company.com.
                  </p>
                )}
                <p className="mt-6 text-sm">
                  <Link href="/checklist/" className="link-arrow text-primary-100 hover:text-white">
                    Or go straight to the {checklistCount}-point checklist
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2 id="next-heading" className="font-display text-2xl md:text-3xl font-bold mb-2 text-balance">
                  Next: run the checklist before launch
                </h2>
                <p className="text-primary-200 mb-6 max-w-xl">
                  {checklistCount} checks with a severity on each, printable for your team. Free, no account.
                </p>
                <Link
                  href="/checklist/"
                  onClick={() => trackCTAClick('Open the checklist', 'quiz-result', '/checklist/')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-accent-500 text-primary-900 hover:bg-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                >
                  Open the {checklistCount}-point checklist
                  <Icon name="arrowRight" className="w-4 h-4" />
                </Link>
                <p className="mt-6 text-sm text-primary-200">
                  Would you rather have these tests run for you?{' '}
                  <Link
                    href="/demo/"
                    onClick={() => trackCTAClick('Join sandbox waitlist', 'quiz-result', '/demo/')}
                    className="font-semibold text-white underline underline-offset-4 hover:text-accent-300"
                  >
                    Join the testing sandbox waitlist
                  </Link>
                </p>
              </>
            )}
          </section>

          <p className="text-center text-sm">
            <Link href="/quiz/" className="text-primary-700 hover:text-primary-900 underline underline-offset-4">
              Retake the quiz
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
