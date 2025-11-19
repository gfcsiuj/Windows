import React, { useState, useEffect, useCallback } from 'react';
import { APPS } from './constants';
import { WindowState, AppId, RecentFile, ToastNotification } from './types';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { Desktop } from './components/Desktop';
import { StartMenu } from './components/StartMenu';
import { ActionCenter } from './components/ActionCenter';
import { CalendarFlyout } from './components/CalendarFlyout';
import { useFileSystem } from './hooks/useFileSystem';
import { ArrowRight, User, Lock, X, Play } from 'lucide-react';

type SystemState = 'boot' | 'lock' | 'login' | 'desktop' | 'shutdown' | 'bsod';

export default function App() {
  // --- System State ---
  const [systemState, setSystemState] = useState<SystemState>('boot');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [wallpaper, setWallpaper] = useState(() => {
     return localStorage.getItem('win11_wallpaper') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564';
  });

  // --- Desktop State ---
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [showRunDialog, setShowRunDialog] = useState(false);
  const [runInput, setRunInput] = useState('');
  
  // --- Flyouts State ---
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [actionCenterOpen, setActionCenterOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // --- File System Hook ---
  const { fs, setFs, operations } = useFileSystem();

  // --- Initialization ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('win11_theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
    setTimeout(() => setSystemState('lock'), 2500);
  }, []);

  // --- Persistence ---
  useEffect(() => { localStorage.setItem('win11_theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);

  // --- Global Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Win Key
      if (e.key === 'Meta' || e.key === 'OS') {
        e.preventDefault();
        if (systemState === 'desktop') {
            setStartMenuOpen(prev => !prev);
            setActionCenterOpen(false);
            setCalendarOpen(false);
        }
      }
      
      // Win + R (Run)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r') {
          e.preventDefault();
          if (systemState === 'desktop') {
            setShowRunDialog(true);
            setStartMenuOpen(false);
          }
      }

      // Win + L (Lock)
      if ((e.metaKey) && e.key.toLowerCase() === 'l') {
          e.preventDefault();
          setSystemState('lock');
      }

      // Win + D (Show Desktop)
      if ((e.metaKey) && e.key.toLowerCase() === 'd') {
          e.preventDefault();
          const allMinimized = windows.every(w => w.isMinimized);
          if (allMinimized) {
              // Restore all
              setWindows(prev => prev.map(w => ({ ...w, isMinimized: false })));
          } else {
              // Minimize all
              setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
          }
      }

      // Alt + F4 (Close Window)
      if (e.altKey && e.key === 'F4') {
          e.preventDefault();
          if (activeWindowId) {
              closeWindow(activeWindowId);
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [systemState, activeWindowId, windows]);

  const handleSetWallpaper = (url: string) => {
      setWallpaper(url);
      localStorage.setItem('win11_wallpaper', url);
      showToast('النظام', 'تم تغيير خلفية سطح المكتب بنجاح');
  };

  // --- Toast Logic ---
  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, title, message, type }]);
      setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
  };

  // --- System Actions ---
  const handleSystemAction = (action: 'shutdown' | 'restart' | 'reset' | 'bsod' | 'lock') => {
      if (action === 'reset') {
          localStorage.clear();
          operations.resetFileSystem();
          window.location.reload();
          return;
      }
      if (action === 'bsod') {
          setSystemState('bsod');
          return;
      }
      if (action === 'lock') {
          setSystemState('lock');
          return;
      }
      setSystemState('shutdown');
      setTimeout(() => {
          if (action === 'restart') {
              window.location.reload();
          }
      }, 3000);
  };

  const executeRunCommand = () => {
      setShowRunDialog(false);
      const cmd = runInput.trim().toLowerCase();
      if (cmd === 'cmd') openWindow('terminal');
      else if (cmd === 'calc') openWindow('calculator');
      else if (cmd === 'notepad') openWindow('notepad');
      else if (cmd === 'explorer') openWindow('explorer');
      else if (cmd === 'edge' || cmd === 'www') openWindow('edge');
      else if (cmd === 'settings') openWindow('settings');
      else showToast('خطأ', `يتعذر على ويندوز العثور على '${cmd}'. تأكد من كتابة الاسم بشكل صحيح.`);
      setRunInput('');
  };

  // --- Window Actions ---
  const openWindow = (appId: AppId, contentProps?: any) => {
    const app = APPS[appId];
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow && (appId === 'settings' || appId === 'store' || appId === 'calculator')) {
      restoreWindow(existingWindow.id);
      return;
    }

    const newWindow: WindowState = {
      id: `win-${Date.now()}-${Math.random()}`,
      appId,
      title: contentProps?.title || app.name,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter + 1,
      position: { x: 100 + (windows.length * 30) % 200, y: 50 + (windows.length * 30) % 200 },
      size: { width: app.defaultWidth || 800, height: app.defaultHeight || 600 },
      contentProps
    };

    setZIndexCounter(prev => prev + 1);
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    closeFlyouts();
  };

  const closeWindow = (id: string) => { setWindows(prev => prev.filter(w => w.id !== id)); };
  const minimizeWindow = (id: string) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w)); setActiveWindowId(null); };
  const restoreWindow = (id: string) => { setZIndexCounter(prev => prev + 1); setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 } : w)); setActiveWindowId(id); };
  const maximizeWindow = (id: string) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)); focusWindow(id); };
  const focusWindow = (id: string) => { if (activeWindowId === id) return; setZIndexCounter(prev => prev + 1); setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false } : w)); setActiveWindowId(id); };
  const updateWindowPosition = (id: string, x: number, y: number) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w)); };
  const updateWindowSize = (id: string, width: number, height: number, x: number, y: number) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height }, position: { x, y } } : w)); };

  // --- Flyouts ---
  const closeFlyouts = () => { setStartMenuOpen(false); setActionCenterOpen(false); setCalendarOpen(false); };
  const toggleStartMenu = () => { setStartMenuOpen(prev => !prev); setActionCenterOpen(false); setCalendarOpen(false); };
  const toggleActionCenter = () => { setActionCenterOpen(prev => !prev); setStartMenuOpen(false); setCalendarOpen(false); };
  const toggleCalendar = () => { setCalendarOpen(prev => !prev); setStartMenuOpen(false); setActionCenterOpen(false); };
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const handleLogin = () => { 
      if (password.length > 0) {
          setLoginError(false);
          setSystemState('desktop'); 
      } else { 
          setLoginError(true); 
          setTimeout(() => setLoginError(false), 500);
      } 
  };

  // --- BSOD Render ---
  if (systemState === 'bsod') return (
      <div className="h-screen w-screen bg-[#0078d7] flex flex-col p-20 text-white font-segoe cursor-none select-none">
          <div className="text-[120px] mb-8">:(</div>
          <div className="text-2xl mb-8">واجه جهازك مشكلة ويجب إعادة تشغيله. نحن نقوم بجمع بعض المعلومات عن الخطأ، ثم سنقوم بإعادة التشغيل لك.</div>
          <div className="text-2xl mb-16">20% مكتمل</div>
          <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white p-1"><div className="w-full h-full bg-black"></div></div>
              <div className="text-sm">
                  <p>لمزيد من المعلومات حول هذه المشكلة والإصلاحات المحتملة، تفضل بزيارة https://www.windows.com/stopcode</p>
                  <p className="mt-2">اذا اتصلت بشخص الدعم الفني، فأعطه هذه المعلومات:</p>
                  <p>رمز التوقف: CRITICAL_PROCESS_DIED</p>
              </div>
          </div>
      </div>
  );

  if (systemState === 'shutdown') return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white cursor-none">
           <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
           <div className="text-lg font-light">جاري إيقاف التشغيل...</div>
      </div>
  );

  if (systemState === 'boot') return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
          <div className="mb-12"><img src="https://img.icons8.com/color/96/000000/windows-11.png" alt="Logo" className="w-24 h-24 animate-pulse" /></div>
          <div className="w-8 h-8 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
  );
  
  if (systemState === 'lock') return (
      <div className="h-screen w-screen bg-cover bg-center flex flex-col items-center pt-32 text-white transition-all duration-500" style={{ backgroundImage: `url(${wallpaper})` }} onClick={() => setSystemState('login')}>
         <div className="text-8xl font-light mb-4 select-none animate-in fade-in zoom-in duration-500 drop-shadow-md">{new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: false})}</div>
         <div className="text-3xl font-medium select-none drop-shadow-md">{new Date().toLocaleDateString('ar-EG', {weekday: 'long', day: 'numeric', month: 'long'})}</div>
      </div>
  );
  
  if (systemState === 'login') return (
    <div className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center backdrop-blur-xl" style={{ backgroundImage: `url(${wallpaper})` }}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
        <div className={`z-10 flex flex-col items-center gap-6 animate-fadeIn ${loginError ? 'animate-shake' : ''}`}>
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white/20 shadow-lg"><User size={64} className="text-gray-500" /></div>
            <div className="text-2xl font-bold text-white">Admin</div>
            <div className="flex flex-col gap-2 w-64">
                <div className="flex bg-black/30 backdrop-blur-sm rounded border-b-2 border-white/50 focus-within:border-blue-400 transition">
                    <input type="password" placeholder="كلمة المرور" className="flex-1 bg-transparent text-white px-3 py-2 outline-none placeholder-gray-300 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} autoFocus />
                    <button className="px-3 hover:bg-white/10" onClick={handleLogin}><ArrowRight className="text-white" size={20} /></button>
                </div>
                {loginError && <span className="text-xs text-red-300 font-bold text-center shadow-black drop-shadow-sm">كلمة المرور غير صحيحة</span>}
            </div>
            <div className="mt-8 flex items-center gap-2 text-white/80 hover:text-white cursor-pointer text-sm" onClick={() => setSystemState('lock')}><Lock size={14} /><span>خيارات تسجيل الدخول</span></div>
        </div>
    </div>
  );

  return (
    <div 
      className={`h-screen w-screen overflow-hidden relative text-sm select-none ${isDarkMode ? 'dark' : ''}`}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('.flyout-trigger') && !(e.target as HTMLElement).closest('.flyout')) closeFlyouts();
      }}
    >
      {/* Desktop Layer */}
      <Desktop 
        wallpaper={wallpaper} 
        isDark={isDarkMode} 
        onOpenWindow={openWindow}
        onOpenSettings={() => openWindow('settings')}
      />

      {/* Toast Notifications */}
      <div className="absolute bottom-16 right-4 flex flex-col gap-2 z-[9999] pointer-events-none">
          {toasts.map(toast => (
              <div key={toast.id} className={`w-80 bg-white dark:bg-[#2b2b2b] p-3 rounded-lg shadow-2xl border-r-4 border-l-0 animate-in slide-in-from-right pointer-events-auto
                 ${toast.type === 'success' ? 'border-green-500' : toast.type === 'warning' ? 'border-orange-500' : 'border-blue-500'}
              `}>
                  <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-800 dark:text-white">{toast.title}</span>
                      <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}><X size={14} className="opacity-50 hover:opacity-100" /></button>
                  </div>
                  <p className="text-xs opacity-80 text-gray-600 dark:text-gray-300">{toast.message}</p>
              </div>
          ))}
          {toasts.length > 0 && (
              <button onClick={() => setToasts([])} className="self-end bg-white/80 dark:bg-black/50 px-2 py-1 rounded text-xs pointer-events-auto hover:bg-white shadow">مسح الكل</button>
          )}
      </div>

      {/* Run Dialog */}
      {showRunDialog && (
          <div className="fixed inset-0 z-[9999] flex items-end left-4 bottom-20 justify-start pointer-events-none">
              <div className="bg-white dark:bg-[#2b2b2b] dark:text-white border dark:border-[#444] rounded-lg shadow-xl p-4 w-96 pointer-events-auto animate-in fade-in zoom-in-95">
                  <div className="flex justify-between mb-4">
                      <h3 className="font-bold">تشغيل</h3>
                      <button onClick={() => setShowRunDialog(false)}><X size={16} /></button>
                  </div>
                  <div className="flex gap-3 mb-4">
                      <img src="https://img.icons8.com/color/48/console.png" alt="Run" className="w-8 h-8" />
                      <p className="text-xs opacity-80">اكتب اسم برنامج أو مجلد أو مستند أو مورد إنترنت، وسيقوم Windows بفتحه لك.</p>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold">فتح:</span>
                      <input 
                          className="flex-1 border dark:border-[#555] dark:bg-[#1e1e1e] px-2 py-1 text-sm outline-blue-500" 
                          autoFocus 
                          value={runInput}
                          onChange={(e) => setRunInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && executeRunCommand()}
                      />
                  </div>
                  <div className="flex justify-end gap-2">
                      <button className="px-4 py-1 bg-gray-200 dark:bg-[#444] rounded border dark:border-[#555] text-xs" onClick={() => setShowRunDialog(false)}>إلغاء الأمر</button>
                      <button className="px-4 py-1 bg-blue-600 text-white rounded border border-blue-700 text-xs" onClick={executeRunCommand}>موافق</button>
                  </div>
              </div>
          </div>
      )}

      {/* Windows Area */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {windows.map(win => (
          <Window 
            key={win.id} state={win} isActive={activeWindowId === win.id} isDark={isDarkMode}
            onClose={() => closeWindow(win.id)} onMinimize={() => minimizeWindow(win.id)} onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)} onMove={(x, y) => updateWindowPosition(win.id, x, y)} onResize={(w, h, x, y) => updateWindowSize(win.id, w, h, x, y)}
            app={APPS[win.appId]}
          >
            {React.createElement(APPS[win.appId].component, { 
               windowId: win.id, 
               contentProps: win.contentProps, 
               fs: fs, 
               setFs: setFs,
               fsOperations: operations, 
               onOpenWindow: openWindow,
               onCloseWindow: () => closeWindow(win.id),
               onAddToRecents: addToRecents, 
               onSetWallpaper: handleSetWallpaper,
               showToast: showToast,
               onSystemAction: handleSystemAction,
               isDark: isDarkMode, 
               toggleTheme: toggleTheme 
            })}
          </Window>
        ))}
      </div>

      {/* Flyouts & Taskbar */}
      <StartMenu 
        isOpen={startMenuOpen} 
        isDark={isDarkMode} 
        recentFiles={recentFiles} 
        onClose={() => setStartMenuOpen(false)} 
        onOpenApp={openWindow} 
        onSystemAction={handleSystemAction}
      />
      <ActionCenter isOpen={actionCenterOpen} isDark={isDarkMode} toggleTheme={toggleTheme} />
      <CalendarFlyout isOpen={calendarOpen} isDark={isDarkMode} />
      
      <Taskbar 
        windows={windows} activeWindowId={activeWindowId} isDark={isDarkMode}
        onAppClick={(appId) => {
          const openApp = windows.find(w => w.appId === appId);
          if (openApp) { (openApp.isMinimized || activeWindowId !== openApp.id) ? restoreWindow(openApp.id) : minimizeWindow(openApp.id); } 
          else { openWindow(appId as AppId); }
        }}
        onStartClick={toggleStartMenu} onActionCenterClick={toggleActionCenter} onClockClick={toggleCalendar} onMinimizeAll={() => windows.forEach(w => minimizeWindow(w.id))}
      />
    </div>
  );
  
  function addToRecents(file: RecentFile) {
      setRecentFiles(prev => {
          const filtered = prev.filter(f => f.name !== file.name);
          return [file, ...filtered].slice(0, 4);
      });
  }
}