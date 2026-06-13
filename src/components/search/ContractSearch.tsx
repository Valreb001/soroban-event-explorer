'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isValidContractId } from '@/lib/decoder'
import { Network } from '@/types'
import clsx from 'clsx'

interface Props {
  network: Network
  onSearch?: (contractId: string) => void
  autoFocus?: boolean
}

export function ContractSearch({ network, onSearch, autoFocus }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    if (!isValidContractId(trimmed)) {
      setError('Invalid Contract ID. Must start with C and be 56 characters.')
      return
    }
    setError('')
    if (onSearch) {
      onSearch(trimmed)
    } else {
      router.push(`/contract/${trimmed}?network=${network}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            ref={inputRef}
            autoFocus={autoFocus}
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setError('') }}
            placeholder="Enter a Soroban Contract ID (C...)"
            className={clsx(
              'w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border focus:outline-none focus:border-blue-500 transition-colors',
              error ? 'border-red-500' : 'border-gray-700'
            )}
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Explore
        </button>
      </div>
    </form>
  )
}
