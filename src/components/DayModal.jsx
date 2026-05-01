import { useState, useEffect } from 'react'
import { PRODUCTS, INACTIVE_PRODUCTS, unitBonus } from '../data/products'
import { calcDayBonus, formatCurrency } from '../utils/bonusCalc'
import { HEBREW_MONTHS } from '../utils/dateHelpers'
import './DayModal.css'

export default function DayModal({ year, month, day, initialProducts, onSave, onClose, hasData, snapshot, dailyTotal }) {
  const [isEditing, setIsEditing] = useState(!hasData)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const init = {}
    PRODUCTS.forEach(p => { init[p.id] = initialProducts[p.id] || 0 })
    setQuantities(init)
  }, [initialProducts])

  const liveTotal = calcDayBonus(quantities)

  const handleChange = (id, raw) => {
    const val = Math.max(0, parseInt(raw) || 0)
    setQuantities(prev => ({ ...prev, [id]: val }))
  }

  const handleSave = () => onSave(quantities)

  const dateLabel = `${day} ב${HEBREW_MONTHS[month - 1]} ${year}`
  const hasSnapshot = !!(snapshot && snapshot.length > 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">{isEditing ? '📋' : '📊'}</span>
            <div>
              <h2 className="modal-title">{isEditing ? 'עריכת בונוסים' : 'סיכום יומי'}</h2>
              <p className="modal-date">{dateLabel}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {!isEditing ? (
          // ── VIEW MODE ──
          <>
            {hasSnapshot ? (
              <>
                <div className="modal-cols-header">
                  <span>מוצר</span>
                  <span>כמות</span>
                  <span>סה"כ</span>
                </div>
                <div className="modal-body">
                  {snapshot.map(item => (
                    <div key={item.id} className="product-row has-qty">
                      <div className="product-name-wrap">
                        <span className="product-name">{item.name}</span>
                        {item.bonus > 0 && (
                          <span className="product-rate">{formatCurrency(item.bonus)}/יח'</span>
                        )}
                      </div>
                      <span className="qty-display">{item.qty}</span>
                      <span className="line-total positive">{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-snapshot-body">
                <span className="no-snapshot-icon">📂</span>
                <p>אין סיכום מפורט ליום זה</p>
                <p className="no-snapshot-sub">לחצי עריכה כדי לעדכן ולשמור סיכום</p>
              </div>
            )}

            <div className="modal-footer">
              <div className="modal-total-row">
                <span className="total-label">סה"כ בונוס יומי</span>
                <span className="total-value">{formatCurrency(dailyTotal || 0)}</span>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose}>סגירה</button>
                <button className="btn-edit-mode" onClick={() => setIsEditing(true)}>✏️ עריכה</button>
              </div>
            </div>
          </>
        ) : (
          // ── EDIT MODE ──
          <>
            <div className="modal-cols-header">
              <span>מוצר</span>
              <span>כמות</span>
              <span>סה"כ</span>
            </div>
            <div className="modal-body">
              {PRODUCTS.map(product => {
                const rate      = unitBonus(product)
                const qty       = quantities[product.id] || 0
                const lineTotal = qty * rate
                return (
                  <div
                    key={product.id}
                    className={`product-row ${qty > 0 ? 'has-qty' : ''} ${rate === 0 ? 'zero-rate' : ''}`}
                  >
                    <div className="product-name-wrap">
                      <span className="product-name">{product.name}</span>
                      {rate > 0 && (
                        <span className="product-rate">{formatCurrency(rate)}/יח'</span>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={qty === 0 ? '' : qty}
                      placeholder="0"
                      onChange={e => handleChange(product.id, e.target.value)}
                      className="qty-input"
                    />
                    <span className={`line-total ${lineTotal > 0 ? 'positive' : ''}`}>
                      {lineTotal > 0 ? formatCurrency(lineTotal) : '—'}
                    </span>
                  </div>
                )
              })}

              {INACTIVE_PRODUCTS.length > 0 && (
                <>
                  <div className="inactive-section-divider">
                    <span>לא פעיל</span>
                  </div>
                  {INACTIVE_PRODUCTS.map(product => {
                    const rate      = unitBonus(product)
                    const qty       = quantities[product.id] || 0
                    const lineTotal = qty * rate
                    return (
                      <div
                        key={product.id}
                        className={`product-row inactive-product ${qty > 0 ? 'has-qty' : ''}`}
                      >
                        <div className="product-name-wrap">
                          <span className="product-name">{product.name}</span>
                          {rate > 0 && (
                            <span className="product-rate">{formatCurrency(rate)}/יח'</span>
                          )}
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={qty === 0 ? '' : qty}
                          placeholder="0"
                          onChange={e => handleChange(product.id, e.target.value)}
                          className="qty-input"
                        />
                        <span className={`line-total ${lineTotal > 0 ? 'positive' : ''}`}>
                          {lineTotal > 0 ? formatCurrency(lineTotal) : '—'}
                        </span>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
            <div className="modal-footer">
              <div className="modal-total-row">
                <span className="total-label">סה"כ בונוס יומי</span>
                <span className="total-value">{formatCurrency(liveTotal)}</span>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={hasData ? () => setIsEditing(false) : onClose}>
                  {hasData ? 'חזרה לסיכום' : 'ביטול'}
                </button>
                <button className="btn-save" onClick={handleSave}>שמירה ✓</button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
