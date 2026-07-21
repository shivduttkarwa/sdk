import { useEffect } from 'react';
import { LenisProvider } from './context/LenisContext';
import { runInitialRefresh } from './lib/scrollOrchestrator';
import { useSectionTitles } from './hooks/useSectionTitles';
import { useReveal } from './hooks/useReveal';
import Preloader from './components/Preloader';
import Grain from './components/Grain';
import Nav from './components/Nav';
import HeroCta from './components/HeroCta';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import Intro from './components/Intro';
import Stats from './components/Stats';
import SelectedWork from './components/SelectedWork';
import TechStack from './components/TechStack';
import Process from './components/Process';
import Contact from './components/Contact';

// DOM order mirrors the original <body> 1:1: preloader, grain, nav, floating hero CTA,
// then <main class="sdk-page"> = hero + <div class="sdk-bg-scope"> wrapping the rest.
export default function App() {
  // Cross-section units (run over all `.sdk-stack-section` / `.sdk-reveal`).
  useSectionTitles();
  useReveal();

  // App's effect runs after every section hook has created its ScrollTriggers (React runs
  // child effects before parent effects), so this coordinates the single initial refresh.
  useEffect(() => runInitialRefresh(), []);

  return (
    <LenisProvider>
      <Preloader />
      <Grain />
      <Nav />
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

          {/*
            Original had a commented-out <section class="sdk-cta-section" id="hire"> here
            containing <canvas id="tubes-canvas"> (TubesCursor). It is commented out in the
            source and never rendered, so it is intentionally omitted (dormant — see plan).
          */}

          <Contact />
        </div>
      </main>
    </LenisProvider>
  );
}
