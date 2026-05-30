'use client';

import { useTranslations } from 'next-intl';
import { resolveApiErrorKey } from './translateApiError';

/**
 * Hook that returns a function to translate backend API error messages.
 * Uses the "apiErrors" namespace from next-intl message files.
 *
 * Usage:
 *   const translateError = useTranslateApiError();
 *
 *   // In a catch block:
 *   catch (err) {
 *     setError(err instanceof Error ? translateError(err.message) : t('fallback'));
 *   }
 *
 *   // In an Apollo onError callback:
 *   onError: (err) => setError(translateError(err.message))
 */
export function useTranslateApiError() {
  const t = useTranslations('apiErrors');

  return (message: string): string => {
    const resolved = resolveApiErrorKey(message);
    if (!resolved) {
      return message; // Fallback to original
    }

    try {
      return t(resolved.key, resolved.params);
    } catch {
      // Key missing from translation file — return original
      return message;
    }
  };
}
