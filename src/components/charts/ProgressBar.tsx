import clsx from 'clsx'

export function ProgressBar({
  value,
  className,
  tone = 'blue',
}: {
  value: number
  className?: string
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'grey'
}) {
  const pct = Math.max(0, Math.min(100, value))
  const bar =
    tone === 'green'
      ? 'bg-emerald-500'
      : tone === 'amber'
        ? 'bg-amber-500'
        : tone === 'red'
          ? 'bg-red-500'
          : tone === 'grey'
            ? 'bg-slate-400'
            : 'bg-sky-500'
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <div className={clsx('h-full rounded-full', bar)} style={{ width: `${pct}%` }} />
    </div>
  )
}

