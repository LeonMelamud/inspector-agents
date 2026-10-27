'use client';

import { useEffect, useState } from 'react';
import { trackDemand } from '@/lib/analytics';

/**
 * Lightweight client-side A/B testing hook.
 *
 * Uses localStorage to persist variant assignment so repeat visits
 * see the same variant. Reports the shown variant to Vercel Analytics
 * once per session (sessionStorage guard).
 *
 * Works with Vercel Analytics — no extra dependencies needed.
 * View results by filtering on `ab_variant_shown` events in the Vercel dashboard.
 */
export function useABTest<T extends string>(
  testName: string,
  variants: T[]
): T {
  // Assign after mount so the server render and the first client render match
  // (reading localStorage during render caused a hydration mismatch).
  const [variant, setVariant] = useState<T>(variants[0]);

  useEffect(() => {
    const storageKey = `ab_test_${testName}`;
    let assigned: T;
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing && variants.includes(existing as T)) {
        assigned = existing as T;
      } else {
        assigned = variants[Math.floor(Math.random() * variants.length)];
        localStorage.setItem(storageKey, assigned);
      }
    } catch {
      assigned = variants[0];
    }
    setVariant(assigned);

    // Report variant once per session
    try {
      const sessionKey = `ab_reported_${testName}`;
      if (!sessionStorage.getItem(sessionKey)) {
        trackDemand.variantShown(testName, assigned);
        sessionStorage.setItem(sessionKey, '1');
      }
    } catch {
      // storage unavailable: skip the once-per-session guard
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- variants is a literal array at call sites
  }, [testName]);

  return variant;
}
