# Email System Quick Start Guide

## What Was Built

A complete email capture and nurture system that:
1. Automatically segments quiz takers by risk level (Low/Medium/High)
2. Sends personalized welcome emails based on their quiz answers
3. Tags users for targeted follow-up campaigns
4. Works with both Resend and ConvertKit

## Files Created

### Core Infrastructure
- `src/lib/email.ts` - Email utilities and risk calculation
- `src/app/api/subscribe/route.ts` - API endpoint for email capture
- `src/emails/WelcomeHighRisk.tsx` - Email template for high-risk users
- `src/emails/WelcomeMediumRisk.tsx` - Email template for medium-risk users
- `src/emails/WelcomeLowRisk.tsx` - Email template for low-risk users

### Documentation
- `docs/EMAIL_SETUP.md` - Complete setup guide with testing instructions
- `.env.example` - Environment variable template

## How to Use

### For Local Development (Optional)

1. Choose your email provider (Resend or ConvertKit)
2. Copy `.env.example` to `.env.local`
3. Add your API keys
4. Test quiz at `http://localhost:3000/quiz`

### For Production (Vercel)

1. Deploy to Vercel
2. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` (for Resend)
   - OR `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID` (for ConvertKit)
3. Quiz emails will automatically send on completion

## Risk Level Calculation

Users are scored 0-10 points based on:
- **Current AI usage** (0-2 pts) - Using in production = highest risk
- **Experienced failures** (0-3 pts) - Past failures = high risk
- **Number of fears** (0-3 pts) - More concerns = higher awareness
- **Cost impact** (0-2 pts) - Multiple impacts = higher urgency

**Risk Levels:**
- **High** (7-10 pts): Urgent action needed
- **Medium** (4-6 pts): Plan your defense
- **Low** (0-3 pts): Stay vigilant

## Email Templates

### High Risk Email
- **Subject:** "🚨 Your AI Risk Report + Urgent Action Steps"
- **Tone:** Urgent, action-oriented
- **Content:** Top 3 urgent actions, critical resources, 5-day preview

### Medium Risk Email
- **Subject:** "⚠️ Your AI Risk Assessment + What to Do Next"
- **Tone:** Helpful, encouraging
- **Content:** 3-step action plan, learning resources, weekly preview

### Low Risk Email
- **Subject:** "✅ Your AI Safety Checklist + Best Practices"
- **Tone:** Supportive, educational
- **Content:** Advanced resources, industry trends, light nurture

## User Tagging

Every quiz submission is tagged with:
- Risk level: `risk-high`, `risk-medium`, `risk-low`
- Usage status: `usage-yes`, `usage-no`, `usage-planning`
- Role: `role-cto`, `role-founder`, `role-developer`, etc.
- Fears: `fear-hallucinations`, `fear-security`, `fear-reputation`, etc.
- Experience: `experienced-failure` (if yes)
- Cost impact: `cost-time`, `cost-money`, `cost-reputation`

Use these tags for targeted campaigns and pain point analysis.

## Next Steps: Build Nurture Sequences

### In ConvertKit (Recommended)

1. Go to **Automations** → **New Automation**
2. Create sequences for each risk level:
   - "High Risk Nurture" (5-day)
   - "Medium Risk Nurture" (weekly)
   - "Low Risk Nurture" (bi-weekly)

3. Set triggers based on tags:
   - Trigger: Tag added → `risk-high`
   - Actions: Wait → Send email → Wait → Send email...

### Email Content Outline (Day 2-5)

**High Risk Sequence:**
- Day 2: "The #1 Cause of AI Failures (and How to Prevent It)"
- Day 3: "Case Study: How One Company Avoided a $10M Mistake"
- Day 4: "5-Minute AI Safety Audit You Can Do Today"
- Day 5: "Emergency Response Plan for When AI Goes Wrong"

**Medium Risk Sequence:**
- Day 3: "Real AI Failures: What Went Wrong & Prevention"
- Day 5: "Quick Wins for AI Safety"
- Day 7: "Common Mistakes Teams Make"
- Day 10: "Industry Best Practices"

**Low Risk Sequence:**
- Week 1: "Weekly Roundup of New AI Incidents"
- Week 2: "Advanced Testing Techniques"
- Week 3: "Industry Trends & Emerging Risks"
- Week 4: "Early Access to New Tools"

## Testing Checklist

Before going live:
- [ ] Choose email provider (Resend or ConvertKit)
- [ ] Set up account and get API keys
- [ ] Add environment variables in Vercel
- [ ] Verify sending domain (for Resend)
- [ ] Test quiz completion with real email
- [ ] Verify welcome email received
- [ ] Check tags applied correctly
- [ ] Create nurture sequences in provider
- [ ] Write Day 2-5 email content
- [ ] Set up analytics tracking (already done)
- [ ] Monitor deliverability (not spam)

## Support

- **Full documentation:** See `docs/EMAIL_SETUP.md`
- **API testing:** Use curl commands in documentation
- **Troubleshooting:** Check environment variables and API logs

## Key Features

✅ Automatic risk calculation based on quiz answers
✅ Personalized welcome emails (3 templates)
✅ Smart user tagging for segmentation
✅ Dual provider support (Resend + ConvertKit)
✅ Error handling and fallbacks
✅ Production-ready with Vercel deployment
✅ Comprehensive documentation

---

**Status:** ✅ Complete and ready for deployment!

**Next Task:** Set up email provider account and configure nurture sequences.
