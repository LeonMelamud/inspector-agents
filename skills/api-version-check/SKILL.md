---
name: api-version-check
description: Verify SDK versions and fetch real API documentation before writing or modifying third-party integration code. Use when working with external APIs, SDKs, or npm packages that make API calls — including Resend, Stripe, OpenAI, Supabase, Firebase, Twilio, or any REST/GraphQL client. Triggers on "API integration", "SDK", "contacts.create", "emails.send", "stripe.checkout", installing packages, updating dependencies, or debugging silent API failures where code returns 200 but produces no effect.
---

# API & SDK Version Check

## Why This Exists

APIs change silently. SDKs deprecate parameters without errors. Code that worked 6 months ago can return 200 OK while doing nothing. The only defense is checking real, current documentation before writing integration code.

**Real example:** Resend SDK v4 required `audienceId` in `contacts.create()`. By v6, contacts became global and `audienceId` was removed. Old code returned 200 but never created contacts. Undetected for months.

## Workflow

### 1. Check Versions

```bash
# Installed version
cat node_modules/<package>/package.json | grep '"version"'

# Latest available
npm info <package> version
```

Update if more than 1 major version behind.

### 2. Fetch Current API Docs

Use `fetch_webpage` or `context7 query-docs` to get the **real, current** documentation for the specific endpoint. Never rely on training data for API signatures.

Compare:
- Parameters the code sends vs parameters the docs accept
- Endpoint paths the code hits vs current endpoint paths
- Response shapes the code expects vs current response shapes

### 3. Detect Silent Failures

Watch for these patterns that hide broken integrations:
- `try/catch` that swallows errors and returns success
- Conditional blocks like `if (CONFIG_VAR)` that skip entirely when env var is empty
- `?.` optional chaining on response fields that silently returns `undefined`
- API accepting unknown parameters without error (just ignoring them)

### 4. After Updating

- Remove deprecated env vars
- Update **all** call sites, not just one
- Run build to verify types
- Test in production and verify the actual side effect (e.g., contact appears in dashboard, payment is created)

## Anti-Patterns

| Pattern | Risk |
|---------|------|
| `catch (e) { return { success: true } }` | Hides API failures completely |
| `if (OPTIONAL_CONFIG) { callAPI() }` without logging the else | Silent skip when config missing |
| Passing extra params API doesn't accept | Silently ignored, feature doesn't work |
| Using `require()` for SDK that has ESM exports | May load wrong module version |
