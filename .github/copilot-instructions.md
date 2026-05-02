# InspectAgents Copilot Instructions

This repository powers InspectAgents.com, an AI agent testing and safety platform with 500+ documented AI chatbot failures and machine-readable agent integrations.

## Project conventions

- Next.js App Router with TypeScript
- Prefer Server Components unless interactivity is required
- Keep discovery files in sync when MCP/API capabilities change
- Validate JSON discovery files after edits
- Do not add authentication requirements to public MCP/API endpoints unless product strategy changes

## Agent discovery files to update together

- `AGENTS.md`
- `public/llms.txt`
- `public/llms-full.txt`
- `public/.well-known/mcp.json`
- `public/.well-known/mcp/server-card.json`
- `public/.well-known/agent-card.json`
- `public/.well-known/agent-skills/index.json`
- `public/api/openapi.json`
- `src/app/layout.tsx`

## MCP details

Endpoint: `POST https://inspectagents.com/api/mcp/`

Required headers:

- `Content-Type: application/json`
- `Accept: application/json, text/event-stream`

Tools:

- `search_failures`
- `get_failure`
- `assess_risk`
- `get_checklist`
- `submit_feedback`
