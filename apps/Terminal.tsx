import React, { useState, useRef, useEffect } from 'react';
import { AppProps } from '../types';

export const TerminalApp: React.FC<AppProps> = ({ fs, fsOperations, onOpenWindow, onCloseWindow, onSystemAction, windowId, openWindows }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [history, setHistory] = useState<string[]>(['Microsoft Windows [Version 11.0.22621.1]', '(c) Microsoft Corporation. All rights reserved.', '']);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textColor, setTextColor] = useState('text-gray-300');
  const [isMatrix, setIsMatrix] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history, isMatrix]);

  const getDirContent = (path: string[]) => {
      if (!fs) return {};
      let current: any = fs.root.content; 
      if (path.length === 1 && path[0] === 'root') return current;
      for (let i = 1; i < path.length; i++) {
          const segment = path[i];
          if (current && current[segment] && current[segment].type === 'folder') current = current[segment].content;
          else return null;
      }
      return current;
  };

  const getDisplayPath = (path: string[]) => {
      if (path.length === 1) return 'C:\\Users\\Admin';
      return 'C:\\Users\\Admin\\' + path.slice(1).join('\\');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleCommand(input);
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
              const newIndex = historyIndex + 1;
              setHistoryIndex(newIndex);
              setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
          }
      } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex > 0) {
              const newIndex = historyIndex - 1;
              setHistoryIndex(newIndex);
              setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
          } else if (historyIndex === 0) {
              setHistoryIndex(-1);
              setInput('');
          }
      } else if (e.key === 'Tab') {
          e.preventDefault();
          const content = getDirContent(currentPath);
          if (content) {
              const parts = input.split(' ');
              const lastPart = parts[parts.length - 1];
              const match = Object.keys(content).find(k => k.toLowerCase().startsWith(lastPart.toLowerCase()));
              if (match) {
                  parts[parts.length - 1] = match;
                  setInput(parts.join(' '));
              }
          }
      }
  };

  const handleCommand = (cmdRaw: string) => {
    const cmd = cmdRaw.trim();
    setHistory(prev => [...prev, `${getDisplayPath(currentPath)}> ${cmdRaw}`]);
    
    if (!cmd) return;

    setCmdHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    switch (command) {
        case 'cls':
        case 'clear': setHistory([]); setIsMatrix(false); break;
        case 'exit': onCloseWindow && onCloseWindow(windowId); break;
        case 'color': 
            if (args[0] === 'a') setTextColor('text-green-500');
            else if (args[0] === 'b') setTextColor('text-blue-500');
            else if (args[0] === 'c') setTextColor('text-red-500');
            else if (args[0] === 'f') setTextColor('text-white');
            else setTextColor('text-gray-300');
            break;
        case 'matrix': setIsMatrix(true); setTextColor('text-green-500'); break;
        case 'open':
            const app = args[0]?.toLowerCase();
            if (app) onOpenWindow?.(app as any);
            else setHistory(prev => [...prev, `Usage: open <app_name>`]);
            break;
        case 'echo': setHistory(prev => [...prev, args.join(' ')]); break;
        case 'ver': setHistory(prev => [...prev, 'Microsoft Windows [Version 11.0.22621.1]']); break;
        case 'time': setHistory(prev => [...prev, `Current time is: ${new Date().toLocaleTimeString()}`]); break;
        case 'bsod': onSystemAction?.('bsod'); break;
        case 'whoami': setHistory(prev => [...prev, 'windows\\admin']); break;
        case 'ipconfig': 
             setHistory(prev => [...prev, 
                'Windows IP Configuration', '', 
                'Ethernet adapter Ethernet:', '',
                '   Connection-specific DNS Suffix  . : localdomain',
                '   IPv4 Address. . . . . . . . . . . : 192.168.1.14',
                '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
                '   Default Gateway . . . . . . . . . : 192.168.1.1'
             ]); 
             break;
        case 'ps':
        case 'tasklist':
             const tasks = openWindows?.map(w => `${w.title.padEnd(25)} ${w.id.split('-')[1]}`).join('\n') || 'No active tasks';
             setHistory(prev => [...prev, 'Image Name                   PID', '========================= ========', tasks]);
             break;
        case 'kill':
             const pid = args[0];
             const winToKill = openWindows?.find(w => w.id.includes(pid));
             if (winToKill) {
                 onCloseWindow && onCloseWindow(winToKill.id);
                 setHistory(prev => [...prev, `SUCCESS: Sent termination signal to process with PID ${pid}.`]);
             } else {
                 setHistory(prev => [...prev, `ERROR: The process "${pid}" not found.`]);
             }
             break;
        case 'date': setHistory(prev => [...prev, new Date().toDateString()]); break;
        case 'dir':
        case 'ls':
            const content = getDirContent(currentPath);
            if (content) {
                const lines = [' Directory of ' + getDisplayPath(currentPath), ''];
                Object.entries(content).forEach(([name, data]: [string, any]) => {
                    const type = data.type === 'folder' ? '<DIR>' : '     ';
                    lines.push(`${new Date().toLocaleDateString()}    ${type}         ${name}`);
                });
                setHistory(prev => [...prev, ...lines, '']);
            } else setHistory(prev => [...prev, 'Error reading directory.']);
            break;
        case 'cd':
            const target = args.join(' ');
            if (!target) setHistory(prev => [...prev, getDisplayPath(currentPath)]);
            else if (target === '..') { if (currentPath.length > 1) setCurrentPath(prev => prev.slice(0, -1)); }
            else {
                const currentDir = getDirContent(currentPath);
                if (currentDir && currentDir[target] && currentDir[target].type === 'folder') setCurrentPath(prev => [...prev, target]);
                else setHistory(prev => [...prev, `The system cannot find the path specified.`]);
            }
            break;
        case 'mkdir':
            if (fsOperations) { fsOperations.createItem(currentPath, 'folder'); setHistory(prev => [...prev, `Directory created.`]); }
            break;
        default: setHistory(prev => [...prev, `'${command}' is not recognized as an internal or external command.`]);
    }
    setInput('');
  };

  return (
    <div className={`h-full bg-[#0c0c0c] font-mono text-sm p-2 overflow-y-auto ${textColor} ${isMatrix ? 'matrix-bg' : ''}`} onClick={() => inputRef.current?.focus()}>
       {isMatrix && <div className="fixed inset-0 pointer-events-none opacity-20 animate-pulse bg-green-900/20"></div>}
       {history.map((line, i) => <div key={i} className="whitespace-pre-wrap break-all min-h-[1.2em]">{line}</div>)}
       <div className="flex items-center relative z-10">
          <span className="mr-2">{getDisplayPath(currentPath)}&gt;</span>
          <input ref={inputRef} type="text" className={`flex-1 bg-transparent outline-none border-none ${textColor}`} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} autoComplete="off" autoFocus />
          <div className="w-2 h-4 bg-gray-500 animate-pulse ml-0.5 inline-block"></div>
       </div>
       <div ref={bottomRef}></div>
    </div>
  );
};