'use client';

/**
 * DeepLinkProvider - Handles deep link navigation for mobile apps
 *
 * Listens for deep links (myapp://path) and navigates to the appropriate route.
 * Should be placed in the app providers after the router is available.
 *
 * Supported deep links:
 *   myapp://                                 → / (home)
 *   myapp://org/[orgName]                   → /org/[orgName]
 *   myapp://org/[orgName]/tournament/[id]   → /org/[orgName]/tournament/[id]
 *   myapp://org/[orgName]/team/[id]         → /org/[orgName]/team/[id]
 *
 * Usage:
 *   <DeepLinkProvider>
 *     {children}
 *   </DeepLinkProvider>
 */
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { log } from '@app/lib/logger';
import { useDeepLinks } from '@lib/hooks/useDeepLinks';

interface DeepLinkProviderProps {
  children: ReactNode;
}

export function DeepLinkProvider({ children }: DeepLinkProviderProps) {
  const router = useRouter();

  useDeepLinks({
    onDeepLink: (path, url) => {
      log.info('[DeepLinkProvider] Navigating to:', { path });

      // Navigate to the path using Next.js router
      // The path is already formatted correctly (e.g., /org/my-league)
      router.push(path);
    },
  });

  return <>{children}</>;
}

export default DeepLinkProvider;
