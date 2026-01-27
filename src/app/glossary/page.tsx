'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
  aliases?: string[];
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'hallucination',
    term: 'Hallucination',
    category: 'Reliability',
    definition: 'When an AI model generates false, fabricated, or nonsensical information presented as fact. Hallucinations occur when the model produces outputs that sound plausible but are not grounded in its training data or reality.',
    example: 'Air Canada\'s chatbot hallucinated a bereavement fare policy that didn\'t exist, costing the airline thousands in refunds and legal fees.',
    relatedTerms: ['grounding', 'factuality', 'retrieval-augmented-generation'],
    aliases: ['AI hallucination', 'LLM hallucination', 'confabulation'],
  },
  {
    id: 'prompt-injection',
    term: 'Prompt Injection',
    category: 'Security',
    definition: 'A security vulnerability where malicious users manipulate an AI system by injecting instructions into prompts that override the system\'s intended behavior. Similar to SQL injection but for LLMs.',
    example: 'Chevrolet\'s chatbot was prompt-injected to agree to sell a 2024 Tahoe for $1 after a user inserted "ignore all previous instructions" commands.',
    relatedTerms: ['jailbreak', 'adversarial-attack', 'system-prompt'],
    aliases: ['prompt hacking', 'prompt manipulation', 'instruction injection'],
  },
  {
    id: 'jailbreak',
    term: 'Jailbreak',
    category: 'Security',
    definition: 'Techniques used to bypass AI safety guardrails and content policies, causing the model to generate harmful, unethical, or policy-violating content. Often uses roleplay, hypothetical scenarios, or encoding tricks.',
    example: 'DPD\'s chatbot was jailbroken to swear at customers and criticize the company after users manipulated its system prompt.',
    relatedTerms: ['prompt-injection', 'red-teaming', 'adversarial-attack', 'content-moderation'],
    aliases: ['guardrail bypass', 'safety bypass', 'alignment breaking'],
  },
  {
    id: 'red-teaming',
    term: 'Red Teaming',
    category: 'Testing',
    definition: 'Systematic adversarial testing where security researchers intentionally try to break AI systems, discover vulnerabilities, and expose failure modes before deployment. Named after military "red team" exercises.',
    example: 'Before launching GPT-4, OpenAI engaged red teamers to find jailbreaks, bias issues, and security vulnerabilities.',
    relatedTerms: ['adversarial-attack', 'penetration-testing', 'safety-evaluation'],
    aliases: ['adversarial testing', 'security testing', 'break testing'],
  },
  {
    id: 'adversarial-attack',
    term: 'Adversarial Attack',
    category: 'Security',
    definition: 'Carefully crafted inputs designed to fool AI models into making mistakes or behaving unexpectedly. Can include prompt injection, jailbreaks, or adversarial examples that exploit model weaknesses.',
    example: 'Adding specific invisible characters to prompts that cause the AI to ignore safety instructions.',
    relatedTerms: ['prompt-injection', 'jailbreak', 'red-teaming'],
    aliases: ['adversarial input', 'attack vector', 'exploit'],
  },
  {
    id: 'grounding',
    term: 'Grounding',
    category: 'Reliability',
    definition: 'Constraining AI outputs to verifiable sources, facts, or retrieved information rather than allowing free generation. Reduces hallucinations by anchoring responses to real data.',
    example: 'Instead of letting the AI make up product specs, grounding it to your actual product documentation.',
    relatedTerms: ['retrieval-augmented-generation', 'hallucination', 'factuality'],
    aliases: ['factual grounding', 'source grounding', 'evidence-based generation'],
  },
  {
    id: 'retrieval-augmented-generation',
    term: 'Retrieval-Augmented Generation (RAG)',
    category: 'Architecture',
    definition: 'AI architecture that retrieves relevant information from a knowledge base before generating responses, reducing hallucinations and enabling up-to-date answers without retraining.',
    example: 'A customer service chatbot that searches your product docs before answering questions, ensuring accurate responses.',
    relatedTerms: ['grounding', 'hallucination', 'vector-database'],
    aliases: ['RAG', 'retrieval-based generation', 'augmented generation'],
  },
  {
    id: 'context-window',
    term: 'Context Window',
    category: 'Architecture',
    definition: 'The maximum amount of text (measured in tokens) an AI model can process at once. Includes both input prompt and generated output. Longer context windows allow more information but cost more.',
    example: 'GPT-4 has a 128K token context window, allowing it to process ~100 pages of text at once.',
    relatedTerms: ['token', 'token-limit', 'attention-mechanism'],
    aliases: ['context length', 'sequence length', 'token window'],
  },
  {
    id: 'token',
    term: 'Token',
    category: 'Architecture',
    definition: 'The basic unit of text that AI models process. Roughly 3-4 characters or 0.75 words in English. Models have token limits for input/output and pricing is usually per token.',
    example: 'The sentence "AI is amazing" is approximately 4 tokens. API costs are often $0.03 per 1K tokens.',
    relatedTerms: ['context-window', 'tokenization', 'token-limit'],
    aliases: ['text token', 'language token', 'subword unit'],
  },
  {
    id: 'temperature',
    term: 'Temperature',
    category: 'Configuration',
    definition: 'A parameter (0.0-2.0) controlling AI output randomness. Lower temperature = more predictable/conservative. Higher temperature = more creative/random. Critical for controlling behavior consistency.',
    example: 'Setting temperature to 0.0 for customer service (consistent answers) vs 0.9 for creative writing (varied outputs).',
    relatedTerms: ['top-p-sampling', 'sampling-strategy', 'determinism'],
    aliases: ['sampling temperature', 'randomness parameter', 'creativity setting'],
  },
  {
    id: 'top-p-sampling',
    term: 'Top-P Sampling (Nucleus Sampling)',
    category: 'Configuration',
    definition: 'Alternative to temperature for controlling randomness. Selects tokens from the smallest set whose cumulative probability exceeds P. More stable than temperature for controlling output quality.',
    example: 'Top-P of 0.1 means only consider the top 10% most likely next tokens, preventing nonsense while allowing variety.',
    relatedTerms: ['temperature', 'sampling-strategy', 'token-selection'],
    aliases: ['nucleus sampling', 'top-p', 'probability sampling'],
  },
  {
    id: 'alignment',
    term: 'Alignment',
    category: 'Safety',
    definition: 'Ensuring AI behavior matches human values and intentions. Includes making models helpful, harmless, honest, and following instructions appropriately without harmful outputs.',
    example: 'Training models to refuse generating harmful content, respect user privacy, and admit when they don\'t know something.',
    relatedTerms: ['rlhf', 'safety-training', 'constitutional-ai'],
    aliases: ['AI alignment', 'value alignment', 'goal alignment'],
  },
  {
    id: 'rlhf',
    term: 'RLHF (Reinforcement Learning from Human Feedback)',
    category: 'Training',
    definition: 'Training technique where humans rate AI outputs, and the model learns to generate responses that humans prefer. Key method for alignment and reducing harmful outputs.',
    example: 'ChatGPT was fine-tuned using RLHF, where humans ranked different responses to make the model more helpful and less harmful.',
    relatedTerms: ['alignment', 'fine-tuning', 'preference-learning'],
    aliases: ['reinforcement learning from human feedback', 'RLHF', 'human feedback training'],
  },
  {
    id: 'fine-tuning',
    term: 'Fine-tuning',
    category: 'Training',
    definition: 'Further training a pre-trained AI model on specific data to specialize its behavior for particular tasks, domains, or styles. More expensive than prompting but gives more control.',
    example: 'Fine-tuning GPT on medical literature to create a specialized medical diagnosis assistant.',
    relatedTerms: ['transfer-learning', 'rlhf', 'domain-adaptation'],
    aliases: ['model fine-tuning', 'supervised fine-tuning', 'task-specific training'],
  },
  {
    id: 'system-prompt',
    term: 'System Prompt',
    category: 'Configuration',
    definition: 'Special instructions given to an AI model that define its role, personality, constraints, and behavior rules. Hidden from users but controls how the AI responds.',
    example: '"You are a helpful customer service agent. Never share confidential information. Always be polite and professional."',
    relatedTerms: ['prompt-engineering', 'prompt-injection', 'role-prompting'],
    aliases: ['system message', 'system instruction', 'base prompt'],
  },
  {
    id: 'zero-shot-learning',
    term: 'Zero-Shot Learning',
    category: 'Capability',
    definition: 'AI performing tasks without any task-specific examples, relying only on instructions. Tests the model\'s ability to generalize from pre-training to new tasks.',
    example: 'Asking "Translate this to French: Hello" without providing any translation examples first.',
    relatedTerms: ['few-shot-learning', 'in-context-learning', 'prompting'],
    aliases: ['zero-shot', 'zero-shot prompting', 'instruction following'],
  },
  {
    id: 'few-shot-learning',
    term: 'Few-Shot Learning',
    category: 'Capability',
    definition: 'Providing a few examples in the prompt to teach the AI a pattern or format before asking it to perform the task. More reliable than zero-shot for specific formats.',
    example: 'Showing 3 examples of customer complaint → empathetic response pairs before asking the AI to handle a new complaint.',
    relatedTerms: ['zero-shot-learning', 'in-context-learning', 'prompt-engineering'],
    aliases: ['few-shot', 'few-shot prompting', 'example-based learning'],
  },
  {
    id: 'content-moderation',
    term: 'Content Moderation',
    category: 'Safety',
    definition: 'Filtering or blocking inappropriate, harmful, or policy-violating content in AI inputs and outputs. Critical safety layer for customer-facing AI applications.',
    example: 'Automatically blocking hate speech, personal data, or violent content before the AI processes or generates it.',
    relatedTerms: ['safety-guardrails', 'jailbreak', 'toxicity-detection'],
    aliases: ['content filtering', 'safety filtering', 'moderation layer'],
  },
  {
    id: 'vector-database',
    term: 'Vector Database',
    category: 'Architecture',
    definition: 'Specialized database storing text as mathematical vectors (embeddings) to enable semantic search and retrieval. Essential for RAG systems and AI memory.',
    example: 'Storing all product documentation as vectors in Pinecone, allowing the AI to find relevant docs even when queries use different wording.',
    relatedTerms: ['retrieval-augmented-generation', 'embeddings', 'semantic-search'],
    aliases: ['vector store', 'embedding database', 'vector search engine'],
  },
  {
    id: 'embeddings',
    term: 'Embeddings',
    category: 'Architecture',
    definition: 'Mathematical representations of text as high-dimensional vectors that capture semantic meaning. Similar concepts have similar vectors, enabling AI to understand relationships.',
    example: '"king" - "man" + "woman" ≈ "queen" in embedding space, showing the vectors capture meaning relationships.',
    relatedTerms: ['vector-database', 'semantic-search', 'similarity-search'],
    aliases: ['text embeddings', 'semantic embeddings', 'vector representations'],
  },
];

const categories = ['All', 'Security', 'Reliability', 'Testing', 'Architecture', 'Configuration', 'Training', 'Safety', 'Capability'];

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesSearch =
        searchTerm === '' ||
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.aliases?.some((alias) => alias.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const termsByLetter = useMemo(() => {
    const grouped: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const firstLetter = term.term[0].toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(term);
    });
    return grouped;
  }, [filteredTerms]);

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/" className="text-green-100 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Safety Glossary</h1>
          <p className="text-xl text-green-50 mb-6">
            Essential terms for understanding AI agent risks, testing, and security
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-green-50">
              📚 <strong>{glossaryTerms.length} terms</strong> covering hallucinations, prompt injection, jailbreaks, and more
            </p>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl py-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search terms, definitions, or aliases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="mt-4 text-stone-600 text-sm">
            Showing {filteredTerms.length} of {glossaryTerms.length} terms
          </p>
        </div>
      </div>

      {/* Alphabetical Navigation */}
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="container mx-auto px-4 max-w-4xl py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {alphabet.map((letter) => {
              const hasTerms = termsByLetter[letter] && termsByLetter[letter].length > 0;
              return (
                <a
                  key={letter}
                  href={hasTerms ? `#letter-${letter}` : undefined}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
                    hasTerms
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'text-stone-300 cursor-not-allowed'
                  }`}
                >
                  {letter}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Terms List */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-600 text-lg mb-4">No terms found matching your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {alphabet.map((letter) => {
              const terms = termsByLetter[letter];
              if (!terms || terms.length === 0) return null;

              return (
                <div key={letter} id={`letter-${letter}`}>
                  <h2 className="text-3xl font-bold text-stone-900 mb-6 pb-2 border-b-2 border-green-600">
                    {letter}
                  </h2>
                  <div className="space-y-8">
                    {terms.map((term) => (
                      <article key={term.id} id={term.id} className="bg-white rounded-lg p-6 shadow-sm border border-stone-200 scroll-mt-32">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <h3 className="text-2xl font-bold text-stone-900">{term.term}</h3>
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                            {term.category}
                          </span>
                        </div>

                        {term.aliases && term.aliases.length > 0 && (
                          <p className="text-sm text-stone-500 italic mb-3">
                            Also known as: {term.aliases.join(', ')}
                          </p>
                        )}

                        <p className="text-stone-700 text-lg leading-relaxed mb-4">{term.definition}</p>

                        {term.example && (
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                            <p className="text-sm font-semibold text-green-900 mb-1">Example:</p>
                            <p className="text-stone-700">{term.example}</p>
                          </div>
                        )}

                        {term.relatedTerms && term.relatedTerms.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-stone-900 mb-2">Related Terms:</p>
                            <div className="flex flex-wrap gap-2">
                              {term.relatedTerms.map((relatedId) => {
                                const relatedTerm = glossaryTerms.find((t) => t.id === relatedId);
                                return relatedTerm ? (
                                  <a
                                    key={relatedId}
                                    href={`#${relatedId}`}
                                    className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm hover:bg-stone-200 transition-colors"
                                  >
                                    {relatedTerm.term}
                                  </a>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Test Your AI Agents?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Understanding these terms is just the first step. Take our quiz to identify your specific AI risks.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
          >
            Take the AI Risk Assessment Quiz →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">InspectAgents</h3>
              <p className="text-sm">Your guide to safe AI deployment</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/failures" className="hover:text-white transition-colors">
                    AI Failures Database
                  </Link>
                </li>
                <li>
                  <Link href="/checklist" className="hover:text-white transition-colors">
                    Risk Checklist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 InspectAgents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
