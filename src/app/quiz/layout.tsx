import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Risk Quiz - Find Your AI Agent Risks in 3 Steps',
  description: 'Answer two questions and see your AI agent risk result on screen, with matched real incidents and next steps. Free, no account.',
  alternates: {
    canonical: 'https://inspectagents.com/quiz/',
  },
  openGraph: {
    title: 'AI Risk Quiz - Find Your AI Agent Risks in 3 Steps',
    description: 'Answer two questions and see your AI agent risk result on screen, with matched real incidents and next steps. Free, no account.',
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
    title: 'AI Risk Quiz - Find Your AI Agent Risks in 3 Steps',
    description: 'Answer two questions and see your AI agent risk result on screen, with matched real incidents and next steps. Free, no account.',
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
