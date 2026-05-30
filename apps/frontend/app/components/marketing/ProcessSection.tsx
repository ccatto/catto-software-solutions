import { Search, PenTool, Code2, Rocket, type LucideIcon } from 'lucide-react';
import Section from './Section';
import SectionHeading from './SectionHeading';
import { SECTIONS } from './styles';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: 'Discovery',
    description:
      'We dig into your goals, users, and constraints to define exactly what to build.',
  },
  {
    icon: PenTool,
    title: 'Design',
    description:
      'Wireframes and polished UI that map the experience before a line of code is written.',
  },
  {
    icon: Code2,
    title: 'Build',
    description:
      'Iterative development with regular demos so you see progress every step of the way.',
  },
  {
    icon: Rocket,
    title: 'Launch & Support',
    description:
      'We ship it, monitor it, and keep improving — your product is never left on its own.',
  },
];

// Process — 4 numbered steps.
export default function ProcessSection() {
  return (
    <Section id={SECTIONS.process} muted>
      <SectionHeading
        eyebrow="How we work"
        title="A clear path from idea to launch"
        description="A simple, transparent process designed to reduce risk and keep you in the loop."
      />
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, description }, i) => (
          <div key={title} className="relative">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <span className="font-[family-name:var(--font-urbanist)] text-4xl font-bold text-gray-200 dark:text-gray-700">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-50">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
