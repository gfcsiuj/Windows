import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { Settings as SettingsIcon } from 'lucide-react';

export const Notepad: React.FC<AppProps> = ({ contentProps, fsOperations, isDark }) => {
  const [text, setText] = useState(contentProps?.content || '');
  const [status, setStatus] = useState('جاهز');
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const filePath = contentProps?.path;

  const bgClass = isDark ? 'bg-[#272727] text-white' : 'bg-white text-gray-900';
  const menuClass = isDark ? 'hover:bg-[#3c3c3c]' : 'hover:bg-gray-100';

  useEffect(() => { if (contentProps?.content) setText(contentProps.content); }, [contentProps?.content]);

  const handleSave = () => {
    if (filePath && fsOperations?.updateFileContent) {
        fsOperations.updateFileContent(filePath, text);
        setStatus(`تم الحفظ ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setStatus('جاهز'), 2000);
    } else setStatus('تحذير: ملف غير محفوظ (جديد)');
  };

  const insertDate = () => {
      const date = new Date().toLocaleString();
      setText(prev => prev.slice(0, selectionStart) + date + prev.slice(selectionEnd));
  };

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className={`flex flex-col h-full ${bgClass} font-sans transition-all`}>
      {/* Menu Bar */}
      <div className={`flex items-center px-1 py-1 text-xs select-none border-b ${isDark ? 'bg-[#202020] border-[#333]' : 'bg-white border-gray-200'}`}>
         <div className="flex">
            <div className="relative group">
                <span className={`px-2.5 py-1 rounded cursor-pointer block ${menuClass}`}>ملف</span>
                <div className={`absolute top-full right-0 w-48 shadow-lg border rounded-md py-1 hidden group-hover:block z-50 ${isDark ? 'bg-[#2b2b2b] border-[#444]' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-1.5 cursor-pointer flex justify-between items-center ${menuClass}`} onClick={handleSave}><span>حفظ</span><span className="opacity-50 text-[10px]">Ctrl+S</span></div>
                    <div className={`h-px my-1 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass}`}>خروج</div>
                </div>
            </div>
            <div className="relative group">
                <span className={`px-2.5 py-1 rounded cursor-pointer block ${menuClass}`}>تحرير</span>
                <div className={`absolute top-full right-0 w-48 shadow-lg border rounded-md py-1 hidden group-hover:block z-50 ${isDark ? 'bg-[#2b2b2b] border-[#444]' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-1.5 cursor-pointer flex justify-between items-center ${menuClass}`} onClick={insertDate}><span>التاريخ/الوقت</span><span className="opacity-50 text-[10px]">F5</span></div>
                </div>
            </div>
            <div className="relative group">
                <span className={`px-2.5 py-1 rounded cursor-pointer block ${menuClass}`}>عرض</span>
                <div className={`absolute top-full right-0 w-48 shadow-lg border rounded-md py-1 hidden group-hover:block z-50 ${isDark ? 'bg-[#2b2b2b] border-[#444]' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-1.5 cursor-pointer flex justify-between items-center ${menuClass}`} onClick={() => setWordWrap(!wordWrap)}><span>التفاف النص</span>{wordWrap && <span className="text-blue-500">✓</span>}</div>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass}`} onClick={() => setFontSize(p => p + 2)}>تكبير الخط</div>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass}`} onClick={() => setFontSize(p => Math.max(8, p - 2))}>تصغير الخط</div>
                </div>
            </div>
         </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden relative">
          <div className={`w-10 pt-4 text-right pr-2 opacity-30 text-xs font-mono border-l ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-200 bg-gray-50'}`}>
              {text.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <textarea 
            className={`flex-1 p-4 outline-none resize-none font-mono w-full h-full bg-transparent custom-scrollbar`} 
            style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
            placeholder="ابدأ الكتابة..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onSelect={(e) => { setSelectionStart(e.currentTarget.selectionStart); setSelectionEnd(e.currentTarget.selectionEnd); }}
            spellCheck={false}
            onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
                if (e.key === 'F5') { e.preventDefault(); insertDate(); }
                if (e.ctrlKey && (e.key === '=' || e.key === '+')) { e.preventDefault(); setFontSize(p => p + 2); }
                if (e.ctrlKey && e.key === '-') { e.preventDefault(); setFontSize(p => Math.max(8, p - 2)); }
            }}
          />
      </div>
      
      {/* Status Bar */}
      <div className={`h-7 flex items-center justify-between px-3 text-[11px] select-none ${isDark ? 'bg-[#202020] border-t border-[#333] text-gray-400' : 'bg-[#f3f3f3] border-t border-gray-200 text-gray-600'}`}>
          <span className="truncate max-w-[30%]">{status}</span>
          <div className="flex gap-4 pl-2 border-l border-gray-300 dark:border-gray-700 h-full items-center">
              <span>{wordCount} كلمة</span>
              <span>السطر {text.substring(0, selectionStart).split('\n').length}, عمود {selectionStart - text.lastIndexOf('\n', selectionStart - 1)}</span>
              <span>{(fontSize / 14 * 100).toFixed(0)}%</span>
              <span>UTF-8</span>
          </div>
      </div>
    </div>
  );
};