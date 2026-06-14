'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { SorobanEvent } from '@/types'
import { EXAMPLE_TESTNET_CONTRACT } from '@/constants'
import { matchSignature, CATEGORY_STYLES } from '@/lib/signatures'
import { formatRelativeTime } from '@/lib/format'

export function LiveEventFeed() {
  const [events, setEvents] = useState<SorobanEvent[]>([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const seenRef = useRef<Set<string>>(new Set())

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/events?contractId=${EXAMPLE_TESTNET_CONTRACT}&network=testnet&limit=8`)
      if (!res.ok) return
      const data: { events: SorobanEvent[] } = await res.json()
      if (data.events.length > 0) {
        setConnected(true)
        setLoading(false)
        const fresh = data.events.filter(e => !seenRef.current.has(e.id))
        fresh.forEach(e => seenRef.current.add(e.id))
        if (fresh.length > 0) {
          setEvents(prev => [...fresh, ...prev].slice(0, 8))
        }
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    const id = setInterval(fetchEvents, 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-sm font-medium text-gray-300">
            {loading ? 'Connecting to Testnet…' : connected ? 'Live Events · Testnet' : 'No recent events'}
          </span>
        </div>
        <Link
          href={`/contract/${EXAMPLE_TESTNET_CONTRACT}?network=testnet`}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Explore this contract →
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {events.length === 0 ? (
          <div className="px-4 py-10 flex flex-col items-center gap-2 text-gray-600">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-gray-700 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <span className="text-xs">Fetching live events…</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/60">
            {events.map((event, i) => {
              const sig = matchSignature(event.topics)
              const label = sig ? sig.label : event.type
              const style = sig ? CATEGORY_STYLES[sig.category] : 'bg-gray-800 text-gray-400 border-gray-700'
              return (
                <div
                  key={event.id}
                  className={`px-4 py-2.5 flex items-center gap-3 text-xs ${i === 0 ? 'bg-blue-950/20' : ''}`}
                >
                  <span className={`shrink-0 px-1.5 py-0.5 rounded border font-medium ${style}`}>
                    {label}
                  </span>
                  <span className="text-gray-300 font-mono truncate flex-1">
                    {event.topics.map(t => t.decoded).join(' · ') || '—'}
                  </span>
                  <span className="text-gray-600 shrink-0 tabular-nums">
                    {formatRelativeTime(event.ledgerClosedAt)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
