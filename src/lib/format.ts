import { formatDistanceToNow, format } from 'date-fns'

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatTimestamp(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy HH:mm:ss')
  } catch {
    return iso
  }
}

export function formatRelativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return iso
  }
}

export function formatLedger(ledger: number): string {
  return ledger.toLocaleString()
}
