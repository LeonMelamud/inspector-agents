import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '67-Point AI Agent Risk Checklist - Printable Version',
  description: 'The complete 67-point AI agent pre-deployment checklist across 10 risk categories: hallucination, prompt injection, security, bias, compliance, and more. Free and printable.',
  alternates: {
    canonical: 'https://inspectagents.com/checklist/download/',
  },
};

export default function ChecklistDownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
