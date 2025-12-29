
import React, { useState, useMemo } from 'react';
import Calendar from './Calendar';
import { ThemeConfig } from '../types.js';
import { getThematicWisdom } from '../services/geminiService';
import { Sparkles, BookOpen, Gamepad2, ArrowRight } from 'lucide-react';

interface SectionProps {
  theme: ThemeConfig;
  index: number;
  progress: number; // 0 to 1, how much this section has "covered" the viewport
  onEnterRealm: (theme: ThemeConfig) => void;
}

const Section: React.FC<SectionProps> = ({ theme, index, progress, onEnterRealm }) => {
  const [wisdom, setWisdom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Memoize particle stats for consistency
  const particlesData = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: `${Math.random() * 120 - 10}%`,
      top: `${Math.random() * 120 - 10}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
      size: Math.random() * 1 + 0.5
    }));
  }, []);

  const fetchWisdom = async () => {
    setLoading(true);
    const result = await getThematicWisdom(theme.geminiPrompt);
    setWisdom(result);
    setLoading(false);
  };

  return (
    <section 
      className={`relative w-full h-full bg-gradient-to-b ${theme.bgGradient} flex items-center justify-center overflow-hidden`}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Transitional Particle System - Becomes visible as section enters */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particlesData.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              width: theme.particleType === 'bubbles' ? `${p.size * 15}px` : `${p.size * 4}px`,
              height: theme.particleType === 'bubbles' ? `${p.size * 15}px` : `${p.size * 4}px`,
              backgroundColor: theme.particleType === 'rain' ? '#0ff' : 'white',
              boxShadow: theme.particleType === 'snow' || theme.particleType === 'stars' ? '0 0 12px white' : 'none',
              border: theme.particleType === 'bubbles' ? '1px solid rgba(255,255,255,0.4)' : 'none',
              animation: getAnimation(theme.particleType),
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: progress * 0.7,
              visibility: progress > 0.05 ? 'visible' : 'hidden'
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 transition-all duration-[1.2s] ease-out ${progress > 0.4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-32 scale-90 blur-lg'}`}>
        
        {/* Left Side: Information */}
        <div className="flex-[1.2] text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <span className="text-6xl md:text-8xl drop-shadow-2xl animate-pulse">{theme.icon}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[12px] font-black uppercase tracking-[0.4em] ${theme.accentColor} drop-shadow-md`}>Temporal Era</span>
              <span className="text-2xl font-black text-white/30 drop-shadow-md">PHASE {index}</span>
            </div>
          </div>
          
          <h1 
            className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] leading-none uppercase tracking-tighter"
            style={{ fontFamily: theme.fontFamily }}
          >
            {theme.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl italic font-light drop-shadow-xl leading-relaxed">
            "{theme.subtitle}"
          </p>

          <div className="flex flex-wrap gap-5 justify-center md:justify-start">
            <button 
              onClick={fetchWisdom}
              disabled={loading}
              className="flex items-center gap-4 px-10 py-4 rounded-2xl bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 group backdrop-blur-2xl shadow-2xl"
            >
              <Sparkles size={20} className={`${theme.accentColor} group-hover:rotate-45 transition-transform duration-500`} />
              <span className="font-black tracking-[0.2em] text-[10px] uppercase">{loading ? 'SYNCING...' : 'CHANNEL WISDOM'}</span>
            </button>
          </div>

          {wisdom && (
            <div className="mt-10 p-8 rounded-[2rem] bg-black/80 border border-white/10 text-white animate-reveal text-base italic leading-relaxed backdrop-blur-3xl max-w-lg shadow-2xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-2 h-full ${theme.accentColor.replace('text-', 'bg-')} opacity-60`} />
              <BookOpen size={20} className="mb-4 opacity-40" />
              <p className="relative z-10 font-medium tracking-wide">{wisdom}</p>
            </div>
          )}
        </div>

        {/* Center: Calendar */}
        <div className="flex-1 w-full max-w-sm">
          <div className="shadow-[0_60px_120px_rgba(0,0,0,0.9)] rounded-[2.5rem] transform hover:rotate-1 transition-transform duration-700">
            <Calendar theme={theme} />
          </div>
        </div>

        {/* Right Side: Realm Entry Button */}
        <div className="flex-[0.4] flex items-center justify-center">
          <button 
            onClick={() => onEnterRealm(theme)}
            className="group relative flex flex-col items-center gap-6 p-10 rounded-[4rem] bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-3xl transition-all duration-700 hover:scale-110 shadow-2xl active:scale-95"
          >
            <div className={`absolute inset-0 ${theme.accentColor.replace('text-', 'bg-')} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity rounded-full`} />
            <div className={`w-24 h-24 rounded-full bg-black/50 flex items-center justify-center border border-white/20 ${theme.accentColor} shadow-[0_0_40px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_60px_currentColor] transition-all duration-500`}>
              <Gamepad2 size={48} className="group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black tracking-[0.6em] opacity-30 uppercase mb-2">The Related</p>
              <p className={`text-sm font-black uppercase tracking-widest ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>
                Enter Realm
              </p>
            </div>
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
               <ArrowRight size={18} className={theme.accentColor} />
            </div>
          </button>
        </div>
      </div>

      {/* Section Description Bar */}
      <div className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 ${progress > 0.8 ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="text-white text-[9px] tracking-[0.8em] uppercase font-black px-6">{theme.description}</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-reveal { animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </section>
  );
};

function getAnimation(type: string): string {
    switch(type) {
        case 'snow': return 'snow-blow linear infinite';
        case 'bubbles': return 'bubble-rise ease-in infinite';
        case 'stars': return 'mana-spark ease-in-out infinite';
        case 'leaves': return 'leaf-drift ease-in-out infinite';
        case 'rain': return 'rain-fall linear infinite';
        default: return 'none';
    }
}

export default Section;
