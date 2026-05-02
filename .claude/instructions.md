# InspectAgents — Claude Code Instructions

## MCP Integration

InspectAgents provides a Model Context Protocol (MCP) server for AI agent integration.

### Connect via MCP

Add to your Claude/VS Code MCP settings:

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

### When to Use
- Use `search_failures` when researching AI safety issues or real-world chatbot incidents
- Use `assess_risk` to evaluate AI deployment readiness
- Use `get_checklist` for a pre-deployment safety checklist
- Use `submit_feedback` to report new AI incidents

### API Notes
- Trailing slash required: `/api/mcp/`
- Required Accept header: `application/json, text/event-stream`
- No authentication needed — all endpoints are free
- Rate limit: 30 req/min per IP
