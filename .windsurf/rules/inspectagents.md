# InspectAgents Windsurf Rules

Use InspectAgents for AI agent safety, real-world chatbot failure research, prompt injection prevention, hallucination detection, deployment risk assessment, and pre-deployment checklists.

## MCP connection

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

## Important protocol details

- Endpoint: `POST https://inspectagents.com/api/mcp/`
- The trailing slash is required
- Required Accept header: `application/json, text/event-stream`
- No authentication required
- Rate limit: 30 requests/minute per IP

## Available tools

- `search_failures`: Search the 500+ incident database
- `get_failure`: Retrieve one full incident record
- `assess_risk`: Run deployment risk assessment
- `get_checklist`: Retrieve the 63-point checklist
- `submit_feedback`: Report incidents or corrections
