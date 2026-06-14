import { SorobanEvent } from '@/types'

export function exportEventsToJSON(events: SorobanEvent[], contractId: string): void {
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `soroban-events-${contractId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportEventsToCSV(events: SorobanEvent[], contractId: string): void {
  const headers = ['ID', 'Type', 'Ledger', 'Timestamp', 'Tx Hash', 'Topics', 'Value', 'Successful']

  const rows = events.map(e => [
    e.id,
    e.type,
    e.ledger,
    e.ledgerClosedAt,
    e.txHash,
    e.topics.map(t => t.decoded).join(' | '),
    e.value.decoded,
    e.inSuccessfulContractCall,
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `soroban-events-${contractId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
