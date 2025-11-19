import React, { useState, useEffect } from 'react';
import { AppId, WindowState, BatteryState } from '../types';
import { APPS } from '../constants';
import { Wifi, WifiOff, Volume2, Battery, BatteryCharging, ChevronUp, CloudSun, Search, LayoutGrid } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  isDark: boolean;
  align?: 'center' | 'left';
  battery?: BatteryState;
  isOnline?: boolean;
  onAppClick: (appId: string) => void;
  onStartClick: () => void;
  onActionCenterClick: () => void;
  onClockClick: () => void;
  onMinimizeAll: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  windows, activeWindowId, isDark, align = 'center', battery, isOnline, onAppClick, onStartClick, onActionCenterClick, onClockClick, onMinimizeAll 
}) => {
  const [time, setTime] = useState(new Date());
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  
  const pinnedApps: AppId[] = ['explorer', 'edge', 'store', 'vscode', 'terminal', 'tictactoe'];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const taskbarApps = Array.from(new Set([...pinnedApps, ...windows.map(w => w.appId)]));

  // Highly transparent / premium look
  const bgClass = isDark ? 'bg-[#1c1c1c]/75 border-white/5 text-gray-200' : 'bg-[#f3f3f3]/80 border-white/50 text-gray-800';
  const hoverClass = isDark ? 'hover:bg-white/10' : 'hover:bg-white/40';

  const containerClass = align === 'center' 
    ? 'absolute left-1/2 transform -translate-x-1/2' 
    : 'absolute right-0 pr-2';

  return (
    <div className={`absolute bottom-0 w-full h-12 backdrop-blur-xl border-t flex justify-between items-center px-3 z-50 transition-colors duration-300 ${bgClass}`}>
      
      {/* Widgets */}
      <div className={`hidden md:flex items-center gap-2 w-40 p-1 rounded-md cursor-pointer transition-all duration-200 active:scale-95 hover:shadow-sm opacity-0 md:opacity-100 ${hoverClass}`}>
        <div className="flex items-center gap-3 px-2">
             <CloudSun className="text-yellow-500 drop-shadow-sm" size={24} />
             <div className="leading-none">
               <span className="text-xs font-bold block opacity-90">26°C</span>
               <span className="text-[10px] block opacity-70">مشمس</span>
             </div>
        </div>
      </div>

      {/* Center/Start Apps */}
      <div className={`${containerClass} flex items-center gap-1.5 h-full py-1 transition-all duration-500 ease-in-out`}>
        <div 
          className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 flyout-trigger ${hoverClass} hover:-translate-y-1`}
          onClick={onStartClick}
          title="ابدأ"
        >
           <img src="https://img.icons8.com/color/48/000000/windows-11.png" alt="Start" className="w-6 h-6 drop-shadow-sm" />
        </div>
        
        {/* Search Button */}
        <div className={`hidden sm:flex w-10 h-10 rounded items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 hover:-translate-y-1 ${hoverClass}`} title="بحث">
             <Search size={20} className="opacity-80" />
        </div>

        {/* Task View */}
        <div className={`hidden sm:flex w-10 h-10 rounded items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 hover:-translate-y-1 ${hoverClass}`} title="طريقة عرض المهمة">
             <LayoutGrid size={20} className="opacity-80" />
        </div>

        <div className={`w-px h-6 ${isDark ? 'bg-white/10' : 'bg-black/10'} mx-1`}></div>

        {taskbarApps.map(appId => {
          const app = APPS[appId];
          if (!app) return null;
          const openWindow = windows.find(w => w.appId === appId);
          const isOpen = !!openWindow;
          const isActive = isOpen && openWindow.id === activeWindowId && !openWindow.isMinimized;
          
          return (
            <div 
              key={appId}
              className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer transition-all duration-200 relative group
                ${isOpen ? (isDark ? 'bg-white/5' : 'bg-white/40') : hoverClass}
                active:scale-90 hover:-translate-y-1
              `}
              onClick={() => onAppClick(appId)}
              onMouseEnter={() => setHoveredApp(appId)}
              onMouseLeave={() => setHoveredApp(null)}
            >
               {React.createElement(app.icon, { 
                 className: `${app.color} drop-shadow-md filter transition-all duration-200`, 
                 size: 24
               })}

               {/* Indicator */}
               {isOpen && (
                 <div 
                   className={`absolute bottom-1 rounded-full transition-all duration-300 shadow-sm
                     ${isActive ? 'w-3 bg-blue-400 h-1' : `w-1 h-1 ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`}
                   `}
                 ></div>
               )}

               {/* Hover Preview Tooltip */}
               {hoveredApp === appId && (
                   <div className={`absolute bottom-14 bg-[#2b2b2b]/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap z-[60] border border-[#444] animate-in fade-in slide-in-from-bottom-2 zoom-in-95`}>
                       {isOpen ? openWindow.title : app.name}
                       <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#2b2b2b]/90 border-b border-r border-[#444] rotate-45"></div>
                   </div>
               )}
            </div>
          );
        })}
      </div>

      {/* System Tray (Right) */}
      <div className="flex items-center justify-end w-40 gap-1 h-full">
          <div className={`hidden sm:flex p-1 rounded hover:bg-white/10 cursor-pointer transition-colors`}>
            <ChevronUp size={16} className="opacity-70" />
          </div>
          
          <div 
            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer h-8 transition-all active:scale-95 flyout-trigger ${hoverClass}`}
            onClick={onActionCenterClick}
            title="الإنترنت، الصوت، البطارية"
          >
            {isOnline ? <Wifi size={16} className="opacity-90" /> : <WifiOff size={16} className="opacity-90" />}
            <Volume2 size={16} className="opacity-90" />
            <div className="relative">
                {battery?.charging ? <BatteryCharging size={16} className="opacity-90" /> : <Battery size={16} className="opacity-90" />}
            </div>
          </div>

          <div 
            className={`flex flex-col items-end justify-center px-2 py-1 rounded-md cursor-pointer h-8 leading-none text-right transition-all active:scale-95 flyout-trigger ${hoverClass}`}
            onClick={onClockClick}
          >
            <span className="text-xs font-medium block mb-0.5 opacity-90">
              {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
            <span className="text-[10px] block opacity-70">
              {time.toLocaleDateString('ar-EG')}
            </span>
          </div>

          <div 
            className={`w-1.5 h-full ml-1 cursor-pointer opacity-0 hover:opacity-100 transition-opacity border-l border-white/10`}
            onClick={onMinimizeAll}
            title="إظهار سطح المكتب"
          ></div>
      </div>
    </div>
  );
};