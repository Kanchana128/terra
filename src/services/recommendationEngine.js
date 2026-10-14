/**
 * TerraSense AI - Explainable Crop Recommendation Engine
 * 
 * Evaluates provided land conditions against established agricultural requirements
 * from the crop knowledge base.
 * 
 * Methodological Principles:
 * 1. Evidence-based: Recommendations derive strictly from known, explicitly provided values.
 * 2. Transparent uncertainty: Missing parameters are NEVER fabricated or silently defaulted.
 * 3. Justified scoring: Scores represent the weighted fulfillment of known factors.
 * 4. Agronomic accountability: Clearly separates positive matches, limiting factors,
 *    and unverified risks.
 */

import { cropKnowledgeBase, agriculturalRegions } from '../data/cropKnowledgeBase.js'

/**
 * Recognizes the Agro-Climatic Zone and regional climate baseline from a location string.
 */
export function detectAgroClimaticZone(location) {
  if (!location || typeof location !== 'string') return null
  const clean = location.trim().toLowerCase()
  if (!clean) return null

  // Check specific agricultural regions first
  for (const reg of agriculturalRegions) {
    if (reg.name.toLowerCase().includes(clean) || clean.includes(reg.name.toLowerCase())) {
      return reg
    }
    for (const kw of reg.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i')
      if (regex.test(clean)) {
        return reg
      }
    }
  }

  // Broad agro-climatic patterns
  if (clean.includes('coastal') || clean.includes('delta')) {
    return {
      name: location,
      zone: 'Coastal / Deltaic Agro-Climatic Zone',
      climateProfile: 'Humid Coastal Delta',
      keyCrops: ['Rice (Paddy)', 'Pulses']
    }
  }
  if (clean.includes('arid') || clean.includes('desert') || clean.includes('dry')) {
    return {
      name: location,
      zone: 'Western Arid Desert Zone',
      climateProfile: 'Arid Low Precipitation',
      keyCrops: ['Pearl Millet', 'Pulses']
    }
  }
  if (clean.includes('plateau') || clean.includes('semi-arid') || clean.includes('dryland')) {
    return {
      name: location,
      zone: 'Semi-Arid Plateau Agro-Climatic Zone',
      climateProfile: 'Rainfed Dryland Plateau',
      keyCrops: ['Ragi (Finger Millet)', 'Pearl Millet (Bajra) / Sorghum (Jowar)', 'Pulses', 'Groundnut']
    }
  }
  if (clean.includes('plain') || clean.includes('basin') || clean.includes('gangetic')) {
    return {
      name: location,
      zone: 'Alluvial River Basin / Plains',
      climateProfile: 'Alluvial Cropland',
      keyCrops: ['Wheat', 'Rice (Paddy)', 'Maize']
    }
  }

  return null
}

/**
 * Validates form numerical inputs and identifies agronomic anomalies/contradictions.
 */
export function validateAndAuditConditions(form) {
  const errors = []
  const warnings = []
  const known = {}
  const missing = []

  // Total evaluated fields
  // 1. Location & Agro-Climatic Zone Detection
  if (form.location && form.location.trim()) {
    known.location = form.location.trim()
    const detectedZone = detectAgroClimaticZone(known.location)
    if (detectedZone) {
      known.agroClimaticZone = detectedZone.zone
      known.climateProfile = detectedZone.climateProfile
      known.regionProfile = detectedZone
    }
  } else {
    missing.push('Land location')
  }

  // 2. Area
  if (form.area && !isNaN(Number(form.area)) && Number(form.area) > 0) {
    known.area = `${Number(form.area)} ${form.areaUnit || 'hectares'}`
    known.areaValue = Number(form.area)
    known.areaUnit = form.areaUnit || 'hectares'
  } else if (form.area !== undefined && form.area !== '') {
    errors.push('Land area must be a positive number greater than 0.')
  } else {
    missing.push('Land area')
  }

  // 3. Soil Type
  if (form.soilType && form.soilType !== 'Unknown') {
    known.soilType = form.soilType
  } else {
    missing.push('Soil type')
  }

  // 4. Soil pH
  if (form.soilPh !== '' && form.soilPh !== undefined && form.soilPh !== null) {
    const ph = Number(form.soilPh)
    if (isNaN(ph) || ph < 0 || ph > 14) {
      errors.push('Soil pH must be a valid number between 0.0 and 14.0.')
    } else {
      known.soilPh = ph
      if (ph < 4.8) warnings.push('Strongly acidic soil (pH < 4.8): Strongly inhibits rhizobial nodulation and locks phosphorus.')
      else if (ph < 5.5) warnings.push('Moderately acidic soil (pH 4.8 - 5.5): Sensitive crops will require agricultural liming.')
      if (ph > 8.5) warnings.push('Alkaline/calcareous soil (pH > 8.5): Micronutrients (Zinc, Iron) may be immobilized.')
    }
  } else {
    missing.push('Soil pH (measured via lab or kit)')
  }

  // 5. Temperature
  if (form.temperature !== '' && form.temperature !== undefined && form.temperature !== null) {
    const temp = Number(form.temperature)
    if (isNaN(temp) || temp < -20 || temp > 60) {
      errors.push('Average temperature must be within a realistic range (-20°C to 60°C).')
    } else {
      known.temperature = temp
      if (temp > 40) warnings.push('Extreme heat (> 40°C): High risk of pollen sterility and high evaporative demand.')
      if (temp < 10) warnings.push('Low temperature (< 10°C): Warm-season tropical crops will suffer chilling injury.')
    }
  } else {
    missing.push('Average ambient temperature')
  }

  // 6. Rainfall
  if (form.rainfall !== '' && form.rainfall !== undefined && form.rainfall !== null) {
    const rain = Number(form.rainfall)
    if (isNaN(rain) || rain < 0 || rain > 12000) {
      errors.push('Annual rainfall must be a non-negative number up to 12,000 mm/yr.')
    } else {
      known.rainfall = rain
      if (rain < 350) warnings.push('Arid rainfall level (< 350 mm/yr): Rainfed farming is restricted to highly drought-hardy millets.')
      if (rain > 2500) warnings.push('High rainfall (> 2500 mm/yr): Erosion and soil leaching risks are elevated.')
    }
  } else {
    missing.push('Annual rainfall (mm/year)')
  }

  // 7. Water Availability
  if (form.waterAvailability && form.waterAvailability !== 'Unknown') {
    known.waterAvailability = form.waterAvailability
  } else {
    missing.push('General water availability')
  }

  // 8. Irrigation
  if (form.irrigation && form.irrigation !== 'Unknown') {
    known.irrigation = form.irrigation
  } else {
    missing.push('Irrigation infrastructure')
  }

  // 9. Drainage
  if (form.drainage && form.drainage !== 'Unknown') {
    known.drainage = form.drainage
  } else {
    missing.push('Field drainage condition')
  }

  // 10. Growing Season
  if (form.growingSeason && form.growingSeason.trim()) {
    known.growingSeason = form.growingSeason.trim()
  } else {
    missing.push('Growing season / window')
  }

  // Case study / Scenario description
  if (form.description && form.description.trim()) {
    known.description = form.description.trim()
  }

  // Cross-variable consistency & agronomic conflict audits
  if (known.soilType === 'Sandy' && known.drainage === 'Poorly drained') {
    warnings.push('Agronomic anomaly: Sandy soils typically drain rapidly. If poorly drained, check for hardpan or shallow groundwater table.')
  }
  if (known.rainfall !== undefined && known.rainfall < 400 && known.irrigation === 'Not available' && known.waterAvailability === 'High') {
    warnings.push('Conflict: High water availability is indicated, yet rainfall is < 400 mm and irrigation is Not Available.')
  }
  if (known.drainage === 'Poorly drained' && known.waterAvailability === 'Low' && (known.rainfall === undefined || known.rainfall < 500)) {
    warnings.push('Observation: Poor drainage noted in low-moisture setting; check for heavy subsoil crusting.')
  }

  return { errors, warnings, known, missing }
}

/**
 * Evaluates a single crop against provided land conditions across 5 key dimensions.
 */
function evaluateCrop(crop, known, missing) {
  let evaluatedMaxPoints = 0
  let earnedPoints = 0

  const matchingConditions = []
  const limitingConditions = []
  const missingImpact = []
  const risks = [...(crop.risksAndConstraints || [])]
  const nextSteps = [...(crop.recommendedInterventions || [])]

  const scoreBreakdown = {
    soil: { max: 20, earned: null, status: 'Unassessed' },
    ph: { max: 20, earned: null, status: 'Unassessed' },
    water: { max: 30, earned: null, status: 'Unassessed' },
    temperature: { max: 15, earned: null, status: 'Unassessed' },
    drainage: { max: 15, earned: null, status: 'Unassessed' }
  }

  // ==========================================
  // Dimension 1: Soil Texture Compatibility (20 pts)
  // ==========================================
  if (known.soilType) {
    evaluatedMaxPoints += 20
    const isOptimal = crop.optimalSoilTypes.includes(known.soilType)
    if (isOptimal) {
      earnedPoints += 20
      scoreBreakdown.soil = { max: 20, earned: 20, status: 'Optimal' }
      matchingConditions.push(`${known.soilType} soil is optimal for ${crop.name} root development and nutrient uptake.`)
    } else {
      if (crop.id === 'groundnut' && known.soilType === 'Clayey') {
        earnedPoints += 0
        scoreBreakdown.soil = { max: 20, earned: 0, status: 'Severe Barrier' }
        limitingConditions.push(`Heavy clay soil severely obstructs groundnut peg penetration and makes harvest pod recovery difficult.`)
      } else if (crop.id === 'rice' && known.soilType === 'Sandy') {
        earnedPoints += 4
        scoreBreakdown.soil = { max: 20, earned: 4, status: 'Severe Percolation' }
        limitingConditions.push(`Sandy soil has high percolation rates, making required standing water retention difficult and water-intensive.`)
      } else {
        earnedPoints += 10
        scoreBreakdown.soil = { max: 20, earned: 10, status: 'Sub-optimal' }
        limitingConditions.push(`${known.soilType} soil is sub-optimal compared to preferred (${crop.optimalSoilTypes.join(', ')}).`)
      }
    }
  } else {
    missingImpact.push(`Soil texture is unspecified; optimal soils are ${crop.optimalSoilTypes.join(' or ')}.`)
  }

  // ==========================================
  // Dimension 2: Soil pH Suitability (20 pts)
  // ==========================================
  if (known.soilPh !== undefined) {
    evaluatedMaxPoints += 20
    const ph = known.soilPh
    const { min, max, optimalMin, optimalMax } = crop.phRange

    if (ph >= optimalMin && ph <= optimalMax) {
      earnedPoints += 20
      scoreBreakdown.ph = { max: 20, earned: 20, status: 'Optimal' }
      matchingConditions.push(`Soil pH ${ph} is in the optimal range (${optimalMin} - ${optimalMax}).`)
    } else if (ph >= min && ph <= max) {
      earnedPoints += 14
      scoreBreakdown.ph = { max: 20, earned: 14, status: 'Tolerable' }
      limitingConditions.push(`Soil pH ${ph} is tolerable (${min} - ${max}), but outside optimal window (${optimalMin} - ${optimalMax}).`)
    } else if (ph < min) {
      // Acidic constraint
      const deficit = min - ph
      let pts = Math.max(0, 10 - Math.round(deficit * 12))
      if (crop.id === 'pulses' && ph < 5.2) {
        pts = Math.min(pts, 3) // Severe reduction for pulses under high acidity
        limitingConditions.push(`Soil pH ${ph} is too acidic for pulses; suppresses Rhizobium bacteria and stops biological nitrogen fixation.`)
        nextSteps.unshift('Apply agricultural lime (CaCO3) or dolomite 3-4 weeks before sowing to elevate pH above 6.0.')
      } else {
        limitingConditions.push(`Soil pH ${ph} is below crop minimum threshold (${min}); liming required for commercial yields.`)
      }
      earnedPoints += pts
      scoreBreakdown.ph = { max: 20, earned: pts, status: 'Acidic Constraint' }
    } else {
      // Alkaline constraint
      const excess = ph - max
      const pts = Math.max(0, 10 - Math.round(excess * 10))
      earnedPoints += pts
      scoreBreakdown.ph = { max: 20, earned: pts, status: 'Alkaline Constraint' }
      limitingConditions.push(`Soil pH ${ph} exceeds crop maximum threshold (${max}); iron/zinc deficiency may occur.`)
      nextSteps.unshift('Apply organic compost and gypsum to buffer soil alkalinity and mobilize micronutrients.')
    }
  } else {
    missingImpact.push(`Soil pH unmeasured; ${crop.name} requires pH ${crop.phRange.optimalMin} - ${crop.phRange.optimalMax}.`)
  }

  // ==========================================
  // Dimension 3: Moisture & Water Sufficiency (30 pts)
  // ==========================================
  let waterEvaluated = false
  let waterMax = 0
  let waterEarned = 0

  // Part A: Rainfall (15 pts)
  if (known.rainfall !== undefined) {
    waterEvaluated = true
    waterMax += 15
    const rain = known.rainfall
    const { min, max, optimalMin, optimalMax } = crop.rainfallRange

    if (rain >= optimalMin && rain <= optimalMax) {
      waterEarned += 15
      matchingConditions.push(`Annual rainfall of ${rain} mm/yr provides optimal precipitation (${optimalMin} - ${optimalMax} mm).`)
    } else if (rain >= min && rain <= max) {
      waterEarned += 11
      matchingConditions.push(`Annual rainfall of ${rain} mm/yr meets baseline precipitation requirements (${min} - ${max} mm).`)
    } else if (rain < min) {
      if (known.irrigation === 'Available') {
        waterEarned += 10
        limitingConditions.push(`Rainfall ${rain} mm is below crop baseline (${min} mm), but assured irrigation offsets rain deficit.`)
      } else if (known.irrigation === 'Limited') {
        waterEarned += 4
        limitingConditions.push(`Rainfall deficit (${rain} mm vs ${min} mm required); limited irrigation leaves crop vulnerable during peak flowering.`)
      } else {
        waterEarned += 0
        limitingConditions.push(`Severe water deficit: ${rain} mm/yr rainfall without irrigation is insufficient for ${crop.name} (needs ≥ ${min} mm).`)
      }
    } else {
      // Rain > max
      if (crop.waterRequirement === 'Low') {
        waterEarned += 4
        limitingConditions.push(`High rainfall (${rain} mm/yr vs crop upper tolerance ${max} mm) elevates foliar disease and water stagnation risks.`)
      } else {
        waterEarned += 12
        matchingConditions.push(`Abundant rainfall (${rain} mm/yr) supports crop's high moisture requirements.`)
      }
    }
  }

  // Part B: Water availability & irrigation status (15 pts)
  if (known.waterAvailability || known.irrigation) {
    waterEvaluated = true
    waterMax += 15
    const water = known.waterAvailability || 'Unknown'
    const irrig = known.irrigation || 'Unknown'

    if (crop.waterRequirement === 'High') {
      if (water === 'High' || irrig === 'Available') {
        waterEarned += 15
        matchingConditions.push(`Water availability and irrigation capacity satisfy high seasonal moisture needs.`)
      } else if (water === 'Medium' || irrig === 'Limited') {
        waterEarned += 7
        limitingConditions.push(`Moderate water availability may restrict yield without scheduled supplemental watering.`)
      } else {
        waterEarned += 0
        limitingConditions.push(`Low water and lack of irrigation is a critical barrier for high-water crop.`)
      }
    } else if (crop.waterRequirement === 'Low') {
      if (water === 'Low' || water === 'Medium') {
        waterEarned += 15
        matchingConditions.push(`Low moisture requirement matches dryland field conditions; high drought resistance.`)
      } else {
        waterEarned += 10
        matchingConditions.push(`Moisture is ample, but avoid excessive standing water for dryland crop.`)
      }
    } else {
      // Medium water requirement
      if (water === 'Medium' || irrig === 'Available' || irrig === 'Limited') {
        waterEarned += 14
        matchingConditions.push(`Medium crop water requirement aligns with available water resources.`)
      } else if (water === 'High') {
        waterEarned += 12
        matchingConditions.push(`Ample water supply readily accommodates medium moisture demand.`)
      } else {
        waterEarned += 5
        limitingConditions.push(`Low water availability may limit vegetative biomass without supplemental moisture.`)
      }
    }
  }

  if (waterEvaluated) {
    evaluatedMaxPoints += waterMax
    earnedPoints += waterEarned
    scoreBreakdown.water = {
      max: waterMax,
      earned: waterEarned,
      status: `${waterEarned}/${waterMax} pts`
    }
  } else {
    missingImpact.push(`Neither rainfall nor water/irrigation was recorded; moisture adequacy is unassessed.`)
  }

  // ==========================================
  // Dimension 4: Temperature Fit (15 pts)
  // ==========================================
  if (known.temperature !== undefined) {
    evaluatedMaxPoints += 15
    const temp = known.temperature
    const { min, max, optimalMin, optimalMax } = crop.temperatureRange

    if (temp >= optimalMin && temp <= optimalMax) {
      earnedPoints += 15
      scoreBreakdown.temperature = { max: 15, earned: 15, status: 'Optimal' }
      matchingConditions.push(`Temperature ${temp}°C fits ideal metabolic and reproductive window (${optimalMin}°C - ${optimalMax}°C).`)
    } else if (temp >= min && temp <= max) {
      earnedPoints += 10
      scoreBreakdown.temperature = { max: 15, earned: 10, status: 'Tolerable' }
      matchingConditions.push(`Temperature ${temp}°C is within acceptable range (${min}°C - ${max}°C).`)
    } else {
      // Out of bounds
      let pts = 0
      if (crop.id === 'wheat' && temp > 26) {
        pts = 2
        limitingConditions.push(`Average temperature of ${temp}°C is too warm for wheat (cool-season crop; causes terminal heat stress and grain shriveling).`)
      } else if (temp > max) {
        pts = Math.max(0, 8 - (temp - max) * 2)
        limitingConditions.push(`High temperature (${temp}°C) exceeds crop tolerance (${max}°C); increased evaporation and floral stress.`)
      } else {
        pts = Math.max(0, 8 - (min - temp) * 2)
        limitingConditions.push(`Low temperature (${temp}°C) is below minimum threshold (${min}°C); slows vegetative growth.`)
      }
      earnedPoints += pts
      scoreBreakdown.temperature = { max: 15, earned: pts, status: 'Thermal Stress' }
    }
  } else {
    missingImpact.push(`Temperature unrecorded; ${crop.name} requires ${crop.temperatureRange.optimalMin}°C - ${crop.temperatureRange.optimalMax}°C.`)
  }

  // ==========================================
  // Dimension 5: Field Drainage Compatibility (15 pts)
  // ==========================================
  if (known.drainage) {
    evaluatedMaxPoints += 15
    const drainage = known.drainage
    const tolerated = crop.drainageTolerance || []

    if (tolerated.includes(drainage)) {
      earnedPoints += 15
      scoreBreakdown.drainage = { max: 15, earned: 15, status: 'Compatible' }
      matchingConditions.push(`Field drainage (${drainage}) satisfies crop aeration and root tolerance.`)
    } else {
      if (drainage === 'Poorly drained' && crop.waterRequirement !== 'High') {
        earnedPoints += 0
        scoreBreakdown.drainage = { max: 15, earned: 0, status: 'Intolerant' }
        limitingConditions.push(`Poor drainage and water stagnation cause root hypoxia, collar rot, and wilt for ${crop.name}.`)
        nextSteps.unshift('Construct deep open trenches or raised beds (broad-bed furrows) to evacuate excess water.')
      } else if (drainage === 'Well drained' && crop.id === 'rice') {
        earnedPoints += 5
        scoreBreakdown.drainage = { max: 15, earned: 5, status: 'Ponding Barrier' }
        limitingConditions.push(`Paddy demands standing water; rapid drainage requires continuous puddling or intensive irrigation.`)
      } else {
        earnedPoints += 6
        scoreBreakdown.drainage = { max: 15, earned: 6, status: 'Sub-optimal' }
        limitingConditions.push(`Drainage condition (${drainage}) is non-optimal for this crop.`)
      }
    }
  } else {
    missingImpact.push(`Field drainage condition unknown; requires ${crop.drainageTolerance.join(' or ')}.`)
  }

  // ==========================================
  // Score Normalization & Classification
  // ==========================================
  const justifiedScore = evaluatedMaxPoints > 0
    ? Math.round((earnedPoints / evaluatedMaxPoints) * 100)
    : 50

  // Agronomic disqualifiers and bottleneck checks
  // Regional adaptation alignment check
  if (known.regionProfile && known.regionProfile.keyCrops) {
    const isRegionalKeyCrop = known.regionProfile.keyCrops.some((k) => 
      crop.name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(crop.name.toLowerCase())
    )
    if (isRegionalKeyCrop) {
      matchingConditions.unshift(`Regionally aligned: Recognized as an established staple/cash crop of the ${known.regionProfile.zone}.`)
    }
  }

  const isSevereWaterDeficit = known.rainfall !== undefined && known.rainfall < (crop.rainfallRange.min * 0.7) && known.irrigation === 'Not available' && crop.waterRequirement === 'High'
  const isSevereWaterloggingConflict = known.drainage === 'Poorly drained' && !crop.drainageTolerance.includes('Poorly drained') && crop.id !== 'rice'
  const isSevereSoilConflict = crop.id === 'groundnut' && known.soilType === 'Clayey'
  const isSevereThermalConflict = crop.id === 'wheat' && known.temperature !== undefined && known.temperature > 27

  let suitability = 'Conditional match'
  let suitabilityReason = ''

  if (isSevereWaterDeficit) {
    suitability = 'Poor match'
    suitabilityReason = 'Severe water deficit: Rainfed moisture cannot support high crop water requirement.'
  } else if (isSevereWaterloggingConflict) {
    suitability = 'Poor match'
    suitabilityReason = 'Poor drainage: Susceptible to root asphyxiation and collar rot in waterlogged soil.'
  } else if (isSevereSoilConflict) {
    suitability = 'Poor match'
    suitabilityReason = 'Soil barrier: Heavy clay prevents pegging and pod extraction.'
  } else if (isSevereThermalConflict) {
    suitability = 'Poor match'
    suitabilityReason = 'Heat stress: Tropical heat severely inhibits grain filling in cool-season wheat.'
  } else if (justifiedScore >= 80) {
    // If critical factors are missing, temper certainty
    if (missing.length >= 4) {
      suitability = 'Conditional match'
      suitabilityReason = 'High score on provided parameters, but subject to verification of missing factors.'
    } else {
      suitability = 'Strong match'
      suitabilityReason = 'High alignment across verified soil, water, climate, and drainage parameters.'
    }
  } else if (justifiedScore >= 55) {
    suitability = 'Conditional match'
    suitabilityReason = 'Viable option provided specific management interventions (soil/water/drainage) are adopted.'
  } else {
    suitability = 'Poor match'
    suitabilityReason = 'Notable limiting factors significantly depress potential yield or elevate risk.'
  }

  // Comparison table quick summary badges
  const soilCompatibility = known.soilType
    ? (crop.optimalSoilTypes.includes(known.soilType) ? 'Optimal' : (crop.id === 'groundnut' && known.soilType === 'Clayey' ? 'Incompatible' : 'Tolerable'))
    : 'Unknown'
  const waterRequirements = `${crop.waterRequirement} (${crop.rainfallRange.min}-${crop.rainfallRange.max} mm)`
  const climateCompatibility = known.temperature !== undefined
    ? (known.temperature >= crop.temperatureRange.optimalMin && known.temperature <= crop.temperatureRange.optimalMax ? 'Optimal' : (known.temperature >= crop.temperatureRange.min && known.temperature <= crop.temperatureRange.max ? 'Compatible' : 'Stressful'))
    : 'Unassessed'

  // Standardized Matrix Labels: Suitable, Conditional, Unsuitable, Unknown
  const matrixStatus = {
    soil: !known.soilType || known.soilType === 'Unknown'
      ? 'Unknown'
      : (crop.optimalSoilTypes.includes(known.soilType) ? 'Suitable'
      : (crop.id === 'groundnut' && known.soilType === 'Clayey' ? 'Unsuitable' : 'Conditional')),

    ph: known.soilPh === undefined || known.soilPh === null
      ? 'Unknown'
      : (known.soilPh >= crop.phRange.optimalMin && known.soilPh <= crop.phRange.optimalMax ? 'Suitable'
      : (known.soilPh >= crop.phRange.min && known.soilPh <= crop.phRange.max ? 'Conditional' : 'Unsuitable')),

    rainfall: known.rainfall === undefined || known.rainfall === null
      ? 'Unknown'
      : (known.rainfall >= crop.rainfallRange.optimalMin && known.rainfall <= crop.rainfallRange.optimalMax ? 'Suitable'
      : (known.rainfall >= crop.rainfallRange.min && known.rainfall <= crop.rainfallRange.max ? 'Conditional' : 'Unsuitable')),

    temperature: known.temperature === undefined || known.temperature === null
      ? 'Unknown'
      : (known.temperature >= crop.temperatureRange.optimalMin && known.temperature <= crop.temperatureRange.optimalMax ? 'Suitable'
      : (known.temperature >= crop.temperatureRange.min && known.temperature <= crop.temperatureRange.max ? 'Conditional' : 'Unsuitable')),

    water: (!known.waterAvailability || known.waterAvailability === 'Unknown') && (!known.irrigation || known.irrigation === 'Unknown')
      ? 'Unknown'
      : ((known.waterAvailability === 'High' || known.irrigation === 'Available' || crop.waterRequirement === 'Low') ? 'Suitable'
      : (known.waterAvailability === 'Low' && crop.waterRequirement === 'High' && known.irrigation === 'Not available' ? 'Unsuitable' : 'Conditional')),

    drainage: !known.drainage || known.drainage === 'Unknown'
      ? 'Unknown'
      : (crop.drainageTolerance.includes(known.drainage) ? 'Suitable'
      : (known.drainage === 'Poorly drained' && crop.id !== 'rice' ? 'Unsuitable' : 'Conditional'))
  }

  return {
    id: crop.id,
    name: crop.name,
    category: crop.category,
    scientificName: crop.scientificName,
    score: justifiedScore,
    suitability,
    suitabilityReason,
    soilCompatibility,
    waterRequirements,
    climateCompatibility,
    drainageTolerance: crop.drainageTolerance.join(', '),
    scoreBreakdown,
    matrixStatus,
    explanation: generateCropSummary(crop, suitability, matchingConditions, limitingConditions),
    matchingConditions,
    limitingConditions,
    missingImpact,
    risks,
    nextSteps,
    evaluatedPoints: earnedPoints,
    evaluatedMaxPoints,
    source: crop.source,
    verified: crop.verified
  }
}

function generateCropSummary(crop, suitability, matching, limiting) {
  if (suitability === 'Strong match') {
    return `${crop.name} is a strong candidate. ${matching[0] || 'Conditions match key biological requirements.'}`
  }
  if (suitability === 'Conditional match') {
    return `${crop.name} is viable with active management. ${limiting[0] || 'Attention to soil or moisture interventions is advised.'}`
  }
  return `${crop.name} faces notable constraints in this setting. ${limiting[0] || 'Key conditions conflict with ideal requirements.'}`
}

/**
 * Intelligent scenario text extractor.
 * Automatically detects agricultural cues when users paste a case study description.
 */
export function parseScenarioText(text) {
  if (!text || typeof text !== 'string') return {}

  const extracted = {}
  const lower = text.toLowerCase()

  // Location detection: look for "in [Location]", "at [Location]", "region", "district"
  const locationMatch = text.match(/(?:located in|in|at|farm in|region of)\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|\n|with|where|averaging)/i)
  if (locationMatch && locationMatch[1].trim().length > 2 && locationMatch[1].trim().length < 50) {
    extracted.location = locationMatch[1].trim()
  }

  // Area detection
  const areaMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hectares|ha|acres|acre|m2|sq\s*meters)/i)
  if (areaMatch) {
    extracted.area = areaMatch[1]
    if (/acre/i.test(areaMatch[0])) extracted.areaUnit = 'acres'
    else if (/m2|sq/i.test(areaMatch[0])) extracted.areaUnit = 'square meters'
    else extracted.areaUnit = 'hectares'
  }

  // Soil Type
  if (lower.includes('sandy loam') || lower.includes('sandy')) extracted.soilType = 'Sandy'
  else if (lower.includes('clay') || lower.includes('alluvial clay') || lower.includes('black cotton')) extracted.soilType = 'Clayey'
  else if (lower.includes('loam') || lower.includes('red loam')) extracted.soilType = 'Loamy'
  else if (lower.includes('silt')) extracted.soilType = 'Silty'

  // Soil pH
  const phMatch = text.match(/(?:ph(?:\s*(?:value|measured|level|of))?[\s:=]+)(\d+(?:\.\d+)?)/i)
  if (phMatch) {
    const ph = parseFloat(phMatch[1])
    if (ph >= 0 && ph <= 14) extracted.soilPh = ph.toString()
  }

  // Rainfall
  const rainMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:mm|millimeter|millimetre)/i)
  if (rainMatch) {
    extracted.rainfall = rainMatch[1]
  }

  // Temperature
  const tempMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:°c|degrees?\s*c|celsius)/i)
  if (tempMatch) {
    extracted.temperature = tempMatch[1]
  }

  // Water & Irrigation
  if (lower.includes('high water') || lower.includes('abundant water') || lower.includes('perennial river')) {
    extracted.waterAvailability = 'High'
  } else if (lower.includes('semi-arid') || lower.includes('dryland') || lower.includes('scarce water') || lower.includes('low water') || lower.includes('water is low')) {
    extracted.waterAvailability = 'Low'
  } else if (lower.includes('moderate water') || lower.includes('medium water')) {
    extracted.waterAvailability = 'Medium'
  }

  if (lower.includes('canal irrigation') || lower.includes('tubewell available') || lower.includes('assured irrigation') || lower.includes('irrigation is available')) {
    extracted.irrigation = 'Available'
  } else if (lower.includes('limited irrigation') || lower.includes('protective watering') || lower.includes('restricted irrigation')) {
    extracted.irrigation = 'Limited'
  } else if (lower.includes('rainfed') || lower.includes('no irrigation') || lower.includes('irrigation is not available') || lower.includes('not available')) {
    extracted.irrigation = 'Not available'
  }

  // Drainage
  if (lower.includes('poorly drained') || lower.includes('waterlogged') || lower.includes('submerged') || lower.includes('stagnant water')) {
    extracted.drainage = 'Poorly drained'
  } else if (lower.includes('well drained') || lower.includes('good drainage') || lower.includes('free draining')) {
    extracted.drainage = 'Well drained'
  } else if (lower.includes('moderate drainage')) {
    extracted.drainage = 'Moderate'
  }

  // Season
  if (lower.includes('kharif') || lower.includes('monsoon')) extracted.growingSeason = 'Kharif / Monsoon'
  else if (lower.includes('rabi') || lower.includes('winter')) extracted.growingSeason = 'Rabi / Winter'
  else if (lower.includes('summer')) extracted.growingSeason = 'Summer'

  return extracted
}

/**
 * Main analysis function that evaluates land conditions against the knowledge base.
 */
export function analyzeLandConditions(form, customKnowledge = []) {
  const audit = validateAndAuditConditions(form)

  if (audit.errors.length > 0) {
    return {
      success: false,
      errors: audit.errors,
      warnings: audit.warnings
    }
  }

  // Merge default knowledge base with any user-added custom knowledge
  const allCrops = [...cropKnowledgeBase]
  if (customKnowledge && customKnowledge.length > 0) {
    customKnowledge.forEach((entry) => {
      if (!allCrops.some((c) => c.name.toLowerCase() === entry.name.toLowerCase())) {
        allCrops.push({
          id: entry.id || entry.name.toLowerCase().replace(/\s+/g, '-'),
          name: entry.name,
          category: 'Custom Entry',
          optimalSoilTypes: entry.soil ? [entry.soil] : ['Loamy'],
          phRange: { min: 5.5, max: 7.5, optimalMin: 6.0, optimalMax: 7.0 },
          rainfallRange: { min: 400, max: 1200, optimalMin: 600, optimalMax: 900 },
          temperatureRange: { min: 18, max: 35, optimalMin: 22, optimalMax: 30 },
          waterRequirement: entry.water || 'Medium',
          drainageTolerance: ['Well drained', 'Moderate'],
          irrigationSensitivity: 'Moderate',
          growingSeasons: [entry.season || 'General'],
          description: `User-defined crop profile from source: ${entry.source || 'User input'}.`,
          risksAndConstraints: ['Custom entry: Field verification needed.'],
          recommendedInterventions: ['Consult local agronomy extension for verified thresholds.'],
          source: entry.source || 'User-added reference',
          verified: false
        })
      }
    })
  }

  // Evaluate all crops
  const evaluatedCrops = allCrops.map((crop) => evaluateCrop(crop, audit.known, audit.missing))

  // Sort crops: Strong match first, then by score descending
  const priorityOrder = { 'Strong match': 1, 'Conditional match': 2, 'Poor match': 3 }
  evaluatedCrops.sort((a, b) => {
    if (priorityOrder[a.suitability] !== priorityOrder[b.suitability]) {
      return priorityOrder[a.suitability] - priorityOrder[b.suitability]
    }
    return b.score - a.score
  })

  // Summary counts
  const strongMatches = evaluatedCrops.filter((c) => c.suitability === 'Strong match')
  const conditionalMatches = evaluatedCrops.filter((c) => c.suitability === 'Conditional match')
  const poorMatches = evaluatedCrops.filter((c) => c.suitability === 'Poor match')

  // Completeness metric (10 standard land parameters)
  const totalStandardFields = 10
  const evaluatedFieldKeys = [
    'location', 'area', 'soilType', 'soilPh', 'temperature',
    'rainfall', 'waterAvailability', 'irrigation', 'drainage', 'growingSeason'
  ]
  const knownFieldsCount = evaluatedFieldKeys.filter((k) => audit.known[k] !== undefined).length
  const completenessPercentage = Math.round((knownFieldsCount / totalStandardFields) * 100)

  // Insights Extraction for Land Analysis Insights Panel
  const favourableConditions = []
  if (audit.known.soilType && audit.known.soilType !== 'Unknown') {
    favourableConditions.push(`Soil texture identified as ${audit.known.soilType}, enabling targeted physical aeration and tilth management.`)
  }
  if (audit.known.soilPh !== undefined) {
    if (audit.known.soilPh >= 6.0 && audit.known.soilPh <= 7.5) {
      favourableConditions.push(`Measured pH ${audit.known.soilPh} falls within the optimal neutral zone, ensuring maximum bioavailability of N, P, and K.`)
    } else {
      favourableConditions.push(`Measured soil pH ${audit.known.soilPh} provides a definitive chemical baseline for precise corrective amendment.`)
    }
  }
  if (audit.known.rainfall !== undefined && audit.known.rainfall >= 600) {
    favourableConditions.push(`Annual rainfall (${audit.known.rainfall} mm/yr) supports rainfed or protective irrigation cropping cycles.`)
  }
  if (audit.known.waterAvailability === 'High' || audit.known.irrigation === 'Available') {
    favourableConditions.push('Irrigation infrastructure or high water availability mitigates critical dry-spells.')
  }
  if (audit.known.drainage === 'Well drained') {
    favourableConditions.push('Well-drained soil structure prevents surface stagnation and maintains root zone aeration.')
  }
  if (evaluatedCrops[0]?.matchingConditions) {
    evaluatedCrops[0].matchingConditions.forEach((m) => {
      if (!favourableConditions.includes(m)) favourableConditions.push(m)
    })
  }

  const potentialRisks = [...audit.warnings]
  if (audit.known.drainage === 'Poorly drained') {
    potentialRisks.push('Waterlogging vulnerability: High risk of root rot and nutrient leaching during peak rainfall.')
  }
  if (audit.known.rainfall !== undefined && audit.known.rainfall < 450 && audit.known.irrigation === 'Not available') {
    potentialRisks.push('Drought vulnerability: Rainfed moisture deficit threatens water-sensitive crops without supplementary supply.')
  }
  if (audit.known.temperature !== undefined && audit.known.temperature > 38) {
    potentialRisks.push('Thermal heat stress: High evaporative demand and potential floral sterility during reproductive stages.')
  }
  if (audit.known.soilPh !== undefined && audit.known.soilPh < 5.0) {
    potentialRisks.push(`Soil acidity risk (pH ${audit.known.soilPh}): Aluminum/manganese toxicity and phosphorus fixation likely without liming.`)
  }
  if (audit.known.soilPh !== undefined && audit.known.soilPh > 8.2) {
    potentialRisks.push(`Soil alkalinity / sodicity risk (pH ${audit.known.soilPh}): Micronutrient lockout (zinc, iron) and calcium carbonate barrier.`)
  }

  const informationNeeded = audit.missing.map((param) => {
    if (param.includes('pH')) return `${param} — certified laboratory soil testing recommended to measure acidity/alkalinity.`
    if (param.includes('rainfall')) return `${param} — historical seasonal rainfall records needed to size water-storage ponds.`
    if (param.includes('temperature')) return `${param} — micro-climate diurnal temperatures needed to schedule planting.`
    if (param.includes('irrigation')) return `${param} — field verification needed for canal, borewell, or drip infrastructure.`
    if (param.includes('drainage')) return `${param} — physical percolation test needed to identify subsurface hardpans.`
    return `${param} — unverified; requires field confirmation before capital investment.`
  })

  return {
    success: true,
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: `${strongMatches.length} strong · ${conditionalMatches.length} conditional · ${poorMatches.length} poor`,
    counts: {
      strong: strongMatches.length,
      conditional: conditionalMatches.length,
      poor: poorMatches.length,
      total: evaluatedCrops.length
    },
    summary: {
      location: audit.known.location || 'Location unspecified',
      agroClimaticZone: audit.known.agroClimaticZone || 'General Agro-Ecosystem',
      climateProfile: audit.known.climateProfile || 'Regional profile unassigned',
      area: audit.known.area || 'Area not specified',
      soilType: audit.known.soilType || 'Unknown / Not tested',
      soilPh: audit.known.soilPh !== undefined ? `pH ${audit.known.soilPh}` : 'Not tested',
      temperature: audit.known.temperature !== undefined ? `${audit.known.temperature}°C` : 'Not recorded',
      rainfall: audit.known.rainfall !== undefined ? `${audit.known.rainfall} mm/yr` : 'Not recorded',
      waterAvailability: audit.known.waterAvailability || 'Unknown',
      irrigation: audit.known.irrigation || 'Unknown',
      drainage: audit.known.drainage || 'Unknown',
      growingSeason: audit.known.growingSeason || 'Not specified',
      description: audit.known.description || ''
    },
    knownConditions: audit.known,
    missingInformation: audit.missing,
    warnings: audit.warnings,
    insights: {
      favourableConditions,
      potentialRisks,
      informationNeeded
    },
    completeness: {
      knownCount: knownFieldsCount,
      totalCount: totalStandardFields,
      percentage: completenessPercentage
    },
    monthlyClimateData: form.monthlyClimateData || null,
    climateSource: form.climateSource || null,
    crops: evaluatedCrops,
    topRecommendations: evaluatedCrops.slice(0, 4),
    scoringExplanation: 'Scores (0-100) are computed strictly across evaluated known parameters: Soil Texture (20%), Soil pH (20%), Moisture & Irrigation (30%), Temperature (15%), Drainage (15%). Missing factors are excluded from penalization and explicitly flagged for verification.'
  }
}
