'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trackQuizEvent } from '@/lib/analytics';
import { useScrollTracking } from '@/hooks/useScrollTracking';
import { useTimeTracking } from '@/hooks/useTimeTracking';

interface QuizAnswers {
  currentlyUsing?: string;
  biggestFears?: string[];
  experiencedFailure?: string;
  failureDescription?: string;
  confidenceFactors?: string;
  costingYou?: string[];
  role?: string;
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
  experiencedFailure: {
    yes: '34%',
    no: '52%',
    notSure: '14%',
  },
  costingYou: {
    time: '81%',
    money: '56%',
    reputation: '43%',
    all: '38%',
  },
};

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTime = useRef<number>(Date.now());
  const hasTrackedStart = useRef<boolean>(false);

  // Track scroll depth and time on page
  useScrollTracking('quiz');
  useTimeTracking('quiz');

  const questions = [
    {
      id: 'currentlyUsing',
      title: 'Are you currently using AI agents/chatbots in your business?',
      subtitle: 'Help us understand your current situation',
      type: 'single' as const,
      options: [
        { value: 'yes', label: '✅ Yes, we have AI agents live in production', social: SOCIAL_PROOF_DATA.currentlyUsing.yes },
        { value: 'planning', label: '🚀 Planning to deploy soon', social: SOCIAL_PROOF_DATA.currentlyUsing.planning },
        { value: 'no', label: '❌ No, just researching', social: SOCIAL_PROOF_DATA.currentlyUsing.no },
      ],
    },
    {
      id: 'biggestFears',
      title: "What's your biggest fear about AI agents?",
      subtitle: 'Select all that apply — you\'re not alone in these concerns',
      type: 'multiple' as const,
      options: [
        { value: 'hallucinations', label: '🤥 Hallucinations & making up facts', social: SOCIAL_PROOF_DATA.biggestFears.hallucinations },
        { value: 'security', label: '🔓 Security breaches & data leaks', social: SOCIAL_PROOF_DATA.biggestFears.security },
        { value: 'reputation', label: '💔 Reputation damage from viral mistakes', social: SOCIAL_PROOF_DATA.biggestFears.reputation },
        { value: 'cost', label: '💸 Unexpected costs & token usage', social: SOCIAL_PROOF_DATA.biggestFears.cost },
        { value: 'dontKnow', label: '❓ Don\'t know what to worry about', social: SOCIAL_PROOF_DATA.biggestFears.dontKnow },
      ],
    },
    {
      id: 'experiencedFailure',
      title: 'Have you experienced an AI failure or close call?',
      subtitle: '34% of respondents have already had an incident',
      type: 'single' as const,
      options: [
        { value: 'yes', label: '😬 Yes (please describe below)', social: SOCIAL_PROOF_DATA.experiencedFailure.yes },
        { value: 'no', label: '✅ No, not yet', social: SOCIAL_PROOF_DATA.experiencedFailure.no },
        { value: 'notSure', label: '🤔 Not sure / might have', social: SOCIAL_PROOF_DATA.experiencedFailure.notSure },
      ],
    },
    {
      id: 'confidenceFactors',
      title: 'What would make you feel confident deploying AI?',
      subtitle: 'Your answer helps us understand what you need most',
      type: 'text' as const,
      placeholder: 'e.g., Automated testing, real-world examples, checklists, monitoring tools...',
    },
    {
      id: 'costingYou',
      title: 'How much is AI agent risk costing you RIGHT NOW?',
      subtitle: '81% say they\'re losing time to worry and testing',
      type: 'multiple' as const,
      options: [
        { value: 'time', label: '⏰ Time (endless worrying, manual testing)', social: SOCIAL_PROOF_DATA.costingYou.time },
        { value: 'money', label: '💰 Money (delayed launches, expensive fixes)', social: SOCIAL_PROOF_DATA.costingYou.money },
        { value: 'reputation', label: '💔 Reputation (trust issues, customer complaints)', social: SOCIAL_PROOF_DATA.costingYou.reputation },
        { value: 'all', label: '🔥 All of the above', social: SOCIAL_PROOF_DATA.costingYou.all },
      ],
    },
    {
      id: 'role',
      title: "What's your role?",
      subtitle: 'So we can personalize your results',
      type: 'single' as const,
      options: [
        { value: 'founder', label: '👔 Founder / CEO' },
        { value: 'cto', label: '⚙️ CTO / Technical Lead' },
        { value: 'developer', label: '💻 Developer / Engineer' },
        { value: 'manager', label: '📊 Product / Project Manager' },
        { value: 'other', label: '🎯 Other' },
      ],
    },
    {
      id: 'email',
      title: 'Get your personalized AI risk report',
      subtitle: 'We\'ll email you a custom assessment based on your answers + actionable next steps',
      type: 'email' as const,
      placeholder: 'your@email.com',
    },
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Track quiz start on mount
  useEffect(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      // Check if came from homepage or direct
      const referrer = document.referrer;
      const location = referrer.includes(window.location.hostname) ? 'homepage' : 'direct';
      trackQuizEvent.started(location);
    }
  }, []);

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    // Track step completion
    const answer = answers[currentQuestion.id as keyof QuizAnswers];
    trackQuizEvent.stepCompleted(currentStep + 1, currentQuestion.id, answer as string | string[]);

    // If on "experiencedFailure" question and answered "yes", stay for description
    if (currentQuestion.id === 'experiencedFailure' && answers.experiencedFailure === 'yes' && !answers.failureDescription) {
      return; // Don't advance until they provide description
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate total time spent
    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    
    // Track quiz completion
    trackQuizEvent.completed(answers, timeSpent);
    
    // Store quiz results in localStorage for the thank you page
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    
    // In production, you'd send this to your backend/email service
    // For now, we'll just log it and redirect
    console.log('Quiz answers:', answers);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    router.push('/quiz/thank-you');
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id as keyof QuizAnswers];
    
    if (currentQuestion.type === 'email') {
      return answer && typeof answer === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer);
    }
    
    if (currentQuestion.type === 'text') {
      return answer && typeof answer === 'string' && answer.trim().length > 0;
    }
    
    if (currentQuestion.type === 'multiple') {
      return answer && Array.isArray(answer) && answer.length > 0;
    }
    
    if (currentQuestion.id === 'experiencedFailure' && answers.experiencedFailure === 'yes') {
      return answer && answers.failureDescription && answers.failureDescription.trim().length > 0;
    }
    
    return !!answer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-stone-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-primary-600">
            InspectAgents
          </a>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-stone-600">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-primary-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
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
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              {currentQuestion.title}
            </h1>
            <p className="text-stone-600 mb-8">{currentQuestion.subtitle}</p>

            {/* Single Choice Options */}
            {currentQuestion.type === 'single' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full text-left p-5 rounded-lg border-2 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                      answers[currentQuestion.id as keyof QuizAnswers] === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-stone-900">{option.label}</span>
                      {'social' in option && option.social && (
                        <span className="text-sm text-primary-600 font-semibold bg-primary-100 px-3 py-1 rounded-full">
                          {option.social} chose this
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const selected = (answers[currentQuestion.id as keyof QuizAnswers] as string[] || []).includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        const currentAnswers = (answers[currentQuestion.id as keyof QuizAnswers] as string[] || []);
                        const newAnswers = selected
                          ? currentAnswers.filter((a) => a !== option.value)
                          : [...currentAnswers, option.value];
                        handleAnswer(currentQuestion.id, newAnswers);
                      }}
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
                        {'social' in option && option.social && (
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

            {/* Text Input */}
            {currentQuestion.type === 'text' && (
              <textarea
                value={(answers[currentQuestion.id as keyof QuizAnswers] as string) || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={4}
                className="w-full p-4 border-2 border-stone-200 rounded-lg focus:border-primary-600 focus:outline-none text-lg"
              />
            )}

            {/* Email Input */}
            {currentQuestion.type === 'email' && (
              <div>
                <input
                  type="email"
                  value={(answers[currentQuestion.id as keyof QuizAnswers] as string) || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 border-2 border-stone-200 rounded-lg focus:border-primary-600 focus:outline-none text-lg mb-4"
                />
                <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded">
                  <p className="text-sm text-stone-700">
                    <strong className="text-primary-700">🔒 Privacy First:</strong> We'll only use your email to send your personalized risk report. No spam, no sharing with third parties. You can unsubscribe anytime.
                  </p>
                </div>
              </div>
            )}

            {/* Additional Text Input for Failure Description */}
            {currentQuestion.id === 'experiencedFailure' && answers.experiencedFailure === 'yes' && (
              <div className="mt-6">
                <label className="block text-lg font-semibold text-stone-900 mb-3">
                  Please briefly describe what happened:
                </label>
                <textarea
                  value={answers.failureDescription || ''}
                  onChange={(e) => setAnswers({ ...answers, failureDescription: e.target.value })}
                  placeholder="e.g., Our chatbot gave incorrect pricing information to a customer..."
                  rows={4}
                  className="w-full p-4 border-2 border-stone-200 rounded-lg focus:border-primary-600 focus:outline-none"
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  ← Back
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
                {isSubmitting ? (
                  'Submitting...'
                ) : currentStep === questions.length - 1 ? (
                  'Get My Risk Report →'
                ) : (
                  'Next Question →'
                )}
              </button>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">1,247</div>
                <p className="text-sm text-stone-600">Assessments Completed</p>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div>
                <div className="text-2xl font-bold text-primary-600">4.9/5</div>
                <p className="text-sm text-stone-600">Average Rating</p>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div>
                <div className="text-2xl font-bold text-primary-600">2 min</div>
                <p className="text-sm text-stone-600">Average Time</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
