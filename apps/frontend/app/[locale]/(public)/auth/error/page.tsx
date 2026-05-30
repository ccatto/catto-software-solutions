'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ErrorPageCatto from '@atomic-design/templates/ErrorPageCatto';

/**
 * Map Better Auth error codes to i18n description keys.
 * Falls back to 'defaultDescription' for unknown codes.
 */
const ERROR_CODE_MAP: Record<string, string> = {
  internal_server_error: 'internalServerError',
  unable_to_link_account: 'unableToLinkAccount',
  access_denied: 'accessDenied',
  sign_in_failed: 'signInFailed',
  account_not_found: 'accountNotFound',
};

const AuthErrorPage = () => {
  const t = useTranslations('errors.auth');
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') || '';

  const descriptionKey = ERROR_CODE_MAP[errorCode] || 'defaultDescription';

  return (
    <ErrorPageCatto
      title={t('title')}
      subtitle={t('defaultSubtitle')}
      description={t(descriptionKey)}
      iconType="auth"
      actionLabel={t('signIn')}
      actionHref="/signin"
      secondaryActionLabel={t('goHome')}
      secondaryActionHref="/"
    />
  );
};

export default AuthErrorPage;
