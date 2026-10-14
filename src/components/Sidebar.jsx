import { BookOpen, Clock3, Compass, Leaf, Menu, Sprout, X } from 'lucide-react'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: Compass },
  { id: 'analysis', label: 'Land analysis', icon: Leaf },
  { id: 'recommendations', label: 'Crop recommendations', icon: Sprout },
  { id: 'knowledge', label: 'Knowledge base', icon: BookOpen },
  { id: 'history', label: 'Analysis history', icon: Clock3 },
]

export default function Sidebar({ active, onNavigate, open, onClose }) {
  return (
    <>
      {open && <button className="mobile-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Sprout size={21} strokeWidth={2} /></div>
          <div className="brand-name">TerraSense<span>AI</span></div>
          <button className="mobile-close" aria-label="Close navigation" onClick={onClose}><X size={19} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${active === id ? 'active' : ''}`}
              onClick={() => { onNavigate(id); onClose() }}
              aria-current={active === id ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {id === 'analysis' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="note-icon"><Leaf size={16} /></div>
            <strong>Grow with clarity</strong>
            <p>Thoughtful decisions start with understanding your land.</p>
          </div>
          <div className="sidebar-footer"><span className="footer-status-dot status-dot-active" /> Engine active (v1.0)</div>
        </div>
      </aside>
    </>
  )
}

export function MobileMenuButton({ onClick }) {
  return <button className="mobile-menu-button" aria-label="Open navigation" onClick={onClick}><Menu size={20} /></button>
}
