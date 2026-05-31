# Catto Software Solutions — Brand

## Colors

| Token | Hex | Usage |
|---|---|---|
| **Dark navy** | `#01073A` | Primary brand background — logo/favicon background, dark surfaces. |
| **RZ Orange** | `#FF910C` | **Official brand accent** — logo lettering, favicon mark, primary accent. |

### Notes
- The **official accent is RZ Orange `#FF910C`** (a warm amber-orange). Use this for brand marks.
- The marketing site currently renders accents with Tailwind `orange-500` (`#F97316`) / `orange-600` (`#EA580C`), which are *close but not identical* to RZ Orange. **TODO:** align the site accent to `#FF910C` for exact brand consistency (define a custom Tailwind color / CSS variable and replace `orange-500`/`orange-600` usages). Tracked in `APP-BACKLOG.md`.
- The full logo background is a radial gradient: `#01073A` at the edges, lightening toward ~`#0A1B4D` in the center.

## Assets

| Asset | Path | Notes |
|---|---|---|
| Favicon / brand mark | `apps/frontend/app/icon.svg` | Next.js favicon convention (auto-served). Navy square + orange "CSS". |
| Favicon (public copy) | `apps/frontend/public/favicon.svg` | Used for the in-page header mark. |
| Full logo (share image) | `apps/frontend/public/catto-software-solutions-logo.png` | 1774×887 (2:1). Wired as the Open Graph / Twitter share image. |

## Typography

| Role | Font |
|---|---|
| Display / headings | **Urbanist** (`--font-urbanist`) |
| Body | **Montserrat** (`--font-montserrat` / default sans) |
