import { useEffect, useRef, useState } from 'react';
import { runInitialRefresh } from '@/lib/scrollOrchestrator';
import { useSectionTitles } from '@/hooks/useSectionTitles';
import { useReveal } from '@/hooks/useReveal';
import { usePendingAnchor } from '@/hooks/usePendingAnchor';
import { useInkWater } from '@/hooks/useInkWater';
import Preloader from '@/components/Preloader';
import HeroCta from '@/components/HeroCta';
import Hero from '@/components/Hero';
import Showcase from '@/components/Showcase';
import Intro from '@/components/Intro';
import Stats from '@/components/Stats';
import SelectedWork from '@/components/SelectedWork';
import TechStack from '@/components/TechStack';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
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

  // Scroll to a section anchor stashed by a Nav click made from another route.
  usePendingAnchor();

  // Play the loader once per app session. Navigating back from another route keeps the
  // homepage immediate, while a full page load gets the complete intro sequence.
  const [showPreloader] = useState(() => !preloaderDone);
  useEffect(() => {
    preloaderDone = true;
  }, []);

  // Crimson ink loose in black water (cores/inkWater) — fixed canvas, so one body of ink
  // can drift the whole page and re-form beside each section.
  const inkRef = useRef<HTMLCanvasElement>(null);
  useInkWater(inkRef);

  return (
    <>
      {showPreloader && <Preloader />}
      <HeroCta />

      <main className="sdk-page">
        <canvas className="sdk-ink" ref={inkRef} aria-hidden="true"></canvas>
        <Hero />

        <div className="sdk-bg-scope">
          <Showcase />
          <Intro />
          <Stats />
          <SelectedWork />
          <TechStack />
          <Process />
          <Testimonials />
          <Contact />
        </div>
      </main>
    </>
  );
}
