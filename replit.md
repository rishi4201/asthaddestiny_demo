# CosmicRead

A full-stack astrology and palmistry platform where users answer a birth-chart questionnaire, receive AI-generated teasers, chat with the astrologer via a palmistry interface (image upload), and unlock a full personal report via Stripe paywall ($49). Includes an admin dashboard and office booking CTA.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/astrology-app run dev` — run the React frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + TailwindCSS 4 + Wouter (routing)
- Auth: Clerk (`@clerk/react@^6`, `@clerk/express@^2`) — Replit-managed tenant
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Payments: Stripe (STRIPE_SECRET_KEY needed; VITE_STRIPE_PUBLISHABLE_KEY for frontend)
- Object storage: Replit Object Storage (palm images)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/astrology-app/` — React/Vite frontend (all 10 pages)
- `artifacts/api-server/` — Express 5 API server
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/api-client-react/` — generated React Query hooks + Zod schemas
- `lib/db/src/schema/index.ts` — Drizzle DB schema (users, questionnaires, teasers, chatMessages)

## Architecture decisions

- Contract-first: OpenAPI spec → Orval codegen → React Query hooks; server validates with Zod schemas
- Clerk proxy: frontend posts to `/api/__clerk` which proxies to Clerk FAPI, avoiding mixed-origin issues
- Palmistry chat images stored in Replit Object Storage; URLs sent to the chat message API
- Stripe paywall gates the full report PDF; teaser is generated free
- isAdmin flag in the `users` table gates the admin dashboard

## Product

- Landing page with cosmic dark theme (CosmicRead branding, gold accent)
- Sign up / Sign in via Clerk (email+password, Google)
- Multi-step birth-chart questionnaire → AI teaser generation
- Palmistry chat with palm image upload → AI chat interface
- Stripe paywall ($49) for full personal report
- Admin dashboard: view all users and their readings
- Office booking CTA page

## User preferences

- Mobile-first design, dark cosmic theme, serif fonts, gold accents

## Gotchas

- **Clerk version compatibility**: Use `@clerk/react@^6` (not `^5`) to align with `@clerk/shared@^4.x` that `@clerk/express@^2` also uses. Mixing 5.x and 2.x causes `@clerk/shared` deduplication conflicts.
- **Clerk v6 API**: `SignedIn`/`SignedOut` components are removed. Use `const { isSignedIn } = useAuth()` and conditional rendering instead.
- **Clerk v6**: `publishableKeyFromHost` from `@clerk/react/internal` is gone — use `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY` directly.
- Admin user: set `is_admin = true` in DB `users` table manually for first admin
- Stripe secret key (`STRIPE_SECRET_KEY`) must be configured for payments to work

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
