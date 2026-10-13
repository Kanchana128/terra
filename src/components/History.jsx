import { Clock3 } from 'lucide-react'
import { EmptyState, PageHeading } from './Shared.jsx'

export default function History({ onStart }) {
  return (
    <div>
      <PageHeading eyebrow="ANALYSIS HISTORY" title="Your field notes, over time" description="Keep track of land analyses as your workspace and connected tools grow." />
      <section className="panel history-empty">
        <EmptyState
          icon={Clock3}
          title="Your history starts with your first analysis"
          description="Completed analyses will be listed here once a recommendation engine is connected. No placeholder records are shown."
          action={<button className="button button-primary" onClick={onStart}>Start land analysis <span aria-hidden="true">→</span></button>}
        />
      </section>
    </div>
  )
}
