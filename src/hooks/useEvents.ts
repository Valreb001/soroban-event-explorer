'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { SorobanEvent, EventFilters, Network } from '@/types'
import { fetchContractEvents } from '@/lib/soroban'

const DEFAULT_FILTERS: EventFilters = {
  eventType: 'all',
  topic: '',
  dateFrom: null,
  dateTo: null,
  ledgerFrom: null,
  ledgerTo: null,
  onlySuccessful: false,
}

export function useEvents(contractId: string, network: Network) {
  const [events, setEvents] = useState<SorobanEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS)
  const cursorRef = useRef<string | undefined>(undefined)

  const fetch = useCallback(async (reset: boolean) => {
    if (!contractId) return
    setIsLoading(true)
    setError(null)
    try {
      const currentCursor = reset ? undefined : cursorRef.current
      const { events: newEvents, nextCursor } = await fetchContractEvents(
        contractId,
        network,
        filters,
        currentCursor
      )
      setEvents(prev => reset ? newEvents : [...prev, ...newEvents])
      cursorRef.current = nextCursor ?? undefined
      setCursor(nextCursor ?? undefined)
      setHasMore(nextCursor !== null)
    } catch {
      setError('Failed to fetch events. Please check the contract ID and try again.')
    } finally {
      setIsLoading(false)
    }
  }, [contractId, network, filters])

  useEffect(() => {
    cursorRef.current = undefined
    if (contractId) fetch(true)
  }, [contractId, network, filters])

  const loadMore = useCallback(() => fetch(false), [fetch])
  const refetch = useCallback(() => {
    cursorRef.current = undefined
    fetch(true)
  }, [fetch])

  return { events, isLoading, error, loadMore, hasMore, filters, setFilters, refetch }
}
