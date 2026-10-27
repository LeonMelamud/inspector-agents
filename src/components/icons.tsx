/**
 * Small authored icon set (24px grid, 2px outline stroke) matching the outline
 * icons already used on the home page. Use these instead of emoji.
 */
import type { SVGProps } from 'react';

const PATHS = {
  check: 'M5 13l4 4L19 7',
  arrowRight: 'M13 7l5 5-5 5M6 12h12',
  arrowLeft: 'M11 17l-5-5 5-5M18 12H6',
  rocket: 'M15.6 8.4a1.5 1.5 0 11-2.1 2.1 1.5 1.5 0 012.1-2.1zM5 19l3-1 1-3m4.5 1.5L19 11c1.5-1.5 2-4 2-7-3 0-5.5.5-7 2l-5.5 5.5m5 5L11 19l-1.5-3.5L6 14l2.5-2.5',
  search: 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z',
  server: 'M5 4h14a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm0 10h14a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4a1 1 0 011-1zM8 7h.01M8 17h.01',
  chat: 'M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.4-4 8-9 8a9.9 9.9 0 01-4-.8L3 20l1.3-3.9A7.5 7.5 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  megaphone: 'M11 5.9v12.2a1 1 0 01-1.6.8L5.6 16H4a1 1 0 01-1-1V9a1 1 0 011-1h1.6l3.8-2.9a1 1 0 011.6.8zM15.5 8.5a5 5 0 010 7M18.4 5.6a9 9 0 010 12.8',
  coins: 'M12 8c-2.8 0-5-1.1-5-2.5S9.2 3 12 3s5 1.1 5 2.5S14.8 8 12 8zm-5-2.5v4C7 10.9 9.2 12 12 12s5-1.1 5-2.5v-4M7 9.5v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4M7 13.5v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4',
  question: 'M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3m.1 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  mail: 'M3 8l7.9 5.3a2 2 0 002.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  clipboard: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  shield: 'M9 12l2 2 4-4m5.6-4A12 12 0 0112 2.9 12 12 0 013.4 6 12 12 0 003 9c0 5.6 3.8 10.3 9 11.6 5.2-1.3 9-6 9-11.6 0-1-.1-2-.4-3z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = 'w-5 h-5', ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
