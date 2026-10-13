import { ArrowRight, Leaf, Sprout } from 'lucide-react'

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export function EmptyState({ title, description, action, icon: Icon = Sprout }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={22} strokeWidth={1.7} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}

export function WorkflowStep({ number, icon: Icon, title, description }) {
  return (
    <div className="workflow-step">
      <div className="workflow-icon"><Icon size={21} strokeWidth={1.8} /></div>
      <div className="workflow-copy">
        <div className="workflow-topline"><span>STEP {number}</span><ArrowRight size={15} /></div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export function CropCard({ crop, rank }) {
  return (
    <article className="crop-card">
      <div className="crop-card-top">
        <div className="crop-symbol"><Leaf size={21} /></div>
        <span className="rank-chip">RECOMMENDATION {rank}</span>
      </div>
      <h3>{crop.name}</h3>
      <div className="suitability-row">
        <span>Suitability</span>
        <strong>{crop.suitability ?? '—'}</strong>
      </div>
      {crop.explanation && <p className="crop-explanation">{crop.explanation}</p>}
      <div className="crop-attributes">
        <div><span>Soil compatibility</span><strong>{crop.soilCompatibility ?? '—'}</strong></div>
        <div><span>Water requirements</span><strong>{crop.waterRequirements ?? '—'}</strong></div>
        <div><span>Climate compatibility</span><strong>{crop.climateCompatibility ?? '—'}</strong></div>
      </div>
      {crop.risks?.length > 0 && (
        <div className="crop-risks"><strong>Risks & limitations</strong><p>{crop.risks.join(', ')}</p></div>
      )}
    </article>
  )
}
