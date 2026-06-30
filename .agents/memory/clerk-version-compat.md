---
name: Clerk version compatibility in pnpm monorepo
description: @clerk/react@5.x and @clerk/express@2.x conflict because they need different @clerk/shared major versions; fix by upgrading @clerk/react to 6.x.
---

## The Problem

When `@clerk/express@2.1.33` (for the API server) and `@clerk/react@5.54.0` (for the frontend) are both installed in the same pnpm workspace, pnpm deduplicates `@clerk/shared` to a version that satisfies `@clerk/express` but is incompatible with `@clerk/react@5.x`.

Symptoms: Vite fails at startup with "No matching export for SessionContext / loadClerkUiScript / ClientContext" from `@clerk/shared`.

**Why:** `@clerk/react@5.x` needs `@clerk/shared@^3.33.0` (per its package.json) but the actual published version that works is `@clerk/shared@3.47.7+`, which changed internal export names. Concurrently, `@clerk/express@2.x` resolves to `@clerk/shared@3.x` too but a different compatible patch.

## The Fix

Upgrade `@clerk/react` to `6.x` (latest `6.11.3` as of June 2026). The `6.x` package needs `@clerk/shared@^4.23.0`, which aligns with `@clerk/express@2.x`'s transitive `@clerk/shared@4.x` dependency.

```bash
pnpm --filter @workspace/<frontend> add @clerk/react@6.11.3
```

Also add `@clerk/shared` and `@clerk/react` to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml` since Clerk publishes lockstep and the age-gate can block the companion package.

**How to apply:** Any time you add `@clerk/express` to the API server AND `@clerk/react` to the frontend in the same monorepo, use `@clerk/react@^6` not `@clerk/react@^5`.
