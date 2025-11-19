import React, { useState } from 'react';
import { Wifi, Bluetooth, Plane, Moon, Sun, Volume2, Settings } from 'lucide-react';

interface ActionCenterProps {
  isOpen: boolean;
  isDark?: boolean;
  toggleTheme?: () => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ isOpen, isDark, toggleTheme }) => {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(60);

  const bgClass = isDark ? 'bg-[#202020]/95 border-[#333] text-white' : 'bg-[#f3f3f3]/90 border-white/40 text-gray-800';
  const sliderClass = isDark ? 'bg-[#444]' : 'bg-gray-300';

  return (
    <div 
      className={`flyout fixed left-4 bottom-14 w-80 backdrop-blur-xl border rounded-lg shadow-2xl p-4 transition-all duration-300 ease-in-out z-[100] ${bgClass}
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-3 gap-3 mb-6">
         <QuickToggle icon={Wifi} label="Wi-Fi" active={true} isDark={isDark} />
         <QuickToggle icon={Bluetooth} label="Bluetooth" active={true} isDark={isDark} />
         <QuickToggle icon={Plane} label="طيران" active={false} isDark={isDark} />
         <QuickToggle icon={isDark ? Sun : Moon} label={isDark ? "نهاري" : "ليلي"} active={!!isDark} onClick={toggleTheme} isDark={isDark} />
         <div className={`aspect-[4/3] rounded-md flex flex-col items-center justify-center cursor-pointer transition ${isDark ? 'bg-[#333] hover:bg-[#444]' : 'bg-white/50 hover:bg-white/80'}`}>
            <Settings size={18} className="mb-1 opacity-80" />
            <span className="text-xs opacity-70">الإعدادات</span>
         </div>
      </div>

      <div className="space-y-6 mb-2">
         <div className="flex items-center gap-3">
            <Sun className="opacity-70" size={16} />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={brightness} 
              onChange={(e) => setBrightness(Number(e.target.value))}
              className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-blue-500 ${sliderClass}`} 
            />
         </div>
         <div className="flex items-center gap-3">
            <Volume2 className="opacity-70" size={16} />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-blue-500 ${sliderClass}`} 
            />
         </div>
      </div>
    </div>
  );
};

const QuickToggle = ({ icon: Icon, label, active, onClick, isDark }: any) => {
  const [isActive, setIsActive] = useState(active);
  
  const handleClick = () => {
      if (onClick) onClick();
      else setIsActive(!isActive);
  };

  const baseClass = isDark ? 'bg-[#333] hover:bg-[#444] text-white' : 'bg-white/50 hover:bg-white/80 text-gray-800';
  const activeClass = 'bg-blue-500 text-white shadow-sm';

  return (
    <div 
      className={`aspect-[4/3] rounded-md flex flex-col items-center justify-center cursor-pointer transition border border-transparent
        ${(onClick ? active : isActive) ? activeClass : baseClass}
      `}
      onClick={handleClick}
    >
      <Icon size={18} className="mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};