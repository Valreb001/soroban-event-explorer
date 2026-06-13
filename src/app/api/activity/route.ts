import { NextRequest, NextResponse } from 'next/server'
import { fetchEventActivity } from '@/lib/soroban'
import { Network } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const contractId = searchParams.get('contractId')
  const network = (searchParams.get('network') || 'testnet') as Network
  const days = parseInt(searchParams.get('days') || '30')

  if (!contractId) {
    return NextResponse.json({ error: 'contractId is required' }, { status: 400 })
  }

  try {
    const activity = await fetchEventActivity(contractId, network, days)
    return NextResponse.json(activity)
  } catch (e: unknown) {
    console.error('fetchEventActivity error:', e)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
