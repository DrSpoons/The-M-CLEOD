
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Menu, X, ChevronDown, Gamepad2, ArrowLeft, 
  Sparkles, BookOpen, ArrowRight 
} from 'lucide-react';

// --- TEMPORAL CHRONICLE TYPES ---
interface ThemeConfig {
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

// --- TEMPORAL CHRONICLE CONSTANTS ---
const THEMES: ThemeConfig[] = [
  {
    id: 'home',
    name: 'M-CLEOD CORE',
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

// --- AI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

async function getThematicWisdom(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return response.text || "...";
  } catch (e) {
    return "The stars are silent.";
  }
}

// --- CALENDAR COMPONENT ---
const Calendar: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = theme.monthIndex;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="backdrop-blur-2xl bg-black/40 p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl max-w-sm w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-2xl font-black tracking-widest ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>
          {theme.monthName.toUpperCase()}
        </h3>
        <span className="text-white/40 font-mono text-xs">{year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[10px] font-black text-white/30 py-1">{d}</div>)}
        {blanks.map(i => <div key={`b-${i}`} className="p-2" />)}
        {days.map(d => {
          const isToday = now.getDate() === d && now.getMonth() === month;
          return (
            <div key={d} className={`p-2 text-center text-xs font-bold transition-all rounded-lg ${isToday ? 'bg-white/20 text-white ring-1 ring-white/30' : 'text-white/80 hover:bg-white/10'}`}>
              {d}
            </div>
          );
        })}
      </div>
      <div className="text-center"><p className="text-[8px] opacity-20 font-black tracking-widest">TEMPORAL ENGINE READY</p></div>
    </div>
  );
};

// --- SECTION COMPONENT ---
const Section: React.FC<{ theme: ThemeConfig; index: number; progress: number; onEnter: (t: ThemeConfig) => void }> = ({ theme, index, progress, onEnter }) => {
  const [wisdom, setWisdom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Parallax Values
  const bgOff = (1 - progress) * 120;
  const midOff = (1 - progress) * 60;
  const scale = 0.9 + (progress * 0.1);

  const particles = useMemo(() => Array.from({ length: 40 }).map(() => ({
    l: `${Math.random() * 120 - 10}%`,
    t: `${Math.random() * 120 - 10}%`,
    d: `${Math.random() * 5}s`,
    dur: `${Math.random() * 3 + 2}s`,
    sz: Math.random() * 1 + 0.5,
    dp: Math.random()
  })), []);

  const handleWisdom = async () => {
    setLoading(true);
    setWisdom(await getThematicWisdom(theme.geminiPrompt));
    setLoading(false);
  };

  const getAnim = (t: string) => {
    switch(t) {
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
      {/* Parallax Layers */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} transition-transform duration-75 ease-out`}
           style={{ transform: `translateY(${bgOff * 0.2}px) scale(1.15)` }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"
           style={{ transform: `translateY(${midOff * -1.5}px) scale(${1.5 + (1 - progress)})`, filter: 'blur(50px)' }}>
        <span className="text-[60vw]">{theme.icon}</span>
      </div>

      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p, i) => (
          <div key={i} className="absolute rounded-full"
               style={{
                 left: p.l, top: p.t,
                 width: theme.particleType === 'bubbles' ? `${p.sz * 15}px` : `${p.sz * 4}px`,
                 height: theme.particleType === 'bubbles' ? `${p.sz * 15}px` : `${p.sz * 4}px`,
                 backgroundColor: theme.particleType === 'rain' ? '#0ff' : 'white',
                 animation: getAnim(theme.particleType),
                 animationDuration: p.dur, animationDelay: p.d,
                 opacity: progress * 0.6,
                 transform: `translateY(${(1 - progress) * 300 * p.dp}px)`
               }} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center gap-16 transition-all duration-700"
           style={{ transform: `translateY(${midOff}px) scale(${scale})`, opacity: Math.max(0, (progress - 0.2) / 0.8) }}>
        
        <div className="flex-[1.2] text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <span className="text-6xl md:text-8xl drop-shadow-2xl animate-pulse">{theme.icon}</span>
            <div className="flex flex-col text-left">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${theme.accentColor}`}>Chronicle Era</span>
              <span className="text-2xl font-black text-white/20">Phase {index}</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-none uppercase tracking-tighter" style={{ fontFamily: theme.fontFamily }}>{theme.name}</h1>
          <p className="text-xl md:text-2xl text-white/60 mb-10 italic font-light">"{theme.subtitle}"</p>
          <button onClick={handleWisdom} disabled={loading}
                  className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
            <Sparkles size={18} className={theme.accentColor} />
            <span className="font-black tracking-widest text-[10px] uppercase">{loading ? 'SYNCING...' : 'CHANNEL WISDOM'}</span>
          </button>
          {wisdom && (
            <div className="mt-8 p-6 rounded-[2rem] bg-black/60 border border-white/5 text-white animate-reveal backdrop-blur-2xl max-w-lg shadow-2xl relative">
              <div className={`absolute top-0 left-0 w-1 h-full ${theme.accentColor.replace('text-', 'bg-')} opacity-40`} />
              <p className="text-sm font-medium italic opacity-80">{wisdom}</p>
            </div>
          )}
        </div>

        <div className="flex-1 w-full max-w-sm"><Calendar theme={theme} /></div>

        <div className="flex-[0.4] flex items-center justify-center">
          <button onClick={() => onEnter(theme)} className="group flex flex-col items-center gap-4 p-8 rounded-[3rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all hover:scale-110">
            <div className={`w-20 h-20 rounded-full bg-black/50 flex items-center justify-center border border-white/10 ${theme.accentColor}`}>
              <Gamepad2 size={40} />
            </div>
            <p className={`text-xs font-black uppercase tracking-widest ${theme.accentColor}`} style={{ fontFamily: theme.fontFamily }}>Enter Realm</p>
          </button>
        </div>
      </div>
    </section>
  );
};

// --- MAIN APPLICATION ---
const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [activeRealm, setActiveRealm] = useState<ThemeConfig | null>(null);
  const [scrollRatios, setScrollRatios] = useState<number[]>(() => {
    const arr = new Array(THEMES.length).fill(0);
    arr[0] = 1; return arr;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (activeRealm) return;
      const h = el.clientHeight;
      const top = el.scrollTop;
      if (h === 0) return;

      setScrollRatios(THEMES.map((_, i) => Math.max(0, Math.min(1, (top - (i - 1) * h) / h))));
      setActiveSection(Math.min(Math.round(top / h), THEMES.length - 1));
    };

    const ro = new ResizeObserver(() => onScroll());
    ro.observe(el);
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => { el.removeEventListener('scroll', onScroll); ro.disconnect(); };
  }, [activeRealm]);

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({ top: i * scrollRef.current.clientHeight, behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {activeRealm && (
        <div className={`fixed inset-0 z-[300] bg-gradient-to-b ${activeRealm.bgGradient} flex flex-col p-8 sm:p-16 animate-in fade-in duration-500`}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]" />
          <div className="relative z-10 flex justify-between">
            <button onClick={() => setActiveRealm(null)} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10">
              <ArrowLeft size={20} /> <span className="text-[10px] font-black uppercase">Back</span>
            </button>
            <h2 className={`text-2xl font-black ${activeRealm.accentColor}`}>{activeRealm.name}</h2>
          </div>
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="text-6xl font-black mb-4">{activeRealm.gameTitle}</h3>
            <p className="text-xl text-white/40">Temporal Gateway Opening Soon...</p>
          </div>
        </div>
      )}

      <div ref={scrollRef} className={`scroll-container h-full transition-all duration-700 ${activeRealm ? 'scale-110 blur-3xl opacity-0' : 'scale-100 opacity-100'}`}>
        {THEMES.map((t, i) => (
          <div key={t.id} className="layer-wrapper" style={{ zIndex: i + 10 }}>
            <div className="sticky-layer"><Section theme={t} index={i} progress={scrollRatios[i] || 0} onEnter={setActiveRealm} /></div>
          </div>
        ))}
      </div>

      {!activeRealm && (
        <>
          <nav className="fixed top-0 left-0 right-0 z-[100] p-6 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo(0)}>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center font-bold">M</div>
            </div>
            <div className="flex items-center gap-4">
              {THEMES.map((_, i) => (
                <button key={i} onClick={() => scrollTo(i)} className={`w-1 rounded-full transition-all duration-500 ${activeSection === i ? 'h-6 bg-white' : 'h-1 bg-white/20'}`} />
              ))}
            </div>
          </nav>
          {activeSection < THEMES.length - 1 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce opacity-30"><ChevronDown size={32} /></div>
          )}
        </>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
