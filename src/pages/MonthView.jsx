import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import DayModal from '../components/DayModal'
import { buildCalendarGrid, HEBREW_MONTHS, HEBREW_DAYS_SHORT } from '../utils/dateHelpers'
import { getMonthData, getDayData, saveDayData } from '../utils/storage'
import { calcDayBonus, calcMonthBonus, formatCurrency } from '../utils/bonusCalc'
import './MonthView.css'

export default function MonthView({ user, onLogout }) {
  const { year: yearStr, month: monthStr } = useParams()
  const year  = parseInt(yearStr)
  const month = parseInt(monthStr)

  const today          = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month
  const todayDay       = today.getDate()

  const [monthData, setMonthData] = useState({})
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [modalDay, setModalDay]   = useState(null)
  const [modalInit, setModalInit] = useState({})

  const loadMonth = useCallback(() => {
    setLoading(true)
    getMonthData(user.sub, year, month)
      .then(data => { setMonthData(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user.sub, year, month])

  useEffect(() => { loadMonth() }, [loadMonth])

  const openModal = async (day) => {
    const products = await getDayData(user.sub, year, month, day)
    setModalInit(products)
    setModalDay(day)
  }

  const closeModal = () => setModalDay(null)

  const handleSave = async (quantities) => {
    setSaving(true)
    await saveDayData(user.sub, year, month, modalDay, quantities)
    setModalDay(null)
    setSaving(false)
    loadMonth()
  }

  const monthTotal = calcMonthBonus(monthData)
  const grid       = buildCalendarGrid(year, month)
  const monthName  = HEBREW_MONTHS[month - 1]

  return (
    <AppLayout user={user} onLogout={onLogout} backLabel="כל החודשים" backTo="/dashboard">
      <div className="month-view-content">

        {/* Month hero */}
        <div className="month-hero">
          <div className="month-hero-title">
            <h2>{monthName} {year}</h2>
            {isCurrentMonth && <span className="current-badge">חודש נוכחי</span>}
          </div>
          <div className="month-hero-total">
            <span className="hero-total-label">סה"כ בונוס חודשי</span>
            <span className="hero-total-value">{formatCurrency(monthTotal)}</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar-wrap">
          {loading ? (
            <div className="cal-loading">
              <div className="cal-spinner" />
              <span>טוענת...</span>
            </div>
          ) : (
            <div className="calendar-grid">
              {HEBREW_DAYS_SHORT.map(d => (
                <div key={d} className="cal-header-cell">{d}</div>
              ))}

              {grid.map((day, idx) => {
                if (day === null) return <div key={`e-${idx}`} className="cal-cell empty" />

                const dayBonus = calcDayBonus(monthData[day]?.products)
                const hasData  = !!monthData[day]
                const isToday  = isCurrentMonth && day === todayDay

                return (
                  <div
                    key={day}
                    className={`cal-cell day-cell ${hasData ? 'has-data' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => openModal(day)}
                  >
                    <span className="day-num">{day}</span>
                    {hasData && <span className="day-bonus">{formatCurrency(dayBonus)}</span>}
                    <button className="day-edit-btn">{hasData ? 'עריכה' : '+ הוסף'}</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Monthly summary */}
        {!loading && monthTotal > 0 && (
          <div className="month-summary">
            <div className="summary-item">
              <span className="summary-label">ימים שדווחו</span>
              <span className="summary-val">{Object.keys(monthData).length}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-item">
              <span className="summary-label">סה"כ בונוס</span>
              <span className="summary-val highlight">{formatCurrency(monthTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {modalDay !== null && (
        <DayModal
          year={year}
          month={month}
          day={modalDay}
          initialProducts={modalInit}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
        />
      )}
    </AppLayout>
  )
}
