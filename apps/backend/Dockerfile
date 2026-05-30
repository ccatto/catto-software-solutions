# apps/backend/Dockerfile
# ---------------------------------------------
# Backend Dockerfile for NestJS App with Prisma 7
# Updated: 2026-02-24
# Node.js Version: 22 (LTS)
# Prisma 7: TypeScript-generated client (no Rust binaries)
# ---------------------------------------------

# ----------- Build Stage ------------
FROM node:22-alpine AS builder

# 1.  Set working directory
WORKDIR /app

# 2 Copy only what's needed for backend
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/database/package.json ./apps/database/
COPY packages ./packages

# 3 Copy source code for backend and database
COPY apps/backend ./apps/backend
COPY apps/database ./apps/database

# 4 Install dependencies with --ignore-platform flag to bypass Node version check
# Use --ignore-scripts to skip postinstall (which tries to build @ccatto/ui) since backend doesn't need it
RUN yarn install --frozen-lockfile --ignore-platform --ignore-scripts

# 5 Generate Prisma 7 client (single invocation, output goes to apps/database/generated/)
RUN cd /app/apps/database && npx prisma generate && yarn build

# 6 Build the backend app (uses SWC builder)
RUN cd /app/apps/backend && yarn build

# ----------- Production Stage - Image ------------
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install build tools needed for native modules like bcrypt
RUN apk add --no-cache python3 make g++

# Copy necessary package files
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/database/package.json ./apps/database/
COPY packages ./packages

# Copy compiled output from builder stage
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/database/dist ./apps/database/dist
# Prisma 7: Copy generated TypeScript client (replaces node_modules/.prisma Rust binaries)
COPY --from=builder /app/apps/database/generated ./apps/database/generated
# Still need @prisma packages for the adapter
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/apps/database/prisma ./apps/database/prisma
# Copy pre-built packages to avoid postinstall rebuild
COPY --from=builder /app/packages/ui/dist ./packages/ui/dist

# Install only production dependencies
# Remove the root postinstall script to prevent @ccatto/ui rebuild (dist already copied)
# This allows bcrypt native module to be built while skipping @ccatto/ui build
RUN npm pkg delete scripts.postinstall && \
    yarn install --production --frozen-lockfile --ignore-platform

# Clean up build tools to reduce image size
RUN apk del python3 make g++

# Set production environment
ENV NODE_ENV production

# Expose application port
EXPOSE 4000

# Start the NestJS application
CMD ["node", "apps/backend/dist/main.js"]
