import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Service Requests — InspectAgents',
  description:
    'Request AI agent testing, safety audits, prompt injection testing, or consulting services from InspectAgents. Leave a service request and we\'ll get back to you.',
  alternates: {
    canonical: 'https://inspectagents.com/contact',
  },
  openGraph: {
    title: 'Contact & Service Requests — InspectAgents',
    description:
      'Request AI agent testing, safety audits, and consulting services from InspectAgents.',
    type: 'website',
    url: 'https://inspectagents.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
