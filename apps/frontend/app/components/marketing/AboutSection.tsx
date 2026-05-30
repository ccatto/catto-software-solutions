import Section from './Section';
import SectionHeading from './SectionHeading';
import { SECTIONS } from './styles';

const TECH_STACK = [
  'Swift',
  'Kotlin',
  'React',
  'React Native',
  'Next.js',
  'TypeScript',
  'Node.js',
  'NestJS',
  'Python',
  'PostgreSQL',
  'Prisma',
  'AWS',
];

// About / Skills — short bio, experience stat, tech badges.
export default function AboutSection() {
  return (
    <Section id={SECTIONS.about}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="About"
            title="A partner, not just a vendor"
            centered={false}
          />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            <p>
              Catto Software Solutions is a software development studio focused
              on shipping polished, reliable products. We work closely with
              founders and teams to turn ideas into apps people love to use.
            </p>
            <p>
              From the first whiteboard sketch to the App Store listing, we
              handle the full journey — and stick around to help you grow.
            </p>
          </div>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-urbanist)] text-5xl font-bold text-orange-500">
              25+
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              years building web &amp; mobile software
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tech we work with
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-orange-500/40 dark:hover:text-orange-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
