// apps/backend/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@ccatto-app/database';
import { PrismaNeon } from '@prisma/adapter-neon';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      const adapter = new PrismaNeon({ connectionString });
      this.prisma = new PrismaClient({ adapter });
    } else {
      // No DATABASE_URL: create a no-op proxy for test/build environments
      // Prisma 7 requires a driver adapter, so we can't create a bare PrismaClient
      this.prisma = new Proxy({} as PrismaClient, {
        get(_target, prop) {
          if (prop === '$connect' || prop === '$disconnect') {
            return () => Promise.resolve();
          }
          if (prop === '$on' || prop === '$use') {
            return () => {};
          }
          throw new Error(
            `PrismaService: DATABASE_URL is not set. Cannot access .${String(prop)}`,
          );
        },
      });
    }
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get client(): PrismaClient {
    return this.prisma;
  }
}
