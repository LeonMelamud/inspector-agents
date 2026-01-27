# Email Capture & Nurture Sequence Setup Guide

This guide explains how to set up email capture for the InspectAgents quiz and configure the automated nurture sequence based on quiz answers.

## Overview

The email system captures quiz responses and automatically segments users based on:
- **Risk Level** (Low/Medium/High) - calculated from quiz answers
- **Pain Points** - biggest fears and concerns
- **Role** - job function
- **Experience** - whether they've experienced AI failures

Users receive personalized welcome emails based on their risk level, followed by a 5-day nurture sequence with relevant content.

## Architecture

```
Quiz Submission
    ↓
Calculate Risk Level (src/lib/email.ts)
    ↓
Extract Pain Points & Tags
    ↓
Submit to API (/api/subscribe/route.ts)
    ↓
Choose Provider (Resend or ConvertKit)
    ↓
Send Welcome Email (risk-level specific)
    ↓
Tag for Nurture Sequence
```

## Email Providers Supported

### Option 1: Resend (Recommended for Developers)

**Pros:**
- Developer-friendly API
- Built-in React email templates
- Great deliverability
- Simple pricing

**Setup:**

1. Create account at [resend.com](https://resend.com)
2. Get API key from dashboard
3. Create an audience for quiz subscribers
4. Add environment variables:

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxxxxxxxxxx
```

5. Verify your sending domain in Resend dashboard

**Testing:**
```bash
# Install Resend SDK
npm install resend

# Test email sending
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "resend",
    "email": "test@example.com",
    "riskLevel": "high",
    "quizAnswers": {
      "currentUsage": "yes",
      "biggestFears": ["hallucinations", "security"],
      "experiencedFailure": "yes",
      "confidenceFactors": "testing",
      "costImpact": ["time", "money"],
      "role": "CTO",
      "email": "test@example.com"
    },
    "topPainPoints": ["hallucinations", "security"]
  }'
```

### Option 2: ConvertKit (Recommended for Marketers)

**Pros:**
- Powerful automation builder
- Built-in landing pages
- Tag-based segmentation
- Email sequence management

**Setup:**

1. Create account at [convertkit.com](https://convertkit.com)
2. Create a form for quiz subscribers
3. Get API key and Form ID
4. Add environment variables:

```bash
# .env.local
CONVERTKIT_API_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
CONVERTKIT_FORM_ID=123456
```

5. Set up tags in ConvertKit:
   - `risk-high`, `risk-medium`, `risk-low`
   - `fear-hallucinations`, `fear-security`, `fear-reputation`, `fear-cost`, `fear-dont-know`
   - `usage-yes`, `usage-no`, `usage-planning`
   - `experienced-failure`
   - `role-cto`, `role-founder`, `role-developer`, etc.

6. Create custom fields:
   - `risk_level` (text)
   - `quiz_completed` (date)
   - `current_usage` (text)
   - `biggest_fears` (text)
   - `role` (text)

**Testing:**
```bash
# Test ConvertKit subscription
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "convertkit",
    "email": "test@example.com",
    "riskLevel": "medium",
    "quizAnswers": {...},
    "topPainPoints": ["security", "reputation"]
  }'
```

## Email Templates

Three risk-specific welcome emails are included:

### 1. WelcomeHighRisk.tsx
**Sent to:** Users with risk score ≥ 7
**Subject:** "🚨 Your AI Risk Report + Urgent Action Steps"
**Tone:** Urgent, action-oriented
**Content:**
- Immediate validation of concerns
- Top 3 urgent action steps
- Links to critical resources
- 5-day preview of what's coming

### 2. WelcomeMediumRisk.tsx
**Sent to:** Users with risk score 4-6
**Subject:** "⚠️ Your AI Risk Assessment + What to Do Next"
**Tone:** Helpful, encouraging
**Content:**
- Recognition of awareness
- 3-step action plan
- Learning resources
- Weekly email preview

### 3. WelcomeLowRisk.tsx
**Sent to:** Users with risk score < 4
**Subject:** "✅ Your AI Safety Checklist + Best Practices"
**Tone:** Supportive, educational
**Content:**
- Congratulations on good practices
- Advanced resources
- Industry trends
- Light touch nurture plan

## Risk Calculation Logic

Risk score is calculated in `src/lib/email.ts`:

```typescript
function calculateRiskLevel(answers: QuizAnswers): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Currently using (0-2 points)
  if (answers.currentUsage === 'yes') riskScore += 2;
  else if (answers.currentUsage === 'planning') riskScore += 1;

  // Experienced failure (0-3 points)
  if (answers.experiencedFailure === 'yes') riskScore += 3;
  else if (answers.experiencedFailure === 'not-sure') riskScore += 1;

  // Number of fears (0-3 points)
  if (answers.biggestFears.length >= 4) riskScore += 3;
  else if (answers.biggestFears.length >= 2) riskScore += 2;
  else if (answers.biggestFears.length >= 1) riskScore += 1;

  // Cost impact (0-2 points)
  if (answers.costImpact.includes('all')) riskScore += 2;
  else if (answers.costImpact.length >= 2) riskScore += 1;

  // Total: 0-10 points
  if (riskScore >= 7) return 'high';    // 7-10 points
  if (riskScore >= 4) return 'medium';  // 4-6 points
  return 'low';                          // 0-3 points
}
```

## Nurture Sequence Structure

### For High Risk Users:

**Day 1 (Immediate):** Welcome email with urgent actions
**Day 2:** "The #1 Cause of AI Failures (and How to Prevent It)"
**Day 3:** "Case Study: How One Company Avoided a $10M Mistake"
**Day 4:** "5-Minute AI Safety Audit You Can Do Today"
**Day 5:** "Emergency Response Plan for When AI Goes Wrong"

### For Medium Risk Users:

**Day 1 (Immediate):** Welcome email with action plan
**Day 3:** "Real AI Failures: What Went Wrong & Prevention Strategies"
**Day 5:** "Quick Wins for AI Safety"
**Day 7:** "Common Mistakes Teams Make (& How to Avoid Them)"
**Day 10:** "Industry Best Practices from AI Leaders"

### For Low Risk Users:

**Day 1 (Immediate):** Welcome email with resources
**Week 1:** "Weekly Roundup of New AI Incidents"
**Week 2:** "Advanced Testing Techniques & Edge Cases"
**Week 3:** "Industry Trends & Emerging Risks"
**Week 4:** "Early Access to New Tools"

## Setting Up Nurture Sequences

### In Resend:

1. Use Resend's automation features (if available)
2. Or integrate with external automation (Zapier, Make)
3. Tag contacts based on risk level
4. Schedule follow-up emails via API

### In ConvertKit:

1. Go to **Automations** → **New Automation**
2. Create 3 sequences (one per risk level):
   - "High Risk Nurture"
   - "Medium Risk Nurture"
   - "Low Risk Nurture"

3. **Trigger:** Tag added → `risk-high` (or medium/low)

4. **Actions:**
   - Wait 1 day → Send email "Day 2: #1 Cause"
   - Wait 1 day → Send email "Day 3: Case Study"
   - Wait 1 day → Send email "Day 4: 5-Min Audit"
   - Wait 1 day → Send email "Day 5: Emergency Plan"

5. **Email Content:** Write in ConvertKit's email builder using the structure from `/src/emails/` templates

6. **Advanced:** Add conditional splits based on engagement:
   - If opened → Continue sequence
   - If clicked link → Tag as "highly engaged"
   - If no opens after 3 emails → Tag as "re-engagement needed"

## Tags & Segmentation

All quiz submissions are tagged with:

```typescript
// Risk level
tags: ['risk-high'] // or 'risk-medium', 'risk-low'

// Usage status
tags: ['usage-yes'] // or 'usage-no', 'usage-planning'

// Role
tags: ['role-cto'] // e.g., 'role-founder', 'role-developer'

// Pain points
tags: ['fear-hallucinations', 'fear-security'] // etc.

// Experience
tags: ['experienced-failure'] // if they answered yes

// Cost impact
tags: ['cost-time', 'cost-money', 'cost-reputation']
```

Use these tags to:
- Segment for targeted campaigns
- Personalize future emails
- Identify high-value prospects
- Track common pain points

## Testing the Flow

### Local Development:

1. Start development server:
```bash
npm run dev
```

2. Complete quiz at `http://localhost:3000/quiz`

3. Check console logs for API calls

4. Verify email sent (check provider dashboard)

### Production Testing:

1. Deploy to Vercel
2. Set environment variables in Vercel dashboard
3. Test with real email address
4. Verify deliverability

### Test Checklist:

- [ ] Quiz completion triggers API call
- [ ] Risk level calculated correctly
- [ ] Email sent to correct address
- [ ] Welcome email template matches risk level
- [ ] Tags applied in email provider
- [ ] User added to correct nurture sequence
- [ ] Unsubscribe link works
- [ ] Email deliverability (not in spam)

## Analytics & Tracking

Track these metrics:

**Quiz Metrics:**
- Quiz starts
- Quiz completions
- Email capture rate
- Average risk score

**Email Metrics:**
- Welcome email open rate (by risk level)
- Click-through rate to resources
- Conversion to download checklist
- Nurture sequence engagement

**Segmentation Insights:**
- Most common pain points
- Risk level distribution
- Role breakdown
- Failure experience rate

## Troubleshooting

### Email not sending:

1. Check environment variables are set
2. Verify API keys are valid
3. Check domain verification (Resend)
4. Review API logs in provider dashboard
5. Test API endpoint directly with curl

### Wrong template sent:

1. Verify risk calculation logic
2. Check template import paths in `/api/subscribe/route.ts`
3. Test `calculateRiskLevel()` function with sample data

### Tags not applied:

1. Verify tag names match provider settings
2. Check `getEmailTags()` function output
3. Review API response from provider

### Emails in spam:

1. Verify sending domain (SPF, DKIM, DMARC)
2. Warm up domain gradually
3. Improve email content (reduce links, add plain text)
4. Check spam testing tools (mail-tester.com)

## Next Steps

1. **Set up provider** (Resend or ConvertKit)
2. **Configure environment variables**
3. **Test email flow** with sample submission
4. **Create nurture sequences** in provider dashboard
5. **Write follow-up emails** (Day 2-5 content)
6. **Set up analytics** to track performance
7. **Monitor and optimize** based on engagement

## Support

For questions or issues:
- Review API logs in `/api/subscribe/route.ts`
- Check provider documentation
- Test with curl commands above
- Verify environment variables

---

**Ready to launch?** Complete the checklist above and start capturing leads with personalized nurture sequences! 🚀
