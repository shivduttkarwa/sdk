export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'AI & Web3' | 'Immersive' | 'FinTech' | 'Enterprise';
  year: string;
  client: string;
  heroImage: string;
  galleryImages: string[];
  tags: string[];
  metrics: { label: string; value: string; trend: string }[];
  overview: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  accentColor: string;
  techStack: { name: string; icon: string }[];
  liveUrl: string;
  githubUrl: string;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'aura-space',
    number: '01',
    title: 'Aura Space',
    subtitle: 'AI-Driven Immersive Architectural Synthesis',
    category: 'Immersive',
    year: '2026',
    client: 'Aura Global Studios',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['React 19', 'Three.js', 'WebGPU', 'Python AI'],
    metrics: [
      { label: 'Rendering Speed', value: '120 FPS', trend: '+400% vs Legacy' },
      { label: 'User Retention', value: '78%', trend: '+35% MoM' },
      { label: 'Daily Synthesis', value: '45k+', trend: 'Record High' }
    ],
    overview: 'Aura Space redefines how architectural concepts are synthesized and visualized. By harnessing WebGPU and state-of-the-art neural rendering, architects can turn loose sketches into photorealistic, navigable 3D environments in real-time.',
    challenge: 'Existing architectural rendering pipelines required hours of cloud GPU compute and cumbersome offline setups, creating massive friction between ideation and presentation.',
    solution: 'Built a bespoke real-time client-side rendering engine coupled with edge AI inferencing that generates spatial geometry instantaneously upon user prompt.',
    deliverables: ['Real-time 3D Canvas Engine', 'AI Prompt-to-Space Module', 'Collaboration Workspace', 'Design System'],
    accentColor: 'from-violet-500 to-fuchsia-500',
    techStack: [
      { name: 'React 19', icon: 'Atom' },
      { name: 'Three.js / R3F', icon: 'Box' },
      { name: 'WebGPU', icon: 'Cpu' },
      { name: 'Tailwind CSS', icon: 'Palette' },
      { name: 'Framer Motion', icon: 'Activity' }
    ],
    liveUrl: 'https://auraspace.dev.example',
    githubUrl: 'https://github.com/example/aura-space',
    testimonial: {
      quote: 'Aura Space transformed our client pitch process. We generate pristine visual walk-throughs during live meetings now.',
      author: 'Elena Rostova',
      role: 'Principal Architect',
      company: 'Rostova & Partners'
    }
  },
  {
    id: 'nexus-web3',
    number: '02',
    title: 'Nexus Liquidity Hub',
    subtitle: 'Institutional Omnichain DEX & Yield Protocol',
    category: 'AI & Web3',
    year: '2026',
    client: 'Nexus Foundation',
    heroImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=2000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Solidity', 'Next.js', 'TypeScript', 'Ethers v6'],
    metrics: [
      { label: 'Total Value Locked', value: '$1.4B', trend: '+180% Q1' },
      { label: 'Gas Efficiency', value: '-42%', trend: 'Optimized Routing' },
      { label: 'Security Score', value: '99.8/100', trend: 'Audit Passed' }
    ],
    overview: 'Nexus is a high-performance cross-chain liquidity aggregator designed for institutional order flow. It combines automated market making with limit order execution across 12 EVM and non-EVM chains.',
    challenge: 'High latency and slippage during multi-hop token swaps hindered high-frequency institutional trading across disparate blockchain networks.',
    solution: 'Designed an advanced routing algorithm utilizing intent-based execution and zero-knowledge state proofs to ensure instant settlement with zero counterparty risk.',
    deliverables: ['Omnichain Smart Contracts', 'Ultra-low Latency Frontend', 'Institutional Analytics Dashboard', 'SDK & API Suite'],
    accentColor: 'from-cyan-500 to-blue-600',
    techStack: [
      { name: 'TypeScript', icon: 'Code' },
      { name: 'Solidity', icon: 'FileCode' },
      { name: 'Ethers.js', icon: 'Link' },
      { name: 'Vite', icon: 'Zap' },
      { name: 'Chart.js', icon: 'BarChart' }
    ],
    liveUrl: 'https://nexus.fi.example',
    githubUrl: 'https://github.com/example/nexus-protocol',
    testimonial: {
      quote: 'The UX is lightyears ahead of traditional DEXs. Execution is flawless even during peak network congestion.',
      author: 'Marcus Vance',
      role: 'Head of Trading',
      company: 'Vance Capital'
    }
  },
  {
    id: 'veloce-motors',
    number: '03',
    title: 'Veloce Telemetry',
    subtitle: 'Next-Gen Hypercar Telemetry & Driver HMI',
    category: 'Enterprise',
    year: '2025',
    client: 'Veloce Automobili',
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['React Native', 'WebSockets', 'GraphQL', 'WebGL'],
    metrics: [
      { label: 'Data Ingestion', value: '10kHz', trend: 'Sub-millisecond' },
      { label: 'Driver Response', value: '0.12s', trend: 'Improved HMI' },
      { label: 'System Reliability', value: '99.999%', trend: 'Automotive Grade' }
    ],
    overview: 'Veloce Telemetry provides track-side engineers and drivers with real-time biometric and mechanical insights. The HMI interface adapts dynamically based on G-force, track position, and driver workload.',
    challenge: 'Displaying thousands of incoming telemetry metrics per second without causing cognitive overload or interface stuttering under extreme driving conditions.',
    solution: 'Built a specialized WebGL render layer for gauges combined with an intelligent priority queue that filters secondary alerts when high-speed maneuvering is detected.',
    deliverables: ['In-Cockpit Display UI', 'Pit-wall Analytics Center', 'Mobile Companion App', 'Biometric Sync Engine'],
    accentColor: 'from-amber-500 to-red-600',
    techStack: [
      { name: 'React Native', icon: 'Smartphone' },
      { name: 'WebGL', icon: 'Layers' },
      { name: 'WebSockets', icon: 'Radio' },
      { name: 'Node.js', icon: 'Server' }
    ],
    liveUrl: 'https://veloce.auto.example',
    githubUrl: 'https://github.com/example/veloce-hmi',
    testimonial: {
      quote: 'Crucial for our Le Mans win. The predictive tire degradation model displayed on the dashboard saved us a critical pitstop.',
      author: 'Jean-Luc Moreau',
      role: 'Chief Race Engineer',
      company: 'Veloce Scuderia'
    }
  },
  {
    id: 'chroma-ai',
    number: '04',
    title: 'Chroma AI Studio',
    subtitle: 'Generative Multi-Modal Creative Canvas',
    category: 'AI & Web3',
    year: '2026',
    client: 'Chroma Technologies',
    heroImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=2000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Next.js', 'LLM Integration', 'Canvas API', 'Rust WASM'],
    metrics: [
      { label: 'Generation Speed', value: '0.8s', trend: 'Ultra-fast Diffusion' },
      { label: 'Active Creators', value: '1.2M', trend: '+310% YoY' },
      { label: 'Asset Exports', value: '18M+', trend: 'Commercial Grade' }
    ],
    overview: 'Chroma AI Studio empowers designers to blend text prompts, vector illustrations, and live video feeds into unified masterworks. Features real-time collaborative editing and AI layer separation.',
    challenge: 'Synchronizing multi-GB high-resolution image generation tasks across collaborative web clients without locking up the browser thread.',
    solution: 'Implemented a Rust WebAssembly compute core for heavy image buffer manipulation, offloading AI generation to edge serverless clusters with instant WebSocket broadcast.',
    deliverables: ['Web Browser Canvas Studio', 'AI Prompt Assistant UI', 'Community Marketplace', 'Figma Plugin'],
    accentColor: 'from-pink-500 to-rose-500',
    techStack: [
      { name: 'Rust / WASM', icon: 'Cpu' },
      { name: 'Next.js', icon: 'Layout' },
      { name: 'Tailwind CSS', icon: 'Palette' },
      { name: 'Zustand', icon: 'Database' }
    ],
    liveUrl: 'https://chroma.ai.example',
    githubUrl: 'https://github.com/example/chroma-studio',
    testimonial: {
      quote: 'Chroma completely replaced our previous patchwork of AI generation tools. Having everything in an infinite canvas is magic.',
      author: 'Sarah Jenkins',
      role: 'Creative Director',
      company: 'NeoDesign Agency'
    }
  },
  {
    id: 'kuro-banking',
    number: '05',
    title: 'Kuro Wealth',
    subtitle: 'Ultra-Premium Private Banking Experience',
    category: 'FinTech',
    year: '2025',
    client: 'Kuro International',
    heroImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=2000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['React', 'D3.js', 'Bank-grade Security', 'GraphQL'],
    metrics: [
      { label: 'Assets Managed', value: '$8.5B', trend: 'Private Client Wealth' },
      { label: 'Trade Execution', value: '4ms', trend: 'Direct Market Access' },
      { label: 'Client Satisfaction', value: '4.95/5', trend: 'Concierge Tier' }
    ],
    overview: 'Kuro Wealth offers high-net-worth individuals an unparalleled digital banking portal. It provides real-time portfolio risk simulation, private equity allocation tracking, and secure concierge messaging.',
    challenge: 'Designing a premium, ultra-secure interface that balances extreme financial complexity with an effortless, minimalist aesthetic suitable for elite clients.',
    solution: 'Crafted a bespoke dark-mode design system with subtle gold accents, backed by encrypted GraphQL subscriptions and D3.js interactive wealth projections.',
    deliverables: ['Web Banking Portal', 'Mobile Wealth Application', 'Encrypted Concierge Chat', 'Bespoke Charting Suite'],
    accentColor: 'from-amber-200 to-yellow-500',
    techStack: [
      { name: 'React 19', icon: 'Atom' },
      { name: 'D3.js', icon: 'PieChart' },
      { name: 'GraphQL', icon: 'Database' },
      { name: 'Tailwind CSS', icon: 'Palette' }
    ],
    liveUrl: 'https://kuro.wealth.example',
    githubUrl: 'https://github.com/example/kuro-banking',
    testimonial: {
      quote: 'Our clients expect perfection. Kuro Wealth delivered an application that feels like a luxury physical timepiece.',
      author: 'Lord Arthur Sterling',
      role: 'Managing Partner',
      company: 'Sterling & Co Private Wealth'
    }
  },
  {
    id: 'symphony-vr',
    number: '06',
    title: 'Symphony VR',
    subtitle: 'Spatial Audio & Virtual Metaverse Concerts',
    category: 'Immersive',
    year: '2026',
    client: 'Symphony Audio Labs',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['WebXR', 'WebAudio API', 'React', 'Three.js'],
    metrics: [
      { label: 'Max Concurrent', value: '250k', trend: 'Live Virtual Arena' },
      { label: 'Spatial Latency', value: '<5ms', trend: 'Head-tracked Audio' },
      { label: 'Artist Payout', value: '$4.2M', trend: 'Direct Web3 Tipping' }
    ],
    overview: 'Symphony VR brings live music performances into browser-based virtual arenas. Featuring high-fidelity ambisonic spatial audio that reacts realistically to virtual room acoustics and attendee proximity.',
    challenge: 'Delivering uncompressed multi-channel spatial audio alongside 60FPS 3D visuals inside standard web browsers across desktop, mobile, and VR headsets.',
    solution: 'Utilized custom audio worklets combined with WebAudio API spatializers, ensuring crystal-clear sound staging that dynamically renders based on camera orientation.',
    deliverables: ['WebXR Concert Arena', 'Artist Live Broadcast Booth', 'Spatial Audio Processing Engine', 'Virtual Ticketing Kiosk'],
    accentColor: 'from-emerald-400 to-teal-600',
    techStack: [
      { name: 'WebAudio API', icon: 'Headphones' },
      { name: 'WebXR', icon: 'Glasses' },
      { name: 'Three.js', icon: 'Box' },
      { name: 'Vite', icon: 'Zap' }
    ],
    liveUrl: 'https://symphony.vr.example',
    githubUrl: 'https://github.com/example/symphony-spatial',
    testimonial: {
      quote: 'The sensation of standing front row in a virtual stadium while hearing the crowd around you is absolutely breathtaking.',
      author: 'David Guetta',
      role: 'Featured Artist',
      company: 'Symphony Live 2026'
    }
  }
];
