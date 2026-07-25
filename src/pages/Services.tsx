import { useRef, useState } from 'react';
import { services, processSteps } from '@/data/services';
import Contact from '@/components/Contact';
import { usePageFx } from '@/hooks/usePageFx';

// /services — what I offer, as an expanding accordion of large numbered rows (the
// awwwards pattern the /works list already speaks), a process strip whose connecting
// line draws itself on scroll, a capability marquee and a magnetic CTA band.
export default function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  usePageFx(rootRef);

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
        <div className="container">
          <span className="sdk-eyebrow">What I offer</span>
          <h1 className="svc-hero__title">
            <span className="svc-hero__title-line">Services</span>
            <span className="svc-hero__title-line svc-hero__title-dim">&amp; craft</span>
          </h1>
          <p className="svc-hero__lead">
            Five disciplines, one pair of hands. Every engagement runs the full arc — from the
            first question to the last deploy — so nothing gets lost between specialists.
          </p>
        </div>
      </section>

      <section className="svc-list-section">
        <div className="container">
          <ul className="svc-list" data-fx-stagger>
            {services.map((service, i) => {
              const isOpen = open === i;
              return (
                <li key={service.num} className={`svc-row${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="svc-row__head"
                    aria-expanded={isOpen}
                    aria-controls={`svc-panel-${service.num}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="svc-row__num">{service.num}</span>
                    <span className="svc-row__title">
                      {service.title}
                      <span className="svc-row__kanji" aria-hidden="true">
                        {service.kanji}
                      </span>
                    </span>
                    <span className="svc-row__tagline">{service.tagline}</span>
                    <span className="svc-row__toggle" aria-hidden="true">
                      <span></span>
                      <span></span>
                    </span>
                  </button>
                  <div className="svc-row__panel" id={`svc-panel-${service.num}`}>
                    <div className="svc-row__panel-inner">
                      <p className="svc-row__desc">{service.description}</p>
                      <div className="svc-row__tags">
                        {service.deliverables.map((item) => (
                          <span key={item} className="svc-row__tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
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
          <span className="svc-process__line" data-fx="draw" aria-hidden="true"></span>
          <ol className="svc-process__steps" data-fx-stagger>
            {processSteps.map((step) => (
              <li key={step.num} className="svc-process__step">
                <span className="svc-process__num">{step.num}</span>
                <h3 className="svc-process__title">{step.title}</h3>
                <p className="svc-process__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="svc-cta">
        <div className="container svc-cta__inner">
          <p className="svc-cta__kicker" data-fx="rise">
            Have a project in mind?
          </p>
          <a className="svc-cta__btn" href="#/contact" data-magnetic="0.25" data-fx="rise" data-fx-delay="0.1">
            <span>Start a conversation</span>
            <span className="svc-cta__btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </section>

      <Contact />
    </main>
  );
}
