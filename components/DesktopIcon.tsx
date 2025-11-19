import React, { useState, useEffect, useRef } from 'react';
import { APPS } from '../constants';
import { IconPosition, ViewMode, AppId, DesktopItem } from '../types';
import { FileText, Folder } from 'lucide-react';

interface DesktopIconProps {
  item: DesktopItem;
  selected: boolean;
  isDragging: boolean;
  viewMode: ViewMode;
  renaming: boolean;
  onOpen: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onRename: (newName: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  item, selected, isDragging, viewMode, renaming, onOpen, onMouseDown, onContextMenu, onRename 
}) => {
  const [nameInput, setNameInput] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  const handleRenameSubmit = () => {
    if (nameInput.trim()) onRename(nameInput);
    else setNameInput(item.name); // Revert if empty
  };

  // Resolve Icon
  let IconComponent;
  let iconColor = 'text-blue-500';

  if (item.type === 'app' && item.appId && APPS[item.appId]) {
    IconComponent = APPS[item.appId].icon;
    iconColor = APPS[item.appId].color;
  } else if (item.type === 'folder') {
    IconComponent = Folder;
    iconColor = 'text-yellow-400 fill-yellow-400';
  } else {
    IconComponent = FileText;
    iconColor = 'text-gray-500';
  }

  // Size logic
  const sizeMap = {
    small: { width: 'w-20', icon: 32, text: 'text-[11px]' },
    medium: { width: 'w-24', icon: 48, text: 'text-[12px]' },
    large: { width: 'w-32', icon: 64, text: 'text-[13px]' }
  };
  const dims = sizeMap[viewMode];

  return (
    <div 
      className={`absolute flex flex-col items-center gap-1 p-1 border border-transparent transition-colors duration-75 pointer-events-auto rounded-[3px]
        ${dims.width}
        ${selected && !renaming
            ? 'bg-[#cee5fd]/40 border-[#9ec9f8]/40 dark:bg-white/10 dark:border-white/10' 
            : 'hover:bg-white/5 hover:border-white/5'
        }
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      style={{ 
          right: item.position.x, 
          top: item.position.y,
          cursor: 'default' 
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={(e) => {
          e.stopPropagation();
          onOpen();
      }}
      onContextMenu={onContextMenu}
    >
      <div className={`flex items-center justify-center transition-transform active:scale-95 pointer-events-none h-fit`}>
         {IconComponent && <IconComponent className={`${iconColor} drop-shadow-md`} size={dims.icon} strokeWidth={1.5} />}
      </div>
      
      {renaming ? (
        <input 
          ref={inputRef}
          type="text"
          className="w-full text-center text-black text-xs px-0.5 py-0.5 outline-none border border-blue-500 bg-white z-50 shadow-md"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span 
          className={`${dims.text} text-center text-white line-clamp-2 px-1 leading-tight select-none mt-0.5
             ${selected ? '' : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'}
          `}
          style={{ textShadow: selected ? 'none' : '0 1px 2px rgba(0,0,0,0.8)' }}
        >
          {item.name}
        </span>
      )}
    </div>
  );
};