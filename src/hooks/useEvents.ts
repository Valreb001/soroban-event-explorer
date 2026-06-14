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

export function useEvents(contractId: string, network: Network, initialFilters?: Partial<EventFilters>) {
  const [events, setEvents] = useState<SorobanEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState<EventFilters>({ ...DEFAULT_FILTERS, ...initialFilters })
  const [liveMode, setLiveMode] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const cursorRef = useRef<string | undefined>(undefined)
  const seenIdsRef = useRef<Set<string>>(new Set())
  const pendingRef = useRef<SorobanEvent[]>([])

  const load = useCallback(async (reset: boolean) => {
    if (!contractId) return
    setIsLoading(true)
    setError(null)
    try {
      const cursor = reset ? undefined : cursorRef.current
      const res = await fetch(buildQuery(contractId, network, filters, cursor))
      if (!res.ok) throw new Error('API error')
      const data: { events: SorobanEvent[]; nextCursor: string | null } = await res.json()
      setEvents(prev => {
        const next = reset ? data.events : [...prev, ...data.events]
        next.forEach(e => seenIdsRef.current.add(e.id))
        return next
      })
      cursorRef.current = data.nextCursor ?? undefined
      setHasMore(data.nextCursor !== null)
    } catch {
      if (reset) {
        setError('Failed to fetch events. The RPC may be unavailable — try again in a moment.')
      } else {
        // Load-more failure: keep existing events, just stop paginating
        setHasMore(false)
        setError('Could not load more events — the cursor may have expired. Try refreshing.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [contractId, network, filters])

  useEffect(() => {
    cursorRef.current = undefined
    seenIdsRef.current = new Set()
    pendingRef.current = []
    setPendingCount(0)
    if (contractId) load(true)
  }, [contractId, network, filters])

  // Live polling — check for new events every 5s
  useEffect(() => {
    if (!liveMode || !contractId) return
    const poll = async () => {
      try {
        const res = await fetch(buildQuery(contractId, network, filters))
        if (!res.ok) return
        const data: { events: SorobanEvent[] } = await res.json()
        const fresh = data.events.filter(e => !seenIdsRef.current.has(e.id))
        if (fresh.length > 0) {
          fresh.forEach(e => seenIdsRef.current.add(e.id))
          pendingRef.current = [...fresh, ...pendingRef.current]
          setPendingCount(pendingRef.current.length)
        }
      } catch {}
    }
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [liveMode, contractId, network, filters])

  const flushPending = useCallback(() => {
    setEvents(prev => [...pendingRef.current, ...prev])
    pendingRef.current = []
    setPendingCount(0)
  }, [])

  const loadMore = useCallback(() => load(false), [load])

  const refetch = useCallback(() => {
    cursorRef.current = undefined
    seenIdsRef.current = new Set()
    pendingRef.current = []
    setPendingCount(0)
    load(true)
  }, [load])

  return {
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
  }
}
