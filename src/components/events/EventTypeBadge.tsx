import clsx from 'clsx'
import { EventType } from '@/types'

const styles: Record<EventType, string> = {
  contract: 'bg-blue-900 text-blue-300 border border-blue-700',
  system: 'bg-purple-900 text-purple-300 border border-purple-700',
  diagnostic: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
}

export function EventTypeBadge({ type }: { type: EventType }) {
  return (
    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium capitalize', styles[type])}>
      {type}
    </span>
  )
}
