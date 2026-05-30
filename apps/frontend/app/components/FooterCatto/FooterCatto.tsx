import Link from 'next/link';
import { Cat, Mail, Github, Linkedin } from 'lucide-react';

// TODO: Replace with your real contact email.
const CONTACT_EMAIL = 'hello@cattosoftwaresolutions.com';
const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/ccatto/catto-software-solutions',
    icon: Github,
  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/catto', icon: Linkedin },
];

export default function FooterCatto() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-slate-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-50"
          >
            <Cat className="h-5 w-5 text-orange-500" />
            <span className="font-[family-name:var(--font-urbanist)]">
              Catto Software Solutions
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-500 transition-colors hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row dark:border-gray-800 dark:text-gray-400">
          <p>© {year} Catto Software Solutions. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400"
            >
              <Mail className="h-3.5 w-3.5" />
              {CONTACT_EMAIL}
            </a>
            <Link
              href="/privacy"
              className="hover:text-orange-600 dark:hover:text-orange-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-orange-600 dark:hover:text-orange-400"
            >
              Terms
            </Link>
            <Link
              href="/support"
              className="hover:text-orange-600 dark:hover:text-orange-400"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
