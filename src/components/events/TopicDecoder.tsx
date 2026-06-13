import { DecodedTopic } from '@/types'
import { CopyButton } from '@/components/ui/CopyButton'

export function TopicDecoder({ topics }: { topics: DecodedTopic[] }) {
  return (
    <div className="space-y-2">
      {topics.map((topic, i) => (
        <div key={i} className="flex items-start gap-2 bg-gray-800 rounded p-2">
          <span className="text-xs text-gray-500 w-16 shrink-0">Topic {i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white font-mono truncate">{topic.decoded}</span>
              <span className="text-xs text-gray-500 shrink-0">{topic.type}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500 font-mono truncate">{topic.raw}</span>
              <CopyButton text={topic.raw} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
