import { CopyButton } from '@/components/ui/CopyButton'
import { truncateAddress } from '@/lib/format'
import { STELLAR_EXPERT_BASE } from '@/constants'
import { Network } from '@/types'

export function ContractBadge({ contractId, network }: { contractId: string; network: Network }) {
  const base = STELLAR_EXPERT_BASE[network]
  return (
    <div className="flex items-center gap-2">
      <a
        href={`${base}/contract/${contractId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-blue-400 hover:underline"
        title={contractId}
      >
        {truncateAddress(contractId)}
      </a>
      <CopyButton text={contractId} />
    </div>
  )
}
