import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Status } from '../../types/initiative'
import { getStatusTone } from '../../utils/statusCalculations'

const toneColor: Record<ReturnType<typeof getStatusTone>, string> = {
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  grey: '#9ca3af',
  blue: '#3b82f6',
}

export function StatusDonut({
  breakdown,
}: {
  breakdown: Array<{ status: Status; count: number }>
}) {
  const data = breakdown
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: d.status,
      value: d.count,
      fill: toneColor[getStatusTone(d.status)],
    }))

  return (
    <div className="h-28 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={34}
            outerRadius={52}
            paddingAngle={2}
            stroke="rgba(0,0,0,0)"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: '1px solid rgba(148,163,184,0.35)',
              background: 'rgba(15,23,42,0.95)',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

