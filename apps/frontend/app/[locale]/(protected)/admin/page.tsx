'use client';

import { useTranslations } from 'next-intl';
import { Inbox, BarChart3, LinkIcon, ShieldAlert } from 'lucide-react';
import { CardCatto } from '@ccatto/ui';
import { useSession } from '@lib/auth-client-compat';

// Admin-only "business stuff" dashboard. Gated client-side on the Better Auth
// session role (`platform_admin`), mirroring the (protected)/dashboard pattern.
// The JWT auth path can be layered in later via useAuth() if mobile admins are needed.
export default function AdminPage() {
  const t = useTranslations('admin');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  const isAdmin = session?.user?.role === 'platform_admin';

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <CardCatto width="md" bodyPadding="lg">
          <div className="flex flex-col items-center gap-3 text-center">
            <ShieldAlert className="h-8 w-8 text-orange-500" />
            <p className="text-gray-600 dark:text-gray-300">{t('denied')}</p>
          </div>
        </CardCatto>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
          {t('title')}
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          {t('welcome')}, {session?.user?.name || session?.user?.email}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            icon={<Inbox className="h-5 w-5" />}
            title={t('contactTitle')}
            body={t('contactBody')}
            badge={t('contactBadge')}
          />
          <AdminCard
            icon={<BarChart3 className="h-5 w-5" />}
            title={t('analyticsTitle')}
            body={t('analyticsBody')}
            badge={t('analyticsBadge')}
          />
          <AdminCard
            icon={<LinkIcon className="h-5 w-5" />}
            title={t('linksTitle')}
            body={t('linksBody')}
          />
        </div>
      </div>
    </div>
  );
}

function AdminCard({
  icon,
  title,
  body,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-3">
        <span className="text-orange-600 dark:text-orange-400">{icon}</span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </h2>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {body}
      </p>
      {badge ? (
        <span className="mt-4 inline-flex w-fit items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
