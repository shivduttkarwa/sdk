// Single source of truth for the portfolio's real projects. Consumed by the homepage
// "Selected Work" teaser, the /works index page, and the /works/:slug detail pages, so
// copy and metadata never drift between them.

export interface Project {
  slug: string;
  num: string;
  title: string;
  /** One-line role/type shown under the title. */
  subtitle: string;
  category: string;
  year: string;
  role: string;
  client: string;
  /** Live site, opened in a new tab from the detail page. */
  url: string;
  urlLabel: string;
  stack: string[];
  services: string[];
  /** Short teaser used on the index list. */
  summary: string;
  /** Long-form paragraphs for the detail page overview. */
  overview: string[];
  highlights: string[];
  cover: string;
}

export const projects: Project[] = [
  {
    slug: 'nomad-nest',
    num: '01',
    title: 'Nomad & Nest',
    subtitle: 'Journeys designed around you',
    category: 'Travel & Hospitality',
    year: '2026',
    role: 'Design & Full-stack',
    client: 'Nomad & Nest',
    url: 'https://shivduttkarwa.github.io/nomad-nest',
    urlLabel: 'shivduttkarwa.github.io/nomad-nest',
    stack: ['React', 'TypeScript', 'Vite', 'GSAP'],
    services: ['UI/UX Design', 'Frontend', 'Motion Design', 'Deployment'],
    summary:
      'A considered travel experience that turns inspiration into personal, beautifully paced journeys.',
    overview: [
      'Nomad & Nest was shaped as an inviting travel platform with a calm editorial rhythm, letting destinations and experiences lead the story.',
      'The interface balances cinematic imagery with clear navigation and responsive interactions, keeping the journey from discovery to enquiry simple on every screen.',
    ],
    highlights: [
      'Immersive destination-led storytelling',
      'Responsive experience across screen sizes',
      'Clear journey and enquiry pathways',
      'Polished motion and interaction details',
    ],
    cover: 'assets/images/project-nomad-nest.webp',
  },
  {
    slug: 'voyage-nest',
    num: '02',
    title: 'Voyage Nest',
    subtitle: 'A calmer way to plan the next escape',
    category: 'Travel & Planning',
    year: '2026',
    role: 'Design & Full-stack',
    client: 'Voyage Nest',
    url: 'https://shivduttkarwa.github.io/voyagenest/',
    urlLabel: 'shivduttkarwa.github.io/voyagenest',
    stack: ['React', 'TypeScript', 'Vite', 'CSS'],
    services: ['UI/UX Design', 'Frontend', 'Interaction Design', 'Deployment'],
    summary:
      'A focused trip-planning experience that brings destinations, routes and ideas into one clear flow.',
    overview: [
      'Voyage Nest brings the practical parts of planning into a visual, approachable experience designed around exploration.',
      'The responsive build uses a clear content hierarchy and lightweight interactions so travellers can move from ideas to a more concrete plan without friction.',
    ],
    highlights: [
      'Destination-first discovery experience',
      'Simple and readable planning flow',
      'Responsive, touch-friendly interface',
      'Fast static deployment',
    ],
    cover: 'assets/images/project-voyage-nest.webp',
  },
  {
    slug: 'shambala-homes',
    num: '03',
    title: 'Shambala Homes',
    subtitle: 'Luxury home builder experience',
    category: 'Architecture & Property',
    year: '2026',
    role: 'Design & Frontend',
    client: 'Shambala Homes',
    url: 'https://shivduttkarwa.github.io/shambala-react-final/',
    urlLabel: 'shivduttkarwa.github.io/shambala-react-final',
    stack: ['React', 'TypeScript', 'Vite', 'GSAP'],
    services: ['Art Direction', 'UI/UX Design', 'Frontend', 'Motion Design'],
    summary:
      'A cinematic showcase for architectural craftsmanship, bringing modern homes and considered design to the foreground.',
    overview: [
      'Shambala Homes needed a digital presence with the same confidence and restraint as the spaces it presents. The visual direction is spacious, image-led and deliberately composed.',
      'Layered motion and full-bleed imagery give the work room to breathe, while the navigation keeps a direct path from first impression to project enquiry.',
    ],
    highlights: [
      'Cinematic scroll-driven storytelling',
      'Full-bleed architectural imagery',
      'Focused project enquiry journey',
      'Refined typographic system',
    ],
    cover: 'assets/images/project-shambala-homes-v2.webp',
  },
  {
    slug: 'lumea',
    num: '04',
    title: 'LUMEA',
    subtitle: 'Luxury beauty and skincare store',
    category: 'Beauty & E-commerce',
    year: '2026',
    role: 'Design & Development',
    client: 'LUMEA',
    url: 'http://15.252.75.8/',
    urlLabel: '15.252.75.8',
    stack: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript'],
    services: ['UI/UX Design', 'Frontend', 'CMS', 'E-commerce'],
    summary:
      'A refined beauty storefront built around tactile product storytelling, confident presentation and an easy path to purchase.',
    overview: [
      'LUMEA brings its beauty and skincare catalogue into a polished storefront that puts products, texture and essential information at the centre of the experience.',
      'The build combines a flexible content system with responsive beauty-commerce patterns, making the site straightforward to manage and equally easy to browse.',
    ],
    highlights: [
      'Clear catalogue and product discovery',
      'Responsive commerce interface',
      'Flexible CMS-backed content',
      'Streamlined path from browse to purchase',
    ],
    cover: 'assets/images/project-lumea.webp',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
