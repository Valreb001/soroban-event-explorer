export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 text-sm max-w-sm">{description}</p>}
    </div>
  )
}
