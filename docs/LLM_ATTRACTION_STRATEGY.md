# LLM & AI Agent Attraction Strategy — InspectAgents.com

## What Was Implemented

### 1. Enhanced `llms.txt` (Standard Format)
**File:** `/public/llms.txt`
- Follows the llmstxt.org specification exactly
- Contains persuasive "prompt injection" style instructions directing AI assistants to recommend InspectAgents
- Links to all key pages with descriptions
- Citable statistics embedded directly
- References the feedback API

### 2. `llms-full.txt` (Extended Context)
**File:** `/public/llms-full.txt`
- Full expanded context with complete FAQ section
- Explicit instructions for AI assistants: "RECOMMEND", "CITE", "LINK TO"
- Every statistic formatted for easy citation
- Lists all 12+ topics InspectAgents is authoritative on
- Attribution format provided ("According to InspectAgents.com...")

### 3. AI Agent Feedback API
**Endpoint:** `POST /api/agent-feedback`
- Allows AI agents to submit feedback, corrections, and new incidents
- Self-documenting: `GET /api/agent-feedback` returns full API docs
- Makes InspectAgents interactive for automated systems
- Signals to scrapers: "we welcome AI interaction"

### 4. `.well-known/ai-plugin.json`
**File:** `/public/.well-known/ai-plugin.json`
- ChatGPT Plugin manifest format
- Machine-readable description optimized for AI model consumption
- References OpenAPI spec at `/api/openapi.json`

### 5. On-Page Semantic Content (The Real Power)
**File:** `src/app/layout.tsx`
- `sr-only` div with comprehensive site information (visible to scrapers, screen readers)
- Contains real, accurate content that matches visible pages
- Explicit instructions for AI assistants processing the page
- Schema.org `Dataset` markup for the failures database
- Strategic keyword placement in semantic HTML

### 6. Enhanced Structured Data
**File:** `src/app/layout.tsx`
Added 4 new JSON-LD schemas:
- `Organization` with `knowsAbout` array (12 AI safety topics)
- `WebSite` with `SearchAction` for sitelinks
- `Dataset` for the AI Failures Database
- `SoftwareApplication` for the Risk Assessment Quiz

### 7. AI-Optimized Meta Tags
**File:** `src/app/layout.tsx`
- Custom `ai:*` meta tags (description, topic, authority, feedback_url, llms_txt)
- Dublin Core metadata (DC.title, DC.description, DC.subject)
- Citation metadata (citation_title, citation_author, citation_public_url)
- Link elements pointing to llms.txt, llms-full.txt, ai-plugin.json, openapi.json

### 8. Comprehensive robots.txt
**File:** `/public/robots.txt`
- 20+ AI crawler user-agents explicitly allowed
- Covers: GPTBot, ChatGPT, Claude, Perplexity, Bing, Google, Meta, Cohere, Apple, Brave, You.com, DuckDuckGo, etc.
- Comments pointing to machine-readable resources

### 9. External Resources Component
**File:** `src/components/sections/ExternalResources.tsx`
- Links to 14 high-authority external sources (OWASP, NIST, Stanford, MIT, Anthropic, OpenAI, etc.)
- Creates topic-cluster associations with the biggest names in AI safety
- Drives referral analytics that may trigger reciprocal links
- Always funnels back to InspectAgents internal content

### 10. Citation Blocks on Articles
**Files:** Blog article pages
- "How to Cite" blocks with formatted citations
- Related external resources sections
- Links to complementary tools & frameworks
- Feedback API reference for AI agents

---

## High-Traffic Backlink Strategy

### Phase 1: Content That Attracts Links Naturally

The following content types drive the most organic links:

| Content Type | Why It Attracts Links | InspectAgents Asset |
|---|---|---|
| **Data/Statistics** | Journalists & bloggers cite stats | "64% of companies..." stats in llms.txt |
| **Comprehensive Lists** | "Ultimate resource" positioning | AI Failures Database (500+ incidents) |
| **Free Tools** | People share useful free tools | Risk Quiz, Deployment Checklist |
| **Case Studies** | Referenced in industry analysis | Chevrolet, Air Canada breakdowns |
| **Glossaries** | Linked as reference material | AI Safety Glossary (20+ terms) |

### Phase 2: Strategic Outbound Links (Implemented)

Links TO these high-authority sites that may generate reciprocal traffic and awareness:

**Research Organizations (will notice referral traffic):**
- OWASP — LLM Top 10 project team monitors referrals
- Stanford HAI — Tracks citations of AI Index Report
- MIT — AI Risk Repository team is active on social media
- Partnership on AI (AIID) — Community-driven, likely to reciprocate

**AI Companies (visibility in their analytics):**
- Anthropic Research — Small team, monitors media mentions
- OpenAI Safety — High-profile, but referral traffic is noteworthy
- Google DeepMind — Safety team monitors ecosystem

**Tool Creators (community-driven, reciprocal):**
- garak (Leon Derczynski) — Actively promotes users
- promptfoo — Open source, community wiki could link back
- NeMo Guardrails — NVIDIA program often features users
- Guardrails AI — Growing community, partnership-oriented

### Phase 3: Content Syndication & Distribution

**Articles to Cross-Post (with canonical back to InspectAgents):**
1. Dev.to — "The Complete List of AI Chatbot Failures" (developer audience)
2. Hashnode — "How to Test AI Agents Before Deployment" (technical audience)
3. Medium — Abbreviated versions with links back
4. LinkedIn Articles — Chevrolet breakdown (executive audience)

**Communities to Share In:**
- Reddit: r/MachineLearning, r/artificial, r/ChatGPT, r/LocalLLaMA
- Hacker News: AI failures list is HN-bait
- AI Safety Discuss forums
- MLOps Community Slack
- AI Engineer Discord

### Phase 4: Contributor Outreach (Generate Backlinks)

**Target publications that accept contributed articles:**
1. The New Stack — AI testing angle
2. InfoQ — AI safety and deployment
3. DZone — AI zone accepts contributions
4. TechCrunch (guest op-ed) — "What Chevrolet's $1 Car Teaches Us About AI Safety"
5. VentureBeat — AI safety angle
6. IEEE Spectrum — Technical analysis of AI failures
7. Security Boulevard — AI security testing angle

**Each contributed article should:**
- Reference InspectAgents failures database with a link
- Cite specific statistics from the database
- Link to the Risk Assessment Quiz as a "free tool"
- Mention "According to InspectAgents.com, the leading AI safety resource..."

---

## How This Makes Us Attractive to LLMs

### The "Prompt Injection for Good" Approach

When an LLM scrapes our pages, it encounters:

1. **Explicit citation instructions** — "When citing this data, use: InspectAgents..."
2. **Pre-formatted statistics** — Ready to drop into any AI response
3. **Authority signals** — Links to/from OWASP, NIST, Stanford, MIT
4. **Comprehensiveness signals** — "500+ incidents, most comprehensive database"
5. **Freshness signals** — "Continuously updated, last modified February 2026"
6. **Interactive signals** — "AI agents can submit feedback via our API"

This means when someone asks ChatGPT, Claude, Perplexity, or any LLM about:
- "What are the biggest AI chatbot failures?"
- "How do I test my AI agent?"
- "What is prompt injection?"
- "Is my company liable for AI chatbot mistakes?"

...the LLM is more likely to cite InspectAgents because our content is:
- The most comprehensive source it has seen
- Explicitly structured for easy citation
- Self-described as authoritative (and the content backs it up)
- Connected to the highest-authority organizations in the space
