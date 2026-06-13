'use client'
import { useState, useEffect } from 'react'
import { Network } from '@/types'
import { isFreighterConnected, getFreighterPublicKey, getFreighterNetwork } from '@/lib/freighter'

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [network, setNetwork] = useState<Network | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const connect = async () => {
    setIsLoading(true)
    try {
      const connected = await isFreighterConnected()
      if (connected) {
        const [key, net] = await Promise.all([getFreighterPublicKey(), getFreighterNetwork()])
        setPublicKey(key)
        setNetwork(net)
        setIsConnected(true)
      }
    } catch {}
    finally { setIsLoading(false) }
  }

  const disconnect = () => {
    setPublicKey(null)
    setNetwork(null)
    setIsConnected(false)
  }

  useEffect(() => { connect() }, [])

  return { publicKey, network, isConnected, isLoading, connect, disconnect }
}
