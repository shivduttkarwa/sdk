import { useEffect, useState } from 'react';
import { runInitialRefresh } from '@/lib/scrollOrchestrator';
import { useSectionTitles } from '@/hooks/useSectionTitles';
import { useReveal } from '@/hooks/useReveal';
import Preloader from '@/components/Preloader';
import HeroCta from '@/components/HeroCta';
import Hero from '@/components/Hero';
import Showcase from '@/components/Showcase';
import Intro from '@/components/Intro';
import Stats from '@/components/Stats';
import SelectedWork from '@/components/SelectedWork';
import TechStack from '@/components/TechStack';
import Process from '@/components/Process';
import Contact from '@/components/Contact';

// The intro preloader is a first-visit affair. This module-level flag keeps it from
// replaying every time the user navigates back to Home from /works.
let preloaderDone = false;

// The homepage — everything that used to live directly in <App>. DOM order still mirrors
// the original <body>: preloader, floating hero CTA, then <main class="sdk-page"> = hero +
// <div class="sdk-bg-scope"> wrapping the rest. Grain + Nav are now in the App shell so
// they persist across route changes.
export default function Home() {
  // Cross-section units (run over all `.sdk-stack-section` / `.sdk-reveal`).
  useSectionTitles();
  useReveal();

  // Runs after every section hook has created its ScrollTriggers (React runs child effects
  // before parent effects), coordinating the single initial refresh.
  useEffect(() => runInitialRefresh(), []);

  const [showPreloader] = useState(() => !preloaderDone);
  useEffect(() => {
    preloaderDone = true;
  }, []);

  return (
    <>
      {showPreloader && <Preloader />}
      <HeroCta />

      <main className="sdk-page">
        <Hero />

        <div className="sdk-bg-scope">
          <Showcase />
          <Intro />
          <Stats />
          <SelectedWork />
          <TechStack />
          <Process />
          <Contact />
        </div>
      </main>
    </>
  );
}
