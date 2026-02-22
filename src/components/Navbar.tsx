'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/failures', label: 'Failures Database' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/checklist', label: 'Checklist' },
  { href: '/demo', label: 'Live Demo' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/docs', label: 'API Docs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar */}
      <div className="bg-primary-900 text-white">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-white"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-accent-500 text-primary-900 text-sm font-bold">
              IA
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              InspectAgents
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname?.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-accent-400 bg-primary-800'
                        : 'text-primary-100 hover:text-white hover:bg-primary-800'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="ml-3">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-5 py-2 text-sm font-bold text-primary-900 hover:bg-accent-400 transition-colors"
              >
                Get Started
              </Link>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded p-2 text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-primary-900 border-t border-primary-700">
          <ul className="space-y-1 px-4 py-3">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname?.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-accent-400 bg-primary-800'
                        : 'text-primary-100 hover:text-white hover:bg-primary-800'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link
                href="/quiz"
                onClick={() => setMobileOpen(false)}
                className="block w-full rounded bg-accent-500 px-4 py-2.5 text-center text-sm font-bold text-primary-900 hover:bg-accent-400 transition-colors"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
