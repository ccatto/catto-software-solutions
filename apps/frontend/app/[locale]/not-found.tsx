// app/[locale]/not-found.tsx
import { getTranslations } from 'next-intl/server';
import ErrorPageCatto from '@atomic-design/templates/ErrorPageCatto';

export default async function NotFound() {
  const t = await getTranslations('errors');

  return (
    <ErrorPageCatto
      title={t('notFound')}
      subtitle="Looks like that ball went out of bounds!"
      errorCode="404"
      iconType="notFound"
    />
  );
}
