'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SorobanEvent } from '@/types'
import { EventTypeBadge } from './EventTypeBadge'
import { EventDetail } from './EventDetail'
import { CopyButton } from '@/components/ui/CopyButton'
import { truncateAddress, formatRelativeTime, formatTimestamp } from '@/lib/format'
import { matchSignature, CATEGORY_STYLES } from '@/lib/signatures'
import { STELLAR_EXPERT_BASE } from '@/constants'
import { Network } from '@/types'
import clsx from 'clsx'

export function EventRow({ event, network }: { event: SorobanEvent; network: Network }) {
  const [expanded, setExpanded] = useState(false)
  const base = STELLAR_EXPERT_BASE[network]
  const sig = matchSignature(event.topics)

  return (
    <>
      <tr
        onClick={() => setExpanded(v => !v)}
        className={clsx('border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors', expanded && 'bg-gray-800/50')}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <EventTypeBadge type={event.type} />
            {sig && (
              <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${CATEGORY_STYLES[sig.category]}`}>
                {sig.label}
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-300 font-mono">
          {event.topics.slice(0, 2).map((t, i) => (
            <span key={i} className="block truncate max-w-[160px]" title={t.decoded}>{t.decoded}</span>
          ))}
          {event.topics.length === 0 && <span className="text-gray-600 text-xs">No topics</span>}
        </td>
        <td className="px-4 py-3 text-sm text-gray-300">
          {event.ledger.toLocaleString()}
        </td>
        <td className="px-4 py-3 text-sm text-gray-400">
          <span title={formatTimestamp(event.ledgerClosedAt)} className="cursor-help">
            {formatRelativeTime(event.ledgerClosedAt)}
          </span>
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="flex items-center gap-1">
            <a
              href={`${base}/tx/${event.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-mono"
              onClick={e => e.stopPropagation()}
            >
              {truncateAddress(event.txHash)}
            </a>
            <CopyButton text={event.txHash} />
          </div>
        </td>
        <td className="px-4 py-3 text-gray-500 text-xs">{expanded ? '▲' : '▼'}</td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-800">
          <td colSpan={6} className="px-4 py-3">
            <EventDetail event={event} network={network} />
          </td>
        </tr>
      )}
    </>
  )
}
