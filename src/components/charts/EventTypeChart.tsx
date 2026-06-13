'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ContractStats } from '@/types'

const COLORS = { contract: '#3B82F6', system: '#8B5CF6', diagnostic: '#F59E0B' }

export function EventTypeChart({ stats }: { stats: ContractStats }) {
  const data = [
    { name: 'Contract', value: stats.eventTypeBreakdown.contract, color: COLORS.contract },
    { name: 'System', value: stats.eventTypeBreakdown.system, color: COLORS.system },
    { name: 'Diagnostic', value: stats.eventTypeBreakdown.diagnostic, color: COLORS.diagnostic },
  ].filter(d => d.value > 0)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Event Type Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8 }} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
