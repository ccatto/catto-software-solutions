import Image from 'next/image';
import { ImageIcon, ExternalLink } from 'lucide-react';
import Section from './Section';
import SectionHeading from './SectionHeading';
import { SECTIONS } from './styles';

interface Project {
  name: string;
  pitch: string;
  tech: string[];
  url: string;
  // Screenshots live in public/work/. TODO: refresh with framed/branded versions when ready.
  image?: string;
}

// TODO: Confirm project pitches/tech badges.
const PROJECTS: Project[] = [
  {
    name: 'RLeaguez',
    pitch:
      'A recreational sports league platform for organizing teams, schedules, and standings — web and mobile.',
    tech: ['Next.js', 'React Native', 'NestJS', 'Prisma'],
    url: 'https://www.rleaguez.com/en',
    image: '/work/rleaguez.png',
  },
  {
    name: '800Auto Two',
    pitch:
      'On-demand towing and roadside assistance, connecting drivers with nearby operators in real time.',
    tech: ['React Native', 'Node.js', 'Maps API', 'Stripe'],
    url: 'https://www.1800autotow.com/',
    image: '/work/autotow.png',
  },
  {
    name: 'NeuroVista Art AI',
    pitch:
      'An AI-powered art studio that turns prompts and ideas into original, shareable generated artwork.',
    tech: ['Next.js', 'Python', 'OpenAI', 'PostgreSQL'],
    url: 'https://neuroartai.com/',
    image: '/work/neuroartai.png',
  },
  {
    name: 'Pickle Paddle Reviews',
    pitch:
      'A pickleball paddle review platform — specs, ratings, and lab-tested comparisons to help players find the right paddle. Web and mobile, in 8 languages.',
    tech: ['Next.js', 'NestJS', 'Prisma', 'Capacitor'],
    // TODO: swap to https://picklepaddlereviews.com once Cloudflare DNS is wired to Fly (PPR launch doc, Task 5).
    url: 'https://pickle-paddle-reviews.fly.dev',
    // TODO: add screenshot at public/work/picklepaddlereviews.png, then set image below.
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
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-orange-500/40"
          >
            <div className="relative aspect-video overflow-hidden border-b border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-orange-400 dark:text-gray-600">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
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
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
                Visit site
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
