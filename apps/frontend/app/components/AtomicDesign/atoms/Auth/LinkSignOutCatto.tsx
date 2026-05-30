'use client';

// Component atom auth Sign In Link Catto
import { LinkCatto } from '@ccatto/ui';
import { UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

const LinkSignOutCatto = () => {
  const t = useTranslations('auth');

  return (
    <LinkCatto
      href="/"
      variant="outline"
      className="flex items-center"
      rel="noopener noreferrer"
      aria-label="SignOut page"
    >
      <UserRound className="mr-4 h-4 w-4" />
      {t('signOut.button')}
    </LinkCatto>
  );
};

export default LinkSignOutCatto;
