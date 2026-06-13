import { rpc } from '@stellar/stellar-sdk'
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
  const topics = (raw.topic || []).map(decodeTopic)
  const value = raw.value ? decodeValue(raw.value) : { raw: '', decoded: '', type: 'Void' }
  return {
    id: raw.id,
    contractId: raw.contractId || '',
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
  try {
    const latest = await server.getLatestLedger()
    // ~7 days back: ledger closes every ~5s, 17280 ledgers/day
    return Math.max(1, latest.sequence - 17280 * 7)
  } catch {
    return 1
  }
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
