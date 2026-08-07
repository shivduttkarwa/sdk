import { useRef } from 'react';
import Contact from '@/components/Contact';
import PageHeroTitle from '@/components/PageHeroTitle';
import { usePageFx } from '@/hooks/usePageFx';

// /about — the person behind the pixels. Portrait hero with a parallax kanji watermark,
// a per-line manifesto reveal, a journey timeline whose spine draws itself on scroll,
// count-up numbers (same figures as the homepage stats) and three values cards.

const journey = [
  {
    year: '2019',
    title: 'First lines of code',
    text: 'Started building for the web — small sites, big curiosity, and the realisation that design and code are the same craft seen from two sides.',
  },
  {
    year: '2021',
    title: 'Going professional',
    text: 'First client work shipped. Learned the discipline of deadlines, feedback and building things real people depend on.',
  },
  {
    year: '2023',
    title: 'Full-stack, full-story',
    text: 'Grew from interfaces into complete products — APIs, CMS platforms, deployments — owning the whole arc from brief to launch.',
  },
  {
    year: 'Now',
    title: 'Cinematic web experiences',
    text: 'Focused on premium, motion-driven sites where storytelling, performance and precision meet. This portfolio is built the way I build for clients.',
  },
];

const values = [
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

const toolbox = [
  { group: 'Design', items: ['Figma', 'Art direction', 'Design systems', 'Typography'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { group: 'Motion', items: ['GSAP', 'ScrollTrigger', 'WebGL', 'Lenis'] },
  { group: 'Backend', items: ['Node.js', 'REST APIs', 'CMS', 'Deployment'] },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  usePageFx(rootRef);

  return (
    <main className="abt" ref={rootRef}>
      <section className="abt-hero">
        <span className="abt-hero__kanji" aria-hidden="true" data-parallax="0.22">
          侍
        </span>
        <div className="container abt-hero__grid">
          <div className="abt-hero__copy">
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
          <div className="abt-hero__portrait" data-fx="clip">
            <img src="assets/shiv-1-v2.webp" alt="Portrait of Shivdutt Karwa" data-parallax="0.08" />
            <span className="abt-hero__portrait-frame" aria-hidden="true"></span>
          </div>
        </div>
      </section>

      <section className="abt-manifesto">
        <div className="container">
          <p className="abt-manifesto__text" data-fx-stagger>
            <span className="abt-manifesto__line">Most websites inform.</span>
            <span className="abt-manifesto__line">
              The best ones <em>transport</em>.
            </span>
            <span className="abt-manifesto__line">
              I build the second kind — forged with precision, tempered with restraint.
            </span>
          </p>
        </div>
      </section>

      <section className="abt-numbers">
        <div className="container abt-numbers__row" data-fx-stagger>
          <div className="abt-numbers__cell">
            <span className="abt-numbers__value">
              <span data-count="5" data-count-suffix="+">5+</span>
            </span>
            <span className="abt-numbers__label">Years of craft</span>
          </div>
          <div className="abt-numbers__cell">
            <span className="abt-numbers__value">
              <span data-count="40" data-count-suffix="+">40+</span>
            </span>
            <span className="abt-numbers__label">Projects shipped</span>
          </div>
          <div className="abt-numbers__cell">
            <span className="abt-numbers__value">
              <span data-count="12" data-count-suffix="+">12+</span>
            </span>
            <span className="abt-numbers__label">Tech mastered</span>
          </div>
        </div>
      </section>

      <section className="abt-journey">
        <div className="container">
          <div className="abt-journey__head">
            <span className="sdk-eyebrow">The road so far</span>
            <h2 className="abt-journey__heading" data-fx="rise">
              Journey
            </h2>
          </div>
          <div className="abt-journey__timeline">
            <span className="abt-journey__spine" data-fx="drawv" aria-hidden="true"></span>
            <ol className="abt-journey__list">
              {journey.map((stop, i) => (
                <li
                  key={stop.year}
                  className="abt-journey__stop"
                  data-fx="rise"
                  data-fx-delay={String(i * 0.06)}
                >
                  <span className="abt-journey__node" aria-hidden="true"></span>
                  <span className="abt-journey__year">{stop.year}</span>
                  <h3 className="abt-journey__title">{stop.title}</h3>
                  <p className="abt-journey__text">{stop.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="abt-values">
        <div className="container">
          <div className="abt-values__head">
            <span className="sdk-eyebrow">What I optimise for</span>
            <h2 className="abt-values__heading" data-fx="rise">
              Three principles
            </h2>
          </div>
          <div className="abt-values__grid" data-fx-stagger>
            {values.map((value) => (
              <article key={value.title} className="abt-value">
                <span className="abt-value__kanji" aria-hidden="true">
                  {value.kanji}
                </span>
                <h3 className="abt-value__title">{value.title}</h3>
                <p className="abt-value__text">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="abt-toolbox">
        <div className="container">
          <div className="abt-toolbox__head">
            <span className="sdk-eyebrow">The toolbox</span>
            <h2 className="abt-toolbox__heading" data-fx="rise">
              Weapons of choice
            </h2>
          </div>
          <div className="abt-toolbox__grid">
            {toolbox.map((group, i) => (
              <div
                key={group.group}
                className="abt-toolbox__group"
                data-fx="rise"
                data-fx-delay={String(i * 0.07)}
              >
                <span className="abt-toolbox__group-label">{group.group}</span>
                <div className="abt-toolbox__chips">
                  {group.items.map((item) => (
                    <span key={item} className="abt-toolbox__chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </main>
  );
}
