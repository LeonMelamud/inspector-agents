'use client';

import Link from 'next/link';
import { trackCTAClick, trackNavigation } from '@/lib/analytics';
import React from 'react';

interface TrackedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  trackingLabel: string;
  location: string;
  type?: 'cta' | 'internal' | 'external';
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Link component that automatically tracks clicks.
 *
 * Uses Next.js <Link> for internal routes (SPA navigation + prefetching)
 * and a regular <a> for external URLs.
 */
export function TrackedLink({
  href,
  children,
  className,
  trackingLabel,
  location,
  type = 'cta',
  onClick,
}: TrackedLinkProps) {
  const isExternal =
    href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('//');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (type === 'cta') {
      trackCTAClick(trackingLabel, location, href);
    } else if (type === 'internal') {
      trackNavigation.internalLink(trackingLabel, href);
    } else if (type === 'external') {
      trackNavigation.externalLink(trackingLabel, href);
    }

    onClick?.(e);
  };

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
