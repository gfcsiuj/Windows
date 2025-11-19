import React, { useState } from 'react';
import { AppProps } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Monitor } from 'lucide-react';

export const MediaPlayer: React.FC<AppProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  
  return (
    <div className="flex flex-col h-full bg-[#191919] text-white">
        <div className="flex-1 flex items-center justify-center relative overflow-hidden group">
            {/* Placeholder visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-blue-900/20 animate-pulse"></div>
            
            <div className="z-10 text-center flex flex-col items-center gap-4">
                <div className="w-48 h-48 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-lg shadow-2xl flex items-center justify-center mb-4">
                    <Music size={64} className="text-white/80" />
                </div>
                <h2 className="text-xl font-bold">مقطوعة هادئة</h2>
                <p className="text-gray-400 text-sm">فنان غير معروف - ألبوم 2024</p>
            </div>
        </div>

        {/* Controls */}
        <div className="h-24 bg-[#202020] border-t border-white/10 flex flex-col px-6 py-2 gap-2">
            {/* Progress */}
            <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                <span>1:12</span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full bg-orange-500 w-[30%]"></div>
                </div>
                <span>3:45</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4 text-gray-400">
                    <Monitor size={16} className="hover:text-white cursor-pointer" />
                </div>

                <div className="flex items-center gap-6">
                    <SkipBack size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                    <div 
                        className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center text-black cursor-pointer transition"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                    </div>
                    <SkipForward size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                </div>

                <div className="flex items-center gap-2 w-24">
                    <Volume2 size={16} className="text-gray-400" />
                    <div className="flex-1 h-1 bg-gray-700 rounded-full">
                        <div className="h-full bg-white w-[70%]"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};