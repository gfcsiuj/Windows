import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { Files, Search, GitGraph, X, Menu, Terminal as TerminalIcon } from 'lucide-react';

export const VSCode: React.FC<AppProps> = ({ contentProps, fsOperations }) => {
  const initialCode = contentProps?.content || `/**
 * @file Profile.tsx
 * @author Senior Developer
 * @description Welcome to my interactive portfolio OS.
 */

import React from 'react';

interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
}

export const DeveloperProfile = () => {
  const skills: Skill[] = [
    { name: 'React & TypeScript', level: 'Expert' },
    { name: 'Next.js & Node.js', level: 'Expert' },
    { name: 'Tailwind CSS & UI/UX', level: 'Advanced' },
    { name: 'Cloud Architecture', level: 'Advanced' }
  ];

  return (
    <div className="portfolio-container">
      <h1>مرحباً بك في عالمي الرقمي</h1>
      <p>
        أنا مهندس برمجيات متخصص في بناء تجارب ويب
        تفاعلية وعالية الأداء. هذا النظام هو عينة صغيرة
        من قدراتي في التصميم والتطوير.
      </p>
      
      <h2>المهارات التقنية:</h2>
      <ul>
        {skills.map(skill => (
          <li key={skill.name}>
            {skill.name} - <span className="tag">{skill.level}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};`;

  const [code, setCode] = useState(initialCode);
  const [fileName, setFileName] = useState(contentProps?.title || 'Profile.tsx');
  const [isDirty, setIsDirty] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
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
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
          e.preventDefault();
          setShowTerminal(!showTerminal);
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
         <Menu size={14} className="ml-1 text-blue-400" />
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
              <span className="mr-1">▼</span> PORTFOLIO
           </div>
           <div className="flex flex-col mt-1">
             <FileEntry name={fileName} color="text-blue-400" icon="TS" active />
             <FileEntry name="styles.css" color="text-blue-300" icon="#" />
             <FileEntry name="package.json" color="text-yellow-400" icon="{}" />
           </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-[#1e1e1e] flex flex-col">
           {/* Tabs */}
           <div className="flex bg-[#252526]">
              <div className="bg-[#1e1e1e] px-3 py-2 text-xs border-t-2 border-blue-500 flex items-center gap-2 text-white cursor-pointer pr-8 relative min-w-[120px]">
                 <span className={`w-2 h-2 rounded-full mr-1 ${isDirty ? 'bg-white' : 'bg-transparent'}`}></span>
                 <span className="text-blue-400 mr-1">TS</span>
                 <span>{fileName}</span>
                 <X size={12} className="hover:bg-gray-600 rounded p-0.5 absolute right-2" />
              </div>
           </div>
           
           {/* Real Editor */}
           <div className="flex-1 relative flex">
               {/* Line Numbers */}
              <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-3 pt-4 select-none leading-6 text-xs font-mono">
                  {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea 
                className="flex-1 h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 pl-0 outline-none resize-none font-mono text-sm leading-6 custom-scrollbar selection:bg-blue-700/50"
                value={code}
                onChange={(e) => { setCode(e.target.value); setIsDirty(true); }}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />
           </div>

           {/* Integrated Terminal */}
           {showTerminal && (
               <div className="h-32 border-t border-[#2b2b2b] bg-[#1e1e1e] p-2 overflow-auto">
                   <div className="flex justify-between text-xs uppercase font-bold mb-1 text-[#cccccc]">
                       <div className="flex gap-4">
                           <span className="underline decoration-1 underline-offset-4">Terminal</span>
                           <span className="opacity-50 hover:opacity-100 cursor-pointer">Output</span>
                           <span className="opacity-50 hover:opacity-100 cursor-pointer">Debug Console</span>
                       </div>
                       <X size={12} className="cursor-pointer hover:text-white" onClick={() => setShowTerminal(false)} />
                   </div>
                   <div className="text-xs font-mono mt-2">
                       <div className="text-green-400">➜  portfolio git:(<span className="text-red-400">main</span>) <span className="text-[#cccccc]">npm start</span></div>
                       <div className="text-[#cccccc] mt-1">
                           > portfolio@1.0.0 start<br/>
                           > react-scripts start
                       </div>
                       <div className="text-blue-400 mt-2">Starting the development server...</div>
                   </div>
               </div>
           )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between select-none">
         <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowTerminal(!showTerminal)}>
            <div className="flex items-center gap-1"><TerminalIcon size={10} /> <span>0</span></div>
            <span>main*</span>
            <span>{isDirty ? 'Unsaved' : 'Saved'}</span>
         </div>
         <div className="flex items-center gap-4">
            <span>Ln {code.split('\n').length}, Col 1</span>
            <span>UTF-8</span>
            <span>TypeScript React</span>
            <span className="hover:bg-white/20 px-1 rounded cursor-pointer">Prettier</span>
         </div>
      </div>
    </div>
  );
};

const FileEntry = ({ name, color, icon, active }: any) => (
  <div className={`flex items-center gap-1.5 px-4 py-1 cursor-pointer ${active ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'} text-[#cccccc]`}>
     <span className={`text-[10px] font-bold w-4 text-center ${color}`}>{icon}</span>
     <span>{name}</span>
  </div>
);