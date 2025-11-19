import React from 'react';
import { LucideIcon } from 'lucide-react';

export type AppId = 'explorer' | 'edge' | 'store' | 'settings' | 'notepad' | 'calculator' | 'vscode' | 'photos' | 'terminal' | 'bin' | 'media' | 'paint' | 'camera' | 'taskmanager' | 'tictactoe';

export interface AppConfig {
  id: AppId;
  name: string;
  icon: LucideIcon;
  color: string;
  defaultWidth?: number;
  defaultHeight?: number;
  component: React.FC<AppProps>;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  contentProps?: any;
}

export interface RecentFile {
  name: string;
  type: 'file' | 'image' | 'video' | 'audio';
  date: Date;
}

export interface ToastNotification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export interface BatteryState {
  level: number;
  charging: boolean;
}

export interface AppProps {
  windowId: string;
  contentProps?: any;
  // Global State
  fs?: FileSystem;
  setFs?: React.Dispatch<React.SetStateAction<FileSystem>>;
  // Methods
  onOpenWindow?: (appId: AppId, contentProps?: any) => void;
  onCloseWindow?: (id: string) => void;
  onAddToRecents?: (file: RecentFile) => void;
  onSetWallpaper?: (url: string) => void; 
  showToast?: (title: string, message: string) => void;
  onSystemAction?: (action: 'shutdown' | 'restart' | 'reset' | 'bsod' | 'lock' | 'sleep') => void;
  fsOperations?: FsOperations;
  // Theme & Personalization
  isDark?: boolean;
  toggleTheme?: () => void;
  accentColor?: string;
  setAccentColor?: (color: string) => void;
  nightLight?: boolean;
  setNightLight?: (enabled: boolean) => void;
  taskbarAlign?: 'center' | 'left'; // 'left' in LTR is 'right' in RTL visually if we flip
  setTaskbarAlign?: (align: 'center' | 'left') => void;
  // System Info
  openWindows?: WindowState[];
  battery?: BatteryState;
  isOnline?: boolean;
}

export interface FileSystemItem {
  type: 'folder' | 'file' | 'image' | 'video' | 'audio';
  content?: string | Record<string, FileSystemItem>;
  dateModified?: Date;
  size?: number;
}

export interface FileSystem {
  [key: string]: FileSystemItem;
}

export interface FsOperations {
  renameItem: (path: string[], oldName: string, newName: string) => void;
  deleteItem: (path: string[], name: string) => void;
  createItem: (path: string[], type: 'folder' | 'file') => void;
  createFile: (path: string[], name: string, content: string, type?: 'file' | 'image' | 'video' | 'audio') => void;
  updateFileContent: (path: string[], content: string) => void;
  resetFileSystem: () => void;
}

export interface IconPosition {
  x: number; // Right offset (RTL)
  y: number; // Top offset
}

export interface DesktopItem {
  id: string;
  appId?: AppId; // If it's a system app
  name: string;
  type: 'app' | 'folder' | 'file';
  position: IconPosition;
}

export type ViewMode = 'small' | 'medium' | 'large' | 'list';
export type SortMode = 'name' | 'date' | 'type';

export interface ContextMenuState {
  x: number; 
  y: number; 
  type: 'desktop' | 'taskbar' | 'icon';
  targetId?: string;
  items?: MenuItemConfig[];
}

export interface MenuItemConfig {
  label: string;
  icon?: LucideIcon;
  action?: () => void;
  hasSubmenu?: boolean;
  submenu?: MenuItemConfig[];
  separator?: boolean;
  bold?: boolean;
  disabled?: boolean;
}