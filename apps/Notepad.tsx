import React from 'react';
import { AppProps } from '../types';

export const Notepad: React.FC<AppProps> = ({ contentProps }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex gap-2 px-2 py-1 border-b text-xs text-gray-600">
        <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">ملف</span>
        <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">تحرير</span>
        <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">عرض</span>
      </div>
      <textarea 
        className="flex-1 p-4 outline-none resize-none font-mono text-sm w-full h-full" 
        placeholder="اكتب هنا..."
        defaultValue={contentProps?.content || ''}
        spellCheck={false}
      />
    </div>
  );
};