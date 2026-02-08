# InspectAgents.com - Phase 1: Validate & Capture Pain Points

## Overview
Build a focused landing site for InspectAgents.com to **validate the market** and **capture customer pain points**. Phase 1 priority: get traffic, understand what problems visitors have with AI agents, and build an email list. Keep it simple—static site on GitHub Pages or Vercel, with an interactive quiz to surface pain points. MCP integrations and advanced features come in Phase 2 after validation.

## Tasks

### Core Setup
- [x] Task 1: Set up Next.js project with static export for GitHub Pages (or Vercel), basic SEO setup (meta tags, sitemap.xml, robots.txt, llms.txt for AI discoverability)
- [x] Task 2: Build the main landing page with emotional hero section, AI failure case studies (Chevrolet $1 car, Air Canada, DPD), and clear value proposition that speaks to pain
- [x] Task 3: Create interactive "What's Your AI Pain?" quiz that captures visitor struggles, shows them they're not alone (social proof), and collects email for follow-up
- [x] Task 4: Add analytics (Vercel Analytics, Plausible, or Google Analytics) to track quiz completions, button clicks, and understand visitor behavior
- [x] Task 5: Set up email capture flow with Resend/ConvertKit/Mailchimp and create a simple nurture sequence based on quiz answers

### Content & SEO (Traffic Generation)
- [x] Task 6: Create `/blog` with first 3 launch articles:
  - "The Complete List of AI Chatbot Failures (2025-2026)" — shareable, linkable asset
  - "How to Test AI Agents Before Deployment: A Practical Guide"
  - "Chevrolet's $1 Car Fiasco: Full Breakdown & Prevention Guide"
- [x] Task 7: Build AI Failures Database page (`/failures`) — curated, searchable, filterable list of real AI incidents (MAJOR link magnet)
- [x] Task 8: Create `/glossary` with 10+ AI safety terms for SEO long-tail traffic (hallucination, prompt injection, jailbreak, etc.)
- [x] Task 9: Add FAQ schema (FAQPage structured data) to homepage for rich snippets

### Social Proof & Trust
- [x] Task 10: Add social proof section to homepage:
  - Founder photo + 2-sentence credibility bio
  - "500+ AI failures analyzed" stat
  - Testimonial placeholders for early adopters
  - "Join X+ AI teams" dynamic counter from email list
- [x] Task 11: Create `/about` page with founder story, mission, and LinkedIn link

### Lead Magnets (Beyond Quiz)
- [x] Task 12: Create downloadable PDF "AI Agent Risk Checklist" as secondary lead magnet
- [x] Task 13: Add exit-intent popup offering checklist to abandoning visitors
- [x] Task 14: Add sticky CTA bar that appears on scroll

### Distribution & Launch (Pre-SEO Traffic)
- [x] Task 15: Prepare distribution assets for launch:
  - Product Hunt launch (schedule Tuesday 12:01 AM PT)
  - Hacker News "Show HN" post with AI failures database angle
  - Reddit posts for r/artificial, r/MachineLearning, r/devops, r/mlops
  - LinkedIn launch post from founder account
  - Twitter/X thread: "Top 10 AI Agent Failures That Cost Companies Millions"
- [x] Task 16: Pitch to 3 AI newsletters (TLDR AI, The Rundown, AI Breakfast)
- [x] Task 17: Cross-post blog articles to Dev.to and Hashnode

## Technical Details

### Stack (Phase 1 - Keep It Simple)
- **Framework**: Next.js 16+ (App Router) — hybrid deployment (static pages + serverless API routes)
- **Hosting**: Vercel (required for API routes — NOT static export)
- **Styling**: Tailwind CSS
- **Analytics**: Vercel Analytics (privacy-friendly)
- **Forms/Email**: Resend (contacts, welcome emails, sending)
- **Quiz**: Client-side React component, stores answers locally, submits to `/api/subscribe`

### Color Palette (Professional, Warm, Trustworthy)
**Primary - Forest Green** (Trust, Growth, Safety):
- `green-600`: `#059669` - Primary buttons, CTAs
- `green-700`: `#047857` - Hover states
- `green-50`: `#ecfdf5` - Light backgrounds

**Secondary - Warm Amber** (Energy, Attention, Warmth):
- `amber-500`: `#f59e0b` - Accents, highlights, warnings
- `amber-600`: `#d97706` - Hover states
- `amber-50`: `#fffbeb` - Subtle backgrounds

**Neutrals - Warm Grays** (Not cold/techy):
- `stone-900`: `#1c1917` - Primary text
- `stone-600`: `#57534e` - Secondary text
- `stone-100`: `#f5f5f4` - Page background
- `white`: `#ffffff` - Cards, sections

**Status Colors** (For Quiz Results):
- `red-500`: `#ef4444` - High Risk
- `amber-500`: `#f59e0b` - Medium Risk  
- `green-500`: `#22c55e` - Low Risk

**Tailwind Config:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
    },
  },
}
```

**Why This Palette:**
- 🌿 **Green = Safety/Trust** - "We protect your business"
- 🔶 **Amber = Attention** - Draws eye to CTAs without feeling cold
- 🪨 **Warm Stone grays** - Human, approachable (not sterile tech blues)
- ❌ **Avoids**: Blues, purples, neons (overused AI/tech aesthetic)

### AI Visibility (Still Works on Static)
- **llms.txt** - Static markdown file at `/llms.txt` (no server needed)
- **JSON-LD** - Embedded in HTML `<script type="application/ld+json">`
- **Rich meta tags** - OpenGraph, Twitter cards
- **Semantic content** - Authoritative articles that AI can cite

### Key Pages
1. **Homepage**: Hero → Pain Points → Case Studies → Social Proof → Quiz CTA → Contact
2. **Quiz Page**: 5-7 questions about AI agent struggles → Results → Email capture
3. **Thank You**: After quiz submission, show personalized insights + "we'll be in touch"
4. **Blog** (`/blog`): 3 launch articles, SEO content hub
5. **AI Failures Database** (`/failures`): Searchable, filterable list of real AI incidents
6. **Glossary** (`/glossary`): AI safety terminology (SEO long-tail)
7. **About** (`/about`): Founder story, mission, credibility
8. **Checklist** (`/checklist`): PDF lead magnet landing page

### Quiz Questions (Draft - Capture Pain Points)
1. "Are you currently using AI agents/chatbots in your business?" (Yes/No/Planning to)
2. "What's your biggest fear about AI agents?" (Multi-select: hallucinations, security, reputation, cost, don't know)
3. "Have you experienced an AI failure?" (Yes-describe/No/Not sure)
4. "What would make you feel confident deploying AI?" (Open text)
5. "How much is AI agent risk costing you?" (Time/Money/Reputation/All)
6. "What's your role?" (Founder/CTO/Developer/Manager/Other)
7. "Email to get your personalized risk report"

### What We Learn From Phase 1
- **Which pain points resonate most** (track quiz answer distribution)
- **What language visitors use** (open text answers = copywriting gold)
- **Conversion rate** (quiz start → completion → email)
- **Traffic sources** (where do visitors come from)
- **Bounce rate** (is the message landing?)

---

## SEO & Content Strategy

### Target Keywords
| Priority | Keyword | Intent |
|----------|---------|--------|
| Primary | "AI agent testing" | Commercial |
| Primary | "AI chatbot failures" | Informational |
| Secondary | "LLM safety testing" | Commercial |
| Secondary | "AI hallucination prevention" | Informational |
| Long-tail | "how to test AI agents before deployment" | Informational |
| Long-tail | "AI agent security checklist" | Transactional |

### Content Architecture
- **Pillar Page**: Homepage (AI agent testing/safety)
- **Cluster Content**: Blog posts, glossary terms, case studies
- **Link Magnet**: AI Failures Database (unique, citable resource)

### Structured Data (Schema Markup)
- `Organization` - Company info
- `FAQPage` - Homepage FAQs for rich snippets
- `Article` - Blog posts
- `HowTo` - Testing guides
- `ItemList` - AI failures database

---

## Distribution Strategy (Week 1-4)

### Launch Week Checklist
| Day | Channel | Action |
|-----|---------|--------|
| Day 1 | Twitter/X | AI failures thread (10 tweets) |
| Day 1 | LinkedIn | Founder launch post |
| Day 2 | Product Hunt | Launch submission |
| Day 2 | Indie Hackers | Build story + link |
| Day 3 | Hacker News | "Show HN" failures database |
| Day 3 | Reddit | r/artificial post |
| Day 4 | Dev.to | Cross-post first blog article |
| Day 5 | Newsletter pitch | Email TLDR AI, The Rundown |

### Ongoing Distribution (Weekly)
- 2 LinkedIn posts from founder (insights, failures, tips)
- 1 Twitter thread on AI safety topic
- 2-3 Reddit comment engagements (add value, don't spam)
- 1 cross-posted blog article (Dev.to/Hashnode)

### Communities to Engage
| Platform | Community | Approach |
|----------|-----------|----------|
| Reddit | r/artificial, r/mlops, r/devops | Value-first comments |
| Discord | MLOps Community, Hugging Face | Helpful answers |
| Slack | DataTalks.Club, AI Engineers | Share resources |
| LinkedIn | AI/ML groups | Thought leadership |

---

## Quick Wins (First 30 Days)

| Action | Time | Impact |
|--------|------|--------|
| Write "Complete List of AI Failures" blog | 4 hrs | 🔥 High |
| Post AI failure thread on Twitter/X | 1 hr | Medium |
| Add founder photo + bio to homepage | 30 min | Medium |
| Submit to Indie Hackers with build story | 1 hr | Medium |
| Create 1-page PDF checklist | 2 hrs | 🔥 High |
| Engage in 3 Reddit threads | 2 hrs | Medium |
| Pitch to 1 AI newsletter | 1 hr | 🔥 High if accepted |

---

## Phase 2 (After Validation)
Once we have 100+ quiz completions and understand the market:
- ~~Upgrade to Vercel with API routes~~ ✅ DONE (moved from static export)
- Build MCP server for AI chat presence
- Create OpenAI GPT Action for GPT Store
- Add MCP-UI for visual presence in AI chats
- Implement A/B testing for optimization
- Launch paid services based on validated pain points
