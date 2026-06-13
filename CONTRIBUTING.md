# Contributing to Soroban Event Explorer

## Local Dev Setup

1. Clone the repo and install dependencies:
```bash
git clone https://github.com/<your-username>/soroban-event-explorer
cd soroban-event-explorer
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Start the dev server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SOROBAN_RPC_TESTNET` | Soroban Testnet RPC URL |
| `NEXT_PUBLIC_SOROBAN_RPC_MAINNET` | Soroban Mainnet RPC URL |
| `NEXT_PUBLIC_HORIZON_TESTNET` | Horizon Testnet URL |
| `NEXT_PUBLIC_HORIZON_MAINNET` | Horizon Mainnet URL |
| `NEXT_PUBLIC_DEFAULT_NETWORK` | Default network (`testnet`) |

## Finding a Testnet Contract with Events

Use the [Stellar Expert Testnet Explorer](https://stellar.expert/explorer/testnet) to find active contracts. Search for recent transactions and look for contract IDs that have emitted events.

## Adding a New Event Filter Type

1. Add the new field to `EventFilters` in `src/types/index.ts`
2. Add the filter UI input in `src/components/events/EventFilter.tsx`
3. Apply the filter logic in `src/lib/soroban.ts` inside `fetchContractEvents`

## Improving XDR Decoding for a New Value Type

1. Open `src/lib/decoder.ts`
2. In `scValToString`, add a new `if (arm === 'scvYourType')` branch
3. Update `identifyType` to map the new arm name to a display label
4. All decoding errors are caught and fall back to raw XDR — never crash

## Adding a New Chart

1. Create a new component in `src/components/charts/`
2. Use `recharts` for the chart implementation
3. Import and render it in the Charts tab of `src/app/contract/[id]/page.tsx`

## Soroban RPC Documentation

- [Soroban RPC Reference](https://developers.stellar.org/docs/data/rpc)
- [getEvents RPC method](https://developers.stellar.org/docs/data/rpc/api-reference/methods/getEvents)
- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
