import { PRODUCTS, INACTIVE_PRODUCTS, unitBonus } from '../data/products'

const ALL_PRODUCTS = [...PRODUCTS, ...INACTIVE_PRODUCTS]

// Calculate total bonus for one day's quantities
// quantities: { product_id: count, ... }
export function calcDayBonus(quantities) {
  if (!quantities) return 0
  return ALL_PRODUCTS.reduce((total, product) => {
    const qty = quantities[product.id] || 0
    return total + qty * unitBonus(product)
  }, 0)
}

// Calculate total bonus for an entire month
// Uses stored dailyTotal when available (preserves historical bonuses)
export function calcMonthBonus(monthData) {
  if (!monthData) return 0
  return Object.values(monthData).reduce((total, dayData) => {
    if (dayData?.dailyTotal !== undefined) return total + dayData.dailyTotal
    return total + calcDayBonus(dayData?.products)
  }, 0)
}

export function formatCurrency(amount) {
  return `₪${amount.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}
