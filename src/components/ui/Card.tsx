import type { ReactNode } from 'react'
import clsx from 'clsx'

export function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'rounded-xl bg-white shadow-card ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800',
        className,
      )}
    >
      {children}
    </div>
  )
}

