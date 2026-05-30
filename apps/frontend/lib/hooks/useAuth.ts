'use client';

import { useEffect, useState } from 'react';
import { AuthUser, useAuthStore } from '@zustand/zustandStore';
import { authService } from '../services/auth/auth-provider';

// Re-export AuthUser from zustand store for backwards compatibility
export type { AuthUser } from '@zustand/zustandStore';

// Module-level flag to prevent multiple concurrent loadUser calls
// This is necessary because multiple components may call useAuth() simultaneously
let loadUserInProgress = false;

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

/**
 * useAuth Hook
 *
 * Client-side authentication hook that works with JWT tokens
 * Uses Zustand store for global state - updates are shared across all components
 *
 * Usage:
 * ```tsx
 * const { user, isAuthenticated, isLoading } = useAuth();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginPrompt />;
 *
 * return <div>Hello {user.name}</div>;
 * ```
 */
export function useAuth(): UseAuthReturn {
  // Use Zustand store for global auth state
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    setUser,
    setLoading,
    setInitialized,
    logout: storeLogout,
  } = useAuthStore();

  const [error, setError] = useState<Error | null>(null);

  // Load user on mount (only once across all components)
  useEffect(() => {
    if (!isInitialized && !loadUserInProgress) {
      loadUser();
    }
  }, [isInitialized]);

  const loadUser = async () => {
    // Prevent multiple concurrent calls across all component instances
    if (loadUserInProgress) {
      return;
    }
    loadUserInProgress = true;
    try {
      setLoading(true);
      setError(null);

      // Check if we have tokens
      const hasTokens = await authService.hasTokens();

      if (!hasTokens) {
        setUser(null);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Get current user from token
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        setUser(null);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Map 'id' to 'userId'
      setUser({
        ...currentUser,
        userId: currentUser.id,
      } as AuthUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load user'));
      setUser(null);

      // Clear invalid tokens
      await authService.logout();
    } finally {
      loadUserInProgress = false;
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login({ email, password });

      // Update global Zustand store
      setUser({
        ...response.user,
        userId: response.user.id,
      } as AuthUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      storeLogout(); // Clear Zustand store
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    loadUserInProgress = false; // Reset the guard
    setInitialized(false); // Force reload
    await loadUser();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAuth,
  };
}
