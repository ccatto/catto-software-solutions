# Catto App Template

A production-ready, full-stack TypeScript monorepo template for building modern web and mobile applications.

## What's Included

- **Next.js 16** frontend with React 19, Tailwind CSS v4, and Apollo Client
- **NestJS 11** backend with GraphQL (Apollo Server 4)
- **Prisma 7** ORM with PostgreSQL
- **Capacitor 8** for iOS and Android mobile apps
- **Better Auth** + JWT dual authentication system
- **Internationalization** (next-intl) with English and Spanish
- **14 reusable @ccatto/* packages** consumed from npm (UI components, auth, push notifications, email, payments, and more)
- **TurboRepo** for fast monorepo builds

## Quick Start

```bash
# Clone and install
git clone https://github.com/ccatto/catto-app-template.git my-app
cd my-app
yarn install

# Set up environment
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env
# Edit .env files with your database URL and secrets

# Set up database
yarn db:push

# Run development servers
yarn dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000/graphql

## Documentation

- [Getting Started](docs/GETTING-STARTED.md) - Full setup guide
- [CLAUDE.md](CLAUDE.md) - AI assistant context file

## Architecture

```
catto-app-template/
├── apps/
│   ├── frontend/     # Next.js 16 (pages, components, i18n)
│   ├── backend/      # NestJS (GraphQL API, auth, modules)
│   ├── database/     # Prisma schema and migrations
│   └── mobile/       # Capacitor (iOS/Android)
├── docs/             # Documentation
└── CLAUDE.md         # AI context file
```

## License

MIT
