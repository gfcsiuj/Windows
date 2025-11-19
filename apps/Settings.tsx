import React, { useRef, useState, useEffect } from 'react';
import { AppProps } from '../types';
import { User, Monitor, Bluetooth, Palette, Battery, Volume2, Moon, Sun, Image, Upload, Laptop, Info, RefreshCw, Cpu, HardDrive, Eye, LayoutPanelLeft, LayoutPanelTop, ShieldCheck } from 'lucide-react';

export const SettingsApp: React.FC<AppProps> = ({ isDark, toggleTheme, onSetWallpaper, onSystemAction, accentColor, setAccentColor, nightLight, setNightLight, taskbarAlign, setTaskbarAlign }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('system');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
      const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
      return () => clearInterval(timer);
  }, []);

  const formatUptime = (s: number) => {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      return `${h}h ${m}m ${sec}s`;
  }

  const bgClass = isDark ? 'bg-[#202020] text-white' : 'bg-[#f3f3f3] text-gray-800';
  const sidebarClass = isDark ? 'bg-[#202020]' : 'bg-[#f3f3f3]';
  const contentClass = isDark ? 'bg-[#272727]' : 'bg-white';
  const cardClass = isDark ? 'border-[#333] hover:bg-[#333]' : 'border-gray-200 hover:bg-gray-50';
  const iconBg = isDark ? 'bg-[#333]' : 'bg-[#f3f3f3]';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && onSetWallpaper) {
          const reader = new FileReader();
          reader.onloadend = () => { if (typeof reader.result === 'string') onSetWallpaper(reader.result); };
          reader.readAsDataURL(file);
      }
  };

  const colors = [
      { name: 'blue', hex: '#3b82f6' },
      { name: 'purple', hex: '#a855f7' },
      { name: 'pink', hex: '#ec4899' },
      { name: 'red', hex: '#ef4444' },
      { name: 'orange', hex: '#f97316' },
      { name: 'green', hex: '#22c55e' },
  ];
  
  return (
    <div className={`flex h-full ${bgClass} font-sans`}>
       <div className={`w-64 p-4 space-y-1 overflow-y-auto ${sidebarClass}`}>
          <div className="flex items-center gap-4 mb-6 px-2">
             <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg border-2 border-white/20 relative">
                 AD
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
             </div>
             <div><div className="text-sm font-bold">Admin</div><div className="text-xs opacity-70 text-blue-500 cursor-pointer">الحساب المحلي</div></div>
          </div>
          <div className="relative mb-4 px-2"><input className={`w-full rounded-md py-1.5 px-3 text-xs border focus:border-blue-500 outline-none ${isDark ? 'bg-[#333] border-[#444]' : 'bg-white border-gray-200'}`} placeholder="البحث في الإعدادات" /></div>
          <SettingsNav icon={Monitor} label="النظام" active={activeTab === 'system'} onClick={() => setActiveTab('system')} isDark={isDark} />
          <SettingsNav icon={Bluetooth} label="Bluetooth والأجهزة" isDark={isDark} />
          <SettingsNav icon={Palette} label="إضفاء طابع شخصي" active={activeTab === 'personalization'} onClick={() => setActiveTab('personalization')} isDark={isDark} />
          <SettingsNav icon={Info} label="Windows Update" active={activeTab === 'update'} onClick={() => setActiveTab('update')} isDark={isDark} />
          <div className={`h-px my-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <SettingsNav icon={Info} label="حول" active={activeTab === 'about'} onClick={() => setActiveTab('about')} isDark={isDark} />
       </div>

       <div className={`flex-1 rounded-tl-2xl p-8 overflow-y-auto shadow-sm ${contentClass}`}>
          {activeTab === 'personalization' && (
              <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold mb-6">إضفاء طابع شخصي</h1>
                <div className="grid grid-cols-1 gap-4 max-w-3xl">
                    <div className={`flex items-center gap-4 p-4 border rounded-lg transition cursor-pointer ${cardClass}`} onClick={toggleTheme}>
                        <div className={`p-2.5 rounded-md ${iconBg}`}>{isDark ? <Sun size={22} /> : <Moon size={22} />}</div>
                        <div className="flex-1"><div className="font-medium">اختيار الوضع</div><div className="text-xs opacity-70">{isDark ? 'داكن' : 'فاتح'}</div></div>
                        <button className={`px-4 py-2 rounded text-sm border ${isDark ? 'border-white/20 bg-white/10' : 'border-gray-300 bg-gray-100'}`}>تغيير</button>
                    </div>

                    {/* Taskbar Alignment */}
                    <div className={`flex items-center gap-4 p-4 border rounded-lg transition ${cardClass}`}>
                        <div className={`p-2.5 rounded-md ${iconBg}`}>
                            {taskbarAlign === 'center' ? <LayoutPanelTop size={22} /> : <LayoutPanelLeft size={22} />}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">محاذاة شريط المهام</div>
                            <div className="text-xs opacity-70">اختر مكان عرض زر ابدأ والتطبيقات</div>
                        </div>
                        <div className="flex bg-gray-200 dark:bg-[#333] rounded p-1">
                            <button className={`px-3 py-1 rounded text-xs ${taskbarAlign === 'left' ? 'bg-white dark:bg-black shadow' : ''}`} onClick={() => setTaskbarAlign?.('left')}>يسار</button>
                            <button className={`px-3 py-1 rounded text-xs ${taskbarAlign === 'center' ? 'bg-white dark:bg-black shadow' : ''}`} onClick={() => setTaskbarAlign?.('center')}>توسيط</button>
                        </div>
                    </div>
                    
                    {/* Accent Color */}
                    <div className={`flex flex-col gap-4 p-5 border rounded-lg transition ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-4"><div className={`p-2.5 rounded-md ${iconBg}`}><Palette size={22} className="opacity-80" /></div><div className="flex-1"><div className="font-medium">لون التمييز</div></div></div>
                        <div className="flex gap-2 mt-2">
                            {colors.map(c => (
                                <div 
                                    key={c.name} 
                                    className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 ${accentColor === c.name ? 'border-white shadow-md ring-2 ring-gray-400' : 'border-transparent'}`} 
                                    style={{ backgroundColor: c.hex }}
                                    onClick={() => setAccentColor?.(c.name)}
                                >
                                    {accentColor === c.name && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`flex flex-col gap-4 p-5 border rounded-lg transition ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-4"><div className={`p-2.5 rounded-md ${iconBg}`}><Image size={22} className="opacity-80" /></div><div className="flex-1"><div className="font-medium">الخلفية</div></div></div>
                        <div className="flex gap-4 mt-2">
                            <div className="flex-1 h-32 bg-gray-200 dark:bg-[#333] rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition group" onClick={() => fileInputRef.current?.click()}>
                                <div className="text-center group-hover:scale-105 transition"><Upload className="mx-auto mb-2" /><span className="text-xs font-bold">رفع صورة جديدة</span></div>
                            </div>
                            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        </div>
                    </div>
                </div>
              </div>
          )}

          {activeTab === 'system' && (
              <div className="animate-fadeIn">
                 <h1 className="text-2xl font-bold mb-6">النظام</h1>
                 <div className="grid gap-4 max-w-3xl">
                    <div className={`p-4 border rounded-lg flex items-center gap-4 ${cardClass}`}>
                        <Laptop size={24} />
                        <div className="flex-1">
                            <div className="font-medium">اسم الجهاز</div>
                            <div className="text-xs opacity-70">WINDOWS-11-WEB</div>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs">إعادة تسمية</button>
                    </div>
                    
                    {/* Night Light */}
                    <div className={`p-4 border rounded-lg flex items-center gap-4 ${cardClass}`}>
                        <div className={`p-2 rounded ${nightLight ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}><Eye size={24} /></div>
                        <div className="flex-1">
                            <div className="font-medium">الضوء الليلي</div>
                            <div className="text-xs opacity-70">استخدم ألواناً أكثر دفئاً لحجب الضوء الأزرق</div>
                        </div>
                        <div 
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${nightLight ? 'bg-blue-500' : 'bg-gray-300'}`}
                            onClick={() => setNightLight?.(!nightLight)}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${nightLight ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    <div className={`p-4 border rounded-lg ${cardClass}`}>
                        <div className="flex items-center gap-4 mb-2">
                             <Battery size={24} className="text-green-500" />
                             <div className="flex-1"><div className="font-medium">الطاقة والبطارية</div><div className="text-xs opacity-70">الشاشة قيد التشغيل: {formatUptime(uptime)}</div></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1"><div className="h-full bg-green-500 w-[86%]"></div></div>
                        <div className="text-[10px] text-right opacity-60">حالة البطارية جيدة</div>
                    </div>
                    <div className={`p-4 border rounded-lg ${cardClass}`}>
                        <div className="flex items-center gap-4 mb-2">
                             <HardDrive size={24} className="text-blue-500" />
                             <div className="flex-1"><div className="font-medium">التخزين</div><div className="text-xs opacity-70">تم استخدام 45 جيجابايت من أصل 128 جيجابايت</div></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-600 w-[30%]"></div>
                            <div className="h-full bg-purple-500 w-[10%]"></div>
                            <div className="h-full bg-orange-500 w-[5%]"></div>
                        </div>
                    </div>
                 </div>
              </div>
          )}
          
          {activeTab === 'update' && (
              <div className="animate-fadeIn">
                 <h1 className="text-2xl font-bold mb-6">Windows Update</h1>
                 <div className={`p-6 border rounded-lg flex items-center gap-6 ${isDark ? 'bg-[#333] border-none' : 'bg-gray-50 border-gray-200'}`}>
                     <div className="relative">
                         <RefreshCw size={48} className="text-blue-500 animate-spin-slow" />
                         <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">11</div>
                     </div>
                     <div>
                         <h2 className="font-bold text-lg">أنت مطلع على آخر المستجدات</h2>
                         <p className="text-xs opacity-70">آخر فحص: اليوم، {new Date().toLocaleTimeString()}</p>
                         <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">التحقق من وجود تحديثات</button>
                     </div>
                 </div>
                 <div className={`mt-4 p-4 border rounded-lg flex items-center gap-4 ${cardClass}`}>
                     <ShieldCheck size={24} className="text-green-500" />
                     <div>
                         <div className="font-bold">الحماية من الفيروسات والمخاطر</div>
                         <div className="text-xs opacity-70">لا يلزم اتخاذ إجراء.</div>
                     </div>
                 </div>
              </div>
          )}

          {activeTab === 'about' && (
              <div className="animate-fadeIn">
                   <h1 className="text-2xl font-bold mb-6">حول النظام</h1>
                   <div className="flex flex-col gap-4 max-w-3xl">
                       <div className={`p-6 border rounded-lg flex gap-4 items-start ${cardClass}`}>
                           <Cpu size={40} className="text-blue-500" />
                           <div className="flex-1">
                               <h3 className="font-bold text-lg">مواصفات الجهاز</h3>
                               <div className="grid grid-cols-[120px_1fr] gap-y-2 mt-4 text-sm opacity-80">
                                   <span>اسم الجهاز</span> <span className="font-mono">WINDOWS-11-WEB</span>
                                   <span>المعالج</span> <span>Simulated Web Assembly 12-Core</span>
                                   <span>ذاكرة RAM</span> <span>16.0 GB (Virtual)</span>
                                   <span>وقت التشغيل</span> <span>{formatUptime(uptime)}</span>
                                   <span>معرف الجهاز</span> <span className="truncate text-xs">{window.navigator.userAgent}</span>
                               </div>
                           </div>
                       </div>
                        <div className={`p-6 border rounded-lg flex gap-4 items-center ${cardClass}`}>
                           <RefreshCw size={32} className="text-red-500" />
                           <div className="flex-1"><h3 className="font-bold">إعادة تعيين هذا الكمبيوتر</h3><p className="text-xs opacity-70">إعادة التعيين تعيد النظام لحالته الأصلية.</p></div>
                           <button className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600" onClick={() => onSystemAction?.('reset')}>إعادة تعيين</button>
                       </div>
                   </div>
              </div>
          )}
       </div>
    </div>
  );
};
const SettingsNav = ({ icon: Icon, label, active, onClick, isDark }: any) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${active ? (isDark ? 'bg-[#3d3d3d] text-blue-400' : 'bg-gray-100 text-blue-600') : (isDark ? 'hover:bg-[#333] text-gray-300' : 'hover:bg-gray-50 text-gray-600')}`} onClick={onClick}><Icon size={18} /><span>{label}</span>{active && <div className="mr-auto w-1 h-4 rounded-full bg-blue-500"></div>}</div>
);