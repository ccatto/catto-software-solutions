// apps/frontend/i18n.ts
// Core i18n configuration for next-intl
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported locales — add more as needed
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale display names for language switcher
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Espanol',
};

// Locale flags for visual display (optional)
export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
