import { ContractStats } from '@/types'
import { ContractBadge } from './ContractBadge'
import { ContractStats as ContractStatsComponent } from './ContractStats'
import { ContractCardSkeleton } from '@/components/ui/Skeleton'

interface Props {
  contractId: string
  stats: ContractStats | null
  isLoading: boolean
  network: import('@/types').Network
}

export function ContractCard({ contractId, stats, isLoading, network }: Props) {
  if (isLoading) return <ContractCardSkeleton />

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-gray-500 text-xs mb-1">Contract</p>
          <ContractBadge contractId={contractId} network={network} />
        </div>
        <span className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300 capitalize">
          {network}
        </span>
      </div>
      {stats && <ContractStatsComponent stats={stats} />}
    </div>
  )
}
