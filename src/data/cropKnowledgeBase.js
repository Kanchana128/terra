/**
 * TerraSense AI - Agricultural Reference Knowledge Base
 * 
 * Standard agronomic reference parameters for crops commonly cultivated in
 * diverse agro-climatic zones (semi-arid, humid, temperate, sub-tropical).
 * Sources: ICAR (Indian Council of Agricultural Research), FAO Crop Water Management,
 * TNAU Agritech Portal, and ICRISAT Crop Guidelines.
 */

export const cropKnowledgeBase = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    scientificName: 'Oryza sativa',
    category: 'Cereal / Staple',
    optimalSoilTypes: ['Clayey', 'Loamy', 'Silty'],
    phRange: { min: 5.0, max: 8.0, optimalMin: 5.5, optimalMax: 6.8 },
    rainfallRange: { min: 1000, max: 2500, optimalMin: 1200, optimalMax: 1800 },
    temperatureRange: { min: 20, max: 38, optimalMin: 22, optimalMax: 32 },
    waterRequirement: 'High',
    drainageTolerance: ['Poorly drained', 'Moderate'],
    irrigationSensitivity: 'Critical',
    growingSeasons: ['Kharif (Monsoon)', 'Rabi (Irrigated)', 'Wet Season (June-Nov)'],
    description: 'A major cereal crop that thrives in wet lowland conditions. Demands standing water or constant high moisture during vegetative and reproductive stages.',
    risksAndConstraints: [
      'High vulnerability to dry spells and water stress at tillering and flowering.',
      'Susceptible to blast disease and bacterial leaf blight under prolonged humidity.',
      'Cannot tolerate dry, porous sandy soils without excessive irrigation.'
    ],
    recommendedInterventions: [
      'Maintain 2-5 cm standing water during panicle initiation if irrigated.',
      'In heavy rainfall areas with poor drainage, ensure bunding and flood retention.',
      'If soil is acidic (pH < 5.5), apply lime or dolomite at land preparation.'
    ],
    source: 'ICAR-NRRI Cereal Handbook; FAO Irrigation & Drainage Paper 56',
    verified: true,
    verificationNote: 'Well-established agronomic thresholds for tropical and sub-tropical lowland paddy.'
  },
  {
    id: 'ragi',
    name: 'Ragi (Finger Millet)',
    scientificName: 'Eleusine coracana',
    category: 'Millet / Nutri-cereal',
    optimalSoilTypes: ['Sandy', 'Loamy', 'Silty'],
    phRange: { min: 5.0, max: 8.2, optimalMin: 5.5, optimalMax: 7.5 },
    rainfallRange: { min: 400, max: 1000, optimalMin: 500, optimalMax: 800 },
    temperatureRange: { min: 15, max: 35, optimalMin: 22, optimalMax: 30 },
    waterRequirement: 'Low',
    drainageTolerance: ['Well drained', 'Moderate'],
    irrigationSensitivity: 'Drought tolerant',
    growingSeasons: ['Kharif (July-Nov)', 'Summer (Irrigated)', 'Late Monsoon'],
    description: 'Exceptionally hardy climate-resilient nutri-cereal. Tolerates low rainfall, poor fertility, and moderate acidity.',
    risksAndConstraints: [
      'Cannot withstand prolonged waterlogging or stagnant water.',
      'Yield decreases significantly under continuous heavy rainfall during harvest.',
      'Blast disease can manifest in cloudy, high-humidity weather.'
    ],
    recommendedInterventions: [
      'Practice ridge-and-furrow method for moisture conservation in dry regions.',
      'Thinning at 2-3 weeks ensures optimal plant population and drought resistance.',
      'Requires minimal fertilization; well-suited for rainfed organic cultivation.'
    ],
    source: 'ICRISAT Dryland Millets Reference; ICAR-IIMR Guidelines',
    verified: true,
    verificationNote: 'Standard dryland millet thresholds verified across Deccan and southern plateau.'
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    scientificName: 'Zea mays',
    category: 'Cereal / Feed & Food',
    optimalSoilTypes: ['Loamy', 'Silty'],
    phRange: { min: 5.8, max: 7.8, optimalMin: 6.0, optimalMax: 7.2 },
    rainfallRange: { min: 500, max: 1100, optimalMin: 600, optimalMax: 900 },
    temperatureRange: { min: 18, max: 35, optimalMin: 21, optimalMax: 30 },
    waterRequirement: 'Medium',
    drainageTolerance: ['Well drained'],
    irrigationSensitivity: 'Moderate',
    growingSeasons: ['Kharif', 'Rabi', 'Spring'],
    description: 'High-yielding warm-season cereal that thrives in deep, fertile, well-aerated loams. Highly sensitive to both drought at tasseling and waterlogging.',
    risksAndConstraints: [
      'Extremely sensitive to waterlogging; 24-48 hours of stagnant water damages root respiration.',
      'Moisture deficit during silking/tasseling causes severe grain reduction.',
      'Fall armyworm susceptibility requires timely crop monitoring.'
    ],
    recommendedInterventions: [
      'Ensure clear surface drainage channels to prevent water accumulation.',
      'Provide protective irrigation during tasseling and grain filling if rainfall falters.',
      'Apply balanced NPK fertilization as maize is a heavy nutrient feeder.'
    ],
    source: 'CIMMYT Global Maize Guide; ICAR-IIMR Agronomy Manual',
    verified: true,
    verificationNote: 'Broadly verified for tropical and temperate maize cultivars.'
  },
  {
    id: 'pulses',
    name: 'Pulses (Pigeon Pea / Chickpea / Green Gram)',
    scientificName: 'Cajanus cajan / Cicer arietinum',
    category: 'Pulse / Legume',
    optimalSoilTypes: ['Loamy', 'Sandy', 'Silty'],
    phRange: { min: 6.0, max: 8.5, optimalMin: 6.5, optimalMax: 7.8 },
    rainfallRange: { min: 350, max: 850, optimalMin: 450, optimalMax: 700 },
    temperatureRange: { min: 14, max: 35, optimalMin: 18, optimalMax: 30 },
    waterRequirement: 'Low',
    drainageTolerance: ['Well drained'],
    irrigationSensitivity: 'Drought tolerant',
    growingSeasons: ['Kharif (Pigeon Pea)', 'Rabi (Chickpea)', 'Summer (Green Gram)'],
    description: 'Deep-rooted nitrogen-fixing legumes that enhance soil health and require minimal water once established. Key rotation crop for semi-arid zones.',
    risksAndConstraints: [
      'Highly intolerant to poorly drained or waterlogged soils (causes collar rot / wilt).',
      'Excessive vegetative growth and flower drop if nitrogen or rainfall is excessively high.',
      'Pod borer infestation during pod development stage.'
    ],
    recommendedInterventions: [
      'Plant on raised beds or broad-bed furrows (BBF) to prevent standing moisture.',
      'Inoculate seeds with Rhizobium culture to maximize atmospheric nitrogen fixation.',
      'Provide one supplementary irrigation at pod formation if soil moisture is depleted.'
    ],
    source: 'ICAR-IIPR Pulses Compendium; ICRISAT Legumes Guide',
    verified: true,
    verificationNote: 'Composite threshold based on dryland grain legumes common in semi-arid zones.'
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    scientificName: 'Arachis hypogaea',
    category: 'Oilseed / Legume',
    optimalSoilTypes: ['Sandy', 'Loamy'],
    phRange: { min: 5.5, max: 7.5, optimalMin: 6.0, optimalMax: 7.0 },
    rainfallRange: { min: 450, max: 950, optimalMin: 550, optimalMax: 750 },
    temperatureRange: { min: 20, max: 35, optimalMin: 24, optimalMax: 30 },
    waterRequirement: 'Medium',
    drainageTolerance: ['Well drained'],
    irrigationSensitivity: 'Moderate',
    growingSeasons: ['Kharif (Rainfed)', 'Rabi / Summer (Irrigated)'],
    description: 'Valuable oilseed that requires friable, light, well-aerated sandy loam soils for easy peg penetration and pod development.',
    risksAndConstraints: [
      'Heavy clay soils restrict peg entry and cause severe harvesting pod loss.',
      'Standing water or poor drainage induces collar rot and aflatoxin contamination.',
      'Calcium deficiency in acidic soils causes empty pods (blind pods / pops).'
    ],
    recommendedInterventions: [
      'Incorporate gypsum (calcium sulfate) at pegging stage to ensure sound pod filling.',
      'Maintain friable surface soil with shallow inter-cultivation before flowering.',
      'Ensure excellent field drainage; avoid heavy flood irrigation.'
    ],
    source: 'ICAR-DGR Groundnut Guidelines; FAO Crop Water Criteria',
    verified: true,
    verificationNote: 'Soil texture constraint (sandy/friable requirement) strictly verified.'
  },
  {
    id: 'millets',
    name: 'Pearl Millet (Bajra) / Sorghum (Jowar)',
    scientificName: 'Pennisetum glaucum / Sorghum bicolor',
    category: 'Millet / Coarse Cereal',
    optimalSoilTypes: ['Sandy', 'Loamy', 'Clayey'],
    phRange: { min: 5.5, max: 8.5, optimalMin: 6.5, optimalMax: 8.0 },
    rainfallRange: { min: 300, max: 750, optimalMin: 350, optimalMax: 600 },
    temperatureRange: { min: 22, max: 42, optimalMin: 27, optimalMax: 35 },
    waterRequirement: 'Low',
    drainageTolerance: ['Well drained', 'Moderate'],
    irrigationSensitivity: 'Drought tolerant',
    growingSeasons: ['Kharif (July-Oct)', 'Summer / Late Monsoon'],
    description: 'The champion dryland cereal. Exceptional heat and drought tolerance with low water consumption and ability to grow in shallow sandy or rocky soils.',
    risksAndConstraints: [
      'Continuous rains during flowering can wash out pollen and cause ergot disease.',
      'Waterlogging at seedling stage impedes root establishment.',
      'Grain mold if rain coincides with harvest maturity.'
    ],
    recommendedInterventions: [
      'Ideal crop for arid to semi-arid regions with rainfall under 500 mm.',
      'Adopt seed priming and conservation tillage to optimize early moisture.',
      'Can be effectively intercropped with drought-hardy pulses like cowpea or moth bean.'
    ],
    source: 'ICAR-IIMR Sorghum & Pearl Millet Reference; ICRISAT Guidelines',
    verified: true,
    verificationNote: 'Widely benchmarked for drought-prone rainfed agro-ecosystems.'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Commercial / Fibre',
    optimalSoilTypes: ['Clayey', 'Loamy'],
    phRange: { min: 6.0, max: 8.5, optimalMin: 6.5, optimalMax: 8.0 },
    rainfallRange: { min: 600, max: 1200, optimalMin: 700, optimalMax: 1000 },
    temperatureRange: { min: 20, max: 38, optimalMin: 24, optimalMax: 34 },
    waterRequirement: 'Medium',
    drainageTolerance: ['Well drained', 'Moderate'],
    irrigationSensitivity: 'Moderate',
    growingSeasons: ['Kharif (May-Dec)', 'Long duration (150-180 days)'],
    description: 'Deep-rooted commercial cash crop grown in deep black soils (vertisols) or alluvial loams. Requires a long frost-free season and warm dry harvest conditions.',
    risksAndConstraints: [
      'Heavy rainfall or cloudy weather during boll bursting degrades lint quality.',
      'Susceptible to pink bollworm and sucking pest complex.',
      'Sensitive to water stagnation during early vegetative phase.'
    ],
    recommendedInterventions: [
      'Ensure deep tillage and ridge planting on heavy soils.',
      'Adopt integrated pest management (IPM) and avoid excessive nitrogen application.',
      'Withhold irrigation during boll maturation to facilitate clean bursting.'
    ],
    source: 'ICAR-CICR Cotton Compendium; Central Institute for Cotton Research',
    verified: true,
    verificationNote: 'Well-established for black cotton soils and irrigated loams.'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereal / Cool Season',
    optimalSoilTypes: ['Loamy', 'Clayey', 'Silty'],
    phRange: { min: 6.0, max: 8.2, optimalMin: 6.5, optimalMax: 7.5 },
    rainfallRange: { min: 350, max: 800, optimalMin: 450, optimalMax: 650 },
    temperatureRange: { min: 10, max: 26, optimalMin: 14, optimalMax: 22 },
    waterRequirement: 'Medium',
    drainageTolerance: ['Well drained', 'Moderate'],
    irrigationSensitivity: 'Critical at CRI stage',
    growingSeasons: ['Rabi (Winter season: Nov-April)'],
    description: 'Premier temperate/sub-tropical winter cereal. Requires cool vegetative weather followed by warm dry grain ripening conditions.',
    risksAndConstraints: [
      'Terminal heat stress (temperatures > 30°C during grain filling) causes shriveled grains.',
      'High rainfall or humidity encourages rust and fungal foliar blights.',
      'Crown root initiation (CRI) stage requires mandatory irrigation if rainfed moisture fails.'
    ],
    recommendedInterventions: [
      'Sow in optimum window (early to mid-November) to avoid terminal heat in spring.',
      'Ensure 4-5 synchronized irrigations at critical growth stages if available.',
      'Apply zinc sulfate if growing in alkaline or calcareous soils.'
    ],
    source: 'ICAR-IIWBR Wheat Handbook; CIMMYT Wheat Guidelines',
    verified: true,
    verificationNote: 'Requires winter/cool season temperature profile (< 25°C average).'
  }
]

/**
 * Standard testing scenarios for quick hackathon evaluation and demonstration
 */
export const testScenarios = [
  {
    id: 'scenario-dry-arid',
    name: '1. Dry region with limited irrigation',
    badge: 'Semi-Arid Rainfed',
    description: 'Semi-arid land in an interior plateau with low rainfall, sandy loam soil, warm climate, and scarce irrigation facilities.',
    data: {
      location: 'Raichur Dryland Belt, Karnataka',
      area: '4.5',
      areaUnit: 'hectares',
      soilType: 'Sandy',
      soilPh: '7.2',
      temperature: '33',
      rainfall: '420',
      waterAvailability: 'Low',
      irrigation: 'Limited',
      drainage: 'Well drained',
      growingSeason: 'Kharif (June - October)',
      description: 'The farm is situated in a semi-arid zone with erratic rainfall averaging 420mm annually. Ground water table is deep (>80m). Soil is light red sandy loam with good drainage. Irrigation is restricted to 1-2 life-saving protective waterings.'
    }
  },
  {
    id: 'scenario-wet-clay',
    name: '2. High rainfall with poor drainage',
    badge: 'Humid Waterlogged',
    description: 'Coastal lowland or river basin subject to heavy monsoonal rains, heavy clay soil, and water stagnation.',
    data: {
      location: 'Kuttanad Lowlands, Kerala',
      area: '2.8',
      areaUnit: 'hectares',
      soilType: 'Clayey',
      soilPh: '6.2',
      temperature: '27',
      rainfall: '2100',
      waterAvailability: 'High',
      irrigation: 'Available',
      drainage: 'Poorly drained',
      growingSeason: 'Monsoon (June - November)',
      description: 'Lowland floodplain experiencing intense monsoon rainfall (>2000mm). The soil is heavy alluvial clay with high water retention. Land remains submerged under 5-15cm water for extended periods during rainy months.'
    }
  },
  {
    id: 'scenario-acidic-upland',
    name: '3. Acidic soil with limited water',
    badge: 'Acidic Plateau',
    description: 'Lateritic upland with strongly acidic soil, moderate rainfall, and limited water availability.',
    data: {
      location: 'Chotanagpur Upland, Jharkhand',
      area: '3.2',
      areaUnit: 'hectares',
      soilType: 'Loamy',
      soilPh: '4.8',
      temperature: '26',
      rainfall: '520',
      waterAvailability: 'Low',
      irrigation: 'Not available',
      drainage: 'Well drained',
      growingSeason: 'Kharif (July - October)',
      description: 'Laterite upland terrain with significant soil acidity (pH 4.8). Low water retention and no perennial irrigation access. Annual rainfall has declined to around 520mm. Needs acid-tolerant and drought-tolerant options.'
    }
  },
  {
    id: 'scenario-incomplete-data',
    name: '4. Scenario with missing pH and rainfall',
    badge: 'Uncertainty / Missing Data',
    description: 'Initial site assessment where soil laboratory pH and meteorological rainfall data have not yet been recorded.',
    data: {
      location: 'Unspecified Pilot Plot, Sector B',
      area: '5.0',
      areaUnit: 'hectares',
      soilType: 'Loamy',
      soilPh: '',
      temperature: '28',
      rainfall: '',
      waterAvailability: 'Medium',
      irrigation: 'Available',
      drainage: 'Moderate',
      growingSeason: 'Autumn - Winter',
      description: 'Preliminary field visit record. Farmer confirms loam soil texture and tubewell irrigation availability, but soil chemical tests for pH and local rain gauge measurements are not yet available.'
    }
  }
]

/**
 * Recognized Agricultural Regions & Agro-Climatic Zones
 * Used for smart location detection, auto-complete, and regional climate baseline assistance.
 */
export const agriculturalRegions = [
  {
    name: 'Raichur Dryland Belt, Karnataka',
    keywords: ['raichur', 'karnataka', 'bellary', 'gulbarga', 'koppal', 'deccan'],
    zone: 'Southern Semi-Arid Plateau (Zone VII)',
    climateProfile: 'Semi-Arid Dryland',
    soilType: 'Sandy',
    soilPh: '7.2',
    rainfall: '420',
    temperature: '33',
    waterAvailability: 'Low',
    irrigation: 'Limited',
    drainage: 'Well drained',
    growingSeason: 'Kharif (June - October)',
    keyCrops: ['Pearl Millet', 'Ragi', 'Pulses', 'Cotton']
  },
  {
    name: 'Kuttanad Wetland Delta, Kerala',
    keywords: ['kuttanad', 'kerala', 'alappuzha', 'kottayam', 'cochin', 'malabar'],
    zone: 'Humid Tropical Coastal Lowlands (Zone XII)',
    climateProfile: 'Humid Wetland Delta',
    soilType: 'Clayey',
    soilPh: '6.2',
    rainfall: '2100',
    temperature: '27',
    waterAvailability: 'High',
    irrigation: 'Available',
    drainage: 'Poorly drained',
    growingSeason: 'Monsoon (June - November)',
    keyCrops: ['Rice (Paddy)']
  },
  {
    name: 'Vidarbha Cotton & Soybean Belt, Maharashtra',
    keywords: ['vidarbha', 'nagpur', 'akola', 'amravati', 'maharashtra', 'wardha'],
    zone: 'Central Semi-Arid Vertisol Plateau (Zone VIII)',
    climateProfile: 'Semi-Arid Black Soil Belt',
    soilType: 'Clayey',
    soilPh: '7.5',
    rainfall: '850',
    temperature: '31',
    waterAvailability: 'Medium',
    irrigation: 'Limited',
    drainage: 'Moderate',
    growingSeason: 'Kharif (July - November)',
    keyCrops: ['Cotton', 'Pulses', 'Sorghum']
  },
  {
    name: 'Ludhiana Central Plains, Punjab',
    keywords: ['ludhiana', 'punjab', 'amritsar', 'jalandhar', 'haryana', 'gangetic'],
    zone: 'Trans-Gangetic Alluvial Plains (Zone VI)',
    climateProfile: 'Sub-Tropical Intensive Irrigated',
    soilType: 'Loamy',
    soilPh: '7.6',
    rainfall: '650',
    temperature: '24',
    waterAvailability: 'High',
    irrigation: 'Available',
    drainage: 'Well drained',
    growingSeason: 'Rabi / Kharif Double Crop',
    keyCrops: ['Wheat', 'Rice (Paddy)', 'Maize']
  },
  {
    name: 'Chotanagpur Laterite Upland, Jharkhand',
    keywords: ['chotanagpur', 'jharkhand', 'ranchi', 'hazaribagh', 'purulia', 'laterite'],
    zone: 'Eastern Plateau & Acidic Uplands (Zone VII)',
    climateProfile: 'Sub-Humid Acidic Plateau',
    soilType: 'Loamy',
    soilPh: '4.8',
    rainfall: '1150',
    temperature: '26',
    waterAvailability: 'Medium',
    irrigation: 'Limited',
    drainage: 'Well drained',
    growingSeason: 'Kharif (July - October)',
    keyCrops: ['Ragi', 'Pulses', 'Pearl Millet']
  },
  {
    name: 'Saurashtra Peanut Belt, Gujarat',
    keywords: ['saurashtra', 'rajkot', 'junagadh', 'gujarat', 'amreli', 'bhavnagar'],
    zone: 'Gujarat Coastal Plains & Hills (Zone XIII)',
    climateProfile: 'Semi-Arid Friable Coastal',
    soilType: 'Sandy',
    soilPh: '7.4',
    rainfall: '580',
    temperature: '30',
    waterAvailability: 'Medium',
    irrigation: 'Available',
    drainage: 'Well drained',
    growingSeason: 'Kharif (June - October)',
    keyCrops: ['Groundnut', 'Cotton', 'Pearl Millet']
  },
  {
    name: 'Thanjavur Cauvery Delta, Tamil Nadu',
    keywords: ['thanjavur', 'cauvery', 'tamil nadu', 'trichy', 'tiruvarur', 'delta'],
    zone: 'Southern Coastal Deltaic Basin (Zone XI)',
    climateProfile: 'Tropical Humid Deltaic',
    soilType: 'Clayey',
    soilPh: '6.8',
    rainfall: '1050',
    temperature: '29',
    waterAvailability: 'High',
    irrigation: 'Available',
    drainage: 'Moderate',
    growingSeason: 'Kuruvai / Samba (Aug - Jan)',
    keyCrops: ['Rice (Paddy)', 'Pulses']
  },
  {
    name: 'Marwar / Jodhpur Arid Belt, Rajasthan',
    keywords: ['marwar', 'jodhpur', 'rajasthan', 'bikaner', 'jaisalmer', 'barmer', 'thar'],
    zone: 'Western Arid Desert Zone (Zone XIV)',
    climateProfile: 'Arid / Low Precipitation',
    soilType: 'Sandy',
    soilPh: '8.2',
    rainfall: '320',
    temperature: '36',
    waterAvailability: 'Low',
    irrigation: 'Not available',
    drainage: 'Well drained',
    growingSeason: 'Kharif Rainfed',
    keyCrops: ['Pearl Millet', 'Pulses']
  },
  {
    name: 'Brahmaputra Valley, Assam',
    keywords: ['brahmaputra', 'assam', 'guwahati', 'jorhat', 'northeast'],
    zone: 'Eastern Himalayan & Humid Lowlands (Zone II)',
    climateProfile: 'Humid Tropical Heavy Rainfall',
    soilType: 'Silty',
    soilPh: '5.2',
    rainfall: '2200',
    temperature: '25',
    waterAvailability: 'High',
    irrigation: 'Available',
    drainage: 'Moderate',
    growingSeason: 'Ahu / Sali Monsoon',
    keyCrops: ['Rice (Paddy)', 'Maize']
  },
  {
    name: 'Bundelkhand Dryland Region, UP / MP',
    keywords: ['bundelkhand', 'jhansi', 'lalitpur', 'banda', 'madhya pradesh', 'uttar pradesh'],
    zone: 'Central Plateau Drought-Prone Zone',
    climateProfile: 'Semi-Arid Rocky Plateau',
    soilType: 'Loamy',
    soilPh: '7.1',
    rainfall: '680',
    temperature: '32',
    waterAvailability: 'Low',
    irrigation: 'Limited',
    drainage: 'Well drained',
    growingSeason: 'Kharif / Rabi',
    keyCrops: ['Pulses', 'Pearl Millet', 'Wheat']
  }
]

