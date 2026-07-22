import { getProject, getNextProject } from '@/data/projects';
import Contact from '@/components/Contact';

// /works/:slug — a single project case. Falls back to a graceful "not found" when the
// slug doesn't match (e.g. a stale bookmark) rather than throwing.
export default function ProjectDetail({ slug }: { slug: string }) {
  const project = getProject(slug);

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
    <main className="project">
      <div className="container">
        <a className="project__back" href="#/works" data-transition-label="Work">
          ← All work
        </a>

        <header className="project__hero">
          <p className="sdk-eyebrow">
            {project.category} · {project.year}
          </p>
          <h1 className="project__title">{project.title}</h1>
          <p className="project__subtitle">{project.subtitle}</p>
          <p className="project__summary">{project.summary}</p>
          <a
            className="project__cta"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live site
            <span aria-hidden="true"> ↗</span>
          </a>
        </header>
      </div>

      <figure className="project__cover">
        <img src={project.cover} alt={`${project.title} — ${project.subtitle}`} loading="lazy" />
      </figure>

      <div className="container">
        <div className="project__grid">
          <div className="project__body">
            <h2 className="project__section-title">Overview</h2>
            {project.overview.map((para, i) => (
              <p key={i} className="project__para">
                {para}
              </p>
            ))}

            <h2 className="project__section-title">Highlights</h2>
            <ul className="project__highlights">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <aside className="project__meta">
            <div className="project__meta-item">
              <span className="project__meta-label">Client</span>
              <span className="project__meta-value">{project.client}</span>
            </div>
            <div className="project__meta-item">
              <span className="project__meta-label">Role</span>
              <span className="project__meta-value">{project.role}</span>
            </div>
            <div className="project__meta-item">
              <span className="project__meta-label">Year</span>
              <span className="project__meta-value">{project.year}</span>
            </div>
            <div className="project__meta-item">
              <span className="project__meta-label">Services</span>
              <span className="project__meta-value">{project.services.join(', ')}</span>
            </div>
            <div className="project__meta-item">
              <span className="project__meta-label">Stack</span>
              <span className="project__meta-tags">
                {project.stack.map((tech) => (
                  <span key={tech} className="project__tag">
                    {tech}
                  </span>
                ))}
              </span>
            </div>
          </aside>
        </div>

        <a
          className="project__next"
          href={`#/works/${next.slug}`}
          data-transition-label={next.title}
        >
          <span className="project__next-label">Next project</span>
          <span className="project__next-title">
            {next.title}
            <span className="project__next-arrow" aria-hidden="true">
              →
            </span>
          </span>
          <span className="project__next-cat">{next.category}</span>
        </a>
      </div>

      <Contact />
    </main>
  );
}
