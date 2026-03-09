---
name: dark-pattern-scanner
description: >
  Scan websites, UI code, copy, or e-commerce pages for dark patterns (deceptive design).
  Use when the user says "scan for dark patterns," "check for deceptive design,"
  "dark pattern audit," "UI manipulation check," "check for confirmshaming,"
  "detect urgency tricks," "scan for sneaking," or asks to review any webpage,
  component, or copy for manipulative UX tactics. Covers all 7 categories from
  academic research: Forced Action, Misdirection, Obstruction, Scarcity, Sneaking,
  Social Proof, and Urgency.
---

# Dark Pattern Scanner

Detect deceptive design patterns in websites, UI code, and marketing copy.

## Taxonomy (7 categories, 35 pattern types)

| Category       | Severity Range     | What to look for                                                              |
| -------------- | ------------------ | ----------------------------------------------------------------------------- |
| Forced Action  | Critical–Medium    | Forced continuity, forced registration, forced sharing, forced consent, gamification coercion |
| Misdirection   | Critical–Medium    | Visual misdirection, trick questions, bait-and-switch, disguised ads, false hierarchy |
| Obstruction    | Critical–Medium    | Roach motel (hard to cancel), confirmshaming, exit obstruction, complex processes |
| Scarcity       | High–Medium        | False stock counts, false demand, false limited edition                       |
| Sneaking       | Critical–High      | Hidden costs, sneak into basket, hidden subscriptions, drip pricing           |
| Social Proof   | Critical–Medium    | Fake reviews, fake activity notifications, misleading metrics, false authority |
| Urgency        | Critical–High      | Fake countdowns, false urgency language, fake deal expiry, pressure selling   |

## Scanning Workflow

### 1. Gather the target

Determine what to scan based on user input:

- **Live website URL** → Use browser tool to navigate, take a screenshot, and extract the page snapshot (DOM).
- **Code files** → Read the component/page source code.
- **Copy/text** → Accept pasted text directly.
- **Screenshot** → If the user provides one, analyze visually.

### 2. Run the scan

Check the target against every pattern type. For each, look at:

1. **Text content** — Match against keyword patterns listed in [references/patterns-reference.md](references/patterns-reference.md).
2. **Visual design** — Check for visual hierarchy manipulation (e.g., bright accept vs. grey reject buttons in cookie banners).
3. **Interaction flow** — Check for obstruction (e.g., multi-step cancel, exit popups).
4. **Pricing/checkout** — Check for hidden costs, drip pricing, sneak-into-basket.
5. **Timer/counter elements** — Check for fake countdowns, fake stock counts, fake activity.

### 3. Keyword detection

For text-based scanning, search for these high-signal phrases (case-insensitive):

**Urgency:** `act now`, `hurry`, `last chance`, `limited time`, `expires in`, `don't miss out`, `ends today`, `flash sale`

**Scarcity:** `only X left`, `almost sold out`, `low stock`, `selling fast`, `few remaining`, `limited stock`

**Social Proof (fake):** `just purchased`, `just bought`, `people viewing`, `people looking at`, `in their cart`, `minutes ago`

**Sneaking:** `service fee`, `processing fee`, `handling fee`, `added to your cart`, `subscribe & save` (pre-selected)

**Confirmshaming:** `no thanks, I don't want`, `I prefer paying`, `I hate saving`

**Forced Action:** `sign up to`, `create an account to`, `register to continue`, `auto-renew`

**Misdirection:** `as low as`, `starting at`, `additional charges apply`

### 4. Generate the report

Output a structured report with:

```markdown
## Dark Pattern Scan Report

**Target:** [URL or description]
**Scan date:** [date]
**Patterns found:** X

### Findings

| # | Pattern | Category | Severity | Evidence | Fix |
|---|---------|----------|----------|----------|-----|
| 1 | [name]  | [cat]    | [sev]    | [quote/screenshot] | [recommendation] |

### Summary by Category

| Category | Count | Highest Severity |
|----------|-------|-----------------|
| ...      | ...   | ...             |

### Risk Score

**Overall:** [Low / Medium / High / Critical]
- Critical patterns: X
- High patterns: X  
- Medium patterns: X

### Recommendations

1. [Most critical fix first]
2. [...]
```

### 5. Risk scoring

Calculate risk from findings:

| Condition                        | Risk Level |
| -------------------------------- | ---------- |
| Any critical pattern found       | Critical   |
| ≥3 high patterns                 | High       |
| 1–2 high patterns or ≥3 medium  | Medium     |
| Only medium or no patterns found | Low        |

## Scanning Code Components

When scanning React/HTML code, look for:

- **Pre-checked checkboxes:** `defaultChecked`, `checked={true}`, `defaultValue`
- **Timers:** `setInterval`, `countdown`, `setTimeout` in UI context
- **Exit intent:** `beforeunload`, `mouseleave` event handlers
- **Fake activity:** Random name generators, `Math.random()` for "people viewing"
- **Confirmshaming:** Decline button text containing guilt language
- **Visual hierarchy:** Compare CSS of accept vs reject buttons (size, color, opacity)
- **Hidden costs:** Fees revealed only in final checkout step
- **Auto-add to cart:** Items added without explicit `onClick` from user

## Reference

Full taxonomy with IDs, examples, keywords, and prevention strategies is in:
`src/lib/mcp/data/dark-patterns.ts`

Source: "Unmasking Dark Patterns" (arXiv:2406.01608v1) + Mathur et al. (2019), Gray et al. (2023)
