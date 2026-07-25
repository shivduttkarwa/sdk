// Content for the /services page. Kept as data so the accordion stays declarative and
// copy lives in one place, mirroring how projects.ts feeds the work pages.

export interface Service {
  num: string;
  title: string;
  /** Kanji accent shown beside the title (site-wide Japanese motif). */
  kanji: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export const services: Service[] = [
  {
    num: '01',
    title: 'UI / UX Design',
    kanji: '設計',
    tagline: 'Interfaces that feel inevitable',
    description:
      'From first sketch to final pixel — research, flows, wireframes and high-fidelity design systems. Every screen is composed like a scene: hierarchy, rhythm and restraint, tuned until the interface disappears and only the story remains.',
    deliverables: ['Art direction', 'Design systems', 'Prototypes', 'Responsive layouts'],
  },
  {
    num: '02',
    title: 'Frontend Engineering',
    kanji: '構築',
    tagline: 'Pixel-perfect, production-grade builds',
    description:
      'React, TypeScript and modern tooling — component architecture that scales, obsessive attention to detail, and performance budgets treated as law. What ships matches the design to the pixel and stays fast on real devices.',
    deliverables: ['React / Next.js', 'TypeScript', 'Component libraries', 'Performance tuning'],
  },
  {
    num: '03',
    title: 'Motion & Interaction',
    kanji: '動き',
    tagline: 'The magic between the states',
    description:
      'Scroll choreography, WebGL shaders, page transitions and micro-interactions built with GSAP and custom canvas work. Motion is never decoration here — it carries the narrative, guides the eye and makes the product feel alive.',
    deliverables: ['GSAP choreography', 'WebGL / canvas', 'Page transitions', 'Scroll experiences'],
  },
  {
    num: '04',
    title: 'Full-stack Development',
    kanji: '全体',
    tagline: 'From database to deployment',
    description:
      'APIs, content management, integrations and infrastructure. One accountable pair of hands from the first schema to the production deploy — so the polished front of house is matched by a calm, reliable back of house.',
    deliverables: ['Node.js APIs', 'CMS platforms', 'Integrations', 'Deployment & hosting'],
  },
  {
    num: '05',
    title: 'Brand & Identity',
    kanji: '個性',
    tagline: 'A voice you can recognise blindfolded',
    description:
      'Naming, tone, typography and visual language for products that need to stand apart. The goal is coherence: a brand where the site, the deck and the product all feel cut from the same steel.',
    deliverables: ['Visual identity', 'Typography systems', 'Brand voice', 'Guidelines'],
  },
];

export const processSteps = [
  { num: '01', title: 'Discover', text: 'Goals, audience, constraints — the brief becomes a map.' },
  { num: '02', title: 'Design', text: 'Concepts, systems and prototypes, iterated with you.' },
  { num: '03', title: 'Build', text: 'Engineering with motion and performance baked in.' },
  { num: '04', title: 'Launch', text: 'Ship, measure, refine — and keep it sharp after.' },
];
