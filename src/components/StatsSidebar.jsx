import { useState, useEffect } from 'react'
import { getYearData } from '../utils/storage'
import { formatCurrency } from '../utils/bonusCalc'
import { HEBREW_MONTHS } from '../utils/dateHelpers'
import './StatsSidebar.css'

function MonthlyChart({ yearData, selectedYear }) {
  const today = new Date()
  const isCurrentYear = selectedYear === today.getFullYear()
  const currentMonthIdx = today.getMonth()
  const maxBonus = Math.max(...yearData.map(m => m.bonus), 1)

  const W = 264
  const H = 120
  const barW = W / 12
  const gap = 4
  // viewBox includes extra room above (for value labels) and below (for month names)
  const VB = `-4 -18 ${W + 8} ${H + 38}`

  return (
    <svg
      viewBox={VB}
      width="100%"
      style={{ display: 'block', width: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* baseline */}
      <line x1={0} y1={H} x2={W} y2={H} stroke="#fce4ec" strokeWidth="1.5" />

      {yearData.map((m, i) => {
        const pct = m.bonus / maxBonus
        const barH = Math.max(pct * H, m.bonus > 0 ? 5 : 2)
        const x = i * barW + gap / 2
        const y = H - barH
        const isCurrent = isCurrentYear && i === currentMonthIdx
        const hasData = m.bonus > 0

        const fill = isCurrent
          ? 'url(#barGradientActive)'
          : hasData
          ? 'url(#barGradient)'
          : '#fce4ec'

        return (
          <g key={i}>
            <rect x={x} y={y} width={barW - gap} height={barH} fill={fill} rx="3" />

            {hasData && (
              <text
                x={x + (barW - gap) / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="7.5"
                fill={isCurrent ? '#ad1457' : '#e91e63'}
                fontWeight="700"
                fontFamily="Heebo, sans-serif"
              >
                {m.bonus >= 1000 ? `${(m.bonus / 1000).toFixed(1)}k` : m.bonus}
              </text>
            )}

            <text
              x={x + (barW - gap) / 2}
              y={H + 14}
              textAnchor="middle"
              fontSize="8"
              fill={isCurrent ? '#e91e63' : '#c2185b'}
              fontWeight={isCurrent ? '700' : '400'}
              fontFamily="Heebo, sans-serif"
            >
              {HEBREW_MONTHS[i].slice(0, 3)}
            </text>
          </g>
        )
      })}

      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f48fb1" />
          <stop offset="100%" stopColor="#fce4ec" />
        </linearGradient>
        <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e91e63" />
          <stop offset="100%" stopColor="#f06292" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const EMPTY_YEAR = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, bonus: 0, days: 0 }))

export default function StatsSidebar({ userId, onClose }) {
  const today = new Date()
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [yearData, setYearData]         = useState(EMPTY_YEAR)
  const [loading, setLoading]           = useState(true)

  const minYear = today.getFullYear() - 3
  const maxYear = today.getFullYear()

  useEffect(() => {
    setLoading(true)
    getYearData(userId, selectedYear)
      .then(data => { setYearData(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userId, selectedYear])

  const totalBonus   = yearData.reduce((s, m) => s + m.bonus, 0)
  const activeMonths = yearData.filter(m => m.bonus > 0).length
  const bestMonth    = yearData.reduce((best, m) => (m.bonus > best.bonus ? m : best), yearData[0])
  const avgBonus     = activeMonths > 0 ? Math.round(totalBonus / activeMonths) : 0

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sidebar-head">
          <div className="sidebar-head-title">
            <span className="sidebar-icon">📊</span>
            <span>סיכום בונוסים</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        {/* Year navigator */}
        <div className="year-nav">
          <button
            className="year-arrow"
            onClick={() => setSelectedYear(y => Math.max(y - 1, minYear))}
            disabled={selectedYear <= minYear}
          >‹</button>
          <span className="year-label">{selectedYear}</span>
          <button
            className="year-arrow"
            onClick={() => setSelectedYear(y => Math.min(y + 1, maxYear))}
            disabled={selectedYear >= maxYear}
          >›</button>
        </div>

        {loading && <div className="sidebar-loading"><div className="sidebar-spinner" /></div>}

        {/* Stat cards */}
        <div className="stat-cards">
          <div className="stat-card wide">
            <span className="stat-card-label">סה"כ שנתי</span>
            <span className="stat-card-value big">{formatCurrency(totalBonus)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">חודש מוביל</span>
            <span className="stat-card-value">
              {bestMonth.bonus > 0 ? HEBREW_MONTHS[bestMonth.month - 1] : '—'}
            </span>
            {bestMonth.bonus > 0 && (
              <span className="stat-card-sub">{formatCurrency(bestMonth.bonus)}</span>
            )}
          </div>
          <div className="stat-card">
            <span className="stat-card-label">ממוצע חודשי</span>
            <span className="stat-card-value">
              {activeMonths > 0 ? formatCurrency(avgBonus) : '—'}
            </span>
            {activeMonths > 0 && (
              <span className="stat-card-sub">{activeMonths} חודשים פעילים</span>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="chart-section">
          <p className="chart-title">בונוסים לפי חודש</p>
          <div className="chart-wrap">
            <MonthlyChart yearData={yearData} selectedYear={selectedYear} />
          </div>
        </div>

        {/* Monthly breakdown list */}
        {activeMonths > 0 && (
          <div className="monthly-list">
            <p className="monthly-list-title">פירוט חודשי</p>
            {yearData
              .filter(m => m.bonus > 0)
              .sort((a, b) => b.bonus - a.bonus)
              .map(m => (
                <div key={m.month} className="monthly-list-row">
                  <span className="ml-month">{HEBREW_MONTHS[m.month - 1]}</span>
                  <div className="ml-bar-wrap">
                    <div
                      className="ml-bar"
                      style={{ width: `${(m.bonus / bestMonth.bonus) * 100}%` }}
                    />
                  </div>
                  <span className="ml-amount">{formatCurrency(m.bonus)}</span>
                </div>
              ))}
          </div>
        )}

        {activeMonths === 0 && (
          <div className="sidebar-empty">
            <span>אין נתונים לשנה זו</span>
            <p>התחילי להזין מכירות כדי לראות את הסטטיסטיקות שלך</p>
          </div>
        )}

      </div>
    </div>
  )
}
