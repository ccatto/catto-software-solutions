# Handoff — `@ccatto/react-analytics` (reusable GA4 package)

> **Goal:** extract the Google Analytics (GA4) wiring we just added to `catto-software-solutions`
> into a shared `@ccatto/*` package, so every Catto app (pickle-paddle-reviews, rleaguez, future
> apps) drops in analytics the same way — one import, one env var, done.
>
> **This doc lives in the app repo but describes work for the sister repo `catto-packages`.**
> Paste it into a coding session opened in `catto-packages`.

## Why a new package (not `@ccatto/ui` / `@ccatto/react-auth`)

Analytics is orthogonal to UI and auth. A standalone package lets an app add tracking without
pulling in the UI kit or auth stack, and keeps the dependency (`@next/third-parties`) isolated.
Mirrors how `@ccatto/nest-sms` and `@ccatto/nest-recaptcha` are split out by concern.

## What the current (pre-package) implementation looks like

Reference the working code in `catto-software-solutions` — the package should generalize exactly this:

- `apps/frontend/app/[locale]/layout.tsx`
  ```tsx
  import { GoogleAnalytics } from '@next/third-parties/google';
  // ...
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // ...inside <body>, after the app tree:
  {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
  ```
- Env convention: **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** (public, `G-XXXXXXXXXX`).
- Blank locally (no dev traffic to GA); baked into the Dockerfile ARG/ENV for production builds.

## Package spec

**Name:** `@ccatto/react-analytics`
**Scope:** Next.js App Router (React Server Components). Client-safe.

### Peer dependencies
- `next` (>= 13, tested on 16)
- `react` (>= 18)
- `@next/third-parties` (match the app's Next major, e.g. `16.x`)

Declare all three as `peerDependencies` (not bundled) so the app controls the versions — this is
the same lesson from the template boot-gate work (peer-dep drift caused breakages).

### Public API

```ts
// src/index.ts
export { GoogleAnalyticsCatto } from './GoogleAnalyticsCatto';
export { trackEvent } from './trackEvent';
```

**1. `<GoogleAnalyticsCatto />`** — drop-in component.
- Props: `{ gaId?: string }`. If `gaId` is omitted, reads `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Renders `@next/third-parties/google`'s `<GoogleAnalytics gaId={id} />` **only when an id is present**;
  otherwise renders `null` (so dev/preview builds with no id send nothing).
- No `'use client'` needed at the wrapper level — `@next/third-parties` handles the client boundary.

```tsx
// src/GoogleAnalyticsCatto.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export function GoogleAnalyticsCatto({ gaId }: { gaId?: string }) {
  const id = gaId ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;
  return <GoogleAnalytics gaId={id} />;
}
```

**2. `trackEvent(name, params?)`** — typed custom-event helper.
- Thin wrapper over `sendGAEvent` from `@next/third-parties/google`.
- No-ops safely when GA isn't loaded (e.g. env var unset), so call sites never need guards.

```tsx
// src/trackEvent.tsx
'use client';
import { sendGAEvent } from '@next/third-parties/google';

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    sendGAEvent('event', name, params ?? {});
  } catch {
    /* GA not configured — no-op */
  }
}
```

### Build / package conventions (match sibling packages)
- TypeScript, emit `dist/` with types. `"main": "./dist/index.js"`, `"types": "./dist/index.d.ts"`.
- `"sideEffects": false` for tree-shaking.
- Follow the existing `@ccatto/*` `tsconfig`, build script, and `prepare`/`prepublishOnly` setup.
- README with the 3-step usage below.
- Version `1.0.0`, publish to the public npm registry like the other `@ccatto/*` packages.

## How an app consumes it (the payoff)

```bash
yarn add @ccatto/react-analytics @next/third-parties
```

```tsx
// app/[locale]/layout.tsx (or app/layout.tsx)
import { GoogleAnalyticsCatto } from '@ccatto/react-analytics';

// inside <body>, after the app tree:
<GoogleAnalyticsCatto />
```

```bash
# .env / Dockerfile ARG — public id, safe to bake in
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Custom events anywhere in a client component:
```tsx
import { trackEvent } from '@ccatto/react-analytics';
trackEvent('contact_submit', { plan: 'pro' });
```

## Migration checklist for `catto-software-solutions` (after publish)

1. `yarn add @ccatto/react-analytics` in `apps/frontend`.
2. In `app/[locale]/layout.tsx`: replace the direct `import { GoogleAnalytics } from '@next/third-parties/google'`
   + the `{gaMeasurementId ? ... : null}` block with a single `<GoogleAnalyticsCatto />`.
   (`@next/third-parties` stays as a dep — it's now a peer of the package.)
3. Keep the `NEXT_PUBLIC_GA_MEASUREMENT_ID` env + Dockerfile ARG/ENV exactly as-is.
4. Verify GA **Realtime** still logs a hit after `fly deploy`.

## Rollout to other apps

- **pickle-paddle-reviews** — add the package + its own `G-...` id (separate GA4 property, tracked in
  that repo's launch doc). Also lets us reuse `trackEvent` for app-store-funnel events later.
- **rleaguez** — already has a GA4 property (`447018220`); swap any bespoke GA snippet for this package.

## Nice-to-haves (later, not v1)
- Optional consent gating (`enabled` prop / cookie-consent hook) for GDPR regions.
- A `GoogleTagManagerCatto` sibling export (wraps `GoogleTagManager`) if any app needs GTM.
- Cloudflare Web Analytics variant for apps that want a cookieless option.
