'use client';

import { useEffect, useRef } from 'react';
import { trackEngagement } from '@/lib/analytics';

/**
 * Hook to track time spent on a page
 * Reports time when user leaves the page or closes the tab
 */
export function useTimeTracking(pageName: string) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Reset start time when component mounts
    startTime.current = Date.now();

    const trackTime = () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      // Only track if user spent at least 5 seconds
      if (timeSpent >= 5) {
        trackEngagement.timeOnPage(pageName, timeSpent);
      }
    };

    // Track on visibility change (user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackTime();
      }
    };

    // Track on beforeunload (user leaves page)
    const handleBeforeUnload = () => {
      trackTime();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pageName]);
}
