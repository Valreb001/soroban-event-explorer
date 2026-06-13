'use client'
import { SearchHistoryEntry } from '@/types'
import { truncateAddress, formatRelativeTime } from '@/lib/format'
import Link from 'next/link'

interface Props {
  history: SearchHistoryEntry[]
  onRemove: (contractId: string) => void
  onClear: () => void
}

export function SearchHistory({ history, onRemove, onClear }: Props) {
  if (history.length === 0) return null

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-xs uppercase tracking-wider">Recent Searches</p>
        <button onClick={onClear} className="text-xs text-gray-500 hover:text-white transition-colors">
          Clear all
        </button>
      </div>
      <div className="space-y-1">
        {history.map(entry => (
          <div key={entry.contractId} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2 group">
            <Link
              href={`/contract/${entry.contractId}?network=${entry.network}`}
              className="flex-1 flex items-center gap-3 min-w-0"
            >
              <span className="font-mono text-sm text-blue-400 truncate">{truncateAddress(entry.contractId)}</span>
              <span className="text-xs text-gray-500 capitalize shrink-0">{entry.network}</span>
              <span className="text-xs text-gray-600 shrink-0">{formatRelativeTime(entry.lastSearched)}</span>
            </Link>
            <button
              onClick={() => onRemove(entry.contractId)}
              className="text-gray-600 hover:text-red-400 text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
