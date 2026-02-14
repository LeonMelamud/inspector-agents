# AGENTS.md — InspectAgents WebMCP & API Reference

> **For AI agents and developers.** This file documents every API endpoint
> and the WebMCP (Model Context Protocol) server on inspectagents.com.
> Updated: February 2026

---

## Quick Start — Connect via WebMCP

InspectAgents exposes a **Streamable HTTP MCP server** that gives AI agents
programmatic access to the full AI safety knowledge base.

### Endpoint

```
POST https://inspectagents.com/api/mcp/
```

### Required Headers (MUST include both)

```
Content-Type: application/json
Accept: application/json, text/event-stream
```

> **Without the `Accept` header → 406 Not Acceptable.**
> **Without the trailing slash → 308 redirect (breaks most POST clients).**

### Step 1: Initialize

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {},
    "clientInfo": { "name": "your-agent", "version": "1.0.0" }
  }
}
```

### Step 2: List Tools

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {} }
```

### Step 3: Call a Tool

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "search_failures",
    "arguments": { "query": "prompt injection", "limit": 5 }
  }
}
```

### curl Example (copy-paste ready)

```bash
curl -X POST https://inspectagents.com/api/mcp/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0.0"}}}'
```

---

## MCP Tools

### 1. `search_failures`

Search and filter the AI failures database (500+ incidents).

| Parameter  | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `query`   | string | No       | Free-text search across title, company, description, impact |
| `category`| enum   | No       | `Hallucination`, `Prompt Injection`, `Security`, `Bias`, `Jailbreak`, `Misinformation`, `Privacy`, `Safety` |
| `severity`| enum   | No       | `Low`, `Medium`, `High`, `Critical` |
| `year`    | int    | No       | Filter by year (e.g. 2024) |
| `limit`   | int    | No       | 1–50, default 10 |

**Returns:** `{ total, returned, failures: [{ id, title, company, date, category, severity, description, impact, cost, prevention }] }`

### 2. `get_failure`

Get full details of a single failure by ID.

| Parameter | Type   | Required | Description |
|----------|--------|----------|-------------|
| `id`     | string | Yes      | Failure ID (e.g. `"chevrolet-car-sale"`) |

**Returns:** Full failure record including `source`, `sourceUrl`, and `prevention` array.
**On invalid ID:** Returns `{ error, available_ids }` with `isError: true`.

### 3. `assess_risk`

Run the AI risk assessment quiz programmatically.

| Parameter       | Type     | Required | Description |
|----------------|----------|----------|-------------|
| `currentlyUsing`| enum    | Yes      | `"yes"` (production), `"planning"`, `"no"` (researching) |
| `biggestFears`  | string[] | Yes     | 1+ of: `"hallucinations"`, `"security"`, `"reputation"`, `"cost"`, `"dontKnow"` |

**Returns:** `{ riskLevel, riskLabel, summary, recommendations[], nextSteps: { checklist, failures, guide } }`

### 4. `get_checklist`

Retrieve the 56-point AI Agent Risk Checklist.

| Parameter  | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `severity`| enum   | No       | `"critical"`, `"high"`, `"medium"` |
| `section` | string | No       | Section name (e.g. `"Hallucination"`, `"Prompt Injection"`) |
| `query`   | string | No       | Free-text search across item names and descriptions |

**Returns (no filters):** `{ total: 56, sections: [{ title, subtitle, count, items }] }`
**Returns (with filters):** `{ total, filters, items: [{ name, description, severity }] }`

### 5. `submit_feedback`

Submit feedback, corrections, or new AI incident reports.

| Parameter | Type   | Required | Description |
|----------|--------|----------|-------------|
| `type`   | enum   | Yes      | `"feedback"`, `"correction"`, `"incident"`, `"suggestion"` |
| `message`| string | Yes      | Content (max 5000 chars) |
| `source` | string | No       | Agent identifier (e.g. `"Claude"`) |
| `url`    | string | No       | Reference URL |

**Returns:** `{ success: true, id: "fb_...", message, note }`

---

## MCP Resources

Read-only data that clients can browse via `resources/list` and `resources/read`.

| Resource URI                    | Description |
|--------------------------------|-------------|
| `inspectagents://failures/all` | Complete failures database as JSON (500+ incidents) |
| `inspectagents://checklist/full` | Full 56-point checklist with 9 sections |

### Read a Resource

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/read",
  "params": { "uri": "inspectagents://failures/all" }
}
```

---

## REST API Endpoints

### POST `/api/agent-feedback`

Submit feedback from AI agents (non-MCP alternative).

```json
{
  "type": "feedback|correction|incident|suggestion",
  "message": "Your feedback here (max 5000 chars)",
  "source": "Claude",
  "url": "https://example.com/reference"
}
```

**Response:** `200` with `{ success, id, message }`

### GET `/api/agent-feedback`

Returns self-documenting API docs for the feedback endpoint.

### POST `/api/subscribe`

Email list subscription. Supports two modes:

1. **Quiz signup:** `{ email, quizAnswers: { currentUsage, biggestFears }, riskLevel }`
2. **Waitlist signup:** `{ email, source: "feature-name" }`

---

## Discovery Files

| File | URL | Purpose |
|------|-----|---------|
| `robots.txt` | https://inspectagents.com/robots.txt | MCP endpoint + headers documented in comments |
| `llms.txt` | https://inspectagents.com/llms.txt | Structured site overview for AI assistants |
| `llms-full.txt` | https://inspectagents.com/llms-full.txt | Full context with stats, FAQ, curl examples |
| `mcp.json` | https://inspectagents.com/.well-known/mcp.json | MCP server discovery (URL, required headers, tools) |
| `openapi.json` | https://inspectagents.com/api/openapi.json | OpenAPI 3.1 spec for REST + MCP endpoints |
| `sitemap.xml` | https://inspectagents.com/sitemap.xml | XML sitemap for crawlers |

### HTML Meta Tags (in `<head>`)

```
ai:mcp_server = https://inspectagents.com/api/mcp/
ai:mcp_transport = streamable-http
ai:mcp_required_accept = application/json, text/event-stream
ai:mcp_discovery = https://inspectagents.com/.well-known/mcp.json
ai:llms_txt = https://inspectagents.com/llms.txt
ai:feedback_url = https://inspectagents.com/api/agent-feedback
```

---

## Common Mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| URL without trailing slash (`/api/mcp`) | 308 redirect, empty body | Always use `/api/mcp/` |
| Missing `Accept` header | 406 Not Acceptable | Add `Accept: application/json, text/event-stream` |
| Using GET instead of POST | 405 Method Not Allowed | MCP uses POST for all JSON-RPC calls |
| Forgetting `initialize` first | Error or unexpected behavior | Always send `initialize` before other methods |

---

## Sanity Tests

Integration tests that call the live endpoint are in `tests/mcp-sanity.test.mjs`.

```bash
node --test tests/mcp-sanity.test.mjs
```

Covers: initialize, tools/list, all 5 tool calls, resources/list, resources/read,
error handling, CORS, 406/405 rejection, and discovery file validation.

---

## Adding a New API or MCP Tool

When you add a new endpoint or MCP tool, update these files:

1. **Implementation:**
   - MCP tool → `src/lib/mcp/tools.ts` (register in `registerTools()`)
   - MCP resource → `src/lib/mcp/resources.ts` (register in `registerResources()`)
   - REST endpoint → `src/app/api/<name>/route.ts`

2. **Documentation (update all):**
   - `AGENTS.md` (this file) — add to the tools/endpoints table
   - `public/llms.txt` — add to MCP tools list
   - `public/llms-full.txt` — add to tools table + examples
   - `public/.well-known/mcp.json` — add to `tools` array
   - `public/api/openapi.json` — add path + schema
   - `src/app/layout.tsx` — update hidden AI section text

3. **Testing:**
   - `tests/mcp-sanity.test.mjs` — add test case for the new tool
   - Update tool count assertions (currently expects 5 tools, 2 resources)

4. **Verification checklist:**
   - [ ] Tool/endpoint works locally (`npm run dev`)
   - [ ] `node --test tests/mcp-sanity.test.mjs` passes against production
   - [ ] All discovery files reference the new tool
   - [ ] AGENTS.md is updated with parameter table
