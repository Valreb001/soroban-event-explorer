'use client'
import { useState, useEffect } from 'react'
import { SearchHistoryEntry, Network } from '@/types'
import { MAX_SEARCH_HISTORY } from '@/constants'

const STORAGE_KEY = 'soroban-search-history'

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  const persist = (entries: SearchHistoryEntry[]) => {
    setHistory(entries)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) } catch {}
  }

  const addToHistory = (contractId: string, network: Network) => {
    const entry: SearchHistoryEntry = { contractId, network, lastSearched: new Date().toISOString() }
    const filtered = history.filter(h => h.contractId !== contractId)
    persist([entry, ...filtered].slice(0, MAX_SEARCH_HISTORY))
  }

  const removeFromHistory = (contractId: string) => {
    persist(history.filter(h => h.contractId !== contractId))
  }

  const clearHistory = () => persist([])

  return { history, addToHistory, clearHistory, removeFromHistory }
}
