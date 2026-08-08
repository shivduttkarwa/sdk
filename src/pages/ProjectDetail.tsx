import { useRef } from 'react';
import { getProject, getNextProject } from '@/data/projects';
import Contact from '@/components/Contact';
import PageHeroTitle from '@/components/PageHeroTitle';
import { usePageFx } from '@/hooks/usePageFx';
import { usePageHeroIntro } from '@/hooks/usePageHeroIntro';

// /works/:slug — cinematic case study. Hero with an oversized index watermark, a
// clip-revealed parallax cover, editorial overview with a sticky kanji rail, animated
// meta strip and a full-bleed next-project teaser. All scroll FX are declarative
// data-fx attributes handled by usePageFx.
export default function ProjectDetail({ slug }: { slug: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const project = getProject(slug);
  usePageFx(rootRef);
  usePageHeroIntro();

  if (!project) {
    return (
      <main className="project project--missing">
        <div className="container">
          <p className="sdk-eyebrow">404</p>
          <h1 className="project__title">Project not found</h1>
          <p className="project__summary">
            That case doesn&apos;t exist (or moved). Head back to the full list.
          </p>
          <a className="project__back" href="#/works">
            ← All work
          </a>
        </div>
      </main>
    );
  }

  const next = getNextProject(slug);

  return (
    <main className="pd" ref={rootRef}>
      <section className="pd-hero">
        <span className="pd-hero__num" aria-hidden="true" data-parallax="0.25">
          {project.num}
        </span>
        <div className="container" data-hero-intro>
          <a className="pd__back" href="#/works" data-transition-label="Work">
            <span className="pd__back-arrow" aria-hidden="true">
              ←
            </span>
            All work
          </a>
          <p className="sdk-eyebrow">
            {project.category} · {project.year}
          </p>
          <PageHeroTitle lines={[project.title]} size="lg" />
          <p className="pd-hero__sub">{project.subtitle}</p>
          <div className="pd-hero__foot">
            <p className="pd-hero__lead">{project.summary}</p>
            <div className="pd-hero__actions">
              <a
                className="sdk-btn sdk-btn--settle"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Visit live site</span>
                <span className="sdk-btn__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <span className="pd__cta-domain">{project.urlLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <figure className="pd-cover" data-fx="clip">
        <div className="pd-cover__frame">
          <img
            src={project.cover}
            alt={`${project.title} — ${project.subtitle}`}
            data-parallax="0.12"
          />
        </div>
        <figcaption className="pd-cover__hud" aria-hidden="true">
          <span>{project.client}</span>
          <span className="pd-cover__hud-dot"></span>
          <span>{project.category}</span>
          <span className="pd-cover__hud-dot"></span>
          <span>{project.year}</span>
        </figcaption>
      </figure>

      <section className="pd-meta">
        <div className="container">
          <div className="pd-meta__row" data-fx-stagger>
            <div className="pd-meta__cell">
              <span className="pd-meta__label">Client</span>
              <span className="pd-meta__value">{project.client}</span>
            </div>
            <div className="pd-meta__cell">
              <span className="pd-meta__label">Role</span>
              <span className="pd-meta__value">{project.role}</span>
            </div>
            <div className="pd-meta__cell">
              <span className="pd-meta__label">Year</span>
              <span className="pd-meta__value">{project.year}</span>
            </div>
            <div className="pd-meta__cell">
              <span className="pd-meta__label">Services</span>
              <span className="pd-meta__value">{project.services.join(' · ')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pd-info">
        <div className="container pd-info__grid">
          <aside className="pd-info__rail">
            <span className="pd-info__kanji" aria-hidden="true" data-parallax="0.18">
              概要
            </span>
            <h2 className="pd-info__heading" data-fx="rise">
              Overview
            </h2>
            <span className="pd-info__rule" data-fx="draw"></span>
          </aside>
          <div className="pd-info__body">
            {project.overview.map((para, i) => (
              <p key={i} className="pd-info__para" data-fx="rise" data-fx-delay={String(i * 0.08)}>
                {para}
              </p>
            ))}
            <div className="pd-stack" data-fx="rise">
              <span className="pd-stack__label">Built with</span>
              <div className="pd-stack__tags">
                {project.stack.map((tech) => (
                  <span key={tech} className="pd-stack__tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pd-high">
        <div className="container">
          <div className="pd-high__head">
            <h2 className="pd-high__heading" data-fx="rise">
              Highlights
            </h2>
            <span className="pd-high__kanji" aria-hidden="true">
              要点
            </span>
          </div>
          <ol className="pd-high__list" data-fx-stagger>
            {project.highlights.map((item, i) => (
              <li key={item} className="pd-high__item">
                <span className="pd-high__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="pd-high__text">{item}</span>
                <span className="pd-high__spark" aria-hidden="true"></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <a
        className="pd-next"
        href={`#/works/${next.slug}`}
        data-transition-label={next.title}
      >
        <div className="pd-next__bg" aria-hidden="true">
          <img src={next.cover} alt="" loading="lazy" />
        </div>
        <div className="container pd-next__inner">
          <span className="pd-next__label" data-fx="rise">
            Next project
          </span>
          <span className="pd-next__title" data-fx="rise" data-fx-delay="0.08">
            {next.title}
            <span className="pd-next__arrow" aria-hidden="true">
              →
            </span>
          </span>
          <span className="pd-next__cat" data-fx="rise" data-fx-delay="0.16">
            {next.category} · {next.year}
          </span>
        </div>
      </a>

      <Contact />
    </main>
  );
}
