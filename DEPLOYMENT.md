# Deployment Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The static site will be in the `out/` directory after building.

## Deploy to GitHub Pages

1. **Enable GitHub Pages in your repository:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` or `main` (depending on your setup)
   - Folder: `/` (root) or `/docs` if you move the `out/` contents there

2. **Build and deploy:**
   ```bash
   npm run build
   # Copy contents of out/ to your deployment location
   ```

3. **Using GitHub Actions (Recommended):**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

## Deploy to Vercel (Easiest)

1. **Connect repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel auto-detects Next.js

2. **No configuration needed!**
   - Vercel automatically builds and deploys
   - Every push to `main` triggers deployment
   - Pull requests get preview URLs

3. **Custom domain:**
   - Add domain in Vercel dashboard
   - Update DNS records as instructed

## Deploy to Netlify

1. **Connect repository:**
   - Go to [netlify.com](https://netlify.com)
   - Import your repository

2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `out`

3. **Deploy:**
   - Netlify automatically deploys on push

## Environment Variables

For production, you may want to set:

```env
NEXT_PUBLIC_SITE_URL=https://inspectagents.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (if using Google Analytics)
```

## Custom Domain Setup

1. **Update `next.config.ts`** (if needed):
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     basePath: process.env.BASE_PATH || '',
     // For GitHub Pages with custom domain, basePath should be ''
   };
   ```

2. **Add CNAME file** to `public/`:
   ```
   inspectagents.com
   ```

3. **Configure DNS:**
   - For Vercel/Netlify: Use their provided DNS records
   - For GitHub Pages: 
     ```
     CNAME: inspectagents.com → yourusername.github.io
     ```

## Testing Production Build Locally

```bash
npm run build

# Serve the out/ directory
npx serve out

# Or use any static server
python3 -m http.server 8000 -d out
```

## Troubleshooting

### Images not loading
- Ensure `unoptimized: true` is in `next.config.ts`
- Use relative paths for images in `public/`

### 404 on routes
- Static export doesn't support dynamic routes without fallback
- Ensure all routes are pre-rendered

### CSS not loading
- Check that `tailwind.config.ts` content paths are correct
- Verify `globals.css` is imported in `layout.tsx`

## Post-Deployment Checklist

- [ ] Site loads at your domain
- [ ] All pages accessible
- [ ] Meta tags visible in browser inspector
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] `llms.txt` accessible at `/llms.txt`
- [ ] Submit sitemap to Google Search Console
- [ ] Test on mobile devices
- [ ] Check page speed with Lighthouse
