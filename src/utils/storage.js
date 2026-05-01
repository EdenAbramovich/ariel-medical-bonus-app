import { doc, getDoc, setDoc, collection, getDocs, deleteField } from 'firebase/firestore'
import { db } from '../firebase'
import { calcMonthBonus } from './bonusCalc'

function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function monthRef(userId, year, month) {
  return doc(db, 'users', userId, 'months', monthKey(year, month))
}

// Returns { days, manualTotal } for the given month
export async function getMonthData(userId, year, month) {
  const snap = await getDoc(monthRef(userId, year, month))
  if (!snap.exists()) return { days: {}, manualTotal: null }
  const data = snap.data()
  return { days: data.days || {}, manualTotal: data.manualTotal ?? null }
}

// Returns the saved products for a specific day
export async function getDayData(userId, year, month, day) {
  const { days } = await getMonthData(userId, year, month)
  return days[String(day)]?.products || {}
}

// Saves a day's products and recalculates the month total
export async function saveDayData(userId, year, month, day, products) {
  const ref = monthRef(userId, year, month)
  const snap = await getDoc(ref)
  const days = snap.exists() ? { ...(snap.data().days || {}) } : {}

  const nonZero = Object.fromEntries(
    Object.entries(products).filter(([, qty]) => qty > 0)
  )

  if (Object.keys(nonZero).length === 0) {
    delete days[String(day)]
  } else {
    days[String(day)] = { products: nonZero }
  }

  await setDoc(ref, {
    days,
    total: calcMonthBonus(days),
    updatedAt: new Date(),
  }, { merge: true })
}

// Save or clear a manual total override for a month
export async function saveManualTotal(userId, year, month, value) {
  const ref = monthRef(userId, year, month)
  if (value === null) {
    await setDoc(ref, { manualTotal: deleteField() }, { merge: true })
  } else {
    await setDoc(ref, { manualTotal: Number(value) }, { merge: true })
  }
}

// Returns all months that have data: { "2026-04": { total, daysCount }, ... }
export async function getAllMonthSummaries(userId) {
  const snap = await getDocs(collection(db, 'users', userId, 'months'))
  const result = {}
  snap.forEach(d => {
    result[d.id] = {
      total:     d.data().manualTotal ?? d.data().total ?? 0,
      daysCount: Object.keys(d.data().days || {}).length,
    }
  })
  return result
}

// Returns 12-item array of { month, bonus, days } for a given year
export async function getYearData(userId, year) {
  const snap = await getDocs(collection(db, 'users', userId, 'months'))
  const result = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, bonus: 0, days: 0 }))
  snap.forEach(d => {
    const [y, m] = d.id.split('-').map(Number)
    if (y === year) {
      result[m - 1] = {
        month:  m,
        bonus:  d.data().total || 0,
        days:   Object.keys(d.data().days || {}).length,
      }
    }
  })
  return result
}
