'use client'
import { useState } from 'react'
import clsx from 'clsx'

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      className={clsx('text-xs text-gray-400 hover:text-white transition-colors', className)}
    >
      {copied ? '✓' : '⧉'}
    </button>
  )
}
