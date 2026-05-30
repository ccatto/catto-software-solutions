import { useTranslations } from 'next-intl';
import { CardCatto } from '@ccatto/ui';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <CardCatto width="3xl" bodyPadding="lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-50">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </CardCatto>
    </div>
  );
}
