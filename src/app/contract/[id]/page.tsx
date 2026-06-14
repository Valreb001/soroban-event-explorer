'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
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
import { exportEventsToJSON } from '@/lib/csv'
import { Network, EventFilters, EventType } from '@/types'
import { DEFAULT_NETWORK } from '@/constants'
import clsx from 'clsx'

type Tab = 'events' | 'charts' | 'raw'

export default function ContractPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const network = (searchParams.get('network') as Network) || DEFAULT_NETWORK
  const [tab, setTab] = useState<Tab>('events')
  const [copied, setCopied] = useState(false)
  const { addToHistory } = useSearchHistory()

  const contractId = id || ''
  const isValid = isValidContractId(contractId)

  // Derive initial filters from URL params (lazy — read once on mount)
  const [initialFilters] = useState<Partial<EventFilters>>(() => ({
    eventType: (searchParams.get('type') as EventType | 'all') ?? 'all',
    topic: searchParams.get('topic') ?? '',
    dateFrom: searchParams.get('dateFrom') ?? null,
    dateTo: searchParams.get('dateTo') ?? null,
    ledgerFrom: searchParams.get('ledgerFrom') ? Number(searchParams.get('ledgerFrom')) : null,
    ledgerTo: searchParams.get('ledgerTo') ? Number(searchParams.get('ledgerTo')) : null,
    onlySuccessful: searchParams.get('successful') === 'true',
  }))

  const {
    events,
    isLoading,
    error,
    loadMore,
    hasMore,
    filters,
    setFilters,
    refetch,
    liveMode,
    setLiveMode,
    pendingCount,
    flushPending,
  } = useEvents(isValid ? contractId : '', network, initialFilters)

  const { stats, isLoading: statsLoading } = useContract(isValid ? contractId : '', network)

  useEffect(() => {
    if (isValid) addToHistory(contractId, network)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, network])

  // Sync filters to URL so the view is shareable
  useEffect(() => {
    if (!isValid) return
    const params = new URLSearchParams({ network })
    if (filters.eventType !== 'all') params.set('type', filters.eventType)
    if (filters.topic) params.set('topic', filters.topic)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.ledgerFrom) params.set('ledgerFrom', String(filters.ledgerFrom))
    if (filters.ledgerTo) params.set('ledgerTo', String(filters.ledgerTo))
    if (filters.onlySuccessful) params.set('successful', 'true')
    router.replace(`/contract/${contractId}?${params.toString()}`, { scroll: false })
  }, [filters, network, contractId, isValid])

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }, [])

  if (!isValid) {
    return <ErrorState message="Invalid Contract ID format. Contract IDs start with 'C' and are 56 characters long." />
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'events', label: `Events${events.length > 0 ? ` (${events.length})` : ''}` },
    { id: 'charts', label: 'Charts' },
    { id: 'raw', label: 'Raw JSON' },
  ]

  return (
    <div className="space-y-6">
      <ContractCard contractId={contractId} stats={stats} isLoading={statsLoading} network={network} />

      {/* Tab bar row */}
      <div className="flex items-center justify-between border-b border-gray-800 gap-3 flex-wrap">
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

        <div className="flex items-center gap-2 pb-1">
          {/* Live mode toggle */}
          <button
            onClick={() => setLiveMode(v => !v)}
            className={clsx(
              'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors',
              liveMode
                ? 'bg-green-900/40 border-green-700 text-green-300'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
            )}
          >
            <span className={clsx('h-1.5 w-1.5 rounded-full', liveMode ? 'bg-green-400 animate-pulse' : 'bg-gray-600')} />
            {liveMode ? 'Live' : 'Go Live'}
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="text-xs px-3 py-1.5 rounded-lg border bg-gray-800 border-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            {copied ? '✓ Copied' : 'Share Link'}
          </button>

          {/* Export buttons */}
          {events.length > 0 && (
            <>
              <button
                onClick={() => exportEventsToCSV(events, contractId)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                ↓ CSV
              </button>
              <button
                onClick={() => exportEventsToJSON(events, contractId)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                ↓ JSON
              </button>
            </>
          )}
        </div>
      </div>

      {tab === 'events' && (
        <div className="space-y-4">
          <EventFilter filters={filters} onChange={setFilters} />

          {/* Error banner — shown inline so existing events stay visible */}
          {error && events.length > 0 && (
            <div className="text-sm text-amber-300 bg-amber-900/20 border border-amber-700/40 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
          {error && events.length === 0 && <ErrorState message={error} />}

          {/* Pending events banner */}
          {pendingCount > 0 && (
            <button
              onClick={flushPending}
              className="w-full text-sm py-2 rounded-lg bg-blue-900/30 border border-blue-700/50 text-blue-300 hover:bg-blue-900/50 transition-colors"
            >
              ▲ {pendingCount} new event{pendingCount !== 1 ? 's' : ''} — click to show
            </button>
          )}

          {!error || events.length > 0 ? (
            <EventTable
              events={events}
              network={network}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          ) : null}
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
          <p className="text-xs text-gray-500">
            {events.length > 0 ? `Showing ${Math.min(events.length, 50)} of ${events.length} loaded events` : 'No events loaded'}
          </p>
          {events.length === 0 && isLoading
            ? <Skeleton className="h-64 w-full" />
            : <JsonViewer data={events.slice(0, 50)} />
          }
        </div>
      )}
    </div>
  )
}
