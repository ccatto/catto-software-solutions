# PicklePaddleReviews — App #1 Plan

> Working doc capturing the goal, current state of the two foundation repos, and what we need to land before we scaffold the first real app from the template. Picking up from a lost chat — re-establishing context.

## Goal

Stand up **PicklePaddleReviews** (working name — open to a better one) as the first product app built on top of:

- `catto-app-template` — the monorepo skeleton we'll fork per app
- `catto-packages` — the published `@ccatto/*` libraries the template consumes

The bigger goal isn't this one app. It's that **app #2, #3, and #11** can be cranked out by forking the template and adding business logic, with all the framework already in place — auth, GraphQL, Prisma, i18n, mobile, push, payments, email, SMS, profanity, reCAPTCHA. Think of it as a CMS-ish starting line: framework done, we add the domain.

So before we scaffold PicklePaddleReviews, both foundation repos need to be in solid shape.

## Naming

`PicklePaddleReviews` is the placeholder. Brainstorm before scaffold:
- Reviews-focused? → `PaddleRater`, `DinkReviews`, `PicklePulse`
- Broader? → `PickleHub`, `CourtNotes`
- Decide before creating the repo so we're not renaming the whole monorepo later.

## Current State of `catto-app-template`

**Branch:** `chore/template-audit`
**Status:** Heavy in-flight pruning — 474 files deleted, 49 modified, no commits on the branch yet.

### What the audit is doing

Migrating the template from **in-tree workspace packages** (`@catto/*` under `packages/`) to **consuming the published `@ccatto/*` packages from npm**.

Evidence:
- `apps/frontend/package.json`: `@catto/ui: "*"` → `@ccatto/ui: "^1.1.0"` (and same for `logger`, `profanity`, `react-auth`, `react-push`)
- The entire `packages/ui/` tree (Tabs, Toast, Tooltip, ThemeSwitcher, ViewToggle, themes, locales, hooks, utils — ~57k lines) is deleted from the template
- Root `package.json` workspaces narrowed from `apps/*` + `packages/*` to just `apps/*`
- Many auth/decorator/guard/validator files modified across `apps/backend` (likely import path updates `@catto/*` → `@ccatto/*`)

### Stack the template provides

- **Frontend** — Next.js 16, React 19, Tailwind v4, Apollo Client, next-intl (en/es), Zustand, RHF + Zod
- **Backend** — NestJS 11, GraphQL (Apollo Server 4 code-first), Better Auth + JWT dual auth
- **Database** — Prisma 7 + Postgres
- **Mobile** — Capacitor 8 (iOS/Android wrapper around the frontend)
- **Tooling** — Yarn 1 workspaces + TurboRepo, Playwright e2e, prettier
- **Layout** — `apps/frontend`, `apps/backend`, `apps/database`, `apps/mobile`

### What's left before we scaffold from this template

- [ ] Commit and finish the `chore/template-audit` branch (currently 0 commits, 523 files staged)
- [ ] Verify `yarn install && yarn dev` runs end-to-end against the published `@ccatto/*@1.x` packages
- [ ] Confirm all `@catto/*` import sites in `apps/backend` and `apps/frontend` were rewritten to `@ccatto/*` (grep)
- [ ] Decide whether `apps/mobile` stays in the default template or becomes opt-in (adds setup friction for non-mobile apps)
- [ ] Update `README.md` and `docs/GETTING-STARTED.md` to reflect the npm-only flow (no more in-tree `packages/ui`)
- [ ] Confirm `.env.example` files cover everything the published packages need (SendGrid, Telnyx, Stripe, FCM, reCAPTCHA keys)
- [ ] Open PR, merge to `main`, tag a template baseline so PicklePaddleReviews can fork from a known-good commit

## Current State of `catto-packages`

**Branch:** `chore-audit-may-the-forth`
**Status:** Clean working tree — only an untracked `CLAUDE.md` (the doc that describes how this repo works). All real work landed via PRs #1–#8 already merged.

### What's there

14 packages under `packages/`, all published to npm under `@ccatto/*`. All at `1.0.0` except `@ccatto/ui` at `1.1.0`.

| Package | Role |
|---|---|
| `@ccatto/ui` `1.1.0` | React component library (atomic design, Tailwind, themes) |
| `@ccatto/logger` | Pino factories (browser + Node) |
| `@ccatto/shared` | Shared utils (geo, color, profanity re-exports) — lives in `packages/catto-shared/` |
| `@ccatto/profanity` | Content moderation |
| `@ccatto/react-auth` | Better Auth + JWT + mobile auth hooks |
| `@ccatto/react-contact` | Contact form + reCAPTCHA |
| `@ccatto/react-mobile` | Capacitor hooks (haptics, deep links, network, …) |
| `@ccatto/react-push` | Push hooks (web + mobile) |
| `@ccatto/nest-auth` | JWT, WebAuthn, guards, decorators |
| `@ccatto/nest-email` | SendGrid |
| `@ccatto/nest-sms` | Telnyx |
| `@ccatto/nest-payments` | Stripe |
| `@ccatto/nest-push` | Firebase FCM |
| `@ccatto/nest-recaptcha` | Google reCAPTCHA v3 |

### Build / publish pipeline

- Yarn 1 workspaces + Turbo
- Browser/React packages: `tsup` build (ESM+CJS+d.ts), `vitest` test
- NestJS packages: `tsc` build (`tsconfig.build.json`), `jest` test
- CI on PR runs `yarn build` + `yarn test`
- `publish.yml` on `main` checks `npm view <pkg>@<version>` per package and publishes only what's not already there
- Auth via `NPM_TOKEN` (90-day granular token, rotation in `docs/npm-publishing.md`)

### What's left before app #1 depends on these

- [ ] Sanity-pass each of the 14 packages — does each one actually do what its README claims, with a usage example?
- [ ] Add at least one integration smoke test per Nest package against a throwaway app (does `@ccatto/nest-auth` boot inside a fresh NestJS module?)
- [ ] Decide whether `react-contact` should be in the default template or pulled in per-app
- [ ] Storybook coverage for `@ccatto/ui` — confirm every exported component has a story (catches dead exports)
- [ ] Lock peer dep ranges — Next 15 vs 16, React 19, Capacitor 7 vs 8 (the template is on Capacitor 8, packages list Capacitor 7 in devDeps)
- [ ] Bump `@ccatto/ui` past 1.1.0 once the template audit lands and exposes any gaps
- [ ] Commit the `CLAUDE.md` (it's untracked but already accurate)

## Open questions

1. **Capacitor version drift** — template uses Capacitor 8, `catto-packages` declares Capacitor 7 in devDependencies. Which is the source of truth? (Template likely; bump packages.)
2. **Next version drift** — `catto-packages` devDeps list `next: ^15.2.0`, template ships Next 16. Same question.
3. **Workspace deps in the template** — once `packages/ui` is fully removed, does the template still need *any* workspace package, or is it pure `apps/*`? Simpler is better.
4. **App naming convention** — fork the template repo per app (`pickle-paddle-reviews`), or keep one monorepo with multiple `apps/*`? Forking gives independence; mono gives shared deploy.

## Path forward (proposed order)

1. **Finish `catto-app-template`'s audit branch** — commit, verify boot, PR, merge.
2. **Patch `catto-packages` peer-dep drift** (Next 16, Capacitor 8), republish anything affected.
3. **Lock a template baseline tag** (e.g. `v0.1.0-baseline`).
4. **Fork the template** as the PicklePaddleReviews repo (final name TBD).
5. **Domain layer only from here** — Prisma models for paddles/reviews/users, GraphQL resolvers, review UI flows. No framework changes in the app repo; if something's missing, it goes back into the template or a `@ccatto/*` package.

## Pointers

- Template repo: `C:\Users\ChrisCatto\OneDrive - Vertical Bridge\Documents\Code\K8\catto-app-template` (branch `chore/template-audit`)
- Packages repo: `C:\Users\ChrisCatto\OneDrive - Vertical Bridge\Documents\Code\K8\catto-packages` (branch `chore-audit-may-the-forth`)
- Template CLAUDE.md: `catto-app-template/CLAUDE.md`
- Packages CLAUDE.md: `catto-packages/CLAUDE.md` (currently untracked)
- Publishing docs: `catto-packages/docs/npm-publishing.md`
- Getting started: `catto-app-template/docs/GETTING-STARTED.md`
