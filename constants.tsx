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
  PlayCircle
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

export const APPS: Record<string, AppConfig> = {
  explorer: {
    id: 'explorer',
    name: 'المستكشف',
    icon: FolderOpen,
    color: 'text-yellow-500',
    component: Explorer,
    defaultWidth: 800,
    defaultHeight: 500
  },
  edge: {
    id: 'edge',
    name: 'Edge',
    icon: Globe,
    color: 'text-sky-500',
    component: Edge,
    defaultWidth: 900,
    defaultHeight: 600
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
    defaultWidth: 800,
    defaultHeight: 500
  },
  notepad: {
    id: 'notepad',
    name: 'المفكرة',
    icon: StickyNote,
    color: 'text-blue-400',
    component: Notepad,
    defaultWidth: 600,
    defaultHeight: 400
  },
  calculator: {
    id: 'calculator',
    name: 'الحاسبة',
    icon: Calculator,
    color: 'text-green-500',
    component: CalculatorApp,
    defaultWidth: 320,
    defaultHeight: 480
  },
  vscode: {
    id: 'vscode',
    name: 'VS Code',
    icon: Code2,
    color: 'text-blue-600',
    component: VSCode,
    defaultWidth: 900,
    defaultHeight: 600
  },
  photos: {
    id: 'photos',
    name: 'الصور',
    icon: ImageIcon,
    color: 'text-purple-500',
    component: Photos,
    defaultWidth: 700,
    defaultHeight: 500
  },
  media: {
    id: 'media',
    name: 'ميديا بلاير',
    icon: PlayCircle,
    color: 'text-orange-500',
    component: MediaPlayer,
    defaultWidth: 600,
    defaultHeight: 450
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    color: 'text-gray-700',
    component: TerminalApp,
    defaultWidth: 700,
    defaultHeight: 400
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
          "ملاحظة.txt": { type: "file", content: "مرحبا بك في ويندوز 11 ويب! تم حفظ هذا الملف محلياً." },
          "مشروع.js": { type: "file", content: "console.log('Hello World');" }
        } 
      },
      "سلة المحذوفات": { type: "folder", content: {} },
      "الصور": { 
        type: "folder", 
        content: { 
          "طبيعة.jpg": { type: "image", content: "nature" }, 
          "سيارة.jpg": { type: "image", content: "car" } 
        } 
      },
      "الموسيقى": {
        type: "folder",
        content: {
          "لحن_هادئ.mp3": { type: "audio", content: "chill" }
        }
      },
      "التنزيلات": { type: "folder", content: {} }
    }
  }
};