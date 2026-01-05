import clsx from 'clsx'
import type { Status } from '../../types/initiative'
import { getStatusTone } from '../../utils/statusCalculations'

const toneStyles: Record<ReturnType<typeof getStatusTone>, string> = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30',
  red: 'bg-red-50 text-red-800 ring-red-200 dark:bg-red-500/10 dark:text-red-200 dark:ring-red-500/30',
  grey: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  blue: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/30',
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const tone = getStatusTone(status)
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneStyles[tone],
        className,
      )}
    >
      {status}
    </span>
  )
}

