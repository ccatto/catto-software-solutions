'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CardCatto } from '@ccatto/ui';
import { UserProfileFormCatto } from '@ccatto/auth-ui';
import { useSession } from '@lib/auth-client-compat';
import { authClient } from '@lib/auth-client-better';
import { useRouter } from '@/navigation';

export default function ProfileClient() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Redirect unauthenticated users — must run after render, not during.
  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      router.push('/signin');
    }
  }, [status, session, router]);

  if (status === 'loading' || !session?.user) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('profile.submitting')}
      </p>
    );
  }

  const initialValues = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
  };

  return (
    <CardCatto width="full" title={t('profile.cardTitle')}>
      <UserProfileFormCatto
        initialValues={initialValues}
        onSubmit={async ({ name, email }) => {
          if (email !== initialValues.email) {
            throw new Error(
              'Email changes are not yet supported. Contact support if you need to change your email.',
            );
          }
          if (name !== initialValues.name) {
            const result = await authClient.updateUser({ name });
            if (result?.error) {
              throw new Error(
                result.error.message ?? t('profile.errorGeneric'),
              );
            }
            await update();
          }
        }}
      />
    </CardCatto>
  );
}
