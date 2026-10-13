import { AlertTriangle, BarChart3, Sprout } from 'lucide-react'
import { EmptyState, PageHeading, CropCard } from './Shared.jsx'

export default function Recommendations({ results, form, onStart }) {
  const crops = results?.crops ?? []
  const hasConditions = Boolean(form.location || form.soilType !== 'Unknown' || form.temperature || form.rainfall)
  return (
    <div>
      <PageHeading
        eyebrow="CROP RECOMMENDATIONS"
        title="Find what fits your field"
        description="Explore recommendations shaped by your land conditions. Results will appear here when an analysis engine is connected."
      />
      {results ? (
        <div className="results-content">
          <section className="panel summary-panel">
            <div className="panel-heading"><div><span className="section-index">01</span><h2>Land analysis summary</h2></div><span className="summary-status">{results.status}</span></div>
            <div className="summary-grid">
              <SummaryItem label="Location" value={results.summary?.location || 'Not provided'} />
              <SummaryItem label="Area" value={results.summary?.area || 'Not provided'} />
              <SummaryItem label="Soil type" value={results.summary?.soilType || 'Unknown'} />
              <SummaryItem label="Temperature" value={results.summary?.temperature || 'Not provided'} />
            </div>
            {results.missingInformation?.length > 0 && <div className="missing-warning"><AlertTriangle size={17} /><div><strong>Information to consider</strong><span>{results.missingInformation.join(' · ')}</span></div></div>}
          </section>
          <div className="section-title-row"><div><span className="section-index">02</span><h2>Recommended crops</h2></div><span>{crops.length} options</span></div>
          {crops.length ? <div className="crop-grid">{crops.slice(0, 3).map((crop, index) => <CropCard key={`${crop.name}-${index}`} crop={crop} rank={index + 1} />)}</div> : <EmptyState title="No recommendations available yet" description="The connected recommendation engine will provide crop options based on your land data." icon={Sprout} />}
          {crops.length > 1 && <ComparisonTable crops={crops.slice(0, 3)} />}
        </div>
      ) : (
        <div className="recommendation-empty-layout">
          <section className="panel recommendation-preview">
            <div className="preview-illustration"><div className="preview-orbit orbit-one" /><div className="preview-orbit orbit-two" /><div className="preview-center"><Sprout size={30} /></div><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" /></div>
            <div className="preview-label"><BarChart3 size={16} /> YOUR LAND, YOUR DATA</div>
            <h2>Recommendations that start with your reality.</h2>
            <p>No assumptions or one-size-fits-all answers. A connected engine can use the conditions you provide to return explainable options.</p>
            <div className="preview-tags">{['Soil conditions', 'Water needs', 'Climate fit'].map((tag) => <span key={tag}>{tag}</span>)}</div>
          </section>
          <section className="panel recommendation-empty-panel">
            <div className="empty-state">
              <div className="empty-icon"><Sprout size={22} /></div>
              <span className="empty-eyebrow">{hasConditions ? 'READY WHEN YOU ARE' : 'A GOOD PLACE TO BEGIN'}</span>
              <h3>Complete a land analysis to view crop recommendations.</h3>
              <p>Your inputs are saved as you move around. Recommendations will only appear when a real analysis engine is connected.</p>
              <button className="button button-primary" onClick={onStart}>Go to land analysis <span aria-hidden="true">→</span></button>
            </div>
          </section>
        </div>
      )}
      <div className="engine-banner"><span className="status-pulse" /><div><strong>Analysis engine not connected yet</strong><span>Connect your recommendation service when it’s ready. No sample or generated results are shown.</span></div></div>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return <div className="summary-item"><span>{label}</span><strong>{value}</strong></div>
}

function ComparisonTable({ crops }) {
  return (
    <section className="panel comparison-panel">
      <div className="panel-heading"><div><span className="section-index">03</span><h2>Crop comparison</h2></div><span className="optional-tag">SIDE BY SIDE</span></div>
      <div className="comparison-scroll"><table><thead><tr><th>Factor</th>{crops.map((crop, i) => <th key={`${crop.name}-${i}`}>{crop.name}</th>)}</tr></thead>
        <tbody>{[['Suitability', 'suitability'], ['Soil compatibility', 'soilCompatibility'], ['Water requirements', 'waterRequirements'], ['Climate compatibility', 'climateCompatibility']].map(([label, key]) => <tr key={key}><td>{label}</td>{crops.map((crop, i) => <td key={`${crop.name}-${i}`}>{crop[key] ?? '—'}</td>)}</tr>)}</tbody>
      </table></div>
    </section>
  )
}
