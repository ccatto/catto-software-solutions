# Catto App Template - Claude Context File

> A full-stack TypeScript monorepo template with auth, GraphQL, i18n, and mobile support.

## Project Overview

This is a template for building modern full-stack applications. Fork this repo and customize it for your project.

**Tech Stack**: Next.js 16 + NestJS 11 + Prisma + PostgreSQL + Capacitor

## Monorepo Structure

**Yarn workspace + TurboRepo** monorepo:

```
catto-app-template/
├── apps/
│   ├── frontend/     # Next.js 16 app
│   ├── backend/      # NestJS API (GraphQL)
│   ├── database/     # Prisma ORM
│   └── mobile/       # Capacitor iOS/Android wrapper
├── docs/             # Documentation
└── CLAUDE.md         # This file
```

## Key Commands

```bash
yarn dev              # Run all apps
yarn dev:frontend     # Frontend only (http://localhost:3000)
yarn dev:backend      # Backend only (http://localhost:4000/graphql)
yarn build            # Build everything
yarn db:push          # Push Prisma schema to DB
yarn db:studio        # Open Prisma Studio
yarn prisma:generate  # Generate Prisma client
yarn test             # Run all tests
yarn prettier         # Format code
```

> **IMPORTANT: Always use Yarn, never npm!**

## Authentication (Dual-Auth System)

The app uses two authentication systems:

| System | Use Case | Storage |
|--------|----------|---------|
| **Better Auth** | OAuth (Google, Facebook, etc.) | Cookies/Session |
| **JWT Auth** | Email/password, Mobile | Capacitor Preferences |

Always check both:
```tsx
const { data: session } = useSession();         // Better Auth (OAuth)
const { user: jwtUser, isAuthenticated } = useAuth(); // JWT (mobile/email)
const userId = session?.user?.id || jwtUser?.userId;
```

## Frontend Conventions

- **Component Library**: Use `@ccatto/ui` components (ButtonCatto, CardCatto, etc.)
- **i18n**: All user-facing text uses `next-intl`. Add keys to `en.json` and `es.json`.
- **Styling**: Tailwind CSS v4, dark mode with `dark:` prefix
- **State**: Zustand for global state, Apollo Client for server state
- **Logging**: Use `log` from `@app/lib/logger` — never `console.log`
- **Forms**: React Hook Form + Zod validation
- **Profanity**: Use `@NoProfanity()` decorator (backend) and `noProfanityCheck` (frontend)

## Backend Conventions

- **Modules**: NestJS module pattern in `src/modules/`
- **GraphQL**: Code-first with decorators
- **Auth**: JWT guards and decorators in `src/auth/`
- **Validation**: class-validator + class-transformer
- **Database**: Prisma Client via PrismaModule

## Development Workflow

1. After Prisma schema changes: `yarn db:push && yarn prisma:generate`
2. After modifying files: `yarn prettier`
3. After completing features: Update docs as needed

## Important File Locations

- Root package.json: `/package.json`
- Frontend: `/apps/frontend/`
- Backend: `/apps/backend/`
- Prisma schema: `/apps/database/prisma/schema.prisma`
- i18n messages: `/apps/frontend/messages/`
