'use client'
import { Network } from '@/types'
import clsx from 'clsx'

const NETWORKS: Network[] = ['testnet', 'mainnet', 'futurenet']

export function NetworkSelector({ value, onChange }: { value: Network; onChange: (n: Network) => void }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-700">
      {NETWORKS.map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={clsx(
            'px-3 py-1.5 text-xs capitalize transition-colors',
            value === n ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          )}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
