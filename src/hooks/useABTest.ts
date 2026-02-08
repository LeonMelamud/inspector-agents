'use client';

import { useEffect, useMemo } from 'react';
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
  const variant = useMemo(() => {
    if (typeof window === 'undefined') return variants[0];

    const storageKey = `ab_test_${testName}`;
    const existing = localStorage.getItem(storageKey);

    if (existing && variants.includes(existing as T)) {
      return existing as T;
    }

    // Assign randomly
    const assigned = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(storageKey, assigned);
    return assigned;
  }, [testName, variants]);

  useEffect(() => {
    // Report variant once per session
    const sessionKey = `ab_reported_${testName}`;
    if (!sessionStorage.getItem(sessionKey)) {
      trackDemand.variantShown(testName, variant);
      sessionStorage.setItem(sessionKey, '1');
    }
  }, [testName, variant]);

  return variant;
}
