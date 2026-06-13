'use client'
import { useState } from 'react'
import { CopyButton } from './CopyButton'

export function JsonViewer({ data }: { data: unknown }) {
  const json = JSON.stringify(data, null, 2)
  return (
    <div className="relative bg-gray-900 rounded-lg border border-gray-700">
      <div className="absolute top-2 right-2">
        <CopyButton text={json} />
      </div>
      <pre className="p-4 text-xs text-green-300 overflow-auto max-h-96 font-mono">{json}</pre>
    </div>
  )
}
