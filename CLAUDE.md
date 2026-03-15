# CLAUDE.md — Kumpul Duit Raya

## Project Overview

**Kumpul Duit Raya** is a client-side SPA for tracking Raya money (duit raya) collected by family members. It supports multi-event management, denomination-level money input, a live leaderboard, and PDF export. No backend or login required — all data lives in `localStorage`.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 (SPA mode, SSR disabled) |
| Language | TypeScript 5.7 |
| State | Pinia 3 + pinia-plugin-persistedstate |
| Styling | Tailwind CSS 6 |
| Components | Radix Vue (headless) + Lucide icons |
| Animations | @vueuse/motion, tailwindcss-animate |
| i18n | @nuxtjs/i18n — English (`en`) + Malay (`ms`) |
| PDF | jspdf + jspdf-autotable |
| Testing | Vitest 4 + jsdom |
| Deployment | Cloudflare Pages (`wrangler.toml`) |

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production (output: /dist)
npm run preview      # Preview production build locally
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Project Structure

```
pages/               # File-based routing (Nuxt)
components/          # Reusable Vue components
stores/              # Pinia stores + TypeScript types
composables/         # useLeaderboard, useWallet, useTheme
utils/               # currency.ts, theme.ts, id.ts
i18n/locales/        # en.json, ms.json
middleware/          # setup-check.ts (guards onboarding)
tests/unit/          # Vitest unit tests
```

## Key Pages

| Route | Purpose |
|---|---|
| `/` | Dashboard — active event summary + member grid |
| `/setup` | 3-step onboarding wizard (language → event → members) |
| `/wallet/[memberId]` | Denomination picker, add money, transaction history |
| `/leaderboard` | Live rankings by total collected |
| `/export` | Generate and download PDF report |
| `/admin` | Hub for managing events, members, transactions |

## Data Models (`stores/types.ts`)

```typescript
RayaEvent     { id, name, year, startDate, endDate, theme, emoji, isActive }
FamilyMember  { id, name, role, avatar, color }  // role: parent|child|grandparent|relative
Transaction   { id, eventId, memberId, amount, denominations, fromName, note, timestamp }
AppSettings   { activeEventId, setupComplete, language }
```

- `amount` is stored in **sen** (1 RM = 100 sen)
- `denominations` maps denomination label → count e.g. `{ "RM10": 2, "50sen": 3 }`

## State Management

All stores are auto-persisted to `localStorage` via `pinia-plugin-persistedstate`.

| Store | File | Responsibility |
|---|---|---|
| `useEventsStore` | `stores/events.ts` | Event CRUD, active event |
| `useMembersStore` | `stores/members.ts` | Family member CRUD |
| `useTransactionsStore` | `stores/transactions.ts` | Add/delete/query transactions |
| `useSettingsStore` | `stores/settings.ts` | Language, setup flag, active event ID |

## Composables

- **`useLeaderboard`** — sorted rankings with percentages of total pool
- **`useWallet(memberId)`** — member's transactions, balance, and `addMoney()` action
- **`useTheme`** — watches active event and applies CSS custom properties to `document.root`

## Currency & Denominations

Defined in `utils/currency.ts`:
- **Coins:** 5sen, 10sen, 20sen, 50sen
- **Notes:** RM1, RM5, RM10, RM20, RM50, RM100
- Display helpers: `formatMYR(sen)`, `formatMYRCompact(sen)`

## Theme System

Four preset themes in `utils/theme.ts`:
- Hijau Raya (green), Biru Langit (blue), Merah Merdeka (red), Ungu Mewah (purple)

Applied as CSS custom properties via `ThemeProvider.vue` and `useTheme` composable. Each event gets its own theme.

## i18n

- Default locale: `en`, fallback: `ms`
- Translation files: `i18n/locales/en.json`, `i18n/locales/ms.json`
- Strategy: `no_prefix` (language not reflected in URL)
- Toggle via `LanguageToggle.vue` component

## Routing & Middleware

`middleware/setup-check.ts` runs globally:
- Redirects to `/setup` if `setupComplete === false`
- Redirects to `/` if setup complete and accessing `/setup`

## Testing

Tests live in `tests/unit/`. Run with Vitest + jsdom environment.

```
tests/unit/stores/      # events, members, transactions, settings
tests/unit/utils/       # currency, theme, id
```

Path alias `~` resolves to the project root (mirrors Nuxt convention).

## Deployment

- Deployed to **Cloudflare Pages** (see `wrangler.toml`)
- Build output: `/dist`
- SSR is disabled — app is a fully static SPA
- No environment variables required
- Fully offline-capable (localStorage only, no API calls)
