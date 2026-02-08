'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { trackCTAClick } from '@/lib/analytics';
import { track } from '@vercel/analytics';

const STORAGE_KEY = 'stickyBarDismissed:v1';
const DISMISS_DURATION_HOURS = 24;

// Pages where sticky bar should NOT appear
const EXCLUDED_PATHS = [
  '/quiz',               // Already taking quiz
  '/quiz/thank-you',     // Just completed quiz
  '/checklist/download', // Already on download page
];

interface StickyCtaBarProps {
  /** Scroll threshold in pixels before showing bar (default: 400) */
  threshold?: number;
  /** Primary CTA text */
  ctaText?: string;
  /** Primary CTA link */
  ctaLink?: string;
  /** Message text */
  message?: string;
  /** Secondary CTA text */
  secondaryCtaText?: string;
  /** Secondary CTA link */
  secondaryCtaLink?: string;
}

/**
 * Sticky CTA Bar that appears after scrolling past threshold
 * 
 * Features:
 * - Slides in from bottom after user scrolls (shows engagement)
 * - Dismissible with 24hr cookie
 * - Two CTAs: primary (quiz) and secondary (checklist)
 * - Tracks analytics on show, click, and dismiss
 * - Excluded from quiz/thank-you pages
 * - Mobile responsive with stacked CTAs on small screens
 */
export function StickyCtaBar({
  threshold = 400,
  ctaText = 'Take 2-Min Quiz →',
  ctaLink = '/quiz',
  message = "Don't let AI destroy your business",
  secondaryCtaText = 'Get Free Checklist',
  secondaryCtaLink = '/checklist',
}: StickyCtaBarProps) {
  const pathname = usePathname();
  const [isDismissed, setIsDismissed] = useState(true); // Start dismissed
  const [hasShown, setHasShown] = useState(false);
  const { isScrolledPastThreshold } = useScrollPosition({ threshold });

  // Don't show on excluded pages
  const isExcludedPage = EXCLUDED_PATHS.some((path) => pathname?.startsWith(path));

  // Check if bar was dismissed recently
  useEffect(() => {
    if (isExcludedPage) {
      setIsDismissed(true);
      return;
    }

    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const dismissedDate = new Date(dismissed);
        const hoursSinceDismiss =
          (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60);

        if (hoursSinceDismiss < DISMISS_DURATION_HOURS) {
          // Still within dismiss period, keep hidden
          setIsDismissed(true);
          return;
        }
      }

      // Not dismissed or dismiss period expired
      setIsDismissed(false);
    } catch {
      // localStorage not available - show bar
      setIsDismissed(false);
    }
  }, [isExcludedPage]);

  // Track when bar becomes visible
  useEffect(() => {
    if (!isDismissed && isScrolledPastThreshold && !hasShown) {
      setHasShown(true);
      track('sticky_cta_bar_shown', {
        scrollY: window.scrollY,
        page: pathname,
      });
    }
  }, [isDismissed, isScrolledPastThreshold, hasShown, pathname]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // localStorage not available, bar won't persist dismiss
    }
    track('sticky_cta_bar_dismissed', { page: pathname });
  };

  const handlePrimaryClick = () => {
    trackCTAClick(ctaText, 'sticky-cta-bar', ctaLink);
    track('sticky_cta_bar_primary_click', {
      cta: ctaText,
      destination: ctaLink,
      page: pathname,
    });
  };

  const handleSecondaryClick = () => {
    trackCTAClick(secondaryCtaText, 'sticky-cta-bar', secondaryCtaLink);
    track('sticky_cta_bar_secondary_click', {
      cta: secondaryCtaText,
      destination: secondaryCtaLink,
      page: pathname,
    });
  };

  // Don't render if dismissed, on excluded page, or not scrolled enough
  const shouldShow = !isDismissed && !isExcludedPage && isScrolledPastThreshold;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        shouldShow ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="region"
      aria-label="Call to action banner"
    >
      {/* Bar Content */}
      <div className="bg-primary-900 shadow-2xl border-t border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Message */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              {/* Icon */}
              <div className="hidden sm:flex w-10 h-10 bg-accent-500 rounded-lg flex-shrink-0 items-center justify-center">
                <span className="text-primary-900 font-bold text-sm">IA</span>
              </div>

              {/* Text */}
              <div>
                <p className="text-white font-semibold text-base sm:text-lg">
                  {message}
                </p>
                <p className="text-primary-300 text-xs sm:text-sm">
                  500+ AI failures analyzed • 250+ teams protected
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
              {/* Primary CTA */}
              <Link
                href={ctaLink}
                onClick={handlePrimaryClick}
                className="flex-1 sm:flex-initial bg-accent-500 text-primary-900 font-semibold px-4 sm:px-6 py-2.5 rounded-full hover:bg-accent-400 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap text-center"
              >
                {ctaText}
              </Link>

              {/* Secondary CTA */}
              <Link
                href={secondaryCtaLink}
                onClick={handleSecondaryClick}
                className="flex-1 sm:flex-initial bg-primary-800 text-white font-medium px-4 sm:px-5 py-2.5 rounded-full hover:bg-primary-700 transition-colors border border-primary-600 text-sm sm:text-base whitespace-nowrap text-center"
              >
                {secondaryCtaText}
              </Link>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors p-2 -mr-2"
                aria-label="Dismiss banner"
              >
                <svg
                  className="w-5 h-5"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
