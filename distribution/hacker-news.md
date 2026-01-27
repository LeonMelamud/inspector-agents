# Hacker News "Show HN" Post

## 🎯 HN Strategy

**Timing**: Tuesday, 12:00 PM PT (peak HN traffic)  
**Angle**: Technical resource, not marketing  
**Tone**: Engineer-to-engineer, humble, transparent  
**Goal**: Front page for 4+ hours, 100+ points, 30+ comments

---

## 📝 Show HN Post

### Title (80 characters max - HN truncates)
```
Show HN: AI Failures Database – 500+ documented chatbot incidents with prevention tips
```

**Alternative Titles** (A/B test if first doesn't work):
```
Show HN: I compiled every major AI chatbot failure from 2016-2026
```
```
Show HN: Database of AI agent failures (Chevrolet $1 car, Air Canada lawsuit, etc.)
```
```
Show HN: Free AI testing toolkit – learn from 500+ real chatbot failures
```

**Title Rules for HN**:
- Start with "Show HN:" (required)
- Be specific, not clickbaity
- Mention concrete value (database, X failures, etc.)
- Avoid hype words ("amazing", "revolutionary")
- Keep under 80 chars or it truncates

---

### Post Body (First Comment - Post Immediately)

```markdown
Hey HN!

I've spent the last several months building a database of every major AI agent failure I could document. The result is 500+ incidents spanning 2016-2024, from minor bugs to $100M market cap losses.

**What this is:**

A searchable database of AI chatbot failures with:
- Full incident details (what happened, when, how)
- Business impact assessment ($$$)
- Root cause analysis (hallucination vs injection vs jailbreak)
- Prevention strategies for each failure type
- Source citations to original reports

Plus a free 50-point testing checklist and interactive risk quiz.

**Why I built it:**

I noticed teams kept making the same mistakes:
- Assuming demos = production-ready
- Skipping adversarial testing
- Not understanding prompt injection attack surface
- Trusting LLMs with PII without validation
- Launching without monitoring/kill switches

Each failure in the database is preventable with proper testing. The Chevrolet $1 car incident? Classic prompt injection - testable in 5 minutes. Air Canada hallucinated refund policy? Grounding failure - also testable.

**Technical details:**

Built with Next.js static export (GitHub Pages/Vercel). Client-side filtering for instant search. All incidents manually researched and verified with primary sources. No fluff, no SEO spam - just documented failures and what went wrong.

The testing checklist covers 8 categories:
1. Hallucination detection (citation verification, grounding checks)
2. Prompt injection prevention (delimiter confusion, role hijacking, RAG poisoning)
3. Security testing (PII leakage, auth bypass, session hijacking)
4. Jailbreak resistance (profanity, harmful content, multi-step manipulation)
5. Output validation (format compliance, link checking, completeness)
6. Bias auditing (gender, racial, age, socioeconomic stereotypes)
7. Content moderation (illegal activity, regulated industries, copyright)
8. Production monitoring (real-time logging, human review, kill switches)

**What I learned:**

- 72% of failures are hallucinations (grounding problems, not model limitations)
- 18% are prompt injection variants (wildly underestimated threat)
- 6% are jailbreaks (humans are creative)
- 4% are security/privacy breaches (PII leakage, auth bugs)

Most failures happened because teams treated LLMs like deterministic APIs. They're not. They're stochastic parrots that need guard rails.

**Why it's free:**

AI safety shouldn't be gatekept. Every developer - from solo hackers to FAANG engineers - should have access to failure case studies. Consider it my contribution to making AI less likely to destroy someone's business.

**What I need from HN:**

1. **More failures** - Know of incidents I missed? Please share. Especially international ones (my database skews US/UK).

2. **Testing gaps** - What's missing from the checklist? What would YOU test before shipping an AI agent?

3. **Use cases** - What AI agents are you building? What keeps you up at night about them?

4. **Feedback** - Be brutally honest. What would make this more useful?

I'm here all day to discuss specific failure modes, testing strategies, or why prompt injection is way more dangerous than most people think.

Link: https://inspectagents.com/failures

Also check out:
- Interactive risk quiz: https://inspectagents.com/quiz
- 50-point testing checklist: https://inspectagents.com/checklist
- Glossary of AI safety terms: https://inspectagents.com/glossary

Happy to answer technical questions about any of the failures or testing approaches.
```

---

## 💬 HN Comment Response Templates

### For Technical Questions
```
Great question. [Specific technical answer]

The [incident name] case is a perfect example. [Explain incident details]

From a testing perspective, you'd want to:
1. [Specific test]
2. [Specific test]
3. [Specific test]

Are you dealing with this in production? Curious what your testing stack looks like.
```

### For "This isn't a real problem" Skepticism
```
Fair point. I thought the same until I saw the Air Canada case go to tribunal.

The court ruled that the company is legally liable for its chatbot's hallucinations - even when they contradict written policies. That's a precedent.

Here's the ruling: [link to official source]

Whether it's a "big" problem depends on your risk tolerance. For a chatbot making airline policy decisions? Definitely. For a toy project? Probably overkill.

What's your use case?
```

### For "How do you prevent X?" Questions
```
Good question. For [specific failure type], here's what works:

**Testing approach:**
- [Specific test 1]
- [Specific test 2]
- [Specific test 3]

**Production safeguards:**
- [Runtime guard 1]
- [Runtime guard 2]
- [Monitoring approach]

The [relevant failure from database] incident showed what happens when you skip [specific step].

We have a more detailed breakdown in the checklist: [link to specific section]

Are you dealing with this in prod or planning ahead?
```

### For "What about X tool/service?" Questions
```
[Tool X] is great for [their specific use case]. We're complementary - they handle [their thing], we focus on learning from real-world failures.

Our database includes incidents where even well-tested systems failed, so you can see blind spots.

Think of it as: [Tool X] = preventive, InspectAgents = case studies.

Do you use [Tool X] in production? Curious what gaps you've found.
```

### For Feature Suggestions
```
This is a great idea. [Validate their suggestion]

We're tracking feature requests. A few questions to help prioritize:
1. [Clarifying question]
2. [Use case question]
3. [Frequency question]

What's your specific use case? That helps us understand which features matter most.
```

### For "Why not just use [LLM provider's] safety tools?"
```
Good point. Provider tools (OpenAI moderation API, Anthropic constitutional AI, etc.) catch some issues.

But they don't catch:
- Domain-specific hallucinations (see Air Canada refund policy)
- Business logic violations (see Chevrolet $1 car)
- Indirect prompt injection via RAG (see Bing Sydney)
- PII leakage in generated responses

Provider tools are necessary but not sufficient. You still need application-layer testing.

The checklist covers both provider-level and app-level safeguards.

What provider are you using? We can discuss specific gaps.
```

### For "This seems like obvious stuff"
```
You'd think! But:

- Chevrolet shipped a chatbot without testing prompt injection
- Air Canada shipped without verifying policy grounding
- DPD shipped without profanity filtering
- Google Bard demo'd with a factual error that cost $100B

These aren't small companies or incompetent teams. These are obvious-in-retrospect failures that weren't obvious before they happened.

The database exists precisely because "obvious" doesn't mean "tested."

What's your testing checklist look like?
```

### For "How did you research this?"
```
Good question. Process was:

1. **Public sources**: News articles, court documents, company statements, Twitter incidents
2. **Verification**: Multiple independent sources for each incident
3. **Primary sources where possible**: Official rulings (Air Canada), company disclosures (Google Bard), verified social media
4. **Exclusions**: Rumors, unverified claims, second-hand reports

It took ~200 hours to compile and verify 500+ incidents. Definitely the long way, but I wanted it to be citable.

If you know of incidents with primary sources I missed, please share! Especially non-English sources - my database skews US/UK.
```

### For Contributors Sharing More Failures
```
This is gold, thank you! [Acknowledge their contribution]

Do you have a link to a primary source (news article, company statement, court doc)? I want to add it but keep the database verified.

Also curious:
- Date of incident?
- Estimated business impact?
- Root cause (hallucination, injection, jailbreak, other)?

Really appreciate you sharing. These case studies are invaluable.
```

---

## 🎯 HN Engagement Strategy

### Pre-Post Checklist
- [ ] Account is aged (older accounts get more credibility)
- [ ] Recent HN activity (commented on other posts this week)
- [ ] Links tested and working
- [ ] Post scheduled for peak time (Tue-Thu, 9 AM - 2 PM PT)
- [ ] Prepared responses for likely questions
- [ ] Team ready to upvote (authentically, not vote brigade)

### First 2 Hours (Critical)
- [ ] Monitor comments every 15 minutes
- [ ] Respond to EVERY comment within 30 minutes
- [ ] Be technical and specific, not promotional
- [ ] Acknowledge valid criticism
- [ ] Share additional details when asked
- [ ] Link to relevant database entries
- [ ] Engage with people who comment (ask follow-up questions)

### Hours 2-6 (Momentum Building)
- [ ] Continue responding to all comments
- [ ] Upvote insightful comments
- [ ] Share additional examples from database
- [ ] Ask the community for help (more failures, testing gaps)
- [ ] Be humble about limitations
- [ ] Offer to add suggested features to roadmap

### Hours 6-24 (Maintenance)
- [ ] Check comments every 1-2 hours
- [ ] Respond to stragglers
- [ ] Thank contributors who shared new failures
- [ ] Summarize key feedback in a follow-up comment
- [ ] Monitor front page position

### Post-24hr
- [ ] Final thank you comment
- [ ] Note feature requests to implement
- [ ] Track traffic/conversions from HN
- [ ] Screenshot front page achievement (if reached)
- [ ] Follow up with engaged users

---

## 🚨 HN-Specific Rules to Follow

### DO:
✅ Be technical and specific  
✅ Share methodology transparently  
✅ Acknowledge limitations  
✅ Respond to ALL comments  
✅ Ask for community input  
✅ Credit sources  
✅ Be humble  
✅ Engage authentically  

### DON'T:
❌ Use marketing speak  
❌ Ignore negative feedback  
❌ Be defensive  
❌ Mention "free" repeatedly (HN hates this)  
❌ Vote brigade (HN detects this)  
❌ Crosspost to Twitter immediately (wait 4+ hours)  
❌ Edit title after posting (against rules)  
❌ Delete and repost (bannable)  

---

## 📊 Success Metrics

### Minimum Success
- 50+ points
- 15+ comments
- 2+ hours on front page
- 200+ site visitors from HN

### Target Success
- 100+ points
- 30+ comments
- 4+ hours on front page
- 500+ site visitors
- 5+ new failure contributions from community

### Stretch Success
- 200+ points
- 50+ comments
- #1 on front page
- 8+ hours visibility
- 1,000+ site visitors
- 20+ new failure contributions
- Mentioned in HN Weekly newsletter

---

## 🔗 Links Format

HN auto-linkifies URLs. Use this format in comments:

```
Database: https://inspectagents.com/failures

Specific failure: https://inspectagents.com/failures#chevrolet

Quiz: https://inspectagents.com/quiz

Checklist: https://inspectagents.com/checklist/download

Blog post on testing: https://inspectagents.com/blog/how-to-test-ai-agents
```

Add `?ref=hackernews` to track traffic:
```
https://inspectagents.com/failures?ref=hackernews
```

---

## 🧪 If Your Post Doesn't Gain Traction

### Common Reasons HN Posts Fail:
1. **Posted at wrong time** - Try Tue-Thu, 9 AM - 2 PM PT
2. **Title was too marketing-y** - Rewrite to be more technical
3. **First comment was weak** - Add more technical depth
4. **Didn't respond to comments** - Engagement is critical
5. **Topic didn't resonate** - Database angle > SaaS product angle

### Recovery Options:
- **Wait 1 week**, rewrite title, repost (different angle)
- Focus on other channels (Reddit r/MachineLearning might love this)
- Post individual blog articles as separate Show HN posts
- Engage in HN comments on related topics, build karma

---

## 💡 Pro Tips from Successful Show HN Posts

1. **Lead with the problem, not the solution** - "Teams keep shipping unsafe AI" resonates more than "I built a tool"

2. **Show your work** - HN loves methodology. Explain how you compiled the database.

3. **Be vulnerable** - Share what you learned, mistakes you made, limitations

4. **Ask for help** - "What failures did I miss?" invites engagement

5. **Go deep in comments** - Don't just respond, teach. Share knowledge.

6. **Technical credibility matters** - Use precise language (hallucination, grounding, injection)

7. **Cite sources** - Link to original reports, court docs, company statements

8. **Respect the community** - HN is engineers helping engineers. No BS.

---

**Remember**: HN values substance over style. Your database is inherently valuable to engineers building AI. Let the work speak for itself.

Good luck! 🚀
