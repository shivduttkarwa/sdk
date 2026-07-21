import { useHeroCtaVisibility } from '@/hooks/useHeroCtaVisibility';

export default function HeroCta() {
  useHeroCtaVisibility();
  return (
    <a href="#contact" className="sdk-hero__cta">
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
  );
}
