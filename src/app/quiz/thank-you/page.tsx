'use client';

import { useEffect, useState } from 'react';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { trackEmailCapture } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  subscribeToNewsletter, 
  extractTopPainPoints,
  type EmailData 
} from '@/lib/email';

interface QuizAnswers {
  currentlyUsing?: string;
  biggestFears?: string[];
  email?: string;
}

export default function ThankYouPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useTimeTracking('thank-you');

  useEffect(() => {
    const storedAnswers = localStorage.getItem('quizAnswers');
    if (!storedAnswers) {
      router.push('/quiz');
      return;
    }

    const parsedAnswers: QuizAnswers = JSON.parse(storedAnswers);
    setAnswers(parsedAnswers);

    const risk = calculateRisk(parsedAnswers);
    setRiskLevel(risk);

    if (parsedAnswers.email && !emailSent) {
      submitToEmailService(parsedAnswers, risk);
    }
  }, [router, emailSent]);

  const calculateRisk = (ans: QuizAnswers): 'low' | 'medium' | 'high' => {
    let score = 0;
    if (ans.currentlyUsing === 'yes') score += 2;
    else if (ans.currentlyUsing === 'planning') score += 1;
    
    const fears = ans.biggestFears || [];
    if (fears.length >= 4) score += 3;
    else if (fears.length >= 2) score += 2;
    else if (fears.length >= 1) score += 1;
    
    if (fears.includes('dontKnow')) score += 2;
    if (ans.currentlyUsing === 'yes' && fears.includes('security')) score += 1;

    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  const submitToEmailService = async (parsedAnswers: QuizAnswers, risk: 'low' | 'medium' | 'high') => {
    try {
      const quizData = {
        currentUsage: parsedAnswers.currentlyUsing || 'no',
        biggestFears: parsedAnswers.biggestFears || [],
        email: parsedAnswers.email || '',
      };

      const topPainPoints = extractTopPainPoints(quizData);

      const emailData: EmailData = {
        email: parsedAnswers.email || '',
        firstName: '',
        source: 'quiz',
        quizAnswers: quizData,
        riskLevel: risk,
        topPainPoints,
      };

      const result = await subscribeToNewsletter(emailData);

      if (result.success) {
        setEmailSent(true);
        trackEmailCapture.submitted('quiz');
      } else {
        setEmailError(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error submitting to email service:', error);
      setEmailError('Network error. Please check your connection.');
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'green';
    }
  };

  const getRiskMessage = () => {
    switch (riskLevel) {
      case 'high':
        return {
          title: '🚨 High Risk: Immediate Action Needed',
          description: 'Based on your answers, you have multiple high-risk factors that need urgent attention. Your AI agents are vulnerable to failures that could significantly impact your business.',
          action: 'We recommend implementing comprehensive testing protocols immediately.',
        };
      case 'medium':
        return {
          title: '⚠️ Medium Risk: Plan Your Defense',
          description: 'You\'re aware of AI risks but there are gaps that could lead to costly incidents. Now is the time to strengthen your testing and monitoring.',
          action: 'We recommend setting up systematic testing and monitoring processes.',
        };
      case 'low':
        return {
          title: '✅ Low Risk: Stay Vigilant',
          description: 'You\'re either just starting with AI or have good awareness of the risks. This is the perfect time to build strong testing foundations before scaling.',
          action: 'We recommend establishing testing best practices from day one.',
        };
    }
  };

  const getTopRecommendations = () => {
    const recommendations: { icon: string; title: string; description: string }[] = [];

    if (answers?.biggestFears?.includes('hallucinations')) {
      recommendations.push({
        icon: '🎯',
        title: 'Implement Ground Truth Testing',
        description: 'Test your AI against known correct answers to catch hallucinations before customers see them.',
      });
    }

    if (answers?.biggestFears?.includes('security')) {
      recommendations.push({
        icon: '🔒',
        title: 'Run Prompt Injection Tests',
        description: 'Simulate attacker scenarios to ensure your AI can\'t be manipulated to bypass security.',
      });
    }

    if (answers?.biggestFears?.includes('reputation')) {
      recommendations.push({
        icon: '🛡️',
        title: 'Set Up Output Monitoring',
        description: 'Monitor all AI responses in real-time to catch and prevent viral failures.',
      });
    }

    if (answers?.biggestFears?.includes('cost')) {
      recommendations.push({
        icon: '💰',
        title: 'Implement Token Budgets',
        description: 'Set hard limits on API costs and get alerts before spending spirals.',
      });
    }

    if (answers?.biggestFears?.includes('dontKnow')) {
      recommendations.push({
        icon: '📋',
        title: 'Start With Our Checklist',
        description: 'Our 56-point checklist covers the risks you haven\'t thought of yet.',
      });
    }

    if (recommendations.length < 3) {
      recommendations.push({
        icon: '📋',
        title: 'Download Our Testing Checklist',
        description: 'Get our comprehensive 56-point AI safety checklist to cover all bases.',
      });
    }

    return recommendations.slice(0, 3);
  };

  if (!answers) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const riskInfo = getRiskMessage();
  const color = getRiskColor();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-stone-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            InspectAgents
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Risk Result */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 text-center">
            <div className="mb-6">
              <div className="text-5xl mb-4">
                {color === 'red' && '🚨'}
                {color === 'amber' && '⚠️'}
                {color === 'green' && '✅'}
              </div>
              <h1 className="text-4xl font-bold text-stone-900 mb-3">
                Your AI Risk Assessment
              </h1>
              <p className="text-xl text-stone-600">
                {emailSent ? (
                  <>Full report sent to <strong>{answers.email}</strong></>
                ) : emailError ? (
                  <span className="text-red-600 text-base">⚠️ {emailError} — Your results are saved below.</span>
                ) : (
                  <>Sending report to <strong>{answers.email}</strong>...</>
                )}
              </p>
            </div>

            <div className={`bg-${color}-50 border-2 border-${color}-200 rounded-lg p-6 mb-6`}>
              <h2 className={`text-2xl font-bold text-${color}-900 mb-2`}>
                {riskInfo.title}
              </h2>
              <p className={`text-${color}-800 mb-4`}>
                {riskInfo.description}
              </p>
              <p className={`text-${color}-900 font-semibold`}>
                {riskInfo.action}
              </p>
            </div>
          </div>

          {/* Top Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              Your Top 3 Priority Actions
            </h2>
            <div className="space-y-4">
              {getTopRecommendations().map((rec, index) => (
                <div key={index} className="flex items-start p-4 bg-primary-50 rounded-lg border-l-4 border-primary-600">
                  <span className="text-3xl mr-4">{rec.icon}</span>
                  <div>
                    <h3 className="font-bold text-stone-900 mb-1">{rec.title}</h3>
                    <p className="text-stone-600 text-sm">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">
              You&apos;re Not Alone
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-primary-50 rounded-lg">
                <div className="text-3xl mb-2">🤥</div>
                <div className="text-2xl font-bold text-primary-600 mb-1">68%</div>
                <p className="text-sm text-stone-600">Fear AI hallucinations</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-lg">
                <div className="text-3xl mb-2">💔</div>
                <div className="text-2xl font-bold text-amber-600 mb-1">72%</div>
                <p className="text-sm text-stone-600">Fear reputation damage</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">🔓</div>
                <div className="text-2xl font-bold text-green-600 mb-1">59%</div>
                <p className="text-sm text-stone-600">Fear security breaches</p>
              </div>
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">What&apos;s Next?</h2>
            <div className="space-y-4 mb-8 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <span className="text-2xl mr-4">📧</span>
                <div>
                  <h3 className="font-bold mb-1">1. Check Your Email</h3>
                  <p className="text-primary-50">Your personalized risk report with detailed recommendations is on its way.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">📋</span>
                <div>
                  <h3 className="font-bold mb-1">2. Grab the Free Checklist</h3>
                  <p className="text-primary-50">56-point AI safety checklist — covers everything from hallucinations to prompt injection.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">🚀</span>
                <div>
                  <h3 className="font-bold mb-1">3. Take Action</h3>
                  <p className="text-primary-50">Start with your top 3 priorities above and work down the checklist.</p>
                </div>
              </div>
            </div>
            <a
              href="/checklist"
              className="inline-block bg-accent-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-accent-600 transition-colors shadow-lg hover:shadow-xl text-lg mb-4"
            >
              Download Free Testing Checklist →
            </a>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <a
              href="/failures"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-600"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2">📚 AI Failures Database</h3>
              <p className="text-stone-600 text-sm">Learn from 20+ real AI incidents so you don&apos;t repeat their mistakes.</p>
            </a>
            <a
              href="/blog"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-600"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2">✍️ Testing Guides</h3>
              <p className="text-stone-600 text-sm">Practical how-to guides for testing AI agents before deployment.</p>
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-stone-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-stone-600 text-sm">
            &copy; 2026 InspectAgents. Preventing AI failures, one agent at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
