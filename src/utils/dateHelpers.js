export const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

// Sunday first (Israeli convention)
export const HEBREW_DAYS_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

export function buildCalendarGrid(year, month) {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

// Returns list of { year, month } from 3 years back to next month, newest first
export function getAvailableMonths() {
  const today = new Date()
  const cy = today.getFullYear()
  const cm = today.getMonth() + 1 // 1-12

  const months = []

  // next month
  let ny = cy, nm = cm + 1
  if (nm > 12) { nm = 1; ny++ }
  months.push({ year: ny, month: nm, isFuture: true })

  // current month back to 3 years ago (same month)
  for (let y = cy; y >= cy - 3; y--) {
    const startM = y === cy - 3 ? cm : 12
    const endM = y === cy ? cm : 1
    for (let m = startM; m >= endM; m--) {
      months.push({ year: y, month: m, isCurrent: y === cy && m === cm })
    }
  }

  return months
}

// Group by year for rendering
export function groupMonthsByYear(months) {
  const map = {}
  months.forEach(item => {
    if (!map[item.year]) map[item.year] = []
    map[item.year].push(item)
  })
  // Return sorted descending by year
  return Object.keys(map)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({ year, months: map[year] }))
}
