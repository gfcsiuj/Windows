import { 
  FolderOpen, 
  Globe, 
  ShoppingBag, 
  Settings, 
  StickyNote, 
  Calculator, 
  Code2, 
  Image as ImageIcon, 
  Terminal, 
  Trash2,
  PlayCircle,
  Palette,
  Camera,
  Activity,
  Gamepad2
} from 'lucide-react';
import { AppConfig } from './types';
import { Explorer } from './apps/Explorer';
import { Edge } from './apps/Edge';
import { Notepad } from './apps/Notepad';
import { CalculatorApp } from './apps/Calculator';
import { VSCode } from './apps/VSCode';
import { Store } from './apps/Store';
import { SettingsApp } from './apps/Settings';
import { Photos } from './apps/Photos';
import { TerminalApp } from './apps/Terminal';
import { MediaPlayer } from './apps/MediaPlayer';
import { Paint } from './apps/Paint';
import { CameraApp } from './apps/Camera';
import { TaskManager } from './apps/TaskManager';
import { TicTacToe } from './apps/TicTacToe';

export const APPS: Record<string, AppConfig> = {
  explorer: {
    id: 'explorer',
    name: 'المستكشف',
    icon: FolderOpen,
    color: 'text-yellow-500',
    component: Explorer,
    defaultWidth: 900,
    defaultHeight: 550
  },
  edge: {
    id: 'edge',
    name: 'Edge',
    icon: Globe,
    color: 'text-sky-500',
    component: Edge,
    defaultWidth: 1000,
    defaultHeight: 650
  },
  store: {
    id: 'store',
    name: 'المتجر',
    icon: ShoppingBag,
    color: 'text-blue-500',
    component: Store,
    defaultWidth: 900,
    defaultHeight: 600
  },
  settings: {
    id: 'settings',
    name: 'الإعدادات',
    icon: Settings,
    color: 'text-gray-600',
    component: SettingsApp,
    defaultWidth: 900,
    defaultHeight: 600
  },
  notepad: {
    id: 'notepad',
    name: 'المفكرة',
    icon: StickyNote,
    color: 'text-blue-400',
    component: Notepad,
    defaultWidth: 650,
    defaultHeight: 500
  },
  calculator: {
    id: 'calculator',
    name: 'الحاسبة',
    icon: Calculator,
    color: 'text-green-500',
    component: CalculatorApp,
    defaultWidth: 320,
    defaultHeight: 520
  },
  paint: {
    id: 'paint',
    name: 'الرسام',
    icon: Palette,
    color: 'text-pink-500',
    component: Paint,
    defaultWidth: 900,
    defaultHeight: 650
  },
  camera: {
    id: 'camera',
    name: 'الكاميرا',
    icon: Camera,
    color: 'text-gray-500',
    component: CameraApp,
    defaultWidth: 700,
    defaultHeight: 500
  },
  taskmanager: {
    id: 'taskmanager',
    name: 'إدارة المهام',
    icon: Activity,
    color: 'text-emerald-500',
    component: TaskManager,
    defaultWidth: 700,
    defaultHeight: 550
  },
  vscode: {
    id: 'vscode',
    name: 'VS Code',
    icon: Code2,
    color: 'text-blue-600',
    component: VSCode,
    defaultWidth: 1000,
    defaultHeight: 700
  },
  photos: {
    id: 'photos',
    name: 'الصور',
    icon: ImageIcon,
    color: 'text-purple-500',
    component: Photos,
    defaultWidth: 800,
    defaultHeight: 600
  },
  media: {
    id: 'media',
    name: 'ميديا بلاير',
    icon: PlayCircle,
    color: 'text-orange-500',
    component: MediaPlayer,
    defaultWidth: 700,
    defaultHeight: 500
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    color: 'text-gray-700',
    component: TerminalApp,
    defaultWidth: 750,
    defaultHeight: 450
  },
  tictactoe: {
    id: 'tictactoe',
    name: 'X / O',
    icon: Gamepad2,
    color: 'text-rose-500',
    component: TicTacToe,
    defaultWidth: 400,
    defaultHeight: 500
  },
  bin: {
      id: 'bin',
      name: 'سلة المحذوفات',
      icon: Trash2,
      color: 'text-gray-500',
      component: Explorer, // Reuses explorer
      defaultWidth: 800,
      defaultHeight: 500
  }
};

export const INITIAL_FILE_SYSTEM = {
  "root": {
    type: 'folder',
    content: {
      "المستندات": { 
        type: "folder", 
        content: { 
          "عني.txt": { type: "file", content: "مرحباً! أنا مطور واجهات أمامية شغوف ببناء تجارب ويب استثنائية." },
          "السيرة_الذاتية.txt": { type: "file", content: "خبرة 5 سنوات في React و TypeScript\nبناء أنظمة تصميم متكاملة.\nالعمل مع فرق عالمية." },
          "مشروع_ويندوز.js": { type: "file", content: "console.log('Welcome to my Portfolio OS!');" }
        } 
      },
      "سطح المكتب": { 
        type: "folder", 
        content: {
          "مشروعي_القادم.txt": { type: "file", content: "فكرة تطبيق ثوري للذكاء الاصطناعي..." }
        } 
      },
      "التنزيلات": { type: "folder", content: {} },
      "سلة المحذوفات": { type: "folder", content: {} },
      "الصور": { 
        type: "folder", 
        content: { 
          "تصميم_ui.jpg": { type: "image", content: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000" }, 
          "مكتب_العمل.jpg": { type: "image", content: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1000" } 
        } 
      },
      "الموسيقى": {
        type: "folder",
        content: {
          "تركيز_عميق.mp3": { type: "audio", content: "chill" }
        }
      }
    }
  }
};