# Soroban Event Explorer

A full-stack web application that indexes, searches, and visualizes events emitted by Soroban smart contracts on Stellar. Paste a Contract ID and instantly see all emitted events — decoded, filterable, and visualized.

## Live Demo

Try it with this Testnet contract:
```
CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

---

## Stellar Integration

This project integrates deeply with the Stellar ecosystem across multiple layers:

### 1. Soroban RPC (`@stellar/stellar-sdk` — `rpc` module)

All event data is fetched directly from the Soroban RPC using the `rpc.Server` class from `@stellar/stellar-sdk` v15.

```ts
import { rpc } from '@stellar/stellar-sdk'

const server = new rpc.Server('https://soroban-testnet.stellar.org')

// Fetch events for a contract
const response = await server.getEvents({
  startLedger: 2963890,
  filters: [{ contractIds: ['CDLZFC3...'] }],
  limit: 20,
})
```

**Key methods used:**
| Method | Purpose |
|---|---|
| `server.getEvents()` | Fetch contract events with filters |
| `server.getLatestLedger()` | Get current ledger to calculate start range |

**RPC Endpoints:**
| Network | URL |
|---|---|
| Testnet | `https://soroban-testnet.stellar.org` |
| Mainnet | `https://mainnet.stellar.validationcloud.io/v1/json-rpc` |
| Futurenet | `https://rpc-futurenet.stellar.org` |

> All RPC calls run server-side via Next.js API routes (`/api/events`, `/api/stats`, `/api/activity`) to avoid CORS issues in the browser.

---

### 2. XDR Decoding (`xdr`, `Address`, `scValToNative`)

Raw event topics and values from the RPC are encoded as XDR (`ScVal`). The app decodes them to human-readable format using the SDK's XDR utilities.

```ts
import { xdr, Address, scValToNative } from '@stellar/stellar-sdk'

// Decode a base64 XDR topic
const val = xdr.ScVal.fromXDR(rawBase64, 'base64')

// Symbol → string
if (val.switch().name === 'scvSymbol') return val.sym().toString() // e.g. "transfer"

// Address → Stellar address string
if (val.switch().name === 'scvAddress') return Address.fromScVal(val).toString()

// I128 → number string
if (val.switch().name === 'scvI128') { ... }

// Fallback
return scValToNative(val)
```

**Supported XDR types decoded:**
`Symbol` · `String` · `Address` · `U64` · `I64` · `U128` · `I128` · `U32` · `I32` · `Bool` · `Bytes` · `Vec` · `Map` · `Void`

All decoding errors fall back to the raw XDR string — the app never crashes on unknown types.

---

### 3. Horizon API

The Horizon REST API is used as a supplementary data source for contract metadata.

```ts
// Horizon endpoints
const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org'
const HORIZON_MAINNET = 'https://horizon.stellar.org'
```

---

### 4. Freighter Wallet (`@stellar/freighter-api`)

The app supports connecting a [Freighter](https://www.freighter.app/) wallet for network detection and account identification.

```ts
import { isConnected, getPublicKey, getNetworkDetails } from '@stellar/freighter-api'

const connected = await isConnected()
const publicKey = await getPublicKey()       // G... Stellar address
const { networkPassphrase } = await getNetworkDetails()
```

When connected, the navbar shows the truncated public key and the detected network.

---

### 5. Stellar Expert Links

All contract IDs, transaction hashes, and ledger numbers link directly to [Stellar Expert](https://stellar.expert) for deep inspection:

| Item | Link pattern |
|---|---|
| Contract | `stellar.expert/explorer/testnet/contract/{id}` |
| Transaction | `stellar.expert/explorer/testnet/tx/{hash}` |
| Ledger | `stellar.expert/explorer/testnet/ledger/{number}` |

---

### 6. Network Support

| Network | RPC | Horizon | Stellar Expert |
|---|---|---|---|
| Testnet | `soroban-testnet.stellar.org` | `horizon-testnet.stellar.org` | `stellar.expert/explorer/testnet` |
| Mainnet | `validationcloud.io` | `horizon.stellar.org` | `stellar.expert/explorer/public` |
| Futurenet | `rpc-futurenet.stellar.org` | `horizon-futurenet.stellar.org` | `stellar.expert/explorer/futurenet` |

---

## Features

- 🔍 Search any Soroban contract by ID with inline validation
- ⚡ Real-time event fetching from Soroban RPC (server-side proxied)
- 🧩 Full XDR topic and value decoding — Symbol, Address, I128, U64, and more
- 📊 Event activity charts (line, donut, bar) via Recharts
- 🌐 Mainnet / Testnet / Futurenet support
- 🔗 Freighter wallet connection
- 📋 Copy to clipboard on all addresses and hashes
- ⬇️ CSV export for event tables
- 🦴 Skeleton loading states for all data fetches
- 📱 Fully mobile responsive, dark mode default

---

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
NEXT_PUBLIC_SOROBAN_RPC_MAINNET=https://mainnet.stellar.validationcloud.io/v1/json-rpc
NEXT_PUBLIC_SOROBAN_RPC_TESTNET=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_MAINNET=https://horizon.stellar.org
NEXT_PUBLIC_HORIZON_TESTNET=https://horizon-testnet.stellar.org
NEXT_PUBLIC_DEFAULT_NETWORK=testnet
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── explorer/page.tsx         # Explorer page
│   ├── contract/[id]/page.tsx    # Contract detail (Events / Charts / Raw tabs)
│   ├── event/[id]/page.tsx       # Single event detail
│   └── api/
│       ├── events/route.ts       # Server-side Soroban RPC event fetching
│       ├── stats/route.ts        # Server-side contract stats
│       └── activity/route.ts    # Server-side event activity for charts
├── components/
│   ├── events/                   # EventTable, EventRow, EventDetail, EventFilter
│   ├── charts/                   # EventActivityChart, EventTypeChart, TopicFrequencyChart
│   ├── contract/                 # ContractCard, ContractStats, ContractBadge
│   ├── search/                   # ContractSearch, SearchHistory
│   ├── wallet/                   # ConnectButton, NetworkSelector
│   └── ui/                       # Spinner, Skeleton, EmptyState, ErrorState, CopyButton, JsonViewer
├── lib/
│   ├── soroban.ts                # rpc.Server wrapper — fetchContractEvents, fetchContractStats
│   ├── decoder.ts                # XDR → human readable (xdr.ScVal, Address, scValToNative)
│   ├── freighter.ts              # Freighter wallet helpers
│   ├── horizon.ts                # Horizon API helpers
│   ├── format.ts                 # Address truncation, timestamps
│   └── csv.ts                    # CSV export utility
├── hooks/
│   ├── useEvents.ts              # Fetches /api/events with pagination + filters
│   ├── useContract.ts            # Fetches /api/stats
│   ├── useSearchHistory.ts       # localStorage recent searches
│   └── useWallet.ts              # Freighter connection state
├── types/index.ts                # SorobanEvent, DecodedTopic, ContractStats, EventFilters
└── constants/index.ts            # Network configs, RPC URLs, Stellar Expert base URLs
```

---

## Tech Stack

| Package | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | App Router, API Routes (server-side RPC proxy) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety across all layers |
| [Tailwind CSS](https://tailwindcss.com/) | Dark mode UI styling |
| [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk) | `rpc.Server`, `xdr`, `Address`, `scValToNative` |
| [@stellar/freighter-api](https://www.freighter.app/) | Wallet connection |
| [Recharts](https://recharts.org/) | Event activity charts |
| [date-fns](https://date-fns.org/) | Timestamp formatting |
| [clsx](https://github.com/lukeed/clsx) | Conditional classnames |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, how to add filters, improve XDR decoding, and add new charts.

## License

MIT
