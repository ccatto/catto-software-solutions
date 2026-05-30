import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'My App — Profile',
  description: 'Update your account profile.',
};

const Page = async () => {
  const t = await getTranslations('auth');
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-50">
        {t('profilePageTitle')}
      </h1>
      <ProfileClient />
    </div>
  );
};

export default Page;
