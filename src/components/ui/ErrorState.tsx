export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">Something went wrong</h3>
      <p className="text-gray-400 text-sm max-w-sm">{message}</p>
    </div>
  )
}
