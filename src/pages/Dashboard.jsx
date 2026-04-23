import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { getAvailableMonths, groupMonthsByYear, HEBREW_MONTHS } from '../utils/dateHelpers'
import { getAllMonthSummaries } from '../utils/storage'
import { formatCurrency } from '../utils/bonusCalc'
import './Dashboard.css'

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [summaries, setSummaries] = useState({})
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    getAllMonthSummaries(user.sub)
      .then(data => { setSummaries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user.sub])

  const months  = getAvailableMonths()
  const grouped = groupMonthsByYear(months)

  function getSummary(year, month) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    return summaries[key] || null
  }

  return (
    <AppLayout user={user} onLogout={onLogout}>
      <div className="dash-content">
        <div className="dash-welcome">
          <h2>שלום, {user.name.split(' ')[0]}!</h2>
          <p>בחרי חודש כדי לצפות ולעדכן את הבונוסים שלך</p>
        </div>

        {loading ? (
          <div className="dash-loading">
            <div className="dash-spinner" />
            <span>טוענת נתונים...</span>
          </div>
        ) : (
          grouped.map(({ year, months: yearMonths }) => (
            <div key={year} className="year-section">
              <h3 className="year-label">{year}</h3>
              <div className="months-grid">
                {yearMonths.map(({ month, isCurrent, isFuture }) => {
                  const s = getSummary(year, month)
                  const hasData = !!s

                  return (
                    <button
                      key={month}
                      className={`month-card ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''} ${hasData ? 'has-data' : ''}`}
                      onClick={() => navigate(`/month/${year}/${month}`)}
                    >
                      <div className="month-card-top">
                        <span className="month-name">{HEBREW_MONTHS[month - 1]}</span>
                        {isCurrent && <span className="badge-current">עכשיו</span>}
                        {isFuture  && <span className="badge-future">הבא</span>}
                      </div>

                      {hasData ? (
                        <div className="month-card-data">
                          <span className="month-total">{formatCurrency(s.total)}</span>
                          <span className="month-days">{s.daysCount} ימים</span>
                        </div>
                      ) : (
                        <span className="month-empty">לא הוזן</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  )
}
