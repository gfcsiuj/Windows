import React from 'react';
import { LucideIcon } from 'lucide-react';

export type AppId = 'explorer' | 'edge' | 'store' | 'settings' | 'notepad' | 'calculator' | 'vscode' | 'photos' | 'terminal' | 'bin' | 'media';

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

export interface AppProps {
  windowId: string;
  contentProps?: any;
  // Passed down from App for global state
  fs?: FileSystem;
  setFs?: React.Dispatch<React.SetStateAction<FileSystem>>;
  isDark?: boolean;
  toggleTheme?: () => void;
}

export interface FileSystemItem {
  type: 'folder' | 'file' | 'image' | 'video' | 'audio';
  content?: string | Record<string, FileSystemItem>;
}

export interface FileSystem {
  [key: string]: FileSystemItem;
}
