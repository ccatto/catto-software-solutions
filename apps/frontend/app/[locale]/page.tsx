import { useTranslations } from 'next-intl';
import { ButtonCatto, CardCatto } from '@ccatto/ui';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <CardCatto width="3xl" bodyPadding="lg">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-50">
            {t('title')}
          </h1>
          <h2 className="mb-6 text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {t('subtitle')}
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            {t('description')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* TODO: Link to your main feature */}
            <ButtonCatto variant="primary" size="lg">
              {t('getStarted')}
            </ButtonCatto>
            <ButtonCatto variant="secondary" size="lg">
              {t('learnMore')}
            </ButtonCatto>
          </div>
        </div>
      </CardCatto>
    </div>
  );
}
