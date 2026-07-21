import { useEffect, useState } from 'react';

// B1 nav ported to idiomatic React state. The effects/handlers emit the exact same
// DOM contract the CSS keys on: header[data-nav-status], #menuBtn[aria-expanded],
// and body.sdk-nav--open. Closing on overlay click, any panel-anchor click, and Escape
// mirrors the original setNavStatus wiring.
export default function Nav() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('sdk-nav--open', navOpen);
  }, [navOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeOnAnchor = (event: React.MouseEvent) => {
    if ((event.target as Element).closest('a')) setNavOpen(false);
  };

  return (
    <header className="sdk-nav" data-nav-status={navOpen ? 'active' : 'inactive'} id="twostepNav">
      <div
        className="sdk-nav__overlay"
        data-sdk-nav__toggle="close"
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
      ></div>
      <nav className="sdk-nav__bar" aria-label="Main navigation">
        <div className="sdk-nav__backdrop">
          <div className="sdk-nav__backdrop-fill"></div>
        </div>
        <div className="sdk-nav__topbar">
          <a href="#home" className="sdk-nav__logo" aria-label="Shivdutt Karwa home">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36">
              <rect width="32" height="32" rx="8" fill="#05030a" />
              <text
                x="50%"
                y="54%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="system-ui"
                fontWeight="800"
                fontSize="18"
                fill="#E03F4F"
              >
                SK
              </text>
            </svg>
          </a>
          <button
            className="sdk-nav__toggle"
            id="menuBtn"
            data-sdk-nav__toggle="toggle"
            aria-label="Open menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="sdk-nav__toggle-inner">
              <span className="sdk-nav__toggle-label">Menu</span>
              <span className="sdk-nav__toggle-label">Close</span>
            </span>
          </button>
          <div className="sdk-nav__divider"></div>
        </div>
        <div className="sdk-nav__panel" id="menuPanel" onClick={closeOnAnchor}>
          <div className="sdk-nav__panel-overflow">
            <div className="sdk-nav__panel-inner">
              <div className="sdk-nav__panel-row">
                <div className="sdk-nav__panel-col">
                  <nav className="sdk-nav__links">
                    <a href="#services" className="sdk-nav__link is-active">
                      <span className="sdk-nav__link-index">01</span>
                      <span className="sdk-nav__link-body">
                        <span className="sdk-nav__link-label">Services</span>
                        <span className="sdk-nav__link-desc">What I offer</span>
                      </span>
                      <span className="sdk-nav__link-arrow">→</span>
                    </a>
                    <a href="#about" className="sdk-nav__link">
                      <span className="sdk-nav__link-index">02</span>
                      <span className="sdk-nav__link-body">
                        <span className="sdk-nav__link-label">About</span>
                        <span className="sdk-nav__link-desc">Background &amp; skills</span>
                      </span>
                      <span className="sdk-nav__link-arrow">→</span>
                    </a>
                    <a href="#contact" className="sdk-nav__link">
                      <span className="sdk-nav__link-index">03</span>
                      <span className="sdk-nav__link-body">
                        <span className="sdk-nav__link-label">Contact</span>
                        <span className="sdk-nav__link-desc">Let's collaborate</span>
                      </span>
                      <span className="sdk-nav__link-arrow">→</span>
                    </a>
                  </nav>
                </div>
              </div>
              <div className="sdk-nav__footer">
                <span className="sdk-nav__footer-left">
                  <span className="sdk-nav__footer-dot"></span>
                  <span className="sdk-nav__footer-loc">Based in India</span>
                  <span className="sdk-nav__footer-sep">·</span>
                  <span className="sdk-nav__footer-avail">Available for work</span>
                </span>
                <nav className="sdk-nav__footer-socials" aria-label="Social links">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    IG
                  </a>
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                    LI
                  </a>
                  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                    YT
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
