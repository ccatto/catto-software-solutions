'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import Section from './Section';
import SectionHeading from './SectionHeading';
import { SUBMIT_CONTACT_MESSAGE } from '@lib/graphql/contact.mutations';
import { ctaPrimary, SECTIONS } from './styles';

// Placeholder until chris@cattosoftwaresolutions.com forwarding is set up (see docs/APP-BACKLOG.md).
const CONTACT_EMAIL = 'chriscatto3@gmail.com';

// Project types mirror the Services section.
const PROJECT_TYPES = [
  'Mobile App (iOS + Android)',
  'Web App or Website',
  'AI Integration / Custom AI',
  'MVP / Prototype',
  'Maintenance & Support',
  'Something else',
];

const inputClasses =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500';

// Contact — "Start a Project" form. Working UI wired to a placeholder handler.
export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitContact, { loading }] = useMutation(SUBMIT_CONTACT_MESSAGE);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // capture before any await (React nulls currentTarget)
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setError(null);
    try {
      const { data: res } = await submitContact({
        variables: {
          input: {
            name: data.name,
            email: data.email,
            projectType: data.projectType,
            message: data.message,
          },
        },
      });

      if (!res?.submitContactMessage?.success) {
        throw new Error(
          res?.submitContactMessage?.message ?? 'Something went wrong.',
        );
      }

      form.reset();
      setSubmitted(true);
    } catch {
      setError(
        'Sorry — we could not send your message. Please email us directly instead.',
      );
    }
  }

  return (
    <Section id={SECTIONS.contact}>
      <SectionHeading
        eyebrow="Get in touch"
        title="Start a project"
        description="Tell us what you're building and we'll get back to you within one business day."
      />

      <div className="mx-auto mt-12 max-w-2xl">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-10 text-center dark:border-orange-500/30 dark:bg-orange-500/10">
            <CheckCircle2 className="h-12 w-12 text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Thanks — we got your message!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We&apos;ll be in touch shortly. In the meantime, feel free to email
              us directly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@company.com"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="projectType"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Project type
              </label>
              <select
                id="projectType"
                name="projectType"
                required
                defaultValue=""
                className={inputClasses}
              >
                <option value="" disabled>
                  Select a project type…
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tell us about your project
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="What are you building, and what's your timeline?"
                className={inputClasses}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${ctaPrimary} w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto`}
            >
              {loading ? 'Sending…' : 'Send message'}
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Prefer email?{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            <Mail className="h-3.5 w-3.5" />
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </Section>
  );
}
