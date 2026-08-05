import { useEffect } from 'react';
import { gsap } from '@/lib/gsapSetup';
import { mountSelectedWork } from '@/cores/selectedWork.core';

export function useSelectedWork() {
  // runs once, mirrors original single init
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const disposeCore = mountSelectedWork();

    // Entrance for slide 01's copy. The core's scroll loop drives story visibility from
    // runway progress, and story 0's window opens at p = -0.12 — so by the time the panel
    // is on screen the first slide is simply *there*, with none of the entrance the later
    // slides get by sliding through their windows. This staggers its copy in as it arrives.
    //
    // Animates the story's CHILDREN, never the story itself: updateStories() writes
    // opacity / filter / --shift on the <article> every frame, so a tween on that element
    // would be overwritten immediately. Child opacity multiplies with the parent's, so the
    // two compose instead of fighting.
    //
    // Triggered off the story element (not the runway) for the same reason the section
    // titles are — the story sits at a different offset inside the sticky per breakpoint
    // (centred on desktop, bottom-anchored on mobile), so anchoring to the runway would
    // fire at a different moment on each. `top 70%` lands after the core has faded the
    // story to full opacity on both, so the stagger is never spent on an invisible element.
    const first = document.querySelector('.sdk-work-story') as HTMLElement | null;
    const parts = first ? ([...first.children] as HTMLElement[]) : [];
    // The CTA carries `transition: transform .25s` for its hover state, which would smear
    // every frame GSAP writes. Suspended for the tween, restored on completion.
    const cta = first?.querySelector('.sdk-work-story__cta') as HTMLElement | null;

    let tl: gsap.core.Timeline | null = null;
    if (first && parts.length) {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: first,
          start: 'top 70%',
          toggleActions: 'restart none none reset',
        },
        onStart: () => {
          if (cta) cta.style.transition = 'none';
        },
        onComplete: () => {
          if (cta) cta.style.transition = '';
        },
      });
      tl.from(parts, {
        y: 26,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }

    return () => {
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
      if (cta) cta.style.transition = '';
      disposeCore();
    };
  }, []);
}
