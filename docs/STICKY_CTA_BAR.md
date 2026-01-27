# Sticky CTA Bar Documentation

## Overview

The **Sticky CTA Bar** is a persistent call-to-action banner that slides up from the bottom of the page after users scroll past a certain threshold (default: 400px). It provides quick access to key conversion points (quiz and checklist) while users are engaged with content.

## Features

- ✅ **Scroll-triggered** - Appears only after user scrolls ~400px (shows engagement)
- ✅ **Dismissible** - Users can close it, stays hidden for 24 hours via localStorage
- ✅ **Dual CTAs** - Primary (quiz) and secondary (checklist) options
- ✅ **Mobile responsive** - Stacks buttons on small screens
- ✅ **Analytics tracking** - Tracks shows, clicks, and dismissals
- ✅ **Page exclusions** - Doesn't show on quiz/thank-you/download pages
- ✅ **Non-intrusive** - Slides in smoothly, doesn't block content

## How It Works

### Trigger Behavior

1. **Initial State**: Bar is hidden below viewport
2. **User scrolls >400px**: Bar slides up from bottom with smooth animation
3. **Analytics event fired**: `sticky_cta_bar_shown` tracked on first appearance
4. **User can**:
   - Click primary CTA (Take Quiz) → navigates to `/quiz`
   - Click secondary CTA (Get Checklist) → navigates to `/checklist`
   - Dismiss with X button → hides for 24 hours

### Persistence Logic

- **Dismiss duration**: 24 hours (configurable via `DISMISS_DURATION_HOURS`)
- **Storage key**: `stickyBarDismissed:v1` in localStorage
- **Behavior on return**: If user dismissed <24hrs ago, bar stays hidden
- **After 24hrs**: Bar reappears if user scrolls past threshold

### Page Exclusions

Bar does NOT appear on:
- `/quiz` - User is already taking the quiz
- `/quiz/thank-you` - User just completed quiz
- `/checklist/download` - User is already on download page

## Implementation

### Component Location

- **Component**: `src/components/StickyCtaBar.tsx`
- **Hook**: `src/hooks/useScrollPosition.ts`
- **Integrated in**: `src/app/layout.tsx` (global)

### Usage

```tsx
import { StickyCtaBar } from '@/components/StickyCtaBar';

// Default configuration (recommended)
<StickyCtaBar />

// Custom configuration
<StickyCtaBar
  threshold={600}  // Show after 600px scroll
  message="Protect your AI from failures"
  ctaText="Start Quiz →"
  ctaLink="/quiz"
  secondaryCtaText="Download Guide"
  secondaryCtaLink="/checklist"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `threshold` | number | 400 | Pixels scrolled before bar appears |
| `message` | string | "Don't let AI destroy..." | Main headline text |
| `ctaText` | string | "Take 2-Min Quiz →" | Primary button text |
| `ctaLink` | string | "/quiz" | Primary button destination |
| `secondaryCtaText` | string | "Get Free Checklist" | Secondary button text |
| `secondaryCtaLink` | string | "/checklist" | Secondary button destination |

## Analytics Events

### Events Tracked

1. **sticky_cta_bar_shown**
   - Fired: When bar first becomes visible after scroll
   - Properties: `{ scrollY, page }`
   - Used for: Measuring reach and scroll engagement

2. **sticky_cta_bar_primary_click**
   - Fired: User clicks primary CTA (quiz button)
   - Properties: `{ cta, destination, page }`
   - Used for: Measuring quiz conversions from sticky bar

3. **sticky_cta_bar_secondary_click**
   - Fired: User clicks secondary CTA (checklist button)
   - Properties: `{ cta, destination, page }`
   - Used for: Measuring checklist conversions from sticky bar

4. **sticky_cta_bar_dismissed**
   - Fired: User clicks dismiss (X) button
   - Properties: `{ page }`
   - Used for: Understanding dismissal rates

### Conversion Funnel

```
Page View
   ↓
Scroll >400px → sticky_cta_bar_shown
   ↓
   ├─→ Click Primary → sticky_cta_bar_primary_click → Quiz Started
   ├─→ Click Secondary → sticky_cta_bar_secondary_click → Checklist View
   └─→ Dismiss → sticky_cta_bar_dismissed
```

### Recommended Metrics

| Metric | Calculation | Target |
|--------|-------------|--------|
| **Show Rate** | Shows / Page Views | 60%+ (most users scroll) |
| **Primary CTR** | Primary Clicks / Shows | 3-5% |
| **Secondary CTR** | Secondary Clicks / Shows | 2-4% |
| **Total CTR** | (Primary + Secondary) / Shows | 5-9% |
| **Dismiss Rate** | Dismisses / Shows | <50% |

## Design Specifications

### Colors

- **Background**: `bg-gradient-to-r from-green-600 to-green-700`
- **Border**: `border-t-4 border-green-500`
- **Primary CTA**: White bg, green-700 text (high contrast)
- **Secondary CTA**: Green-800 bg, white text (subtle)
- **Text**: White for headline, green-100 for subtext

### Layout

- **Max width**: 7xl container (1280px)
- **Padding**: 4px vertical (sm: 16px), 16px horizontal
- **Shadow**: `shadow-2xl` for depth
- **Animation**: `translate-y` with 300ms transition

### Mobile Responsiveness

- **Desktop (≥640px)**: Horizontal layout, side-by-side CTAs
- **Mobile (<640px)**:
  - Stacked layout (column)
  - Full-width buttons
  - Icon hidden
  - Centered text
  - Reduced padding

## Customization

### Change Scroll Threshold

```tsx
// Show after 800px scroll (deeper engagement)
<StickyCtaBar threshold={800} />
```

### Change Dismiss Duration

Edit `DISMISS_DURATION_HOURS` in `StickyCtaBar.tsx`:

```tsx
const DISMISS_DURATION_HOURS = 48; // Hide for 2 days
```

### Add More Exclusions

Edit `EXCLUDED_PATHS` in `StickyCtaBar.tsx`:

```tsx
const EXCLUDED_PATHS = [
  '/quiz',
  '/quiz/thank-you',
  '/checklist/download',
  '/about',  // Add new exclusion
];
```

### Change CTAs Based on Page

```tsx
// In specific page layout
import { StickyCtaBar } from '@/components/StickyCtaBar';

export default function BlogLayout({ children }) {
  return (
    <>
      {children}
      <StickyCtaBar
        message="Enjoyed this article?"
        ctaText="Read Next →"
        ctaLink="/blog"
      />
    </>
  );
}
```

## A/B Testing Ideas

1. **Scroll Threshold**: Test 300px vs 400px vs 600px
2. **Message Copy**: 
   - Fear-based: "Don't let AI destroy your business"
   - Benefit: "Join 250+ protected teams"
   - Urgency: "Test your AI in 2 minutes"
3. **CTA Text**:
   - Direct: "Take Quiz"
   - Benefit: "Get Risk Report"
   - Social proof: "Join 250+ Teams"
4. **Visual Style**:
   - Green gradient (current)
   - Solid amber (attention-grabbing)
   - White with border (minimal)
5. **CTA Count**: Single CTA vs dual CTAs

## Best Practices

### ✅ Do

- Keep message concise (1-2 lines max)
- Use action-oriented CTA text
- Show after meaningful scroll (proves engagement)
- Respect dismissals (don't reshow immediately)
- Track analytics to optimize
- Exclude from conversion pages

### ❌ Don't

- Show before user scrolls (feels pushy)
- Use more than 2 CTAs (causes decision paralysis)
- Make it too tall (blocks content)
- Show on quiz/thank-you pages (redundant)
- Ignore dismissals (annoys users)
- Use vague CTAs like "Click here"

## Troubleshooting

### Bar not appearing

1. Check scroll position: `console.log(window.scrollY)` - must be >400px
2. Check localStorage: Look for `stickyBarDismissed:v1` - may be dismissed
3. Check pathname: Ensure not on excluded page (`/quiz`, `/quiz/thank-you`, `/checklist/download`)
4. Check browser console for errors

### Bar appearing too soon/late

Adjust `threshold` prop:
```tsx
<StickyCtaBar threshold={300} /> // Appears sooner
<StickyCtaBar threshold={600} /> // Appears later
```

### Want to reset dismiss state

Clear localStorage:
```javascript
localStorage.removeItem('stickyBarDismissed:v1');
```

### Bar blocking content

Ensure your page layout has enough bottom padding:
```css
/* Add to page wrapper */
.page-content {
  padding-bottom: 100px; /* Space for sticky bar */
}
```

## Relation to Other CTAs

### Sticky Bar vs Exit Intent Popup

| Feature | Sticky Bar | Exit Popup |
|---------|-----------|------------|
| **Trigger** | Scroll engagement | Exit intent / 20sec |
| **Visibility** | Persistent after scroll | One-time modal |
| **Intrusiveness** | Low (bottom bar) | High (full overlay) |
| **Dismiss** | 24 hours | 7 days |
| **Primary Goal** | Ongoing conversion | Last-chance capture |
| **Best For** | Engaged readers | Abandoning visitors |

### Recommended Strategy

1. **First visit**: Exit popup (captures abandoners)
2. **Engaged users**: Sticky bar (converts readers)
3. **Quiz/thank-you**: Neither (avoid annoyance)
4. **Result**: Complementary conversion tools, not competing

## Future Enhancements

- [ ] A/B test different messages per page type
- [ ] Dynamic CTAs based on scroll depth
- [ ] Personalization based on previous quiz answers
- [ ] Animation variations (slide vs fade)
- [ ] Position variants (top vs bottom)
- [ ] Auto-hide on scroll up (progressive behavior)
- [ ] Integration with user segmentation
- [ ] Countdown timer for limited offers

## Support

For questions or issues:
- Check analytics in Vercel Dashboard
- Review browser console for errors
- Test in incognito mode (fresh state)
- Verify localStorage permissions
