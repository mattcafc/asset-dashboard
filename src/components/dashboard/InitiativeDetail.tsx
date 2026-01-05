import type { Initiative } from '../../types/initiative'
import { QUARTERS, formatDateShort } from '../../utils/dateUtils'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/StatusBadge'

export function InitiativeDetail({ initiative }: { initiative: Initiative }) {
  return (
    <Card className="mt-3 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{initiative.name}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            {initiative.id} · {initiative.opportunity} · Lead: {initiative.lead} · Sponsor: {initiative.accountableExecutive || '—'}
          </div>
        </div>
        <StatusBadge status={initiative.annualStatus} />
      </div>

      {initiative.annualStatusNotes ? (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800">
          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Annual status notes</div>
          <div className="mt-1 whitespace-pre-wrap">{initiative.annualStatusNotes}</div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {QUARTERS.map((q) => {
          const m = initiative.quarters[q]
          return (
            <div key={q} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{q}</div>
                <StatusBadge status={m.status} />
              </div>
              <div className="mt-2 text-sm text-slate-900 dark:text-slate-50">{m.milestone || '—'}</div>
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Due: {formatDateShort(m.due)}</div>
              {m.statusNotes ? (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Notes:</span> {m.statusNotes}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

