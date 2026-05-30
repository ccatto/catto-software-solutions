// apps/frontend/app/components/Providers/SessionSync.tsx
// Syncs Better Auth session to the session store for Apollo client access
'use client';

import { useLayoutEffect } from 'react';
import { useSession } from '@lib/auth-client-compat';
import { sessionStore } from '@lib/stores/session-store';

/**
 * SessionSync
 *
 * Syncs the Better Auth session from React context to our session store.
 * This allows Apollo's authLink to access the session synchronously
 * without making a separate network call.
 *
 * Uses useLayoutEffect to sync before children's effects run, ensuring
 * Apollo queries have access to the session immediately.
 *
 * Must be rendered inside BetterSessionProvider.
 */
export function SessionSync(): null {
  const { data: session, status } = useSession();

  // Use useLayoutEffect to sync before regular effects
  // This ensures the session is available before queries fire
  useLayoutEffect(() => {
    // Only update the store when we have a definitive session state
    if (status !== 'loading') {
      sessionStore.setSession(session);
    }
  }, [session, status]);

  // This component renders nothing
  return null;
}

export default SessionSync;
