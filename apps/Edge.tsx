import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { ArrowRight, ArrowLeft, RotateCw, Lock, Plus, X, Globe, AlertCircle, Home, Star, EyeOff } from 'lucide-react';

interface Tab {
    id: number; title: string; url: string; displayUrl: string; active: boolean; history: string[]; currentIndex: number; loading: boolean;
}

export const Edge: React.FC<AppProps> = ({ isDark }) => {
  const DEFAULT_HOME = 'https://www.google.com/webhp?igu=1';
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'Google', url: DEFAULT_HOME, displayUrl: 'https://www.google.com', active: true, history: [DEFAULT_HOME], currentIndex: 0, loading: false }]);
  const [inputValue, setInputValue] = useState('');
  const [isIncognito, setIsIncognito] = useState(false);
  const activeTab = tabs.find(t => t.active) || tabs[0];

  useEffect(() => { setInputValue(activeTab.displayUrl); }, [activeTab.id, activeTab.displayUrl]);
  const setActiveTab = (id: number) => { setTabs(prev => prev.map(t => ({ ...t, active: t.id === id }))); };
  const addTab = () => {
    const newId = Math.max(0, ...tabs.map(t => t.id)) + 1;
    setTabs(prev => prev.map(t => ({ ...t, active: false })).concat({ id: newId, title: 'علامة تبويب جديدة', url: DEFAULT_HOME, displayUrl: '', active: true, history: [DEFAULT_HOME], currentIndex: 0, loading: false }));
  };
  const closeTab = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    let nextActiveId = activeTab.id;
    if (id === activeTab.id) { const index = tabs.findIndex(t => t.id === id); nextActiveId = tabs[index - 1]?.id || tabs[index + 1]?.id; }
    setTabs(prev => prev.filter(t => t.id !== id).map(t => ({ ...t, active: t.id === nextActiveId })));
  };
  const processUrl = (input: string) => {
      let url = input.trim();
      if (!url.includes('.') && !url.startsWith('http')) return { url: `https://www.google.com/search?igu=1&source=hp&q=${encodeURIComponent(url)}`, display: `بحث Google: ${url}` };
      if (!url.startsWith('http')) url = 'https://' + url;
      if (url.includes('google.com') && !url.includes('igu=1')) url += (url.includes('?') ? '&igu=1' : '?igu=1');
      if (url.includes('youtube.com') && !url.includes('embed')) return { url: 'https://www.youtube.com/embed?listType=playlist&list=PL15B1E77BB5708555', display: url };
      return { url, display: url };
  };
  const navigate = (rawInput: string) => {
     const { url, display } = processUrl(rawInput);
     setTabs(prev => prev.map(t => t.active ? { ...t, url, displayUrl: display, history: [...t.history.slice(0, t.currentIndex + 1), url], currentIndex: t.history.length, loading: true, title: display } : t));
     setTimeout(() => setTabs(prev => prev.map(t => t.active ? { ...t, loading: false } : t)), 1000);
  };
  const handleRefresh = () => {
      const current = activeTab.url;
      setTabs(prev => prev.map(t => t.active ? { ...t, url: '', loading: true } : t));
      setTimeout(() => setTabs(prev => prev.map(t => t.active ? { ...t, url: current, loading: false } : t)), 300);
  };

  const topBarColor = isIncognito ? 'bg-[#202124] text-white' : (isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-[#dee1e6] text-gray-800');
  const addrBarColor = isIncognito ? 'bg-[#3c4043] border-transparent text-white' : (isDark ? 'bg-[#202020] border-[#444] text-white' : 'bg-white border-transparent shadow-sm text-gray-800');

  return (
    <div className={`flex flex-col h-full ${isDark || isIncognito ? 'bg-[#202020]' : 'bg-white'}`}>
      <div className={`flex items-end h-9 px-2 pt-1 gap-1 ${topBarColor}`}>
         {tabs.map(tab => (
             <div key={tab.id} className={`relative flex-1 max-w-[200px] h-[34px] rounded-t-md flex items-center justify-between px-3 text-xs cursor-pointer select-none transition-all group ${tab.active ? (isIncognito ? 'bg-[#35363a]' : (isDark ? 'bg-[#2b2b2b]' : 'bg-white')) : 'opacity-70 hover:opacity-100'}`} onClick={() => setActiveTab(tab.id)}>
                 <div className="flex items-center gap-2 overflow-hidden"><Globe size={12} className="shrink-0 opacity-70" /><span className="truncate">{tab.title}</span></div>
                 <div className="p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/20" onClick={(e) => closeTab(e, tab.id)}><X size={12} /></div>
             </div>
         ))}
         <button className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 ml-1" onClick={addTab}><Plus size={14} /></button>
         <div className="ml-auto px-2 cursor-pointer opacity-50 hover:opacity-100" onClick={() => setIsIncognito(!isIncognito)} title="نافذة InPrivate"><EyeOff size={16} /></div>
      </div>

      <div className={`h-20 flex flex-col ${isIncognito ? 'bg-[#35363a]' : (isDark ? 'bg-[#2b2b2b]' : 'bg-white')} border-b border-gray-200 dark:border-black`}>
         <div className="h-10 flex items-center gap-2 px-3">
            <button onClick={() => activeTab.currentIndex > 0 && navigate(activeTab.history[activeTab.currentIndex - 1])} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ArrowRight size={16} /></button>
            <button onClick={handleRefresh} className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${activeTab.loading ? 'animate-spin' : ''}`}><RotateCw size={14} /></button>
            <button onClick={() => navigate(DEFAULT_HOME)} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><Home size={16} /></button>
            <form className={`flex-1 h-8 flex items-center gap-2 px-3 rounded-full border ${addrBarColor}`} onSubmit={(e) => { e.preventDefault(); navigate(inputValue); }}>
                {activeTab.url.startsWith('https') ? <Lock size={12} className="text-green-500" /> : <AlertCircle size={12} className="text-gray-400" />}
                <input className="flex-1 bg-transparent border-none outline-none text-sm font-normal font-sans" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onFocus={(e) => e.target.select()} placeholder="البحث في Google أو كتابة عنوان URL" />
                <Star size={14} className="opacity-50 cursor-pointer hover:text-yellow-500" />
            </form>
         </div>
         <div className="h-8 flex items-center px-4 gap-4 text-xs opacity-80 cursor-pointer">
            <div className="flex items-center gap-1 hover:bg-black/5 p-1 rounded"><img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt=""/> <span>Google</span></div>
            <div className="flex items-center gap-1 hover:bg-black/5 p-1 rounded"><img src="https://www.youtube.com/favicon.ico" className="w-4 h-4" alt=""/> <span>YouTube</span></div>
            <div className="flex items-center gap-1 hover:bg-black/5 p-1 rounded"><img src="https://github.com/favicon.ico" className="w-4 h-4" alt=""/> <span>GitHub</span></div>
         </div>
      </div>

      <div className="flex-1 relative bg-white">
          {activeTab.loading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-[#202020]/80"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}
          <iframe key={activeTab.id} src={activeTab.url} title={activeTab.title} className="w-full h-full border-none" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-presentation" referrerPolicy="no-referrer" />
      </div>
    </div>
  );
};