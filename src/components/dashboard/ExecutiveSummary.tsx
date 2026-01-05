import { FileUp, FileText, Moon, Sun } from 'lucide-react'
import { useMemo } from 'react'
import type { Initiative, Status } from '../../types/initiative'
import { getCurrentQuarterInfo } from '../../utils/dateUtils'
import { getHealthScorePct, getPortfolioHealthLabel } from '../../utils/statusCalculations'
import { StatusDonut } from '../charts/StatusDonut'
import { Card } from '../ui/Card'

const STATUS_SET: Status[] = ['On Track', 'At Risk', 'Blocked', 'In Progress', 'Complete', 'Not Commenced']

export function ExecutiveSummary({
  initiatives,
  onOpenImport,
  onExportPdf,
  darkMode,
  onToggleDarkMode,
}: {
  initiatives: Initiative[]
  onOpenImport: () => void
  onExportPdf: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}) {
  const quarterInfo = getCurrentQuarterInfo()

  const breakdown = useMemo(() => {
    const map = new Map<Status, number>()
    for (const s of STATUS_SET) map.set(s, 0)
    for (const i of initiatives) map.set(i.annualStatus, (map.get(i.annualStatus) ?? 0) + 1)
    return STATUS_SET.map((s) => ({ status: s, count: map.get(s) ?? 0 }))
  }, [initiatives])

  const healthScore = useMemo(() => getHealthScorePct(initiatives), [initiatives])
  const healthLabel = useMemo(() => getPortfolioHealthLabel(initiatives), [initiatives])

  const healthTone =
    healthLabel === 'Healthy' ? 'text-emerald-700 dark:text-emerald-300' : healthLabel === 'Caution' ? 'text-amber-700 dark:text-amber-300' : 'text-red-700 dark:text-red-300'

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-5">
          <StatusDonut breakdown={breakdown} />
          <div className="min-w-0">
            <div className="flex items-end gap-3">
              <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {initiatives.length}
              </div>
              <div className="pb-1 text-sm text-slate-600 dark:text-slate-300">initiatives</div>
            </div>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
              {breakdown
                .filter((b) => b.count > 0)
                .map((b) => (
                  <div key={b.status}>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{b.count}</span> {b.status}
                  </div>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">Portfolio health score</div>
                <div className="mt-1 flex items-end gap-2">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{healthScore}%</div>
                  <div className={`pb-1 text-xs font-semibold ${healthTone}`}>{healthLabel}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">Current quarter</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{quarterInfo.quarter}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">Days remaining</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  {quarterInfo.daysRemaining}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onOpenImport}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-500/40"
            >
              <FileUp className="h-4 w-4" />
              Import CSV
            </button>
            <button
              type="button"
              onClick={onExportPdf}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="hidden max-w-[420px] rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-800 lg:block">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Traffic lights:</span>
              <span>
                <span className="inline-block h-2 w-2 rounded-full bg-status-green align-middle" /> Green = On Track /
                Complete
              </span>
              <span>
                <span className="inline-block h-2 w-2 rounded-full bg-status-amber align-middle" /> Amber = At Risk
              </span>
              <span>
                <span className="inline-block h-2 w-2 rounded-full bg-status-red align-middle" /> Red = Blocked
              </span>
              <span>
                <span className="inline-block h-2 w-2 rounded-full bg-status-grey align-middle" /> Grey = Not Commenced
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

