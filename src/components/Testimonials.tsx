import { useTestimonials } from '@/hooks/useTestimonials';

// PLACEHOLDER COPY. These quotes are written to show the layout working and are attributed
// to roles only — deliberately no real client or company names, since inventing praise and
// signing a real business's name to it would be a fabricated endorsement. Swap in real
// quotes and attributions before this goes public.
const VOICES = [
  {
    index: '01',
    quote: [
      'He took a rough idea and handed back something we could actually launch —',
      { em: 'considered, fast, and unmistakably ours' },
      '.',
    ],
    author: 'Founder',
    role: 'Property platform · Brisbane',
  },
  {
    index: '02',
    quote: [
      'The rare developer who will argue about kerning and database indexes ',
      { em: 'in the same breath' },
      '. Everything shipped on time, and nothing was left half-finished.',
    ],
    author: 'Creative Director',
    role: 'Design studio · Jaipur',
  },
  {
    index: '03',
    quote: [
      'Traffic doubled after launch and ',
      { em: 'nothing broke' },
      '. He stayed with us long past the handover until every last detail behaved.',
    ],
    author: 'Owner',
    role: 'Retail brand · India',
  },
];

export default function Testimonials() {
  useTestimonials();
  return (
    <section id="voices" className="sdk-stack-section sdk-voices" aria-labelledby="sdk-voices-title">
      <div className="sdk-stack__inner sdk-voices__grid">
        {/* Sticky rail: rides alongside the quotes on desktop, collapses to a normal
            header on mobile. The grid row stretches by default, which is what gives the
            sticky element room to travel. */}
        <div className="sdk-voices__aside">
          <span className="sdk-voices__kanji" aria-hidden="true">
            声
          </span>
          <span className="sdk-eyebrow">Testimonials</span>
          <h2 className="sdk-stack__title" id="sdk-voices-title">
            <span className="sdk-stack__title-line" data-split>
              Kind
            </span>
            <span className="sdk-stack__title-line sdk-stack__title-dim" data-split>
              Words
            </span>
          </h2>
          <p className="sdk-stack__subtitle">
            The part of the work that does not show up in a changelog.
          </p>
          <div className="sdk-voices__counter" aria-hidden="true">
            <span className="sdk-voices__counter-now" data-voices-counter>
              01
            </span>
            <span className="sdk-voices__counter-rule"></span>
            <span className="sdk-voices__counter-total">
              {String(VOICES.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <ol className="sdk-voices__list">
          {VOICES.map((v) => (
            <li className="sdk-voice" key={v.index} data-voice>
              <span className="sdk-voice__rule" aria-hidden="true"></span>
              <span className="sdk-voice__index">{v.index}</span>
              <blockquote className="sdk-voice__quote">
                {v.quote.map((part, i) =>
                  typeof part === 'string' ? (
                    <span key={i}>{part}</span>
                  ) : (
                    <em key={i}>{part.em}</em>
                  ),
                )}
              </blockquote>
              <footer className="sdk-voice__by">
                <span className="sdk-voice__author">{v.author}</span>
                <span className="sdk-voice__role">{v.role}</span>
              </footer>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
