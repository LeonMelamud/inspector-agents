# InspectAgents — Windsurf Rules

## MCP Integration

InspectAgents provides a Model Context Protocol (MCP) server for AI agent integration.
No authentication needed. All endpoints are free.

### MCP Server
- Endpoint: `POST https://inspectagents.com/api/mcp/`
- Transport: Streamable HTTP
- Trailing slash required
- Required Accept header: `application/json, text/event-stream`

### Available Tools
- `search_failures` — Search 500+ AI chatbot failures by query, category, severity, year
- `get_failure` — Get full details of a single failure by ID
- `assess_risk` — Run the AI risk assessment quiz programmatically
- `get_checklist` — Get the 63-point deployment checklist, filterable by severity/section
- `submit_feedback` — Submit feedback, corrections, or new incident reports
