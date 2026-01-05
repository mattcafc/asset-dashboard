import type { Initiative, Quarter, Status } from '../types/initiative'
import { QUARTERS } from './dateUtils'

export const STATUS_ORDER: Status[] = [
  'Blocked',
  'At Risk',
  'In Progress',
  'On Track',
  'Not Commenced',
  'Complete',
]

export function normalizeStatus(input: unknown): Status {
  const raw = String(input ?? '').trim()
  const s = raw.toLowerCase()
  if (s === 'complete') return 'Complete'
  if (s === 'on track' || s === 'on-track') return 'On Track'
  if (s === 'at risk' || s === 'at-risk') return 'At Risk'
  if (s === 'blocked') return 'Blocked'
  if (s === 'in progress' || s === 'in-progress') return 'In Progress'
  return 'Not Commenced'
}

export function statusSeverity(status: Status): number {
  // Higher = worse
  switch (status) {
    case 'Blocked':
      return 5
    case 'At Risk':
      return 4
    case 'In Progress':
      return 3
    case 'On Track':
      return 2
    case 'Not Commenced':
      return 1
    case 'Complete':
      return 0
  }
}

export function rollupWorstStatus(statuses: Status[]): Status {
  if (statuses.length === 0) return 'Not Commenced'
  return statuses.reduce<Status>((worst, s) => (statusSeverity(s) > statusSeverity(worst) ? s : worst), statuses[0])
}

export function getStatusTone(status: Status): 'green' | 'amber' | 'red' | 'grey' | 'blue' {
  if (status === 'Complete' || status === 'On Track') return 'green'
  if (status === 'At Risk') return 'amber'
  if (status === 'Blocked') return 'red'
  if (status === 'Not Commenced') return 'grey'
  return 'blue' // In Progress
}

export function getQuarterlyProgressPct(i: Initiative): number {
  const completed = QUARTERS.filter((q) => i.quarters[q].milestone && i.quarters[q].status === 'Complete').length
  const hasContent = QUARTERS.filter((q) => Boolean(i.quarters[q].milestone)).length
  return hasContent > 0 ? (completed / hasContent) * 100 : 0
}

export function getQuarterDots(i: Initiative): Array<{ quarter: Quarter; status: Status }> {
  return QUARTERS.map((q) => ({ quarter: q, status: i.quarters[q].status }))
}

export function getRiskQuarters(i: Initiative): Quarter[] {
  return QUARTERS.filter((q) => i.quarters[q].status === 'At Risk' || i.quarters[q].status === 'Blocked')
}

export function getOverdueQuarters(i: Initiative, now = new Date()): Quarter[] {
  const t = now.getTime()
  return QUARTERS.filter((q) => {
    const m = i.quarters[q]
    if (!m.milestone || !m.due) return false
    if (m.status === 'Complete') return false
    return m.due.getTime() < t
  })
}

export function getDaysUntilNextMilestone(i: Initiative, now = new Date()): number | null {
  const t = now.getTime()
  const upcoming = QUARTERS.map((q) => i.quarters[q])
    .filter((m) => Boolean(m.milestone) && m.due && m.status !== 'Complete')
    .map((m) => m.due!.getTime() - t)
    .filter((ms) => ms >= 0)
    .sort((a, b) => a - b)[0]

  if (upcoming === undefined) return null
  return Math.ceil(upcoming / (1000 * 60 * 60 * 24))
}

export function getCommenced(i: Initiative): boolean {
  return i.annualStatus !== 'Not Commenced'
}

export function getPortfolioHealthLabel(initiatives: Initiative[]): 'Healthy' | 'Caution' | 'Critical' {
  const commenced = initiatives.filter(getCommenced)
  if (commenced.length === 0) return 'Healthy'
  const atRisk = commenced.filter((i) => i.annualStatus === 'At Risk' || i.annualStatus === 'Blocked').length
  const riskRatio = atRisk / commenced.length
  if (riskRatio > 0.3) return 'Critical'
  if (riskRatio > 0.1) return 'Caution'
  return 'Healthy'
}

export function getHealthScorePct(initiatives: Initiative[]): number {
  // Simple board-friendly score: % of commenced initiatives that are green (On Track/Complete).
  const commenced = initiatives.filter(getCommenced)
  if (commenced.length === 0) return 100
  const green = commenced.filter((i) => i.annualStatus === 'On Track' || i.annualStatus === 'Complete').length
  return Math.round((green / commenced.length) * 100)
}

