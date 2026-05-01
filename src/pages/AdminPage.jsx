import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { getAvailableMonths, HEBREW_MONTHS } from '../utils/dateHelpers'
import { getAllUsersWithMonthData } from '../utils/storage'
import { formatCurrency } from '../utils/bonusCalc'
import './AdminPage.css'

const ADMIN_EMAIL = 'eabramovich1326@gmail.com'

const MEDALS = ['👑', '🥈', '🥉']

function Avatar({ name, photoURL, size = 'md' }) {
  if (photoURL) {
    return <img src={photoURL} alt={name} className={`admin-avatar avatar-${size}`} referrerPolicy="no-referrer" />
  }
  return (
    <div className={`admin-avatar-letter avatar-${size}`}>
      {name ? name[0].toUpperCase() : '?'}
    </div>
  )
}

export default function AdminPage({ user, onLogout }) {
  if (user.email !== ADMIN_EMAIL) return <Navigate to="/" replace />

  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAllUsersWithMonthData(year, month)
      .then(data => { setUsers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [year, month])

  const availableMonths = getAvailableMonths().filter(m => !m.isFuture)
  const activeUsers  = users.filter(u => u.hasData)
  const totalBonus   = users.reduce((sum, u) => sum + u.bonus, 0)
  const avgBonus     = activeUsers.length > 0 ? Math.round(totalBonus / activeUsers.length) : 0
  const top3         = users.slice(0, 3).filter(u => u.hasData)
  const rest         = users.slice(top3.length)

  const podiumOrder = top3.length >= 2
    ? [top3[1], top3[0], top3[2]].filter(Boolean)
    : top3

  return (
    <AppLayout user={user} onLogout={onLogout}>
      <div className="admin-content">

        {/* Hero */}
        <div className="admin-hero">
          <div className="admin-hero-left">
            <span className="admin-hero-icon">👑</span>
            <div>
              <h2 className="admin-hero-title">פאנל מנהל</h2>
              <p className="admin-hero-sub">סקירת ביצועי היועצות</p>
            </div>
          </div>
          <select
            className="admin-month-select"
            value={`${year}-${month}`}
            onChange={e => {
              const [y, m] = e.target.value.split('-').map(Number)
              setYear(y); setMonth(m)
            }}
          >
            {availableMonths.map(({ year: y, month: m, isCurrent }) => (
              <option key={`${y}-${m}`} value={`${y}-${m}`}>
                {HEBREW_MONTHS[m - 1]} {y}{isCurrent ? ' (נוכחי)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <span className="stat-value">{formatCurrency(totalBonus)}</span>
            <span className="stat-label">סה"כ בונוסים</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👩‍💼</span>
            <span className="stat-value">{activeUsers.length}<span className="stat-of">/{users.length}</span></span>
            <span className="stat-label">יועצות פעילות</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{formatCurrency(avgBonus)}</span>
            <span className="stat-label">ממוצע לפעילה</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <span className="stat-value">{top3[0] ? formatCurrency(top3[0].bonus) : '—'}</span>
            <span className="stat-label">הבונוס הגבוה ביותר</span>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <span>טוענת נתונים...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <span>📭</span>
            <p>אין יועצות רשומות במערכת עדיין</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length > 0 && (
              <div className="podium-section">
                <h3 className="section-title">🏆 טבלת מובילות — {HEBREW_MONTHS[month - 1]} {year}</h3>
                <div className="podium">
                  {podiumOrder.map((u, idx) => {
                    const actualRank = top3.indexOf(u)
                    const heights    = ['68px', '96px', '52px']
                    const labels     = ['מקום שני', 'מקום ראשון', 'מקום שלישי']
                    return (
                      <div key={u.userId} className={`podium-place rank-${actualRank + 1}`}>
                        <div className="podium-medal">{MEDALS[actualRank]}</div>
                        <Avatar name={u.name} photoURL={u.photoURL} size="lg" />
                        <div className="podium-name">{u.name.split(' ')[0]}</div>
                        <div className="podium-bonus">{formatCurrency(u.bonus)}</div>
                        <div className="podium-days">{u.daysCount} ימים</div>
                        <div className="podium-block" style={{ height: heights[idx] }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Full leaderboard table */}
            <div className="admin-table-section">
              <h3 className="section-title">📋 כל היועצות</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>דירוג</th>
                      <th>יועצת</th>
                      <th>אימייל</th>
                      <th>בונוס חודשי</th>
                      <th>ימים</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.userId} className={`table-row ${!u.hasData ? 'row-inactive' : ''} ${i < 3 && u.hasData ? `row-top-${i + 1}` : ''}`}>
                        <td className="td-rank">
                          {u.hasData ? (MEDALS[i] || i + 1) : '—'}
                        </td>
                        <td className="td-name">
                          <Avatar name={u.name} photoURL={u.photoURL} size="sm" />
                          <span className="td-name-text">{u.name}</span>
                        </td>
                        <td className="td-email">{u.email}</td>
                        <td className={`td-bonus ${u.hasData ? 'bonus-active' : ''}`}>
                          {u.hasData ? formatCurrency(u.bonus) : 'לא דיווחה'}
                        </td>
                        <td className="td-days">{u.daysCount || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
