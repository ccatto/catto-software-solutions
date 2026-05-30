// apps/frontend/navigation.ts
// Routing utilities for next-intl v4+
// Use these instead of next/navigation imports for locale-aware routing.
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './i18n';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
