import React from 'react';
import { APPS } from '../constants';
import { AppId } from '../types';

interface DesktopIconProps {
  appId: AppId;
  name: string;
  onOpen: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ appId, name, onOpen }) => {
  const app = APPS[appId];
  if (!app) return null;

  return (
    <div 
      className="w-24 flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 cursor-pointer border border-transparent hover:border-white/10 group transition-colors"
      onDoubleClick={onOpen}
    >
      <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg shadow-sm group-hover:bg-white/20 transition-colors backdrop-blur-sm">
         {React.createElement(app.icon, { className: app.color, size: 32 })}
      </div>
      <span className="text-xs text-center text-white drop-shadow-md font-medium line-clamp-2 px-1 leading-tight select-none" style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>
        {name}
      </span>
    </div>
  );
};