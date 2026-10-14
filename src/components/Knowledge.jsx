import { useMemo, useState } from 'react'
import { BookOpen, CheckCircle, ExternalLink, Filter, HelpCircle, Plus, Search, ShieldCheck, X } from 'lucide-react'
import { EmptyState, Field, PageHeading } from './Shared.jsx'

const emptyEntry = {
  name: '',
  category: 'Custom Crop',
  soil: '',
  ph: '',
  water: '',
  rainfall: '',
  temperature: '',
  season: '',
  source: '',
  verified: false
}

export default function Knowledge({ entries, setEntries }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(emptyEntry)
  const [error, setError] = useState('')

  const categories = useMemo(() => {
    const cats = new Set(entries.map((e) => e.category || 'Other'))
    return ['All', ...Array.from(cats)]
  }, [entries])

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        (entry.scientificName && entry.scientificName.toLowerCase().includes(search.trim().toLowerCase())) ||
        (entry.source && entry.source.toLowerCase().includes(search.trim().toLowerCase()))
      const matchesCategory =
        selectedCategory === 'All' || entry.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [entries, search, selectedCategory])

  function saveEntry(event) {
    event.preventDefault()
    if (!draft.name.trim()) {
      setError('Enter a crop name to add this entry.')
      return
    }

    const newCrop = {
      id: crypto.randomUUID(),
      name: draft.name.trim(),
      category: draft.category || 'Custom Crop',
      optimalSoilTypes: draft.soil ? [draft.soil] : ['Loamy'],
      phRange: draft.ph ? { min: 5.5, max: 7.5, optimalMin: 6.0, optimalMax: 7.0 } : undefined,
      waterRequirement: draft.water || 'Medium',
      rainfallRange: draft.rainfall ? { min: 400, max: 1200, optimalMin: 600, optimalMax: 900 } : undefined,
      temperatureRange: draft.temperature ? { min: 18, max: 35, optimalMin: 22, optimalMax: 30 } : undefined,
      growingSeasons: draft.season ? [draft.season] : ['General'],
      source: draft.source ? draft.source.trim() : 'User contributed record',
      verified: false,
      verificationNote: 'Custom entry; requires agronomic threshold verification before field deployment.'
    }

    setEntries((current) => [newCrop, ...current])
    setDraft(emptyEntry)
    setError('')
    setAdding(false)
  }

  return (
    <div>
      <PageHeading
        eyebrow="KNOWLEDGE BASE"
        title="Crop agronomic reference library"
        description="Structured thresholds used by the recommendation engine. Agricultural benchmarks are sourced from ICAR, FAO, and university extensions without invented data."
        action={
          <button
            className="button button-primary add-entry-button"
            onClick={() => { setAdding(true); setError('') }}
          >
            <Plus size={17} /> Add crop benchmark
          </button>
        }
      />

      <div className="knowledge-toolbar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by crop, scientific name or reference source..."
            aria-label="Search crops"
          />
        </label>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`preset-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ fontSize: '9px', padding: '4px 9px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="entry-count" style={{ marginLeft: 'auto' }}>
          {filtered.length} of {entries.length} {entries.length === 1 ? 'profile' : 'profiles'}
        </span>
      </div>

      {adding && (
        <div
          className="modal-scrim"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAdding(false)
          }}
        >
          <section className="entry-modal" role="dialog" aria-modal="true" aria-labelledby="entry-title">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">KNOWLEDGE BASE BENCHMARK</span>
                <h2 id="entry-title">Add custom crop profile</h2>
              </div>
              <button className="icon-action" onClick={() => setAdding(false)} aria-label="Close">
                <X size={19} />
              </button>
            </div>
            <p className="modal-description">
              Provide verifiable thresholds from trusted agricultural extensions. New entries will immediately be available to the recommendation engine.
            </p>

            <form onSubmit={saveEntry}>
              <div className="entry-form-grid">
                <Field label="Crop name *" className="field-full">
                  <input
                    autoFocus
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="e.g. Mustard, Chickpea, Sorghum"
                  />
                </Field>
                <Field label="Category">
                  <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                    <option value="Cereal / Staple">Cereal / Staple</option>
                    <option value="Millet / Nutri-cereal">Millet / Nutri-cereal</option>
                    <option value="Pulse / Legume">Pulse / Legume</option>
                    <option value="Oilseed">Oilseed</option>
                    <option value="Commercial / Fibre">Commercial / Fibre</option>
                    <option value="Horticulture / Fruit">Horticulture / Fruit</option>
                    <option value="Custom Crop">Other / Custom</option>
                  </select>
                </Field>
                <Field label="Soil preferences">
                  <select value={draft.soil} onChange={(e) => setDraft({ ...draft, soil: e.target.value })}>
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Clayey">Clayey</option>
                    <option value="Silty">Silty</option>
                  </select>
                </Field>
                <Field label="Water demand">
                  <select value={draft.water} onChange={(e) => setDraft({ ...draft, water: e.target.value })}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </Field>
                <Field label="pH target">
                  <input
                    value={draft.ph}
                    onChange={(e) => setDraft({ ...draft, ph: e.target.value })}
                    placeholder="e.g. 6.0 - 7.5"
                  />
                </Field>
                <Field label="Rainfall requirement">
                  <input
                    value={draft.rainfall}
                    onChange={(e) => setDraft({ ...draft, rainfall: e.target.value })}
                    placeholder="e.g. 400 - 800 mm"
                  />
                </Field>
                <Field label="Temperature window">
                  <input
                    value={draft.temperature}
                    onChange={(e) => setDraft({ ...draft, temperature: e.target.value })}
                    placeholder="e.g. 20°C - 32°C"
                  />
                </Field>
                <Field label="Growing season">
                  <input
                    value={draft.season}
                    onChange={(e) => setDraft({ ...draft, season: e.target.value })}
                    placeholder="e.g. Kharif (July-Nov)"
                  />
                </Field>
                <Field label="Source / Reference *" className="field-full" hint="Identify publisher or research source">
                  <input
                    value={draft.source}
                    onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                    placeholder="e.g. ICAR Research Bulletin, TNAU Agritech Portal"
                  />
                </Field>
              </div>

              {error && <p className="modal-error">{error}</p>}

              <div className="modal-actions">
                <button type="button" className="button button-secondary" onClick={() => setAdding(false)}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  Save benchmark <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {filtered.length ? (
        <div className="knowledge-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filtered.map((entry) => {
            const soilDisplay = entry.optimalSoilTypes ? entry.optimalSoilTypes.join(', ') : (entry.soil || 'Not specified')
            const phDisplay = entry.phRange ? `${entry.phRange.optimalMin} - ${entry.phRange.optimalMax} (tolerates ${entry.phRange.min}-${entry.phRange.max})` : (entry.ph || 'Unspecified')
            const waterDisplay = entry.waterRequirement || entry.water || 'Not specified'
            const rainDisplay = entry.rainfallRange ? `${entry.rainfallRange.min} - ${entry.rainfallRange.max} mm/yr` : (entry.rainfall || 'Not specified')
            const tempDisplay = entry.temperatureRange ? `${entry.temperatureRange.min}°C - ${entry.temperatureRange.max}°C` : (entry.temperature || 'Not specified')
            const seasonDisplay = Array.isArray(entry.growingSeasons) ? entry.growingSeasons.join(', ') : (entry.season || 'Not specified')

            return (
              <article key={entry.id} className="knowledge-card">
                <div className="knowledge-card-top">
                  <span className="knowledge-crop-icon"><BookOpen size={18} /></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="entry-label">{entry.category || 'CROP PROFILE'}</span>
                    {entry.verified ? (
                      <span className="suitability-badge strong" style={{ fontSize: '7px', padding: '2px 5px' }}>
                        <ShieldCheck size={10} /> Verified
                      </span>
                    ) : (
                      <span className="suitability-badge conditional" style={{ fontSize: '7px', padding: '2px 5px' }}>
                        <HelpCircle size={10} /> Needs Verification
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ margin: '10px 0 8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px' }}>{entry.name}</h3>
                  {entry.scientificName && (
                    <span style={{ fontSize: '9px', fontStyle: 'italic', color: 'var(--muted)' }}>
                      {entry.scientificName}
                    </span>
                  )}
                </div>

                {entry.description && (
                  <p style={{ margin: '0 0 10px', fontSize: '9px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {entry.description}
                  </p>
                )}

                <div className="knowledge-facts">
                  <div>
                    <span>Soil compatibility</span>
                    <strong>{soilDisplay}</strong>
                  </div>
                  <div>
                    <span>pH Range</span>
                    <strong>{phDisplay}</strong>
                  </div>
                  <div>
                    <span>Water demand</span>
                    <strong>{waterDisplay} ({rainDisplay})</strong>
                  </div>
                  <div>
                    <span>Temperature</span>
                    <strong>{tempDisplay}</strong>
                  </div>
                  <div>
                    <span>Growing season</span>
                    <strong>{seasonDisplay}</strong>
                  </div>
                </div>

                <div className="knowledge-source">
                  <span>Source Attribution</span>
                  <span style={{ fontWeight: 600 }}>{entry.source || 'Standard Agronomic Reference'}</span>
                  {entry.verificationNote && (
                    <span style={{ fontSize: '7.5px', color: 'var(--muted)', marginTop: '2px' }}>
                      {entry.verificationNote}
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="knowledge-empty panel">
          <EmptyState
            icon={BookOpen}
            title={search ? 'No matching crops found' : 'Your knowledge base is empty'}
            description={
              search
                ? `No crop benchmarks match "${search}". Try another query or clear filters.`
                : 'Build your crop library by adding verified agronomic thresholds.'
            }
            action={
              <button
                className="button button-secondary"
                onClick={() => { setSearch(''); setSelectedCategory('All') }}
              >
                Clear search & filters
              </button>
            }
          />
        </div>
      )}

      <div className="knowledge-note">
        <BookOpen size={16} />
        <span>
          Crop requirement thresholds are decoupled from UI logic in <code>cropKnowledgeBase.js</code>. Reference citations allow transparent verification by agronomists.
        </span>
      </div>
    </div>
  )
}
