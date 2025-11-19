import React, { useState, useEffect } from 'react';
import { AppId, WindowState } from '../types';
import { APPS } from '../constants';
import { Wifi, Volume2, Battery, ChevronUp, CloudSun } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  isDark: boolean;
  onAppClick: (appId: string) => void;
  onStartClick: () => void;
  onActionCenterClick: () => void;
  onClockClick: () => void;
  onMinimizeAll: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  windows, activeWindowId, isDark, onAppClick, onStartClick, onActionCenterClick, onClockClick, onMinimizeAll 
}) => {
  const [time, setTime] = useState(new Date());
  
  const pinnedApps: AppId[] = ['explorer', 'edge', 'store', 'vscode', 'media'];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const taskbarApps = Array.from(new Set([...pinnedApps, ...windows.map(w => w.appId)]));

  const bgClass = isDark ? 'bg-[#202020]/85 border-white/10 text-gray-200' : 'bg-[#f3f3f3]/85 border-white/50 text-gray-800';
  const hoverClass = isDark ? 'hover:bg-white/10' : 'hover:bg-white/40';

  return (
    <div className={`absolute bottom-0 w-full h-12 backdrop-blur-md border-t flex justify-between items-center px-3 z-50 transition-colors duration-300 ${bgClass}`}>
      
      {/* Widgets (Left) */}
      <div className={`hidden md:flex items-center gap-2 w-1/4 p-1 rounded cursor-pointer transition ${hoverClass}`}>
        <CloudSun className="text-yellow-500" size={24} />
        <div className="leading-none">
          <span className="text-xs font-bold block opacity-90">26°C</span>
          <span className="text-[10px] block opacity-70">غائم جزئياً</span>
        </div>
      </div>

      {/* Center Apps */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 h-full py-1">
        <div 
          className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 flyout-trigger ${hoverClass}`}
          onClick={onStartClick}
        >
           <img src="https://img.icons8.com/color/48/000000/windows-11.png" alt="Start" className="w-6 h-6" />
        </div>

        {taskbarApps.map(appId => {
          const app = APPS[appId];
          if (!app) return null;
          const isOpen = windows.some(w => w.appId === appId);
          const isActive = windows.some(w => w.appId === appId && w.id === activeWindowId && !w.isMinimized);
          const isMinimized = windows.some(w => w.appId === appId && w.isMinimized);
          
          return (
            <div 
              key={appId}
              className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer transition-all duration-200 relative
                ${isOpen ? (isDark ? 'bg-white/10' : 'bg-white/30') : hoverClass}
                ${isActive ? (isDark ? 'bg-white/20 border-b-2 border-blue-400' : 'bg-white/40 border-b-2 border-blue-500') : ''}
                active:scale-95
              `}
              onClick={() => onAppClick(appId)}
            >
               {React.createElement(app.icon, { 
                 className: `${app.color}`, 
                 size: 22 
               })}
               {isOpen && (
                 <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isDark ? 'bg-gray-300' : 'bg-gray-500'} ${isMinimized ? 'w-3 transition-all' : ''}`}></div>
               )}
            </div>
          );
        })}
      </div>

      {/* System Tray (Right) */}
      <div className="flex items-center justify-end w-1/4 gap-2 h-full">
          <div className={`hidden sm:flex p-1 rounded cursor-pointer ${hoverClass}`}>
            <ChevronUp size={16} className="opacity-70" />
          </div>
          
          <div 
            className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer h-5/6 transition flyout-trigger ${hoverClass}`}
            onClick={onActionCenterClick}
          >
            <Wifi size={16} className="opacity-90" />
            <Volume2 size={16} className="opacity-90" />
            <Battery size={16} className="opacity-90" />
          </div>

          <div 
            className={`flex flex-col items-end justify-center px-2 py-1 rounded cursor-pointer h-5/6 leading-none text-right transition flyout-trigger ${hoverClass}`}
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
            className={`w-1 h-full ml-1 cursor-pointer opacity-50 hover:opacity-100 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}
            onClick={onMinimizeAll}
            title="إظهار سطح المكتب"
          ></div>
      </div>
    </div>
  );
};