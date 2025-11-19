import React from 'react';
import { RefreshCw, Monitor, Settings, Terminal, Trash, FolderPlus } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  type: 'desktop' | 'taskbar';
  isDark?: boolean;
  onRefresh: () => void;
  onPersonalize: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, type, isDark, onRefresh, onPersonalize }) => {
  const bgClass = isDark ? 'bg-[#2b2b2b]/95 border-[#444] text-gray-200' : 'bg-[#f9f9f9]/95 border-gray-200 text-gray-800';
  const hoverClass = 'hover:bg-blue-500 hover:text-white';

  return (
    <div 
      className={`fixed backdrop-blur shadow-xl border rounded-lg py-1 w-56 z-[9999] text-sm pointer-events-auto ${bgClass}`}
      style={{ top: y, left: x }}
    >
      {type === 'desktop' && (
        <>
          <MenuItem icon={Monitor} label="عرض" hoverClass={hoverClass} />
          <MenuItem icon={RefreshCw} label="تحديث" onClick={onRefresh} hoverClass={hoverClass} />
          <div className={`h-px my-1 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
          <MenuItem icon={FolderPlus} label="مجلد جديد" hoverClass={hoverClass} />
          <MenuItem icon={Terminal} label="فتح في Terminal" hoverClass={hoverClass} />
          <div className={`h-px my-1 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
          <MenuItem icon={Settings} label="تخصيص" onClick={onPersonalize} hoverClass={hoverClass} />
        </>
      )}
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, onClick, hoverClass }: any) => (
  <div 
    className={`px-4 py-1.5 cursor-pointer flex items-center gap-3 transition-colors ${hoverClass}`}
    onClick={onClick}
  >
    <Icon size={14} />
    <span>{label}</span>
  </div>
);