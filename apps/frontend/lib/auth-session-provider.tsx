/**
 * BetterSessionProvider
 *
 * Context provider for sharing enriched Better Auth session across the component tree.
 * Replaces NextAuth's SessionProvider — fetches the enriched session once
 * and shares it via React context so 50+ components don't each make their own API call.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { authClient, type EnrichedSession } from './auth-client-better';

// =============================================================================
// Context
// =============================================================================

interface BetterSessionContextValue {
  session: EnrichedSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  refetch: () => Promise<void>;
}

const BetterSessionContext = createContext<BetterSessionContextValue>({
  session: null,
  status: 'loading',
  refetch: async () => {},
});

// =============================================================================
// Provider
// =============================================================================

/**
 * @param refetchInterval - Seconds between session refetches (default: 300 = 5 min)
 */
export function BetterSessionProvider({
  children,
  refetchInterval = 5 * 60,
}: {
  children: React.ReactNode;
  refetchInterval?: number;
}) {
  const baseSession = authClient.useSession();
  const [enrichedSession, setEnrichedSession] =
    useState<EnrichedSession | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const fetchingRef = useRef(false);

  const fetchEnriched = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsEnriching(true);

    try {
      const response = await fetch('/api/auth/session/enriched', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEnrichedSession(data);
      } else {
        // Fallback to basic session with defaults
        if (baseSession.data?.user) {
          setEnrichedSession({
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
      }
    } catch {
      // Fallback to basic session on error
      if (baseSession.data?.user) {
        setEnrichedSession({
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
    } finally {
      setIsEnriching(false);
      fetchingRef.current = false;
    }
  }, [baseSession.data]);

  // Fetch enriched data when base session appears or changes
  useEffect(() => {
    if (baseSession.data?.user) {
      fetchEnriched();
    } else if (!baseSession.isPending) {
      setEnrichedSession(null);
    }
  }, [baseSession.data?.user?.id, baseSession.isPending, fetchEnriched]);

  // Periodic refetch
  useEffect(() => {
    if (!baseSession.data?.user || refetchInterval <= 0) return;
    const interval = setInterval(fetchEnriched, refetchInterval * 1000);
    return () => clearInterval(interval);
  }, [baseSession.data?.user?.id, refetchInterval, fetchEnriched]);

  // Compute status
  const status: 'loading' | 'authenticated' | 'unauthenticated' =
    baseSession.isPending || isEnriching
      ? 'loading'
      : enrichedSession
        ? 'authenticated'
        : 'unauthenticated';

  return (
    <BetterSessionContext.Provider
      value={{ session: enrichedSession, status, refetch: fetchEnriched }}
    >
      {children}
    </BetterSessionContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook to read the enriched session from BetterSessionProvider context.
 * Must be used within a BetterSessionProvider.
 */
export function useBetterSessionContext(): BetterSessionContextValue {
  return useContext(BetterSessionContext);
}
