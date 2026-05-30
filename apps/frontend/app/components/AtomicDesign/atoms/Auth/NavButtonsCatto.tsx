// app/components/AtomicDesign/atoms/Auth/NavButtonsCatto.tsx
// Supports both Better Auth (web/OAuth) and JWT (mobile/Capacitor) auth.
'use client';

import LanguageSwitcherCatto from '@atomic-design/atoms/ControlsCatto/LanguageSwitcherCatto';
import { useSession } from '@lib/auth-client-compat';
import { useAuth } from '@lib/hooks/useAuth';
import ButtonSignoutCatto from './ButtonSignoutCatto';
import LinkSignInCatto from './LinkSignInCatto';

const NavButtonsCatto = () => {
  const { data: session, status } = useSession();
  const { isAuthenticated: jwtAuthenticated, isLoading: jwtLoading } =
    useAuth();

  const hasSessionError = session && 'message' in session;
  const betterAuthenticated = !hasSessionError && status === 'authenticated';
  const isAuthenticated = betterAuthenticated || jwtAuthenticated;
  const isLoading = status === 'loading' || jwtLoading;

  if (isLoading) return null;

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcherCatto variant="compact" showFlags={true} />
      {isAuthenticated ? <ButtonSignoutCatto /> : <LinkSignInCatto />}
    </div>
  );
};

export default NavButtonsCatto;
