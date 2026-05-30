import { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import { notFound } from 'next/navigation';
import cn from 'clsx';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '../../i18n';
import '@ui/global.css';
import HeaderCatto from '../components/HeaderCatto/HeaderCatto';
import { Providers } from '../providers';
import { montserrat, urbanist } from '../ui/fonts';

// Lazy load footer (not critical for initial render)
const FooterCatto = dynamicImport(
  () => import('../components/FooterCatto/FooterCatto'),
);

// Force dynamic rendering for pages that use session context
export const dynamic = 'force-dynamic';

// Generate metadata with translations
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('title'),
    description: t('description'),
    // TODO: Add your canonical URL and alternate languages
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('catto-theme') || 'default';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${montserrat.className} ${montserrat.variable} ${urbanist.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <HeaderCatto />
            <main className={cn('min-h-screen')}>
              {children}
            </main>
            <FooterCatto />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
