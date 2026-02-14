'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trackQuizEvent } from '@/lib/analytics';
import { useScrollTracking } from '@/hooks/useScrollTracking';
import { useTimeTracking } from '@/hooks/useTimeTracking';

interface QuizAnswers {
  currentlyUsing?: string;
  biggestFears?: string[];
  email?: string;
}

const SOCIAL_PROOF_DATA = {
  currentlyUsing: {
    yes: '47%',
    planning: '38%',
    no: '15%',
  },
  biggestFears: {
    hallucinations: '68%',
    security: '59%',
    reputation: '72%',
    cost: '41%',
    dontKnow: '23%',
  },
};

interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'single' | 'multiple' | 'email';
  options?: { value: string; label: string; social?: string }[];
  placeholder?: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null);
  const startTime = useRef<number>(Date.now());
  const hasTrackedStart = useRef<boolean>(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useScrollTracking('quiz');
  useTimeTracking('quiz');

  const questions: QuizQuestion[] = [
    {
      id: 'currentlyUsing',
      title: 'Are you using AI agents in your business?',
      subtitle: 'Takes 30 seconds — 1,247 teams already assessed their risk',
      type: 'single',
      options: [
        { value: 'yes', label: '✅ Yes, live in production', social: SOCIAL_PROOF_DATA.currentlyUsing.yes },
        { value: 'planning', label: '🚀 Planning to deploy soon', social: SOCIAL_PROOF_DATA.currentlyUsing.planning },
        { value: 'no', label: '🔍 Just researching', social: SOCIAL_PROOF_DATA.currentlyUsing.no },
      ],
    },
    {
      id: 'biggestFears',
      title: "What worries you most about AI agents?",
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'hallucinations', label: '🤥 Hallucinations & false info', social: SOCIAL_PROOF_DATA.biggestFears.hallucinations },
        { value: 'security', label: '🔓 Security breaches & data leaks', social: SOCIAL_PROOF_DATA.biggestFears.security },
        { value: 'reputation', label: '💔 Reputation damage', social: SOCIAL_PROOF_DATA.biggestFears.reputation },
        { value: 'cost', label: '💸 Unexpected costs', social: SOCIAL_PROOF_DATA.biggestFears.cost },
        { value: 'dontKnow', label: '❓ Not sure what to worry about', social: SOCIAL_PROOF_DATA.biggestFears.dontKnow },
      ],
    },
    {
      id: 'email',
      title: 'Get your free AI risk report',
      subtitle: 'Personalized assessment + actionable next steps — delivered instantly',
      type: 'email',
      placeholder: 'your@email.com',
    },
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Track quiz start on mount
  useEffect(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      const referrer = document.referrer;
      const location = referrer.includes(window.location.hostname) ? 'homepage' : 'direct';
      trackQuizEvent.started(location);
    }
  }, []);

  // Cleanup auto-advance timer
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  const advanceToNext = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedSingle(null);
    } else {
      handleSubmit();
    }
  }, [currentStep, questions.length]);

  const handleSingleSelect = (questionId: string, value: string) => {
    setSelectedSingle(value);
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    // Track step completion
    trackQuizEvent.stepCompleted(currentStep + 1, questionId, value);

    // Auto-advance after brief visual feedback
    autoAdvanceTimer.current = setTimeout(() => {
      advanceToNext();
    }, 350);
  };

  const handleMultiSelect = (questionId: string, value: string) => {
    const current = (answers[questionId as keyof QuizAnswers] as string[] || []);
    const newAnswers = current.includes(value)
      ? current.filter(a => a !== value)
      : [...current, value];
    setAnswers(prev => ({ ...prev, [questionId]: newAnswers }));
  };

  const handleEmailChange = (value: string) => {
    setAnswers(prev => ({ ...prev, email: value }));
  };

  const handleNext = () => {
    const answer = answers[currentQuestion.id as keyof QuizAnswers];
    trackQuizEvent.stepCompleted(currentStep + 1, currentQuestion.id, answer as string | string[]);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedSingle(null);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedSingle(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    trackQuizEvent.completed(answers, timeSpent);
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/quiz/thank-you');
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id as keyof QuizAnswers];

    if (currentQuestion.type === 'email') {
      return answer && typeof answer === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer);
    }

    if (currentQuestion.type === 'multiple') {
      return answer && Array.isArray(answer) && answer.length > 0;
    }

    return !!answer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-stone-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            InspectAgents
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-stone-600">
                Step {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12" data-agent-tool="assess_risk" data-agent-description="AI risk assessment quiz">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              {currentQuestion.title}
            </h1>
            <p className="text-stone-600 mb-8">{currentQuestion.subtitle}</p>

            {/* Single Choice — auto-advances on click */}
            {currentQuestion.type === 'single' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSingleSelect(currentQuestion.id, option.value)}
                    disabled={selectedSingle !== null}
                    className={`w-full text-left p-5 rounded-lg border-2 transition-all ${
                      selectedSingle === option.value
                        ? 'border-primary-600 bg-primary-50 scale-[1.02]'
                        : selectedSingle !== null
                          ? 'border-stone-100 bg-stone-50 opacity-60'
                          : 'border-stone-200 bg-white hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-stone-900">{option.label}</span>
                      {option.social && (
                        <span className="text-sm text-primary-600 font-semibold bg-primary-100 px-3 py-1 rounded-full">
                          {option.social}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Multiple Choice */}
            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const selected = ((answers[currentQuestion.id as keyof QuizAnswers] as string[]) || []).includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMultiSelect(currentQuestion.id, option.value)}
                      className={`w-full text-left p-5 rounded-lg border-2 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                        selected
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <div
                            className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 flex items-center justify-center transition-colors ${
                              selected ? 'bg-primary-600 border-primary-600' : 'border-stone-300'
                            }`}
                          >
                            {selected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-lg font-medium text-stone-900">{option.label}</span>
                        </div>
                        {option.social && (
                          <span className="text-sm text-primary-600 font-semibold bg-primary-100 px-3 py-1 rounded-full ml-3">
                            {option.social}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Email Input */}
            {currentQuestion.type === 'email' && (
              <div>
                <input
                  type="email"
                  value={answers.email || ''}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && canProceed()) handleSubmit(); }}
                  placeholder={currentQuestion.placeholder}
                  autoFocus
                  className="w-full p-4 border-2 border-stone-200 rounded-lg focus:border-primary-600 focus:outline-none text-lg mb-4"
                />
                <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded">
                  <p className="text-sm text-stone-700">
                    <strong className="text-primary-700">🔒 Privacy First:</strong> We&apos;ll only email your risk report. No spam, unsubscribe anytime.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation — only visible for multi-select and email steps */}
            {currentQuestion.type !== 'single' && (
              <div className="flex gap-4 mt-8">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 border-2 border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    ←
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className={`flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                    canProceed() && !isSubmitting
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting
                    ? 'Analyzing...'
                    : currentStep === questions.length - 1
                      ? 'Get My Free Report →'
                      : 'Continue →'}
                </button>
              </div>
            )}

            {/* Back button only for single-select (since Next is auto) */}
            {currentQuestion.type === 'single' && currentStep > 0 && !selectedSingle && (
              <div className="mt-8">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>

          {/* Social Proof */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">1,247</div>
                <p className="text-sm text-stone-600">Assessments</p>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div>
                <div className="text-2xl font-bold text-primary-600">4.9/5</div>
                <p className="text-sm text-stone-600">Rating</p>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div>
                <div className="text-2xl font-bold text-primary-600">30 sec</div>
                <p className="text-sm text-stone-600">Average Time</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
