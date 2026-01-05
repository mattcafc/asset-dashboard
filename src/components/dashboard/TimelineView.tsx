import type { Initiative, Quarter } from '../../types/initiative'
import { getCurrentQuarterInfo } from '../../utils/dateUtils'
import { Card } from '../ui/Card'
import { QuarterlyTimeline } from '../charts/QuarterlyTimeline'

export function TimelineView({
  initiatives,
  focusQuarter,
}: {
  initiatives: Initiative[]
  focusQuarter: Quarter | 'All'
}) {
  const { quarter } = getCurrentQuarterInfo()

  return (
    <Card className="p-0">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Quarterly milestone timeline</div>
        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Status markers by quarter. Overdue milestones render in red.
        </div>
      </div>
      <div className="p-4">
        <QuarterlyTimeline initiatives={initiatives} focusQuarter={focusQuarter} currentQuarter={quarter} />
      </div>
    </Card>
  )
}

