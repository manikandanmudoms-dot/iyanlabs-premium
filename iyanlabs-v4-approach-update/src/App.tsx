import { Cursor, MotionToggle, ScrollProgress } from './components/layout/Chrome';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Intro } from './components/layout/Intro';
import { PageTransition } from './components/layout/PageTransition';
import { GlobalMotion } from './motion/GlobalMotion';
import { ApproachPage } from './pages/ApproachPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouterProvider, useRouter } from './router';

function Routes() {
  const { path } = useRouter();
  const page = path === '/' ? <HomePage /> : path === '/approach' ? <ApproachPage /> : <NotFoundPage />;
  return (
    <>
      {/* key={path} remounts the page so every section's ScrollTriggers are reverted on route change */}
      <main id="main" tabIndex={-1} key={path}>{page}</main>
      <Footer />
      {/* Re-created per route: destroys and recreates Lenis + global reveals, then refreshes ScrollTrigger */}
      <GlobalMotion key={`gm-${path}`} />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Intro />
      <ScrollProgress />
      <Header />
      <Routes />
      <PageTransition />
      <MotionToggle />
      <Cursor />
    </RouterProvider>
  );
}
