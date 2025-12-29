
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Menu, X, ChevronDown, Gamepad2, ArrowLeft, 
  Sparkles, BookOpen, ArrowRight 
} from 'lucide-react';

// --- TYPES ---
export interface ThemeConfig {
  id: string;
  name: string;
  subtitle: string;
  monthName: string;
  monthIndex: number; 
  bgGradient: string;
  accentColor: string;
  fontFamily: string;
  icon: string;
  description: string;
  particleType: 'stars' | 'bubbles' | 'leaves' | 'rain' | 'snow' | 'none';
  geminiPrompt: string;
  gameTitle: string;
}

// --- CONSTANTS ---
export const THEMES: ThemeConfig[] = [
  {
    id: 'home',
    name: 'WELCOME TO M-CLEOD',
    subtitle: 'THE CHRONICLE OF TIME',
    monthName: 'The Nexus',
    monthIndex: 0,
    bgGradient: 'from-slate-900 via-blue-900 to-black',
    accentColor: 'text-cyan-400',
    fontFamily: 'Orbitron',
    icon: '✨',
    description: 'The core of the multi-verse. Where all months converge.',
    particleType: 'stars',
    geminiPrompt: 'Give me a welcoming, mysterious message about a grand journey through 12 thematic worlds of a calendar.',
    gameTitle: 'Nexus Void-Runner'
  },
  {
    id: 'january',
    name: 'FROST KINGDOM',
    subtitle: 'THE FIRST CHILL',
    monthName: 'January',
    monthIndex: 0,
    bgGradient: 'from-blue-500 via-cyan-700 to-blue-900',
    accentColor: 'text-blue-300',
    fontFamily: 'Inter',
    icon: '❄️',
    description: 'A land of eternal ice and shimmering crystals.',
    particleType: 'snow',
    geminiPrompt: 'Provide a short, poetic quote about the quiet beauty of a frozen winter morning.',
    gameTitle: 'Cryo-Climb'
  },
  {
    id: 'february',
    name: 'WIZARDS & MAGIC',
    subtitle: 'THE ARCANE SANCTUM',
    monthName: 'February',
    monthIndex: 1,
    bgGradient: 'from-indigo-900 via-purple-900 to-black',
    accentColor: 'text-purple-400',
    fontFamily: 'Cinzel Decorative',
    icon: '🧙‍♂️',
    description: 'Where ley lines cross and ancient spells are woven.',
    particleType: 'stars',
    geminiPrompt: 'Share a cryptic wizard wisdom for the month of February.',
    gameTitle: 'Spellbinder Duel'
  },
  {
    id: 'march',
    name: 'PIRATES & SEA',
    subtitle: 'TIDES OF FORTUNE',
    monthName: 'March',
    monthIndex: 2,
    bgGradient: 'from-emerald-900 via-teal-800 to-blue-900',
    accentColor: 'text-yellow-500',
    fontFamily: 'Pirata One',
    icon: '🏴‍☠️',
    description: 'Navigate the treacherous waters of the Obsidian Coast.',
    particleType: 'bubbles',
    geminiPrompt: 'Give me a short pirate-themed greeting for a sailor entering March.',
    gameTitle: 'Scurvy Scramble'
  },
  {
    id: 'april',
    name: 'ENCHANTED FOREST',
    subtitle: 'WHISPERS IN THE LEAVES',
    monthName: 'April',
    monthIndex: 3,
    bgGradient: 'from-green-900 via-emerald-800 to-green-950',
    accentColor: 'text-lime-400',
    fontFamily: 'MedievalSharp',
    icon: '🌿',
    description: 'Awaken the spirits of the spring within the deep woods.',
    particleType: 'leaves',
    geminiPrompt: 'What would a forest spirit say about the arrival of spring in April?',
    gameTitle: 'Spirit Trail'
  },
  {
    id: 'may',
    name: 'CYBERPUNK NEON',
    subtitle: 'NIGHT CITY VIBES',
    monthName: 'May',
    monthIndex: 4,
    bgGradient: 'from-fuchsia-950 via-black to-blue-950',
    accentColor: 'text-pink-500',
    fontFamily: 'Orbitron',
    icon: '🤖',
    description: 'High tech, low life. The future is now.',
    particleType: 'rain',
    geminiPrompt: 'Write a short cyberpunk-style haiku for the month of May.',
    gameTitle: 'Neon Hack'
  },
  {
    id: 'june',
    name: 'EGYPTIAN SANDS',
    subtitle: 'LEGACY OF RA',
    monthName: 'June',
    monthIndex: 5,
    bgGradient: 'from-orange-400 via-yellow-600 to-amber-900',
    accentColor: 'text-yellow-200',
    fontFamily: 'Cinzel Decorative',
    icon: '🌞',
    description: 'Ancient pyramids under the relentless desert sun.',
    particleType: 'none',
    geminiPrompt: 'A short blessing from an Egyptian sun deity for June.',
    gameTitle: 'Anubis Ascent'
  },
  {
    id: 'july',
    name: 'SYNTHWAVE SUNSET',
    subtitle: 'RETRO 80S RADICAL',
    monthName: 'July',
    monthIndex: 6,
    bgGradient: 'from-purple-600 via-pink-500 to-orange-400',
    accentColor: 'text-cyan-300',
    fontFamily: 'Orbitron',
    icon: '🕶️',
    description: 'Driving into the grid as the digital sun never sets.',
    particleType: 'stars',
    geminiPrompt: 'Give me a radical 80s movie tagline for July.',
    gameTitle: 'Retro Racer'
  },
  {
    id: 'august',
    name: 'GALACTIC FRONTIER',
    subtitle: 'ACROSS THE STARS',
    monthName: 'August',
    monthIndex: 7,
    bgGradient: 'from-black via-slate-900 to-indigo-950',
    accentColor: 'text-blue-300',
    fontFamily: 'Orbitron',
    icon: '🚀',
    description: 'Exploring the outer rim of the Andromeda galaxy.',
    particleType: 'stars',
    geminiPrompt: 'A short communication log from a deep space explorer in August.',
    gameTitle: 'Orbit Defense'
  },
  {
    id: 'september',
    name: 'STEAMPUNK COG',
    subtitle: 'CLOCKED IN TIME',
    monthName: 'September',
    monthIndex: 8,
    bgGradient: 'from-amber-950 via-stone-800 to-orange-950',
    accentColor: 'text-orange-400',
    fontFamily: 'Special Elite',
    icon: '⚙️',
    description: 'Steam-driven machinery and brass-clad adventures.',
    particleType: 'none',
    geminiPrompt: 'A short instruction from a steampunk inventor for the start of September.',
    gameTitle: 'Crank-Shaft'
  },
  {
    id: 'october',
    name: 'SPOOKY HOLLOW',
    subtitle: 'NIGHT OF THE HARVEST',
    monthName: 'October',
    monthIndex: 9,
    bgGradient: 'from-black via-purple-950 to-orange-900',
    accentColor: 'text-orange-600',
    fontFamily: 'MedievalSharp',
    icon: '🎃',
    description: 'Where the veil is thin and the shadows come alive.',
    particleType: 'leaves',
    geminiPrompt: 'A spooky 2-sentence story for a dark October night.',
    gameTitle: 'Grave Digger'
  },
  {
    id: 'november',
    name: 'ZEN GARDEN',
    subtitle: 'THE HARMONY OF FALL',
    monthName: 'November',
    monthIndex: 10,
    bgGradient: 'from-stone-800 via-red-950 to-stone-900',
    accentColor: 'text-red-400',
    fontFamily: 'Inter',
    icon: '🏮',
    description: 'Peaceful reflection as the last leaves descend.',
    particleType: 'leaves',
    geminiPrompt: 'A short Zen koan about change and transition for November.',
    gameTitle: 'Petal Fall'
  },
  {
    id: 'december',
    name: 'COZY CHRONICLE',
    subtitle: 'THE GRAND FINALE',
    monthName: 'December',
    monthIndex: 11,
    bgGradient: 'from-red-900 via-green-950 to-black',
    accentColor: 'text-red-500',
    fontFamily: 'Cinzel Decorative',
    icon: '🎄',
    description: 'Gather round the hearth for the year\'s end.',
    particleType: 'snow',
    geminiPrompt: 'A warm, festive greeting for the final month of the M-CLEOD.',
    gameTitle: 'Gift Grab'
  }
];

// --- GEMINI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

async function getThematicWisdom(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8, topP: 0.9 }
    });
    return response.text || "Wisdom is currently shrouded in mystery...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The stars are silent today. (Check API Key)";
  }
}

// --- CALENDAR COMPONENT ---
const Calendar: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = theme.monthIndex;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="backdrop-blur-2xl bg-black/40 p-4 md:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-2xl md:text-3xl font-bold tracking-wider ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>
          {theme.monthName.toUpperCase()}
        </h3>
        <span className="text-white/60 text-sm font-mono">{year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
        {dayNames.map(day => <div key={day} className="text-center text-xs font-black text-white/40 py-1 uppercase">{day}</div>)}
        {blanks.map(i => <div key={`blank-${i}`} className="p-2" />)}
        {days.map(day => {
          const isToday = now.getDate() === day && now.getMonth() === month;
          return (
            <div key={day} className={`relative p-2 text-center text-sm font-medium transition-all duration-300 rounded-lg group cursor-pointer ${isToday ? 'bg-white/20 text-white scale-110 shadow-lg ring-1 ring-white/30' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}>
              {day}
              {isToday && <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${theme.accentColor.replace('text-', 'bg-')} animate-ping shadow-lg`} />}
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <p className="text-white/30 text-[9px] tracking-widest font-bold italic uppercase">Temporal Engine v2.1</p>
      </div>
    </div>
  );
};

// --- SECTION COMPONENT ---
interface SectionProps {
  theme: ThemeConfig;
  index: number;
  progress: number;
  onEnterRealm: (theme: ThemeConfig) => void;
}

const Section: React.FC<SectionProps> = ({ theme, index, progress, onEnterRealm }) => {
  const [wisdom, setWisdom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Parallax offsets
  const bgTranslate = (1 - progress) * 120; 
  const midTranslate = (1 - progress) * 60;
  const iconScale = 0.85 + (progress * 0.15);

  const particlesData = useMemo(() => Array.from({ length: 45 }).map(() => ({
    left: `${Math.random() * 120 - 10}%`,
    top: `${Math.random() * 120 - 10}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 2}s`,
    size: Math.random() * 1 + 0.5,
    depth: Math.random()
  })), []);

  const handleWisdom = async () => {
    setLoading(true);
    setWisdom(await getThematicWisdom(theme.geminiPrompt));
    setLoading(false);
  };

  const getAnimation = (type: string) => {
    switch(type) {
      case 'snow': return 'snow-blow linear infinite';
      case 'bubbles': return 'bubble-rise ease-in infinite';
      case 'stars': return 'mana-spark ease-in-out infinite';
      case 'leaves': return 'leaf-drift ease-in-out infinite';
      case 'rain': return 'rain-fall linear infinite';
      default: return 'none';
    }
  };

  return (
    <section className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} transition-transform duration-75 ease-out`}
           style={{ transform: `translateY(${bgTranslate * 0.2}px) scale(1.1)` }} />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none"
           style={{ transform: `translateY(${midTranslate * -1.5}px) scale(${1.5 + (1 - progress)})`, filter: 'blur(40px)' }}>
        <span className="text-[60vw]">{theme.icon}</span>
      </div>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particlesData.map((p, i) => (
          <div key={i} className="absolute rounded-full"
               style={{
                 left: p.left, top: p.top,
                 width: theme.particleType === 'bubbles' ? `${p.size * 15}px` : `${p.size * 4}px`,
                 height: theme.particleType === 'bubbles' ? `${p.size * 15}px` : `${p.size * 4}px`,
                 backgroundColor: theme.particleType === 'rain' ? '#0ff' : 'white',
                 boxShadow: theme.particleType === 'snow' || theme.particleType === 'stars' ? '0 0 12px white' : 'none',
                 border: theme.particleType === 'bubbles' ? '1px solid rgba(255,255,255,0.4)' : 'none',
                 animation: getAnimation(theme.particleType),
                 animationDuration: p.duration, animationDelay: p.delay,
                 opacity: progress * 0.7, visibility: progress > 0.05 ? 'visible' : 'hidden',
                 transform: `translateY(${(1 - progress) * 250 * p.depth}px)`
               }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 transition-all duration-700 ease-out"
           style={{ transform: `translateY(${midTranslate}px) scale(${progress > 0.5 ? 1 : 0.95})`, opacity: Math.max(0, (progress - 0.2) / 0.8) }}>
        
        <div className="flex-[1.2] text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <span className="text-6xl md:text-8xl drop-shadow-2xl animate-pulse transition-transform duration-1000"
                  style={{ transform: `scale(${iconScale})` }}>{theme.icon}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[12px] font-black uppercase tracking-[0.4em] ${theme.accentColor}`}>Temporal Era</span>
              <span className="text-2xl font-black text-white/30">PHASE {index}</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] leading-none uppercase tracking-tighter"
              style={{ fontFamily: theme.fontFamily }}>{theme.name}</h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl italic font-light drop-shadow-xl">"{theme.subtitle}"</p>
          <button onClick={handleWisdom} disabled={loading}
                  className="flex items-center gap-4 px-10 py-4 rounded-2xl bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 group backdrop-blur-2xl">
            <Sparkles size={20} className={`${theme.accentColor} group-hover:rotate-45 transition-transform duration-500`} />
            <span className="font-black tracking-[0.2em] text-[10px] uppercase">{loading ? 'SYNCING...' : 'CHANNEL WISDOM'}</span>
          </button>
          {wisdom && (
            <div className="mt-10 p-8 rounded-[2rem] bg-black/80 border border-white/10 text-white animate-reveal text-base italic leading-relaxed backdrop-blur-3xl max-w-lg shadow-2xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-2 h-full ${theme.accentColor.replace('text-', 'bg-')} opacity-60`} />
              <BookOpen size={20} className="mb-4 opacity-40" />
              <p className="relative z-10 font-medium tracking-wide">{wisdom}</p>
            </div>
          )}
        </div>

        <div className="flex-1 w-full max-w-sm transition-transform duration-1000" style={{ transform: `translateY(${midTranslate * -0.5}px)` }}>
          <div className="shadow-[0_60px_120px_rgba(0,0,0,0.9)] rounded-[2.5rem] transform hover:rotate-1 transition-transform duration-700">
            <Calendar theme={theme} />
          </div>
        </div>

        <div className="flex-[0.4] flex items-center justify-center transition-transform duration-1000" style={{ transform: `translateY(${midTranslate * 0.5}px)` }}>
          <button onClick={() => onEnterRealm(theme)}
                  className="group relative flex flex-col items-center gap-6 p-10 rounded-[4rem] bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-3xl transition-all duration-700 hover:scale-110 shadow-2xl active:scale-95">
            <div className={`absolute inset-0 ${theme.accentColor.replace('text-', 'bg-')} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity rounded-full`} />
            <div className={`w-24 h-24 rounded-full bg-black/50 flex items-center justify-center border border-white/20 ${theme.accentColor} shadow-[0_0_40px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_60px_currentColor] transition-all`}>
              <Gamepad2 size={48} className="group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black tracking-[0.6em] opacity-30 uppercase mb-2">The Related</p>
              <p className={`text-sm font-black uppercase tracking-widest ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>Enter Realm</p>
            </div>
            <ArrowRight size={18} className={`${theme.accentColor} opacity-0 group-hover:opacity-100 transition-all`} />
          </button>
        </div>
      </div>

      <div className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 ${progress > 0.8 ? 'opacity-40' : 'opacity-0'}`}>
        <p className="text-white text-[9px] tracking-[0.8em] uppercase font-black px-6">{theme.description}</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } .animate-reveal { animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }` }} />
    </section>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [activeRealm, setActiveRealm] = useState<ThemeConfig | null>(null);
  const [scrollRatios, setScrollRatios] = useState<number[]>(() => {
    const initial = new Array(THEMES.length).fill(0);
    initial[0] = 1; return initial;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const calculateRatios = () => {
      if (activeRealm) return;
      const h = container.clientHeight;
      const top = container.scrollTop;
      if (h === 0) return;

      const newRatios = THEMES.map((_, i) => {
        const distance = top - (i - 1) * h;
        return Math.max(0, Math.min(1, distance / h));
      });
      setScrollRatios(newRatios);
      setActiveSection(Math.max(0, Math.min(Math.round(top / h), THEMES.length - 1)));
    };

    const ro = new ResizeObserver(() => calculateRatios());
    ro.observe(container);
    container.addEventListener('scroll', calculateRatios, { passive: true });
    calculateRatios();

    return () => {
      container.removeEventListener('scroll', calculateRatios);
      ro.disconnect();
    };
  }, [activeRealm]);

  const scrollToSection = (i: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: i * scrollRef.current.clientHeight, behavior: 'smooth' });
    setIsNavOpen(false);
  };

  const RealmView = ({ theme }: { theme: ThemeConfig }) => (
    <div className={`fixed inset-0 z-[300] bg-gradient-to-b ${theme.bgGradient} flex flex-col p-8 sm:p-16 animate-in fade-in zoom-in-95 duration-500`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px] pointer-events-none" />
      <div className="relative z-10 flex justify-between items-center mb-16">
        <button onClick={() => setActiveRealm(null)}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10">
          <ArrowLeft size={20} />
          <span className="font-black tracking-widest text-xs uppercase">Back to Chronicle</span>
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black tracking-[0.5em] opacity-40 uppercase">Realm Phase</p>
          <h2 className={`text-2xl font-black uppercase ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>{theme.name}</h2>
        </div>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-32 h-32 rounded-full bg-black/40 flex items-center justify-center border border-white/10 ${theme.accentColor} mb-8 shadow-2xl`}>
          <Gamepad2 size={64} className="animate-pulse" />
        </div>
        <h3 className="text-5xl md:text-7xl font-black mb-6 text-white uppercase tracking-tighter" style={{ fontFamily: theme.fontFamily }}>{theme.gameTitle}</h3>
        <p className="text-2xl text-white/40 max-w-2xl font-light italic">Gateway Aligning. Web experiences arriving soon.</p>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center group hover:bg-white/10 transition-all cursor-not-allowed">
              <span className="text-white/20 font-black tracking-widest uppercase text-xs">Slot {i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-screen bg-black font-sans text-white overflow-hidden">
      {activeRealm && <RealmView theme={activeRealm} />}
      <div ref={scrollRef} className={`scroll-container h-full transition-all duration-700 ${activeRealm ? 'scale-110 blur-3xl opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        {THEMES.map((theme, i) => (
          <div key={theme.id} className="layer-wrapper" style={{ zIndex: i + 10 }}>
            <div className="sticky-layer">
              <Section theme={theme} index={i} progress={scrollRatios[i] || 0} onEnterRealm={setActiveRealm} />
            </div>
          </div>
        ))}
      </div>

      {!activeRealm && (
        <>
          <nav className="fixed top-0 left-0 right-0 z-[100] p-6 flex justify-between items-center pointer-events-none">
            <div onClick={() => scrollToSection(0)} className="flex items-center gap-2 pointer-events-auto cursor-pointer group">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <span className="text-xl font-bold font-[Orbitron]">M</span>
              </div>
              <span className="text-xs font-black tracking-[0.4em] hidden sm:block uppercase font-[Orbitron] opacity-60">The M-Cleod</span>
            </div>
            <button onClick={() => setIsNavOpen(true)} className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 pointer-events-auto hover:bg-white/20 transition-all">
              <Menu size={20} />
            </button>
          </nav>
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-4">
            {THEMES.map((_, i) => <button key={i} onClick={() => scrollToSection(i)} className={`w-1 rounded-full transition-all duration-700 ${activeSection === i ? 'h-8 bg-white' : 'h-2 bg-white/20 hover:bg-white/40'}`} />)}
          </div>
          {activeSection < THEMES.length - 1 && <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce opacity-30"><ChevronDown size={32} /></div>}
        </>
      )}

      {isNavOpen && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-[50px] flex flex-col p-8 sm:p-16 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl font-black tracking-widest uppercase font-[Orbitron]">Chronicle Archive</h2>
            <button onClick={() => setIsNavOpen(false)} className="p-4 bg-white/10 rounded-full hover:bg-white/20"><X size={24} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto">
            {THEMES.map((theme, i) => (
              <button key={theme.id} onClick={() => scrollToSection(i)} className={`flex items-center gap-6 p-6 rounded-3xl border transition-all text-left group ${activeSection === i ? 'bg-white text-black' : 'bg-white/5 border-white/10'}`}>
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

// --- RENDER ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
