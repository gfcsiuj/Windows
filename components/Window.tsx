import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Copy, LayoutTemplate } from 'lucide-react';
import { WindowState, AppConfig } from '../types';

interface WindowProps {
  state: WindowState;
  isActive: boolean;
  isDark: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number, x: number, y: number) => void;
  app: AppConfig;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ 
  state, isActive, isDark, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, app, children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0, startWinX: 0, startWinY: 0, dir: '' });
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
      const timer = setTimeout(() => setIsOpening(false), 200);
      return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.isMaximized || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - state.position.x,
      y: e.clientY - state.position.y
    };
    onFocus();
  };

  const handleResizeDown = (e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    onFocus();
    resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: state.size.width,
        startH: state.size.height,
        startWinX: state.position.x,
        startWinY: state.position.y,
        dir
    };
  };

  const handleSnapHover = (isEnter: boolean) => {
    if (isEnter) {
      snapTimerRef.current = setTimeout(() => setShowSnapMenu(true), 600);
    } else {
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      setTimeout(() => {
        const menu = document.getElementById(`snap-menu-${state.id}`);
        if (!menu?.matches(':hover')) {
            setShowSnapMenu(false);
        }
      }, 200);
    }
  };

  const executeSnap = (type: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'full') => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight - 48; 
    
    let newW = screenW / 2;
    let newH = screenH;
    let newX = 0;
    let newY = 0;

    switch (type) {
        case 'left': newW = screenW / 2; newH = screenH; newX = 0; newY = 0; break;
        case 'right': newW = screenW / 2; newH = screenH; newX = screenW / 2; newY = 0; break;
        case 'top-left': newW = screenW / 2; newH = screenH / 2; newX = 0; newY = 0; break;
        case 'top-right': newW = screenW / 2; newH = screenH / 2; newX = screenW / 2; newY = 0; break;
        case 'bottom-left': newW = screenW / 2; newH = screenH / 2; newX = 0; newY = screenH / 2; break;
        case 'bottom-right': newW = screenW / 2; newH = screenH / 2; newX = screenW / 2; newY = screenH / 2; break;
    }
    
    if (state.isMaximized) onMaximize();
    onResize(newW, newH, newX, newY);
    setShowSnapMenu(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeRef.current.startX;
        const deltaY = e.clientY - resizeRef.current.startY;
        const { startW, startH, startWinX, startWinY, dir } = resizeRef.current;
        let newW = startW, newH = startH, newX = startWinX, newY = startWinY;
        const MIN_W = 300, MIN_H = 300;

        if (dir.includes('e')) newW = Math.max(MIN_W, startW + deltaX);
        if (dir.includes('s')) newH = Math.max(MIN_H, startH + deltaY);
        if (dir.includes('w')) {
            const proposedW = startW - deltaX;
            if (proposedW >= MIN_W) { newW = proposedW; newX = startWinX + deltaX; }
        }
        if (dir.includes('n')) {
            const proposedH = startH - deltaY;
            if (proposedH >= MIN_H) { newH = proposedH; newY = startWinY + deltaY; }
        }
        onResize(newW, newH, newX, newY);
      }
    };
    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, onMove, onResize]);

  const style: React.CSSProperties = state.isMaximized 
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', borderRadius: 0, border: 'none' }
    : { 
        top: state.position.y, 
        left: state.position.x, 
        width: state.size.width, 
        height: state.size.height,
        transform: state.isMinimized ? 'scale(0.8) translateY(300px)' : 'scale(1) translateY(0)',
        opacity: state.isMinimized ? 0 : 1
      };

  const activeShadow = isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'shadow-[0_4px_15px_rgba(0,0,0,0.15)]';
  const activeBorder = isDark ? (isActive ? 'border-[#555]/50' : 'border-[#333]/30') : (isActive ? 'border-white/60' : 'border-white/30');
  // Premium Glassmorphism: Higher blur, noise texture simulation via bg opacity
  const baseBg = isDark ? 'bg-[#1c1c1c]/85 backdrop-blur-2xl' : 'bg-[#f9f9f9]/85 backdrop-blur-2xl';
  const titleBarBg = 'bg-transparent'; // Let the blur shine through

  if (state.isMinimized && !isActive) return null;

  return (
    <div 
      className={`absolute flex flex-col overflow-visible transition-[width,height,transform,opacity] duration-200 ease-out pointer-events-auto 
                 ${state.isMaximized ? '' : 'rounded-xl border'} ${activeShadow} ${activeBorder} ${baseBg}
                 ${isOpening ? 'animate-window-open' : ''} ring-1 ring-white/5
                 `}
      style={{ ...style, zIndex: state.zIndex }}
      onMouseDown={onFocus}
    >
      {!state.isMaximized && (
          <>
            <div className="absolute -top-1 left-0 w-full h-2 cursor-n-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'n')}></div>
            <div className="absolute -bottom-1 left-0 w-full h-2 cursor-s-resize z-50" onMouseDown={(e) => handleResizeDown(e, 's')}></div>
            <div className="absolute top-0 -left-1 h-full w-2 cursor-w-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'w')}></div>
            <div className="absolute top-0 -right-1 h-full w-2 cursor-e-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'e')}></div>
            <div className="absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'nw')}></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 cursor-ne-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'ne')}></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 cursor-sw-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'sw')}></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'se')}></div>
          </>
      )}

      <div 
        className={`h-10 flex justify-between items-center select-none shrink-0 transition-colors duration-200
            ${state.isMaximized ? '' : 'rounded-t-xl'} ${titleBarBg}
            ${isActive ? 'text-opacity-100' : 'text-opacity-50'}
            border-b border-white/5
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className={`flex items-center gap-3 px-4 text-xs font-semibold pointer-events-none ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {app.icon && React.createElement(app.icon, { size: 14, className: app.color })}
          <span className="font-medium tracking-wide">{state.title}</span>
        </div>

        <div className="flex flex-row-reverse h-full items-start px-2 pt-1 gap-1">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#e81123] group transition-all rounded-md" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <X size={14} className={`group-hover:text-white ${isDark ? 'text-white' : 'text-black'}`} />
          </button>

          <div className="relative" onMouseEnter={() => handleSnapHover(true)} onMouseLeave={() => handleSnapHover(false)}>
              <button className={`w-8 h-8 flex items-center justify-center transition-all rounded-md ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-black'}`} onClick={(e) => { e.stopPropagation(); onMaximize(); }}>
                {state.isMaximized ? <Copy size={12} /> : <Square size={12} />}
              </button>
              {showSnapMenu && !state.isMaximized && (
                  <div id={`snap-menu-${state.id}`} className={`absolute top-9 right-[-40px] w-52 p-2 rounded-lg shadow-xl backdrop-blur-2xl border animate-in fade-in zoom-in-95 z-[100] ${isDark ? 'bg-[#202020]/90 border-gray-600' : 'bg-[#f3f3f3]/90 border-gray-300'}`} onClick={(e) => e.stopPropagation()}>
                     <div className="grid grid-cols-2 gap-2">
                        <div className="flex gap-1 h-12 cursor-pointer group">
                            <div className={`w-1/2 h-full border rounded-l ${isDark ? 'border-gray-500 bg-gray-600 group-hover:bg-blue-500' : 'border-gray-400 bg-gray-300 group-hover:bg-blue-500'}`} onClick={() => executeSnap('left')}></div>
                            <div className={`w-1/2 h-full border rounded-r ${isDark ? 'border-gray-500 bg-gray-600 group-hover:bg-blue-500' : 'border-gray-400 bg-gray-300 group-hover:bg-blue-500'}`} onClick={() => executeSnap('right')}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-0.5 h-12 w-full cursor-pointer group">
                            <div className={`border rounded-tl ${isDark ? 'border-gray-500 bg-gray-600 group-hover:bg-blue-500' : 'border-gray-400 bg-gray-300 group-hover:bg-blue-500'}`} onClick={() => executeSnap('top-left')}></div>
                            <div className={`border rounded-tr ${isDark ? 'border-gray-500 bg-gray-600 group-hover:bg-blue-500' : 'border-gray-400 bg-gray-300 group-hover:bg-blue-500'}`} onClick={() => executeSnap('top-right')}></div>
                            <div className={`border rounded-bl ${isDark ? 'border-gray-500 bg-gray-600 group-hover:bg-blue-500' : 'border-gray-400 bg-gray-300 group-hover:bg-blue-500'}`} onClick={() => executeSnap('bottom-left')}></div>
                            <div className={`border rounded-br ${isDark ? 'border-gray-500 bg-gray-600 group-hover:bg-blue-500' : 'border-gray-400 bg-gray-300 group-hover:bg-blue-500'}`} onClick={() => executeSnap('bottom-right')}></div>
                        </div>
                     </div>
                  </div>
              )}
          </div>

          <button className={`w-8 h-8 flex items-center justify-center transition-all rounded-md ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-black'}`} onClick={(e) => { e.stopPropagation(); onMinimize(); }}>
            <Minus size={14} />
          </button>
        </div>
      </div>
      
      <div className={`flex-1 relative overflow-hidden ${isDark ? 'bg-[#1a1a1a]/90' : 'bg-white/95'} rounded-b-xl`}>
        {children}
      </div>
    </div>
  );
};