
import React, { useState, useEffect, useRef } from 'react';
import { THEMES } from './constants.js';           // Added .ts
import Section from './components/Section.js';    // Added .tsx
import { ThemeConfig } from './types.js';           // Added .ts
import { Menu, X, ChevronDown, Gamepad2, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [activeRealm, setActiveRealm] = useState<ThemeConfig | null>(null);
  
  // Initialize first section as fully visible (progress = 1)
  const [scrollRatios, setScrollRatios] = useState<number[]>(() => {
    const initial = new Array(THEMES.length).fill(0);
    initial[0] = 1;
    return initial;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const calculateRatios = () => {
      if (!container || activeRealm) return;
      
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      
      if (containerHeight === 0) return;

      const newRatios = THEMES.map((_, i) => {
        // distance: how far into the viewport this section has scrolled
        // For section i, it starts entering when scrollTop reaches (i-1)*H
        // and is fully centered when scrollTop reaches i*H
        const distance = scrollTop - (i - 1) * containerHeight;
        const ratio = Math.max(0, Math.min(1, distance / containerHeight));
        return ratio;
      });

      setScrollRatios(newRatios);

      const index = Math.round(scrollTop / containerHeight);
      setActiveSection(Math.max(0, Math.min(index, THEMES.length - 1)));
    };

    // Use ResizeObserver to catch the initial layout paint
    const resizeObserver = new ResizeObserver(() => {
      calculateRatios();
    });
    resizeObserver.observe(container);

    container.addEventListener('scroll', calculateRatios, { passive: true });
    
    // Immediate calculation for safety
    calculateRatios();

    return () => {
      container.removeEventListener('scroll', calculateRatios);
      resizeObserver.disconnect();
    };
  }, [activeRealm]);

  const scrollToSection = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: index * scrollRef.current.clientHeight,
      behavior: 'smooth'
    });
    setIsNavOpen(false);
  };

  const handleEnterRealm = (theme: ThemeConfig) => {
    setActiveRealm(theme);
  };

  const handleExitRealm = () => {
    setActiveRealm(null);
  };

  const RealmView = ({ theme }: { theme: ThemeConfig }) => (
    <div className={`fixed inset-0 z-[300] bg-gradient-to-b ${theme.bgGradient} flex flex-col p-8 sm:p-16 animate-in fade-in zoom-in-95 duration-500`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-center mb-16">
        <button 
          onClick={handleExitRealm}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
        >
          <ArrowLeft size={20} />
          <span className="font-black tracking-widest text-xs uppercase">Back to Chronicle</span>
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black tracking-[0.5em] opacity-40 uppercase">Realm Phase</p>
          <h2 className={`text-2xl font-black uppercase ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>
            {theme.name}
          </h2>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-32 h-32 rounded-full bg-black/40 flex items-center justify-center border border-white/10 ${theme.accentColor} mb-8 shadow-2xl`}>
          <Gamepad2 size={64} className="animate-pulse" />
        </div>
        <h3 className="text-5xl md:text-7xl font-black mb-6 text-white uppercase tracking-tighter" style={{ fontFamily: theme.fontFamily }}>
          {theme.gameTitle}
        </h3>
        <p className="text-2xl text-white/40 max-w-2xl font-light italic">
          The temporal gateway to the games of this realm is aligning. Web app experiences arriving soon in the M-CLEOD universe.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center group hover:bg-white/10 transition-all cursor-not-allowed">
              <span className="text-white/20 font-black tracking-widest uppercase text-xs">Game Slot {i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-screen bg-black font-sans text-white overflow-hidden">
      {activeRealm && <RealmView theme={activeRealm} />}

      <div 
        ref={scrollRef}
        className={`scroll-container h-full transition-all duration-700 ${activeRealm ? 'scale-110 blur-3xl opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        {THEMES.map((theme, index) => (
          <div 
            key={theme.id} 
            className="layer-wrapper"
            style={{ zIndex: index + 10 }}
          >
            <div className="sticky-layer">
              <Section 
                theme={theme} 
                index={index} 
                progress={scrollRatios[index] || 0} 
                onEnterRealm={handleEnterRealm}
              />
            </div>
          </div>
        ))}
      </div>

      {!activeRealm && (
        <>
          <nav className="fixed top-0 left-0 right-0 z-[100] p-6 flex justify-between items-center pointer-events-none">
            <div 
              className="flex items-center gap-2 pointer-events-auto cursor-pointer group"
              onClick={() => scrollToSection(0)}
            >
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <span className="text-xl font-bold font-[Orbitron]">M</span>
              </div>
              <span className="text-xs font-black tracking-[0.4em] hidden sm:block uppercase font-[Orbitron] opacity-60 group-hover:opacity-100 transition-opacity">The M-Cleod</span>
            </div>

            <button 
              onClick={() => setIsNavOpen(true)}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 pointer-events-auto hover:bg-white/20 transition-all shadow-xl"
            >
              <Menu size={20} />
            </button>
          </nav>

          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-4">
            {THEMES.map((_, i) => (
              <button 
                key={i}
                onClick={() => scrollToSection(i)}
                className={`w-1 rounded-full transition-all duration-700 ${activeSection === i ? 'h-8 bg-white' : 'h-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>

          {activeSection < THEMES.length - 1 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce opacity-30">
              <ChevronDown size={32} />
            </div>
          )}
        </>
      )}

      {isNavOpen && !activeRealm && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-[50px] flex flex-col p-8 sm:p-16 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl font-black tracking-widest uppercase font-[Orbitron]">Chronicle Archive</h2>
            <button onClick={() => setIsNavOpen(false)} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pr-4 scrollbar-hide">
            {THEMES.map((theme, i) => (
              <button
                key={theme.id}
                onClick={() => scrollToSection(i)}
                className={`flex items-center gap-6 p-6 rounded-3xl border transition-all text-left group ${activeSection === i ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
              >
                <span className="text-4xl group-hover:rotate-12 transition-transform duration-500">{theme.icon}</span>
                <div>
                  <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mb-1">Phase {i}</p>
                  <p className="font-black text-xl leading-tight uppercase" style={{ fontFamily: theme.fontFamily }}>{theme.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
