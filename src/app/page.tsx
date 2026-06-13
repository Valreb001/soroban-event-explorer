'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ContractSearch } from '@/components/search/ContractSearch'
import { SearchHistory } from '@/components/search/SearchHistory'
import { NetworkSelector } from '@/components/wallet/NetworkSelector'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { Network } from '@/types'
import { DEFAULT_NETWORK, EXAMPLE_TESTNET_CONTRACT } from '@/constants'

const FEATURES = [
  { icon: '⚡', title: 'Real-time Indexing', desc: 'Fetch events directly from Soroban RPC as they happen.' },
  { icon: '🔍', title: 'XDR Topic Decoding', desc: 'Raw XDR values decoded to human-readable format automatically.' },
  { icon: '📊', title: 'Event Activity Charts', desc: 'Visualize event patterns over time with interactive charts.' },
  { icon: '🌐', title: 'Multi-network Support', desc: 'Switch between Mainnet, Testnet, and Futurenet seamlessly.' },
]

export default function HomePage() {
  const [network, setNetwork] = useState<Network>(DEFAULT_NETWORK)
  const router = useRouter()
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()

  const handleSearch = (contractId: string) => {
    addToHistory(contractId, network)
    router.push(`/contract/${contractId}?network=${network}`)
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex flex-col items-center text-center gap-6 pt-12 max-w-2xl w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-800 text-blue-300 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Live on Stellar Testnet
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Explore Soroban Contract<br />
          <span className="text-blue-400">Events in Real Time</span>
        </h1>

        <p className="text-gray-400 text-lg">
          Paste a Contract ID and instantly see all emitted events — decoded, filterable, and visualized.
        </p>

        <div className="w-full space-y-3">
          <div className="flex justify-end">
            <NetworkSelector value={network} onChange={setNetwork} />
          </div>
          <ContractSearch network={network} onSearch={handleSearch} autoFocus />
          <button
            onClick={() => handleSearch(EXAMPLE_TESTNET_CONTRACT)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
          >
            Try an example testnet contract →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {FEATURES.map(f => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-xs text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-2xl">
          <SearchHistory history={history} onRemove={removeFromHistory} onClear={clearHistory} />
        </div>
      )}
    </div>
  )
}
