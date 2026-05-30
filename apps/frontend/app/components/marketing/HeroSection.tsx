import { ArrowRight } from 'lucide-react';
import { ctaPrimary, ctaSecondary, SECTIONS } from './styles';

// Hero — bold headline, one-line subhead, primary + secondary CTA.
// Lots of whitespace; a soft orange radial glow behind the headline.
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.orange.500/0.12),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {/* TODO: Tagline / availability badge */}
            Custom web &amp; mobile development
          </span>

          <h1 className="mt-6 font-[family-name:var(--font-urbanist)] text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-50">
            {/* TODO: Your headline */}
            We build software that moves your{' '}
            <span className="text-orange-500">business forward</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
            {/* TODO: One-line description of what Catto does */}
            Catto Software Solutions is a development agency crafting custom web
            and mobile apps — from first prototype to launch and beyond.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`#${SECTIONS.contact}`} className={ctaPrimary}>
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={`#${SECTIONS.work}`} className={ctaSecondary}>
              See Our Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
