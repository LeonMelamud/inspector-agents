# Exit-Intent Popup Documentation

## Overview

The exit-intent popup is a conversion optimization feature that captures abandoning visitors by offering the AI Risk Checklist as they attempt to leave the site.

## How It Works

### Trigger Mechanisms

**Desktop (Primary):**
- Detects when mouse cursor moves toward the top of the viewport (toward address bar/tabs)
- Triggers when cursor leaves viewport boundary within 10px of top edge
- 200ms delay to prevent false positives

**Mobile (Fallback):**
- Timer-based trigger after 20 seconds on page
- Necessary because exit-intent detection doesn't work on mobile/touch devices

### Frequency Capping

- Shows **maximum once per 7 days** per visitor
- Uses localStorage to track dismissal with versioned key: `exitPopupDismissed:v1`
- After dismissal, won't show again for 7 days
- If localStorage unavailable (private browsing), popup still shows but won't persist dismissal

### Page Exclusions

Popup does NOT appear on:
- `/checklist` - Already on checklist landing page
- `/checklist/download` - Already viewing/downloading checklist
- `/quiz/thank-you` - Just completed quiz, already engaged

## Components

### `ExitIntentPopup` Component
**Location:** `src/components/ExitIntentPopup.tsx`

**Features:**
- Client-side React component
- Responsive design (mobile-optimized)
- Accessible (ARIA labels, keyboard navigation)
- Animated entrance (fade + slide-up)
- Click-outside-to-close
- Analytics tracking for all interactions

**Analytics Events:**
- `exit_intent_popup_shown` - Popup displayed (includes trigger type: mouse_exit or mobile_timer)
- `exit_intent_popup_converted` - User clicked CTA to get checklist
- `exit_intent_popup_dismissed` - User closed popup via X button
- `exit_intent_popup_declined` - User clicked "No thanks" decline link

### `useExitIntent` Hook
**Location:** `src/hooks/useExitIntent.ts`

**Purpose:** Reusable exit-intent detection logic

**Options:**
- `threshold` - Pixels from top to trigger (default: 10)
- `delay` - Delay before showing (ms, default: 200)
- `onExitIntent` - Callback when triggered
- `enabled` - Enable/disable detection

**How It Works:**
1. Listens for `mouseleave` event on document
2. Checks if `clientY <= threshold` and `relatedTarget === null`
3. Waits `delay` milliseconds
4. Calls `onExitIntent` callback
5. Sets `triggered` state to prevent re-triggering

## Content

### Headline
"Wait! Get Your Free AI Risk Checklist"

### Value Proposition
"Before you go, grab our 50-point AI testing checklist used by 250+ teams to prevent AI failures."

### Benefits Highlighted
- Covers 8 critical risk areas
- Prevents Chevrolet-style disasters
- Takes 30 minutes for first pass
- 100% free, no signup required

### CTA
Primary: "Get Free Checklist →" (links to /checklist)
Secondary: "No thanks, I'll risk it" (dismisses)

## Design

### Visual Style
- White modal on dark backdrop (60% opacity, blurred)
- Green gradient icon with checkmark
- Max width: 28rem (448px)
- Padding: 1.5rem mobile, 2rem desktop
- Shadow: Large, elevated
- Border radius: 0.5rem

### Animation
- Backdrop: 300ms fade-in
- Modal: 400ms slide-up + fade-in
- Smooth, non-jarring entrance

### Colors (Per PRD)
- Background: White (#ffffff)
- Icon gradient: Green-500 to Green-600
- CTA button: Green-600 to Green-700 gradient
- Text: Stone-900 (headlines), Stone-600/700 (body)
- Decline link: Stone-500

### Accessibility
- Proper ARIA roles (`dialog`, `aria-modal="true"`)
- Labeled close button (`aria-label="Close popup"`)
- Semantic HTML (`h2` for title)
- Keyboard-navigable
- Focus management

## Implementation

### Integration
Added to root layout (`src/app/layout.tsx`):
```tsx
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

// In body, after children:
<ExitIntentPopup />
```

### Storage Schema
```typescript
// Key
'exitPopupDismissed:v1'

// Value (ISO 8601 timestamp)
'2026-01-24T20:53:00.000Z'

// Logic
if (Date.now() - new Date(value).getTime() < 7 days in ms) {
  // Don't show
}
```

## Testing

### Manual Testing Checklist

**Desktop:**
1. Visit homepage
2. Move mouse toward browser address bar
3. Popup should appear after brief delay
4. Click outside popup → should close
5. Click "Get Free Checklist" → navigate to /checklist
6. Return to homepage → popup should NOT reappear (dismissed)
7. Clear localStorage → popup should reappear

**Mobile:**
1. Visit homepage on mobile device
2. Wait 20 seconds
3. Popup should appear
4. Test responsive layout
5. Tap outside → should close
6. Verify CTA button is easily tappable

**Page Exclusions:**
1. Visit /checklist → popup should NOT appear
2. Visit /checklist/download → popup should NOT appear
3. Visit /quiz/thank-you → popup should NOT appear

### Analytics Verification

In Vercel Analytics dashboard, verify events:
- `exit_intent_popup_shown` (includes `trigger` property)
- `exit_intent_popup_converted`
- `exit_intent_popup_dismissed`
- `exit_intent_popup_declined`
- `cta_clicked` (from trackCTAClick when CTA button clicked)

## Performance

### Impact
- Component: ~3KB gzipped
- Hook: ~1KB gzipped
- Zero impact until triggered (conditional rendering)
- Lazy-loaded with main bundle (static site)

### Optimization
- Uses `usePathname` client hook (Next.js App Router)
- Conditional rendering prevents unnecessary DOM
- Animations use CSS (GPU-accelerated)
- No external dependencies beyond Next.js/React

## Best Practices (Per popup-cro Skill)

✅ **Timing:** Exit-intent is last-chance offer, non-intrusive  
✅ **Value:** Clear, immediate benefit (free 50-point checklist)  
✅ **Respect:** Easy to dismiss, remembers preference for 7 days  
✅ **Mobile:** Uses time-based fallback (20s)  
✅ **Frequency:** Once per 7 days max  
✅ **Exclusions:** Smart targeting (not on checklist pages)  
✅ **Design:** Professional, on-brand, accessible  
✅ **Copy:** Benefit-driven, social proof, no guilt tactics  
✅ **Analytics:** Comprehensive event tracking  

## Future Enhancements

**Potential improvements:**
- A/B test different headlines ("Wait!" vs. "Before You Go...")
- Test different offers (checklist vs. quiz vs. email course)
- Segment by traffic source (different popup for paid vs. organic)
- Add countdown timer for urgency
- Personalize based on pages visited
- Test different timing (immediate exit vs. 2nd exit attempt)
- Add animation on decline link hover

## Troubleshooting

### Popup Not Showing

**Check:**
1. Not on excluded page (/checklist, /quiz/thank-you)
2. localStorage `exitPopupDismissed:v1` not set (or expired)
3. Waited 20+ seconds on mobile OR moved mouse to top on desktop
4. JavaScript enabled
5. Check browser console for errors

### Popup Shows Too Often

**Check:**
1. localStorage working (check browser privacy settings)
2. Not clearing cookies/storage between sessions
3. Version key matches (`v1`)

### Analytics Not Tracking

**Check:**
1. Vercel Analytics installed and configured
2. Check Network tab for analytics requests
3. Verify events in Vercel dashboard (may take few minutes to appear)

## Related Files

- Component: `src/components/ExitIntentPopup.tsx`
- Hook: `src/hooks/useExitIntent.ts`
- Analytics: `src/lib/analytics.ts`
- Layout: `src/app/layout.tsx`
- Checklist: `src/app/checklist/page.tsx`

## References

- Popup CRO Skill: `skills/popup-cro/SKILL.md`
- Vercel React Best Practices: `skills/vercel-react-best-practices/`
- PRD Task 13: Exit-intent popup offering checklist
