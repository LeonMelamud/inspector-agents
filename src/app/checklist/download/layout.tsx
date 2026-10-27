import type { Metadata } from 'next';
import { CHECKLIST_ITEM_COUNT, CHECKLIST_SECTIONS } from '@/lib/mcp/data/checklist';

export const metadata: Metadata = {
  title: `${CHECKLIST_ITEM_COUNT}-Point AI Agent Risk Checklist - Printable Version`,
  description: `The complete ${CHECKLIST_ITEM_COUNT}-point AI agent pre-deployment checklist across ${CHECKLIST_SECTIONS.length} risk categories: hallucination, prompt injection, security, bias, compliance, and more. Free and printable.`,
  alternates: {
    canonical: 'https://inspectagents.com/checklist/download/',
  },
};

export default function ChecklistDownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
