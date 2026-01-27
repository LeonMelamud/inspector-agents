# Analytics Implementation

## Overview

This project uses **Vercel Analytics** for tracking user behavior and measuring conversion metrics. Analytics tracking is implemented using a centralized utility system with custom event tracking for key user interactions.

## Installation

```bash
npm install @vercel/analytics
```

## Setup

The Analytics component is integrated in the root layout ([src/app/layout.tsx](../src/app/layout.tsx)):

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Core Utilities

### Analytics Functions ([src/lib/analytics.ts](../src/lib/analytics.ts))

Centralized tracking functions for all events:

- **trackQuizEvent**: Quiz interactions
  - `started(location)` - Quiz initiated
  - `stepCompleted(stepNumber, stepName, answer)` - Step completed
  - `abandoned(stepNumber, timeSpent)` - Quiz abandoned
  - `completed(answers, timeSpent)` - Quiz submitted

- **trackCTAClick(buttonText, location, destination)** - CTA button clicks

- **trackNavigation**:
  - `internalLink(linkText, destination)` - Internal navigation
  - `externalLink(linkText, destination)` - External links
  - `scrollDepth(depth, page)` - Scroll milestones (25%, 50%, 75%, 100%)

- **trackForm**:
  - `started(formName)` - Form interaction started
  - `submitted(formName, success)` - Form submitted
  - `error(formName, errorMessage)` - Form error

- **trackEmailCapture**:
  - `submitted(source)` - Email captured
  - `newsletterSignup(location)` - Newsletter signup

- **trackEngagement**:
  - `timeOnPage(page, seconds)` - Time spent on page
  - `mediaInteraction(mediaType, action, mediaId)` - Media interactions

### Custom Hooks

#### useScrollTracking ([src/hooks/useScrollTracking.ts](../src/hooks/useScrollTracking.ts))

Automatically tracks scroll depth milestones:

```tsx
import { useScrollTracking } from '@/hooks/useScrollTracking';

function MyPage() {
  useScrollTracking('homepage'); // Tracks 25%, 50%, 75%, 100% scroll
  return <div>...</div>;
}
```

#### useTimeTracking ([src/hooks/useTimeTracking.ts](../src/hooks/useTimeTracking.ts))

Tracks time spent on page (fires on tab switch or page leave):

```tsx
import { useTimeTracking } from '@/hooks/useTimeTracking';

function MyPage() {
  useTimeTracking('pricing'); // Reports time when user leaves
  return <div>...</div>;
}
```

### Components

#### TrackedLink ([src/components/TrackedLink.tsx](../src/components/TrackedLink.tsx))

Link component with automatic click tracking:

```tsx
import { TrackedLink } from '@/components/TrackedLink';

<TrackedLink
  href="/quiz"
  trackingLabel="Take the Quiz"
  location="hero"
  type="cta" // or "internal" or "external"
  className="btn-primary"
>
  Take the Quiz →
</TrackedLink>
```

## Events Being Tracked

### Quiz Flow

| Event | Properties | Trigger |
|-------|-----------|---------|
| `quiz_started` | `location` | User starts quiz |
| `quiz_step_completed` | `step_number`, `step_name`, `answer` | Each question answered |
| `quiz_abandoned` | `step_number`, `time_spent_seconds` | User leaves before completion |
| `quiz_completed` | `total_time_seconds`, `has_email`, `experienced_failure`, `role` | Quiz submitted |

### CTAs & Navigation

| Event | Properties | Trigger |
|-------|-----------|---------|
| `cta_clicked` | `button_text`, `location`, `destination` | CTA button clicked |
| `internal_link_clicked` | `link_text`, `destination` | Internal link clicked |
| `external_link_clicked` | `link_text`, `destination` | External link clicked |
| `scroll_depth` | `depth_percent`, `page` | User scrolls to milestone |

### Sticky CTA Bar

| Event | Properties | Trigger |
|-------|-----------|---------|
| `sticky_cta_bar_shown` | `scrollY`, `page` | Bar appears after scroll threshold |
| `sticky_cta_bar_primary_click` | `cta`, `destination`, `page` | Primary CTA (quiz) clicked |
| `sticky_cta_bar_secondary_click` | `cta`, `destination`, `page` | Secondary CTA (checklist) clicked |
| `sticky_cta_bar_dismissed` | `page` | User dismisses bar |

### Exit Intent Popup

| Event | Properties | Trigger |
|-------|-----------|---------|
| `exit_intent_popup_shown` | `trigger` | Popup shown (mouse_exit or mobile_timer) |
| `exit_intent_popup_converted` | - | User clicks checklist CTA |
| `exit_intent_popup_declined` | - | User clicks "No thanks" |
| `exit_intent_popup_dismissed` | - | User closes popup |

### Email Capture

| Event | Properties | Trigger |
|-------|-----------|---------|
| `email_captured` | `source` | Email submitted |
| `newsletter_signup` | `location` | Newsletter signup |

### Engagement

| Event | Properties | Trigger |
|-------|-----------|---------|
| `time_on_page` | `page`, `seconds` | User leaves page (>5s) |

## Key Metrics Tracked

### Conversion Funnel

1. **Homepage visits** → Auto-tracked pageviews
2. **Quiz started** → `quiz_started` event
3. **Quiz progress** → `quiz_step_completed` events
4. **Quiz completion** → `quiz_completed` event
5. **Email captured** → `email_captured` event

### Engagement Metrics

- **Scroll depth**: How far users scroll on each page
- **Time on page**: How long users spend reading content
- **CTA clicks**: Which CTAs are most effective
- **Quiz abandonment**: Where users drop off in the quiz

### User Behavior

- **Most common quiz answers**: Track answer distribution
- **Failure experiences**: % of users who've had AI failures
- **Role distribution**: Who's visiting (founders, CTOs, developers)
- **Risk levels**: Distribution of high/medium/low risk assessments

## Implementation Examples

### Homepage ([src/app/page.tsx](../src/app/page.tsx))

```tsx
import { HomePageClient, TrackedLink } from '@/components/HomePageClient';

export default function Home() {
  return (
    <HomePageClient> {/* Enables scroll & time tracking */}
      <main>
        <TrackedLink
          href="/quiz"
          trackingLabel="Take the Free AI Risk Quiz"
          location="hero"
        >
          Take the Quiz →
        </TrackedLink>
      </main>
    </HomePageClient>
  );
}
```

### Quiz Page ([src/app/quiz/page.tsx](../src/app/quiz/page.tsx))

```tsx
import { trackQuizEvent } from '@/lib/analytics';
import { useScrollTracking } from '@/hooks/useScrollTracking';
import { useTimeTracking } from '@/hooks/useTimeTracking';

export default function QuizPage() {
  useScrollTracking('quiz');
  useTimeTracking('quiz');
  
  useEffect(() => {
    trackQuizEvent.started('direct');
  }, []);
  
  const handleNext = () => {
    trackQuizEvent.stepCompleted(step, questionId, answer);
    // ...
  };
  
  const handleSubmit = () => {
    trackQuizEvent.completed(answers, timeSpent);
    // ...
  };
}
```

### Thank You Page ([src/app/quiz/thank-you/page.tsx](../src/app/quiz/thank-you/page.tsx))

```tsx
import { trackEmailCapture } from '@/lib/analytics';
import { useTimeTracking } from '@/hooks/useTimeTracking';

export default function ThankYouPage() {
  useTimeTracking('thank-you');
  
  useEffect(() => {
    if (email) {
      trackEmailCapture.submitted('quiz');
    }
  }, []);
}
```

## Vercel Dashboard

Once deployed to Vercel:

1. **View Analytics**: Go to your project → Analytics tab
2. **Real-time Events**: See custom events in the Events section
3. **Conversion Tracking**: Set up conversion goals based on events
4. **Funnels**: Create funnels to track quiz completion rate

### Recommended Funnels

1. **Quiz Completion**:
   - Page: `/quiz` → Event: `quiz_started` → Event: `quiz_completed`

2. **Email Capture**:
   - Page: `/` → Page: `/quiz` → Event: `email_captured`

3. **Engagement**:
   - Event: `scroll_depth` (depth_percent: 75) → Event: `cta_clicked`

## Privacy & Compliance

- **No PII in events**: Email addresses are only submitted through forms, not tracked in analytics properties
- **Vercel Analytics**: Privacy-friendly, GDPR compliant
- **No cookies**: Vercel Analytics doesn't use cookies
- **Opt-out**: Respects Do Not Track headers

## Testing

To verify events are firing:

1. **Development**: Check browser console for event logs
2. **Vercel Dashboard**: View real-time events after deployment
3. **Debug Mode**: Enable Vercel Analytics debug mode

```tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics debug={true} />
```

## Future Enhancements

- [ ] Add A/B testing with Vercel's built-in experiments
- [ ] Track blog post reading time and engagement
- [ ] Monitor failures database interactions
- [ ] Add conversion tracking for paid features (Phase 2)
- [ ] Implement custom dashboards for key metrics

## Support

For questions about the analytics implementation:
- See [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- Review tracking plan in this document
- Check [src/lib/analytics.ts](../src/lib/analytics.ts) for event definitions
