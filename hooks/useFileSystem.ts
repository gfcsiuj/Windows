import { useState, useEffect, useCallback } from 'react';
import { FileSystem, FileSystemItem, FsOperations } from '../types';
import { INITIAL_FILE_SYSTEM } from '../constants';

export const useFileSystem = () => {
  const [fs, setFs] = useState<FileSystem>(() => {
    const saved = localStorage.getItem('win11_fs_v2');
    return saved ? JSON.parse(saved) : INITIAL_FILE_SYSTEM;
  });

  useEffect(() => {
    localStorage.setItem('win11_fs_v2', JSON.stringify(fs));
  }, [fs]);

  // Helper: Get Directory from Path Array
  const getDir = (root: FileSystem, path: string[]) => {
    let current: any = root;
    for (const p of path) {
      if (p === 'root') {
         current = root.root.content;
      } else if (current[p]?.content) {
         current = current[p].content;
      } else {
         return null; // Invalid path
      }
    }
    return current;
  };

  // 1. Rename with Duplicate Prevention
  const renameItem = useCallback((path: string[], oldName: string, newName: string) => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const dir = getDir(newFs, path);
      
      if (dir && dir[oldName]) {
        let finalName = newName;
        let counter = 2;
        // Check duplicates
        while (dir[finalName] && finalName !== oldName) {
           finalName = `${newName} (${counter})`;
           counter++;
        }

        dir[finalName] = dir[oldName];
        if (finalName !== oldName) delete dir[oldName];
      }
      return newFs;
    });
  }, []);

  // 2. Delete (Move to Recycle Bin)
  const deleteItem = useCallback((path: string[], name: string) => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const dir = getDir(newFs, path);
      
      if (dir && dir[name]) {
        const itemToMove = dir[name];
        delete dir[name];

        // Add to Bin (Assume Bin is at root['سلة المحذوفات'])
        // Handle duplicate names in bin
        const binDir = newFs.root.content['سلة المحذوفات']?.content;
        if (binDir) {
            let finalName = name;
            let counter = 2;
            while (binDir[finalName]) {
                finalName = `${name} (${counter})`;
                counter++;
            }
            binDir[finalName] = itemToMove;
        }
      }
      return newFs;
    });
  }, []);

  // 3. Create Item
  const createItem = useCallback((path: string[], type: 'folder' | 'file') => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const dir = getDir(newFs, path);
      
      if (dir) {
        const baseName = type === 'folder' ? 'مجلد جديد' : 'مستند نصي جديد.txt';
        let finalName = baseName;
        let counter = 2;
        
        while (dir[finalName]) {
            // Strip extension for counter placement if file
            if (type === 'file') {
                finalName = `مستند نصي جديد (${counter}).txt`;
            } else {
                finalName = `${baseName} (${counter})`;
            }
            counter++;
        }

        dir[finalName] = {
            type,
            content: type === 'folder' ? {} : ''
        };
      }
      return newFs;
    });
  }, []);

  // 4. Update File Content (Save)
  const updateFileContent = useCallback((path: string[], content: string) => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      // Path usually includes the filename at the end for Notepad context, so we split
      const dirPath = path.slice(0, -1);
      const fileName = path[path.length - 1];
      
      const dir = getDir(newFs, dirPath);
      
      if (dir && dir[fileName]) {
        dir[fileName].content = content;
      }
      return newFs;
    });
  }, []);

  // 5. Reset File System
  const resetFileSystem = useCallback(() => {
    setFs(JSON.parse(JSON.stringify(INITIAL_FILE_SYSTEM)));
  }, []);

  const operations: FsOperations = {
    renameItem,
    deleteItem,
    createItem,
    updateFileContent,
    resetFileSystem
  };

  return { fs, setFs, operations };
};