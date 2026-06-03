import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Catto Software Solutions',
  description: 'How Catto Software Solutions collects, uses, and protects your data.',
};

// NOTE: This is a solid starting draft tailored to a software agency based in
// Boca Raton, Florida. Have an attorney review it before launch or app-store
// submission. Update company details if they change.
const EFFECTIVE_DATE = 'May 30, 2026';

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-gray-50">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last updated: {EFFECTIVE_DATE}
      </p>

      <div className="mt-6 space-y-4 leading-relaxed text-gray-600 dark:text-gray-300">
        <p>
          Catto Software Solutions (&ldquo;Catto,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a software development
          studio based in Boca Raton, Florida. This Privacy Policy explains how
          we collect, use, and protect information when you visit
          cattosoftwaresolutions.com (the &ldquo;Site&rdquo;), contact us, or use
          applications we operate. By using the Site, you agree to this policy.
        </p>

        <Heading>Information we collect</Heading>
        <p>We collect the following categories of information:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Information you provide.</strong> When you submit our contact
            form or email us, we collect your name, email address, and any
            project details or other information you choose to share.
          </li>
          <li>
            <strong>Information collected automatically.</strong> Like most
            websites, we may collect basic technical data such as your IP
            address, browser type, device information, pages visited, and
            referring URLs through server logs and analytics tools.
          </li>
          <li>
            <strong>Cookies.</strong> We may use cookies and similar
            technologies to remember preferences (such as light/dark theme) and
            to understand how the Site is used.
          </li>
        </ul>
        <p>
          When we build or host applications on behalf of a client, we may
          process end-user data on that client&rsquo;s behalf as a service
          provider. In those cases, the client&rsquo;s own privacy policy
          governs that data.
        </p>

        <Heading>How we use information</Heading>
        <ul className="ml-5 list-disc space-y-2">
          <li>To respond to your inquiries and provide our services.</li>
          <li>To operate, maintain, and improve the Site and our offerings.</li>
          <li>To send project-related communications you have requested.</li>
          <li>To comply with legal obligations and protect our rights.</li>
        </ul>

        <Heading>How we share information</Heading>
        <p>
          We do not sell your personal information. We may share information
          with trusted service providers who help us operate our business (for
          example, email, hosting, and analytics providers), when required by
          law, or in connection with a business transfer such as a merger or
          acquisition.
        </p>

        <Heading>Data retention</Heading>
        <p>
          We retain personal information only as long as necessary to fulfill
          the purposes described in this policy, to comply with our legal
          obligations, and to resolve disputes.
        </p>

        <Heading>Security</Heading>
        <p>
          We use reasonable technical and organizational measures to protect
          your information. However, no method of transmission or storage is
          completely secure, and we cannot guarantee absolute security.
        </p>

        <Heading>Your rights</Heading>
        <p>
          Depending on your location, you may have the right to access, correct,
          or delete your personal information, or to object to certain
          processing. To exercise these rights, contact us at the email below.
        </p>

        <Heading>Children&rsquo;s privacy</Heading>
        <p>
          The Site is not directed to children under 13, and we do not knowingly
          collect personal information from children under 13.
        </p>

        <Heading>Changes to this policy</Heading>
        <p>
          We may update this Privacy Policy from time to time. We will revise the
          &ldquo;Last updated&rdquo; date above when we do.
        </p>

        <Heading>Contact</Heading>
        <p>
          Questions about this policy? Reach us through our{' '}
          <Link
            href="/#contact"
            className="font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            contact form
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
