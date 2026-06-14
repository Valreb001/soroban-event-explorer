import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { ConnectButton } from '@/components/wallet/ConnectButton'

export const metadata: Metadata = {
  title: 'Soroban Event Explorer — Real-time Stellar Contract Events',
  description: 'Explore, decode, and monitor events emitted by Soroban smart contracts on Stellar. Live streaming, XDR decoding, smart event labeling, and shareable filtered views.',
  keywords: ['Soroban', 'Stellar', 'smart contracts', 'blockchain events', 'XDR decoder', 'Stellar testnet'],
  openGraph: {
    title: 'Soroban Event Explorer',
    description: 'Real-time Soroban contract event explorer with XDR decoding, live mode, and shareable links.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-white">
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-white hover:text-blue-400 transition-colors shrink-0">
              <span className="text-blue-400 text-lg">◈</span>
              <span className="hidden sm:inline">Soroban Explorer</span>
              <span className="sm:hidden">Explorer</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/explorer" className="text-sm text-gray-400 hover:text-white transition-colors">
                Explorer
              </Link>
              <ConnectButton />
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
