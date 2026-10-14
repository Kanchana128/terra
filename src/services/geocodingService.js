/**
 * TerraSense AI - Universal Geocoding & Agro-Climatic Service
 * 
 * Provides global and local location search covering every village, small town,
 * taluk, district, and city worldwide, with dedicated support for Indian rural hamlets
 * and international agricultural zones.
 * 
 * APIs:
 * - Open-Meteo Geocoding API (Fast, free, CORS enabled, no API key required)
 * - OpenStreetMap Nominatim API (Comprehensive global coverage of hamlets and rural villages)
 * - Open-Meteo Archive API (Real coordinate-based annual rainfall & temperature retrieval)
 */

import { agriculturalRegions } from '../data/cropKnowledgeBase.js'

/**
 * Searches places by name across global databases + local agricultural regions.
 * Works for any village, town, district, or city.
 */
export async function searchPlaces(query) {
  if (!query || query.trim().length < 2) return []

  const clean = query.trim()
  const results = []

  // 1. Search local agricultural presets first for instant matching
  const localMatches = agriculturalRegions.filter((reg) => {
    return (
      reg.name.toLowerCase().includes(clean.toLowerCase()) ||
      reg.keywords.some((kw) => kw.toLowerCase().includes(clean.toLowerCase()) || clean.toLowerCase().includes(kw.toLowerCase()))
    )
  })

  localMatches.forEach((reg) => {
    results.push({
      id: `local-${reg.name}`,
      name: reg.name,
      displayName: `${reg.name} · ${reg.zone}`,
      district: reg.name.split(',')[0],
      state: reg.name.split(',')[1]?.trim() || '',
      country: 'India',
      isPreset: true,
      zone: reg.zone,
      climateProfile: reg.climateProfile,
      rainfall: reg.rainfall,
      temperature: reg.temperature,
      soilType: reg.soilType,
      soilPh: reg.soilPh
    })
  })

  // 2. Query Open-Meteo Geocoding API (Worldwide coverage)
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=8&language=en&format=json`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (data.results && Array.isArray(data.results)) {
        data.results.forEach((item) => {
          const parts = [item.name]
          if (item.admin2 && item.admin2 !== item.name) parts.push(item.admin2)
          if (item.admin1) parts.push(item.admin1)
          if (item.country) parts.push(item.country)
          const displayName = parts.join(', ')

          // Avoid duplicates
          if (!results.some((r) => r.displayName === displayName)) {
            results.push({
              id: `om-${item.id}`,
              name: item.name,
              displayName,
              district: item.admin2 || item.admin3 || '',
              state: item.admin1 || '',
              country: item.country || '',
              latitude: item.latitude,
              longitude: item.longitude,
              elevation: item.elevation,
              isPreset: false
            })
          }
        })
      }
    }
  } catch (e) {
    // Non-blocking fallback
  }

  // 3. If few results, query OpenStreetMap Nominatim for deep rural hamlets / villages
  if (results.length < 3) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clean)}&format=json&limit=5&addressdetails=1`
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'TerraSenseAI-Agriculture-Platform/1.0' }
      })
      clearTimeout(timer)

      if (res.ok) {
        const nomData = await res.json()
        if (Array.isArray(nomData)) {
          nomData.forEach((item) => {
            const addr = item.address || {}
            const villageName = addr.village || addr.hamlet || addr.town || addr.city || item.display_name.split(',')[0]
            const district = addr.state_district || addr.county || ''
            const state = addr.state || ''
            const country = addr.country || ''
            const displayName = [villageName, district, state, country].filter(Boolean).join(', ')

            if (!results.some((r) => r.displayName === displayName)) {
              results.push({
                id: `nom-${item.place_id}`,
                name: villageName,
                displayName: displayName || item.display_name,
                district,
                state,
                country,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
                isPreset: false
              })
            }
          })
        }
      }
    } catch (e) {
      // Non-blocking fallback
    }
  }

  return results
}

/**
 * Reverse-geocodes GPS coordinates into a village, town, district, and state.
 */
export async function reverseGeocodeCoordinates(latitude, longitude) {
  const lat = Number(latitude).toFixed(4)
  const lon = Number(longitude).toFixed(4)

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TerraSenseAI-Agriculture-Platform/1.0' }
    })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      const addr = data.address || {}
      const place = addr.village || addr.hamlet || addr.town || addr.suburb || addr.city || ''
      const district = addr.state_district || addr.county || ''
      const state = addr.state || ''
      const country = addr.country || ''
      const parts = [place, district, state, country].filter(Boolean)

      if (parts.length > 0) {
        return {
          displayName: parts.join(', '),
          village: place,
          district,
          state,
          country,
          latitude: Number(lat),
          longitude: Number(lon)
        }
      }
    }
  } catch (e) {
    // fallback
  }

  return {
    displayName: `Field Plot (${lat}°N, ${lon}°E)`,
    district: '',
    state: '',
    country: '',
    latitude: Number(lat),
    longitude: Number(lon)
  }
}

/**
 * Fetches real coordinate-based meteorological averages (annual rainfall and avg temperature)
 * for ANY location on Earth from the Open-Meteo Global Meteorological Archive.
 */
export async function fetchClimateAverages(latitude, longitude) {
  if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
    return null
  }

  try {
    const lat = Number(latitude).toFixed(2)
    const lon = Number(longitude).toFixed(2)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)

    // Query 2023 full year daily data for baseline metrics
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=2023-01-01&end_date=2023-12-31&daily=precipitation_sum,temperature_2m_mean&timezone=auto`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (data.daily && Array.isArray(data.daily.precipitation_sum) && Array.isArray(data.daily.temperature_2m_mean)) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthlyAcc = monthNames.map((name) => ({ month: name, rainfall: 0, tempSum: 0, tempCount: 0 }))

        if (Array.isArray(data.daily.time)) {
          data.daily.time.forEach((dateStr, idx) => {
            const d = new Date(dateStr)
            const m = d.getMonth()
            if (m >= 0 && m < 12) {
              const r = data.daily.precipitation_sum[idx] || 0
              const t = data.daily.temperature_2m_mean[idx]
              monthlyAcc[m].rainfall += r
              if (t !== null && t !== undefined && !isNaN(t)) {
                monthlyAcc[m].tempSum += t
                monthlyAcc[m].tempCount += 1
              }
            }
          })
        }

        const monthlyData = monthlyAcc.map((item) => ({
          month: item.month,
          rainfall: Math.round(item.rainfall),
          temperature: item.tempCount > 0 ? Number((item.tempSum / item.tempCount).toFixed(1)) : null
        }))

        const totalRain = monthlyData.reduce((acc, val) => acc + (val.rainfall || 0), 0)
        const validTemps = monthlyData.map((d) => d.temperature).filter((t) => t !== null && !isNaN(t))
        const avgTemp = validTemps.length > 0
          ? Number((validTemps.reduce((acc, val) => acc + val, 0) / validTemps.length).toFixed(1))
          : null

        return {
          annualRainfall: Math.round(totalRain),
          averageTemperature: avgTemp,
          monthlyData,
          year: 2023,
          source: 'Open-Meteo Global Archive (ERA5 Reanalysis)'
        }
      }
    }
  } catch (e) {
    // Return null if offline or timed out
  }

  return null
}
