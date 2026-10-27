import ThankYouClient from './ThankYouClient';
import {
  CHECKLIST_ITEM_COUNT,
  INCIDENT_COUNT,
  getQuizConcernIncidents,
} from '@/lib/site-stats';

export default function ThankYouPage() {
  return (
    <ThankYouClient
      incidentCount={INCIDENT_COUNT}
      checklistCount={CHECKLIST_ITEM_COUNT}
      concernIncidents={getQuizConcernIncidents()}
    />
  );
}
