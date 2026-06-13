'use client'
import { SorobanEvent, Network } from '@/types'
import { EventRow } from './EventRow'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { EventRowSkeleton } from '@/components/ui/Skeleton'

interface Props {
  events: SorobanEvent[]
  network: Network
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function EventTable({ events, network, isLoading, hasMore, onLoadMore }: Props) {
  const showSkeleton = isLoading && events.length === 0

  if (!isLoading && events.length === 0) {
    return <EmptyState title="No events found" description="This contract has no events matching your filters." />
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Topics</th>
              <th className="px-4 py-3">Ledger</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Tx Hash</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton
              ? [...Array(5)].map((_, i) => <EventRowSkeleton key={i} />)
              : events.map(event => <EventRow key={event.id} event={event} network={network} />)
            }
          </tbody>
        </table>
      </div>

      {!showSkeleton && (isLoading || hasMore) && (
        <div className="flex justify-center mt-6">
          {isLoading ? (
            <Spinner className="h-6 w-6 text-blue-400" />
          ) : (
            <button
              onClick={onLoadMore}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-700 transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  )
}
