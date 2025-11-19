import React, { useState } from 'react';
import { APPS } from '../constants';
import { Search, Power, User } from 'lucide-react';
import { AppId } from '../types';

interface StartMenuProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
  onOpenApp: (appId: AppId) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, isDark, onClose, onOpenApp }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = Object.values(APPS).filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) && app.id !== 'bin'
  );

  const bgClass = isDark ? 'bg-[#202020]/95 border-[#333]' : 'bg-[#f3f3f3]/90 border-white/40';
  const textClass = isDark ? 'text-gray-100' : 'text-gray-800';
  const inputClass = isDark ? 'bg-[#333] border-[#444] text-white placeholder-gray-500' : 'bg-[#ffffff] border-gray-300/50 text-gray-800';
  const hoverClass = isDark ? 'hover:bg-white/10 active:bg-white/5' : 'hover:bg-white/50 active:bg-white/30';

  return (
    <div 
      id="start-menu"
      className={`flyout fixed left-1/2 bottom-14 transform -translate-x-1/2 w-[600px] h-[650px] backdrop-blur-xl border rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-[100] ${bgClass} ${textClass}
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search Bar */}
      <div className="p-6 pb-2">
        <div className="relative">
          <Search className="absolute right-4 top-3 opacity-50" size={16} />
          <input 
            type="text" 
            placeholder="البحث عن التطبيقات والإعدادات والمستندات" 
            className={`w-full border rounded-full py-2.5 pr-10 pl-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm shadow-sm transition ${inputClass}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Pinned Apps */}
      <div className="flex-1 p-8 pt-2 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4 px-2">
           <h3 className="text-xs font-bold opacity-80">مثبتة</h3>
           <button className={`text-xs opacity-70 px-2 py-1 rounded ${hoverClass}`}>كافة التطبيقات &gt;</button>
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          {filteredApps.map(app => (
            <div 
              key={app.id}
              className={`flex flex-col items-center gap-2 p-2 rounded cursor-pointer transition ${hoverClass}`}
              onClick={() => { onOpenApp(app.id as AppId); onClose(); }}
            >
               <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                 {React.createElement(app.icon, { size: 24, className: app.color })}
               </div>
               <span className="text-[11px] font-medium text-center truncate w-full opacity-90">{app.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`h-16 border-t flex justify-between items-center px-8 rounded-b-lg ${isDark ? 'bg-[#1e1e1e]/50 border-white/10' : 'bg-[#f3f3f3]/50 border-gray-200/50'}`}>
        <div className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${hoverClass}`}>
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
             AD
           </div>
           <span className="text-sm font-medium opacity-90">Admin</span>
        </div>
        <button 
          className={`p-2 rounded transition ${hoverClass}`} 
          onClick={() => window.location.reload()}
        >
          <Power size={18} className="opacity-70" />
        </button>
      </div>
    </div>
  );
};