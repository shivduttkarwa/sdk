import { useProcessTimeline } from '@/hooks/useProcessTimeline';

export default function Process() {
  useProcessTimeline();
  return (
    <section id="about" className="sdk-stack-section">
      <div className="sdk-stack__inner">
        <div className="sdk-stack__header">
          <span className="sdk-eyebrow">Process</span>
          <h2 className="sdk-stack__title">
            <span className="sdk-stack__title-line" data-split>
              How I
            </span>
            <span className="sdk-stack__title-line sdk-stack__title-dim" data-split>
              Work
            </span>
          </h2>
          <p className="sdk-stack__subtitle">
            A true blade is never rushed. Every site I build is shaped with discipline, refined with
            patience, and delivered with the quiet care of a master at work.
          </p>
        </div>
      </div>

      <div className="sdk-process__layout">
        <div className="sdk-process__steps-col" id="procRail">
          <div className="sdk-process__step" data-index="0">
            <div className="sdk-process__step-marker"></div>
            <p className="sdk-process__step-index">01</p>
            <h3 className="sdk-process__step-title">Study</h3>
            <div className="sdk-process__step-divider"></div>
            <p className="sdk-process__step-desc">
              Before the blade is drawn, the ground is understood. I learn your goals, your users,
              and your rivals — until the path forward is unmistakably clear.
            </p>
            <p className="sdk-process__step-tags">Kickoff · Research · Strategy</p>
          </div>

          <div className="sdk-process__step" data-index="1">
            <div className="sdk-process__step-marker"></div>
            <p className="sdk-process__step-index">02</p>
            <h3 className="sdk-process__step-title">Forge</h3>
            <div className="sdk-process__step-divider"></div>
            <p className="sdk-process__step-desc">
              The blade is shaped before it is sharpened. Wireframes become high-fidelity UI — every
              detail considered, every interaction deliberate, nothing left to chance.
            </p>
            <p className="sdk-process__step-tags">Wireframes · UI · Prototype</p>
          </div>

          <div className="sdk-process__step" data-index="2">
            <div className="sdk-process__step-marker"></div>
            <p className="sdk-process__step-index">03</p>
            <h3 className="sdk-process__step-title">Temper</h3>
            <div className="sdk-process__step-divider"></div>
            <p className="sdk-process__step-desc">
              Steel is tempered through heat and patience — so is good code. Built clean, scaled
              with care, and refined until every layer holds without compromise.
            </p>
            <p className="sdk-process__step-tags">Frontend · Backend · APIs</p>
          </div>

          <div className="sdk-process__step" data-index="3">
            <div className="sdk-process__step-marker"></div>
            <p className="sdk-process__step-index">04</p>
            <h3 className="sdk-process__step-title">Honour</h3>
            <div className="sdk-process__step-divider"></div>
            <p className="sdk-process__step-desc">
              The craft does not end at delivery. Tested, polished, and handed over with care — a
              commitment to quality that quietly outlasts the launch.
            </p>
            <p className="sdk-process__step-tags">Deploy · Test · Support</p>
          </div>
        </div>

        <div className="sdk-process__spine-col" id="procMid">
          <div className="sdk-process__sword-wrap" id="procSword">
            <img className="sdk-process__sword" src="assets/sword-red.png" alt="" />
          </div>
        </div>

        <div className="sdk-process__visual-col">
          <div className="sdk-process__frame-wrap">
            <div className="sdk-process__frame" id="procFrame">
              <div className="sdk-process__frame-stack">
                <div className="sdk-process__frame-slide" data-img="0">
                  <img src="assets/images/process-1.jpg" alt="Study phase" loading="lazy" />
                  <div className="sdk-process__frame-overlay"></div>
                  <span className="sdk-process__frame-label">01 · Study</span>
                </div>
                <div className="sdk-process__frame-slide" data-img="1">
                  <img src="assets/images/process-2.jpg" alt="Forge phase" loading="lazy" />
                  <div className="sdk-process__frame-overlay"></div>
                  <span className="sdk-process__frame-label">02 · Forge</span>
                </div>
                <div className="sdk-process__frame-slide" data-img="2">
                  <img src="assets/images/process-3.jpg" alt="Temper phase" loading="lazy" />
                  <div className="sdk-process__frame-overlay"></div>
                  <span className="sdk-process__frame-label">03 · Temper</span>
                </div>
                <div className="sdk-process__frame-slide" data-img="3">
                  <img src="assets/images/process-4.jpg" alt="Honour phase" loading="lazy" />
                  <div className="sdk-process__frame-overlay"></div>
                  <span className="sdk-process__frame-label">04 · Honour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
