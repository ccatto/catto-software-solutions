import cn from 'clsx';
import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  /** Subtle muted background to alternate sections visually. */
  muted?: boolean;
  className?: string;
  children: ReactNode;
}

// Generic section wrapper: consistent vertical rhythm, centered max-width,
// and scroll-margin so the sticky header doesn't cover anchored sections.
export default function Section({
  id,
  muted = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 py-20 sm:py-28',
        muted && 'bg-slate-50 dark:bg-gray-900',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
