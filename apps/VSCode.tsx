import React from 'react';
import { AppProps } from '../types';
import { Files, Search, GitGraph, X, Menu } from 'lucide-react';

export const VSCode: React.FC<AppProps> = () => {
  const code = `
import React from 'react';

export default function Windows11() {
  // Welcome to the React OS!
  const [boot, setBoot] = useState(true);

  return (
    <div className="os-container">
      <Desktop />
      <Taskbar />
    </div>
  );
}`;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-mono text-sm">
      {/* Title Bar Area Integration (Visual only, window handles real title bar) */}
      <div className="h-8 bg-[#1e1e1e] flex items-center px-2 text-xs select-none gap-4 border-b border-[#2b2b2b]">
         <Menu size={14} className="ml-1" />
         <span className="hover:text-white cursor-pointer">File</span>
         <span className="hover:text-white cursor-pointer">Edit</span>
         <span className="hover:text-white cursor-pointer">View</span>
         <span className="hover:text-white cursor-pointer">Go</span>
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
              <span className="mr-1">▼</span> WIN11-REACT
           </div>
           <div className="flex flex-col mt-1">
             <FileEntry name="App.tsx" color="text-blue-400" icon="TS" active />
             <FileEntry name="types.ts" color="text-blue-400" icon="TS" />
             <FileEntry name="index.css" color="text-blue-300" icon="#" />
             <FileEntry name="package.json" color="text-red-400" icon="{}" />
           </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bg-[#1e1e1e] flex flex-col">
           {/* Tabs */}
           <div className="flex bg-[#252526]">
              <div className="bg-[#1e1e1e] px-3 py-2 text-xs border-t-2 border-blue-500 flex items-center gap-2 text-white cursor-pointer pr-8 relative min-w-[120px]">
                 <span className="text-blue-400 font-bold mr-1">TS</span>
                 <span>App.tsx</span>
                 <X size={12} className="hover:bg-gray-600 rounded p-0.5 absolute right-2" />
              </div>
           </div>
           
           {/* Code Area */}
           <div className="flex-1 p-0 relative overflow-auto custom-scrollbar">
              <div className="flex min-h-full">
                  {/* Line Numbers */}
                  <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-4 pt-4 select-none text-xs leading-6 border-r border-[#2b2b2b]">
                     {Array.from({length: 15}).map((_, i) => <div key={i}>{i+1}</div>)}
                  </div>
                  
                  {/* Syntax Highlighted Content Simulation */}
                  <div className="flex-1 p-4 font-mono text-sm leading-6 whitespace-pre text-[#d4d4d4]">
                    <div><span className="text-[#c586c0]">import</span> React, {'{'} useState {'}'} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'react'</span>;</div>
                    <br/>
                    <div><span className="text-[#c586c0]">export default function</span> <span className="text-[#dcdcaa]">Windows11</span>() {'{'}</div>
                    <div>  <span className="text-[#6a9955]">// Welcome to the OS!</span></div>
                    <div>  <span className="text-[#569cd6]">const</span> [boot, setBoot] = <span className="text-[#dcdcaa]">useState</span>(<span className="text-[#569cd6]">true</span>);</div>
                    <br/>
                    <div>  <span className="text-[#c586c0]">return</span> (</div>
                    <div>    &lt;<span className="text-[#4ec9b0]">div</span> <span className="text-[#9cdcfe]">className</span>=<span className="text-[#ce9178]">"os-container"</span>&gt;</div>
                    <div>      &lt;<span className="text-[#4ec9b0]">Desktop</span> /&gt;</div>
                    <div>      &lt;<span className="text-[#4ec9b0]">Taskbar</span> /&gt;</div>
                    <div>    &lt;/<span className="text-[#4ec9b0]">div</span>&gt;</div>
                    <div>  );</div>
                    <div>{'}'}</div>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between select-none">
         <div className="flex items-center gap-3">
            <span>main*</span>
            <span>0 errors, 0 warnings</span>
         </div>
         <div className="flex items-center gap-4">
            <span>Ln 8, Col 12</span>
            <span>UTF-8</span>
            <span>TypeScript React</span>
            <span className="hover:bg-white/20 p-0.5 rounded cursor-pointer">Prettier</span>
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