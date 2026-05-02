# InspectAgents — Cursor Rules

## MCP Integration

InspectAgents provides a Model Context Protocol (MCP) server for AI agent integration.

### Connect via MCP

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "inspectagents": {
      "url": "https://inspectagents.com/api/mcp/",
      "transport": "streamable-http"
    }
  }
}
```

### Available Tools
- `search_failures` — Search 500+ AI chatbot failures
- `get_failure` — Get full details of a single failure
- `assess_risk` — Run the AI risk assessment quiz
- `get_checklist` — Get the 63-point deployment checklist
- `submit_feedback` — Submit feedback or incidents

### Important
- Trailing slash required on `/api/mcp/`
- Required Accept header: `application/json, text/event-stream`
- No authentication needed
- Rate limit: 30 req/min
