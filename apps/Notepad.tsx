import React, { useState, useEffect, useRef } from 'react';
import { AppProps } from '../types';
import { Settings as SettingsIcon, Search, ZoomIn, ZoomOut, Type } from 'lucide-react';

export const Notepad: React.FC<AppProps> = ({ contentProps, fsOperations, isDark }) => {
  const [text, setText] = useState(contentProps?.content || '');
  const [status, setStatus] = useState('جاهز');
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('font-mono');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [showFind, setShowFind] = useState(false);
  const [findTerm, setFindTerm] = useState('');
  
  const filePath = contentProps?.path;
  const editorRef = useRef<HTMLTextAreaElement>(null);

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

  const handleFind = () => {
      if (!findTerm) return;
      const index = text.indexOf(findTerm, selectionEnd); // Find next
      if (index !== -1) {
          editorRef.current?.setSelectionRange(index, index + findTerm.length);
          editorRef.current?.focus();
          setSelectionStart(index);
          setSelectionEnd(index + findTerm.length);
      } else {
          // Loop around
          const wrapIndex = text.indexOf(findTerm, 0);
          if (wrapIndex !== -1) {
             editorRef.current?.setSelectionRange(wrapIndex, wrapIndex + findTerm.length);
             editorRef.current?.focus();
          } else {
             setStatus('لم يتم العثور على النص');
          }
      }
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
                    <div className={`px-4 py-1.5 cursor-pointer flex justify-between items-center ${menuClass}`} onClick={() => setShowFind(!showFind)}><span>بحث...</span><span className="opacity-50 text-[10px]">Ctrl+F</span></div>
                </div>
            </div>
            <div className="relative group">
                <span className={`px-2.5 py-1 rounded cursor-pointer block ${menuClass}`}>عرض</span>
                <div className={`absolute top-full right-0 w-48 shadow-lg border rounded-md py-1 hidden group-hover:block z-50 ${isDark ? 'bg-[#2b2b2b] border-[#444]' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-1.5 cursor-pointer flex justify-between items-center ${menuClass}`} onClick={() => setWordWrap(!wordWrap)}><span>التفاف النص</span>{wordWrap && <span className="text-blue-500">✓</span>}</div>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass} flex justify-between`} onClick={() => setFontSize(p => p + 2)}><span>تكبير الخط</span><span>Ctrl +</span></div>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass} flex justify-between`} onClick={() => setFontSize(p => Math.max(8, p - 2))}><span>تصغير الخط</span><span>Ctrl -</span></div>
                </div>
            </div>
            <div className="relative group">
                <span className={`px-2.5 py-1 rounded cursor-pointer block ${menuClass}`}>تنسيق</span>
                <div className={`absolute top-full right-0 w-48 shadow-lg border rounded-md py-1 hidden group-hover:block z-50 ${isDark ? 'bg-[#2b2b2b] border-[#444]' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass} ${fontFamily === 'font-mono' ? 'font-bold' : ''}`} onClick={() => setFontFamily('font-mono')}>خط Monospace</div>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass} ${fontFamily === 'font-sans' ? 'font-bold' : ''}`} onClick={() => setFontFamily('font-sans')}>خط Sans-Serif</div>
                    <div className={`px-4 py-1.5 cursor-pointer ${menuClass} ${fontFamily === 'font-serif' ? 'font-bold' : ''}`} onClick={() => setFontFamily('font-serif')}>خط Serif</div>
                </div>
            </div>
         </div>
      </div>
      
      {/* Search Bar */}
      {showFind && (
          <div className={`h-10 border-b flex items-center px-2 gap-2 ${isDark ? 'bg-[#2b2b2b] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
              <input 
                className={`h-7 px-2 rounded border outline-none text-xs flex-1 ${isDark ? 'bg-[#333] border-[#444]' : 'bg-white border-gray-300'}`}
                placeholder="بحث عن..." 
                value={findTerm} 
                onChange={e => setFindTerm(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleFind()}
                autoFocus
              />
              <button className="p-1 hover:bg-blue-500 hover:text-white rounded" onClick={handleFind}><Search size={14}/></button>
          </div>
      )}

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden relative">
          <div className={`w-10 pt-4 text-right pr-2 opacity-30 text-xs font-mono border-l ${isDark ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-200 bg-gray-50'}`}>
              {text.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <textarea 
            ref={editorRef}
            className={`flex-1 p-4 outline-none resize-none w-full h-full bg-transparent custom-scrollbar ${fontFamily}`} 
            style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
            placeholder="ابدأ الكتابة..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onSelect={(e) => { setSelectionStart(e.currentTarget.selectionStart); setSelectionEnd(e.currentTarget.selectionEnd); }}
            spellCheck={false}
            onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
                if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); setShowFind(true); }
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
              <div className="flex items-center gap-1">
                  <ZoomOut size={10} className="cursor-pointer" onClick={() => setFontSize(p => Math.max(8, p-2))} />
                  <span>{(fontSize / 14 * 100).toFixed(0)}%</span>
                  <ZoomIn size={10} className="cursor-pointer" onClick={() => setFontSize(p => p+2)} />
              </div>
              <span>UTF-8</span>
          </div>
      </div>
    </div>
  );
};