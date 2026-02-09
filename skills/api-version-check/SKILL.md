# Skill: API & SDK Version Check

## Purpose
Always verify you're working with the **latest SDK versions** and **current API documentation** before writing or modifying integration code. Never trust cached knowledge — APIs change frequently and silently break code.

## Lesson Learned
The Resend SDK v4.8 used `audienceId` in `contacts.create()`. By v6.x, Resend made contacts global and removed the `audienceId` parameter entirely. The old code hit a deprecated endpoint (`/audiences/{id}/contacts`) that silently failed — returning 200 but never creating contacts. This went undetected for months.

## Rules

### 1. Check Installed vs Latest Version
Before modifying any third-party integration code, always run:
```bash
# Check what's installed
cat node_modules/<package>/package.json | grep '"version"'

# Check what's latest
npm info <package> version
```

If the installed version is more than 1 major version behind, **update first**.

### 2. Read Current API Documentation
Never assume API parameters from memory or existing code. Always:
- Fetch the official docs page for the specific endpoint you're using
- Compare the current API signature against what the code is doing
- Look for deprecated parameters, renamed fields, or removed endpoints

### 3. Check for Breaking Changes
When updating a major version:
```bash
# Check changelog or migration guide
npm info <package> homepage
```
Then fetch the changelog/migration guide from the package's website.

### 4. Common Silent Failures to Watch For
- **Deprecated parameters silently ignored** — API accepts the call but ignores unknown fields
- **Endpoint restructuring** — old paths return 200 but do nothing
- **Changed response shapes** — `data?.id` returns undefined because response structure changed
- **Removed features wrapped in try/catch** — errors are swallowed, code appears to work

### 5. After Updating
- Remove any env vars that are no longer needed (e.g., `RESEND_AUDIENCE_ID` after Resend v6)
- Update all call sites, not just one
- Run a build to verify type compatibility
- Test the actual API call in production and verify the side effect (e.g., contact actually appears in dashboard)

## Applies To
Any code that integrates with external APIs/SDKs including but not limited to:
- Resend (email/contacts)
- Stripe (payments)
- Vercel (deployment)
- Any REST API client
- Any npm package with API calls

## Key Packages in This Project

### Resend (v6.x+)
- **Contacts are global** — no `audienceId` needed
- Create contact: `resend.contacts.create({ email, firstName, unsubscribed })`
- Contacts appear under **Audience → Contacts** in dashboard (single global audience)
- Docs: https://resend.com/docs/api-reference/contacts/create-contact
- `RESEND_AUDIENCE_ID` env var is **no longer needed**

## Checklist
- [ ] Checked installed version vs latest version
- [ ] Fetched current official API docs for the endpoint
- [ ] Compared code's API usage against current docs
- [ ] Updated SDK if outdated
- [ ] Removed deprecated parameters/env vars
- [ ] Verified build passes
- [ ] Tested in production and confirmed the actual effect
