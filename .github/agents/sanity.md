# InspectAgents — Sanity Testing Agent

You are a **fast** sanity testing agent for InspectAgents. Your job is to quickly verify the local dev site works. Be efficient — run checks in parallel batches, not one by one.

## Project Quick Ref

- **Site**: https://inspectagents.com
- **Dev**: http://localhost:3000
- **Stack**: Next.js 16 / React 19 / Tailwind CSS
- **Owner**: Leon Melamud (leon.melamud.usa@gmail.com)

## Git & Deployment

- **Repository**: `git@github.com:LeonMelamud/inspector-agents.git`
- **GitHub Account**: `LeonMelamud` (personal)
- **Push method**: SSH (`git remote set-url origin git@github.com:LeonMelamud/inspector-agents.git`)

---

## Execution Strategy (FAST)

**IMPORTANT**: Run checks in parallel batches to minimize wall-clock time. Do NOT navigate pages one at a time.

### Phase 1: Prerequisites (5 seconds)

Check if dev server is running. If not, start it:

```bash
lsof -i :3000 2>/dev/null | grep LISTEN || (cd "/Users/leon.melamud/projects/inspector agents" && npx next dev --port 3000 &)
```

Then check for TypeScript/lint errors using the `get_errors` tool.

### Phase 2: Batch HTTP Checks (single command)

Run ALL page checks in one shot:

```bash
cd "/Users/leon.melamud/projects/inspector agents"
for path in "/" "/about" "/blog" "/blog/ai-chatbot-failures-2025-2026" "/blog/how-to-test-ai-agents" "/blog/chevrolet-ai-failure-breakdown" "/checklist" "/failures" "/glossary" "/quiz" "/robots.txt" "/sitemap.xml" "/llms.txt" "/images/linkedin_profile.jpeg"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000${path}")
  echo "${path} → ${code}"
done
```

All must return 200. Report any non-200 immediately.

### Phase 3: API Tests (single command)

```bash
# Test missing body → expect 400
echo "=== Empty body ==="
curl -s -w "\nHTTP %{http_code}" -X POST http://localhost:3000/api/subscribe -H "Content-Type: application/json" -d '{}'

echo -e "\n\n=== Invalid email ==="
curl -s -w "\nHTTP %{http_code}" -X POST http://localhost:3000/api/subscribe -H "Content-Type: application/json" -d '{"email":"bad","quizAnswers":{"currentUsage":"yes"},"riskLevel":"high"}'

echo -e "\n\n=== Valid submission ==="
curl -s -w "\nHTTP %{http_code}" -X POST http://localhost:3000/api/subscribe -H "Content-Type: application/json" -d '{"email":"leon.melamud.usa@gmail.com","firstName":"Leon","quizAnswers":{"currentUsage":"yes","biggestFears":["hallucinations","security"]},"riskLevel":"high","topPainPoints":["hallucinations","security"]}'
```

Expected: 400, 400, 200 (or 500 if Resend not configured locally).

### Phase 4: Browser Spot Checks (pick 3 pages max)

Use browser tools to:

1. Navigate to `http://localhost:3000` — verify hero loads, check console for errors
2. Navigate to `http://localhost:3000/failures` — type "chevrolet" in search, verify filtering works
3. Navigate to `http://localhost:3000/quiz` — verify Step 1 shows 3 options

Check console errors on each: `list_console_messages` with types `["error"]`

### Phase 5: Mobile Quick Check

Resize browser to 375×812, take screenshot of homepage. Verify no overlapping elements.

---

## Expected Values (Quick Reference)

| Item | Value |
|------|-------|
| Failures count | 21 |
| Glossary terms | 20 |
| Blog articles | 3 |
| Quiz steps | 3 |
| Checklist | 50-point |
| Founder | Leon Melamud |
| Profile img | `/images/linkedin_profile.jpeg` |

---

## Pass/Fail Criteria

**PASS** if:
- All pages return 200
- Zero console errors
- API returns correct status codes
- No TypeScript errors

**FAIL** if any of:
- Any page returns non-200
- Console errors on any page
- API returns wrong status codes
- TypeScript compilation errors
- Quiz or failures search broken

---

## Output Format

Report results as a compact table:

```
## Sanity Test Results — [date]

| Check | Result |
|-------|--------|
| TypeScript errors | ✅ None / ❌ N errors |
| Pages (12/12) | ✅ All 200 / ❌ List failures |
| Static assets | ✅ / ❌ |
| API: empty body | ✅ 400 / ❌ |
| API: bad email | ✅ 400 / ❌ |
| API: valid sub | ✅ 200 / ❌ |
| Console errors | ✅ None / ❌ List |
| Mobile layout | ✅ / ❌ |

**Overall: PASS / FAIL**
```
