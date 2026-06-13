'use client'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { SorobanEvent, Network } from '@/types'
import { fetchEventById } from '@/lib/soroban'
import { EventDetail } from '@/components/events/EventDetail'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { DEFAULT_NETWORK } from '@/constants'
import Link from 'next/link'

export default function EventPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const network = (searchParams.get('network') as Network) || DEFAULT_NETWORK
  const contractId = searchParams.get('contractId') || ''

  const [event, setEvent] = useState<SorobanEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    fetchEventById(id, network)
      .then(e => {
        if (!e) setError('Event not found. It may have been pruned from the RPC or the ID is invalid.')
        else setEvent(e)
      })
      .catch(() => setError('Failed to load event details. Please try again.'))
      .finally(() => setIsLoading(false))
  }, [id, network])

  const backHref = contractId
    ? `/contract/${contractId}?network=${network}`
    : `/explorer`

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href={backHref} className="text-sm text-blue-400 hover:underline inline-flex items-center gap-1">
        ← {contractId ? 'Back to contract' : 'Back to explorer'}
      </Link>

      <h1 className="text-xl font-bold text-white">Event Detail</h1>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
      {!isLoading && error && <ErrorState message={error} />}
      {!isLoading && event && <EventDetail event={event} network={network} />}
    </div>
  )
}
