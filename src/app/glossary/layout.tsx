import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: 'AI Safety Glossary | Essential Terms for AI Agent Testing',
  description: 'Complete glossary of AI safety, security, and testing terms. Learn about hallucinations, prompt injection, jailbreaks, red teaming, and more AI agent risks.',
  keywords: ['AI safety glossary', 'AI terms', 'hallucination AI', 'prompt injection', 'AI jailbreak', 'red teaming', 'AI security terms', 'LLM glossary', 'AI testing terms', 'machine learning glossary'],
  canonical: 'https://inspectagents.com/glossary',
});

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
