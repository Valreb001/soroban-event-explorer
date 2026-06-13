import { NextRequest, NextResponse } from 'next/server'
import { fetchContractEvents } from '@/lib/soroban'
import { Network, EventFilters } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const contractId = searchParams.get('contractId')
  const network = (searchParams.get('network') || 'testnet') as Network
  const cursor = searchParams.get('cursor') || undefined
  const limit = parseInt(searchParams.get('limit') || '20')

  if (!contractId) {
    return NextResponse.json({ error: 'contractId is required' }, { status: 400 })
  }

  const filters: Partial<EventFilters> = {
    eventType: (searchParams.get('eventType') as EventFilters['eventType']) || 'all',
    topic: searchParams.get('topic') || '',
    dateFrom: searchParams.get('dateFrom') || null,
    dateTo: searchParams.get('dateTo') || null,
    ledgerFrom: searchParams.get('ledgerFrom') ? parseInt(searchParams.get('ledgerFrom')!) : null,
    ledgerTo: searchParams.get('ledgerTo') ? parseInt(searchParams.get('ledgerTo')!) : null,
    onlySuccessful: searchParams.get('onlySuccessful') === 'true',
  }

  try {
    const result = await fetchContractEvents(contractId, network, filters, cursor, limit)
    return NextResponse.json(result)
  } catch (e: unknown) {
    console.error('fetchContractEvents error:', e)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
