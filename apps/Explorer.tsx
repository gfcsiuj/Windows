import React, { useState, useEffect } from 'react';
import { AppProps, FileSystemItem } from '../types';
import { ArrowUp, HardDrive, FileText, Image as ImageIcon, Folder, Trash2, Film, Music, MoreHorizontal, FolderPlus, Plus } from 'lucide-react';

export const Explorer: React.FC<AppProps> = ({ fs, setFs }) => {
  const [path, setPath] = useState<string[]>(['root']);
  const [selected, setSelected] = useState<string | null>(null);
  
  // If no FS provided, fallback empty (shouldn't happen with new App.tsx)
  const fileSystem = fs || {};

  const getCurrentContent = () => {
    let dir: any = fileSystem;
    for (const p of path) {
      if (dir[p]?.content) dir = dir[p].content;
      else if (p === 'root') dir = fileSystem.root?.content;
      else return {};
    }
    return dir || {};
  };

  const content = getCurrentContent();
  const pathString = path.length === 1 ? 'هذا الكمبيوتر' : path.slice(1).join(' > ');

  const navigate = (name: string, type: string) => {
    if (type === 'folder') {
      setPath([...path, name]);
      setSelected(null);
    }
  };

  const goUp = () => {
    if (path.length > 1) {
        setPath(path.slice(0, -1));
        setSelected(null);
    }
  };

  const createFolder = () => {
    if (!setFs) return;
    const newName = `مجلد جديد ${Math.floor(Math.random() * 100)}`;
    // Deep clone to update state
    const newFs = JSON.parse(JSON.stringify(fileSystem));
    
    // Traverse to current path
    let dir: any = newFs;
    for (const p of path) {
        if (dir[p]?.content) dir = dir[p].content;
        else if (p === 'root') dir = newFs.root.content;
    }
    
    dir[newName] = { type: 'folder', content: {} };
    setFs(newFs);
  };

  const deleteItem = (name: string) => {
    if (!setFs) return;
    const newFs = JSON.parse(JSON.stringify(fileSystem));
    
    let dir: any = newFs;
    for (const p of path) {
        if (dir[p]?.content) dir = dir[p].content;
        else if (p === 'root') dir = newFs.root.content;
    }
    
    delete dir[name];
    setFs(newFs);
    setSelected(null);
  };

  return (
    <div className="flex flex-col h-full">
       {/* Header */}
       <div className="h-12 border-b bg-gray-50/80 dark:bg-[#2b2b2b] dark:border-[#333] flex items-center gap-2 px-2">
         <div className="flex gap-1">
            <button 
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition disabled:opacity-30"
                onClick={goUp}
                disabled={path.length <= 1}
            >
                <ArrowUp size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button 
                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition text-xs dark:text-gray-300"
                onClick={createFolder}
            >
                <Plus size={14} />
                <span>جديد</span>
            </button>
            {selected && (
                <button 
                    className="flex items-center gap-1 px-2 py-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded transition text-xs"
                    onClick={() => deleteItem(selected)}
                >
                    <Trash2 size={14} />
                    <span>حذف</span>
                </button>
            )}
         </div>

         <div className="flex-1 bg-white dark:bg-[#1e1e1e] border dark:border-[#333] px-3 py-1.5 text-sm rounded flex items-center gap-2 text-gray-600 dark:text-gray-300 shadow-sm">
           <HardDrive size={14} />
           <span>{pathString}</span>
         </div>
       </div>

       {/* Body */}
       <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#191919]">
         {/* Sidebar */}
         <div className="w-48 bg-gray-50/50 dark:bg-[#202020] border-l dark:border-[#333] text-sm p-2 space-y-1 hidden sm:block">
            <SidebarItem icon={HardDrive} label="الكمبيوتر" onClick={() => setPath(['root'])} active={path.length === 1} />
            <SidebarItem icon={FileText} label="المستندات" onClick={() => setPath(['root', 'المستندات'])} active={path.includes('المستندات')} />
            <SidebarItem icon={ImageIcon} label="الصور" onClick={() => setPath(['root', 'الصور'])} active={path.includes('الصور')} />
            <SidebarItem icon={Music} label="الموسيقى" onClick={() => setPath(['root', 'الموسيقى'])} active={path.includes('الموسيقى')} />
         </div>

         {/* Content Area */}
         <div 
            className="flex-1 p-2 overflow-y-auto grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] auto-rows-[100px] gap-2 content-start"
            onClick={(e) => {
                if (e.target === e.currentTarget) setSelected(null);
            }}
         >
            {Object.entries(content).map(([name, data]: [string, any]) => (
              <div 
                key={name}
                className={`flex flex-col items-center justify-start p-2 rounded border cursor-pointer group transition
                    ${selected === name 
                        ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700' 
                        : 'border-transparent hover:bg-gray-100 hover:border-gray-200 dark:hover:bg-white/5 dark:hover:border-white/10'}
                `}
                onClick={(e) => { e.stopPropagation(); setSelected(name); }}
                onDoubleClick={() => navigate(name, data.type)}
              >
                <div className="text-4xl mb-2">
                  {data.type === 'folder' && <Folder size={42} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" />}
                  {data.type === 'file' && <FileText size={42} className="text-gray-400" />}
                  {data.type === 'image' && <ImageIcon size={42} className="text-purple-500" />}
                  {data.type === 'video' && <Film size={42} className="text-rose-500" />}
                  {data.type === 'audio' && <Music size={42} className="text-orange-500" />}
                </div>
                <span className="text-xs text-center text-gray-700 dark:text-gray-300 line-clamp-2 break-all group-hover:text-blue-800 dark:group-hover:text-blue-400">
                  {name}
                </span>
              </div>
            ))}
            {Object.keys(content).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
                <FolderPlus size={32} className="opacity-50" />
                <span>المجلد فارغ</span>
              </div>
            )}
         </div>
       </div>
       
       {/* Footer */}
       <div className="h-6 bg-gray-50 dark:bg-[#202020] border-t dark:border-[#333] text-[10px] flex items-center px-2 text-gray-500 dark:text-gray-400">
         {Object.keys(content).length} عناصر | {selected ? 'تم تحديد عنصر' : ''}
       </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, onClick, active }: any) => (
  <div 
    className={`p-1.5 rounded cursor-pointer flex items-center gap-2 transition
        ${active 
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' 
            : 'hover:bg-gray-200 text-gray-700 dark:text-gray-400 dark:hover:bg-white/5'}
    `}
    onClick={onClick}
  >
    <Icon size={16} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'} />
    <span>{label}</span>
  </div>
);