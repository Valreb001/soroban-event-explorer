import { Network } from '@/types'

export async function getFreighterNetwork(): Promise<Network | null> {
  try {
    const { getNetworkDetails } = await import('@stellar/freighter-api')
    const details = await getNetworkDetails()
    const name = details.networkPassphrase
    if (name.includes('testnet') || name.includes('Test')) return 'testnet'
    if (name.includes('futurenet') || name.includes('Future')) return 'futurenet'
    return 'mainnet'
  } catch {
    return null
  }
}

export async function getFreighterPublicKey(): Promise<string | null> {
  try {
    const { getPublicKey } = await import('@stellar/freighter-api')
    return await getPublicKey()
  } catch {
    return null
  }
}

export async function isFreighterConnected(): Promise<boolean> {
  try {
    const { isConnected } = await import('@stellar/freighter-api')
    const result = await isConnected()
    return typeof result === 'boolean' ? result : (result as { isConnected: boolean }).isConnected
  } catch {
    return false
  }
}
