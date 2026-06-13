export type Network = 'mainnet' | 'testnet' | 'futurenet'

export type EventType = 'contract' | 'system' | 'diagnostic'

export interface DecodedTopic {
  raw: string
  decoded: string
  type: string
}

export interface DecodedValue {
  raw: string
  decoded: string
  type: string
}

export interface SorobanEvent {
  id: string
  contractId: string
  type: EventType
  ledger: number
  ledgerClosedAt: string
  txHash: string
  topics: DecodedTopic[]
  value: DecodedValue
  inSuccessfulContractCall: boolean
}

export interface ContractStats {
  contractId: string
  network: Network
  totalEvents: number
  uniqueTopics: number
  firstEventAt: string | null
  lastEventAt: string | null
  eventTypeBreakdown: {
    contract: number
    system: number
    diagnostic: number
  }
}

export interface EventFilters {
  eventType: EventType | 'all'
  topic: string
  dateFrom: string | null
  dateTo: string | null
  ledgerFrom: number | null
  ledgerTo: number | null
  onlySuccessful: boolean
}

export interface SearchHistoryEntry {
  contractId: string
  network: Network
  lastSearched: string
}
