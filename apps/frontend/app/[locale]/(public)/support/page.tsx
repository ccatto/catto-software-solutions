import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support — Catto Software Solutions',
  description: 'Get help and support from Catto Software Solutions.',
};

// Stub Support page — needed for app store submissions.
// TODO: Replace the placeholder copy below with your real support info.
export default function SupportPage() {
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
        Support
      </h1>

      <div className="mt-8 space-y-6 leading-relaxed text-gray-600 dark:text-gray-300">
        <p>
          {/* TODO: Replace with your real support details. */}
          Need help? We&apos;re here for you. Reach out and we&apos;ll get back
          to you as soon as we can.
        </p>

        <a
          href="mailto:hello@cattosoftwaresolutions.com"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          <Mail className="h-4 w-4" />
          Email support
        </a>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Frequently asked questions
          </h2>
          <p className="mt-2">
            TODO: Add common questions and answers, response times, and any
            support hours here.
          </p>
        </section>
      </div>
    </article>
  );
}
