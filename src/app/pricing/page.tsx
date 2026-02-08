import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/ComingSoonPage';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for AI agent testing. From free tier to enterprise plans.',
};

export default function PricingPage() {
  return (
    <ComingSoonPage
      featureSlug="pricing"
      icon="💰"
      title="Transparent Pricing"
      description="We're finalizing pricing plans that work for solo developers to enterprise teams. Help us shape what matters most to you."
      bullets={[
        'Free tier with access to failures database & checklist',
        'Per-agent testing plans for growing teams',
        'Enterprise plans with custom benchmarks & SLAs',
        'Volume discounts for CI/CD integration',
        'Open-source community tier',
        'No surprise fees — all pricing published publicly',
      ]}
    />
  );
}
