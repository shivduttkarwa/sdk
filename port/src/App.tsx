import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PROJECTS_DATA, 
  Project 
} from './data/projects';
import { Icon } from './components/Icon';
import { 
  Sparkles, 
  ArrowUpRight, 
  ExternalLink, 
  Code, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Award, 
  ArrowDown, 
  Compass, 
  Maximize2, 
  Monitor, 
  Play, 
  Share2, 
  ChevronRight,
  Flame,
  Workflow
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'gallery'>('overview');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter projects
  const filteredProjects = selectedCategory === 'All' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === selectedCategory);

  // Play simulated sound effect
  const playSound = (type: 'click' | 'hover' | 'whoosh') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'hover') {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'whoosh') {
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // AudioContext might be blocked before user interaction
    }
  };

  // Scroll handler for active project dot HUD
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.project-section');
      const scrollPosition = window.scrollY + window.innerHeight * 0.5;

      sections.forEach((section, index) => {
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveProjectIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredProjects]);

  // Smooth scroll to project
  const scrollToProject = (index: number) => {
    playSound('whoosh');
    const sections = document.querySelectorAll('.project-section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    setCopiedLink(true);
    playSound('click');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white selection:bg-white selection:text-black">
      
      {/* GLOBAL HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); playSound('click'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 text-xl font-bold tracking-tighter uppercase group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-none bg-white text-black flex items-center justify-center font-black group-hover:bg-gradient-to-tr group-hover:from-cyan-400 group-hover:to-fuchsia-500 transition-all duration-300">
              Æ
            </div>
            <span className="font-['Syne'] tracking-wider hidden sm:inline">AETHER // STUDIO</span>
          </a>
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-white/50 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AVAILABLE FOR Q3/Q4 2026 // {currentTime}</span>
          </div>
        </div>

        {/* HEADER CONTROLS */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => { setSoundEnabled(!soundEnabled); playSound('click'); }}
            className="glass-panel-light px-3 py-2 rounded-full text-xs font-mono flex items-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
            title="Toggle Ambient Audio Simulation"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4 text-white/40" />}
            <span className="hidden sm:inline font-mono">{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>
          
          <a 
            href="#projects-showcase"
            onClick={() => playSound('click')}
            className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-white/90 transition-all cursor-pointer shadow-lg shadow-white/10 font-mono tracking-wide"
          >
            <span>Explore Works</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* FLOATING PAGINATION HUD (RIGHT SIDEBAR) */}
      <div className="fixed right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-4 pointer-events-auto glass-panel p-3 rounded-full">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">HUD</span>
        {filteredProjects.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => scrollToProject(idx)}
            onMouseEnter={() => playSound('hover')}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer"
            title={proj.title}
          >
            <span className={`text-xs font-mono transition-all duration-300 ${activeProjectIndex === idx ? 'text-white font-bold scale-125' : 'text-white/30 group-hover:text-white/70'}`}>
              {proj.number}
            </span>
            {activeProjectIndex === idx && (
              <motion.div 
                layoutId="activeDot"
                className="absolute inset-0 border border-white/40 rounded-full animate-spin-slow"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* HERO INTRO BANNER */}
      <section className="relative min-h-[90vh] flex flex-col justify-end px-6 lg:px-16 pb-20 pt-32 overflow-hidden bg-radial from-neutral-900/40 via-neutral-950 to-black">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-cyan-300 mb-6 font-mono border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>IMMERSIVE SHOWCASE // RECENT DEPLOYMENTS</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-8 font-['Syne']">
            Crafting <br/>
            <span className="bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              Next-Gen
            </span> <br/>
            Digital <span className="underline decoration-cyan-500 decoration-4">Reality.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10 mt-12 items-end">
            <div>
              <p className="text-white/60 text-sm leading-relaxed font-light">
                Full-bleed immersive digital architecture. Each project stack slides elegantly from below, blending ultra-modern aesthetic with state-of-the-art interactive fidelity.
              </p>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-xs font-mono text-white/40 uppercase">Filter by Domain</span>
              
              {/* CATEGORY FILTER PILLS */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['All', 'AI & Web3', 'Immersive', 'FinTech', 'Enterprise'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveProjectIndex(0);
                      playSound('click');
                      setTimeout(() => {
                        const el = document.getElementById('projects-showcase');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    onMouseEnter={() => playSound('hover')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-white text-black font-semibold shadow-lg shadow-white/20' 
                        : 'glass-panel text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6">
              <div className="text-right hidden sm:block">
                <span className="block text-2xl font-bold font-mono text-cyan-400">06</span>
                <span className="text-xs text-white/40 font-mono">SELECTED CASE STUDIES</span>
              </div>
              <div className="text-right hidden sm:block">
                <span className="block text-2xl font-bold font-mono text-emerald-400">100%</span>
                <span className="text-xs text-white/40 font-mono">ON-TIME DELIVERY</span>
              </div>
              
              <a 
                href="#projects-showcase" 
                onClick={() => playSound('click')}
                className="w-14 h-14 rounded-full glass-panel flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer group animate-bounce"
              >
                <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SHOWCASE CONTAINER: FULL BLEED STACKING PROJECTS */}
      <main id="projects-showcase" className="relative w-full">
        {filteredProjects.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
            <p className="text-white/60 mb-4">No projects match the selected category criteria.</p>
            <button 
              onClick={() => setSelectedCategory('All')} 
              className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProjects.map((project, index) => {
            return (
              <section
                key={project.id}
                id={`project-${index}`}
                className="project-section sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 bg-black"
                style={{ 
                  zIndex: 10 + index 
                }}
              >
                {/* HERO BACKGROUND IMAGE */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 hover:scale-110 filter brightness-[0.7] saturate-[1.1]"
                  />
                  {/* OVERLAYS FOR CRISP TEXT LEGIBILITY AND HIGH-END VIBE */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80"></div>
                  <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/90"></div>
                  
                  {/* Animated Grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
                </div>

                {/* OVERLAY CONTENT CONTAINER */}
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-16 h-full flex flex-col justify-between py-24 lg:py-28 pointer-events-none">
                  
                  {/* TOP ROW: SERIAL & BADGES */}
                  <div className="flex items-center justify-between w-full pointer-events-auto">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl lg:text-5xl font-mono font-black tracking-tight text-white/90">
                        {project.number}
                      </div>
                      <div className="h-8 w-px bg-white/20"></div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold glass-panel text-white/80 border-white/20 uppercase tracking-widest">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 font-mono">
                      <span className="text-xs text-white/40">YEAR</span>
                      <span className="text-xs font-bold text-white glass-panel px-2.5 py-1 rounded">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE ROW: TITLE & INTRO OVERLAY */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pointer-events-auto">
                    
                    <div className="lg:col-span-7 flex flex-col items-start">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/10 text-cyan-300 border border-white/10 backdrop-blur-md">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none font-['Syne'] mb-4 text-white text-glow">
                        {project.title}
                      </h2>
                      
                      <p className="text-xl sm:text-2xl text-white/80 font-light max-w-2xl leading-snug mb-6">
                        {project.subtitle}
                      </p>

                      <p className="text-white/60 text-sm max-w-xl leading-relaxed mb-8 line-clamp-3 lg:line-clamp-none font-light">
                        {project.overview}
                      </p>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap items-center gap-4 font-mono">
                        <button
                          onClick={() => { setActiveModalProject(project); setActiveTab('overview'); playSound('click'); }}
                          onMouseEnter={() => playSound('hover')}
                          className="px-6 py-3.5 bg-white text-black font-semibold text-xs rounded-full flex items-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer shadow-xl group tracking-wide"
                        >
                          <span>Explore Case Study</span>
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>

                        <button
                          onClick={() => { setPreviewProject(project); playSound('click'); }}
                          onMouseEnter={() => playSound('hover')}
                          className="px-5 py-3.5 glass-panel text-white hover:text-cyan-300 font-semibold text-xs rounded-full flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer tracking-wide"
                        >
                          <Monitor className="w-4 h-4" />
                          <span>Interactive Preview</span>
                        </button>

                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSound('click')}
                          onMouseEnter={() => playSound('hover')}
                          className="p-3.5 glass-panel text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
                          title="View Source Repository"
                        >
                          <Code className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: METRICS GLASS CARDS */}
                    <div className="lg:col-span-5 w-full flex flex-col gap-4 font-mono">
                      <div className="text-xs text-white/40 uppercase tracking-widest hidden lg:block">
                        // Key Metrics & Performance
                      </div>
                      
                      <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 font-mono">
                        {project.metrics.map((m, midx) => (
                          <div 
                            key={midx}
                            className="glass-panel p-4 lg:p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-2 hover:border-cyan-500/40 transition-colors"
                          >
                            <div>
                              <span className="text-[10px] lg:text-xs text-white/50 uppercase block">
                                {m.label}
                              </span>
                              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                                {m.value}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1 text-[10px] lg:text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 self-start lg:self-auto">
                              <span>{m.trend}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* TECH STACK BADGES */}
                      <div className="mt-2 glass-panel p-4 rounded-2xl hidden sm:block font-mono">
                        <span className="text-[10px] text-white/40 uppercase block mb-3">Core Stack Architecture</span>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, tidx) => (
                            <div key={tidx} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 text-xs text-white/80 border border-white/10">
                              <Icon name={tech.icon} className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{tech.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* BOTTOM ROW: PAGINATION INDICATOR & SLIDE HINT */}
                  <div className="flex items-center justify-between w-full pt-6 border-t border-white/10 pointer-events-auto font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40 font-mono">CLIENT //</span>
                      <span className="text-xs text-white font-semibold font-mono tracking-wide">{project.client}</span>
                    </div>

                    <div className="flex items-center gap-6 font-mono">
                      <div className="hidden sm:flex items-center gap-2 text-xs text-white/40 font-mono">
                        <span>SLIDE {(index + 1).toString().padStart(2, '0')} OF {filteredProjects.length.toString().padStart(2, '0')}</span>
                      </div>

                      {index < filteredProjects.length - 1 ? (
                        <button
                          onClick={() => scrollToProject(index + 1)}
                          onMouseEnter={() => playSound('hover')}
                          className="flex items-center gap-2 text-xs text-cyan-300 hover:text-white transition-colors cursor-pointer group font-mono"
                        >
                          <span>NEXT WORK</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <button
                          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); playSound('click'); }}
                          className="text-xs font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          ↑ BACK TO TOP
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </section>
            );
          })
        )}
      </main>

      {/* DETAILED CASE STUDY DRAWER MODAL */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md p-0 sm:p-4"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl h-full bg-[#0d0d11] border-l sm:border border-white/10 sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            >
              {/* MODAL HEADER */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-cyan-400">{activeModalProject.number}</span>
                  <div>
                    <h3 className="text-2xl font-bold font-['Syne']">{activeModalProject.title}</h3>
                    <p className="text-xs text-white/50">{activeModalProject.client} // {activeModalProject.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare()}
                    className="p-2 glass-panel hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setActiveModalProject(null); playSound('click'); }}
                    className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex border-b border-white/10 px-6 bg-black/20 font-mono">
                {[
                  { id: 'overview', label: 'Overview & Challenge' },
                  { id: 'tech', label: 'Technical Architecture' },
                  { id: 'gallery', label: 'Interactive Gallery' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); playSound('click'); }}
                    className={`py-4 px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-cyan-400 text-cyan-300 font-bold'
                        : 'border-transparent text-white/50 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* COPIED TOAST */}
              {copiedLink && (
                <div className="bg-emerald-500 text-black px-4 py-2 text-xs font-mono text-center font-bold animate-pulse">
                  ✓ PROJECT LINK COPIED TO CLIPBOARD
                </div>
              )}

              {/* MODAL BODY */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar font-sans">
                
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h4 className="text-xs font-mono text-white/40 uppercase mb-2">// Executive Summary</h4>
                      <p className="text-lg text-white/90 leading-relaxed font-light">{activeModalProject.overview}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                      <div className="glass-panel p-5 rounded-xl border-red-500/20">
                        <div className="flex items-center gap-2 text-red-400 font-mono text-xs mb-3">
                          <Flame className="w-4 h-4" />
                          <span>THE CHALLENGE</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-light">{activeModalProject.challenge}</p>
                      </div>

                      <div className="glass-panel p-5 rounded-xl border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-3">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>THE SOLUTION</span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-light">{activeModalProject.solution}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono text-white/40 uppercase mb-4">// Key Deliverables</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                        {activeModalProject.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 glass-panel rounded-lg">
                            <Workflow className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span className="text-xs text-white/90">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TESTIMONIAL */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative overflow-hidden">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
                      <p className="text-base lg:text-lg italic text-white/90 mb-4 font-light leading-relaxed">
                        "{activeModalProject.testimonial.quote}"
                      </p>
                      <div className="flex items-center justify-between font-mono">
                        <div>
                          <div className="font-bold text-xs text-white">{activeModalProject.testimonial.author}</div>
                          <div className="text-[10px] text-white/50">{activeModalProject.testimonial.role}, {activeModalProject.testimonial.company}</div>
                        </div>
                        <Award className="w-8 h-8 text-cyan-400 opacity-50" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="space-y-8 animate-fadeIn font-mono">
                    <div>
                      <h4 className="text-xs text-white/40 uppercase mb-4">// System Architecture & Stack</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {activeModalProject.techStack.map((tech, idx) => (
                          <div key={idx} className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-cyan-500/50 transition-colors">
                            <Icon name={tech.icon} className="w-8 h-8 text-cyan-400" />
                            <span className="text-xs font-semibold">{tech.name}</span>
                            <span className="text-[10px] text-white/40">Production Ready</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-4 font-mono text-xs">
                      <h5 className="text-xs text-white/80 uppercase">Performance Audits</h5>
                      <div className="space-y-3">
                        {activeModalProject.metrics.map((m, midx) => (
                          <div key={midx} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-white/60">{m.label}</span>
                              <span className="text-cyan-400 font-bold">{m.value} ({m.trend})</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3 font-mono text-xs">
                      <Compass className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div className="leading-relaxed text-cyan-100">
                        <strong className="font-bold">Next-Gen Deployment Note:</strong> This application utilizes WebGPU compute shaders and edge CDN caching to achieve zero-layout shift and instantaneous time-to-interactive.
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="space-y-6 animate-fadeIn font-mono">
                    <h4 className="text-xs text-white/40 uppercase">// Production Stills & Mockups</h4>
                    <div className="grid grid-cols-1 gap-6">
                      {activeModalProject.galleryImages.map((img, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-white/10 group relative">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center text-xs">
                            <span>High-fidelity Render // View {idx+1}</span>
                            <Maximize2 className="w-4 h-4 text-cyan-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between font-mono">
                <button
                  onClick={() => {
                    setPreviewProject(activeModalProject);
                    playSound('click');
                  }}
                  className="px-6 py-3 bg-white text-black font-semibold text-xs rounded-full flex items-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer tracking-wide"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Interactive Preview</span>
                </button>

                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 glass-panel text-white/80 hover:text-white text-xs rounded-full flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE PREVIEW MODAL (SIMULATED BROWSER/LIVE APP) */}
      <AnimatePresence>
        {previewProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl h-[85vh] bg-[#0c0c0f] border border-white/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-mono"
            >
              {/* BROWSER BAR */}
              <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <div className="ml-4 px-4 py-1 rounded bg-white/5 border border-white/10 text-white/60 flex items-center gap-2 w-64 sm:w-96 truncate">
                    <span className="text-cyan-400 font-bold">https://</span>
                    <span className="truncate">{previewProject.liveUrl.replace('https://', '')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <a
                    href={previewProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 glass-panel text-white/60 hover:text-white rounded text-xs flex items-center gap-1"
                    title="Open Real URL in new tab"
                  >
                    <span className="hidden sm:inline">External</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => { setPreviewProject(null); playSound('click'); }}
                    className="p-1.5 bg-white/10 hover:bg-white text-white hover:text-black rounded transition-all cursor-pointer"
                    title="Close Preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SIMULATED APP CANVAS */}
              <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-neutral-900 to-black flex flex-col items-center justify-center p-8 text-center font-sans">
                
                {/* Background effect */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>

                <div className="relative z-10 max-w-2xl space-y-6 animate-fadeIn">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-0.5 shadow-2xl animate-pulse">
                    <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center text-white">
                      <Sparkles className="w-8 h-8 text-cyan-300" />
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-bold font-['Syne']">{previewProject.title} Live Sandbox</h3>
                  <p className="text-sm text-white/70 font-light max-w-lg mx-auto">
                    You are exploring a simulated next-gen WebGL environment. In a production client release, this module renders interactive 3D spatial pipelines in real-time.
                  </p>

                  <div className="p-6 glass-panel rounded-xl text-left font-mono text-xs space-y-3 max-w-md mx-auto border-cyan-500/30">
                    <div className="flex justify-between text-white/50">
                      <span>INITIALIZING ENGINE...</span>
                      <span className="text-emerald-400">SUCCESS</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>LOADING NEURAL SHADERS...</span>
                      <span className="text-emerald-400">100%</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>LATENCY TEST...</span>
                      <span className="text-cyan-400">4.2ms</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-center text-white font-bold">
                      ✓ INTERACTIVE STREAM ACTIVE
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4 justify-center font-mono">
                    <button 
                      onClick={() => alert(`Simulated interaction event logged for ${previewProject.title}.`)}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
                    >
                      Trigger Simulation Event
                    </button>
                    <button 
                      onClick={() => setPreviewProject(null)} 
                      className="px-6 py-3 glass-panel text-white hover:text-black hover:bg-white font-semibold rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Back to Showcase
                    </button>
                  </div>
                </div>

                {/* Floating UI overlays simulation */}
                <div className="absolute bottom-6 left-6 glass-panel px-4 py-2 rounded-lg text-[10px] font-mono text-white/60 hidden sm:block">
                  FPS: 120 // RENDER: WEBGPU // VRAM: 1.2GB
                </div>

                <div className="absolute bottom-6 right-6 glass-panel px-4 py-2 rounded-lg text-[10px] font-mono text-cyan-400 hidden sm:block">
                  SANDBOX MODE // VITE BUILD
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER CALL TO ACTION */}
      <footer className="relative bg-black border-t border-white/10 py-24 px-6 lg:px-16 text-center overflow-hidden z-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-cyan-500/10 via-fuchsia-500/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-white/60 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>NEXT STEPS // INITIATE COLLABORATION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-['Syne']">
            Ready to build <br/>
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-white bg-clip-text text-transparent">
              Something Extraordinary?
            </span>
          </h2>

          <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            We partner with visionary enterprises, startups, and Web3 pioneers to design and engineer immersive platforms that redefine digital boundaries.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <button 
              onClick={() => { alert("Thank you for your interest! Our Q3/Q4 scheduling portal is now active."); playSound('click'); }}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-cyan-300 hover:scale-105 transition-all cursor-pointer shadow-2xl tracking-wide"
            >
              BOOK STRATEGY SESSION →
            </button>
            <a 
              href="mailto:contact@aether.studio.example" 
              onClick={() => playSound('click')}
              className="px-8 py-4 glass-panel text-white hover:text-cyan-300 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              contact@aether.studio
            </a>
          </div>

          <div className="pt-16 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono gap-4">
            <div>
              © 2026 AETHER STUDIO. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
              <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
              <a href="#" className="hover:text-white transition-colors">SYSTEM STATUS</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
