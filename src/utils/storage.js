const PREFIX = 'ariel_data_'

function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function getUserData(userId) {
  try {
    const raw = localStorage.getItem(PREFIX + userId)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUserData(userId, data) {
  localStorage.setItem(PREFIX + userId, JSON.stringify(data))
}

export function getMonthData(userId, year, month) {
  const data = getUserData(userId)
  return data[monthKey(year, month)] || {}
}

export function getDayData(userId, year, month, day) {
  const monthData = getMonthData(userId, year, month)
  return monthData[day]?.products || {}
}

// Save a day's product quantities (only stores non-zero values)
export function saveDayData(userId, year, month, day, products) {
  const data = getUserData(userId)
  const key = monthKey(year, month)
  if (!data[key]) data[key] = {}

  const nonZero = {}
  Object.entries(products).forEach(([id, qty]) => {
    if (qty > 0) nonZero[id] = qty
  })

  if (Object.keys(nonZero).length === 0) {
    delete data[key][day]
  } else {
    data[key][day] = { products: nonZero }
  }

  if (Object.keys(data[key]).length === 0) delete data[key]
  saveUserData(userId, data)
}
