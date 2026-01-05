import { Search } from 'lucide-react'
import clsx from 'clsx'

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search by ID or initiative…',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={clsx('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/30"
      />
    </div>
  )
}

