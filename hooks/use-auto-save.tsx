"use client";

import { useEffect, useRef, useCallback } from 'react';
import { db } from '@/config/db';

interface UseAutoSaveOptions {
  interval?: number; // Auto-save interval in milliseconds (default: 5 seconds)
  enabled?: boolean; // Whether auto-save is enabled (default: true)
  onSave?: (success: boolean) => void; // Callback when save occurs
  onError?: (error: Error) => void; // Callback when save fails
}

export function useAutoSave(
  editorId: number | null,
  content: string,
  options: UseAutoSaveOptions = {}
) {
  const {
    interval = 5000, // 5 seconds
    enabled = true,
    onSave,
    onError
  } = options;

  const lastSavedContent = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTime = useRef<number>(0);

  const saveContent = useCallback(async (force = false) => {
    if (!editorId || !enabled) return;

    // Don't save if content hasn't changed
    if (!force && content === lastSavedContent.current) return;

    // Don't save too frequently (minimum 1 second between saves)
    const now = Date.now();
    if (!force && now - lastSaveTime.current < 1000) return;

    try {
      await db.editors.update(editorId, {
        content,
        updatedAt: new Date()
      });

      lastSavedContent.current = content;
      lastSaveTime.current = now;
      onSave?.(true);
    } catch (error) {
      console.error('Auto-save failed:', error);
      onError?.(error as Error);
      onSave?.(false);
    }
  }, [editorId, content, enabled, onSave, onError]);

  // Set up auto-save interval
  useEffect(() => {
    if (!enabled || !editorId) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set up new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveContent();
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, interval, enabled, editorId, saveContent]);

  // Save when component unmounts or editor changes
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Force save on unmount
      if (editorId && content !== lastSavedContent.current) {
        saveContent(true);
      }
    };
  }, [editorId, content, saveContent]);

  // Manual save function
  const manualSave = useCallback(() => {
    return saveContent(true);
  }, [saveContent]);

  return {
    manualSave,
    lastSaveTime: lastSaveTime.current,
    isContentChanged: content !== lastSavedContent.current
  };
}

// Hook for managing auto-save settings
export function useAutoSaveSettings() {
  const getSettings = useCallback(() => {
    if (typeof window === 'undefined') return { enabled: true, interval: 5000 };

    const stored = localStorage.getItem('autoSaveSettings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { enabled: true, interval: 5000 };
      }
    }
    return { enabled: true, interval: 5000 };
  }, []);

  const saveSettings = useCallback((settings: { enabled: boolean; interval: number }) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('autoSaveSettings', JSON.stringify(settings));
  }, []);

  return { getSettings, saveSettings };
}
