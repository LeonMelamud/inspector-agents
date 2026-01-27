'use client';

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
 * Link component that automatically tracks clicks
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
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track the click event
    if (type === 'cta') {
      trackCTAClick(trackingLabel, location, href);
    } else if (type === 'internal') {
      trackNavigation.internalLink(trackingLabel, href);
    } else if (type === 'external') {
      trackNavigation.externalLink(trackingLabel, href);
    }

    // Call custom onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
