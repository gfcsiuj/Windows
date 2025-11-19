import React, { useRef, useState, useEffect } from 'react';
import { AppProps } from '../types';
import { Camera, Video, RotateCcw, Settings } from 'lucide-react';

export const CameraApp: React.FC<AppProps> = ({ fsOperations, showToast }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => { stopCamera(); };
  }, []);

  const startCamera = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
              setStreaming(true);
              setError(null);
          }
      } catch (err) {
          setError('لا يمكن الوصول للكاميرا. يرجى التحقق من الإذن في المتصفح.');
          console.error(err);
      }
  };

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          setStreaming(false);
      }
  };

  const takePhoto = () => {
      if (videoRef.current && canvasRef.current && fsOperations?.createFile) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const data = canvas.toDataURL('image/jpeg');
              const filename = `IMG_${Date.now()}.jpg`;

              // Visual Flash Effect
              const flash = document.getElementById('camera-flash');
              if(flash) {
                  flash.style.opacity = '1';
                  setTimeout(() => flash.style.opacity = '0', 100);
              }
              
              // Save to File System
              fsOperations.createFile(['root', 'الصور'], filename, data, 'image');
              showToast?.('الكاميرا', 'تم حفظ الصورة في مجلد الصور');
          }
      }
  };

  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden select-none">
        {error ? (
            <div className="flex-1 flex items-center justify-center text-white flex-col gap-4">
                <Camera size={48} />
                <p className="text-sm opacity-80">{error}</p>
                <button onClick={startCamera} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-xs">إعادة المحاولة</button>
            </div>
        ) : (
            <div className="flex-1 relative flex items-center justify-center bg-[#111]">
                <video ref={videoRef} className="max-h-full max-w-full transform scale-x-[-1]" />
                <canvas ref={canvasRef} className="hidden" />
                <div id="camera-flash" className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"></div>
            </div>
        )}

        {/* Controls */}
        <div className="h-24 bg-black/80 backdrop-blur flex items-center justify-center gap-12 relative z-10 border-t border-white/10">
            <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" onClick={stopCamera} title="إيقاف"><Settings size={20} /></button>
            
            <button 
                className="w-16 h-16 rounded-full border-4 border-white bg-transparent p-1 flex items-center justify-center hover:bg-white/10 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={takePhoto}
                disabled={!!error}
            >
                <div className="w-full h-full bg-white rounded-full"></div>
            </button>

            <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" title="فيديو (غير متاح)"><Video size={20} /></button>
        </div>
    </div>
  );
};