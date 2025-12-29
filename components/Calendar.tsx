
import React from 'react';
import { ThemeConfig } from '../types';

interface CalendarProps {
  theme: ThemeConfig;
}

const Calendar: React.FC<CalendarProps> = ({ theme }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = theme.monthIndex;
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={`backdrop-blur-2xl bg-black/40 p-4 md:p-8 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm w-full mx-auto`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-2xl md:text-3xl font-bold tracking-wider ${theme.accentColor} drop-shadow-sm`} style={{ fontFamily: theme.fontFamily }}>
          {theme.monthName.toUpperCase()}
        </h3>
        <span className="text-white/60 text-sm font-mono">{year}</span>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-black text-white/40 py-1 uppercase">
            {day}
          </div>
        ))}
        
        {blanks.map(i => (
          <div key={`blank-${i}`} className="p-2" />
        ))}

        {days.map(day => {
          const isToday = now.getDate() === day && now.getMonth() === month;
          return (
            <div 
              key={day} 
              className={`
                relative p-2 text-center text-sm font-medium transition-all duration-300 rounded-lg group cursor-pointer
                ${isToday ? 'bg-white/20 text-white scale-110 shadow-lg ring-1 ring-white/30' : 'text-white/90 hover:bg-white/10 hover:text-white'}
              `}
            >
              {day}
              {isToday && (
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${theme.accentColor.replace('text-', 'bg-')} animate-ping shadow-lg`} />
              )}
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

export default Calendar;
