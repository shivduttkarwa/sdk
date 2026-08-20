import { useSelectedWork } from '@/hooks/useSelectedWork';
import { projects } from '@/data/projects';

export default function SelectedWork() {
  useSelectedWork();
  return (
    <section
      id="work"
      className="sdk-work-section sdk-stack-section"
      aria-labelledby="sdk-work-title"
    >
      <div className="sdk-stack__inner">
        <div className="sdk-stack__header">
          <span className="sdk-eyebrow">Selected Work</span>
          <h2 className="sdk-stack__title" id="sdk-work-title">
            <span className="sdk-stack__title-line" data-split>
              Featured
            </span>
            <span className="sdk-stack__title-line sdk-stack__title-dim" data-split>
              Projects
            </span>
          </h2>
          <p className="sdk-stack__subtitle">
            A selection of products, platforms, and experiences — each one shaped from idea to
            launch.
          </p>
          <a className="sdk-stack__viewall" href="#/works" data-transition-label="Work">
            View all work
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>

      <div className="sdk-work" id="sdk-work">
        <div className="sdk-work__progress" id="sdk-work-progress" aria-hidden="true">
          <div className="sdk-work__progress-track">
            <span className="sdk-work__progress-fill" id="sdk-work-progress-fill"></span>
            {/* One mark per slide boundary: N projects → N-1 marks at even fractions. */}
            {projects.slice(1).map((project, index) => (
              <i
                key={project.slug}
                className="sdk-work__progress-mark"
                style={{ left: `${((index + 1) / (projects.length - 1)) * 100}%` }}
              ></i>
            ))}
          </div>
        </div>

        <div className="sdk-work__runway" id="sdk-work-runway">
          <div className="sdk-work__sticky" id="sdk-work-sticky">
            <div className="sdk-work__patterns" aria-hidden="true">
              {projects.map((project, index) => (
                <span
                  key={project.slug}
                  className={`sdk-work__pattern sdk-work__pattern--p${index + 1}`}
                ></span>
              ))}
            </div>
            <div className="sdk-work__topo" aria-hidden="true">
              <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" fill="none">
                <path d="M-120 180 C 260 105, 610 290, 940 235 S 1480 120, 1840 260 S 2140 390, 2260 310" />
                <path d="M-140 330 C 280 255, 650 445, 1000 380 S 1540 275, 1880 415 S 2180 540, 2280 470" />
                <path d="M-160 500 C 320 425, 710 610, 1070 545 S 1600 430, 1950 570 S 2220 710, 2320 635" />
                <path d="M-180 670 C 360 600, 770 780, 1140 715 S 1680 600, 2020 740 S 2260 890, 2360 810" />
                <path d="M-200 850 C 400 780, 840 970, 1210 900 S 1760 790, 2100 930 S 2300 1080, 2400 1000" />
              </svg>
            </div>
            <div className="sdk-work__seam" aria-hidden="true"></div>

            <div className="sdk-work__stage" id="sdk-work-stage">
              <canvas id="sdk-work-fx" aria-hidden="true"></canvas>
              <div className="sdk-work__fallback" aria-hidden="false">
                {projects.map((project, index) => (
                  <img
                    key={project.slug}
                    className={index === 0 ? 'sdk-work__img is-active' : 'sdk-work__img'}
                    src={project.cover}
                    alt={`${project.title} project`}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>

            <div className="sdk-work__stories" aria-label="Project stories">
              {projects.map((project, index) => {
                const side = index % 2 === 0 ? 'left' : 'right';
                const mark = <span className="sdk-work-story__mark">{project.num}</span>;

                return (
                  <article key={project.slug} className="sdk-work-story" data-side={side}>
                    <div className="sdk-work-story__meta">
                      {side === 'left' && mark}
                      <span>{project.category}</span>
                      {side === 'right' && mark}
                    </div>
                    <h3>
                      {project.title} <span>{project.subtitle}</span>
                    </h3>
                    <p>{project.summary}</p>
                    <a
                      className="sdk-btn sdk-btn--hair sdk-work-story__cta"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title} live site`}
                    >
                      <span>View project</span>
                      <span className="sdk-btn__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
