import { About } from '../components/sections/About';
import { AIShowcase } from '../components/sections/AIShowcase';
import { Challenge } from '../components/sections/Challenge';
import { Contact } from '../components/sections/Contact';
import { Ecosystem } from '../components/sections/Ecosystem';
import { Hero } from '../components/sections/Hero';
import { Marquee } from '../components/sections/Marquee';
import { Process } from '../components/sections/Process';
import { Services } from '../components/sections/Services';
import { Work } from '../components/sections/Work';
import { usePageMeta } from '../router';

/** The existing v3 one-page site, unchanged. */
export function HomePage() {
  usePageMeta(
    'iyanLabs | Salesforce, MuleSoft, Mobile Apps, Websites, AI Agents & Chatbots',
    'iyanLabs builds Salesforce solutions, MuleSoft integrations, mobile apps, websites, AI agents, and chatbots that help businesses connect systems and work smarter.',
    '/',
  );
  return (
    <>
      <Hero />
      <Marquee />
      <Challenge />
      <Services />
      <AIShowcase />
      <Ecosystem />
      <Process />
      <Work />
      <About />
      <Contact />
    </>
  );
}
