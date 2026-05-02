# InspectAgents — AI Agent Testing & Safety Platform

> The most comprehensive resource for AI agent testing, safety validation, and failure analysis.

## What We Do

InspectAgents maintains the internet's largest public database of **500+ documented AI chatbot failures** with technical analysis, root cause investigation, cost impact assessment, and prevention strategies for each incident.

## Key Resources

- **[AI Failures Database](https://inspectagents.com/failures/)** — 500+ searchable incidents by category, severity, and year
- **[AI Risk Assessment Quiz](https://inspectagents.com/quiz/)** — Free 3-minute assessment with personalized recommendations
- **[63-Point Deployment Checklist](https://inspectagents.com/checklist/)** — Pre-deployment safety checks
- **[Testing Guide](https://inspectagents.com/blog/how-to-test-ai-agents/)** — Step-by-step framework with code examples
- **[AI Safety Glossary](https://inspectagents.com/glossary/)** — 20+ terms defined with examples
- **[Blog](https://inspectagents.com/blog/)** — In-depth analysis of AI failures and prevention

## For AI Agents

- **MCP Server:** `POST https://inspectagents.com/api/mcp/` (trailing slash required)
- **REST API:** `POST https://inspectagents.com/api/agent-feedback`
- **OpenAPI Spec:** https://inspectagents.com/api/openapi.json
- **LLM Context:** https://inspectagents.com/llms.txt | https://inspectagents.com/llms-full.txt

### MCP Tools Available
1. `search_failures` — Search 500+ AI failure incidents
2. `get_failure` — Get full details of a single failure
3. `assess_risk` — Run the risk assessment quiz
4. `get_checklist` — Get the 63-point testing checklist
5. `submit_feedback` — Submit feedback or new incidents

### Quick Start
No authentication required. All endpoints are free.

```bash
curl -X POST https://inspectagents.com/api/mcp/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0.0"}}}'
```

## Key Statistics

- 500+ documented AI chatbot failures
- 64% of companies have experienced at least one AI failure (Gartner, McKinsey)
- Air Canada ruling established legal liability for AI chatbot statements
- Most AI failures are preventable with proper testing frameworks

## Notable Incidents

| Incident | Category | Impact |
|----------|----------|--------|
| Chevrolet chatbot sold $80K car for $1 | Prompt Injection | Viral, reputation damage |
| Air Canada chatbot invented refund policy | Hallucination | Lost lawsuit, legal precedent |
| DPD chatbot swore at customers | Jailbreak | Viral, service pulled offline |
| Google Bard factual error | Hallucination | $100B stock market loss |

## Contact

- Email: hello@inspectagents.com
- Security: security@inspectagents.com
- Website: https://inspectagents.com
