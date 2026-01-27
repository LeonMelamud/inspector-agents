'use client';

import { useEffect, useState } from 'react';

interface UseExitIntentOptions {
  /** Threshold in pixels from top of viewport to trigger (default: 10) */
  threshold?: number;
  /** Delay before showing popup after trigger (ms, default: 200) */
  delay?: number;
  /** Callback when exit intent detected */
  onExitIntent?: () => void;
  /** Enable/disable the hook */
  enabled?: boolean;
}

/**
 * Hook to detect exit intent (mouse leaving viewport toward top)
 * Works on desktop only - mobile uses alternative triggers
 */
export function useExitIntent({
  threshold = 10,
  delay = 200,
  onExitIntent,
  enabled = true,
}: UseExitIntentOptions = {}) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || triggered) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving toward top of viewport
      // and clientY is near top (within threshold)
      if (e.clientY <= threshold && e.relatedTarget === null) {
        timeoutId = setTimeout(() => {
          setTriggered(true);
          onExitIntent?.();
        }, delay);
      }
    };

    const handleMouseEnter = () => {
      // Cancel trigger if mouse comes back
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, delay, onExitIntent, enabled, triggered]);

  return { triggered };
}
