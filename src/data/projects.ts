// Single source of truth for the portfolio's real projects. Consumed by the homepage
// "Selected Work" teaser, the /works index page, and the /works/:slug detail pages, so
// copy and metadata never drift between them. Covers currently point at the placeholder
// art in public/assets/images/ — swap those files (same names) for real screenshots later.

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
    slug: 'real-gold',
    num: '01',
    title: 'Real Gold',
    subtitle: 'Premium property platform',
    category: 'Real Estate',
    year: '2024',
    role: 'Design & Full-stack',
    client: 'Real Gold Properties',
    url: 'https://realgoldproperties.com.au/',
    urlLabel: 'realgoldproperties.com.au',
    stack: ['React', 'Node.js', 'Tailwind CSS', 'GSAP'],
    services: ['UI/UX Design', 'Frontend', 'Backend', 'Deployment'],
    summary: 'Premium real estate across Brisbane and the Gold Coast — listings, enquiries and consultations in one polished experience.',
    overview: [
      'Real Gold Properties needed a premium digital presence to match the calibre of the residential and investment properties they represent across Brisbane and the Gold Coast. The brief was a site that felt as considered as a private consultation — calm, confident and quick.',
      'I designed and built the full experience end to end: a cinematic hero, browsable property listings, and a low-friction enquiry flow that routes qualified leads straight to the team. Everything is tuned for conversion without ever feeling pushy.',
    ],
    highlights: [
      'Property listings with rich imagery and detail views',
      'Multi-step enquiry flow with spam protection',
      'Consultation booking funnel',
      'Fast, responsive and SEO-ready',
    ],
    cover: 'assets/images/work-aurora.jpg',
  },
  {
    slug: 'shambala',
    num: '02',
    title: 'Shambala',
    subtitle: 'Luxury home builder site',
    category: 'Architecture',
    year: '2024',
    role: 'Design & Frontend',
    client: 'Shambala Homes',
    url: 'https://shambalahomes.com.au/',
    urlLabel: 'shambalahomes.com.au',
    stack: ['React', 'GSAP', 'Three.js', 'Tailwind CSS'],
    services: ['Art Direction', 'Frontend', 'Motion Design'],
    summary: 'A cinematic showcase for architectural craftsmanship — where modern design meets vision, from concept to build.',
    overview: [
      'Shambala Homes builds architectural masterpieces meant to stand the test of time, and the site had to carry that same weight. The concept — "architectural vision realized" — drove a slow, deliberate, gallery-like experience.',
      'The build leans on layered motion and full-bleed imagery to let the work breathe, with a clear path from first impression to starting a project. Every transition is measured so the architecture, not the interface, stays the hero.',
    ],
    highlights: [
      'Cinematic scroll-driven storytelling',
      'Full-bleed project galleries',
      '"Start your project" enquiry journey',
      'Refined typographic system',
    ],
    cover: 'assets/images/work-nimbus.jpg',
  },
  {
    slug: 'cyber-shades',
    num: '03',
    title: 'Cyber Shades',
    subtitle: 'Digital studio site',
    category: 'Digital Studio',
    year: '2024',
    role: 'Design & Full-stack',
    client: 'Cyber Shades',
    url: 'https://cybershades.in/',
    urlLabel: 'cybershades.in',
    stack: ['Next.js', 'TypeScript', 'GSAP', 'Node.js'],
    services: ['Brand', 'UI/UX Design', 'Frontend', 'Backend'],
    summary: 'The face of a Jaipur digital studio — websites, apps and connected platforms, built with a pulse.',
    overview: [
      'Cyber Shades is a Jaipur-based studio designing and developing websites, apps, CMS platforms and custom integrations. Their own site had to be the strongest proof of what they can do — sharp, energetic and unmistakably theirs.',
      'I shaped the brand voice and built a bold, high-contrast site with kinetic type and a services-to-work narrative that ends on a clear call to start a project. "Digital products with a pulse" runs through every interaction.',
    ],
    highlights: [
      'Bold kinetic typography',
      'Services and process storytelling',
      'Work showcase with case studies',
      'Contact and project-start flow',
    ],
    cover: 'assets/images/work-meridian.jpg',
  },
  {
    slug: 'behna',
    num: '04',
    title: 'Behna',
    subtitle: 'Ethnic wear studio',
    category: 'Fashion',
    year: '2024',
    role: 'Design & Frontend',
    client: 'Behna Clothing Studio',
    url: 'https://behna.in/',
    urlLabel: 'behna.in',
    stack: ['React', 'Tailwind CSS', 'GSAP'],
    services: ['UI/UX Design', 'Frontend', 'Motion Design'],
    summary: "A boutique storefront for handcrafted women's ethnic wear — timeless elegance, made in Jaipur.",
    overview: [
      "Behna Clothing Studio crafts 3-piece suits, kurtis, anarkalis, co-ord sets and festival wear from their Jaipur studio. The site needed the warmth of a boutique visit — elegant, tactile and inviting.",
      'I designed a soft, editorial storefront around "Timeless Elegance", pairing generous product imagery with a calm palette and quick access to contact and WhatsApp so browsing turns naturally into a visit or order.',
    ],
    highlights: [
      'Editorial collection showcase',
      'Elegant, warm visual identity',
      'WhatsApp and call quick-contact',
      'Mobile-first shopping experience',
    ],
    cover: 'assets/images/work-kinetic.jpg',
  },
  {
    slug: 'bunny-bites',
    num: '05',
    title: 'Bunny Bites',
    subtitle: "Kids' nutrition brand",
    category: 'Food & Brand',
    year: '2023',
    role: 'Design & Frontend',
    client: 'Bunny Bites',
    url: 'https://bunnybites.in/',
    urlLabel: 'bunnybites.in',
    stack: ['React', 'Tailwind CSS', 'Framer Motion'],
    services: ['Brand', 'UI/UX Design', 'Frontend'],
    summary: "A playful, trust-first brand site for nutritious kids' meals — from cravings to comfort, carefully crafted.",
    overview: [
      'Bunny Bites supports busy parents with convenient, healthy meals kids actually love. The site had to feel playful and appetising while earning a parent’s trust in seconds.',
      'I built a bright, friendly experience around "Nutritious Meals for Happy Kids" — leading with social proof, a clear how-it-works story and an easy path to explore the menu and order.',
    ],
    highlights: [
      'Playful, appetising brand system',
      'Trust signals and social proof up front',
      'How-it-works and menu sections',
      'Clear "order now" conversion path',
    ],
    cover: 'assets/images/work-vault.jpg',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
