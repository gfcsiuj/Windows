import React, { useState } from 'react';
import { AppProps } from '../types';
import { ArrowRight, ArrowLeft, RotateCw, Search, Mic, Plus, X, Star } from 'lucide-react';

interface Tab {
    id: number;
    title: string;
    url: string;
    active: boolean;
}

export const Edge: React.FC<AppProps> = ({ isDark }) => {
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'علامة تبويب جديدة', url: 'https://bing.com', active: true }]);
  const [urlInput, setUrlInput] = useState('https://bing.com');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const activeTab = tabs.find(t => t.active) || tabs[0];

  const setActiveTab = (id: number) => {
    setTabs(prev => prev.map(t => ({ ...t, active: t.id === id })));
    const target = tabs.find(t => t.id === id);
    if (target) setUrlInput(target.url);
  };

  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs(prev => prev.map(t => ({ ...t, active: false })).concat({ id: newId, title: 'New Tab', url: '', active: true }));
    setUrlInput('');
  };

  const closeTab = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close last tab
    const newTabs = tabs.filter(t => t.id !== id);
    if (id === activeTab.id) {
        newTabs[newTabs.length - 1].active = true;
        setUrlInput(newTabs[newTabs.length - 1].url);
    }
    setTabs(newTabs);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTabs(prev => prev.map(t => t.active ? { ...t, url: urlInput, title: urlInput } : t));
    setHistory(prev => [urlInput, ...prev]);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#2b2b2b] text-white' : 'bg-white text-gray-800'}`}>
      {/* Tab Bar */}
      <div className={`flex items-end h-10 px-2 pt-2 gap-1 ${isDark ? 'bg-[#202020]' : 'bg-gray-200'}`}>
         {tabs.map(tab => (
             <div 
                key={tab.id}
                className={`flex-1 max-w-[200px] h-full rounded-t-lg flex items-center justify-between px-3 text-xs cursor-pointer group select-none transition-colors
                    ${tab.active 
                        ? (isDark ? 'bg-[#3b3b3b] shadow' : 'bg-white shadow') 
                        : 'hover:bg-white/10'}
                `}
                onClick={() => setActiveTab(tab.id)}
             >
                 <span className="truncate">{tab.title || 'New Tab'}</span>
                 <X 
                    size={12} 
                    className={`opacity-0 group-hover:opacity-100 rounded-full p-0.5 ${isDark ? 'hover:bg-white/20' : 'hover:bg-gray-200'}`}
                    onClick={(e) => closeTab(e, tab.id)}
                 />
             </div>
         ))}
         <button className="p-1 hover:bg-gray-300 dark:hover:bg-white/10 rounded mb-1" onClick={addTab}>
             <Plus size={16} />
         </button>
      </div>

      {/* Toolbar */}
      <div className={`h-10 flex items-center px-2 gap-2 border-b ${isDark ? 'bg-[#3b3b3b] border-[#202020]' : 'bg-white border-gray-100'}`}>
        <ArrowRight size={16} className="opacity-50" />
        <ArrowLeft size={16} className="opacity-50" />
        <RotateCw size={14} className="cursor-pointer hover:text-blue-500" onClick={() => handleNavigate({ preventDefault: () => {} } as any)} />
        
        <form className="flex-1 relative" onSubmit={handleNavigate}>
          <input 
            type="text" 
            className={`w-full border rounded-full px-4 py-1.5 text-xs outline-none focus:border-blue-500 transition
                ${isDark ? 'bg-[#202020] border-[#444] text-white' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}
            value={urlInput} 
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="البحث أو إدخال عنوان ويب"
          />
          <Star size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-yellow-500" />
        </form>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto relative ${isDark ? 'bg-[#202020]' : 'bg-white'}`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm opacity-60">جاري التحميل...</span>
          </div>
        ) : !activeTab.url || activeTab.url.includes('bing') ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-6 p-4 animate-fadeIn">
             <h1 className="text-5xl font-bold select-none tracking-tight opacity-80">Bing</h1>
             <div className={`w-full max-w-[600px] shadow-lg rounded-full border flex items-center px-5 py-3 gap-3 transition transform hover:scale-[1.01]
                ${isDark ? 'bg-[#333] border-[#444]' : 'bg-white border-gray-200'}
             `}>
                <Search className="opacity-50" size={20} />
                <input 
                  type="text" 
                  className="flex-1 outline-none bg-transparent" 
                  placeholder="البحث في الويب..." 
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigate(e)}
                />
                <Mic className="text-blue-500 cursor-pointer" size={20} />
             </div>
             <div className="grid grid-cols-4 gap-4 mt-8">
                {['Facebook', 'YouTube', 'Wikipedia', 'Amazon'].map(site => (
                  <div key={site} className={`w-20 h-20 rounded-lg flex items-center justify-center hover:-translate-y-1 transition shadow-sm cursor-pointer
                     ${isDark ? 'bg-[#333] hover:bg-[#444]' : 'bg-gray-50 hover:bg-gray-100'}
                  `}>
                    <span className="text-xs font-bold opacity-70">{site}</span>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="p-8">
            <h1 className="text-xl font-bold text-blue-500 hover:underline cursor-pointer mb-1">نتائج البحث عن {urlInput}</h1>
            <p className="text-green-600 text-xs mb-4">https://www.bing.com/search?q=...</p>
            <p className="text-sm opacity-70 mb-8">
              تم العثور على 2,400,000 نتيجة (0.45 ثانية). هذا نموذج محاكاة للمتصفح.
            </p>
            
            {[1, 2, 3].map(i => (
              <div key={i} className="mb-6">
                 <h3 className="text-lg text-blue-500 hover:underline cursor-pointer">عنوان نتيجة البحث التجريبية {i}</h3>
                 <p className="text-xs text-green-600">www.example.com/result-{i}</p>
                 <p className="text-sm opacity-70 mt-1">وصف مختصر لنتيجة البحث يظهر هنا لملء المساحة وإعطاء طابع واقعي للمحاكاة.</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};