'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { ThemeToggleCatto, UserMenuDropdownCatto } from '@ccatto/ui';
import { useSession, signOut } from '@lib/auth-client-compat';
import { useRouter } from '@/navigation';

// Marketing nav links — hash anchors that smooth-scroll to home-page sections.
const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function HeaderCatto() {
  const t = useTranslations('navigation');
  const ta = useTranslations('auth');
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-baseline gap-2 text-lg font-bold text-gray-900 dark:text-gray-50"
        >
          {/* TODO: swap for a short/wide logo variant once available (see docs/APP-BACKLOG.md) */}
          <span className="font-[family-name:var(--font-urbanist)] text-orange-500">
            CSS
          </span>
          <span className="font-[family-name:var(--font-urbanist)]">
            Catto Software Solutions
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Brand mark removed — the wordmark on the left already carries the CSS mark. */}
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
            <a
              href="#contact"
              className="hidden rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 sm:inline-block"
            >
              Start a Project
            </a>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-orange-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-orange-400"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600"
            >
              Start a Project
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
