A demo project exploring non-financial utility for writer coins through badge signaling in comment sections.

## Goal

This project explores community-building utility for writer coins by surfacing token holdings as badges. Thought it was a low-touch way to signal potential other utility-based use cases for writer coins.

The comment section felt like a clean, simple surface area for this (and this section might become more relevant as Farcaster moves away from social features).

## Tech Stack

- **Next.js 15** (App Router)
- **Prisma + PostgreSQL** (via Neon)
- **Redis** (via Upstash REST client)
- **TypeScript**

**Key design decisions:**

- **Single endpoint** (`/api/posts/[postId]/comments`) returns comments + badges in one response. Avoids client-side orchestration and URL length issues from passing userIds.
- **Batch cache lookups** - parallel Redis gets for all commenters, single DB query for cache misses.

## Perf Demo Panel

The UI includes a performance panel to test cache behavior:

- **Cold cache** - flush Redis and observe cache misses
- **Warm cache** - subsequent requests show cache hits
- **Burst x5** - fire 5 parallel requests to test under load

## Notes

Built this way specifically to touch on topics discussed during our call (caching patterns, useEffect usage). Would likely implement differently otherwise (e.g., server components for data fetching, or a dedicated data layer).

Kind of a moot demo project at this point, but enjoyed building this out regardless :)

## Local Setup

1. Clone and install dependencies:
   ```bash
   pnpm install
   ```
2. Create `.env.local` with:
   ```bash
   DATABASE_URL=postgres://...
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ALLOW_DEV_ENDPOINTS=true
   ```
3. Run migrations and seed data:
   ```bash
   pnpm dlx prisma migrate deploy
   pnpm dlx tsx prisma/seed.ts
   pnpm dlx tsx prisma/seed-comments.ts
   ```
4. Start the app:
   ```bash
   pnpm dev
   ```
