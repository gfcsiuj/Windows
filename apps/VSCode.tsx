import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { Files, Search, GitGraph, X, Menu, Save } from 'lucide-react';

export const VSCode: React.FC<AppProps> = ({ contentProps, fsOperations }) => {
  const initialCode = contentProps?.content || `// Welcome to VS Code
// Open a file from Explorer to edit it.
// Press Ctrl+S to save.

function helloWorld() {
  console.log("Hello Windows 11 Web!");
}`;

  const [code, setCode] = useState(initialCode);
  const [fileName, setFileName] = useState(contentProps?.title || 'Untitled');
  const [isDirty, setIsDirty] = useState(false);
  const filePath = contentProps?.path;

  useEffect(() => {
      if (contentProps?.content) {
          setCode(contentProps.content);
          setFileName(contentProps.title || 'Untitled');
          setIsDirty(false);
      }
  }, [contentProps]);

  const handleSave = () => {
      if (filePath && fsOperations?.updateFileContent) {
          fsOperations.updateFileContent(filePath, code);
          setIsDirty(false);
          // Optional: Show toast or visual indicator
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          handleSave();
      }
      if (e.key === 'Tab') {
          e.preventDefault();
          const target = e.target as HTMLTextAreaElement;
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const newCode = code.substring(0, start) + "  " + code.substring(end);
          setCode(newCode);
          setTimeout(() => {
              target.selectionStart = target.selectionEnd = start + 2;
          }, 0);
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-mono text-sm">
      {/* Menu Bar */}
      <div className="h-8 bg-[#1e1e1e] flex items-center px-2 text-xs select-none gap-4 border-b border-[#2b2b2b]">
         <Menu size={14} className="ml-1" />
         <span className="hover:text-white cursor-pointer">File</span>
         <span className="hover:text-white cursor-pointer">Edit</span>
         <span className="hover:text-white cursor-pointer">View</span>
         <span className="hover:text-white cursor-pointer">Run</span>
         <span className="hover:text-white cursor-pointer">Terminal</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center pt-2 gap-4 text-[#858585]">
           <Files className="text-white cursor-pointer border-l-2 border-white pl-2 box-content" size={24} />
           <Search className="hover:text-white cursor-pointer" size={24} />
           <GitGraph className="hover:text-white cursor-pointer" size={24} />
        </div>

        {/* Sidebar */}
        <div className="w-48 bg-[#252526] flex flex-col border-r border-[#1e1e1e]">
           <div className="p-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center group">
               <span>Explorer</span>
               <span className="opacity-0 group-hover:opacity-100">...</span>
           </div>
           <div className="px-2 py-1 bg-[#37373d] flex items-center text-xs font-bold cursor-pointer text-white">
              <span className="mr-1">▼</span> WORKSPACE
           </div>
           <div className="flex flex-col mt-1">
             <FileEntry name={fileName} color="text-blue-400" icon="{}" active />
           </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-[#1e1e1e] flex flex-col">
           {/* Tabs */}
           <div className="flex bg-[#252526]">
              <div className="bg-[#1e1e1e] px-3 py-2 text-xs border-t-2 border-blue-500 flex items-center gap-2 text-white cursor-pointer pr-8 relative min-w-[120px]">
                 <span className={`w-2 h-2 rounded-full mr-1 ${isDirty ? 'bg-white' : 'bg-transparent'}`}></span>
                 <span>{fileName}</span>
                 <X size={12} className="hover:bg-gray-600 rounded p-0.5 absolute right-2" />
              </div>
           </div>
           
           {/* Real Editor */}
           <div className="flex-1 relative">
              <textarea 
                className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 outline-none resize-none font-mono text-sm leading-6 custom-scrollbar"
                value={code}
                onChange={(e) => { setCode(e.target.value); setIsDirty(true); }}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />
           </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between select-none">
         <div className="flex items-center gap-3">
            <span>main*</span>
            <span>{isDirty ? 'Unsaved' : 'Saved'}</span>
         </div>
         <div className="flex items-center gap-4">
            <span>Ln {code.split('\n').length}, Col 1</span>
            <span>UTF-8</span>
            <span>{fileName.endsWith('js') ? 'JavaScript' : fileName.endsWith('ts') ? 'TypeScript' : 'Plain Text'}</span>
         </div>
      </div>
    </div>
  );
};

const FileEntry = ({ name, color, icon, active }: any) => (
  <div className={`flex items-center gap-1.5 px-4 py-1 cursor-pointer ${active ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'} text-[#cccccc]`}>
     <span className={`text-[10px] font-bold w-3 text-center ${color}`}>{icon}</span>
     <span>{name}</span>
  </div>
);