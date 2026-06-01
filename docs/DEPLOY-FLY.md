# Deploy to Fly.io + point GoDaddy DNS

Runbook for getting Catto Software Solutions live on Fly.io and pointing the GoDaddy
domain **cattosoftwaresolutions.com** at it.

> Status (2026-05-31): **frontend + backend deployed to Fly.** Both apps live on
> `*.fly.dev`. Remaining: GoDaddy DNS records for the custom domain (apex/www/api).
> Secrets reference (DB URL, Telnyx, JWT) lives **outside the repo** at
> `GitK8/Docs/catto-software-solutions-secrets.md`.

## Decisions

| Item | Value |
|---|---|
| Domain | `cattosoftwaresolutions.com` (GoDaddy) |
| Frontend app | `catto-software-solutions` → `catto-software-solutions.fly.dev` |
| Backend app | `catto-software-solutions-api` → `catto-software-solutions-api.fly.dev` |
| Region | `iad` (Ashburn, VA) — nearest to the Neon us-east-1 DB |
| Database | Neon project `catto-software-solutions-prod` (us-east-1), created via Vercel Storage |
| Schema sync | `prisma db push` (unpooled URL); no migration history |
| Hostnames | apex + `www` (→ apex 301) for frontend; `api.` for backend |
| Org | `personal` (the only Fly org) |
| Deploy commands | `yarn deploy:frontend` / `yarn deploy:backend` (root package.json) |

## Prerequisites (already in place)

- `flyctl` installed (`fly version`) and **authenticated** as `chriscatto3@gmail.com`.
  - If a token ever expires: `fly auth login`. Confirm with `fly auth whoami`.
- Frontend `apps/frontend/next.config.ts` already uses `output: 'standalone'`.
- `@ccatto/*` packages come from the public npm registry, so the frontend builds without
  the sibling apps. (The root `postinstall` runs Prisma generate for the `database`
  workspace, so the Docker build runs from the repo root with `openssl` installed.)

---

## Phase 1 — Frontend live + domain pointed

### 1. Files to add (repo root unless noted)

Build context must be the **monorepo root**, so Fly config lives at the repo root and
targets the frontend workspace.

- `fly.toml`
  ```toml
  app = 'catto-software-solutions'
  primary_region = 'mia'

  [build]

  [http_service]
    internal_port = 3000
    force_https = true
    auto_stop_machines = true
    auto_start_machines = true
    min_machines_running = 0
    processes = ['app']

  [[vm]]
    memory = '1gb'
    cpu_kind = 'shared'
    cpus = 1
  ```

- `Dockerfile` — multi-stage Node 20-slim, yarn 1.22.22, builds
  `@ccatto-app/frontend` and runs the Next.js **standalone** server on port 3000.
  (See plan for the full sketch. Fallback if the monorepo standalone path misbehaves:
  run `yarn workspace @ccatto-app/frontend start` from the full build image.)

- `.dockerignore`: `node_modules`, `**/node_modules`, `.next`, `**/.next`, `.git`,
  `apps/mobile/ios`, `apps/mobile/android`, `*.md`, `.env*`.

- `apps/frontend/middleware.ts` — redirect `www` → apex (fold into existing middleware
  if next-intl already created one).

### 2. Create the app + deploy

```bash
cd catto-software-solutions
fly apps create catto-software-solutions --org personal

fly deploy \
  --build-arg NEXT_PUBLIC_BASE_URL=https://cattosoftwaresolutions.com \
  --build-arg NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://cattosoftwaresolutions.com/graphql
```

Smoke test: open `https://catto-software-solutions.fly.dev`.

### 3. Attach the domain (Fly side)

```bash
fly certs add cattosoftwaresolutions.com      --app catto-software-solutions
fly certs add www.cattosoftwaresolutions.com  --app catto-software-solutions
fly ips list   --app catto-software-solutions    # note shared IPv4 + dedicated IPv6
fly certs show cattosoftwaresolutions.com        # exact DNS records Fly wants
```

### 4. GoDaddy DNS (Domain → DNS → Manage Records)

Apex can't be a CNAME on GoDaddy, so apex uses A/AAAA and `www`/`api` use CNAMEs.
Actual values from this deploy (`fly ips list --app catto-software-solutions`):

| Type  | Name | Value | Notes |
|-------|------|-------|-------|
| A     | `@`   | `66.241.125.8`                          | apex → frontend |
| AAAA  | `@`   | `2a09:8280:1::11d:c432:0`               | apex → frontend |
| CNAME | `www` | `catto-software-solutions.fly.dev`     | www → frontend (301 to apex) |
| CNAME | `api` | `catto-software-solutions-api.fly.dev` | api → backend |

- First remove any GoDaddy parking/forwarding records on `@`, `www`, `api`.
- Add any `_acme-challenge` CNAME that `fly certs show` lists.
- Drop TTL to ~600s during the cutover. Fly auto-issues TLS once DNS resolves.

### 5. Validate

```bash
fly certs check cattosoftwaresolutions.com     --app catto-software-solutions
fly certs check www.cattosoftwaresolutions.com --app catto-software-solutions
dig +short cattosoftwaresolutions.com A
dig +short www.cattosoftwaresolutions.com CNAME
```

- `https://cattosoftwaresolutions.com` loads with valid TLS.
- `https://www.cattosoftwaresolutions.com` 301s to the apex.
- `fly status` healthy, `fly logs` clean. Cert issuance takes minutes to ~1h.

---

## Phase 2 — Backend (NestJS) + Postgres — DONE (2026-05-31)

What was actually done (powers the contact-form SMS):

1. **DB — Neon (not Fly Postgres).** Project `catto-software-solutions-prod`, region
   `aws-us-east-1`, in the **Vercel: ccatto's projects** org.
   - ⚠️ That org is **Vercel-managed**, so `neonctl`/Neon console **cannot** create
     projects in it (`action restricted; organization is managed by Vercel`). Create the
     DB from **Vercel → Storage → Neon** instead. When it prompts "Connect a Project",
     click **Skip** (we deploy to Fly, not Vercel).
   - Copy both connection strings: pooled (`-pooler` host) for runtime, unpooled for DDL.
2. **Schema:** no Prisma migrations exist, so sync with **`prisma db push`** using the
   **unpooled** URL (pgbouncer breaks DDL):
   ```bash
   cd apps/database && DATABASE_URL='<unpooled>' npx prisma db push
   ```
3. **API app:** `fly apps create catto-software-solutions-api --org personal`.
   Config: `apps/backend/fly.toml` (app name + region `iad`, internal port 4000) and
   `apps/backend/Dockerfile` (CMD runs `dist/src/main.js` — note the `src/` because
   `app.controller.ts` imports `../package.json`).
4. **Secrets** (`fly secrets set --app catto-software-solutions-api`):
   `DATABASE_URL` (pooled), `JWT_SECRET`, `JWT_EXPIRATION`, `TELNYX_API_KEY`,
   `TELNYX_PHONE_NUMBER`, `TELNYX_MESSAGING_PROFILE_ID`, `ADMIN_PHONE`,
   `CORS_ORIGIN=https://cattosoftwaresolutions.com`, `NODE_ENV=production`.
   Values are in `GitK8/Docs/catto-software-solutions-secrets.md` (outside the repo).
5. **Deploy:** `yarn deploy:backend` (= `fly deploy --config apps/backend/fly.toml
   --dockerfile apps/backend/Dockerfile`).
6. **Subdomain:** `fly certs add api.cattosoftwaresolutions.com --app
   catto-software-solutions-api` + GoDaddy `CNAME api → catto-software-solutions-api.fly.dev`.
7. **Frontend → backend wiring:** the frontend was built with
   `NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.cattosoftwaresolutions.com/graphql` (baked at
   build time via `yarn deploy:frontend`). CORS on the backend allows the apex origin.

> Not used yet: Better Auth / OAuth secrets (no auth on the marketing site) and
> `prisma migrate deploy` (using `db push` until a migration history is introduced).

---

## Notes

- Costs: one small Fly machine is cheap/free-tier; a dedicated IPv4 (~$2/mo) is optional;
  Phase 2 Postgres adds a small monthly cost.
- The only build risk is the monorepo `.next/standalone` layout — verify during the first
  `fly deploy`; the `yarn workspace ... start` fallback always works.
