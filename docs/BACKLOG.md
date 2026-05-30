# Catto App Template — Backlog

> Tactical to-do list for getting the template to a known-good baseline before it's forked into product apps. Strategy lives in `PICKLE-PADDLE-REVIEWS-PLAN.md`; this is the punch list.

## Status snapshot

- `chore/template-audit` audit branch merged to `main` (PR #1, commit `b37b6a1`).
- **2026-05-07 dogfooding pass via PicklePaddleReviews** revealed the audit had never actually been verified to boot. `yarn dev` failed with dozens of TS2307 errors, missing peer deps, and a broken next-intl middleware setup. **Boot gate is now green** on `chore/template-boot-gate`.

## Boot gate (resolved 2026-05-07)

`yarn install && yarn dev` against published `@ccatto/*@1.x`:

- [x] `yarn install` succeeds (peer-dep warnings about pino/keyv/express5/Apollo Server v5 are upstream and non-blocking).
- [x] `yarn db:push` succeeds against Neon (uses `dotenv-cli` to source `apps/backend/.env`).
- [x] `yarn dev:backend` boots NestJS at `http://localhost:4000/graphql` — schema introspectable, returns 200.
- [x] `yarn dev:frontend` boots Next at `http://localhost:3000`. Routes `/`, `/en`, `/en/signin`, `/en/signin/register` all return 200.
- [x] `@ccatto/ui` renders the home page card on `/en`.

## Findings from the dogfooding pass

What the audit broke (now fixed on `chore/template-boot-gate`):

### Backend
- `apps/backend/src/app.module.ts`: registered `resolvers: { JSON: GraphQLJSON }` but the audit removed every domain field that used `@Field(() => GraphQLJSON)`. Schema didn't include the JSON scalar, so Apollo refused to bind the resolver. **Fix:** commented out, with a note for re-enabling once the first JSON-typed field lands.

### Database
- `apps/database/package.json` declares `"main": "./dist/index.js"` but no build was run after `yarn install`, so frontend/backend couldn't resolve `@ccatto-app/database`. Yarn 1 workspaces don't trigger the workspace's `prepare` hook on root install. **Fix:** root `postinstall` now runs `yarn workspace @ccatto-app/database build` after Prisma generate.
- `apps/database/prisma.config.ts` reads `DATABASE_URL` via `dotenv/config` from the cwd, but no `apps/database/.env` exists. **Fix:** root `db:*` scripts use `dotenv -e ../backend/.env` so the backend's env file is the single source of truth for dev.

### Frontend — missing peer deps
The published `@ccatto/*` packages declare these as peerDependencies but the template `package.json` was missing all three:
- `@tanstack/react-table` — required by `@ccatto/ui`'s `TableCatto` (static import).
- `libphonenumber-js` — required by `@ccatto/ui`'s `PhoneInputCatto`.
- `@simplewebauthn/browser` — declared *optional* by `@ccatto/react-auth` but Turbopack still resolves the dynamic `await import()` at build time, so it's effectively required.

Also missing:
- `babel-plugin-react-compiler` — `next.config.ts` has `reactCompiler: true` but the dep wasn't installed. Every route 500'd until installed.

### Frontend — dangling code from the audit
The audit deleted `packages/ui` and many `app/components/AtomicDesign/{molecules,templates}/*` files but left consumers importing them. Verified via `tsc --noEmit` (28 TS2307 errors). Two responses:

**Restored as slim, generic baseline pieces:**
- `apps/frontend/navigation.ts` — next-intl routing utilities. Used by `LanguageSwitcherCatto` and the new middleware.
- `apps/frontend/middleware.ts` — `createMiddleware(routing)`. Without this, `getRequestConfig`'s `requestLocale` is undefined and every locale-prefixed page 404s.
- `apps/frontend/zustand/useToastStore.ts` — minimal toast store consumed by `ToastContainerCatto`.
- `app/components/AtomicDesign/molecules/JumbotronCattoFlexible.tsx` — title/description hero used by signin and register pages.
- `app/components/AtomicDesign/templates/ErrorPageCatto.tsx` — used by `not-found.tsx` and `auth/error/page.tsx`. Accepts the same prop shape the consumers were already passing (title, subtitle, description, errorCode, secondaryAction).
- `app/components/AtomicDesign/molecules/Auth/SignInEmailPassFormCatto.tsx` — minimal email+password signin via Better Auth.
- `app/components/AtomicDesign/molecules/Auth/RegisterUserFormCatto.tsx` — companion register form.

**Stripped (product-specific UI that doesn't belong in a generic template):**
- `app/components/AtomicDesign/atoms/Auth/SocialLoginButtonsCatto/` (whole dir): Apple, Google, Facebook, Github, Auth0 OAuth buttons that depended on uninstalled `@fortawesome/*` deps. Apps that want OAuth wire it up via Better Auth providers.
- `app/components/Providers/PushNotificationProvider.tsx`: depended on a missing `@lib/graphql/mutations/push-token.mutations`. Apps that want push add it via `@ccatto/react-push`.
- `app/[locale]/(public)/signin/forgot-password/`, `signin/password-reset/` pages: needed bespoke flows (token lookup, email send, etc.) that aren't generic enough to ship in the baseline. Apps add them as needed.
- `JwtAuthService` passkey + phone OTP methods: depended on `@simplewebauthn/browser` and a missing `auth-graphql.service`. Slimmed to email+password login/register/logout/refresh; apps extending mobile/passkey flows can add their own methods.

**Edited / simplified:**
- `LoginCatto.tsx`: pointed at the new `SignInEmailPassFormCatto` (was importing the broken `SignInEntireFormCatto` with a typo'd double-slash path).
- `NavButtonsCatto.tsx`: stripped `MessagesBellCatto`, `NotificationBellCatto`, `useDefaultOrg`, `LinkAccountCatto`. Kept `LanguageSwitcherCatto`, sign-in/sign-out.
- `app/providers.tsx`: removed `PushNotificationProvider`, set `ThemeProvider defaultTheme="corporate-steel"` (the previous `"default"` isn't a valid `ThemeName` in `@ccatto/ui`'s typed list).
- `lib/auth-client-compat.ts`: re-exports `CompatSession`/`CompatSessionUser` from `@ccatto/react-auth` instead of declaring local duplicates that diverged from the package's type. Mapper provides `organizationId: null, organizations: []` (the package's `CompatSessionUser` carries those Rleaguez-leaked fields as required).
- `lib/auth-session-provider.tsx`: removed `organizationId` and `organizations` from the local `EnrichedUser` fallback paths.
- `lib/auth-better.ts`: tightened the image fallback type to `string | null`.

## Findings to file against `catto-packages` (sister repo)

The template patches above paper over real package gaps. Open issues / track in `catto-packages`:

- [ ] **`@ccatto/ui`'s `THEMES`** includes `"rleaguez"` — a product name leaking into a generic UI lib. Rename or remove.
- [ ] **`@ccatto/react-auth`'s `CompatSessionUser`** carries `organizationId: string | null` and `organizations: Array<...>` as required fields. They should be optional, or extracted into an extension type for apps that have an orgs concept.
- [ ] **`@ccatto/react-auth`'s passkey path** does `await import('@simplewebauthn/browser')` even when the consumer never calls passkey methods. Turbopack bundles dynamic imports, so the dep is effectively required despite the optional peerDep declaration. Either gate the import behind a runtime feature flag or split passkey into its own subpath export.
- [ ] **`@ccatto/ui`'s `TableCatto`** imports `@tanstack/react-table` as a top-level static import — this means even apps that never use a table pay the bundle cost. Consider lazy-loading.

## After boot is green

- [ ] Update `README.md` to reflect npm-only flow (no more in-tree `packages/ui`).
- [ ] Confirm `.env.example` files cover everything the published packages need.
- [ ] Decide whether `apps/mobile` stays in the default template or becomes opt-in.
- [x] **PR `chore/template-boot-gate` → `main`** (this branch).
- [ ] Tag `v0.1.0-baseline` on `main` so product apps can fork from a known-good commit.
- [ ] Re-fork or rebase **PicklePaddleReviews** onto the new baseline.

## Sister-repo work (`catto-packages`)

Tracked here because the template depends on these:

- [ ] Commit the untracked `CLAUDE.md` in `catto-packages`.
- [ ] Patch peer-dep drift: bump Capacitor 7 → 8, Next 15 → 16 in package devDeps/peerDeps.
- [ ] Republish anything affected (likely `@ccatto/ui`, `@ccatto/react-mobile`, `@ccatto/react-push`).
- [ ] Bump versions in template `apps/*/package.json` once republished.

## Pre-scaffold decisions (resolved 2026-05-07)

- [x] **First app name** — `PicklePaddleReviews`, repo at `github.com/ccatto/pickle-paddle-reviews`, package name `pickle-paddle-reviews`, workspace scope `@pickle-paddle/*`.
- [x] **Repo strategy** — fork the template per app, fresh git history (no upstream link).

## Out of scope for this backlog

- Storybook coverage audit on `@ccatto/ui` (nice-to-have, not blocking).
- Sanity-pass of each package README (do as packages are touched).
- Domain layer for product apps — starts only after baseline tag is cut.
