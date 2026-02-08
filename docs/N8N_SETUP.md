# n8n Email Workflow Setup

This guide shows you how to set up email capture and automation using n8n (free, self-hosted workflow automation).

## Why n8n?

- ✅ **100% Free** - Host yourself or use n8n Cloud free tier
- ✅ **Flexible** - Easy to customize emails, add integrations
- ✅ **No Code Limits** - Unlike Resend/ConvertKit free tiers
- ✅ **Full Control** - Your data, your server
- ✅ **Multiple Outputs** - Send emails + save to Sheets/Airtable/CRM in one flow

## Quick Start (15 Minutes)

### Step 1: Set Up n8n

**Option A: n8n Cloud (Easiest)**
1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for free account (100 executions/month)
3. Create a new workflow

**Option B: Self-Hosted (More Control)**
```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Open http://localhost:5678
```

### Step 2: Import the Workflow

1. Download [n8n-email-workflow.json](../n8n-email-workflow.json) from your project
2. In n8n, click **"Import from File"**
3. Upload `n8n-email-workflow.json`
4. Workflow is now in your n8n instance! 🎉

### Step 3: Configure Gmail (for sending emails)

1. In the workflow, click any **"Send Email"** node
2. Click **"Create New Credential"**
3. Select **Gmail OAuth2**
4. Follow prompts to authenticate with your Gmail account
5. Save credential

**Alternative Email Services:**
- SendGrid (needs API key)
- Mailgun (needs API key)
- SMTP (any email provider)

### Step 4: Get Your Webhook URL

1. Click the **"Webhook"** node (first node)
2. Copy the **Production URL** (looks like: `https://your-n8n-instance.com/webhook/abc123`)
3. This is your `N8N_WEBHOOK_URL`

### Step 5: Add to Your Environment Variables

**For Vercel (Production):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `N8N_WEBHOOK_URL` = `https://your-n8n.com/webhook/abc123`
3. Redeploy

**For Local Development:**
```bash
# .env.local
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/abc123
```

### Step 6: Test It!

1. Visit your site's `/quiz` page
2. Complete the quiz with your email
3. Check your Gmail inbox for the welcome email
4. ✅ Working!

---

## Workflow Features

### What the Workflow Does

1. **Receives Quiz Data** - Webhook accepts POST from your site
2. **Risk Detection** - Routes to HIGH/MEDIUM/LOW email based on quiz answers
3. **Sends Personalized Email** - Different email template per risk level
4. **Saves to Google Sheets** (Optional) - Track all submissions
5. **Returns Success** - Confirms to your website

### Workflow Structure

```
Webhook Trigger
    ↓
IF High Risk? → YES → Send High Risk Email
    ↓ NO
IF Medium Risk? → YES → Send Medium Risk Email
    ↓ NO
Send Low Risk Email (default)
    ↓
Save to Google Sheets (optional)
    ↓
Respond Success to Website
```

### Data Received from Website

The workflow receives this JSON payload:

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "riskLevel": "high",
  "quizAnswers": {
    "currentUsage": "yes",
    "biggestFears": ["hallucinations", "security"],
    "experiencedFailure": "yes",
    "failureDescription": "Chatbot gave wrong pricing...",
    "confidenceFactors": "Testing framework",
    "costImpact": ["time", "reputation"],
    "role": "CTO"
  },
  "topPainPoints": ["hallucinations", "security", "reputation-damage"],
  "tags": ["risk-high", "usage-yes", "role-cto", "fear-hallucinations"],
  "timestamp": "2026-02-04T12:34:56.789Z"
}
```

---

## Customization Guide

### Change Email Templates

1. Click any **"Send Email"** node
2. Edit the **HTML message** field
3. Use variables like `{{$json.firstName}}`, `{{$json.topPainPoints}}`
4. Save and test

### Add Google Sheets Storage

1. In n8n, enable the **"Save to Google Sheets"** node (currently disabled)
2. Click **"Create New Credential"** → Google Sheets OAuth2
3. Authenticate with Google
4. Create a spreadsheet
5. Copy Spreadsheet ID from URL: `docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
6. Replace `YOUR_SPREADSHEET_ID_HERE` in the node
7. Save

**Sheet Columns:**
- Timestamp
- Email
- First Name
- Risk Level
- Role
- Biggest Fears
- Experienced Failure
- Top Pain Points
- Tags

### Add to Airtable/CRM

1. Add new node: **"Airtable"** or **"HubSpot"** or **"Salesforce"**
2. Connect after the email node
3. Map fields:
   - `{{$json.email}}` → Email field
   - `{{$json.riskLevel}}` → Risk Level field
   - `{{$json.tags}}` → Tags field

### Trigger Follow-up Sequences

**Option 1: In n8n (recommended for simplicity)**
1. Add a **"Wait"** node after the welcome email
2. Set delay: **1 day**
3. Add another **"Send Email"** node with Day 2 content
4. Repeat for Days 3, 4, 5

**Option 2: Using ConvertKit/Mailchimp**
1. Add **"ConvertKit"** node after welcome email
2. Action: **"Subscribe"**
3. Add tags: `{{$json.tags}}`
4. ConvertKit takes over the nurture sequence

---

## Email Templates Included

### HIGH Risk Email
- **Subject:** 🚨 Your AI Risk Report + Urgent Action Steps
- **Tone:** Urgent, action-oriented
- **CTA:** Download checklist immediately
- **Content:** Top 3 concerns, real failure costs, 5-day action plan

### MEDIUM Risk Email
- **Subject:** ⚠️ Your AI Risk Assessment + What to Do Next
- **Tone:** Encouraging, helpful
- **CTA:** Download checklist, focus on top concerns
- **Content:** Gaps identified, next steps, weekly resources

### LOW Risk Email
- **Subject:** ✅ Your AI Safety Checklist + Best Practices
- **Tone:** Supportive, educational
- **CTA:** Download checklist, stay proactive
- **Content:** Resources, best practices, ongoing learning

---

## Advanced: Multi-Day Nurture Sequence

To create a 5-day sequence in n8n:

```
Webhook → Send Day 1 Email
    ↓
Wait 1 Day
    ↓
Send Day 2 Email (Hallucination Testing)
    ↓
Wait 1 Day
    ↓
Send Day 3 Email (Prompt Injection Prevention)
    ↓
Wait 1 Day
    ↓
Send Day 4 Email (Security Framework)
    ↓
Wait 1 Day
    ↓
Send Day 5 Email (Production Monitoring)
```

**Pro Tip:** Create 3 separate workflows (high/medium/low risk) with different day-by-day content.

---

## Troubleshooting

### Webhook not receiving data
- Check webhook URL is correct in `.env.local` or Vercel
- Ensure workflow is **Active** (toggle at top of n8n)
- Test webhook with: `curl -X POST <webhook-url> -H "Content-Type: application/json" -d '{"email":"test@test.com"}'`

### Email not sending
- Verify Gmail credential is authenticated
- Check spam folder
- Try "Execute Workflow" button in n8n for manual test
- Enable error workflow to catch failures

### Google Sheets not saving
- Enable the Google Sheets node (currently disabled by default)
- Check spreadsheet ID is correct
- Verify Google Sheets credential is authenticated
- Ensure sheet has proper column headers

### n8n execution limit reached (n8n Cloud free tier)
- Upgrade to n8n Cloud paid plan ($20/mo for unlimited)
- Self-host n8n for free (Docker, see above)
- Switch to Resend/ConvertKit if you prefer SaaS

---

## Cost Comparison

| Provider | Free Tier | Cost After | Control |
|----------|-----------|------------|---------|
| **n8n (self-hosted)** | ∞ emails | $0 (server costs only) | ⭐⭐⭐⭐⭐ |
| **n8n Cloud** | 100/mo | $20/mo unlimited | ⭐⭐⭐⭐ |
| **Resend** | 100/day | $20/mo → 50K/mo | ⭐⭐⭐ |
| **ConvertKit** | 0 (paid only) | $29/mo → 1K subs | ⭐⭐ |

**Recommendation:** Start with **n8n Cloud free tier** (100 emails/month). If you need more, **self-host** for unlimited emails at $0.

---

## Next Steps

1. ✅ Import workflow to n8n
2. ✅ Configure Gmail credentials
3. ✅ Copy webhook URL to environment variables
4. ✅ Test with quiz submission
5. ✅ (Optional) Enable Google Sheets tracking
6. ✅ Customize email templates to match your brand
7. ✅ Set up multi-day nurture sequence

**Questions?** The workflow is fully functional out-of-the-box. Just import, configure Gmail, and go! 🚀

---

## Example: Full Setup (Video Tutorial)

*Coming soon: Loom video walkthrough*

For now, these screenshots show the key steps:
1. Import workflow
2. Authenticate Gmail
3. Copy webhook URL
4. Add to Vercel
5. Test quiz submission
6. Receive email

Each step takes 1-2 minutes. Total setup: **~15 minutes**.
