import { useMemo, useState } from 'react'
import { BookOpen, Plus, Search, X } from 'lucide-react'
import { EmptyState, Field, PageHeading } from './Shared.jsx'

const emptyEntry = { name: '', soil: '', water: '', temperature: '', season: '', source: '' }

export default function Knowledge({ entries, setEntries }) {
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(emptyEntry)
  const [error, setError] = useState('')
  const filtered = useMemo(() => entries.filter((entry) => entry.name.toLowerCase().includes(search.trim().toLowerCase())), [entries, search])

  function saveEntry(event) {
    event.preventDefault()
    if (!draft.name.trim()) {
      setError('Enter a crop name to add this entry.')
      return
    }
    setEntries((current) => [{ ...draft, id: crypto.randomUUID() }, ...current])
    setDraft(emptyEntry)
    setError('')
    setAdding(false)
  }

  return (
    <div>
      <PageHeading
        eyebrow="KNOWLEDGE BASE"
        title="Build your crop library"
        description="Add trusted crop information as your project takes shape. Every entry is yours to source and update."
        action={<button className="button button-primary add-entry-button" onClick={() => { setAdding(true); setError('') }}><Plus size={17} /> Add crop entry</button>}
      />
      <div className="knowledge-toolbar">
        <label className="search-field"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your crop library..." aria-label="Search crops" /></label>
        <span className="entry-count">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
      </div>
      {adding && (
        <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAdding(false) }}>
          <section className="entry-modal" role="dialog" aria-modal="true" aria-labelledby="entry-title">
            <div className="modal-heading"><div><span className="eyebrow">KNOWLEDGE BASE</span><h2 id="entry-title">Add a crop entry</h2></div><button className="icon-action" onClick={() => setAdding(false)} aria-label="Close"><X size={19} /></button></div>
            <p className="modal-description">Use a source you trust. All details are optional except the crop name.</p>
            <form onSubmit={saveEntry}>
              <div className="entry-form-grid">
                <Field label="Crop name *" className="field-full"><input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Crop name" /></Field>
                <Field label="Soil preferences"><input value={draft.soil} onChange={(e) => setDraft({ ...draft, soil: e.target.value })} placeholder="Add a note" /></Field>
                <Field label="Water requirements"><input value={draft.water} onChange={(e) => setDraft({ ...draft, water: e.target.value })} placeholder="Add a note" /></Field>
                <Field label="Temperature requirements"><input value={draft.temperature} onChange={(e) => setDraft({ ...draft, temperature: e.target.value })} placeholder="Add a note" /></Field>
                <Field label="Growing season"><input value={draft.season} onChange={(e) => setDraft({ ...draft, season: e.target.value })} placeholder="Add a note" /></Field>
                <Field label="Source / reference" className="field-full"><input value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} placeholder="Publisher, URL or reference" /></Field>
              </div>
              {error && <p className="modal-error">{error}</p>}
              <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setAdding(false)}>Cancel</button><button type="submit" className="button button-primary">Save entry <span aria-hidden="true">→</span></button></div>
            </form>
          </section>
        </div>
      )}
      {filtered.length ? (
        <div className="knowledge-grid">{filtered.map((entry) => <article key={entry.id} className="knowledge-card">
          <div className="knowledge-card-top"><span className="knowledge-crop-icon"><BookOpen size={18} /></span><span className="entry-label">CROP PROFILE</span></div>
          <h3>{entry.name}</h3>
          <div className="knowledge-facts">{[['Soil preferences', entry.soil], ['Water requirements', entry.water], ['Temperature', entry.temperature], ['Growing season', entry.season]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || 'Not specified'}</strong></div>)}</div>
          <div className="knowledge-source"><span>Source</span><span>{entry.source || 'No reference added'}</span></div>
        </article>)}</div>
      ) : (
        <div className="knowledge-empty panel">
          <EmptyState
            icon={BookOpen}
            title={search ? 'No matching crops' : 'Your knowledge base is a blank canvas'}
            description={search ? 'Try another search term or add a new crop entry.' : 'Add the first crop profile using information you trust. Nothing is pre-filled or imported.'}
            action={<button className="button button-secondary" onClick={() => { setAdding(true); setError('') }}><Plus size={16} /> Add your first entry</button>}
          />
        </div>
      )}
      <div className="knowledge-note"><BookOpen size={16} /><span>Keep references attached to your knowledge. Entries can evolve alongside your project.</span></div>
    </div>
  )
}
