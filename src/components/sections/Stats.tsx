import {
  CHECKLIST_ITEM_COUNT,
  CHECKLIST_SECTION_COUNT,
  CRITICAL_INCIDENT_COUNT,
  INCIDENT_COUNT,
} from '@/lib/site-stats';

const STATS = [
  { value: INCIDENT_COUNT, label: 'AI failures documented, each with a source' },
  { value: CRITICAL_INCIDENT_COUNT, label: 'of them rated critical severity' },
  { value: CHECKLIST_ITEM_COUNT, label: 'pre-launch checks in the checklist' },
  { value: CHECKLIST_SECTION_COUNT, label: 'risk categories covered' },
];

export function Stats() {
  return (
    <section className="py-16 bg-primary-900 text-white" aria-label="InspectAgents by the numbers">
      <div className="container mx-auto px-4 lg:px-8">
        <dl className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-primary-200 text-sm leading-snug">{s.label}</dt>
              <dd className="text-3xl md:text-4xl font-bold text-accent-400 mb-2 font-display tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
