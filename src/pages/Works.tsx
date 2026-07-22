import { useEffect, useRef } from 'react';
import { projects } from '@/data/projects';
import Contact from '@/components/Contact';

// The /works index: a full page — cinematic hero, an awwwards-style hover-reveal list,
// then the shared contact footer. Hovering a row dims the others, tints it red, and
// floats that project's cover near the cursor. The floating preview is driven by one rAF
// lerp loop that only runs while the pointer is over the list, so an idle page costs nothing.
export default function Works() {
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    const img = imgRef.current;
    if (!list || !preview || !img) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let active = false;

    const tick = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      preview.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      if (active && (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4)) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onEnter = (event: PointerEvent) => {
      x = tx = event.clientX;
      y = ty = event.clientY;
      active = true;
      preview.classList.add('is-visible');
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      if (active && !raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      active = false;
      preview.classList.remove('is-visible');
      list.querySelectorAll('.works__row').forEach((r) => r.classList.remove('is-dimmed'));
    };

    const onOver = (event: PointerEvent) => {
      const row = (event.target as Element).closest<HTMLElement>('.works__row');
      if (!row) return;
      const cover = row.dataset.cover;
      if (cover) img.src = cover;
      list.querySelectorAll<HTMLElement>('.works__row').forEach((r) => {
        r.classList.toggle('is-dimmed', r !== row);
      });
    };

    list.addEventListener('pointerenter', onEnter);
    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerleave', onLeave);
    list.addEventListener('pointerover', onOver);

    return () => {
      list.removeEventListener('pointerenter', onEnter);
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerleave', onLeave);
      list.removeEventListener('pointerover', onOver);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="works" id="work-index">
      <section className="works-hero">
        <div className="container">
          <span className="sdk-eyebrow">Portfolio · 2021 — 2024</span>
          <h1 className="works-hero__title">
            <span className="works-hero__title-line">Selected</span>
            <span className="works-hero__title-line works-hero__title-dim">Work</span>
          </h1>
          <p className="works-hero__lead">
            A selection of products, platforms and brands I&apos;ve designed and built — from
            the first idea to launch day.
          </p>
          <div className="works-hero__meta">
            <div className="works-hero__stat">
              <strong>{String(projects.length).padStart(2, '0')}</strong>
              <span>Projects</span>
            </div>
            <div className="works-hero__stat">
              <strong>05</strong>
              <span>Industries</span>
            </div>
            <div className="works-hero__stat">
              <strong>02</strong>
              <span>Countries</span>
            </div>
          </div>
        </div>
        <a className="works-hero__scroll" href="#work-list">
          <span>Scroll to explore</span>
          <span className="works-hero__scroll-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>

      <section className="works-list-section" id="work-list">
        <div className="container">
          <div className="works__list" ref={listRef}>
            {projects.map((project) => (
              <a
                key={project.slug}
                className="works__row"
                href={`#/works/${project.slug}`}
                data-cover={project.cover}
                data-transition-label={project.title}
              >
                <span className="works__num">{project.num}</span>
                <span className="works__name">{project.title}</span>
                <span className="works__cat">{project.category}</span>
                <span className="works__year">{project.year}</span>
                <span className="works__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="works__preview" ref={previewRef} aria-hidden="true">
          <img className="works__preview-img" ref={imgRef} alt="" />
        </div>
      </section>

      <Contact />
    </main>
  );
}
