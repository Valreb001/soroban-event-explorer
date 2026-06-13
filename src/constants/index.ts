import { Network } from '@/types'

export const NETWORK_CONFIG: Record<Network, { rpc: string; horizon: string; label: string }> = {
  mainnet: {
    rpc: process.env.NEXT_PUBLIC_SOROBAN_RPC_MAINNET || 'https://mainnet.stellar.validationcloud.io/v1/json-rpc',
    horizon: process.env.NEXT_PUBLIC_HORIZON_MAINNET || 'https://horizon.stellar.org',
    label: 'Mainnet',
  },
  testnet: {
    rpc: process.env.NEXT_PUBLIC_SOROBAN_RPC_TESTNET || 'https://soroban-testnet.stellar.org',
    horizon: process.env.NEXT_PUBLIC_HORIZON_TESTNET || 'https://horizon-testnet.stellar.org',
    label: 'Testnet',
  },
  futurenet: {
    rpc: 'https://rpc-futurenet.stellar.org',
    horizon: 'https://horizon-futurenet.stellar.org',
    label: 'Futurenet',
  },
}

export const DEFAULT_NETWORK: Network =
  (process.env.NEXT_PUBLIC_DEFAULT_NETWORK as Network) || 'testnet'

export const STELLAR_EXPERT_BASE: Record<Network, string> = {
  mainnet: 'https://stellar.expert/explorer/public',
  testnet: 'https://stellar.expert/explorer/testnet',
  futurenet: 'https://stellar.expert/explorer/futurenet',
}

export const EXAMPLE_TESTNET_CONTRACT = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'

export const DEFAULT_PAGE_LIMIT = 20
export const MAX_SEARCH_HISTORY = 10
