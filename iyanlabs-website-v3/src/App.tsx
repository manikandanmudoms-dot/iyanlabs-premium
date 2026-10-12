import { Cursor, MotionToggle, ScrollProgress } from './components/layout/Chrome';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Intro } from './components/layout/Intro';
import { About } from './components/sections/About';
import { AIShowcase } from './components/sections/AIShowcase';
import { Challenge } from './components/sections/Challenge';
import { Contact } from './components/sections/Contact';
import { Ecosystem } from './components/sections/Ecosystem';
import { Hero } from './components/sections/Hero';
import { Marquee } from './components/sections/Marquee';
import { Process } from './components/sections/Process';
import { Services } from './components/sections/Services';
import { Work } from './components/sections/Work';
import { GlobalMotion } from './motion/GlobalMotion';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Intro />
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
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
      </main>
      <Footer />
      <MotionToggle />
      <Cursor />
      {/* Must stay last: smooth scroll + global reveals are set up after section triggers exist. */}
      <GlobalMotion />
    </>
  );
}
