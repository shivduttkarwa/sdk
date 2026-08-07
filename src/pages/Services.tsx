import { useRef, useState } from 'react';
import { services, processSteps } from '@/data/services';
import Contact from '@/components/Contact';
import PageHeroTitle from '@/components/PageHeroTitle';
import { usePageFx } from '@/hooks/usePageFx';
import { usePageHeroIntro } from '@/hooks/usePageHeroIntro';

// /services — the five disciplines as a horizontal panel rack: each service is a
// full-height column showing only its number, kanji and a vertical title until it opens,
// at which point it takes half the rack and the others fall back to spines. Then a
// capability marquee and the process strip, closing on the shared contact footer — which
// is itself a full CTA, so the page carries no separate one.
//
// This replaced a vertical accordion of numbered rows — the same pattern the /works list
// used to run — chosen partly so this page is driven by INTERACTION rather than scroll.
// The homepage and /works are both scroll-driven WebGL; a third would read as a habit.
export default function Services() {
  const rootRef = useRef<HTMLElement>(null);
  // One panel is always open — a rack of five closed spines has nothing to read.
  const [active, setActive] = useState(0);
  usePageFx(rootRef);
  usePageHeroIntro();

  const marqueeItems = [
    'Web Design',
    'React',
    'GSAP',
    'TypeScript',
    'WebGL',
    'Motion',
    'Branding',
    'Node.js',
    'UI / UX',
    'Next.js',
  ];

  return (
    <main className="svc" ref={rootRef}>
      <section className="svc-hero">
        <span className="svc-hero__kanji" aria-hidden="true" data-parallax="0.22">
          技
        </span>
        <div className="container" data-hero-intro>
          <span className="sdk-eyebrow">What I offer</span>
          <PageHeroTitle lines={['Services', '& craft']} />
          <p className="svc-hero__lead">
            Five disciplines, one pair of hands. Every engagement runs the full arc — from the
            first question to the last deploy — so nothing gets lost between specialists.
          </p>
        </div>
      </section>

      <section className="svc-rack-section" aria-label="Services">
        <div className="container">
          <div className="svc-rack">
            {services.map((service, i) => {
              const isActive = active === i;
              return (
                <div
                  key={service.num}
                  className={`svc-panel${isActive ? ' is-active' : ''}`}
                  // Mouse opens on hover; pen and touch are left to the click below, so a
                  // tap does not both hover-open and click-open in the same gesture.
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setActive(i);
                  }}
                >
                  {/* The hit target covers the whole column so the entire panel is
                      clickable. It carries the disclosure semantics; the visible spine and
                      body are decoration hung off it. Nothing inside either is focusable,
                      so this overlay traps nothing. */}
                  <button
                    type="button"
                    className="svc-panel__hit"
                    aria-expanded={isActive}
                    aria-controls={`svc-body-${service.num}`}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className="sdk-sr-only">{service.title}</span>
                  </button>

                  <div className="svc-panel__spine" aria-hidden="true">
                    <span className="svc-panel__num">{service.num}</span>
                    <span className="svc-panel__label">{service.title}</span>
                    <span className="svc-panel__kanji">{service.kanji}</span>
                  </div>

                  <div
                    className="svc-panel__body"
                    id={`svc-body-${service.num}`}
                    // Matches aria-expanded: a closed panel is out of the accessibility
                    // tree, and tabbing to its button opens it (onFocus above).
                    aria-hidden={!isActive}
                  >
                    <span className="svc-panel__kanji svc-panel__kanji--wash" aria-hidden="true">
                      {service.kanji}
                    </span>
                    <span className="svc-panel__num">{service.num}</span>
                    <h3 className="svc-panel__heading">{service.title}</h3>
                    <p className="svc-panel__tagline">{service.tagline}</p>
                    <p className="svc-panel__desc">{service.description}</p>
                    <ul className="svc-panel__list">
                      {service.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="svc-marquee" aria-hidden="true">
        <div className="svc-marquee__track">
          {[0, 1].map((copy) => (
            <div key={copy} className="svc-marquee__group">
              {marqueeItems.map((item) => (
                <span key={item} className="svc-marquee__item">
                  {item}
                  <span className="svc-marquee__dot"></span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="svc-process">
        <div className="container">
          <div className="svc-process__head">
            <span className="sdk-eyebrow">How it runs</span>
            <h2 className="svc-process__heading" data-fx="rise">
              A straight line from idea to launch
            </h2>
          </div>
          <ol className="svc-process__steps" data-fx-stagger>
            {processSteps.map((step) => (
              <li key={step.num} className="svc-process__step">
                <span className="svc-process__num" aria-hidden="true">
                  {step.num}
                </span>
                <span className="svc-process__rule" aria-hidden="true"></span>
                <h3 className="svc-process__title">{step.title}</h3>
                <p className="svc-process__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Contact />
    </main>
  );
}
