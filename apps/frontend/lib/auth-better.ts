/**
 * Better Auth Server Configuration
 *
 * Configures Better Auth with Prisma adapter.
 * TODO: Add your custom session enrichment hooks.
 *
 * @see https://www.better-auth.com/docs/installation
 */

import { prisma } from '@ccatto-app/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { log } from '../app/lib/logger';

// Token expiry: 69 days
const TOKEN_EXPIRY_SECONDS = 69 * 24 * 60 * 60;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
  },

  // TODO: Configure your OAuth providers
  socialProviders: {
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
    // facebook: {
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // },
  },

  session: {
    expiresIn: TOKEN_EXPIRY_SECONDS,
    updateAge: 24 * 60 * 60, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  plugins: [nextCookies()],
});

// Types
export type EnrichedSession = {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: string;
    // TODO: Add your custom session fields here
  };
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
};

/**
 * Get enriched session with custom fields
 * TODO: Add your domain-specific session enrichment
 */
export async function getEnrichedSession(
  headers: Headers,
): Promise<EnrichedSession | null> {
  try {
    const session = await auth.api.getSession({ headers });
    if (!session) return null;

    // Fetch user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, image: true },
    });

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: user?.image ?? session.user.image ?? null,
        role: user?.role || 'user',
        // TODO: Add your custom enrichment (e.g., organizations, permissions)
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
        token: session.session.token,
        createdAt: session.session.createdAt,
        updatedAt: session.session.updatedAt,
        userId: session.session.userId,
      },
    };
  } catch (error) {
    log.error('[BETTER-AUTH] Error getting enriched session', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
