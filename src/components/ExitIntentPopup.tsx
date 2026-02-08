'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useExitIntent } from '@/hooks/useExitIntent';
import { trackCTAClick } from '@/lib/analytics';
import { track } from '@vercel/analytics';

const STORAGE_KEY = 'exitPopupDismissed:v1';
const DISMISS_DURATION_DAYS = 7;

// Pages where popup should NOT appear
const EXCLUDED_PATHS = [
  '/checklist',           // Already on checklist page
  '/checklist/download',  // Already downloading
  '/quiz/thank-you',      // Just completed quiz
];

/**
 * Exit Intent Popup offering the AI Risk Checklist
 * 
 * Triggers when:
 * - Desktop: Mouse moves toward top of viewport (exit intent)
 * - Mobile: After 20 seconds on page
 * 
 * Shows once per 7 days if dismissed
 * Excluded from checklist pages and thank-you pages
 */
export function ExitIntentPopup() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldEnable, setShouldEnable] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Don't show on excluded pages
  const isExcludedPage = EXCLUDED_PATHS.some((path) => pathname?.startsWith(path));

  // Check if popup was dismissed recently
  useEffect(() => {
    if (isExcludedPage) {
      setShouldEnable(false);
      return;
    }

    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const dismissedDate = new Date(dismissed);
        const daysSinceDismiss = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceDismiss < DISMISS_DURATION_DAYS) {
          // Still within dismiss period, don't show
          setShouldEnable(false);
          return;
        }
      }
      
      // Not dismissed or dismiss period expired
      setShouldEnable(true);
    } catch {
      // localStorage not available (incognito, etc.) - show popup
      setShouldEnable(true);
    }
  }, [isExcludedPage]);

  // Track time on page for mobile fallback trigger
  useEffect(() => {
    if (!shouldEnable) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldEnable]);

  // Desktop: Exit intent detection
  useExitIntent({
    enabled: shouldEnable && !isVisible,
    threshold: 10,
    delay: 200,
    onExitIntent: () => {
      setIsVisible(true);
      track('exit_intent_popup_shown', { trigger: 'mouse_exit' });
    },
  });

  // Mobile fallback: Show after 20 seconds
  useEffect(() => {
    if (!shouldEnable || isVisible) return;

    // Detect mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile && timeOnPage >= 20) {
      setIsVisible(true);
      track('exit_intent_popup_shown', { trigger: 'mobile_timer' });
    }
  }, [timeOnPage, shouldEnable, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // localStorage not available, popup won't persist dismiss
    }
    track('exit_intent_popup_dismissed');
  };

  const handleDownload = () => {
    trackCTAClick('Get Free Checklist', 'exit-intent-popup', '/checklist');
    track('exit_intent_popup_converted');
    handleClose();
  };

  const handleDecline = () => {
    track('exit_intent_popup_declined');
    handleClose();
  };

  // Don't render if disabled or not visible
  if (!shouldEnable || !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div
          className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8 animate-slideUp"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-popup-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Close popup"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Icon */}
          <div className="mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-700 to-primary-800 rounded-lg flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h2
            id="exit-popup-title"
            className="text-2xl font-bold text-stone-900 mb-3"
          >
            Wait! Get Your Free AI Risk Checklist
          </h2>

          {/* Value Proposition */}
          <p className="text-stone-600 mb-4 leading-relaxed">
            Before you go, grab our <strong>50-point AI testing checklist</strong> used
            by 250+ teams to prevent AI failures.
          </p>

          {/* Benefits List */}
          <ul className="space-y-2 mb-6">
            {[
              'Covers 8 critical risk areas',
              'Prevents Chevrolet-style disasters',
              'Takes 30 minutes for first pass',
              '100% free, no signup required',
            ].map((benefit) => (
              <li key={benefit} className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-stone-700 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            href="/checklist"
            onClick={handleDownload}
            className="block w-full bg-gradient-to-r from-primary-800 to-primary-900 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg text-center mb-3"
          >
            Get Free Checklist →
          </Link>

          {/* Decline Option */}
          <button
            onClick={handleDecline}
            className="w-full text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            No thanks, I&apos;ll risk it
          </button>
        </div>
      </div>
    </>
  );
}
