// apps/frontend/app/components/AtomicDesign/atoms/ControlsCatto/LanguageSwitcherCatto.tsx
// App-specific language switcher wrapper using @ccatto/ui component
'use client';

import { useMemo } from 'react';
import { localeFlags, localeNames, locales, type Locale } from '@/i18n';
import { usePathname, useRouter } from '@/navigation';
import {
  LanguageSwitcherCatto as LanguageSwitcherUI,
  type LanguageOption,
  type LanguageSwitcherSize,
  type LanguageSwitcherVariant,
} from '@ccatto/ui';
import { useLocale } from 'next-intl';

interface LanguageSwitcherCattoProps {
  /** Display variant - dropdown, buttons, or compact */
  variant?: LanguageSwitcherVariant;
  /** Size of the switcher */
  size?: LanguageSwitcherSize;
  /** Show flag icons */
  showFlags?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * LanguageSwitcherCatto - App-specific language switcher
 *
 * This is a thin wrapper around @ccatto/ui's LanguageSwitcherCatto that:
 * 1. Provides the app's locale configuration (locales, names, flags)
 * 2. Handles next-intl routing when language changes
 * 3. Preserves scroll position during navigation
 */
const LanguageSwitcherCatto = ({
  variant = 'dropdown',
  size = 'md',
  showFlags = true,
  className = '',
}: LanguageSwitcherCattoProps) => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  // Build language options from app's i18n config
  const languageOptions: LanguageOption[] = useMemo(() => {
    return locales.map((loc) => ({
      value: loc,
      label: localeNames[loc],
      flag: localeFlags[loc],
    }));
  }, []);

  // Handle locale change with scroll preservation
  const handleLocaleChange = (newLocale: string) => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Restore scroll position multiple times to fight browser's scroll reset
    const restoreScroll = () => {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };

    // Navigate to new locale
    router.replace(pathname, { locale: newLocale as Locale, scroll: false });

    // Restore scroll immediately and after short delays to catch re-renders
    restoreScroll();
    requestAnimationFrame(restoreScroll);
    setTimeout(restoreScroll, 0);
    setTimeout(restoreScroll, 50);
    setTimeout(restoreScroll, 100);
  };

  return (
    <LanguageSwitcherUI
      languages={languageOptions}
      currentLanguage={locale}
      onChange={handleLocaleChange}
      variant={variant}
      size={size}
      showFlags={showFlags}
      className={className}
      aria-label="Select language"
    />
  );
};

export default LanguageSwitcherCatto;
