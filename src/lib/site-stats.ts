/**
 * Public numbers and featured incidents, derived from the data files at build time.
 *
 * Server-only by convention: import this from server components (pages, layouts,
 * sections without 'use client') and pass the small results down as props.
 * Importing it from a client component would ship the whole failures dataset.
 *
 * Every count shown on the site should come from here, never from copy.
 */
import { failures } from '@/app/failures/data';
import { CHECKLIST_SECTIONS, CHECKLIST_ITEM_COUNT } from '@/lib/mcp/data/checklist';

export const INCIDENT_COUNT = failures.length;
export const CRITICAL_INCIDENT_COUNT = failures.filter((f) => f.severity === 'Critical').length;
export const INCIDENT_CATEGORY_COUNT = new Set(failures.map((f) => f.category)).size;

export { CHECKLIST_ITEM_COUNT };
export const CHECKLIST_SECTION_COUNT = CHECKLIST_SECTIONS.length;
export const CHECKLIST_CRITICAL_COUNT = CHECKLIST_SECTIONS.reduce(
  (sum, s) => sum + s.items.filter((i) => i.severity === 'critical').length,
  0,
);

/** Small, serialisable summary of one incident for cards and result pages. */
export interface IncidentSummary {
  id: string;
  title: string;
  company: string;
  year: string;
  category: string;
  severity: string;
  description: string;
  cost?: string;
  source: string;
  sourceUrl: string;
}

export function getIncidentSummary(id: string): IncidentSummary {
  const f = failures.find((x) => x.id === id);
  if (!f) throw new Error(`site-stats: unknown incident id "${id}"`);
  return {
    id: f.id,
    title: f.title,
    company: f.company,
    year: f.date.slice(0, 4),
    category: f.category,
    severity: f.severity,
    description: f.description,
    cost: f.cost,
    source: f.source,
    sourceUrl: f.sourceUrl,
  };
}

/**
 * One real incident per quiz concern. Shown next to the quiz answer and on the
 * result page, so the risk framing rests on a documented case, not on a statistic.
 */
export const QUIZ_CONCERN_INCIDENT_IDS = {
  hallucinations: 'air-canada-refund',
  security: 'samsung-leak',
  reputation: 'dpd-profanity',
  cost: 'deloitte-australia-hallucinated-report',
  dontKnow: 'chevrolet-car-sale',
} as const;

export type QuizConcern = keyof typeof QUIZ_CONCERN_INCIDENT_IDS;

export function getQuizConcernIncidents(): Record<QuizConcern, IncidentSummary> {
  const out = {} as Record<QuizConcern, IncidentSummary>;
  for (const [concern, id] of Object.entries(QUIZ_CONCERN_INCIDENT_IDS)) {
    out[concern as QuizConcern] = getIncidentSummary(id);
  }
  return out;
}

/** The headline cases used on the home page and the checklist landing page. */
export const HEADLINE_INCIDENT_IDS = [
  'chevrolet-car-sale',
  'air-canada-refund',
  'dpd-profanity',
  'google-bard-error',
] as const;

export function getHeadlineIncidents(): IncidentSummary[] {
  return HEADLINE_INCIDENT_IDS.map(getIncidentSummary);
}
