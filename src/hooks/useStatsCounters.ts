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
