// Shared style tokens for the marketing site.
// Accent = orange (#f97316 / #ea580c), pulled from the rleaguez design system.
// Centralized here so the brand accent can be changed in one place.

export const ctaPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950';

export const ctaSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-orange-500 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-100 dark:hover:border-orange-400 dark:hover:text-orange-400 dark:focus-visible:ring-offset-gray-950';

// Section anchor ids — kept in one place so the nav and sections stay in sync.
export const SECTIONS = {
  services: 'services',
  work: 'work',
  about: 'about',
  process: 'process',
  contact: 'contact',
} as const;
