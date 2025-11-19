import React, { useState, useRef, useEffect } from 'react';
import { AppProps } from '../types';
import { Eraser, Palette, Save, Square, Circle, MousePointer } from 'lucide-react';

export const Paint: React.FC<AppProps> = ({ fsOperations, showToast }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'rect' | 'circle'>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
      if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = 800;
          canvas.height = 600;
          const context = canvas.getContext('2d');
          if (context) {
              context.fillStyle = 'white';
              context.fillRect(0, 0, canvas.width, canvas.height);
              context.lineCap = 'round';
              context.lineJoin = 'round';
              setCtx(context);
          }
      }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
      if (!ctx) return;
      setIsDrawing(true);
      setSnapshot(ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height));
      const { offsetX, offsetY } = e.nativeEvent;
      setStartPos({ x: offsetX, y: offsetY });
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      
      if (tool === 'brush' || tool === 'eraser') {
         ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
         ctx.lineWidth = size;
      }
  };

  const draw = (e: React.MouseEvent) => {
      if (!isDrawing || !ctx) return;
      const { offsetX, offsetY } = e.nativeEvent;

      if (tool === 'brush' || tool === 'eraser') {
          ctx.lineTo(offsetX, offsetY);
          ctx.stroke();
      } else if (tool === 'rect') {
          ctx.putImageData(snapshot!, 0, 0);
          ctx.strokeStyle = color;
          ctx.lineWidth = size;
          ctx.strokeRect(startPos.x, startPos.y, offsetX - startPos.x, offsetY - startPos.y);
      } else if (tool === 'circle') {
          ctx.putImageData(snapshot!, 0, 0);
          ctx.strokeStyle = color;
          ctx.lineWidth = size;
          ctx.beginPath();
          const r = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
          ctx.arc(startPos.x, startPos.y, r, 0, 2 * Math.PI);
          ctx.stroke();
      }
  };

  const stopDrawing = () => {
      if (isDrawing && ctx) ctx.closePath();
      setIsDrawing(false);
  };

  const saveImage = () => {
      if (canvasRef.current && fsOperations?.createFile) {
          const data = canvasRef.current.toDataURL('image/png');
          const filename = `رسمة_${Date.now()}.png`;
          fsOperations.createFile(['root', 'الصور'], filename, data, 'image');
          showToast?.('الرسام', 'تم حفظ الرسمة في مجلد الصور');
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] select-none">
        {/* Ribbon */}
        <div className="h-24 bg-[#f3f3f3] border-b flex items-center px-4 gap-4">
            <div className="flex flex-col items-center gap-1 pr-4 border-r border-gray-300">
                <button className="p-2 hover:bg-blue-100 rounded text-purple-600 transition" onClick={saveImage} title="حفظ"><Save size={24} /></button>
                <span className="text-[10px] text-gray-600">حفظ</span>
            </div>

            <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-1">
                     <ToolBtn icon={MousePointer} active={tool === 'brush'} onClick={() => setTool('brush')} title="فرشاة" />
                     <ToolBtn icon={Eraser} active={tool === 'eraser'} onClick={() => setTool('eraser')} title="ممحاة" />
                     <ToolBtn icon={Square} active={tool === 'rect'} onClick={() => setTool('rect')} title="مستطيل" />
                     <ToolBtn icon={Circle} active={tool === 'circle'} onClick={() => setTool('circle')} title="دائرة" />
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-36 h-8 bg-white border border-gray-300 flex items-center px-2 gap-2 rounded">
                         <span className="text-xs text-gray-500">الحجم:</span>
                         <input type="range" min="1" max="30" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                     </div>
                 </div>
            </div>

            <div className="flex flex-wrap gap-1 w-48 border-l border-gray-300 pl-4">
                {['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4', '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'].map(c => (
                    <div 
                      key={c} 
                      className={`w-5 h-5 rounded-full cursor-pointer border ${color === c ? 'scale-125 shadow-md ring-1 ring-offset-1 ring-gray-400' : 'border-gray-300 hover:scale-110'}`} 
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    ></div>
                ))}
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-8 bg-[#e0e0e0] flex justify-center items-start shadow-inner">
            <canvas 
              ref={canvasRef} 
              className="bg-white shadow-xl cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
        </div>
        
        {/* Status Bar */}
        <div className="h-6 bg-[#f0f0f0] border-t flex items-center px-2 text-xs gap-4 text-gray-600">
            <span>{startPos.x}, {startPos.y}px</span>
            <span>800 x 600px</span>
        </div>
    </div>
  );
};

const ToolBtn = ({ icon: Icon, active, onClick, title }: any) => (
    <button 
        className={`p-1.5 rounded transition-colors ${active ? 'bg-blue-100 text-blue-600 border border-blue-300 shadow-sm' : 'hover:bg-gray-200 text-gray-700 border border-transparent'}`} 
        onClick={onClick} 
        title={title}
    >
        <Icon size={18} />
    </button>
);