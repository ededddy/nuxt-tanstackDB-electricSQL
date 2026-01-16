# Toy Project Nuxt , @tanstack/db & ElectricSQL

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Services used

- Neon Postgres (`production` branch with `neondb_owner`)
- ElectricSQL cloud

## To Do ? If I have time
1. [x] Offline Support  
   ElectricSQL and @tanstack/db can support offline pwa
   that merge automatically, [official doc](https://github.com/TanStack/db/tree/main/examples/react/offline-transactions)
2. Authentication stuff (mainly to protect endpoints, specifically
   ElectricSQL's proxy)

## Vibe Code
Currently, vibe coded things:
- Fix electric sql proxy return method
- UI
- Troubleshooting why single transaction being called multiple times (
  Not familiar with Vue cycle and internal working of tanstack/db,
  ElectricSQL)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
