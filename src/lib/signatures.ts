export interface EventSignature {
  label: string
  description: string
  category: 'token' | 'defi' | 'admin' | 'governance' | 'other'
}

export const KNOWN_SIGNATURES: Record<string, EventSignature> = {
  // SEP-41 Token Standard
  transfer: { label: 'Transfer', description: 'Token transfer between accounts', category: 'token' },
  mint: { label: 'Mint', description: 'New tokens minted to an account', category: 'token' },
  burn: { label: 'Burn', description: 'Tokens permanently destroyed', category: 'token' },
  clawback: { label: 'Clawback', description: 'Admin-forced token removal', category: 'token' },
  approve: { label: 'Approve', description: 'Spending allowance granted', category: 'token' },
  increase_allowance: { label: 'Allowance +', description: 'Spending allowance increased', category: 'token' },
  decrease_allowance: { label: 'Allowance -', description: 'Spending allowance decreased', category: 'token' },
  set_admin: { label: 'Admin Change', description: 'Contract administrator updated', category: 'admin' },
  set_authorized: { label: 'Authorization', description: 'Account trust/authorization changed', category: 'admin' },
  // DeFi patterns
  swap: { label: 'Swap', description: 'Token swap executed', category: 'defi' },
  deposit: { label: 'Deposit', description: 'Assets deposited into protocol', category: 'defi' },
  withdraw: { label: 'Withdraw', description: 'Assets withdrawn from protocol', category: 'defi' },
  borrow: { label: 'Borrow', description: 'Assets borrowed from protocol', category: 'defi' },
  repay: { label: 'Repay', description: 'Borrowed assets repaid', category: 'defi' },
  liquidate: { label: 'Liquidate', description: 'Undercollateralized position liquidated', category: 'defi' },
  add_liquidity: { label: 'Add Liquidity', description: 'Liquidity added to pool', category: 'defi' },
  remove_liquidity: { label: 'Remove Liquidity', description: 'Liquidity removed from pool', category: 'defi' },
  // Governance
  vote: { label: 'Vote', description: 'Governance vote cast', category: 'governance' },
  propose: { label: 'Propose', description: 'Governance proposal submitted', category: 'governance' },
  execute: { label: 'Execute', description: 'Governance proposal executed', category: 'governance' },
}

export const CATEGORY_STYLES: Record<EventSignature['category'], string> = {
  token: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  defi: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  admin: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
  governance: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50',
  other: 'bg-gray-800 text-gray-400 border-gray-700',
}

export function matchSignature(topics: { decoded: string }[]): EventSignature | null {
  if (!topics.length) return null
  const key = topics[0].decoded.toLowerCase().replace(/[^a-z_]/g, '')
  return KNOWN_SIGNATURES[key] ?? null
}
