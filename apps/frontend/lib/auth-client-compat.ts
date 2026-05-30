/**
 * Better Auth Compatibility Layer
 *
 * Drop-in replacement for `next-auth/react` exports.
 * Provides the same API surface (useSession, signIn, signOut, getSession)
 * so that consumer files only need an import path change.
 *
 * @example
 * import { useSession, signIn, signOut } from '@lib/auth-client-compat';
 */

'use client';

import {
  authClient,
  BetterSessionProvider,
  useBetterSessionContext,
  type EnrichedSession,
} from './auth-client-better';
import { sessionStore } from './stores/session-store';
import type {
  CompatSession,
  CompatSessionUser,
} from '@ccatto/react-auth';

// =============================================================================
// Types (re-exported from @ccatto/react-auth)
// =============================================================================
export type { CompatSession, CompatSessionUser };

// =============================================================================
// Hooks
// =============================================================================

/**
 * Drop-in replacement for NextAuth's useSession().
 * Returns { data, status } matching the NextAuth API.
 *
 * Must be used within a BetterSessionProvider.
 */
export function useSession(): {
  data: CompatSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: () => Promise<void>;
} {
  const { session: enriched, status, refetch } = useBetterSessionContext();

  const data: CompatSession | null = enriched
    ? mapEnrichedToCompat(enriched)
    : null;

  return { data, status, update: refetch };
}

// =============================================================================
// Auth Actions
// =============================================================================

/**
 * Drop-in replacement for NextAuth's signIn().
 */
export async function signIn(
  provider: string,
  options?: {
    callbackUrl?: string;
    redirect?: boolean;
    email?: string;
    password?: string;
  },
): Promise<{ error?: string } | void> {
  const callbackUrl = options?.callbackUrl || '/dashboard';

  if (provider === 'credentials') {
    const result = await authClient.signIn.email({
      email: options?.email || '',
      password: options?.password || '',
    });

    if (result.error) {
      return { error: result.error.message || 'Sign in failed' };
    }

    if (options?.redirect !== false) {
      window.location.href = callbackUrl;
    }

    return {};
  }

  // Social provider sign-in
  await authClient.signIn.social({
    provider: provider as 'google' | 'github' | 'facebook',
    callbackURL: callbackUrl,
  });
}

/**
 * Drop-in replacement for NextAuth's signOut().
 */
export async function signOut(options?: {
  callbackUrl?: string;
}): Promise<void> {
  await authClient.signOut();

  if (options?.callbackUrl) {
    window.location.href = options.callbackUrl;
  }
}

/**
 * Drop-in replacement for NextAuth's getSession().
 */
export async function getSession(): Promise<CompatSession | null> {
  return sessionStore.getSession();
}

// =============================================================================
// Provider Re-export
// =============================================================================

export { BetterSessionProvider as SessionProvider } from './auth-client-better';
export { BetterSessionProvider };

// =============================================================================
// Helpers
// =============================================================================

function mapEnrichedToCompat(enriched: EnrichedSession): CompatSession {
  return {
    user: {
      id: enriched.user.id,
      email: enriched.user.email,
      name: enriched.user.name,
      image: enriched.user.image,
      role: enriched.user.role,
      // @ccatto/react-auth's CompatSessionUser carries product-specific fields
      // (organizationId, organizations). Default to empty in the baseline; apps
      // with an orgs concept should populate these in their auth enrichment hook.
      organizationId: null,
      organizations: [],
    },
    expires:
      enriched.session.expiresAt instanceof Date
        ? enriched.session.expiresAt.toISOString()
        : String(enriched.session.expiresAt),
  };
}
