// page signIn register
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import RegisterUserFormCatto from '@atomic-design/molecules/Auth/RegisterUserFormCatto';
import JumbotronFlexibleCatto from '@atomic-design/molecules/JumbotronCattoFlexible';

export const metadata: Metadata = {
  title: 'MyApp Register new user',
  description:
    'MyApp Register User - Register new user to MyApp to your account',
  alternates: {
    canonical: 'https://www.example.com/signin/register',
    languages: {
      en: 'https://www.example.com/en/signin/register',
      es: 'https://www.example.com/es/signin/register',
      pt: 'https://www.example.com/pt/signin/register',
      zh: 'https://www.example.com/zh/signin/register',
      vi: 'https://www.example.com/vi/signin/register',
      hi: 'https://www.example.com/hi/signin/register',
      fr: 'https://www.example.com/fr/signin/register',
      de: 'https://www.example.com/de/signin/register',
      'x-default': 'https://www.example.com/signin/register',
    },
  },
};

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <hr className="m-1" />
      <JumbotronFlexibleCatto
        title={t('registerPageTitle')}
        description={t('tagline')}
      />
      <RegisterUserFormCatto />
      <hr className="m-3" />
    </>
  );
};
export default Page;
