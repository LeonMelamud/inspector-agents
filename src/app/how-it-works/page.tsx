import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/ComingSoonPage';

export const metadata: Metadata = {
  title: 'How It Works — Testing Methodology',
  description: 'Our AI agent testing methodology: benchmarks, failure modes, scoring framework, and technical architecture.',
};

export default function HowItWorksPage() {
  return (
    <ComingSoonPage
      featureSlug="how-it-works"
      icon="⚙️"
      title="Our Testing Methodology"
      description="Full technical transparency into how we test AI agents. Benchmarks, failure taxonomies, scoring models, and the research behind our approach."
      bullets={[
        'Failure taxonomy: 12 categories across safety, accuracy, and compliance',
        'Benchmark suite based on 500+ real-world incidents',
        'Scoring framework with reproducible metrics',
        'Red-teaming methodology for adversarial testing',
        'Model-specific testing profiles (GPT-4, Claude, Gemini, Llama)',
        'Published research papers and methodology docs',
      ]}
    />
  );
}
