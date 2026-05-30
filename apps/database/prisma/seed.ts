// prisma/seed.ts
// Catto App Template - Database Seeder
// Seeds a sample platform admin user for development.

import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/client/client.js';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed a sample platform admin user
  const adminEmail =
    process.env.SEED_ADMIN_EMAIL || 'admin@example.com';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'platform_admin',
    },
    create: {
      email: adminEmail,
      name: 'Platform Admin',
      role: 'platform_admin',
    },
  });

  console.log(
    `Platform admin seeded: ${admin.email} (role: ${admin.role})`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
