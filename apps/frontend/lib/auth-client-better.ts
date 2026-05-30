/**
 * Better Auth Client Configuration
 *
 * Client-side hooks and utilities for Better Auth.
 * This runs in the browser and provides React hooks for authentication.
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { createAuthClient } from 'better-auth/react';

// =============================================================================
// Types
// =============================================================================

/**
 * Enriched user type with custom fields
 */
export interface EnrichedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  // TODO: Add your custom user fields here
}

export interface EnrichedSession {
  user: EnrichedUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
}

// =============================================================================
// Auth Client
// =============================================================================

// Create the auth client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  fetchOptions: {
    credentials: 'include',
  },
});

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to get current session (basic - Better Auth native)
 */
export const useSession = authClient.useSession;

/**
 * Hook to get enriched session with custom fields
 *
 * @example
 * import { useBetterSession } from "@/lib/auth-client-better";
 *
 * function MyComponent() {
 *   const { data: session, isPending, error, refetch } = useBetterSession();
 *
 *   if (isPending) return <Loading />;
 *   if (!session) return <SignInPrompt />;
 *
 *   return (
 *     <div>
 *       <p>Role: {session.user.role}</p>
 *     </div>
 *   );
 * }
 */
export function useBetterSession() {
  const baseSession = authClient.useSession();
  const [enrichedData, setEnrichedData] = useState<EnrichedSession | null>(
    null,
  );
  const [isEnriching, setIsEnriching] = useState(false);

  const fetchEnrichedSession = useCallback(async () => {
    if (!baseSession.data?.user) {
      setEnrichedData(null);
      return;
    }

    setIsEnriching(true);
    try {
      const response = await fetch('/api/auth/session/enriched', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEnrichedData(data);
      } else {
        // Fallback to basic session with defaults
        setEnrichedData({
          user: {
            id: baseSession.data.user.id,
            email: baseSession.data.user.email,
            name: baseSession.data.user.name ?? null,
            image: baseSession.data.user.image ?? null,
            role: 'user',
          },
          session: baseSession.data.session,
        });
      }
    } catch (error) {
      console.error('[BETTER-AUTH] Error fetching enriched session:', error);
      // Fallback to basic session
      setEnrichedData({
        user: {
          id: baseSession.data.user.id,
          email: baseSession.data.user.email,
          name: baseSession.data.user.name ?? null,
          image: baseSession.data.user.image ?? null,
          role: 'user',
        },
        session: baseSession.data.session,
      });
    } finally {
      setIsEnriching(false);
    }
  }, [baseSession.data]);

  useEffect(() => {
    if (baseSession.data?.user && !enrichedData) {
      fetchEnrichedSession();
    } else if (!baseSession.data?.user && enrichedData) {
      setEnrichedData(null);
    }
  }, [baseSession.data, enrichedData, fetchEnrichedSession]);

  return {
    data: enrichedData,
    isPending: baseSession.isPending || isEnriching,
    error: baseSession.error,
    refetch: fetchEnrichedSession,
  };
}

/**
 * Sign in with OAuth provider or credentials
 */
export const signIn = authClient.signIn;

/**
 * Sign out
 */
export const signOut = authClient.signOut;

/**
 * Sign up new user (email/password)
 */
export const signUp = authClient.signUp;

// =============================================================================
// BetterSessionProvider (re-exported from auth-session-provider.tsx)
// =============================================================================
export {
  BetterSessionProvider,
  useBetterSessionContext,
} from './auth-session-provider';
