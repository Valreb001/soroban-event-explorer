import { SorobanEvent } from '@/types'
import { EventTypeBadge } from './EventTypeBadge'
import { TopicDecoder } from './TopicDecoder'
import { CopyButton } from '@/components/ui/CopyButton'
import { formatTimestamp, formatRelativeTime, truncateAddress } from '@/lib/format'
import { STELLAR_EXPERT_BASE } from '@/constants'
import { Network } from '@/types'

export function EventDetail({ event, network }: { event: SorobanEvent; network: Network }) {
  const base = STELLAR_EXPERT_BASE[network]

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <EventTypeBadge type={event.type} />
        <span className={`text-xs px-2 py-0.5 rounded ${event.inSuccessfulContractCall ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
          {event.inSuccessfulContractCall ? 'Successful' : 'Failed'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-1">Event ID</p>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-xs">{truncateAddress(event.id)}</span>
            <CopyButton text={event.id} />
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Ledger</p>
          <a href={`${base}/ledger/${event.ledger}`} target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-xs">{event.ledger.toLocaleString()}</a>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Transaction</p>
          <div className="flex items-center gap-2">
            <a href={`${base}/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-mono text-xs">{truncateAddress(event.txHash)}</a>
            <CopyButton text={event.txHash} />
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Timestamp</p>
          <span title={formatTimestamp(event.ledgerClosedAt)} className="text-white text-xs cursor-help">
            {formatRelativeTime(event.ledgerClosedAt)}
          </span>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-2">Topics</p>
        <TopicDecoder topics={event.topics} />
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-2">Value</p>
        <div className="bg-gray-800 rounded p-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-xs">{event.value.decoded}</span>
            <span className="text-gray-500 text-xs">{event.value.type}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-gray-500 font-mono text-xs truncate">{event.value.raw}</span>
            <CopyButton text={event.value.raw} />
          </div>
        </div>
      </div>
    </div>
  )
}
