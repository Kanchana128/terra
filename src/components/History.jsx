import { Clock3, MapPin, Sprout, Trash2, ArrowUpRight } from 'lucide-react'
import { EmptyState, PageHeading } from './Shared.jsx'

export default function History({ history = [], onSelectHistory, onClearHistory, onStart }) {
  return (
    <div>
      <PageHeading
        eyebrow="ANALYSIS HISTORY"
        title="Your scenario analysis log"
        description="Every completed land analysis is preserved with its inputs, scores, and recommendations. Select any past scenario to reload its full evaluation."
        action={
          history.length > 0 && (
            <button
              className="button button-secondary"
              onClick={onClearHistory}
              style={{ fontSize: '10px', color: '#b45242' }}
            >
              <Trash2 size={13} /> Clear log ({history.length})
            </button>
          )
        }
      />

      {history.length > 0 ? (
        <div className="history-grid">
          {history.map((record) => {
            const topCrop = record.results?.topRecommendations?.[0] || record.results?.crops?.[0]
            const badgeClass =
              topCrop?.suitability === 'Strong match' ? 'strong' :
              topCrop?.suitability === 'Conditional match' ? 'conditional' : 'poor'

            return (
              <article key={record.id} className="history-card">
                <div className="history-main">
                  <div className="history-header">
                    <MapPin size={15} color="var(--green)" />
                    <strong>{record.summary?.location || 'Scenario Plot'}</strong>
                    <span className="history-date">{record.formattedDate}</span>
                  </div>

                  <div className="history-details">
                    <span>Area: <b>{record.summary?.area || 'Unspecified'}</b></span>
                    <span>·</span>
                    <span>Soil: <b>{record.summary?.soilType || 'Unknown'}</b> ({record.summary?.soilPh || 'pH unmeasured'})</span>
                    <span>·</span>
                    <span>Rainfall: <b>{record.summary?.rainfall || 'Unrecorded'}</b></span>
                    <span>·</span>
                    <span>Water: <b>{record.summary?.waterAvailability || 'Unknown'}</b></span>
                  </div>

                  {topCrop && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Top match:</span>
                      <strong style={{ fontSize: '10.5px' }}>{topCrop.name}</strong>
                      <span className={`suitability-badge ${badgeClass}`} style={{ fontSize: '8px', padding: '2px 6px' }}>
                        {topCrop.suitability} ({topCrop.score} pts)
                      </span>
                      <span style={{ fontSize: '8.5px', color: 'var(--muted)', marginLeft: 'auto' }}>
                        Completeness: {record.completeness?.percentage || 0}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="history-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => onSelectHistory(record)}
                    style={{ fontSize: '10px', minHeight: '34px' }}
                  >
                    View results <ArrowUpRight size={13} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <section className="panel history-empty">
          <EmptyState
            icon={Clock3}
            title="No analyses recorded yet"
            description="Run your first scenario analysis to automatically record its inputs and crop recommendations in this log."
            action={
              <button className="button button-primary" onClick={onStart}>
                Start land analysis <span aria-hidden="true">→</span>
              </button>
            }
          />
        </section>
      )}
    </div>
  )
}
