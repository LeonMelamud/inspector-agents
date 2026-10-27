import QuizClient from './QuizClient';
import {
  CHECKLIST_ITEM_COUNT,
  INCIDENT_COUNT,
  getQuizConcernIncidents,
} from '@/lib/site-stats';

export default function QuizPage() {
  const incidents = getQuizConcernIncidents();
  // Pass only the few fields the client needs, not the dataset.
  const concernCases = Object.fromEntries(
    Object.entries(incidents).map(([k, i]) => [k, { company: i.company, year: i.year, title: i.title }]),
  );
  return (
    <QuizClient
      incidentCount={INCIDENT_COUNT}
      checklistCount={CHECKLIST_ITEM_COUNT}
      concernCases={concernCases}
    />
  );
}
