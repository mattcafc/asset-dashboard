import { RotateCcw } from 'lucide-react'
import type { FiltersState } from '../../hooks/useFilters'
import type { Quarter, Status } from '../../types/initiative'
import { Card } from './Card'
import { SearchInput } from './SearchInput'

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/30"
      >
        {children}
      </select>
    </label>
  )
}

export function FilterBar({
  filters,
  setFilters,
  options,
  onReset,
}: {
  filters: FiltersState
  setFilters: (next: FiltersState) => void
  options: { opportunities: string[]; leads: string[]; statuses: Status[]; quarters: Quarter[] }
  onReset: () => void
}) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <SearchInput value={filters.search} onChange={(v) => setFilters({ ...filters, search: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:grid-cols-4">
          <Select
            label="Theme"
            value={filters.opportunity}
            onChange={(v) => setFilters({ ...filters, opportunity: v as FiltersState['opportunity'] })}
          >
            <option value="All">All</option>
            {options.opportunities.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <Select
            label="Lead"
            value={filters.lead}
            onChange={(v) => setFilters({ ...filters, lead: v as FiltersState['lead'] })}
          >
            <option value="All">All</option>
            {options.leads.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
          <Select
            label="Annual status"
            value={filters.status}
            onChange={(v) => setFilters({ ...filters, status: v as FiltersState['status'] })}
          >
            <option value="All">All</option>
            {options.statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select
            label="Quarter focus"
            value={filters.quarter}
            onChange={(v) => setFilters({ ...filters, quarter: v as FiltersState['quarter'] })}
          >
            <option value="All">All</option>
            {options.quarters.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </Select>
        </div>
        <div className="lg:col-span-1 lg:flex lg:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </Card>
  )
}

