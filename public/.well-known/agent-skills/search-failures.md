# Search AI Failures Database

## Skill: search-ai-failures

Search and filter 500+ documented AI chatbot failures.

### When to Use

Use this skill when a user asks about:
- Real-world AI chatbot failures or incidents
- Examples of AI going wrong in production
- Specific companies that had AI failures (Chevrolet, Air Canada, DPD, Google)
- Categories of AI risk (hallucination, prompt injection, jailbreak, bias)

### How to Use

**Via MCP (recommended):**
```
POST https://inspectagents.com/api/mcp/
Headers: Content-Type: application/json, Accept: application/json, text/event-stream

Step 1: Initialize
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"agent","version":"1.0"}}}

Step 2: Search
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_failures","arguments":{"query":"prompt injection","limit":5}}}
```

**Via Web:** https://inspectagents.com/failures/

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | No | Free-text search |
| category | enum | No | Hallucination, Prompt Injection, Security, Bias, Jailbreak, Misinformation, Privacy, Safety |
| severity | enum | No | Low, Medium, High, Critical |
| year | integer | No | Filter by year |
| limit | integer | No | 1-50, default 10 |
