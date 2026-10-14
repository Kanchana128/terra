import { ArrowRight, ArrowUpRight, BookOpen, CloudSun, ImagePlus, MapPin, Sparkles, Sprout, Waves } from 'lucide-react'
import { PageHeading, WorkflowStep } from './Shared.jsx'
import { detectAgroClimaticZone } from '../services/recommendationEngine.js'
import { ScoreRing, CropDistributionBar } from './Visualizations.jsx'

export default function Dashboard({ form, knowledgeCount, latestResult, onStart, onNavigate }) {
  const hasLocation = Boolean(form.location && form.location.trim())
  const hasArea = Boolean(form.area && Number(form.area) > 0)
  const profileReady = hasLocation && hasArea
  const topCrop = latestResult?.topRecommendations?.[0] || latestResult?.crops?.[0]
  const detectedZone = detectAgroClimaticZone(form.location)

  const latestCrops = latestResult?.crops ?? []
  const strongMatches = latestCrops.filter((c) => c.suitability === 'Strong match').length
  const conditionalMatches = latestCrops.filter((c) => c.suitability === 'Conditional match').length
  const poorMatches = latestCrops.filter((c) => c.suitability === 'Poor match').length

  return (
    <div className="dashboard-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <div className="hero-kicker"><span /> TERRAFORM HACKATHON EDITION</div>
          <h1>Understand your land.<br /><em>Grow smarter.</em></h1>
          <p>
            Adaptable agricultural land intelligence. Evaluate unknown land conditions, identify limiting factors, and receive explainable, verified crop recommendations.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button className="button button-primary hero-button" onClick={onStart}>
              Start land analysis <ArrowRight size={17} />
            </button>
            {latestResult && (
              <button
                className="button button-secondary hero-button"
                onClick={() => onNavigate('recommendations')}
                style={{ background: 'white' }}
              >
                View latest results ({latestResult.status}) <ArrowUpRight size={16} />
              </button>
            )}
          </div>
          <div className="hero-proof">
            <div className="proof-icons">
              <span><MapPin size={13} /></span>
              <span><CloudSun size={13} /></span>
              <span><Waves size={13} /></span>
            </div>
            <span>Rule-based agronomic model · Never invents data · Decoupled knowledge</span>
          </div>
        </div>

        <div className="land-art" aria-label="Illustration of green cultivated fields" role="img">
          <svg className="landscape-art" viewBox="0 0 560 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="land-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dcebd8" /><stop offset="1" stopColor="#bdd9b8" /></linearGradient>
              <linearGradient id="land-field" x1=".1" y1="0" x2=".8" y2="1"><stop stopColor="#83ad70" /><stop offset="1" stopColor="#376b43" /></linearGradient>
              <linearGradient id="land-foreground" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#608e53" /><stop offset="1" stopColor="#2f6240" /></linearGradient>
              <clipPath id="field-clip"><path d="M0 199C116 184 177 218 273 202c104-18 167-32 287-3v161H0Z" /></clipPath>
            </defs>
            <path fill="url(#land-sky)" d="M0 0h560v360H0z" />
            <circle cx="409" cy="83" r="28" fill="#f1d99e" opacity=".88" />
            <circle cx="409" cy="83" r="41" fill="#f1d99e" opacity=".17" />
            <path fill="#accaa2" d="M0 170c96-47 157-28 230-7 75 22 124-48 204-26 48 13 81 24 126 12v103H0z" />
            <path fill="#8bb17b" d="M0 205c95-31 167-18 250 3 91 24 173-41 310-18v95H0z" />
            <path fill="url(#land-field)" d="M0 199c116-15 177 19 273 3 104-18 167-32 287-3v161H0z" />
            <g clipPath="url(#field-clip)" fill="none" stroke="#d1df9a" strokeWidth="2" opacity=".52">
              <path d="M-70 405C38 267 150 231 325 225s249 15 333 77" />
              <path d="M-49 426C57 288 169 252 344 246s249 15 333 77" />
              <path d="M-28 447C78 309 190 273 365 267s249 15 333 77" />
              <path d="M-7 468C99 330 211 294 386 288s249 15 333 77" />
              <path d="M14 489C120 351 232 315 407 309s249 15 333 77" />
              <path d="M35 510C141 372 253 336 428 330s249 15 333 77" />
              <path d="M-65 178c102 25 184 70 258 136s116 93 229 117" opacity=".45" />
              <path d="M-44 165c102 25 184 70 258 136s116 93 229 117" opacity=".45" />
            </g>
            <path fill="url(#land-foreground)" d="M0 289c77-24 159-7 236 14 82 22 191 22 324-22v79H0z" />
            <g fill="none" stroke="#d8e3a5" strokeWidth="1.5" opacity=".44">
              <path d="M-10 315c85-21 160-8 241 14 83 23 196 23 339-24" />
              <path d="M-15 334c88-19 161-6 241 16 85 23 202 20 344-27" />
              <path d="M-20 353c90-17 164-4 244 18 87 23 208 17 350-30" />
            </g>
          </svg>
          <div className="art-label">
            <span className="art-label-mark"><Sprout size={16} /></span>
            <div>
              <strong>Your land, understood</strong>
              <span>Adaptive Agricultural Intelligence</span>
            </div>
            <ArrowUpRight size={16} />
          </div>
          <div className="art-coordinate">FIELD NOTES <span>•</span> 01</div>
        </div>
      </div>

      <section className="workspace-overview" aria-labelledby="workspace-overview-title">
        <div className="overview-heading">
          <div>
            <span className="eyebrow">A QUICK LOOK AT YOUR PROJECT</span>
            <h2 id="workspace-overview-title">Your workspace at a glance</h2>
          </div>
          <span className="overview-live"><span /> Engine Active · Model v1.0</span>
        </div>

        <div className="overview-grid">
          {/* Card 1: Land Profile */}
          <article className="overview-card">
            <div className="overview-card-icon"><MapPin size={18} /></div>
            <div className="overview-card-content">
              <span className="overview-card-label">LAND PROFILE</span>
              <strong>{hasLocation ? form.location : 'Ready to configure'}</strong>
              <span className="overview-card-detail">
                {hasLocation && detectedZone
                  ? `${detectedZone.zone} · ${hasArea ? `${form.area} ${form.areaUnit || 'hectares'}` : 'Area unrecorded'}`
                  : hasArea
                  ? `${form.area} ${form.areaUnit || 'hectares'} · ${form.soilType !== 'Unknown' ? form.soilType : 'Soil unverified'}`
                  : 'Add location or select an agricultural region'}
              </span>
            </div>
            <span className={`overview-status ${profileReady ? 'overview-status-ready' : ''}`}>
              {profileReady ? 'Ready' : hasLocation || hasArea ? 'In progress' : 'Not started'}
            </span>
            <button className="overview-card-link" onClick={onStart} aria-label="Edit land profile">
              <ArrowUpRight size={16} />
            </button>
          </article>

          {/* Card 2: Crop Library */}
          <article className="overview-card">
            <div className="overview-card-icon"><BookOpen size={18} /></div>
            <div className="overview-card-content">
              <span className="overview-card-label">CROP LIBRARY</span>
              <strong>{knowledgeCount} verified profiles</strong>
              <span className="overview-card-detail">
                ICAR & FAO agricultural reference benchmarks
              </span>
            </div>
            <button className="overview-card-link" onClick={() => onNavigate('knowledge')} aria-label="Open crop library">
              <ArrowUpRight size={16} />
            </button>
          </article>

          {/* Card 3: Analysis Engine */}
          <article className="overview-card overview-card-engine">
            <div className="overview-card-icon"><Sprout size={18} /></div>
            <div className="overview-card-content">
              <span className="overview-card-label">ANALYSIS ENGINE</span>
              <strong>Rule-Based v1.0 Active</strong>
              <span className="overview-card-detail">
                {latestResult && topCrop
                  ? `Top: ${topCrop.name} (${topCrop.score} pts)`
                  : 'Ready to evaluate submitted land conditions'}
              </span>
            </div>
            <span className="overview-status overview-status-ready">
              {latestResult ? 'Evaluated' : 'Ready'}
            </span>
            <button
              className="overview-card-link"
              onClick={() => onNavigate(latestResult ? 'recommendations' : 'analysis')}
              aria-label="View engine recommendations"
            >
              <ArrowUpRight size={16} />
            </button>
          </article>
        </div>

        {latestResult && topCrop && (
          <div className="dashboard-telemetry-banner">
            <div className="telemetry-gauge">
              <ScoreRing score={topCrop.score} size={62} strokeWidth={5.5} label="Top score" />
            </div>
            <div className="telemetry-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="telemetry-label">LATEST EVALUATION TELEMETRY</span>
                <span className="summary-status">{latestResult.status}</span>
                {detectedZone && <span className="badge-mini">{detectedZone.zone}</span>}
              </div>
              <h3 style={{ margin: '4px 0 2px', fontSize: '15px', color: 'var(--ink)' }}>
                {topCrop.name} <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>({topCrop.category})</span>
              </h3>
              <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted)', lineHeight: '1.45' }}>
                {topCrop.explanation || topCrop.matchingConditions?.[0]}
              </p>
              <div style={{ marginTop: '8px', maxWidth: '360px' }}>
                <CropDistributionBar
                  strong={strongMatches}
                  conditional={conditionalMatches}
                  poor={poorMatches}
                  total={latestCrops.length}
                />
              </div>
            </div>
            <div className="telemetry-action">
              <button
                className="button button-primary"
                onClick={() => onNavigate('recommendations')}
                style={{ minHeight: '35px', fontSize: '10.5px', padding: '0 13px', whiteSpace: 'nowrap' }}
              >
                Inspect Visual Radar & Details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      <PageHeading
        eyebrow="A THOUGHTFUL THREE-STEP PROCESS"
        title="A clear path from field to insight"
        description="Start with what you know. Add detail when you’re ready."
      />

      <div className="workflow-grid">
        <WorkflowStep
          number="01"
          icon={ImagePlus}
          title="Add a land image"
          description="Share a field photo for qualitative visual context without pseudo-scientific inference."
        />
        <WorkflowStep
          number="02"
          icon={CloudSun}
          title="Describe conditions"
          description="Supply known soil, climate, and water details, or paste the hackathon organizers' case study."
        />
        <WorkflowStep
          number="03"
          icon={Sprout}
          title="Explore what fits"
          description="Evaluate suitability scores, analyze limiting bottlenecks, and view side-by-side comparisons."
        />
      </div>

      <div className="dashboard-footnote">
        <span className="status-pulse status-dot-active" />
        <span>Analysis engine is online. Recommendations adapt instantly to changing land conditions.</span>
      </div>
    </div>
  )
}
