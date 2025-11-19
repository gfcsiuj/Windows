import React, { useState } from 'react';
import { MenuItemConfig } from '../types';
import { ChevronLeft } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  items?: MenuItemConfig[];
  isDark?: boolean;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, isDark, onClose }) => {
  const bgClass = isDark ? 'bg-[#2b2b2b]/95 border-[#444] text-gray-200' : 'bg-[#f9f9f9]/95 border-gray-200 text-gray-800';
  
  // Boundary detection
  const menuWidth = 240;
  const menuHeight = items ? items.length * 36 : 300;
  const adjustX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div 
      className={`fixed backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border rounded-lg py-1.5 w-60 z-[9999] text-xs pointer-events-auto ${bgClass} animate-in fade-in zoom-in-95 duration-75`}
      style={{ top: adjustY, left: adjustX }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items && items.map((item, index) => (
        <MenuItem key={index} item={item} isDark={isDark} onClose={onClose} />
      ))}
    </div>
  );
};

const MenuItem = ({ item, isDark, onClose }: { item: MenuItemConfig, isDark?: boolean, onClose: () => void }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const hoverClass = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200';
  const separatorClass = isDark ? 'bg-gray-600' : 'bg-gray-300';

  if (item.separator) {
    return <div className={`h-px my-1 mx-2 ${separatorClass}`} />;
  }

  const handleClick = () => {
    if (item.action) {
      item.action();
      onClose();
    }
  };

  return (
    <div 
      className={`relative px-3 py-1.5 mx-1 rounded-md cursor-default flex items-center justify-between transition-colors group ${hoverClass} ${item.bold ? 'font-semibold' : ''} ${item.disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setShowSubmenu(true)}
      onMouseLeave={() => setShowSubmenu(false)}
    >
      <div className="flex items-center gap-3">
          {item.icon && <item.icon size={16} className="opacity-70" />}
          <span className={!item.icon ? 'mr-7' : ''}>{item.label}</span>
      </div>
      {item.hasSubmenu && <ChevronLeft size={12} className="opacity-50" />}

      {/* Submenu */}
      {item.hasSubmenu && showSubmenu && item.submenu && (
        <div 
          className={`absolute top-0 right-full mr-1 w-56 border rounded-lg py-1.5 shadow-xl ${isDark ? 'bg-[#2b2b2b] border-[#444]' : 'bg-[#f9f9f9] border-gray-200'}`}
        >
           {item.submenu.map((sub, i) => (
             <MenuItem key={i} item={sub} isDark={isDark} onClose={onClose} />
           ))}
        </div>
      )}
    </div>
  );
};