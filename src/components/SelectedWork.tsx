import { useSelectedWork } from '@/hooks/useSelectedWork';

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
        </div>
      </div>

      <div className="sdk-work" id="sdk-work">
        <div className="sdk-work__progress" id="sdk-work-progress" aria-hidden="true">
          <div className="sdk-work__progress-track">
            <span className="sdk-work__progress-fill" id="sdk-work-progress-fill"></span>
            <i className="sdk-work__progress-mark" style={{ left: '25%' }}></i>
            <i className="sdk-work__progress-mark" style={{ left: '50%' }}></i>
            <i className="sdk-work__progress-mark" style={{ left: '75%' }}></i>
          </div>
        </div>

        <div className="sdk-work__runway" id="sdk-work-runway">
          <div className="sdk-work__sticky" id="sdk-work-sticky">
            <div className="sdk-work__patterns" aria-hidden="true">
              <span className="sdk-work__pattern sdk-work__pattern--p1"></span>
              <span className="sdk-work__pattern sdk-work__pattern--p2"></span>
              <span className="sdk-work__pattern sdk-work__pattern--p3"></span>
              <span className="sdk-work__pattern sdk-work__pattern--p4"></span>
              <span className="sdk-work__pattern sdk-work__pattern--p5"></span>
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

            <header className="sdk-work__head">
              <span>
                <span className="sdk-work__jp">作</span> Selected Work
              </span>
              <span>Five projects · one craft</span>
            </header>

            <div className="sdk-work__stage" id="sdk-work-stage">
              <canvas id="sdk-work-fx" aria-hidden="true"></canvas>
              <div className="sdk-work__fallback" aria-hidden="false">
                <img
                  className="sdk-work__img is-active"
                  src="assets/images/work-aurora.jpg"
                  alt="Aurora Commerce project"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="sdk-work__img"
                  src="assets/images/work-nimbus.jpg"
                  alt="Nimbus Dashboard project"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="sdk-work__img"
                  src="assets/images/work-meridian.jpg"
                  alt="Meridian Studio project"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="sdk-work__img"
                  src="assets/images/work-kinetic.jpg"
                  alt="Kinetic Reel project"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="sdk-work__img"
                  src="assets/images/work-vault.jpg"
                  alt="Vault Finance project"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="sdk-work__stories" aria-label="Project stories">
              <article className="sdk-work-story" data-side="left">
                <div className="sdk-work-story__meta">
                  <span className="sdk-work-story__mark">01</span>
                  <span>Product · Commerce</span>
                </div>
                <h3>
                  Aurora <span>Headless commerce platform</span>
                </h3>
                <p>
                  A storefront rebuilt from the ground up — headless, fast, and tuned for conversion
                  at scale.
                </p>
              </article>

              <article className="sdk-work-story" data-side="right">
                <div className="sdk-work-story__meta">
                  <span>Web App · Analytics</span>
                  <span className="sdk-work-story__mark">02</span>
                </div>
                <h3>
                  Nimbus <span>Realtime analytics suite</span>
                </h3>
                <p>
                  Live dashboards that turn a firehose of events into decisions teams can actually
                  act on.
                </p>
              </article>

              <article className="sdk-work-story" data-side="left">
                <div className="sdk-work-story__meta">
                  <span className="sdk-work-story__mark">03</span>
                  <span>Brand · Studio</span>
                </div>
                <h3>
                  Meridian <span>Immersive agency site</span>
                </h3>
                <p>
                  A cinematic brand experience where motion, type, and craft carry the story end to
                  end.
                </p>
              </article>

              <article className="sdk-work-story" data-side="right">
                <div className="sdk-work-story__meta">
                  <span>Motion · WebGL</span>
                  <span className="sdk-work-story__mark">04</span>
                </div>
                <h3>
                  Kinetic <span>WebGL showcase reel</span>
                </h3>
                <p>
                  A shader-driven playground built to push the browser — and prove what the web can
                  feel like.
                </p>
              </article>

              <article className="sdk-work-story" data-side="left">
                <div className="sdk-work-story__meta">
                  <span className="sdk-work-story__mark">05</span>
                  <span>Platform · Fintech</span>
                </div>
                <h3>
                  Vault <span>Fintech onboarding flow</span>
                </h3>
                <p>
                  A trust-first onboarding journey — secure, considered, and smooth from first tap
                  to funded.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
