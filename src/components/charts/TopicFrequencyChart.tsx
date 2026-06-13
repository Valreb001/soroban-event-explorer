'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SorobanEvent } from '@/types'

export function TopicFrequencyChart({ events }: { events: SorobanEvent[] }) {
  const freq: Record<string, number> = {}
  events.forEach(e => {
    const first = e.topics[0]?.decoded
    if (first) freq[first] = (freq[first] || 0) + 1
  })

  const data = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([topic, count]) => ({ topic: topic.length > 16 ? topic.slice(0, 16) + '…' : topic, count }))

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Top Topics</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} />
          <YAxis dataKey="topic" type="category" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} width={80} />
          <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8 }} />
          <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
