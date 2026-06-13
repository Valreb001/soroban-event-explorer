'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ContractSearch } from '@/components/search/ContractSearch'
import { SearchHistory } from '@/components/search/SearchHistory'
import { NetworkSelector } from '@/components/wallet/NetworkSelector'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { EmptyState } from '@/components/ui/EmptyState'
import { Network } from '@/types'
import { DEFAULT_NETWORK } from '@/constants'

export default function ExplorerPage() {
  const [network, setNetwork] = useState<Network>(DEFAULT_NETWORK)
  const router = useRouter()
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()

  const handleSearch = (contractId: string) => {
    addToHistory(contractId, network)
    router.push(`/contract/${contractId}?network=${network}`)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-white">Contract Explorer</h1>
          <NetworkSelector value={network} onChange={setNetwork} />
        </div>
        <ContractSearch network={network} onSearch={handleSearch} autoFocus />
      </div>

      {history.length > 0 ? (
        <SearchHistory history={history} onRemove={removeFromHistory} onClear={clearHistory} />
      ) : (
        <EmptyState
          title="Enter a contract ID to get started"
          description="Paste a Soroban contract ID above to explore its events, view charts, and decode topics."
        />
      )}
    </div>
  )
}
