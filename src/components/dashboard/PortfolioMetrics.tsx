import { AlertTriangle, CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import type { Initiative } from '../../types/initiative'
import { getCommenced } from '../../utils/statusCalculations'
import { Card } from '../ui/Card'

function MetricCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</div>
          {sub ? <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{sub}</div> : null}
        </div>
        <div className="rounded-lg bg-slate-50 p-2 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800">
          {icon}
        </div>
      </div>
    </Card>
  )
}

export function PortfolioMetrics({ initiatives }: { initiatives: Initiative[] }) {
  const total = initiatives.length

  const { completePct, onTrackPct, atRiskCount, commencedCount } = useMemo(() => {
    const complete = initiatives.filter((i) => i.annualStatus === 'Complete').length
    const commenced = initiatives.filter(getCommenced)
    const green = commenced.filter((i) => i.annualStatus === 'On Track' || i.annualStatus === 'Complete').length
    const risk = commenced.filter((i) => i.annualStatus === 'At Risk' || i.annualStatus === 'Blocked').length
    return {
      completePct: total > 0 ? Math.round((complete / total) * 100) : 0,
      onTrackPct: commenced.length > 0 ? Math.round((green / commenced.length) * 100) : 0,
      atRiskCount: risk,
      commencedCount: commenced.length,
    }
  }, [initiatives, total])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <MetricCard
        label="% Complete"
        value={`${completePct}%`}
        sub={`${initiatives.filter((i) => i.annualStatus === 'Complete').length} of ${total}`}
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />}
      />
      <MetricCard
        label="% On Track (commenced)"
        value={commencedCount ? `${onTrackPct}%` : '—'}
        sub={commencedCount ? `${commencedCount} commenced initiatives` : 'No commenced initiatives'}
        icon={<ShieldCheck className="h-5 w-5 text-sky-600 dark:text-sky-300" />}
      />
      <MetricCard
        label="At risk"
        value={`${atRiskCount}`}
        sub={commencedCount ? `of ${commencedCount} commenced` : '—'}
        icon={<AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" />}
      />
      <MetricCard
        label="QoQ trend"
        value="—"
        sub="Enable historical snapshots to show trends"
        icon={<TrendingUp className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
      />
    </div>
  )
}

