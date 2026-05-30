'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ThemeToggleCatto, UserMenuDropdownCatto } from '@ccatto/ui';
import { useSession, signOut } from '@lib/auth-client-compat';
import { useRouter } from '@/navigation';

export default function HeaderCatto() {
  const t = useTranslations('navigation');
  const ta = useTranslations('auth');
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-gray-50"
        >
          {/* TODO: Replace with your app name */}
          My App
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
          >
            {t('home')}
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
          >
            {t('about')}
          </Link>
          <ThemeToggleCatto />
          {session?.user ? (
            <UserMenuDropdownCatto
              user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
              }}
              links={[
                { label: t('dashboard'), href: '/dashboard' },
                { label: t('profile'), href: '/profile' },
              ]}
              signOutLabel={ta('signOut')}
              onNavigate={(href) => router.push(href)}
              onSignOut={async () => {
                await signOut();
                router.push('/');
              }}
            />
          ) : (
            <Link
              href="/signin"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('signIn')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
