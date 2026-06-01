# syntax = docker/dockerfile:1
# Root Dockerfile — builds the Next.js frontend (@ccatto-app/frontend) for Fly.io.
# Build context = monorepo root. Mirrors the proven rleaguez frontend image.
# The frontend imports @ccatto-app/database (Better Auth -> Prisma), so we generate
# the Prisma client and build the database workspace before `next build`.

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Next.js/Prisma"
WORKDIR /app
ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.22
RUN npm install -g yarn@$YARN_VERSION --force

# ---------------- Build stage ----------------
FROM base AS build

# Public env baked into the client bundle at build time.
ARG NEXT_PUBLIC_BASE_URL="https://cattosoftwaresolutions.com"
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT="https://api.cattosoftwaresolutions.com/graphql"

# System deps for native modules + Prisma (openssl).
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Force yarn 1 to ignore platform checks (prevents @esbuild/darwin errors on Linux).
RUN echo '--ignore-platform true' > /app/.yarnrc

# Workspace manifests first (better layer caching).
# Note: @ccatto/* come from the public npm registry — there is NO local packages/ dir.
COPY package.json yarn.lock* ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/database/package.json ./apps/database/

# Install all deps. Strip macOS esbuild entries from the lockfile so the Linux
# builder doesn't choke. --ignore-scripts skips the root postinstall (we run the
# Prisma generate + database build explicitly below).
RUN sed -i '/@esbuild\/darwin/,/^$/d' /app/yarn.lock && \
    yarn install --production=false --ignore-scripts --ignore-engines --ignore-platform

# Source for the workspaces the frontend needs.
COPY apps/database ./apps/database
COPY apps/frontend ./apps/frontend

# Prisma 7: generate the TypeScript client, then build the database workspace
# (frontend imports `{ prisma }` from @ccatto-app/database -> dist/index.js).
RUN cd /app/apps/database && \
    npx prisma generate && \
    yarn build

# Reinstall sharp for the build platform (standalone image quirk).
RUN cd /app/apps/frontend && yarn add sharp --ignore-engines --force

# Build the Next.js app (standalone output).
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT
RUN cd /app/apps/frontend && yarn run build

# ---------------- Production stage ----------------
FROM base

# Runtime-only deps (openssl for Prisma).
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Next standalone output (includes a minimal server.js + traced node_modules).
COPY --from=build /app/apps/frontend/.next/standalone /app
COPY --from=build /app/apps/frontend/.next/static /app/apps/frontend/.next/static
COPY --from=build /app/apps/frontend/public /app/apps/frontend/public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Monorepo standalone places the server entry at apps/frontend/server.js.
CMD ["node", "apps/frontend/server.js"]
