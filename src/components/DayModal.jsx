import { useState, useEffect } from 'react'
import { PRODUCTS, unitBonus } from '../data/products'
import { calcDayBonus, formatCurrency } from '../utils/bonusCalc'
import { HEBREW_MONTHS } from '../utils/dateHelpers'
import './DayModal.css'

export default function DayModal({ year, month, day, initialProducts, onSave, onClose }) {
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const init = {}
    PRODUCTS.forEach(p => { init[p.id] = initialProducts[p.id] || 0 })
    setQuantities(init)
  }, [initialProducts])

  const total = calcDayBonus(quantities)

  const handleChange = (id, raw) => {
    const val = Math.max(0, parseInt(raw) || 0)
    setQuantities(prev => ({ ...prev, [id]: val }))
  }

  const handleSave = () => {
    onSave(quantities)
  }

  const dateLabel = `${day} ב${HEBREW_MONTHS[month - 1]} ${year}`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">📋</span>
            <div>
              <h2 className="modal-title">עריכת בונוסים</h2>
              <p className="modal-date">{dateLabel}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-cols-header">
          <span>מוצר</span>
          <span>כמות</span>
          <span>סה"כ</span>
        </div>

        <div className="modal-body">
          {PRODUCTS.map(product => {
            const rate = unitBonus(product)
            const qty = quantities[product.id] || 0
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
        </div>

        <div className="modal-footer">
          <div className="modal-total-row">
            <span className="total-label">סה"כ בונוס יומי</span>
            <span className="total-value">{formatCurrency(total)}</span>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>ביטול</button>
            <button className="btn-save" onClick={handleSave}>שמירה ✓</button>
          </div>
        </div>

      </div>
    </div>
  )
}
