import { ImageIcon } from 'lucide-react';
import Section from './Section';
import SectionHeading from './SectionHeading';
import { SECTIONS } from './styles';

interface Project {
  name: string;
  pitch: string;
  tech: string[];
  // TODO: Replace the placeholder area with a real screenshot:
  // import the image and set `image: '/work/rleaguez.png'`, then render it.
  image?: string;
}

// TODO: Update project pitches and tech badges with real details.
const PROJECTS: Project[] = [
  {
    name: 'RLeaguez',
    pitch:
      'A recreational sports league platform for organizing teams, schedules, and standings — web and mobile.',
    tech: ['Next.js', 'React Native', 'NestJS', 'Prisma'],
  },
  {
    name: '800Auto Two',
    pitch:
      'On-demand towing and roadside assistance, connecting drivers with nearby operators in real time.',
    tech: ['React Native', 'Node.js', 'Maps API', 'Stripe'],
  },
  {
    name: 'NeuroVista Art AI',
    pitch:
      'An AI-powered art studio that turns prompts and ideas into original, shareable generated artwork.',
    tech: ['Next.js', 'Python', 'OpenAI', 'PostgreSQL'],
  },
];

// Work / Portfolio — proof of capability, not products for sale.
export default function WorkSection() {
  return (
    <Section id={SECTIONS.work} muted>
      <SectionHeading
        eyebrow="Selected work"
        title="Products we've brought to life"
        description="A few of the apps we've designed and built. Proof of what we can do for you."
      />
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <article
            key={project.name}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
          >
            {/* Placeholder screenshot area — swap for a real image */}
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-orange-400 dark:from-gray-800 dark:to-gray-900 dark:text-gray-600">
              <ImageIcon className="h-10 w-10" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {project.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {project.pitch}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
