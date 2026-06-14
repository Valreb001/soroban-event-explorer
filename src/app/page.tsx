'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ContractSearch } from '@/components/search/ContractSearch'
import { SearchHistory } from '@/components/search/SearchHistory'
import { NetworkSelector } from '@/components/wallet/NetworkSelector'
import { LiveEventFeed } from '@/components/home/LiveEventFeed'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { Network } from '@/types'
import { DEFAULT_NETWORK, EXAMPLE_TESTNET_CONTRACT } from '@/constants'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Live Mode',
    desc: 'Stream new events as they land on-chain — no refresh needed. See your contract react in real time.',
  },
  {
    icon: '🏷️',
    title: 'Smart Event Labels',
    desc: 'SEP-41 token events (transfer, mint, burn) and DeFi patterns auto-identified with human-readable labels.',
  },
  {
    icon: '🔗',
    title: 'Shareable Links',
    desc: 'Filter by type, topic, or ledger range — the URL updates so you can share exactly what you see.',
  },
  {
    icon: '🔍',
    title: 'Full XDR Decoding',
    desc: 'Every topic and value decoded from raw XDR — addresses, amounts, symbols, maps, and more.',
  },
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
    <div className="flex flex-col items-center gap-14">
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-6 pt-12 max-w-2xl w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-800 text-blue-300 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Live on Stellar Testnet · Mainnet · Futurenet
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Soroban Contract Events,<br />
          <span className="text-blue-400">Decoded and Live</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl">
          Paste a Contract ID and instantly see all emitted events — labeled, decoded, filterable, and streaming live.
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

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {FEATURES.map(f => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-xs text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="flex flex-col items-center gap-3 w-full">
        <p className="text-xs text-gray-500 uppercase tracking-widest">Live from testnet right now</p>
        <LiveEventFeed />
      </div>

      {/* Search history */}
      {history.length > 0 && (
        <div className="w-full max-w-2xl">
          <SearchHistory history={history} onRemove={removeFromHistory} onClear={clearHistory} />
        </div>
      )}
    </div>
  )
}
