import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { Activity, Cpu, HardDrive, Wifi, List, Box } from 'lucide-react';

export const TaskManager: React.FC<AppProps> = ({ openWindows, onCloseWindow }) => {
  const [activeTab, setActiveTab] = useState<'processes' | 'performance'>('processes');
  const [cpuData, setCpuData] = useState<number[]>(Array(20).fill(0));
  const [ramData, setRamData] = useState<number[]>(Array(20).fill(0));
  
  // Simulate changing stats
  useEffect(() => {
      const timer = setInterval(() => {
          setCpuData(prev => [...prev.slice(1), Math.random() * 30 + 10]); // Random 10-40%
          setRamData(prev => [...prev.slice(1), Math.random() * 5 + 40]); // Random 40-45%
      }, 1000);
      return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#202020] text-sm">
       {/* Sidebar */}
       <div className="flex flex-1 overflow-hidden">
          <div className="w-12 bg-[#f0f0f0] dark:bg-[#2b2b2b] flex flex-col items-center py-4 gap-4 border-r border-gray-200 dark:border-[#444]">
               <div className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 rounded" onClick={() => setActiveTab('processes')} title="العمليات"><List size={20} className={activeTab === 'processes' ? 'text-blue-500' : 'text-gray-500'} /></div>
               <div className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 rounded" onClick={() => setActiveTab('performance')} title="الأداء"><Activity size={20} className={activeTab === 'performance' ? 'text-blue-500' : 'text-gray-500'} /></div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col dark:text-white">
              {activeTab === 'processes' && (
                  <div className="flex-1 overflow-auto">
                      <div className="grid grid-cols-[1fr_80px_80px] gap-2 p-2 border-b bg-gray-50 dark:bg-[#252525] font-bold text-xs">
                          <span>الاسم</span>
                          <span>CPU</span>
                          <span>الذاكرة</span>
                      </div>
                      {openWindows?.map(win => (
                          <div key={win.id} className="grid grid-cols-[1fr_80px_80px] gap-2 p-2 hover:bg-blue-50 dark:hover:bg-white/5 items-center text-xs">
                               <div className="flex items-center gap-2">
                                   <Box size={14} className="text-blue-500" />
                                   <span className="font-medium">{win.title}</span>
                               </div>
                               <span>{(Math.random() * 5).toFixed(1)}%</span>
                               <span>{(Math.random() * 100 + 50).toFixed(1)} MB</span>
                          </div>
                      ))}
                      {/* Mock System Processes */}
                      <div className="grid grid-cols-[1fr_80px_80px] gap-2 p-2 hover:bg-blue-50 dark:hover:bg-white/5 items-center text-xs opacity-70">
                           <div className="flex items-center gap-2"><Box size={14} /> <span>System</span></div>
                           <span>1.2%</span><span>120 MB</span>
                      </div>
                      <div className="grid grid-cols-[1fr_80px_80px] gap-2 p-2 hover:bg-blue-50 dark:hover:bg-white/5 items-center text-xs opacity-70">
                           <div className="flex items-center gap-2"><Box size={14} /> <span>Desktop Window Manager</span></div>
                           <span>3.5%</span><span>450 MB</span>
                      </div>
                  </div>
              )}

              {activeTab === 'performance' && (
                  <div className="flex-1 p-4 grid gap-4 overflow-auto">
                       <PerformanceCard title="CPU" value={`${cpuData[cpuData.length-1].toFixed(0)}%`} sub="Virtual 12-Core" data={cpuData} color="blue" icon={Cpu} />
                       <PerformanceCard title="الذاكرة" value={`${ramData[ramData.length-1].toFixed(1)}%`} sub="6.8 / 16.0 GB" data={ramData} color="purple" icon={HardDrive} />
                       <PerformanceCard title="Wi-Fi" value="إرسال: 12 Kbps" sub="Virtual Adapter" data={cpuData.map(x => x/10)} color="green" icon={Wifi} />
                  </div>
              )}
          </div>
       </div>
       
       {/* Footer */}
       <div className="h-8 border-t dark:border-[#444] bg-gray-50 dark:bg-[#2b2b2b] flex items-center px-4 justify-between">
           <span>عدد العمليات: {32 + (openWindows?.length || 0)}</span>
           {activeTab === 'processes' && <button className="px-3 py-0.5 bg-gray-200 dark:bg-[#444] rounded text-xs hover:bg-red-500 hover:text-white transition">إنهاء المهمة</button>}
       </div>
    </div>
  );
};

const PerformanceCard = ({ title, value, sub, data, color, icon: Icon }: any) => (
    <div className="border dark:border-[#444] rounded p-3 flex gap-4 h-32">
        <div className="w-24 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1"><Icon size={16} /> <span className="font-bold text-xs">{title}</span></div>
                <div className="text-xl font-bold">{value}</div>
            </div>
            <div className="text-xs text-gray-500">{sub}</div>
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-[#111] rounded border dark:border-[#333] relative overflow-hidden flex items-end">
            <div className="flex items-end gap-[2%] h-full w-full px-1">
                {data.map((v: number, i: number) => (
                    <div key={i} className={`flex-1 transition-all duration-500 bg-${color}-500 opacity-60`} style={{ height: `${v}%` }}></div>
                ))}
            </div>
        </div>
    </div>
);