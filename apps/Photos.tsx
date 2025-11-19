import React from 'react';
import { AppProps } from '../types';

export const Photos: React.FC<AppProps> = ({ contentProps }) => {
  const src = contentProps?.content === 'nature' 
    ? 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000'
    : contentProps?.content === 'car' 
      ? 'https://images.unsplash.com/photo-1494905998402-395d579af979?q=80&w=1000'
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000';

  return (
    <div className="h-full bg-gray-900 flex flex-col relative">
       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 text-white text-sm flex gap-4 backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="cursor-pointer hover:text-blue-400">تكبير</span>
          <span className="cursor-pointer hover:text-blue-400">تحرير</span>
          <span className="cursor-pointer hover:text-blue-400">تدوير</span>
       </div>
       <div className="flex-1 flex items-center justify-center p-4">
          <img src={src} alt="View" className="max-h-full max-w-full shadow-2xl object-contain" />
       </div>
    </div>
  );
};