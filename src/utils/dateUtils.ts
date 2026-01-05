import type { Quarter } from '../types/initiative'

export const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime())
}

/**
 * Tolerant date parsing for board-supplied CSVs:
 * - ISO-8601 (YYYY-MM-DD)
 * - MM/DD/YYYY or DD/MM/YYYY (best-effort)
 * - "Jan 5 2026" and similar browser-parsable strings
 */
export function parseDateLoose(input: string | undefined | null): Date | undefined {
  const raw = (input ?? '').trim()
  if (!raw) return undefined

  // ISO first (avoid locale ambiguity)
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) {
    const y = Number(iso[1])
    const m = Number(iso[2]) - 1
    const d = Number(iso[3])
    const dt = new Date(y, m, d)
    return isValidDate(dt) ? dt : undefined
  }

  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slash) {
    const a = Number(slash[1])
    const b = Number(slash[2])
    const y = Number(slash[3])

    // Prefer MM/DD unless it can't be
    const tryMmDd = new Date(y, a - 1, b)
    if (a >= 1 && a <= 12 && b >= 1 && b <= 31 && isValidDate(tryMmDd)) return tryMmDd

    const tryDdMm = new Date(y, b - 1, a)
    if (b >= 1 && b <= 12 && a >= 1 && a <= 31 && isValidDate(tryDdMm)) return tryDdMm
  }

  const parsed = new Date(raw)
  return isValidDate(parsed) ? parsed : undefined
}

export function formatDateShort(d?: Date): string {
  if (!d) return '—'
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(d)
}

export function daysBetween(from: Date, to: Date): number {
  const a = startOfDay(from).getTime()
  const b = startOfDay(to).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function getQuarterForDate(d: Date): Quarter {
  const m = d.getMonth() + 1
  if (m <= 3) return 'Q1'
  if (m <= 6) return 'Q2'
  if (m <= 9) return 'Q3'
  return 'Q4'
}

export function getQuarterRange(year: number, q: Quarter): { start: Date; end: Date } {
  // End is inclusive.
  if (q === 'Q1') return { start: new Date(year, 0, 1), end: new Date(year, 2, 31) }
  if (q === 'Q2') return { start: new Date(year, 3, 1), end: new Date(year, 5, 30) }
  if (q === 'Q3') return { start: new Date(year, 6, 1), end: new Date(year, 8, 30) }
  return { start: new Date(year, 9, 1), end: new Date(year, 11, 31) }
}

export function getCurrentQuarterInfo(now = new Date()): {
  quarter: Quarter
  daysRemaining: number
  quarterEnd: Date
} {
  const quarter = getQuarterForDate(now)
  const { end } = getQuarterRange(now.getFullYear(), quarter)
  return { quarter, quarterEnd: end, daysRemaining: Math.max(0, daysBetween(now, end)) }
}

