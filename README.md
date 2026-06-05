# Retium Validator Mesh Dashboard

A starter web app for monitoring **Keepers, Workers, and Suits** on the Retium testnet — built as one of the 5 ecosystem web ideas (Validator Mesh Dashboard).

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for TPS / reward charts
- **Lucide React** for icons
- **Mock data** (`lib/mock-data.ts`) — replace with real node API later

## Pages

| Route | What's there |
|---|---|
| `/` | Network overview — TPS chart, role distribution, reward split, live event feed |
| `/validators` | Sortable + filterable list (role, status, search, sort) |
| `/validators/[address]` | Detail page — stake progress, reward chart, recent quorums, slashing history |
| `/become-validator` | 3-role comparison + 4-step setup wizard |

## Run locally

Requires **Node.js 18+**.

```bash
cd C:\validator-mesh-dashboard
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo at https://vercel.com/new
3. Done — Vercel auto-detects Next.js

## Wiring to a real Retium node

The mock data lives in `lib/mock-data.ts`. To go live:

1. Replace imports from `@/lib/mock-data` with fetches to your node's REST API.
2. For the **Live Event Feed**, swap the `setInterval` mock in `components/LiveEventFeed.tsx` with a WebSocket subscription:

   ```ts
   const ws = new WebSocket("wss://testnet-node.retium.org/stream");
   ws.onmessage = (msg) => setEvents((prev) => [JSON.parse(msg.data), ...prev].slice(0, 20));
   ```

3. Recommended endpoints to expose from the node (or a thin BFF):
   - `GET /validators?role=&status=&sort=`
   - `GET /validators/:address`
   - `GET /network/stats`
   - `GET /rotations?tick=`
   - `WS  /stream` (event feed)

## File map

```
app/
  page.tsx                       # Overview
  validators/page.tsx            # List
  validators/[address]/page.tsx  # Detail
  become-validator/page.tsx      # Onboarding
components/
  Navbar.tsx
  RoleBadge.tsx
  StatCard.tsx
  LiveEventFeed.tsx              # client component
lib/
  types.ts                       # Validator, NetworkStats, NetworkEvent, Rotation
  constants.ts                   # MIN_STAKE, role colors, reward share
  format.ts                      # RTM / address / percent / time-ago
  mock-data.ts                   # seeded RNG → deterministic data
```

## Next steps

- [ ] Connect to Retium testnet RPC when public (Phase 3)
- [ ] Add wallet connect (Ed25519 signer) for real-time stake actions
- [ ] Add a public embed widget (iframe) for community sites
- [ ] Integrate RAI HRN scores when RAI layer exposes them
- [ ] Add a Reward Calculator (input stake → estimated monthly RTM)
