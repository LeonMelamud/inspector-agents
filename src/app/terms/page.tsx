import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for InspectAgents. Review our terms and conditions for using our AI agent safety platform.',
  alternates: {
    canonical: 'https://inspectagents.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary-900 text-white py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-400 mb-3">Legal</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Terms of Service</h1>
            <p className="text-primary-300 text-sm mt-3">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl prose prose-gray">

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              By accessing and using the InspectAgents website at inspectagents.com (the &ldquo;Site&rdquo;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Site.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              InspectAgents provides educational resources, tools, and content related to AI agent testing and safety. Our services include, but are not limited to: an AI failures database, risk assessment tools, testing checklists, blog articles, and a glossary of terms. All resources are provided for informational and educational purposes.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">3. Use of Content</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You may use our content subject to the following conditions:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Content is provided for informational purposes only and does not constitute professional advice</li>
              <li>You may not reproduce, distribute, or commercially exploit our content without prior written permission</li>
              <li>You may share links to our content and reference it with proper attribution</li>
              <li>Risk assessment results and recommendations are general guidance, not a substitute for professional security audits</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">4. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              The Site and all content, tools, and resources are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. InspectAgents makes no warranties, expressed or implied, regarding the accuracy, completeness, reliability, or suitability of any information, tool, or resource provided on the Site.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our AI risk assessments, checklists, and recommendations are educational tools and should not be relied upon as the sole basis for security decisions. Organizations should conduct their own thorough testing and consult with qualified professionals.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              InspectAgents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Site or its content. This includes, without limitation, damages for loss of profits, data, or other intangibles, even if InspectAgents has been advised of the possibility of such damages.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">6. User Conduct</h2>
            <p className="text-gray-600 leading-relaxed mb-4">When using our Site, you agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Use the Site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Site</li>
              <li>Interfere with or disrupt the Site or its servers</li>
              <li>Scrape, crawl, or otherwise extract content in bulk without permission</li>
              <li>Misrepresent your identity or affiliation</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              All content on the Site — including text, graphics, logos, icons, data compilations, and software — is the property of InspectAgents or its content suppliers and is protected by applicable intellectual property laws. The InspectAgents name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of InspectAgents.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">8. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our Site may contain links to third-party websites. These links are provided for your convenience only. We do not endorse, control, or assume responsibility for the content or practices of any third-party sites. Your use of third-party sites is at your own risk.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">9. Privacy</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Your use of the Site is also governed by our <Link href="/privacy" className="text-primary-700 hover:text-primary-900 underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">10. Modifications</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Site after any changes constitutes acceptance of the modified terms.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">12. Contact</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have questions about these Terms of Service, please reach out via our <a href="https://www.linkedin.com/in/leon-melamud" target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:text-primary-900 underline">LinkedIn profile</a>.
            </p>

            <div className="border-t border-gray-200 mt-12 pt-8">
              <Link href="/" className="link-arrow text-primary-700 hover:text-primary-900">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
