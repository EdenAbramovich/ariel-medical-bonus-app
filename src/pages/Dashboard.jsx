import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { getAvailableMonths, groupMonthsByYear, HEBREW_MONTHS } from '../utils/dateHelpers'
import { getMonthData } from '../utils/storage'
import { calcMonthBonus, formatCurrency } from '../utils/bonusCalc'
import './Dashboard.css'

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const months = getAvailableMonths()
  const grouped = groupMonthsByYear(months)

  const today = new Date()
  const cy = today.getFullYear()
  const cm = today.getMonth() + 1

  return (
    <AppLayout user={user} onLogout={onLogout}>

      <div className="dash-content">
        <div className="dash-welcome">
          <h2>שלום, {user.name.split(' ')[0]}!</h2>
          <p>בחרי חודש כדי לצפות ולעדכן את הבונוסים שלך</p>
        </div>

        {grouped.map(({ year, months: yearMonths }) => (
          <div key={year} className="year-section">
            <h3 className="year-label">{year}</h3>
            <div className="months-grid">
              {yearMonths.map(({ month, isCurrent, isFuture }) => {
                const monthData = getMonthData(user.sub, year, month)
                const total = calcMonthBonus(monthData)
                const hasData = Object.keys(monthData).length > 0
                const daysReported = Object.keys(monthData).length

                return (
                  <button
                    key={month}
                    className={`month-card ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''} ${hasData ? 'has-data' : ''}`}
                    onClick={() => navigate(`/month/${year}/${month}`)}
                  >
                    <div className="month-card-top">
                      <span className="month-name">{HEBREW_MONTHS[month - 1]}</span>
                      {isCurrent && <span className="badge-current">עכשיו</span>}
                      {isFuture && <span className="badge-future">הבא</span>}
                    </div>

                    {hasData ? (
                      <div className="month-card-data">
                        <span className="month-total">{formatCurrency(total)}</span>
                        <span className="month-days">{daysReported} ימים</span>
                      </div>
                    ) : (
                      <span className="month-empty">לא הוזן</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
