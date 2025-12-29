
import React, { useState } from 'react';
import Calendar from './Calendar';
import { ThemeConfig } from '../types';
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

  // Define particle counts based on progress
  const particleCount = Math.floor(progress * 25);
  const particles = Array.from({ length: particleCount });

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

      {/* Transitional Particle System */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: theme.particleType === 'bubbles' ? `${Math.random() * 20 + 5}px` : '4px',
              height: theme.particleType === 'bubbles' ? `${Math.random() * 20 + 5}px` : '4px',
              backgroundColor: theme.particleType === 'rain' ? '#0ff' : 'white',
              boxShadow: theme.particleType === 'snow' ? '0 0 10px white' : 'none',
              border: theme.particleType === 'bubbles' ? '1px solid rgba(255,255,255,0.3)' : 'none',
              animation: getAnimation(theme.particleType),
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: progress * 0.6
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 transition-all duration-[1s] ease-out ${progress > 0.5 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
        
        {/* Left Side: Information */}
        <div className="flex-[1.2] text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <span className="text-6xl md:text-8xl drop-shadow-2xl">{theme.icon}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[12px] font-black uppercase tracking-[0.4em] ${theme.accentColor} drop-shadow-md`}>Temporal Era</span>
              <span className="text-2xl font-black text-white/30 drop-shadow-md">PHASE {index}</span>
            </div>
          </div>
          
          <h1 
            className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none uppercase tracking-tighter"
            style={{ fontFamily: theme.fontFamily }}
          >
            {theme.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl italic font-light drop-shadow-xl">
            "{theme.subtitle}"
          </p>

          <div className="flex flex-wrap gap-5 justify-center md:justify-start">
            <button 
              onClick={fetchWisdom}
              disabled={loading}
              className="flex items-center gap-4 px-10 py-4 rounded-2xl bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 group backdrop-blur-2xl shadow-2xl"
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
          <div className="shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[2.5rem]">
            <Calendar theme={theme} />
          </div>
        </div>

        {/* Right Side: Realm Entry Button */}
        <div className="flex-[0.4] flex items-center justify-center">
          <button 
            onClick={() => onEnterRealm(theme)}
            className="group relative flex flex-col items-center gap-4 p-8 rounded-[3rem] bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:scale-110 shadow-2xl active:scale-95"
          >
            <div className={`absolute inset-0 ${theme.accentColor.replace('text-', 'bg-')} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity rounded-full`} />
            <div className={`w-20 h-20 rounded-full bg-black/40 flex items-center justify-center border border-white/10 ${theme.accentColor} shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_currentColor] transition-all`}>
              <Gamepad2 size={40} className="group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase mb-1">Related</p>
              <p className={`text-sm font-black uppercase tracking-widest ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>
                Enter Realm
              </p>
            </div>
            <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
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
        case 'snow': return 'snow-fall linear infinite';
        case 'bubbles': return 'bubble-rise ease-in infinite';
        case 'stars': return 'mana-spark ease-in-out infinite';
        default: return 'none';
    }
}

export default Section;
