# InspectAgents - Next.js Static Site

This is the InspectAgents.com website built with Next.js 15, configured for static export to GitHub Pages or Vercel.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure email service (optional for local development):
```bash
cp .env.example .env.local
# Edit .env.local and add your Resend or ConvertKit API keys
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
```bash
npm run build
```

The static site will be exported to the `out/` directory.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with SEO meta tags
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   └── lib/
│       ├── config.ts         # Site configuration
│       └── seo.ts            # SEO utility functions
├── public/
│   ├── robots.txt            # Search engine directives
│   ├── sitemap.xml           # Site structure for SEO
│   └── llms.txt              # AI/LLM discoverability
├── next.config.ts            # Next.js configuration (static export)
├── tailwind.config.ts        # Tailwind with custom color palette
└── package.json
```

## Features

- ✅ Next.js 15 with static export (`output: 'export'`)
- ✅ TypeScript for type safety
- ✅ Tailwind CSS with custom green/amber color palette
- ✅ Interactive quiz with risk assessment
- ✅ Email capture with automated nurture sequences
- ✅ Analytics tracking with Vercel Analytics
- ✅ SEO optimization:
  - Meta tags (title, description, keywords)
  - Open Graph tags for social sharing
  - Twitter Card tags
  - Schema.org JSON-LD structured data
  - Sitemap.xml
  - Robots.txt (AI-friendly)
  - llms.txt for AI discoverability
- ✅ Responsive design

## Email Setup

The quiz captures emails and sends personalized nurture sequences based on risk level.

**Quick Start:**
1. Choose your provider (Resend or ConvertKit)
2. Copy `.env.example` to `.env.local`
3. Add your API keys
4. Deploy to Vercel (environment variables automatically work)

**Detailed Guide:** See [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md) for complete setup instructions, nurture sequence configuration, and troubleshooting.

## Deployment

### GitHub Pages

1. Build the site:
```bash
npm run build
```

2. The static files in `out/` can be deployed to GitHub Pages.

### Vercel

1. Connect your repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. No additional configuration needed

## SEO Files

- **robots.txt**: Allows all crawlers including AI bots (GPTBot, Claude-Web, etc.)
- **sitemap.xml**: Lists all pages for search engines
- **llms.txt**: Markdown file optimized for AI/LLM consumption with site context

## Color Palette

- **Primary (Green)**: Trust, safety, growth
  - `primary-600`: #059669
  - `primary-700`: #047857
  - `primary-50`: #ecfdf5

- **Accent (Amber)**: Energy, attention
  - `accent-500`: #f59e0b
  - `accent-600`: #d97706
  - `accent-50`: #fffbeb

- **Neutrals (Warm Stone)**: Professional, approachable
  - `stone-900`: #1c1917
  - `stone-600`: #57534e
  - `stone-100`: #f5f5f4

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Tailwind CSS](https://tailwindcss.com/docs)
