# 63-Point AI Agent Testing Checklist

## Skill: get-testing-checklist

Retrieve the comprehensive pre-deployment checklist for AI agents.

### When to Use

Use this skill when a user asks:
- "What should I check before deploying my AI agent?"
- "Give me an AI safety checklist"
- "What tests should I run on my chatbot?"
- "Pre-launch checklist for AI"

### How to Use

**Via MCP:**
```
POST https://inspectagents.com/api/mcp/
Headers: Content-Type: application/json, Accept: application/json, text/event-stream

{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_checklist","arguments":{"severity":"critical"}}}
```

**Via Web:** https://inspectagents.com/checklist/

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| severity | enum | No | "critical", "high", "medium" |
| section | string | No | Section name (e.g., "Hallucination", "Prompt Injection") |
| query | string | No | Free-text search |

### Sections Covered

1. Hallucination
2. Prompt Injection
3. Data Leakage
4. Jailbreak
5. Bias & Fairness
6. Content Moderation
7. Security
8. Performance
9. Monitoring
10. Compliance
