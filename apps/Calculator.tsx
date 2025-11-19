import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { History, Trash2, Menu, Calculator } from 'lucide-react';

export const CalculatorApp: React.FC<AppProps> = ({ isDark }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const [memory, setMemory] = useState(0);
  
  const handleBtn = (val: string) => {
    if (val === 'C') setDisplay('0');
    else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const res = String(eval(display.replace('^', '**')));
        setHistory(prev => [`${display} = ${res}`, ...prev]);
        setDisplay(res);
      } catch { setDisplay('Error'); }
    } 
    else if (val === '<') setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    else if (val === 'sq') setDisplay(prev => String(Math.sqrt(parseFloat(prev))));
    else if (val === '1/x') setDisplay(prev => String(1 / parseFloat(prev)));
    else if (['sin','cos','tan','log'].includes(val)) setDisplay(prev => String(Math[val as 'sin'](parseFloat(prev))));
    else if (val === 'M+') setMemory(m => m + parseFloat(display));
    else if (val === 'MR') setDisplay(String(memory));
    else if (val === 'MC') setMemory(0);
    else setDisplay(prev => prev === '0' ? val : prev + val);
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          const key = e.key;
          if (/[0-9]/.test(key)) handleBtn(key);
          if (['+','-','*','/','.'].includes(key)) handleBtn(key);
          if (key === 'Enter') handleBtn('=');
          if (key === 'Backspace') handleBtn('<');
          if (key === 'Escape') handleBtn('C');
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]);

  const stdBtns = ['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-', '0', '.', '='];
  const sciBtns = ['sq', '1/x', '^', 'sin', 'cos', 'tan', 'log', 'M+', 'MR', 'MC'];
  const allBtns = isScientific ? [...sciBtns, ...stdBtns] : stdBtns;
  const gridClass = isScientific ? 'grid-cols-5' : 'grid-cols-4';

  const theme = isDark ? { bg: 'bg-[#202020]', btn: 'bg-[#323232] hover:bg-[#3a3a3a] text-white', display: 'text-white' } : { bg: 'bg-[#f3f3f3]', btn: 'bg-white hover:bg-[#f9f9f9] text-black shadow-sm', display: 'text-black' };

  return (
    <div className={`h-full flex relative overflow-hidden ${theme.bg}`}>
      <div className={`flex-1 flex flex-col p-1 transition-all duration-300 ${showHistory ? 'w-2/3 border-l border-gray-500' : 'w-full'}`}>
        <div className="flex items-center gap-2 px-2 py-2">
             <button className="p-2 rounded hover:bg-black/10 dark:hover:bg-white/10" onClick={() => setShowHistory(!showHistory)}><Menu size={16} className={isDark ? "text-white" : "text-gray-700"} /></button>
             <span className={`text-sm font-bold cursor-pointer ${isDark ? "text-white" : "text-gray-700"}`} onClick={() => setIsScientific(!isScientific)}>{isScientific ? 'علمي' : 'قياسي'}</span>
        </div>
        <div className={`flex-1 p-4 text-right text-5xl font-semibold flex items-end justify-end overflow-hidden break-all ${theme.display}`}>{display}</div>
        {memory !== 0 && <div className="text-right px-4 text-xs font-bold opacity-60">M</div>}
        <div className={`grid gap-1 flex-[2] p-1 ${gridClass}`}>
            {allBtns.map(btn => (
                <button key={btn} className={`rounded text-lg font-medium active:scale-95 flex items-center justify-center ${btn === '=' ? 'bg-blue-600 text-white hover:bg-blue-700' : theme.btn}`} onClick={() => handleBtn(btn)}>{btn === '<' ? '⌫' : btn}</button>
            ))}
        </div>
      </div>
      <div className={`absolute top-0 left-0 h-full transition-transform duration-300 flex flex-col z-10 ${showHistory ? 'translate-x-0 w-56' : '-translate-x-full w-56'} ${isDark ? 'bg-[#2c2c2c]' : 'bg-[#f0f0f0]'}`}>
          <div className="flex justify-between items-center p-4"><span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-black'}`}>المحفوظات</span><button onClick={() => setHistory([])} className="p-2 rounded hover:bg-black/10"><Trash2 size={14} /></button></div>
          <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
              {history.map((item, idx) => <div key={idx} className="text-right p-2 hover:bg-black/5 rounded"><div className="text-xs opacity-60">{item.split('=')[0]} =</div><div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{item.split('=')[1]}</div></div>)}
          </div>
      </div>
    </div>
  );
};