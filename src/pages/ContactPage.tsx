import { useEffect, useRef, useState } from 'react';
import PageHeroTitle from '@/components/PageHeroTitle';
import { usePageFx } from '@/hooks/usePageFx';
import { usePageHeroIntro } from '@/hooks/usePageHeroIntro';
import { useFooterName } from '@/hooks/useFooterName';
import { useHeroRipple } from '@/hooks/useHeroRipple';

// /contact — the address IS the page.
//
// Below the hero there is no backdrop effect at all, deliberately: on a page whose entire
// job is one email address, anything moving behind the words works against them. What
// carries it is scale, hairline rules and space.
//
// The hero is the exception. Its backdrop photograph is rendered on a canvas as a water
// surface (cores/heroRipple), so the pointer and every click send rings across it and the
// image refracts along their slope. Contained to the hero, where there is no copy to
// fight — the address below sits on flat ground.

const EMAIL = 'shivdutt@example.com';
// The same file the CSS backdrop uses, so the canvas and the fallback show one image.
const HERO_IMAGE = 'assets/hero-images/contact.webp';

const elsewhere = [
  { name: 'Instagram', href: 'https://www.instagram.com' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com' },
  { name: 'YouTube', href: 'https://www.youtube.com' },
];

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
  const heroFxRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(0);
  const time = useIstClock();

  usePageFx(rootRef);
  usePageHeroIntro();
  useFooterName();
  useHeroRipple(heroFxRef, HERO_IMAGE);

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
        {/* Draws the same photograph and the same scrim the CSS backdrop draws, so at rest
            this hero matches the others exactly — the difference is that it ripples. If it
            cannot run, the CSS backdrop underneath is already painting. */}
        <canvas className="ctc-hero__fx" ref={heroFxRef} aria-hidden="true"></canvas>
        <div className="container ctc-hero__inner" data-hero-intro>
          <div className="ctc-hero__top">
            <span className="sdk-eyebrow">Contact</span>
            <span className="ctc-status">
              <span className="ctc-status__dot" aria-hidden="true"></span>
              Available for work
            </span>
          </div>
          <PageHeroTitle lines={['Let’s build', 'something magical']} />
          <p className="ctc-hero__lead">
            Every great website begins with a conversation. Tell me what you&apos;re dreaming
            about — I&apos;ll help you shape it into something real.
          </p>
        </div>
      </section>

      {/* The centrepiece. Set as large as the address will go, because on a page with one
          job the address should be the largest thing on it — larger than the headline. */}
      <section className="ctc-address">
        <div className="container">
          <span className="ctc-address__label">Write to me</span>
          <a className="ctc-address__link" href={`mailto:${EMAIL}`} data-magnetic="0.12">
            <span className="ctc-address__text">{EMAIL}</span>
            <span className="ctc-address__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <button type="button" className="ctc-address__copy" onClick={copyEmail}>
            {copied ? 'Copied to clipboard ✓' : 'or copy the address'}
          </button>
        </div>
      </section>

      <section className="ctc-meta">
        <div className="container ctc-meta__row">
          <span>Suratgarh · Jaipur, India</span>
          <span className="ctc-meta__time">{time} IST</span>
          <span className="ctc-meta__links">
            {elsewhere.map((l) => (
              <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.name}
              </a>
            ))}
          </span>
        </div>
      </section>

      <section className="ctc-next">
        <div className="container">
          <span className="ctc-next__label">What happens next</span>
          <ol className="ctc-next__list">
            {steps.map((step, i) => (
              <li
                key={step.num}
                className="ctc-next__step"
                data-fx="rise"
                data-fx-delay={String(i * 0.08)}
              >
                <span className="ctc-next__num" aria-hidden="true">
                  {step.num}
                </span>
                <div className="ctc-next__body">
                  <h2 className="ctc-next__title">{step.title}</h2>
                  <p className="ctc-next__text">{step.text}</p>
                </div>
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
