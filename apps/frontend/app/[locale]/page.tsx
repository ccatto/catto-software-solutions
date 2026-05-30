import HeroSection from '../components/marketing/HeroSection';
import ServicesSection from '../components/marketing/ServicesSection';
import WorkSection from '../components/marketing/WorkSection';
import AboutSection from '../components/marketing/AboutSection';
import ProcessSection from '../components/marketing/ProcessSection';
import ContactSection from '../components/marketing/ContactSection';

// Catto Software Solutions — single-page marketing site.
// Sections render in order; the sticky header smooth-scrolls to each via anchors.
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WorkSection />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
