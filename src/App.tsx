import { useEffect } from 'react';
import { LenisProvider } from './context/LenisContext';
import { useRoute } from './lib/router';
import Grain from './components/Grain';
import Nav from './components/Nav';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Works from './pages/Works';
import ProjectDetail from './pages/ProjectDetail';

// Routing shell. LenisProvider (smooth scroll), Grain (global grain overlay) and Nav
// persist across every route; only the page body swaps. Routing is hash-based so it
// survives GitHub Pages deep links — see src/lib/router.ts.
export default function App() {
  const route = useRoute();
  const key = route.name === 'project' ? `project:${route.slug}` : route.name;

  // Each page switch starts at the top. In-page section anchors on Home keep route.name
  // === 'home', so this never fights the homepage's smooth anchor scrolling.
  useEffect(() => {
    const lenis = window.lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [key]);

  return (
    <LenisProvider>
      <Grain />
      <Nav />
      <PageTransition />
      {/* Animatable wrapper: PageTransition lifts/rises this whole container between routes. */}
      <div id="page-view">
        {route.name === 'home' && <Home />}
        {route.name === 'works' && <Works />}
        {/* Keyed by slug so each project remounts — resets state and replays entrance CSS. */}
        {route.name === 'project' && <ProjectDetail key={route.slug} slug={route.slug} />}
      </div>
    </LenisProvider>
  );
}
