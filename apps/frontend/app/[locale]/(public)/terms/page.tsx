import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — Catto Software Solutions',
  description: 'The terms that govern use of Catto Software Solutions.',
};

// NOTE: Starting draft, Florida-governed. Have an attorney review before launch,
// especially if you add subscriptions, payments, or paid digital content.
const CONTACT_EMAIL = 'chriscatto3@gmail.com';
const EFFECTIVE_DATE = 'May 30, 2026';

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-gray-50">
      {children}
    </h2>
  );
}

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
        Last updated: {EFFECTIVE_DATE}
      </p>

      <div className="mt-6 space-y-4 leading-relaxed text-gray-600 dark:text-gray-300">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the website cattosoftwaresolutions.com and any related services
          (collectively, the &ldquo;Services&rdquo;) provided by Catto Software
          Solutions (&ldquo;Catto,&rdquo; &ldquo;we,&rdquo; or &ldquo;us&rdquo;),
          based in Boca Raton, Florida. By using the Services, you agree to these
          Terms. If you do not agree, please do not use the Services.
        </p>

        <Heading>Our services</Heading>
        <p>
          Catto is a software development studio that designs and builds custom
          web and mobile applications. Paid client engagements are governed by a
          separate written agreement or statement of work; where that agreement
          conflicts with these Terms, the signed agreement controls.
        </p>

        <Heading>Acceptable use</Heading>
        <p>You agree not to:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Use the Services for any unlawful or fraudulent purpose.</li>
          <li>Attempt to disrupt, damage, or gain unauthorized access to the Services.</li>
          <li>Infringe the intellectual property or privacy rights of others.</li>
        </ul>

        <Heading>Intellectual property</Heading>
        <p>
          The Site, including its content, branding, and design, is owned by
          Catto and protected by applicable laws. Ownership of deliverables
          created for clients is addressed in the applicable project agreement.
        </p>

        <Heading>Third-party links</Heading>
        <p>
          The Services may link to third-party websites or services that we do
          not control. We are not responsible for their content or practices.
        </p>

        <Heading>Disclaimers</Heading>
        <p>
          The Services are provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, whether express or
          implied, including warranties of merchantability, fitness for a
          particular purpose, and non-infringement.
        </p>

        <Heading>Limitation of liability</Heading>
        <p>
          To the fullest extent permitted by law, Catto will not be liable for
          any indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of the Services.
        </p>

        <Heading>Governing law</Heading>
        <p>
          These Terms are governed by the laws of the State of Florida, without
          regard to its conflict-of-law principles. Any dispute will be resolved
          in the state or federal courts located in Palm Beach County, Florida.
        </p>

        <Heading>Changes to these Terms</Heading>
        <p>
          We may update these Terms from time to time. We will revise the
          &ldquo;Last updated&rdquo; date above when we do. Continued use of the
          Services after changes means you accept the revised Terms.
        </p>

        <Heading>Contact</Heading>
        <p>
          Questions about these Terms? Email{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
