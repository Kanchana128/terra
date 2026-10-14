import { useRef, useState } from 'react'
import { AlertCircle, Check, CloudRain, CloudUpload, FileText, Globe, ImagePlus, MapPin, Navigation, RotateCcw, Sparkles, Trash2, Upload } from 'lucide-react'
import { Field, PageHeading } from './Shared.jsx'
import { testScenarios, agriculturalRegions } from '../data/cropKnowledgeBase.js'
import { initialForm } from '../data/initialForm.js'
import { parseScenarioText, detectAgroClimaticZone } from '../services/recommendationEngine.js'
import { searchPlaces, reverseGeocodeCoordinates, fetchClimateAverages } from '../services/geocodingService.js'
import { PhSpectrumMeter, RainfallGauge } from './Visualizations.jsx'

export default function Analysis({ form, setForm, image, setImage, onAnalyze }) {
  const inputRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [fileError, setFileError] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [selectedPresetId, setSelectedPresetId] = useState(null)
  const [autoFilledNotice, setAutoFilledNotice] = useState('')
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [locationNotice, setLocationNotice] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [searchingLocation, setSearchingLocation] = useState(false)
  const [selectedCoordinates, setSelectedCoordinates] = useState(null)
  const [fetchingClimate, setFetchingClimate] = useState(false)

  const detectedZone = detectAgroClimaticZone(form.location)

  function update(key, value) {
    setSelectedPresetId(null)
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleLocationInputChange(value) {
    update('location', value)
    setSelectedCoordinates(null)

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (!value || value.trim().length < 2) {
      setLocationSuggestions([])
      setSearchingLocation(false)
      return
    }

    setSearchingLocation(true)
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchPlaces(value)
      setLocationSuggestions(results)
      setSearchingLocation(false)
    }, 280)
  }

  function handleSelectSuggestion(item) {
    update('location', item.displayName)
    setLocationSuggestions([])
    if (item.latitude && item.longitude) {
      setSelectedCoordinates({ latitude: item.latitude, longitude: item.longitude })
    } else {
      setSelectedCoordinates(null)
    }

    if (item.isPreset) {
      setLocationNotice(`Selected ${item.zone}. You can prefill regional values below.`)
    } else {
      setLocationNotice(`Location set to ${item.name} (${item.state || item.country}). Coordinates locked.`)
    }
    setTimeout(() => setLocationNotice(''), 4500)
  }

  async function handleFetchClimateData() {
    if (!selectedCoordinates) return
    setFetchingClimate(true)
    setLocationNotice('Querying meteorological archive for this coordinate...')
    const climate = await fetchClimateAverages(selectedCoordinates.latitude, selectedCoordinates.longitude)
    setFetchingClimate(false)

    if (climate) {
      setForm((current) => ({
        ...current,
        rainfall: climate.annualRainfall.toString(),
        temperature: climate.averageTemperature !== null ? climate.averageTemperature.toString() : current.temperature,
        monthlyClimateData: climate.monthlyData || null,
        climateSource: climate.source || null
      }))
      setLocationNotice(`✓ Retrieved climate data: ${climate.annualRainfall} mm rainfall/yr, ${climate.averageTemperature}°C avg temp for ${form.location}.`)
    } else {
      setLocationNotice('Climate archive unreachable. You can specify rainfall and temperature manually.')
    }
    setTimeout(() => setLocationNotice(''), 5500)
  }

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser.')
      setTimeout(() => setLocationNotice(''), 4000)
      return
    }
    setDetectingLocation(true)
    setLocationNotice('Detecting GPS coordinates...')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setSelectedCoordinates({ latitude: lat, longitude: lon })
        const resolved = await reverseGeocodeCoordinates(lat, lon)
        update('location', resolved.displayName)
        setDetectingLocation(false)
        setLocationNotice(`GPS located: ${resolved.displayName} (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`)
        setTimeout(() => setLocationNotice(''), 5000)
      },
      (err) => {
        setDetectingLocation(false)
        setLocationNotice('GPS access unavailable. You can search any village, town, or city by name.')
        setTimeout(() => setLocationNotice(''), 4000)
      },
      { timeout: 8000 }
    )
  }

  function handleApplyRegionalBaseline(zone) {
    if (!zone) return
    setForm((current) => ({
      ...current,
      soilType: current.soilType === 'Unknown' && zone.soilType ? zone.soilType : current.soilType,
      soilPh: (!current.soilPh || current.soilPh === '') && zone.soilPh ? zone.soilPh : current.soilPh,
      rainfall: (!current.rainfall || current.rainfall === '') && zone.rainfall ? zone.rainfall : current.rainfall,
      temperature: (!current.temperature || current.temperature === '') && zone.temperature ? zone.temperature : current.temperature,
      waterAvailability: current.waterAvailability === 'Unknown' && zone.waterAvailability ? zone.waterAvailability : current.waterAvailability,
      irrigation: current.irrigation === 'Unknown' && zone.irrigation ? zone.irrigation : current.irrigation,
      drainage: current.drainage === 'Unknown' && zone.drainage ? zone.drainage : current.drainage,
      growingSeason: (!current.growingSeason || current.growingSeason === '') && zone.growingSeason ? zone.growingSeason : current.growingSeason,
    }))
    setLocationNotice(`Applied regional climate baseline for ${zone.zone}. Values remain fully editable.`)
    setTimeout(() => setLocationNotice(''), 5000)
  }

  function loadPreset(scenario) {
    setSelectedPresetId(scenario.id)
    setForm({ ...initialForm, ...scenario.data })
    setValidationMessage('')
    setAutoFilledNotice(`Loaded scenario: "${scenario.name}"`)
    setTimeout(() => setAutoFilledNotice(''), 4000)
  }

  function handleAutoExtract() {
    if (!form.description || !form.description.trim()) {
      setValidationMessage('Paste a case study scenario into the description box first to extract fields.')
      return
    }
    const extracted = parseScenarioText(form.description)
    const keys = Object.keys(extracted)
    if (keys.length === 0) {
      setAutoFilledNotice('No standard agricultural parameters recognized in text. You can select them manually.')
    } else {
      setForm((current) => ({ ...current, ...extracted }))
      setAutoFilledNotice(`Extracted ${keys.length} parameter(s): ${keys.join(', ')}`)
    }
    setTimeout(() => setAutoFilledNotice(''), 4500)
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

  function submit(event) {
    event.preventDefault()
    setValidationMessage('')

    // Validate numeric constraints
    if (form.area && (isNaN(Number(form.area)) || Number(form.area) <= 0)) {
      setValidationMessage('Land area must be a positive number greater than 0.')
      return
    }
    if (form.soilPh !== '' && form.soilPh !== undefined && form.soilPh !== null) {
      const ph = Number(form.soilPh)
      if (isNaN(ph) || ph < 0 || ph > 14) {
        setValidationMessage('Soil pH must be a valid number between 0.0 and 14.0.')
        return
      }
    }
    if (form.rainfall !== '' && form.rainfall !== undefined && form.rainfall !== null) {
      const rain = Number(form.rainfall)
      if (isNaN(rain) || rain < 0 || rain > 12000) {
        setValidationMessage('Annual rainfall must be a non-negative number up to 12,000 mm/yr.')
        return
      }
    }
    if (form.temperature !== '' && form.temperature !== undefined && form.temperature !== null) {
      const temp = Number(form.temperature)
      if (isNaN(temp) || temp < -20 || temp > 60) {
        setValidationMessage('Average temperature must be within a realistic range (-20°C to 60°C).')
        return
      }
    }

    // Ensure at least one condition or scenario description is provided
    const hasAnyDetail = Boolean(
      (form.location && form.location.trim()) ||
      form.area ||
      form.soilType !== 'Unknown' ||
      form.soilPh ||
      form.temperature ||
      form.rainfall ||
      form.waterAvailability !== 'Unknown' ||
      form.irrigation !== 'Unknown' ||
      form.drainage !== 'Unknown' ||
      (form.description && form.description.trim())
    )

    if (!hasAnyDetail) {
      setValidationMessage('Please provide at least one land condition or scenario description to analyze.')
      return
    }

    // Default location if omitted to allow scenario analysis to continue smoothly
    const locationVal = form.location && form.location.trim() ? form.location.trim() : 'Scenario Evaluation Plot'
    const preparedForm = { ...form, location: locationVal }

    onAnalyze(preparedForm)
  }

  return (
    <div>
      <PageHeading
        eyebrow="LAND ANALYSIS"
        title="Tell us about your land scenario"
        description="Provide the known parameters or paste the organizers' case study. Unknown values are fully supported — recommendations are explainable and never invent data."
      />

      {/* Quick Hackathon Scenario Presets Bar */}
      <div className="preset-bar">
        <div className="preset-header">
          <span>HACKATHON SCENARIO PRESETS</span>
          <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Select a preset to test real-time engine adaptivity</span>
        </div>
        <div className="preset-chips">
          {testScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className={`preset-chip ${selectedPresetId === scenario.id ? 'active' : ''}`}
              onClick={() => loadPreset(scenario)}
            >
              <span>{scenario.name}</span>
              <span className="badge-mini">{scenario.badge}</span>
            </button>
          ))}
          {selectedPresetId && (
            <button
              type="button"
              className="preset-chip"
              onClick={() => { setSelectedPresetId(null); setForm(initialForm) }}
              title="Reset to blank form"
            >
              <span>Reset blank</span>
            </button>
          )}
        </div>
        {autoFilledNotice && (
          <div style={{ fontSize: '9.5px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <Check size={13} /> {autoFilledNotice}
          </div>
        )}
      </div>

      <form onSubmit={submit} noValidate>
        <div className="analysis-grid">
          <section className="panel upload-panel">
            <div className="panel-heading">
              <div><span className="section-index">01</span><h2>Land image</h2></div>
              <span className="optional-tag">OPTIONAL</span>
            </div>
            <p className="panel-description">A field photo provides visual context for your land scenario.</p>
            {image ? (
              <div className="image-preview-wrap">
                <img className="image-preview" src={image.url} alt={`Preview of ${image.file?.name || 'uploaded land image'}`} />
                <div className="image-preview-caption">
                  <span><Check size={15} /> Field photo attached</span>
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
                <h3>Drop field photo here</h3>
                <p>or browse files from your device</p>
                <button type="button" className="button button-secondary browse-button" onClick={() => inputRef.current?.click()}><Upload size={15} /> Browse files</button>
                <span className="file-meta">JPG, JPEG or PNG <i>·</i> Up to 10 MB</span>
              </div>
            )}
            <input ref={inputRef} className="visually-hidden" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={(event) => { acceptFile(event.target.files?.[0]); event.target.value = '' }} />
            {fileError && <div className="inline-error"><AlertCircle size={15} />{fileError}</div>}
            
            {/* Scientific disclaimer regarding image analysis */}
            <div className="privacy-note">
              <span><ImagePlus size={15} /></span>
              <p>
                <strong>Scientific Disclaimer:</strong> Field photographs serve as qualitative visual context. Chemical soil pH, N-P-K nutrient profiles, and precise subsoil structures cannot be measured from a standard photo and must be laboratory tested.
              </p>
            </div>
          </section>

          <section className="panel land-details-panel">
            <div className="panel-heading">
              <div><span className="section-index">02</span><h2>Land & scenario details</h2></div>
              <span className="optional-tag">UNKNOWN VALUES WELCOME</span>
            </div>

            <div className="field-grid">
              <Field
                label="Land location (village, small town, taluk, district, or city)"
                hint="Global & local search: Type any village, small town, or district name across India/Worldwide, or detect via GPS"
                className="field-full"
              >
                <div className="location-input-container">
                  <div className="location-input-group">
                    <div className="location-input-wrap">
                      <MapPin size={15} className="location-input-icon" />
                      <input
                        value={form.location}
                        onChange={(e) => handleLocationInputChange(e.target.value)}
                        placeholder="Search any village, town, taluk, district (e.g. Manvi, Devadurga, Sindhanur, Almora, Kuttanad, Bhandara...)"
                        autoComplete="off"
                      />
                      {searchingLocation && (
                        <span style={{ position: 'absolute', right: '10px', fontSize: '9px', color: 'var(--muted)' }}>
                          Searching places...
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="detect-location-btn"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      title="Use device GPS to locate exact coordinates, village, and district"
                    >
                      <Navigation size={13} style={{ transform: detectingLocation ? 'rotate(45deg)' : 'none' }} />
                      <span>{detectingLocation ? 'Detecting...' : 'Detect GPS'}</span>
                    </button>
                  </div>

                  {/* Real-Time Location Search Suggestions Dropdown */}
                  {locationSuggestions.length > 0 && (
                    <div className="location-suggestions-menu" role="listbox">
                      {locationSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="suggestion-item"
                          onClick={() => handleSelectSuggestion(item)}
                        >
                          <div className="suggestion-main">
                            <span className="suggestion-title">
                              {item.name}
                              {item.isPreset && <span className="badge-mini" style={{ marginLeft: '6px' }}>Agricultural Belt</span>}
                            </span>
                            <span className="suggestion-meta">
                              {[item.district, item.state, item.country].filter(Boolean).join(' · ')}
                            </span>
                          </div>
                          {item.latitude && item.longitude && (
                            <span className="suggestion-coords">
                              {item.latitude.toFixed(2)}°N, {item.longitude.toFixed(2)}°E
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Climate & Agro-Climatic Intelligence Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {/* Climate fetch action if coordinates are known */}
                  {selectedCoordinates && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '7px 11px', background: '#eef6ec', borderRadius: '6px', border: '1px solid #cce5d0', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9.5px', color: '#166534' }}>
                        <CloudRain size={14} />
                        <span>Coordinates: <strong>{selectedCoordinates.latitude.toFixed(3)}°N, {selectedCoordinates.longitude.toFixed(3)}°E</strong></span>
                      </div>
                      <button
                        type="button"
                        className="climate-fetch-btn"
                        onClick={handleFetchClimateData}
                        disabled={fetchingClimate}
                      >
                        <Sparkles size={12} />
                        {fetchingClimate ? 'Querying Meteorological Archive...' : 'Fetch real rainfall & temperature data'}
                      </button>
                    </div>
                  )}

                  {/* Recognized Agro-Climatic Zone Card */}
                  {detectedZone && (
                    <div className="agro-zone-card">
                      <div className="zone-info">
                        <div className="zone-header">
                          <Globe size={13} color="var(--green)" />
                          <strong>Recognized Agro-Climatic Zone:</strong>
                          <span className="zone-title">{detectedZone.zone}</span>
                        </div>
                        <div className="zone-meta">
                          <span>Profile: <b>{detectedZone.climateProfile}</b></span>
                          <span>·</span>
                          <span>Regional Staples: <b>{detectedZone.keyCrops?.join(', ')}</b></span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="apply-baseline-btn"
                        onClick={() => handleApplyRegionalBaseline(detectedZone)}
                        title="Prefill unrecorded fields with typical regional baseline values"
                      >
                        <Sparkles size={12} /> Prefill regional climate baseline
                      </button>
                    </div>
                  )}
                </div>

                {locationNotice && (
                  <div className="location-notice">
                    <Check size={13} /> {locationNotice}
                  </div>
                )}
              </Field>

              <Field label="Land area">
                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={form.area}
                    onChange={(e) => update('area', e.target.value)}
                    placeholder="Enter area"
                  />
                  <select aria-label="Area unit" value={form.areaUnit || 'hectares'} onChange={(e) => update('areaUnit', e.target.value)}>
                    <option value="hectares">hectares</option>
                    <option value="acres">acres</option>
                    <option value="square meters">m²</option>
                  </select>
                </div>
              </Field>

              <Field label="Soil type" hint="Choose unknown if unverified">
                <select value={form.soilType} onChange={(e) => update('soilType', e.target.value)}>
                  <option value="Unknown">Unknown / Not tested</option>
                  <option value="Sandy">Sandy / Sandy Loam</option>
                  <option value="Clayey">Clayey / Heavy Clay</option>
                  <option value="Loamy">Loamy / Red Loam</option>
                  <option value="Silty">Silty / Alluvial Silt</option>
                </select>
              </Field>

              <Field label="Soil pH" hint="Optimal range: 0 - 14 (standard soil test)">
                <input
                  type="number"
                  min="0"
                  max="14"
                  step="0.1"
                  value={form.soilPh}
                  onChange={(e) => update('soilPh', e.target.value)}
                  placeholder="e.g. 6.5 (optional)"
                />
                <PhSpectrumMeter value={form.soilPh} />
              </Field>

              <Field label="Average ambient temperature">
                <div className="input-with-unit">
                  <input
                    type="number"
                    step="any"
                    value={form.temperature}
                    onChange={(e) => update('temperature', e.target.value)}
                    placeholder="e.g. 28"
                  />
                  <span className="unit-suffix">°C</span>
                </div>
              </Field>

              <Field label="Annual rainfall">
                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.rainfall}
                    onChange={(e) => update('rainfall', e.target.value)}
                    placeholder="Annual mm"
                  />
                  <span className="unit-suffix">mm / yr</span>
                </div>
                <RainfallGauge value={form.rainfall} />
              </Field>

              <Field label="Water availability">
                <select value={form.waterAvailability} onChange={(e) => update('waterAvailability', e.target.value)}>
                  <option value="Unknown">Unknown</option>
                  <option value="Low">Low (Drought prone / scarce)</option>
                  <option value="Medium">Medium (Moderate moisture)</option>
                  <option value="High">High (Abundant moisture)</option>
                </select>
              </Field>

              <Field label="Irrigation availability">
                <select value={form.irrigation} onChange={(e) => update('irrigation', e.target.value)}>
                  <option value="Unknown">Unknown</option>
                  <option value="Available">Available (Canal / Tubewell / Drip)</option>
                  <option value="Limited">Limited (1-2 protective irrigations)</option>
                  <option value="Not available">Not available (Purely rainfed)</option>
                </select>
              </Field>

              <Field label="Drainage condition">
                <select value={form.drainage} onChange={(e) => update('drainage', e.target.value)}>
                  <option value="Unknown">Unknown</option>
                  <option value="Well drained">Well drained (No water accumulation)</option>
                  <option value="Moderate">Moderate (Slow percolation)</option>
                  <option value="Poorly drained">Poorly drained (Waterlogged / Stagnant)</option>
                </select>
              </Field>

              <Field label="Growing season / window">
                <input
                  value={form.growingSeason}
                  onChange={(e) => update('growingSeason', e.target.value)}
                  placeholder="e.g. Kharif (Monsoon), Rabi (Winter), Summer"
                />
              </Field>

              {/* Case study scenario description field */}
              <Field label="Hackathon case study scenario description" className="field-full" hint="Paste organizers' scenario description here">
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Paste the problem statement or scenario text here (e.g., 'Semi-arid land in Raichur, red sandy loam soil, annual rainfall 420mm...')"
                />
                <div className="autofill-box">
                  <span><FileText size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Have raw case study text?</span>
                  <button type="button" className="autofill-btn" onClick={handleAutoExtract}>
                    <Sparkles size={12} /> Auto-populate fields from text
                  </button>
                </div>
              </Field>
            </div>

            {validationMessage && (
              <div className="form-alert">
                <AlertCircle size={16} />
                <span>{validationMessage}</span>
              </div>
            )}

            <div className="form-footer">
              <p>
                <span className="status-pulse status-dot-active" />
                <span>Rule-based analysis engine ready (Explainable v1.0)</span>
              </p>
              <button className="button button-primary analyze-button" type="submit">
                Analyse land scenario <ArrowRightIcon />
              </button>
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
