import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { ChevronLeft, ChevronRight, ZoomIn, Edit3, RotateCw } from 'lucide-react';

export const Photos: React.FC<AppProps> = ({ contentProps, fs }) => {
  const [currentImg, setCurrentImg] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [siblings, setSiblings] = useState<any[]>([]); // List of images in folder

  // Initialize: Find all images in the same folder
  useEffect(() => {
    if (!contentProps || !fs) return;
    
    const initialContent = contentProps.content;
    const path = contentProps.path; // Full path array e.g. ['root', 'Pictures', 'img.jpg']
    
    // Resolve URL/Content
    const resolveSrc = (content: string) => {
        if (content === 'nature') return 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000';
        if (content === 'car') return 'https://images.unsplash.com/photo-1494905998402-395d579af979?q=80&w=1000';
        if (content === 'chill') return ''; // Audio
        // Fallback or real base64 if implemented
        return content.startsWith('http') || content.startsWith('data:') ? content : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000';
    };

    setCurrentImg(resolveSrc(initialContent));

    // Find Siblings
    if (path && path.length > 1) {
        // Navigate fs to parent folder
        let dir: any = fs.root.content;
        // path.slice(1, -1) skips 'root' and the filename
        const parentPath = path.slice(1, -1); 
        
        let valid = true;
        for (const p of parentPath) {
            if (dir[p] && dir[p].type === 'folder') {
                dir = dir[p].content;
            } else {
                valid = false;
                break;
            }
        }

        if (valid) {
            // Filter images
            const imgs = Object.entries(dir)
                .filter(([_, data]: [string, any]) => data.type === 'image')
                .map(([name, data]: [string, any]) => ({ name, content: resolveSrc(data.content) }));
            
            setSiblings(imgs);
            const myName = path[path.length - 1];
            const idx = imgs.findIndex(i => i.name === myName);
            if (idx !== -1) setCurrentIndex(idx);
        }
    }
  }, [contentProps, fs]);

  const handleNext = () => {
      if (siblings.length <= 1) return;
      const nextIdx = (currentIndex + 1) % siblings.length;
      setCurrentIndex(nextIdx);
      setCurrentImg(siblings[nextIdx].content);
  };

  const handlePrev = () => {
      if (siblings.length <= 1) return;
      const nextIdx = (currentIndex - 1 + siblings.length) % siblings.length;
      setCurrentIndex(nextIdx);
      setCurrentImg(siblings[nextIdx].content);
  };

  return (
    <div className="h-full bg-[#202020] flex flex-col relative overflow-hidden group select-none">
       {/* Toolbar */}
       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#303030]/90 backdrop-blur-md rounded-lg px-4 py-2 text-white text-sm flex gap-6 shadow-xl z-20 transition-transform duration-300 -translate-y-20 group-hover:translate-y-0">
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-400 gap-1">
              <ZoomIn size={18} />
              <span className="text-[10px]">تكبير</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-400 gap-1">
              <Edit3 size={18} />
              <span className="text-[10px]">تحرير</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-400 gap-1">
              <RotateCw size={18} />
              <span className="text-[10px]">تدوير</span>
          </div>
       </div>

       {/* Main View */}
       <div className="flex-1 flex items-center justify-center p-2 relative">
          {/* Nav Buttons */}
          {siblings.length > 1 && (
              <>
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white transition opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white transition opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronRight size={24} />
                </button>
              </>
          )}

          <img 
             key={currentImg} 
             src={currentImg} 
             alt="View" 
             className="max-h-full max-w-full object-contain shadow-lg animate-in fade-in duration-300" 
          />
       </div>

       {/* Bottom Strip */}
       {siblings.length > 0 && (
           <div className="h-16 bg-[#252525] flex items-center justify-center gap-2 overflow-x-auto px-4 z-20 border-t border-[#333]">
               {siblings.map((img, idx) => (
                   <div 
                     key={idx} 
                     className={`h-12 w-16 flex-shrink-0 cursor-pointer border-2 rounded overflow-hidden ${idx === currentIndex ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                     onClick={() => { setCurrentIndex(idx); setCurrentImg(img.content); }}
                   >
                       <img src={img.content} className="w-full h-full object-cover" alt="" />
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};