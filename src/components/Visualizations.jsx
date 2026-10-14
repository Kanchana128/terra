import React, { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Droplets,
  HelpCircle,
  Info,
  Layers,
  Leaf,
  Scale,
  ShieldAlert,
  Sparkles,
  Sprout,
  Sun,
  Thermometer,
  Waves,
  Wind
} from 'lucide-react'

/**
 * 1. Circular Animated SVG Score Gauge (0 - 100)
 */
export function ScoreRing({ score = 0, size = 68, strokeWidth = 6, label = '' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference - (clamped / 100) * circumference

  let color = '#10b981' // Green
  let trackColor = 'rgba(16, 185, 129, 0.15)'
  if (clamped < 55) {
    color = '#ef4444' // Red
    trackColor = 'rgba(239, 68, 68, 0.15)'
  } else if (clamped < 80) {
    color = '#f59e0b' // Amber
    trackColor = 'rgba(245, 158, 11, 0.15)'
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1
        }}
      >
        <span style={{ fontSize: `${Math.round(size * 0.28)}px`, fontWeight: 800, color: 'var(--ink)' }}>
          {clamped}
        </span>
        <span style={{ fontSize: '7.5px', color: 'var(--muted)', marginTop: '2px' }}>
          /100
        </span>
      </div>
      {label && <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--muted)', marginTop: '4px' }}>{label}</span>}
    </div>
  )
}

/**
 * 2. Interactive Soil pH Gauge (0.0 to 14.0)
 * Includes Acidic, Neutral, and Alkaline zones, marker, value explanation, and crop tolerance note.
 */
export function InteractivePhGauge({ value = null, showNote = true }) {
  const numValue = value !== '' && value !== null && !isNaN(Number(value)) ? Number(value) : null
  const percent = numValue !== null ? Math.max(0, Math.min(100, (numValue / 14) * 100)) : null

  let category = 'Soil pH not provided'
  let catColor = 'var(--muted)'
  let description = 'Crop pH compatibility left unverified instead of assuming neutral.'

  if (numValue !== null) {
    if (numValue < 4.5) {
      category = 'Strongly Acidic'
      catColor = '#ef4444'
      description = 'Severe aluminum/iron toxicity risk and phosphorus lockup. Liming mandatory for field crops.'
    } else if (numValue < 5.5) {
      category = 'Moderately Acidic'
      catColor = '#f97316'
      description = 'Tolerable for acid-loving crops (tea, potato); requires dolomite or agricultural lime for legumes/cereals.'
    } else if (numValue < 6.5) {
      category = 'Slightly Acidic'
      catColor = '#84cc16'
      description = 'Broadly favorable for most cereals, millets, and pulses with minimal nutrient antagonism.'
    } else if (numValue <= 7.5) {
      category = 'Optimal Neutral Zone'
      catColor = '#10b981'
      description = 'Peak bioavailability for essential nitrogen, phosphorus, potassium, and beneficial soil microbiology.'
    } else if (numValue <= 8.5) {
      category = 'Moderately Alkaline'
      catColor = '#06b6d4'
      description = 'Calcareous soil; zinc and iron chlorosis may occur. Suitable for cotton, barley, and chickpeas.'
    } else {
      category = 'Strongly Alkaline / Sodic'
      catColor = '#8b5cf6'
      description = 'High sodium hazard, structure dispersion, and micronutrient lockout. Gypsum application recommended.'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', width: '100%', background: 'var(--canvas)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
      {/* Zone Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px' }}>
        <span style={{ color: '#ef4444', fontWeight: 700 }}>0 - 6.5 Acidic</span>
        <span style={{ color: '#10b981', fontWeight: 800, padding: '2px 6px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
          6.5 - 7.5 Neutral Zone
        </span>
        <span style={{ color: '#8b5cf6', fontWeight: 700 }}>7.5 - 14 Alkaline</span>
      </div>

      {/* Gradient Bar with Zone Dividers */}
      <div
        style={{
          position: 'relative',
          height: '14px',
          borderRadius: '7px',
          background: 'linear-gradient(to right, #ef4444 0%, #f97316 28%, #84cc16 42%, #10b981 50%, #06b6d4 62%, #8b5cf6 100%)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)'
        }}
      >
        {/* Neutral zone indicator boundary lines */}
        <div style={{ position: 'absolute', left: `${(6.5 / 14) * 100}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.7)' }} />
        <div style={{ position: 'absolute', left: `${(7.5 / 14) * 100}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.7)' }} />

        {/* Needle Marker */}
        {percent !== null ? (
          <div
            style={{
              position: 'absolute',
              left: `${percent}%`,
              top: '-4px',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '22px',
              background: '#ffffff',
              border: '2px solid #111827',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
              transition: 'left 0.4s ease-out'
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '1px',
              transform: 'translateX(-50%)',
              fontSize: '8px',
              fontWeight: 600,
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0,0,0,0.6)'
            }}
          >
            Unmeasured
          </div>
        )}
      </div>

      {/* Measured value status callout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', marginTop: '2px' }}>
        <div>
          {numValue !== null ? (
            <span>Measured pH: <strong>{numValue.toFixed(1)}</strong></span>
          ) : (
            <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Soil pH not provided</span>
          )}
        </div>
        <span style={{ color: catColor, fontWeight: 700 }}>{category}</span>
      </div>

      <p style={{ margin: 0, fontSize: '8.5px', color: 'var(--muted)', lineHeight: '1.45' }}>
        {description}
      </p>

      {/* Note explaining crop differences */}
      {showNote && (
        <div style={{ marginTop: '3px', paddingTop: '6px', borderTop: '1px solid var(--border)', fontSize: '8px', color: 'var(--muted)', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
          <Info size={11} style={{ flexShrink: 0, marginTop: '1px', color: 'var(--green)' }} />
          <span>
            <strong>Agronomic Note:</strong> Suitable pH ranges differ substantially among crops (e.g. tea prefers acidic 4.5–5.5, groundnut prefers 6.0–7.0, and barley thrives up to 8.5).
          </span>
        </div>
      )}
    </div>
  )
}

// Keep PhSpectrumMeter export for backward compatibility
export const PhSpectrumMeter = InteractivePhGauge

/**
 * 3. Annual Rainfall Spectrum Gauge (Arid to Humid)
 */
export function RainfallGauge({ value = null }) {
  const rain = value !== '' && value !== null && !isNaN(Number(value)) ? Number(value) : null
  const percent = rain !== null ? Math.max(0, Math.min(100, (rain / 2500) * 100)) : null

  let category = 'Unrecorded'
  let catColor = 'var(--muted)'
  if (rain !== null) {
    if (rain < 350) { category = 'Arid (<350mm) · High drought stress'; catColor = '#ef4444' }
    else if (rain < 750) { category = 'Semi-Arid (350-750mm) · Millet & pulse zone'; catColor = '#f59e0b' }
    else if (rain < 1200) { category = 'Sub-Humid (750-1200mm) · Versatile cropland'; catColor = '#10b981' }
    else if (rain < 2000) { category = 'Humid (1200-2000mm) · Paddy & wetland suitable'; catColor = '#06b6d4' }
    else { category = 'Per-Humid (>2000mm) · High waterlogging risk'; catColor = '#3b82f6' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', marginTop: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
        <span style={{ color: '#d97706', fontWeight: 600 }}>0 Arid</span>
        <span style={{ color: '#10b981', fontWeight: 600 }}>750mm Sub-Humid</span>
        <span style={{ color: '#2563eb', fontWeight: 600 }}>2500mm+ Humid</span>
      </div>

      <div
        style={{
          position: 'relative',
          height: '10px',
          borderRadius: '5px',
          background: 'linear-gradient(to right, #fbbf24 0%, #a3e635 25%, #10b981 48%, #06b6d4 72%, #3b82f6 100%)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {percent !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${percent}%`,
              top: '-3px',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '16px',
              background: '#ffffff',
              border: '2px solid #1f2937',
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'left 0.3s ease-out'
            }}
          />
        )}
      </div>

      {rain !== null ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '8.5px' }}>
          <span>Annual Precipitation: <strong>{rain} mm/yr</strong></span>
          <span style={{ color: catColor, fontWeight: 700 }}>{category}</span>
        </div>
      ) : (
        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>
          Enter annual rainfall in mm/year to evaluate moisture zone
        </span>
      )}
    </div>
  )
}

/**
 * 4. Segmented Compatibility Distribution Bar
 */
export function CropDistributionBar({ strong = 0, conditional = 0, poor = 0, total = 0 }) {
  if (total === 0) return null
  const strongPct = Math.round((strong / total) * 100)
  const condPct = Math.round((conditional / total) * 100)
  const poorPct = Math.max(0, 100 - strongPct - condPct)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'var(--border)' }}>
        {strong > 0 && (
          <div
            style={{ width: `${strongPct}%`, backgroundColor: '#10b981', transition: 'width 0.4s ease' }}
            title={`Strong matches: ${strong} (${strongPct}%)`}
          />
        )}
        {conditional > 0 && (
          <div
            style={{ width: `${condPct}%`, backgroundColor: '#f59e0b', transition: 'width 0.4s ease' }}
            title={`Conditional matches: ${conditional} (${condPct}%)`}
          />
        )}
        {poor > 0 && (
          <div
            style={{ width: `${poorPct}%`, backgroundColor: '#ef4444', transition: 'width 0.4s ease' }}
            title={`Poor matches: ${poor} (${poorPct}%)`}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', color: 'var(--muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <strong>{strong}</strong> Strong ({strongPct}%)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <strong>{conditional}</strong> Conditional ({condPct}%)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <strong>{poor}</strong> Poor ({poorPct}%)
        </span>
      </div>
    </div>
  )
}

/**
 * 5. Horizontal Crop Suitability Bar Chart (Requirement #4)
 * Allows users to click on any crop to inspect its suitability explanation.
 */
export function CropSuitabilityBarChart({ crops = [], onSelectCrop, selectedCropId }) {
  if (!crops || crops.length === 0) return null

  const maxDisplay = 6
  const displayCrops = crops.slice(0, maxDisplay)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Scoring Criteria Callout */}
      <div style={{ padding: '8px 11px', background: 'var(--canvas)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '8.5px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '7px' }}>
        <Scale size={13} style={{ flexShrink: 0, color: 'var(--green)' }} />
        <span>
          <strong>Scoring Criteria:</strong> Scores (0-100) are computed strictly across verified inputs: Soil Texture (20%), Soil pH (20%), Moisture & Irrigation (30%), Temperature (15%), Drainage (15%). Unmeasured inputs are omitted from the denominator instead of assuming values.
        </span>
      </div>

      {/* Horizontal Bar Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {displayCrops.map((crop) => {
          const isSelected = selectedCropId === crop.id
          let barColor = '#10b981' // Strong
          let bgPill = 'rgba(16, 185, 129, 0.1)'
          if (crop.suitability === 'Conditional match') {
            barColor = '#f59e0b'
            bgPill = 'rgba(245, 158, 11, 0.1)'
          } else if (crop.suitability === 'Poor match') {
            barColor = '#ef4444'
            bgPill = 'rgba(239, 68, 68, 0.1)'
          }

          return (
            <div
              key={crop.id}
              onClick={() => onSelectCrop && onSelectCrop(crop)}
              style={{
                cursor: 'pointer',
                padding: '8px 10px',
                borderRadius: '7px',
                border: isSelected ? `1.5px solid ${barColor}` : '1px solid var(--border)',
                background: isSelected ? 'var(--canvas)' : 'var(--surface)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}
              title="Click to view full agronomic reasoning"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Leaf size={12} color={barColor} />
                  <strong style={{ color: 'var(--ink)' }}>{crop.name}</strong>
                  <span style={{ fontSize: '8.5px', color: 'var(--muted)' }}>({crop.category})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ fontSize: '8px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: bgPill, color: barColor }}>
                    {crop.suitability}
                  </span>
                  <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>{crop.score} pts</strong>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${crop.score}%`,
                    height: '100%',
                    background: barColor,
                    borderRadius: '4px',
                    transition: 'width 0.6s ease'
                  }}
                />
              </div>

              {/* Quick limitation or match snippet */}
              <span style={{ fontSize: '8px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {crop.matchingConditions?.[0] || crop.explanation}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 6. Crop Requirement Comparison Matrix (Requirement #5)
 * Displays Suitable, Conditional, Unsuitable, Unknown with a full legend.
 */
export function CropRequirementMatrix({ crops = [] }) {
  if (!crops || crops.length === 0) return null
  const displayCrops = crops.slice(0, 4)

  const factors = [
    { key: 'soil', label: 'Soil Compatibility' },
    { key: 'ph', label: 'pH Compatibility' },
    { key: 'rainfall', label: 'Rainfall Suitability' },
    { key: 'temperature', label: 'Temperature Fit' },
    { key: 'water', label: 'Water Requirement' },
    { key: 'drainage', label: 'Drainage Tolerance' }
  ]

  function renderStatusBadge(status) {
    if (status === 'Suitable') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 7px', borderRadius: '4px', background: '#eaf4ec', color: '#166534', fontSize: '8.5px', fontWeight: 700 }}>
          <Check size={11} /> Suitable
        </span>
      )
    }
    if (status === 'Conditional') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 7px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontSize: '8.5px', fontWeight: 700 }}>
          <AlertTriangle size={11} /> Conditional
        </span>
      )
    }
    if (status === 'Unsuitable') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 7px', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', fontSize: '8.5px', fontWeight: 700 }}>
          <AlertCircle size={11} /> Unsuitable
        </span>
      )
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 7px', borderRadius: '4px', background: 'var(--canvas)', color: 'var(--muted)', fontSize: '8.5px', fontWeight: 600 }}>
        <HelpCircle size={11} /> Unknown
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '9.5px' }}>
          <thead>
            <tr style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: 700, width: '180px' }}>
                AGRONOMIC FACTOR
              </th>
              {displayCrops.map((crop) => (
                <th key={crop.id} style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <strong style={{ color: 'var(--ink)' }}>{crop.name}</strong>
                    <span style={{ fontSize: '8px', color: 'var(--muted)' }}>{crop.category} · {crop.score} pts</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {factors.map((f, idx) => (
              <tr key={f.key} style={{ borderBottom: idx < factors.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '9px 12px', fontWeight: 600, color: 'var(--ink)' }}>
                  {f.label}
                </td>
                {displayCrops.map((crop) => {
                  const status = crop.matrixStatus?.[f.key] || 'Unknown'
                  return (
                    <td key={crop.id} style={{ padding: '9px 12px' }}>
                      {renderStatusBadge(status)}
                    </td>
                  )
                })}
              </tr>
            ))}
            {/* Primary Action Item */}
            <tr style={{ background: 'var(--canvas)', borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--green-dark)' }}>
                Recommended Action
              </td>
              {displayCrops.map((crop) => (
                <td key={crop.id} style={{ padding: '9px 12px', fontSize: '8.5px', color: 'var(--muted)', lineHeight: '1.4' }}>
                  {crop.nextSteps?.[0] || 'Standard planting protocol'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Matrix Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', padding: '10px 12px', background: 'var(--canvas)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '8.5px', color: 'var(--muted)' }}>
        <span style={{ fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Scale size={12} /> LEGEND:
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#166534' }} />
          <strong>Suitable:</strong> Fully satisfies ICAR/FAO agronomic threshold.
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f59e0b' }} />
          <strong>Conditional:</strong> Tolerable, but requires soil/water interventions.
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }} />
          <strong>Unsuitable:</strong> Exceeds biological tolerance; high failure risk.
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#94a3b8' }} />
          <strong>Unknown:</strong> Not provided; requires field verification.
        </span>
      </div>
    </div>
  )
}

/**
 * 7. Combined Rainfall & Temperature Climograph (Requirement #6)
 * Renders dual-axis monthly chart when 12-month data is available,
 * or honest single-point summary cards when only manual annual rainfall/temperature exist.
 */
export function ClimateMonthlyChart({ monthlyData = null, annualRainfall = null, temperature = null, source = null }) {
  if (monthlyData && Array.isArray(monthlyData) && monthlyData.length === 12) {
    const width = 540
    const height = 180
    const paddingLeft = 40
    const paddingRight = 40
    const paddingTop = 20
    const paddingBottom = 30

    const chartWidth = width - paddingLeft - paddingRight
    const chartHeight = height - paddingTop - paddingBottom

    // Find max rainfall for left axis
    const maxRain = Math.max(50, ...monthlyData.map((d) => d.rainfall || 0)) * 1.15
    // Find min and max temp for right axis
    const temps = monthlyData.map((d) => d.temperature).filter((t) => t !== null && !isNaN(t))
    const minTemp = temps.length > 0 ? Math.min(0, Math.floor(Math.min(...temps) - 5)) : 0
    const maxTemp = temps.length > 0 ? Math.ceil(Math.max(...temps) + 5) : 40

    const barWidth = (chartWidth / 12) * 0.55

    // Helper to calculate coordinates
    const getX = (index) => paddingLeft + (index + 0.5) * (chartWidth / 12)
    const getRainY = (val) => paddingTop + chartHeight - ((val || 0) / maxRain) * chartHeight
    const getTempY = (val) => {
      if (val === null || isNaN(val)) return paddingTop + chartHeight / 2
      return paddingTop + chartHeight - ((val - minTemp) / (maxTemp - minTemp)) * chartHeight
    }

    // Build temperature line path
    const tempPoints = monthlyData.map((d, i) => `${getX(i)},${getTempY(d.temperature)}`).join(' ')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', background: 'var(--canvas)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.8px' }}>12-MONTH CLIMATOLOGY</span>
            <h4 style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--ink)' }}>Monthly Rainfall & Temperature Profile</h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '8.5px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '2px' }} />
              Rainfall (mm)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '3px', background: '#f59e0b', borderRadius: '2px' }} />
              Temp (°C)
            </span>
          </div>
        </div>

        {/* SVG Climograph */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '420px' }}>
            {/* Background Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + ratio * chartHeight
              return (
                <line
                  key={ratio}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth={0.8}
                  strokeDasharray="2 2"
                />
              )
            })}

            {/* Left Axis (Rainfall mm) labels */}
            <text x={paddingLeft - 6} y={paddingTop + 8} fill="var(--muted)" fontSize="7.5" textAnchor="end">
              {Math.round(maxRain)} mm
            </text>
            <text x={paddingLeft - 6} y={paddingTop + chartHeight} fill="var(--muted)" fontSize="7.5" textAnchor="end">
              0 mm
            </text>

            {/* Right Axis (Temp °C) labels */}
            <text x={width - paddingRight + 6} y={paddingTop + 8} fill="var(--muted)" fontSize="7.5" textAnchor="start">
              {maxTemp}°C
            </text>
            <text x={width - paddingRight + 6} y={paddingTop + chartHeight} fill="var(--muted)" fontSize="7.5" textAnchor="start">
              {minTemp}°C
            </text>

            {/* Rainfall Bars */}
            {monthlyData.map((d, i) => {
              const x = getX(i) - barWidth / 2
              const y = getRainY(d.rainfall)
              const barH = paddingTop + chartHeight - y
              return (
                <g key={d.month}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(1, barH)}
                    fill="#3b82f6"
                    opacity={0.75}
                    rx={2}
                  >
                    <title>{`${d.month}: ${d.rainfall} mm rain`}</title>
                  </rect>
                  {/* Month Label */}
                  <text
                    x={getX(i)}
                    y={paddingTop + chartHeight + 14}
                    fill="var(--muted)"
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {d.month}
                  </text>
                </g>
              )
            })}

            {/* Temperature Line */}
            {temps.length > 1 && (
              <polyline
                points={tempPoints}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeLinecap="round"
              />
            )}

            {/* Temperature Points */}
            {monthlyData.map((d, i) => {
              if (d.temperature === null) return null
              const x = getX(i)
              const y = getTempY(d.temperature)
              return (
                <circle
                  key={`dot-${d.month}`}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={1}
                >
                  <title>{`${d.month}: ${d.temperature}°C average`}</title>
                </circle>
              )
            })}
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px', color: 'var(--muted)', paddingTop: '4px', borderTop: '1px solid var(--border)' }}>
          <span>Source: {source || 'Open-Meteo Global Meteorological Archive (ERA5)'}</span>
          <span>Verified coordinate historical series (2023 baseline)</span>
        </div>
      </div>
    )
  }

  // Fallback for manual single-point scenario
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', background: 'var(--canvas)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', fontWeight: 700, color: 'var(--muted)' }}>
        <CloudRain size={13} color="var(--green)" />
        <span>SINGLE-POINT CLIMATE CONDITIONS</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: '6px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '8px', color: 'var(--muted)' }}>Annual Rainfall</span>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
            {annualRainfall ? `${annualRainfall}` : 'Unrecorded'}
          </div>
        </div>

        <div style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: '6px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '8px', color: 'var(--muted)' }}>Average Temperature</span>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
            {temperature ? `${temperature}` : 'Unrecorded'}
          </div>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '8px', color: 'var(--muted)', fontStyle: 'italic' }}>
        Note: Detailed 12-month historical climograph is populated when selecting a village or coordinate via the location search. Single-point scenario inputs are preserved without fabricated monthly curves.
      </p>
    </div>
  )
}

/**
 * 8. Land Analysis Insights Panel (Requirement #7)
 * Favourable conditions, Potential risks, Information needed, and Data completeness.
 */
export function LandInsightsPanel({ insights, completeness }) {
  if (!insights) return null

  const { favourableConditions = [], potentialRisks = [], informationNeeded = [] } = insights

  return (
    <section className="panel" style={{ padding: '18px 20px', marginTop: '16px' }}>
      <div className="panel-heading" style={{ marginBottom: '14px' }}>
        <div>
          <span className="section-index">INSIGHTS</span>
          <h2>Land Scenario Agronomic Diagnostics</h2>
        </div>
        {/* Data Completeness Badge */}
        {completeness && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', background: 'var(--canvas)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '8.5px' }}>
            <span>Input Completeness:</span>
            <div style={{ width: '50px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${completeness.percentage}%`, height: '100%', background: 'var(--green)' }} />
            </div>
            <strong>{completeness.percentage}%</strong>
            <span style={{ color: 'var(--muted)' }}>({completeness.knownCount}/{completeness.totalCount} verified)</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* Card 1: Favourable Conditions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', borderRadius: '8px', background: '#f6faf6', border: '1px solid #d2e8d4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '11px', fontWeight: 700 }}>
            <CheckCircle2 size={15} />
            <span>Favourable Conditions ({favourableConditions.length})</span>
          </div>
          {favourableConditions.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '9px', color: 'var(--ink)', lineHeight: '1.5' }}>
              {favourableConditions.map((item, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: '8.5px', color: 'var(--muted)' }}>
              No verified optimal agronomic factors identified yet.
            </p>
          )}
        </div>

        {/* Card 2: Potential Risks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontSize: '11px', fontWeight: 700 }}>
            <AlertTriangle size={15} />
            <span>Potential Risks & Bottlenecks ({potentialRisks.length})</span>
          </div>
          {potentialRisks.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '9px', color: '#78350f', lineHeight: '1.5' }}>
              {potentialRisks.map((item, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: '8.5px', color: 'var(--muted)' }}>
              No critical agronomic barriers detected for this scenario.
            </p>
          )}
        </div>

        {/* Card 3: Information Needed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '11px', fontWeight: 700 }}>
            <HelpCircle size={15} />
            <span>Information Needed ({informationNeeded.length})</span>
          </div>
          {informationNeeded.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '9px', color: 'var(--muted)', lineHeight: '1.5' }}>
              {informationNeeded.map((item, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: '8.5px', color: 'var(--muted)' }}>
              All 10 standard agronomic parameters have been verified.
            </p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border)', fontSize: '8px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Info size={11} color="var(--green)" />
        <span>
          <strong>Methodological Note:</strong> Data completeness reflects parameter input coverage across soil, water, and climate, not prediction statistical confidence.
        </span>
      </div>
    </section>
  )
}

/**
 * 9. Compact Land Condition Overview (Requirement #2)
 * Shows Soil, pH scale, Rainfall, Temp, Water, and Drainage with compact visual indicators.
 */
export function LandConditionOverview({ summary, knownConditions }) {
  if (!summary) return null

  const isPhKnown = knownConditions?.soilPh !== undefined
  const isRainKnown = knownConditions?.rainfall !== undefined
  const isTempKnown = knownConditions?.temperature !== undefined
  const isSoilKnown = knownConditions?.soilType && knownConditions?.soilType !== 'Unknown'
  const isWaterKnown = knownConditions?.waterAvailability && knownConditions?.waterAvailability !== 'Unknown'
  const isDrainageKnown = knownConditions?.drainage && knownConditions?.drainage !== 'Unknown'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '14px' }}>
      {/* 1. Soil Type */}
      <div style={{ padding: '10px 12px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={11} color="var(--green)" /> SOIL TYPE
          </span>
          <span style={{ fontSize: '7.5px', fontWeight: 700, color: isSoilKnown ? '#166534' : 'var(--muted)' }}>
            {isSoilKnown ? 'MEASURED' : 'UNKNOWN'}
          </span>
        </div>
        <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>{summary.soilType}</strong>
        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>Physical texture & structure</span>
      </div>

      {/* 2. Soil pH */}
      <div style={{ padding: '10px 12px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Scale size={11} color="var(--green)" /> SOIL pH SCALE
          </span>
          <span style={{ fontSize: '7.5px', fontWeight: 700, color: isPhKnown ? '#166534' : 'var(--muted)' }}>
            {isPhKnown ? 'MEASURED' : 'UNVERIFIED'}
          </span>
        </div>
        <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>{summary.soilPh}</strong>
        {/* Mini 0-14 bar */}
        <div style={{ width: '100%', height: '5px', borderRadius: '2.5px', background: 'linear-gradient(to right, #ef4444 0%, #10b981 50%, #8b5cf6 100%)', position: 'relative', marginTop: '2px' }}>
          {isPhKnown && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.max(0, Math.min(100, (Number(knownConditions.soilPh) / 14) * 100))}%`,
                top: '-2px',
                width: '3px',
                height: '9px',
                background: '#ffffff',
                border: '1px solid #000000',
                borderRadius: '1px',
                transform: 'translateX(-50%)'
              }}
            />
          )}
        </div>
      </div>

      {/* 3. Rainfall */}
      <div style={{ padding: '10px 12px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CloudRain size={11} color="var(--green)" /> ANNUAL RAINFALL
          </span>
          <span style={{ fontSize: '7.5px', fontWeight: 700, color: isRainKnown ? '#166534' : 'var(--muted)' }}>
            {isRainKnown ? 'MEASURED' : 'UNRECORDED'}
          </span>
        </div>
        <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>{summary.rainfall}</strong>
        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>Annual precipitation depth</span>
      </div>

      {/* 4. Temperature */}
      <div style={{ padding: '10px 12px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Thermometer size={11} color="var(--green)" /> TEMPERATURE
          </span>
          <span style={{ fontSize: '7.5px', fontWeight: 700, color: isTempKnown ? '#166534' : 'var(--muted)' }}>
            {isTempKnown ? 'MEASURED' : 'UNRECORDED'}
          </span>
        </div>
        <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>{summary.temperature}</strong>
        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>Mean growing comfort</span>
      </div>

      {/* 5. Water Availability */}
      <div style={{ padding: '10px 12px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Droplets size={11} color="var(--green)" /> WATER & IRRIGATION
          </span>
          <span style={{ fontSize: '7.5px', fontWeight: 700, color: isWaterKnown ? '#166534' : 'var(--muted)' }}>
            {isWaterKnown ? 'VERIFIED' : 'UNKNOWN'}
          </span>
        </div>
        <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>{summary.waterAvailability}</strong>
        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>Irrigation: {summary.irrigation}</span>
      </div>

      {/* 6. Drainage */}
      <div style={{ padding: '10px 12px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Waves size={11} color="var(--green)" /> FIELD DRAINAGE
          </span>
          <span style={{ fontSize: '7.5px', fontWeight: 700, color: isDrainageKnown ? '#166534' : 'var(--muted)' }}>
            {isDrainageKnown ? 'VERIFIED' : 'UNKNOWN'}
          </span>
        </div>
        <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>{summary.drainage}</strong>
        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>Root zone aeration</span>
      </div>
    </div>
  )
}

/**
 * 10. 5-Dimension Radar / Spider Chart (Requirement #8)
 */
export function RadarComparisonChart({ crops = [], width = 340, height = 290 }) {
  if (!crops || crops.length === 0) return null

  const displayCrops = crops.slice(0, 4)
  const dimensions = [
    { key: 'soil', label: 'Soil Texture', max: 20 },
    { key: 'ph', label: 'Soil pH', max: 20 },
    { key: 'water', label: 'Moisture Fit', max: 30 },
    { key: 'temperature', label: 'Climate / Temp', max: 15 },
    { key: 'drainage', label: 'Drainage', max: 15 }
  ]

  const totalAxes = dimensions.length
  const centerX = width / 2
  const centerY = height / 2 - 10
  const maxRadius = Math.min(centerX, centerY) - 45

  const colors = [
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.25)', name: displayCrops[0]?.name },
    { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.2)', name: displayCrops[1]?.name },
    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.2)', name: displayCrops[2]?.name },
    { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.2)', name: displayCrops[3]?.name }
  ]

  function getCoordinates(axisIndex, ratio) {
    const angle = (Math.PI * 2 / totalAxes) * axisIndex - Math.PI / 2
    const r = maxRadius * ratio
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    }
  }

  const levels = [0.25, 0.5, 0.75, 1.0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <svg width={width} height={height} style={{ overflow: 'visible', maxWidth: '100%' }}>
        {levels.map((lvl) => {
          const points = dimensions
            .map((_, i) => {
              const { x, y } = getCoordinates(i, lvl)
              return `${x},${y}`
            })
            .join(' ')
          return (
            <polygon
              key={lvl}
              points={points}
              fill="transparent"
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray={lvl < 1 ? '3 3' : 'none'}
            />
          )
        })}

        {dimensions.map((dim, i) => {
          const outer = getCoordinates(i, 1.0)
          const labelPos = getCoordinates(i, 1.22)
          return (
            <g key={dim.key}>
              <line
                x1={centerX}
                y1={centerY}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--border)"
                strokeWidth={1.2}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--ink)"
                fontSize="9"
                fontWeight="600"
              >
                {dim.label}
              </text>
            </g>
          )
        })}

        {displayCrops.map((crop, cIndex) => {
          const color = colors[cIndex]
          const points = dimensions.map((dim, i) => {
            const earned = crop.scoreBreakdown?.[dim.key]?.earned ?? (crop.score / 100 * dim.max)
            const ratio = Math.max(0.12, Math.min(1.0, earned / dim.max))
            const pt = getCoordinates(i, ratio)
            return `${pt.x},${pt.y}`
          }).join(' ')

          return (
            <g key={crop.id}>
              <polygon
                points={points}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth={2}
                style={{ transition: 'all 0.5s ease' }}
              />
              {dimensions.map((dim, i) => {
                const earned = crop.scoreBreakdown?.[dim.key]?.earned ?? (crop.score / 100 * dim.max)
                const ratio = Math.max(0.12, Math.min(1.0, earned / dim.max))
                const pt = getCoordinates(i, ratio)
                return (
                  <circle
                    key={dim.key}
                    cx={pt.x}
                    cy={pt.y}
                    r={3}
                    fill={color.stroke}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                )
              })}
            </g>
          )
        })}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px', justifyContent: 'center' }}>
        {displayCrops.map((crop, i) => (
          <div key={crop.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9.5px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                backgroundColor: colors[i].stroke
              }}
            />
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{crop.name}</span>
            <span style={{ color: 'var(--muted)', fontSize: '8.5px' }}>({crop.score} pts)</span>
          </div>
        ))}
      </div>
    </div>
  )
}
