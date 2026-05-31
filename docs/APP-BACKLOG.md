# Catto Software Solutions — App Backlog

> Product backlog for the Catto Software Solutions marketing site + app.
> (The inherited `BACKLOG.md` is about the upstream template baseline — this file is app-specific.)

## Context / infrastructure

- **Domain registrar + DNS:** GoDaddy (`cattosoftwaresolutions.com`)
- **App hosting:** Fly.io
- **Current contact email placeholder:** `chriscatto3@gmail.com` (used in footer, contact form, and legal pages)

---

## High priority

### 1. Set up a branded email: `chris@cattosoftwaresolutions.com` → forward to Gmail
- Goal: a professional address that forwards to `chriscatto3@gmail.com`.
- **Recommended (free):** ImprovMX — add its two MX records (+ optional SPF TXT) in **GoDaddy DNS**, then map `chris@` → `chriscatto3@gmail.com`. GoDaddy's own forwarding is now a paid add-on.
- **Send *from* the address too:** requires a real mailbox — Google Workspace (~$6/user/mo) or Zoho Mail (free tier). Optional.
- After it's live: swap `chriscatto3@gmail.com` → `chris@cattosoftwaresolutions.com` in:
  - `apps/frontend/app/components/FooterCatto/FooterCatto.tsx`
  - `apps/frontend/app/components/marketing/ContactSection.tsx`
  - `apps/frontend/app/[locale]/(public)/{privacy,terms,support}/page.tsx`

### 2. Decide: visible email vs. contact-form-only
- Legally, the App Store / privacy laws **do not require a visible email** — a working contact form that reaches you is sufficient.
- Option A: keep the public email in footer/legal/support (current state).
- Option B: **form-only** — remove the public email, and make the contact form notify Chris directly (email and/or SMS). If chosen, update footer + legal + support pages to point to the form instead of `mailto:`.
- Tied to item #3 (the form needs a real backend either way).

### 3. Wire the contact form to a real endpoint — IN PROGRESS (SMS-only)
- **Done (branch `feat/contact-form-sms-notify`):** form now posts to the backend GraphQL mutation `submitContactMessage`, which texts the team via `@ccatto/nest-sms` (Telnyx) — mirrors the rleaguez contact module.
  - Backend: `apps/backend/src/modules/contact/` (module + resolver + service + input DTO); `CattoSmsModule.forRootAsync` uncommented in `app.module.ts`; `@ccatto/nest-sms` added to `package.json`.
  - Frontend: `ContactSection.tsx` `handleSubmit` does a direct `fetch` to `NEXT_PUBLIC_GRAPHQL_ENDPOINT` (no ApolloProvider dependency), with loading + error states.
  - Env: set `TELNYX_API_KEY`, `TELNYX_PHONE_NUMBER`, `TELNYX_MESSAGING_PROFILE_ID`, `ADMIN_PHONE` (and `CORS_ORIGIN` in prod). See `apps/backend/.env.example`.
- **Requires the backend to be deployed/running** for production (see deployment item #10).
- **Follow-ups:** add `@NoProfanity()` to the input DTO + reCAPTCHA (`@ccatto/nest-recaptcha`) for spam protection; optionally add email copy via `@ccatto/nest-email`; optionally persist submissions to the DB (Prisma) like rleaguez.

---

## Medium priority

### 4. Real project screenshots (Work section)
- `apps/frontend/app/components/marketing/WorkSection.tsx` uses placeholder image areas (`// TODO`).
- Add real screenshots to `public/work/` and render them in the project cards.

### 5. Confirm project one-line descriptions
- The pitches for **800Auto Two** and **NeuroVista Art AI** in `WorkSection.tsx` are best-guess placeholders — replace with accurate one-liners.

### 6. Confirm "10+ years" experience claim
- `AboutSection.tsx` (`CONFIRM:` marker) — adjust to the true number.

### 6b. Align site accent to RZ Orange (#FF910C)
- The site currently uses Tailwind `orange-500` (`#F97316`) / `orange-600` (`#EA580C`) for accents; the official brand orange is **RZ Orange `#FF910C`** (see `BRAND.md`).
- Define a custom Tailwind color / CSS variable for the brand orange and replace `orange-500`/`orange-600` usages across the marketing components for exact brand consistency.

### 7. Attorney review of legal pages
- Privacy, Terms, and Support pages are solid drafts (Florida-governed) but should be reviewed by a lawyer before public launch / app-store submission.

---

## Later (when the mobile app ships)

### 8. Account deletion page/flow
- Apple & Google require account deletion (in-app + ideally a web URL) **if the app has user accounts**. Add `/account/deletion` and an in-app delete option when the mobile app surfaces auth.

### 9. Logo / wordmark assets
- Hero now uses the full CSS logo (`public/catto-software-solutions-logo.png`, 1774×887, 2:1).
- Header & footer use a text wordmark ("CSS Catto Software Solutions") — the cat icon was removed.
- TODO: create a **short/wide logo variant** (e.g. ~4:1, transparent background) for the header, plus a **favicon** and an **Open Graph / social share image** derived from the logo. Wire the OG image into `app/[locale]/layout.tsx` (`openGraph.images`).

### 10. Deployment wiring (GoDaddy → Fly.io)
- Point `cattosoftwaresolutions.com` DNS (at GoDaddy) to the Fly.io app; configure custom domain + TLS on Fly.io.
