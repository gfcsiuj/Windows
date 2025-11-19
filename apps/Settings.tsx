import React from 'react';
import { AppProps } from '../types';
import { User, Monitor, Bluetooth, Palette, Battery, Volume2, Moon, Sun } from 'lucide-react';

export const SettingsApp: React.FC<AppProps> = ({ isDark, toggleTheme }) => {
  const bgClass = isDark ? 'bg-[#202020] text-white' : 'bg-[#f3f3f3] text-gray-800';
  const sidebarClass = isDark ? 'border-[#333]' : 'border-gray-200';
  const contentClass = isDark ? 'bg-[#2b2b2b]' : 'bg-white';
  const cardClass = isDark ? 'border-[#444] hover:bg-[#333]' : 'border-gray-200 hover:bg-gray-50';
  
  return (
    <div className={`flex h-full ${bgClass}`}>
       {/* Sidebar */}
       <div className="w-56 p-2 space-y-1 overflow-y-auto">
          <div className="flex items-center gap-3 p-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">AD</div>
             <div>
               <div className="text-sm font-bold">Admin</div>
               <div className="text-xs opacity-70">حساب محلي</div>
             </div>
          </div>
          
          <SettingsNav icon={Monitor} label="النظام" active isDark={isDark} />
          <SettingsNav icon={Bluetooth} label="Bluetooth والأجهزة" isDark={isDark} />
          <SettingsNav icon={Palette} label="إضفاء طابع شخصي" isDark={isDark} />
          <SettingsNav icon={Battery} label="الطاقة والبطارية" isDark={isDark} />
       </div>

       {/* Content */}
       <div className={`flex-1 rounded-tl-lg shadow-sm p-8 overflow-y-auto m-2 ml-0 ${contentClass}`}>
          <h1 className="text-2xl font-bold mb-6">النظام</h1>
          
          <div className="grid grid-cols-1 gap-4 max-w-2xl">
            <div className={`flex items-center gap-4 p-4 border rounded-lg transition cursor-pointer ${cardClass}`} onClick={toggleTheme}>
                 <div className={`p-2 rounded-md ${isDark ? 'bg-[#333]' : 'bg-gray-100'}`}>
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                 </div>
                 <div className="flex-1">
                   <div className="font-medium">المظهر</div>
                   <div className="text-xs opacity-70">{isDark ? 'الوضع الحالي: داكن' : 'الوضع الحالي: فاتح'}</div>
                 </div>
                 <div className="relative w-10 h-5 bg-gray-300 rounded-full transition-colors duration-300 data-[on=true]:bg-blue-600" data-on={isDark}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isDark ? 'left-0.5' : 'left-5'}`}></div>
                 </div>
            </div>

            <SettingsCard icon={Monitor} title="جهاز العرض" desc="أجهزة العرض، السطوع، الضوء الليلي" isDark={isDark} cardClass={cardClass} />
            <SettingsCard icon={Volume2} title="الصوت" desc="مستوى الصوت، مكبرات الصوت، الميكروفون" isDark={isDark} cardClass={cardClass} />
            <SettingsCard icon={Battery} title="الطاقة" desc="السكون، استخدام البطارية، توفير الطاقة" isDark={isDark} cardClass={cardClass} />
          </div>
       </div>
    </div>
  );
};

const SettingsNav = ({ icon: Icon, label, active, isDark }: any) => (
  <div className={`flex items-center gap-3 p-2 rounded cursor-pointer text-sm font-medium 
    ${active 
        ? (isDark ? 'bg-[#333] text-blue-400' : 'bg-white text-blue-600 shadow-sm') 
        : (isDark ? 'hover:bg-[#333] text-gray-400' : 'hover:bg-gray-200 text-gray-600')}
  `}>
     <Icon size={18} />
     <span>{label}</span>
  </div>
);

const SettingsCard = ({ icon: Icon, title, desc, isDark, cardClass }: any) => (
  <div className={`flex items-center gap-4 p-4 border rounded-lg transition cursor-pointer ${cardClass}`}>
     <div className={`p-2 rounded-md ${isDark ? 'bg-[#333]' : 'bg-gray-100'}`}>
        <Icon size={20} className="opacity-80" />
     </div>
     <div className="flex-1">
       <div className="font-medium">{title}</div>
       <div className="text-xs opacity-70">{desc}</div>
     </div>
     <div className="opacity-50 text-lg">&lsaquo;</div>
  </div>
);