'use client'
import { EventFilters, EventType } from '@/types'

interface Props {
  filters: EventFilters
  onChange: (filters: EventFilters) => void
}

export function EventFilter({ filters, onChange }: Props) {
  const set = <K extends keyof EventFilters>(key: K, value: EventFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const hasActiveFilters = filters.eventType !== 'all' || filters.topic ||
    filters.dateFrom || filters.dateTo || filters.ledgerFrom || filters.ledgerTo || filters.onlySuccessful

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.eventType}
          onChange={e => set('eventType', e.target.value as EventType | 'all')}
          className="bg-gray-800 text-white text-sm rounded px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="contract">Contract</option>
          <option value="system">System</option>
          <option value="diagnostic">Diagnostic</option>
        </select>

        <input
          type="text"
          placeholder="Filter by topic..."
          value={filters.topic}
          onChange={e => set('topic', e.target.value)}
          className="bg-gray-800 text-white text-sm rounded px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500 min-w-0 flex-1 sm:flex-none sm:w-48"
        />

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={filters.onlySuccessful}
            onChange={e => set('onlySuccessful', e.target.checked)}
            className="accent-blue-500"
          />
          Successful only
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 shrink-0">Date</span>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={e => set('dateFrom', e.target.value || null)}
            className="bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <span className="text-xs text-gray-500">→</span>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={e => set('dateTo', e.target.value || null)}
            className="bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 shrink-0">Ledger</span>
          <input
            type="number"
            placeholder="From"
            value={filters.ledgerFrom || ''}
            onChange={e => set('ledgerFrom', e.target.value ? Number(e.target.value) : null)}
            className="bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500 w-28"
          />
          <span className="text-xs text-gray-500">→</span>
          <input
            type="number"
            placeholder="To"
            value={filters.ledgerTo || ''}
            onChange={e => set('ledgerTo', e.target.value ? Number(e.target.value) : null)}
            className="bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500 w-28"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => onChange({ eventType: 'all', topic: '', dateFrom: null, dateTo: null, ledgerFrom: null, ledgerTo: null, onlySuccessful: false })}
            className="text-xs text-gray-500 hover:text-white transition-colors ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
