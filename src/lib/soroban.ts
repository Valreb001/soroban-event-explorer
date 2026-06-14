import { rpc, StrKey } from '@stellar/stellar-sdk'
import { Network, SorobanEvent, EventFilters, ContractStats, EventType } from '@/types'
import { NETWORK_CONFIG, DEFAULT_PAGE_LIMIT } from '@/constants'
import { decodeTopic, decodeValue } from './decoder'

export function getSorobanServer(network: Network): rpc.Server {
  const url = NETWORK_CONFIG[network].rpc
  return new rpc.Server(url, { allowHttp: url.startsWith('http://') })
}

function parseEventType(type: string): EventType {
  if (type === 'contract' || type === 'system' || type === 'diagnostic') return type
  return 'contract'
}

function mapRawEvent(raw: rpc.Api.RawEventResponse): SorobanEvent {
  const topics = (raw.topic || []).map((t: unknown) => {
    // SDK v15 returns already-parsed xdr.ScVal objects, not base64 strings
    if (typeof t === 'string') return decodeTopic(t)
    try {
      const xdrVal = t as import('@stellar/stellar-sdk').xdr.ScVal
      const base64 = xdrVal.toXDR('base64')
      return decodeTopic(base64)
    } catch {
      return { raw: String(t), decoded: String(t), type: 'Unknown' }
    }
  })

  let value = { raw: '', decoded: '', type: 'Void' }
  if (raw.value) {
    if (typeof raw.value === 'string') {
      value = decodeValue(raw.value)
    } else {
      try {
        const xdrVal = raw.value as import('@stellar/stellar-sdk').xdr.ScVal
        const base64 = xdrVal.toXDR('base64')
        value = decodeValue(base64)
      } catch {
        value = { raw: String(raw.value), decoded: String(raw.value), type: 'Unknown' }
      }
    }
  }

  // contractId may be an object with _id buffer in v15
  let contractId = ''
  if (typeof raw.contractId === 'string') {
    contractId = raw.contractId
  } else if (raw.contractId) {
    try {
      const idObj = raw.contractId as { _id?: { data?: number[] } }
      if (idObj._id?.data) {
        contractId = StrKey.encodeContract(Buffer.from(idObj._id.data))
      }
    } catch {
      contractId = ''
    }
  }

  return {
    id: raw.id,
    contractId,
    type: parseEventType(raw.type),
    ledger: raw.ledger,
    ledgerClosedAt: raw.ledgerClosedAt,
    txHash: raw.txHash,
    topics,
    value,
    inSuccessfulContractCall: raw.inSuccessfulContractCall,
  }
}

async function getStartLedger(server: rpc.Server, ledgerFrom?: number | null): Promise<number> {
  if (ledgerFrom && ledgerFrom > 0) return ledgerFrom
  // Let this throw — falling back to ledger 1 causes timeouts since the RPC
  // only retains ~7 days of history and scanning from 1 is unbounded.
  const latest = await server.getLatestLedger()
  return Math.max(1, latest.sequence - 110000)
}

export async function fetchContractEvents(
  contractId: string,
  network: Network,
  filters?: Partial<EventFilters>,
  cursor?: string,
  limit: number = DEFAULT_PAGE_LIMIT
): Promise<{ events: SorobanEvent[]; nextCursor: string | null }> {
  const server = getSorobanServer(network)
  const startLedger = cursor ? undefined : await getStartLedger(server, filters?.ledgerFrom)

  const request: rpc.Server.GetEventsRequest = {
    ...(cursor ? {} : { startLedger }),
    filters: [
      {
        type: filters?.eventType && filters.eventType !== 'all' ? filters.eventType : undefined,
        contractIds: [contractId],
        topics: filters?.topic ? [[filters.topic]] : undefined,
      },
    ],
    cursor,
    limit,
  }

  const response = await server.getEvents(request)
  const events = (response.events || []).map(mapRawEvent)

  let filtered = events
  if (filters?.onlySuccessful) filtered = filtered.filter(e => e.inSuccessfulContractCall)
  if (filters?.dateFrom) filtered = filtered.filter(e => e.ledgerClosedAt >= filters.dateFrom!)
  if (filters?.dateTo) filtered = filtered.filter(e => e.ledgerClosedAt <= filters.dateTo!)
  if (filters?.ledgerTo) filtered = filtered.filter(e => e.ledger <= filters.ledgerTo!)

  const lastEvent = response.events?.[response.events.length - 1]
  const nextCursor = lastEvent && response.events.length === limit ? lastEvent.id : null

  return { events: filtered, nextCursor }
}

export async function fetchEventById(
  eventId: string,
  network: Network
): Promise<SorobanEvent | null> {
  const server = getSorobanServer(network)
  try {
    const ledgerNum = parseInt(eventId.split('-')[0], 10)
    if (isNaN(ledgerNum)) return null
    const response = await server.getEvents({
      startLedger: ledgerNum,
      filters: [{}],
      limit: 100,
    })
    const match = (response.events || []).find(e => e.id === eventId)
    return match ? mapRawEvent(match) : null
  } catch {
    return null
  }
}

export async function fetchContractStats(
  contractId: string,
  network: Network
): Promise<ContractStats> {
  const server = getSorobanServer(network)
  const startLedger = await getStartLedger(server, null)

  const response = await server.getEvents({
    startLedger,
    filters: [{ contractIds: [contractId] }],
    limit: 200,
  })
  const events = (response.events || []).map(mapRawEvent)

  const uniqueTopics = new Set(events.flatMap(e => e.topics.map(t => t.decoded))).size
  const timestamps = events.map(e => e.ledgerClosedAt).sort()

  return {
    contractId,
    network,
    totalEvents: events.length,
    uniqueTopics,
    firstEventAt: timestamps[0] || null,
    lastEventAt: timestamps[timestamps.length - 1] || null,
    eventTypeBreakdown: {
      contract: events.filter(e => e.type === 'contract').length,
      system: events.filter(e => e.type === 'system').length,
      diagnostic: events.filter(e => e.type === 'diagnostic').length,
    },
  }
}

export async function fetchEventActivity(
  contractId: string,
  network: Network,
  days: number
): Promise<{ date: string; count: number }[]> {
  const server = getSorobanServer(network)
  const startLedger = await getStartLedger(server, null)

  const response = await server.getEvents({
    startLedger,
    filters: [{ contractIds: [contractId] }],
    limit: 200,
  })
  const events = (response.events || []).map(mapRawEvent)

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const countMap: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    countMap[d.toISOString().slice(0, 10)] = 0
  }

  events
    .filter(e => new Date(e.ledgerClosedAt) >= cutoff)
    .forEach(e => {
      const day = e.ledgerClosedAt.slice(0, 10)
      if (day in countMap) countMap[day]++
    })

  return Object.entries(countMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}
