import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';

// B14 initStats: animate the stat rules/dividers and count each `.sdk-stat__number` up to
// its `data-target` on scroll. Verbatim timeline; killed on unmount.
export function useStatsCounters() {
  useEffect(() => {
    const section = document.querySelector('.sdk-stats');
    if (!section) return;

    const ruleTop = section.querySelector('.sdk-stats__rule--top');
    const ruleBot = section.querySelector('.sdk-stats__rule--bottom');
    const dividers = section.querySelectorAll('.sdk-stats__divider');
    const items = section.querySelectorAll('.sdk-stat');

    // Mobile: the stats restack as full-width ledger rows (see the ≤900px CSS), and each
    // row reveals independently as it enters — no count-up: the number sits at its final
    // value and rises from under the num-clip mask, kanji watermark fading in behind
    // and the row's hairline sweeping across. restart/reset so it replays on every downward
    // pass, matching useSectionTitles. Desktop keeps the original master timeline +
    // counter verbatim. Same breakpoint + once-only evaluation as the other hooks.
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (isMobile) {
      const tls: gsap.core.Timeline[] = [];
      items.forEach((item) => {
        const num = item.querySelector('.sdk-stat__number') as HTMLElement;
        const sup = item.querySelector('.sdk-stat__suffix');
        const foot = item.querySelector('.sdk-stat__footer');
        const glyph = item.querySelector('.sdk-stat__glyph');
        const rule = item.querySelector('.sdk-stat__rule');

        num.textContent = num.dataset.target || '0';

        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'restart none none reset' },
        });
        if (glyph) {
          tl.fromTo(
            glyph,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' },
            0,
          );
        }
        tl.to([num, sup], { y: '0%', duration: 0.9, ease: 'power4.out' }, 0.05);
        if (rule) tl.to(rule, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, 0.2);
        tl.to(foot, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.35);
        tls.push(tl);
      });

      return () => {
        tls.forEach((tl) => {
          tl.scrollTrigger?.kill();
          tl.kill();
        });
      };
    }

    const master = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 50%', toggleActions: 'play none none none' },
    });

    master.to(ruleTop, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' });
    master.to(dividers, { scaleY: 1, duration: 0.6, ease: 'power3.inOut', stagger: 0.18 }, '-=0.3');

    items.forEach((item, i) => {
      const num = item.querySelector('.sdk-stat__number') as HTMLElement;
      const sup = item.querySelector('.sdk-stat__suffix');
      const foot = item.querySelector('.sdk-stat__footer');
      const target = parseInt(num.dataset.target || '0', 10);

      master.to([num, sup], { y: '0%', duration: 0.9, ease: 'power4.out' }, i === 0 ? 0 : '<0.18');
      master.to(
        {},
        {
          duration: 1,
          ease: 'power2.out',
          onUpdate(this: gsap.core.Tween) {
            num.textContent = String(Math.round(this.progress() * target));
          },
          onComplete() {
            num.textContent = String(target);
          },
        },
        '<',
      );
      master.to(foot, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '<0.1');
    });

    master.to(ruleBot, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.2');

    return () => {
      master.scrollTrigger?.kill();
      master.kill();
    };
  }, []);
}
