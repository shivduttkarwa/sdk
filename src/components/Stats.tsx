import { useStatsWater } from '@/hooks/useStatsWater';
import { useStatsCounters } from '@/hooks/useStatsCounters';

export default function Stats() {
  useStatsWater();
  useStatsCounters();
  return (
    <section className="sdk-stats" id="stats">
      <div className="sdk-stats__rule sdk-stats__rule--top"></div>

      <div className="sdk-stats__row">
        <article className="sdk-stat">
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
        </article>

        <div className="sdk-stats__divider"></div>

        <article className="sdk-stat sdk-stat--mid">
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
        </article>

        <div className="sdk-stats__divider"></div>

        <article className="sdk-stat sdk-stat--bottom">
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
        </article>
      </div>

      <div className="sdk-stats__rule sdk-stats__rule--bottom"></div>
    </section>
  );
}
