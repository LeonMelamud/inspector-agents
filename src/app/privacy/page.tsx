import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - InspectAgents',
  description: 'Privacy policy for InspectAgents. Learn how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary-900 text-white py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-400 mb-3">Legal</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-primary-300 text-sm mt-3">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl prose prose-gray">

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              InspectAgents (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at inspectagents.com (the &ldquo;Site&rdquo;).
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">2. Information We Collect</h2>
            <h3 className="font-bold text-primary-800 text-lg mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Email address (when subscribing to our newsletter or using contact forms)</li>
              <li>Quiz responses (when completing our AI Risk Assessment)</li>
              <li>Any information you voluntarily provide through our forms</li>
            </ul>

            <h3 className="font-bold text-primary-800 text-lg mt-6 mb-3">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device type and operating system</li>
              <li>IP address (anonymized where possible)</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide and improve our services and resources</li>
              <li>Send you our newsletter and relevant content (with your consent)</li>
              <li>Deliver your personalized AI risk assessment results</li>
              <li>Analyze website usage patterns to improve user experience</li>
              <li>Respond to your inquiries and support requests</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">4. Analytics</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We use Vercel Analytics and similar tools to understand how visitors interact with our Site. These services may collect information about your browsing activity. Analytics data is used in aggregate to improve our content and services. We do not sell or share individual-level analytics data with third parties.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">5. Email Communications</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you subscribe to our newsletter, we use third-party email services (such as ConvertKit or Resend) to manage and deliver emails. You can unsubscribe from our emails at any time by clicking the unsubscribe link in any email you receive from us.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">6. Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our Site may use cookies and similar tracking technologies to enhance your experience. Cookies are small data files stored on your device. You can control cookie preferences through your browser settings. Essential cookies required for Site functionality cannot be disabled.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our Site may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party services you interact with.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">8. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of internet transmission or electronic storage is 100% secure.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">9. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Object to processing of your personal information</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary-900 mt-10 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have questions about this Privacy Policy, please reach out via our <a href="https://www.linkedin.com/in/leon-melamud" target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:text-primary-900 underline">LinkedIn profile</a>.
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
