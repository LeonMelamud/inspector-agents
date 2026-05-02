# AI Deployment Risk Assessment

## Skill: assess-ai-risk

Run the AI risk assessment quiz programmatically.

### When to Use

Use this skill when a user asks:
- "How risky is my AI deployment?"
- "Should I test my chatbot before launch?"
- "What AI risks should I worry about?"
- "Is my AI agent ready for production?"

### How to Use

**Via MCP:**
```
POST https://inspectagents.com/api/mcp/
Headers: Content-Type: application/json, Accept: application/json, text/event-stream

{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"assess_risk","arguments":{"currentlyUsing":"planning","biggestFears":["hallucinations","security"]}}}
```

**Via Web:** https://inspectagents.com/quiz/

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| currentlyUsing | enum | Yes | "yes" (production), "planning", "no" (researching) |
| biggestFears | string[] | Yes | 1+ of: "hallucinations", "security", "reputation", "cost", "dontKnow" |

### Response

Returns risk level (Low/Medium/High), summary, recommendations, and next steps including relevant checklist items and failure examples.
