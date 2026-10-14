import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Copy,
  HelpCircle,
  Info,
  Layers,
  Leaf,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
  Sprout
} from 'lucide-react'
import { EmptyState, PageHeading } from './Shared.jsx'
import {
  ScoreRing,
  InteractivePhGauge,
  RainfallGauge,
  CropDistributionBar,
  CropSuitabilityBarChart,
  CropRequirementMatrix,
  ClimateMonthlyChart,
  LandInsightsPanel,
  LandConditionOverview,
  RadarComparisonChart
} from './Visualizations.jsx'

export default function Recommendations({ results, form, onStart }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedScores, setExpandedScores] = useState({})
  const [copied, setCopied] = useState(false)
  const [analyticsView, setAnalyticsView] = useState('barchart') // 'barchart' | 'matrix' | 'radar'
  const [selectedCropId, setSelectedCropId] = useState(results?.crops?.[0]?.id || null)

  const crops = results?.crops ?? []
  const hasConditions = Boolean(
    form.location ||
    form.soilType !== 'Unknown' ||
    form.temperature ||
    form.rainfall ||
    form.description
  )

  const filteredCrops = crops.filter((crop) => {
    if (activeFilter === 'strong') return crop.suitability === 'Strong match'
    if (activeFilter === 'conditional') return crop.suitability === 'Conditional match'
    if (activeFilter === 'poor') return crop.suitability === 'Poor match'
    return true
  })

  const strongCount = crops.filter((c) => c.suitability === 'Strong match').length
  const conditionalCount = crops.filter((c) => c.suitability === 'Conditional match').length
  const poorCount = crops.filter((c) => c.suitability === 'Poor match').length

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0]

  function toggleScoreExpand(id) {
    setExpandedScores((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleSelectCrop(crop) {
    setSelectedCropId(crop.id)
    const cardEl = document.getElementById(`crop-card-${crop.id}`)
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  function handleCopyReport() {
    if (!results) return
    const text = `
# TerraSense AI - Agricultural Land Analysis Report
Date: ${results.formattedDate}
Location: ${results.summary.location}
Area: ${results.summary.area}
Soil: ${results.summary.soilType} | pH: ${results.summary.soilPh}
Rainfall: ${results.summary.rainfall} | Temp: ${results.summary.temperature}
Water Availability: ${results.summary.waterAvailability} | Irrigation: ${results.summary.irrigation}
Drainage: ${results.summary.drainage} | Season: ${results.summary.growingSeason}
Data Completeness: ${results.completeness.percentage}% (${results.completeness.knownCount}/${results.completeness.totalCount} evaluated)

## Recommendations Summary:
${crops.map((c, i) => `${i + 1}. ${c.name} (${c.category})
   - Suitability: ${c.suitability} (Justified Score: ${c.score}/100)
   - Matches: ${c.matchingConditions.join('; ') || 'None'}
   - Limitations: ${c.limitingConditions.join('; ') || 'None'}
   - Missing factors: ${c.missingImpact.join('; ') || 'None'}
   - Recommended Next Steps: ${c.nextSteps.join('; ')}`).join('\n\n')}

*Disclaimer: Preliminary rule-based analysis based strictly on submitted parameters. Field verification recommended before capital investment.*
`.trim()

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <div>
      <PageHeading
        eyebrow="CROP RECOMMENDATIONS"
        title="Find what fits your field"
        description="Evidence-based crop suitability shaped by your land conditions. Recommendations are explainable, highlight constraints, and clearly separate verified data from unknowns."
        action={results && (
          <button className="export-btn" onClick={handleCopyReport} title="Copy formatted summary to clipboard">
            {copied ? <ClipboardCheck size={14} color="#166534" /> : <Copy size={14} />}
            <span>{copied ? 'Report copied!' : 'Copy analysis report'}</span>
          </button>
        )}
      />

      {results ? (
        <div className="results-content">
          {/* Section 01: Land Condition Overview & Core Scales */}
          <section className="panel summary-panel">
            <div className="panel-heading">
              <div>
                <span className="section-index">01</span>
                <h2>Land condition overview</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="completeness-badge" title="Parameters verified vs total evaluated">
                  <span>Data Completeness:</span>
                  <div className="completeness-bar-wrap">
                    <div
                      className="completeness-bar-fill"
                      style={{ width: `${results.completeness.percentage}%` }}
                    />
                  </div>
                  <strong>{results.completeness.percentage}%</strong>
                </div>
                <span className="summary-status">{results.status}</span>
              </div>
            </div>

            {/* Compact Information Cards for Soil, pH, Rain, Temp, Water, Drainage */}
            <LandConditionOverview
              summary={results.summary}
              knownConditions={results.knownConditions}
            />

            {/* Interactive pH Scale & Climate Visualization Side-by-Side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginTop: '14px' }}>
              {/* Interactive Soil pH Gauge */}
              <InteractivePhGauge
                value={results.knownConditions?.soilPh}
                showNote={true}
              />

              {/* Rainfall and Temperature Visualization */}
              <ClimateMonthlyChart
                monthlyData={results.monthlyClimateData}
                annualRainfall={results.summary.rainfall}
                temperature={results.summary.temperature}
                source={results.climateSource}
              />
            </div>

            {/* Case study context if provided */}
            {results.summary.description && (
              <div style={{ marginTop: '14px', padding: '10px 12px', background: 'var(--canvas)', borderRadius: '6px', fontSize: '9.5px', color: 'var(--muted)', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--ink)' }}>Case study context: </strong>
                {results.summary.description}
              </div>
            )}
          </section>

          {/* Section 02: Land Analysis Insights Panel */}
          <LandInsightsPanel
            insights={results.insights}
            completeness={results.completeness}
          />

          {/* Section 03: Visual Crop Suitability & Comparative Analytics */}
          <section className="panel visual-analytics-panel">
            <div className="panel-heading">
              <div>
                <span className="section-index">03</span>
                <h2>Crop suitability & comparative analytics</h2>
              </div>
              {/* Analytics View Switcher */}
              <div className="filter-tabs">
                <button
                  type="button"
                  className={`filter-tab ${analyticsView === 'barchart' ? 'active' : ''}`}
                  onClick={() => setAnalyticsView('barchart')}
                >
                  Suitability Bar Chart
                </button>
                <button
                  type="button"
                  className={`filter-tab ${analyticsView === 'matrix' ? 'active' : ''}`}
                  onClick={() => setAnalyticsView('matrix')}
                >
                  Requirement Matrix
                </button>
                <button
                  type="button"
                  className={`filter-tab ${analyticsView === 'radar' ? 'active' : ''}`}
                  onClick={() => setAnalyticsView('radar')}
                >
                  5-Factor Radar
                </button>
              </div>
            </div>

            <p className="panel-description">
              {analyticsView === 'barchart' && 'Horizontal comparison of candidate suitability scores. Click any crop bar to view its specific agronomic fit.'}
              {analyticsView === 'matrix' && 'Requirement compatibility matrix across soil, pH, rainfall, temperature, water, and drainage.'}
              {analyticsView === 'radar' && 'Multi-dimensional radar chart mapping top candidates across the 5 evaluation dimensions.'}
            </p>

            {/* View Mode 1: Horizontal Bar Chart */}
            {analyticsView === 'barchart' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', alignItems: 'start' }}>
                <CropSuitabilityBarChart
                  crops={crops}
                  selectedCropId={selectedCrop?.id}
                  onSelectCrop={handleSelectCrop}
                />

                {/* Selected Crop Focus Callout */}
                {selectedCrop && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px 16px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="analytics-eyebrow">SELECTED CANDIDATE FOCUS</span>
                      <span className={`suitability-badge ${selectedCrop.suitability === 'Strong match' ? 'strong' : selectedCrop.suitability === 'Conditional match' ? 'conditional' : 'poor'}`}>
                        {selectedCrop.suitability}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ScoreRing score={selectedCrop.score} size={46} strokeWidth={4.5} />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--ink)' }}>{selectedCrop.name}</h3>
                        <span style={{ fontSize: '9px', fontStyle: 'italic', color: 'var(--muted)' }}>
                          {selectedCrop.scientificName} · {selectedCrop.category}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: '4px 0 0', fontSize: '9.5px', color: 'var(--muted)', lineHeight: '1.5' }}>
                      {selectedCrop.explanation}
                    </p>

                    {selectedCrop.matchingConditions?.length > 0 && (
                      <div style={{ fontSize: '8.5px', color: '#166534', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                        <CheckCircle2 size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span><strong>Match: </strong>{selectedCrop.matchingConditions[0]}</span>
                      </div>
                    )}

                    {selectedCrop.limitingConditions?.length > 0 && (
                      <div style={{ fontSize: '8.5px', color: '#b45309', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                        <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span><strong>Limitation: </strong>{selectedCrop.limitingConditions[0]}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleSelectCrop(selectedCrop)}
                      style={{ marginTop: '4px', minHeight: '30px', fontSize: '9px' }}
                    >
                      Jump to detailed profile ↓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* View Mode 2: Requirement Comparison Matrix */}
            {analyticsView === 'matrix' && (
              <CropRequirementMatrix crops={crops} />
            )}

            {/* View Mode 3: 5-Factor Radar Matrix */}
            {analyticsView === 'radar' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RadarComparisonChart crops={crops} width={340} height={290} />
                </div>

                {/* Radar Axis Explanation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '14px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '8.5px' }}>
                  <span className="analytics-eyebrow">AXIS EVALUATION WEIGHTS</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>Soil Texture:</span>
                    <strong>20% (Physical aeration & tilth)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>Soil pH:</span>
                    <strong>20% (Nutrient bioavailability)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>Moisture & Rainfall:</span>
                    <strong>30% (Hydration & irrigation)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>Temperature / Climate:</span>
                    <strong>15% (Vegetative & floral comfort)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                    <span>Field Drainage:</span>
                    <strong>15% (Waterlogging & root hypoxia tolerance)</strong>
                  </div>
                  <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '8px', fontStyle: 'italic' }}>
                    Unmeasured dimensions are not assigned artificial zero values; only verified dimensions are mapped.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Section 04: Detailed Crop Cards List */}
          <div>
            <div className="section-title-row">
              <div>
                <span className="section-index">04</span>
                <h2>Detailed crop suitability profiles ({filteredCrops.length})</h2>
              </div>
              <div className="filter-tabs">
                <button
                  type="button"
                  className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({crops.length})
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeFilter === 'strong' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('strong')}
                >
                  Strong match ({strongCount})
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeFilter === 'conditional' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('conditional')}
                >
                  Conditional ({conditionalCount})
                </button>
                <button
                  type="button"
                  className={`filter-tab ${activeFilter === 'poor' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('poor')}
                >
                  Poor match ({poorCount})
                </button>
              </div>
            </div>

            {filteredCrops.length > 0 ? (
              <div className="crop-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                {filteredCrops.map((crop, index) => (
                  <UpgradedCropCard
                    key={`${crop.id}-${index}`}
                    crop={crop}
                    rank={index + 1}
                    isSelected={crop.id === selectedCrop?.id}
                    isScoreExpanded={Boolean(expandedScores[crop.id])}
                    onToggleScore={() => toggleScoreExpand(crop.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sprout}
                title="No crops in this category"
                description={`None of the evaluated crops fall under the "${activeFilter}" filter for this scenario.`}
                action={
                  <button className="button button-secondary" onClick={() => setActiveFilter('all')}>
                    View all crops
                  </button>
                }
              />
            )}
          </div>

          {/* Preliminary Nature & Scientific Disclaimer */}
          <div className="engine-banner" style={{ borderLeft: '3px solid var(--green)' }}>
            <Sprout size={18} color="var(--green)" />
            <div>
              <strong>Methodology & Preliminary Advisory</strong>
              <span>
                TerraSense AI recommendations are rule-based agronomic assessments grounded in ICAR/FAO reference thresholds. Because micro-climates, soil biological activity, and local pest strains vary, recommendations should be validated through certified soil laboratory analysis before planting.
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State when no analysis has been run */
        <div className="recommendation-empty-layout">
          <section className="panel recommendation-preview">
            <div className="preview-illustration">
              <div className="preview-orbit orbit-one" />
              <div className="preview-orbit orbit-two" />
              <div className="preview-center"><Sprout size={30} /></div>
              <span className="orbit-dot dot-one" />
              <span className="orbit-dot dot-two" />
              <span className="orbit-dot dot-three" />
            </div>
            <div className="preview-label"><BarChart3 size={16} /> YOUR LAND, YOUR DATA</div>
            <h2>Recommendations that start with your reality.</h2>
            <p>No assumptions or one-size-fits-all answers. Our explainable rule-based engine tests your land scenario against crop soil, rainfall, and thermal requirements.</p>
            <div className="preview-tags">
              {['Soil texture & pH', 'Rainfall & Irrigation', 'Thermal comfort', 'Drainage fit', 'Risk management'].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>

          <section className="panel recommendation-empty-panel">
            <div className="empty-state">
              <div className="empty-icon"><Sprout size={22} /></div>
              <span className="empty-eyebrow">{hasConditions ? 'READY TO EVALUATE' : 'GETTING STARTED'}</span>
              <h3>Run land analysis to view recommendations.</h3>
              <p>Your inputs are preserved across views. Connect your land details or load one of the TERRAFORM test scenarios to see the engine in action.</p>
              <button className="button button-primary" onClick={onStart}>
                Go to land analysis <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function UpgradedCropCard({ crop, rank, isSelected, isScoreExpanded, onToggleScore }) {
  const badgeClass =
    crop.suitability === 'Strong match' ? 'strong' :
    crop.suitability === 'Conditional match' ? 'conditional' : 'poor'

  return (
    <article
      id={`crop-card-${crop.id}`}
      className="crop-card"
      style={{
        border: isSelected ? '1.5px solid var(--green)' : '1px solid var(--border)',
        boxShadow: isSelected ? '0 4px 16px rgba(22, 101, 52, 0.12)' : 'var(--shadow)',
        transition: 'all 0.25s ease'
      }}
    >
      <div className="crop-card-header">
        <div className="crop-card-top">
          <div className="crop-symbol"><Leaf size={18} /></div>
          <span className="rank-chip">CANDIDATE #{rank}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ScoreRing score={crop.score} size={44} strokeWidth={4} />
          <span className={`suitability-badge ${badgeClass}`}>
            {crop.suitability}
          </span>
        </div>
      </div>

      <div className="crop-card-title-group" style={{ marginTop: '10px' }}>
        <h3>{crop.name}</h3>
        {crop.scientificName && <span className="scientific">{crop.scientificName} · {crop.category}</span>}
      </div>

      <p className="crop-explanation" style={{ margin: '8px 0 0' }}>
        {crop.explanation}
      </p>

      {/* Quick compatibility row */}
      <div className="crop-attributes" style={{ marginTop: '10px' }}>
        <div>
          <span>Soil compatibility</span>
          <strong style={{ color: crop.soilCompatibility === 'Optimal' ? 'var(--green)' : crop.soilCompatibility === 'Incompatible' ? '#aa4033' : 'var(--ink)' }}>
            {crop.soilCompatibility}
          </strong>
        </div>
        <div>
          <span>Water demand</span>
          <strong>{crop.waterRequirements}</strong>
        </div>
        <div>
          <span>Climate fit</span>
          <strong>{crop.climateCompatibility}</strong>
        </div>
      </div>

      {/* Structured Agronomic Reasoning Breakdown */}
      <div className="crop-card-details-section">
        {/* Conditions that Match */}
        {crop.matchingConditions?.length > 0 && (
          <div className="detail-block">
            <div className="detail-block-title match">
              <CheckCircle2 size={12} />
              <span>Matching Conditions ({crop.matchingConditions.length})</span>
            </div>
            <ul>
              {crop.matchingConditions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Conditions that Limit Suitability */}
        {crop.limitingConditions?.length > 0 && (
          <div className="detail-block">
            <div className="detail-block-title limit">
              <AlertTriangle size={12} />
              <span>Limiting Factors / Bottlenecks ({crop.limitingConditions.length})</span>
            </div>
            <ul>
              {crop.limitingConditions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Information Impact */}
        {crop.missingImpact?.length > 0 && (
          <div className="detail-block">
            <div className="detail-block-title missing">
              <HelpCircle size={12} />
              <span>Unverified Factors ({crop.missingImpact.length})</span>
            </div>
            <ul>
              {crop.missingImpact.map((item, i) => (
                <li key={i} style={{ color: 'var(--muted)' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Next Steps & Management Interventions */}
        {crop.nextSteps?.length > 0 && (
          <div className="detail-block">
            <div className="detail-block-title advisory">
              <Sprout size={12} />
              <span>Recommended Agronomic Actions</span>
            </div>
            <ul>
              {crop.nextSteps.slice(0, 2).map((item, i) => (
                <li key={i} style={{ color: 'var(--green-dark)' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Potential Risks */}
        {crop.risks?.length > 0 && (
          <div className="crop-risks" style={{ borderTop: 'none', paddingTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#986f35', fontSize: '8.5px', fontWeight: 700 }}>
              <ShieldAlert size={12} />
              <span>Key Agronomic Risks</span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '9px', color: 'var(--muted)' }}>
              {crop.risks.slice(0, 2).join(' · ')}
            </p>
          </div>
        )}
      </div>

      {/* Score Formula Breakdown Accordion */}
      <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <button
          type="button"
          onClick={onToggleScore}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '4px 0',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '8.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <span>Score breakdown ({crop.score}/100)</span>
          {isScoreExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {isScoreExpanded && (
          <div className="score-breakdown-details">
            <FactorScoreBar label="Soil Texture" breakdown={crop.scoreBreakdown?.soil} />
            <FactorScoreBar label="Soil pH" breakdown={crop.scoreBreakdown?.ph} />
            <FactorScoreBar label="Moisture & Water" breakdown={crop.scoreBreakdown?.water} />
            <FactorScoreBar label="Temperature" breakdown={crop.scoreBreakdown?.temperature} />
            <FactorScoreBar label="Field Drainage" breakdown={crop.scoreBreakdown?.drainage} />
            <div style={{ margin: '6px 0 0', paddingTop: '6px', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Reference source: {crop.source || 'ICAR / FAO Standards'}</span>
              <span>Total: <strong>{crop.score}/100</strong></span>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function FactorScoreBar({ label, breakdown }) {
  if (!breakdown) return null
  const earned = breakdown.earned ?? 0
  const max = breakdown.max ?? 1
  const pct = Math.round((earned / max) * 100)

  let barColor = '#10b981'
  if (pct < 40) barColor = '#ef4444'
  else if (pct < 75) barColor = '#f59e0b'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '3px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8.5px' }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: barColor }}>{breakdown.status}</span>
          <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{earned}/{max}</span>
        </div>
      </div>
      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor, borderRadius: '2px', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}
