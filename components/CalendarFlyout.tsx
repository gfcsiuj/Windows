import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CalendarFlyoutProps {
  isOpen: boolean;
  isDark: boolean;
}

export const CalendarFlyout: React.FC<CalendarFlyoutProps> = ({ isOpen, isDark }) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const today = date.getDate();

  // Get total days in current month (0th day of next month gets last day of current)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get starting day of the week (0-6, Sunday-Saturday)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  // Padding for grid
  const padding = Array.from({ length: firstDayIndex }, (_, i) => i);

  const bgClass = isDark ? 'bg-[#202020]/95 border-[#333] text-white' : 'bg-[#f3f3f3]/90 border-white/40 text-gray-800';
  const hoverClass = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200';

  return (
    <div 
      className={`flyout fixed right-4 bottom-14 w-80 backdrop-blur-xl border rounded-lg shadow-2xl p-4 transition-all duration-300 ease-in-out z-[100] flex flex-col gap-2 ${bgClass}
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="text-sm font-semibold opacity-90">
          {date.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="flex gap-1">
            <button className={`p-1 rounded ${hoverClass}`}><ChevronUp size={14}/></button>
            <button className={`p-1 rounded ${hoverClass}`}><ChevronDown size={14}/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-bold opacity-70 mb-2 mt-2">
        <span>ح</span><span>ن</span><span>ث</span><span>ر</span><span>خ</span><span>ج</span><span>س</span>
      </div>
      <div className="grid grid-cols-7 text-center text-sm gap-1">
        {padding.map(i => <span key={`pad-${i}`}></span>)}
        {days.map(d => {
            const isToday = d === today;
            return (
                <span 
                  key={d} 
                  className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition text-xs
                    ${isToday ? 'bg-blue-600 text-white font-bold' : `${hoverClass} opacity-90`}
                  `}
                >
                  {d}
                </span>
            );
        })}
      </div>
    </div>
  );
};