'use client';

/**
 * MobileEnhancementsProvider - Native mobile UX enhancements
 *
 * Provides native-only enhancements that improve the mobile experience:
 * - Keyboard auto-dismiss on scroll
 * - Safe area handling (already in CSS)
 *
 * Does nothing on web.
 *
 * Usage:
 *   <MobileEnhancementsProvider>
 *     {children}
 *   </MobileEnhancementsProvider>
 */
import { ReactNode } from 'react';
import { useKeyboardDismiss } from '@lib/hooks/useKeyboardDismiss';

interface MobileEnhancementsProviderProps {
  children: ReactNode;
}

export function MobileEnhancementsProvider({
  children,
}: MobileEnhancementsProviderProps) {
  // Configure keyboard behavior for native apps
  useKeyboardDismiss({
    scrollDismiss: true, // Hide keyboard when user scrolls
  });

  return <>{children}</>;
}

export default MobileEnhancementsProvider;
