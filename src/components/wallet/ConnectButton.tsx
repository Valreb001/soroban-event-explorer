'use client'
import { useWallet } from '@/hooks/useWallet'
import { truncateAddress } from '@/lib/format'
import { Spinner } from '@/components/ui/Spinner'

export function ConnectButton() {
  const { publicKey, isConnected, isLoading, connect, disconnect } = useWallet()

  if (isLoading) return <Spinner className="h-4 w-4 text-gray-400" />

  if (isConnected && publicKey) {
    return (
      <button
        onClick={disconnect}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-white transition-colors"
      >
        <span className="h-2 w-2 rounded-full bg-green-400" />
        {truncateAddress(publicKey)}
      </button>
    )
  }

  return (
    <button
      onClick={connect}
      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-white transition-colors"
    >
      Connect Wallet
    </button>
  )
}
