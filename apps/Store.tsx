import React from 'react';
import { AppProps } from '../types';
import { Home, Gamepad2, LayoutGrid, FileText, Image, CheckSquare } from 'lucide-react';

export const Store: React.FC<AppProps> = () => {
  return (
    <div className="flex h-full bg-white">
      <div className="w-48 bg-gray-50 p-4 space-y-2 border-l">
         <div className="font-bold text-lg mb-6 text-gray-800">Microsoft Store</div>
         <SidebarBtn icon={Home} label="الرئيسية" active />
         <SidebarBtn icon={Gamepad2} label="الألعاب" />
         <SidebarBtn icon={LayoutGrid} label="التطبيقات" />
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
         {/* Hero */}
         <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-8 flex items-center px-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
               <h1 className="text-3xl font-bold mb-2">أفضل التطبيقات</h1>
               <p className="mb-4 opacity-90">استكشف أدوات الإنتاجية الجديدة.</p>
               <button className="bg-white text-blue-600 px-4 py-2 rounded font-bold shadow hover:bg-gray-100 transition">تصفح الآن</button>
            </div>
            <div className="absolute left-0 top-0 h-full w-1/2 bg-white/10 transform -skew-x-12"></div>
         </div>

         <h3 className="font-bold text-gray-800 mb-4 text-lg">التطبيقات المقترحة</h3>
         <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
            <StoreItem name="Excel" icon={FileText} color="text-green-600" desc="أداة الجداول" />
            <StoreItem name="Word" icon={FileText} color="text-blue-600" desc="محرر المستندات" />
            <StoreItem name="PowerPoint" icon={FileText} color="text-orange-600" desc="العروض التقديمية" />
            <StoreItem name="ToDo" icon={CheckSquare} color="text-blue-400" desc="إدارة المهام" />
            <StoreItem name="Spotify" icon={Image} color="text-green-500" desc="موسيقى" />
            <StoreItem name="Netflix" icon={Image} color="text-red-600" desc="أفلام" />
         </div>
      </div>
    </div>
  );
};

const SidebarBtn = ({ icon: Icon, label, active }: any) => (
  <div className={`p-2 rounded text-sm font-medium cursor-pointer flex items-center gap-3 ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}>
    <Icon size={18} />
    <span>{label}</span>
  </div>
);

const StoreItem = ({ name, icon: Icon, color, desc }: any) => {
  const [installed, setInstalled] = React.useState(false);
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white flex flex-col gap-3 group hover:-translate-y-1 duration-200">
       <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center self-start shadow-sm">
          <Icon size={24} className={color} />
       </div>
       <div>
         <div className="font-bold text-gray-800">{name}</div>
         <div className="text-xs text-gray-500">{desc}</div>
       </div>
       <button 
         className={`text-xs font-bold py-1.5 px-3 rounded mt-auto transition
           ${installed ? 'bg-gray-100 text-gray-500 cursor-default' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
         `}
         onClick={() => setInstalled(true)}
       >
         {installed ? 'تم التثبيت' : 'تثبيت'}
       </button>
    </div>
  );
};