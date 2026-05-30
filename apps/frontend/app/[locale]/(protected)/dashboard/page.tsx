'use client';

import { useTranslations } from 'next-intl';
import { CardCatto } from '@ccatto/ui';
import { useSession } from '@lib/auth-client-compat';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">{t('loading', { defaultMessage: 'Loading...' })}</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <CardCatto width="md" bodyPadding="lg">
          <p className="text-center text-gray-500">
            Please sign in to access the dashboard.
          </p>
        </CardCatto>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
          {t('title')}
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          {t('welcome')}, {session.user.name || session.user.email}
        </p>

        <CardCatto width="full" bodyPadding="lg">
          <p className="text-gray-600 dark:text-gray-300">
            {t('description')}
          </p>
          {/* TODO: Add your dashboard content here */}
        </CardCatto>
      </div>
    </div>
  );
}
