import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Risk Quiz - Find Your AI Vulnerabilities in 2 Minutes',
  description: 'Take our free 2-minute quiz to discover your AI agent vulnerabilities and get a personalized risk assessment. Join 1,000+ teams protecting their AI.',
  openGraph: {
    title: 'AI Risk Quiz - Find Your AI Vulnerabilities in 2 Minutes',
    description: 'Take our free 2-minute quiz to discover your AI agent vulnerabilities and get a personalized risk assessment.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Risk Quiz - Find Your AI Vulnerabilities in 2 Minutes',
    description: 'Take our free 2-minute quiz to discover your AI agent vulnerabilities and get a personalized risk assessment.',
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
