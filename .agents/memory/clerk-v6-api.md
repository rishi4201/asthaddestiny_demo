---
name: Clerk React v6 API changes
description: Breaking API changes in @clerk/react v6 — SignedIn/SignedOut removed, publishableKeyFromHost moved.
---

## Removed in v6

- `SignedIn` component — use `const { isSignedIn } = useAuth()` and conditional rendering
- `SignedOut` component — use `const { isSignedIn } = useAuth()` and `!isSignedIn`
- `publishableKeyFromHost` from `@clerk/react/internal` — removed. Use `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY` directly.

## Still Available in v6

- `ClerkProvider`, `SignIn`, `SignUp` (embedded components)
- `useAuth`, `useUser`, `useClerk`, `useSession`
- `UserButton`, `SignInButton`, `SignOutButton`, `SignUpButton`
- `ClerkLoaded`, `ClerkLoading`, `Show`
- `@clerk/themes` dark theme still works

**How to apply:** When the design subagent writes frontend Clerk code, check for `SignedIn`/`SignedOut` usage and replace before running.
