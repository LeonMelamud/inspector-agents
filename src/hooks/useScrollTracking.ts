'use client';

import { useEffect, useRef } from 'react';
import { trackNavigation } from '@/lib/analytics';

/**
 * Hook to track scroll depth on a page
 * Fires events at 25%, 50%, 75%, and 100% scroll depth
 */
export function useScrollTracking(pageName: string) {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Check each milestone
      const milestones = [25, 50, 75, 100] as const;
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackNavigation.scrollDepth(milestone, pageName);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageName]);
}
