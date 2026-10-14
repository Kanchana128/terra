import { useEffect, useState } from 'react'
import { Leaf, Moon, Sun } from 'lucide-react'
import Sidebar, { MobileMenuButton } from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Analysis from './components/Analysis.jsx'
import Recommendations from './components/Recommendations.jsx'
import Knowledge from './components/Knowledge.jsx'
import History from './components/History.jsx'
import { initialForm } from './data/initialForm.js'
import { cropKnowledgeBase } from './data/cropKnowledgeBase.js'
import { analyzeLandConditions } from './services/recommendationEngine.js'

const pageInfo = {
  dashboard: { title: 'Your workspace', crumb: 'OVERVIEW' },
  analysis: { title: 'Land analysis', crumb: 'YOUR LAND' },
  recommendations: { title: 'Crop recommendations', crumb: 'INSIGHTS' },
  knowledge: { title: 'Knowledge base', crumb: 'YOUR LIBRARY' },
  history: { title: 'Analysis history', crumb: 'YOUR ACTIVITY' },
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [knowledge, setKnowledge] = useState(() => {
    try {
      const saved = localStorage.getItem('terrasense_knowledge')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      // ignore
    }
    return cropKnowledgeBase
  })
  const [results, setResults] = useState(() => {
    try {
      const saved = localStorage.getItem('terrasense_latest_result')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      // ignore
    }
    return null
  })
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('terrasense_history')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      // ignore
    }
    return []
  })
  const [notice, setNotice] = useState('')
  const page = pageInfo[active]

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  useEffect(() => {
    return () => {
      if (image?.url) URL.revokeObjectURL(image.url)
    }
  }, [image])

  useEffect(() => {
    try {
      localStorage.setItem('terrasense_knowledge', JSON.stringify(knowledge))
    } catch (e) {
      // ignore
    }
  }, [knowledge])

  useEffect(() => {
    try {
      if (results) localStorage.setItem('terrasense_latest_result', JSON.stringify(results))
    } catch (e) {
      // ignore
    }
  }, [results])

  useEffect(() => {
    try {
      localStorage.setItem('terrasense_history', JSON.stringify(history))
    } catch (e) {
      // ignore
    }
  }, [history])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 5000)
    return () => window.clearTimeout(timer)
  }, [notice])

  function startAnalysis() {
    setActive('analysis')
  }

  function analyzeLand(preparedForm) {
    const dataToAnalyze = preparedForm || form
    if (preparedForm) setForm(preparedForm)
    const outcome = analyzeLandConditions(dataToAnalyze, knowledge)
    if (!outcome.success) {
      setNotice(outcome.errors?.[0] || 'Please review and correct form entries.')
      return
    }

    setResults(outcome)

    // Save to history log
    const newRecord = {
      id: crypto.randomUUID(),
      formattedDate: outcome.formattedDate,
      timestamp: outcome.timestamp,
      summary: outcome.summary,
      completeness: outcome.completeness,
      results: outcome
    }
    setHistory((prev) => [newRecord, ...prev])

    setActive('recommendations')
    setNotice(`Scenario analyzed: ${outcome.status}`)
  }

  function handleSelectHistory(record) {
    if (record.results) {
      setResults(record.results)
      setActive('recommendations')
      setNotice(`Loaded analysis record from ${record.formattedDate}`)
    }
  }

  function handleClearHistory() {
    setHistory([])
    try {
      localStorage.removeItem('terrasense_history')
    } catch (e) {
      // ignore
    }
    setNotice('Analysis history log cleared.')
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        onNavigate={setActive}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <MobileMenuButton onClick={() => setMobileNavOpen(true)} />
            <div className="breadcrumb">
              <span>{page.crumb}</span>
              <b>/</b>
              <strong>{page.title}</strong>
            </div>
          </div>
          <div className="topbar-right">
            <div className="system-status">
              <span className="status-dot status-dot-active" />
              <span>Engine active (Rule-based v1.0)</span>
            </div>
            <button
              className="theme-toggle"
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              onClick={() => setDarkMode((value) => !value)}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="topbar-brand">
              <div className="topbar-brand-icon"><Leaf size={16} /></div>
              <span>TerraSense <b>AI</b></span>
            </div>
          </div>
        </header>

        <main className="page-content" key={active}>
          {active === 'dashboard' && (
            <Dashboard
              form={form}
              knowledgeCount={knowledge.length}
              latestResult={results}
              onStart={startAnalysis}
              onNavigate={setActive}
            />
          )}
          {active === 'analysis' && (
            <Analysis
              form={form}
              setForm={setForm}
              image={image}
              setImage={setImage}
              onAnalyze={analyzeLand}
            />
          )}
          {active === 'recommendations' && (
            <Recommendations
              results={results}
              form={form}
              onStart={startAnalysis}
            />
          )}
          {active === 'knowledge' && (
            <Knowledge
              entries={knowledge}
              setEntries={setKnowledge}
            />
          )}
          {active === 'history' && (
            <History
              history={history}
              onSelectHistory={handleSelectHistory}
              onClearHistory={handleClearHistory}
              onStart={startAnalysis}
            />
          )}
        </main>

        <footer className="app-footer">
          <span>© 2026 TerraSense AI · TERRAFORM Hackathon Edition</span>
          <span><i /> Explainable Agricultural Decision Support</span>
        </footer>
      </div>

      {notice && (
        <div className="toast" role="status">
          <span className="toast-icon"><Leaf size={16} /></span>
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button>
        </div>
      )}
    </div>
  )
}
