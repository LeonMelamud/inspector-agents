# InspectAgents — Project Instructions for AI Agents

> Read this FIRST before making any changes. It is the single source of truth
> for project conventions, architecture decisions, and constraints.

## What This Project Is

**InspectAgents.com** — a marketing site that validates the AI agent testing market.
It captures visitor pain points via an interactive quiz, builds an email list,
and establishes authority through an AI failures database, blog, and glossary.

**Goal:** Get traffic → capture pain points → build email list → validate market.

## Current Status (Phase 1 — COMPLETE)

All 17 PRD tasks are done. The site is fully built with:
- Landing page with case studies (Chevrolet, Air Canada, DPD)
- Interactive 7-question quiz + personalized risk results
- Blog with 3 SEO articles
- AI Failures Database (20+ incidents, searchable/filterable)
- Glossary (20 terms)
- AI Risk Checklist (50-point, printable)
- Email capture (Resend / ConvertKit / n8n)
- Analytics (Vercel Analytics)
- Exit-intent popup + sticky CTA bar
- Site-wide navigation header

**Phase 2 is next:** MCP server, GPT Action, A/B testing, paid features.

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Source Control | GitHub | Private repo |
| Framework | Next.js 16+ (App Router) | Deployed on Vercel |
| Hosting | Vercel | Auto-deploys from GitHub `main` branch |
| CI/CD | Vercel + GitHub Actions | Vercel handles builds/deploys; GitHub Actions runs security audits |
| React | 19 | Server Components by default |
| Styling | Tailwind CSS 3 | Custom green/amber palette |
| Analytics | Vercel Analytics | Privacy-friendly, no cookies |
| Email | Resend / ConvertKit / n8n | Auto-detected from env vars |
| TypeScript | Strict | All files must be `.ts` / `.tsx` |

## GitHub & CI/CD

- **Repo is on GitHub** — Vercel auto-deploys on push to `main`
- **`.github/workflows/security.yml`** — runs on push/PR to `main`:
  - `npm audit` for dependency vulnerabilities
  - CodeQL static analysis (code security)
  - TruffleHog secret scanning (leaked keys in git history)
  - Dependency review on PRs (license + vulnerability checks)
  - Build verification (type-check + lint + build)
  - Also runs weekly (Sundays at midnight UTC)
- **`.github/dependabot.yml`** — auto-creates PRs for security patches (weekly, Mondays 9AM ET)
- **`.github/agents/sanity.md`** — agent instructions for the sanity check agent
- Vercel handles deployment previews for PRs and production deploys — **no deploy workflow needed**

## Architecture Rules

### Deployment — NOT static export
The project deploys to **Vercel as a hybrid app** (static pages + serverless API routes).
- `next.config.ts` does NOT have `output: 'export'`
- API routes (`/api/subscribe`) run as serverless functions
- Static pages are prerendered at build time
- **Never** add `output: 'export'` back — it breaks API routes

### Components
- Server Components by default (no `'use client'` unless needed)
- Client components go in `src/components/` with `'use client'` directive
- Use Next.js `<Link>` for internal navigation (never raw `<a>` for internal links)
- The `TrackedLink` component handles both internal (uses `<Link>`) and external links

### Styling
- Tailwind utility classes only — no CSS modules, no styled-components
- Custom colors: `primary-*` (green), `accent-*` (amber), `stone-*` (neutrals)
- Animations defined in `globals.css` as `@layer utilities` — not inline `<style jsx>`
- Print styles: use `.no-print` class

### API Routes
- All at `src/app/api/` using Next.js App Router route handlers
- Rate limited via `src/lib/ratelimit.ts` (sliding-window, serverless-safe)
- Input sanitized via `src/lib/sanitize.ts` (HTML-entity encoding, not stripping)
- Structured logging via `src/lib/logger.ts` (redacts sensitive fields)

### Security
- `sanitizeInput()` HTML-encodes `<>&"'` — does NOT strip them
- `sanitizeEmail()` uses character allowlist, not just bracket removal
- Rate limiter uses lazy eviction (no `setInterval` — safe for serverless)
- Security headers configured in `next.config.ts`

### SEO
- Metadata via `generateSEO()` / `generateArticleSEO()` in `src/lib/seo.ts`
- JSON-LD structured data in layouts (Organization, FAQPage, Article)
- `robots.txt` allows all AI crawlers
- `llms.txt` for AI discoverability

## File Structure (Key Files)

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Navbar, SEO, JSON-LD schemas)
│   ├── page.tsx            # Homepage (763 lines, includes FAQ section)
│   ├── globals.css         # Tailwind + animation utilities
│   ├── api/subscribe/      # Email subscription endpoint
│   ├── quiz/               # Quiz + thank-you pages
│   ├── blog/               # Blog listing + 3 article pages
│   ├── failures/           # AI failures database
│   ├── glossary/           # Glossary page
│   ├── checklist/          # Checklist landing + download pages
│   └── about/              # About page
├── components/
│   ├── Navbar.tsx           # Site-wide sticky nav (client)
│   ├── ExitIntentPopup.tsx  # Exit-intent popup (client)
│   ├── StickyCtaBar.tsx     # Scroll-triggered CTA bar (client)
│   ├── TrackedLink.tsx      # Analytics-tracked link (client)
│   └── HomePageClient.tsx   # Homepage client wrapper for tracking
├── hooks/
│   ├── useExitIntent.ts     # Exit intent detection
│   ├── useScrollPosition.ts # Scroll threshold detection
│   ├── useScrollTracking.ts # Scroll depth analytics
│   └── useTimeTracking.ts   # Time-on-page analytics
├── lib/
│   ├── analytics.ts         # Vercel Analytics event tracking
│   ├── config.ts            # Site config (name, URL, social links)
│   ├── email.ts             # Email service + risk calculation
│   ├── logger.ts            # Structured logging with redaction
│   ├── ratelimit.ts         # Sliding-window rate limiter
│   ├── sanitize.ts          # Input sanitization (HTML encoding)
│   └── seo.ts               # SEO metadata generators
└── emails/                  # React Email templates (3 risk levels)
```

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-600` | #059669 | Primary buttons, CTAs |
| `primary-700` | #047857 | Hover states |
| `primary-50` | #ecfdf5 | Light backgrounds |
| `accent-500` | #f59e0b | Highlights, warnings |
| `stone-900` | #1c1917 | Primary text |
| `stone-600` | #57534e | Secondary text |
| `stone-100` | #f5f5f4 | Page background |

## Common Pitfalls — DO NOT

1. **Do not** add `output: 'export'` to next.config — breaks API routes
2. **Do not** use `<style jsx>` — use Tailwind classes or `globals.css` utilities
3. **Do not** use raw `<a>` for internal links — use `<Link>` or `TrackedLink`
4. **Do not** use `setInterval` in library code — leaks in serverless
5. **Do not** strip HTML chars in sanitization — encode them as entities
6. **Do not** put secrets in client components — only in API routes via `process.env`
7. **Do not** create duplicate instruction files — this AGENTS.md is the single source
8. **Do not** log PII or API keys — logger auto-redacts sensitive field names

## Environment Variables

```
RESEND_API_KEY=           # Resend email service
RESEND_AUDIENCE_ID=       # Resend audience for contacts
CONVERTKIT_API_KEY=       # ConvertKit alternative
CONVERTKIT_FORM_ID=       # ConvertKit form ID
N8N_WEBHOOK_URL=          # n8n webhook (highest priority)
```

Provider priority: n8n > Resend > ConvertKit (auto-detected).

## Resend Email Configuration

Domain **inspectagents.com** is verified in Resend (us-east-1 region).

### DNS Records (added to domain provider)
- **DKIM** — TXT record at `resend._domainkey`
- **SPF** — MX + TXT records at `send` subdomain
- **DMARC** — TXT record at `_dmarc` → `v=DMARC1; p=none;`

### Settings
- **Click Tracking** — Enabled (tracks link clicks in welcome emails)
- **Open Tracking** — Disabled (hurts deliverability, inaccurate)
- **TLS** — Opportunistic (default)
- **Receiving** — Disabled (outbound-only; enable later if inbound routing needed)

### From Address
All emails send from `InspectAgents <hello@inspectagents.com>`.

### Email Templates
Static imports in `src/app/api/subscribe/route.ts` — do NOT use dynamic `import()`.
Three risk-level templates in `src/emails/`: `WelcomeHighRisk`, `WelcomeMediumRisk`, `WelcomeLowRisk`.
