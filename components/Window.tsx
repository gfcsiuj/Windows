import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Copy } from 'lucide-react';
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
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0, startWinX: 0, startWinY: 0, dir: '' });

  // Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.isMaximized || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - state.position.x,
      y: e.clientY - state.position.y
    };
    onFocus();
  };

  // Resizing
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeRef.current.startX;
        const deltaY = e.clientY - resizeRef.current.startY;
        const { startW, startH, startWinX, startWinY, dir } = resizeRef.current;

        let newW = startW;
        let newH = startH;
        let newX = startWinX;
        let newY = startWinY;

        if (dir.includes('e')) newW = Math.max(300, startW + deltaX);
        if (dir.includes('s')) newH = Math.max(200, startH + deltaY);
        if (dir.includes('w')) {
            newW = Math.max(300, startW - deltaX);
            newX = startWinX + (startW - newW); // If width didn't change due to min-width, X shouldn't change
            if (newW === 300) newX = startWinX + (startW - 300);
        }
        if (dir.includes('n')) {
            newH = Math.max(200, startH - deltaY);
            newY = startWinY + (startH - newH);
            if (newH === 200) newY = startWinY + (startH - 200);
        }

        onResize(newW, newH, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, onMove, onResize]);

  if (state.isMinimized) return null;

  const style: React.CSSProperties = state.isMaximized 
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', borderRadius: 0 }
    : { 
        top: state.position.y, 
        left: state.position.x, 
        width: state.size.width, 
        height: state.size.height 
      };

  const activeClass = isActive ? 'shadow-[0_10px_50px_rgba(0,0,0,0.4)] opacity-100' : 'shadow-[0_5px_20px_rgba(0,0,0,0.1)] opacity-95';
  const themeClass = isDark ? 'bg-[#202020] border-[#333]' : 'bg-[#f9f9f9] border-gray-300/50';

  return (
    <div 
      className={`absolute flex flex-col overflow-visible transition-[opacity,box-shadow] duration-100 ease-linear pointer-events-auto 
                 ${state.isMaximized ? '' : 'rounded-lg border'} ${activeClass} ${themeClass}`}
      style={{ ...style, zIndex: state.zIndex }}
      onMouseDown={onFocus}
    >
      {/* Resize Handles - Only show if not maximized */}
      {!state.isMaximized && (
          <>
            <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'n')}></div>
            <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-50" onMouseDown={(e) => handleResizeDown(e, 's')}></div>
            <div className="absolute top-0 left-0 h-full w-1 cursor-w-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'w')}></div>
            <div className="absolute top-0 right-0 h-full w-1 cursor-e-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'e')}></div>
            <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'nw')}></div>
            <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'ne')}></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'sw')}></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50" onMouseDown={(e) => handleResizeDown(e, 'se')}></div>
          </>
      )}

      {/* Title Bar */}
      <div 
        className={`h-9 flex justify-between items-center select-none shrink-0 rounded-t-lg relative z-10
            ${isDark ? 'bg-[#2b2b2b] text-gray-300' : 'bg-[#f3f3f3] text-gray-700'}
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-3 px-3 text-xs font-semibold pointer-events-none">
          {app.icon && React.createElement(app.icon, { size: 14, className: app.color })}
          <span>{state.title}</span>
        </div>
        <div className="flex flex-row-reverse h-full">
          <button 
            className="w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors rounded-tr-lg"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            <X size={14} />
          </button>
          <button 
            className={`w-12 flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
          >
            {state.isMaximized ? <Copy size={12} /> : <Square size={12} />}
          </button>
          <button 
            className={`w-12 flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          >
            <Minus size={14} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className={`flex-1 relative overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
        {children}
      </div>
    </div>
  );
};