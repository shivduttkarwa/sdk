import { useMemo, useRef } from 'react';
import { projects } from '@/data/projects';
import Contact from '@/components/Contact';
import PageHeroTitle from '@/components/PageHeroTitle';
import { usePageHeroIntro } from '@/hooks/usePageHeroIntro';
import { useWorksStage } from '@/hooks/useWorksStage';

// The /works index: cinematic hero, then a single full-bleed WebGL stage where each
// project's cover ripples into the next as you scroll, with the copy for the frontmost
// project composited over it. Closes on the shared contact footer.
//
// This replaced a text-only hover-reveal list whose covers followed the cursor — a list
// that showed no imagery at all on touch (the floating preview was display:none under
// `hover: none`) and used none of the copy in data/projects beyond title/category/year.
//
// The stage is scroll-driven, so the copy for four of the five projects is only reachable
// by scrolling. The visually-hidden index at the bottom of the section keeps every case
// one Tab away regardless — see `.sdk-sr-only`.
export default function Works() {
  const rootRef = useRef<HTMLElement>(null);
  usePageHeroIntro();

  const covers = useMemo(() => projects.map((p) => p.cover), []);
  const active = useWorksStage(covers);
  const project = projects[active] ?? projects[0];

  return (
    <main className="works" id="work-index" ref={rootRef}>
      <section className="works-hero">
        <div className="container" data-hero-intro>
          <span className="sdk-eyebrow">Portfolio · 2021 — 2024</span>
          <PageHeroTitle lines={['Selected', 'Work']} />
          <p className="works-hero__lead">
            A selection of products, platforms and brands I&apos;ve designed and built — from
            the first idea to launch day.
          </p>
        </div>
        <a className="works-hero__scroll" href="#work-list">
          <span>Scroll to explore</span>
          <span className="works-hero__scroll-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>

      <section className="works-stage-section" id="work-list">
        {/* Tall runway: the sticky panel holds while this scrolls past, and the distance
            travelled is what drives the morph. One viewport per transition. */}
        <div
          className="works-stage__runway"
          id="sdk-works-runway"
          style={{ height: `${projects.length * 100}vh` }}
        >
          <div className="works-stage" id="sdk-works-stage">
            <canvas className="works-stage__fx" id="sdk-works-fx" aria-hidden="true"></canvas>

            {/* Shown when WebGL is unavailable or reduced motion is on; the core toggles
                `is-active` on these exactly as it drives the shader. */}
            <div className="works-stage__fallback" aria-hidden="true">
              {projects.map((p, i) => (
                <img
                  key={p.slug}
                  className={i === 0 ? 'works-stage__img is-active' : 'works-stage__img'}
                  src={p.cover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>

            <div className="works-stage__scrim" aria-hidden="true"></div>

            <header className="works-stage__hud">
              <span className="works-stage__hud-label">Selected Work</span>
              <span className="works-stage__count">
                <b>{project.num}</b>
                <i aria-hidden="true">/</i>
                <span>{String(projects.length).padStart(2, '0')}</span>
              </span>
            </header>

            {/* Keyed on the slug so every field re-mounts and replays its entrance when the
                frontmost project changes. */}
            <div className="works-stage__panel" key={project.slug}>
              <div className="works-stage__meta">
                <span>{project.category}</span>
                <span className="works-stage__dot" aria-hidden="true"></span>
                <span>{project.year}</span>
              </div>
              <h2 className="works-stage__name">{project.title}</h2>
              <p className="works-stage__sub">{project.subtitle}</p>
              <p className="works-stage__summary">{project.summary}</p>
              <a
                className="works-stage__cta"
                href={`#/works/${project.slug}`}
                data-transition-label={project.title}
              >
                View case
                <span className="works-stage__cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>

            <div className="works-stage__rail" aria-hidden="true">
              <span className="works-stage__rail-fill"></span>
              {projects.slice(1).map((p, i) => (
                <i
                  key={p.slug}
                  className="works-stage__rail-tick"
                  style={{ left: `${((i + 1) / (projects.length - 1)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <nav className="sdk-sr-only" aria-label="All projects">
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <a href={`#/works/${p.slug}`}>
                  {p.title} — {p.subtitle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <Contact />
    </main>
  );
}
