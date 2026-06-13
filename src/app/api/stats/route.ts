import { NextRequest, NextResponse } from 'next/server'
import { fetchContractStats } from '@/lib/soroban'
import { Network } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const contractId = searchParams.get('contractId')
  const network = (searchParams.get('network') || 'testnet') as Network

  if (!contractId) {
    return NextResponse.json({ error: 'contractId is required' }, { status: 400 })
  }

  try {
    const stats = await fetchContractStats(contractId, network)
    return NextResponse.json(stats)
  } catch (e: unknown) {
    console.error('fetchContractStats error:', e)
    return NextResponse.json({ error: 'Failed to fetch contract stats' }, { status: 500 })
  }
}
