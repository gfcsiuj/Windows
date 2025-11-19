import React, { useState } from 'react';
import { Wifi, Bluetooth, Plane, Moon, Sun, Volume2, Settings, BatteryCharging, Eye } from 'lucide-react';
import { BatteryState } from '../types';

interface ActionCenterProps {
  isOpen: boolean;
  isDark?: boolean;
  toggleTheme?: () => void;
  nightLight?: boolean;
  setNightLight?: (enabled: boolean) => void;
  battery?: BatteryState;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ isOpen, isDark, toggleTheme, nightLight, setNightLight, battery }) => {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(60);
  
  // Toggles State
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  // Battery Saver removed in favor of Night Light to keep grid balanced, 
  // as Night Light is a functional prop passed from App.

  const bgClass = isDark ? 'bg-[#202020]/95 border-[#333] text-white' : 'bg-[#f3f3f3]/90 border-white/40 text-gray-800';
  const sliderTrackClass = isDark ? 'bg-[#444]' : 'bg-gray-300';

  return (
    <div 
      className={`flyout fixed left-4 bottom-14 w-80 backdrop-blur-xl border rounded-lg shadow-2xl p-4 transition-all duration-300 ease-in-out z-[100] ${bgClass}
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-3 gap-3 mb-6">
         <QuickToggle 
            icon={Wifi} label="Wi-Fi" 
            active={wifi} onClick={() => setWifi(!wifi)} 
            isDark={isDark} 
         />
         <QuickToggle 
            icon={Bluetooth} label="Bluetooth" 
            active={bluetooth} onClick={() => setBluetooth(!bluetooth)} 
            isDark={isDark} 
         />
         <QuickToggle 
            icon={Plane} label="طيران" 
            active={airplane} onClick={() => setAirplane(!airplane)} 
            isDark={isDark} 
         />
         <QuickToggle 
            icon={Eye} label="ضوء ليلي" 
            active={nightLight} onClick={() => setNightLight && setNightLight(!nightLight)} 
            isDark={isDark} 
         />
         <QuickToggle 
            icon={isDark ? Moon : Sun} label={isDark ? "داكن" : "فاتح"} 
            active={!!isDark} onClick={toggleTheme} 
            isDark={isDark} 
         />
         <div className={`aspect-[4/3] rounded-md flex flex-col items-center justify-center cursor-pointer transition ${isDark ? 'bg-[#333] hover:bg-[#444]' : 'bg-white/50 hover:bg-white/80'}`}>
            <Settings size={18} className="mb-1 opacity-80" />
            <span className="text-xs opacity-70">الإعدادات</span>
         </div>
      </div>

      <div className="space-y-6 mb-2">
         <SliderRow 
            icon={Sun} value={brightness} setValue={setBrightness} 
            isDark={isDark} trackClass={sliderTrackClass} 
         />
         <SliderRow 
            icon={Volume2} value={volume} setValue={setVolume} 
            isDark={isDark} trackClass={sliderTrackClass} 
         />
      </div>
      
      {battery && (
        <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs opacity-70">
           <span>{battery.level.toFixed(0)}% {battery.charging ? '(جاري الشحن)' : ''}</span>
           <div className="flex items-center gap-2">
               <Settings size={14} className="cursor-pointer hover:opacity-100" />
               <span>تحرير</span>
           </div>
        </div>
      )}
    </div>
  );
};

const QuickToggle = ({ icon: Icon, label, active, onClick, isDark }: any) => {
  const baseClass = isDark ? 'bg-[#333] hover:bg-[#444] text-white' : 'bg-white/50 hover:bg-white/80 text-gray-800';
  const activeClass = 'bg-blue-500 text-white shadow-sm hover:bg-blue-600';

  return (
    <div 
      className={`aspect-[4/3] rounded-md flex flex-col items-center justify-center cursor-pointer transition border border-transparent duration-200
        ${active ? activeClass : baseClass}
      `}
      onClick={onClick}
    >
      <Icon size={18} className="mb-1" fill={active && label !== 'Wi-Fi' && label !== 'Bluetooth' ? "currentColor" : "none"} />
      <span className="text-xs font-medium select-none">{label}</span>
    </div>
  );
};

const SliderRow = ({ icon: Icon, value, setValue, isDark, trackClass }: any) => (
    <div className="flex items-center gap-3">
        <Icon className="opacity-70" size={18} />
        <div className={`relative flex-1 h-1 ${trackClass} rounded-full group`}>
            {/* Fill */}
            <div 
                className="absolute top-0 right-0 h-full bg-blue-500 rounded-full" 
                style={{ width: `${value}%` }}
            ></div>
            {/* Input */}
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={value} 
                onChange={(e) => setValue(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
             {/* Knob (visible on hover usually, but we keep simple) */}
             <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ right: `calc(${value}% - 8px)` }}
             ></div>
        </div>
    </div>
);