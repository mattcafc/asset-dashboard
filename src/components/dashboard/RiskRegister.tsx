import { AlertTriangle } from 'lucide-react'
import { useMemo } from 'react'
import type { Initiative } from '../../types/initiative'
import { getRiskQuarters } from '../../utils/statusCalculations'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/StatusBadge'

export function RiskRegister({ initiatives }: { initiatives: Initiative[] }) {
  const risks = useMemo(() => {
    return initiatives
      .map((i) => {
        const riskQuarters = getRiskQuarters(i)
        const annualRisk = i.annualStatus === 'At Risk' || i.annualStatus === 'Blocked'
        const hasRisk = annualRisk || riskQuarters.length > 0
        return { initiative: i, riskQuarters, hasRisk, annualRisk }
      })
      .filter((r) => r.hasRisk)
  }, [initiatives])

  return (
    <Card className="p-0">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Risk register</div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Annual risk or any quarterly “At Risk/Blocked”.
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
            <AlertTriangle className="h-4 w-4" />
            {risks.length}
          </div>
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto p-4">
        {risks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            No risks detected.
          </div>
        ) : (
          <div className="space-y-3">
            {risks.map(({ initiative: i, riskQuarters }) => {
              const notes = [
                i.annualStatus === 'At Risk' || i.annualStatus === 'Blocked' ? i.annualStatusNotes : '',
                ...riskQuarters.map((q) => i.quarters[q].statusNotes).filter(Boolean),
              ]
                .filter(Boolean)
                .join(' • ')

              return (
                <div
                  key={i.id}
                  className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{i.name}</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        Lead: {i.lead || '—'} · Theme: {i.opportunity || '—'}
                      </div>
                    </div>
                    <StatusBadge status={i.annualStatus} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {riskQuarters.length ? (
                      riskQuarters.map((q) => (
                        <span
                          key={q}
                          className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30"
                        >
                          {q} {i.quarters[q].status}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">No quarterly risk flags</span>
                    )}
                  </div>
                  {notes ? (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Notes:</span> {notes}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}

