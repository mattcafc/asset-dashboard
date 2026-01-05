import clsx from 'clsx'
import type { Initiative, Quarter } from '../../types/initiative'
import { QUARTERS, formatDateShort } from '../../utils/dateUtils'
import { getStatusTone } from '../../utils/statusCalculations'

function dotClass(tone: ReturnType<typeof getStatusTone>, overdue: boolean) {
  if (overdue) return 'bg-red-500 ring-red-200 dark:ring-red-500/30'
  if (tone === 'green') return 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-500/30'
  if (tone === 'amber') return 'bg-amber-500 ring-amber-200 dark:ring-amber-500/30'
  if (tone === 'red') return 'bg-red-500 ring-red-200 dark:ring-red-500/30'
  if (tone === 'grey') return 'bg-slate-400 ring-slate-200 dark:ring-slate-700'
  return 'bg-sky-500 ring-sky-200 dark:ring-sky-500/30'
}

export function QuarterlyTimeline({
  initiatives,
  focusQuarter = 'All',
  currentQuarter,
  now = new Date(),
}: {
  initiatives: Initiative[]
  focusQuarter?: Quarter | 'All'
  currentQuarter: Quarter
  now?: Date
}) {
  return (
    <div className="overflow-auto">
      <div className="min-w-[880px]">
        <div className="grid grid-cols-[360px_repeat(4,1fr)] gap-2 px-2 pb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div>Initiative</div>
          {QUARTERS.map((q) => (
            <div key={q} className={clsx('text-center', q === currentQuarter && 'text-sky-700 dark:text-sky-300')}>
              {q}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {initiatives.map((i) => (
            <div
              key={i.id}
              className="grid grid-cols-[360px_repeat(4,1fr)] items-stretch gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="min-w-0 pr-2">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{i.name}</div>
                <div className="truncate text-xs text-slate-600 dark:text-slate-300">
                  {i.opportunity} · {i.lead}
                </div>
              </div>
              {QUARTERS.map((q) => {
                const m = i.quarters[q]
                const tone = getStatusTone(m.status)
                const overdue = Boolean(m.milestone && m.due && m.due.getTime() < now.getTime() && m.status !== 'Complete')
                const isFocused = focusQuarter === 'All' ? true : q === focusQuarter
                return (
                  <div
                    key={q}
                    className={clsx(
                      'flex items-center justify-center rounded-md px-2 py-1',
                      q === currentQuarter && 'ring-1 ring-inset ring-sky-300 dark:ring-sky-600/60',
                      !isFocused && 'opacity-35',
                    )}
                    title={
                      m.milestone
                        ? `${q}: ${m.milestone}\nDue: ${formatDateShort(m.due)}\nStatus: ${m.status}${m.statusNotes ? `\nNotes: ${m.statusNotes}` : ''}`
                        : `${q}: —`
                    }
                  >
                    {m.milestone ? (
                      <div className="flex items-center gap-2">
                        <span className={clsx('h-3 w-3 rounded-full ring-2 ring-inset', dotClass(tone, overdue))} />
                        <span className="hidden text-xs text-slate-600 dark:text-slate-300 xl:inline">
                          {m.due ? formatDateShort(m.due) : '—'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

