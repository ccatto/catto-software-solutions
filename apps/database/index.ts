// apps/database/index.ts
// Catto App Template - Re-export Prisma Client and all types from the generated client
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from './generated/client/client.js';

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // No DATABASE_URL: return a proxy that throws on actual DB access
    // This allows type imports to work without a real connection (e.g., tests, build time)
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === '$connect' || prop === '$disconnect') {
          return () => Promise.resolve();
        }
        if (prop === '$on' || prop === '$use') {
          return () => {};
        }
        throw new Error(
          `PrismaClient: DATABASE_URL is not set. Cannot access .${String(prop)}`,
        );
      },
    });
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export * from './generated/client/client.js';
export { PrismaClient } from './generated/client/client.js';
