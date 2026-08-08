import { useRef } from 'react';
import Contact from '@/components/Contact';
import PageHeroTitle from '@/components/PageHeroTitle';
import { usePageHeroIntro } from '@/hooks/usePageHeroIntro';
import { usePortraitParticles } from '@/hooks/usePortraitParticles';
import { useAboutActs } from '@/hooks/useAboutActs';

// /about — one continuous story rather than a stack of sections.
//
// The page is five ACTS plus the contact close. Each act owns the viewport; the two
// middle acts pin and step through their own beats as you scroll, so the journey and the
// principles are read one at a time instead of scanned as a list or a card grid. A fixed
// rail down the right edge marks where you are in the story.
//
// Running through all of it is a single WebGL point cloud (cores/portraitParticles): it
// assembles into the portrait for the opening, spells the manifesto out in act two,
// unwinds into a DNA helix that travels the middle of the page, and gathers again behind
// the contact block as an oversized watermark. One thread, six forms.

const PORTRAIT = 'assets/shiv-1-v2.webp';

// Single source for the manifesto: the cloud rasterises these to spell them out, and the
// same array renders the DOM copy that stands in when the cloud cannot run.
const MANIFESTO = [
  'Most websites inform.',
  'The best ones transport.',
  'I build the second kind — forged with precision, tempered with restraint.',
];

const ACTS = [
  { id: 'origin', label: 'Who' },
  { id: 'belief', label: 'Belief' },
  { id: 'road', label: 'Road' },
  { id: 'code', label: 'Code' },
  { id: 'arsenal', label: 'Arsenal' },
];

const journey = [
  {
    year: '2019',
    title: 'First lines of code',
    text: 'Small sites, big curiosity, and the realisation that design and code are the same craft seen from two sides.',
  },
  {
    year: '2021',
    title: 'Going professional',
    text: 'First client work shipped. The discipline of deadlines, feedback, and building things real people depend on.',
  },
  {
    year: '2023',
    title: 'Full-stack, full-story',
    text: 'Grew from interfaces into complete products — APIs, CMS platforms, deployments — owning the whole arc from brief to launch.',
  },
  {
    year: 'NOW',
    title: 'Cinematic web experiences',
    text: 'Premium, motion-driven sites where storytelling, performance and precision meet. This portfolio is built the way I build for clients.',
  },
];

const principles = [
  {
    kanji: '精',
    title: 'Precision',
    text: 'Details are not polish added at the end — they are the work. Pixel grids, easing curves and performance budgets all get the same respect.',
  },
  {
    kanji: '動',
    title: 'Motion',
    text: 'Interfaces should feel alive. Motion carries meaning: it guides, reassures and delights — never decorates for its own sake.',
  },
  {
    kanji: '物語',
    title: 'Story',
    text: 'Every site is a narrative with a beginning, a build and a payoff. I design the journey first, then the screens that tell it.',
  },
];

// Four rows that scroll past each other. Duplicated inline at render so each row can run
// as a seamless marquee without JS measuring anything.
const arsenal = [
  ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite'],
  ['GSAP', 'ScrollTrigger', 'WebGL', 'Lenis', 'Canvas'],
  ['Figma', 'Art direction', 'Design systems', 'Typography'],
  ['Node.js', 'REST APIs', 'CMS', 'Deployment'],
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);

  usePageHeroIntro();
  useAboutActs(rootRef);
  // True only when the cloud cannot run. The photograph is otherwise never shown, so
  // arriving does not spoil the convergence by displaying the finished image first.
  const needsFallback = usePortraitParticles(cloudRef, anchorRef, manifestoRef, PORTRAIT, MANIFESTO);

  return (
    <main className={`abt${needsFallback ? '' : ' is-cloud'}`} ref={rootRef}>
      {/* Fixed full-viewport layer, behind every act. It has to live here rather than
          inside an act: the cloud travels the length of the page, so a canvas scoped to
          one section would clip it the moment it left. */}
      <canvas className="abt-cloud" ref={cloudRef} aria-hidden="true"></canvas>

      <nav className="abt-rail" aria-hidden="true">
        {ACTS.map((act, i) => (
          <span key={act.id} className="abt-rail__mark">
            <i>{String(i + 1).padStart(2, '0')}</i>
            <b>{act.label}</b>
          </span>
        ))}
      </nav>

      {/* ── ACT I · WHO ─────────────────────────────────────────────────────── */}
      <section className="abt-hero" data-act="origin">
        <span className="abt-hero__kanji" aria-hidden="true" data-parallax="0.22">
          侍
        </span>
        <div className="container abt-hero__grid">
          <div className="abt-hero__copy" data-hero-intro>
            <span className="sdk-eyebrow">Developer · Designer · Craftsman</span>
            <PageHeroTitle lines={['Shivdutt', 'Karwa']} />
            <p className="abt-hero__lead">
              I&apos;m a full-stack developer from Rajasthan, India, building cinematic web
              experiences where design, motion and engineering are one discipline — not three
              departments.
            </p>
            <div className="abt-hero__hud" data-fx-stagger>
              <span className="abt-hero__chip">
                <span className="abt-hero__chip-dot" aria-hidden="true"></span>
                Available for work
              </span>
              <span className="abt-hero__chip">Suratgarh · Jaipur, India</span>
              <span className="abt-hero__chip">IST · UTC+5:30</span>
            </div>
          </div>
          {/* Holds the hero's share of the grid and gives the cloud something to line the
              assembled portrait up against — the canvas itself is page-level. */}
          <div
            className={`abt-portrait${needsFallback ? ' is-fallback' : ''}`}
            ref={anchorRef}
          >
            {/* Hidden unless the cloud cannot run — this is the reduced-motion and
                no-WebGL rendering, not a placeholder shown while the cloud starts. */}
            <img className="abt-portrait__img" src={PORTRAIT} alt="Portrait of Shivdutt Karwa" />
          </div>
        </div>
      </section>

      {/* ── ACT II · BELIEF ─────────────────────────────────────────────────── */}
      <section className="abt-belief" data-act="belief" ref={manifestoRef}>
        {/* Pinned, so the words hold still long enough to be read. Unpinned, the cloud's
            weight for this act rose and fell across a single viewport of scroll and the
            manifesto assembled and dissolved faster than anyone could finish it. */}
        <div className="abt-belief__pin">
          <div className="container">
            {/* The cloud spells this out in particles, so when it is running the DOM
                copy is held at opacity 0 — still in the accessibility tree and still
                holding the act's height. */}
            <p className="abt-belief__text">
              {MANIFESTO.map((line) => (
                <span key={line} className="abt-belief__line">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ── ACT III · THE ROAD ──────────────────────────────────────────────── */}
      <section className="abt-seq" data-act="road">
        <div className="abt-seq__pin">
          <span className="abt-seq__label">The road so far</span>
          <div className="abt-seq__stage">
            {journey.map((stop) => (
              <article key={stop.year} className="abt-seq__item abt-step">
                <span className="abt-step__ghost" aria-hidden="true">
                  {stop.year}
                </span>
                <span className="abt-step__year">{stop.year}</span>
                <h2 className="abt-step__title">{stop.title}</h2>
                <p className="abt-step__text">{stop.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACT IV · THE CODE I LIVE BY ─────────────────────────────────────── */}
      <section className="abt-seq" data-act="code">
        <div className="abt-seq__pin">
          <span className="abt-seq__label">The code I live by</span>
          <div className="abt-seq__stage">
            {principles.map((p) => (
              <article key={p.title} className="abt-seq__item abt-tenet">
                <span className="abt-tenet__ghost" aria-hidden="true">
                  {p.kanji}
                </span>
                <h2 className="abt-tenet__title">{p.title}</h2>
                <p className="abt-tenet__text">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACT V · ARSENAL ─────────────────────────────────────────────────── */}
      <section className="abt-arsenal" data-act="arsenal">
        <span className="abt-arsenal__label">What I wield</span>
        <div className="abt-arsenal__rows" aria-label="Tools and technologies">
          {arsenal.map((row, i) => (
            <div key={i} className={`abt-arsenal__row${i % 2 ? ' is-reverse' : ''}`}>
              {/* Rendered twice so the track can loop by translating exactly one copy. */}
              {[0, 1].map((copy) => (
                <div key={copy} className="abt-arsenal__group" aria-hidden={copy === 1}>
                  {row.map((item) => (
                    <span key={item} className="abt-arsenal__item">
                      {item}
                      <i aria-hidden="true">✦</i>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Contact />
    </main>
  );
}
