# CosmicRead ✨

> A full-stack astrology and palmistry platform — AI-generated birth chart teasers, palm image reading via chat, and a Stripe-gated personal report.

![CosmicRead](https://img.shields.io/badge/stack-React%20%2B%20Express%20%2B%20PostgreSQL-blueviolet?style=flat-square) ![Auth](https://img.shields.io/badge/auth-Clerk-black?style=flat-square) ![AI](https://img.shields.io/badge/AI-OpenAI%20GPT-green?style=flat-square) ![Payments](https://img.shields.io/badge/payments-Stripe-blue?style=flat-square)

---

## What It Does

1. **Sign up** with email/password or Google (Clerk auth)
2. **Complete a birth-chart questionnaire** — date, time, city of birth + 5 personal questions
3. **Receive an AI-generated teaser** — sun sign, moon sign, rising, and a personalised prose reading powered by GPT
4. **Chat with the astrologer** — upload a palm photo and exchange messages in a private chat thread
5. **Unlock the full report** — $49 Stripe paywall reveals the complete personal reading
6. **Book a session** — office booking CTA linked to the astrologer's calendar
7. **Admin dashboard** — astrologer views all users, questionnaire answers, and chat threads

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 7, TailwindCSS 4, Wouter |
| Auth | Clerk (`@clerk/react` v6, `@clerk/express` v2) |
| API | Express 5, TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| AI | OpenAI GPT-5 via Replit AI Integrations |
| Payments | Stripe |
| File storage | Replit Object Storage (palm images) |
| Monorepo | pnpm workspaces, Node.js 24 |
| API contract | OpenAPI 3.1 → Orval codegen (React Query hooks + Zod schemas) |

---

## Project Structure

```
├── artifacts/
│   ├── astrology-app/          # React + Vite frontend (10 pages)
│   └── api-server/             # Express 5 API server
├── lib/
│   ├── api-spec/               # openapi.yaml — source of truth
│   ├── api-client-react/       # generated React Query hooks (Orval)
│   ├── api-zod/                # generated Zod schemas (Orval)
│   └── db/                     # Drizzle schema + migrations
└── pnpm-workspace.yaml
```

### Frontend Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/sign-in`, `/sign-up` | Clerk embedded auth |
| `/dashboard` | User home — reading status, quick actions |
| `/questionnaire` | Multi-step birth chart form |
| `/questionnaire/result` | AI teaser reveal |
| `/chat` | Palmistry chat with image upload |
| `/payment` | Stripe checkout ($49) |
| `/booking` | Office booking CTA |
| `/profile` | User profile |
| `/admin` | Astrologer admin dashboard |

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+
- PostgreSQL database
- Clerk account (or use Replit-managed Clerk)
- Stripe account
- OpenAI API key (or use Replit AI Integrations)

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Clerk
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_CLERK_PROXY_URL=https://your-domain/__clerk

# Stripe
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_...

# OpenAI (or use Replit AI Integrations proxy)
AI_INTEGRATIONS_OPENAI_BASE_URL=https://...
AI_INTEGRATIONS_OPENAI_API_KEY=...

# Object Storage
DEFAULT_OBJECT_STORAGE_BUCKET_ID=...
```

### Install & Run

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm --filter @workspace/db run push

# Start API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Start frontend (port from $PORT env var)
pnpm --filter @workspace/astrology-app run dev
```

### Regenerate API client (after changing openapi.yaml)

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Admin Access

Set `is_admin = true` on the desired user row in the `users` table to grant admin dashboard access:

```sql
UPDATE users SET is_admin = true WHERE clerk_id = 'user_...';
```

---

## Architecture Notes

- **Contract-first API** — `lib/api-spec/openapi.yaml` is the single source of truth. Orval generates React Query hooks and Zod validation schemas from it automatically.
- **Clerk proxy** — The frontend routes Clerk FAPI requests through `/api/__clerk` on the Express server to avoid mixed-origin issues in the Replit proxy environment.
- **AI teaser generation** — On questionnaire submission, GPT generates a personalised 3-paragraph teaser (sun/moon/rising analysis + prose reading + cosmic theme) based on the user's birth details and personal answers. The teaser is stored in the DB so it never regenerates on refresh.
- **Object Storage for palm images** — Uploaded palm photos go to Replit Object Storage via a signed-URL flow; only the URL is stored in the chat message.
- **Stripe paywall** — A `PaymentIntent` is created server-side; the client completes it with Stripe Elements. On success, `hasPaid` is set in the DB to unlock the full report.

---

## License

MIT
