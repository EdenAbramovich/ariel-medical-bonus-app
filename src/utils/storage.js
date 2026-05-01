import { doc, getDoc, setDoc, collection, getDocs, deleteField } from 'firebase/firestore'
import { db } from '../firebase'
import { calcMonthBonus } from './bonusCalc'
import { PRODUCTS, INACTIVE_PRODUCTS } from '../data/products'

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
    const allProducts = [...PRODUCTS, ...INACTIVE_PRODUCTS]
    const snapshot = Object.entries(nonZero).map(([id, qty]) => {
      const product = allProducts.find(p => p.id === id)
      const bonus   = product ? product.bonus : 0
      return { id, name: product ? product.name.trim() : id, qty, bonus, lineTotal: qty * bonus }
    })
    const dailyTotal = snapshot.reduce((sum, item) => sum + item.lineTotal, 0)
    days[String(day)] = { products: nonZero, snapshot, dailyTotal }
  }

  await setDoc(ref, {
    days,
    total: calcMonthBonus(days),
    updatedAt: new Date(),
  }, { merge: true })
}

// Upsert user profile so admin can identify users
export async function saveUserProfile(userId, { email, name, photoURL }) {
  await setDoc(doc(db, 'users', userId), {
    email,
    name,
    photoURL: photoURL || null,
    lastSeen: new Date(),
  }, { merge: true })
}

// Fetch all users + their bonus for a given month (admin only)
export async function getAllUsersWithMonthData(year, month) {
  const key = monthKey(year, month)
  const usersSnap = await getDocs(collection(db, 'users'))

  const results = await Promise.all(
    usersSnap.docs
      .filter(d => d.data().email)
      .map(async (userDoc) => {
        const profile   = userDoc.data()
        const monthSnap = await getDoc(doc(db, 'users', userDoc.id, 'months', key))
        const md        = monthSnap.exists() ? monthSnap.data() : null
        return {
          userId:    userDoc.id,
          name:      profile.name  || profile.email,
          email:     profile.email,
          photoURL:  profile.photoURL || null,
          lastSeen:  profile.lastSeen || null,
          bonus:     md ? (md.manualTotal ?? md.total ?? 0) : 0,
          daysCount: md ? Object.keys(md.days || {}).length : 0,
          hasData:   !!md,
        }
      })
  )

  return results.sort((a, b) => b.bonus - a.bonus)
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
