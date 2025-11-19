import React, { useState, useEffect, useRef } from 'react';
import { AppProps, FileSystemItem, ViewMode, SortMode } from '../types';
import { ArrowUp, ArrowLeft, ArrowRight, HardDrive, FileText, Image as ImageIcon, Folder, Trash2, Film, Music, FolderPlus, RotateCw, Search, Home, Monitor, List, Grid, ChevronDown, MoreHorizontal, Star } from 'lucide-react';

export const Explorer: React.FC<AppProps> = ({ fs, fsOperations, onOpenWindow, onAddToRecents, contentProps, isDark }) => {
  // --- Navigation State ---
  const [history, setHistory] = useState<string[][]>(() => {
      return contentProps?.initialPath ? [contentProps.initialPath] : [['root']];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPath = history[currentIndex];
  
  const [selected, setSelected] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [showProperties, setShowProperties] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- View & Sort State ---
  const [viewMode, setViewMode] = useState<ViewMode>('medium');
  const [sortMode, setSortMode] = useState<SortMode>('name');

  const fileSystem = fs || {};

  // --- Helpers ---
  const navigateTo = (newPath: string[]) => {
    const nextHistory = history.slice(0, currentIndex + 1);
    nextHistory.push(newPath);
    setHistory(nextHistory);
    setCurrentIndex(nextHistory.length - 1);
    setSelected(null);
    setShowProperties(false);
  };

  const goBack = () => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setSelected(null); } };
  const goForward = () => { if (currentIndex < history.length - 1) { setCurrentIndex(currentIndex + 1); setSelected(null); } };
  const goUp = () => { if (currentPath.length > 1) navigateTo(currentPath.slice(0, -1)); };

  const getCurrentDir = () => {
    let dir: any = fileSystem;
    for (const p of currentPath) {
      if (p === 'root') dir = fileSystem.root?.content;
      else if (dir && dir[p]?.content) dir = dir[p].content;
      else return null;
    }
    return dir || {};
  };

  const content = getCurrentDir();
  
  // Sort Content
  const sortedContent = content ? Object.entries(content).sort((a, b) => {
      const [nameA, dataA] = a as [string, any];
      const [nameB, dataB] = b as [string, any];
      if (sortMode === 'type') return dataA.type.localeCompare(dataB.type);
      if (sortMode === 'date') return 0; // Mock date sort
      return nameA.localeCompare(nameB);
  }) : [];

  // --- Interaction ---
  const handleItemDoubleClick = (name: string, item: FileSystemItem) => {
     if (item.type === 'folder') {
         navigateTo([...currentPath, name]);
     } else {
         if (!onOpenWindow) return;
         if (onAddToRecents) onAddToRecents({ name, type: item.type as any, date: new Date() });
         const fullPath = [...currentPath, name]; 
         if (item.type === 'image') onOpenWindow('photos', { content: item.content, path: fullPath, title: name });
         else if (item.type === 'audio') onOpenWindow('media', { content: item.content, path: fullPath, title: name });
         else onOpenWindow('notepad', { content: item.content, path: fullPath, title: name });
     }
  };

  const handleRenameSubmit = () => {
      if (renaming && renameInput.trim() !== '' && renameInput !== renaming) {
          fsOperations?.renameItem(currentPath, renaming, renameInput);
      }
      setRenaming(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'F2' && selected && !renaming) { setRenaming(selected); setRenameInput(selected); }
      if (renaming && e.key === 'Enter') handleRenameSubmit();
      if (e.key === 'Delete' && selected && !renaming) { fsOperations?.deleteItem(currentPath, selected); setSelected(null); }
  };

  useEffect(() => { if (renaming && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [renaming]);

  const theme = isDark 
    ? { bg: 'bg-[#191919]', border: 'border-[#333]', header: 'bg-[#202020]', text: 'text-gray-300', hover: 'hover:bg-white/10', active: 'bg-white/10', input: 'bg-[#2b2b2b] border-[#444]' }
    : { bg: 'bg-white', border: 'border-gray-200', header: 'bg-gray-50', text: 'text-gray-800', hover: 'hover:bg-gray-100', active: 'bg-blue-100/50 border-blue-200', input: 'bg-white border-gray-300' };

  const renderThisPC = () => (
      <div className="p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2 cursor-pointer" onClick={() => setShowProperties(false)}>
              <ChevronDown size={16} /> الأجهزة ومحركات الأقراص (2)
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
              <DriveCard name="القرص المحلي (C:)" usage={45} total={128} theme={theme} />
              <DriveCard name="القرص المحلي (D:)" usage={10} total={500} theme={theme} />
          </div>
      </div>
  );

  return (
    <div className={`flex flex-col h-full ${theme.bg} select-none text-sm font-sans relative`} onKeyDown={handleKeyDown} tabIndex={0}>
       {/* Toolbar */}
       <div className={`h-14 border-b flex items-center gap-3 px-3 ${theme.header} ${theme.border}`}>
         <div className="flex items-center gap-1">
            <button className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition`} onClick={goRight} disabled={currentIndex === 0}> <ArrowRight size={18} className={theme.text} /> </button>
            <button className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition`} onClick={goLeft} disabled={currentIndex === history.length - 1}> <ArrowLeft size={18} className={theme.text} /> </button>
            <button className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition`} onClick={goUp} disabled={currentPath.length === 1}> <ArrowUp size={18} className={theme.text} /> </button>
            <button className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition`} onClick={() => navigateTo(['root'])}> <RotateCw size={16} className={theme.text} /> </button>
         </div>

         <div className={`flex-1 h-9 border rounded-md flex items-center px-2 gap-1 overflow-hidden shadow-sm transition focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent ${theme.input}`}>
            <HardDrive size={14} className="opacity-50" />
            <div className="flex items-center h-full overflow-hidden whitespace-nowrap mask-fade-left">
                {currentPath.map((segment, idx) => (
                    <React.Fragment key={idx}>
                         {idx > 0 && <span className="mx-1 opacity-40 text-[10px]">❯</span>}
                         <button className={`px-1.5 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 truncate max-w-[120px] ${theme.text}`} onClick={() => navigateTo(currentPath.slice(0, idx + 1))}>
                            {segment === 'root' ? 'هذا الكمبيوتر' : segment}
                         </button>
                    </React.Fragment>
                ))}
            </div>
         </div>

         <div className={`w-60 h-9 border rounded-md flex items-center px-3 shadow-sm ${theme.input}`}>
             <Search size={14} className="opacity-50 ml-2" />
             <input type="text" placeholder={`البحث في ${currentPath[currentPath.length-1] === 'root' ? 'الكمبيوتر' : currentPath[currentPath.length-1]}`} className={`w-full bg-transparent outline-none placeholder-gray-500 text-xs ${theme.text}`} />
         </div>
       </div>

       {/* Sub-Toolbar */}
       <div className={`h-12 border-b flex items-center px-4 gap-2 text-xs ${theme.bg} ${theme.border} ${theme.text}`}>
          <button className={`flex items-center gap-2 px-3 py-1.5 rounded transition ${theme.hover}`} onClick={() => fsOperations?.createItem(currentPath, 'folder')}>
              <FolderPlus size={16} className="text-blue-500" /> <span>جديد</span>
          </button>
          <div className={`w-px h-5 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <button className="disabled:opacity-40 flex items-center gap-2 px-2 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10" disabled={!selected} onClick={() => setRenaming(selected || '')}>
             <span>إعادة تسمية</span>
          </button>
          <button className="disabled:opacity-40 flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" disabled={!selected} onClick={() => selected && fsOperations?.deleteItem(currentPath, selected)}>
             <Trash2 size={14} /> <span>حذف</span>
          </button>
          <button className="disabled:opacity-40 flex items-center gap-2 px-2 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10" disabled={!selected} onClick={() => setShowProperties(true)}>
             <MoreHorizontal size={14} />
          </button>
          <div className="flex-1"></div>
          <button className={`flex items-center gap-1 px-2 py-1.5 rounded ${viewMode === 'list' ? 'bg-black/10 dark:bg-white/20' : theme.hover}`} onClick={() => setViewMode('list')}>
              <List size={14}/> <span>قائمة</span>
          </button>
          <button className={`flex items-center gap-1 px-2 py-1.5 rounded ${viewMode === 'medium' ? 'bg-black/10 dark:bg-white/20' : theme.hover}`} onClick={() => setViewMode('medium')}>
              <Grid size={14}/> <span>أيقونات</span>
          </button>
          <div className="flex items-center gap-1 px-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded" onClick={() => setSortMode(p => p === 'name' ? 'type' : 'name')}>
              <span>فرز: {sortMode === 'name' ? 'الاسم' : 'النوع'}</span>
              <ChevronDown size={12} />
          </div>
       </div>

       {/* Body */}
       <div className="flex flex-1 overflow-hidden">
         <div className={`w-60 border-l py-4 hidden md:block overflow-y-auto ${theme.bg} ${theme.border}`}>
            <div className="px-4 mb-2 text-xs font-bold opacity-50">وصول سريع</div>
            <SidebarItem icon={Home} label="الرئيسية" onClick={() => navigateTo(['root'])} active={currentPath.length === 1} theme={theme} />
            <SidebarItem icon={Monitor} label="سطح المكتب" onClick={() => navigateTo(['root', 'سطح المكتب'])} active={currentPath.includes('سطح المكتب')} theme={theme} />
            <SidebarItem icon={FileText} label="المستندات" onClick={() => navigateTo(['root', 'المستندات'])} active={currentPath.includes('المستندات')} theme={theme} />
            <SidebarItem icon={ImageIcon} label="الصور" onClick={() => navigateTo(['root', 'الصور'])} active={currentPath.includes('الصور')} theme={theme} />
            <div className={`h-px my-2 mx-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="px-4 mb-2 text-xs font-bold opacity-50">هذا الكمبيوتر</div>
            <SidebarItem icon={HardDrive} label="القرص المحلي (C:)" active={false} theme={theme} />
            <SidebarItem icon={Trash2} label="سلة المحذوفات" onClick={() => navigateTo(['root', 'سلة المحذوفات'])} active={currentPath.includes('سلة المحذوفات')} theme={theme} />
         </div>

         <div className={`flex-1 p-4 overflow-y-auto ${theme.bg} relative`} onClick={(e) => { if (e.target === e.currentTarget) { setSelected(null); if (renaming) handleRenameSubmit(); setShowProperties(false); } }}>
            {currentPath.length === 1 && currentPath[0] === 'root' ? renderThisPC() : (
                <>
                    {!content ? <div className="flex center opacity-50">المسار غير موجود</div> : sortedContent.length === 0 ? 
                        <div className="flex flex-col items-center justify-center h-full opacity-40 gap-2"><FolderPlus size={64} strokeWidth={0.5} /><span>هذا المجلد فارغ</span></div> : 
                        (
                        <div className={viewMode === 'list' ? 'flex flex-col gap-1' : 'grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2'}>
                            {sortedContent.map(([name, data]: [string, any]) => (
                                <div 
                                    key={name}
                                    className={`flex rounded-md border border-transparent cursor-default group transition-colors
                                        ${selected === name ? theme.active : theme.hover}
                                        ${viewMode === 'list' ? 'flex-row items-center p-1 px-2 gap-3' : 'flex-col items-center p-2'}
                                    `}
                                    onClick={(e) => { e.stopPropagation(); setSelected(name); }}
                                    onDoubleClick={() => handleItemDoubleClick(name, data)}
                                    onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelected(name); }}
                                >
                                    <div className="pointer-events-none">
                                        <FileIcon type={data.type} name={name} size={viewMode === 'list' ? 18 : 48} />
                                    </div>
                                    {renaming === name ? (
                                        <input ref={inputRef} type="text" className={`text-center text-xs border border-blue-500 outline-none px-1 ${isDark ? 'bg-black text-white' : 'bg-white'} ${viewMode === 'list' ? 'text-right w-64' : 'w-full'}`} value={renameInput} onChange={(e) => setRenameInput(e.target.value)} onBlur={handleRenameSubmit} onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()} onClick={(e) => e.stopPropagation()} />
                                    ) : (
                                        <span className={`text-[12px] leading-tight line-clamp-2 break-words px-1 ${theme.text} ${viewMode === 'list' ? 'text-right flex-1' : 'text-center w-full'}`}>{name}</span>
                                    )}
                                    {viewMode === 'list' && <span className="text-[11px] opacity-50 w-24 text-left">{(data.type).toUpperCase()}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
         </div>
       </div>
       
       {/* Status Bar */}
       <div className={`h-7 border-t flex items-center justify-between px-4 text-[11px] opacity-70 ${theme.header} ${theme.border} ${theme.text}`}>
          <div>{sortedContent.length} عنصر</div>
          <div className="flex gap-4">
              {selected ? <span>تم تحديد عنصر واحد | 24 KB</span> : ''}
              <div className="flex gap-2">
                 <List size={12} className={viewMode === 'list' ? 'text-blue-500' : ''} onClick={() => setViewMode('list')} />
                 <Grid size={12} className={viewMode !== 'list' ? 'text-blue-500' : ''} onClick={() => setViewMode('medium')} />
              </div>
          </div>
       </div>

       {/* Properties Modal */}
       {showProperties && selected && (
           <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-4 rounded-lg shadow-2xl border z-50 animate-in fade-in zoom-in-95 ${isDark ? 'bg-[#2b2b2b] border-[#444] text-white' : 'bg-white border-gray-300 text-gray-800'}`}>
               <div className="flex justify-between items-center mb-4 border-b pb-2">
                   <h3 className="font-bold text-sm">خصائص {selected}</h3>
                   <button onClick={() => setShowProperties(false)} className="hover:bg-red-500 hover:text-white rounded p-1"><MoreHorizontal size={14}/></button>
               </div>
               <div className="flex items-center gap-4 mb-4">
                   <FileIcon type={content[selected].type} name={selected} size={48} />
                   <div>
                       <div className="font-bold">{selected}</div>
                       <div className="text-xs opacity-70">{content[selected].type.toUpperCase()} File</div>
                   </div>
               </div>
               <div className="space-y-2 text-xs">
                   <div className="grid grid-cols-[80px_1fr] gap-2">
                       <span className="opacity-70">الموقع:</span>
                       <span className="truncate select-text">C:\Users\Admin\{currentPath.join('\\')}</span>
                   </div>
                   <div className="grid grid-cols-[80px_1fr] gap-2">
                       <span className="opacity-70">الحجم:</span>
                       <span>{Math.floor(Math.random() * 1000) + 1} KB</span>
                   </div>
                   <div className="grid grid-cols-[80px_1fr] gap-2">
                       <span className="opacity-70">تاريخ الإنشاء:</span>
                       <span>{new Date().toLocaleDateString()}</span>
                   </div>
               </div>
               <div className="flex justify-end mt-6">
                   <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs" onClick={() => setShowProperties(false)}>موافق</button>
               </div>
           </div>
       )}
    </div>
  );
  function goRight() { if(currentIndex > 0) goBack(); }
  function goLeft() { if(currentIndex < history.length - 1) goForward(); }
};

const SidebarItem = ({ icon: Icon, label, onClick, active, theme }: any) => (
  <div className={`mx-2 px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-3 transition mb-1 ${active ? (theme.bg === 'bg-white' ? 'bg-gray-200/70' : 'bg-white/10') : theme.hover}`} onClick={onClick}>
    <Icon size={16} className={`opacity-80 ${active ? 'text-blue-500' : theme.text}`} />
    <span className={`text-xs ${active ? 'font-semibold' : ''} ${theme.text}`}>{label}</span>
    {label === 'سطح المكتب' || label === 'المستندات' ? <Star size={10} className="mr-auto opacity-30" /> : null}
  </div>
);

const DriveCard = ({ name, usage, total, theme }: any) => (
    <div className={`p-3 rounded border flex gap-3 items-center ${theme.border} ${theme.hover} transition-colors`}>
        <HardDrive size={32} className="text-gray-500" />
        <div className="flex-1">
            <div className={`text-xs font-medium mb-1 ${theme.text}`}>{name}</div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300/50 mb-1">
                <div className="h-full bg-blue-500" style={{ width: `${(usage/total)*100}%` }}></div>
            </div>
            <div className={`text-[10px] opacity-70 ${theme.text}`}>{total - usage} غيغابايت متوفرة من أصل {total} غيغابايت</div>
        </div>
    </div>
);

const FileIcon = ({ type, name, size }: { type: string, name: string, size: number }) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (type === 'folder') return <Folder size={size} className="text-yellow-400 fill-yellow-400" />;
    if (type === 'image') return <ImageIcon size={size} className="text-purple-500" />;
    if (type === 'video') return <Film size={size} className="text-rose-500" />;
    if (type === 'audio') return <Music size={size} className="text-orange-500" />;
    
    // Code extensions
    if (['js', 'ts', 'tsx', 'jsx', 'json', 'css', 'html'].includes(ext || '')) 
        return <div className="relative flex items-center justify-center text-blue-500"><FileText size={size} className="fill-blue-50" /><span className="absolute text-[8px] font-bold uppercase mt-1">{ext}</span></div>;
    
    return <FileText size={size} className="text-gray-400" />;
}