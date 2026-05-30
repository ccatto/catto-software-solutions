// app/[locale]/global-error.tsx
'use client';

import { useEffect, useState } from 'react';

/**
 * Global Error Page (Locale-specific)
 *
 * This is a special Next.js error boundary that catches unhandled errors.
 * It MUST render <html> and <body> tags since it replaces the entire page.
 *
 * Note: We inline styles here because global-error has import limitations.
 * Uses inline randomized sports puns for branded RLeaguez experience.
 *
 * Dark mode: We detect theme from localStorage or system preference since
 * this page replaces the root layout and loses theme context.
 */

function useThemeDetection() {
  // Default to dark for SSR to avoid flash
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check localStorage first (next-themes stores theme here)
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDark(true);
      return;
    }
    if (storedTheme === 'light') {
      setIsDark(false);
      return;
    }
    // Fall back to system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    setIsDark(prefersDark);
  }, []);

  return isDark;
}

const ERROR_MESSAGES = [
  'Flag on the play! We hit a technical foul.',
  'Our server hit the kitchen... and that\u2019s a fault!',
  'Swing and a miss! We struck out loading this page.',
  'Fumble! We dropped the ball on this one.',
  'Shot clock violation! This page took too long.',
  'Delay of game! Our servers need a timeout.',
  'Double fault! We\u2019ll get the next serve right.',
  'Icing on the play! The server got called for delay.',
];

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDark = useThemeDetection();
  const message =
    ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];

  return (
    <html className={isDark ? 'dark' : ''}>
      <body className="bg-slate-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Icon - AlertTriangle inline SVG */}
          <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-red-600 dark:text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-50 mb-3">
            Something Went Wrong
          </h1>

          {/* Subtitle (Random sports pun) */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-50 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              Try Again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </a>
          </div>

          {/* Branding footer */}
          <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">
            RLeaguez.com
          </p>
        </div>
      </body>
    </html>
  );
}
