import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Risk Quiz - Find Your AI Vulnerabilities in 2 Minutes',
  description: 'Take our free 2-minute quiz to discover your AI agent vulnerabilities and get a personalized risk assessment. Join 1,000+ teams protecting their AI.',
  alternates: {
    canonical: 'https://inspectagents.com/quiz',
  },
  openGraph: {
    title: 'AI Risk Quiz - Find Your AI Vulnerabilities in 2 Minutes',
    description: 'Take our free 2-minute quiz to discover your AI agent vulnerabilities and get a personalized risk assessment.',
    type: 'website',
    url: 'https://inspectagents.com/quiz',
    images: [
      {
        url: 'https://inspectagents.com/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Risk Quiz - InspectAgents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Risk Quiz - Find Your AI Vulnerabilities in 2 Minutes',
    description: 'Take our free 2-minute quiz to discover your AI agent vulnerabilities and get a personalized risk assessment.',
    images: ['https://inspectagents.com/images/og-image.png'],
    creator: '@inspectagents',
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
