// prisma/client/index.ts
// Catto App Template - Prisma Client singleton
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../../generated/client/client.js';

const connectionString = process.env.DATABASE_URL;
let prisma: PrismaClient;

if (connectionString) {
  const adapter = new PrismaNeon({ connectionString });
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient();
}

export default prisma;
