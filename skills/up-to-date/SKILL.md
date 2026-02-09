---
name: up-to-date
description: Fetch real, current API docs and verify package versions before installing packages, calling external APIs, using SDKs, or integrating any third-party library. Triggers on npm install, pip install, package.json changes, import statements for external packages, API calls (fetch, axios, SDK methods), "integrate with", "connect to", "use X library", or debugging silent API failures where code returns 200 but produces no effect.
---

# Up To Date

## Rule

**Before writing ANY code that touches an external package or API, fetch the real documentation first.** Never rely on training data — it is stale by definition.

## When This Triggers

- Installing a package (`npm install`, `pip install`, `brew install`)
- Importing or using any third-party library
- Calling any external API (REST, GraphQL, SDK methods)
- Modifying existing integration code
- Debugging API calls that silently fail

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

Do NOT skip this step. Do NOT write integration code from memory.

### 3. Compare Code vs Docs

Check for mismatches:
- Parameters code sends vs parameters docs accept
- Endpoint paths code hits vs current paths
- Response shape code expects vs current shape
- Required vs optional fields
- Removed or renamed parameters

### 4. After Changes

- Remove deprecated env vars and parameters
- Update **all** call sites
- Build to verify types
- Test live and verify the actual side effect

## Why This Matters

**Real incident:** Resend SDK v4 required `audienceId` in `contacts.create()`. By v6 it was removed — contacts became global. Code returned 200 but never saved contacts. Undetected for months because the catch block returned `{ success: true }`.

## Anti-Patterns

| Pattern | Risk |
|---------|------|
| Writing API code from memory | Parameters may not exist anymore |
| `catch (e) { return { success: true } }` | Hides failures completely |
| `if (CONFIG) { callAPI() }` with no else-log | Silent skip when config is missing |
| Passing extra params API won't reject | Silently ignored, feature broken |

## Related Skills

- **dependency-management** — use alongside when resolving version conflicts or managing lockfiles
- **third-party-integration** — use alongside when implementing the actual integration patterns after verifying docs
- **api-versioning-strategy** — use when designing your own API's versioning, not checking upstream
