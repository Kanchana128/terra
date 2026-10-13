import { useRef, useState } from 'react'
import { AlertCircle, Check, CloudUpload, ImagePlus, RotateCcw, Trash2, Upload } from 'lucide-react'
import { Field, PageHeading } from './Shared.jsx'

const initialForm = {
  location: '', area: '', soilType: 'Unknown', soilPh: '', temperature: '',
  rainfall: '', waterAvailability: 'Unknown', irrigation: 'Unknown',
  drainage: 'Unknown', growingSeason: '', description: '',
}

export { initialForm }

export default function Analysis({ form, setForm, image, setImage, onAnalyze }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [fileError, setFileError] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [attempted, setAttempted] = useState(false)

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function acceptFile(file) {
    setFileError('')
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setFileError('Please choose a JPG, JPEG or PNG image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('This image is over 10 MB. Choose a smaller file.')
      return
    }
    setImage({ file, url: URL.createObjectURL(file) })
  }

  function removeImage() {
    setImage(null)
    if (inputRef.current) inputRef.current.value = ''
    setFileError('')
  }

  const missingLocation = attempted && !form.location.trim()
  const missingArea = attempted && (!form.area || Number(form.area) <= 0)

  function submit(event) {
    event.preventDefault()
    setAttempted(true)
    if (!form.location.trim() || !form.area || Number(form.area) <= 0) {
      setValidationMessage('Add a land location and a valid area to continue.')
      return
    }
    setValidationMessage('')
    onAnalyze()
  }

  return (
    <div>
      <PageHeading
        eyebrow="LAND ANALYSIS"
        title="Tell us about your land"
        description="Share the details you have. Unknown values are welcome — no soil properties are inferred from your image."
      />
      <form onSubmit={submit} noValidate>
        <div className="analysis-grid">
          <section className="panel upload-panel">
            <div className="panel-heading">
              <div><span className="section-index">01</span><h2>Land image</h2></div>
              <span className="optional-tag">OPTIONAL</span>
            </div>
            <p className="panel-description">A current photo can help provide visual context for your land.</p>
            {image ? (
              <div className="image-preview-wrap">
                <img className="image-preview" src={image.url} alt={`Preview of ${image.file.name}`} />
                <div className="image-preview-caption">
                  <span><Check size={15} /> Image ready</span>
                  <div>
                    <button type="button" className="icon-action" onClick={() => inputRef.current?.click()} aria-label="Replace image"><RotateCcw size={15} /></button>
                    <button type="button" className="icon-action danger-action" onClick={removeImage} aria-label="Remove image"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`upload-dropzone ${dragging ? 'dragging' : ''}`}
                onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files[0]) }}
              >
                <div className="upload-icon"><CloudUpload size={24} /></div>
                <h3>Drop your image here</h3>
                <p>or browse files from your device</p>
                <button type="button" className="button button-secondary browse-button" onClick={() => inputRef.current?.click()}><Upload size={15} /> Browse files</button>
                <span className="file-meta">JPG, JPEG or PNG <i>·</i> Up to 10 MB</span>
              </div>
            )}
            <input ref={inputRef} className="visually-hidden" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={(event) => { acceptFile(event.target.files?.[0]); event.target.value = '' }} />
            {fileError && <div className="inline-error"><AlertCircle size={15} />{fileError}</div>}
            <div className="privacy-note"><span><ImagePlus size={15} /></span><p>Your image is only used as context for this session. Image analysis is not active yet.</p></div>
          </section>

          <section className="panel land-details-panel">
            <div className="panel-heading">
              <div><span className="section-index">02</span><h2>Land details</h2></div>
              <span className="required-note"><i /> Required fields</span>
            </div>
            <div className="field-grid">
              <Field label="Land location" className={missingLocation ? 'field-invalid' : ''}>
                <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. County, region or nearest town" aria-invalid={missingLocation} />
              </Field>
              <Field label="Land area" className={missingArea ? 'field-invalid' : ''}>
                <div className="input-with-unit"><input type="number" min="0.01" step="any" value={form.area} onChange={(e) => update('area', e.target.value)} placeholder="Enter area" aria-invalid={missingArea} /><select aria-label="Area unit" value={form.areaUnit || 'hectares'} onChange={(e) => update('areaUnit', e.target.value)}><option value="hectares">hectares</option><option value="acres">acres</option><option value="square meters">m²</option></select></div>
              </Field>
              <Field label="Soil type" hint="Choose unknown if this hasn't been tested.">
                <select value={form.soilType} onChange={(e) => update('soilType', e.target.value)}><option>Unknown</option><option>Sandy</option><option>Clayey</option><option>Loamy</option><option>Silty</option></select>
              </Field>
              <Field label="Soil pH" hint="Optional · typically measured with a soil test">
                <input type="number" min="0" max="14" step="0.1" value={form.soilPh} onChange={(e) => update('soilPh', e.target.value)} placeholder="e.g. 6.5" />
              </Field>
              <Field label="Average temperature"><div className="input-with-unit"><input type="number" step="any" value={form.temperature} onChange={(e) => update('temperature', e.target.value)} placeholder="Enter average" /><span className="unit-suffix">°C</span></div></Field>
              <Field label="Rainfall"><div className="input-with-unit"><input type="number" min="0" step="any" value={form.rainfall} onChange={(e) => update('rainfall', e.target.value)} placeholder="Annual average" /><span className="unit-suffix">mm / yr</span></div></Field>
              <Field label="Water availability"><select value={form.waterAvailability} onChange={(e) => update('waterAvailability', e.target.value)}><option>Unknown</option><option>Low</option><option>Medium</option><option>High</option></select></Field>
              <Field label="Irrigation availability"><select value={form.irrigation} onChange={(e) => update('irrigation', e.target.value)}><option>Unknown</option><option>Available</option><option>Limited</option><option>Not available</option></select></Field>
              <Field label="Drainage condition"><select value={form.drainage} onChange={(e) => update('drainage', e.target.value)}><option>Unknown</option><option>Well drained</option><option>Moderate</option><option>Poorly drained</option></select></Field>
              <Field label="Growing season"><input value={form.growingSeason} onChange={(e) => update('growingSeason', e.target.value)} placeholder="e.g. March to August" /></Field>
              <Field label="Additional context" className="field-full">
                <textarea rows="3" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Anything else that could help describe the land or your goals?" />
              </Field>
            </div>
            {validationMessage && <div className="form-alert"><AlertCircle size={16} /><span>{validationMessage}</span></div>}
            <div className="form-footer">
              <p><span className="status-pulse" /> Analysis engine not connected yet</p>
              <button className="button button-primary analyze-button" type="submit">Analyse land <ArrowRightIcon /></button>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}

function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>
}
