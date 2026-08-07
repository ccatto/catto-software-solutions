'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@apollo/client';
import { Inbox, BarChart3, LinkIcon, ShieldAlert, Mail } from 'lucide-react';
import { CardCatto } from '@ccatto/ui';
import { useSession } from '@lib/auth-client-compat';
import { CONTACT_MESSAGES } from '@lib/graphql/contact.queries';

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string;
}

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

        <ContactSubmissions />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
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

// Live list of persisted contact-form inquiries (platform_admin only).
function ContactSubmissions() {
  const t = useTranslations('admin');
  const { data, loading, error } = useQuery<{
    contactMessages: ContactMessageRow[];
  }>(CONTACT_MESSAGES, {
    variables: { limit: 100 },
    fetchPolicy: 'cache-and-network',
  });

  const messages = data?.contactMessages ?? [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-orange-600 dark:text-orange-400">
            <Inbox className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t('contactTitle')}
          </h2>
        </div>
        {!loading && !error ? (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {t('contactCount', { count: messages.length })}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        {loading && messages.length === 0 ? (
          <p className="text-sm text-gray-500">{t('contactLoading')}</p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {t('contactError')}
          </p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500">{t('contactEmpty')}</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {messages.map((m) => (
              <li key={m.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      {m.name}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {m.projectType}
                    </span>
                  </div>
                  <time className="text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </time>
                </div>
                <a
                  href={`mailto:${m.email}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-orange-600 hover:underline dark:text-orange-400"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {m.email}
                </a>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
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
