import type { ReactNode } from 'react';

/**
 * The <h1> at the top of every internal page hero — Works, Services, About, Contact and
 * Project detail.
 *
 * Each page used to hand-write the same markup under its own namespace
 * (`works-hero__title`, `abt-hero__title`, `svc-hero__title`, …) and the styling lived in
 * two duplicated CSS blocks plus four byte-identical font-size declarations, so changing
 * "the hero title" meant editing five places and missing one. All five now render this,
 * styled by the single `.sdk-hero-title` block.
 *
 * `lines` is one entry per visual line. The last line gets the site's dim second-line
 * treatment — but only when there is more than one, so a single-line title (project
 * detail, whose text comes from the project data) stays solid.
 *
 * The lines are also what the hero entrance animates — hooks/usePageHeroIntro expands the
 * title into them when building its timeline, so a two-line title reads as two staggered
 * lines rather than one block.
 */
export type PageHeroTitleProps = {
  lines: ReactNode[];
  /** Project detail runs one step larger than the section-style pages. */
  size?: 'md' | 'lg';
  id?: string;
};

export default function PageHeroTitle({ lines, size = 'md', id }: PageHeroTitleProps) {
  const dimIndex = lines.length > 1 ? lines.length - 1 : -1;

  return (
    <h1 id={id} className={size === 'lg' ? 'sdk-hero-title sdk-hero-title--lg' : 'sdk-hero-title'}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={
            i === dimIndex
              ? 'sdk-hero-title__line sdk-hero-title__line--dim'
              : 'sdk-hero-title__line'
          }
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
