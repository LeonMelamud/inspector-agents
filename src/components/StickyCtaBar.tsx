'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { trackCTAClick } from '@/lib/analytics';
import { track } from '@vercel/analytics';

const STORAGE_KEY = 'stickyBarDismissed:v1';
const DISMISS_DURATION_HOURS = 24;

// Pages where sticky bar should NOT appear: focused flows and pages whose own
// primary action would compete with it (one primary CTA per view).
const EXCLUDED_PATHS = [
  '/quiz',               // Already taking quiz (also covers /quiz/thank-you)
  '/checklist',          // Checklist landing and download have their own primary action
  '/demo',               // Waitlist pages
  '/pricing',
  '/how-it-works',
  '/contact',
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
  /** Supporting line under the message */
  detail?: string;
}

/**
 * Sticky CTA Bar that appears after scrolling past threshold
 * 
 * Features:
 * - Slides in from bottom after user scrolls (shows engagement)
 * - Dismissible with 24hr cookie
 * - One CTA (quiz); the checklist has its own entry points
 * - Tracks analytics on show, click, and dismiss
 * - Excluded from quiz/thank-you pages
 * - Mobile responsive with stacked CTAs on small screens
 */
export function StickyCtaBar({
  threshold = 400,
  ctaText = 'Check your AI risk',
  ctaLink = '/quiz/',
  message = 'Could your chatbot be talked into selling a car for $1?',
  detail = 'It happened to a Chevrolet dealer in 2023. Check your own agent in 3 steps.',
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

  // Don't render if dismissed, on excluded page, or not scrolled enough
  const shouldShow = !isDismissed && !isExcludedPage && isScrolledPastThreshold;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        shouldShow ? 'translate-y-0' : 'translate-y-full invisible'
      }`}
      role="region"
      aria-label="Risk check prompt"
      aria-hidden={!shouldShow}
      inert={!shouldShow}
    >
      <div className="bg-primary-900 shadow-[0_-8px_24px_rgba(16,42,67,0.18)] border-t border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm sm:text-lg leading-snug">{message}</p>
              <p className="hidden sm:block text-primary-200 text-sm">{detail}</p>
            </div>

            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <Link
                href={ctaLink}
                onClick={handlePrimaryClick}
                className="bg-accent-500 text-primary-900 font-bold px-4 sm:px-6 py-2.5 rounded-full hover:bg-accent-400 transition-colors text-sm sm:text-base whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                {ctaText}
              </Link>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-primary-200 hover:text-white transition-colors p-2.5 -mr-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
