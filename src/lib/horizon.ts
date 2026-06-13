import { Network } from '@/types'
import { NETWORK_CONFIG } from '@/constants'

export async function getContractCreationLedger(
  contractId: string,
  network: Network
): Promise<number | null> {
  try {
    const base = NETWORK_CONFIG[network].horizon
    const res = await fetch(`${base}/contracts/${contractId}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.ledger ?? null
  } catch {
    return null
  }
}
