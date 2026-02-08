# InspectAgents

AI agent testing & safety platform. Prevents chatbot failures before they reach your customers.

**Live:** [inspectagents.com](https://inspectagents.com)

## Quick Start

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # Production build
```

## Email Setup (Optional)

```bash
cp .env.example .env.local
```

Three providers supported (auto-detected from env vars):

| Provider | Env Vars | Best For |
|----------|----------|----------|
| **n8n** (recommended) | `N8N_WEBHOOK_URL` | Free, flexible workflows |
| **Resend** | `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` | Developer-friendly |
| **ConvertKit** | `CONVERTKIT_API_KEY`, `CONVERTKIT_FORM_ID` | Marketer-friendly |

Priority: n8n > Resend > ConvertKit.

Guides: [EMAIL_SETUP.md](docs/EMAIL_SETUP.md) | [N8N_SETUP.md](docs/N8N_SETUP.md)

## Tech Stack

- **Next.js 16+** (App Router, hybrid: static pages + serverless API routes)
- **React 19** (Server Components by default)
- **Tailwind CSS 3** (custom green/amber palette)
- **Vercel Analytics** (privacy-friendly)
- **TypeScript** (strict)

## Deployment

Deploy to **Vercel** — it auto-detects Next.js and handles both static pages
and serverless API routes (`/api/subscribe`).

> **Note:** This is NOT a static export. The project requires Vercel (or similar)
> for API route support.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with case studies, social proof, FAQ |
| `/quiz` | Interactive 7-question AI risk assessment |
| `/quiz/thank-you` | Personalized results + email capture |
| `/blog` | 3 SEO articles on AI failures & testing |
| `/failures` | Searchable database of 20+ real AI incidents |
| `/glossary` | 20 AI safety terms (SEO long-tail) |
| `/checklist` | 50-point AI risk checklist (lead magnet) |
| `/checklist/download` | Printable checklist version |
| `/about` | Founder story + mission |
| `/api/subscribe` | Email subscription endpoint |

## Color Palette

- **Primary (Green):** `primary-600` #059669 — trust, safety
- **Accent (Amber):** `accent-500` #f59e0b — energy, attention
- **Neutrals (Stone):** `stone-900` #1c1917 — warm, approachable
