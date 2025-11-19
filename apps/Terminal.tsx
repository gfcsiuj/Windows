import React, { useState, useRef, useEffect } from 'react';
import { AppProps } from '../types';

export const TerminalApp: React.FC<AppProps> = () => {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows [Version 11.0.22621.1]', '(c) Microsoft Corporation. All rights reserved.', '']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    bottomRef.current?.scrollIntoView();
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, `C:\\Users\\Admin> ${cmd}`];
      
      if (cmd === 'cls' || cmd === 'clear') {
        setHistory([]);
      } else if (cmd === 'help') {
        setHistory([...newHistory, 'Supported commands: cls, help, date, ver, echo [text]']);
      } else if (cmd === 'date') {
        setHistory([...newHistory, new Date().toString()]);
      } else if (cmd === 'ver') {
        setHistory([...newHistory, 'Microsoft Windows [Version 11.0.22621.1]']);
      } else if (cmd.startsWith('echo ')) {
        setHistory([...newHistory, cmd.substring(5)]);
      } else if (cmd !== '') {
        setHistory([...newHistory, `'${cmd}' is not recognized as an internal or external command,`, 'operable program or batch file.']);
      } else {
        setHistory(newHistory);
      }
      
      if (cmd !== 'cls' && cmd !== 'clear') {
         setInput('');
      }
    }
  };

  return (
    <div 
      className="h-full bg-[#0c0c0c] text-gray-300 font-mono text-sm p-2 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
       {history.map((line, i) => (
         <div key={i} className="whitespace-pre-wrap break-all min-h-[1.2em]">{line}</div>
       ))}
       <div className="flex items-center">
          <span className="mr-2">C:\Users\Admin&gt;</span>
          <input 
            ref={inputRef}
            type="text" 
            className="flex-1 bg-transparent outline-none border-none text-gray-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoFocus
          />
       </div>
       <div ref={bottomRef}></div>
    </div>
  );
};