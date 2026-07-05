import { failures } from '@/app/failures/data';
import { CHECKLIST_SECTIONS, CHECKLIST_ITEM_COUNT } from '@/lib/mcp/data/checklist';

export function Stats() {
  return (
    <section className="py-16 bg-primary-900 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2 font-display">{failures.length}</div>
              <p className="text-primary-200 text-sm">AI Failures Documented</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2 font-display">{CHECKLIST_ITEM_COUNT}</div>
              <p className="text-primary-200 text-sm">Testing Criteria</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2 font-display">{CHECKLIST_SECTIONS.length}</div>
              <p className="text-primary-200 text-sm">Risk Categories Covered</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2 font-display">100%</div>
              <p className="text-primary-200 text-sm">Free Resources</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
