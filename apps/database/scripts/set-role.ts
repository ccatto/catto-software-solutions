// One-off admin utility: set a user's role by email.
//
//   yarn db:set-role <email> [role]
//
// role defaults to "platform_admin". Runs against DATABASE_URL (sourced from
// apps/backend/.env.local / .env by the yarn script). If the email isn't found,
// it lists the existing users so you can pick the right one.
import { PrismaClient, UserRole } from '@ccatto-app/database';
import { PrismaNeon } from '@prisma/adapter-neon';

async function main() {
  const email = process.argv[2];
  const role = (process.argv[3] ?? 'platform_admin') as UserRole;

  if (!email) {
    console.error('Usage: yarn db:set-role <email> [role]');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Check apps/backend/.env.local');
    process.exit(1);
  }

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const users = await prisma.user.findMany({
        select: { email: true, role: true },
        orderBy: { createdAt: 'asc' },
      });
      console.error(`\n❌ No user with email "${email}".`);
      if (users.length) {
        console.error('Existing users:');
        for (const u of users) console.error(`  - ${u.email} (${u.role})`);
      } else {
        console.error('There are no users yet — sign in once, then re-run.');
      }
      process.exitCode = 1;
      return;
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { role },
    });
    console.log(`\n✅ ${updated.email} is now role="${updated.role}"`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
