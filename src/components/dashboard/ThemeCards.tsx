import { useMemo } from 'react'
import type { Initiative, Status } from '../../types/initiative'
import { rollupWorstStatus, statusSeverity } from '../../utils/statusCalculations'
import { ProgressBar } from '../charts/ProgressBar'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/StatusBadge'

type ThemeSummary = {
  opportunity: string
  count: number
  completeCount: number
  rollupStatus: Status
  progressPct: number
}

export function ThemeCards({
  initiatives,
  onSelectTheme,
}: {
  initiatives: Initiative[]
  onSelectTheme?: (opportunity: string) => void
}) {
  const themes = useMemo<ThemeSummary[]>(() => {
    const by = new Map<string, Initiative[]>()
    for (const i of initiatives) {
      const key = i.opportunity || 'Unassigned'
      by.set(key, [...(by.get(key) ?? []), i])
    }
    const out: ThemeSummary[] = []
    for (const [opportunity, list] of by.entries()) {
      const completeCount = list.filter((i) => i.annualStatus === 'Complete').length
      const rollupStatus = rollupWorstStatus(list.map((i) => i.annualStatus))
      const progressPct = list.length > 0 ? Math.round((completeCount / list.length) * 100) : 0
      out.push({ opportunity, count: list.length, completeCount, rollupStatus, progressPct })
    }
    return out.sort((a, b) => {
      const sev = statusSeverity(b.rollupStatus) - statusSeverity(a.rollupStatus)
      if (sev !== 0) return sev
      return b.count - a.count
    })
  }, [initiatives])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {themes.map((t) => (
        <button
          key={t.opportunity}
          type="button"
          onClick={() => onSelectTheme?.(t.opportunity)}
          className="text-left"
          title={onSelectTheme ? 'Click to drill down' : undefined}
        >
          <Card className="h-full p-4 transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{t.opportunity}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{t.count}</span> initiatives ·{' '}
                  <span className="font-medium text-slate-900 dark:text-slate-100">{t.completeCount}</span> complete
                </div>
              </div>
              <StatusBadge status={t.rollupStatus} />
            </div>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Progress</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{t.progressPct}%</span>
              </div>
              <ProgressBar
                value={t.progressPct}
                tone={t.rollupStatus === 'At Risk' ? 'amber' : t.rollupStatus === 'Blocked' ? 'red' : 'blue'}
              />
            </div>
          </Card>
        </button>
      ))}
    </div>
  )
}

