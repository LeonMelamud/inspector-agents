import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/ComingSoonPage';

export const metadata: Metadata = {
  title: 'Live Demo — Test Your AI Agent',
  description: 'Paste your AI agent response and get instant safety analysis. No signup required.',
};

export default function DemoPage() {
  return (
    <ComingSoonPage
      featureSlug="live-demo"
      icon="🧪"
      title="Live Agent Testing Sandbox"
      description="Paste your AI agent's response and get an instant safety analysis. No signup, no sales call — just results."
      bullets={[
        'Paste any agent response for instant analysis',
        'Detect hallucinations, prompt injection vulnerabilities, and policy violations',
        'Compare your agent against known failure patterns',
        'Get a shareable safety scorecard',
        'Test against industry-specific compliance rules',
        'Export results for your governance documentation',
      ]}
    />
  );
}
