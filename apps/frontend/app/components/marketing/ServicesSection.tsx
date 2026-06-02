import {
  Smartphone,
  Globe,
  Sparkles,
  RefreshCw,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import Section from './Section';
import SectionHeading from './SectionHeading';
import { SECTIONS } from './styles';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: Smartphone,
    title: 'Mobile Apps (iOS + Android)',
    description:
      'Native-quality cross-platform apps built to feel fast, fluid, and right at home on every device.',
  },
  {
    icon: Globe,
    title: 'Web Apps & Websites',
    description:
      'Marketing sites, dashboards, and full web platforms — responsive, accessible, and built to scale.',
  },
  {
    icon: RefreshCw,
    title: 'Update & Modernize Existing Apps',
    description:
      "Already have a web or mobile app? We jump into your existing codebase to add features, fix bugs, refresh the design, and bring it up to modern standards.",
  },
  {
    icon: Sparkles,
    title: 'AI Integration & Custom AI Features',
    description:
      'Bring AI into your product: smart assistants, content generation, and custom model integrations.',
  },
  {
    icon: Rocket,
    title: 'MVP & Prototype Builds for Startups',
    description:
      'Get to market fast with a lean, investor-ready MVP that proves your idea without the bloat.',
  },
  {
    icon: LifeBuoy,
    title: 'Maintenance & Ongoing Support',
    description:
      'Keep your product healthy with updates, monitoring, and a partner who knows your codebase.',
  },
];

// Services — grid of cards (icon, title, short description).
export default function ServicesSection() {
  return (
    <Section id={SECTIONS.services}>
      <SectionHeading
        eyebrow="What we do"
        title="Services built around your goals"
        description="End-to-end product development — strategy, design, and engineering under one roof."
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-500/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/10 dark:text-orange-400">
              <Icon className="h-6 w-6" />
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
