import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support — Catto Software Solutions',
  description: 'Get help and support from Catto Software Solutions.',
};

const FAQS = [
  {
    q: 'How do I start a project?',
    a: 'Use the “Start a Project” form on our homepage. Tell us what you’re building and your timeline, and we’ll follow up to scope it out.',
  },
  {
    q: 'What kind of projects do you take on?',
    a: 'Custom mobile apps (iOS + Android), web apps and websites, AI integrations, MVPs and prototypes for startups, and ongoing maintenance for existing products.',
  },
  {
    q: 'How fast will I hear back?',
    a: 'We aim to respond to every inquiry within one business day.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes. We offer maintenance and support plans to keep your product updated, monitored, and improving after it ships.',
  },
  {
    q: 'Where are you located?',
    a: 'We’re based in Boca Raton, Florida, and work with clients remotely.',
  },
];

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

      <div className="mt-6 space-y-6 leading-relaxed text-gray-600 dark:text-gray-300">
        <p>
          Need help or have a question? We&rsquo;re here for you. The fastest way
          to reach us is through our contact form, and we aim to respond within
          one business day.
        </p>

        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          <MessageSquare className="h-4 w-4" />
          Contact us
        </Link>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-medium text-gray-900 dark:text-gray-100">
                  {q}
                </dt>
                <dd className="mt-1">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
