import { PRODUCTS, unitBonus } from '../data/products'

// Calculate total bonus for one day's quantities
// quantities: { product_id: count, ... }
export function calcDayBonus(quantities) {
  if (!quantities) return 0
  return PRODUCTS.reduce((total, product) => {
    const qty = quantities[product.id] || 0
    return total + qty * unitBonus(product)
  }, 0)
}

// Calculate total bonus for an entire month
// monthData: { "1": { products: {...} }, "15": { products: {...} }, ... }
export function calcMonthBonus(monthData) {
  if (!monthData) return 0
  return Object.values(monthData).reduce((total, dayData) => {
    return total + calcDayBonus(dayData?.products)
  }, 0)
}

export function formatCurrency(amount) {
  return `₪${amount.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}
