import React, { useState, useEffect, useRef } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { APPS } from '../constants';
import { DesktopItem, IconPosition, ContextMenuState, ViewMode, SortMode, MenuItemConfig, AppId } from '../types';
import { Monitor, LayoutGrid, RefreshCw, FilePlus, FolderPlus, Settings, Trash2, Edit, Copy, ExternalLink } from 'lucide-react';

interface DesktopProps {
  wallpaper: string;
  isDark: boolean;
  onOpenWindow: (appId: AppId) => void;
  onOpenSettings: () => void;
}

// Grid Configuration
const GRID_W = 100;
const GRID_H = 106;
const START_OFFSET_X = 10;
const START_OFFSET_Y = 10;

// Initial Items
const INITIAL_ITEMS: DesktopItem[] = [
  { id: 'bin', appId: 'bin', name: 'سلة المحذوفات', type: 'app', position: { x: START_OFFSET_X, y: START_OFFSET_Y } },
  { id: 'explorer', appId: 'explorer', name: 'المستكشف', type: 'app', position: { x: START_OFFSET_X, y: START_OFFSET_Y + GRID_H } },
  { id: 'edge', appId: 'edge', name: 'Edge', type: 'app', position: { x: START_OFFSET_X, y: START_OFFSET_Y + GRID_H * 2 } },
  { id: 'store', appId: 'store', name: 'المتجر', type: 'app', position: { x: START_OFFSET_X, y: START_OFFSET_Y + GRID_H * 3 } },
  { id: 'vscode', appId: 'vscode', name: 'VS Code', type: 'app', position: { x: START_OFFSET_X + GRID_W, y: START_OFFSET_Y } },
  { id: 'calculator', appId: 'calculator', name: 'الحاسبة', type: 'app', position: { x: START_OFFSET_X + GRID_W, y: START_OFFSET_Y + GRID_H } },
];

export const Desktop: React.FC<DesktopProps> = ({ wallpaper, isDark, onOpenWindow, onOpenSettings }) => {
  // --- State ---
  const [items, setItems] = useState<DesktopItem[]>(() => {
    const saved = localStorage.getItem('win11_desktop_items_v2');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });
  const [viewMode, setViewMode] = useState<ViewMode>('medium');
  const [sortMode, setSortMode] = useState<SortMode>('name');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // To trigger "Refresh" animation

  // Dragging State
  const [dragState, setDragState] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    initialPositions: Record<string, IconPosition>;
  } | null>(null);

  // Selection Box State
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const desktopRef = useRef<HTMLDivElement>(null);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('win11_desktop_items_v2', JSON.stringify(items));
  }, [items]);

  // --- Logic: Selection Box Intersection ---
  useEffect(() => {
    if (!selectionBox) return;

    const sbRect = {
      left: Math.min(selectionBox.startX, selectionBox.currentX),
      top: Math.min(selectionBox.startY, selectionBox.currentY),
      right: Math.max(selectionBox.startX, selectionBox.currentX),
      bottom: Math.max(selectionBox.startY, selectionBox.currentY),
    };

    const newlySelected: string[] = [];

    // We need to check DOM elements because positions are CSS based (right/top)
    // But simplified math is better: Convert RTL 'right' to 'left' for intersection
    const screenW = window.innerWidth;

    items.forEach(item => {
       // Approx item rect based on viewMode
       const itemW = viewMode === 'small' ? 80 : viewMode === 'medium' ? 96 : 128;
       const itemH = viewMode === 'small' ? 80 : viewMode === 'medium' ? 96 : 128;
       
       const itemRight = item.position.x; // distance from right
       const itemLeftPx = screenW - itemRight - itemW; 
       const itemTopPx = item.position.y;

       // Check intersection
       if (
         itemLeftPx < sbRect.right &&
         itemLeftPx + itemW > sbRect.left &&
         itemTopPx < sbRect.bottom &&
         itemTopPx + itemH > sbRect.top
       ) {
         newlySelected.push(item.id);
       }
    });
    
    // Merge with ctrl key logic if needed, but for box select we usually replace or add
    // For simplicity: Box select replaces selection
    setSelectedIds(newlySelected);

  }, [selectionBox, viewMode, items]);


  // --- Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    // If clicked on background
    if (e.target === e.currentTarget) {
       setSelectionBox({
         startX: e.clientX,
         startY: e.clientY,
         currentX: e.clientX,
         currentY: e.clientY
       });
       setSelectedIds([]);
       setRenamingId(null);
       setContextMenu(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Handle Selection Box
    if (selectionBox) {
      setSelectionBox(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
    }

    // 2. Handle Dragging
    if (dragState && dragState.active) {
      // Calculate delta
      const deltaX = dragState.startX - e.clientX; // RTL: Move Left (decrease clientX) = Increase Right Offset (positive delta)
      const deltaY = e.clientY - dragState.startY;

      setItems(prev => prev.map(item => {
        if (selectedIds.includes(item.id)) {
          const init = dragState.initialPositions[item.id];
          return {
            ...item,
            position: {
              x: init.x + deltaX,
              y: init.y + deltaY
            }
          };
        }
        return item;
      }));
    }
  };

  const handleMouseUp = () => {
    // Snap to Grid
    if (dragState && dragState.active) {
       setItems(prev => prev.map(item => {
         if (selectedIds.includes(item.id)) {
           // Snap Math
           let snappedX = Math.round(item.position.x / GRID_W) * GRID_W;
           let snappedY = Math.round(item.position.y / GRID_H) * GRID_H;
           
           // Boundary Checks
           if (snappedX < 0) snappedX = 0;
           if (snappedY < 0) snappedY = 0;
           
           return { ...item, position: { x: snappedX, y: snappedY } };
         }
         return item;
       }));
    }

    setSelectionBox(null);
    setDragState(null);
  };

  const handleIconMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setContextMenu(null);
    
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      if (!selectedIds.includes(id)) {
        setSelectedIds([id]);
      }
    }

    // Prepare Drag
    const initialPos: Record<string, IconPosition> = {};
    items.forEach(item => { initialPos[item.id] = { ...item.position }; });
    
    setDragState({
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      initialPositions: initialPos
    });
  };

  // --- Features ---

  const sortIcons = (mode: SortMode) => {
    setSortMode(mode);
    const sorted = [...items].sort((a, b) => {
      if (mode === 'name') return a.name.localeCompare(b.name);
      if (mode === 'type') return a.type.localeCompare(b.type);
      return 0;
    });

    // Re-layout Grid (Top to Bottom, Right to Left)
    const heightPx = window.innerHeight - 48;
    const itemsPerCol = Math.floor((heightPx - START_OFFSET_Y) / GRID_H);

    const newItems = sorted.map((item, idx) => {
       const col = Math.floor(idx / itemsPerCol);
       const row = idx % itemsPerCol;
       return {
         ...item,
         position: {
           x: START_OFFSET_X + (col * GRID_W),
           y: START_OFFSET_Y + (row * GRID_H)
         }
       };
    });
    setItems(newItems);
  };

  const createNewItem = (type: 'folder' | 'file') => {
    const id = `${type}_${Date.now()}`;
    const name = type === 'folder' ? 'مجلد جديد' : 'مستند نصي جديد';
    
    // Find first empty spot? For now just offset
    const newItem: DesktopItem = {
      id,
      name,
      type,
      position: { x: START_OFFSET_X + GRID_W * 2, y: START_OFFSET_Y + GRID_H * 2 } // Simply place somewhere visible
    };
    
    setItems(prev => [...prev, newItem]);
    setSelectedIds([id]);
    setTimeout(() => setRenamingId(id), 100); // Auto rename
  };

  const deleteSelected = () => {
    setItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
    setSelectedIds([]);
  };

  const handleRename = (id: string, newName: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, name: newName } : i));
    setRenamingId(null);
  };

  // --- Context Menu Construction ---
  const handleContextMenu = (e: React.MouseEvent, targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (targetId && !selectedIds.includes(targetId)) {
        setSelectedIds([targetId]);
    }

    const menus: MenuItemConfig[] = [];

    if (targetId) {
        // Icon Menu
        const item = items.find(i => i.id === targetId);
        menus.push({ label: 'فتح', icon: ExternalLink, bold: true, action: () => item?.appId ? onOpenWindow(item.appId) : null });
        menus.push({ label: 'نسخ كمسار', icon: Copy, action: () => {} });
        menus.push({ separator: true, label: '' });
        menus.push({ label: 'إعادة تسمية', icon: Edit, action: () => setRenamingId(targetId) });
        menus.push({ label: 'حذف', icon: Trash2, action: deleteSelected });
    } else {
        // Desktop Menu
        menus.push({ 
          label: 'عرض', 
          icon: LayoutGrid, 
          hasSubmenu: true, 
          submenu: [
            { label: 'أيقونات كبيرة', action: () => setViewMode('large'), bold: viewMode === 'large' },
            { label: 'أيقونات متوسطة', action: () => setViewMode('medium'), bold: viewMode === 'medium' },
            { label: 'أيقونات صغيرة', action: () => setViewMode('small'), bold: viewMode === 'small' },
          ] 
        });
        menus.push({ 
          label: 'فرز حسب', 
          icon: LayoutGrid, // Using similar icon
          hasSubmenu: true,
          submenu: [
             { label: 'الاسم', action: () => sortIcons('name') },
             { label: 'النوع', action: () => sortIcons('type') },
             { label: 'التاريخ', action: () => sortIcons('date') },
          ]
        });
        menus.push({ label: 'تحديث', icon: RefreshCw, action: () => setRefreshKey(p => p + 1) });
        menus.push({ separator: true, label: '' });
        menus.push({ 
          label: 'جديد', 
          icon: FolderPlus, 
          hasSubmenu: true,
          submenu: [
            { label: 'مجلد', icon: FolderPlus, action: () => createNewItem('folder') },
            { label: 'مستند نصي', icon: FilePlus, action: () => createNewItem('file') },
          ]
        });
        menus.push({ separator: true, label: '' });
        menus.push({ label: 'إعدادات العرض', icon: Monitor, action: onOpenSettings });
        menus.push({ label: 'تخصيص', icon: Settings, action: onOpenSettings });
    }

    setContextMenu({ x: e.clientX, y: e.clientY, type: targetId ? 'icon' : 'desktop', items: menus });
  };


  return (
    <div 
      ref={desktopRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none ${refreshKey % 2 === 0 ? 'animate-fade-in' : 'animate-pulse-quick'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => handleContextMenu(e)}
    >
        {/* Wallpaper */}
        <div 
            className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-700 hover:scale-[1.01]" 
            style={{ backgroundImage: `url(${wallpaper})` }} 
        />
        <div className="absolute inset-0 bg-black/0 dark:bg-black/20 -z-10" />

        {/* Selection Box */}
        {selectionBox && (
            <div 
                className="absolute z-50 border border-[rgba(0,120,212,0.4)] bg-[rgba(0,120,212,0.1)] pointer-events-none"
                style={{
                    left: Math.min(selectionBox.startX, selectionBox.currentX),
                    top: Math.min(selectionBox.startY, selectionBox.currentY),
                    width: Math.abs(selectionBox.currentX - selectionBox.startX),
                    height: Math.abs(selectionBox.currentY - selectionBox.startY)
                }}
            />
        )}

        {/* Icons */}
        {items.map(item => (
            <DesktopIcon 
                key={item.id}
                item={item}
                selected={selectedIds.includes(item.id)}
                isDragging={selectedIds.includes(item.id) && (dragState?.active || false)}
                viewMode={viewMode}
                renaming={renamingId === item.id}
                onOpen={() => item.appId && onOpenWindow(item.appId)}
                onMouseDown={(e) => handleIconMouseDown(e, item.id)}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
                onRename={(name) => handleRename(item.id, name)}
            />
        ))}

        {contextMenu && (
            <ContextMenu 
                x={contextMenu.x} 
                y={contextMenu.y} 
                items={contextMenu.items} 
                isDark={isDark} 
                onClose={() => setContextMenu(null)}
            />
        )}
    </div>
  );
};