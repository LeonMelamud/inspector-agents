'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useExitIntent } from '@/hooks/useExitIntent';
import { trackCTAClick } from '@/lib/analytics';
import { track } from '@vercel/analytics';

const STORAGE_KEY = 'exitPopupDismissed:v1';

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
 * Shows only once — permanently dismissed after close
 * Excluded from checklist pages and thank-you pages
 */
interface ExitIntentPopupProps {
  checklistCount: number;
  sectionCount: number;
}

export function ExitIntentPopup({ checklistCount, sectionCount }: ExitIntentPopupProps) {
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
        setShouldEnable(false);
        return;
      }
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
    setShouldEnable(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
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

  // Escape closes the dialog (standard dialog behaviour)
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isVisible]);

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
            className="absolute top-3 right-3 p-2 rounded text-gray-500 hover:text-primary-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            aria-label="Close"
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
            <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center">
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
            className="font-display text-2xl font-bold text-primary-900 mb-3 pr-8 text-balance"
          >
            Before you go: take the checklist with you
          </h2>

          {/* Value Proposition */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            Our <strong>{checklistCount}-point pre-launch checklist</strong> is free and printable. Run it before your next release.
          </p>

          {/* Benefits List */}
          <ul className="space-y-2 mb-6">
            {[
              `${sectionCount} risk categories, from hallucination to tool-use safety`,
              'Includes the prompt-injection checks behind the Chevrolet $1 case',
              'A severity on every item, so you know what to fix first',
              'Free, no signup',
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
                <span className="text-gray-700 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            href="/checklist"
            onClick={handleDownload}
            className="block w-full bg-accent-500 text-primary-900 font-bold py-3 px-6 rounded-full hover:bg-accent-400 transition-colors text-center mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
          >
            Open the checklist
          </Link>

          {/* Decline Option */}
          <button
            onClick={handleDecline}
            className="w-full py-2 text-sm text-gray-600 hover:text-primary-900 transition-colors"
          >
            No thanks
          </button>
        </div>
      </div>
    </>
  );
}
