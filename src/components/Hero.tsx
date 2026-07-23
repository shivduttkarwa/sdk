import { useHeroBlob } from '@/hooks/useHeroBlob';
import { useHeroAnimation } from '@/hooks/useHeroAnimation';

export default function Hero() {
  useHeroBlob();
  useHeroAnimation();
  return (
    <section className="sdk-hero" id="home">
      <canvas id="hero-blob-canvas" aria-hidden="true"></canvas>

      <div className="sdk-hero__mobile-bg" aria-hidden="true"></div>

      <div className="sdk-hero__name sdk-hero__name--primary" aria-label="Shivdutt Karwa">
        <span className="sdk-hero__name-line">
          <span className="sdk-hero__line-inner">SHIVDUTT</span>
        </span>
        <span className="sdk-hero__name-line">
          <span className="sdk-hero__line-inner">KARWA</span>
        </span>
        <span className="sdk-hero__tagline">
          <span className="sdk-hero__line-inner">Building digital products from idea to impact</span>
        </span>
      </div>

      <div className="sdk-hero__reveal-layer" id="heroSmokeWrap" aria-hidden="true">
        <div className="sdk-hero__name sdk-hero__name--revealed" id="heroNameRevealed">
          <span className="sdk-hero__name-line">
            <span className="sdk-hero__line-inner">SHIVDUTT</span>
          </span>
          <span className="sdk-hero__name-line">
            <span className="sdk-hero__line-inner">KARWA</span>
          </span>
          <span className="sdk-hero__tagline">
            <span className="sdk-hero__line-inner">Building digital products from idea to impact</span>
          </span>
        </div>
      </div>

      <a href="#contact" className="sdk-hero__m-cta" aria-label="Start a project">
        <span className="sdk-cta-btn__aura"></span>
        <span className="sdk-cta-btn__surface"></span>
        <svg
          className="sdk-cta-btn__svg"
          viewBox="0 0 260 72"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="sdk-cta-btn__border-base"
            pathLength="100"
            d="M 12 3 H 248 Q 257 3 257 12 V 60 Q 257 69 248 69 H 12 Q 3 69 3 60 V 12 Q 3 3 12 3 Z"
          />
          <path
            className="sdk-cta-btn__border-glow"
            pathLength="100"
            d="M 12 3 H 248 Q 257 3 257 12 V 60 Q 257 69 248 69 H 12 Q 3 69 3 60 V 12 Q 3 3 12 3 Z"
          />
          <path
            className="sdk-cta-btn__border-trail"
            pathLength="100"
            d="M 12 3 H 248 Q 257 3 257 12 V 60 Q 257 69 248 69 H 12 Q 3 69 3 60 V 12 Q 3 3 12 3 Z"
          />
        </svg>
        <span className="sdk-cta-btn__label">
          Start a Project
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            style={{ marginLeft: '7px', flexShrink: 0, transition: 'transform 0.35s ease' }}
          >
            <path
              d="M1 7h12M8 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>

      <div className="sdk-hero__marquee" aria-hidden="true">
        <div className="sdk-hero__marquee-track">
          <span>React</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Node.js</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>WebGL</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Motion</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>TypeScript</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Next.js</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>PostgreSQL</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>GSAP</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>CMS</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Docker</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>React</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Node.js</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>WebGL</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Motion</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>TypeScript</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Next.js</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>PostgreSQL</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>GSAP</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>CMS</span>
          <span className="sdk-hero__marquee-dot">·</span>
          <span>Docker</span>
          <span className="sdk-hero__marquee-dot">·</span>
        </div>
      </div>

      <a href="#showcase" className="sdk-scroll-cue" aria-label="Scroll down">
        ⌄
      </a>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="heroMysticGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8e1b12" />
            <stop offset="34%" stopColor="#d77732" />
            <stop offset="58%" stopColor="#fff2c6" />
            <stop offset="78%" stopColor="#d8a24d" />
            <stop offset="100%" stopColor="#8e1b12" />
          </linearGradient>

          <filter
            id="hero-smoke-filter"
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016 0.022"
              numOctaves="4"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.014 0.020;0.018 0.024;0.014 0.020"
                dur="5s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </section>
  );
}
