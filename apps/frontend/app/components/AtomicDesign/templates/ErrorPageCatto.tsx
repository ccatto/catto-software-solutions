// app/components/AtomicDesign/templates/ErrorPageCatto.tsx
'use client';

import { LinkCatto } from '@ccatto/ui';
import { AlertCircle, AlertTriangle, Home, Search, UserX } from 'lucide-react';

export type ErrorIconType = 'error' | 'notFound' | 'auth' | 'server';

export interface ErrorPageCattoProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle line shown below the title */
  subtitle?: string;
  /** Optional supporting description (longer body copy) */
  description?: string;
  /** Optional error code badge ("404", "500", etc.) */
  errorCode?: string;
  /** Icon style — picks one of four lucide icons */
  iconType?: ErrorIconType;
  /** Primary action button label (defaults to "Go home") */
  actionLabel?: string;
  /** Primary action href (defaults to "/") */
  actionHref?: string;
  /** Optional secondary action button label */
  secondaryActionLabel?: string;
  /** Optional secondary action href */
  secondaryActionHref?: string;
}

const iconMap = {
  error: AlertCircle,
  notFound: Search,
  auth: UserX,
  server: AlertTriangle,
} as const;

const ErrorPageCatto = ({
  title,
  subtitle,
  description,
  errorCode,
  iconType = 'error',
  actionLabel = 'Go home',
  actionHref = '/',
  secondaryActionLabel,
  secondaryActionHref,
}: ErrorPageCattoProps) => {
  const Icon = iconMap[iconType];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <Icon className="mb-6 h-16 w-16 text-gray-400 dark:text-gray-500" />
      {errorCode && (
        <p className="mb-2 text-sm font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {errorCode}
        </p>
      )}
      <h1 className="mb-3 text-3xl font-extrabold text-gray-900 md:text-5xl dark:text-slate-50">
        {title}
      </h1>
      {subtitle && (
        <p className="mb-3 text-xl text-gray-600 dark:text-gray-300">{subtitle}</p>
      )}
      {description && (
        <p className="mb-8 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LinkCatto href={actionHref} variant="button" className="inline-flex items-center">
          <Home className="mr-2 h-4 w-4" />
          {actionLabel}
        </LinkCatto>
        {secondaryActionLabel && secondaryActionHref && (
          <LinkCatto href={secondaryActionHref} variant="outline" className="inline-flex items-center">
            {secondaryActionLabel}
          </LinkCatto>
        )}
      </div>
    </div>
  );
};

export default ErrorPageCatto;
