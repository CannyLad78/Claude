# Health Dashboard

A personal health and fitness tracker built with Next.js (App Router), Prisma + SQLite, and Claude. Log workouts, sleep, and weight; get AI-powered insights; and pull in live data from external APIs via configurable dashboard cards.

## Features

- **Tracking** — log workouts, sleep, and weight entries (`/log`), visualized as stat cards and charts on the dashboard.
- **AI insights** — a weekly recap and a chat assistant (`components/ai/`) that answer questions about your logged health data, powered by the Claude API.
- **Dashboard cards** — connect external APIs (Home Assistant, Open-Meteo weather, or any custom JSON API) as live, auto-refreshing cards on the dashboard. Manage them at `/cards`. See `lib/cards/` for the adapter architecture.
- **Mandalorian CYOA game** — a text adventure with deck-building combat, tucked away at `/game`.

## Getting started

Install dependencies and set up the database:

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

Set your Claude API key (required for the AI recap/chat features):

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx          # main dashboard
  log/               # entry forms (workout/sleep/weight)
  cards/             # manage dashboard cards
  game/              # CYOA game
  api/               # route handlers (entries, insights, cards)
components/
  charts/, forms/    # health tracking UI
  ai/                # weekly recap + chat assistant
  cards/             # dashboard card UI (grid, shell, config forms)
  game/              # game UI
lib/
  db.ts              # Prisma client (SQLite via better-sqlite3 adapter)
  claude.ts           # Claude client + health context builder
  cards/             # card adapter interface, registry, and adapters
  game/              # game engine/data
prisma/
  schema.prisma      # data models
```

## Adding a new dashboard card integration

Card integrations live in `lib/cards/adapters/`. Each adapter declares its config fields (rendered automatically as a form) and a `fetchData` function that returns a normalized `{ primary, items, updatedAt }` shape. To add one:

1. Create `lib/cards/adapters/yourAdapter.ts` implementing the `CardAdapter` type from `lib/cards/types.ts`.
2. Register it in `lib/cards/registry.ts`.

Card configs (including secrets like API tokens) are stored server-side and never sent to the client in plaintext — secret fields are redacted on read and only overwritten on edit if a new value is provided.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Turbopack)
- [Prisma](https://www.prisma.io) + SQLite (via `better-sqlite3` driver adapter)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Claude API](https://docs.claude.com) (`@anthropic-ai/sdk`)
