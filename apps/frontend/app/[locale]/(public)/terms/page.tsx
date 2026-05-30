import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — Catto Software Solutions',
  description: 'The terms that govern use of Catto Software Solutions.',
};

// Stub Terms of Service page — recommended for app store submissions
// (required if the app offers subscriptions or paid content).
// TODO: Replace the placeholder copy below with your real terms.
export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>

      <h1 className="mt-6 font-[family-name:var(--font-urbanist)] text-4xl font-bold text-gray-900 dark:text-gray-50">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {/* TODO: Update the effective date */}
        Last updated: TODO
      </p>

      <div className="mt-8 space-y-6 leading-relaxed text-gray-600 dark:text-gray-300">
        <p>
          {/* TODO: Replace with your real terms of service. */}
          This is a placeholder Terms of Service for Catto Software Solutions.
          Replace this content with your actual terms before going live or
          submitting to an app store.
        </p>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Use of our services
          </h2>
          <p className="mt-2">TODO: Describe acceptable use and restrictions.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Accounts &amp; payments
          </h2>
          <p className="mt-2">
            TODO: Cover account responsibilities and any subscriptions or
            payments (required by Apple if you sell digital content).
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Contact
          </h2>
          <p className="mt-2">
            Questions? Email{' '}
            <a
              href="mailto:hello@cattosoftwaresolutions.com"
              className="font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
            >
              hello@cattosoftwaresolutions.com
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
