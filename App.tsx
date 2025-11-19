import React, { useState, useEffect } from 'react';
import { APPS, INITIAL_FILE_SYSTEM } from './constants';
import { WindowState, AppId, FileSystem } from './types';
import { Taskbar } from './components/Taskbar';
import { DesktopIcon } from './components/DesktopIcon';
import { Window } from './components/Window';
import { StartMenu } from './components/StartMenu';
import { ActionCenter } from './components/ActionCenter';
import { CalendarFlyout } from './components/CalendarFlyout';
import { ContextMenu } from './components/ContextMenu';
import { ArrowRight, User, Lock } from 'lucide-react';

type SystemState = 'boot' | 'lock' | 'login' | 'desktop';

export default function App() {
  // System State
  const [systemState, setSystemState] = useState<SystemState>('boot');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Desktop State
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Flyouts state
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [actionCenterOpen, setActionCenterOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // File System State (Persistent)
  const [fileSystem, setFileSystem] = useState<FileSystem>(() => {
    const saved = localStorage.getItem('win11_fs');
    return saved ? JSON.parse(saved) : INITIAL_FILE_SYSTEM;
  });
  
  const [wallpaper, setWallpaper] = useState(() => {
     return localStorage.getItem('win11_wallpaper') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564';
  });

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, type: 'desktop' | 'taskbar' | null} | null>(null);

  // Boot Sequence
  useEffect(() => {
    const savedTheme = localStorage.getItem('win11_theme');
    if (savedTheme === 'dark') setIsDarkMode(true);

    setTimeout(() => setSystemState('lock'), 2500);
  }, []);

  // Persist Files & Settings
  useEffect(() => {
    localStorage.setItem('win11_fs', JSON.stringify(fileSystem));
  }, [fileSystem]);

  useEffect(() => {
    localStorage.setItem('win11_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogin = () => {
    // Simple login simulation
    if (password.length > 0) { // Any password works for demo
        setSystemState('desktop');
    } else {
        setLoginError(true);
    }
  };

  const openWindow = (appId: AppId, contentProps?: any) => {
    const app = APPS[appId];
    const existingWindow = windows.find(w => w.appId === appId);
    
    // Single instance apps
    if (existingWindow && (appId === 'settings' || appId === 'store')) {
      restoreWindow(existingWindow.id);
      return;
    }

    const newWindow: WindowState = {
      id: `win-${Date.now()}`,
      appId,
      title: contentProps?.title || app.name,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter + 1,
      position: { x: 50 + (windows.length * 30) % 200, y: 50 + (windows.length * 30) % 200 },
      size: { width: app.defaultWidth || 800, height: app.defaultHeight || 600 },
      contentProps
    };

    setZIndexCounter(prev => prev + 1);
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    closeFlyouts();
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const restoreWindow = (id: string) => {
    setZIndexCounter(prev => prev + 1);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 } : w));
    setActiveWindowId(id);
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const focusWindow = (id: string) => {
    if (activeWindowId === id) return;
    setZIndexCounter(prev => prev + 1);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false } : w));
    setActiveWindowId(id);
  };

  const updateWindowPosition = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => {
        if (w.id !== id) return w;
        // Snapping Logic
        let newSize = w.size;
        let newPos = { x, y };
        let isMaximized = w.isMaximized;
        
        // Snap Left (RTL means Right in visual, but logic relies on coordinates)
        // Assuming standard viewport coordinates: 0 is left edge
        if (x <= 0) {
            newPos = { x: 0, y: 0 };
            newSize = { width: window.innerWidth / 2, height: window.innerHeight - 48 };
        } 
        // Snap Right
        else if (x >= window.innerWidth - w.size.width) {
            newPos = { x: window.innerWidth / 2, y: 0 };
            newSize = { width: window.innerWidth / 2, height: window.innerHeight - 48 };
        }

        return { ...w, position: newPos, size: newSize, isMaximized };
    }));
  };

  const updateWindowSize = (id: string, width: number, height: number, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height }, position: { x, y } } : w));
  };

  const closeFlyouts = () => {
    setStartMenuOpen(false);
    setActionCenterOpen(false);
    setCalendarOpen(false);
    setContextMenu(null);
  };

  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
    setActionCenterOpen(false);
    setCalendarOpen(false);
  };
  
  const toggleActionCenter = () => {
    setActionCenterOpen(prev => !prev);
    setStartMenuOpen(false);
    setCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setCalendarOpen(prev => !prev);
    setStartMenuOpen(false);
    setActionCenterOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'desktop' | 'taskbar') => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type });
  };

  // --- Render Stages ---

  if (systemState === 'boot') {
      return (
          <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
              <div className="mb-8">
                <img src="https://img.icons8.com/color/96/000000/windows-11.png" alt="Logo" className="w-24 h-24 animate-pulse" />
              </div>
              <div className="w-8 h-8 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
      );
  }

  if (systemState === 'lock') {
      return (
          <div 
            className="h-screen w-screen bg-cover bg-center flex flex-col items-center pt-32 text-white transition-all duration-500"
            style={{ backgroundImage: `url(${wallpaper})` }}
            onClick={() => setSystemState('login')}
          >
             <div className="text-8xl font-light mb-4">
                 {new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: false})}
             </div>
             <div className="text-3xl font-medium">
                 {new Date().toLocaleDateString('ar-EG', {weekday: 'long', day: 'numeric', month: 'long'})}
             </div>
          </div>
      );
  }

  if (systemState === 'login') {
    return (
        <div 
          className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center backdrop-blur-xl"
          style={{ backgroundImage: `url(${wallpaper})` }}
        >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>
            <div className="z-10 flex flex-col items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white/20 shadow-lg">
                    <User size={64} className="text-gray-500" />
                </div>
                <div className="text-2xl font-bold text-white">Admin</div>
                <div className="flex flex-col gap-2 w-64">
                    <div className="flex bg-black/30 backdrop-blur-sm rounded border-b-2 border-white/50 focus-within:border-blue-400 transition">
                        <input 
                            type="password" 
                            placeholder="كلمة المرور (أكتب أي شيء)"
                            className="flex-1 bg-transparent text-white px-3 py-2 outline-none placeholder-gray-300 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            autoFocus
                        />
                        <button className="px-3 hover:bg-white/10" onClick={handleLogin}>
                            <ArrowRight className="text-white" size={20} />
                        </button>
                    </div>
                    {loginError && <span className="text-xs text-red-300 font-bold">كلمة المرور غير صحيحة</span>}
                </div>
                <div 
                    className="mt-8 flex items-center gap-2 text-white/80 hover:text-white cursor-pointer text-sm"
                    onClick={() => setSystemState('lock')}
                >
                    <Lock size={14} />
                    <span>خيارات تسجيل الدخول</span>
                </div>
            </div>
        </div>
    );
  }

  // Desktop
  return (
    <div 
      className={`h-screen w-screen overflow-hidden relative text-sm select-none ${isDarkMode ? 'dark' : ''}`}
      onClick={(e) => {
        if (contextMenu) setContextMenu(null);
        if (!(e.target as HTMLElement).closest('.flyout-trigger') && !(e.target as HTMLElement).closest('.flyout')) {
          closeFlyouts();
        }
      }}
      onContextMenu={(e) => handleContextMenu(e, 'desktop')}
    >
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
      <div className="absolute inset-0 bg-black/0 dark:bg-black/20 pointer-events-none transition-colors duration-300"></div>

      {/* Desktop Icons */}
      <div className="absolute top-0 right-0 h-[calc(100%-48px)] w-full p-2 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 content-start items-start justify-start" style={{direction: 'rtl'}}>
         <DesktopIcon appId="bin" name="سلة المحذوفات" onOpen={() => openWindow('bin')} />
         <DesktopIcon appId="explorer" name="هذا الكمبيوتر" onOpen={() => openWindow('explorer')} />
         <DesktopIcon appId="edge" name="Edge" onOpen={() => openWindow('edge')} />
         <DesktopIcon appId="store" name="المتجر" onOpen={() => openWindow('store')} />
         <DesktopIcon appId="media" name="ميديا بلاير" onOpen={() => openWindow('media')} />
      </div>

      {/* Windows Area */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {windows.map(win => (
          <Window 
            key={win.id}
            state={win}
            isActive={activeWindowId === win.id}
            isDark={isDarkMode}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMove={(x, y) => updateWindowPosition(win.id, x, y)}
            onResize={(w, h, x, y) => updateWindowSize(win.id, w, h, x, y)}
            app={APPS[win.appId]}
          >
            {React.createElement(APPS[win.appId].component, { 
                windowId: win.id, 
                contentProps: win.contentProps,
                fs: fileSystem,
                setFs: setFileSystem,
                isDark: isDarkMode,
                toggleTheme: toggleTheme
            })}
          </Window>
        ))}
      </div>

      {/* Flyouts */}
      <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} onOpenApp={openWindow} isDark={isDarkMode} />
      <ActionCenter isOpen={actionCenterOpen} isDark={isDarkMode} toggleTheme={toggleTheme} />
      <CalendarFlyout isOpen={calendarOpen} isDark={isDarkMode} />

      {/* Taskbar */}
      <Taskbar 
        windows={windows}
        activeWindowId={activeWindowId}
        isDark={isDarkMode}
        onAppClick={(appId) => {
          const openApp = windows.find(w => w.appId === appId);
          if (openApp) {
            if (openApp.isMinimized || activeWindowId !== openApp.id) {
              restoreWindow(openApp.id);
            } else {
              minimizeWindow(openApp.id);
            }
          } else {
            openWindow(appId as AppId);
          }
        }}
        onStartClick={toggleStartMenu}
        onActionCenterClick={toggleActionCenter}
        onClockClick={toggleCalendar}
        onMinimizeAll={() => windows.forEach(w => minimizeWindow(w.id))}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          type={contextMenu.type} 
          isDark={isDarkMode}
          onRefresh={() => window.location.reload()}
          onPersonalize={() => openWindow('settings')}
        />
      )}
    </div>
  );
}