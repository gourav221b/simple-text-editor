"use client";

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const metaMatches = !!shortcut.metaKey === event.metaKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      const altMatches = !!shortcut.altKey === event.altKey;

      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Common keyboard shortcuts
export const createCommonShortcuts = (actions: {
  newTab?: () => void;
  closeTab?: () => void;
  nextTab?: () => void;
  prevTab?: () => void;
  save?: () => void;
  find?: () => void;
  findGlobal?: () => void;
  toggleSidebar?: () => void;
  duplicateTab?: () => void;
  pinTab?: () => void;
}): KeyboardShortcut[] => [
  // Tab management
  {
    key: 't',
    ctrlKey: true,
    action: actions.newTab || (() => {}),
    description: 'New Tab',
  },
  {
    key: 'w',
    ctrlKey: true,
    action: actions.closeTab || (() => {}),
    description: 'Close Tab',
  },
  {
    key: 'Tab',
    ctrlKey: true,
    action: actions.nextTab || (() => {}),
    description: 'Next Tab',
  },
  {
    key: 'Tab',
    ctrlKey: true,
    shiftKey: true,
    action: actions.prevTab || (() => {}),
    description: 'Previous Tab',
  },
  
  // File operations
  {
    key: 's',
    ctrlKey: true,
    action: actions.save || (() => {}),
    description: 'Save File',
  },
  {
    key: 'd',
    ctrlKey: true,
    action: actions.duplicateTab || (() => {}),
    description: 'Duplicate Tab',
  },
  {
    key: 'p',
    ctrlKey: true,
    shiftKey: true,
    action: actions.pinTab || (() => {}),
    description: 'Pin/Unpin Tab',
  },
  
  // Search
  {
    key: 'f',
    ctrlKey: true,
    action: actions.find || (() => {}),
    description: 'Find in Current File',
  },
  {
    key: 'f',
    ctrlKey: true,
    shiftKey: true,
    action: actions.findGlobal || (() => {}),
    description: 'Find Across All Files',
  },
  
  // UI
  {
    key: 'b',
    ctrlKey: true,
    action: actions.toggleSidebar || (() => {}),
    description: 'Toggle Sidebar',
  },
  
  // Mac equivalents
  {
    key: 't',
    metaKey: true,
    action: actions.newTab || (() => {}),
    description: 'New Tab (Mac)',
  },
  {
    key: 'w',
    metaKey: true,
    action: actions.closeTab || (() => {}),
    description: 'Close Tab (Mac)',
  },
  {
    key: 'Tab',
    metaKey: true,
    action: actions.nextTab || (() => {}),
    description: 'Next Tab (Mac)',
  },
  {
    key: 'Tab',
    metaKey: true,
    shiftKey: true,
    action: actions.prevTab || (() => {}),
    description: 'Previous Tab (Mac)',
  },
  {
    key: 's',
    metaKey: true,
    action: actions.save || (() => {}),
    description: 'Save File (Mac)',
  },
  {
    key: 'd',
    metaKey: true,
    action: actions.duplicateTab || (() => {}),
    description: 'Duplicate Tab (Mac)',
  },
  {
    key: 'p',
    metaKey: true,
    shiftKey: true,
    action: actions.pinTab || (() => {}),
    description: 'Pin/Unpin Tab (Mac)',
  },
  {
    key: 'f',
    metaKey: true,
    action: actions.find || (() => {}),
    description: 'Find in Current File (Mac)',
  },
  {
    key: 'f',
    metaKey: true,
    shiftKey: true,
    action: actions.findGlobal || (() => {}),
    description: 'Find Across All Files (Mac)',
  },
  {
    key: 'b',
    metaKey: true,
    action: actions.toggleSidebar || (() => {}),
    description: 'Toggle Sidebar (Mac)',
  },
];

// Format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];
  
  if (shortcut.ctrlKey || shortcut.metaKey) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shiftKey) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.altKey) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  
  let key = shortcut.key;
  if (key === 'Tab') key = isMac ? '⇥' : 'Tab';
  else if (key === ' ') key = 'Space';
  else if (key.length === 1) key = key.toUpperCase();
  
  parts.push(key);
  
  return parts.join(isMac ? '' : '+');
}
