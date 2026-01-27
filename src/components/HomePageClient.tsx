'use client';

import { useScrollTracking } from '@/hooks/useScrollTracking';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { TrackedLink } from '@/components/TrackedLink';

interface HomePageClientProps {
  children: React.ReactNode;
}

export function HomePageClient({ children }: HomePageClientProps) {
  // Track scroll depth and time on page
  useScrollTracking('homepage');
  useTimeTracking('homepage');

  return <>{children}</>;
}

// Export TrackedLink for use in page.tsx
export { TrackedLink };
