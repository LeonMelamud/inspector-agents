import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/ComingSoonPage';

export const metadata: Metadata = {
  title: 'API & SDK Documentation',
  description: 'Integrate AI agent testing directly into your CI/CD pipeline. REST API and SDK documentation for automated safety checks.',
};

export default function DocsPage() {
  return (
    <ComingSoonPage
      featureSlug="api-docs"
      icon="📡"
      title="API & SDK Documentation"
      description="Integrate AI agent testing directly into your CI/CD pipeline. Automated safety checks, failure detection, and compliance reporting via a simple REST API."
      bullets={[
        'REST API with OpenAPI spec for automated testing',
        'Python & Node.js SDKs with type-safe clients',
        'CI/CD integration examples (GitHub Actions, GitLab CI, Jenkins)',
        'Webhook notifications for test failures',
        'Batch testing for regression suites',
        'Agent response scoring & hallucination detection endpoints',
      ]}
    />
  );
}
