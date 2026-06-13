import { ContractStats as IContractStats } from '@/types'
import { formatRelativeTime, formatTimestamp } from '@/lib/format'

export function ContractStats({ stats }: { stats: IContractStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Total Events', value: stats.totalEvents.toLocaleString() },
        { label: 'Unique Topics', value: stats.uniqueTopics.toLocaleString() },
        {
          label: 'First Event',
          value: stats.firstEventAt
            ? <span title={formatTimestamp(stats.firstEventAt)} className="cursor-help">{formatRelativeTime(stats.firstEventAt)}</span>
            : '—'
        },
        {
          label: 'Last Event',
          value: stats.lastEventAt
            ? <span title={formatTimestamp(stats.lastEventAt)} className="cursor-help">{formatRelativeTime(stats.lastEventAt)}</span>
            : '—'
        },
      ].map(({ label, value }) => (
        <div key={label} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">{label}</p>
          <p className="text-white font-semibold text-sm">{value}</p>
        </div>
      ))}
    </div>
  )
}
