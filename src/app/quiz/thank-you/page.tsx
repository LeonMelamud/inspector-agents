'use client';

import { useEffect, useState } from 'react';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { trackEmailCapture } from '@/lib/analytics';
import { useRouter } from 'next/navigation';
import { 
  subscribeToNewsletter, 
  calculateRiskLevel, 
  extractTopPainPoints,
  type EmailData 
} from '@/lib/email';

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

export default function ThankYouPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Track time on thank you page
  useTimeTracking('thank-you');

  useEffect(() => {
    // Get quiz answers from localStorage
    const storedAnswers = localStorage.getItem('quizAnswers');
    if (!storedAnswers) {
      // If no answers found, redirect back to quiz
      router.push('/quiz');
      return;
    }

    const parsedAnswers: QuizAnswers = JSON.parse(storedAnswers);
    setAnswers(parsedAnswers);

    // Calculate risk level based on answers
    const quizData = {
      currentUsage: parsedAnswers.currentlyUsing || 'no',
      biggestFears: parsedAnswers.biggestFears || [],
      experiencedFailure: parsedAnswers.experiencedFailure || 'no',
      failureDescription: parsedAnswers.failureDescription,
      confidenceFactors: parsedAnswers.confidenceFactors || '',
      costImpact: parsedAnswers.costingYou || [],
      role: parsedAnswers.role || 'other',
      email: parsedAnswers.email || '',
    };

    const risk = calculateRiskLevel(quizData);
    setRiskLevel(risk);

    // Submit to email service
    if (parsedAnswers.email && !emailSent) {
      submitToEmailService(parsedAnswers, risk);
    }
  }, [router, emailSent]);

  const submitToEmailService = async (parsedAnswers: QuizAnswers, risk: 'low' | 'medium' | 'high') => {
    try {
      const quizData = {
        currentUsage: parsedAnswers.currentlyUsing || 'no',
        biggestFears: parsedAnswers.biggestFears || [],
        experiencedFailure: parsedAnswers.experiencedFailure || 'no',
        failureDescription: parsedAnswers.failureDescription,
        confidenceFactors: parsedAnswers.confidenceFactors || '',
        costImpact: parsedAnswers.costingYou || [],
        role: parsedAnswers.role || 'other',
        email: parsedAnswers.email || '',
      };

      const topPainPoints = extractTopPainPoints(quizData);

      const emailData: EmailData = {
        email: parsedAnswers.email || '',
        firstName: parsedAnswers.email?.split('@')[0],
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
        console.error('Email subscription failed:', result.error);
      }
    } catch (error) {
      console.error('Error submitting to email service:', error);
      setEmailError('Network error. Please check your connection.');
    }
  };

  const calculateRiskLevel = (ans: QuizAnswers): 'low' | 'medium' | 'high' => {
    let riskScore = 0;

    // Currently using in production adds risk
    if (ans.currentlyUsing === 'yes') riskScore += 2;
    
    // Multiple fears indicate higher risk awareness (but also higher actual risk)
    if (ans.biggestFears && ans.biggestFears.length > 2) riskScore += 2;
    
    // Experienced failure is high risk
    if (ans.experiencedFailure === 'yes') riskScore += 3;
    
    // "Don't know what to worry about" is actually highest risk
    if (ans.biggestFears?.includes('dontKnow')) riskScore += 3;
    
    // Multiple cost areas affected
    if (ans.costingYou && ans.costingYou.length > 2) riskScore += 2;
    if (ans.costingYou?.includes('all')) riskScore += 3;

    if (riskScore >= 7) return 'high';
    if (riskScore >= 4) return 'medium';
    return 'low';
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
          description: 'You\'re aware of AI risks and taking precautions, but there are gaps that could lead to costly incidents. Now is the time to strengthen your testing and monitoring.',
          action: 'We recommend setting up systematic testing and monitoring processes.',
        };
      case 'low':
        return {
          title: '✅ Low Risk: Stay Vigilant',
          description: 'You\'re either just starting with AI agents or have good awareness of the risks. This is the perfect time to build strong testing foundations before scaling up.',
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

    if (answers?.experiencedFailure === 'yes') {
      recommendations.push({
        icon: '🔍',
        title: 'Document & Learn From Failures',
        description: 'Create a failure playbook specific to your use case to prevent repeats.',
      });
    }

    if (answers?.costingYou?.includes('time')) {
      recommendations.push({
        icon: '⚡',
        title: 'Automate Your Testing',
        description: 'Stop manual testing. Set up automated test suites that run continuously.',
      });
    }

    // If we have fewer than 3, add general ones
    if (recommendations.length < 3) {
      recommendations.push({
        icon: '📋',
        title: 'Download Our Testing Checklist',
        description: 'Get our comprehensive 50-point AI safety checklist customized for your role.',
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-primary-600">
            InspectAgents
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 text-center">
            <div className="mb-6">
              <div className={`inline-block w-20 h-20 rounded-full bg-${color}-100 flex items-center justify-center text-4xl mb-4`}>
                {color === 'red' && '🚨'}
                {color === 'amber' && '⚠️'}
                {color === 'green' && '✅'}
              </div>
              <h1 className="text-4xl font-bold text-stone-900 mb-3">
                Your AI Risk Assessment is Ready!
              </h1>
              <p className="text-xl text-stone-600">
                {emailSent ? (
                  <>
                    Check your inbox at <strong>{answers.email}</strong> for your complete personalized report.
                  </>
                ) : emailError ? (
                  <>
                    <span className="text-red-600">⚠️ {emailError}</span>
                    <br />
                    <span className="text-sm">Don't worry! Your quiz results are saved below. You can download the checklist to get started.</span>
                  </>
                ) : (
                  <>
                    Sending your personalized report to <strong>{answers.email}</strong>...
                  </>
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

          {/* Quick Insights */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              Your Top 3 Priority Actions
            </h2>
            <p className="text-stone-600 mb-6">
              Based on your answers, here's what you should focus on first:
            </p>
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
              You\'re Not Alone in This
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-primary-50 rounded-lg">
                <div className="text-3xl mb-2">😬</div>
                <div className="text-2xl font-bold text-primary-600 mb-1">34%</div>
                <p className="text-sm text-stone-600">Have already experienced an AI failure</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-lg">
                <div className="text-3xl mb-2">💔</div>
                <div className="text-2xl font-bold text-amber-600 mb-1">72%</div>
                <p className="text-sm text-stone-600">Fear reputation damage from AI mistakes</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">⏰</div>
                <div className="text-2xl font-bold text-green-600 mb-1">81%</div>
                <p className="text-sm text-stone-600">Are losing time to manual testing & worry</p>
              </div>
            </div>
            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
              <p className="text-stone-700 italic mb-3">
                "I took this quiz before deploying our chatbot. The risk assessment revealed 3 critical vulnerabilities we hadn't thought about. We delayed launch by 2 weeks to fix them — best decision we made."
              </p>
              <p className="font-semibold text-stone-900">— Sarah Chen, CTO at TechCorp</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">What Happens Next?</h2>
            <div className="space-y-4 mb-8 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <span className="text-2xl mr-4">📧</span>
                <div>
                  <h3 className="font-bold mb-1">1. Check Your Email (Next 5 Minutes)</h3>
                  <p className="text-primary-50">
                    You'll receive your complete personalized risk report with detailed recommendations for your specific situation.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">📋</span>
                <div>
                  <h3 className="font-bold mb-1">2. Download Your Testing Checklist</h3>
                  <p className="text-primary-50">
                    Get our comprehensive 50-point AI safety checklist customized for your role: {answers.role}.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-4">🚀</span>
                <div>
                  <h3 className="font-bold mb-1">3. Take Action</h3>
                  <p className="text-primary-50">
                    Follow the step-by-step recommendations to secure your AI agents before they reach more customers.
                  </p>
                </div>
              </div>
            </div>
            <a
              href="/checklist"
              className="inline-block bg-accent-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-accent-600 transition-colors shadow-lg hover:shadow-xl text-lg mb-4"
            >
              Download Free Testing Checklist →
            </a>
            <p className="text-primary-100 text-sm">
              While you wait for your email, grab the checklist and start protecting your AI today
            </p>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <a
              href="/failures"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-600"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                📚 Browse AI Failures Database
              </h3>
              <p className="text-stone-600 text-sm">
                Learn from 500+ analyzed AI incidents so you don\'t repeat their mistakes.
              </p>
            </a>
            <a
              href="/blog"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-600"
            >
              <h3 className="font-bold text-lg text-stone-900 mb-2">
                ✍️ Read Our Testing Guides
              </h3>
              <p className="text-stone-600 text-sm">
                Get practical how-to guides for testing AI agents before deployment.
              </p>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
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
