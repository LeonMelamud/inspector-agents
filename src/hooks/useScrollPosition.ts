'use client';

import { useEffect, useState } from 'react';

interface UseScrollPositionOptions {
  /** Pixel threshold to trigger visibility (default: 300) */
  threshold?: number;
  /** Enable/disable the hook */
  enabled?: boolean;
}

/**
 * Hook to track scroll position and determine if user has scrolled past threshold
 * Useful for showing sticky elements after user engages with content
 */
export function useScrollPosition({
  threshold = 300,
  enabled = true,
}: UseScrollPositionOptions = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledPastThreshold, setIsScrolledPastThreshold] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolledPastThreshold(currentScrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, enabled]);

  return { scrollY, isScrolledPastThreshold };
}
