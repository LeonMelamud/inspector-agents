---
name: up-to-date
description: "MANDATORY when ANY of these appear: (1) writing/editing/refactoring code that calls any third-party SDK, API, or library method, (2) debugging ANY issue where an API call succeeds (200/201) but the expected side-effect doesn't happen (email not sent, record not created, webhook not fired), (3) installing or importing external packages, (4) user reports something 'doesn't work' and the code involves an external service. This skill MUST be loaded BEFORE proposing any fix — never diagnose from memory."
---

# Up To Date

## Rule

**Before writing ANY code that touches an external package or API, fetch the real documentation first.** Never rely on training data — it is stale by definition.

**Before diagnosing ANY bug involving an external service, fetch the real documentation first.** Your first instinct about why something fails is often wrong. The docs will tell you the actual API contract.

## STOP — Am I About to Violate This Skill?

Before touching code that calls an external service, ask yourself:

1. **Am I about to write or change an API call without reading the current docs?** → STOP. Fetch docs first.
2. **Am I about to guess why an API call silently fails?** → STOP. Fetch docs first.
3. **Am I about to propose a "sounds right" fix (dynamic imports, bundler config, etc.) without verifying the actual API contract?** → STOP. Fetch docs first.

If the answer to any of these is yes, you MUST complete the Mandatory Steps below before writing a single line of code.

## When This Triggers

This skill triggers on **any** of the following — load it BEFORE doing anything else:

### Direct triggers (writing code)
- Installing a package (`npm install`, `pip install`, `brew install`)
- Importing or using any third-party library
- Calling any external API (REST, GraphQL, SDK methods)
- Modifying or refactoring existing integration code
- Moving API calls between files (e.g., centralizing into a service module)

### Diagnostic triggers (debugging)
- **An API returns success but the expected side-effect didn't happen** (email not sent, record not visible, webhook not fired) — this is the #1 missed trigger
- User says something "doesn't work" and external services are involved
- Resend/Stripe/Twilio/etc. dashboard shows the request but not the expected result
- A `try/catch` is swallowing errors and you need to understand what the API actually expects
- Any 422, 400, or 404 from an API you haven't checked docs for recently

### Refactoring triggers
- Changing how an SDK is initialized (singleton, lazy, etc.)
- Changing how SDK method parameters are constructed
- Moving SDK calls to a different file or module (parameter shapes may need adjustment)

## Mandatory Steps

### 1. Check Version

```bash
# What's installed?
cat node_modules/<pkg>/package.json | grep '"version"'
# or: pip show <pkg> | grep Version

# What's latest?
npm info <pkg> version
# or: pip index versions <pkg>
```

Update if more than 1 major version behind.

### 2. Fetch Real Docs (pick one or more)

**Context7** (preferred for popular libraries):
```
resolve-library-id → query-docs with specific endpoint/method question
```

**Browser** (`fetch_webpage`):
```
Fetch the official API reference page for the specific endpoint or method being used
```

**DeepWiki** (if available):
```
Fetch from deepwiki.com for GitHub-based packages
```

Do NOT skip this step. Do NOT write integration code from memory. Do NOT diagnose failures from memory.

### 3. Compare Code vs Docs

Check for mismatches:
- Parameters code sends vs parameters docs accept
- **Value types and shapes** — does the parameter expect a React element, a string, a JSX call, a plain object?
- Endpoint paths code hits vs current paths
- Response shape code expects vs current shape
- Required vs optional fields
- Removed or renamed parameters
- **How the SDK expects components/callbacks to be passed** (e.g., `createElement()` vs direct function call vs JSX)

### 4. After Changes

- Remove deprecated env vars and parameters
- Update **all** call sites
- Build to verify types
- Test live and **verify the actual downstream effect** — don't just check the HTTP status code. Confirm the resource appears where expected (dashboard, database, UI). A 200 with a valid-looking response body can still mean nothing happened.

## Why This Matters

### Incident 1: Resend Audiences → Segments (200 OK trap)
Resend deprecated Audiences and replaced them with Segments. `contacts.create()` without a `segments` parameter still returned 200 and a valid contact object — but the contact was a global orphan invisible in the dashboard. First fix removed `audienceId` (training data said it was gone). Second fix added `segments: [{ id }]` after fetching real docs. The 200 OK trap delayed discovery twice.

### Incident 2: Resend `react` parameter (silent failure, wrong diagnosis)
`sendWelcomeEmail` called `Template({ firstName, topPainPoints })` and passed the result to Resend's `react:` parameter. Contact was created (200 OK) but no email was sent. **First diagnosis was wrong** — guessed "dynamic imports fail in serverless" and switched to static imports. Email still didn't send. **Real cause found only after fetching docs**: Resend's `react:` property needs a React element (`createElement(Template, props)` or `<Template />`), not a plain function call result. A `.ts` file can't produce JSX, so `createElement` was required. If docs had been fetched first, this would have been one fix instead of two wrong guesses.

**Pattern: when an API call succeeds but the side-effect is missing, your first guess about why is almost always wrong. Fetch the docs.**

## Anti-Patterns

| Pattern | Risk |
|---------|------|
| Writing API code from memory | Parameters may not exist anymore |
| **Diagnosing API failures from memory** | **You'll guess wrong and waste turns on fake fixes** |
| Guessing "bundler/serverless" issues before checking API contract | The problem is usually in how you call the API, not infrastructure |
| `catch (e) { return { success: true } }` | Hides failures completely |
| `catch (e) { logger.error(e) }` with no rethrow or user feedback | Failure is logged but invisible to debugging flow |
| `if (CONFIG) { callAPI() }` with no else-log | Silent skip when config is missing |
| Passing extra params API won't reject | Silently ignored, feature broken |
| Trusting 200 + valid response body = success | Resource may exist but be orphaned/invisible |
| Verifying only the API response, not the dashboard/DB | Missed side effects go undetected |
| Assuming `Component(props)` and `createElement(Component, props)` are interchangeable | Some SDKs (Resend, React Email) require actual React elements, not raw function calls |

## Decision Flowchart

```
User reports bug with external service
  │
  ├─ Is there a try/catch swallowing the error?
  │   └─ YES → Temporarily log the full error BEFORE guessing
  │
  ├─ Does the API return success but side-effect is missing?
  │   └─ YES → FETCH DOCS FIRST. Do NOT guess the cause.
  │            Compare exact parameter shapes, types, and values
  │            against what the docs specify.
  │
  └─ Is the error a 4xx?
      └─ YES → FETCH DOCS. Check which parameters are valid
               for the current SDK version.
```

## Bundled Resources

### `scripts/check_versions.py`
Automated version checker for npm and pip packages. Run it to quickly identify outdated dependencies:
```bash
# Check a single npm package
python3 scripts/check_versions.py npm resend
# Check all package.json dependencies
python3 scripts/check_versions.py npm --all
# Check a pip package
python3 scripts/check_versions.py pip requests
```

### `references/doc-urls.md`
Quick-reference table of official API documentation and changelog URLs for 30+ popular packages (email, payments, AI, databases, auth, cloud, analytics, frameworks). Consult this before searching — the correct URL may already be listed.

## Related Skills

- **dependency-management** — use alongside when resolving version conflicts or managing lockfiles
- **third-party-integration** — use alongside when implementing the actual integration patterns after verifying docs
- **api-versioning-strategy** — use when designing your own API's versioning, not checking upstream
