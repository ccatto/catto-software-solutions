'use client';

import { useState } from 'react';
import { ButtonCatto } from '@ccatto/ui';
import { useTranslations } from 'next-intl';
import { signOut, useSession } from '@lib/auth-client-compat';
import { useAuth } from '@lib/hooks/useAuth';

// Supports both NextAuth (OAuth) and JWT (email/password & mobile) authentication

const ButtonSignoutCatto = () => {
  const t = useTranslations('auth');
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Check both auth systems
  const { status: nextAuthStatus } = useSession();
  const { isAuthenticated: jwtAuthenticated, logout: jwtLogout } = useAuth();

  // User is authenticated if either system says so
  const isAuthenticated =
    nextAuthStatus === 'authenticated' || jwtAuthenticated;

  const handleSignOut = async () => {
    setIsSigningOut(true);

    // If using JWT auth, clear JWT tokens
    if (jwtAuthenticated) {
      await jwtLogout();
    }
    // If using NextAuth, sign out via NextAuth
    if (nextAuthStatus === 'authenticated') {
      signOut({ callbackUrl: '/' });
    } else {
      // For JWT-only users, redirect manually after logout
      window.location.href = '/';
    }
    // Note: No need to setIsSigningOut(false) since we're redirecting away
  };

  return (
    <>
      {isAuthenticated && (
        <div className="flex justify-end">
          <ButtonCatto
            variant="danger"
            size="medium"
            width="auto"
            onClick={handleSignOut}
            disabled={isSigningOut}
            isLoading={isSigningOut}
          >
            {t('signOut.button')}
          </ButtonCatto>
        </div>
      )}
    </>
  );
};

export default ButtonSignoutCatto;

// component atom auth Button Sign Out
// style={{
//   padding: '10px',
//   background: 'red',
//   color: 'white',
//   border: 'none',
//   cursor: 'pointer',
// }}
