import { useShowcaseHud } from '@/hooks/useShowcaseHud';
import { useClock } from '@/hooks/useClock';
import { useRotatingWords } from '@/hooks/useRotatingWords';
import { useShowcaseWater } from '@/hooks/useShowcaseWater';
import { useShowcasePin } from '@/hooks/useShowcasePin';

export default function Showcase() {
  useShowcaseHud();
  useClock();
  useRotatingWords();
  useShowcaseWater();
  useShowcasePin();
  return (
    // The runway/sticky pair replaces the old ScrollTrigger pin: the runway provides the
    // extra scroll distance (former pin spacer) and CSS sticky holds the section — the
    // same velocity-proof pattern SelectedWork and TechStack already use. The scrub
    // timeline in useShowcasePin keys off the runway.
    <div className="sdk-showcase-runway" id="showcaseRunway">
      <section className="sdk-showcase" id="showcase">
        <canvas className="sdk-showcase__canvas" aria-hidden="true"></canvas>
        <div className="sdk-showcase__overlay" aria-hidden="true"></div>
        <h2 className="sdk-showcase__headline sdk-showcase__headline--top">
          <span className="inner">CRAFTED TO</span>
        </h2>

        <div className="sdk-showcase__reel-wrap" id="heroVideoWrap">
          <div className="sdk-showcase__reel-inner">
            <video
              className="sdk-showcase__reel"
              loop
              muted
              playsInline
              preload="none"
              poster="video/showcase-mobile-poster.jpg"
            >
              <source src="video/showcase-mobile.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="sdk-showcase__kinetic-wrap" aria-hidden="true">
          <span className="sdk-showcase__kinetic-word is-active">Fast</span>
          <span className="sdk-showcase__kinetic-word">Bold</span>
          <span className="sdk-showcase__kinetic-word">Clean</span>
          <span className="sdk-showcase__kinetic-word">Alive</span>
        </div>

        <div className="sdk-showcase__devices" aria-hidden="true">
          <div className="sdk-showcase__stage">
            <div className="sdk-device sdk-device--laptop">
              <div className="sdk-device__lid">
                <div className="sdk-device__display">
                  <video
                    className="sdk-device__video"
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="video/showcase-poster.jpg"
                  >
                    <source src="video/showcase.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
              <div className="sdk-device__base"></div>
            </div>
            <div className="sdk-device sdk-device--phone">
              <div className="sdk-device__display">
                <video
                  className="sdk-device__video"
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster="video/showcase-mobile-poster.jpg"
                >
                  <source src="video/showcase-mobile.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        <h1 className="sdk-showcase__headline sdk-showcase__headline--bottom">
          <span className="inner">PUSH LIMITS</span>
        </h1>

        <div className="sdk-hud" id="scHud" aria-hidden="true">
          <div className="sdk-hud__status">
            <span className="sdk-hud__dot"></span>
            <span className="sdk-hud__label">SYS ACTIVE</span>
          </div>
          <div className="sdk-hud__coords">
            <span className="sdk-hud__axis">
              X <span id="hudX">000</span>
            </span>
            <span className="sdk-hud__axis">
              Y <span id="hudY">000</span>
            </span>
          </div>
          <div className="sdk-hud__wave">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="sdk-clock" id="scClock" aria-hidden="true">
          <div className="sdk-clock__header">
            <span className="sdk-clock__dot"></span>
            <span className="sdk-clock__timezone">IST · UTC+5:30</span>
          </div>
          <div className="sdk-clock__time">
            <span id="scH">00</span>
            <span className="sdk-clock__colon">:</span>
            <span id="scM">00</span>
            <span className="sdk-clock__colon">:</span>
            <span id="scS">00</span>
          </div>
          <div className="sdk-clock__location">Jaipur · India</div>
        </div>
      </section>
    </div>
  );
}
