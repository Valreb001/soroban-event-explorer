# Soroban Event Explorer

A full-stack web application that indexes, searches, and visualizes events emitted by Soroban smart contracts on Stellar.

## Features

- 🔍 Search any Soroban contract by ID
- ⚡ Real-time event fetching from Soroban RPC
- 🧩 XDR topic and value decoding to human-readable format
- 📊 Event activity charts (line, donut, bar)
- 🌐 Mainnet / Testnet / Futurenet support
- 🔗 Freighter wallet connection
- 📋 Copy to clipboard on all addresses and hashes
- 📱 Fully mobile responsive

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk)
- [@stellar/freighter-api](https://www.freighter.app/)
- [Recharts](https://recharts.org/)
- [date-fns](https://date-fns.org/)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, how to add filters, improve XDR decoding, and add new charts.

## License

MIT
