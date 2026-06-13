'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { fetchEventActivity } from '@/lib/soroban'
import { Network } from '@/types'
import { Spinner } from '@/components/ui/Spinner'

const RANGES = [7, 30, 90] as const

export function EventActivityChart({ contractId, network }: { contractId: string; network: Network }) {
  const [days, setDays] = useState<typeof RANGES[number]>(30)
  const [data, setData] = useState<{ date: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetchEventActivity(contractId, network, days)
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setIsLoading(false))
  }, [contractId, network, days])

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Event Activity</h3>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setDays(r)}
              className={`px-2 py-1 text-xs rounded transition-colors ${days === r ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner className="h-6 w-6 text-blue-400" /></div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8 }} labelStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
