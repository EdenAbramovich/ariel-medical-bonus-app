import { useState } from 'react'
import Header from './Header'
import StatsSidebar from './StatsSidebar'
import './AppLayout.css'

export default function AppLayout({ user, onLogout, backLabel, backTo, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Header
        user={user}
        onLogout={onLogout}
        backLabel={backLabel}
        backTo={backTo}
        onOpenStats={() => setSidebarOpen(true)}
      />

      <div className="app-body">{children}</div>

      {/* Floating stats button */}
      <button
        className={`stats-fab ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(v => !v)}
        title="סטטיסטיקות"
      >
        <span className="stats-fab-icon">📊</span>
        <span className="stats-fab-label">סטטיסטיקות</span>
      </button>

      {sidebarOpen && (
        <StatsSidebar userId={user.sub} onClose={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
