import { Capacitor } from '@capacitor/core';
import { JwtAuthService } from './jwt-auth.service';
import { CapacitorAuthStorage } from './storage';

/**
 * Auth Provider Factory
 *
 * THE ONLY PLACE IN THE APP WITH PLATFORM DETECTION
 * Creates the appropriate auth service based on the platform.
 * Rest of the app uses the interface without knowing the platform.
 */

function createAuthService(): JwtAuthService {
  const isNativePlatform = Capacitor.isNativePlatform();

  // For now, always use JWT with Capacitor storage
  // Capacitor Preferences works on BOTH web and mobile
  const storage = new CapacitorAuthStorage();
  const authService = new JwtAuthService(storage);

  return authService;
}

/**
 * Singleton auth service instance
 * Import this throughout your app - NO platform detection needed elsewhere!
 *
 * Usage:
 *   import { authService } from '@lib/services/auth/auth-provider';
 *
 *   await authService.login({ email, password });
 *   const token = await authService.getAccessToken();
 *   await authService.logout();
 */
export const authService = createAuthService();
