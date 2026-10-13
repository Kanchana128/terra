import { useEffect, useState } from 'react'
import { Leaf, Moon, Sun } from 'lucide-react'
import Sidebar, { MobileMenuButton } from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Analysis, { initialForm } from './components/Analysis.jsx'
import Recommendations from './components/Recommendations.jsx'
import Knowledge from './components/Knowledge.jsx'
import History from './components/History.jsx'

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
  const [knowledge, setKnowledge] = useState([])
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
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 5000)
    return () => window.clearTimeout(timer)
  }, [notice])

  function startAnalysis() {
    setActive('analysis')
  }

  function analyzeLand() {
    setNotice('Analysis engine not connected yet. Your land details are saved in this workspace.')
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <MobileMenuButton onClick={() => setMobileNavOpen(true)} />
            <div className="breadcrumb"><span>{page.crumb}</span><b>/</b><strong>{page.title}</strong></div>
          </div>
          <div className="topbar-right">
            <div className="system-status"><span className="status-dot" /><span>Engine offline</span></div>
            <button className="theme-toggle" aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`} title={`Switch to ${darkMode ? 'light' : 'dark'} mode`} onClick={() => setDarkMode((value) => !value)}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="topbar-brand"><div className="topbar-brand-icon"><Leaf size={16} /></div><span>TerraSense <b>AI</b></span></div>
          </div>
        </header>
        <main className="page-content" key={active}>
          {active === 'dashboard' && <Dashboard onStart={startAnalysis} />}
          {active === 'analysis' && <Analysis form={form} setForm={setForm} image={image} setImage={setImage} onAnalyze={analyzeLand} />}
          {active === 'recommendations' && <Recommendations results={null} form={form} onStart={startAnalysis} />}
          {active === 'knowledge' && <Knowledge entries={knowledge} setEntries={setKnowledge} />}
          {active === 'history' && <History onStart={startAnalysis} />}
        </main>
        <footer className="app-footer"><span>© 2026 TerraSense AI</span><span><i /> Designed to grow with your land</span></footer>
      </div>
      {notice && <div className="toast" role="status"><span className="toast-icon"><Leaf size={16} /></span><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}
    </div>
  )
}
