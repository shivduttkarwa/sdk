import { useStatsWater } from '@/hooks/useStatsWater';
import { useStatsCounters } from '@/hooks/useStatsCounters';

export default function Stats() {
  useStatsWater();
  useStatsCounters();
  return (
    <section className="sdk-stats" id="stats">
      <div className="sdk-stats__rule sdk-stats__rule--top"></div>

      {/* The glyph watermark + per-stat rule are mobile-only (display gated in CSS): the
          ≤900px layout restacks these as full-width editorial rows — number left/right
          alternating, giant dim kanji behind (年 years / 作 works / 技 craft, extending
          the site's 作 motif), red hairline sweeping in per row. Desktop ignores them. */}
      <div className="sdk-stats__row">
        <article className="sdk-stat">
          <span className="sdk-stat__glyph" aria-hidden="true">
            年
          </span>
          <div className="sdk-stat__num-clip">
            <span className="sdk-stat__number" data-target="5">
              0
            </span>
            <span className="sdk-stat__suffix">+</span>
          </div>
          <footer className="sdk-stat__footer">
            <span className="sdk-stat__index">01</span>
            <span className="sdk-stat__label">
              Years
              <br />
              of craft
            </span>
          </footer>
          <span className="sdk-stat__rule" aria-hidden="true"></span>
        </article>

        <div className="sdk-stats__divider"></div>

        <article className="sdk-stat sdk-stat--mid">
          <span className="sdk-stat__glyph" aria-hidden="true">
            作
          </span>
          <div className="sdk-stat__num-clip">
            <span className="sdk-stat__number" data-target="40">
              0
            </span>
            <span className="sdk-stat__suffix">+</span>
          </div>
          <footer className="sdk-stat__footer">
            <span className="sdk-stat__index">02</span>
            <span className="sdk-stat__label">
              Projects
              <br />
              shipped
            </span>
          </footer>
          <span className="sdk-stat__rule" aria-hidden="true"></span>
        </article>

        <div className="sdk-stats__divider"></div>

        <article className="sdk-stat sdk-stat--bottom">
          <span className="sdk-stat__glyph" aria-hidden="true">
            技
          </span>
          <div className="sdk-stat__num-clip">
            <span className="sdk-stat__number" data-target="12">
              0
            </span>
            <span className="sdk-stat__suffix">+</span>
          </div>
          <footer className="sdk-stat__footer">
            <span className="sdk-stat__index">03</span>
            <span className="sdk-stat__label">
              Tech
              <br />
              mastered
            </span>
          </footer>
          <span className="sdk-stat__rule" aria-hidden="true"></span>
        </article>
      </div>

      <div className="sdk-stats__rule sdk-stats__rule--bottom"></div>
    </section>
  );
}
