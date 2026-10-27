'use client';

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { trackQuizEvent } from '@/lib/analytics';
import { useScrollTracking } from '@/hooks/useScrollTracking';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { Icon, type IconName } from '@/components/icons';
import {
  QUIZ_STORAGE_KEY,
  RISK_COPY,
  RISK_STYLES,
  recommendations,
  riskFactors,
  scoreAnswers,
  type StoredQuizAnswers,
} from '@/lib/quiz';

interface ConcernCase {
  company: string;
  year: string;
  title: string;
}

interface QuizClientProps {
  incidentCount: number;
  checklistCount: number;
  /** One documented incident per concern, keyed by concern value. */
  concernCases: Record<string, ConcernCase>;
}

interface Option {
  value: string;
  label: string;
  icon: IconName;
}

const USAGE_OPTIONS: Option[] = [
  { value: 'yes', label: 'Yes, live in production', icon: 'server' },
  { value: 'planning', label: 'Planning to deploy soon', icon: 'rocket' },
  { value: 'no', label: 'Just researching', icon: 'search' },
];

const CONCERN_OPTIONS: Option[] = [
  { value: 'hallucinations', label: 'Hallucinations and false information', icon: 'chat' },
  { value: 'security', label: 'Security breaches and data leaks', icon: 'lock' },
  { value: 'reputation', label: 'Damage to our reputation', icon: 'megaphone' },
  { value: 'cost', label: 'Unexpected costs', icon: 'coins' },
  { value: 'dontKnow', label: 'Not sure what to worry about', icon: 'question' },
];

const STEPS = ['Your setup', 'Your concerns', 'Your result'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function QuizClient({ incidentCount, checklistCount, concernCases }: QuizClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<StoredQuizAnswers>({});
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const startTime = useRef<number>(0);
  const hasTrackedStart = useRef(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useScrollTracking('quiz');
  useTimeTracking('quiz');

  useEffect(() => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    startTime.current = Date.now();
    const location = document.referrer.includes(window.location.hostname) ? 'homepage' : 'direct';
    trackQuizEvent.started(location);
  }, []);

  useEffect(() => () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
  }, []);

  // Move focus to the new question so keyboard and screen-reader users follow the step change.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const goTo = useCallback((next: number) => {
    setStep(next);
    setSelectedSingle(null);
  }, []);

  const handleUsage = (value: string) => {
    setSelectedSingle(value);
    setAnswers((prev) => ({ ...prev, currentlyUsing: value }));
    trackQuizEvent.stepCompleted(1, 'currentlyUsing', value);
    autoAdvanceTimer.current = setTimeout(() => goTo(1), 300);
  };

  const toggleConcern = (value: string) => {
    setAnswers((prev) => {
      const current = prev.biggestFears || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, biggestFears: next };
    });
  };

  const concernsChosen = (answers.biggestFears || []).length > 0;
  const emailValid = !!answers.email && EMAIL_RE.test(answers.email);

  const finish = (withEmail: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const final: StoredQuizAnswers = withEmail ? answers : { ...answers, email: undefined };
    trackQuizEvent.stepCompleted(3, 'email', withEmail ? 'provided' : 'skipped');
    trackQuizEvent.completed(final, Math.floor((Date.now() - startTime.current) / 1000));
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(final));
    } catch {
      // Storage blocked: the result page will send the visitor back to the quiz.
    }
    router.push('/quiz/thank-you/');
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (emailValid) finish(true);
  };

  const risk = scoreAnswers(answers);
  const copy = RISK_COPY[risk];
  const styles = RISK_STYLES[risk];
  // Goal gradient: the bar starts partly filled and each step visibly closes the gap.
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto py-4">
            <ol className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2" aria-label="Quiz progress">
              {STEPS.map((label, i) => (
                <li
                  key={label}
                  aria-current={i === step ? 'step' : undefined}
                  className={i === step ? 'text-primary-900' : i < step ? 'text-primary-600' : 'text-gray-500'}
                >
                  <span className="tabular-nums">{i + 1}.</span> {label}
                </li>
              ))}
            </ol>
            <div
              className="w-full bg-gray-200 rounded-full h-1.5"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={`Step ${step + 1} of ${STEPS.length}`}
            >
              <div
                className="bg-accent-500 h-1.5 rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-2xl mx-auto">
          <div
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-10"
            data-agent-tool="assess_risk"
            data-agent-description="AI risk assessment quiz"
          >
            {/* Step 1: setup */}
            {step === 0 && (
              <>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-3 text-balance">
                  Are you using AI agents in your business?
                </h1>
                <p className="text-gray-600 mb-8">Three steps, no account. Your result appears on screen right away.</p>
                <div className="space-y-3">
                  {USAGE_OPTIONS.map((o) => {
                    const chosen = selectedSingle === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => handleUsage(o.value)}
                        disabled={selectedSingle !== null}
                        aria-pressed={chosen}
                        className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
                          chosen
                            ? 'border-primary-900 bg-primary-50'
                            : selectedSingle !== null
                              ? 'border-gray-100 bg-gray-50 text-gray-400'
                              : 'border-gray-200 bg-white hover:border-primary-500 hover:bg-primary-50'
                        }`}
                      >
                        <span className="w-10 h-10 rounded bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                          <Icon name={o.icon} />
                        </span>
                        <span className="text-lg font-medium text-primary-900">{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 2: concerns */}
            {step === 1 && (
              <>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-3 text-balance focus:outline-none"
                >
                  What worries you most about AI agents?
                </h1>
                <p className="text-gray-600 mb-8">Select all that apply. The case under each one shows it has already happened.</p>
                <fieldset>
                  <legend className="sr-only">Concerns</legend>
                  <div className="space-y-3">
                    {CONCERN_OPTIONS.map((o) => {
                      const selected = (answers.biggestFears || []).includes(o.value);
                      const realCase = concernCases[o.value];
                      return (
                        <button
                          key={o.value}
                          type="button"
                          role="checkbox"
                          aria-checked={selected}
                          onClick={() => toggleConcern(o.value)}
                          className={`w-full flex items-start gap-4 text-left px-5 py-4 rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
                            selected
                              ? 'border-primary-900 bg-primary-50'
                              : 'border-gray-200 bg-white hover:border-primary-500 hover:bg-primary-50'
                          }`}
                        >
                          <span
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              selected ? 'bg-primary-900 border-primary-900 text-white' : 'border-gray-400 bg-white'
                            }`}
                          >
                            {selected && <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />}
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-lg font-medium text-primary-900">
                              <Icon name={o.icon} className="w-5 h-5 text-primary-600 flex-shrink-0" />
                              {o.label}
                            </span>
                            {realCase && o.value !== 'dontKnow' && (
                              <span className="block mt-1 text-sm text-gray-600">
                                Real case, {realCase.year}: {realCase.title}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => goTo(0)}
                    className="inline-flex items-center gap-1.5 px-5 py-3 border border-gray-300 rounded-full font-semibold text-primary-800 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                  >
                    <Icon name="arrowLeft" className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      trackQuizEvent.stepCompleted(2, 'biggestFears', answers.biggestFears || []);
                      goTo(2);
                    }}
                    disabled={!concernsChosen}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-base transition-colors bg-accent-500 text-primary-900 hover:bg-accent-400 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
                  >
                    {concernsChosen ? 'See my result' : 'Pick at least one'}
                    {concernsChosen && <Icon name="arrowRight" className="w-4 h-4" />}
                  </button>
                </div>
              </>
            )}

            {/* Step 3: result preview first, then the email ask (reciprocity) */}
            {step === 2 && (
              <>
                <p className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${styles.badge}`}>
                  <span className={`w-2 h-2 rounded-full ${styles.dot}`} aria-hidden="true" />
                  {copy.label}
                </p>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-3xl md:text-4xl font-bold text-primary-900 mt-4 mb-3 text-balance focus:outline-none"
                >
                  {copy.headline}
                </h1>
                <ul className="text-gray-600 mb-6 space-y-1">
                  {riskFactors(answers).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Icon name="check" className="w-4 h-4 mt-1 text-primary-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={`rounded-lg border p-5 mb-8 ${styles.panel}`}>
                  <h2 className="font-bold text-primary-900 mb-3">Your first three actions</h2>
                  <ol className="space-y-2">
                    {recommendations(answers, checklistCount).map((r, i) => (
                      <li key={r.title} className="flex gap-3 text-primary-900">
                        <span className="tabular-nums font-bold text-primary-600">{i + 1}.</span>
                        <span className="font-medium">{r.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <form onSubmit={handleEmailSubmit} noValidate>
                  <label htmlFor="quiz-email" className="block font-bold text-primary-900 mb-1">
                    Want the full report in your inbox?
                  </label>
                  <p id="quiz-email-hint" className="text-sm text-gray-600 mb-3">
                    We&apos;ll email this result with a 3-step action plan and the checklist link. No spam, unsubscribe anytime.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="quiz-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={answers.email || ''}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, email: e.target.value }))}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="you@company.com"
                      aria-describedby={emailTouched && !emailValid ? 'quiz-email-error' : 'quiz-email-hint'}
                      aria-invalid={emailTouched && !emailValid}
                      className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-full text-base text-primary-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-accent-500 text-primary-900 hover:bg-accent-400 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
                    >
                      {isSubmitting ? 'Opening your report…' : 'Email my report'}
                    </button>
                  </div>
                  {emailTouched && !emailValid && (
                    <p id="quiz-email-error" className="text-sm text-red-700 mt-2" role="alert">
                      Enter an email like name@company.com, or skip this step below.
                    </p>
                  )}
                </form>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline-none focus-visible:underline"
                  >
                    <Icon name="arrowLeft" className="w-4 h-4" />
                    Change answers
                  </button>
                  <button
                    type="button"
                    onClick={() => finish(false)}
                    disabled={isSubmitting}
                    className="text-sm font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900"
                  >
                    See the full result without email
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Built on {incidentCount} documented AI incidents, each with a public source.
          </p>
        </div>
      </main>
    </div>
  );
}
