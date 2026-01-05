import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import type { Initiative, Status } from '../../types/initiative'
import { QUARTERS, formatDateShort } from '../../utils/dateUtils'
import {
  getDaysUntilNextMilestone,
  getOverdueQuarters,
  getQuarterlyProgressPct,
  getRiskQuarters,
  getStatusTone,
} from '../../utils/statusCalculations'
import { ProgressBar } from '../charts/ProgressBar'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/StatusBadge'
import { InitiativeDetail } from './InitiativeDetail'

function Dot({ tone }: { tone: ReturnType<typeof getStatusTone> }) {
  const cls =
    tone === 'green'
      ? 'bg-emerald-500'
      : tone === 'amber'
        ? 'bg-amber-500'
        : tone === 'red'
          ? 'bg-red-500'
          : tone === 'grey'
            ? 'bg-slate-400'
            : 'bg-sky-500'
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${cls}`} />
}

export function InitiativeTable({ initiatives }: { initiatives: Initiative[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'annualStatus', desc: true }])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const columns = useMemo<ColumnDef<Initiative>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: (ctx) => <span className="font-mono text-xs text-slate-700 dark:text-slate-200">{ctx.getValue<string>()}</span>,
      },
      {
        header: 'Initiative',
        accessorKey: 'name',
        cell: (ctx) => {
          const v = ctx.getValue<string>()
          const i = ctx.row.original
          const overdue = getOverdueQuarters(i).length
          const daysToNext = getDaysUntilNextMilestone(i)
          const nextDue = QUARTERS.map((q) => i.quarters[q])
            .filter((m) => Boolean(m.milestone) && m.due && m.status !== 'Complete')
            .map((m) => m.due!)
            .sort((a, b) => a.getTime() - b.getTime())[0]
          return (
            <div className="min-w-0">
              <div className="truncate font-medium text-slate-900 dark:text-slate-50" title={v}>
                {v || '—'}
              </div>
              <div className="truncate text-xs text-slate-600 dark:text-slate-300">
                {i.opportunity || '—'}
                {nextDue ? (
                  <>
                    {' '}
                    ·{' '}
                    <span className={overdue ? 'font-semibold text-red-700 dark:text-red-300' : ''}>
                      {overdue ? 'Overdue' : 'Next due'}: {formatDateShort(nextDue)}
                      {daysToNext !== null ? ` (${daysToNext}d)` : ''}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          )
        },
      },
      {
        header: 'Lead',
        accessorKey: 'lead',
        cell: (ctx) => <span className="text-sm text-slate-700 dark:text-slate-200">{ctx.getValue<string>() || '—'}</span>,
      },
      {
        header: 'Status',
        accessorKey: 'annualStatus',
        cell: (ctx) => <StatusBadge status={ctx.getValue<Status>()} />,
      },
      {
        id: 'quarters',
        header: 'Q1–Q4',
        cell: (ctx) => {
          const i = ctx.row.original
          return (
            <div className="flex items-center gap-2">
              {QUARTERS.map((q) => (
                <span key={q} title={`${q}: ${i.quarters[q].status}`}>
                  <Dot tone={getStatusTone(i.quarters[q].status)} />
                </span>
              ))}
            </div>
          )
        },
      },
      {
        id: 'progress',
        header: 'Progress',
        accessorFn: (row) => getQuarterlyProgressPct(row),
        cell: (ctx) => {
          const pct = Number(ctx.getValue<number>() ?? 0)
          return (
            <div className="min-w-[140px]">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span> </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{Math.round(pct)}%</span>
              </div>
              <ProgressBar value={pct} />
            </div>
          )
        },
      },
      {
        id: 'risk',
        header: 'Risk',
        accessorFn: (row) => getRiskQuarters(row).length,
        cell: (ctx) => {
          const n = Number(ctx.getValue<number>() ?? 0)
          return n > 0 ? (
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300" title={`At risk quarters: ${n}`}>
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-semibold">{n}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )
        },
      },
    ],
    [],
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: initiatives,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: true,
  })

  return (
    <Card className="p-0">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Initiatives</div>
        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Sortable, executive-focused roll-up with quarterly indicators.
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-[980px] w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-white dark:bg-slate-900">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const canSort = h.column.getCanSort()
                  const sort = h.column.getIsSorted()
                  return (
                    <th
                      key={h.id}
                      onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                      className="select-none border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300"
                    >
                      <div className={`inline-flex items-center gap-1 ${canSort ? 'cursor-pointer' : ''}`}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {sort === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : sort === 'desc' ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const i = row.original
              const expanded = expandedId === i.id
              return (
                <Fragment key={row.id}>
                  <tr
                    key={row.id}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => setExpandedId(expanded ? null : i.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-slate-100 px-4 py-3 align-top text-sm dark:border-slate-800"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {expanded ? (
                    <tr key={`${row.id}-detail`}>
                      <td colSpan={row.getVisibleCells().length} className="px-4 pb-4">
                        <InitiativeDetail initiative={i} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

