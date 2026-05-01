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

// Returns list of { year, month } from 3 years back, newest first, all 12 months per year
export function getAvailableMonths() {
  const today = new Date()
  const cy = today.getFullYear()
  const cm = today.getMonth() + 1 // 1-12

  const months = []

  for (let y = cy; y >= cy - 3; y--) {
    for (let m = 12; m >= 1; m--) {
      months.push({
        year: y,
        month: m,
        isCurrent: y === cy && m === cm,
        isFuture: y > cy || (y === cy && m > cm),
      })
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
