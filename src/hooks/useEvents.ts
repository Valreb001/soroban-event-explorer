'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { SorobanEvent, EventFilters, Network } from '@/types'

const DEFAULT_FILTERS: EventFilters = {
  eventType: 'all',
  topic: '',
  dateFrom: null,
  dateTo: null,
  ledgerFrom: null,
  ledgerTo: null,
  onlySuccessful: false,
}

function buildQuery(contractId: string, network: Network, filters: EventFilters, cursor?: string): string {
  const params = new URLSearchParams({ contractId, network })
  if (cursor) params.set('cursor', cursor)
  if (filters.eventType !== 'all') params.set('eventType', filters.eventType)
  if (filters.topic) params.set('topic', filters.topic)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  if (filters.ledgerFrom) params.set('ledgerFrom', String(filters.ledgerFrom))
  if (filters.ledgerTo) params.set('ledgerTo', String(filters.ledgerTo))
  if (filters.onlySuccessful) params.set('onlySuccessful', 'true')
  return `/api/events?${params.toString()}`
}

export function useEvents(contractId: string, network: Network) {
  const [events, setEvents] = useState<SorobanEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS)
  const cursorRef = useRef<string | undefined>(undefined)

  const load = useCallback(async (reset: boolean) => {
    if (!contractId) return
    setIsLoading(true)
    setError(null)
    try {
      const cursor = reset ? undefined : cursorRef.current
      const res = await fetch(buildQuery(contractId, network, filters, cursor))
      if (!res.ok) throw new Error('API error')
      const data: { events: SorobanEvent[]; nextCursor: string | null } = await res.json()
      setEvents(prev => reset ? data.events : [...prev, ...data.events])
      cursorRef.current = data.nextCursor ?? undefined
      setHasMore(data.nextCursor !== null)
    } catch {
      setError('Failed to fetch events. Please check the contract ID and try again.')
    } finally {
      setIsLoading(false)
    }
  }, [contractId, network, filters])

  useEffect(() => {
    cursorRef.current = undefined
    if (contractId) load(true)
  }, [contractId, network, filters])

  const loadMore = useCallback(() => load(false), [load])
  const refetch = useCallback(() => { cursorRef.current = undefined; load(true) }, [load])

  return { events, isLoading, error, loadMore, hasMore, filters, setFilters, refetch }
}
