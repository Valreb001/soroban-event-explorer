'use client'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { ContractCard } from '@/components/contract/ContractCard'
import { EventTable } from '@/components/events/EventTable'
import { EventFilter } from '@/components/events/EventFilter'
import { EventActivityChart } from '@/components/charts/EventActivityChart'
import { EventTypeChart } from '@/components/charts/EventTypeChart'
import { TopicFrequencyChart } from '@/components/charts/TopicFrequencyChart'
import { JsonViewer } from '@/components/ui/JsonViewer'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useEvents } from '@/hooks/useEvents'
import { useContract } from '@/hooks/useContract'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { isValidContractId } from '@/lib/decoder'
import { exportEventsToCSV } from '@/lib/csv'
import { Network } from '@/types'
import { DEFAULT_NETWORK } from '@/constants'
import clsx from 'clsx'

type Tab = 'events' | 'charts' | 'raw'

export default function ContractPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const network = (searchParams.get('network') as Network) || DEFAULT_NETWORK
  const [tab, setTab] = useState<Tab>('events')
  const { addToHistory } = useSearchHistory()

  const contractId = id || ''
  const isValid = isValidContractId(contractId)

  const { events, isLoading, error, loadMore, hasMore, filters, setFilters, refetch } = useEvents(
    isValid ? contractId : '',
    network
  )
  const { stats, isLoading: statsLoading } = useContract(isValid ? contractId : '', network)

  useEffect(() => {
    if (isValid) addToHistory(contractId, network)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, network])

  if (!isValid) {
    return <ErrorState message="Invalid Contract ID format. Contract IDs start with 'C' and are 56 characters long." />
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'events', label: `Events${events.length > 0 ? ` (${events.length})` : ''}` },
    { id: 'charts', label: 'Charts' },
    { id: 'raw', label: 'Raw' },
  ]

  return (
    <div className="space-y-6">
      <ContractCard contractId={contractId} stats={stats} isLoading={statsLoading} network={network} />

      <div className="flex items-center justify-between border-b border-gray-800">
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                tab === t.id
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'events' && events.length > 0 && (
          <button
            onClick={() => exportEventsToCSV(events, contractId)}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 pb-2"
          >
            ↓ Export CSV
          </button>
        )}
      </div>

      {error && <ErrorState message={error} />}

      {tab === 'events' && !error && (
        <div className="space-y-4">
          <EventFilter filters={filters} onChange={setFilters} />
          <EventTable
            events={events}
            network={network}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>
      )}

      {tab === 'charts' && (
        statsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <EventActivityChart contractId={contractId} network={network} />
            </div>
            <EventTypeChart stats={stats} />
            <TopicFrequencyChart events={events} />
          </div>
        ) : (
          <EmptyState title="No chart data available" description="No events found to generate charts." />
        )
      )}

      {tab === 'raw' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Last {Math.min(events.length, 10)} events — raw JSON</p>
          {events.length === 0 && isLoading
            ? <Skeleton className="h-64 w-full" />
            : <JsonViewer data={events.slice(0, 10)} />
          }
        </div>
      )}
    </div>
  )
}
