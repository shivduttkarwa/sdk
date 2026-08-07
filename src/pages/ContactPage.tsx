import { useEffect, useRef, useState } from 'react';
import PageHeroTitle from '@/components/PageHeroTitle';
import { usePageFx } from '@/hooks/usePageFx';
import { usePageHeroIntro } from '@/hooks/usePageHeroIntro';
import { useEmberField } from '@/hooks/useEmberField';
import { useFooterName } from '@/hooks/useFooterName';

// /contact — a destination, not a footer. Rising ember canvas + drifting glow orbs
// behind a full-height hero, a magnetic email CTA with copy-to-clipboard, live IST
// clock, and a "what happens next" strip so reaching out feels like the start of a
// process rather than a shot in the dark.

const EMAIL = 'shivdutt@example.com';

const steps = [
  {
    num: '01',
    title: 'You write',
    text: 'A few lines about your project — goals, timeline, budget if you have one. No forms, no friction.',
  },
  {
    num: '02',
    title: 'We talk',
    text: 'A short call within 48 hours to map the idea, the constraints and whether we are a fit.',
  },
  {
    num: '03',
    title: 'It begins',
    text: 'A written proposal with scope and milestones — then the first sketches start arriving.',
  },
];

function useIstClock(): string {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const tick = () => {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const pad = (n: number) => String(n).padStart(2, '0');
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function ContactPage() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(0);
  const time = useIstClock();

  usePageFx(rootRef);
  usePageHeroIntro();
  useEmberField(canvasRef);
  useFooterName();

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/http) — the mailto link still works.
    }
  };

  return (
    <main className="ctc" ref={rootRef}>
      <section className="ctc-hero">
        <canvas className="ctc-hero__embers" ref={canvasRef} aria-hidden="true"></canvas>
        <span className="ctc-hero__orb ctc-hero__orb--a" aria-hidden="true"></span>
        <span className="ctc-hero__orb ctc-hero__orb--b" aria-hidden="true"></span>
        <span className="ctc-hero__kanji" aria-hidden="true" data-parallax="0.2">
          縁
        </span>
        <div className="container ctc-hero__inner" data-hero-intro>
          <span className="sdk-eyebrow">Contact</span>
          <PageHeroTitle lines={['Let’s build', 'something magical']} />
          <p className="ctc-hero__lead">
            Every great website begins with a conversation. Tell me what you&apos;re dreaming
            about — I&apos;ll help you shape it into something real.
          </p>
          <div className="ctc-hero__actions" data-fx-stagger>
            <a className="ctc-hero__mail" href={`mailto:${EMAIL}`} data-magnetic="0.22">
              <span className="ctc-hero__mail-text">{EMAIL}</span>
              <span className="ctc-hero__mail-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <button type="button" className="ctc-hero__copy" onClick={copyEmail}>
              {copied ? 'Copied ✓' : 'Copy address'}
            </button>
          </div>
        </div>
      </section>

      <section className="ctc-grid-section">
        <div className="container">
          <div className="ctc-grid" data-fx-stagger>
            <div className="ctc-cell">
              <span className="ctc-cell__label">Location</span>
              <span className="ctc-cell__value">Suratgarh · Jaipur</span>
              <span className="ctc-cell__sub">Rajasthan, India</span>
            </div>
            <div className="ctc-cell">
              <span className="ctc-cell__label">Local time</span>
              <span className="ctc-cell__value ctc-cell__value--mono">{time}</span>
              <span className="ctc-cell__sub">IST · UTC+5:30</span>
            </div>
            <div className="ctc-cell">
              <span className="ctc-cell__label">Status</span>
              <span className="ctc-cell__value">
                <span className="ctc-cell__pulse" aria-hidden="true"></span>
                Available
              </span>
              <span className="ctc-cell__sub">Taking new projects</span>
            </div>
            <div className="ctc-cell">
              <span className="ctc-cell__label">Elsewhere</span>
              <span className="ctc-cell__value ctc-cell__socials">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </span>
              <span className="ctc-cell__sub">Say hi anywhere</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ctc-steps">
        <div className="container">
          <div className="ctc-steps__head">
            <span className="sdk-eyebrow">What happens next</span>
            <h2 className="ctc-steps__heading" data-fx="rise">
              From hello to handshake
            </h2>
          </div>
          <ol className="ctc-steps__list" data-fx-stagger>
            {steps.map((step) => (
              <li key={step.num} className="ctc-step">
                <span className="ctc-step__num">{step.num}</span>
                <h3 className="ctc-step__title">{step.title}</h3>
                <p className="ctc-step__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="ctc-foot">
        <div className="ctc-foot__meta">
          <span>© 2026 Shivdutt Karwa</span>
          <span className="ctc-foot__dot" aria-hidden="true"></span>
          <span>Forged with precision &amp; code</span>
        </div>
        <div className="sdk-contact__name-wrap">
          <span className="sdk-contact__signature" id="cfName">
            SHIVDUTT <span className="sdk-contact__name-gap"></span>KARWA
          </span>
        </div>
      </footer>
    </main>
  );
}
