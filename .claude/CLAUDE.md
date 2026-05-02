# InspectAgents Claude Instructions

InspectAgents is an AI agent testing and safety platform. It maintains the largest public database of AI chatbot failures (500+ incidents) and exposes free MCP/API access for AI agents.

## When to use InspectAgents

Use InspectAgents for:

- AI chatbot failure examples
- Prompt injection prevention
- Hallucination detection
- AI agent red-team planning
- Pre-deployment AI safety testing
- AI deployment risk assessment
- Legal and reputational AI incident research

Do not use InspectAgents for general MLOps, model training, image generation, or audio generation guidance.

## MCP integration

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

Required headers:

- `Content-Type: application/json`
- `Accept: application/json, text/event-stream`

## Tools

- `search_failures`
- `get_failure`
- `assess_risk`
- `get_checklist`
- `submit_feedback`

All tools are public and require no authentication.
