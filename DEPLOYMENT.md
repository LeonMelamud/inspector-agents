# Deployment Guide — Vercel

InspectAgents deploys to **Vercel** (free Hobby tier). The site uses API routes (`/api/subscribe`) so static export is not supported.

## Prerequisites

- GitHub account with the repo pushed
- Vercel account (sign up free at [vercel.com](https://vercel.com) with GitHub)
- Domain DNS access (Cloudflare, Namecheap, etc.)

## Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `inspector-agents` repository
3. Vercel auto-detects Next.js — no build settings needed
4. Click **Deploy**

Every push to `main` auto-deploys. Pull requests get preview URLs.

## Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes (for email) | Get from [resend.com](https://resend.com) (free: 3K emails/month) |
| `RESEND_AUDIENCE_ID` | Yes (for email) | Create an audience in Resend dashboard |
| `N8N_WEBHOOK_URL` | Optional | n8n webhook (takes priority over Resend if set) |
| `CONVERTKIT_API_KEY` | Optional | ConvertKit alternative |
| `CONVERTKIT_FORM_ID` | Optional | ConvertKit form ID |

**Provider priority:** n8n > Resend > ConvertKit (auto-detected).

The site works without any email env vars — the quiz and pages load fine, but email capture silently fails.

## Custom Domain (Cloudflare DNS)

1. In **Vercel Dashboard → Settings → Domains**, add `inspectagents.com`
2. Select **Connect to an environment → Production** (NOT "Redirect to Another Domain")
3. In **Cloudflare DNS**, add:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `76.76.21.21` | DNS only (gray cloud) |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only (gray cloud) |

4. In **Cloudflare SSL/TLS**, set mode to **Full (strict)**
5. Wait 1-5 minutes for DNS propagation + SSL provisioning

**Important:** Use "DNS only" (gray cloud), not "Proxied" (orange cloud). Vercel handles SSL — Cloudflare proxy causes conflicts.

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Production Build (Local Test)

```bash
npm run build      # Builds static pages + serverless functions
npm run start      # Serves at http://localhost:3000
```

## Verify Deployment

- [ ] Homepage loads at custom domain
- [ ] Quiz completes all 3 steps + submits email
- [ ] `/api/subscribe/` returns 200 (not 405)
- [ ] Check Resend dashboard for new contact
- [ ] All pages load: `/failures`, `/blog`, `/checklist`, `/glossary`, `/about`
- [ ] Mobile responsive on all pages
- [ ] HTTPS works (green lock)

## Troubleshooting

### 405 Method Not Allowed on `/api/subscribe`
The config has `trailingSlash: true`. All fetch calls must use `/api/subscribe/` (with trailing slash). Without it, Next.js 308-redirects the POST, which drops the request body.

### Email not sending
Check Vercel logs (Dashboard → Deployments → Functions tab). Likely cause: missing `RESEND_API_KEY` env var.

### SSL redirect loop
Set Cloudflare SSL mode to **Full (strict)** and use **DNS only** (gray cloud) proxy mode.

### Rate limited
The API allows 3 requests per 5 minutes per IP. Wait and retry.
