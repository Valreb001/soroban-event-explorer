import clsx from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('animate-pulse rounded bg-gray-800', className)} />
  )
}

export function EventRowSkeleton() {
  return (
    <tr className="border-b border-gray-800">
      <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
      <td className="px-4 py-3 space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
    </tr>
  )
}

export function ContractCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-3 border border-gray-700 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}
