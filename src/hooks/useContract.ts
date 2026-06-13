'use client'
import { useState, useEffect } from 'react'
import { ContractStats, Network } from '@/types'
import { fetchContractStats } from '@/lib/soroban'

export function useContract(contractId: string, network: Network) {
  const [stats, setStats] = useState<ContractStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!contractId) return
    setIsLoading(true)
    setError(null)
    fetchContractStats(contractId, network)
      .then(setStats)
      .catch(() => setError('Failed to load contract stats.'))
      .finally(() => setIsLoading(false))
  }, [contractId, network])

  return { stats, isLoading, error }
}
