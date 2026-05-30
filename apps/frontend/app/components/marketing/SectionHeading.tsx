import cn from 'clsx';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

// Reusable heading block: small orange eyebrow, bold display title, lead copy.
export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-[family-name:var(--font-urbanist)] text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}
    </div>
  );
}
